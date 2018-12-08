var WastePrice = function () {
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
                    restbase: 'gasbllwasteprice',
                    key_column: 'wastePriceId',
                    coldefs: [
                        {
                            col: "wastePriceId",
                            friendly: "燃气费价格ID",
                            
                            index: 1
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质ID",
                            index: 2
                        },
                        {
                            col: "priceVersion",
                            friendly: "价格版本",
                            index: 3

                        },
                        {
                            col: "price5",
                            friendly: "价格",
                            index: 4
                        },
                        {
                            col: "startTime",
                            friendly: "开始时间",
                            index: 5
                        },
                        {
                            col: "endTime",
                            friendly: "结束时间",
                            index: 6
                        },
                        {
                            col: "price1",
                            friendly: "第一阶梯价格",
                            index: 7
                        },
                        {
                            col: "creator",
                            friendly: "调价人",
                            index: 8
                        },
                        {
                            col: "createTime",
                            friendly: "调价时间",
                            index: 9
                        },
                        {
                            col: "chargeType",
                            friendly: "收费方式",
                            index: 10
                        },
                        {
                            col: "persons",
                            friendly: "家庭人口数",
                            index: 11
                        },
                        {
                            col: "remark",
                            friendly: "备注",
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
