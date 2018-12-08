/**
 * Created by alex on 2017/4/17.
 */
// ComponentsPickers.init();
SideBar.init();
// SideBar.activeCurByPage("business_process.html");
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var customerAddress;
var customerName;
var customerKind;
var customerTel;
var occurrencetime;
var idcard;
var opertor;
var pid;
var linkman;
var linktel;
var remark;
var bookingtime;
var filesid;
var badType = window.location.search.split("?")[1];
console.log(badType)
$("#submit_btn").on('click', function () {
    var data = xw.getTable().getData(true);
    console.log(data)
    if (!data.rows.length) {
        data = xw.getTable().getData();
        if (!data.rows.length || data.rows.length > 1) {
            bootbox.alert("请选择一个客户！");
            return;
        }
    }

    var results = Restful.findNQ(hzq_rest+'gasactbadatl/?query={"customerCode":"'+data.rows[0].customerCode+'"}');
    var resultlength = false;
    var ssss = false;

    if(badType == "1"){
        if(results.length){
            $.each(results,function(index,item){
                if(item.status == "1" && item.wfStatus != "2" && item.badType=="1"){
                    resultlength = true;
                }else if(item.status == "1" && item.wfStatus != "2" && item.badType=="2"){
                    ssss = true;
                }else{
                    resultlength = false;
                    ssss = false;
                }
            })
    
        }
        
    }
    if(badType == "2"){
        if(results.length){
            $.each(results,function(index,item){
                if(item.status == "1" && item.wfStatus != "2" && item.badType=="2"){
                    ssss = true;
                }else{
                    ssss = false;
                }
            })
        }else{
            bootbox.alert("<center><h4>该客户不是是呆帐客户不能申请坏帐。</h4></center>")
            return false;
        }
        
    }
    
    if(resultlength){
        bootbox.alert("<center><h4>该客户已经是呆帐。</h4></center>")
        return false;
    }
    if(ssss){
        bootbox.alert("<center><h4>该客户已经是坏帐。</h4></center>")
        return false;
    }


    if (gpypictureId) {
        filesid = fileId;
    } else {
        filesid = "";
    }
    var uuid = $.md5(JSON.stringify(data) + new Date().getTime());

    var badatl={
        "money":$(gasBalance).html(),
        "customerCode":data.rows[0].customerCode,
        "customerName":data.rows[0].customerName,
        "customerKind":data.rows[0].customerKind,
        "gasTypeId":data.rows[0].gasTypeId,
        "areaId":data.rows[0].areaId,
        "createdTime":new Date(new Date()+"-00:00"),
        "modifiedTime":new Date(new Date()+"-00:00"),
        "createdBy":userinfo.userId,
        "modifiedBy":userinfo.userId,
        "wfId":uuid,
        "fileId":filesid,
        "badType":badType,
        "wfStatus":"0",
        "remark":$("#find_remark").val(),
        "badAtlId":uuid
    }

    console.log(badatl)
    flowjson = {
        "flow_def_id":"DZSQ",
        "ref_no":uuid,
        "be_orgs":userinfo.area_id,
        "operator":userinfo.userId,
        "flow_inst_id":uuid,
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":data.rows[0].customerName+"("+data.rows[0].customerCode+")",
        "propstr128":"营业部",
        "propstr2048":JSON.stringify(badatl)
    }

    console.log(flowjson)
    var badatl_result = Restful.insert(hzq_rest+"gasactbadatl",badatl);
    if(badatl_result.success){
        var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
        console.log("flow_result:"+JSON.stringify(flowjson));
        console.log("flow_result:"+JSON.stringify(flow_result));
        if(flow_result.retmsg == "SUCCESS:1"){
            
            bootbox.alert("<br><center><h4>流程提交成功</h4></center><br>",function(){
                history.go("-1")
            })
        }else{
             var ss = Restful.delByIDR(hzq_rest + "/gasactbadatl",uuid);
             bootbox.alert("<br><center><h4>流程提交失败</h4></center><br>")
        }
    }
    
});


$("#go_back").on("click",function(){
    history.go("-1")
})  