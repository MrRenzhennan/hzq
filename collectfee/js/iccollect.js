var xw;

var archiveidHelper = undefined;
var iccardidHelper = undefined;

var PurgashisAction = function () {

    // 供气区域helper
    var areaHelper = RefHelper.create({
        ref_url: "gassysarea",
        ref_col: "areaId",
        ref_display: "areaname",
    });
// 卡厂家helper
    var factoryHelper = RefHelper.create({
        ref_url: "gaschgicfactory",
        ref_col: "code",
        ref_display: "name",
    });
    // 收费方式helper
    var chgtypeHelper = RefHelper.create({
        ref_url: "gaschgtype",
        ref_col: "chargetypecode",
        ref_display: "chargetypename",
    });
    //卡号helper
    var cardcodHelper = RefHelper.create({
        ref_url: "gaschgiccard",
        ref_col: "icCardId",
        ref_display: "cardcode",
    });

    archiveidHelper = RefHelper.create({
        ref_url: "gasctmarchive",
        ref_col: "ctmArchiveId",
        ref_display: "customercode"
    });

    iccardidHelper = RefHelper.create({
        ref_url: "gaschgiccard",
        ref_col: "icCardId",
        ref_display: "cardcode"
    });


    //操作人员helper
    /* var operatemanHelper = RefHelper.create({
     ref_url: "",
     ref_col: "",
     });*/
    //客户编号helper
    var cusidHelper = RefHelper.create({
        ref_url: "gasctmarchive",
        ref_col: "ctmArchiveId",
        ref_display: "customerid",
    });
//客户编号format
    var cusidFormat = function () {
        return {
            f: function (val) {
                return cusidHelper.getDisplay(val);
            }
        }
    }();
    //供气区域format
    var areaFormat = function () {
        return {
            f: function (val) {
                return areaHelper.getDisplay(val);
            },
        }
    }();
    // 卡号format
    var cardcodeFormat = function () {
        return {
            f: function (val) {
                return cardcodHelper.getDisplay(val);
            },
        }
    }();


    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            // this.reload();
        },
        initHelper: function () {
            // 卡厂家 select init
            $.map(factoryHelper.getData(), function (value, key) {

                $('#find_cardId').append('<option value="' + key + '">' + value + '</option>');
            });
            // 收费方式 select init
            $.map(chgtypeHelper.getData(), function (value, key) {

                $('#col_method').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(chgtypeHelper.getData(), function (value, key) {

                $('#ccol_method').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(chgtypeHelper.getData(), function (value, key) {

                $('#gcol_method').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload: function () {
            $('#divtable').html('');
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: false,
                    checkAllToggle: true,
                    //----------------基本restful地址---rr
                    restbase: 'gaschgiccardcharge?query={"ctmArchiveId":"' + ctmarchiveId + '"}',
                    key_column: "iccardchargeid",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "iccardchargeid",
                            friendly: "IC卡id",
                            unique: true,
                            hidden: true,
                            readonly: "readonly",
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: areaFormat,
                            index: 2
                        },
                        {
                            col: "ctmArchiveId",
                            friendly: "客户号",
                            format: cusidFormat,
                            index: 3
                        },
                        {
                            col: "icCardId",
                            friendly: "IC卡号",
                            format: cardcodeFormat,
                            /*inputsource: "select",
                             ref_url: "gaschgiccard",
                             ref_name: "cardcode",
                             ref_value: "cardId",*/
                            index: 4
                        },
                        {
                            col: "bookId",
                            friendly: "表编号",
                            index: 5
                        },

                        {
                            col: "buygastime",
                            friendly: "购气时间",
                            index: 6
                        },
                        {
                            col: "buygastimes",
                            friendly: "购气次数",
                            index: 7
                        },

                        {
                            col: "price",
                            friendly: "价格",
                            format: areaFormat,
                            index: 8
                        },
                        {
                            col: "money",
                            friendly: "金额",
                            index: 9
                        },
                        {
                            col: "iccardchargetype",
                            friendly: "IC卡购气类型",
                            index: 10
                        }
                        ,
                        {
                            col: "measure",
                            friendly: "气量",
                            index: 11
                        },
                        {
                            col: "summeasure",
                            friendly: "总气量",
                            index: 12
                        },
                        {
                            col: "summeasure",
                            friendly: "总金额",
                            index: 13
                        },
                        {
                            col: "operatemanid",
                            friendly: "操作人员",
                            format: areaFormat,
                            index: 14
                        }
                    ],

                }) //--init
        },

    }
}();


$(document).ready(function () {
//客户基本信息
    dust.loadSource(dust.compile($("#__dust__customerInfo").html(), "customerInfo__"));
    dust.render("customerInfo__", {"data": {"customername": ""}}, function (err, res) {
        // console.log(res);
        $("#_customerInfo").html(res);
    });
    //客户表户信息
    dust.loadSource(dust.compile($("#__dust__meterInfo").html(), "meterInfo__"));
    dust.render("meterInfo__", {"data": {"meterusername": ""}}, function (err, res) {
        //console.log("the first res is :" + res);
        $("#_meterInfo").html(res);
    });
    //IC卡信息
    dust.loadSource(dust.compile($("#__dust__cardmessageInfo").html(), "cardmessageInfo__"));
    dust.render("cardmessageInfo__", {"data": {"customerid": ""}}, function (err, res) {
        //console.log("the first res is :" + res);
        $("#_cardmessageInfo").html(res);
    });
    //IC卡变更信息
    dust.loadSource(dust.compile($("#__dust__cardhistoryInfo").html(), "cardhistoryInfo__"));
    dust.render("cardhistoryInfo__", {"data": {"customerid": ""}}, function (err, res) {
        //console.log("the first res is :" + res);
        $("#_cardhistoryInfo").html(res);
    });
    /*点读卡按钮 查询客户基本信息、加载IC卡购气信息、IC卡信息、IC卡变更信息*/
    $('#IC_read').click(function () {
       //window.location.reload();
        IC_read();
        //IC卡历史购气信息
        PurgashisAction.reload();
        //加载IC卡信息
        loadICmessage();
        //加载IC卡变更信息
        loadIChistory();
        // 读卡命令v IcFunction('{%20%22cmdheader%22:%20{%20%22cmdtype%22:%221%22%20},%20%22param%22:%20{%20%22com%22:%221%22,%20%22baud%22:%229600%22%20}%20}', 'IC_read');
    });
    // 写新卡命令
    $('#IC_write').click(function () {
        IcFunction('{%20%22cmdheader%22:%20{%20%22cmdtype%22:%223%22%20},%20%22param%22:%20{%20%22com%22:%221%22,%20%22baud%22:%229600%22,%20%22kh%22:%2212345678%22,%20%22dqdm%22:%22001002%22,%20%22btm%22:%22123321456654789%22,%20%22ql%22:%221%22,%20%22je%22:%2210%22,%20%22xdj%22:%221%22,%20%22djlx%22:%221%22,%20%22jgtm%22:%221%22,%20%22cs%22:%222%22,%20%22klx%22:%221%22,%20%22kzt%22:%221%22,%20%22bkcs%22:%222%22,%20%22bjql%22:%22%22,%20%22txxe%22:%22%22,%20%22czxe%22:%22%22,%20%22dllx%22:%22%22%20}%20}', 'IC_write');
    });
    // 写卡命令
    $('#IC_WriteInterface').click(function () {
        IcFunction('{%20%22cmdheader%22:%20{%20%22cmdtype%22:%225%22%20},%20%22param%22:%20{%20%22com%22:%221%22,%20%22baud%22:%229600%22,%20%22kh%22:%2212345678%22,%20%22dqdm%22:%22001002%22,%20%22ql%22:%221%22,%20%22je%22:%2210%22,%20%22xdj%22:%221%22,%20%22djlx%22:%221%22,%20%22jgtm%22:%221%22,%20%22cs%22:%222%22,%20%22klx%22:%221%22,%20%22kzt%22:%221%22,%20%22bkcs%22:%222%22,%20%22bjql%22:%22%22,%20%22txxe%22:%22%22,%20%22czxe%22:%22%22,%20%22dllx%22:%22%22%20}%20}', 'IC_WriteInterface');
    });
    // 格式化用户卡
    $('#IC_format').click(function () {
        IcFunction('{%20%22cmdheade r%22:%20{%20%22cmdtype%22:%227%22%20},%20%22param%22:%20{%20%22com%22:%221%22,%20%22baud%22:%229600%22,%20%22kh%22:%2212345678%22,%20%22dqdm%22:%22001002%22}%20}', 'IC_format');
    });
    // 用户卡气量清零
    $('#IC_zero').click(function () {
        IcFunction('{%20%22cmdheader%22:%20{%20%22cmdtype%22:%229%22%20},%20%22param%22:%20{%20%22com%22:%221%22,%20%22baud%22:%229600%22,%20%22kh%22:%2212345678%22,%20%22dqdm%22:%22001002%22%20}%20}', 'IC_zero');
    });
    // 解密银行卡数据
    $('#IC_decrypt').click(function () {
        IcFunction('{%20%22cmdheader%22:%20{%20%22cmdtype%22:%2211%22%20},%20%22param%22:%20{%20%22carddataread%22:%22jfksjkhiwuerwd87348375kjdfksf%22%20}%20}', 'IC_decrypt');
    });
    // 加密银行卡数据
    $('#IC_encryption').click(function () {
        IcFunction('{%20%22cmdheader%22:%20{%20%22cmdtype%22:%2213%22%20},%20%22param%22:%20{%20%22carddataread%22:%22jfksjkhiwuerwd87348375kjdfksf%22,%20%22pwd%22:%221234%22,%20%22kh%22:%2212345678%22,%20%22dqdm%22:%22001002%22,%20%22ql%22:%221%22,%20%22je%22:%2210%22,%20%22xdj%22:%221%22,%20%22djlx%22:%221%22,%20%22jgtm%22:%221%22,%20%22cs%22:%222%22,%20%22klx%22:%221%22,%20%22kzt%22:%221%22,%20%22bkcs%22:%222%22,%20%22bjql%22:%22100%22,%20%22txxe%22:%225%22,%20%22czxe%22:%2210000%22,%20%22dllx%22:%2210%22%20}%20}', 'IC_encryption');
    });
    // 获取卡密码
    $('#IC_obtain').click(function () {
        IcFunction('{%20%22cmdheader%22:%20{%20%22cmdtype%22:%2215%22%20},%20%22param%22:%20{%20%22carddataread%22:%22jfksjkhiwuerwd87348375kjdfksf%22%20}%20}', 'IC_obtain');
    });

})
var customerId;
var ctmarchiveId;
//读客户基本信息方法
function IC_read(data) {
    if (!data) {
        var restURL = hzq_rest + "gaschgiccol/queryCustomerInfo4Col/12345678";
        $.ajax({
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            url: restURL,
            dataType: 'json',
            async: false,
            success: function (data, textStatus, xhr) {
                if (xhr.status == 200) {

                    var result = data.retObj;
                    // customerId = data.retObj.customerId;
                    dust.render("customerInfo__", {"data": result}, function (err, res) {
                        $("#_customerInfo").html(res);
                    });
                    /* loadPrice();
                     loadICPurchaesHistory();*/
                    //console.log(result);
                    //console.log("data is " + data.retObj.customerid);


                    //全局 客户编号和客户档案id
                    customerId = data.retObj.customerid;
                    ctmarchiveId = data.retObj.ctmarchiveid;

                    //console.log("sdjlflsdfjljf" + ctmarchiveId);
                    // console.log("the last customer id is " + data.retObj.customerid);
                    console.log("the last customer id is " + data.retObj.ctmarchiveid);
                } else if (xhr.status == 403) {
                    bootbox.alert("载入通知清單错误，请通知系统管理员");
                }
            },
            error: function (err) {
                if (err.status == 403) {
                    bootbox.alert("载入通知清單错误，请通知系统管理员");
                }
            }
        });
    }
}
//加载IC卡信息表
function loadICmessage(data) {
    if (!data) {
        console.log("第一个customerid " + customerId);
        var restURL = hzq_rest + "gaschgiccard?query={\"customerid\":" + customerId + "}";
        $.ajax({
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            url: restURL,
            dataType: 'json',
            async: false,
            success: function (data, textStatus, xhr) {
                if (xhr.status == 200) {
                    console.log("IC卡" + data);
                    var result = data[0];

                    //customerId = data.retObj.customerid;
                    dust.render("cardmessageInfo__", {"data": result}, function (err, res) {
                        console.log("IC卡信息表" + result);
                        $("#_cardmessageInfo").html(res);
                    });
                    /* loadPrice();
                     loadICPurchaesHistory();*/


                } else if (xhr.status == 403) {
                    bootbox.alert("载入通知清單错误，请通知系统管理员");
                }
            },
            error: function (err) {
                if (err.status == 403) {
                    bootbox.alert("载入通知清單错误，请通知系统管理员");
                }
            }
        });
    }
}
//加载IC卡变更信息
function loadIChistory(data) {
    if (!data) {

        var restURL = hzq_rest + "gaschgiccardhistory?query={\"ctmArchiveId\":\"1\"}";
        $.ajax({
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            url: restURL,
            dataType: 'json',
            async: false,
            success: function (data, textStatus, xhr) {
                if (xhr.status == 200) {
                    var result = data[0];

                    //customerId = data.retObj.customerid;
                    dust.render("cardhistoryInfo__", {"data": result}, function (err, res) {
                        console.log(data);
                        $("#_cardhistoryInfo").html(res);
                    });
                    /* loadPrice();
                     loadICPurchaesHistory();*/
                    // console.log("the archiveidHelper is : " + archiveidHelper);
                    $('#id2code').html(archiveidHelper.getDisplay($('#id2code').html()));

                    $('#iccardid2code').html(archiveidHelper.getDisplay($('#iccardid2code').html()));

                } else if (xhr.status == 403) {
                    bootbox.alert("载入通知清單错误，请通知系统管理员");
                }
            },
            error: function (err) {
                if (err.status == 403) {
                    bootbox.alert("载入通知清單错误，请通知系统管理员");
                }
            }
        });
    }
}


/*$("#icmessage").click(function () {
 console.log(123);
 loadICmessage();
 console.log(12345678);

 });*/

//点击客户表具信息tab页
$("#meter").click(function () {
    var cusmeterURL = hzq_rest + "gaschgicmtr/queryMeterInfo/" + ctmarchiveId;
    $.ajax({
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        url: cusmeterURL,
        dataType: 'json',
        async: false,
        success: function (data, textStatus, xhr) {
            if (xhr.status == 200) {
                var result = data.retObj;
                //alert(result );
                dust.render("meterInfo__", {"data": result}, function (err, res) {
                    console.log("the res is :" + res);
                    $("#_meterInfo").html(res);
                });

            } else if (xhr.status == 403) {
                bootbox.alert("请通知系统管理员");
            }
        },
        error: function (err) {
            if (err.status == 403) {
                bootbox.alert("载入通知清单错误，请通知系统管理员");
            }
        }
    });


});
PurgashisAction.init();

