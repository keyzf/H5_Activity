
var lid;
var guid;
var signupGroup = 1;
var pageSize = 5;
var moreMark = true;

import {initBridge, mregisterHandler,mcallHandler}   from '../public/bridge.js'

$(function () {
    initBridge(function (data) {
        // alert(data);
        guid = JSON.parse(data).guid;
        if (isEmpty(guid)){
            guid = data.guid;
        }
        getTopdata();
        earninglist();
    });
});

function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == ""){
        return true;
    }else{
        return false;
    }
}


$(window).scroll(function() {
    var scrollTop = $(window).scrollTop();
    var scrollHeight = $(window).height();
    var totalHeight = $(document).height();
    if ((scrollTop + scrollHeight + 50) > totalHeight && moreMark) {
        console.log("加载更多")
        lid = $(".list .item").last().attr("data-id");
        console.log("======lid:"+lid);
        earninglist();
    }
})

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
    // alert("点击分享")
    mcallHandler("CallNative", {
        'key': 'sharegetredpackage'
    })
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

// $(document).on("click", ".search .btn", function () {
//     lastId = "";
//     keyword = $(".search-text").val();
//     $(".store-list").empty();
//     searchShop();
// });

/**
 * 获取顶部数据
 */
function getTopdata() {

    $.ajax({
        type: "GET",
        url: "http://114.115.217.252:8001/HighMallServer/redpacket/redpacketshare",
        data: {
            // "guid": '9b3d1f32cb3c45cdba1d0800c38bc582',
            "guid": guid,
        },
        success: function (result) {
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
        },
        error: function (status) {
            console.log(status);
        }
    });
}

/**
 * 获取收益记录列表数据
 */
function earninglist() {
    if (moreMark) {
        moreMark = false;
        $("#more").show();
        $.ajax({
            type: "GET",
            url: "http://114.115.217.252:8001/HighMallServer/redpacket/incomeRecord",
            data: {
                "lid": lid,
                // "guid": '9b3d1f32cb3c45cdba1d0800c38bc582',
                "guid": guid,
                "pagesize": pageSize,
            },
            success: function (result) {
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
            },
            error: function (status) {
                console.log(status);
            }
        });
    }
}

/**
 * 获取我的邀请列表数据
 */
function myinviteRecordlist() {
    if (moreMark) {
        moreMark = false;
        $("#more").show();
        $.ajax({
            type: "GET",
            url: "http://114.115.217.252:8001/HighMallServer/redpacket/inviteRecord",
            data: {
                "lid": lid,
                // "guid": '9b3d1f32cb3c45cdba1d0800c38bc582',
                "guid": guid,
                "pagesize": pageSize,
            },
            success: function (result) {
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
                            _clone.find("img").attr("src", shoplist[i].headUrl);
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
            },
            error: function (status) {
                console.log(status);
            }
        });
    }
}

/**
 * 获取收益记录列表数据
 */
function inviteRecordlist() {
    if (moreMark) {
        moreMark = false;
        $("#more").show();
        $.ajax({
            type: "GET",
            url: "http://114.115.217.252:8001/HighMallServer/redpacket/inviteRank",
            data: {
                "lid": lid,
                // "guid": '9b3d1f32cb3c45cdba1d0800c38bc582',
                "guid": guid,
                "pagesize": pageSize,
            },
            success: function (result) {
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
                            _clone.find("img").attr("src", shoplist[i].headUrl);
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
            },
            error: function (status) {
                console.log(status);
            }
        });
    }
}
