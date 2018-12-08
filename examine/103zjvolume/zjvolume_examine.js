var href = document.location.href;
var stepid = Metronic.getURLParameter("stepid");//
var customerKindEmnu={
    "1":"居民",
    "9":"非居民"
}
var ZJRAction = function() {
    return {
        
        agreeBtn:   $('#agree_btn'),
        unagreeBtn:   $('#unagree_btn'),
        backBtn:   $('#back_btn'),
         
 
        init:function(){ 
          
            if(stepid==""){
               window.location.replace("index.html"); 
            }
            this.getTask();
            this.bind();   
        },
        bind:function(){ 
            this.agreeBtn.on('click',this.agree);
            this.unagreeBtn.on('click',this.unagree);
            this.backBtn.on('click',this.back);
        },
         
        agree:function(){ 
            ZJRAction.postSubmit("0");
            
        },
        unagree:function(encrypted){ 
            
            ZJRAction.postSubmit("1");
            
        },
        back:function(encrypted){ 
            
            window.location.replace("index.html"); 
            
        },
        postSubmit:function(val){ 
            var radiovar = $('input:radio:checked').val();
            var strjson = $('#agreereason').val() +"(" +radiovar+ ")";
            bootbox.confirm("确定提交吗?", function(result) {
                if(result===false){
                   
                }else {
                    $.ajax({
                        url: '/hzqs/pck/pbpsb.do?fh=VFLSCGC000000J00&bd={}&resp=bd',
                        
                        type: 'POST',
                        dataType:'json',
                        contentType:"application/json; charset=utf-8",
                        data: JSON.stringify({"stepid": $('#stepid').val(), "subtype":val ,"strjson": strjson}),
                        async:false,
                        success:function(data, textStatus, xhr) {
                            console.log("data="+JSON.stringify(data));
                            if(data.err_code && data.err_code == "1"){
                                //bootbox.alert("流程提交成功..."); 
                                bootbox.alert("流程提交成功...", function () {

                                    window.location.replace("index.html");
                                
                                })
                              //  window.location.replace("index.html");
                            }else{
                                //bootbox.alert("流程提交失败..."); 
                                bootbox.alert("流程提交失败...", function () {

                                    window.location.replace("index.html");
                                
                                })
                            }

                        } 
                    });
                }
            }); 
            
        },
        getTask:function(){ 
            $.ajax({
                url: '/hzqs/pck/pbpg1.do?fh=VFLSCGC000000J00&bd={}&resp=bd',
                
                type: 'POST',
                dataType:'json',
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify({"stepid": stepid}),
                async:false,
                success:function(data, textStatus, xhr) {
                    console.log("data="+JSON.stringify(data));
                    if(data.err_code && data.err_code == "0"){
                        bootbox.alert(data.msg, function () {

                            window.location.replace("index.html");
                        
                        })
                    }
                    if(data.err_code && data.err_code == "0"){
                        bootbox.alert(data.msg, function () {

                            window.location.replace("index.html");
                        
                        })
                    }
                    var retstr = JSON.stringify(data.retstr);
                    console.log("retstr="+retstr);
                    var obret =  JSON.parse(JSON.parse(retstr));
                    var customecode  =obret.customcode;
                    // basic info start
                    $('#customerCode').val(obret.customerCode);
                    $('#customerName').val(obret.customerName);
                    $('#customerKind').val(customerKindEmnu[obret.customerKind]);
                    var result = Restful.findNQ(hzq_rest + 'gasctmarchive/?query={"customerCode":"'+obret.customerCode+'"}')
                    console.log(result[0].ctmarchiveId)
                    if(obret.customerKind=='1'){
                        $("#customerMation").html("<a class=\"btn btn-md btn-circle blue information\"  data-kind='" + JSON.stringify(result[0])+"' href=\"javascript:;\">客户详细信息</a>");
                        $('#navtab li').data({
                            'ctmArchiveId': result[0].ctmArchiveId,
                            'customerCode': result[0].customerCode,
                            'customerKind': "1"
                        });
                    }else{
                        $("#customerMation").html("<a class=\"btn btn-md btn-circle blue noninformation\" data-kind='" + JSON.stringify(result[0])+"' href=\"javascript:;\">客户详细信息</a>");
                        $('#navtab1 li').data({
                            'ctmArchiveId': result[0].ctmArchiveId,
                            'customerCode': result[0].customerCode,
                            'customerKind': "9",
                        });
                    }
                    $('#userTel1').val(obret.userTel1);
                    $('#idCard').val(obret.idCard);
                    $('#btName').val(obret.btName);
                    $('#customerAddress').val(obret.customerAddress);
                    // basic info end

                    //business info start
                    $('#linkman').val(obret.linkman);
                    $('#linkphone').val(obret.linkphone);
                    $('#stepid').val(obret.stepInstId);
                    $('#remark').val(obret.remark);
                    $('#con').html(obret.con);
                    //---
                    $('#zjtypename').val(obret.zjtypename);
                    var busid = obret.files;
                    pic(busid);
                    
                    //business info start

                } 
            });
        }
    };
}();