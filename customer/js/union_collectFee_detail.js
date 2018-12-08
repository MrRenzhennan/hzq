/**
 * Created by anne on 2017/3/24.
 */

var href = document.location.href;
var chgAccountId = href.split('?')[1];
//console.log(chgAccountId);

var gasfee = Restful.findNQ(hzq_rest+ 'gasactgasfeeaccount/?query={"chgAccountId":"'+chgAccountId+'"}')
console.log(gasfee)

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
                    // console.log(data)
                    var ctmarchiveid = [];
                    for(var i=0;i<data.length;i++){
                        ctmarchiveid.push(data[i].ctmArchiveId);
                    }

                    var chgAccountIdFormat = function () {
                        return {
                            f : function (val,row) {
                                return "<a  onclick='separate($(this))' data-id="+val+">分离</a>";
                            }
                        };
                    }();
                    // console.log(JSON.stringify(ctmarchiveid));
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
                            {
                                col:"ctmArchiveId",
                                sorting:false,
                                friendly:"操作",
                                format:chgAccountIdFormat,
                                index:5
                            }
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
                                url: "hzqs/chg/pbgbl.do?fh=GBLCHG0000000J00&resp=bd",
                                dataType: "json",
                                contentType: "application/json;charset=utf-8",
                                type: "post",
                                data: JSON.stringify({
                                    "ctmArchiveId": ctmarchiveId
                                }),
                                success: function (data) {
                                    console.log(data)
                                    if(data.unionBalance < 0){
                                        bootbox.alert("<center><h4>该联合账户已欠费不能从中分离用户。</h4></center>")
                                        return false;
                                    }else{
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
                                                    data:JSON.stringify({"relChgAccountId":"","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId}),
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
        "cols":"ar.*,d.gasfeeAccountId",
        "froms":"gas_ctm_archive ar left join gas_chg_account cac on cac.ctm_archive_id = ar.ctm_archive_id  left join gas_act_gasfee_account d on d.chg_account_id = cac.chg_account_id",
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
                "cols":"ar.*,d.gasfeeAccountId",
                "froms":"gas_ctm_archive ar left join gas_chg_account cac on cac.ctm_archive_id = ar.ctm_archive_id left join gas_act_gasfee_account d on d.chg_account_id = cac.chg_account_id",
                "wheres":sql + " and cac.account_type = '0' and cac.rel_chg_account_id is null and ar.customer_state='01' and ar.customer_kind = '9'",
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
                var arrs=[];
                var gasfeeatl=[];
                var da = xw.getTable().getData(true);
                console.log(da.rows)
                if(da.rows.length == 0){
                    bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
                    return false;
                }
               /* if(da.rows.length>1){
                    bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
                    return false;
                }*/
                // console.log(da.rows[0].ctmArchiveId);
                $.each(da.rows,function(index,item){
                    console.log(item)
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type: 'get',
                        url: hzq_rest + 'gaschgaccount/?query={"ctmArchiveId":"'+item.ctmArchiveId+'"}',
                        dataType: 'json',
                        async: false,
                        success:function(data){
                            console.log(data[0].chgAccountId);
                            gasfeeatl.push({
                                "customerCode":item.customerCode,
                                "customerKind":item.customerKind,
                                "gasfeeAccountId":item.gasfeeAccountId,
                                "tradeType":"BLL",
                                "gas":"0",
                                "money":"0",
                                "tradeDate": new Date(new Date()+"-00:00"),
                                "clrTag":"0",
                                "reservedField1":"联合账户补充清算",
                                "reservedField2":"联合账户清算",
                                "chgAccountId": data[0].chgAccountId,
                                "areaId":item.areaId,
                                "gasTypeId":item.gasTypeId,
                                "customerType":item.customerType,
                                "createdTime":new Date(new Date()+"-00:00"),
                                "modifiedTime":new Date(new Date()+"-00:00")

                            })
                            arrs.push(data[0].chgAccountId)
                            // $.ajax({
                            //     headers: {
                            //         'Accept': 'application/json',
                            //         'Content-Type': 'application/json'
                            //     },
                            //     type: 'PUT',
                            //     url: hzq_rest + 'gaschgaccount/'+data[0].chgAccountId,
                            //     dataType: 'json',
                            //     data:JSON.stringify({"relChgAccountId":chgAccountId}),
                            //     success:function(da){
                            //         if(da.success){
                            //             unionCollectFeeDetailAction.reload();
                            //         }
                            //     }
                            // })
                        }


                    })
                })
                console.log(arrs)
                console.log(gasfeeatl)
                var submitJson = {"sets":[
                    {"txid":"1","body":{"relChgAccountId":chgAccountId},"path":"/gaschgaccount/"+arrs.join(),"method":"put"},
                    {"txid":"2","body":gasfeeatl,"path":"/gasactgasfeeatl/","method":"post"},
                ]};


                $.ajax({
                    type: 'POST',
                    url:  "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    isMask: true,
                    data: JSON.stringify(submitJson),
                    success: function(data) {
                        var retFlag = true;
                        for(var i=0;i<data.results.length;i++){
                            if(!data.results[i].result.success){
                                retFlag=false;
                                break;
                            }
                        }
                        if(retFlag){

                            bootbox.alert("<center><h4>添加成功</h4></center>",function(){
                                unionCollectFeeDetailAction.reload();
                            });
                        }else{
                            bootbox.alert("<center><h4>添加失败</h4></center>");
                        }
                    },
                    error: function(err) {
                        bootbox.alert("<center><h4>提交失败</h4></center>");
                        if( err.status==406){
                            //need to login
                            if(window.location.pathname.indexOf('/login.html')<0)
                            {
                                window.location.replace("/login.html?redirect="+window.location.pathname);
                            }
                        }
                    }
                });















                // var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)
                // console.log(result)
                // if(result.success == false){
                //
                //     bootbox.alert("添加失败");
                // }else if(result.success == undefined){
                //     if(result.results[0]["result"]['success']) {
                //         bootbox.alert("添加成功", function () {
                //             unionCollectFeeDetailAction.reload();
                //         });
                //     }
                // }

            });


        },

    }
}();





    /*gacct.gasfee_account_id,
     arch.customer_code,
     'BLL' trade_type,
     '0' gas,
     '0' money,
     sysdate trade_date,
     '0' clr_tag,
     sysdate created_time,
     sysdate modified_time,
     '联合账户补充清算' reserved_field1,
     '补充清算' reserved_field2,
     acct.chg_account_id,
     arch.area_id,
     arch.gas_type_id,
     arch.customer_kind,
     arch.customer_type
     */





