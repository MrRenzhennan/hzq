/**
 * Created by jack on 2017/3/8.
 */

var href = document.location.href;
var wareflowId = href.split('?')[1];

var level1_in_detailAction = function () {

    //Helper

    //Format

    return {

        init: function () {
            this.initHelper();
            this.reload();
        },


        initHelper:function () {

        },

        reload: function () {
            $('#divtable').html('');

            this.xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrbillannex?' + wareflowId,
                    key_column:'billannexId',
                    coldefs:[
                        {
                            col:"wareflowdetailId",
                            friendly:"物流单号",
                            sorting:false,
                            readonly:"readonly",
                            default_value:wareflowId,
                            index:1
                        },
                        {
                            col:"billannexId",
                            friendly:"表具id",
                            unique:"true",
                            sorting:false,
                            readonly:"readonly",
                            index:2
                        },
                        {
                            col:"reccode",
                            friendly:"物品编码",
                            sorting:false,
                            index:3
                        },
                        {
                            col:"reskindId",
                            friendly:"物品种类",
                            sorting:false,
                            index:4
                        },
                        {
                            col:"spec",
                            friendly:"规格型号",
                            sorting:false,
                            index:5
                        },
                        {
                            col:"inputflag",
                            friendly:"入库标记",
                            sorting:false,
                            index:6
                        },
                        {
                            col:"resinfoid",
                            friendly:"物品信息",
                            sorting:false,
                            index:7
                        },
                        {
                            col:"createtime",
                            friendly:"创建时间",
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"remark",
                            friendly:"备注",
                            sorting:false,
                            hidden:true,
                            index:9
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function
                        var find_wareflowId = undefined;
                        if($('#find_wareflowId').val()){
                            find_wareflowId = RQLBuilder.like("wareflowId",$('#find_wareflowId').val());
                        }

                        var find_wareflowtypeId = undefined;
                        if($('#find_wareflowtypeId').val()){
                            find_wareflowtypeId = RQLBuilder.equal("wareflowtypeId",$('#find_wareflowtypeId').val());
                        }

                        var find_outdepositoryId = undefined;
                        if($('#find_outdepositoryid').val()){
                            find_outdepositoryId = RQLBuilder.equal("outdepositoryid",$('#find_outdepositoryid').val());
                        }

                        var find_indepositoryId = undefined;
                        if($('#find_indepositoryid').val()){
                            find_indepositoryId = RQLBuilder.equal("indepositoryid",$("#find_indepositoryid").val());
                        }

                        var filter =RQLBuilder.and([
                            find_wareflowId,find_wareflowtypeId,find_outdepositoryId,find_indepositoryId
                        ]);
                        return filter.rql();
                    },//--findFilter
                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }
            )
        }

    }
}();
