<template>
	<view class="content">
		<view class="list-cell" v-show="historyList.length > 0" v-for="(item, index) in historyList" :key="index" @click="installedit(index)">
		    <view class="cell-tit">
		        <view>{{ item.deposit_text }}</view>
		        <view class="tip">{{ item.createtime }}:22</view>
		    </view>
		    <view class="cell-more yticon icon-you pice">{{ item.deposit }}</view>
		</view>
        <uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
    components: {uniLoadMore},
	data() {
		return {
            cguid: uni.getStorageSync('companyguid'),
            pagesize: 10,
            historyList: [],
            loadingType: 'more'
        };
	},
    //下拉刷新
    onPullDownRefresh() {
    	this.getDepositHistory('');
    },
    //加载更多
    onReachBottom() {
        let lastId = this.historyList[this.historyList.length - 1].id;
        this.getDepositHistory(lastId);
    },
    onLoad(option) {
        this.getDepositHistory('');
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
        // 保证金列表
        getDepositHistory(lid) {
            if (this.loadingType == 'noMore' && lid != '') {
                return;
            }
            if (this.loadingType == 'loading') {
                return;
            }
            this.loadingType = 'loading';
            this.$ajax.get('com/getDepositHistory', {cguid: this.cguid, lid: lid, pagesize: this.pagesize}).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    this.historyList = lid == '' ? data : this.historyList.concat(data);
                    this.loadingType = data.length == this.pagesize ? 'more' : 'noMore';
                    if (lid == '') uni.stopPullDownRefresh(); 
                } else {
                    this.$api.msg('获取列表失败');
                }
            });
        },
        // 查看保证金缴费详情
        installedit(index){
            let obj = this.historyList[index];
            uni.navigateTo({
                url:'/pages/install/installedit?id=' + obj.id
            })
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
}
.list-cell {
    padding: 20upx $page-row-spacing;
    line-height: 60upx;
    background: #fff;
    border-bottom: 1px solid #dddddd;
    justify-content: space-between;
    align-items: center;
    display: flex;
    .radio {
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        display: flex;
    }
    &.m-t {
        margin-top: 16upx;
    }
    .cell-more {
        font-size: $font-base;
        color: $font-color-light;
        margin-left: 10upx;
        &.input {
            flex-grow: 1;
        }
    }
    .pice{
        color: $base-color;
        font-size: 32rpx;
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
        .tip{
            font-size: 24rpx;
            color: $font-color-base;
        }
    }
}
</style>
