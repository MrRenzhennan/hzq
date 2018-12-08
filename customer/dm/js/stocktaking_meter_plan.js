var meterInventoryId = JSON.parse(localStorage.getItem("meter_stocking"));
var meterDepositoryId = JSON.parse(localStorage.getItem("meter_depository"));
var scanNum=0;
var inventoryMeter=new Array();
var AreaHelper = RefHelper.create({
    ref_url: 'gasbizarea',
    ref_col: "areaId",
    ref_display: "areaName",
});
var DepositoryHelper = RefHelper.create({
    ref_url: 'gasmtrdepository',
    ref_col: "depositoryId",
    ref_display: "depositoryName",
});
var queryCondion = RQLBuilder.and([
    RQLBuilder.equal("status", "1"),
    RQLBuilder.equal("meterInventoryId", meterInventoryId)
]).rql();
$.ajax({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    type: 'get',
    async: false,
    url: hzq_rest + "gasmtrmeterinventory?query=" + queryCondion,
    success: function (data) {
        $("#areaName").val(AreaHelper.getDisplay(data[i].areaId));
        $("#depositoryName").val(DepositoryHelper.getDisplay(data[i].depositoryId));
        $("#createdPerson").val(data[i].createdBy);
        $("#createdTime").val(data[i].createdTime);
        $("#planNum").val(data[i].inventoryPlanCount);
        $("#num").val(scanNum);
    }
});
$("#areaName").val(AreaHelper.getDisplay());
var queryMeterAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_mtr_meter",
                "wheres": 'depository_id="'+meterDepositoryId+'" and stock_state="1"',
                "page": true,
                "limit": 50
            };
            xw = XWATable.init(
                {
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);            //data.row holds the underlying row you supplied.
                    },
                    //----------------基本restful地址---
                    // restbase: "gasmrdowe/queryByCondi?areaId=" + $('#findArea').val() + "&accountPerson=" + $('#accountPerson').val() + "&meterReadingPerson=" + $('#meterReadingPerson').val() + "&meterReadingCode=" + $('#meterReadingCode').val()
                    // + "&customerCode=" + $('#customerCode').val() + "&customerName=" + $('#customerName').val(),
                    // restbase:  "gasmrdowe/queryByCondi?areaId="+$('#findArea').val()+select,
                    //---------------行定义
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
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
                        }
                    ],
                    findFilter: function () {
                        var meterNo = $('#meterNo').val();
                        for(var i=0;i<inventoryMeter.length;i++){
                            if(meterNo==inventoryMeter[i]){
                                bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
                                $('#meterNo').val("");
                                return flase;
                            }
                        }
                        var whereinfo = "";
                        if (meterNo) {
                            whereinfo += "meter_no = '" + meterNo + "' and ";
                        }
                        bd = {
                            "cols": "*",
                            "froms": "gas_mtr_meter",
                            "wheres": whereinfo + 'depository_id="'+meterDepositoryId+'" and stock_state="1"',
                            "page": true,
                            "limit": 50
                        };
                        console.log(bd);
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }
                }
            );
        }
    }
}();



