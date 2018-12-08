var lendFlagBuilder= function(val){
    if(val=="Y"){
        return "<select id='lendFlag' name='lendFlag' class='form-control select2me'>" +
            "<option value='Y' selected>是</option>" +
            "<option value='N' >否</option></select>" ;
    }else if(val=="N"){
        return "<select id='lendFlag' name='lendFlag' class='form-control select2me'>" +
            "<option value='Y' >是</option>" +
            "<option value='N' selected>否</option></select>" ;
    }else{
        return "<select id='lendFlag' name='lendFlag' class='form-control select2me'>" +
            "<option value='Y' >是</option>" +
            "<option value='N' >否</option></select>" ;
    }
};
var isdirBuilder = function(val){
    if(val=="1"){
        return "<select id='isDir' name='isDir' class='form-control select2me'>" +
            "<option value='1' selected>是</option>" +
            "<option value='0' >否</option></select>" ;
    }else if(val=="0"){
        return "<select id='isDir' name='isDir' class='form-control select2me'>" +
            "<option value='1' >是</option>" +
            "<option value='0' selected>否</option></select>" ;
    }else{
        return "<select id='isDir' name='isDir' class='form-control select2me'>" +
            "<option value='1' selected>是</option>" +
            "<option value='0' >否</option></select>" ;
    }
};
var BaseAction = function () {



    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper:function(){
            // 供气区域 select init
            /*$.map(areaHelper.getData(), function(value, key) {
                $('#find_areaId').append('<option value="'+key+'">'+value+'</option>');
            });*/

        },

        reload:function(){

            $('#divtable').html('');

            this.xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',

                    checkAllToggle:true,
                    checkboxes: true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrreskind',
                    key_column:'reskindId',
                    coldefs:[

                        {
                            col:"reskindName",
                            friendly:"物品种类名称",
                            validate:"required",
                            unique:"true",
                            sorting:false,
                            index:1
                        },

                        {
                            col:"funcLevel",
                            friendly:"级别",
                            validate:"required",
                            sorting:false,
                            index:2
                        },
                        {
                            col:"isDir",
                            friendly:"是否目录",
                            format:GasSysBasic.isDirFormat,
                            inputsource: "custom",
                            inputbuilder: "isdirBuilder",
                            validate:"required",
                            sorting:false,
                            index:3
                        },
                        {
                            col:"posCode",
                            friendly:"位置码",
                            validate:"required",
                            sorting:false,
                            index:4
                        },
                        {
                            col:"reskindCode",
                            friendly:"物品种类代码",
                            validate:"required",
                            sorting:false,
                            index:5
                        },
                        {
                            col:"spec",
                            friendly:"规格",
                            validate:"required",
                            sorting:false,
                            index:6
                        },
                        {
                            col:"nunit",
                            friendly:"单位",
                            validate:"required",
                            sorting:false,
                            index:7
                        },
                        {
                            col:"lendFlag",
                            friendly:"出借标志",
                            validate:"required",
                            format:GasSysBasic.logFormat,
                            inputsource: "custom",
                            inputbuilder: "lendFlagBuilder",
                            sorting:false,
                            index:8
                        }

                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_unitname;

                        if($('#find_unitname').val())
                        {
                            find_unitname=RQLBuilder.like("reskindName",$('#find_unitname').val());
                        }


                        var filter=RQLBuilder.and([
                            find_unitname
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
                    }
                }) //--init
        },

    }
}();
