ComponentsPickers.init();
var xw;

SideBar.init();
SideBar.activeCurByPage("level1_offLine_meterManagement.html");

var addOfflineMeterAction = function () {

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
                    restbase: 'gasmtrmeter?query={"backup":"0"}',
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
                            friendly:"规格型号",
                            format:meterspecIdFormat,
                            sorting:false,
                            index:4
                        },
                        {
                            col:"factory",
                            friendly:"厂家",
                            format:factoryFormat,
                            sorting:false,
                            index:5
                        },
                        {
                            col:"leavefactorydate",
                            friendly:"出厂日期",
                            index:6
                        },
                        {
                            col:"meterflowId",
                            friendly:"额定流量",//额定流量关联流量表
                            format:meterflowFormat,
                            sorting:false,
                            index:8
                        },
                        {
                            col:"meterdigit",
                            friendly:"表位数",
                            sorting:false,
                            index:9
                        },
                        {
                            col:"depositoryId",
                            friendly:"仓库",
                            sorting:false,
                            index:10
                        },
                        {
                            col:"floworder",
                            friendly:"进气方向",
                            sorting:false,
                            format:floworderFormat,
                            index:11
                        },
                        {
                            col:"createtime",
                            friendly:"创建时间",
                            index:12
                        },
                        {
                            col:"meterreading",
                            friendly:"燃气表读数",
                            sorting:false,
                            index:13
                        },
                        {
                            col:"firstusedate",
                            friendly:"第一次上线时间",
                            index:15
                        },
                        {
                            col:"runstate",
                            friendly:"运行状态",
                            format:meterRunningStateFormat,
                            sorting:false,
                            index:16
                        },
                        {
                            col:"meterstate",
                            friendly:"表具状态",
                            sorting:false,
                            format:meterstateFormat,
                            index:17
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

$('#insert2offline').click(function () {
    var rowLength = xw.getTable().getData().rows.length;
    var meterIds = "";
    for(var i = 0; i < rowLength; i ++){
        meterIds += xw.getTable().getData().rows[i].meterId + ",";
    }
    meterIds = meterIds.substr(0, meterIds.length - 1);
    var diag = bootbox.dialog({
        message:
            '<div class="row">' +
                '<div class="col-md-12">' +
                    '<textarea name="remark" style="width: 100%;min-height: 100px"></textarea>' +
                '</div> ' +
            '</div>',
        title:"下线原因",
        buttons:{
            success:{
                label:"保存",
                class:"btn btn-primary",
                callback:function () {
                    $.ajax({
                        url:hzq_rest + 'gasmtrmeter/insert2offline',
                        type:'POST',
                        data:{
                            "meterIds":meterIds,
                            "remark":$('textarea[name="remark"]').val()
                        },
                        async:false
                    })
                        .done(function (data) {
                            if(data.success){
                                level1OfflineAction.reload();
                                bootbox.alert('<br><center><h4>下线成功!!</h4></center><br>');
                            }else{
                                bootbox.alert('<br><center><h4>下线失败!!</h4></center><br>')
                            }
                        })

                }

            },
            danger:{
                label:"取消",
                class:"btn btn-default",
                callback:function () {}
            }
        }
    },{show:false});
        diag.show();

});
