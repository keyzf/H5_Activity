<template>
	<view class="content">
		<view class="list-cell b-b" @click="addtype">
			<text class="cell-tit">类目</text>
			<view class="cell-more yticon icon-you" >{{typeName}}</view>
		</view>
		<view v-for=" (arrrValue,attrKey) in attr_use">
			<view class="typecon">
				<view class="typedel" @click="delete_specs(attrKey)"><image src="../../static/timedel.png" mode=""></image></view>
				<view class="typeopt">
					<view v-for=" (value,key) in arrrValue.property">
						<view class="typelist" >
							<view class="typetitle">{{value.key}}</view>
							<input class="typeinput" v-model="attr_use[attrKey].property[key].value" type="text" value="" :placeholder="'请输入' + value.key"/>
						</view>
					</view>
		
					<view class="typelist">
						<view class="typetitle">价格</view>
						<input class="typeinput" v-model="attr_use[attrKey].price" type="number" value="" placeholder="给商品定个好价格" />
						<view class="typetip">元</view>
					</view>
					<view class="typelist">
						<view class="typetitle">库存</view>
						<input class="typeinput" v-model="attr_use[attrKey].stock" type="number" value="" placeholder="设置合理库存避免超卖" />
						<view class="typetip">件</view>
					</view>
				</view>
			</view>
		</view>
		<view class="addcategory">
            <view class="categoryitem" @click="add_specs">
            	<image src="../../static/timeadd.png" mode="aspectFit"></image>
            	<text>添加商品规格</text>
            </view>
			<view class="categoryitem" @click="copy_specs">
				<image src="../../static/copy.png" mode="aspectFit"></image>
				<text>复制上一个规格</text>
			</view>
		</view>
		<view class="list-cell b-b" @click="classification">
			<text class="cell-tit">分类</text>
			<input type>
			<view class="cell-more yticon icon-you">{{checkbox_text}}</view>
		</view>
	
		<view class="list-cell b-b" @click="mail">
			<text class="cell-tit">邮寄方式</text>
			<view class="cell-more yticon icon-you">{{addrbtu_text}}</view>
		</view>
		<uni-popup ref="classification" type="bottom">
		    <view class="mask" @touchmove.stop.prevent="moveHandle"></view>
		    <view class="">
		        <view class="btns">
		            <text class="btnsitem" @click="classification_close">取消</text>
		            <text class="btnsitem action" @click="gbclassification">确定</text>
		        </view>
		        <view class="uni-list">
		            <checkbox-group @change="checkboxChange">
		                <label class="uni-list-cell" v-for="item in items">
		                    <view><checkbox :value="item.categoryid + ''" :checked="item.checked" /></view>
		                    <view>{{ item.categoryname }}</view>
		                </label>
		            </checkbox-group> 
		        </view>
                <view @click="management()" class="addclassification">
                    <image src="../../static/add.png" mode="aspectFit"></image>
                    <text>添加分类</text>
                </view>
		    </view>
           
		</uni-popup>
        <!-- 添加分类 -->
        <uni-popup ref="addclassification" type="center">
            <view class="uni-tip">           
                <input class="input" type="text" value="" v-model="class_typeName"  placeholder="请输入分类名称"/>
                <view class="uni-tip-group-button">
                    <view class="uni-tip-button" @click="saveType">确定</view>
                </view>
            </view>
        </uni-popup>
		<view class="typelist" v-show="freightShow">
			<view class="typetitle">运费</view>
			<input class="typeinput" type="text" v-model="freight" value="" />
			<view class="typetip">元</view>
		</view>
        <view class="list-cell b-b">
            <text class="cell-tit cw">是否支持7天无理由退货</text>
            <view class="cell-more"><switch checked  @change="switch1Change" /></view>
        </view>
		<view class="footer">
			<text class="submit ash" @click="onConfirm">上一步</text>
			<text class="submit" @click="nextstep">下一步</text>
		</view>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
	    uniPopup
	},
	data() {
		return {
            sevenRefund : 1, //7天无理由
            class_typeName : "",
            freightShow : false,
			typeId : "",
			typeName : "",
			categorylist : [],
			attr_use : [{
				price : "",
				id : "",
				stock : "",
				property : [
				]
			}],
			attr_tmp:[{
				price : "",
				id : "",
				stock : "",
				property : [
				]
			}],
			attr_add:[{
				price : "",
				id : "",
				stock : "",
				property : [
				]
			}],
			items: [],
			isCustomAddress : -1, //自提 0 还是 邮寄1 都支持 2
			checkbox_vals : [], //分类多选框 选中的列表
			checkbox_text : "请选择", //分类 显示字符串
			addrbtu_text : "请选择邮寄方式",
			addrButList : ['自提', '邮寄', '邮寄或自提'],
			freight : ""
			
		};
	},
	onLoad(param) {
        this.cguid = uni.getStorageSync("companyguid");
		this.pname = param.pname
		this.pid = param.pid
		//查询分类列表
		this.categorylist_m();
	},
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
         switch1Change: function (e) {
            console.log('switch1 发生 change 事件，携带值为', e.target.value)
            if(e.target.value){
                this.sevenRefund = 1;
            }else{
                this.sevenRefund = 0;
            }
        },
        check_from(){
            if(this.typeId == ""){
                this.$api.msg("请选择类目!")
                return false;
            }       
            if(this.checkbox_vals.length == 0){
                this.$api.msg("请选择分类!")
                return false;
            }
            if(this.isCustomAddress < 0){
                this.$api.msg("请选择邮寄方式!")
                return false;
            }
            if(this.isCustomAddress != 0 && this.freight == ""){
                this.$api.msg("请填写运费!")
                return false;
            }
            try{
                for (let i = 0; i< this.attr_use.length;i++) {
                    let json = this.attr_use[i];
                    for(let key in json){
                        if(json[key] == ""){  
                            if(key == "id"){
                                continue
                            }
                            this.$api.msg("请完善商品规格!")
                            return false;
                        }
                        if(key == "property"){
                            let property_json = json[key];
                            for(let j = 0; j < property_json.length;j++){
                                let property_j = property_json[j]
                                for(let property_key in property_j){
                                    if(property_j[property_key] == ""){
                                        if(property_key == "attrid"){
                                           continue
                                       }
                                        this.$api.msg("请完善商品规格!")
                                        return false;
                                    }
                                }
                                
                            }
                        
                        }
                    }
                }
            }catch(e){
                return true;	
            }
            return true;
        },
		//下一步
		nextstep() {
            uni.showLoading({
				mask : true
            })
            let _this = this;
            //校验
            if(!this.check_from()){
                return false;
            }
			let sttr_str = JSON.stringify(this.attr_use);
			//保存
			let data = {
                sevenRefund : this.sevenRefund,
				pid : this.pid,
				attrs : sttr_str,
				type : this.typeId,
				//运费
				freight : this.freight,
				isreserve : 0,
				isCustomAddress : this.isCustomAddress,
				categoryids : this.checkbox_vals.toString(),
				cguid :uni.getStorageSync("companyguid"),
				
			}
			console.log(data)
			this.$ajax.get('shopproduct/addShopProductStep3', data).then(res => {
                uni.hideLoading();
				console.log(res)
				if(res.data.code == 0){
					console.log(res)
                  /*  this.$api.msg("保存成功")
                     setTimeout(function(){ 
                        uni.navigateTo({
                            url: '/pages/establishment/productcon?pid=' + _this.pid
                        });
                     }, 2000); */
                      uni.navigateTo({
                         url: '/pages/establishment/productcon?pid=' + _this.pid
                     });
				}else if(res.data.code == -2){
                    this.add_address();  
                }else{
                    this.$api.msg(res.data.msg)
                }
			});
	
		},
		addtype(){
            let _this = this;
			uni.navigateTo({
				url: '/pages/establishment/addtype?pname=' + _this.pname + '&checkid=' + _this.typeId
			});
		},
          //跳转到编辑店铺页面 添加 自提地址
        add_address(){
             uni.showModal({
               title: '提示',
               confirmColor: '#fa436a',
               content: '您还没有自提地址不能上架自提商品,请您去编辑店铺中添加自提地址',
               success: function(res) {
                   if (res.confirm) {
                       uni.navigateTo({
                          url: '/pages/establishment/editshop'
                      });
                   } else if (res.cancel) {
                       return;
                   }
               }
           }); 
        },
		onConfirm(){
			uni.navigateBack();
		},
		//回调方法
		subCallback() {
			//查询选中的类目的所有属性
			console.log("1yemian" + this.typeName + this.typeId)
			let data = {
				cid : this.typeId
			}
			this.$ajax.get('shopproduct/getAttributeTitle', data).then(res => {
				this.attr_use = this.attr_tmp.slice();
				console.log("this.attr_tmp" )
				console.log( this.attr_tmp)
				if(res.data.code == 0){
					//重新选择类目后 初始化attr数组
					console.log(res.data.result.data)
					let attributeList = res.data.result.data;
					for (let i = 0;i < attributeList.length;i++) {
						attributeList[i]["value"] = "";
					}
					this.attr_use[0].property = attributeList;
					//空白模板 用于add规格时
					this.attr_add[0].property = attributeList;
				}
			});
			
		},
		categorylist_m() {
			let guid = uni.getStorageSync("companyguid");
			
			let  data = {
				type : 0,
				cguid: guid,
			}
			this.$ajax.get('comcategory/categorylist', data).then(res => {
				if(res.data.code == 0){
					console.log(res.data.result.data)
					this.items = res.data.result.data;
					
				}
			});
		},
		copy_specs(){
			//深度copy
            let attr_0 =  this.attr_add_Handle(this.attr_use[this.attr_use.length - 1]) 
			this.attr_use.push(attr_0)
			
		},
		add_specs(){
			//深度copy
            let attr_0 = this.attr_add_Handle(this.attr_use[this.attr_use.length - 1],"add")
			this.attr_use.push(attr_0)
		},
        attr_add_Handle(data,type) {
            let new_data = JSON.parse(JSON.stringify(data));
             if(type == "add"){
                new_data.price = '';
                new_data.stock = '';
             }       
            new_data.id = '';
            for (let i = 0; i < new_data.property.length; i++) {
                if(type == "add"){
                   new_data.property[i].value = '';  
                } 
                new_data.property[i].attrid = '';
            }
            return new_data;
        },        
        
		delete_specs(attrKey){
			if(this.attr_use.length == 1){
				return;
			}
			this.attr_use.splice(attrKey,1);	
		},
		classification() {
		    this.$refs.classification.open();
		},
        
        classification_close(){
            this.$refs.classification.close(); 
        },
		//多选分类 确定
		gbclassification(){ 
		    this.$refs.classification.close();
			if(this.checkbox_vals.length > 0){
				this.checkbox_text = "";
			}else{
				this.checkbox_text = "请选择";
			}
			for (var i = 0, lenI = this.items.length; i < lenI; ++i) {
			    const item = this.items[i];
			    if (this.checkbox_vals.includes(item.categoryid + '')) {
					this.checkbox_text += item.categoryname + " ";
			    }
			}
		},
		//多选分类取消
		gbclassification_cancel(){
		    this.$refs.classification.close();
		},
		mail() {
			let this_page = this;
		    uni.showActionSheet({
				// 0 1 2 
		        itemList: this_page.addrButList,
		        success: function(res) {
                       if(res.tapIndex == 0){
                        this_page.freightShow = false
                    }else{
                        this_page.freightShow = true
                    }
					this_page.isCustomAddress = res.tapIndex;
					this_page.addrbtu_text = this_page.addrButList[res.tapIndex];
		            console.log('选中了第' + (res.tapIndex) + '个按钮');
		        }
		    });
		},
		 checkboxChange: function(e) {
		    var items = this.items,
		        values = e.detail.value;
				console.log(values);
				this.checkbox_vals = values;
		    for (var i = 0, lenI = items.length; i < lenI; ++i) {
		        const item = items[i];
		        if (values.includes(item.categoryid + '')) {
		            this.$set(item, 'checked', true);
		        } else {
		            this.$set(item, 'checked', false);
					
		        }
		    }
		},
          //添加分类
        management(type){
        	this.class_typeName = "";
            this.$refs.addclassification.open();
        },
        saveType(){
        	if(this.class_typeName == ""){
                this.$api.msg("请输入分类名称")
                return false;
            }
            let data = {
                 categoryname : this.class_typeName,
                 cguid : this.cguid,
            }
            this.$ajax.get('comcategory/savecategory', data).then(res => {
                if(res.data.code == 0){
                    this.categorylist_m();  
                }
                this.$refs.addclassification.close();
            }); 
        	
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
}
.list-cell {
	display: flex;
	align-items: baseline;
	padding: 20upx $page-row-spacing;
	line-height: 60upx;
	position: relative;
	background: #fff;
	justify-content: center;
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
	}
	.cell-tit {
		flex: 1;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 10upx;
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
	switch {
	    transform: translateX(16upx) scale(0.6);
	}
}

.typecon {
	padding: 20rpx 30rpx;
	margin-top: 20rpx;
	background: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	image {
		width: 60rpx;
		height: 60rpx;
	}
	.typeopt {
		flex-grow: 1;
	}
}
.typelist {
	font-size: 28rpx;
	display: flex;
    align-items: center;
	padding: 20upx $page-row-spacing;
	border-bottom: 1px solid #dddddd;
	background: #ffffff;
	.typeinput {
		flex-grow: 1;
		padding-left: 20rpx;
	}
	.typetitle,
	.typetip {
		flex-grow: 0;
	}
}

.addcategory {
	display: flex;
	align-items: center;
	background: #ffffff;
	font-size: 24rpx;
	.categoryitem {
		flex-grow: 1;
		padding: 20rpx;
		padding-left: 60rpx;
		image {
		    width: 50rpx;
		    height: 50rpx;
		    vertical-align: middle;
		    margin-right: 20rpx;
		}
	}
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 995;
	display: flex;
	align-items: center;
	width: 100%;
	height: 90upx;
	justify-content: space-between;
	font-size: 30upx;
	background-color: #fff;
	z-index: 998;
	color: $font-color-base;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

	.submit {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #fff;
		font-size: 32upx;
		background-color: $base-color;
		&.ash {
			background-color: #fff;
			color: #333;
		}
	}
}
.btns {
	margin-bottom: 10rpx;
	display: flex;
	justify-content: space-between;
	color: $font-color-base;
	.action {
		color: $base-color;
	}
}
.addclassification{
    border-top:1px solid #DDD;
    text-align: center;
    padding: 20rpx 0 0 0;
    vertical-align: middle;
    image{
        width: 50rpx;
        height: 50rpx;
        vertical-align: middle;
        margin-right: 20rpx;
    }
}
.uni-list {
	max-height: 40vh;
	overflow-y: auto;
	.uni-list-cell {
		display: flex;
		border-top: 1px solid #dddddd;
		padding: 10rpx 0;
		&.btn {
			text-align: center;
			padding: 20rpx;
			padding-bottom: 0;
			display: block;
		}
	}
}
/deep/ .uni-popup{
	z-index: 999;
}
/deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box{
    border-radius: 20rpx;
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

