<template>
    <view class="content">
        <view class="list-cell" v-for="(item,index) in bankButList" :key=index @click="selected(item.id, item.name)">
            <view class="cell-tit">{{item.name}}</view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            bankButList : [],
        };
    },
    onLoad() {
    	this.bank_list();      
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    methods: {
        bank_list(){ 
            this.$ajax.get('income/getallbank', {}).then(res => {
                console.log(res)
                if(res.data.code == 0){
                    this.bankButList = res.data.result.data;
                }else{
                    this.$api.msg("发生异常")
                    return;
                }
            });        
        },
        //选中事件
        selected(id,name){
            //父页面赋值
            this.$api.prePage().bank_selectId = id;
            this.$api.prePage().bank_selectName = name;
            uni.navigateBack();
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
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
    }
}

</style>