package com.ningxun.ets.handler;

import com.ningxun.ets.entity.Result;
import com.ningxun.ets.entity.ResultEnum;

public class ResultHandler {

	public static Result result() {
		return new Result(ResultEnum.RESULT.getCode(), ResultEnum.RESULT.getMsg(), null);
	}

	public static Result result(Object res) {
		return new Result(ResultEnum.RESULT.getCode(), ResultEnum.RESULT.getMsg(), res);
	}

	public static Result result(int code, String msg, Object res) {
		return new Result(code, msg, res);
	}
}
