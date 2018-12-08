/**
 * Created by alex on 2017/3/27.
 */
var customerKindEmnu = {
    "1": "居民",
    "9": "非居民"
}


function idcard(idcardinformation) {
    $("#customerNames").val(idcardinformation.name);
    $("#idcard").val(idcardinformation.code);

    /* $("#idcard_type").val("2").trigger("change");
     $("#idcard_type").on("change",function(){
     console.log($(this).val())
     if($(this).val()=="2" || $(this).val()=="5"){
     $("#idcard").val(idcardinformation.code);

     }else{
     $("#idcard").val("")
     }
     })*/
}

var ChangeYarchives = function () {
    var customerAddress;
    var customerName;
    var customerKind;
    var customerTel;
    var occurrencetime;
    var idcard;
    var opertor = "";
    var pid;
    var linkman;
    var linktel;
    var remark;
    var bookingtime;
    var newjp;
    var ctmArchiveId;
    var houseId;

    return {
        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
            this.initAction();
        },
        reload: function () {

        },

        initAction: function () {
            $("#save_btn").on('click', function () {
                pid = getUuid();

                occurrencetime = new Date().toLocaleString();
                var employee_name = JSON.parse(localStorage.getItem("user_info")).employee_name;
                if (employee_name) {
                    opertor = employee_name;
                } else {
                    opertor = JSON.parse(localStorage.getItem("user_info")).userId;
                }
                var data = xw.getTable().getData(true);
                if (!data.rows.length) {
                    data = xw.getTable().getData();
                    if (!data.rows.length || data.rows.length > 1) {
                        bootbox.alert("请选择一个客户！");
                        return;
                    }
                }
                ctmArchiveId = data.rows[0].ctmArchiveId;
                houseId = data.rows[0].houseId;
                customerCode = data.rows[0].customerCode;
                customerAddress = data.rows[0].customerAddress;
                idcard = data.rows[0].idcard;
                customerName = data.rows[0].customerName;
                customerKind = data.rows[0].customerKind;
                customerTel = data.rows[0].tel;
                var newCustomerName = $('#customerNames').val();
                var newTel = $('#tel').val();
                var newCardType = $('#idcard_type').val();
                var idCard = $('#idcard').val();
                var customerAddress = '';
                if ($('input[name="borough"]').val().length > 0
                    || $('input[name="street"]').val().length > 0
                    || $('input[name="doorplateNum"]').val().length > 0
                    || $('input[name="district"]').val().length > 0
                    || $('input[name="floorNum"]').val().length > 0
                    || $('input[name="cell"]').val().length > 0
                    || $('input[name="storey"]').val().length > 0
                    || $('input[name="roomNum"]').val().length > 0
                    || $('input[name="subRoomNum"]').val().length > 0
                ) {

                    if ($('input[name="borough"]').val().length > 0) {
                        customerAddress += $('input[name="borough"]').val() + '区';
                    }
                    if ($('input[name="street"]').val().length > 0) {
                        customerAddress += $('input[name="street"]').val() + '路(街)'
                    }
                    if ($('input[name="doorplateNum"]').val().length > 0) {
                        customerAddress += $('input[name="doorplateNum"]').val() + '门牌号'
                    }
                    if ($('input[name="district"]').val().length > 0) {
                        customerAddress += $('input[name="district"]').val() + '小区'
                    }
                    if ($('input[name="floorNum"]').val().length > 0) {
                        customerAddress += $('input[name="floorNum"]').val() + '楼号'
                    }
                    if ($('input[name="cell"]').val().length > 0) {
                        customerAddress += $('input[name="cell"]').val() + '单元'
                    }
                    if ($('input[name="storey"]').val().length > 0) {
                        customerAddress += $('input[name="storey"]').val() + '层'
                    }
                    if ($('input[name="roomNum"]').val().length > 0) {
                        customerAddress += $('input[name="roomNum"]').val() + '室'
                    }
                    if ($('input[name="subRoomNum"]').val().length > 0) {
                        customerAddress += $('input[name="subRoomNum"]').val() + '分室'
                    }
                }
                /*var printcontent={};
                 printcontent.occurrencetime=occurrencetime;
                 printcontent.opertor =opertor;
                 printcontent.customtype = customerKind;
                 printcontent.customercode=customerCode;
                 printcontent.customname=customerName;
                 printcontent.customtel=customerTel;
                 printcontent.customic=idcard;
                 printcontent.customaddress=customerAddress;
                 printcontent.businessname="家庭人口数变更";*/
                /*var parameter = {
                 "businesstype":"jtrksbg",
                 "printcontent":JSON.stringify(printcontent),
                 "pid":""+pid+""
                 };*/

                var parameter = {
                    "businesstype": "khdabg",
                    "printcontent": "{\"occurrencetime\":\"" + occurrencetime + "\",\
                 \"opertor\":\"" + opertor + "\",\
                 \"customtype\":\"" + "客户类型: " + customerKindEmnu[customerKind] + "\",\
                 \"customercode\":\"" + "客户号: " + customerCode + "\",\
                 \"customname\":\"" + "客户姓名: " + customerName + "\",\
                 \"customtel\":\"" + "电话: " + customerTel + "\",\
                 \"customic\":\"" + "证件号码: " + idcard + "\",\
                 \"customaddress\":\"" + "地址: " + customerAddress + "\",\
                  \"newname\":\"" + "新客户名称: " + newCustomerName + "\",\
                       \"newtel\":\"" + "新客户电话: " + newTel + "\",\
                            \"newcardtype\":\"" + "新证件类型: " + newCardType + "\",\
                                 \"newcardno\":\"" + "新证件号: " + idCard + "\",\
                                      \"newcustomaddress\":\"" + "新地址: " + customerAddress + "\",\
                 \"businessname\":\"客户档案变更\"}",
                    "pid": "" + pid + ""
                };


                console.log(JSON.stringify(parameter));
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: '/hzqs/spt/pbprt.do?fh=PRTSPT0000000J00&resp=bd',
                    type: "POST",
                    datatype: "json",
                    data: JSON.stringify(parameter),
                    success: function (e) {
                        if (e.errCode == '1') {
                            bootbox.alert("<br><center><h4>保存成功！</h4></center><br>");

                            $('.btn-primary').on('click', function () {
                                $('#save_btn').addClass('disabled');
                                $('#print_btn').removeClass('disabled');
                                $('#submit_btn').removeClass('disabled');
                            })
                        } else {
                            bootbox.alert("<br><center><h4>保存失败！</h4></center><br>");
                        }
                    }
                })
            });
            $("#print_btn").on('click', function () {
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
                    data: "data=" + JSON.stringify(data),
                    jsonp: "callfuncname",
                    success: function (ret) {
                        console.log(ret)
                        if (ret.result.resultcode == "0") {
                            bootbox.alert("<br><center><h4>打印成功！</h4></center><br>", function () {
                                $('#print_btn').addClass('disabled');
                                $('#submit_btn').removeClass('disabled');
                            })
                        } else {
                            bootbox.alert("<br><center><h4>打印失败！</h4></center><br>");
                        }
                    },
                    error: function (e) {
                        console.log(e)
                    }
                })
            });

            $("#submit_btn").click("on", function () {

                // var data = {};
                // data.customerName = $('#customerName').val();
                // data.idcard_type = $('#idcard_type').val();
                // data.idcard = $('input[name="idcard"]').val();
                // data.tel = $('input[name="tel"]').val();
                // data.issalesRoom = $('input:radio[name="issalesRoom"][checked]').val();
                // console.log('the issaleRoom is :::' ,data.issalesRoom);
                // data.borough = $('input[name="borough"]').val();
                // data.street = $('input[name="street"]').val();
                // data.doorplateNum = $('input[name="doorplateNum"]').val();
                // data.district = $('input[name="district"]').val();
                // data.floorNum = $('input[name="floorNum"]').val();
                // data.cell = $('input[name="cell"]').val();
                // data.storey = $('input[name="storey"]').val();
                // data.roomNum = $('input[name="roomNum"]').val();
                // data.subRoomNum = $('input[name="subRoomNum"]').val();

                var archiveData = {};
                $.map($("#submitForm").serializeObject(), function (value, key) {
                    if (value.length > 0) {
                        console.log('the key is ::' + key + ' and the value is ::' + value);
                        archiveData[key] = value;
                    }
                })

                if ($('#idcard_type').val() == '5' && !validateIdCard($('input[name="idcard"]').val())) {
                    return;
                }

                //如果地址发生变更，则需要更新
                if ($('input[name="borough"]').val().length > 0
                    || $('input[name="street"]').val().length > 0
                    || $('input[name="doorplateNum"]').val().length > 0
                    || $('input[name="district"]').val().length > 0
                    || $('input[name="floorNum"]').val().length > 0
                    || $('input[name="cell"]').val().length > 0
                    || $('input[name="storey"]').val().length > 0
                    || $('input[name="roomNum"]').val().length > 0
                    || $('input[name="subRoomNum"]').val().length > 0
                ) {
                    //组装customerAddress更新到archive中
                    var houseData = {};
                    var customerAddress = '';
                    if ($('input[name="borough"]').val().length > 0) {
                        houseData['borough'] = $('input[name="borough"]').val();
                        customerAddress += $('input[name="borough"]').val() + '区';
                    }
                    if ($('input[name="street"]').val().length > 0) {
                        houseData['street'] = $('input[name="street"]').val()
                        customerAddress += $('input[name="street"]').val() + '路(街)'
                    }
                    if ($('input[name="doorplateNum"]').val().length > 0) {
                        houseData['doorplateNum'] = $('input[name="doorplateNum"]').val()
                        customerAddress += $('input[name="doorplateNum"]').val() + '门牌号'
                    }
                    if ($('input[name="district"]').val().length > 0) {
                        houseData['district'] = $('input[name="district"]').val()
                        customerAddress += $('input[name="district"]').val() + '小区'
                    }
                    if ($('input[name="floorNum"]').val().length > 0) {
                        houseData['floorNum'] = $('input[name="floorNum"]').val()
                        customerAddress += $('input[name="floorNum"]').val() + '楼号'
                    }
                    if ($('input[name="cell"]').val().length > 0) {
                        houseData['cell'] = $('input[name="cell"]').val()
                        customerAddress += $('input[name="cell"]').val() + '单元'
                    }
                    if ($('input[name="storey"]').val().length > 0) {
                        houseData['storey'] = $('input[name="storey"]').val()
                        customerAddress += $('input[name="storey"]').val() + '层'
                    }
                    if ($('input[name="roomNum"]').val().length > 0) {
                        houseData['rootNum'] = $('input[name="roomNum"]').val()
                        customerAddress += $('input[name="roomNum"]').val() + '室'
                    }
                    if ($('input[name="subRoomNum"]').val().length > 0) {
                        houseData['subRoomNum'] = $('input[name="subRoomNum"]').val()
                        customerAddress += $('input[name="subRoomNum"]').val() + '分室'
                    }

                    if (customerAddress.length > 0) {
                        archiveData['customerAddress'] = customerAddress;
                    }


                    //创建业务受理
                    var gascsrbusiregister = {};
                    gascsrbusiregister.busiRegisterId = $.md5(GasModService.getUuid() + new Date().getTime());//业务登记ID
                    gascsrbusiregister.businessTypeId = "KHDABG";
                    gascsrbusiregister.ctmArchiveId = ctmArchiveId;//档案ID
                    $.ajax({
                        type: 'get',
                        url: hzq_rest + 'gasctmmeter/?query={"ctmArchiveId":"' + ctmArchiveId + '"}',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        success: function (data) {
                            if (data[0]) {
                                gascsrbusiregister.ctmMeterId = data[0].ctmMeterId;
                            }
                        }
                    });
                    gascsrbusiregister.areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
                    gascsrbusiregister.customerCode = customerCode;//客户编号
                    gascsrbusiregister.customerName = customerName;//客户姓名
                    gascsrbusiregister.customerAddr = customerAddress;//客户地址
                    gascsrbusiregister.acceptDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss") + "-00:00");
                    ;//受理时间
                    gascsrbusiregister.blankOutSign = "N";
                    gascsrbusiregister.busiAcceptCode = gascsrbusiregister.busiRegisterId.substring(20);//受理单号 暂定
                    gascsrbusiregister.billState = "3";
                    gascsrbusiregister.createdTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss") + "-00:00");
                    ;//创建时间
                    gascsrbusiregister.createdBy = UserInfo.userId();//创建人
                    gascsrbusiregister.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss") + "-00:00");
                    ;//完成时间
                    gascsrbusiregister.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss") + "-00:00");
                    ;//变更时间
                    // console.log($("#find_key").val())
                    var oldarchive = Restful.findNQ(hzq_rest+'gasctmarchive/?query={"customerCode":"'+$("#find_key").val()+'"}')
                    // console.log(oldarchive)
                    if(gpypictureId){
                        gascsrbusiregister.reservedField2 = fileId;
                        oldarchive[0]["files"] = fileId;
                    }
                    console.log(oldarchive[0])
                    gascsrbusiregister.reservedField1 = JSON.stringify(oldarchive[0]);//预留字段1当初状态

                    gascsrbusiregister.printId = pid;//打印id
                    var submitJson = {
                        "sets": [
                            {
                                "txid": "1",
                                "body": archiveData,
                                "path": "/gasctmarchive/" + ctmArchiveId,
                                "method": "put"
                            },
                            {"txid": "2", "body": houseData, "path": "/gasctmhouse/" + houseId, "method": "put"},
                            {"txid": "3", "body": gascsrbusiregister, "path": "/gascsrbusiregister/", "method": "post"}
                        ]
                    }

                    // console.log("submit::"+JSON.stringify(submitJson));

                    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd&retobj=1", submitJson)
                    var retFlag = true;

                    if (result.success && result.success == false) {
                        retFlag = false;
                    } else {
                        for (var i = 0; i < result.results.length; i++) {
                            if (!result.results[i].result.success) {
                                retFlag = false;
                                break;
                            }
                        }
                    }
                    if (retFlag) {
                        bootbox.alert('变更成功');
                        window.location.reload();
                    } else {
                        bootbox.alert('变更失败')
                    }
                } else {
                    console.log('the formData is ::', $.toJSON($("#submitForm").serializeObject()));
                    var ret = Restful.update(hzq_rest + 'gasctmarchive', ctmArchiveId, archiveData);
                    if (ret == true) {
                        bootbox.alert('变更成功');
                        window.location.reload();
                    } else {
                        bootbox.alert('变更失败')
                    }
                }

            });
        }
    }
}()


function getUuid() {
    var len = 32;//32长度
    var radix = 16;//16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}














