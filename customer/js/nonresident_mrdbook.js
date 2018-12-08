/**
 * Created by Administrator on 2017/5/16 0016.
 */

SideBar.init();
SideBar.activeCurByPage("non_inhabitant_archivemanagement.html");
// var unboltId;
var AreaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
});
var bookHelper=RefHelper.create({
    ref_url: "gasmrdbook",
    ref_col: "bookId",
    ref_display: "bookCode"
});
var operatorHelper = RefHelper.create({
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
var operatorFormat = function () {
    return {
        f: function (val) {
            return operatorHelper.getDisplay(val);
        }
    }
}();
var select_mrdBookAction = function () {
    var xw ;
    var detailedInfoFormat = function () {
        return {
            f: function (val) {
                return '<a id="todetail" href="customer/input_non_inhabitant_archive.html?' + val + '">建档</a>';;
            }
        }
    }();
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
            // this.initUnitTree();
        },

        initHelper:function(){
            $.map(bookHelper.getData(), function (value, key) {
                $('#bookId').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload: function () {
            $('#divtable').html('');
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    // columnPicker: true,
                    transition: 'fade',
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasmrdbook',
                    key_column: 'bookId',
                    coldefs:[
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:AreaFormat,
                            sorting: false,
                            index:1
                        },
                        {
                            col:"bookCode",
                            friendly:"抄表本号",
                            index:2
                        },
                        {
                            col:"countperId",
                            friendly:"核算员",
                            sorting: false,
                            format:operatorFormat,
                            index:3
                        },
                        {
                            col:"serviceperId",
                            friendly:"抄表员",
                            sorting: false,
                            format:operatorFormat,
                            index:4
                        },
                        {
                            col:"bookId",
                            friendly:"操作",
                            format:detailedInfoFormat,
                            index:5
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var bookId;
                        if ($('#bookId').val()) {
                            bookId = RQLBuilder.equal("bookId", $('#bookId').val());
                        }
                        var filter = RQLBuilder.and([
                            bookId
                        ]);
                        return filter.rql();
                    },
                    onAdded: function (ret, jsondata) {

                    },

                    onUpdated: function (ret, jsondata) {

                    },

                    onDeleted: function (ret, jsondata) {
                    }
                }
            );
        }

    }
}();

