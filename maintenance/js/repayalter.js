
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;
// 工作人员
var userHelper=RefHelper.create({
    ref_url:'gassysuser?query={"status":"1"}',
    ref_col:"userId",
    ref_display:"employeeName"
});
var userFormat=function(){
    return {
        f: function(val){
            return userHelper.getDisplay(val);
        }
    }
}();
var result =  Restful.findNQ(hzq_rest + 'gascsrcommonbiz/?query={"bizType":"1"}')
console.log(result)
var urldata = [];
var html = "";
if(result.length){
    $.each(result,function(index,item){
        html+="<tr>"
        +"<td>"+JSON.parse(item.bizContent).customerName+"</td>"
        +"<td>"+JSON.parse(item.bizContent).customerCode+"</td>"
        +"<td>"+JSON.parse(item.bizContent).customerAddress+"</td>"
        +"<td>"+JSON.parse(item.bizContent).customerTel+"</td>"
        +"<td>"+JSON.parse(item.bizContent).remark+"</td>"
        +"<td>"+JSON.parse(item.bizContent).repayment+"</td>"
        +"<td><a data-id='"+item.commonbizId+"' class='modify' data-row='"+JSON.stringify(item)+"'>修改</a></td>"
    +"</tr>"
    })
}
$("#tbody").html(html)
$("#tfoot").html("<td>共 "+result.length+" 行</td>")

$("#claimsubmit").on("click",function(){
    console.log("00000")
    var form={};
    var json = {
        customerName:$("#customer_name").val(),
        customerCode:$("#customer_code").val(),
        customerAddress:$("#customer_tel").val(),
        repayment: $("#repayment").val(),
        customerTel:$("#customer_address").val(),
        remark:$("#remark").val()
    }
    var ss =false;
    $.each(json,function(key,val){
        if(key == "customerName" && !val){
            ss = true
            return false;
        }else{
            ss =false
        }
    })
    if(ss){
        bootbox.alert("<center><h4>客户姓名不能为空。</h4></center>")
        return false;
    }
    form["bizType"] = '1'
    form["createdTime"] = new Date(new Date()+"-00:00");
    form["createdBy"] = userId;
    form["modifiedTime"] = new Date(new Date()+"-00:00");
    form["modifiedBy"] = userId;
    form["bizContent"] = JSON.stringify(json);
    console.log(form)
    console.log(json)
    var result = Restful.insert(hzq_rest + "gascsrcommonbiz",form)
    if(result.success){
        bootbox.alert("<center><h4>添加成功。</h4></center>")
        window.location.reload();
    }else{
        bootbox.alert("<center><h4>添加失败。</h4></center>");
        return false;
    }
})
var ids="";
var info={};
$(".modify").on("click",function(){
    ids = $(this).attr("data-id");
    info = JSON.parse($(this).attr("data-row"))
    var row = JSON.parse(JSON.parse($(this).attr("data-row")).bizContent);
    $("#modifys").modal("show");
    $("#customer_name1").val(row.customerName)
    $("#customer_code1").val(row.customerCode)
    $("#repayment1").val(row.repayment)
    $("#customer_address1").val(row.customerAddress)
    $("#customer_tel1").val(row.customerTel)
    $("#remark1").val(row.remark)
})

$("#modifysubmit").on("click",function(){
    console.log(ids)
    console.log(info)
    var jsons = {
        customerName:$("#customer_name1").val(),
        customerCode:$("#customer_code1").val(),
        customerAddress:$("#customer_tel1").val(),
        customerTel:$("#customer_address1").val(),
        remark:$("#remark1").val(),
        repayment:$("#repayment1").val()
    }
    info.bizContent=JSON.stringify(jsons)
    info["modifiedTime"] = new Date(new Date()+"-00:00");
    info["modifiedBy"] = userId;
    var results = Restful.updateNQ(hzq_rest+"gascsrcommonbiz",JSON.stringify(info));
    console.log(results)
    if(results){
        bootbox.alert("<center><h4>修改成功。</h4></center>")
        window.location.reload();
    }else{
        bootbox.alert("<center><h4>修改失败。</h4></center>")
        return false;
    }
})

$("#find_button1").on("click",function(){
    var wheres = "";
    if($("#customerName").val()){
        wheres += "biz_content like '%"+$("#customerName").val()+"%' and "
    }
    if($("#customerCode").val()){
        wheres += "biz_content like '%"+$("#customerCode").val()+"%' and "
    }
    if($("#customerTel").val()){
        wheres += "biz_content like '%"+$("#customerTel").val()+"%' and "
    }
    if($("#customerAddress").val()){
        wheres += "biz_content like '%"+$("#customerAddress").val()+"%' and "
    }

    var bd ={
        "cols":"*",
        "froms":"gas_csr_commonbiz",
        "wheres":wheres + "biz_type='1'",
        "page":false
    }
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(bd),
        dataType: "json",
        success: function (results) {
            if(results && results.rows && results.rows.length){
                var htmls = "";
                $.each(results.rows,function(ind,item){
                    htmls+="<tr>"
                        +"<td>"+JSON.parse(item.bizContent).customerName+"</td>"
                        +"<td>"+JSON.parse(item.bizContent).customerCode+"</td>"
                        +"<td>"+JSON.parse(item.bizContent).customerAddress+"</td>"
                        +"<td>"+JSON.parse(item.bizContent).customerTel+"</td>"
                        +"<td>"+JSON.parse(item.bizContent).remark+"</td>"
                        +"<td><a data-id='"+item.commonbizId+"' class='modify' data-row='"+JSON.stringify(item)+"'>修改</a></td>"
                    +"</tr>"
                })
                $("#tbody").html(htmls)
                $("#tfoot").html("<td>共 "+results.rows.length+" 行</td>")
            }else{
                $("#tbody").html('<tr align="center"><td rowspan="1" colspan="6"><h4>所选条件没有数据。</h4></td></tr>')
                $("#tfoot").html("<td>共 0 行</td>")
            }
        }
    })
})
