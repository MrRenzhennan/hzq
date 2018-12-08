
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;


GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            console.log(val)
            $('#find_areaId').append('<option value="' + val.areaId+ '" name="' +val.areaId + '">' + val.areaName + '</option>');
        })
    }
});

// 工作人员
var userHelper=RefHelper.create({
    ref_url:'gassysuser?query={"status":"1"}',
    ref_col:"userId",
    ref_display:"employeeName"
});
var userFormat=function(){
    return {
        f: function(val){
            return userHelper.getDisplay(val);
        }
    }
}();
// 供气区域
var areaHelper=RefHelper.create({
    ref_url:'gasbizarea?query={"status":"1"}',
    ref_col:"areaId",
    ref_display:"areaName"
});
var areaFormat=function(){
    return {
        f: function(val){
            return areaHelper.getDisplay(val);
        }
    }
}();
var xw;
var deviceAction = function () {
   
    return {

        init: function () {
            this.initHelper();
            this.reload();
            // $.each(GasModSys.areaHelper.getRawData(), function (idx, row) {
            //     $('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
            // });
        },

        initHelper: function () {

        },

        reload: function () {

            $('#divtable').html('');


            var queryCondion;
            var queryCondion1;
            // = RQLBuilder.and([
            //     RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea)),
            //     RQLBuilder.equal("status","1"),
            //     RQLBuilder.equal("status","1"),
            // ]).rql()

            if(areaId == "1"){
                queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("status","1"),
                ]).rql()
                queryCondion1 = RQLBuilder.and([
                    RQLBuilder.equal("status","1"),
                ]).rql()
    
            }else{
                queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("areaId",areaId),
                    RQLBuilder.equal("status","1")
                ]).rql()
                queryCondion1 = RQLBuilder.and([
                    RQLBuilder.equal("reservedField1",areaId),
                    RQLBuilder.equal("status","1")
                ]).rql()
            }

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasbizshitpress/?query='+queryCondion1,
                    key_column: 'pressId',
                    coldefs: [
                        {
                            col: "pressId",
                            friendly: "设备ID",
                            validate:"required",
                            hidden:true,
                            nonedit:"nosend",
                            unique: "true",
                            index: 1
                        },
                        {
                            col: "reservedField1",
                            friendly: "供气区域",
                            validate:"required",
                            nonedit:"nosend",
                            format:areaFormat,
                            index: 2
                        },
                        {
                            col: "pressCode",
                            friendly: "设备编号",
                            validate:"required",
                            index: 2
                        },
                        {
                            col:"pressName",
                            friendly: "设备名称",
                            validate:"required",
                            index: 3
                        },
                       
                        {
                            col: "pressAddress",
                            friendly: "设备地址",
                            validate:"required",
                            sorting:false,
                            index: 5

                        },
                        {
                            col: "pressKeeper",
                            friendly: "管理人",
                            validate:"required",
                            inputsource:"select",
                            format:userFormat,
                            ref_url:'gassysuser?query='+queryCondion,
                            ref_name:"employeeName",
                            ref_value:"userId",
                            sorting:false,
                            index: 6

                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            format:dateFormat,
                            nonedit:"nosend",
                            sorting:false,
                            index: 7
                        }


                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_deviceName,find_areaId;

                        if ($('#find_deviceName').val()) {
                            find_deviceName = RQLBuilder.like("pressName",$.trim($('#find_deviceName').val()));
                        }
                        if ($('#find_areaId').val()) {
                            find_areaId = RQLBuilder.equal("reservedField1",$.trim($('#find_areaId').val()));
                        }else{
                            if(areaId != "1"){
                                find_areaId = RQLBuilder.equal("reservedField1",areaId);
                            }
                            
                        }

                        var filter = RQLBuilder.and([
                            find_deviceName,find_areaId
                        ]);
                        xw.setRestURL(hzq_rest + 'gasbizshitpress');
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        jsondata["reservedField1"]=areaId;
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        jsondata["modifiedTime"] = new Date(new Date()+"-00:00");
                        jsondata["modifiedBy"] = userId;
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){

                    },
                }) //--init
        },

    }
}();

$(document).on("blur","#pressCode",function(){
    var result =Restful.findNQ(hzq_rest+'gasbizshitpress/?query={"pressCode":"'+$(this).val()+'"}');
    if(result.length >0){
        bootbox.alert("<center><h4>该设备编号已经存在。</h4></center>");
        $(".modal-footer .green").attr("disabled",true)
        return false;
    }else{
        $(".modal-footer .green").attr("disabled",false)
    }

})
