<template>
  <view>
    <view class="list">
      <view class="item" v-for="(item,index) in list" :key="index">
        <view class="tip">
          <text @click="edit(item.id)">编辑</text>
          <text @click="del(item.id)">删除</text>
        </view>
        <view class="time">
          <text>许愿时间：</text>
          <view>{{item.addtime}}</view>
        </view>
        <view class="tips">
          <text>我的心愿：</text>
          <view>{{item.content}}</view>
        </view>
        <view class="imglist" v-if="item.pics.length > 0">
          <view class="imgitem" v-for="(it,ind) in item.pics" :key="ind">
            <image :src="it.picurl" mode="aspectFill"></image>
          </view>
        </view>
        <view class="reply">
          <text>商城回复：</text>
          <view>{{item.replication}}</view>
        </view>
      </view>
      <image src="../../static/wishlist.png" mode="aspectFill" class="btn" @click="edit('')"></image>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        list: []
      };
    },
    onShow() {
      this.onload()
    },
    methods: {
      onload() {
        this.$ajax.get('groupbuy/getMyWishList', {}).then(res => {
          if (res.data.code == 0) {
            this.list = res.data.result.data.wishlist;
          }else{
            this.$api.msg(res.data.msg);
          }
        });
      },
      edit(id) {
        uni.navigateTo({
          url: '/pages/wishlist/edit?id=' + id
        })
      },
      del(id) {
        var _this = this;
        uni.showModal({
          title: '',
          content: '确定要删除这个心愿单吗？',
          success: function(res) {
            if (res.confirm) {
              _this.$ajax.get('groupbuy/deleteWish', {
                wishid: id
              }).then(res => {
                if (res.data.code == 0) {
                  _this.onload();
                }
              });
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      },
    }
  }
</script>

<style lang="scss">
  page {
    background: #f0f0f0;
  }

  .list {
    .item {
      background: #FFF;
      margin: 0 22rpx;
      padding: 8rpx 14rpx;
      font-size: 28rpx;
      border-bottom: 1rpx solid #f1f1f1;
      word-break: break-all;

      &:last-child {
        border: 0;
      }

      .tip {
        text-align: right;

        text {
          display: inline-block;
          font-size: 24rpx;
          padding: 4rpx 20rpx;
          border: 1rpx solid #f1f1f1;
        }
      }

      .time {
        color: #333;
        margin-bottom: 10rpx;
      }

      .tips {
        color: #666;
      }

      .imglist {
        font-size: 0;

        .imgitem {
          width: 33.3%;
          padding: 10rpx;
          display: inline-block;

          image {
            width: 100%;
            height: 200rpx;
          }
        }
      }

      .reply {
        color: #ff3a54;
        margin-bottom: 10rpx;
      }

      .reply,
      .time,
      .tips {
        display: flex;
        align-items: center;

        view {
          flex: 1;
        }
      }
    }
  }

  .btn {
    display: block;
    margin: 20rpx 20rpx 0 auto;
    width: 410rpx;
    height: 334rpx;
  }
</style>
