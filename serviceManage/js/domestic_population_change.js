/**
 * Created by alex on 2017/4/10.
 */
var customerKindEmnu={
	"1":"居民",
	"9":"非居民"
}
var PopulationChange= function(){
    var customerAddress ;
    var customerName;
    var customerKind;
    var customerTel;
    var customerCode;
    var occurrencetime;
    var idcard;
    var opertor = "";
    var pid;
    var linkman;
    var linktel;
    var remark;
    var bookingtime;
    var newjp;
    var filesid;
    var populationbefore;

    return {
        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
            this.initAction();
        },
        reload :function () {
            $('.file-loading').fileinput({
                language: 'zh'
            })
        },

        initAction:function () {
            $("#save_btn").on('click',function(){
            	var data =xw.getTable().getData(true);
			    if(!data.rows.length){
			    	data =xw.getTable().getData();
			    	if(!data.rows.length||data.rows.length>1){
			    		bootbox.alert("请选择一个客户");
			    		return;
			    	}
			    }
                pid=GasModService.getUuid();
				populationbefore=$("#population_before").val();
				if(!populationbefore){
					bootbox.alert("<br><center><h4>请先查询原家庭人口数</h4></center><br>");
			    	return;
				}
                occurrencetime = new Date().toLocaleString();
                var employee_name =JSON.parse(localStorage.getItem("user_info")).employee_name;
                if(employee_name){
                    opertor = employee_name;
                }else{
                    opertor = JSON.parse(localStorage.getItem("user_info")).userId;
                }
                
			   
                customerCode = data.rows[0].customerCode;
                customerAddress = data.rows[0].customerAddress;
                idcard =  data.rows[0].idcard;
                customerName =data.rows[0].customerName;
                customerKind =data.rows[0].customerKind;
                customerTel =data.rows[0].tel;
				newjp =$('#population').val();
                console.log(customerKind)
				if(!newjp){
					bootbox.alert("<br><center><h4>请选择变更家庭人口数</h4></center><br>");
			    	return;
				}
				 var householdRegister = $("#householdRegister").val();
			    if(!householdRegister){
			    	bootbox.alert("<br><center><h4>请填写户口本号</h4></center><br>");
			    	return;
			    }
			    
			    var printcontent = {
			    	"occurrencetime":occurrencetime,
			    	"opertor":opertor,
			    	"customtype":("客户类型: " + customerKindEmnu[customerKind]),
			    	"customercode":("客户号: " + customerCode),
			    	"customname":("客户姓名: " + customerName),
			    	"customtel":("电话: " + customerTel),
			    	"customic":("证件号码: " + idcard),
			    	"customaddress":("地址: " + customerAddress),
			    	"population":("原家庭人口数: " + populationbefore),
			    	"populationbefore":("变更家庭人口数: " + newjp),
			    	"businessname":"家庭人口数变更"
			    }
			    var parameter={
			    	"businesstype":"jtrksbg",
			    	"pid":pid,
			    	"printcontent":JSON.stringify(printcontent)
			    }
//              var parameter = {
//                  "businesstype":"jtrksbg",
//                  "printcontent":"{\"occurrencetime\":\""+occurrencetime+"\",\
//                  \"opertor\":\""+opertor+"\",\
//                  \"customtype\":\"" + "客户类型: " + customerKindEmnu[customerKind] + "\",\
//                  \"customercode\":\"" + "客户号: " + customerCode + "\",\
//                  \"customname\":\"" + "客户姓名: " + customerName + "\",\
//                  \"customtel\":\"" + "电话: " + customerTel + "\",\
//                  \"customic\":\"" + "证件号码: " + idcard + "\",\
//                  \"customaddress\":\"" + "地址: " + customerAddress + "\",\
//                  \"population\":\"" + "原家庭人口数: " + populationbefore + "\",\
//                  \"populationbefore\":\"" + "变更家庭人口数: " + newjp + "\",\
//                  \"businessname\":\"家庭人口数变更\"}",
//                  "pid":""+pid+"",
//                  // "filesid": "" + filesid + ""
//              };

                if(filesid && filesid != undefined && filesid.length > 0){
                    parameter.filesid = filesid;
                }


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

            $("#find_population").click("on",function () {
                customerCode = $("#find_key").val();
                if(!customerCode){
                    bootbox.alert("<br><center><h4>请先查询用户编号</h4></center><br>");
                    return;
                }
                var postUrl="/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
                var postData=JSON.stringify({
                    cols:"b.population",
                    froms:"gasCtmArchive a,gasCtmHouse b ",
                    wheres:"a.houseId =b.house_id and a.customerCode='"+customerCode+"'",
                    page:"false",
                    limit:1
                });
                var retData =Restful.findPNQ(postUrl,postData);
                if(retData.rows){
                     var population =retData.rows[0].population;
                     if(population){
                         $("#population_before").val(population);
                     }else {
                         $("#population_before").val(0);
                     }
                }else{
                    bootbox.alert("<br><center><h4>系统没有查询到数据</h4></center><br>");
                }
            });

            $("#submit_btn").on('click',function(){
                var data =xw.getTable().getData(true);
			    if(!data.rows.length){
			    	data =xw.getTable().getData();
			    	if(!data.rows.length||data.rows.length>1){
			    		bootbox.alert("请选择一个客户");
			    		return;
			    	}
			    }
			    var householdRegister = $("#householdRegister").val();
			    if(!householdRegister){
			    	bootbox.alert("<br><center><h4>请填写户口本号</h4></center><br>");
			    	return;
			    }
			    
                customerCode = data.rows[0].customerCode;
                customerAddress = data.rows[0].customerAddress;;
                customerName =data.rows[0].customerName;
                customerKind =data.rows[0].customerKind;
                customerTel =data.rows[0].tel;
                remark =$("#remark").val();
                newjp =$('#population').val();
                if(gpypictureId){
                    filesid = fileId;
                }else{
                    filesid="";
                }

                var parameter = {
                    "customcode":""+customerCode+"",
                    "newjp":""+newjp+"",
                    "oldjp":""+$("#population_before").val()+"",
                    "filesid":""+filesid+"",
                    "remark":remark,
                    "householdregister":householdRegister,
                    "printid":pid
                }
                console.log(JSON.stringify(parameter));
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: '/hzqs/ser/pbcjp.do?fh=VFLSCGC000000J00&resp=bd',
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
            
            $("#householdRegister").blur(function(){
            	var householdRegister = $("#householdRegister").val();
            	if(!householdRegister){
            		bootbox.alert("<br><center><h4>请填写户口本号</h4></center><br>");
					return;
            	}
            	var householdRegisterRet = Restful.findNQ(hzq_rest+'gasctmhouse/?query={"householdRegister":"'+householdRegister+'"}');
				console.log(householdRegisterRet);
				if(householdRegisterRet&&householdRegisterRet.length>0){
					bootbox.alert("<br><center><h4>户口本号["+householdRegister+"]已被注册登记</h4></center><br>");
					$("#householdRegister").val("");
					return;
				}
            });
        }
    }
}()
