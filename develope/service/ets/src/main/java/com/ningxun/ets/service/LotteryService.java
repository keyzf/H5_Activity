package com.ningxun.ets.service;

import com.alibaba.fastjson.JSONObject;
import com.ningxun.ets.dto.LogPointReqDTO;
import com.ningxun.ets.dto.LotteryRecordsReqDTO;
import com.ningxun.ets.dto.LotteryReqDTO;

import java.util.List;
import java.util.Map;

public interface LotteryService {

    JSONObject inquireLotteryNum(LotteryReqDTO req);

    JSONObject shareLottery(LotteryReqDTO req);

    JSONObject lottery(LotteryReqDTO req);

    boolean whetherActivityTime() throws Exception;

    void logPointInfo(LogPointReqDTO logPointReqDTO);

    List<Map<String, Object>> listPrizeRecords(LotteryRecordsReqDTO req);
}
