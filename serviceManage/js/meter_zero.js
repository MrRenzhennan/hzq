/**
 * Created by alex on 2017/4/17.
 */
ComponentsPickers.init();
SideBar.init();
SideBar.activeCurByPage("business_process.html");
var customerAddress ;
var customerName;
var customerKind;
var customerTel;
var occurrencetime;
var idcard;
var opertor;
var pid;
var bookingtime;
var linkman;
var linktel;
var remark;
var filesid;
var customerKindEmnu={
	"1":"居民",
	"9":"非居民"
}
// $('#bookingtime')
//     .datepicker()
//     .on('changeDate', function (ev) {
//
//         var myDate = new Date();
//         var now = myDate.valueOf();
//         var time = new Date($('#bookingtime').val()).valueOf();
//         if (now > time) {
//             $('#bookingtime').val("");
//             bootbox.alert("<br><center><h4>预约时间不能小于当前时期!</h4></center><br>");
//             return false;
//
//         }
//     });
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
    var data =xw.getTable().getData(true);
    if(!data.rows.length){
    	data =xw.getTable().getData();
    	if(!data.rows.length||data.rows.length>1){
    		bootbox.alert("请选择一个客户！");
    		return;
    	}
    }
    customerCode = data.rows[0].customerCode;
    customerAddress = data.rows[0].customerAddress;
    idcard =  data.rows[0].idcard;
    customerName =data.rows[0].customerName;
    customerKind =data.rows[0].customerKind;
    customerTel =data.rows[0].tel;
    linkman = $("#linkMan").val();
    linktel = $("#linktel").val();
    remark = $("#remark").val();
    bookingtime = $("#bookingtime").val();
    var parameter = {
        "businesstype":"zxbzzqlsl",
        "printcontent":"{\"occurrencetime\":\""+occurrencetime+"\",\
         \"opertor\":\""+opertor+"\",\
       \"customtype\":\"" + "客户类型: "+customerKindEmnu[customerKind] + "\",\
        \"customercode\":\"" +"客户号: "+ customerCode + "\",\
        \"customname\":\"" + "客户姓名: "+customerName + "\",\
        \"customtel\":\"" + "电话: "+customerTel + "\",\
         \"customic\":\"" + "证件号码: "+idcard + "\",\
        \"customaddress\":\"" + "地址: "+customerAddress + "\",\
          \"linkman\":\"" + "联系人: " + linkman + "\",\
        \"linktel\":\"" + "联系电话: " + linktel + "\",\
        \"bookingtime\":\"" + "预约时间: " + bookingtime + "\",\
        \"businessname\":\"在线表指针清零受理\"}",
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
    var data =xw.getTable().getData(true);
    if(!data.rows.length){
    	data =xw.getTable().getData();
    	if(!data.rows.length||data.rows.length>1){
    		bootbox.alert("请选择一个客户！");
    		return;
    	}
    }
    customerCode = data.rows[0].customerCode;
    customerAddress = data.rows[0].customerAddress;;
    customerName =data.rows[0].customerName;
    customerKind =data.rows[0].customerKind;
    customerTel =data.rows[0].tel;
    linkman =$("#linkMan").val();
    linktel =$("#linktel").val();
    remark =$("#remark").val();
    bookingtime =$('#bookingtime').val();


    if(gpypictureId){
        filesid = fileId;
    }else{
        filesid="";
    }
    console.log(fileId)
    var parameter = {
        "customcode":""+customerCode+"",
        "bookingtime":""+bookingtime+"",
        "linkman":""+linkman+"",
        "linktel":""+linktel+"",
        "remark":""+remark+"",
        "filesid":""+filesid+""
    }
    console.log(JSON.stringify(parameter));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/hzqs/ser/pbadp.do?fh=VFLSCGC000000J00&resp=bd',
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