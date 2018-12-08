
var speGroupAction = function () {
    var statusFormat = function () {
        return {
            f: function (val) {
                if (val == "1") {
                    return "正常"
                } else if (val == "0") {
                    return "停用"
                }else{
                    return "异常"
                }
            }
        }
    }()

    return {

        init: function () {
            this.initHelper();
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
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasbizspecial/?sort=specId',
                    key_column: 'specId',
                    coldefs: [
                        {
                            col: "specId",
                            friendly: "特殊群体ID",
                            validate:"required",
                            unique: "true",
                            nonedit:"nosend",
                            index: 1
                        },
                        {
                            col: "specName",
                            friendly: "特殊群体名字",
                            validate:"required",
                            sorting: false,
                            index: 2
                        },
                        {
                            col:"specStatus",
                            friendly: "状态",
                            format:statusFormat,
                            hidden:true,
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "specSort",
                            friendly: "排序",
                            validate:"required",
                            index: 5
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_sName;

                        if ($('#find_sName').val()) {
                            find_sName = RQLBuilder.like("sName",$.trim($('#find_sName').val()));
                        }

                        var filter = RQLBuilder.and([
                            find_sName
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){

                    },
                }) //--init
        },

    }
}();
