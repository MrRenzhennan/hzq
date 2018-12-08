/**
 * Created by alex on 2017/4/23.
 */

var ResourceAction = function () {
    return {

        init: function () {
            this.reload();
        },
        reload:function(){

            $('#divtable').html('');

            this.xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gassysurlresource',
                    key_column: "urlResourceId",
                    //---------------行定义
                    coldefs: [
                        {
                            col:"urlResourceId",
                            friendly: "资源id",
                            unique:true,
                            hidden:true,
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"urlResourceName",
                            friendly:"资源名称",
                            validate:"required",
                            index:2
                        },
                        {
                            col:"urlResourcePath",
                            friendly:"资源地址",
                            validate:"required",
                            index:3
                        },
                        {
                            col:"urlResourceType",
                            friendly: "资源类型",
                            validate:"required",
                            format:GasSysBasic.InterfaceTypeFormat,
                            inputsource: "custom",
                            inputbuilder: "logTypeBuilder",
                            index:4
                        },
                        {
                            col:"urlLogOut",
                            friendly:"日志标记",
                            format:GasSysBasic.logFormat,
                            inputsource: "custom",
                            inputbuilder: "logBuilder",
                            index:5
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:dateFormat,
                            hidden:true,
                            nonedit:"nosend",
                            index:6
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            hidden:true,
                            nonedit:"nosend",
                            index:7
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            format:dateFormat,
                            hidden:true,
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            hidden:true,
                            nonedit:"nosend",
                            index:9
                        },
                        {
                            col:"status",
                            format:GasSysBasic.StatusFormat,
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            validate:"required",
                            friendly:"状态",
                            index:10
                        }
                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_resource;

                        if($('#find_resource').val())
                        {
                            find_resource=RQLBuilder.like("urlResourceName",$.trim($('#find_resource').val()));
                        }
                        var filter=RQLBuilder.and([
                            find_resource
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
                    },
                })
        }

    }
}();
