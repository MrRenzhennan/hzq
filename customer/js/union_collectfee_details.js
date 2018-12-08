/**
 * Created by Administrator on 2017/7/20 0020.
 */
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

                   /* var chgAccountIdFormat = function () {
                        return {
                            f : function (val) {
                                return "<a  onclick='separate($(this))' data-id="+val+">分离</a>";
                            }
                        };
                    }();*/
                    console.log(JSON.stringify(ctmarchiveid));
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
                            },
                            /*{
                                col:"ctmArchiveId",
                                sorting:false,
                                friendly:"操作",
                                format:chgAccountIdFormat,
                                index:5
                            }*/
                        ],
                        findFilter: function(){

                        }
                    });

                }
            });

            separate = function(a){
                var ctmarchiveId = $(a).attr("data-id");
                bootbox.confirm({
                    buttons: {
                        confirm: {
                            label: '确认',
                            className: 'blue'
                        },
                        cancel: {
                            label: '取消',
                            className: 'btn-default'
                        }
                    },
                    message: "<h4>确定要分离该用户吗？</h4>",
                    callback:function (val) {

                        if(val == true){
                            $.ajax({
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                type: 'get',
                                url: hzq_rest + 'gaschgaccount/?query={"ctmArchiveId":"'+ctmarchiveId+'"}',
                                dataType: 'json',
                                success:function(data){
                                    console.log(data[0].chgAccountId);
                                    $.ajax({
                                        //url:hzq_rest+"gaschgaccctm",
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                        type: 'PUT',
                                        url: hzq_rest + 'gaschgaccount/'+data[0].chgAccountId,
                                        dataType: 'json',
                                        data:JSON.stringify({"relChgAccountId":""}),
                                        success:function(da){
                                            unionCollectFeeDetailAction.reload();
                                            // xw.update();
                                            // window.location.reload();
                                        }
                                    })

                                }

                            })
                        }
                    }
                });


            }
        }
    }
}();



$("#addaccount").on("click",function(){
    $("#divtable1").html("");

    var bd={
        "cols":"ar.*",
        "froms":"gas_ctm_archive ar left join gas_chg_account cac on cac.ctm_archive_id = ar.ctm_archive_id",
        "wheres":"cac.account_type = '0' and cac.rel_chg_account_id is null and ar.customer_state='01' and ar.customer_kind = '9'",
        "page":true,
        "limit":50
    };
    xw = XWATable.init({
        divname: "divtable1",
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        checkAllToggle: true,
        findbtn:"screen",
        checkboxes: true,
        //----------------基本restful地址---
        // restbase: 'gasctmarchive',
        restURL:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
        key_column: 'ctmArchiveId',
        coldefs:[
            {
                col:"customerCode",
                friendly:"客户编号",
                unique:"true",
                sorting:false,
                index:1
            },
            {
                col:"customerName",
                friendly:"客户名称",
                sorting:false,
                index:2
            },
            {
                col:"customerAddress",
                friendly:"客户地址",
                sorting:false,
                index:3
            },
            {
                col:"customerState",
                friendly:"客户状态",
                format:GasModCtm.customerStateFormat,
                sorting:false,
                index:4
            }
        ],
        findFilter: function(){
            var sql= "1=1";
            var customerCode = $("#customerCode").val();
            var customerName = $("#customerName").val();
            var customerAddress = $("#customerAddress").val();

            if(customerCode){
                sql+=" and ar.customer_code like '%"+customerCode+"%'";
            }
            if(customerName){
                sql+= " and ar.customer_name like '%"+customerName+"%'"
            }
            if(customerAddress){
                sql+=" and ar.customer_address like '%"+customerAddress+"%'"
            }
            var bd={
                "cols":"ar.*",
                "froms":"gas_ctm_archive ar left join gas_chg_account cac on cac.ctm_archive_id = ar.ctm_archive_id",
                "wheres":sql + " and cac.account_type = '0' and cac.rel_chg_account_id is null and ar.customer_state='01'",
                "page":"true",
                "limit":50
            };
            xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
        },

    })
});

singleCreate = function(){
    return {
        init:function(){
            this.reloade();
        },
        reloade:function () {
            $("#save_btn").on('click',function(){
                var da = xw.getTable().getData(true);
                console.log(da.rows.length)
                if(da.rows.length == 0){
                    bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
                    return false;
                }
                if(da.rows.length>1){
                    bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
                    return false;
                }
                console.log(da.rows[0].ctmArchiveId);
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    type: 'get',
                    url: hzq_rest + 'gaschgaccount/?query={"ctmArchiveId":"'+da.rows[0].ctmArchiveId+'"}',
                    dataType: 'json',
                    success:function(data){
                        console.log(data[0].chgAccountId);
                        $.ajax({
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            type: 'PUT',
                            url: hzq_rest + 'gaschgaccount/'+data[0].chgAccountId,
                            dataType: 'json',
                            data:JSON.stringify({"relChgAccountId":chgAccountId}),
                            success:function(da){
                                unionCollectFeeDetailAction.reload();

                            }
                        })

                    }

                })

            });


        },

    }
}();





