<template>
    <view class="content">
        <view class="list-cell b-b">
            <text class="cell-tit">店铺LOGO</text>
            <view class="cell-more yticon icon-you"><image :src="shopInfo.logo || '/static/missing-face.png'" class="tximg yuan" @click="changeLogo"></image></view>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">店铺主图</text>
            <view class="cell-more yticon icon-you"><image :src="shopInfo.mainpicurl || '/static/missing-face.png'" class="tximg" @click="changeMain"></image></view>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">店铺名称</text>
            <input class="cell-more input" type="text" maxlength="10" placeholder="请输入店铺名称(建议少于10个字)" v-model="shopInfo.companyname" />
        </view>
        <view class="list-cell b-b clampov" @click="businessscopeshop">
            <text class="cell-tit">经营范围</text>
            <text class="cell-more yticon icon-you">{{ shopInfo.managescope }}</text>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">店铺简介</text>
            <textarea class="cell-more input" auto-height maxlength="30" placeholder="请填写店铺简介(建议少于30个字)" v-model="shopInfo.introduction" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">店铺类型</text>
            <text class="cell-more">{{ shopInfo.typename }}</text>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">店铺公告</text>
            <textarea class="cell-more input" auto-height maxlength="50" placeholder="请填写公告" v-model="shopInfo.notice" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">服务范围</text>
            <city class="cell-more yticon icon-you" :city="this.shopInfo.serviceArea.name" @change="onConfirm"></city>
        </view>
        <view class="list-cell b-b" @click="businesshoursshop">
            <text class="cell-tit">营业时间</text>
            <text class="cell-more yticon icon-you">{{ shopInfo.businesshours }}</text>
        </view>
        <view class="list-cell b-b" @click="mapshop">
            <text class="cell-tit">店铺位置</text>
            <text class="cell-more yticon icon-you">{{ shopInfo.companyAddress.address }}</text>
        </view>
        <view class="list-cell b-b" @click="positionshop">
            <text class="cell-tit">自提地址</text>
            <text class="cell-more yticon icon-you">{{ shopInfo.isSelfAddress == 0 ? '未设置' : '已设置' }}</text>
        </view>
        <view class="footer" @click="submit"><text class="submit">提交</text></view>
        <view>
            <!-- 上传图片裁剪 -->
            <image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel" :cut_scale="0.75" :cropHeight="300"></image-cropper>
        </view>
    </view>
</template>

<script>
var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
function bd09togcj02(bd_lon, bd_lat) {
    var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02tobd09(lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function wgs84togcj02(lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat];
    } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = (lat / 180.0) * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [mglng, mglat];
    }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02towgs84(lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat];
    } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = (lat / 180.0) * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
    }
}

function transformlat(lng, lat) {
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
    return ret;
}

function transformlng(lng, lat) {
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
    return ret;
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function out_of_china(lng, lat) {
    return lng < 72.004 || lng > 137.8347 || (lat < 0.8293 || lat > 55.8271 || false);
}
import BaiduMap from '@/store/baidu.js';
import city from '@/components/city/city';
import ImageCropper from '@/components/invinbg-image-cropper/invinbg-image-cropper.vue';
export default {
    components: {
        city,
        ImageCropper
    },
    data() {
        return {
            shopInfo: {
                areainfo: '',
                logo: '',
                mainpicurl: '',
                companyname: '',
                businessstate: '',
                typename: '',
                notice: '',
                companycategory: '',
                acceptreservation: '',
                managescope: '',
                introduction: '',
                serviceArea: {
                    area_id: 0,
                    name: ''
                },
                reservationhours: '',
                businesshours: '',
                companyusemealcard: '',
                companyAddress: {
                    address: '',
                    areainfo: '',
                    latitude: 0,
                    longtitude: 0
                },
                isSelfAddress: 0
            },
            tempFilePath: '', //图
            cropFilePath: '', //图
            up_ok: '', //图片上传状态
            list: []
        };
    },
    onLoad() {
        this.cguid = uni.getStorageSync('companyguid');
        this.$ajax.get('com/shopWindow', { cguid: this.cguid }).then(res => {
            if (res.data.code == 0) {
                let data = res.data.result.data;
                this.shopInfo.logo = data.logo;
                this.shopInfo.mainpicurl = data.mainpicurl;
                this.shopInfo.companyname = data.companyname;
                this.shopInfo.typename = data.typename;
                this.shopInfo.notice = data.notice;
                this.shopInfo.businessstate = data.businessstate;
                this.shopInfo.companycategory = data.companycategory;
                this.shopInfo.companyAddress.address = data.companyAddress.address;
                (this.shopInfo.companyAddress.longtitude = data.companyAddress.longtitude),
                    (this.shopInfo.companyAddress.latitude = data.companyAddress.latitude),
                    (this.shopInfo.companyusemealcard = data.companmyUseMealcardDict.isusemealcard),
                    (this.shopInfo.managescope = data.managescope);
                this.shopInfo.introduction = data.introduction;
                this.shopInfo.serviceArea.name = data.serviceArea.name;
                this.shopInfo.serviceArea.area_id = data.serviceArea.area_id;
                this.shopInfo.businesshours = data.businesshours;
                this.shopInfo.acceptreservation = data.acceptReservation.accept_reservation;
                this.shopInfo.areainfo = data.companyAddress.areainfo;
                this.shopInfo.isSelfAddress = data.isSelfAddress;
            } else {
                this.$api.msg('操作失败，请稍后重试');
            }
        });
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        onConfirm(e) {
            let areaId;
            e.areaId.forEach((item, index) => {
                if (item != -1) {
                    areaId = item;
                }
            });
            this.shopInfo.serviceArea.name = e.adress;
            this.shopInfo.serviceArea.area_id = areaId;
        },
        changeLogo() {
            if (this.$wx.isWechat()) {
                this.$wx.upload(1).then(res => {
                    let data = res.data.result.data;
                    if (res.data.code == 0) {
                        this.shopInfo.logo = data.url;
                    } else {
                        this.$api.msg('图片上传失败');
                    }
                });
            }
        },
        // changeMain(){
        // 	if (this.wxState) {
        // 		this.$wx.upload(1).then(res => {
        // 			let data = res.data.result.data;
        // 			if (res.data.code == 0) {
        // 				this.shopInfo.mainpicurl = data.url;
        // 			} else {
        // 				this.$api.msg('图片上传失败');
        // 			}
        // 		});
        // 	}
        // },
        changeMain() {
            if (this.up_ok == 'ing') {
                this.$api.msg('等待图片上传后再操作');
                return;
            }
            uni.chooseImage({
                count: 1, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], //从相册选择
                success: res => {
                    this.up_ok = 'ing';
                    this.tempFilePath = res.tempFilePaths.shift();
                }
            });
        },
        //裁剪成功
        confirm(e) {
            this.tempFilePath = '';
            this.cropFilePath = e.detail.tempFilePath;
            //上传图片
            this.$uploadImg
                .uploadimg(this.cropFilePath)
                .then(res => {
                    this.up_ok = 'ok';
                    this.shopInfo.mainpicurl = res;
                    this.$forceUpdate();
                })
                .catch(errorres => {
                    this.up_ok = 'no';
                });
        },
        //裁剪失败
        cancel() {
            this.up_ok = 'no';
            this.tempFilePath = '';
        },
        businessscopeshop() {
            uni.navigateTo({
                url: '/pages/establishment/businessscopeshop?managescope=' + this.shopInfo.managescope
            });
        },
        businesshoursshop() {
            uni.navigateTo({
                url: '/pages/establishment/businesshoursshop'
            });
        },
        /* 设置店铺位置 */
        mapshop() {
            let _this = this;
            uni.chooseLocation({
                success: function(res) {
                    // console.log('详细地址：' + res.address);
                    // console.log('纬度：' + res.latitude);
                    // console.log('经度：' + res.longitude);
                    let kk = gcj02tobd09(res.longitude, res.latitude);
                    BaiduMap.init().then(BMap => {
                        var myGeo = new BMap.Geocoder();
                        myGeo.getLocation(new BMap.Point(kk[0], kk[1]), function(result) {
                            if (result) {
                                let addres = '';
                                addres = result.addressComponents.province + ',' + result.addressComponents.city + ',' + result.addressComponents.district;
                                _this.shopInfo.companyAddress.address = res.address;
                                _this.shopInfo.areainfo = addres;
                                _this.shopInfo.companyAddress.latitude = kk[1];
                                _this.shopInfo.companyAddress.longtitude = kk[0];
                            }
                        });
                    });
                    
                }
            });
        },
        positionshop() {
            uni.navigateTo({
                url: '/pages/establishment/positionshop'
            });
        },
        submit() {
            if (this.check()) {
                uni.showLoading({
					mask : true,
                   title: '加载中...'
                })
                this.$ajax
                    .get('com/shopCard', {
                        cguid: this.cguid,
                        logo: this.shopInfo.logo,
                        mainpicurl: this.shopInfo.mainpicurl,
                        companyname: this.shopInfo.companyname,
                        introduction: this.shopInfo.introduction,
                        notice: this.shopInfo.notice,
                        businessstate: this.shopInfo.businessstate,
                        companycategory: this.shopInfo.companycategory,
                        districtid: this.shopInfo.serviceArea.area_id,
                        address: this.shopInfo.companyAddress.address,
                        longtitude: this.shopInfo.companyAddress.longtitude,
                        latitude: this.shopInfo.companyAddress.latitude,
                        companyusemealcard: this.shopInfo.companyusemealcard,
                        businesshours: this.shopInfo.businesshours,
                        reservationhours: this.shopInfo.reservationhours,
                        acceptreservation: this.shopInfo.acceptreservation,
                        areainfo: this.shopInfo.areainfo
                    })
                    .then(res => {
                        uni.hideLoading();
                        this.$api.msg(res.data.msg);
                        if (res.data.code == 0) {
                            this.$api.prePage().hasCompany();
                            uni.navigateBack();
                        }
                    });
            }
        },
        check() {
            let msg = '';
            let mark = true;
            if (mark && this.shopInfo.companyname == '') {
                msg = '店铺名称不能为空';
                mark = false;
            }
            if (mark && this.shopInfo.companyAddress.address == '') {
                msg = '店铺地址不能为空';
                mark = false;
            }
            if (!mark) {
                this.$api.msg(msg);
            }
            return mark;
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
    padding-bottom: 100rpx;
}
.yuan {
    border-radius: 50%;
}

.list-cell {
    display: flex;
    align-items: center;
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
        align-self: center;
        font-size: $font-lg;
        color: $font-color-light;
        margin-left: 10upx;
        flex-grow: 1;
        text-align: right;
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
        min-width: 160rpx;
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
        transform: translateX(16upx) scale(0.84);
    }
}
.clampov {
    justify-content: space-between;
    .cell-more {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 520rpx;
    }
}
</style>
