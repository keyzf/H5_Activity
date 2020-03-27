<template>
    <view>
        <view class="cu-chat">
            <view v-for="(item,index) in chatList" :key="index">
                
                <view class="cu-item self" v-if="username == item.from_id">
                    <view class="main">
                        <view class="content bg-green shadow" v-if="(item.msg_type == 'image')">
                            <img :src="item.image" class="radius" @click="openimage(item.msg_id)" >
                        </view>
                        <view class="content bg-green shadow" v-else>
                            <text>{{item.text}}</text>
                        </view>
                    </view>
                    <view class="cu-avatar radius" :style="[{background: 'url('+item.avatar+')'}]"></view>
                    <view class="date">{{item.time}}</view>
                </view>
                <view class="cu-item" v-else>
                    <view class="cu-avatar radius" :style="[{background: 'url('+item.avatar+')'}]"></view>
                    <view class="main">
                        <view class="content bg-green shadow" v-if="(item.msg_type == 'image')">
                            <img :src="item.image" class="radius" @click="openimage(item.msg_id)" >
                        </view>
                        <view class="content bg-green shadow" v-else>
                            <text>{{item.text}}</text>
                        </view>
                    </view>
                    <view class="date ">{{item.time}}</view>
                </view>
            </view>
        </view>

        <view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
            <!-- <view class="action">
                <text class="cuIcon-sound text-grey"></text>
            </view> -->
            <input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
             @focus="InputFocus" @blur="InputBlur" v-model="my_say_text"></input>
            <view class="action">
                <text class="cuIcon-pic text-grey" @click="to_send_pic()"></text>
            </view>
            <button class="cu-btn bg-green shadow" @click="to_send()">发送</button>
        </view>

    </view>
</template>

<script>
    export default {
        data() {
            return {
                InputBottom: 0,
                chater_info:{},
                chatList:[],
                username:"",
                userinfo:{},
                my_say_text:'',
            };
        },
        onLoad(){
            uni.showLoading({
                title:'加载中'
            })
            let _this = this
            var chater_info = uni.getStorageSync('jiguang_chater_info')
            this.chater_info = chater_info
            
            uni.setNavigationBarTitle({
                title: chater_info.nickName
            });
            let userInfo = uni.getStorageSync('userInfo')
            if (!userInfo.guid) {
                this.$api.msg('当前尚未登录')
                return;
            }
            this.username = userInfo.guid
            this.$jjim.config(userInfo.guid)
            this.$jjim.getUserInfo().then(function(data){
                _this.userinfo = data.user_info
                _this.getMsgs()
            })
            uni.$on('msg_ol', function(data) {
                for(var i = 0;i<data.length;i++){
                    _this.insertData(data[i]);
                }
                _this.loadReources()
            })
        },
        methods: {
            insertData(item){				
                let _this = this
                item.from_id = item.content.from_id
                item.msg_type =  item.content.msg_type
                item.text = item.content.msg_body.text
                if(item.content.from_id == _this.username){
                    item.avatar = _this.userinfo.avatar
                }else{
                    item.avatar = _this.chater_info['avatar']
                }
                _this.chatList.push(item)
            },
            getMsgs(){
                let _this = this
                let msgs = this.$jjim.getMsgs(_this.chater_info.username)
                if(msgs){
                    msgs = msgs.sort(_this.timeAsc)
                    for(var i = 0;i<msgs.length;i++){
                        msgs[i].from_id = msgs[i].content.from_id
                        msgs[i].msg_type =  msgs[i].content.msg_type
                        msgs[i].text = msgs[i].content.msg_body.text
                        if(msgs[i].content.from_id == this.username){
                            msgs[i].avatar = this.userinfo.avatar
                        }else{
                            msgs[i].avatar = this.chater_info['avatar']
                        }
                    }
                    _this.chatList = msgs
                }
                // _this.chatList.sort(_this.timeAsc)
                _this.loadReources()
            },
            loadReources(){
                let _this = this
                if(_this.chatList.length > 0){
                    for(var i=0;i<_this.chatList.length;i++){
                        if(_this.chatList[i].content.msg_type == 'image' && !_this.chatList[i].image){
                            let _c = _this.chatList[i]
                            _this.$jjim.getResurce(_this.chatList[i].content.msg_body.media_id, i).then(function(data){
                                _c.image = data.url
                                _this.chatList[data.index] = _c
                                _this.chatList.sort(_this.timeAsc)
                            },function(data){
                                console.log(data)
                            })
                        }
                    }
                }
                _this.to_bottom()
            },
            loadMsgs(msgs){
                let _this = this
                if(msgs){
                    msgs = msgs.sort(_this.timeAsc)
                    for(var i = 0;i<msgs.length;i++)
                    {
                        msgs[i].from_id = msgs[i].content.from_id
                        msgs[i].msg_type =  msgs[i].content.msg_type
                        msgs[i].text = msgs[i].content.msg_body.text
                        if(msgs[i].content.from_id == this.username){
                            msgs[i].avatar = this.userinfo.avatar
                        }else{
                            msgs[i].avatar = this.chater_info['avatar']
                        }
                        if(msgs[i].content.msg_type == 'image'){
                            let _c = msgs[i]
                            _this.$jjim.getResurce(msgs[i].content.msg_body.media_id).then(function(data){
                                _c.image = data
                                _this.chatList[i] = _c
                                _this.chatList.sort(_this.timeAsc)
                            },function(data){
                                console.log('图片加载失败')
                            })
                        }
                    }
                    this.chatList = msgs
                    _this.to_bottom()
                }else{
                    //获取历史消息
                    this.loadHistory()
                }
            },
            loadHistory(){
                let _this = this
                _this.$jjim.getHistory().then(function(data){
                    for(var i=0;i<data.data.messages.length;i++){
                        data.data.messages[i].text = data.data.messages[i].msg_body.text
                        if(data.data.messages[i].from_id == _this.username){
                            data.data.messages[i].avatar = _this.userinfo.avatar
                        }else{
                            data.data.messages[i].avatar = _this.chater_info['avatar']
                        }
                        
                        if(data.data.messages[i].msg_type == 'image'){
                            let _c = data.data.messages[i]
                            _this.$jjim.getResurce(data.data.messages[i].msg_body.media_id).then(function(data){
                                _c.image = data
                                _this.chatList[i] = _c
                                _this.chatList.sort(_this.timeAsc)
                            },function(data){
                                console.log('图片加载失败')
                            })
                        }
                    }
                    _this.chatList = data.data.messages 
                    _this.to_bottom()
                },function(data){
                    _this.loadHistory()
                });
            },
            openimage(msg_id){
                let _this = this;
                let urls = [];
                let current = 0;
                for(var i=0;i<_this.chatList.length;i++){
                    if(_this.chatList[i].msg_type == 'image'){
                        if(msg_id == _this.chatList[i].msg_id){
                            current = urls.length
                        }
                        urls.push(_this.chatList[i].image)
                    }
                }
                uni.previewImage({
                    urls: urls,
                    current: current
                });
            },
            to_bottom() {
                setTimeout(function() {
                    uni.pageScrollTo({
                        scrollTop: 800000,
                        duration:0
                    })
                    uni.hideLoading()
                }, 1000);
            },
            to_send() {
                var _this = this;
                if (!_this.my_say_text || _this.my_say_text == '') {
                    //无内容直接跳出
                    return
                }
                this.$jjim.sendMsg(_this.chater_info.username,_this.chater_info.nickName,_this.my_say_text).then(function(data){
                    _this.insertData(data)
                    _this.to_bottom()
                    _this.my_say_text = ''
                },function(error){
                    _this.my_say_text = ''
                })
            },
            to_send_pic(){
                let _this = this
                uni.chooseImage({
                    count:1,
                    sizeType: ['original', 'compressed'],
                    success(res){
                        uni.showLoading({
                            title:'上传中...'
                        })
                        let img = res.tempFilePaths[0];
                        let imgname = 'uploadimg';
                        console.log(res)
                        _this.$jjim.sendPic(_this.chater_info.username,_this.chater_info.nickName,img,imgname).then(function(data){
                            console.log(data)
                            _this.insertData(data)
                            _this.loadReources()
                            uni.hideLoading()
                        },function(error){
                            uni.hideLoading()
                        })
                    } 
                })
            },
            timeAsc(obj1,obj2){
                if(obj1.ctime_ms < obj2.ctime_ms){
                   return -1;
                }else if(obj1.ctime_ms > obj2.ctime_ms){
                   return 1;
                }else{
                   return 0;
                }
            },
            InputFocus(e) {
                this.InputBottom = e.detail.height
            },
            InputBlur(e) {
                this.InputBottom = 0
            }
        }
    }
</script>

<style>
    @import "colorui/main.css";
    @import "colorui/icon.css";
    .cu-avatar{
        background-size: 100% 100% !important;
        background-color:#EEE !important;
    }

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 40upx 0px;
		justify-content: space-between;
	}

	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 45%;
		margin: 0 2.5% 40upx;
		background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}

	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}

	.nav-li text {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}

	@keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}
</style>
