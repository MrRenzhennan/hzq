var pic_count, pic_ids, busiId;
function clearAll() {
    $(':input', '#setmeter')
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected')
        .prop("disabled", false);
}
function onCustomerSelected(detail) {
    //  console.log(detail);
    //初始化清空所有值
    clearAll();
    if (detail != null) {
        if (detail.customerkind && detail.customerKind != '无' && detail.customerkind == '1') {//居民只定一次表
            $("#sttheneddle_meter").val("1").trigger("change");
        } else if (detail.revisemeterstate && detail.revisemeterstate == '09') {//没有修正表
            $("#sttheneddle_meter").val("1").trigger("change");
        }
        var chagingmeter = "1";
        if (detail.chargingmeter == "无") {
            chagingmeter = "1"
        }
        if (detail.chargingmeter) {
            $("#chargemeter").val(chagingmeter).trigger("change");
        }
        if (detail.vbvbt && "无" != detail.vbvbt) {
            $("#vbvbt").val(detail.vbvbt).trigger("change");
            $('#vbvbt').prop("disabled", true);
        }
        if (detail.customertype && "无" != detail.customertype && "I" == detail.customertype) {
            //是否IC卡表
            $('#ic_meter').show();
            $('#re_accountgasnum').val(detail.accountgasnum);
            if (detail.meterkind && "无" != detail.meterkind && " 03" == detail.meterkind) {//金额表
                $('#ic_measure').hide();
                $('#ic_account').show();
                $('#re_cardbalanceesum').val(detail.cardbalanceesum);
            } else if (detail.meterkind && "无" != detail.meterkind && "02" == detail.meterkind) {//气量表
                $('#ic_account').hide();
                $('#ic_measure').show();
                $('#re_remaingasnum').val(detail.remaingasnum);
            }
        } else {//没有IC卡表
            $('#ic_meter').hide();
            $('#ic_measure').hide();
            $('#ic_account').hide();
        }
        if (detail.revisemeterstate && detail.revisemeterstate != '09' && detail.revisemeterstate != "无") {//是否有修正表
            //有修正表
            $('#re_revise').show();
            $('#box_vbvbt').show();
            $('#re_revisereading').val(detail.revisereading);

        } else {
            $('#re_revise').hide();
            $('#box_vbvbt').hide();
        }
        $('#re_meterreading').val(detail.meterreading);

    }

}

var MrdErrorApply = function () {

    return {
        init: function () {
            this.initlinkage();
            this.reload();
        },
        reload: function () {
            // 选择 需要定针的表：sttheneddle_meter == 控制显示
            /*$('#sttheneddle_meter').on('change', function (e) {
                var settheneddle = $("#sttheneddle_meter option:selected").val();

                if (settheneddle && settheneddle == '1') {//定一次表
                    $('#box_meterreading').show();
                    $('#re_revise').hide();
                    $('#box_vbvbt').hide();
                } else if (settheneddle && settheneddle == '2') {//定二次表
                    $('#box_meterreading').hide();
                    $('#re_revise').show();
                    $('#box_vbvbt').show();
                } else if (settheneddle && settheneddle == '3') {//定 一次表和二次表
                    $('#box_meterreading').show();
                    $('#re_revise').show();
                    $('#box_vbvbt').show();
                }

            });*/

        },
        initlinkage: function () {
            var charge_reading = null;

            $('.file-loading').fileinput({
                language: 'zh'
            });

            $('#find_chargemeterreading').on('click',function(e){
                //判断
                if (!$("#re_meterreading").val()) {
                    bootbox.alert("更正燃气表读数不能为空。");
                    return false;

                }


                if(detail.revisemeterstate && detail.revisemeterstate !="无" && detail.revisemeterstate != "09"){
                    if (!$('#re_revisereading').val()) {
                        bootbox.alert("更正修正表读数不能为空。");
                        return false;
                    }
                    charge_reading = Number($('#re_revisereading').val())- Number(detail.revisereading);
                }

                var customer_type = detail.customertype;
                var customer_kind = detail.customerkind;
                if (customer_type && customer_type == 'I') {
                    if (!$('#re_accountgasnum').val()) {
                        bootbox.alert("更正IC卡表表内累计气量不能为空。");
                        return false;
                    }
                    if (meter_kind && meter_kind == '02' && (!$('#re_remaingasnum').val())) {//气量
                        bootbox.alert("更正IC卡表表内余量不能为空。");
                        return false;
                    }
                    if (customer_kind && meter_kind == '03' && (!$('#re_cardbalanceesum').val())) {//气额
                        bootbox.alert("更正IC卡表表内余额不能为空。");
                        return false;
                    }
                    charge_reading = Number($('#re_accountgasnum').val())-Number(detail.accumulatedgas);
                }else if((detail.revisemeterstate && detail.revisemeterstate !="无" && detail.revisemeterstate=='09') || (customer_type && customer_type=='P' && customer_type !='无')){
                    console.log(Number($('#re_meterreading').val()));
                    console.log(Number(detail.meterreading));
                    charge_reading = Number($('#re_meterreading').val())-Number(detail.meterreading);
                }

                $('#re_chargemeterreading').val(charge_reading);
            });

            $(document).on("click", '#a_fileupload .fileinput-upload-button', function () {
                var copytime = $('#re_copytime').val();
                if (!copytime) {
                    bootbox.alert("抄表时间不能为空！");
                    return false;
                }
                var customerCode = $("#find_key").val();
                var queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("customerCode", customerCode),
                ]).rql()
                var queryUrl = hzq_rest + 'gasctmarchive?fields={"ctmArchiveId":"1"}&query=' + queryCondion;

                var ctmarchiveId = Restful.findNQ(queryUrl);
                if (ctmarchiveId.length == 0) {
                    bootbox.alert("客户档案ID不能空！");
                    return false;
                } else {
                    ctmarchiveId = ctmarchiveId[0].ctmArchiveId;
                }

                var c_arr = copytime.split("-");

                busiId = "S" + c_arr[0] + c_arr[1] + c_arr[2] + ctmarchiveId + '61';//定针抄表
                // fileId = GasModService.getUuid();
                var form = new FormData(document.getElementById('a_fileupload'));
                $.ajax({
                    url: "/hzqs/sys/upload.do?busiId=" + busiId + "",
                    data: form,
                    dataType: 'text',
                    processData: false,
                    contentType: false,
                    async: false,
                    type: 'POST',
                    success: function (data) {

                        if (JSON.parse(data).length != 0) {
                            bootbox.alert('导入成功！');
                            // return pid;
                        } else {
                            bootbox.alert("导入失败！");
                        }
                        $('#a_fileupload input').val('');
                    },
                    error: function (data) {
                        bootbox.alert(data);
                        if (arguments[0].status == '413') {
                            bootbox.alert("文件不能超过1M");
                        }
                        $("#fileId").val('');
                    }
                });
            })

            var user_info = JSON.parse(localStorage.getItem("user_info"));

            //employeeHelper.getDisplay()
            // GasModSys.employeeHelper.getDisplay()
            $("#operate").val(GasModSys.employeeHelper.getDisplay(user_info.userId));

            var apply;

            var flow_inst_id = '';

            //提交
            $("#submit_btn").on('click', function () {
                var login_info = JSON.parse(localStorage.getItem("user_info"));

                var copytime = $('#re_copytime').val();
                if (!copytime) {
                    bootbox.alert("抄表时间不能为空！");
                    return false;
                }

                var customerCode = $("#find_key").val();
                var queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("customerCode", customerCode)
                ]).rql()
                var queryUrl = hzq_rest + 'gasctmarchive?fields={"ctmArchiveId":"1"}&query=' + queryCondion;

                //var ctmarchiveId =  Restful.findNQ(queryUrl);

                var ctmarchiveId = Restful.findNQ(queryUrl);
                if (ctmarchiveId =='undefined' || ctmarchiveId== null || ctmarchiveId.length == 0) {
                    ctmarchiveId = detail.ctmarchiveid;
                } else {
                    ctmarchiveId = ctmarchiveId[0].ctmArchiveId;
                }

                if(ctmarchiveId == 'undefined' || ctmarchiveId == null || ctmarchiveId==''){
                    bootbox.alert("客户档案ID不能空！");
                    return false;
                }
                // console.log(ctmarchiveId);

                var c_arr = copytime.split("-");
                if (!busiId || busiId == '') {
                    busiId = "S" + c_arr[0] + c_arr[1] + c_arr[2] + ctmarchiveId + '61';//定针抄表
                }

                var qCondition = RQLBuilder.and([
                    RQLBuilder.equal("busiId", busiId),
                ]).rql()
                var qurl = hzq_rest + 'gasbasfile?fields={"fileId":"1"}&query=' + qCondition;

                var sq = Restful.findNQ(qurl);
                var pic_count = 0;
                if (sq && sq.length > 0) {
                    pic_count = sq.length;
                }

                var arr_p = new Array();
                for (var i = 0; i < pic_count; i++) {
                    arr_p.push(sq[i].fileId);
                }
                var pic_ids = '';
                if (arr_p && arr_p.length > 0) {
                    pic_ids = arr_p.join();
                }

               /* if (ctmarchiveId !== undefined && ctmarchiveId.length == 0) {
                   ctmarchiveId = detail.ctmarchiveid;
                } else {
                    ctmarchiveId = ctmarchiveId[0].ctmArchiveId;
                }
                if(ctmarchiveId == undefined || ctmarchiveId == null){
                    bootbox.alert("客户档案ID为空！");
                    return false;
                }*/
                if (!$("#re_meterreading").val()) {
                    bootbox.alert("更正燃气表读数不能为空！");
                    return false;
                }

                if (!$('#re_chargemeterreading').val()) {
                    console.log($('#re_chargemeterreading').val());
                   // $('#re_chargementreading').val('0');
                    bootbox.alert("抄表差错量为空（计费读数为空）");
                    return false;
                }
                //是否定二次表——是否有二次表
                // detail.revisemeterstate
               // var settheneddle = $("#sttheneddle_meter option:selected").val();

              //  if (detail.revisemeterstate && detail.revisemeterstate != "09" && (settheneddle == '2' || settheneddle == '3')) {//判断 修正表读数是否为空
               if(detail.revisemeterstate && detail.revisemeterstate !="无" && detail.revisemeterstate != "09"){
                   if (!$('#re_revisereading').val()) {
                        bootbox.alert("更正修正表读数不能为空。");
                        return false;
                    }

                }

                if (!detail.customerkind || "无" == detail.customerkind) {
                    bootbox.alert("客户类型为空。");
                    return;
                }
                if (!detail.bookid || '无' == detail.bookid) {
                    bootbox.alert("抄表本为空");
                    return;
                }
                //是否是IC卡表，是否定IC卡表
                var customer_type = detail.customertype;
                var meter_kind = detail.meterkind;
                if (!detail.meterkind || "无" == detail.meterkind) {
                    meter_kind = '';
                }

                var customer_kind = detail.customerkind;
                if (customer_type && customer_type == 'I') {
                    if (!$('#re_accountgasnum').val()) {
                        bootbox.alert("更正IC卡表表内累计气量不能为空！");
                        return false;
                    }
                    if (meter_kind && meter_kind == '02' && (!$('#re_remaingasnum').val())) {//气量
                        bootbox.alert("更正IC卡表表内余量不能为空！");
                        return false;
                    }
                    if (customer_kind && meter_kind == '03' && (!$('#re_cardbalanceesum').val())) {//气额
                        bootbox.alert("更正IC卡表表内余额不能为空！");
                        return false;
                    }
                }
//ADJUSTP

                if(!$('#re_chargemeterreading').val()){
                    bootbox.alert("计费读数为空，请填写计费读数");
                    return false;
                }
                var userInfo = JSON.parse(localStorage.getItem("user_info"));

                //查询 抄表差错的气量
                //Restful.findNQ()
                var qcontintionvalue = RQLBuilder.and([
                    RQLBuilder.equal("parameterCode", "mrd.cbcc")
                ]).rql()
                var qcbccUrl = hzq_rest + 'gassysparameter?={"parameterValue":"1"}&query=' + qcontintionvalue;

                var sqCbcc = Restful.findNQ(qcbccUrl);

                var cbccValue = 100;
               // var ctmarchiveId = Restful.findNQ(queryUrl);
                if (sqCbcc.length == 0) {
                    bootbox.alert("抄表差错量为空，请联系管理员配置系统参数：抄表差错量。");
                    return false;
                } else {
                    cbccValue = sqCbcc[0].parameterValue;
                }
                var is_save_ok = true;
                bootbox.confirm("是否保存申请", function (result) {
                    console.log(result);
                    if (result) {
                        var measure= $('#re_chargemeterreading').val();
                        var flow_def_id = "CBCC2";
                        if(measure && Math.abs(parseInt(measure)) <= parseInt(cbccValue)){
                            flow_def_id ="CBCC2";
                        }else if(measure && Math.abs(parseInt(measure)> parseInt(cbccValue))){
                            flow_def_id ="CBCC";
                        }

                        if (!busiId || busiId == '') {

                            var c_arr = ($('#re_copytime').val()).split("-");
                            busiId = "S" + c_arr[0] + c_arr[1] + c_arr[2] + detail.ctmarchiveid + '61';//定针抄表
                        }
                        apply = {
                            "meterReadingId": busiId,
                            "ctmArchiveId": detail.ctmarchiveid,
                            "bookId": detail.bookid,
                            "areaId": detail.areaid,
                            "countperId": detail.countperid,//核算员
                            "serviceperId": detail.serviceperid,
                            "remark": $("#remark").val(),
                            "feedback": $("#re_feedback").val(),
                            "address": detail.customeraddress,
                            "copyTime": $('#re_copytime').val(),
                            "isMrd": '1',
                            "isBll": '0',
                            "copyState": 'C',//暂定为抄表差错待审批——等审批过后变为 已录入
                            "copyType": '61',//定针抄表
                            "chargeMeterReading": $("#re_chargemeterreading").val(),//$("#re_chargemeterreading").val()
                            "gasTypeId": detail.gastypeid,
                            "chargingMeter": $('#chargemeter option:selected').val(),
                            "customerKind": detail.customerkind,
                            "bookCode": detail.bookcode,
                            "operate": "S",
                            "photoCount": pic_count,
                            "feedbackPhoto": pic_ids
                        };
                        if (detail.copytime && detail.copytime != '无') {
                            apply.lastReadingDate = detail.copytime;
                        }
                        if (detail.meterreading != null && detail.meterreading != '无') {
                            apply.lastMeterReading = detail.meterreading;

                        }
                        if (detail.reviseReading != null && detail.reviseReading != '无') {
                            apply.lastReviseReading = detail.reviseReading;
                        }
                        if (detail.remaingasnum != null && detail.remaingasnum != '无') {
                            apply.lastRemaingAsnum = detail.remaingasnum;
                        }
                        if (detail.meterreadingid != null && detail.meterreadingid != '无') {
                            apply.lastMeterReadingId = detail.meterreadingid;
                        }
                        if (detail.accumulatedgas && detail.accumulatedgas != '无') {
                            apply.lastAccumulatedGas = detail.accumulatedgas;
                        }
                        var setmeter = $('#sttheneddle_meter option:selected').val();
                        if (setmeter == '1') {//判断定针的表——一次表
                            apply.meterReading = $('#re_meterreading').val();
                            if (!detail.revisereading || detail.revisereading == '无') {
                                apply.reviseReading = '';
                            } else {
                                apply.reviseReading = detail.revisereading;
                            }
                        }
                        if (setmeter == '2') {//二次表
                            apply.reviseReading = $('#re_revisereading').val();
                            if (!detail.meterreading || detail.meterreading == '无') {
                                apply.meterReading = '';
                            } else {
                                apply.meterReading = detail.meterreading;
                            }
                        }
                        if (setmeter == '3') {//一次表和二次表
                            apply.meterReading = $('#re_meterreading').val();
                            apply.reviseReading = $('#re_revisereading').val();
                        }
                        //判断 是不是IC卡表
                        if (customer_type && customer_type == 'I') {
                            apply.accumulatedGas = $('#re_accountgasnum').val();
                            if (detail.meterKind == '02' || $('#re_remaingasnum').val()) {
                                apply.remaingAsnum = $('#re_remaingasnum').val();//remaingAsnum
                            }
                            if (detail.meterKind == '03' || $('#re_cardbalanceesum').val()) {
                                apply.cardBalancEsum = $('#re_cardbalanceesum').val();
                            }
                        }
                        if (detail.meterid) {
                            apply.meterId = detail.meterid;
                        }
                        if (detail.revisemeterid) {
                            apply.reviseMeterId = detail.revisemeterid;
                        }
                        flow_inst_id = $.md5(JSON.stringify(busiId) + new Date().getTime());
                        var flowjson = {
                            "flow_def_id": flow_def_id,
                            "ref_no": flow_inst_id, // 唯一标识
                            "operator": userInfo.userId, // 流程提交人
                            "be_orgs": userInfo.area_id, // 所属角色
                            "flow_inst_id": flow_inst_id, // 流程实例id
                            "propstr2048": JSON.stringify({
                                "flow_data": apply
                            }), // 业务参数
                            "prop1str64": moment().format("YYYY-MM-DD HH:mm:ss"),
                            //"prop2str64": wfName, // 代办名称
                            "propstr128": userInfo.employee_name == "" || userInfo.employee_name == undefined ? userInfo.userId : userInfo.employee_name,  // loginName
                            "propstr256": apply.meterReadingId, //抄表表id
                            "override_exists": false
                        }

                        var result = Restful.insert(hzq_rest + "gasmrdmeterreading", apply)
                        if (result['success']) {
                            /* var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd", flowjson)*/
                            is_save_ok = true;
                            // bootbox.alert("抄表定针申请保存成功");

                            // bootbox.confirm("是否提交定针申请", function (result) {

                            //   if (result) {
                           // var flow_def_id = "CBCC";
                            var measure= $('#re_chargemeterreading').val();
                            var flow_def_id = "CBCC2";
                            if(measure && Math.abs(parseInt(measure)) <= parseInt(cbccValue)){
                                flow_def_id ="CBCC2";
                            }else if(measure && Math.abs(parseInt(measure)> parseInt(cbccValue))){
                                flow_def_id ="CBCC";
                            }
                            // var wfName = $("#linkMan").val() + "(" + currentArchive.customerCode + ")";

                            //流程
                            if (!flow_inst_id) {
                                flow_inst_id = $.md5(JSON.stringify(detail.ctmarchiveid) + new Date().getTime());
                            }
                            var vbvbt1 = '';
                            if ($('#vbvbt option:selected').val()) {
                                vbvbt1 = $('#vbvbt option:selected').val();
                            }
                            var settheneddle = $("#sttheneddle_meter option:selected").val();
                            console.log(settheneddle);
                            apply.customerType = detail.customertype;
                            apply.meterNo = detail.meterno;
                            apply.reviseMeterNo = detail.revisemeterno;
                            apply.linkMan = detail.linkman;
                            apply.linkPhone = detail.linkmantel;
                            apply.vbVbt = vbvbt1;
                            apply.smeter = settheneddle;
                            apply.feedback = "";
                            apply.remark = "";
                            apply.customerCode = detail.customercode;
                            apply.customerName = detail.customerName;
                            apply.idCard = detail.idcard;

                            //apply.meterReadingId =
                            //apply.
                            var flowjson = {
                                "flow_def_id": flow_def_id,
                                "ref_no": flow_inst_id, // 唯一标识
                                "operator": login_info.userId, // 流程提交人
                                "be_orgs": login_info.area_id, // 所属角色
                                "flow_inst_id": flow_inst_id, // 流程实例id
                                "propstr2048": JSON.stringify({
                                    // "complementId": apply.complementId,
                                    // "customerCode": apply.customerCode
                                    //"picids":pic_ids,
                                    "flow_data": apply
                                }), // 业务参数
                                "prop1str64": moment().format("YYYY-MM-DD HH:mm:ss"),
                                // "prop2str64":vbvbt1,//vb_vbt
                                "prop2str64": detail.customername + "(" + detail.customercode + ")",
                                "propstr128": login_info.userId,  // loginName
                                //"propstr256": , //审批意见
                                "override_exists": false
                            }
                            var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd", flowjson)
                            console.log(flow_result);
                            if (flow_result.retcode == "0") {
                                //更新 抄表表中的业务id
                                var res = Restful.update(hzq_rest + "gasmrdmeterreading", busiId, {
                                    wfId: flow_inst_id
                                });

                                if (res) {
                                    bootbox.alert({
                                        buttons: {
                                            ok: {
                                                /*  label: '我是ok按钮',*/
                                                className: 'btn-myStyle'
                                            }
                                        },
                                        message: '抄表差错申请提交成功',
                                        callback: function () {

                                          /*  //维护业务记录表
                                            var businessdate = {
                                                "busiRegisterId": flow_inst_id,
                                                "businessTypeId": flow_def_id,
                                                "ctmArchiveId": detail.ctmarchiveid,
                                                //"ctmMeterId":,
                                                "areaId": detail.areaid,
                                                "customerCode": detail.customercode,
                                                "customerName": detail.customername,
                                                "customerAddr": detail.customeraddress,
                                                "linkMan": detail.linkman,
                                                "linkPhone": detail.linkphone,
                                                "acceptDate": new Date(),
                                                "flowInstance": flow_inst_id,
                                                "blankOutSign": 'N',
                                                "createdTime": new Date(),
                                                "createdBy": userInfo.userId
                                            };
                                            var burest = Restful.insert(hzq_rest + "gascsrbusiregister", businessdate);
                                            if (burest['success']) {
                                                $("#submit_btn").removeClass("disabled");
                                            } else {
                                                Restful.insert(hzq_rest + "gascsrbusiregister", businessdate);
                                            }*/
                                            window.location.reload();

                                        },
                                        /*title: "bootbox alert也可以添加标题哦",*/
                                    });
                                } else {
                                    Restful.update(hzq_rest + "gasmrdmeterreading", busiId, {
                                        wfId: flow_inst_id,
                                        copyState:'9',
                                        meterReadingId:flow_inst_id
                                    });
                                }
                            }
                            //       }
                            //     })
                            //  $("#print_btn").removeClass("disabled");

                            // $("#submit_btn").removeClass("disabled");

                        } else {
                            is_save_ok = false;


                            bootbox.alert("抄表差错申请保存失败");
                        }

                    }

                });


            });


        }
    }
}();

