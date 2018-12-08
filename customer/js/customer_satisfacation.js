/**
 * Created by Administrator on 2017/6/17 0017.
 */



//客户档案

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $("select[name=unit]").append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
        })
    }
});


$('#insertId').click(function () {
    var customerCode = $("#customerCode").val();
    var queryCondion = RQLBuilder.and([
        RQLBuilder.equal("customerCode",customerCode),
    ]).rql()
    var queryUrl =  hzq_rest + 'gasctmarchive?fields={}&query='+ queryCondion;

    var ctmResult =  Restful.findNQ(queryUrl)[0];
    var ctmArchiveId,customerName,customerKind,gasTypeId,chargeUnitId,areaId,
        customerAddress,linkMan,linkMantel,bookId;
    if(!ctmResult){
        bootbox.alert("客户不存在");
        return false;
    }
    if(!gpypictureId){
        bootbox.alert("请上传附件");
        return false;
    }
    if(!$("#lookDesc").val()){
        bootbox.alert("客户建议不能为空");
        return false;
    }
    if(!$('#lookBy option:selected').val()){
        bootbox.alert("调查人不能为空");
        return false;
    }
    if(!$("#lookTime").val()){
        bootbox.alert("调查时间不能为空");
        return false;
    }
    var param={
        "lookId":GasModService.getUuid(),
        "customerCode":$("#find_customerCode").val(),
        "fileId":fileId,
        "areaId":ctmResult.areaId,
        "gasTypeId":ctmResult.gasTypeId,
        "customerName":ctmResult.customerName,
        "customerAddress":ctmResult.customerName,
        "createdTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),
        "updatedTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),
        "lookDesc":$("#lookDesc").val(),
        "lookBy":$('#lookBy option:selected').val(),
        "customerTel":ctmResult.linkMantel,
        "lookTime":$("#lookTime").val()

    }

    var radioArray=[];
    $.each($("div[name='radioCheck']") ,function(ind,item){
        // alert(item)
        // alert($(item).find("label input[type='radio']:checked").val());
        if(!$(item).find("label input[type='radio']:checked").val()){
            bootbox.alert($(item).find("label[name='l']").html()+"不能为空");
            return false;
        }

        radioArray.push({
            "lookDetailId":GasModService.getUuid(),
            "lookScore":$(item).find("label input[type='radio']:checked").val(),
            "lookScoreType":$(item).find("label input[type='radio']:checked").val(),
            "createdTime":new Date(new Date()+"-00:00"),
            "updatedTime":new Date(new Date()+"-00:00"),
            "refLookId":"1"
        })

    })
    console.log(radioArray)

    var submitJson;
    submitJson = {"sets":[
        {"txid":"1","body":param,"path":"/gasctmlook/","method":"POST"},
        {"txid":"2","body":radioArray,"path":"/gasctmlookdetail/","method":"POST"}
    ]}
    var submitResult = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson);
    var retFlag=true;

    if(submitResult.success==false){
        retFlag=false;
    }else{
        for(var i=0;i<submitResult.results.length;i++){
            if(!submitResult.results[i].result.success){
                retFlag=false;
                break;
            }
        }
    }

    if(retFlag){
        bootbox.alert("提交成功",function () {
            window.location.href="customer/customer_satisfaction.html"
        });

    }else{
        bootbox.alert("提交失败");
    }
});



//用户helper
var userHelper=RefHelper.create({
    ref_url:"gassysuser",
    ref_col:"userId",
    ref_display:"employeeName",
});

var userHelperFormat=function () {
    return{
        f:function(val){
            return userHelper.getDisplay(val)
        }
    }
}();
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/?query={\"parentTypeId\":\"1\"}",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});

var xw;
var cusSatisfactionAction = function () {
    // 供气区域helper
    var areaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName",
    });
    // 用气性质helper
    var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });


    var areaFormat = function () {
        return {
            f: function (val) {
                return areaHelper.getDisplay(val) == 0 ? "" : areaHelper.getDisplay(val);
            },
        }
    }();

    //Format
    var gasTypeFormat = function () {
        return {
            f: function (val) {
                return gasTypeHelper.getDisplay(val);
            },
        }
    }();



    var detailFormat = function () {
        return {
            f: function (val, row) {
                return "<a  data-target='#meterInfo' id='meterInfo1' ' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>"
            }
        }
    }();


    return {
        init: function () {
            this.initHelper();
            this.reload();
        },

        initHelper: function () {
            $.map(gasTypeHelper.getData(), function (value, key) {
                console.log(key)
                $("select[name=gasType]").append('<option value="' + key + '">' + value + '</option>');
            });
            var areaId = UserInfo.init().area_id;
            var xwQuery = RQLBuilder.and([RQLBuilder.equal("areaId", areaId)]).rql();
            $.ajax({
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                type: 'get',
                async: false,
                url: hzq_rest + 'gassysuser?query=' + xwQuery,
                success: function (data) {
                    console.log(data)
                    if (data.length > 0) {
                        for (var o in data) {
                            $('#lookBy').append('<option value="' + data[o].userId + '">' + data[o].employeeName + '</option>');
                        }
                    }
                }
            })
        },


        reload : function(){
            $('#divtable').html('');
            var bd={
                "cols":"*",
                "froms":"gas_ctm_look a left join (select sum(look_score) score ,look_id from gas_ctm_look_detail b group by look_id) b " +
                " on a.look_id = b.look_id ",
                "wheres":"",
                "page":true,
                "limit":50
            }
            /* rf= RFTable.init(*/
            $('#divtable').html('');
            var gasTypeHelper = RefHelper.create({
                ref_url: "gasbizgastype",
                ref_col: "gasTypeId",
                ref_display: "gasTypeName",
            });
            var gasTypeHelperFormat= function () {
                return {
                    f: function (val) {
                        return gasTypeHelper.getDisplay(val);
                    },
                }
            }();


            // xw=XWATable.init(
            xw = XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize : 10,
                    // pageSize : 200,
                    columnPicker : true,
                    transition : 'fade',
                    checkAllToggle:true,
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    key_column: 'lookId',
                    coldefs:[
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format:areaFormat,
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
                            col: "gasTypeId",
                            friendly: "用气性质",
                            format:gasTypeHelperFormat,
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "lookDesc",
                            friendly: "客户建议",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "lookBy",
                            friendly: "调查人",
                            format:userHelperFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "lookTime",
                            friendly: "完成时间",
                            format:dateFormat,
                            index: 8
                        },

                        {
                            col: "customerTel",
                            friendly: "客户电话",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "score",
                            friendly: "分数",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "lookId",
                            friendly: "详情",
                            format:detailFormat,
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "fileId",
                            friendly: "文件",
                            hidden:true,
                            sorting: false,
                            index: 11
                        }

                    ],
                    // 查询过滤条件
                    findFilter : function(){

                        var customerCode =  $('#customerCode').val();
                        var customerName =  $('#customerName').val();
                        var gasType_select = $('#find_gasTypeId option:selected').val();
                        var areaId_select = $('#find_unit option:selected').val();

                        var whereinfo = "";
                        if (customerCode) {
                            whereinfo +=" customer_code like  '%" + customerCode + "%' and ";
                        }
                        if (customerName) {
                            whereinfo += "customer_name like '%" + customerName + "%' and ";
                        }
                        if (gasType_select) {
                            whereinfo += " gas_type_id = '" + gasType_select + "' and ";
                        }
                        if (areaId_select) {
                            whereinfo += " area_id = '" + areaId_select + "' and ";
                        }


                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += " to_char(a.accept_date,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'and";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }


                        bd={
                            "cols":"*",
                            "froms":"gas_ctm_look a left join （select sum(look_score) score ,look_id from gas_ctm_look_detail b group by look_id） b " +
                            " on a.look_id = b.look_id ",
                            "wheres":whereinfo+ "1=1",
                            "page":true,
                            "limit":50
                        }
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }
                }); // --init

        }

    }

}();
$(document).on('click', "#meterInfo1", function () {
    var dateFormat = function (val) {
        if (val) {
            var date = val.substring(0, 10);
            return date;
        }
    };
    var row = JSON.parse($(this).attr("data-kind"));
    lookId = row.lookId;
    $("#customerCode1").val(row.customerCode);
    $("#customerName1").val(row.customerName);
    $("#customerAddress1").val(row.customerAddress);
    $("#lookDesc1").val(row.lookDesc);
    $("#lookTime1").val(row.lookTime.substring(0, 10));
    $("#lookBy1").val(row.lookBy);
    if(row.fileId){
        pic(row.fileId);
    }


//item helper
var itemHelper=RefHelper.create({
    ref_url:"gasctmlookitem",
    ref_col:"itemId",
    ref_display:"itemName",
});
    $.ajax({
        url: hzq_rest + 'gasctmlookdetail?query={"refLookId":"' + row.lookId + '"}',
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data)
            if (data.length) {
                itemHelper.getDisplay(data[0].itemId)
               for(var i=0;i<data.length;i++){
                   $.each($("#meterInfo label") ,function(ind,item){
                       if($(item).html() == itemHelper.getDisplay(data[i].itemId)){
                           $(item).parent().find(":radio[value='"+data[i].lookScore+"']").prop("checked", "checked");

                       }

                   })
               }

            }
        }
    });
});
