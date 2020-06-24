<template>
	<view>
		<view class="comment">
			<view v-for="(l, index) in level" :key="index" @click="search(index)" v-bind:class="{x: l.check}">{{l.name}}</view>
		</view>
        <view style="margin-top: 50px;">
		<view class="row comment-item" v-for="(comment, index) in commentList" :key="index">
			<view class="comment-ren-img">
				<image :src="comment.headUrl" mode="aspectFill" @error="errorImg(index)"></image>
			</view>
			<view class="comment-nr">
				<view class="row">
					<view class="comment-ren">
						<view class="comment-ren-title">{{comment.name}}</view>
						<view class="comment-ren-number">
							<sunui-star :disabledStar="startrue" :defaultStar="comment.ratingstar" :maxStar="5" :starSize='starConfig.starSize'
							 :isTips="starConfig.isTips" :type="starConfig.type" class='sunui-star'></sunui-star>
						</view>
					</view>
					<view class="comment-ren-time">
						{{comment.createtime}}
					</view>
				</view>
				<view class="comment-ren-con" v-for="(c, cindex) in comment.list" :key="cindex">
                    <view class="title">{{c.type == 0 ? '商家回复' : c.type == 1 ? '' : '追加评价'}}</view>
                    <text>{{c.content}}</text>
                    <view v-show="c.piclist && c.piclist.length > 0">
                        <image :src="pic.url" @click="previewImg(c.piclist, index)" v-for="(pic, index) in c.piclist" :key="index"></image>
                    </view>
				</view>
				<view class="comment-ren-gm">{{comment.skutext}}</view>
				<view class="comment-ren-gmsj">购买日期: {{comment.buytime}} <text v-show="comment.isappended == 0" @click="openReply(comment)">追加评价</text></view>
			</view>
		</view>
        </view>
        <uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>
<script>
	import sunuiStar from '@/components/sunui-star/sunui-star.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			sunuiStar,
            uniLoadMore
		},
		data() {
			return {
                startrue:true,
                cguid: 0,
                pagesize: 10,
				starConfig: {
					defaultStar: 2,
					maxStar: 5,
					starSize: '1.2em',
					isTips: false,
					type: 'love'
				},
                level: [
                    {
                        name: '全部',
                        state: 0,
                        check: true
                    },
                    {
                        name: '好评',
                        state: 1,
                        check: false
                    },
                    {
                        name: '中评',
                        state: 2,
                        check: false
                    },
                    {
                        name: '差评',
                        state: 3,
                        check: false
                    },
                ],
                loadingType: 'more',
                commentList: [],
                id: ''
			};
		},
        onBackPress(){
            this.$api.ovPage()
        },
        onLoad(option) {
            this.id = option.id;
            this.list(0);
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.list(0);
        },
        //加载更多
        onReachBottom() {
            let lastid = this.commentList[this.commentList.length - 1].id;
            this.list(lastid);
        },
		methods: {
            errorImg(index){
            	this.commentList[index].headUrl = '/static/missing-face.png';
            },
            list(lastid) {
                let state = 0;
                this.level.forEach(l => {
                    l.check && (state = l.state)
                });
                this.loadingType = 'loading';
                this.$ajax.get('product/getProductCommentsPage', {pid: this.id, pagesize: this.pagesize, state: state, lid: lastid == 0 ? '' : lastid}).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        this.commentList = lastid == 0 ? data : this.commentList.concat(data);
                        this.loadingType = data.length == this.pagesize ? 'more' : 'noMore';
                    } else {
                        this.$api.msg('系统出错,请稍后再试');
                    }
                    if (lastid == 0) uni.stopPullDownRefresh();
                });
            },
            openReply(comment) {
                let data = {};
                data.ordernum = comment.ordernum;
                data.skuid = comment.skuid;
                data.attributes = comment.attributes;
                data.skutext = comment.skutext;
                data.url = comment.producturl;
                data.state = 0;
                uni.navigateTo({
                    url: '/pages/product/commentfrom?data=' + JSON.stringify(data)
                })
            },
            // 列表切换
            search(index) {
                if (this.level[0].check && index == 0) return;
                let c = this.level[index].check;
                this.level.forEach(l => {
                    l.check = false;
                });
                if (c) {
                    this.level[0].check = true;
                } else {
                    this.level[index].check = true;
                }
                this.commentList = [];
                this.list(0);
            },
            // 刷新列表
            getOrderDetail() {
                this.commentList = [];
                this.list(0);
            },
            // 图片预览
            previewImg(piclist, index) {
                let list = [];
                piclist.forEach(item => {
                    list.push(item.url);
                });
                uni.previewImage({
                    current: index,
                    urls: list
                })
            }
		}
	};
</script>
<style lang="scss" scoped>
	page {
		background: $page-color-base;
	}
	.comment {
		position: fixed;
        top: 40px;
        left: 0;
        right: 0;
        z-index: 33;
		justify-content: space-around;
        display: flex;
		border-top: 1px solid #dddddd;
		border-bottom: 1px solid #dddddd;
		padding: 20rpx 30rpx;
        background: #FFF;
		view {
			border: 1px solid #dddddd;
			padding: 4rpx 26rpx;
			border-radius: 60rpx;
			font-size: 28rpx;
			&.x {
				color: #FA436A;
				border-color: #FA436A;
			}
		}
	}
	.row {
		display: flex;
	}
	.comment-item {
		background: #FFFFFF;
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #dddddd;
		.comment-ren-img {
			uni-image {
				width: 80rpx;
				height: 80rpx;
                border-radius: 50%;
			}
		}
		.link{
			font-size: 28rpx;
			color: #0081FF;
		}
		.comment-nr {
			flex-grow: 1;
				padding-left: 10rpx;
			.comment-ren {
				font-size: 28rpx;
				flex-grow: 1;
				.sunui-stars {
					justify-content: inherit;
					/deep/ .sunui-m {
						justify-content: inherit;
					}
				}
			}

			.comment-ren-time {
				font-size: 24rpx;
				color: #DADADA;
			}

			.comment-ren-con {
				font-size: 26rpx;
                image{
                    width: 160rpx;
                    height: 160rpx;
                }
                .title{
                    color: $base-color;
                }
			}

			.comment-ren-gm,
			.comment-ren-gmsj {
				font-size: 24rpx;
				color: #DADADA;
                text{
                    float: right;
                    display: inline-block;
                    border: 1px solid #DDDDDD;
                    padding: 10rpx 20rpx;
                    border-radius: 20rpx;
                    margin-top: -30rpx;
                    color: #333333;
                }
			}
		}
	}
</style>
