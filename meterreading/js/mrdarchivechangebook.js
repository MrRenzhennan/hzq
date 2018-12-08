var MrdArchiveChangeBook = function(){
    var xw ;
    var login_user = JSON.parse(localStorage.getItem("user_info"));

    var area_id= login_user.area_id;
    var login_user_id = login_user.userId;

    var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName"
    });
    var gasTypeFormat=function(){
        return {
            f: function(val){
                return gasTypeHelper.getDisplay(val);
            }
        }
    }();

    var operateFormat = function(){
        return {
            f:function(val){
                return "<a href='JavaScript:;'  data-id='"+val+"' class='btn_plan'>重新生成抄表计划</a>"
            }
        }
    }();
    //点击申请 客户转本（用气性质不变）
    $('#mark_button').on('click',function(){
        var selrows = xw.getTable().getData(true);
        if (selrows.rows.length == 0) {
            bootbox.alert("<br><center><h4>请选择需要预览的行</h4></center><br>");
            return;
        }
        var batchids=new Array();
        var serviceNotEnd = new Array();
        var bookCodes = new Array();

        var arrselectrowobj = new Array();
        $.each(selrows.rows,function(idx,row){
            batchids.push(row.ctmArchiveId);
            arrselectrowobj.push(row);

            //判断用户类型是不是都是一样的。

           // if(!row.hasBusiness || row.hasBusiness == 0){//所有流程已完成
                bookCodes.push(row.bookCode);
            /*}else{
                console.log(row.customerCode);
                serviceNotEnd.push(row.customerCode);
            }*/
        })
        var book_id = selrows.rows[0].bookId;

        if(bookCodes != null && bookCodes.length > 1){
            for(var j=0;j<bookCodes.length-1;j++){
                if(bookCodes[j] != bookCodes[j+1]){
                    bootbox.alert("<br><center><h4>请选择在同一抄表本中的客户,现在选中的客户所在抄表本本号为："+bookCodes.join()+"</h4></center><br>");
                    return;
                }
            }
        }
        /*if(bookCodes.length != batchids.length){
            bootbox.alert("<br><center><h4>选中客户有未完成流程，不能进行转本。</h4></center></br>");
            return;
        }*/
        //$('#myModel').show();
        if(batchids.length==selrows.rows.length){

            console.log(bookCodes);
            console.log(bookCodes[0]);
            var box = bootbox.confirm({
                title: "客户批量转本",

                message : '<form class="bootbox-form form-horizontal form-bordered form-label-stripped">' +
                                '<div class="form-body">' +
                                "<div class='form-group'><label class='col-md-3 control-label'>是否为用气性质变更转本</label>"+
                                "<div class='col-md-9'>" +
                                "<select id='form_serviceType' name='copyState' class='form-control select2me chosen-select'><option value='1'>用气性质不变</option><option  value='2'>商专民</option><option value='3'>民转商</option></select>"+
                                "</div></div>"+
                                '<div class="form-group">' +
                                    '<label class="col-md-3 control-label">客户现在在所在本号</label>'+
                                    '<div class="col-md-9">' +
                                    '<input id="form_oldBookCode" type="text" class="form-control" value="'+bookCodes[0]+'" placeholder="" readonly="readonly">'+
                                    '</div>' +
                                '</div>' +
                                '<div class="form-group">' +
                                    '<label class="control-label col-md-3">目标本号</label>' +
                                    '<div class="col-md-9">' +
                                    '<input id="form_bookCode" type="text" class="form-control" placeholder="">' +
                                   // '<select id="form_bookids" class="form-control input-middle select2me" data-placeholder="抄表本编号">'+bookopts+'</select>'+
                                    '</div>' +
                                '</div>' +
                            '</div></form>',

                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> 取消'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> 确认'
                    }
                },
                callback: function (result) {
                    if(result) {
                        /*if(serviceNotEnd != null && serviceNotEnd.length>0){//有选中的客户的流程未跑完
                         for(var i=0;i<serviceNotEnd.length;i++){
                         var customercodestrs = serviceNotEnd.join();
                         bootbox.alert("<h1>客户编号为："+customercodestrs+"的客户有未完成的流程</h1>");
                         e.preventDefault();
                         return;
                         }

                         }*/
                        if (!$('#form_oldBookCode').val() || $('#form_oldBookCode').val().trim().length < 0) {
                            bootbox.alert("<h1>客户现在所在本号为空，不能提交。</h1>");
                            e.preventDefault();
                            return;
                        }
                        if (!$('#form_bookCode').val() || $('#form_bookCode').val().trim().length < 0) {
                            bootbox.alert("<h1>目标本号为空，不能提交。</h1>");
                            e.preventDefault();
                            return;
                        }
                        //查询输入的抄表本编号 是否在本区域
                        var queryCondion = RQLBuilder.and([
                            RQLBuilder.equal("status", "1"), //1启用
                            RQLBuilder.equal("bookCode", $('#form_oldBookCode').val())
                        ]).rqlnoenc();

                        var oldbookobj= Restful.find(hzq_rest+"gasmrdbook",queryCondion);

                        var query_condition = RQLBuilder.and([
                            RQLBuilder.equal("status", "1"),//启用
                            RQLBuilder.equal("bookCode", $('#form_bookCode').val())
                        ]).rqlnoenc();

                        var newbookobj = Restful.find(hzq_rest+"gasmrdbook",query_condition);

                        var area_query_condition = RQLBuilder.and([
                            RQLBuilder.equal("status", "1"),//启用
                            RQLBuilder.equal("areaId", login_user.area_id)
                        ]).rqlnoenc();

                        var areaobj = Restful.find(hzq_rest+"gasbizarea",area_query_condition);
                        var areadetail = areaobj[0].parentAreaId;
                        var pid = 1;

                        if (areadetail) {
                            pid = areadetail
                        }
                        if (pid != '0' && oldbookobj[0].areaId != login_user.area_id) {//不是总公司的管理员
                            bootbox.alert("<h1>请选择自己供气区域下的抄表本。</h1>");
                            //e.preventDefault();
                            return;
                        }
                        if (!newbookobj) {
                            bootbox.alert("<h1>未找到目标抄表本。</h1>");
                           // e.preventDefault();
                            return;
                        }

                        if (pid != '0' && newbookobj[0].areaId != login_user.area_id ) {
                            bootbox.alert("<h1>目标抄表本不属于登录人员供气区域，请重新填写自身供气区域下抄表本编号</h1>");
                           // e.preventDefault();
                            return;
                        }

                        for(var s=0;s<arrselectrowobj.length -1;s++){//选中的 客户的 id
                            if(arrselectrowobj[s].customerKind != arrselectrowobj[s+1].customerKind){
                                bootbox.alert("<h1>选中客户的客户类型不一致,"+arrselectrowobj[s].customerCode+","+arrselectrowobj[s+1].customerCode+"</h1>");
                               // e.preventDefault();
                                return;
                            }
                        }

                        if(oldbookobj[0].bookType == newbookobj[0].bookType && newbookobj[0].bookType=='1' ){//抄表本——居民
                            var forarchive = new Array();
                            for (var i = 0; i < batchids.length; i++) {
                                var data = {};
                                var bsdata = {};
                                data.ctmArchiveId = batchids[i];
                                var archive_condion
                                data.bookId = newbookobj[0].bookId;
                                forarchive.push(data);
                            }
                            var caids = batchids.join();
                            var forplan = {"ctmarchiveids": caids};

                            var batch_update_archive = Restful.updateNQ(hzq_rest+"gasctmarchive",JSON.stringify(forarchive));
                          //  var batch_inst_archive = Restful.insert_batch(hzq_rest+"gasctmarchive/?retobj="+forarchive.length,forarchive);
                            var numc = 0;
                            if(batch_update_archive ){
                                numc = forarchive.length;
                                $.ajax({
                                    url : "/hzqs/pla/pbgpl.do?fh=GPLPLA0000000J00&resp=bd",
                                    type:'POST',
                                    contentType:"application/json; charset=utf-8",
                                    //data:JSON.stringify(forplan),
                                    data:JSON.stringify({"ctmarchiveids":caids}),
                                    success:function(results){
                                        if(results.err_code =="1"){
                                            bootbox.alert("<h3>转本成功，共转客户数（" + numc + "）个，并更新抄表计划</h3>");
                                            xw.autoResetSearch();
                                        }else{
                                            bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                        }
                                    },
                                    error:function(){
                                        bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                    }
                                });
                            }

                        }else if(oldbookobj[0].bookType == '1' && newbookobj[0].bookType =='9'){//抄表本——老本居民---新本--非居民（用气性质变更）
                            /**
                             * 居民转非居民
                             * @type {Array}
                             */
                            var noarrbusiness = new Array();
                            for(var i=0;i<arrselectrowobj.length-1;i++){//选中的客户
                                if(arrselectrowobj[i].bookId == arrselectrowobj[i+1].bookId && arrselectrowobj[i].customerKind == arrselectrowobj[i+1].customerKind && arrselectrowobj[i].customerKind=='9'){//选中的都是非居民
                                   continue;
                                }else{
                                  noarrbusiness.push(arrselectrowobj[i]);
                                }
                            }
                            if(noarrbusiness.length > 0){
                                bootbox.alert("选中的客户中含有居民，居民个数("+arrselectrowobj.length+")个，请重新选择");
                                return ;
                            }
                            var caids = batchids.join();
                            //判断 gas_mrd_business_rule_day中是否有记录
                            var existbusiobj = new Array();
                            var notexistbusiobj = new Array();
                            var manyexistbusiobj = new Array();
                            var ctm_obj_data_arr = new Array();
                            for(var j=0;j<arrselectrowobj.length;j++){
                                //挨个判断是否存在于
                                var ctm_arr_objs = {};
                                ctm_arr_objs.bookId = newbookobj[0].bookId;
                                ctm_arr_objs.ctmArchiveId = arrselectrowobj[j].ctmArchiveId;
                                ctm_obj_data_arr.push(ctm_arr_objs);

                                var business_query_condition = RQLBuilder.and([
                                   // RQLBuilder.equal("status", "1"),//启用
                                    RQLBuilder.equal("ctmArchiveId", arrselectrowobj[j].ctmArchiveId)
                                ]).rqlnoenc();
                                var existifbusinessobj = Restful.find(hzq_rest+"gasmrdbusinessruleday",business_query_condition);
                                if(existifbusinessobj && existifbusinessobj.length == 0){
                                    notexistbusiobj.push(arrselectrowobj[j]);
                                }else if(existifbusinessobj && existifbusinessobj.length == 1){
                                    existbusiobj.push(existifbusinessobj[j]);
                                }else if(existifbusinessobj && existifbusinessobj.length >=2){//多1个
                                    manyexistbusiobj.push(existifbusinessobj[j]);
                                }

                            }

                            if(notexistbusiobj && notexistbusiobj.length>=1){//非居民抄表例日--无数据
                                //批量插入
                                var busi_obj_data = {};
                                var busi_notexist_arr = new Array();

                                for(var i=0;i<notexistbusiobj.length;i++){
                                    var busi_obj_data = {};
                                    var ctm_obj_data={};
                                    busi_obj_data.bookId=newbookobj[0].bookId;
                                    busi_obj_data.ctmArchiveId =notexistbusiobj[i].ctmArchiveId
                                    busi_obj_data.businessRuleDayId = $.md5(notexistbusiobj[i].ctmArchiveId+newbookobj[0].bookId+ new Date().getTime());
                                    busi_obj_data.copySeq ='0';
                                    busi_obj_data.copyMonth='1,2,3,4,5,6,7,8,9,10,11,12';
                                    busi_obj_data.copyRuleDay ='';
                                    busi_obj_data.status='1';
                                    busi_obj_data.createdTime =moment().format("YYYY-MM-DD HH:mm:ss");
                                    busi_obj_data.modifiedTime =moment().format("YYYY-MM-DD HH:mm:ss");
                                    busi_notexist_arr.push(busi_obj_data);
                                }

                                //转本，添加非居民抄表例日表
                                var bds={
                                    "sets":[{
                                        "txid":"1",
                                        "body":JSON.stringify(ctm_obj_data_arr),
                                        "path":"/gasctmarchive/","method":"PUT"
                                    },{
                                        "txid":"2",
                                        "body":busi_notexist_arr,
                                        "path":"/gasmrdbusinessruleday/",
                                        "method":"POST"
                                    }]
                                }
                                var htcl = "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd";

                                $.ajax({
                                    url:htcl,
                                    type:'POST',
                                    contentType:"application/json;charset=utf-8",
                                    data:JSON.stringify(bds),
                                    success:function(results_1){
                                        var retFlag = true;
                                        if (!results_1.success && results_1.success == false) {
                                            retFlag = false;
                                        }
                                        if (retFlag) {//刷新抄表计划-- 刷新抄表计划的供气区域，用气性质，抄表本id，抄表本编号，客户服务员，核算员
                                            $.ajax({
                                                url : "/hzqs/pla/pbgpl.do?fh=GPLPLA0000000J00&resp=bd",
                                                type:'POST',
                                                contentType:"application/json; charset=utf-8",
                                                //data:JSON.stringify(forplan),
                                                data:JSON.stringify({"ctmarchiveids":caids,"servicename":"NTBTURNBOOK"}),
                                                success:function(results){
                                                    if(results.err_code =="1"){
                                                        bootbox.alert("<h3>转本成功，共转客户数（" + numc + "）个，并更新抄表计划</h3>");
                                                        xw.autoResetSearch();
                                                    }else{
                                                        bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                                    }
                                                },
                                                error:function(){
                                                    bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                                }
                                            });
                                        }
                                    }

                                });
                            }
                            if(existbusiobj && existbusiobj.length >=1){//非居民抄表例日--有数据（一条）
                                //判断 status ,批量update status 都变成1
                                var existbusiobj_arr = new Array();

                                for(var i=0;i<existbusiobj.length;i++){
                                    var exist_obj = {};

                                    exist_obj.bookId = newbookobj[0].bookId;
                                    exist_obj.businessRuleDayId = existbusiobj[i].businessRuleDayId;
                                    exist_obj.status ='1';
                                    existbusiobj_arr.push(exist_obj);
                                }
                                //更新非居民抄表例日和 客户档案中的bookId
                                var bds = {
                                    "sets": [{
                                        "txid": "1",
                                        "body": JSON.stringify(ctm_obj_data_arr),
                                        "path": "/gasctmarchive/", "method": "PUT"
                                    }, {
                                        "txid": "2",
                                        "body": JSON.stringify(existbusiobj_arr),
                                        "path": "/gasmrdbusinessruleday/",
                                        "method": "PUT"
                                    }]
                                };
                                var htcl = "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd";
                                $.ajax({
                                    url:htcl,
                                    type:'PUT',
                                    contentType:"application/json;charset=utf-8",
                                    data:JSON.stringify(bds),
                                    success:function(results_2){
                                        var retFlag = true;
                                        if (!results_2.success && results_2.success == false) {
                                            retFlag = false;
                                        }
                                        if (retFlag) {//刷新抄表计划-- 刷新抄表计划的供气区域，用气性质，抄表本id，抄表本编号，客户服务员，核算员
                                            $.ajax({
                                                url : "/hzqs/pla/pbgpl.do?fh=GPLPLA0000000J00&resp=bd",
                                                type:'POST',
                                                contentType:"application/json; charset=utf-8",
                                                //data:JSON.stringify(forplan),
                                                data:JSON.stringify({"ctmarchiveids":caids,"servicename":"NTBTURNBOOK"}),
                                                success:function(results){
                                                    if(results.err_code =="1"){
                                                        bootbox.alert("<h3>转本成功，共转客户数（" + numc + "）个，并更新抄表计划</h3>");
                                                        xw.autoResetSearch();
                                                    }else{
                                                        bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                                    }
                                                },
                                                error:function(){
                                                    bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                                }
                                            });
                                        }
                                    },
                                    error :function(e){
                                        bootbox.alert("转本失败");
                                    }

                                });


                            }
                            if(manyexistbusiobj && manyexistbusiobj.length>=1){//非居民抄表例日--有数据（两条）
                                //具体查询下客户档案，然后删除几个
                                alert("非居民抄表例日中有两条重复数据");
                                return;
                            }

                        }else if(oldbookobj[0].bookType =='9' && newbookobj[0].bookType=='1'){//抄表本--原本非居民--新本居民（用气性质变更
                            //非居民---转 居民-- 抄表计划重新生成
                            /**
                             * 非居民转居民
                             * @type {Array}
                             */
                            var nonormal_arr = new Array();
                            for(var i=0;i<arrselectrowobj.length-1;i++){//选中的客户
                                if(arrselectrowobj[i].bookId == arrselectrowobj[i+1].bookId && arrselectrowobj[i].customerKind == arrselectrowobj[i+1].customerKind && arrselectrowobj[i].customerKind=='1'){//选中的都是非居民
                                    continue;
                                }else{
                                    nonormal_arr.push(arrselectrowobj[i]);
                                }
                            }
                            if(nonormal_arr.length > 0){
                                bootbox.alert("选中的客户中含有非居民，非居民个数("+nonormal_arr.length+")个，请重新选择");
                                return ;
                            }
                            var caids = batchids.join();
                            //判断 gas_mrd_business_rule_day中是否有记录
                            var existnormalobj = new Array();
                            var notexistnormalobj = new Array();
                            var manyexistnormalobj = new Array();

                            var ctm_archive_obj_arr = new Array();
                            for(var j=0;j<arrselectrowobj.length;j++){
                                var arrobj0 = {};
                                arrobj0.bookId = newbookobj[0].bookId;
                                arrobj0.ctmArchiveId = arrselectrowobj[j].ctmArchiveId;
                                ctm_archive_obj_arr.push(arrobj0);

                                //挨个判断是否存在于
                                var business_query_condition = RQLBuilder.and([
                                    // RQLBuilder.equal("status", "1"),//启用
                                    RQLBuilder.equal("ctmArchiveId", arrselectrowobj[j].ctmArchiveId)
                                ]).rqlnoenc();
                                var existifnormalobj = Restful.find(hzq_rest+"gasmrdbusinessruleday",business_query_condition);
                                if(existifnormalobj && existifnormalobj.length == 0){
                                   continue;
                                }else if(existifnormalobj && existifnormalobj.length == 1){
                                    existnormalobj.push(existifnormalobj[j]);
                                }else if(existifnormalobj && existifnormalobj.length >=2){//多1个
                                    manyexistnormalobj.push(existifnormalobj[j]);
                                }

                            }

                            var statusisnot3 = new Array();
                            var putdata = new Array();
                            if(existnormalobj.length > 0){//存在于 非居民抄表例日表中： update status='3' 删除状态
                                for(var j =0;j<existnormalobj.length;j++){
                                    if(existnormalobj[j].status =='1'){
                                        var putd = {};
                                        putd.bookId = newbookobj[0].bookId;
                                        putd.businessRuleDayId =existnormalobj[j].businessRuleDayId;
                                        putd.status ='3';
                                        statusisnot3.push(existnormalobj[j]);
                                    }
                                }
                            }
                            if(statusisnot3.length>0){//更新非居民抄表例日表状态
                                var bds = {
                                    "sets": [{
                                        "txid": "1",
                                        "body": JSON.stringify(ctm_archive_obj_arr),
                                        "path": "/gasctmarchive/", "method": "PUT"
                                    }, {
                                        "txid": "2",
                                        "body": JSON.stringify(statusisnot3),
                                        "path": "/gasmrdbusinessruleday/",
                                        "method": "PUT"
                                    }]
                                };
                                var htcl = "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd";
                                $.ajax({
                                    url:htcl,
                                    contentType:"application/json; charset=utf-8",
                                    type: 'PUT',
                                    dataType: 'json',
                                    data: JSON.stringify(bds),
                                    async: false,
                                    success:function(result3){
                                        console.log("submit:result:" + JSON.stringify(result));
                                        console.log(result3);

                                        var retFlag = true;
                                        if (result3.success && result3.success == false) {
                                            retFlag = false;
                                        }
                                        if (retFlag) {
                                            //调用删除然后重建该客户的抄表计划
                                            var numc = result3.results[0].result.retObj;

                                            $.ajax({
                                                url : "/hzqs/pla/pbgpl.do?fh=GPLPLA0000000J00&resp=bd",
                                                type:'POST',
                                                contentType:"application/json; charset=utf-8",
                                                //data:JSON.stringify(forplan),
                                                data:JSON.stringify({"ctmarchiveids":caids}),
                                                success:function(results){
                                                    if(results.err_code =="1"){
                                                        bootbox.alert("<h3>转本成功，共转客户数（" + numc + "）个，并更新抄表计划</h3>");
                                                        xw.autoResetSearch();
                                                    }else{
                                                        bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                                    }
                                                },
                                                error:function(){
                                                    bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                                }
                                            });

                                        } else {
                                            if(result.msg){
                                                bootbox.alert("<h3>"+result.msg+"</h3>");
                                            }else{
                                                bootbox.alert("<h3>客户转本失败，请重试。</h3>");
                                            }
                                        }
                                    }
                                });

                            }else{
                                //更新客户档案的 bookId

                                var succeresult = Restful.updateNQ(hzq_rest+"gasctmarchive",JSON.stringify(ctm_archive_obj_arr));
                                if(succeresult){
                                $.ajax({
                                    url : "/hzqs/pla/pbgpl.do?fh=GPLPLA0000000J00&resp=bd",
                                    type:'POST',
                                    contentType:"application/json; charset=utf-8",
                                    //data:JSON.stringify(forplan),
                                    data:JSON.stringify({"ctmarchiveids":caids,"servicename":"BTNTURNBOOK"}),
                                    success:function(results){
                                        if(results.err_code =="1"){
                                            bootbox.alert("<h3>转本成功，共转客户数（" + numc + "）个，并更新抄表计划</h3>");
                                            xw.autoResetSearch();
                                        }else{
                                            bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                        }
                                    },
                                    error:function(){
                                        bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                    }
                                });
                                }else{
                                    bootbox.alert("转本失败。");
                                }
                            }

                        }else if(oldbookobj[0].bookType =='9' && newbookobj[0].bookType == '9'){//抄表本--非居民--新本 非居民

                        d = {};
                        var forarchive = new Array();
                        var forbusiness = new Array();

                        for (var i = 0; i < batchids.length; i++) {
                            var data = {};
                            var bsdata = {};
                            data.ctmArchiveId = batchids[i];
                            var business_query_condition = RQLBuilder.and([
                                RQLBuilder.equal("status", "1"),//启用
                                RQLBuilder.equal("ctmArchiveId", batchids[i])
                            ]).rql();
                            var businessruledayid = Restful.findNQ(hzq_rest + 'gasmrdbusinessruleday?fields={"businessRuleDayId":"1"}&query=' + business_query_condition )[0];

                            console.log(businessruledayid);

                            bsdata.businessRuleDayId = businessruledayid.businessRuleDayId;
                            bsdata.bookId = newbookobj[0].bookId;

                            data.bookId = newbookobj[0].bookId;
                            forarchive.push(data);
                            forbusiness.push(bsdata);

                        }
                        var caids = batchids.join();
                        var forplan = {"ctmarchiveids": caids};

                        var bds = {
                            "sets": [{
                                "txid": "1",
                                "body": JSON.stringify(forarchive),
                                "path": "/gasctmarchive/", "method": "PUT"
                            }, {
                                "txid": "2",
                                "body": JSON.stringify(forbusiness),
                                "path": "/gasmrdbusinessruleday/",
                                "method": "PUT"
                            }]
                        };
                        //多表操作---转本
                        //客户档案表，非居民抄表例日表
                        var htcl = "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd";
                        $.ajax({
                            url:htcl,
                            contentType:"application/json; charset=utf-8",
                            type: 'PUT',
                            dataType: 'json',
                            data: JSON.stringify(bds),
                            async: false,
                            success:function(result1){
                                console.log("submit:result:" + JSON.stringify(result));
                                console.log(result);

                                var retFlag = true;
                                if (result1.success && result1.success == false) {
                                    retFlag = false;
                                }
                                if (retFlag) {
                                    //调用删除然后重建该客户的抄表计划
                                    var numc = result1.results[0].result.retObj;

                                    $.ajax({
                                        url : "/hzqs/pla/pbgpl.do?fh=GPLPLA0000000J00&resp=bd",
                                        type:'POST',
                                        contentType:"application/json; charset=utf-8",
                                        //data:JSON.stringify(forplan),
                                        data:JSON.stringify({"ctmarchiveids":caids}),
                                        success:function(results){
                                            if(results.err_code =="1"){
                                                bootbox.alert("<h3>转本成功，共转客户数（" + numc + "）个，并更新抄表计划</h3>");
                                                xw.autoResetSearch();
                                            }else{
                                                bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                            }
                                        },
                                        error:function(){
                                            bootbox.alert("转本成功,<h3>但更新抄表计划失败,请手动生成抄表计划</h3>(点击【重新生成抄表计划】)");
                                        }
                                    });
                                  
                                } else {
                                    if(result.msg){
                                        bootbox.alert("<h3>"+result.msg+"</h3>");
                                    }else{
                                        bootbox.alert("<h3>客户转本失败，请重试。</h3>");
                                    }
                                }
                            }
                        });
                        }
                    }

                }
            })
            box.on("shown.bs.modal", function() {
                //$(".chosen-select").select2()
            });
        }
    })

    return {
        init: function () {
            this.initHelper();
            this.reload();
            //this.initBookTree();
            this.linkage();

        },
        initHelper:function(){
            //供气区域-核算员-抄表员 联动
            //console.log(login_user);
            GasModSys.areaList({
                "areaId":login_user.area_id,
                "cb":function(data){
                    var inhtml = "<option value=''>全部</option>";
                    if(data){
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.areaId+'">'+row.areaName+'</option>';
                        })
                        $("#find_unit").html(inhtml);
                        $("#find_unit").val("").change();
                    }
                }
            });
            $('#find_unit').on('change',function(e){
                //console.log("change area:"+e+"."+$('#find_unit').val());
                GasModSys.counterUsersInArea({
                    "areaId":$('#find_unit').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                        })
                        $("#find_countPer").html(inhtml);
                        $("#find_countPer").val("").change();
                    }
                })
            });
            $('#find_countPer').on('change',function(e){
               // console.log("change counter:"+e+"."+$('#find_countPer').val());
                GasModSys.copyUsersInArea({
                    "areaId":$('#find_unit').val(),
                    "countperId":$('#find_countPer').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                            $.each(data,function(idx,row){
                                inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                            })
                        }
                        $("#find_servicePer").html(inhtml);
                        $("#find_servicePer").val("").change();

                    }
                })
            });
            //客户类型——用气类型——用气性质 联动
            var gasTypeHelper = RefHelper.create({
                ref_url: "gasbizgastype/?query={\"parentTypeId\":\"1\"}",
                ref_col: "gasTypeId",
                ref_display: "gasTypeName",
            });
            $.map(gasTypeHelper.getData(), function (value, key) {
               // console.log(key)
                $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
            });
            $("#find_gasTypeId").on("change",function(){
               // console.log($(this).val())
                $('#find_gasTypeId1').html('<option value="">请选择</option>').trigger("change");
                var gasType1Helper = RefHelper.create({
                    ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
                    ref_col: "gasTypeId",
                    ref_display: "gasTypeName",
                });
                $.map(gasType1Helper.getData(), function (value, key) {
                    //console.log(key)
                    $('#find_gasTypeId1').append('<option value="' + key + '">' + value + '</option>');
                });
            });
            $("#find_gasTypeId1").on("change",function(){
                //console.log($(this).val())
                $('#find_gasTypeId2').html('<option value="">请选择</option>').trigger("change");
                var gasType1Helper = RefHelper.create({
                    ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
                    ref_col: "gasTypeId",
                    ref_display: "gasTypeName",
                });
                $.map(gasType1Helper.getData(), function (value, key) {
                    //console.log(key)
                    $('#find_gasTypeId2').append('<option value="' + key + '">' + value + '</option>');
                });
            });


        },
        reload : function(){

            $('#divtable').html('');
            var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';

            var whereinfo = '1=1';
            if(login_user.station_id && login_user.station_id == '1'){//核算员
                whereinfo += " and b.serviceper_id = '"+login_user_id+"' ";
            }else if(login_user.station_id && login_user.station_id=='2'){//抄表员
                whereinfo +=" and b.countper_id = '"+login_user_id+"' ";
            }else{
                whereinfo +=" and b.area_id in ( select area_id"+
                " from gas_biz_area where parent_area_id='"+area_id+"' and status<>'3' union "+
                " select area_id from gas_biz_area where status<>'3' start with area_id='"+area_id+"' connect by prior area_id=parent_area_id "+
                " ) ";
            }

            whereinfo +=" and b.status<>'3' ";
            whereinfo +=" and a.customer_state<>'99' ";
            var bd = {
                "cols":"a.ctm_archive_id,a.bookId,b.areaId,b.countperId,b.serviceperId,b.bookCode," +
                " a.customerCode,a.customerName,a.meterUserName,a.customerAddress,a.gasTypeId,a.mobile,a.customerType," +
                " a.customerKind ",//bs.has_business,
                "froms":" gas_ctm_archive a " +
                " left join gas_mrd_book b on b.book_id = a.book_id " ,
               // " left join (select count(1) has_business ,br.ctm_archive_id,br.customer_code " +
                //" from gas_csr_busi_register br where br.bill_state='N' and br.blank_out_sign='N' group by br.ctm_archive_id,br.customer_code ) bs on bs.ctm_archive_id=a.ctm_archive_id ",
                "wheres":whereinfo,
                "page":"true",
                "limit":50
            }
            xw=XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize : 10,
                    columnPicker : true,
                    transition : 'fade',
                    checkboxes : true,
                    checkAllToggle : true,
                    //----------------基本restful地址---
                    restURL: base_url + encodeURIComponent(JSON.stringify(bd)),
                    key_column:'ctmArchiveId',
                    coldefs:[

                        {
                            col:"bookId",
                            friendly:"抄表本ID",
                            hidden:true,
                            nonedit:"nosend",
                            readonly:"readonly",
                            sorting:false,
                            index:1
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:GasModSys.areaFormat,
                            inputsource: "select",
                            readonly:"readonly",
                            // disabled:true,
                            sorting:false,
                            index:2
                        },
                        {
                            col:"countperId",
                            friendly:"核算员",
                            format: GasModSys.employeeNameFormat,
                            sorting:false,
                            index:3
                        },
                        {
                            col:"serviceperId",
                            friendly:"客户服务员",
                            format: GasModSys.employeeNameFormat,
                            sorting:false,
                            index:4
                        },
                        {
                            col:"bookCode",
                            friendly:"抄表本编号",
                            nonedit:"nosend",
                            //  hidden:true,
                            readonly:"readonly",
                            index:5
                        },
                        {

                            col:"customerCode",
                            friendly:"客户编号",
                            sorting:false,
                            index:6
                        },
                        {
                            col:"customerName",
                            friendly:"客户名称",
                            sorting:false,
                            //inputsource: "select",
                            index:7
                        },

                        {
                            col:"meterUserName",
                            friendly:"表户名称",
                            sorting : false,
                            index:8
                        },
                        {
                            col:"customerAddress",
                            friendly:"客户地址",
                            sorting:false,
                            index:9
                        },
                        {
                            col:"hasBusiness",
                            friendly:"未完成业务数(暂时不做业务限定)",
                            sorting:false,
                            index:10
                        },
                        {
                            col:"gasTypeId",
                            friendly:"用气类型",
                           // format:GasModBas.gasTypeFormat,
                            format:gasTypeFormat,
                            sorting:false,
                            index:11
                        },
                        {
                            col:"oldBookNo",
                            friendly:"原本号",
                            sorting:false,
                            hidden:true,
                            readonly:"readonly",
                            index:12
                        },
                        {
                            col:"bookType",
                            friendly:"本类型",
                            format:GasModBas.bookTypeFormat,
                            inputsource: "select",
                            readonly:"readonly",
                            index:13
                        },
                        {
                            col:"customerKind",
                            friendly:"客户种类",//居民还是非居民
                            format:GasModCtm.customerKindFormat,
                            hidden:true,
                            sorting:false,
                            index:14
                        },
                        {
                            col:"mobile",
                            friendly:"联系电话",
                            sorting:false,
                            index:15
                        },
                        //MOBILE
                        {
                            col:"customerType",
                            friendly:"客户类型",//IC卡表还是普表
                            sorting:false,
                            index:16
                        },
                        {
                            col:"customerKind",
                            friendly:"客户类别",//居民还是非居民
                            sorting:false,
                            index:17
                        },
                        {
                            col:"ctmArchiveId",
                            friendly:"重新生成抄表计划",
                            //hidden:true,
                            unique:true,
                            nonedit:"nosend",
                            readonly:"readonly",
                            format:operateFormat,
                            sorting:false,
                            index:18
                        },
                        /*{
                            col:"ctmArchiveId",
                            friendly:"重新生成抄表计划",
                            format:operateFormat,
                            sorting:false,
                            index:19
                        }*/


                    ],
                    findFilter: function(){//find function
                        var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
                        var whereinfo = '1=1';

                        if ($('#bookNumber').val()) {
                            whereinfo += " and b.book_code = '"+$('#bookNumber').val()+"'";
                        }
                        if($('#bookAddress').val()) {
                            whereinfo +=" and b.address like '%"+$('#bookAddress').val()+"%'";
                        }


                        if(login_user.station_id && login_user.station_id == '1'){//核算员
                            whereinfo += " and b.serviceper_id = '"+login_user_id+"' ";
                        }else if(login_user.station_id && login_user.station_id=='2'){//抄表员
                            whereinfo +=" and b.countper_id = '"+login_user_id+"' ";
                        }else{
                            whereinfo +=" and b.area_id in ( select area_id"+
                            " from gas_biz_area where parent_area_id='"+area_id+"' and status<>'3' union "+
                            " select area_id from gas_biz_area where status<>'3' start with area_id='"+area_id+"' connect by prior area_id=parent_area_id "+
                            " ) ";
                        }

                        if($('#find_unit option:selected').val()) {
                            whereinfo += " and b.area_id = '" + $('#find_unit option:selected').val() + "' ";
                        }
                        if($('#find_countPer option:selected').val()){
                            whereinfo +=" and b.countper_id='"+$('#find_countPer option:selected').val()+"' ";
                        }
                        if($('#find_servicePer option:selected').val()){
                            whereinfo += " and b.serviceper_id='"+$('#find_servicePer option:selected').val()+"' ";
                        }

                        if($('#find_booktype option:selected').val()){
                            whereinfo +=" and b.book_type='"+$('#find_booktype option:selected').val()+"' ";
                        }

                        if($('#find_bookcode').val()){
                            whereinfo +=" and b.book_code='"+$('#find_bookcode').val()+"' ";
                        }
                        if($('#find_gasTypeId option:selected').val()){
                            whereinfo +=" and a.gas_type_id='"+$('#find_gasTypeId option:selected').val()+"' ";
                        }
                        if($('#find_customerCode').val()){
                            whereinfo +=" and a.customer_code='"+$('#find_customerCode').val()+"' ";
                        }
                        if($('#find_customerName').val()){
                            whereinfo +=" and a.customer_name like '%"+$('#find_customerName').val()+"%' ";
                        }

                        if($('#find_customerState option:selected').val()){
                            whereinfo +=" and a.customer_state='"+$('#find_customerState option:selected').val()+"' ";
                        }
                        if($('#find_customerAddress').val()){
                            whereinfo +=" and a.customer_address like '%"+$('#find_customerAddress').val()+"%' ";
                        }
                        if($('#find_idcardno').val()){
                            whereinfo +=" and a.idcard ='"+$('#find_idcardno').val()+"' ";
                        }
                        /*if(){

                        }*/
                        whereinfo +=" and b.status<>'3' ";
                        whereinfo +=" and a.customer_state<>'99' ";
                        var bd = {
                            "cols":"a.ctm_archive_id,a.bookId,b.areaId,b.countperId,b.serviceperId,b.bookCode," +
                            " a.customerCode,a.customerName,a.meterUserName,a.customerAddress,a.gasTypeId,a.mobile,a.customerType," +
                            " bs.has_business,a.customerKind ",
                            "froms":" gas_ctm_archive a " +
                            " left join gas_mrd_book b on b.book_id = a.book_id " +
                            " left join (select count(1) has_business ,br.ctm_archive_id,br.customer_code " +
                            " from gas_csr_busi_register br where br.bill_state='N' and br.blank_out_sign='N' group by br.ctm_archive_id,br.customer_code ) bs on bs.ctm_archive_id=a.ctm_archive_id ",
                            "wheres":whereinfo,
                            "page":"true",
                            "limit":50
                        };
                        xw.setRestURL(base_url+ encodeURIComponent(JSON.stringify(bd)));
                        return "";
                    }
                });



        },
        linkage : function(){

            $(document).on('click','.btn_plan',function(e){
                var ctmarchiveid = $(this).attr('data-id');

                var rows = xw.getTable().getData(false).rows;
                var selectedrow;
                rows.forEach(function(row) {
                    if(row.ctmArchiveId==ctmarchiveid){
                        selectedrow=row;
                    }
                });
                if(!selectedrow)
                {
                    alert("未找到相关数据");
                    return;

                }
               // console.log(selectedrow);
               forplan={"ctmarchiveids":selectedrow.ctmArchiveId};

                $.ajax({
                    url : "/hzqs/pla/pbgpl.do?fh=GPLPLA0000000J00&resp=bd",
                    //+JSON.stringify(forplan),
                    //dataType:'json',
                    type:'POST',
                    contentType:"application/json; charset=utf-8",
                    data:JSON.stringify(forplan),
                    success:function(result){
                        if(result.err_code =="1"){
                            bootbox.alert("<h3>更新抄表计划。</h3>");

                        }else{
                            bootbox.alert("更新失败，请重试。");
                        }
                    }
                });

            });
        }
    }


}();