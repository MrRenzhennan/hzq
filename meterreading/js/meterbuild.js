var ctmarchiveid='',ctm_meter_id='',last_meter_reading_id='',pid,meterkind='',customerkind='',customertype='',revisemeterstate='',fileids='',filecount='',
    customercode='',meterflag='',coefficientmax='',coefficientmin='';
var MeterreadingData = function(){
    var xw ;

    return {
        init:function(){
            this.initBookTree();
            this.initHelper();
            this.reload();
        },
        initHelper:function(){
            $.map(GasModMrd.enumCopyType,function(value,key){
                $('#copytype').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload:function(){
            var login_user =JSON.parse(localStorage.getItem("user_info")) ;
            console.log(login_user);
            console.log(login_user.userId);
            var loginuser_area_id = login_user.area_id;

            var base_url = "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=";
            var whereinfo = '1=1';
            var bd = {
                "cols":"ar.ctm_archive_id,cm.ctm_meter_id,cm.vb_vbt,ar.customer_code,ar.customer_id,ar.customer_name," +
                "cm.meter_user_name,ar.customer_address,cm.revise_meter_state,cm.coefficient_max,cm.coefficient_min," +
                "m1.meter_kind,c.remaing_asnum,c.card_balanc_esum,c.accumulated_gas,c.meter_reading,cm.meter_flag," +
                "ar.customer_kind,ar.customer_type,ar.link_man,ar.link_mantel,ar.gas_type_id,c.meter_reading_id,b.book_code,b.area_id,b.countper_id," +
                "b.serviceper_id ,c.quotiety,c.copy_time,c.meter_id,c.revise_meter_id,c.charging_meter,c.revise_reading,c.old_gas_type_id,c.old_book_id",
                "froms":"gas_ctm_archive ar " +
                " inner join gas_ctm_meter cm on cm.ctm_archive_id=ar.ctm_archive_id left join (select d.meter_reading," +
                " d.quotiety,d.ctm_archive_id,d.copy_time,d.meter_id, d.revise_meter_id, d.charging_meter, d.revise_reading,d.gas_type_id as old_gas_type_id,d.book_id as old_book_id," +
                " d.meter_reading_id,d.remaing_asnum,d.card_balanc_esum,d.accumulated_gas from (select" +
                " a.card_balanc_esum,a.accumulated_gas, a.remaing_asnum,a.quotiety,a.gas_type_id,a.book_id,a.charging_meter, a.meter_reading_id, a.revise_reading, a.meter_reading, a.meter_id,a.revise_meter_id, a.copy_time, a.ctm_archive_id," +
                " row_number() over (partition by a.ctm_archive_id order by a.copy_time desc) rn " +
                " from gas_mrd_meter_reading a where a.is_mrd='1' and a.copy_state in ('4','5','6','7') and a.area_id='"+loginuser_area_id+"') d where d.rn=1 ) c on c.ctm_archive_id = ar.ctm_archive_id" +
                " left join gas_mrd_book b on b.book_id= ar.book_id " +
                " left join gas_mtr_meter m1 on m1.meter_id=cm.meter_id ",
                "wheres":" b.area_id='"+loginuser_area_id+"'",
                "page":"true",
                "limit":50
            };
            var obj={};

            $('#divtable').html('');
            $('#divtable').removeClass('container');
            xw=XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize : 10,
                    columnPicker : true,
                    transition : 'fade',
                    checkboxes : false,
                    checkAllToggle : true,
                    key_column:'ctmArchiveID',


                    //----------------基本restful地址---

                    rowClicked: function(data) {
                        $(this).closest('tr').addClass('active').siblings('tr').removeClass('active');
                        $(this).closest('tr').find('td').css({'color':"#fff"});
                        $(this).closest('tr').siblings().find('td').css({'color':"#000"});
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        if(!data.row){
                            alert('未找到相关信息');
                        }
                        //根据客户档案id查询 最近一次抄表记录信息

                        //Restful.insert("",);

                        console.log('-------------start-----------');
                        //console.log($(this));'
                        console.log(data.unique);
                        console.log(data.column);
                        console.log(data);
                        console.log(data.row);
                        console.log('----------------end----------');
                        $('#ctmarchiveid').val(data.row.ctmArchiveId);
                        ctmarchiveid = data.row.ctmArchiveId;
                        ctm_meter_id = data.row.ctmMeterId;
                        last_meter_reading_id = data.row.meterReadingId;
                        var customer_kind = data.row.customerKind;//data.row holds the underlying row you supplied.
                        customertype = data.row.customerType;
                       // var reviseMeterState = data.row.reviseMeterState;
                        meterkind = data.row.meterKind;
                        meterflag = data.row.meterFlag;
                        customerkind = data.row.customerKind;
                        revisemeterstate = data.row.reviseMeterState;
                        coefficientmax = data.row.coefficientMax;
                        coefficientmin = data.row.coefficientMin;


                        obj.areaId = data.row.areaId;
                        obj.gasTypeId = data.row.gasTypeId; //用户当前用气性质
                        //obj.customerid = data.row.customerId;
                        obj.bookId = data.row.bookId;//当前的bookId
                        obj.ctmArchiveId = data.row.ctmArchiveId;//当前客户id
                        obj.lastAccumulatedGas = data.row.accumulatedGas;
                        obj.lastCardBalancEsum = data.row.cardBalancEsum;
                        obj.lastRemaingAsnum = data.row.remaingAsnum;
                        obj.chargingMeter = data.row.meterFlag;//计费表标记
                        obj.lastMeterReadingId = data.row.meterReadingId;
                        console.log(data.row);

                        customercode= data.row.customerCode;

                        $('#box_remaingasnum').hide();
                        $('#box_cardbalanceesum').hide();
                        $('#accumulatedgas').hide();
                        $('#box_accumulatedgas').hide();
                        $('#box_last_accumulatedgas').hide();
                        $('#box_lastcardbalanceesum').hide();//上次表内余额
                        $('#box_cardbalanceesum').hide();//表内余额
                        $('#box_last_remaingasnum').hide();//上次表内余量
                        $('#box_remaingasnum').hide();//表内余量
                        $('#quotiety').hide();
                        if(meterflag && meterflag == '2'){
                            $('#box_quotiety').show();//修正系数
                            //$("#meterflag option[values='2']").attr('selected',true);
                            $("#meterflag").val('2').attr("selected",'selected');
                        }else{
                            $("#meterflag").val('1').attr("selected",'selected');

                        }
                        $('#lastmeterreading').val(data.row.meterReading);
                        $("#meterflag option[value='"+data.row.meterFlag+"']").attr("selected",true);
                        if(revisemeterstate != '09'){//有修正表
                            $('#lastrevisemeterreading').val(data.row.reviseReading);//上次抄表——修正表读数
                            $('#box_lastrevisereading').show();
                            $('#box_revisereading').show();//二次表读数
                        }

                        if(customertype == 'I' || customertype =='i'){
                            $('#lastaccumulatedgas').val(data.row.accumulatedGas);
                            $('#box_accumulatedgas').show();
                            $('#box_last_accumulatedgas').show();

                        }
                        if(meterkind == '02'){//ic卡气量表
                            $('#lastremaingasnum').val(data.row.remaingAsnum);
                            $('#box_last_remaingasnum').show();//上次表内余量
                            $('#box_remaingasnum').show();//表内余量

                        }
                        if(meterkind == '03'){//ic卡 气费表
                            $('#lastcardbalanceesum').val(data.row.cardBalancEsum);
                            $('#box_lastcardbalanceesum').show();//上次表内余额
                            $('#box_cardbalanceesum').show();//表内余额
                        }
                        //一定显示的   抄表类型，燃气表读数，抄表日期,预算气费，预算气价
                    },
                    restURL : base_url+encodeURIComponent(JSON.stringify(bd)),
                    coldefs:[
                        {
                            col:"costomerId",
                            friendly:"客户信息ID",
                            hidden :true, //客户当前用气性质
                            index:1
                        },
                        {
                            col:"ctmArchiveID",
                            friendly:"客户档案ID",
                            unique:"true",
                            hidden :true, //客户当前用气性质
                            index:2
                        },
                        {
                            col:"customerCode",
                            friendly:"客户编号",
                            index:3
                        },
                        {
                            col:"customerName",
                            friendly:"客户名称",
                            index:4
                        },

                        {
                            col:"meterReading",
                            friendly:"燃气表读数",
                            index:5
                        },
                        {
                            col:"reviseReading",
                            friendly:"修正表读数",
                            index:6
                        },
                        {
                            col:"remaingAsnum",
                            friendly:"表内剩余气量",
                            index:7
                        },
                        {
                            col:"quotiety",
                            friendly:"修正系数",
                            index:8
                        },
                        {
                            col:"copyTime",
                            friendly:"抄表日期",
                            index:9
                        },
                        {
                            col:"linkMan",
                            friendly:"联系人",
                            index:10
                        },
                        {
                            col:"linkMantel",
                            friendly:"联系人电话",
                            index:11
                        },
                        {
                            col:"customerAddress",
                            friendly:"客户地址",
                            index:12
                        },
                        {
                            col:"customerkind",
                            friendly:"客户类别",
                            index:13
                        },
                        {
                            col:"customerType",
                            friendly:"客户类型",
                            index:14
                        },
                        {
                            col:"meterReadingId",
                            friendly:"抄表表ID",
                            index:15
                        },
                        {
                            col:"oldGasTypeId",
                            friendly:"抄表时用气性质",//客户上次用气性质
                            index:18
                        },
                        {
                            col:"gasTypeId",
                            friendly:"当前用气性质",
                            hidden :true, //客户当前用气性质
                            index:19
                        },
                        {
                            col:"oldBookId",
                            friendly:"上次抄表本ID",
                            hidden :true, //客户当前用气性质
                            index:20
                        },
                        {
                            col:"bookId",
                            friendly:"当前抄表本ID",
                            hidden :true, //客户当前用气性质
                            index:21
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            hidden :true, //客户当前用气性质
                            index:22
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            hidden:true,
                            index:23
                        },
                        {
                            col:"countperId",
                            friendly:"核算员",
                            hidden:true,
                            index: 24
                        },
                        {
                            col:"serviceperId",
                            friendly:"客户服务员",
                            hidden:true,
                            index:25
                        },
                        {
                            col:"bookCode",
                            friendly:"抄表本编号",
                            //hidden:true,
                            index:26
                        },
                        {
                            col:"bookId",
                            friendly:"抄表本ID",
                            hidden:true,
                            index : 27
                        },
                        {
                            col:"meterReadingId",
                            friendly:"抄表表ID",
                            hidden:true,
                            index:28
                        },
                        {
                            col:"vbVbt",
                            friendly:"VB_VBT",
                            hidden:true,
                            index:29
                        },
                        {
                            col:"reviseMeterState",
                            friendly:"修正表状态",
                            hidden:true,
                            index:31
                        },
                        {
                            col:"coefficientMax",
                            friendly:"最大系数",
                            hidden:true,
                            index:32
                        },
                        {
                            col:"coefficientMin",
                            friendly:"最小系数",
                            hidden:true,
                            index:33
                        },
                        {
                            col:"meterKind",
                            friendly:"表具种类",
                            index:34
                        },
                        {
                            col:"remaingAsnum",
                            friendly:"表内余量",
                            hidden:true,
                            index:35
                        },
                        {
                            col:"cardBalancEsum",
                            friendly:"表内余额",
                            hidden:true,
                            index:36
                        },
                        {
                            col:"accumulatedGas",
                            friendly:"表内累计气量",
                            hidden:true,
                            index:37
                        },
                        {
                            col:"customerType",
                            friendly:"客户类型",
                            index:37
                        },
                        {
                            col:"meterFlag",
                            friendly:"计费表标记",
                            index:38
                        },
                        {
                            col:"gasTypeId",
                            friendly:""
                        },
                        /*
                        {
                            col:"factoryName",
                            friendly:"燃气表厂家",
                            hidden:true,
                            index: 26
                        },
                        {
                            col:"reviseFactoryName",
                            friendly:"修正表厂家",
                            hidden:true,
                            index:27
                        },
                        {
                            col:"meterNo",
                            friendly:"燃气表编号",
                            hidden:true,
                            index:28
                        },
                        {
                            col:"reviseMeterNo",
                            friendly:"修正表编号",
                            hidden:true,
                            index:29
                        },*/
                        {
                            col:"meterUserName",
                            friendly:"表户名称",
                            hidden:true,
                            index:28
                        }

                    ]

                });

            //$('#').on('click',function(e))

            $('#showdisgit').on('click',function(){//预算气量，预算气费

                var measure = 0;
                if(!customercode){
                    alert("客户编号为空");
                    return;
                }
                //判断客户类型—— 居民普表——meterreading
                if(!customerkind){
                    alert('客户种类为空');
                    return ;
                }
                if(!customertype){
                    alert('客户类型为空');
                    return ;
                }
                var i_last_meterreading = 0;
                var i_meterreading =0;
                if($('#lastmeterreading').val()){
                    i_last_meterreading =$('#lastmeterreading').val();
                }
                if($('#meterreading').val()){
                    i_meterreading = $('#meterreading').val();
                }
                if(customerkind == '1' && (customertype=='P' || customertype =='p')){
                    measure = i_meterreading - i_last_meterreading;
                }
                var i_lastaccumulatedgas =  $('#lastaccumulatedgas').val();//上次累计气量
                var i_accumulatedgas = $('#accumulatedgas').val();

                if(customertype =='I' || customertype =='i'){//IC卡表
                    if(i_lastaccumulatedgas){
                        i_lastaccumulatedgas =0;
                    }
                    if(i_accumulatedgas){
                        i_accumulatedgas = 0;
                    }
                    measure = i_accumulatedgas-i_lastaccumulatedgas;
                }
                if(!revisemeterstate || revisemeterstate =='' ){
                    alert("修正表状态为空");
                    return;
                }
                var i_meterflag = $('#meterflag option:selected').val();
                if( !i_meterflag || i_meterflag =='' ){
                    alert('计费表标记为空');
                    return;
                }
                var i_revisereading = 0;
                if($('#revisereading').val()){
                    i_revisereading = $('#revisereading').val();
                }
                if($('#lastrevisereading').val()){
                    i_lastrevisereading = $('#lastrevisereading').val();
                }
                var i_quotiety = 1;
                //系数计算： 计费表为二次表的
                if(revisemeterstate != "09" && i_meterflag == '2'){//有修正表 并且 修正表为计费表
                    measure = i_revisereading - i_lastrevisereading;
                }else if(revisemeterstate =='09' && i_meterflag == '2' ){//没有修正表 并且 计费表为修正表
                    //一次表* 系数 -上次一次表读数*系数
                    if(i_lastrevisereading && i_lastrevisereading !='' && i_revisereading && i_revisereading !=''){
                        i_quotiety =  (i_revisereading-i_lastrevisereading)/(i_meterreading-i_last_meterreading);
                    }else if((!i_lastrevisereading || i_lastrevisereading=='') && coefficientmin && coefficientmax && coefficientmin !='' && coefficientmax !='' ){
                        i_quotiety = (coefficientmin+coefficientmax)/2;
                    }else{
                        alert("请输入修正系数");
                    }
                    measure = (i_meterreading - i_last_meterreading)*i_quotiety;
                }else{//普表 ——没有修正表&& 计费表为1次表
                    measure = i_meterreading - i_last_meterreading;
                }

                $('#quotiety').val(i_quotiety);
                //预算气量
                $('#find_budgetmeasure').val(measure);

                //计费读数（计费使用的使用用气量）
                $('#chagemeterreading').val(measure);
                var bd = {};
                bd.customer_code = customercode+'';
                bd.measure =measure ;
                $.ajax({
                    dataType: 'json',
                    type: "POST",
                    async: false,
                    url:"/hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",
                    data:JSON.stringify(bd),
                    contentType:"application/json; charset=utf-8;",
                    success :function(data){
                        console.log(data);
                        if(data.ret_code == "1"){
                           $('#find_budgetgasfee').val(data.monty);
                        }else{
                            bootbox.alert("<br><center><h4>预算失败!</h4></center><br>");
                        }
                    },
                    error :function(err) {
                        console.log(err)
                        bootbox.alert("<br><center><h4>添加失败!</h4></center><br>");
                    }
                });
            })

            /*$('#information').on('click','button',function(){*/
            $('#nsButton').on('click',function(e){

                if(!fileids ){//保存
                    if(!confirm("图片为空,是否保存信息？")){
                        return;
                    }
                }
                if(filecount && filecount!= '' ){
                    obj.photoCount = filecount;
                }

                if(fileids && fileids !=''){
                    obj.meterPhoto = fileids;
                }
                var user_info = JSON.stringify(localStorage.getItem("user_info"));
                if( $('#meterreading').val() &&  $('#meterreading').val() !=''){
                    obj.meterReading = $('#meterreading').val();//表读数
                }

                var str1 =  $('#copytime').val();//抄表时间
                if(!str1 || str1 ==''){
                    alert('请选择抄表时间');
                }
                var arr1 = str1.split("-");
                var date1 = new Date(arr1[0],parseInt(arr1[1])-1,arr1[2]);
                    obj.copyTime =date1;
                var c = obj.copyTime.split("-");
                if($('#copytype option:selected').val() && $('#copytype option:selected').val() !=''){
                    obj.copyType = $('#copytype option:selected').val();
                }
                if($('#revisereading').val() && $('#revisereading').val() !=''){
                    obj.reviseReading = $('#revisereading').val();//修正表读数
                }
                if($('#changingmeter option:selected').val() && $('#changingmeter option:selected').val() !=''){
                    obj.changingMeter = $('#changingmeter option:selected').val();//修正表
                }
                if($("#quotiety").val() && $("#quotiety").val() !=''){
                    obj.quotiety = $("#quotiety").val();//修正系数
                }
                if($('#accumulatedgas').val() && $('#accumulatedgas').val() !=''){
                    obj.accumulatedGas = $('#accumulatedgas').val();//表内累计气量
                }
                if( $('#cardbalanceesum').val() &&  $('#cardbalanceesum').val() !=''){
                    obj.cardBalancEsum= $('#cardbalanceesum').val();//表内累计剩余余额
                }
                if( $('#remaingasnum').val() &&  $('#remaingasnum').val() !=''){
                    obj.remaingAsnum = $('#remaingasnum').val();//表内累计剩余气量
                }
                if($('#find_budgetgasfee').val() && $('#find_budgetgasfee').val() !=''){
                    obj.budgetGasFee = $('#find_budgetgasfee').val();
                }
                if($('#find_budgetmeasure').val() && $('#find_budgetmeasure').val != ''){
                    obj.budgetMeasure = $('#find_budgetmeasure').val();
                }
                if( $('#chagemeterreading').val() && $('#chagemeterreading').val() != ''){
                    obj.chargeMeterReading = $('#chagemeterreading').val();
                }
                obj.countperId= user_info.userId;
                   // obj.accumulatedamount =  $('#accumulatedamount').val();//抄回表内累计金额
                if($('#copytype option:selected').val() == '60' || $('#copytype option:selected').val() == 'I0'){//正常抄表，ic卡正常抄表
                    obj.operate = 'P';//计划抄表
                }else {
                    obj.operate = 'S';//业务抄表
                }
                obj.createBy = user_info.userId;
                obj.mererReadingId = obj.operate +(c[0]+c[1]+c[2])+obj.ctmArchiveId+ obj.copyType;
                    $.ajax({
                    dataType: 'json',
                    type: "POST",
                    async: false,
                        url:hzq_rest+'gasmrdmeterreading',
                    data:JSON.stringify(obj),
                    contentType:"application/json; charset=utf-8;",
                    success :function(data){
                        console.log(data);
                        if(data.retcode == "1"){
                            bootbox.alert("<br><center><h4>添加成功!</h4></center><br>");
                        }else{
                            bootbox.alert("<br><center><h4>添加失败!</h4></center><br>");
                        }
                    },
                    error :function(err) {
                        console.log(err)
                        bootbox.alert("<br><center><h4>添加失败!</h4></center><br>");
                    }
                });
            });
            //--init
        },
        initBookTree : function(){//初始化tree的时候只加载供气区域

            var restURL = "hzqs/pla/pbctr.do?fh=CTRPLA0000000J00&resp=bd&bd={}";
            $.ajax({
                type : 'POST',
                url : restURL,
                cache : false,
                async : false,
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify({"operator":"admin"}),
                success : function(data, textStatus, xhr) {
                    //console.log("okokfor tree");

                    var trform = Duster.buildArr($('#__dust_ptree'));
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

            $("#btn_select_book").on('click',function(e){
                console.log("llloo")
                if(!$('#book_tree').hasClass("active"))
                {
                    $('#book_tree').css({
                        'position':'absolute',
                        'width':'500px',
                        'z-index':3,
                        'display':'block'}).addClass("active");
                }else{
                    $('#book_tree').css({
                        'display':'none'}).removeClass("active");
                }
            });

            $(document).on('click',function (e) {
                if(e.target.id!='btn_select_book')
                    if($('#book_tree').hasClass("active"))
                    {
                        $('#book_tree').css({
                            'display':'none'}).removeClass("active");
                    }
            });

            $("#tree_1").on('click','ul li a',function(e){
                //判断是供气区域，核算员还是抄表员

                var code_text = $(this).context.innerText;
                console.log(code_text);
                var middle_url = "";
                var code_id =  $(this).attr("data-id");
                var whereinfo = "1=1";
                var bwhereinfo = "1=1";
                var q_Url = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";

                if(code_id == null) {//查询所有
                    xw.setRestURL(query_Url);
                    xw.update();
                    return "";
                }else if(code_text.indexOf("核算员") >= 0){
                    whereinfo += " and b.countper_id='"+code_id +"'";
                    bwhereinfo +=" and a.countper_id='"+code_id+"'";
                }else if(code_text.indexOf("查表员") >= 0){
                    whereinfo += " and b.serviceper_id='"+code_id +"'";
                    bwhereinfo +=" and a.serviceper_id='"+code_id+"'";
                }else if(code_text.indexOf("编号") >= 0){
                    whereinfo += " and b.book_id='"+code_id+"'";
                    bwhereinfo +=" and a.book_id='"+code_id+"'";
                }else {
                    whereinfo += " and b.area_id='"+code_id +"'";
                    bwhereinfo +=" and a.area_id='"+code_id+"'";
                }
                var base_url = "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=";

                var bd = {
                    "cols":"ar.ctm_archive_id,cm.ctm_meter_id,cm.vb_vbt,ar.customer_code,ar.customer_id,ar.customer_name," +
                    "cm.meter_user_name,ar.customer_address,cm.revise_meter_state,cm.coefficient_max,cm.coefficient_min," +
                    "m1.meter_kind,c.remaing_asnum,c.card_balanc_esum,c.accumulated_gas,c.meter_reading," +
                    "ar.customer_kind,ar.customer_type,ar.link_man,ar.link_mantel,ar.gas_type_id,c.meter_reading_id,b.book_code,b.area_id,b.countper_id," +
                    "b.serviceper_id ,c.quotiety,c.copy_time,c.meter_id,c.revise_meter_id,c.charging_meter,c.revise_reading,c.old_gas_type_id,c.old_book_id",
                    "froms":"gas_ctm_archive ar " +
                    " inner join gas_ctm_meter cm on cm.ctm_archive_id=ar.ctm_archive_id left join (select d.meter_reading," +
                    " d.quotiety,d.ctm_archive_id,d.copy_time,d.meter_id, d.revise_meter_id, d.charging_meter, d.revise_reading,d.gas_type_id as old_gas_type_id,d.book_id as old_book_id," +
                    " d.meter_reading_id,d.remaing_asnum,d.card_balanc_esum,d.accumulated_gas from (select" +
                    " a.card_balanc_esum,a.accumulated_gas, a.remaing_asnum,a.quotiety,a.gas_type_id,a.book_id,a.charging_meter, a.meter_reading_id, a.revise_reading, a.meter_reading, a.meter_id,a.revise_meter_id, a.copy_time, a.ctm_archive_id," +
                    " row_number() over (partition by a.ctm_archive_id order by a.copy_time desc) rn " +
                    " from gas_mrd_meter_reading a where a.is_mrd='1' and a.copy_state in ('4','5','6','7') and "+bwhereinfo+") d where d.rn=1 ) c on c.ctm_archive_id = ar.ctm_archive_id" +
                    " left join gas_mrd_book b on b.book_id= ar.book_id " +
                    " left join gas_mtr_meter m1 on m1.meter_id=cm.meter_id ",
                    "wheres":whereinfo,
                    "page":"true",
                    "limit":50
                };
                var result_url = base_url+JSON.stringify(bd);
                xw.setRestURL(result_url);
                xw.update();

            });

            var busiId;
            $(document).on("click", '.fileinput-upload-button', function () {
                //fileId = GasModService.getUuid();
                //抄表时间
                var copytime = $('#copytime').val();//抄表时间
                var copyType = $('#copytype option:selected').val();
                if(!copytime){
                    bootbox.alert("抄表时间不能为空！");
                    return false;
                }
                if(!copyType){
                    bootbox.alert('抄表类型不能为空!');
                    return false;
                }

                if(!ctmarchiveid || ctmarchiveid.length==0){
                    bootbox.alert("客户档案ID不能空！");
                    return false;
                }

                var c_arr = copytime.split("-");


                busiId = "S"+c_arr[0]+c_arr[1] + c_arr[2]+ctmarchiveid+copyType;//定针抄表
                var form = new FormData(document.getElementById('fileupload'));
                console.log(form.get("files"));
                $.ajax({
                    url: "/hzqs/sys/upload.do?busiId="+busiId+"",
                    data: form,
                    dataType: 'text',
                    processData: false,
                    contentType: false,
                    async: false,
                    type: 'POST',
                    success: function (data) {
                        //console.log(JSON.stringify(data));
                        console.log(JSON.parse(data));
                        if (JSON.parse(data).length != 0) {
                            bootbox.alert('导入成功！');
                            var file_arr = JSON.parse(data);
                            fileids = '';
                            for(var i = 0;i < file_arr.length;i++){
                                fileids +=","+file_arr[i].id;
                            }
                            filecount = file_arr.length;

                            fileids = fileids.substr(1);
                            alert(fileids);
                            return pid;
                        } else {
                            bootbox.alert("导入失败！");
                        }
                    },
                    error: function (data) {
                        bootbox.alert(data);
                        if(arguments[0].status == '413'){
                            bootbox.alert("文件不能超过1M");
                        }
                        $("#fileId").val('');
                    }
                });
            });

        },
    }

}();