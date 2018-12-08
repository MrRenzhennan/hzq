var monthOutInfoAction = function () {

    var xw;
    var archiveids = [];
    var restbase = 'gasacticvirtualatl';
    var customerCode;
    var querys = new Array();

  

    var customerKindFormat = function () {
        return {
            f : function (val) {
                if(val == '1'){
                    return "居民";
                }else if (val == '9'){
                    return "非居民";
                }else{
                    return "客户类别错误";
                }
            }
        }
    }();

    return {

        init: function () {
            this.initRestbae();
            this.initHelper();
            this.reload();
        },

        initRestbae:function () {
            var href = window.location.href.split('?')[1];
            href = decodeURIComponent(href);
            href = href.substr(1, href.length);
            var json_str = href.split('=')[1];
            //{"areaId":"123","countperId":"123","serviceperId":"123","bookId":"123"}
            var data = {};
            data.json_str = json_str;
            $.ajax({
                url: "hzqs/bil/pbibr.do?fh=IBRBIL0000000J00&resp=bd",
                dataType: "json",
                async: false,
                data: JSON.stringify(data),
                contentType: "application/json;charset=utf-8",
                type: "POST",
                success : function(result){
                    if(result.json_str){
                        var data = JSON.parse(result.json_str);
                        for(var i = 0; i < data.length; i++){
                            var customerCode = '"' + data[i].customerCode +'"';
                            archiveids.push(customerCode);

                        }
                        // customerCode = RQLBuilder.condition_fc("customerCode", "$in", "[\"001\",\"002\"]");
                        customerCode = RQLBuilder.condition_fc("customerCode", "$in", "[" + archiveids.join() + "]");

                        querys.push(customerCode);
                        restbase = 'gasacticvirtualatl?query=' + RQLBuilder.and(querys).rql();//GAS_ACT_IC_VIRTUAL_ATL
                    }
                }
            });
        },

        initHelper:function(){

            // 供气区域 select init
            $.map(GasModSys.areaHelper.getData(), function(value, key) {
                $('#find_areaId').append('<option value="'+key+'">'+value+'</option>');
            });

            $('#find_areaId').on('change',function(e){
                console.log("change area:"+e+"."+$('#find_areaId').val());
                GasModSys.counterUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "cb":function(data){
                        console.log('the areaiddata is ;;;', data);
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                            console.log('the inhtml is :::', inhtml);
                        })
                        $("#find_countperId").html(inhtml);
                        $("#find_countperId").val("").change();

                    }
                })
                //xw.autoResetSearch();
            })

            $('#find_countperId').on('change',function(e){
                console.log("change counter:"+e+"."+$('#find_countperId').val());
                GasModSys.copyUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "countperId":$('#find_countperId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                            $.each(data,function(idx,row){
                                inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                            })
                        }
                        $("#find_serviceperId").html(inhtml);
                        $("#find_serviceperId").val("").change();

                    }
                })
                //xw.autoResetSearch();
            });

            $('#find_serviceperId').on('change',function(e){
                console.log("change serviceper:"+e+"."+$("#find_serviceperId").val());
                GasModMrd.bookInService({
                    "areaId":$("#find_areaId").val(),
                    "countperId":$('#find_countperId').val(),
                    "serviceperId":$('#find_serviceperId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                            $.each(data,function(inx,row){
                                inhtml +='<option value="'+row.bookId+'">'+row.bookCode+':'+row.address+'</option>'
                            })
                        }
                        $("#find_bookId").html(inhtml);
                        $("#find_bookId").val("").change();
                    }
                });
                //$('#find_bookId').val("").change();
                //xw.autoResetSearch();
            });
        },

        reload: function () {

            $('#divtable').html('')

            xw = XWATable.init(
                {
                    findbtn:"exc_button",
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: restbase,
                    key_column: 'icVirtualAtlId',//IC_VIRTUAL_ATL_ID
                    coldefs: [
                        {
                            col: "icVirtualAtlId",
                            friendly: "IC卡交易主键",
                            unique: true,
                            hidden: true,
                            readonly: "readonly",
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format:GasModSys.areaFormat,
                            index: 2
                        },
                        {
                            col:"serviceperId",
                            friendly:"客户服务员",
                            format:GasModSys.employeeNameFormat,
                            index:3
                        },
                        {
                            col:"countperId",
                            friendly:"核算员",
                            format:GasModSys.employeeNameFormat,
                            index:4
                        },
                        {
                            col: "bookId",
                            friendly: "抄表本",
                            validate:"required",
                            index: 5
                        },
                        {
                            col: "chgAccCtmId",
                            friendly: "联合账户编号",
                            hidden: true,
                            index: 6
                        },
                        {
                            col: "gasfeeAccountId",
                            friendly: "燃气费账户",
                            hidden: true,
                            index: 7
                        },
                        {
                            col:"customerCode",
                            friendly:"客户编号",
                            index:8
                        },
                        {
                            col: "gasTypeId",
                            friendly: "计费方式",
                            validate:"required",
                            index: 9
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类型",
                            format:customerKindFormat,
                            index: 10
                        },
                        {
                            col:"tradeType",
                            friendly:"交易类型",
                            format:GasModBil.TradeTypeFormat,
                            index:11
                        },
                        {
                            col:"gas",
                            friendly:"气量",
                            index:12
                        },
                        {
                            col:"money",
                            friendly:"金额",
                            index:13
                        },
                        {
                            col:"numberOfDays",
                            friendly:"计费天数",
                            index:14
                        },
                        {
                            col:"dailyMeasure",
                            friendly:"日均用气量",
                            index:15
                        },
                        {
                            col:"tradeDate",
                            friendly:"交易日期",
                            format:GasModBil.dateFormat,
                            index:16
                        },
                        {
                            col:"clrTag",
                            friendly:"清算标志",
                            index:17
                        },
                        {
                            col:"clrDate",
                            friendly:"清算日期",
                            format:GasModBil.dateFormat,
                            index:18
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            format:GasSysBasic.meterStausFormat,
                            index:19
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:GasModBil.dateFormat,
                            index:20
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            index:21
                        },
                        {
                            col:"modifiedTime",
                            friendly:"修改时间",
                            format:GasModBil.dateFormat,
                            hidden: true,
                            index:22
                        },
                        {
                            col:"modifiedBy",
                            friendly:"修改人",
                            hidden: true,
                            index:23
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var areaId;
                        var countperId;
                        var serviceperId;
                        var bookId;
                        var customerCode;
                        if( $('#find_areaId').val()){
                            // json_str.areaId=$('#find_areaId').val()
                            areaId = RQLBuilder.equal("areaId", $('#find_areaId').val());
                        }
                        if( $('#find_countperId').val()){
                            // json_str.countperId=$('#find_countperId').val()
                            countperId = RQLBuilder.equal("countperId", $('#find_countperId').val());
                        }
                        if($('#find_serviceperId').val()){
                            // json_str.serviceperId = $('#find_serviceperId').val()
                            serviceperId = RQLBuilder.equal("serviceperId", $('#find_serviceperId').val());
                        }
                        if($('#find_bookId').val()){
                            // json_str.bookId=$('#find_bookId').val()
                            bookId = RQLBuilder.equal("bookId", $('#find_bookid').val());
                        }
                        if($('#find_customer_code').val()){
                            customerCode = RQLBuilder.equal("customerCode", $('#find_customer_code').val())
                        }

                        var filter=RQLBuilder.and([
                            areaId, countperId, serviceperId, bookId,customerCode
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
                }
            )
        }

    }
}();
