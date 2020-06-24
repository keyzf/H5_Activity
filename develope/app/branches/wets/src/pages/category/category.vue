<template>
	<view class="content">
        <view class="search-box" v-if="kg">
            <view class="search-left" @tap="returngo()">
                <uni-text class="yticon icon-zuo"></uni-text>
            </view>
        	<view class="input-box" @tap="doSearch()">
        		<input type="text" :placeholder="defaultKeyword" placeholder-class="placeholder-class" disabled>
        	</view>
        	<view class="search-btn" @tap="doSearch()">团购须知</view>
        	<!-- 原样式 end -->
        </view>
        <view class="contents" :style="{height:kg?'calc(100% - 50px)':'100%'}">
            <scroll-view scroll-y class="left-aside">
                <view v-for="(item,index) in flist" :key="index" class="f-item b-b" :class="{active: index === currentId}" @click="tabtap(item,index)">
                    {{item.name}}
                </view>
            </scroll-view>
            <scroll-view scroll-with-animation scroll-y class="right-aside" :scroll-top="tabScrollTop">
                <view v-if="slist.slidepic.length > 0" class="title-img">
                    <img :src="item.url" alt="" v-for="(item,index) in slist.slidepic" :key="index" @click="imgToList(item)">
                </view>
                <view v-for="item in slist.category" :key="item.categoryid" class="s-list">
                    <text class="s-item">{{item.name}}</text>
                    <view class="t-list">
                        <view @click="navToList(item.categoryid, titem)" class="t-item" v-for="titem in item.subcategory" :key="titem.categoryid">
                            <uimg :src="titem.picurl" mode="aspectFit"></uimg>
                            <view v-show="titem.name.length>4" class="title">{{titem.name.substr(0,3)}}...</view>
                            <view v-show="titem.name.length<5" class="title">{{titem.name.substr(0,4)}}</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
	</view>
</template>
<script>
    import uimg from "@/components/uimg/uimg.vue";
	export default {
        components: {
            uimg
        },
		data() {
			return {
                kg:false,
                defaultKeyword:'',
				tabScrollTop: 0,
				currentId: 0,
				flist: [],
				slist: {
                    slidepic:[],
                },
			}
		},
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
            this.$ajax.get('shoppingcart/getModelTipNum', {code: "SHOPCART"}).then(res => {
                let number = res.data.result.data.tipnumber;
                if(number == 0){
                    uni.removeTabBarBadge({
                        index: 3,
                    });
                }else{
                    uni.setTabBarBadge({
                        index: 3,
                        text: number.toString()
                    });
                }
            });
        },
        created(){
        	this.load();
        },
        onLoad(e) {
            if(e.type){
                this.kg = true;
                this.loadDefaultKeyword();
            }
            this.pageType = e.pageType
        },
		methods: {
            //执行搜索
            doSearch() {
                uni.navigateTo({
                	url: '/pages/search/assemble-search?type=2'
                })
            },
            returngo(){
                uni.navigateBack();
            },
            loadDefaultKeyword() {
                if(this.defaultKeyword == ''){
                    this.$ajax.get('homepage/getSearchboxShading', {}).then(res => {
                        this.defaultKeyword = res.data.result.data.text;
                    });
                }
                
            },
			load(){
                this.$ajax.get('category/category', {}).then(res => {
                    if(res.data.code==0){
                        this.flist = res.data.result.data;
                        let sj ={
                            ctype:res.data.result.data[0].ctype,
                            cid:res.data.result.data[0].categoryid
                        }
                        this.$ajax.get('category/categoryinfo', sj).then(res => {
                            if(res.data.code==0){
                                this.slist = res.data.result.data;
                            }
                        });
						uni.stopPullDownRefresh();
                    }
                });
			},
			//一级分类点击
			tabtap(item,index){
                this.currentId = index;
                let sj ={
                    ctype:item.ctype,
                    cid:item.categoryid
                }
                this.$ajax.get('category/categoryinfo', sj).then(res => {
                    if(res.data.code==0){
                        this.slist = res.data.result.data;
                        this.tabScrollTop = 0;
                    }
                });
				
			},
			navToList(sid, tid){
                if(tid.subtype == 2){
                    uni.navigateTo({
                        url: '/pages/product/product?productid=' + tid.categoryid
                    });
                }else{
                    let url = '/pages/product/goodslist?cid=' + tid.categoryid;
                    if(this.pageType == "group"){
                        url = '/pages/product/goodslist?cid=' + tid.categoryid + "&pageType=group"
                    }
                    uni.navigateTo({
                        url: url
                    })
                }
			},
            imgToList(sid){
                if(sid.jumptype == 1){
                    uni.navigateTo({
                        url: '/pages/product/product?productid=' + sid.productid
                    });
                }
            }
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}
    
    .yticon{
        font-size: 52rpx;
    }
    .search-box {
    	width: 100%;
    	background-color: #FFF;
    	padding: 15upx 30rpx;
    	display: flex;
    	justify-content: space-between;
    }
    
    .search-box .input-box {
    	flex-grow: 1;
    	display: flex;
    	justify-content: center;
    	align-items: center;
    }
    
    .search-box .search-btn {
    	min-width: 120rpx;
    	display: flex;
    	justify-content: center;
    	align-items: center;
    	flex-shrink: 0;
    	font-size: 28upx;
    	border-radius: 60upx;
        margin-left: 20rpx;
    }
    
    .search-box .input-box>input {
    	width: 100%;
    	height: 60upx;
    	font-size: 32upx;
    	border: 0;
    	border-radius: 60upx;
    	-webkit-appearance: none;
    	-moz-appearance: none;
    	appearance: none;
    	padding: 0 3%;
    	margin: 0;
    	background-color: #f1f1f1;
    }
    
    .placeholder-class {
    	color: #9e9e9e;
    }
    
    .search-keyword {
    	width: 100%;
    	background-color: rgb(242, 242, 242);
    }
	.contents {
		display: flex;
	}
    .title-img{
        img{
            width: 520rpx;
            height: 186rpx;
        }
    }
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
        text-align: center;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
        text-align: center;
		
		/deep/ image{
			width: 140upx;
			height: 140upx;
		}
        .title{
            white-space:nowrap;
            overflow:hidden;
            margin: 0 auto;
        }
	}
</style>
