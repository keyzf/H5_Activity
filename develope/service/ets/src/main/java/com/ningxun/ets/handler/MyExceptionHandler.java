package com.ningxun.ets.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ningxun.ets.entity.Result;
import com.ningxun.ets.entity.ResultEnum;

@ControllerAdvice
public class MyExceptionHandler {
	private static final Logger log = LoggerFactory.getLogger(MyExceptionHandler.class);

	@ExceptionHandler(value = Exception.class)
	public Result<?> userVlidata(Exception e) {
		log.error(e.toString());
		return ResultHandler.result(ResultEnum.UNKNOWN_EXCEPTION.getCode(), e.getMessage(), null);
	}

}
