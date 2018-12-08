var meterspecIdHelper = RefHelper.create({
    ref_url:'gasmtrfactory',
    ref_col:'factoryId',
    ref_display:'factoryName'
});

var MeterFactoryAction = function () {
    return {
        init: function () {
            $.map(meterspecIdHelper.getData(),function (value, key) {
                $('#find_unitname').append('<option value="' + value + '">' + value + '</option>');
            });

            this.reload();
        },
        reload: function () {

            $('#divtable').html('');

            this.xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: false,
                    //----------------基本restful地址---
                    restbase: 'gasmtrfactory',
                    key_column: 'factoryId',
                    coldefs: [
                        /*{
                            col: "factoryId",
                            friendly: "厂家Id",
                            unique:"true",
                            index: 1
                        },*/
                        {
                            col: "factoryName",
                            friendly: "厂家名称",
                            validate:"required",
                            unique:"true",
                            index: 2
                        },
                        {
                            col: "remark",
                            friendly: "备注",
                            index: 3

                        },
                        {
                            col: "status",
                            friendly: "状态",
                            format:GasSysBasic.StatusFormat,
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index: 4
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_unitname;

                        if($('#find_unitname option:selected').val()){
                            find_unitname = RQLBuilder.equal('factoryName',$('#find_unitname option:selected').val());
                        }

                        var filter=RQLBuilder.and([
                            find_unitname
                        ]);
                        return filter.rql();
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
