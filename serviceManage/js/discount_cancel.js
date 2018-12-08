/**
 * Created by anne on 2017/5/23.
 */


jQuery(document).ready(function() {
    specficCancel.init();

});
var customerAddress ;
var customerName;
var customerKind;
var customerCode;
var customerTel;
var idcard;
var occurrencetime;
var opertor;
var pid;
var cancelreason;
var customerKindEmnu={
	"1":"居民",
	"9":"非居民"
}
specficCancel = function(){
    return {
        init:function(){
            this.reload();
        },
        reload:function(){
            $('#divtable').html('');

            xw1=XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize : 10,
                    columnPicker : true,
                    transition : 'fade',
                    checkboxes : true,
                    checkAllToggle : true,
                    //----------------基本restful地址---
                    restbase: 'gascsrlowincome',
                    key_column:'lowincomeId',
                    coldefs:[
                        {
                            col:"lowincomeId",
                            friendly:"lowincomeId",
                            unique:true,
                            hidden:true,
                            nonedit:"nosend",
                            readonly:"readonly",
                            sorting:false,
                            index:1
                        },
                        {
                            col:"socialAccount",
                            friendly:"保障号",
                            sorting:false,
                            readonly:"readonly",
                            index:2
                        },
                        {
                            col:"identity",
                            friendly:"身份证号",
                            sorting:false,
                            readonly:"readonly",
                            index:3
                        },
                        {
                            col:"bankAccount",
                            friendly:"银行卡号",
                            sorting:false,
                            readonly:"readonly",
                            index:4
                        },
                        {
                            col:"population",
                            friendly:"人口数",
                            sorting:false,
                            readonly:"readonly",
                            index:5
                        },
                        {
                            col:"name",
                            friendly:"姓名",
                            sorting:false,
                            readonly:"readonly",
                            index:6
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            sorting:false,
                            readonly:"readonly",
                            index:7
                        },
                        {
                            col:"lowerProtection",
                            friendly:"特殊用户类型",
                            sorting:false,
                            readonly:"readonly",
                            index:8
                        }
                    ]
                    ,
                    findFilter: function(){//find function
                        var	queryUrl=hzq_rest + 'gascsrlowincome';
                        $("#divtable").css("display","block");
                        var querys=new Array()
                        if ($('#socialAccount').val()) {
                            querys.push(RQLBuilder.like("socialAccount", $('#socialAccount').val()));
                        }

                        if ($('#identity').val()) {
                            querys.push(RQLBuilder.like("identity" , $('#identity').val()));
                        }
                        if ($('#bankAccount').val()) {
                            querys.push(RQLBuilder.like("bankAccount" , $('#bankAccount').val()));
                        }
                        if(querys.length>0){
                            queryUrl += "?query="+RQLBuilder.and(querys).rql();
                        }

                        xw1.setRestURL(queryUrl);
                        xw1.update()
                        var data = xw1.getTable().getData();
                        // alert(data.total_rows)

                        if(data.total_rows>0){
                            $("#divtable p").html('');
                            $('#divtable').css("display","block");
                            $("#divtable").prepend("<p>请选择一条符合条件的记录   <button id='confirm_btn1' class='btn blue'>确定</button> </p>");

                        }else{
                            $("#divtable p").html('');
                            $("#divtable").css("display","block");
                            $("#divtable").prepend("<p>请选择一条符合条件的记录   <button id='confirm_btn1' class='btn blue'>确定</button> </p>");
                        }

                        $("#confirm_btn1").on('click',function(){

                            var data = xw1.getTable().getData(true);
                            // alert(data.total_rows)
                            console.log(data.rows.length)
                            if(data.rows.length == 0){
                                bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
                                return false;
                            }
                            if(data.rows.length>1){
                                bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
                                return false;
                            }
                            if(data.rows.length==1){
                                console.log(data.rows[0])
                                console.log(data.rows[0].lowerProtection)
                                $("#divtable").css("display","none");
                                idcard = data.rows[0].identity;
                                var accountNo =data.rows[0].bankAccount;
                                var perNo = data.rows[0].population;
                                var nameNo = data.rows[0].name;
                                var lower =data.rows[0].lowerProtection;
                                var stateNo =data.rows[0].status;
                                var baoNo = data.rows[0].socialAccount
                                $("#idcardNo").val(idcard);
                                $("#baoNo").val(baoNo);
                                $("#accountNo").val(accountNo);
                                $("#perNo").val(perNo);
                                $("#nameNo").val(nameNo);
                                console.log(stateNo)
                                //判断 特殊用户类型 1 2 3 已绑定  其他为正常
                                if(lower=="1"){
                                    $("#specificType").val('低保');
                                }else if(lower=="2"){
                                    $("#specificType").val('低收入');
                                }else if(lower=="3"){
                                    $("#specificType").val('低困');
                                }else if(lower=="0"){
                                    $("#specificType").val('正常');
                                }else{
                                    $("#specificType").val('正常');
                                    console.log(baoNo)
                                    $.ajax({
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                        type: 'get',
                                        //url: hzq_rest + 'gasctmspecific',
                                        url: hzq_rest + 'gasctmspecific?query={"socialAccount":\"'+baoNo+'\"}&page=true&limit=1&skip=0' ,
                                        async: false,
                                        success: function (data) {
                                            console.log(data);
                                            if(data1[data1.length-1].status=="1"){
                                                $("#show").html('');
                                                $("#show").prepend('')
                                            }else if(data1[data1.length-1].status=="2"){
                                                $("#show").html('');
                                                $("#show").prepend('')
                                            }else if(data1[data1.length-1].status=="3"){
                                                $("#show").html('');
                                                $("#show").prepend('')
                                            }else{
                                                $("#show").html('');
                                                $("#show").prepend('')

                                            }
                                        }
                                    })
                                }
                                //判断状态
                                if(stateNo==1){
                                    $("#stateNo").val('启用');
                                }else if(stateNo==2){
                                    $("#stateNo").val('停用');
                                }else if(stateNo==3){
                                    $("#stateNo").val('已删除');
                                }else{
                                    $("#stateNo").val('无');
                                }


                                // specificType   stateNo
                            }
                        });
                        return "";

                    }
                });
//          $('#find_button1').on('click',function(){
//
//          })
        },
    }

}();

$("#save_btn").on('click',function(){


    pid=getUuid();

    function getUuid(){
        var len=32;//32长度
        var radix=16;//16进制
        var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid=[],i;radix=radix||chars.length;
        if(len){
            for(i=0;i<len;i++)uuid[i]=chars[0|Math.random()*radix];
        }else{
            var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';
            for(i=0;i<36;i++){
                if(!uuid[i]){
                    r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];
                }
            }
        }
        return uuid.join('');
    }


    occurrencetime = new Date().toLocaleString();

    if(JSON.parse(localStorage.getItem("user_info")).employee_name){
        opertor = localStorage.getItem("user_info").employee_name;
    }else{
        opertor = JSON.parse(localStorage.getItem("user_info")).userId;
    }


    customerCode = $("#customerCode").text();
    customerAddress = $("#customerAddress").text();
    customerName =$("#customerName").text();
    if($("#customerKind").text()=="居民"){
        customerKind ="1";
    }else{
        customerKind = "9"
    }
    customerTel =$("#Tel").text();
    idcard = $("#idcard").text();
    var parameter = {
        "businesstype":"tsyhyhqx",
        "printcontent":"{\"occurrencetime\":\""+occurrencetime+"\",\
         \"opertor\":\""+opertor+"\",\
        \"customtype\":\""+customerKind+"\",\
        \"customercode\":\""+customerCode+"\",\
        \"customname\":\""+customerName+"\",\
        \"customtel\":\""+customerTel+"\",\
         \"customic\":\""+idcard+"\",\
        \"customaddress\":\""+customerAddress+"\",\
        \"businessname\":\"特殊用户优惠取消\",\
        \"cancelreason\":\""+cancelreason+"\"}",

        "pid":""+pid+""
    };
    console.log(JSON.stringify(parameter));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/hzqs/spt/pbprt.do?fh=PRTSPT0000000J00&resp=bd',
        type:"POST",
        datatype:"json",
        data:JSON.stringify(parameter),
        success:function(e){
            if(e.errCode=='1'){
                bootbox.alert("<br><center><h4>保存成功！</h4></center><br>");
                $('.btn-primary').on('click',function(){
                    $('#save_btn').addClass('disabled');
                    $('#print_btn').removeClass('disabled');
                    $('#submit_btn').removeClass('disabled');
                    // window.location.reload();
                })
            }else{
                bootbox.alert("<br><center><h4>保存失败！</h4></center><br>");
            }
        }
    })
});
$("#print_btn").on('click',function(){

    // var parameter = {"cmdheader":{"cmdtype":"17"},"param":{"data":[{"ptid":""+pid+""}]}}

    var urll = 'http://127.0.0.1:9000/?data={"cmdheader":{"cmdtype":"17"},"param":{"data":[{"ptid":"'+pid+'"}]}}';
    //alert(urll)
    console.log(JSON.stringify(urll));
    $.ajax({

        url: urll,
        type:"GET",

        success:function(e){
            if(e.success){
                bootbox.alert("<br><center><h4>保存成功！</h4></center><br>");

                $('.btn-primary').on('click',function(){
                    $('#save_btn').addClass('disabled');
                    $('#print_btn').addClass('disabled');
                    // window.location.reload();

                })


            }else{
                bootbox.alert("<br><center><h4>打印失败！</h4></center><br>");
            }
        }
    })
});
$("#submit_btn").on('click',function(){
    // var data =xw.getTable().getData(true);
    customerCode = $("#customerCode").text();
    customerAddress = $("#customerAddress").text();
    customerName =$("#customerName").text();
    if($("#customerKind").text()=="居民"){
        customerKind ="1";
    }else{
        customerKind = "9"
    }
    customerTel =$("#Tel").text();


    if(fileId){
    }else{
        fileId="";
    }

    var parameter = {
        "customcode":""+customerCode+"",
        "remark":""+remark+"",
        "filesid":""+fileId+""

    }
    console.log(JSON.stringify(parameter));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/hzqs/ser/pbssc.do?fh=VFLSCGC000000J00&resp=bd',
        type:"POST",
        datatype:"json",
        data:JSON.stringify(parameter),
        success:function(e){
            if(e.err_code == '1'){
                bootbox.alert("<br><center><h4>提交成功！</h4></center><br>");

                $('.btn-primary').on('click',function(){
                    window.location.reload();

                })


            }else{
                bootbox.alert("<br><center><h4>提交失败："+e.msg+"</h4></center><br>");
            }
        }
    })
});