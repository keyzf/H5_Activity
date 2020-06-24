<template>
  <view>
    <view class="edit-title"></view>
    <view class="edit-body">
      <textarea v-model="content" class="input" />
      <view class="imglist">
        <view class="imgitem" v-for="(item,index) in picarray" :key="index">
          <image src="../../static/imgdel.png" mode="aspectFit" class="del" @click="del(index)"></image>
          <image :src="item" mode="aspectFill"></image>
        </view>
        <view class="imgitem" v-show="picarray.length<3" @click="add()">
          <image src="../../static/upimg.png" mode="aspectFit" class="add"></image>
          <view>上传照片</view>
        </view>
      </view>
      <view class="btn" @click="sublit()">提交</view>
    </view>
    <view class="edit-bottom"></view>
	</view>
</template>

<script>
	export default {
	  data() {
	    return {
        id:'',
        content:'',
        picarray:[]
	    };
	  },
	  onLoad(o) {
      this.id = o.id;
	    this.onload()
	  },
	  methods:{
	    onload(){
        if(this.id){
          this.$ajax.get('groupbuy/getWishDetail', {wishid:this.id}).then(res => {
            if(res.data.code == 0){
              this.content = res.data.result.data.content;
              var sz = [];
              res.data.result.data.picarray.forEach(item=>{
                sz.push(item.picurl)
              })
              this.picarray = sz;
            }
          });
        }
	    },
      del(index){
        this.picarray.splice(index,1)
      },
      sublit(){
        var date = {
          content:this.content,
          pics:this.picarray.toString(),
          wishid:this.id
        }
        this.$ajax.get('groupbuy/addWish', date).then(res => {
          if(res.data.code == 0){
            uni.navigateBack()
          }else{
            this.$api.msg(res.data.msg);
          }
        });
      },
      add(){
        if (this.$wx.isWechat()) {
          this.$wx.upload(1).then(res => {
            if (res.data.code == 0) {
              let data = res.data.result.data;
              if(data.url == ""){
                this.$api.msg('图片上传失败');
              }else{
                this.picarray.push(data.url);
              }
            } else {
              this.$api.msg('图片上传失败');
            }
          });
        }
      }
	  }
	}
</script>

<style lang="scss">
  page{
    background: #ed5756;
    overflow: hidden;
  }
.edit-title{
  margin-top: 100rpx;
  background: url(../../static/edit-title.png) no-repeat center;
  background-size: 100%;
  height: 90rpx;
}
.edit-body{
  height: calc(100vh - 500rpx);
  background: url(../../static/edit-body.png) repeat-y center;
  background-size: 100%;
  padding: 2% 8%;
  position: relative;
  .input{
    width: 100%;
    padding: 10rpx;
    height: 260rpx;
  }
  .imglist{
    font-size: 0;
    .imgitem{
      width: 31.3%;
      margin: 1%;
      padding: 10rpx;
      display: inline-block;
      border: 1rpx solid #f1f1f1;
      border-radius: 8rpx;
      font-size: 24rpx;
      text-align: center;
      position: relative;
      image{
        width: 100%;
        height: 200rpx;
      }
      .del{
        width: 60rpx;
        height: 60rpx;
        position: absolute;
        top: -20rpx;
        right: -20rpx;
        z-index: 1;
      }
      .add{
        width: 100%;
        height: 120rpx;
        margin: 24rpx 0;
      }
    }
  }
  .btn{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 400rpx;
    background:  #ed5756;
    color: #FFF;
    border-radius: 40rpx;
    text-align: center;
        margin: 0 auto;
        line-height: 80rpx;
  }
}
.edit-bottom{
  background: url(../../static/edit-bottom.png) no-repeat center;
  background-size: 100%;
  height: 86rpx;
}
</style>
