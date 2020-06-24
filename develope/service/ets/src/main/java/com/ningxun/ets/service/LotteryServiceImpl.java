package com.ningxun.ets.service;

import com.alibaba.fastjson.JSONObject;
import com.ningxun.ets.dto.LogPointReqDTO;
import com.ningxun.ets.dto.LotteryRecordsReqDTO;
import com.ningxun.ets.dto.LotteryReqDTO;
import com.ningxun.ets.entity.ActivityLogEntity;
import com.ningxun.ets.entity.PrizeCodeEntity;
import com.ningxun.ets.entity.PrizeEntity;
import com.ningxun.ets.manager.ActivityLogManager;
import com.ningxun.ets.manager.LotteryManager;
import com.ningxun.ets.manager.PrizeManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@Service
public class LotteryServiceImpl implements LotteryService {
    @Autowired
    LotteryManager lotteryManager;
    @Autowired
    PrizeManager prizeManager;
    @Autowired
    ActivityLogManager activityLogManager;

    @Override
    public JSONObject inquireLotteryNum(LotteryReqDTO req) {

        JSONObject resultJson = new JSONObject();
        String guid = req.getGuid();
        //今天第一次登录  +一次抽奖次数
        Integer loginNum = lotteryManager.whetherTodayLogin(guid, 0);
        if (null == loginNum || loginNum == 0) {//没有登录抽奖次数，添加
            lotteryManager.save(guid, 0, 0);
        }

        resultJson.put("lotteryNum", lotteryManager.countByGuidAndState(guid, 0));
        resultJson.put("whetherShare", lotteryManager.whetherShareToday(guid));
        //返回抽奖次数
        return resultJson;
    }

    @Override
    public JSONObject shareLottery(LotteryReqDTO req) {
        JSONObject resultJson = new JSONObject();
        String guid = req.getGuid();
        if (!lotteryManager.whetherShareToday(guid)) {
            resultJson.put("code", 0);
            resultJson.put("msg", "分享成功");
            lotteryManager.save(guid, 1, 0);
        } else {
            resultJson.put("code", 1);
            resultJson.put("msg", "今日已分享");
        }
        resultJson.put("lotteryNum", lotteryManager.countByGuidAndState(guid, 0));
        return resultJson;
    }

    @Transactional
    @Override
    public JSONObject lottery(LotteryReqDTO req) {
        JSONObject resultJson = new JSONObject();
        String guid = req.getGuid();
        String token = req.getToken();
        String userName = req.getUserName();
        Integer resultIndex = 0;
        Integer lotteryNum = lotteryManager.countByGuidAndState(guid, 0);
        if (null != lotteryNum && lotteryNum > 0) {
            boolean mark = true;
            while (mark) {
                List<PrizeEntity> prizeEntityList = prizeManager.findSurplusPriZeList();
                int index = lotteryManager.lottery(prizeEntityList);
                PrizeEntity prizeEntity = prizeEntityList.get(index);
                resultIndex = prizeEntity.getPrizeIndex();
                resultJson.put("code", 0);
                resultJson.put("resultIndex", resultIndex);
                if (prizeEntity.getState() == 0) {//奖品
                    PrizeCodeEntity prizeCodeEntity = prizeManager.findOneByPrizeId(prizeEntity.getId());
                    prizeCodeEntity.setState(1);
                    if (null != prizeManager.savePrizeCode(prizeCodeEntity) && lotteryManager.convertCoupon(guid, token, prizeCodeEntity.getCouponCode()).getInteger("code") == 0) {//修改兑换码状态
                        lotteryManager.updateStateByGuid(guid, prizeEntity.getId(), prizeCodeEntity.getCouponCode(), userName);
                        mark = false;
                    }
                } else {//谢谢回顾
                    lotteryManager.updateStateByGuid(guid, prizeEntity.getId(), null, userName);
                    mark = false;
                }
            }
        } else {
            resultJson.put("code", 1);
            resultJson.put("msg", "无抽奖次数了");
        }
        resultJson.put("lotteryNum", lotteryManager.countByGuidAndState(guid, 0));
        return resultJson;
    }

    @Override
    public boolean whetherActivityTime() throws Exception {
        return lotteryManager.whetherActivityTime();
    }

    @Override
    public void logPointInfo(LogPointReqDTO req) {
        if (req.getType() == 1 && activityLogManager.whetherLogToday(req.getGuid(), req.getSource(), req.getType())) {

        } else {
            ActivityLogEntity activityLogEntity = new ActivityLogEntity();
            activityLogEntity.setGuid(req.getGuid());
            activityLogEntity.setSource(req.getSource());
            activityLogEntity.setLogType(req.getType());
            activityLogEntity.setCreateTime(new Timestamp(System.currentTimeMillis()));
            activityLogManager.save(activityLogEntity);
        }
    }

    @Override
    public List<Map<String, Object>> listPrizeRecords(LotteryRecordsReqDTO req) {
        Pageable pageable = PageRequest.of(req.getPageNo() - 1, req.getPageSize());
        if (StringUtils.isEmpty(req.getGuid())) {
            return lotteryManager.listPrizes(pageable).getContent();
        } else {
            return lotteryManager.listMinePrizes(req.getGuid(), pageable).getContent();
        }
    }

}
