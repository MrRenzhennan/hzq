ComponentsPickers.init();

SideBar.init();
SideBar.activeCurByPage("meter_exchange_plan_Management.html");

var xw;
var href = document.location.href;//http://localhost/customer/dm/meter_exchange_plan_detail.html?planId=ff8080815b1d54a8015b1d54a8d70001&areaId=2
var planId = href.split('?')[1].split('&')[0].split('=')[1];
var areaId = href.split('?')[1].split('&')[1].split('=')[1];

$('#add_meter').click(function () {
    console.log(xw.getTable().getData(true).rows);
    var selrows = xw.getTable().getData(true).rows;
    var length = selrows.length;

    if(length > 0){
        var meterids = "";
        var areaids = "";
        var bookids = "";
        var address = "";
        for(var i = 0; i < length; i++){
            meterids += selrows[i].meterId + ",";
            areaids += selrows[i].areaId + ",";
            bookids += selrows[i].bookid + ",";
            address += selrows[i].address + ",";
        }
        meterids = meterids.substr(0, meterids.length-1);
        areaids = areaids.substr(0, areaids.length-1);
        bookids = bookids.substr(0, bookids.length-1);
        address = address.substr(0, address.length-1);

        console.log("the meterids is : " + meterids);
        $.ajax({
            url:hzq_rest + 'gasmtrplandetail',
            // dataType:'json',
            type:"POST",
            data : {
                "meterids" : meterids,
                "planId": planId,
                "areaids":areaids,
                "bookids":bookids,
                "address":address
            },
        })
            .done(function (data) {
                if(data.success){
                    bootbox.alert('<br><center><h4>添加成功!!</h4></center><br>');
                    addMeterExchangePlanAction.reload();
                }else{
                    bootbox.alert('<br><center><h4>添加失败!!</h4></center><br>');
                }
            })
    }

});

var addMeterExchangePlanAction = function () {

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
                    restbase: 'gasmtrplandetail/0202/'+areaId,
                    key_column:'meterId',
                    coldefs:[
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            sorting:false,
                            index:1
                        },
                        {
                            col:"bookid",
                            friendly:"抄表本",
                            sorting:false,
                            index:2
                        },
                        {
                            col:"meterId",
                            friendly:"表编号",
                            sorting:false,
                            unique:"true",
                            index:3
                        },
                        {
                            col:"metertypeId",
                            friendly:"表具类型",
                            format:metertypeIdFormat,
                            sorting:false,
                            index:4
                        },
                        {
                            col:"reskindId",
                            friendly:"物品种类",
                            format:reskindIdFormat,
                            sorting:false,
                            index:5
                        },
                        {
                            col:"meterspecId",
                            friendly:"规格型号",
                            format:meterspecIdFormat,
                            sorting:false,
                            index:6
                        },
                        {
                            col:"factory",
                            friendly:"厂家",
                            format:factoryFormat,
                            sorting:false,
                            index:7
                        },
                        {
                            col:"leavefactorydate",
                            friendly:"出厂日期",
                            index:8
                        },
                        {
                            col:"meterflowId",
                            friendly:"额定流量",//额定流量关联流量表
                            format:meterflowFormat,
                            sorting:false,
                            index:9
                        },
                        {
                            col:"meterdigit",
                            friendly:"表位数",
                            sorting:false,
                            index:10
                        },
                        {
                            col:"meterreading",
                            friendly:"燃气表读数",
                            sorting:false,
                            index:11
                        },
                        {
                            col:"address",
                            friendly:"地址",
                            sorting:false,
                            index:12
                        },
                        {
                            col:"floworder",
                            friendly:"进气方向",
                            sorting:false,
                            format:floworderFormat,
                            index:13
                        },
                        {
                            col:"createtime",
                            friendly:"创建时间",
                            index:14
                        },
                        {
                            col:"firstusedate",
                            friendly:"第一次上线时间",
                            index:15
                        },
                        {
                            col:"checkdate",
                            friendly:"检表日期",
                            index:16
                        },
                        {
                            col:"runstate",
                            friendly:"运行状态",
                            format:meterRunningStateFormat,
                            sorting:false,
                            index:17
                        },
                        {
                            col:"meterstate",
                            friendly:"表具状态",
                            sorting:false,
                            format:meterstateFormat,
                            index:18
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

