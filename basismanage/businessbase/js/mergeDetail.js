/**
 * Created by anne on 2017/6/14.
 */

var href = document.location.href;
var hrefValue = href.split("?");
var mergeId = hrefValue[1];

SideBar.init();
SideBar.activeCurByPage("basismanage/businessbase/norsdtmerge_register.html");
var mergeDetailAction= function () {
    var user = JSON.parse(localStorage.getItem("user_info"));
    var loginName;
    if(user.employee_name){
        loginName =user.employee_name;
    }else{
        loginName = UserInfo.userId();
    }
    return {
        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initAction();
        },
        initAction:function () {
            $('#save_all').click(function () {
                var customerCode = $("#find_key").val()
                var queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("customerCode",customerCode),
                ]).rql()
                var queryUrl =  hzq_rest + 'gasctmarchive?fields={}&query='+ queryCondion;
                var queryCondion1 = RQLBuilder.and([
                    RQLBuilder.equal("userId",UserInfo.userId()),
                ]).rql()
                // var queryUnitUrl =  hzq_rest + 'gassysuser?fields={}&query='+ queryCondion1;

                var ctmResult =  Restful.findNQ(queryUrl)[0];
                // var unitResult = Restful.findNQ(queryUnitUrl)[0];
                var ctmArchiveId,customerName,customerKind,gasTypeId,chargeUnitId,areaId,
                    customerAddress,linkMan,linkMantel,bookId;
                if(!ctmResult){
                    bootbox.alert("客户不能空！");
                    return false;
                }else{
                    ctmArchiveId = ctmResult.ctmArchiveId;
                    customerName = ctmResult.customerName;
                    customerKind = ctmResult.customerKind;
                    gasTypeId = ctmResult.gasTypeId;
                    customerAddress = ctmResult.customerAddress;
                    linkMan = ctmResult.linkMan;
                    linkMantel = ctmResult.linkMantel;

                }



                var mergeDetail ={};
                mergeDetail.mergeDetailId = GasModService.getUuid();
                mergeDetail.mergeId = mergeId;
                mergeDetail.customerCode = $("#find_key").val();
                mergeDetail.status="1";
                mergeDetail.createdTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
                mergeDetail.createdBy = UserInfo.userId();;
                mergeDetail.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
                mergeDetail.modifiedBy = UserInfo.userId();;

                var result = Restful.insert(hzq_rest + "gasctmarchivemergedetail", mergeDetail)
                if (result['success']) {
                    bootbox.alert("保存成功",function () {
                        window.location.href="basismanage/businessbase/norsdtmerge_register.html"
                    });
                } else{

                    bootbox.alert("保存失败");
                }

            });
            $('#reback_btn').click(function () {
                window.location.href="basismanage/businessbase/norsdtmerge_register.html"
            });
        }


    }
}()





