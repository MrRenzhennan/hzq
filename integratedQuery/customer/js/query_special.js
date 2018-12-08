// 供气区域helper

var areaHelper=RefHelper.create({
    ref_url:"gasbizarea",
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
var lowerProtectionFormat = function(){
    return{
        f:function(val){
            if(val == 0){
                return "正常"
            }else if(val == 1){
                return "低保"
            }else if(val == 2){
                return "低收入"
            }else if(val == 3){
                return "低困（困难家庭）"
            }
        }
    }
}();

var ctmSpecialAction = function () {


    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper:function(){
            // 供气区域 select init
            $.map(areaHelper.getData(), function(value, key) {
                $('#find_areaId').append('<option value="'+key+'">'+value+'</option>');
            });

        },

        reload:function(){

            $('#divtable').html('');

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gascsrlowincome/?query={"status":"2"}',
                    key_column: "lowincomeId",
                    //---------------行定义
                    coldefs:[

                        {
                            col:"name",
                            friendly:"姓名",
                            // hidden:true,
                            unique:"true",
                            index:1
                        },
                        {
                            col:"socialAccount",
                            friendly:"保障号",
                            // inputSource:"select",
                            // format:SpecificTypeFormat,
                            index:2
                        },
                        {
                            col:"population",
                            friendly:"人口数",
                            index:3
                        },
                        {
                            col:"bankAccount",
                            friendly:"银行账号",
                            index:4
                        },

                        {
                            col:"identity",
                            friendly:"身份证号",
                            index:5
                        },
                        {
                            col:"lowerProtection",
                            format:lowerProtectionFormat,
                            friendly:"类型",
                            index:6
                        }

                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_areaId,find_idcardno,find_idcard;

                        if($('#find_user').val())
                        {
                            find_areaId=RQLBuilder.like("name",$('#find_user').val());
                        }
                        console.log($('#find_idcardno').val())
                        if($('#find_idcardno').val())
                        {
                            find_idcardno=RQLBuilder.like("socialAccount",$('#find_idcardno').val());
                        }

                        if($('#find_idcard').val())
                        {
                            find_idcard=RQLBuilder.like("identity",$('#find_idcard').val());
                        }

                        var status = RQLBuilder.equal("status","2");
                        var filter=RQLBuilder.and([
                            find_areaId ,find_idcardno,find_idcard,status
                        ]);
                        xw.setRestURL(hzq_rest + "gascsrlowincome")
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){

                    }
                })
        }
    }

}();
