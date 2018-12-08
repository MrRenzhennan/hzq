/**
 * Created by alex on 2017/5/10.
 */
ComponentsPickers.init();
var xw;
var BusinessQueryAction = function () {
    // 供气区域helper
    var AreaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });
    //业务类型helper
    var businessTypeHelper = RefHelper.create({
        ref_url: "gascsrbusinesstype",
        ref_col: "businessTypeId",
        ref_display: "name"
    });
    var AreaFormat=function(){
        return {
            f: function(val){
                return AreaHelper.getDisplay(val);
            }
        }
    }();

    return {

        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
            // 分公司 select init
            $.map(AreaHelper.getData(), function (value, key) {
                $('#find_Area').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(businessTypeHelper.getData(), function (value, key) {
                $('#find_businessTypeId').append('<option value="' + key + '">' + value + '</option>');
            });

        },
        reload:function(){

            $('#divtable').html('');

            this.xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 20, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);            //data.row holds the underlying row you supplied.
                    },
                    //----------------基本restful地址---
                    restbase: 'json/service/business_query.json',
                    //---------------行定义
                    coldefs: [
                        {
                            col: "ID",
                            friendly: "序号",
                            unique: true,
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "meter_book_ID",
                            friendly: "抄表本号",
                            readonly: "readonly",
                            index: 2
                        },
                        {
                            col: "user_ID",
                            friendly: "客户编号",
                            readonly: "readonly",
                            index: 3
                        },
                        {
                            col: "user_Name",
                            friendly: "客户名称",
                            readonly: "readonly",
                            index: 4
                        },
                        {
                            col: "accept_date",
                            friendly: "受理日期",
                            readonly: "readonly",
                            index: 5
                        },
                        {
                            col: "finish_date",
                            friendly: "完成日期",
                            readonly: "readonly",
                            index: 6
                        },
                        {
                            col: "meter_Name",
                            friendly: "表户名称",
                            readonly: "readonly",
                            index: 7
                        },
                        {
                            col: "business_type",
                            friendly: "业务类型",
                            readonly: "readonly",
                            index: 8
                        },
                        {
                            col: "user_address",
                            friendly: "客户地址",
                            readonly: "readonly",
                            index: 9
                        },
                        {
                            col: "order_num",
                            friendly: "登记单号",
                            readonly: "readonly",
                            index: 10
                        },
                        {
                            col: "accept_person",
                            friendly: "受理人",
                            readonly: "readonly",
                            index: 11
                        },
                        {
                            col: "gas_supply_unit",
                            friendly: "供气单位",
                            readonly: "readonly",
                            index: 12
                        },
                        {
                            col: "UUID",
                            friendly: "操作",
                            nonedit: "nosend",
                            format: openButton,
                            index: 13
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function(){
                        var  find_unitname;
                        if($('#find_unitname').val())
                        {
                            find_unitname=RQLBuilder.like("unitName",$.trim($('#find_unitname').val()));
                        }
                        var filter=RQLBuilder.and([
                            find_unitname
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    }
                }) //--init
        },

    }
}();