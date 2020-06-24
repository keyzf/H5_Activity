<template>
	<view class="content">
        <empty v-if="dataList.length === 0"></empty>
		<view v-for="(value, index) in dataList">
			<view class="list-cell b-b" @click="classificationparticulars(value.categoryid)">
				<text class="cell-tit">{{value.categoryname}}</text>
				<view class="cell-more yticon icon-you" >{{value.categorytext}}</view>
			</view>
			<view class="list-cell b-b btn">
				<view class="btn" @click = "editType(value.categoryid,index, value.categoryname)">编辑</view>
				<view class="btn" @click = "deleteType(value.categoryid, index)">删除</view>
			</view>
		</view>
		<view class="footer">
			<text class="submit" @click="management('添加')">添加分类</text>
		</view>
        <uni-popup ref="addclassification" type="center">
            <view class="uni-tip">
                <view class="uni-tip-title">{{type}}分类</view>
                <input class="input" type="text" value="" v-model="typeName"  placeholder="请输入分类名称"/>
                <view class="uni-tip-group-button">
                    <view class="uni-tip-button" @click="saveType">确定</view>
                </view>
            </view>
        </uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import empty from "@/components/empty";
export default {
    components: {
        uniPopup,
        empty
    },
	data() {
		return {
			type : "",
			dataList : [],
			typeName : "",
			typeId : 0,
			index : ""
		};
	},
	onLoad(param) {
		this.cguid = uni.getStorageSync("companyguid");
		this.load();
	},
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		load(){
			// 1 有商品信息  0  无商品信息
			let data = {
				cguid : this.cguid, 
				type : 1 
			};
			this.$ajax.get('comcategory/categorylist', data).then(res => {
				if(res.data.code == 0){
					console.log(res.data.result.data)
					this.dataList = res.data.result.data;
				}
			});
		},
        management(type){
			this.type = type;
			//id name 清空
			this.typeName = "";
			this.typeId = 0;
            this.$refs.addclassification.open();
        },
		classificationparticulars(id){
			uni.navigateTo({
				url: '/pages/establishment/classificationparticulars?categoryid=' + id
			});
		},
		deleteType(id, index){
			let data = {
				categoryid : id,
				cguid : this.cguid,
			}
			let _this = this;
			uni.showModal({
			    title: '',
			    content: '确定要删除该分类吗？',
			    success: function (res) {
			        if (res.confirm) {
			            _this.$ajax.get('comcategory/delcategory', data).then(res => {
			            	if(res.data.code == 0){	
			            		_this.$api.msg("删除成功")
			            		_this.dataList.splice(index,1);
			            	}
			            }); 
			        } 
			    }
			});
		},
		editType(id,index, typeName){
			this.management("编辑");
			this.typeName = typeName;
			this.typeId = id;
			this.index = index
		},
		saveType(){
			if(this.check()){
                uni.showLoading({
				    mask : true
			    })
				let data = {
					 categoryname : this.typeName,
					 cguid : this.cguid,
				}
				let addOrEdit = this.typeId > 0; //true 编辑
				if(addOrEdit){
					 data.categoryid = this.typeId;
				}
				this.$ajax.get('comcategory/savecategory', data).then(res => {
                    uni.hideLoading()
					if(res.data.code == 0){
						console.log(res.data.result.data)
						let data_res = res.data.result.data;
						if(addOrEdit){
							this.dataList[this.index].categoryname = this.typeName;
						}else{
							let addType = {
								categoryid: data_res.categoryid,
								categoryname: this.typeName,
								categorytext: "共计0件商品"
							}
							this.dataList.push(addType);
						}
					}
					this.$refs.addclassification.close();
				}); 
			}
		},
		check(){
			let msg = "";
			let mark = true;
			if(mark && this.typeName == ""){
				msg = "请输入分类名称";
				mark = false;
			}
			if(!mark){
				this.$api.msg(msg);
			}
			return mark;
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
/deep/ .uni-popup{
	z-index: 999;
}
/deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box{
    border-radius: 20rpx;
}
.list-cell {
	display: flex;
	align-items: baseline;
	padding: 20upx $page-row-spacing;
	line-height: 60upx;
	position: relative;
	background: #fff;
	justify-content: center;
	&.btn{
		justify-content: flex-end;
		.btn{
			font-size: 24rpx;
			margin-left: 32rpx;
			line-height: 50rpx;
			padding: 0 26rpx;
			border:  1px solid #dddddd;
			border-radius: 40rpx;
		}
	}
	&.log-out-btn {
		margin-top: 40upx;
		.cell-tit {
			color: $uni-color-primary;
			text-align: center;
			margin-right: 0;
		}
	}
	&.cell-hover {
		background: #fafafa;
	}
	&.b-b:after {
		left: 30upx;
	}
	&.m-t {
		margin-top: 16upx;
	}
	.cell-more {
		align-self: baseline;
		font-size: $font-lg;
		color: $font-color-light;
		margin-left: 10upx;
        min-width: 300rpx;
		text-align: right;
	}
	.cell-tit {
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 10upx;
		flex: 1;
	}
	.tximg {
		width: 100rpx;
		height: 100rpx;
		vertical-align: middle;
	}
	.cell-tip {
		font-size: $font-base;
		color: $font-color-light;
	}
	image{
		width: 36rpx;
		height: 36rpx;
	}
}



.uni-tip {
    background: #fff;
    box-sizing: border-box;
}

.uni-tip-title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.input {
    padding: 12rpx;
    font-size: 28rpx;
    color: #666;
    border-bottom: 1px solid #dddddd;
    display: block;
    height: auto;
}

.uni-tip-group-button {
    margin-top: 10px;
}

.uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
}
</style>
