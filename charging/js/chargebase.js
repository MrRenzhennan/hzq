

var chargeUtils = {
    setContext: function (key, obj) {
        if (!$("#gfdata")) {
            $(document).find("body").append("<div id='gfdata'></div>");
            $("#gfdata").data(key, obj);
        } else {
            var existsInfo = chargeUtils.getContext(key);
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
        if (chargeUtils.getContext("customer")) {
            return true;

        } else {
            return false;
        }
    },


//根据档案id查询联合账户档案id
    selectunionid: function ($container, callback) {
        $.ajax({
            url: "hzqs/hzqrest/gaschgaccctm/? fields={\"ctmArchiveId\":1}&query={\"ctmArchiveId\":\"" + chargeUtils.getContext("customer").archiveId + "\"}",
            method: "get",
            async:false,
            dataType: "json",
            success: function (data) {
            if (typeof(callback)==="function" ){
                callback(data);
            }
                if (data && data.length > 0) {
                    chargeUtils.setContext("union",data);
                } else {
                    $("#linkTabCustomer").attr({"disabled": "disabled"});
                }
            }
        });
    },
    // 根据客户编号获取客户基本信息
    renderArchiveInfoByCode: function ($container) {
        dust.loadSource(dust.compile($("#__dust__archiveInfo").html(), "archiveInfo__"));
        $.ajax({

            //url:"hzqs/hzqrest/gasctmarchive/? fields={\"customerCode\":1}&query={\"customerCode\":\""+chargeUtils.getContext("customer").customerCode+"\"}",
            url:"hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type:"POST",
            async:false,
            contentType: "application/json;charset=utf-8",
            data:JSON.stringify({
                //cols:"c.customerName,c.ctmArchiveId,c.customerAddress,c.customerCode,c.customerId,d.areaName,e.gasTypeName,f.bookType",
                //froms:"gasCtmArchive c,gasBizArea d,gasBizGasType e,gasMrdBook f",
                //wheres:"c.gasTypeId =e.gasTypeId and c.areaId=d.areaId and f.bookId = c.bookId and c.customerCode='"+chargeUtils.getContext("customer").customerCode+"'",

                cols:"c.customerName,c.customerKind,c.customerState,c.ctmArchiveId,c.customerAddress,c.customerCode,c.customerId,d.areaName,e.gasTypeName",
                froms:"gasCtmArchive c,gasBizArea d,gasBizGasType e",
                wheres:"c.gasTypeId =e.gasTypeId and c.areaId=d.areaId and c.customerCode='"+chargeUtils.getContext("customer").customerCode+"'",
                page:"false",
                limit:1
            }),
            dataType:"json",
            success: function (data) {
                //console.log(data);
                if (data.rows ) {
                    //console.log(data[0]);
                    dust.render("archiveInfo__", { "data": data.rows[0]}, function (err, res) {
                        chargeUtils.setContext("customerid",data);
                        var hh = chargeUtils.getContext("customerid",data);
                        //console.log(hh.rows[0].customerId);

                        $container.html(res);
                        //console.log(chargeUtils.getContext("customer",data));
                        //console.log(data[0]+"ctmArchiveId");
                        // chargeUtils.setContext("ctmArchiveId", data[0].ctmArchiveId);
                        // var rr =chargeUtils.getContext("ctmArchiveId");//console.log(rr+"+rr");
                    });
                }else {
                    dust.render("archiveInfo__", { "data": {}}, function (err, res) {


                        //console.log(hh.rows[0].customerId);

                        $container.html(res);
                });
                }
            },
            error:function(){
                //请求出错处理
                alert("无访问权限");
            }
        });
    },
    // 根据客户档案Id获取联合账户档案信息   待定
    renderUnionInfoByCtmArcId: function ($container) {
        dust.loadSource(dust.compile($("#__dust__archiveInfo").html(), "unionInfo__"));

        $.ajax({
            //url: 'hzq_server/hzqrest/gasctmarchive/? fields={"customerCode":1}&query={"customerCode":"11012017"}',
            url:"hzqs/hzqrest/gasctmarchive/? fields={\"customerCode\":1}&query={\"customerCode\":\""+chargeUtils.getContext("customer").customerCode+"\"}",
            method: "get",
            dataType:"json",
            success: function (data) {
                if (data && data.length >0) {
                    console.log(data[0]);
                    dust.render("unionInfo__", { "data": data[0]}, function (err, res) {
                        $container.html(res);
                    });
                }
            }
        });
    },
    //业主信息档案
    renderCustomerInfoByCode: function ($container) {
        if (chargeUtils.isSelectedArchiveInfo()) {
            dust.loadSource(dust.compile($("#__dust__customerInfo").html(), "customerInfo__"));
            //console.log( chargeUtils.getContext("customerid"));
            $.ajax({
               url: "hzqs/hzqrest/gasctmcustomer/? fields={\"customerId\":1}&query={\"customerId\":\"" + chargeUtils.getContext("customer").rows[0].customerId + "\"}",
                //url: 'hzq_server/hzqrest/gasctmcustomer/? fields={"customerId":1}&query={"customerId":"c08e40159fba438b88d36d6d198e94e8"}',

                success: function (data) {
                    //console.log(chargeUtils.getContext("customer"));
                    //console.log(data)
                    if (data && data.length >0) {
                        dust.render("customerInfo__", { "data": data[0] }, function (err, res) {
                            $container.html(res);
                        });
                    }else {
                        dust.render("customerInfo__", { "data": {}}, function (err, res) {

                            $container.html(res);
                        });
                    }
                },
                error:function(){
                    //请求出错处理
                    alert("无访问权限");
                }
            });
        }
    },
    //业主的房屋地址、燃气费
    renderGasCustomerFeeInfo: function ($container) {
        if (chargeUtils.isSelectedArchiveInfo()) {
            dust.loadSource(dust.compile($("#__dust__gasCustomerRowInfo").html(), "gascustomerrowInfo__"));
            //console.log( chargeUtils.getContext("customerid"));
            /*var cnd = "";
            if()*/
            $.ajax({
                url:"hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
                type:"POST",
                async:false,
                contentType: "application/json;charset=utf-8",
                data:JSON.stringify({
                    cols:"b.balance,c.customerName,c.ctmArchiveId,c.customerAddress,c.customerCode,c.*,d.areaName,e.gasTypeName",
                    froms:"gasChgAccCtm a, gasActGasfeeAccount b,gasCtmArchive c,gasBizArea d,gasBizGasType e",
                    wheres:"b.chgAccCtmId =a.chgAccCtmId and c.ctmArchiveId=a.ctmArchiveId and d.areaId = c.areaId and e.gasTypeId = c.gasTypeId and c.customerId='"+chargeUtils.getContext("customerid").rows[0].customerId+"'",
                    page:"false",
                    limit:1
                }),
                dataType: "json",
                success: function (data) {
                    //console.log(chargeUtils.getContext("customer",data));
                    //console.log(data)
                    if (data && data.rows) {
                        //console.log(data.rows[0])
                        dust.render("gascustomerrowInfo__", {"data": data.rows[0]}, function (err, res) {
                            $container.html(res);
                        });
                    }
                },
                error:function(){
                    //请求出错处理
                    alert("无访问权限");
                }
            });
        }
    },
    //联合账户的房屋地址、燃气费
    renderGasUnionFeeInfo: function ($container) {
        dust.loadSource(dust.compile($("#__dust__gasUnionRowInfo").html(), "gasunionrowInfo__"));
        //console.log($container);
        $.ajax({
            url: 'hzqs/hzqrest/gasctmarchive/? fields={"customerId":1}&query={"customerId":"c08e40159fba438b88d36d6d198e94e8"}',
            method: "GET",
            dataType:"json",
            success: function (data) {
                //console.log(chargeUtils.getContext("customer"));
                //console.log(data)
                if (data && data.length >0) {
                    //console.log(data)
                    dust.render("gasunionrowInfo__", { "data": data[0] }, function (err, res) {
                        $container.html(res);
                    });
                }
            }
        });

    },

    getGasFee: function (cid, cb) {
        $.ajax({
            url: hzq_rest + "gaschgbagechange/getbycustomerid?cid=" + cid,
            methd: "GET",
            success: function (data) {
                if (data.success) {
                    if (cb) {
                        cb(data.retObj);
                    }
                }
            }
        });
    },
    getGarbageFee: function (cid, cb) {
        $.ajax({
            url: hzq_rest + "gaschgbagechange/getbycustomerid?cid=" + cid,
            methd: "GET",
            success: function (data) {
                if (data.success) {
                    if (cb) {
                        cb.call(this, data.retObj);
                    }
                }
            }
        });
    },
    renderHouseFeeInfo: function ($container) {
        dust.loadSource(dust.compile($("#__dust__houseRowInfo").html(), "houserowInfo__"));
        $.ajax({
            //url: hzq_rest + "gasctmhouse/getbycustomercode?code=" + chargeUtils.getContext("ccode"),
           // url: 'hzqs/hzqrest/gaschgbagechange/? fields={"ctmArchiveId":1}&query={"ctmArchiveId":"11012017"}',

           //url: 'hzqs/hzqrest/gaschgbagechange/? fields={"ctmArchiveId":1}&query={"ctmArchiveId":"10236130"}',
           //url:"hzqs/hzqrest/gaschgbagechange/? fields={\"ctmArchiveId\":1}&query={\"ctmArchiveId\":\""+chargeUtils.getContext("customer").archiveId+"\"}",
            url:"hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            dataType:"json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data:JSON.stringify({
                cols:"a.balance",
                froms:"gasChgAccCtm b, gasActWastefeeAccount a,gasCtmArchive c",
                wheres:"b.chgAccCtmId =a.chgAccCtmId and c.ctmArchiveId=b.ctmArchiveId and c.ctmArchiveId='"+chargeUtils.getContext("customer").archiveId+"'",
                //wheres:"b.chgAccCtmId =a.chgAccCtmId and c.ctmArchiveId=b.ctmArchiveId and b.ctmArchiveId='10236130'",

                page:"false",
                limit:1
            }),
            success: function (data) {
                //console.log(data);
                if (data && data.rows) {

                    dust.render("houserowInfo__", { "data": data.rows[0] }, function (err, res) {
                        //console.log("199");
                        $container.html(res);
                    });
                }
            }
        });
    },
    renderGasFeeInfo: function ($container) {
        dust.loadSource(dust.compile($("#__dust__gasRowInfo").html(), "gasrowInfo__"));
       //var rr= chargeUtils.getContext("customer");
       // console.log(rr);
        $.ajax({
           //url: 'hzqs/hzqrest/gaschgaccctm/? fields={"ctmArchiveId":1}&query={"ctmArchiveId":"10236130"}',
           // url:"hzqs/hzqrest/gaschgaccctm/? fields={\"ctmArchiveId\":1}&query={\"ctmArchiveId\":\""+chargeUtils.getContext("customer").archiveId+"\"}",
           // url:"hzqs/chg/pbcda.do?fh=CDACHG0000000J00&resp=bd&bd={\"customerCode\":\""+query+"\"}",
            url:"hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type:"POST",
            contentType: "application/json;charset=utf-8",
            data:JSON.stringify({
                cols:"b.balance,c.customerName,c.ctmArchiveId,c.customerCode,d.gasTypeName,e.areaName",
                froms:"gasChgAccCtm a, gasActGasfeeAccount b,gasCtmArchive c,gasBizGasType d,gasBizArea e",
                wheres:"b.chgAccCtmId =a.chgAccCtmId and c.ctmArchiveId=a.ctmArchiveId and c.gasTypeId = d.gasTypeId and e.areaId=c.areaId and a.ctmArchiveId='"+chargeUtils.getContext("customer").archiveId+"'",
                page:"false",
                limit:1
            }),
            dataType:"json",
            success: function (data) {
                if (data && data.rows) {
                    dust.render("gasrowInfo__", { "data": data.rows[0]}, function (err, res) {
                       //console.log(data);
                       //chargeUtils.getContext("customer",data);
                        $container.html(res);
                    });
                }
            },
            error:function(){
                //请求出错处理
                alert("无访问权限");
            }
        });
    },
    renderMrdHistoryInfo: function ($container) {
        dust.loadSource(dust.compile($("#__dust__mrdHistoryRowInfo").html(), "mrdhistoryrowInfo__"));
        $.ajax({
            url: hzq_rest + "gasmrddetail/querybycustomerid?code=" + chargeUtils.getContext("ccode"),
            methd: "GET",
            dataType:"json",
            success: function (data) {
                if (data.success && data.retObj) {
                    dust.render("mrdhistoryrowInfo__", { "data": data[0] }, function (err, res) {
                        $container.html(res);
                    });
                }
            },
            error:function(){
                //请求出错处理
                alert("无访问权限");
            }
        });
    },


};

$(document).ready(function () {

    var pagecontext = {
        archiveId: "",
        customerCode: "",
        customerName: "",
        customerId:""
    };
    chargeUtils.setContext("customer", pagecontext);
    chargeUtils.setContext("customerid", pagecontext);
   // chargeUtils.renderArchiveInfoByCode($("#_archiveInfo"));
    //chargeUtils.renderCustomerInfoByCode($("#_customerInfo"))
});

