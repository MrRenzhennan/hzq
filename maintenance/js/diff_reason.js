var xw ;
var TypeBuilder = function(val){
    if(val=="t"){
        return "<select id='cmType' name='cmType' class='form-control select2me'>" +
            "<option value='t' selected>同期</option>" +
            "<option value='h' >环比</option></select>" ;
    }else{
        return "<select id='cmType' name='cmType' class='form-control select2me'>" +
            "<option value='t' >同期</option>" +
            "<option value='h' selected>环比</option></select>" ;
    }
};
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $("select[name=unit]").append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
        })
    }
});
var diffAction = function () {

    // 供气区域helper
    var areaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName",
    });
    var areaHelperFormat=function () {
        return{
            f:function(val){
                return areaHelper.getDisplay(val)
            }
        }
    }();

    var typeEnum = {"t":"同期","h":"环比"};
    var typeFormat= function () {
        return {
            f: function (val) {
                return typeEnum[val];
            },
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
            var queryCondion = RQLBuilder.and([
                RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea)),
                RQLBuilder.equal("status","1"),
            ]).rql()
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
                    restbase: 'gasctmcomparemonth?query='+queryCondion,
                    key_column: 'cmId',
                    coldefs: [
                        {
                            col: "cmId",
                            friendly: "ID",
                            validate:"required",
                            hidden:true,
                            unique: "true",
                            nonedit:"nosend",
                            index: 1
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            validate:"required",
                            sorting: false,
                            index: 2
                        },
                        {
                            col:"customerName",
                            friendly: "客户名",
                            index: 3
                        },
                        {

                            col:"areaId",
                            friendly:"供气区域",
                            inputsource:"select",
                            ref_url:'gasbizarea?query={"status":"1"}',
                            ref_name:"areaName",
                            ref_value:"areaId",
                            validate:"required",
                            format:areaHelperFormat,
                            index:4

                        },
                        {
                            col: "reportYear",
                            friendly: "对比年",
                            validate:"required",
                            index: 5
                        },
                        {
                            col: "reportMonth",
                            friendly: "对比月",
                            sorting:false,
                            index: 6
                        },
                        {
                            col: "cmCause",
                            friendly: "差异原因",
                            validate:"required",
                            index: 7
                        },
                        {

                            col: "cmType",
                            friendly: "差异类型",
                            validate:"required",
                            // inputsource:"select
                            format:typeFormat,
                            inputsource: "custom",
                            inputbuilder: "TypeBuilder",
                            sorting:false,
                            index: 8
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            nonedit: "nosend",
                            readonly: "readonly",
                            default_value:UserInfo.userId(),
                            index:9
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            format:dateFormat,
                            inputsource:"datepicker",
                            default_value:new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
                            nonedit: "nosend",
                            validate:"required",
                            sorting: true,
                            index: 10
                        }


                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        // 查询过滤条件
                        var find_customerName,customerCode,find_unit;

                        if ($('#find_customerName').val()) {
                            find_customerName = RQLBuilder.like("customerName",$.trim($('#find_customerName').val()));
                        }
                        if ($('#customerCode').val()) {
                            customerCode = RQLBuilder.like("customerCode",$.trim($('#customerCode').val()));
                        }

                        if ($('#find_unit option:selected').val()) {
                            find_unit =RQLBuilder.equal("areaId",$.trim($('#find_unit option:selected').val()));
                        }else{
                            find_unit =RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        }
                        var filter=RQLBuilder.and([
                            find_customerName,customerCode,find_unit
                        ]);

                        xw.setRestURL(hzq_rest + 'gasctmcomparemonth');
                        return filter.rql();

                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){

                    },
                }) //--init
        },

    }
}();
