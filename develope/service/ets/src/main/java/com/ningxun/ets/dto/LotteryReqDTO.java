package com.ningxun.ets.dto;

import javax.validation.constraints.NotNull;

public class LotteryReqDTO {
    @NotNull(message = "guid不能为空")
    private String guid;

    private String token;

    private String userName;

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
