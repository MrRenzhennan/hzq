/**
 * Created by jack on 2018/01/04.
 */
var current = new Date();
var currentYear = current.getFullYear();
unionCollectFeeDetailAction = function () {

    // 供气区域helper
    var areaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });

    var areaFormat = function () {
        return {
            f : function (val) {
                return areaHelper.getDisplay(val) == 0 ? "" : areaHelper.getDisplay(val);
            },
        }
    }();

    var kindFormat = function(){
        return {
            f : function(val){
                if(val == '1'){
                    return '居民';
                }else if (val == '9'){
                    return '非居民';
                }else {
                    return '';
                }
            }
        }
    }();

    var unionFormat = function(){
        return {
            f : function(val){
                if(val == '1'){
                    return '联合';
                }else if (val == '0'){
                    return '非联合';
                }else {
                    return '';
                }
            }
        }
    }();

    var fixFormat = function(){
        return {
            f : function(val, row){
                return "<a data-target='#updatetable' id='update_meter' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '编辑' + "</a>";
            }
        }
    }();

    var secFormat = function(){
        return {
            f : function(val, row){
                if( val == 0){
                    return "安全";
                }else{
                    return "不安全";
                }
            }
        }
    }();

    var actionFormat = function(){
        return {
            f : function(val, row){
                if( val == 0){
                    return "正常";
                }else{
                    return "窃气";
                }
            }
        }
    }();

    var otherFormat = function(){
        return {
            f : function(val, row){
                if( val == 0){
                    return "正常";
                }else{
                    return "拒绝";
                }
            }
        }
    }();

    var moneyFormat = function(){
        return {
            f : function(val, row){
                return parseFloat(val).toFixed(2);
            }
        }
    }();

    return {
        init: function () {
            this.reload();
            this.initHelper();
        },

        initHelper : function(){
            var href = document.location.href;
            var loginarea = [];
            var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
            GasModSys.areaList({
                "areaId":areaId,
                "cb":function(data){
                    console.log(data)
                    $.each(data,function(key,val){
                        loginarea.push(val.areaId);
                        $('#find_area').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
                    })
                }
            });

            var gasTypeHelper = RefHelper.create({
                ref_url: "gasbizgastype/?query={\"parentTypeId\":\"1\"}",
                ref_col: "gasTypeId",
                ref_display: "gasTypeName",
            });
            $.map(gasTypeHelper.getData(), function (value, key) {
                console.log(key)
                $('#find_kind').append('<option value="' + key + '">' + value + '</option>');
            });
        },

        reload: function () {
            var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
            var params = {
                "cols": "*",
                "froms": "gas_ctm_archive_sincerity",
                "union": "select * from gas_ctm_archive_sincerity_w",
                "wheres": "report_year = " + (currentYear - 1),
                "page": true,
                "limit": 10
            }
            $("#divtable").html("");
            xw = XWATable.init({
                divname: "divtable",
                //----------------table的选项-------
                pageSize: 10,
                columnPicker: true,
                transition: 'fade',
                sorting:true,
                checkboxes: false,
                checkAllToggle: true,
                //----------------基本restful地址---
                restURL: paramurl+encodeURIComponent(JSON.stringify(params)),
                // restbase: 'gasctmarchivesincerity?query={"reportYear":' + (currentYear - 1) + '}',
                key_column: 'ctmArchiveId',
                coldefs:[
                    {
                        col:"areaId",
                        friendly:"供气区域",
                        format: areaFormat,
                        index:1
                    },
                    {
                        col:"customerKind",
                        friendly:"客户类型",
                        format: kindFormat,
                        index:2
                    },
                    {
                        col:"customerCode",
                        friendly:"客户编号",
                        index:3
                    },
                    {
                        col:"unionType",
                        friendly:"联合账户",
                        format: unionFormat,
                        index:4
                    },
                    {
                        col:"customerName",
                        friendly:"客户姓名",
                        index:5
                    },
                    {
                        col:"gasBalance",
                        friendly:"燃气费余额",
                        format:moneyFormat,
                        index:6
                    },
                    {
                        col:"gasArrearsCount",
                        friendly:"燃气费欠费次数",
                        index:7
                    },
                    {
                        col:"wastefeeBalance",
                        friendly:"垃圾费余额",
                        format:moneyFormat,
                        index:8
                    },
                    {
                        col:"wastefeeCount",
                        friendly:"垃圾费欠费次数",
                        index:9
                    },
                    {
                        col:"reportYear",
                        friendly:"年限",
                        index:10
                    },
                    {
                        col:"secVal",
                        friendly:"安全指标",
                        format:secFormat,
                        index:11
                    },
                    {
                        col:"actionVal",
                        friendly:"行为指标",
                        format:actionFormat,
                        index:12
                    },
                    {
                        col:"otherVal",
                        friendly:"其他指标",
                        format:otherFormat,
                        index:13
                    },
                    {
                        col:"aa",
                        friendly:"操作",
                        format:fixFormat,
                        unique:true,
                        index:14
                    }
                ],
                findFilter: function(){
                    var find_area, find_year, find_kind, find_union, find_code, find_name;
                    if ($('#find_area').val()) {
                        find_area = RQLBuilder.equal("areaId", $('#find_area').val());
                    }else{
                        find_area = RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                    }
                    if($('#find_year').val()){
                        find_year = RQLBuilder.equal("reportYear", $('#find_year').val());
                    }else{
                        find_year = RQLBuilder.equal("reportYear", currentYear - 1);
                    }
                    if($('#find_kind').val()){
                        find_kind = RQLBuilder.equal("customerKind", $('#find_kind').val());
                    }
                    if($('#find_union').val()){
                        find_union = RQLBuilder.equal("unionType", $('#find_union').val());
                    }
                    if($('#find_code').val()){
                        find_code = RQLBuilder.equal("customerCode", $('#find_code').val());
                    }
                    if($('#find_name').val()){
                        find_area = RQLBuilder.like("customerName", $('#find_name').val());
                    }

                    var filter = RQLBuilder.and([
                        find_area, find_year, find_kind, find_union, find_code, find_name
                    ]);
                    xw.setRestURL(hzq_rest + "gasctmarchivesincerity")
                    return filter.rql();
                }
            })
        }
    }
}();

$(document).on('click', "#update_meter", function () {
    var row = JSON.parse($(this).attr("data-kind"));
    console.log(row);
    console.log(row['scId']);
    $('#scId').val(row['scId']);
    $('#reservedField1').val(row['reservedField1']);
    var select1 = $('select[name="sel"').find('option');
    for (var i = 0; i < select1.length; i++) {
        if (select1.eq(i).val() == row['secVal']) {
            $(this).find('option').eq(i).attr("selected", "selected");
        }
    }
    var select2 = $('select[name="sec"').find('option');
    for (var i = 0; i < select2.length; i++) {
        if (select2.eq(i).val() == row['secVal']) {
            $(this).find('option').eq(i).attr("selected", "selected");
        }
    }
    var select3 = $('select[name="sel"').find('option');
    for (var i = 0; i < select3.length; i++) {
        if (select3.eq(i).val() == row['secVal']) {
            $(this).find('option').eq(i).attr("selected", "selected");
        }
    }
});

$("#save_btn").click("on", function () {
    var data = new Object();
    data['secVal'] = $('select[name="sec"]').val();
    data['actionVal'] = $('select[name="action"]').val();
    data['otherVal'] = $('select[name="other"]').val();
    data['scId'] = $('#scId').val();
    console.log(data);
    var updurl = hzq_rest + "gasctmarchivesincerity/";
    if($('#reservedField1').val() == 'w'){//垃圾费
        updurl = hzq_rest + "gasctmarchivesincerityw/";
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: updurl,
        type: "PUT",
        dataType: "json",
        async: false,
        data: JSON.stringify(data),
        success: function (e) {
            if (e.success == true) {
                bootbox.alert("<br><center><h4>修改成功</h4></center><br>");
                location.reload();
            }
        }
    })
});



