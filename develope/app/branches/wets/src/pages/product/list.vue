<template>
	<view class="content">
		<view class="navbar" :style="{position:headerPosition,top:headerTop}">
			<view class="nav-item" :class="{current: condition === 1}" @click="tabClick(1)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: condition === 2}" @click="tabClick(2)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: condition > 2}" @click="tabClick(3)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: condition === 3}" class="yticon icon-shang"></text>
					<text :class="{active: condition === 4}" class="yticon icon-shang xia"></text>
				</view>
			</view>
		</view>
        <view class="goods-list">
            <view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item.productid)">
                <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
                <view class="image-wrapper">
                    <uimg :src="item.url"></uimg>
                </view>
                <view class="item-con">
                    <view class="title clamp">
                        <text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}
                    </view>
                    <view class="price-box clamp">
                        <text class="price">{{ item.price }}</text>
                        <text v-if="item.newactivitylist.length == 0">{{ item.sales }}</text>
                        <view v-else>
                            <text v-for="ite in item.newactivitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                        </view>
                    </view>
                    <view class="clamp">
                        <view class="typename">
                            <block v-if="item.selficon.url"><image :src="item.selficon.url" mode="aspectFit"></image></block>
                            <block v-else><text>{{ item.typename }}</text></block>
                        </view>
                        <text class="companyname" @click.stop="goshop(item)">{{ item.companyname }}</text>
                    </view>
                </view>
            </view>
        </view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
    import uimg from "@/components/uimg/uimg.vue";
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore,
            uimg
		},
		data() {
			return {
				headerPosition:"fixed",
				headerTop:"0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0, 
				goodsList: [],
                pagesize:12,
                nextCursorMark:'',
                condition:1,
                lastid:'',
                keyword:''
			};
		},
		onBackPress(){
		    this.$api.ovPage()
		},
		onLoad(options){
            let opt = JSON.parse(options.index);
            this.keyword = opt.keyword;
			this.loadData();
            
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom(){
			this.loadData();
		},
		methods: {
            //加载商品 ，带下拉刷新和上滑加载
			async loadData(type='add',loading) {
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				if(type === 'refresh'){
					this.goodsList = [];
                    this.lastid = '';
                    this.nextCursorMark = '';
				}
                let data = {
                    targetids:this.keyword,
                    condition:this.condition,
                    pagesize:this.pagesize,
                    lastid:this.lastid,
                    nextCursorMark:this.nextCursorMark,
                    targettype:2
                }
                this.$ajax.get('search/smartSearch', data).then(res => {
                    if(res.data.code==0){
                        let list = res.data.result.data;
                        //判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
                        this.loadingType  = list.length < this.pagesize ? 'nomore' : 'more';
                        if(list.length>0){
                            this.lastid = list[list.length-1].productid;
                            this.nextCursorMark = list[list.length-1].nextCursorMark;
                            this.goodsList = this.goodsList.concat(list);
                        }
                        // #ifdef H5
                        this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
                        // #endif
                        if(type === 'refresh'){
                        	if(loading == 1){
                        		uni.hideLoading()
                        	}else{
                        		uni.stopPullDownRefresh();
                        	}
                        }
                    }else{
                        
                    }
                });
			},
            navToDetailPage(id) {
                uni.navigateTo({
                    url: '/pages/product/product?productid=' + id
                });
            },
			//筛选点击
			tabClick(index){
				if(this.condition === index && index !== 3){
					return;
				}
				if(index === 3){
					this.condition = this.condition === 3 ? 4: 3;
				}else{
                    this.condition = index;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh',1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			stopPrevent(){},
            goshop(it){
                if(it.isself ==0){
                    uni.navigateTo({
                        url: '/pages/product/shop?cguid=' + it.cguid
                    });
                }else if(it.isself == 1){
                    uni.navigateTo({
                        url: '/pages/product/shopproductlist?cguid=' + it.cguid
                    });
                }
            },
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
	}
	.content{
		padding-top: 96upx;
	}

	.navbar{
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0,0,0,.06);
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}
		.p-box{
			display: flex;
			flex-direction: column;
			.yticon{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;
				&.active{
					color: $base-color;
				}
			}
			.xia{
				transform: scaleY(-1);
			}
		}
		.cate-item{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;
			&:after{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}
.activity {
            text {
                border: 1px solid rgb(238, 77, 63);
                padding: 0 8rpx;
                margin-right: 6rpx;
                display: inline-block;
                border-radius: 10rpx;
                font-size: 24rpx;
                margin-bottom: 4rpx;
            }
        }
</style>
