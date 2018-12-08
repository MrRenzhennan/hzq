
var xw;

var level1OfflineAction = function () {

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

    var depositoryFormat = function () {
        return {
            f : function (val) {
                return depositoryHelper.getDisplay(val);
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
                    restbase: 'gasmtrmeter/offline',
                    key_column:'meterId',
                    //---------------行定义
                    coldefs: [
                        {
                            col:"meterId",
                            friendly:"表编号",
                            sorting:false,
                            unique:true,
                            index:1
                        },
                        {
                            col:"metertypeId",
                            friendly:"表类型",
                            sorting:false,
                            format:metertypeIdFormat,
                            index:2
                        },
                        {
                            col:"meterspecId",
                            friendly:"规格型号",
                            sorting:false,
                            format:meterspecIdFormat,
                            index:3
                        },
                        {
                            col:"reskindId",
                            friendly:"物品种类",
                            sorting:false,
                            format:reskindIdFormat,
                            index:4
                        },
                        {
                            col:"depositoryId",
                            friendly:"仓库",
                            format:depositoryFormat,
                            index:5
                        },
                        {
                            col:"createtime",
                            friendly: "下线时间",
                            nonedit:"nosend",
                            sorting:false,
                            index:7
                        },
                        {
                            col:"remark",
                            friendly:"下线原因",
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"creator",
                            friendly:"操作人员",
                            nonedit:"nosend",
                            sorting:false,
                            index:9
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

                        var filter = RQLBuilder.and([
                            metertypeId,reskindId,meterspecId,depositoryId
                        ]);

                        // xw.setRestURL(hzq_rest + 'gasmtrmeter/offline');

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

$('#fix_button').click(function () {
   var meterId = xw.getTable().getData().rows[0].meterId;

   $.ajax({
       url:hzq_rest + 'gasmtrmeter/updateState',
       type:'POST',
       data:{
           "meterId":meterId,
           "meterstate":"06"
       },
       async:false
   })
       .done(function (data) {
           if(data.success){
                level1OfflineAction.reload();
               bootbox.alert('<br><center><h4>状态修改成功!!</h4></center><br>');
           }else{
               bootbox.alert('<br><center><h4>状态修改失败!!</h4></center><br>')
           }
       })
});
$('#trash_button').click(function () {
   var meterId = xw.getTable().getData().rows[0].meterId;

   $.ajax({
       url:hzq_rest + 'gasmtrmeter/updateState',
       type:'POST',
       data:{
           "meterId":meterId,
           "meterstate":"07"
       },
       async:false
   })
       .done(function (data) {
           if(data.success){
                level1OfflineAction.reload();
               bootbox.alert('<br><center><h4>状态修改成功!!</h4></center><br>');
           }else{
               bootbox.alert('<br><center><h4>状态修改失败!!</h4></center><br>')
           }
       })
});

$('#selectmeter').click(function () {
    document.location = "customer/dm/add_offline_meter.html";
});

