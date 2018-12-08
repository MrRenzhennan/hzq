/**
 * Created by Administrator on 2017/6/20 0020.
 */

/**
 * Created by Administrator on 2017/6/17 0017.
 */
//客户档案
$('#find_unit').on('change', function (e) {
    console.log("change area:" + e + "." + $('#find_unit').val());
    // if (!$('#find_unit').val()) {
    $("#find_countPer").html("<option value=''>全部</option>").trigger("change");
    // return false;
    // }
    GasModSys.counterUsersInArea({
        "areaId": $('#find_unit').val(),
        "cb": function (data) {
            if (data.length) {
                var inhtml = "<option value=''>全部</option>";
                $.each(data, function (idx, row) {
                    inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                })
                $("#find_countPer").html(inhtml);
                $("#find_countPer").val("").change();
            };

        }
    })
});

$('#find_countPer').on('change', function (e) {
    console.log("change counter:" + e + "." + $('#find_countPer').val());
    $("#find_servicePer").html("");
    $("#find_servicePer").html("<option value=''>全部</option>").trigger("change");
    GasModSys.copyUsersInArea({
        "areaId": $('#find_unit').val(),
        "countperId": $('#find_countPer').val(),
        "cb": function (data) {
            if (data) {
                var inhtml = "<option value=''>全部</option>";
                $.each(data, function (idx, row) {
                    inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                })
                $("#find_servicePer").html(inhtml);
                $("#find_servicePer").val("").change();
            }


        }
    })
})

// 用气性质级联

var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/?query={\"parentTypeId\":\"1\"}",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
$.map(gasTypeHelper.getData(), function (value, key) {
    console.log(key)
    $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
});
$("#find_gasTypeId").on("change", function () {
    console.log($(this).val())
    $('#find_gasTypeId1').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"' + $(this).val() + '"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
        $('#find_gasTypeId1').append('<option value="' + key + '">' + value + '</option>');
    });
});
$("#find_gasTypeId1").on("change", function () {
    console.log($(this).val())
    $('#find_gasTypeId2').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"' + $(this).val() + '"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
        $('#find_gasTypeId2').append('<option value="' + key + '">' + value + '</option>');
    });
});
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id

var xw;
// 供气区域helper
var areaHelper = RefHelper.create({
    ref_url: "gasbizarea/?query={\"status\":\"1\"}",
    ref_col: "areaId",
    ref_display: "areaName",
    sort: "posCode"
});
// 用气性质helper
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});

var bookHelper = RefHelper.create2({
    ref_url: "gasmrdbook",
    ref_col: "bookId",
    ref_display: "bookCode",
});
// 特殊群体
var speHelper = RefHelper.create2({
    ref_url: "gasbizspecial",
    ref_col: "specId",
    ref_display: "specName",
    "sort":"specSort"
});
console.log(speHelper.getData())

var chargeHelper = RefHelper.create2({
    ref_url: "gasbizchargeunit",
    ref_col: "chargeUnitId",
    ref_display: "chargeUnitName"
});
var userHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "employeeName"
});
var userFormat = function () {
    return {
        f: function (val) {
            return userHelper.getDisplay(val)
        },
    }
}();
var chargeFormat = function () {
    return {
        f: function (val) {
            return chargeHelper.getDisplay(val);
        },
    }
}();
var areaFormat = function () {
    return {
        f: function (val) {
            return areaHelper.getDisplay(val);
        },
    }
}();

//Format
var bookFormat = function () {
    return {
        f: function (val) {
            return bookHelper.getDisplay(val);
        },
    }
}();
var gasTypeFormat = function () {
    return {
        f: function (val) {
            return gasTypeHelper.getDisplay(val);
        },
    }
}();

var countperFormat = function () {
    return {
        f: function (val) {
            return userHelper.getDisplay(val);
        },
    }
}();

var serviceFormat = function () {
    return {
        f: function (val) {
            return userHelper.getDisplay(val);
        },
    }
}();

$.each(GasModSys.areaHelper.getRawData(), function (idx, row) {
    $('#find_unit').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
});


var inhabitnatArchiveManagementAction = function () {

    var archiveIdFormat = function () {
        return {
            f: function (val, row) {
                if (row.customerKind == "1") {
                    return "<a  data-target='#residentdetails' class='information' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>";

                } else if (row.customerKind == "9") {
                    return "<a  data-target='#nonresidentdetails' class='noninformation' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>";
                }
            }
        }
    }();

    return {
        init: function () {
            var sdic=Object.keys(speHelper.getData()).sort();
            $.each(sdic, function (val, key) {
                $('#speCustomerType').append('<option value="' + key + '" name="' + key + '">' + speHelper.getData()[key]+ '</option>');
            });
            this.reload();
        },


        reload: function () {
            $('#divtable').html('');

            console.log(loginarea.join())
            var bd = {
                "cols": "*",
                "froms": "gas_ctm_archive",
                "wheres": "1=0",
                "page": true,
                "limit": 50
            };
            wx = XWATable.init(
                {
                    divname: "divtable",
                    tableId: "divtable",
                    findbtn: "find_button",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    // restbase: 'gasctmarchive/queryArchiveInfo',
                    exportxls:{
                        hidden:true,
                    },
                    key_column: 'ctmArchiveId',
                    // restbase: 'gasctmarchive?query={"customerKind":"1"}',
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    coldefs: [

                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            readonly: "readonly",
                            sorting: true,
                            index: 1
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: true,
                            index: 2
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            sorting: true,
                            index: 3
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            readonly: "readonly",
                            format: areaFormat,
                            sorting: true,
                            index: 4
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format: countperFormat,
                            sorting: true,
                            index: 5
                        },
                        {
                            col: "serviceperId",
                            format: serviceFormat,
                            friendly: "抄表员",
                            sorting: true,
                            index: 7
                        },
                        {
                            col: "bookId",
                            friendly: "抄表本",
                            format: bookFormat,
                            sorting: true,
                            index: 8
                        },

                        {
                            col: "customerState",
                            friendly: "客户状态",
                            readonly: "readonly",
                            format: GasModCtm.customerStateFormat,
                            sorting: true,
                            // hidden:true,
                            index: 9
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质",
                            readonly: "readonly",
                            format: gasTypeFormat,
                            ref_url: "gasbizgastype",
                            ref_name: "gasTypeName",
                            ref_value: "gasTypeId",
                            sorting: true,
                            index: 10
                        },
                        {
                            col: "unboltTime",
                            friendly: "开栓时间",
                            readonly: "readonly",
                            format: dateFormat,
                            index: 11
                        },
                        {
                            col: "customerType",
                            friendly: "表类别",
                            readonly: "readonly",
                            sorting: true,
                            format: GasModCtm.customerTypeFormat,
                            index: 12
                        },
                        {
                            col: "population",
                            friendly: "家庭人口数",
                            sorting: true,
                            index: 12
                        },
                        {
                            col: "ctmArchiveId",
                            friendly: "操作",
                            readonly: "readonly",
                            format: archiveIdFormat,
                            sorting: true,
                            index: 13
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {
                        var areaId_select = $('#find_unit option:selected').val(),
                            find_countPer = $('#find_countPer option:selected').val();
                        // var copyerid = $("find_countperId").val()
                        var whereinfo = "";
                        if (areaId_select) {
                            whereinfo += " ca.area_id = '" + areaId_select + "' and ";
                        }
                        if (find_countPer) {
                            whereinfo += " b.countper_id = '" + find_countPer + "' and ";
                        }
                        //添加抄表员的
                        if ($("#find_servicePer option:selected").val()) {
                            whereinfo += " b.serviceper_id = '" + $("#find_servicePer option:selected").val() + "' and ";
                        }
                        if ($("#find_bookcode").val()) {
                            console.log($("#find_bookcode").val())
                            whereinfo += " b.book_code like '%" + $('#find_bookcode').val() + "%' and ";
                        }
                        if ($("#find_tel").val()) {
                            whereinfo += " ca.tel like '%" + $('#find_tel').val() + "%' and ";
                        }

                        if($("#find_gasoucer").val()){
                            whereinfo += " ca.gas_resource = '" + $('#find_gasoucer').val() + "' and ";
                        }
                        if ($('#reviseMeterState').val()) {
                            whereinfo += " c.revise_meter_state = '" + $('#reviseMeterState').val() + "' and ";
                        }
                        if ($('#find_customerCode').val()) {
                            whereinfo += " ca.customer_code = '" + $('#find_customerCode').val() + "' and ";
                        }
                        if ($('#find_customerName').val()) {
                            whereinfo += " ca.customer_name like '%" + $('#find_customerName').val() + "%' and ";
                        }
                        if ($('#find_idcardno').val()) {
                            whereinfo += " ca.idcard like '%" + $('#find_idcardno').val() + "%' and ";
                        }
                        if ($('#find_customerState').val() ){
                            whereinfo += " ca.customer_state = '" + $('#find_customerState').val() + "' and ";
                        }

                        if ($('#find_population').val()) {
                            whereinfo += " h.population = '" + $('#find_population').val() + "' and ";
                        }

                        if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            // console.log($('#find_gasTypeId').val())
                            // whereinfo += " ca.gas_type_id  like '" + $('#find_gasTypeId').val() + "%' and ";
                            if ($('#find_gasTypeId').val() == "2") {
                                whereinfo += " ca.customer_kind='1' and ";
                            } else {
                                whereinfo += " ca.customer_kind='9' and ";
                            }


                        } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            console.log($('#find_gasTypeId1').val())
                            whereinfo += " ca.gas_type_id like '" + $('#find_gasTypeId1').val() + "%' and ";
                        } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && $('#find_gasTypeId2').val()) {
                            console.log($('#find_gasTypeId2').val())
                            whereinfo += " ca.gas_type_id = '" + $('#find_gasTypeId2').val() + "' and ";
                        }

                        if ($('#find_customerType').val()) {
                            whereinfo += " ca.customer_type = '" + $('#find_customerType').val() + "' and ";
                        }

                        if ($('#find_customerAddress').val()) {
                            whereinfo += " ca.customer_address like'%" + $('#find_customerAddress').val() + "%' and ";
                        }


                        if ($('#find_booktype').val()) {
                            whereinfo += " b.book_type = '" + $('#find_booktype').val() + "' and ";
                        }
                        // 特殊群体

                        if($("#speCustomerType").val()){
                            whereinfo += " ca.spe_customer_type like '" + $('#speCustomerType').val() + "%' and ";
                        }

                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += " to_char(ca.unbolt_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "' and ";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " to_char(ca.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        // console.log(whereinfo)
                        bd = {
                            "cols": "ca.*,b.countper_id,b.serviceper_id,h.population",
                            "froms": "gas_ctm_archive ca left join gas_mrd_book b on b.book_id = ca.book_id left join gas_ctm_house h on h.house_id=ca.house_id left join （select * from gas_ctm_meter where meter_user_state<>'99'）c on c.ctm_archive_id=ca.ctm_archive_id ",
                            "wheres": whereinfo + "1=1 order by ca.customer_code",
                            "page": true,
                            "limit": 50
                        };
                        wx.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    },
                    onAdded: function (ret, jsondata) {
                    },

                    onUpdated: function (ret, jsondata) {
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                });
        }
    }
}();



var moneyFormat = function () {
    return {
        f: function (val) {
            if (val) {
                val = val.toFixed(2);
            }
            return val;
        },
    }
}();

//   居民
$(document).on('click', ".information", function () {
    $("#tab1 span").html("");
    $(".picphoto").html("");
    var row = JSON.parse($(this).attr("data-kind"));
    $("#customerCode").val(row.customerCode);
    $("#customerName").val(row.customerName);
    $("#customerAddress").val(row.customerAddress);
    console.log(row.customerType);
    console.log(row.ctmArchiveId);
    var accountId = Restful.findNQ(hzq_rest + 'gaschgaccount?query={"ctmArchiveId":"' + row.ctmArchiveId + '"}');
    console.log(accountId)
    if (row.customerType == "I") {
        $("#icmoney").show();
        $.ajax({
            url: "hzqs/chg/pbibl.do?fh=IBLCHG0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                "ctmArchiveId": row.ctmArchiveId
            }),
            success: function (data) {
                console.log(data)
                var money = Number(data.balance).toFixed(2);
                $("#money").val(money)
            }
        })
    } else {
        $("#icmoney").hide()
    }
    $.ajax({
        url: "hzqs/chg/pbgbl.do?fh=GBLCHG0000000J00&resp=bd",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        type: "post",
        data: JSON.stringify({
            "ctmArchiveId": row.ctmArchiveId
        }),
        success: function (data) {

            var money = Number(data.balance).toFixed(2);
            $("#gasmon").val(money);
        }
    })
    $.ajax({
        url: "hzqs/chg/pbwbl.do?fh=WBLCHG0000000J00&resp=bd",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        type: "post",
        data: JSON.stringify({
            "ctmArchiveId": row.ctmArchiveId
        }),
        success: function (data) {
            console.log(data)
            var money = Number(data.balance).toFixed(2);
            $("#garbagemon").val(money);
        }
    })

    $("#navtab li").eq(0).addClass("active").siblings().removeClass("active");
    $("#tab1").addClass("active").siblings().removeClass("active");
    //客户档案
    ctmarchive(row.ctmArchiveId);
    //合同
    // contract(row.ctmArchiveId, row.customerCode);
    $('#navtab li').data({
        'ctmArchiveId': row.ctmArchiveId,
        'customerCode': row.customerCode,
        'customerKind': "1"
    });
});

var GasModCtms = function () {
    var industrySort = {
        "01": "政府机关", "02": "金融", "03": "信息服务", "04": "进出口贸易", "05": "军事国防", "06": "出版印刷",
        "07": "科研", "08": "制造业", "09": "医药卫生", "10": "石油化工能源", "11": "教育", "12": "旅游", "13": "广播电视",
        "14": "建筑", "15": "邮政", "16": "电信", "17": "工商", "18": "税务", "19": "交通", "20": "会计类", "21": "公检法",
        "22": "零售服务", "23": "餐饮", "24": "住宿", "25": "洗浴", "26": "小吃", "27": "公用事业", "28": "批发销售",
        "29": "事业单位"
    };
    var customerState = { "00": "未开栓", "01": "正常", "02": "暂停用气", "03": "拆除状态",  "04": "长期不用气", "99": "删除" };
    var idcardType = { "1": "营业执照", "2": "法人身份证", "3": "房产证", "4": "租房合同", "5": "居民身份证" };
    var reminderWay = { "1": "微信", "2": "QQ", "3": "电话通知", "4": "短信通知", "5": "门贴" };
    var meterMaterial = { "1": "铁", "2": "铝" };
    var baseMeterVender = { "1": "金卡", "2": "松川", "3": "蓝宝石" };
    var displayType = { "1": "机械", "2": "电子", "3": "机械+电子" };
    var controlType = { "1": "远传阀控", "2": "远传IC卡", "3": "物联卡", "4": "IC卡气量", "5": "IC卡金额" };
    var chipType = { "1": "102卡 气量卡", "2": "102卡 金额卡", "3": "4442卡 气量卡", "4": "4442卡 金额卡" };
    var valveInfo = { "1": "正常", "2": "异常" };
    var powerType = { "1": "干电池", "2": "锂电池" };
    var meterKind = {"01": "普通表", "02": "IC卡气量表", "03": "IC卡金额表", "04": "代码表", "05": "远传表"};
    return {
        meterKindFormat:function(val){
            return   meterKind[val]
        },
        industrySortFormat: function (val) {
            return industrySort[val];
        },
        idcardTypeFormat: function (val) {
            return idcardType[val];
        },
        customerStateFormat: function (val) {
            return customerState[val]
        },
        reminderWayFormat: function (val) {
            return reminderWay[val];
        },
        meterMaterialFormat: function (val) {
            return meterMaterial[val];
        },
        displayTypeFormat: function (val) {
            return displayType[val];
        },
        chipTypeFormat: function (val) {
            return chipType[val];
        },
        controlTypeFormat: function (val) {
            return controlType[val];
        },
        baseMeterVenderFormat: function (val) {
            return baseMeterVender[val];
        },
        valveInfoFormat: function (val) {
            return valveInfo[val];
        },
        powerTypeFormat: function (val) {
            return powerType[val];
        }
    }
}();
var dateForat = function (val) {
    if (val) {
        var data = val.split("T");
        var aa = [];
        for (var i = 0; i < data[1].split(":").length; i++) {
            if (i < 2) {
                aa.push(data[1].split(":")[i])
            }
        }
        data[1] = aa.join(":");
        date = data.join(" ");
        return date;
    } else {
        return " ";
    }

}


var dateForats = function () {
    return {
        f:function(val){
            if (val) {
                var data = val.split("T");
                var aa = [];
                for (var i = 0; i < data[1].split(":").length; i++) {
                    if (i < 2) {
                        aa.push(data[1].split(":")[i])
                    }
                }
                data[1] = aa.join(":");
                date = data.join(" ");
                return date;
            } else {
                return " ";
            }
        }
    }
}()



function ctmarchive(archiveId) {
    var GastypesHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    var userHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName",
    });
    var areasHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var renter = Restful.findNQ(hzq_rest + 'gasctmrenter?query={"ctmArchiveId":"' + archiveId + '"}');
    console.log(renter)
    if (renter.length) {
        $('#tab1 span').each(function (index, val) {
            span = val;
            $.each(renter[0], function (key, val) {
                if (key == "lesseeExpire" && $(span).attr('name') == key) {
                    if (val) {
                        $(span).html(dateForat(val));
                    }

                } else if (key == "lesseeCerType" && $(span).attr('name') == key) {
                    if (val == 1) {
                        // 1：营业执照；2：法人身份证；3：房产证；4：租房合同；5：居民身份证
                        $(span).html("营业执照")
                    } else if (val == 2) {
                        $(span).html("法人身份证")
                    } else if (val == 3) {
                        $(span).html("房产证")
                    } else if (val == 4) {
                        $(span).html("租房合同")
                    } else if (val == 5) {
                        $(span).html("居民身份证")
                    }
                } else {
                    if ($(span).attr('name') == key) {
                        $(span).html(val)
                    }
                }
            })
        })
    }

    var gasctmarchive = Restful.getByID(hzq_rest + "gasctmarchive", archiveId);
    console.log(gasctmarchive);
    $('#tab1 table span').each(function (index, span) {

        var key = $(span).attr('name');
        var val = gasctmarchive[key];
        {
            if (key == "customerType" && $(span).attr('name') == key) {
                if (val == "P") {
                    $(span).html("否")
                } else if (val == 'I') {
                    $(span).html("是")
                }
            } else if (key == "reminderWay" && $(span).attr('name') == key) {
                $(span).html(GasModCtms.reminderWayFormat(val));
            } else if (key == "customerKind" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("居民")
                } else if (val == '9') {
                    $(span).html("非居民")
                }
            } else if (key == "customerState" && $(span).attr('name') == key) {
                if (val) {
                    $(span).html(GasModCtms.customerStateFormat(val));
                }
            } else if (key == "invoiceType" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("普通发票")
                } else if (val == '2') {
                    $(span).html("增值税发票")
                }
            } else if (key == "gasTypeId" && $(span).attr('name') == key) {

                $(span).html(GastypesHelper.getDisplay(val));
            } else if (key == "countperId" && $(span).attr('name') == key) {

                $(span).html(userHelper.getDisplay(val));

            } else if (key == "serviceperId" && $(span).attr('name') == key) {
                $(span).html(userHelper.getDisplay(val));
            } else if (key == "lesseeExpire" && $(span).attr('name') == key) {
                if (val) {
                    $(span).html(dateForat(val));
                }
            } else if (key == "createdTime" && $(span).attr('name') == key) {
                // console.log(key)
                if (val) {
                    val = dateForat(val);
                    // console.log(val)
                    $("#createdTime").html(val);
                }
            } else if (key == "unboltTime" && $(span).attr('name') == key) {
                if (val) {
                    $(span).html(dateForat(val));
                }
            }else if (key == "speCustomerType" && $(span).attr('name') == key) {
                var ss= "";
                if (val) {
                    // console.log("=======",val)
                    var speCustomerTypes = val.split(",")
                    // console.log(speCustomerTypes)
                    for(var i= 0; i<speCustomerTypes.length;i++){
                        if(i == speCustomerTypes.length-1){
                            ss+= speHelper.getDisplay(speCustomerTypes[i])
                        }else{
                            ss+= speHelper.getDisplay(speCustomerTypes[i])+'，'
                        }
                        
                    }
                    $(span).html(ss);
                }
            } else if (key == "hasPet" && $(span).attr('name') == key) {
                if (val == "0") {
                    $(span).html("无");
                } else if (val == "1") {
                    $(span).html("有");
                }
            } else if (key == "issalesRoom" && $(span).attr('name') == key) {
                if (val == "N") {
                    $(span).html("否");
                } else if (val == "Y") {
                    $(span).html("是");
                }
            } else if (key == "validOrInvalid" && $(span).attr('name') == key) {
                if (val == "N") {
                    $(span).html("否");
                } else if (val == "Y") {
                    $(span).html("是");
                }
            } else if (key == "stealGas" && $(span).attr('name') == key) {
                if (val == "N") {
                    $(span).html("否");
                } else if (val == "Y") {
                    $(span).html("是");
                }
            }  else if (key == "lowerProtection" && $(span).attr('name') == key) {
                if (val == "0") {
                    $(span).html("正常");
                } else if (val == "1") {
                    $(span).html("低保");
                } else if (val == "2") {
                    $(span).html("低收入");
                }else if (val == "3") {
                    $(span).html("低困(困难家庭)");
                }
            } else if (key == "idcardType" && $(span).attr('name') == key) {
                if (val == 1) {
                    $(span).html("营业执照")
                } else if (val == 2) {
                    $(span).html("法人身份证")
                } else if (val == 3) {
                    $(span).html("房产证")
                } else if (val == 4) {
                    $(span).html("租房合同")
                } else if (val == 5) {
                    $(span).html("居民身份证")
                }
            } else if (key == "lesseeCerType" && $(span).attr('name') == key) {
                $(span).html(GasModCtms.idcardTypeFormat(val));
            } else if (key == "rentRoom" && $(span).attr('name') == key) {
                if (val == "0") {
                    $(span).html("否");
                } else if (val == "1") {
                    $(span).html("是");
                }
            } else if (key == "areaId" && $(span).attr('name') == key) {
                var v = areasHelper.getDisplay(val);
                $(span).html(v)
            } else if ($(span).attr('name') == key) {
                // {
                $(span).html(val)
                // }
            }
        }
    })
    if (gasctmarchive.bookId) {
        var books = Restful.getByID(hzq_rest + "gasmrdbook", gasctmarchive.bookId);
        delete books["areaId"];
        console.log(books)
        $('#tab1 span').each(function (index, val) {
            span = val;
            $.each(books, function (key, val) {
                if (key == "countperId" && $(span).attr('name') == key) {
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gassysuser",
                        ref_col: "userId",
                        ref_display: "employeeName",
                    });
                    $(span).html(GastypeHelper.getDisplay(val));
                } else if (key == "serviceperId" && $(span).attr('name') == key) {
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gassysuser",
                        ref_col: "userId",
                        ref_display: "employeeName",
                    });
                    $(span).html(GastypeHelper.getDisplay(val));
                } else if ($(span).attr('name') == key) {
                    $(span).html(val)
                }
            })
        })

    }
    if (gasctmarchive.houseId) {
        var houses = Restful.getByID(hzq_rest + "gasctmhouse", gasctmarchive.houseId);
        console.log(houses)
        $('#tab1 span').each(function (index, val) {
            span = val;
            $.each(houses, function (key, val) {
                if ($(span).attr('name') == key) {
                    $(span).html(val)
                }
            })
        })
    }



}

// function contract(archiveId, customerCode) {
$(document).on('click', "#navtab li", function (e) {
    // e.stopPropagation();
    var archiveId = $(this).data('ctmArchiveId');
    var customerCode = $(this).data('customerCode');
    console.log($(this).find('a').text())
    if ($(this).find('a').text() == "合同档案 ") {
        $("#tab_1_2 span").html("");

        var contract = Restful.findNQ(hzq_rest + 'gasctmcontract?query={"ctmArchiveId":"' + archiveId + '"}');
        console.log(contract)
        if (contract.length) {
            $('#tab_1_2 span').each(function (index, val) {
                span = val;
                $.each(contract[0], function (key, va) {
                    if (key == "signupTime" && $(span).attr('name') == key) {
                        console.log(va);
                        console.log(va + "===" + key);
                        if (va) {
                            var data = va.split("T");
                            var aa = [];
                            for (var i = 0; i < data[1].split(":").length; i++) {
                                if (i < 2) {
                                    aa.push(data[1].split(":")[i])
                                }
                            }
                            data[1] = aa.join(":");
                            console.log(data.join(" "));
                            date = data.join(" ");
                            $(span).html(date);
                        }
                    } else if ($(span).attr('name') == key) {
                        $(span).html(va)
                    }
                })
            })
        }

    } else if ($(this).find('a').text() == "表具档案 ") {
        $("#tab_1_3 span").html("");
        var inputQuery = RQLBuilder.and([
            RQLBuilder.equal("ctmArchiveId", archiveId),
            RQLBuilder.equal("meterUserState", "01")
        ]).rql();
        var ctmmeter = Restful.findNQ(hzq_rest + 'gasctmmeter/?query=' + inputQuery);
        console.log(ctmmeter)
        if (ctmmeter.length) {
            var meter = Restful.getByID(hzq_rest + 'gasmtrmeter', ctmmeter[0].meterId);
            console.log(meter);
            if (JSON.stringify(meter) == "{}") {
                return;
            }
            $('#tab_1_3 span').each(function (index, val) {
                span = val;
                $.each(meter, function (key, val) {
                    if (key == "factoryId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrfactory",
                            ref_col: "factoryId",
                            ref_display: "factoryName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "reskindId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrreskind",
                            ref_col: "reskindId",
                            ref_display: "reskindName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "meterTypeId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrmetertype",
                            ref_col: "meterTypeId",
                            ref_display: "meterTypeName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "meterModelId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrmeterspec",
                            ref_col: "meterModelId",
                            ref_display: "meterModelName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "direction" && $(span).attr('name') == key) {
                        if (val == 'L') {
                            $(span).html("左");
                        } else if (val == 'R') {
                            $(span).html("右");
                        }
                    } else if (key == "meterStatus" && $(span).attr('name') == key) {
                        if (val == 1) {
                            $(span).html("正常");
                        } else if (val == 0) {
                            $(span).html("异常");
                        } else if (val == 2) {
                            $(span).html("异常");
                        } else if (val == 3) {
                            $(span).html("表快");
                        } else if (val == 4) {
                            $(span).html("死表");
                        }
                    } else if (key == "meterKind" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.meterKindFormat(val))
                    }  else if (key == "powerType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.powerTypeFormat(val))
                    } else if (key == "valveInfo" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.valveInfoFormat(val))
                    } else if (key == "baseMeterVender" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.baseMeterVenderFormat(val))
                    } else if (key == "meterMaterial" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.meterMaterialFormat(val))
                    } else if (key == "controlType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.controlTypeFormat(val))
                    } else if (key == "displayType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.displayTypeFormat(val))
                    } else if (key == "chipType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.chipTypeFormat(val))
                    } else if (key == "productionDate" && $(span).attr('name') == key) {
                        if (val) {
                            var data = val.split("T");
                            var aa = [];
                            for (var i = 0; i < data[1].split(":").length; i++) {
                                if (i < 2) {
                                    aa.push(data[1].split(":")[i])
                                }
                            }
                            data[1] = aa.join(":");
                            console.log(data.join(" "))
                            date = data.join(" ");
                            $(span).html(date);
                        }
                    } else {
                        if ($(span).attr('name') == key) {
                            console.log(key);
                            $(span).html(val)
                        }
                    }
                })
            })
            var queryCondion = RQLBuilder.and([
                RQLBuilder.equal("factoryId", meter.factoryId),
                RQLBuilder.equal("meterModelId", meter.meterModelId)
            ]).rql()
            var result = Restful.findNQ(hzq_rest + 'gasmtrmeterfactoryspec/?query=' + queryCondion);
            console.log(result);
            if (result.length) {
                console.log(result[0].meterModelId)
                var results = Restful.getByID(hzq_rest + 'gasmtrmeterflow', result[0].meterFlowId);
                console.log(results);
                console.log(results.ratingFlux)
                console.log(results.flowName)
                $("span[name='flow']").html(results.ratingFlux)
                $("span[name='flowRange']").html(results.flowName)
            }
        }
    } else if ($(this).find('a').text() == "燃气设备档案") {
        gasequipment(archiveId,customerCode)
    } else if ($(this).find("a").text() == "业务受理记录") {
        business(customerCode, "divtable2");
    } else if ($(this).find("a").text() == "收费信息") {
        accounting(customerCode, "divtable3");
    } else if ($(this).find("a").text() == "抄表记录") {
        meterreading(archiveId, "divtable6");
    } else if ($(this).find("a").text() == "垃圾费记录") {
        garbage(customerCode, "divtable8",archiveId);
    } else if ($(this).find("a").text() == "计费更正") {
        reduction(archiveId, "divtable10");
    } else if ($(this).find("a").text() == "补气补量") {
        gasrepair(customerCode, "divtable12");
    } else if ($(this).find("a").text() == "协议气量") {
        agreementgas(archiveId, "divtable14");
    } else if ($(this).find("a").text() == "余额变化明细") {
        balancedetails(customerCode, "divtable16", archiveId);
    } else if ($(this).find("a").text() == "追补气量") {
        chase(customerCode, "divtable18");
    } else if ($(this).find("a").text() == "历史照片") {
        historyphoto(customerCode,archiveId, $(this).data('customerKind'));
    }
})
// }
var dated = function () {
    return {
        f: function (val) {

            if (val) {
                return val.split("T").join(" ");
            }

        }
    }
}();
var idbll = function () {
    return {
        f: function (val) {

            if (val == "0") {
                return "未计费"
            } else if (val == "1") {
                return "已计费"
            }

        }
    }
}();

var tradeTypeDesc = { "ZBBLL": "追补", "BLLCORRECT": "计费更正", "ZHYEJZ": "账户余额结转", "ICVBFKH": "IC卡月出账部分扣划",
    "ICVKHERROR": "IC卡月出账扣划失败", "ICVZZKH": "IC卡月出账足额扣划", "ICBANKCOR": "IC卡银行冲正",
    "LHZHZZHKF": "联合账户子账户扣费", "LHZHKH": "联合账户划款", "CHGMONEYERRORCOR": "收费金额变更冲正",
    "CHGMONEYERROR": "收费金额变更", "ICCOR": "IC卡收费冲正", "ICCORICR": "IC卡写卡冲正", "CCHG": "串户收费",
    "RCHG": "串户扣费", "ICCHG": "收费金额", "ICBANKCHG": "银行缴费", "ICUSEMONEY": "IC卡购气金额", "ICTRANSMONEY": "IC卡账户余额转换",
    "ICBANKTRANSMONEY": "IC卡银行账户余额转换", "ICUSECOMPLEMENT": "IC卡补气补量", "ICICR": "IC卡写卡", "ICBANKICR": "IC卡银行写卡",
    "METERCHG": "普表收费", "METERBANKCHG": "普表银行收费", "ICRFDBALANCE": "IC卡退款入账",
    "ICRFD": "IC卡退款", "ICRFDICR": "IC卡退款写卡冲正","CHANGEMBLL":"换表剩余气量转余额","WASTECHG":"垃圾费收费",
    "RFDRESIVE":"退款领取","WASTEBLL":"垃圾费计费","ICBCLEAR":"虚拟余额清零"
};
var tradeTyp = { "BLL":"计费", "DIS": "优惠", "CHG": "收费", "COR": "冲正", "CLR": "清算", "RFD": "退款", "ICR": "写卡", "ICB": "扣划" }
var clrtag = { "0": "未清算", "1": "清算中", "2": "已清算", "9": "不需清算" }
var clrtagFormat = function () {
    return {
        f: function (val) {
            return clrtag[val];
        }
    }
}();
var tradeTypeFormat = function () {
    return {
        f: function (val, row) {
            // console.log(row)
            if (row.tradeTypeDesc) {
                return tradeTypeDesc[row.tradeTypeDesc];
            } else {
                return tradeTyp[val];
            }
        }
    }
}();
var largeContentFormat = function () {
    return {
        f: function (val, row) {
            if (val) {
                console.log(val);
                if (val.length > 10) {
                    return "<label data-toggle=\"tooltip\" data-placement=\"left\" title=\"" + val + "\">" + val.substring(0, 10) + "</a>"
                } else {
                    return val;
                }
            } else {
                return "";
            }
        }
    }
}();
var money1Format = function () {
    return {
        f: function (val, row) {
            // console.log(val)
            // console.log(row)
            if ((val || val == "0") && val != "undefined") {
                if (row.tradeType == 'ICB' || row.tradeType == 'ICR') {
                    return " ";
                } else {
                    if(row.tradeTypeDesc == "ZHYEJZ" && row.customerType != "P") {
                        return "";
                    }else{
                        return Number(val).toFixed(2);
                    }

                }
            } else {
                return " ";
            }
        }
    }
}();
var lastmoney1Format = function () {
    return {
        f: function (val, row) {
            if ((val || val == "0") && val != "undefined") {
                if (row.tradeType == 'ICB' || row.tradeType == 'ICR') {
                    return " ";
                } else {
                    if(row.tradeTypeDesc == "ZHYEJZ" && row.customerType != "P") {
                        return "";
                    }else{
                        return Number(val).toFixed(2);
                    }
                }
            } else {
                return " ";
            }
        }
    }
}();
var lastICmoneyFormat = function () {
    return {
        f: function (val, row) {
            // console.log(row)
            // console.log(val)
            if ((val || val == "0") && val != "undefined") {
                if (row.tradeType == 'ICB' || row.tradeType == 'ICR' && (row.lastIcMoney || row.lastIcMoney == "0")) {
                    if(row.tradeTypeDesc == "ZHYEJZ" && row.customerType != "I") {
                        return "";
                    }else{
                        var lastIcMoney = row.lastIcMoney;
                        return Number(lastIcMoney).toFixed(2);
                    }

                } else if(row.tradeType == ' '){
                    // console.log(row.lastIcMoney)
                    if(row.tradeTypeDesc == "ZHYEJZ" && row.customerType != "I") {
                        return "";
                    }else{
                        var lastIcMoneys = row.lastIcMoney;
                        return Number(lastIcMoneys).toFixed(2);
                    }

                }  else {
                    return " ";
                }
            }else {
                return " ";
            }
        }
    }
}();
var money2Format = function () {
    return {
        f: function (val, row) {
            if ((row.tradeType == 'ICB' || row.tradeType == 'ICR') && (row.money || row.money == "0")) {
                if(row.tradeTypeDesc == "ZHYEJZ" && row.customerType != "I") {
                    return "";
                }else{
                    var money = row.money;
                    return Number(money).toFixed(2);
                }

            }else if(row.tradeType == ' '){
                if(row.tradeTypeDesc == "ZHYEJZ" && row.customerType != "I") {
                    return "";
                }else{
                    var moneys = row.money;
                    return Number(moneys).toFixed(2);
                }
            }else {
                return " ";
            }
        }
    }
}();
var gaschgtypeHelper = RefHelper.create({
    ref_url: "gaschgtype",
    ref_col: "chgTypeId",
    ref_display: "chargeTypeName"
})
var chargeTypeNameFormat = function () {
    return {
        f: function (val) {
            return gaschgtypeHelper.getDisplay(val)
        },
    }
}();
var arerHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
})
var arerFormat = function () {
    return {
        f: function (val) {
            return arerHelper.getDisplay(val)
        },
    }
}();
var usersHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "areaId"
});
/*var userHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "employeeName"
});
var userFormat = function () {
    return {
        f: function (val) {
            return userHelper.getDisplay(val)
        },
    }
}();
var chargeHelper = RefHelper.create({
    ref_url: "gasbizchargeunit",
    ref_col: "chargeUnitId",
    ref_display: "chargeUnitName"
});
var chargeFormat = function () {
    return {
        f: function (val) {
            return chargeHelper.getDisplay(val)
        },
    }
}();*/

//抄表记录
function meterreading(archiveId, div) {

    $("#" + div).html("");

    var bd = {
        "cols":"distinct a.*,b.created_time as qwe,b.gasFee1,b.gasFee2,b.gasFee3,b.gasFee4,b.gasFee5,b.gasFee",
        "froms":"gas_mrd_meter_reading a left join gas_bll_detail b on b.meter_reading_id = a.meter_reading_id",
        "wheres":"a.ctm_archive_id='"+archiveId+"' and a.is_mrd = '1' and a.copy_state  not in ('9','E') order by a.copy_time desc",
        "page":true,
        "limit":50
    }

    var bllmoney = function(){
        return {
            f:function(val,row){
                var bllmoneys=0;
                if(row.gasFee1){
                    bllmoneys += row.gasFee1;
                }else{
                    bllmoneys += 0;
                }
                if(row.gasFee2){
                    bllmoneys += row.gasFee2;
                }else{
                    bllmoneys += 0;
                }
                if(row.gasFee3){
                    bllmoneys += row.gasFee3;
                }else{
                    bllmoneys += 0;
                }
                if(row.gasFee4){
                    bllmoneys += row.gasFee4;
                }else{
                    bllmoneys += 0;
                }
                if(row.gasFee5){
                    bllmoneys += row.gasFee5;
                }else{
                    bllmoneys += 0;
                }
                bllmoneys = Number(bllmoneys).toFixed(2);
                console.log(bllmoneys)
                return bllmoneys;
            }
        }
    }()

    /*var queryCondion = RQLBuilder.and([
        RQLBuilder.equal("ctmArchiveId", archiveId),
        RQLBuilder.equal("isMrd", "1"),
        RQLBuilder.condition_fc("copyState", "$nin", '["9","E"]'),

    ]).rql()*/
    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        checkboxes: true,
        sorting: true,
        checkAllToggle: true,
        //----------------基本restful地址---
        // restbase: 'gasmrdmeterreading/?query=' + queryCondion + '&sort=-copyTime',
        restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        key_column: 'meterReadingId',
        coldefs: [
            {
                col: "bookCode",
                friendly: "抄表本",
                readonly: "readonly",
                sorting: true,
                index: 1
            },
            {
                col: "areaId",
                friendly: "供气区域",
                format: GasModSys.areaFormat,
                sorting: true,
                inputsource: "select",
                index: 3
            },
            {
                col: "countperId",
                friendly: "核算员",
                format: countperFormat,
                sorting: true,
                index: 4
            },
            {
                col: "serviceperId",
                format: serviceFormat,
                friendly: "抄表员",
                sorting: true,
                index: 5
            },
            {
                col: "meterReading",
                friendly: "燃气表读数",
                sorting: true,
                index: 6
            },
            {
                col: "reviseReading",
                friendly: "修正表读数",
                sorting: true,
                inputsource: "number",
                index: 7
            },
            {
                col: "quotiety",
                friendly: "修正系数",
                sorting: true,
                index: 8
            },
            {
                col: "dailyMeasure",
                friendly: "日均用气量",
                sorting: true,
                index: 9
            },
            {
                col: "copyType",
                friendly: "抄表类型",
                sorting: true,
                format: GasModMrd.copyTypeFormat,
                index: 10
            },
            {
                col: "operate",
                friendly: "类型",
                sorting: true,
                format: GasModMrd.enumOperateFormat,
                index: 10
            },
            {
                col: "copyState",
                friendly: "抄表状态",
                sorting: true,
                format: GasModMrd.mrdStateFormat,
                index: 11
            },

            {
                col: "chargeMeterReading",
                friendly: "用气量",
                sorting: true,
                index: 12
            },
            {
                col: "lastMeterReading",
                friendly: "上次表读数",
                sorting: true,
                index: 13
            },
            {
                col: "remaingAsnum",
                friendly: "表内剩余气量",
                sorting: true,
                index: 14
            },
            {
                col: "cardBalancEsum",
                friendly: "抄回表内剩余余额",
                sorting: true,
                index: 15
            },
            {
                col: "isBll",
                friendly: "是否已经计费",
                format: idbll,
                sorting: true,
                index: 16
            },
            {
                col: "copyTime",
                friendly: "抄表时间",
                format: dated,
                sorting: true,
                index: 17
            },
            {
                col: "lastReadingDate",
                friendly: "上次抄表日期",
                sorting: true,
                format: dated,
                index: 18
            },
            {
                col: "qwe",
                friendly: "计费时间",
                sorting: true,
                format: dateFormat,
                index: 19
            },
            {
                col: "gasFee",
                friendly: "计费金额",
                sorting: true,
                // format: bllmoney,
                index:20
            },

        ]

    }) //--init

}
//业务受理记录
function business(customerCode, div) {
    var businessHelper = RefHelper.create({
        ref_url: "gascsrbusinesstype",
        ref_col: "businessTypeId",
        ref_display: "name",
    });

    var businessFormat = function () {
        return {
            f: function (val) {
                return businessHelper.getDisplay(val)
            },
        }
    }();
    var bilstateFormat = function () {
        return {
            f: function (val) {
                if (val == "N") {
                    return "默认"
                } else if (val == "Y") {
                    return "完成"
                }

            },
        }
    }();
    var pictureFormat = function () {
        return {
            f: function (val, row) {
                console.log(row)
                if(val){
                    return "<a  data-target='#pic' class='pictures' data-toggle='modal' data-pic='" + val + "'>图片</a>"
                }else{
                    return " 无照片"
                }

            },
        }
    }();
    $("#" + div).html("");
    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------基本restful地址---
        restbase: 'gascsrbusiregister/?query={"customerCode":"' + customerCode + '"}"',
        key_column: 'busiregisterid',
        coldefs: [
            {
                col: "businessTypeId",
                friendly: "业务类型",
                format: businessFormat,
                sorting: true,
                index: 1
            },
            {
                col: "customerCode",
                friendly: "客户编号",
                sorting: true,
                index: 2
            },

            {
                col: "customerName",
                friendly: "客户名称",
                sorting: true,
                index: 3
            },
            {
                col: "customerAddr",
                friendly: "客户地址",
                sorting: true,
                index: 4
            },
            {
                col: "linkMan",
                friendly: "联系人",
                sorting: true,
                index: 5
            },
            {
                col: "linkPhone",
                friendly: "联系人电话",
                sorting: true,
                index: 6
            },
            {
                col: "precontractTime",
                friendly: "预约时间",
                format: dated,
                sorting: true,
                index: 7
            },
            {
                col: "acceptDate",
                friendly: "受理时间",
                format: dated,
                sorting: true,
                index: 8
            },
            {
                col: "busiAcceptCode",
                friendly: "受理单号",
                sorting: true,
                index: 9
            },
            /*{
                col: "finishDate",
                friendly: "完成时间",
                format: dated,
                sorting: true,
                index: 10
            },
            {
                col: "billState",
                friendly: "单据状态",
                format: bilstateFormat,
                sorting: true,
                index: 10
            },*/
            {
                col: "reservedField2",
                friendly: "图片",
                format: pictureFormat,
                sorting: true,
                index: 10
            }
        ]

    })
}

var cbpgridgallery = new CBPGridGallery(document.getElementById('grid-gallerys'));
$(document).on('click', ".pictures", function () {
    console.log($(this).attr("data-pic"));
    $("#grids").html("")
    $("#slideIds").html("")
   /* if (!$(this).attr("data-pic") || $(this).attr("data-pic") == "undefined") {
        $("#grids").html("<center><h4>暂无照片。</h4></center>")
        // bootbox.alert("<center><h4>暂无照片。</h4></center>");
        return false;
    }*/

    // cbpgridgallery._init();
    $.ajax({
        url: hzq_rest + "gasbasfile?fields={}&query={\"busiId\":\"" + $(this).attr("data-pic") + "\"}",
        method: "get",
        async: true,
        dataType: "json",
        success: function (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var datali = data[i];
                    $("#grids").append("<li><figure><img src='/hzqs/sys/download.do?fileId=" + datali.fileId + "&w=" + (300 + i) + "' alt='" + datali.fileName + "'/></figure></li>")
                    $("#slideIds").append("<li><figure><img src='/hzqs/sys/download.do?fileId=" + datali.fileId + "' alt='" + datali.fileName + "'/></figure></li>")
                }
                setTimeout(function(){
                    cbpgridgallery._init();
                },300)
            }
           /* // console.log("ssdsds===" + JSON.stringify(data));icon nav-next
            cbpgridgallery._init();*/
        },
        error: function (data) {
            bootbox.alert(data);
        }

    });
    // cbpgridgallery._init();
})
$('#pic').on('hide.bs.modal', function () {
    $("#grid-gallerys").removeClass('slideshow-open');
    $("#grids").html("");
    $("#slideIds").html("");
    cbpgridgallery._init()
})
//收费信息
/*var tradeTyp = { "BLL": "计费", "DIS": "优惠", "CHG": "收费", "CLR": "清算", "RFD": "退款" }
var clrtag = { "0": "未清算", "1": "清算中", "2": "已清算", "9": "不需清算" }
var clrtagFormat = function () {
    return {
        f: function (val) {
            return clrtag[val];
        }
    }
}();
var tradeTypeFormat = function () {
    return {
        f: function (val) {
            return tradeTyp[val];
        }
    }
}();
var gaschgtypeHelper = RefHelper.create({
    ref_url: "gaschgtype",
    ref_col: "chgTypeId",
    ref_display: "chargeTypeName"
})
var chargeTypeNameFormat = function () {
    return {
        f: function (val) {
            console.log(val)
            return gaschgtypeHelper.getDisplay(val)
        },
    }
}();
var arerHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
})
var arerFormat = function () {
    return {
        f: function (val) {
            return arerHelper.getDisplay(val)
        },
    }
}();
var userHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "employeeName"
});
var userFormat = function () {
    return {
        f: function (val) {
            return userHelper.getDisplay(val)
        },
    }
}();*/
/*var chargeHelper = RefHelper.create({
    ref_url: "gasbizchargeunit",
    ref_col: "chargeUnitId",
    ref_display: "chargeUnitName"
});
var chargeFormat = function () {
    return {
        f: function (val) {
            return chargeHelper.getDisplay(val)
        },
    }
}()*/
function accounting(customerCode, div) {

    var bd = {
        "cols": "s.*",
        "froms": "(select  det.trade_id,atl.* from  gas_chg_gas_detail det inner join gas_act_gasfee_atl atl on atl.gasfee_atl_id=det.trade_id where atl.customer_code='" + customerCode + "' union " +
        "select ba.trade_atl_id,atl.* from gas_chg_gas_balance_detail ba inner join gas_act_gasfee_atl atl on atl.gasfee_atl_id=ba.trade_atl_id where atl.customer_code='" + customerCode + "') s order by s.trade_date desc",
        "where": "",
        "page": true,
        "limit": 50
    }
    var usersHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "areaId"
    });
    var useridFormat = function () {
        return {
            f: function (val,row) {
                console.log(row)
                if(row.userId){
                    var aieaId = usersHelper.getDisplay(row.userId)
                    return areaHelper.getDisplay(aieaId)
                }else{
                    return "";
                }

            },
        }
    }();
    console.log(customerCode)
    $("#" + div).html("");

    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------基本restful地址---
        restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        // restbase: 'gasactgasfeeatl/?query={"customerCode":"' + customerCode + '"}',
        key_column: 'gasfeeAtlId',
        coldefs: [
            {
                col: "tradeType",
                friendly: "交易类型",
                format: tradeTypeFormat,
                sorting: true,
                index: 1
            },
            {
                col: "chargeUnitId",
                friendly: "营业网点",
                format: chargeFormat,
                sorting: true,
                index: 2
            },
            {
                col: "userId",
                friendly: "营业员",
                format: userFormat,
                sorting: true,
                index: 3
            },
            {
                col: "userId1",
                friendly: "供气区域",
                format: useridFormat,
                sorting: true,
                index: 4
            },

            {
                col: "chgTypeId",
                friendly: "收费方式",
                format: chargeTypeNameFormat,
                sorting: true,
                index: 5
            },
            {
                col: "money",
                friendly: "金额",
                format: moneyFormat,
                sorting: true,
                index: 6
            },
            {
                col: "tradeDate",
                friendly: "交易时间",
                format: dateFat,
                sorting: true,
                index: 7
            },
            /*{
             col: "clrDate",
             friendly: "清算时间",
             format:dateFat,
             sorting: true,
             index: 10
             },
             {
             col: "clrTag",
             friendly: "清算标志",
             format:clrtagFormat,
             sorting: true,
             index: 11
             },*/
        ]
    })

}


$("#residentdetails").draggable({
    handle: ".modal-header",
    cursor: 'move',
    refreshPositions: true
});

//垃圾费
function garbage(customerCode, div, archiveId) {
    console.log(archiveId)
    $("#" + div).html("");
    var result = Restful.findNQ(hzq_rest + 'gaschgaccount/?query={"ctmArchiveId":"' + archiveId + '"}');
    console.log(result)
    var chgAccountIdresult = Restful.findNQ(hzq_rest + 'gasactwastefeeaccount/?query={"chgAccountId":"' + result[0].chgAccountId + '"}');
    console.log(chgAccountIdresult)
    var queryCondions = RQLBuilder.and([
        RQLBuilder.condition_fc("tradeType", "$nin", '["CLR"]'),
        RQLBuilder.equal("wastefeeAccountId", chgAccountIdresult[0].wastefeeAccountId),
    ]).rql()

    var bd = {
        "cols":"atl.*",
        "froms":"gas_chg_account acc left join gas_act_wastefee_account was on was.chg_account_id = acc.chg_account_id left join gas_act_wastefee_atl atl on " +
        "atl.wastefee_account_id = was.wastefee_account_id",
        "wheres":"acc.ctm_archive_id = '"+archiveId+"' and atl.trade_type <> 'CLR' order by clr_date desc,trade_date desc,wastefee_atl_id desc",
        "page":true,
        "limit":50
    }

    // var chgAccountIdresults = Restful.findNQ(hzq_rest + 'gasactwastefeeatl/?query=' + queryCondion);
    // console.log(chgAccountIdresults);
    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        sorting: false,
        checkAllToggle: true,
        //----------------基本restful地址---GAS_ACT_WASTEFEE_ATL
        restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        // restbase: 'gasactwastefeeatl/?query=' + queryCondions + "&sort=-clrDate,-tradeDate,-gasfeeAtlId",
        key_column: 'wastefeeAtlId',
        coldefs: [
            {
                col: "tradeType",
                friendly: "交易类型",
                format: tradeTypeFormat,
                sorting: true,
                index: 1
            },
            {
                col: "chargeUnitId",
                friendly: "营业网点",
                format: chargeFormat,
                sorting: true,
                index: 2
            },
            {
                col: "areaId",
                friendly: "供气区域",
                format: arerFormat,
                sorting: true,
                index: 3
            },
            {
                col: "userId",
                friendly: "营业员",
                format: userFormat,
                sorting: true,
                index: 4
            },
            {
                col: "chgTypeId",
                friendly: "收费方式",
                format: chargeTypeNameFormat,
                sorting: true,
                index: 5
            },
           /* {
                col: "gas",
                friendly: "气量",
                sorting: true,
                index: 5
            },*/
            {
                col: "money",
                friendly: "金额",
                format: money1Format,
                sorting: true,
                index: 7
            },
            {
                col: "lastMoney",
                friendly: "账户余额",
                format: lastmoney1Format,
                sorting: true,
                index: 8
            },
            /*{
                col: "icmoney",
                friendly: "IC卡金额",
                format: money2Format,
                sorting: true,
                index: 9
            },
            {
                col: "lastIcMoney",
                friendly: "IC卡虚拟余额",
                format: lastICmoneyFormat,
                sorting: true,
                index: 10
            },*/
            {
                col: "tradeDate",
                friendly: "交易时间",
                format: dateFat,
                sorting: true,
                index: 11
            },
            {
                col: "clrDate",
                friendly: "清算时间",
                format: dateFat,
                sorting: true,
                index: 12
            },
            {
                col: "clrTag",
                friendly: "清算标志",
                format: clrtagFormat,
                sorting: true,
                index: 13
            },
            {
                col: "reservedField2",
                friendly: "备注",
                format: largeContentFormat,
                sorting: true,
                index: 14
            }
        ]
    })
   /* var bd = {
        "cols": "s.*",
        "froms": "(select  det.trade_id,atl.* from  gas_chg_waste_detail det inner join gas_act_wastefee_atl atl on atl.wastefee_atl_id=det.trade_id where atl.customer_code='" + customerCode + "' union " +
        "select ba.trade_atl_id,atl.* from gas_chg_waste_balance_detail ba inner join gas_act_wastefee_atl atl on atl.wastefee_atl_id=ba.trade_atl_id where atl.customer_code='" + customerCode + "') s order by s.trade_date desc",
        "where": "",
        "page": true,
        "limit": 50
    }
    console.log(customerCode)
    $("#" + div).html("");

    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------基本restful地址---
        restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        // restbase: 'gasactgasfeeatl/?query={"customerCode":"' + customerCode + '"}',
        key_column: 'gasfeeAtlId',
        coldefs: [
            {
                col: "tradeType",
                friendly: "交易类型",
                format: tradeTypeFormat,
                sorting: true,
                index: 1
            },
            {
                col: "chargeUnitId",
                friendly: "营业网点",
                format: chargeFormat,
                sorting: true,
                index: 2
            },
            {
                col: "areaId",
                friendly: "供气区域",
                format: arerFormat,
                sorting: true,
                index: 3
            },
            {
                col: "userId",
                friendly: "营业员",
                format: userFormat,
                sorting: true,
                index: 4
            },
            {
                col: "chgTypeId",
                friendly: "收费方式",
                format: chargeTypeNameFormat,
                sorting: true,
                index: 5
            },
            {
                col: "money",
                friendly: "金额",
                format: moneyFormat,
                sorting: true,
                index: 7
            },
            {
                col: "tradeDate",
                friendly: "交易时间",
                format: dateFat,
                sorting: true,
                index: 9
            },
            /!*{
             col: "clrDate",
             friendly: "清算时间",
             format:dateFat,
             sorting: true,
             index: 10
             },
             {
             col: "clrTag",
             friendly: "清算标志",
             format:clrtagFormat,
             sorting: true,
             index: 11
             },*!/
        ]
    })*/
}
//燃气设备

var sources={"0":"其他","1":"公司"}
var sourceFormat = function(){
    return{
        f:function(val){
            return sources[val]
        }
    }
}()
var deviceHelper=RefHelper.create({
    ref_url:"gasbizdevice",
    ref_col:"deviceCode",
    ref_display:"deviceName"
});
var deviceFormat=function(){
    return {
        f: function(val){
            console.log(val)
            console.log(deviceHelper)
            return deviceHelper.getDisplay(val);
        }
    }
}();
function gasequipment(ctmarchiveId,customerCode) {
    console.log(ctmarchiveId)
    var rest = Restful.findNQ(hzq_rest + 'gasctmrsdtdevicearchive/?query={"ctmArchiveId":"' + ctmarchiveId + '"}');
    console.log(rest)
    if (rest.length) {
        console.log(rest)
        $.each(rest[0], function (key, val) {
            $("#tab_1_4 input[type='radio'][name='" + key + "'][value='" + val + "']").parent('span').addClass("checked");
            if (val.indexOf('T') != '-1') {
                $("#tab_1_4 input[type='text'][name='" + key + "']").val(val.split("T")[0]);
            } else {
                $("#tab_1_4 input[type='text'][name='" + key + "']").val(val);
            }
            $("#tab_1_4 input").attr('disabled', true)
        });

    } else {
        $("#tab_1_4 input").attr('disabled', true)
        $("#tab_1_4 input[type='text']").val("");
        $("#tab_1_4 input[type='radio']").parent('span').removeClass("checked");
    }
   $("#devices").html("")
    var xw = XWATable.init({
        divname: "devices",
        //----------------table的选项-------
        pageSize: 10,
        pageSizes:[10,20,30,40],
        columnPicker: true,
        transition: 'fade',
        // tableId: "divtable",
        checkboxes: true, 
        checkAllToggle: true,
        //----------------基本restful地址---
        restbase: 'gasctmnonrsdtdevicedetail/?query={"customerCode":"'+customerCode+'"}"',
        key_column: 'nonrsdtArchiveDetailId',
        coldefs: [
            {
                col:"nonrsdtArchiveDetailId",
                friendly:"nonrsdtArchiveDetailId",
                nonedit:"nosend",
                hidden:true,
                unique:true,
                index:1
            },
            {
                col: "name",
                friendly: "设备名称",
                sorting: false,
                format:deviceFormat,
                index: 1
            },
            {
                col: "deviceCode",
                friendly: "设备编号",
                validate:"required",
                readonly:"readonly",
                sorting: false,
                index: 2
            },
            {
                col: "count",
                friendly: "设备数量",
                sorting: false,
                validate:"onlyNumber length[1-2]",
                index: 3
            },
            {
                col: "position",
                friendly: "设备安装位置",
                sorting: false,
                index: 4
            },
            {
                col: "brand",
                friendly: "设备品牌",
                sorting: false,
                index: 5
            },
            {
                col: "model",
                friendly: "设备型号",
                sorting: false,
                index: 6
            },
            {
                col: "thermalPower",
                friendly: "额定热功率",
                sorting: false,
                index: 7
            },
            {
                col: "productionTime",
                friendly: "出厂日期",
                inputsource:"datepicker",
                sorting: false,
                index: 8
            },
            {
                col: "saleTime",
                friendly: "出售日期",
                inputsource:"datepicker",
                sorting: false,
                index: 9
            },
            {
                col: "source",
                friendly: "来源",
                format:sourceFormat,
                inputsource: "custom",
                inputbuilder: "sourceBuilder",
                sorting: false,
                index: 10
            },
            
            {
                col: "capacity",
                friendly: "容量/耗气量",
                sorting: false,
                index: 11
            },
            {
                col: "remark",
                friendly: "备注",
                sorting: false,
                index: 12
            }
        ]

    });





}
// 计费更正
function reduction(archiveId, div) {
    console.log(archiveId)
    console.log(div)
    $("#" + div).html("");
    var arerHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    })
    var arerFormat = function () {
        return {
            f: function (val) {
                return arerHelper.getDisplay(val)
            },
        }
    }();
    var examineState= function () {
        return {
            f: function (val) {
                if(val==="1") return "<font>审核中</font>";
                else if(val==="2") return "<font>审核通过</font>";
                else if(val==="3") return "<font>审核未通过</font>";
                else if(val==="4") return "<font>待审批</font>";
                else if(val==="5") return "<font>已撤销</font>";
                else return " ";
            }
        }
    }()
    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------基本restful地址---
        restbase: 'gasbllcorrectflow/?query={"ctmArchiveId":"' + archiveId + '"}&sort=-createdTime',
        key_column: 'correctFlowId',
        coldefs: [
            {
                col: "areaId",
                friendly: "供气区域",
                format: arerFormat,
                sorting: true,
                index: 1
            },
            {
                col: "correctGas",
                friendly: "更正气量",
                sorting: true,
                index: 2
            },
            {
                col: "correctMon",
                friendly: "更正金额",
                format: moneyFormat,
                sorting: true,
                index: 3
            },
            {
                col: "correctReason",
                friendly: "更正原因",
                sorting: true,
                index: 4
            },
            {
                col: "createdTime",
                friendly: "申请时间",
                format:dateForats,
                sorting: true,
                index: 5
            },{
                col: "status",
                friendly: "审批状态",
                format:examineState,
                sorting: true,
                index: 6
            },
            {
                col: "remark",
                friendly: "备注",
                sorting: true,
                index: 7
            },

        ]

    })

}
//补气补量
function gasrepair(customerCode, div) {
    $("#" + div).html("");
    var useStateFormat = function () {
        return {
            f: function (val) {
                if (val == "0") {
                    return "未使用";
                } else if (val == "1") {
                    return "已使用";
                }
            }
        }
    }();

    var applyReasonFormat = function () {
        return {
            f: function (val) {
                if (val == "1") {
                    return "丢失";
                } else if (val == "2") {
                    return "损坏";
                } else if (val == "3") {
                    return "其他";
                }
            }
        }
    }();
    var applyStatetFormat = function () {
        return {
            f: function (val) {
                // var applyState = {"1":"审批中","2": "审批通过","3":"审批不通过"};
                // return applyState[val];
                if (val == "1") {
                    return "审批中"
                } else if (val == "2") {
                    return "审批通过"
                } else if (val == "3") { }
                return "审批未通过"
            }
        }


    }();

    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------基本restful地址---
        restbase: 'gaschgiccardcomplement/?query={"customerCode":"' + customerCode + '"}&sort=-applyTime',
        key_column: 'complementId',
        coldefs: [
            /*{
             col: "complementId",
             friendly: "申请Id",
             validate: "required",
             hidden: true,
             unique: "true",
             index: 1
             },*/
            /*{
             col: "customerCode",
             friendly: "客户编号",
             sorting: true,
             index: 1
             },
             {
             col: "customerName",
             friendly: "客户名称",
             sorting: true,
             index: 2
             },*/
            {
                col: "applyGas",
                friendly: "申请气量",
                sorting: true,
                index: 3
            },
            {
                col: "approveGas",
                friendly: "标准气量",
                sorting: true,
                index: 4
            },
            {
                col: "applyReason",
                friendly: "申请原因",
                format: applyReasonFormat,
                sorting: true,
                index: 5
            },
            {
                col: "applyTime",
                friendly: "申请时间",
                sorting: true,
                index: 6
            },
            {
                col: "approveTime",
                friendly: "批准时间",
                sorting: true,
                index: 7
            },
            {
                col: "useTime",
                friendly: "使用时间",
                sorting: true,
                index: 8
            },
            {
                col: "applyState",
                friendly: "申请状态",
                format: applyStatetFormat,
                sorting: true,
                index: 9
            },
            {
                col: "useState",
                friendly: "使用状态",
                format: useStateFormat,
                sorting: true,
                index: 9
            },
            {
                col: "remark",
                friendly: "备注",
                sorting: true,
                index: 10
            }

        ]

    })
}
//协议气量
function agreementgas(archiveId, div) {
    $("#" + div).html("");
    console.log(archiveId)

    var queryCondion = RQLBuilder.and([
        RQLBuilder.equal("ctmArchiveId", archiveId),

    ]).rql()
    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------基本restful地址---
        restbase: 'gasactagreegasflow/?query=' + queryCondion + "&sort=-startTime",
        key_column: 'actAgreegasFlowId',
        coldefs: [

            {
                col: "applyCode",
                friendly: "申请单号",
                sorting: true,
                index: 1
            },
            {
                col: "agreeGas",
                friendly: "协议气量",
                sorting: true,
                index: 1
            },
            {
                col: "agreeMon",
                friendly: "协议金额",
                format: moneyFormat,
                sorting: true,
                index: 2
            },
            {
                col: "argeeReason",
                friendly: "协议原因",
                sorting: true,
                index: 3
            },
            {
                col: "measurePrice",
                friendly: "阶梯和气价",
                sorting: true,
                index: 4
            },
            {
                col: "startTime",
                friendly: "开始时间",
                format: dateFormat,
                sorting: true,
                index: 5
            },
            {
                col: "endTime",
                friendly: "截止时间",
                format: dateFormat,
                sorting: true,
                index: 6
            },
            {
                col: "remark",
                friendly: "备注",
                sorting: true,
                index: 7
            }

        ]

    })
}

//余额变化明细
function balancedetails(customerCode, div, archiveId) {
    $("#" + div).html("");
    var result = Restful.findNQ(hzq_rest + 'gaschgaccount/?query={"ctmArchiveId":"' + archiveId + '"}');
    var chgAccountIdresult = Restful.findNQ(hzq_rest + 'gasactgasfeeaccount/?query={"chgAccountId":"' + result[0].chgAccountId + '"}');
    var queryCondion = RQLBuilder.and([
        RQLBuilder.condition_fc("tradeType", "$nin", '["CLR"]'),
        RQLBuilder.equal("gasfeeAccountId", chgAccountIdresult[0].gasfeeAccountId),
    ]).rql()
    var useridFormat = function () {
        return {
            f: function (val,row) {
                console.log(row)
                if(row.userId){
                    var aieaId = usersHelper.getDisplay(row.userId)
                    console.log(aieaId)
                    return areaHelper.getDisplay(aieaId)
                }else{
                    return "";
                }

            },
        }
    }();
    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        sorting: false,
        checkAllToggle: true,
        //----------------基本restful地址---
        // restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        restbase: 'gasactgasfeeatl/?query=' + queryCondion + "&sort=-clrDate,-tradeDate,-gasfeeAtlId",
        key_column: 'gasfeeAtlId',
        coldefs: [
            {
                col: "tradeType",
                friendly: "交易类型",
                format: tradeTypeFormat,
                sorting: true,
                index: 1
            },
            {
                col: "chargeUnitId",
                friendly: "营业网点",
                format: chargeFormat,
                sorting: true,
                index: 2
            },
            {
                col: "userId1",
                friendly: "供气区域",
                format: useridFormat,
                sorting: true,
                index: 3
            },
            {
                col: "userId",
                friendly: "营业员",
                format: userFormat,
                sorting: true,
                index: 4
            },
            {
                col: "chgTypeId",
                friendly: "收费方式",
                format: chargeTypeNameFormat,
                sorting: true,
                index: 5
            },
            {
                col: "gas",
                friendly: "气量",
                sorting: true,
                index: 6
            },
            {
                col: "money",
                friendly: "金额",
                format: money1Format,
                sorting: true,
                index: 7
            },
            {
                col: "lastMoney",
                friendly: "账户余额",
                format: lastmoney1Format,
                sorting: true,
                index: 8
            },
            {
                col: "icmoney",
                friendly: "IC卡金额",
                format: money2Format,
                sorting: true,
                index: 9
            },
            {
                col: "lastIcMoney",
                friendly: "IC卡虚拟余额",
                format: lastICmoneyFormat,
                sorting: true,
                index: 10
            },
            {
                col: "price",
                friendly: "单价",
                sorting: true,
                index: 11
            },
            {
                col: "tradeDate",
                friendly: "交易时间",
                format: dateFat,
                sorting: true,
                index: 12
            },
            {
                col: "clrDate",
                friendly: "清算时间",
                format: dateFat,
                sorting: true,
                index: 13
            },
            {
                col: "clrTag",
                friendly: "清算标志",
                format: clrtagFormat,
                sorting: true,
                index: 14
            },
            {
                col: "reservedField2",
                friendly: "备注",
                format: largeContentFormat,
                sorting: true,
                index: 15
            }
        ]
    })

}
//追补气量110001001
function chase(customerCode, div) {
    $("#" + div).html("");
    console.log(customerCode)
    var reasonTypeFormat = function () {
        return {
            f: function (val) {
                if (val == "1") {
                    return "死表"
                } else if (val == "2") {
                    return "下线表用量未收回"
                } else if (val == "3") {
                    return "其他"
                }else if (val == "4") {
                    return "顺价追补气费"
                }
            }
        }

    }()
    /*】*/
    var db = {
        "cols": "a.*,b.charge_unit_name,c.employee_name",
        "froms": "gas_chg_recover a, gas_biz_charge_unit b,gas_sys_user c",
        "wheres": "a.created_by = c.user_id and b.charge_unit_id = a.charge_unit_id and a.customer_code = '" + customerCode + "' order by a.created_time desc",
        "page": true,
        "limit": 10
    }
    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------基本restful地址---
        restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(db)),
        coldefs: [
            {
                col: "areaId",
                friendly: "供气区域",
                format: areaFormat,
                sorting: true,
                index: 1
            },
            {
                col: "chargeUnitId",
                friendly: "营业网点",
                format: chargeFormat,
                sorting: true,
                index: 2
            },
            {
                col: "recoverGas",
                friendly: "追补气量",
                sorting: true,
                index: 3
            },
            {
                col: "recoverMoney",
                friendly: "追补气费",
                sorting: true,
                index: 3
            },
            {
                col: "reason",
                friendly: "追补原因",
                sorting: true,
                index: 4
            },
            {
                col: "reasonType",
                friendly: "追补原因类型",
                format: reasonTypeFormat,
                sorting: true,
                index: 5
            },
            {
                col: "createdBy",
                friendly: "操作员",
                format: userFormat,
                sorting: true,
                index: 7
            },
            {
                col: "createdTime",
                friendly: "追补时间",
                format: dateFormat,
                sorting: true,
                index: 9
            },/*{
                col: "status",
                friendly: "申请状态",
                format: statusFormat,
                sorting: true,
                index: 9
            }*/

        ],
    })
}
//联合账户
function acccount(archiveId, div) {
    $("#" + div).html("");
    var result = Restful.findNQ(hzq_rest + 'gaschgaccount/?query={"ctmArchiveId":"' + archiveId + '"}');
    var chgAccountIdresult = Restful.findNQ(hzq_rest + 'gasactgasfeeaccount/?query={"chgAccountId":"' + result[0].relChgAccountId + '"}');
    console.log(chgAccountIdresult)
    var gasfeeAccountId;
    if (chgAccountIdresult.length > 0) {
        gasfeeAccountId = chgAccountIdresult[0].gasfeeAccountId
    }
    var queryCondion = RQLBuilder.and([
        RQLBuilder.condition_fc("tradeType", "$nin", '["CLR"]'),
        RQLBuilder.equal("gasfeeAccountId", gasfeeAccountId),
    ]).rql()

    XWATable.init({
        divname: div,
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        sorting: false,
        checkAllToggle: true,
        //----------------基本restful地址---
        // restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        restbase: 'gasactgasfeeatl/?query=' + queryCondion + "&sort=-clrDate,-tradeDate,-gasfeeAtlId",
        key_column: 'gasfeeAtlId',
        coldefs: [
            {
                col: "tradeType",
                friendly: "交易类型",
                format: tradeTypeFormat,
                sorting: true,
                index: 1
            },
            {
                col: "customerCode",
                friendly: "客户编号",
                index: 2
            },
            {
                col: "gas",
                friendly: "气量",
                sorting: true,
                index: 5
            },
            {
                col: "money",
                friendly: "金额",
                format: money1Format,
                sorting: true,
                index: 7
            },
            {
                col: "lastMoney",
                friendly: "账户余额",
                format: lastmoney1Format,
                sorting: true,
                index: 8
            },
            {
                col: "icmoney",
                friendly: "IC卡金额",
                format: money2Format,
                sorting: true,
                index: 9
            },
            {
                col: "lastIcMoney",
                friendly: "IC卡虚拟余额",
                format: lastICmoneyFormat,
                sorting: true,
                index: 10
            },
            {
                col: "tradeDate",
                friendly: "交易时间",
                format: dateFat,
                sorting: true,
                index: 11
            },
            {
                col: "clrDate",
                friendly: "清算时间",
                format: dateFat,
                sorting: true,
                index: 12
            },
            {
                col: "clrTag",
                friendly: "清算标志",
                format: clrtagFormat,
                sorting: true,
                index: 13
            },
            {
                col: "reservedField2",
                friendly: "备注",
                format: largeContentFormat,
                sorting: true,
                index: 14
            }
        ],

    })

}
//历史照片
function historyphoto(customerCode, archiveId, customerKind) {
    console.log(customerCode)
    console.log(archiveId)
    console.log(customerKind)
    var businessHelper = RefHelper.create({
        ref_url: "gascsrbusinesstype",
        ref_col: "businessTypeId",
        ref_display: "name",
    });
    //业务照片
    var businessPhoto = []
    var businessPhotos = []
    var businesspic = Restful.findNQ(hzq_rest + 'gascsrbusiregister?query={"customerCode":"' + customerCode + '"}&sort=-createdTime');
    if (businesspic.length) {
        for (var i = 0; i < businesspic.length; i++) {
            if (businesspic[i].reservedField2) {
                $.ajax({
                    url: hzq_rest + "gasbasfile?fields={}&query={\"busiId\":\"" + businesspic[i].reservedField2 + "\"}",
                    method: "get",
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        if (data && data.length > 0) {
                            for (var j = 0; j < data.length; j++) {
                                var datali = data[j];
                                businessPhoto.push("/hzqs/sys/download.do?fileId=" + datali.fileId + "&w=300");
                                businessPhotos.push("上传时间："+datali.createdTime.split("T").join(" ")+"\n业务名称："+businessHelper.getDisplay(businesspic[i].businessTypeId))
                            }
                        }
                        console.log("ssdsds" + JSON.stringify(data));
                    },
                    error: function (data) {
                        bootbox.alert(data);

                    }

                });
            }
        }

    }
    //抄表
    var meterPhoto = [];
    var revisePhoto = [];
    var feedbackPhoto = [];
    var gongdan = [];
    var meterPhotos = [];
    var revisePhotos = [];
    var feedbackPhotos = [];
    var gongdans = [];
    var queryCondion = RQLBuilder.and([
        RQLBuilder.equal("ctmArchiveId", archiveId),
        RQLBuilder.condition_fc("copyState", "$nin", '["9"]'),
        // RQLBuilder.isnotnull("meterPhoto"),
        // RQLBuilder.isnotnull("revisePhoto"),
        // RQLBuilder.isnotnull("feedbackPhoto"),

    ]).rql()
    var meterreadingPic = Restful.findNQ(hzq_rest + 'gasmrdmeterreading?query=' + queryCondion+"&sort=-uploadTime");
    console.log(meterreadingPic)
    if (meterreadingPic.length){
        for (var i = 0; i < meterreadingPic.length; i++) {
            //燃气表
            if (meterreadingPic[i].meterPhoto) {
                // console.log(meterreadingPic[i].meterPhoto)
                for(var j=0;j<meterreadingPic[i].meterPhoto.split(",").length;j++){
                    var phototime = Restful.findNQ(hzq_rest+"gasbasfile/"+meterreadingPic[i].meterPhoto.split(",")[j])
                    meterPhoto.push("/hzqs/sys/download.do?fileId=" + meterreadingPic[i].meterPhoto.split(",")[j] + "&w=300")
                    if(phototime.createdTime){
                        meterPhotos.push("上传时间："+phototime.createdTime.split("T").join(" "))
                    }else{
                        meterPhotos.push("上传时间：")
                    }
                    
                }
            }
            //修正表
            if (meterreadingPic[i].revisePhoto) {
                // console.log(meterreadingPic[i].revisePhoto.split(","))
                for(var j=0;j<meterreadingPic[i].revisePhoto.split(",").length;j++){
                    var phototimes = Restful.findNQ(hzq_rest+"gasbasfile/"+meterreadingPic[i].revisePhoto.split(",")[j])
                    revisePhoto.push("/hzqs/sys/download.do?fileId=" + meterreadingPic[i].revisePhoto.split(",")[j] + "&w=300")
                    
                    if(phototimes.createdTime){
                        revisePhotos.push("上传时间："+phototimes.createdTime.split("T").join(" "))
                    }else{
                        revisePhotos.push("上传时间：")
                    }
                }
            }
            //反馈照片
            if (meterreadingPic[i].feedbackPhoto) {
                // console.log(meterreadingPic[i].feedbackPhoto.split(","))
                for(var j=0;j<meterreadingPic[i].feedbackPhoto.split(",").length;j++){
                    var phototimess = Restful.findNQ(hzq_rest+"gasbasfile/"+meterreadingPic[i].feedbackPhoto.split(",")[j])
                    feedbackPhoto.push("/hzqs/sys/download.do?fileId=" + meterreadingPic[i].feedbackPhoto.split(",")[j] + "&w=300")
                    if(phototimess.createdTime){
                        feedbackPhotos.push("上传时间："+phototimess.createdTime.split("T").join(" "))
                    }else{
                        feedbackPhotos.push("上传时间：")
                    }
                }

            }
        }

    }
    //工单照片
    var wookbill = Restful.findNQ(hzq_rest + 'gascsrworkbill/?query={"customerCode":"'+customerCode+'"}')
    console.log(wookbill)
    if(wookbill.length){
        $.each(wookbill,function(index,item){
            var wookbillresults = Restful.findNQ(hzq_rest + 'gascsrworkbillresult/?query={"workBillId":"'+item.workBillId+'"}');
            console.log(wookbillresults)
            if(wookbillresults.length && wookbillresults[0].files){
                $.ajax({
                    url: hzq_rest + "gasbasfile?fields={}&query={\"busiId\":\"" +wookbillresults[0].files+ "\"}",
                    method: "get",
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                var datali = data[i];
                                gongdan.push("/hzqs/sys/download.do?fileId=" + datali.fileId + "&w=300")
                                gongdans.push("上传时间："+datali.createdTime.split("T").join(" "))
                            }
                        }
                        console.log("ssdsds" + JSON.stringify(data));
                    },
                    error: function (data) {
                        bootbox.alert(data);
                    }
                });
                // gongdan.push("/hzqs/sys/download.do?fileId=" + wookbillresults[0].files + "&w=300")

            }
        })

    }

    //合同照片
    if (customerKind == '1') {
        //合同照片
        var contractPic = Restful.findNQ(hzq_rest + 'gasctmcontract?query={"ctmArchiveId":"' + archiveId + '"}');
        console.log(contractPic)
        if (contractPic.length) {
            console.log(contractPic[0].reservedField2)
            if (contractPic[0].reservedField2) {
                var contractPhoto = [];
                var contractPhotos = [];
                $.ajax({
                    url: hzq_rest + "gasbasfile?fields={}&query={\"busiId\":\"" + contractPic[0].reservedField2 + "\"}",
                    method: "get",
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                var datali = data[i];
                                contractPhoto.push("/hzqs/sys/download.do?fileId=" + datali.fileId + "&w=300");
                                contractPhotos.push("上传时间："+datali.createdTime.split("T").join(" "))
                            }
                        }
                        // console.log("ssdsds" + JSON.stringify(data));
                    },
                    error: function (data) {
                        bootbox.alert(data);

                    }

                });
                console.log(contractPhoto)
                $('#gallery1').imagesGrid({
                    images: contractPhoto,
                    cells: contractPhoto.length,
                    times: contractPhotos
                });
            }
        }



        /* console.log(gongdan)/!*FFC27606587E9D63910C63687D788E7F*!/
         console.log(businessPhoto)
         console.log(meterPhoto)
         console.log(revisePhoto)
         console.log(feedbackPhoto)
         console.log("@@@@@@@")*/

        $('#gallery2').imagesGrid({
            images: businessPhoto,
            cells: businessPhoto.length,
            times: businessPhotos
        });
        $('#gallery3').imagesGrid({
            images: meterPhoto,
            cells: meterPhoto.length,
            times: meterPhotos
        });
        $('#gallery4').imagesGrid({
            images: revisePhoto,
            cells: revisePhoto.length,
            times: revisePhotos
        });
        $('#gallery5').imagesGrid({
            images: feedbackPhoto,
            cells: feedbackPhoto.length,
            times: feedbackPhotos
        });
        $('#gallery6').imagesGrid({
            images: gongdan,
            cells: gongdan.length,
            times: gongdans
        });
    }
    if (customerKind == '9') {
        var noncontractPic = Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query={"ctmArchiveId":"' + archiveId + '"}');
        console.log(noncontractPic)
        if (noncontractPic.length) {
            console.log(noncontractPic[0].contractId);
            if (noncontractPic[0].contractId) {
                var contractph = Restful.findNQ(hzq_rest + 'gasctmcontract/' + noncontractPic[0].contractId);
                console.log(contractph)
                console.log(contractph.reservedField2)
                if (contractph.reservedField2) {
                    var noncontractPic = [];
                    var noncontractPics = [];
                    var reservedfield = contractph.reservedField2.split(",")
                    for (var i = 0; i < reservedfield.length; i++) {
                        console.log(reservedfield[i])
                        $.ajax({
                            url: hzq_rest + "gasbasfile?fields={}&query={\"busiId\":\"" + reservedfield[i] + "\"}",
                            method: "get",
                            async: false,
                            dataType: "json",
                            success: function (data) {
                                if (data && data.length > 0) {
                                    for (var i = 0; i < data.length; i++) {
                                        var datali = data[i];
                                        noncontractPic.push("/hzqs/sys/download.do?fileId=" + datali.fileId + "&w=300")
                                        noncontractPics.push("上传时间："+datali.createdTime.split("T").join(" "))
                                    }
                                }
                                console.log("ssdsds" + JSON.stringify(data));
                            },
                            error: function (data) {
                                bootbox.alert(data);
                            }
                        });
                    }
                    $('#gallery11').imagesGrid({
                        images: noncontractPic,
                        cells: noncontractPic.length,
                        times:noncontractPics
                    });
                }

            }
        }

        /*  console.log(businessPhoto)
         console.log(gongdan)
         console.log(meterPhoto)
         console.log(revisePhoto)
         console.log(feedbackPhoto)
         console.log("@@@@@@@")*/
        $('#gallery12').imagesGrid({
            images: businessPhoto,
            cells: businessPhoto.length,
            times: businessPhotos
        });
        $('#gallery13').imagesGrid({
            images: meterPhoto,
            cells: meterPhoto.length,
            times: meterPhotos
        });
        $('#gallery14').imagesGrid({
            images: revisePhoto,
            cells: revisePhoto.length,
             times: revisePhotos
        });
        $('#gallery15').imagesGrid({
            images: feedbackPhoto,
            cells: feedbackPhoto.length,
            times: feedbackPhotos
        });
        $('#gallery16').imagesGrid({
            images: gongdan,
            cells: gongdan.length,
            times: gongdans
        });
    }
    var mySwiper = new Swiper(".swiper-container", {
        direction: 'horizontal',
        slidesPerView: 4,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        slidesPerGroup: 4,
        pagination: '.swiper-pagination',
        paginationType: 'fraction'

    })
}


// 非居民
$(document).on('click', ".noninformation", function () {
    $(".picphoto").html("");
    var row = JSON.parse($(this).attr("data-kind"));
    $("#customerCode1").val(row.customerCode);
    $("#customerName1").val(row.customerName);
    $("#customerAddress1").val(row.customerAddress);
    console.log(row);
    console.log(row.ctmArchiveId);
    var accountId = Restful.findNQ(hzq_rest + 'gaschgaccount?query={"ctmArchiveId":"' + row.ctmArchiveId + '"}');
    console.log(accountId[0].relChgAccountId)
    if (!accountId[0].relChgAccountId || accountId[0].relChgAccountId == "undefined") {
        $(".account").hide()
        $("#nonaccountmoney").hide()
    } else {
        $(".account").show()
        $("#nonaccountmoney").show()
        $.ajax({
            url: "hzqs/chg/pbgbl.do?fh=GBLCHG0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                "ctmArchiveId": row.ctmArchiveId
            }),
            success: function (data) {
                console.log(data)
                var money = Number(data.unionBalance).toFixed(2);
                $("#accountmoney").val(money)
            }
        })
    }
    if (row.customerType == "I") {
        $("#nonicmoney").show()
        $.ajax({
            url: "hzqs/chg/pbibl.do?fh=IBLCHG0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                "ctmArchiveId": row.ctmArchiveId
            }),
            success: function (data) {
                console.log(data)
                var money = Number(data.balance).toFixed(2);
                $("#nonmoney").val(money)
            }
        })
    } else {
        $("#nonicmoney").hide()
    }
    $.ajax({
        url: "hzqs/chg/pbgbl.do?fh=GBLCHG0000000J00&resp=bd",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        type: "POST",
        data: JSON.stringify({
            "ctmArchiveId": row.ctmArchiveId
        }),
        success: function (data) {
            console.log(data)
            var money = Number(data.balance).toFixed(2);
            $("#gasmon1").val(money)
        }
    })
    $("#navtab1 li").eq(0).addClass("active").siblings().removeClass("active");
    $("#tab11").addClass("active").siblings().removeClass("active");
    //客户档案
    nonctmarchive(row.ctmArchiveId);
    $('#navtab1 li').data({
        'ctmArchiveId': row.ctmArchiveId,
        'customerCode': row.customerCode,
        'customerKind': "9",
    });
    //合同
    // noncontract(row.ctmArchiveId, row.customerCode);

});


function nonctmarchive(archiveId) {
    console.log(archiveId);
    $('#tab11 span').html("");
    var areassHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName",
    });
    var userssHelper = RefHelper.create2({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName",
    });
    var GastypenonHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });

    var renter = Restful.findNQ(hzq_rest + 'gasctmrenter?query={"ctmArchiveId":"' + archiveId + '"}');
    console.log(renter)
    var inputQuery = RQLBuilder.and([
        RQLBuilder.equal("ctmArchiveId", archiveId),
        RQLBuilder.equal("meterUserState", "01")
    ]).rql();
    var coefficient = Restful.findNQ(hzq_rest + 'gasctmmeter/?query=' + inputQuery);
    if (coefficient.length) {



        $.each(coefficient[0], function (key, val) {
            /*if (key == "isOnline") {
             if (val == '1') {
             $("span[name='" + key + "']").html("是")
             } else if (val == '0') {
             $("span[name='" + key + "']").html("否")
             }
             } else */if (key == "reviseMeterState") {
                if (val == '01') {
                    $("span[name='" + key + "']").html("二次表正常使用二次表计费")
                }else if (val == '09') {
                    $("span[name='" + key + "']").html("没有二次表，使用一次表计费")
                } else if(val =="07"){
                    $("span[name='" + key + "']").html("二次表损坏，使用一次表计费")
                } else if(val =="06"){
                    $("span[name='" + key + "']").html("二次表未校验，使用二次表计费")
                }
            } else if (key == "meterUserState") {
                if (val == '01') {
                    $("span[name='" + key + "']").html("正常")
                } else if (val == '02') {
                    $("span[name='" + key + "']").html("暂停用气")
                } else if (val == '03') {
                    $("span[name='" + key + "']").html("拆除状态")
                } else if (val == '00') {
                    $("span[name='" + key + "']").html("新用户")
                }  else if (val == '04') {
                    $("span[name='" + key + "']").html("长期不用气")
                } else if (val == '99') {
                    $("span[name='" + key + "']").html("删除")
                }
            } else {
                $("span[name='" + key + "']").html(val)
            }

        })
    }

   
    var gasctmarchive = Restful.getByID(hzq_rest + "gasctmarchive", archiveId);
    console.log(gasctmarchive);
    $('#tab11 span').each(function (index, span) {
        var key = $(span).attr('name');
        var val = gasctmarchive[key];
        {
            if (key == "customerType" && $(span).attr('name') == key) {
                if (val == "P") {
                    $(span).html("普通表")
                } else if (val == 'I') {
                    $(span).html("IC卡表")
                }
            } else if (key == "customerKind" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("居民")
                } else if (val == '9') {
                    $(span).html("非居民")
                }
            } else if (key == "gasResource" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("普通")
                } else if (val == '2') {
                    $(span).html("煤改气")
                }
            } else if (key == "industrySort" && $(span).attr('name') == key) {
                $(span).html(GasModCtms.industrySortFormat(val));
            } else if (key == "reminderWay" && $(span).attr('name') == key) {
                $(span).html(GasModCtms.reminderWayFormat(val));
            } else if (key == "alarm" && $(span).attr('name') == key) {
                if (val == "Y") {
                    $(span).html("有")
                } else if (val == 'N') {
                    $(span).html("无")
                }
            } else if (key == "invoiceType" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("普通发票")
                } else if (val == '2') {
                    $(span).html("增值税发票")
                }
            } else if (key == "gasEnvironment" && $(span).attr('name') == key) {
                if (val) {
                    var len = val.split(',');
                    var str = "";
                    for (var i = 0; i < len.length; i++) {
                        if (len[i] == "1") {
                            str += "潮湿 "
                        } else if (len[i] == "2") {
                            str += "高温 "
                        } else if (len[i] == "3") {
                            str += "密闭房间 "
                        } else if (len[i] == "4") {
                            str += "非密闭房间 "
                        } else if (len[i] == "5") {
                            str += "防雷防静电 "
                        }
                    }
                    $(span).html(str)
                }
            } else if (key == "deviceType" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("调压柜")
                } else if (val == "2") {
                    $(span).html("调压箱")
                } else if (val == "3") {
                    $(span).html("调压站")
                }
            } else if (key == "businessProperty" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("外商独资/合资")
                } else if (val == "2") {
                    $(span).html("政府机关")
                } else if (val == "3") {
                    $(span).html("事业单位")
                } else if (val == "4") {
                    $(span).html("国企")
                }
            } else if (key == "businessSituation" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("优秀")
                } else if (val == "2") {
                    $(span).html("良好")
                } else if (val == "3") {
                    $(span).html("一般")
                } else if (val == "4") {
                    $(span).html("较差")
                } else if (val == "5") {
                    $(span).html("差")
                }
            } else if (key == "customerState" && $(span).attr('name') == key) {
                if (val == "01") {
                    $(span).html("正常")
                } else if (val == "02") {
                    $(span).html("暂停用气")
                } else if (val == "03") {
                    $(span).html("拆除状态")
                } else if (val == "00") {
                    $(span).html("新用户")
                } else if (val == "99") {
                    $(span).html("删除")
                }
            } else if (key == "gasTypeId" && $(span).attr('name') == key) {
                $(span).html(GastypenonHelper.getDisplay(val));
            } else if (key == "areaId" && $(span).attr('name') == key) {

                $(span).html(areassHelper.getDisplay(val));
            } else if (key == "countperId" && $(span).attr('name') == key) {
                $(span).html(userssHelper.getDisplay(val));

            } else if (key == "serviceperId" && $(span).attr('name') == key) {

                $(span).html(userssHelper.getDisplay(val));

            } else if (key == "lesseeExpire" && $(span).attr('name') == key) {
                if (val) {
                    var data = val.split("T");
                    var aa = [];
                    for (var i = 0; i < data[1].split(":").length; i++) {
                        if (i < 2) {
                            aa.push(data[1].split(":")[i])
                        }
                    }
                    data[1] = aa.join(":");
                    console.log(data.join(" "))
                    date = data.join(" ");
                    $(span).html(date);
                } else {
                    $(span).html("");
                }

            } else if (key == "createdTime" && $(span).attr('name') == key) {
                if (val) {
                    console.log(val)
                    var data = val.split("T");
                    var aa = [];
                    for (var i = 0; i < data[1].split(":").length; i++) {
                        if (i < 2) {
                            aa.push(data[1].split(":")[i])
                        }
                    }
                    data[1] = aa.join(":");
                    console.log(data.join(" "))
                    date = data.join(" ");
                    $(span).html(date);
                } else {
                    $(span).html("");
                }

            } else if (key == "unboltTime" && $(span).attr('name') == key) {
                if (val) {
                    var data = val.split("T");
                    var aa = [];
                    for (var i = 0; i < data[1].split(":").length; i++) {
                        if (i < 2) {
                            aa.push(data[1].split(":")[i])
                        }
                    }
                    data[1] = aa.join(":");
                    console.log(data.join(" "))
                    date = data.join(" ");
                    $(span).html(date);
                } else {
                    $(span).html("");
                }

            } else if (key == "hasPet" && $(span).attr('name') == key) {
                if (val == "0") {
                    $(span).html("无");
                } else if (val == "1") {
                    $(span).html("有");
                }
            } else if (key == "issalesRoom" && $(span).attr('name') == key) {
                if (val == "N") {
                    $(span).html("否");
                } else if (val == "Y") {
                    $(span).html("是");
                }
            } else if (key == "validOrInvalid" && $(span).attr('name') == key) {
                if (val == "N") {
                    $(span).html("否");
                } else if (val == "Y") {
                    $(span).html("是");
                }
            } else if (key == "stealGas" && $(span).attr('name') == key) {
                if (val == "N") {
                    $(span).html("否");
                } else if (val == "Y") {
                    $(span).html("是");
                }
            } else if (key == "idcardType" && $(span).attr('name') == key) {
                console.log(val)
                if (val == 1) {
                    // 1：营业执照；2：法人身份证；3：房产证；4：租房合同；5：居民身份证
                    $(span).html("营业执照")
                } else if (val == 2) {
                    $(span).html("法人身份证")
                } else if (val == 3) {
                    $(span).html("房产证")
                } else if (val == 4) {
                    $(span).html("租房合同")
                } else if (val == 5) {
                    $(span).html("居民身份证")
                }
            } else if (key == "lesseeCerType" && $(span).attr('name') == key) {
                console.log(val)
                if (val == 1) {
                    // 1：营业执照；2：法人身份证；3：房产证；4：租房合同；5：居民身份证
                    $(span).html("营业执照")
                } else if (val == 2) {
                    $(span).html("法人身份证")
                } else if (val == 3) {
                    $(span).html("房产证")
                } else if (val == 4) {
                    $(span).html("租房合同")
                } else if (val == 5) {
                    $(span).html("居民身份证")
                }
            } else if (key == "rentRoom" && $(span).attr('name') == key) {
                if (val == "0") {
                    $(span).html("否");
                } else if (val == "1") {
                    $(span).html("是");
                }
            } else {
                if ($(span).attr('name') == key) {
                    $(span).html(val)
                }
            }
        }
    })

    if (gasctmarchive.bookId) {
        var books = Restful.getByID(hzq_rest + "gasmrdbook", gasctmarchive.bookId);
        delete books["areaId"];
        $('#tab11 span').each(function (index, val) {
            span = val;
            $.each(books, function (key, val) {
                if (key == "countperId" && $(span).attr('name') == key) {
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gassysuser",
                        ref_col: "userId",
                        ref_display: "employeeName",
                    });
                    $(span).html(GastypeHelper.getDisplay(val));
                } else if (key == "serviceperId" && $(span).attr('name') == key) {
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gassysuser",
                        ref_col: "userId",
                        ref_display: "employeeName",
                    });
                    $(span).html(GastypeHelper.getDisplay(val));
                } else if ($(span).attr('name') == key) {
                    $(span).html(val)
                }
            })
        })

    }
    if (gasctmarchive.houseId) {
        var houses = Restful.getByID(hzq_rest + "gasctmhouse", gasctmarchive.houseId);
        $('#tab11 span').each(function (index, val) {
            span = val;
            $.each(houses, function (key, val) {
                if ($(span).attr('name') == key) {
                    $(span).html(val)
                }
            })
        })
    }
    if (renter.length) {

        // $.each(renter[0], function (key, val) {
        //     console.log(key)
        //     $('#tab1 span[name="'+key+'"]').html(val)
        // })

        $('#tab11 span').each(function (index, val) {
            span = val;
            console.log(val)
            $.each(renter[0], function (key, val) {
                console.log("))))))))",key,val)
                if (key == "lesseeExpire" && $(span).attr('name') == key) {
                    console.log("---------",val)
                    console.log("---------",key)
                    if (val) {
                        $(span).html(dateForat(val));
                    }

                } else if (key == "lesseeCerType" && $(span).attr('name') == key) {
                    if (val == 1) {
                        $(span).html("营业执照")
                    } else if (val == 2) {
                        $(span).html("法人身份证")
                    } else if (val == 3) {
                        $(span).html("房产证")
                    } else if (val == 4) {
                        $(span).html("租房合同")
                    } else if (val == 5) {
                        $(span).html("居民身份证")
                    }
                } else {
                    if ($(span).attr('name') == key) {
                        $(span).html(val)
                    }
                }
            })
        })
    }
   
}
// function noncontract(archiveId, customerCode) {
$("#navtab1 li").on('click', function () {
    console.log($(this).find('a').text())
    var archiveId = $(this).data('ctmArchiveId');
    var customerCode = $(this).data('customerCode');
    if ($(this).find('a').text() == "合同档案 ") {
        $("#tab12 span").html("");
        var queryCondion = RQLBuilder.and([
            RQLBuilder.equal("ctmArchiveId",archiveId),
            RQLBuilder.equal("status","2"),
        ]).rql()
        var contract = Restful.findNQ(hzq_rest + 'gasctmcontractmeter?query='+queryCondion);
        console.log(contract)
        if (contract.length) {
            var contracts = Restful.findNQ(hzq_rest + 'gasctmcontract?query={"contractId":"' + contract[0].contractId + '"}');
            console.log(contracts)
            $('#tab12 span').each(function (index, val) {
                span = val;
                $.each(contracts[0], function (key, va) {
                    if (key == "signupTime" && $(span).attr('name') == key) {
                        console.log(va);
                        console.log(va + "===" + key);
                        if (va) {
                            var data = va.split("T");
                            var aa = [];
                            for (var i = 0; i < data[1].split(":").length; i++) {
                                if (i < 2) {
                                    aa.push(data[1].split(":")[i])
                                }
                            }
                            data[1] = aa.join(":");
                            console.log(data.join(" "));
                            date = data.join(" ");
                            $(span).html(date);
                        }
                    } else if (key == "gasType" && $(span).attr('name') == key) {
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasbizgastype",
                            ref_col: "gasTypeId",
                            ref_display: "gasTypeName",
                        });
                        $(span).html(GastypeHelper.getDisplay(va));
                    } else if (key == "areaId" && $(span).attr('name') == key) {
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasbizarea",
                            ref_col: "areaId",
                            ref_display: "areaName",
                        });
                        $(span).html(GastypeHelper.getDisplay(va));
                    } else if (key == "agreement" && $(span).attr('name') == key) {
                        if (va == 0) {
                            $(span).html("无");
                        } else if (va == 1) {
                            $(span).html("有");
                        }

                    } else if ($(span).attr('name') == key) {
                        $(span).html(va)
                    }

                })
            })
        } else {
            $('#tab12 span').html("")
        }

    } else if ($(this).find('a').text() == "表具档案 ") {
        $("#tab13 span").html("");
        var inputQuery = RQLBuilder.and([
            RQLBuilder.equal("ctmArchiveId", archiveId),
            RQLBuilder.equal("meterUserState", "01")
        ]).rql();
        var ctmmeter = Restful.findNQ(hzq_rest + 'gasctmmeter/?query='+inputQuery);
        console.log(ctmmeter)
        if (ctmmeter.length) {
            var meter = Restful.getByID(hzq_rest + 'gasmtrmeter', ctmmeter[0].meterId);
            console.log(meter);
            if (JSON.stringify(meter) == "{}") {
                return;
            }
            /*console.log(ctmmeter[0])
            console.log(ctmmeter[0].reviseMeterId)
            console.log(ctmmeter[0].reviseMeterState)*/
            if(ctmmeter[0].reviseMeterId && ctmmeter[0].reviseMeterState != "09" ){
                /*var reviseMeterId = ctmmeter[0].reviseMeterId;
                console.log(ctmmeter[0].reviseMeterId);
                console.log(reviseMeterId);*/
                // console.log()
                var receivemeter = Restful.getByID(hzq_rest + 'gasmtrmeter', ctmmeter[0].reviseMeterId);
                console.log(receivemeter)
                $('#tab13 .receivetable span').each(function (index, val) {
                    span = val;
                    $.each(receivemeter, function (key, val) {
                        if (key == "factoryId" && $(span).attr('name') == key) {
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrfactory",
                                ref_col: "factoryId",
                                ref_display: "factoryName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        } else if (key == "reskindId" && $(span).attr('name') == key) {
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrreskind",
                                ref_col: "reskindId",
                                ref_display: "reskindName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        } else if (key == "meterModelId" && $(span).attr('name') == key) {
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrmeterspec",
                                ref_col: "meterModelId",
                                ref_display: "meterModelName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        } else if (key == "meterTypeId" && $(span).attr('name') == key) {
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrmetertype",
                                ref_col: "meterTypeId",
                                ref_display: "meterTypeName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        } else if (key == "direction" && $(span).attr('name') == key) {
                            if (val == 'L') {
                                $(span).html("左");
                            } else if (val == 'R') {
                                $(span).html("右");
                            }
                        } else if (key == "meterStatus" && $(span).attr('name') == key) {
                            if (val == 1) {
                                $(span).html("正常");
                            } else if (val == 0) {
                                $(span).html("异常");
                            }
                        } else if (key == "meterKind" && $(span).attr('name') == key) {
                            $(span).html(GasModCtms.meterKindFormat(val))
                        }  else if (key == "powerType" && $(span).attr('name') == key) {
                            $(span).html(GasModCtms.powerTypeFormat(val))
                        } else if (key == "valveInfo" && $(span).attr('name') == key) {
                            $(span).html(GasModCtms.valveInfoFormat(val))
                        } else if (key == "baseMeterVender" && $(span).attr('name') == key) {
                            $(span).html(GasModCtms.baseMeterVenderFormat(val))
                        } else if (key == "meterMaterial" && $(span).attr('name') == key) {
                            $(span).html(GasModCtms.meterMaterialFormat(val))
                        } else if (key == "controlType" && $(span).attr('name') == key) {
                            $(span).html(GasModCtms.controlTypeFormat(val))
                        } else if (key == "displayType" && $(span).attr('name') == key) {
                            $(span).html(GasModCtms.displayTypeFormat(val))
                        } else if (key == "chipType" && $(span).attr('name') == key) {
                            $(span).html(GasModCtms.chipTypeFormat(val))
                        } else if (key == "productionDate" && $(span).attr('name') == key) {
                            if (val) {
                                var data = val.split("T");
                                var aa = [];
                                for (var i = 0; i < data[1].split(":").length; i++) {
                                    if (i < 2) {
                                        aa.push(data[1].split(":")[i])
                                    }
                                }
                                data[1] = aa.join(":");
                                console.log(data.join(" "))
                                date = data.join(" ");
                                $(span).html(date);
                            }
                        } else {
                            if ($(span).attr('name') == key) {
                                $(span).html(val)
                            }
                        }
                    })
                })

                var queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("factoryId", receivemeter.factoryId),
                    RQLBuilder.equal("meterModelId", receivemeter.meterModelId)
                ]).rql()
                var resultreceive = Restful.findNQ(hzq_rest + 'gasmtrmeterfactoryspec/?query=' + queryCondion);
                // console.log(resultreceive);
                if (resultreceive.length) {
                    // console.log(resultreceive)
                    var resultreceives = Restful.findNQ(hzq_rest + 'gasmtrmeterflow/' + resultreceive[0].meterFlowId);
                    // console.log(resultreceives);
                    $(".receivetable span[name='flow']").html(resultreceives.ratingFlux)
                    $(".receivetable span[name='flowRange']").html(resultreceives.flowName)
                }
            }


            $('#tab13 .metertable span').each(function (index, val) {
                span = val;
                $.each(meter, function (key, val) {
                    if (key == "factoryId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrfactory",
                            ref_col: "factoryId",
                            ref_display: "factoryName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "reskindId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrreskind",
                            ref_col: "reskindId",
                            ref_display: "reskindName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "meterModelId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrmeterspec",
                            ref_col: "meterModelId",
                            ref_display: "meterModelName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "meterTypeId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrmetertype",
                            ref_col: "meterTypeId",
                            ref_display: "meterTypeName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "direction" && $(span).attr('name') == key) {
                        if (val == 'L') {
                            $(span).html("左");
                        } else if (val == 'R') {
                            $(span).html("右");
                        }
                    } else if (key == "meterStatus" && $(span).attr('name') == key) {
                        if (val == 1) {
                            $(span).html("正常");
                        } else if (val == 0) {
                            $(span).html("异常");
                        }
                    } else if (key == "powerType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.powerTypeFormat(val))
                    } else if (key == "valveInfo" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.valveInfoFormat(val))
                    } else if (key == "baseMeterVender" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.baseMeterVenderFormat(val))
                    } else if (key == "meterMaterial" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.meterMaterialFormat(val))
                    } else if (key == "meterKind" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.meterKindFormat(val))
                    } else if (key == "controlType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.controlTypeFormat(val))
                    } else if (key == "displayType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.displayTypeFormat(val))
                    } else if (key == "chipType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.chipTypeFormat(val))
                    } else if (key == "productionDate" && $(span).attr('name') == key) {
                        if (val) {
                            var data = val.split("T");
                            var aa = [];
                            for (var i = 0; i < data[1].split(":").length; i++) {
                                if (i < 2) {
                                    aa.push(data[1].split(":")[i])
                                }
                            }
                            data[1] = aa.join(":");
                            console.log(data.join(" "))
                            date = data.join(" ");
                            $(span).html(date);
                        }
                    } else {
                        if ($(span).attr('name') == key) {
                            $(span).html(val)
                        }
                    }
                })
            })
            var queryCondion = RQLBuilder.and([
                RQLBuilder.equal("factoryId", meter.factoryId),
                RQLBuilder.equal("meterModelId", meter.meterModelId)
            ]).rql()
            var result = Restful.findNQ(hzq_rest + 'gasmtrmeterfactoryspec/?query=' + queryCondion);
            console.log(result);
            if (result.length) {
                console.log(result)
                var results = Restful.findNQ(hzq_rest + 'gasmtrmeterflow/' + result[0].meterFlowId);
                console.log(results);
                $(".metertable span[name='flow']").html(results.ratingFlux)
                $(".metertable span[name='flowRange']").html(results.flowName)
            }


        } else {
            $('#tab13 span').html("")
        }
    } else if ($(this).find('a').text() == "燃气设备档案") {
        nongasequipment(archiveId,customerCode)
    } else if ($(this).find('a').text() == "业务受理记录") {
        business(customerCode, "divtable4")
    } else if ($(this).find('a').text() == "收费信息") {
        accounting(customerCode, "divtable5");
    } else if ($(this).find("a").text() == "抄表记录") {
        meterreading(archiveId, "divtable7")
    } else if ($(this).find("a").text() == "垃圾费记录") {
        garbage(archiveId, "divtable9",archiveId)
    } else if ($(this).find("a").text() == "计费更正") {
        reduction(archiveId, "divtable11")
    } else if ($(this).find("a").text() == "补气补量") {
        gasrepair(customerCode, "divtable13")
    } else if ($(this).find("a").text() == "协议气量") {
        agreementgas(archiveId, "divtable15")
    } else if ($(this).find("a").text() == "余额变化明细") {
        balancedetails(customerCode, "divtable17", archiveId);
    } else if ($(this).find("a").text() == "追补气量") {
        chase(customerCode, "divtable19");
    } else if ($(this).find("a").text() == "联合账户明细") {
        acccount(archiveId, "divtable21");
    } else if ($(this).find("a").text() == "历史照片") {
        historyphoto(customerCode, archiveId, $(this).data('customerKind'));
    }
})
// }

function nongasequipment(ctmarchiveId,customerCode) {
    $("#tab14 input[type='radio']").attr("disabled", true);
    var rest = Restful.findNQ(hzq_rest + 'gasctmnonrsdtdevicearchive/?query={"ctmArchiveId":"' + ctmarchiveId + '"}');
    console.log(rest);
    if (rest.length) {
        $.each(rest[0], function (key, val) {
            $("#tab14 input[type='radio'][name='" + key + "'][value='" + val + "']").parent('span').addClass("checked");
            $("#tab14 input[type='text'][name='" + key + "']").val(val);
        })
    } else {
        $("#tab14 input").attr('disabled', true);
        $("#tab14 input[type='text']").val("");
        $("#tab14 input[type='radio']").parent('span').removeClass("checked");
        $("#divtable1").html("");
    }
    $("#devices1").html("")
    var xw = XWATable.init({
        divname: "devices1",
        //----------------table的选项-------
        pageSize: 10,
        pageSizes:[10,20,30,40],
        columnPicker: true,
        transition: 'fade',
        // tableId: "divtable",
        checkboxes: true, 
        checkAllToggle: true,
        //----------------基本restful地址---
        restbase: 'gasctmnonrsdtdevicedetail/?query={"customerCode":"'+customerCode+'"}"',
        key_column: 'nonrsdtArchiveDetailId',
        coldefs: [
            {
                col:"nonrsdtArchiveDetailId",
                friendly:"nonrsdtArchiveDetailId",
                nonedit:"nosend",
                hidden:true,
                unique:true,
                index:1
            },
            {
                col: "name",
                friendly: "设备名称",
                sorting: false,
                format:deviceFormat,
                index: 1
            },
            {
                col: "deviceCode",
                friendly: "设备编号",
                validate:"required",
                readonly:"readonly",
                sorting: false,
                index: 2
            },
            {
                col: "count",
                friendly: "设备数量",
                sorting: false,
                validate:"onlyNumber length[1-2]",
                index: 3
            },
            {
                col: "position",
                friendly: "设备安装位置",
                sorting: false,
                index: 4
            },
            {
                col: "brand",
                friendly: "设备品牌",
                sorting: false,
                index: 5
            },
            {
                col: "model",
                friendly: "设备型号",
                sorting: false,
                index: 6
            },
            {
                col: "thermalPower",
                friendly: "额定热功率",
                sorting: false,
                index: 7
            },
            {
                col: "productionTime",
                friendly: "出厂日期",
                inputsource:"datepicker",
                sorting: false,
                index: 8
            },
            {
                col: "saleTime",
                friendly: "出售日期",
                inputsource:"datepicker",
                sorting: false,
                index: 9
            },
            {
                col: "source",
                friendly: "来源",
                format:sourceFormat,
                inputsource: "custom",
                inputbuilder: "sourceBuilder",
                sorting: false,
                index: 10
            },
            
            {
                col: "capacity",
                friendly: "容量/耗气量",
                sorting: false,
                index: 11
            },
            {
                col: "remark",
                friendly: "备注",
                sorting: false,
                index: 12
            }
        ]

    });

}
