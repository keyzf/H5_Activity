<template>
    <view class="content">

        <view class="navbar">
            <view v-for="(item, navList_index) in navList" :key="navList_index" class="nav-item" :class="{ current: tabCurrentIndex === navList_index }"
                @click="tabClick(navList_index,item.type)">{{ item.name }} <text v-if="item.count>0" class="tip">{{item.count}}</text></view>
        </view>
        <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
            <swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
                <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
                    <!-- 空白页 -->
                    <empty v-if="tabItem.loaded === true && tabItem.msg_list.length === 0"></empty>
                    <!-- 消息 -->
                    <view class="item" v-for="(item,index) in tabItem.msg_list" :key="index" @click="onclick_f(tabItem.type,item.direction,item.title,item.pushtype)">
                        <view class="title" :class="{read:item.state==1}">{{item.title}}</view>
                        <view class="tip">{{item.content}}</view>
                        <view class="time">{{item.pushtime}}</view>
                       <!-- item.state  判断已读未读 1已读  0未读-->
                    </view>
                    <uni-load-more :status="tabItem.loadingType"></uni-load-more>
                </scroll-view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    import empty from "@/components/empty";
    export default {
        components: {
            uniLoadMore,
            empty
        },
        /*
        数据格式 改为这种格式 切换swiper的 index 是list数据的下标
         [
           {
           	type: 3,
           	name: '',
             count:0,    
           	lid:'', 末条数据的id
           	msg_list: [] //数据列表
             loadingType 加载 无更多 有更多
           } 
          ] */
        data() {
            return {
                tabCurrentIndex: 0,
                navList: [],
                pagesize: 10,
                lastid: 0,

            };
        },
        onLoad(options) {
            this.title_load();
            this.cguid = uni.getStorageSync('companyguid');
        },
        onBackPress(){
            this.$api.ovPage()
        },
        //下拉刷新
        onPullDownRefresh() {
            let navitem = this.navList[this.tabCurrentIndex];
            this.msg_list(navitem.type, 'refresh')
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        methods: {
            //标题
            title_load() {
                let data = {}
                this.$ajax.get('pushmessage/getMessageHeadAndNumber', data).then(res => {
                    if (res.data.code == 0) {
                        let res_data = res.data.result.data;
                        for (let i = 0; i < res_data.length; i++) {
                            res_data[i].loadingType = 'more'
                            res_data[i].lid = "";
                            res_data[i].msg_list = [];
                        }
                        this.navList = res_data
                        //第一次加载
                        this.msg_list(this.navList[0].type);
                        this.$forceUpdate();
                    }
                })
            },
            //swiper 切换
            changeTab(e) {
                this.tabCurrentIndex = e.target.current;
                let type = this.navList[this.tabCurrentIndex].type
                this.msg_list(type, 'tabChange');
                //this.datalist('tabChange');
            },
            tabClick(index, type) {
                this.tabCurrentIndex = index;
            },
            //数据列表
            msg_list(list_type, load_type) {
                let lid = this.navList[this.tabCurrentIndex].lid;
                if (load_type == 'refresh') {
                    this.navList[this.tabCurrentIndex].msg_list = [];
                    lid = '';
                }
                //tab切换只有第一次需要加载数据
                if (load_type === 'tabChange' && this.navList[this.tabCurrentIndex].loaded === true) {
                    return;
                }
                let data = {
                    pagesize: this.pagesize,
                    lastid: lid,
                    type: list_type
                }
                this.$forceUpdate();
                this.$ajax.get('pushmessage/getMessages', data).then(res => {
                    if (res.data.code == 0) {
                        let res_data = res.data.result.data;
                        if (res_data.length > 0) {
                            this.navList[this.tabCurrentIndex].msg_list = this.navList[this.tabCurrentIndex].msg_list
                                .concat(res_data);
                            this.navList[this.tabCurrentIndex].lid = res_data[res_data.length - 1].id;
                        }
                        this.navList[this.tabCurrentIndex].loadingType = res_data.length == 10 ? 'more' :
                            'noMore'
                        //loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
                        this.$set(this.navList[this.tabCurrentIndex], 'loaded', true);
                        if (load_type == 'refresh') {
                            uni.stopPullDownRefresh();
                        }
                    }
                })
            },
            //加载更多
            loadData() {
                if (this.navList[this.tabCurrentIndex].loadingType === 'noMore') {
                    return;
                }
                let navitem = this.navList[this.tabCurrentIndex];
                this.msg_list(navitem.type, 'more')
            },
            //点击跳转
            onclick_f(state,direction,title,pushtype){
                //type 1 物流  2 商品  0 通知 3活动 7店铺首页
                let url = "";
                switch (pushtype){
                    case 0:
						url = '/pages/establishment/strategy?type=information&information_url=' + direction + "&title=" + title
                        break;
                    case 1:
                        url = "/pages/order/logistics?ordernum=" + direction
                        break;
                    case 2:
                        url = "/pages/product/product?productid=" + direction
                        break;
                    case 3:
                        let id = direction.split(",")[0];
                        switch (id){
                            case "BUYLIMIT":
                                url = '/pages/product/rushbuy';
                                break;
                            case "NEWPRODUCT":
                                url = '/pages/product/fashionable?id=' + direction.split(",")[1];
                                break;
                            default:
                                url = "/pages/product/catelist?id=" + direction.split(",")[1];
                                break;
                        }
                        break;
                    case 7:
                        url = "/pages/product/shop?cguid=" + direction
                        break;
                }
                uni.navigateTo({
                	url:url
                })
            },

        },

    }
</script>

<style lang="scss">
    page,
    .content {
        background: $page-color-base;
        height: 100%;
    }

    .swiper-box {
        height: calc(100% - 80rpx);
    }

    .list-scroll-content {
        height: 100%;
    }

    .navbar {
        display: flex;
        height: 40px;
        padding: 0 5px;
        background: #fff;
        box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
        position: relative;
        z-index: 10;

        .nav-item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-size: 15px;
            color: $font-color-dark;
            position: relative;

            &.current {
                color: $base-color;
                &:after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    transform: translateX(-50%);
                    width: 44px;
                    height: 0;
                    border-bottom: 2px solid $base-color;
                }
            }
            .tip{
                margin-top: -16rpx;
                display: inline-block;
                padding:6rpx;
                border-radius: 50%;
                top: 0;
                right: 20%;
                background: $base-color;
                color: #FFF;
                min-width: 32rpx;
                text-align: center;
                font-size: 24rpx;
                line-height: 1;
            }
        }
    }

    .item {
        width: 90%;
        margin: 30rpx;
        background: #FFFFFF;
        border-radius: 20rpx;
        padding: 20rpx;

        .title {
            font-size: 32rpx;
            margin-bottom: 16rpx;
            font-weight: 600;
            &.read{
                color: #999999;
            }
        }

        .tip {
            font-size: 28rpx;
            margin-bottom: 26rpx;
            color: rgb(153, 153, 153);
        }

        .time {
            font-size: 28rpx;
            color: rgb(161, 161, 161);
        }
    }
</style>
