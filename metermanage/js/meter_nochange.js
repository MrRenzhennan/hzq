var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;

var arrareaid = [];

GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        $.each(data,function(key,val){
            arrareaid.push("'"+val.areaId+"'")
            $('#moveafter').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
            
        })
    }
});

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

var  depositoryId= Restful.findNQ(hzq_rest+'gasmtrdepository/?query={"areaId":"'+areaId+'"}')[0].depositoryId;
var xw;
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
            $.map(factoryHelper.getData(), function (value, key) {
                $('select[name="factoryId"]').append('<option value="' + key + '">' + value + '</option>');
            });
            $.each(meterTypeIdHelper.getRawData(), function (index, row) {
                $('select[name="meterTypeId"]').append('<option value="' + row.meterTypeId + '">' + row.meterTypeName + '</option>');
            });
            $.each(resKindIdHelper.getRawData(), function (index, row) {
                $('select[name="reskindId"]').append('<option value="' + row.reskindId + '">' + row.reskindName + '</option>');
            });
            $.map(meterFlowRangeHelper.getData(), function (value, key) {
                $('select[name="flowRange"]').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(meterSpecIdHelper.getData(), function (value, key) {
                $('select[name="meterModelId"]').append('<option value="' + key + '">' + value + '</option>');
            });
            this.reload();   
        },
        reload:function(){
            // "wheres":"depository_id = '"+depositoryId+"' and stock_state='1' and factory_id in ("+factoryId.join()+") and meter_model_id in ("+meterModelId.join()+")",
            var bd ={
                "cols":"*",
                "froms":"gas_mtr_meter a left join gas_mtr_depository b on a.depository_id = b.depository_id",
                "wheres":"b.area_id in ("+arrareaid.join()+")",
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
                        // {
                        //     col: "depositoryId",
                        //     friendly: "仓库名称",
                        //     format: depositoryFormat,
                        //     sorting: false,
                        //     index: 1
                        // },
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
                        },
                        {
                            col: "meterId",
                            friendly: "操作",
                            format: detailedInfoFormat,
                            sorting: true,
                            index: 23
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {
                       
                        var factoryId = $('#factoryName option:selected').val();
                        var meterTypeId = $('#find_meterTypeId option:selected').val();
                        var stockState = $('#stockState option:selected').val();
                        var meterModel = $('#meterModelId option:selected').val();
                        var flowRange = $('#flowRange option:selected').val();
                        var resKind = $('#resKind option:selected').val();
                        var whereinfo = "";
                       
                        if (factoryId) {
                            whereinfo += " a.factory_id = '" + factoryId + "' and ";
                        }
                        if (meterTypeId) {
                            whereinfo += "a. meter_type_id = '" + meterTypeId + "' and ";
                        }
                        if (stockState) {
                            whereinfo += " a.stock_state = '" + stockState + "' and ";
                        }
                        if (meterModel) {
                            whereinfo += " a.meter_model_id = '" + meterModel + "' and ";
                        }
                        if (flowRange) {
                            whereinfo += " a.flow_range = '" + flowRange + "' and ";
                        }
                       
                        if (resKind) {
                            whereinfo += " a.reskind_id = '" + resKind + "' and ";
                        }
                        if ($('#meterCode').val()) {
                            whereinfo += " a.meter_no='" + $('#meterCode').val() + "' and ";
                        }
                       
                        // var bd ={
                        //     "cols":"*",
                        //     "froms":"gas_mtr_meter",
                        //     "wheres":whereinfo +" depositoryId is null",
                        //     "page":true,
                        //     "limit":50
                        // }

                        var bd ={
                            "cols":"*",
                            "froms":"gas_mtr_meter a left join gas_mtr_depository b on a.depository_id = b.depository_id",
                            "wheres": whereinfo + " b.area_id in ("+arrareaid.join()+")",
                            "page":true,
                            "limit":50
                        }


                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    },//--findFilter
                }
            )
        }
    }
}()
$("#fileuploads>div").removeClass("col-sm-6")
$("#fileuploads>div").addClass("col-sm-12")

var claiminfo={};
function selectfile(data){
    claiminfo={};
    var rowinfo = JSON.parse(data.attr("data-row"));
    console.log(data.attr("data-row"))
    $("#oldmeterNo").val(rowinfo.meterNo);
    claiminfo={
        "meterId":rowinfo.meterId,
        "areaId":areaId,
        "noChangeBefore":rowinfo.meterNo,
        "status":1,
    }
}
$("#newmeterNo").on("blur",function(){
    var  meterlength= Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+$(this).val()+'"}');
    var  meterlengths= Restful.findNQ(hzq_rest+'gasmtrmeternoc/?query={"noChangeAfter":"'+$(this).val()+'"}');

    if(meterlength.length){
        bootbox.alert("<center><h4>表编号已经存在。<h4></center>")
        $("#claimsubmit").addClass("disabled")
        return false;
    }else{
        $("#claimsubmit").removeClass("disabled")
    }

    

    if(meterlengths.length){
        var ss=false;
        $.each(meterlengths,function(index,item){
            if(item.status != "3"){
                ss =true;
                return false;
            }else{
                ss =false;
            }
        })
        if(ss){
            bootbox.alert("<center><h4>表编号已经存在。<h4></center>")
            $("#claimsubmit").addClass("disabled")
            return false;
        }
    }else{
        $("#claimsubmit").removeClass("disabled")
    }
})

$("#claimsubmit").on("click",function(){
    if(gpypictureId){
        claiminfo['files'] = fileId;
    }else{
        claiminfo['files'] = "";
    }

    if(!$("#newmeterNo").val()){
        bootbox.alert("<center><h4>变更后表编号不能为空。</h4></center>")
        return false;
    }

    claiminfo["noChangeAfter"]=$("#newmeterNo").val();
    claiminfo["createdTime"]=new Date(new Date()+"-00:00");
    claiminfo["createdBy"]=userId;
    claiminfo["modifiedTime"]=new Date(new Date()+"-00:00");
    claiminfo["modifiedBy"]=userId;
    claiminfo["remark"] =$("#remarks").val();

    console.log(claiminfo)

    var FlowId = $.md5(JSON.stringify(claiminfo)+new Date().getTime());
    claiminfo["flowInstId"] = FlowId;
    claiminfo['meterNocId'] = FlowId;


    var flowInfo = {
        "meterId":claiminfo.meterId,
        "noChangeBefore":claiminfo.noChangeBefore,
        "noChangeAfter":claiminfo.noChangeAfter,
        "remark":claiminfo.remark
    }

    var flowjson = {
        "flow_def_id":"METERNOC",
        "ref_no":FlowId,
        "operator":userId,
        "be_orgs":areaId,
        "flow_inst_id":FlowId,
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":"表编号变更申请",
        "propstr128":"表编号变更申请计量中心",
        "propstr2048":flowInfo,
        "override_exists":false
    }

    var nochange = Restful.insert(hzq_rest+"/gasmtrmeternoc",claiminfo)
    console.log(nochange)
    if(nochange.success){
        var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson)
        console.log(flow_result)
        if(flow_result.retmsg == "SUCCESS:1"){
            bootbox.alert("<center><h4>提交成功</h4></center>",function(){
                window.location.reload();
            });
        }else{
            var resultss = Restful.delByID(hzq_rest+"/gasmtrmeternoc",FlowId)
    
            bootbox.alert("提交失败",function(){
                window.location.reload();
            })
        }
    }
    

})


$(".lingqu").on("click",function(){

    var detailFormat =function(){
        return{
            f:function(val,row){
                return "<a href='metermanage/nochange_detail.html?" + row.meterNocId+ "'>详情</a>"
                // return "<a  data-target='#pic' class='pictures' data-toggle='modal' data-pic='" + val + "'>图片</a>"
            }
        }
    }()
    var statuss = {"1":"申请中","2":"审批通过","3":"审批未通过"}
    var statusFormat = function(){
        return{
            f:function(val){
                return statuss[val]
            }
        }
    }()
    var bds ={
        "cols":"*",
        "froms":"gas_mtr_meter_noc",
        "wheres":"area_id in ("+arrareaid.join()+")",
        "page":true,
        "limit":50
    }
    $('#divtable1').html('');
    // <a  data-target='#pic' class='pictures' data-toggle='modal' data-pic='" + val + "'>图片</a>
    xws = XWATable.init(
        {
            divname: "divtable1",
            //----------------table的选项-------
            pageSize: 10,
            columnPicker: true,
            transition: 'fade',
            findbtn: "find_button2",
            checkboxes: false,
            checkAllToggle: true,
            //----------------基本restful地址---
            restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bds)),
            key_column: 'meterNocId',
            coldefs: [
                {
                    col: "noChangeBefore",
                    friendly: "变更前表编号",
                    sorting: true,
                    index: 1
                },
                {
                    col: "noChangeAfter",
                    friendly: "变更后表编号",
                    sorting: true,
                    index: 3
                },
                {
                    col: "refuseReason",
                    friendly: "拒绝原因",
                    sorting: true,
                    index: 4
                },
                {
                    col: "remark",
                    friendly: "备注",
                    sorting: true,
                    index: 5
                },
                {
                    col: "status",
                    friendly: "审批状态",
                    format: statusFormat,
                    sorting: true,
                    index: 6
                },
               
                {
                    col: "files",
                    friendly: "操作",
                    format: detailFormat,
                    sorting: true,
                    index: 23
                }
            ],
            //---------------查询时过滤条件
            findFilter: function () {
                
                var noChangeBefore = $('#noChangeBefore').val();
                var noChangeAfter = $('#noChangeAfter').val();
                var whereinfo = "";
                if (noChangeBefore) {
                    whereinfo += " no_change_before = '" + noChangeBefore + "' and ";
                }
                
                if (noChangeAfter) {
                    whereinfo += " no_change_after = '" + noChangeAfter + "' and ";
                }
                if ($('#status').val()) {
                    whereinfo += " status='" + $('#status').val() + "' and ";
                }
                
                var bds ={
                    "cols":"*",
                    "froms":"gas_mtr_meter_noc",
                    "wheres":whereinfo + " area_id in ("+arrareaid.join()+")",
                    "page":true,
                    "limit":50
                }
                xws.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bds)));
            },//--findFilter
        }
    )
    
    
})

