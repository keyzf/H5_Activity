<template>
	<view>
		<scroll-view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
			<view class="cu-list menu-avatar margin-bottom-60">
				<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in conversations" :key="index" @click="NavTo(index)">
					<view class="cu-avatar round lg" :style="[{background: 'url('+item.avatar+')'}]"></view>
					<view class="content">
						<view class="text-grey">{{item.nickName}}</view>
						<view class="text-gray text-sm">
							<text class=" text-grey  margin-right-xs">{{item.msg_text}}</text>
							<!-- 暂无消息 -->
						</view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">{{item.time}}</view>
						<view class="cu-tag round bg-red sm" v-if="item.unread_msg_count > 0">{{item.unread_msg_count}}</view>
					</view>
					<view class="move">
						<view class="bg-red">删除</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				conversations:[],//会话列表
				syncConversation:[],//离线消息
                guid:0
			}
		},
		onLoad(){
			this.show()
		},
		methods: {
			show(){
				let _this = this
                let userInfo = uni.getStorageSync('userInfo')
                if (!userInfo.guid) {
                    _this.$api.msg('当前尚未登录')
                    return;
                }
                _this.guid = userInfo.guid;
				this.$jjim.config(userInfo.guid)
				this.$jjim.getConversation().then(function(data){
					_this.conversations = data
					for(var i = 0; i < _this.conversations; i++){
						let _c = _this.conversations[i]
						_this.$jjim.getResurce(_this.conversations[i].avatar).then(function(data){
							_c.avatar = data
							_this.conversations[i] = _c
						})
					}
					_this.mergeConversations()
				})
                _this.$jjim.onSyncConversation(function(_d){
                	_this.syncConversation = _d
                	_this.mergeConversations()
                })
				
                uni.$on('msg_ols', function(_d) {
                    this.$jjim.getConversation().then(function(data){
                    	_this.conversations = data
                    	for(var i = 0; i < _this.conversations; i++){
                    		let _c = _this.conversations[i]
                    		_this.$jjim.getResurce(_this.conversations[i].avatar).then(function(data){
                    			_c.avatar = data
                    			_this.conversations[i] = _c
                    		})
                    	}
                    	_this.syncConversation = _d
                    	_this.mergeConversations()
                    })
                })
			},
			mergeConversations(){
                let conversations = this.conversations
                for(var i = 0; i< conversations.length;i++){
                    let _c = conversations[i]
                    for(var j = 0;j < this.syncConversation.length;j++){
                        var from_username = this.syncConversation[j].from_username
                        if(_c.username == from_username){
                            var msgs = this.syncConversation[j].msgs
                            var msg_text = "暂无消息"
                            
                            if(msgs && msgs.length > 0){
                                let pop = msgs.pop();
                                if(pop.content.msg_type == "image")
                                    msg_text = "[图片]";
                                else
                                    msg_text = pop.content.msg_body.text
                            }
                            _c.msg_text = msg_text
                            // _c.msgs = msgs
                            break;
                        }
                    }
                    this.conversations[i] = _c
                }
                
			},
			NavTo(index){
				var _this = this
				var chater_info = _this.conversations[index];
                console.log(chater_info)
                _this.$jjim.addSingleReceiptReport(chater_info,_this.guid).then(function(data){
                	
                },function(){})
				uni.setStorage({
					key:'jiguang_chater_info',
					data:chater_info
				})
				uni.navigateTo({
					url:'/pages/chat/chat',
					animationDuration:300
				})
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		}
	}
</script>

<style lang="scss">
    @import "colorui/main.css";
    @import "colorui/icon.css";
	.margin-bottom-60{
		margin-bottom: 60px;
	}
	.cu-avatar{
		background-size: 100% 100% !important;
		background-color:#EEE !important;
	}
</style>
