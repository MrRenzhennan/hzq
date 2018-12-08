/**
 * Created by alex on 2017/6/29.
 */
var FillGasApplyAction = function () {

    // // 父菜单helper
    // var MenuHelper = RefHelper.create({
    //     ref_url: "gassysmenu",
    //     ref_col: "menuId",
    //     ref_display: "menuName"
    // });


    // var MenuFormat = function () {
    //     return {
    //         f: function (val) {
    //             return MenuHelper.getDisplay(val);
    //         }
    //     }
    // }();
    return {
        init: function () {
            // this.initHelper();
            this.reload();
        },

        initHelper: function () {

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
                    //----------------基本restful地址---
                    restbase: 'gaschgiccardcomplement',
                    key_column: 'menuId',
                    coldefs: [
                        {
                            col: "complementId",
                            friendly: "申请Id",
                            validate: "required",
                            hidden: true,
                            unique: "true",
                            index: 1
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "applyGas",
                            friendly: "申请气量",
                            index: 5
                        },
                        {
                            col: "approveGas",
                            friendly: "标准气量",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "applyTime",
                            friendly: "申请时间",
                            sorting: true,
                            index: 7
                        },
                        {
                            col: "applyReason",
                            friendly: "申请原因",
                            index: 8
                        },
                        {
                            col: "approveTime",
                            friendly: "批准时间",
                            sorting: true,
                            index: 9
                        },
                        {
                            col: "useState",
                            friendly: "申请状态",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "useTime",
                            friendly: "使用时间",
                            sorting: true,
                            index: 11
                        },
                        {
                            col: "remark",
                            friendly: "备注",
                            index: 11
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var customerCode,customerName;

                        if ($('#customerCode').val()) {
                            customerCode = RQLBuilder.like("customerCode", $.trim($('#customerCode').val()));
                        }
                        if ($('#customerName').val()) {
                            customerName = RQLBuilder.like("customerName", $.trim($('#customerName').val()));
                        }
                        var filter = RQLBuilder.and([
                            customerCode,customerName
                        ]);
                        return filter.rql();
                    }
                })
        }

    }
}();
