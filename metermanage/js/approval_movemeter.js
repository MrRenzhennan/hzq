
console.log(step)
console.log(stepid,refno)
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;
GasModSys.areaList({
    "areaId":"1",
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            $('#movebefore').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
            $('#moveafter').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
            
        })
    }
});

if(stepid && refno){
    $("#liuchengbut").css("display","block");
    // $("#changetypes").removeClass("hidden");
    var json = Restful.findNQ(hzq_rest+'gasmtrmetermove/?query={"reservedField1":"'+refno+'"}')[0];
}else{
    var metermoveId = window.location.search.split("?")[1];
    var json = Restful.findNQ(hzq_rest+'gasmtrmetermove/'+metermoveId);
    $("#changetypes").addClass("hidden");
}
// DEPOSITORY_ID
var  depositoryId= Restful.findNQ(hzq_rest+'gasmtrdepository/?query={"areaId":"'+json.moveAfter+'"}')[0].depositoryId;
var  depositoryIds= Restful.findNQ(hzq_rest+'gasmtrdepository/?query={"areaId":"'+json.moveBefore+'"}')[0].depositoryId;



$("#moveafter").val(json.moveAfter).trigger("change");
$("#movebefore").val(json.moveBefore).trigger("change");

console.log(depositoryId)

console.log(json)
json.moveParam = JSON.parse(json.moveParam)

$("select").css("disabled",true)
$("input").css("disabled",true)

$.each(json,function(index,val){
   // $("select[name="+index+"]").val(val).trigger("change");
    $("input[name="+index+"]").val(val).trigger("change");
})

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
//Format

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

var direction={"R":"右","L":"左"}




var factoryId =[];
var meterModelId = [];
if(json.moveParam && json.moveParam.length){
    var tbodys="";
    $.each(json.moveParam,function(index,item){
        factoryId.push(item.factoryId)
        meterModelId.push(item.meterModelId)
        tbodys+="<tr>"+
                "<td></td>"+
                "<td>"+factoryHelper.getData()[item.factoryId]+"</td>"+
                "<td>"+meterModelHelper.getData()[item.meterModelId]+"</td>"+
                "<td>"+direction[item.direction]+"</td>"+
                "<td>"+item.count+"</td>"+
            "</tr>"
    })
    $("#tbody").html(tbodys)
}
// GAS_MTR_DEPOSITORY
// var depositoryId = Restful.findNQ(hzq_rest+'gasmtrdepository/?query={"areaId":'+areaId+'}')[0].depositoryId


// console.log(depositoryId)
var changeDep=[];
if(json.meterMoveId){
    var bd ={
        "cols":"*",
        "froms":"gas_mtr_meter_move_detail a left join gas_mtr_meter b on b.meter_id=a.meter_id",
        "wheres":" a.meter_move_id ='"+json.meterMoveId+"' ",
        "page":false
    }
    $.ajax({
        type: 'get',
        url:  "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+ encodeURIComponent(JSON.stringify(bd)),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        isMask: true,
        success: function(data) {
            console.log(data)
            if(data && data.rows.length){
                $.each(data.rows,function(ind,item){
                    changeDep.push({
                        "meterId":item.meterId,
                        "newDepositoryId":depositoryId,
                        "oldDepositoryId":item.depositoryId,
                        "createdTime":new Date(new Date()+"-00:00"),
                        "createdBy":userId,
                        "modifiedTime":new Date(new Date()+"-00:00"),
                        "modifiedBy":userId,
                        "status":"0",
                        "changeType":"2"
                    })
                })
            }
        }
    })
}

console.log(changeDep)

var borrowmeter = function(){
    var detailedInfoFormat =function(){
        return{
            f:function(val,row){
                return "<a id='"+val+"' class='addmeter' data-rows='"+JSON.stringify(row)+"'>添加</a>"
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
                "froms":"gas_mtr_meter_move_detail a left join gas_mtr_meter b on b.meter_id=a.meter_id",
                "wheres":" a.meter_move_id ='"+json.meterMoveId+"' ",
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
                    checkboxes: false,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: 'meterId',
                    coldefs: [
                        {
                            col: "depositoryId",
                            friendly: "仓库名称",
                            format: depositoryFormat,
                            sorting: false,
                            index: 1
                        },
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
                        // {
                        //     col: "meterModelId",
                        //     friendly: "额定流量",
                        //     format: meterspecIdFormat,
                        //     sorting: true,
                        //     index: 7
                        // },
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
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {
                       
                    },//--findFilter
                }
            )
        }
    }
}()


var results = Restful.findNQ(hzq_rest+'gasmtrmetermovedetail/?query={"meterMoveId":"'+json.meterMoveId+'"}');
var meterId=[];
$.each(results,function(ind,item){
    meterId.push(item.meterId)
})
var doBusi = function(step){
	
	if(step.results==0){
        console.log(changeDep)
        if(step.propstr2048 && JSON.parse(step.propstr2048).changetype == "2"){
            var submitJson = {"sets":[
                {"txid":"1","body":{"depositoryId":depositoryId,"stockState":"1","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmeter/"+meterId.join(),"method":"PUT"},
                {"txid":"2","body":{"status":"1","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmetermove/"+json.meterMoveId,"method":"PUT"},
                {"txid":"3","body":changeDep,"path":"/gasmtrdepositorychange/","method":"POST"},
                // {"txid":"3","body":movedetail,"path":"/gasmtrmetermovedetail/","method":"POST"},
                // {"txid":"4","body":flowjson,"path":"/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd/","method":"POST"},
            ]};
        }else{
            var submitJson = {"sets":[
                {"txid":"1","body":{"depositoryId":depositoryId,"stockState":"1","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmeter/"+meterId.join(),"method":"PUT"},
                {"txid":"2","body":{"status":"1","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmetermove/"+json.meterMoveId,"method":"PUT"},
                // {"txid":"3","body":movedetail,"path":"/gasmtrmetermovedetail/","method":"POST"},
                // {"txid":"4","body":flowjson,"path":"/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd/","method":"POST"},
            ]};
        }

        
		
    
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

                    // var submitJsons = {"sets":[
                    //     {"txid":"1","body":{"stockState":"5","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmeter/"+meterId.join(),"method":"put"},
                    //     {"txid":"2","body":{"status":"3","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmetermove/"+json.meterMoveId,"method":"PUT"},
                    // ]};
                    // var resultss = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJsons)                    
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
		var submitJson = {"sets":[
            {"txid":"1","body":{"stockState":"1","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmeter/"+meterId.join(),"method":"PUT"},
            {"txid":"2","body":{"status":"2","refuseReason":$("#unagreereason").val(),"modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmetermove/"+json.meterMoveId,"method":"PUT"}
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

                    // var submitJsons = {"sets":[
                    //     {"txid":"1","body":{"stockState":"5","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmeter/"+meterId.join(),"method":"put"},
                    //     {"txid":"2","body":{"status":"3","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmetermove/"+json.meterMoveId,"method":"PUT"},
                    // ]};
                    // var resultss = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJsons)                    
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
	}
}
