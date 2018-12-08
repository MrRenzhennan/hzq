

var MrdNonResidentAction = function () {
    var xw ;
    var selectedrow;

    var login_user = JSON.parse(localStorage.getItem("user_info"));
    var areaid = login_user.area_id;
    var stationid = login_user.station_id;
    var userid = login_user.userId;

    var operateFormat = function(){
        return {
            f:function(val){
                return "<a href='JavaScript:;'  data-id='"+val+"' class='btn_modify'>修改</a>"
            }
        }
    }();


    //var

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.initBookTree();
            this.linkage();
            this.reload();

        },
        initHelper :function(){
            var login_user = JSON.parse(localStorage.getItem("user_info"));
            console.log(login_user);
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
                $("#find_countperId").val(UserInfo.item().userId).change();;
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


            $.map(GasModCtm.enumCustomerState, function(value, key) {
                $('#find_customer_state').append('<option value="'+key+'">'+value+'</option>');
            });
        },
        reload:function(){

            var nd = new Date();
            var nyear = nd.getFullYear();

            $('#divtable').html('');

            var zwhere ="";
            if(stationid == '2' && userid){//抄表员

                zwhere +=" and serviceper_id='"+userid+"' ";
            }else if(stationid == '1' && userid){//核算员

                zwhere +=" and countper_id='"+userid+"' ";
            } else{
                zwhere +=' and area_id in ( select area_id'+
                " from gas_biz_area where parent_area_id='"+areaid+"' and status<>'3' union "+
                " select area_id from gas_biz_area where status<>'3' start with area_id='"+areaid+"' connect by prior area_id=parent_area_id "+
                " ) ";
            }

            var bd = {"cols":"b.book_id,b.book_code,b.area_id,b.countper_id,b.serviceper_id,bu.business_rule_day_id," +
            "bu.copy_month,ar.ctm_archive_id,ar.customer_state,ar.customer_code,ar.customer_name,ar.customer_address," +
            "bu.copy_rule_day,ar.meter_user_name,q.plancount",
                "froms":"gas_ctm_archive ar inner join gas_mrd_business_rule_day bu on bu.ctm_archive_id=ar.ctm_archive_id " +
                " inner join gas_ctm_meter m on m.ctm_archive_id=ar.ctm_archive_id " +
                " left join (select count(1) plancount ,ctm_archive_id from gas_mrd_meter_reading where is_mrd in ('0','1') and copy_state<>'9' and to_char(plan_copy_time,'yyyy')='"+nyear+"' "+zwhere+" group by ctm_archive_id ) q on q.ctm_archive_id=bu.ctm_archive_id " +
                " left join gas_mrd_book b on b.book_id=bu.book_id ",
                "wheres": "1=0" ,
                "page":"true",
                "limit":50
            };

            xw= XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                  //  key_column:'mrdDetailId',
                    coldefs:[
                        {
                            col:"ctmArchiveId",
                            friendly:"客户档案id",
                            unique:true,
                            hidden:true,
                            nonedit:"nosend",
                            readonly:"readonly",
                            sorting:false,
                            index:1
                        },
                        {
                            col:"bookId",
                            friendly:"抄表本ID",
                            hidden:true,
                            index:2
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:GasModSys.areaFormat,
                            index:3
                        },
                        {
                            col:"countperId",
                            friendly:"核算员",
                            format:GasModSys.employeeNameFormat,
                            index:4
                        },
                        {
                            col:"serviceperId",
                            friendly:"客户服务员",
                            format:GasModSys.employeeNameFormat,
                            index:5
                        },
                        {
                            col:'bookCode',
                            friendly:"抄表本编号",
                            index:6

                        },
                        {
                            col:"customerCode",
                            friendly:"客户编号",
                            index:7
                        },
                        {
                            col:"customerName",
                            friendly:"客户名称",
                            index:8
                        },
                        {
                            col:"meterUserName",
                            friendly:"表户名称",
                            index: 9
                        },
                        {
                            col:"customerAddress",
                            friendly:"客户地址",
                            index:10
                        },
                        {
                            col:"customerState",
                            friendly:"客户状态",
                            format:GasModCtm.customerStateFormat,
                            index:11
                        },
                        {
                            col:"copyMonth",
                            friendly:"抄表月份",
                            index:12
                        },
                        {
                            col:"copyRuleDay",
                            friendly:"抄表例日",
                            index:13
                         },
                        {
                            col:"plancount",
                            friendly:"生成计划数",
                            index:14
                        },
                        {
                            col:"businessRuleDayId",
                            friendly:"操作",
                            format:operateFormat,
                            sorting:false,
                            index:15
                        }
                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var nd = new Date();
                        var nyear = nd.getFullYear();

                        var mrd_url ="/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=";
                       // var whereinfo = "1=1 and ar.customer_state <>'99' ";
                        var whereinfo =' 1=1 ';
                        var zwhere ="";
                        if($('#find_areaId').val()){
                            whereinfo +=" and b.area_id='"+$('#find_areaId').val()+"' ";
                        }else{
                            whereinfo+=' and b.area_id in ( select area_id'+
                                " from gas_biz_area where parent_area_id='"+areaid+"' and status<>'3' union "+
                                " select area_id from gas_biz_area where status<>'3' start with area_id='"+areaid+"' connect by prior area_id=parent_area_id "+
                                " ) ";
                            zwhere+=' and area_id in ( select area_id'+
                                " from gas_biz_area where parent_area_id='"+areaid+"' and status<>'3' union "+
                                " select area_id from gas_biz_area where status<>'3' start with area_id='"+areaid+"' connect by prior area_id=parent_area_id "+
                                " ) ";
                        }
                        if($('#find_countperId').val()){
                            whereinfo +=" and b.countper_id='"+$('#find_countperId').val()+"' ";
                        }
                        if($('#find_serviceperId').val()){
                            whereinfo +=" and b.serviceper_id='"+$('#find_serviceperId').val()+"' ";
                        }
                        if(stationid == '2' && userid){//抄表员
                            whereinfo +=" and b.serviceper_id='"+userid+"' ";
                            zwhere +=" and serviceper_id='"+userid+"' ";
                        }else if(stationid == '1' && userid){//核算员
                            whereinfo +=" and b.countper_id='"+userid+"' ";
                            zwhere +=" and countper_id='"+userid+"' ";
                        }
                        whereinfo +=" and b.status<>'3' ";

                        if($("#bookCode").val()){
                            whereinfo +=" and b.book_code='"+$("#bookCode").val()+"'";
                            zwhere +=" and book_code='"+$("#bookCode").val()+"' ";
                        }
                        if($("#customerCode").val() && $("#customerCode").val().trim().length > 0){
                            whereinfo +=" and ar.customer_code='"+$("#customerCode").val().trim()+"' ";
                        }
                        if($("#customerName").val()){
                            whereinfo +=" and ar.customer_name like '%"+$("#customerName").val()+"%' ";
                        }
                        if( $('#find_customer_state').val()){
                            whereinfo += " and nvl(ar.customer_state,'01') ='"+$('#find_customer_state').val()+"' ";
                        }
                        if($('#planyear').val()){
                            //nyear = $('#planyear').val();
                            nyear = $('.yearpicker input').val();
                        }
                        if($('#find_iscreate option:selected').val() == "2"){
                            whereinfo +=" and nvl(q.plancount,0)=0  "
                        }else if($('#find_iscreate option:selected').val() == '1'){
                            whereinfo += " and nvl(q.plancount,0) > 0 "
                        }
                       /* if($('#find_month option:selected').val()){
                            var m_s = $('#find_month option:selected').val();
                            /!*if(m_s =='1'){
                                whereinfo +=" and (( instr(bu.copyMonth,'"+m_s+"')=1 and instr(bu.copyMonth,'12')<=0 ) or (instr(bu.copyMonth,'"+m_s+",')>=1 ) ) ";
                            }else if(m_s == '2'){
                                whereinfo +=" and (( instr(bu.copyMonth,'"+m_s+"')=1 and instr(bu.copyMonth,'12')<=0) or (instr(bu.copyMonth,'"+m_s+",')>=1  or (instr(bu.copyMonth,'"+m_s+",')>=1 or (instr(bu.copyMonth,',"+m_s+"')>=1 and instr(bu.copyMonth,'1,') >=1))) ";
                            }else{*!/
                            whereinfo +=" and (( instr(bu.copyMonth,'"+m_s+"')=1) or (instr(bu.copyMonth,'"+m_s+",')>=1 or instr(bu.copyMonth,',"+m_s+"' )>=1)) ";
                            //}

                            //whereinfo +=" and instr(b.copyMonth,'')"

                        }*/
                        whereinfo +=" and nvl(m.meter_user_state,'01')<>'99' ";
                        whereinfo += " and nvl(ar.customer_state,'01') <>'99' order by b.book_id,b.serviceper_id,ar.customer_code "
                        var bd = {"cols":"b.book_id,b.book_code,b.area_id,b.countper_id,b.serviceper_id,bu.business_rule_day_id," +
                        "bu.copy_month,ar.ctm_archive_id,ar.customer_state,ar.customer_code,ar.customer_name,ar.customer_address," +
                        "bu.copy_rule_day,ar.meter_user_name,q.plancount",//,bu.copy_seq,z.mrdcount
                            "froms":"gas_ctm_archive ar inner join gas_mrd_business_rule_day bu on bu.ctm_archive_id=ar.ctm_archive_id " +
                            " inner join gas_ctm_meter m on m.ctm_archive_id=ar.ctm_archive_id " +
                           // " left join (select count(1) plancount ,ctm_archive_id from gas_mrd_meter_reading where copy_state<>'9' and to_char(plan_copy_time,'yyyy')='"+nyear+"' group by ctm_archive_id ) q on q.ctm_archive_id=bu.ctm_archive_id " +
                            " left join (select count(1) plancount,ctm_archive_id from gas_mrd_meter_reading where copy_state<>'9' and is_mrd='0' group by ctm_archive_id ) q on q.ctm_archive_id= bu.ctm_archive_id "+
                            " left join gas_mrd_book b on b.book_id=bu.book_id ",
                            "wheres": whereinfo,
                            "page":"true",
                            "limit":50
                        };

                        xw.setRestURL(mrd_url+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    },

                    onAdded: function(ret,jsondata){
                    },

                    onUpdated: function(ret,jsondata){
                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
        },

        initBookTree : function(){//初始化tree的时候只加载供气区域

            var nd = new Date();
            var nyear = nd.getFullYear();

            //var restURL = "hzqs/pla/pbftr.do?fh=FTRPLA0000000J00&resp=bd&bd={}";
            var restURL = "hzqs/pla/pbmyt.do?fh=FTRPLA0000000J00&resp=bd&bd={}";
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
                            },
                            "check_callback" : function(e,data){
                              console.log(data)
                            },
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
              //  console.log(code_text);
                var middle_url = "";

                if($(this).hasClass("a_tree_level4")){
                    console.log("click:"+e)
                    var parent = $('#tree_1').jstree('get_selected');
                    if(!$('#tree_1').jstree("is_leaf", parent))
                    {
                        return;
                    }
                    var node = $(e.target.id)
                    e.stopImmediatePropagation();
                    //打开这个用户下的本
                    var filter=RQLBuilder.and([
                            RQLBuilder.equal("status","1"),
                            RQLBuilder.equal("serviceperId",$(this).attr("data-id")),
                            RQLBuilder.equal("bookType","9")
                        ]);
                    var rows = Restful.findNQ(hzq_rest + 'gasmrdbook?fields={"bookId":1,"bookCode":1,"address":1}&query='+filter.rql());
                    console.log("data=="+JSON.stringify(rows));
                    if(rows&&rows.length>0){
                        $.each(rows,function(idx,row){
                            var text = "本编号 "+row.bookCode+" ";
                            if(row.address){
                                text+=row.address;
                            }
                            var node = $('#tree_1').jstree("create_node", parent,{"text":
                                text}, 'inside')

                            $('#tree_1').jstree('get_node',node).data={
                                "text":text,
                                "bookId":row.bookId,"bookCode":row.bookCode};    
                        })
                        
                    }
                    return;
                }

                var code_id =  $(this).attr("data-id");
                var whereinfo = "1=1 and ar.customer_state <>'99' ";
                var zwhere = "";
                var mrd_url ="/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=";
                var parent = $('#tree_1').jstree('get_selected');
                if(parent){
                    var node = $('#tree_1').jstree('get_node',parent)
                    if(node&&node.data)
                    {   
                        code_text=node.data.text
                        code_id=node.data.bookId;
                    }
                }
                if(!code_text) {//查询所有
                    //xw.setRestURL(mrd_url);
                    //xw.update();
                    //return "";
                    var code_id=$('#'+parent).find("a").attr('data-id');

                    if(code_id){
                        whereinfo += " and b.area_id='"+code_id +"'";
                        zwhere +=" and area_id='"+code_id+"' ";
                    }
                    console.log("codeid="+code_id)
                }else if(code_text.indexOf("核算员") >= 0){
                    whereinfo += " and b.countper_id='"+code_id +"'";
                    zwhere +=" and countper_id='"+code_id+"' ";
                }else if(code_text.indexOf("客户服务员") >= 0){
                    whereinfo += " and b.serviceper_id='"+code_id +"'";
                    zwhere +=" and serviceper_id='"+code_id+"' ";
                }else if(code_text.indexOf("编号") >= 0){
                    whereinfo += " and b.book_id='"+code_id+"' ";
                    zwhere +=" and book_id='"+code_id+"' ";
                }else {
                    whereinfo += " and b.area_id='"+code_id +"' ";
                    zwhere +=" and area_id='"+code_id+"' ";
                }

                if(stationid == '2' && userid){//抄表员
                    whereinfo +=" and b.serviceper_id='"+userid+"' "
                    zwhere +=" and serviceper_id='"+userid+"' ";
                }else if(stationid == '1' && userid){//核算员
                    whereinfo +=" and b.countper_id='"+userid+"' ";
                    zwhere += " and countper_id='"+userid+"' ";
                }else{
                    whereinfo +=' and b.area_id in ( select area_id'+
                        " from gas_biz_area where parent_area_id='"+areaid+"' and status<>'3' union "+
                        " select area_id from gas_biz_area where status<>'3' start with area_id='"+areaid+"' connect by prior area_id=parent_area_id "+
                        " ) ";
                    zwhere += " and area_id in ( select area_id"+
                    " from gas_biz_area where parent_area_id='"+areaid+"' and status<>'3' union "+
                    " select area_id from gas_biz_area where status<>'3' start with area_id='"+areaid+"' connect by prior area_id=parent_area_id "+
                    " ) ";
                }
                whereinfo +=" and b.status<>'3' ";

                if($("#bookCode").val()){
                    whereinfo +=" and b.book_code='"+$("#bookCode").val()+"' ";
                    zwhere +=" and book_code='"+$("#bookCode").val()+"' ";
                }
                if($("#customerCode").val()){
                    whereinfo +=" and ar.customer_code='"+$("#customerCode").val()+"' ";

                }
                if($("#customerName").val()){
                    whereinfo +=" and ar.customer_name like '%"+$("#customerName").val()+"%' ";
                }
                if( $('#find_customer_state').val()){
                    whereinfo += " and nvl(ar.customer_state,'01') ='"+$('#find_customer_state').val()+"' ";
                }
                if($('#planyear').val()){
                    //whereinfo +=
                    nyear =  $('.yearpicker input').val();
                }
                if($('#find_iscreate option:selected').val() == "2"){
                    whereinfo +=" and nvl(q.plancount,0)=0  "
                }else if($('#find_iscreate option:selected').val() == '1'){
                    whereinfo += " and nvl(q.plancount,0) > 0 "
                }

                whereinfo +=" and nvl(m.meter_user_state,'01')<>'99' ";
                whereinfo += " and nvl(ar.customer_state,'01') <>'99' order by b.book_id,b.serviceper_id,ar.customer_code "
                var bd = {"cols":"b.book_id,b.book_code,b.area_id,b.countper_id,b.serviceper_id,bu.business_rule_day_id," +
                "bu.copy_month,ar.ctm_archive_id,ar.customer_state,ar.customer_code,ar.customer_name,ar.customer_address," +
                "bu.copy_rule_day,ar.meter_user_name,q.plancount ",//,bu.copy_seq,z.mrdcount
                    "froms":"gas_ctm_archive ar inner join gas_mrd_business_rule_day bu on bu.ctm_archive_id=ar.ctm_archive_id " +
                    " inner join gas_ctm_meter m on m.ctm_archive_id=ar.ctm_archive_id " +
                    " left join (select count(1) plancount ,ctm_archive_id from gas_mrd_meter_reading where copy_state<>'9' and to_char(plan_copy_time,'yyyy')='"+nyear+"' "+zwhere+" group by ctm_archive_id ) q on q.ctm_archive_id=bu.ctm_archive_id " +
                   // " left join (select count(1) mrdcount,ctm_archive_id from gas_mrd_meter_reading where is_mrd='1' and copy_state<>'9' and to_char(plan_copy_time,'yyyy')='"+nyear+"' group by ctm_archive_id ) z on z.ctm_archive_id = bu.ctm_archive_id " +
                    " left join gas_mrd_book b on b.book_id=bu.book_id ",
                    "wheres": whereinfo,
                    "page":"true",
                "limit":50};
                var result_url = mrd_url+JSON.stringify(bd);
                xw.setRestURL(result_url);
                xw.update();
                $('#book_tree').css({'display':'none'}).removeClass("active");
            });

        },
        linkage: function(){
            var monthlength = 0;

            $('.yearpicker').datepicker({
                startView: 'decade',
                minView: 'decade',
                format: 'yyyy',
                maxViewMode: 2,
                minViewMode:2,
                autoclose: true
            });

            $(document).on('click','.btn_modify',function(e){

                businessRuleDayId = $(this).attr('data-id');

                var rows = xw.getTable().getData(false).rows;
               // selectedrow;
                rows.forEach(function(row) {
                    if(row.businessRuleDayId==businessRuleDayId){
                        selectedrow=row;
                    }
                });
                if(!selectedrow)
                {
                    alert("未找到相关数据")
                    return;

                }
                bookid = selectedrow.bookId;
                
               // var bookid= selectedrow
                //抄表月份和抄表例日————现在是 组合到一起显示在 抄表例日框中的。
                $('#modify_copymonth>div ul').empty();//初始化表单内容
                $('#modify_copyseq').val(selectedrow.copySeq);
                //console.log("selectedrow=="+selectedrow)
                $('#modify').css({'display':"block",'background':"rgba(0,0,0,0.3)"});
                $('#modify').attr("aria-hidden","false");
                $('#modify').addClass('in');

                var copyMonthList,copyRuledayList;
                if(selectedrow.copyMonth && selectedrow.copyMonth.indexOf(",") < 0){
                    $("#modify_copymonth ul").append('<li class="select2-search-choice"><div>'+selectedrow.copyMonth+"-"+selectedrow.copyRuleDay+'</div><a href="javascript:;" class="select2-search-choice-close"></a></li>');
                }
                if(selectedrow.copyMonth && selectedrow.copyMonth.indexOf(",")>=0 && selectedrow.copyRuleDay && selectedrow.copyRuleDay.indexOf(",") <0){//月份多个，例日1个
                    copyMonthList = selectedrow.copyRuleDay.split(',');
                    for(var i=0;i<copyMonthList.length;i++){
                        $("#modify_copymonth ul").append('<li class="select2-search-choice"><div>'+selectedrow.copyMonthList[i]+"-"+selectedrow.copyRuleDay+'</div><a href="javascript:;" class="select2-search-choice-close"></a></li>');
                    }
                }
                if(selectedrow.copyMonth){
                    copyMonthList = selectedrow.copyMonth.split(',');
                    monthlength = copyMonthList.length;
                }
                if(selectedrow.copyRuleDay){
                    copyRuledayList = selectedrow.copyRuleDay.split(',');
                }
                if(selectedrow.copyMonth && selectedrow.copyRuleDay){
                    for(var i=0; i <copyMonthList.length;i++){
                        if(!copyMonthList[i]){
                            continue;
                        }
                        if(!copyRuledayList[i]){
                            continue;
                        }
                        // console.log(copyMonth[i]+"-"+copyRuleday[i]);
                        $("#modify_copymonth ul").append('<li class="select2-search-choice"><div>'+copyMonthList[i]+"-"+copyRuledayList[i]+'</div><a href="javascript:;" class="select2-search-choice-close"></a></li>');

                    }
                }
            });
            $(document).on("click",'.btn-default,.close',function(){
                $('#modify').css({'display':"none",'background':"none"});
                $('#modify').attr("aria-hidden","true");
                $('#modify').removeClass('in');
            });
            $('.close,.modal-footer .btn-default').on('click',function(){
                $('#modifyUl>div ul li').remove();
            });

            var mydate = new Date();
            $('#select_planyear #calendar').val((mydate.getMonth()+1)+'-'+mydate.getDate());
            var i=0;
            //选择日期添加到抄表日期
            $('#modify_calendar').on('change',function(){
             //   console.log(0)
                i++;
  //  console.log(i);
                //年抄
                console.log($('#modify_calendar').val());
                //月抄
                if( i%3 == 0){
                    var str='<li class="select2-search-choice"><div>'+$(this).val()+'</div><a href="javascript:;" class="select2-search-choice-close"></a></li>';
                    $('#modifyUl').append(str);
                    var readDate = $('#modifyUl li').length;
                  //  console.log(readDate);
                    for(var j = 0; j < readDate; j++){
                       // console.log(j)
                        if(j >=12){
                            $('#modifyUl li').eq(j).remove();
                            alert('最多能选12个');
                        }
                    }

                }
            });
            //删除添加的抄表日期
            $(document).on('click','.select2-search-choice-close',function(){
                $(this).closest('li').remove();
            });


            $('#modify_add').on('click',function(e){
				
                var data = {};
              //  var planyear = $('#planyear').val();
                if($('#modify_copyseq').val()){
                    data.copySeq = $('#modify_copyseq').val();
                }

                if(!businessRuleDayId){
                    alert('未找到相关数据');
                    return ;
                }
                /*if((monthlength !=null && monthlength !==undefined && monthlength !='' && monthlength !=0) && monthlength != $('.reading-data li').length){
                    alert("抄表例日与抄表月份个数不一致");
                    return ;
                }*/
                var   copyyear_select = $('.yearpicker input').val();
                if(!copyyear_select){
                    alert("请选择生成计划年份");
                    return;
                }
                if(!$('#find_copycycle').val()){
                	alert("请选择抄表周期。");
                	return;
                }
                
               // var arr=[];
                var datearr = [];
                var monthArr = [];
                var dateArr = [];
                var errdata = new Array();
                console.log($('.reading-data li').length);
                for(var i=0;i<$('.reading-data li').length;i++){
                    var date = $('.reading-data li').eq(i).text();
                    datearr.push(date);
                    var a = datearr[i].split('-');
                    if((!a[0]) || (!a[1])){
                    	//alert("存在月份或日期选空，请查证后重试。");
                    	errdata.push(1);
                    }
                    monthArr.push(a[0]);
                    dateArr.push(a[1]);
                }

				if(errdata && errdata != null && errdata.length >0){
					alert("存在月份或日期选空，请查证后重试。");
					return;
				}
				if(monthArr.length != dateArr.length){
					alert("抄表例日与抄表月份个数不一致");
                    return ;
				}
               /* console.log("第一次截取-"+monthArr.join());
                console.log("第一次截取-"+dateArr.join());
*/
				//判断抄表周期和 选择月份日期间的关系
				if($('#find_copycycle').val()=='7'){//月抄
					//选12个
					if(monthArr.length != 12 || dateArr.length != 12){
						alert("抄表周期为【月抄】，请制定12个月份的抄表例日。");
						return;
					}
				}
				
				if($('#find_copycycle').val()=='4'){
					if(selectedrow.customerState != '04'){//不是长期不用用户
						alert("该用户非 【长期不用】 用户，无法指定为三月抄。");
						return;
					}
					if(monthArr.length !=4 || dateArr.length != 4){
						alert("抄表周期为【三月抄】，请制定4个月的抄表例日");
						return;
					}
				}

                var len = monthArr.length;
                for (var i = 0; i < len; i++) {
                    for (var j = 0; j < len - 1 - i; j++) {
                        //var i= j+1;
                        // alert(monthArr[j]+","+monthArr[(j+1)]);
                        //alert();
                        //alert(parseInt(monthArr[j]) > parseInt(monthArr[(j+1)]));
                        if (parseInt(monthArr[j]) > parseInt(monthArr[(j + 1)])) {
                            var t = monthArr[(j + 1)];
                            var o = dateArr[(j + 1)];
                            monthArr[(j + 1)] = monthArr[j];
                            dateArr[(j + 1)] = dateArr[j];
                            monthArr[j] = t;
                            dateArr[j] = o;
                        }
                    }
                }


                console.log("第二次：排序后:"+monthArr.join());
                console.log("第二个：排序后:"+dateArr.join());
                /*var url = hzq_rest+"gassysparameter"
                Restful.findNQ()*/
                //已排序
                for(var s=0;s<monthArr.length; s++){
                	//判断month 是不是选空了
                	/*if((!monthArr[s]) || (!monthArr[s+1])){
                		alert("存在选空月份，请检查后重试。");
                		
                	}*/
                
                    if(monthArr[s] == monthArr[s+1]){//当两个月份 相等--比较 日期，是否是
                        //
                        if(dateArr[s] >= 26 && dateArr[s+1] >= 26){
                            alert("选择的月份重复,请查证。");
                            return;
                        }else if(dateArr[s] <= 25 && dateArr[s+1] <= 25){
                            alert("选择的月份重复,请查证。");
                            return;
                        }
                    }else if(parseInt(monthArr[s]) == (parseInt(monthArr[s+1]) -1)){
                        if(parseInt(dateArr[s]) >= 26 && parseInt(dateArr[(s+1)]) < 25){
                            console.log(dateArr[s]);
                            console.log(dateArr[(s+1)]);
                            alert("同一抄表月份只能选择一个");
                            return;
                        }
                    }else if(parseInt(monthArr[s])-1 == (parseInt(monthArr[s+1]))){
                        if(parseInt(dateArr[s]) < 25 && parseInt(dateArr[(s+1)]) >= 26){
                            alert("同一抄表月份只能选择一个");
                            return;
                        }
                    }else if(monthArr[0] == 1 && monthArr[(monthArr.length)-1] == 12 && dateArr[0] <= 25 && dateArr[(monthArr.length)-1] >= 26){
                    		alert("同一抄表月份只能选择一个");
                            return;
                    }

                    //if(parseInt(monthArr[s]) == (parseInt(monthArr[(s+1)]) -1)){//相邻两个月比较两个月的例日

                    //}
                }
                //判断 选择的抄表月份有没有重复的。


               // console.log("比较日期之后的："+monthArr.join());
               // console.log("比较日期之后的："+dateArr.join());
              /*  //切分 mm-dd 或 m-d
                return ;
               /!* for(var j = 0;j< arr.length; j++){
                    monthArr.push((arr[j][0]).replace(/^0+/,""));
                    dateArr.push((arr[j][1]).replace(/^0+/,""));
                }*!/

                //根据 month 去排序——然后 组织 copydate的
                /!*for(var i=0; i< (monthArr.length)-1; i++){
                    if(parseInt(monthArr[i]) > parseInt(monthArr[(i+1)])){
                       var t = monthArr[(i+1)];
                       var o = dateArr[(i+1)];
                        monthArr[(i+1)] = monthArr[i];
                        dateArr[(i+1)] = dateArr[i];
                        monthArr[i] = t;
                        dateArr[i] = o;
                    }else{
                        continue;
                    }
                }*!/*/
                data.copyRuleDay = dateArr.join();
                data.copyMonth= monthArr.join();
                var bookmonth = {};
                bookmonth.copyMonth = monthArr.join();


              //  console.log("ajax参数"+data.copyRuleDay);
              //  console.log("ajax参数"+data.copyMonth);

               // return;
              //hzq_rest+"gasmrdbusinessruleday/"+businessRuleDayId


                var urest = Restful.update(hzq_rest+"gasmrdbusinessruleday",businessRuleDayId,data);
                if(urest){
                    var bd = {"businessruleday":businessRuleDayId,"planyear":copyyear_select};
                    $.ajax({
                        dataType: 'json',
                        type: "GET",
                        async: false,
                        url:"/hzqs/pla/pbgpo.do?fh=GPOPLA0000000J00&resp=bd&bd="+JSON.stringify(bd),
                        contentType:"application/json; charset=utf-8;",
                        success :function(restl){
                            if(restl.err_code == "1"){
                                bootbox.alert("<br><center><h4>非居民例日保存成功,该用户抄表已计划生成.</h4></center><br>");
                            }else{
                                var msg = data.msg;
                                bootbox.alert("<br><center><h4>"+msg+"</h4></center><br>");
                            }
                        },
                        error: function(){
                            bootbox.alert("<br><center><h4>非居民抄表例日保存成功,但抄表计划生成失败.</h4></center><br>");
                        }
                    })

                    $('#modify').css({'display':"none",'background':"none"});
                    $('#modify').attr("aria-hidden","true");
                    $('#modify').removeClass('in');
                    xw.update();
                }else{
                    bootbox.alert("<br><center><h4>修改失败!</h4></center><br>");
                }

               // burl = '/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd&limit=3&retobj=2';
               /* databody = {
                    "sets":[{"txid":"1","body":data,"path":"/gasmrdbusinessruleday/"+businessRuleDayId+"","method":"put"},
                        {"txid":"2","body":bookmonth,"path":"/gasmrdbook/"+bookid+"","method":"put"}]
                }
                $.ajax({
                    dataType: 'json',
                    type: "PUT",
                    async: false,
                   // url:hzq_rest + "gasmrdbusinessruleday/"+businessRuleDayId,
                    url:burl,
                  //  data:JSON.stringify(data),
                    data:JSON.stringify(databody),
                    contentType:"application/json; charset=utf-8;",
                    success :function(result){
                        var retFlag=true;

                        if(result.success&&result.success==false){
                            retFlag=false;
                        }else{
                            for(var i=0;i<result.results.length;i++){
                                if(!result.results[i].result.success){
                                    retFlag=false;
                                    break;
                                }
                            }
                        }
                        if(retFlag){
                            //return;
                            var bd = {"businessruleday":businessRuleDayId,"planyear":copyyear_select};
                            $.ajax({
                                dataType: 'json',
                                type: "GET",
                                async: false,
                                url:"/hzqs/pla/pbgpo.do?fh=GPOPLA0000000J00&resp=bd&bd="+JSON.stringify(bd),
                                contentType:"application/json; charset=utf-8;",
                                success :function(data){
                                    if(data.err_code == "1"){
                                        bootbox.alert("<br><center><h4>非居民例日保存成功,该用户抄表已计划生成.</h4></center><br>");
                                    }else{
                                        var msg = data.msg;
                                        bootbox.alert("<br><center><h4>"+msg+"</h4></center><br>");
                                    }
                                },
                                error: function(){
                                    bootbox.alert("<br><center><h4>非居民抄表例日保存成功,但抄表计划生成失败.</h4></center><br>");
                                }
                            })

                            $('#modify').css({'display':"none",'background':"none"});
                            $('#modify').attr("aria-hidden","true");
                            $('#modify').removeClass('in');
                            xw.update();
                        }else{
                            bootbox.alert("<br><center><h4>修改失败！</h4></center><br>");
                        }
                    },
                    error :function(err) {
                       // console.log(err)
                        bootbox.alert("<br><center><h4>修改失败!</h4></center><br>");
                    }
                });*/
            });

            //清除所有抄表例日
            $('#clear_all_btn').on('click',function(e){
                $('#modify_copymonth>div ul').empty();//初始化表单内容
            });
        }
    }

}();