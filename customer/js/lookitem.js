var itemStatusBuilder=function(val){
    if(val == "1"){
        return "<select id='itemStatus' name='itemStatus' class='form-control select2me'><option value='1' selected>使用</option><option value='2' >不使用</option></select>";
    }else{
        return "<select id='itemStatus' name='itemStatus' class='form-control select2me'><option value='1' >使用</option><option value='2' selected>不使用</option></select>";
    }
    

};
var lookAction = function () {
    var itemStatusFormat = function () {
        return {
            f: function (data, row) {
                if (data == "1") {
                    return "使用";
                } else if (data == "2") {
                    return "不使用";
                } else {
                    return "";
                }
            }
        }
    }();
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
                    restbase: 'gasctmlookitem',
                    key_column: 'itemId',
                    coldefs: [
                        {
                            col: "deviceId",
                            friendly: "调查项目ID",
                            validate:"required",
                            nonedit:"nosend",
                            hidden:"true",
                            unique: "true",
                            index: 1
                        },
                        
                        {
                            col:"itemName",
                            friendly: "调查项目名称",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "itemStatus",
                            friendly: "状态",
                            validate:"required",
                            // inputsource:"select
                            format:itemStatusFormat,
                            inputsource: "custom",
                            inputbuilder: "itemStatusBuilder",
                            sorting:false,
                            index: 4

                        },
                        {
                            col: "itemScore",
                            friendly: "总分",
                            validate:"required",
                            sorting:false,
                            index: 5

                        },
                        {
                            col: "itemText",
                            friendly: "备注",
                            validate:"required",
                            sorting:false,
                            index: 6

                        },
                        {
                            col: "itemSort",
                            friendly: "顺序",
                            validate:"required",
                            sorting:false,
                            index: 7

                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            format:dateFormat,
                            nonedit:"nosend",
                            sorting:false,
                            index: 8
                        }


                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_itemName;

                        if ($('#find_itemName').val()) {
                            find_itemName = RQLBuilder.like("itemName",$.trim($('#find_itemName').val()));
                        }

                        var filter = RQLBuilder.and([
                            find_itemName
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        jsondata['createdTime'] = new Date(new Date()+"-00:00");
                        jsondata['createdBy'] = JSON.parse(localStorage.getItem("user_info")).userId;
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        jsondata['updateTime'] = new Date(new Date()+"-00:00");
                        jsondata['modifiedBy'] = JSON.parse(localStorage.getItem("user_info")).userId;
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){

                    },
                }) //--init
        },

    }
}();
