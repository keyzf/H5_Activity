<template>
    <view>
        <!-- 地址 -->
        <navigator :url="'/pages/address/address?source=1&isCustomAddress=' + data[0].isCustomAddress + '&cguid=' + data[0].cguid + '&customAddress=' + data[0].customAddress"
            class="address-section">
            <view class="order-content">
                <text class="yticon icon-shouhuodizhi"></text>
                <view class="cen">
                    <view class="top">
                        <text class="name">{{ addressData.receivername || '前选择收货地址' }}</text>
                        <text class="mobile">{{ addressData.receivertel }}</text>
                    </view>
                    <text class="address">{{ addressData.address }}</text>
                </view>
                <text class="yticon icon-you"></text>
            </view>

            <image class="a-bg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"></image>
        </navigator>

        <view class="goods-section" v-for="(item, index) in shopinggoods" :key="index">
            <view class="g-header b-b">
                <text class="name">{{ item.companyname }}</text>
            </view>
            <!-- 商品列表 -->
            <view class="g-item" v-for="(goods, goodsid) in item.goodsinfo" :key="goodsid">
                <image :src="goods.pic.url"></image>
                <view class="right">
                    <text class="title clamp">{{ goods.productname }}</text>
                    <text class="spec">{{ goods.attributeshow }}</text>
                    <view class="price-box">
                        <text class="price">{{ goods.newprice }}</text>
                        <text class="number">x{{ goods.number }}</text>
                    </view>
                    <text class="receivetimetips">{{ goods.receiveTimeTips }}</text>
                </view>
            </view>
        </view>
        <view class="yt-list-cell b-b">
            <text class="cell-tit clamp">商品金额</text>
            <text class="cell-tip">{{ price.totalprice }}</text>
        </view>
        <view class="yt-list">
            <view class="yt-list-cell desc-cell">
                <text class="cell-tit clamp">留言</text>
                <input class="desc" type="text" v-model="notes" placeholder="请填写留言信息" placeholder-class="placeholder" />
            </view>
        </view>
        <view class="yt-list">

            <!--  <view class="yt-list-cell b-b">
                <text class="tit">{{ increment.privilegepoint }}</text>
                <switch
                    style="transform:scale(0.7)"
                    :checked="privilegepointState"
                    :disabled="increment.privilegepointvalue == 0"
                    color="#fa436a"
                    @click="switchClick('privilegepoint')"
                />
            </view> -->
            <!-- <view class="yt-list-cell b-b">
                <text class="tit">{{ increment.redpacketmoneyinfo }}</text>
                <switch style="transform:scale(0.7)" :checked="redpacketState" :disabled="increment.redpacketmoney == 0" color="#fa436a" @click="switchClick('redpacket')" />
            </view> -->
            <view class="yt-list-cell b-b">
                <text class="tit">{{ increment.extra_price }}</text>
                <switch style="transform:scale(0.7)" :checked="extraState" :disabled="increment.extra_value == 0" color="#fa436a"
                    @click="switchClick('extra')" />
            </view>
            <!-- 金额明细 -->

            <view class="yt-list-cell b-b">
                <text class="cell-tit clamp">运费</text>
                <text class="cell-tip">￥{{ price.freight }}</text>
            </view>
            <!-- <view class="yt-list-cell b-b">
                <text class="cell-tit clamp">立减</text>
                <text class="cell-tip">{{ price.subtractnow }}</text>
            </view> -->
        </view>

        <!-- 底部 -->
        <view class="footer">
            <view class="price-content">
                <text>实付款</text>
                <text class="price">{{ price.price_usemealcard }}</text>
                <view class="tip">{{ price.paystring }}</view>
            </view>
            <text class="submit" @click="submit">提交订单</text>
        </view>

        <!-- 优惠券面板 -->
        <view class="mask" :class="maskState === 0 ? 'none' : maskState === 1 ? 'show' : ''" @click="toggleMask">
            <view class="mask-content">
                <!-- 优惠券页面，仿mt -->
                <view class="coupon-item" v-for="(item, index) in couponList" :key="index" @click="selectMask(item)">
                    <view class="con">
                        <view class="left x">
                            <text class="price">{{ item.discounts }}</text>
                            <text>{{ item.limit }}</text>
                        </view>
                        <view class="right">
                            <view class="title">{{ item.title }}</view>
                            <view class="time">有效期:{{ item.validtime }}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="temporarily " @click="noCoupon">暂不使用</view>
        </view>
        <uni-popup ref="popup" type="center" class="maxmara">
            <view class="title">{{ tip.title }}</view>
            <view class="con" v-for="(item, index) in tip.productlist" :key="index">
                <image :src="item.url" mode="aspectFit"></image>
                <view class="tip">{{ item.name }}</view>
            </view>
            <view class="btns">
                <view @click="changeAddress">更换收货地址</view>
                <view class="btn" @click="navBack()">返回上一页</view>
            </view>
        </uni-popup>
        <uni-popup ref="identification" type="center" class="identification">
            <view class="title">请输入身份证号</view>
            <view class="con">
                <input type="text" v-model="idcard.id_number" placeholder="请输入身份证号" />
                <view class="tip">{{ idcard.msg }}</view>
            </view>
            <view class="btns">
                <view @click="idCancel">取消</view>
                <view class="btn" @click="idSubmit">提交</view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    export default {
        components: {
            uniPopup
        },
        data() {
            return {
                kk: 'sdfsdfsd',
                maskState: 0, //优惠券面板显示状态
                saleState: 0, // 活动面板显示状态
                notes: '', //备注
                payType: 1, //1微信 2支付宝
                couponList: [],
                salseList: [],
                addressData: {
                    level: '',
                    guid: '',
                    addressid: '',
                    addresstype: '',
                    defaultaddressstate: '',
                    receivername: '',
                    receivertel: '',
                    address: '',
                    postcode: ''
                },
                data: [{
                    cguid: 0,
                    customAddress: 1,
                    isCustomAddress: 1
                }],
                ids: [],
                numbers: [],
                keywords: [],
                skuid: 0,
                shopinggoods: [],
                couponproduct: [],
                sid: 0,
                // 结算价格信息
                price: {
                    price_true: '￥0.00',
                    price_usecoupon: '￥0.00',
                    price_usecouponandub: '￥0.00',
                    price_useextra: '￥0.00',
                    price_usemealcard: '￥0.00',  //实付款
                    price_usepoint: '￥0.00',
                    totalprice: '￥0.00',
                    freight: '免运费',
                    isuse: '0',
                    poundageprice: '',
                    mallpay: '',
                    shouldpay: '',
                    handchargepercent: '',
                    deductpercent: '',
                    paystring: '',  //应付款
                    poundageprice_mall: '',
                    gearinfoid: '',
                    handlingchargeall: '',
                    subtractnow: '',
                    couponid: -1,
                    couptitle: '选择优惠券',
                    customAddress: '',
                    saleid: -1,
                    saletitle: '选择活动',
                    discounttype: 0
                },
                // 积分 红包 U币
                increment: {
                    privilegepointvalue: 0,
                    privilegepoint: '',
                    redpacketmoney: 0,
                    redpacketmoneyinfo: '',
                    extra_value: 0,
                    extra_price: ''
                },
                redpacketState: false,
                extraState: false,
                privilegepointState: false,
                type: '',
                groupbuyactivityguid: -1,
                takegroupbuyteamguid: -1,
                idcard: {
                    needcheckidnumber: 0,
                    id_number: '',
                    msg: ''
                },
                tip: {
                    title: '',
                    productlist: [{
                        url: '',
                        name: ''
                    }],
                    isaddresstipforcityproductids: '',
                    isaddresstipforcity: 0,
                    isaddresstip: 0,
                    addresstipinfo: ''
                },
                popupState: true
            };
        },
        onLoad(option) {
            /*  let data = JSON.parse(option.data);
              //商品数据
              console.log(data);
              data.goodsData.forEach(item => {
                  this.ids.push(item.attr_val);
                  this.numbers.push(item.number);
                  this.keywords.push(item.keywords);
                  this.skuid = item.skuid;
              }); */
            this.number = option.number;
            this.keywords = option.keywords;
            this.productid = option.productid
            this.takegroupbuyteamguid = option.takegroupbuyteamguid
            this.type = "";
            this.getGoodsInfo();
        },
        onBackPress() {
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        methods: {
            // 获取购物车结算详情
            getGoodsInfo() {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                });
                let data = {
                    number: this.number,
                    keywords: this.keywords,
                    productid: this.productid,
                    groupbuyactivityguid: -1,
                    upgrade: 1,
                    takegroupbuyteamguid: this.takegroupbuyteamguid
                };
                //hoppingcart/directselectgearstepfix
                let url = 'shoppingcart/directCheckoutfix'
                this.$ajax.get(url, data).then(res => {
                    console.log(res);
                    uni.hideLoading();
                    if (res.data.code == 0) {
                        let dataInfo = res.data.result.data;
                        this.data = dataInfo;
                        dataInfo.forEach(item => {
                            this.tip.addresstipinfo = item.addresstipinfo;
                            this.addressData.address = item.addressinfo.address;
                            this.addressData.addressid = item.addressinfo.addressid;
                            this.addressData.addresstype = item.addressinfo.addresstype;
                            this.addressData.defaultaddressstate = item.addressinfo.defaultaddressstate;
                            this.addressData.guid = item.addressinfo.guid;
                            this.addressData.level = item.addressinfo.level;
                            this.addressData.postcode = item.addressinfo.postcode;
                            this.addressData.receivername = item.addressinfo.receivername;
                            this.addressData.receivertel = item.addressinfo.receivertel;
                            this.shopinggoods = item.shopinggoodslist;
                            this.increment.privilegepoint = item.privilegepoint;
                            this.increment.privilegepointvalue = item.privilegepointvalue;
                            this.increment.redpacketmoney = item.redpacketmoney;
                            this.increment.redpacketmoneyinfo = item.redpacketmoneyinfo;
                            this.increment.extra_price = item.extra_price;
                            this.increment.extra_value = item.extra_value;
                            this.price.saleid = item.saleid;
                            this.price.saletitle = item.saleid == -1 ? '无' : item.saletitle;
                            this.price.price_true = item.price_true;
                            this.price.price_usecoupon = item.price_usecoupon;
                            this.price.price_usecouponandub = item.price_usecouponandub;
                            this.price.price_useextra = item.price_useextra;
                            this.price.price_usemealcard = item.price_usemealcard;
                            this.price.price_usepoint = item.price_usepoint;
                            this.price.totalprice = item.totalprice;
                            this.price.freight = item.freight;
                            this.price.couponid = item.couponid;
                            this.price.couptitle = item.couponid == -1 ? '无' : item.coupon;
                            this.price.gearinfoid = item.gearinfoid;
                            this.price.customAddress = item.customAddress;
                            this.couponproduct = item.couponproduct;
                            this.price.discounttype = item.discounttype;
                            this.sid = item.sid;
                            this.tip.isaddresstipforcityproductids = item.isaddresstipforcityproductids;
                            this.idcard.needcheckidnumber = item.needcheckidnumber;
                            this.idcard.msg = item.needcheckidnumbertip;
                            this.tip.isaddresstipforcity = item.isaddresstipforcity;
                            this.tip.isaddresstip = item.isaddresstip;
                            this.skuid = item.shopinggoodslist[0].goodsinfo[0].skuid
                        });
                        this.extraState = this.increment.extra_value > 0 ? true : false;
                        if (this.price.discounttype == 1 && this.increment.privilegepointvalue > 0) {
                            this.selectIncrement('privilegepoint');
                        } else if (this.price.discounttype == 2) {
                            this.selectIncrement('coupon');
                        } else if (this.price.discounttype == 3) {
                            this.selectIncrement('sale');
                        } else if (this.price.discounttype == 4 && this.increment.redpacketmoney > 0) {
                            this.selectIncrement('redpacket');
                        }
                        this.getPrice();
                        if (this.tip.isaddresstip && this.popupState) {
                            let addresstipinfo = this.tip.addresstipinfo;
                            uni.showModal({
                                title: '温馨提示',
                                content: addresstipinfo,
                                cancelText: '确定',
                                confirmText: '修改',
                                confirmColor: '#000000',
                                success: res => {
                                    this.popupState = false;
                                    if (res.confirm) {
                                        uni.navigateTo({
                                            url: '/pages/address/address?source=1'
                                        });
                                    }
                                }
                            });
                        }
                        if (this.tip.isaddresstipforcity == 1) {
                            this.getproductinfoforcity();
                        }
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: res.data.msg,
                            showCancel: false,
                            success: res => {
                                uni.navigateBack();
                            }
                        });
                    }
                });
            },
            // 获取优惠券
            getSelectcoupon() {
                // this.list商品的json
                let list = new Array();
                this.shopinggoods.forEach(item => {
                    item.goodsinfo.forEach(info => {
                        info.procuctid = info.productid;
                        list.push(info);
                    });
                });
                let data = {
                    couponproduct: JSON.stringify(list)
                };
                data.shopids = this.type == 'cart' ? this.ids : '';
                this.$ajax.get('shoppingcart/selectcoupon', data).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.couponList = res.data.result.data;
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            },
            // 计算价格
            getPrice() {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                });
                let url = this.type == 'cart' ? 'shoppingcart/selectgearstepfix' :
                    'shoppingcart/directselectgearstepfix';
                this.$ajax
                    .get(url, {
                        addressid: this.addressData.addressid,
                        shopids: this.ids,
                        number: this.number,
                        //gearinfoid: this.price.gearinfoid,
                        gearinfoid: -1,
                        couponid: this.price.discounttype == 2 ? this.price.couponid : -1,
                        customAddress: this.price.customAddress,
                        extra_value: this.extraState ? this.increment.extra_value : '0',
                        bonuspoint: this.privilegepointState ? this.increment.privilegepointvalue : '0',
                        saleid: this.price.discounttype == 3 ? this.price.saleid : -1,
                        redpacketmoney: this.redpacketState ? this.increment.redpacketmoney : '0',
                        skuid: this.skuid || '',
                        takegroupbuyteamguid: this.takegroupbuyteamguid,
                        groupbuyactivityguid: -1
                    })
                    .then(res => {
                        console.log(res);
                        if (res.data.code == 0) {
                            let data = res.data.result.data;
                            this.price.deductpercent = data.deductpercent;
                            this.increment.extra_price = data.extra_price;
                            this.increment.extra_value = data.extra_value;
                            this.extraState = this.increment.extra_value == 0 ? false : this.extraState;
                            this.price.gearinfoid = data.gearinfoid;
                            this.price.handchargepercent = data.handchargepercent;
                            this.price.handlingchargeall = data.handlingchargeall;
                            this.price.isuse = data.isuse;
                            this.price.mallpay = data.mallpay;
                            this.price.mealpay = data.mealpay;
                            this.price.paystring = data.paystring;
                            this.price.poundageprice = data.poundageprice;
                            this.price.poundageprice_mall = data.poundageprice_mall;
                            this.price.price_usemealcard = data.price_usemealcard;
                            this.price.shouldpay = data.shouldpay;
                            this.price.subtractnow = data.subtractnow;
                        } else {
                            this.$api.msg(res.data.msg);
                        }
                        uni.hideLoading();
                    });
            },
            // 获取活动列表
            getSaleList() {
                let url = this.type == 'cart' ? 'shoppingcart/getsaleactivitylist_checkout' :
                    'shoppingcart/getsaleactivitylist_deccheckout';
                let data = {
                    shopids: this.ids,
                    skuid: this.skuid || '',
                    number: this.numbers[0]
                };
                this.$ajax.get(url, data).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.salseList = res.data.result.data;
                        let itemList = [];
                        this.salseList.forEach(item => {
                            itemList.push(item.title);
                        });
                        itemList.push('暂不使用');
                        let _this = this;
                        uni.showActionSheet({
                            itemList: itemList,
                            success: res => {
                                if (itemList[res.tapIndex] == '暂不使用') {
                                    // 暂不使用活动
                                    _this.noSale();
                                } else {
                                    // 选择活动
                                    _this.selectSale(_this.salseList[res.tapIndex]);
                                }
                            }
                        });
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            },
            //显示活动面板
            toggleSale(type) {
                if (this.price.saleid == -1) {
                    return;
                }
                this.getSaleList();
            },
            //显示优惠券面板
            toggleMask(type) {
                if (this.price.couponid == -1) {
                    return;
                }
                let timer = type === 'show' ? 10 : 300;
                let state = type === 'show' ? 1 : 0;
                if (type === 'show') {
                    this.getSelectcoupon();
                }
                this.maskState = 2;
                setTimeout(() => {
                    this.maskState = state;
                }, timer);
            },
            numberChange(data) {
                this.number = data.number;
            },
            changePayType(type) {
                this.payType = type;
            },
            selectMask(obj) {
                this.price.discounttype = 0;
                this.price.couponid = obj.id;
                this.price.couptitle = '-' + obj.discounts;
                this.selectIncrement('coupon');
                this.getPrice();
                this.toggleMask('down');
            },
            selectSale(obj) {
                this.price.discounttype = 0;
                this.price.saletitle = obj.title;
                this.price.saleid = obj.saleid;
                this.selectIncrement('sale');
                this.getPrice();
            },
            // 使用 积分 红包 和 u币的开关
            switchClick(type) {
                this.extraState = !this.extraState;
                this.getPrice();
            },
            // 选择 优惠时  处理四个优惠中只能选择一个 与 U币搭配使用
            selectIncrement(type) {
                // 优惠券
                if (type == 'coupon') {
                    this.price.discounttype = 2;
                }
                // 活动
                if (type == 'sale') {
                    this.price.discounttype = 3;
                }
                // 积分
                if (type != 'privilegepoint') {
                    this.privilegepointState = false;
                    this.increment.privilegepointvalue = 0;
                    this.increment.privilegepoint = '可用0积分抵¥0.00';
                } else {
                    this.redpacketState = true;
                    this.price.discounttype = 1;
                }
                // 红包
                if (type != 'redpacket') {
                    this.redpacketState = false;
                    this.increment.redpacketmoney = 0;
                    this.increment.redpacketmoneyinfo = '可用红包抵¥0.00';
                } else {
                    this.redpacketState = true;
                    this.price.discounttype = 4;
                }
            },
            // 创建订单
            submit() {
                if (this.addressData.addressid < 1) {
                    this.$api.msg('请选择收货地址');
                    return;
                }
                if (this.idcard.needcheckidnumber == 1 && this.idcard.id_number.length == 0) {
                    this.$refs.identification.open();
                    return;
                }
                if (this.price.price_usemealcard == '¥0.00') {
                    let product = new Array();
                    this.shopinggoods.forEach(item => {
                        item.goodsinfo.forEach(info => {
                            product.push(info.productid);
                        });
                    });
                    this.startOrder(product.join(','));
                } else {
                    this.createOrder();
                }
            },
            // 提交订单
            createOrder() {
                let data = {};
                let product = new Array();
                this.shopinggoods.forEach(item => {
                    item.goodsinfo.forEach(info => {
                        product.push({
                            number: info.number,
                            productid: info.productid,
                            allattribute: info.allattribute,
                            picid: info.pic.id,
                            companyid: item.id,
                            procuctid: info.procuctid
                        });
                    });
                });
                let shopids = '';
                this.ids.forEach(item => {
                    shopids += item + ',';
                });
                data.addressid = this.addressData.addressid;
                data.product = JSON.stringify(product);
                data.shopids = this.type == 'cart' ? shopids.substring(0, shopids.lastIndexOf(',')) : '';
                data.bonuspoint = 0;
                data.freight = this.price.freight;
                data.notes = this.notes;
                data.extravalue = this.extraState ? this.increment.extra_value : 0;
                data.orderrecordids = '';
                data.isonlinepay = 1;
                data.couponid = this.price.discounttype == 2 ? this.price.couponid : -1;
                data.couponproduct = JSON.stringify(product);
                data.sid = this.sid;
                data.upgrade = 1;
                // data.gearinfoid = this.price.gearinfoid;
                data.gearinfoid = -1;
                data.mealpassword = -1;
                data.saleid = this.price.discounttype == 3 ? this.price.saleid : -1;
                data.groupbuyactivityguid = this.groupbuyactivityguid;
                data.takegroupbuyteamguid = this.takegroupbuyteamguid;
                //data.contractid = '';
                //data.accountpay = '';
                data.redpacketmoney = this.increment.redpacketmoney;
                data.idnumber = this.idcard.id_number;
                this.$ajax.get('order/addorder', data).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        let url = '';
                        if (this.price.price_usemealcard == '¥0.00') {
                            url = '/pages/order/orderdetails?ordernum=' + res.data.result.data.ordernum +
                                '&price=' + data.real_price;
                        } else {
                            if (data.type == 1) {
                                url = '/pages/order/order?state=0';
                            } else {
                                url = '/pages/money/pay?ordernum=' + res.data.result.data.ordernum + '&price=' +
                                    data.real_price;
                            }
                        }
                        uni.redirectTo({
                            url
                        });
                    } else if (res.data.code == -31) {
                        this.getproductinfoforcity();
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            },
            // 修改订单地址
            updateOrderAddress() {
                this.getGoodsInfo();
            },
            // 跳转地址
            navTo(url) {
                uni.navigateTo({
                    url: url
                });
            },
            // 返回上一页
            navBack() {
                uni.navigateBack();
            },
            // 取消 弹窗显示
            idCancel() {
                this.idcard.id_number = '';
                this.$refs.identification.close();
            },
            idSubmit() {
                this.$refs.identification.close();
                this.submit();
            },
            // 更换地址
            changeAddress() {
                this.$refs.popup.close();
                this.navTo('/pages/address/address?source=1');
            },
            // 获取消息
            getproductinfoforcity() {
                this.$ajax.get('shoppingcart/getproductinfoforcity', {
                    productids: this.tip.isaddresstipforcityproductids
                }).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        this.tip.title = data.title;
                        this.tip.productlist = data.productlist;
                        this.$refs.popup.open();
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            },
            // 暂不使用优惠券
            noCoupon() {
                this.price.discounttype = 0;
                this.price.couptitle = '未使用优惠券';
                this.getPrice();
                this.maskState = 2;
                setTimeout(() => {
                    this.maskState = 0;
                }, 300);
            },
            // 暂不使用活动
            noSale() {
                this.price.discounttype = 0;
                this.price.saletitle = '未参加活动';
                this.getPrice();
            },
            // 开始提交订单
            startOrder(productids) {
                this.$ajax.get('order/startingBuylimitInNearFuture', {
                    productids: productids
                }).then(res => {
                    let msg = res.data.code == 0 ? '确认提交订单？' : res.data.msg;
                    let _this = this;
                    uni.showModal({
                        title: '提示',
                        content: msg,
                        success: res => {
                            if (res.confirm) {
                                _this.createOrder();
                            }
                        }
                    })
                });
            }
        }
    };
</script>

<style lang="scss">
    page {
        background: $page-color-base;
        padding-bottom: 100upx;
    }

    /deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
        padding: 0;
        border-radius: 20rpx;
    }

    .maxmara {
        .title {
            font-size: 40rpx;
            margin: 40rpx 40rpx 0 40rpx;
        }

        .con {
            display: flex;
            align-items: center;
            padding: 40rpx;

            image {
                width: 80rpx;
                height: 80rpx;
            }

            .tip {
                margin-left: 30rpx;
                font-size: 28rpx;
                color: #c0c4cc;
            }
        }

        .btns {
            border-top: 1px solid #dddddd;
            display: flex;

            view {
                padding: 20rpx 0;
                flex-grow: 1;
                text-align: center;
                font-size: 28rpx;

                &.btn {
                    background: $base-color;
                    color: #fff;
                }
            }
        }
    }

    .identification {
        .title {
            font-size: 40rpx;
            margin: 40rpx;
            text-align: center;
        }

        .con {
            padding: 0 40rpx;

            input {
                width: 100%;
                border-bottom: 1px solid $base-color;
                padding: 8rpx;
                margin-bottom: 20rpx;
                height: 2.5em;
            }

            .tip {
                font-size: 28rpx;
                color: red;
            }
        }

        .btns {
            margin-top: 30rpx;
            border-top: 1px solid #dddddd;
            display: flex;

            view {
                padding: 20rpx 0;
                flex-grow: 1;
                text-align: center;
                font-size: 28rpx;

                &.btn {
                    background: $base-color;
                    color: #fff;
                }
            }
        }
    }

    .address-section {
        padding: 30upx 0;
        background: #fff;
        position: relative;

        .order-content {
            display: flex;
            align-items: center;
        }

        .icon-shouhuodizhi {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 90upx;
            color: #888;
            font-size: 44upx;
        }

        .cen {
            display: flex;
            flex-direction: column;
            flex: 1;
            font-size: 28upx;
            color: $font-color-dark;
        }

        .name {
            font-size: 34upx;
            margin-right: 24upx;
        }

        .address {
            margin-top: 16upx;
            margin-right: 20upx;
            color: $font-color-light;
        }

        .icon-you {
            font-size: 32upx;
            color: $font-color-light;
            margin-right: 30upx;
        }

        .a-bg {
            position: absolute;
            left: 0;
            bottom: 0;
            display: block;
            width: 100%;
            height: 5upx;
        }
    }

    .goods-section {
        margin-top: 16upx;
        background: #fff;
        padding-bottom: 1px;

        .g-header {
            display: flex;
            align-items: center;
            height: 84upx;
            padding: 0 30upx;
            position: relative;
        }

        .logo {
            display: block;
            width: 50upx;
            height: 50upx;
            border-radius: 100px;
        }

        .name {
            font-size: 30upx;
            color: $font-color-base;
            margin-left: 24upx;
        }

        .g-item {
            display: flex;
            margin: 20upx 30upx;

            image {
                flex-shrink: 0;
                display: block;
                width: 140upx;
                height: 140upx;
                border-radius: 4upx;
            }

            .right {
                flex: 1;
                padding-left: 24upx;
                overflow: hidden;
            }

            .title {
                font-size: 30upx;
                color: $font-color-dark;
            }

            .spec {
                font-size: 26upx;
                color: $font-color-light;
            }

            .price-box {
                display: flex;
                align-items: center;
                font-size: 32upx;
                color: $font-color-dark;
                padding-top: 10upx;

                .price {
                    margin-bottom: 4upx;
                    color: $base-color;
                }

                .number {
                    font-size: 26upx;
                    color: $font-color-base;
                    margin-left: 20upx;
                }
            }

            .receivetimetips {
                font-size: 24rpx;
                color: $base-color;
            }

            .step-box {
                position: relative;
            }
        }
    }

    .tips {
        font-size: 24rpx;
        color: $base-color;
        padding: 10rpx 30rpx;
    }

    .yt-list {
        margin-top: 16upx;
        background: #fff;
    }

    .yt-list-cell {
        display: flex;
        align-items: center;
        padding: 10upx 30upx 10upx 40upx;
        line-height: 70upx;
        position: relative;

        .tit {
            flex-grow: 1;
            font-size: 28rpx;
        }

        &.cell-hover {
            background: #fafafa;
        }

        &.b-b:after {
            left: 30upx;
        }

        .cell-icon {
            height: 32upx;
            width: 32upx;
            font-size: 22upx;
            color: #fff;
            text-align: center;
            line-height: 32upx;
            background: #f85e52;
            border-radius: 4upx;
            margin-right: 12upx;

            &.hb {
                background: #ffaa0e;
            }

            &.lpk {
                background: #3ab54a;
            }
        }

        .cell-more {
            align-self: center;
            font-size: 24upx;
            color: $font-color-light;
            margin-left: 8upx;
            margin-right: -10upx;
        }

        .cell-tit {
            flex: 1;
            font-size: 26upx;
            color: $font-color-light;
            margin-right: 10upx;
        }

        .cell-tip {
            font-size: 26upx;
            color: $font-color-dark;

            &.disabled {
                color: $font-color-light;
            }

            &.active {
                color: $base-color;
            }

            &.red {
                color: $base-color;
            }
        }

        &.desc-cell {
            .cell-tit {
                max-width: 90upx;
            }
        }

        .desc {
            flex: 1;
            font-size: $font-base;
            color: $font-color-dark;
        }
    }

    /* 支付列表 */
    .pay-list {
        padding-left: 40upx;
        margin-top: 16upx;
        background: #fff;

        .pay-item {
            display: flex;
            align-items: center;
            padding-right: 20upx;
            line-height: 1;
            height: 110upx;
            position: relative;
        }

        .icon-weixinzhifu {
            width: 80upx;
            font-size: 40upx;
            color: #6bcc03;
        }

        .icon-alipay {
            width: 80upx;
            font-size: 40upx;
            color: #06b4fd;
        }

        .icon-xuanzhong2 {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60upx;
            height: 60upx;
            font-size: 40upx;
            color: $base-color;
        }

        .tit {
            font-size: 32upx;
            color: $font-color-dark;
            flex: 1;
        }
    }

    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 995;
        display: flex;
        align-items: center;
        width: 100%;
        height: 90upx;
        justify-content: space-between;
        font-size: 30upx;
        background-color: #fff;
        z-index: 998;
        color: $font-color-base;
        box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

        .price-content {
            padding-left: 30upx;
            flex-grow: 2;

            .tip {
                font-size: 24rpx;
            }
        }

        .price-tip {
            color: $base-color;
            margin-left: 8upx;
        }

        .price {
            font-size: 36upx;
            color: $base-color;
        }

        .submit {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 280upx;
            height: 100%;
            color: #fff;
            font-size: 32upx;
            background-color: $base-color;
        }
    }

    /* 优惠券面板 */
    .mask {
        display: flex;
        align-items: flex-end;
        position: fixed;
        left: 0;
        top: var(--window-top);
        bottom: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0);
        z-index: 9995;
        transition: 0.3s;

        .mask-content {
            width: 100%;
            min-height: 30vh;
            max-height: 70vh;
            background: #f3f3f3;
            transform: translateY(100%);
            transition: 0.3s;
            overflow-y: scroll;
            margin-bottom: 50px;
        }

        .temporarily {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: $base-color;
            color: #fff;
            text-align: center;
            padding: 20rpx;
        }

        &.none {
            display: none;
        }

        &.show {
            background: rgba(0, 0, 0, 0.4);

            .mask-content {
                transform: translateY(0);
            }
        }
    }

    /* 优惠券列表 */
    .coupon-item {
        margin: 20upx 24upx;
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
</style>
