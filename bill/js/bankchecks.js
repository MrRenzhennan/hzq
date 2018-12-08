var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;


if(areaId != "1"){
    $(".quanxians").hide();
}


GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            $('#find_areaId').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');            
        })
    }
});

var statusformat={
    f:function(val){
        if(val == "0"){
            return "导入";
        }else if(val == "1"){
            return "已匹配";
        }else if(val == "2"){
            return "已登记";        
        }else if(val == "3"){
            return "已删除";
        }
    }
};

var ledgerTypeformat = {
   f:function(val){
        if(val == "1"){
            return "燃气费";
        }else if(val == "2"){
            return "垃圾费";     
        }else if(val == "3"){
            return "燃气费+垃圾费";     
        }else {
            return "未知";
        }
    }
}

var rowDetailsFormat = function () {
    return {
        f: function (val,row) {
            return '<span class="row-details row-details-close" id="'+row.unitcode+'"></span>';
        }
    }
}();

var dateFormat = function () {
return {
    f: function (val,row) {
        if(val)return val.split('T')[0];
        return val;
    }
}
}();

function DateMinus(sDate,eDate){ 
　　var sdate = new Date(sDate.replace(/-/g, "/")); 
　　var now = new Date(eDate); 
　　var days = sdate.getTime() - now.getTime(); 
　　var day = parseInt(days / (1000 * 60 * 60 * 24)); 
　　return day; 
}
var xw ;

var bankHelper=RefHelper.create({
    ref_url:"gasbasbank",
    ref_col:"bankCode",
    ref_display:"bankName"
});
console.log(bankHelper)
var bankFormat=function(){
    return {
        f: function(val){
            return bankHelper.getDisplay(val);
        }
    }
}();
// 供气区域
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

var dates = function(val){
    if(val){
        return val.split('T')[0]
    }
};

var reloadAmount = function(filters){
    function setStartEnd(startdiff,timed){
        $('#createtimefrom').val(moment().add(startdiff,timed).format('YYYY-MM-DD'))
        $('#createtimeto').val(moment().format('YYYY-MM-DD'));

        // xw.autoResetSearch();
    }

    return {

        init: function () {
            $('#find_today_sign').on('click',function(e){setStartEnd(0,'d')})
            $('#find_this_week_sign').on('click',function(e){setStartEnd(-7,'d')})
            $('#find_this_month_sign').on('click',function(e){setStartEnd(-1,'M')})
            $('#find_three_month_sign').on('click',function(e){setStartEnd(-3,'M')})
            $('#find_this_year_sign').on('click',function(e){setStartEnd(-1,'y')})
            $('#find_anyway_sign').on('click',function(e){
                $('#createtimeto').val("");$('#createtimefrom').val("");
            })
            this.reload();
        },
        reload:function(){
            $('#divtable').html('');
            // var cols = "*";
            // var bd = {"cols":cols,
            //     "froms":" (select bank_code as unitcode,bank_name as unitname from gas_bas_bank where status = 1 "+
            //             " union "+
            //             " select charge_unit_code as unitcode,charge_unit_name as unitname from gas_biz_charge_unit where status = 1) ", 
            //     "page":"false",                
            //     "orderBy":"unitcode"};
            var isshow ="";
            if(areaId!="1"){
                isshow="a.is_show='1' and "
            }

            var bd ={
                    "cols":"a.bank_check_id,a.bank_que_name,a.amount_type,a.amount,a.bank_code,a.ledger_date,a.ledger_type,a.status,a.batch_num,a.is_show,a.startDate,a.endDate,"
                    +"b.check_name,b.check_code,b.area_id,b.bank_check_mgr_id",
                    "froms":"gas_bll_bank_check a left join gas_bll_bank_check_mgr b on b.bank_check_mgr_id=a.bank_check_mgr_id",
                    "wheres":isshow +"a.status<>'3'",
                    "page":true,
                    "limit":50

                }

                // if(row.areaId){
                //     if(areaId == row.areaId){
                //         if(areaId == "1"){
                //             return "<a class='yipipei' data-rows='"+JSON.stringify(row)+"'>登记</a> <a class='onedelete' data-id='"+row.bankCheckId+"'>删除</a>"
                //         }else{
                //             return "<a class='yipipei' data-rows='"+JSON.stringify(row)+"'>登记</a>"
                //         }
                        
                //     }else {
                //         return ""
                //     }
                    
                // }else{
                //     if(areaId == "1"){
                //         return "<a class='weipipei' data-rows='"+JSON.stringify(row)+"' >登记</a> <a class='onedelete' data-id='"+row.bankCheckId+"'>删除</a>"
                //     }else {
                //         return "<a class='weipipei' data-rows='"+JSON.stringify(row)+"' >登记</a>"
                //     }
                // }
            var operateFormat = function(){
                return{
                    f:function(val,row){
                        if(areaId == "1"){
                            if(row.areaId && row.status == "2"){
                                return "<a class='weipipei' data-rows='"+JSON.stringify(row)+"' >修改登记信息</a> <a class='onedelete' data-id='"+row.bankCheckId+"'>删除</a>"
                            }else if(row.areaId && row.status == "1"){
                                return "<a class='yipipei' data-rows='"+JSON.stringify(row)+"' >登记</a> <a class='onedelete' data-id='"+row.bankCheckId+"'>删除</a>"
                            }else{
                                return "<a class='weipipei' data-rows='"+JSON.stringify(row)+"' >登记</a> <a class='onedelete' data-id='"+row.bankCheckId+"'>删除</a>"
                            }
                        }else if(row.areaId == areaId){
                            if(row.areaId && row.status == "2"){
                                return ""
                            }else if(row.areaId && row.status == "1"){
                                return "<a class='yipipei' data-rows='"+JSON.stringify(row)+"' >登记</a>"
                            }else{
                                return "<a class='weipipei' data-rows='"+JSON.stringify(row)+"' >登记</a>"
                            }
                        }
                    }
                }
            }() 
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:50,
                    // columnPicker: true,
                    transition: 'fade',
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    //restbase: 'gasbllbankcheck',
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),

                    //key_column:'uuid',
                    coldefs:[
                        {
                            col:"bankQueName",
                            friendly:"银行专户名称",
                            index:2
                        },
                        {
                            col:"ledgerType",
                            friendly:"收支类型",
                            format:function(){
                                var ledgerType={"0":"收入","1":"支出","2":"混合"}
                                return{
                                    f:function(val){
                                        return ledgerType[val]
                                    }
                                }
                            }(),
                            index:3
                        },
                        {
                            col:"amount",
                            friendly:"金额",
                            // format:function(){
                            //     return {
                            //         f:function(val,row){
                            //             if(row.ledgerType == "0"){
                            //                 return row.amount
                            //             }else{
                            //                 return "";
                            //             }
                            //         }
                            //     }
                            // }(),
                            index:4
                        },
                        // {
                        //     col:"inAmount2",
                        //     friendly:"支出金额",
                        //     format:function(){
                        //         return {
                        //             f:function(val,row){
                        //                 if(row.ledgerType == "1"){
                        //                     return row.amount
                        //                 }else{
                        //                     return "";
                        //                 }
                        //             }
                        //         }
                        //     }(),
                        //     index:5
                        // },
                        {
                            col:"bankCode",
                            friendly:"收费银行",
                            format:bankFormat,
                            index:6
                        },
                        {
                            col:"ledgerDate",
                            friendly:"转账日期",
                            format:dateFormat,
                            index:7
                        },
                        {
                            col:"amountType",
                            friendly:"资金类型",
                            format:ledgerTypeformat,
                            index:8
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            format:statusformat,
                            index:9
                        },
                        {
                            col:"isShow",
                            friendly:"是否分公司可见",
                            format:function(){
                                var isShow = {"0":"否","1":"是"}
                                return{
                                    f:function(val){
                                        return isShow[val]
                                    }
                                }
                            }(),
                            index:10
                        },
                        {
                            col:"batchNum",
                            friendly:"批次号",
                            index:11
                        },
                        {
                            col:"startDate",
                            friendly:"开始时间",
                            format:dateFormat,
                            index:12
                        },
                        {
                            col:"endDate",
                            friendly:"结束时间",
                            format:dateFormat,
                            index:13
                        },
                        {
                            col:"checkName",
                            friendly:"专户名称",
                            index:14
                        },
                        {
                            col:"checkCode",
                            friendly:"客户编号",
                            index:15
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaFormat,
                            index:16
                        },
                        {
                            col:"operate",
                            friendly:"操作",
                            format:operateFormat,
                            index:17
                        },
                        
                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_areaId,find_bankQueName,find_checkCode,find_batchNum;
                        var whereinfo = "";

                        if($("#find_areaId").val()){
                            whereinfo+="b.area_id='"+$("#find_areaId").val()+"' and "
                        }
                        if($("#find_bankQueName").val()){
                            whereinfo+="a.bank_que_name='"+$("#find_bankQueName").val()+"' and "
                        }
                        if($("#find_checkCode").val()){
                            whereinfo+="b.check_code='"+$("#find_checkCode").val()+"' and "
                        }
                        if($("#find_batchNum").val()){
                            whereinfo+="a.batch_num='"+$("#find_batchNum").val()+"' and "
                        }
                        if($("#find_status").val()){
                            whereinfo+="a.status='"+$("#find_status").val()+"' and "
                        }

                        var createtimefrom/*开始*/,createtimeto/*结束*/;
                        if($("#createtimefrom").val() && !$("#createtimeto").val()){
                            whereinfo+="a.ledger_date >=to_date('"+$("#createtimefrom").val()+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and "
                        }
                        if(!$("#createtimefrom").val() && $("#createtimeto").val()){
                            whereinfo+="a.ledger_date <= to_date('"+$("#createtimeto").val()+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                        }
                        if($("#createtimefrom").val() && $("#createtimeto").val()){
                            whereinfo+="a.ledger_date <= to_date('"+$("#createtimeto").val()+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and a.ledger_date >= to_date('"+$("#createtimefrom").val()+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and "
                        }
                        if(areaId!="1"){
                            whereinfo+="a.is_show='1' and "
                        }
                        var bd ={
                            "cols":"a.bank_check_id,a.bank_que_name,a.amount_type,a.amount,a.bank_code,a.ledger_date,a.ledger_type,a.status,a.batch_num,a.is_show,a.startDate,a.endDate,"
                            +"b.check_name,b.check_code,b.area_id,b.bank_check_mgr_id",
                            "froms":"gas_bll_bank_check a left join gas_bll_bank_check_mgr b on b.bank_check_mgr_id=a.bank_check_mgr_id",
                            "wheres":whereinfo + " a.status<>'3'",
                            "page":true,
                            "limit":50
        
                        }
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
            
        }
    }
}();

$("#downloadtmpl").on('click',function(){
    var dbcol="ledgerDate,bankQueName,amount,ledgerType";
    var ncol="入账日期,专户名称,金额,类型";
    var queryid='{"bankQueName":""}';
    var q = 'page=true&et=入账信息表&ncol='+ncol.uricode()+'&dbcol='+dbcol.uricode()+'&exp=excel&';
    Metronic.ajax_download(hzq_rest+'gasbllbankcheck/?query='+queryid.uricode()+'&'+q);
})



$('#input_many_modal').on('hide.bs.modal', function() {
    console.log("hide diag")
    setTimeout(function(){$('#confirm').hide();
        $('#divtabledata_prev').html("");
        $('#startupload').show();
        $('#clear').show();
        $('#addbtn').show();
        $("#confirm").button('reset');
        $('#divtabledata_prev').html("");
    },1000)
    // $("#uploadbtn").css({display:"show"})

});
$('#input_many_modal').on('shown.bs.modal', function() {
    console.log("11111",bankHelper.getData())
    $.map(bankHelper.getData(),function(ind,val){
        $("#selectbanks").append("<option value='"+val+"'>"+ind+"</option>")
    })
    var date = new Date();
    var picihao = date.getFullYear() +""+(date.getMonth()+1) +""+date.getDate() +""+date.getHours() +""+date.getMinutes();
    $("#counts").val(picihao)
    console.log("show diag")
    $('#confirm').hide();
    $('#divtabledata_prev').html("");
    $('#startupload').show();
    $('#clear').show();
    $('#addbtn').show();
    $("#confirm").button('reset');
    $('#fileupload').on("submit",function(){
        console.log("submit!!")
    })
})

$('#clear').on('click',function(){
    $('#fileId').val("");
    $('#fileupload').find(".preview").html("");
    $('#divtabledata_prev').html("");
})



$('#fileId').on("change",function(){
    console.log("select file:"+$('#fileId').val())
    $('#fileupload').find(".preview").html(""+$('#fileId').val());
    $("#startupload").attr("disabled",false)
});


$("#selectbanks").on("change",function(){
    if($(this).val()){
        $("#addbtn").attr("disabled",false)
    }else{
        $("#addbtn").attr("disabled",true)
    }
})
var colFormat = function () {
    return {
        f: function (val, row, cell, key) {
            // console.log("key==:" + key + ",row=" + row)
            return JSON.parse(row.jsDatas1)[sortHeader.indexOf(key)];//.JS_DATAS1[ncol_array.indexOf(key)];
        }
    }
}();
function indexss(arr,val){
    // console.log(val)
    var j;
    $.each(arr,function(ind,vals){
        if(vals == val){
            j =ind;
            return;
        }
    })
    // console.log(j)
    return j;
}
var statusupload = false;
var uploadinfo =[];
$(document).on('click','#startupload',function(){

    var form = new FormData(document.getElementById('fileupload'));
    //            form.append("contractId",$.md5(JSON.stringify(form) + new Date().getTime()));
    console.log(form.get("files[]"));
    $('#divtabledata_prev').html("");
    var batchId = $.md5(JSON.stringify(form) + new Date().getTime());
    // console.log(batchId)
    $.ajax({
        url: "/hzqs/sys/imp/blkup.do?bt=bank&batchid="+batchId,
        data: form,
        processData: false,
        contentType: false,
        async: false,
        type: 'POST',
        success: function (data) {
            // console.log("ret=="+JSON.stringify(data));
            uplaod_ret=data;
            if(data.rows){
                uploadinfo=[];
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
                var ncol="入账日期,专户名称,金额,类型";
                var ncol_array = ncol.split(",");
                $.each(ncol_array,function(id,row){
                    // console.log(row)
                    if(row == "uuid"){
                        cols.push({"col":row,index:id+1,format:colFormat,hidden:true})
                    }else{
                        cols.push({"col":row,index:id+1,format:colFormat})
                    }              
                })
                console.log(cols)
                $('#confirm').show();
                $('#startupload').hide();
                $('#addbtn').hide();
                $('#clear').hide();
                var formats = {"入账日期":"ledgerDate","专户名称":"bankQueName","金额":"amount","类型":"ledgerType"};
                var ledgerTypes = {"收入":"0","支出":"1","混合":"2"}
                $.each(data.rows,function(index,item){
                    //console.log("????",index,val)
                    uploadinfo.push({
                        bankCheckId: $.md5(JSON.stringify(item) + index +new Date()),
                        ledgerDate: item["values"][indexss(sortHeader,"入账日期")],
                        bankQueName: item["values"][indexss(sortHeader,"专户名称")],
                        amount: Number(item["values"][indexss(sortHeader,"金额")]),
                        ledgerType : ledgerTypes[item["values"][indexss(sortHeader,"类型")]],
                        bankCode: $("#selectbanks").val(),
                        batchNum: $("#counts").val(),
                        createdBy: userId,
                        modifiedBy: userId

                    })
                })
                console.log(uploadinfo)

                statusupload = true;
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

// 入库
$("#confirm").on("click",function(){

    if(statusupload){
        $(this).button('loading');
        if(!uploadinfo.length){
            bootbox.alert("<center><h4>需要入库的数据为0条。</h4></center>")
            return false;
        }


        // console.log("AAAAAAAAAAAAA" + "======" + status)
        var batchMeterObj;
        var batchMeterArr=[];
        var error_msg = "";

        for(var i=0;i<uploadinfo.length;i++){
            batchMeterObj="BANK_CHECK_OBJ";
            batchMeterObj+="(";
            batchMeterObj+=("'"+uploadinfo[i].bankCheckId+"',");   
            batchMeterObj+=("'"+uploadinfo[i].bankCode+"',");
            batchMeterObj+=("'"+uploadinfo[i].bankQueName+"',");
            batchMeterObj+=("'"+uploadinfo[i].ledgerDate+"',");
            batchMeterObj+=("'"+uploadinfo[i].batchNum+"',");
            batchMeterObj+=("'"+uploadinfo[i].amount+"',");
            batchMeterObj+=("'"+uploadinfo[i].ledgerType+"',");
            batchMeterObj+=("'"+uploadinfo[i].createdBy+"',");
            batchMeterObj+=("'"+uploadinfo[i].modifiedBy+"'");
            batchMeterObj+=")";
            // console.log(batchMeterObj);
            batchMeterArr.push(batchMeterObj);
            if(batchMeterArr.join().length>30000){
                // console.log("字符串长度过长：");
                // console.log(batchMeterArr.join().length)
                var param={
                    "pro_name":"P_BANK_CHECK",
                    "pro_prop":"BANK_CHECK_ARRAY("+batchMeterArr.join()+")",
                    "busi_name":"P_BANK_CHECK"
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
                "pro_name":"P_BANK_CHECK",
                "pro_prop":"BANK_CHECK_ARRAY("+batchMeterArr.join()+")",
                "busi_name":"P_BANK_CHECK"
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
            bootbox.alert("<center><h4>导入完成,以下专户名称倒入失败："+error_msg+"</h4></center>", function () {
                location.reload();

            });
        }else{
            bootbox.alert("<center><h4>导入完成。</h4></center>", function () {
                location.reload();
            });
        }




    }else{
        bootbox.alert("<center><h4>请先上传数据。</h4></center>")
    }
})


//已匹配的登记
$(document).on("click",".yipipei",function(){
    var row = JSON.parse($(this).attr("data-rows"));
    var diag = bootbox.dialog({
        className: "merge-add",
        message:
        '<div class="col-md-6">'
            +'<label class="control-label col-md-4">资金类型:</label>'
            +'<div class="col-md-8">'
                +'<select id="moneytype"'
                        +'class="form-control input-middle select2me" data-placeholder="">'
                    +'<option value="">请选择</option>'
                    +'<option value="1">燃气费</option>'
                    +'<option value="2">垃圾费</option>'
                    +'<option value="3">燃气费+垃圾费</option>'
            +'</select>'
            +'</div>'
        +'</div>'
        +'<div class="btn-group input-group pull-left col-md-12" style="margin-top:10px;">'
            +'<div class="input-group-addon col-md-3">时间起始:</div>'
            +'<div class="input-group input-large date-picker input-daterange" data-date-format="yyyy-mm-dd">'
                +'<input id="begintime" type="text" class="form-control" name="from" placeholder="开始时间">'
                +'<span class="inputclear glyphicon glyphicon-remove-circle hidden" ></span>'
                +'<span class="input-group-addon">至</span>'
                +'<input id="endtime" type="text" class="form-control" name="to" placeholder="结束时间">'
                +'<span class="inputclear glyphicon glyphicon-remove-circle hidden" ></span>'
            +'</div>'
        +'</div>',
        title:"登记",
        buttons:{
            success:{
                label:"保存",
                // dataLoadingText="<i class='fa fa-circle-o-notch fa-spin'></i> 正在提交",
                className:"btn btn-primary save_ssss",
                callback:function () {
                    if(!$("#moneytype").val()){
                        bootbox.alert("<center><h4>请选择资金类型。</h4></center>")
                        return false;
                    }
                    if(!$("#begintime").val()){
                        bootbox.alert("<center><h4>请选择开始时间。</h4></center>")
                        return false;
                    }
                    if(!$("#endtime").val()){
                        bootbox.alert("<center><h4>请选择结束时间。</h4></center>")
                        return false;
                    }

                    // var result = Restful.update(hzq_rest+"gasbllbankcheck",row.uuid,{"ledgerType":$("#moneytype").val()});
                    // console.log(result)
                    // var results = Restful.findNQ(hzq_rest+'gasbllbankcheck/?query={"bankCheckMgrId":"'+row.bankCheckMgrId+'"}&sort=-startDate')
                    // console.log(results)
                    // return false;
                    $.ajax({
                        url: hzq_rest+"gasbllbankcheck/" + row.bankCheckId,
                        type: 'PUT',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({"startDate":$("#begintime").val(),"endDate":$("#endtime").val(),"status":"2","amountType":$("#moneytype").val(),"modifiedTime":new Date(new Date() + '-00:00'),"modifiedBy":userId}),
                        async: false,
                        // data: json,
                        success: function(data) {
                            console.log(data)
                            if(data.success){
                                bootbox.alert("<center><h4>登记成功。</h4></center>",function(){
                                    xw.update();
                                })
                            }else{
                                bootbox.alert("<center><h4>登记失败。</h4></center>",function(){
                                   
                                })
                                return false;
                            }
                        },
                        error: function(err) {
        
                            if( err.status==401){
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
    
    ComponentsPickers.init();
    $("#monytype").val(row.amountType).trigger("change");
    $("body").addClass("modal-open");
})

// 为匹配的登记
var query ="";
if(areaId == "1"){
    query =''
}else{
    query='?query={"areaId":"'+areaId+'"}'
}

var bankmgrHelper=RefHelper.create({
    ref_url:'gasbllbankcheckmgr/'+query,
    ref_col:"bankCheckMgrId",
    ref_display:"checkName"
});
$(document).on("click",".weipipei",function(){
    var row = JSON.parse($(this).attr("data-rows"));
    var diag = bootbox.dialog({
        className: "merge-add",
        message:
        '<div class="col-md-6">'
            +'<label class="control-label col-md-4">资金类型:</label>'
            +'<div class="col-md-8">'
                +'<select id="moneytype1"'
                        +'class="form-control input-middle select2me" data-placeholder="">'
                    +'<option value="">请选择</option>'
                    +'<option value="1">燃气费</option>'
                    +'<option value="2">垃圾费</option>'
                    +'<option value="3">燃气费+垃圾费</option>'
            +'</select>'
            +'</div>'
        +'</div>'
        +'<div class="col-md-6">'
            +'<label class="control-label col-md-4">专户名称:</label>'
            +'<div class="col-md-8">'
                +'<select id="mgrcheckname"'
                        +'class="form-control input-middle select2me" data-placeholder="">'
                    +'<option value="">请选择</option>'
            +'</select>'
            +'</div>'
        +'</div>'
        +'<div class="btn-group input-group pull-left col-md-12" style="margin-top:10px;">'
            +'<div class="input-group-addon col-md-3">时间起始:</div>'
            +'<div class="input-group input-large date-picker input-daterange" data-date-format="yyyy-mm-dd">'
                +'<input id="begintime" type="text" class="form-control" name="from" placeholder="开始时间">'
                +'<span class="inputclear glyphicon glyphicon-remove-circle hidden" ></span>'
                +'<span class="input-group-addon">至</span>'
                +'<input id="endtime" type="text" class="form-control" name="to" placeholder="结束时间">'
                +'<span class="inputclear glyphicon glyphicon-remove-circle hidden" ></span>'
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
                        bootbox.alert("<center><h4>请选择资金类型。</h4></center>")
                        return false;
                    }
                    if(!$("#mgrcheckname").val()){
                        bootbox.alert("<center><h4>请选择专户名称。</h4></center>")
                        return false;
                    }
                    if(!$("#begintime").val()){
                        bootbox.alert("<center><h4>请选择开始时间。</h4></center>")
                        return false;
                    }
                    if(!$("#endtime").val()){
                        bootbox.alert("<center><h4>请选择结束时间。</h4></center>")
                        return false;
                    }
                    // var result = Restful.update(hzq_rest+"gasbllbankcheck",row.uuid,{"ledgerType":$("#moneytype").val()});
                    // console.log(result)
                    console.log(row)
                    if(row.status == "2"){
                        var eDate;
                        var results = Restful.findNQ(hzq_rest+'gasbllbankcheck/?query={"bankCheckMgrId":"'+row.bankCheckMgrId+'"}&sort=-endDate')
                        if(results.length && results[0].startDate && results[0].endDate){
                            if(DateMinus($("#begintime").val() + " 00:00:00",results[0].endDate.split("T").join(" ")) == "0"){
                                eDate = results[0].endDate.split("T").join(" ");
                                var dates = DateMinus($("#begintime").val() + " 00:00:00",eDate)
                                if(dates < 1){
                                    bootbox.alert("<center><h4>该标记时间段内存在已入账信息。</h4></center>")
                                    return false;
                                }else if(dates > 1){
                                    bootbox.alert("<center><h4>该标记时间段之前存在未标记时间。</h4></center>")
                                    return false;
                                }
                            }
                            
                        }
                    }
                    if(row.status == "0"){
                        var eDate;
                        var results = Restful.findNQ(hzq_rest+'gasbllbankcheck/?query={"bankCheckMgrId":"'+$("#mgrcheckname").val()+'"}&sort=-endDate')
                        console.log(results)
                        if(results.length && results[0].startDate && results[0].endDate ){
                            eDate = results[0].endDate.split("T").join(" ");
                            var dates = DateMinus($("#begintime").val() + " 00:00:00",eDate)
                            console.log(dates)
                            if(dates < 1){
                                bootbox.alert("<center><h4>该标记时间段内存在已入账信息。</h4></center>")
                                return false;
                            }else if(dates > 1){
                                bootbox.alert("<center><h4>该标记时间段之前存在未标记时间。</h4></center>")
                                return false;
                            }
                        }
                    }
                    
                    $.ajax({
                        url: hzq_rest+"gasbllbankcheck/" + row.bankCheckId,
                        type: 'PUT',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({"startDate":$("#begintime").val(),"endDate":$("#endtime").val(),"status":"2","amountType":$("#moneytype1").val(),"bankCheckMgrId":$("#mgrcheckname").val(),"modifiedTime":new Date(new Date() + '-00:00'),"modifiedBy":userId}),
        
                        async: false,
                        // data: json,
                        success: function(data) {
                            console.log(data)
                            if(data.success){
                                bootbox.alert("<center><h4>登记成功。</h4></center>",function(){
                                    xw.update();
                                })
                            }else{
                                bootbox.alert("<center><h4>登记失败。</h4></center>",function(){
                                    
                                })
                                return false;
                            }
                        },
                        error: function(err) {
        
                            if( err.status==401){
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
    
    $.map(bankmgrHelper.getData(),function(val,ind){
        $("#mgrcheckname").append("<option value='"+ind+"'>"+val+"</option>")
    })

    $("#moneytype1").select2();
    $("#mgrcheckname").select2();
    console.log(row)
    $("#moneytype1").val(row.amountType).trigger("change");
    $("#mgrcheckname").val(row.bankCheckMgrId).trigger("change");
    $("#begintime").val(dates(row.startDate));
    $("#endtime").val(dates(row.endDate));
    ComponentsPickers.init();
    $("body").addClass("modal-open");
})
// 批量删除
$("#del_button_1").on("click",function(){
    var diag = bootbox.dialog({
        className: "merge-add",
        message:
        '<div class="col-sm-6 form-group">'+
            '<div class="btn-group input-group">'+
                '<div class="input-group-addon">批次号:</div>'+
                '<input id="picihao1" class="inputclear form-control" type="text" placeholder="">'+
                '<span class="inputclear glyphicon glyphicon-remove-circle hide" ></span>'+
            '</div>'+
        '</div>',
        title:"批量删除",
        buttons:{
            success:{
                label:"删除",
                // dataLoadingText="<i class='fa fa-circle-o-notch fa-spin'></i> 正在提交",
                className:"btn red save_delete",
                callback:function () {
                    $(".save_delete").addClass("disabled")
                    if(!$("#picihao1").val()){
                        bootbox.alert("<center><h4>请输入批次号。</h4></center>")
                        $(".save_delete").removeClass("disabled")
                        return false;
                    }

                    var plsc_result = Restful.findNQ(hzq_rest+'gasbllbankcheck/?query={"batchNum":"'+$("#picihao1").val()+'"}')
                    console.log(plsc_result);
                    if(plsc_result.length){
                        $.each(plsc_result,function(index,item){
                            item["status"] = '3';
                            item["modefiedBy"] = userId;
                            item["modifiedTime"] = new Date(new Date()+'-00:00'); 
                        })
                        console.log(plsc_result)
                        var submitJson = {"sets":[
                            {"txid":"1","body":plsc_result,"path":"/gasbllbankcheck/","method":"put"},
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
                                    bootbox.alert("<center><h4>删除成功。</h4><center>",function(){
                                        $(".save_delete").removeClass("disabled")
                                        xw.update();
                                    })
                                }else{
                                    bootbox.alert("<center><h4>删除失败。</h4></center>",function(){
                                    });
                                }
                            },
                            error: function(err) {
                                bootbox.alert("<center><h4>删除失败。</h4></center>",function(){
                                });
                                if( err.status==406){
                                    if(window.location.pathname.indexOf('/login.html')<0)
                                    {
                                        window.location.replace("/login.html?redirect="+window.location.pathname);
                                    }
                                }
                            }
                        });
                    }else{
                        bootbox.alert("该批次号没有记录。")
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
})

//单条删除
$(document).on("click",".onedelete",function(){
    var uuid = $(this).attr("data-id")
    console.log(uuid)
    bootbox.confirm("<center><h4>确定要删除此条记录吗？</h4></center>",function(vals){
        console.log(vals)
        if(vals){
            $.ajax({
                url: hzq_rest+"gasbllbankcheck/" +uuid,
                type: 'PUT',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({"status":"3","modifiedTime":new Date(new Date() + '-00:00'),"modifiedBy":userId}),
                async: false,
                // data: json,
                success: function(data) {
                    console.log(data)
                    if(data.success){
                        bootbox.alert("<center><h4>删除成功。</h4></center>",function(){
                            xw.update();
                        })
                    }else{
                        bootbox.alert("<center><h4>删除失败。</h4></center>",function(){
                        })
                        return false;
                    }
                },
                error: function(err) {
    
                    if( err.status==401){
                        //need to login
                        if(window.location.pathname.indexOf('/login.html')<0)
                        {
                            window.location.replace("/login.html?redirect="+window.location.pathname);
                        }
    
                    }
    
                }
            });
        }
    })
})



// 放权

$("#bank_date_check").on("click",function(){
    var diag = bootbox.dialog({
        className: "merge-add",
        message:
        ' <div class="row">'+
            '<div class="col-md-12 form-group" style="margin:10px 0;">'+
                '<div class="btn-group input-group pull-left col-md-2">'+
                    '<div class="input-group-addon">入账时间起始:</div>'+
                    '<div class="input-group input-large date-picker input-daterange" data-date-format="yyyy-mm-dd">'+
                        '<input id="createtimefroms" type="text" class="form-control" name="from">'+
                        '<span class="inputclear glyphicon glyphicon-remove-circle hidden" ></span>'+
                        '<span class="input-group-addon">至</span>'+
                        '<input id="createtimetos" type="text" class="form-control" name="to">'+
                        '<span class="inputclear glyphicon glyphicon-remove-circle hidden" ></span>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>',
        title:"放权",
        buttons:{
            success:{
                label:"放权",
                // dataLoadingText="<i class='fa fa-circle-o-notch fa-spin'></i> 正在提交",
                className:"btn btn-primary save_fangquan",
                callback:function () {
                    $(".save_fangquan").addClass("disabled")
                    if(!$("#createtimefroms").val()){
                        bootbox.alert("<center><h4>请输入开始时间。</h4></center>")
                        $(".save_fangquan").removeClass("disabled")
                        return false;
                    }
                    if(!$("#createtimetos").val()){
                        bootbox.alert("<center><h4>请输入截止时间。</h4></center>")
                        $(".save_fangquan").removeClass("disabled")
                        return false;
                    }
                    // var queryCondion = RQLBuilder.and([
                    //     RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea)),
                    //     RQLBuilder.equal("status","1"),
                    // ]).rql()
                    var bds = {
                            "cols":"*",
                            "froms":"gas_bll_bank_check",
                            "wheres":" to_char(ledger_date,'yyyy-mm-dd')  between '" + $('#createtimefroms').val() + "' and '" + $("#createtimetos").val() + "' and status <> '3' " ,
                            "page":false
                        }   

                    var plsc_result = Restful.findNQ("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bds)))
                    console.log(plsc_result);
                    if(plsc_result.rows&& plsc_result.rows.length ){
                        $.each(plsc_result.rows,function(index,item){
                            item["isShow"] = '1';
                            item["modefiedBy"] = userId;
                            item["modifiedTime"] = new Date(new Date()+'-00:00'); 
                        })
                        console.log(plsc_result)
                        var submitJson = {"sets":[
                            {"txid":"1","body":plsc_result.rows,"path":"/gasbllbankcheck/","method":"put"},
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
                                    bootbox.alert("<center><h4>放权成功。</h4></center>",function(){
                                        $(".save_delete").removeClass("disabled")
                                        xw.update();
                                    })
                                }else{
                                    bootbox.alert("<center><h4>放权失败。</h4></center>",function(){
                                    });
                                }
                            },
                            error: function(err) {
                                bootbox.alert("<center><h4>放权失败。</h4></center>",function(){
                                });
                                if( err.status==406){
                                    if(window.location.pathname.indexOf('/login.html')<0)
                                    {
                                        window.location.replace("/login.html?redirect="+window.location.pathname);
                                    }
                                }
                            }
                        });
                    }else{
                        bootbox.alert("<center><h4>所选时间段内没有记录。</h4></center>")
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
    ComponentsPickers.init();
})

$("#add_button_1").on("click",function(){
    window.location.href="bill/addbankchecks.html"
})
