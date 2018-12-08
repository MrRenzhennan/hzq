
/*function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return undefined;
}*/

var gasBllNonrsdtDctId ; //initNonrsdtDctArchiveData时初始化

var applicationAdd = function () {
    var xw ;
    function getNonrsdtDctArchiveId(gasBllNonrsdtDctId) {
       var queryCondion = RQLBuilder.and([
           RQLBuilder.equal("status","1"), //1启用
           RQLBuilder.equal("nonRsdtDctId",gasBllNonrsdtDctId)
       ]).rql()

       var queryUrl =  hzq_rest + 'gasbllnonrsdtdctctm?fields={"ctmArchiveId":"1"}&query='+ queryCondion;
       var NonrsdtDctArchiveId  =Restful.findNQ(queryUrl);

       var ctmarchiveid = [];
       for(var i=0;i<NonrsdtDctArchiveId.length;i++){
           ctmarchiveid.push('"'+NonrsdtDctArchiveId[i].ctmArchiveId+'"');
       }
       return ctmarchiveid;
   };


    // 供气区域helper
    var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });

    // 用气性质helper
    var gasTypeHelper=RefHelper.create({
        ref_url:"gasbizgastype",
        ref_col:"gasTypeId",
        ref_display:"gasTypeName",
    });


    var areaFormat=function(){
        return {
            f: function(val){
                return areaHelper.getDisplay(val)==0 ? "" : areaHelper.getDisplay(val);
            },
        }
    }();
    var gasTypeFormat=function(){
        return {
            f: function(val){
                return gasTypeHelper.getDisplay(val)==0 ? "" : gasTypeHelper.getDisplay(val);
            },
        }
    }();


    return {

        init: function () {
            //this.initNonrsdtDct();
           // this.initArchive();
        },

        initNonrsdtDctArchiveData: function (NonrsdtDctArchive) {
            $("#pdivtable").css("display","none");
            $("#apply_new").css("display","block");
            var json = eval(NonrsdtDctArchive);
            gasBllNonrsdtDctId = json.nonRsdtDctId; //初始化gasBllNonrsdtDctId
            $("#customer_name").html(json.customerName);
            $("#customer_tel").html(json.customerTel);
            $("#customer_address").html(json.customerAddress);
            $("#belong_to").html(json.belongTo);
            $("#discount_type").html(GasModBil.DiscountType.f(json.discountType));
            $("#treaty_start_time").html(GasModBil.dateFormat.f(json.treatyStartTime));
            $("#treaty_end_time").html(GasModBil.dateFormat.f(json.treatyEndTime));
            $("#measure_price").html(GasModBil.measure_price(json));
            $("#remark").html(json.remark);
            $("#attach_file").html(json.remark);
        },

        //展示已申请的过的客户
        /*initArchive:function (gasBllNonrsdtDctId) {
            $("#vip_exist_customer_table").css("display","block")
            var  ctmarchiveid =getNonrsdtDctArchiveId(gasBllNonrsdtDctId);
            var baseUrl = RQLBuilder.and([
                RQLBuilder.condition_fc("ctmArchiveId","$in","["+ctmarchiveid.join()+"]")
            ]).rql()
            var nonrsdtDctArchive = Restful.findNQ(hzq_rest+ 'gasctmarchive?query='+baseUrl);
            $.each(nonrsdtDctArchive, function (idx, row) {
                var item = "" +
                    "<tr>" +

                    "<td>"+row.customerCode+"</td>" +
                    "<td>"+row.customerName+"</td>" +
                    "<td>"+row.customerAddress+"</td>" +
                    "<td>"+row.ctmArchiveId+"</td>" +
                    "</tr>";
                $('#vip_customer_tbody').append(item);
                })

        },*/
        //软删除-改状态
        delArchive4Nonrsdt: function (ctmArchiveId,gasBllNonrsdtDctId){
            bootbox.confirm("确定删除吗?", function(result) {
                if(result===false){

                }else {
                    var example={};
                    example.ctmArchiveId = ctmArchiveId;
                    example.gasBllNonrsdtDctId = gasBllNonrsdtDctId;
                    var queryUrl =  hzq_rest + 'gasbllnonrsdtdctctm?example='+ JSON.stringify(example);
                    var psotUpdate={};
                    psotUpdate.status="3";
                    psotUpdate.modifiedBy="admin";
                    var ret = Restful.updateNQ(queryUrl,JSON.stringify(psotUpdate));
                    if(ret===false){
                        bootbox.alert("更新失败...")
                    }else{
                        bootbox.alert("更新成功...", function () {
                            window.location.reload();
                        })
                    }
                }
            });
        }



    }
}();





var singleCreate = function(){
    var xw;
    
    function isExistInNonrsdtDct(ctmArchiveId, status){
        var queryCondion = RQLBuilder.and([
            RQLBuilder.equal("ctmArchiveId",ctmArchiveId),
            RQLBuilder.condition_fc("status","$in","["+status.join()+"]")
        ]).rql()
        var queryUrl =  hzq_rest + 'gasbllnonrsdtdctctm?fields={"ctmArchiveId":"1"}&query='+ queryCondion;
        var nonrsdtdctctmObj  =Restful.findNQ(queryUrl);
        if (nonrsdtdctctmObj && nonrsdtdctctmObj.length > 0) {
            return 1;
        }
        return 0;
    }


    //判断大客户是否在已经提交了审批流程
    function isExistInNonrsdtDctFow(ctmArchiveId, status){
        //400077,400079,400078
       /* SELECT  ARCHIVEIDS  FROM  GAS_BLL_NONRSDT_DCT_FLOW  WHERE
        STATUS in (1,2)
        AND (ARCHIVEIDS='400079'
        OR ARCHIVEIDS LIKE '%400079,'
        OR ARCHIVEIDS LIKE '%,400079'
        OR ARCHIVEIDS LIKE '%,400079,%' )*/
        var bd={
            "cols": "archiveids",
            "froms":" gasBllNonrsdtDctFlow ",
            "wheres": " status in ("+status.join()+") "+
                      " and (archiveids='" +ctmArchiveId+"'"+
                      " or archiveids like'"+ ctmArchiveId +",%' "+
                      " or archiveids like'%,"+ctmArchiveId+"'"+
                      " or archiveids like'%,"+ctmArchiveId+",%' )"
        };
        var queryUrl = "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd));
        console.log("url:"+queryUrl);
       // var queryUrl =  hzq_rest + 'gasbllnonrsdtdctflow?fields={"ctmArchiveId":"1"}&query='+ queryCondion;
        var nonrsdtdctctmObj  =Restful.findNQ(queryUrl);
        if (nonrsdtdctctmObj.rows && nonrsdtdctctmObj.rows.length > 0) {
            return 1;
        }
        return 0;
    }

    function insertNonrsdtDct(jsonOpts) {
        var parameter = jsonOpts;
        //先查询是否存在,如果存在更新状态
        var status =[];
        status.push("2");//状态 1启用 2停用 3已删除
        status.push("3");
        var ret =isExistInNonrsdtDct(parameter.ctmArchiveId,status);
        if(ret==1){
            var example={};
            example.ctmArchiveId = parameter.ctmArchiveId;
            example.gasBllNonrsdtDctId = parameter.gasBllNonrsdtDctId;
            var queryUrl =  hzq_rest + 'gasbllnonrsdtdctctm?example='+ JSON.stringify(example);
            var psotUpdate={};
            psotUpdate.status="1";
            psotUpdate.modifiedBy="admin";
            var ret = Restful.updateNQ(queryUrl,JSON.stringify(psotUpdate));
            if(ret===false){
                bootbox.alert("更新失败...")
            }else{
                bootbox.alert("更新成功...", function () {
                    window.location.reload();
                })
            }
        }else{//不存在直接更新
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: hzq_rest + "gasbllnonrsdtdctctm",
                type:"POST",
                datatype:"json",
                data:JSON.stringify(parameter),
                success:function(e){
                    if(e.success){
                        bootbox.alert("<br><center><h4>添加成功！</h4></center><br>");
                        $('.btn-primary').on('click',function(){
                            window.location.reload();
                        })
                    }else{
                        bootbox.alert("<br><center><h4>添加失败！</h4></center><br>");
                    }
                }
            })
        }

    }



    var clickPlus = function () {
        return {
            f : function (val,row) {
                rows = JSON.stringify(row)
                //console.log(rows)
                return "<a data-row='"+rows+"'  onclick='singleCreate.addCustomer($(this))'>&nbsp添加</a>";
            }
        }
    }();

    return {


        init:function(){
            this.reload();
            this.initAction();
        },

        reload:function () {
            var query = RQLBuilder.and([RQLBuilder.or([
                                RQLBuilder.equal("customerKind","9")
                                ,RQLBuilder.equal("customerKind","B")
                            ])]).rql();
            xw = XWATable.init({
                divname: "divtable2",
                //----------------table的选项-------
                pageSize: 10,
                columnPicker: true,
                transition: 'fade',
                checkAllToggle: true,
                checkboxes: true,
                //----------------基本restful地址---
                restbase: 'gasctmarchive?query=' + query,
                key_column: 'ctmArchiveId',
                coldefs:[
                    {
                        col:"customerCode",
                        friendly:"客户编号",
                        //unique:"true",
                        sorting:false,
                        index:1
                    },
                    {
                        col:"customerName",
                        friendly:"客户名称",
                        sorting:false,
                        index:2
                    },
                    {
                        col:"customerAddress",
                        friendly:"客户地址",
                        sorting:false,
                        index:3
                    },
                    {
                        col:"customerState",
                        friendly:"客户状态",
                        format:GasModCtm.customerStateFormat,
                        sorting:false,
                        index:4
                    },
                    {
                        col:"createdTime",
                        friendly:"操作",
                        format:clickPlus,
                        index:5
                    }
                ],
                findFilter: function(){
                    var queryUrl=hzq_rest+"gasctmarchive";
                    var querys=new Array()

                    if ($('#customerCode').val()) {
                        querys.push(RQLBuilder.like("customerCode", $('#customerCode').val()))

                    }
                    if ( $('#customerAddress').val()) {
                        querys.push(RQLBuilder.like("customerAddress", $('#customerAddress').val()));
                    }

                    if ($('#customerName').val()) {
                        querys.push(  RQLBuilder.like("customerName", $('#customerName').val()));
                    }

                    //添加判断非居民的条件
                    querys.push(RQLBuilder.or([
                        RQLBuilder.equal("customerKind","9")
                        ,RQLBuilder.equal("customerKind","B")
                    ]));
                    if(querys.length>0){
                        queryUrl += "?query="+RQLBuilder.and(querys).rql();
                    }
                    xw.setRestURL(queryUrl);
                    xw.update();
                    return "";
                }
            });

        },

        addCustomer:function(rowStr){
            //console.log($(rowStr).attr('data-row'))
            var row= JSON.parse($(rowStr).attr('data-row'))
           // console.log("row:"+row)
            var ctmArchiveId =row.ctmArchiveId;
            console.log(row.ctmArchiveId);
            var status =[];
            status.push("1");
            var isTure = isExistInNonrsdtDct(ctmArchiveId,status);
            if(isTure==1){
                bootbox.alert("<br><center><h4>该用户已经在大客户合同中！</h4></center><br>");
                return false;
            }
            status.push("2");
            var isTure = isExistInNonrsdtDctFow(ctmArchiveId,status);
            if(isTure==1){
                bootbox.alert("<br><center><h4>该用户已经提交申请了,不能重复提交申请！</h4></center><br>");
                return false;
            }

            var ctmArchiveIdInput=document.getElementsByName("ctmArchiveId");
            if(ctmArchiveIdInput.length != 0){
                var ctmArchiveIdArr=[];
                $.each(ctmArchiveIdInput, function (indx,val) {
                    ctmArchiveIdArr.push(val.value);
                })
                if($.inArray(ctmArchiveId, ctmArchiveIdArr) != -1){
                    bootbox.alert("<br><center><h4>不能重复添加同一个用户！</h4></center><br>");
                    return false;
                }
            }

            var item = "" +
                "<tr>" +
                "<td width='15px' class='remove_item'><span class='glyphicon glyphicon-remove'></span></td>" +
                // "<td><input type='text' class='form-control' placeholder='地址'></td>" +
                "<td><input name='customerCode' type='text'  class='form-control' readonly value='"+row.customerCode+"'></td>" +
                "<td><input name='customerName' type='text'  class='form-control' readonly value='"+row.customerName+"'></td>" +
                "<td><input name='customerAddress' type='text'  class='form-control' readonly value='"+row.customerAddress+"'></td>" +
                "<td><input name='ctmArchiveId' type='text'  class='form-control' readonly  value='"+row.ctmArchiveId+"'></td>" +
                "</tr>";
            $('#tbody').append(item);
            $('.remove_item').click(function () {
                $(this).parent().remove();
            });
        },


        initAction:function () {
            $('#submit_btn2').click(function () {
                var ctmArchiveIdInput=document.getElementsByName("ctmArchiveId");
                if(ctmArchiveIdInput.length == 0){
                    bootbox.alert("客户不能空！");
                    return false;
                }
                var ctmArchiveId=[];
                $.each(ctmArchiveIdInput, function (indx,val) {
                    ctmArchiveId.push(val.value);
                })

                var nonRstdtDctFlow ={};
                //生产UUID
                nonRsdtDctFlowId = $.md5(JSON.stringify(ctmArchiveId)+new Date().getTime());
                nonRstdtDctFlow.nonRsdtDctFlowId = nonRsdtDctFlowId;
                nonRstdtDctFlow.nonRsdtDctId = gasBllNonrsdtDctId;
                nonRstdtDctFlow.status = "1";
                var user = JSON.parse(localStorage.getItem("user_info"));
                nonRstdtDctFlow.createdBy=UserInfo.userId();
                nonRstdtDctFlow.areaId=user.area_id;
                console.log(" nonRstdtDctFlow.areaId:"+ nonRstdtDctFlow.areaId)
                nonRstdtDctFlow.treatyEndTime = new Date();
                nonRstdtDctFlow.createdTime = new Date();
                nonRstdtDctFlow.archiveids =ctmArchiveId.join();

                //流程的sql
                var flow_sql = {};
                flow_sql.nonRsdtDctId=gasBllNonrsdtDctId;
                flow_sql.nonRsdtDctFlowId = nonRsdtDctFlowId;
                flow_sql.createdBy=UserInfo.userId();
                flow_sql.areaId=user.area_id;
                flow_sql.archiveids =ctmArchiveId.join();
                console.log("flow_sql=="+JSON.stringify(flow_sql));

                var result = Restful.insert(hzq_rest + "gasbllnonrsdtdctflow",nonRstdtDctFlow)

                console.log("submit:result:"+JSON.stringify(result));
                console.log("areaid:"+user.area_id);
                if(result['success']){
                    flowjson = {"flow_def_id":"VIPCUSTOMERA","ref_no":nonRstdtDctFlow.nonRsdtDctFlowId,"operator":nonRstdtDctFlow.createdBy,"be_orgs":user.area_id,
                        "flow_inst_id":nonRsdtDctFlowId,
                        "propstr2048":{"cusotmer":"BATCH","busitype":"大客户申请"},
                        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
                        "prop2str64":$("#customer_name").html(),//"大客户名称"
                        "propstr128":"营业部系统管理员",
                        "propstr256":flow_sql,
                        "override_exists":false}

                    var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson)

                    console.log("flow_result:"+JSON.stringify(flow_result));

                    bootbox.alert("提交成功",function () {
                        window.location.href="charging/big_cus_dis_rate_approval.html"
                    });
                }else{
                    bootbox.alert("提交失败");
                }
            });
        }

    }
}();