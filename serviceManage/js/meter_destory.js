/**
 * Created by anne on 2017/5/20.
 */
ComponentsPickers.init();
SideBar.init();
SideBar.activeCurByPage("business_process.html");


var customerAddress;
var customerName;
var customerKind;
var customerCode;
var customerTel;
var idcard;//证件号
var idcardType;//证件类型
var occurrencetime;
var opertor;
var pid;
var bookingtime;
var linkman;
var linktel;
var remark;
var filesid;
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var customerKindEmnu={
	"1":"居民",
	"9":"非居民"
}
$("#save_btn").on('click', function () {
    occurrencetime = new Date().toLocaleString();
    if (userinfo.employee_name) {
        opertor = userinfo.employee_name;
    } else {
        opertor = userinfo.userId;
    }
    var data = xw.getTable().getData(true);
    if (!data.rows.length) {
        data = xw.getTable().getData();
        if (!data.rows.length || data.rows.length > 1) {
            bootbox.alert("请选择一个客户");
            return;
        }
    }

    customerCode = data.rows[0].customerCode;
    customerAddress = data.rows[0].customerAddress;
    idcard = data.rows[0].idcard;
    customerName = data.rows[0].customerName;
    customerKind = data.rows[0].customerKind;
    customerTel = data.rows[0].tel;
    linkman = $("#linkMan").val();
    linktel = $("#linktel").val();
    remark = $("#remark").val();
    bookingtime = $("#bookingtime").val();
    var printcontent={
        "occurrencetime":occurrencetime,
        "opertor":opertor,
        "customtype":"客户类型: " + customerKindEmnu[customerKind],
        "customercode":"客户号: " + customerCode,
        "customname":"客户姓名: " + customerName,
        "customtel":"电话: " + (customerTel?customerTel:""),
        "customic":"证件号码: " + (idcard?idcard:""),
        "customaddress":"地址: " + (customerAddress?customerAddress:""),
        "linkman":"联系人: " + (linkman?linkman:""),
        "linktel":"联系电话: " + (linktel?linktel:""),
        "bookingtime":"预约时间: " + (bookingtime?bookingtime:""),
        "businessname":"表具拆除"
    }
    var parameter = {
        "businesstype": "rqssccsl",
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
            if (e.errCode == '1') {
                bootbox.alert("<br><center><h4>保存成功！</h4></center><br>");
                $('#save_btn').addClass('disabled');
                $('#print_btn').removeClass('disabled');
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
				bootbox.alert("<br><center><h4>打印成功！</h4></center><br>",function(){
                    $('#print_btn').addClass('disabled');
                    $('#submit_btn').removeClass('disabled');
		    })
			}else {
		        bootbox.alert("<br><center><h4>打印失败！</h4></center><br>");
		    }
	    },
	    error:function(e){
	   		console.log(e)
	    }
	})
});
$("#submit_btn").on('click', function () {
    var data = xw.getTable().getData(true);
    if (!data.rows.length) {
        data = xw.getTable().getData();
        if (!data.rows.length || data.rows.length > 1) {
            bootbox.alert("请选择一个客户！");
            return;
        }
    }


    customerCode = data.rows[0].customerCode;
    customerAddress = data.rows[0].customerAddress;
    ;
    customerName = data.rows[0].customerName;
    customerKind = data.rows[0].customerKind;
    customerTel = data.rows[0].tel;
    linkman = $("#linkMan").val();
    linktel = $("#linktel").val();
    remark = $("#remark").val();
    bookingtime = $('#bookingtime').val();

    if(gpypictureId){
        filesid = fileId;
    }else{
        filesid="";
    }
    var parameter = {
        "customcode": "" + customerCode + "",
        "bookingtime": "" + bookingtime + "",
        "linkman": "" + linkman + "",
        "linktel": "" + linktel + "",
        "remark": "" + remark + "",
        "printid": "" + pid + "",
        "filesid": "" + filesid + ""

    }
    console.log(JSON.stringify(parameter));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/hzqs/ser/pbrem.do?fh=VFLSCGC000000J00&resp=bd',
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

var onCustomerSelected = function (customerCode) {
    var gastoMinus = $("#gastoMinus").text();
    var bagetoMinus = $("#bagetoMinus").text();
    if (gastoMinus > 0 || bagetoMinus > 0) {
        bootbox.alert("<br><center><h4>欠费用户不能办理拆除业务！</h4></center></br>");
    }
}