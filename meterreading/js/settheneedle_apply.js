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

var SettheneedleApply = function () {

    return {
        init: function () {
            this.initlinkage();
            this.reload();
        },
        reload: function () {
            // 选择 需要定针的表：sttheneddle_meter == 控制显示
            $('#sttheneddle_meter').on('change', function (e) {
                var settheneddle = $("#sttheneddle_meter option:selected").val();
                var user_info = JSON.parse(localStorage.getItem("user_info"));

                //employeeHelper.getDisplay()
                // GasModSys.employeeHelper.getDisplay()
                $("#operate").val(GasModSys.employeeHelper.getDisplay(user_info.userId));
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

            });

        },
        initlinkage: function () {

            $('.file-loading').fileinput({
                language: 'zh'
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

            //    var c_arr = copytime.split("-");

                //busiId = "S" + c_arr[0] + c_arr[1] + c_arr[2] + ctmarchiveId + '76';//定针抄表
                busiId = $.md5( "S" +ctmarchiveId + new Date().getTime());
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
            	var data = xw.getTable().getData(true);
			    if (!data.rows.length) {
			        data = xw.getTable().getData();
			        if (!data.rows.length || data.rows.length > 1) {
			            bootbox.alert("请选择一个客户");
			            return;
			        }
			    }
                var login_info = JSON.parse(localStorage.getItem("user_info"));
                $("#operate").val(GasModSys.employeeHelper.getDisplay(login_info.userId));
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

                //var ctmarchiveId =  Restful.findNQ(queryUrl);

                var ctmarchiveId = Restful.findNQ(queryUrl);
                if (ctmarchiveId.length == 0) {
                    bootbox.alert("客户档案ID不能空！");
                    return false;
                } else {
                    ctmarchiveId = ctmarchiveId[0].ctmArchiveId;
                }
                // console.log(ctmarchiveId);


             //   var c_arr = copytime.split("-");
                if (!busiId || busiId == '') {
                  //  busiId = "S" + c_arr[0] + c_arr[1] + c_arr[2] + ctmarchiveId + '76';//定针抄表
                    busiId= $.md5( "S" + ctmarchiveId + new Date().getTime());
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

                if (ctmarchiveId.length == 0) {
                    bootbox.alert("客户档案ID不能空！");
                    return false;
                } else {
                    ctmarchiveId = ctmarchiveId[0].ctmArchiveId;
                }
                if (!$("#re_meterreading").val()) {
                    bootbox.alert("更正燃气表读数不能为空！");
                    return false;
                }
                if (!$('#re_chargementreading').val()) {
                    $('#re_chargementreading').val('0');
                }
                //是否定二次表——是否有二次表
                // detail.revisemeterstate
                var settheneddle = $("#sttheneddle_meter option:selected").val();

                if (detail.revisemeterstate && detail.revisemeterstate != "09" && (settheneddle == '2' || settheneddle == '3')) {//判断 修正表读数是否为空
                    if (!$('#re_revisereading').val()) {
                        bootbox.alert("更正修正表读数不能为空！");
                        return false;
                    }

                }

                if (!detail.customerkind || "无" == detail.customerkind) {
                    bootbox.alert("客户类型为空");
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
                if (customer_type && customer_type !='无' && customer_type == 'I') {
                    if (!$('#re_accountgasnum').val()) {
                        bootbox.alert("更正IC卡表表内累计气量不能为空！");
                        return false;
                    }
                    if ((meter_kind && meter_kind == '02') && ((!$('#re_remaingasnum').val()) || $('#re_remaingasnum').val() == '无')) {//气量
                        bootbox.alert("更正IC卡表表内余量不能为空！");
                        return false;
                    }
                    if (customer_kind && meter_kind == '03' && (!$('#re_cardbalanceesum').val()) && $('#re_cardbalanceesum').val()=='无') {//气额
                        bootbox.alert("更正IC卡表表内余额不能为空！");
                        return false;
                    }
                }
//ADJUSTP

                var userInfo = JSON.parse(localStorage.getItem("user_info"));


                var is_save_ok = true;
                bootbox.confirm("是否保存申请", function (result) {
                    console.log(result);
                    if (result) {
                        var flow_def_id = "ADJUSTP";
                        if (!busiId || busiId == '') {

                        //    var c_arr = ($('#re_copytime').val()).split("-");
                           // busiId = "S" + c_arr[0] + c_arr[1] + c_arr[2] + detail.ctmarchiveid + '76';//定针抄表
                            busiId= $.md5( "S"  + ctmarchiveId + new Date().getTime());
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
                            "planCopyTime": new Date($('#re_copytime').val()+"-00:00"),
                            "copyTime": new Date($('#re_copytime').val()+"-00:00"),
                            "isMrd": '1',
                            "isBll": '0',
                            "copyState": 'M',//暂定为删除状态——等审批过后变为 已录入
                            "copyType": '76',//定针抄表
                            "chargeMeterReading": 0,//$("#re_chargemeterreading").val()
                            "gasTypeId": detail.gastypeid,
                            "chargeMeter": $('#chargemeter option:selected').val(),
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
                            if (detail.meterKind == '02' || ($('#re_remaingasnum').val() && $('#re_remaingasnum').val()!='无')) {
                                apply.remaingAsnum = $('#re_remaingasnum').val();//remaingAsnum
                            }
                            if (detail.meterKind == '03' || ($('#re_cardbalanceesum').val() && $('#re_cardbalanceesum').val() !='无') ) {
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
                                    var flow_def_id = "ADJUSTP";
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
                                    apply.customerName = detail.customername;
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
                                                message: '定针申请提交成功',
                                                callback: function () {

													//apply 中删除掉：
													//反馈图片id，反馈信息 不要
													//  delete apply["feedbackPhoto"];
													//  delete apply["feedback"];
													// apply.busiId = apply.meterReadingId;
                                                    //维护业务记录表
                                                    var reservedField1s={
                                                        "sttheneddle_meter":$("#sttheneddle_meter").val(),
                                                        "re_meterreading":$("#re_meterreading").val(),
                                                        "re_chargemeterreading":$("#re_chargemeterreading").val(),
                                                        "chargemeter":$("#chargemeter").val(),
                                                        "operate":$("#operate").val(),
                                                        "re_copytime":new Date($("#re_copytime").val()+"-00:00"),
                                                        "remark":$("#remark").val(),
                                                        // "re_feedback":$("#re_feedback").val(),
                                                        "busiId":apply.meterReadingId,
                                                        "files":busiId,
                                                    }
                                                    var businessdate = {
                                                        "busiRegisterId": flow_inst_id,
                                                        "businessTypeId": flow_def_id,
                                                        "ctmArchiveId": detail.ctmarchiveid,
                                                        "areaId": detail.areaid,
                                                        "customerCode": detail.customercode,
                                                        "customerName": detail.customername,
                                                        "customerAddr": detail.customeraddress,
                                                        "linkMan": detail.linkman,
                                                        "linkPhone": detail.linkphone,
                                                        "busiAcceptCode": flow_inst_id.substring(0,11),
                                                        "acceptDate": new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                                                        "flowInstance": flow_inst_id,
                                                        "blankOutSign": 'N',
                                                        "createdTime": new Date(moment().format('YYYY-MM-DD HH:mm:ss')+"-00:00"),
                                                        "createdBy": userInfo.userId,
                                                        "billState":0,//业务受理：受理中
                                                        "reservedField1":JSON.stringify(reservedField1s)
                                                    };
                                                    console.log(businessdate)
                                                    var burest = Restful.insert(hzq_rest + "gascsrbusiregister", businessdate);
                                                    if (burest['success']) {
                                                        $("#submit_btn").removeClass("disabled");
                                                    } else {
                                                        Restful.insert(hzq_rest + "gascsrbusiregister", businessdate);
                                                    }
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
                            //删除 定针保存的

                            bootbox.alert("抄表定针申请保存失败");
                        }

                    }

                });


            });


        }
    }
}();

