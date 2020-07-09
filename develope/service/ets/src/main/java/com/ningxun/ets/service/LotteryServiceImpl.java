package com.ningxun.ets.service;

import com.alibaba.fastjson.JSONObject;
import com.ningxun.ets.dto.LogPointReqDTO;
import com.ningxun.ets.dto.LotteryRecordsReqDTO;
import com.ningxun.ets.dto.LotteryReqDTO;
import com.ningxun.ets.entity.ActivityLogEntity;
import com.ningxun.ets.entity.LotteryRecordEntity;
import com.ningxun.ets.entity.PrizeCodeEntity;
import com.ningxun.ets.entity.PrizeEntity;
import com.ningxun.ets.manager.ActivityLogManager;
import com.ningxun.ets.manager.LotteryManager;
import com.ningxun.ets.manager.PrizeManager;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.util.ArrayList;
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
                    // && lotteryManager.convertCoupon(guid, token, prizeCodeEntity.getCouponCode()).getInteger("code") == 0
                    if (null != prizeManager.savePrizeCode(prizeCodeEntity)) {//修改兑换码状态
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

    @Override
    public JSONObject addLotteryTimes(LotteryReqDTO req) {
        JSONObject resultJson = new JSONObject();

        LotteryRecordEntity lotteryRecordEntity = new LotteryRecordEntity();
        lotteryRecordEntity.setLotteryType(req.getLotteryType());
        lotteryRecordEntity.setState(0);
        lotteryRecordEntity.setGuid(req.getGuid());
        lotteryRecordEntity.setCreateTime(new Timestamp(System.currentTimeMillis()));

        if (req.getLotteryType() == 2 || req.getLotteryType() == 3) {//app下单，微信下单
            if (StringUtils.isEmpty(req.getOrderId())) {
                resultJson.put("code", -1);
                resultJson.put("msg", "订单号不能为空");
                return resultJson;
            } else {
                lotteryRecordEntity.setOrderId(req.getOrderId());
            }
            Integer orderNum = lotteryManager.countByGuidAndOrderId(req.getGuid(), req.getOrderId());
            if (null != orderNum && orderNum > 0) {
                resultJson.put("code", -1);
                resultJson.put("msg", "该订单号已添加抽奖次数");
                return resultJson;
            }
        } else if (req.getLotteryType() == 4) {//关注

        } else {
            resultJson.put("code", -1);
            resultJson.put("msg", "请传入正确类型");
            return resultJson;
        }

        List<LotteryRecordEntity> list = new ArrayList<>();
        LotteryRecordEntity lotteryRecordEntity1 = new LotteryRecordEntity();
        BeanUtils.copyProperties(lotteryRecordEntity,lotteryRecordEntity1);
        list.add(lotteryRecordEntity);
        list.add(lotteryRecordEntity1);
        if (null != lotteryManager.saveAll(list)) {
            resultJson.put("code", 0);
            resultJson.put("lotteryNum", lotteryManager.countByGuidAndState(req.getGuid(), 0));
            resultJson.put("msg", "添加成功");
        } else {
            resultJson.put("code", -1);
            resultJson.put("msg", "添加失败");
        }
        return resultJson;
    }

}
