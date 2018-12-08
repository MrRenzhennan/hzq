/**
 * Created by Administrator on 2017/5/23 0023.
 */
var href = document.location.href;
var archiveId = href.substring(href.indexOf("?")+1, href.lenth);
console.log(archiveId)





var house;

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
        })
    }
});
console.log(loginarea);
var bd = {
    "cols": "ca.contract_no,ca.use_gas_person,b.meter_code",
    "froms": "gas_ctm_contract ca left join gas_ctm_contract_meter b on b.contract_id = ca.contract_id ",
    "wheres": "b.status='1' and ca.area_id in ("+loginarea.join()+") and ca.gas_kind='9'",
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
                $("#contractId").append("<option value='"+JSON.stringify(item)+"'>合同编号:"+item.contractNo+" 表编号:"+item.meterCode+" </option>");
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
    var resultconts = Restful.findNQ(hzq_rest + 'gasctmcontract/?query={"contractId":"'+resultcont[0].contractId+'"}');
    $("#contractId").append("<option value='"+JSON.stringify(resultcont[0])+"'>合同编号:"+resultconts[0].contractNo+" 表编号:"+resultcont[0].meterCode+" </option>");
    $("#contractId").val(JSON.stringify(resultcont[0])).trigger("change");

}



var idcard = {"1":"营业执照","2":"法人身份证","3":"房产证","4":"租房合同","5":"居民身份证"};
$.map(idcard,function(index,val){
    $("#lesseeCerType").append("<option value='"+val+"'>"+index+"</option>");
})

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
        console.log(data.join(" "));
        date = data.join(" ");
        return date;
    }
};

$.ajax({
    url:hzq_rest + 'gasctmrenter?query={"ctmArchiveId":"'+archiveId+'"}',
    type:"get",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function(data){
        console.log(data)
        if(data.length){
            $('#form2 input,#form2 select').each(function (index) {
                console.log($(this).attr('name'))
                $(this).attr("name");

                console.log(data[0].hasOwnProperty($(this).attr('name')))
                if(data[0].hasOwnProperty($(this).attr('name'))){

                    if($(this).attr('name') == "lesseeCerType"){
                        console.log(data[0][$(this).attr('name')])
                        var select = $(this).find('option');
                        for(var i=0;i<select.length;i++){
                            if(select.eq(i).val() == data[0][$(this).attr('name')]*1){
                                $(this).find('option').eq(i).attr("selected","selected");
                            }
                        }
                    }else{
                        $(this).val(data[0][$(this).attr('name')]);
                    }

                }
            });
        }
    }
})

$.ajax({
    url:hzq_rest + "gasctmarchive/"+archiveId,
    type:"get",
    // data:JSON.stringify(bd),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function(data){
        console.log(data)
        house = data;
        if(data.customerState != "00"){
            var inputQuery = RQLBuilder.and([
                RQLBuilder.equal("ctmArchiveId", archiveId),
                RQLBuilder.equal("meterUserState", "01")
            ]).rql();
            var coefficient = Restful.findNQ(hzq_rest + 'gasctmmeter/?query=' + inputQuery);
            if (coefficient.length) {
                $.each(coefficient[0], function (key, val) {
                    $("form[name='formctmmeter'] input[name='"+key+"']").val(val)
                    $("form[name='formctmmeter'] select[name='"+key+"']").val(val).trigger("change")
                })
            }
        }

        if(data.bookId){
            console.log(data.bookId)
            bookid(data)
        }
        if(data.houseId){
            console.log(data.houseId)
            houseid(data);
        }
        $('#form select,#form input,#form textarea').each(function (index) {
            if(data.hasOwnProperty($(this).attr('name'))){
                if($(this).attr('name') == "customerType" ){
                    var select = $(this).find('option');
                    for(var i=0;i<select.length;i++){
                        if(select.eq(i).val() == data[$(this).attr('name')]){
                            $(this).find('option').eq(i).attr("selected","selected");
                        }
                    }
                }else if($(this).attr('name') == "validOrInvalid" ){
                    var select = $(this).find('option');
                    for(var i=0;i<select.length;i++){
                        if(select.eq(i).val() == data[$(this).attr('name')]){
                            $(this).find('option').eq(i).attr("selected","selected");
                        }
                    }
                }else if($(this).attr('name') == "gasEnvironment" ){
                    //用气环境
                    console.log(data[$(this).attr('name')].split(","));
                    $("#gasEnvironment").val(data[$(this).attr('name')].split(","))

                }else if($(this).attr('name') == "alarm" ){
                    var select = $(this).find('option');
                    for(var i=0;i<select.length;i++){
                        if(select.eq(i).val() == data[$(this).attr('name')]){
                            $(this).find('option').eq(i).attr("selected","selected");
                        }
                    }
                }else if($(this).attr('name') == "deviceProductionTime" ){

                    $(this).val(dateFormat(data[$(this).attr('name')]))

                }else if($(this).attr('name') == "unboltTime" ){

                    $(this).val(dateFormat(data[$(this).attr('name')]))

                }else if($(this).attr('name') == "createdTime" ){
                    // dateFormat(data[$(this).attr('name')]);
                    $(this).val(dateFormat(data[$(this).attr('name')]))
                }else if($(this).attr('name') == "customerKind" ){
                    var select = $(this).find('option');
                    for(var i=0;i<select.length;i++){
                        if(select.eq(i).val() == data[$(this).attr('name')]){
                            $(this).find('option').eq(i).attr("selected","selected");
                        }
                    }
                }else if($(this).attr('name') == "reminderWay" ){
                    console.log(0)
                    var select = $(this).find('option');
                    for(var i=0;i<select.length;i++){
                        if(select.eq(i).val() == data[$(this).attr('name')]){
                            $(this).find('option').eq(i).attr("selected","selected");
                        }
                    }
                }else if($(this).attr('name') == "issalesRoom" ){
                    var select = $(this).find('option');
                    for(var i=0;i<select.length;i++){
                        if(select.eq(i).val() == data[$(this).attr('name')]){
                            $(this).find('option').eq(i).attr("selected","selected");
                        }
                    }
                }else if($(this).attr('name') == "rentRoom" ){
                    var select = $(this).find('option');
                    for(var i=0;i<select.length;i++){
                        if(select.eq(i).val() == data[$(this).attr('name')]){
                            $(this).find('option').eq(i).attr("selected","selected");
                        }
                    }
                }else if($(this).attr('name') == "areaId"){
                    var ateaHelper = RefHelper.create({
                        ref_url: "gasbizarea",
                        ref_col: "areaId",
                        ref_display: "areaName",
                    });

                    console.log(data[$(this).attr('name')])
                    $(this).append("<option value='"+data[$(this).attr('name')]+"' selected>"+ateaHelper.getDisplay(data[$(this).attr('name')])+"</option>");
                }else if($(this).attr('name') == "gasTypeId"){
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gasbizgastype",
                        ref_col: "gasTypeId",
                        ref_display: "gasTypeName",
                    });
                    $(this).append("<option value='"+data[$(this).attr('name')]+"' selected>"+GastypeHelper.getDisplay(data[$(this).attr('name')])+"</option>");
                }else if($(this).attr('name') == "idcardType"){
                   var select = $(this).find('option');
                   for(var i=0;i<select.length;i++){
                       if(select.eq(i).val() == data[$(this).attr('name')]*1){
                           $(this).find('option').eq(i).attr("selected","selected");
                       }
                   }
                }else{
                    $(this).val(data[$(this).attr('name')]);
                }

            }
        });
    }
})

function houseid(dat){
    $.ajax({
        url: hzq_rest + "gasctmhouse/" + dat.houseId,
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data)
            $('#form1 input, textarea,select').each(function (index) {
                $(this).attr("name");
                if(data.hasOwnProperty($(this).attr('name'))){
                    $(this).val(data[$(this).attr('name')]);
                }
            });
        }
    })
}

function bookid(da){
    $.ajax({
        url: hzq_rest + "gasmrdbook/" + da.bookId,
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data)
            $("#bookId").append("<option value='"+data.bookId+"'>"+data.bookCode+"</option>");
            $('#form input,#form select').each(function (index) {
                //  console.log($(this).attr('name'))
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
                        $(this).append("<option value='"+data[$(this).attr('name')]+"' selected>"+GastypeHelper.getDisplay(data[$(this).attr('name')])+"</option>").trigger("change");
                    }else if($(this).attr('name') == "serviceperId"){
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gassysuser",
                            ref_col: "userId",
                            ref_display: "employeeName",
                        });
                        $(this).append("<option value='"+data[$(this).attr('name')]+"' selected>"+GastypeHelper.getDisplay(data[$(this).attr('name')])+"</option>").trigger("change");
                    }else{
                        $(this).val(data[$(this).attr('name')]);
                    }

                }
            });
        }
    })
}

$("#save_btn").on("click",function (e) {
   e.preventDefault();
   // $("#areaId").removeAttr('disabled');
   // $("#gasTypeId").removeAttr('disabled');
   // $("#countperId").removeAttr('disabled');
   // $("#serviceperId").removeAttr('disabled');
   // $("#customerKind").removeAttr("disabled");


    /*console.log(house);
    if(!$("#contractId").val()){
        bootbox.alert("<center><h4>请选择合同。</h4></center>")
        return false;
    }*/


    console.log("form:"+$.toJSON($("#form").serializeObject()));
    console.log("form1:"+$.toJSON($("#form1").serializeObject()));
    console.log("form2:"+$.toJSON($("#form2").serializeObject()));
    var unboltJson = $("#form").serializeObject();
    var unboltJson1 = $("#form1").serializeObject();
    var unboltJson2 = $("#form2").serializeObject();
    var unboltJson3 = {};
    var unboltJson9={};
    var unboltJson10 = $("#formctmmeter").serializeObject();
    console.log(unboltJson)
    if(house.customerKind == "9" && $("#contractId").val()){

        unboltJson9["cntMtrId"] = JSON.parse($("#contractId").val()).cntMtrId;
        unboltJson9["ctmArchiveId"] = unboltJson["ctmArchiveId"];
        unboltJson9["status"] = "2";
        unboltJson9["modifiedTime"] = new Date();
        unboltJson9["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
    }


    console.log(unboltJson1.borough)

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






    if($("#gasEnvironment").val()){
        unboltJson["gasEnvironment"] = $("#gasEnvironment").val().join();
    }
    // console.log(customerAddresss)
    unboltJson["customerAddress"]  = customerAddresss;
    unboltJson["meterUserName"]  = unboltJson10["meterUserName"];
    unboltJson["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    unboltJson["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
    // 联合账户
    unboltJson1["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    unboltJson1["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
    unboltJson2["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    unboltJson2["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
    unboltJson10["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    unboltJson10["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

    var resulte = Restful.findNQ(hzq_rest + 'gaschgaccount/?query={"ctmArchiveId":"'+unboltJson.ctmArchiveId+'"}')
    // unboltJson3["ctmArchiveId"] = unboltJson.ctmArchiveId;
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
    console.log(unboltJson3);
    var archiveresulte = Restful.getByID(hzq_rest + 'gasctmarchive',archiveId );
    console.log(archiveresulte.houseId)
    var renterresulte = Restful.findNQ(hzq_rest + 'gasctmrenter/?query={"ctmArchiveId":"'+unboltJson.ctmArchiveId+'"}');
    console.log(renterresulte)




    console.log(unboltJson)
    if(!archiveresulte.houseId){
        var uuid = $.md5($("#form1").serializeObject() + new Date().getTime() + Math.random());
        unboltJson["houseId"] = uuid;
        unboltJson1["houseId"] = uuid;
        if(house.customerKind == "9" && $("#contractId").val()){
            console.log(JSON.stringify(resultcont[0]))
            console.log($("#contractId").val())
            if((JSON.stringify(resultcont[0]) == $("#contractId").val()) || !resultcont.lenght){
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"POST"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"PUT"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                    {"txid":"5","body":unboltJson10,"path":"/gasctmmeter/","method":"PUT"}

                ]}
            }else if (resultcont.lenght){
                resultcont[0]["status"] = '3';
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"POST"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"PUT"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                    {"txid":"5","body":unboltJson9,"path":"/gasctmcontractmeter/","method":"PUT"},
                    {"txid":"6","body":resultcont[0],"path":"/gasctmcontractmeter/","method":"PUT"},
                    {"txid":"7","body":unboltJson10,"path":"/gasctmmeter/","method":"PUT"}
                ]}
            }

        }else{
            if(house.customerKind == "9"){
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"POST"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"PUT"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                    {"txid":"5","body":unboltJson10,"path":"/gasctmmeter/","method":"PUT"}
                ]}
            }else{
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"POST"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"PUT"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},

                ]}
            }

        }

    }else if(!renterresulte.length){
        var uuid = $.md5($("#form1").serializeObject() + new Date().getTime() + Math.random());
        unboltJson2["renterId"] = uuid;
        unboltJson2["ctmArchiveId"] = unboltJson.ctmArchiveId;
        if(house.customerKind == "9"  && $("#contractId").val()){
            console.log(JSON.stringify(resultcont[0]))
            console.log($("#contractId").val())
            if((JSON.stringify(resultcont[0]) == $("#contractId").val()) || !resultcont.lenght){

                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"PUT"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"POST"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                    {"txid":"5","body":unboltJson9,"path":"/gasctmcontractmeter/","method":"PUT"},
                    {"txid":"6","body":unboltJson10,"path":"/gasctmmeter/","method":"PUT"}
                ]}
            }else if (resultcont.lenght){
                resultcont[0]["status"] = '3';
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"PUT"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"POST"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                    {"txid":"5","body":unboltJson9,"path":"/gasctmcontractmeter/","method":"PUT"},
                    {"txid":"6","body":resultcont[0],"path":"/gasctmcontractmeter/","method":"PUT"},
                    {"txid":"7","body":unboltJson10,"path":"/gasctmmeter/","method":"PUT"}
                ]}
            }

        }else{
            if(house.customerKind == "9"){
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"PUT"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"POST"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                    {"txid":"5","body":unboltJson10,"path":"/gasctmmeter/","method":"PUT"}
                ]}
            }else{
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"PUT"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"POST"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                ]}
            }

        }

    }else {
        if(house.customerKind == "9" && $("#contractId").val()){
            console.log(JSON.stringify(resultcont[0]))
            console.log($("#contractId").val())
            if((JSON.stringify(resultcont[0]) == $("#contractId").val()) || !resultcont.lenght){
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"PUT"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"PUT"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                    {"txid":"5","body":unboltJson9,"path":"/gasctmcontractmeter/","method":"PUT"},
                    {"txid":"6","body":unboltJson10,"path":"/gasctmmeter/","method":"PUT"}
                ]}
            }else if (resultcont.lenght){
                resultcont[0]["status"] = '3';
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"PUT"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"PUT"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                    {"txid":"5","body":unboltJson9,"path":"/gasctmcontractmeter/","method":"PUT"},
                    {"txid":"6","body":resultcont[0],"path":"/gasctmcontractmeter/","method":"PUT"},
                    {"txid":"7","body":unboltJson10,"path":"/gasctmmeter/","method":"PUT"}
                ]}
            }

        }else{
            if(house.customerKind == "9"){
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"PUT"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"PUT"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                    {"txid":"5","body":unboltJson10,"path":"/gasctmmeter/","method":"PUT"}
                ]}
            }else{
                var submitJson = {"sets":[
                    {"txid":"1","body":unboltJson,"path":"/gasctmarchive/","method":"PUT"},
                    {"txid":"2","body":unboltJson1,"path":"/gasctmhouse/","method":"PUT"},
                    {"txid":"3","body":unboltJson2,"path":"/gasctmrenter/","method":"PUT"},
                    {"txid":"4","body":unboltJson3,"path":"/gaschgaccount/","method":"PUT"},
                ]}
            }

        }

    }
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

});

$("#cancel_btn").on('click',function(){
    history.go('-1')
})