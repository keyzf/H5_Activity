<template>
	<view class="page-content">
		<view class="nav-head">
			<div class="uni-page-head-hd">
				<div class="uni-page-head-btn" @click="backnav"><i class="uni-btn-icon" style="color: rgb(0, 0, 0); font-size: 27px;"></i></div>
			</div>
			<view class="nav-bd">
				<view class="uni-page-head__title">{{ head.headerTitle }}</view>
			</view>
			<div class="uni-page-head-ft">
				<div v-show="showhelp" class="uni-page-head-btn" style="width: 36px;"><image src="../../static/help.png" mode="aspectFit" @click="openedit"></image></div>
			</div>
		</view>
		<view class="banner" v-if="slideShows.length > 0">
			<swiper class="swiper-img" autoplay circular indicator-dots :style="'height:' + swperheight">
				<swiper-item v-for="(item, index) in slideShows" :key="index" class="carousel-item" @click="clickSlide(item)">
                    <image :src="item.picurl" mode="widthFix" class="swiperimg"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="title">{{ listTitle }}</view>
		<!-- 空白页 -->
		<empty v-if="welfares.length === 0"></empty>
		<view class="item" v-for="(item, index) in welfares" :key="index" @click="clickWelfare(item)">
            <text v-if="item.samplename" class="samplename">{{item.samplename}}</text>
            <view v-if="item.label" class="label">
                <text>{{item.label}}</text>
            </view>
            <view v-if="item.time <= 0" class="bg"></view>
			<image :src="item.picurl" mode="aspectFit"></image>
			<view class="tip">
				<text class="tips">{{ item.statement }}</text>
				<text v-if="item.time > 0">
					距活动结束
					<countdown class="indeblock" :time="item.time"></countdown>
				</text>
			</view>
		</view>
	</view>
</template>
<script>
import countdown from '@/components/countdown/countdown.vue';
import uimg from '@/components/uimg/uimg.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
export default {
	components: {
		uniLoadMore,
		empty,
		countdown,
		uimg
	},
	data() {
		return {
			lid: '',
			pageSize: 10,
			head: {},
			showhelp: false,
			swperheight: 0,
			listTitle: '',
			slideShows: [],
			welfares: [],
			loadingType: 'more',
			msg: ''
		};
	},
	onLoad(e) {
		uni.showLoading({
			title: '加载中'
		});
		this.guid = uni.getStorageSync('guid');
		this.$ajax.get('welfare/getHeader', {}).then(res => {
			if (res.data.code == 0) {
				this.head = res.data.result.data;
				this.showhelp = true;
			}
			uni.hideLoading();
		});
		this.getSildeShow();
		this.getWelfareList(0);
		//this.load(0);
	},
	onBackPress() {
		this.$api.ovPage();
	},
	//下拉刷新
	onPullDownRefresh() {
		this.getSildeShow();
		this.lid = '';
		this.getWelfareList(0);
	},
	//加载更多
	onReachBottom() {
		if (this.loadingType === 'noMore') {
			return;
		}
		let size = this.welfares.length;
		this.lid = this.welfares[size - 1].id;
		this.getWelfareList(1);
	},
	onShow() {
		if (this.$wx.isWechat()) this.$wx.share();
		if (this.msg != '') {
			this.msgTip();
		}
	},
	methods: {
		backnav() {
			uni.navigateBack();
		},
		openedit() {
			uni.navigateTo({
				url: '/pages/user/customerexit?url=' + this.head.helpUrl + '&name=' + this.head.headerTitle
			});
		},
		getSildeShow() {
			this.$ajax.get('welfare/getSlidshow', {}).then(res => {
				if (res.data.code == 0) {
					this.listTitle = res.data.result.data.listTitle;
					this.slideShows = res.data.result.data.slideshows;
					if (res.data.result.data.slideshows.length > 0) {
						let js = (res.data.result.data.slideshows[0].picwidth = 750 / 750);
						this.swperheight = res.data.result.data.slideshows[0].picheight / js + 'rpx';
					}
				}
			});
		},
		getWelfareList(load_type) {
			this.$ajax.get('welfare/getWelfareList', { lid: this.lid, pagesize: this.pageSize }).then(res => {
				if (res.data.code == 0) {
					if (load_type == 0) {
						uni.stopPullDownRefresh();
						this.welfares = res.data.result.data.welfares;
					} else if (load_type == 1) {
						this.welfares = this.welfares.concat(res.data.result.data.welfares);
					}
					this.loadingType = res.data.result.data.welfares.length == this.pagesize ? 'more' : 'noMore';
				}
			});
		},
		clickSlide(item) {
			if (item.jumptype == 0) {
			} else if (item.jumptype == 1) {
				uni.navigateTo({
					url: '/pages/user/customerexit?url=' + item.direction + '&name=详情介绍'
				});
			} else {
				if (item.activitycode == 'PROMOTION') {
					uni.navigateTo({
						url: '/pages/product/catelist?id=' + item.activityid
					});
				} else {
					this.$api.msg('功能开发中');
				}
			}
		},
		clickWelfare(welfare) {
			if(welfare.welfarestate != 2){
				uni.navigateTo({
					url: '/pages/product/welfare-list?welfareid=' + welfare.id
				});
			}
		},
		msgTip() {
			this.$api.msg(this.msg);
		}
	}
};
</script>
<style lang="scss">
page {
	background: #f5f5f5;
}
.nav-head {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 44px;
	padding: 7px 3px;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	overflow: hidden;
	-webkit-box-pack: justify;
	-webkit-justify-content: space-between;
	justify-content: space-between;
	box-sizing: border-box;
	z-index: 999;
	-webkit-transition-property: all;
	transition-property: all;
	background-color: rgb(255, 255, 255);
	color: rgb(0, 0, 0);

	.nav-bd {
		position: absolute;
		left: 70px;
		right: 70px;
		min-width: 0;
		-webkit-user-select: auto;
		user-select: auto;
	}
	.uni-page-head__title {
		font-weight: 700;
		font-size: 16px;
		line-height: 30px;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 16px;
		opacity: 1;
	}
	image {
		width: 50rpx;
		height: 50rpx;
	}
}
.page-content {
	font-size: 14px;
}

.banner {
	position: relative;
	width: 100%;
}
.swiper-img {
	width: 100%;
}
.swiperimg {
	width: 100%;
	height: 100% !important;
	/deep/ view {
		width: 100%;
		height: 100% !important;
	}
	/deep/ image {
		width: 100%;
		height: 100% !important;
	}
}
.title {
	padding: 10px;
	background: #fff;
	font-size: 18px;
}
.item {
	margin-top: 10px;
	font-size: 16px;
	background: #fff;
    position: relative;
	image {
		width: 750rpx;
		height: 300rpx;
	}
    .bg{
        position: absolute;
        left: 0;
        right: 0;
        height: 300rpx;
        background: rgba(0,0,0,0.2);
        z-index: 1;
    }
    .samplename{
        position: absolute;
        left: 0;
        right: 0;
        top: 100rpx;
        text-align: center;
        color: #FFF;
        z-index: 1;
    }
    .label{
        position: absolute;
        top: 200rpx;
        left: 0;
        right: 0;
        text-align: center;
        color: #FFF;
        z-index: 1;
        text{
            padding: 10rpx 40rpx;
            border-radius: 10rpx;
            margin: 0 auto;
            display: inline-block;
            border: 1px solid #FFF;
        }
    }
	.tip {
		padding: 10px;
		text-align: right;
		.tips {
			color: #666;
			margin-right: 6px;
			&.x {
				color: #39b54a;
			}
		}
	}
	.indeblock {
		display: inline-block;
	}
}
</style>
