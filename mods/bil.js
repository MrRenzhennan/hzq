

var GasModBil = function() {
	
/*
	var areaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName",bookCode:抄表本号,customerCode:客户编号,customerName:表户名称
customerAddress:用气地址
FFGasModCtm.customerTypeByArhcidFormat@customerType:表类型
copyType:抄表类型,FFGasModMrd.mrdStateFormat@copyState:抄表状态,

FFauditReasonFormat@failedReasons:异常原因,
bllformat@isBll:是否已经计费,
meterReading:燃气表读数,
reviseReading:修正表读数,

    });
    var enumUserStation = {"1":"核算员","2":"抄表员"};*/

    var enumPriceType={"1":"阶梯价格","2":"周期价格"};
    var enumDiscountType={"1":"阶梯价格","2":"固定价格","3":"照付不议"}    //优惠类型 1阶梯价格，2固定价格,3照付不议
    var enumNonrsdtDctCtmStatus={"1":"启用","2":"停用","3":"已删除"}    //状态 1启用 2停用 3已删除
    var enumCustomerKind={"1":"居民","9":"非居民"}
    var enumVipCustomerApply={"1":"审批中","2":"审批通过","3":"审批未通过"}  //状态 1审批中 2审批通过 3审批未通过
    var enumTradeType = {"ICB":"扣划","ICR":"写卡","COR":"冲正"}//交易类型
    var enumApprovalStatus = {"1":"<font color='blue'>审核中</font>","2":"<font color='fuchsia'>审核通过</font>","3":"<font color='green'>审核未通过</font>","9":"<font color='red'>已撤销</font>"}//审核状态枚举 状态 1审批中 2审批通过 3审批未通过 9撤销

    return {
        approvalStatusFormat : {
            f : function (val) {
                return enumApprovalStatus[val];
            }
        },

        TradeTypeFormat : {
            f : function (val) {
                return enumTradeType[val];
            }
        },

        PriceTypeFormat: {
            f: function(val){
                return enumPriceType[val];
            }
        },

        DiscountType: {
            f: function(val){
                return enumDiscountType[$.trim(val)];
            }
        },
        NonrsdtDctCtmStatus: {
            f: function(val){
                return enumNonrsdtDctCtmStatus[$.trim(val)];
            }
        },
        CustomerKind: {
            f: function(val){
                return enumCustomerKind[$.trim(val)];
            }
        },
        VipCustomerApply: {
            f: function(val){
                return enumVipCustomerApply[$.trim(val)];
            }
        },

       // enumBookType: {"0":"非居民","1":"居民"},


        queryGasTypeByParentId: function (gasTypeId) {
            var gasTypeIdItem=[];
            var queryCondion = RQLBuilder.equal("parentTypeId",gasTypeId).rql();
            var queryUrl = Utils.queryURL(hzq_rest+ "gasbizgastype")+'fields={"gasTypeId":1}&query='+queryCondion;
            var queryGasTypeIdObj  =Restful.findNQ(queryUrl);
            $.each(queryGasTypeIdObj,function(idx,row){
                gasTypeIdItem.push(row.gasTypeId) ;
            })
            return  gasTypeIdItem;
        },

        date_format: function  (date,fmt) {
            var dataJson = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in dataJson)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (dataJson[k]) : (("00" + dataJson[k]).substr(("" + dataJson[k]).length)));
            return fmt;
        },

        dateFormat : {
            f: function (val) {
                if(val){
                    var data= val.split("T");
                    var aa=[];
                    for(var i=0;i<data[1].split(":").length;i++){
                        if(i<2){
                            aa.push(data[1].split(":")[i])
                        }
                    }
                    data[1] = aa.join(":");
                    date=data.join(" ");
                    return date;
                }
            }
        },
        RndNum : {
            f: function (val){
                var rnd = "";
                for(var i=0;i<val; i++){
                    rnd += Math.floor(Math.random()*10);
                }
                return rnd;
            }
        },
        measure_price : function (row) {
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
        },


        init: function(xwajson) {



        }

    }
}();