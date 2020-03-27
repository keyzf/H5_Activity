<template>
	<view>
		<view class="envelopes">
			<view class="left">
				<view class="myenvelopes">可用余额</view>
				<view class="myenvelopes-number">{{date.redpacketbalance}}</view>
			</view>
		</view>
		<view class="list-cell b-b m-t">
		    <text class="cell-tit">红包名称</text>
		    <text class="cell-more">{{date.title}}</text>
		</view>
		<view class="list-cell b-b">
		    <text class="cell-tit">初始面额</text>
		    <text class="cell-more">{{date.initialmoney}}</text>
		</view>
		<view class="list-cell b-b">
		    <text class="cell-tit">开始时间</text>
		    <text class="cell-more">{{date.begintime}}</text>
		</view>
		<view class="list-cell b-b">
		    <text class="cell-tit">截止时间</text>
		    <text class="cell-more">{{date.endtime}}</text>
		</view>
		<view class="list-cell b-b">
		    <text class="cell-tit">使用规则</text>
		    <text class="cell-more">{{date.rule}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				date:{},
                userredpacketid:0
			}
		},
        onLoad(o) {
            this.userredpacketid = o.userredpacketid;
            this.getedit();
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
			getedit() {
				this.$ajax.get('redpacket/getredpacketinfo', {
					userredpacketid: this.userredpacketid,
				}).then(res => {
					if (res.data.code == 0) {
						this.date = res.data.result.data;
					} else {
						this.$api.msg('获取红包列表失败');
					}
				});
			},
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.envelopes {
		background: #fa436a;
		color: #ffffff;
		padding: 20rpx;

		.left {
			font-size: 30upx;
			text-align: center;
			.myenvelopes {
				margin-top: 40rpx;
				font-size: 28upx;
			}

			.myenvelopes-number {
				font-size: 60upx;
			}
		}
	}
.list-cell {
    display: flex;
    align-items: baseline;
    padding: 20upx $page-row-spacing;
    line-height: 60upx;
    position: relative;
    background: #fff;
    justify-content: center;
    &.log-out-btn {
        margin-top: 40upx;
        .cell-tit {
            color: $uni-color-primary;
            text-align: center;
            margin-right: 0;
        }
    }
    &.cell-hover {
        background: #fafafa;
    }
    &.b-b:after {
        left: 30upx;
    }
    &.m-t {
        margin-top: 16upx;
    }
    .cell-more {
        align-self: baseline;
        font-size: $font-lg;
        color: $font-color-light;
        margin-left: 10upx;
        flex: 1;
        text-align: right;
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
    }
    .tximg {
        width: 100rpx;
        height: 100rpx;
        vertical-align: middle;
    }
    .cell-tip {
        font-size: $font-base;
        color: $font-color-light;
    }
    switch {
        transform: translateX(16upx) scale(0.84);
    }
}

</style>
