ComponentsPickers.init();
var xw;
var sysUserHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "employeeName",
});
var sysUserFormat = function () {
    return {
        f: function (val) {
            return sysUserHelper.getDisplay(val);
        }
    }
}();
var dateForat = function(){
    return {
        f: function (val) {
            if(val){
                var data= val.split("T");
                var aa=[];
                for(var i=0;i<data[1].split(":").length;i++){
                    if(i<2){
                        aa.push(data[1].split(":")[i])
                    }
                }
                data[1] = aa.join(":");
                date=data.join(" ");
                return date;
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
            $('#find_unit').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
        })
    }
});
var changeMeterReason={
    "0":"故障",
    "1":"维修",
    "2":"检表",
    "3":"改造",
    "4":"慢表",
    "5":"表堵",
    "6":"漏气",
    "7":"变向",
    "8":"变容",
    "9":"改型",
    "10":"死表",
    "11":"快表",
    "12":"窃气",
    "13":"A级表",
    "14":"超期表",
    "15":"开栓换表",
    "16":"其他"
}

$.each(changeMeterReason,function(key,val){
    $("#find_reservedField1").append("<option value='"+key+"'>"+val+"</option>")
})
$("#find_businessTypeId").on("change",function(){
    if($(this).val() == "CHANGEMT"){
        $("#reservedField1").css("display","block");
    }else{
        $("#reservedField1").css("display","none");
        $("#reservedField1").val("").trigger("change")
    }
})

var Business_QueryAction = function () {
    var businessTypeHelper = RefHelper.create({
        ref_url: 'gascsrbusinesstype/?query={"busiType":"0"}',
        ref_col: "businessTypeId",
        ref_display: "name",
        "sort":"no"
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
            f: function (val,row) {
                // console.log(row)
                var result = Restful.findNQ(hzq_rest + 'gascsrbusinesstype/?query={"businessTypeId":"'+row.businessTypeId+'"}')
                // console.log(result);
                // console.log(row)<!--data-target='#residentdetails'-->
                // console.log(result)

              /*TKSQ	12 	退款
                SPECIALA	14 	特殊用户申请
                KHDABG	13 	客户档案变更
                SPECIALC	15 	特殊用户取消
                CHANGEJP	16 	家庭人口数变更
                CHSQ	19 	串户申请
                CQBYQ	20 	长期不用气
                ICCOMPLEMENTAPPLY	21 	IC卡补量
                GMGH	2  	更名过户
                ICCARDREWRITE	22 	IC卡补卡
                XYQL	23 	协议气量         */

                if(result.length && result[0].acceptType == '1'){

                    if(row.businessTypeId == "LSKS"  || row.businessTypeId == "CHANGEMT" || row.businessTypeId == "REMOVEM" ||row.businessTypeId == "REMOVEM" ||
                        row.businessTypeId  == "STOPUSEG" ||  row.businessTypeId  == "REUSEG" || row.businessTypeId  == "ZJVOLUME"){
                        return "<a data-business='"+row.businessTypeId+"' class='information' data-toggle='modal' data-busiRegist='" + row.busiRegisterId + "'>详情</a>";
                    }else if((row.businessTypeId == "CHANGEGT2R" || row.businessTypeId == "CHANGEGT" || row.businessTypeId == "CHANGEGT2B") &&
                        (JSON.parse(row.reservedField1).changem == "1" || JSON.parse(row.reservedField1).changem == "3") ){
                        console.log(row)
                        return "<a data-business='"+row.businessTypeId+"' class='information' data-info='"+JSON.parse(row.reservedField1).changem+"' data-toggle='modal' data-busiRegist='" + row.busiRegisterId + "'>详情</a>";
                    }else if((row.businessTypeId == "CHANGEGT2R" || row.businessTypeId == "CHANGEGT" || row.businessTypeId == "CHANGEGT2B") &&
                        JSON.parse(row.reservedField1).changem == "2"){
                        console.log(row)
                        return "<a data-infos='"+row.reservedField1+"' data-business='"+row.businessTypeId+"' data-archive='"+row.ctmArchiveId+"'  data-pics='"+row.reservedField2+"' class='informa' data-toggle='modal'>详情</a>";
                    }

                }else{
                 if(row.businessTypeId=="BLLCORRECTA"){
                        return ""
                    }else
                    return "<a data-infos='"+row.reservedField1+"' data-flowinstid='"+row.flowInstance+"' data-picid='"+row.reservedField2+"' data-archive='"+row.ctmArchiveId+"'  data-business='"+row.businessTypeId+"'  class='informations' data-toggle='modal'>详情</a>"
                }

            }
        }
    }();
    var detailedInfoFormat1 = function () {
        return {
            f:function(val,row){
                // console.log(row)
                if(row.businessTypeId == "CHANGEMT"){
                    return "<a class='changemtProcess' data-id='"+row.busiRegisterId+"' data-row='"+JSON.stringify(row)+"'>查看</a>"
                }else {
                    return "<a class='process' data-id='"+row.busiRegisterId+"' data-row='"+JSON.stringify(row)+"'>查看</a>"
                }

            }
        }
    }()

    $.each(businessTypeHelper.getRawData(),function (index,row) {
        $('#find_businessTypeId').append('<option value="' + row.businessTypeId + '">' + row.name + '</option>');
    });

    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            var areaTypeHelper = RefHelper.create({
                ref_url: "gasbizarea",
                ref_col: "areaId",
                ref_display: "areaName",
            });
            var areaTypeFormat= function () {
                return {
                    f: function (val) {
                        return areaTypeHelper.getDisplay(val);
                    },
                }
            }();
            var billStateformat =function(){
                return{
                    f:function(val){
                        if(val=="0"){
                            return "受理中"
                        }else if(val=="1"){
                            return "工单执行中"
                        }else if(val=="2"){
                            return "审批拒绝"
                        }else if(val=="3"){
                            return "已完成"
                        }else if(val=="4"){
                            return "作废"
                        }
                    }
                }
            }()

            var userinfo = JSON.parse(localStorage.getItem('user_info'));
            console.log(userinfo);
            $('#divtable').html('');
            var db={
                "cols":"a.*,c.book_code",
                "froms":"gas_csr_busi_register a left join gas_ctm_archive b on b.customer_code = a.customer_code left join gas_mrd_book c on c.book_id=b.book_id",
                "wheres":"1=0 and a.area_id in ("+loginarea.join()+") order by a.accept_date desc,a.finish_date desc",
                "page":true,
                "limit":50
            }


            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    findbtn:"find_button",
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(db)),
                    // restbase: 'gascsrbusiregister/?query={"areaId":"'+userinfo.area_id+'"}&sort=-acceptDate',
                    key_column: 'busiregisterId',
                    //---------------行定义
                    coldefs: [
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format:areaTypeFormat,
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "businessTypeId",
                            friendly: "业务类型",
                            sorting: false,
                            format:businessTypeFormat,
                            index: 2
                        },
                        {
                            col: "busiAcceptCode",
                            friendly: "受理单号",
                            readonly: "readonly",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "createdBy",
                            friendly: "受理人",
                            readonly: "readonly",
                            format:sysUserFormat,
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本",
                            sorting: false,
                            index: 7
                        },

                        {
                            col: "customerAddr",
                            friendly: "客户地址",
                            sorting: false,
                            index: 8
                        },

                        {
                            col: "acceptDate",
                            friendly: "受理时间",
                            format:dateForat,
                            index: 9
                        },
                         {
                            col: "finishDate",
                            friendly: "完成时间",
                            format:dateForat,
                            index: 10
                        },
                        {
                            col: "linkMan",
                            friendly: "联系人",
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "linkPhone",
                            friendly: "联系电话",
                            sorting: false,
                            index: 12
                        },
                         {
                            col: "billState",
                            friendly:"状态",
                            format:billStateformat,
                            sorting: false,
                            index: 13
                        },
                        {
                            col: "description",
                            friendly: "备注",
                            sorting: false,
                            index: 14
                        },
                        {
                            col: "busiRegisterId",
                            friendly: "操作",
                            format:detailedInfoFormat,
                            sorting: false,
                            index: 15
                        },
                        {
                            col: "busiRegisterId1",
                            friendly: "流程状态",
                            format:detailedInfoFormat1,
                            sorting: false,
                            index: 16
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var whereinfo = "";
                        if ($("#find_customerKind").val()) {
                            whereinfo += " b.customer_kind = '" + $("#find_customerKind").val() + "' and ";
                        }
                         if ($("#find_billState").val()) {
                            whereinfo += " a.bill_state = '" + $("#find_billState").val() + "' and ";
                        }
                        if ($("#find_bookCode").val()) {
                            whereinfo += " c.book_code like '%" + $('#find_bookCode').val() + "%' and ";
                        }
                        if ($('#find_customerCode').val()) {
                            whereinfo += " a.customer_code like '%" + $('#find_customerCode').val() + "%' and ";
                        }
                        if ($('#find_businessTypeId').val()) {
                            whereinfo += " a.business_type_id ='" + $('#find_businessTypeId').val() + "' and ";
                        }
                        if ($('#find_busiAcceptCode').val()) {
                            whereinfo += " a.busi_accept_code like '%" + $('#find_busiAcceptCode').val() + "%' and ";
                        }
                        if ($('#find_customerName').val()) {
                            whereinfo += " a.customer_name like '%" + $('#find_customerName').val() + "%' and ";
                        }
                        if ($('#find_unit').val()) {
                            whereinfo += " a.area_id = '" + $('#find_unit').val() + "' and ";
                        }else{
                            whereinfo += "a.area_id in ("+loginarea.join()+") and"
                        }

                        if ($('#find_customerAddress').val()) {
                            whereinfo += " a.customer_address like'%" + $('#find_customerAddress').val() + "%' and ";
                        }

                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " to_char(a.accept_date,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                            //var find_start_date = RQLBuilder.condition("unboltTime","$gte","to_date('"+ $("#find_start_date").val()+"','yyyy-MM-dd')");
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += " to_char(a.finish_date,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "' and ";
                            //var find_start_date = RQLBuilder.condition("unboltTime","$gte","to_date('"+ $("#find_start_date").val()+"','yyyy-MM-dd')");
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        if($("#find_reservedField1").val()){
                            var str = '"changereason":"'+$("#find_reservedField1").val()+'"';
                            console.log(str)
                            whereinfo += " a.reservedField1 like'%" + str + "%' and ";
                        }

                        var db={
                            "cols":"a.*,c.book_code",
                            "froms":"gas_csr_busi_register a left join gas_ctm_archive b on b.customer_code = a.customer_code left join gas_mrd_book c on c.book_id=b.book_id",
                            "wheres":whereinfo + " 1=1 order by a.accept_date desc,a.finish_date desc",
                            "page":true,
                            "limit":50
                        }
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(db)));
                    }
                }//--init
            );//--end init
        },
    }
}();
$(document).on("click",".information",function(){
    var business =  $(this).attr("data-business");
    var willTitle =  $(this).attr("data-busiRegist");

    $("#grid").html("");
    $("#slideId").html("");
    console.log(business)
    var str = '<div class="row form-group">' +
                '<div class="col-md-12">' +
                    '<label class="control-label">相关照片</label>' +
                    '<div id="grid-gallery" class="grid-gallery">' +
                    '<section class="grid-wrap">' +
                        '<ul id="grid" class="grid"></ul>' +
                    '</section>' +
                    '<section class="slideshow" style="padding-top: 10px">' +
                        '<ul id = "slideId"></ul>' +
                        '<nav>' +
                            '<span class="icon nav-prev"></span>' +
                            '<span class="icon nav-next"></span>' +
                            '<span class="icon nav-close" style="padding-top: 50px;"></span>' +
                        '</nav>' +
                    '</section>' +
                '</div>' +
            '</div>'

    $("#picture").html(str);
    if(business == "CHANGEMT" || business  == "ZJVOLUME"){
        $("#changemeter").show().siblings().hide();
        changemt(willTitle);
    }else if(business == "LSKS"){
        $("#lsksmeter").show().siblings().hide();
        lsks(willTitle);
    }else if(business == "REMOVEM" || business  == "STOPUSEG" ||  business  == "REUSEG"){
        $("#removem").show().siblings().hide();
        removem(willTitle);
    }else if(business == "CHANGEGT2R" || business  == "CHANGEGT2B" ||  business  == "CHANGEGT" ){
        var changem =  $(this).attr("data-info");
        console.log(changem)
        if(changem == "3"){
            $("#removem").show().siblings().hide();
            removem(willTitle);
        }else if(changem == "1") {
            $("#changemeter").show().siblings().hide();
            changemt(willTitle);
        }
    }

})

$(document).on("click",".informations",function(){
    $("#customerInfo input").val("");


    var str = '<div class="row form-group" style="min-height:300px;">' +
        '<div class="col-md-12">' +
        '<label class="control-label">相关照片</label>' +
        '<div id="grid-gallerys" class="grid-gallery">' +
        '<section class="grid-wrap">' +
        '<ul id="grids" class="grid" style="min-hight:200px !important;"></ul>' +
        '</section>' +
        '<section class="slideshow" style="padding-top: 10px">' +
        '<ul id = "slideIds"></ul>' +
        '<nav>' +
        '<span class="icon nav-prev"></span>' +
        '<span class="icon nav-next"></span>' +
        '<span class="icon nav-close" style="padding-top: 50px;"></span>' +
        '</nav>' +
        '</section>' +
        '</div>' +
        '</div>';
    $("#pictures").html(str);
    console.log($(this).attr("data-infos"))
    if($(this).attr("data-infos") && $(this).attr("data-infos") != "undefined"){
        var customerInfo = JSON.parse($(this).attr("data-infos"));
    }else{
        return false;
    }
    var customerbusi = $(this).attr("data-business");
    var flowinstid = $(this).attr("data-flowinstid");
    var ctmarchiveid = $(this).attr("data-archive");
    var ctmarchiveresult = Restful.findNQ(hzq_rest+"gasctmarchive/"+ctmarchiveid);
    console.log(customerInfo)
    console.log(customerbusi)
    // console.log(customerInfo)
    $.each(ctmarchiveresult,function(key,val){
        $("form[name='customerInfo'] input[name='"+key+"']").val(val);
        if(key == "customerKind"){
            if(val=="1"){
                $("form[name='customerInfo'] input[name='"+key+"']").val("居民");
            }else{
                $("form[name='customerInfo'] input[name='"+key+"']").val("非居民");
            }
        }
    })
    //特殊用户申请
    if( customerbusi== "SPECIALA"){
        $("#SPECIALA").show().siblings().hide();
        if(customerInfo.specialtype == "1"){
            $("#specialtype").val("低保");
        }else if(customerInfo.specialtype == "3"){
            $("#specialtype").val("低困（困难家庭）");
        }else if(customerInfo.specialtype == "2"){
            $("#specialtype").val("低收入）");
        }
        $("#specialacc").val(customerInfo.specialacc);
        $("#baoname").val(customerInfo.nameno);
        $("#accountno").val(customerInfo.accountno);
        $("#perno").val(customerInfo.perno);
        $("#remark").val(customerInfo.remark);
        if(customerInfo.files){
            picss(customerInfo.files)
        }
    }else if(customerbusi== "KHDABG"){
        //客户档案变更
        $("#tas").html("旧客户信息")
        $("#KHDABG").show().siblings().hide();
        $.each(customerInfo,function(key,val){
            $("form[name='KHDABG'] input[name='"+key+"']").val(val);
            $("form[name='KHDABG'] select[name='"+key+"']").val(val).trigger("change");
        })
        if(customerInfo.files){
            picss(customerInfo.files)
        }
    }else if(customerbusi== "ICCARDREWRITE"){
        //IC卡补卡
        $("#ICCARDREWRITE").show().siblings().hide();
        $("#lost_reason").val(customerInfo.rewritereason).trigger("change");
        $("#ICremark").val(customerInfo.remark);
        $("#applyer").val(customerInfo.applyer);
        $("#idcards").val(customerInfo.idcard);
        if(customerInfo.files){
            picss(customerInfo.files)
        }
    }else if(customerbusi== "CHSQ"){
        //串户申请
        $("#CHSQ").show().siblings().hide();
        $("#CHSQ input").val("");
        $("#CHSQ select").val("").trigger("change");
        $("#CHSQ select").attr("disabled","disabled")
        console.log(flowinstid)
        $.ajax({
            url:hzq_rest +　'psmflowinst/?query={"flowInstId":"'+flowinstid+'"}',
            type: 'get',
            dataType:'json',
            contentType:"application/json; charset=utf-8",
            async:false,
            success:function(data, textStatus, xhr) {
                console.log("data="+JSON.stringify(data));

                var obret =  JSON.parse(data[0].propstr2048);
                var customecode  =obret.customcode;
                if(obret.customerKind=='1'){
                    $('#customerKind').val("居民");
                }else{
                    $('#customerKind').val("非居民");
                }
                $('#specialtype').val(obret.specialtype);
                $('#specialacc').val(obret.specialacc);
                $('#stepids').val(obret.stepInstId);
                $('#remark').val(obret.remark);
                $('#con').html(obret.con);
                $('#strandReason').val(obret.strandReason).trigger("change");
                $('#customerCodeAfter').val(obret.customercode);
                $('#strandMoney').val(obret.strandMoney);
                $('#addressAfter').val(obret.addressAfter);
                $('#customerNameBefore').val(obret.customerNameBefore);
                $('#strandTel').val(obret.strandTel);
                $('#addressBefore').val(obret.addressBefore);
                $('#customerNameAfter').val(obret.customername);
                $('#customerCodeBefore').val(obret.customerCodeBefore);
                $('#strandIdcard').val(obret.strandIdcard);
                $('#moneyType').val(obret.moneyType).trigger("change");
                $('#serialNo').val(obret.serialno);
                $('#remarks').val(obret.remark);
                var busid = obret.files;
                picss(busid);
                // picss(customerInfo.files)
            }
        });
    }else if(customerbusi == "CHANGEJP"){
    //    家庭人口变更
        $("#CHANGEJP").show().siblings().hide();
        $("#oldjp").val(customerInfo.oldjp)
        $("#newjp").val(customerInfo.newjp)
        $("#changejp_remark").val(customerInfo.remark)
        if(customerInfo.filesid){
            picss(customerInfo.filesid)
        }
    }else if(customerbusi == "TKLQ"){
    //    退款领取
        $("#TKLQ").show().siblings().hide();
        // "isEntrust":ischecked,
        console.log(customerInfo.isEntrust);
        if(customerInfo.isEntrust == "1"){
            $("#ischecked").parent("span").addClass("checked")
        }else{
            $("#ischecked").parent("span").removeClass("checked")
        }
        $("#receiveName").val(customerInfo.receiveName)
        $("#receiveCardNo").val(customerInfo.receiveCardNo)
        $("#receiveTel").val(customerInfo.receiveTel)
        $("#refundType").val(customerInfo.refundType).trigger("change")
        $("#receiveWay").val(customerInfo.receiveWay).trigger("change")
        $("#tklqmoney").val(customerInfo.money)
        $("#tklqremark").val(customerInfo.remark)
        console.log($(this).attr("data-picid"))
        if($(this).attr("data-picid") && $(this).attr("data-picid")!= "undefined"){
            picss($(this).attr("data-picid"))
        }
    }else if(customerbusi == "CQBYQSQ"){
    //    长期不用气
        $("#CQBYQSQ").show().siblings().hide();
        $("#cqbyqsqlinkman").val(customerInfo.linkman);
        $("#cqbyqsqlinktel").val(customerInfo.linktel);
        $("#cqbyqsqreason").val(customerInfo.reason);
        $("#cqbyqsqlinkidcard").val(customerInfo.idcard);
        if(customerInfo.fileId){
            picss(customerInfo.fileId)
        }

    }else if(customerbusi == "XYQL"){
    //    协议气量
        var data={"表具故障":"表具故障","二次表不显示":"二次表不显示","疑似窃气":"疑似窃气","缺电":"缺电","其他":"其他"}
        $.map(data, function (key, val) {
            $('#argeeReason').append('<option  value="' + val + '">' + key + '</option>');
        });
        $("#XYQL").show().siblings().hide();
        $('#agreeGas').val(customerInfo.agreeGas);
        $('#agreeMon').val(customerInfo.agreeMon);
        $('#argeeReason').val(customerInfo.argeeReason).trigger("change");

        if(customerInfo.startTime){
            $('#startTime').val(customerInfo.startTime.substring(0,10));
        }

        if(customerInfo.startTime){
            $('#endTime').val(customerInfo.endTime.substring(0,10));
        }


        $('#operates').val(customerInfo.operate);
        $('#averageGas').val(customerInfo.averageGas);
        $('#sremarks').val(customerInfo.remark);
        if(customerInfo.fileId){
            picss(customerInfo.fileId)
        }
    }else if(customerbusi == "ADJUSTP"){
    //    定针
        $("#ADJUSTP").show().siblings().hide();
        $("form[name='ADJUSTP'] input").attr("disabled","disabled");
        $("form[name='ADJUSTP'] select").attr("disabled","disabled");
        $("#sttheneddle_meter").val(customerInfo.sttheneddle_meter).trigger("change")
        $("#re_meterreading").val(customerInfo.re_meterreading)
        $("#re_chargemeterreading").val("0")
        $("#chargemeter").val(customerInfo.chargemeter).trigger("change")
        $("#operate").val(customerInfo.operate)
        $("#re_copytime").val(customerInfo.re_copytime)
        $("#sremark").val(customerInfo.remark)
        var results = Restful.findNQ(hzq_rest+'gasmrdmeterreading/'+customerInfo.busiId);
        console.log(results)
        $("#re_feedback").val(results.feedback)
        // apply.meterReadingId,
        // busiId,
        if(customerInfo.busiId){
            picss(customerInfo.busiId)
        }
    }else if(customerbusi == "GMGH"){
    //    更名过户
    //    {"exigencetelnew":"2341431","idcardtypenew":"5","entrustcardtype":"",
        // "files":"2F912C7C2770794CF334354751919E56","customercode":"116169005","newprocertytype":"1",
        // "idcardnew":"230102193309091612","newprocertynum":"234","telnew":"42314","entrustcardno":"",
        // "linkman":"","newpropertyowner":"而且","linktel":""}
        $("#GMGH").show().siblings().hide();
        $("form[name='GMGH'] input").attr("disabled","disabled");
        $("form[name='GMGH'] select").attr("disabled","disabled");

        var procertytypeenum = {
            "1": "私有产权证",
            "2": "不动产证",
            "3": "购房发票",
            "4": "商品房购房合同",
            "5": "购房发票",
            "6": "动迁安置协议",
            "7": "廉租房证",
            "8": "其他"
        };
        $.map(procertytypeenum, function (key, val) {
            $('#newprocertytype').append('<option  value="' + val + '">' + key + '</option>');
        });
        var idcardtypeenum = {"1": "营业执照", "2": "法人身份证", "3": "房产证", "4": "租房合同", "5": "居民身份证"};
        $.map(idcardtypeenum, function (key, val) {

            $('#idcardtypenew').append('<option  value="' + val + '">' + key + '</option>');
            $('#entrustcardtype').append('<option  value="' + val + '">' + key + '</option>');
        });
        $.each(customerInfo,function(key,val){
            $("form[name='GMGH'] input[name='"+key+"']").val(val);
            $("form[name='GMGH'] select[name='"+key+"']").val(val).trigger("change");
        })
        if(customerInfo.files){
            picss(customerInfo.files)
        }

    }else if(customerbusi == "TKSQ"){
    //  退款申请
        $("#TKSQ").show().siblings().hide();
        $("#tksq_linkman").val(customerInfo.linkman)
        $("#tksq_linkidcard").val(customerInfo.linkidcard)
        $("#tksq_linktel").val(customerInfo.linktel)
        $("#tksq_reason").val(customerInfo.reason).trigger("change")
        $("#tksq_bankCardNo").val(customerInfo.bankCardNo)
        $("#tksq_bankCardName").val(customerInfo.bankCardName)
        $("#tksq_bankName").val(customerInfo.bankName)
        $("#tksq_refundType").val(customerInfo.refundType).trigger("change")
        $("#tksq_money").val(customerInfo.money).trigger("change")
        // $("#tksq_otherBankName").val(customerInfo.linkman)
        if(customerInfo.fileId){
            picss(customerInfo.fileId)
        }

    }else if(customerbusi == "ICCOMPLEMENTAPPLY"){
    //    Ic卡补量
        $("#ICCOMPLEMENTAPPLY").show().siblings().hide();
        console.log(customerInfo)
        console.log(flowinstid)
        $.ajax({
            url:hzq_rest +　'psmflowinst/?query={"flowInstId":"'+flowinstid+'"}',
            type: 'get',
            dataType:'json',
            contentType:"application/json; charset=utf-8",
            async:false,
            success:function(data, textStatus, xhr) {
                console.log(JSON.parse(data[0].propstr2048))
                var icresult = Restful.findNQ(hzq_rest+"gaschgiccardcomplement/"+JSON.parse(data[0].propstr2048).complementId);
                console.log(icresult)
                $("#ICCOMPLEMENTAPPLY #linkMans").val(icresult.customerName);
                $("#ICCOMPLEMENTAPPLY #projectAddresss").val(ctmarchiveresult.customerAddress);
                $("#ICCOMPLEMENTAPPLY #linkTels").val(ctmarchiveresult.tel);
                $("#ICCOMPLEMENTAPPLY #remarkss").val(icresult.remark);
                $("#ICCOMPLEMENTAPPLY #applygass").val(icresult.applyGas);
                $("#ICCOMPLEMENTAPPLY #approvegass").val(icresult.approveGas);
                $("#ICCOMPLEMENTAPPLY #lost_reasons").val(icresult.applyReason);
                if(JSON.parse(data[0].propstr2048).file_id){
                    picss(JSON.parse(data[0].propstr2048).file_id);
                }
            }
        });
    }

    $("#residentdetai").modal("show");
})

$(document).on("click",".informa",function(){
    $("#customerInfo input").val("");

    var str = '<div class="row form-group" style="min-height:300px;">' +
        '<div class="col-md-12">' +
        '<label class="control-label">相关照片</label>' +
        '<div id="grid-gallerys" class="grid-gallery">' +
        '<section class="grid-wrap">' +
        '<ul id="grids" class="grid" style="min-hight:200px !important;"></ul>' +
        '</section>' +
        '<section class="slideshow" style="padding-top: 10px">' +
        '<ul id = "slideIds"></ul>' +
        '<nav>' +
        '<span class="icon nav-prev"></span>' +
        '<span class="icon nav-next"></span>' +
        '<span class="icon nav-close" style="padding-top: 50px;"></span>' +
        '</nav>' +
        '</section>' +
        '</div>' +
        '</div>';
    $("#pictures").html(str);
    console.log($(this).attr("data-infos"))
    if($(this).attr("data-infos") && $(this).attr("data-infos") != "undefined"){
        var customerInfo = JSON.parse($(this).attr("data-infos"));
    }else{
        return false;
    }
    var customerbusi = $(this).attr("data-business");
    var flowinstid = $(this).attr("data-flowinstid");
    var ctmarchiveid = $(this).attr("data-archive");
    var ctmarchiveresult = Restful.findNQ(hzq_rest+"gasctmarchive/"+ctmarchiveid);
    console.log(customerInfo)
    console.log(customerbusi)
    // console.log(customerInfo)
    $.each(ctmarchiveresult,function(key,val){
        $("form[name='customerInfo'] input[name='"+key+"']").val(val);
        if(key == "customerKind"){
            if(val=="1"){
                $("form[name='customerInfo'] input[name='"+key+"']").val("居民");
            }else{
                $("form[name='customerInfo'] input[name='"+key+"']").val("非居民");
            }
        }
    })
    var areaTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });

    $("#CHANGEGT").show().siblings().hide();
    $("#linkMan").val(customerInfo.linkman);
    $("#linktel").val(customerInfo.linktel);
    $("#bookingtime").val(customerInfo.bookingtime);

    $("#oldgastype").val(areaTypeHelper.getDisplay(customerInfo.oldGT));
    $("#newgastype").val(areaTypeHelper.getDisplay(customerInfo.newGT));
    $("#chremark").val(customerInfo.remark);

    console.log($(this).attr("data-pics"))
    if(customerInfo.files){
        picss(customerInfo.files)
    }

    $("#residentdetai").modal("show");
})

function picss(busiId){
    // console.log(busiId)
    $("#grids").html("");
    $("#slideIds").html("");
    $.ajax({
        url: hzq_rest+"gasbasfile?fields={}&query={\"busiId\":\"" + busiId + "\"}",
        method: "get",
        async: false,
        dataType: "json",
        success: function (data) {
            if(data && data.length > 0){
                // var busiId  =data.busiId;
                for(var i=0; i<data.length;i++){
                    var datali = data[i];
                    var str = datali.fileName;
                    $("#grids").append("<li><figure><img src='/hzqs/sys/download.do?fileId="+datali.fileId+"&w=300"+i+"' alt='"+datali.fileName+"'/></figure></li>")
                    $("#slideIds").append("<li><figure><img src='/hzqs/sys/download.do?fileId="+datali.fileId+"' alt='"+datali.fileName+"'/></figure></li>")

                }
            }
            // console.log("ssdsds"+JSON.stringify(data));
        },
        error: function (data) {
            bootbox.alert(data);

        }

    });
    setTimeout(function(){
        new CBPGridGallery(document.getElementById('grid-gallerys'));
    },300)

}

function pics(busiId){
    console.log(busiId)
    $.ajax({
        url: hzq_rest+"gasbasfile?fields={}&query={\"busiId\":\"" + busiId + "\"}",
        method: "get",
        async: false,
        dataType: "json",
        success: function (data) {
            if(data && data.length > 0){
                // var busiId  =data.busiId;
                for(var i=0; i<data.length;i++){
                    var datali = data[i];
                    var str = datali.fileName;

                    $("#grid").append("<li><figure><img src='/hzqs/sys/download.do?fileId="+datali.fileId+"&w=300' alt='"+datali.fileName+"'/></figure></li>")
                    $("#slideId").append("<li><figure><img src='/hzqs/sys/download.do?fileId="+datali.fileId+"' alt='"+datali.fileName+"'/></figure></li>")
                }
            }

            // console.log("ssdsds"+JSON.stringify(data));
        },
        error: function (data) {
            bootbox.alert(data);

        }

    });
    new CBPGridGallery(document.getElementById('grid-gallery'));
}

$(document).on("click",".process",function(){
    var stepId = $(this).attr("data-id");
    console.log(stepId);
    var row = JSON.parse($(this).attr("data-row"));
    console.log(row);
    var restust = Restful.findNQ(hzq_rest + 'psmstepinst/?query={"flowInstId":"'+stepId+'"}');
    console.log(restust)

   if(restust.length){
       var businessTypeHelper = RefHelper.create({
           ref_url: 'gascsrbusinesstype/?query={"validState":"1"}',
           ref_col: "businessTypeId",
           ref_display: "name",
       });

       $("#customerNams").val(row.customerName)
       $("#customerCods").val(row.customerCode)
       $("#businessTypeId").val(businessTypeHelper.getDisplay(row.businessTypeId))
       $("#stepinst").modal("show");
       $("#divtableS").html("");
       var dbs={
           "cols":"case gs_ecode when 'START' then 1 when 'PTWO' then 2 when 'PTHREE' then 3 when 'PFOUR' then 4 " +
           "when 'PFIVE' then 5 when 'PSIX' then 6 when 'PSEVEN' then 7 when 'PEIGHT' then 8 when 'PNINE' then 9 when 'PTEN' then 10 " +
           "when 'PELEVEN' then 11 end as gs_ecode ,step_inst_id,gs_chcode,step_status,results,submit_time,operator,modify_time,propstr256,propstr2048",
           "froms":"psm_step_inst",
           "wheres":"gs_ecode <> 'END' and flow_inst_id = '"+stepId+"' order by nvl(gs_ecode,12) asc",
           "page":false
       }
       var stepStatus = {"1":"节点等待获取","2":"节点已获取","3":"节点挂起","4":"节点停止","5":"节点结束","6":"节点异常","7":"节点已提交","8":"完成","9":"无效"}
       var stepStatusFormat = function () {
           return{
               f:function(val){
                   return stepStatus[val]
               }
           }
       }()
       var resultFormat = function () {
           return{
               f:function(val){
                   if(val == "0"){
                       return "通过"
                   }else if(val == "1"){
                       return "拒绝"
                   }
               }
           }
       }()
       var userHelper = RefHelper.create({
           ref_url: "gassysuser",
           ref_col: "userId",
           ref_display: "employeeName",
       });
       var userFormat=function () {
            return{
                f:function(val){
                    console.log(val)/*12485*/
                    if(val=="AUTO"){
                        return "";
                    }else{
                        return userHelper.getDisplay(val);
                    }

                }
            }
       }();
       var modifiedFormat =function(){
           return{
               f:function(val,row){
                   if(row.stepStatus == "1" || row.stepStatus == "2"){
                        return " "
                   }else{
                        return val.split("T").join(" ");
                   }
                   
                   
               }
           }
       }();
        var postformat=function(){
            return{
                f:function(val,row){
                    console.log(row)
                    console.log(val)
                    if(val){
                        var str = val.replace(/\//g, '');
                        console.log(str)
                        var valarr = str.split("<br>")[str.split("<br>").length-2];
                        console.log(valarr)
                        return valarr
                    }else{
                        console.log(row.propstr2048)
                        if(JSON.parse(row.propstr2048).agreereason){
                            var str = JSON.parse(row.propstr2048).agreereason.replace(/\//g, '');
                            var valarr = str.split("<br>")[str.split("<br>").length-1];
                            console.log(str.split("<br>"))
                            console.log(valarr)
                            return valarr
                        }

                    }
                    
                    if(row.stepStatus == "2" || row.stepStatus =="1"){
                        return " ";
                    }
                    

                }
            }
        }();
       xwss = XWATable.init(
           {
               divname: "divtableS",
               //----------------table的选项-------
               pageSize: 15, 			//Initial pagesize
               columnPicker: true,         //Show the columnPicker button
               sorting: true,
               transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
               checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
               checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
               //----------------基本restful地址---
               restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(dbs)),
               // restbase: 'gascsrbusiregister/?query={"areaId":"'+userinfo.area_id+'"}&sort=-acceptDate',
               key_column: 'stepInstId',
               //---------------行定义
               coldefs: [
                   {
                       col: "gsChcode",
                       friendly: "节点所属角色",
                       sorting: false,
                       // format:,
                       index: 1
                   },
                   {
                       col: "gsEcode",
                       friendly: "步骤",
                       sorting: false,
                       // format:,
                       index: 2
                   },
                   {
                       col: "stepStatus",
                       friendly: "状态",
                       sorting: false,
                       format:stepStatusFormat,
                       index: 3
                   },
                   {
                       col: "operator",
                       friendly: "审批人",
                       sorting: false,
                       format:userFormat,
                       index: 4
                   },
                   {
                       col:"modifyTime",
                       friendly: "审批时间",
                       sorting: false,
                       format:modifiedFormat,
                       index: 5
                   },
                   {
                       col: "results",
                       friendly: "流程结果",
                       format:resultFormat,
                       sorting: false,
                       index: 6
                   },
                   {
                       col: "propstr256",
                       friendly: "审批意见",
                       format:postformat,
                       sorting: false,
                       index: 7
                   },

               ]
           }
       );
   }else{
       bootbox.alert("<center><h4>该业务没有流程。</h4></center>")
   }

})


$(document).on("click",".changemtProcess",function () {
    var stepId = $(this).attr("data-id");
    var row = JSON.parse($(this).attr("data-row"));
    var restust = Restful.findNQ(hzq_rest + 'psmstepinst/?query={"flowInstId":"'+stepId+'"}');
    console.log(restust);
    if(restust.length){
        var businessTypeHelper = RefHelper.create({
            ref_url: 'gascsrbusinesstype/?query={"validState":"1"}',
            ref_col: "businessTypeId",
            ref_display: "name",
        });

        $("#changemtcustomerNams").val(row.customerName)
        $("#changemtcustomerCods").val(row.customerCode)
        $("#changemtbusinessTypeId").val(businessTypeHelper.getDisplay(row.businessTypeId))
        $("#changemtstepinst").modal("show")
        $("#divtablechange").html("");
        $("#divtablework").html("");
        var dbs={
            "cols":"case gs_ecode when 'START' then 1 when 'PTWO' then 2 when 'PTHREE' then 3 when 'PFOUR' then 4 " +
            "when 'PFIVE' then 5 when 'PSIX' then 6 when 'PSEVEN' then 7 when 'PEIGHT' then 8 when 'PNINE' then 9 when 'PTEN' then 10 " +
            "when 'PELEVEN' then 11 end as gs_ecode ,step_inst_id,gs_chcode,step_status,results,submit_time,operator,modify_time,propstr256",
            "froms":"psm_step_inst",
            "wheres":"gs_ecode <> 'END' and flow_inst_id = '"+stepId+"' order by nvl(gs_ecode,12) asc",
            "page":false
        }
        var stepStatus = {"1":"节点等待获取","2":"节点已获取","3":"节点挂起","4":"节点停止","5":"节点结束","6":"节点异常","7":"节点已提交","8":"完成","9":"无效"}
        var stepStatusFormat = function () {
            return{
                f:function(val){
                    return stepStatus[val]
                }
            }
        }()
        var resultFormat = function () {
            return{
                f:function(val){
                    if(val == "0"){
                        return "通过"
                    }else if(val == "1"){
                        return "拒绝"
                    }
                }
            }
        }()
        var userHelper = RefHelper.create({
            ref_url: "gassysuser",
            ref_col: "userId",
            ref_display: "employeeName",
        });
        var userFormat=function () {
            return{
                f:function(val){
                    console.log(val)/*12485*/
                    if(val=="AUTO"){
                        return "";
                    }else{
                        return userHelper.getDisplay(val);
                    }

                }
            }
        }()
        var modifiedFormat =function(){
            return{
                f:function(val,row){
                    if(row.stepStatus == "1" || row.stepStatus == "2"){
                         return " "
                    }else{
                         return val.split("T").join(" ");
                    }
                    
                    
                }
            }
        }();
        var postformat=function(){
            return{
                f:function(val){
                    var str = val.replace(/\//g, '');
                    console.log(str)
                    var valarr = str.split("<br>")[str.split("<br>").length-2];
                    console.log(str.split("<br>"))
                    return valarr
                }
            }
        }();
        xwss = XWATable.init(
            {
                divname: "divtablechange",
                //----------------table的选项-------
                pageSize: 15, 			//Initial pagesize
                columnPicker: true,         //Show the columnPicker button
                sorting: true,
                transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                //----------------基本restful地址---
                restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(dbs)),
                // restbase: 'gascsrbusiregister/?query={"areaId":"'+userinfo.area_id+'"}&sort=-acceptDate',
                key_column: 'stepInstId',
                //---------------行定义
                coldefs: [
                    {
                        col: "gsChcode",
                        friendly: "节点所属角色",
                        sorting: false,
                        index: 1
                    },
                    {
                        col: "gsEcode",
                        friendly: "步骤",
                        sorting: false,
                        index: 2
                    },
                    {
                        col: "stepStatus",
                        friendly: "状态",
                        sorting: false,
                        format:stepStatusFormat,
                        index: 3
                    },
                    {
                        col: "operator",
                        friendly: "审批人",
                        sorting: false,
                        format:userFormat,
                        index: 4
                    },
                    {
                        col:"modifyTime",
                        friendly: "审批时间",
                        sorting: false,
                        format:modifiedFormat,
                        index: 5
                    },
                    {
                        col: "results",
                        friendly: "流程结果",
                        format:resultFormat,
                        sorting: false,
                        index: 6
                    },
                    {
                        col: "propstr256",
                        friendly: "审批意见",
                        format:postformat,
                        sorting: false,
                        index: 7
                    },
                ]
            }
        );
        var dbss={
            "cols":"case gs_ecode when 'START' then 1 when 'PTWO' then 2 when 'PTHREE' then 3 when 'PFOUR' then 4 " +
            "when 'PFIVE' then 5 when 'PSIX' then 6 when 'PSEVEN' then 7 when 'PEIGHT' then 8 when 'PNINE' then 9 when 'PTEN' then 10 " +
            "when 'PELEVEN' then 11 end as gs_ecode ,step_inst_id,gs_chcode,step_status,results,submit_time,operator,modify_time,propstr256",
            "froms":"psm_step_inst",
            "wheres":"gs_ecode <> 'END' and flow_inst_id like '%"+stepId+"_%' order by flow_inst_id,nvl(gs_ecode,12) asc",
            "page":false
        }

        xwsss = XWATable.init(
            {
                divname: "divtablework",
                //----------------table的选项-------
                pageSize: 15, 			//Initial pagesize
                columnPicker: true,         //Show the columnPicker button
                sorting: true,
                transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                //----------------基本restful地址---
                restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(dbss)),
                // restbase: 'gascsrbusiregister/?query={"areaId":"'+userinfo.area_id+'"}&sort=-acceptDate',
                key_column: 'stepInstId',
                //---------------行定义
                coldefs: [
                    {
                        col: "gsChcode",
                        friendly: "节点所属角色",
                        sorting: false,
                        index: 1
                    },
                    {
                        col: "gsEcode",
                        friendly: "步骤",
                        sorting: false,
                        index: 2
                    },
                    {
                        col: "stepStatus",
                        friendly: "状态",
                        sorting: false,
                        format:stepStatusFormat,
                        index: 3
                    },
                    {
                        col: "operator",
                        friendly: "审批人",
                        sorting: false,
                        format:userFormat,
                        index: 4
                    },
                    {
                        col:"modifyTime",
                        friendly: "审批时间",
                        sorting: false,
                        index: 5
                    },
                    {
                        col: "results",
                        friendly: "流程结果",
                        format:resultFormat,
                        sorting: false,
                        index: 6
                    },
                    {
                        col: "propstr256",
                        friendly: "审批意见",
                        format:postformat,
                        sorting: false,
                        index: 7
                    },

                ]
            }
        );

    }else{
        bootbox.alert("<center><h4>该业务没有流程。</h4></center>")
    }
})