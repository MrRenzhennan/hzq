var href = document.location.href;
//居民优惠ID
var rsdtDctId = href.substring(href.indexOf("?")+1, href.lenth);
var residentDisApprovalAction = function () {

    var xw ;

    // 用气性质helper
    var gasTypeHelper=RefHelper.create({
        ref_url:"gasbizgastype",
        ref_col:"gastypeId",
        ref_display:"gastypename",
    });

    var gasTypeFormat = function () {
        return {
            f : function (val) {
                return gasTypeHelper.getDisplay(val) ;
            }
        }
    }();


    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
        },

        reload:function(){

            $('#divtable').html('');
            var resUrl="";
            if ($('#find_ctmArchiveId').val()) {
                resUrl += "ctmArchiveId=" + $('#find_ctmArchiveId').val()
            }
            if ($('#find_customername').val()) {
                resUrl += "&customername=" + $('#find_customername').val()
            }
            if ($('#find_customeraddress').val()) {
                resUrl += "&customeraddress=" + $('#find_customeraddress').val()
            }


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
                    restbase: 'gasbllrsdtdctctm',
                    key_column:'rsdtDctCtmId',
                    coldefs:[

                        {
                            col:"rsdtDctCtmId",
                            friendly:"居民优惠客户ID",
                            hidden:true,
                            unique:"true",
                            index:1
                        },
                        {
                            col:"rsdtDctId",
                            //col:"customercode",
                            friendly:"客户编号",
                            index:2
                        },
                        {
                            col:"ctmArchiveId",
                           // col:"customername",
                            friendly:"客户姓名",
                            index:3
                        },
                        {
                            col:"linkmantel",
                            friendly:"联系电话",
                            index:4
                        },
                        {
                            col:"customeraddress",
                            friendly:"客户地址",
                            index:5
                        },
                        {
                            col:"gastypeId",
                            friendly:"用气性质",
                            format:gasTypeFormat,
                            inputsource: "select",
                            ref_url:  "gasbizgastype",
                            ref_name: "gastypename",
                            ref_value: "gastypeId",
                            index:6
                        },
                        {
                            col:"persons",
                            friendly:"家庭人口数",
                            index:7
                        },
                        {
                            col:"discount",
                            friendly:"优惠气量",
                            index:8
                        }

                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var resUrl="";
                        if ($('#find_ctmArchiveId').val()) {
                            resUrl += "ctmArchiveId=" + $('#find_ctmArchiveId').val()
                        }
                        if ($('#find_customername').val()) {
                            resUrl += "&customername=" + $('#find_customername').val()
                        }
                        if ($('#find_customeraddress').val()) {
                            resUrl += "&customeraddress=" + $('#find_customeraddress').val()
                        }
                        var queryUrl = hzq_rest + 'gasbllrsdtdctctm/queryRsdtDctInfobyId/'+rsdtDctId+'?' +resUrl;

                        xw.setRestURL(queryUrl)
                        return "";

                    },

                }) //--init
        },

    }
}();
