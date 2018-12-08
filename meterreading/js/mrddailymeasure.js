/**
 * Created by Administrator on 2017/4/20 0020.
 */
var MrdDailyMeasureAction = function () {
    var xw ;
    var operateFormat = function(){
        return {
            f:function(val){
                return "<a href='JavaScript:;'  data-id='"+val+"' class='btn_modify'>修改</a>"
            }
        }
    }();

    //所有本全部修改 -- 根据选择的条件
    $('#all_button').on('click',function(e){
        var box = bootbox.confirm({
            title: "修改所有本日均用气量",
            // message:"<form>新状态<select id='form_copyState' name='copyState' class='form-control select2me chosen-select'><option value='3'>正常（待计费）</option><option  value='E'>异常(待修改)</option><option value='2'>录入(重新自动分析)</option></select></form>",
            message:'<form><div class="col-md-6"> <div class="form-group"> <label class="control-label col-md-4">户日均用气量</label> <div class="col-md-8"> <input id="m_all_daymeasure" type="text" class="form-control" placeholder=""> </div> </div></div></form>',
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> 取消'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> 确认'
                }
            },
            callback: function (result) {
                console.log(result);
                if(result){
                    //console.log("update to :"+$('#form_copyState').val())
                  //  var result= Restful.upate(hzq_rest+"gasmrdbook/?example={'STATUS':'1'}");

					if(!$('#find_areaId').val()){
						bootbox.alert("请选择供气区域。");
						return ;
					}
					/*if(!$('#find_countperId').val()){
						bootbox.alert("请选择核算员。");
						return;
					}
					if(!$('#find_serviceperId').val()){
						bootbox.alert("请选择客户服务员。");
						return;
					}*/
                    console.log($('#m_all_daymeasure').val());
                    if(!$('#m_all_daymeasure').val()){
                        alert("请填写日均用气量");
                    }
                    var da = {dailyMeasure:parseFloat($('#m_all_daymeasure').val(),2)};

//获取所有抄表本
//restful 根据条件更新
//
/*var query = RQLBuilder.and([
	RQLBuilder.equal("areaId",$('#find_areaId').val()),
	RQLBuilder.equal("countperId",$('#find_countperId').val()),
	RQLBuilder.equal("serviceperId",$('#find_serviceperId').val())
]).rql;*/
var exampleq = {};
exampleq.areaId=$('#find_areaId').val();
if($('#find_countperId').val()){
	exampleq.countperId = $('#find_countperId').val();
}
if($('#find_serviceperId').val()){
	exampleq.serviceperId = $('#find_serviceperId').val();
}

var bas_url = hzq_rest+"gasmrdbook?example="+JSON.stringify(exampleq);
var sup = Restful.updateNQ(bas_url,JSON.stringify(da));
console.log(sup);
if(sup==true){
	 bootbox.alert("<h3>修改成功</h3>");
  //  bootbox.alert("<h3>修改成功：共（"+result.retObj+"）条</h3>");
    var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
    var whereinfo = '1=1';
    var bd = {
        "cols":"bookId,bookId as opt,bookCode,areaId,countperId,serviceperId,copyCycle,copyMonth,copyRuleday,propertyUnit,doorCount" +
        ",oldBookNo,bookType,boosterCode,dailyMeasure,address,remark",
        "froms":"gas_mrd_book",
        "wheres":whereinfo,
        "page":"true",
        "limit":50
    };
    xw.setRestURL(base_url+ encodeURIComponent(JSON.stringify(bd)));
    xw.update();
}else{
	 bootbox.alert("网络故障～修改失败～");
}
                    /*$.ajax({
                        dataType: 'json',
                        type: "PUT",
                        async: false,
                        contentType:"application/json; charset=utf-8;",
                        url:hzq_rest+'gasmrdbook/?example={"book_type":"1"}',
                        data:JSON.stringify(da),
                        //data:da,
                        success:function(data){
                            if(data.success){
                                bootbox.alert("<h3>修改成功：共（"+data.retObj+"）条</h3>");
                              //  bootbox.alert("<h3>修改成功：共（"+result.retObj+"）条</h3>");
                                var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
                                var whereinfo = '1=1';
                                var bd = {
                                    "cols":"bookId,bookId as opt,bookCode,areaId,countperId,serviceperId,copyCycle,copyMonth,copyRuleday,propertyUnit,doorCount" +
                                    ",oldBookNo,bookType,boosterCode,dailyMeasure,address,remark",
                                    "froms":"gas_mrd_book",
                                    "wheres":whereinfo,
                                    "page":"true",
                                    "limit":50
                                };
                                xw.setRestURL(base_url+ encodeURIComponent(JSON.stringify(bd)));
                                xw.update();
                            }else{
                                bootbox.alert("网络故障～修改失败～");
                            }
                        },
                        error :function(){
                            bootbox.alert("网络故障～修改失败～");
                        }
                    });*/
                }
            }
        })
    });

    //批量修改：
    $('#mark_button').on('click',function(){
        var selrows = xw.getTable().getData(true);
        if (selrows.rows.length == 0) {
            bootbox.alert("<br><center><h4>请选择需要修改的行</h4></center><br>");
            return;
        }
        var batchids=new Array();

        $.each(selrows.rows,function(idx,row){
            batchids.push(row.bookId);
        })
        if(batchids.length==selrows.rows.length){
            var box = bootbox.confirm({
                title: "批量修改日均用气量",

               // message:"<form>新状态<select id='form_copyState' name='copyState' class='form-control select2me chosen-select'><option value='3'>正常（待计费）</option><option  value='E'>异常(待修改)</option><option value='2'>录入(重新自动分析)</option></select></form>",
                message:'<form><div class="col-md-6"> <div class="form-group"> <label class="control-label col-md-4">户日均用气量</label> <div class="col-md-8"> <input id="m_daymeasure" type="text" class="form-control" placeholder=""> </div> </div></div></form>',
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
                        console.log("update to :"+$('#form_copyState').val())
                        var result = Restful.updateRNQ(hzq_rest+"gasmrdbook",batchids.join(','),{
                           // alert($('#m_daymeasure').val()),
                            dailyMeasure:$('#m_daymeasure').val()

                        })
                        if(result&&result.success){
                            bootbox.alert("<h3>修改成功：共（"+result.retObj+"）条</h3>");
                            var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
                            var whereinfo = '1=1';
                            var bd = {
                                "cols":"bookId,bookId as opt,bookCode,areaId,countperId,serviceperId,copyCycle,copyMonth,copyRuleday,propertyUnit,doorCount" +
                                ",oldBookNo,bookType,boosterCode,dailyMeasure,address,remark",
                                "froms":"gas_mrd_book",
                                "wheres":whereinfo,
                                "page":"true",
                                "limit":50
                            };
                            xw.setRestURL(base_url+ encodeURIComponent(JSON.stringify(bd)));
                            xw.update();
                        }else{
                            bootbox.alert("网络故障～修改失败～")
                        }
                        //console.log("result=="+JSON.stringify(result));
                    }
                }
            })
            box.on("shown.bs.modal", function() {
                //$(".chosen-select").select2()
            });
        }
    });

    return {
        init: function () {
        	this.initHelper();
            this.reload();
            this.initBookTree();
            this.linkage();
        },
        initHelper:function(){
        	/*$('#find_areaId').html('<option value="" name="全部"">全部</option>');
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
            });*/
           var login_user = JSON.parse(localStorage.getItem("user_info"));
            console.log(login_user);
            GasModMrd.appMeterErrorList({
                "cb":function(data){
                    var inhtml ="<option value=''>无</option>";
                    if(data){
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.parameterCode+'">'+row.parameterName+'</option>';
                        })
                        $('#find_appmetererror').html(inhtml);
                    }
                }
            })
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
        reload:function(){
            $('#divtable').html('');
            var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
           // var whereinfo = '1=1';
            var bd = {
                "cols":"bookId,bookId as opt,bookCode,areaId,countperId,serviceperId,copyCycle,copyMonth,copyRuleday,propertyUnit,doorCount" +
                ",oldBookNo,bookType,boosterCode,dailyMeasure,address,remark",
                "froms":"gas_mrd_book",
               // "wheres":whereinfo,
               "wheres":"1=0",
                "page":"true",
                "limit":50
            };
            xw=XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize : 10,
                    columnPicker : true,
                    transition : 'fade',
                    checkboxes : true,
                    checkAllToggle : true,
                    //----------------基本restful地址---
                    restURL: base_url + encodeURIComponent(JSON.stringify(bd)),
                 //   key_column:'bookId',
                    coldefs:[
                        {
                            col:"bookId",
                            friendly:"抄表本ID",
                            unique:true,
                            hidden:true,
                            nonedit:"nosend",
                            readonly:"readonly",
                            sorting:false,
                           // checkable:true,
                            index:1
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:GasModSys.areaFormat,
                            inputsource: "select",
                            readonly:"readonly",
                            // disabled:true,
                            sorting:false,
                            index:2
                        },
                        {
                            col:"countperId",
                            friendly:"核算员",
                            format: GasModSys.employeeNameFormat,
                            sorting:false,
                            index:3
                        },
                        {
                            col:"serviceperId",
                            friendly:"客户服务员",
                            format: GasModSys.employeeNameFormat,
                            sorting:false,
                            index:4
                        },
                        {
                            col:"bookCode",
                            friendly:"抄表本编号",
                            nonedit:"nosend",
                            //  hidden:true,
                            readonly:"readonly",
                            index:5
                        },
                        {
                            col:"copyCycle",
                            friendly:"抄表周期",
                            format:GasModBas.copyCycleFormat,
                            sorting:false,
                            inputsource: "select",
                            index:6
                        },
                        {
                            col:"copyMonth",
                            friendly:"抄表月份",
                            sorting:false,
                            index:7
                        },
                        {
                            col:"copyRuleday",
                            friendly:"抄表例日",
                            sorting:false,
                            index:8
                        },
                        {
                            col:"propertyUnit",
                            friendly:"产权单位",
                            hidden :true,
                            sorting:false,
                            index:9
                        },
                        {
                            col:"doorCount",
                            friendly:"户数",
                            hidden:true,
                            readonly:"readonly",
                            sorting:false,
                            index:10
                        },
                        {
                            col:"oldBookNo",
                            friendly:"原本号",
                            sorting:false,
                            hidden:true,
                            readonly:"readonly",
                            index:11
                        },
                        {
                            col:"bookType",
                            friendly:"本类型",
                            format:GasModBas.bookTypeFormat,
                            inputsource: "select",
                            readonly:"readonly",
                            index:12
                        },
                        {
                            col:"boosterCode",
                            friendly:"调压箱编号",
                            hidden:true,
                            sorting:false,
                            index:13
                        },
                        {
                            col:"dailyMeasure",
                            friendly:"户日均用气量",
                            sorting:false,
                            index:14
                        },
                        {
                            col:"address",
                            friendly:"抄表本地址",
                            sorting:false,
                            //validate:""
                            index:16
                        },
                        /*{
                            col:"opt",
                            friendly:"操作",
                            format:operateFormat,
                            sorting:false,
                            index:17
                        },*/
                        {
                            col:"remark",
                            friendly:"备注",
                            validate:"length[0-200]",
                            hidden:true,
                            sorting:false,
                            index:15
                        }

                    ],
                    findFilter: function(){//find function
                        var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
                        var whereinfo = '1=1';

						if($('#find_areaId').val()){
							whereinfo +=" and area_id ='"+$('#find_areaId').val()+"' ";
						}
						if($('#find_countperId').val()){
							whereinfo +=" and countper_id = '"+$('#find_countperId').val()+"' ";
						}
						if($('#find_serviceperId').val()){
							whereinfo +=" and serviceper_id='"+$('#find_serviceperId').val()+"' ";
						}
                        if ($('#bookNumber').val()) {
                            whereinfo += " and book_code = '"+$('#bookNumber').val()+"' ";
                        }
                        if($('#bookAddress').val()) {
                            whereinfo +=" and address like '%"+$('#bookAddress').val()+"%'";
                        }
                        if($("#newBook").is(":checked")){
                            whereinfo += " and (countper_id is null or serviceper_id is null) ";
                        }
                        var bd = {
                            "cols":"*",
                            "froms":"gas_mrd_book",
                            "wheres":whereinfo,
                            "page":"true",
                            "limit":50
                        }
                        xw.setRestURL(base_url+ encodeURIComponent(JSON.stringify(bd)));
                        return "";
                    }
                });



            //--init
        },
        linkage:function(){
            var bookId;


            $(document).on('click','.btn_modify',function(e){
                //初始化日历选择器

                var mydate = new Date();
                $('#modify_planyear #modify_calendar').val((mydate.getMonth()+1)+'-'+mydate.getDate());

                $('#modify div.modal-body').css({"margin-bottom":"-40px"})


                //初始化表单内容
                $('#modify_copymonth>div ul').empty();
                bookId = $(this).attr('data-id');

                var rows = xw.getTable().getData(false).rows;
                var selectedrow;
                rows.forEach(function(row) {
                    if(row.bookId==bookId){
                        selectedrow=row;
                    }
                });
                if(!selectedrow)
                {
                    alert("未找到相关数据");
                    return;

                }

                $('#modify').css({'display':"block",'background':"rgba(0,0,0,0.3)"});
                $('#modify').attr("aria-hidden","false");
                $('#modify').addClass('in');
                var copyMonthList,copyRuledayList;


                $("#modify_daymeasure").val(selectedrow.dailyMeasure);

            });//end==update

            $(document).on("click",'.btn-default,.close',function(){
                $('#modify').css({'display':"none",'background':"none"});
                $('#modify').attr("aria-hidden","true");
                $('#modify').removeClass('in');
            });
            $('.close,.modal-footer .btn-default').on('click',function(){
                $('#copymonth_ul>div ul li').remove();
            });

            //抄表例日选择
            var mydate = new Date();
            $('#select_planyear #calendar').val((mydate.getMonth()+1)+'-'+mydate.getDate());
            var i=0;

            $("#modify_add").on('click',function(){

                var data = {};

                data.dailyMeasure = $('#modify_daymeasure').val();

                $.ajax({
                    dataType: 'json',
                    type: "PUT",
                    async: false,
                    url:hzq_rest + "gasmrdbook/"+bookId,
                    data:JSON.stringify(data),
                    contentType:"application/json; charset=utf-8;",
                    success :function(data){
                        console.log(data);
                        if(data.success){
                            bootbox.alert("<br><center><h4>修改成功!</h4></center><br>");
                            $('#modify').css({'display':"none",'background':"none"});
                            $('#modify').attr("aria-hidden","true");
                            $('#modify').removeClass('in');
                            var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
                            var whereinfo = '1=1';
                            var bd = {
                                "cols":"bookId,bookId as opt,bookCode,areaId,countperId,serviceperId,copyCycle,copyMonth,copyRuleday,propertyUnit,doorCount" +
                                ",oldBookNo,bookType,boosterCode,dailyMeasure,address,remark",
                                "froms":"gas_mrd_book",
                                "wheres":whereinfo,
                                "page":"true",
                                "limit":50
                            };
                            xw.setRestURL(base_url+ encodeURIComponent(JSON.stringify(bd)));
                            xw.update();
                        }else{
                            bootbox.alert("<br><center><h4>修改失败！</h4></center><br>");
                        }
                    },
                    error :function(err) {
                        console.log(err)
                        bootbox.alert("<br><center><h4>修改失败!</h4></center><br>");
                    }
                });
            });
        },

        initBookTree : function(){//初始化tree的时候只加载供气区域

            var restURL = "hzqs/pla/pbmyt.do?fh=MYTPLA0000000J00&resp=bd&bd={}";
            $.ajax({
                type : 'POST',
                url : restURL,
                cache : false,
                async : false,
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify({"operator":"admin"}),
                success : function(data, textStatus, xhr) {
                    //console.log("okokfor tree");

                    var trform = Duster.buildArr($('#__dust_pbooktree'));
                    var tables = trform(data.myroot.nodes);
                    //console.log("tree="+tables)
                    $('#treetable').html(tables);
                    $('#tree_1').jstree({
                        "core" : {
                            "themes" : {
                                "responsive": false
                            }
                        },
                        "types" : {
                            "default" : {
                                "icon" : "fa fa-folder icon-state-warning icon-lg"
                            },
                            "file" : {
                                "icon" : "fa fa-file icon-state-warning icon-lg"
                            }
                        },
                        "plugins": ["types"]
                    });


                },
                error : function(err) {
                }
            });
            $(".ca_select_book").on('click',function(e){
                console.log("llloo")
                if(!$('#book_tree').hasClass("active"))
                {
                    $('#book_tree').css({
                        'position':'absolute',
                        'width':'auto',
                        'z-index':3,
                        'display':'block'}).addClass("active");
                }else{
                    $('#book_tree').css({
                        'display':'none'}).removeClass("active");
                }
                e.stopImmediatePropagation()
            });

            $(document).on('click',function (e) {
                console.log("!!!e.target.id=="+e.target.id)
                if(e.target&&e.target.id!='btn_select_book'&&e.target.id!='i_select_book')
                {
                    var isinside = (e.target.id=='book_tree');
                    $(e.target).parents().each(function(id,row) {
                        if(row.id=='book_tree'||$(row).hasClass('jstree-ocl')||$(row).hasClass('jstree-icon')||$(row).hasClass('jstree-node')){
                            isinside = true;
                        }
                    })
                    if(!isinside){
                        console.log("not inside")

                        $(".select2-chosen").each(function(dx,f){$(f).select2("close")})
                        if($('#book_tree').hasClass("active"))
                        {
                            $('#book_tree').css({
                                'display':'none'}).removeClass("active");
                        }
                    }
                    //console.log("e.target.id=="+e.target.id)
                }

            });


            $("#tree_1").on('click','ul li a',function(e){
                //判断是供气区域，核算员还是抄表员

                var code_text = $(this).context.innerText;
                console.log(code_text);
                var middle_url = "";
                var code_id =  $(this).attr("data-id");
                var query_Url =hzq_rest+ "gasmrdbook/?";
                if(code_id == null) {//查询所有
                    xw.setRestURL(query_Url);
                    xw.update();
                    return "";
                }else if(code_text.indexOf("核算员") >= 0){

                    middle_url = "query={\"countperId\":\""+code_id +"\"}";
                }else if(code_text.indexOf("客户服务员") >= 0){

                    middle_url = "query={\"serviceperId\":\""+code_id +"\"}";
                }else{

                    middle_url = "query={\"areaId\":\""+code_id +"\"}";
                }

                if(middle_url.length > 0){
                    query_Url += middle_url;
                }

                xw.setRestURL(query_Url);
                xw.update();
                $('#book_tree').css({'display':'none'}).removeClass("active");
            })
        },
    };
}();