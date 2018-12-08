     var chargeUnits = {};

 var chargeBuilder = function(val){
    var buf = "<select id='bankCode' name='bankCode' class='form-control chosen-select'>";
    $.each(chargeUnits,function(k,v){

        buf+="<option value='"+k+"'";
        if(val==k){
            buf+=" selected "
        }
        buf+= ">"+v.unitname+"</option>";
    })
    buf+="</select>";

    return buf;

}


var BillBankAction = function () {

    
    var chargeUnitFormat = {
        f:function(val,row) {
            console.log("chargeUnitFormat::"+val+",row="+JSON.stringify(row)+"::")
            return chargeUnits[val].unitname;
        }
    }

   
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper:function(){
           
           var bd = {"cols":"*",
                "froms":" (select bank_code as unitcode,bank_name as unitname from gas_bas_bank where status = 1 "+
                        " union "+
                        " select charge_unit_code as unitcode,charge_unit_name as unitname from gas_biz_charge_unit where status = 1) ", 
                "page":"false",
                "orderby":"unitcode"
            };

            $.ajax({
                type: 'get',
                url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (data, textStatus, xhr) {
                    if (xhr.status == 200) {
                        var rows = data.rows;
                        console.log("rows=="+JSON.stringify(rows))
                        chargeUnits = {};
                        if (!data.rows || !rows.length || rows.length == 0) {
                        } else {
                            $.each(rows,function(idx,row){
                                chargeUnits[row.unitcode] = row;                                
                            })
                        }
                    }
                }
            });
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
                    restbase: 'gasbllbankcustomref',
                    key_column:'uuid',
                    coldefs:[
                        {       
                            col:"uuid",
                            unique:true,
                            hidden:"hidden",
                            nonedit: "nosend",
                        },
                        {
                            col:"bankCode",
                            friendly:"入账单位",
                            format:chargeUnitFormat,
                            inputsource: "custom",
                            inputbuilder: "chargeBuilder",
                            default_value:"0",
                            index:1
                        },                        
                        {
                            col:"customerCode",
                            friendly:"客户编号",
                            index:3
                        },
                        {
                            col:"customerName",
                            friendly:"缴费单位名称",
                            index:4
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            nonedit: "nonedit",
                            readonly: "readonly",
                            index:5
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            nonedit: "nonedit",
                            readonly: "readonly",
                            default_value:UserInfo.userId(),
                            index:6
                        },
                        {
                            col:"modifiedTime",
                            friendly:"修改时间",   
                            nonedit: "nonedit",
                            readonly: "readonly",                         
                            index:7
                        },{
                            col:"modifiedBy",
                            friendly:"修改人",
                            nonedit: "nonedit",
                            readonly: "readonly",
                            index:6
                        },
                    ],


                    // 查询过滤条件
                    findFilter: function(){
                        var find_customName , find_customCode;

                        if($('#find_customName').val())
                        {
                            find_customName=RQLBuilder.like("customerName",$('#find_customName').val());
                        }

                        if($('#find_customCode').val())
                        {
                            find_customCode=RQLBuilder.like("customerCode",$('#find_customCode').val());
                        }

                        var filter=RQLBuilder.and([
                            find_customName , find_customCode
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
        },

    }
}();
