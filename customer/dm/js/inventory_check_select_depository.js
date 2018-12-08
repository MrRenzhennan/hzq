
var unitidHelper;
var factoryHelper;
var reskindIdHelper;
var meterspecIdHelper;

var tableLength = 1;//表格行数

var inventory_check_select_depositoryAction = function () {
    unitidHelper = RefHelper.create({
        ref_url:"gassysunit",
        ref_col:"unitId",
        ref_display:"unitname"
    });

    var parentidHelper = RefHelper.create({
        ref_url:"gasmtrdepository",
        ref_col:"depositoryId",
        ref_display:"depositoryname"
    });

    factoryHelper = RefHelper.create({
        ref_url:'gasmtrfactory',
        ref_col:'factoryId',
        ref_display:'name'
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

    var unitidFormat = function () {
        return {
            f : function (val) {
                return unitidHelper.getDisplay(val);
            }
        }
    }();

    var parentidFormat = function () {
        return {
            f : function (val) {
                if(val == 0){
                    return "";
                }
                return parentidHelper.getDisplay(val);
            }
        }
    }();

    var operatorFormat = function () {
        return {
            f : function (val,row) {
                return '<a id="operator" onclick=operatorFunction(\'' + row.depositoryId + '\')>盘点</a>';
            }
        }
    }();


    return {

        init : function () {
            this.initHelper();
            this.reload();
        },

        initHelper : function () {
            $.map(unitidHelper.getData(), function (value, key) {
                $('#find_unitid').append('<option value="' + key + '">' + value + '</option>');
            });

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
                    checkboxes: false,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrdepository',
                    key_column:'depositoryId',
                    coldefs:[
                        {
                            col:"depositoryId",
                            friendly:"仓库编号",
                            nonedit:"nosend",
                            sorting:false,
                            unique:"true",
                            index:1
                        },
                        {
                            col:"depositoryname",
                            friendly:"仓库名称",
                            sorting:false,
                            index:2
                        },
                        {
                            col:"poscode",
                            friendly:"仓库位置",
                            sorting:false,
                            index:3
                        },
                        {
                            col:"unitid",
                            friendly:"所属单位",
                            sorting:false,
                            format:unitidFormat,
                            inputsource: "select",
                            ref_url:  "gassysunit",
                            ref_name: "unitname",
                            ref_value: "unitId",
                            index:5
                        },
                        {
                            col:"funcLevel",
                            friendly:"仓库级别",
                            format:depoLevelFormat,
                            inputsource:"select",
                            ref_url:"enumctrl/4s/depoLevelEnum",
                            ref_name:"enumName",
                            ref_value:"enumVal",
                            sorting:false,
                            index:6
                        },
                        {
                            col:"parentid",
                            friendly:"上级仓库",
                            inputsource: "select",
                            format:parentidFormat,
                            ref_url:  "gasmtrdepository",
                            ref_name: "depositoryname",
                            ref_value: "depositoryId",
                            sorting:false,
                            index:7
                        },
                        {
                            col:"lockflag",
                            friendly:"锁定标志",
                            format:lockflagFormat,
                            nonedit:"nosend",
                            sorting:false,
                            index:8
                        },
                        {
                            col:"operator",
                            friendly:"操作",
                            nonedit:"nosend",
                            format:operatorFormat,
                            sorting:false,
                            index:9
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function
                        var find_unitid = undefined;
                        if($('#find_unitid').val()){
                            find_unitid = RQLBuilder.equal("unitid",$('#find_unitid').val());
                        }

                        var find_depositoryname = undefined;
                        if($('#find_depositoryname').val()){
                            find_depositoryname = RQLBuilder.like("depositoryname",$('#find_depositoryname').val());
                        }

                        var filter = RQLBuilder.and([
                            find_unitid,find_depositoryname
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

$('.remove_line').click(function () {
    alert("remove a line !!!");
    $(this).parent().parent().remove();
});

function removeLine() {
    alert($(this).parent().html())
    $(this).parent().parent().remove();
}

function operatorFunction(depositoryId) {
    var diag = bootbox.dialog({
        message:
        '<form id="mtrcheckstock" class="form-group">' +
            '<div class="row">' +
                '<div class="col-md-6 form-group">' +
                    '<div class="btn-group input-group">' +
                        '<div class="input-group-addon">开始日期:</div>' +
                        '<input type="date" name="begindate" pattern="yyyy/mm/dd">' +
                        '<span class="inputclear glyphicon glyphicon-remove-circle hide" ></span> ' +
                    '</div> ' +
                '</div>' +
                '<div class="col-md-6 form-group">' +
                    '<div class="btn-group input-group">' +
                        '<div class="input-group-addon">结束日期:</div>' +
                        '<input type="date" name="enddate">' +
                        '<span class="inputclear glyphicon glyphicon-remove-circle hide" ></span> ' +
                    '</div> ' +
                '</div>' +
            '</div>' +
            '<table id="invintory_check_table" class="watable table table-spriped table-hover table-bordered table-condensed">' +
                '<thead>' +
                    '<th></th>'+
                    '<th>物品种类</th>'+
                    '<th>规格型号</th>'+
                '</thead>'+
                '<tbody id="breakuptable">'+
                    '<tr>' +
                        '<input class="hidden" name="depositoryId" value="' + depositoryId + '"><input class="hidden" name="length" value="' + tableLength + '">' +
                        '<td></td>' +
                        '<td>' +
                            '<select name="reskind[]" class="form-control input-middle select2me" data-placeholder="物品种类...">' +
                                '<option value="">全部</option>' +
                            '</select>' +
                        '</td>' +
                        '<td>' +
                            '<select name="meterspec[]" class="form-control input-middle select2me" data-placeholder="规格型号...">' +
                                '<option value="">全部</option>' +
                            '</select>' +
                        '</td>' +
                    '</tr>' +
                '</tbody>' +
                '<tfoot>' +
                    '<tr>'+
                        '<td colspan="5"><img onclick="addLevel()" id="add_btn" class="img-responsive center-block" src="assets/global/img/add.png" style="width: 32px;height: 32px"></td>'+
                    '</tr>' +
                '</tfoot>' +
            '</table>' +
        '</form>',
        title:"添加盘点计划",
        buttons:{
            success:{
                label:"保存",
                class:"btn btn-primary",
                callback:function () {
                    getTableLength();
                    $.ajax({
                        headers:{
                            'Accept':'application/json',
                            'Content-Type':'application/json'
                        },
                        url:hzq_rest + 'gasmtrcheckstock',
                        dataType:'json',
                        type:'POST',
                        data:$.toJSON($('#mtrcheckstock').serializeObject()),
                        async:false
                    })
                        .done(function (data) {
                            console.log('the return data is : ' + data);
                            bootbox.alert('<br><center><h4>添加成功!!</h4></center><br>')

                            inventory_check_select_depositoryAction.reload();//页面刷新查看效果
                        })
                        .error(function () {
                            bootbox.alert('<br><center><h4>添加失败!!</h4></center><br>')
                        })

                }

            },
            danger:{
                label:"取消",
                class:"btn btn-default",
                callback:function () {}
            }
        }
    },{show:false});
    diag.show();

    $.map(reskindIdHelper.getData(), function (value, key) {
        $('select[name="reskind[]"]').append('<option value="' + key + '">' + value + '</option>');
    });

    $.map(meterspecIdHelper.getData(),function (value, key) {
        $('select[name="meterspec[]"').append('<option value="' + key + '">' + value + '</option>');
    })

    getTableLength();

};

function addLevel() {
    $('#breakuptable').append('' +
        '<tr>' +
            '<td><i id="remove_line" onclick="removeLine()" class="remove_event glyphicon glyphicon-minus"></i></td>' +
            '<td>' +
                '<select name="reskind[]" class="form-control input-middle select2me" data-placeholder="物品种类...">' +
                    '<option value="">全部</option>' +
                '</select>' +
            '</td>' +
            '<td>' +
                '<select name="meterspec[]" class="form-control input-middle select2me" data-placeholder="规格型号...">' +
                    '<option value="">全部</option>' +
                '</select>' +
            '</td>' +
        '</tr>');

    $.map(reskindIdHelper.getData(), function (value, key) {
        $('select[name="reskind[]"]').append('<option value="' + key + '">' + value + '</option>');
    });

    $.map(meterspecIdHelper.getData(),function (value, key) {
        $('select[name="meterspec[]"').append('<option value="' + key + '">' + value + '</option>');
    });

    getTableLength();
}

function getTableLength() {
    tableLength = document.getElementById("invintory_check_table").rows.length - 2;//去掉 thead and tfoot
}
