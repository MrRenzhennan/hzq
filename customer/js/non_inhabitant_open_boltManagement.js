/**
 * Created by Alex on 2017/3/15.
 */
var xw;
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $('#find_area').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
        })
    }
});




var Non_Open_BoltAction = function () {
    // 单位helper
    var areaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var operatorHelper=RefHelper.create({
        ref_url:"gassysuser",
        ref_col:"userId",
        ref_display:"employeeName"
    });
    var areaFormat = function () {
        return {
            f: function (val) {
                return areaHelper.getDisplay(val);
            }
        }
    }();
    var operatorFormat=function(){
        return {
            f: function(val){
                return operatorHelper.getDisplay(val);
            }
        }
    }();
    var detailedInfoFormat = function () {
        return {
            f : function (val) {
                return '<a id="todetail" href="customer/non_inhabitant_open_bolt_detail.html?refno=' + val + '">详情</a>';
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
           /* $.map(areaHelper.getData(), function (value, key) {
                $('#find_area').append('<option value="' + key + '">' + value + '</option>');
            });*/

        },
        reload: function () {
            $('#divtable').html('');
            var queryCondion = RQLBuilder.and([
                RQLBuilder.equal("customerType","9"),
                RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea))
            ]).rql()
            console.log(queryCondion)
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restbase: 'gascsrunbolt?query='+queryCondion,
                    key_column: "unboltId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "unboltNo",
                            friendly: "开栓令编号",
                            unique: true,
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "projectNo",
                            friendly: "项目编号",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "projectName",
                            friendly: "项目名称",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "projectDate",
                            friendly: "项目日期",
                            format:dateFormat,
                            index: 4
                        },
                        {
                            col: "buildUnit",
                            friendly: "建设单位",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "projectType",
                            friendly: "工程类别",
                            sorting: false,
                            hidden: true,
                            index: 6
                        },
                        {
                            col: "projectAddress",
                            friendly: "工程地址",
                            sorting: false,
                            hidden: true,
                            index: 7
                        },
                        {
                            col: "linkMan",
                            friendly: "联系人",
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "linkTel",
                            friendly: "联系方式",
                            sorting: false,
                            hidden: true,
                            index: 9
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: areaFormat,
                            sorting: false,
                            // ref_url: "gassysunit",
                            // ref_name: "unitname",
                            // ref_value: "unitId",
                            index: 10
                        },
                        {
                            col: "operator",
                            friendly: "操作员",
                            sorting:false,
                            format:operatorFormat,
                            ref_url:  "gassysuser",
                            ref_name: "employeeName",
                            ref_value: "operator",
                            index: 11
                        },
                        {
                            col: "approveStatus",
                            friendly: "审核状态",
                            sorting: false,
                            format:GasModCtm.projectStatusFormat,
                            index: 12
                        },
                        {
                            col: "unboltId",
                            friendly: "操作",
                            sorting: false,
                            format:detailedInfoFormat,
                            index: 13
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_area, find_projectNo, find_projectName, find_linkMan, find_buildUnit, find_projectAddress,find_unboltNo;

                        if ($('#find_area').val()) {
                            find_area = RQLBuilder.equal("areaId", $('#find_area').val());
                        }else{
                            find_area = RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        }
                        if ($('#find_projectNo').val()) {
                            find_projectNo = RQLBuilder.like("projectNo", $('#find_projectNo').val());
                        }
                        if ($('#find_unboltNo').val()) {
                            find_unboltNo = RQLBuilder.like("unboltNo", $('#find_unboltNo').val());
                        }
                        if ($('#find_projectName').val()) {
                            find_projectName = RQLBuilder.like("projectName", $('#find_projectName').val());
                        }
                        if ($('#find_linkMan').val()) {
                            find_linkMan = RQLBuilder.like("linkMan", $('#find_linkMan').val());
                        }
                        if ($('#find_buildUnit').val()) {
                            find_buildUnit = RQLBuilder.like("buildUnit", $('#find_buildUnit').val());
                        }
                        if ($('#find_projectAddress').val()) {
                            find_projectAddress = RQLBuilder.like("projectAddress", $('#find_projectAddress').val());
                        }
                        var customerType = RQLBuilder.equal("customerType","9");
                        var filter = RQLBuilder.and([
                            find_area, find_projectNo, find_projectName, find_linkMan, find_buildUnit, find_projectAddress,customerType,find_unboltNo
                        ]);
                        xw.setRestURL(hzq_rest + "gascsrunbolt")
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
function add() {
    window.location.href = "customer/non_inhabitant_open_bolt_input.html";
}