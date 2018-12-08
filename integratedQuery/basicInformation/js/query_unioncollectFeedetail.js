/**
 * Created by anne on 2017/3/24.
 */

var href = document.location.href;
var chgAccountId = href.split('?')[1];
//console.log(chgAccountId);

unionCollectFeeDetailAction = function () {
    return {
        init: function () {

            this.reload()
        },
        reload: function () {
            console.log(chgAccountId);
            $(function(){
                $.ajax(
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type:'get',
                        url:hzq_rest+ 'gaschgaccount/'+chgAccountId,
                        dataType:'json',
                        data:"",
                        success:function (data) {
                            console.log(data);
                            var json=eval(data);
                            $("#chgAccountNo").val(json["chgAccountNo"]);
                            $("#acc_Name").val(json["accName"]);
                            $("#invoice_Name").val(json["invoiceName"]);
                            $("#link_man").val(json["linkman"]);
                            $("#linkman_Tel").val(json["linkmanTel"]);
                            $("#linkman_Phone").val(json["linkmanPhone"]);
                            $("#linkman_Unit").val(json["linkmanUnit"]);
                            $("#linkman_Postcode").val(json["linkmanPostcode"]);
                            $("#linkman_Mail").val(json["linkmanMail"]);
                            $("#linkman_Address").val(json["linkmanAddress"]);
                            if(json.invoiceType){
                                if(json.invoiceType == "1"){
                                    $("#invoiceType").val("普通发票");
                                }else if(json.invoiceType == "2"){
                                    $("#invoiceType").val("增值税发票")
                                }
                            }
                        }

                    }
                )
            });

            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                type: 'get',
                url: hzq_rest + 'gaschgaccount/?query={"relChgAccountId":"'+chgAccountId+'"}',
                dataType: 'json',
                data: "",
                success: function (data) {
                    console.log(data)
                    var ctmarchiveid = [];
                    for(var i=0;i<data.length;i++){
                        ctmarchiveid.push(data[i].ctmArchiveId);
                    }

                    console.log(JSON.stringify(ctmarchiveid))
                    $("#divtable").html("");
                    xw = XWATable.init({
                        divname: "divtable",
                        //----------------table的选项-------
                        pageSize: 10,
                        columnPicker: true,
                        transition: 'fade',
                        sorting:true,
                        checkAllToggle: true,
                        //----------------基本restful地址---
                        restbase: 'gasctmarchive?query={"ctmArchiveId":{"$in":'+JSON.stringify(ctmarchiveid)+'}}',
                        key_column: 'ctmArchiveId',
                        coldefs:[
                            {
                                col:"customerCode",
                                friendly:"客户编号",
                                index:1
                            },
                            {
                                col:"customerName",
                                friendly:"客户名称",
                                index:2
                            },
                            {
                                col:"customerAddress",
                                friendly:"客户地址",
                                index:3
                            },
                            {
                                col:"customerState",
                                friendly:"客户状态",
                                format:GasModCtm.customerStateFormat,
                                index:4
                            }
                        ],
                        findFilter: function(){

                        }
                    })

                }
            });
        }
    }
}();



