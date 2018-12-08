var chargeHelper = {
    com: "1",
    clearContext: function () {
        // 清除页面缓存数据
        $(document).find("body").find("#gfdata").remove();
        $(document).find("body").append("<div id='gfdata'></div>");
    },
    setContext: function (key, obj) {
        if (!$("#gfdata")) {
            $(document).find("body").append("<div id='gfdata'></div>");
            $("#gfdata").data(key, obj);
        } else {
            var existsInfo = chargeHelper.getContext(key);
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
    getArchiveInfo: function (customerCode, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "c.customerName,c.customerKind,c.customerState,c.customerType,c.ctmArchiveId,c.customerAddress,c.customerCode,c.customerId,d.areaName,e.gasTypeName,f.relChgAccountId,c.tel,c.idcard,c.gasTypeId",
                froms: "gasCtmArchive c,gasBizArea d,gasBizGasType e,gasChgAccount f",
                wheres: "c.gasTypeId =e.gasTypeId and nvl(c.valid_or_invalid,'N') <> 'Y' and c.areaId=d.areaId and f.ctmArchiveId = c.ctmArchiveId and c.customerCode='" + customerCode + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    chargeHelper.setContext("_current_archive", data.rows[0]);
                    if (typeof (cb) === 'function') {
                        cb();
                    }
                } else {
                }
            },
            error: function () {
            }
        });
    },
    getCustomerInfo: function (customerId, cb) {
        $.ajax({
            url: "hzqs/hzqrest/gasctmcustomer/?fields={\"customerId\":1}&query={\"customerId\":\"" + customerId + "\"}",
            success: function (data) {
                if (data && data.length > 0) {
                    chargeHelper.setContext("_current_customer", data[0]);
                    if (typeof (cb) === 'function') {
                        cb();
                    }
                } else {

                }
            },
            error: function () {
            }
        });
    },
    getBasicPriceInfo: function(gasTypeId, cb){
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "price1",
                froms: "gasBllGasPrice",
                wheres: "gasTypeId ='" + gasTypeId + "' and effectTime < sysdate order by effectTime desc",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                } else {
                }
            },
            error: function () {
            }
        });
    },
    getArchiveInfoByIcCard: function (cardCode, regionCode, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                cols: "a.*",
                froms: "gasCtmArchive a, gasChgIccard b",
                wheres: "b.ctmArchiveId =a.ctmArchiveId and b.cardCode = '" + cardCode + "' and b.regionCode='" + regionCode + "' and b.iccardState=1",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    chargeHelper.setContext("_current_archive", data.rows[0]);
                    if (typeof (cb) === 'function') {
                        cb(true);
                    }
                } else {
                    cb(false);
                }
            },
            error: function () {
                cb(false);
            }
        });
    },
    getIcCardInfo: function (archiveId, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                cols: "a.customerCode, c.totalUsed ljql,b.cardCode kh,b.regionCode dqdm,b.measure,b.money,b.replaceCount bkcs,b.alertAmount bjql,b.iccardState kzt,b.overdraft txxe,c.buyGasTimes cs,d.factoryName,e.chipType kxplx",
                froms: "gasCtmArchive a, gasChgIccard b, gasChgIccardCharge c, gasMtrFactory d,gasMtrMeter e,gasCtmMeter f",
                wheres: "b.ctmArchiveId =a.ctmArchiveId and b.iccardId = c.icCardId and  d.factoryId=e.factoryId and b.iccardState='1' and e.meterId = f.meterId and a.ctmArchiveId =f.ctmArchiveId and c.status='1' and a.ctmArchiveId = '" + archiveId + "' order by c.buyGasTimes desc",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    chargeHelper.setContext("_current_archive", data.rows[0]);
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                } else {
                }
            },
            error: function () {
            }
        });
    },
    //补量审批的 购气信息
    renderIcChargeInfo: function (customerCode, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "a.meterNo, a.areaName,a.measure,b.cardCode, c.customerCode, a.buyGasTime,a.buyGasTimes,gu.chargeUnitName,a.chargeUnitId",
                froms: "gasChgIccardCharge a left join gas_biz_charge_unit gu on a.charge_unit_id = gu.charge_unit_id inner join gasChgIccard b on a.ctmArchiveId = b.ctmArchiveId inner join gasCtmArchive c on b.ctmArchiveId = c.ctmArchiveId",
                wheres: "b.iccard_state = '1' and a.status = '1' and c.customerCode='" + customerCode + "' order by a.buyGasTime desc",
                page: false,
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows);
                    }
                } else {

                }
            }, error: function () {
                bootbox.alert("加载ic卡收费记录错误");
            }
        });
    },
    //IC卡信息
    renderIccardInfo: function (customerCode, cb) {
        //dust.loadSource(dust.compile($("#__dust__ICCardAllMessageRowInfo").html(), "cardallmessageInfo__"));
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "a.*,d.meter_no,b.customer_code,e.factory_name",
                froms: "gasChgIccard a, gasCtmArchive b,gas_ctm_meter c,gas_mtr_meter d,gas_mtr_factory e",
                wheres: "a.ctmArchiveId = b.ctmArchiveId and b.ctmArchiveId = c.ctmArchiveId and d.meter_id = c.meter_id and e.factory_id =a.factory_id  and a.iccardState = '1' and b.customerCode='" + customerCode + "'",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                    /* dust.render("cardallmessageInfo__", { "data": data.rows }, function (err, res) {
                     $container.html(res);
                     });*/
                }
            }
        });
    },
    renderIccardChangeInfo: function (customerCode, cb) {

        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "a.*,c.meterNo",
                froms: "gasChgIccard a, gasCtmMeter b, gasMtrMeter c,gasCtmArchive d",
                wheres: "a.ctmArchiveId = b.ctmArchiveId and b.meterId = c.meterId and d.ctmArchiveId = b.ctmArchiveId and d.customerCode='" + customerCode + "' order by createTime desc",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                }
            }
        });
    },
    //补量情况信息  没有用
    getComplementInfo: function (archiveId, cb) {
        $.ajax({
            url: "hzqs/hzqrest/gaschgiccardcompement/? fields={\"ctmArchiveId\":1}&query={\"ctmArchiveId\":\"" + collectUtils.getContext("customer").archiveId + "\"}",
            method: "get",
            async: false,
            dataType: "json",
            success: function (data) {
                if (typeof (callback) === "function") {
                    cb(data);
                }
                if (data && data.length > 0) {
                    if (typeof (cb) === 'function') {
                        cb(data.length());
                    }
                }
            }

        });
    },
    //追补信息 未完成
    getRecoverInfo: function (customerCode, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            method: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                cols: "a.*,b.charge_unit_name,c.employee_name",
                froms: "gas_chg_recover a, gas_biz_charge_unit b,gas_sys_user c",
                wheres: "a.createdBy = c.user_id and b.charge_unit_id = a.charge_unit_id and a.customer_code = '" + customerCode + "' order by a.created_time desc",
                page: true,
                limit: 10
            }),

            success: function (data) {
                if (typeof (cb) === "function" && data && data.rows) {
                    cb(data.rows);
                } else {
                    cb(undefined);
                }
            }

        });
    },
    getGasFee: function (archiveId, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "c.customerName,c.ctmArchiveId,c.customerCode,d.gasTypeName,e.areaName",
                froms: "gasChgAccount a, gasActGasfeeAccount b,gasCtmArchive c,gasBizGasType d,gasBizArea e",
                wheres: "b.chgAccountId =a.chgAccountId and c.ctmArchiveId=a.ctmArchiveId and c.gasTypeId = d.gasTypeId and e.areaId=c.areaId and a.ctmArchiveId='" + archiveId + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                }
            },
            error: function () {
            }
        });
    },
    getGasFeeBalance: function (ctmArchiveId, cb) {
        $.ajax({
            url: "hzqs/chg/pbgbl.do?fh=GBLCHG0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                "ctmArchiveId": ctmArchiveId
            }),
            success: function (data) {
                if (data) {
                    if (typeof (cb) === 'function') {
                        cb(data);
                    }
                }
            }
        });
    },
    getWasteFeeBalance: function (ctmArchiveId, cb) {
        $.ajax({
            url: "hzqs/chg/pbwbl.do?fh=WBLCHG0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                "ctmArchiveId": ctmArchiveId
            }),
            success: function (data) {
                if (data) {
                    if (typeof (cb) === 'function') {
                        cb(data.balance);
                    }
                }
            }
        });
    },
    getWasteFee: function (archiveId, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                cols: "a.balance,c.ctmArchiveId,c.customerCode",
                froms: "gasChgAccount b, gasActWastefeeAccount a,gasCtmArchive c",
                wheres: "b.chgAccountId =a.chgAccountId and c.ctmArchiveId=b.ctmArchiveId and c.ctmArchiveId='" + archiveId + "'",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                }
            }
        });
    },
    //燃气费
    chgGasFee: function (customerCode, chgType, fee, ticket, isBlackList, cb) {
        if (chargeHelper.getContext("unique_chg_id") && chargeHelper.getContext("unique_chg_id") == customerCode + fee) {

        } else {
            chargeHelper.setContext("unique_chg_id", customerCode + fee);
            $.ajax({
                url: "hzqs/chg/pbgch.do?fh=GCHCHG0000000J00&resp=bd",
                dataType: "json",
                data: JSON.stringify({
                    "customerCode": customerCode,
                    "money": fee,
                    "chgType": chgType,
                    "ticket": ticket,
                    "isBlackList": isBlackList
                }),
                contentType: "application/json;charset=utf-8",
                type: "POST",
                success: function (data) {
                    if (typeof (cb) === 'function') {
                        cb(data);
                    }
                }, error: function (data) {
                    bootbox.alert("燃气费交费失败");
                    //$("#BtnSub").removeAttr("disabled");
                }
            });
        }


    },
//IC卡顺价收费
    chgIcSGasFee: function (customerCode, chgType, fee, ticket, cb) {
        if (chargeHelper.getContext("unique_chg_id") && chargeHelper.getContext("unique_chg_id") == customerCode + fee) {

        } else {
            chargeHelper.setContext("unique_chg_id", customerCode + fee);
            $.ajax({
                url: "hzqs/chg/pbisj.do?fh=ISJCHG0000000J00&resp=bd",
                dataType: "json",
                data: JSON.stringify({
                    "customerCode": customerCode,
                    "money": fee,
                    "chgType": chgType,
                    "ticket": ticket,
                    
                }),
                contentType: "application/json;charset=utf-8",
                type: "POST",
                success: function (data) {
                    if (typeof (cb) === 'function') {
                        cb(data);
                    }
                }, error: function (data) {
                    bootbox.alert("IC卡顺价交费失败");
                    //$("#BtnSub").removeAttr("disabled");
                }
            });
        }


    },
    chgIcGasFee: function (customerCode, chgType, money, ticket, useBalanceMoney, useBalancecheckbox, useComplement, bizid,isBlackList, cb) {
        if (chargeHelper.getContext("unique_chg_id") && chargeHelper.getContext("unique_chg_id") == customerCode + money) {

        } else {
            chargeHelper.setContext("unique_chg_id", customerCode + money);
            $.ajax({
                url: "hzqs/chg/pbich.do?fh=ICHCHG0000000J00&resp=bd",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                timeout: 30000,
                data: JSON.stringify({
                    customerCode: customerCode,
                    money: money,
                    chgType: chgType,
                    ticket: ticket,
                    useBalance: useBalancecheckbox,
                    useComplement: useComplement,
                    useBalanceMoney: useBalanceMoney,
                    bizid: bizid
                }),
                contentType: "application/json;charset=utf-8",
                type: "POST",
                success: function (data) {
                    if (typeof (cb) === 'function') {
                        cb(true, data);
                    }
                }, error: function (jqXHR, textStatus, errorThrown) {
                    if (typeof (cb) === 'function') {
                        cb(false, textStatus);
                    }
                }
            });
        }

    },


    //燃气费中 补量
    getIcComplement: function (customerCode, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "sum(approveGas) as gas",
                froms: "gasChgIccardComplement a",
                wheres: "a.useState=0 and a.applyState=2 and a.customerCode='" + customerCode + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                }
            },
            error: function () {
            }
        });
    },
    corIc: function (customerCode, bizId, cb) {
        $.ajax({
            url: "hzqs/chg/pbico.do?fh=ICOCHG0000000J00&resp=bd",
            dataType: "json",
            timeout: 10000,
            data: JSON.stringify({
                "customerCode": customerCode,
                "bizId": bizId
            }),
            contentType: "application/json;charset=utf-8",
            type: "POST",
            success: function (data) {
                if (data.errCode == "1") {
                    if (typeof (cb) === 'function') {
                        cb(data);
                    }
                } else {
                    if (typeof (cb) === 'function') {
                        cb(data);
                    }
                }
            }, error: function (data) {
                if (typeof (cb) === 'function') {
                    cb(data);
                }
            }
        });
    },
    chgWasteFee: function (customerCode, chgType, fee, ticket, cb) {

        if (chargeHelper.getContext("unique_chg_id") && chargeHelper.getContext("unique_chg_id") == customerCode + fee) {

        } else {
            chargeHelper.setContext("unique_chg_id", customerCode + fee);
            $.ajax({
                url: "hzqs/chg/pbwch.do?fh=GCHCHG0000000J00&resp=bd",
                dataType: "json",
                data: JSON.stringify({
                    "customerCode": customerCode,
                    "money": fee,
                    "chgType": chgType,
                    "ticket": ticket
                }),
                contentType: "application/json;charset=utf-8",
                type: "POST",
                success: function (data) {
                    if (typeof (cb) === 'function') {
                        cb(data);
                    }
                }, error: function (data) {
                    if (typeof (cb) === 'function') {
                        cb();
                    }
                }
            });
        }
    },
    //垃圾费发票
    invoiceWaste: function (detailId, invoice, cb) {
        $.ajax({
            url: "hzqs/chg/pbpws.do?fh=PWSCHG0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                detailId: detailId,
                invoice: invoice
            }),
            contentType: "application/json;charset=utf-8",
            type: "POST",
            success: function (data) {
                if (typeof (cb) === 'function') {
                    cb(true, data);
                }
            },
            error: function () {
                cb(false);
            }
        });
    },
    //垃圾费开关
    wastepretag: function (cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                cols: "parameter_value",
                froms: "gas_sys_parameter a",
                wheres: "parameter_code = 'chg.charge.wastepretag'",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (typeof (cb) === 'function') {
                    cb(data);
                }
            },
            error: function (err) {
               
            }
        });
    },
    transFeeToMeasure: function (customerCode, fee, cb) {
        $.ajax({
            url: "/hzqs/bil/pbmtg.do?fh=MTGBIL0000000J00&resp=bd",
            dataType: "json",
            async: false,
            data: JSON.stringify({
                "customer_code": customerCode,
                "money": fee
            }),
            contentType: "application/json;charset=utf-8",
            type: "POST",
            success: function (data) {
                if (data.ret_code == "1") {
                    if (typeof (cb) === 'function') {
                        data.money = fee;
                        cb(data, true);
                    }
                } else if (data.ret_code == "2") {
                    if (typeof (cb) === 'function') {
                        data.money = fee;
                        cb(data, false);
                    }
                }
            },
            error: function (err) {

            }
        });
    },
    transMeasureToFee: function (customerCode, measure, cb) {
        $.ajax({
            url: "hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",
            dataType: "json",
            async: false,
            data: JSON.stringify({
                "customer_code": customerCode,
                "measure": measure
            }),
            contentType: "application/json;charset=utf-8",
            type: "POST",
            success: function (data) {
                if (data.ret_code == "1") {
                    if (typeof (cb) === 'function') {
                        cb(data.money);
                    }
                }
            },
            error: function (err) {
            }
        });
    },
    readCard: function (cb) {
        localService.callReadCard({
            "com": chargeHelper.com,
            "baud": "9600"
        }, function (retData, isSuccess) {
            if (retData.resultCode == "-7") {
                bootbox.alert("该卡不是天信卡，请更换读卡器");
            } else if (retData.resultCode == "-2") {
                bootbox.alert("该卡是天信卡，请更换读卡器");
            }
            cb(retData, isSuccess);

        });
    },
    readFactoryCard: function (factoryId, cb) {
        localService.callReadCard({
            "com": chargeHelper.com,
            "baud": "9600",
            "cardfactory": factoryId
        }, function (retData, isSuccess) {
            if (retData.resultCode == "-7") {
                bootbox.alert("该卡不是天信卡，请更换读卡器");
            } else if (retData.resultCode == "-2") {
                bootbox.alert("该卡是天信卡，请更换读卡器");
            }
            cb(retData, isSuccess);

        });
    },
    printInvoice: function (invoiceId, cb) {
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
                if (data.errCode == "1") {
                    if (typeof (cb) === 'function') {
                        cb(data);
                    }
                } else {
                    cb();
                }
            }, error: function (data) {
                cb();
            }
        });
    },
    formatMoney: function (money) {
        if (isNaN(parseFloat(money))) {
            return "";
        }
        return "¥" + parseFloat(money);
    },
    formatPrice: function (money) {
        if (isNaN(parseFloat(money))) {
            return "";
        }
        return parseFloat(money) + "元/立方米";
    },
    printInvoiceResponse: function (invoiceId) {
        $.ajax({
            url: 'hzq_rest/gaschginvoicedetail/?query={"invoiceDetailId":"' + invoiceId + '"}',
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "printType": "1"
            }),
            contentType: "application/json;charset=utf-8",
            type: "PUT",
            success: function (data) {

            }, error: function (data) {

            }
        });
    },
    getCTMAccountInfo: function (archiveId, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "d.*",
                froms: "gasCtmArchive b,gasChgAccount c, gasChgAccount d",
                wheres: "b.ctmArchiveId = c.ctmArchiveId and c.relChgAccountId = d.chgAccountId and d.accountType='1' and b.ctmArchiveId ='" + archiveId + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    //chargeHelper.setContext("_current_archive", data.rows[0]);
                    if (typeof (cb) === 'function') {
                        $.ajax({
                            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
                            type: "POST",
                            async: false,
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify({
                                cols: "b.*",
                                froms: "gasChgAccount a,gasCtmArchive b",
                                wheres: "b.ctmArchiveId = a.ctmArchiveId and a.accountType='0' and a.relChgAccountId='" + data.rows[0].chgAccountId + "'",
                                page: "false",
                                limit: 1
                            }),
                            dataType: "json",
                            success: function (dataItem) {
                                var chgCtm = data.rows[0];
                                chgCtm.dataItems = dataItem.rows;
                                cb(chgCtm);
                            }
                        });
                    }
                    ;
                } else {
                }
            },
            error: function (xhr, data) {
                bootbox.alert("获取联合账户信息异常，异常信息：</ br>", function () {
                    window.location.reload();
                });
            }
        });
    },
    //补卡
    reWrite: function (customerCode, cb) {
        $.ajax({
            url: "hzqs/chg/pbric.do?fh=RICCHG0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                //customerCode: collectUtils.getContext("customerid").customerCode,
                customerCode: customerCode,
                reason: $("#lost_reason").val()
            }),
            contentType: "application/json;charset=utf-8",
            type: "POST",
            success: function (data) {
                if (typeof (cb) === 'function') {
                    cb(data);
                }
            },
            error: function () {
                bootbox.alert("补卡出现异常，" + data.errCode, function () {
                    window.location.reload();
                });
            }
        });
    },
    // 记录IC卡卡片信息
    saveICCardInfo: function (ctmArchiveId, customerCode, cardInfo, cb) {
        // 读取卡信息
        this.getIcCardInfo(ctmArchiveId, function (sysCardData) {
            if (parseInt(sysCardData.cs) == parseInt(cardInfo.cs) && parseInt(sysCardData.bkcs) == parseInt(cardInfo.bkcs)) {
                // 读取上一次交易数据
                $.ajax({
                    url: "hzqs/chg/pbqrf.do?fh=QRFCHG0000000J00&resp=bd",
                    type: "POST",
                    async: false,
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        customerCode: customerCode,
                    }),
                    dataType: "json",
                    success: function (chargeItem) {
                        if (chargeItem.writeGas == cardInfo.ql) {
                            $.ajax({
                                url: "hzqs/chg/pbsic.do?fh=SICCHG0000000J00&resp=bd",
                                dataType: "json",
                                contentType: "application/json;charset=utf-8",
                                type: "POST",
                                data: JSON.stringify(cardInfo),
                                success: function (data) {
                                    if (data.errCode == "1") {
                                        var message = "<h3>上次交费信息：</h3>";
                                        message += "<p>收费时间：" + chargeItem.lastDateTime + "</p>";
                                        message += "<p>收费金额：" + (chargeItem.chgMoney == undefined ? "0" : chargeItem.chgMoney) + "</p>";
                                        message += "<p>使用金额：" + (chargeItem.useMoney == undefined ? "0" : chargeItem.useMoney) + "</p>";
                                        message += "<p>余额转换金额：" + (chargeItem.useBalance == undefined ? "0" : chargeItem.useBalance) + "</p>";
                                        message += "<p>写卡金额：" + (chargeItem.writeMoney == undefined ? "0" : chargeItem.writeMoney) + "</p>";
                                        message += "<p>写卡气量：" + chargeItem.writeGas + "</p>";
                                        message += "<p>本次应退款现金为：<span style='color:red; font-size: 22px'>" + (chargeItem.useMoney == undefined ? "0" : chargeItem.useMoney) + "</span>";
                                        bootbox.confirm({
                                            buttons: {
                                                confirm: {
                                                    label: '确认退款',
                                                    className: 'btn-danger'
                                                },
                                                cancel: {
                                                    label: '撤销',
                                                    className: 'btn-default'
                                                }
                                            },
                                            message: message,
                                            callback: function (result) {
                                                if (result) {
                                                    // IC卡清零
                                                    $.ajax({
                                                        url: "hzqs/chg/pbrfi.do?fh=RFICHG0000000J00&resp=bd",
                                                        dataType: "json",
                                                        contentType: "application/json;charset=utf-8",
                                                        type: "POST",
                                                        data: JSON.stringify({
                                                            "chargeId": chargeItem.icCardChargeId,
                                                            "customerCode": sysCardData.customerCode
                                                        }),
                                                        success: function (data) {
                                                            if (data.errCode == "1") {
                                                                localService.callGasReset(cardInfo.cardfactory, cardInfo, function (retData, isSuccess) {
                                                                    if (isSuccess) {
                                                                        // 更新服务器
                                                                        bootbox.alert("退款成功", function () {
                                                                            window.location.reload();
                                                                        });
                                                                    } else {
                                                                        bootbox.alert("卡内气量清零失败", function () {
                                                                            window.location.reload();
                                                                        });
                                                                    }
                                                                });
                                                            } else {
                                                                bootbox.alert("退款失败：" + data.errMsg, function () {
                                                                    window.location.reload();
                                                                });
                                                            }
                                                        },
                                                        error: function () {
                                                            bootbox.alert("退款异常。<br>请点击读卡，检查IC卡收费信息。退款成功", function () {
                                                                window.location.reload();
                                                            });
                                                        }
                                                    });

                                                } else {
                                                    // 
                                                }
                                            }
                                        });
                                    } else {
                                        bootbox.alert("退款过程发生异常：" + data.errMsg, function () { });
                                    }
                                }
                            });
                        } else {
                            // 气量与最后一次交易不符合
                            // 如果上一次交易记录和气量与本次卡内气量不符，则不允许退款
                            bootbox.alert("气量与最后一次交易不符合，不允许退款", function () { });
                        }
                    }
                });
            } else {
                // 卡内的写卡次数和补卡次数，与服务器不一致
                // 旧卡，提示不允许退款
                bootbox.alert("卡内的写卡次数和补卡次数，与服务器不一致，不允许退款", function () { });
            }
        });
    }
};