/**
 * Created by alex on 2017/4/19.
 */
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var areaId;
var areas = new Array();
var openBach =  function(bId,billTitle){

    bootbox.confirm({
        title: "",
        buttons: {
            confirm: {
                label: '确认',
                className: 'btn-default blue'
            },
            cancel: {
                label: '取消',
                className: 'btn-default'
            }
        },
        message: "<center><h4>是否确认作废？</h4></center>",
        callback: function (result) {
            console.log(result)
            if (result) {
                console.log(bId)
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    async: false,
                    type: 'PUT',
                    data : JSON.stringify({"billState":"9"}),
                    url: hzq_rest+"gascsrworkbill/"+bId,
                    success: function (data) {
                        console.log(data)
                        if(data.success){
                        	var regid=billTitle;
						    var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
						    
						    if(register){
								register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
								register.billState = "4";
								register.modifiedBy = userinfo.userId;
								var ret = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);

							}
                            bootbox.alert("<center><h4>作废成功。</h4></center>",function(){
                                business_dispatchingAction.init()
                            })
                        }else{
                            bootbox.alert("<center><h4>作废失败。</h4></center>")
                        }
                    }
                })
            } else {

            }
        }
    });

};
//分配

function setStartEnd(startdiff,timed){
    $('#find_fromtime').val(moment().add(startdiff,timed).format('YYYY-MM-DD'))
    $('#find_totime').val(moment().format('YYYY-MM-DD'));
}
$('#find_today_sign').on('click',function(e){setStartEnd(0,'d')})
$('#find_this_week_sign').on('click',function(e){setStartEnd(-7,'d')})
$('#find_this_month_sign').on('click',function(e){setStartEnd(-1,'M')})
$('#find_three_month_sign').on('click',function(e){setStartEnd(-3,'M')})
$('#find_this_year_sign').on('click',function(e){setStartEnd(-1,'y')})
$('#find_anyway_sign').on('click',function(e){
    $('#find_fromtime').val("");
    $('#find_totime').val("");
})
// ComponentsPickers.init();
var billTypeEnum = {"WB_LSKS":"零散开栓","WB_HBKS":"换表开栓","WB_CHANGEM":"用户换表","WB_ZJV":"增减容","WB_STOPG":"暂停用气","WB_STOPGCB":"暂停用气拆表","WB_REUSEG":"重新用气","WB_REUSEGZB":"重新用气装表","WB_CHANGEGTM":"用气性质变更换表","WB_CHANGEGT":"用气性质变更","REMOVEM":"拆除"};
var billTypeFormat= function () {
    return {
        f: function (val) {
            return billTypeEnum[val];
        },
    }
}();
var billStateEnum = {"0":"未分配","1":"已分配","2":"已派工","3":"已完成","4":"已审核","6":"审批中","7":"已驳回","8":"已打印","9":"已作废"};
var billStateFormat= function () {
    return {
        f: function (val) {
            return billStateEnum[val];
        },
    }
}();
var business_dispatchingAction = function () {
    var businessTypeHelper = RefHelper.create({
        ref_url: "gascsrbusinesstype",
        ref_col: "businessTypeId",
        ref_display: "name"
    });
    var businessTypeFormat= function () {
        return {
            f: function (val) {
                return businessTypeHelper.getDisplay(val);
            },
        }
    }();

    var detailedInfoFormat = function () {
        return {
            f: function (val,row){
                var bId =row.workBillId;
                var billTitle =row.billTitle;
                var bState =row.billState;
                if(bState == "9"||bState == "6"||bState == "4"){
                    return "";
                }else {
                    return '<a class="pull-right btn btn-sm btn-circle blue" data-toggle="modal" href="#allot" onclick="openBach(\''+bId+'\',\''+billTitle+'\',\''+bState+'\');">作废</a> '

                }

                //return '<a id="todetail" href="customer/inhabitant_open_bolt_detail.html?' + val + '">详情</a>';

            }
        }
    }();
    return {
        init: function () {

            this.reload();
        },

        reload: function () {
        	areaId=userinfo.area_id;
			areas.push(areaId)
			//查询areaId下级areaId
			$.ajax({
				headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
				},
				type: 'get',
				async: false,
				url: hzq_rest+"gasbizarea?query={\"parentAreaId\":\""+areaId+"\"}",
				success: function (data) {
					for(var i=0;i<data.length;i++){
						areas.push(data[i].areaId);
					}
			    } 
			})
            $('#divtable').html('');
            
            
          /*  var xwQuery = RQLBuilder.and([
                // RQLBuilder.equal("ownUnit",user.unitId)
                RQLBuilder.equal("billState",{"$in":"[0,1,2]"})
            ]).rql();*/
            // console.log(xwQuery)
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restbase: 'gascsrworkbill/?sort=billState&query={"areaId":{"$in":'+JSON.stringify(areas)+'}}',
                    key_column: "workBillId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "workBillId",
                            friendly: "工单id",
                            unique: true,
                            hidden:true,
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "billCode",
                            friendly: "受理登记单号",
                            unique: true,
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "bizName",
                            friendly: "业务名称",
                            sorting: false,
                            format:businessTypeFormat,
                            inputsource: "select",
                            index: 5
                        },
                        {
                            col: "billType",
                            friendly: "工单类型",
                            sorting: false,
                            format:billTypeFormat,
                            inputsource: "select",
                            index: 5
                        },{
                            col: "billState",
                            friendly: "工单状态",
                            sorting: false,
                            format:billStateFormat,
                            inputsource: "select",
                            index: 5
                        },
                        {
                            col: "modifiedTime",
                            friendly: "操作",
                            sorting: false,
                            format: detailedInfoFormat,
                            index: 13
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var queryUrl = hzq_rest +"gascsrworkbill";
                        var find_billcode,find_billtype,find_customercode,find_customername,find_fromtime,find_totime,unit_id,billState;
                        var querys = new Array();
                        if ($('#find_billcode').val()) {
                            find_billcode = RQLBuilder.like("billCode", $('#find_billcode').val());
                        }
                        if ($('#find_billtype').val()) {
                            find_billtype = RQLBuilder.equal("billType", $('#find_billtype').val());

                        }
                        if ($('#billState').val()) {
                            billState = RQLBuilder.equal("billState", $('#billState').val());
                        }else{
                            billState = RQLBuilder.condition_fc("billState","$in","[0,1,2]");
                            console.log(billState)
                        }
                        if ($('#find_customercode').val()) {
                            find_customercode = RQLBuilder.like("customerCode", $('#find_customercode').val());
                        }
                        if ($('#find_customername').val()) {
                            find_customername = RQLBuilder.like("customerName", $('#find_customername').val());
                        }

                        if ($('#find_fromtime').val()) {
                            find_fromtime = RQLBuilder.condition("createdTime","$gte","to_date('"+  $('#find_fromtime').val()+" 00:00:00" +"','yyyy-MM-dd HH24:mi:ss')");
                        }
                        if ($('#find_totime').val()) {
                            find_totime = RQLBuilder.condition("createdTime","$lte","to_date('"+  $('#find_totime').val()+" 23:59:59" +"','yyyy-MM-dd HH24:mi:ss')");
                        }

                        // unit_id = RQLBuilder.equal("ownUnit",userinfo.unit_id);

                        var filter=RQLBuilder.and([
                            find_billcode,find_billtype,find_customercode,find_customername,find_fromtime,find_totime,unit_id,billState,RQLBuilder.condition_fc("areaId","$in", JSON.stringify(areas))
                        ]);
                        console.log(filter);
                        xw.setRestURL(hzq_rest + 'gascsrworkbill');
                        return filter.rql();
                    },

                    onAdded: function (ret, jsondata) {

                    },

                    onUpdated: function (ret, jsondata) {

                    },

                    onDeleted: function (ret, jsondata) {
                    },
                }//--init
            );//--end init
        },

    }
}();