/**
 * Created by anne on 2017/5/19.
 */

jQuery(document).ready(function() {
    apply.init();

});
var xwdata;
var customerAddress ;
var customerName;
var customerKind;
var customerCode;
var customerTel;
var idcard;
var occurrencetime;
var opertor;
var pid;
var applyreason;
var socialaccount;
var specialtype;
var filesid;
var customerKindEmnu={
	"1":"居民",
	"9":"非居民"
}

apply = function(){
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
                    restbase: 'gascsrlowincome/?query={"status":"1"}',
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
                        querys.push(RQLBuilder.equal("status" , "1"));
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
                            	//console.log(data.rows[0])
                            	//console.log(data.rows[0].lowerProtection)
                                $("#divtable").css("display","none");
                                var accountNo =data.rows[0].bankAccount;
                                var perNo = data.rows[0].population;
                                var nameNo = data.rows[0].name;
                                var lower =data.rows[0].lowerProtection;
                                var stateNo =data.rows[0].status;
                                var baoNo = data.rows[0].socialAccount;
                                var idcard1 = data.rows[0].identity;
                                $("#idcardNo").val(idcard1);                                
                                $("#baoNo").val(baoNo);
                                $("#accountNo").val(accountNo);
								$("#perNo").val(perNo);
								$("#nameNo").val(nameNo);
								console.log(stateNo)
                                $("#specificType").val(lower);
								//判断 特殊用户类型 1 2 3 已绑定  其他为正常
								if(lower=="1"){
									$("#specificTypeName").val('低保');	
								}else if(lower=="2"){
									$("#specificTypeName").val('低收入');
								}else if(lower=="3"){									
									$("#specificTypeName").val('低困'); 
								}else{
									$("#specificTypeName").val('正常');								
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
                                
                                $.ajax({
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    type: 'get',
                                    //url: hzq_rest + 'gasctmspecific',
                                    url: hzq_rest + 'gasctmspecific?query={"socialAccount":\"'+baoNo+'\"}&page=true&skip=0&sort=-createdTime' ,
                                    async: false,
                                    success: function (data) {  
                                        console.log(data);                                          
                                        if(data.rows&&data.rows[0].status=="1"){
                                            $("#show").html('');    
                                            $("#show").prepend('该用户与客户编号['+data.rows[0].customerCode+']绑定')                                                                                            
                                        }else if(data.rows&&data.rows[0].status=="0"){
                                            $("#show").html('');    
                                            $("#show").prepend('该用户上次与客户编号['+data.rows[0].customerCode+']绑定,当前已经解绑,可以使用')                                                                                                                                                                                         
                                        }else{
                                            $("#show").html('');    
                                            $("#show").prepend('该用户从未绑定')   
                                            
                                        }
                                    }
                                })
                            }
                        });
                        return "";
                        
                    }
                });
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

	xwdata =xw.getTable().getData(true);
    if(!xwdata.rows.length){
    	xwdata =xw.getTable().getData();
    	if(!xwdata.rows.length||xwdata.rows.length>1){
    		bootbox.alert("请选择一个客户");
    		return;
    	}
    }
    
    customerCode = xwdata.rows[0].customerCode;
    customerAddress = xwdata.rows[0].customerAddress;
    customerName = xwdata.rows[0].customerName;
    customerKind = xwdata.rows[0].customerKind;
    customerTel =xwdata.rows[0].tel;
    var idcardNo = $("#idcardNo").val();                                
    var baoNo = $("#baoNo").val();
    var accountNo = $("#accountNo").val();
	var perNo = $("#perNo").val();
	var nameNo = $("#nameNo").val();
	var stateNo = $("#stateNo").val();
	var specificTypeName = $("#specificTypeName").val();
    if(!customerTel){
    	customerTel="";
    }
    idcard = xwdata.rows[0].idcard;
    if(!idcard){
    	idcard="";
    }
    applyreason=$("#remark").val();
    if(!applyreason){
    	applyreason="";
    }
    var parameter = {
        "businesstype": "tsyhyhsq",
        "printcontent": "{\"occurrencetime\":\"" + occurrencetime + "\",\
         \"opertor\":\"" + opertor + "\",\
        \"customtype\":\"" + "客户类型: "+customerKindEmnu[customerKind] + "\",\
        \"customercode\":\"" +"客户号: "+ customerCode + "\",\
        \"customname\":\"" + "客户姓名: "+customerName + "\",\
        \"customtel\":\"" + "电话: "+customerTel + "\",\
         \"customic\":\"" + "证件号码: "+idcard + "\",\
        \"customaddress\":\"" + "地址: "+customerAddress + "\",\
        \"baoNo\":\"" + "保障号: "+baoNo + "\",\
        \"idcardNo\":\"" + "身份证号码: "+idcardNo + "\",\
        \"specificTypeName\":\"" + "特殊用户类型: " + specificTypeName + "\",\
        \"stateNo\":\"" + "状态: " + stateNo + "\",\
        \"accountNo\":\"" + "银行卡号: " + accountNo + "\",\
        \"perNo\":\"" + "人口数: " + perNo + "\",\
        \"nameNo\":\"" + "姓名: " + nameNo + "\",\
        \"businessname\":\"特殊用户优惠申请\"}",

        "pid": "" + pid + ""
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
                })
            }else{
                bootbox.alert("<br><center><h4>保存失败！</h4></center><br>");
            }
        }
    })
});
$("#print_btn").on('click',function(){
	var urll = 'http://127.0.0.1:9000/';
    var data = {
        "cmdheader": {
            "cmdtype": "17"
        },
        "param": {
            "data": [{"ptid": pid}]
        }
    };
    $.ajax({
		type: 'get',
		url: urll,
		async: false,
		dataType: "JSONP",
		data:"data=" + JSON.stringify(data),
		jsonp: "callfuncname",
		success: function (ret) {
			console.log(ret)
			if (ret.result.resultcode == "0") {
				bootbox.alert("<br><center><h4>打印成功！</h4></center><br>",function(){
                    $('#print_btn').addClass('disabled');
                    $('#submit_btn').removeClass('disabled');
		    })
			}else {
		        bootbox.alert("<br><center><h4>打印失败！</h4></center><br>");
		    }
	    },
	    error:function(e){
	   		console.log(e)
	    }
	})
});
$("#submit_btn").on('click',function(){
    if(gpypictureId){
        filesid = fileId;
    }else{
        filesid="";
    }
    xwdata =xw.getTable().getData(true);
    if(!xwdata.rows.length){
    	xwdata =xw.getTable().getData();
    	if(!xwdata.rows.length||xwdata.rows.length>1){
    		bootbox.alert("请选择一个客户！");
    		return;
    	}
    }
    
    customerCode = xwdata.rows[0].customerCode;
    customerAddress = xwdata.rows[0].customerAddress;
    customerName = xwdata.rows[0].customerName;
    customerKind = xwdata.rows[0].customerKind;
    customerTel =xwdata.rows[0].tel;
    if(!customerTel){
    	customerTel="";
    }
    idcard = xwdata.rows[0].idcard;
    if(!idcard){
    	idcard="";
    }
    applyreason=$("#remark").val();
    if(!applyreason){
    	applyreason="";
    }
    socialaccount =$('#baoNo').val();
    specialtype =$('#specificType').val();
    var parameter = {
        "nameno":$("#nameNo").val(),
        "perno":$("#perNo").val(),
        "accountno":$("#accountNo").val(),
        "customcode":""+customerCode+"",
        "customname":customerName,
        "customtel":customerTel,
        "idcardno":idcardNo,
        "socialaccount":""+socialaccount+"",//保障号
        "specialtype":""+specialtype+"",//特殊类型
        "remark":""+applyreason+"",
        "filesid":""+fileId+"",
        "printid":pid

    }
    console.log(JSON.stringify(parameter));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/hzqs/ser/pbssa.do?fh=VFLSCGC000000J00&resp=bd',
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