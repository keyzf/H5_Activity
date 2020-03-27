package com.ningxun.ets.dto;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class SaveShareRecordReqDTO {
	
	@NotEmpty(message = "openId不能为空")
	@Size(max = 255, message = "openId请控制在255个字符以下")
	private String openId;
	
	@NotEmpty(message = "昵称不能为空")
	@Size(max = 25, message = "昵称请控制在25个字符以下")
	private String nickName;

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
}
