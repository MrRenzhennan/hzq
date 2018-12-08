/**
 * Created by Administrator on 2017/5/22 0022.
 */


/**
 * Created by jack on 3/16/17.
 */

console.log(localStorage.getItem('user_info'));

ComponentsPickers.init();
var href = document.location.href;
var archiveId = href.substring(href.indexOf("?")+1, href.lenth);

$('.ctmArchiveId').val(archiveId);
console.log(archiveId);

$.ajax({
    url:hzq_rest + 'gasctmrenter?query={"ctmArchiveId":"'+archiveId+'"}',
    type:"get",
    // data:JSON.stringify(bd),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function(data){
        console.log(data)
        if(data.length){
            $('#tab_1_1 span').each(function (index,val) {
                span = val;
                $.each(data[0],function(key,val){
                    if(key == "lesseeExpire" && $(span).attr('name') == key) {
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
                    }else if(key == "lesseeCerType" && $(span).attr('name') == key){
                        if(val == 1){
                            // 1：营业执照；2：法人身份证；3：房产证；4：租房合同；5：居民身份证
                            $(span).html("营业执照")
                        }else if(val == 2){
                            $(span).html("法人身份证")
                        }else if(val == 3){
                            $(span).html("房产证")
                        }else if(val == 4){
                            $(span).html("租房合同")
                        }else if(val == 5){
                            $(span).html("居民身份证")
                        }
                    }else{
                        if($(span).attr('name') == key){
                            $(span).html(val)
                        }
                    }
                })
            })
        }

    }
})

/*var GasModCtms = function () {

    var industrySort = {"01":"政府机关","02":"金融","03":"信息服务","04":"进出口贸易","05":"军事国防","06":"出版印刷",
        "07":"科研","08":"制造业","09":"医药卫生","10":"石油化工能源","11":"教育","12":"旅游","13":"广播电视",
        "14":"建筑","15":"邮政","16":"电信","17":"工商","18":"税务","19":"交通","20":"会计类","21":"公检法",
        "22":"零售服务","23":"餐饮","24":"住宿","25":"洗浴","26":"小吃","27":"公用事业","28":"批发销售",
        "29":"事业单位"
    };
    var reminderWay = {"1":"微信","2":"QQ","3":"电话通知","4":"短信通知","5":"门贴"}
    return {
        industrySortFormat:function(val) {
            return industrySort[val];
        },
        reminderWayFormat:function(val){
            return reminderWay[val];
        }
    }
}();*/
var GasModCtms = function () {
    var industrySort = {"01":"政府机关","02":"金融","03":"信息服务","04":"进出口贸易","05":"军事国防","06":"出版印刷",
        "07":"科研","08":"制造业","09":"医药卫生","10":"石油化工能源","11":"教育","12":"旅游","13":"广播电视",
        "14":"建筑","15":"邮政","16":"电信","17":"工商","18":"税务","19":"交通","20":"会计类","21":"公检法",
        "22":"零售服务","23":"餐饮","24":"住宿","25":"洗浴","26":"小吃","27":"公用事业","28":"批发销售",
        "29":"事业单位"
    };
    var customerState = {"00":"未开栓","01":"正常","02":"暂停用气","03":"拆除状态","99":"删除"};

    var idcardType = {"1":"营业执照","2":"法人身份证","3":"房产证","4":"租房合同","5":"居民身份证"};

    var reminderWay = {"1":"微信","2":"QQ","3":"电话通知","4":"短信通知","5":"门贴"};
    var meterMaterial={"1":"铁","2":"铝"};
    var baseMeterVender={"1":"金卡","2":"松川","3":"蓝宝石"};
    var displayType={"1":"机械","2":"电子","3":"机械+电子"};
    var controlType={"1":"远传阀控","2":"远传IC卡","3":"IC卡气量","4":"IC卡金额"};
    var chipType={"1":"102卡 气量卡","2":"102卡 金额卡","3":"4442卡 气量卡","4":"4442卡 金额卡"};
    var valveInfo = {"1": "正常", "2": "异常"};
    var powerType = {"1": "干电池", "2": "锂电池"};

    return {
        industrySortFormat:function(val) {
            return industrySort[val];
        },
        idcardTypeFormat:function(val){
            return idcardType[val];
        },
        customerStateFormat:function(val){
            return customerState[val]
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



$.ajax({
    url:hzq_rest + "gasctmarchive/"+archiveId,
    type:"get",
    // data:JSON.stringify(bd),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function(data){
        console.log(data)
        // console.log(archiveId);
        if(data.houseId){
            $.ajax({
                url: hzq_rest + "gasctmhouse/" + data.houseId,
                type: "get",
                // data:JSON.stringify(bd),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (data) {
                    console.log(data)
                    $('#tab_1_1 span').each(function (index,val) {
                        span = val;
                        $.each(data, function (key, val) {
                            if($(span).attr('name') == key){
                                $(span).html(val)
                            }
                        })
                    })
                }
            })
        }
        if(data.bookId){
            $.ajax({
                url: hzq_rest + "gasmrdbook/" + data.bookId,
                type: "get",
                // data:JSON.stringify(bd),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (data) {
                    console.log(data)
                    $('#tab_1_1 span').each(function (index,val) {
                        span = val;

                            $.each(data, function (key, val) {
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
            })
        }
        $('#tab_1_1 span').each(function (index,val) {
            span = val;
            $.each(data,function(key,val){
                if(key == "customerType" && $(span).attr('name') == key ){
                    if(val == "P"){
                        $(span).html("普通表")
                    }else if(val == 'I'){
                        $(span).html("IC卡表")
                    }
                }else if(key == "gasResource" && $(span).attr('name') == key ){
                    if(val == "1"){
                        $(span).html("普通")
                    }else if(val == '2'){
                        $(span).html("煤改气")
                    }
                }else if(key == "customerKind" && $(span).attr('name') == key ){
                    if(val == "1"){
                        $(span).html("居民")
                    }else if(val == '9'){
                        $(span).html("非居民")
                    }
                }else if(key == "industrySort" && $(span).attr('name') == key ){
                    $(span).html(GasModCtms.industrySortFormat(val));
                }else if(key == "reminderWay" && $(span).attr('name') == key ){
                    $(span).html(GasModCtms.reminderWayFormat(val));
                }else if(key == "alarm" && $(span).attr('name') == key ){
                    if(val == "Y"){
                        $(span).html("有")
                    }else if(val == 'N'){
                        $(span).html("无")
                    }
                }else if(key == "invoiceType" && $(span).attr('name') == key ){
                    if(val == "1"){
                        $(span).html("普通发票")
                    }else if(val == '2'){
                        $(span).html("增值税发票")
                    }
                }else if(key == "gasEnvironment" && $(span).attr('name') == key ){
                    var len = val.split(',');
                    var str = "";
                    for(var i=0;i<len.length;i++){
                        if(len[i] == "1"){
                            str += "潮湿 "
                        }else if(len[i] == "2"){
                            str += "高温 "
                        }else if(len[i] == "3"){
                            str += "密闭房间 "
                        }else if(len[i] == "4"){
                            str += "非密闭房间 "
                        }else if(len[i] == "5"){
                            str += "防雷防静电 "
                        }
                    }
                        $(span).html(str)

                }else if(key == "deviceType" && $(span).attr('name') == key){
                    if(val == "1"){
                        $(span).html("调压柜")
                    }else if(val == "2"){
                        $(span).html("调压箱")
                    }else if(val == "3"){
                        $(span).html("调压站")
                    }
                }else if(key == "businessProperty" && $(span).attr('name') == key){
                    if(val == "1"){
                        $(span).html("外商独资/合资")
                    }else if(val == "2"){
                        $(span).html("政府机关")
                    }else if(val == "3"){
                        $(span).html("事业单位")
                    }else if(val == "4"){
                        $(span).html("国企")
                    }
                }else if(key == "businessSituation" && $(span).attr('name') == key){
                    if(val == "1"){
                        $(span).html("优秀")
                    }else if(val == "2"){
                        $(span).html("良好")
                    }else if(val == "3"){
                        $(span).html("一般")
                    }else if(val == "4"){
                        $(span).html("较差")
                    }else if(val == "5"){
                        $(span).html("差")
                    }
                }else if(key == "customerState" && $(span).attr('name') == key){
                    if(val == "01"){
                        //"01":"正常","02":"暂停用气","03":"拆除状态","00":"新用户","99":"删除"
                        $(span).html("正常")
                    }else if(val == "02"){
                        $(span).html("暂停用气")
                    }else if(val == "03"){
                        $(span).html("拆除状态")
                    }else if(val == "00"){
                        $(span).html("未开栓")
                    }else if(val == "99"){
                        $(span).html("删除")
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
                }else if(key == "createdTime" && $(span).attr('name') == key){
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
                }else if(key == "unboltTime" && $(span).attr('name') == key){
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
                }else if(key == "hasPet" && $(span).attr('name') == key){
                    if(val == "0"){
                        $(span).html("无");
                    }else if(val == "1"){
                        $(span).html("有");
                    }
                }else if(key == "issalesRoom" && $(span).attr('name') == key){
                    if(val == "N"){
                        $(span).html("否");
                    }else if(val == "Y"){
                        $(span).html("是");
                    }
                }else if(key == "validOrInvalid" && $(span).attr('name') == key){
                    if(val == "N"){
                        $(span).html("否");
                    }else if(val == "Y"){
                        $(span).html("是");
                    }
                }else if(key == "stealGas" && $(span).attr('name') == key){
                    if(val == "N"){
                        $(span).html("否");
                    }else if(val == "Y"){
                        $(span).html("是");
                    }
                }else if(key == "idcardType" && $(span).attr('name') == key){
                    console.log(val)
                    if(val == 1){
                        // 1：营业执照；2：法人身份证；3：房产证；4：租房合同；5：居民身份证
                        $(span).html("营业执照")
                    }else if(val == 2){
                        $(span).html("法人身份证")
                    }else if(val == 3){
                        $(span).html("房产证")
                    }else if(val == 4){
                        $(span).html("租房合同")
                    }else if(val == 5){
                        $(span).html("居民身份证")
                    }
                }else if(key == "lesseeCerType" && $(span).attr('name') == key){
                    console.log(val)
                    if(val == 1){
                        // 1：营业执照；2：法人身份证；3：房产证；4：租房合同；5：居民身份证
                        $(span).html("营业执照")
                    }else if(val == 2){
                        $(span).html("法人身份证")
                    }else if(val == 3){
                        $(span).html("房产证")
                    }else if(val == 4){
                        $(span).html("租房合同")
                    }else if(val == 5){
                        $(span).html("居民身份证")
                    }
                }else if(key == "rentRoom" && $(span).attr('name') == key){
                    if(val == "0"){
                        $(span).html("否");
                    }else if(val == "1"){
                        $(span).html("是");
                    }
                }else{
                    if($(span).attr('name') == key){
                        $(span).html(val)
                    }
                }
                /*if($(span).attr('name') == key){
                 $(span).html(val)
                 }*/
            })
        })
        var inputQuery = RQLBuilder.and([
            RQLBuilder.equal("ctmArchiveId",archiveId),
            RQLBuilder.equal("meterUserState","01")
        ]).rql();

        var coefficient = Restful.findNQ(hzq_rest + 'gasctmmeter/?query='+inputQuery);
        console.log(coefficient)
        if(coefficient.length){
            $.each(coefficient[0],function(key,val){
                if(key=="isOnline"){
                    if(val == '1'){
                        $("span[name='"+key+"']").html("是")
                    }else if(val == '0'){
                        $("span[name='"+key+"']").html("否")
                    }
                }else if(key=="meterFlag"){
                    if(val == '1'){
                        $("span[name='"+key+"']").html("使用一次表读数")
                    }else if(val == '2'){
                        $("span[name='"+key+"']").html("使用修正表读数")
                    }
                }else if(key=="meterUserState"){
                    if(val == '01'){
                        $("span[name='"+key+"']").html("正常")
                    }else if(val == '02'){
                        $("span[name='"+key+"']").html("暂停用气")
                    }else if(val == '03'){
                        $("span[name='"+key+"']").html("拆除状态")
                    }else if(val == '00'){
                        $("span[name='"+key+"']").html("新用户")
                    }else if(val == '99'){
                        $("span[name='"+key+"']").html("删除")
                    }
                }else{
                    $("span[name='"+key+"']").html(val)
                }

            })
        }


        // $("span[name='coefficientMin']").html(coefficient[0].coefficientMin);
        // $("span[name='coefficientMax']").html(coefficient[0].coefficientMax);

    }
})


$("#navtab li").on('click',function(){
    console.log($(this).find('a').text())
    if($(this).find('a').text() == "合同档案 "){
        //console.log(0)
        var queryCondion = RQLBuilder.and([
            RQLBuilder.equal("ctmArchiveId",archiveId),
            RQLBuilder.equal("status","2"),
        ]).rql()
        $.ajax({
            url:hzq_rest + 'gasctmcontractmeter/?query='+queryCondion,
            type:"GET",
            dateType:"json",
            success:function(data){
                console.log(data)
                $.each(data,function(index,item){
                    if(item['ctmArchiveId'] == archiveId && item['contractId']){
                        $("#addcontract").attr("disabled","disabled")
                        $.ajax({
                            url:hzq_rest + "gasctmcontract/"+item.contractId,
                            type:"GET",
                            dateType:"json",
                            success:function(e){
                                // console.log(e)
                                $('#tab_1_2 span').each(function (index,val) {
                                    span = val;
                                    $.each(e,function(key,val){
                                        if(key == "signupTime" && $(span).attr('name') == key){
                                            var data= val.split("T");
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
                                        }else if(key == "gasType" && $(span).attr('name') == key){
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
                                        }else if(key == "agreement" && $(span).attr('name') == key){
                                           if(val == '1'){
                                               $(span).html("有")
                                           }else if(val == '2'){
                                               $(span).html("无")
                                           }
                                        }else if($(span).attr('name') == key){
                                            $(span).html(val)
                                        }

                                    })
                                })
                            }
                        })
                    }
                })
            }
        })

    }


    if($(this).find('a').text() == "表具档案 "){
        //console.log(0)
        console.log(archiveId);
        var ctmmeter = Restful.findNQ(hzq_rest + 'gasctmmeter/?query={"ctmArchiveId":"'+archiveId+'"}');
        console.log(ctmmeter)
        if(ctmmeter.length) {
            var meter = Restful.getByID(hzq_rest + 'gasmtrmeter', ctmmeter[0].meterId);
            console.log(meter);
            if (JSON.stringify(meter) == "{}") {
                return;
            }
            $('#tab_1_3 span').each(function (index, val) {
                span = val;
                $.each(meter, function (key, val) {
                    if (key == "factoryId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrfactory",
                            ref_col: "factoryId",
                            ref_display: "factoryName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "reskindId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrreskind",
                            ref_col: "reskindId",
                            ref_display: "reskindName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "meterModelId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrmeterspec",
                            ref_col: "meterModelId",
                            ref_display: "meterModelName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "meterTypeId" && $(span).attr('name') == key) {
                        console.log(val)
                        var GastypeHelper = RefHelper.create({
                            ref_url: "gasmtrmetertype",
                            ref_col: "meterTypeId",
                            ref_display: "meterTypeName",
                        });
                        $(span).html(GastypeHelper.getDisplay(val));

                    } else if (key == "direction" && $(span).attr('name') == key) {
                        if (val == 'L') {
                            $(span).html("左");
                        } else if (val == 'R') {
                            $(span).html("右");
                        }
                    } else if (key == "meterStatus" && $(span).attr('name') == key) {
                        if (val == 1) {
                            $(span).html("正常");
                        } else if (val == 0) {
                            $(span).html("异常");
                        } else if (val == 2) {
                            $(span).html("表慢");
                        } else if (val == 3) {
                            $(span).html("表快");
                        } else if (val == 4) {
                            $(span).html("死表");
                        }
                    } else if (key == "powerType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.powerTypeFormat(val))
                    } else if (key == "valveInfo" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.valveInfoFormat(val))
                    } else if (key == "baseMeterVender" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.baseMeterVenderFormat(val))
                    } else if (key == "meterMaterial" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.meterMaterialFormat(val))
                    } else if (key == "controlType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.controlTypeFormat(val))
                    } else if (key == "displayType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.displayTypeFormat(val))
                    } else if (key == "chipType" && $(span).attr('name') == key) {
                        $(span).html(GasModCtms.chipTypeFormat(val))
                    } else if (key == "productionDate" && $(span).attr('name') == key) {
                        if (val) {
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
                        }
                    } else {
                        if ($(span).attr('name') == key) {
                            $(span).html(val)
                        }
                    }
                })
            })
            var queryCondion = RQLBuilder.and([
                RQLBuilder.equal("factoryId", meter.factoryId),
                RQLBuilder.equal("meterModelId", meter.meterModelId)
            ]).rql()
            var result = Restful.findNQ(hzq_rest + 'gasmtrmeterfactoryspec/?query=' + queryCondion);
            console.log(result);
            if (result.length) {
                console.log(result)
                var results = Restful.findNQ(hzq_rest + 'gasmtrmeterflow/' + result[0].meterFlowId);
                console.log(results);
                $("span[name='flow']").html(results.ratingFlux)
                $("span[name='flowRange']").html(results.flowName)
            }

        }

    }

    if($(this).find('a').text() == "资质照片 "){
        $("#grid").html("");
        $("#slideId").html("");
        console.log(archiveId)
        var result = Restful.findNQ(hzq_rest+'gasctmarchivefile/?query={"ctmArchiveId":"'+archiveId+'"}&sort=-createdTime')
        console.log(result)
        if(result.length>0){
            $.each(result,function(ind,item){
                $.ajax({
                    url: hzq_rest+"gasbasfile?fields={}&query={\"busiId\":\"" + item.fileId + "\"}",
                    method: "get",
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        if(data && data.length > 0){
                            for(var i=0; i<data.length;i++){
                                var datali = data[i];
                                    $("#grid").append("<li><figure><img src='/hzqs/sys/download.do?fileId="+datali.fileId+"&w=300' title='上传时间："+item.createdTime+"' alt='"+datali.fileName+"'/></figure></li>")
                                    $("#slideId").append("<li><figure><img src='/hzqs/sys/download.do?fileId="+datali.fileId+"' alt='"+datali.fileName+"'/></figure></li>")
                            }
                        }
                    },
                    error: function (data) {
                        bootbox.alert(data);
        
                    }
        
                });
            })
            setTimeout(function(){
                new CBPGridGallery(document.getElementById('grid-gallery'));
            },300)
        }
        
        
    }

})

var bd={
    "cols":" t1.*",
    "froms":"gas_ctm_contract t1",
    "wheres":"t1.customer_code is null  and t1.gas_kind = '9'",
    "page":false
};
$.ajax({
    url:"/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
    type:"POST",
    data:JSON.stringify(bd),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function(data){
        console.log(data)
        if(data.rows){
            $.each(data.rows,function(index,item){
                // console.log(item)
                $("#contract_name").append('<option value="' + item.contractId + '">' + item.useGasPerson + '</option>');
                // $('#contract_select').append('<option value="' + item.contractId + '">' + item.contractNo + '</option>');
            })
        }

    }
})

