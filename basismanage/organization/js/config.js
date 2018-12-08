var ConfigAction = function () {
    return {
        init: function () {
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
                    restbase: 'gasbasprintconfig/?sort=printConfigId',
                    key_column: 'printConfigId',
                    coldefs: [
                        {
                            col: "printConfigId",
                            friendly: "打印配置ID",
                            unique: "true",
                            nonedit: "nosend",
                            hidden:true,
                            index: 1
                        },
                        {
                            col: "cmdType",
                            friendly: "打印请求命令",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "businessCode",
                            friendly: "业务编码",
                            validate:"required",
                            index: 3

                        },
                        {
                            col: "businessName",
                            friendly: "业务名称",
                            // validate:"required",
                            index: 4
                        },
                        {
                            col: "printConfig",
                            friendly: "套打配置",
                            inputsource:"textarea",
                            // validate:"required",
                            index: 5
                        },
                        /*{
                            col: "creatTime",
                            friendly: "创建时间",
                            hidden:true,
                            index: 6
                        },
                        {
                            col: "creatBy",
                            friendly: "创建人",
                            hidden: true,
                            index: 7
                        },
                        {
                            col: "modifiedTime",
                            friendly: "变更时间",
                            hidden: true,
                            index: 8
                        },
                        {
                            col: "modifiedBy",
                            friendly: "变更人",
                            index: 9
                        },*/
                        {
                            col: "status",
                            friendly: "状态",
                            format:GasSysBasic.StatusFormat,
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index: 11
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var  find_unitname;
                        if($('#find_unitname').val())
                        {
                            find_unitname=RQLBuilder.like("businessName",$.trim($('#find_unitname').val()));
                        }

                        var  find_Code;
                        if($('#find_Code').val())
                        {
                            find_Code=RQLBuilder.like("businessCode",$.trim($('#find_Code').val()));
                        }
                        var filter=RQLBuilder.and([
                            find_unitname,find_Code
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
$(document).on("click","#upd_button",function(){
    $("textarea").css({"width":"100%","height":"100px"});
})
$(document).on("click","#add_button",function(){
    $("textarea").css({"width":"100%","height":"100px"});
})
