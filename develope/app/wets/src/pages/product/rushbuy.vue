<template>
	<view style="height: 100%;">
        <view class="nav-head">
            <div class="uni-page-head-hd"><div class="uni-page-head-btn" @click="backnav"><i class="uni-btn-icon" style="color: rgb(0, 0, 0); font-size: 27px;"></i></div></div>
            <view class="nav-bd"><view class="uni-page-head__title">抢购列表</view></view>
            <div class="uni-page-head-ft" v-show="showhelp" @click="openedit"><div class="uni-page-head-btn" style="background-color: transparent; width: 60px;"><i class="uni-btn-icon" style="color: rgb(48, 49, 51); font-size: 12px; font-weight: normal;">使用说明</i></div></div>
        </view>
		<view style="height: 100%;">
			<wuc-tab class="cu-bar" :tab-list="tabList" :tabCur.sync="TabCur" tab-class="text-center" select-class="text-red" @change="swiperChange1"></wuc-tab>
			<swiper :current="TabCur" class="swiper-box" duration="300" indicator-color="rgba(255,255,255,0)" indicator-active-color="rgba(255,255,255,0)" @change="swiperChange">
				<swiper-item v-for="(item, index) in tabList" :key="index" class="tab-content">
					<scroll-view class="list-scroll-content" scroll-y>
                        <empty v-if="item.list.length === 0"></empty>
                        <block v-for="(itemlist, numb) in item.list" :key="numb">
                            <view class="rob" v-for="(items, indx) in itemlist.item" :key="indx" @click="jump(items)">
                                <image :src="items.url" mode="aspectFit"></image>
                            	<view class="con">
                            		<view class="flexd">
                            			<view class="name">{{ items.name }}</view>
                            			<view class="stata" :class="{x:items.robstate == 1,xx:items.robstate == 2}">{{ items.robstatetext }}</view>
                            		</view>
                            		<view class="tip">{{ items.limit }}</view>
                            		<view class="flexd">
                                        <view>
                            			<view class="old">{{ items.oldprice }}</view>
                                            
                            			<view><text class="new">{{ items.price }}</text></view>
                                        </view>
                                        <view>
                                            <view class="time" :class="{x:items.robstate != 0}" v-if="items.time != 0"><countdown :time="items.time" @timeup="robtip(items)"></countdown></view>
                                            <view class="schedule" v-if="items.robstate != 0">
                                                <text :style="'width:' + items.percent+'%'"></text>
                                                <view>{{ items.percenttext }}</view>
                                            </view>
                                        </view>
                            			
                            		</view>
                            	</view>
                            </view>
                        </block>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
import countdown from '@/components/countdown/countdown';
import WucTab from '@/components/wuc-tab/wuc-tab.vue';
import empty from "@/components/empty";
export default {
	components: {
		WucTab,
		countdown,
        empty
    },
	data() {
		return {
			tabList: [],
			TabCur: 0,
            showhelp:false,
            gzurl:''
		};
	},
	onLoad() {
		uni.showLoading({
			title: '加载中'
		});
		this.loaddata();
        this.$ajax.get('homepage/buylimitRule', {}).then(res => {
            if(res.data.code == 0){
                if(res.data.result.data.ruleurl){
                    this.showhelp = true;
                    this.gzurl = res.data.result.data.ruleurl;
                }
            }
        });
	},
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onPullDownRefresh() {
        this.loaddatas();
    },
	methods: {
        backnav(){
            uni.navigateBack()
        },
        openedit(){
            if(this.gzurl){
                uni.navigateTo({
                    url:'/pages/establishment/help?url='+this.gzurl+'&type=4'
                })
            }
        },
		loaddata() {
			this.$ajax.get('homepage/grabdetailRecentDaysHeader', {}).then(res => {
				if (res.data.code == 0) {
					var list = [];
					res.data.result.data.forEach((items, index) => {
						var i = {};
						i.name = items.session;
						i.time = items.time;
						i.list = [];
						i.loadingType = 'more';
						var a = items.time.split(' ');
						var b = a[0].split('-');
						i.icon = b[1] + '-' + b[2];
						i.index = index;
						i.date = a;
						if (items.isdefault == 1) {
							this.TabCur = index;
						}
						list.push(i);
					});
					this.tabList = list;
					this.loaddatas();
					uni.hideLoading();
				} else {
					this.$api.msg('系统出错,请稍后再试');
				}
			});
		},
		swiperChange(e) {
			let { current } = e.target;
			this.TabCur = current;
			this.loaddatas();
		},
		swiperChange1(e) {
            if (this.TabCur != e) {
                this.TabCur = e;
            }
		},
		loaddatas() {
			let date = this.tabList[this.TabCur].time;
			const data = {
				date: date
			};
			this.$ajax.get('homepage/grabdetailRecentDays', data).then(res => {
				if (res.data.code == 0) {
					if (res.data.result.data.length > 0) {
						let list = res.data.result.data;
						this.tabList[this.TabCur].list = list;
					}
                    uni.stopPullDownRefresh();
				} else {
					this.$api.msg(res.data.msg);
				}
			});
		},
		jump(item){
			uni.navigateTo({
			    url: '/pages/product/product?productid=' + item.productid
			});
		},
        robtip(item) {
            if (item.robstate == 0) {
                item.robstate = 1;
                item.time = 0;
                item.robstatetext = '抢购中';
            } else {
                item.robstate = 2;
                item.time = 0;
                item.robstatetext = '活动已结束';
            }
        },
	},
};
</script>
<style lang="scss">
page,
.content {
	background: $page-color-base;
	height: 100%;
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
    image{
        width: 50rpx;
        height: 50rpx;
    }
}
.swiper-box {
	height: calc(100% - 52px);
}
.list-scroll-content {
	height: 100%;
}
.cu-bar {
	display: flex;
	position: relative;
	align-items: center;
	min-height: 100upx;
	justify-content: space-between;
	font-size: 28rpx;
	background: #ffffff;
	border-top: 1px solid #dddddd;
	border-bottom: 1px solid #dddddd;
}

.cu-bar .action {
	display: flex;
	align-items: center;
	height: 100%;
	justify-content: center;
	max-width: 100%;
	background-color: #ffffff;
}

.cu-bar .action:first-child {
	margin-left: 30upx;
	font-size: 30upx;
}

.rob {
    display: flex;
    align-items: center;
    background: #ffffff;
    padding: 16rpx 30rpx;
    border-bottom: 1px solid #dddddd;
    image {
        width: 180rpx;
        min-width: 180rpx;
        max-width: 180rpx;
        height: 180rpx;
        border-radius: 8rpx;
    }
    .con {
        flex-grow: 1;
        margin-left: 20rpx;
        font-size: 28rpx;
        .flexd {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .name {
                font-size: 30rpx;
                margin-right: 24rpx;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .stata {
                font-size: 28rpx;
                min-width: 120rpx;
                color: rgb(18, 184, 56);
                &.x{
                    color: $base-color;
                }
                &.xx{
                    color: $font-color-dark;
                }
            }
            .time {
                font-size: 28rpx;
                color: rgb(18, 184, 56);
                /deep/ text{
                    background:rgb(18, 184, 56);
                    color: #FFF;
                    border-radius: 4rpx;
                    margin: 0 4rpx;
                    min-width: 48rpx;
                    display: inline-block;
                    text-align: center;
                }
                &.x{
                    color: $base-color;
                    /deep/ text{
                        background:$base-color;
                    }
                }
            }
            .old {
                color: $border-color-dark;
                text-decoration: line-through;
            }
            .new {
                font-size: 40rpx;
                color: $base-color;
            }
            .schedule {
                margin-top: 20rpx;
                position: relative;
                border: 1px solid #dddddd;
                border-radius: 30rpx;
                text-align: center;
                overflow: hidden;
                font-size: 24rpx;
                max-width: 240rpx;
                min-width: 240rpx;
                width: 240rpx;
                text {
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: 20%;
                    background: #fec7d3;
                    z-index: 1;
                }
                view {
                    position: relative;
                    z-index: 2;
                }
            }
            .remind{
                display: inline-block;
                border-radius: 12rpx;
                background: rgb(18, 184, 56);
                color: #FFF;
            }
        }
        .tip {
            color: $border-color-dark;
            margin: 18rpx 0;
        }
    }
}

</style>