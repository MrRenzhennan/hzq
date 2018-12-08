var areaHelper=RefHelper.create({
    ref_url:"gasbizarea",
    ref_col:"areaId",
    ref_display:"areaName"
});
var areaFormat=function(){
    return {
        f: function(val){
            return areaHelper.getDisplay(val);
        }
    }
}();
var lowerProtectionFormat = function(){
    return{
        f:function(val){
            if(val == 1){
                return "低保"
            }else if(val == 2){
                return "低收入"
            }else if(val == 3){
                return "低困（困难家庭）"
            }
        }
    }
}();
var ctmSpecialAction = function () {
    // 供气区域helper
   /* var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName"
    });
    var areaFormat=function(){
        return {
            f: function(val){
                return areaHelper.getDisplay(val);
            }
        }
    }();*/
    var loginarea = [];
    var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
    GasModSys.areaList({
        "areaId":areaId,
        "cb":function(data){
            console.log(data)
            $.each(data,function(key,val){
                loginarea.push(val.areaId);
                $('#find_unit').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
                $('#find_units').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
            })
        }
    });
    return {

        init: function () {
            this.reload();
            this.reload2();
        },

        reload:function(){
            $('#divtable').html('');

            var specificFormat=function(){
                return{
                    f:function(val,row){
                        return "<a href='javascript:;' class = 'cancel' data-id='"+val+"' data-archive='"+row.ctmArchiveId+"'>取消</a>"
                    }
                }
            }()

            var bd = {
                "cols":"a.specific_id,a.social_account,a.customer_code,a.specific_type,b.ctm_archive_id,b.customer_address,b.customer_name,b.area_id",
                "froms":"gas_ctm_specific a left join gas_ctm_archive b on b.customer_code=a.customer_code",
                "wheres":"1=1 and b.area_id in ("+loginarea.join()+") and a.status='1'",
                "page":true,
                "limit":50
            }
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    findbtn: "find_button1",
                    tableId: "tableId",
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: "specificId",
                    //---------------行定义
                    coldefs:[

                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaFormat,
                            index:1
                        },
                          {
                            col:"customerName",
                            friendly:"客户姓名",
                            index:2
                        },
                         {
                            col:"customerCode",
                            friendly:"客户编号",
                            index:3
                        },
                        {
                            col:"socialAccount",
                            friendly:"保障号",
                            index:4
                        },

                        {
                            col:"customerAddress",
                            friendly:"客户地址",
                            index:5
                        },
                        {
                            col:"specificType",
                            format:lowerProtectionFormat,
                            friendly:"特殊用户类型",
                            index:6
                        },
                        {
                            col:"specificId",
                            friendly:"操作",
                            format:specificFormat,
                            index:7
                        }

                    ],
                    findFilter: function(){
                        var whereinfo = "";
                        if ($("#find_unit").val()) {
                            whereinfo += " b.area_id = '" + $("#find_unit").val() + "' and ";
                        }

                        if ($("#find_customerName").val()) {
                            whereinfo += " b.customer_name like  '%" + $("#find_customerName").val() + "%' and ";
                        }
                        if ($("#find_customerAddress").val()) {
                            whereinfo += " b.customer_address like  '%" + $("#find_customerAddress").val() + "%' and ";
                        }
                        if ($("#find_customerCode").val()) {
                            whereinfo += " a.customer_code like '%" + $('#find_customerCode').val() + "%' and ";
                        }

                         if ($("#find_idcardno").val()) {
                            whereinfo += " a.social_account like '%" + $('#find_idcardno').val() + "%' and ";
                         }
                        if ($("#find_specificType").val()) {
                            whereinfo += " a.specific_type = '" + $('#find_specificType').val() + "' and ";
                         }

                        var bd = {
                            "cols":"a.specific_id,a.social_account,a.customer_code,a.specific_type,b.ctm_archive_id,b.customer_address,b.customer_name,b.area_id",
                            "froms":"gas_ctm_specific a left join gas_ctm_archive b on b.customer_code=a.customer_code",
                            "wheres":whereinfo + " b.area_id in ("+loginarea.join()+") and a.status='1'",
                            "page":true,
                            "limit":50
                        }

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }

                })
        },
        reload2:function(){
            $('#divtable1').html('');
            var gasTypeIdFormat =function(){
                return{
                    f:function(val){
                        if(val=="202"){
                            return "居民低保"
                        }else if(val == "203"){
                            return "居民低收入"
                        }else if(val == "204"){
                            return "居民低困难"
                        }
                    }
                }
            }();
            var specificFormats=function(){
                return{
                    f:function(val,row){
                        return "<a href='javascript:;' class = 'cancels' data-id='"+val+"' data-archive='"+row.ctmArchiveId+"'>取消</a>"
                    }
                }
            }()

            var db = {
                "cols":"a.*",
                "froms":"gas_ctm_archive a",
                "wheres":"not exists (select customer_code from gas_ctm_specific b where customer_code= a.customer_code) and a.area_id in ("+loginarea.join()+") and a.gas_type_id in ('202','203','204')",
                "page":true,
                "limit":50
            }
            xws=XWATable.init({
                    divname: "divtable1",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    tableId: "tableId1",
                    findbtn: "find_buttons",
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    // restbase: 'gasctmarchive',
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(db)),
                    key_column: "ctmArchiveId",
                    //---------------行定义
                    coldefs:[

                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaFormat,
                            index:1
                        },
                        {
                            col:"customerName",
                            friendly:"客户姓名",
                            index:2
                        },
                        {
                            col:"customerCode",
                            friendly:"客户编号",
                            index:3
                        },
                        {
                            col:"customerAddress",
                            friendly:"客户地址",
                            index:4
                        },
                        {
                            col:"gasTypeId",
                            format:gasTypeIdFormat,
                            friendly:"用气性质",
                            index:6
                        },
                        {
                            col:"ctmArchiveId",
                            friendly:"操作",
                            format:specificFormats,
                            index:7
                        }

                    ],
                    findFilter: function(){
                        var whereinfo = "";
                        if ($("#find_units").val()) {
                            whereinfo += " a.area_id = '" + $("#find_units").val() + "' and ";
                        }

                        if ($("#find_customerNames").val()) {
                            whereinfo += " a.customer_name like  '%" + $("#find_customerNames").val() + "%' and ";
                        }
                        if ($("#find_customerAddresss").val()) {
                            whereinfo += " a.customer_address like  '%" + $("#find_customerAddresss").val() + "%' and ";
                        }
                        if ($("#find_customerCodes").val()) {
                            whereinfo += " a.customer_code like '%" + $('#find_customerCodes').val() + "%' and ";
                        }

                       var db = {
                            "cols":"a.*",
                            "froms":"gas_ctm_archive a",
                            "wheres":whereinfo + "not exists (select customer_code from gas_ctm_specific b where customer_code= a.customer_code) and a.area_id in ("+loginarea.join()+") and a.gas_type_id in ('202','203','204')",
                            "page":true,
                            "limit":50
                        }

                        xws.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(db)));
                    }

                })
        }


    }
}();

$(document).on("click",".cancel",function(){
    var specific = $(this).attr("data-id");
    var archive = $(this).attr("data-archive");
    bootbox.confirm("<center><h4>确定取消该特殊用户吗?</h4></center>", function(result) {
        if (result === false) {

        } else {
            var submitJson = {
                "sets": [
                    {"txid": "1", "body": {"status":"3","modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId,"modifiedTime":new Date(moment().format("YYYY-MM-DDTHH:mm:ss")+"-00:00")}, "path": "/gasctmspecific/" + specific, "method": "PUT"},
                    {"txid": "2", "body": {"gasTypeId": "20101","lowerProtection":"0","modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId,"modifiedTime":new Date(moment().format("YYYY-MM-DDTHH:mm:ss")+"-00:00")}, "path": "/gasctmarchive/" + archive, "method": "PUT"},
                ]
            }
            console.log(submitJson)
            var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)
            console.log(result)
            if(result.success == false){
                bootbox.alert("<center><h4>取消失败。</h4></center>");
            }else if(result.success == undefined){
                if(result.results[0]["result"]['success']) {
                    bootbox.alert("<center><h4>取消成功。</h4></center>", function () {
                        ctmSpecialAction.reload()
                    });
                }
            }

        }

    })
})
$(document).on("click",".cancels",function(){
    var archive = $(this).attr("data-archive");
    bootbox.confirm("<center><h4>确定取消该特殊用户吗?</h4></center>", function(result) {
        if (result === false) {
        } else {
            var submitJson = {
                "sets": [
                    {"txid": "2", "body": {"gasTypeId": "20101","lowerProtection":"0","modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId,"modifiedTime":new Date(moment().format("YYYY-MM-DDTHH:mm:ss")+"-00:00")}, "path": "/gasctmarchive/" + archive, "method": "PUT"},
                ]
            }
            console.log(submitJson)
            var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)
            console.log(result)
            if(result.success == false){
                bootbox.alert("<center><h4>取消失败。</h4></center>");
            }else if(result.success == undefined){
                if(result.results[0]["result"]['success']) {
                    bootbox.alert("<center><h4>取消成功。</h4></center>", function () {
                        ctmSpecialAction.reload2()
                    });
                }
            }

        }

    })
})


var loginareas = [];
var areaIds = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaIds,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginareas.push("'"+val.areaId+"'");
        })
    }
});


var specificId = [];
var archiveid = [];
var ss;
$(document).on("click","#comparison",function(){
    $(this).button('loading');
    $("#divtable2").html("");
    var bd={
        /*select a.* from gas_ctm_specific a where not exists (select b.social_account from gas_csr_lowincome b where a.social_account=b.social_account)*/
        "cols":"*",
        "froms":"gas_ctm_specific a left join gas_ctm_archive c on c.customer_code = a.customer_code where " +
        "not exists (select b.social_account from gas_csr_lowincome b where a.social_account=b.social_account and b.status='1')" +
        " and a.status='1' and c.area_id in ("+loginareas.join()+")",
        "wheres":"",
        "page":false,
        "limit":50
    }
    $.ajax({
        type: 'get',
        url:  "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            console.log(data)
            if(data.rows){
                $.each(data.rows,function(index,item){
                    specificId.push(item.specificId)
                    archiveid.push(item.ctmArchiveId)
                })
            }

        },
        error: function(err) {}
    });
    var gasTypeIdFormat =function(){
        return{
            f:function(val){
                if(val=="202"){
                    return "居民低保"
                }else if(val == "203"){
                    return "居民低收入"
                }else if(val == "204"){
                    return "居民低困难"
                }
            }
        }
    }();

    ss = XWATable.init(
        {
            divname: "divtable2",
            //----------------table的选项-------
            pageSize: 10,
            columnPicker: true,
            transition: 'fade',
            findbtn: "",
            tableId: "tableId",
            checkboxes: true,
            checkAllToggle: true,
            //----------------基本restful地址---
            restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
            key_column: "specificId",
            //---------------行定义
            coldefs: [

                {
                    col: "areaId",
                    friendly: "供气区域",
                    format: areaFormat,
                    index: 1
                },
                {
                    col: "customerName",
                    friendly: "客户姓名",
                    index: 2
                },
                {
                    col: "customerCode",
                    friendly: "客户编号",
                    index: 3
                },
                {
                    col: "socialAccount",
                    friendly: "保障号",
                    index: 4
                },

                {
                    col: "customerAddress",
                    friendly: "客户地址",
                    index: 5
                },
                {
                    col: "gasTypeId",
                    friendly: "用气性质",
                    format:gasTypeIdFormat,
                    index: 6
                },
                {
                    col: "lowerProtection",
                    format: lowerProtectionFormat,
                    friendly: "特殊用户类型",
                    index: 7
                }
            ],
        })

    $("#comparison_result").modal("show");

})
$("#comparison_result").on("shown.bs.modal",function(){
    $("#comparison").button('reset');
});

$(document).on("click","#cancle",function(){
    $(this).button('loading');
    console.log(specificId)
    console.log(archiveid)
    console.log(0)
    bootbox.confirm({
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
        message: "<br><center><h4>确定要取消特殊用户吗？</h4></center><br>",
        callback:function(result){
            if (!result) {
                $("#cancle").button('reset');
                return;
            }else{
                $.ajax({
                    type: 'put',
                    url: hzq_rest + 'gasctmarchive/'+archiveid.join(),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data:JSON.stringify({"gasTypeId":"20101","lowerProtection":"0"}),
                    async: false,
                    success: function(data) {
                        console.log(data)
                        if(data.success){
                            $.ajax({
                                type: 'put',
                                url: hzq_rest + 'gasctmspecific/'+specificId.join(),
                                dataType: 'json',
                                contentType: "application/json; charset=utf-8",
                                data:JSON.stringify({"status":"3","modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId,"modifiedTime":new Date(moment().format("YYYY-MM-DDTHH:mm:ss")+"-00:00")}),
                                async: false,
                                success:function(data){
                                    console.log(data)
                                    if(data.success){
                                        bootbox.alert("<center><h4>特殊用户取消成功。</h4></center>",function () {
                                            $("#cancle").button('reset');
                                            window.location.reload()
                                        });

                                    }else{
                                        $.ajax({
                                            type: 'put',
                                            url: hzq_rest + 'gasctmarchive/'+archiveid.join(),
                                            dataType: 'json',
                                            contentType: "application/json; charset=utf-8",
                                            data:JSON.stringify({"gasTypeId":"202","lowerProtection":"1"}),
                                            async: false,
                                            success:function(data){
                                                console.log(data)
                                                if(data.success){
                                                    bootbox.alert("<center><h4>特殊用户取消失败。</h4></center>")
                                                    return false;
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }else{
                            $.ajax({
                                type: 'put',
                                url: hzq_rest + 'gasctmarchive/'+archiveid.join(),
                                dataType: 'json',
                                contentType: "application/json; charset=utf-8",
                                data:JSON.stringify({"gasTypeId":"202","lowerProtection":"1"}),
                                async: false,
                                success:function(data){
                                    console.log(data)
                                    if(data.success){
                                        bootbox.alert("<center><h4>特殊用户取消失败。</h4></center>")
                                        return false;
                                    }
                                }
                            })
                        }
                    },
                    error: function(err) {
                        // alert("find all err");
                    }
                });
            }



        }
    })

})