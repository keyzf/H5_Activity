<template>
	<view class="content">
        <view class="item" v-for="(item,index) in list" :key="index" @click="jump(item)">
            <view class="title" :class="{read:item.state==1}">{{item.title}}</view>
            <view class="tip">{{item.content}}</view>
            <view class="time">{{item.pushtime}}</view>
        </view>
        <uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
	components: { uniLoadMore },
		data() {
			return {
                cguid:'',
                list:[],
                lastid:'',
                pagesize:10,
                loadingType:'More',
                verificationstate:5
            };
		},
        onLoad() {
            this.cguid = uni.getStorageSync('companyguid');
            this.load();
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        //下拉刷新
        onPullDownRefresh() {
        	this.lastid = '';
        	this.load('refresh');
        },
        //加载更多
        onReachBottom() {
        	if (this.loadingType === 'noMore') {
        		return;
        	}
        	this.load();
        },
        onBackPress(){
            this.$api.ovPage()
        },
		methods: {
            load(type){
                if (type == 'refresh') {
                    this.lastid = '';
                	this.list = [];
                }
                if(this.loadingType === 'noMore' &&this.loadingType === 'loading'){
                    return
                }
                this.loadingType = 'loading';
                this.$ajax.get('com/getCompanyMessages', {cguid:this.cguid,lastid:this.lastid,pagesize:this.pagesize}).then(res => {
                	if (res.data.code == 0) {
                        let list = res.data.result.data.messages;
                        this.list = this.list.concat(list);
                        if(list.length>0){
                            this.lastid = list[list.length - 1].id;
                        }
                        this.verificationstate = res.data.result.data.verificationstate;
                        this.loadingType = list.length == this.pagesize ? 'more' : 'noMore';
                	}
                    if(type == 'refresh'){
                        uni.stopPullDownRefresh();
                    }
                });
            },
            jump(item){
                console.log(item)
                if(item.pushtype == 6){
                    let type = this.verificationstate;
                    if(type == 1){
                        uni.navigateTo({
                            url:'/pages/openshop/credentials'
                        })
                    }else if(type == 2){
                        uni.navigateTo({
                            url:'/pages/openshop/qualifications'
                        })
                    }
                }else if(item.pushtype == 8){
                    uni.navigateTo({
                    	url: '/pages/establishment/productcontemplate?editPid=' + item.direction + '&type=message'
                    });
                }
            }
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}
	.content{
		border-top: 1px solid #dddddd;
	}
    .item{
        width: 90%;
        margin: 30rpx;
        background: #FFFFFF;
        border-radius: 20rpx;
        padding: 20rpx;
        .title{
            font-size: 32rpx;
            margin-bottom: 16rpx;
            font-weight: 600;
			&.read{
			    color: #999999;
			}
        }
        .tip{
            font-size: 28rpx;            
            margin-bottom: 26rpx;
            color: rgb(153, 153, 153);
        }
        .time{
            font-size: 28rpx;
            color: rgb(161, 161, 161);
        }
    }
</style>