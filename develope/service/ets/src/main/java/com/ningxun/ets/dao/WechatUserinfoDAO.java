package com.ningxun.ets.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ningxun.ets.entity.WechatUserinfoEntity;

public interface WechatUserinfoDAO extends JpaRepository<WechatUserinfoEntity, Long> {

	WechatUserinfoEntity findByOpenId(String openId);
	
}
