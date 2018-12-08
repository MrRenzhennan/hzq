var xw;
var areaHelper=RefHelper.create({
    ref_url:"gasbizarea",
    ref_col:"areaId",
    ref_display:"areaName"
});
var areaFormat=function(){
    return {
        f: function(val){
            return areaHelper.getDisplay(val);
        }
    }
}();
var customerkinds={"1":"居民","9":"非居民"};
var kindFormat = function () {
    return{
        f: function (val) {
            return customerkinds[val];
        }
    }
}()
var badtype={"1":"呆帐","2":"坏账"};
var badtypeFormat = function () {
    return{
        f: function (val) {
            return badtype[val];
        }
    }
}()
var wfstatus={"0":"审批中","1":"审批通过","2":"审批拒绝"};
var wfstatusFormat = function () {
    return{
        f: function (val) {
            return wfstatus[val];
        }
    }
}()
var statusF={"1":"启用","2":"停用","3":"已删除"};
var statusFormat = function () {
    return{
        f: function (val) {
            return statusF[val];
        }
    }
}()

var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
var gastypeFormat = function (){
    return{
        f: function(val){
            return gasTypeHelper.getDisplay(val);
        }
    }
}()

var userIdss = JSON.parse(localStorage.getItem("user_info")).userId;
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
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

var daizhang = function(){

    var queryCondion = RQLBuilder.and([
        RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea)),
        RQLBuilder.equal("badType","1"),
    ]).rql()

    return {
        init:function(){
            this.reload();
        },
        reload:function(){
            xw = XWATable.init({
                divname: "divtable",
                //----------------table的选项-------
                pageSize: 10, 			//Initial pagesize
                columnPicker: true,         //Show the columnPicker button
                sorting: true,
                transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                restbase:'gasactbadatl/?query='+queryCondion,
                // restURL: 'hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + encodeURIComponent(JSON.stringify(bd)),
                key_column: 'badAtlId',
                coldefs: [
                  
                    {
                        col: "areaId",
                        friendly: "供气区域",
                        sorting: false,
                        format:areaFormat,
                        index: 1
                    },
                    {
                        col: "customerCode",
                        friendly: "客户编号",
                        sorting: false,
                        index: 2
                    },
                    {
                        col: "customerName",
                        friendly: "客户姓名",
                        sorting: false,
                        index: 3
                    },
                    {
                        col: "customerKind",
                        friendly: "客户类别",
                        sorting: false,
                        format:kindFormat,
                        index: 4
                    },
                    {
                        col: "gasTypeId",
                        friendly: "用气性质",
                        format:gastypeFormat,
                        sorting: false,
                        index: 5
                    },
                    {
                        col: "badType",
                        friendly: "类型",
                        format:badtypeFormat,
                        sorting: false,
                        index: 6
                    },
                    {
                        col: "wfStatus",
                        friendly: "审批状态",
                        format:wfstatusFormat,
                        sorting: false,
                        index: 7
                    },
                    {
                        col: "status",
                        friendly: "状态",
                        format:statusFormat,
                        sorting: false,
                        index: 8
                    },
                    // {
                    //     col: "balance",
                    //     friendly: "余额",
                    //     sorting: false,
                    //     index: 3
                    // },
                    // {
                    //     col: "tradeDate",
                    //     friendly: "最后交易日期",
                    //     sorting: false,
                    //     //format:getDiffTradeDate,
                    //     index: 4
                    // },
                    // {
                    //     col: "dates",
                    //     friendly: "欠费天数",
                    //     sorting: false,
                    //     index: 3
                    // }
                ],
                // 查询过滤条件
                findFilter: function () {
                    var find_customerCode,
                    find_customerName,
                    find_customerkind,
                    find_badtype,
                    find_wfstatus,
                    find_status;

                    if ($('#find_customerCode').val()) {
                        find_customerCode = RQLBuilder.like("customerCode",$('#find_customerCode').val());
                    }
                    if ($('#find_customerName').val()) {
                        find_customerName = RQLBuilder.like("customerName",$('#find_customerName').val());
                    }
                    if ($('#find_customerkind').val()) {
                        find_customerkind = RQLBuilder.equal("customerKind",$('#find_customerkind').val());
                    }
                    if ($('#find_badtype').val()) {
                        find_badtype = RQLBuilder.like("badType",$('#find_badtype').val());
                    }
                    if ($('#find_wfstatus').val()) {
                        find_wfstatus = RQLBuilder.like("wfStatus",$('#find_wfstatus').val());
                    }
                    if ($('#find_status').val()) {
                        find_status = RQLBuilder.like("status",$('#find_status').val());
                    }

                    var filter = RQLBuilder.and([
                        find_customerCode,find_customerName,find_status,find_customerkind,find_badtype,find_wfstatus
                    ]);
                    return filter.rql();
                },
            });
        }
    }
}()




$("#sq_button").on("click",function(){
    window.location.href="financial/dzhzsq.html?1"
})