var lastId = "";
var signupGroup = 1;
var pageSize = 6;
var keyword = "";

$(function() {
	searchShop();
});

$(document).on("click", ".menu span", function() {
	if (!$(this).hasClass("x")) {
		$(this).siblings().removeClass("x");
		$(this).addClass("x");
		lastId = "";
		signupGroup = $(this).attr("data-id");
		keyword = "";
		$("#search").val("");
		$(".shoplist").empty();
		$(".empty").hide();
		searchShop();
	}
});

$(document).on("click", "#searchBtn", function() {
	lastId = "";
	keyword = $("#search").val();
	$(".shoplist").empty();
	searchShop();
});

$(document).on("click", ".shoplist-more", function() {
	lastId = $(".shoplist .shopitem").last().attr("data-id");
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
						_clone.find(".title").append(shoplist[i].companyname);
						_clone.find(".tip").append(shoplist[i].notice);
						$(".shoplist").append(_clone);
					}
					if (shoplist.length == pageSize) {
						$(".shoplist-more").show();
					} else {
						$(".shoplist-more").hide();
					}
				} else {
					if (lastId == "") {
						$(".empty").show();
					}
					$(".shoplist-more").hide();
				}
			}
		},
		error: function(status) {}
	});
}
