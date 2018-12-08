
var meterspecIdHelper = RefHelper.create({
    ref_url:'gasmtrmeterspec',
    ref_col:'meterModelId',
    ref_display:'meterModelName'
});

var meterSpecAction = function () {

    return {

        init: function () {
            $.map(meterspecIdHelper.getData(),function (value, key) {
                $('#find_unitname').append('<option value="' + value + '">' + value + '</option>');
            });
            this.reload();
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
                    restbase: 'gasmtrmeterspec',
                    key_column:'meterModelId',
                    coldefs:[
                        {
                            col:"meterModelId",
                            friendly:"表具规格型号ID",
                            validate:"required",
                            unique:"true",
                           // hidden:true,
                            //nonedit:"nosend",
                            index:1
                        },
//                      {
//                          col:"code",
//                          friendly:"编码",
//                          index:2
//                      },

                        {
                            col:"meterModelName",
                            validate:"required",
                            friendly:"名称",
                            index:2
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            format:GasSysBasic.StatusFormat,
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index:4
                        }
                        /*{
                            col:"createdTime",
                            friendly:"创建时间",
                            hidden:true,
                            index:5
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            hidden:true,
                            index:6
                            
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            hidden:true,
                            index:7
                            
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            hidden:true,
                            index:8
                        }*/

                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_unitname;

                        if($('#find_unitname option:selected').val()){
                            find_unitname = RQLBuilder.equal('meterModelName',$('#find_unitname option:selected').val());
                        }


                       /* if($('#find_unitname option:selected').val())
                        {
                            find_unitname=RQLBuilder.equal("meterModelName",$('#find_unitname  option:selected').val());
                        }
*/

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
                })
        }

    }
}();
