//岗位操作员联动
linkage();
//供气区域权限
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id

GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $('#find_area').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});

// GasModSys.areaHelper
/*console.log(GasModSys.areaHelper.getRawData())
$.each(GasModSys.areaHelper.getRawData(), function (idx, row) {
    console.log(row)
    $('#find_area').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
});*/



var ContractInhabitant = function () {
    //供气区域
    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName",
    });
    var countperHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName",
    });
    var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName"
    });
    var gasTypeFormat = function () {
        return {
            f: function (val) {
                return gasTypeHelper.getDisplay(val);
            }
        }
    }();
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var CountperFormat = function () {
        return {
            f: function (val) {
                return countperHelper.getDisplay(val);
            },
        }
    }();
    var detailFormat = function () {
        return {
            f: function (val,row) {/*id='modifycont' data-row='"+JSON.stringify(row)+"' data-target='#modifycontract' data-toggle='modal'*/
                if(row.contractNo){
                    return "<a href='customer/inhabitant_contract_detail.html?" + val + "'>详情</a> <a href='customer/modify_contract_inhabitant.html?" + val + "'>修改</a>";
                }else {
                    return "<a href='javascript:;' class='informa'>详情</a>"
                }

            }
        }
    }();

   /* $.map(AreaHelper.getData(), function (value, key) {
        $('#find_area').append('<option value="' + key + '">' + value + '</option>');
    });*/

    /*var downloadBookFormat = function () {
        return {
            f: function (val,row) {
                var queryid='{"contractId":{"$in":["'+row.contractId+'"]}}';
                var dbcol="useGasPerson,contractNo,customerType,gasKind,signupTime,remark";
                var ncol="客户姓名,合同编号,客户类型(普表或IC卡),用气类型(居民或非居民),签订日期,备注";
                // var dbcol="customerCode,customerName,idcardType,idcard,customerAddress,tel,exigenceTel,wechat,stationHouse,office,denizenCommittee,propertyCompany";
                // var ncol="客户编号,客户姓名,证件类型,证件号码,客户地址,手机号,应急电话,微信号,所属派出所,所属街道办事处,所属社区,物业公司";

                var q = 'page=true&et=居民合同导入模板&ncol='+ncol.uricode()+'&dbcol='+dbcol.uricode()+'&exp=excel&'

                var emap = JSON.stringify({"customerType":"I:IC卡;P:普表","gasKind":"1:居民"});
                return '<a target=_blank href="'+hzq_rest+'gasctmcontract/?query='+queryid.uricode()+"&ci="+emap.uricode()+'&'+q+'">下载</a>';
            }
        }
    }();*/
   /* $("#muban").on('click',function(){
        var queryid='{"name":{"$in":[""]}}';
        var dbcol="useGasPerson,contractNo,customerType,gasKind,signupTime,remark";
        var ncol="客户姓名,合同编号,客户类型(普表或IC卡),用气类型(居民或非居民),签订日期,备注";
        var q = 'page=true&et=居民合同导入模板&ncol='+ncol.uricode()+'&dbcol='+dbcol.uricode()+'&exp=excel&';
        $(this).find("a").attr('href',hzq_rest+'gascsrlowincome/?query='+queryid.uricode()+'&'+q);
        $(this).find("a").attr("target","_blank");
    });*/

    return {

        init: function () {
            this.initHelper();
            this.reload();

        },
        initHelper: function () {
            // 用气性质select init
            $.map(gasTypeHelper.getData(), function (value, key) {
                $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
            });
           /* $.map(AreaHelper.getData(), function (value, key) {
                $('#find_areaId').append('<option value="' + key + '">' + value + '</option>');
            });*/
        },
        reload: function () {
            $('#divtable').html('');


            var bd = {
                "cols": "ca.*,b.countper_id,b.serviceper_id,b.book_code,c.unbolt_time,c.customer_code customercode",
                "froms": "gas_ctm_archive c left join gas_ctm_contract ca on ca.customer_code = c.customer_code" +
                " left join gas_mrd_book b on b.book_id = c.book_id ",
                "wheres": "c.customer_kind = '1' and c.area_id in ("+loginarea.join()+")",
                "page": true,
                "limit": 50
            };
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    tableId:"divtable",
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    // restbase: 'gasctmcontract/'+'?query={"gas_kind":"1"}"',
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: 'contractId',
                    coldefs: [
                        {
                            col: "customercode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "useGasPerson",
                            friendly: "客户名称",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "contractNo",
                            friendly: "合同编号",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            sorting: false,
                            format: AreaFormat,
                            index: 4
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format:CountperFormat,
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "serviceperId",
                            friendly: "抄表员",
                            format:CountperFormat,
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本",
                            sorting: false,
                            index: 7
                        },

                        {
                            col: "useGasAddress",
                            friendly: "客户地址",
                            sorting: false,
                            // format: GasModCtm.customerTypeFormat,
                            index: 8
                        },
                        {
                            col: "signupTime",
                            friendly: "签约日期",
                            inputsource: "datetimepicker",
                            date_format: "yyyy-mm-dd",
                            format: dateFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "unboltTime",
                            friendly: "开栓时间",
                            inputsource: "datetimepicker",
                            date_format: "yyyy-mm-dd",
                            format: dateFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "contractState",
                            friendly: "合同状态",
                            format: GasModCtm.contractStatusFormat,
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "remark",
                            friendly: "备注",
                            sorting: false,
                            hidden: true,
                            index: 10
                        },
                       /* {
                            col:"download",
                            friendly:"下载模板",
                            format:downloadBookFormat,
                            index:9
                        },*/
                        {
                            col: "contractId",
                            friendly: "操作",
                            readonly: "readonly",
                            format: detailFormat,
                            sorting: false,
                            index: 10
                        },

                    ],
                    // 查询过滤条件
                    findFilter: function () {

                        var whereinfo = "";
                        if ($('#find_customerCode').val()) {
                            whereinfo += "c.customer_code like '%" + $('#find_customerCode').val() + "%' and ";
                        }

                        if ($('#find_useGasPerson').val()) {
                            whereinfo += "ca.use_gas_person like '%" + $('#find_useGasPerson').val() + "%' and ";
                        }

                        if ($('#find_contractCode').val()) {
                            whereinfo += "ca.contract_no like '%" + $('#find_contractCode').val() + "%' and ";
                        }
                         if ($('#find_customerAddress').val()) {
                            whereinfo += "ca.use_gas_address like '%" + $('#find_customerAddress').val() + "%' and ";
                        }
                        if ($("#find_bookcode").val()) {
                            whereinfo += "b.book_code like '%" + $('#find_bookcode').val() + "%' and ";
                        }
                        if ($("#find_count").val()) {
                            whereinfo += "b.countper_id like '%" + $('#find_count').val() + "%' and ";
                        }

                        if ($("#find_area").val()) {
                            whereinfo += "c.area_id='" + $('#find_area').val() + "' and ";
                        }

                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " to_char(ca.signup_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        var bd = {
                            "cols": "ca.*,b.countper_id,b.serviceper_id,b.book_code,c.unbolt_time,c.customer_code customercode",
                            "froms": "gas_ctm_archive c left join gas_ctm_contract ca on ca.customer_code = c.customer_code" +
                            " left join gas_mrd_book b on b.book_id = c.book_id ",
                            "wheres": whereinfo + " c.customer_kind = '1' and c.area_id in ("+loginarea.join()+")",
                            "page": true,
                            "limit": 50
                        };
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }
                })
        }

    }

}();


function doNexts(data){
    if(data.success){
        bootbox.alert("提交成功！",function(){
            window.location.reload()
        })

    }

}
$(document).on("click",".informa",function(){
    bootbox.alert("<center><h4>合同未签订。</h4></center>")
})
