
var reskindIdHelper;
var meterspecIdHelper;
var staffHelper;

var inventory_checkAction = function () {
    var depoHelper = RefHelper.create({
        ref_url:"gasmtrdepository",
        ref_col:"depositoryId",
        ref_display:"depositoryname"
    });

    reskindIdHelper = RefHelper.create({
        ref_url:'gasmtrreskind',
        ref_col:'reskindId',
        ref_display:'reskindname'
    });

    meterspecIdHelper = RefHelper.create({
        ref_url:'gasmtrmeterspec',
        ref_col:'meterspecId',
        ref_display:'name'
    });

    staffHelper  = RefHelper.create({
        ref_url:'fcsysuser',
        ref_col:'userId',
        ref_display:'employeename',
    });

    var checkstockIdFormat = function () {
        return {
            f : function (val, row) {
                return "<a href='customer/dm/inventory_check_detail.html?" + row.checkstockId + "'>" + val + "</a>"
            }
        }
    }();

    var depoFormat = function () {
        return {
            f : function (val) {
                return depoHelper.getDisplay(val);
            }
        }
    }();

    var operatorForamt = function () {
        return {
            f : function (val,row) {
                return "<a onclick='input_result(\"" + row.checkstockId + "\")' data-toggle='modal' data-target='#'>录入结果</a>";
            }
        }
    }();

    return {

        init : function () {
            this.initHelper();
            this.reload();
        },

        initHelper : function () {
            $.map(depoHelper.getData(), function (value, key) {
                $('#find_depo').append('<option value="' + key + '">' + value + '</option>');
            })
        },

        reload:function () {
            $('#divtable').html('');

            this.xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrcheckstock',
                    key_column:'checkstockId',
                    coldefs:[
                        {
                            col:"checkstockId",
                            friendly:"盘库计划编号",
                            nonedit:"nosend",
                            format:checkstockIdFormat,
                            sorting:false,
                            unique:"true",
                            index:1
                        },
                        {
                            col:"depositoryId",
                            friendly:"盘点仓库",
                            sorting:false,
                            format:depoFormat,
                            inputsource:"select",
                            ref_url:  "gasmtrdepository",
                            ref_name: "depositoryname",
                            ref_value: "depositoryId",
                            index:2
                        },
                        {
                            col:"createtime",
                            friendly:"创建时间",
                            nonedit:"nosend",
                            index:3
                        },
                        {
                            col:"begindate",
                            friendly:"开始时间",
                            inputsource:"datepicker",
                            index:4
                        },
                        {
                            col:"enddate",
                            friendly:"结束时间",
                            inputsource:"datepicker",
                            index:5
                        },
                        {
                            col:"billstate",
                            friendly:"单据状态",
                            nonedit:"nosend",
                            format:planFormat,
                            sorting:false,
                            index:6
                        },
                        {
                            col:"userId",
                            friendly:"盘点人",
                            nonedit:"nosend",
                            sorting:false,
                            index:7
                        },
                        {
                            col:"remark",
                            friendly:"备注",
                            hidden:true,
                            sorting:false,
                            index:8
                        },
                        {
                            col:"operator",
                            friendly:"操作",
                            nonedit:"nosend",
                            format:operatorForamt,
                            sorting:false,
                            index:9
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function
                        var find_depo = undefined;
                        if($('#find_depo').val()){
                            find_depo = RQLBuilder.equal("depositoryId",$('#find_depo').val());
                        }

                        var filter = RQLBuilder.and([
                            find_depo
                        ]);
                        return filter.rql();
                    },//--findFilter

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }
            )
        }
    }
}();

$('#add_inventory').click(function () {
    window.location = 'customer/dm/inventory_check_select_depository.html';
});

function input_result(checkstockId) {
    console.log("the checkstockId is : " + checkstockId);

    $.ajax({
        url:hzq_rest + "gasmtrchkstockdetail?query={\"checkstockId\":\"" + checkstockId + "\"}",
        type:"GET",
        dateType:"json"
    })
        .done(function (data) {
            var diag = bootbox.dialog({
                message:
                '<form id="result" class="form-group">' +
                    '<table class="watable table table-spriped table-hover table-bordered table-condensed">' +
                        '<thead>' +
                            '<th>规格型号</th>'+
                            '<th>物品种类</th>'+
                            '<th>库存数量</th>'+
                            '<th>盘点数量</th>'+
                        '</thead>'+
                        '<tbody id="detail_body">'+

                        '</tbody>' +
                        '<tfoot>' +
                        '</tfoot>' +
                    '</table>' +
                '</form>',
                title:"结果录入",
                buttons:{
                    success:{
                        label:"保存",
                        class:"btn btn-primary",
                        callback:function () {
                            $.ajax({
                                headers:{
                                    'Accept':'application/json',
                                    'Content-Type':'application/json'
                                },
                                url:hzq_rest + 'gasmtrchkstockdetail/result',
                                dataType:'json',
                                type:'PUT',
                                data:$.toJSON($('#result').serializeObject()),
                                async:false
                            })
                                .done(function (data) {
                                    if (data.success != false){
                                        bootbox.alert('<br><center><h4>录入成功!!</h4></center><br>')
                                        inventory_checkAction.reload();//页面刷新查看效果
                                    }else{
                                        bootbox.alert('<br><center><h4>录入失败!!</h4></center><br>')
                                    }

                                })
                                .error(function () {
                                    bootbox.alert('<br><center><h4>录入失败!!</h4></center><br>')
                                })

                        }

                    },
                    danger:{
                        label:"取消",
                        class:"btn btn-default",
                        callback:function () {}
                    }
                }
            });

            var length = data.length;
            for(var i = 0; i < length; i++){
                $('#detail_body').append(
                    '<tr>' +
                        '<td>' + meterspecIdHelper.getDisplay(checkfield(data[i].meterspecid)) + '</td>' +
                        '<td>' + reskindIdHelper.getDisplay(checkfield(data[i].gasReskindId)) + '</td>' +
                        '<td><input class="form-control input-group" name="stockquantity[]" value="' + checkfield(data[i].stockquantity) + '"></td>' +
                        '<td><input class="form-control input-group" name="checkstockquantity[]" value="' + checkfield(data[i].checkstockquantity) + '"><input class="hidden" name="chkstockdetailId[]" value="' + data[i].chkstockdetailId + '"></td>' +
                    '</tr>'
                )
            }
            $('#detail_body').append(
                '<tr> <td colspan="4">'+
                '<div class="col-md-6">'+
                    '<div class="btn-group input-group input-select2me">'+
                        '<div class="input-group-addon">盘库人员:</div>'+
                        '<select id="user" name="userId" class="form-control input-middle select2me" data-placeholder="盘库人员">'+
                            '<option value=""></option>'+
                        '</select>'+
                        '<span class="inputclear glyphicon glyphicon-remove-circle hide" ></span>'+
                    '</div>'+
                '</div>' +
                '</td>' +
                '</tr>'
            )

            $.map(staffHelper.getData(),function (value,key) {
                $('#user').append('<option value="' + key + '">' + value + '</option>')
            })

        });

};

function checkfield(field) {
    if(field == undefined)
        return "";
    return field
}

// 动态加载css文件
function loadStyles(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

// 动态加载js脚本文件
function loadScript(url) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}