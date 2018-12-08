/**
 * Created by jack on 2017/3/13.
 */

var bookid = window.location.search;
var book = bookid.split("?")[1].split("&")[0];
var unboltId = bookid.split("?")[1].split("&")[1]
console.log(unboltId);


function idcard(idcardinformation){
    $("#customerName").val(idcardinformation.name);
    // $("#customerAddress").val(idcardinformation.addr);
    $("#idcard").val(idcardinformation.code);

    // $("#idcardType").val("2").trigger("change");
   /* $("#idcardType").on("change",function(){
        console.log($(this).val())
        if($(this).val()=="2" || $(this).val()=="5"){
            $("#idcard").val(idcardinformation.code);

        }else{
            $("#idcard").val("")
        }
    })*/
}


$.ajax({
    url: hzq_rest + "gasmrdbook/" + book,
    type: "get",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        console.log(data)

        $('#form input,#form select').each(function (index) {
            $(this).attr("name");
            if(data.hasOwnProperty($(this).attr('name'))){
                console.log($(this).attr('name'))
                if($(this).attr('name') == "countperId"){
                    console.log(0)
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gassysuser",
                        ref_col: "userId",
                        ref_display: "employeeName",
                    });
                    $(this).append("<option value='"+data[$(this).attr('name')]+"' selected>"+GastypeHelper.getDisplay(data[$(this).attr('name')])+"</option>");
                }else if($(this).attr('name') == "serviceperId"){
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gassysuser",
                        ref_col: "userId",
                        ref_display: "employeeName",
                    });
                    $(this).append("<option value='"+data[$(this).attr('name')]+"' selected>"+GastypeHelper.getDisplay(data[$(this).attr('name')])+"</option>");
                }else if($(this).attr('name') == "areaId"){
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gasbizarea",
                        ref_col: "areaId",
                        ref_display: "areaName",
                    });
                    $(this).append("<option value='"+data[$(this).attr('name')]+"' selected>"+GastypeHelper.getDisplay(data[$(this).attr('name')])+"</option>");
                }else{
                    $(this).val(data[$(this).attr('name')]);
                }

            }
        });
    }
});




$('#bookId').val(book);


$('#cancel_btn').click(function () {
    history.go("-1")
    // window.location = "customer/inhabitant_archivemanagement.html";
});

$("#save_btn").click("on",function () {

    $("#form select").on("change",function(){
        $("#form").valid();
    })
     $("#form1 select").on("change",function(){
        $("#form1").valid();
    })
     $("#form2 select").on("change",function(){
        $("#form2").valid();
    })
     $("#form3 select").on("change",function(){
        $("#form3").valid();
    });

    if(!$("#form").valid()|| !$("#form1").valid() || !$("#form2").valid()|| !$("#form3").valid()){
        return;
    }

    $("#areaId").removeAttr('disabled');
    bootbox.confirm({
        buttons: {
            confirm: {
                label: '确认',
                className: 'blue'
            },
            cancel: {
                label: '取消',
                className: 'btn-default'
            }
        },
        message: "<br><center><h4>确定提交吗？</h4></center><br>",
        callback: function (results) {

            console.log(results)
            if (!results) {
                $("#areaId").attr('disabled', 'disabled');
                $("#customerStart").attr('disabled', 'disabled');
                return;
            }

            ctmArchiveId = $.md5(JSON.stringify($("#form").serializeObject())+new Date().getTime());
            houseId = $.md5(JSON.stringify($("#form").serializeObject())+new Date().getTime());
            chgAccountId = $.md5(JSON.stringify($("#form").serializeObject())+new Date().getTime());


            // 客户编号
            var coustomer = {
                "batchid": ctmArchiveId,
                "count":1,
                "customer":{
                    "ctm_archive_id":ctmArchiveId,
                    "customer_kind":"1"
                }
            };
            var customerCodes = Restful.insert("/hzqs/sys/pbbcd.do?fh=SYSBCD0000000J00&resp=bd&bd",coustomer)
            console.log(customerCodes);
            if(customerCodes.message != "success"){
                bootbox.alert("客户编号生成失败！");
                return false;
            }

            var unboltJson = $("#form").serializeObject();
            var unboltJson1 = $("#form1").serializeObject();
            var unboltJson2 = $("#form2").serializeObject();
            // var unboltJson3 = $("#form3").serializeObject();
            var unboltJson3={};
            // var unboltJson4={};
            var unboltJson5={};

            var unboltJson7={};
            var unboltJson8={};
            unboltJson["lowerProtection"] ="0";
            unboltJson["ctmArchiveId"] = customerCodes["customers"][0].ctm_archive_id;
            unboltJson["customerCode"] = customerCodes["customers"][0].customer_code;
            unboltJson["customerId"] = customerCodes["customers"][0].customer_code;
            unboltJson["houseId"] = houseId;
            unboltJson["customerState"] = "00";
            unboltJson["modifiedTime"] = new Date();
            unboltJson["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            console.log(unboltJson)

            var borough = unboltJson1.borough;
            var street = unboltJson1.street;
            var district = unboltJson1.district;
            var doorplateNum = unboltJson1.doorplateNum;
            var floorNum = unboltJson1.floorNum;
            var cell = unboltJson1.cell;
            var storey = unboltJson1.storey;
            var roomNum = unboltJson1.roomNum;
            var subRoomNum = unboltJson1.subRoomNum;
            var customerAddresss ="";

            if (borough != "" && borough != "undefined" && borough) {
                if (borough.indexOf("区") == -1) {
                    customerAddresss = customerAddresss + borough + "区";
                } else {
                    customerAddresss = customerAddresss + borough;
                }
            } else {
                borough = "";
            }
            if (street != "" && street != "undefined" && street) {
                customerAddresss += street;
            } else {
                street = "";
            }
            if (doorplateNum != "" && doorplateNum != "undefined" && doorplateNum) {
                if (doorplateNum.indexOf("号") == -1) {
                    customerAddresss += doorplateNum+"号";
                }else{
                    customerAddresss += doorplateNum;
                }
            } else {
                doorplateNum = "";
            }
            if (district != "" && district != "undefined" && district ) {
                if (district.indexOf("小区") == -1) {
                    customerAddresss += district+"小区";
                }else{
                    customerAddresss += district;
                }
            } else {
                district = "";
            }

            if (floorNum != "" && floorNum != "undefined" && floorNum) {
                customerAddresss = customerAddresss + floorNum + "号楼";
            } else {
                floorNum = "";
            }
            if (cell != "" && cell != "undefined" && cell) {
                customerAddresss = customerAddresss + cell + "单元";
            } else {
                cell = "";
            }
            if (storey != "" && storey != "undefined" && storey) {
                customerAddresss = customerAddresss + storey + "层";
            } else {
                storey = "";
            }
            if (roomNum != "" && roomNum != "undefined" && roomNum) {
                customerAddresss = customerAddresss + roomNum + "室";
            } else {
                roomNum = "";
            }

            if (subRoomNum != "" && subRoomNum != "undefined" && subRoomNum) {
                customerAddresss = customerAddresss + subRoomNum + "分室";
            } else {
                subRoomNum = "";
            }


            unboltJson["customerAddress"] = customerAddresss;
            unboltJson1["houseId"] = houseId;
            unboltJson2["ctmArchiveId"] = customerCodes["customers"][0].ctm_archive_id;
            unboltJson1["modifiedTime"] = new Date();
            unboltJson1["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson2["modifiedTime"] = new Date();
            unboltJson2["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson3["ctmArchiveId"] = customerCodes["customers"][0].ctm_archive_id;
            unboltJson3['chgAccountId'] = chgAccountId;
            unboltJson3['linkman'] = unboltJson.bllContactName;
            unboltJson3['linkmanTel'] = unboltJson.bllContactPhone;
            unboltJson3['linkmanPhone'] = unboltJson.bllContactMobile;
            unboltJson3['linkmanMail'] = unboltJson.bllContactMobile;
            unboltJson3['linkmanAddress'] = unboltJson.bllContactAddress;
            unboltJson3['invoiceType'] = unboltJson.invoiceType;
            unboltJson3['invoiceName'] = unboltJson.invoiceTitle;
            unboltJson3['accountType'] = "0";
            unboltJson3["modifiedTime"] = new Date();
            unboltJson3["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;


            unboltJson5["customerId"] = unboltJson["customerCode"];
            unboltJson5["customerNo"] = unboltJson["customerCode"];
            unboltJson5["customerMainId"] = unboltJson["customerCode"];
            unboltJson5["customerName"] = unboltJson["customerName"];
            unboltJson5["identifyType"] = unboltJson["idcardType"];
            unboltJson5["identifyNo"] = unboltJson["idcard"];
            unboltJson5["tel"] = unboltJson["tel"];
            unboltJson5["customerAddress"] = unboltJson["customerAddress"];
            unboltJson5["modifiedTime"] = new Date();
            unboltJson5["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

            unboltJson7['chgAccountId'] = chgAccountId;
            unboltJson7['balance'] = "0";
            unboltJson7['gasfeeAccountId'] = $.md5(chgAccountId + Math.ceil(Math.random()*999));
            unboltJson8['chgAccountId'] = chgAccountId;
            unboltJson8['balance'] = "0";
            unboltJson8['wastefeeAccountId'] = $.md5(chgAccountId + Math.ceil(Math.random()*999));
            unboltJson7["modifiedTime"] = new Date();
            unboltJson7["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson8["modifiedTime"] = new Date();
            unboltJson8["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            if(!unboltJson.createTime){
                unboltJson.createTime=moment().format('YYYY-MM-DDTHH:mm:ss')
            }else{
                unboltJson.createTime=moment(unboltJson.createTime,"YYYY-MM-DD").format('YYYY-MM-DDTHH:mm:ss')
            }

            var submitJson = {"sets":[
                {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"put"},
                {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"post"},
                {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"post"},
                {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"post"},
                // {"txid":"4","body":unboltJson4,"path":"/gaschgaccctm/","method":"post"},
                {"txid":"5","body":unboltJson5,"path":"/gasctmcustomer/","method":"post"},
                {"txid":"6","body":unboltJson7,"path":"/gasactgasfeeaccount/","method":"post"},
                {"txid":"7","body":unboltJson8,"path":"/gasactwastefeeaccount/","method":"post"}
            ]};

            console.log("submit::"+JSON.stringify(submitJson));

            var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)

            console.log("submit:result:"+JSON.stringify(result));
            console.log(result);

            if(result.success == false){
                var cusCode = {
                    "batchId":"",
                    "costumerCode":customerCodes["customers"][0].customer_code,
                    "status":"0"
                };
                Restful.update(hzq_rest+"gassyscdunused",customerCodes["customers"][0].customer_code,cusCode)
                console.log(customerCodes["customers"][0].customer_code);
                var aa =Restful.delByIDR(hzq_rest+"gasctmarchive",customerCodes["customers"][0].customer_code)
                console.log(aa)
                bootbox.alert("提交失败");
            }else if(result.success == undefined){
                if(result.results[0]["result"]['success']) {
                    bootbox.alert("提交成功", function () {
                        history.go("-1");
                       // window.location = "customer/inhabitant_archivemanagement.html"
                    });
                }
            }

        }
    })
});

// 用气性质helper
var gasTypeHelper=RefHelper.create({
    ref_url:"gasbizgastype/"+'?query={"parentTypeId":"2"}"',
    ref_col:"gasTypeId",
    ref_display:"gasTypeName",
});

var init = function(){
    // 用气性质 select init
    $.map(gasTypeHelper.getData(), function(value, key) {
        if(value=="普通用户"){
            $('#gastypeId').append('<option value="'+key+'" selected>'+value+'</option>');
        }

    });
}();

var gasType1Helper = RefHelper.create({
    ref_url: 'gasbizgastype/?query={"parentTypeId":"201"}',
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
$.map(gasType1Helper.getData(), function (value, key) {
    console.log(key)
    $('#gastypeId1').append('<option value="' + key + '">' + value + '</option>');
});