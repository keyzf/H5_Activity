<template>
    <view class="content">
        <view class="addcon">
            <view class="addconlist">
                <view v-for="(info_value, index) in imgTextList">
                    <view class="addconitem" v-if="info_value.type == 2">
                        <!-- url前面添加 uuid 区分链接 和内容 -->
                        <view class="subject">
                            <image :src="info_value.value" mode=""></image>
                        </view>
                        <view class="operation">
                            <text @click="delete_info(index)">删除</text>
                            <text @click="move_up(index)">上移</text>
                            <text @click="addInfo(index)">添加</text>
                        </view>
                    </view>
                    <view class="addconitem" v-else>
                        <view class="subject">
                            <textarea placeholder="请输入" v-model="imgTextList[index].value" />
                            </view>
						<view class="operation">
							<text @click="delete_info(index)">删除</text>
							<text @click="move_up(index)">上移</text>
							<text @click="addInfo(index)">添加</text>
						</view>
					</view>
				</view>
				
			</view>
			<view class="addproductcon" @click="addInfo()">添加内容</view>
		</view>
		<view class="footer">
			<text class="submit ash" @click="onConfirm">上一步</text>
			<text class="submit" @click="addtype">完成</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imgTextList : [
				
		
			]
		};
	},
	onLoad(param) {
		this.isSave = param.isSave;
		this.imgTextList_str = param.imgTextList_str;
        this.pid = param.pid;
        this.cguid =  uni.getStorageSync("companyguid");
		if(this.imgTextList_str != undefined && this.imgTextList_str.length > 0){
			this.imgTextList = JSON.parse(this.imgTextList_str)
		}
	},
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		//下一步
		addtype() {
            uni.showLoading({
			mask : true
		}); 
			let imgTextList_str = JSON.stringify(this.imgTextList);
			if(this.isSave != undefined && this.isSave == "noSave"){
				this.$api.prePage().imgTextList_str = imgTextList_str;
				uni.navigateBack();
				return;
			}
			let data ={
				cguid : this.cguid,
				pid : this.pid,
				detail : imgTextList_str
			}
			this.$ajax.get('shopproduct/addShopProductStep4', data).then(res => {
                uni.hideLoading();
				console.log(res)
				if(res.data.code == 0){
					uni.navigateTo({
						url: '/pages/establishment/establishment?cguid=' + this.cguid
					});
				}else{
                    this.$api.msg("保存失败!")
                }
			});
		},  
		addInfo(index) {
			let this_page = this;
            uni.showActionSheet({
                itemList: ['文字','图片'],
                success: function(res) {
					console.log('选中了第' + (res.tapIndex) + '个按钮');
					if(index == undefined){//代表是插入
						index = this_page.imgTextList.length
					}
					//图片
					if(res.tapIndex == 1){
                        this_page.add_img(index);		
					}else{
					//文字
					let json_info = {
						id : "",
						type : res.tapIndex + 1 ,//文字
						value : ""
					}
						this_page.imgTextList.splice(index,0,json_info)
					}	      
                }
            });
        },
        add_img(index){
            let page_this = this;
            //TODO 循环上传多个
            uni.chooseImage({
                count: 9,
                sizeType: ['original', 'compressed'],
                sourceType: ['album'],
                success: function (res) {
                    console.log(res)   
                    page_this.$uploadImg.uploadimg(res.tempFilePaths[0]).then(img_url_res => {  
                        let json_info = {
                            id : "",
                            type : 2 ,//图片
                            value : img_url_res
                         }
                         page_this.imgTextList.splice(index,0,json_info)
                    }).catch(errorres =>{ 
                        console.log(errorres);
                    });
                        
                        
                }
            });
        },
		delete_info(index){
			this.imgTextList.splice(index, 1)
		},
		move_up(index){
			if(index!=0){
        		this.imgTextList[index] = this.imgTextList.splice(index-1, 1, this.imgTextList[index])[0];
    		}else{
        		this.imgTextList.push(this.imgTextList.shift());
    		}
		},
		onConfirm(){
			uni.navigateBack();
		},
      
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
.addcon {
	background: #ffffff;
	padding:20rpx 30rpx;
	.addconitem{
		position: relative;
		margin-bottom: 20rpx;
		.subject{
			overflow: hidden;
			image{
				width: 690rpx;
				float: left;
			}
			textarea{
				width: 690rpx;
				height: 100rpx;
				border: 1px solid #dddddd;
				border-radius: 6rpx;
				padding: 10rpx;
			}
		}
		
		.operation{
			position: absolute;
			right: 0;
			bottom: 8rpx;
			font-size: 24rpx;
			border-top: 1px solid #dddddd;
			text{
				border-left: 1px solid #dddddd;
				padding: 8rpx 18rpx;
				background: #f6f6f6;
			}
		}
	}
	.addproductcon {
		margin-top: 20rpx;
		border: 1px solid $base-color;
		color: $base-color;
		border-radius: 10rpx;
		text-align: center;
		font-size: 32rpx;
		padding: 16rpx;
	}
}
</style>
