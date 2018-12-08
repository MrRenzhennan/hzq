/**
 * Created by anne on 2017/6/3.
 */
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push("'"+val.areaId+"'");
            $('#find_areaId').append('<option value="' + val.areaId + '" name="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});

var ChargeCorrectAction= function () {
    //用户helper
    var userHelper=RefHelper.create({
        ref_url:"gassysuser",
        ref_col:"userId",
        ref_display:"employeeName",
    });

    var userHelperFormat=function () {
        return{
            f:function(val){
                return userHelper.getDisplay(val)
            }
        }
    }();
    //抄表本helper
    var bookHelper=RefHelper.create2({
        ref_url:"gasmrdbook",
        ref_col:"bookId",
        ref_display:"bookCode",
    });

    var bookHelperFormat=function () {
        return{
            f:function(val){
                return bookHelper.getDisplay(val)
            }
        }
    }();
    //供气区域helper
    var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });

    var areaHelperFormat=function () {
        return{
            f:function(val){
                return areaHelper.getDisplay(val)
            }
        }
    }();

    var dateFormat = function () {
        return{
            f: function (val) {
                if(val){
                    var data= val.split("T");
                    return data.join(" ");
                }
            }
        }
    }();

    //审核状态
    var examineState= function () {
        return {
            f: function (val,row) {
                console.log(row)
                if(val==="1") return "<font color=''>审核中</font>";
                else if(val==="2") return "<font color=''>审核通过</font>";
                else if(val==="3") return "<font color=''>审核未通过</font>";
                else if(val==="4") return "<font color=''>待审批</font>";
                else if(val==="5") return "<font color=''>已撤销</font>";
                else return "error";
            }
        }
    }()

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
            this.initHelper();

        },

        initHelper:function(){
            //correct_reason select init
            var data={"表具损坏":"表具损坏","重新开栓":"重新开栓","换表下线":"换表下线","抄串户":"抄串户","预估气量过高":"预估气量过高"}
            $.map(data, function (key, val) {
                $('#correct_reason').append('<option  value="' + val + '">' + key + '</option>');
            });


            // $.each(GasModSys.areaHelper.getRawData(), function (idx, row) {
            //     $('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
            // });

            $('#find_areaId').on('change',function(e){
                console.log("change area:"+e+"."+$('#find_areaId').val());
                GasModSys.counterUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                        })
                        $("#find_countperId").html(inhtml);
                        $("#find_countperId").val("").change();

                    }
                })
                xw.autoResetSearch();
            })

            $('#find_countperId').on('change',function(e){
                console.log("change counter:"+e+"."+$('#find_countperId').val());
                GasModSys.copyUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "countperId":$('#find_countperId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                            $.each(data,function(idx,row){
                                inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                            })
                        }
                        $("#find_serviceperId").html(inhtml);
                        $("#find_serviceperId").val("").change();

                    }
                })
                xw.autoResetSearch();
            })
            $('#find_serviceperId').on('change',function(e){
                xw.autoResetSearch();
            });

        },


        reload : function(){
            $('#divtable').html('');
            var bd = {
                "cols":"*",
                "froms": "gas_chg_recover a left join gas_ctm_archive b on b.customer_code = a.customer_code left join gas_mrd_book c on c.book_id=b.book_id",
                "wheres":"a.area_id in ("+loginarea.join()+") order by a.created_time desc",
                "page":true,
                "limit":50
            };
            /* rf= RFTable.init(*/
            $('#divtable').html('');
            var reasonTypeFormat = function () {
                return {
                    f: function (val) {
                        if (val == "1") {
                            return "死表"
                        } else if (val == "2") {
                            return "下线表用量未收回"
                        } else if (val == "3") {
                            return "其他"
                        } else if (val == "4") {
                            return "顺价追补气费"
                        }
                    }
                }

            }()
            // xw=XWATable.init(
            xw = XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize : 10,
                    // pageSize : 200,
                    columnPicker : true,
                    transition : 'fade',
                    checkAllToggle:true,
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    coldefs:[
                        {
                            col : 'areaId',
                            format:areaHelperFormat,
                            friendly : '供气区域',
                            sorting:false,
                            index : 1
                        },
                        {
                            col : 'customerCode',
                            friendly : '客户编号',
                            sorting:false,
                            index : 2
                        },
                        {
                            col : 'customerName',
                            friendly : '客户名称',
                            nonendit : 'nosend',
                            readonly : 'readonly',
                            sorting : false,
                            index : 3
                        },
                        {
                            col: "customerType",
                            friendly: "表类别",
                            format:function(){
                                return{
                                    f:function(val){
                                        if(val=="I"){
                                            return "IC卡表"
                                        }else if(val=="P"){
                                            return "普表"
                                        }
                                    }
                                }
                            }(),
                            sorting: false,
                            index:4
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类别",
                            format:function(){
                                return{
                                    f:function(val){
                                        if(val=="1"){
                                            return "居民"
                                        }else if(val=="9"){
                                            return "非居民"
                                        }
                                    }
                                }
                            }(),
                            sorting: false,
                            index:5
                        },
                        {
                            col : 'bookCode',
                            format:bookHelperFormat,
                            friendly : '抄表本编号',
                            sorting:false,
                            index : 6
                        },
                        {
                            col : 'countperId',
                            format:userHelperFormat,
                            friendly : '核算员',
                            sorting:false,
                            index : 7
                        },
                        {
                            col : 'serviceperId',
                            format:userHelperFormat,
                            friendly : '抄表员',
                            sorting:false,
                            index : 8
                        },
                        {
                            col: "recoverGas",
                            friendly: "追补气量",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "recoverMoney",
                            friendly: "追补金额",
                            sorting: false,
                            index:10
                        },
                        {
                            col: "reasonType",
                            friendly: "追补原因类型",
                            format: reasonTypeFormat,
                            sorting: false,
                            index: 11
                        },
                        {
                            col : 'reason',
                            friendly : '追补原因',
                            sorting:false,
                            index : 12
                        },
                        {
                            col : 'createdTime',
                            format:dateFormat,
                            friendly : '追补时间',
                            sorting:false,
                            index : 13
                        },

                    ],
                    // 查询过滤条件
                    findFilter : function(){
                        var sql= " 1=1 ";

                        if ($('#find_customerCode').val()) {
                            sql+=" and a.customer_code like '%"+$('#find_customerCode').val()+"%'";
                        }
                        if ($('#find_customerName').val()) {
                            sql+=" and b.customer_name like '%"+$('#find_customerName').val()+"%'";
                        }
                        if ($('#find_areaId option:selected').val()) {
                            sql+= " and a.area_id = '"+$('#find_areaId option:selected').val()+"'"
                        }else{
                            sql+= " and a.area_id in ("+loginarea.join()+") "
                        }
                        if ($("#find_countperId").val()) {
                            sql+= " and c.countper_id = '"+$("#find_countperId").val()+"'"
                        }
                        if ($("#find_serviceperId").val()) {
                            sql+= " and c.serviceper_id = '"+$("#find_serviceperId").val()+"'"
                        }
                        if ($("#find_customerKind").val()) {
                            sql+= " and b.customer_kind = '"+$("#find_customerKind").val()+"'"
                        }
                        if ($("#find_reasonType").val()) {
                            sql+= " and a.reason_type = '"+$("#find_reasonType").val()+"'"
                        }

                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            sql += " and to_char(a.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        if ($("#book_code").val()) {
                            sql+= " and c.book_code = '"+$("#book_code").val()+"'"
                        }

                        bd = {
                            "cols":"*",
                            "froms": "gas_chg_recover a left join gas_ctm_archive b on b.customer_code = a.customer_code left join gas_mrd_book c on c.book_id=b.book_id ",
                            "wheres":sql + "order by a.created_time desc",
                            "page":"true",
                            "limit":50
                        };
                        /*var bd={
                            "cols":"",
                            "froms":"gas_bll_correct_flow correct left join gas_ctm_archive archive on " +
                            "correct.ctm_archive_id = archive.ctm_archive_id left join gas_mrd_book book on " +
                            "archive.book_id = book.book_id",
                            "wheres":sql + "and  correct.status='2' order by  correct.created_time desc ",
                            "page":true
                        };*/

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }
                }); // --init

        }

    }
}();





