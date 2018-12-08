/**
 * Created by Administrator on 2017/5/18 0018.
 */

SideBar.init();
SideBar.activeCurByPage("nonresidentfilemanagement.html");


// SideBar.activeCurByPage("non_inhabitant_archivemanagement.html");
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
    RQLBuilder.equal("customerType","9"),
    RQLBuilder.equal("approveStatus","4"),
    RQLBuilder.condition_fc("areaId",'$in',JSON.stringify(loginarea))
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
    ref_display: "unboltNo"
});

var unboltNoFormat = function(){
    return {
        f: function(val){
            console.log(val)
            return unboltHelper.getDisplay(val);
        }
    }
}()

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

// 用气性质helper
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
var gasTypeFormat = function () {
    return {
        f: function (val) {
            return gasTypeHelper.getDisplay(val);
        },
    }
}();



var select_mrdBookAction = function () {
    var xw ;
    var detailedInfoFormat = function () {
        return {
            f: function (val) {
                return '<a id="todetail" data-id="'+val+'" onclick="selectBook($(this))" href="javascript:void(0)">建档</a>';
            }
        }
    }();
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
            // this.initUnitTree();
        },

        initHelper:function(){
            $.map(projectHelper.getData(), function (value, key) {
                $('#find_unboltNo').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload: function () {
            //---------------行定义
            var xwQuery = RQLBuilder.and([
                RQLBuilder.condition_fc("areaId",'$in',JSON.stringify(loginarea)),
                RQLBuilder.equal("customerType","9"),
                RQLBuilder.equal("approveStatus","4")
            ]).rql();
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
                    restbase: 'gascsrunbolt/?query=' + xwQuery,
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
                        // var find_area, find_projectNo, find_projectName, find_linkMan, find_buildUnit, find_projectAddress;
                        var find_unboltNo, find_projectNo;
                        if ($('#find_unboltNo').val()) {
                            find_unboltNo = RQLBuilder.equal("unboltId", $('#find_unboltNo').val());
                        }
                        if ($('#find_projectNo').val()) {
                            find_projectNo = RQLBuilder.equal("projectNo", $('#find_projectNo').val());
                        }
                        var customerType = RQLBuilder.equal("customerType","9");
                        var approveStatus=RQLBuilder.equal("approveStatus","4");
                        var find_area = RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        var filter = RQLBuilder.and([
                            find_unboltNo,find_projectNo,customerType,approveStatus,find_area
                        ]);
                        xw.setRestURL(hzq_rest + "gascsrunbolt")
                        return filter.rql();
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
                console.log(row)
                if(row.isRel == "0"){
                    return '<a href="javascript:;" data-unboltId="'+row.norsdtDetailId+'" data-id="'+row.unboltId+'" class="closePath">关闭</a>';
                }else if(row.isRel == "1"){
                    return '已建档';
                }else if(row.isRel == "2"){
                    return '<a href="javascript:;" data-unboltId="'+row.norsdtDetailId+'"  data-id="'+row.unboltId+'"  class="openPath">打开</a>';
                }

            }
        }
    }();
    xw = XWATable.init({
        divname: "divtable1",
        //----------------table的选项-------
        pageSize: 10,
        // columnPicker: true,
        transition: 'fade',
        checkAllToggle: true,
        //----------------基本restful地址---
        restbase: 'gascsrunboltnorsdtdetail/?query={"unboltId":"'+unboltId+'"}',
        key_column: 'norsdtDetailId',
        coldefs:[
            {
                col:"unboltId",
                friendly:"开栓令编号",
                format:unboltNoFormat,
                index:1
            },
            {
                col:"gasTypeId",
                friendly:"用气类型",
                format:gasTypeFormat,
                index:2
            },
            {
                col:"capacity",
                friendly:"额定流量",
                // format:operatorFormat,
                index:3
            },
            {
                col:"mtrCount",
                friendly:"数量",
                index:4
            },
            {
                col:"norsdtDetailId",
                friendly:"创建档案",
                format:selectBookFormat,
                index:5
            }

        ]
    })

}




$(document).on("click",".closePath",function(){
    var unboltIds=$(this).attr("data-id");
    var id=$(this).attr("data-unboltId");
    var that = $(this)
    bootbox.confirm({
        buttons: {
            confirm: {
                label: '确认',
                className: 'blue'
            },
            cancel: {
                label: '取消',
                className: 'btn-default'
            }
        },
        message: "<br><center><h4>确定关闭该非居民建档途径吗？</h4></center><br>",
        callback:function(result){
           if(!result){
               return ;
           }else{
               var result = Restful.updateNQ(hzq_rest +"gascsrunboltnorsdtdetail/"+id,JSON.stringify({"isRel":"2"}))
               console.log(result)
               if(result){
                   bootbox.alert("<center><h4>关闭成功。</h4></center>")
                   selectBook(that)
               }
           }

        }
    })
})

$(document).on("click",".openPath",function(){
    var unboltIds=$(this).attr("data-id");
    var id=$(this).attr("data-unboltId");
    var that = $(this)
    console.log(unboltIds)
    bootbox.confirm({
        buttons: {
            confirm: {
                label: '确认',
                className: 'blue'
            },
            cancel: {
                label: '取消',
                className: 'btn-default'
            }
        },
        message: "<br><center><h4>确定打开该非居民建档途径吗？</h4></center><br>",
        callback:function(result){
            if(!result){
                return ;
            }else{
                var result = Restful.updateNQ(hzq_rest +"gascsrunboltnorsdtdetail/"+id,JSON.stringify({"isRel":"0"}))
                console.log(result)
                if(result){
                    bootbox.alert("<center><h4>打开成功。</h4></center>")
                    selectBook(that)
                }
            }

        }
    })
})
