var deviceTypeBuilder=function(val){
    if(val == "1"){
        return "<select id='deviceType' name='deviceType' class='form-control select2me'><option value='1' selected>居民</option><option value='2' >非居民</option></select>";
    }else{
        return "<select id='deviceType' name='deviceType' class='form-control select2me'><option value='1' >居民</option><option value='2' selected>非居民</option></select>";
    }

};
// $('#saveId').click(function () {
//     var result = Restful.findNQ(hzq_rest + 'gasbizdevice/?query={"deviceCode":"'+ $('#deviceCode').val()+'"}')
//     if(result.length>0){
//         bootbox.alert("设备编号重复");
//         return false;
//     }
//
//
//     var param={
//         "deviceId":GasModService.getUuid(),
//         "deviceCode":$('#deviceCode').val(),
//         "deviceName":$('#deviceName').val(),
//         "gasMin":$('#gasMin').val(),
//         "gasMax":$('#gasMax').val(),
//         "deciceFlow":$('#deciceFlow').val(),
//         "deviceType":$('#deviceType option:selected').val(),
//         "status":"1",
//         "createdTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),//userinfo.userId,
//         "createdBy":userInfo.userId,
//         "modifiedTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),
//         "modifiedBy":userInfo.userId
//
//     }
//
//     var result = Restful.insert(hzq_rest + "gasbizdevice", param);
//     if(result['success']){
//         bootbox.alert("保存成功");
//         $("#cancelId").click();
//         window.location.reload();
//
//     }else{
//         bootbox.alert("保存失败");
//         $("#cancelId").click();
//         window.location.reload();
//     }
//
// });
var deviceAction = function () {
    var deviceTypeFormat = function () {
        return {
            f: function (data, row) {
                if (data == "1") {
                    return "居民";
                } else if (data == "2") {
                    return "非居民";
                } else {
                    return "";
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

        },

        reload: function () {

            $('#divtable').html('');

            this.xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasbizdevice',
                    key_column: 'deviceId',
                    coldefs: [
                        {
                            col: "deviceId",
                            friendly: "设备ID",
                            validate:"required",
                            nonedit:"nosend",
                            unique: "true",
                            index: 1
                        },
                        {
                            col: "deviceCode",
                            friendly: "设备编号",
                            validate:"required",
                            index: 2
                        },
                        {
                            col:"deviceName",
                            friendly: "设备名称",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "deviceType",
                            friendly: "设备类型",
                            validate:"required",
                            // inputsource:"select
                            format:deviceTypeFormat,
                            inputsource: "custom",
                            inputbuilder: "deviceTypeBuilder",
                            sorting:false,
                            index: 4

                        },
                        {
                            col: "deviceFlow",
                            friendly: "额定流量",
                            validate:"required",
                            sorting:false,
                            index: 5

                        },
                        {
                            col: "gasMin",
                            friendly: "最小用气量",
                            validate:"required",
                            sorting:false,
                            index: 6

                        },
                        {
                            col: "gasMax",
                            friendly: "最大用气量",
                            validate:"required",
                            sorting:false,
                            index: 7

                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            format:dateFormat,
                            nonedit:"nosend",
                            sorting:false,
                            index: 8
                        }


                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_deviceName;

                        if ($('#find_deviceName').val()) {
                            find_deviceName = RQLBuilder.like("deviceName",$.trim($('#find_deviceName').val()));
                        }

                        var filter = RQLBuilder.and([
                            find_deviceName
                        ]);
                        return filter.rql();
                    },

                    // onAdded: function(ret,jsondata){
                    //
                    //     return  validateForm(jsondata);
                    // },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){

                    },
                }) //--init
        },

    }
}()

