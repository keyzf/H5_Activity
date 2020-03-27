<template>
    <view class="container">
        <!-- 空白页 -->
        <view v-if="empty === true" class="empty">
            <image src="/static/emptyCart.jpg" mode="aspectFit"></image>
            <view class="empty-tips">
                空空如也
                <text class="navigator" @click="openindex">随便逛逛></text>
            </view>
        </view>
        <view v-else>
            <view class="naver">
                购物车
                <text @click="delstats">{{ delstat == false ? '编辑' : '完成' }}</text>
            </view>
            <!-- 列表 -->
            <view class="cart-list">
                <block v-for="(item, index) in cartList" :key="index">
                    <view class="shop-item">
                        <view class="shop-title cart-item">
                            <view class="yticon icon-xuanzhong2 checkbox" :class="{ checked: item.checked }" @click="check('shop', index)"></view>
                            <view style="flex-grow: 1;">{{ item.companyname }}</view>
                        </view>
                        <view class="cart-item" v-for="(items, indexs) in item.goodsinfo" :key="indexs" :class="items.isuse == 0 ? 'xj' : ''">
                            <view class="yticon icon-xuanzhong2 checkbox" :class="{ checked: items.checked }" @click="check('item', index, indexs)"></view>
                            <view class="image-wrapper" @click="check('item', index, indexs)">
                                <img :src="items.pic.url" :class="[item.loaded]" />
                                <text></text>
                            </view>

                            <view class="item-right">
                                <view @click="openproduck(items)">
                                    <view class="clamp title">{{ items.productname }}</view>
                                    <view class="clamp attr">{{ items.attributeshow }}</view>
                                    
                                </view>
                                <view class="edit">
                                    <view class="con">
                                        <view class="price">¥{{ items.newprice }}</view>
                                    </view>
                                    <uni-number-box
                                        class="step"
                                        :min="1"
                                        :max="items.number > items.stock ? items.number : items.stock"
                                        :value="items.number"
                                        :isMin="items.number === 1"
                                        :isMax="items.number >= items.stock ? true : false"
                                        :index="indexs"
                                        :zindex="index"
                                        @eventChange="numberChange"
                                        v-if="items.isuse == 1"
                                        :disabled="truess"
                                    ></uni-number-box>
                                </view>
                                <text class="tip" v-if="items.isfull == 0 && items.isuse == 1">库存不足,请修改数量</text>
                            </view>
                        </view>
                    </view>
                </block>
            </view>
            <!-- 底部菜单栏 -->
            <view class="action-section">
                <view class="checkbox">
                    <image :src="allChecked ? '/static/selected.png' : '/static/select.png'" mode="aspectFit" @click="check('all')"></image>
                    <view class="clear-btn" :class="{ show: allChecked }" @click="clearCart">删除</view>
                </view>
                <block v-if="delstat == false">
                    <view class="total-box">
                        <view class="price">
                            <text class="coupon" v-show="oldtotal != ''">总额:{{ oldtotal }}，</text>
                            合计:{{ total == '' ? 0 : total }}
                        </view>
                        <text class="coupon" v-show="extra_price != 0">{{ extra_price }}</text>
                    </view>
                    <button type="primary" class="no-border confirm-btn" @click="createOrder">结算</button>
                </block>
                <block v-else>
                    <view class="total-box"></view>
                    <button type="primary" class="no-border confirm-btn" @click="deleteCartItem">删除</button>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box.vue';
export default {
    components: {
        uniNumberBox
    },
    data() {
        return {
            truess: true,
            oldtotal: 0,
            extra_price: 0,
            total: 0, //总价格
            msg: '',
            allChecked: false, //全选状态  true|false
            empty: false, //空白页现实  true|false
            cartList: [],
            delstat: false
        };
    },
    created(){
    	uni.showLoading({
    	    title: '加载中'
    	});
    	this.load();
    	let _this = this;
    	uni.$on('changeLoginState', function(data) {
    	    _this.load();
    	});
    	uni.$on('join', function(data) {
    	    _this.load();
    	});
    },
    watch: {
        //显示空白页
        cartList(e) {
            let empty = e.length === 0 ? true : false;
            if (this.empty !== empty) {
                this.empty = empty;
            }
        }
    },

    methods: {
        //请求数据
        load(type) {
            const data = {
                timestamp: new Date().getTime()
            };
            this.$ajax.get('shoppingcart/lookshoplist', data).then(res => {
                if (res.data.code == 0) {
                    let list = res.data.result.data;
                    if (type == 'res') {
                        this.cartList = [];
                    }
                    let cartList = list.map(item => {
                        item.checked = false;
                        for (var i = 0; i < item.goodsinfo.length; i++) {
                            item.goodsinfo[i].checked = false;
                        }
                        return item;
                    });
                    this.allChecked = false;
                    this.cartList = cartList;
                    uni.hideLoading();
                } else {
                    this.$api.msg(res.data.msg);
                }
                uni.stopPullDownRefresh();
            });
            // let list = await this.$api.json('cartList');
            // let cartList = list.map(item=>{
            // 	item.checked = true;
            // 	return item;
            // });
            // this.cartList = cartList;
            // this.calcTotal();  //计算总价
        },
		more(){ },
        openindex(){
            this.$store.state.footer_store.now_page_index = 'home';
        },
        cartnumbers() {
            this.$ajax.get('shoppingcart/getModelTipNum', { code: 'SHOPCART' }).then(res => {
                let number = res.data.result.data.tipnumber;
                this.$store.commit("set_number",number)
            });
        },
        delstats() {
            this.delstat = !this.delstat;
            this.load();
            this.allChecked = false;
            this.calcTotal();
        },
        navToLogin() {
            uni.navigateTo({
                url: '/pages/public/login'
            });
        },
        openproduck(it) {
            let id = it.productid;
            uni.navigateTo({
                url: '/pages/product/product?productid=' + id
            });
        },
        //选中状态处理
        check(type, index, indexs) {
            if (type === 'item') {
                this.cartList[index].goodsinfo[indexs].checked = !this.cartList[index].goodsinfo[indexs].checked;
                let shopitem = [];
                let shopfalse = [];
                this.cartList[index].goodsinfo.forEach(item => {
                    if (item.isuse != 0 || this.delstat) {
                        if (item.isfull != 0 || this.delstat) {
                            if (item.checked) {
                                shopitem.push(2);
                            }
                        } else {
                            item.checked = false;
                            shopfalse.push(2);
                        }
                    } else {
                        item.checked = false;
                        shopfalse.push(2);
                    }
                });
                if (shopitem.length + shopfalse.length == this.cartList[index].goodsinfo.length && shopitem.length > 0) {
                    this.cartList[index].checked = true;
                } else {
                    this.cartList[index].checked = false;
                }

                let kgz = true;
                this.cartList.forEach(item => {
                    if (item.checked == false) {
                        item.goodsinfo.forEach(ite => {
                            if ((ite.isuse != 0 && ite.isfull != 0) || this.delstat) {
                                if (ite.checked == false) {
                                    kgz = false;
                                }
                            }
                        });
                    }
                });
                this.allChecked = kgz;
            } else if (type === 'shop') {
                this.cartList[index].checked = !this.cartList[index].checked;
                let kg = this.cartList[index].checked;
                let shopstata = false;
                for (var i = 0; i < this.cartList[index].goodsinfo.length; i++) {
                    if (this.cartList[index].goodsinfo[i].isuse == 0 || this.cartList[index].goodsinfo[i].isfull == 0) {
                        if (this.delstat == true) {
                            this.cartList[index].goodsinfo[i].checked = kg;
                            shopstata = true;
                        } else {
                            this.cartList[index].goodsinfo[i].checked = false;
                        }
                    } else {
                        this.cartList[index].goodsinfo[i].checked = kg;
                        shopstata = true;
                    }
                }
                if (shopstata == false) {
                    this.cartList[index].checked = false;
                }
                let kgz = true;
                this.cartList.forEach(item => {
                    if (item.checked == false) {
                        item.goodsinfo.forEach(ite => {
                            if ((ite.isuse != 0 && ite.isfull != 0) || this.delstat) {
                                if (ite.checked == false) {
                                    kgz = false;
                                }
                            }
                        });
                    }
                });
                this.allChecked = kgz;
            } else {
                const checked = !this.allChecked;
                const list = this.cartList;
                let cartList = list.map(item => {
                    item.checked = checked;
                    let erc = [];
                    for (var i = 0; i < item.goodsinfo.length; i++) {
                        item.goodsinfo[i].checked = checked;
                        if (item.goodsinfo[i].isuse == 0 || item.goodsinfo[i].isfull == 0) {
                            if (this.delstat == false) {
                                item.goodsinfo[i].checked = false;
                                erc.push('en');
                            } else {
                                item.goodsinfo[i].checked = checked;
                            }
                        }
                    }
                    if (erc.length == item.goodsinfo.length) {
                        item.checked = false;
                    }
                    return item;
                });
                this.cartList = cartList;
                this.allChecked = checked;
            }
            if (this.delstat == false) {
                this.calcTotal();
            }
        },
        //数量
        numberChange(data) {
            if (!this.delstat) {
                let idnum = this.cartList[data.zindex].goodsinfo[data.index].id;
                const datas = {
                    number: data.number - this.cartList[data.zindex].goodsinfo[data.index].number,
                    shopid: idnum
                };
                this.$ajax.get('shoppingcart/updatestocfix', datas).then(res => {
                    if (res.data.code == 0) {
                        this.allChecked = false;
                        this.$ajax.get('shoppingcart/lookshoplist', {}).then(res => {
                            if (res.data.code == 0) {
                                let list = res.data.result.data;
                                list.forEach((item, pindex) => {
                                    item.goodsinfo.forEach((it, index) => {
                                        if(idnum == it.id){
                                            this.cartList.forEach((newitem, pindex) => {
                                                newitem.goodsinfo.forEach((newit, index) => {
                                                    if(idnum == newit.id){
                                                        newit.isfull = it.isfull;
                                                        newit.isues = it.isues;
                                                        newit.number = it.number;
                                                        newit.state = it.state;
                                                        newit.stock = it.stock;
                                                    }
                                                });
                                            });
                                        }
                                    });
                                });
                            } else {
                                this.$api.msg(res.data.msg);
                            }
                        });

                        this.calcTotal();
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            }
        },
        //删除
        deleteCartItem() {
            let _this = this;
            uni.showModal({
                title: '提示',
                content: '您确定删除商品吗',
                success: function(res) {
                    if (res.confirm) {
                        let k = [];
                        _this.cartList.forEach(item => {
                            item.goodsinfo.forEach(it => {
                                if (it.checked) {
                                    k.push(it.id);
                                }
                            });
                        });
                        const data = {
                            shopid: k
                        };
                        _this.$ajax.get('shoppingcart/delshop', data).then(res => {
                            if (res.data.code == 0) {
                                _this.load();
                                _this.cartnumbers();
                                _this.$api.msg('删除成功');
                            } else {
                                _this.$api.msg(res.data.msg);
                            }
                        });
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
        },
        //清空
        clearCart() {
            let _this = this;
            uni.showModal({
                content: '清空购物车？',
                success: e => {
                    if (e.confirm) {
                        let k = [];
                        _this.cartList.forEach(item => {
                            item.goodsinfo.forEach(it => {
                                k.push(it.id);
                            });
                        });
                        const data = {
                            shopid: k
                        };
                        _this.$ajax.get('shoppingcart/delshop', data).then(res => {
                            if (res.data.code == 0) {
                                _this.load();
                                _this.cartnumbers();
                            } else {
                                _this.$api.msg(res.data.msg);
                            }
                        });
                    }
                }
            });
        },
        //计算总价
        calcTotal() {
            let list = this.cartList;
            if (list.length === 0) {
                this.empty = true;
                return;
            }
            let total = [];
            let checked = true;
            list.forEach(item => {
                item.goodsinfo.forEach(item => {
                    if (item.checked === true) {
                        total.push(item.id);
                    }
                });
            });
            const data = {
                shopids: total
            };
            this.$ajax.get('shoppingcart/shopcartdiscountinfo', data).then(res => {
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    this.total = data.price_true;
                    this.extra_price = data.extra_price;
                    this.oldtotal = data.totalprice;
                    this.msg = '';
                } else {
                    this.msg = res.data.msg;
                }
            });
            //this.allChecked = checked;
            //this.total = Number(total.toFixed(2));
        },
        //创建订单
        createOrder() {
            if (this.msg.length > 0) {
                this.$api.msg(this.msg);
                return;
            }
            let list = this.cartList;
            let goodsData = [];
            list.forEach(item => {
                item.goodsinfo.forEach(goods => {
                    if (goods.checked) {
                        console.log(goods);
                        goodsData.push({
                            attr_val: goods.id,
                            number: goods.number
                        });
                    }
                });
            });
            if (goodsData.length > 0) {
                uni.navigateTo({
                    url: '/pages/order/createOrder?type=cart&data=' + JSON.stringify({ goodsData: goodsData })
                });
            } else {
                this.$api.msg('请选择商品');
            }
        }
    }
};
</script>

<style lang="scss">
page {
    background: #f8f8f8;
}
.naver {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    text-align: center;
    background: #fff;
    z-index: 10;
    font-weight: 700;
    font-size: 32rpx;
    line-height: 88rpx;
    text-align: center;
    text {
        font-size: 26rpx;
        line-height: 88rpx;
        font-weight: 500;
        margin-right: 30rpx;
        position: absolute;
        right: 0;
    }
}
.cart-list {
    margin-top: 88rpx;
}
.container {
    padding-bottom: 200upx;
    background: #f8f8f8;
    border-top: 1px solid #dddddd;
    /* 空白页 */
    .empty {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        padding-bottom: 100upx;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        background: #fff;
        image {
            width: 240upx;
            height: 160upx;
            margin-bottom: 30upx;
        }
        .empty-tips {
            display: flex;
            font-size: $font-sm + 2upx;
            color: $font-color-disabled;
            .navigator {
                color: $uni-color-primary;
                margin-left: 16upx;
            }
        }
    }
}
/* 购物车列表项 */

.shop-item {
    margin-bottom: 16upx;
    background: #ffffff;
    border-bottom: 1px solid #f5f5f5;
    .shop-title {
        padding: 30upx 20upx 0 20upx !important;
        font-size: 28upx;
    }
}
.cart-item {
    display: flex;
    position: relative;
    padding: 16upx 20upx;
    align-items: center;
    .image-wrapper {
        width: 200upx;
        height: 200upx;
        flex-shrink: 0;
        position: relative;
        image {
            border-radius: 8upx;
        }
        img {
            width: 200upx;
            height: 200upx;
            border-radius: 8upx;
        }
    }
    &.xj {
        color: $border-color-base;
        .image-wrapper {
            position: relative;
            text {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                background: url(../../static/below.png) no-repeat center rgba(0, 0, 0, 0.3);
            }
        }
    }
    .checkbox {
        z-index: 8;
        font-size: 44upx;
        line-height: 1;
        padding: 20upx;
        color: $font-color-disabled;
        background: #fff;
        border-radius: 50px;
    }
    .item-right {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        position: relative;
        padding-left: 30upx;
        .title,
        .price {
            font-size: $font-base + 2upx;
            color: $font-color-dark;
            height: 40upx;
            line-height: 40upx;
        }
        .attr {
            font-size: $font-sm + 2upx;
            color: $font-color-light;
            height: 50upx;
            line-height: 50upx;
        }
        .price {
            height: 50upx;
            line-height: 50upx;
            color: $base-color;
        }
        .tip {
            font-size: 24rpx;
        }
        .edit{
            display: flex;
            align-items: center;
            margin-top: 20rpx;
            .con{
                flex-grow: 1;
                word-break:break-all;
                .oldprice{
                    font-size:24rpx;
                    text-decoration: line-through;
                    color: #969696;
                }
            }
            .step{
                min-width: 100px;
            }
        }
    }
    .del-btn {
        padding: 4upx 10upx;
        font-size: 34upx;
        height: 50upx;
        color: $font-color-light;
    }
}
/* 底部栏 */
.action-section {
    /* #ifdef H5 */
    margin-bottom: 50px;
    /* #endif */
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 95;
    display: flex;
    align-items: center;
    padding: 0 0 0 30upx;
    background: #ffffff;
    border-bottom: 1rpx solid #DDD;
    .checkbox {
        height: 52upx;
        position: relative;
        image {
            width: 52upx;
            height: 100%;
            position: relative;
            z-index: 5;
        }
    }
    .clear-btn {
        position: absolute;
        left: 26upx;
        top: 0;
        z-index: 4;
        width: 0;
        height: 52upx;
        line-height: 52upx;
        font-size: $font-base;
        color: #fff;
        background: $font-color-disabled;
        border-radius: 0 50px 50px 0;
        opacity: 0;
        transition: 0.2s;
        display: none;
        &.show {
            display: block;
            padding-left: 38upx;
            opacity: 1;
            width: 120upx;
        }
    }
    .total-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: right;
        padding-right: 40upx;
        .price {
            font-size: $font-lg;
            color: $font-color-dark;
            text {
                font-size: 24rpx;
            }
        }
        .coupon {
            font-size: $font-sm;
            color: $font-color-light;
            text {
                color: $font-color-dark;
            }
        }
    }
    .confirm-btn {
        padding: 0 38upx;
        margin: 0;
        border-radius: 0;
        height: 90upx;
        line-height: 90upx;
        font-size: $font-base + 2upx;
        background: $uni-color-primary;
    }
}
/* 复选框选中状态 */
.action-section .checkbox.checked,
.cart-item .checkbox.checked {
    color: $uni-color-primary;
}
</style>
