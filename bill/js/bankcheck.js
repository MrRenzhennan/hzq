    var statusformat={
        f:function(val){
            if(val == "0"){
                return "导入";
            }else if(val == "1"){
                return "已确认";
            }else if(val == "2"){
                return "已封账";        
            }else if(val == "3"){
                return "已删除";
            }
        }
    };

    var lastClickTime = 0;
    function fnFormatDetails(oTable, nTr) {
        
        var chid=$(nTr).children('td:first-child').children("span").attr('id');

        var sOut = '<tr class="detailtable'+chid+'"><td></td>'
                +'<td colspan=6>';
        sOut += '<div id="detail_'+chid+'" class="table-responsive dataTable container-fluid col-md-12"></div>'
        sOut += '</td></tr>';
        return sOut;
    }
    var statusEditBuilder=function(val){
        if(val=="0"){
            return "<select id='status' name='status' class='form-control chosen-select'>" +
                "<option value='0' selected>未确认</option>" +
                "<option value='1' >已确认</option>"+            
                "<option value='2' >已封账</option>"+
                "<option value='3' >已删除</option></select>" ;
        }else if(val=="1"){
            return "<select id='status' name='status' class='form-control chosen-select'>" +
                "<option value='0' >未确认</option>" +
                "<option value='1' selected>已确认</option>"+            
                "<option value='2' >已封账</option>"+
                "<option value='3' >已删除</option></select>" ;
        }else if(val=="2"){
            return "<select id='status' name='status' class='form-control chosen-select'>" +
                "<option value='0' selected>未确认</option>" +
                "<option value='1' >已确认</option>"+            
                "<option value='2' selected>已封账</option>"+
                "<option value='3' >已删除</option></select>" ;
        }else{
            return "<select id='status' name='status' class='form-control chosen-select'>" +
                "<option value='0' >未确认</option>" +
                "<option value='1' >已确认</option>"+            
                "<option value='2' >已封账</option>"+
                "<option value='3' selected>已删除</option></select>" ;
        }
    };

    var chargeUnitBuilder = function(val){

        var buf = "<select id='status' name='status' class='form-control chosen-select'>"
        if(!val)
        {
            buf+="<option value='' >未知</option>"
        }else{
            buf+="<option value='' selected>未知</option>"
        }
        $.each(xw.getTable().getData().rows,function(idx,row){
            if(val==row.unitcode){
                buf+="<option value='"+row.unitcode+"' selected>"+row.unitname+"</option>"
            }else{
                buf+="<option value='"+row.unitcode+"'>"+row.unitname+"</option>"
            }            
        })
        buf+="</select>"
        return buf;
    }

    var directionformat={
        f:function(val){
            if(val == "0"){
                return "收入";
            }else if(val == "1"){
                return "支出";     
            }else {
                return "其他";
            }
        }
    }
    var directionBuilder=function(val){
        if(val=="0"){
            return "<select id='ledgderDirection' name='ledgderDirection' class='form-control chosen-select'>" +
                "<option value='0' selected>收入</option>" +
                "<option value='1' >支出</option>"+            
                "<option value='2' >其他</option>"+
                "</select>" ;
        }else if(val=="1"){
            return "<select id='ledgderDirection' name='ledgderDirection' class='form-control chosen-select'>" +
                "<option value='0' >收入</option>" +
                "<option value='1' selected>支出</option>"+            
                "<option value='2' >其他</option>"+"</select>" ;
        }else{
            return "<select id='ledgderDirection' name='ledgderDirection' class='form-control chosen-select'>" +
                "<option value='0' >收入</option>" +
                "<option value='1' >支出</option>"+            
                "<option value='2' selected>其他</option>"+"</select>" ;
        }
    };
    
    var ledgerTypeformat = {
       f:function(val){
            if(val == "0"){
                return "燃气费";
            }else if(val == "1"){
                return "垃圾处理费";     
            }else if(val == "2"){
                return "其他";     
            }else {
                return "未知";
            }
        }
    }

    var ledgerTypeBuilder = function(val,row){
        if(val=="0"){
            return "<select id='ledgerType' name='ledgerType' class='form-control chosen-select'>" +
                "<option value='0' selected>燃气费</option>" +
                "<option value='1' >垃圾处理费</option>"+            
                "<option value='2' >其他</option>"+
                "</select>" ;
        }else if(val=="1"){
            return "<select id='ledgerType' name='ledgerType' class='form-control chosen-select'>" +
                "<option value='0' >燃气费</option>" +
                "<option value='1' selected>垃圾处理费</option>"+            
                "<option value='2' >其他</option>"+
                "</select>" ;
        }else{
            return "<select id='ledgerType' name='ledgerType' class='form-control chosen-select'>" +
                "<option value='0' >燃气费</option>" +
                "<option value='1' >垃圾处理费</option>"+            
                "<option value='2' selected>其他</option>"+
                "</select>" ;
        }
    }

    

    var accountTypeformat = {
        f:function(val){
            if(val == "0"){
                return "专户";
            }else if(val == "1"){
                return "代收";     
            }else {
                return "其他";
            }
        }
    }

     var accountTypeBuilder = function(val){
        if(val=="0"){
            return "<select id='accountType' name='accountType' class='form-control chosen-select'>" +
                "<option value='0' selected>专户</option>" +
                "<option value='1' >代收</option>"+            
                "<option value='2' >其他</option>"+
                "</select>" ;
        }else if(val=="1"){
            return "<select id='accountType' name='accountType' class='form-control chosen-select'>" +
                "<option value='0' >专户</option>" +
                "<option value='1' selected>代收</option>"+            
                "<option value='2' >其他</option>"+
                "</select>" ;
        }else{
            return "<select id='accountType' name='accountType' class='form-control chosen-select'>" +
                "<option value='0' >专户</option>" +
                "<option value='1' >代收</option>"+            
                "<option value='2' selected>其他</option>"+
                "</select>" ;
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



var modrow=function(uuid,chid){
    if(!xwbyid[chid])return;
    console.log("uuid="+uuid+",table="+xwbyid[chid]);
    var selrow ;
    $.each(xwbyid[chid].getTable().getData().rows,function(idx,row){ 
        if(uuid==row.uuid)
        {
            selrow = row; 
            console.log(JSON.stringify(row));
        }
    })
    if(selrow){

        xwbyid[chid].updForRow(selrow)
    }

    //alert("uuid:"+uuid)
}

var delrow=function(uuid,chid){
    if(!xwbyid[chid])return;
    console.log("uuid="+uuid+",table="+xwbyid[chid]);
    var selrow ;
    $.each(xwbyid[chid].getTable().getData().rows,function(idx,row){ 
        if(uuid==row.uuid)
        {
            selrow = row; 
            console.log(JSON.stringify(row));
        }
    })
    if(selrow){
        xwbyid[chid].delFunction({rows:[selrow]})
    }

    //alert("uuid:"+uuid)
}


var xw ;
var xwbyid = {};


var bankGroupAmount = {};

var BankCheckAction = function () {


     function setStartEnd(startdiff,timed){
        $('#createtimefrom').val(moment().add(startdiff,timed).format('YYYY-MM-DD'))
        $('#createtimeto').val(moment().format('YYYY-MM-DD'));

        xw.autoResetSearch();
    }

    var reloadAmount = function(filters){
      //  var v = 'select bank_code,sum(in_amount) as in_amount,sum(out_amount) as out_amount,count(1) as count from GAS_BLL_BANK_CHECK group by bank_code;'
        //console.log("filters:"+JSON.stringify(filters))

        var find_customName , find_customCode,createtimefrom,createtimeto;

        var wheres = "1=1 "
                        
        if($('#createtimefrom').val())
        {
            wheres+="and ledgerDate >= to_date('"+$('#createtimefrom').val()+" 00:00:00','YYYY-MM-DD HH24:MI:SS')";
        }
        if($('#createtimeto').val())
        {
            wheres+=("and ledgerDate <= to_date('"+$('#createtimeto').val()+" 23:59:59','YYYY-MM-DD HH24:MI:SS')");
        }
       

        var bd = {"cols":'bank_code,sum(in_amount) as in_amount,sum(out_amount) as out_amount,count(1) as count',
                "froms":" gas_bll_bank_check ", 
                "page":"false",     
                "wheres":wheres,
                "groupby":"bank_code"};
         $.ajax({
                type: 'get',
                url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (data, textStatus, xhr) {
                    if (xhr.status == 200) {
                        var rows = data.rows;
                        console.log("reloadAmount=="+JSON.stringify(rows))
                        bankGroupAmount = {};
                        if (!data.rows || !rows.length || rows.length == 0) {
                        } else {
                            $.each(rows,function(idx,row){
                                if(row.bankCode){
                                    bankGroupAmount[row.bankCode] = row;
                                }else{
                                    bankGroupAmount['00'] = row;
                                }
                            })
                        }
                    }
                }
        });

    }
   
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper:function(){
           $('#find_today_sign').on('click',function(e){setStartEnd(0,'d')})
            $('#find_this_week_sign').on('click',function(e){setStartEnd(-7,'d')})
            $('#find_this_month_sign').on('click',function(e){setStartEnd(-1,'M')})
            $('#find_three_month_sign').on('click',function(e){setStartEnd(-3,'M')})
            $('#find_this_year_sign').on('click',function(e){setStartEnd(-1,'y')})
            $('#find_anyway_sign').on('click',function(e){
                $('#createtimeto').val("");$('#createtimefrom').val("");
            })
        },

        reload:function(){
            $('#divtable').html('');
            var cols = "*";
            var bd = {"cols":cols,
                "froms":" (select bank_code as unitcode,bank_name as unitname from gas_bas_bank where status = 1 "+
                        " union "+
                        " select charge_unit_code as unitcode,charge_unit_name as unitname from gas_biz_charge_unit where status = 1) ", 
                "page":"false",                
                "orderBy":"unitcode"};
            reloadAmount()

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:50,
//                    columnPicker: true,
                    transition: 'fade',
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    //restbase: 'gasbllbankcheck',
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),

                    //key_column:'uuid',
                    coldefs:[
                        {       
                            col:"uuid",
                            //unique:true,
    //                        hidden:"hidden",
                            friendly:"  ",
                            class:"table-checkbox",
                            format:rowDetailsFormat,
                            width:"100px",
                            index:1,
                           // nonedit: "nosend",
                        },
                        {
                            col:"unitname",
                            friendly:"收费单位",
                            index:2
                        },
                        {
                            col:"totalInAmount",
                            friendly:"总收入金额",
                            format: {
                                    f: function(val,row,cell){
                                        if(bankGroupAmount[row.unitcode]){
                                            return bankGroupAmount[row.unitcode].inAmount;
                                        }
                                        return 0;
                                    //    return seviceHelper.getDisplay(val);
                                    },
                                },
                            index:10
                        },
                        {
                            col:"totalOutAmount",
                            friendly:"总支出金额",
                            format: {
                                    f: function(val,row,cell){
                                        if(bankGroupAmount[row.unitcode]){
                                            return bankGroupAmount[row.unitcode].outAmount;
                                        }
                                        return 0;
                                    //    return seviceHelper.getDisplay(val);
                                    },
                                },
                            index:12
                        },{
                            col:"totalTransferAmount",
                            friendly:"总转账",
                            format: {
                                    f: function(val,row,cell){
                                        if(bankGroupAmount[row.unitcode]){
                                            return bankGroupAmount[row.unitcode].inAmount-bankGroupAmount[row.unitcode].outAmount;
                                        }
                                        return 0;
                                    //    return seviceHelper.getDisplay(val);
                                    },
                                },
                            index:13
                        },{
                            col:"totalCount",
                            friendly:"笔数",
                            format: {
                                    f: function(val,row,cell){
                                        if(bankGroupAmount[row.unitcode]){
                                            return bankGroupAmount[row.unitcode].count;
                                        }
                                        return 0;
                                    //    return seviceHelper.getDisplay(val);
                                    },
                                },
                            index:14
                        }

                    ],

                    // 查询过滤条件
                    findFilter: function(){

                        reloadAmount();
                        return "";
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init

            var createDetailTable = function(chid,filter,extprops){
                var opformat = function () {
                    return {
                        f: function (val,row) {     
                           // console.log("xwbyid="+chid+",obj="+xwbyid[chid])   
                            return '<a href="javascript:modrow(\''+row.uuid+'\',\''+chid+'\')"> 登记</a>'+
                            ' &nbsp;| <a href="javascript:delrow(\''+row.uuid+'\',\''+chid+'\')"> 删除</a>';
                        }
                    }
                }();

                return  XWATable.init(
                        $.extend(
                            {
                                divname: "detail_"+chid,
                                //----------------table的选项-------
                                pageSize:10,
                                columnPicker: true,
                                transition: 'fade',
                                checkAllToggle:true,
                                //----------------基本restful地址---
                                restbase: 'gasbllbankcheck?query='+filter.rql(),
                                key_column:'uuid',
                                coldefs:[
                                    {       
                                        col:"uuid",
                                        unique:true,
                                        hidden:"hidden",
                                        friendly:"  ",
                                        index:1,
                                        nonedit: "nosend",
                                    },
                                    {
                                        col:"ledgderDirection",
                                        friendly:"收支类型",
                                        inputsource: "select",
                                        format:directionformat,
                                        default_value:"0",
                                        inputsource: "custom",
                                        inputbuilder: "directionBuilder",
                                        index:2
                                    },  
                                    {
                                        col:"inAmount",
                                        friendly:"收入金额",
                                        inputsource:"positive-numeric",
                                        index:10
                                    },
                                    {
                                        col:"outAmount",
                                        friendly:"支出金额",
                                        inputsource:"positive-numeric",
                                        index:11
                                    },
                                    {
                                        col:"disAmount",
                                        friendly:"帐户变化",
                                        nonedit:"nosend",
                                        format:{
                                           f:function(val,row){
                                                return row.inAmount - row.outAmount;
                                            }
                                        },
                                        index:12
                                    },
                                    {
                                        col:"bankCode",
                                        friendly:"入账单位",
                                        //inputsource: "select",
                                        //ref_url:  "gasbasbank",
                                        inputsource: "custom",
                                        inputbuilder: "chargeUnitBuilder",

                                        hidden:"hidden",
                                        //ref_name: "bankName",
                                        //ref_value: "bankCode",
                                        //format:GasModBas.bankNameFormat,
                                        index:15
                                    },                        
                                    {
                                        col:"bankName",
                                        friendly:"缴费公司名称",
                                        inputsource: "select",
                                        ref_url:  "gasbllbankcustomref",
                                        ref_name: "customerName",
                                        ref_value: "customerName",
                                        index:16
                                    },
                                    {
                                        col:"ledgerDate",
                                        friendly:"转账日期",
                                        inputsource:"datepicker",
                                        format:dateFormat,
                                        index:17
                                    },
                                    {
                                        col:"ledgerType",
                                        friendly:"资金类型",
                                        format:ledgerTypeformat,
                                        inputsource: "custom",
                                        default_value:"0",
                                        inputbuilder: "ledgerTypeBuilder",
                                        index:18
                                    },
                                    {
                                        col:"accountType",
                                        friendly:"账户类型",
                                        format:accountTypeformat,
                                        inputsource: "custom",
                                        default_value:"0",
                                        inputbuilder: "accountTypeBuilder",
                                        index:19
                                    },
                                    
                                    
                                    {
                                        col:"status",
                                        friendly:"状态",
                                        format:statusformat,
                                        inputsource: "custom",
                                        inputbuilder: "statusEditBuilder",
                                        default_value:"0",
                                        index:20
                                    },
                                    {
                                        col:"comments",
                                        friendly:"注释",
                                        index:21
                                    },
                                    {
                                        col:"operation",
                                        friendly:"操作",
                                        format:opformat,
                                        nonedit:"nosend",
                                        index:22
                                    },
                                    {
                                        col:"createdTime",
                                        friendly:"导入时间",
                                        readonly: "readonly",
                                        hidden:"hidden",
                                        nonedit: "nosend",
                                        index:30
                                    },                        
                                    {
                                        col:"createdBy",
                                        friendly:"创建人",
                                        nonedit: "nonedit",
                                        readonly: "readonly",
                                        hidden:"hidden",
                                        default_value:UserInfo.userId(),
                                        index:100
                                    },
                                    {
                                        col:"modifiedTime",
                                        friendly:"修改时间",   
                                        nonedit: "nonedit",
                                        hidden:"hidden",
                                        readonly: "readonly",                         
                                        index:101
                                    },{
                                        col:"modifiedBy",
                                        friendly:"修改人",
                                        nonedit: "nonedit",
                                        hidden:"hidden",
                                        readonly: "readonly",
                                        default_value:UserInfo.userId(),
                                        index:102
                                    },
                                ],
                                findFilter: function () {

                                },
                                onAdded: function (ret, jsondata) {

                                },

                                onUpdated: function (ret, jsondata) {

                                },

                                onDeleted: function (ret, jsondata) {
                                }
                            },extprops)
                        );

                    //end create table
            }

            var hiddenTable = createDetailTable('____none','',{'addbtn':'add_button_1'});
            console.log("hiddenTable=="+hiddenTable)
//
            $("#divtable").on('click', ' tbody td .row-details', function () {
                
                var nTr = $(this).parents('tr')[0];
                if(new Date().getTime()-lastClickTime<100){
                    return;

                }
                lastClickTime = new Date().getTime();
                var chid=$(nTr).children('td:first-child').children("span").attr('id');
                if ($(nTr).children("td").children("span").hasClass("row-details-open")) {
                    /* This row is already open - close it */
                    $(this).addClass("row-details-close").removeClass("row-details-open");
                    //booktable.fnClose(nTr);
                    $(nTr).siblings('tr.detailtable'+chid).remove()
                } else 
                if ($(nTr).children("td").children("span").hasClass("row-details-close")) {
                    /* Open this row */
                    $(this).addClass("row-details-open").removeClass("row-details-close");
                    var ele=fnFormatDetails(xw,nTr);
                    $(ele).insertAfter(nTr)


                    var find_bankcode,find_date;
                    console.log("new table="+chid)

                    if(chid!='00'){
                        find_bankcode = RQLBuilder.equal('bankCode',chid);
                    }else{
                        find_bankcode =  RQLBuilder.isnull('bankCode');
                    }
                    console.log("bankcode:"+JSON.stringify(find_bankcode))

                 

                    var find_customName , find_customCode,createtimefrom,createtimeto;


                    if($('#createtimefrom').val())
                    {
                    createtimefrom=RQLBuilder.condition("ledgerDate","$gte","to_date('"+$('#createtimefrom').val()+" 00:00:00','YYYY-MM-DD HH24:MI:SS')");
                    }
                    if($('#createtimeto').val())
                    {
                    createtimeto=RQLBuilder.condition("ledgerDate","$lte","to_date('"+$('#createtimeto').val()+" 23:59:59','YYYY-MM-DD HH24:MI:SS')");
                    }

                      var filter=RQLBuilder.and([
                            find_bankcode,createtimefrom,createtimeto
                    ]);


                    setTimeout(function(){
                        console.log("new table="+chid+",obj="+JSON.stringify(filter))
                        
                        
                        xwbyid[chid]=createDetailTable(chid,filter);

                    },10);


                    //booktable.fnOpen(nTr, fnFormatDetails(booktable, nTr), 'details');
                }else{
                    console.log("unknow state:")
                }
            });
        },

    }
}();


$('#input_many_modal').on('hide.bs.modal', function() {
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

$('#clear').on('click',function(){
    $('#fileId').val("");
    $('#fileupload').find(".preview").html("");
    $('#divtabledata_prev').html("");
})


$("#downloadtmpl").on('click',function(){
    var dbcol="ledgerDate,customerName,inAmount";
    var ncol="入账日期,单位,金额";
    console.log("download")
    var queryid='{"customerName":""}';
    var q = 'page=true&et=入账信息表&ncol='+ncol.uricode()+'&dbcol='+dbcol.uricode()+'&exp=excel&';
    Metronic.ajax_download(hzq_rest+'gasbllbankcheck/?query='+queryid.uricode()+'&'+q);
})
var colFormat = function () {
            return {
                f: function (val, row, cell, key) {
                    console.log("key==:" + key + ",row=" + row)
                    return JSON.parse(row.jsDatas1)[sortHeader.indexOf(key)];//.JS_DATAS1[ncol_array.indexOf(key)];
                }
            }
        }();

var bankHelper=RefHelper.create({
                    ref_url:"gasbasbank",
                    ref_col:"bankName",
                    ref_display:"bankCode",
                });

var chargeUnitHelper=RefHelper.create({
                    ref_url:"gasbizchargeunit",
                    ref_col:"chargeUnitName",
                    ref_display:"chargeUnitCode",
                });

var chargeUnitArray = new Array()
var chargeUnitMap = {}
var chargeAliasMap = {}

var chargeUnitCodes = new Array()

chargeAliasMap['工行']='工商银行';
chargeAliasMap['农行']='农业银行';
chargeAliasMap['中行']='中国银行';
chargeAliasMap['建行']='建设银行';
chargeAliasMap['招行']='招商银行';
chargeAliasMap['邮储']='邮政储蓄';
chargeAliasMap['交行']='交通银行';
chargeAliasMap['浦发']='浦发银行';
chargeAliasMap['光大']='光大银行';
chargeAliasMap['龙江']='龙江银行';
chargeAliasMap['哈尔滨银行']='商业银行';


$.each(bankHelper.getData(),function(idx,code){ 
    chargeUnitMap[idx]=code
    chargeUnitCodes.push(code);
    chargeUnitArray.push({"chargeCode":code,"chargeName":idx})
})

$.each(chargeUnitHelper.getData(),function(idx,code){ 
    chargeUnitMap[idx]=code
    chargeUnitCodes.push(code);
    chargeUnitArray.push({"chargeCode":code,"chargeName":idx})
})
chargeUnitMap['工行']='04';
chargeUnitMap['农行']='05';
chargeUnitMap['中行']='90';
chargeUnitMap['建行']='06';
chargeUnitMap['招行']='07';
chargeUnitMap['邮储']='02';
chargeUnitMap['交行']='03';
chargeUnitMap['浦发']='09';
chargeUnitMap['光大']='10';
chargeUnitMap['龙江']='18';
chargeUnitMap['哈尔滨银行']='01';



//console.log("map:"+JSON.stringify(chargeUnitMap))
//console.log("array:"+JSON.stringify(chargeUnitArray))

$(document).on('click','#startupload',function(){

    var form = new FormData(document.getElementById('fileupload'));
//            form.append("contractId",$.md5(JSON.stringify(form) + new Date().getTime()));
    console.log(form.get("files[]"));
    $('#divtabledata_prev').html("");
    var batchId = $.md5(JSON.stringify(form) + new Date().getTime());
    console.log(batchId)
    $.ajax({
        url: "/hzqs/sys/imp/blkup.do?bt=bankcheck&batchid="+batchId,
        data: form,
        processData: false,
        contentType: false,
        async: false,
        type: 'POST',
        success: function (data) {
            console.log("ret=="+JSON.stringify(data));
            uplaod_ret=data;
            if(data.rows){
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
                var ncol="入账日期,单位,金额";
                var ncol_array = ncol.split(",");
                $.each(ncol_array,function(id,row){
                    console.log(row)
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

                var dbcol="uuid@uuid,d@ledgerDate,bankName,ref#GAS_BLL_BANK_CUSTOM_REF#customer_Name#BANK_CODE#$@bankCode,inAmount,func#'0'@accountType";
                var ncol="uuid,入账日期,单位,单位,金额,accountType";
                

                var emap = JSON.stringify({"bankCode":chargeUnitMap,"bankName":chargeAliasMap})

                //var emap = JSON.stringify({"customerType":{"普表":"P","IC卡":"I"},"gasKind":{"居民":"1","非居民":"9"}});
                $(document).on("click",'#confirm',function(){
                    console.log("confirm ok")
                    console.log(ncol);
                    console.log(dbcol);
                    $.ajax({
                        type: 'POST',
                        url: "/hzqs/sys/imp/blkconfirm.do?bt=bankcheck&batchid="+batchId+"&tbname=GAS_BLL_BANK_CHECK"
                        +"&method=INSERT&ncol="+ncol+"&dbcol="+dbcol.uricode()+"&refcol=n&emap="+emap.uricode(),
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

                })

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


