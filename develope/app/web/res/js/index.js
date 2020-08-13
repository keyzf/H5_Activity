var lastId = "";
var signupGroup = 1;
var pageSize = 6;
var keyword = "";

$(function() {
  var now = new Date();
  
  var startDate1 = new Date('2020-8-11 0:0:0');
  var startDate2 = new Date('2020-9-11 0:0:0');
  var startDate3 = new Date('2020-10-11 0:0:0');
  var startDate4 = new Date('2020-11-11 0:0:0');
  var lidow = $(".procedure-list .procedure-item")

  if (now < startDate1) {
    
  }else if(now < startDate2){
    lidow.eq(1).find('img').attr("src",'res/img/sxjs_2.png')
  }else if(now < startDate3){
    lidow.eq(1).find('img').attr("src",'res/img/sxjs_2.png')
    lidow.eq(2).find('img').attr("src",'res/img/sxjs_3.png')
  }else if(now < startDate4){
    lidow.eq(1).find('img').attr("src",'res/img/sxjs_2.png')
    lidow.eq(2).find('img').attr("src",'res/img/sxjs_3.png')
    lidow.eq(3).find('img').attr("src",'res/img/sxjs_4.png')
  }else{
    lidow.eq(1).find('img').attr("src",'res/img/sxjs_2.png')
    lidow.eq(2).find('img').attr("src",'res/img/sxjs_3.png')
    lidow.eq(3).find('img').attr("src",'res/img/sxjs_4.png')
    lidow.eq(4).find('img').attr("src",'res/img/sxjs_5.png')
  }
	searchShop();
});

$(document).on("click", ".tab span", function() {
	if (!$(this).hasClass("x")) {
		$(this).siblings().removeClass("x");
		$(this).addClass("x");
		lastId = "";
		signupGroup = $(this).attr("data-id");
		keyword = "";
		$(".search-text").val("");
		$(".store-list").empty();
		$(".empty").hide();
		searchShop();
	}
});

$(document).on("click", ".search .btn", function() {
	lastId = "";
	keyword = $(".search-text").val();
	$(".store-list").empty();
	searchShop();
});

$(document).on("click", ".more", function() {
	lastId = $(".store-list li").last().attr("data-id");
	searchShop();
});

function searchShop() {
	$(".empty").hide();
	$(".more").hide();
	$.ajax({
		type: "GET",
		url: "http://114.115.217.252:8001/HighMallServer/helppoorcompetition2019/searchCompanyList",
		data: {
			"lastId": lastId,
			"signupGroup": signupGroup,
			"pageSize": pageSize,
			"keyword": keyword
		},
		success: function(result) {
			if (result.code == 0) {
				var shoplist = result.result.data.shoplist;
				if (shoplist.length > 0) {
					var _template = $($("#template").html());
					for (var i = 0; i < shoplist.length; i++) {
						var _clone = _template.clone();
						_clone.attr("data-id", shoplist[i].id)
						_clone.find("img").attr("src", shoplist[i].mainpicurl);
						_clone.find(".store-title").append(shoplist[i].companyname);
						_clone.find(".store-tip").append(shoplist[i].notice);
						$(".store-list").append(_clone);
					}
					if (shoplist.length == pageSize) {
						$(".more").show();
					} else {
						$(".more").hide();
					}
				} else {
					if (lastId == "") {
						$(".empty").show();
					}
					$(".more").hide();
				}
			}
		},
		error: function(status) {
			console.log(status);
		}
	});
}
