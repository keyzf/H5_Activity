<template>
	<view class="content">
		<!-- 空白页 -->
		<empty v-if="activityArray.length === 0"></empty>
		<view class="sales" v-for="(activity, index) in activityArray" :key="index">
			<view class="title" @click="addexemption(activity.saleid)">
				<view class="tip">
					<text class="bq">{{ activity.userangeMsg }}</text>
					<text>{{ activity.title }}</text>
				</view>
				<view class="state" :class="{x:activity.state == 1}">{{ activity.stateMsg }}</view>
			</view>
			<view class="salescon" @click="addexemption(activity.saleid)">{{ activity.saleContent }}</view>
			<view class="salestime">
				<view class="time" @click="addexemption(activity.saleid)">{{ activity.timerange }}</view>
				<view class="btn" @click="cancel(index, activity.saleid)">删除</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		<view class="footer" @click="addexemption('')"><text class="submit">添加满免</text></view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
export default {
	components: { uniLoadMore,empty },
	data() {
		return {
			loadingType:'more',
			saleid: '',
			lastid:'',
			pagesize:10,
			activityArray: []
		};
	},
	onLoad() {
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		uni.setNavigationBarTitle({
			title: "满免活动"
		});
	},
	onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
		this.getActivity("refresh");
	},
	methods: {
		//下拉刷新
		onPullDownRefresh() {
			this.lastid = '';
		    this.getActivity("refresh");
		},
		//加载更多
		onReachBottom() {
			if(this.loadingType === 'noMore'){
				return;
			}
			this.lastid = this.activityArray[this.activityArray.length-1].saleid;
		    this.getActivity("load");
		},
		getActivity(load_type) {
			this.$ajax
				.get('sale/gettypesaleactivity', {
					cguid: this.cguid,
					pagesize: this.pagesize,
					type: 3,
					lastid:this.lastid
				})
				.then(res => {
					if (res.data.code == 0) {
						if(load_type == 'refresh'){
							uni.stopPullDownRefresh();
							this.activityArray = res.data.result.data;
						}
						if(load_type == 'load'){
							this.activityArray = this.activityArray.concat(res.data.result.data);
						}
						this.loadingType = res.data.result.data.length == this.pagesize ? 'more' : 'noMore'
					}
				});
		},
		addexemption(saleid) {
			uni.navigateTo({
				url: '/pages/promotion/addexemption?saleid=' + saleid
			});
		},
		cancel(index, saleid) {
            let _this = this;
            uni.showModal({
                title: '提示',
                content: '确定删除此活动吗？',
                success: res => {
                    if (res.confirm) {
                        _this.$ajax.get('sale/delsaleactivity', { cguid: _this.cguid, saleid: saleid }).then(res => {
                            if (res.data.code == 0) {
                                _this.activityArray.splice(index, 1);
                                if (_this.activityArray.length == 0)  _this.loadingType = 'noMore';
                            }
                            _this.$api.msg(res.data.msg);
                        });
                    }
                }
            })
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.content {
	border-top: 1px solid #dddddd;
	padding-bottom: 100rpx;
}
.uni-tip {
	padding: 15px;
	width: 300px;
	background: #fff;
	box-sizing: border-box;
	border-radius: 10px;
}

.uni-tip-title {
	text-align: center;
	font-weight: bold;
	font-size: 16px;
	color: #333;
}

.uni-tip-content {
	padding: 10rpx;
	font-size: 28rpx;
	color: #666;
	display: flex;
	align-items: center;
	border: 1px solid #dddddd;
	border-radius: 8rpx;
	margin: 20rpx 0;
	.cell-more {
		height: 30px;
		line-height: 30px;
		flex-grow: 1;
	}
	text {
		color: #007aff;
	}
}

.uni-tip-group-button {
	margin-top: 10px;
	display: flex;
}

.uni-tip-button {
	width: 100%;
	text-align: center;
	font-size: 14px;
	color: #3b4144;
	&.action {
		color: #007aff;
	}
}
</style>
