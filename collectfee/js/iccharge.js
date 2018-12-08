var collectUtils = {
    setContext: function (key, obj) {
        if (!$("#gfdata")) {
            $(document).find("body").append("<div id='gfdata'></div>");
            $("#gfdata").data(key, obj);
        } else {
            var existsInfo = collectUtils.getContext(key);
            if (typeof existsInfo === "object") {
                $("#gfdata").data(key, $.extend(existsInfo, obj));
            } else {
                $("#gfdata").data(key, obj);
            }
        }
    },
    getContext: function (key) {
        return $("#gfdata").data(key);
    },
    isSelectedArchiveInfo: function () {
        //console.log("sdflsjf");
        if (collectUtils.getContext("customerid")) {
            return true;

        } else {
            return false;
        }
    },
    getCustomerInfoByIcCard: function (cardCode, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                cols: "a.*",
                froms: "gasCtmArchive a, gasChgIccard b",
                wheres: "b.ctmArchiveId =a.ctmArchiveId and b.cardCode = '" + cardCode + "'",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows) {
                    collectUtils.setContext("customer", data.rows[0]);
                } else {
                    collectUtils.setContext("customer", {});
                }

                cb();
            }
        });
    },
    getCustomerInfoByCustomerCode: function (customerCode, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                cols: "a.*",
                froms: "gasCtmArchive a, gasChgIccard b",
                wheres: "b.ctmArchiveId =a.ctmArchiveId and a.customerCode = '" + customerCode + "'",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows) {
                    collectUtils.setContext("customer", data.rows[0]);
                } else {
                    collectUtils.setContext("customer", {});
                }
                cb();
            }
        });
    },
    //燃气费
    renderICGasFeeInfo: function ($container) {
        dust.loadSource(dust.compile($("#__dust__icgasRowInfo").html(), "icgasrowInfo__"));
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "b.balance,c.customerName,c.ctmArchiveId,c.customerCode,d.gasTypeName,e.areaName",
                froms: "gasChgAccCtm a, gasActGasfeeAccount b,gasCtmArchive c,gasBizGasType d,gasBizArea e,gasChgIccard f",
                wheres: "b.chgAccCtmId =a.chgAccCtmId and c.ctmArchiveId=a.ctmArchiveId and f.ctmArchiveId=c.ctmArchiveId and c.gasTypeId = d.gasTypeId and e.areaId=c.areaId and c.customerCode='" + collectUtils.getContext("customer").customerCode + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data && data.rows) {
                    dust.render("icgasrowInfo__", { "data": data.rows[0] }, function (err, res) {
                        $container.html(res);
                    });
                }
            },
            error: function () {
                //请求出错处理alert("无访问权限");
            }
        });
    },
    //IC卡客户档案
    rendeICArchiveInfoByCode: function ($container) {
        dust.loadSource(dust.compile($("#__dust__icarchiveInfo").html(), "archiveInfoic__"));
        var aa = collectUtils.getContext("cardcode");
        //console.log(aa);
        $.ajax({
            //url:"hzqs/hzqrest/gasctmarchive/? fields={\"customerCode\":1}&query={\"customerCode\":\""+collectUtils.getContext("customer").customerCode+"\"}",
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "c.customerName,c.customerCode,f.cardCode,c.customerId,c.ctmArchiveId,c.customerAddress,c.customerCode,c.customerId,d.areaName,e.gasTypeName",
                froms: "gasCtmArchive c,gasBizArea d,gasBizGasType e,gasChgIccard f",
                wheres: "c.gasTypeId =e.gasTypeId and c.areaId=d.areaId and f.ctmArchiveId = c.ctmArchiveId and c.customerCode='" + collectUtils.getContext("customer").customerCode + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data && data.rows) {
                    dust.render("archiveInfoic__", { "data": data.rows[0] }, function (err, res) {
                        collectUtils.setContext("customerid", data);
                        var dd = collectUtils.getContext("customerid")
                        $container.html(res);
                    });
                } else {
                    dust.render("archiveInfoic__", { "data": {} }, function (err, res) {
                        $container.html(res);
                    });
                }
            },
            error: function () {
                //请求出错处理alert("无访问权限");
            }
        });
    },
    //表户基本信息
    rendeICMeter: function ($container) {
        dust.loadSource(dust.compile($("#__dust__icgasMeterRowInfo").html(), "gasMeterInfoic__"));
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: " a.meterUserState,a.meterUserName,a.address,c.gasTypeName,b.gasKindType",
                froms: "gasCtmArchive b,gasCtmMeter a,gasBizGasType c,gasChgIccard d",
                wheres: "b.gasTypeId =c.gasTypeId and a.ctmArchiveId=b.ctmArchiveId and b.ctmArchiveId=d.ctmArchiveId and b.customerCode='" + collectUtils.getContext("customer").customerCode + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                if (data && data.rows) {
                    dust.render("gasMeterInfoic__", { "data": data.rows[0] }, function (err, res) {
                        $container.html(res);
                    });
                } else {
                    dust.render("gasMeterInfoic__", { "data": {} }, function (err, res) {
                        $container.html(res);
                    });
                }
            },
            error: function () {
                //请求出错处理alert("无访问权限");
            }
        });
    },
    //垃圾费
    renderICHouseFeeInfo: function ($container) {
        dust.loadSource(dust.compile($("#__dust__ichouseRowInfo").html(), "ichouserowInfo__"));
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                cols: "a.balance",
                froms: "gasChgAccCtm b, gasActWastefeeAccount a,gasCtmArchive c,gasChgIccard d",
                wheres: "b.chgAccCtmId =a.chgAccCtmId and c.ctmArchiveId=b.ctmArchiveId and c.ctmArchiveId = d.ctmArchiveId and c.customerCode='" + collectUtils.getContext("customer").customerCode + "'",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows) {
                    dust.render("ichouserowInfo__", { "data": data.rows }, function (err, res) {
                        $container.html(res);
                    });
                }
            }
        });
    },
    //IC卡所有信息  没数据

    renderIcChargeInfo: function ($container) {
        dust.loadSource(dust.compile($("#__dust__ICCardPurchaseRowInfo").html(), "cardpurchaseInfo__"));
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "a.meterNo, a.areaName, b.cardCode, c.customerCode, a.buyGasTime,a.buyGasTimes",
                froms: "gasChgIccardCharge a, gasChgIccard b, gasCtmArchive c",
                wheres: "a.ctmArchiveId = b.ctmArchiveId and b.ctmArchiveId = c.ctmArchiveId and a.status = '1' and a.ctmArchiveId='" + collectUtils.getContext("customer").ctmArchiveId + "' order by a.buyGasTime desc",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows) {
                    dust.render("cardpurchaseInfo__", { "data": data.rows }, function (err, res) {
                        $container.html(res);
                    });
                }
            }
        });
    },
    renderIccardInfo : function($container){
        dust.loadSource(dust.compile($("#__dust__ICCardAllMessageRowInfo").html(), "cardallmessageInfo__"));
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "*",
                froms: "gasChgIccard a, gasCtmArchive b",
                wheres: "a.ctmArchiveId = b.ctmArchiveId and a.iccardState = '1' and a.ctmArchiveId='" + collectUtils.getContext("customer").ctmArchiveId + "'",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                console.log(data);
                if (data && data.rows) {
                    dust.render("cardallmessageInfo__", { "data": data.rows }, function (err, res) {
                        $container.html(res);
                    });
                }
            }
        });
    },
    renderIccardChangeInfo: function ($container) {
        dust.loadSource(dust.compile($("#__dust__ICCardChangeRowInfo").html(), "cardchangeInfo__"));
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "a.*,c.meterNo",
                froms: "gasChgIccard a, gasCtmMeter b, gasMtrMeter c",
                wheres: "a.ctmArchiveId = b.ctmArchiveId and b.meterId = c.meterId and a.ctmArchiveId='" + collectUtils.getContext("customer").ctmArchiveId + "' order by createTime desc",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                console.log(data);
                if (data && data.rows) {
                    dust.render("cardchangeInfo__", { "data": data.rows }, function (err, res) {
                        $container.html(res);
                    });
                }
            }
        });
    },
    //IC业主信息档案
    renderICCustomerInfoByCode: function ($container) {

        if (collectUtils.isSelectedArchiveInfo()) {
            var dd = collectUtils.getContext("customerid").rows[0].customerId;
            dust.loadSource(dust.compile($("#__dust__iccustomerInfo").html(), "iccustomerInfo__"));
            $.ajax({
                url: "hzqs/hzqrest/gasctmcustomer/? fields={\"customerId\":1}&query={\"customerId\":\"" + collectUtils.getContext("customer").customerId + "\"}",
                type: "get",
                async: false,
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data && data.length > 0) {
                        dust.render("iccustomerInfo__", { "data": data[0] }, function (err, res) {
                            $container.html(res);
                        });
                    } else {
                        dust.render("customerInfo__", { "data": {} }, function (err, res) {
                        })
                    }
                }
            })
        }
    },
    //业主的房屋地址、燃气费
    renderICGasCustomerFeeInfo: function ($container) {
        if (collectUtils.isSelectedArchiveInfo()) {
            dust.loadSource(dust.compile($("#__dust__icgasCustomerRowInfo").html(), "icgascustomerrowInfo__"));
            //console.log( collectUtils.getContext("customerid"));
            /*var cnd = "";
             if()*/
            $.ajax({
                url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
                type: "POST",
                async: false,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    cols: "b.balance,c.customerName,c.ctmArchiveId,c.customerAddress,c.customerCode,c.*,d.areaName,e.gasTypeName",
                    froms: "gasChgAccCtm a, gasActGasfeeAccount b,gasCtmArchive c,gasBizArea d,gasBizGasType e",
                    wheres: "b.chgAccCtmId =a.chgAccCtmId and c.ctmArchiveId=a.ctmArchiveId and d.areaId = c.areaId and e.gasTypeId = c.gasTypeId and c.customerId='" + collectUtils.getContext("customer").customerId + "'",
                    page: "false",
                    limit: 1
                }),
                dataType: "json",
                success: function (data) {
                    if (data) {
                        //console.log(data.rows[0])
                        collectUtils.setContext("customerCode", data.rows[0].customerCode);
                        dust.render("icgascustomerrowInfo__", { "data": data.rows[0] }, function (err, res) {
                            $container.html(res);
                        });
                    }
                },
                error: function () {
                    //请求出错处理
                    //alert("无访问权限");
                }
            });
        }
    },
    printInvoice: function (invoiceId) {
        $.ajax({
            url: "hzqs/chg/pbpis.do?fh=PISCHG0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                invoiceDetailId: invoiceId
            }),
            contentType: "application/json;charset=utf-8",
            type: "POST",
            success: function (data) {
                localService.callPrint({ "ptid": data.printId }, function (retData, isSuccess) {
                    if (isSuccess) {
                        bootbox.alert("交易完成");
                        window.location.reload();
                    } else {
                        bootbox.alert("打印失败");
                    }
                })
            }
        });
    },
    readCard: function (cb) {
        localService.callReadCard({
            "com": "1",
            "baud": "9600"
        }, function (retData, isSuccess) {
            if (isSuccess) {
                //var aa = collectUtils.getContext("cardcode");
                cb(retData, isSuccess);
            }
        });
    }
};
//燃气收费确定 写卡

$("#BtnSub").click(function () {
    $("#BtnSub").attr("disabled", "disabled");
    $.ajax({
        url: "hzqs/chg/pbich.do?fh=ICHCHG0000000J00&resp=bd",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            customerCode: $("#find_key").val(),
            money: $("#money").val(),
            chgType: "3",
            ticket: "",
            useBalance: "0"
        }),
        contentType: "application/json;charset=utf-8",
        type: "POST",
        success: function (data) {
            //发卡并购气
            //console.log(data);
            if (data.errCode == "1") {
                var cardData;
                var doWriteCardFunction = function (retData, isSuccess) {
                    if (isSuccess) {
                        confirm("燃气交费成功，交费金额[" + data.spent_money + "]，交费气量[" + data.measure + "]，账户余额为[" + data.balance + "]，是否打印发票", function (ret) {
                            collectUtils.printInvoice(data.invoiceId);
                        });
                    } else {
                        bootbox.alert("交费失败：" + data.errMsg);
                    }
                };
                if (data.kzt == "0") {
                    localService.callOpenCard(data.kxplx, $("#find_cardId").val(), {
                        "com": "1",
                        "baud": data.baud,
                        "kh": data.kh,
                        "btm": data.btm,
                        "dqdm": data.dqdm,
                        "ql": data.ql,
                        "je": data.je,
                        "xdj": data.xdj,
                        "djlx": data.djlx,
                        "jgtm": data.jgtm,
                        "cs": data.cs,//购气次数
                        "klx": data.klx,
                        "kzt": data.kzt,
                        "bkcs": data.bkcs,
                        "bjql": "0",
                        "txxe": "0",
                        "czxe": "0",
                        "dllx": "0",
                        "kxplx": data.kxplx
                        // data.kxplx
                    }, doWriteCardFunction);
                } else {
                    localService.callWriteCard(data.kxplx, $("#find_cardId").val(), {
                        "com": "1",
                        "baud": "9600",
                        "kh": data.kh,
                        "btm": data.btm,
                        "dqdm": data.dqdm,
                        "ql": data.ql,
                        "je": data.je,
                        "xdj": data.xdj,
                        "djlx": data.djlx,
                        "jgtm": data.jgtm,
                        "cs": data.cs,
                        "klx": data.klx,
                        "kzt": data.kzt,
                        "bkcs": data.bkcs,
                        "bjql": "0",
                        "txxe": "0",
                        "czxe": "0",
                        "dllx": "0",
                        "kxplx": data.kxplx
                    }, doWriteCardFunction);
                }
            } else if (data.errCode == "-1") {
                bootbox.alert("客户档案不存在");
            } else if (data.errCode == "-4") {
                bootbox.alert("表具档案不存在");
            } else if (data.errCode == "-5") {
                bootbox.alert("非IC卡表");
            }
        }, error: function (data) {
            bootbox.alert("交费失败");
            $("#BtnSub").removeAttr("disabled");
        }
    });
});
//收费操作
$("input[name=inlineRadioOptions]").on("change", function (e) {
    $("#money").removeAttr("disabled");
    //console.log($("#find_leaf").val);
    var option = $(event.target).filter(":checked");
    //console.log(option);
    if ($(option).val() == "4") {
        $("#check").show();
    } else {
        $("#check").hide();
        $("#check").find("input").val("");
    }
});

//气量转换金额
function gas2cash() {
    $.ajax({
        url: "hzqs/bil/pbgtm.do?fh=MTGBIL0000000J00&resp=bd",
        dataType: "json",
        async: false,
        data: JSON.stringify({
            customer_code: $("#find_key").val(),
            //collectUtils.getContext("customerCode"),
            measure: $("#gas").val()
        }),
        contentType: "application/json;charset=utf-8",
        type: "POST",
        success: function (data) {
            //写新卡命令
            if (data.ret_code == "1") {
                //$("#gas").val(data.measure);
                //document.getElementById('gas').innerHTML=data.measure;
            }
            else if (data.ret_code == "2") {
                bootbox.alert("用气性质对应的价格不存在");

            } else if (data.errCode == "-1") {
                bootbox.alert("客户档案不存在！");
            } else if (data.errCode == "-2") {
                bootbox.alert("");
            }


        },
        error: function (err) {
            alert("写入档案失败");
        }
    });
}

//金额转换气量
function cash2gas() {
    if ($('#changecheck').attr('checked')) {

        //var money = parseint($('#money').val());
        //var ymoney = parseint($('#ymoney').val());
        var money = $('#ymoney').val();
        var ymoney = $('#ymoney').val();
        var sum = money * 1 + ymoney * 1;
        console.log(sum);
        $.ajax({
            url: "/hzqs/bil/pbmtg.do?fh=MTGBIL0000000J00&resp=bd",
            dataType: "json",
            async: false,
            data: JSON.stringify({
                customer_code: "116001079",
                money: sum
            }),
            contentType: "application/json;charset=utf-8",
            type: "POST",
            success: function (data) {
                if (data.ret_code == "1") {
                    $("#gas").val(data.measure);
                }
                else if (data.ret_code == "2") {
                    alert("用气性质对应的价格不存在");

                } else if (data.ret_code == "-1") {
                    alert("客户档案不存在！");
                } else if (data.ret_code == "-2") {
                    alert("");
                }
            },
            error: function (err) {
                alert("");
            }
        });
    } else {
        $.ajax({
            url: "/hzqs/bil/pbmtg.do?fh=MTGBIL0000000J00&resp=bd",
            dataType: "json",
            async: false,
            data: JSON.stringify({
                customer_code: $("#find_key").val(),
                money: $("#money").val()
            }),
            contentType: "application/json;charset=utf-8",
            type: "POST",
            success: function (data) {
                //写新卡命令
                if (data.ret_code == "1") {
                    $("#gas").val(data.measure);

                } else if (data.ret_code == "2") {
                    alert("用气性质对应的价格不存在");

                } else if (data.ret_code == "-1") {
                    alert("客户档案不存在！");
                } else if (data.ret_code == "2") {
                    alert("客户号不存在");
                }
            },
            error: function (err) {
                alert("");
            }
        });
    }
}

$(document).ready(function () {
    //卡厂家
    $.ajax({
        url: "hzqs/hzqrest/gaschgicfactory/",
        method: "get",
        async: false,
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var str = "<div><select>"

            for (i = 0; i < data.length; i++) {
                str += "<option value='" + data[i].factoryId + "'>" + data[i].factoryName + "</option>"
            }
            str += "</select></div>"
            $("#find_cardId").html(str);

            //console.log($("#find_cardId").val());
        }
    });

    //客户档案信息初始为空
    var pagecontext = {
        archiveId: "",
        customerCode: "",
        customerName: "",
        customerId: ""
    };
    collectUtils.setContext("cardcode", pagecontext);
    collectUtils.setContext("customer", pagecontext);
    //collectUtils.setContext("customerid", pagecontext);
    collectUtils.rendeICArchiveInfoByCode($("#_icarchiveInfo"));
});