var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;

GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            $('#find_areaId').append('<option value="' + val.areaId+ '" name="' +val.areaId + '">' + val.areaName + '</option>');
        })
    }
});

var areaHelper=RefHelper.create({
    ref_url:'gasbizarea/?query={"status":"1"}',
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
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
var gasTypeHelperFormat= function () {
    return {
        f: function (val) {
            return gasTypeHelper.getDisplay(val);
        },
    }
}();
// 网点helper
var chargeUnitHelper=RefHelper.create({
    ref_url:"gasbizchargeunit",
    ref_col:"chargeUnitId",
    ref_display:"chargeUnitName"
});
var chargeUnitFromat=function(){
    return {
        f: function(val){
            return chargeUnitHelper.getDisplay(val);
        }
    }
}();
var userHelper=RefHelper.create({
    ref_url:"gassysuser",
    ref_col:"userId",
    ref_display:"employeeName"
});
var userFromat=function(){
    return {
        f: function(val){
            return userHelper.getDisplay(val);
        }
    }
}();
var shunjiacharge = function(){
    //供气区域helper
    
    return {
        init:function(){
            this.reload()
        },
        reload:function(){
            var wheres= "";
            if(areaId == "1"){
                wheres+=""
            }else{
                wheres += "a.area_id='"+areaId+"' and "
            }
            var bd ={
                "cols":"b.*,a.customer_name,a.fee_type",
                "froms":"gas_chg_gas_detail a inner join gas_act_gasfee_atl b on a.trade_id = b.gasfee_atl_id",
                "wheres":wheres+ " b.trade_type_desc = 'ICSJCHG' and a.status='1' order by b.trade_date desc",
                "page":true,
                "limit":50
            }
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
                            col: "areaId",
                            friendly: "供气区域",
                            format:areaHelperFormat,
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类型",
                            format:function(){
                                return{
                                    f:function(val){
                                        if(val == "1"){
                                            return "居民"
                                        }else{
                                            return "非居民"
                                        }
                                    }
                                }
                            }(),
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "userId",
                            friendly: "营业员",
                            sorting: false,
                            format:userFromat,
                            index: 5
                        },
                        {
                            col: "chargeUnitId",
                            friendly: "营业网点",
                            format:chargeUnitFromat,
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质",
                            format:gasTypeHelperFormat,
                            sorting: false,
                            index: 7
                        },
                        
                        {
                            col: "feeType",
                            friendly: "表类别",
                            format:function(){
                                return{
                                    f:function(val){
                                        if(val == "0"){
                                            return "IC卡表"
                                        }else{
                                            return "普表"
                                        }
                                    }
                                }
                            }(),
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "price",
                            friendly: "价格",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "priceVersion",
                            friendly: "价格版本",
                            sorting: false,
                            index: 10
                        },

                        {
                            col: "tradeDate",
                            friendly: "交易时间",
                            format:function(){
                                return{
                                    f:function(val){
                                        if(val){
                                            return val.split("T").join(" ")
                                        }else{
                                            return ""
                                        }
                                    }
                                }
                            }(),
                            sorting: false,
                            index: 11
                        },

                    ],
                    // 查询过滤条件
                    findFilter : function(){
                        var sql= " 1=1 ";

                        if ($('#find_customerCode').val()) {
                            sql+=" and a.customer_code='"+$('#find_customerCode').val()+"'";
                        }
                        if ($('#find_customerName').val()) {
                            sql+=" and a.customer_name like '%"+$('#find_customerName').val()+"%'";
                        }
                       
                        if($('#find_areaId').val())
                        {
                            // find_area=RQLBuilder.equal("areaId",$('#find_unit').val());
                            sql += " and a.area_id = '"+$('#find_areaId').val()+"' " 
                        }else{
                            // find_area =RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                            sql += " and a.area_id='"+areaId+"' "
                        }

                        if ($("#find_customerKind").val()) {
                            sql+= " and b.customer_kind = '"+$("#find_customerKind").val()+"'"
                        }
                        

                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            sql += " and to_char(b.trade_date,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }


                        var bd ={
                            "cols":"b.*,a.customer_name",
                            "froms":"gas_chg_gas_detail a inner join gas_act_gasfee_atl b on a.trade_id = b.gasfee_atl_id",
                            "wheres":sql+ " and b.trade_type_desc = 'ICSJCHG' and a.status='1' order by b.trade_date desc",
                            "page":true,
                            "limit":50
                        }

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }
                }); // --init

        }
    }
}()