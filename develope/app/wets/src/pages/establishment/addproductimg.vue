<template>
    <div class="image-choose">
        <div class="scroll-wrap">
            <scroll-view class="scroll-view" :scroll-y="hasScroll">
                <div class="tips-text">长按图片，可拖动排序</div>
                <div class="image-back-list" :data-delete="hasDelectAction">
                    <block v-for="(item, idx) in imageList" :key="idx">
                        <div class="image-back-item" :style="{
								top: item.viewRect.top + 'px',
								left: item.viewRect.left + 'px',
								width: item.viewRect.width + 'px',
								height: item.viewRect.height + 'px'
							}"></div>
                    </block>
                </div>
                <div class="image-drag-list" :data-drag="hasDragAction" :data-delete="hasDelectAction">
                    <div class="image-drag-item" v-for="(item, idx) in imageList" :key="idx">
                        <div class="image-drag-view" :class="item.class" :data-idx="idx" @touchstart="onTouchStart"
                            @touchmove="onTouchMove" @touchend="onTouchEnd" @click="onPreviewImage(item.url)">
                            <div class="image-drag-title" v-if="idx === 0">首图</div>
                            <div class="image-drag-delete" @click.stop="onDelete(idx)"></div>
                        </div>
                    </div>
                    <div class="image-drag-button" v-if="hasAddButton">
                        <div class="image-drag-view" @click="fSelect">
                            <div class="icon"></div>
                            <div class="desc">选择图片</div>
                        </div>
                    </div>

                    <!-- <div class="image-drag-button" v-if="hasAddButton">
                        <div class="image-drag-view" @click="onChooseImage">
                            <div class="icon"></div>
                            <div class="desc">选择图片</div>
                        </div>
                    </div> -->
                </div>
                <div class="image-view-list">
                    <block v-for="(item, idx) in imageList" :key="idx">
                        <div class="image-view-item" :class="[{ draging: item.hasDrag }, { actioning: item.hasAction }, { deleteing: item.hasDelete }]"
                            :style="{
								top: item.viewRect.top + 'px',
								left: item.viewRect.left + 'px',
								width: item.viewRect.width + 'px',
								height: item.viewRect.height + 'px',
								transform: 'translate3d(' + item.touchX + 'px,' + item.touchY + 'px,0)'
							}"
                            :data-animate="item.hasAnimate">
                            <div class="image-view-move" :style="{
									backgroundImage: 'url(' + item.url + ')',
									transform: 'scale3d(' + item.scale + ',' + item.scale + ',1)'
								}"></div>
                        </div>
                    </block>
                </div>
            </scroll-view>
        </div>
        <div class="fixed-button" @click="onConfirm">完成</div>
        <view class="footer">
            <text class="submit ash" @click="onConfirm">上一步</text>
            <text class="submit" @click="addShopProductStep2">下一步</text>
        </view>
        <view>
            <!-- <canvas canvas-id="avatar-canvas" id="avatar-canvas" class="my-canvas" :style="{ top: styleTop, height: cvsStyleHeight }"
                disable-scroll="false"></canvas>
            截取边框 
            <canvas canvas-id="oper-canvas" id="oper-canvas" class="oper-canvas" :style="{ top: styleTop, height: cvsStyleHeight }"
                disable-scroll="false" @touchstart="fStart" @touchmove="fMove" @touchend="fEnd"></canvas>
            <view class="oper-wrapper" :style="{ display: styleDisplay }">
                <view class="btn-wrapper" v-if="showOper">
                    <view @click="fClose" hover-class="hover">取消</view>
                    <view @click="fUpload" hover-class="hover">选取</view>
                </view>
            </view> -->
            <image-cropper :src="tempFilePath" @confirm="confirm" :cut_scale='1' @cancel="cancel" :cropFixed="true"></image-cropper>
        </view>
    </div>
</template>
<script>
    import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
    export default {
        components: {
            ImageCropper
        },
        data() {
            return {
                up_ok:'',
                tempFilePath: '', //图
                imageList: [],
                //最大选择数量
                maxCount: 9,
                //是否可以滚动
                hasScroll: true,
                //当前是否正在进行拖拽排序操作
                hasDragAction: false,
                //当前是否正在进行删除操作
                hasDelectAction: false,
                selWidth: '660rpx', //截图的宽
                selHeight: '660rpx', //截图的高
                quality: '0.3'
            };
        },
        computed: {
            //是否显示选择图片按钮
            hasAddButton() {
                return this.imageList.length < this.maxCount;
            }
        },
        onLoad(param) {
            this.isSave = param.isSave;
            this.pid = param.pid;
            this.name = param.name;
            this.downPos = null;
            this.scrollTop = 0;
            this.increment = 0;
            if(this.isSave == "add_img_tm"){
              this.product_img_edit();  
              return;
            }
            if (this.globalData.ImagePathList) {
                this.initImageData(this.globalData.ImagePathList);
                this.globalData.ImagePathList = null;
            }
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        onBackPress(){
            this.$api.ovPage()
        },
        methods: {
            fSelect() {
                if (this.fSelecting) return;
                this.fSelecting = true;
                setTimeout(() => {
                    this.fSelecting = false;
                }, 500);

                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['camera', 'album'],
                    success: r => {
                        let path = (this.imgPath = r.tempFilePaths[0]);
                        this.tempFilePath = path;
                    }
                });
            },
            
            confirm(e) {
                this.tempFilePath = ''
                this.cropFilePath = e.detail.tempFilePath
                //上传图片
                this.uploadimg_axios(this.cropFilePath, this.getUuid())
                
            },
            //裁剪失败
            cancel() {
                this.tempFilePath = "";
                this.up_ok = 'no';
            },
            getUuid() {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                var uuid = s.join("");
                return uuid;
            },
            //base64转file  
            dataURLtoFile(dataurl, filename) { //将base64转换为文件
                var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, {
                    type: mime
                });
            },
            uploadimg_axios(base64, fileName) {
                var file_img = this.dataURLtoFile(base64, fileName);
                let formData = new FormData();
                formData.append('file', file_img);
                uni.showLoading({
                    title: '上传中..'
                });
                this.$axios.post("http://api.holdsoft.cn/mall/wxservicenumber/getPicUrl", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {       
                    if(res.data.code != 0){
                       uni.showToast({
                           title: "文件大小不能大于1MB",
                           icon: 'none'
                       }) 
                       return;
                    } 
                    uni.hideLoading();
                    let k = [];
                    k.push({
                        path: base64,
                        url: res.data.result.data.url
                    });
                    this.initImageData(k);
                }).catch((res_err) => {
                    uni.hideLoading();
                })
            },
            
            //初始化图片数据
            initImageData(list) {
                list = list.map(path => {
                    let data = {
                        index: this.imageList.length,
                        //当前元素的缩放值
                        scale: 1,
                        //当前元素的坐标值
                        touchX: 0,
                        touchY: 0,
                        //当前元素的临时矩形盒子
                        tempRect: {
                            top: 0,
                            left: 0,
                            width: 0,
                            height: 0
                        },
                        //当前元素的真实矩形盒子
                        viewRect: {
                            top: 0,
                            left: 0,
                            width: 0,
                            height: 0
                        },
                        path: path.path,
                        tempPath: path.path,
                        url: path.url,
                        hasDrag: 0,
                        hasDelete: 0,
                        hasAnimate: -1,
                        class: `item${this.increment}`
                    };
                    this.increment++;
                    this.imageList.push(data);
                    return data;
                });
                console.log("list");
                console.log(list);
                this.$nextTick(() => {
                    list.forEach((item, idx) => {
                        this.getRectBox(item);
                    });
                });
            },
            //交换两个元素的显示数据
            swopViewData(data1, data2) {
                //交换下标
                let index = data1.index;
                data1.index = data2.index;
                data2.index = index;
                //交换显示大小
                data1.scale = data2.tempRect.width / data1.viewRect.width;
                data2.scale = data1.tempRect.width / data2.viewRect.width;
                //交换显示位置
                data1.touchX = data2.tempRect.left - data1.viewRect.left;
                data1.touchY = data2.tempRect.top - data1.viewRect.top;
                data2.touchX = data1.tempRect.left - data2.viewRect.left;
                data2.touchY = data1.tempRect.top - data2.viewRect.top;
                //交换矩形盒子
                let tempRect = data1.tempRect;
                data1.tempRect = data2.tempRect;
                data2.tempRect = tempRect;

                if (data1.scale !== 1) {
                    data1.touchX = data1.touchX + data1.tempRect.width / 2 - data1.viewRect.width / 2;
                    data1.touchY = data1.touchY + data1.tempRect.height / 2 - data1.viewRect.height / 2;
                }
            },
            //应用当前排序
            useCurrentSort() {
                let list = [];
                this.imageList.forEach(item => {
                    item.scale = 1;
                    item.touchX = 0;
                    item.touchY = 0;
                    item.hasAnimate = 0;
                    item.viewRect.top = item.tempRect.top;
                    item.viewRect.left = item.tempRect.left;
                    item.viewRect.width = item.tempRect.width;
                    item.viewRect.height = item.tempRect.height;
                    list[item.index] = item;
                });
                this.imageList = list;
            },
            //获取元素的矩形盒子
            getRectBox(data) {
                uni.createSelectorQuery()
                    .select(`.${data.class}`)
                    .boundingClientRect()
                    .exec(res => {
                        if (res[0]) {
                            data.tempRect = {
                                top: res[0].top,
                                left: res[0].left,
                                width: res[0].width,
                                height: res[0].height
                            };
                            data.viewRect = Object.assign({}, data.tempRect);
                        } else {
                            //如果获取失败，延迟到下次 DOM 更新循环之后再次获取
                            this.$nextTick(() => {
                                this.getRectBox(data);
                            });
                        }
                    });
            },
            //获取滚动位置
            getScrollTop() {
                return new Promise((resolve, reject) => {
                    uni.createSelectorQuery()
                        .select('.scroll-view')
                        .scrollOffset()
                        .exec(res => {
                            resolve(res[0].scrollTop);
                        });
                });
            },
            //点击删除按钮时触发
            onDelete(idx) {
                let data = this.imageList[idx];
                let length = this.imageList.length;

                data.hasDelete = 1;
                data.hasAnimate = 0;
                this.hasDelectAction = 1;

                //如果当前元素不是最后一个，则把当前元素及其后面的元素逐一与前一个元素交换位置
                if (idx < length) {
                    for (let i = idx + 1; i < length; i++) {
                        this.imageList[i].hasAnimate = 1;
                        this.swopViewData(this.imageList[i], data);
                    }
                }
                setTimeout(() => {
                    this.hasDelectAction = 0;
                    this.imageList.splice(idx, 1);
                    this.useCurrentSort();
                }, 300);
            },
            //点击上一步按钮时触发
            onConfirm() {
                this.globalData.ImagePathList = this.imageList.map(item => item.path);
                 console.log("上一步")
                console.log(this.imageList)
                let ImagePathList = this.globalData.ImagePathList;
                uni.navigateBack();
            },
            //预览图片
            onPreviewImage(idx) {
                wx.previewImage({
                    urls: [idx]
                });
            },
            //选择图片
            onChooseImage() {
                let count = this.maxCount - this.imageList.length;
                wx.chooseImage({
                    count: count,
                    sizeType: ['compressed'],
                    success: res => {
                        if (res.tempFilePaths.length > count) {
                            res.tempFilePaths = res.tempFilePaths.slice(0, count);
                        }
                        this.initImageData(res.tempFilePaths);
                    }
                });
            },
            //拖拽操作处理
            onTouchStart(e) {
                if (this.downPos === null) {
                    let idx = e.currentTarget.dataset.idx;
                    let data = this.imageList[idx];
                    //获取当前滚动位置
                    this.getScrollTop().then(res => {
                        this.scrollTop = res;
                    });
                    //长按400ms后才可以拖拽
                    this.downTimer = setTimeout(() => {
                        //清除置顶样式
                        this.imageList.forEach(item => {
                            item.hasAction = 0;
                        });
                        let clientX = e.changedTouches[0].clientX;
                        let clientY = e.changedTouches[0].clientY + this.scrollTop;
                        data.hasDrag = 1;
                        data.hasAction = 1;
                        data.hasAnimate = 1;
                        data.touchX = clientX - data.viewRect.left - data.viewRect.width / 2;
                        data.touchY = clientY - data.viewRect.top - data.viewRect.height / 2;
                        this.downPos = {
                            touchX: data.touchX,
                            touchY: data.touchY,
                            clientX: clientX,
                            clientY: clientY
                        };
                        this.hasScroll = false;
                        this.hasDragAction = 1;
                        this.noPreviewImage = true;
                    }, 400);
                }
            },
            onTouchMove(e) {
                if (this.downPos !== null) {
                    let idx = Number(e.currentTarget.dataset.idx);
                    let data = this.imageList[idx];
                    let clientX = e.changedTouches[0].clientX;
                    let clientY = e.changedTouches[0].clientY + this.scrollTop;
                    //判断是否与其他容器相交
                    this.imageList.every((item, index) => {
                        if (index !== idx) {
                            let top = item.tempRect.top,
                                left = item.tempRect.left,
                                width = item.tempRect.width,
                                height = item.tempRect.height;

                            if (top <= clientY && left <= clientX && top + height >= clientY && left + width >=
                                clientX) {
                                item.hasAnimate = 1;

                                this.swopViewData(item, data);

                                return false;
                            }
                        }
                        return true;
                    });
                    data.touchX = clientX - this.downPos.clientX + this.downPos.touchX;
                    data.touchY = clientY - this.downPos.clientY + this.downPos.touchY;
                    data.hasAnimate = 2;
                }
                clearTimeout(this.downTimer);
            },
            onTouchEnd(e) {
                if (this.downPos !== null) {
                    if (window) {
                        event.preventDefault();
                    }
                    let idx = e.currentTarget.dataset.idx;
                    let data = this.imageList[idx];
                    this.downPos = null;
                    this.hasDragAction = 0;

                    let other = this.imageList[data.index];
                    data.touchX = other.viewRect.left - data.viewRect.left;
                    data.touchY = other.viewRect.top - data.viewRect.top;
                    data.hasDrag = 0;
                    data.hasAnimate = 1;

                    if (data.scale !== 1) {
                        data.touchX = data.touchX + data.tempRect.width / 2 - data.viewRect.width / 2;
                        data.touchY = data.touchY + data.tempRect.height / 2 - data.viewRect.height / 2;
                    }

                    setTimeout(() => {
                        this.hasScroll = true;
                        this.useCurrentSort();
                        this.noPreviewImage = false;
                    }, 300);
                }
                clearTimeout(this.downTimer);
            },
            nextstep() {
                uni.navigateTo({
                    url: '/pages/establishment/addproducttype?pname=' + this.name + '&pid=' + this.pid
                });
            },
            //保存
            addShopProductStep2() {
                let this_save = this;

                let imgurlList = [];
                //模板添加时变量
                let img_tmp = [];
                for (let i = 0; i < this.imageList.length; i++) {
                    if(this.imageList[i].url != undefined && this.imageList[i].url != "" ){
                        imgurlList.push(this.imageList[i].url)
                        img_tmp.push({
                            value: this.imageList[i].url
                        })
                    }
                   

                }
                if (imgurlList.length == 0) {
                    this.$api.msg("请上传图片")
                    return;
                }
                console.log(img_tmp)
                let data = {
                    pid: this.pid,
                    picurls: imgurlList.toString(),
                    cguid: uni.getStorageSync("companyguid"),
                }
                if (this.isSave != undefined && this.isSave == "add_img_tm") {
                    this.$api.prePage().picurls = img_tmp;
                    
                    let imgTextList_str_add = this.$api.prePage().imgTextList_str;
                    if(imgTextList_str_add == ""){
                        imgTextList_str_add = "[]"
                    }
                    let imgTextList_str_json = JSON.parse(imgTextList_str_add);
                     for(let j = 0;j < img_tmp.length; j++){
                        let num = 0;
                        for (let i = 0;i < imgTextList_str_json.length; i++) {
                            if(img_tmp[j].value == imgTextList_str_json[i].value){
                                num++;
                            }        
                        }	
                        if(num == 0){
                            imgTextList_str_json.push({type:2,value:img_tmp[j].value})
                        } 
                    }
                    this.$api.prePage().imgTextList_str= JSON.stringify(imgTextList_str_json);
                    uni.navigateBack();
                    return;
                }
                this.$ajax.get('shopproduct/addShopProductStep2', data).then(res => {
                    if (res.data.code == 0) {
                        this.nextstep();
                    }
                });
            },
            product_img_edit() {
                //编辑时 图片显示
                //TODO 比较初始图片   以及上传后显示url
                let picList = this.$api.prePage().picurls;
                let picUrlList = [];
                for (let i = 0; i < picList.length; i++) {
                    if (picList[i].value != "") {
                        let imgs = {
                            path: '',
                            url: picList[i].value
                        }
                        picUrlList.push(imgs);
                    }
                }
                if (picUrlList.length > 0) {
                    this.initImageData(picUrlList);
                }
            },
        },
    };
</script>
<style lang="scss">
    .my-canvas {
        display: flex;
        position: fixed !important;
        background: #000000;
        left: 0;
        z-index: 100;
        width: 100%;
    }

    .my-avatar {
        width: 100vw;
        height: 100vw;
    }

    .oper-canvas {
        display: flex;
        position: fixed !important;
        left: 0;
        z-index: 101;
        width: 100%;
    }

    .oper-wrapper {
        height: 71px;
        position: fixed !important;
        box-sizing: border-box;
        width: 100%;
        left: 0;
        bottom: 0;
        z-index: 66666;
        flex-direction: row;
    }

    .btn-wrapper {
        background-color: #000000;
        color: #ffffff;
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: space-around;
        align-items: center;
    }

    .btn-wrapper view {
        width: 160rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 16px;
        color: #ffffff;
        z-index: 300;
    }

    .hover {
        color: #f1f1f1;
    }

    page {
        background: #fff;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        height: 100%;
        overflow: hidden;
    }

    .scroll-wrap {
        flex: 1;
        overflow: hidden;
    }

    .image-choose {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .image-choose scroll-view {
        height: 100%;
    }

    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 995;
        display: flex;
        align-items: center;
        width: 100%;
        height: 90upx;
        justify-content: space-between;
        font-size: 30upx;
        background-color: #fff;
        z-index: 998;
        color: $font-color-base;
        box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

        .submit {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #fff;
            font-size: 32upx;
            background-color: $base-color;

            &.ash {
                background-color: #fff;
                color: #333;
            }
        }
    }

    .image-choose .tips-text {
        background: #f5f5f5;
        font-size: 24upx;
        line-height: 32upx;
        padding: 8upx 24upx;
        color: #999;
        text-align: center;
    }

    .image-choose .draw-canvas {
        position: absolute;
        left: -9999px;
        top: -9999px;
        opacity: 0;
        pointer-events: none;
    }

    .image-choose .image-drag-list {
        padding: 12upx;
        display: flex;
        flex-wrap: wrap;
    }

    .image-choose .image-drag-item,
    .image-choose .image-drag-button {
        padding: 12upx;
        width: 33.3%;
        box-sizing: border-box;
    }

    .image-choose .image-drag-item {
        position: relative;
        z-index: 2;
        transition: opacity 0.2s;
    }

    .image-choose .image-drag-view {
        position: relative;
        height: 148upx;
        overflow: hidden;
    }

    .image-choose .image-drag-title {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-size: 24upx;
        text-align: center;
        padding: 8upx 0;
        transition: transform 0.2s;
    }

    .image-choose .image-drag-delete {
        position: absolute;
        top: 10upx;
        right: 10upx;
        width: 48upx;
        height: 48upx;
        line-height: 48upx;
        text-align: center;
        box-shadow: 0 0 0 1px #fff;
        border-radius: 50%;
        transition: opacity 0.2s;
        background-color: rgba(0, 0, 0, 0.5);
        background-repeat: no-repeat;
        background-size: 24upx;
        background-position: center;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQBAMAAAB8P++eAAAAJFBMVEUAAAD///////////////////////////////////////////+0CY3pAAAAC3RSTlMA79AQMCDgkLCvoD8B+9AAAAEpSURBVEjH3dYtjgJREEXhSWZmB6CQCASGINCwA1gDEsc2WAJLQDWCv9ocSZFwBHl1cCSUusmr/tRNp36+bP731+Vb76uIXrW4iOhn2EV08/be3yDikmkQSRZgdM9FSAYwThkPkWQBxjnjNJIswBhm/h0nWYDHSWbIEoQ0EFJASAMhBYQ0EFJASAMhBYQ0EFJASAMhBYQ0EFJASAMhBYRUEBJQSEAhAYUEFBJQSEAhAYUENDJBJQ2kh5RI/tiUSEBIASEFNJIejmuSYk9rkmJT9Rqk6gJSdQMhBYQUEFJASAMhBYQ0EFJASAMhBYQ0EFJASAMhBYQ0EFJAyBdQSEAhAYVcATZI7kdABpL7EbBBdhk3gA2S+zHBgrxlmgG2yPXjk+2oAHn/2NwBxsPd7gTHKkMAAAAASUVORK5CYII=);
    }

    .image-choose .image-drag-button .icon {
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center;
        width: 60upx;
        height: 60upx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAM1BMVEUAAADc3Nzc3Nzd3d3d3d3f39/c3Nzc3Nzf39/c3Nzd3d3d3d3f39/d3d3d3d3c3Nzd3d1FafhqAAAAEHRSTlMAwL+A8CCgYECw4HAQ349QlObi/gAAAKlJREFUWMPt2FsKhDAMheFWk/Ri1ex/tQNiIQ70yQxM4fwL+N4ChwQ0a7moluznJb1KXh7rHTuBWwc3J7B0UJzA2MEIECBAgAABApwS5GMZRh2kZdjB3/vqdcl6WR3KjznkUDHg7gHuBqweYDWgeIBiQKb3HnEwnfTay+FRS+uwqnd1HZbadLcMECBAgAABAvwJKB2Uf333NdIrasGpk/q+8oolRuGAJu0DPwFCZFV4aXcAAAAASUVORK5CYII=);
    }

    .image-choose .image-drag-button .desc {
        font-size: 24upx;
        color: #ccc;
        margin-top: 4upx;
    }

    .image-choose .image-drag-button .image-drag-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
    }

    .image-choose .image-view-list,
    .image-choose .image-back-list {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
    }

    .image-choose .image-view-item,
    .image-choose .image-back-item {
        position: absolute;
    }

    .image-choose .image-view-list {
        z-index: 1;
    }

    .image-choose .image-back-list {
        z-index: 0;
    }

    .image-choose .image-back-item {
        background: #f5f5f5;
    }

    .image-choose .image-view-move {
        width: 100%;
        height: 100%;
        background-position: 50%;
        background-size: cover;
        transition: transform 0.2s ease-in-out;
        will-change: transform;
    }

    .image-choose .image-drag-item:nth-child(1) {
        width: 100%;
    }

    .image-choose .image-drag-item:nth-child(1) .image-drag-view {
        height: 480upx;
    }

    .image-choose .image-drag-list[data-drag='1'] .image-drag-title {
        transform: translateY(100%);
    }

    .image-choose .image-drag-list[data-drag='1'] .image-drag-delete {
        opacity: 0;
    }

    .image-choose .image-drag-list[data-delete='1'] {
        pointer-events: none;
    }

    .image-choose .image-drag-list[data-delete='1'] .image-drag-item:nth-last-child(2) {
        display: none;
    }

    .image-choose .image-back-list[data-delete='1'] .image-back-item:last-child {
        display: none;
    }

    /*拖拽动画*/
    .image-choose .image-view-item.draging {
        opacity: 0.6;
    }

    .image-choose .image-view-item.actioning {
        z-index: 1;
    }

    .image-choose .image-view-item.deleteing {
        opacity: 0;
    }

    .image-choose .image-view-item[data-animate='0'] .image-view-move {
        transition: initial;
    }

    /*默认动画*/
    .image-choose .image-view-item[data-animate='1'] {
        transition: all 0.2s;
    }

    /*拖拽时的平滑过渡动画*/
    .image-choose .image-view-item[data-animate='2'] {
        transition: all 0.06s linear;
    }
</style>
