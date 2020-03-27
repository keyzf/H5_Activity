<template>
    <view class="center">
        <view class="banner"><image src="../../static/wxindex.png" mode="scaleToFill" class="banner"></image></view>
        <view class="supplier">
            <view @click="tabClick(2)" :class="tabIndex == 2 ? 'x' : ''">商城自营</view>
            <view @click="tabClick(0)" :class="tabIndex == 0 ? 'x' : ''">商城供应商</view>
            <view @click="tabClick(1)" :class="tabIndex == 1 ? 'x' : ''">自建供应商</view>
        </view>
        <view class="search" v-show="tabIndex == 1">
            <view @click="gosettled" v-show="tabIndex == 1 && showState == 1">
                <img src="../../static/settled.png" />
                <span>入驻</span>
            </view>
            <view @click="gosettled" v-show="tabIndex == 1 && showState == 2"><span>管理</span></view>
            <view class="input">
                <input type="text" confirm-type="搜索" v-model="keyword" @confirm="searchCompany" />
                <view class="btnse" @click="searchCompany">搜索</view>
            </view>
        </view>
        <view v-show="tabIndex == 2">
            <view class="contents" style="height:calc(100vh - 360rpx)">
                <scroll-view scroll-y class="left-aside">
                    <view v-for="(item,index) in flist" :key="index" class="f-item b-b" :class="{active: index === currentId}" @click="tabtap(item,index)">
                        {{item.name}}
                    </view>
                </scroll-view>
                <scroll-view scroll-with-animation scroll-y class="right-aside" :scroll-top="tabScrollTop">
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
        <view class="shoplist" v-show="tabIndex == 0">
            <view class="item" v-for="(item, index) in listData[0].data" :key="index" @click="supplierClick(index)">
                <view class="title">
                    <image :src="item.logo" mode="aspectFill"></image>
                    <view class="name">
                        {{ item.realname != null ? (item.realname.substr(0,1) + '**') : '' }}
                    </view>
                    <view class="tel" @click.stop="buttonClick(index)">联系Ta</view>
                </view>
                <image :src="item.picurl" mode="aspectFill" class="shopbander"></image>
                <view class="heads">{{item.companyname}}</view>
                <view class="scope clamp">{{item.managescope}}</view>
                <view class="address clamp">{{item.companyAddress.address}}</view>
            </view>
        </view>
        <view class="enterprise" v-show="tabIndex == 1" v-for="(item, index) in listData[1].data" :key="index" @click="supplierClick(index)">
            <view class="head">
                <img :src="item.logo" />
                <view class="con">
                    <view class="title">{{ item.suppliername }}</view>
                    <view class="tel">
                        {{ item.realname != null ? (item.realname.substr(0,1) + '**') : '' }}
                        <span v-show="false">{{ item.tel }}</span>
                    </view>
                </view>
                <view class="contact" @click.stop="buttonClick(index)">联系Ta</view>
            </view>
            <view class="tip">{{ item.businessscope }}</view>
            <view class="addres">
                所在城市:
                <span>{{ item.city }}</span>
            </view>
        </view>
        <uni-load-more :status="listData[tabIndex].loading" v-show="tabIndex != 2"></uni-load-more>
    </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
import uimg from "@/components/uimg/uimg.vue";
import { mapMutations } from 'vuex';
export default {
    components: {
        uniLoadMore,
        empty,
        uimg
    },
    data() {
        return {
            tabIndex: 2,
            listData: [
                {
                    loading: 'more',
                    data: [],
                    lastId: '',
                    keyword: ''
                },
                {
                    loading: 'more',
                    data: [],
                    lastId: '',
                    keyword: ''
                },
                {
                    loading: 'more',
                },
            ],
            keyword: '',
            pageSize: 10,
            showState: 0,
            guid: '',
            flist: [],
            slist: {
                slidepic:[],
            },
            currentId:0,
            tabScrollTop:0
        };
    },
    onLoad(option) {
        this.guid = option.guid || '';
        this.getHomeList();
        this.getCompanyList();
        this.load();
    },
    onShow() {
        if (this.guid == '') {
            this.getInfo();
        } else {
            this.getToken();
        }
    },
    // 下拉刷新
    onPullDownRefresh() {
        this.listData[this.tabIndex].loading = 'more';
        this.listData[this.tabIndex].data = [];
        this.listData[this.tabIndex].lastId = '';
        this.listData[this.tabIndex].keyword = '';
        this.getInfo();
        if (this.tabIndex == 0) {
            this.getCompanyList();
        } else {
            this.getHomeList();
        }
    },
    onReachBottom() {
        if (this.listData[this.tabIndex].loading == 'nomore') return;
        if (this.tabIndex == 0) {
            this.getCompanyList();
        } else {
            this.getHomeList();
        }
    },
    methods: {
        ...mapMutations(['login']),
        // 获取token
        getToken() {
            let url = this.$api_url + 'helppoorcompetition2019/getWxToken';
            let data = this.$ajax.sign(url, {});
            data.guid = this.guid;
            let header = this.$ajax.header();
            let _this = this;
            uni.request({
                url: url,
                data: data,
                header: header,
                success: res => {
                    if (res.data.code == 0) {
                        let userInfo = {
                            guid: _this.guid,
                            token: res.data.result.data.token
                        };
                        _this.guid = '';
                        _this.login(userInfo);
                        _this.getInfo();
                    } else {
                        _this.$api.msg(res.data.msg);
                    }
                }
            });
        },
        // 获取自建列表
        getHomeList() {
            this.listData[1].loading = 'loading';
            this.$ajax
                .get('helppoorcompetition2019/homepage', {
                    pageSize: this.pageSize,
                    lastId: this.listData[1].lastId,
                    keyword: this.listData[1].keyword
                })
                .then(res => {
                    uni.stopPullDownRefresh();
                    if (res.data.code == 0) {
                        let data = res.data.result.data.suppliers.suppliers;
                        this.listData[1].data = this.listData[1].lastId == '' ? data : this.listData[1].data.concat(data);
                        this.listData[1].loading = data.length == this.pageSize ? 'more' : 'nomore';
                        if (data.length != 0) this.listData[1].lastId = data[data.length - 1].id;
                        this.$forceUpdate();
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
        },
        // 商城列表
        getCompanyList() {
            this.listData[0].loading = 'loading';
            this.$ajax
                .get('com/getCompanyPage', {
                    lid: this.listData[0].lastId,
                    pagesize: this.pageSize,
                    ordercondition: 1
                })
                .then(res => {
                    uni.stopPullDownRefresh();
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        this.listData[0].data = this.listData[0].lastId == '' ? data : this.listData[0].data.concat(data);
                        this.listData[0].loading = data.length == this.pageSize ? 'more' : 'nomore';
                        if (data.length != 0) this.listData[0].lastId = data[data.length - 1].id;
                        this.$forceUpdate();
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
        },
        // 搜索店铺
        searchCompany() {
            this.listData[this.tabIndex].loading = 'more';
            this.listData[this.tabIndex].data = [];
            this.listData[this.tabIndex].lastId = '';
            this.listData[this.tabIndex].keyword = this.keyword;
            this.getHomeList();
        },
        gosettled() {
            let userInfo = uni.getStorageSync('userInfo') || '';
            if (userInfo.guid) {
                uni.navigateTo({
                    url: '/pages/ranking/settled'
                });
            } else {
                uni.navigateTo({
                    url: '/pages/public/login'
                });
            }
        },
        // 标签选择
        tabClick(index) {
            this.tabIndex = index;
        },
        // 联系ta
        buttonClick(index) {
            let obj = this.listData[this.tabIndex].data[index];
            if (window.navigator.platform.indexOf('Win') >= 0) {
                uni.showModal({
                    title: '手机号',
                    content: obj.tel,
                    showCancel: false
                });
            } else {
                uni.makePhoneCall({
                    phoneNumber: obj.tel //仅为示例
                });
            }
        },
        // 店铺选择
        supplierClick(index) {
            let obj = this.listData[this.tabIndex].data[index];
            uni.navigateTo({
                url: '/pages/ranking/list?type=' + this.tabIndex + '&cguid=' + (this.tabIndex == 0 ? obj.companyguid : obj.id)
            });
        },
        // 查询用户是否入驻
        getInfo() {
            if (this.showState == 2) return;
            this.$ajax.get('helppoorcompetition2019/isSettled', {}).then(res => {
                if (res.data.code == 0) {
                    this.showState = res.data.result.data.isSettled == 0 ? 1 : 2;
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
        },
        refreshHome() {
            this.listData[1].lastId = '';
            this.getHomeList();
        },
        load(){
            this.$ajax.get('helppoorcompetition2019/getCategory', {}).then(res => {
                if(res.data.code==0){
                    this.flist = res.data.result.data;
                    let sj ={
                        ctype:res.data.result.data[0].ctype,
                        cid:res.data.result.data[0].categoryid
                    }
                    this.$ajax.get('helppoorcompetition2019/getCategoryInfo', sj).then(res => {
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
                // uni.navigateTo({
                //     url: '/pages/product/product?productid=' + tid.categoryid
                // });
            }else{
                uni.navigateTo({
                    url: '/pages/ranking/goodslist?cid=' + tid.categoryid
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
};
</script>

<style lang="scss">
.center {
    background: #f2f2f2;
    overflow: hidden;
}
.banner {
    width: 750rpx;
    height: 270rpx;
}
.supplier {
    display: flex;
    background: #fff;
    align-items: center;
    view {
        flex-grow: 1;
        font-size: 32rpx;
        text-align: center;
        line-height: 80rpx;
        border-bottom: 2px solid #fff;
        &.x {
            border-bottom: 2px solid $base-color;
        }
    }
}
.search {
    display: flex;
    padding: 10px 15px 0 15px;
    align-items: center;
    line-height: 30px;
    font-size: 14px;
    view {
        margin-right: 20px;
        background: rgb(232, 31, 29);
        border-radius: 20px;
        padding: 0 10px;
        color: #fff;
        min-width: 68px;
        text-align: center;
        img {
            width: 14px;
            height: 16px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 4px;
        }
        span {
            display: inline-block;
            vertical-align: middle;
        }
    }
    .input {
        background: #fff;
        padding: 0;
        color: #333;
        display: flex;
        align-items: center;
        flex-grow: 1;
        font-size: 14px;
        line-height: 30px;
        margin-right: 0;
        border-radius: 20px;
        input {
            padding-left: 40px;
            background: url(../../static/search.png) no-repeat left 10px center #ffffff;
            background-size: 18px 18px;
            height: 30px;
            flex-grow: 1;
            border-radius: 20px;
            text-align: left;
        }
        .btnse {
            margin-right: 0;
            min-width: 120rpx;
            text-align: center;
        }
    }
}
.shoplist {
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx;
    .item {
        width: 48%;
        margin-bottom: 30upx;
        background: #fff;
        border-radius: 20rpx;
        font-size: 28rpx;
        padding: 20rpx;
        &:nth-child(2n + 1) {
            margin-right: 4%;
        }
        .title {
            display: flex;
            align-items: center;
            padding-bottom: 10rpx;
            image {
                width: 50rpx;
                height: 50rpx;
                border-radius: 50%;
                min-width: 50rpx;
            }
            .name{
                padding-left: 10rpx;
                flex-grow: 1;
            }
            .tel {
                background: rgb(232, 31, 29);
                color: #fff;
                padding: 4rpx 12rpx;
                border-radius: 24rpx;
                min-width: 120rpx;
                text-align: center;
            }
        }
        .heads{
            padding: 10rpx 0;
            text-align: center;
            font-size: 32rpx;
        }
        .shopbander {
            width: 100%;
            height: 180rpx;
        }
        .scope {
            background: url(../../static/tab-shop.png) no-repeat left center;
            padding-left: 40rpx;
            background-size: 30rpx 30rpx;
        }
        .address {
            background: url(../../static/address.png) no-repeat left center;
            padding-left: 40rpx;
            background-size: 30rpx 30rpx;
        }
    }
}
.enterprise {
    margin: 10px 15px 0 15px;
    padding: 10px;
    background: #fff;
    border-radius: 10px;
    color: #929292;
    .head {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 10px;
        img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 10px;
        }
        .con {
            flex-grow: 1;
            .title {
                font-size: 16px;
                font-weight: 600;
                color: #333333;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                line-height: 1.5;
                margin-bottom: 5px;
            }
            .tel span {
                margin-left: 6px;
            }
        }
        .contact {
            background: rgb(232, 31, 29);
            color: #fff;
            padding: 4px 8px;
            border-radius: 12px;
            min-width: 60px;
            text-align: center;
        }
    }
    .tip {
        font-size: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .addres {
        font-size: 12px;
    }
}

.contents {
		display: flex;
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
	}
    
</style>
