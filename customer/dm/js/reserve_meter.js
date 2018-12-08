
var xw;

var Reserve_meterAction = function () {

    //helper

    var metertypeIdHelper = RefHelper.create({
        ref_url:'gasmtrmetertype',
        ref_col:'metertypeId',
        ref_display:'metertypename'
    });

    var reskindIdHelper = RefHelper.create({
        ref_url:'gasmtrreskind',
        ref_col:'reskindId',
        ref_display:'reskindname'
    });

    var meterspecIdHelper = RefHelper.create({
        ref_url:'gasmtrmeterspec',
        ref_col:'meterspecId',
        ref_display:'name'
    });

    var factoryHelper = RefHelper.create({
        ref_url:'gasmtrfactory',
        ref_col:'factoryId',
        ref_display:'name'
    });

    //format

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
                $('#find_metertypeId').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(reskindIdHelper.getData(),function (value, key) {
                $('#find_reskindId').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(meterspecIdHelper.getData(),function (value, key) {
                $('#find_meterspecId').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(factoryHelper.getData(),function (value, key) {
                $('#find_factory').append('<option value="' + key + '">' + value + '</option>');
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
                    restbase: 'gasmtrmeter?query={"backup":"1"}',
                    key_column:'meterId',
                    coldefs:[
                        {
                            col:"meterId",
                            friendly:"表编号",
                            unique:"true",
                            sorting:false,
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"metertypeId",
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
                            col:"meterspecId",
                            friendly:"表具规格型号",
                            format:meterspecIdFormat,
                            sorting:false,
                            index:4
                        },
                        {
                            col:"factory",
                            friendly:"生产厂家",
                            format:factoryFormat,
                            sorting:false,
                            index:5
                        },
                        {
                            col:"reviseflag",
                            friendly:"修正表标记",
                            format:isAndNotReverse,
                            sorting:false,
                            index:6
                        },
                        {
                            col:"revisemeterstate",
                            friendly:"修正表状态",
                            format:meterstateFormat,
                            sorting:false,
                            index:7
                        },
                        {
                            col:"isonline",
                            friendly:"是否在线",
                            sorting:false,
                            format:isAndNotReverse,
                            index:8
                        },
                        {
                            col:"runstate",
                            friendly:"运行状态",
                            format:meterRunningStateFormat,
                            sorting:false,
                            index:10
                        },
                        {
                            col:"meterstate",
                            friendly:"流转状态",
                            format:meterstateFormat,
                            sorting:false,
                            index:11
                        }
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

                        var factory = undefined;
                        if($('#find_factory').val()){
                            factory = RQLBuilder.equal('factory',$('#find_factory').val());
                        }

                        var backup = RQLBuilder.equal('backup','1');

                        var filter = RQLBuilder.and([
                            metertypeId,reskindId,meterspecId,factory,backup
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

