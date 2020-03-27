package com.ningxun.ets.service;

import java.util.Map;

import org.springframework.data.domain.Page;

import com.alibaba.fastjson.JSONObject;
import com.ningxun.ets.dto.SaveShareRecordReqDTO;
import com.ningxun.ets.dto.ShareRecordReqDTO;
import com.ningxun.ets.entity.ShareRecordEntity;

public interface EtsService {
	
	JSONObject getOpenId(String code);

	ShareRecordEntity saveShareRecord(SaveShareRecordReqDTO req);

	Page<Map<String, Object>> getShareRecores(ShareRecordReqDTO req);

	JSONObject findShareRecordNumbers(String openId);
	
}
