<!-- 福利咨询 -->
<template>
	<view class="all">
		<view class="line"></view>
		
		<view class="linetitle">
			<view class="textline"></view>
			<view class="titletext">我们的优势</view>
			<view class="textline"></view>
		</view>
		
		<view class="advantage" v-for="(item,index) in advantage" :key="index">
			<view class="icon" > <image :src="item.icon"></image></view>
			<view class="title">{{item.title}}</view>
			<view class="content">{{item.content}}</view>
		</view>
		
		<view class="linetitle">
			<view class="textline"></view>
			<view class="titletext">合作伙伴</view>
			<view class="textline"></view>
		</view>
		
		<view class="partner">
			<view class="partitem"  v-for="(item,index) in partner" :key="index">
				<view class="partnericon"><image :src="item.icon"></image></view>
			</view>
		</view>
		
		<view class="linetitle">
			<view class="textline"></view>
			<view class="titletext">我们的客户</view>
			<view class="textline"></view>
		</view>
		
		<view class="client">
			<view class="clientitem"  v-for="(item,index) in client" :key="index">
				<view class="clienticon"><image :src="item.icon"></image></view>
				<view class="clientcontent">{{item.content}}</view>
			</view>
		</view>
		
		<view class="connection">
		<view class="connectionbt" @click="call('031187091225')">企业定制专线 0311-87091227</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				advantage:[
					{
						icon:'../../static/moneydetail/tuikuan.png',
						title:'技术优势',
						content:'一流的技术团队牛逼的不行非常66666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666我的端口费几十块的阿双方均看书'
					},
					{
						icon:'../../static/moneydetail/tuikuan.png',
						title:'技术优势',
						content:'一流的技术团队'
					},
					{
						icon:'../../static/moneydetail/tuikuan.png',
						title:'技术优势',
						content:'一流的技术团队'
					},
					{
						icon:'../../static/moneydetail/tuikuan.png',
						title:'技术优势',
						content:'一流的技术团队'
					},
				],
				partner:[
					{
						icon:'../../static/moneydetail/tuikuan.png'
					},
					{
						icon:'../../static/moneydetail/tuikuan.png'
					},
					{
						icon:'../../static/moneydetail/tuikuan.png'
					},
					
				],
				client:[
					{
						icon:'../../static/moneydetail/tuikuan.png',
						content:'包含中国电子科技集团公司总部，第十三研究所 五十四研究所，二十九所，重庆声光电，海康威视'
					},
					{
						icon:'../../static/moneydetail/tuikuan.png',
						content:'包含中国电子科技集团公司总部，第十三研究所 五十四研究所，二十九所，重庆声光电，海康威视'
					}
				]
				
			}
		},
		methods: {
			
			call(phone){
				uni.makePhoneCall({
				    phoneNumber: phone //仅为示例
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
		width: 100%;
		background-color: #f5f5f5;
	}
	
	.all{
		background-color: #FFFFFF;
		
		.line{
			height: 15rpx;
			background-color: #f5f5f5;
		}
		
		.linetitle{
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin: 30rpx 10rpx;
			
			.textline{
				background-color: #333333;
				width: 35%;
				height: 0.5rpx;
				opacity: .5;
			}
			
			.titletext{
				font-size: 16rpx;
				color: #333333;
				font-weight: bold;
				margin: 5rpx 10rpx;
				
			}
		}
		.advantage{
			padding: 10rpx 40rpx;
			display: flex;
			flex-direction: row;
			justify-content: start;
			align-items: center;
			
			.icon image{
				width: 70rpx;
				height: 70rpx;
			}
			
			.title {
				width: 120rpx;
				font-size: 12rpx;
				color: #333333;
				margin: 0 20rpx;
				font-weight: bold;
			}
			
			.content {
				width: 440rpx;
				font-size: 12rpx;
				color: #929292;
				margin: 0 20rpx;
				/** 对象作为伸缩盒子模型显示 **/
				display: -webkit-box;
				-webkit-line-clamp: 3;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
			}
			
		}
		
		/* 合作伙伴 */
		.partner {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap:wrap;
			padding: 30rpx 30rpx; 
			background: #fff;
			
			.partitem {
				width: 23%;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 0 5rpx;
				
				/* 原图标颜色太深,不想改图了,所以加了透明度 */
				image {
					width: 148rpx;
					height: 88rpx;
					margin-bottom: 14rpx;
					border-radius: 50%;
				}
			}
			
		}
		
		.client{
			// display: flex;
			// flex-direction: column;
			
			.clientitem{
				padding: 0 40rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding-bottom: 20rpx;
				
				.clienticon image{
					width: 148rpx;
					height: 88rpx;
				}
				
				.clientcontent{
					font-size: 14rpx;
					color: #333333;
					align-items: center;
					text-align: center;
					
				}
			}
			
		}
		
		.connection{
			
			display: flex;
			justify-content: center;
			background: #FFFFFF;
			padding: 10rpx 0 50rpx;
			
			.connectionbt{
				
				width: 70%;
				height: 70rpx;
				font-size: 12rpx;
				color: #FFFFFF;
				border-radius: 70rpx;
				text-align: center;
				line-height: 70rpx;
				background: linear-gradient(to right,#FF1D42,#FF330F);
			}
			
		}
		
	}

</style>
