<template>
    <view>
        <view class="list x">
            <!-- 空白页 -->
            <empty v-if="data.length === 0"> </empty>
            <view class="item" v-for="(item, index) in data" :key="index">
                <image src="../../static/del.png" mode="aspectFit" class="del" v-show="type == 2" @click="delProduct(index)"></image>
                <image :src="item.picurls[0].picurl" mode="aspectFill" class="logo"></image>
                <view class="title">
                    {{ item.productname }}
                </view>
            </view>
        </view>
        <view class="btn" @click="add" v-show="type == 2">添加商品</view>
        
    </view>
</template>

<script>
    import empty from "@/components/empty";
	export default {
        components: {empty},
		data() {
			return {
				cguid: '',
                type: 0,
                data: uni.getStorageSync('productData') || [],
                pageSize: 10,
                lastId: ''
			}
		},
        onLoad(options) {
            this.type = options.type;
            if (this.type == 2) {
            } else {
                this.cguid = options.cguid;
                this.getList();
            }
        },
		methods: {
			add() {
			    uni.navigateTo({
			        url: '/pages/ranking/edit'
			    });
			},
            // 获取列表
            getList() {
                uni.showLoading({
                    title: '请稍等...'
                })
                let data = {};
                let url = '';
                if (this.type == 0) {
                    data.cguid = this.cguid;
                    data.lid = this.lastId;
                    data.pagesize = this.pageSize;
                    data.ishelppoor = 1;
                    url = 'shophomepage/shopinfo';
                } else {
                    data.supplierid = this.cguid;
                    data.lastId = this.lastId;
                    data.pageSize = this.pageSize;
                    url = 'helppoorcompetition2019/getSupplierDetail';
                }
                this.$ajax.get(url, data).then(res => {
                    uni.hideLoading();
                    console.log(res);
                    if (res.data.code == 0) {
                        if (this.type == 0) {
                            let productlist = [];
                            res.data.result.data.forEach(item => {
                                if (item.type == 3) {
                                    productlist = item.productlist;
                                }
                            });
                            productlist.forEach(item => {
                                this.data.push({
                                    productname: item.name,
                                    picurls: [{
                                        picurl: item.url
                                    }]
                                });
                            });
                        } else if (this.type == 1) {
                            this.data = res.data.result.data.productinfo;
                        }
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            },
            // 修改商品
            changeProduct(data) {
                this.data.push(data);
                uni.setStorageSync('productData', this.data);
            },
            // 删除商品
            delProduct(index) {
                this.data.splice(index, 1);
                uni.setStorageSync('productData', this.data);
            }
		}
	}
</script>

<style lang="scss">
page{
    background: #f2f2f2;
}
.list{
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx;
    .item{
        width: 48%;
        margin-bottom: 40upx;
        background: #fff;
        border-radius: 20rpx;
        overflow: hidden;
        &:nth-child(2n + 1) {
            margin-right: 4%;
        }
        .logo{
            width: 100%;
            height: 300rpx;
        }
        .title{
            font-size: 30rpx;
            padding: 0 20rpx;
            text-align: center;
            margin-bottom: 6rpx;
            line-height: 1.4;
        }
        .del{
            display: none;
        }
        
    }
    &.x{
        .item{
            position: relative;
            .del{
                display: block;
                position: absolute;
                top: 20rpx;
                right: 20rpx;
                width: 40rpx;
                height: 40rpx;
                z-index: 1;
            }
        }
    }
}
.btn{
    width: 600rpx;
    text-align: center;
    line-height: 40rpx;
    border: 1rpx dashed rgb(205, 205, 205);
    border-radius: 10rpx;
    color: $base-color;
    margin: 0 auto;
    font-size: 28rpx;
    padding: 20rpx 0;
    position: relative;
}
</style>
