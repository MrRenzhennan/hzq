/**
 * Created by Administrator on 2017/5/18 0018.
 */

SideBar.init();
// SideBar.activeCurByPage("inhabitant_archivemanagement.html");

SideBar.activeCurByPage("customer_information.html");
// var unboltId;

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
        })
    }
});
var inputQuery = RQLBuilder.and([
    RQLBuilder.equal("customerType","1"),
    RQLBuilder.equal("approveStatus","4"),
    RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea))
]).rql();
var AreaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
});
// 已通过开栓令helper
var projectHelper=RefHelper.create({
    ref_url:'gascsrunbolt/?query='+inputQuery,
    ref_col:"unboltId",
    ref_display:"unboltNo"
});
var operatorHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "employeeName"
});
var unboltHelper = RefHelper.create({
    ref_url: "gascsrunbolt",
    ref_col: "unboltId",
    ref_display: "unboltId"
});


var projectFormat=function(){
    return {
        f: function(val){
            return projectHelper.getDisplay(val);
        }
    }
}();
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
var inhabitantEstablish = function () {
    var xw ;
    var detailedInfoFormat = function () {
        return {
            f: function (val) {
                return '<a id="todetail" data-id="'+unboltHelper.getDisplay(val)+'" onclick="selectBook($(this))">建档</a>';
            }
        }
    }();
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper:function(){
            $.map(projectHelper.getData(), function (value, key) {
                $('#find_unboltNo').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload: function () {
            //---------------行定义
           /* var xwQuery = RQLBuilder.and([
                RQLBuilder.equal("customerType","1"),
                RQLBuilder.equal("approveStatus","4"),
            ]).rql();
*/
            $('#divtable').html('');

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
                    restbase: 'gascsrunbolt/?query=' + inputQuery,
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
                            hidden:true,
                            sorting: false,
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
                            format: AreaFormat,
                            sorting: false,
                            ref_url: "gasbizarea",
                            ref_name: "areaName",
                            ref_value: "areaId",
                            index: 10
                        },
                        {
                            col: "operator",
                            friendly: "操作员",
                            sorting: false,
                            format: operatorFormat,
                            ref_url: "gassysuser",
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
                            format: detailedInfoFormat,
                            index: 13
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_unboltNo, find_projectNo;
                        if ($('#find_unboltNo').val()) {
                            find_unboltNo = RQLBuilder.equal("unboltId", $('#find_unboltNo').val());
                        }
                        if ($('#find_projectNo').val()) {
                            find_projectNo = RQLBuilder.equal("projectNo", $('#find_projectNo').val());
                        }

                        var customerType = RQLBuilder.equal("customerType","1");
                        var approveStatus=RQLBuilder.equal("approveStatus","4");
                        var find_area = RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        var filter = RQLBuilder.and([
                            find_unboltNo,find_projectNo,customerType,approveStatus,find_area
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
function selectBook(val){
    var unboltId=$(val).attr("data-id");
    console.log(unboltId);
    $("#divtable1").html("");
    var selectBookFormat = function () {
        return {
            f: function (val,row) {
                console.log(0)
                return '<a data-target="#input_many_modal" data-unboltId="'+unboltId+'" data-row='+JSON.stringify(row)+' data-toggle="modal" onclick="selectfile($(this))" data-backdrop="static">创建</a>'
                // return '<a href="customer/input_inhabitant_archive.html?'+val+'&'+unboltId+'">创建</a>';
            }
        }
    }();
    var selectBookFormats = function () {
        return {
            f: function (val,row) {
                console.log(0)
                return '<a data-target="#input_many_modal" data-unboltId="'+val+'" data-row='+JSON.stringify(row)+' data-toggle="modal" onclick="selectfiles($(this))" data-backdrop="static">创建</a>'

            }
        }
    }();
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        url: hzq_rest + 'gascsrunboltrsdtdetail/?query={"unboltId":"'+unboltId+'"}',
        dataType: 'json',
        data: "",
        success: function (data) {
            console.log(data);
            var bookId = [];
            for(var i=0;i<data.length;i++){
                bookId.push(data[i].bookId);
            }
            console.log(bookId);
            if(bookId[0] && bookId[0] !="undefined"){
                this.xw = XWATable.init({
                    divname: "divtable1",
                    //----------------table的选项-------
                    pageSize: 10,
                    tableId:"divtable1",
                    columnPicker: true,
                    transition: 'fade',
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasmrdbook?query={"bookId":{"$in":'+JSON.stringify(bookId)+'}}',
                    key_column: 'bookId',
                    coldefs:[
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:AreaFormat,
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
                            format:operatorFormat,
                            index:3
                        },
                        {
                            col:"serviceperId",
                            friendly:"抄表员",
                            format:operatorFormat,
                            index:4
                        },
                        {
                            col:"floornum",
                            friendly:"楼号",
                            index:4
                        },
                        {
                            col:"doorCount",
                            friendly:"户数",
                            index:5
                        },
                        {
                            col:"bookId",
                            friendly:"创建档案",
                            format:selectBookFormat,
                            index:5
                        }

                    ]
                })
            }else{
                var userHelper = RefHelper.create({
                    ref_url: "gascsrunbolt",
                    ref_col: "unboltId",
                    ref_display: "unboltNo"
                });
                var unboltidFormat = function () {
                    return {
                        f: function (val) {
                            return userHelper.getDisplay(val)
                        },
                    }
                }();


                this.xw = XWATable.init({
                    divname: "divtable1",
                    //----------------table的选项-------
                    pageSize: 10,
                    tableId:"divtable1",
                    columnPicker: true,
                    transition: 'fade',
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gascsrunboltrsdtdetail/?query={"unboltId":"'+unboltId+'"}',
                    key_column: 'rsdtDetailId',
                    coldefs:[
                        {
                            col:"unboltId",
                            friendly:"开栓令编号",
                            format:unboltidFormat,
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
                            format:operatorFormat,
                            index:3
                        },
                        {
                            col:"serviceperId",
                            friendly:"抄表员",
                            format:operatorFormat,
                            index:4
                        },
                        {
                            col:"floorNum",
                            friendly:"楼号",
                            index:4
                        },
                        {
                            col:"roomCount",
                            friendly:"户数",
                            index:5
                        },
                        {
                            col:"rsdtDetailId",
                            friendly:"创建档案",
                            format:selectBookFormats,
                            index:5
                        }

                    ]
                })
            }


        }
    });
}


function selectfile(row){
    console.log(row.attr("data-unboltId"))
    console.log(JSON.parse(row.attr("data-row")))
    books = JSON.parse(row.attr("data-row"));
    console.log(books.bookId);
    var bookArchive = Restful.findNQ(hzq_rest + 'gasctmarchive/?query={"bookId":"'+books.bookId+'"}')
    archivecount = bookArchive.length
    bookconut = books.doorCount;

    console.log(bookconut-archivecount);
    if(bookconut-archivecount>0){
        window.location.href='customer/input_inhabitant_archive.html?'+books.bookId+'&'+row.attr("data-unboltId")+'';
    }else{
        bootbox.alert("<center><h4>抄表本"+books.bookCode+"户数已用完。</h4></center>")
        return false;
    }

}


function selectfiles(that){
    var row = JSON.parse(that.attr("data-row"));
    var unbolt = that.attr("data-unboltId");
    console.log(unbolt)
    if(row.cell && row.cell == row.roomCount){
        bootbox.alert("<center><h4>开栓令户数已用完。</h4></center>")
        return false;
    }else{
        window.location.href='customer/input_inhabitant_archives.html?'+unbolt+'';
    }
}

