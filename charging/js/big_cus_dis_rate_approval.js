var bigCusDirRateApproval = function () {

    var xw ;

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

    var archiveIdFormat = function () {
        return{
            f:function(val){
                if(val){
                    var tmpArchiveids=val.split(",");
                    return tmpArchiveids.length
                }
            }
        }
    }();
    var stepAndPriceFormat = function () {
        return {
            f : function (val,row) {
                var stepStr = "";
                if(row["priceType"] ==2){ //固定价格
                    stepStr = "周期价:"+ row["price1"];
                }else{
                    for(var i=1;i<=5;i++) {
                        var measureFrom = "measureFrom"+i ;
                        var measureTo = "measureTo"+i ;
                        var price = "price"+i ;
                        if((row[measureFrom]==0 ||row[measureFrom]) && row[measureTo] && row[price]){
                            stepStr=stepStr +"第"+i+"阶梯:"+row[measureFrom]+ "~"+row[measureTo]+"&nbsp价格:" +row[price]+"<br/>";
                        }
                    }
                }
                return stepStr;
            }
        }
    }();


    var gotoDetail = function () {
        return {
            f : function (val,row) {
                if(row['status'] === '9' || row['status'] === '2'){//已撤销,审核通过的不让撤销
                    return "<a href='charging/big_cus_approval_step.html?fromDetailPage=1&refno=" +  row["nonRsdtDctFlowId"] + "\'>" + "&nbsp;详情"+ "</a>";
                }
                return "<a href='charging/big_cus_approval_step.html?fromDetailPage=1&refno=" +  row["nonRsdtDctFlowId"] + "\'>" + "&nbsp;详情"+ "</a>" +
                        "<a onclick=\"revoke('" + row['nonRsdtDctFlowId'] + "')\">&nbsp;撤销</a>";
            }
        }
    }();

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
            this.initAction();
        },


        reload:function(){

            $('#divtable').html('');


            var cols = "a.non_rsdt_dct_id, a.customer_name,a.customer_tel, a.discount_type, a.customer_address,"+
                "a.belong_to,a.treaty_start_time,a.treaty_end_time,a.year_least_gas,a.created_time,a.created_by,"+
                " a.measure_from1,a.measure_to1,a.price1," +
                " a.measure_from2,a.measure_to2,a.price2,"+
                " a.measure_from3,a.measure_to3,a.price3,"+
                " a.measure_from4,a.measure_to4,a.price4,"+
                " a.measure_from5,a.measure_to5,a.price5,"+
                "b.non_rsdt_dct_flow_id, b.archiveids,b.area_id,b.status ";

            var bd={
                "cols":cols,
                "froms":" gas_bll_nonrsdt_dct a inner join  gas_bll_nonrsdt_dct_flow  b on  a.non_rsdt_dct_id = b.non_rsdt_dct_id ",
                "wheres": "a.nonrsdt_type='1'",
                "pages":true
            };

            var url = "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd));
            console.log("url:"+url);

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    //restbase: 'gasbllnonrsdtdct',
                    restURL:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    // key_column:'nonRsdtDctId',
                    coldefs:[
                        {
                            col:"nonRsdtDctId",
                            friendly:"非居民优惠ID",
                            hidden:true,
                            unique:"true",
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"customerName",
                            friendly:"大客户名称",
                            // format:bigCusInfoFormat,
                            index:2
                        },
                        {
                            col:"customerTel",
                            friendly:"大客户电话",
                            validate:"required,onlyNumber,length[0-12]",
                            index:3
                        },
                        {
                            col:"customerAddress",
                            friendly:"大客户地址",
                            hidden:true,
                            index:4
                        },
                        {
                            col:"discountType",
                            friendly:"优惠类型",
                            inputsource: "select",
                            format:GasModBil.DiscountType,
                            index:5
                        },
                        {
                            col:"rn",
                            friendly:"阶梯和气价",
                            format:stepAndPriceFormat,
                            nonedit: "noeidt",
                            index:6
                        },
                        {
                            col:"yearLeastGas",
                            friendly:"年最低用气量",
                            validate:"onlyNumber,length[0-15]",
                            index:7
                        },
                        {
                            col:"treatyStartTime",
                            friendly:"协议开始时间",
                            format:GasModBil.dateFormat,
                            inputsource:"datepicker",
                            date_format:"yyyy-MM-dd",
                            validate:"date",
                            readonly:"readonly",
                            index:8
                        },
                        {
                            col:"treatyEndTime",
                            friendly:"协议结束时间",
                            format:GasModBil.dateFormat,
                            inputsource:"datepicker",
                            date_format:"yyyy-MM-dd",
                            // date_format:"yyyy-mm-dd hh:ii:ssZ",
                            readonly:"readonly",
                            index:9
                        },
                        {
                            col:"belongTo",
                            friendly:"所属单位",
                            index:10
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:GasModBil.dateFormat,
                            hidden:true,
                            nonedit: "noeidt",
                            index:11
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            hidden:true,
                            index:12
                        },
                        /*{
                         col:"modifiedBy",
                         friendly:"变更人",
                         index:13
                         },*/
                        {
                            col:"archiveids",
                            friendly:"户数",
                            format:archiveIdFormat,
                            index:14
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaHelperFormat,
                            index:15
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            format:GasModBil.approvalStatusFormat,
                            index:16
                        },
                        {
                            col:"modifiedTime",
                            friendly:"操作",
                            format:gotoDetail,
                            nonedit: "noeidt",
                            index:17
                        },
                        {
                            col:"nonRsdtDctFlowId",
                            friendly:"流程ID",
                            hidden:true,
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:18
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function(){

                        var sql= " a.nonrsdt_type='1'";
                        if ($('#find_customerName').val()) {
                            sql+=" and a.customerName like '"+$('#find_customerName').val()+"%'";
                        }
                        if ($('#find_customerAddress').val()) {
                            sql+= " and a.customerAddress like '"+$('#find_customerAddress').val()+"%'"
                        }

                        if ($('#find_customerTel').val()) {
                            sql+= " and a.customerTel like '"+$('#find_customerTel').val()+"%'"
                        }

                        if ($('#find_start_date').val()) {
                            sql+= " and a.treatyStartTime <= "+ "to_date('"+ $('#find_start_date').val() +"','yyyy-MM-dd')"
                        }

                        if ($('#find_end_date').val()) {
                            sql+= " and a.treatyEndTime >= "+ "to_date('"+ $('#find_start_date').val() +"','yyyy-MM-dd')"
                        }


                        var bd={
                            "cols":cols,
                            "froms":" gas_bll_nonrsdt_dct a inner join  gas_bll_nonrsdt_dct_flow  b on  a.non_rsdt_dct_id = b.non_rsdt_dct_id ",
                            "wheres":sql,
                            "page":true
                        };

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }

                }) //--init
        },

        initAction:function () {
            $("#apply_button").on("click",function (e) {
                window.location.href='charging/application_add.html';
                /*var selrows = xw.getTable().getData(true);
                 if (selrows.rows.length == 0) {
                 bootbox.alert("<br><center><h4>请选择需要申请的大客户协议</h4></center><br>");
                 } else if (selrows.rows.length > 1) {
                 bootbox.alert("<br><center><h4>只能选择一行</h4></center><br>");
                 } else {
                 var selrow = selrows.rows[0];
                 var nonRsdtDctId= selrow["nonRsdtDctId"];
                 window.location.href='charging/application_add.html?nonRsdtDctId='+ nonRsdtDctId;
                 console.log(selrow);
                 }*/
            })


        }


    }
}();

//撤销申请
function revoke(nonRsdtDctFlowId) {
    // //先找到主键
    var query = {};
    query.refNo = nonRsdtDctFlowId;
    var jsonData = Restful.find(hzq_rest + "psmflowinst",JSON.stringify(query));

    if(!jsonData || jsonData == undefined || jsonData.length ==0 || jsonData > 1){
        bootbox.alert('未查询到审批流程...');
        return;
    }

    var query1 = {};
    query1.flowInstId = jsonData[0].flowInstId;
    var jsonData1 = Restful.find(hzq_rest + "psmstepinst", JSON.stringify(query1));

    if(!jsonData1 || jsonData1 == undefined || jsonData1.length ==0){
        bootbox.alert('未查询到审批流程步骤...');
        return;
    }
}
