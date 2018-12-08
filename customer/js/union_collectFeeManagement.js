var unionAccount = function () {


    /*var chgAccountIdHelper = RefHelper.create({
        ref_url:"gaschgaccount",
        ref_col:"chgAccountId",
        ref_display:"chgAccountId"
    });*/
    //Format
    var areaHelper = RefHelper.create({
        ref_url: "gasbizarea/?query={\"status\":\"1\"}",
        ref_col: "areaId",
        ref_display: "areaName",
    });
    var areaFormat = function(){
        return {
            f:function(val){
                return areaHelper.getDisplay(val)
            }
        }
    }()
    var chgAccountIdFormat = function () {
        return {
            f : function (val,row) {
                console.log(row)
                if(row.createdBy == JSON.parse(localStorage.getItem("user_info")).userId){
                    return "<a href='customer/union_collectfee_detail.html?" + val + "'>详情</a> <a href='customer/updunion_collectfee.html?" + val + "'>修改</a> " +
                        "<a href='javascript:;' data-chgAccountId='"+row.chgAccountId+"' onclick='deleteunion($(this))'>删除</a>";
                }else{
                    return "<a href='customer/union_collectfee_details.html?" + val + "'>详情</a>";
                }

            }
        }
    }();
    var loginarea = [];
    var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
    GasModSys.areaList({
        "areaId":areaId,
        "cb":function(data){
            console.log(data)
            $.each(data,function(key,val){
                loginarea.push(val.areaId);
                $('#find_unit').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
            })
        }
    });
    console.log()
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
        },
        reload:function(){

            $('#divtable').html('');
            var inputQuery = RQLBuilder.and([
                RQLBuilder.equal("accountType","1"),
                RQLBuilder.equal("status","1"),
                RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea))
            ]).rql();
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
                    restbase: 'gaschgaccount/?query='+inputQuery+'&sort=-createdTime',
                    key_column:'chgAccountId',
                    //---------------行定义
                    coldefs:[

                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaFormat,
                            sorting:false,
                            index:1
                        },
                        {
                            col:"chgAccountNo",
                            friendly:"账户编号",
                            sorting:false,
                            index:1
                        },
                        {
                            col:"accName",
                            friendly:"账户名称",
                            sorting:false,
                            index:2
                        },

                        {
                            col:"linkman",
                            friendly:"联系人",
                            sorting:false,
                            index:3
                        },
                        {
                            col:"linkmanTel",
                            friendly:"联系人电话",
                            sorting:false,
                            index:4
                        },
                        {
                            col:"linkmanPhone",
                            friendly:"联系人手机",
                            hidden:true,
                            sorting:false,
                            index:5
                        },
                        {
                            col:"linkmanUnit",
                            friendly:"联系人单位",
                            sorting:false,
                            hidden:true,
                            index:6
                        },
                        {
                            col:"linkmanPostcode",
                            friendly:"联系人邮编",
                            sorting:false,
                            hidden:true,
                            index:7
                        },
                        {
                            col:"linkmanMail",
                            friendly:"联系人邮箱",
                            sorting:false,
                            hidden:true,
                            index:8
                        },
                        {
                            col:"linkmanAddress",
                            friendly:"联系人地址",
                            sorting:false,
                            hidden:true,
                            index:9
                        },
                        {
                            col:"invoiceName",
                            friendly:"发票抬头",
                            sorting:false,
                            index:9
                        }, {
                            col:"taxpayer",
                            friendly:"纳税人识别号",
                            sorting:false,
                            index:10
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:dateFormat,
                            sorting:true,
                            index:11
                        },
                        {
                            col:"status",
                            friendly:"账户状态",
                            format:GasSysBasic.StatusFormat,
                            sorting:false,
                            index:12
                        },
                        {
                            col:"chgAccountId",
                            friendly:"操作",
                            sorting:false,
                            format:chgAccountIdFormat,
                            index:13
                        }

                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_chgAccountId,createtimefrom,createtimeto,find_chgAccountName,find_linkman,find_linkmanTel,find_linkmanPostcard,find_invoiceName,area_Id,accountStatus;

                        //账户编号（联合收费账户ID）
                        if($('#find_chgAccountId').val())
                        {
                            find_chgAccountId=RQLBuilder.like("chgAccountNo",$('#find_chgAccountId').val());
                        }
                        //账户名称（联合收费账户ID）
                        if($('#find_chgAccountName').val())
                        {
                            find_chgAccountName=RQLBuilder.like("accName",$('#find_chgAccountName').val());
                        }
                        //联系人（联合收费账户ID）
                        if($('#find_linkman').val())
                        {
                            find_linkman=RQLBuilder.like("linkman",$('#find_linkman').val());
                        }
                        //联系人电话（联合收费账户ID）
                        if($('#find_linkmanTel').val())
                        {
                            find_linkmanTel=RQLBuilder.like("linkmanTel",$('#find_linkmanTel').val());
                        }
                        //联系人邮编（联合收费账户ID）
                        if($('#find_linkmanPostcard').val())
                        {
                            find_linkmanPostcard=RQLBuilder.like("linkmanPostcode",$('#find_linkmanPostcard').val());
                        }
                        //发票抬头（联合收费账户ID）
                        if($('#find_invoiceName').val())
                        {
                            find_invoiceName=RQLBuilder.like("invoiceName",$('#find_invoiceName').val());
                        }
                        accountType=RQLBuilder.equal("accountType","1");
                        accountStatus=RQLBuilder.equal("status","1");

                        if($("#find_start_date").val()){
                            createtimefrom = RQLBuilder.condition("createdTime","$gte","to_date('"+ $("#find_start_date").val()+" 00:00:00','yyyy-MM-dd HH24:mi:ss')");
                        }
                        if($("#find_end_date").val()){
                            createtimeto = RQLBuilder.condition("createdTime","$lte","to_date('"+ $("#find_end_date").val()+" 23:59:59','yyyy-MM-dd HH24:mi:ss')");
                        }
                        if($("#find_unit").val()){
                            area_Id = RQLBuilder.equal("areaId",$("#find_unit").val());
                        }else{
                            area_Id = RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea))
                        }

                        var filter=RQLBuilder.and([
                            find_chgAccountId,createtimefrom,createtimeto,find_chgAccountName,find_linkman,find_linkmanTel,find_linkmanPostcard,find_invoiceName,accountType,area_Id,accountStatus
                        ]);

                        xw.setRestURL(hzq_rest + 'gaschgaccount');
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },

                }) //--init
        },


    }

}();

function deleteunion(that){
    chgAccountId = $(that).attr("data-chgAccountId");
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        url: hzq_rest + 'gaschgaccount/?query={"relChgAccountId":"' + chgAccountId + '"}',
        dataType: 'json',
        data: "",
        success: function (data) {
            console.log(data)
            if(data.length){
                bootbox.alert("该联合账户下有用户，不能删除。")
            }else{
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
                    message: "<br><center><h4>确定删除该联合账户吗？</h4></center><br>",
                    callback: function (result) {
                        if(result){
                            var result = Restful.updateRNQ(hzq_rest + "gaschgaccount",chgAccountId,{"status":"3"})
                            if(result.success){
                                bootbox.alert("删除成功。")
                                unionAccount.init();
                            }
                        }else{
                            return false;
                        }
                    }
                });

            }
        }
    })
}
