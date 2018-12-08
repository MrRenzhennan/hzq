/**
 * Created by anne on 2017/5/20.
 */
jQuery(document).ready(function () {
    queryCustomerList.init();

});

$("#idcardread").on("click",function(){
    $.ajax({
        url:'http://127.0.0.1:9000/?data={"cmdheader":{"cmdtype":"23"}}',
        type:"get",
        jsonp: "callfuncname",
        dataType: "JSONP",
        async: false,
        success:function(data){
            console.log(data);
            if(data.result.resultcode !="1"){
                idcardinformation = data.result;
                $(".idcards").val(idcardinformation.code)
                $(".customerNames").val(idcardinformation.name)

            }

        }
    })
})
var customerAddress;
var customerName;
var customerKind;
var customerCode;
var customerTel;
var idcard;
var idcardType;
var occurrencetime;
var opertor;
var pid;
var bookCode;
var linkman;
var linktel;
var busiaddr;
var remark;
var kstype;
var unboltcode;
var bookingtime;
var projectAddress;
var filesid;
var customerKindEmnu = {
    "1": "居民",
    "9": "非居民"
}
var userinfo = JSON.parse(localStorage.getItem('user_info'));
// $('#bookingtime')
//     .datetimepicker()
//     .on('changeDate', function (ev) {
//
//         var myDate = new Date();
//         var now = myDate.valueOf();
//         var time = new Date($('#bookingtime').val()).valueOf();
//         if (now > time) {
//             $('#bookingtime').val("");
//             bootbox.alert("<br><center><h4>预约时间不能小于当前时期!</h4></center><br>");
//             return false;
//
//         }
//     });
$("#save_btn").on('click', function () {


    pid = getUuid();
    kstype = $("input[name='ksl']:checked").val();
    
    customerAddress = $("#customerAddress").val();
    customerName = $("#customerName").val();
    customerKind = $("#customerKind").val();
    if (!customerName) {
        bootbox.alert("<br><center><h4>请选择一个客户</h4></center><br>");
        return;
    }
    if(kstype=='2'){
    	unboltcode = $("#unboltcode").val();
    	if(!unboltcode){
    		bootbox.alert("<br><center><h4>请填写开栓令编号</h4></center><br>");
        	return;
    	}
    }
    customerTel = $("#tel").val();
    idcard = $("#idcard").val();
    idcardType = $("#idcardType").val();
    bookCode = $("#bookCode").val();
    linkman = $("#linkMan").val();
    linktel = $("#linktel").val();
    busiaddr = $("#projectAddress").val();
    remark = $("#remark").val();
    bookingtime = $("#bookingtime").val();

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


    occurrencetime = new Date().toLocaleString();

    if (userinfo.employee_name) {
        opertor = userinfo.employee_name;
    } else {
        opertor = userinfo.userId;
    }
    var printcontent={
        "occurrencetime":occurrencetime,
        "opertor":opertor,
        "customtype":("客户类型: " + customerKindEmnu[customerKind]),
        "customercode":"客户号: " + customerCode,
        "customname":"客户姓名: " + customerName,
        "customtel":"电话: " + (customerTel?customerTel:""),
        "customic":"证件号码: " + (idcard?idcard:""),
        "customaddress":"地址: " + (customerAddress?customerAddress:""),
        "linkman":"联系人: " + (linkman?linkman:""),
        "linktel":"联系电话: " + (linktel?linktel:""),
        "bookingtime":"预约时间: " + (bookingtime?bookingtime:""),
        "businessname":"零散开栓受理"
    }
    var parameter = {
        "businesstype": "lskssl",
        "printcontent": JSON.stringify(printcontent)
    };
    pid=$.md5(JSON.stringify(parameter)+new Date().getTime());
    parameter.pid = pid;
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
    kstype = $("input[name='ksl']:checked").val();
    if (kstype == "2" || kstype == "3") {
        var houseInfo = $("#houseForm").serializeObject();
        var borough = houseInfo.borough;
        var street = houseInfo.street;
        var district = houseInfo.district;
        var doorplateNum = houseInfo.doorplateNum;
        var floorNum = houseInfo.floorNum;
        var cell = houseInfo.cell;
        var storey = houseInfo.storey;
        var roomNum = houseInfo.roomNum;
        if (borough != "" && borough != "undefined") {
            if (borough.indexOf("区") == -1) {
                customerAddress = customerAddress + borough + "区";
            } else {
                customerAddress = customerAddress + borough;
            }
        } else {
            borough = "";
        }
        if (street != "" && street != "undefined") {
            customerAddress += street;
        } else {
            street = "";
        }
        if (district != "" && district != "undefined") {
            customerAddress += district;
        } else {
            district = "";
        }
        if (doorplateNum != "" && doorplateNum != "undefined") {
            customerAddress += doorplateNum;
        } else {
            doorplateNum = "";
        }
        if (floorNum != "" && floorNum != "undefined") {
            customerAddress = customerAddress + floorNum + "楼号";
        } else {
            floorNum = "";
        }
        if (cell != "" && cell != "undefined") {
            customerAddress = customerAddress + cell + "单元";
        } else {
            cell = "";
        }
        if (storey != "" && storey != "undefined") {
            customerAddress = customerAddress + storey + "层";
        } else {
            storey = "";
        }
        if (roomNum != "" && roomNum != "undefined") {
            customerAddress = customerAddress + roomNum + "室";
        } else {
            roomNum = "";
        }
    } else {
        customerAddress = $("#customerAddress").val();
    }
    customerName = $("#customerName").val();
    customerKind = $("#customerKind").val();
    customerTel = $("#tel").val();
    idcard = $("#idcard").val();
    pid = $("#pid").val();
    bookCode = $("#bookCode").val();
    linkman = $("#linkMan").val();
    linktel = $("#linktel").val();
    busiaddr = $("#projectAddress").val();
    remark = $("#remark").val();
    unboltcode = $("#unboltcode").val();
    projectAddress = $("#projectAddress").val();
    bookingtime = $('#bookingtime').val();
    if (gpypictureId) {
        filesid = fileId;
    } else {
        filesid = "";
    }
    var reformed;
	if($("#reformed").is(":checked")){
        reformed = "1"
	}else{
        reformed="0"
	}
    var parameter = {
        "kstype": "" + kstype + "",
        "customcode": "" + customerCode + "",
        "customname": "" + customerName + "",
        "customtype": "" + customerKind + "",
        "customaddr": "" + customerAddress + "",
        "customtel": "" + customerTel + "",
        "ictype": "" + idcardType + "",
        "icnumber": "" + idcard + "",
        "bookid": "" + bookCode + "",
        "linkman": "" + linkman + "",
        "linktel": "" + linktel + "",
        "reformed": "" + reformed + "",
        "busiaddr": "" + busiaddr + "",
        "bookingtime": "" + bookingtime + "",
        "remark": "" + remark + "",
        "filesid": "" + filesid + "",
        "unboltcode": "" + unboltcode + "",
        "projectaddress": "" + projectAddress + "",
        "borough": "" + borough + "",
        "street": "" + street + "",
        "district": "" + district + "",
        "doorplateNum": "" + doorplateNum + "",
        "floorNum": "" + floorNum + "",
        "cell": "" + cell + "",
        "storey": "" + storey + "",
        "roomNum": "" + roomNum + ""

    }
    console.log(JSON.stringify(parameter));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/hzqs/ser/pbsks.do?fh=VFLSCGC000000J00&resp=bd',
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

queryCustomerList = function () {

    var data = {"1": "营业执照", "2": "法人身份证", "3": "房产证", "4": "租房合同", "5": "居民身份证"}
    // $.each(data,function (index,val) {
    $.map(data, function (key, val) {
        $('#idcardType').append('<option  value="' + val + '">' + key + '</option>');
    });
    // })


    return {

        init: function () {

            this.reload();
        },


        reload: function () {

            $('#divtable').html('');
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: false,
                    //----------------基本restful地址---
                    restbase: 'gasctmarchive',
                    key_column: 'ctmArchiveId',
                    coldefs: [

                        {
                            col: "ctmArchiveId",
                            friendly: "ctmArchiveId",
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            readonly: "readonly",
                            index: 2,
                            format: nullFM
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: false,
                            readonly: "readonly",
                            index: 3,
                            format: nullFM
                        },
                        {
                            col: "tel",
                            friendly: "客户电话",
                            sorting: false,
                            readonly: "readonly",
                            index: 4,
                            format: nullFM
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            sorting: false,
                            index: 5,
                            format: nullFM
                        },
                        {
                            col: "customerState",
                            friendly: "客户状态",
                            sorting: false,
                            index: 6,
                            format: customerStateFM
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质",
                            sorting: false,
                            index: 7,
                            format: gasTypeFM
                        },
                        {
                            col: "idcardType",
                            friendly: "证件类型",
                            sorting: false,
                            index: 8,
                            format: cardTypeFM
                        },
                        {
                            col: "idcard",
                            friendly: "证件证号",
                            sorting: false,
                            index: 9,
                            format: nullFM
                        },

                    ]
                    ,
                    findFilter: function () {//find function

                        var queryUrl = hzq_rest + "gasctmarchive";
                        var querys = new Array()
                        if ($('#customerName1').val()) {
                            querys.push(RQLBuilder.like("customerName", $('#customerName1').val()));
                        }

                        if ($('#tel1').val()) {
                            querys.push(RQLBuilder.like("tel1", $('#tel1').val()));
                        }
                        if ($('#customerAddress1').val()) {
                            querys.push(RQLBuilder.like("customerAddress", $('#customerAddress1').val()));
                        }
                        if ($('#customerCode1').val()) {
                            querys.push(RQLBuilder.like("customerCode", $('#customerCode1').val()));
                        }
                        querys.push(RQLBuilder.equal("customerState", "00"))
                        if (querys.length > 0) {
                            queryUrl += "?query=" + RQLBuilder.and(querys).rql();
                        }

                        xw.setRestURL(queryUrl);
                        xw.update()

                        var data = xw.getTable().getData();
                        $("#divtable p").html('');
                        if (data.total_rows > 0) {

                            $('#customerInfo').css("display", "none");
                            $('#divtable').css("display", "block");
//                          //$("#divtable").prepend("<p>请选择一条符合条件的记录   <button id='confirm_btn' class='btn blue'>确定</button>   <button id='add_btn' class='btn blue'>新增档案</button></p>");
                            $("#divtable").prepend("<p>请选择一条符合条件的记录   <button id='confirm_btn' class='btn blue'>确定</button></p>");

                        } else {

                            $("#divtable").css("display", "block");
                            //$("#divtable").prepend("<p>请选择一条符合条件的记录   <button id='confirm_btn' class='btn blue'>确定</button>   <button id='add_btn' class='btn blue'>新增档案</button></p>");
                            $("#divtable").prepend("<p>请选择一条符合条件的记录   <button id='confirm_btn' class='btn blue'>确定</button></p>");

                        }


                        $("#confirm_btn").on('click', function () {
                            $('#houseInfo').hide();
                            $('#addressInfo').show();
                            var data = xw.getTable().getData(true);
                            // alert(data.total_rows)
                            console.log(data.rows.length)
                            if (data.rows.length == 0) {
                                bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
                                return false;
                            }
                            if (data.rows.length > 1) {
                                bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
                                return false;
                            }
                            if (data.rows.length == 1) {
                                $('#bookNo').css('display', 'block');
                                $('#employee').css('display', 'block');
                                var bookId = data.rows[0].bookId;
                                customerKind = data.rows[0].customerKind;
                                customerAddress = data.rows[0].customerAddress;
                                customerName = data.rows[0].customerName;
                                customerCode = data.rows[0].customerCode;
                                customerTel = data.rows[0].tel;
                                idcard = data.rows[0].idcard;
                                bookCode = data.rows[0].bookCode;
                                idcardType = data.rows[0].idcardType;
                                $("#divtable").css("display", "none");
                                $("#customerInfo").css("display", "block");
                                // $("#customerInfo input[type='text']").each(function(){
                                //     $(this).attr("disabled","disabled");
                                // });
                                $("#customerInfo input[type='text']").each(function () {
                                    //$(this).attr("disabled","disabled");
                                    $(this).val(data.rows[0][$(this).attr('name')]);

                                });
                                $("#ksl_status").hide();
                                $("input:radio[name='ksl']").eq(0).attr("checked", true);
                                $("#customerInfo input[type='radio']").each(function () {
                                    $(this).attr("disabled", "true");
                                    $(this).click();

                                });
                                $("#employee input[type='text']").each(function () {
                                    $(this).attr("disabled", "true");
                                    $(this).click();
                                });


                                $("#idcardType").val($.trim(idcardType)).trigger('change');
                                $("#customerKind").val($.trim(customerKind)).trigger('change');
                                //$("#idcardType").attr("disabled","true");


                                $("#projectAddress").val("" + customerAddress + "");


                                $.ajax({
                                    url: "/hzqs/hzqrest/gasmrdbook/? fields={\"bookId\":1}&query={\"bookId\":\"" + bookId + "\"}",
                                    method: "get",
                                    dataType: "json",
                                    success: function (data) {
                                        if (data && data.length > 0) {
                                            // console.log(data);
                                            // alert(data[0].bookCode)
                                            $("#bookCode").val(data[0].bookCode);
                                            var userNameHelper = RefHelper.create({
                                                ref_url: "gassysuser",
                                                ref_col: "userId",
                                                ref_display: "employeeName",
                                            });
                                            $("#serviceper").val(userNameHelper.getDisplay(data[0].serviceperId));
                                            $("#countper").val(userNameHelper.getDisplay(data[0].countperId));
                                            $("#serviceperId").val(data[0].serviceperId);
                                            $("#countperId").val(data[0].countperId);
                                        }
                                    }

                                });
                            }
                        });
                        return "";
                    }
                });

            //--init
        },
    }
}();

$("#add_btn").on('click', function () {
    $('#bookNo').css('display', 'none');
    $('#employee').css('display', 'none');
    $('#houseInfo').show();
    $('#addressInfo').hide();
    $("#ksl_status").show();
    $('#projectAddress').val("");
    $('#customerInfo').css("display", "block");
    $('#customerCodeNo').hide();

    $("#customerInfo input[type='text']").each(function () {
        // alert($(this).attr("id"))
        if ($(this).attr("id") == "serviceper" || $(this).attr("id") == "countper") {
            $(this).attr("disabled", "disabled");
            $(this).val("");

        } else {

            $(this).removeAttr("disabled");
            $(this).val("");
        }

    });
    $("#customerInfo input[type='radio']").each(function () {
        $(this).removeAttr("disabled");
        // $(this).click();
    });

    $('#inline1').css("display", "none");

    $("#idcardType").removeAttr("disabled");
    $("#idcardType").val("");
    $("#divtable").css("display", "none");


});
var cardTypeFM = function () {
    return {
        f: function (val) {
            if (val && val == 1) return "营业执照";
            else if (val && val == 2) return "法人身份证";
            else if (val && val == 3) return "房产证";
            else if (val && val == 4) return "租房合同";
            else if (val && val == 5) return "居民身份证";
        },
    }
}();
var nullFM = function () {
    return {
        f: function (val) {
            if (val)
                return val;
            else
                return "";
        },
    }
}();
var customerStateFM = function () {
    return {
        f: function (val) {
            if (val && val == "00") return "未开栓";
            else if (val && val == "01") return "正常";
            else if (val && val == "02") return "暂停用气";
            else if (val && val == "03") return "拆除";
            else if (val && val == "04") return "长期不用气";
            else if (val && val == "99") return "删除";
        },
    }
}();
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
var gasTypeFM = function () {
    return {
        f: function (val) {
            return gasTypeHelper.getDisplay(val);
        },
    }
}();
$("#inlineCheckbox2").click(function () {
    $('#unboltNo').show();
    $('#project').show();
});
$("#inlineCheckbox3").click(function () {
    $('#unboltNo').hide();
    $('#project').hide();
});
$("#unboltcode").blur(function(){
	unboltcode = $("#unboltcode").val();
	if(!unboltcode){
		bootbox.alert("<br><center><h4>请填写开栓令编号</h4></center><br>");
        return;
	}
	var res = Restful.findNQ(hzq_rest+'gascsrunbolt?query={"unboltNo":"'+unboltcode+'"}');
	if(res&&res.length>0){
		$('#save_btn').removeClass('disabled');
	}else{
		bootbox.alert("<br><center><h4>系统无此开栓令</h4></center><br>");
		$('#save_btn').addClass('disabled');
        return;
	}
})
