<template>
    <!-- 保证金页面 -->
	<view class="content">
		<view class="commodity" v-for="(item,index) in chargelist">
			<view class="commodity-con">
				<view class="title">{{item.title}}</view>
				<view class="tip">{{item.detail}}</view>
			</view>
			<view class="stata">{{item.price}}</view>
		</view>
        <view class="number">
           <!-- 点击跳转页  item.helpurl= -->
            总计<text>{{totalpricetext}}</text>
        </view>

		<view class="footer"><text class="submit ash" @click="jump_fun">以后再说</text><text class="submit" @click="pay">去缴纳</text></view>
	
		
	</view>
</template>


<script>
export default {
	data() {
		return {
            chargelist : [],
            totalpricetext : "",
        };
	},
    onLoad() {
    	this.load();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
        load(){
            let data = {
                 type : 0, //0 建店过程 1 已建店
                 cguid: uni.getStorageSync("companyguid"),
           };
           this.$ajax.get('com/chargelist', data).then(res => {
              if (res.data.code == 0) { 
                 this.chargelist = res.data.result.data.chargelist;
                 this.totalpricetext = res.data.result.data.totalpricetext
                  //银行卡页面
                 /* uni.navigateTo({
                  	url:'/pages/openshop/binding_bank_card'
                  }) */     
               }else{
                    console.log(res);
                   this.$api.msg(res.data.msg)
               }
              
            })  
        },
        pay(){
            
            
        },
        jump_fun() {
              this.$ajax.get('com/setCompanyState', {cguid: uni.getStorageSync("companyguid")}).then(res => {
               if (res.data.code == 0) { 
                  uni.switchTab({
                      url: '/pages/establishment/shop',
                  }); 
               }
             })      
        },
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

.commodity {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #ffffff;
	padding: 20rpx 30rpx;
	border-bottom: 1px solid #dddddd;
	.commodity-con {
		flex-grow: 1;
		.title {
			font-size: 30rpx;
			margin-bottom: 10rpx;
		}
		.tip {
			font-size: 24rpx;
			color: $font-color-base;
		}
	}
	.stata {
		min-width: 100rpx;
		font-size: 40rpx;
		margin-left: 20rpx;
		color: $base-color;
	}
}
.uni-tip {
    background: #fff;
    box-sizing: border-box;
}

.uni-tip-title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.input {
    padding: 12rpx;
    font-size: 28rpx;
    color: #666;
    border-bottom: 1px solid #dddddd;
    display: block;
    height: auto;
}

.uni-tip-group-button {
    margin-top: 10px;
}

.uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
}
/deep/ .uni-popup__wrapper-box{
    border-radius: 20rpx;
}
.number{
    padding: 20rpx 30rpx;
    background: #FFFFFF;
    text-align: right;
    text{
        font-size: 40rpx;
        margin-left: 20rpx;
        color: $base-color;
    }
}
</style>
