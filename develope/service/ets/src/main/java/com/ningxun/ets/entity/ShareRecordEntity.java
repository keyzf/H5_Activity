package com.ningxun.ets.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name = "share_record")
public class ShareRecordEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "open_id", length = 255)
	private String openId;

	@Column(name = "nick_name", length = 25)
	private String nickName;

	@Column(name = "share_time")
	private Timestamp shareTime;

	@Column(name = "delete_state", length = 1)
	private int deleteState;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public Timestamp getShareTime() {
		return shareTime;
	}

	public void setShareTime(Timestamp shareTime) {
		this.shareTime = shareTime;
	}

	public int getDeleteState() {
		return deleteState;
	}

	public void setDeleteState(int deleteState) {
		this.deleteState = deleteState;
	}

}
