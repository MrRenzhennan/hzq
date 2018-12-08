
var GET,POST,PUT,DELETE;
var method = function(val){
    return "<select id='urlMethod' name='urlMethod' class='form-control select2me'>" +
        "<option value=''></option>" +
        "<option value='GET'>GET</option>" +
        "<option value='PUT'>PUT</option>" +
        "<option value='POST'>POST</option>" +
        "<option value='DELETE'>DELETE</option>" +
        "<option value='GET,PUT'>GET,PUT</option>" +
        "<option value='POST,GET'>POST,GET</option>" +
        "<option value='POST,PUT'>POST,PUT</option>" +
        "<option value='GET,DELETE'>GET,DELETE</option>" +
        "<option value='DELETE,PUT'>DELETE,PUT</option>" +
        "<option value='POST,DELETE'>POST,DELETE</option>" +
        "<option value='POST,GET,PUT'>POST,GET,PUT</option>" +
        "<option value='GET,PUT,DELETE'>GET,PUT,DELETE</option>" +
        "<option value='POST,GET,DELETE'>POST,GET,DELETE</option>" +
        "<option value='POST,PUT,DELETE'>POST,PUT,DELETE</option>" +
        "<option value='POST,GET,PUT,DELETE'>POST,GET,PUT,DELETE</option>" +
        "</select>";
};
var urlResourceHelper=RefHelper.create({
    ref_url:"gassysurlresource",
    ref_col:"urlResourceId",
    ref_display:"urlResourceName",
});
var roleHelper=RefHelper.create({
    ref_url:"gassysrole",
    ref_col:"roleId",
    ref_display:"roleName",
});
var urlResourceFormat=function(){
    return {
        f: function(val){
            return urlResourceHelper.getDisplay(val);
        },
    }
}();
var roleFormat=function(){
    return {
        f: function(val){
            return roleHelper.getDisplay(val);
        },
    }
}();

var roleAction = function () {
    return {
        init: function () {
            $.map(roleHelper.getData(), function (value, key) {
                $('#find_role').append('<option value="' + key + '">' + value + '</option>');
            });
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');

            this.xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gassysroleurlresource',
                    key_column:'roleUrlResourceId',
                    coldefs:[
                        {
                            col:"roleUrlResourceId",
                            friendly:"ID",
                            unique:"true",
                            hidden:true,
                            //readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"roleId",
                            friendly:"角色名称",
                            format:roleFormat,
                            validate:"required",
                            inputsource: "select",
                            ref_url:  "gassysrole",
                            ref_name: "roleName",
                            ref_value: "roleId",
                            index:2
                        },
                        {
                            col:"urlResourceId",
                            friendly:"资源名称",
                            validate:"required",
                            format:urlResourceFormat,
                            inputsource: "select",
                            ref_url:  "gassysurlresource",
                            ref_name: "urlResourceName",
                            ref_value: "urlResourceId",
                            index:3
                        },
                        {
                            col:"urlMethod",
                            friendly:"请求方法",
                            inputsource: "custom",
                            inputbuilder: "method",
                            validate:"required",
                            index:4
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            hidden:true,
                            format:dateFormat,
                            nonedit:"nosend",
                            index:5
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            hidden:true,
                            nonedit:"nosend",
                            index:6
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            hidden:true,
                            format:dateFormat,
                            nonedit:"nosend",
                            index:7
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            hidden:true,
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            validate:"required",
                            format:GasSysBasic.StatusFormat,
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index:9
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_roleName;
                        if ($('#find_role').val()) {
                            find_roleName = RQLBuilder.like("roleId", $.trim($('#find_role').val()));
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


