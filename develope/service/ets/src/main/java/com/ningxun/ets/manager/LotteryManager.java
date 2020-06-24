package com.ningxun.ets.manager;

import com.alibaba.fastjson.JSONObject;
import com.ningxun.ets.dao.LotteryRecordDAO;
import com.ningxun.ets.entity.LotteryRecordEntity;
import com.ningxun.ets.entity.PrizeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class LotteryManager {
    @Autowired
    LotteryRecordDAO lotteryRecordDAO;
    @Autowired
    RestTemplate restTemplate;

    public boolean whetherActivityTime() throws Exception {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Calendar now = Calendar.getInstance();

        Calendar start = Calendar.getInstance();
        Date startDate = sdf.parse("2020-06-10 00:00:00");
        start.setTime(startDate);

        Calendar end = Calendar.getInstance();
        Date endDate = sdf.parse("2020-06-28 00:00:00");
        end.setTime(endDate);

        return now.after(start) && now.before(end);
    }

    public Integer countByGuidAndLotteryType(String guid, Integer lotteryType) {
        return lotteryRecordDAO.countByGuidAndLotteryType(guid, lotteryType);
    }

    public Integer whetherTodayLogin(String guid, Integer lotteryType) {
        return lotteryRecordDAO.countTodayShareByGuidAndType(guid, lotteryType);
    }

    public Integer countByGuidAndState(String guid, Integer state) {
        return lotteryRecordDAO.countByGuidAndState(guid, state);
    }

    public LotteryRecordEntity save(String guid, Integer lotteryType, Integer state) {
        LotteryRecordEntity lotteryRecordEntity = new LotteryRecordEntity();
        lotteryRecordEntity.setGuid(guid);
        lotteryRecordEntity.setLotteryType(lotteryType);
        lotteryRecordEntity.setState(0);
        lotteryRecordEntity.setCreateTime(new Timestamp(System.currentTimeMillis()));
        return lotteryRecordDAO.save(lotteryRecordEntity);
    }

    public boolean whetherShareToday(String guid) {
        List<LotteryRecordEntity> list = lotteryRecordDAO.findTodayShare(guid);
        if (null != list && list.size() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public Integer lottery(List<PrizeEntity> prizeEntityList) {
        if (null == prizeEntityList && prizeEntityList.size() > 0) {
            return -1;
        }
        List<Double> probabilityList = prizeEntityList.stream().map(PrizeEntity::getProbability).collect(Collectors.toList());
        double sumRate = probabilityList.stream().collect(Collectors.summingDouble(value -> value));

        List<Double> sortList = new ArrayList<>();
        double temSumRate = 0;
        for (int i = 0, size = probabilityList.size(); i < size; i++) {
            temSumRate += probabilityList.get(i);
            sortList.add(temSumRate / sumRate);
        }
        double randomNum = Math.random();
        sortList.add(randomNum);
        Collections.sort(sortList);
        return sortList.indexOf(randomNum);
    }

    public Integer updateStateByGuid(String guid, Integer prizeId, String prizeCode, String userName) {
        return lotteryRecordDAO.updateStateByGuid(guid, prizeId, prizeCode, userName);
    }

    public JSONObject convertCoupon(String guid, String token, String code) {
        long timestamp = System.currentTimeMillis();
        JSONObject dataJson = new JSONObject(true);
        dataJson.put("apitoken", timestamp);
        dataJson.put("exchange", code);
        dataJson.put("guid", guid);
        dataJson.put("nonce", timestamp);
        String beforeSign = "";
        for (String key : dataJson.keySet()) {
            if (null != dataJson.get(key)) {
                beforeSign += "&" + key + "=" + dataJson.get(key);
            }
        }
        String jm = "/user/couponExchange" + "?token=" + token + beforeSign;
        dataJson.put("sign", DigestUtils.md5DigestAsHex(jm.getBytes()));

        HttpHeaders headers = new HttpHeaders();
        headers.add("MVer", "20041501");
        headers.add("AppCode", "WXMall");
        headers.add("content-type", "application/json");
        headers.add("dtype", "WX");
        HttpEntity<String> httpEntity = new HttpEntity<String>(headers);

        ResponseEntity<JSONObject> response = restTemplate.exchange("https://www.holdsoft.cn/mall/user/couponExchange?exchange={exchange}&guid={guid}&nonce={nonce}&apitoken={apitoken}&sign={sign}", HttpMethod.GET, httpEntity, JSONObject.class, dataJson);
        return response.getBody();
    }

    public Page<Map<String, Object>> listMinePrizes(String guid, Pageable pageable) {
        return lotteryRecordDAO.listMinePrizes(guid, pageable);
    }

    public Page<Map<String, Object>> listPrizes(Pageable pageable) {
        return lotteryRecordDAO.listPrizes(pageable);
    }
}
