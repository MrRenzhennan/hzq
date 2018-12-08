/**
 * Created by alex on 2017/5/14.
 */
//联动！！

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;

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
var xw;
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
            var operaFormat = function(){
                return{
                    f:function(val,row){
                        return "<a data-id='"+row.bookId+"' class='adddevice' >关联调压设备</a>"
                    }
                }
            }()
            var wheress = "";
            if(areaId == "1"){
                wheress += ""
            }else{
                wheress +="a.area_id='"+areaId+"' and "
            }
            var bd ={
                "cols":"*",
                "froms":"gas_mrd_book a left join gas_mrd_book_press b on b.ref_book_id=a.book_id left join gas_biz_shit_press c on c.press_id=b.ref_press_id",
                "wheres":wheress + "1=1",
                "page":true,
                "limit":50
            }
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
                    // restbase: 'gasmrdbook/?query='+queryCondion,
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
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
                        {
                            col: "pressName",
                            friendly: "设备名称",
                            index: 10
                        },
                        {
                            col: "pressCode",
                            friendly: "设备编号",
                            index: 10
                        },
                        {
                            col: "operate",
                            friendly: "操作",
                            format:operaFormat,
                            index: 11
                        },
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
                        var where = "";
                        

                        var find_area , find_countper,find_server,find_bookType,find_bookCode;

                        if($('#find_unit').val())
                        {
                            // find_area=RQLBuilder.equal("areaId",$('#find_unit').val());
                            where += "a.area_id = '"+$('#find_unit').val()+"' and " 
                        }else{
                            // find_area =RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                            where += wheress
                        }

                        if($('#find_countPer').val())
                        {
                            // find_countper=RQLBuilder.equal("countperId",$('#find_countPer').val());
                            where += "a.countper_id = '"+$('#find_countPer').val()+"' and " 
                        }

                        if($('#find_servicePer').val())
                        {
                            // find_server=RQLBuilder.equal("serviceperId",$('#find_servicePer').val());
                            where += "a.serviceper_id = '"+$('#find_servicePer').val()+"'and " 
                        }

                        //console.log($("#find_bookType option:selected").val());
                        if($("#find_bookType option:selected").val()){
                            // find_bookType = RQLBuilder.equal("bookType" , $("#find_bookType option:selected").val());
                            where += "a.book_type = '"+$('#find_bookType').val()+"' and " 
                        }
                        if($("#find_bookCode").val()){
                            // find_bookCode = RQLBuilder.equal("bookCode", $("#find_bookCode").val())
                            where += "a.book_code = '"+$('#find_bookCode').val()+"' and " 
                        }
                        // console.log("=="+find_area+"222"+find_countper + "-----0"+find_server)

                        // var filter=RQLBuilder.and([
                        //     find_area , find_countper ,find_server , find_bookType,find_bookCode
                        // ]);
                        // xw.setRestURL(hzq_rest + 'gasmrdbook');
                        // return filter.rql();
                        var bd ={
                            "cols":"*",
                            "froms":"gas_mrd_book a left join gas_mrd_book_press b on b.ref_book_id=a.book_id left join gas_biz_shit_press c on c.press_id=b.ref_press_id",
                            "wheres":where + "1=1",
                            "page":true,
                            "limit":50
                        }
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
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
var query ="";
if(areaId == "1"){
    query=""
}else{
    query='?query={"reservedField1":"'+areaId+'"}'
}

var pressHelper = RefHelper.create({
    ref_url:'gasbizshitpress/'+query,
    ref_col:"pressId",
    ref_display:"pressName",
});


$(document).on("click",".adddevice",function(){

    // var row = JSON.parse($(this).attr("data-rows"));
    var bookId = $(this).attr("data-id");
    var results_book = Restful.findNQ(hzq_rest+'gasmrdbookpress/?query={"refBookId":"'+bookId+'"}');
    console.log(results_book)
    if(results_book.length > 0){
        bootbox.alert("<center><h4>该抄表本已有调压设备。</h4></center>");
        return false;
    }
    var diag = bootbox.dialog({
        className: "merge-add",
        message:
        '<div class="col-md-6">'
            +'<label class="control-label col-md-4">调压设备:</label>'
            +'<div class="col-md-8">'
                +'<select id="moneytype1"'
                        +'class="form-control input-middle select2me" data-placeholder="">'
                    +'<option value="">请选择</option>'
            +'</select>'
            +'</div>'
        +'</div>'
        +'<div class="col-md-6">'
            +'<label class="control-label col-md-4">设备编号:</label>'
            +'<div class="col-md-8">'
                +'<input id="mgrcheckname"'
                        +'class="form-control input-middle select2me" data-placeholder="" disabled />'
            +'</div>'
        +'</div>',
        title:"登记",
        buttons:{
            success:{
                label:"保存",
                // dataLoadingText="<i class='fa fa-circle-o-notch fa-spin'></i> 正在提交",
                className:"btn btn-primary save_ssss",
                callback:function () {
                    if(!$("#moneytype1").val()){
                        bootbox.alert("<center><h4>请选择调压设备。</h4></center>")
                        return false;
                    }
                    
                    var json={
                        "refBookId":bookId,
                        "refPressId":$("#moneytype1").val(),
                        "createdTime":new Date(new Date()+"-00:00"),
                        "modifiedTime":new Date(new Date()+"-00:00"),
                        "createdBy":userId,
                        "modifiedBy":userId
                    }
                    var results_book = Restful.insert(hzq_rest+'gasmrdbookpress',json);
                    console.log(results_book)
                    if(results_book.success){
                        bootbox.alert("<center><h4>登记成功。</h4></center>",function(){
                            xw.update();
                        })


                    }else{
                        bootbox.alert("<center><h4>登记失败。</h4></center>")
                        return false;
                    }


                }

            },
            danger:{
                label:"取消",
                className:"btn btn-default",
                callback:function () {}
            }
        }
    },{show:false});
    diag.show();
    
    $.map(pressHelper.getData(),function(val,ind){
        $("#moneytype1").append("<option value='"+ind+"'>"+val+"</option>")
    })

    $("#moneytype1").select2();
    // $("#mgrcheckname").select2();
    // $("#moneytype1").val(row.amountType).trigger("change");
    // $("#mgrcheckname").val(row.bankCheckMgrId).trigger("change");

    $("#moneytype1").on("change",function(){
        console.log($(this).val())
        var Results = Restful.findNQ(hzq_rest+"gasbizshitpress/"+$(this).val());
        console.log(Results)
        $("#mgrcheckname").val(Results.pressCode);
    })

})