package com.ningxun.ets.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

@Entity(name = "lottery_record")
public class LotteryRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "guid")
    private String guid;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "lottery_type")
    private Integer lotteryType;//0登录，1分享，2app下单,3微信下单,4关注

    @Column(name = "order_id")
    private String orderId;//下单时传,一个订单只能添加两次抽奖次数

    @Column(name = "state")
    private Integer state;

    @Column(name = "prize_id")
    private Integer prizeId;

    @Column(name = "prize_code")
    private String  prizeCode;

    @Column(name = "create_time")
    private Timestamp createTime;

    @Column(name = "lottery_time")
    private Timestamp lotteryTime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getLotteryType() {
        return lotteryType;
    }

    public void setLotteryType(Integer lotteryType) {
        this.lotteryType = lotteryType;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public Integer getPrizeId() {
        return prizeId;
    }

    public void setPrizeId(Integer prizeId) {
        this.prizeId = prizeId;
    }

    public String getPrizeCode() {
        return prizeCode;
    }

    public void setPrizeCode(String prizeCode) {
        this.prizeCode = prizeCode;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Timestamp getLotteryTime() {
        return lotteryTime;
    }

    public void setLotteryTime(Timestamp lotteryTime) {
        this.lotteryTime = lotteryTime;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
}
