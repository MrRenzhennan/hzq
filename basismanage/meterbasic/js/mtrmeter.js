ComponentsPickers.init();
var xw;


// var  meterexceptionType = {"01":"压力","02":"温度","03":"电池异常","04":"智能封","05":"注油"};
// var  meterKind = {"01":"普表","02":"IC卡气量表","03":"IC卡金额表","04":"代码表","05":"远传表"};
//{"1":"正常","0":"异常"}
var meterstausebuilder = function(val){
    if(val == 1){
        return "<select id='meterStatus' name='meterStatus' class='form-control select2me'>" +
                "<option value='1' selected>正常</option>" +
                "<option value='0' >异常</option>"+
             "</select>" ;
    }else if(val == 0){
        return "<select id='meterStatus' name='meterStatus' class='form-control select2me'>" +
            "<option value='1' >正常</option>" +
            "<option value='0' selected>异常</option>"+
            "</select>" ;
    }else{
        return "<select id='meterStatus' name='meterStatus' class='form-control select2me'>" +
            "<option value='1' >正常</option>" +
            "<option value='0' >异常</option>"+
            "</select>" ;
    }
}

var meterKindbuilder=function(val){
    if(val=="01"){
        return "<select id='meterKind' name='meterKind' class='form-control select2me'>" +
            "<option value='01' selected>普表</option>" +
            "<option value='02' >IC卡气量表</option>"+
            "<option value='03' >IC卡金额表</option>" +
            "<option value='04' >代码表</option>" +
            "<option value='05' >远传表</option></select>" ;
    }else if(val=="02"){
        return "<select id='meterKind' name='meterKind' class='form-control select2me'>" +
            "<option value='01' >普表</option>" +
            "<option value='02' selected >IC卡气量表</option>"+
            "<option value='03' >IC卡金额表</option>" +
            "<option value='04' >代码表</option>" +
            "<option value='05' >远传表</option></select>" ;
    }else if(val=="03"){
        return "<select id='meterKind' name='meterKind' class='form-control select2me'>" +
            "<option value='01' >普表</option>" +
            "<option value='02' >IC卡气量表</option>"+
            "<option value='03' selected>IC卡金额表</option>" +
            "<option value='04' >代码表</option>" +
            "<option value='05' >远传表</option></select>" ;
    }else if(val=="04"){
        return "<select id='meterKind' name='meterKind' class='form-control select2me'>" +
            "<option value='01' >普表</option>" +
            "<option value='02' >IC卡气量表</option>"+
            "<option value='03' >IC卡金额表</option>" +
            "<option value='04' selected>代码表</option>" +
            "<option value='05' >远传表</option></select>" ;
    }else if(val=="05"){
        return "<select id='meterKind' name='meterKind' class='form-control select2me'>" +
            "<option value='01' >普表</option>" +
            "<option value='02' >IC卡气量表</option>"+
            "<option value='03' >IC卡金额表</option>" +
            "<option value='04' >代码表</option>" +
            "<option value='05' selected>远传表</option></select>" ;
    }else{
        return "<select id='meterKind' name='meterKind' class='form-control select2me'>" +
            "<option value='01' >普表</option>" +
            "<option value='02' >IC卡气量表</option>"+
            "<option value='03' >IC卡金额表</option>" +
            "<option value='04' >代码表</option>" +
            "<option value='05' >远传表</option></select>" ;
    }
};
var exceptionTypebuilder=function(val){
    if(val=="01"){
        return "<select id='exceptionType' name='exceptionType' class='form-control select2me'>" +
            "<option value='01' selected>压力</option>" +
            "<option value='02' >温度</option>"+
            "<option value='03' >电池异常</option>" +
            "<option value='04' >智能封</option>" +
            "<option value='05' >注油</option></select>" ;
    }else if(val=="02"){
        return "<select id='exceptionType' name='exceptionType' class='form-control select2me'>" +
            "<option value='01' >压力</option>" +
            "<option value='02' selected>温度</option>"+
            "<option value='03' >电池异常</option>"+
            "<option value='04' >智能封</option>"+
             "<option value='05' >注油</option></select>" ;
    }else if(val=="03"){
        return "<select id='exceptionType' name='exceptionType' class='form-control select2me'>" +
            "<option value='01' >压力</option>" +
            "<option value='02' >温度</option>"+
            "<option value='03' selected>电池异常</option>" +
            "<option value='04' >智能封</option>" +
            "<option value='05' >注油</option></select>" ;
    }else if(val=="04"){
        return "<select id='exceptionType' name='exceptionType' class='form-control select2me'>" +
            "<option value='01' >压力</option>" +
            "<option value='02' >温度</option>"+
            "<option value='03' >电池异常</option>" +
            "<option value='04'selected >智能封</option>" +
            "<option value='05' >注油</option></select>" ;
    }else if(val=="05"){
        return "<select id='exceptionType' name='exceptionType' class='form-control select2me'>" +
            "<option value='01' >压力</option>" +
            "<option value='02' >温度</option>"+
            "<option value='03' >电池异常</option>" +
            "<option value='04' >智能封</option>" +
            "<option value='05' selected>注油</option></select>" ;
    }else{
        return "<select id='exceptionType' name='exceptionType' class='form-control select2me'>" +
            "<option value='01' >压力</option>" +
            "<option value='02' >温度</option>"+
            "<option value='03' >电池异常</option>" +
            "<option value='04' >智能封</option>" +
            "<option value='05' >注油</option></select>" ;
    }
};
var meterAction = function () {

    //helper
    //表具类型
    var metertypeIdHelper = RefHelper.create({
        ref_url:'gasmtrmetertype',
        ref_col:'meterTypeId',
        ref_display:'meterTypeName'
    });
    //物品种类
    var reskindIdHelper = RefHelper.create({
        ref_url:'gasmtrreskind',
        ref_col:'reskindId',
        ref_display:'reskindName'
    });

    var meterspecIdHelper = RefHelper.create({
        ref_url:'gasmtrmeterspec',
        ref_col:'meterModelId',
        ref_display:'meterModelName'
    });
    console.log(meterspecIdHelper);
    var depositoryHelper = RefHelper.create({
        ref_url:'gasmtrdepository',
        ref_col:'depositoryId',
        ref_display:'depositoryname'
    });

    var factoryHelper = RefHelper.create({
        ref_url:'gasmtrfactory',
        ref_col:'factoryId',
        ref_display:'factoryName'
    });

    //format
    //表具类型
    var metertypeIdFormat = function () {
        return {
            f : function (val) {
                return metertypeIdHelper.getDisplay(val);
            }
        }
    }();

    var reskindIdFormat = function () {
        return {
            f : function (val) {
                return reskindIdHelper.getDisplay(val);
            }
        }
    }();

    var meterspecIdFormat = function () {
        return {
            f : function (val) {
                return meterspecIdHelper.getDisplay(val);
            }
        }
    }();

    var factoryFormat = function () {
        return {
            f : function (val) {
                return factoryHelper.getDisplay(val);
            }
        }
    }();

    return {

        init : function () {
            this.initHelper();
            this.reload();
        },

        initHelper : function () {

            $.map(metertypeIdHelper.getData(),function (value, key) {
                console.log(value+key)
                $('#find_metertypeId').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(reskindIdHelper.getData(),function (value, key) {
                $('#find_reskindId').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(meterspecIdHelper.getData(),function (value, key) {
                $('#find_meterspecId').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(depositoryHelper.getData(),function (value, key) {
                $('#find_depo').append('<option value="' + key + '">' + value + '</option>');
            });


        },

        reload:function () {
            $('#divtable').html('');

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrmeter',
                    key_column:'meterId',
                    coldefs:[
                        {
                            col:"meterId",
                            friendly:"表ID",
                            hidden:true,
                            nonedit:"nosend",
                            sorting:false,
                            unique:"true",
                            index:1
                        },
                        {
                            col:"meterNo",
                            friendly:"表编号",
                            validate:"required",
                            sorting:false,
                            unique:"true",
                            index:1
                        },
                        {
                            col:"meterTypeId",
                            friendly:"表具类型",
                            validate:"required",
                            inputsource: "select",
                            format:metertypeIdFormat,
                            ref_url:  "gasmtrmetertype",
                            ref_name: "meterTypeName",
                            ref_value: "meterTypeId",
                            sorting:false,
                            index:2
                        },
                        {
                            col:"reskindId",
                            friendly:"物品种类",
                            validate:"required",
                            inputsource: "select",
                            format:reskindIdFormat,
                            ref_url:  "gasmtrreskind",
                            ref_name: "reskindName",
                            ref_value: "reskindId",
                            sorting:false,
                            index:3
                        },
                        {
                            col:"meterModelId",
                            friendly:"表具规格型号",
                            validate:"required",
                            inputsource: "select",
                            format:meterspecIdFormat,
                            ref_url:  "gasmtrmeterspec",
                            ref_name: "meterModelName",
                            ref_value: "meterModelId",
                            sorting:false,
                            index:4
                        },
                        {
                            col:"factoryId",
                            friendly:"厂家",
                            validate:"required",
                            inputsource: "select",
                            format:factoryFormat,
                            ref_url:  "gasmtrfactory",
                            ref_name: "factoryName",
                            ref_value: "factoryId",
                            sorting:false,
                            index:5
                        },
                        {
                            col:"productionDate",
                            friendly:"生产日期",
                            format:dateFormat,
                            nonedit:"nosend",
                            sorting:false,
                            index:6
                        },
                        {
                            col:"meterStatus",
                            friendly:"表具状态",
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder:"meterstausebuilder",
                            format:GasSysBasic.meterStausFormat,
                            sorting:false,
                            index:17
                        },
                        {
                            col:"barCode",
                            friendly:"表具条码",
                            validate:"required",
                            sorting:false,
                            index:8
                        },
                        {
                            col:"flow",
                            friendly:"额定流量",//额定流量关联流量表
                            sorting:false,
                            index:9
                        },
                        {
                            col:"meterDigit",
                            friendly:"表位数",
                            validate:"required",
                            sorting:false,
                            index:10
                        },
                        {
                            col:"reading",
                            friendly:"表读数",
                            validate:"required",
                            sorting:false,
                            index:11
                        },
                        {
                            col:"exceptionType",
                            friendly:"表具异常种类",
                            sorting:false,
                            format:GasSysBasic.meterexceptionTypeFormat,
                            inputsource: "custom",
                            inputbuilder:"exceptionTypebuilder",
                            index:12
                        },
                        {
                            col:"meterKind",
                            friendly:"表具种类",
                            sorting:false,
                            inputsource: "custom",
                            inputbuilder:"meterKindbuilder",
                            format:GasSysBasic.meterKindFormat,
                            index:13
                        },

                        {
                            col:"direction",
                            friendly:"进气方向",
                            sorting:false,
                            format:GasSysBasic.directionFormat,
                            index:14
                        },
                        {
                            col:"onlineDate",
                            friendly:"第一次上线时间",
                            inputsource:"monthpicker",
                            date_format:"yyyy-mm-dd",
                            format:dateFormat,
                            sorting:false,
                            index:15
                        },
                        /*{
                            col:"status",
                            friendly:"状态",
                            sorting:false,
                            format:GasSysBasic.StatusFormat,
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index:16
                        },*/
                        {
                            col:"meterRemark",
                            sorting:false,
                            friendly:"备注",
                            index:16

                        }

                    ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function

                       /* var tmpTime = new Date();
                        tmpTime.setFullYear(tmpTime.getFullYear() - 3);
                        var formatTime = GasModBil.date_format(tmpTime,'yyyy-MM-dd');*/
                       console.log($("#find_start_date").val());
                       console.log($("#find_end_date").val());
                       if($("#find_start_date").val()){
                           var find_start_date = RQLBuilder.condition("onlineDate","$gte","to_date('"+ $("#find_start_date").val()+" 00:00:00','yyyy-MM-dd HH24:mi:ss')");
                       }
                       if($("#find_end_date").val()){
                           var find_end_date = RQLBuilder.condition("onlineDate","$lte","to_date('"+ $("#find_end_date").val()+" 23:59:59','yyyy-MM-dd HH24:mi:ss')");
                       }
                        var metertypeId = undefined;
                        if($('#find_metertypeId option:selected').val()){
                            metertypeId = RQLBuilder.equal('meterTypeId',$('#find_metertypeId option:selected').val());
                        }
                        //console.log($('#find_metertypeid option:selected').val());
                        var reskindId = undefined;
                        if($('#find_reskindId option:selected').val()){
                            reskindId = RQLBuilder.equal('reskindId',$('#find_reskindId option:selected').val());
                        }

                        var meterspecId = undefined;
                        if($('#find_meterspecId option:selected').val()){
                            meterspecId = RQLBuilder.equal('meterModelId',$('#find_meterspecId option:selected').val());
                        }

                        var metercode;
                        if($("#metercode").val()){
                            metercode = RQLBuilder.equal("meterNo",$("#metercode").val());
                        }

                        var filter = RQLBuilder.and([
                            metertypeId,reskindId,meterspecId,metercode,find_start_date,find_end_date/*,depositoryId,backup,datefrom,dateend*/
                        ]);

                        xw.setRestURL(hzq_rest + 'gasmtrmeter');

                        return filter.rql();
                    },//--findFilter

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){
                    }
                }
            )
        }
    }
}();

