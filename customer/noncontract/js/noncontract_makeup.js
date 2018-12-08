var contractId = Metronic.getURLParameter("refno");

var contract_result = Restful.findNQ(hzq_rest+"gasctmcontract/"+contractId);

console.log(contract_result)

var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/" + '?query={"parentTypeId":"3"}"',
    ref_col: "gasTypeId",
    ref_display: "gasTypeName"
});
$.map(gasTypeHelper.getData(), function (value, key) {
    $('#gasType').append('<option value="' + key + '">' + value + '</option>');
});

$.each(contract_result,function (key, val) {
    $("input[name='"+key+"']").val(val).trigger("change");
    $("select[name='"+key+"']").val(val).trigger("change");
})
if(contract_result.gasType){
    $("#gasType").val(contract_result.gasType.split(',')).trigger("change")
}
if(contract_result.customerType){
    $("#find_customerType").val(contract_result.customerType.split(',')).trigger("change")
}

if(contract_result.reservedField2){
    picpath = contract_result.reservedField2.split(",");
    $.each(picpath,function(index){
        pic(picpath[index]);
    });
}
//图片
function pic(busiId){
    $.ajax({
        url: hzq_rest+"gasbasfile?fields={}&query={\"busiId\":\"" + busiId + "\"}",
        method: "get",
        async: false,
        dataType: "json",
        success: function (data) {
            if(data && data.length > 0){
                for(var i=0; i<data.length;i++){
                    var datali = data[i];
                    $("#grid").append("<li><figure><img src='/hzqs/sys/download.do?fileId="+datali.fileId+"&w=300' alt='"+datali.fileName+"'/></figure></li>")
                    $("#slideId").append("<li><figure><img src='/hzqs/sys/download.do?fileId="+datali.fileId+"' alt='"+datali.fileName+"'/></figure></li>")
                }
            }

            console.log("ssdsds"+JSON.stringify(data));
        },
        error: function (data) {
            bootbox.alert(data);
        }

    });

}
if(contract_result.contractState != "0" && contract_result.reservedField1 =="2"){
    $('#add_btn').hide();
}

var metermodel = RefHelper.create({
    ref_url: "gasmtrmeterspec",
    ref_col: "meterModelId",
    ref_display: "meterModelName",
})
var metertype = RefHelper.create({
    ref_url: "gasmtrmetertype",
    ref_col: "meterTypeId",
    ref_display: "meterTypeName",
})
var factory = RefHelper.create({
    ref_url: "gasmtrfactory",
    ref_col: "factoryId",
    ref_display: "factoryName",
})
var dateForat = function(val){

    if(val){
        date = val.split("T")[0];
        return date;
    }else{
        return "";
    }

}

// 添加行
var state = true;
$('#add_btn').on("click",addhang);
function addhang() {
    console.log(state)
    if(state){
        var item = "" +
            "<tr>" +
            "<td width='15px' class='remove_item'><span class='glyphicon glyphicon-remove'></span></td>" +
            "<td><input type=\"text\" name=\"meterNo\" class=\"form-control meternumber\" placeholder=\"表编号\"></td>"+
            "<td><input type=\"text\" name=\"meterModelId\" class=\"form-control\" placeholder=\"型号\" readonly></td>"+
            "<td><input type=\"text\" name=\"meterTypeId\" class=\"form-control\" placeholder=\"类型\" readonly></td>"+
            "<td><input type=\"text\" name=\"factoryId\" class=\"form-control\" placeholder=\"厂家\" readonly></td>"+
            "<td><input type=\"text\" name=\"productionDate\" class=\"form-control\" placeholder=\"出厂时间\" readonly></td>" +
            "</tr>";
        $('#tbody').append(item);
        $('.remove_item').click(function () {
            $(this).parent().remove();
        });
    }else {
        return false;
    }
}

if((contract_result.contractState == "0" && contract_result.reservedField1 == "2") || (contract_result.contractState == "1" && contract_result.reservedField1 == "2") || (contract_result.contractState == "6" && contract_result.reservedField1 == "2")){

    var queryCondion = RQLBuilder.and([
        RQLBuilder.equal("contractId",contract_result.contractId),
        RQLBuilder.equal("status","1")
    ]).rql()

    console.log(contract_result.contractId)
    var metercontract = Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query=' + queryCondion)
    console.log(metercontract)
    if(metercontract.length){
        var str = "";
        $.each(metercontract,function(index,item){
            var meterinfo = Restful.findNQ(hzq_rest + 'gasmtrmeter/?query={"meterNo":"'+item.meterCode+'"}')
            console.log(meterinfo);
            if(meterinfo.length){
                str+="<tr>" +
                    "<td width='15px' class='remove_item'></td>" +
                    "<td><input type=\"text\" name=\"meterNo\" class=\"form-control meternumber\" placeholder=\"表编号\" value='"+item.meterCode+"'></td>"+
                    "<td><input type=\"text\" name=\"meterModelId\" class=\"form-control\" placeholder=\"型号\" readonly value='"+metermodel.getDisplay(meterinfo[0].meterModelId)+"'></td>"+
                    "<td><input type=\"text\" name=\"meterTypeId\" class=\"form-control\" placeholder=\"类型\" readonly value='"+metertype.getDisplay(meterinfo[0].meterTypeId)+"'></td>"+
                    "<td><input type=\"text\" name=\"factoryId\" class=\"form-control\" placeholder=\"厂家\" readonly value='"+factory.getDisplay(meterinfo[0].factoryId)+"' ></td>"+
                    "<td><input type=\"text\" name=\"productionDate\" class=\"form-control\" placeholder=\"出厂时间\" readonly value='"+dateForat(meterinfo[0].productionDate)+"'  ></td>" +
                    "</tr>";
            }
        })
        $("#tbody").html(str);
        $("#add_btn").hide();
    }

    $("#add_btn").hide();
}
//表具信息
var metermodel = RefHelper.create({
    ref_url: "gasmtrmeterspec",
    ref_col: "meterModelId",
    ref_display: "meterModelName",
})
var metertype = RefHelper.create({
    ref_url: "gasmtrmetertype",
    ref_col: "meterTypeId",
    ref_display: "meterTypeName",
})
var factory = RefHelper.create({
    ref_url: "gasmtrfactory",
    ref_col: "factoryId",
    ref_display: "factoryName",
})
var dateForat = function(val){

    if(val){
        date = val.split("T")[0];
        return date;
    }else{
        return "";
    }

}
if(contract_result.contractState == "6" && contract_result.reservedField1 == "2"){
    $(".meternumber").attr("readonly",true)
}

var meterarr = [];
$(document).on("blur",".meternumber",function(){
    meterinfomation($(this).val(),$(this));
})


function meterinfomation(meterNo,that){
    console.log($(that).parents("tr"))
    $.ajax({
        type: 'get',
        url: hzq_rest + "gasmtrmeter/?query={\"meterNo\":\""+meterNo+"\"}",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            console.log(data)
            if(data.length){
                meterarr = [];
                $.each(data[0],function(key,val){
                    if(key == "meterModelId"){
                        $(that).closest("tr").find("input[name='"+key+"']").val(metermodel.getDisplay(val));
                    }else if(key == "meterTypeId"){
                        $(that).closest("tr").find("input[name='"+key+"']").val(metertype.getDisplay(val));
                    }else if(key == "factoryId"){
                        $(that).closest("tr").find("input[name='"+key+"']").val(factory.getDisplay(val));
                    }else if(key == "productionDate"){
                        $(that).closest("tr").find("input[name='"+key+"']").val(dateForat(val))
                    }
                })
                var resultqs = Restful.findNQ( hzq_rest +'gasctmcontractmeter/?query={"meterCode":"'+meterNo+'"}');
                console.log(resultqs);
                if(resultqs.length>0){
                    bootbox.alert("<center><h4>该表已有对应合同。</h4></center>");
                    $("#save_btn").attr("disabled",true)
                    $("#add_btn").hide();
                }else{
                    $("#save_btn").attr("disabled",false)
                    $("#add_btn").show();
                }

                //$("#save_btn").attr("disabled",false);
                state= true;
            }else if(meterNo){

                // meterarr = [];
                // meterarr.push(meterNo);
                bootbox.alert("<center><h4>表编号为"+meterNo+"的表不存在，请先录入此表的表具信息。</h4></center>");
                $("#save_btn").attr("disabled",true);
                state = false;
            }
        },
        error: function(err) {

        }
    });

}

// opinion_msg

if(contract_result.reservedField1 == "2"){
    console.log(contract_result.activityInstanceId)
    var yijian = Restful.findNQ(hzq_rest + "psmstepinst/"+contract_result.activityInstanceId)
    console.log(yijian)
    $("#opinion_msg").html(yijian.propstr256);
}else{
    $("#spyjs").hide();
}

// 保存提交流程
$("#save_btn").on("click",function(e){

    $("#form select").on("change",function(){
        $("#form").valid();
    })
    $("#form input").on("change",function(){
        $("#form").valid();
    })
    if(!$("#form").valid()){
        return;
    }

    

    var form = $('#form').serializeObject();
        form["gasType"]=$("#gasType").val().join();
        // form["customerType"]=$('#find_customerType').val().join();
        form["reservedField1"]="0";
       
    
    if(gpypictureId && contract_result.reservedField2){
        form["reservedField2"] =contract_result.reservedField2+ ","+fileId;
    }else if(contract_result.reservedField2 && !gpypictureId){
        form["reservedField2"] =contract_result.reservedField2;
    }else if(!contract_result.reservedField2 && gpypictureId){
        form["reservedField2"] =fileId;
    }else{
        form["reservedField2"] = "";
    }

    form["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    form["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
    console.log(form["reservedField2"]);


    var meterNo=[];
    $("#tbody .meternumber").each(function(index){
        meterNo.push($("#tbody .meternumber").eq(index).val())
    })
   
    if(meterNo[0]== ""){
        bootbox.alert("<center><h4>请输入表编号。</h4></center>");
        return false;
    }
    var s = meterNo.join(",")+",";
    var meterinfo =[];
    for(var i=0;i<meterNo.length;i++) {
        if(s.replace(meterNo[i]+",","").indexOf(meterNo[i]+",")>-1) {
            bootbox.alert("<center><h4>表编号有重复。</h4></center>");
            return false;
        }else{
            meterinfo.push({
                cntMtrId:$.md5(meterNo[i] + new Date().getTime() +Math.random() + Math.random()),
                meterCode: meterNo[i],
                contractId: contractId,
                modifiedTime:new Date(new Date()+"-00:00"),
                modifiedBy:JSON.parse(localStorage.getItem("user_info")).userId,
                createdTime:new Date(new Date()+"-00:00"),
                createdBy:JSON.parse(localStorage.getItem("user_info")).userId,
                status: 1
            })
        }
    }
    
    var Num="";
    for(var i=0;i<6;i++){
        Num+=Math.floor(Math.random()*10);
    };
    var str= $("#useGas").val()+"(合同编号:"+$("#cont").val()+") — 预签";

    if(contract_result.contractState == "1"|| $("#supplyGas").val()){
        str = $("#useGas").val()+"(合同编号:"+$("#cont").val()+") — 新签";
    }
    if(contract_result.contractType == "2" && $("#supplyGas").val()){
        str = $("#useGas").val()+"(合同编号:"+$("#cont").val()+") — 增容新签";
    }
    if(contract_result.contractType == "3" && $("#supplyGas").val()){
        str = $("#useGas").val()+"(合同编号:"+$("#cont").val()+") — 减容新签";
    }
    if(contract_result.contractState == "6" && $("#supplyGas").val()){
        str = $("#useGas").val()+"(合同编号:"+$("#cont").val()+") — 续签";
        form["contractStatus"] = 6
    }
    form["contractId"] = contractId;
    form["activityInstanceId"] = contractId+Num;
    if($("#contractRenew").val() == "Y"){
        form["contractState"] =6;
    }
    var submitJson = {"sets":[
        {"txid":"1","body":meterinfo,"path":"/gasctmcontractmeter/","method":"POST"}
    ]};
    if(contract_result.contractState == "6"  && contract_result.reservedField1 =="2"){
        submitJson = {"sets":[

        ]};
    }
    if(contract_result.contractState != "6"  && contract_result.reservedField1 =="2"){
        form["contractState"] = "1"
        var contractmeter = Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query={"contractId":"'+contract_result.contractId+'"}')
        submitJson["sets"].push({"txid":"3","body":contractmeter,"path":"/gasctmcontractmeter/","method":"DELETE"})
    }

    if(contract_result.contractState == "0" && contract_result.reservedField1 =="1"){
        console.log("00000")
        form["contractState"] = "1"
    }


    submitJson["sets"].push({"txid":"2","body":form,"path":"/gasctmcontract/","method":"PUT"})
    flowjson = {
        "flow_def_id":"FJMHT",
        "ref_no":contractId +Num,
        "be_orgs":JSON.parse(localStorage.getItem("user_info")).area_id,
        "operator":JSON.parse(localStorage.getItem("user_info")).userId,
        "flow_inst_id":contractId  +Num,
        "propstr2048":JSON.stringify(form),
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":str,
        "propstr256":$("#opinion_msg").html(),
        "propstr128":"营业部合同管理员",
        "override_exists":false
    };
    $.ajax({
        type: 'POST',
        url:  "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(submitJson),
        success: function(data) {
            var retFlag = true;
            for(var i=0;i<data.results.length;i++){
                if(!data.results[i].result.success){
                    retFlag=false;
                    break;
                }
            }
            if(retFlag){
                var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson)
                console.log(flow_result)
                if(flow_result.retmsg == "SUCCESS:1"){
                    bootbox.alert("<center><h4>提交成功</h4></center>",function(){
                        history.go("-1")
                    });
                }else{
                    var submitJsons = {"sets":[
                        {"txid":"1","body":contract_result,"path":"/gasctmcontract/","method":"PUT"},
                        {"txid":"2","body":meterinfo,"path":"/gasctmcontractmeter/","method":"DELETE"}
                    ]};
                    var resultss = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJsons)

                    bootbox.alert("提交失败",function(){
                        history.go("-1")
                    })
                }
                
            }else{
                bootbox.alert("<center><h4>提交失败</h4></center>",function(){
                });
            }
        },
        error: function(err) {
            bootbox.alert("<center><h4>提交失败</h4></center>",function(){
                $("#submit_btn2").button('reset');
            });
            if( err.status==406){
                if(window.location.pathname.indexOf('/login.html')<0)
                {
                    window.location.replace("/login.html?redirect="+window.location.pathname);
                }
            }
        }
    });

    // var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
    // console.log(flow_result);
    // if(flow_result.retmsg == "SUCCESS:1"){
    //     bootbox.alert("<center><h4>提交成功。</h4></center>",function(){
    //         if($("#supplyGas").val()){
    //             // var contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,{"reservedField1":"2"})
    //             console.log(contractresult)
    //         }
    //         history.go("-1");
    //     });
    // }
})

