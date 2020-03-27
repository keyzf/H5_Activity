var lid;
var signupGroup = 1;
var pageSize =8;
var moreMark = true;


$(window).scroll(function() {
    var scrollTop = $(window).scrollTop();
    var scrollHeight = $(window).height();
    var totalHeight = $(document).height();
    if ((scrollTop + scrollHeight + 50) > totalHeight && moreMark) {
        console.log("加载更多")
            lid = $(".list .item").last().attr("data-id");
            console.log("======lid:"+lid);
			if (signupGroup === "1") {
                earninglist();
            } else if (signupGroup === "2") {
                myinviteRecordlist();
            } else if (signupGroup === "3") {
                inviteRecordlist();
            }
    }
})


//获取完 guid后的回调
function guidCallback(){
    //do something
    getTopdata(); //页面信息
    earninglist();//第一个列表的数据  
}

/**
 * 切换tab
 */
$(document).on("click", ".navigation div", function () {
    if (!$(this).hasClass("x")) {
        $(this).siblings().removeClass("x");
        $(this).addClass("x");
        lid = "";
        moreMark = true;
        signupGroup = $(this).attr("data-id");

        $(".search-text").val("");
        $(".store-list").empty();
        $(".empty").hide();
        $(".list").empty();

        if (signupGroup === "1") {
            console.log(signupGroup)
            earninglist();
        } else if (signupGroup === "2") {
            console.log(signupGroup)
            myinviteRecordlist();
        } else if (signupGroup === "3") {
            console.log(signupGroup)
            inviteRecordlist();
        }

    }
});

/**
 * 分享
 */
$(document).on("click", ".btn", function () {
    shareFun()
})

/**
 * 返回
 */
$(document).on("click", ".theme .back", function () {
    mcallHandler("CallNative", {'key': 'back'})
})

/**
 * 弹窗
 */
$(document).on("click", ".theme .tip", function () {
    console.log("点击显示弹窗");
    $(".pupwindow").show();
    $(".mask").show();
})

/**
 * 关闭弹窗
 */
$(document).on("click", ".pupwindow .close", function () {
    console.log("点击关闭弹窗");
    $(".pupwindow").hide();
    $(".mask").hide();
})

/**
 * 获取顶部数据
 */
function getTopdata() {
let paramjson = {
   "guid": guid,
}
    publicAjax("HighMallServer/redpacket/redpacketshare", paramjson,"GET").then(function(result){
         console.log(result)
        if (result.code == 0) {
            var data = result.result.data;
            console.log(data)
            $(".theme .bg").attr("src", data.backGroudImage);
            $(".theme .tips").attr("src", data.tipsImage);
            $(".pupwindow .content").append(data.redpacketrule.replace(/\n/g,'<br/>'));
            $(".translate .total .number").text(data.totalIncome);
            $(".translate .yesterday .number").text(data.ydayIncome);
        }
    })

}

/**
 * 获取收益记录列表数据
 */
function earninglist() {
    if (moreMark) {
        moreMark = false;
        $("#more").show();
        let paramjson = {
            "lid": lid,
            // "guid": '9b3d1f32cb3c45cdba1d0800c38bc582',
            "guid": guid,
            "pagesize": pageSize,
        }
        publicAjax("HighMallServer/redpacket/incomeRecord", paramjson,"GET").then(function(result){
               $("#more").hide();
            // console.log(result);
            if (result.code == 0) {
                $(".record .record_tip").text(result.result.data.headText);
                var shoplist = result.result.data.incomeList;
                if (shoplist.length > 0) {
                    var _template = $($("#template").html());
                    for (var i = 0; i < shoplist.length; i++) {
                        var _clone = _template.clone();
                        _clone.attr("data-id", shoplist[i].id)
                        _clone.find("img").attr("src", shoplist[i].headUrl);
                        _clone.find(".main .title").append(shoplist[i].title);
                        _clone.find(".main .tip").append(shoplist[i].listText);
                        _clone.find(".number").append(shoplist[i].amount);
                        $(".list").append(_clone);
                    }
                    if (shoplist.length == pageSize) {
                        moreMark = true;
                    } else {
                        moreMark = false;
                        $("#noMore").show();
                    }
                } else {
                    moreMark = false;
                    $("#noMore").show();
                }
            }
        })
    }
}

/**
 * 获取我的邀请列表数据
 */
function myinviteRecordlist() {
    if (moreMark) {
        moreMark = false;
        $("#more").show();
        
        let paramjson = {
            "lid": lid,
            // "guid": '9b3d1f32cb3c45cdba1d0800c38bc582',
            "guid": guid,
            "pagesize": pageSize,
        }
        publicAjax("HighMallServer/redpacket/inviteRecord", paramjson,"GET").then(function(result){
             $("#more").hide();
            // console.log(result);
            if (result.code == 0) {
                $(".record .record_tip").text(result.result.data.headText);
                var shoplist = result.result.data.inviteList;
                if (shoplist.length > 0) {
                    var _template = $($("#template").html());
                    for (var i = 0; i < shoplist.length; i++) {
                        var _clone = _template.clone();
                        _clone.attr("data-id", shoplist[i].id)
                        _clone.find("img").attr("src", shoplist[i].headurl);
                        _clone.find(".main .title").append(shoplist[i].name);
                        _clone.find(".main .tip").append(shoplist[i].tel);
                        _clone.find(".number").append(shoplist[i].createtime);
                        $(".list").append(_clone);
                    }
                    if (shoplist.length == pageSize) {
                        moreMark = true;
                    } else {
                        moreMark = false;
                        $("#noMore").show();
                    }
                } else {
                    moreMark = false;
                    $("#noMore").show();
                }
            }
        })
        
      
    }
}

/**
 * 获取邀请排行数据
 */
function inviteRecordlist() {
    if (moreMark) {
        moreMark = false;
        $("#more").show();
        let parajson = {
                "lid": lid,
                // "guid": '9b3d1f32cb3c45cdba1d0800c38bc582',
                "guid": guid,
                "pagesize": pageSize,
            }
        publicAjax("HighMallServer/redpacket/inviteRank", parajson,"GET").then(function(result){
                 $("#more").hide();
                // console.log(result);
                if (result.code == 0) {
                    $(".record .record_tip").text(result.result.data.headText);
                    var shoplist = result.result.data.rankList;
                    if (shoplist.length > 0) {
                        var _template = $($("#template").html());
                        for (var i = 0; i < shoplist.length; i++) {
                            var _clone = _template.clone();
                            _clone.attr("data-id", shoplist[i].id)
                            _clone.find("img").attr("src", shoplist[i].headurl);
                            _clone.find(".main .title").append(shoplist[i].tel);
                            // _clone.find(".main .tip").append(shoplist[i].listText);
                            _clone.find(".number").append(shoplist[i].peoplenumber);
                            $(".list").append(_clone);
                        }
                        if (shoplist.length == pageSize) {
                            moreMark = true;
                        } else {
                            moreMark = false;
                            $("#noMore").show();
                        }
                    } else {
                        moreMark = false;
                        $("#noMore").show();
                    }
                }
            
            
        })
 
    }
}

