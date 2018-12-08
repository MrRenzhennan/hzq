// 供气区域helper

var areaHelper=RefHelper.create({
    ref_url:"gasbizarea",
    ref_col:"areaId",
    ref_display:"areaName"
});
var areaFormat=function(){
    return {
        f: function(val){
            return areaHelper.getDisplay(val);
        }
    }
}();
var lowerProtectionFormat = function(){
    return{
        f:function(val){
            if(val == 0){
                return "正常"
            }else if(val == 1){
                return "低保"
            }else if(val == 2){
                return "低收入"
            }else if(val == 3){
                return "低困（困难家庭）"
            }
        }
    }
}();

var ctmSpecialAction = function () {


    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper:function(){
            // 供气区域 select init
            $.map(areaHelper.getData(), function(value, key) {
                $('#find_areaId').append('<option value="'+key+'">'+value+'</option>');
            });

        },

        reload:function(){

            $('#divtable').html('');

            $("#muban").on('click',function(){
                var queryid='{"name":{"$in":[""]}}';
                var dbcol="name,socialAccount,bankAccount,identity,population,lowerProtection";
                var ncol="姓名,保障号,银行账号,身份证号,人口数,特殊用户类型";
                var q = 'page=true&et=特殊用户&ncol='+ncol.uricode()+'&dbcol='+dbcol.uricode()+'&exp=excel&';
                $(this).find("a").attr('href',hzq_rest+'gascsrlowincome/?query='+queryid.uricode()+'&'+q);
                $(this).find("a").attr("target","_blank");
            })
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gascsrlowincome/?query={"status":"1"}',
                    key_column: "lowincomeId",
                    //---------------行定义
                    coldefs:[

                        {
                            col:"name",
                            friendly:"姓名",
                            // hidden:true,
                            unique:"true",
                            index:1
                        },
                        {
                            col:"socialAccount",
                            friendly:"保障号",
                            // inputSource:"select",
                            // format:SpecificTypeFormat,
                            index:2
                        },
                        {
                            col:"population",
                            friendly:"人口数",
                            index:3
                        },
                        {
                            col:"bankAccount",
                            friendly:"银行账号",
                            index:4
                        },

                        {
                            col:"identity",
                            friendly:"身份证号",
                            index:5
                        },
                        {
                            col:"lowerProtection",
                            format:lowerProtectionFormat,
                            friendly:"类型",
                            index:6
                        }

                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_areaId,find_idcardno,find_idcard;

                        if($('#find_user').val())
                        {
                            find_areaId=RQLBuilder.like("name",$('#find_user').val());
                        }
                        console.log($('#find_idcardno').val())
                        if($('#find_idcardno').val())
                        {
                            find_idcardno=RQLBuilder.like("socialAccount",$('#find_idcardno').val());
                        }

                         if($('#find_idcard').val())
                        {
                            find_idcard=RQLBuilder.like("identity",$('#find_idcard').val());
                        }

                        var status = RQLBuilder.equal("status","1");
                        var filter=RQLBuilder.and([
                            find_areaId ,find_idcardno,find_idcard,status
                        ]);
                        xw.setRestURL(hzq_rest + "gascsrlowincome")
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){

                    }

                })
        }


    }

}();




var status = false;
var puloadId;

$('#input_many_modal').on('hide.bs.modal', function() {
    status = false;
    console.log(status+"###################")
    console.log("hide diag")
    setTimeout(function(){$('#confirm').hide();
        $('#divtabledata_prev').html("");
        $('#startupload').show();
        $('#clear').show();
        $('#addbtn').show();
        $('#divtabledata_prev').html("");
    },1000)
    // $("#uploadbtn").css({display:"show"})

});
$('#fileId').on("change",function(){
    console.log("select file:"+$('#fileId').val())
    $('#fileupload').find(".preview").html(""+$('#fileId').val());
});
$('#input_many_modal').on('shown.bs.modal', function() {
    console.log("show diag")
    // $("#uploadbtn").css({display:"show"})
    $('#confirm').hide();
    $('#divtabledata_prev').html("");
    $('#startupload').show();
    $('#clear').show();
    $('#addbtn').show();
    $('#fileupload').on("submit",function(){
        console.log("submit!!")
    })
})

$('#fileId').on("change",function(){
    console.log("select file:"+$('#fileId').val())
    $('#fileupload').find(".preview").html(""+$('#fileId').val());
});

//        select_mrdBookAction.init();
var uplaod_ret ;
var booktable = null;

var dbcol="uuid@lowincomeId,name,socialAccount,bankAccount,identity,population,lowerProtection";
var ncol="uuid,姓名,保障号,银行账号,身份证号,人口数,特殊用户类型";

var ncol_array=ncol.split(",");
var sortHeader;
var colFormat = function () {
    return {
        f: function (val,row,cell,key) {
//                console.log("key==:"+key+",row="+JSON.stringify(row))
//                console.log(JSON.parse(row.jsDatas1)[sortHeader.indexOf(key)])
            return JSON.parse(row.jsDatas1)[sortHeader.indexOf(key)];//.JS_DATAS1[ncol_array.indexOf(key)];
        }
    }
}();

var selectfile= function(){
    var f = $('#fileId').trigger("click")
    console.log("triger::"+JSON.stringify(f))
};

$('#clear').on('click',function(){
    $('#fileId').val("");
    $('#fileupload').find(".preview").html("");
    $('#divtabledata_prev').html("");
})

var uploadlower = new Array();


var emap = JSON.stringify({"lowerProtection":{"低保":"1","低收入":"2","低困":"3"}});
$(document).on("click",'#confirm',uplod);
function uplod(){
    if (status) {
        console.log("AAAAAAAAAAAAA" + "======" + status)
        var batchMeterObj;
        var batchMeterArr=[];
        var error_msg = "";

        for(var i=0;i<uploadlower.length;i++){
            batchMeterObj="LOWER_OBJ_UPLOAD";
            batchMeterObj+="(";
            batchMeterObj+=("'"+uploadlower[i].lowincomeId+"',");
            batchMeterObj+=("'"+uploadlower[i].name+"',");
            batchMeterObj+=("'"+uploadlower[i].population+"',");
            batchMeterObj+=("'"+uploadlower[i].bankAccount+"',");
            batchMeterObj+=("'"+uploadlower[i].socialAccount+"',");
            batchMeterObj+=("'"+uploadlower[i].lowerProtection+"',");
            batchMeterObj+=("'"+uploadlower[i].identity+"'");
            batchMeterObj+=")";
            console.log(batchMeterObj);
            batchMeterArr.push(batchMeterObj);
            if(batchMeterArr.join().length>30000){
                console.log("字符串长度过长：");
                console.log(batchMeterArr.join().length)
                var param={
                    "pro_name":"P_LOWER_UPLOAD",
                    "pro_prop":"LOWER_OBJ("+batchMeterArr.join()+")",
                    "busi_name":"P_LOWER_UPLOAD"
                }
                var parameterRet = Restful.insert('/hzqs/sys/pbpro.do?fh=SYSPRO0000000J00&resp=bd',param);
                if(parameterRet.errCode==0){
                    if(error_msg){
                        error_msg+=(","+parameterRet.msg);
                    }else{
                        error_msg+=parameterRet.msg;
                    }
                }
                batchMeterArr=[];
            }
        }
        if(batchMeterArr.length>0){
            var param2={
                "pro_name":"P_LOWER_UPLOAD",
                "pro_prop":"LOWER_OBJ("+batchMeterArr.join()+")",
                "busi_name":"P_LOWER_UPLOAD"
            }
            var parameterRet2 = Restful.insert('/hzqs/sys/pbpro.do?fh=SYSPRO0000000J00&resp=bd',param2);
            console.log(parameterRet2)

            if(parameterRet2.err_code==0){
                if(error_msg){
                    error_msg+=(","+parameterRet2.msg);
                }else{
                    error_msg+=parameterRet2.msg;
                }
            }

        }
        if(error_msg){
            bootbox.alert("<center><h4>导入完成,以下保障号导入失败："+error_msg+"</h4></center>", function () {
                location.reload();

            });
        }else{
            bootbox.alert("<center><h4>导入完成。</h4></center>", function () {
                location.reload();
            });
        }
    }


    /* if(status){
     console.log(status)
     console.log("confirm ok====================")
     //            console.log(ncol);
     //            console.log(dbcol);
     $.ajax({
     type: 'POST',
     url: "/hzqs/sys/imp/blkconfirm.do?bt=tsyhs&batchid="+puloadId+"&tbname=GAS_CSR_LOWINCOME"
     +"&method=INSERT&ncol="+ncol+"&dbcol="+dbcol+"&refcol=socialAccount&emap="+emap,
     dataType: 'json',
     contentType: "application/json; charset=utf-8",
     async: false,
     success: function(data) {
     console.log("get Data:"+JSON.stringify(data));
     $('#input_many_modal').modal('hide');
     if(data.rows){
     var success = 0
     $.each(data.rows,function(idx,row){
     if(row.status=="1"){
     success += 1;
     }
     })
     bootbox.alert('<center><h4>数据入库成功</h4><br><h2>找到匹配个数'+success+'</h2><br><h2>失败：'+
     (data.rows.length-success)
     +'</h2></center>',function(){
     window.location.reload();
     });

     }else{
     bootbox.alert('<center><h4>数据入库失败！</h4></center>');
     }
     },
     error: function(err) {
     bootbox.alert('<center><h4>数据入库失败！<br><h2>'+JSON.stringify(err)+'</h2></h4></center>');
     $('#input_many_modal').modal('hide');
     // alert("find all err");
     }
     });
     }*/


}



$(document).on('click','#startupload',function(){
    //if (checkExcels()) {

    var form = new FormData(document.getElementById('fileupload'));
//            form.append("contractId",$.md5(JSON.stringify(form) + new Date().getTime()));
    console.log(form.get("files[]"));
    $('#divtabledata_prev').html("");
    var batchId = $.md5(JSON.stringify(form) + new Date().getTime());
    console.log(batchId);
    console.log(batchId);
    $.ajax({
        url: "/hzqs/sys/imp/blkup.do?bt=tsyhs&batchid="+batchId,
        data: form,
        processData: false,
        contentType: false,
        async: false,
        type: 'POST',
        success: function (data) {
            console.log("ret=="+JSON.stringify(data));
            uplaod_ret=data;
            if(data.rows){
                uploadlower =[];
                console.log(data.rows)
                var okcount=0;
                var errcount = 0;
                $.each(data.rows,function(id,row){
                    if(row.vldStatus=='-1'){
                        errcount++;
                    }else{
                        okcount++;
                    }
                })
                bootbox.alert('<center><h4>导入成功条数为</h4><br><h2>'+okcount+'</h2><br><h4>导入失败条数为</h4><br><h2>'+errcount+'</h2></center>');
                var cols = new Array();
                sortHeader = data.headers;
                console.log(sortHeader)
                $.each(ncol_array,function(id,row){
                    console.log(row)
                    if(row == "uuid"){
                        cols.push({"col":row,index:id+1,format:colFormat,hidden:true})
                    }else{
                        cols.push({"col":row,index:id+1,format:colFormat})
                    }
                })
                var lowerProtection ={"低保":"1","低收入":"2","低困":"3"};
                $.each(data.rows,function(index,item){
                    var lowincomeId = $.md5(JSON.stringify(data.rows[index])+ Math.random()+ new Date().getTime());
                    uploadlower.push({
                        "lowincomeId":lowincomeId,
                        "name":$.trim(item["values"][2]),
                        "population":$.trim(item["values"][0]),
                        "bankAccount":$.trim(item["values"][6]),
                        "socialAccount":$.trim(item["values"][1]),
                        "lowerProtection":$.trim(lowerProtection[""+item["values"][4]+""]),
                        "identity":$.trim(item["values"][5])
                    })
                });
                console.log("@@@@@@@@@@@@@@@@")
                console.log(uploadlower)

                $('#confirm').show();
                $('#startupload').hide();
                $('#addbtn').hide();
                $('#clear').hide();
                status = true;
                puloadId = batchId;

                booktable = XWATable.init({
                    divname: "divtabledata_prev",
                    //----------------table的选项-------
                    pageSize: 10,
                    // columnPicker: true,
                    transition: 'fade',
                    checkAllToggle: true,
                    columnPicker: true,
                    //----------------基本restful地址---

                    restbase: 'gasimpbulksdata?query='
                    +RQLBuilder.and([RQLBuilder.equal("batchId",batchId),RQLBuilder.equal("vldStatus","1")]).rql(),
                    //key_column: 'bookId',
                    coldefs:cols,
                    findFilter: function () {
                    },
                    onAdded: function (ret, jsondata) {
                    },

                    onUpdated: function (ret, jsondata) {
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
            }else{
                bootbox.alert('导入失败！');
            }
        },
        error: function (data) {
            bootbox.alert("出错了～\n"+JSON.stringify(data));
            $("#fileId").val('');
        }
    });
});//end on click


$("#history").on("click",function(){
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
        message: "<br><center><h4>确定要作废特殊用户吗？</h4></center><br>",
        callback:function(result){
            if (!result) return;

            $.ajax({
                type: 'put',
                url:  hzq_rest + 'gascsrlowincome/?example={"status":"1"}',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data:JSON.stringify({"status":"2"}),
                async: false,
                success: function(data) {
                    console.log(data)
                    if(data.success){
                        bootbox.alert("<center><h4>作废成功。</h4></center>")
                        xw.update();
                    }
                },
                error: function(err) {}
            });

        }
    })
})
