
var stationTypeBuilder=function(val){
    if(val=="Worker"){
        return "<select id='stationType' name='stationType' class='form-control select2me'>" +
            "<option value=''></option>"+
            "<option value='Worker' selected>Worker</option>" +
            "<option value='Leader' >Leader</option></select>" ;
    }else if(val=="Leader"){
        return "<select id='stationType' name='stationType' class='form-control select2me'>" +
            "<option value=''></option>"+
            "<option value='Worker' >Worker</option>" +
            "<option value='Leader' selected>Leader</option></select>" ;
    }else{
        return "<select id='stationType' name='stationType' class='form-control select2me'>" +
            "<option value=''></option>"+
            "<option value='Worker' >Worker</option>" +
            "<option value='Leader'>Leader</option></select>" ;
    }
};


var StationAction = function () {
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper:function(){

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
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasbizstation/?sort=stationCode',
                    key_column:'stationId',
                    coldefs:[
                        {
                            col:"stationId",
                            friendly:"岗位ID",
                            unique:"true",
                            nonedit:"nosend",
                            hidden:true,
                            index:1
                        },
                        {
                            col:"stationCode",
                            friendly:"岗位编码",
                            validate:"required",
                            index:2
                        },
                        {
                            col:"stationName",
                            friendly:"岗位名称",
                            validate:"required",
                            index:3
                        },
                        {
                            col:"stationSpec",
                            friendly:"岗位描述",
                            index:4
                        },
                        {
                            col:"stationType",
                            friendly:"岗位类别",
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "stationTypeBuilder",
                            index:5
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            validate:"required",
                            format:GasSysBasic.StatusFormat,
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index:6
                        }
                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_stationName;
                        if($('#find_stationName').val())
                        {
                            find_stationName=RQLBuilder.like("stationName",$.trim($('#find_stationName').val()));
                        }
                        var filter=RQLBuilder.and([
                            find_stationName
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
                })
        }
    }
}();
