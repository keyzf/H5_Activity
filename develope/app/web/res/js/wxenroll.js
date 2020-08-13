var signup = 2;

$(document).on("click", ".menu span", function() {
	if (!$(this).hasClass("x")) {
		$(this).siblings().removeClass("x");
		$(this).addClass("x");

		signup = $(this).attr("data-id");
		mark = true;
		if (signup == 2) {
      $(".business").children().eq(1).hide();
      $(".business").children().eq(0).show();
			$(".company").show();
			$(".team").hide();
		} else if (signup == 1) {
			$(".team").show();
			$(".company").hide();
		} else if (signup == 3) {
			$(".business").children().eq(0).hide();
			$(".business").children().eq(1).show();
		}
	}
})

$(document).on("click", ".uploadImg", function() {
	$(".uploadImg").removeAttr("id");
	var _this = this;
	$(this).attr("id", "imgMark");
	$("#upload").val("");
	$("#upload").click();
});

function preview(obj) {
	var file = obj.files[0];
	var size = file.size;
	if (size > 1024 * 1024) {
		layer.msg("上传图片不能大于1M");
		return;
	}
	if (file != undefined) {
		layer.load(1, {
			shade: [0.3, '#393D49']
		});
		var filename = file.name;
		var newName = uuid() + filename.substring(filename.lastIndexOf("."));
		var result;
		var form = new FormData(); // FormData 对象
		form.append("file", file, newName); // 文件对象
		$.ajax({
			type: "POST",
			url: "http://114.115.217.252:8001/HighMallServer/wxservicenumber/getPicUrl",
			data: form,
			processData: false, // 使数据不做处理
			contentType: false,
			success: function(result) {
				if (result.code == 0) {
					$("#imgMark").attr("src", result.result.data.url)
					$("#imgMark").attr("data-id", 1);
				} else {
					layer.msg(result.msg);
				}
				layer.closeAll('loading');
			},
			error: function(status) {
				layer.closeAll('loading');
			}
		});
	}
}

$(".btn").click(function() {
  if (signup == 3) {
   var data = checks();
   if (data) {
   	layer.load(1, {
   		shade: [0.3, '#393D49']
   	});
     
   	$.ajax({
   		type: "POST",
   		url: "http://114.115.217.252:8001/HighMallServer/helppoorcompetition2019/studentsSignUp",
   		data: data,
   		async: true,
   		success: function(result) {
   			layer.closeAll('loading');
   			if (result.code == 0) {
   				$(".formlist").hide();
   				$(".info-list .name").text(data.userName);
   				$(".info-list .tel").text(data.tel);
   				$(".info-list").show();
   			}
   			layer.msg(result.msg);
   		},
   		error: function(status) {
   			layer.closeAll('loading');
   		}
   	});
   }
  } else  {
  	var data = check();
  	if (data) {
  		layer.load(1, {
  			shade: [0.3, '#393D49']
  		});
  	  
  		$.ajax({
  			type: "POST",
  			url: "http://114.115.217.252:8001/HighMallServer/helppoorcompetition2019/signup",
  			data: data,
  			async: true,
  			success: function(result) {
  				layer.closeAll('loading');
  				if (result.code == 0) {
  					$(".formlist").hide();
  					$(".info-list .name").text(data.userName);
  					$(".info-list .companyName").text(data.companyName);
  					$(".info-list .tel").text(data.tel);
  					$(".info-list").show();
  				}
  				layer.msg(result.msg);
  			},
  			error: function(status) {
  				layer.closeAll('loading');
  			}
  		});
  	}
  }
});

function check() {
	var mark = true;
	var msg = "";
	var comName = $("#comName").val();
	if (mark && signup == 2 && comName == "") {
		msg = "请填写公司名称";
		mark = false;
	}
	var licenseUrl = $(".uploadImg").eq(0).attr("src");
	if (mark && signup == 2 && $(".uploadImg").eq(0).attr("data-id") == 0) {
		msg = "请上传营业执照";
		mark = false;
	}
	var userName = $("#userName").val();
	if (mark && userName == "") {
		if (signup == 2) {
			msg = "请填写公司负责人";
		} else if (signup == 1) {
			msg = "请填写负责人姓名";
		}
		mark = false;
	}
	var address = $("#address").val();
	if (mark && address == "") {
		if (signup == 2) {
			msg = "请填写公司地址";
		} else if (signup == 1) {
			msg = "请填写负责人地址";
		}
		mark = false;
	}
	var idCard = $("#idCard").val();
	if (mark && idCard == "") {
		msg = "请填写身份证号";
		mark = false;
	}
	var frontUrl = $(".uploadImg").eq(1).attr("src");
	if (mark && $(".uploadImg").eq(1).attr("data-id") == 0) {
		msg = "请上传身份证正面";
		mark = false;
	}
	var backUrl = $(".uploadImg").eq(2).attr("src");
	if (mark && $(".uploadImg").eq(2).attr("data-id") == 0) {
		msg = "请上传身份证背面";
		mark = false;
	}
	var holdUrl = $(".uploadImg").eq(3).attr("src");
	if (mark && $(".uploadImg").eq(3).attr("data-id") == 0) {
		msg = "请上传手持身份证";
		mark = false;
	}
	var teamMember;
	if (mark && signup == 1) {
		teamMember = getMember();
	}
	var signupGroup = $("#group").val();
	var companyName = $("#companyName").val();
	if (mark && companyName == "") {
		msg = "请填写店铺名称";
		mark = false;
	}
	var companyNotice = $("#companyNotice").val();
	if (mark && companyNotice == "") {
		msg = "请填写店铺简介";
		mark = false;
	}
	var mainUrl = $(".uploadImg").eq(4).attr("src");
	if (mark && $(".uploadImg").eq(4).attr("data-id") == 0) {
		msg = "请上传店铺主图";
		mark = false;
	}
	var phone = $("#phone").val();
	if (mark && phone == "") {
		msg = "请填写手机号";
		mark = false;
	}
	var code = $("#code").val();
	if (mark && code == "") {
		msg = "请填写验证码";
		mark = false;
	}
	if (mark) {
		var data = {
			"userName": userName,
			"address": address,
			"idCardNumber": idCard,
			"idCardFrontPhotoUrl": frontUrl,
			"idCardBackPhotoUrl": backUrl,
			"idCardHoldPhotoUrl": holdUrl,
			"signupGroup": signupGroup,
			"companyName": companyName,
			"companyNotice": companyNotice,
			"companyMainPicUrl": mainUrl,
			"individualOrCompany": signup,
			"tel": phone,
			"verificationCode": code
		}
		if (signup == 2) {
			data.companyLicensePhotoUrl = licenseUrl;
			data.originalCompanyName = comName;
		} else if (signup == 1) {
			data.teamMemberJson = teamMember;
		}
		return data;
	} else {
		layer.msg(msg);
		return false;
	}
}


function checks() {
	var mark = true;
	var msg = "";
  var userName = $(".userNames").val();
  if (mark && userName == "") {
    msg = "请填写负责人姓名";
  	mark = false;
  }
  var phone = $(".tels").val();
  if (mark && phone == "") {
  	msg = "请填写手机号";
  	mark = false;
  }
  var code = $(".verificationCodes").val();
  if (mark && code == "") {
  	msg = "请填写验证码";
  	mark = false;
  }
  var schoolNames = $(".schoolNames").val();
  if (mark && schoolNames == "") {
  	msg = "请填写学校名称";
  	mark = false;
  }
  var projectName = $(".projectNames").val();
  if (mark && projectName == "") {
  	msg = "请填写项目名称";
  	mark = false;
  }
  var applicableFileds = $(".applicableFiledss").val();
  if (mark && applicableFileds == "") {
  	msg = "请填写适用领域";
  	mark = false;
  }
  var projectIntroduction = $(".projectIntroductions").val();
  if (mark && projectIntroduction == "") {
  	msg = "请填写项目简介";
  	mark = false;
  }
  var idCard = $(".idCardNumbers").val();
  if (mark && idCard == "") {
  	msg = "请填写身份证号";
  	mark = false;
  }
  var frontUrl = $(".idCards .uploadImg").eq(0).attr("src");
  if (mark && $(".idCards .uploadImg").eq(0).attr("data-id") == 0) {
  	msg = "请上传身份证正面";
  	mark = false;
  }
  var backUrl = $(".idCards .uploadImg").eq(1).attr("src");
  if (mark && $(".idCards .uploadImg").eq(1).attr("data-id") == 0) {
  	msg = "请上传身份证背面";
  	mark = false;
  }
  var holdUrl = $(".idCards .uploadImg").eq(2).attr("src");
  if (mark && $(".idCards .uploadImg").eq(2).attr("data-id") == 0) {
  	msg = "请上传手持身份证";
  	mark = false;
  }
  var address = $(".addresss").val();
  if (mark && address == "") {
    msg = "请填写负责人地址";
  	mark = false;
  }
  
  var teamMember;
  if (mark) {
  	teamMember = getMembers();
  }
	
	if (mark) {
		var data = {
			"userName": userName,
      "tel": phone,
      "verificationCode": code,
      "schoolName":schoolNames,
      "projectName":projectName,
      "applicableFileds":applicableFileds,
      "projectIntroduction":projectIntroduction,
      "idCardNumber": idCard,
      "idCardFrontPhotoUrl": frontUrl,
      "idCardBackPhotoUrl": backUrl,
      "idCardHoldPhotoUrl": holdUrl,
			"address": address,
      "teamMemberJson":teamMember
		}
		return data;
	} else {
		layer.msg(msg);
		return false;
	}
}


var mark = true;
$(document).on("click", "#codeBtn", function() {
	var regexp = /^1\d{10}$/;
	var phoneNum = $("#phone").val();
	if (regexp.test(phoneNum)) {
		if (mark) {
			getCode(phoneNum);
		}
	} else {
		layer.msg("请输入正确的手机号!");
	}
});
$(document).on("click", "#codeBtns", function() {
	var regexp = /^1\d{10}$/;
	var phoneNum = $(".tels").val();
	if (regexp.test(phoneNum)) {
		if (mark) {
			getCode(phoneNum);
		}
	} else {
		layer.msg("请输入正确的手机号!");
	}
});
function getCode(phoneNum) {
	$.ajax({
		type: "GET",
		url: "http://114.115.217.252:8001/HighMallServer/helppoorcompetition2019/sendVerificationCode",
		data: {
			"tel": phoneNum
		},
		async: true,
		success: function(result) {
			if (result.code == 0) {
				countdown();
			} else {
				layer.msg(result.msg)
			}
		},
		error: function(status) {}
	});
}

var down = 90;

function countdown() {
	$("#codeBtn").addClass("x");
	$("#codeBtns").addClass("x");
	if (down == 0) {
		mark = true;
		$("#codeBtn").removeClass("x");
		$("#codeBtns").removeClass("x");
		$("#codeBtn").text("获取验证码");
		$("#codeBtns").text("获取验证码");
		down = 90;
		return false;
	} else {
		mark = false;
		$("#codeBtn").text("重新发送(" + down + ")");
		$("#codeBtns").text("重新发送(" + down + ")");
		down--;
	}
	setTimeout(function() {
		countdown();
	}, 1000);
}

function uuid() {
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
}

$(document).on("blur", ".idcard", function() {
	var idCard = $(this).val();
	var idCardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	if (!idCardReg.test(idCard)) {
		msg = "请填写正确身份证号";
		mark = false;
		layer.msg(msg);
	}
});

$(document).on("click", ".addMember", function() {
	var memberName = $(this).parent().parent().find(".memberName").val();
	var memberCard = $(this).parent().find(".idcard").val();
	if ($(".addMember").length >= 5) {
		layer.msg("不能添加更多的团队成员了!");
		return;
	}
	if (memberName == "" || memberName == "") {
		layer.msg("请填写成员姓名及身份证号后再添加!");
		return;
	}
	var type = $(this).attr("data-type");
	if (type == 0) {
		var _template = $(this).parent().parent().clone();
		$(_template).find("input").val("");
		$(this).attr("data-type", 1);
		$(this).text("删除团队成员");
		$(this).parent().parent().after(_template);
	} else if (type == 1) {
		$(this).parent().parent().remove();
	}
});
$(document).on("click", ".addMembers", function() {
	var memberName = $(this).parent().parent().find(".memberNames").val();
	var memberCard = $(this).parent().find(".idcardss").val();
	if ($(".addMembers").length >= 5) {
		layer.msg("不能添加更多的团队成员了!");
		return;
	}
	if (memberName == "" || memberName == "") {
		layer.msg("请填写成员姓名及身份证号后再添加!");
		return;
	}
	var type = $(this).attr("data-type");
	if (type == 0) {
		var _template = $(this).parent().parent().clone();
		$(_template).find("input").val("");
		$(this).attr("data-type", 1);
		$(this).text("删除团队成员");
		$(this).parent().parent().after(_template);
	} else if (type == 1) {
		$(this).parent().parent().remove();
	}
});

function getMember() {
	var jsons = [];
	var mark = true;
	$(".teamMember").each(function() {
		var memberName = $(this).find(".memberName").val();
		var idcard = $(this).find(".idcard").val()
		if (memberName != "" || idcard != "") {
			jsons.push(new Object({
				realname: memberName,
				idnumber: idcard
			}));
		}
	});
	if (jsons.length > 0) {
		return JSON.stringify(jsons);
	} else {
		return "";
	}
}

function getMembers() {
	var jsons = [];
	var mark = true;
	$(".teamMembers").each(function() {
		var memberName = $(this).find(".memberNames").val();
		var idcard = $(this).find(".idcardss").val()
		if (memberName != "" || idcard != "") {
			jsons.push(new Object({
				realname: memberName,
				idnumber: idcard
			}));
		}
	});
	if (jsons.length > 0) {
		return JSON.stringify(jsons);
	} else {
		return "";
	}
}
