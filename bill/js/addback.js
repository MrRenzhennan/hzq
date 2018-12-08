// var leafFlagEditBuilder=function(val){
//     if(val == "0"){
//         return "<select id='leafFlag' name='leafFlag' class='form-control select2me'><option value='0' selected>否</option><option value='1' >是</option></select>";
//     }else if(val == "1"){
//         return "<select id='leafFlag' name='leafFlag' class='form-control select2me'><option value='0' >否</option><option value='1' selected>是</option></select>";
//     }else{
//         return "<select id='leafFlag' name='leafFlag' class='form-control select2me'><option value='0' >否</option><option value='1' >是</option></select>";
//     }

// };

var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;



var backAction = function () {

    // 父菜单helper
    // var MenuHelper = RefHelper.create({
    //     ref_url: "gassysmenu",
    //     ref_col: "menuId",
    //     ref_display: "menuName"
    // });

    var pAreaHelper = RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });
    var pAreaFormat = function () {
        return {
            f : function (val) {
                return pAreaHelper.getDisplay(val);
            }
        }
    }();
    // var MenuFormat = function () {
    //     return {
    //         f: function (val) {
    //             return MenuHelper.getDisplay(val);
    //         }
    //     }
    // }();
    return {

        init: function () {
            this.initHelper();
            this.reload();
        },

        initHelper: function () {

        },

        reload: function () {

            $('#divtable').html('');
            var query = "";
            if(areaId == "1"){
                query="?sort=areaId"
            }else{
                query='?query={"areaId":"'+areaId+'"}&sort=areaId'
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
                    // GAS_BLL_BANK_CHECK_MGR
                    restbase: 'gasbllbankcheckmgr/'+query,
                    key_column: 'bankCheckMgrId',
                    coldefs: [
                        {
                            col: "bankCheckMgrId",
                            friendly: "id",
                            validate:"required",
                            unique: "true",
                            hidden:true,
                            nonedit:"nosend",
                            index: 1
                        },
                        {
                            col: "checkName",
                            friendly: "专户名称",
                            validate:"required",
                            unique: "true",
                            index: 1
                        },
                        {
                            col: "checkCode",
                            friendly: "客户编号",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format:pAreaFormat,
                            inputsource: "select",
                            ref_url:  'gasbizarea/?query={"status":"1"}',
                            ref_name: "areaName",
                            ref_value: "areaId",
                            readonly:"readonly",
                            validate:"required",
                            index: 3
                        }
                        // ,
                        // {
                        //     col:"parentMenuId",
                        //     friendly: "父菜单",
                        //     format:MenuFormat,
                        //     inputsource: "select",
                        //     validate:"required",
                        //     ref_url:  "gassysmenu",
                        //     ref_name: "menuName",
                        //     ref_value: "menuId",
                        //     index: 3
                        // },
                        // {
                        //     col: "menuLevel",
                        //     friendly: "层级",
                        //     validate:"required",
                        //     index: 5
                        // },
                        // {
                        //     col: "menuDesc",
                        //     friendly: "菜单描述",
                        //     sorting:false,
                        //     index: 6
                        // },
                        // {
                        //     col: "menuSeq",
                        //     friendly: "菜单顺序",
                        //     validate:"required",
                        //     index: 7
                        // },

                        // {
                        //     col: "menuUrl",
                        //     friendly: "菜单地址",
                        //     validate:"required",
                        //     sorting:false,
                        //     index: 8
                        // },
                        // {
                        //     col: "icon",
                        //     friendly: "菜单图标",
                        //     sorting:false,
                        //     index: 9
                        // },
                        // {
                        //     col: "leafFlag",
                        //     friendly: "是否叶子节点",
                        //     validate:"required",
                        //     // inputsource:"select
                        //     format:GasSysBasic.IsOrNoFormat,
                        //     inputsource: "custom",
                        //     inputbuilder: "leafFlagEditBuilder",
                        //     sorting:false,
                        //     index: 10
                        // }


                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_menuName,find_customercode;

                        if ($('#find_menuName').val()) {
                            find_menuName = RQLBuilder.like("checkName",$.trim($('#find_menuName').val()));
                        }
                        if ($('#find_customercode').val()) {
                            find_customercode = RQLBuilder.like("checkCode",$.trim($('#find_customercode').val()));
                        }

                        var filter = RQLBuilder.and([
                            find_menuName,find_customercode
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        console.log(jsondata)
                        jsondata["createdTime"] = new Date(new Date + '-00:00');
                        jsondata["modifiedTime"] = new Date(new Date + '-00:00');
                        jsondata["modifiedBy"] = userId;
                        jsondata["createdBy"] = userId;
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        jsondata["modifiedTime"] = new Date(new Date + '-00:00');
                        jsondata["modifiedBy"] = userId;
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){

                    },
                }) //--init
        },

    }
}();

var addstatus = false;
var modifystatus = false;

$("#add_button").on("click",function(){
    console.log("0000")
    modifystatus = false;
    addstatus = true;
   setTimeout(() => {
        $("#reservedField1").val(areaId).trigger("change")
        $("#reservedField1").attr('disabled','disabled')
    }, 100);
    
})

$("#upd_button").on("click",function(){
    modifystatus = true;
    addstatus = false;
})
$(document).on("blur","#checkCode",function(){
    
   
    if(addstatus){
        console.log($(this).val());
        var result = Restful.findNQ(hzq_rest+'gasbllbankcheckmgr/?query={"checkCode":"'+$(this).val()+'"}')
        console.log(result)
        if(result.length){
            bootbox.alert("<center><h4>该客户号已有专户。</h4></center>")
            $(".modal-footer .green").addClass("disabled")
            return false;
        }else{
            $(".modal-footer .green").removeClass("disabled")
        }
    }
    if(modifystatus){
        var selrows = xw.getTable().getData(true).rows[0];
        console.log(selrows);
        console.log($(this).val());
        var result = Restful.findNQ(hzq_rest+'gasbllbankcheckmgr/?query={"checkCode":"'+$(this).val()+'"}')
        console.log(result)
        if(result.length > 1 || (result.length == 1 && result[0].checkCode != selrows.checkCode)){
            bootbox.alert("<center><h4>该客户号已有专户。</h4></center>")
            $(".modal-footer .green").addClass("disabled")
            return false;
        }else{
            $(".modal-footer .green").removeClass("disabled")
        }
    }
    
})