
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
var registerPlan = function(){
    var datesFormat = function(){
        return {
            f:function(val){
                if(val){
                    return val.substr(0,10)
                }
            }
        }
    }()
    return {
        init:function(){
            this.reload();
        },
        reload:function(){
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
                    RQLBuilder.equal("areaId",areaId),
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
                    restbase: 'gascsrsecurityplan/?query='+queryCondion1,
                    key_column: 'spId',
                    coldefs: [
                        {
                            col: "spId",
                            friendly: "ID",
                            validate:"required",
                            hidden:true,
                            nonedit:"nosend",
                            unique: "true",
                            index: 1
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            validate:"required",
                            nonedit:"nosend",
                            format:areaFormat,
                            index: 2
                        },
                        {
                            col: "spName",
                            friendly: "名称",
                            validate:"required",
                            index: 2
                        },
                        {
                            col:"spNum",
                            friendly: "户数",
                            validate:"required onlyNumber",
                            index: 3
                        },
                        {
                            col:"spStime",
                            friendly: "开始时间",
                            inputsource:"monthpicker",
                            date_format:"yyyy-mm-dd",
                            format:datesFormat,
                            validate:"required",
                            index: 3
                        },
                        {
                            col:"spEtime",
                            friendly: "结束时间",
                            inputsource:"monthpicker",
                            date_format:"yyyy-mm-dd",
                            format:datesFormat,
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "spMark",
                            friendly: "备注",
                            sorting:false,
                            index: 5
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_deviceName,find_areaId;

                        if ($('#find_deviceName').val()) {
                            find_deviceName = RQLBuilder.like("spName",$.trim($('#find_deviceName').val()));
                        }
                        if ($('#find_areaId').val()) {
                            find_areaId = RQLBuilder.equal("areaId",$.trim($('#find_areaId').val()));
                        }else{
                            if(areaId != "1"){
                                find_areaId = RQLBuilder.equal("areaId",areaId);
                            }
                            
                        }

                        var filter = RQLBuilder.and([
                            find_deviceName,find_areaId
                        ]);
                        xw.setRestURL(hzq_rest + 'gascsrsecurityplan');
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        jsondata["areaId"]=areaId;
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        jsondata["modifiedTime"] = new Date(new Date()+"-00:00");
                        jsondata["modifiedBy"] = userId;
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){

                    },
                })
        }
    }
}()


$("#del_buttons").on("click",function(){
    var selrows = xw.getTable().getData(true);
    // console.log(selrows)
    if(selrows.rows.length == "0"){
        bootbox.alert("<center><h4><br>请选择至少一条记录。</h4></center>")
        return false;
    }

    bootbox.confirm({
        buttons: {
            confirm: {
                label: '确认',
                className: 'blue'
            },
            cancel: {
                label: '取消',
                className: 'btn-default'
            }
        },
        message: "<br><center><h4>确定删除选择（" + selrows.rows.length + "）条记录吗？</h4></center><br>",
        callback:function(result){
            if (!result) return;
            
            else{
                var ids=[];
                $.each(selrows.rows, function(index, row) {
                    ids.push(row.spId);
                });
                console.log("delete:"+JSON.stringify(ids));
                var ret=Restful.updateRNQ(hzq_rest+"gascsrsecurityplan", ids.join(),{"status":"3"});
                if(ret.success){
                    bootbox.alert("<center><h4>删除成功。</h4></center>",function(){
                        xw.update();
                    })
                }else{
                    bootbox.alert("<center><h4>删除失败。</h4></center>")
                }

            }
        }
    })
})