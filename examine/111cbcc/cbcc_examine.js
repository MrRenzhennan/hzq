var CBCCAction=function(){
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            console.log(step);
            var retstr = JSON.stringify(step.propstr2048);
            console.log("retstr="+retstr);

            var obret = JSON.parse(JSON.parse(retstr));
            var jdata = obret.flow_data;
            var mresult = Restful.findNQ(hzq_rest+"gasmrdmeterreading/"+jdata.meterReadingId);
            console.log(jdata);
            console.log(mresult);
            $('#box_ic_money').hide();
            $('#box_ic_measure').hide();
            $('#box_ic_reading').hide();
            $('#box_revise_no').hide();
            $('#box_revise_reading').hide();
            $('#box_revise_vbvbt').hide();
            $('#box_last_ic_reading').hide();
            $('#box_last_ic_measure').hide();
            $('#box_last_ic_money').hide();
            $('#box_last_revise_reading').hide();
           // var jdata = flowdata.flow_data;
            /*if(jdata.smeter !=='undefined' ){
                if(jdata.smeter == '1'){//定燃气表
                    $('#box_revise_no').hide();
                    $('#box_revise_reading').hide();
                    $('#box_revise_vbvbt').hide();

                    $('#box_last_revise_reading').hide();

                }else if(jdata.smeter == '2'){//定修正表
                    $('#box_revise_no').show();
                    $('#box_revise_reading').show();
                    $('#box_revise_vbvbt').show();

                    $('#box_last_revise_reading').show();
                }else if(jdata.smeter == '3'){//两个表都定
                    $('#box_revise_no').show();
                    $('#box_revise_reading').show();
                    $('#box_revise_vbvbt').show();

                    $('#box_last_revise_reading').show();

                }
            }*/
            if(jdata.customerType == 'I' || jdata.customerType == 'i'){//是不是IC卡表
                $('#box_ic_reading').show();
                $('#box_ic_measure').show();
                $('#box_ic_money').show();
                $('#box_last_ic_reading').show();
                $('#box_last_ic_measure').show();
                $('#box_last_ic_money').show();
            }

            $('#customerCode').val(jdata.customerCode);
            $('#customerName').val(jdata.customerName);
            $('#customerKind').val(jdata.customerKind);
            $('#customerAddress').val(mresult.address);
            $('#userTel1').val(jdata.linkPhone);
            $('#linkman').val(jdata.linkMan);
            $('#linkphone').val(jdata.linkPhone);
            $('#setMeter').val(jdata.smeter);
            $('#meterNo').val(jdata.meterNo);
            $('#lastMeterReading').val(mresult.lastMeterReading);
            $('#meterReading').val(mresult.meterReading);
            var result = Restful.findNQ(hzq_rest + 'gasctmarchive/?query={"customerCode":"'+jdata.customerCode+'"}')
            console.log(result[0].ctmarchiveId)
            if(jdata.customerKind=='1'){
                // $('#customerKind').val("居民");
                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue information\"  data-kind='" + JSON.stringify(result[0])+"' href=\"javascript:;\">客户详细信息</a>");
                $('#navtab li').data({
                    'ctmArchiveId': result[0].ctmArchiveId,
                    'customerCode': result[0].customerCode,
                    'customerKind': "1"
                });
            }else{
                // $('#customerKind').val("非居民");
                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue noninformation\" data-kind='" + JSON.stringify(result[0])+"' href=\"javascript:;\">客户详细信息</a>");
                $('#navtab1 li').data({
                    'ctmArchiveId': result[0].ctmArchiveId,
                    'customerCode': result[0].customerCode,
                    'customerKind': "9",
                });
            }

            $('#reviseNo').val(jdata.reviseMeterNo);
            $('#reviseReading').val(mresult.reviseReading);
            $('#lastReviseReading').val(mresult.lastReviseReading);
            $('#idCard').val(jdata.idcard);
            $('#vbVbt').val(jdata.vbVbt);
            $('#lastaccountgasnum').val(mresult.lastAccumulatedGas);
            $('#lastremaingasnum').val(mresult.lastRemaingAsnum);
            $('#lastcardbalanceesum').val(mresult.lastCardBalancEsum);
            $('#accountgasnum').val(mresult.accumulatedGas);
            $('#remaingasnum').val(mresult.remaingAsnum);
            $('#cardbalanceesum').val(mresult.cardBalancEsum);
            $('#feedback').val(mresult.feedback);
            $('#remark').val(mresult.remark);
            $('#bookCode').val(mresult.bookCode);
            $('#serviceper').val(mresult.serviceperId);
            $('#countper').val(mresult.countperId);
            $('#chargeMeterReading').val(mresult.chargeMeterReading);
            pic(jdata.meterReadingId);
           meterReadingId = jdata.meterReadingId;
        }
    }
}();
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var refundId;
var duNest = function(step){
    if(result){//请求被驳回--置为 删除状态

        var uuid =  GasModService.getUuid();
        var param= {
            "meterReadignId":uuid,
            "copyState":"9",//标记为删除
            "modifiedTime":new Date(),
            "modifiedBy":userinfo.userId
        }
        var ret = Restful.update(hzq_rest+"gasmrdmeterreading",meterReadingId,param);

    }
}
var doBusi = function(step){
    if(result){//请求被驳回--置为 删除状态

        var uuid =  GasModService.getUuid();
        var param= {
            "meterReadignId":uuid,
            "copyState":"9",//标记为删除
            "modifiedTime":new Date(),
            "modifiedBy":userinfo.userId
        }
        var ret = Restful.update(hzq_rest+"gasmrdmeterreading",meterReadingId,param);

    }else{
   // alert(1);
     console.log(step);
        console.log(meterReadingId);
        var param = {
            "meterReadingId":meterReadingId,
            "copyState":"4",//数据分析完成
            "isBll":"0",
            "modifiedTime":new Date(),
            "modifiedBy":userinfo.userId
        }
        var ret = Restful.update(hzq_rest+"gasmrdmeterreading",meterReadingId,param);
        if(!ret){
            bootbox.alert("更新抄表差错信息失败");
        }
    }
}


/*
var href = document.location.href;
//var stepid = Metronic.getURLParameter("stepid");//
var stepid = Metronic.getURLParameter("stepid");
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
                    $('#customerKind').val(obret.customerKind);
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
                    var busid = obret.files;
                    pic(busid);
                    //---
                    
                     
                    //business info start

                } 
            });
        }
    };
}();*/
