/**
 * Created by alex on 2017/5/14.
 */
//联动！！

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $('#find_unit').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});
var queryCondion = RQLBuilder.and([
    RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea)),
    // RQLBuilder.equal("status","1"),
]).rql()
/*
$.each(GasModSys.areaHelper.getRawData(), function (idx, row) {

    $('#find_unit').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');

});*/
$('#find_unit').on('change', function (e) {
    console.log("change area:" + e + "." + $('#find_unit').val());
    // if (!$('#find_unit').val()) {
    $("#find_countPer").html("<option value=''>全部</option>").trigger("change");
    // return false;
    // }
    GasModSys.counterUsersInArea({
        "areaId": $('#find_unit').val(),
        "cb": function (data) {
            if (data.length) {
                var inhtml = "<option value=''>全部</option>";
                $.each(data, function (idx, row) {
                    console.log(data)
                    inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                })
                $("#find_countPer").html(inhtml);
                $("#find_countPer").val("").change();
            };

        }
    })
});

$('#find_countPer').on('change', function (e) {
    console.log("change counter:" + e + "." + $('#find_countPer').val());
    $("#find_servicePer").html("");
    $("#find_servicePer").html("<option value=''>全部</option>").trigger("change");
    GasModSys.copyUsersInArea({
        "areaId": $('#find_unit').val(),
        "countperId": $('#find_countPer').val(),
        "cb": function (data) {
            if (data) {
                var inhtml = "<option value=''>全部</option>";
                $.each(data, function (idx, row) {
                    inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                })
                $("#find_servicePer").html(inhtml);
                $("#find_servicePer").val("").change();
            }


        }
    })
})

var booktype=function(){
    return{
        f:function(val){
            if(val=="1"){
                return "居民"
            }else if(val=="9"){
                return "非居民"
            }
        }
    }
}()
var copyCycl = { 9:"日抄",8:"周抄", 7:"月抄",4:"季抄",3:"四月抄",2:"半年抄",1: "年抄"}
var copyCycleFormat = function(){
        return{
            f:function(val){
                return copyCycl[val];
            }
        }
}()
var queryMrdAction = function () {
    //         供气区域helper
    var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });
    var areaFormat=function(){
        return {
            f: function(val){
                return areaHelper.getDisplay(val);
            },
        }
    }();
    //核算员
    var userHelper=RefHelper.create({
        ref_url:'gassysuser/?query={"stationId":"1"}',
        ref_col:"userId",
        ref_display:"employeeName",
    });
    var userFormat=function(){
        return {
            f: function(val){
                return userHelper.getDisplay(val);
            },
        }
    }();
    //抄表员
    var serverHelper=RefHelper.create({
        ref_url:'gassysuser/?query={"stationId":"2"}',
        ref_col:"userId",
        ref_display:"employeeName",
    });
    var serverFormat=function(){
        return {
            f: function(val){
                return serverHelper.getDisplay(val);
            },
        }
    }();
    /*$.map(areaHelper.getData(), function(value, key) {
        $('#find_unit').append('<option value="'+key+'">'+value+'</option>');
    });*/
    return {
        init: function () {
            this.reload();
        },
        reload:function(){
            $('#divtable').html('');

            xw=XWATable.init(
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
                    restbase: 'gasmrdbook/?query='+queryCondion,
                    key_column:'bookId',
                    //---------------行定义
                    coldefs: [
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format:areaFormat,
                            index: 1
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format:userFormat,
                            index: 2
                        },
                        {
                            col: "serviceperId",
                            friendly: "客户服务员",
                            format:serverFormat,
                            index: 3
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本编号",
                            index: 4
                        },
                        {
                            col: "bookType",
                            friendly: "本类型",
                            format:booktype,
                            index: 5
                        },
                        {
                            col: "address",
                            friendly: "本地址",
                            index: 6
                        },
                        {
                            col: "doorCount",
                            friendly: "户数",
                            index: 7
                        },
                        /* {
                         col: "normal_house_count",
                         friendly: "正常用气户数",
                         index: 8
                         },*/
                        {
                            col:"copyCycle",
                            friendly:"抄表周期",
                            format:copyCycleFormat,
                            index:8
                        },
                        {
                            col: "copyMonth",
                            friendly: "抄表月份",
                            index: 9
                        },
                        {
                            col: "copyRuleday",
                            friendly: "抄表例日",
                            index: 10
                        },
                        /*{
                            col: "dailyMeasure",
                            friendly: "户日均用气量",
                            index: 11
                        },*/
                        {
                            col: "remark",
                            friendly: "备注",
                            hidden:true,
                            index: 12
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function
                        /*var filter = "keyy=" + $('#find_key').val();
                         return filter;*/
                        var find_area , find_countper,find_server,find_bookType,find_bookCode;

                        if($('#find_unit').val())
                        {
                            find_area=RQLBuilder.equal("areaId",$('#find_unit').val());
                        }else{
                            find_area =RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        }

                        if($('#find_countPer').val())
                        {
                            find_countper=RQLBuilder.equal("countperId",$('#find_countPer').val());
                        }

                        if($('#find_servicePer').val())
                        {
                            find_server=RQLBuilder.equal("serviceperId",$('#find_servicePer').val());
                        }

//                                console.log($("#find_bookType option:selected").val());
                        if($("#find_bookType option:selected").val()){
                            find_bookType = RQLBuilder.equal("bookType" , $("#find_bookType option:selected").val());
                        }
                        if($("#find_bookCode").val()){
                            find_bookCode = RQLBuilder.equal("bookCode", $("#find_bookCode").val())
                        }
                        console.log("=="+find_area+"222"+find_countper + "-----0"+find_server)

                        var filter=RQLBuilder.and([
                            find_area , find_countper ,find_server , find_bookType,find_bookCode
                        ]);
                        xw.setRestURL(hzq_rest + 'gasmrdbook');
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
                })
        }

    }
}();