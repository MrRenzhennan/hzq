var GasPrice = function () {
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
                    restbase: 'gasbllgasprice',
                    key_column: 'gasPriceId',
                    coldefs: [
                        {
                            col: "gasPriceId",
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
                            col: "priceType",
                            friendly: "价格类型",
                            index: 4
                        },
                        {
                            col: "measureFrom1",
                            friendly: "第一阶梯起始气",
                            index: 5
                        },
                        {
                            col: "measureTo1",
                            friendly: "第一阶梯结束气",
                            index: 6
                        },
                        {
                            col: "price1",
                            friendly: "第一阶梯价格",
                            index: 7
                        },
                        {
                            col: "measureFrom2",
                            friendly: "第二阶梯起始气",
                            index: 8
                        },
                        {
                            col: "measureTo2",
                            friendly: "第二阶梯结束气",
                            index: 9
                        },
                        {
                            col: "price2",
                            friendly: "第二阶梯价格",
                            index: 10
                        },
                        {
                            col: "measureFrom3",
                            friendly: "第三阶梯起始气",
                            index: 11
                        },
                        {
                            col: "measureTo3",
                            friendly: "第三阶梯结束气",
                            index: 12
                        },
                        {
                            col: "price3",
                            friendly: "第三阶梯价格",
                            index: 13
                        },
                        {
                            col: "measureFrom4",
                            friendly: "第四阶梯起始气",
                            index: 14
                        },
                        {
                            col: "measureTo4",
                            friendly: "第四阶梯结束气",
                            index: 15
                        },
                        {
                            col: "price4",
                            friendly: "第四阶梯价格",
                            index: 16
                        },
                        {
                            col: "measureFrom5",
                            friendly: "第五阶梯起始气",
                            index: 17
                        },
                        {
                            col: "measureTo5",
                            friendly: "第五阶梯结束气",
                            index: 18
                        },
                        {
                            col: "price5",
                            friendly: "第五阶梯价格",
                            index: 19
                        },
                        {
                            col: "createTime",
                            friendly: "调价时间",
                            index: 20
                        },
                        {
                            col:"effectTime",
                            friendly:"生效时间",
                            index:21
                        },
                        {
                            col:"cycleStartTime",
                            friendly:"周期开始时间",
                            hidden:true,
                            index:22
                            
                        },
                        {
                            col:"cycleEndTime",
                            friendly:"周期结束时间",
                            hidden:true,
                            index:23
                            
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            hidden:true,
                            index:24                                                     
                        },
                        {
                            col:"persons",
                            friendly:"家庭人口数",
                            hidden:true,
                            index:25                                                     
                        },
                        {
                            col:"remark",
                            friendly:"备注",
                            hidden:true,
                            index:26                                                     
                        },
                        {
                            col:"coefficientMin",
                            friendly:"系数最小值",
                            hidden:true,
                            index:27                                                     
                        },
                        {
                            col:"coefficientMax",
                            friendly:"系数最大值",
                            hidden:true,
                            index:28                                                     
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
