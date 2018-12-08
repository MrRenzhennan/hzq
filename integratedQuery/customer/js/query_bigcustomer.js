var disCusRegisterAction = function () {

    var xw ;
    var nonRsdtDctId;


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
                // console.log("thr row data is ::::::" + row);
                var jsonStr = JSON.stringify(row);
                return "&nbsp <a href='integratedQuery/customer/query_bigcustomer_info.html?nonRsdtDctId=" +  row["nonRsdtDctId"] + "\'>" + "&nbsp详情"+ "</a>";
            }
        }
    }();


    return {


        discountTypeEditBuilder:function(val){
            var str="";
            if(val==1){
                str ="<select id='discountType' name='discountType' class='form-control select2me'><option value=1 selected>阶梯价格</option><option value=2 >固定价格</option><option value=3 >照付不议</option></select>";
            }else if(val==2) {
                str = "<select id='discountType' name='discountType' class='form-control select2me'><option value=1 >阶梯价格</option><option value=2 selected>固定价格</option><option value=3>照付不议</option></select>";
            }else if(val==3){
                str = "<select id='discountType' name='discountType' class='form-control select2me'><option value=1 >阶梯价格</option><option value=2 >固定价格</option><option value=3 selected>照付不议</option></select>";
            }else{
                str = "<select id='discountType' name='discountType' class='form-control select2me'><option value=1 >阶梯价格</option><option value=2 selected>固定价格</option><option value=3 >照付不议</option></select>";
            }
            return str;
        },

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
        },


        reload:function(){

            $('#divtable').html('');
            var db={
                "cols":"*",
                "froms":"gas_bll_nonrsdt_dct",
                "wheres":"status = '1'",
                "page":true,
                "limit":50
            }
            var global_remap = {
                "discountType":"1:阶梯价格,2:固定价格,3:照付不议",
            }
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    exportxls: {
                        title:"大客户登记",
                        remap:global_remap,
                        hidden:false,
                        ci:{}
                    },
                    //----------------基本restful地址---
                    // restbase: "gasbllnonrsdtdct?query={\"status\":\"1\"}",
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(db)),
                    key_column:"nonRsdtDctId",
                    coldefs:[
                        {
                            col:"customerName",
                            friendly:"大客户名称",
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
                            format:GasModBil.DiscountType,
                            index:5
                        },
                        {
                            col:"qwer",
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
                            nonedit: "noeidt",
                            hidden:false,
                            format:GasModBil.dateFormat,
                            index:11
                        },
                        // {
                        //     col:"createdBy",
                        //     friendly:"创建人",
                        //     hidden:true,
                        //     nonedit:'nosend',
                        //     index:12
                        // },

                        {
                            col:"modifiedTime",
                            friendly:"操作",
                            format:gotoDetail,
                            nonedit: "noeidt",
                            index:13
                        },
                        // {
                        //     col:"modifiedBy",
                        //     friendly:"变更人",
                        //     nonedit:'nosend',
                        //     hidden:true,
                        //     index:12
                        // },
                        {
                            col:"measureFrom1",
                            friendly:"第一阶梯起始量",
                            //format:operateFormat,
                            hidden:true,
                            index:14,
                            validate:"required,onlyNumber,length[0-20]"
                        },
                        {
                            col:"measureTo1",
                            friendly:"第一阶梯结束量",
                            //format:operateFormat,
                            hidden:true,
                            index:15,
                            validate:"required,onlyNumber,length[0-20]"
                        },
                        {
                            col:"price1",
                            friendly:"第一阶梯价格",
                            //format:operateFormat,
                            hidden:true,
                            index:16,
                            validate:"required,money,length[0-20]",
                        },
                        {
                            col:"measureFrom2",
                            friendly:"第二阶梯起始量",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            hidden:true,
                            index:17
                        },
                        {
                            col:"measureTo2",
                            friendly:"第二阶梯结束量",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            index:18,
                            hidden:true
                        },
                        {
                            col:"price2",
                            friendly:"第二阶梯价格",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            hidden:true,
                            index:19
                        },
                        {
                            col:"measureFrom3",
                            friendly:"第三阶梯起始量",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            hidden:true,
                            index:20
                        },
                        {
                            col:"measureTo3",
                            friendly:"第三阶梯结束量",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            hidden:true,
                            index:21
                        },
                        {
                            col:"price3",
                            friendly:"第三阶梯起价格",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            hidden:true,
                            index:22
                        },
                        {
                            col:"measureFrom4",
                            friendly:"第四阶梯起始量",
                            //format:operateFormat,
                            hidden:true,
                            index:23

                        },
                        {
                            col:"measureTo4",
                            friendly:"第四阶梯结束量",
                            //format:operateFormat,
                            hidden:true,
                            index:24
                        },
                        {
                            col:"price4",
                            friendly:"第四阶梯起价格",
                            //format:operateFormat,
                            hidden:true,
                            index:25
                        },
                        {
                            col:"measureFrom5",
                            friendly:"第五阶梯起始量",
                            //format:operateFormat,
                            hidden:true,
                            index:26
                        },
                        {
                            col:"measureTo5",
                            friendly:"第五阶梯结束量",
                            //format:operateFormat,
                            hidden:true,
                            index:27
                        },
                        {
                            col:"price5",
                            friendly:"第五阶梯起价格",
                            //format:operateFormat,
                            hidden:true,
                            index:28
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function(){

                        var whereinfo = "";
                        if ($("#find_customerName").val()) {
                            whereinfo += " customer_name like '%" + $("#find_customerName").val() + "%' and ";
                        }
                        if ($("#find_customerAddress").val()) {
                            whereinfo += " customer_address like '%" + $('#find_customerAddress').val() + "%' and ";
                        }
                        if ($("#find_start_date").val()) {
                            whereinfo += " to_char(treaty_start_time,'yyyy-mm-dd') >= '"+$("#find_start_date").val()+"' and ";
                        }
                        if ($("#find_end_date").val()) {
                            whereinfo += " to_char(treaty_end_time,'yyyy-mm-dd') <= '"+$("#find_end_date").val()+"' and ";
                        }
                       /* //
                        var queryUrl=hzq_rest+"gasbllnonrsdtdct";
                        var querys=new Array()

                        if ($('#find_start_date').val()) {
                            var effectTime = RQLBuilder.condition_fc("treatyStartTime","$lte","to_date('"+ $('#find_start_date').val() +"','yyyy-MM-dd')");
                            querys.push(effectTime);
                        }

                        if ($('#find_end_date').val()) {
                            var effectTimes = RQLBuilder.condition_fc("treatyEndTime","$gte","to_date('"+ $('#find_end_date').val() +"','yyyy-MM-dd')");
                            querys.push(effectTimes);
                        }

                        var status = RQLBuilder.equal('status', '1');
                        querys.push(status);

                        if(querys.length>0){
                            queryUrl += "?query="+RQLBuilder.and(querys).rql();
                        }
*/
                        var db={
                            "cols":"*",
                            "froms":"gas_bll_nonrsdt_dct",
                            "wheres": whereinfo +" status = '1'",
                            "page":true,
                            "limit":50
                        }
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(db)));
                        return "";
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },

                    onUpdated: function(ret,jsondata){
                        xw.setRestURL(hzq_rest+"gasbllnonrsdtdct");
                        return  validateForm(jsondata);
                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
        },
    }
}();