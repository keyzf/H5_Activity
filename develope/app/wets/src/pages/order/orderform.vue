<template>
    <view>
        <view class="goods-section">
            <view class="g-item">
                <image :src="refundForm.orderinfo.picurl"></image>
                <view class="right">
                    <text class="title clamp">{{ refundForm.orderinfo.productname }}</text>
                    <text class="spec">{{ refundForm.orderinfo.attributeshow }}</text>
                    <!-- <view class="price-box">
                        <text class="price">￥17.8</text>
                        <text class="number">x 1</text>
                    </view> -->
                </view>
            </view>
        </view>

        <!-- 金额明细 -->
        <view class="yt-list">
            <view class="uni-list">
                <view class="record">{{refundForm.goodssattetitle}}</view>
                <radio-group @change="radioChange">
                    <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in refundForm.goodssattelist" :key="index">
                        <view class="optin">{{ item.content }}</view>
                        <view><radio :checked="item.isdefault == 1" :value="'goodsstate_' + item.goodssatte" /></view>
                    </label>
                </radio-group>
            </view>
        </view>
        <view class="yt-list">
            <view class="uni-list">
                <view class="record">{{ refundForm.refundreasontitle }}</view>
                <radio-group @change="radioChange">
                    <label class="uni-list-cell" v-for="(item, index) in (refundtype == 0 ? refundForm.refundreasonlist : refundForm.refundreasonlistother)" :key="index">
                        <view class="optin">{{ item.content }}</view>
                        <view><radio :checked="item.isdefault == 1" :value="'refundreason_' + item.refundreason" /></view>
                    </label>
                </radio-group>
            </view>
        </view>
        <!-- 金额明细 -->
        <view class="yt-list">
            <view class="yt-list-cell b-b">
                <text class="cell-tit clamp">{{ refundForm.refundnumtitle }}</text>
                <input class="desc" type="number" :placeholder="refundForm.maxrefundnumstr" v-model="refundForm.maxrefundnum" placeholder-class="placeholder" />
            </view>
            <view class="yt-list-cell b-b">
                <text class="cell-tit clamp">{{ refundForm.refundexplain }}</text>
                <input class="desc" type="text" placeholder="请填写备注信息" v-model="memo" placeholder-class="placeholder" />
            </view>
        </view>
        <view class="photos">
            <view class="titles">上传照片</view>
            <view class="photos-list">
                <view v-show="pics.length > 0" v-for="(item, index) in pics" :key="index" @click="previewImg(index)">
                    <text class="delimg del-btn yticon icon-fork" @click.stop="deleteImg(index)"></text>
                    <image :src="item" mode=""></image>
                </view>
                <view v-show="pics.length < 3" class="add" @click.stop="uploadImg"></view>
            </view>
        </view>
        <view class="footer">
            <text class="submit" @click="submitRefund">提交</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
			refundForm: {
				goodssattelist: [{
					content: "未收到货",
					goodssatte: 1,
					isdefault: 1
				}],
				goodssattetitle: '',
				maxrefundnum: 0,
				maxrefundnumstr: '最多退0件',
				orderinfo: {
					picurl: ''
				},
				refundexplain: '退货说明(选填)',
				refundnumtitle: '退货数量',
				refundreasonlist: [{
					content: "多拍/拍错/不想要",
					isdefault: 1,
					refundreason: 3
				}],
				refundreasonlistother: [{
					content: "卖家发错货",
					isdefault: 0,
					refundreason: 4
				}],
				refundreasontitle: '退货原因',
				refundtype: 0,
				uploadimage: '上传图片(最多3张)'
			},
			bopid: 0,
			refundtype: 0,
			memo: '',
			goodsstate: 0,
			refundreason: 0,
            pics: [],
            submitState: true
        };
    },
    onLoad(options) {
		this.bopid = options.bopid;
		this.refundtype = options.refundtype;
		this.getRefundForm();
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    methods: {
        radioChange: function(evt) {
			console.log(evt.target.value);
			let value = evt.target.value.toString();
			if (value.indexOf('refundreason_') == 0) {
				// 退货原因
				this.refundreason = value.split("_")[1];
			} else {
				this.goodsstate = value.split("_")[1];
			}
        },
		// 获取退款表单详情
		getRefundForm() {
			this.$ajax.get('order/choserefundtype', {refundtype: this.refundtype, bopid: this.bopid}).then(res => {
				console.log(res);
				if (res.data.code == 0) {
					this.refundForm = res.data.result.data;
                    this.refundForm.goodssattelist.forEach(item => {
                        if (item.isdefault == 1) {
                            this.goodsstate = item.goodssatte;
                        }
                    });
                    let list = this.refundtype == 0 ? this.refundForm.refundreasonlist : this.refundForm.refundreasonlistother;
                    list.forEach(item => {
                        if (item.isdefault == 1) {
                            this.refundreason = item.refundreason;
                        }
                    });
				} else {
					this.$api.msg(res.data.msg);
				}
			});
		},
		// 提交退款信息
		submitRefund() {
            if (!this.submitState) {
                return;
            }
            if (!this.refundForm.maxrefundnum || this.refundForm.maxrefundnum == 0) {
                this.$api.msg('请输入退货数量');
                return;
            }
            this.submitState = false;
			this.$ajax.get('order/subrefundinfo', {
				bopid: this.bopid,
				refundnum: this.refundForm.maxrefundnum,
				refundtype: this.refundtype,
				goodssatte: this.goodsstate,
				refundreason: this.refundreason,
				picurl: this.pics.length == 0 ? '' : this.pics.join(','),
				memo: this.memo
			}).then(res => {
				console.log(res);
				if (res.data.code == 0) {
					this.$api.msg('提交申请成功');
                    this.$api.prePage().getApplyrefund();
					setTimeout(function() {
						uni.navigateBack();
					}, 800);
				} else {
					this.$api.msg(res.data.msg);
				}
			});
		},
        // 上传图片
        uploadImg() {
            if (this.$wx.isWechat()) {
                this.$wx.upload(1).then(res => {
                    if (res.data.code == 0) {
                        if (this.pics.length < 3 && res.data.result.data.url.length > 0) {
                            this.pics.push(res.data.result.data.url);
                        }
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            }
        },
        // 预览图片
        previewImg(index) {
            uni.previewImage({
                current: index,
                urls: this.pics
            });
        },
        // 删除图片
        deleteImg(index) {
            this.pics.splice(index, 1);
            this.$forceUpdate();
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
    padding-bottom: 100upx;
}
.photos {
    margin-top: 20rpx;
    background: #ffffff;
    padding: 20rpx 30upx;
    .titles {
        font-size: 28rpx;
    }
    .photos-list {
        display: flex;
        align-items: center;
        view {
            width: 160rpx;
            height: 160rpx;
            position: relative;
            margin: 20rpx;
            image {
                width: 160rpx;
                height: 160rpx;
            }
            text {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 1;
            }
            &.add {
                background: url(../../static/upimg.png) no-repeat center;
                background-size: 80rpx 80rpx;
                border: 1px solid #DDD;
                border-radius: 10rpx;
            }
        }
    }
}
.uni-list-cell {
    display: flex;
    align-items: center;
    padding: 20rpx 30upx;
    border-bottom: 1px solid #e4e7ed;
    .optin {
        flex-grow: 1;
        font-size: 28rpx;
    }
}
.record {
    padding: 30upx;
    border-bottom: 1px solid #e4e7ed;
}
.address-section {
    padding: 30upx;
    background: #fff;
    position: relative;

    .order-content {
        display: flex;
        align-items: center;
        .yticon {
            min-width: 40rpx;
        }
    }

    .icon-shouhuodizhi {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90upx;
        color: #888;
        font-size: 44upx;
    }

    .cen {
        display: flex;
        flex-direction: column;
        flex: 1;
        font-size: 28upx;
        color: $font-color-dark;
    }

    .name {
        font-size: 34upx;
        margin-right: 24upx;
    }

    .address {
        margin-top: 16upx;
        margin-right: 20upx;
        color: $font-color-light;
    }

    .icon-you {
        font-size: 32upx;
        color: $font-color-light;
        margin-right: 30upx;
    }

    .a-bg {
        position: absolute;
        left: 0;
        bottom: 0;
        display: block;
        width: 100%;
        height: 5upx;
    }
}
.goods-section {
    margin-top: 16upx;
    background: #fff;
    padding-bottom: 1px;

    .g-header {
        display: flex;
        align-items: center;
        height: 84upx;
        padding: 0 30upx;
        position: relative;
    }

    .logo {
        display: block;
        width: 50upx;
        height: 50upx;
        border-radius: 100px;
    }

    .name {
        font-size: 30upx;
        color: $font-color-base;
        margin-left: 24upx;
    }
    .tel {
        margin-left: auto;
        color: #fa436a;
        font-size: 28rpx;
    }
    .g-item {
        display: flex;
        margin: 20upx 30upx;

        image {
            flex-shrink: 0;
            display: block;
            width: 140upx;
            height: 140upx;
            border-radius: 4upx;
        }

        .right {
            flex: 1;
            padding-left: 24upx;
            overflow: hidden;
        }

        .title {
            font-size: 30upx;
            color: $font-color-dark;
        }

        .spec {
            font-size: 26upx;
            color: $font-color-light;
        }

        .price-box {
            display: flex;
            align-items: center;
            font-size: 32upx;
            color: $font-color-dark;
            padding-top: 10upx;

            .price {
                margin-bottom: 4upx;
            }
            .number {
                font-size: 26upx;
                color: $font-color-base;
                margin-left: 20upx;
            }
            .refund {
                width: 100rpx;
                text-align: center;
                border: 1px solid #dddddd;
                border-radius: 20rpx;
                padding: 6rpx;
                font-size: 28rpx;
                margin-left: auto;
            }
        }

        .step-box {
            position: relative;
        }
    }
}
.yt-list {
    margin-top: 16upx;
    background: #fff;
}

.yt-list-cell {
    display: flex;
    align-items: center;
    padding: 10upx 30upx 10upx 40upx;
    line-height: 70upx;
    position: relative;

    &.cell-hover {
        background: #fafafa;
    }

    &.b-b:after {
        left: 30upx;
    }

    .cell-icon {
        height: 32upx;
        width: 32upx;
        font-size: 22upx;
        color: #fff;
        text-align: center;
        line-height: 32upx;
        background: #f85e52;
        border-radius: 4upx;
        margin-right: 12upx;

        &.hb {
            background: #ffaa0e;
        }

        &.lpk {
            background: #3ab54a;
        }
    }

    .cell-more {
        align-self: center;
        font-size: 24upx;
        color: $font-color-light;
        margin-left: 8upx;
        margin-right: -10upx;
    }

    .cell-tit {
        flex: 1;
        font-size: 26upx;
        color: $font-color-light;
        margin-right: 10upx;
    }

    .cell-tip {
        font-size: 26upx;
        color: $font-color-dark;

        &.disabled {
            color: $font-color-light;
        }

        &.active {
            color: $base-color;
        }
        &.red {
            color: $base-color;
        }
    }

    &.desc-cell {
        .cell-tit {
            max-width: 90upx;
        }
    }

    .desc {
        flex: 1;
        font-size: $font-base;
        color: $font-color-dark;
    }
}
.footer {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 995;
    display: flex;
    align-items: center;
    width: 100%;
    height: 90upx;
    justify-content: space-between;
    font-size: 30upx;
    background-color: #fff;
    z-index: 998;
    color: $font-color-base;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
    .submit {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 750upx;
        height: 100%;
        color: #fff;
        font-size: 32upx;
        background-color: $base-color;
    }
}
</style>
