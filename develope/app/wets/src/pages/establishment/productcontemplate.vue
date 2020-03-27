<template>
    <view class="content">
        <view class="swipercon">
            <swiper class="swiper" autoplay indicator-dots>
                <block v-if="picurls.length > 0">
                    <swiper-item v-for="(pic, index) in picurls" :key="index">
                        <view class="swiper-item"><img :src="pic.value" @click="upload_img" /></view>
                    </swiper-item>
                </block>
                <block v-else>
                    <swiper-item>
                        <view class="swiper-item default"><img src="../../static/default.png" @click="upload_img" /></view>
                    </swiper-item>
                </block>
            </swiper>
            <view class="btn" @click="upload_img"><image src="../../static/shopimg.png" mode="aspectFit"></image></view>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">商品名称</text>
            <input class="cell-more" type="text" v-model="name" maxlength="16" placeholder="请输入商品名称" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">副标题</text>
            <input class="cell-more" type="text" v-model="subheading" maxlength="16" placeholder="补充商品名称简单介绍商品" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">关键字</text>
            <input class="cell-more" type="text" v-model="keyword" maxlength="16" placeholder="添加关键词方便用户搜索(以逗号分隔)" />
        </view>
        <view class="list-cell b-b" @click="addtype">
            <text class="cell-tit">类目</text>
            <view class="cell-more yticon icon-you">{{ typeName }}</view>
        </view>
        <view v-for="(arrrValue, attrKey) in attr_use" :key="attrKey">
            <view class="typecon">
                <view class="typedel" @click="delete_specs(attrKey)"><image src="../../static/timedel.png" mode="aspectFit"></image></view>
                <view class="typeopt">
                    <view v-for="(value, key) in arrrValue.property" :key="key">
                        <view class="typelist">
                            <view class="typetitle">{{ value.key }}</view>
                            <input class="typeinput" v-model="attr_use[attrKey].property[key].value" type="text" value="" :placeholder="'请输入' + value.key" />
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
        <view class="list-cell b-b">
            <text class="cell-tit">商品详情</text>
            <view class="cell-more yticon icon-you" @click="productcon">添加商品详情</view>
        </view>
        <view class="list-cell b-b" @click="classification">
            <text class="cell-tit">分类</text>
            <view class="cell-more yticon icon-you">{{ checkbox_text }}</view>
        </view>

        <view class="list-cell b-b" @click="mail">
            <text class="cell-tit">邮寄方式</text>
            <view class="cell-more yticon icon-you">{{ addrbtu_text }}</view>
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
                        <label class="uni-list-cell" v-for="(item,ind) in items" :key="ind">
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
            <view class="cell-more"><switch :checked="sevenRefund == 1 "  @change="switch1Change" /></view>
        </view>
        <view class="footer" v-if="pid == undefined">
            <text class="submit ash" @click="onConfirm">上一步</text>
            <text class="submit" @click="sub_fun">提交</text>
        </view>

        <view class="footer" v-else>
            <text class="submit ash" @click="alert_info">删除</text>
            <text class="submit" @click="sub_fun">提交</text>
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
            class_typeName : "", //添加分类 分类名
            freightShow: false,
            pid: '',
            typeId: '', //类目id
            typeName: '请选择', //类目 ,名称
            attr_use: [
                {
                    //用于保存的 规格json
                    price: '',
                    id: '',
                    stock: '',
                    property: []
                }
            ],
            attr_tmp: [
                {
                    //初始化时使用
                    price: '',
                    id: '',
                    stock: '',
                    property: []
                }
            ],
            attr_add: [
                {
                    //新增规格时时使用
                    price: '',
                    id: '',
                    stock: '',
                    property: []
                }
            ],
            items: [], //分类 列表
            isCustomAddress: -1, //自提 0 还是 邮寄1 都支持 2
            checkbox_vals: [], //分类多选框 选中的列表
            checkbox_text: '请选择', //分类 显示字符串
            addrbtu_text: '请选择邮寄方式', //邮寄 文字显示
            addrButList: ['自提', '邮寄', '邮寄或自提'],
            freight: '', //邮寄 自提
            imgTextList_str: '', //描述的详情
            name: '', //商品名
            subheading: '', //副标题
            keyword: '', //关键词
            picurls: [],
            sevenRefund: 1, //七天无理由
        };
    },
    onLoad(param) {
        this.cguid = uni.getStorageSync('companyguid');
        this.type_message = param.type;
        this.pid = param.editPid;
        this.tabIndex = param.tabIndex;
        this.orderListIndex = param.index;

        //编辑时赋值
        if (this.pid != undefined && this.pid.length > 0) {
            let data = {
                pid: this.pid,
                cguid: this.cguid
            };
            this.$ajax.get('shopproduct/getShopProductDetail', data).then(res => {
                if (res.data.code == 0) {
                    if (this.$wx.isWechat()) {
                        this.$wx.share({
                            title: res.data.result.data.name,
                            desc: res.data.result.data.subheading,
                            imgUrl: res.data.result.data.picurls[0].value
                        }, 'http://ets.51pingce.net/pages/product/product?productid=' + res.data.result.data.id);
                    };
                    //赋值
                    this.set_value(res.data.result.data);
                    console.log(res.data.result.data);
                }
            });
        }else{
            //取缓存  赋值
            //this.autoFill();
            
        }
        this.pname = param.pname;
        //查询分类列表
        this.categorylist_m();
    },
    onBackPress(){
        this.$api.ovPage()
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
        set_value(data) {
            this.typeId = data.producttype; //类目id
            this.typeName = data.producttypename; //类目 ,名称
            this.attr_use = data.attrs; //规格
            this.attr_add = this.attr_add_Handle(data.attrs[0]);
            this.isCustomAddress = data.isCustomAddress; //自提 0 还是 邮寄1 都支持 2
            this.checkbox_vals = data.categoryids.split(','); //分类多选框 选中的列表
            this.checkbox_text = data.categorynames; //分类 显示字符串
            this.addrbtu_text = this.addrButList[data.isCustomAddress]; //邮寄 文字显示
            this.freight = data.freight || ''; //运费
            let detail_str = JSON.stringify(data.detail);
            this.imgTextList_str = detail_str; //描述的详情
            this.name = data.name; //商品名
            this.subheading = data.subheading; //副标题
            this.keyword = data.keywords; //关键词
            this.picurls = data.picurls;
            this.sevenRefund = data.seven_refund;
            if(this.isCustomAddress != 0){
                this.freightShow = true;
            }
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
            return [new_data];
        },
        check_from(){
            if(this.name == ""){
                this.$api.msg("请填写商品名称!")
                return false;
            } 
            
            if(this.subheading == ""){
                this.$api.msg("请填写商品副标题!")
                return false;
            } 
            
            if(this.keyword == ""){
                this.$api.msg("请填写商品关键字!")
                return false;
            } 
            
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
            if(this.picurls.length == 0){
               this.$api.msg("请至少选择一张轮播图!")
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
          
            if(this.imgTextList_str  == ""){
                this.$api.msg("请完善商品详情!")
                return false;
            }
            return true;
        },
        //下一步
        sub_fun() {
            uni.showLoading({
				mask : true
			});
            if(!this.check_from()){
               return false; 
            }
            let sttr_str = JSON.stringify(this.attr_use);
            let picurls_str = JSON.stringify(this.picurls);
            //保存
            let data = {
                sevenRefund: this.sevenRefund,
                name: this.name,
                subheading: this.subheading,
                keywords: this.keyword,
                detail: this.imgTextList_str,
                attrs: sttr_str,
                type: this.typeId,
                //运费
                freight: this.freight,
                isreserve: 0,
                isCustomAddress: this.isCustomAddress,
                categoryids: this.checkbox_vals.toString(),
                cguid: this.cguid,
                picurls: picurls_str
            };
            let url = 'shopproduct/addShopProduct'; //新增
            if (this.pid != undefined) {
                data.pid = this.pid;
                url = 'shopproduct/updateShopProduct'; //编辑
            }
            console.log(data);
            this.$ajax.get(url, data).then(res => {
                uni.hideLoading()
                console.log(res);
                if (res.data.code == 0) {
                    //调父页面
                    //this.$api.prePage().load();
                    if (this.type_message == 'message') {
                        //消息过来的
                        uni.navigateBack();
                        return;
                    }
                    console.log(res);

                    //编辑时 父页面数据更新
                    if (this.pid != undefined) {
                        this.edit_data();
                    } else {
                    }
                    this.$api.msg("操作成功");
                    setTimeout(function(){ uni.navigateBack(); }, 2000);
                    
                    //url: '/pages/establishment/establishment?cguid=' + uni.getStorageSync("companyguid")
                } else if(res.data.code == -2){
                    this.add_address(); 
                }else{
                    this.$api.msg(res.data.msg);
                }
            });
        },
        //编辑时提取出想要的信息
        edit_data() {
            let stock_all = 0; //库存
            for (let i = 0; i < this.attr_use.length; i++) {
                //库存 相加
                let stock = this.attr_use[i].stock;
                stock_all += parseInt(stock);
            }
            let price = this.attr_use[0].price; //价格
            //首图
            let picurls_one = this.picurls[0].value;
            let product = {}; //上一页面的商品信息
            if (this.type_message == 'search') {
                //this.$api.prePage().orderList[this.index].name = "00000000"
                product = this.$api.prePage().orderList[this.orderListIndex];
            } else {
                product = this.$api.prePage().navList[this.tabIndex].orderList[this.orderListIndex];
            }
            product.url = picurls_one; //首图
            product.price = price; //价格
            product.name = this.name; //名字
            product.stock = stock_all; //库存
        },
        onConfirm() {
            //this.setCookie_f();
            uni.navigateBack();
        },
        alert_info() {
            let page_this = this;
            uni.showModal({
                title: '提示',
                confirmColor: '#fa436a',
                content: '是否确定删除',
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击确定');
                        page_this.delete_fun();
                    } else if (res.cancel) {
                        return;
                    }
                }
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
        delete_fun() {
            this.$ajax.get('shopproduct/delShopProduct', { pid: this.pid }).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    //搜索结果 点击进来
                    if (this.type_message == 'search') {
                        this.$api.prePage().orderList.splice(this.index, 1);
                        //使用back返回
                        console.log(res);
                        uni.navigateBack();
                    }
                    //调父页面
                    this.$api.prePage().load();
                    //删除 该条数据
                    this.$api.prePage().navList[this.tabIndex].orderList.splice(this.index, 1);
                    //使用back返回
                    console.log(res);
                    uni.navigateBack();
                }
            });
        },
        addtype() {
            uni.navigateTo({
                url: '/pages/establishment/addtype?pname=' + this.name + '&checkid=' + this.typeId
            });
        },
        productcon() {
            this.picurls;
            uni.navigateTo({
                url: '/pages/establishment/productcon?isSave=noSave&imgTextList_str=' + this.imgTextList_str
            });
        },
        //回调方法
        subCallback() {
            //查询选中的类目的所有属性
            console.log('1yemian' + this.typeName + this.typeId);
            let data = {
                cid: this.typeId
            };
            this.$ajax.get('shopproduct/getAttributeTitle', data).then(res => {
                this.attr_use = this.attr_tmp.slice();
                console.log('this.attr_tmp');
                console.log(this.attr_tmp);
                if (res.data.code == 0) {
                    //重新选择类目后 初始化attr数组
                    console.log(res.data.result.data);
                    let attributeList = res.data.result.data;
                    for (let i = 0; i < attributeList.length; i++) {
                        attributeList[i]['value'] = '';
                    }

                    let add_list_tp = JSON.parse(JSON.stringify(attributeList));
                    this.attr_use[0].property = add_list_tp;
                    //空白模板 用于add规格时
                    this.attr_add[0].property = add_list_tp;
                }
            });
        },
        categorylist_m() {
            let guid = uni.getStorageSync('companyguid');

            let data = {
                type: 0,
                cguid: guid
            };
            this.$ajax.get('comcategory/categorylist', data).then(res => {
                if (res.data.code == 0) {
                    console.log(res.data.result.data);
                    this.items = res.data.result.data;
                }
            });
        },
        copy_specs() {
            //深度copy
            let attr_0 = JSON.stringify(this.attr_use[this.attr_use.length - 1]);
            let copyList = JSON.parse(attr_0);
            copyList = this.attr_add_Handle(copyList);
            this.attr_use.push(copyList[0]);
            console.log(this.attr_use);
        },
        add_specs() {
			if(this.typeId == ""){
				this.$api.msg("请选择商品类目");
				return;
			}
            //深度copy
            let attr_0 = JSON.stringify(this.attr_add[0]);
            let copyList = JSON.parse(attr_0);
            copyList = this.attr_add_Handle(copyList,"add");
            this.attr_use.push(copyList[0]);
            console.log(this.attr_use);
        },
        delete_specs(attrKey) {
            if (this.attr_use.length == 1) {
                return;
            }
            this.attr_use.splice(attrKey, 1);
        },
        classification() {
            if (this.checkbox_vals.length > 0) {
                for (var i = 0, lenI = this.items.length; i < lenI; ++i) {
                    const item = this.items[i];
                    if (this.checkbox_vals.includes(item.categoryid + '')) {
                        this.$set(item, 'checked', true);
                    } else {
                        this.$set(item, 'checked', false);
                    }
                }
                this.$refs.classification.open();
            }
             this.$refs.classification.open();
        },
       
        classification_close(){
          this.$refs.classification.close();  
        },
  
         //多选分类 确定
        gbclassification() {
            this.$refs.classification.close();
            if (this.checkbox_vals.length > 0) {
                this.checkbox_text = '';
            } else {
                this.checkbox_text = '请选择';
            }
            for (var i = 0, lenI = this.items.length; i < lenI; ++i) {
                const item = this.items[i];
                if (this.checkbox_vals.includes(item.categoryid + '')) {
                    this.checkbox_text += item.categoryname + ' ';
                }
            }
        },
        //多选分类取消
        gbclassification_cancel() {
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
                    console.log('选中了第' + res.tapIndex + '个按钮');
                }
            });
        },
        checkboxChange: function(e) {
            var values = e.detail.value;
            console.log(values);
            this.checkbox_vals = values;
        },
        upload_img() {
            //上传图片  跳转到上传图片的页面  该子页面会把当前页面的属性刷新
            uni.navigateTo({
                url: '/pages/establishment/addproductimg?isSave=add_img_tm'
            });
        },
    
        autoFill(){
            let page_this = this;
             let json_str = uni.getStorageSync("productcontemplate_info");   
            if(json_str == undefined){
                return;
            }
           uni.showModal({
              title: '提示',
              confirmColor: '#fa436a',
              content: '上次未填写完成,是否继续!',
              success: function(res) {
                  if (res.confirm) {
                     // 取出cookie
                     let data_json = JSON.parse(json_str);
                     page_this.picurls = data_json.picurls; // 图片
                     page_this.name = data_json.name;
                     page_this.subheading =  data_json.subheading; //副标题
                     page_this.keyword =  data_json.keyword;//关键字
                     page_this.typeName = data_json.typeName;// 类目
                     page_this.typeId = data_json.typeId; //类目id
                     page_this.attr_use = data_json.attr_use;  //规格
                     //复制  添加  待定
                     page_this.checkbox_text = data_json.checkbox_text; //分类
                     page_this.checkbox_vals = data_json.checkbox_vals;
                     page_this.imgTextList_str = data_json.imgTextList_str; //商品详情
                     page_this.isCustomAddress = data_json.isCustomAddress;//自提 邮寄
                     page_this.addrbtu_text = data_json.addrbtu_text; //自提邮寄 文字
                     page_this.freight = data_json.freight;//运费
                  } else if (res.cancel) {
                      return;
                  }
              }
          });   
            
        },
        setCookie_f(){
            console.log("121212121");
            let data= {
                picurls:this.picurls, // 图片
                name:this.name,
                subheading: this.subheading, //副标题
                keyword : this.keyword, //关键字
                typeName :this.typeName,// 类目
                typeId : this.typeId, //类目id
                attr_use : this.attr_use, //规格
                //复制  添加  待定
                checkbox_text : this.checkbox_text, //分类
                checkbox_vals : this.checkbox_vals,
                imgTextList_str : this.imgTextList_str, //商品详情
                isCustomAddress : this.isCustomAddress,//自提 邮寄
                addrbtu_text : this.addrbtu_text,//自提邮寄 文字
                freight : this.freight//运费
            }
             uni.setStorage({
                 key: 'productcontemplate_info',
                 data: JSON.stringify(data),
                 success: function () {
                 console.log('已存入缓存');
             }
            });
            
        },    
    },
};
</script>
<style lang="scss">
page {
    background: $page-color-base;
}
/deep/ .uni-popup__wrapper-box{
    border-radius: 20rpx;
}
.content {
    border-top: 1px solid #dddddd;
    padding-bottom: 160rpx;
}
.swipercon {
    background: #ffffff;
    position: relative;
    .swiper {
        height: 750rpx;
    }
    img {
        width: 750rpx;
        height: 750rpx;
    }
    .default {
        img {
            width: 750rpx;
            height: 350rpx;
            margin-top: 200rpx;
        }
    }
    .btn {
        position: absolute;
        bottom: 60rpx;
        right: 60rpx;
        z-index: 1;
        image {
            width: 60rpx;
            height: 60rpx;
        }
    }
}
.addcon {
    background: #ffffff;
    padding: 20rpx 30rpx;

    .addconitem {
        position: relative;
        margin-bottom: 20rpx;

        .subject {
            overflow: hidden;

            image {
                width: 690rpx;
                float: left;
            }

            textarea {
                width: 690rpx;
                height: 100rpx;
                border: 1px solid #dddddd;
                border-radius: 6rpx;
                padding: 10rpx;
            }
        }

        .operation {
            position: absolute;
            right: 0;
            bottom: 8rpx;
            font-size: 24rpx;
            border-top: 1px solid #dddddd;

            text {
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
        flex: 1;
        text-align: right;
    }

    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
        width: 120rpx;
        &.cw{
            flex-grow: 1;
            width: auto;
        }
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
        margin-left: 20rpx;
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

.btns {
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
    color: $font-color-base;

    .action {
        color: $base-color;
    }
}

.uni-list {
    max-height: 40vh;
    overflow-y: auto;

    .uni-list-cell {
        display: flex;
        border-top: 1px solid #dddddd;
        padding: 20rpx 0;
        &.btn {
            text-align: center;
            padding: 20rpx;
            padding-bottom: 0;
            display: block;
        }
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
