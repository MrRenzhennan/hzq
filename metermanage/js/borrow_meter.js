var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;


var metermoveId = window.location.search.split("?")[1];
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            
            $('#moveafter').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
            
        })
    }
});

var areaHelper = RefHelper.create({
    ref_url: 'gasbizarea?query={"status":"1"}',
    ref_col: "areaId",
    "sort":"posCode",
    ref_display: "areaName",
});

$.map(areaHelper.getData(), function (value, key) {
    $('#moveafter').append('<option value="' + key + '">' + value + '</option>');
    $('#movebefore').append('<option value="' + key + '">' + value + '</option>');
});

var json = Restful.findNQ(hzq_rest+"gasmtrmetermove/"+metermoveId);
var factory_idss =[];
var meterModelIdss =[];

if(json){
    json.moveParam = JSON.parse(json.moveParam)

    $.each(json.moveParam,function(ind,ite){
        factory_idss.push(ite.factoryId);
        meterModelIdss.push(ite.meterModelId)
    })

}

if(factory_idss.length && meterModelIdss.length){
    console.log(factory_idss)
    $.unique(factory_idss);
    console.log(factory_idss)

    console.log(meterModelIdss)
    $.unique(meterModelIdss);
    console.log(meterModelIdss)


    // RQLBuilder.equal("moveBefore",areaId),
    // RQLBuilder.equal("moveAfter",areaId),

    var queryCondions = RQLBuilder.and([
        RQLBuilder.condition_fc("factoryId","$in",JSON.stringify(factory_idss))
    ]).rql()
    var meterModelquery = RQLBuilder.and([
        RQLBuilder.condition_fc("meterModelId","$in",JSON.stringify(meterModelIdss))
    ]).rql()
    var factoryHelpers = RefHelper.create({
        ref_url: 'gasmtrfactory/?query='+queryCondions,
        ref_col: 'factoryId',
        ref_display: 'factoryName'
    });
    //表具规格型号Helper
    var meterModelHelpers = RefHelper.create({
        ref_url: 'gasmtrmeterspec/?query='+meterModelquery,
        ref_col: 'meterModelId',
        ref_display: 'meterModelName'
    });

    $.map(factoryHelpers.getData(), function (value, key) {
        $('#find_factoryId').append('<option value="' + key + '">' + value + '</option>');
    });
    $.map(meterModelHelpers.getData(), function (value, key) {
        $('#find_meterModelId').append('<option value="' + key + '">' + value + '</option>');
    });

}


// var json = {
    //     "moveBefore": "13",
    //     "moveAfter": "1",
    //     "remark": "sfdsafdaf",
    //     "moveParam": [
    //         {
    //             "factoryId": "14",
    //             "meterModelId": "109",
    //             "direction": "R",
    //             "count": "2"
    //         },
    //         {
    //             "factoryId": "13",
    //             "meterModelId": "18",
    //             "direction": "R",
    //             "count": "3"
    //         }
    //     ],
    //     "createdBy": "admin",
    //     "createdTime": "2017-11-30 17:06:16"
// }




$("#moveafter").val(json.moveAfter).trigger("change");
$("#movebefore").val(json.moveBefore).trigger("change");

$.each(json,function(index,val){
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


var factoryId =[];
var meterModelId = [];
if(json.moveParam && json.moveParam.length){
    var tbodys="";
    $.each(json.moveParam,function(index,item){
        factoryId.push("'"+item.factoryId+"'")
        meterModelId.push("'"+item.meterModelId+"'")
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
var depositoryId = Restful.findNQ(hzq_rest+'gasmtrdepository/?query={"areaId":'+areaId+'}')[0].depositoryId


console.log(depositoryId)

// var borrowmeter = function(){
    //     var detailedInfoFormat =function(){
    //         return{
    //             f:function(val,row){
    //                 return "<a id='"+val+"' class='addmeter' data-rows='"+JSON.stringify(row)+"'>添加</a>"
    //             }
    //         }
    //     }()
    //     return{
    //         init:function(){
    //             this.reload();   
    //         },
    //         reload:function(){
    //             // "wheres":"depository_id = '"+depositoryId+"' and stock_state='1' and factory_id in ("+factoryId.join()+") and meter_model_id in ("+meterModelId.join()+")",
    //             var bd ={
    //                 "cols":"*",
    //                 "froms":"gas_mtr_meter",
    //                 "wheres":"depository_id = '"+depositoryId+"' and stock_state='1' and factory_id in ("+factoryId.join()+") and meter_model_id in ("+meterModelId.join()+")",
    //                 "page":true,
    //                 "limit":50
    //             }
    //             $('#divtable').html('');
    //             xw = XWATable.init(
    //                 {
    //                     divname: "divtable",
    //                     //----------------table的选项-------
    //                     pageSize: 10,
    //                     columnPicker: true,
    //                     transition: 'fade',
    //                     checkboxes: false,
    //                     checkAllToggle: true,
    //                     //----------------基本restful地址---
    //                     restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
    //                     key_column: 'meterId',
    //                     coldefs: [
    //                         {
    //                             col: "depositoryId",
    //                             friendly: "仓库名称",
    //                             format: depositoryFormat,
    //                             sorting: false,
    //                             index: 1
    //                         },
    //                         {
    //                             col: "meterNo",
    //                             friendly: "表编号",
    //                             sorting: true,
    //                             index: 2
    //                         },
    //                         {
    //                             col: "meterTypeId",
    //                             friendly: "表具类型",
    //                             format: meterTypeIdFormat,
    //                             sorting: true,
    //                             index: 3
    //                         },
    //                         {
    //                             col: "factoryId",
    //                             friendly: "厂家",
    //                             format: factoryFormat,
    //                             sorting: true,
    //                             index: 4
    //                         },
    //                         {
    //                             col: "meterModelId",
    //                             friendly: "表具规格型号",
    //                             format: meterSpecIdFormat,
    //                             sorting: true,
    //                             index: 5
    //                         },
    //                         // {
    //                         //     col: "meterModelId",
    //                         //     friendly: "额定流量",
    //                         //     format: meterspecIdFormat,
    //                         //     sorting: true,
    //                         //     index: 7
    //                         // },
    //                         {
    //                             col: "productionDate",
    //                             friendly: "生产日期",
    //                             format: dateFormat,
    //                             sorting: true,
    //                             index: 6
    //                         },
    //                         {
    //                             col: "meterStatus",
    //                             friendly: "表具状态",
    //                             format: GasSysBasic.meterStatus,
    //                             sorting: true,
    //                             index: 7
    //                         },
    //                         {
    //                             col: "flow",
    //                             friendly: "额定流量",
    //                             format: meterFlowRange,
    //                             sorting: true,
    //                             index: 8
    //                         },
    //                         {
    //                             col: "meterDigit",
    //                             friendly: "表位数",
    //                             sorting: true,
    //                             index: 9
    //                         },
    //                         {
    //                             col: "reading",
    //                             friendly: "表读数",
    //                             sorting: true,
    //                             index: 10
    //                         },
    //                         {
    //                             col: "direction",
    //                             friendly: "进气方向",
    //                             format: GasModCtm.meterDirectionFormat,
    //                             sorting: true,
    //                             index: 12
    //                         },
    //                         {
    //                             col: "chipType",
    //                             friendly: "芯片类型",
    //                             format: GasModCtm.chipTypeFormat,
    //                             sorting: true,
    //                             index: 17
    //                         },
    //                         {
    //                             col: "reskindId",
    //                             friendly: "物品种类",
    //                             format: resKindIdFormat,
    //                             sorting: true,
    //                             index: 20
    //                         },
    //                         {
    //                             col: "meterKind",
    //                             friendly: "表具种类",
    //                             format: GasModCtm.meterKindFormat,
    //                             index: 21
    //                         },
    //                         {
    //                             col: "stockState",
    //                             friendly: "库存状态",
    //                             format: GasModCtm.stockStateFormat,
    //                             sorting: true,
    //                             index: 22
    //                         },
    //                         {
    //                             col: "meterId",
    //                             friendly: "操作",
    //                             sorting: false,
    //                             format: detailedInfoFormat,
    //                             index: 23
    //                         }
                
    //                     ],
    //                     //---------------查询时过滤条件
    //                     findFilter: function () {
                        
    //                     },//--findFilter
    //                 }
    //             )
    //         }
    //     }
// }()


$("#find_button2").on("click",function(){
    var wheres = ""
    // 只有规格型号
    if($("#find_meterModelId").val() && !$("#find_factoryId").val() && !$("#find_direction").val()){
        wheres +=" meter_model_id = '"+$("#find_meterModelId").val()+"' and factory_id in ("+factoryId.join()+") and "
    }
    // 只有厂家
    if($("#find_factoryId").val() && !$("#find_meterModelId").val() && !$("#find_direction").val()){
        wheres +=" factory_id = '"+$("#find_factoryId").val()+"' and meter_model_id in ("+meterModelId.join()+") and "
    }
    // 厂家和规格型号
    if($("#find_meterModelId").val() && $("#find_factoryId").val() && !$("#find_direction").val()){
        wheres +=" meter_model_id = '"+$("#find_meterModelId").val()+"' and factory_id = '"+$("#find_factoryId").val()+"' and "
    }
    // 规格型号和进气方向
    if($("#find_meterModelId").val() && !$("#find_factoryId").val() && $("#find_direction").val()){
        wheres +=" meter_model_id = '"+$("#find_meterModelId").val()+"' and factory_id in ("+factoryId.join()+") and direction = '"+$("#find_direction").val()+"' and "
    }
    // 厂家和进气方向
    if(!$("#find_meterModelId").val() && $("#find_factoryId").val() && $("#find_direction").val()){
        wheres +=" meter_model_id in ("+meterModelId.join()+") and factory_id = '"+$("#find_factoryId").val()+"' and direction = '"+$("#find_direction").val()+"' and "
    }
    // 厂家、进气方向和规格型号
    if($("#find_meterModelId").val() && $("#find_factoryId").val() && $("#find_direction").val()){
        wheres +=" meter_model_id = '"+$("#find_meterModelId").val()+"' and factory_id = '"+$("#find_factoryId").val()+"' and  direction = '"+$("#find_direction").val()+"' and "
    }
    // 之后进气方向
    if($("#find_direction").val() && !$("#find_meterModelId").val() && !$("#find_factoryId").val() ){
        wheres +=" direction = '"+$("#find_direction").val()+"' and factory_id in ("+factoryId.join()+") and meter_model_id in ("+meterModelId.join()+") and "
    }
    // 三个都没有
    if( !$("#find_meterModelId").val() && !$("#find_factoryId").val() && !$("#find_direction").val()){
        wheres+="factory_id in ("+factoryId.join()+") and meter_model_id in ("+meterModelId.join()+") and "
    }

    var bd ={
        "cols":"*",
        "froms":"gas_mtr_meter",
        "wheres":wheres + " depository_id = '"+depositoryId+"' and stock_state='1'",
        "page":true,
        "limit":50
    }
    var detailedInfoFormat =function(){
        return{
            f:function(val,row){
                return "<a id='"+val+"' class='addmeter' data-rows='"+JSON.stringify(row)+"'>添加</a>"
            }
        }
    }()
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
                },
                {
                    col: "meterId",
                    friendly: "操作",
                    sorting: false,
                    format: detailedInfoFormat,
                    index: 23
                }
    
            ],
            //---------------查询时过滤条件
            findFilter: function () {
                
            },//--findFilter
        }
    )
})


$(document).on("click",".addmeter",function(){
    var rowsinfo = JSON.parse($(this).attr("data-rows"));
    var meterNo =rowsinfo.meterNo;
    var meterNoInput=document.getElementsByName("meterNo");
    if(meterNoInput.length != 0){
        var meterNoArr=[];
        $.each(meterNoInput, function (indx,val) {
            meterNoArr.push(val.value);
        })
        if($.inArray(meterNo, meterNoArr) != -1){
            bootbox.alert("<br><center><h4>不能重复添加同一个表！</h4></center><br>");
            return false;
        }
    }
    var break_status = false;
    var tabletbody = "";
    $.each(json.moveParam,function(ind,item){
        if(rowsinfo.factoryId == item.factoryId && rowsinfo.meterModelId == item.meterModelId && rowsinfo.direction ==item.direction && item.count >0){
            tabletbody += "<tr id='"+rowsinfo.meterId+"' name='meterId'>" +
            "<td width='15px' class='remove_item'><span class='glyphicon glyphicon-remove'></span></td>" +
            "<td><input name='meterNo' type='text'  class='form-control' readonly data-id='"+rowsinfo.meterNo+"' value='"+rowsinfo.meterNo+"'></td>" +
            "<td><input name='factoryId' type='text'  class='form-control' readonly data-id='"+rowsinfo.factoryId+"' value='"+factoryHelper.getDisplay(rowsinfo.factoryId)+"'></td>" +
            "<td><input name='meterModelId' type='text'  class='form-control' readonly data-id='"+rowsinfo.meterModelId+"' value='"+meterSpecIdHelper.getDisplay(rowsinfo.meterModelId)+"'></td>" +
            "<td><input name='direction' type='text'  class='form-control' readonly data-id='"+rowsinfo.direction+"' value='"+direction[rowsinfo.direction]+"'></td>" +
            "</tr>";
            item.count = item.count-1;
            break_status = false;
            return false;
        }else if(rowsinfo.factoryId == item.factoryId && rowsinfo.meterModelId == item.meterModelId && rowsinfo.direction ==item.direction && item.count <=0){
            bootbox.alert(factoryHelper.getDisplay(rowsinfo.factoryId)+meterSpecIdHelper.getDisplay(rowsinfo.meterModelId)+direction[rowsinfo.direction]+"表数量已达上限。")
            break_status = false;
            return false;
        }else{
            break_status = true;
        }
        
    })

    console.log(json)

    if(break_status){
        bootbox.alert("请根据单据明细选择正确的表。")
        return false;
    }


    
    
    $('#tbody2').append(tabletbody);
    
})
$(document).on("click",".remove_item",function () {
    var tds = $(this).siblings("td");
    var meterNo = $($(this).siblings("td")[0]).find("input").attr("data-id");
    var factoryId = $($(this).siblings("td")[1]).find("input").attr("data-id");
    var meterModelId = $($(this).siblings("td")[2]).find("input").attr("data-id");
    var direction = $($(this).siblings("td")[3]).find("input").attr("data-id");
    console.log(meterNo)
    console.log(factoryId,meterModelId,direction)
    $.each(json.moveParam,function(ind,item){
        if(factoryId == item.factoryId && meterModelId == item.meterModelId && direction ==item.direction && item.count >=0){
            item.count = item.count+1;
            return false;
        }
        
    })
    console.log(json)
    $(this).parent().remove();
});
$("#goback").on("click",function(){
    history.go("-1")
})
$('#submit_btn2').click(function () {
    $(this).button('loading');
    var factoryIds = "";
    var meterModelIds ="";
    var directions="";
    var substate = false;
    $.each(json.moveParam,function(ind,item){
        if(item.count >0){
            // alertinfo(item.factoryId,item.meterModelId,item.direction);
            factoryIds = factoryHelper.getDisplay(item.factoryId);
            meterModelIds =meterSpecIdHelper.getDisplay(item.meterModelId);
            directions=direction[item.direction];
            substate = true;
            return false;
        }
    })
    if(substate){

        bootbox.alert(factoryIds+meterModelIds+directions+"进气的表数量不够，请补全",function(){
            $("#submit_btn2").button('reset');
        })
        return false;
    }

    if(!$("#changetype").val()){
        bootbox.alert("<center><h4>请选择移库类型。</h4></center>",function(){
            $("#submit_btn2").button('reset');
        })
        return false;
    }


    // console.log(factoryIdarr)
    var meterIdInput=document.getElementsByName("meterId");
    console.log(meterIdInput)
    if(meterIdInput.length == 0){
        bootbox.alert("请添加表具。",function(){
            $("#submit_btn2").button('reset');
        });
        return false;
    }
    

    var meterId=[];
    var movedetail = [];
    var meterMoveDetailIds = [];
    $.each(meterIdInput, function (indx,val) {
        var meterMoveDetailId = $.md5(JSON.stringify(val)+new Date().getTime()+Math.random());
        meterMoveDetailIds.push(meterMoveDetailId)
        meterId.push(val.id);
        movedetail.push({
            "meterMoveDetailId":meterMoveDetailId,
            "meterId":val.id,
            "meterMoveId":json.meterMoveId,
            "createdTime":new Date(new Date()+"-00:00"),
            "createdBy":userId,
            "modifiedTime":new Date(new Date()+"-00:00"),
            "modifiedBy":userId,
            "status":"0"
        })
    })
    console.log(movedetail)
    var FlowId = $.md5(JSON.stringify(meterId)+new Date().getTime());
    var flowInfo={
            "meterMoveId":json.meterMoveId,
            "changetype":$("#changetype").val()
        };
    
    // var result = Restful.update(hzq_rest + "gasmtrmeter",meterId.join(),{"stockState":"5"})
    // var metermove = Restful.update(hzq_rest + "gasmtrmetermove",json.meterMoveId,{"reservedField1":FlowId,"modifiedTime":new Data(new Data()+"-00:00"),"modifiedBy":userId})
    // var metermovedetail = Restful.insert_batch(hzq_rest + "gasmtrmetermovedetail",movedetail)
    flowjson = {
        "flow_def_id":"METERMOVE",
        "ref_no":FlowId,
        "operator":userId,
        "be_orgs":areaId,
        "flow_inst_id":FlowId,
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":"表具移库申请",
        "propstr128":"表具移库申请计量中心",
        "propstr2048":flowInfo,
        "override_exists":false
    }


    var submitJson = {"sets":[
        {"txid":"1","body":{"stockState":"7","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmeter/"+meterId.join(),"method":"put"},
        {"txid":"2","body":{"status":"3","reservedField1":FlowId,"modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmetermove/"+json.meterMoveId,"method":"PUT"},
        {"txid":"3","body":movedetail,"path":"/gasmtrmetermovedetail/","method":"POST"},
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
                var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson)
                console.log(flow_result)
                if(flow_result.retmsg == "SUCCESS:1"){
                    bootbox.alert("<center><h4>提交成功</h4></center>",function(){
                        $("#submit_btn2").button('reset');
                        history.go("-1")
                    });
                }else{
                    var submitJsons = {"sets":[
                        {"txid":"1","body":{"stockState":"1","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmeter/"+meterId.join(),"method":"PUT"},
                        {"txid":"2","body":{"status":"0","reservedField1":"","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":userId},"path":"/gasmtrmetermove/"+json.meterMoveId,"method":"PUT"},
                        {"txid":"3","body":"{}","path":"/gasmtrmetermovedetail/"+meterMoveDetailIds.join(),"method":"DELETE"},
                        // {"txid":"4","body":flowjson,"path":"/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd/","method":"POST"},
                    ]};
                    var resultss = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJsons)

                    bootbox.alert("提交失败",function(){
                        $("#submit_btn2").button('reset');
                        history.go("-1")
                    })
                }
                
            }else{
                bootbox.alert("<center><h4>提交失败</h4></center>",function(){
                    $("#submit_btn2").button('reset');
                });
                
            }
        },
        error: function(err) {
            bootbox.alert("<center><h4>提交失败</h4></center>",function(){
                $("#submit_btn2").button('reset');
            });
            if( err.status==406){
                //need to login
                if(window.location.pathname.indexOf('/login.html')<0)
                {
                    window.location.replace("/login.html?redirect="+window.location.pathname);
                }
            }
        }
    });
    // if(result.success){
    //     flowjson = {"flow_def_id":"VIPCUSTOMERA","ref_no":flowInfo.FlowId,"operator":flowInfo.createdBy,"be_orgs":areaId,
    //         "flow_inst_id":FlowId,
    //         "propstr2048":{"cusotmer":"BATCH","busitype":"表具移库申请"},
    //         "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
    //         "prop2str64":"",
    //         "propstr128":"营业部系统管理员",
    //         "propstr2048":flowInfo,
    //         "override_exists":false}
    //     var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson)
    //     console.log("flow_result:"+JSON.stringify(flow_result));
    // }else{
    //     var results = Restful.update(hzq_rest + "gasctmmeter",meterId.join(),{"stockState":"1"})
    //     if(results.success){
    //         bootbox.alert("提交失败。")
    //     }
    // }
    

});