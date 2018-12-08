/**
 * Created by Reid on 25/11/16.
 */
var userinfo = JSON.parse(localStorage.getItem('user_info'));
console.log(userinfo)
var Index = function(){
   // var todoTaskUrl = "/hzqs/tak/pbgtl.do?fh=LINLIO0000000J00&resp=bd";
    var todoTaskList = "/hzqs/flw/pbtk0.do?fh=TK0FLW0000000J00&resp=bd";
    var doneTaskList = "/hzqs/flw/pbtk5.do?fh=TK5FLW0000000J00&resp=bd";
    return {

        noticeView:$("#notice_view"),
        mainView:$("#main_view"),

        init:function(){
            
            this.bingdem();
//          Index.loadToDoTask();
//          Index.loadDoneTask();

            setInterval(this.loadToDoTask, 10000);  
        },

        bingdem:function(){ 
           // $("#divtable2").hide();
            if($("#__todolist").attr('id') != undefined){
                dust.loadSource( dust.compile($("#__dust_todolist").html(),"todo"));
            }
            if($("#__donelist").attr('id') != undefined){
                dust.loadSource( dust.compile($("#__dust_donelist").html(),"done"));
            } 
 
             
        },
        loadToDoTask: function() {
            $.ajax({
                type: 'post',
                url: todoTaskList,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({"tasktype": "1"}),
                async: false,
                success: function(data, textStatus, xhr) {
                   console.log(data);
                     var debuglog = JSON.stringify(data);
                    if(data.err_code && data.err_code == "1"){
                        $("#divtable11_1").show();
                        $("#divtable11_2").hide();

                        var result = data.listinfo;

                        if($("#__todolist").attr('id') != undefined){
                            dust.render("todo", { "data":result}, function(err, out) {                          
                            $("#__todolist").html(out);         
                            });
                        }
                    }else if (data.err_code && data.err_code == "2"){
                        $("#divtable11_1").hide();
                        $("#divtable11_2").show();
                        
                        $("#errmsg").html("--没有审批任务--");
                        //$("#norowsdiv").show();
                    }else if(data.err_code && data.err_code == "0"){
                        $("#divtable11_1").hide();
                        $("#divtable11_2").show();
                        
                        $("#errmsg").html(data.msg);
                    }
                   
                }
            });
        },
        loadDoneTask: function() {
            $.ajax({
                type: 'POST',
                url: doneTaskList,
                dataType: 'json',
                data: JSON.stringify({"tasktype": "3","count":"20"}),
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(data, textStatus, xhr) {
                    console.log(data);
                     console.log("data="+JSON.stringify(data));
                    if(data.err_code && data.err_code == "1"){
                        var result = data.listinfo;
                      
                        if($("#__donelist").attr('id') != undefined){
                            dust.render("done", { "data":result}, function(err, out) {                          
                            $("#__donelist").html(out);         
                            });
                        }
                    }
                   
                }
            });
        },

        

        noticeViewCloseClick:function(){
            Index.noticeView.fadeOut(500,'swing');
            Index.mainView.delay(300).fadeIn(1000);
        },
        showNews:function(noticeId){
            NoticeView.loadNoticeData(noticeId);
            Index.mainView.fadeOut(500,'swing');
            Index.noticeView.delay(300).fadeIn(1000);
        },
    };
}();
var xw,xw1;
var instanceAction = function () {
    var user = JSON.parse(localStorage.getItem("user_info"));
    var loginName;
    if(user.login_name){
        loginName =user.login_name;
    }else{
        loginName = UserInfo.userId();
    }
console.log(user)

    var bd1 = {
        "cols": " area_id ",
        "froms": " gas_biz_area start with area_id = '"+user.area_id+"'connect by  prior  area_id = parent_area_id "
    }
    var bd2 = {
        "cols": " b.role_code ",
        "froms": " gas_sys_user_role a,gas_sys_role b ",
        "wheres": "  user_id='"+UserInfo.userId()+"' and a.role_id=b.role_id ",
    }
    var areaData = Restful.findNQ('/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd1));
    var arr1 = [];
    $.each(areaData.rows, function (key, val) {
            arr1.push("'"+val.areaId+"'");
    })

    var roleData = Restful.findNQ('/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd2));
    var arr2 = [];
    $.each(roleData.rows, function (key, val) {
        arr2.push("'"+val.roleCode+"'");
    })

    var cols = "flow_def_id as id,prop2str64,gs_chcode,step_status,operator,create_time,flow_def_id as operate," +
        "fetch_time,submit_time, results,step_inst_id,ref_no" ;
	//待办
    var bd = {
        "cols": cols,
        "froms": " (select * from psm_step_inst  where node_type='1' and ((step_status='1' and operator='AUTO') or (step_status='2' and operator='"+UserInfo.userId()+"')) and be_orgs in ("+arr1.join()+") and be_role in  ("+arr2.join()+")) a, " +
        " (select * from psm_step_auth where user_id ='"+UserInfo.userId()+"') b ",
        "wheres":" (a.be_role=b.role_code and a.be_orgs=b.area_id) or (a.be_role!=b.role_code) order by flow_def_id ,create_time asc ",
        "page":"true",
        "limit":50
    };
    var checkbd = {
        "cols": "*",
        "froms": "psm_step_auth",
        "wheres":"user_id ='"+UserInfo.userId()+"'",
        "page":"true",
        "limit":50
    };

    var result = Restful.findNQ('/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(checkbd));
    if(result && result.rows){
		console.log("have auth")
    }else{
		console.log("no auth")
        bd = {"cols":cols,
            "froms":"psm_step_inst" ,
            "wheres":" node_type='1' and ((step_status='1' and operator='AUTO') or (step_status='2' and operator='"+UserInfo.userId()+"')) and be_orgs in ("+arr1.join()+") and be_role in ("+arr2.join()+") order by flow_def_id ,create_time asc ",
            "page":"true",
            "limit":50};
    }
	
	//已办
	var  bdReload1 = {"cols":cols,
        "froms":"psm_step_inst" ,
        "wheres":"step_status in('5','8') and node_type='1' and operator = '"+userinfo.userId+"' order by flow_def_id ,create_time asc ",
        "page":"true",
        "limit":50};



    var operateFormat = function () {
        return {
            f : function (val,row) {
                var pathHelper=RefHelper.create({
                    ref_url:"psmflowdef",
                    ref_col:"flowDefId",
                    ref_display:"flDesc",
                });
                var path = pathHelper.getDisplay(row["id"])
                if(path.indexOf("?")<0){
                    path+="?";
                }else{
                    path += "&";
                }
                var stepId = path+"stepid=" + row["stepInstId"] + "&refno="+row["refNo"];
                return "<a href="+stepId+">处理</a>";
            }
        }

    }();

    var userHelper=RefHelper.create({
        ref_url:"gassysuser",
        ref_col:"userId",
        ref_display:"employeeName",
    });
    var userHelperFormat=function () {
        return{
            f:function(val,row){
                if(val =='AUTO'){
                    return row["gsChcode"]
                }else{
                    return userHelper.getDisplay(val)
                }

            }
        }
    }();
 
    var userHelper1Format=function () {
        return{
            f:function(val){
                if(val =='AUTO'){
                    return "流程结束"
                }else{
                    return userHelper.getDisplay(val)
                }

            }
        }
    }();
    
    var enumBusiTypeInit = {"LSKS":"零散开栓","LSKSYL":"零散开栓有令","SPECIALA":"特殊用户申请",
                         "CHANGEGT":"用户用气性质变更","CHANGEJP":"家庭人口数变更","ZJVOLUME":"增减容","STOPUSEG":"暂停用气",
                         "REUSEG":"重新用气","CHANGEMT":"用户换表（民用非居民）","CHANGEMTSF":"用户换表（商服）","R_PLKX":"居民开栓令申请","NR_PLKX":"非居民开栓令申请",
                         "VIPCUSTOMERA":"大客户申请","ADJUSTP":"定针","REMOVEM":"拆除","CHSQ":"串户申请","FJMHT":"非居民合同","CHGTYPEERRORAPPLY01":"收费方式变更未日结",
                          "CHGTYPEERRORAPPLY02":"收费方式变更已日结", "BLLCORRECTA":"计费更正","BLLCORRECTA2":"计费更正(垃圾费)","CHGMONEYERRORAPPLY01":"收费金额变更申请差错金额小于100",
                          "CHGMONEYERRORAPPLY02":"收费金额变更申请差错金额小于10000","CHGMONEYERRORAPPLY03":"收费金额变更申请差错金额大于10000(非居民)",
                          "CHGMONEYERRORAPPLY04":"收费金额变更申请差错金额小于500(居民)","TKSQ":"退款申请",
                          "CBJHBG":"抄表计划变更","XYQL":"协议气量","BJCRK":"表具出入库",
                          "CQBYQJMSQ":"居民长期不用气申请","CQBYQFJMSQ":"非居民长期不用气申请","ICCOMPLEMENTAPPLY":"补气补量申请","HBGDSP":"换表工单审批","MTGSQ":"煤改气用户登记申请",
                          "JBJH":"非居民检表计划","JBJHC":"非居民检表计划变更","JMHFYQSQ":"居民恢复用气申请","FJMHFYQSQ":"非居民恢复用气申请","METERMOVE":"移库申请","METERONLINE":"下线表重新上线申请"};

    $.map(enumBusiTypeInit, function (key, val) {
		$('#find_flowType').append('<option value="' + val + '">' + key + '</option>');
		$('#find_flowType2').append('<option value="' + val + '">' + key + '</option>');
	});
    //查询按钮绑定--待办
    $("#find_button1").click(function(){
    	var find_bd={};
    	
    	var find_flowType=$("#find_flowType").val();
    	var find_customerCode=$("#find_customerCode").val();
    	find_bd={
    		"cols":bd.cols,
            "froms":bd.froms ,
            "wheres":bd.wheres,
            "page":"true",
            "limit":50
    	};
    	if(find_flowType){
    		find_bd.wheres="flow_def_id='"+find_flowType+"' and " +find_bd.wheres
    	}
    	if(find_customerCode){
    		find_bd.wheres="prop2str64 like '%"+find_customerCode+"%' and " +find_bd.wheres
    	}
    	xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(find_bd)))
    	xw.update();
    })
    $("#find_button2").click(function(){
    	var find_bd={};
    	
    	var find_flowType=$("#find_flowType2").val();
    	var find_customerCode=$("#find_customerCode2").val();
    	find_bd={
    		"cols":bdReload1.cols,
            "froms":bdReload1.froms ,
            "wheres":bdReload1.wheres,
            "page":"true",
            "limit":50
    	};
    	if(find_flowType){
    		find_bd.wheres="flow_def_id='"+find_flowType+"' and " +find_bd.wheres
    	}
    	if(find_customerCode){
    		find_bd.wheres="prop2str64 like '%"+find_customerCode+"%' and " +find_bd.wheres
    	}
    	xw1.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(find_bd)))
    	xw1.update();
    })
    // <a href="{stepid}" >处理</a></td>
    return {
        init: function () {

            this.reload();
            this.reload1();
            //setInterval(this.reload, 10000); 
        },


        reload : function(){
            $('#divtable11_1').html('');
            // xw=XWATable.init(
            xw = XWATable.init(
                {
                    divname : "divtable11_1",
                    //----------------table的选项-------
                    pageSize : 20,
                    // pageSize : 200,x
                    columnPicker : true,
                    transition : 'fade',
                    checkAllToggle:true,
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    coldefs:[
                        {
                            col : 'id',
                            friendly : '业务类型',
                            // hidden:true,
                            unique:"true",
                            readonly:"readonly",
                            format:IndexEnum.busiTypeFormat,
                            sorting : false,
                            nonedit:"nosend",
                            index:1

                        },
                        {
                            col : 'prop2str64',
                            friendly : '客户名称及编号',
                            sorting:false,
                            index : 2
                        },
                        {
                            col : 'gsChcode',
                            friendly : '流程节点',
                            nonendit : 'nosend',
                            readonly : 'readonly',
                            sorting : false,
                            index : 3
                        },
                        {
                            col : 'stepStatus',
                            friendly : '流程状态',
                            format:IndexEnum.stepStatusFormat,
                            sorting:false,
                            index : 4
                        },
                        {
                            col : 'operator',
                            friendly : '业务审批人',
                            format:userHelperFormat,
                            sorting:false,
                            index : 5
                        },
                        {
                            col : 'createTime',
                            friendly : '业务申请时间',
                            format:GasModBil.dateFormat,
                            sorting:false,
                            index : 6
                        },
                        {
                            col : 'operate',
                            friendly : '操作',
                            format:operateFormat,
                            sorting:false,
                            index : 7
                        }

                    ],
                    // 查询过滤条件
                    findFilter : function(){

                    }
                }); // --init

        },
        reload1 : function(){

            $('#divtable11_2').html('');
            // xw=XWATable.init(
            xw1 = XWATable.init(
                {
                    divname : "divtable11_2",
                    //----------------table的选项-------
                    pageSize : 20,
                    // pageSize : 200,x
                    columnPicker : true,
                    transition : 'fade',
                    checkAllToggle:true,
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bdReload1)),
                    coldefs:[
                        {
                            col : 'id',
                            friendly : '业务类型',
                            // hidden:true,
                            unique:"true",
                            readonly:"readonly",
                            format:IndexEnum.busiTypeFormat,
                            sorting : false,
                            nonedit:"nosend",
                            index:1

                        },
                        {
                            col : 'prop2str64',
                            friendly : '客户名称及编号',
                            sorting:false,
                            index : 2
                        },

                        {
                            col : 'operator',
                            friendly : '业务审批人',
                            format:userHelper1Format,
                            sorting:false,
                            index : 3
                        },
                        {
                            col: 'gsChcode',
                            friendly: '流程节点',
                            nonendit: 'nosend',
                            readonly: 'readonly',
                            sorting: false,
                            index: 4
                        },
                        {
                            col : 'results',
                            friendly : '审批结果',
                            format:IndexEnum.agreeStatusFormat,
                            sorting:false,
                            index : 6
                        },
                        {
                            col : 'createTime',
                            friendly : '业务受理时间',
                            format:GasModBil.dateFormat,
                            sorting:false,
                            index : 7
                        },
                        {
                            col : 'fetchTime',
                            friendly : '获取任务时间',
                            format:GasModBil.dateFormat,
                            sorting:false,
                            index : 8
                        },
                        {
                            col : 'submitTime',
                            friendly : '提交审批时间',
                            format:GasModBil.dateFormat,
                            sorting:false,
                            index : 9
                        }

                    ],
                    // 查询过滤条件
                    findFilter : function(){

                    }
                }); // --init

        },
        
    }
}();



