var garbageHistoryAction = function () {

    var xw ;
    var href = document.location.href;
    var gastypeId = href.substring(href.indexOf("?")+1, href.lenth)+"";


    // 用气性质helper
    var gasTypeHelper=RefHelper.create({
        ref_url:"gasbizgastype",
        ref_col:"gastypeId",
        ref_display:"gastypename",
    });


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
                    restbase: 'gasbllbageprice?query={"gastypeId":"'+gastypeId+'"}',
                    key_column: "bagepriceId",
                    //---------------行定义
                    coldefs:[
                        {
                            col:"bagepriceId",
                            friendly:"垃圾费价格ID",
                            hidden:true,
                            unique:"true",
                            index:1
                        },
                        {
                            col:"gastypeId",
                            friendly:"客户类型",
                            format:gasTypeFormat,
                            inputsource: "select",
                            ref_url:  "gasbizgastype",
                            ref_name: "gastypename",
                            ref_value: "gastypeId",
                            index:2
                        },
                        {
                            col:"priceVersion",
                            friendly:"版本号",
                            index:3
                        },
                        {
                            col:"price5",
                            friendly:"费用标准",
                            index:4
                        },

                        {
                            col:"persons",
                            friendly:"家庭人口数",
                            index:5
                        },

                        {
                            col:"startTime",
                            friendly:"开始时间",
                            index:6
                        },
                        {
                            col:"startTime2",
                            friendly:"结束时间",
                            index:7
                        },
                        {
                            col:"chargeType",
                            friendly:"收费模式",
                            index:8
                        },

                        {
                            col:"creator",
                            friendly:"调价人",
                            index:9
                        },
                        {
                            col:"createTime",
                            friendly:"调价时间",
                            index:10
                        },
                        {
                            col:"remark",
                            friendly:"备注",
                            index:11
                        }




                    ],
                    // 查询过滤条件
                    findFilter: function(){
                        xw.setRestURL(hzq_rest +'gasbllbageprice');
                        var find_priceVersion , find_gastypeId;

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
    window.location = "../garbagecost.html";
});
