console.log(stepid,refno)


var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;


if(stepid && refno){
    // $("#changetypes").removeClass("hidden");
    var json = Restful.findNQ(hzq_rest+'gasmtrmeternoc/'+stepid);
}

console.log(json)
//仓库Helper
var depositoryHelper = RefHelper.create({
    ref_url: "gasmtrdepository",
    ref_col: 'depositoryId',
    ref_display: 'depositoryName'
});
//表厂家Helper
var factoryHelper = RefHelper.create({
    ref_url: 'gasmtrfactory',
    ref_col: 'factoryId',
    ref_display: 'factoryName'
});
//表具规格型号Helper
var meterModelHelper = RefHelper.create({
    ref_url: 'gasmtrmeterspec',
    ref_col: 'meterModelId',
    ref_display: 'meterModelName'
});
// 仓库ID format
var depositoryFormat = function () {
    return {
        f: function (val) {
            return depositoryHelper.getDisplay(val);
        }
    }
}();

//表具类型
var meterTypeIdHelper = RefHelper.create({
    ref_url: 'gasmtrmetertype',
    ref_col: 'meterTypeId',
    ref_display: 'meterTypeName',
    "sort": 'meterTypeCode'
});
//物品种类
var resKindIdHelper = RefHelper.create({
    ref_url: "gasmtrreskind",
    ref_col: "reskindId",
    ref_display: "reskindName",
    "sort": "reskindCode"
});
//额定流量
var meterFlowHelper = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: "meterFlowId",
    ref_display: "ratingFlux",
});
//流量范围
var meterFlowRangeHelper = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: "meterFlowId",
    ref_display: "flowName"
});
//规格型号
var meterSpecIdHelper = RefHelper.create({
    ref_url: 'gasmtrmeterspec',
    ref_col: 'meterModelId',
    ref_display: 'meterModelName'
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
//物品种类
var resKindIdFormat = function () {
    return {
        f: function (val) {
            return resKindIdHelper.getDisplay(val);
        }
    }
}();
//额定流量
var meterFlowRange = function () {
    return {
        f: function (val) {
            return meterFlowHelper.getDisplay(val);
        }
    }
}();
//流量范围
var meterFlowRangeFormat = function () {
    return {
        f: function (val) {
            return meterFlowRangeHelper.getDisplay(val);
        }
    }
}();
//时间
var dateFormat = function(){
    return{
        f:function(val){
            if(val){
                return val.split("T").join(" ");
            }else{
                return ""
            }
        }
    }
}()


var direction={"R":"右","L":"左"}
$("#oldmeterNo").val(json.noChangeBefore)
$("#newmeterNo").val(json.noChangeAfter)
$("#remarks").val(json.remark)

var meterIds = json.meterId;
console.log(meterIds)
var borrowmeter = function(){
    var detailedInfoFormat =function(){
        return{
            f:function(val,row){
                return '<a data-target="#pre_signed" data-row='+JSON.stringify(row)+' data-toggle="modal" onclick="selectfile($(this))" data-backdrop="static">申请</a>'
            }
        }
    }()
    return{
        init:function(){
            this.reload();   
        },
        reload:function(){
            // "wheres":"depository_id = '"+depositoryId+"' and stock_state='1' and factory_id in ("+factoryId.join()+") and meter_model_id in ("+meterModelId.join()+")",
            var bd ={
                "cols":"*",
                "froms":"gas_mtr_meter a left join gas_mtr_depository b on a.depository_id = b.depository_id",
                "wheres":"a.meter_id='"+meterIds+"'",
                "page":true,
                "limit":50
            }
            $('#divtable').html('');
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    findbtn: "find_button1",
                    checkboxes: false,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: 'meterId',
                    coldefs: [
                        {
                            col: "meterNo",
                            friendly: "表编号",
                            sorting: true,
                            index: 2
                        },
                        {
                            col: "meterTypeId",
                            friendly: "表具类型",
                            format: meterTypeIdFormat,
                            sorting: true,
                            index: 3
                        },
                        {
                            col: "factoryId",
                            friendly: "厂家",
                            format: factoryFormat,
                            sorting: true,
                            index: 4
                        },
                        {
                            col: "meterModelId",
                            friendly: "表具规格型号",
                            format: meterSpecIdFormat,
                            sorting: true,
                            index: 5
                        },
                        {
                            col: "productionDate",
                            friendly: "生产日期",
                            format: dateFormat,
                            sorting: true,
                            index: 6
                        },
                        {
                            col: "meterStatus",
                            friendly: "表具状态",
                            format: GasSysBasic.meterStatus,
                            sorting: true,
                            index: 7
                        },
                        {
                            col: "flow",
                            friendly: "额定流量",
                            format: meterFlowRange,
                            sorting: true,
                            index: 8
                        },
                        {
                            col: "meterDigit",
                            friendly: "表位数",
                            sorting: true,
                            index: 9
                        },
                        {
                            col: "reading",
                            friendly: "表读数",
                            sorting: true,
                            index: 10
                        },
                        {
                            col: "direction",
                            friendly: "进气方向",
                            format: GasModCtm.meterDirectionFormat,
                            sorting: true,
                            index: 12
                        },
                        {
                            col: "chipType",
                            friendly: "芯片类型",
                            format: GasModCtm.chipTypeFormat,
                            sorting: true,
                            index: 17
                        },
                        {
                            col: "reskindId",
                            friendly: "物品种类",
                            format: resKindIdFormat,
                            sorting: true,
                            index: 20
                        },
                        {
                            col: "meterKind",
                            friendly: "表具种类",
                            format: GasModCtm.meterKindFormat,
                            index: 21
                        },
                        {
                            col: "stockState",
                            friendly: "库存状态",
                            format: GasModCtm.stockStateFormat,
                            sorting: true,
                            index: 22
                        }
                    ]
                }
            )
        }
    }
}()

if(json.files){
    pic(json.files);
}

var doBusi = function(step){
	
	if(step.results==0){
       var jsons = {
           "status" : "2"
       }
       var resultss = Restful.update(hzq_rest+"gasmtrmeternoc",stepid,jsons);

       var submitJson = {"sets":[
            {"txid":"1","body":{"meterNo":json.noChangeAfter,"modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmeter/"+json.meterId,"method":"PUT"},
            {"txid":"2","body":{"status":"2","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmeternoc/"+stepid,"method":"PUT"},
            // {"txid":"3","body":changeDep,"path":"/gasmtrdepositorychange/","method":"POST"},
            // {"txid":"3","body":movedetail,"path":"/gasmtrmetermovedetail/","method":"POST"},
            // {"txid":"4","body":flowjson,"path":"/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd/","method":"POST"},
        ]};
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

                }else{
                    
                }
            },
            error: function(err) {
                if( err.status==406){
                    if(window.location.pathname.indexOf('/login.html')<0)
                    {
                        window.location.replace("/login.html?redirect="+window.location.pathname);
                    }
                }
            }
        });
	}else{
		var jsonss = {
            "status" : "3",
            "refuseReason":$("#unagreereason").val()
        }
        var resultsss = Restful.update(hzq_rest+"gasmtrmeternoc",stepid,jsonss)
	}
}