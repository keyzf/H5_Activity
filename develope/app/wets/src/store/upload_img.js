function uploadimg(path) {
    if (path == undefined || path == "") {
        uni.showToast({
            title: '上传失败请重新上传',
            icon: 'none'
        })
        return false;
    }
    const promise = new Promise((resolve, reject) => {
        uni.showLoading({
            title: '上传中..'
        });
        uni.uploadFile({
            url: 'http://api.holdsoft.cn/mall/wxservicenumber/getPicUrl',
            filePath: path,
            name: 'file',
            //header :  {'Content-Type': 'multipart/form-data'},
            success: (uploadFileRes) => {
                console.log(uploadFileRes);
                let json_res = JSON.parse(uploadFileRes.data)
                if(json_res.code != 0){
                   uni.showToast({
                       title: "文件大小不能大于1MB",
                       icon: 'none'
                   }) 
                  reject("文件大小不能大于1MB");
                }          
                uni.hideLoading();
                let img_url = json_res.result.data.url;
                resolve(img_url)
            },
            fail: (err) => {
                reject(err);
                uni.hideLoading();
                reject(err)
                uni.showToast({
                    title: '上传失败请重新上传',
                    icon: 'none'
                })
            }
        });
    });
    return promise
}
export default {
    uploadimg: uploadimg
}
