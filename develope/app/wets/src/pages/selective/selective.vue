<template>
    <view>
        <view class="nav-head" v-if="backstate">
            <div class="uni-page-head-hd"><div class="uni-page-head-btn" @click="backnav"><i class="uni-btn-icon" style="color: rgb(0, 0, 0); font-size: 27px;"></i></div></div>
            <view class="nav-bd"><view class="uni-page-head__title">网易严选</view></view>
        </view>
        <template v-for="(row,indexrow) in list">
            <template v-if="row.elementType == 'SEARCH' && $title">
                <view class="nav" :class="{x:backstate}" :key="row.elementId" @click="gosearch()">
                    <text>搜索</text>
                </view>
            </template>
            <template v-if="row.elementType == 'SLIDESHOW'">
                <view class="swiiper" :key="row.elementId">
                    <swiper class="carousel" autoplay circular indicator-dots previous-margin="15px" next-margin="15px">
                        <swiper-item class="carousel-item" v-for="(item,index) in row.detail" :key="index" @click="goswiper(item)">
                            <img :src="item.pictureUrl" />
                        </swiper-item>
                    </swiper>
                </view>
            </template>
            <template v-if="row.elementType == 'CATEGORY'">
                <view class="entrance" :key="row.elementId">
                    <view class="item" v-for="(item,index) in row.detail" @click="gocategory(item)" :key="index" v-if="index<8">
                        <image :src="item.url" mode="aspectFill"></image>
                        <view>{{item.name}}</view>
                    </view>
                </view>
            </template>
            <template v-if="row.elementType == 'PRODUCTS'">
                <view class="list" :key="row.elementId">
                    <view class="item" :class="{x:index % 2 != 0}" v-for="(item,index) in row.detail" :key="index" @click="goproducts(item)">
                        <image class="stata" :src="item.newOnShelvesProductIcon" mode="aspectFill" v-if="item.isNewOnShelvesProduct == 1"></image>
                        <image class="img" :src="item.productPicUrl" mode="aspectFill" v-if="index % 2 == 0"></image>
                        <view class="main">
                            <view class="title">{{item.productName}}</view>
                            <view class="tip" v-html="item.detail"></view>
                            <view v-if="row.display.isShowActivity == 1">
                                <text class="tips" v-for="im in item.activity" :key="im.content" :style="{background:im.color}">{{im.title}}</text>
                            </view>
                            <view class="price">
                                <text class="new"><text>￥</text>{{item.newPrice}}</text>
                                <text class="old" v-if="row.display.isShowOldPrice == 1"><text>￥</text>{{item.oldPrice}}</text>
                            </view>
                            <view class="buy">
                                <image :src="row.display.shopcartPicUrl" mode="aspectFill"></image>
                            </view>
                        </view>
                        <image class="img" :src="item.productPicUrl" mode="aspectFill" v-if="index % 2 != 0"></image>
                    </view>
                </view>
            </template>
            <template v-if="row.elementType == 'JUMP_PIC'">
                <view :key="row.elementId" style="font-size: 0;">
                    <image class="head" :src="itm.pictureUrl" mode="aspectFill" v-for="(itm,ins) in row.detail" :key="ins" :style="{height:(750/row.display.width * row.display.height)+'rpx'}"></image>
                </view>
            </template>
            <template v-if="row.elementType == 'CATEGORY_PRODUCT'">
                <view class="module" :key="row.elementId" v-if="row.detail.length != 0" :style="{ background: row.display.spaceColor }">
                    <view class="unset">
                        <view class="item" v-for="(item,index) in row.detail" @click="goproduct(item)" :key="index">
                            <image :src="item.url" mode="aspectFill"></image>
                            <view class="title">{{item.name}}</view>
                            <view>
                                <text class="new">￥{{item.newprice}}</text>
                                <text class="old" v-if="row.display.isShowOldPrice == 1">￥{{item.oldprice}}</text>
                                <block v-if="row.display.isShowActivity == 1">
                                    <text class="tips" v-for="im in item.activitylist" :key="im.wholetext" :style="{color:im.color,borderColor:im.color}">{{im.wholetext}}</text>
                                </block>
                            </view>
                        </view>
                    </view>
                    <view class="more" @click="gomore(row.elementId,indexrow)" v-if="row.detail.length % 12 == 0">查看更多</view>
                </view>
            </template>
            <template v-if="row.elementType == 'HOR_NAVIGATION'">
                <view :key="row.elementId">
                    <scroll-view class="wuc" scroll-x>
                        <text :class="selectedIndex == index ? 'item active' : 'item'"  v-for="(item,index) in row.detail" :key="index" @tap="target(index)">{{ item.title }}</text>
                    </scroll-view>
                    <view class="goods-list">
                        <view class="goods-item" v-for="(item, index) in row.detail[selectedIndex].horNavigationDetail" :key="index" @click="goproducts(item)">
                            <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
                            <view class="image-wrapper">
                                <image :src="item.productPicUrl" mode="aspectFill"></image>
                            </view>
                            <view class="item-con">
                                <view class="title">{{ item.productName }}</view>
                                <view class="price-box clamp">
                                    <text class="price">{{ item.newPrice }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <template v-if="row.elementType == 'CATEGORY_TAB'">
                <view :key="row.elementId">
                    <view class="elasticlist">
                        <scroll-view class="wuc" :class="{x:row.detail.length>4}" scroll-x id="luTabStatic" @scroll="scrollleft($event)" :scroll-left="scroll_left">
                            <text :class="row.select == index ? 'item active' : 'item'"  v-for="(item,index) in row.detail" :key="index" @tap="targets(row,index)">{{ item.name }}</text>
                        </scroll-view>
                        <image src="../../static/xjt.png" mode="aspectFill" @click="openelastic(row)" v-if="row.detail.length>4"></image>
                    </view>
                    <view class="elasticlist fidex" :class="{x:backstate}" v-if="barShow">
                        <scroll-view class="wuc" :class="{x:row.detail.length>4}" scroll-x @scroll="scrollleft($event)" :scroll-left="scroll_left">
                            <text :class="row.select == index ? 'item active' : 'item'"  v-for="(item,index) in row.detail" :key="index" @tap="targets(row,index)">{{ item.name }}</text>
                        </scroll-view>
                        <image src="../../static/xjt.png" mode="aspectFill" @click="openelastic(row)" v-if="row.detail.length>4"></image>
                    </view>
                    
                    <view class="goods-list">
                        <view class="goods-item" v-for="(item, index) in row.list"  @click="goproduct(item)" :key="index">
                            <view class="image-wrapper">
                                <image :src="item.url" mode="aspectFill"></image>
                            </view>
                            <view class="item-con">
                                <view class="title">{{ item.name }}</view>
                                <view class="price-box clamp">
                                    <text class="price"><text>￥</text>{{ item.newprice }}</text>
                                    <template v-if="item.activitylist.length > 0">
                                        <text class="se" v-for="ite in item.activitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                                    </template>
                                </view>
                            </view>
                        </view>
                    </view>
                    <uni-load-more :status="loadingType"></uni-load-more>
                </view>
            </template>
        </template>
        <view class="elastic" :class="{x:elasticatart}">
            <view class="bg" @click="closeelastic()"></view>
            <view class="main" :style="{top:elastictop+'px'}">
                <view class="headse">
                    <view class="title">
                        切换分类
                    </view>
                    <image src="../../static/sjt.png" mode="aspectFill" @click="closeelastic()"></image>
                </view>
                <view class="listse">
                    <view :class="rowlist.select == index ? 'item x' : 'item'"  v-for="(item,index) in rowlist.detail" :key="index" @tap="targets(rowlist,index)">{{ item.name }}</view>
                </view>
            </view>
        </view>
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
                id:0,
                cguid:0,
                list:[],
                selectedIndex:0,
                select:0,
                tabList:[],
                barShow:false,
                elementId:0,
                pagesize:12,
                lid:'',
                loadingType:'more',
                backstate:false,
                elasticatart:false,
                elastictop:0,
                rowlist:[],
                scroll_left:0
            };
        },
        onLoad(option) {
            var that = this;
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/holdmall/i) == 'holdmall') {
                that.backstate = true;
                that.$util.bridgeAndroidAndIOS(function(){
                    that.id = uni.getStorageSync('parameter').activityID;
                    that.load();
                })
            }else{
                that.id = option.id;
                that.cguid = option.cguid;
                that.load();
            }
            
        },
        onPullDownRefresh() {
            this.load();
        },
        onReachBottom() {
            if(this.loadingType != 'nomore'){
                this.moretablist();
            }
        },
        methods:{
            load(){
                var date = {posterId:this.id};
                this.$ajax.get('poster/getPoster', date).then(res => {
                    if (res.data.code == 0) {
                       this.list = res.data.result.data;
                    }
                }).then(res =>{
                    var that = this;
                    this.list.forEach(function(item,index){
                        if(item.elementType == 'CATEGORY_TAB'){
                            that.tablist(item,0);
                        }
                    })
                    uni.stopPullDownRefresh();
                });
            },
            backnav(){
                this.$jump.back();
            },
            gosearch(){
                uni.navigateTo({
                    url: '/pages/selective/search?activityID=' + this.id
                });
            },
            target(index){
                this.selectedIndex = index;
            },
            goswiper(item){
                let type = item.jumpType;
                if(type == 'ACTIVITY'){
                    this.$jump.jumpApp(1,item.activityId);
                }else if(type == 'PRODUCT'){
                    this.$jump.jumpApp(2,item.productId);
                }else if(type == 'H5'){
                    this.$jump.jumpApp(3,item.jumpLink);
                }
            },
            gocategory(item){
                uni.navigateTo({
                    url: '/pages/selective/typelist?id=' + item.category_id +"&name="+ item.name
                });
            },
            goproducts(item){
                this.$jump.jumpMethod(item.productId);
            },
            goproduct(item){
                this.$jump.jumpMethod(item.id);
            },
            gomore(id,index){
                let lid = this.list[index].detail[this.list[index].detail.length-1].id;
                this.$ajax.get('poster/getProductPage', {elementId:id,pagesize:this.pagesize,lid:lid}).then(res => {
                    if (res.data.code == 0) {
                        this.list[index].detail = this.list[index].detail.concat(res.data.result.data);
                    }
                });
            },
            targets(row,index){
                this.scroll_left = 76*(index-1);
                this.tablist(row,index);
                this.elasticatart = false;
                this._queryMultipleNodes('#luTabStatic', true).then(res => {
                    let tabNav = res[0];
                    if (tabNav.top <= 0) {
                        uni.pageScrollTo({
                            scrollTop: res[1].scrollTop + tabNav.top,
                            duration: 0
                        });
                    }
                });
            },
            tablist(item,index){
                var that = this;
                that.$ajax.get('poster/getCategoryProductPage', {categoryId:item.detail[index].category_id,pagesize:that.pagesize}).then(res => {
                    if (res.data.code == 0) {
                        that.$set(item, 'list', res.data.result.data);
                        that.$set(item, 'select', index);
                        if(res.data.result.data.length == that.pagesize){
                            that.loadingType= 'more';
                        }else{
                            that.loadingType= 'nomore';
                        }
                    }
                });
            },
            moretablist(){
                var that = this;
                that.loadingType= 'loading';
                this.list.forEach(function(item,index){
                    if(item.elementType == 'CATEGORY_TAB'){
                        that.$ajax.get('poster/getCategoryProductPage', {categoryId:item.detail[item.select].category_id,pagesize:that.pagesize,lid:item.list[item.list.length-1].id}).then(res => {
                            if (res.data.code == 0) {
                                that.$set(item, 'list', item.list.concat(res.data.result.data));
                                if(res.data.result.data.length == that.pagesize){
                                    that.loadingType= 'more';
                                }else{
                                    that.loadingType= 'nomore';
                                }
                            }
                        });
                    }
                })
                
            },
            scrollleft(event){
                this.scroll_left = event.detail.scrollLeft
            },
            _queryMultipleNodes: function(e, notThis) {
                return new Promise((resolve, reject) => {
                    let view = uni.createSelectorQuery().in(this);
                    view.select(e).boundingClientRect();
                    view.selectViewport().scrollOffset()
                    view.exec(function(res) {
                        resolve(res);
                    });
                });
            },
            _showBarFixed: function() {
                this._queryMultipleNodes('#luTabStatic', true).then(res => {
                    let tabNav = res[0];
                    if(this.backstate){
                        if (tabNav.top <= 44) {
                            this.elastictop = 44;
                            this.barShow = true;
                        } else {
                            this.elastictop = tabNav.top;
                            this.barShow = false;
                        }
                    }else{
                        if (tabNav.top <= 0) {
                            this.elastictop = 0;
                            this.barShow = true;
                        } else {
                            this.elastictop = tabNav.top;
                            this.barShow = false;
                        }
                    }
                });
            },
            openelastic(row){
                this.rowlist = row;
                this._queryMultipleNodes('#luTabStatic', true).then(res => {
                    let tabNav = res[0];
                    if(this.backstate){
                        if (tabNav.top <= 44) {
                            this.elastictop = 44;
                        } else {
                            this.elastictop = tabNav.top;
                        }
                    }else{
                        if (tabNav.top <= 0) {
                            this.elastictop = 0;
                        } else {
                            this.elastictop = tabNav.top;
                        }
                    }
                    
                });
                this.elasticatart = true;
            },
            closeelastic(){
                this.elasticatart = false;
            }
        },
        onPageScroll: function(e) {
            this._showBarFixed();
        }
    }
</script>

<style lang="scss">
    page {
        background: #f1f1f1;
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
    .nav{
        background: #FFF;
        overflow: hidden;
        &.x{
            margin-top: 44px;
        }
        text{
            display: block;
            margin: 20rpx 30rpx 0 30rpx;
            background:url(../../static/searchse.png) no-repeat left 20rpx center #F2F2F2;
            background-size: 36rpx 36rpx;
            border-radius: 30rpx;
            padding: 14rpx 40rpx 14rpx 66rpx;
            font-size: 26rpx;
            color: #969696;
        }
    }
    .swiiper {
        background: #FFF;
        padding: 20rpx 0;
        height: 290rpx;
        .carousel{
            width: 100%;
            height: 100%;
        }
        .carousel-item {
            padding: 0 6px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 10rpx;
            }
        }
    }

    .entrance {
        overflow: hidden;
        background: #FFF;
        padding:0 20rpx;

        .item {
            padding:0 0 10px 0;
            width: 25%;
            text-align: center;
            float: left;
            font-size: 24rpx;
            image {
                width: 100rpx;
                height: 100rpx;
                margin: 10rpx auto;
                display: block;
            }
        }
    }

    .list {
        .item {
            margin-top: 20rpx;
            background: #FFF;
            padding: 20rpx;
            display: flex;
            position: relative;
            
            .stata{
                position: absolute;
                width: 60rpx;
                height: 60rpx;
                left: 20rpx;
                top:20rpx;
                z-index: 1;
            }
            .img {
                width: 280rpx;
                min-width: 280rpx;
                height: 280rpx;
            }

            .main {
                padding-left: 16rpx;
                flex: 1;
                position: relative;
                .title {
                    font-size: 30rpx;
                    line-height: 36rpx;
                    color: #333;
                    font-weight: 700;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-wrap:break-word;
                    max-height: 80rpx;
                    word-break:break-all;
                }

                .tip {
                    font-size: 24rpx;
                    line-height: 30rpx;
                    color: #969696;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    word-wrap:break-word;
                    max-height: 120rpx;
                    word-break:break-all;
                }

                .tips {
                    display: inline-block;
                    padding: 0 16rpx;
                    font-size: 24rpx;
                    margin-right: 20rpx;
                    background: #0081FF;
                    border-radius: 20rpx;
                    color: #FFF;
                    line-height: 40rpx;
                    height: 40rpx;
                }

                .price {
                    display: flex;
                    align-items: center;
                    margin-top: 6rpx;
                    .new {
                        font-size: 40rpx;
                        color: #EE3847;
                        text{
                            font-size: 30rpx;
                        }
                    }

                    .old {
                        padding-left: 10rpx;
                        font-size: 24rpx;
                        color: #929292;
                        flex: 1;
                        text-decoration: line-through;
                    }

                    
                }
                .buy {
                    position: absolute;
                    right: 0rpx;
                    bottom: 0rpx;
                    font-size: 0;
                    image{
                        width: 60rpx;
                        height: 60rpx;
                    }
                }

            }

            &.x {
                .main {
                    padding-left: 0;
                    padding-right: 16rpx;
                }
                .stata{
                    right: 320rpx;
                        left: auto;
                }
                .buy {
                    right: 16rpx;
                }
            }
        }
    }
    .head{
        width: 100%;
    }
    .module {
        background: #a7d3fd;
        overflow: hidden;
        
        .unset{
            display: flex;
            align-items: stretch;
            flex-wrap:wrap;
            .item{
                width: 32%;
                background: #FFF;
                margin: 0.6%;
                image{
                    width: 100%;
                    height: 260rpx;
                }
                .title{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    height: 60rpx;
                    line-height: 30rpx;
                    color: #333333;
                    font-size: 24rpx;
                    padding:0 8rpx;
                    word-break:break-all;
                }
                .new{
                    padding-left: 10rpx;
                    font-size: 28rpx;
                    color: #EE3847;
                    text{
                        font-size: 24rpx;
                    }
                }
                .old{
                    padding-left: 10rpx;
                    font-size: 24rpx;
                    color: #929292;
                    text-decoration:line-through;
                }
                .tips{
                    display: inline-block;
                    border: 1px solid #ddd;
                    border-radius: 30rpx;
                    padding: 0 10rpx;
                    margin-left: 10rpx;
                    font-size: 24rpx;
                    line-height: 28rpx;
                    height: 30rpx;
                }
            }
        }
        .more{
            width: 280rpx;
            line-height: 60rpx;
            font-size: 28rpx;
            color: #FFF;
            border: 1px solid #FFF;
            border-radius: 30rpx;
            margin: 20rpx auto;
            text-align: center;
        }
    }
    
    .wuc{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        align-items: center;
        background-color: #fff;
        height: 92rpx;
        flex: 1;
        &.x{
            width: 70%;
        }
        .item{
            line-height: 88rpx;
            padding: 22rpx 16rpx;
            margin: 0 8rpx;
            white-space: nowrap;
            border-bottom: 2px solid #FFF;
            font-size: 28rpx;
            &.active{
                border-bottom: 2px solid #EE3847;
            }
        }
    }
    .fidex{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        z-index: 3;
        &.x{
            top:44px;
        }
    }
    .elasticlist{
        display: flex;
        align-items: center;
        background: #FFF;
        image{
            width: 80rpx;
            height: 60rpx;
            margin-right: 10rpx;
            padding: 25rpx 30rpx;
        }
    }
    .elastic{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: none;
        z-index: 3;
        &.x{
            display: block;
        }
        .bg{
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background: rgba($color: #000000, $alpha: 0.6);
        }
        .main{
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            background: #FFF;
            .headse{
                display: flex;
                align-items: center;
                line-height: 60rpx;
                padding: 10rpx;
                .title{
                    flex: 1;
                    font-size: 28rpx;
                }
                image{
                    width: 80rpx;
                    height: 60rpx;
                    padding: 25rpx 30rpx;
                }
            }
            .listse{
                overflow: hidden;
                .item{
                    width: 30%;
                    margin:0 1.65% 2.65% 1.65%;
                    display: inline-block;
                    font-size: 24rpx;
                    color: #595757;
                    background: #F5F5F5;
                    border-radius: 30rpx;
                    text-align: center;
                    padding: 16rpx 0;
                    &.x{
                        color: #EE3847;
                        background: #FDEFED;
                    }
                }
            }
        }
    }
    .goods-list{
        background: #FFF;
        .title{
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            max-height: 80rpx;
            line-height: 40rpx;
            color: #333333;
            font-size: 28rpx;
            margin-bottom: 6rpx;
            word-break:break-all;
        }
        .price-box{
            justify-content: inherit;
            .price{
                font-size: 40rpx;
                text{
                    font-size: 24rpx;
                }
            }
            
            .se{
                display: inline-block;
                border: 1px solid #ddd;
                border-radius: 30rpx;
                padding: 0 10rpx;
                margin-left: 5px;
                font-size: 24rpx;
                line-height: 32rpx;
                height: 32rpx;
            }
        }
        
        .image-wrapper {
            width: 100%;
            height: 330upx;
            border-radius: 3px;
            overflow: hidden;
            image {
                width: 100%;
                height: 330upx;
            }
        }
    }
    .goods-list .goods-item .item-con {
        padding: 10rpx;
    }
</style>
