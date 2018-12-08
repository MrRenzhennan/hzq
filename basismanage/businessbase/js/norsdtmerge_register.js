
var mergeAction = function () {

    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                return "<a   href='basismanage/businessbase/mergeDetail.html?"+row.mergeId+"'>" + '&nbsp;合并用户' + "</a>"+"|"+
                "<a  data-target='#detailInfo' id='detail' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>";
            }
        }
    }();
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper:function(){

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
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasctmarchivemerge/?sort=-createdTime',
                    key_column: 'mergeId',
                    coldefs: [
                        {
                            col: "mergeId",
                            friendly: "大客户档案ID",
                            validate:"required",
                            // unique: "true",
                            hidden:true,
                            nonedit:"nosend",
                            index: 1
                        },
                        {
                            col: "mergeName",
                            friendly: "名称",
                            validate:"required",
                            sorting: false,
                            index: 2
                        },
                        {
                            col:"mergeAddress",
                            friendly: "地址",
                            validate:"required",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            format:dateFormat,
                            inputsource:"datepicker",
                            default_value:new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
                            nonedit: "nosend",
                            validate:"required",
                            sorting: true,
                            index: 5
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            nonedit: "nosend",
                            readonly: "readonly",
                            default_value:UserInfo.userId(),
                            index:6
                        },
                        {
                            col: "mergeId",
                            friendly: "操作",
                            nonedit:"nosend",
                            format:detailedInfoFormat,
                            sorting:false,
                            index: 7
                        }


                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_mergeName;

                        if ($('#find_mergeName').val()) {
                            find_mergeName = RQLBuilder.like("mergeName",$.trim($('#find_mergeName').val()));
                        }

                        var filter = RQLBuilder.and([
                            find_mergeName
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },

                }) //--init
        },


    }
}();
var mergeId;
$(document).on('click', "#detail", function () {
    var stockInfo = JSON.parse($(this).attr("data-kind"));
    $('#divtable2').html('');
    console.log(stockInfo);
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + 'gasctmarchivemergedetail/?query={"mergeId":"' + stockInfo.mergeId + '"}',
        type: "get",
        dataType: "json",
        async: false,
        data: '',
        success: function (data) {
            if(data.length>0){
                mergeId =stockInfo.mergeId;
                mergeDetailAction1.init();
            }
        }
    });
});

var mergeDetailAction1 = function () {

    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var UserHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName"
    });
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var UserFormat = function () {
        return {
            f: function (val) {
                return UserHelper.getDisplay(val);
            }
        }
    }();
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable2').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_ctm_archive_merge_detail",
                "wheres": "mergeId='"+mergeId+"' order by created_time desc",
                "page": true,
                "limit": 50
            };
            xw = XWATable.init(
                {
                    divname: "divtable2",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: "mergeDetailId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: true,
                            index: 1
                        },
                        {
                            col: "createdBy",
                            friendly: "创建人",
                            format: UserFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            format: dateFormat,
                            sorting: true,
                            index: 8
                        }
                    ]
                }
            );
        }

    }
}();
