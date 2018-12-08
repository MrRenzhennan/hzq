/**
 * Created by Alex on 2017/3/22.
 */
var xw;
ComponentsPickers.init();
var userInfo = JSON.parse(localStorage.getItem('user_info'));
var area_id = userInfo.area_id;
var user_id = userInfo.userId;
var areas = new Array();

areas.push(area_id)
//查询areaId下级areaId
var queryCondion = RQLBuilder.and([
    RQLBuilder.equal("status", "1"),
    RQLBuilder.equal("parentAreaId", area_id)
]).rql();
$.ajax({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    type: 'get',
    async: false,
    url: hzq_rest + "gasbizarea?query=" + queryCondion,
    success: function (data) {
        for (var i = 0; i < data.length; i++) {
            areas.push(data[i].areaId);
        }
    }
});
var AreaHelper1 = RefHelper.create({
    ref_url: 'gasbizarea?query={"areaId":{"$in":' + JSON.stringify(areas) + '}}',
    ref_col: "areaId",
    ref_display: "areaName",
    "sort": "posCode"
});
$.each(AreaHelper1.getRawData(), function (index, row) {
    $('#find_unit').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
    $('#find_area').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
});
$('#find_unit').on('change', function (e) {
    console.log("change area:" + e + "." + $('#find_unit').val());
    GasModSys.counterUsersInArea({
        "areaId": $('#find_unit').val(),
        "cb": function (data) {
            var inhtml = "<option value=''>全部</option>";
            $.each(data, function (idx, row) {
                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
            });
            $("#find_countPer").html(inhtml);
            $("#find_countPer").val("").change();

        }
    })
});
$('#find_countPer').on('change', function (e) {
    console.log("change counter:" + e + "." + $('#find_countPer').val());
    $("#find_servicePer").html("");
    $("#find_servicePer").html("<option value=''>全部</option>");
    GasModSys.copyUsersInArea({
        "areaId": $('#find_unit').val(),
        "countperId": $('#find_countPer').val(),
        "cb": function (data) {
            var inhtml = "<option value=''>全部</option>";
            $.each(data, function (idx, row) {
                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
            })
            $("#find_servicePer").html(inhtml);
            $("#find_servicePer").val("").change();

        }
    })
});
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
   var AreaHelper = RefHelper.create({
       ref_url: "gasbizarea",
       ref_col: "areaId",
       ref_display: "areaName",
   });
var UrgeAction = function () {

    var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    //抄表员
    var servicePerHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName",
    });
    //核算员
    var countPerHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName",
    });
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper1.getDisplay(val);
            }
        }
    }();
    var CountPerFormat = function () {
        return {
            f: function (val) {
                return countPerHelper.getDisplay(val);
            }
        }
    }();
    var ServicePerFormat = function () {
        return {
            f: function (val) {
                return servicePerHelper.getDisplay(val);
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
    return {
        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
            $.map(GasModCtm.enumCustomerState, function (value,key) {
                $('#customer_state').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload: function () {
            $('#divtable2').html('');
            var bd = {
                "cols": "a.ctm_archive_id,a.gas_type_id,a.area_id,a.customer_code,a.customer_name,a.customer_address,a.tel,b.countper_id,b.serviceper_id,ga.balance,b.book_code,ga.modified_time,meter_user_state",
                "froms": "gas_ctm_archive a left join gas_ctm_meter m on a.ctm_archive_id=m.ctm_archive_id left join  gas_chg_account c on a.ctm_archive_id=c.ctm_archive_id left join gas_act_gasfee_account ga on ga.chg_account_id=c.chg_account_id left join gas_mrd_book b on a.book_id=b.book_id",
                "wheres": '1=0 and ga.balance<0 and a.area_id in(' + areas + ')',
                "page": true,
                "limit": 50
            };
            xw1 = XWATable.init(
                {
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    tableId: "divtable2",
                    divname: "divtable2",
                    findbtn: "find_button1",
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);            //data.row holds the underlying row you supplied.
                    },
                    //----------------基本restful地址---
                    // restbase: "gasmrdowe/queryByCondi?areaId=" + $('#findArea').val() + "&accountPerson=" + $('#accountPerson').val() + "&meterReadingPerson=" + $('#meterReadingPerson').val() + "&meterReadingCode=" + $('#meterReadingCode').val()
                    // + "&customerCode=" + $('#customerCode').val() + "&customerName=" + $('#customerName').val(),
                    // restbase:  "gasmrdowe/queryByCondi?areaId="+$('#findArea').val()+select,
                    //---------------行定义
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    coldefs: [
                        {
                            col: "ctmArchiveId",
                            // format: archiveIdFormat,
                            sorting: false,
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            readonly: "readonly",
                            index: 2
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本号",
                            readonly: "readonly",
                            index: 3
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format: CountPerFormat,
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "serviceperId",
                            friendly: "抄表员",
                            format: ServicePerFormat,
                            inputsource: "select",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            readonly: "readonly",
                            index: 6
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            readonly: "readonly",
                            index: 7
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            readonly: "readonly",
                            index: 8
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质",
                            readonly: "readonly",
                            format: gasTypeFormat,
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "modifiedTime",
                            friendly: "截止日期",
                            format: dateFormat,
                            readonly: "readonly",
                            index: 10
                        },
                        {
                            col: "tel",
                            friendly: "电话",
                            readonly: "readonly",
                            index: 11
                        },
                        {
                            col: "meterUserState",
                            friendly: "客户状态",
                            format:GasModCtm.customerStateFormat,
                            readonly: "readonly",
                            index: 11
                        },
                        {
                            col: "meterReading",
                            friendly: "燃气表读数",
                            readonly: "readonly",
                            hidden:true,
                            index: 12
                        },
                        {
                            col: "reviseReading",
                            friendly: "修正表读数",
                            readonly: "readonly",
                            hidden:true,
                            index: 13
                        },
                        //
                        // {
                        //     col:"customerkind",
                        //     friendly: "用户类型",
                        //     readonly: "readonly",
                        //     index:9
                        // },
                        {
                            col: "balance",
                            friendly: "余额",
                            readonly: "readonly",
                            index: 14
                        },
                        // {
                        //     col: "tominusFee",
                        //     friendly: "欠费金额",
                        //     readonly: "readonly",
                        //     index: 11
                        // },

                    ],

                    findFilter: function () {

                        var areaId_select = $('#find_unit option:selected').val();
                        var find_countPer = $('#find_countPer option:selected').val();
                        var find_servicePer = $("#find_servicePer option:selected").val()
                        // var copyerid = $("find_countperId").val()
                        var whereinfo = "";
                        if (areaId_select) {
                            whereinfo += " a.area_id='" + areaId_select + "' and ";
                        }
                        if (find_countPer) {
                            whereinfo += " countper_id='" + find_countPer + "' and ";
                        }
                        if (find_servicePer) {
                            whereinfo += " serviceper_id='" + find_servicePer + "' and ";
                        }
                        if ($("#find_bookCode").val()) {
                            whereinfo += " book_code='" + $('#find_bookCode').val() + "' and ";
                        }

                        if ($('#find_customerCode').val()) {
                            whereinfo += " a.customer_code='" + $('#find_customerCode').val() + "' and ";
                        }
                        if ($('#find_customerName').val()) {
                            whereinfo += " customer_name like '" + $('#find_customerName').val() + "%' and ";
                            //var find_customerCode=RQLBuilder.equal("customerCode",$.trim($('#find_customerCode').val()));
                        }


                        if ($('#customer_state').val()) {
                            whereinfo += " meter_user_state='" + $('#customer_state').val() + "' and ";
                        }
                        if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            console.log($('#find_gasTypeId').val())
                            whereinfo += " a.gas_type_id  like '" + $('#find_gasTypeId').val() + "%' and ";
                        } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            console.log($('#find_gasTypeId1').val())
                            whereinfo += " a.gas_type_id  like '" + $('#find_gasTypeId1').val() + "%' and ";
                        } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && $('#find_gasTypeId2').val()) {
                            console.log($('#find_gasTypeId2').val())
                            whereinfo += " a.gas_type_id = '" + $('#find_gasTypeId2').val() + "' and ";
                        }
                        if ($("#from").val() && $("#to").val()) {
                            whereinfo += "balance>-" + $('#to').val() + " and balance<-" + $('#from').val() + " and "

                        } else if ($("#from").val() && !$("#to").val()) {
                            bootbox.alert("请输入上限金额")
                        } else if (!$("#from").val() && $("#to").val()) {
                            bootbox.alert("请输入下限金额")
                        }
                        var bd1 = {
                            "cols": "sum(balance) as num",
                            "froms": "gas_ctm_archive a left join gas_ctm_meter m on a.ctm_archive_id=m.ctm_archive_id left join  gas_chg_account c on a.ctm_archive_id=c.ctm_archive_id left join gas_act_gasfee_account ga on ga.chg_account_id=c.chg_account_id left join gas_mrd_book b on a.book_id=b.book_id",
                            "wheres": whereinfo + 'ga.balance<0 and a.area_id in(' + areas + ')',
                            "page": false
                        };
                        $.ajax({
                            type: 'get',
                            url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + encodeURIComponent(JSON.stringify(bd1)),
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            async: false,
                            success: function (data) {
                                $('#sumPrice').val(data.rows[0].num);
                            }
                        });
                        var bd2 = {
                            "cols": "a.ctm_archive_id,a.gas_type_id,a.area_id,a.customer_code,a.customer_name,a.customer_address,a.tel,b.countper_id,b.serviceper_id,ga.balance,b.book_code,ga.modified_time,meter_user_state",
                            "froms": "gas_ctm_archive a left join gas_ctm_meter m on a.ctm_archive_id=m.ctm_archive_id left join  gas_chg_account c on a.ctm_archive_id=c.ctm_archive_id left join gas_act_gasfee_account ga on ga.chg_account_id=c.chg_account_id left join gas_mrd_book b on a.book_id=b.book_id",
                            "wheres": whereinfo+' balance<0 and a.area_id in(' + areas + ')',
                            "page": true,
                            "limit": 50
                        };
                        xw1.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd2)));

                    }
                }
            );
        }
    }
}();
var UrgeAction1 = function () {
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper1.getDisplay(val);
            }
        }
    }();
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable1').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_chg_account a left join gas_act_gasfee_account b on a.chg_account_id=b.chg_account_id",
                "wheres": "1=0 and a.account_type='1' and balance<0  and area_id in(" + areas + ")",
                "page": true,
                "limit": 50
            };
            xw = XWATable.init(
                {
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    tableId: "divtable1",
                    divname: "divtable1",
                    findbtn: "find_button2",
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);            //data.row holds the underlying row you supplied.
                    },
                    //----------------基本restful地址---
                    // restbase: "gasmrdowe/queryByCondi?areaId=" + $('#findArea').val() + "&accountPerson=" + $('#accountPerson').val() + "&meterReadingPerson=" + $('#meterReadingPerson').val() + "&meterReadingCode=" + $('#meterReadingCode').val()
                    // + "&customerCode=" + $('#customerCode').val() + "&customerName=" + $('#customerName').val(),
                    // restbase:  "gasmrdowe/queryByCondi?areaId="+$('#findArea').val()+select,
                    //---------------行定义
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    coldefs: [
                        {
                            col: "chgAccountId",
                            // format: archiveIdFormat,
                            sorting: false,
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            readonly: "readonly",
                            index: 2
                        },
                        {
                            col: "chgAccountNo",
                            friendly: "联合账户编号",
                            readonly: "readonly",
                            index: 3
                        },
                        {
                            col: "accName",
                            friendly: "联合账户名称",
                            readonly: "readonly",
                            index: 4
                        },
                        {
                            col: "linkman",
                            friendly: "联系人",
                            readonly: "readonly",
                            index: 5
                        },
                        {
                            col: "linkPhone",
                            friendly: "联系电话",
                            readonly: "readonly",
                            index: 6
                        },
                        {
                            col: "linkTel",
                            friendly: "联系人地址",
                            readonly: "readonly",
                            index: 7
                        },
                        {
                            col: "modifiedTime",
                            friendly: "截止日期",
                            format: dateFormat,
                            readonly: "readonly",
                            index: 8
                        },
                        {
                            col: "balance",
                            friendly: "余额",
                            readonly: "readonly",
                            index: 9
                        }
                    ],

                    findFilter: function () {
                        var areaId_select = $('#find_area option:selected').val();
                        var whereinfo = "";
                        if (areaId_select) {
                            whereinfo += " area_id='" + areaId_select + "' and ";
                        }
                        if ($('#find_accountCodes').val()) {
                            whereinfo += " chg_account_no='" + $('#find_accountCodes').val() + "' and ";
                        }
                        if ($('#find_accountNames').val()) {
                            whereinfo += " acc_name like '" + $('#find_accountNames').val() + "%' and ";
                        }
                        if ($("#from1").val() && $("#to1").val()) {
                            whereinfo += "balance>-" + $('#to1').val() + " and balance<-" + $('#from1').val() + " and "

                        } else if ($("#from1").val() && !$("#to1").val()) {
                            bootbox.alert("请输入上限金额")
                        } else if (!$("#from1").val() && $("#to1").val()) {
                            bootbox.alert("请输入下限金额")
                        }
                        var bd = {
                            "cols": "*",
                            "froms": "gas_chg_account a left join gas_act_gasfee_account b on a.chg_account_id=b.chg_account_id",
                            "wheres": whereinfo + "  a.account_type='1' and balance<0 and area_id in(" + areas + ")",
                            "page": true,
                            "limit": 50
                        };
                        var bd1 = {
                            "cols": "sum(balance) as num",
                            "froms": "gas_chg_account a left join gas_act_gasfee_account b on a.chg_account_id=b.chg_account_id",
                            "wheres": whereinfo + "  a.account_type='1'  and balance<0 and area_id in(" + areas + ")",
                            "page": false
                        };
                        $.ajax({
                            type: 'get',
                            url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + encodeURIComponent(JSON.stringify(bd1)),
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            async: false,
                            success: function (data) {
                                $('#sumPrice1').val(data.rows[0].num);
                            }
                        });
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));

                    }
                }
            );
        }
    }
}();
$('#find_price').click(function () {
    var sumPrice = xw.getTable().getData();
    console.log(sumPrice)
    var price = 0;
    var num = 1;
    if (sumPrice.rows) {
        for (var i = 0; i < sumPrice.rows.length; i++) {
            price += sumPrice.rows[i].balance;
            num += 1;
        }
    }
});
$('#printBill').click(function () {
	bootbox.alert("打印信息生成中，请不要离开此页面...",function(){
		var data = xw1.getTable().getData(true);
	    console.log(data);
	    var pids = new Array();
	    for (var i = 0; i < (data.rows).length; i++) {
	        var ctmArchiveId = data.rows[i].ctmArchiveId
	        var pid = $.md5(ctmArchiveId + new Date().getTime());
	        var customerName = data.rows[i].customerName;
	        var customerCode = data.rows[i].customerCode;
	        var customerAddress = data.rows[i].customerAddress;
	        var areaName = AreaHelper.getDisplay(data.rows[i].areaId);
	        var mobile;
	        $.ajax({
	            headers: {
	                'Accept': 'application/json',
	                'Content-Type': 'application/json'
	            },
	            type: 'get',
	            async: false,
	            url: hzq_rest + "gassysuser/" + data.rows[i].countperId,
	            success: function (data) {
	                if (data.mobile) {
	                    mobile = data.mobile;
	                } else {
	                    mobile = "-"
	                }
	            }
	        });
	        var copyTime = data.rows[i].modifiedTime;
	        var year = copyTime.substring(0, 4);
	        var month = copyTime.substring(5, 7);
	        var day = copyTime.substring(8, 10);
	        var balance = data.rows[i].balance;
	        var date = new Date();
	        var currentYear = date.getFullYear();
	        var currentMonth = date.getMonth() + 1;
	        var currentDay = date.getDate();
	        // var meterReading = data.rows[i].meterReading;
	        var passName = customerName.substring(0, 1) + "**";
	        
	        var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
			var froms = "(select ctm_archive_id,meter_reading,revise_reading,meter_reading_id,copy_time,row_number() over (partition by ctm_archive_id order by copy_time desc )as rn1 from gas_mrd_meter_reading where ctm_archive_id='" + ctmArchiveId + "'and is_mrd='1' and is_bll='1' and copy_state = '6') d";
	        var params = {
				"cols": "d.*",
				"froms": froms,
				"wheres": "d.rn1=1",
				"page": true,
				"limit": 1
			}
	        var reading="";
	        var readingData = Restful.insert(paramurl,params);
	        if(readingData.rows&&readingData.rows.length>0){
	        	var mrdMeterReading=readingData.rows[0];
	        	reading=mrdMeterReading.meterReading;
	//      	if(ctmMeter.reviseMeterId){
	//      	}
	        }
	        
	        
	        var printcontent = {
	        	"customerName": passName,
	            "customerCode":customerCode,
	            "address":customerAddress,
	            "year":year,
	            "month":month,
	            "day":day,
	            "reading":reading,
	            "balance":balance,
	            "sysuserphone":mobile,
	            "chargeunit":areaName,
	            "currentyear":currentYear,
	            "currentmonth":currentMonth,
	            "currentday":currentDay
	        }
	        var parameter = {
	            "businesstype": "rqfcjtz",
	            "printcontent": JSON.stringify(printcontent),
	            "pid": "" + pid + ""
	        };
	        console.log(parameter);
	        $.ajax({
	            url: "hzqs/spt/pbprt.do?fh=PRTSPT0000000J00&resp=bd",
	            type: "POST",
	            async: false,
	            contentType: "application/json;charset=utf-8",
	            data: JSON.stringify(parameter),
	            dataType: "json",
	            success: function (data) {
	                console.log(data);
	                pids.push(pid);
	                localService.callPrint({"ptid": pid}, function (ret, isSuccess) {
	                    console.log(isSuccess);
	                });
	            }
	        })
	        
	    }
	    bootbox.alert("打印信息生成成功")
	})
    
    // var batchCount = 5;
    // for (var i = 0; i < pids.length; i++) {
    //     localService.callPrint({"ptid": pids[i]}, function (ret, isSuccess) {
    //
    //     });
    // }
	
});


