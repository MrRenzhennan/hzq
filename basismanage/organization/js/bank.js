var BankAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: false,
                    //----------------基本restful地址---
                    restbase: 'gasbasbank/?sort=bankCode',
                    key_column: 'bankId',
                    coldefs: [
                        {
                            col: "bankId",
                            friendly: "银行Id",
                            unique: "true",
                            nonedit: "nosend",
                            hidden:true,
                            index: 1
                        }, {
                            col: "bankCode",
                            friendly: "银行代码",
                            validate: "required",
                            index: 2
                        },
                        {
                            col: "bankName",
                            friendly: "银行名称",
                            validate: "required",
                            index: 3
                        },
                        {
                            col: "bankType",
                            friendly: "银行类别",
                            validate: "required",
                            index: 4
                        },
                        {
                            col: "linkMan",
                            friendly: "联系人",
                            hidden: true,
                            index: 5

                        },
                        {
                            col: "linkPhone",
                            friendly: "联系电话",
                            hidden: true,
                            index: 6
                        },
                        {
                            col: "linkAddr",
                            friendly: "通讯地址",
                            hidden: true,
                            index: 7
                        },
                        {
                            col: "chargeRate",
                            friendly: "燃气费代收费率",
                            index: 8
                        },
                        {
                            col: "wasteChargeRate",
                            friendly: "垃圾费代收费率",
                            index: 9
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            format: GasSysBasic.StatusFormat,
                            validate: "required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index: 10
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_unitCode, find_unitname;
                        if ($('#find_unitCode').val()) {
                            find_unitCode = RQLBuilder.like("bankCode", $('#find_unitCode').val());
                        }
                        console.log($('#find_unitCode').val())
                        if ($('#find_name').val()) {
                            find_unitname = RQLBuilder.like("bankName", $('#find_name').val());
                        }
                        var filter = RQLBuilder.and([
                            find_unitCode, find_unitname
                        ]);

                        xw.setRestURL(hzq_rest + 'gasbasbank');
                        return filter.rql();
                    },
                    onAdded: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
        }

    }
}();
