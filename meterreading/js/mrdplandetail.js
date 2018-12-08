
var MrdPlanDetailAction = function () {

    var xw;
    //供气区域helper
    return {
        init: function () {
            this.initHelper();
            this.reload();
            this.initBtn();
        },
        initHelper: function () {
            // 供气区域 select init
           /* $.map(GasModSys.areaHelper.getData(), function (value, key) {
                $('#find_areaId').append('<option value="' + key + '">' + value + '</option>');
            });*/
            var login_user = JSON.parse(localStorage.getItem("user_info"));
            console.log(login_user);
            GasModSys.areaList({
                "areaId":login_user.area_id,
                "cb":function(data){
                    var inhtml = "<option value=''>全部</option>";
                    if(data){
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.areaId+'">'+row.areaName+'</option>';
                        })
                        $("#find_areaId").html(inhtml);
                        $("#find_countperId").val("").change();
                    }
                }
            })

            $('#find_areaId').on('change',function(e){
                console.log("change area:"+e+"."+$('#find_areaId').val());
                GasModSys.counterUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                        })
                        $("#find_countperId").html(inhtml);
                        $("#find_countperId").val("").change();

                    }
                })
                //   xw.autoResetSearch();
            })

            $('#find_countperId').on('change',function(e){
                console.log("change counter:"+e+"."+$('#find_countperId').val());
                GasModSys.copyUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "countperId":$('#find_countperId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                            $.each(data,function(idx,row){
                                inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                            })
                        }
                        $("#find_serviceperId").html(inhtml);
                        $("#find_serviceperId").val("").change();

                    }
                })
                // xw.autoResetSearch();
            });

            $('#find_serviceperId').on('change',function(e){
                console.log("change serviceper:"+e+"."+$("#find_serviceperId").val());
                GasModMrd.bookInService({
                    "areaId":$("#find_areaId").val(),
                    "countperId":$('#find_countperId').val(),
                    "serviceperId":$('#find_serviceperId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                            $.each(data,function(inx,row){
                                inhtml +='<option value="'+row.bookId+'">'+row.bookCode+':'+row.address+'</option>'
                            })
                        }
                        $("#find_bookId").html(inhtml);
                        $("#find_bookId").val("").change();
                    }
                });
                //$('#find_bookId').val("").change();
                //  xw.autoResetSearch();
            });
            //抄表类型
            $.map(GasModMrd.enumCopyType,function(value,key){
                $('#copy_type').append('<option value="' + key + '">' + value + '</option>');
            });
            //是否计费
            $.map(GasModMrd.enumIsBll,function(value,key){
                $('#is_bll').append('<option value="' + key + '">' + value + '</option>');
            });
            //是否抄表
            $.map(GasModMrd.enumIsMrd,function(value,key){
                $('#is_mrd').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModMrd.enumDataSource,function(value,key){
                $('#data_source').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModCtm.enumCustomerKind,function(value,key){
                $('#customer_kind').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModCtm.enumCustomerState, function (value,key) {
                $('#customer_state').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModCtm.enumCustomerType,function(value,key){
                $('#customer_type').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModMrd.enumOperate,function(value,key){
            	$('#copy_operate').append('<option value="'+key+'">'+value+'</option>');
            });
           /* $('#find_areaId').on('change', function (e) {
                console.log("change area:" + e + "." + $('#find_areaId').val());
                GasModSys.counterUsersInArea({
                    "areaId": $('#find_areaId').val(),
                    "cb": function (data) {
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data, function (idx, row) {
                            inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                        })
                        $("#find_countperId").html(inhtml);
                        $("#find_countperId").val("").change();

                    }
                })
            });

            $('#find_countperId').on('change', function (e) {
                console.log("change counter:" + e + "." + $('#find_countperId').val());
                GasModSys.copyUsersInArea({
                    "areaId": $('#find_areaId').val(),
                    "countperId": $('#find_countperId').val(),
                    "cb": function (data) {
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                        $.each(data, function (idx, row) {
                            inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                        })
                        }
                        $("#find_serviceperId").html(inhtml);
                        $("#find_serviceperId").val("").change();

                    }
                })
            })*/

        },
        reload: function () {
            $('#divtable').html('');
            var whereinfo = "1=1 and mr.is_mrd='0' and mr.is_bll='0' ";

            user_info = JSON.stringify(localStorage.getItem("user_info"));
            area_id = user_info.area_id;
            var now = new Date();
            planyear =now.getYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();

            if(user_info && area_id ){
                whereinfo +=" and mr.area_id='"+area_id+"'";
            }
            if(planyear){
                whereinfo +=" and to_char(mr.plan_copy_time,'yyyy-mm-dd') = '"+planyear+"' ";
            }
            whereinfo +=" and nvl(mr.copy_state,'0') <> '9' ";
            var bd = {
                "cols": "mr.operate,mr.book_id,mr.ctm_archive_id,mr.meter_reading_id,mr.meter_id,mr.revise_meter_id,mr.data_source," +
                "mr.customer_kind,mr.meter_reading,mr.revise_reading,mr.last_meter_reading,mr.last_revise_reading," +
                "mr.copy_type,mr.copy_time,mr.plan_copy_time,mr.quotiety,mr.area_id,mr.serviceper_id,mr.countper_id,mr.created_time,mr.modified_time," +
                "ar.customer_code,ar.customer_name,mr.copy_state,b.book_code,b.book_type,mr.remark,mr.address," +
                "g.gas_type_name,gas_type_code," +
                "m_1.meter_digit,m_2.meter_digit revise_meter_digit,m_1.meter_kind,m_2.meter_kind revise_meter_kind",
                "froms": "gas_mrd_meter_reading mr " +
                " left join gas_ctm_archive ar on ar.ctm_archive_id=mr.ctm_archive_id" +
                " left join gas_mrd_book b on b.book_id=mr.book_id " +
                " left join gas_biz_gas_type g on g.gas_type_id= mr.gas_type_id " +
                " left join gas_mtr_meter m_1 on m_1.meter_id=mr.meter_id " +
                " left join gas_mtr_meter m_2 on m_2.meter_id=mr.revise_meter_id ",
                "wheres": whereinfo,
                "page": "true",
                "limit":50
            };

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column:'meterReadingId',
                    coldefs: [
                        {
                            col: "meterReadingId",
                            friendly: "抄表表ID",
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "ctmArchiveId",
                            friendly: "客户档案ID",
                           // unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            readonly: "readonly",
                            format: GasModSys.areaFormat,
                            // format:areaFormat,
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "planCopyTime",
                            friendly: "计划抄表日期",
                            format: dateFormat,
                            sorting: false,
                            index: 4
                        },
                        {
                            col:"copyState",
                            friendly:"抄表状态",
                            format:GasModMrd.mrdStateFormat,
                            readonly:"readonly",
                            sorting:false,
                            index:5
                        },
                        {
                            col:"copyTime",
                            friendly:"实际抄表时间",
                            readonly: "readonly",
                            sorting:false,
                            index:6
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format: GasModSys.employeeNameFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "serviceperId",
                            friendly: "客户服务员",
                            format: GasModSys.employeeNameFormat,
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            readonly: "readonly",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            readonly: "readonly",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类型",
                            format: GasModCtm.customerKindFormat,
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "bookId",
                            friendly: "抄表本ID",
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: false,
                            index: 12
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本编号",
                            sorting: false,
                            index: 13
                        },
                        {
                            col: "bookType",
                            friendly: "抄表本类型",
                            format: GasModBas.bookTypeFormat,
                            sorting: false,
                            index: 14
                        },
                        {
                            col:"dataSource",
                            friendly:"数据来源",
                            fromat:GasModMrd.dataSourceFormat,
                            sorting:false,
                            index:15
                        },

                        /*{
                         col: "isMrd",
                         friendly: "是否抄表",
                         format: GasModMrd.isMrdFormat,
                         sorting: false,
                         index: 13
                         },
                         {
                         col: "isBll",
                         friendly: "是否计费",
                         format: GasModMrd.isBllFormat,
                         sorting: false,
                         index: 14
                         },
                         */
                        {
                            col: "meterKind",
                            friendly: "表具种类",
                            format: GasModMtr.meterKindFormat,
                            sorting: false,
                            index: 16
                        },
                        {
                            col: "copyTime",
                            friendly: "实际抄表日期",
                            readonly: "readonly",
                            //format: dateFormat,
                            sorting: false,
                            index: 17
                        },
                        {
                            col: "meterReading",
                            friendly: "燃气表读数",
                            readonly: "readonly",
                            sorting: false,
                            index: 18
                        },
                        {
                            col:"lastMeterReading",
                            friendly:"上次燃气表读数",
                            readonly:"readonly",
                            sorting:false,
                            index:19
                        },
                        {
                            col: "reviseReading",
                            friendly: "修正表读数",
                            readonly: "readonly",
                            sorting: false,
                            index: 20
                        },
                        {
                            col:"lastReviseReading",
                            friendly:"上次修正表读数",
                            readonly:"readonly",
                            sorting:false,
                            index:21
                        },
                        {

                            col: " gasTypeName",
                            friendly: "用气类型",
                            sorting: false,
                            index:22
                        },
                        {
                            col: "address",
                            friendly: "地址",
                            readonly: "readonly",
                            sorting: false,
                            index: 23
                        },
                        {
                            col:'remark',
                            friendly:"备注",
                            sorting: false,
                            index: 24
                        },
                        {
                        	col:'operate',
                        	friendly:"抄表计划类型",
                        	sorting:false,
                        	index:25
                        },
                        {
                        	col:"createdTime",
                        	friendly:"创建时间",
                        	format: dateFormat,
                        	sorting:false,
                        	index:28
                        },
                        {
                        	col:"modifiedTime",
                        	friendly:"修改时间",
                        	format: dateFormat,
                        	sorting:false,
                        	index: 30
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function

                        var resUrl = "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=";
                        var whereinfo = "1=1 and mr.is_mrd='0' and mr.is_bll='0' ";
                        if ($('#find_areaId').val()) {
                            whereinfo += " and mr.area_id='" + $('#find_areaId').val() + "'";
                        }
                        if ($('#find_serviceperId').val()) {
                            whereinfo += " and mr.serviceper_id='" + $('#find_serviceperId').val() + "'";
                        }
                        if ($('#find_countperId').val()) {
                            whereinfo += " and mr.countper_id='" + $('#find_countperId').val() + "'";
                        }
                        if ($('#find_start_date').val() && $('#find_end_date').val()) {
                            whereinfo += " and mr.plan_copy_time between to_date('" + $("#find_start_date").val() + "','yyyy-mm-dd') and to_date('" + $('#find_end_date').val() + "','yyyy-mm-dd')";
                        }
                        if($('#copy_type').val()){
                            whereinfo += " and mr.copy_type='"+$('#copy_type').val()+"'";
                        }
                        if($('#is_bll').val()){
                            whereinfo += " and mr.is_bll='"+$('#is_bll').val()+"'";
                        }
                        if($('#is_mrd').val()){
                            whereinfo += " and mr.is_mrd='"+$('#is_mrd').val()+"'";
                        }
                        if($('#data_source').val()){
                            whereinfo += " and mr.data_source='"+$('#data_source').val()+"'";
                        }
                        if($('#customer_kind').val()){
                            whereinfo += " and ar.customer_kind='"+$('#customer_kind').val()+"'";
                        }
                        if($('#customer_state').val()){
                            whereinfo += " and ar.customer_state='"+$('#customer_state').val()+"'";
                        }
                        if($('#customer_name').val()){
                            whereinfo += " and ar.customer_name like '%"+$('#customer_name').val()+"%'";
                        }
                        if($('#customer_code').val()){
                            whereinfo += " and ar.customer_code like '"+$('#customer_code').val()+"'";
                        }
                        if($('#customer_address').val()){
                            whereinfo += " and ar.customer_address like '"+$('#customer_address').val()+"'";
                        }
                        if($('#customer_type').val()){
                            whereinfo += " and ar.customer_type='"+$('#customer_type').val()+"'";
                        }
                        if($('#book_code').val()){
                            whereinfo +=" and b.book_code ='"+$('#book_code').val()+"'";
                        }
                        whereinfo +=" and nvl(mr.copy_state,'0') <> '9' ";

                        var bd = {
                            "cols": "mr.operate,mr.book_id,mr.ctm_archive_id,mr.meter_reading_id,mr.meter_id,mr.revise_meter_id," +
                            "mr.customer_kind,mr.meter_reading,mr.revise_reading,mr.last_meter_reading,mr.last_revise_reading," +
                            "mr.copy_type,mr.copy_time,mr.plan_copy_time,mr.quotiety,mr.area_id,mr.serviceper_id,mr.countper_id," +
                            "ar.customer_code,ar.customer_name,mr.copy_state,b.book_code,b.book_type,mr.remark,mr.address," +
                            "g.gas_type_name,gas_type_code,mr.data_source,mr.created_time,mr.modified_time," +
                            "m_1.meter_digit,m_2.meter_digit revise_meter_digit,m_1.meter_kind,m_2.meter_kind revise_meter_kind",
                            "froms": "gas_mrd_meter_reading mr " +
                            " left join gas_ctm_archive ar on ar.ctm_archive_id=mr.ctm_archive_id" +
                            " left join gas_mrd_book b on b.book_id=mr.book_id " +
                            " left join gas_biz_gas_type g on g.gas_type_id= mr.gas_type_id " +
                            " left join gas_mtr_meter m_1 on m_1.meter_id=mr.meter_id " +
                            " left join gas_mtr_meter m_2 on m_2.meter_id=mr.revise_meter_id ",
                            "wheres": whereinfo,
                            "page": true,
                            "limit":50
                        };
                        var queryUrl = resUrl + encodeURIComponent(JSON.stringify(bd));

                        xw.setRestURL(queryUrl);
                        return null;
                    }
                });
        },

        initBtn :function(){

            $(document).on("click",'.btn-default,.close',function(){
                $('#modify').css({'display':"none",'background':"none"});
                $('#modify').attr("aria-hidden","true");
                $('#modify').removeClass('in');
            });

            $('#mrd_upd_button').on('click',function(e){
                var selrows = xw.getTable().getData(true);
                if (selrows.rows.length == 0) {
                    bootbox.alert("<br><center><h4>请选择需要预览的行</h4></center><br>");
                } else if (selrows.rows.length > 1) {
                    bootbox.alert("<br><center><h4>只能修改一行</h4></center><br>");
                }else{
                    $('#modify div.modal-body').css({"margin-bottom":"-40px"})

                    var selectedrow = xw.getTable().getData(true).rows[0];
                    if(!selectedrow)
                    {
                        bootbox.alert("<br><center><h4>未找到相关数据</h4></center><br>");
                        return;

                    }
                    if(selectedrow.isMrd == '1'){
                        bootbox.alert("<br><center><h4>该抄表计划已抄,不能修改</h4></center><br>");
                        return ;
                    }
                    if(selectedrow.isBll =='1'){
                        bootbox.alert("<br><center><h4>已计费不能修改</h4></center><br>");
                        return;
                    }
                    if(selectedrow.copyState != '0' && selectedrow.copyState !='1'){
                        bootbox.alert("<br><center><h4>非新生成的抄表计划不能修改</h4></center><br>");
                        return;
                    }
                    console.log(selectedrow.areaId);
                    // console.log()
                    var area_name =  GasModSys.areaHelper.getDisplay(selectedrow.areaId);
                    $('#modify_area').html('');
                    $('#modify_area').append('<option value="'+selectedrow.areaId+'">'+area_name+'</option>');

                    GasModSys.counterUsersInArea({
                        "areaId":selectedrow.areaId,
                        "cb":function(data){
                            //console.log("data=="+JSON.stringify(data));
                            var inhtml = "";
                            if(data){
                                $.each(data,function(idx,row){
                                    inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                                })
                            }
                            $("#modify_countper").html(inhtml);
                            $("#modify_countper").val(selectedrow.countperId).attr("selected",true);

                            setTimeout(function(){

                            },100);
                            //$("#modify_countper").val("").change();

                        }
                    });
                    GasModSys.copyUsersInArea({
                        "areaId": selectedrow.areaId,
                        "countperId": selectedrow.countperId,
                        "cb": function (data) {
                            var inhtml = "";
                            $.each(data, function (idx, row) {
                                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';

                            })
                            $("#modify_serviceper").html(inhtml);
                            $("#modify_serviceper").val(selectedrow.serviceperId).attr("selected",true);
                            setTimeout(function(){

                            },100);
                          //  $("#modify_serviceper").val("").change();

                        }
                    });

                    $('#modify').css({'display':"block",'background':"rgba(0,0,0,0.3)"});
                    $('#modify').attr("aria-hidden","false");
                    $('#modify').addClass('in');

                    $('#modify_remark').val(selectedrow.remark);
                    $('#modify_address').val(selectedrow.address);
                    $('#modify_plancopytime').val(selectedrow.planCopyTime);
                    /* var countperindex = $('#modify_countper option').length;
                     var serviceperindex = $("#modify_serviceper option").length;*/

                }
            });

            //批量修改——修改抄表日期
            $('#mrd_upd_some').on('click',function(e){
                var selrows = xw.getTable().getData(true);
                if (selrows.rows.length == 0) {
                    $(this).attr("data-target","")
                    bootbox.alert("<br><center><h4>请选择需要预览的行</h4></center><br>");
                    return;
                }
                var batchids=new Array();
                var ctmids = new Array();

                $.each(selrows.rows,function(idx,row){
                    if(row.copyState=='0' || row.copyState=='1')
                    {
                        batchids.push(row.meterReadingId);
                        ctmids.push("'"+row.ctmArchiveId+"'");
                    }

                })
                if(batchids.length==selrows.rows.length){
                    $(this).attr("data-target","#stack1");

                    $("#queren").on("click",function(){
                        if(!$('#modifyplancopytime').val()){
                            bootbox.alert("<h3>请选择计划抄表日期</h3>");
                            return;
                        }
                        console.log("update to :"+$('#modifyplancopytime').val());
                        var result = Restful.updateRNQ(hzq_rest+"gasmrdmeterreading",batchids.join(','),{
                           // planCopyTime:new Date($('#modifyplancopytime').val())

                            planCopyTime : $('#modifyplancopytime').val() +" 00:00:00"
                        })
                        if(result&&result.success){
                            bootbox.alert("<h3>修改成功：共（"+result.retObj+"）条</h3>",function(){
                                xw.update();
                            });
                        }else{
                            bootbox.alert("网络故障～修改失败～")
                        }
                    })
                   /* var box = bootbox.confirm({
                        title: "批量修改抄表时间",
                      //  message:"<form>新状态<select id='form_copyState' name='copyState' class='form-control select2me chosen-select'><option value='3'>正常（待计费）</option><option  value='E'>异常(待修改)</option><option value='2'>录入(重新自动分析)</option></select></form>",
                    /!*    message:'<form>计划抄表日期:<div class="input-group input-large date-picker input-daterange" data-date-format="yyyy/mm/dd">' +
                        '<input id="modifyplancopytime" type="text" class="form-control" name="planCopyTime">' +
                        '<span class="inputclear glyphicon glyphicon-remove-circle hidden" ></span></form>',*!/
                       /!* <div class="col-md-6">
                        <label class="control-label col-md-3">抄表日期</label>
                        <div id="modify_planyear" class="input-group input-medium date date-picker" style="width: 187px;" data-date-format="yyyy-mm-dd" >
                        <input type="text" id="modify_calendar" class="form-control" style="width: 135px;margin-left:10px;" readonly>
                        <span class="input-group-btn col-md-4" style="margin-left: -10px;">
                        <button class="btn default" type="button"><i class="fa fa-calendar"></i></button>
                        </span>
                        </div>
                        </div>*!/

                       /!*<form><label class="control-label col-md-3">抄表日期</label>'+
                        '<div id="modify_planyear" class="input-group input-medium date date-picker" style="width: 187px;" data-date-format="yyyy/mm/dd" >'+
                        '<input type="text" id="modifyplancopytime" class="form-control" style="width: 135px;margin-left:10px;">'+
                        '<span class="input-group-btn col-md-4" style="margin-left: -10px;">'+
                        '<button class="btn default" type="button"><i class="fa fa-calendar"></i></button></span></div></form>*!/


                        message:'<form><div class="col-md-6">'+
                        '<label class="control-label col-md-3">抄表日期</label>'+
                            '<div id="modify_planyear" class="input-group input-medium date date-picker" style="width: 187px;" data-date-format="yyyy-mm-dd" >'+
                                '<input type="text" id="modifyplancopytime" class="form-control" style="width: 135px;margin-left:10px;" readonly>'+
                       '<span class="input-group-btn col-md-4" style="margin-left: -10px;">'+
                        '<button class="btn default" type="button"><i class="fa fa-calendar"></i></button>'+
                        '</span>'+
                        '</div>'+
                        '</div></form>',

                        buttons: {
                            cancel: {
                                label: '<i class="fa fa-times"></i> 取消'
                            },
                            confirm: {
                                label: '<i class="fa fa-check"></i> 确认'
                            }
                        },
                        callback: function (result) {
                            if(result){
                                if(!$('#modifyplancopytime').val()){
                                    bootbox.alert("<h3>请选择计划抄表日期</h3>");
                                    return;
                                }
                                console.log("update to :"+$('#modifyplancopytime').val())
                                var result = Restful.updateRNQ(hzq_rest+"gasmrdmeterreading",batchids.join(','),{
                                    planCopyTime:new Date($('#modifyplancopytime').val())
                                })
                                if(result&&result.success){
                                    bootbox.alert("<h3>修改成功：共（"+result.retObj+"）条</h3>")
                                }else{
                                    bootbox.alert("网络故障～修改失败～")
                                }
                                //console.log("result=="+JSON.stringify(result));
                            }
                        }
                    })*/
                   /* box.on("shown.bs.modal", function() {
                        //$(".chosen-select").select2()
                    });*/
                }else{
                    bootbox.alert("不能修改已计费数据");
                    return;
                }
            });

            $('#modify_add').on('click',function(e){

                var a = xw.getTable().getData(true);
                if (a.rows.length == 0) {
                    bootbox.alert("<br><center><h4>请选择需要预览的行</h4></center><br>");
                    return;
                } else if (a.rows.length > 1) {
                    bootbox.alert("<br><center><h4>只能修改一行</h4></center><br>");
                    return;
                }

                var rowdata = a.rows[0];

                var meterreadingid = rowdata.meterReadingId;

                var plancopytime = $('#modify_plancopytime').val() + " 00:00:00";//计划抄表时间

                var address= $('#modify_address').val();
                var serviceperid = $('#modify_serviceper option:selected').val();
                var countperid = $('#modify_countper option:selected').val();
                var areaid = $('#modify_area option:selected').val();

                var obj = {};

                if(plancopytime){
                    //obj.planCopyTime = new Date(plancopytime);
                    //obj.planCopyTime = new Date()
                   // var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
                    obj.planCopyTime = plancopytime;
                }
                if(address){
                    obj.address = address;
                }
                if(serviceperid){
                    obj.serviceperId = serviceperid;
                }
                if(countperid){
                    obj.countperId = countperid;
                }
                if(areaid){
                    obj.areaId = areaid;
                }
                $.ajax({
                    dataType: 'json',
                    type: "PUT",
                    async: false,
                    url:hzq_rest + "gasmrdmeterreading/"+meterreadingid,
                    data:JSON.stringify(obj),
                    contentType:"application/json; charset=utf-8;",
                    success :function(data){
                        console.log(data);
                        if(data.success){
                            bootbox.alert("<br><center><h4>修改成功!</h4></center><br>",function(){
                                $(".modal-backdrop").remove();
                            });

                            $('#modify').css({'display':"none",'background':"none"});
                            $('#modify').attr("aria-hidden","true");
                            $('#modify').removeClass('in');

                            xw.update();
                        }else{
                            bootbox.alert("<br><center><h4>修改失败！</h4></center><br>");
                            return;
                        }
                    },
                    error :function(err) {
                        console.log(err)
                        bootbox.alert("<br><center><h4>修改失败!</h4></center><br>");
                        return;
                    }
                });

            });

            //删除—— 抄表状态变为删除
            $('#mrd_del_btm').on('click',function(e){
                var selrows = xw.getTable().getData(true);

                if (selrows.rows.length == 0) {
                    bootbox.alert("<br><center><h4>请选择需要预览的行</h4></center><br>");
                    return;
                }
                var batchids=new Array();

                $.each(selrows.rows,function(idx,row){
                    if(row.copyState=='0' || row.copyState == '1')
                    {
                        batchids.push(row.meterReadingId);
                    }
                })
                if(batchids.length==selrows.rows.length){
                    var box = bootbox.confirm({
                        title: "删除未抄表记录",
                        message:"是否删除选中记录？共("+ selrows.rows.length+")条",
                        buttons: {
                            cancel: {
                                label: '<i class="fa fa-times"></i> 取消'
                            },
                            confirm: {
                                label: '<i class="fa fa-check"></i> 确认'
                            }
                        },
                        callback: function (result) {
                            if(result){
                                //console.log("update to :"+$('#form_copyState').val());
                              //  var result = Restful.updateNQ()
                                var result = Restful.updateRNQ(hzq_rest+"gasmrdmeterreading", batchids.join(','),{copyState:'9'})
                                if(result&&result.success){
                                    bootbox.alert("<h3>删除成功：共删除("+result.retObj+")条</h3>");
                                    xw.update();
                                }else{
                                    bootbox.alert("网络故障～删除失败～")
                                }
                                //console.log("result=="+JSON.stringify(result));
                            }
                        }
                    });
                }else{
                    bootbox.alert("<br><center><h4>只有未抄表记录可以修改,请重新选择</h4></center><br>");
                    return;
                }
            });
        },
    }

}();
