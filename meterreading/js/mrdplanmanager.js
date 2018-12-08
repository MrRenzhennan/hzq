/**
 * Created by belle on 2017/4/9.
 */
var MrdPlanManagerAction = function(){
    var rf;

    return {
        init : function(){
            this.initAreaHelper();
            this.reload();
            //this

        },
        initAreaHelper:function(){

            // 供气区域 select init
           /* $.map(GasModSys.areaHelper.getData(), function(value, key) {
                $('#find_areaId').append('<option value="'+key+'">'+value+'</option>');
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

        },

        reload : function(){
            var login_user =JSON.parse(localStorage.getItem("user_info")) ;
            console.log(login_user);
            console.log(login_user.userId);
            var loginuser_area_id = login_user.area_id;
            console.log(loginuser_area_id);
            //没有的话就查询今年的

            var nowyear = new Date();
            $('#divtable').html('');

            var bwhereinfo =" ";
            var awhereinfo ="";
            if(login_user.station_id == '1'){//核算员

                bwhereinfo += " and area_id='"+login_user.area_id+"' and countper_id='"+login_user.userId+"' " ;
                awhereinfo+=" and area_id='"+login_user.area_id+"'  ";

            }else if(login_user.station_id == '2'){//抄表员

                bwhereinfo +=" and area_id='"+login_user.area_id+"' and serviceper_id='"+login_user.userId+"' ";
                awhereinfo+=" and area_id='"+login_user.area_id+"'  ";
            }else{
                bwhereinfo +=" and area_id in ( select area_id "+
                    " from gas_biz_area where parent_area_id='"+login_user.area_id+"' and status<>'3' union "+
                    " select area_id from gas_biz_area where status<>'3' start with area_id='"+login_user.area_id+"' connect by prior area_id=parent_area_id "+
                    " )  ";
                awhereinfo+=" and area_id in ( select area_id "+
                    " from gas_biz_area where parent_area_id='"+login_user.area_id+"' and status<>'3' union "+
                    " select area_id from gas_biz_area where status<>'3' start with area_id='"+login_user.area_id+"' connect by prior area_id=parent_area_id "+
                    " )  ";
            }
            var urlformanytables ='/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=';

            var bd={"cols":"distinct b.book_id,b.book_code,b.address,b.book_type,b.area_id,b.countper_id,b.serviceper_id," +
            " to_char(mr.plan_copy_time,'yyyy-mm-dd') plan_copy_time,re.plan_count,re.copyed_count,c.tDoorCount,c.suspended_count,c.normal_count ",
            "froms":" gas_mrd_meter_reading mr " +
            " left join (select count(1) tDoorCount,book_id,sum(case when customer_state='01' then 1 else 0 end) normal_count,sum(case when customer_state='02' then 1 else 0 end) suspended_count from gas_ctm_archive where customer_state<>'99' "+awhereinfo+" group by book_id) c on c.book_id=mr.book_id " +
            " left join (select sum(1)  plan_count,book_id,plan_copy_time ,sum(case when is_mrd='1' then 1 else 0 end)  copyed_count  " +
            " from gas_mrd_meter_reading where copy_state<>'9' "+bwhereinfo +" group by  book_id,plan_copy_time) " +
            " re on to_char(re.plan_copy_time,'yyyy-mm-dd')=to_char(mr.plan_copy_time,'yyyy-mm-dd') and re.book_id=mr.book_id " +
            " left join gas_mrd_book b on b.book_id = mr.book_id " ,

                "wheres":"1=0",
            "page":"true",
            "limit":50
            };

            $('#divtable').html('');
            var basePath = '';
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
                    rowClicked: function(data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);//data.row holds the underlying row you supplied.
                        //点击行元素-打开抄表本计划详情页：
                        location.href = '/meterreading/plan/detailsofsupply_area.html?areaId='+data.row.areaId+'&copyyear='+ data.row.planCopyTime+'&bookid='+data.row.bookId;
                    },
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    coldefs:[
                    {
                        col : 'areaId',
                        friendly : '供气区域',
                        sorting:false,
                        format:GasModSys.areaFormat,
                        index : 3
                    },
                    {
                        col:'bookId',
                        frinedly:'抄表本ID',
                        sorting:false,
                        hidden:true,
                        index:1
                    },
                    {
                        col : 'planCopyTime',
                        friendly : '计划日期',
                        sorting:false,
                        index : 2
                    },

                    {
                        col : 'countperId',
                        friendly : '核算员',
                        format: GasModSys.employeeNameFormat,
                        sorting:false,
                        index : 4
                    },
                    {
                        col : 'serviceperId',
                        friendly : '客户服务员',
                        format: GasModSys.employeeNameFormat,
                        sorting:false,
                        index : 5
                    },
                    {
                        col:'bookCode',
                        orgCol:"bookId",
                        friendly:'抄表本编号',
                        format:GasModMrd.bookCodeByFormat,
                        readonly: "readonly",
                        type:"string",
                        nonedit: "nosend",
                        sorting:false,
                        index :6
                    },
                    {
                        col:"bookType",
                        friendly:'抄表本类型',
                        format:GasModBas.bookTypeFormat,
                        sorting:false,
                        index : 7
                    },
                    {
                        col:"address",
                        friendly:'地址',
                        sorting:false,
                        index: 8
                    },
                    {
                        col:'copyedCount',
                        friendly:'当日已抄户数',
                        sorting:false,
                        index : 9
                    },
                    {
                        col:'planCount',
                        friendly:'已生成计划数',
                        sorting:false,
                        index:10
                    },
                    {
                        col : 'normalCount',
                        friendly : '抄表本总正常户数',
                        sorting:false,
                        index : 11
                    },
                    {
                        col : 'suspendedCount',
                        friendly : '抄表本总暂停用气户数',
                        sorting:false,
                        index : 12
                    },
                    {
                        col : 'tDoorCount',
                        friendly : '抄表本总户数',
                        sorting:false,
                        index : 13
                    },

                ],
                // 查询过滤条件
                findFilter : function(){
                    var areaId_select = $('#find_areaId option:selected').val();
                     //   console.log($('.year').val());
                    //console.log($('.yearpicker').val());
                     var   copyyear_select = $('.yearpicker input').val();
                    var copyerid = $("#find_countperId option:selected").val();
                    var serviceperid = $('#find_serviceperId option:selected').val();
                    var bookid = $('#find_bookId option:selected').val();
                    var bookcode= $('#find_bookCoder').val();
                    var whereinfo ="",bwhereinfo="",cwhereinfo ="";
                    var dwhereinfo ="";

                    if (areaId_select) {
                        whereinfo += " mr.area_id='" + areaId_select + "' and ";
                        bwhereinfo += " area_id='" + areaId_select + "' and ";
                        dwhereinfo += " and area_id ='"+areaId_select+"' ";
                    }else{
                        whereinfo +=" mr.area_id='"+login_user.area_id+"' and ";
                        bwhereinfo +=" area_id='"+login_user.area_id+"' and ";
                        dwhereinfo += " and area_id ='"+login_user.area_id+"' ";
                    }
                   // console.log("copyyear_select="+copyyear_select+",areadid="+areaId_select+",copyerid="+copyerid)

                    if (copyyear_select) {
                        whereinfo += " extract(year from mr.plan_copy_time) =" + copyyear_select +" and ";
                    }else{
                        whereinfo +=" to_char(mr.plan_copy_time,'yyyy-mm-dd') >= to_char(sysdate,'yyyy-mm-dd') and ";
                    }

                    if(copyerid){
                        whereinfo += " mr.countper_id='" + copyerid +"' and ";
                        bwhereinfo +=" countper_id='"+copyerid+"' and ";
                    }else{
                        if(login_user.station_id == '1'){//核算员
                            whereinfo +="  mr.countper_id='"+login_user.userId+"'  and ";
                            bwhereinfo += " countper_id='"+login_user.userId+"' and " ;

                        }
                        if(login_user.station_id == '2'){//抄表员
                            whereinfo += " mr.serviceper_id='"+login_user.userId+"' and ";
                            bwhereinfo +=" serviceper_id='"+login_user.userId+"' and ";
                        }

                    }
                    if(serviceperid){
                        whereinfo +=" mr.serviceper_id='"+serviceperid+"' and ";
                        bwhereinfo += " serviceper_id='"+serviceperid+"' and ";
                    }else{
                        if(login_user.station_id == '1'){//核算员
                            whereinfo +="  mr.countper_id='"+login_user.userId+"'  and ";
                            bwhereinfo += " countper_id='"+login_user.userId+"' and " ;

                        }
                        if(login_user.station_id == '2'){//抄表员
                            whereinfo += " mr.serviceper_id='"+login_user.userId+"' and ";
                            bwhereinfo +=" serviceper_id='"+login_user.userId+"' and ";
                        }
                    }
                    if(bookid){
                        whereinfo +=" mr.book_id='"+bookid+"'  and ";
                        bwhereinfo += " book_id = '"+bookid+"' and ";
                        dwhereinfo +=" and book_id='"+bookid+" '";
                    }
                    if(bookcode){
                        whereinfo +=" mr.book_code='"+bookcode+"' and ";
                        bwhereinfo +=" book_code='"+bookcode+"' and ";
                       // dwhereinfo +=" and book_id='"+GasModMrd.getbook+"'"
                    }
                    whereinfo +=' 1=1 ';
                    bwhereinfo += " copy_state<>'9' and 1=1 ";


                    var bd={"cols":"distinct b.book_id,b.book_code,b.address,b.book_type,b.area_id,b.countper_id,b.serviceper_id," +
                    " to_char(mr.plan_copy_time,'yyyy-mm-dd') plan_copy_time,re.plan_count,re.copyed_count,c.tDoorCount,c.suspended_count,c.normal_count ",
                        "froms":" gas_mrd_meter_reading mr " +
                        " left join (select count(1) tDoorCount,book_id,sum(case when customer_state='01' then 1 else 0 end) normal_count,sum(case when customer_state='02' then 1 else 0 end) suspended_count from gas_ctm_archive where customer_state<>'99' "+dwhereinfo+" group by book_id) c on c.book_id=mr.book_id " +
                        " left join (select sum(1)  plan_count,book_id,plan_copy_time ,sum(case when is_mrd='1' then 1 else 0 end)  copyed_count  " +
                        " from gas_mrd_meter_reading where "+bwhereinfo +" group by  book_id,plan_copy_time) " +
                        " re on to_char(re.plan_copy_time,'yyyy-mm-dd')=to_char(mr.plan_copy_time,'yyyy-mm-dd') and re.book_id=mr.book_id " +
                        " left join gas_mrd_book b on b.book_id = mr.book_id " ,
                        "wheres":"  "+whereinfo +
                        " order by b.book_id,b.serviceper_id ",
                        "page":"true",
                        "limit":50
                    };

                    console.log("findFilter::");

                    xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                    return null;
                }
            }); // --init

            $('.yearpicker').datepicker({
                startView: 'decade',
                minView: 'decade',
                format: 'yyyy',
                maxViewMode: 2,
                minViewMode:2,
                autoclose: true
            });
            //抄表计划生成 - 按钮
            $('#add_btn_plan').on('click',function(e){
                var data = {};
                var   copyyear_select = $('.yearpicker input').val();
                if(!copyyear_select){
                    alert("请选择计划年份");
                    return ;
                }
                if( $('#find_areaId option:selected').val() == null || typeof($('#find_areaId option:selected').val()) == "undefined" ){
                    alert("请选择供气区域");
                    return;
                }
                if( $('#find_countperId option:selected').val() == null || typeof( $('#find_countperId option:selected').val()) == "undefined" ){
                    alert("请选择核算员");
                    return ;
                }
                if($('#find_serviceperId option:selected').val() == null || typeof($('#find_serviceperId option:selected').val())=="undefined"){
                    alert("请选择客户服务员");
                    return ;
                }
                if($('#find_bookId option:selected').val() == null || typeof($('#find_bookId option:selected').val()) == "undefined"){
                    alert('请选择抄表本');
                    return ;
                }
                $("#generate").hide();
               // hzqs/pla/pbisp.do?fh=ISPPLA0000000J00&resp=bd&bd={"areaid":"15","countperid":"12590","planyear":"2017"}
                var bd={"areaid":$('#find_areaId option:selected').val(),"countperid":$('#find_countperId option:selected').val(),"planyear":copyyear_select,"serviceperid":$('#find_serviceperId option:selected').val(),"bookid":$('#find_bookId option:selected').val()};
                $.ajax({
                    dataType : 'json',
                    type : 'get',
                    url :'/hzqs/pla/pbisp.do?fh=ISPPLA0000000J00&resp=bd&bd='+JSON.stringify(bd),
                    async: false,
                    data : data,
                    success : function(result){
                        $("#generate").show();
                        if(result.err_code == "1"){
							bootbox.alert("<br><center><h4>保存成功!</h4></center><br>");
                        }else{
                        	bootbox.alert("<br><center><h4>"+result.msg+"!</h4></center><br>");
                        }

                        var login_user = localStorage.getItem("user_info");

                        var bd ={"cols":"distinct b.book_id,b.book_code,b.address,b.book_type,b.area_id ,b.countper_id,b.serviceper_id,to_char(mr.plan_copy_time,'yyyy-mm-dd') plan_copy_time,re.t_door_count,re.copyed_count," +
                        "cr.normal_count," +
                        "cr.suspended_count",
                            "froms":" gas_mrd_meter_reading mr left join gas_mrd_book b on b.book_id = mr.book_id " +
                            "  left join (select book_id, sum(case when customer_state='01' then 1 else 0  end) over(partition by book_id) as normal_count," +
                            " sum( case when customer_state='02' then 1 else 0 end) over(partition by book_id) as suspended_count  " +
                            " from gas_ctm_archive where area_id='"+login_user.area_id+"' and nvl(current_flag,'Y')='Y' ) cr on cr.book_id = mr.book_id" +
                            " inner join ( select count(1) as t_door_count,to_char(m1.plan_copy_time,'yyyy-mm-dd') plan_copy_time,m1.book_id,sum(case when m1.is_mrd='1' then 1 else 0 end) copyed_count from gas_mrd_meter_reading m1 where m1.area_id='"+login_user.area_id+"' group by to_char(m1.plan_copy_time,'yyyy-mm-dd'), m1.book_id) re  " +
                            " on re.plan_copy_time= to_char(mr.plan_copy_time,'yyyy-mm-dd') and re.book_id = mr.book_id  " ,
                            "wheres":
                            " to_char(mr.plan_copy_time,'yyyy') ='"+nowyear.getFullYear()+"'" +
                            " and mr.area_id='"+login_user.area_id+"'",
                            "page":'true',
                            "limit":'50'};
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        xw.update();
                        //return null;
                    },
                    error : function(err){
                        $("#generate").show();
                        console.log(err);
                    }
                });
            });
        },

    }
}();
/* var bd = {"cols":"rank() over(order by to_char(mr.plan_copy_time,'yyyy') desc) rank,mr.area_id,to_char(mr.plan_copy_time,'yyyy') planyear," +
 "0 countserviceperid,0 countserviceperid,0 countnormalbook,0 countbusinessbook ,0 sumNDoorCount,0 sumBDoorCount",
 //"count(distinct mr.serviceper_id) countserviceperid," +
 //  "count(distinct mr.countper_id) countcountperid," +
 //  "sum(case when mr.customer_kind='1' then 1 else 0 end) countnormalbook," +
 // "sum(case when mr.customer_kind='9' then 1 else 0 end) countbusinessbook," +
 // "sum(case when mr.customer_kind='1' then b.door_count else 0 end) sumNDoorCount," +
 // "sum(case when mr.customer_kind='9' then b.door_count else 0 end) sumBDoorCount",
 "froms":"gas_mrd_meter_reading mr left join gas_biz_area sa on mr.area_id=sa.area_id inner join gas_sys_user su on sa.area_id=su.area_id left join gas_mrd_book b on b.book_id=mr.book_id",
 "wheres":whereinfo+"b.book_id=mr.book_id and (sa.parent_area_id='"+loginuser_area_id+"' or sa.area_id='"+loginuser_area_id+"' ) "+
 " group by mr.area_id,to_char(mr.plan_copy_time,'yyyy') ",
 "page":"true",
 "limit":50};*/
/* rf= RFTable.init(*/