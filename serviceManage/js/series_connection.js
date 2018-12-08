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
var filesid;
var newpropertyowner;
var newprocertynum;
var telnew;
var exigencetelnew;
var idcardnew;
var entrustname;
var entrustcardtype;
var entrustcardno;
var entrusttel;
var newprocertytype;
var customerKindEmnu={
	"1":"居民",
	"9":"非居民"
}
function idcard(data){
    $("#strandIdcard").val(data.code);
}
var idcardtypeenum = {"1": "营业执照", "2": "法人身份证", "3": "房产证", "4": "租房合同", "5": "居民身份证"};
$.map(idcardtypeenum, function (key, val) {

//  $('#idcardtypenew').append('<option  value="' + val + '">' + key + '</option>');
//  $('#entrustcardtype').append('<option  value="' + val + '">' + key + '</option>');
});

$("#save_btn").click("on", function () {

    pid = getUuid();
    occurrencetime = new Date().toLocaleString();
    customerCode = data.rows[0].customerCode;
    customerAddress = data.rows[0].customerAddress;
    customerName = data.rows[0].customerName;
    customerKind = data.rows[0].customerKind;
    customerTel = data.rows[0].tel;
    ctmArchiveId = data.rows[0].ctmArchiveId;
    idcard = data.rows[0].idcard;
    var aftercustomcode = $('#customerCodeAfter').val();
    var aftercustomname = $('#customerNameAfter').val();
    var aftercustomaddress = $('#addressAfter').val();
    var applycard = $('#strandIdcard').val();
    var applytel = $('#strandTel').val();
    var reason = $('#strandReason').val();
    var pricetype = $('#moneyType').val();
    var price = $('#strandMoney').val();
    var num = $('#serialNo').val();
    if(!num){
    	bootbox.alert("<br><center><h4>请选择交易号</h4></center><br>");
    	return;
    }

    function getUuid() {
        var len = 32;//32长度
        var radix = 16;//16进制
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }


    if (JSON.parse(localStorage.getItem("user_info")).employee_name) {
        opertor = localStorage.getItem("user_info").employee_name;
    } else {
        opertor = JSON.parse(localStorage.getItem("user_info")).userId;
    }

    var parameter = {
        "businesstype": "chsq",
        "printcontent": "{\"occurrencetime\":\"" + occurrencetime + "\",\
         \"opertor\":\"" + opertor + "\",\
         \"customtype\":\"" + "客户类型: " + customerKindEmnu[customerKind] + "\",\
         \"customercode\":\"" + "客户号: " + customerCode + "\",\
         \"customname\":\"" + "客户姓名: " + customerName + "\",\
         \"customtel\":\"" + "电话: " + customerTel + "\",\
         \"customic\":\"" + "证件号码: " + idcard + "\",\
         \"customaddress\":\"" + "地址: " + customerAddress + "\",\
         \"beforecustomercode\":\"" + "串前客户号: " + customerCode + "\",\
         \"beforecustomername\":\"" + "串前客户名: " + customerName + "\",\
         \"beforecustomeraddress\":\"" + "串前客户地址: " + customerCode + "\",\
         \"aftercustomcode\":\"" + "串后客户号: " + aftercustomcode + "\",\
         \"aftercustomname\":\"" + "串后客户名: " + aftercustomname + "\",\
         \"aftercustomaddress\":\"" + "串后客户地址: " + aftercustomaddress + "\",\
         \"applycard\":\"" + "申请人身份证: " + applycard + "\",\
         \"applytel\":\"" + "申请人电话: " + applytel + "\",\
         \"reason\":\"" + "串户原因: " + reason + "\",\
         \"pricetype\":\"" + "费用类型: " + pricetype + "\",\
         \"price\":\"" + "串款金额: " + price + "\",\
         \"num\":\"" + "交易号: " + num + "\",\
         \"businessname\":\"串户申请\"}",
        "pid": "" + pid + ""
    };
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
                    $('#submit_btn').removeClass('disabled');
                    // window.location.reload();
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
    var customerCodeBefore = $('#customerCodeBefore').val();
    var customerNameBefore = $('#customerNameBefore').val();
    var strandTel = $('#strandTel').val();
    var strandReason = $('#strandReason').val();
    var customerCodeAfter = $('#customerCodeAfter').val();
    var customerNameAfter = $('#customerNameAfter').val();
    var strandIdcard = $('#strandIdcard').val();
    var strandMoney = $('#strandMoney').val();
    var addressBefore = $('#addressBefore').val();
    var addressAfter = $('#addressAfter').val();
    var moneyType = $('#moneyType').val();
    var serialNo = $('#serialNo').val();
    var remark = $('#remark').val();
    console.log(serialNo);
	if(!serialNo){
		bootbox.alert("<br><center><h4>请选择交易号</h4></center><br>");
    	return;
	}
    if(gpypictureId){
        filesid = fileId;
    }else{
        filesid="";
    }
    var parameter = {
        "customercodebefore": "" + customerCodeBefore + "",
        "customernamebefore": "" + customerNameBefore + "",
        "strandtel": "" + strandTel + "",
        "strandreason": "" + strandReason + "",
        "customercodeafter": "" + customerCodeAfter + "",
        "customernameafter": "" + customerNameAfter + "",
        "strandidcard": "" + strandIdcard + "",
        "strandmoney": "" + strandMoney + "",
        "addressbefore": "" + addressBefore + "",
        "addressafter": "" + addressAfter + "",
        "moneytype": "" + moneyType + "",
        "serialno": "" + serialNo + "",
        "remark": "" + remark + "",
        "filesid": "" + filesid + ""
    }
    console.log(JSON.stringify(parameter));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/hzqs/ser/pbcca.do?fh=VFLSCGC000000J00&resp=bd',
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
    data = xw.getTable().getData(true);
    if (!data.rows.length) {
        data = xw.getTable().getData();
    }
    $('#customerCodeBefore').val(data.rows[0].customerCode);
    $('#customerNameBefore').val(data.rows[0].customerName);
    $('#addressBefore').val(data.rows[0].customerAddress);
}

$("#querytrade").on("click", function () {
    $("#divtable1").html('');
    var customerCode = $("#customerCodeBefore").val();
    if (!customerCode || customerCode == "" || customerCode == "undefined") {
        bootbox.alert("<br><center><h4>请填写串前客户编号</h4></center><br>");
        return false;
    }
    var moneyType = $("#moneyType").val();
    if (!moneyType || moneyType == "" || moneyType == "undefined") {
        bootbox.alert("<br><center><h4>请选择费用类型</h4></center><br>");
        return false;
    }
    var querys = new Array();
    querys.push(RQLBuilder.equal("customerCode", customerCode));
//  querys.push(RQLBuilder.equal("tradeType", "CHG"));
    RQLBuilder.and(querys).rql();
    var baseUrl = hzq_rest;
    if (moneyType == "1") {
//  	baseUrl += 'gasactgasfeeatl?query='+RQLBuilder.and(querys).rql()+'&sort=-tradeDate';
        baseUrl += 'gaschggasdetail?query='+RQLBuilder.and(querys).rql()+'&sort=-createdTime';
    } else {
    	baseUrl += 'gaschgwastedetail?query='+RQLBuilder.and(querys).rql()+'&sort=-createdTime';
//      baseUrl += 'gasactwastefeeatl?query='+RQLBuilder.and(querys).rql()+'&sort=-tradeDate';
    }
    xw1 = XWATable.init({
        divname: "divtable1",
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        checkAllToggle: false,
        checkboxes: true,
        //----------------基本restful地址---
        restURL: baseUrl,
        key_column: 'detailId',
        coldefs: [
        	{
                col: "tradeId",
                friendly: "交易ID",
                unique: "true",
                sorting: false,
                index: 1
            },
            {
                col: "customerCode",
                friendly: "客户编号",
                unique: "true",
                sorting: false,
                index: 1
            },
            
            {
                col: "money",
                friendly: "金额",
                sorting: false,
                index: 3
            },
            {
                col: "createdTime",
                friendly: "交易时间",
                sorting: false,
                index: 4
            }
        ],
        findFilter: function () {

        },

    })

})

$("#selectone").on('click', function () {
    var data1 = xw1.getTable().getData(true);
    if (data1.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
        return false;
    }
    if (data1.rows.length > 1) {
        bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
        return false;
    }
    console.log(data1.rows[0])
    $("#serialNo").val(data1.rows[0].tradeId);
    $("#strandMoney").val(data1.rows[0].money);
});
