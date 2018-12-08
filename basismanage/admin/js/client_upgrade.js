var xw;

var ClientUpGradeAction = function () {
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
                    restbase: 'gassysclientupgrade',
                    key_column: "clientUpgradeId",
                    //---------------行定义
                    coldefs: [
                        {
                            col:"clientUpgradeId",
                            friendly: "客户端升级表ID",
                            unique:true,
                            hidden:true,
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"packageName",
                            friendly:"升级包名称",
                            validate:"required",
                            index:2
                        },
                        {
                            col:"versionNumber",
                            friendly:"升级表版本号",

                            validate:"required",
                            index:3
                        },
                        {
                            col:"fileAddress",
                            friendly:"升级表文件地址",
                            validate:"required",
                            index:4
                        },
                        {
                            col:"md5Value",
                            friendly: "升级表MD5值",
                            validate:"required",
                            index:5
                        },
                        {
                            col:"publishTime",
                            friendly:"发布时间",
                            format:dateFormat,
                            nonedit:"nosend",
                            index:6
                        },
                        {
                            col:"updatesNumber",
                            friendly:"更新次数",
                            nonedit:"nosend",
                            index:7
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:dateFormat,
                            hidden:true,
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            hidden:true,
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            format:dateFormat,
                            hidden:true,
                            nonedit:"nosend",
                            index:9
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            hidden:true,
                            nonedit:"nosend",
                            index:10
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            format:GasSysBasic.StatusFormat,
                            // format:yandNEnum,
                            index:11
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function(){
                        var  find_upName,find_upCode;
                        if($('#find_upName').val())
                        {
                            find_upName=RQLBuilder.like("packageName",$.trim($('#find_upName').val()));
                        }
                        if($('#find_upCode').val())
                        {
                            find_upCode=RQLBuilder.like("versionNumber",$.trim($('#find_upCode').val()));
                        }
                        var filter=RQLBuilder.and([
                            find_upName,find_upCode
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
