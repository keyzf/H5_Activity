<template>
	<view class="content">
		<view v-for="(data, index) in datalist" :key="index">
			<view class="skin" v-show="data.type == 0">
				<view class="skintitle">皮肤</view>
				<scroll-view scroll-x="true">
					<view class="skincon">
						<view v-for="(skin, index) in data.skinlist" :key="index" class="skinitem" v-bind:class="{action: skin.ischeck == 1}" @click="chooseSkin(skin)">
							<img :src="skin.iconurl" :alt="skin.skintext" />
							<text class="tip"></text>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="skin" v-show="data.type == 1">
				<view class="skintitle">轮播图设置</view>
				<view class="carousel" v-show="data.picurl">
					<img :src="data.picurl" class="carouselimg" />
				</view>
				<view class="carousel" @click="editSlide()" v-show="!data.picurl">
					<view class="carouselk">
						<img src="../../static/upimg.png" alt="" />
						<view>添加轮播广告</view>
						<view>比例为25:9</view>
					</view>
				</view>
				<view class="movebtn">
					<text class="btn" @click="editSlide()">编辑</text>
					<text class="btn" v-show="index == 2" @click="upMove">上移</text>
					<text class="btn" @click="clearSlide(data)">清空</text>
				</view>
			</view>
			<view class="skin" v-show="data.type == 2">
				<view class="skintitle">两列广告设置</view>
				<view class="biserial" v-show="data.adlist">
					<view v-for="(ad, index) in data.adlist" :key="index" class="biserialitem"><img :src="ad.picurl" class="carouselimg" /></view>
				</view>
				<view class="biserial" v-show="!data.adlist || data.adlist.length == 0">
					<view class="biserialitem" @click="editAd">
						<img src="../../static/upimg.png" alt="" />
						<view>添加广告</view>
						<view>比例为4:3</view>
					</view>
					<view class="biserialitem" @click="editAd">
						<img src="../../static/upimg.png" alt="" />
						<view>添加广告</view>
						<view>比例为4:3</view>
					</view>
				</view>
				<view class="movebtn">
					<text class="btn" @click="editAd">编辑</text>
					<text class="btn" v-show="index == 2" @click="upMove">上移</text>
					<text class="btn" @click="clearAd(data)">清空</text>
				</view>
			</view>
		</view>
		<view class="footer">
			<text class="submit ash" @click="preview">预览</text>
			<text class="submit" @click="submit">应用到店铺</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cguid: 0,
			datalist: [],
			skininfo: {},
			slideIndex: 0,
			adIndex: 0
		};
	},
	onLoad(option){
		this.cguid = option.cguid;
		this.init();
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
	methods: {
		init() {
			this.$ajax.get('decoration/decrationlist', {cguid: this.cguid}).then(res => {
			    this.datalist = res.data.result.data;
				let i = 0;
				this.datalist.forEach(data => {
					if (data.type == 0) {
						this.skininfo = data;
					} else if (data.type == 1) {
						this.slideIndex = i;
					} else {
						this.adIndex = i;
					}
					i++;
				});
			});
		},
		chooseSkin(skin) {
			this.skininfo.skinlist.forEach(skin => {
				skin.ischeck = 0;
			});
			skin.ischeck = 1;
		},
		editSlide() {
			let _this = this;
			//监听编辑页传回参数
			uni.$once('editSlide',function(data){
				_this.datalist[_this.slideIndex] = data;
				_this.$forceUpdate();
			});
			uni.navigateTo({
				url: '/pages/establishment/decorative_slide?data=' + JSON.stringify(this.datalist[this.slideIndex])
			});
		},
		clearSlide(data) {
			data.picurl = undefined;
			data.slidelist = [];
		},
		editAd() {
			let _this = this;
			uni.$once('editAd',function(data){
				_this.datalist[_this.adIndex] = data;
                _this.$forceUpdate();
			});
			uni.navigateTo({
				url: '/pages/establishment/decorative_ad?data=' + JSON.stringify(this.datalist[this.adIndex])
			});
		},
		clearAd(data) {
			data.adlist = [];
		},
		upMove() {
			let up = this.datalist[2];
			this.datalist.pop();
			this.datalist.splice(1, 0, up);
		},
		preview() {
			let decorationinfo = this.buildSubData();
			uni.showLoading();
			this.$ajax.get('decoration/preview', {
				cguid: this.cguid,
				decorationinfo: JSON.stringify(decorationinfo)
			}).then(res => {
				uni.hideLoading();
				uni.navigateTo({
					url: '/pages/establishment/preview'
				});
			});
		},
		submit() {
			let checkId = 0;
			let decorationinfo = this.buildSubData();
            //校验 不能有是null的字段 (原因  提交时是"" 但是接口返回时 变成null了)
            try{
                for (let i = 0; i < decorationinfo.length;i++) {
                     let list_c = [];
                    if(decorationinfo[i].slidelist != undefined){
                        list_c = decorationinfo[i].slidelist
                    }
                    if(decorationinfo[i].adlist != undefined){
                        list_c = decorationinfo[i].adlist;
                    }     
                    for (let i = 0; i< list_c.length; i++) {
                        if(list_c[i].linkid == null ){
                            list_c[i].linkid = "";
                        }
                    }
                }
            }catch(e){
	
            }
			uni.showLoading();
			this.$ajax.get('decoration/submit', {
				cguid: this.cguid,
				decorationinfo: JSON.stringify(decorationinfo)
			}).then(res => {
				uni.hideLoading();
				if (res.data.code == 0) {
					this.$api.msg(`保存成功`);
					setTimeout(()=>{
						uni.navigateBack()
					}, 800)
				} else {
					this.$api.msg(`保存失败`);
				}
			});
		},
		buildSubData() {
			let decorationinfo = [];
			this.skininfo.skinlist.forEach(skin => {
				if (skin.ischeck == 1) {
					decorationinfo.push({"headimgid" : skin.id, "type": 0});
				}
			});
			decorationinfo.push(this.datalist[1]);
			decorationinfo.push(this.datalist[2]);
			return decorationinfo;
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.content {
	border-top: 1px solid #dddddd;
	padding-bottom: 100rpx;
}
.skin {
    padding: 20rpx 30rpx;
    background: #ffffff;
    margin-bottom: 20rpx;
    .skincon {
        display: flex;
        align-items: center;
        .skinitem {
            margin: 16rpx;
            position: relative;
            &.action .tip{
                position: absolute;
                top: 0;
                right: 0;
                width: 40rpx;
                height: 40rpx;
                background: url(../../static/selected.png) no-repeat center;
                background-size: 100% 100%;
                z-index: 1;
            }
            img {
                width: 140rpx;
                height: 140rpx;
            }
        }
    }
    .carousel{
        text-align: center;
        color: #666666;
        font-size: 24rpx;
        border: 1px solid #DDDDDD;
        margin-top: 10rpx;
        border-radius: 20rpx;
        overflow: hidden;
        .carouselk{
            padding: 30rpx;
            background: #f8f8f8;
            border-radius: 20rpx;
            img {
                width: 81rpx;
                height: 81rpx;
            }
        }
        .carouselimg{
            width: 690rpx;
            height: 248.5rpx;
            border-radius: 20rpx;
            float: left;
        }
        
    }
    .biserial{
        display: flex;
        justify-content: space-between;
        .biserialitem{
            width: 340rpx;
            height: 257rpx;
            border: 1px solid #DDDDDD;
            background: #f8f8f8;
            border-radius: 20rpx;
            text-align: center;
            overflow: hidden;
            font-size: 28rpx;
            img{
                margin-top: 70rpx;
                width: 81rpx;
                height: 81rpx;
            }
            .carouselimg{
                margin-top: 0;
                width: 340rpx;
                height: 257rpx;
                border-radius: 20rpx;
                float: left;
            }
        }
    }
    
    .movebtn{
        text-align: right;
        margin-top: 10rpx;
        .btn{
            display: inline;
            padding: 4rpx 26rpx;
            margin:6rpx 0 6rpx 26rpx;
            border: 1px solid #dddddd;
            border-radius: 20rpx;
            font-size: 28rpx;
        }
    }
}

</style>
