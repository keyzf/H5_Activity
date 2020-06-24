<template>
	<view class="content">
		<view class="tips">
			<text>{{totalnumber}}</text>
			<text>{{todaynumber}}</text>
		</view>
		<view class="fanslist">
			<view class="fansitem" v-for="(fans, index) in fansList" :key="index">
				<image :src="fans.headUrl || '/static/missing-face.png'" class="titleimg" @error="errorImg(index)"></image>
				<view class="names">
					<view>{{fans.name}}</view>
					<view class="tip">{{fans.remark}}</view>
				</view>
				<view class="btns">
					<text class="btn" @click="chat(index)">聊天</text>
					<text class="btn" @click="remark(fans.id)">备注</text>
				</view>
			</view>
		</view>
        <uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
    components: {
        uniLoadMore
    },
	data() {
		return {
            cguid: 0,
            pagesize: 10,
            loadingType: 'more',
			lastid: "",
            fansList: [],
            totalnumber: 0,
            todaynumber: 0
        };
	},
    onBackPress(){
        this.$api.ovPage()
    },
    onLoad() {
        this.cguid = uni.getStorageSync("companyguid");
        this.list(0);
    },
	//下拉刷新
	onPullDownRefresh() {
		this.lastid = '';
		this.list(0);
	},
	onReachBottom() {
		if (this.loadingType === 'noMore') {
			return;
		}
		let length = this.fansList.length;
		this.lastid = length > 0 ? this.fansList[length - 1].id : 0;
		this.list(1);
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods:{
        // 联系粉丝
        chat(ins) {
            let dataInfo = {
                nickName:this.fansList[ins].name,
                username:this.fansList[ins].guid,
                avatar:this.fansList[ins].headUrl
            };
            uni.setStorage({
                key:'jiguang_chater_info',
                data: dataInfo
            });
            uni.navigateTo({
                url: '/pages/chat/chat'
            });
        },
		errorImg(index){
			this.fansList[index].headUrl = '/static/missing-face.png';
		},
        list(load_type) {
            this.$ajax.get('com/fanslist', {cguid: this.cguid, pagesize: this.pagesize, lid: this.lastid}).then(res => {
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    this.totalnumber = data.totalnumber;
                    this.todaynumber = data.todaynumber;
					if(load_type == 0){
						this.fansList = data.fanslist;
					}else if(load_type == 1){
						this.fansList = this.fansList.concat(data.fanslist);
					}
                    this.loadingType = data.fanslist.length == this.pagesize ? 'more' : 'noMore'
                } else {
                    this.$api.msg('系统出错,请稍后再试');
                }
                uni.stopPullDownRefresh();
            });
        },
        remark(id) {
            uni.navigateTo({
                url: '/pages/connection/fans_remark?id=' + id
            });
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
	}
	.tips{
		padding: 16rpx 30rpx;
		background: #FFFFFF;
		font-size: 24rpx;
		margin-bottom: 10rpx;
		text{
			margin: 0 20rpx 0 10rpx;
		}
	}
	.fanslist{
		.fansitem{
			padding: 20rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #FFFFFF;
			.titleimg{
				width: 80rpx;
                min-width: 80rpx;
				height: 80rpx;
				border-radius: 40rpx;
			}
			.names{
				flex-grow: 1;
				font-size: 32rpx;
				padding: 0 16rpx;
				.tip{
					font-size: 24rpx;
				}
			}
			.btns{
				min-width: 100rpx;
				text-align: center;
				.btn{
					font-size: 28rpx;
					padding: 8rpx 18rpx;
					display: inline-block;
					border-radius: 18rpx;
					border: 1px solid #DDDDDD;
                    margin-left: 10px;
				}
			}
		}
	}
</style>
