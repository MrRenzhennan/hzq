ComponentsPickers.init();
var xw;

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

    var meterflowHelper = RefHelper.create({
        ref_url:'gasmtrmeterflow',
        ref_col:'meterflowId',
        ref_display:'name'
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

    var meterflowFormat = function () {
        return {
            f : function (val) {
                return meterflowHelper.getDisplay(val);
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
                            friendly:"表编号",
                            sorting:false,
                            unique:"true",
                            index:1
                        },
                        {
                            col:"meterTypeId",
                            friendly:"表具类型",
                            format:metertypeIdFormat,
                            sorting:false,
                            index:2
                        },
                        {
                            col:"reskindId",
                            friendly:"物品种类",
                            format:reskindIdFormat,
                            sorting:false,
                            index:3
                        },
                        {
                            col:"meterModelId",
                            friendly:"表具规格型号",
                            format:meterspecIdFormat,
                            sorting:false,
                            index:4
                        },
                        {
                            col:"factoryId",
                            friendly:"厂家",
                            format:factoryFormat,
                            sorting:false,
                            index:5
                        },
                        {
                            col:"productionDate",
                            friendly:"出厂日期",
                            index:6
                        },
                        {
                            col:"meterStatus",
                            friendly:"表具状态",
                            format:GasSysBasic.meterStausFormat,
                            index:7
                        },
                        {
                            col:"barCode",
                            friendly:"表具条码",
                            index:8
                        },
                        {
                            col:"flow",
                            friendly:"额定流量",//额定流量关联流量表
                            //format:meterflowFormat,
                            sorting:false,
                            index:9
                        },
                        {
                            col:"meterDigit",
                            friendly:"表位数",
                            sorting:false,
                            index:10
                        },
                        {
                            col:"reading",
                            friendly:"表读数",
                            sorting:false,
                            index:11
                        },
                        {
                            col:"exceptionType",
                            friendly:"表具异常种类",
                            format:GasSysBasic.meterexceptionTypeFormat,
                            index:12
                        },
                        {
                            col:"meterKind",
                            friendly:"表具种类",
                            format:GasSysBasic.meterKindFormat,
                            index:13
                        },
                       /* {
                            col:"depositoryId",
                            friendly:"仓库",
                            sorting:false,
                            index:10
                        },*/
                        {
                            col:"direction",
                            friendly:"进气方向",
                            sorting:false,
                            //format:floworderFormat,
                            index:14
                        },
                       /* {
                            col:"createtime",
                            friendly:"创建时间",
                            index:12
                        },
                        {
                            col:"meterreading",
                            friendly:"燃气表读数",
                            sorting:false,
                            index:13
                        },*/
                        {
                            col:"onlineData",
                            friendly:"第一次上线时间",
                            index:15
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            format:GasSysBasic.InterfaceFormat,
                            index:16
                        },
                        {
                            col:"meterRemark",
                            friendly:"备注",
                            index:17

                        }
                        /*{
                            col:"runstate",
                            friendly:"运行状态",
                            format:meterRunningStateFormat,
                            sorting:false,
                            index:16
                        },*/
                        /*{
                            col:"meterstate",
                            friendly:"表具状态",
                            sorting:false,
                            format:meterstateFormat,
                            index:17
                        }*/
                    ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function
                        var metertypeId = undefined;
                        if($('#find_metertypeid').val()){
                            metertypeId = RQLBuilder.equal('metertypeId',$('#find_metertypeid').val());
                        }

                        var reskindId = undefined;
                        if($('#find_reskindId').val()){
                            reskindId = RQLBuilder.equal('reskindId',$('#find_reskindId').val());
                        }

                        var meterspecId = undefined;
                        if($('#find_meterspecId').val()){
                            metertypeId = RQLBuilder.equal('meterspecId',$('#find_meterspecId').val());
                        }

                        var depositoryId = undefined;
                        if($('#find_depo').val()){
                            depositoryId = RQLBuilder.equal('depositoryId',$('#find_depo').val());
                        }

                        var datefrom = undefined;
                        if($('input[name=from]').val()){
                            datefrom = RQLBuilder.condition_fc('createtime','$gte',$('input[name=from]').val());
                        }

                        var dateend = undefined;
                        if($('input[name=to]').val()){
                            dateend = RQLBuilder.condition_fc('createtime','$lte',$('input[name=to]').val());
                        }

                        var backup = RQLBuilder.equal('backup','0');

                        var filter = RQLBuilder.and([
                            metertypeId,reskindId,meterspecId,depositoryId,backup,datefrom,dateend
                        ]);

                        xw.setRestURL(hzq_rest + 'gasmtrmeter');

                        return filter.rql();
                    },//--findFilter

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }
            )
        }
    }
}();

