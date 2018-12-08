var href = document.location.href;
//var booktext = href.substring(href.indexOf("?")+1, href.lenth);
var reg = new RegExp("(^|&)");
var r = window.location.search.substr(1).match(reg);
var bookid ='';
var plancopytime = '';
if(r.input){
    var s = r.input.split('&');
    bookid=s[0];
    plancopytime =s[1];
}


var PlanDetailManagerAction = function () {

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        console.log(r);

        if (r != null) return unescape(r[2]); return null;

    }
    var xw;
    //供气区域helper
    return {
        init: function () {
            this.initHelper();
            this.reload();
        },

        initHelper: function () {
            // 供气区域 select init
            $.map(GasModSys.areaHelper.getData(), function (value, key) {
                $('#find_areaId').append('<option value="' + key + '">' + value + '</option>');
            });
            //抄表类型
            $.map(GasModMrd.enumCopyType,function(value,key){
                $('#copy_type').append('<option value="' + key + '">' + value + '</option>');
            });
            //是否计费
            $.map(GasModMrd.enumIsBll,function(value,key){
               $('#is_bll').append('<option value="' + key + '">' + value + '</option>');
            });
            //是否抄表
            $.map(GasModMrd.enumIsMrd,function(value,key){
               $('#is_mrd').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModMrd.enumDataSource,function(value,key){
                $('#data_source').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModCtm.enumCustomerKind,function(value,key){
               $('#customer_kind').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModCtm.enumCustomerState, function (value,key) {
                $('#customer_state').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModCtm.enumCustomerType,function(value,key){
               $('#customer_type').append('<option value="' + key + '">' + value + '</option>');
            });
            $('#find_areaId').on('change', function (e) {
                console.log("change area:" + e + "." + $('#find_areaId').val());
                GasModSys.counterUsersInArea({
                    "areaId": $('#find_areaId').val(),
                    "cb": function (data) {
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data, function (idx, row) {
                            inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                        })
                        $("#find_countperId").html(inhtml);
                        $("#find_countperId").val("").change();

                    }
                })
            });

            $('#find_countperId').on('change', function (e) {
                console.log("change counter:" + e + "." + $('#find_countperId').val());
                GasModSys.copyUsersInArea({
                    "areaId": $('#find_areaId').val(),
                    "countperId": $('#find_countperId').val(),
                    "cb": function (data) {
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data, function (idx, row) {
                            inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                        })
                        $("#find_serviceperId").html(inhtml);
                        $("#find_serviceperId").val("").change();

                    }
                })
            })

        },
        reload: function () {
            $('#divtable').html('');
            var whereinfo = '1=1 ';
            if(bookid){
                whereinfo +=" and mr.book_id='"+bookid+"' ";
            }
            if(plancopytime){
                whereinfo += " and to_char(mr.plan_copy_time,'yyyy-mm-dd')='"+plancopytime+"' ";
            }
          //  var areaId = GetQueryString("areaId");
          //  var planyear = GetQueryString("copyyear");
           // console.log(areaId);
           // console.log(planyear);
            var bd = {
                "cols": "mr.book_id,mr.ctm_archive_id,mr.meter_reading_id,mr.meter_id,mr.revise_meter_id," +
                "mr.customer_kind,mr.meter_reading,mr.revise_reading,mr.last_meter_reading,mr.last_revise_reading," +
                "mr.copy_type,mr.copy_time,mr.plan_copy_time,mr.quotiety,mr.area_id,mr.serviceper_id,mr.countper_id," +
                "ar.customer_code,ar.customer_name,mr.copy_state,b.book_code,b.book_type," +
                "g.gas_type_name,gas_type_code,mr.data_source," +
                "m_1.meter_digit,m_2.meter_digit revise_meter_digit,m_1.meter_kind,m_2.meter_kind revise_meter_kind",
                "froms": "gas_mrd_meter_reading mr " +
                " left join gas_ctm_archive ar on ar.ctm_archive_id=mr.ctm_archive_id" +
                " left join gas_mrd_book b on b.book_id=mr.book_id " +
                " left join gas_biz_gas_type g on g.gas_type_id= mr.gas_type_id " +
                " left join gas_mtr_meter m_1 on m_1.meter_id=mr.meter_id " +
                " left join gas_mtr_meter m_2 on m_2.meter_id=mr.revise_meter_id ",
               // "wheres": whereinfo + " and mr.area_id='"+areaId+"'",
                "wheres": whereinfo,
                //" and to_char(mr.plan_copy_time,'yyyy') ='"+planyear+"' ",
                "page": "true",
                "limit":50
            };

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    coldefs: [
                        {
                            col: "meterReadingId",
                            friendly: "抄表表ID",
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "ctmArchiveId",
                            friendly: "客户档案ID",
                           // unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            readonly: "readonly",
                            format: GasModSys.areaFormat,
                            // format:areaFormat,
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "planCopyTime",
                            friendly: "计划抄表日期",
                            format: dateFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 4
                        },
                        {
                            col:"copyState",
                            friendly:"抄表状态",
                            format:GasModMrd.mrdStateFormat,
                            readonly:"readonly",
                            sorting:false,
                            index:5
                        },
                        {
                            col:"copyTime",
                            friendly:"实际抄表时间",
                            sorting:false,
                            index:6
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format: GasModSys.employeeNameFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "serviceperId",
                            friendly: "客户服务员",
                            format: GasModSys.employeeNameFormat,
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类型",
                            format: GasModCtm.customerKindFormat,
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "bookId",
                            friendly: "抄表本ID",
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: false,
                            index: 12
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本编号",
                            sorting: false,
                            index: 13
                        },
                        {
                            col: "bookType",
                            friendly: "抄表本类型",
                            format: GasModBas.bookTypeFormat,
                            sorting: false,
                            index: 14
                        },
                        {
                            col:"dataSource",
                            friendly:"数据来源",
                            format:GasModMrd.dataSourceFormat,
                            sorting:false,
                            index:15
                        },



                        /*{
                            col: "isMrd",
                            friendly: "是否抄表",
                            format: GasModMrd.isMrdFormat,
                            sorting: false,
                            index: 13
                        },
                        {
                            col: "isBll",
                            friendly: "是否计费",
                            format: GasModMrd.isBllFormat,
                            sorting: false,
                            index: 14
                        },
*/
                        {
                            col: "meterKind",
                            friendly: "表具种类",
                            format: GasModMtr.meterKindFormat,
                            sorting: false,
                            index: 16
                        },
                        {
                            col: "copyTime",
                            friendly: "实际抄表日期",
                            readonly: "readonly",
                            //format: dateFormat,
                            sorting: false,
                            index: 17
                        },
                        {
                            col: "meterReading",
                            friendly: "燃气表读数",
                            readonly: "readonly",
                            sorting: false,
                            index: 18
                        },
                        {
                            col:"lastMeterReading",
                            friendly:"上次燃气表读数",
                            readonly:"readonly",
                            sorting:false,
                            index:19
                        },
                        {
                            col: "reviseReading",
                            friendly: "修正表读数",
                            readonly: "readonly",
                            sorting: false,
                            index: 20
                        },
                        {
                            col:"lastReviseReading",
                            friendly:"上次修正表读数",
                            readonly:"readonly",
                            sorting:false,
                            index:21
                        },
                        {

                            col: " gasTypeName",
                            friendly: "用气类型",
                            sorting: false,
                            index:22
                        },
                        {
                            col: "address",
                            friendly: "地址",
                            readonly: "readonly",
                            sorting: false,
                            unique: "true",
                            index: 23
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function

                        var resUrl = "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=";
                        var whereinfo = '1=1';
                        if ($('#find_areaId').val()) {
                            whereinfo += " and mr.area_id='" + $('#find_areaId').val() + "'";
                        }
                        if ($('#find_serviceperId').val()) {
                            whereinfo += " and mr.serviceper_id='" + $('#find_serviceperId').val() + "'";
                        }
                        if ($('#find_countperId').val()) {
                            whereinfo += " and mr.countper_id='" + $('#find_countperId').val() + "'";
                        }
                        if ($('#find_start_date').val() && $('#find_end_date').val()) {
                            whereinfo += " and mr.plan_copy_time between to_date('" + $("#find_start_date").val() + "','yyyy-mm-dd') and to_date('" + $('#find_end_date').val() + "','yyyy-mm-dd')";
                        }
                        if($('#copy_type').val()){
                            whereinfo += " and mr.copy_type='"+$('#copy_type').val()+"'";
                        }
                        if($('#is_bll').val()){
                            whereinfo += " and mr.is_bll='"+$('#is_bll').val()+"'";
                        }
                        if($('#is_mrd').val()){
                            whereinfo += " and mr.is_mrd='"+$('#is_mrd').val()+"'";
                        }
                        if($('#data_source').val()){
                            whereinfo += " and mr.data_source='"+$('#data_source').val()+"'";
                        }
                        if($('#customer_kind').val()){
                            whereinfo += " and ar.customer_kind='"+$('#customer_kind').val()+"'";
                        }
                        if($('#customer_state').val()){
                            whereinfo += " and ar.customer_state='"+$('#customer_state').val()+"'";
                        }
                        if($('#customer_name').val()){
                            whereinfo += " and ar.customer_name like '%"+$('#customer_name').val()+"%'";
                        }
                        if($('#customer_code').val()){
                            whereinfo += " and ar.customer_code like '"+$('#customer_code').val()+"'";
                        }
                        if($('#customer_address').val()){
                            whereinfo += " and ar.customer_address like '"+$('#customer_address').val()+"'";
                        }
                        if($('#customer_type').val()){
                            whereinfo += " and ar.customer_type='"+$('#customer_type').val()+"'";
                        }

                        var bd = {
                            "cols": "mr.book_id,mr.ctm_archive_id,mr.meter_reading_id,mr.meter_id,mr.revise_meter_id," +
                            "mr.customer_kind,mr.meter_reading,mr.revise_reading,mr.last_meter_reading,mr.last_revise_reading," +
                            "mr.copy_type,mr.copy_time,mr.plan_copy_time,mr.quotiety,mr.area_id,mr.serviceper_id,mr.countper_id," +
                            "ar.customer_code,ar.customer_name,mr.copy_state,b.book_code,b.book_type," +
                            "g.gas_type_name,gas_type_code,mr.data_source," +
                            "m_1.meter_digit,m_2.meter_digit revise_meter_digit,m_1.meter_kind,m_2.meter_kind revise_meter_kind",
                            "froms": "gas_mrd_meter_reading mr " +
                            " left join gas_ctm_archive ar on ar.ctm_archive_id=mr.ctm_archive_id" +
                            " left join gas_mrd_book b on b.book_id=mr.book_id " +
                            " left join gas_biz_gas_type g on g.gas_type_id= mr.gas_type_id " +
                            " left join gas_mtr_meter m_1 on m_1.meter_id=mr.meter_id " +
                            " left join gas_mtr_meter m_2 on m_2.meter_id=mr.revise_meter_id ",
                            "wheres": whereinfo,
                            "page": true,
                            "limit":50
                        };
                        var queryUrl = resUrl + encodeURIComponent(JSON.stringify(bd));

                        xw.setRestURL(queryUrl);
                        return null;
                    }
                });
        },
    }

}();
