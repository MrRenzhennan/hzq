document.write('<meta charset="utf-8"/>')

document.write('<meta http-equiv="X-UA-Compatible" content="IE=edge">')
document.write('<meta content="width=device-width, initial-scale=1" name="viewport"/>')


paceOptions = {
	catchupTime: 20,
    initialRate: .01,
    minTime: 200,
    ghostTime: 100,
    maxProgressPerFrame: 20,
    easeFactor: 1.5,
    startOnPageLoad: true,
    restartOnPushState: true,
    restartOnRequestAfter: 5,
    target: 'body',
    elements: {
      checkInterval: 10,
      selectors: ['body']
    },
    eventLag: {
      minSamples: 10,
      sampleCount: 10,
      lagThreshold: 3
    },
    ajax: {
		trackWebSockets: true,
	     trackMethods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
	}

}


document.write('<script src="assets/global/plugins/pacem/pace.min.js"></script>');


document.write('<link href="assets/global/plugins/pacem/themes/blue/pace-theme-minimal.css" rel="stylesheet" />');

// document.write('<meta content="" name="description"/>')
// document.write('<meta content="" name="author"/>')
// document.write('<!-- BEGIN GLOBAL MANDATORY STYLES -->')
document.write('<link href="assets/fonts/gfonts.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>')
// document.write('<!-- END GLOBAL MANDATORY STYLES -->')
// document.write('<!-- BEGIN PAGE LEVEL PLUGIN STYLES -->')
document.write('<link href="assets/global/plugins/gritter/css/jquery.gritter.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/plugins/fullcalendar/fullcalendar/fullcalendar.css" rel="stylesheet" type="text/css"/>')
// document.write('<!-- END PAGE LEVEL PLUGIN STYLES -->')
// document.write('<!-- BEGIN PAGE STYLES -->')
document.write('<link href="assets/admin/pages/css/tasks.css" rel="stylesheet" type="text/css"/>')
// document.write('<!-- END PAGE STYLES -->')
// document.write('<!-- BEGIN THEME STYLES -->')
document.write('<link href="assets/global/css/components.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/css/plugins.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/admin/layout/css/layout.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/admin/layout/css/themes/default.css" rel="stylesheet" type="text/css" id="style_color"/>')

// document.write('<!-- END THEME STYLES -->')
document.write('<link href="pages/images/favicon1.ico" rel="shortcut icon"/>')
document.write('<script src="assets/global/plugins/jquery-1.11.0.min.js" type="text/javascript"></script>')
document.write('<script src="assets/addons/jquery.include.js" type="text/javascript"></script>')
document.write('<script src="assets/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>')

document.write('<link href="assets/admin/layout/css/typeface.css" rel="stylesheet" type="text/css"/>')

document.write('<link href="assets/global/css/data-select.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/css/input.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/css/add-form.css" rel="stylesheet" type="text/css"/>')
document.write('<link href="assets/global/plugins/icheck/skins/all.css" rel="stylesheet"/>');
document.write('<link href="assets/admin/layout/css/custom.css" rel="stylesheet" type="text/css"/>')
var hzq_rest = "/hzq_rest/";

var global_remap = {"areaId":"db@gas_biz_area,areaId,areaName",
		"chargeUnitId":"db@GAS_BIZ_CHARGE_UNIT,chargeUnitId,chargeUnitName",
		"stationId":"db@GAS_BIZ_STATION,stationId,stationName",
		"unitId":"db@GAS_SYS_UNIT,unitId,unitName",
		"idcardType":"1:营业执照,2:法人身份证,3:房产证,4:租房合同,5:居民身份证",
		"customerType":"P:普表,I:IC卡表",
		"copyType":"60:正常抄表,61:抄表差错新抄表,70:新开栓抄表,72:换表新表抄表,73:错误表读数新表读数,75:客户类型变更上线表抄表,"
                    +"79:调整初始表读数,81:重新用气抄表,82:换表旧表抄表,83:错误表读数旧表读数,88:暂停抄表,89:拆除抄表,87:拆分表户抄表,"
                    +"86:民工互转抄表,84:职工户抄表,85:客户类型变更下线表抄表,8A:置换抄表,I0:清零前抄表,I1:ic卡新开栓抄表,I2:ic卡抄表差错新抄表,"
                    +"I3:ic卡换表新表抄表,I4:ic卡客户类型变更上线表抄表,I5:ic卡重新用气抄表,I6:ic卡换表旧表抄表,I7:ic卡暂停抄表,I8:ic卡拆除抄表,"
                    +"I9:ic卡客户类型变更下线表抄表,IA:清零前抄表,IB:清零后抄表",
        "copyState":"0:新生成,1:下装,2:录入,3:分析中,4:已分析,5:计费中,6:计费完成,E:分析异常,7:开栓,8:办业务计费",
        "gasTypeId":"db@GAS_BIZ_GAS_TYPE,gasTypeId,gasTypeName",
     

}
// 固定siderbar
document.write('<script>$(document).ready(function() {    $(document.body).addClass("page-sidebar-fixed"); });</script>')
