var gasCycleHistoryAction = function () {

    var xw ;
    var href = document.location.href;
    var gastypeId = href.substring(href.indexOf("?")+1, href.lenth)+"";


    // 气源helper
    var gasSourceHelper=RefHelper.create({
        ref_url:"gasbasgaskind",
        ref_col:"gasKindId",
        ref_display:"name",
    });


    // 用气性质helper
    var gasTypeHelper=RefHelper.create({
        ref_url:"gasbizgastype",
        ref_col:"gastypeId",
        ref_display:"gastypename",
    });


    var gasSourceFormat=function(){
        return {
            f: function(val){
                return gasSourceHelper.getDisplay(val);
            },
        }
    }();

    // var gasTypeFormat = function () {
    //     return {
    //         f : function (val) {
    //             return "<a href='/charging/gas_step_history_detail.html?" + gasTypeHelper.getDisplay(val) + "'>" +  gasTypeHelper.getDisplay(val) + "</a>";
    //         }
    //     }
    // }();
    var gasTypeFormat=function(){
        return {
            f: function(val){
                return gasTypeHelper.getDisplay(val);
            },
        }
    }();


    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
        },


        reload:function(){

            $('#divtable').html('');

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasbllgasprice?query={"gastypeId":"'+gastypeId+'"}',
                    key_column: "gaspriceId",
                    //---------------行定义
                    coldefs:[
                        {
                            col:"gaspriceId",
                            friendly:"GasPriceId",
                            unique:true,
                            hidden:true,
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"priceVersion",
                            friendly:"版本号",
                            index:2
                        },
                        {
                            col:"gastypeId",
                            friendly:"用气性质",
                            format:gasTypeFormat,
                            inputsource: "select",
                            ref_url:  "gasbizgastype",
                            ref_name: "gastypename",
                            ref_value: "gastypeId",
                            index:3
                        },
                        {
                            col:"cycleStartTime",
                            friendly:"周期开始时间",
                            index:4
                        },

                        {
                            col:"cycleEndTime",
                            friendly:"周期结束时间",
                            index:5
                        },
                        {
                            col:"remark",
                            friendly:"阶梯和气价",
                            index:6
                        },
                        {
                            col:"creator",
                            friendly:"调价人",
                            index:7
                        },



                        {
                            col:"createTime",
                            friendly:"调价时间",
                            index:8
                        },

                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        xw.setRestURL(hzq_rest + 'gasbllgasprice');
                        var find_priceVersion ,find_gastypeId;

                        if($('#find_priceVersion').val())
                        {
                            find_priceVersion=RQLBuilder.equal("priceVersion",$('#find_priceVersion').val());
                        }
                        find_gastypeId =RQLBuilder.equal("gastypeId",gastypeId);

                        // if($('#find_unitname').val())
                        // {
                        //     find_unitname=RQLBuilder.like("unitname",$('#find_unitname').val());
                        // }

                        var filter=RQLBuilder.and([
                            find_priceVersion,find_gastypeId
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
        },


    }





}();
$('#cancel').click(function () {
    window.location = "../gascost.html";
});
