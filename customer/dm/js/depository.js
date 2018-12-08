var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId=JSON.parse(localStorage.getItem("user_info")).userId;
var station_id=JSON.parse(localStorage.getItem("user_info")).station_id;
var areas = new Array();
areas.push(area_id)


//查询areaId下级areaId
$.ajax({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    type: 'get',
    async: false,
    url: hzq_rest + "gasbizarea?query={\"parentAreaId\":\"" + area_id + "\"}",
    success: function (data) {
        for (var i = 0; i < data.length; i++) {
            areas.push(data[i].areaId);
        }
    }
});
var AreaHelper1 = RefHelper.create({
    ref_url: 'gasbizarea?query={"areaId":{"$in":' + JSON.stringify(areas) + '}}',
    ref_col: "areaId",
    ref_display: "areaName",
    "sort":"posCode"
});
$.each(AreaHelper1.getRawData(), function (index, row) {
    $('#find_unit').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
});
var parentHelper = RefHelper.create({
    ref_url:"gasmtrdepository",
    ref_col:"depositoryId",
    ref_display:"depositoryName"
});
var unitidHelper = RefHelper.create({
    ref_url:"gassysunit",
    ref_col:"unitId",
    ref_display:"unitName"
});
var DepositoryAction = function () {
    var unitHelper = RefHelper.create({
        ref_url:"gassysunit",
        ref_col:"unitId",
        ref_display:"unitName"
    });
    // 供气区域helper
    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var parentHelper = RefHelper.create({
        ref_url:"gasmtrdepository",
        ref_col:"depositoryId",
        ref_display:"depositoryName"
    });

    var unitFormat = function () {
        return {
            f : function (val) {
                return unitHelper.getDisplay(val);
            }
        }
    }();
    var AreaFormat = function () {
        return {
            f : function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var parentFormat = function () {
        return {
            f : function (val) {
                if(val == 0){
                    return "";
                }
                return parentHelper.getDisplay(val);
            }
        }
    }();

    return {

        init : function () {
            this.initHelper();
            this.reload();
        },

        initHelper : function () {
            // $.map(unitHelper.getData(), function (value, key) {
            //     $('#find_unit').append('<option value="' + key + '">' + value + '</option>');
            // });

        },

        reload:function () {
            $('#divtable').html('');

            this.xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrdepository',
                    key_column:'depositoryId',
                    coldefs:[
                        {
                            col:"depositoryId",
                            friendly:"仓库id",
                            nonedit:"nosend",
                            sorting:true,
                            unique:"true",
                            hidden:"true",
                            index:1
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            sorting:true,
                            format:AreaFormat,
                            inputsource: "select",
                            ref_url:  'gasbizarea/?query={"areaId":'+area_id+'}',
                            ref_name: "areaName",
                            ref_value: "areaId",
                            validate:"required",
                            index:2
                        },
                        {
                            col:"depositoryName",
                            friendly:"仓库名称",
                            validate:"required",
                            sorting:true,
                            index:3
                        },
                        {
                            col:"depositoryCode",
                            friendly:"仓库代码",
                            sorting:true,
                            validate:"required",
                            index:4
                        },
                        {
                            col:"unitId",
                            friendly:"所属单位",
                            sorting:true,
                            format:unitFormat,
                            inputsource: "select",
                            ref_url:  "gassysunit",
                            ref_name: "unitName",
                            ref_value: "unitId",
                            validate:"required",
                            index:5
                        },
                        {
                            col:"posCode",
                            friendly:"位置码",
                            validate:"required",
                            sorting:true,
                            index:6
                        },

                        {
                            col:"funcLevel",
                            friendly:"仓库级别",
                            format:GasModCtm.funcLevelFormat,
                            inputsource: "custom",
                            inputbuilder: "funcLevel",
                            validate:"required",
                            sorting:true,
                            index:7
                        },
                        {
                            col:"parentId",
                            friendly:"上级仓库",
                            inputsource: "select",
                            format:parentFormat,
                            ref_url:  "gasmtrdepository",
                            ref_name: "depositoryName",
                            ref_value: "depositoryId",
                            validate:"required",
                            sorting:true,
                            index:8
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function
                        var find_area,find_depositoryName ;
                        if($('#find_unit').val()){
                            find_area = RQLBuilder.equal("areaId",$('#find_unit').val());
                        }
                        if($('#find_depositoryName').val()){
                            find_depositoryName = RQLBuilder.like("depositoryName",$('#find_depositoryName').val());
                        }

                        var filter = RQLBuilder.and([
                            find_area,find_depositoryName
                        ]);
                        return filter.rql();
                    },//--findFilter

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },

                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },

                    onDeleted: function(ret,jsondata){
                    }
                }
            )
        }
    }
}();

$("#minus_button").on("click",function(){
    operatorFunction()
})

function operatorFunction() {
    var diag = bootbox.dialog({
        className:"minus-adds",
        message:
        '<form id="breakupform" class="form-group">' +
            '<table class="watable table table-spriped table-hover table-bordered table-condensed">' +
                '<thead>' +
                    '<th></th>'+
                    '<th>供气区域</th>'+
                    '<th>仓库名称</th>'+
                    '<th>仓库代码</th>'+
                    '<th>所属单位</th>'+
                    '<th>位置码</th>'+
                    '<th>仓库级别</th>'+
                    '<th>上级仓库</th>'+
                '</thead>'+
                '<tbody id="breakuptable">'+
                    '<tr>'+
                        '<td></td>'+
                        '<td>' +
                            '<select name="areaIds" class="form-control input-middle select2me" data-placeholder="供气区域...">' +
                            '<option value="">请选择</option>' +
                            '</select>' +
                        '</td>' +
                        '<td><input name="depositoryName" type="text" class="form-control" placeholder="仓库名称"></td>' +
                        '<td><input name="depositoryCode" type="text" class="form-control" placeholder="仓库代码"></td>' +
                        '<td>' +
                            '<select name="unitId" class="form-control input-middle select2me" placeholder="所属单位...">' +
                            '<option value="">请选择</option>' +
                            '</select>' +
                        '</td>' +
                        '<td><input name="posCode" type="text" class="form-control" placeholder="位置码"></td>' +
                        '<td>' +
                            '<select name="funcLevel" class="form-control input-middle select2me" data-placeholder="仓库级别...">' +
                            '<option value="">请选择</option>' +
                            '<option value="1">一级库</option>' +
                            '<option value="2">二级库</option>' +
                            '</select>' +
                        '</td>' +
                        '<td>' +
                            '<select name="parentId" class="form-control input-middle select2me" data-placeholder="上级仓库...">' +
                            '<option value="">请选择</option>' +
                            '</select>' +
                        '</td>' +
                    '</tr>' +
                '</tbody>' +
                '<tfoot>' +
                    '<tr>'+
                        '<td colspan="8"><img onclick="addDepo()" id="add_btn" class="img-responsive center-block" src="assets/global/img/add.png" style="width: 32px;height: 32px"></td>'+
                    '</tr>' +
                '</tfoot>' +
        '</table>' +
        '</form>',
        title:"仓库拆分",
        buttons:{
            success:{
                label:"保存",
                className:"btn btn-primary save_minus",
                callback:function () {
                    $(".save_minus").addClass("disabled");
                    var submitdep=[];
                    var statusjy = false;
                    if($('#breakuptable tr').length <2){
                        bootbox.alert("<center><h4>最少拆分为两个表库。</h4></center>",function(){
                            $(".save_minus").removeClass("disabled");
                        })
                        return false;
                    }


                    $('#breakuptable tr').each(function(ind,item){
                        var tdArr = $(this).children();
                        if(tdArr.eq(1).find("select").val() && tdArr.eq(2).find("input").val() && tdArr.eq(3).find("input").val()
                            && tdArr.eq(4).find("select").val() &&tdArr.eq(5).find("input").val() && tdArr.eq(6).find("select").val()
                            && tdArr.eq(7).find("select").val()
                            ){
                            submitdep.push({
                                "areaId":tdArr.eq(1).find("select").val(),
                                "depositoryName":tdArr.eq(2).find("input").val(),
                                "depositoryCode":tdArr.eq(3).find("input").val(),
                                "unitId":tdArr.eq(4).find("select").val(),
                                "posCode":tdArr.eq(5).find("input").val(),
                                "funcLevel":tdArr.eq(6).find("select").val(),
                                "parentId":tdArr.eq(7).find("select").val()
                            })
                            statusjy = false;
                        }else{
                            statusjy = true;
                            return false;
                        }
                    })
                    if(statusjy){
                        bootbox.alert("<center><h4>输入项不能为空。</h4><center>",function(){
                            $(".save_minus").removeClass("disabled");
                        })
                        return false;
                    }
                    console.log(submitdep)
                    var submitJson = {"sets":[
                        // {"txid":"1","body":meterId,"path":"/gasmtrmeter/","method":"put"},
                        {"txid":"1","body":submitdep,"path":"/gasmtrdepository/","method":"POST"},
                        // {"txid":"3","body":shuju,"path":"/gasmtrdepositorychange/","method":"POST"},
                    ]};
                
                    $.ajax({
                        type: 'POST',
                        url:  "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        isMask: true,
                        data: JSON.stringify(submitJson),
                        success: function(data) {
                            console.log(data)
                            var retFlag = true;
                            for(var i=0;i<data.results.length;i++){
                                if(!data.results[i].result.success){
                                    retFlag=false;
                                    break;
                                }
                            }
                            if(retFlag){
                                bootbox.alert("拆分成功",function(){
                                    $(".save_ssss").removeClass("disabled")
                                    DepositoryAction.reload();
                                })
                                
                            }else{
                                bootbox.alert("<center><h4>拆分失败</h4></center>",function(){
                                    $(".save_ssss").removeClass("disabled")
                                });
                                
                            }
                        },
                        error: function(err) {
                            bootbox.alert("<center><h4>拆分失败</h4></center>",function(){
                                $(".save_ssss").removeClass("disabled")
                            });
                            if( err.status==406){
                                //need to login
                                if(window.location.pathname.indexOf('/login.html')<0)
                                {
                                    window.location.replace("/login.html?redirect="+window.location.pathname);
                                }
                            }
                        }
                    });

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

    GasModSys.areaList({
        "areaId":area_id,
        "cb":function(data){
            console.log(data)
            $.each(data,function(key,val){
                $('select[name="areaIds"]').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
            })
        }
    });
    // location.reload();//页面刷新查看效果

    $.map(unitidHelper.getData(), function (value, key) {
        $('select[name="unitId"]').append('<option value="' + key + '">' + value + '</option>');
    });
    $.map(parentHelper.getData(), function (value, key) {
        $('select[name="parentId"]').append('<option value="' + key + '">' + value + '</option>');
    });

};





$(document).on("click",".remove_line",function(){
    
    $(this).parent().parent().remove();
})
var i=0;
function addDepo() {
    
    i=i+1;
    console.log(i)
    $('#breakuptable').append('' +
        '<tr>' +
            '<td><i class="remove_event glyphicon glyphicon-minus remove_line"></i></td>' +
            '<td>' +
                '<select name="areaId'+i+'" class="form-control input-middle select2me" data-placeholder="供气区域...">' +
                '<option value="">请选择</option>' +
                '</select>' +
            '</td>' +
            '<td><input name="depositoryName" type="text" class="form-control" placeholder="仓库名称"></td>' +
            '<td><input name="depositoryCode" type="text" class="form-control" placeholder="仓库代码"></td>' +
            '<td>' +
                '<select name="unitId'+i+'" class="form-control input-middle select2me" placeholder="所属单位...">' +
                '<option value="">请选择</option>' +
                '</select>' +
            '</td>' +
            '<td><input name="posCode" type="text" class="form-control" placeholder="位置码"></td>' +
            '<td>' +
                '<select name="funcLevel" class="form-control input-middle select2me" data-placeholder="仓库级别...">' +
                '<option value="">请选择</option>' +
                '<option value="1">一级库</option>' +
                '<option value="2">二级库</option>' +
                '</select>' +
            '</td>' +
            '<td>' +
                '<select name="parentId'+i+'" class="form-control input-middle select2me" data-placeholder="上级仓库...">' +
                '<option value="">请选择</option>' +
                '</select>' +
            '</td>' +
        '</tr>'
    );

    $('select[name="areaId'+i+'"]').html('<option value="">请选择</option>')
    $('select[name="unitId'+i+'"]').html('<option value="">请选择</option>')
    $('select[name="parentId'+i+'"]').html('<option value="">请选择</option>')
    GasModSys.areaList({
        "areaId":area_id,
        "cb":function(data){
            console.log(data)
            $.each(data,function(key,val){
                $('select[name="areaId'+i+'"]').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
            })
        }
    });
    // location.reload();//页面刷新查看效果

    $.map(unitidHelper.getData(), function (value, key) {
        $('select[name="unitId'+i+'"]').append('<option value="' + key + '">' + value + '</option>');
    });
    $.map(parentHelper.getData(), function (value, key) {
        $('select[name="parentId'+i+'"]').append('<option value="' + key + '">' + value + '</option>');
    });
};





$('#merge_button').click(function () {
    var selrows = DepositoryAction.xw.getTable().getData(true);
    console.log('the selected line\'s length is :' + selrows.rows.length);

    if(selrows.rows.length<1){
        bootbox.alert("<center><h4>请选择至少两行。</h4></center>")
        return false;
    }

    var depoIds = new Array();
    var depoIds1 = new Array();
    for(var i = 0; i < selrows.rows.length; i++){
        depoIds[i] = selrows.rows[i].depositoryId;
        depoIds1.push('"'+selrows.rows[i].depositoryId+'"');
    }

    var diag = bootbox.dialog({
        className: "merge-add",
        message:
        '<form id="mergeform" class="form-group">' +
            '<table class="watable table table-spriped table-hover table-bordered table-condensed">' +
            '<thead>' +
                '<th>供气区域</th>'+
                '<th>仓库名称</th>'+
                '<th>仓库代码</th>'+
                '<th>所属单位</th>'+
                '<th>位置码</th>'+
                '<th>仓库级别</th>'+
                '<th>上级仓库</th>'+
            '</thead>'+
            '<tbody id="mergetable">'+
                '<tr><input class="hidden" name="depositoryIds[]" value="'+depoIds+'">' +
                    '<td>' +
                        '<select id="areaids" name="areaId" class="form-control input-middle select2me" data-placeholder="供气区域...">' +
                        '<option value="">请选择</option>' +
                        '</select>' +
                    '</td>' +
                    '<td><input name="depositoryName" type="text" class="form-control" placeholder="仓库名称"></td>' +
                    '<td><input name="depositoryCode" type="text" class="form-control" placeholder="仓库代码"></td>' +
                    '<td>' +
                        '<select name="unitId" class="form-control input-middle select2me" placeholder="所属单位...">' +
                        '<option value="">请选择</option>' +
                        '</select>' +
                    '</td>' +
                    '<td><input name="posCode" type="text" class="form-control" placeholder="位置码"></td>' +
                    '<td>' +
                        '<select name="funcLevel" class="form-control input-middle select2me" data-placeholder="仓库级别...">' +
                        '<option value="">请选择</option>' +
                        '<option value="1">一级库</option>' +
                        '<option value="2">二级库</option>' +
                        '</select>' +
                    '</td>' +
                    '<td>' +
                        '<select name="parentId" class="form-control input-middle select2me" data-placeholder="上级仓库...">' +
                        '<option value="">请选择</option>' +
                        '</select>' +
                    '</td>' +
                '</tr>' +
            '</tbody>' +
            '<tfoot>' +
            '</tfoot>' +
            '</table>' +
        '</form>',
        title:"仓库合并",
        buttons:{
            success:{
                label:"保存",
                // dataLoadingText="<i class='fa fa-circle-o-notch fa-spin'></i> 正在提交",
                className:"btn btn-primary save_ssss",
                callback:function () {
                    $(".save_ssss").addClass("disabled")
                    $(".save_ssss").attr("disabled","disabled");
                    console.log("保存",selrows.rows);
                    console.log($('#mergeform').serializeObject());
                    var depositoryId_new=$.md5(JSON.stringify(jsonsubmit)+new Date().getTime()+Math.random());
                    var jsonsubmit = $('#mergeform').serializeObject()
                        jsonsubmit["createdTime"]=new Date(new Date()+"-00:00");
                        jsonsubmit["createdBy"]=userId;
                        jsonsubmit["modifiedTime"]=new Date(new Date()+"-00:00");
                        jsonsubmit["modifiedBy"]=userId;
                        jsonsubmit["depositoryId"] = depositoryId_new;

                    var pankong= false;
                    $.each(jsonsubmit,function(key,val){

                        if(!jsonsubmit[key]){
                            pankong = true;
                            return false;
                        }else{
                            pankong=false;
                        }
                    })
                    if(pankong){
                        bootbox.alert("输入项不能为空。",function(){
                            $(".save_ssss").removeClass("disabled")
                            $(".save_ssss").attr("disabled",false);
                            
                        })
                        return false;
                    }
                    console.log(depoIds1.join());
                    
                    var queryCondion= RQLBuilder.and([
                        RQLBuilder.condition_fc("depositoryId","$in",JSON.stringify(depoIds)),
                        RQLBuilder.equal("stockState","1")
                    ]).rql()
                    var result = Restful.findNQ(hzq_rest+"gasmtrmeter/?query="+queryCondion)
                    // console.log(result)

                    var shuju = [];
                    var meterId = [];
                    if(result.length){
                        $.each(result,function(ind,item){
                            meterId.push({
                                "meterId":item.meterId,
                                "depositoryId":depositoryId_new,
                                "modifiedTime":new Date(new Date()+"-00:00"),
                                "modifiedBy":userId
                            })
                            shuju.push({
                                "meterId":item.meterId,
                                "newDepositoryId":depositoryId_new,
                                "oldDepositoryId":item.depositoryId,
                                "createdTime":new Date(new Date()+"-00:00"),
                                "createdBy":userId,
                                "modifiedTime":new Date(new Date()+"-00:00"),
                                "modifiedBy":userId,
                                "status":"0",
                                "changeType":"1"
                            })
                        })
                    }
                
                    var submitJson = {"sets":[
                        {"txid":"1","body":meterId,"path":"/gasmtrmeter/","method":"put"},
                        {"txid":"2","body":jsonsubmit,"path":"/gasmtrdepository/","method":"POST"},
                        {"txid":"3","body":shuju,"path":"/gasmtrdepositorychange/","method":"POST"},
                    ]};
                
                    $.ajax({
                        type: 'POST',
                        url:  "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        isMask: true,
                        data: JSON.stringify(submitJson),
                        success: function(data) {
                            console.log(data)
                            var retFlag = true;
                            for(var i=0;i<data.results.length;i++){
                                if(!data.results[i].result.success){
                                    retFlag=false;
                                    break;
                                }
                            }
                            if(retFlag){
                                bootbox.alert("合并成功",function(){
                                    $(".save_ssss").removeClass("disabled")
                                    DepositoryAction.reload();
                                })
                                
                            }else{
                                bootbox.alert("<center><h4>合并失败</h4></center>",function(){
                                    $(".save_ssss").removeClass("disabled")
                                });
                                
                            }
                        },
                        error: function(err) {
                            bootbox.alert("<center><h4>合并失败</h4></center>",function(){
                                $(".save_ssss").removeClass("disabled")
                            });
                            if( err.status==406){
                                //need to login
                                if(window.location.pathname.indexOf('/login.html')<0)
                                {
                                    window.location.replace("/login.html?redirect="+window.location.pathname);
                                }
                            }
                        }
                    });
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

    GasModSys.areaList({
        "areaId":area_id,
        "cb":function(data){
            console.log(data)
            $.each(data,function(key,val){
                $("#areaids").append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
            })
        }
    });
    // location.reload();//页面刷新查看效果

    $.map(unitidHelper.getData(), function (value, key) {
        $('select[name="unitId"]').append('<option value="' + key + '">' + value + '</option>');
    });
    $.map(parentHelper.getData(), function (value, key) {
        $('select[name="parentId"]').append('<option value="' + key + '">' + value + '</option>');
    });
});

