/**
 * Created by Administrator on 2017/6/5 0005.
 */
SideBar.init();

$('#form input,textarea,select').attr("disabled", "disabled");

var stepid = Metronic.getURLParameter("stepid");
var contractId = Metronic.getURLParameter("refno");
console.log(contractId.length)
if(contractId.length > 32){
    contractId = contractId.substr(0,contractId.length-6)
    console.log(contractId)
}else{
    contractId = contractId;
    $(".contract").hide();
}

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

if(stepid.length>32){

    var bd = {
        "cols":"*",
        "froms":"gas_ctm_contract_meter a left join gas_mtr_meter b on a.meter_code=b.meter_no",
        "wheres":"a.contract_id='"+contractId+"'",
        "page":true,
        "limit":50
    }
    $("#divtable").html("");

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
   
    XWATable.init({
        divname: "divtable",
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        checkAllToggle: true,
        //----------------基本restful地址---
        // restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        // restbase: 'gasmtrmeter/?query='+queryCondion,
        restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
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

var doBusi=function(step){
    console.log(step)
    if(step.results == "0"){
        if(stepid.length >32){
            if(contract_result.contractState == "0"){
                var  contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,{"contractState":"0","reservedField1":"1"})
            }else if (contract_result.contractState == "3" || contract_result.contractState == "4" || contract_result.contractState == "5"){
                var  contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,{"contractState":"6","reservedField1":"1"})
            }else if (contract_result.contractState == "6"){
                var  contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,{"contractState":"6","reservedField1":"1"})
                console.log("567890-",contractresult)
            }else{
                var  contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,{"reservedField1":"1"})
            }
            
        }else{
            var  contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,{"reservedField1":"1"})
        }
    }else{
        if(stepid.length >32){
            var  contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,{"reservedField1":"2"})
        }else{
            var  contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,{"reservedField1":"2"})
        }
    }
}