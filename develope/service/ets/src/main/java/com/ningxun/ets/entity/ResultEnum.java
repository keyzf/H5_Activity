package com.ningxun.ets.entity;

public enum ResultEnum {

	UNKNOWN_EXCEPTION(-1, "unknown exception."),
	RESULT(0, "success"),
	PARAM_NULL(10001, "param %s is null."),
	PARAM_INVALID(10002, "param %s value %s is invalid."),
	PARAM_ERROR(10003, "parameter does not conform to the specification"),

	@Deprecated
	SUCCESS(200,"SUCCESS"),
	@Deprecated
	EXCEPTION(500, "ERROR"),
	@Deprecated
	VALIDATION(101,"VALIDATION");
	
	private int code;
	private String msg;
	
	ResultEnum(int code, String msg) {
		this.code = code;
		this.msg = msg;
	}

	public int getCode() {
		return code;
	}

	public String getMsg() {
		return msg;
	}
	
}
