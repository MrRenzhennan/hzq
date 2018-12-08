/**
 * Created by alex on 2017/8/4.
 */
var href = document.location.href;
var refundId = Metronic.getURLParameter("refundId");
var customerCode = Metronic.getURLParameter("code");
console.log(refundId);
console.log(customerCode);
var areaHelper = RefHelper.create({
    ref_url: 'gasbizarea',
    ref_col: "areaId",
    ref_display: "areaName",
});
var userHelper = RefHelper.create({
    ref_url: 'gassysuser/?query={"status":"1"}',
    ref_col: "userId",
    ref_display: "employeeName",
});
var db ={
    "cols":"a.*,b.area_id,b.idcard,b.customer_name,b.tel",
    "froms":"gas_chg_refund a left join gas_ctm_archive b on b.customer_code = a.customer_code",
    "wheres":"b.customer_code = '"+customerCode+"' and a.refund_id='"+refundId+"'",
    "pade":false
}
var examineTime;
$.ajax({
    url:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(db)),
    type:"get",
    async:false,
    success:function(data){
        console.log(data.rows[0])
        var customer = {};

        var str1,str2,str3,str4,str5,str6,str7,str8,str9,str10,str11,str12;

                str1="<tr><td><p style='font-weight: 800'>供气单位：</p><p style='text-align: center'>"+areaHelper.getDisplay(data.rows[0]["areaId"]?data.rows[0]["areaId"]:" &nbsp")+"</p></td>"

                str2="<td><p style='font-weight: 800'>客户名称：</p><p style='text-align: center'>"+(data.rows[0]["customerName"]?data.rows[0]["customerName"]:" &nbsp")+"</p></td>"

                str7="<td><p style='font-weight: 800'>申请人：</p><p style='text-align: center'>"+(data.rows[0]["customerName"]?data.rows[0]["customerName"]:" &nbsp")+"</p></td>"

                str3="<td><p style='font-weight: 800'>客户编号：</p><p style='text-align: center'>"+(data.rows[0]["customerCode"]?data.rows[0]["customerCode"]:" &nbsp")+"</p></td></tr>"

                var refundType = {
                    "1":"燃气费退款",
                    "2":"垃圾费退款"
                    // "3":"垃圾费退款"
                }
                str4="<tr><td><p style='font-weight: 800'>退款类型：</p><p style='text-align: center'>"+refundType[""+(data.rows[0]["refundType"]?data.rows[0]["refundType"]:" &nbsp")+""]+"</p></td>"

                var reservedField1 ={"1":"用户注销","2":"暂停用气"}

                str5="<td><p style='font-weight: 800'>退款原因：</p><p style='text-align: center'>"+reservedField1[""+(data.rows[0]["reservedField1"]?data.rows[0]["reservedField1"]:" &nbsp")+""]+"</p></td>"

                str6="<td><p style='font-weight: 800'>退款金额：</p><p style='text-align: center'>"+(data.rows[0]["money"]?data.rows[0]["money"]:"")+"</p></td></tr>"

                str8="<td><p style='font-weight: 800'>申请人身份证：</p><p style='text-align: center'>"+(data.rows[0]["idcard"]?data.rows[0]["idcard"]:"")+"</p></td>"

                str9="<td><p style='font-weight: 800'>申请人电话：</p><p style='text-align: center'>"+(data.rows[0]["tel"]?data.rows[0]["tel"]:"")+"</p></td></tr>"

                str10="<tr><td><p style='font-weight: 800'>领款银行账号：</p><p  style='text-align: center'>"+(data.rows[0]["bankCardNo"]?data.rows[0]["bankCardNo"]:" &nbsp")+"</p></td>"

                str11="<td><p style='font-weight: 800'>领取人姓名：</p><p style='text-align: center'>"+(data.rows[0]["bankCardName"]?data.rows[0]["bankCardName"]:" &nbsp")+"</p></td>"

                str12="<td><p style='font-weight: 800'>领款银行名称：</p><p style='text-align: center'>"+(data.rows[0]["bankName"]?data.rows[0]["bankName"]:" &nbsp")+"</p></td></tr>"

        var str= str1 + str2 + str3 + str4 +str5  +str6 +str7 +str8+str9 +str10+ str11 +str12;
        // examineTime=data.rows[0]["examineTime"];
        if(data.rows[0]["examineTime"]){
            $(".dayintime").html(data.rows[0]["examineTime"].split("T").join(" "));
        }

        $("#tableDiv").html(str);
    }
})
var queryCondion = RQLBuilder.and([
    RQLBuilder.equal("flowInstId", refundId),
    RQLBuilder.equal("gsEcode", "END"),

]).rql()
var refundflow = Restful.findNQ(hzq_rest + 'psmstepinst/?query='+queryCondion)
console.log(refundflow)/*propstr256*/
if(refundflow.length){
    $("#shenpi").html(refundflow[0].propstr256)
}

var getArea = JSON.parse(localStorage.getItem("user_info"))
console.log(getArea)

$(".areaId").html(areaHelper.getDisplay(getArea.area_id));
$(".userId").html(userHelper.getDisplay(getArea.userId));

$("#prints").on("click",function(){
    // $(".dayintime").html(moment().format('YYYY-MM-DDTHH:mm:ss').split("T").join(" "));

    window.print();
})
$("#cancel").on("click",function(){
    history.go("-1")
})
