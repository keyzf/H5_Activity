<template>
	<view>
		<view class="comment">
			<view v-for="(l, index) in level" :key="index" @click="search(index)" v-bind:class="{x: l.check}">{{l.name}}</view>
		</view>
        <view style="margin-top: 50px;">
		<view class="row comment-item" v-for="(comment, index) in commentList" :key="index">
			<view class="comment-ren-img">
				<image :src="comment.headUrl || '/static/missing-face.png'" mode="" @error="errorImg(index)"></image>
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
                    <view class="title">{{c.type == 0 ? '我的回复:' : ''}}{{c.type == 2 ? c.appendComment : ''}}</view>
                    <text>{{ c.content }}</text>
                    <view v-show="c.piclist && c.piclist.length > 0">
                        <image v-for="(pic, index) in c.piclist" :key="index" :src="pic.url" @click="previewImg(c.piclist, index)"></image>
                    </view>
                </view>
				<view class="comment-ren-gm">{{comment.skutext}}</view>
                
				<view class="comment-ren-gmsj">购买日期: {{comment.buytime}}</view>
				<view class="link" @click="orderdet(comment.ordernum)">点击查看订单详情 <text v-show="comment.isReply == 0" @click.stop="openReply(index)">回复</text></view>
			</view>
		</view>
        </view>
        <uni-load-more :status="loadingType"></uni-load-more>
        <uni-popup ref="replyPopup" type="center">
            <view class="uni-tip">
                <view class="uni-tip-title">回复评论</view>
                <input class="input" type="text" value="" v-model="content" />
                <view class="uni-tip-group-button">
                    <view class="uni-tip-button" @click="reply">确定</view>
                </view>
            </view>
        </uni-popup>
	</view>
</template>
<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import sunuiStar from '@/components/sunui-star/sunui-star.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			sunuiStar,
            uniLoadMore,
            uniPopup
		},
		data() {
			return {
				submitMark: true,
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
				lastid: "",
                commentList: [],
                content: '',
                replyIndex: 0
			};
		},
        onLoad() {
            this.cguid = uni.getStorageSync("companyguid");
            this.list(0);
        },
        onBackPress(){
            this.$api.ovPage()
        },
		//下拉刷新
		onPullDownRefresh() {
			this.lastid = '';
			this.list(0);
		},
        onReachBottom() {
            // 获取优惠券列表
			if (this.loadingType === 'noMore') {
				return;
			}
            let length = this.commentList.length;
            this.lastid = length > 0 ? this.commentList[length - 1].id : 0;
            this.list(1);
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
			errorImg(index){
				this.commentList[index].headUrl = '/static/missing-face.png';
			},
			orderdet(orderNumber){
			    uni.navigateTo({
			        url: '/pages/shoporder/orderdet?ordernumber=' + orderNumber
			    });
			},
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
            list(load_type) {
                let state = 0;
                this.level.forEach(l => {
                    l.check && (state = l.state)
                });
                this.$ajax.get('com/getCommentPage', {cguid: this.cguid, pagesize: this.pagesize, state: state, lastid: this.lastid}).then(res => {
                    console.log(res.data);
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
						if(load_type == 0){
							uni.stopPullDownRefresh();
							this.commentList = data;
						}else if(load_type == 1){
							this.commentList = this.commentList.concat(data);
						}
                        this.loadingType = data.length == this.pagesize ? 'more' : 'noMore'
                    } else {
                        this.$api.msg('系统出错,请稍后再试');
                    }
                });
            },
            openReply(index) {
                this.content = '';
                this.replyIndex = index;
				this.submitMark = true;
                this.$refs.replyPopup.open();
            },
            reply() {
				if(this.content == ""){
					this.$api.msg('说点什么吧');
					return;
				}
				if(!this.submitMark){
					this.$api.msg('请稍后再试');
					return;
				}
				this.submitMark = false;
                this.$ajax.get('com/comment', {cguid: this.cguid, id: this.commentList[this.replyIndex].id, content: this.content}).then(res => {
					this.$refs.replyPopup.close();
                    if (res.data.code == 0) {
                        this.$api.msg('评论成功');
                    } else {
                        this.$api.msg('系统出错,请稍后再试');
                    }
                });
            },
            previewImg(list, index) {
                let urls = [];
                list.forEach(item => {
                    urls.push(item.url);
                });
                uni.previewImage({
                    current: index,
                    urls: urls
                });
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
        top:  40px;
        left: 0;
        right: 0;
		display: flex;
		justify-content: space-around;
		border-top: 1px solid #dddddd;
		padding: 20rpx 30rpx;
        background: #FFF;
        z-index: 3;
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
	/deep/ .uni-popup{
		z-index: 999;
	}
	.row {
		display: flex;
	}
	.comment-item {
	    background: #ffffff;
	    padding: 20rpx 30rpx;
	    border-bottom: 1px solid #dddddd;
	    .comment-ren-img {
	        uni-image {
	            width: 80rpx;
	            height: 80rpx;
	            border-radius: 50%;
	        }
	    }
	    .link {
	        font-size: 28rpx;
	        color: #0081ff;
            text {
                float: right;
                display: inline-block;
                border: 1px solid #dddddd;
                padding: 10rpx 20rpx;
                border-radius: 20rpx;
                margin-top: -30rpx;
                color: #333333;
            }
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
	            color: #dadada;
	        }
	
	        .comment-ren-con {
	            font-size: 26rpx;
	            image {
	                width: 160rpx;
	                height: 160rpx;
                    display: inline-block;
	            }
	            .title {
	                color: $base-color;
	            }
	        }
	
	        .comment-ren-gm,
	        .comment-ren-gmsj {
	            font-size: 24rpx;
	            color: #dadada;
	            text {
	                float: right;
	                display: inline-block;
	                border: 1px solid #dddddd;
	                padding: 10rpx 20rpx;
	                border-radius: 20rpx;
	                margin-top: -30rpx;
	                color: #333333;
	            }
	        }
	    }
	}
    /deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box{
        border-radius: 20rpx;
        text-align: center;
        .uni-tip-title{
            font-size: 28rpx;
        }
        input{
            border-bottom: 1px solid #DDDDDD;
            height: 40rpx;
            margin-top: 20rpx;
        }
        .uni-tip-group-button{
            font-size: 28rpx;
            margin-top: 20rpx;
        }
    }
</style>
