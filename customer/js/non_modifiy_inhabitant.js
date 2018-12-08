var href = document.location.href;
// 档案ID
var archiveId = href.substring(href.indexOf("?")+1, href.lenth);

var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;



var dateFormat = function (val) {

    if(val) {
        var data = val.split("T");
        var aa = [];
        for (var i = 0; i < data[1].split(":").length; i++) {
            if (i < 2) {
                aa.push(data[1].split(":")[i])
            }
        }
        data[1] = aa.join(":");
        date = data.join(" ");
        return date;
    }
};
// 档案回显
var ctmarchive_result = Restful.findNQ(hzq_rest+"gasctmarchive/"+archiveId);
console.log(ctmarchive_result)
if(JSON.stringify(ctmarchive_result) !="{}"){
    $('#form select,#form input,#form textarea').each(function (index) {
        if(ctmarchive_result.hasOwnProperty($(this).attr('name'))){
            if($(this).attr('name') == "customerType" ){
                var select = $(this).find('option');
                for(var i=0;i<select.length;i++){
                    if(select.eq(i).val() == ctmarchive_result[$(this).attr('name')]){
                        $(this).find('option').eq(i).attr("selected","selected");
                    }
                }
            }else if($(this).attr('name') == "validOrInvalid" ){
                var select = $(this).find('option');
                for(var i=0;i<select.length;i++){
                    if(select.eq(i).val() == ctmarchive_result[$(this).attr('name')]){
                        $(this).find('option').eq(i).attr("selected","selected");
                    }
                }
            }else if($(this).attr('name') == "gasEnvironment" ){
                //用气环境
                $("#gasEnvironment").val(ctmarchive_result[$(this).attr('name')].split(","))
    
            }else if($(this).attr('name') == "alarm" ){
                var select = $(this).find('option');
                for(var i=0;i<select.length;i++){
                    if(select.eq(i).val() == ctmarchive_result[$(this).attr('name')]){
                        $(this).find('option').eq(i).attr("selected","selected");
                    }
                }
            }else if($(this).attr('name') == "deviceProductionTime" ){
    
                $(this).val(dateFormat(ctmarchive_result[$(this).attr('name')]))
    
            }else if($(this).attr('name') == "unboltTime" ){
    
                $(this).val(dateFormat(ctmarchive_result[$(this).attr('name')]))
    
            }else if($(this).attr('name') == "createdTime" ){
                // dateFormat(ctmarchive_result[$(this).attr('name')]);
                $(this).val(dateFormat(ctmarchive_result[$(this).attr('name')]))
            }else if($(this).attr('name') == "customerKind" ){
                var select = $(this).find('option');
                for(var i=0;i<select.length;i++){
                    if(select.eq(i).val() == ctmarchive_result[$(this).attr('name')]){
                        $(this).find('option').eq(i).attr("selected","selected");
                    }
                }
            }else if($(this).attr('name') == "reminderWay" ){
                var select = $(this).find('option');
                for(var i=0;i<select.length;i++){
                    if(select.eq(i).val() == ctmarchive_result[$(this).attr('name')]){
                        $(this).find('option').eq(i).attr("selected","selected");
                    }
                }
            }else if($(this).attr('name') == "issalesRoom" ){
                var select = $(this).find('option');
                for(var i=0;i<select.length;i++){
                    if(select.eq(i).val() == ctmarchive_result[$(this).attr('name')]){
                        $(this).find('option').eq(i).attr("selected","selected");
                    }
                }
            }else if($(this).attr('name') == "rentRoom" ){
                var select = $(this).find('option');
                for(var i=0;i<select.length;i++){
                    if(select.eq(i).val() == ctmarchive_result[$(this).attr('name')]){
                        $(this).find('option').eq(i).attr("selected","selected");
                    }
                }
            }else if($(this).attr('name') == "areaId"){
                var ateaHelper = RefHelper.create({
                    ref_url: "gasbizarea",
                    ref_col: "areaId",
                    ref_display: "areaName",
                });
                $(this).append("<option value='"+ctmarchive_result[$(this).attr('name')]+"' selected>"+ateaHelper.getDisplay(ctmarchive_result[$(this).attr('name')])+"</option>");
            }else if($(this).attr('name') == "gasTypeId"){
                var GastypeHelper = RefHelper.create({
                    ref_url: "gasbizgastype",
                    ref_col: "gasTypeId",
                    ref_display: "gasTypeName",
                });
                $(this).append("<option value='"+ctmarchive_result[$(this).attr('name')]+"' selected>"+GastypeHelper.getDisplay(ctmarchive_result[$(this).attr('name')])+"</option>");
            }else if($(this).attr('name') == "idcardType"){
               var select = $(this).find('option');
               for(var i=0;i<select.length;i++){
                   if(select.eq(i).val() == ctmarchive_result[$(this).attr('name')]*1){
                       $(this).find('option').eq(i).attr("selected","selected");
                   }
               }
            }else{
                $(this).val(ctmarchive_result[$(this).attr('name')]);
            }
    
        }
    });
}

// 合同

var loginarea = [];
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
        })
    }
});
var bd = {
    "cols": "ca.contract_no,ca.use_gas_person,b.meter_code,b.cnt_mtr_id",
    "froms": "gas_ctm_contract ca inner join gas_ctm_contract_meter b on b.contract_id = ca.contract_id ",
    "wheres": "ca.area_id ='"+ctmarchive_result.areaId+"' and ca.gas_kind='9'",
    "page": false
};
$.ajax({
    type: 'get',
    url:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function(data) {
        if(data.rows){
            $.each(data.rows,function(index,item){
                $("#contractId").append("<option value='"+item.cntMtrId+"'>合同编号:"+item.contractNo+" 表编号:"+item.meterCode+" </option>");
            })
        }
    }
});
var queryCondionss = RQLBuilder.and([
    RQLBuilder.equal("ctmArchiveId",archiveId),
    RQLBuilder.equal("status","2"),
]).rql()
var resultcont = Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query='+queryCondionss);
console.log(resultcont)
if(resultcont.length>0){
    console.log(JSON.stringify(resultcont[0]))
    // var resultconts = Restful.findNQ(hzq_rest + 'gasctmcontract/?query={"contractId":"'+resultcont[0].contractId+'"}');
    $("#contractId").val(resultcont[0].cntMtrId).trigger("change");
}

// 承租人信息
var renter_result = Restful.findNQ(hzq_rest+'gasctmrenter/?query={"ctmArchiveId":"'+archiveId+'"}');
console.log(renter_result);
if(renter_result.length){
    $('#form2 input,#form2 select').each(function (index) {
        $(this).attr("name");
        if(renter_result[0].hasOwnProperty($(this).attr('name'))){

            if($(this).attr('name') == "lesseeCerType"){
                console.log(renter_result[0][$(this).attr('name')])
                var select = $(this).find('option');
                for(var i=0;i<select.length;i++){
                    if(select.eq(i).val() == renter_result[0][$(this).attr('name')]*1){
                        $(this).find('option').eq(i).attr("selected","selected");
                    }
                }
            }else{
                $(this).val(renter_result[0][$(this).attr('name')]);
            }

        }
    });
}

// 表户
if(ctmarchive_result.customerState != "00"){
    var inputQuery = RQLBuilder.and([
        RQLBuilder.equal("ctmArchiveId", archiveId),
        RQLBuilder.condition("meterUserState", "$ne","99")
    ]).rql();
    var coefficient = Restful.findNQ(hzq_rest + 'gasctmmeter/?query=' + inputQuery);
    console.log(coefficient)
    if (coefficient.length) {
        $.each(coefficient[0], function (key, val) {
            $("form[name='formctmmeter'] input[name='"+key+"']").val(val)
            $("form[name='formctmmeter'] select[name='"+key+"']").val(val).trigger("change")
        })
    }
}
// 抄表本
if(ctmarchive_result.bookId){
    console.log(ctmarchive_result.bookId)
    var books = Restful.findNQ(hzq_rest + 'gasmrdbook/' + ctmarchive_result.bookId);
    $("#bookId").append("<option value='"+books.bookId+"'>"+books.bookCode+"</option>");
    $('#form input,#form select').each(function (index) {
        $(this).attr("name");
        if(books.hasOwnProperty($(this).attr('name'))){

            if($(this).attr('name') == "countperId"){
                var GastypeHelper = RefHelper.create({
                    ref_url: "gassysuser",
                    ref_col: "userId",
                    ref_display: "employeeName",
                });
                $(this).append("<option value='"+books[$(this).attr('name')]+"' selected>"+GastypeHelper.getDisplay(books[$(this).attr('name')])+"</option>").trigger("change");
            }else if($(this).attr('name') == "serviceperId"){
                var GastypeHelper = RefHelper.create({
                    ref_url: "gassysuser",
                    ref_col: "userId",
                    ref_display: "employeeName",
                });
                $(this).append("<option value='"+books[$(this).attr('name')]+"' selected>"+GastypeHelper.getDisplay(books[$(this).attr('name')])+"</option>").trigger("change");
            }else{
                $(this).val(books[$(this).attr('name')]);
            }

        }
    });
}
// 房屋
if(ctmarchive_result.houseId){
    console.log(ctmarchive_result.houseId)
    var house = Restful.findNQ(hzq_rest + 'gasctmhouse/' + ctmarchive_result.houseId);
    console.log(house)
    $('#form1 input, textarea,select').each(function (index) {
        $(this).attr("name");
        if(house.hasOwnProperty($(this).attr('name'))){
            $(this).val(house[$(this).attr('name')]);
        }
    });
}
$("#save_btn").on("click",function () {
    // 档案
    var unboltJson = $("#form").serializeObject();
    // 房屋 house
    var unboltJson1 = $("#form1").serializeObject();
    // 承租人 
    var unboltJson2 = $("#form2").serializeObject();
    // 表户
    var unboltJson6 = $("#formctmmeter").serializeObject();
    // 合同新
    var unboltJson4={};
    // 合同旧
    var unboltJson5 ={};
    if(resultcont.length){
        unboltJson5=resultcont[0];
    }
    
    var unboltJson3={};
    
    unboltJson["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    unboltJson["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
    if($("#gasEnvironment").val()){
        unboltJson["gasEnvironment"] = $("#gasEnvironment").val().join();
    }
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


    unboltJson["customerAddress"]  = customerAddresss;
    unboltJson1["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    unboltJson1["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

    unboltJson2["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    unboltJson2["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

    unboltJson6["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    unboltJson6["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;


    var resulte = Restful.findNQ(hzq_rest + 'gaschgaccount/?query={"ctmArchiveId":"'+unboltJson.ctmArchiveId+'"}')

    unboltJson3['chgAccountId'] = resulte[0].chgAccountId;
    unboltJson3['linkman'] = unboltJson.bllContactName;
    unboltJson3['linkmanTel'] = unboltJson.bllContactPhone;
    unboltJson3['linkmanPhone'] = unboltJson.bllContactMobile;
    unboltJson3['linkmanMail'] = unboltJson.bllContactMobile;
    unboltJson3['linkmanAddress'] = unboltJson.bllContactAddress;
    unboltJson3['invoiceType'] = unboltJson.invoiceType;
    unboltJson3['invoiceName'] = unboltJson.invoiceTitle;
    unboltJson3['accountType'] = "0";
    unboltJson3["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    unboltJson3["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
    var submitJson = {"sets":[
        // {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
        // {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"PUT"},
        // {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"PUT"},
        // {"txid":"2","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
    ]}
    console.log(house)
    if(house && JSON.stringify(house) !="{}"){

        submitJson["sets"].push({"txid":"1","body":unboltJson1,"path":"/gasctmhouse/","method":"PUT"})
    }else{
        var houseid =$.md5(JSON.stringify(unboltJson1)+new Date()+Math.random())
        unboltJson1["houseId"] = houseid;
        unboltJson["houseId"] = houseid;
        submitJson["sets"].push({"txid":"1","body":unboltJson1,"path":"/gasctmhouse/","method":"POST"})
    }
    console.log(renter_result)
    if(renter_result.length>0){
        submitJson["sets"].push({"txid":"2","body":unboltJson2,"path":"/gasctmrenter/","method":"PUT"})
    }else{
        var renterid =$.md5(JSON.stringify(unboltJson2)+new Date()+Math.random())
        unboltJson2["renterId"] = renterid;
        unboltJson2["ctmArchiveId"] = archiveId;
        submitJson["sets"].push({"txid":"2","body":unboltJson2,"path":"/gasctmrenter/","method":"POST"})
    }
console.log($("#contractId").val())
console.log(resultcont.length)
    if($("#contractId").val() && resultcont.length && $("#contractId").val()!= resultcont[0].cntMtrId){
        unboltJson4["ctmArchiveId"] = archiveId;
        unboltJson4["status"] = "2";
        unboltJson4["cntMtrId"] = $("#contractId").val();
        unboltJson4["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
        unboltJson4["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

        unboltJson5["ctmArchiveId"] = "";
        unboltJson5["status"] = "1";
        unboltJson5["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
        unboltJson5["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

        submitJson["sets"].push({"txid":"3","body":unboltJson4,"path":"/gasctmcontractmeter/","method":"PUT"})
        submitJson["sets"].push({"txid":"4","body":unboltJson5,"path":"/gasctmcontractmeter/","method":"PUT"})
    }else if($("#contractId").val() && !resultcont.length){
        unboltJson4["ctmArchiveId"] = archiveId;
        unboltJson4["status"] = "2";
        unboltJson4["cntMtrId"] = $("#contractId").val();
        unboltJson4["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
        unboltJson4["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

        submitJson["sets"].push({"txid":"3","body":unboltJson4,"path":"/gasctmcontractmeter/","method":"PUT"})
    }
    submitJson["sets"].push({"txid":"5","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"})
    submitJson["sets"].push({"txid":"6","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"})
    submitJson["sets"].push({"txid":"7","body":unboltJson6,"path":"/gasctmmeter/","method":"PUT"})
    console.log(submitJson)


    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)
    if(result.success == false){
        bootbox.alert("提交失败");
    }else if(result.success == undefined){
        if(result.results[0]["result"]['success']) {
            bootbox.alert("提交成功", function () {
                history.go("-1");
            });
        }
    }
})

$("#cancel_btn").on('click',function(){
    history.go('-1')
})