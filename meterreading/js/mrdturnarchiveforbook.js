//�ͻ�����
$('#find_unit').on('change', function (e) {
    console.log("change area:" + e + "." + $('#find_unit').val());
    GasModSys.counterUsersInArea({
        "areaId": $('#find_unit').val(),
        "cb": function (data) {
            var inhtml = "<option value=''>ȫ��</option>";
            $.each(data, function (idx, row) {
                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
            })
            $("#find_countPer").html(inhtml);
            $("#find_countPer").val("").change();

        }
    })
});

$('#find_countPer').on('change', function (e) {
    console.log("change counter:" + e + "." + $('#find_countPer').val());
    $("#find_servicePer").html("");
    $("#find_servicePer").html("<option value=''>ȫ��</option>");
    GasModSys.copyUsersInArea({
        "areaId": $('#find_unit').val(),
        "countperId": $('#find_countPer').val(),
        "cb": function (data) {
            var inhtml = "<option value=''>ȫ��</option>";
            $.each(data, function (idx, row) {
                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
            })
            $("#find_servicePer").html(inhtml);
            $("#find_servicePer").val("").change();

        }
    })
})

// �������ʼ���

var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/?query={\"parentTypeId\":\"1\"}",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
$.map(gasTypeHelper.getData(), function (value, key) {
    console.log(key)
    $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
});
$("#find_gasTypeId").on("change",function(){
    console.log($(this).val())
    $('#find_gasTypeId1').html('<option value="">��ѡ��</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
        $('#find_gasTypeId1').append('<option value="' + key + '">' + value + '</option>');
    });
});
$("#find_gasTypeId1").on("change",function(){
    console.log($(this).val())
    $('#find_gasTypeId2').html('<option value="">��ѡ��</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
        $('#find_gasTypeId2').append('<option value="' + key + '">' + value + '</option>');
    });
});
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
var query = {
    "cols":" area_id,area_name ",
    //+ " SELECT AREA_ID FROM GAS_SYS_AREA START WITH AREA_ID=#{area_id,jdbcType=VARCHAR} CONNECT BY PRIOR PARENTID=AREA_ID) A ",
    "froms":" gas_biz_area where parent_area_id='"+areaId+"' union" +
    " select area_id,area_name from gas_biz_area start with area_id='"+areaId+"' connect by prior area_id=parent_area_id " ,
    "where":"1=1",
    "page":false
}
$.ajax({
    //url: Utils.queryURL(hzq_rest+ "gassysuser")+'fields={"userId":1,"employeeName":1,'+
    //'"stationId":1,"chargeUnitId":1}&query='+query,
    url:'/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00',
    dataType: 'json',
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    data:JSON.stringify(query),
    async: false,
}).done(function(data,retcode) {
    console.log(data.rows);
    $.each(data.rows,function(key,val){
        loginarea.push(val.areaId);
        $('#find_unit').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
    })

});


var xw;
// ��������helper
var areaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName",
});
// ��������helper
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});

var serviceperHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "employeeName",
});


var countperHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "employeeName",
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

var countperFormat = function () {
    return {
        f: function (val) {
            return countperHelper.getDisplay(val);
        },
    }
}();

var serviceFormat = function () {
    return {
        f: function (val) {
            return serviceperHelper.getDisplay(val);
        },
    }
}();

var inhabitnatArchiveManagementAction = function () {

    var archiveIdFormat = function () {
        return {
            f: function (val, row) {
                if(row.customerKind == "1"){
                    return "<a  data-target='#residentdetails' id='information' data-toggle='modal' data-kind='"+JSON.stringify(row)+"'>" + '����' + "</a>";

                }else if(row.customerKind == "9"){
                    return "<a  data-target='#nonresidentdetails' id='noninformation' data-toggle='modal' data-kind='"+JSON.stringify(row)+"'>" + '����' + "</a>";
                }
            }
        }
    }();


    return {
        init: function () {
            this.initHelper();
            this.reload();
        },

        initHelper: function () {
            // �������� select init
            /* $.map(areaHelper.getData(), function (value, key) {
             $('#find_unit').append('<option value="' + key + '">' + value + '</option>');
             });
             // ����Ա select init
             $.map(countperHelper.getData(), function (value, key) {
             $('#find_countperid').append('<option value="' + key + '">' + value + '</option>');
             });
             // ����Ա select init
             $.map(serviceperHelper.getData(), function (value, key) {
             $('#find_serviceperid').append('<option value="' + key + '">' + value + '</option>');
             });*/
            // �������� select init
        },


        reload: function () {
            $('#divtable').html('');

            console.log(loginarea.join())
            var bd = {
                "cols": "ca.*,b.countper_id,b.serviceper_id",
                "froms": "gas_ctm_archive ca inner join gas_mrd_book b on b.book_id = ca.book_id",
                "wheres": "ca.book_id = b.book_id and ca.area_id in ("+loginarea.join()+")",
                "page": true,
                "limit": 50
            };
            wx = XWATable.init(
                {
                    divname: "divtable",
                    tableId:"divtable",
                    findbtn:"find_button",
                    //----------------table��ѡ��-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------��restful��ַ---
                    // restbase: 'gasctmarchive/queryArchiveInfo',
                    key_column: 'ctmArchiveId',
                    // restbase: 'gasctmarchive?query={"customerKind":"1"}',
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    coldefs: [

                        {
                            col: "customerCode",
                            friendly: "�ͻ����",
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "customerName",
                            friendly: "�ͻ����",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "customerAddress",
                            friendly: "�ͻ���ַ",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "areaId",
                            friendly: "��������",
                            readonly: "readonly",
                            format: areaFormat,
                            ref_url: "gasbizarea",
                            ref_name: "areaName",
                            ref_value: "areaId",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "countperId",
                            friendly: "����Ա",
                            format: countperFormat,
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "serviceperId",
                            format: serviceFormat,
                            friendly: "����Ա",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "bookId",
                            friendly: "���?",
                            readonly: "readonly",
                            sorting: false,
                            index: 8
                        },

                        {
                            col: "customerState",
                            friendly: "�ͻ�״̬",
                            readonly: "readonly",
                            format:GasModCtm.customerStateFormat    ,
                            sorting: false,
                            // hidden:true,
                            index: 9
                        },
                        {
                            col: "gasTypeId",
                            friendly: "��������",
                            readonly: "readonly",
                            format: gasTypeFormat,
                            ref_url: "gasbizgastype",
                            ref_name: "gasTypeName",
                            ref_value: "gasTypeId",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "unboltTime",
                            friendly: "��˨ʱ��",
                            readonly: "readonly",
                            format: dateFormat,
                            index: 11
                        },
                        {
                            col: "customerType",
                            friendly: "�ͻ����",
                            readonly: "readonly",
                            sorting: false,
                            format: GasModCtm.customerTypeFormat,
                            index: 12
                        },
                        {
                            col: "ctmArchiveId",
                            friendly: "����",
                            readonly: "readonly",
                            format: archiveIdFormat,
                            sorting: false,
                            index: 13
                        }
                    ],
                    //---------------��ѯʱ��������
                    findFilter: function () {
                        var areaId_select = $('#find_unit option:selected').val(),
                            find_countPer = $('#find_countPer option:selected').val();
                        // var copyerid = $("find_countperId").val()
                        var whereinfo = "";
                        if (areaId_select) {
                            whereinfo += " ca.area_id = '" + areaId_select + "' and ";
                        }
                        if (find_countPer) {
                            whereinfo += " b.countper_id = '" + find_countPer + "' and ";
                        }
                        //��ӳ���Ա��
                        if ($("#find_servicePer option:selected").val()) {
                            whereinfo += " b.serviceper_id = '" + $("#find_servicePer option:selected").val() + "' and ";
                        }
                        if ($("#find_bookcode").val()) {
                            console.log($("#find_bookcode").val())
                            whereinfo += " ca.book_id like '%" + $('#find_bookcode').val() + "%' and ";
                        }

                        if ($('#find_customerCode').val()) {
                            whereinfo += " ca.customer_code like '%" + $('#find_customerCode').val() + "%' and ";
                        }
                        if ($('#find_customerName').val()) {
                            whereinfo += " ca.customer_name like '%" + $('#find_customerName').val() + "%' and ";
                        }
                        if ($('#find_idcardno').val()) {
                            console.log($('#find_idcardno').val())
                            whereinfo += " ca.idcard like '%" + $('#find_idcardno').val() + "%' and ";
                        }
                        if ($('#find_customerState').val()) {
                            whereinfo += " ca.customer_state = '" + $('#find_customerState').val() + "' and ";
                        }

                        if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            console.log($('#find_gasTypeId').val())
                            whereinfo += " ca.gas_type_id  like '" + $('#find_gasTypeId').val() + "%' and ";
                        }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val() ){
                            console.log($('#find_gasTypeId1').val())
                            whereinfo += " ca.gas_type_id like '" + $('#find_gasTypeId1').val() + "%' and ";
                        }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val()  && $('#find_gasTypeId2').val() ){
                            console.log($('#find_gasTypeId2').val())
                            whereinfo += " ca.gas_type_id = '" + $('#find_gasTypeId2').val() + "' and ";
                        }

                        if ($('#find_customerType').val()) {
                            whereinfo += " ca.customer_type = '" + $('#find_customerType').val() + "' and ";
                        }

                        if ($('#find_customerAddress').val()) {
                            whereinfo += " ca.customer_address like'%" + $('#find_customerAddress').val() + "%' and ";
                        }


                        if ($('#find_booktype').val()) {
                            whereinfo += " b.book_type = '" + $('#find_booktype').val() + "' and ";
                        }

                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += " to_char(ca.unbolt_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "' and ";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("�������ֹ����")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("��������ʼ����")
                        }

                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " to_char(ca.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("�������ֹ����")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("��������ʼ����")
                        }

                        bd = {
                            "cols": "ca.*,b.countper_id,b.serviceper_id"
                            , "froms": "gas_ctm_archive ca inner join gas_mrd_book b on b.book_id = ca.book_id "
                            , "wheres": whereinfo + " ca.book_id = b.book_id and ca.area_id in ("+loginarea.join()+")",
                            "page": true,
                            "limit": 50
                        };
                        wx.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }
                });
        }
    }
}();

//    ����
$(document).on('click',"#information",function(){
    $("#tab1 span").html("");
    var row = JSON.parse($(this).attr("data-kind"));
    $("#customerCode").val(row.customerCode);
    $("#customerName").val(row.customerName);
    $("#customerAddress").val(row.customerAddress);
    console.log(row);
    $("#navtab li").eq(0).addClass("active").siblings().removeClass("active");
    $("#tab1").addClass("active").siblings().removeClass("active");
    //�ͻ�����
    ctmarchive(row.ctmArchiveId);
    //��ͬ
    contract(row.ctmArchiveId,row.customerCode);
});

var GasModCtms = function () {
    var industrySort = {"01":"�������","02":"����","03":"��Ϣ����","04":"�����ó��","05":"���¹��","06":"����ӡˢ",
        "07":"����","08":"����ҵ","09":"ҽҩ����","10":"ʯ�ͻ�����Դ","11":"����","12":"����","13":"�㲥����",
        "14":"����","15":"����","16":"����","17":"����","18":"˰��","19":"��ͨ","20":"�����","21":"���취",
        "22":"���۷���","23":"����","24":"ס��","25":"ϴԡ","26":"С��","27":"������ҵ","28":"������",
        "29":"��ҵ��λ"
    };
    var reminderWay = {"1":"΢��","2":"QQ","3":"�绰֪ͨ","4":"����֪ͨ","5":"����"};
    var meterMaterial={"1":"��","2":"��"};
    var baseMeterVender={"1":"��","2":"�ɴ�","3":"����ʯ"};
    var displayType={"1":"��е","2":"����","3":"��е+����"};
    var controlType={"1":"Զ������","2":"Զ��IC��","3":"IC������","4":"IC�����"};
    var chipType={"1":"102�� ������","2":"102�� ��","3":"4442�� ������","4":"4442�� ��"};
    var valveInfo = {"1": "��", "2": "�쳣"};
    var powerType = {"1": "�ɵ��", "2": "﮵��"};

    return {
        industrySortFormat:function(val) {
            return industrySort[val];
        },
        reminderWayFormat:function(val){
            return reminderWay[val];
        },
        meterMaterialFormat:function(val){
            return meterMaterial[val];
        },
        displayTypeFormat:function(val){
            return displayType[val];
        },
        chipTypeFormat:function(val){
            return chipType[val];
        },
        controlTypeFormat:function(val){
            return controlType[val];
        },
        baseMeterVenderFormat:function(val){
            return baseMeterVender[val];
        },
        valveInfoFormat:function(val){
            return valveInfo[val];
        },
        powerTypeFormat:function(val){
            return powerType[val];
        }
    }
}();
var dateForat = function(val){
    var data= val.split("T");
    var aa=[];
    for(var i=0;i<data[1].split(":").length;i++){
        if(i<2){
            aa.push(data[1].split(":")[i])
        }
    }
    data[1] = aa.join(":");
    console.log(data.join(" "))
    date=data.join(" ");
    return date;
}
function ctmarchive(archiveId){

    var renter = Restful.findNQ(hzq_rest + 'gasctmrenter?query={"ctmArchiveId":"'+archiveId+'"}');
    console.log(renter)
    if(renter.length){
        $('#tab1 span').each(function (index,val) {
            span = val;
            $.each(renter[0],function(key,val){
                if(key == "lesseeExpire" && $(span).attr('name') == key) {
                    if(val){
                        $(span).html(dateForat(val));
                    }

                }else if(key == "lesseeCerType" && $(span).attr('name') == key){
                    if(val == 1){
                        // 1��Ӫҵִ�գ�2���������֤��3������֤��4���ⷿ��ͬ��5���������֤
                        $(span).html("Ӫҵִ��")
                    }else if(val == 2){
                        $(span).html("�������֤")
                    }else if(val == 3){
                        $(span).html("����֤")
                    }else if(val == 4){
                        $(span).html("�ⷿ��ͬ")
                    }else if(val == 5){
                        $(span).html("�������֤")
                    }
                }else{
                    if($(span).attr('name') == key){
                        $(span).html(val)
                    }
                }
            })
        })
    }

    var gasctmarchive = Restful.getByID(hzq_rest + "gasctmarchive",archiveId);
    console.log(gasctmarchive);
    $('#tab1 span').each(function (index,val) {
        span = val;
        $.each(gasctmarchive,function(key,val){
            if(key == "customerType" && $(span).attr('name') == key ){
                if(val == "P"){
                    $(span).html("��")
                }else if(val == 'I'){
                    $(span).html("��")
                }
            }else if(key == "reminderWay" && $(span).attr('name') == key ){
                $(span).html(GasModCtms.reminderWayFormat(val));
            }else if(key == "customerKind" && $(span).attr('name') == key ){
                if(val == "1"){
                    $(span).html("����")
                }else if(val == '9'){
                    $(span).html("�Ǿ���")
                }
            }else if(key == "customerState" && $(span).attr('name') == key){
                if(val == "01"){
                    //"01":"��","02":"��ͣ����","03":"���״̬","00":"���û�","99":"ɾ��"
                    $(span).html("��")
                }else if(val == "02"){
                    $(span).html("��ͣ����")
                }else if(val == "03"){
                    $(span).html("���״̬")
                }else if(val == "00"){
                    $(span).html("���û�")
                }else if(val == "99"){
                    $(span).html("ɾ��")
                }
            }else if(key == "invoiceType" && $(span).attr('name') == key ){
                if(val == "1"){
                    $(span).html("��ͨ��Ʊ")
                }else if(val == '2'){
                    $(span).html("��ֵ˰��Ʊ")
                }
            }else if(key == "gasTypeId" && $(span).attr('name') == key){
                var GastypeHelper = RefHelper.create({
                    ref_url: "gasbizgastype",
                    ref_col: "gasTypeId",
                    ref_display: "gasTypeName",
                });
                $(span).html(GastypeHelper.getDisplay(val));
            }else if(key == "areaId" && $(span).attr('name') == key){
                var GastypeHelper = RefHelper.create({
                    ref_url: "gasbizarea",
                    ref_col: "areaId",
                    ref_display: "areaName",
                });
                $(span).html(GastypeHelper.getDisplay(val));
            }else if(key == "countperId" && $(span).attr('name') == key){
                var GastypeHelper = RefHelper.create({
                    ref_url: "gassysuser",
                    ref_col: "userId",
                    ref_display: "employeeName",
                });
                $(span).html(GastypeHelper.getDisplay(val));

            }else if(key == "serviceperId" && $(span).attr('name') == key){
                var GastypeHelper = RefHelper.create({
                    ref_url: "gassysuser",
                    ref_col: "userId",
                    ref_display: "employeeName",
                });
                $(span).html(GastypeHelper.getDisplay(val));

            }else if(key == "lesseeExpire" && $(span).attr('name') == key){
                if(val){
                    $(span).html(dateForat(val));
                }

            }else if(key == "createdTime" && $(span).attr('name') == key){
                console.log(key)
                if(val){
                    $(span).html(dateForat(val));
                }

            }else if(key == "unboltTime" && $(span).attr('name') == key){
                if(val){
                    $(span).html(dateForat(val));
                }

            }else if(key == "hasPet" && $(span).attr('name') == key){
                if(val == "0"){
                    $(span).html("��");
                }else if(val == "1"){
                    $(span).html("��");
                }
            }else if(key == "issalesRoom" && $(span).attr('name') == key){
                if(val == "N"){
                    $(span).html("��");
                }else if(val == "Y"){
                    $(span).html("��");
                }
            }else if(key == "validOrInvalid" && $(span).attr('name') == key){
                if(val == "N"){
                    $(span).html("��");
                }else if(val == "Y"){
                    $(span).html("��");
                }
            }else if(key == "stealGas" && $(span).attr('name') == key){
                if(val == "N"){
                    $(span).html("��");
                }else if(val == "Y"){
                    $(span).html("��");
                }
            }else if(key == "idcardType" && $(span).attr('name') == key || key == "lesseeCerType"  && $(span).attr('name') == key){
                console.log(val)
                if(val == 1){
                    // 1��Ӫҵִ�գ�2���������֤��3������֤��4���ⷿ��ͬ��5���������֤
                    $(span).html("Ӫҵִ��")
                }else if(val == 2){
                    $(span).html("�������֤")
                }else if(val == 3){
                    $(span).html("����֤")
                }else if(val == 4){
                    $(span).html("�ⷿ��ͬ")
                }else if(val == 5){
                    $(span).html("�������֤")
                }
            }else if(key == "rentRoom" && $(span).attr('name') == key){
                if(val == "0"){
                    $(span).html("��");
                }else if(val == "1"){
                    $(span).html("��");
                }
            }else{
                if($(span).attr('name') == key){
                    $(span).html(val)
                }
            }
        })
    })
    if(gasctmarchive.bookId){
        var books = Restful.getByID(hzq_rest + "gasmrdbook",gasctmarchive.bookId);
        $('#tab1 span').each(function (index,val) {
            span = val;
            $.each(books, function (key, val) {
                if(key == "countperId" && $(span).attr('name') == key){
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gassysuser",
                        ref_col: "userId",
                        ref_display: "employeeName",
                    });
                    $(span).html(GastypeHelper.getDisplay(val));
                }else if(key == "serviceperId" && $(span).attr('name') == key){
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gassysuser",
                        ref_col: "userId",
                        ref_display: "employeeName",
                    });
                    $(span).html(GastypeHelper.getDisplay(val));
                }else if($(span).attr('name') == key){
                    $(span).html(val)
                }
            })
        })

    }
    if(gasctmarchive.houseId){
        var houses = Restful.getByID(hzq_rest + "gasctmhouse" , gasctmarchive.houseId);
        $('#tab1 span').each(function (index,val) {
            span = val;
            $.each(houses, function (key, val) {
                if($(span).attr('name') == key){
                    $(span).html(val)
                }
            })
        })
    }



}

function contract(archiveId,customerCode){
    $("#navtab li").on('click',function() {
        console.log($(this).find('a').text())
        if($(this).find('a').text() == "��ͬ���� "){
            $("#tab_1_2 span").html("");
            var contract = Restful.findNQ(hzq_rest + 'gasctmcontract?query={"ctmArchiveId":"'+archiveId+'"}');
            console.log(contract)
            if(contract.length){
                $('#tab_1_2 span').each(function (index,val) {
                    span = val;
                    $.each(contract[0],function(key,va){
                        if(key == "signupTime" && $(span).attr('name') == key){
                            console.log(va);
                            console.log(va+"==="+key);
                            if(va){
                                var data= va.split("T");
                                var aa=[];
                                for(var i=0;i<data[1].split(":").length;i++){
                                    if(i<2){
                                        aa.push(data[1].split(":")[i])
                                    }
                                }
                                data[1] = aa.join(":");
                                console.log(data.join(" "));
                                date=data.join(" ");
                                $(span).html(date);
                            }
                        }else if($(span).attr('name') == key){
                            $(span).html(va)
                        }
                    })
                })
            }

        }else if($(this).find('a').text() == "��ߵ��� "){
            $("#tab_1_3 span").html("");
            var ctmmeter = Restful.findNQ(hzq_rest + 'gasctmmeter/?query={"ctmArchiveId":"'+archiveId+'"}');
            console.log(ctmmeter)
            if(ctmmeter.length){
                var meter = Restful.getByID(hzq_rest + 'gasmtrmeter',ctmmeter[0].meterId);
                console.log(meter);
                if(JSON.stringify(meter) == "{}"){
                    return;
                }
                $('#tab_1_3 span').each(function (index,val) {
                    span = val;
                    $.each(meter,function(key,val){
                        if(key == "factoryId" && $(span).attr('name') == key){
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrfactory",
                                ref_col: "factoryId",
                                ref_display: "factoryName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        }else if(key == "reskindId" && $(span).attr('name') == key){
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrreskind",
                                ref_col: "reskindId",
                                ref_display: "reskindName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        }else if(key == "meterTypeId" && $(span).attr('name') == key){
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrmetertype",
                                ref_col: "meterTypeId",
                                ref_display: "meterTypeName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        }else if(key == "meterModelId" && $(span).attr('name') == key){
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrmeterspec",
                                ref_col: "meterModelId",
                                ref_display: "meterModelName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        }else if(key == "direction" && $(span).attr('name') == key){
                            if(val == 'L'){
                                $(span).html("��");
                            }else if(val == 'R'){
                                $(span).html("��");
                            }
                        }else if(key == "meterStatus" && $(span).attr('name') == key){
                            if(val == 1){
                                $(span).html("��");
                            }else if(val == 0){
                                $(span).html("�쳣");
                            }
                        }else if(key == "powerType" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.powerTypeFormat(val))
                        }else if(key == "valveInfo" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.valveInfoFormat(val))
                        }else if(key == "baseMeterVender" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.baseMeterVenderFormat(val))
                        }else if(key == "meterMaterial" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.meterMaterialFormat(val))
                        }else if(key == "controlType" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.controlTypeFormat(val))
                        }else if(key == "displayType" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.displayTypeFormat(val))
                        }else if(key == "chipType" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.chipTypeFormat(val))
                        }else if(key == "productionDate" && $(span).attr('name') == key){
                            if(val){
                                var data= val.split("T");
                                var aa=[];
                                for(var i=0;i<data[1].split(":").length;i++){
                                    if(i<2){
                                        aa.push(data[1].split(":")[i])
                                    }
                                }
                                data[1] = aa.join(":");
                                console.log(data.join(" "))
                                date=data.join(" ");
                                $(span).html(date);
                            }
                        }else{
                            if($(span).attr('name') == key){
                                console.log(key);
                                $(span).html(val)
                            }
                        }
                    })
                })
                var queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("factoryId",meter.factoryId),
                    RQLBuilder.equal("meterModelId",meter.meterModelId)
                ]).rql()
                var result = Restful.findNQ(hzq_rest + 'gasmtrmeterfactoryspec/?query='+queryCondion);
                console.log(result);
                if(result.length){
                    console.log(result[0].meterModelId)
                    var results = Restful.getByID(hzq_rest + 'gasmtrmeterflow',result[0].meterFlowId);
                    console.log(results);
                    console.log(results.ratingFlux)
                    console.log(results.flowName)
                    $("span[name='flow']").html(results.ratingFlux)
                    $("span[name='flowRange']").html(results.flowName)
                }
            }
        }else if($(this).find('a').text() == "ȼ���豸����") {
            gasequipment(archiveId)
        }else if($(this).find("a").text() == "ҵ�������¼"){
            business(customerCode,"divtable2");
        }else if($(this).find("a").text() == "�շ���Ϣ"){
            accounting(customerCode,"divtable3");
        }else if($(this).find("a").text() == "�����¼"){
            meterreading(archiveId,"divtable6");
        }else if($(this).find("a").text() == "����Ѽ�¼"){
            garbage(customerCode,"divtable8");
        }else if($(this).find("a").text() == "�ƷѸ���"){
            reduction(archiveId,"divtable10");
        }else if($(this).find("a").text() == "������"){
            gasrepair(customerCode,"divtable12");
        }
    })
}
var dated = function (){
    return{
        f:function(val){

            if(val){
                return  val.split("T").join(" ");
            }

        }
    }
}()
var idbll = function (){
    return{
        f:function(val){

            if(val == "0"){
                return  "δ�Ʒ�"
            }else if(val == "1"){
                return  "�ѼƷ�"
            }

        }
    }
}()
//�����¼
function meterreading(archiveId,div){

    $("#"+div).html("");
    XWATable.init({
        divname: div,
        //----------------table��ѡ��-------
        pageSize:10,
        columnPicker: true,
        transition: 'fade',
        checkboxes: true,
        sorting:true,
        checkAllToggle:true,
        //----------------��restful��ַ---
        restbase: 'gasmrdmeterreading/?query={"ctmArchiveId":"'+archiveId+'"}',
        key_column:'meterReadingId',
        coldefs:[
            {
                col:"bookId",
                friendly:"���?",
                readonly: "readonly",
                sorting: false,
                index:1
            },
            {
                col:"areaId",
                friendly:"��������",
                format:GasModSys.areaFormat,
                sorting: false,
                inputsource: "select",
                validate:"required",
                ref_url:  "gasbizarea",
                ref_name: "areaName",
                ref_value: "areaId",
                readonly: "readonly",
                index:3
            },
            {
                col: "countperId",
                friendly: "����Ա",
                format: countperFormat,
                sorting: false,
                index: 4
            },
            {
                col: "serviceperId",
                format: serviceFormat,
                friendly: "����Ա",
                sorting: false,
                index: 5
            },
            {
                col:"meterReading",
                friendly:"ȼ������",
                sorting: false,
                index:6
            },
            {
                col:"reviseReading",
                friendly:"��������",
                sorting: false,
                inputsource:"number",
                index:7
            },
            {
                col:"quotiety",
                friendly:"����ϵ��",
                sorting: false,
                index:8
            },
            {
                col:"dailyMeasure",
                friendly:"�վ�������",
                sorting: false,
                index:9
            },
            {
                col:"copyType",
                friendly:"��������",
                sorting: false,
                format:GasModMrd.copyTypeFormat,
                index:10
            },
            {
                col:"copyState",
                friendly:"����״̬",
                sorting: false,
                format:GasModMrd.mrdStateFormat,
                index:11
            },

            {
                col:"chargeMeterReading",
                friendly:"������",
                sorting: false,
                index:12
            },
            {
                col:"lastMeterReading",
                friendly:"�ϴα����",
                sorting: false,
                index:13
            },
            {
                col:"remaingAsnum",
                friendly:"����ʣ������",
                sorting: false,
                index:14
            },
            {
                col:"cardBalancEsum",
                friendly:"���ر���ʣ�����",
                sorting: false,
                index:15
            },
            {
                col:"isBll",
                friendly:"�Ƿ��Ѿ��Ʒ�",
                format:idbll,
                sorting: false,
                index:16
            },
            {
                col:"copyTime",
                friendly:"����ʱ��",
                format:dateFormat,
                sorting:true,
                index:17
            },
            {
                col:"lastReadingDate",
                friendly:"�ϴγ�������",
                sorting:true,
                format:dated,
                index:18
            },

        ],
        findFilter: function () {}

    }) //--init

}
//ҵ�������¼
function business(customerCode,div){
    var businessHelper = RefHelper.create({
        ref_url: "gascsrbusinesstype",
        ref_col: "businessTypeId",
        ref_display: "name"
    });

    var businessFormat = function () {
        return {
            f: function (val) {
                return businessHelper.getDisplay(val)
            },
        }
    }();
    var bilstateFormat = function () {
        return {
            f: function (val) {
                if(val == "N"){
                    return "Ĭ��"
                }else if(val == "Y"){
                    return "���"
                }

            },
        }
    }();

    $("#"+div).html("");
    XWATable.init({
        divname: div,
        //----------------table��ѡ��-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId:div,
        checkAllToggle: true,
        //----------------��restful��ַ---
        restbase: 'gascsrbusiregister/?query={"customerCode":"'+customerCode+'"}"',
        key_column: 'busiregisterid',
        coldefs: [
            {
                col: "businessTypeId",
                friendly: "ҵ������",
                format:businessFormat,
                sorting: false,
                index: 1
            },
            {
                col: "customerCode",
                friendly: "�ͻ����",
                sorting: false,
                index: 2
            },

            {
                col: "customerName",
                friendly: "�ͻ����",
                sorting: false,
                index: 3
            },
            {
                col: "customerAddr",
                friendly: "�ͻ���ַ",
                sorting: false,
                index: 4
            },
            {
                col: "linkMan",
                friendly: "��ϵ��",
                sorting: false,
                index: 5
            },
            {
                col: "linkPhone",
                friendly: "��ϵ�˵绰",
                sorting: false,
                index: 6
            },
            {
                col: "precontractTime",
                friendly: "ԤԼʱ��",
                format:dated,
                sorting: false,
                index: 7
            },
            {
                col: "acceptTime",
                friendly: "����ʱ��",
                format:dated,
                sorting: false,
                index: 8
            },
            {
                col: "busiAcceptCode",
                friendly: "���?��",
                sorting: false,
                index: 9
            },
            {
                col: "finishDate",
                friendly: "���ʱ��",
                format:dated,
                sorting: false,
                index: 10
            },
            {
                col: "billState",
                friendly: "����״̬",
                format:bilstateFormat,
                sorting: false,
                index: 10
            }
        ],
        findFilter: function () {}

    })
}

//�շ���Ϣ
function accounting(customerCode,div){
    /*Ӫҵ��
     --GAS_CHG_GAS_DETAIL
     inner join atl
     union
     --���д���
     GAS_CHG_GAS_BALANCE_DETAIL
     inner join atl*/
    /* select  det.trade_id,atl.* from  gas_chg_gas_detail det inner join gas_act_gasfee_atl atl on atl.gasfee_atl_id=det.trade_id where atl.customer_code='116003076' union
     select ba.TRADE_ATL_ID,atl.* from gas_chg_gas_balance_detail ba inner join gas_act_gasfee_atl atl on atl.gasfee_atl_id=ba.TRADE_ATL_ID where atl.customer_code='116003076'
     */

    var bd={
        "cols":"*",
        "froms":"(select  det.trade_id,atl.* from  gas_chg_gas_detail det inner join gas_act_gasfee_atl atl on atl.gasfee_atl_id=det.trade_id where atl.customer_code='"+customerCode+"' union "+
        "select ba.trade_atl_id,atl.* from gas_chg_gas_balance_detail ba inner join gas_act_gasfee_atl atl on atl.gasfee_atl_id=ba.trade_atl_id where atl.customer_code='"+customerCode+"')",
        "where":"1=1",
        "page":true,
        "limit":50
    }

    console.log(customerCode)
    $("#"+div).html("");
    var  tradeTyp = {"BBL":"�Ʒ�","DIS":"�Ż�","CHG":"�շ�","CLR":"����","RFD":"�˿�"}
    var clrtag = {"0":"δ����","1":"������","2":"������","9":"��������"}
    var clrtagFormat =function(){
        return{
            f:function(val){
                return clrtag[val];
            }
        }
    }();
    var tradeTypeFormat =function(){
        return{
            f:function(val){
                return tradeTyp[val];
            }
        }
    }();
    var gaschgtypeHelper = RefHelper.create({
        ref_url: "gaschgtype",
        ref_col: "chgTypeId",
        ref_display: "chargeTypeName"
    })
    var chargeTypeNameFormat = function () {
        return {
            f: function (val) {
                return gaschgtypeHelper.getDisplay(val)
            },
        }
    }();
    var arerHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    })
    var arerFormat = function () {
        return {
            f: function (val) {
                return arerHelper.getDisplay(val)
            },
        }
    }();
    var userHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName"
    });
    var userFormat = function () {
        return {
            f: function (val) {
                return userHelper.getDisplay(val)
            },
        }
    }();
    var chargeHelper = RefHelper.create({
        ref_url: "gasbizchargeunit",
        ref_col: "changrgeUnitId",
        ref_display: "changrgeUnitName"
    });
    var chargeFormat = function () {
        return {
            f: function (val) {
                return chargeHelper.getDisplay(val)
            },
        }
    }()
    XWATable.init({
        divname: div,
        //----------------table��ѡ��-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------��restful��ַ---
        restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        // restbase: 'gasactgasfeeatl/?query={"customerCode":"' + customerCode + '"}',
        key_column: 'gasfeeAtlId',
        coldefs: [
            {
                col: "tradeType",
                friendly: "��������",
                format: tradeTypeFormat,
                sorting: false,
                index: 1
            },
            {
                col: "changrgeUnitId",
                friendly: "Ӫҵ���",
                format: chargeFormat,
                sorting: false,
                index: 2
            },
            {
                col: "areaId",
                friendly: "��������",
                format: arerFormat,
                sorting: false,
                index: 3
            },
            {
                col: "userId",
                friendly: "ӪҵԱ",
                format: userFormat,
                sorting: false,
                index: 4
            },
            {
                col: "chgTypeId",
                friendly: "�շѷ�ʽ",
                format:chargeTypeNameFormat,
                sorting: false,
                index: 5
            },
            {
                col: "gas",
                friendly: "����",
                sorting: false,
                index: 6
            },
            {
                col: "money",
                friendly: "���",
                sorting: false,
                index: 7
            },

            {
                col: "lastMoney",
                friendly: "�ϴ����",
                sorting: false,
                index: 8
            },

            {
                col: "tradeDate",
                friendly: "����ʱ��",
                format:dateFormat,
                sorting: true,
                index: 9
            },
            {
                col: "clrDate",
                friendly: "����ʱ��",
                format:dateFormat,
                sorting: true,
                index: 10
            },
            /*{
             col: "clrTag",
             friendly: "�����־",
             format:clrtagFormat,
             sorting: false,
             index: 11
             },*/
        ],
        findFilter: function () {}
    })

}
//�����
function garbage(customerCode,div){
    var bd={
        "cols":"*",
        "froms":"(select  det.trade_id,atl.* from  gas_chg_gas_detail det inner join gas_act_wastefee_atl atl on atl.wastefee_atl_id=det.trade_id where atl.customer_code='"+customerCode+"' union "+
        "select ba.trade_atl_id,atl.* from gas_chg_gas_balance_detail ba inner join gas_act_wastefee_atl atl on atl.wastefee_atl_id=ba.trade_atl_id where atl.customer_code='"+customerCode+"')",
        "where":"1=1",
        "page":true,
        "limit":50
    }

    console.log(customerCode)
    $("#"+div).html("");
    var  tradeTyp = {"BBL":"�Ʒ�","DIS":"�Ż�","CHG":"�շ�","CLR":"����","RFD":"�˿�"}
    var clrtag = {"0":"δ����","1":"������","2":"������","9":"��������"}
    var clrtagFormat =function(){
        return{
            f:function(val){
                return clrtag[val];
            }
        }

    }();
    var tradeTypeFormat =function(){
        return{
            f:function(val){
                return tradeTyp[val];
            }
        }

    }();
    var gaschgtypeHelper = RefHelper.create({
        ref_url: "gaschgtype",
        ref_col: "chgTypeId",
        ref_display: "chargeTypeName"
    })
    var chargeTypeNameFormat = function () {
        return {
            f: function (val) {
                return gaschgtypeHelper.getDisplay(val)
            },
        }
    }();
    var arerHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    })
    var arerFormat = function () {
        return {
            f: function (val) {
                return arerHelper.getDisplay(val)
            },
        }
    }();
    var userHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName"
    });
    var userFormat = function () {
        return {
            f: function (val) {
                return userHelper.getDisplay(val)
            },
        }
    }();
    var chargeHelper = RefHelper.create({
        ref_url: "gasbizchargeunit",
        ref_col: "changrgeUnitId",
        ref_display: "changrgeUnitName"
    });
    var chargeFormat = function () {
        return {
            f: function (val) {
                return chargeHelper.getDisplay(val)
            },
        }
    }();

    XWATable.init({
        divname: div,
        //----------------table��ѡ��-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------��restful��ַ---
        restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        // restbase: 'gasactwastefeeatl/?query={"customerCode":"'+customerCode+'"}',
        key_column: 'wastefeeatlId',
        coldefs: [
            {
                col: "tradeType",
                friendly: "��������",
                format:tradeTypeFormat,
                sorting: false,
                index: 1
            },
            {
                col: "changrgeUnitId",
                friendly: "Ӫҵ���",
                format: chargeFormat,
                sorting: false,
                index: 2
            },
            {
                col: "areaId",
                friendly: "��������",
                format: arerFormat,
                sorting: false,
                index: 3
            },
            {
                col: "userId",
                friendly: "ӪҵԱ",
                format: userFormat,
                sorting: false,
                index: 4
            },
            {
                col: "money",
                friendly: "���",
                sorting: false,
                index: 5
            },

            {
                col: "lastMoney",
                friendly: "�ϴ����",
                sorting: false,
                index: 6
            },

            {
                col: "chgTypeId",
                friendly: "�շѷ�ʽ",
                format:chargeTypeNameFormat,
                sorting: false,
                index: 7
            },

            {
                col: "tradeDate",
                friendly: "��������",
                format:dated,
                sorting: true,
                index: 8
            },
            /* {
             col: "clrTag",
             friendly: "�����־",
             format:clrtagFormat,
             sorting: false,
             index: 9
             },*/
            {
                col: "modifiedTime",
                friendly: "���ʱ��",
                format:dated,
                sorting: true,
                index: 9
            },
        ],
        findFilter: function () {}

    })

}
//ȼ���豸
function gasequipment(ctmarchiveId){
    console.log(ctmarchiveId)
    var rest = Restful.findNQ(hzq_rest + 'gasctmrsdtdevicearchive/?query={"ctmArchiveId":"'+ctmarchiveId+'"}');
    console.log(rest)
    if(rest.length){
        console.log(rest)
        $.each(rest[0],function(key,val){
            $("#tab_1_4 input[type='radio'][name='"+key+"'][value='"+val+"']").parent('span').addClass("checked");
            if(val.indexOf('T')!= '-1'){
                $("#tab_1_4 input[type='text'][name='"+key+"']").val(val.split("T")[0]);
            }else{
                $("#tab_1_4 input[type='text'][name='"+key+"']").val(val);
            }
            $("#tab_1_4 input").attr('disabled',true)
        });

    }else{
        $("#tab_1_4 input").attr('disabled',true)
        $("#tab_1_4 input[type='text']").val("");
        $("#tab_1_4 input[type='radio']").parent('span').removeClass("checked");
    }
}
// ����Ʒ�
function reduction(archiveId,div){
    $("#"+div).html("");
    /*var db = {
     "col":"",
     "froms":"gas_bll_correct_flow f,gas_act_gasfee_atl a",

     }*/
    var arerHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    })
    var arerFormat = function () {
        return {
            f: function (val) {
                return arerHelper.getDisplay(val)
            },
        }
    }();
    XWATable.init({
        divname: div,
        //----------------table��ѡ��-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------��restful��ַ---
        restbase: 'gasbllcorrectflow/?query={"ctmArchiveId":"'+archiveId+'"}',
        key_column: 'correctFlowId',
        coldefs: [
            {
                col: "areaId",
                friendly: "��������",
                format:arerFormat,
                sorting: false,
                index: 1
            },
            {
                col: "correctGas",
                friendly: "��������",
                sorting: false,
                index: 2
            },
            {
                col: "correctMon",
                friendly: "������",
                sorting: false,
                index: 3
            },
            {
                col: "correctReason",
                friendly: "����ԭ��",
                sorting: false,
                index: 3
            },
            {
                col: "remark",
                friendly: "��ע",
                sorting: false,
                index: 3
            },

        ],
        findFilter: function () {}

    })

}
//������
function gasrepair(customerCode,div){
    $("#"+div).html("");
    XWATable.init({
        divname: div,
        //----------------table��ѡ��-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        tableId: div,
        checkAllToggle: true,
        //----------------��restful��ַ---
        restbase: 'gaschgiccardcomplement/?query={"customerCode":"'+customerCode+'"}',
        key_column: 'complementId',
        coldefs: [
            /*{
             col: "complementId",
             friendly: "����Id",
             validate: "required",
             hidden: true,
             unique: "true",
             index: 1
             },*/
            {
                col: "customerCode",
                friendly: "�ͻ����",
                sorting: false,
                index: 1
            },
            {
                col: "customerName",
                friendly: "�ͻ����",
                sorting: false,
                index: 2
            },
            {
                col: "applyGas",
                friendly: "��������",
                sorting: false,
                index: 3
            },
            {
                col: "approveGas",
                friendly: "��׼����",
                sorting: false,
                index: 4
            },
            {
                col: "applyReason",
                friendly: "����ԭ��",
                sorting: false,
                index: 5
            },
            {
                col: "applyTime",
                friendly: "����ʱ��",
                sorting: true,
                index: 6
            },
            {
                col: "approveTime",
                friendly: "��׼ʱ��",
                sorting: true,
                index: 7
            },
            {
                col: "useTime",
                friendly: "ʹ��ʱ��",
                sorting: true,
                index: 8
            },
            {
                col: "useState",
                friendly: "����״̬",
                sorting: false,
                index: 9
            },
            {
                col: "remark",
                friendly: "��ע",
                sorting: false,
                index: 10
            }

        ],
        findFilter: function () {}

    })
}

// �Ǿ���

$(document).on('click',"#noninformation",function(){

    var row = JSON.parse($(this).attr("data-kind"));
    $("#customerCode1").val(row.customerCode);
    $("#customerName1").val(row.customerName);
    $("#customerAddress1").val(row.customerAddress);
    console.log(row);
    $("#navtab1 li").eq(0).addClass("active").siblings().removeClass("active");
    $("#tab11").addClass("active").siblings().removeClass("active");
    //�ͻ�����
    nonctmarchive(row.ctmArchiveId);
    //��ͬ
    noncontract(row.ctmArchiveId,row.customerCode);

});
function nonctmarchive(archiveId){
    console.log(archiveId);
    $('#tab11 span').html("");
    /* var account = Restful.findNQ(hzq_rest + 'gaschgaccctm?query={"ctmArchiveId":"'+archiveId+'"}');
     console.log(account)
     if(account.length){
     var accounts = Restful.getByID(hzq_rest + 'gaschgaccount',account[0].chgAccountId);
     console.log(accounts)
     $('#tab11 span').each(function (index,val) {
     span = val;
     $.each(accounts, function (key, val) {

     if(key == "invoiceType" && $(span).attr('name') == key){
     console.log(val)
     if(val == 1){
     $(span).html("��ͨ��Ʊ")
     }else if(val == 2){
     $(span).html("��ֵ˰��Ʊ")
     }
     }else if($(span).attr('name') == key){
     $(span).html(val)
     }
     })
     })
     }*/
    var renter = Restful.findNQ(hzq_rest + 'gasctmrenter?query={"ctmArchiveId":"'+archiveId+'"}');
    console.log(renter)
    var coefficient = Restful.findNQ(hzq_rest + 'gasctmmeter/?query={"ctmArchiveId":"'+archiveId+'"}');
    if(coefficient.length){
        $.each(coefficient[0],function(key,val){
            if(key=="isOnline"){
                if(val == '1'){
                    $("span[name='"+key+"']").html("��")
                }else if(val == '0'){
                    $("span[name='"+key+"']").html("��")
                }
            }else if(key=="meterFlag"){
                if(val == '1'){
                    $("span[name='"+key+"']").html("ʹ��һ�α����")
                }else if(val == '2'){
                    $("span[name='"+key+"']").html("ʹ����������")
                }
            }else if(key=="meterUserState"){
                if(val == '01'){
                    $("span[name='"+key+"']").html("��")
                }else if(val == '02'){
                    $("span[name='"+key+"']").html("��ͣ����")
                }else if(val == '03'){
                    $("span[name='"+key+"']").html("���״̬")
                }else if(val == '00'){
                    $("span[name='"+key+"']").html("���û�")
                }else if(val == '99'){
                    $("span[name='"+key+"']").html("ɾ��")
                }
            }else{
                $("span[name='"+key+"']").html(val)
            }

        })
    }




    if(renter.length){
        $('#tab1 span').each(function (index,val) {
            span = val;
            $.each(renter[0],function(key,val){
                if(key == "lesseeExpire" && $(span).attr('name') == key) {
                    if(val){
                        $(span).html(dateForat(val));
                    }

                }else if(key == "lesseeCerType" && $(span).attr('name') == key){
                    if(val == 1){
                        $(span).html("Ӫҵִ��")
                    }else if(val == 2){
                        $(span).html("�������֤")
                    }else if(val == 3){
                        $(span).html("����֤")
                    }else if(val == 4){
                        $(span).html("�ⷿ��ͬ")
                    }else if(val == 5){
                        $(span).html("�������֤")
                    }
                }else{
                    if($(span).attr('name') == key){
                        $(span).html(val)
                    }
                }
            })
        })
    }

    var gasctmarchive = Restful.getByID(hzq_rest + "gasctmarchive",archiveId);
    console.log(gasctmarchive);
    $('#tab11 span').each(function (index,val) {
        span = val;
        $.each(gasctmarchive, function (key, val) {
            if (key == "customerType" && $(span).attr('name') == key) {
                if (val == "P") {
                    $(span).html("��ͨ��")
                } else if (val == 'I') {
                    $(span).html("IC����")
                }
            } else if (key == "customerKind" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("����")
                } else if (val == '9') {
                    $(span).html("�Ǿ���")
                }
            } else if (key == "industrySort" && $(span).attr('name') == key) {
                $(span).html(GasModCtms.industrySortFormat(val));
            } else if (key == "reminderWay" && $(span).attr('name') == key) {
                $(span).html(GasModCtms.reminderWayFormat(val));
            } else if (key == "alarm" && $(span).attr('name') == key) {
                if (val == "Y") {
                    $(span).html("��")
                } else if (val == 'N') {
                    $(span).html("��")
                }
            }else if(key == "invoiceType" && $(span).attr('name') == key ){
                if(val == "1"){
                    $(span).html("��ͨ��Ʊ")
                }else if(val == '2'){
                    $(span).html("��ֵ˰��Ʊ")
                }
            }else if (key == "gasEnvironment" && $(span).attr('name') == key) {
                var len = val.split(',');
                var str = "";
                for (var i = 0; i < len.length; i++) {
                    if (len[i] == "1") {
                        str += "��ʪ "
                    } else if (len[i] == "2") {
                        str += "���� "
                    } else if (len[i] == "3") {
                        str += "�ܱշ��� "
                    } else if (len[i] == "4") {
                        str += "���ܱշ��� "
                    } else if (len[i] == "5") {
                        str += "���׷����� "
                    }
                }
                $(span).html(str)

            } else if (key == "deviceType" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("��ѹ��")
                } else if (val == "2") {
                    $(span).html("��ѹ��")
                } else if (val == "3") {
                    $(span).html("��ѹվ")
                }
            } else if (key == "businessProperty" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("���̶���/����")
                } else if (val == "2") {
                    $(span).html("�������")
                } else if (val == "3") {
                    $(span).html("��ҵ��λ")
                } else if (val == "4") {
                    $(span).html("����")
                }
            } else if (key == "businessSituation" && $(span).attr('name') == key) {
                if (val == "1") {
                    $(span).html("����")
                } else if (val == "2") {
                    $(span).html("����")
                } else if (val == "3") {
                    $(span).html("һ��")
                } else if (val == "4") {
                    $(span).html("�ϲ�")
                } else if (val == "5") {
                    $(span).html("��")
                }
            } else if (key == "customerState" && $(span).attr('name') == key) {
                if (val == "01") {
                    //"01":"��","02":"��ͣ����","03":"���״̬","00":"���û�","99":"ɾ��"
                    $(span).html("��")
                } else if (val == "02") {
                    $(span).html("��ͣ����")
                } else if (val == "03") {
                    $(span).html("���״̬")
                } else if (val == "00") {
                    $(span).html("���û�")
                } else if (val == "99") {
                    $(span).html("ɾ��")
                }
            } else if (key == "gasTypeId" && $(span).attr('name') == key) {
                var GastypeHelper = RefHelper.create({
                    ref_url: "gasbizgastype",
                    ref_col: "gasTypeId",
                    ref_display: "gasTypeName",
                });
                $(span).html(GastypeHelper.getDisplay(val));
            } else if (key == "areaId" && $(span).attr('name') == key) {
                var GastypeHelper = RefHelper.create({
                    ref_url: "gasbizarea",
                    ref_col: "areaId",
                    ref_display: "areaName",
                });
                $(span).html(GastypeHelper.getDisplay(val));
            } else if (key == "countperId" && $(span).attr('name') == key) {
                var GastypeHelper = RefHelper.create({
                    ref_url: "gassysuser",
                    ref_col: "userId",
                    ref_display: "employeeName",
                });
                $(span).html(GastypeHelper.getDisplay(val));

            } else if (key == "serviceperId" && $(span).attr('name') == key) {
                var GastypeHelper = RefHelper.create({
                    ref_url: "gassysuser",
                    ref_col: "userId",
                    ref_display: "employeeName",
                });
                $(span).html(GastypeHelper.getDisplay(val));

            } else if (key == "lesseeExpire" && $(span).attr('name') == key) {
                var data = val.split("T");
                var aa = [];
                for (var i = 0; i < data[1].split(":").length; i++) {
                    if (i < 2) {
                        aa.push(data[1].split(":")[i])
                    }
                }
                data[1] = aa.join(":");
                console.log(data.join(" "))
                date = data.join(" ");
                $(span).html(date);
            } else if (key == "createdTime" && $(span).attr('name') == key) {
                var data = val.split("T");
                var aa = [];
                for (var i = 0; i < data[1].split(":").length; i++) {
                    if (i < 2) {
                        aa.push(data[1].split(":")[i])
                    }
                }
                data[1] = aa.join(":");
                console.log(data.join(" "))
                date = data.join(" ");
                $(span).html(date);
            } else if (key == "unboltTime" && $(span).attr('name') == key) {
                var data = val.split("T");
                var aa = [];
                for (var i = 0; i < data[1].split(":").length; i++) {
                    if (i < 2) {
                        aa.push(data[1].split(":")[i])
                    }
                }
                data[1] = aa.join(":");
                console.log(data.join(" "))
                date = data.join(" ");
                $(span).html(date);
            } else if (key == "hasPet" && $(span).attr('name') == key) {
                if (val == "0") {
                    $(span).html("��");
                } else if (val == "1") {
                    $(span).html("��");
                }
            } else if (key == "issalesRoom" && $(span).attr('name') == key) {
                if (val == "N") {
                    $(span).html("��");
                } else if (val == "Y") {
                    $(span).html("��");
                }
            } else if (key == "validOrInvalid" && $(span).attr('name') == key) {
                if (val == "N") {
                    $(span).html("��");
                } else if (val == "Y") {
                    $(span).html("��");
                }
            } else if (key == "stealGas" && $(span).attr('name') == key) {
                if (val == "N") {
                    $(span).html("��");
                } else if (val == "Y") {
                    $(span).html("��");
                }
            } else if (key == "idcardType" && $(span).attr('name') == key) {
                console.log(val)
                if (val == 1) {
                    // 1��Ӫҵִ�գ�2���������֤��3������֤��4���ⷿ��ͬ��5���������֤
                    $(span).html("Ӫҵִ��")
                } else if (val == 2) {
                    $(span).html("�������֤")
                } else if (val == 3) {
                    $(span).html("����֤")
                } else if (val == 4) {
                    $(span).html("�ⷿ��ͬ")
                } else if (val == 5) {
                    $(span).html("�������֤")
                }
            } else if (key == "lesseeCerType" && $(span).attr('name') == key) {
                console.log(val)
                if (val == 1) {
                    // 1��Ӫҵִ�գ�2���������֤��3������֤��4���ⷿ��ͬ��5���������֤
                    $(span).html("Ӫҵִ��")
                } else if (val == 2) {
                    $(span).html("�������֤")
                } else if (val == 3) {
                    $(span).html("����֤")
                } else if (val == 4) {
                    $(span).html("�ⷿ��ͬ")
                } else if (val == 5) {
                    $(span).html("�������֤")
                }
            } else if (key == "rentRoom" && $(span).attr('name') == key) {
                if (val == "0") {
                    $(span).html("��");
                } else if (val == "1") {
                    $(span).html("��");
                }
            } else {
                if ($(span).attr('name') == key) {
                    $(span).html(val)
                }
            }
        })
    })

    if(gasctmarchive.bookId){
        var books = Restful.getByID(hzq_rest + "gasmrdbook",gasctmarchive.bookId);
        $('#tab11 span').each(function (index,val) {
            span = val;
            $.each(books, function (key, val) {
                if(key == "countperId" && $(span).attr('name') == key){
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gassysuser",
                        ref_col: "userId",
                        ref_display: "employeeName",
                    });
                    $(span).html(GastypeHelper.getDisplay(val));
                }else if(key == "serviceperId" && $(span).attr('name') == key){
                    var GastypeHelper = RefHelper.create({
                        ref_url: "gassysuser",
                        ref_col: "userId",
                        ref_display: "employeeName",
                    });
                    $(span).html(GastypeHelper.getDisplay(val));
                }else if($(span).attr('name') == key){
                    $(span).html(val)
                }
            })
        })

    }
    if(gasctmarchive.houseId){
        var houses = Restful.getByID(hzq_rest + "gasctmhouse" , gasctmarchive.houseId);
        $('#tab11 span').each(function (index,val) {
            span = val;
            $.each(houses, function (key, val) {
                if($(span).attr('name') == key){
                    $(span).html(val)
                }
            })
        })
    }
}

function noncontract(archiveId,customerCode){
    $("#navtab1 li").on('click',function() {
        console.log($(this).find('a').text())
        if($(this).find('a').text() == "��ͬ���� "){
            $("#tab12 span").html("");
            var contract = Restful.findNQ(hzq_rest + 'gasctmcontract?query={"ctmArchiveId":"'+archiveId+'"}');
            console.log(contract)
            if(contract.length){
                $('#tab12 span').each(function (index,val) {
                    span = val;
                    $.each(contract[0],function(key,va){
                        if(key == "signupTime" && $(span).attr('name') == key){
                            console.log(va);
                            console.log(va+"==="+key);
                            if(va){
                                var data= va.split("T");
                                var aa=[];
                                for(var i=0;i<data[1].split(":").length;i++){
                                    if(i<2){
                                        aa.push(data[1].split(":")[i])
                                    }
                                }
                                data[1] = aa.join(":");
                                console.log(data.join(" "));
                                date=data.join(" ");
                                $(span).html(date);
                            }
                        }else if(key == "gasType" && $(span).attr('name') == key){
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasbizgastype",
                                ref_col: "gasTypeId",
                                ref_display: "gasTypeName",
                            });
                            $(span).html(GastypeHelper.getDisplay(va));
                        }else if($(span).attr('name') == key){
                            $(span).html(va)
                        }

                    })
                })
            }else{
                $('#tab12 span').html("")
            }

        }else if($(this).find('a').text() == "��ߵ��� "){
            $("#tab13 span").html("");
            var ctmmeter = Restful.findNQ(hzq_rest + 'gasctmmeter/?query={"ctmArchiveId":"'+archiveId+'"}');
            console.log(ctmmeter)
            if(ctmmeter.length){
                var meter = Restful.getByID(hzq_rest + 'gasmtrmeter',ctmmeter[0].meterId);
                console.log(meter);
                if(JSON.stringify(meter) == "{}"){
                    return;
                }
                $('#tab13 span').each(function (index,val) {
                    span = val;
                    $.each(meter,function(key,val){
                        if(key == "factoryId" && $(span).attr('name') == key){
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrfactory",
                                ref_col: "factoryId",
                                ref_display: "factoryName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        }else if(key == "reskindId" && $(span).attr('name') == key){
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrreskind",
                                ref_col: "reskindId",
                                ref_display: "reskindName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        }else if(key == "meterModelId" && $(span).attr('name') == key){
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrmeterspec",
                                ref_col: "meterModelId",
                                ref_display: "meterModelName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        }else if(key == "meterTypeId" && $(span).attr('name') == key){
                            console.log(val)
                            var GastypeHelper = RefHelper.create({
                                ref_url: "gasmtrmetertype",
                                ref_col: "meterTypeId",
                                ref_display: "meterTypeName",
                            });
                            $(span).html(GastypeHelper.getDisplay(val));

                        }else if(key == "direction" && $(span).attr('name') == key){
                            if(val == 'L'){
                                $(span).html("��");
                            }else if(val == 'R'){
                                $(span).html("��");
                            }
                        }else if(key == "meterStatus" && $(span).attr('name') == key){
                            if(val == 1){
                                $(span).html("��");
                            }else if(val == 0){
                                $(span).html("�쳣");
                            }
                        }else if(key == "powerType" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.powerTypeFormat(val))
                        }else if(key == "valveInfo" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.valveInfoFormat(val))
                        }else if(key == "baseMeterVender" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.baseMeterVenderFormat(val))
                        }else if(key == "meterMaterial" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.meterMaterialFormat(val))
                        }else if(key == "controlType" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.controlTypeFormat(val))
                        }else if(key == "displayType" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.displayTypeFormat(val))
                        }else if(key == "chipType" && $(span).attr('name') == key){
                            $(span).html(GasModCtms.chipTypeFormat(val))
                        }else if(key == "productionDate" && $(span).attr('name') == key){
                            if(val){
                                var data= val.split("T");
                                var aa=[];
                                for(var i=0;i<data[1].split(":").length;i++){
                                    if(i<2){
                                        aa.push(data[1].split(":")[i])
                                    }
                                }
                                data[1] = aa.join(":");
                                console.log(data.join(" "))
                                date=data.join(" ");
                                $(span).html(date);
                            }
                        }else{
                            if($(span).attr('name') == key){
                                $(span).html(val)
                            }
                        }
                    })
                })
                var queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("factoryId",meter.factoryId),
                    RQLBuilder.equal("meterModelId",meter.meterModelId)
                ]).rql()
                var result = Restful.findNQ(hzq_rest + 'gasmtrmeterfactoryspec/?query='+queryCondion);
                console.log(result);
                if(result.length){
                    console.log(result)
                    var results = Restful.findNQ(hzq_rest + 'gasmtrmeterflow/'+result[0].meterFlowId);
                    console.log(results);
                    $("span[name='flow']").html(results.ratingFlux)
                    $("span[name='flowRange']").html(results.flowName)
                }


            }else{
                $('#tab13 span').html("")
            }
        }else if($(this).find('a').text() == "ȼ���豸����") {
            nongasequipment(archiveId)
        }else if($(this).find('a').text() == "ҵ�������¼") {
            business(customerCode,"divtable4")
        }else if($(this).find('a').text() == "�շ���Ϣ") {

            accounting(customerCode,"divtable5");

        }else if($(this).find("a").text() == "�����¼"){
            meterreading(archiveId,"divtable7")
        }else if($(this).find("a").text() == "����Ѽ�¼"){
            garbage(archiveId,"divtable9")
        }else if($(this).find("a").text() == "�ƷѸ���"){
            reduction(archiveId,"divtable11")
        }else if($(this).find("a").text() == "������"){
            gasrepair(customerCode,"divtable13")
        }
    })
}

function nongasequipment(ctmarchiveId){
    $("#tab14 input[type='radio']").attr("disabled",true);
    var rest = Restful.findNQ(hzq_rest + 'gasctmnonrsdtdevicearchive/?query={"ctmArchiveId":"'+ctmarchiveId+'"}');
    console.log(rest);
    if(rest.length){
        // $('#divtable1').html('');
        var xw = XWATable.init({
            divname: "divtable1",
            //----------------table��ѡ��-------
            pageSize: 10,
            columnPicker: true,
            transition: 'fade',
            tableId: "divtable1",
            checkAllToggle: true,
            //----------------��restful��ַ---
            restbase: 'gasctmnonrsdtdevicedetail/?query={"nonrsdtArchiveId":"'+rest[0].nonrsdtArchiveId+'"}"',
            key_column: 'nonrsdtArchiveDetailId',
            coldefs: [
                {
                    col: "name",
                    friendly: "�豸���",
                    sorting: false,
                    index: 1
                },
                {
                    col: "count",
                    friendly: "�豸����",
                    sorting: false,
                    index: 2
                },
                {
                    col: "position",
                    friendly: "�豸��װλ��",
                    sorting: false,
                    index: 3
                },
                {
                    col: "brand",
                    friendly: "�豸Ʒ��",
                    sorting: false,
                    index: 4
                },
                {
                    col: "model",
                    friendly: "�豸�ͺ�",
                    sorting: false,
                    index: 5
                },
                {
                    col: "thermalPower",
                    friendly: "��ȹ���",
                    sorting: false,
                    index: 6
                },
                {
                    col: "remark",
                    friendly: "��ע",
                    sorting: false,
                    index: 7
                }
            ],
            findFilter: function () {

            }

        });

        $.each(rest[0],function(key,val){
            $("#tab14 input[type='radio'][name='"+key+"'][value='"+val+"']").parent('span').addClass("checked");
            $("#tab14 input[type='text'][name='"+key+"']").val(val);
        })
    }else{
        $("#tab14 input").attr('disabled',true);
        $("#tab14 input[type='text']").val("");
        $("#tab14 input[type='radio']").parent('span').removeClass("checked");
        $("#divtable1").html("");
    }
}



