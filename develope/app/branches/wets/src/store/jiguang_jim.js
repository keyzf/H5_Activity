import Vue from 'vue'
import JMessage from '../components/wxmp-jiguang/jmessage-wxapplet-sdk-1.4.0/jmessage-wxapplet-sdk-1.4.0.min.js'
import md5 from './md5.min.js'

let appkey = '6662e3bd58e7def040dbaed0';
let key = 'd0e93410e6d38c686903a9d4';

let username = '';
let password = '3986ec892056e7e6528e92ed9afdc8d5';
let JIM = null;
let Time_now = {
    Date: '',
    Y: '',
    M: '',
    D: '',
    h: '',
    m: '',
    s: ''
}

function JJIM() {
    this.appkey = appkey;
    this.key = key;
}

function getJIM() {
    if (!JIM) {
        JIM = new JMessage({});
    }
    return JIM;
}

JJIM.prototype.getIJIM = function() {
    return getJIM()
}

JJIM.prototype.config = function(username) {
    this.username = username;
    times_now()
}

/**
 * 初始化
 */
JJIM.prototype.init = function() {
    let _this = this
    let JIM = getJIM();
    let nowtime = Time_now;
    return new Promise((resolve, reject) => {
        if (!JIM.isInit()) {
            let timestamp = (new Date()).getTime();
            let random_str = '022cd9fd995849b66666';
            var signature = md5("appkey=" + this.appkey + "&timestamp=" + timestamp + "&random_str=" +
                random_str + "&key=" + this.key);

            JIM.init({
                "appkey": this.appkey,
                "random_str": random_str,
                "signature": signature,
                "timestamp": timestamp,
                "flag": 1
            }).onSuccess(function(data) {
                resolve('success')
            }).onFail(function(data) {
                reject('JIM初始化失败' + JSON.stringify(data))
            });

            JIM.onDisconnect(function() {
                console.log('JIM断开链接')
            });

            JIM.onMsgReceive(function(data) {
                console.log('在线接受消息')
                let _list = data.messages
                _this.saveMsgs(_list, true, '')
            });
            JIM.onMsgReceiptChange(function(data) {
                console.log('已读消息监听')
            });
            JIM.onSyncMsgReceipt((data) => {
                console.log('已读消息监听')
                console.log(data)
            });
        } else {
            resolve('success')
        }
    });

}

/**
 * 登录
 */
JJIM.prototype.login = function() {
    let JIM = getJIM();
    let _this = this
    return new Promise((resolve, reject) => {
        if (!JIM.isLogin()) {
            _this.init().then(function() {
                JIM.login({
                    'username': _this.username,
                    'password': password
                }).onSuccess(function(data) {
                    uni.setStorage({
                        key: 'jim_login_username',
                        data: _this.username,
                        success(data) {
                            resolve(data)
                        }
                    })
                }).onFail(function(data) {
                    reject('JIM -登录失败' + JSON.stringify(data))
                });
            })
        } else {
            resolve('JIM-已经登录')
        }
    })
}

/**
 * 获取用户信息
 */
JJIM.prototype.getUserInfo = function() {
    let JIM = getJIM();
    let _this = this
    return new Promise((resolve, reject) => {
        let info = uni.getStorageSync('jim_login_userinfo')
        if (info) {
            resolve(info)
        } else {
            _this.init().then(function() {
                _this.login().then(function() {
                    JIM.getUserInfo({
                        'username': _this.username,
                        'appkey': _this.appkey
                    }).onSuccess(function(data) {
                        uni.setStorage({
                            key: 'jim_login_userinfo',
                            data: data,
                            success(data) {
                                resolve(data)
                            }
                        })
                    }).onFail(function(data) {
                        reject('JIM -获取信息失败' + JSON.stringify(data))
                    });
                }, function(error) {
                    resolve('JIM登录失败：' + error)
                })
            }, function(error) {
                resolve('JIM初始化失败：' + error)
            })
        }
    })
}

/**
 * 获取用户信息
 */
JJIM.prototype.getUserInfos = function(idd) {
    let JIM = getJIM();
    let _this = this
    return new Promise((resolve, reject) => {
        let info = uni.getStorageSync('jim_login_userinfo')
        if (info) {
            resolve(info)
        } else {
            _this.init().then(function() {
                _this.login().then(function() {
                    JIM.getUserInfo({
                        'username': idd,
                        'appkey': _this.appkey
                    }).onSuccess(function(data) {
                        uni.setStorage({
                            key: 'jim_login_userinfo',
                            data: data,
                            success(data) {
                                resolve(data)
                            }
                        })
                    }).onFail(function(data) {
                        reject('JIM -获取信息失败' + JSON.stringify(data))
                    });
                }, function(error) {
                    resolve('JIM登录失败：' + error)
                })
            }, function(error) {
                resolve('JIM初始化失败：' + error)
            })
        }
    })
}

/**
 * 获取会话列表
 */
JJIM.prototype.getConversation = function() {
    let _this = this;
    let nowtime = Time_now;
    let JIM = getJIM();
    return new Promise((resolve, reject) => {
        _this.init().then(function() {
            _this.login().then(function() {
                JIM.getConversation().onSuccess(function(data) {
                    // console.log('消息列表：')
                    //data.code 返回码
                    //data.message 描述
                    //data.conversations[] 会话列表，属性如下示例
                    //data.conversations[0].extras 附加字段
                    //data.conversations[0].unread_msg_count 消息未读数
                    //data.conversations[0].name  会话名称
                    //data.conversations[0].appkey  appkey(单聊)
                    //data.conversations[0].username  用户名(单聊)
                    //data.conversations[0].nickname  用户昵称(单聊)
                    //data.conversations[0].avatar  头像 media_id 
                    //data.conversations[0].mtime 会话最后的消息时间戳
                    //data.conversations[0].gid 群 id(群聊)
                    //data.conversations[0].type  会话类型(3 代表单聊会话类型，4 代表群聊会话类型)
                    let conversions = data.conversations.reverse()
                    for (var i = 0; i < conversions.length; i++) {
                        conversions[i].time = get_message_time(nowtime, data.conversations[
                            i].mtime)
                        conversions[i].msg_text = ''
                    }
                    resolve(conversions)
                }).onFail(function(data) {
                    resolve('JIM-获取会话列表失败：' + JSON.stringify(error))
                });
            }, function(error) {
                resolve('JIM登录失败：' + error)
            })
        }, function(error) {
            resolve('JIM初始化失败：' + error)
        })
    })
}

/**
 * 获取历史消息
 */
JJIM.prototype.getHistory = function() {
    let _this = this
    let nowtime = Time_now;
    return new Promise((resolve, reject) => {
        let begin_time = getMathTime(-2 * 24 * 60 * 60 * 1000)
        let end_time = getMathTime(0)
        let url = 'https://report.im.jpush.cn/v2/users/' + _this.username +
            '/messages?count=1000&begin_time=' + begin_time + '&end_time=' + end_time
        let basic = 'ZjYwZDlkY2U3ZmQ2NDIxMTQ5MzQ1MDJlOjAwNDE3NzMxMWVhNmQyMjNlNjJmMTE5Zg==' //这个自己去算出来吧

        uni.request({
            url: url,
            header: {
                "Authorization": 'Basic ' + basic
            },
            method: 'GET',
            dataType: 'json',
            data: {},
            success(data) {
                for (var i = 0; i < data.data.messages.length; i++) {
                    data.data.messages[i].time = get_message_time(nowtime, data.data.messages[i].create_time)
                }
                resolve(data)
            },
            fail(data) {
                reject('加载历史数据失败:' + JSON.stringify(data))
            }
        })
    })
}

/**
 * 离线消息监听
 */
JJIM.prototype.onSyncConversation = function(callback) {
    let JIM = getJIM();
    let nowtime = Time_now;
    JIM.onSyncConversation(function(data) { //离线消息同步监听
        console.log('离线消息同步监听')
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].msgs.length; j++) {
                data[i].msgs[j].time = get_message_time(nowtime, data[i].msgs[j].content.create_time)
            }
        }
        uni.setStorageSync("__JJIM_CONVERSATION__", JSON.stringify(data));
        callback(data)
    });
}
/**
 * 已读消息
 */
JJIM.prototype.addSingleReceiptReport = function(datas, name) {
    let allData = uni.getStorageSync("__JJIM_CONVERSATION__")
    let JIM = getJIM();
    let _this = this;
    let listss = [];
    if (allData) {
        let data = JSON.parse(allData)
        console.log(data, datas)
        for (var i = 0; i < data.length; i++) {
            if (datas.username == data[i].from_username) {
                let sz = data[i].msgs.length - 1;
                for (var js = 0; js < sz; js++) {
                    listss.push(data[i].msgs[js].msg_id)
                }
            }
        }
    }
    console.log(listss)
    return new Promise((resolve, reject) => {
        if (listss.length > 0) {
            JIM.addSingleReceiptReport({
                'username': name,
                'msg_ids': listss,
                'Appkey': _this.appkey,
                'type':3
            }).onSuccess(function(data, msg_ids) {
                console.log(data)
                resolve(data)
            }).onFail(function(data) {
                reject(data)
            });
        } else {
            resolve('')
        }

    })
}
/**
 * 保存历史数据
 * @param {Object} list
 */
JJIM.prototype.saveMsgs = function(list, send, target_username) {
    let allData = uni.getStorageSync("__JJIM_CONVERSATION__")
    let nowtime = Time_now

    let _list = new Array();
    for (var i = 0; i < list.length; i++) {
        let _c = list[i]
        _c.time = get_message_time(nowtime, _c.content.create_time)
        _list.push(_c)
    }
    if (send) uni.$emit('msg_ol', _list)

    if (allData) {
        let data = JSON.parse(allData)
        for (var i = 0; i < _list.length; i++) {
            let _c = _list[i]
            var from_id = _c.content.from_id;
            if (target_username != '') {
                from_id = target_username;
            }

            for (var j = 0; j < data.length; j++) {
                if (from_id == data[j]['from_username']) {
                    data[j]['msgs'].push(_list[i])
                    break
                }
            }
        }
        uni.setStorageSync("__JJIM_CONVERSATION__", JSON.stringify(data));
        uni.$emit('msg_ols', data)
    }

}
/**
 * 获取聊天数据
 * @param {Object} username
 */
JJIM.prototype.getMsgs = function(username) {
    let allData = uni.getStorageSync("__JJIM_CONVERSATION__")
    if (allData) {
        let data = JSON.parse(allData)
        for (var i = 0; i < data.length; i++) {
            if (data[i].from_username == username) {
                return data[i].msgs
            }
        }
    }
}

/**
 * 获取资源地址
 * @param {Object} media_id
 */
JJIM.prototype.getResurce = function(media_id, index) {
    let _this = this
    let JIM = getJIM();
    return new Promise((resolve, reject) => {
        if (media_id.substr(0, 4) != 'http') {
            JIM.getResource({
                'media_id': media_id,
            }).onSuccess(function(data) {
                let obj = {
                    url: data.url,
                    index: index
                }
                resolve(obj)
            }).onFail(function(data) {
                reject(data.message)
            });
        } else resolve(media_id)
    })
}

JJIM.prototype.getUsername = function() {
    return this.username
}

function objectURLToBlob(url, callback) {
    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.responseType = "blob";
    http.onload = function(e) {
        if (this.status == 200 || this.status === 0) {
            callback(this.response)
        }
    };
    http.send()
};
JJIM.prototype.sendPic = function(target_username, target_nickname, img, imgname) {
    let _this = this
    let JIM = getJIM()
    let nowtime = Time_now
    let imgnm = imgname
    return new Promise((resolve, reject) => {
        objectURLToBlob(img, function(blob) {
            let files = new File([blob], 'quickx.png', {type: 'image/png'})
            var fd = new FormData();
            fd.append('file', files);
            _this.init().then(function() {
                _this.login().then(function() {
                    JIM.sendSinglePic({
                        'target_username': target_username,
                        'target_nickname': target_nickname,
                        'appkey': _this.appkey,
                        'image': fd,
                        'nead_receipt': true,
                    }).onSuccess(function(data, msg) {
                        console.log(data)
                        if (data.code == 0) {
                            //发送成功了
                            msg.time = get_message_time(nowtime, msg.content
                                .create_time)

                            var _list = new Array(msg)
                            _this.saveMsgs(_list, false, target_username)

                            resolve(msg)
                        } else {
                            reject('发送失败' + JSON.stringify(data))
                        }
                    }).onFail(function(data) {
                        reject('发送失败' + JSON.stringify(data))
                    })
                })
            })
        })
    })
}


JJIM.prototype.sendMsg = function(target_username, target_nickname, content) {
    let _this = this
    let JIM = getJIM()
    let nowtime = Time_now
    return new Promise((resolve, reject) => {
        _this.init().then(function() {
            _this.login().then(function() {
                JIM.sendSingleMsg({
                    'target_username': target_username,
                    'target_nickname': target_nickname,
                    'content': content,
                    'appkey': _this.appkey
                }).onSuccess(function(data, msg) {
                    if (data.code == 0) {
                        //发送成功了
                        // console.log(msg)
                        msg.time = get_message_time(nowtime, msg.content.create_time)

                        var _list = new Array(msg)
                        _this.saveMsgs(_list, false, target_username)

                        resolve(msg)
                    } else {
                        reject('发送失败' + JSON.stringify(data))
                    }
                }).onFail(function(data) {
                    reject('发送失败' + JSON.stringify(data))
                });
            })
        })
    })
}

export class JjimWidget {
    install(Vue) {
        Vue.prototype.$jjim = new JJIM();
    }
}

export {
    JJIM,

};


/**
 * @param {Object} mtime
 */
function get_message_time(nowtime, mtime) {
    let _this = this;

    if (mtime.toString().length == 10) {
        mtime = mtime * 1000
    }
    var date = new Date(mtime);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + '';
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    if (Y == nowtime.Y && M == nowtime.M && D == nowtime.D) {
        return h + m;
    } else {
        return M + D + h + m;
    }
}

/**
 * 当前时间
 */
function times_now() {
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());

    Time_now.Date = date;
    Time_now.Y = Y;
    Time_now.M = M;
    Time_now.D = D;
    Time_now.h = h;
    Time_now.m = m;
    Time_now.s = s;
}

/**
 * 获取时间
 */
function getMathTime(exit_time) {
    let _this = this;
    var now_time = Date.now();

    var mtime = now_time + exit_time;
    if (mtime.toString().length == 10) {
        mtime = mtime * 1000
    }
    var date = new Date(mtime);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + '';
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return Y + M + D + h + m + ':' + s;
}
