<template>
    <!-- 建店 -->
    <view class="content" >
        <view class="item" v-for= "(item,index) in shopList"  @click="on_click(item.type)">
            <view>
                <img :src="item.url" />
                {{item.typename}}
            </view>
            <view>{{item.explainwords}}</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            shopList : [],
        };
    },
    onLoad() {
    	this.load();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
	methods:{
        load(){
			if (uni.getStorageSync('companyguid') == '') return;
          	let data = {
          	cguid: uni.getStorageSync("companyguid"),
            }
          this.$ajax.get('com/companytype', data).then(res => {
          	if (res.data.code == 0) { 
                this.shopList = res.data.result.data
          		console.log(res.data.result.data)
          	}
          });  
        },
		on_click(type){
			uni.navigateTo({
				url:'/pages/openshop/found?type=' + type
			})
		},
        
	}
};
</script>

<style lang="scss">
.content {
    border-top: 1px solid #dddddd;
}
.item {
    margin: 20rpx 30rpx;
    background: #00bfff;
    color: #ffffff;
    padding: 30rpx;
    text-align: center;
    border-radius: 20rpx;
    vertical-align: middle;
    img{
        width: 80rpx;
        height: 80rpx;
        border-radius: 80rpx;
        display: inline-block;
        vertical-align: middle;
    }
}
</style>
