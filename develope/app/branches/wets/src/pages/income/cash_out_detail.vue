<template>
    <!-- 已提现详情 -->
	<view class="content">
        <view class="title">提现金额: {{data.withdraw}}</view>
        <view class="list-cell">
            <view class="cell-more" >{{data.bank}}</view>
        </view>    
         <view class="list-cell">
            <view class="cell-more">{{data.username}}</view>
        </view>
        <view class="list-cell">
            <view class="cell-more">{{data.time}}</view>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
                data : {data : {}},
            }
		},
        onLoad(param) {
            this.id = param.id;
            this.load()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        onBackPress(){
            this.$api.ovPage()
        },
		methods: {
            load(){
                let data = {
                    cguid : uni.getStorageSync("companyguid"),
                    id : this.id 
                }
                this.$ajax.get('income/getwithdrawdetail', data).then(res => {
                    console.log(res)
                    if(res.data.code == 0){     
                        this.data = res.data.result.data;  
                    }else{
                        this.$api.msg("发生异常")
                        return;
                    }
                }); 
            },
           
		}
	}
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.content {
    border-top: 1px solid #dddddd;
}
.title{
    padding: 50rpx 30rpx;
    font-size: 40rpx;
    text-align: center;
    background: #FFFFFF;
    border-bottom: 1px solid #dddddd;
}
.list-cell {
    padding: 20upx $page-row-spacing;
    line-height: 60upx;
    background: #fff;
    border-bottom: 1px solid #dddddd;
    justify-content: space-between;
    align-items: center;
    display: flex;
    &.m-t {
        margin-top: 16upx;
    }
    .cell-more {
        font-size: $font-base;
        color: $font-color-light;
        margin-left: 10upx;
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
        .pice{
            font-size: 60rpx;
            color: $base-color;
        }
    }
}

</style>
