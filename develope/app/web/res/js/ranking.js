var lastId = "";
var signupGroup = 1;
var pageSize = 6;
var rank = 1;

$(function() {
	getCompany();
});

$(document).on("click", ".classify-item", function() {
	if (!$(this).hasClass("x")) {
		rank = 1;
		$(this).siblings().removeClass("x");
		$(this).addClass("x");
		signupGroup = $(this).attr("data-id");
		lastId = "";
		if (signupGroup < 6) {
      $("#tip").hide();
			$("#good").hide();
			$("#shop").show();
			$(".shopList").empty();
			getCompany();
		} else {
			$("#shop").hide();
      $(".more").hide();
			$("#good").hide();
			$(".goodsList").empty();
      $("#tip").show();
		}
		$(".empty").hide();
	}
});

$(document).on("click", ".more", function() {
	if (signupGroup < 6) {
		lastId = $(".shopList .item").last().attr("data-id");
		getCompany();
	}
});

function getCompany() {
	$(".more").hide();
	$.ajax({
		type: "POST",
		url: "http://114.115.217.252:8001/HighMallServer/helppoorcompetition2019/newRanklist",
		data: {
			"lastId": lastId,
			"rankType": signupGroup,
			"pageSize": pageSize
		},
		success: function(result) {
			if (result.code == 0) {
				var shoplist = result.result.data;
				if (shoplist.length > 0) {
					var _template = $($("#template").html());
					for (var i = 0; i < shoplist.length; i++) {
						var _clone = _template.clone();
						if (i % 2 == 1) {
							_clone.addClass("second");
						}
						_clone.attr("data-id", shoplist[i].id);
						if (rank < 4) {
							_clone.find(".ranking-left span").attr("class", "x");
						}
						_clone.find(".ranking-left span").text(rank);
						_clone.find(".ranking-cen p").text(shoplist[i].companyname);
						_clone.find(".ranking-right p").text(shoplist[i].judge_criteria_sum);
						$(".shopList").append(_clone);
						rank++;
					}
					if (shoplist.length == pageSize) {
						$(".more").show();
					}
				} else {
					if (lastId == "") {
						$(".empty").show();
					}
				}
			}
		},
		error: function(status) {}
	});
}

function getGoods() {
	$(".more").hide();
	$.ajax({
		type: "POST",
		url: "http://114.115.217.252:8001/HighMallServer/helppoorcompetition2019/getGoodSalesRankList",
		data: {
			"lastId": lastId,
			"pageSize": pageSize
		},
		success: function(result) {
			if (result.code == 0) {
				var goodslist = result.result.data.goodSalesRankList;
				if (goodslist.length > 0) {
					var _template = $($("#goodTem").html());
					for (var i = 0; i < goodslist.length; i++) {
						var _clone = _template.clone();
						if (i % 2 == 1) {
							_clone.addClass("second");
						}
						_clone.attr("data-id", goodslist[i].id);
						if (goodslist[i].rank < 4) {
							_clone.find(".ranking-left span").attr("class", "x");
						}
						_clone.find(".ranking-left span").text(goodslist[i].rank);
						_clone.find(".ranking-cen img").attr("src", goodslist[i].url);
						_clone.find(".ranking-cen .name").text(goodslist[i].productname);
						_clone.find(".ranking-cen .tips").text(goodslist[i].companyname);
						_clone.find(".ranking-right p").text(goodslist[i].sales);
						$(".goodsList").append(_clone);
					}
					if (goodslist.length == pageSize) {
						$(".more").show();
					}
				} else {
					if (lastId == "") {
						$(".empty").show();
					}
				}
			}
		},
		error: function(status) {}
	});
}
