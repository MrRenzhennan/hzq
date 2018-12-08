/**
 * Created by Administrator on 2017/6/13.
 */
var SettheneedleExamine = function(){

    var xw;
    var valueFor=function(val){
    }
    var login_user = JSON.parse(localStorage.getItem("user_info"));
    var areaid = login_user.area_id;
    var stationid = login_user.station_id;
    var userid = login_user.userId;
   /* var openButton = function() {
        return {
            f: function() {
                //return "<a data-target='#apply' data-toggle='modal'>定针执行&nbsp;<i class='fa fa-plus'></i></a> ";
                return "<a data-target='#apply' data-toggle='modal'><i class='fa fa-plus'>";
            }
        }
    }();


*/




    return  {
        init : function(){

            this.initHelper();
            this.reload();
            this.linkage();

        },
        initHelper : function(){
            $.map(GasModCsr.enumFlowStatus,function(value,key){
                $('#flowstatus').append('<option value="'+key+'">'+value+'</option>');
            })

            /*var login_user = JSON.parse(localStorage.getItem("user_info"));
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
            });*/
 $('#find_areaId').html('<option value="" name="全部"">全部</option>');
            $.each(GasModSys.areaHelper.getRawData(), function(idx, row) {
                if('1'==UserInfo.item().area_id)
                {
                    $('#find_areaId').append('<option value="'+row.areaId+'" name="'+row.areaId+'">'+row.areaName+'</option>');
                }else if (row.areaId==UserInfo.item().area_id){
                    $('#find_areaId').append('<option value="'+row.areaId+'" name="'+row.areaId+'">'+row.areaName+'</option>');
                }
            });

            if(UserInfo.item().station_id=='1')
            {
                console.log("cahnge")
                var inhtml = "<option value='"+UserInfo.item().userId+"' selected>"+UserInfo.item().employee_name+"</option>";
                $("#find_areaId").val(UserInfo.item().area_id).change();;
                $("#find_areaId").attr({disabled:"disabled"})

                $("#find_countperId").html(inhtml);
                $("#find_countperId").val(UserInfo.item().userId).change();
                $("#find_countperId").attr({disabled:"disabled"})

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

            }else{
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
            }

            /*GasModSys.areaList({
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
             })*/

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
            });

        },
        //pfi.operator as "operator",
        reload : function(){
            var whereinfo = '1=1 and mr.area_id in ( select area_id'+
                " from gas_biz_area where parent_area_id='"+areaid+"' and status<>'3' union "+
                " select area_id from gas_biz_area where status<>'3' start with area_id='"+areaid+"' connect by prior area_id=parent_area_id "+
                " )  ";
            if(stationid == '2' && userid){//抄表员
                whereinfo +=" and mr.serviceper_id='"+userid+"' "
            }
            if(stationid == '1' && userid){//核算员
                whereinfo +=" and mr.countper_id='"+userid+"' ";
            }

            var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
            var bd = {
                "cols":"mr.meter_reading_id,mr.ctm_archive_id,mr.area_id,ar.customer_code,mr.meter_reading," +
                'mr.revise_reading,mr.wf_id,mr.feedback,mr.last_meter_reading,mr.last_revise_reading,' +
                'mr.serviceper_id,mr.countper_id,'+
                "pfi.create_time,pfi.flow_inst_id,pfi.operator,pfi.flow_status,ar.customer_name,pfi.propstr128",
                "froms":"gas_mrd_meter_reading mr " +
                " inner join psm_flow_inst pfi on pfi.flow_inst_id=mr.wf_id" +
                " left join gas_ctm_archive ar on ar.ctm_archive_id=mr.ctm_archive_id ",
                //"wheres":whereinfo+" and ar.customer_state<>'99' and mr.copy_type='76' ",
                "wheres":"1=0",
                "page":"false",
               // "limit":50
            };
            xw = XWATable.init(
                {
                    //----------------table的选项-------
                    pageSize: 20, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle:true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function(data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);            //data.row holds the underlying row you supplied.
                    },
                    //----------------基本restful地址---
                    //restbase: 'json/meterreading/settheneedle/settheneedle_search.json',
                    restURL: base_url + encodeURIComponent(JSON.stringify(bd)),
                    //---------------行定义
                    coldefs: [
                        {
                            col:"areaId",
                            friendly: "供气区域",
                            format:GasModSys.areaFormat,
                            readonly: "readonly",
                            sortOrder: "asc",
                            index:1
                        },
                        {
                            col:"customerCode",
                            friendly: "客户编号",
                            orgCol:"flowInstId",
                            readonly: "readonly",
                            format:GasModMrd.customerCodeByFormat,
                            readonly: "readonly",
                            type:"string",
                            nonedit: "nosend",
                            sorting:false,
                            index :6
                        },
                        {
                            col:"customerName",
                            friendly: "客户名",
                            readonly: "readonly",
                            index:3

                        },
                        {
                            col:"createTime",
                            friendly: "申请时间",
                            readonly: "readonly",
                            index:4
                        },
                        {
                            col:"flowStatus",
                            friendly: "申请状态",
                            format:GasModCsr.flowStatusFormat,
                            readonly: "readonly",
                            index:5
                        },
                        {
                            col:"lastMeterReading",
                            friendly:"燃气表定针前读数",
                            readonly: "readonly",
                            index:6
                        },
                        {
                            col:"meterReading",
                            friendly: "燃气表读数",
                            inputsource:"datepicker",
                            readonly: "readonly",
                            index:7
                        },
                        {
                            col:"reviseReading",
                            friendly:"修正表定针前读数",
                            readonly: "readonly",
                            index:8

                        },
                        {
                            col:"reviseReading",
                            friendly: "修正表读数",
                            readonly: "readonly",
                            index:9
                        },
                        {
                            col:"lastReviseReading",
                            friendly:"修正表定针前读数",
                            readonly: "readonly",
                            index:10
                        },
                        {
                            col:"propstr128",
                            friendly: "申请人",
                            format:GasModSys.employeeNameFormat,
                            readonly: "readonly",
                            index:11
                        },
                        {
                            col:"serviceperId",
                            friendly:"客户服务员",
                            format:GasModSys.employeeNameFormat,
                            readonly:"readonly",
                            index:12
                        },
                        {
                            col:"countperId",
                            friendly:"核算员",
                            format:GasModSys.employeeNameFormat,
                            readonly:"readonly",
                            index:13

                        },
                        {
                            col:"feedback",
                            friendly: "申请原因",
                            readonly: "readonly",
                            index:14
                        },
                        {
                            col:"meterReadingId",
                            friendly:"抄表表ID",
                            readonly:"readonly",
                            hidden:true,
                            index:15

                        },
                        {
                            col:'flowInstId',
                            friendly:"流程定义ID",
                            readonly:'readonly',
                            unique:true,
                            hidden:true,
                          //  hidden :'hidden',
                            index :16
                        }



                    ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function
                       /* var filter = "keyy="+$('#find_key').val();
                        return filter;*/
                       // var resUrl = "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=";
                        var whereinfo = "1=1 ";
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
                            whereinfo += " and mr.copy_time between to_date('" + $("#find_start_date").val() + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('" + $('#find_end_date').val() + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";
                        }

                        if($('#find_customerCode').val()){
                            whereinfo += " and ar.customer_code ='"+$('#find_customerCode').val()+"' ";
                        }
                        if($('#find_bookCode').val()){
                            whereinfo +=" and mr.bookCode = '"+$('#find_bookCode').val()+"' ";
                        }
                       // alert($('#flowstatus option:selected').val());
                        if($('#flowstatus option:selected').val()){
                            whereinfo +=" and pfi.flow_status = '"+$('#flowstatus option:selected').val()+ "'";
                        }
                        //whereinfo +=" and nvl(mr.copy_state,'0') <> '9' ";
                        //var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
                        var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
                        var bd = {
                            "cols":"mr.meter_reading_id,mr.ctm_archive_id,mr.area_id,ar.customer_code,mr.meter_reading," +
                            'mr.revise_reading,mr.wf_id,mr.feedback,mr.last_meter_reading,mr.last_revise_reading,' +
                            'mr.serviceper_id,mr.countper_id,'+
                            "pfi.create_time,pfi.flow_inst_id,pfi.operator,pfi.flow_status,ar.customer_name,pfi.propstr128",
                            "froms":"gas_mrd_meter_reading mr " +
                            " inner join psm_flow_inst pfi on pfi.flow_inst_id=mr.wf_id " +
                            " left join gas_ctm_archive ar on ar.ctm_archive_id=mr.ctm_archive_id",
                            "wheres":whereinfo+" and ar.customer_state<>'99' and mr.copy_type='76' ",
                            "page":"true",
                            "limit":50
                        };

                        xw.setRestURL(base_url+ encodeURIComponent(JSON.stringify(bd)));
                        return "";
                        //xw.setRestURL(queryUrl);
                        //return null;
                    }//--findFilter
                }//--init
            );//--end init
        },
        linkage : function(){


            $('#apply1').click(function(){
                window.location="meterreading/settheneedle/settheneedle_apply.html";
            });
            $('#apply2').click(function(){
                window.location="meterreading/settheneedle/settheneedle_execute.html";
            });
            $('#errorApply').click(function () {
                window.location="meterreading/settheneedle/settheneedle_examine.html";
            });
            $('#daoru').click(function () {
                window.location="meterreading/settheneedle/settheneedle_ex_detail.html";
            });
            $('#daoru1').click(function () {
                window.location="meterreading/settheneedle/settheneedle_ex_detail.html";
            });

            //撤销流程
            $('#deleteApply').on('click',function(e){
                var selrows = xw.getTable().getData(true);
                if (selrows.rows.length == 0) {
                    bootbox.alert("<br><center><h4>请选择需要预览的行</h4></center><br>");
                    return;
                }
                var batchids=new Array();
                console.log(selrows.rows);
                var a = selrows.rows;
                if(a.length > 1){
                    bootbox.alert("<br><center><h4>请选择一行进行撤销</h4></center><br>");
                    return;
                }
                var meterreadingid_i = selrows.rows[0].meterReadingId;
                var wf_id = selrows.rows[0].flowInstId;
                var status = selrows.rows[0].flowStatus;
                bootbox.confirm("确定撤销吗?", function (result) {
                    if (result == false) {
                    } else {
                        if (status == '4') {
                            bootbox.alert("撤回成功");
                            var up = Restful.update(hzq_rest + "gasbllcorrectflow", meterreadingid_i, {
                                "copy_status": "9"
                            })
                            var up1 = Restful.update(hzq_rest + "psmflowinst", wf_id, {
                                "flowStatus": "9"
                            })
                            var bd = {"flow_inst_id": wf_id, "setp_status": '1'};
                            $.ajax({
                                dataType: 'json',
                                type: 'POST',
                                contentType: "application/json; charset=utf-8",
                                url: hzq_rest + 'psmstepinst/?example=' + encodeURIComponent(JSON.stringify(bd)),
                                data: {
                                    "stepStatus": '9'
                                },
                                success: function (result) {
                                    var bc = {"flow_inst_id": wf_id, "setp_status": '2'};
                                    $.ajax({
                                        dataType: 'json',
                                        type: 'POST',
                                        contentType: "application/json; charset=utf-8",
                                        url: hzq_rest + 'psmstepinst/?example=' + encodeURIComponent(JSON.stringify(bc)),
                                        data: {
                                            "stepStatus": '9'
                                        },
                                        success: function (result) {
                                            window.location = "meterreading/settheneedle/settheneedle_examine.html";
                                        }
                                    });
                                }
                            });


                        } else if (status == '5') {
                            bootbox.alert("已撤销不能再撤销");
                        } else if (status == '9') {
                            bootbox.alert("已撤销不能再撤销");
                        } else {
                            bootbox.alert("流程已审批撤回失败");
                        }
                    }

                });

            });

            //点击之后显示 信息
            $(document).on('click','.btn_show_detail',function(e){
                //xw.getTable
                var rows = xw.getTable().getData(false).rows;

                var flowinstid= $(this).attr('data-id');
                console.log(flowinstid);
                var selectedrow;
                rows.forEach(function(row) {
                    if(row.flowInstId==flowinstid){
                        selectedrow=row;
                    }
                });
                if(!selectedrow)
                {
                    alert("未找到相关数据");
                    return;

                }

                var dresult= Restful.findNQ(hzq_rest+"psmflowinst/"+flowinstid);
                var mresult = Restful.findNQ(hzq_rest+"gasmrdmeterreading/"+selectedrow.meterReadingId);

                console.log(typeof(dresult));
                if(dresult  && mresult){
                    var flowdata ;
                    if(dresult.propstr2048){
                        flowdata =  JSON.parse(dresult.propstr2048);
                    }else{
                        return;
                    }
                    var jdata = flowdata.flow_data;
                    $('#box_ic_money').hide();
                    $('#box_ic_measure').hide();
                    $('#box_ic_reading').hide();
                    $('#box_revise_no').hide();
                    $('#box_revise_reading').hide();
                    $('#box_revise_vbvbt').hide();
                    $('#box_last_ic_reading').hide();
                    $('#box_last_ic_measure').hide();
                    $('#box_last_ic_money').hide();
                    $('#box_last_revise_reading').hide();
                    //根据 客户类型和定针的表 来 决定显示
                   // if(jdata.setMeter !='undefined' && jdata.setMeter){
                   // if(jdata.setMeter !=='undefined' ){
                        if(jdata.smeter == '1'){//定燃气表
                            $('#box_revise_no').hide();
                            $('#box_revise_reading').hide();
                            $('#box_revise_vbvbt').hide();

                            $('#box_last_revise_reading').hide();
                            $('#sMeter').val("定针表为燃气表");

                        }else if(jdata.smeter == '2'){//定修正表
                            $('#box_revise_no').show();
                            $('#box_revise_reading').show();
                            $('#box_revise_vbvbt').show();

                            $('#box_last_revise_reading').show();
                            $('#sMeter').val("定针表为修正表");
                        }else if(jdata.smeter == '3'){//两个表都定
                            $('#box_revise_no').show();
                            $('#box_revise_reading').show();
                            $('#box_revise_vbvbt').show();

                            $('#box_last_revise_reading').show();
                            $('#sMeter').val("定针表为燃气表和修正表");

                        }
                  //  }
                    if(jdata.customerType == 'I' || jdata.customerType == 'i'){//是不是IC卡表
                        $('#box_ic_reading').show();
                        $('#box_ic_measure').show();
                        $('#box_ic_money').show();
                        $('#box_last_ic_reading').show();
                        $('#box_last_ic_measure').show();
                        $('#box_last_ic_money').show();
                    }

                    $('#linkman').val(jdata.linkMan);
                    $('#linkphone').val(jdata.linkPhone);


                    $('#meterNo').val(jdata.meterNo);
                    $('#lastmeterReading').val(mresult.lastMeterReading);
                    $('#meterReading').val(mresult.meterReading);

                    $('#reviseNo').val(jdata.reviseMeterNo);
                    $('#reviseReading').val(mresult.reviseReading);
                    $('#lastReviseReading').val(mresult.lastReviseReading);

                    $('#vbVbt').val(jdata.vbVbt);
                    $('#lastaccountgasnum').val(mresult.lastAccumulatedGas);
                    $('#lastremaingasnum').val(mresult.lastRemaingAsnum);
                    $('#lastcardbalanceesum').val(mresult.lastCardBalancEsum);
                    $('#accountgasnum').val(mresult.accumulatedGas);
                    $('#remaingasnum').val(mresult.remaingAsnum);
                    $('#cardbalanceesum').val(mresult.cardBalancEsum);
                    $('#feedback').val(mresult.feedback);
                    $('#remark').val(mresult.remark);
                    pic(jdata.meterReadingId);
                }

            });

        },
    }



}();