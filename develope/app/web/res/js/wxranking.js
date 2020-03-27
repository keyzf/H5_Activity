var lastId = "";
var signupGroup = 1;
var pageSize = 16;
var rank = 1;
var moreMark = true;

$(function() {
	getCompany();
});

$(document).on("click", ".menu span", function() {
	if (!$(this).hasClass("x")) {
		rank = 1;
		$(this).siblings().removeClass("x");
		$(this).addClass("x");
		signupGroup = $(this).attr("data-id");
		lastId = "";
		moreMark = true;
		$("#noMore").hide();
		if (signupGroup < 4) {
			$("#good").hide();
			$("#shop").show();
			$(".shopList").empty();
			getCompany();
		} else {
			$("#shop").hide();
			$("#good").show();
			$(".goodsList").empty();
			getGoods();
		}
		$(".empty").hide();
	}
});

$(window).scroll(function() {
	var scrollTop = $(window).scrollTop();
	var scrollHeight = $(window).height();
	var totalHeight = $(document).height();
	if ((scrollTop + scrollHeight + 50) > totalHeight && moreMark) {
		if (signupGroup < 4) {
			lastId = $(".shopList .ranking-item").last().attr("data-id");
			getCompany();
		} else if (signupGroup == 4) {
			lastId = $(".goodsList .ranking-item").last().attr("data-id");
			getGoods();
		}
	}
})

function getCompany() {
	if (moreMark) {
		moreMark = false;
		$("#more").show();
		$.ajax({
			type: "POST",
			url: "http://114.115.217.252:8001/HighMallServer/helppoorcompetition2019/ranklist",
			data: {
				"lastId": lastId,
				"type": signupGroup,
				"pageSize": pageSize
			},
			success: function(result) {
				$("#more").hide();
				if (result.code == 0) {
					var shoplist = result.result.data;
					if (shoplist.length > 0) {
						var _template = $($("#template").html());
						for (var i = 0; i < shoplist.length; i++) {
							var _clone = _template.clone();
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
			error: function(status) {}
		});
	}
}

function getGoods() {
	if (moreMark) {
		moreMark = false;
		$("#more").show();
		$.ajax({
			type: "POST",
			url: "http://114.115.217.252:8001/HighMallServer/helppoorcompetition2019/getGoodSalesRankList",
			data: {
				"lastId": lastId,
				"pageSize": pageSize
			},
			success: function(result) {
				$("#more").hide();
				if (result.code == 0) {
					var goodslist = result.result.data.goodSalesRankList;
					if (goodslist.length > 0) {
						var _template = $($("#goodsTem").html());
						for (var i = 0; i < goodslist.length; i++) {
							var _clone = _template.clone();
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
			error: function(status) {}
		});
	}
}
