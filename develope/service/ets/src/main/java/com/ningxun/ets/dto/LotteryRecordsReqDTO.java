package com.ningxun.ets.dto;

import javax.validation.constraints.NotNull;

public class LotteryRecordsReqDTO {
    @NotNull(message = "页码不能为空")
    private Integer pageNo;

    @NotNull(message = "页容量不能为空")
    private Integer pageSize;

    private String guid;

    public Integer getPageNo() {
        return pageNo;
    }

    public void setPageNo(Integer pageNo) {
        this.pageNo = pageNo;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }
}
