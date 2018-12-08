var roleTypes = function(val){
    if(val == 1){
        return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1' selected>菜单角色</option><option value='2'>流程角色</option><option value='3'>数据角色</option></select>";
    }else if(val == 2){
        return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1'>菜单角色</option><option value='2' selected>流程角色</option><option value='3'>数据角色</option></select>";

    }else if(val == 3){
        return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1'>菜单角色</option><option value='2' >流程角色</option><option value='3' selected>数据角色</option></select>";

    }else{
        return "<select id='roleType' name='roleType' class='form-control select2me'><option value='1'>菜单角色</option><option value='2'>流程角色</option><option value='3'>数据角色</option></select>";

    }
};

var roleAction = function () {
    return {
        init: function () {
            this.reload();
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
                    restbase: 'gassysrole/?sort=roleCode',
                    key_column: 'roleId',
                    coldefs: [
                        {
                            col: "roleId",
                            friendly: "角色ID",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "roleCode",
                            friendly: "角色编码",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "roleName",
                            friendly: "角色名称",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "roleType",
                            friendly: "角色类型",
                            format:GasSysBasic.roleTypeFormat,
                            inputsource: "custom",
                            inputbuilder: "roleTypes",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "status",
                            friendly: "角色状态",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            validate:"required",
                            format:GasSysBasic.StatusFormat,
                            index: 5
                        },
                        {
                            col: "roleDesc",
                            friendly: "角色权限描述",
                            index: 6
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_roleName;
                        if ($('#find_roleName').val()) {
                            find_roleName = RQLBuilder.like("roleName", $.trim($('#find_roleName').val()));
                        }
                        var filter = RQLBuilder.and([
                            find_roleName
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
                })
        }
    }
}();


