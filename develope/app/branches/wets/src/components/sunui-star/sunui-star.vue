<template name="sunui-star">
	<view class="sunui-stars">
		<view class="sunui-m">
			<view class="sunui-stars-items" v-for="(item, index) in maxStar" :key="index" @tap="changeStar" :data-value="index">
				<text class="iconfont" :class="[iconName,curStarNum > index ?'icon-star-hover':'icon-star-nhover']" :style="'font-size:'+starSize+';'"></text>
			</view>
		</view>
		<slot></slot>
	</view>
</template>
<script>
	export default {
		name: "sunui-star",
		props: {
			iconName: {
				type: String,
				default: 'icon-star'
			},
			isTips: {
				type: Boolean,
				default: false
			},
			starSize: {
				type: String,
				default: '1.5em'
			},
			maxStar: {
				type: Number,
				default: 5
			},
			defaultStar: {
				type: Number,
				default: 3
			},
			disabledStar: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				curStarNum: 0
			}
		},
		created() {
			this.curStarNum = this.defaultStar;
		},
		methods: {
			changeStar(e) {
				if (this.disabledStar) {
					return;
				}
				this.curStarNum = Number(e.currentTarget.dataset.value) + 1;
				this.$emit("changeStar", {
					curStar: this.curStarNum
				});
				if (this.isTips) {
					uni.showToast({
						title: `${this.curStarNum}颗`,
						icon: 'none'
					})
				}
			}
		}
	}
</script>
<style>
	@import url("iconfont");

	.icon-star {
		font-size: 1.5em;
	}

	/* 爱心图标经过颜色 */
	.icon-love-nhover {
		color: #ddd;
	}

	/* 爱心图标经过后颜色 */
	.icon-love-hover {
		color: #F00;
	}

	/* star图标前颜色 */
	.icon-star-nhover {
		color: #ddd;
	}

	/* star图标后颜色 */
	.icon-star-hover {
		color: #FFCC00;
	}

	.sunui-m {
		width: 80%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.sunui-stars {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
</style>
