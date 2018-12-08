SideBar.init();
SideBar.activeCurByPage("business_process.html");
var pid;
var data;
var occurrencetime;
var customerCode;
var customerAddress;
var customerName;
var customerKind;
var customerTel;
var ctmArchiveId;
var idcard;
var opertor;
var newpropertyowner;
var newprocertynum;
var telnew;
var exigencetelnew;
var idcardnew;
var entrustname="";
var entrustcardtype="";
var entrustcardno="";
var entrusttel="";
var newprocertytype;
var customerKindEmnu={
	"1":"居民",
	"9":"非居民"
}

function idcard(data){
    $("#newpropertyowner").val(data.name)
    $("#idcardnew").val(data.code)
}


var idcardEmnu={
	"1":"营业执照",
	"2":"法人身份证",
	"3":"房产证",
	"4":"租房合同",
	"5":"居民身份证"
}
var userinfo = JSON.parse(localStorage.getItem('user_info'));

$("#ischecked").click("on", function () {
    if ($("#entrust").css("display") == "block") {
        $("#entrust").css("display", "none");
    } else if ($("#entrust").css("display") == "none") {
        $("#entrust").css("display", "block");

    }
})
var idcardtypeenum = {"1": "营业执照", "2": "法人身份证", "3": "房产证", "4": "租房合同", "5": "居民身份证"};
$.map(idcardtypeenum, function (key, val) {

    $('#idcardtypenew').append('<option  value="' + val + '">' + key + '</option>');
    $('#entrustcardtype').append('<option  value="' + val + '">' + key + '</option>');
});

var procertytypeenum = {
    "1": "私有产权证",
    "2": "不动产证",
    "3": "购房发票",
    "4": "商品房购房合同",
    "5": "购房发票",
    "6": "动迁安置协议",
    "7": "廉租房证",
    "8": "其他"
};
$.map(procertytypeenum, function (key, val) {
    $('#newprocertytype').append('<option  value="' + val + '">' + key + '</option>');
});


$("#save_btn").click("on", function () {
    if ($('#idcardtypenew').val() == '5') {
        var flag = validateIdCard($('#idcardnew').val())
        if (flag == false) {
            return;
        }
    }

    data = xw.getTable().getData(true);
    if (!data.rows.length) {
        data = xw.getTable().getData();
        if (!data.rows.length || data.rows.length > 1) {
            bootbox.alert("请选择一个客户");
            return;
        }
    }
    occurrencetime = new Date().toLocaleString();
    customerCode = data.rows[0].customerCode;
    customerAddress = data.rows[0].customerAddress;
    customerName = data.rows[0].customerName;
    customerKind = data.rows[0].customerKind;
    customerTel = data.rows[0].tel;
    ctmArchiveId = data.rows[0].ctmArchiveId;
    idcard = data.rows[0].idcard;
    var newpropertyowner = $('#newpropertyowner').val();
    var newprocertytype = $('#newprocertytype').val();
    var newprocertynum = $('#newprocertynum').val();
    var exigencetelnew = $('#exigencetelnew').val();
    var idcardtypenew = $('#idcardtypenew').val();
    var idcardnew = $('#idcardnew').val();
    var telnew = $('#telnew').val();

    if (userinfo.employee_name) {
        opertor = userinfo.employee_name;
    } else {
        opertor = userinfo.userId;
    }
	var printcontent={
		"occurrencetime":occurrencetime,
        "opertor":opertor,
        "customtype":"客户类型: " + customerKindEmnu[customerKind],
        "customercode":"客户号: " + customerCode,
        "customname":"客户姓名: " + customerName,
        "customtel":"电话: " + (customerTel?customerTel:""),
        "customic":"证件号码: " + (idcard?idcard:""),
        "customaddress":"地址: " + (customerAddress?customerAddress:""),
        "newpropertyowner":"新产权人姓名: " + (newpropertyowner?newpropertyowner:""),
        "newprocertytype":"新产权证类型: " + procertytypeenum[newprocertytype],
        "newprocertynum":"新产权证编号: " + (newprocertynum?newprocertynum:""),
        "exigencetelnew":"新应急电话: " + (exigencetelnew?exigencetelnew:""),
        "idcardtypenew":"新证件类型: " + idcardEmnu[idcardtypenew],
        "idcardnew":"新证件号码: " + (idcardnew?idcardnew:""),
        "telnew":"手机: " + (telnew?telnew:""),
        "businessname":"更名过户"
	}
    var parameter = {
        "businesstype": "gmgh",
        "printcontent": JSON.stringify(printcontent)
    };
    pid=$.md5(JSON.stringify(parameter)+new Date().getTime());
    parameter.pid = pid;
    console.log(JSON.stringify(parameter));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/hzqs/spt/pbprt.do?fh=PRTSPT0000000J00&resp=bd',
        type: "POST",
        datatype: "json",
        data: JSON.stringify(parameter),
        success: function (e) {
            console.log(e)
            if (e.errCode == '1') {
                bootbox.alert("<br><center><h4>保存成功！</h4></center><br>");

                $('.btn-primary').on('click', function () {
                    $('#save_btn').addClass('disabled');
                    $('#print_btn').removeClass('disabled');
                })
            } else {
                bootbox.alert("<br><center><h4>保存失败！</h4></center><br>");
            }
        }
    })


});

$("#print_btn").on('click', function () {
	var urll = 'http://127.0.0.1:9000/';
    var data = {
        "cmdheader": {
            "cmdtype": "17"
        },
        "param": {
            "data": [{"ptid": pid}]
        }
    };
    $.ajax({
		type: 'get',
		url: urll,
		async: false,
		dataType: "JSONP",
		data:"data=" + JSON.stringify(data),
		jsonp: "callfuncname",
		success: function (ret) {
			console.log(ret)
			if (ret.result.resultcode == "0") {
				bootbox.alert("<br><center><h4>打印成功</h4></center><br>",function(){
                    $('#print_btn').addClass('disabled');
                    $('#submit_btn').removeClass('disabled');
				});
		    } else {
		        bootbox.alert("<br><center><h4>打印失败</h4></center><br>");
		    }
	    },
	    error:function(e){
	   		bootbox.alert("<br><center><h4>打印失败</h4></center><br>");
	    }
	})
});

$("#submit_btn").on('click', function () {
    newpropertyowner = $('#newpropertyowner').val();
    newprocertynum = $('#newprocertynum').val();
    telnew = $('#telnew').val();
    exigencetelnew = $('#exigencetelnew').val();
    idcardnew = $('#idcardnew').val();
    idcardtypenew = $('#idcardtypenew').val();
    // if ($("#ischecked").checked == true) {
        console.log(1111111);
        entrustname = $('#entrustname').val();
        entrustcardtype = $('#entrustcardtype').val();
        entrustcardno = $('#entrustcardno').val();
        entrusttel = $('#entrusttel').val();
    // }

    newprocertytype = $('#newprocertytype').val();
    if (gpypictureId) {
    } else {
        fileId = "";
    }
    var parameter = {
        "newpropertyowner": newpropertyowner,
        "newprocertynum": newprocertynum,
        "telnew": telnew,
        "exigencetelnew": exigencetelnew,
        "idcardnew": idcardnew,
        "idcardtypenew": idcardtypenew,
        "ctmarchiveid": ctmArchiveId,
        "entrustname": entrustname,
        "entrustcardtype": entrustcardtype,
        "entrustcardno": entrustcardno,
        "entrusttel": entrusttel,
        "newprocertytype": newprocertytype,
        "filesid": fileId,
        "printid":pid
    }
    console.log(JSON.stringify(parameter));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/hzqs/ser/pbcch.do?fh=VFLSCGC000000J00&resp=bd',
        type: "POST",
        datatype: "json",
        data: JSON.stringify(parameter),
        success: function (e) {
            if (e.err_code == '1') {
                bootbox.alert("<br><center><h4>提交成功！</h4></center><br>");

                $('.btn-primary').on('click', function () {
                    window.location.reload();

                })


            } else {
                bootbox.alert("<br><center><h4>提交失败：" + e.msg + "</h4></center><br>");
            }
        }
    })
});