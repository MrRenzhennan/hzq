/**
 * Created by jack on 2017/3/13.
 */

var gastypeIds = window.location.search;
var gastypeId = gastypeIds.split("?")[1];
console.log(gastypeId);
var gasTyperesult = Restful.findNQ(hzq_rest + 'gascsrunboltnorsdtdetail/'+gastypeId)
console.log(gasTyperesult)
if(gasTyperesult.isRel == "1"){
    history.go("-1")
}
var unbolt = Restful.findNQ(hzq_rest + 'gascsrunbolt/'+gasTyperesult.unboltId)
console.log(unbolt)
var gas_resource="";
if(unbolt.unboleType=="3"){
    gas_resource="2"
    $("#gasResource").val("2").trigger("change")
}else{
    gas_resource="1"
    $("#gasResource").val("1").trigger("change")
}


// 用气性质级联
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/?query={\"parentTypeId\":\"3\"}",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
$.map(gasTypeHelper.getData(), function (value, key) {
    console.log(key)
    if(key == gasTyperesult.gasTypeId){
        $('#gastypeId').append('<option value="' + key + '" selected>' + value + '</option>');
        var gasType1Helper = RefHelper.create({
            ref_url: 'gasbizgastype/?query={"parentTypeId":"'+key+'"}',
            ref_col: "gasTypeId",
            ref_display: "gasTypeName",
        });
        $.map(gasType1Helper.getData(), function (value, key) {
            console.log(key)
            $('#gastypeId1').append('<option value="' + key + '">' + value + '</option>');
        });
    }else{
        $('#gastypeId').append('<option value="' + key + '">' + value + '</option>');
    }
});
$("#gastypeId").on("change",function(){
    console.log($(this).val())
    $('#gastypeId1').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
        $('#gastypeId1').append('<option value="' + key + '">' + value + '</option>');
    });
});


var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var GastypeHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName",
});

$("#areaId").append("<option value='"+areaId+"' selected>"+GastypeHelper.getDisplay(areaId)+"</option>");
//抄表本
var queryCondion = RQLBuilder.and([
    RQLBuilder.equal("areaId",areaId),
    RQLBuilder.equal("bookType","9"),
]).rql()

var bookId = Restful.findNQ(hzq_rest + 'gasmrdbook/?query='+queryCondion);
console.log(bookId)
$.each(bookId,function(index,item){
    if(item.address){
        $("#bookId").append("<option value='"+item.bookId+"'>本编号:"+item.bookCode+" 本地址:"+item.address+"</option>");
    }else{
        $("#bookId").append("<option value='"+item.bookId+"'>本编号:"+item.bookCode+" 本地址: </option>");
    }

})
// 合同


var loginarea = [];

GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
        })
    }
});

var bd = {
    "cols": "ca.contract_no,b.*",
    "froms": "gas_ctm_contract ca left join gas_ctm_contract_meter b on b.contract_id = ca.contract_id ",
    "wheres": "b.status='1' and ca.gas_kind='9' and ca.area_id in ("+loginarea.join()+")",
    "page": false
};
$.ajax({
    type: 'get',
    url:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function(data) {
        console.log(data)
        if(data.rows){
            $.each(data.rows,function(index,item){
                console.log(item)
                $("#contractId").append("<option value='"+JSON.stringify(item)+"'>合同编号:"+item.contractNo+" 表编号:"+item.meterCode+"</option>");
            })
        }

    }
});




/*


var querycontractId = RQLBuilder.and([
    // RQLBuilder.equal("areaId",areaId),
    RQLBuilder.equal("status","1"),
]).rql()
var contractHelper = RefHelper.create({
    ref_url: "gasctmcontract",
    ref_col: "contractId",
    ref_display: "contractNo",
});


var contractId = Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query='+querycontractId);
console.log(contractId)
$.each(contractId,function(index,item){
    console.log(item)
    // $("#contractId").append("<option value='"+JSON.stringify(item)+"'>合同编号:"+contractHelper.getDisplay(item.contractId)+" 表编号:"+item.meterCode+"</option>");
})
*/


$("#bookId").on("change",function(){
    console.log($(this).val())
    if($(this).val()){
        var bookId = Restful.findNQ(hzq_rest + 'gasmrdbook/'+$(this).val());
        console.log(bookId)
        var GastypeHelper = RefHelper.create({
            ref_url: "gassysuser",
            ref_col: "userId",
            ref_display: "employeeName",
        });
        $("#countperId").html("<option value='"+bookId.bookId+"' selected>"+GastypeHelper.getDisplay(bookId.countperId)+"</option>").trigger("change");
        $("#serviceperId").html("<option value='"+bookId.bookId+"' selected>"+GastypeHelper.getDisplay(bookId.serviceperId)+"</option>").trigger("change");

    }else{
        $("#countperId").html("<option value='' selected> </option>").trigger("change");
        $("#serviceperId").html("<option value='' selected> </option>").trigger("change");
    }

})


function idcard(idcardinformation){
    $("#customerName").val(idcardinformation.name);
    $("#idcard").val(idcardinformation.code);

}



/*$.ajax({
    url: hzq_rest + "gasmrdbook/" + book,
    type: "get",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        console.log(data)
        $("#bookId").val(data.bookCode)
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
})*/


$('#cancel_btn').click(function () {
    history.go("-1");
    // window.location = "customer/non_inhabitant_archivemanagement.html";
});

$("#save_btn").on("click",function(){

    // console.log(JSON.parse($("#contractId").val()).contractId);

    $("#form select").on("change",function(){
        $("#form").valid();
    })
    $("#form1 select").on("change",function(){
        $("#form1").valid();
    })
    $("#form2 select").on("change",function(){
        $("#form2").valid();
    })

    if(!$("#form").valid()|| !$("#form1").valid() || !$("#form2").valid()){
        return;
    }



    $("#areaId").removeAttr('disabled');
    $("#customerStart").removeAttr('disabled');


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
            if (!results){
                $("#areaId").attr('disabled','disabled');
                $("#customerStart").attr('disabled','disabled');
                return;
            }

            ctmArchiveId = $.md5(JSON.stringify($("#form").serializeObject())+new Date().getTime());
            houseId = $.md5(JSON.stringify($("#form1").serializeObject())+new Date().getTime());
            chgAccountId = $.md5(JSON.stringify($("#form2").serializeObject())+new Date().getTime());
            console.log(ctmArchiveId);
            var coustomer = {
                "batchid": ctmArchiveId,
                "count":1,
                "customer":{
                    "ctm_archive_id":ctmArchiveId,
                    "customer_kind":"9"
                }
            };

            var customerCodes = Restful.insert("/hzqs/sys/pbbcd.do?fh=SYSBCD0000000J00&resp=bd&bd",coustomer)
            console.log(customerCodes);
            if(customerCodes.message != "success"){
                bootbox.alert("客户编号生成失败！");
                return false;
            }
            //客户档案
            var unboltJson = $("#form").serializeObject();
            console.log(unboltJson)
            //房屋信息
            var unboltJson1 = $("#form1").serializeObject();
            //承租人信息
            var unboltJson2 = $("#form2").serializeObject();
            //联合收费账户
            // var unboltJson3 = $("#form3").serializeObject();
            //联合收费账户关联
            var unboltJson3={};
            //非居民抄表例日
            var unboltJson5={};
            //客户信息
            var unboltJson6={};
            var unboltJson7={};
            var unboltJson8={};
            //关联合同
            var unboltJson9={};

             var unboltJson10={};

            if($("#gasEnvironment").val()){
                unboltJson["gasEnvironment"] = $("#gasEnvironment").val().join();
            }
            unboltJson["ctmArchiveId"] = customerCodes["customers"][0].ctm_archive_id;
            unboltJson["lowerProtection"] ="0";
            unboltJson["houseId"] = houseId;
            unboltJson["customerCode"] = customerCodes["customers"][0].customer_code;
            unboltJson["customerId"] = customerCodes["customers"][0].customer_code;
            unboltJson["customerState"] = "00";
            unboltJson["bookId"] = $("#bookId").val();
            unboltJson["modifiedTime"] = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+"-00:00");
            unboltJson["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson["createdBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

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

            unboltJson["customerAddress"]=customerAddresss;
            unboltJson["gasResource"]=gas_resource;
            unboltJson1["houseId"] = houseId;
            unboltJson1["population"] = "5";
            unboltJson1["modifiedTime"] = new Date();
            unboltJson1["createdBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson1["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson2["ctmArchiveId"] = unboltJson["ctmArchiveId"];
            unboltJson2["modifiedTime"] = new Date();
            unboltJson2["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson2["createdBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

            unboltJson3['chgAccountId'] = chgAccountId;
            unboltJson3['ctmArchiveId'] = customerCodes["customers"][0].ctm_archive_id;
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
            unboltJson3["createdBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson7['chgAccountId'] = chgAccountId;
            unboltJson7['balance'] = "0";
            unboltJson7["modifiedTime"] = new Date();
            unboltJson7["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson7['gasfeeAccountId'] = chgAccountId + Math.ceil(Math.random()*101);
            unboltJson8['chgAccountId'] = chgAccountId;
            unboltJson8['balance'] = "0";
            unboltJson8['wastefeeAccountId'] = chgAccountId  + Math.ceil(Math.random()*101);
            unboltJson8["modifiedTime"] = new Date();
            unboltJson8["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson8["createdBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson5['bookId'] = $("#bookId").val();
            // console.log($("#bookId").val())
            unboltJson5['businessRuleDayId'] = ctmArchiveId;
            unboltJson5["ctmArchiveId"] = unboltJson["ctmArchiveId"];
            unboltJson5["modifiedTime"] = new Date();
            unboltJson5["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson6["customerId"] = unboltJson["customerCode"];
            unboltJson6["customerNo"] = unboltJson["customerCode"];
            unboltJson6["customerMainId"] = unboltJson["customerCode"];
            unboltJson6["customerName"] = unboltJson["customerName"];
            unboltJson6["identifyType"] = unboltJson["idcardType"];
            unboltJson6["identifyNo"] = unboltJson["idcard"];
            unboltJson6["tel"] = unboltJson["tel"];
            unboltJson6["customerAddress"] = unboltJson["customerAddress"];
            unboltJson6["modifiedTime"] = new Date();
            unboltJson6["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson6["createdBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

            unboltJson9["cntMtrId"] = JSON.parse($("#contractId").val()).cntMtrId;
            unboltJson9["ctmArchiveId"] = unboltJson["ctmArchiveId"];
            unboltJson9["status"] = "2";
            unboltJson9["modifiedTime"] = new Date();
            unboltJson9["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson10["norsdtDetailId"] = gastypeId;
            unboltJson10["isRel"] = "1" ;
            unboltJson10["customerCode"] = unboltJson["customerCode"];
            unboltJson10["modifiedTime"] = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+"-00:00");
            unboltJson10["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            unboltJson10["createdBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
            if(!unboltJson.createTime){
                unboltJson.createTime=moment().format('YYYY-MM-DDTHH:mm:ss')
            }else{
                unboltJson.createTime=moment(unboltJson.createTime,"YYYY-MM-DD").format('YYYY-MM-DDTHH:mm:ss')
            }

            var submitJson = {"sets":[
                {"txid":"1","body":unboltJson,"path":"/gasctmarchive/"+unboltJson["ctmArchiveId"],"method":"put"},
                {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"post"},
                {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"post"},
                {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"post"},
                {"txid":"5","body":unboltJson5,"path":"/gasmrdbusinessruleday/","method":"post"},
                {"txid":"6","body":unboltJson6,"path":"/gasctmcustomer/","method":"post"},
                {"txid":"7","body":unboltJson7,"path":"/gasactgasfeeaccount/","method":"post"},
                {"txid":"8","body":unboltJson8,"path":"/gasactwastefeeaccount/","method":"post"},
                {"txid":"9","body":unboltJson9,"path":"/gasctmcontractmeter/","method":"put"},
                {"txid":"10","body":unboltJson10,"path":"/gascsrunboltnorsdtdetail/","method":"put"}
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
                        window.location = "customer/customer_information.html"
                    });
                }
            }



        }

    });
})






