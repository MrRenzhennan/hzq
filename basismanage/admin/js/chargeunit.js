var xw;
var ChargeUnitAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');

            var pAreaHelper = RefHelper.create({
                ref_url:"gasbizarea",
                ref_col:"areaId",
                ref_display:"areaName",
            });
            var pAreaFormat = function () {
                return {
                    f : function (val) {
                        return pAreaHelper.getDisplay(val);
                    }
                }
            }();

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasbizchargeunit/?sort=chargeUnitCode',
                    key_column: 'chargeUnitId',
                    coldefs: [

                        {
                            col: "chargeUnitId",
                            friendly: "营业网点ID",
                            hidden: true,
                            unique: "true",
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "chargeUnitCode",
                            friendly: "营业网点代码",
                            validate:"required",
                            index: 2
                        },

                        {
                            col: "chargeUnitName",
                            friendly: "营业网点名称",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format:pAreaFormat,
                            inputsource: "select",
                            ref_url:  "gasbizarea",
                            ref_name: "areaName",
                            ref_value: "areaId",
                            validate:"required",
                            index: 4
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            format:GasSysBasic.StatusFormat,
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index: 5
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {

                    },
                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){
                    }
                })
        }

    }
}();



$("#del_buttons").on("click",function(){
    var selrows = xw.getTable().getData(true);
    // console.log(selrows)

    bootbox.confirm({
        buttons: {
            confirm: {
                label: '确认',
                className: 'blue'
            },
            cancel: {
                label: '取消',
                className: 'btn-default'
            }
        },
        message: "<br><center><h4>确定删除选择（" + selrows.rows.length + "）条记录吗？</h4></center><br>",
        callback:function(result){
            if (!result) return;
            
            else{
                var ids=[];
                $.each(selrows.rows, function(index, row) {
                    ids.push(row.chargeUnitId);
                });
                console.log("delete:"+JSON.stringify(ids));
                var ret=Restful.updateRNQ(hzq_rest+"gasbizchargeunit", ids.join(),{"status":"3"});
                if(ret.success){
                    bootbox.alert("<center><h4>删除成功。</h4></center>",function(){
                        xw.update();
                    })
                }else{
                    bootbox.alert("<center><h4>删除失败。</h4></center>")
                }

            }
        }
    })
})