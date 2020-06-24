<template>
  <view class="content">
    <head>
      <meta name="format-detection" content="telephone=no">
    </head>
    <view class="navigateBar" :style="{height:stateBarHeight + 'rpx','background-color': navBarBgColor}">
      <image src="../../static/index/whiteBack.png" mode="aspectFit" @click="back"></image>
      <view class="middle">
        <view class="depBlock" v-if="isFuliPerson && isMultiFuli" @click="togglePopup('top', 'popupDep')">
          <view class="depText">{{chooseDep}}</view>
          <image src="../../static/index/chooseDep.png" mode="widthFix"></image>
        </view>
        <view class="navigateBarTitle" v-if="showNavBarTitle">工会福利</view>
      </view>
      <view class="helpText" @click="clickHelp">选购说明</view>
    </view>

    <!-- 商品类型-固定-View -->
    <!-- <scroll-view v-show="scrollY > goodsPartTopArr[0]-130" id="goodsTypeFix" class="scroll-x-fixed" :style="{'top':stateBarHeight + 18 + 'rpx'}" scroll-x="true" show-scrollbar="false" :scroll-into-view="scrollInto">
			<view class="goodsTypeBlock" v-for="(item,index) in goodsTypeList" :key="item.id" :id="item.id" @click="clickGoodsType(item.id,index)" :style="{'width':goodsTypeList.length < 5 ? '187.5rpx' : '160rpx'}">
				<view class="goodTypeTitle" :class="goodsTypeId==item.id ? 'goodTypeTitle-active' : ''">{{item.title}}</view>
				<view class="goodTypeSubTitle" :class="goodsTypeId==item.id ? 'goodTypeSubTitle-active' : ''">{{item.subtitle}}</view>
			</view>
		</scroll-view> -->

    <!-- 跨福利选单位的下拉框 -->
    <!-- <uni-popup v-if="isFuliPerson && isMultiFuli" ref="showpopupDep" :type="popupType" :topMargin="stateBarHeight + 5 + 'rpx'">
			<view class="chooseDepBlock">
				<view class="depRow" v-for="(item,index) in depList" :key="index" @click="changeDep(item.welfareid,item.welfarename)">
					<view class="depText">{{item.welfarename}}</view>
					<image v-show="welfareid == item.welfareid" src="../../static/index/duiHao.png" mode="widthFix"></image>
				</view>
			</view>
		</uni-popup> -->
    <!-- 跨福利选单位的弹框 -->
    <!-- <uni-popup v-if="isShowCenterDep && isFuliPerson && isMultiFuli" ref="showpopupDepCenter" :type="popupType">
			<view class="chooseDepBlockCenter">
				<view class="chooseDepTitle">请选择您选购的福利</view>
				<view class="depRow" v-for="(item,index) in depList" :key="index" @click="changeDep(item.welfareid,item.welfarename)" :style="{'background':index%2 == 0 ? 'linear-gradient(to right,#EE3847,#FF6401)' : 'linear-gradient(to right,#FFA600,#FFB500)'}">{{item.welfarename}}</view>
			</view>
		</uni-popup> -->

    <!-- 红色背景模块 -->
    <view class="topRed">
      <image class="redBgImage" :src="(slidesData.picList[0] || {})['picurl']" mode="widthFix"></image>

      <!-- 电科图标和家的感觉 -->
      <view class="cetcView" :style="{'padding-top':stateBarHeight + 18 + 'rpx'}">
        <image class="cetcImage" :src="slidesData.text2" mode="widthFix"></image>
        <image class="jiaImage" :src="slidesData.text1" mode="widthFix"></image>
        <image class="textImage" :src="slidesData.text3" mode="widthFix"></image>
      </view>

      <!-- 倒计时模块 -->
      <!-- <view class="daoJiShi" v-if="isFuliPerson">
				<view class="title">{{isStart ? '距选购结束' : '距选购开始'}}</view>
				<block v-if="showTimeDay">
					<view class="timeNum">{{djsDay}}</view>
					<view class="timeMaoHao">:</view>
				</block>
				<view class="timeNum">{{djsHour}}</view>
				<view class="timeMaoHao">:</view>
				<view class="timeNum">{{djsMinutes}}</view>
				<view class="timeMaoHao">:</view>
				<view class="timeNum">{{djsSeconds}}</view>
			</view> -->

      <!-- 祝福语 -->
      <view class="zhuFuText" v-if="isFuliPerson">
        <view class="zhuFuTop">{{slidesData.blessingContent}}</view>
        <view class="zhuFuBottom">----{{slidesData.blessingAuthor}}</view>
      </view>

      <!-- 我的余额 -->
      <view class="moneyBlock">
        <view class="blockLeft">
          <view class="moneyTop">
            <view class="title">{{accountData.moneyTitle}}</view>
            <view class="guoqi" v-if="(accountData.topText || '').length>0">{{accountData.topText}}</view>
          </view>
          <view class="moneyMiddle">
            <view class="middleleft" @click="clickMingXi()">
              <view class="moneyFuHao">{{accountData.moneySymbol}}</view>
              <view class="money">{{accountData.money}}</view>
              <image src="../../static/index/yuERight.png" mode="widthFix"></image>
            </view>
          </view>
          <view class="useText">{{accountData.useText}}</view>
          <view class="moneyBottom">{{accountData.bottomText}}</view>
        </view>
        <view class="blockRight">
          <view class="middleRight" @click="clickDuiHuan()">福利券兑换</view>
        </view>
      </view>

      <!-- 工会当前选购进度 -->
      <!-- <view v-if="isFuliPerson" class="xuanGouJinDu" :style="{'margin-top':stateBarHeight + 30 + 'rpx'}">
				{{slidesData.chooseText}}
				<view class="xuanGouNum">{{slidesData.choosePercent}}</view>
			</view> -->

      <!-- 点赞 -->
      <view class="dianZanBlock" @click="dianZan" :style="{'margin-top':stateBarHeight + 70 + 'rpx'}">
        我的需求
        <!-- <image class="dianZanText" src="../../static/index/gongHuiDianZanText.png" mode="widthFix"></image>
				<view class="dianZanRignt">
					<image class="dianZanPic" src="../../static/index/gongHuiDianZan.png" mode="widthFix"></image>
					<view class="dianZanNum">{{dianZanNum}}</view>
				</view> -->
      </view>
      <!-- <view class="dianZanDongHuaBlock">
				<image class="dianZanAnimate" v-show="dianZanState" :style="{'margin-top':stateBarHeight + 10 + 'rpx'}" src="../../static/index/gongHuiDianZan2.png" mode="widthFix"></image>
			</view> -->
    </view>

    <!-- 福利是否开始 -->
    <block v-if="isStart">
      <!-- 头条 -->
      <view class="touTiao" v-if="isShowTouTiao">
        <image src="../../static/index/touTiao.png" mode="widthFix"></image>
        <view class="touTiaoContent">
          <swiper class="swiper" circular vertical autoplay interval="5000" duration="500">
            <swiper-item v-for="(touTiaoItem,touTiaoIndex) in touTiaoData" :key="touTiaoIndex" @click="clickTouTiao(touTiaoItem.product_id,touTiaoItem.url)">
              <view class="touTiaoSwiperItem">{{touTiaoItem.content}}</view>
            </swiper-item>
          </swiper>
        </view>
      </view>

      <!-- 已选购下单福利 -->
      <view class="hasSelectBlock" v-if="hasSelected">
        <view class="hasSelectTop">
          <view class="haSelectTopTitle">{{hasSelectedData.orderTitle}}</view>
          <view class="hasSelectContent">
            <view class="hasSelectContentLeft">
              <block v-for="(item,index) in hasSelectedData.piclist" :key="index">
                <image :src="item.url" mode="scaleToFill"></image>
              </block>
            </view>
            <view class="chongXuan" @click="chongXuan(hasSelectedData.ordernumber)">重选</view>
          </view>
        </view>
        <view class="hasSelectMiddle">
          <view class="wuLiuTitle">{{hasSelectedData.logisTitle}}</view>
          <view class="wuLiuContent">
            <view class="wuLiuLeft">
              <image src="../../static/index/wuLiu.png" mode="widthFix"></image>
              <view class="wuliuText">
                <view class="wuliuStr">{{((hasSelectedData.logisticsList || [])[0] || {}).logisticsname}}</view>
                <view class="wuliuTime">{{((hasSelectedData.logisticsList || [])[0] || {}).time}}</view>
              </view>
            </view>
            <view class="cuiDan" @click="cuiDan(hasSelectedData.ordernumber)">催单</view>
          </view>
        </view>
        <view class="hasSelectBottom" @click="fanKui(hasSelectedData.ordernumber,hasSelectedData.todozcc)">我要反馈</view>
      </view>

      <!-- 商品类型View -->
      <scroll-view id="goodsType" class="scroll-x positionScrollX" scroll-x="true" show-scrollbar="false"
        :scroll-into-view="scrollInto" :scroll-left="scrollLeft">
        <view class="goodsTypeBlock" v-for="(item,index) in goodsTypeList" :key="item.id" :id="item.id" @click="clickGoodsType(item.id,index)"
          :style="{'width':goodsTypeList.length < 5 ? '187.5rpx' : '160rpx'}">
          <view class="goodTypeTitle" :class="goodsTypeId==item.id ? 'goodTypeTitle-active' : ''">{{item.title}}</view>
          <view class="goodTypeSubTitle" :class="goodsTypeId==item.id ? 'goodTypeSubTitle-active' : ''">{{item.subtitle}}</view>
        </view>
      </scroll-view>

      <!-- 商品模块 4种展示形式 -->
      <swiper :current="tabIndex" class="goodsList" style="flex: 1;" :duration="300" @change="ontabchange">
        <swiper-item class="goodTypeBlock" v-for="(item,index) in goodsList" :key="index">
          <!-- <view ref='goodsTest' id="goodsTest"> -->
          <scroll-view class="scroll-v" v-bind:style="{'height':'calc(100% - 0rpx)'}" enableBackToTop="true" :scroll-y='allowScrollY'
            @scrolltolower="loadMore()">
            <!-- <view class="goodTypeBlock" v-for="(item,index) in goodsList" :key="index"> -->
            <!-- <view class="goodTypeName" v-if="index != 0">
								<image class="goodTyppeLeft" src="../../static/index/goodTypeLeftPic.png" mode="widthFix"></image>
								<view class="goodTypeText">{{item.typeName}}</view>
								<image class="goodTyppeRight" src="../../static/index/goodTypeRightPic.png" mode="widthFix"></image>
							</view> -->
            <block v-if="item.type == 1">
              <view class="singleTaoCan" v-for="(subItem,subIndex) in item.list" :key="subIndex">
                <view class="taoCanTop">
                  <view class="taoCanTopLeft">
                    <view class="taoCanTopTitleBlock">
                      <view class="taoCanTitle">{{subItem.name}}</view>
                      <image class="taoCanDetail" src="../../static/index/taoCanGoodDetail.png" mode="widthFix" @click="togglePopup('center', 'taoCanDetail', subItem)"></image>
                    </view>
                    <view class="taoCanDes">{{subItem.feature_short}}</view>
                  </view>
                  <view class="taoCanTopRight">
                    <view class="taoCanKuCun">库存{{subItem.stock}}件</view>
                    <image class="cartImage" :src="subItem.isSoldout == 1 ? '../../static/index/cartGray.png' : '../../static/index/cart.png'"
                      mode="widthFix" :data-skuid="subItem.skuid" :data-isSoldout="subItem.isSoldout" @click="addToCart"></image>
                  </view>
                </view>
                <view v-if="(subItem.detailList || []).length < 4">
                  <block v-for="(singleGood,singleGoodIndex) in subItem.detailList" :key="singleGoodIndex">
                    <view class="goodBlockTaoCanSingle" @click="clickGoodDetail(singleGood.id)">
                      <image class="taoCanGoodPic" :src="singleGood.picurl" mode="scaleToFill"></image>
                      <view class="taoCanGoodDetail">
                        <view class="taoCanGoodTitle">{{singleGood.name}}</view>
                        <view class="taoCanTeSe">
                          <view class="taoCanTeSeSingle">
                            {{singleGood.feature_short}}
                          </view>
                        </view>
                        <view class="pinPai">{{singleGood.brand}}</view>
                        <view class="guiGe">{{singleGood.attrs}}</view>
                      </view>
                      <image v-if="(singleGood.videourl || '').length > 0" class="taoCanGoodVedio" src="../../static/index/taoCanGoodVedio.png"
                        mode="scaleToFill" @click.prevent="taoCanGoodVedio(singleGood.videourl)"></image>
                    </view>
                  </block>
                </view>
                <view v-else class="goodBlockTaoCanMulti">
                  <view class="taoCanMultiSingleBlock" v-for="(goodPic,goodPicIndex) in subItem.detailList" :key="goodPicIndex">
                    <image class="goodBlockTaoCanMultiPic" :src="goodPic.picurl" mode="scaleToFill" @click="clickGoodDetail(goodPic.id)"></image>
                    <image v-if="(goodPic.videourl || '').length > 0" class="taoCanGoodVedio" src="../../static/index/taoCanGoodVedio.png"
                      mode="scaleToFill" @click.prevent="taoCanGoodVedio(goodPic.videourl)"></image>
                  </view>
                </view>
              </view>
            </block>
            <block v-else-if="item.type == 2">
              <view class="goodBlockRowTwo">
                <view class="singleGood" v-for="(subItem,subIndex) in item.list" :key="subIndex">
                  <image class="goodImage" :src="((subItem.piclist || [])[0] || {}).url" mode="scaleToFill" @click="clickGoodDetail(subItem.productId)"></image>
                  <image class="tuiJian" v-if="subItem.recommendBuy==1" src="../../static/index/goodTuiJian.png" mode="widthFix"></image>
                  <image class="taoCanGoodVedio" v-if="(((subItem.piclist || [])[0] || {}).videourl || '').length > 0"
                    src="../../static/index/taoCanGoodVedio.png" mode="scaleToFill" @click.prevent="taoCanGoodVedio((subItem.piclist || [])[0].videourl)"></image>
                  <view class="goodDes" v-if="(subItem.feature_short || '').length > 0">{{subItem.feature_short}}</view>
                  <text class="goodTitle">{{subItem.name}}</br><text style="color: #FFFFFF;">.</text></text>
                  <view class="priceBlock">
                    <view class="goodPrice">¥ {{subItem.newprice}}</view>
                    <view class="goodOriginPrice">¥{{subItem.oldprice}}</view>
                  </view>
                  <view class="goodBottom">
                    <view class="goodKuCun">库存{{subItem.stock}}件</view>
                    <image class="cartImage" :src="subItem.isSoldout == 1 ? '../../static/index/cartGray.png' : '../../static/index/cart.png'"
                      mode="widthFix" :data-skuid="subItem.skuid" :data-isSoldout="subItem.isSoldout" @click="addToCart"></image>
                  </view>
                </view>
              </view>
            </block>
            <block v-else-if="item.type == 3">
              <view class="goodBlockRwoThree">
                <view class="singleGood" v-for="(subItem,subIndex) in item.list" :key="subIndex" :style="{'margin-right': subIndex%3 != 2 ? '20rpx' : '0'}">
                  <image class="goodImage" :src="((subItem.piclist || [])[0] || {}).url" mode="scaleToFill" @click="clickGoodDetail(subItem.productId)"></image>
                  <image class="tuiJian" v-if="subItem.recommendBuy==1" src="../../static/index/goodTuiJian.png" mode="widthFix"></image>
                  <image class="taoCanGoodVedio" v-if="(((subItem.piclist || [])[0] || {}).videourl || '').length > 0"
                    src="../../static/index/taoCanGoodVedio.png" mode="scaleToFill" @click.prevent="taoCanGoodVedio((subItem.piclist || [])[0].videourl)"></image>
                  <view class="goodDes" v-if="(subItem.feature_short || '').length > 0">{{subItem.feature_short}}</view>
                  <view class="goodTitle">{{subItem.name}}</br><text style="color: #FFFFFF;">.</text></view>
                  <view class="goodKuCun">库存{{subItem.stock}}件</view>
                  <view class="goodBottom">
                    <view class="priceBlock">
                      <view class="goodPrice">¥{{subItem.newprice}}</view>
                      <view class="goodOriginPrice">¥{{subItem.oldprice}}</view>
                    </view>
                    <image class="cartImage" :src="subItem.isSoldout == 1 ? '../../static/index/cartGray.png' : '../../static/index/cart.png'"
                      mode="widthFix" :data-skuid="subItem.skuid" :data-isSoldout="subItem.isSoldout" @click="addToCart"></image>
                  </view>
                </view>
              </view>
            </block>
            <!-- 底部刷新 -->
            <view class="loading-more" v-if="currentList[index].length >= pageLimit" v-on:click="loadMore()">
              <text class="loading-more-text">加载更多商品</text>
            </view>
            <view class="loading-more" v-else-if="goodsList[index].list.length > 7">
              <text class="loading-more-text">没有更多商品了～</text>
            </view>
          </scroll-view>
          <!-- </view> -->
        </swiper-item>
      </swiper>

      <!-- 套餐详情的弹出框 -->
      <uni-popup ref="showtaoCanDetail" :type="popupType" @change="popupTaoCanDetailChange">
        <view class="taoCanDetailPopup">
          <view class="taoCanDetailPopupTitle">{{taoCanDetailData.title}}</view>
          <text class="taoCanDetailPopupContent">{{taoCanDetailData.content}}</text>
          <view class="taoCanDetailPopupTip">{{taoCanDetailData.tip}}</view>
          <view class="taoCanDetailPopupBtn" @click="iKnowTaoCanDetail()">我知道了</view>
        </view>
      </uni-popup>

      <!-- 选购攻略 -->
      <block v-if="showGongLve">
        <drag-button :isDock="true" :existTabBar="true" @btnClick="clickGongLve()" />
      </block>

      <!-- 购物车 -->
      <view class="bottomCart">
        <view class="bottomCartLeft">
          <view class="cartLeft" :class="shoppingCartAnimation? 'shoppingCartAnimations' : ''" @click="togglePopup('bottom', 'cartList')">
            <image src="../../static/index/cartBottom.png" mode="widthFix"></image>
          </view>
          <view class="cartMiddle">
            <view class="priceAndFreight">
              <view class="cartPrice">{{selectedCartData.allprice}}</view>
              <view v-if="isNeedFreight" class="freight">{{selectedCartData.freight}}</view>
            </view>
            <view class="cartRemainMoney">{{selectedCartData.balance}}</view>
          </view>
          <view v-show="chooseGoodNumber > 0" class="goodNum">{{chooseGoodNumber}}</view>
        </view>
        <view class="cartRight" @click="clickToPay()">去结算</view>
      </view>

      <!-- 购物车菜单 -->
      <uni-popup ref="showcartList" :type="popupType" @change="popupCartChange">
        <view class="cartListView" @touchmove.prevent="" @click.prevent="">
          <view class="tipView" v-if="(selectedCartData.freighttips || '').length > 0"><text>{{selectedCartData.freighttips}}</text></view>
          <view class="clearGoodsView" @click="clearCartList()">
            <image src="../../static/index/clearCartList.png" mode="widthFix"></image>
            <view class="clearGoodsText">清空购物车</view>
          </view>
          <scroll-view class="goodsView" scroll-y="true">
            <view class="shopRow" v-for="(shopItem,shopIndex) in selectedCartData.skuinfoList" :key="shopIndex" :style="{'margin-top': shopIndex == 0 ? '-30rpx' : '0'}">
              <view class="shopTitle">
                <view class="shopName">{{shopItem.companyname}}</view>
                <view class="shopTip">{{shopItem.freighttips}}</view>
              </view>
              <view class="goodRow" v-for="(goodItem,goodIndex) in shopItem.skulist" :key="goodIndex">
                <view class="goodLeft">
                  <image class="goodLeftImage" :src="goodItem.url" mode="scaleToFill"></image>
                  <image class="goodLeftSoldOutImage" v-if="goodItem.state == 0" src="../../static/index/soldOut.png"
                    mode="scaleToFill"></image>
                </view>
                <view class="goodMiddle">
                  <view class="goodTitle">
                    <view class="goodTitle">{{goodItem.shortname}}</view>
                    <view class="goodSubTitle">{{goodItem.delivery_tips}}</view>
                  </view>
                  <view class="goodPrice">¥ {{goodItem.newprice}} <text class="goodFreight">{{goodItem.freighttips}}</text></view>
                </view>
                <view class="goodRight">
                  <view class="goodSub" :style="{'color': goodItem.number==0 ? '#b3b3b3' : ''}" @click="goodRowSub(goodItem.skuid,goodItem.number)">-</view>
                  <view class="singleGoodNum" @click="goodRowInput()">{{goodItem.number}}</view>
                  <view class="goodAdd" @click="goodRowAdd(goodItem.skuid)">+</view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </uni-popup>
    </block>
    <block v-else>
      <!-- 未开始的毛玻璃空视图 -->
      <view class="emptyView">
        <image class="emptyImage" :src="expectingData.pic" mode="widthFix"></image>
        <view class="emptyText1"><text>{{expectingData.text}}</text></view>
        <image class="emptyGoodsImage" src="http://highmall.holdsoft.cn/welfare/weiKaiShi.png" mode="widthFix"></image>
      </view>
    </block>

    <!-- 小球动画 -->
    <view :animation="animationY" :style="'position:fixed;z-index: 100;top:' + ballY + 'px;'" v-if="showBall">
      <view class="ball" :animation="animationX" :style="'position:fixed;z-index: 100;left:' + ballX + 'px;'"></view>
    </view>

    <!-- 视频 -->
    <uni-popup ref="showvedioPart" :type="popupType" @change="popupVedioPart">
      <view class="vedioPart">
        <video id="myVideo" :src="vedioUrl" @error="videoErrorCallback" autoplay controls object-fit='fill'></video>
      </view>
      <image class="vedioClose" @click="closeVedio" src="../../static/index/vedioClose.png" mode="widthFix"></image>
    </uni-popup>

    <!-- 临时的底部空白 -->
    <view style="height: 150rpx;"></view>
  </view>
</template>

<script>
  import Vue from 'vue';
  import uniPopup from '@/components/uni-popup/uni-popup.vue'
  import dragButton from "@/components/drag-button/drag-button.vue";
  import API from "@/store/api.js";

  export default {
    components: {
      uniPopup,
      dragButton
    },
    data() {
      return {
        welfareid: '', //福利id
        stateBarHeight: 100, //状态栏和导航栏的总高度
        navBarBgColor: 'rgba(255,255,255,0.0)', //导航栏背景色
        showNavBarTitle: false, //导航栏标题
        isFuliPerson: true, //是不是福利人员
        isMultiFuli: false, //是不是跨单位福利人员
        isShowCenterDep: false, //是否显示选择单位的中间弹窗
        chooseDep: '', //跨福利人选择的单位
        depList: [], //单位展示列表
        showGongLve: false, //抢购攻略显不显示

        slidesData: {
          picList: [{
            picurl: ''
          }]
        }, // 后台返的红色背景总数据
        dianZanNum: 0, //点赞的数量
        dianZanState: false, // 是否点赞
        isStart: true, //福利是否开始
        seconds: 0, //剩余时间戳
        showTimeDay: true, //倒计时显不显示天
        timer: null,
        djsDay: '00',
        djsHour: '00',
        djsMinutes: '00',
        djsSeconds: '00',

        expectingData: {}, //敬请期待数据
        accountData: {}, //余额数据
        touTiaoData: {}, //头条数据
        taoCanDetailData: {}, //套餐详情的数据
        accountFlag: false, //从二级页面回到首页是否能调account接口

        isShowTouTiao: false, //是否显示头条
        hasSelected: false, //是否已经选过福利
        skuinfo: [], //选择商品调shoppingCart的入参
        skuinfoSubmit: [], //选择商品调shoppingCart的入参,成功后的
        chooseGoodNumber: 0, // 底部购物车显示的数量
        isNeedFreight: true, // 底部购物车是否显示运费
        scrollInto: '', //商品tab滑动的标记
        goodsTypeId: '', //商品类型选中对应的id
        tabIndex: 0, //商品类型选中对应的index
        goodsPartTopArr: [], //每个商品模块距离顶部的距离
        scrollLeft: 0, //商品tab的滚动条距离左边的距离
        scrollY: 0, //页面纵向滑动的距离
        goodsTypeList: [], //商品的顶部类型信息 
        goodsList: [], //商品列表
        currentList: [], //当前页商品数量
        goodsLastIdList: [], //商品列表分页id
        canLoad: [], //是否能够加载
        allowScrollY: false, //商品的scrollview是否可以滑动
        pageLimit: 12, //分页数量
        isPullDown: false, //标记是下拉刷新

        showVedio: false, // 显示视频
        vedioUrl: '', // 视频链接

        popupType: '', //弹出框类型
        isShowCartList: false, // 购物车列表是否展开
        isShowTaoCanDetail: false, // 套餐详情是否展开
        selectedCartData: [], //选择商品的购物车数据
        hasSelectedData: {}, // 我的已选购情况

        // 购物车动画　
        shoppingCartAnimation: false, // 购物车动画
        showBall: false, // 小球是否显示
        animationY: '', // 动画Y
        animationX: '', // 动画X
        ballY: '', // 小球当前位置Y
        ballX: '', // 小球当前位置X
        clickShoppingCart: false, //加入购物车，防连击

        // 结算默认参数
        addressid: '',
        openUB: '0'
      }
    },
    onLoad() {
      var that = this;
      if (this.isapp()) {
        that.$util.bridgeAndroidAndIOS(function() {
          that.getWelfareList();
        })
        that.stateBarHeight = that.globaldata.statusBarHeight + 85 || 100;
      } else {
        // 获取用户福利列表
        that.getWelfareList();
      }
    },
    onShow() {
      setTimeout(() => {
        // 初始购物车
        this.initShoppingCart(0)
        if (this.accountFlag) {
          this.account()
        }
      }, 600)
      if (this.isapp()) {
        this.callHandler('CallNative', {
          'key': 'stateBarTextWhite',
          'showstatebar': '0'
        });
      }
    },
    onBackPress() {
      this.$refs['showpopupDep'].close()
      this.$refs['showcartList'].close()
      this.$refs['showtaoCanDetail'].close()
      this.$refs['showpopupDepCenter'].close()
      this.$refs['showvedioPart'].close()
    },
    onPageScroll: function(e) { //nvue暂不支持滚动监听，可用bindingx代替
      // console.log("滚动距离为：" + e.scrollTop);

      // 判断导航栏背景的颜色
      if (e.scrollTop <= 1) {
        this.navBarBgColor = 'rgba(255,49,18,0.0)'
        this.showNavBarTitle = false
      } else if (e.scrollTop >= 100) {
        this.navBarBgColor = 'rgba(255,49,18,1.0)'
        this.showNavBarTitle = true
      } else {
        var tmp = e.scrollTop / 100.0
        this.navBarBgColor = 'rgba(255,49,18,' + tmp + ')'
      }

      // 判断商品类型的选中
      this.scrollY = e.scrollTop;
      for (var i = 0; i < this.goodsPartTopArr.length; i++) {
        // if (i == this.goodsPartTopArr.length-1) {
        // 	this.goodsTypeId = this.goodsTypeList[i].id
        // 	return;
        // }

        // var topHeight = this.goodsPartTopArr[i+1] - 120;
        // if (this.scrollY < topHeight) {
        // 	this.goodsTypeId = this.goodsTypeList[i].id
        // 	return;
        // }
        if (this.scrollY >= this.goodsPartTopArr[0] - 80) {
          this.allowScrollY = true
        } else {
          this.allowScrollY = false
        }
      }
    },
    //下拉刷新
    onPullDownRefresh() {
      this.isPullDown = true
      setTimeout(this.loadTotalData(), 2000);
    },
    methods: {
      //----------------------------- 接口模块 -----------------------------
      // 获取用户福利列表
      getWelfareList() {
        API.getWelfareList({}).then(res => {
          // console.log(res);

          if (res.data.code == 0) {
            var resData = res.data.result.data

            if (resData.isGuest == 1) { //游客福利
              this.isFuliPerson = false
              this.isMultiFuli = false
              Vue.prototype.globaldata['welfareid'] = resData.guestWelfareList[0].welfareid
            } else { //正常福利
              this.isFuliPerson = true
              this.depList = resData.welfareList || []
              if (this.depList.length == 1) {
                this.isMultiFuli = false
                Vue.prototype.globaldata['welfareid'] = this.depList[0].welfareid
                this.chooseDep = this.depList[0].welfarename
              } else if (this.depList.length > 1) {
                this.isMultiFuli = true
                Vue.prototype.globaldata['welfareid'] = this.depList[0].welfareid // 先默认第一个
                this.chooseDep = this.depList[0].welfarename

                // 是否弹出选择单位的中间弹窗 
                this.isShowCenterDep = true
                if (this.isShowCenterDep) {
                  this.togglePopup('center', "popupDepCenter")
                }
              }
            }

            this.welfareid = Vue.prototype.globaldata.welfareid;
            this.loadTotalData()
          } else {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 调接口数据
      loadTotalData() {
        // 楼层
        API.homepage({}).then(res => {
          // console.log(res);		
          // 每次刷新停止计时
          this.timeUp()
          // 停止下拉刷新
          uni.stopPullDownRefresh();

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })

            return
          }

          var data = res.data.result.data || []
          for (var i = 0; i < data.length; i++) {
            var dic = data[i] || {}

            if (dic.flag == 1) {
              if (dic.code == "slides") { //顶部红色
                this.slides()
              } else if (dic.code == "myaccount") { //余额
                this.accountFlag = true
                this.account()
              } else if (dic.code == "headline") { //头条
                this.headline()
              } else if (dic.code == "tabs") { //商品类型
                this.mytabs()
              } else if (dic.code == "myhelp") { //选购攻略或福利说明
                this.showGongLve = true
              } else if (dic.code == "myorder") { //订单及物流
                this.myorder()
              } else if (dic.code == "expecting") { //未开始的敬请期待
                this.expecting()
              }
            }
          }
        }).catch(err => {
          // 停止下拉刷新
          uni.stopPullDownRefresh();
          console.log(err);
        })
      },
      // 红色背景图
      slides() {
        API.slides({}).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })

            return
          }

          this.slidesData = res.data.result.data || {}
          this.dianZanNum = this.slidesData.praiseNumber
          // this.isStart = this.slidesData.chooseState == 1 ? true : false
          //倒计时
          // this.seconds = this.slidesData.seconds
          // var day = Math.floor(this.seconds / (60 * 60 * 24))
          // this.showTimeDay = day < 1 ? false : true

          // this.startData();
        }).catch(err => {
          console.log(err);
        })
      },
      // 余额
      account() {
        API.account({}).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })

            return
          }

          this.accountData = res.data.result.data || {}
        }).catch(err => {
          console.log(err);
        })
      },
      // 头条
      headline() {
        API.headline({}).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })

            return
          }

          this.isShowTouTiao = true
          console.log(res.data.result.data);
          this.touTiaoData = res.data.result.data;
        }).catch(err => {
          console.log(err);
        })
      },
      // 商品tab
      mytabs() {
        API.mytabs({}).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            return
          }

          // 清空
          this.goodsTypeList = []
          this.goodsList = []
          this.goodsLastIdList = []
          this.currentList = []
          this.canLoad = []
          this.tabIndex = 0

          // 初始化数据
          let resData = res.data.result.data
          for (let i = 0; i < resData.length; i++) {
            let dic = resData[i]
            this.goodsTypeList.push({
              title: dic.title,
              subtitle: dic.subtitle,
              id: dic.id,
            })
            this.goodsList.push({
              type: dic.displayType,
              typeName: dic.title,
              list: [], //dic.productList,
            })

            this.goodsLastIdList.push("")
            this.currentList.push([])
            this.canLoad.push(true)
          }
          this.goodsTypeId = this.goodsTypeList[0].id

          // 获取商品列表
          this.productListByTabID(0)

          // 计算商品tab的位置
          this.jiSuanGoodsTopHeight();
        }).catch(err => {
          console.log(err);
        })
      },
      // 根据tabid获取对应的商品列表
      productListByTabID(index) {
        if (!this.canLoad[this.tabIndex]) {
          return;
        }

        API.productListByTabid({
          tabid: this.goodsTypeId || '',
          lid: this.goodsLastIdList[index] || "",
          pagesize: this.pageLimit
        }).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            return
          }

          let resData = res.data.result.data
          this.currentList[this.tabIndex] = resData || [];
          this.goodsList[index].list = (this.goodsList[index].list || []).concat(resData);
          // console.log(this.goodsList);

          // 更新lid
          if (resData.length > 0) {
            this.goodsLastIdList[this.tabIndex] = resData[resData.length - 1].id
          }
          // scrollView上拉不加载标志
          this.canLoad[this.tabIndex] = this.currentList[this.tabIndex].length < this.pageLimit ? false : true;

          // 强制渲染页面
          // this.$forceUpdate();

          // 预加载前后tab页面
          this.shoudPreLoadTab()
        }).catch(err => {
          console.log(err);
        })
      },
      // 判断是否要预加载
      shoudPreLoadTab() {
        if (this.tabIndex <= this.goodsLastIdList.length - 2 && this.goodsLastIdList[this.tabIndex + 1] == '') {
          this.preLoadProductByTabID(this.tabIndex + 1)
        }
        if (this.tabIndex >= 1 && this.goodsLastIdList[this.tabIndex - 1] == '') {
          this.preLoadProductByTabID(this.tabIndex - 1)
        }
      },
      // 预加载商品列表
      preLoadProductByTabID(index) {

        API.productListByTabid({
          tabid: this.goodsTypeList[index].id || '',
          lid: "",
          pagesize: this.pageLimit
        }).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            return
          }

          let resData = res.data.result.data
          this.currentList[index] = resData || [];
          this.goodsList[index].list = (this.goodsList[index].list || []).concat(resData);

          // 更新lid
          if (resData.length > 0) {
            this.goodsLastIdList[index] = resData[resData.length - 1].id
          }
          // scrollView上拉不加载标志
          this.canLoad[index] = this.currentList[index].length < this.pageLimit ? false : true;

          // 强制渲染页面
          // this.$forceUpdate();
        }).catch(err => {
          console.log(err);
        })
      },
      // 已选的订单
      myorder() {
        API.myorder({}).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })

            return
          }

          this.hasSelected = true
          this.hasSelectedData = res.data.result.data
        }).catch(err => {
          console.log(err);
        })
      },
      // 点赞
      praise() {
        API.praise({}).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showToast({
              title: res.data.msg,
              icon: "none"
            })

            return
          }

          this.dianZanNum++
        }).catch(err => {
          console.log(err);
        })
      },
      // 敬请期待
      expecting() {
        API.expecting({}).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })

            return
          }

          this.expectingData = res.data.result.data
        }).catch(err => {
          console.log(err);
        })
      },
      // 重选
      chongXuanAPI(orderNumber) {
        //todozcc
        API.chongXuan({}).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })

            return
          }

          //todozcc

        }).catch(err => {
          console.log(err);
        })
      },
      // 催单
      cuiDanAPI(orderNumber) {
        API.cuiDan({
          ordernumber: orderNumber
        }).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })

            return
          }

          uni.showToast({
            title: res.data.msg + ''
          })
        }).catch(err => {
          console.log(err);
        })
      },
      // 初始计算购物车数据
      initShoppingCart(number, isClear) {
        API.shoppingCart({
          skuinfo: isClear == 1 ? JSON.stringify([]) : JSON.stringify(this.skuinfoSubmit)
        }).then(res => {
          // console.log(res);

          // 解除防连击
          this.clickShoppingCart = false
          // 初始进入页面，或者清空的情况
          if (number == 0) {
            this.$refs['showcartList'].close()
            // this.chooseGoodNumber = 0
          }

          if (res.data.code != 0) {
            this.skuinfo = this.skuinfoSubmit.slice()
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            return
          }

          // 清空购物车的情况
          if (isClear == 1) {
            // 清空购物车操作
            this.skuinfo = []
            this.skuinfoSubmit = []
            this.chooseGoodNumber = 0
          }

          // 更新数据
          this.chooseGoodNumber = this.chooseGoodNumber + number
          this.selectedCartData = res.data.result.data
          this.skuinfoSubmit = this.skuinfo.slice()

          if (this.selectedCartData.skulist.length == 0) {
            this.$refs['showcartList'].close()
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 手动选择商品，计算购物车
      shoppingCart(e) {
        // console.log(this.skuinfo);
        API.shoppingCart({
          skuinfo: JSON.stringify(this.skuinfo)
        }).then(res => {
          // console.log(res);

          // 解除防连击
          this.clickShoppingCart = false
          if (res.data.code != 0) {

            this.skuinfo = this.skuinfoSubmit.slice()
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            return
          }
          // 更新动画。 x, y表示手指点击横纵坐标, 即小球的起始坐标
          let ballX = e.detail.x - 10,
            ballY = e.detail.y - 10;
          this.createAnimation(ballX, ballY);

          // 更新数据
          this.chooseGoodNumber++
          this.selectedCartData = res.data.result.data
          this.skuinfoSubmit = this.skuinfo.slice()
        }).catch(err => {
          console.log(err);
        })
      },
      // 结算接口
      checkOut(orderNumber) {
        API.checkOut({
          skuinfo: JSON.stringify(this.skuinfoSubmit),
          addressid: this.addressid,
          openUB: this.openUB
        }).then(res => {
          // console.log(res);

          if (res.data.code != 0) {
            // 有无货的情况,调购物车菜单
            if (res.data.code == 10040) {
              this.initShoppingCart(0)
            }

            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })

            return
          }
          if(this.isapp()){
            // 可以结算，传给原生参数
            this.callHandler('CallNative', {
            	'key': 'pay',
            	'welfareid': Vue.prototype.globaldata.welfareid,
            	'skuinfo': JSON.stringify(this.skuinfoSubmit),
            	'addressid': this.addressid,
            	'openUB': this.openUB
            });
          }else{
            var url = '/pages/order/welfare_new_order?welfareid=' + Vue.prototype.globaldata.welfareid + '&skuinfo=' + JSON.stringify(this.skuinfoSubmit);
            uni.navigateTo({
            	url: url
            });
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 计算位置
      jiSuanGoodsTopHeight() {
        this.goodsPartTopArr = []
        setTimeout(() => {
          uni.createSelectorQuery().in(this).selectAll('.positionScrollX').boundingClientRect(rects => {
            // console.log(rects);
            for (var i = 0; i < rects.length; i++) {
              var dic = rects[i];
              this.goodsPartTopArr.push(dic.top)
              // console.log(this.goodsPartTopArr);
            }
          }).exec();
        }, 500);
      },
      // ----------------------------- 倒计时模块 -----------------------------
      startData() {
        if (this.seconds <= 0) {
          this.loadTotalData()
          return
        }
        this.countDown()
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds < 0) {
            this.loadTotalData()
            return
          }
          this.countDown()
        }, 1000)
      },
      countDown() {
        let seconds = this.seconds
        let [day, hour, minute, second] = [0, 0, 0, 0]
        if (seconds > 0) {
          day = Math.floor(seconds / (60 * 60 * 24))
          hour = Math.floor(seconds / (60 * 60)) - (day * 24)
          minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
          second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        } else {
          this.timeUp()
        }
        if (day < 10) {
          day = '0' + day
        }
        if (hour < 10) {
          hour = '0' + hour
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        if (second < 10) {
          second = '0' + second
        }
        this.djsDay = day
        this.djsHour = hour
        this.djsMinutes = minute
        this.djsSeconds = second
      },
      timeUp() {
        clearInterval(this.timer)
      },
      //-----------------------------------------------------------------------
      // 页面返回
      back() {
        this.$jump.back();
      },
      // 弹出框模块
      togglePopup(type, open, taoCanItem) {

        switch (type) {
          case 'top':

            break
          case 'bottom':
            if (this.isShowTaoCanDetail) {
              this.$refs['showtaoCanDetail'].close()
              return
            } else if ((this.selectedCartData.skulist || []).length == 0) {
              return
            }

            this.isShowCartList = !this.isShowCartList
            break
          case 'center':
            if (open == 'taoCanDetail' && (taoCanItem || {}) != {}) {
              // console.log(taoCanItem);

              this.taoCanDetailData['title'] = taoCanItem.name + '详情'
              this.taoCanDetailData['tip'] = taoCanItem.tips
              let str = ''
              for (let i = 0; i < taoCanItem.detailList.length; i++) {
                str = str + taoCanItem.detailList[i].name + '*' + taoCanItem.detailList[i].number + '\\n'
              }
              this.taoCanDetailData['content'] = str
            }

            break
        }
        this.popupType = type
        this.$nextTick(() => {
          if (type == 'bottom') {
            if (this.isShowCartList) {
              this.$refs['show' + open].open()
            } else {
              this.$refs['show' + open].close()
            }
          } else {
            this.$refs['show' + open].open()
          }
        })
      },
      cancel(type) {
        this.$refs['show' + type].close()
      },
      // 选择单位
      changeDep(welfareid, welfareaName) {
        this.$refs['showpopupDep'].close()
        this.$refs['showpopupDepCenter'].close()

        if (Vue.prototype.globaldata.welfareid != welfareid) {
          this.chooseDep = welfareaName
          this.welfareid = welfareid
          Vue.prototype.globaldata.welfareid = welfareid

          // 刷新数据
          this.loadTotalData()
        }
      },
      // 选购说明
      clickHelp() {
        if (this.isapp()) {
          this.callHandler('CallNative', {
            'key': 'h5Url',
            'h5Url': this.slidesData.introduce,
            'title': '选购说明',
          });
        } else {
          uni.navigateTo({
            url: '/pages/establishment/strategy?type=h5Url&information_url=' + this.slidesData.introduce
          })
        }

      },
      // 余额明细
      clickMingXi() {
        if (this.isapp()) {
          this.callHandler('CallNative', {
            'key': 'stateBarTextBlack',
            'showstatebar': '1'
          });
        }
        uni.navigateTo({
          url: '../moneyDetail/moneyDetail'
        })
      },
      // 兑换
      clickDuiHuan() {
        if (this.isapp()) {
          this.callHandler('CallNative', {
            'key': 'stateBarTextBlack',
            'showstatebar': '1'
          });
        }
        uni.navigateTo({
          url: '../exchangeCoupon/exchangeCoupon'
        })
      },
      // 点赞
      dianZan() {
        if (this.isapp()) {
          this.callHandler('CallNative', {
            'key': 'jumpbycode',
            'jumpdata': {
              'code': 'WISHLIST'
            }
          });
        }else{
          uni.navigateTo({
            url:'/pages/wishlist/wishlist'
          })
        }
        
        // if (this.dianZanState) {
        // 	return
        // }

        // this.dianZanState = true;
        // setTimeout(() => {
        // 	this.dianZanState = false
        // }, 1000);
        // // 接口
        // this.praise()
      },
      // 点击攻略
      clickGongLve() {
        if (this.isapp()) {
          this.callHandler('CallNative', {
            'key': 'stateBarTextBlack',
            'showstatebar': '1'
          });
        }
        uni.navigateTo({
          url: '../consult/consult'
        })
      },
      // 点击头条
      clickTouTiao(productId, url) {
        if (url.length > 0) {
          if (this.isapp()) {
            this.callHandler('CallNative', {
              'key': 'h5Url',
              'h5Url': url,
              'title': '头条详情',
            });
          } else {
            uni.navigateTo({
              url:'/pages/establishment/help?type=0&title="头条详情"&url='+url
            })
          }
        } else if (productId.length > 0) {
          this.$jump.jumpMethod( productId);
        }
      },
      // 去结算
      clickToPay() {
        if (this.isShowTaoCanDetail) {
          this.$refs['showtaoCanDetail'].close()
          return
        } else if ((this.selectedCartData.skulist || []).length == 0) {
          uni.showModal({
            title: '提示',
            content: '请选择商品后提交',
            showCancel: false
          })
          return
        }
        // 结算接口
        this.checkOut()
      },
      // 购物车列表是否展开
      popupCartChange(res) {
        // console.log(res);
        if (!res.show) {
          this.isShowCartList = false
        }
      },
      popupTaoCanDetailChange(res) {
        // console.log(res);
        this.isShowTaoCanDetail = res.show
      },
      popupVedioPart(res) {
        // console.log(res);
        this.showVedio = res.show
      },
      // 套餐商品的播放视频
      taoCanGoodVedio(vedioUrl) {
        // console.log(vedioUrl);
        this.vedioUrl = vedioUrl
        this.$refs['showvedioPart'].open()
      },
      // 商品详情
      clickGoodDetail(productID) {
        this.$jump.jumpMethod(productID);
      },
      // 套餐详情的我知道了
      iKnowTaoCanDetail() {
        this.$refs['showtaoCanDetail'].close()
      },
      // 重选商品
      chongXuan(orderNumber) {
        uni.showModal({
          title: '提示',
          content: '确认重新选择吗?',
          success: (res) => {
            if (res.confirm) {
              this.chongXuanAPI(orderNumber)
            }
          }
        })
      },
      // 催单
      cuiDan(orderNumber) {
        uni.showModal({
          title: '提示',
          content: '确认催单吗?',
          success: (res) => {
            if (res.confirm) {
              this.cuiDanAPI(orderNumber)
            }
          }
        })
      },
      // 反馈
      fanKui(orderNumber, state) {
        if (this.isapp()) {
          // todozcc
          if (state == 1) {
            this.callHandler('CallNative', {
              'key': 'fuLiFanKui',
              'state': '2', //详情
              'orderNumber': orderNumber,
            });
          } else {
            this.callHandler('CallNative', {
              'key': 'fuLiFanKui',
              'state': '1', //去提交
              'orderNumber': orderNumber,
            });
          }
        } else {

        }
      },
      // 清空购物车
      clearCartList() {
        uni.showModal({
          title: '提示',
          content: '确认清空购物车吗?',
          success: (res) => {
            if (res.confirm) {
              this.initShoppingCart(0, 1)
            }
          }
        })
      },
      // 购物车商品列表的减号
      goodRowSub(skuid, number) {
        // 防连击
        if (this.clickShoppingCart || number == 0) {
          return
        }
        this.clickShoppingCart = true

        for (let i = 0; i < this.skuinfo.length; i++) {
          // let dic = this.skuinfo[i]
          if (this.skuinfo[i].skuid == skuid) {
            if (--this.skuinfo[i].number == 0) {
              this.skuinfo.splice(i, 1)
            }

            this.initShoppingCart(-1)
            break
          }
        }
      },
      // 购物车商品列表的单个商品的数量，不用输入
      goodRowInput() {

      },
      // 购物车商品列表的加号
      goodRowAdd(skuid) {
        // 防连击
        if (this.clickShoppingCart) {
          return
        }
        this.clickShoppingCart = true

        for (let i = 0; i < this.skuinfo.length; i++) {
          // let dic = this.skuinfo[i]
          if (this.skuinfo[i].skuid == skuid) {
            this.skuinfo[i].number++

            this.initShoppingCart(1)
            break
          }
        }
      },
      // 商品列表里的商品的添加购物车
      addToCart(e) {
        let isSoldout = e.currentTarget.dataset.issoldout
        if (isSoldout == 1) {
          return
        }

        // 防连击
        if (this.clickShoppingCart) {
          return
        }
        this.clickShoppingCart = true

        let skuid = e.currentTarget.dataset.skuid
        if (this.skuinfo.length == 0) {
          let dic = {
            skuid: skuid,
            number: 1
          }
          this.skuinfo.push(dic)
        } else {
          let hasSame = false
          for (let i = 0; i < this.skuinfo.length; i++) {
            let dic = this.skuinfo[i];

            if (dic.skuid == skuid) {
              dic.number++
              hasSame = true
              break
            }
          }

          if (!hasSame) {
            let dic = {
              skuid: skuid,
              number: 1
            }
            this.skuinfo.push(dic)
          }
        }

        // 调接口
        this.shoppingCart(e);
      },
      // 创建动画
      createAnimation(ballX, ballY) {
        uni.getSystemInfo({
          success: async (e) => {
            // var bottomX = e.windowWidth; // 结束位置X
            var bottomX = 30; // 结束位置X
            var bottomY = e.windowHeight - 50; // 结束位置Y
            var animationX = this.flyX(bottomX, ballX); // 创建小球水平动画
            var animationY = this.flyY(bottomY, ballY); // 创建小球垂直动画
            this.ballX = ballX; // 小球当前位置X
            this.ballY = ballY; // 小球当前位置Y
            this.showBall = true; // 显示小球

            this.setDelayTime(100).then(() => {
              this.animationX = animationX.export(); // 执行动画X
              this.animationY = animationY.export(); // 执行动画Y
              // 400ms延时, 即小球的抛物线时长
              return this.setDelayTime(400);
            }).then(() => {
              this.animationX = this.flyX(0, 0, 0).export(); // 执行动画X
              this.animationY = this.flyY(0, 0, 0).export(); // 执行动画Y
              this.showBall = false; // 隐藏小球
              this.shoppingCartAnimation = true // 购物车动画
              // 400ms延时, 即小球的抛物线时长
              return this.setDelayTime(400);
            }).then(() => {
              this.shoppingCartAnimation = false // 购物车动画
            })

          }
        })
      },
      // 延迟执行
      setDelayTime(sec) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve()
          }, sec)
        });
      },
      // 水平动画
      flyX(bottomX, ballX, duration) {
        /**
         * bottomX 结束位置
         * ballX 开始位置
         * duration 动画持续时间
         */
        let animation = uni.createAnimation({
          duration: duration || 400,
          timingFunction: 'linear',
        })
        animation.translateX(bottomX - ballX).step(); // 动画效果
        return animation;
      },
      // 垂直动画
      flyY(bottomY, ballY, duration) {
        /**
         * bottomY 结束位置
         * ballY 开始位置
         * duration 动画持续时间
         */
        let animation = uni.createAnimation({
          duration: duration || 400,
          timingFunction: 'ease-in',
        })
        // console.log(bottomY)
        animation.translateY(bottomY - ballY).step(); // 动画效果
        return animation;
      },
      // 播放视频失败
      videoErrorCallback: function(e) {
        uni.showModal({
          title: '提示',
          content: e.target.errMsg + '',
          showCancel: false
        })
      },
      // 关闭视频
      closeVedio() {
        this.$refs['showvedioPart'].close()
      },
      // 切换商品类型
      clickGoodsType(type, index) {
        this.goodsTypeId = type
        this.tabIndex = index;
        this.scrollInto = this.goodsTypeList[index].id + "";
      },
      // 左右滑动切换
      ontabchange(e) {
        let index = e.target.current || e.detail.current;
        this.tabIndex = index;
        this.goodsTypeId = this.goodsTypeList[index].id + ""
        this.switchTab(index);
        // 滚动条跟随滑动
        this.scrollLeft = this.tabIndex * 80 - 160;
      },
      switchTab(index) {
        if (this.goodsList[index].list.length === 0) {
          // 排除下拉刷新的调用接口
          if (!this.isPullDown) {
            this.productListByTabID(index);
          }
          this.isPullDown = false
        } else {
          // 预加载前后tab页面
          this.shoudPreLoadTab()
        }

        if (this.tabIndex === index) {
          return;
        }

        this.scrollInto = this.goodsTypeList[index].id + "";
      },
      loadMore() {
        setTimeout(() => {
          this.productListByTabID(this.tabIndex);
        }, 300)
      },
      isapp() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/holdmall/i) == 'holdmall') {
          return true;
        } else {
          return false;
        }
      }
    }
  }
</script>

<style lang="scss">
  page {
    height: 100%;
    background-color: #f8f4f8;
  }
/deep/.uni-popup{
  z-index: 9;
}
  .content {
    position: relative;
    width: 100%;
    height: 100%;

    // 自定义导航栏
    .navigateBar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      display: flex;
      align-items: flex-end;
      padding-bottom: 20rpx;

      image {
        margin-left: 20rpx;
        padding: 8rpx;
        width: 50rpx;
        height: 50rpx;
      }

      .middle {
        position: relative;
        height: 50rpx;
        width: 70%;
        display: flex;
        align-items: center;
        margin-left: 20rpx;
        justify-content: center;

        .depBlock {
          display: flex;
          align-items: center;
          height: 50rpx;
          border-radius: 25rpx;
          // background:linear-gradient(to right,#FF1D42,#FF340C);
          background-color: #930119;
          padding-left: 20rpx;
          max-width: 90%;

          .depText {
            color: #fff;
            font-size: 28rpx;
            line-height: 50rpx;
            max-width: 88%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          image {
            width: 20rpx;
            max-height: 20rpx;
          }
        }

        .navigateBarTitle {
          font-size: 34rpx;
          color: #FFFFFF;
          padding-left: 10%;
        }
      }

      .helpText {
        width: 20%;
        font-size: 28rpx;
        color: #fff;
        text-align: center;
      }
    }

    // 商品类型View模块
    .scroll-x-fixed {
      position: fixed;
      left: 0;
      right: 0;
      z-index: 1;
      width: 750rpx;
      height: 90rpx;
      padding: 10rpx 0 0;
      white-space: nowrap;
      background-color: #f8f4f8;

      .goodsTypeBlock {
        text-align: center;
        // width: 160rpx;
        display: inline-block;
        flex-wrap: nowrap;

        .goodTypeTitle {
          color: #333333;
          font-size: 28rpx;
          font-weight: bold;
        }

        .goodTypeTitle-active {
          color: #FF1E40;
          font-size: 32rpx;
        }

        .goodTypeSubTitle {
          color: #BDBDBD;
          font-size: 24rpx;
        }

        .goodTypeSubTitle-active {
          color: #FF1E40;
        }
      }
    }

    ::-webkit-scrollbar {
      height: 0;
      width: 0;
      color: transparent;
    }

    // 选单位的下拉框
    .chooseDepBlock {
      background-color: #FF2C1F;
      padding: 30rpx 30rpx 0;

      .depRow {
        display: flex;
        justify-content: space-between;

        .depText {
          color: #fff;
          font-size: 32rpx;
          margin-bottom: 30rpx;
        }

        image {
          width: 40rpx;
          max-height: 40rpx;
        }
      }
    }

    // 选单位的弹出窗
    .chooseDepBlockCenter {
      border-radius: 20rpx;
      background-color: #fff;
      margin: 0 72rpx;
      padding: 50rpx 80rpx;
      text-align: center;

      .chooseDepTitle {
        color: #000000;
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 30rpx;
      }

      .depRow {
        margin-top: 30rpx;
        color: #FFFFFF;
        font-size: 26rpx;
        border-radius: 32rpx;
        padding: 15rpx;
      }
    }

    // 顶部红色背景模块
    .topRed {
      position: relative;
      width: 100%;
      z-index: 1;

      .redBgImage {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: -1;
      }

      .cetcView {
        text-align: center;

        .cetcImage {
          width: 74%;
          max-height: 70rpx;
        }

        .jiaImage {
          margin-top: 10rpx;
          width: 80%;
          max-height: 60rpx;
        }

        .textImage {
          width: 65%;
          max-height: 40rpx;
        }
      }

      // 倒计时
      .daoJiShi {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20rpx 20rpx 30rpx;

        .title {
          color: #FFEA00;
          font-size: 24rpx;
          margin-right: 20rpx;
        }

        .timeNum {
          text-align: center;
          color: #FF2431;
          font-size: 31rpx;
          background-color: #FFCD04;
          border-radius: 6rpx;
          width: 35rpx;
          padding: 5rpx 6rpx;
          font-weight: bold;
        }

        .timeMaoHao {
          color: #FFCD04;
          ;
          margin: 0 10rpx;
          font-weight: bold;
        }
      }

      // 祝福语
      .zhuFuText {
        color: #FFEA00;
        font-size: 20rpx;
        margin: 0 80rpx;

        .zhuFuBottom {
          display: flex;
          justify-content: flex-end;
        }
      }

      // 我的余额模块
      .moneyBlock {
        margin: 30rpx 20rpx 20rpx;
        width: 710rpx;
        height: 200rpx;
        color: #90421C;
        border-radius: 20rpx;
        background: linear-gradient(to top right, #FEE0C6, #FFF8EE);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .blockLeft {
          width: 70%;

          .moneyTop {
            display: flex;
            padding: 20rpx 0rpx 5rpx 20rpx;

            .title {
              height: 35rpx;
              font-size: 30rpx;
              margin-right: 10rpx;
              align-self: flex-end;
            }

            .guoqi {
              font-size: 24rpx;
              color: #fff;
              padding: 3rpx 10rpx;
              border-radius: 10rpx;
              border-bottom-left-radius: 0;
              background: linear-gradient(to right, #F40041, #FB4C2F);
            }
          }

          .moneyMiddle {
            display: flex;
            justify-content: space-between;
            padding: 5rpx 20rpx;

            .middleleft {
              display: flex;
              align-items: flex-end;
              height: 67rpx;

              .moneyFuHao {
                font-size: 36rpx;
                margin-right: 10rpx;
                height: 43rpx;
                margin-bottom:8rpx;
              }

              .money {
                height: 100%;
                font-size: 60rpx;
                margin-right: 10rpx;
              }

              image {
                // align-self: center;
                width: 25rpx;
                max-height: 40rpx;
                margin-bottom: 14rpx;
              }
            }
          }

          .useText {
            margin: -5rpx 20rpx;
            font-size: 24rpx;
          }

          .moneyBottom {
            padding: 10rpx 20rpx;
            font-size: 24rpx;
          }
        }

        .blockRight {
          width: 30%;
          display: flex;
          justify-content: flex-end;

          .middleRight {
            text-align: center;
            margin-right: 30rpx;
            color: #fff;
            font-size: 29rpx;
            border-radius: 32rpx;
            height: 65rpx;
            line-height: 65rpx;
            width: 200rpx;
            background: linear-gradient(to right, #F40041, #FB4C2F);
            ;
          }
        }
      }

      // 选购进度
      .xuanGouJinDu {
        position: absolute;
        top: 0;
        left: 0;
        color: #fff;
        font-size: 20rpx;
        text-align: center;
        word-wrap: wrap;
        width: 20rpx;
        background-color: #930119;
        border-top-right-radius: 10rpx;
        border-bottom-right-radius: 10rpx;
        padding: 10rpx 15rpx;
        line-height: 25rpx;

        .xuanGouNum {
          margin-left: -10rpx;
        }
      }

      // 点赞模块
      .dianZanBlock {
        position: absolute;
        top: 0;
        right: 0;
        width: 130rpx;
        height: 60rpx;
        border-top-left-radius: 30rpx;
        border-bottom-left-radius: 30rpx;
        background: linear-gradient(to right, #FFE57E, #FFD164);
        // display: flex;
        // align-items: center;

        text-align: center;
        font-size: 24rpx;
        color: #ee3847;
        line-height: 60rpx;
        font-weight: 800;

        .dianZanText {
          margin-left: 15rpx;
          width: 53rpx;
          max-height: 60rpx;
        }

        .dianZanRignt {
          width: 70rpx;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          margin-top: 8rpx;

          .dianZanPic {
            width: 33rpx;
            max-height: 40rpx;
          }

          .dianZanNum {
            color: #FF340C;
            font-size: 16rpx;
          }
        }
      }

      .dianZanDongHuaBlock {
        width: 50rpx;
        height: 30rpx;
        position: absolute;
        top: 0;
        right: 0;

        .dianZanAnimate {
          position: absolute;
          top: 0;
          right: 0;
          width: 33rpx;
          height: 29rpx;
          animation: clickDianZan 1s ease-in-out;
          background-size: cover;
        }

        @keyframes clickDianZan {
          0% {
            top: 0px;
            right: 0;
          }

          10% {
            top: -4px;
            right: -1px;
          }

          20% {
            top: -8px;
            right: -2px;
          }

          30% {
            top: -12px;
            right: -3px;
          }

          40% {
            top: -16px;
            // transform: rotate(6deg);
            right: -4px;
          }

          50% {
            top: -20px;
            right: -5px;
            // transform: rotate(12deg);
          }

          60% {
            top: -24px;
            // transform: rotate(6deg);
            right: -4px;
          }

          70% {
            top: -28px;
            // transform: rotate(0deg);
            right: -3px;
          }

          80% {
            top: -32px;
            // transform: rotate(-6deg);
            right: -2px;
          }

          90% {
            top: -36px;
            // transform: rotate(-12deg);
            right: -1px;
          }

          100% {
            top: -40px;
            // transform: rotate(-6deg);
            right: 0px;
          }
        }
      }
    }

    // 头条
    .touTiao {
      margin: 20rpx;
      padding: 0 20rpx;
      border-radius: 20rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      background-color: #fff;

      image {
        width: 64rpx;
        max-height: 60rpx;
        margin-right: 20rpx;
      }

      .touTiaoContent {
        color: #333333;
        font-size: 24rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 90%;

        .swiper {
          height: 50rpx;

          swiper-item {
            .touTiaoSwiperItem {
              line-height: 50rpx;
            }
          }
        }
      }
    }

    //已选购下单福利
    .hasSelectBlock {
      border-radius: 20rpx;
      background-color: #fff;
      margin: 20rpx;
      padding: 20rpx;

      .hasSelectTop {

        .haSelectTopTitle {
          color: #333333;
          font-size: 30rpx;
          font-weight: bold;
        }

        .hasSelectContent {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .hasSelectContentLeft {
            width: 70%;
            white-space: nowrap;
            overflow: auto;
            margin-top: 20rpx;

            image {
              width: 80rpx;
              height: 80rpx;
              margin-right: 20rpx;
            }
          }

          ::-webkit-scrollbar {
            height: 0;
            width: 0;
            color: transparent;
          }

          .chongXuan {
            text-align: center;
            width: 130rpx;
            height: 50rpx;
            line-height: 50rpx;
            color: #595757;
            font-size: 24rpx;
            border-radius: 25rpx;
            border: 0.5px solid #DDDDDD;
          }
        }
      }

      .hasSelectMiddle {
        margin-top: 20rpx;

        .wuLiuTitle {
          color: #333333;
          font-size: 30rpx;
          font-weight: bold;
        }

        .wuLiuContent {
          display: flex;
          margin-top: 20rpx;
          align-items: center;
          justify-content: space-between;

          .wuLiuLeft {
            display: flex;
            align-items: center;
            width: 70%;

            image {
              width: 70rpx;
              height: 70rpx;
            }

            .wuliuText {
              margin-left: 10rpx;
              width: 80%;

              .wuliuStr {
                color: #333333;
                font-size: 28rpx;
              }

              .wuliuTime {
                color: #929292;
                font-size: 24rpx;
              }
            }
          }

          .cuiDan {
            text-align: center;
            width: 130rpx;
            height: 50rpx;
            line-height: 50rpx;
            color: #595757;
            font-size: 24rpx;
            border-radius: 25rpx;
            border: 0.5px solid #DDDDDD;
          }
        }
      }

      .hasSelectBottom {
        color: #333333;
        font-size: 28rpx;
        font-weight: bold;
        text-align: center;
        padding-top: 25rpx;
      }
    }

    // 商品类型View模块
    .scroll-x {
      width: 750rpx;
      margin: 20rpx 0 0;
      height: 90rpx;
      white-space: nowrap;

      .goodsTypeBlock {
        text-align: center;
        // width: 160rpx;
        display: inline-block;
        flex-wrap: nowrap;

        .goodTypeTitle {
          color: #333333;
          font-size: 28rpx;
          font-weight: bold;
        }

        .goodTypeTitle-active {
          color: #FF1E40;
          font-size: 32rpx;
        }

        .goodTypeSubTitle {
          color: #BDBDBD;
          font-size: 24rpx;
        }

        .goodTypeSubTitle-active {
          color: #FF1E40;
        }
      }
    }

    ::-webkit-scrollbar {
      height: 0;
      width: 0;
      color: transparent;
    }

    //商品模块 4种展示形式
    .goodsList {
      margin: 10rpx 20rpx 20rpx;
      height: calc(100% - 400rpx);

      .goodTypeBlock {

        .scroll-v {}

        ::-webkit-scrollbar {
          height: 0;
          width: 0;
          color: transparent;
        }

        .goodTypeName {
          display: flex;
          justify-content: center;
          margin: 10rpx 0 20rpx;
          text-align: center;

          .goodTyppeLeft {
            width: 93rpx;
            height: 45rpx;
          }

          .goodTypeText {
            color: #ee3847;
            font-size: 32rpx;
            font-weight: bold;
            margin: 0 40rpx;
          }

          .goodTyppeRight {
            width: 93rpx;
            height: 45rpx;
          }

          // <image class="goodTyppeLeft" src="../../static/index/goodTypeLeftPic.png" mode="widthFix"></image>
          // <view class="goodTypeText" v-if="index != 0">{{item.typeName}}</view>
          // <image class="goodTyppeRight"
        }

        //套餐模块
        .singleTaoCan {
          background-color: #fff;
          border-radius: 20rpx;
          margin-bottom: 20rpx;
          padding: 10rpx 20rpx;

          .taoCanTop {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 0.5px solid #f5f5f5;
            padding-bottom: 15rpx;
            padding: 10rpx 0 15rpx;

            .taoCanTopLeft {
              max-width: 70%;

              .taoCanTopTitleBlock {
                display: flex;
                align-items: center;

                .taoCanTitle {
                  color: #333333;
                  font-size: 32rpx;
                  font-weight: bold;
                  max-width: 90%;
                }

                .taoCanDetail {
                  width: 28rpx;
                  height: 28rpx;
                  padding: 0 10rpx;
                }
              }

              .taoCanDes {
                color: #929292;
                font-size: 22rpx;
              }
            }

            .taoCanTopRight {
              display: flex;
              align-items: center;

              .taoCanKuCun {
                font-size: 22rpx;
                color: #929292;
              }

              .cartImage {
                width: 50rpx;
                height: 50rpx;
                margin-left: 15rpx;
              }
            }
          }

          //套餐模块:只有一个商品
          .goodBlockTaoCanSingle {
            display: flex;
            align-items: center;
            margin: 15rpx 0;
            position: relative;

            .taoCanGoodPic {
              width: 165rpx;
              height: 165rpx;
              // border: 1px solid #007AFF;
              margin-right: 40rpx;
            }

            .taoCanGoodDetail {
              // background-color: #4CD964;
              width: 430rpx;

              .taoCanGoodTitle {
                color: #333333;
                font-size: 32rpx;
                font-weight: bold;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .taoCanTeSe {
                display: flex;
                margin: 10rpx 0;
                overflow: auto;

                .taoCanTeSeSingle {
                  color: #EE3847;
                  font-size: 20rpx;
                  background-color: #FEEBEB;
                  border-radius: 5rpx;
                  margin-right: 10rpx;
                  padding: 0 10rpx;
                  white-space: nowrap;
                }
              }

              .pinPai {
                color: #929292;
                font-size: 20rpx;
              }

              .guiGe {
                color: #929292;
                font-size: 20rpx;
              }
            }

            .taoCanGoodVedio {
              position: absolute;
              top: 130rpx;
              left: 130rpx;
              width: 26rpx;
              height: 26rpx;

            }
          }

          // 套餐模块：多个商品
          .goodBlockTaoCanMulti {
            display: flex;
            white-space: nowrap;
            overflow: auto;
            margin: 15rpx 0;

            .taoCanMultiSingleBlock {
              position: relative;
              // border: 1px solid #007AFF;
              margin-right: 10rpx;

              .goodBlockTaoCanMultiPic {
                width: 155rpx;
                height: 155rpx;
              }

              .taoCanGoodVedio {
                position: absolute;
                right: 10rpx;
                bottom: 10rpx;

                width: 26rpx;
                height: 26rpx;
              }
            }
          }
        }

        // 商品模块，一行两个
        .goodBlockRowTwo {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          flex-wrap: wrap;

          .singleGood {
            padding-bottom: 10rpx;
            margin-bottom: 20rpx;
            background-color: #fff;
            border-radius: 20rpx;
            overflow: hidden;
            width: 48.5%;
            position: relative;

            .goodImage {
              width: 100%;
              height: 360rpx;
            }

            .goodDes {
              // position: absolute;
              // top: 322rpx;
              // left: 0;
              // right: 0;

              color: #9F8D58;
              font-size: 28rpx;
              background-color: #F0ECE1;
              padding: 0 10rpx;
              height: 40rpx;
              line-height: 40rpx;
              margin-top: -2rpx;

              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .goodTitle {
              color: #333333;
              font-size: 30rpx;
              font-weight: bold;
              // height: 80rpx;
              line-height: 38rpx;
              margin: 8rpx 10rpx 5rpx;
              word-break: break-word; //换行模式
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .priceBlock {
              display: flex;

              .goodPrice {
                color: #EE3847;
                font-size: 30rpx;
                font-weight: bold;
                margin: 0 10rpx;
              }

              .goodOriginPrice {
                text-decoration: line-through;
                color: #929292;
                font-size: 22rpx;
                margin-top: 6rpx;
              }
            }

            .goodBottom {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin: 0 10rpx;

              .goodKuCun {
                color: #929292;
                font-size: 22rpx;
                margin: 0 10rpx 5rpx;
              }

              .cartImage {
                width: 50rpx;
                height: 50rpx;
              }
            }

            .taoCanGoodVedio {
              position: absolute;
              top: 320rpx;
              right: 20rpx;
              width: 30rpx;
              height: 30rpx;
            }

            .tuiJian {
              position: absolute;
              top: 30rpx;
              right: 30rpx;
              width: 140rpx;
              max-height: 100rpx;
            }
          }
        }

        // 商品模块，一行三个
        .goodBlockRwoThree {
          display: flex;
          flex-direction: row;
          // justify-content: space-between;
          flex-wrap: wrap;

          .singleGood {
            padding-bottom: 10rpx;
            margin-bottom: 20rpx;
            background-color: #fff;
            border-radius: 20rpx;
            overflow: hidden;
            width: 31.2%;
            position: relative;

            .goodImage {
              width: 100%;
              height: 210rpx;
              margin-bottom: -10rpx;
            }

            .goodDes {
              // position: absolute;
              // top: 170rpx;
              // left: -2rpx;
              // right: -2rpx;

              color: #9F8D58;
              font-size: 24rpx;
              background-color: #F0ECE1;
              padding: 0 5rpx;
              height: 40rpx;
              line-height: 40rpx;
              margin-top: -2rpx;

              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .goodTitle {
              color: #333333;
              font-size: 24rpx;
              font-weight: bold;
              line-height: 30rpx;
              margin: 10rpx 10rpx 0;

              word-break: break-word; //换行模式
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .goodKuCun {
              color: #929292;
              font-size: 18rpx;
              margin: 0 10rpx -5rpx;
            }

            .goodBottom {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 0 10rpx;
              padding-top: 5rpx;

              .priceBlock {
                display: flex;
                align-items: center;
                width: 75%;
                // overflow: hidden;

                .goodPrice {
                  color: #EE3847;
                  font-size: 24rpx;
                }

                .goodOriginPrice {
                  text-decoration: line-through;
                  color: #929292;
                  font-size: 18rpx;
                  margin-left: 3rpx;
                  margin-top: 2rpx;
                }
              }

              .cartImage {
                margin-right: 3rpx;
                width: 40rpx;
                height: 40rpx;
              }
            }
          }

          .taoCanGoodVedio {
            position: absolute;
            top: 170rpx;
            right: 10rpx;
            width: 26rpx;
            height: 26rpx;
          }

          .tuiJian {
            position: absolute;
            top: 10rpx;
            right: 10rpx;
            width: 90rpx;
            height: 60rpx;
          }
        }

        // 加载更多
        .loading-more {
          align-items: center;
          justify-content: center;
          padding-top: 10px;
          padding-bottom: 10px;
          text-align: center;
        }

        .loading-more-text {
          font-size: 28upx;
          color: #999;
        }
      }
    }

    // 套餐详情弹窗
    .taoCanDetailPopup {
      background-color: #fff;
      margin: 0 73rpx;
      border-radius: 20rpx;
      padding: 52rpx 60rpx 45rpx;
      display: flex;
      flex-direction: column;

      .taoCanDetailPopupTitle {
        text-align: center;
        color: #000000;
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 30rpx;
      }

      .taoCanDetailPopupContent {
        color: #787878;
        font-size: 26rpx;
      }

      .taoCanDetailPopupTip {
        color: #EE3847;
        font-size: 26rpx;
        margin: 30rpx 0 40rpx;
      }

      .taoCanDetailPopupBtn {
        text-align: center;
        width: 312rpx;
        height: 64rpx;
        line-height: 64rpx;
        border-radius: 32rpx;
        color: #FFFFFF;
        font-size: 26rpx;
        align-self: center;
        background: linear-gradient(to right, #EE3847, #FF6401);
      }
    }

    // 购物车
    .bottomCart {
      position: fixed;
      bottom: 40rpx;
      left: 30rpx;
      right: 30rpx;
      height: 90rpx;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // background-color: rgba($color: #ffffff, $alpha: 0.0);
      background-color: #555555;
      border-radius: 45rpx;

      .bottomCartLeft {
        display: flex;
        align-items: center;
        position: relative;

        .goodNum {
          position: absolute;
          left: 65rpx;
          top: -5rpx;
          z-index: 1;
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          line-height: 30rpx;
          text-align: center;
          background: linear-gradient(to right, #D96D03, #EE3847);
          color: #FFFFFF;
          font-size: 24rpx;
        }

        .cartLeft {
          z-index: 1;
          position: relative;
          border-radius: 45rpx;
          width: 90rpx;
          height: 90rpx;
          background-color: #222;
          display: flex;
          justify-content: center;
          align-items: center;

          image {
            width: 50rpx;
          }
        }

        /* 购物车动画 */
        .shoppingCartAnimations {
          animation: shoppingCartAnimation 1s;
        }

        @keyframes shoppingCartAnimation {
          0% {
            opacity: 0;
            transform: scale3d(.3, .3, .3)
          }

          20% {
            transform: scale3d(1.1, 1.1, 1.1)
          }

          40% {
            transform: scale3d(.9, .9, .9)
          }

          60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03)
          }

          80% {
            transform: scale3d(.97, .97, .97)
          }

          to {
            opacity: 1;
            transform: scaleX(1)
          }
        }

        .cartMiddle {
          margin-left: 15rpx;

          .priceAndFreight {
            display: flex;
            align-items: flex-end;

            .cartPrice {
              font-size: 32rpx;
              color: #fff;
            }

            .freight {
              font-size: 20rpx;
              color: #fff;
              margin-left: 10rpx;
              padding-bottom: 5rpx;
            }
          }

          .cartRemainMoney {
            font-size: 20rpx;
            color: #fff;
          }
        }
      }

      .cartRight {
        color: #fff;
        font-size: 28rpx;
        width: 180rpx;
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
        background: linear-gradient(to right, #D96D03, #EE3847);
        border-top-right-radius: 45rpx;
        border-bottom-right-radius: 45rpx;
      }
    }

    // 购物车的小球
    .ball {
      height: 40rpx;
      width: 40rpx;
      background: #ee3847;
      border-radius: 50%;
      position: fixed;
    }

    // 购物车菜单
    .cartListView {
      background-color: #FFFFFF;
      padding-bottom: 150rpx;
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;

      .tipView {
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        background-color: #FEEBEB;
        color: #EE3847;
        font-size: 24rpx;
        text-align: center;
        padding: 20rpx;
      }

      .clearGoodsView {
        height: 64rpx;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        image {
          width: 22rpx;
          max-height: 30rpx;
        }

        .clearGoodsText {
          font-size: 26rpx;
          color: #656565;
          margin-left:10rpx;
        }
      }

      .goodsView {
        margin: 0 30rpx;
        max-height: 750rpx; //先这么设置吧

        .shopRow {

          .shopTitle {
            margin: 30rpx 0;
            font-weight: bold;
            display: flex;
            align-items: center;

            .shopName {
              color: #141414;
              font-size: 26rpx;
              max-width: 70%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .shopTip {
              color: #929292;
              font-size: 20rpx;
              margin-left: 20rpx;
            }
          }

          .goodRow {
            display: flex;
            height: 130rpx;
            margin-bottom: 30rpx;

            .goodLeft {
              width: 130rpx;
              height: 130rpx;
              position: relative;

              .goodLeftImage {
                width: 100%;
                height: 100%;
              }

              .goodLeftSoldOutImage {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }
            }

            .goodMiddle {
              width: 340rpx;
              padding: 0 20rpx;
              display: flex;
              flex-direction: column;
              justify-content: space-between;

              .goodTitle {

                .goodTitle {
                  color: #000000;
                  font-weight: bold;
                  font-size: 30rpx;
                  line-height: 38rpx;

                  word-break: break-word; //换行模式
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }

                .goodSubTitle {
                  color: #EE3847;
                  font-size: 24rpx;

                  word-break: break-word; //换行模式
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
              }

              .goodPrice {
                color: #EE3847;
                font-size: 28rpx;

                .goodFreight {
                  font-size: 20rpx;
                }
              }
            }

            .goodRight {
              width: 210rpx;
              display: flex;
              align-items: center;
              justify-content: space-between;
              align-self: flex-end;

              .goodSub {
                text-align: center;
                width: 70rpx;
                height: 40rpx;
                line-height: 40rpx;
                padding-bottom: 3rpx;
                color: #333333;
                font-size: 40rpx;
              }

              .singleGoodNum {
                width: 70rpx;
                height: 36rpx;
                line-height: 36rpx;
                color: #333333;
                font-size: 24rpx;
                background-color: #F5F5F5;
                text-align: center;
              }

              .goodAdd {
                text-align: center;
                width: 70rpx;
                height: 40rpx;
                line-height: 40rpx;
                // background-color: #007AFF;
              }
            }
          }
        }
      }
    }

    // 未开始的毛玻璃空视图
    .emptyView {
      z-index: 1;
      position: relative;
      text-align: center;

      .emptyImage {
        margin-top: 130rpx;
        width: 295rpx;
      }

      .emptyText1 {
        font-size: 24rpx;
        color: #595757;
      }

      .emptyGoodsImage {
        position: absolute;
        left: 0;
        top: 0;
        width: 750rpx;
        z-index: -1;
      }
    }

    .vedioPart {
      position: fixed;
      left: 0;
      top: 300rpx;
      width: 750rpx;
      height: 300rpx;
      z-index: 99999;
      text-align: center;
    }

    .vedioClose {
      position: fixed;
      top: 900rpx;
      left: 350rpx;
      width: 50rpx;
      max-height: 60rpx;
      z-index: 99999;
    }
  }
</style>
