<template>
    <view class="container" :class="{ over: overf }">
        <view id="detimal">
            <view class="carousel">
                <swiper indicator-dots circular="true" duration="400" @change="closevideo">
                    <swiper-item class="swiper-item" v-for="(item, index) in data.picture.urlList" :key="index">
                        <view class="image-wrapper">
                            <block v-if="item.videourl != ''">
                                <video class="videoys" id="myVideo" :src="item.videourl" :poster="data.shareinfo.sharepicurl" :enable-progress-gesture="progressgesture"></video>
                            </block>
                            <block v-else><image :src="item.url" mode="aspectFill"></image></block>
                        </view>
                    </swiper-item>
                </swiper>
                <image v-if="data.activityIconSwitch == 1" :src="data.activityIcon" mode="aspectFit" class="titleicon"></image>
            </view>
            <view class="rob" v-if="data.robstate <= 1">
                <view class="con">
                    <view class="new">{{ data.newPriceRange }}</view>
                    <view class="old">{{ data.oldPriceRange }}</view>
                </view>
                <view class="tip">{{ data.robstatetext }}</view>
                <view class="time"><countdown :time="data.time" @timeup="robtip(data.robstatetext)"></countdown></view>
            </view>
            <view class="introduce-section">
                <view class="price-box">
                    <text class="price">{{ data.newPriceRange }}</text>
                    <text class="m-price">{{ data.oldPriceRange }}</text>
                    <text class="totalSales">{{ data.totalSales }}人已购买</text>
                </view>
                <view class="title">
                    <text v-if="data.maxdiscounts != '' || data.presell != ''" class="preferential">{{ data.maxdiscounts == '' ? data.presell : data.maxdiscounts }}</text>
                    <image v-if="data.activityTitleIconSwitch == 1" :src="data.activityTitleIcon" mode="aspectFit"></image>
                    {{ data.mainheading }}
                </view>
                <view class="title-tip">{{ data.subheading }}</view>
                
                <!-- <view class="bot-row">
				<text>销量:{{data.totalSales}}</text>
				<text>库存: 4690</text>
				<text>浏览量: 768</text>
			</view> -->
            </view>
            <view class="share-section">
                <view class="share-icon" v-for="(item, index) in data.after_sale_list" :key="index">
                    {{ item }}
                </view>
            </view>
            <view class="c-list">
                <view class="c-row b-b" v-if="data.coupons" @click="toggleMask()">
                    <text class="tit">领券</text>
                    <text class="con t-r red">{{ data.coupons }}</text>
                    <text class="yticon icon-you"></text>
                </view>
                <view class="c-row b-b" @click="openactivity()" v-if="data.activity.length != 0">
                    <text class="tit">活动</text>
                    <view class="con-list clamp">
                        <view class="clamp" v-for="(ite, ind) in data.activity" :key="ind">
                            <text class="con t-r red">{{ ite.title }}</text>
                            <text class="con t-r">{{ ite.content }}</text>
                        </view>
                    </view>
                    <text class="yticon icon-you"></text>
                </view>
                <view class="c-row b-b" v-if="data.points != ''">
                    <text class="tit">积分</text>
                    <view class="con-list">
                        <text>{{ data.points }}</text>
                    </view>
                </view>
                <view class="c-row b-b" @click="switchaddress()">
                    <text class="tit">配送</text>
                    <view class="con-list clamp">
                        <text class="con t-r red">{{ data.stockText }}</text>
                        <text>{{ data.stockAddress }}</text>
                    </view>
                    <text class="yticon icon-you"></text>
                </view>
                <view class="c-row b-b">
                    <text class="tit">运费</text>
                    <view class="con-list">
                        <text>{{ data.freight }}</text>
                    </view>
                </view>
                <view class="c-row b-b" @click="toggleSpec">
                    <text class="tit">规格</text>
                    <view class="con">
                        <block v-if="specList.length != 0">
                            <text class="selected-text">
                                <text v-for="(item, index) in specList" :key="index">{{ item }}</text>
                                * {{ number }}
                            </text>
                        </block>
                    </view>
                    <text class="yticon icon-you"></text>
                </view>
                <view class="c-row b-b" @click="openparameter()">
                    <text class="tit">参数</text>
                    <view class="con-list"></view>
                    <text class="yticon icon-you"></text>
                </view>
            </view>

            <view class="stores" @click="goshop(data.companyInfo.isSelf, data.companyInfo.companyguid)">
                <view v-if="data.companyInfo.isSelf == 0"><img :src="data.companyInfo.logo" class="img" /></view>
                <view class="tit">
                    <view>
                        <text class="icon" v-show="data.companyInfo.companyLabel">{{ data.companyInfo.companyLabel }}</text>
                        <text>{{ data.companyInfo.companyname }}</text>
                    </view>
                    <view v-if="data.companyInfo.isSelf == 0" class="tip">{{ data.companyInfo.attentionMsg }}</view>
                </view>
                <view class="btn">
                    进店
                    <text class="yticon icon-you"></text>
                </view>
            </view>
            <!-- 评价 -->
            <view class="eva-section" @click="evaluateClick">
                <view class="e-header yticon icon-you"><text class="tit">评价</text></view>
            </view>
        </view>
        <view class="detail-desc">
            <view class="d-header"><text>图文详情</text></view>
            <view class="detail-con" v-html="showpage"></view>
            <!-- <u-parse :content="showpage" class="conhtml"></u-parse> -->
        </view>
        <view v-if="data.isuse == 0 && data.stockState ==0" class="maxmara">
            {{data.stockNullText}}
        </view>
        <!-- 底部操作菜单 -->
        <view class="page-bottom" v-if="showtab && data.productkind != 4">
            <view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite">
                <text class="yticon icon-shoucang"></text>
                <text>关注</text>
            </view>
            <view v-if="data.companyInfo.isSelf == 0" @click="chat" class="p-b-btn">
                <text class="yticon icon-pinglun-copy"></text>
                <text>客服</text>
            </view>
            <view @click="switchclick" class="p-b-btn">
                <text class="yticon icon-gouwuche"></text>
                <text>购物车</text>
                <text v-if="cartnumber != 0" class="cart-number">{{ cartnumber }}</text>
            </view>
            <view class="action-btn-group" v-if="data.isuse == 0 && data.stockState !=0">
                <button type="primary" class=" action-btn no-border buy-now-btn" @click="buycard">加入购物车</button>
                <button type="primary" class=" action-btn no-border add-cart-btn" @click="buy">立即购买</button>
            </view>
            <view v-else-if="data.isuse == 0 && data.stockState ==0" class="action-btn-group">
                <button type="primary" class="action-btn no-border no" style="background-color: #afafaf;">立即购买</button>
            </view>
            <view v-else-if="data.isuse == 1" class="action-btn-group">
                <button type="primary" class="action-btn no-border no" style="background-color: #afafaf;">商品已售罄</button>
            </view>
            <view v-else-if="data.isuse == 2" class="action-btn-group">
                <button type="primary" class="action-btn no-border no" style="background-color: #afafaf;">商品已下架</button>
            </view>
            <view class="action-btn-group" v-else-if="data.isuse == 3">
                <button type="primary" class="action-btn no-border no" style="background-color: #afafaf;">商品预上架</button>
            </view>
            <view class="action-btn-group" v-else-if="data.isuse == 4"><button type="primary" class="action-btn no-border no" @click="toggleSpec">立即预定</button></view>
            <view class="action-btn-group" v-else-if="data.isuse == 5">
                <button type="primary" class="action-btn no-border no" @click="toggleSpec">{{ data.isuseDescrible }}</button>
            </view>
            <view class="action-btn-group" v-else-if="data.isuse == 6">
                <button type="primary" class="action-btn no-border no" style="background-color: #afafaf;">不在预定时间</button>
            </view>
            <view class="action-btn-group" v-else-if="data.isuse == 7">
                <button type="primary" class="action-btn no-border no" style="background-color: #afafaf;">店铺装修中</button>
            </view>
        </view>

        <!-- 规格-模态层弹窗 -->
        <!-- <view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec"> -->
        <view class="popup spec" :class="specClass" @click="toggleSpec">
            <!-- 遮罩层 -->
            <view class="mask"></view>
            <view class="layer attr-content" @click.stop="stopPrevent">
                <view class="a-t">
                    <image :src="shoppingcart.pic.url"></image>
                    <view class="right">
                        <text class="price">{{ shoppingcart.newprice }}</text>
                        <text class="stock">库存：{{ shoppingcart.stock }}件</text>
                        <view class="selected">
                            已选：
                            <block v-if="specList.length != 0">
                                <text class="selected-text">
                                    <text v-for="(item, index) in specList" :key="index">{{ item }}</text>
                                    * {{ number }}
                                </text>
                            </block>
                        </view>
                    </view>
                </view>
                <scroll-view scroll-y="true">
                    <view v-for="(item, index) in shoppingcart.selectinfo" :key="index" class="attr-list">
                        <text>{{ item.attributetitle }}</text>
                        <view class="item-list">
                            <text
                                v-for="(childItem, childIndex) in item.attribute"
                                :key="childIndex"
                                class="tit"
                                :class="{ selected: childItem.selected, selectedx: childItem.selectedx }"
                                @click="selectSpec(childItem.id, item.orderid, childItem.selectedx)"
                            >
                                {{ childItem.name }}
                            </text>
                        </view>
                    </view>
                </scroll-view>
                <view v-if="data.isuse == 0 && data.stockState !=0">
                
                <view class="shop-carc">
                    <text style="font-size: 28upx;flex-grow: 1;">数量</text>
                    <uni-number-box
                        class="step"
                        :min="1"
                        :max="shoppingcart.stock"
                        :value="number > shoppingcart.stock ? shoppingcart.stock : number"
                        :isMax="number >= shoppingcart.stock ? true : false"
                        :isMin="number === 1"
                        @eventChange="numberChange"
                    ></uni-number-box>
                </view>
                <view v-show="data.isuse == 0 && data.productkind != 4">
                    <button class="btn" v-if="clickType != 3" @click="toggleSpec('go', 'btn')">完成</button>
                    <view class="action-btn-group" style="margin: 32rpx auto 20rpx;" v-else>
                        <button type="primary" class=" action-btn no-border buy-now-btn" @click="buycards">加入购物车</button>
                        <button type="primary" class=" action-btn no-border add-cart-btn" @click="buys">立即购买</button>
                    </view>
                </view>
                <view v-show="data.isuse == 4 && data.productkind != 4">
                    <button class="btn" @click="wantbuys()">{{ data.isuseDescrible }}</button>
                </view>
                <view v-show="data.isuse == 5 && data.productkind != 4">
                    <button class="btn" @click="wantbuy()">{{ data.isuseDescrible }}</button>
                </view>
                </view>
            </view>
        </view>
        <!-- 注册面板 -->
        <uni-popup class="restar" ref="popup" :show="register.show" type="center" :mask-click="false">
            <text class="close" @click="registerLogin(1)"></text>
            <view class="title">手机验证登录</view>
            <view class="uni-tip-content">
                <input class="cell-more" type="text" maxlength="11" v-model="register.telNum" placeholder="请输入手机号" />
            </view>
            <view class="uni-tip-content">
                <input class="cell-more" type="text" maxlength="10" v-model="register.code" placeholder="请输入验证码" />
                <text @click="validataTel(register.codetime)">{{ register.codetext }}</text>
            </view>
            <view class="btnse" @click="registerLogin(0)"> 登录 </view>
        </uni-popup>
        <!-- 优惠券面板 -->
        <uni-popup ref="popup" type="bottom" @change="overk" @touchmove.stop="">
            <view class="layer">
                <!-- 优惠券页面，仿mt -->
                <view class="coupon-item" v-for="(item, index) in couponList" :key="index">
                    <view class="con">
                        <view class="left" :class="item.status != 2 ? 'x' : ''">
                            <text class="price">{{ item.discounts }}</text>
                            <text>{{ item.limit }}</text>
                        </view>
                        <view class="right">
                            <view class="title">{{ item.title }}</view>
                            <view class="time">有效期{{ item.validtime }}</view>
                            <view>
                                <text class="tips x" v-if="item.status == 0" @click="donate(item.id, index)">点击领取</text>
                                <text class="coupondraw" v-if="item.status == 1"></text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>
        <!-- 活动 -->
        <uni-popup ref="activitypopup" type="bottom" @change="overk" @touchmove.stop="">
            <view class="layer" style="min-height: 300px;">
                <view class="activity-title">{{ activity.info }}</view>
                <view class="c-list">
                    <view class="c-row b-b" @click="activityitem(item)" v-for="(item, index) in activity.list" :key="index">
                        <text class="tit red">{{ item.title }}</text>
                        <view class="con-list">
                            <view class="con t-r">{{ item.content }}</view>
                            <view class="con t-r">{{ item.time }}</view>
                        </view>
                        <text class="yticon icon-you"></text>
                    </view>
                </view>
            </view>
        </uni-popup>
        <uni-popup ref="parameterpopup" type="bottom" @change="overk">
            <view class="layer" style="min-height: 300px;">
                <view class="activity-title">产品参数</view>
                <view class="c-list">
                    <view class="c-row b-b" v-for="(item, index) in parameter" :key="index">
                        <text class="tit red">{{ item.pkey }}</text>
                        <view>
                            <view class="con t-r">{{ item.pvalue }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>
        <view class="backtop" :class="{ x: backshow }"><image src="../../static/backtop.png" mode="aspectFit" @click="backtop"></image></view>
    </view>
</template>

<script>
// import share from '@/components/share';
import countdown from '@/components/countdown/countdown.vue';
import uniNumberBox from '@/components/uni-number-box.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { mapMutations } from 'vuex';
// 保存最后的组合结果信息
var SKUResult = {};
export default {
    components: {
        uniNumberBox,
        uniPopup,
        countdown
    },
    onPageScroll(o) {
        if (o.scrollTop > 60) {
            this.backshow = true;
        } else {
            this.backshow = false;
        }
    },
    data() {
        return {
            register: {
                show: false,
                telNum: '',
                code: '',
                codetime: 0,
                codetext: '获取验证码',
                state: 0,
                codeState: true
            },
            backshow: false,
            progressgesture: false,
            overf: false,
            favorite: false,
            cartnumber: 0,
            children: '',
            showpage: ' ',
            specClass: 'none',
            specSelected: [],
            shareList: [],
            shoppingcart: {
                pic: {
                    url: ''
                }
            },
            number: 1,
            specList: [],
            specid: [],
            keywords: 0,
            data: {
                picture: {
                    urlList: []
                },
                companyInfo: {
                    isCompanyLabel: 0
                },
                activity: []
            },
            maskState: 0, //优惠券面板显示状态
            couponList: [],
            id: 0,
            clickType: 3,
            activity: [],
            parameter: [],
            attributes: '',
            showtab: false
        };
    },
    onBackPress() {
        this.$api.ovPage();
    },
    onLoad(options) {
        uni.showLoading({
            title: '加载中'
        });
        SKUResult = {};
        //接收传值,id里面放的是标题，因为测试数据并没写id
        let id = options.productid;
        this.id = id;

        this.initSKU();
        //监听登录登出方法刷新页面
        let _this = this;
        uni.$on('changeLoginState', function(data) {
            uni.showLoading({
                title: '加载中'
            });
            _this.id = options.productid;
            SKUResult = {};
            _this.initSKU();
        });
    },
    onReady: function (res) {
        this.videoContext = uni.createVideoContext('myVideo')
    },
    methods: {
        ...mapMutations(['login']),
        closevideo(){
            this.videoContext.pause();
        },
        // 联系店家
        chat() {
            if(this.data.companyInfo.isSelf == 0){
                let dataInfo = {
                    nickName:this.data.companyInfo.companyname,
                    username:this.data.companyCreator,
                    avatar:this.data.companyInfo.logo
                };            
                uni.setStorage({
                    key:'jiguang_chater_info',
                    data: dataInfo
                });
                uni.navigateTo({
                    url: '/pages/chat/chat'
                });
            }
        },
        backtop() {
            uni.pageScrollTo({ scrollTop: 0, duration: 0 });
        },
        load() {
            this.$ajax.get('product/getProductInfo2', { productid: this.id, attributes: this.attributes }).then(res => {
                if (res.data.code == 0) {
                    this.data = res.data.result.data;
                    this.favorite = res.data.result.data.attentionState == 0 ? false : true;
                    this.showtab = true;
                }
            });
        },
        switchclick() {
            this.$store.commit("add_navlist",this.$store.state.footer_store.now_page_index)
            this.$store.commit("add_navlist",'cart')
            // this.$store.state.footer_store.now_page_index = 'cart';
            uni.navigateTo({
                url:'/pages/home/home'
            })
        },
        robtip(it) {
            if (this.data.robstatetext == '距离结束仅剩') {
                this.data.robstatetext = '活动已结束';
            } else {
                this.data.robstatetext = '抢购中';
            }
        },
        overk(d) {
            if (d.show) {
                this.overf = true;
            } else {
                this.overf = false;
            }
        },
        // 收藏
        toFavorite() {
            let follow = this.favorite == true ? 0 : 1;
            var data = {
                productid: this.id,
                state: follow
            };
            this.$ajax.get('homepage/attentionproduct', data).then(res => {
                if (res.data.code == 0) {
                    this.favorite = !this.favorite;
                    if (follow == 0) {
                        uni.showToast({
                            title: '取消关注成功',
                            position: 'bottom',
                            icon: 'none'
                        });
                    } else {
                        uni.showToast({
                            title: '关注成功',
                            position: 'bottom',
                            icon: 'none'
                        });
                    }
                }
            });
        },
        //数量
        numberChange(data) {
            this.number = data.number;
        },
        //规格弹窗开关
        toggleSpec(i, type) {
            if (this.specClass === 'show') {
                var kg;
                try {
                    this.shoppingcart.selectinfo.forEach(item => {
                        kg = false;
                        item.attribute.forEach(items => {
                            if (items.selected == true) {
                                kg = true;
                            }
                        });
                        if (kg == false) {
                            throw new Error();
                        }
                    });
                } catch (e) {}

                if (kg) {
                    this.specClass = 'hide';
                    this.overf = false;
                    setTimeout(() => {
                        this.specClass = 'none';
                    }, 250);
                    // 跳转那个页面
                    if (this.clickType == 1 && i == 'go') {
                        // 取出guid 判断用户是否登录
                        if (!uni.getStorageSync('userInfo').guid) {
                            this.register.show = true;
                            this.register.state = 0;
                        } else {
                            this.buys();
                        }
                    } else if (this.clickType == 2 && i == 'go') {
                        // 取出guid 判断用户是否登录
                        if (!uni.getStorageSync('userInfo').guid) {
                            this.register.show = true;
                            this.register.state = 1;
                        } else {
                            this.buycards();
                        }
                    } else {
                        this.clickType = 3;
                    }
                } else {
                    if (type == 'btn') {
                        uni.showToast({
                            title: '请选择规格',
                            icon: 'none',
                            position: 'bottom',
                            duration: 2000
                        });
                    } else {
                        this.specClass = 'hide';
                        this.overf = false;
                        setTimeout(() => {
                            this.specClass = 'none';
                        }, 250);
                    }
                }
            } else if (this.specClass === 'none') {
                this.specClass = 'show';
                this.overf = true;
                this.clickType = 3;
            }
        },
        //选择规格
        selectSpec(index, pid, kg) {
            if (!kg) {
                this.shoppingcart.selectinfo.forEach(item => {
                    var xzid = 0;
                    item.attribute.forEach(items => {
                        if (items.id == index) {
                            if (items.selected == false) {
                                items.selected = !items.selected;
                                xzid = index;
                                this.specList[pid] = items.name;
                                this.specid[pid] = items.id;
                            } else {
                                xzid = items.id;
                            }
                        } else {
                            if (items.selected == true) {
                                if (item.orderid == pid) {
                                    items.selected = !items.selected;
                                    this.specid.forEach((it, i) => {
                                        if (it == items.id) {
                                            this.specid[pid] = '';
                                        }
                                    });
                                    this.specList.forEach((it, i) => {
                                        if (it == items.name) {
                                            this.specList[pid] = '';
                                        }
                                    });
                                } else {
                                    xzid = items.id;
                                }
                            }
                        }
                    });
                    item.flxzid = xzid;
                });
                let sl = [];
                for (var ks in SKUResult) {
                    sl.push(ks);
                }
                if (sl.length == 1 && this.shoppingcart.allskuinfo.length == 1) {
                    this.shoppingcart.pic = SKUResult[sl[0]].pic;
                    this.shoppingcart.newprice = SKUResult[sl[0]].newprice;
                    this.shoppingcart.stock = SKUResult[sl[0]].stock;
                    this.keywords = SKUResult[sl[0]].id;
                } else {
                    this.shoppingcart.selectinfo.forEach(item => {
                        item.attribute.forEach(items => {
                            if (item.flxzid != items.id) {
                                var testAttrIds = [];
                                if (item.flxzid > 0) {
                                    for (var i = 0; i < this.specid.length; i++) {
                                        if (this.specid[i] != item.flxzid) {
                                            testAttrIds.push(this.specid[i]);
                                        }
                                    }
                                } else {
                                    testAttrIds = this.specid.concat();
                                }
                                testAttrIds = testAttrIds.concat(items.id);
                                testAttrIds.sort(function(value1, value2) {
                                    return parseInt(value1) - parseInt(value2);
                                });
                                if (!SKUResult[testAttrIds.join(',')]) {
                                    items.selectedx = true;
                                } else {
                                    items.selectedx = false;
                                }
                            }
                        });
                    });
                    var parkingList = this.specid;
                    for (var i = 0; i < parkingList.length; i++) {
                        if (parkingList[i] == '') {
                            parkingList.splice(i, 1);
                            i = i - 1;
                        }
                    }
                    if (parkingList.length == this.shoppingcart.selectinfo.length) {
                        let sx = this.specid;
                        sx.sort(function(value1, value2) {
                            return parseInt(value1) - parseInt(value2);
                        });
                        let xx;
                        xx = SKUResult[sx.join(',')];
                        this.shoppingcart.pic = xx.pic;
                        this.shoppingcart.newprice = xx.newprice;
                        this.shoppingcart.stock = xx.stock;
                        this.keywords = xx.id;
                    }
                }
            }
        },
        // 优惠券
        toggleMask() {
            uni.showLoading({
                title: '加载中'
            });
            this.$ajax.get('product/getCouponByPid', { productid: this.id }).then(res => {
                if (res.data.code == 0) {
                    this.couponList = res.data.result.data;
                    if (res.data.result.data.length > 0) {
                        this.$refs.popup.open();
                    } else {
                        this.$api.msg('暂无优惠券');
                    }
                }
                uni.hideLoading();
            });
        },
        // 领取优惠券
        donate(id, index) {
            uni.showLoading({
                title: '加载中'
            });
            this.$ajax.get('product/getReceiveCoupon', { couponid: id }).then(res => {
                if (res.data.code == 0) {
                    this.couponList[index].status = 1;
                    uni.hideLoading();
                } else {
                    uni.hideLoading();
                }
            });
        },
        // 活动
        openactivity() {
            uni.showLoading({
                title: '加载中'
            });
            this.$ajax.get('product/getProductActivity', { pid: this.id }).then(res => {
                if (res.data.code == 0) {
                    this.activity = res.data.result.data;
                    this.$refs.activitypopup.open();
                    uni.hideLoading();
                } else {
                    uni.hideLoading();
                }
            });
        },
        // 活动列表页面
        activityitem(item) {
            let data = JSON.stringify(item);
            uni.navigateTo({
                url: '/pages/product/list?index=' + data
            });
        },
        // 进店
        goshop(i, id) {
            if (i == 0) {
                uni.navigateTo({
                    url: '/pages/product/shop?cguid=' + id
                });
            } else {
                uni.navigateTo({
                    url: '/pages/product/shopproductlist?cguid=' + id
                });
            }
        },
        // 参数
        openparameter() {
            uni.showLoading({
                title: '加载中'
            });
            this.$ajax.get('product/getProductParam', { pid: this.id }).then(res => {
                if (res.data.code == 0) {
                    this.parameter = res.data.result.data;
                    this.$refs.parameterpopup.open();
                    uni.hideLoading();
                } else {
                    uni.hideLoading();
                }
            });
        },
        // 选择地址
        switchaddress() {
            uni.navigateTo({
                url: '/pages/address/address?source=1&cguid=' + this.data.companyGuid + '&isCustomAddress=' + this.data.isCustomAddress + '&customAddress=' + this.data.customAddress + '&postkind=' + this.data.postkind
            });
        },
        // 切换地址
        updateOrderAddress() {
            let data = {
                productid: this.id,
                addressid: this.addressData.addressid,
                isSelfPickup: this.addressData.isSelfPickup
            };
            this.$ajax.get('product/getProductStockByAddressid', data).then(res => {
                if (res.data.code == 0) {
                    this.data.stockAddress = res.data.result.data.stockAddress;
                    this.data.stockState = res.data.result.data.stockState;
                    this.data.stockText = res.data.result.data.stockText;
                    this.data.stockNullText = res.data.result.data.stockNullText;
                }
            });
        },
        // 购买
        buy() {
            this.clickType = 1;
            this.specClass = 'show';
            this.overf = true;
        },
        buys() {
            var kg;
            try {
                this.shoppingcart.selectinfo.forEach(item => {
                    kg = false;
                    item.attribute.forEach(items => {
                        if (items.selected == true) {
                            kg = true;
                        }
                    });
                    if (kg == false) {
                        throw new Error();
                    }
                });
            } catch (e) {}

            if (kg) {
                let goodsData = [];
                goodsData.push({
                    attr_val: this.id,
                    number: this.number,
                    keywords: this.specid,
                    skuid: this.keywords
                });
                this.specClass = 'hide';
                this.overf = false;
                setTimeout(() => {
                    this.specClass = 'none';
                }, 250);
                uni.navigateTo({
                    url: '/pages/order/createOrder?type=direct&data=' + JSON.stringify({ goodsData: goodsData })
                });
            } else {
                this.$api.msg('请选择正确规格');
            }
        },
        wantbuy() {
            var kg;
            try {
                this.shoppingcart.selectinfo.forEach(item => {
                    kg = false;
                    item.attribute.forEach(items => {
                        if (items.selected == true) {
                            kg = true;
                        }
                    });
                    if (kg == false) {
                        throw new Error();
                    }
                });
            } catch (e) {}
            if (kg) {
                let data = {product:'[{number:' +this.number +',productid:' +this.id +',allattribute:' +this.keywords +',picid:' +this.shoppingcart.pic.id +',companyid:' +this.data.companyid +'}]'};
                this.$ajax.get('com/wantBuy', data).then(res => {
                    this.specClass = 'hide';
                    this.overf = false;
                    setTimeout(() => {
                        this.specClass = 'none';
                    }, 250);
                    if (res.data.code == 0) {
                        this.$api.msg(res.data.msg);
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            } else {
                this.$api.msg('请选择规格');
            }
        },
        wantbuys() {
            var kg;
            try {
                this.shoppingcart.selectinfo.forEach(item => {
                    kg = false;
                    item.attribute.forEach(items => {
                        if (items.selected == true) {
                            kg = true;
                        }
                    });
                    if (kg == false) {
                        throw new Error();
                    }
                });
            } catch (e) {}
            if (kg) {
                this.specClass = 'hide';
                this.overf = false;
                setTimeout(() => {
                    this.specClass = 'none';
                }, 250);
                uni.navigateTo({
                    url:'/pages/product/reserveproduct?productid=' +this.id +'&keywords=' +this.specid +'&number=' +this.number +'&picid=' +this.shoppingcart.pic.id +'&companyid=' +this.data.companyid
                });
            } else {
                this.$api.msg('请选择规格');
            }
        },
        // 加入购物车
        buycard() {
            this.clickType = 2;
            this.specClass = 'show';
            this.overf = true;
        },
        buycards() {
            var kg;
            try {
                this.shoppingcart.selectinfo.forEach(item => {
                    kg = false;
                    item.attribute.forEach(items => {
                        if (items.selected == true) {
                            kg = true;
                        }
                    });
                    if (kg == false) {
                        throw new Error();
                    }
                });
            } catch (e) {}

            if (kg) {
                const data = {
                    productid: this.id,
                    picid: this.shoppingcart.pic.id,
                    skuid: this.keywords,
                    number: this.number,
                    keywords: this.specid
                };
                this.$ajax.get('shoppingcart/determineshop', data).then(res => {
                    if (res.data.code == 0) {
                        uni.$emit('join', {});
                        this.$api.msg('加入购物车成功');
                        this.$ajax.get('shoppingcart/getModelTipNum', { code: 'SHOPCART' }).then(res => {
                            this.cartnumber = res.data.result.data.tipnumber;
                        });
                        this.specClass = 'hide';
                        this.overf = false;
                        setTimeout(() => {
                            this.specClass = 'none';
                        }, 250);
                    } else {
                        this.$api.msg(res.data.code + ':' + res.data.msg);
                    }
                });
            } else {
                this.$api.msg('请选择正确规格');
            }
        },
        stopPrevent() {},
        getObjKeys(obj) {
            if (obj !== Object(obj)) throw new TypeError('Invalid object');
            var keys = [];
            for (var i = 0; i < obj.length; i++) {
                keys.push(obj[i].selectinfo);
            }
            return keys;
        },

        //把组合的key放入结果集SKUResult
        add2SKUResult(combArrItem, sku) {
            var key = combArrItem.join(',');
            if (SKUResult[key]) {
                //SKU信息key属性·
                SKUResult[key].prices.push(sku.newprice);
            } else {
                SKUResult[key] = {
                    prices: [sku.newprice]
                };
            }
        },

        //初始化得到结果集
        initSKU() {
            const data = {
                productid: this.id
            };
            this.$ajax.get('shoppingcart/ShoppingCart', data).then(res => {
                if (res.data.code == 0) {
                    var list = res.data.result.data;
                    list.selectinfo.forEach(item => {
                        item.attribute.forEach(items => {
                            items.selected = false;
                            items.selectedx = false;
                        });
                    });
                    var i,
                        j,
                        skuKeys = this.getObjKeys(list.allskuinfo);
                    for (i = 0; i < skuKeys.length; i++) {
                        var skuKey = skuKeys[i]; //一条SKU信息key

                        var sku = list.allskuinfo[i];
                        var skuKeyAttrs = skuKey.split(',');
                        skuKeyAttrs.sort(function(value1, value2) {
                            return parseInt(value1) - parseInt(value2);
                        });
                        //对每个SKU信息key属性值进行拆分组合
                        var combArr = this.arrayCombine(skuKeyAttrs);
                        if (sku.stock > 0) {
                            for (j = 0; j < combArr.length; j++) {
                                this.add2SKUResult(combArr[j], sku);
                            }
                            //结果集接放入SKUResult
                            SKUResult[skuKeyAttrs.join(',')] = {
                                stock: sku.stock,
                                newprice: sku.newprice,
                                pic: sku.pic,
                                id: sku.id
                            };
                        }
                    }
                    if (list.allskuinfo.length == 1) {
                        this.attributes = list.allskuinfo[0].selectinfo;
                        this.$ajax.get('product/getProductInfo2', { productid: this.id, attributes: this.attributes }).then(res => {
                            if (res.data.code == 0) {
                                this.data = res.data.result.data;
                                this.favorite = res.data.result.data.attentionState == 0 ? false : true;
                                this.showtab = true;
                                if (this.$wx.isWechat()) {
                                    this.$wx.share(
                                        {
                                            title: this.data.mainheading,
                                            desc: this.data.subheading,
                                            imgUrl: this.data.picture.urlList[0].url
                                        },
                                        'http://ets.51pingce.net/pages/product/product?productid=' + this.id
                                    );
                                }
                            } else {
                                uni.hideLoading();
                                this.$api.msg(res.data.msg);
                                setTimeout(function() {
                                    uni.navigateBack();
                                }, 1000);
                            }
                        });
                    } else {
                        this.$ajax.get('product/getProductInfo2', { productid: this.id, attributes: this.attributes }).then(res => {
                            if (res.data.code == 0) {
                                this.data = res.data.result.data;
                                this.favorite = res.data.result.data.attentionState == 0 ? false : true;
                                this.showtab = true;
                                if (this.$wx.isWechat()) {
                                    this.$wx.share(
                                        {
                                            title: this.data.mainheading,
                                            desc: this.data.subheading,
                                            imgUrl: this.data.picture.urlList[0].url
                                        },
                                        'http://ets.51pingce.net/pages/product/product?productid=' + this.id
                                    );
                                }
                                
                            } else {
                                uni.hideLoading();
                                this.$api.msg(res.data.msg);
                                setTimeout(function() {
                                    uni.navigateBack();
                                }, 1000);
                            }
                        });
                    }
                    this.shoppingcart = list;
                    let xhkgx = true;
                    this.shoppingcart.allskuinfo.forEach(it => {
                        if (it.stock != 0 && xhkgx) {
                            xhkgx = false;
                            let xh = it.selectinfo.split(',');
                            for (var ik = 0; ik < xh.length; ik++) {
                                this.shoppingcart.selectinfo.forEach((item, inexs) => {
                                    item.attribute.forEach(items => {
                                        if (items.id == xh[ik]) {
                                            if (ik + 1 == xh.length) {
                                                this.selectSpec(items.id, inexs, false);
                                            } else {
                                                items.selected = true;
                                                this.specList[inexs] = items.name;
                                                this.specid[inexs] = items.id;
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    });

                    uni.hideLoading();
                    this.$ajax.get('shoppingcart/getModelTipNum', { code: 'SHOPCART' }).then(res => {
                        this.cartnumber = res.data.result.data.tipnumber;
                    });
                } else {
                    this.$api.msg('系统出错,请稍后再试');
                }
            });
            this.$ajax.get('product/getProductDetail', { productid: this.id }).then(res => {
                if (res.data.code == 0) {
                    uni.request({
                        url: res.data.result.data.url,
                        success: res => {
                            if (res.statusCode == 200) {
                                var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
                                var result = REG_BODY.exec(res.data);
                                if (result && result.length === 2) {
                                    this.showpage = result[1];
                                    //.replace(/\<img/gi, '<img style="max-width:750upx;height:auto" ');
                                } else {
                                    this.showpage = result;
                                }
                            }
                        }
                    });
                }
            });
        },

        /**
         * 从数组中生成指定长度的组合
         */
        arrayCombine(targetArr) {
            if (!targetArr || !targetArr.length) {
                return [];
            }
            var len = targetArr.length;
            var resultArrs = [];
            // 所有组合
            for (var n = 1; n < len; n++) {
                var flagArrs = this.getFlagArrs(len, n);
                while (flagArrs.length) {
                    var flagArr = flagArrs.shift();
                    var combArr = [];
                    for (var i = 0; i < len; i++) {
                        flagArr[i] && combArr.push(targetArr[i]);
                    }
                    resultArrs.push(combArr);
                }
            }
            return resultArrs;
        },

        /**
         * 获得从m中取n的所有组合
         */
        getFlagArrs(m, n) {
            if (!n || n < 1) {
                return [];
            }

            var resultArrs = [],
                flagArr = [],
                isEnd = false,
                i,
                j,
                leftCnt;

            for (i = 0; i < m; i++) {
                flagArr[i] = i < n ? 1 : 0;
            }
            resultArrs.push(flagArr.concat());

            while (!isEnd) {
                leftCnt = 0;
                for (i = 0; i < m - 1; i++) {
                    if (flagArr[i] == 1 && flagArr[i + 1] == 0) {
                        for (j = 0; j < i; j++) {
                            flagArr[j] = j < leftCnt ? 1 : 0;
                        }
                        flagArr[i] = 0;
                        flagArr[i + 1] = 1;
                        var aTmp = flagArr.concat();
                        resultArrs.push(aTmp);
                        if (
                            aTmp
                                .slice(-n)
                                .join('')
                                .indexOf('0') == -1
                        ) {
                            isEnd = true;
                        }
                        break;
                    }
                    flagArr[i] == 1 && leftCnt++;
                }
            }

            return resultArrs;
        },
        // 商品评价跳转
        evaluateClick() {
            uni.navigateTo({
                url: '/pages/product/evaluate?id=' + this.id
            });
        },
        // 手机号验证
        validataTel(now_time) {
            if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.register.telNum)){
            	this.$api.msg('请输入正确的手机号码');
            	return;
            }
            if (this.register.codetime == 0 && this.register.codeState) {
                this.register.codeState = false;
                this.getTelCode();
            }
        },
        // 发送验证码
        getTelCode() {
            this.$ajax.get('register/getVerificationCodeInRegister', { tel: this.register.telNum }).then(res => {
                this.register.codeState = true;
                if (res.data.code == 0) {
                    this.$api.msg('验证码已发送，请注意查收');
                    this.register.codetext = '60秒后可重发';
                    this.register.codetime = 60;
                    this.intervalID = setInterval(() => {
                        if (this.register.codetime == 0) {
                            clearInterval(this.intervalID);
                            this.register.codetext = '重新获取';
                        } else {
                            this.register.codetime = this.register.codetime - 1;
                            this.register.codetext = this.register.codetime + '秒后可重发';
                        }
                    }, 1000);
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
        },
        // 注册
        registerLogin(state) {
            // clearInterval(this.intervalID);
            // this.register.codetext = '重新获取';
            if (state == 1) {
                this.register.show = false;
                return;
            }
            if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.register.telNum)){
            	this.$api.msg('请输入正确的手机号码');
            	return;
            }
            if (this.register.code.length == 0) {
                this.$api.msg('请输入正确的验证码');
                return;
            }
            // 注册
            this.$ajax.get('login/wxRegister', {
                wxid: uni.getStorageSync('openid'), //uni.getStorageSync('openid'),
                tel: this.register.telNum,
                code: this.register.code
            }).then(res => {
                if (res.data.code == 0) {
                    this.register.show = false;
                    this.login(res.data.result.data);
                    uni.removeStorageSync('recommendloginguid');
                    this.login(res.data.result.data);
                    this.$api.prePage() && (this.$api.prePage().isDoRefresh = true);
                    uni.$emit('changeLoginState', {});
                    uni.setStorageSync('isopenbuildcompany', res.data.result.data.isopenbuildcompany);
                    if(res.data.result.data.isopenbuildcompany == 1){
                        this.$store.dispatch('menu_3')
                        //已建店 到建店页面
                        this.isOpenShop().then(openShop_res =>{
                            if(openShop_res){
                              this.$store.dispatch('menu_4');
                            }
                            // if(res.data.result.data.haveNickName == 0){
                            //     uni.navigateTo({
                            //         url:'/pages/public/name?guid='+res.data.result.data.guid
                            //     });
                            // }else{
                            //     uni.navigateBack();
                            // }
                        }) 
                    // }else{
                        // if(res.data.result.data.haveNickName == 0){
                        //     uni.navigateTo({
                        //         url:'/pages/public/name?guid='+res.data.result.data.guid
                        //     })
                        // }else{
                        //     uni.navigateBack();
                        // }
                    }
                    if (this.register.state == 0) {
                        this.buys();
                    } else {
                        this.buycards();
                    }
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
        },
        isOpenShop(){
            try{
                 const promise = new Promise((resolve, reject) => {
                     this.$ajax.get('com/hasCompany', {}).then(res => {
                       if (res.data.code == 0) {
                           let companyresult = res.data.result.data.companyresult; // 0-未创建店铺，1-已创建店铺
                           let result = false;
                           if (companyresult == 0) {
                               result = false;
                           } else {
                               //已创建
                               result = true;
                           }
                           resolve(result)
                       }
                   },reason => {
                        resolve(false); // 出错了！
                   });  
                 })
                 return promise
            }catch(e){
                return false;
            } 
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
    height: 100%;
}
.container {
    padding-bottom: 180rpx;
    &.over {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        overflow: hidden;
        padding-bottom: 0;
    }
}

.conhtml {
    padding: 0 30rpx;
    /deep/ view {
        font-size: 30rpx;
    }
    /deep/ uni-video {
        width: 690upx;
    }
    /deep/ image {
        width: 690upx;
    }
}
.detail-con {
    /deep/ img {
        width: 720upx;
        margin: 0 auto;
        display: block;
    }
    /deep/ embed {
        width: 750upx;
        margin: 0 auto;
        display: block;
    }
    /deep/ video {
        width: 750upx;
        margin: 0 auto;
        display: block;
    }
    /deep/ p {
        padding: 0 30rpx;
        font-size: 28rpx !important;
        * {
            font-size: 28rpx !important;
        }
        embed {
            width: 750upx;
            margin: 0 -30rpx;
            display: block;
        }
        video {
            width: 750upx;
            margin: 0 -30rpx;
            display: block;
        }
        img {
            width: 750upx;
            margin: 0 -30rpx;
            display: block;
        }
    }
}

.activity-title {
    font-size: 32rpx;
}
.icon-you {
    color: #888;
}
.shop-carc {
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
}
.carousel {
    height: 722upx;
    position: relative;
    swiper {
        height: 100%;
    }
    .image-wrapper {
        width: 100%;
        height: 100%;
    }
    .videoys {
        width: 100%;
        height: 100%;
    }
    .swiper-item {
        display: flex;
        justify-content: center;
        align-content: center;
        height: 750upx;
        overflow: hidden;
        image {
            width: 100%;
            height: 100%;
        }
    }
    .titleicon {
        position: absolute;
        width: 100rpx;
        top: 30rpx;
        right: 30rpx;
        height: 30rpx;
    }
}
.rob {
    background: $base-color;
    display: flex;
    align-items: center;
    color: #ffffff;
    .con {
        padding-left: 30rpx;
        .new {
            font-size: 32rpx;
        }
        .old {
            font-size: 24rpx;
            text-decoration: line-through;
        }
    }
    .tip {
        flex-grow: 1;
        text-align: right;
    }
    .time {
        margin-left: 10rpx;
        background: url(../../static/robbg.png) no-repeat;
        background-size: 100% 100%;
        padding: 40rpx 30rpx 40rpx 50rpx;
        margin-right: -1px;
        color: $base-color;
        /deep/ text {
            background: $base-color;
            padding: 6rpx;
            border-radius: 10rpx;
            color: #ffffff;
        }
    }
}
/* 标题简介 */
.introduce-section {
    background: #fff;
    padding: 20upx 30upx;

    .title {
        font-size: 32upx;
        color: $font-color-dark;
        line-height: 50upx;
        .preferential {
            background: $base-color;
            color: #fff;
            padding: 4rpx 8rpx;
            border-radius: 10rpx;
            margin-right: 10rpx;
        }
        image {
            width: 50rpx;
            height: 50rpx;
            vertical-align: middle;
        }
    }
    .title-tip {
        font-size: 24upx;
        color: #c0c4cc;
    }
    .price-box {
        padding: 10upx 0;
        font-size: 26upx;
        color: $uni-color-primary;
        .totalSales {
            float: right;
            color: #bbbbbb;
        }
        .price {
            font-size: $font-lg + 30upx;
            font-weight: bold;
        }
    }
    .price {
        font-size: $font-lg + 10upx;
    }
    .m-price {
        margin: 0 12upx;
        color: $font-color-light;
        text-decoration: line-through;
    }
    .coupon-tip {
        align-items: center;
        padding: 4upx 10upx;
        background: $uni-color-primary;
        font-size: $font-sm;
        color: #fff;
        border-radius: 6upx;
        line-height: 1;
        transform: translateY(-4upx);
    }
    .bot-row {
        display: flex;
        align-items: center;
        height: 50upx;
        font-size: $font-sm;
        color: $font-color-light;
        text {
            flex: 1;
        }
    }
}
/* 分享 */
.share-section {
    display: flex;
    align-items: center;
    background: #f1f1f1;
    padding: 12upx 30upx;
    .share-icon {
        display: flex;
        align-items: center;
        height: 30upx;
        line-height: 1;
        position: relative;
        overflow: hidden;
        font-size: 28upx;
        margin-right: 20upx;
        padding: 20upx;
        padding-left: 60rpx;
        &:after {
            content: '';
            width: 50upx;
            height: 50upx;
            border-radius: 50%;
            left: 0;
            top: -6upx;
            position: absolute;
            background: url(../../static/yes.png) no-repeat center;
        }
    }
    .icon-xingxing {
        position: relative;
        z-index: 1;
        font-size: 24upx;
        margin-left: 2upx;
        margin-right: 10upx;
        color: #fff;
        line-height: 1;
    }
    .tit {
        font-size: $font-base;
        margin-left: 10upx;
    }
    .icon-bangzhu1 {
        padding: 10upx;
        font-size: 30upx;
        line-height: 1;
    }
    .share-btn {
        flex: 1;
        text-align: right;
        font-size: $font-sm;
        color: $uni-color-primary;
    }
    .icon-you {
        color: $uni-color-primary;
    }
}
.icon-you:after {
    margin-top: -12rpx;
}
.c-list {
    font-size: $font-sm + 2upx;
    color: $font-color-base;
    background: #fff;
    .c-row {
        display: flex;
        align-items: center;
        padding: 20upx 30upx;
        position: relative;
    }
    .tit {
        width: 100upx;
        min-width: 100rpx;
    }
    .con {
        flex: 1;
        color: $font-color-dark;
        .selected-text {
            margin-right: 10upx;
        }
    }
    .bz-list {
        height: 40upx;
        font-size: $font-sm + 2upx;
        color: $font-color-dark;
        text {
            display: inline-block;
            margin-right: 30upx;
        }
    }
    .con-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        color: $font-color-dark;
        line-height: 40upx;
        &.clamp {
            flex: 1;
            display: block;
        }
    }
    .red {
        color: $uni-color-primary;
    }
}

//店铺
.stores {
    margin: 12upx 0;
    background: #ffffff;
    font-size: 32upx;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 12upx 28upx;
    .img {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100rpx;
        margin-right: 30rpx;
    }
    .icon {
        font-size: 26upx;
        background: red;
        padding: 6upx 16upx;
        color: #ffffff;
        border-radius: 6upx;
        margin-right: 10rpx;
    }
    .tit {
        flex-grow: 1;
        line-height: 60rpx;
        .tip {
            font-size: 24rpx;
        }
    }
    .btn {
        font-size: 24upx;
        color: #909399;
    }
}
/* 评价 */
.eva-section {
    display: flex;
    flex-direction: column;
    padding: 20upx 30upx;
    background: #fff;
    margin-top: 16upx;
    .e-header {
        display: flex;
        align-items: center;
        height: 70upx;
        font-size: $font-sm + 2upx;
        color: $font-color-light;
        .tit {
            font-size: $font-base + 2upx;
            color: $font-color-dark;
            margin-right: 4upx;
        }
        .tip {
            flex: 1;
            text-align: right;
        }
        .icon-you {
            margin-left: 10upx;
        }
    }
}
.eva-box {
    display: flex;
    padding: 20upx 0;
    .portrait {
        flex-shrink: 0;
        width: 80upx;
        height: 80upx;
        border-radius: 100px;
    }
    .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: $font-base;
        color: $font-color-base;
        padding-left: 26upx;
        .con {
            font-size: $font-base;
            color: $font-color-dark;
            padding: 20upx 0;
        }
        .bot {
            display: flex;
            justify-content: space-between;
            font-size: $font-sm;
            color: $font-color-light;
        }
    }
}
/*  详情 */
.detail-desc {
    background: #fff;
    margin-top: 16upx;
    .d-header {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80upx;
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        position: relative;

        text {
            padding: 0 20upx;
            background: #fff;
            position: relative;
            z-index: 1;
        }
        &:after {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%);
            width: 300upx;
            height: 0;
            content: '';
            border-bottom: 1px solid #ccc;
        }
    }
}

/* 规格选择弹窗 */
.attr-content {
    padding: 10upx 30upx;
    .a-t {
        display: flex;
        image {
            width: 170upx;
            height: 170upx;
            flex-shrink: 0;
            border-radius: 8upx;
        }
        .right {
            display: flex;
            flex-direction: column;
            padding-left: 24upx;
            font-size: $font-sm + 2upx;
            color: $font-color-base;
            line-height: 42upx;
            .price {
                font-size: $font-lg;
                color: $uni-color-primary;
                margin-bottom: 10upx;
            }
            .selected-text {
                margin-right: 10upx;
            }
        }
    }
    .attr-list {
        display: flex;
        flex-direction: column;
        font-size: $font-base + 2upx;
        color: $font-color-base;
        padding-top: 30upx;
        padding-left: 10upx;
        max-height: 50vh;
        overflow-y: auto;
    }
    .item-list {
        padding: 20upx 0 0;
        display: flex;
        flex-wrap: wrap;
        text {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eee;
            margin-right: 20upx;
            margin-bottom: 20upx;
            border-radius: 100upx;
            min-width: 60upx;
            height: 60upx;
            padding: 0 20upx;
            font-size: $font-base;
            color: $font-color-dark;
        }
        .selected {
            background: #fbebee;
            color: $uni-color-primary;
        }
        .selectedx {
            background: #dddddd;
            color: #888888;
        }
    }
}

/*  弹出层 */
.popup {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 99;

    &.show {
        display: block;
        .mask {
            animation: showPopup 0.2s linear both;
        }
        .layer {
            animation: showLayer 0.2s linear both;
        }
    }
    &.hide {
        .mask {
            animation: hidePopup 0.2s linear both;
        }
        .layer {
            animation: hideLayer 0.2s linear both;
        }
    }
    &.none {
        display: none;
    }
    .mask {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.4);
    }
    .layer {
        position: fixed;
        z-index: 99;
        bottom: 0;
        width: 100%;
        min-height: 30vh;
        border-radius: 10upx 10upx 0 0;
        background-color: #fff;
        .btn {
            height: 66upx;
            line-height: 66upx;
            border-radius: 100upx;
            background: $uni-color-primary;
            font-size: $font-base + 2upx;
            color: #fff;
            margin: 30upx auto 20upx;
        }
    }
    @keyframes showPopup {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes hidePopup {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    @keyframes showLayer {
        0% {
            transform: translateY(120%);
        }
        100% {
            transform: translateY(0%);
        }
    }
    @keyframes hideLayer {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(120%);
        }
    }
}

/* 底部操作菜单 */
.page-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 95;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100upx;
    background: #ffffff;
    border-top: 1px solid #dddddd;
    .p-b-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: $font-sm;
        color: $font-color-base;
        width: 120upx;
        height: 90upx;
        position: relative;
        .cart-number {
            position: absolute;
            top: 0;
            right: 0;
            width: 36upx;
            height: 36upx;
            border-radius: 18upx;
            background: red;
            color: #ffffff;
            text-align: center;
            line-height: 36upx;
        }
        .yticon {
            font-size: 40upx;
            line-height: 48upx;
            color: $font-color-light;
        }
        &.active,
        &.active .yticon {
            color: $uni-color-primary;
        }
        .icon-fenxiang2 {
            font-size: 42upx;
            transform: translateY(-2upx);
        }
        .icon-shoucang {
            font-size: 46upx;
        }
    }
}
.action-btn-group {
    flex-grow: 1;
    display: flex;
    height: 100upx;
    overflow: hidden;
    margin-left: 20upx;
    position: relative;
    .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100upx;
        font-size: $font-base;
        padding: 0;
        border-radius: 0;
        background: $base-color;
        flex-grow: 1;
        &.buy-now-btn {
            background: rgb(248, 170, 46);
        }
        &.on {
            width: 100%;
        }
    }
}
.mask-content {
    width: 100%;
    max-height: 70vh;
    background: #f3f3f3;
    transform: translateY(100%);
    transition: 0.3s;
    overflow-y: scroll;
}
/* 优惠券列表 */
.coupon-item {
    margin: 20upx 0upx;
    background: #fff;
    overflow: hidden;
    .con {
        display: flex;
        align-items: center;
        position: relative;
        &:after {
            position: absolute;
            left: 0;
            bottom: 0;
            content: '';
            width: 100%;
            height: 0;
            border-bottom: 1px dashed #f3f3f3;
            transform: scaleY(50%);
        }
    }
    .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 240rpx;
        min-width: 240rpx;
        overflow: hidden;
        color: #ffffff;
        padding: 20rpx 30upx;
        text-align: center;
        background: #dddddd;
        height: 200rpx;
        &.x {
            background: #fa436a;
        }
    }
    .title {
        font-size: 32upx;
        color: $font-color-dark;
        margin-bottom: 10upx;
    }
    .time {
        font-size: 24upx;
        color: $font-color-light;
    }
    .right {
        font-size: 26upx;
        color: $font-color-base;
        flex-grow: 1;
        padding: 0 30upx;
        .coupondraw {
            position: absolute;
            right: 30rpx;
            top: 30rpx;
            z-index: 3;
            width: 160rpx;
            height: 160rpx;
            background: url(../../static/coupon-draw.png) no-repeat center;
            background-size: 100% 100%;
        }
    }
    .price {
        font-size: 44upx;
        color: #ffffff;
    }
    .tips {
        font-size: 24upx;
        color: $font-color-light;
        display: inline-block;
        border-radius: 20upx;
        margin-right: 30rpx;
        &.x {
            padding: 0 10upx;
            border: 1px solid #fa436a;
            color: #fa436a;
            float: right;
            margin-top: 10rpx;
        }
    }
    .received {
        position: absolute;
        top: 0;
        right: 10rpx;
    }
}
.maxmara{
    position: fixed;
    left: 0;
    right: 0;
    font-size: 24rpx;
    text-align: center;
    padding: 10rpx;
    background: #f9ed5b;
    color: #fa436a;
    bottom: 100rpx;
    z-index: 6;
}

.restar{
    /deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box{
        padding: 20rpx 0 0 0;
        border-radius: 20rpx;
        position: relative;
    }
    .close{
        position: absolute;
        right: 20rpx;
        top:20rpx;
        width: 60rpx;
        height: 60rpx;
        background: url(../../static/imgdel.png) no-repeat center;
    }
    .title{
        font-size: 38rpx;
        color: #333;
        text-align: center;
    }
    .uni-tip-content{
        overflow: hidden;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #EE3847;
        margin: 0 20rpx;
        input{
            margin:24rpx 12rpx;
            flex: 1;
        }
        text{
            font-size: 28rpx;
            padding: 20rpx 0;
            color: #969696;
        }
    }
    .btnse{
        width: 80%;
        margin: 40rpx auto;
        padding: 20rpx;
        border-radius: 40rpx;
            text-align: center;
            font-size: 32rpx;
                background: #EE3847;
                color: #FFF;
    }
}

/deep/ .uni-popup{
    z-index: 99;
}
</style>
