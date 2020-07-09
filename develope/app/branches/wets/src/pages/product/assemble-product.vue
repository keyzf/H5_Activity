<template>
    <view class="container" :class="{ over: overf }">
        <view id="detimal">
            <view class="carousel">
                <swiper indicator-dots circular="true" duration="400">
                    <swiper-item class="swiper-item" v-for="(item, index) in data.picture.urlList" :key="index">
                        <view class="image-wrapper">
                            <block v-if="item.videourl != ''">
                                <video class="videoys" id="myVideo" :src="item.videourl" :poster="data.shareinfo.sharepicurl"
                                    :enable-progress-gesture="progressgesture"></video>
                            </block>
                            <block v-else>
                                <image :src="item.url" mode="aspectFill"></image>
                            </block>
                        </view>
                    </swiper-item>
                </swiper>
                <image v-if="data.activityIconSwitch == 1" :src="data.activityIcon" mode="aspectFit" class="titleicon"></image>
            </view>
            <view class="rob" v-show="data.groupbuystate != 0">
                <view class="con">
                    <view class="new">{{ data.newPriceRange }}</view>
                    <view class="old">{{ data.oldPriceRange }}</view>
                </view>
                <block v-if="data.groupbuystate == 1">
                    <view class="tip">距离结束仅剩</view>
                    <view class="time">
                        <countdown :time="(data.endtimestamp - new Date().getTime())/1000" :day="false"></countdown>
                    </view>
                </block>
            </view>
            <view class="introduce-section">
                <view class="title">
                    <text v-if="data.maxdiscounts != '' || data.presell != ''" class="preferential">{{ data.maxdiscounts == '' ? data.presell : data.maxdiscounts }}</text>
                    <image v-if="data.activityTitleIconSwitch == 1" :src="data.activityTitleIcon" mode="aspectFit"></image>
                    <text v-if="data.groupbuy_label != ''" class="preferential">{{ data.groupbuy_label }}</text>
                    {{ data.mainheading }}
                </view>
                <view class="title-tip">{{ data.subheading }}</view>
                <view class="price-box">
                    <text class="price">{{ data.newPriceRange }}</text>
                    <text class="m-price">{{ data.oldPriceRange }}</text>
                    <text class="totalSales">{{ data.totalSales }}人已购买</text>
                </view>
                <!-- <view class="bot-row">
				<text>销量:{{data.totalSales}}</text>
				<text>库存: 4690</text>
				<text>浏览量: 768</text>
			</view> -->
            </view>
            <view class="share-section">
                <view class="share-icon" :class="{x:item.type == 2}" v-for="(item, index) in data.after_sale_list" :key="index">
                    <text class="yticon icon-xingxing"></text>
                    {{ item.text }}
                </view>
            </view>
            <view class="c-list">
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
            </view>
            <view class="introduce" @click="openedit">
                <view class="con">
                    <text>玩法介绍</text>
                    <text class="x">详细介绍</text>
                </view>
                <view class="main">
                    <view class="item x">
                        <image src="../../static/assemble-1.png" mode="aspectFit"></image>
                        <view class="title"> 开团/参团 </view>
                        <view class="tip"></view>
                    </view>
                    <view class="item x">
                        <image src="../../static/assemble-2.png" mode="aspectFit"></image>
                        <view class="title"> 邀请好友参团 </view>
                        <view class="tip">享受低价</view>
                    </view>
                    <view class="item x">
                        <image src="../../static/assemble-3.png" mode="aspectFit"></image>
                        <view class="title"> 商家抢单 </view>
                        <view class="tip">未成团自动退款</view>
                    </view>
                    <view class="item">
                        <image src="../../static/assemble-4.png" mode="aspectFit"></image>
                        <view class="title"> 成团发货 </view>
                        <view class="tip">未成团自动退款</view>
                    </view>
                </view>
            </view>
            <view class="eva-section" @click="evaluateClick">
                <view class="e-header yticon icon-you"><text class="tit">评价</text></view>
            </view>
            <view class="stores">
                <view class="title">
                    <image class="img" :src="data.captainInfo.headUrl" mode="aspectFill"></image>
                    <image class="tip" :src="'../../static/vip' + data.captainInfo.memberlevel + '.png'" mode="aspectFill"></image>
                </view>
                <view class="tit">
                    {{data.captainInfo.nickname}} {{data.captainInfo.successnumber}}
                </view>
            </view>
        </view>
        <view class="detail-desc">
            <view class="d-header"><text>图文详情</text></view>
            <view class="detail-con" v-html="showpage"></view>
            <!-- <u-parse :content="showpage" class="conhtml"></u-parse> -->
        </view>

        <!-- 底部操作菜单 -->
        <view class="page-bottom" v-if="showtab && data.productkind != 4">
            <block v-if="data.groupbuystate == 0">
                <view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite">
                    <text class="yticon icon-shoucang"></text>
                    <text>关注</text>
                </view>
                <view @click="switchclick" class="p-b-btn">
                    <text class="yticon icon-gouwuche"></text>
                    <text>购物车</text>
                    <text v-if="cartnumber != 0" class="cart-number">{{ cartnumber }}</text>
                </view>
                <view class="action-btn-group" @click="toggleSpec">发起拼团</view>
            </block>
            <view class="action-btn-group" @click="toggleSpec" v-if="data.groupbuystate == 1 && data.isgroupbuymember == 0">参与拼团</view>
            <view class="action-btn-groups" v-if="data.groupbuystate == 1 && data.isgroupbuymember == 1">
                <view>还差{{data.remainnumber}}人成团，<countdown class="time" :time="(data.endtimestamp - new Date().getTime())/1000"
                        :day="false"></countdown>后结束</view>
                <view>分享给好友</view>
            </view>
            <view class="action-btn-group n" v-if="data.groupbuystate == 2">抢单中</view>
            <view class="action-btn-group n" v-if="data.groupbuystate == 3">拼团失败</view>
            <view class="action-btn-group n" v-if="data.groupbuystate == 4">抢单失败</view>
            <view class="action-btn-group n" v-if="data.groupbuystate == 5">拼团成功</view>
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
                            <text v-for="(childItem, childIndex) in item.attribute" :key="childIndex" class="tit"
                                :class="{ selected: childItem.selected, selectedx: childItem.selectedx }" @click="selectSpec(childItem.id, item.orderid, childItem.selectedx)">
                                {{ childItem.name }}
                            </text>
                        </view>
                    </view>
                </scroll-view>
                <view class="shop-carc">
                    <text style="font-size: 28upx;flex-grow: 1;">数量</text>
                    <uni-number-box class="step" :min="1" :max="shoppingcart.stock" :value="number > shoppingcart.stock ? shoppingcart.stock : number"
                        :isMax="number >= shoppingcart.stock ? true : false" :isMin="number === 1" @eventChange="numberChange"></uni-number-box>
                </view>
                <view class="action-btn-group" @click="initiate" v-if="data.groupbuystate == 0">发起拼团</view>
                <view class="action-btn-group" @click="saveTeam" v-if="data.groupbuystate == 1">参与拼团</view>
            </view>
        </view>
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
        <!-- 拼团 -->
        <uni-popup ref="assemble" class="assemble" type="center" @change="overk" @touchmove.stop="">
            <view class="layer">
                <view class="title"> 填写拼团信息 </view>
                <view class="con">
                    <view class="item">
                        <text class="label">单价</text>
                        <input type="text" value="" v-model="price_group" placeholder="请输入您想要的价格" />
                        <text class="number">(原价:{{shoppingcart.newprice}})</text>
                    </view>
                    <view class="item">
                        <text class="label">人数</text>
                        <input type="text" value="" v-model="number_group" placeholder="请输入您拼团的人数" />
                    </view>
                    <view class="tip">
                        注：团的有效期24小时，如拼团失败，以U币形式返还，价值更高哦（U币支付除外）
                    </view>
                    <view class="tips">
                        <text>共计:1件</text>
                        <text>总价:{{price_group}}元</text>
                    </view>
                </view>
                <view class="btns">
                    <text class="left" @click="cancelGroup()">取消</text>
                    <text class="right" @click="saveTeam('add')">确定</text>
                </view>
            </view>
        </uni-popup>
        <view class="backtop" :class="{ x: backshow }">
            <image src="../../static/backtop.png" mode="aspectFit" @click="backtop"></image>
        </view>
    </view>
</template>

<script>
    // import share from '@/components/share';
    import countdown from '@/components/countdown/countdown.vue';
    import uniNumberBox from '@/components/uni-number-box.vue';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
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
                number_group: "",
                price_group: "",
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
                    activity: [],
                    captainInfo: {
                        headUrl: ''
                    }
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
            this.categoryId = options.categoryId
            uni.showLoading({
                title: '加载中'
            });
            SKUResult = {};
            //接收传值,id里面放的是标题，因为测试数据并没写id
            let id = options.productid;
            this.id = id;
            let type_group_res = options.typeGroup
            this.type_group = type_group_res == 4 ? 4 : 1;
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
        methods: {
            saveTeam(type) {
                console.log(this.specid)
                if (type == 'add') {
                    if (this.price_group == "") {
                        this.$api.msg('请输入您拼团的价格');
                        return;
                    }
                    if (this.number_group == "") {
                        this.$api.msg('请输入您拼团的人数');
                        return;
                    }
                    if (this.number_group == 1) {
                        this.$api.msg('拼团人数须大于1');
                        return;
                    }

                    let json = {
                        attributes: this.specid.toString(),
                        productid: this.id,
                        price: this.price_group,
                        number: this.number_group,
                        type: this.type_group,
                    }
                    console.log(json)
                    if (this.type_group == 4) {
                        json.categoryId = this.categoryId
                    }

                    this.$ajax.get('groupbuying/saveTeam', json).then(res => {
                        if (res.data.code == 0) {
                            let data = res.data.result.data;
                            let productid = data.productId
                            let takegroupbuyteamguid = data.teamguid
                            let attributes = data.attributes
                            uni.navigateTo({
                                url: '/pages/order/groupcreateOrder?number=' + this.number +
                                    "&productid=" +
                                    productid + "&keywords=" + attributes +
                                    "&takegroupbuyteamguid=" + takegroupbuyteamguid
                            });
                        }
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/order/groupcreateOrder?number=' + this.number + "&productid=" + this.id +
                            "&keywords=" + this.specid.toString() + "&takegroupbuyteamguid=" + this.data.groupbuy_teamguid
                    });
                }


            },
            openedit() {
                uni.navigateTo({
                    url: '/pages/user/customerexit?url=' + this.data.groupbuy_distruction_url + '&name=玩法介绍'
                });
            },
            backtop() {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                });
            },
            load() {
                this.$ajax.get('product/getProductInfo2', {
                    productid: this.id,
                    attributes: this.attributes
                }).then(res => {
                    if (res.data.code == 0) {
                        this.data = res.data.result.data;
                        this.favorite = res.data.result.data.attentionState == 0 ? false : true;
                        this.showtab = true;
                    }
                });
            },
            switchclick() {
                this.$store.commit("add_navlist", this.$store.state.footer_store.now_page_index)
                this.$store.commit("add_navlist", 'cart')
                // this.$store.state.footer_store.now_page_index = 'cart';
                uni.navigateTo({
                    url: '/pages/home/home'
                })
            },
            overk(d) {
                if (d.show) {
                    this.overf = true;
                } else {
                    this.overf = false;
                }
            },
            //数量
            numberChange(data) {
                this.number = data.number;
            },
            //规格弹窗开关
            initiate(i, type) {
                this.specClass = 'hide';
                setTimeout(() => {
                    this.specClass = 'none';
                }, 250);
                this.$refs.assemble.open();
            },
            cancelGroup() {
                this.$refs.assemble.close();
            },
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
                            this.buys();
                        } else if (this.clickType == 2 && i == 'go') {
                            this.buycards();
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
                this.attributes_group = index
                console.log(index + "," + pid + "," + kg)
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
            // 活动
            openactivity() {
                uni.showLoading({
                    title: '加载中'
                });
                this.$ajax.get('product/getProductActivity', {
                    pid: this.id
                }).then(res => {
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
                            this.$ajax.get('product/getProductInfo2', {
                                productid: this.id,
                                attributes: this.attributes
                            }).then(res => {
                                if (res.data.code == 0) {
                                    this.data = res.data.result.data;
                                    this.favorite = res.data.result.data.attentionState == 0 ? false :
                                        true;
                                    this.showtab = true;
                                    if (this.$wx.isWechat()) {
                                        this.$wx.share({
                                                title: this.data.mainheading,
                                                desc: this.data.subheading,
                                                imgUrl: this.data.picture.urlList[0].url
                                            },
                                            'http://ets.51pingce.net/pages/product/product?productid=' +
                                            this.id
                                        );
                                    }
                                } else {
                                    if (res.data.msg == '暂无查看信息') {
                                        uni.hideLoading();
                                        this.$api.msg('暂无查看信息');
                                        setTimeout(function() {
                                            uni.navigateBack();
                                        }, 1000);
                                    }
                                }
                            });
                        } else {
                            this.$ajax.get('product/getProductInfo2', {
                                productid: this.id,
                                attributes: this.attributes
                            }).then(res => {
                                if (res.data.code == 0) {
                                    this.data = res.data.result.data;
                                    this.favorite = res.data.result.data.attentionState == 0 ? false :
                                        true;
                                    this.showtab = true;
                                    if (this.$wx.isWechat()) {
                                        this.$wx.share({
                                                title: this.data.mainheading,
                                                desc: this.data.subheading,
                                                imgUrl: this.data.picture.urlList[0].url
                                            },
                                            'http://ets.51pingce.net/pages/product/product?productid=' +
                                            this.id
                                        );
                                    }
                                } else {
                                    if (res.data.msg == '暂无查看信息') {
                                        uni.hideLoading();
                                        this.$api.msg('暂无查看信息');
                                        setTimeout(function() {
                                            uni.navigateBack();
                                        }, 1000);
                                    }
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
                                                    this.selectSpec(items.id, inexs,
                                                        false);
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
                        this.$ajax.get('shoppingcart/getModelTipNum', {
                            code: 'SHOPCART'
                        }).then(res => {
                            this.cartnumber = res.data.result.data.tipnumber;
                        });
                    } else {
                        this.$api.msg('系统出错,请稍后再试');
                    }
                });
                this.$ajax.get('product/getProductDetail', {
                    productid: this.id
                }).then(res => {
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
            height: 100vh;
            min-height: 100vh;
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
        margin-bottom: 20rpx;
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
            padding: 20rpx 0 20rpx 30rpx;

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
            display: flex;
            align-items: baseline;
            height: 64upx;
            padding: 10upx 0;
            font-size: 26upx;
            color: $uni-color-primary;

            .totalSales {
                float: right;
                color: #bbbbbb;
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

    // 拼团
    .introduce {
        margin: 20rpx 0;
        background: #FFF;

        .con {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20rpx;
            font-size: 32rpx;

            .x {
                font-family: 'yticon' !important;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                position: relative;
                padding-right: 30rpx;

                &:after {
                    content: '\E606';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    margin-top: -8px;
                    line-height: 1;
                }
            }
        }

        .main {
            display: flex;
            align-items: center;
            padding-bottom: 20rpx;

            .item {
                flex-grow: 1;
                text-align: center;
                font-family: 'yticon' !important;
                font-size: 24rpx;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                position: relative;

                image {
                    display: inline-block;
                    width: 100rpx;
                    min-width: 100rpx;
                    height: 100rpx;

                }

                .title {
                    font-size: 28rpx;
                }

                .tip {
                    font-size: 24rpx;
                    line-height: 24rpx;
                    height: 24rpx;
                    color: #969696;
                }

                &.x:after {
                    content: '\E606';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    margin-top: -8px;
                    line-height: 1;
                }
            }
        }
    }

    .stores {
        margin: 20rpx 0;
        background: #FFF;
        padding: 20rpx;
        display: flex;
        align-items: center;
        font-size: 32rpx;

        .title {
            position: relative;

            .img {
                width: 140rpx;
                min-width: 140rpx;
                height: 140rpx;
                border-radius: 50%;
            }

            .tip {
                width: 60rpx;
                height: 60rpx;
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }

        .tit {
            margin-left: 20rpx;
        }
    }

    /* 分享 */
    .share-section {
        display: flex;
        align-items: center;
        color: $font-color-base;
        background: linear-gradient(left, #fdf5f6, #fbebf6);
        padding: 12upx 30upx;

        .share-icon {
            display: flex;
            align-items: center;
            height: 30upx;
            line-height: 1;
            border: 1px solid $uni-color-primary;
            border-radius: 4upx;
            position: relative;
            overflow: hidden;
            font-size: 28upx;
            color: $uni-color-primary;
            margin-right: 20upx;
            padding: 20upx;
            padding-left: 0;

            &:after {
                content: '';
                width: 50upx;
                height: 50upx;
                border-radius: 50%;
                left: -20upx;
                top: -6upx;
                position: absolute;
                background: $uni-color-primary;
            }
            &.x{
              border: 0;
              background: #f1f1f1;
              color: #969696;
              &:after {
                  content: none;
              }
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
        height: 100upx;
        font-size: 32rpx;
        background: $base-color;
        text-align: center;
        line-height: 100rpx;
        color: #FFF;

        &.n {
            background: #888888;
        }
    }

    .action-btn-groups {
        flex-grow: 1;
        font-size: 32rpx;
        background: $base-color;
        text-align: center;
        line-height: 50rpx;
        color: #FFF;

        .time {
            display: inline-block;
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

    .assemble {
        /deep/ .uni-popup__wrapper-box {
            background: url(../../static/assemble.png) no-repeat center !important;
            background-size: 100% 100% !important;
            ;
            width: 670rpx;
            height: 760rpx;
            max-width: inherit !important;
            max-height: inherit !important;
            ;
        }

        .layer {
            .title {
                margin-top: 100rpx;
                text-align: center;
                font-size: 40rpx;
                font-weight: bold;
                color: $base-color;
            }

            .con {
                margin: 20rpx 30rpx;
                font-size: 32rpx;

                .item {
                    padding: 20rpx 0;
                    border-bottom: 1px solid #DDD;
                    display: flex;
                    align-items: center;

                    .label {
                        min-width: 80rpx;
                    }

                    input {
                        flex-grow: 1;
                        height: auto;
                        min-height: inherit;
                        font-size: 32rpx;
                    }

                    .number {
                        min-width: 220rpx;
                        color: $base-color;
                    }
                }

                .tip {
                    font-size: 24rpx;
                    color: $base-color;
                }

                .tips {
                    margin-top: 40rpx;
                    font-size: 28rpx;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
            }

            .btns {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 40rpx 30rpx 0 30rpx;

                text {
                    width: 40%;
                    padding: 10rpx 20rpx;
                    border: 2px solid #FFF;
                    color: #FFF;
                    text-align: center;
                    border-radius: 10rpx;

                    &.right {
                        background: rgb(252, 196, 99);
                        color: $base-color;
                    }
                }

            }
        }

    }
</style>
