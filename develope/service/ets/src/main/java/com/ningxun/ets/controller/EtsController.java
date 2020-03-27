package com.ningxun.ets.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ningxun.ets.dto.SaveShareRecordReqDTO;
import com.ningxun.ets.dto.ShareRecordReqDTO;
import com.ningxun.ets.entity.Result;
import com.ningxun.ets.entity.ResultEnum;
import com.ningxun.ets.handler.ResultHandler;
import com.ningxun.ets.service.EtsService;

@RestController
@RequestMapping("/ets")
@CrossOrigin(origins = "*")
public class EtsController {
	@Autowired
	private EtsService etsService;

	@PostMapping("/openid_by_code")
	public Result<?> getOpenIdByCode(@RequestBody String req) {
		JSONObject param = JSONObject.parseObject(req);
		String code = param.getString("code");
		return ResultHandler.result(etsService.getOpenId(code));
	}

	@PostMapping("/share/save")
	public Result<?> saveShareRecord(@RequestBody @Valid SaveShareRecordReqDTO req, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			return ResultHandler.result(ResultEnum.PARAM_ERROR.getCode(),
					bindingResult.getAllErrors().get(0).getDefaultMessage(), null);
		}
		return ResultHandler.result(etsService.saveShareRecord(req));
	}

	@PostMapping("/share/list")
	public Result<?> findShareRecordList(@RequestBody ShareRecordReqDTO req) {
		return ResultHandler.result(etsService.getShareRecores(req));
	}

	@PostMapping("/share/count")
	public Result<?> findShareRecordNumbers(@RequestBody String req) {
		JSONObject param = JSONObject.parseObject(req);
		String openId = param.getString("openId");
		return ResultHandler.result(etsService.findShareRecordNumbers(openId));
	}

}
