<template>
	<view>
		<view class="footers">
			<view :class="'footer_item ' + (item.size=='big'?'big_item':'')  " :style="'width:'+item_width" @click="change_nav(item.name_code)" v-for="(item,index) in footer_nav" :key="index">
                <text v-if="item.number > 0" class="tipn" :style="{right:wz}">{{item.number}}</text>
				<image :src="index==now_index?item.select_icon:item.icon" mode="aspectFit"></image>
				<view :class="{xz:index==now_index}">{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wz:'0px'
			};
		},
		methods:{
			change_nav(index){
				this.$store.commit("change_page",index)
			}
		},
		computed:{
			item_width(){
                let _this = this;
				let length = this.$store.state.footer_store.footer_nav.length;
				switch (length){
					case 1:
						return '100%'
						break;
					case 2:
						return '50%'
						break;
					case 3:
						return '33.3%'
						break;
					case 4:
                        _this.wz = "50rpx"
						return '25%'
						break;
					case 5:
                        _this.wz = "40rpx"
						return '20%'
						break;
					default:
						break;
				}
			},
			footer_nav(){
				return this.$store.state.footer_store.footer_nav
			},
			now_index(){
                let id;
                this.$store.state.footer_store.footer_nav.forEach((it,index) =>{
                    if(this.$store.state.footer_store.now_page_index == it.name_code){
                        id = index;
                    }
                })
				return id;
			}
		}
	}
</script>

<style lang="scss">
.footers{
	position: fixed;
    z-index: 9;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #FFF;
	border-top: 1rpx solid #DDD;
}
.footer_item{
	float: left;
	width: 33.3%;
	text-align: center;
	font-size: 24upx;
    padding: 8rpx;
    position: relative;
}
.tipn{
    position: absolute;
    top: 6rpx;
    right: 50rpx;
    background: red;
    color: #FFF;
    border-radius: 50%;
    display: inline-block;
    font-size: 24rpx;
    min-width: 32rpx;
    text-align: center;
    line-height: 32rpx;
    z-index: 2;
}
.xz{
    color: $base-color;
}
.footer_item image{
	width: 44upx;
	height: 44upx;
}
.footer_item.big_item{
	position: relative;
	top: -40upx;
}
.footer_item.big_item image{
	width: 100upx;
	height: 100upx;
}
</style>
