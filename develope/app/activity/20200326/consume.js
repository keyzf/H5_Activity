var lid;
var signupGroup = 1;
var pageSize = 10;
var moreMark = true;
var domheight;
$(window).scroll(function () {
    var scrollTop = $(window).scrollTop();
    var scrollHeight = $(window).height();
    var totalHeight = $(document).height();
    if ((scrollTop + scrollHeight + 50) > totalHeight && moreMark) {
        lid = $(".list .item").last().attr("data-id");
        console.log("======lid:" + lid);
        rankinglist();
        // 	if (signupGroup === "1") {
        //         earninglist();
        //     } else if (signupGroup === "2") {
        //         myinviteRecordlist();
        //     } else if (signupGroup === "3") {
        //         inviteRecordlist();
        //     }
    }
});

// $(function(){
// 	alert('1111');
// })

//获取完 guid后的回调
/**
 * 切换tab
 */
/**
 * 分享
 */
// $(document).on("click", ".btn", function () {
//     shareFun()
// })

function guidCallback() {
    //do something
    getTopdata(); //页面信息
    rankinglist();//第一个列表的数据

};

// $(document).on("click", ".navigation div", function () {
//     if (!$(this).hasClass("x")) {
//         $(this).siblings().removeClass("x");
//         $(this).addClass("x");
//         lid = "";
//         moreMark = true;
//         signupGroup = $(this).attr("data-id");
//
//         $(".search-text").val("");
//         $(".store-list").empty();
//         $(".empty").hide();
//         $(".list").empty();
//
//         if (signupGroup === "1") {
//             console.log(signupGroup)
//             earninglist();
//         } else if (signupGroup === "2") {
//             console.log(signupGroup)
//             myinviteRecordlist();
//         } else if (signupGroup === "3") {
//             console.log(signupGroup)
//             inviteRecordlist();
//         }
//
//     }
// });

/**
 * 返回
 */
$(document).on("click", ".icon .icon_left", function () {
    console.log("返回");
    mcallHandler("CallNative", {'key': 'back'})
})

/**
 * 弹窗
 */
$(document).on("click", ".icon .iocn_right", function () {
    console.log("点击显示弹窗");
    // $(location).attr('href', "../20200319/share_activity.html");
    // $(window).attr('location', "../20200319/share_activity.html");
    // $(location).prop('href', "../20200319/share_activity.html");
    // window.location.href = "../20200319/share_activity.html";
    // var a = document.createElement('a');
    // a.href = "../20200319/share_activity.html";
    // a.target = '_blank';
    // a.id=myid;
    // document.body.appendChild(a);
    // var alink = document.getElementById(myid);
    // alink.click();
    // alink.parentNode.removeChild(a);

    // window.location.href="../20200319/share_activity.html";

    $(".pupwindow").show();
    $(".mask").show();
    domheight = $(window).scrollTop();
    $("body").addClass("x");
    $("body").attr("style","margin-top:-"+domheight + "px");

    // scrControl(0);   margin-top: 500px;
})
/**
 * 关闭弹窗
 */
$(document).on("click", ".pupwindow .close", function () {
    console.log("点击关闭弹窗");
    $(".pupwindow").hide();
    $(".mask").hide();
    $("body").attr("style","");
    $("body").removeClass("x");
    $(window).scrollTop(domheight);
    // scrControl(1);
})

function bodyScroll(event){
    event.preventDefault();
    // event.stopPropagation();
}

function scrControl(t){
    console.log('------------t:'+t);
    if(t == 0){ //禁止滚动
        document.body.addEventListener('touchmove', this.bodyScroll, { passive: false });
        // document.getElementById(contentall).addEventListener('touchmove', this.bodyScroll, { passive: false });
        // document.getElementById("#pupw").removeEventListener('touchmove', this.bodyScroll, { passive: false });
    }else if( t == 1){ //开启滚动
        document.body.removeEventListener('touchmove',this.bodyScroll, {passive: false});
        // document.getElementById(contentall).removeEventListener('touchmove',this.bodyScroll, {passive: false});
        // document.getElementById("pupw").removeEventListener('touchmove', this.bodyScroll, { passive: false });
    }
}

/**
 * 获取顶部数据
 */
function getTopdata() {
    let paramjson = {
        "guid": guid,
    }//HighMallServer
    publicAjax("rank/consumeRank", paramjson, "GET").then(function (result) {
        console.log(result);
        if (result.code == 0) {
            var data = result.result.data;
            var prize = data.prize;

            $(".main .title").attr("src", data.titleImage);
            $(".main .text").text(data.titleText);
            $(".main .update").text(data.updateText);
            $(".pupwindow .content").append(data.instruction.replace(/\n/g, '<br/>'));
            $(".mybg .my .mynumber .tips").text(data.myInfo.rank);
            if (data.myInfo.changeFlag === '1') {
                $(".mybg .my .mynumber .rankchange").addClass("x");
                $(".mybg .my .mynumber .rankchange").text(data.myInfo.changeNumber);
            } else if (data.myInfo.changeFlag === '-1') {
                $(".mybg .my .mynumber .rankchange").addClass("xx");
                $(".mybg .my .mynumber .rankchange").text(data.myInfo.changeNumber);
            } else if (data.myInfo.changeFlag === '0') {
                $(".mybg .my .mynumber .rankchange").addClass("xxx");
                $(".mybg .my .mynumber .rankchange").text("-");
            }
            $(".mybg .my .progress .circle").text(data.myInfo.consume);
            $(".mybg .my .progress .z_tips").text(data.myInfo.consumeText);

            if (prize == undefined || prize.length < 1) {
                $(".ystable").hide();
                $(".prizeexplain").hide();
            } else {
                $(".ystable").show();
                $(".prizeexplain").show();
                let $table = $(".ystable .table");
                let html = "<tr><td>排名</td><td>奖励</td></tr>";
                for (let i = 0; i < prize.length; i++) {
                    html += "<tr><td>" + prize[i].title + "</td><td>" + prize[i].content + "</td></tr>"
                }
                $table.html(html);
            }
        }
    })
}

/**
 * 获取收益记录列表数据
 */
function rankinglist() {
    if (moreMark) {
        moreMark = false;
        $("#more").show();
        let paramjson = {
            "lid": lid,
            // "guid": '9b3d1f32cb3c45cdba1d0800c38bc582',
            "guid": guid,
            "pagesize": pageSize,
        }//HighMallServer
        publicAjax("rank/consumeRankList", paramjson, "GET").then(function (result) {
            $("#more").hide();
            console.log(result);
            if (result.code == 0) {
                var shoplist = result.result.data.rankList;
                console.log(shoplist);
                if (shoplist.length > 0) {
                    var _template = $($("#template").html());
                    for (var i = 0; i < shoplist.length; i++) {
                        var _clone = _template.clone();
                        let rank = shoplist[i].rank;
                        if (rank === 1) {
                            _clone.find(".consume").show();
                            _clone.find(".number").hide();
                            _clone.find(".consume").attr("src", "img/1.png");
                        } else if (rank === 2) {
                            _clone.find(".consume").show();
                            _clone.find(".number").hide();
                            _clone.find(".consume").attr("src", "img/2.png");
                        } else if (rank === 3) {
                            _clone.find(".consume").show();
                            _clone.find(".number").hide();
                            _clone.find(".consume").attr("src", "img/3.png");
                        } else {
                            _clone.find(".consume").hide();
                            _clone.find(".number").show();
                            _clone.find(".number").append(rank);
                            if (rank % 3 === 1) {
                                _clone.find(".number").addClass('red');
                            } else if (rank % 3 === 2) {
                                _clone.find(".number").addClass('green');
                            } else if (rank % 3 === 0) {
                                _clone.find(".number").addClass('blue');
                            }
                        }
                        _clone.attr("data-id", shoplist[i].rank)
                        _clone.find(".headicon").attr("src", shoplist[i].headUrl);
                        _clone.find(".name").append(shoplist[i].name);

                        if (shoplist[i].isself === 1) {//是否是自己
                            _clone.addClass('x')
                        }
                        if (shoplist[i].changeFlag === "1") {//名次上升
                            _clone.find(".tip").append(shoplist[i].changeNumber);
                            _clone.find(".tip").addClass('xxx')
                        } else if (shoplist[i].changeFlag === "-1") {//名次下降
                            _clone.find(".tip").append(shoplist[i].changeNumber);
                            _clone.find(".tip").addClass('x');
                        } else if (shoplist[i].changeFlag === "0") {//名次没有变化
                            _clone.find(".tip").append('-');
                            _clone.find(".tip").addClass('xx')
                        }
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
                if (shoplist.length < 9) {
                    $("#noMore").hide();
                }
            }
        })
    }
}

