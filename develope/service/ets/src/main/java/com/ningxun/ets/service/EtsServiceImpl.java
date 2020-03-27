package com.ningxun.ets.service;

import java.sql.Timestamp;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ningxun.ets.dao.ShareRecordDAO;
import com.ningxun.ets.dao.WechatUserinfoDAO;
import com.ningxun.ets.dto.SaveShareRecordReqDTO;
import com.ningxun.ets.dto.ShareRecordReqDTO;
import com.ningxun.ets.entity.ShareRecordEntity;
import com.ningxun.ets.entity.WechatUserinfoEntity;
import com.ningxun.ets.manager.WechatManager;

@Service
public class EtsServiceImpl implements EtsService {
	@Autowired
	private WechatUserinfoDAO wechatUserinfoDAO;
	@Autowired
	private ShareRecordDAO shareRecordDAO;
	@Autowired
	private WechatManager wechatManager;

	@Override
	public JSONObject getOpenId(String code) {
		JSONObject resultJson = new JSONObject();
		JSONObject tokenJson = wechatManager.tokenByCode(code);
		if (!tokenJson.containsKey("errcode")) {
			JSONObject userJson = wechatManager.obtainUserinfo(tokenJson.getString("openid"),
					tokenJson.getString("access_token"));
			if (!userJson.containsKey("errcode")) {
				WechatUserinfoEntity wechatUserinfoEntity = wechatUserinfoDAO
						.findByOpenId(userJson.getString("openid"));
				if (null != wechatUserinfoEntity) {
					wechatUserinfoEntity.setNickName(userJson.getString("nickname"));
					wechatUserinfoEntity.setHeadImgUrl(userJson.getString("headimgurl"));
				} else {
					wechatUserinfoEntity = new WechatUserinfoEntity();
					wechatUserinfoEntity.setOpenId(userJson.getString("openid"));
					wechatUserinfoEntity.setNickName(userJson.getString("nickname"));
					wechatUserinfoEntity.setHeadImgUrl(userJson.getString("headimgurl"));
					wechatUserinfoEntity.setDeleteState(0);
				}
				wechatUserinfoDAO.save(wechatUserinfoEntity);
				resultJson.put("nickName", userJson.getString("nickname"));
			}
			resultJson.put("openId", tokenJson.getString("openid"));
		}
		return resultJson;
	}

	@Override
	public ShareRecordEntity saveShareRecord(SaveShareRecordReqDTO req) {
		ShareRecordEntity shareRecordEntity = new ShareRecordEntity();
		shareRecordEntity.setOpenId(req.getOpenId());
		shareRecordEntity.setNickName(req.getNickName());
		shareRecordEntity.setShareTime(new Timestamp(System.currentTimeMillis()));
		shareRecordEntity.setDeleteState(0);
		return shareRecordDAO.save(shareRecordEntity);
	}

	@Override
	public Page<Map<String, Object>> getShareRecores(ShareRecordReqDTO req) {
		Pageable pageable = PageRequest.of(req.getPageNo() - 1, req.getPageSize());
		return shareRecordDAO.findShareRecordList(pageable);
	}

	@Override
	public JSONObject findShareRecordNumbers(String openId) {
		JSONObject result = new JSONObject();
		result.put("allNumbers", shareRecordDAO.findAllNumbers());
		result.put("personalNumbers", shareRecordDAO.findPersonalNumbers(openId));
		return result;
	}

}
