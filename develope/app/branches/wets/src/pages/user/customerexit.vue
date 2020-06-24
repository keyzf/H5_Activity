<template>
    <view>
        <web-view :src="url"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                url:''
            }
        },
        onLoad(o) {
           this.url = o.url;
           if(o.name){
               uni.setNavigationBarTitle({
                   title:o.name
               })
           }
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        }
    }
</script>

<style>

</style>