package com.ningxun.ets.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class LogPointReqDTO {
    @NotBlank(message = "用户guid不能为空")
    private String guid;

    @NotNull(message = "来源不能为空")
    private Integer source;

    @NotNull(message = "用户埋点类型不能为空，0")
    private Integer type;

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getSource() {
        return source;
    }

    public void setSource(Integer source) {
        this.source = source;
    }
}
