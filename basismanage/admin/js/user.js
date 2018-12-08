
var xw ;

$("#find_area").on("change",function(){
    $('#find_unit').html("<option value=''>请选择</option>").trigger("change")
    var station = $(this).val();
    console.log(station)
    var restatus = Restful.findNQ(hzq_rest + 'gassysunit/?query={"areaId":"'+station+'"}');
    console.log(restatus)
    $.each(restatus,function(index,row){
        $('#find_unit').append('<option value="'+row.unitId+'" name="'+row.areaId+'">'+row.unitName+'</option>');
    })
})




var UserAction = function () {
    //供气区域helper
    var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName"
    });

    // 单位helper
    var unitHelper=RefHelper.create({
        ref_url:"gassysunit",
        ref_col:"unitId",
        ref_display:"unitName"
    });

    // 岗位helper
    var stationHelper=RefHelper.create({
        ref_url:"gasbizstation",
        ref_col:"stationId",
        ref_display:"stationName"
    });

    // 网点helper
    var chargeUnitHelper=RefHelper.create({
        ref_url:"gasbizchargeunit",
        ref_col:"chargeUnitId",
        ref_display:"chargeUnitName"
    });
    var areaFormat=function(){
        return {
            f: function(val){
                return areaHelper.getDisplay(val);
            }
        }
    }();

    var unitFormat=function(){
        return {
            f: function(val){
                return unitHelper.getDisplay(val);
            }
        }
    }();

    var stationFormat=function(){
        return {
            f: function(val){
                return stationHelper.getDisplay(val);
            }
        }
    }();

    var chargeUnitFromat=function(){
        return {
            f: function(val){
                return chargeUnitHelper.getDisplay(val);
            }
        }
    }();

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
            // this.initUnitTree();
        },

        initHelper:function(){
          /*  // 单位 select init
            $.map(unitHelper.getData(), function(value, key) {
                $('#find_unit').append('<option value="'+key+'">'+value+'</option>');
            });*/
            //岗位
            $.map(stationHelper.getData(), function(value, key) {
                $('#find_station').append('<option value="'+key+'">'+value+'</option>');
            });
        },


        reload:function(){
            var loginarea = [];
            var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
            GasModSys.areaList({
                "areaId":areaId,
                "cb":function(data){
                    console.log(data)
                    $.each(data,function(key,val){
                        loginarea.push(val.areaId);
                        $('#find_area').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
                    })
                }
            });
           /* var queryCondion = RQLBuilder.and([
                RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea)),
                RQLBuilder.equal("status","1"),
            ]).rql()
            var unitHelper=RefHelper.create({
                ref_url:"gassysunit/?query="+queryCondion,
                ref_col:"unitId",
                "sort":"unitCode",
                ref_display:"unitName"
            });
// console.log(unitHelper.getRawData())
            $.each(unitHelper.getRawData(), function(idx, row) {

                $('#find_unit').append('<option value="'+row.unitId+'" name="'+row.areaId+'">'+row.unitName+'</option>');

            });*/

            var useridFormat = function () {
                return {
                    f: function (val,row) {
                        if(row.status == '1'){
                            return "<a id='passWord' data-target='#input_many_modal' data-toggle='modal' data-id='"+row.userId+"'>重置密码</a> <a id='userRole' data-target='#input_many_modal1' data-toggle='modal' data-id='"+row.userId+"'>配置角色</a> ";
                        }else{
                            return " ";
                        }
                    }
                }
            }();

            $('#divtable').html('');
            var queryCondion = RQLBuilder.and([
                RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea)),
                RQLBuilder.equal("status","1"),
            ]).rql()
            // console.log(queryCondion)
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
                    restbase: 'gassysuser?query='+queryCondion,
                    key_column:'userId',
                    exportxls:{
                        title:"用户列表"
                    },
                    coldefs:[
                        {
                            col:"userId",
                            friendly:"用户ID",
                            unique:"true",
                            hidden:"hidden",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"employeeCode",
                            friendly:"工作人员代码",
                            validate:"required",
                            index:2
                        },
                        {
                            col:"employeeName",
                            friendly:"工作人员姓名",
                            validate:"required",
                            index:3
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            inputsource:"select",
                            ref_url:'gasbizarea?query={"status":"1"}',
                            ref_name:"areaName",
                            ref_value:"areaId",
                            validate:"required",
                            format:areaFormat,
                            index:4
                        },
                        {
                            col:"chargeUnitId",
                            friendly:"营业网点",
                            inputsource:"select",
                            format:chargeUnitFromat,
                            ref_url:"gasbizchargeunit",
                            ref_name:"chargeUnitName",
                            ref_value:"chargeUnitId",
                            // validate:"required",
                            index:5
                        },
                        {
                            col:"unitId",
                            friendly:"单位",
                            inputsource:"select",
                            validate:"required",
                            format:unitFormat,
                            ref_url:  "gassysunit",
                            ref_name: "unitName",
                            ref_value: "unitId",
                            index:6
                        },
                        {
                            col:"stationId",
                            friendly:"岗位",
                            inputsource:"select",
                            validate:"required",
                            format:stationFormat,
                            ref_url:"gasbizstation",
                            ref_value:"stationId",
                            ref_name:"stationName",
                            index:7
                        },
                        {
                            col:"loginName",
                            friendly:"登录用户名",
                            validate:"required",
                            index:8
                        },
                        {
                            col:"password",
                            friendly:"密码",
                            validate:"required",
                            // nonedit:"nosend",
                            readonly:"readonly",
                            hidden:true,
                            index:9
                        },
                        {
                            col:"tel",
                            friendly:"电话",
                            hidden:true,
                            index:10
                        },

                        {
                            col:"mobile",
                            friendly:"用户手机",
                            hidden:true,
                            index:11
                        },
                        {
                            col:"email",
                            friendly:"邮箱",
                            hidden:true,
                            index:12
                        },
                        {
                            col:"address",
                            friendly:"用户办公地址",
                            hidden:true,
                            index:13
                        },
                        {
                            col:"isLogin",
                            friendly:"是否可登录",
                            format:GasSysBasic.IsOrNoFormat,
                            inputsource: "custom",
                            inputbuilder: "isLoginBuilder",
                            validate:"required",
                            hidden:true,
                            index:14
                        },
                        {
                            col:"remark",
                            friendly:"备注",
                            hidden:true,
                            index:15
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            format:GasSysBasic.StatusFormat,
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            hidden:false,
                            index:15
                        },

                        {
                            col:"userId_op",
                            friendly:"操作",
                            nonedit:"nosend",
                            format:useridFormat,
                            index:16
                        }/*,
                        {

                            friendly:"角色授权",
                            nonedit:"nosend",
                            format:userrulerFormat,
                            index:17
                        }*//*,
                        {
                            col:"createdBy",
                            friendly:"添加人",
                            nonedit: "nosend",
                            hidden:true,
                            index:16
                        },
                        {
                            col:"createTime",
                            friendly:"添加时间",
                            nonedit: "nosend",
                            hidden:true,
                            index:17
                        },
                        {
                            col:"modifiedBy",
                            friendly:"修改人",
                            nonedit: "nosend",
                            hidden:true,
                            index:18
                        },
                        {
                            col:"updateTime",
                            friendly:"变更时间",
                            nonedit: "nosend",
                            hidden:true,
                            index:19
                        }*/
                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        if($("#status").val() == "3"){
                            $("#mrd_del_btm").hide()
                        }else{
                            $("#mrd_del_btm").show()
                        }

                        var find_unit,find_username,find_station,find_loginname;

                        if($('#find_unit').val())
                        {
                            find_unit=RQLBuilder.equal("unitId",$('#find_unit').val());
                        }

                        if($('#find_username').val())
                        {
                            find_username=RQLBuilder.like("employeeName",$('#find_username').val());
                        }
                        if($('#find_loginname').val())
                        {
                            find_loginname=RQLBuilder.like("loginName",$('#find_loginname').val());
                        }
                        if($('#find_station').val())
                        {
                            find_station=RQLBuilder.equal("stationId",$('#find_station').val());
                        }
                        if($("#status").val()){
                            status =RQLBuilder.equal("status",$("#status").val());
                        }else{
                            status =RQLBuilder.equal("status","1");
                        }
                        if($("#find_area").val()){
                            find_area = RQLBuilder.equal("areaId",$("#find_area").val());
                        }else{
                            find_area =RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        }

                        var filter=RQLBuilder.and([
                            find_unit ,find_station, find_username,find_loginname,status,find_area
                        ]);

                        xw.setRestURL(hzq_rest + 'gassysuser');
                        return filter.rql();
                    },

                    onAdded: function(a,jsondata){

                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        console.log(jsondata)
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){
                    },
                })
        }
    }
}();

$(document).on("click","#passWord",function(){

    $(".modal-body").find("#prefix_860037789915").remove()
    $("#userId").val($(this).attr("data-id"));

    $("#passwords").val();
})
$(document).on('click',"#confirm",function(){
    var userId = $("#userId").val();
    if($("#passwords").val() == ""){
        bootbox.alert("<center><h4>密码不能为空。</h4></center>")
        return false;
    }
    var password = $.md5($("#passwords").val());
    console.log(password)
    var form = {};
    form["password"] = password;
    $.ajax({
        url:hzq_rest + "gassysuser/"+userId,
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type:"PUT",
        dateType:"json",
        data:JSON.stringify(form),
        success:function(data){
            console.log(data)
            if(data.success){
                bootbox.alert("密码修改成功",function(){
                    $("#userId").val("");
                    $("#passwords").val("");
                })
            }else {
                bootbox.alert("密码修改失败。")
            }
        }
    })
})

$(document).on("click","#upd_button",function(){
    $("#dg_password").hide()
    $("#password").attr("disabled","disabled");
    $("#areaId").attr("disabled","disabled");
})
//回显
var huixian;

$(document).on("click","#userRole",function(){
   /* $('#find_userroleId').html("");
    $('#find_userroleId').val("");
    $("#s2id_find_userroleId .select2-search-choice").remove();*/

    $("#menuRole").html("")
    $("#spRole").html("")

    var userid = $(this).attr("data-id");
    console.log(userid);
    var user = Restful.getByID(hzq_rest+"gassysuser",userid);
    $("#userName").val(user.employeeName)
    $("#userName").attr("userId",userid);
    /*var roleHelper = RefHelper.create({
        ref_url: "gassysrole",
        ref_col: "roleId",
        ref_display: "roleName"
    });
    $.map(roleHelper.getData(), function (value, key) {
        $('#find_userroleId').append('<option value="' + key + '">' + value + '</option>');
    });*/

    var bd={
        "cols":"*",
        "froms":"gas_sys_role",
        "wheres":"1=1 order by roleCode asc",
        "page":false
    }
    $.ajax({
        type: 'get',
        url:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            console.log(data.rows)
            if(data.rows){
                $.each(data.rows,function(index,item){
                    if(item.roleType =="1"){
                        $("#menuRole").append('<li style="display: inline-block;width: 16%; line-height: 30px;"><input name="rolemenu" style="margin-right: 10px;" id="'+item.roleId+'" type="checkbox">'+item.roleName+'</li>')
                    }else if(item.roleType =="2"){
                        $("#spRole").append('<li style="display: inline-block;width: 16%; line-height: 30px;"><input name="rolemenu"  style="margin-right: 10px;" id="'+item.roleId+'" type="checkbox">'+item.roleName+'</li>')
                    }
                })
            }
        },
        error: function(err) {
            // alert("find all err");
        }
    });

  /*  var menurole = Restful.findNQ(hzq_rest+"gassysrole")
    console.log(menurole)
    console.log($(".checkRoleMenu input[type='checkbox']"))*/

    $.ajax({
        type: 'get',
        url: hzq_rest+'gassysuserrole/?query={"userId":"'+userid+'"}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            var userroleId = [];
            console.log(data);
            huixian = data;
            $.each(data,function(index,item){
                // userroleId.push(item.roleId);
                $(".checkRoleMenu input[id='"+item.roleId+"']").attr("checked",true);
            })
            // console.log(userroleId)
            // $('#find_userroleId').val(userroleId).trigger("change")
        },
        error: function(err) {
            // alert("find all err");
        }
    });

})

$("#find_fresh").on("click",function(){
     $(".checkRoleMenu input").attr("checked",false);
    $.each(huixian,function(index,item){
        $(".checkRoleMenu input[id='"+item.roleId+"']").attr("checked",true);
    })
})


$(document).on("click","#rule_submit",function(){
    var userId = $("#userName").attr("userId");
    var roleId =[];
    var input = $(".checkRoleMenu input[name='rolemenu']:checked");
    // $("#2c91808200000012015d8f44e3f93311")
    $.each(input,function(index,item){
        // console.log($(item).attr("id"))
        roleId.push($(item).attr("id"))
    })

    // var roleId = $('#find_userroleId').val();
    // var userId = $("#userName").attr("userId");
    // console.log(roleId);
    // console.log(userId);
    $.ajax({
        type: 'get',
        url: hzq_rest+'gassysuserrole/?query={"userId":"'+userId+'"}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            $.each(data,function(index,item){
                 Restful.delByIDR( hzq_rest + "gassysuserrole",item.userRoleId)
            })
        },
        error: function(err) {
            // alert("find all err");
        }
    });


    if(roleId){
        var userrole = {"userId":userId}
        var succ;
        for(var i=0;i<roleId.length;i++){
            userrole["roleId"] = roleId[i];
            succ = Restful.postData( hzq_rest + "gassysuserrole",JSON.stringify(userrole))
        }
        if(succ){
            bootbox.alert("角色配置成功！")
        }else{
            bootbox.alert("角色配置失败！")
        }

    }
})

//供气区域营业网点联动
$(document).on('change',"#areaId",function(){
    $('#chargeUnitId').html("<option value=''>请选择</option>").trigger("change");
    $('#unitId').html("<option value=''>请选择</option>").trigger("change");
    console.log($(this).val());
    var chargeUnitHelper=RefHelper.create({
        ref_url:'gasbizchargeunit/?query={"areaId":"'+$(this).val()+'"}',
        ref_col:"chargeUnitId",
        ref_display:"chargeUnitName"
    });
    $.map(chargeUnitHelper.getData(), function(value, key) {
        $('#chargeUnitId').append('<option value="'+key+'">'+value+'</option>')
    });
    var restatus = Restful.findNQ(hzq_rest + 'gassysunit/?query={"areaId":"'+$(this).val()+'"}');
    console.log(restatus)

    $.each(restatus,function(index,row){
        $('#unitId').append('<option value="'+row.unitId+'">'+row.unitName+'</option>');
    })

    // .html(str)
    // console.log(0)
});


$('#mrd_del_btm').on('click',function(e){
    var selrows = xw.getTable().getData(true);
    console.log(selrows)
    if (selrows.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择需要删除的行</h4></center><br>");
        return;
    }
    var batchids=new Array();
    $.each(selrows.rows,function(idx,row){
        console.log(row)
        if(row.status!='3')
        {
            batchids.push(row.userId);
        }else{
            bootbox.alert("<center><h4>该人员已经是删除状态。</h4></center>")
            return false;
        }
    })
    console.log(batchids)
    if(batchids.length==selrows.rows.length){
        var box = bootbox.confirm({
            // title: "删除未抄表记录",
            buttons: {
                confirm: {
                    label: '确认',
                    className: 'blue'
                },
                cancel: {
                    label: '取消',
                    className: 'btn-default'
                }
            },
            message: "<br><center><h4>确定删除选择（" + selrows.rows.length + "）条记录吗？</h4></center><br>",
            callback: function (result) {
                if(result){

                    var result = Restful.updateRNQ(hzq_rest+"gassysuser", batchids.join(','),{status:'3',"modifiedTime":new Date(moment().format("YYYY-MM-DDTHH:mm:ss")+"-00:00"),"modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId})
                    console.log(result)
                    if(result&&result.success){
                        bootbox.alert("<br><center><h4>删除成功：共删除("+result.retObj+")条</h4></center><br>");
                        xw.update();
                    }else{
                        bootbox.alert("<br><center><h4>删除失败。</h4></center><br>")
                    }
                }
            }
        });
    }
});
/*
var loginnamestatus = false;
$(document).on('click',"#add_button",function(){

    loginnamestatus = true;
})
$(document).on('click',"#upd_button",function(){
    loginnamestatus = false;
})
*/

/*$(document).on("blur","#loginName",loginname)
//
function loginname(){
    console.log($(this).val())
    if(loginnamestatus){
        var login = Restful.findNQ( hzq_rest + 'gassysuser/?query={"loginName":"'+$(this).val()+'"}');
        console.log(login)
        if(login.length){
            bootbox.alert("<center><h4>系统已有该登录用户名。</h4></center>")
            return false;
        }
    }


}*/
/*
$(document).on("blur","#password",mima)
function mima(){
    if(loginnamestatus) {
        if ($(this).val() == "") {
            bootbox.alert("<center><h4>请输入密码。</h4></center>")
            return false;
        }
    }
}*/
