/**
 * Created by Administrator on 2017/6/5 0005.
 */
SideBar.init();

$('#form input,textarea,select').attr("disabled", "disabled");

var stepid = Metronic.getURLParameter("stepid");

if(stepid){
    SideBar.activeCurByPage("index.html");
}else{
    SideBar.activeCurByPage("contract_noninhabitant.html");
}
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/" + '?query={"parentTypeId":"3"}"',
    ref_col: "gasTypeId",
    ref_display: "gasTypeName"
});
$.map(gasTypeHelper.getData(), function (value, key) {
    $('#gasType').append('<option value="' + key + '">' + value + '</option>');
});
var href = document.location.href;
var refnumber = Metronic.getURLParameter("refno");
var contractmeter = Metronic.getURLParameter("refno");
var contractId = Metronic.getURLParameter("refno");
if(contractId.length>32){
    console.log(contractId.length)
    $(".nav-tabs").show();
    $("#process").show();
    contractId = contractId.substr(0,contractId.length-6);

}else{
    if(stepid){
        $(".contract").hide()
    }else{
        $(".contract").show()
    }

}


console.log(contractId);
$('.contractId').val(contractId);

var results = Restful.findNQ(hzq_rest + "gasctmcontract/"+contractId);
console.log(results)
var stepcontract;
if(stepid && contractmeter.length>32){
    stepcontract = Restful.findNQ(hzq_rest + "psmflowinst/"+stepid);
    console.log(stepcontract.refNo.length)
    if(stepcontract.refNo.length>32){
        console.log(JSON.parse(stepcontract.propstr2048.split("=")[0]));
        console.log(JSON.parse(stepcontract.propstr2048.split("=")[1]));
        $.each(JSON.parse(stepcontract.propstr2048.split("=")[0]),function(key,val){
            $("#form input[name='"+key+"']").val(val);
            $("#form select[name='"+key+"']").val(val).trigger("change");
            $("#form textarea[name='"+key+"']").val(val);
        })
        if(JSON.parse(stepcontract.propstr2048.split("=")[0]).gasType){
            $("#gasType").val(JSON.parse(stepcontract.propstr2048.split("=")[0]).gasType.split(",")).trigger("change")
        }
        if(JSON.parse(stepcontract.propstr2048.split("=")[0]).reservedField2){
            buchuanpic = JSON.parse(stepcontract.propstr2048.split("=")[0]).reservedField2.split(",")
            $.each(buchuanpic,function(index){
                pic(buchuanpic[index]);
            });
        }
        if(stepcontract.propstr2048.split("=")[1]){
            mererinfo(JSON.parse(stepcontract.propstr2048.split("=")[1]))
        }

    }
}else{

    if(results.contractState == "0"){
        $(".contract").hide()
    }

    $.each(results,function (key, val) {
        $("input[name='"+key+"']").val(val).trigger("change");
        $("select[name='"+key+"']").val(val).trigger("change");
    })
    if(results.gasType){
        $("#gasType").val(results.gasType.split(",")).trigger("change");
    }

    if(results.reservedField2){
        var picpath = results.reservedField2.split(",");
        console.log(picpath)
        $.each(picpath,function(index){
            pic(picpath[index]);
        });
    }

    var meterresults =  Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query={"contractId":"'+contractId+'"}');
    console.log(meterresults)
    var meterNo = [];
    $.each(meterresults,function(index,item){
        meterNo.push(item.meterCode);
    });
    console.log(meterNo)
    mererinfo(meterNo)

}



var doBusi=function(step){
    console.log(step)
    if(step.results == "0"){

        if(contractmeter.length>32){
            if( results.contractState == "9" && results.reservedField1=="2"){
                var contractmeterresult = Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query={"contractId":"'+contractId+'"}');
                $.each(contractmeterresult,function(ind,item){
                    console.log(Restful.delByID(hzq_rest +"gasctmcontractmeter",item.cntMtrId))
                })
                var contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,JSON.parse(stepcontract.propstr2048.split("=")[0]))
                console.log(contractresult);

            }else{
                var contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,JSON.parse(stepcontract.propstr2048.split("=")[0]))
                console.log(contractresult);
                var meterNo=[];
                $.each(JSON.parse(stepcontract.propstr2048.split("=")[1]),function(index,val){
                    console.log(val)
                    var contractMeter = {};
                    contractMeter["meterCode"] = val;
                    contractMeter["contractId"] = contractId;
                    console.log(contractMeter);
                    var result = Restful.postDataR(hzq_rest + "gasctmcontractmeter",JSON.stringify(contractMeter));
                    console.log(result);
                })
            }

        }



        if(stepid && contractmeter.length>32){
            if(results.contractState == "6" || JSON.parse(stepcontract.propstr2048.split("=")[0]).contractRenew == "Y"){
                var contractState ={
                    "contractState":"6"
                }
            }else if(results.contractState == "9" && results.reservedField1 == "5"){
                var contractState ={
                    "contractState":"1",
                    "reservedField1":"1"
                }
            }else{
                var contractState ={
                    "contractState":"1"
                }
            }
        }else{
            if(results.contractState == "6" ){
                var contractState ={
                    "contractState":"6"
                }
            }else if(results.contractState == "9" && results.reservedField1 == "5"){
                var contractState ={
                    "contractState":"1",
                    "reservedField1":"1"
                }
            }else{
                var contractState ={
                    "contractState":"1"
                }
            }
        }

        $.ajax({
            url: hzq_rest + "gasctmcontract/" + contractId,
            type: 'PUT',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify(contractState),
            success: function (e) {
                console.log(e)
                if(!e.success){
                    bootbox.alert("合同状态更改失败。")
                }
            }
        })
    }else if(step.results == "1"){

        if(contractmeter.length>32){
            if( results.contractState == "9" && results.reservedField1=="2"){
                var contractmeterresult = Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query={"contractId":"'+contractId+'"}');
                $.each(contractmeterresult,function(ind,item){
                    console.log(item)
                    console.log(Restful.delByIDR(hzq_rest +"gasctmcontractmeter",item.cntMtrId))
                })
                var contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,JSON.parse(stepcontract.propstr2048.split("=")[0]))
                console.log(contractresult);
                $.each(JSON.parse(stepcontract.propstr2048.split("=")[1]),function(index,val){
                    console.log(val)
                    var contractMeter = {};
                    contractMeter["meterCode"] = val;
                    contractMeter["contractId"] = contractId;
                    console.log(contractMeter);
                    var result = Restful.postDataR(hzq_rest + "gasctmcontractmeter",JSON.stringify(contractMeter));
                    console.log(result);
                })

            }else{
                var contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,JSON.parse(stepcontract.propstr2048.split("=")[0]))
                console.log(contractresult);
                var meterNo=[];
                $.each(JSON.parse(stepcontract.propstr2048.split("=")[1]),function(index,val){
                    console.log(val)
                    var contractMeter = {};
                    contractMeter["meterCode"] = val;
                    contractMeter["contractId"] = contractId;
                    console.log(contractMeter);
                    var result = Restful.postDataR(hzq_rest + "gasctmcontractmeter",JSON.stringify(contractMeter));
                    console.log(result);
                })
            }

        }

        var contractState;
        if(stepid && contractmeter.length>32){
            if((results.contractState == "1" || results.contractState == "9") && results.reservedField1 == "2" &&  JSON.parse(stepcontract.propstr2048.split("=")[0]).contractRenew == "Y"){
                contractState ={
                    "contractState":"9",
                    "reservedField1":"1",
                    "activityInstanceId":step.step_inst_id
                };
            }else if(results.contractState == "6"){
                console.log(results.contractState)
                contractState ={
                    "contractState":"6",
                    "reservedField1":"4",
                    "activityInstanceId":step.step_inst_id
                };
            }else if(results.contractState == "9" && results.reservedField1 == "5"){
                console.log(results.contractState)
                contractState ={
                    "contractState":"9",
                    "reservedField1":"4",
                    "activityInstanceId":step.step_inst_id
                };
            }else{
                contractState ={
                    "contractState":"9",
                    "reservedField1":"3",
                    "activityInstanceId":step.step_inst_id
                };
            }
        }else{
            if((results.contractState == "1" || results.contractState == "9") && results.reservedField1 == "2"){
                contractState ={
                    "contractState":"9",
                    "reservedField1":"1",
                    "activityInstanceId":step.step_inst_id
                };
            }else if(results.contractState == "6"){
                console.log(results.contractState)
                contractState ={
                    "contractState":"6",
                    "reservedField1":"4",
                    "activityInstanceId":step.step_inst_id
                };
            }else if(results.contractState == "0"){
                contractState ={
                    "contractState":"9",
                    "reservedField1":"4",
                    "activityInstanceId":step.step_inst_id
                };
            }else if(results.contractState == "9" && results.reservedField1 == "5"){
                console.log(results.contractState)
                contractState ={
                    "contractState":"9",
                    "reservedField1":"4",
                    "activityInstanceId":step.step_inst_id
                };
            }else{
                contractState ={
                    "contractState":"9",
                    "reservedField1":"3",
                    "activityInstanceId":step.step_inst_id
                };
            }
        }


        console.log(contractState)
        console.log(contractId)
        $.ajax({
            url: hzq_rest + "gasctmcontract/" + contractId,
            type: 'PUT',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify(contractState),
            success: function (e) {
                console.log(e)
            }
        })
    }



    // alert(step);
}

/*
if(!results.contractNo){
    $(".contract").hide()
}*/


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

            // console.log("ssdsds"+JSON.stringify(data));
        },
        error: function (data) {
            bootbox.alert(data);

        }

    });

}

//表具信息

function mererinfo(meterNo){
    //厂家
    var factoryHelper = RefHelper.create({
        ref_url: 'gasmtrfactory',
        ref_col: 'factoryId',
        ref_display: 'factoryName'
    });
//规格型号
    var meterSpecIdHelper = RefHelper.create({
        ref_url: 'gasmtrmeterspec',
        ref_col: 'meterModelId',
        ref_display: 'meterModelName'
    });
//表具类型
    var meterTypeIdHelper = RefHelper.create({
        ref_url: 'gasmtrmetertype',
        ref_col: 'meterTypeId',
        ref_display: 'meterTypeName'
    });
//厂家
    var factoryFormat = function () {
        return {
            f: function (val) {
                return factoryHelper.getDisplay(val);
            }
        }
    }();
//规格型号
    var meterSpecIdFormat = function () {
        return {
            f: function (val) {
                return meterSpecIdHelper.getDisplay(val);
            }
        }
    }();
//表具类型
    var meterTypeIdFormat = function () {
        return {
            f: function (val) {
                return meterTypeIdHelper.getDisplay(val);
            }
        }
    }();

    var dateFormat = function () {
        return {
            f: function (val) {
                if (val) {
                    var date = val.substring(0, 10);
                    return date;
                }

            }
        }
    }();
    $("#divtable").html("");
    if(meterNo.length){
        var queryCondion = RQLBuilder.and([
            RQLBuilder.condition_fc("meterNo","$in",JSON.stringify(meterNo)),
            // RQLBuilder.equal("clrTag","2"),
        ]).rql()
        console.log(queryCondion)
        XWATable.init({
            divname: "divtable",
            //----------------table的选项-------
            pageSize: 10,
            columnPicker: true,
            transition: 'fade',
            checkAllToggle: true,
            //----------------基本restful地址---
            // restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
            restbase: 'gasmtrmeter/?query='+queryCondion,
            key_column: 'meterId',
            coldefs: [
                {
                    col: "meterNo",
                    friendly: "表编号",
                    sorting: true,
                    index: 6
                },
                {
                    col: "meterTypeId",
                    friendly: "表具类型",
                    format: meterTypeIdFormat,
                    sorting: true,
                    index: 7
                },
                {
                    col: "factoryId",
                    friendly: "厂家",
                    format: factoryFormat,
                    sorting: true,
                    index: 8
                },
                {
                    col: "meterModelId",
                    friendly: "表具规格型号",
                    format: meterSpecIdFormat,
                    sorting: true,
                    index: 9
                },
                {
                    col: "productionDate",
                    friendly: "生产日期",
                    format: dateFormat,
                    sorting: true,
                    index: 10
                },
            ]
        })
    }

}



var busiData;
jQuery(document).ready(function() {
    INITAction.init();
});

var INITAction = function() {
    return {
        agreeBtn:   $('#agree_btn'),
        unagreeBtn:   $('#unagree_btn'),
        backBtn:   $('#back_btn'),

        init:function(){
            if(stepid==""){
                window.location.replace("index.html");
            }
            this.getTask();
            this.bind();
        },
        bind:function(){
            this.agreeBtn.on('click',this.agree);
            this.unagreeBtn.on('click',this.unagree);
            this.backBtn.on('click',this.back);
        },

        agree:function(){
            INITAction.postSubmit("0");
        },
        unagree:function(encrypted){
            INITAction.postSubmit("1");
        },
        back:function(encrypted){
            history.go("-1");
            // window.location.replace("index.html");
        },
        postSubmit:function(val){
            var radiovar = $('input:radio:checked').val();
            var approvalopinion = $("#agreereason").val();
            var unapprovalopinion = $("#unagreereason").val();
            if(val=="0"){
                approvalopinion += "(" +radiovar+ ")";
            }else{
                approvalopinion=unapprovalopinion;
            }
            bootbox.confirm("确定提交吗?", function(result) {
                if(result===false){

                }else {
                    var batch_result={};
                    batch_result["success"]=true;//不是流程最后一步，直接放过流程
                    console.log("batch_result=="+JSON.stringify(batch_result));
                    if(batch_result!=null ){
                        if( batch_result["success"]){
                            console.log("New Insert OK");
                        }else{
                            bootbox.alert("出错了，～\n"+batch_result.message);
                            return;
                        }
                        var userName=UserInfo.init().employee_name;
                        if(userName==undefined ||userName ==""){
                            userName=UserInfo.userId();
                        }
                        approvalopinion =step.gs_chcode+ "["+userName+"]:"+ approvalopinion +"</br>";
                        var opinion_msg = $("#opinion_msg").html();
                        approvalopinion=opinion_msg+ approvalopinion;

                        //2.提交流程
                        var flow_result = Restful.insert("/hzqs/psm/pbput.do?fh=VPUTPSM000000J00&resp=bd",
                            {
                                "step_inst_id": step.step_inst_id,
                                "ref_no":step.ref_no,
                                "prop1str64": step.prop1str64,
                                "prop2str64": step.prop2str64,
                                "propstr128": step.propstr128,
                                "propstr256": approvalopinion,
                                "propstr2048": step.propstr2048,
                                "results":val
                            })
                        console.log(flow_result)
                        if(flow_result.retcode=='0'&&flow_result.steps&&flow_result.steps.length>0){
                            $.ajax({
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                type: 'get',
                                async: false,
                                url: hzq_rest+'psmstepinst/'+step.step_inst_id,
                                success: function (data) {
                                    console.log(data);
                                    if(data){
                                        step.to_orders=data.toOrders;
                                        step.results=data.results;
                                    }
                                }
                            })
                            console.log(step)
                            if(step.to_orders=="END"){//如果流程即将结束
                                //此处进行业务操作
                                //doBusi(step);
                                var fn = window["doBusi"];
                                if (typeof(fn)==='function') {
                                    fn.call(null, step);
                                }
                            }
                            bootbox.alert("流程提交成功",function(){
                                window.location.replace("index.html");
                            });
                        }else{
                            bootbox.alert("网络貌似不正常～操作失败");
                        }
                    }
                    else{
                        console.log("Batch Open Exist!");
                        bootbox.alert("网络开小差～");
                        return;
                    }
                }
            });

        },
        getTask:function(){
            // console.log("#####")
            // console.log(stepid)
            if(stepid){
                step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd",{
                    "flow_inst_id":refnumber,"step_status":"2",
                    "do_operator":UserInfo.userId()
                })
                console.log("step_result=="+JSON.stringify(step_result)+"::"+step_result.rowcount)
                if(step_result.rowcount==0){
                    step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd",{
                        "flow_inst_id":refnumber,"step_status":"1",
                        "do_operator":UserInfo.userId()
                    })
                }
                if(step_result.rowcount&&step_result.rowcount==1){
                    //如果step_status为1，更新状态为2
                    var param = {
                        "stepInstId":stepid,
                        "stepStatus":"2",
                        "operator":UserInfo.userId()
                    }
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type: 'put',
                        async: false,
                        contentType:"application/json; charset=utf-8",
                        data: JSON.stringify(param),
                        url: hzq_rest+'psmstepinst',
                        success: function (data) {
                            console.log(data);
                            if(data){
                            }
                        }
                    })

                    step = step_result.steps[0]
                    $("#opinion_msg").html(step.propstr256);
                }else{
                    if(stepid){
                        console.log("未找到对应的审批流程");
                        bootbox.alert("未找到对应的审批流程");
                    }
                }
            }

        }
    };
}();
