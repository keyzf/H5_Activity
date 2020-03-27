<template>
	<view class="content" v-show="phtml">
        <view class="title" v-if="title">{{title}}</view>
        <view class="detail-con" v-html="phtml"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
                phtml: '',
                cguid: 0,
				title:''
            };
		},
        onLoad(param) {
            this.type_url = param.type;
            let url;
            if(this.type_url == 'creat'){
                url = 'com/protocol';//建店
                uni.setNavigationBarTitle({
                    title: '服务协议'
                });
            }else if(this.type_url == 'information'){
                uni.setNavigationBarTitle({
                    title: '通知'
                });
                this.title = param.title;
                this.request_fun(param.information_url)
                return;
            }else{
               url = 'com/shopguides' 
            }
            this.cguid = uni.getStorageSync("companyguid");
            this.$ajax.get(url, {cguid: this.cguid}).then(res => {
                if (res.data.code == 0) {
                    let html_url;
                    if(this.type_url == 'creat'){
                        html_url = res.data.result.data.protocolUrl;
                    }else{
                        html_url = res.data.result.data.url;
                    }  
                    this.request_fun(html_url);
                }
            });
        },
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        methods:{
            request_fun(url){
                uni.request({
                    url: url,
                    success: (res) => {
                        if(res.statusCode==200){
                            var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
                            var result = REG_BODY.exec(res.data);
                            if (result && result.length === 2) {
                                this.phtml = result[1];
                                //.replace(/\<img/gi, '<img style="max-width:750upx;height:auto" ');
                            } else {
                                this.phtml = result;
                            }
                        }
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
	.content{
		border-top: 1px solid #dddddd;
	}
    .title{
        padding: 20rpx 0;
        font-size: 32rpx;
        text-align: center;
    }
    .detail-con{
        /deep/ img{
            width: 720upx;
            margin: 0 auto;
            display:block;
        }
        /deep/ embed{
            width: 750upx;
            margin: 0 auto;
            display:block;
        }
        /deep/ video{
            width: 750upx;
            margin: 0 auto;
            display:block;
        }
        /deep/ p{
            padding: 0 30rpx;
            font-size: 28rpx !important;
            *{
                font-size: 28rpx !important;
            }
            embed{
                width: 750upx;
                margin: 0 -30rpx;
                display:block;
            }
            video{
                width: 750upx;
                margin: 0 -30rpx;
                display:block;
            }
            img{
                width: 750upx;
                margin: 0 -30rpx;
                display:block;
            }
        }
    }
</style>