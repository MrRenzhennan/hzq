var Gasblldetail = function () {
    return {
        init: function () {
            this.reload();
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
                    restbase: 'gasblldetail',
                    key_column: 'bllDetailId',
                    coldefs: [
                        {
                            col: "bllDetailId",
                            friendly: "计费明细ID",
                            hidden:true,
                            index: 1
                        },
                        {
                            col: "gasTypeId",
                            friendly: "燃气费价格ID",
                            index: 2
                        },
                        {
                            col: "ctmArchiveId",
                            friendly: "客户档案ID",
                            index: 3

                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质ID",
                            index: 4
                        },
                        {
                            col: "countPerId",
                            friendly: "核算员ID",
                            index: 5
                        },
                        {
                            col: "servicePerId",
                            friendly: "客户服务员ID",
                            index: 6
                        },
                        {
                            col: "copyTime",
                            friendly: "抄表时间",
                            index: 7
                        },
                        {
                            col: "meterReading",
                            friendly: "表读数",
                            index: 8
                        },
                        {
                            col: "finallyMeasure",
                            friendly: "最终气量",
                            index: 9
                        },
                        {
                            col: "price",
                            friendly: "价格",
                            index: 10
                        },
                        {
                            col: "gasFee",
                            friendly: "燃气费",
                            index: 11
                        },
                        {
                            col: "chargingType",
                            friendly: "计费类别",
                            index: 12
                        },
                        {
                            col: "addupMonth",
                            friendly: "结算月",
                            index: 12
                        },
                        {
                            col: "addupDay",
                            friendly: "结算日",
                            index: 12
                        },
                        {
                            col: "chargingMode",
                            friendly: "计费方式",
                            index: 12
                        }
                        
                        
                        
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var filter = RQLBuilder.and([]);
                        return filter.rql();
                    },

                    onAdded: function (ret, jsondata) {

                    },

                    onUpdated: function (ret, jsondata) {

                    },

                    onDeleted: function (ret, jsondata) {
                    }
                })
        }

    }
}();
