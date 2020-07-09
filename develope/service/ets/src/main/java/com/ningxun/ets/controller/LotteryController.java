package com.ningxun.ets.controller;

import com.ningxun.ets.dto.LogPointReqDTO;
import com.ningxun.ets.dto.LotteryRecordsReqDTO;
import com.ningxun.ets.dto.LotteryReqDTO;
import com.ningxun.ets.entity.Result;
import com.ningxun.ets.entity.ResultEnum;
import com.ningxun.ets.handler.ResultHandler;
import com.ningxun.ets.service.LotteryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/lottery")
@CrossOrigin(origins = "*")
public class LotteryController {
    @Autowired
    LotteryService lotteryService;

    @PostMapping("/inquire")
    public Result inquireLotteryNum(@RequestBody @Valid LotteryReqDTO req, BindingResult bindingResult) throws Exception {
        if (bindingResult.hasErrors()) {
            return ResultHandler.result(ResultEnum.PARAM_ERROR.getCode(),
                    bindingResult.getAllErrors().get(0).getDefaultMessage(), null);
        }
        if (!lotteryService.whetherActivityTime()) {
            return ResultHandler.result(-1, "不在活动期间内", null);
        }
        return ResultHandler.result(lotteryService.inquireLotteryNum(req));
    }

    @PostMapping("/share")
    public Result shareLottery(@RequestBody @Valid LotteryReqDTO req, BindingResult bindingResult) throws Exception {
        if (bindingResult.hasErrors()) {
            return ResultHandler.result(ResultEnum.PARAM_ERROR.getCode(),
                    bindingResult.getAllErrors().get(0).getDefaultMessage(), null);
        }
        if (!lotteryService.whetherActivityTime()) {
            return ResultHandler.result(-1, "不在活动期间内", null);
        }
        return ResultHandler.result(lotteryService.shareLottery(req));
    }

    @PostMapping("/lottery")
    public Result lottery(@RequestBody @Valid LotteryReqDTO req, BindingResult bindingResult) throws Exception {
        if (!lotteryService.whetherActivityTime()) {
            return ResultHandler.result(-1, "不在活动期间内", null);
        }
        if (bindingResult.hasErrors()) {
            return ResultHandler.result(ResultEnum.PARAM_ERROR.getCode(),
                    bindingResult.getAllErrors().get(0).getDefaultMessage(), null);
        }
        return ResultHandler.result(lotteryService.lottery(req));
    }

    @PostMapping("/log")
    public Result logPointInfo(@RequestBody @Valid LogPointReqDTO logPointReqDTO, BindingResult bindingResult) throws Exception {
        if (!lotteryService.whetherActivityTime()) {
            return ResultHandler.result(-1, "不在活动期间内", null);
        }
        if (bindingResult.hasErrors()) {
            return ResultHandler.result(ResultEnum.PARAM_ERROR.getCode(),
                    bindingResult.getAllErrors().get(0).getDefaultMessage(), null);
        }
        lotteryService.logPointInfo(logPointReqDTO);
        return ResultHandler.result();
    }

    @PostMapping("/list")
    public Result listPrizeRecords(@RequestBody @Valid LotteryRecordsReqDTO req, BindingResult bindingResult) throws Exception {
        if (bindingResult.hasErrors()) {
            return ResultHandler.result(ResultEnum.PARAM_ERROR.getCode(),
                    bindingResult.getAllErrors().get(0).getDefaultMessage(), null);
        }
        return ResultHandler.result(lotteryService.listPrizeRecords(req));
    }

    @PostMapping("/add_times")
    public Result addLotteryTimes(@RequestBody @Valid LotteryReqDTO req, BindingResult bindingResult) throws Exception {
        if (bindingResult.hasErrors()) {
            return ResultHandler.result(ResultEnum.PARAM_ERROR.getCode(),
                    bindingResult.getAllErrors().get(0).getDefaultMessage(), null);
        }
        if (!lotteryService.whetherActivityTime()) {
            return ResultHandler.result(-1, "不在活动期间内", null);
        }
        return ResultHandler.result(lotteryService.addLotteryTimes(req));
    }
}
