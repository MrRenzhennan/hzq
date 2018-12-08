var href = document.location.href;
var stepid = Metronic.getURLParameter("stepid");//
var stepcode ="";
var userinfo = JSON.parse(localStorage.getItem('user_info'));
console.log(userinfo);
var area_id=userinfo.area_id;
var areas = new Array();
areas.push(area_id);
var LsksAction = function() {
    return {
        
        agreeBtn:   $('#agree_btn'),
        unagreeBtn:   $('#unagree_btn'),
        backBtn:   $('#back_btn'),
        bookCode: $('#bookCode'),
        //isbook: $('#isbook'),
        init:function(){ 
          
            if(stepid==""){
               window.location.replace("index.html"); 
            }
            this.getTask();
            this.bind();   
        },
        bind:function(){ 
            //this.isbook.hide();
            this.agreeBtn.on('click',this.agree);
            this.unagreeBtn.on('click',this.unagree);
            this.backBtn.on('click',this.back);
            this.bookCode.on('change',this.getBook);
        },
         
        agree:function(){ 
            LsksAction.postSubmit("0");
            
        },
        unagree:function(encrypted){ 
            
            LsksAction.postSubmit("1");
            
        },
        getBook:function(){
             
            var bookCodeVal = $("#bookCode").val();
            $("#serviceper").val('');
            $("#countper").val('');
            $("#serviceperId").val('');
            $("#countperId").val('');
            $.ajax({
                url:"/hzqs/hzqrest/gasmrdbook/? fields={\"bookCode\":1}&query={\"bookCode\":\""+bookCodeVal+"\"}",
                method: "get",
                dataType:"json",
                success: function (data) {
                    if (data && data.length >0) {
                        // console.log(data);
                        // alert(data[0].bookCode)
                        $("#bookCode").val(data[0].bookCode);
                        var userNameHelper=RefHelper.create({
                            ref_url:"gassysuser",
                            ref_col:"userId",
                            ref_display:"employeeName",
                        });

                        $("#serviceper").val(userNameHelper.getDisplay(data[0].serviceperId));
                        $("#countper").val(userNameHelper.getDisplay(data[0].countperId));
                        $("#serviceperId").val(data[0].serviceperId);
                        $("#countperId").val(data[0].countperId);
                    }
                }

            });
            
        },
        back:function(encrypted){ 
            
            window.location.replace("index.html"); 
            
        },
        postSubmit:function(val){ 
            var bookidtemp ="";
            var bookCode= $("#bookCode").val();
            if(val=="0"&&stepcode=="START"){
                if(bookCode==""){
                    bootbox.alert("抄表本编号不能为空");
                    return;
                }
                bookidtemp = "=-=-="+bookCode;//*=-=*分隔符
            }
            var radiovar = $('input:radio:checked').val();
            var strjson = $('#agreereason').val() +"(" +radiovar+ ")"+bookidtemp;
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
                                bootbox.alert("流程提交成功...", function () {
                                    window.location.replace("index.html");                              
                                })
                            }else{
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
                    var retstr = JSON.stringify(data.retstr);
                    console.log("retstr="+retstr);
                    var obret =  JSON.parse(JSON.parse(retstr));
                    var paramData = obret.param;
                    var customecode  =obret.customcode;
                    stepcode = obret.stepcode;
                    if(stepcode=="START"){
                        $("#isbook").show();
                        if(paramData.bookcode){
                        	$("#bookCode").val(paramData.bookcode);
                        	LsksAction.getBook();
                        }
                    }
                    // basic info start
                    $('#customerCode').val(paramData.customercode);
                    $('#customerName').val(paramData.customername);
                    $('#unboltCode').val(paramData.unboltcode);
                    $('#unboltCode').text(paramData.unboltcode);
                    $('#projectAddress').val(paramData.projectaddress);
                    if(paramData.customerkind=="1"){
                    	$('#customerKind').val("居民");
                    	$('#queryunbolt2').css("display","none");
                    }else{
                    	$('#customerKind').val("非居民");
                    	$('#queryunbolt').css("display","none");
                    }
                    if(!paramData.unboltcode||paramData.unboltcode==""||paramData.unboltcode=="undefined"||paramData.unboltcode==undefined){
                    	$('#queryunbolt2').css("display","none");
                    	$('#queryunbolt').css("display","none");
                    	$('#unbolt').hide();
                    }
                    $('#userTel1').val(paramData.customertel);
                    $('#idCard').val(paramData.idcard);
                    $('#btName').val(obret.btName);
                    $('#customerAddress').val(paramData.customeraddress);
                    // basic info end

                    //business info start
                    $('#linkman').val(obret.linkman);
                    $('#linkphone').val(obret.linkphone);
                    $('#remark').val(obret.remark);
                    $('#reformed').val(obret.reformed);
                    $('#stepid').val(obret.stepInstId);
                    $('#con').html(obret.con);
                    var busid = obret.files;
                    //business info start
                    pic(busid);
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
                    var param = {
                        "cols": "book_id,book_code",
                        "froms": "gas_mrd_book",
                        "wheres": "book_type='"+paramData.customerkind+"' and area_id in (" + areas + ")",
                        "page": false
                    };
                    $.ajax({
                        type: 'get',
                        url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(param),
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        success: function (data) {
                            console.log(data);
                            var obj = $("#bookCode")
                            var sHtmlTest = "";
                            for (var o in data.rows) {
                                var listText = data.rows[o].bookCode;
                                // var listValue = data.rows[o].bookId;
                                sHtmlTest += "<option value='" + listText + "'>" + listText + "</option>";
                            }
                            obj.append(sHtmlTest);
                        }
                    });
                } 
            });
        }
    };
}();

$('#queryunbolt').on('click', function (e) {
	var unboltNo = $("#unboltCode").text();
	var unboltId;
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        url: hzq_rest + 'gascsrunbolt?query={"unboltNo":"' + unboltNo+'"}',
        dataType: 'json',
        async: false,
        data: "",
        success: function (data) {
        	if(!data){
        		return;
        	}
        	console.log(data)
            var areaHelper=RefHelper.create({
                ref_url:"gasbizarea",
                ref_col:"areaId",
                ref_display:"areaName",
            });
            var json = eval(data[0]);
            $("#unbolt_no").val(json.unboltNo);
            $("#project_no").val(json.projectNo);
            var projectDate=json.projectDate
            if(projectDate){
                $("#project_date").val(projectDate.substring(0,10));
            }
			unboltId=json.unboltId;
            $("#project_name").val(json.projectName);
            $("#find_area").val(areaHelper.getDisplay(json.areaId));
            $("#link_man").val(json.linkMan);
            $("#link_tel").val(json.linkTel);
            $("#build_unit").val(json.buildUnit);
            $("#projectType").val("民用");
            $("#project_address").val(json.projectAddress);
            if(json.fileId){
                $("#picture").css("display","block");
                pic(json.fileId);
            }else{
                $("#picture").css("display","none")
            }

        },
        error: function(err) {
            //console.log("error:"+JSON.stringify(err))
            if( err.status==401){
                //need to login
                if(window.location.pathname.indexOf('/login.html')<0)
                {
                    window.location.replace("/login.html?redirect="+window.location.pathname);
                }

            }

        }
    });
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        async: false,
        url: hzq_rest + 'gascsrunboltrsdtdetail/?query={"unboltId":"' + unboltId + '"}',
        dataType: 'json',
        data: "",
        success: function (data) {
            console.log(data);
            var json = eval(data);
            var totalPerson = 0;
            $('#unboltDetail').html('');
            for (var i = 0; i < json.length; i++) {
                $('#unboltDetail').append('<tr>' +
                    '<td>' + json[i].floorNum + "号楼" + '</td>' +
                    '<td>' + json[i].roomCount + '</td>' +
                    '</tr>'
                );
                totalPerson += json[i].roomCount;
                $('#totalPerson').text("总户数:" + totalPerson);
            }
        }
    });
})
$('#queryunbolt2').on('click', function (e) {
	var unboltNo = $("#unboltCode").text();
	var unboltId;
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        async: false,
        url: hzq_rest + 'gascsrunbolt?query={"unboltNo":"' + unboltNo+'"}',
        dataType: 'json',
        data: "",
        success: function (data) {
        	if(!data){
        		return;
        	}
            var areaHelper=RefHelper.create({
                ref_url:"gasbizarea",
                ref_col:"areaId",
                ref_display:"areaName",
            });

            console.log(data);
            var json = eval(data[0]);
            $("#unbolt_no2").val(json.unboltNo);
            $("#project_no2").val(json.projectNo);
            var projectDate=json.projectDate
            if(projectDate){
                $("#project_date2").val(projectDate.substring(0,10));
            }
			unboltId=json.unboltId;
            $("#project_name2").val(json.projectName);
            $("#find_area2").val(areaHelper.getDisplay(json.areaId));
            $("#link_man2").val(json.linkMan);
            $("#link_tel2").val(json.linkTel);
            $("#build_unit2").val(json.buildUnit);
            var projectType = json.projectType;
            if (projectType == 1) {
                $("#projectType2").val("工业");
            }
            if (projectType == 2) {
                $("#projectType2").val("商服");
            }
            if (projectType == 3) {
                $("#projectType2").val("公益");
            }
            if (projectType == 4) {
                $("#projectType").val("锅炉");
            }
            if (projectType == 5) {
                $("#projectType2").val("福利");
            }
            $("#project_address2").val(json.projectAddress);

            if(json.fileId){
                $("#picture2").css("display","block");
                pic(json.fileId);
            }else{
                $("#picture2").css("display","none")
            }


        }

    })
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        async: false,
        url: hzq_rest + 'gascsrunboltnorsdtdetail/?query={"unboltId":"' + unboltId + '"}',
        dataType: 'json',
        data: "",
        success: function (data) {
            var gasTypeHelper=RefHelper.create({
                ref_url:"gasbizgastype",
                ref_col:"gasTypeId",
                ref_display:"gasTypeName"
            });
            console.log(data);
            var json = eval(data);
            var totalCount = 0;
            var totalCapacity = 0;
            $('#unboltDetail2').html('');
            for (var i = 0; i < json.length; i++) {
                $('#unboltDetail2').append('<tr>' +
                    '<td>' + gasTypeHelper.getDisplay(json[i].gasTypeId) + '</td>' +
                    '<td>' + json[i].capacity + '</td>' +
                    '<td>' + json[i].mtrCount + '</td>' +
                    // '<td>' + '<input type="text" class="form-control" placeholder="输入抄表本号">' + '</td>' +
                    '</tr>'
                );
                totalCount += json[i].mtrCount;
                totalCapacity += json[i].capacity;
                $('#totalCapacity2').text("总流量:" + totalCapacity);
                $('#totalCount2').text("总数量:" + totalCount);

            }

        }

    });
})
