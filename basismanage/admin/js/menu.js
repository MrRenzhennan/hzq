var leafFlagEditBuilder=function(val){
    if(val == "0"){
        return "<select id='leafFlag' name='leafFlag' class='form-control select2me'><option value='0' selected>否</option><option value='1' >是</option></select>";
    }else if(val == "1"){
        return "<select id='leafFlag' name='leafFlag' class='form-control select2me'><option value='0' >否</option><option value='1' selected>是</option></select>";
    }else{
        return "<select id='leafFlag' name='leafFlag' class='form-control select2me'><option value='0' >否</option><option value='1' >是</option></select>";
    }

};
var MenuAction = function () {

    // 父菜单helper
    var MenuHelper = RefHelper.create({
        ref_url: "gassysmenu",
        ref_col: "menuId",
        ref_display: "menuName"
    });


    var MenuFormat = function () {
        return {
            f: function (val) {
                return MenuHelper.getDisplay(val);
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
                    restbase: 'gassysmenu/?sort=menuId',
                    key_column: 'menuId',
                    coldefs: [
                        {
                            col: "menuId",
                            friendly: "菜单ID",
                            validate:"required",
                            unique: "true",
                            index: 1
                        },
                        {
                            col: "menuName",
                            friendly: "菜单名称",
                            validate:"required",
                            sorting: false,
                            index: 2
                        },
                        {
                            col:"parentMenuId",
                            friendly: "父菜单",
                            format:MenuFormat,
                            inputsource: "select",
                            validate:"required",
                            ref_url:  "gassysmenu",
                            ref_name: "menuName",
                            ref_value: "menuId",
                            index: 3
                        },
                        {
                            col: "menuLevel",
                            friendly: "层级",
                            validate:"required",
                            index: 5
                        },
                        {
                            col: "menuDesc",
                            friendly: "菜单描述",
                            sorting:false,
                            index: 6
                        },
                        {
                            col: "menuSeq",
                            friendly: "菜单顺序",
                            validate:"required",
                            index: 7
                        },

                        {
                            col: "menuUrl",
                            friendly: "菜单地址",
                            validate:"required",
                            sorting:false,
                            index: 8
                        },
                        {
                            col: "icon",
                            friendly: "菜单图标",
                            sorting:false,
                            index: 9
                        },
                        {
                            col: "leafFlag",
                            friendly: "是否叶子节点",
                            validate:"required",
                            // inputsource:"select
                            format:GasSysBasic.IsOrNoFormat,
                            inputsource: "custom",
                            inputbuilder: "leafFlagEditBuilder",
                            sorting:false,
                            index: 10
                        }


                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_menuName;

                        if ($('#find_menuName').val()) {
                            find_menuName = RQLBuilder.like("menuName",$.trim($('#find_menuName').val()));
                        }

                        var filter = RQLBuilder.and([
                            find_menuName
                        ]);
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
