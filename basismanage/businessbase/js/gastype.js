

var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/?query={\"parentTypeId\":\"1\"}",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
$.map(gasTypeHelper.getData(), function (value, key) {
    console.log(key)
    $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
});
$("#find_gasTypeId").on("change",function(){
    console.log($(this).val())
    $('#find_gasTypeId1').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
        $('#find_gasTypeId1').append('<option value="' + key + '">' + value + '</option>');
    });
});
$("#find_gasTypeId1").on("change",function(){
    console.log($(this).val())
    $('#find_gasTypeId2').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
        $('#find_gasTypeId2').append('<option value="' + key + '">' + value + '</option>');
    });
});


var GasTypeAction = function () {
    // 上级用气性质helper
    var GaspropertiesHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName"
    });
    var GaspropertiesFormat = function () {
        return {
            f: function (val) {
                return GaspropertiesHelper.getDisplay(val);
            }
        }
    }();
    return {

        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable').html('')

            this.xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasbizgastype/?sort=gasTypeId',
                    key_column: 'gasTypeId',
                    coldefs: [
                        {
                            col: "gasTypeId",
                            friendly: "用气性质Id",
                            unique: true,
                            hidden: true,
                            readonly: "readonly",
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "parentTypeId",
                            friendly: "上级用气性质Id",
                            validate:"required",
                            format:GaspropertiesFormat,
                            inputsource: "select",
                            ref_url:  "gasbizgastype",
                            ref_name: "gasTypeName",
                            ref_value: "gasTypeId",
                            index: 3
                        },
                        {
                            col: "posCode",
                            friendly: "位置码",
                            validate:"required",
                            index: 4
                        },
                        {
                            col: "gasTypeCode",
                            friendly: "用气性质代码",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "gasTypeName",
                            friendly: "用气性质名称",
                            validate:"required",
                            // format:yandNEnum,
                            index: 1
                        },
                       /* {
                            col: "chargeMode",
                            friendly: "计费方式",
                            validate:"required",
                            index: 5
                        },*/
                        {
                            col: "status",
                            friendly: "状态",
                            format:GasSysBasic.StatusFormat,
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index: 6
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var  find_unitname;
                        //用气性质代码

                        if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            console.log($('#find_gasTypeId').val())
                            find_unitname=RQLBuilder.rlike("gasTypeId",$.trim($('#find_gasTypeId').val()));
                        }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val() ){
                            console.log($('#find_gasTypeId1').val())
                            find_unitname=RQLBuilder.rlike("gasTypeId",$.trim($('#find_gasTypeId1').val()));
                        }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val()  && $('#find_gasTypeId2').val() ){
                            console.log($('#find_gasTypeId2').val())
                            find_unitname=RQLBuilder.equal("gasTypeId",$.trim($('#find_gasTypeId2').val()));
                        }



                      /*  if($('#find_unitname').val())
                        {
                            find_unitname=RQLBuilder.like("gasTypeCode",$.trim($('#find_unitname').val()));
                        }

                        var  find_Code;
                        //用气名称查询
                        if($('#find_Code').val())
                        {
                            find_Code=RQLBuilder.like("gasTypeName",$.trim($('#find_Code').val()));
                        }*/
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
                }
            )
        }

    }
}();

/*

var GaspropertiesHelper = RefHelper.create({
    ref_url: "gasbizgastype",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName"
});

function parenttype(val){
    return GaspropertiesHelper.getDisplay(val);
}
function statusformat(val){

    if(val == "1"){
        return "启用";
    }else if(val == "2"){
        return "停用";
    }else if(val == "3"){
        return "已删除";
    }

}

var menutree = [];

$("#find_button").on('click',function(){
    menutree = [];


    var find_unitname;
    var parentId;
    if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
        console.log($('#find_gasTypeId').val())
        find_unitname=$('#find_gasTypeId').val();
        parentId = 1;
    }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val() ){
        console.log($('#find_gasTypeId1').val())
        find_unitname=$('#find_gasTypeId1').val();
        parentId = $('#find_gasTypeId').val();
    }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val()  && $('#find_gasTypeId2').val() ){
        console.log($('#find_gasTypeId2').val())
        find_unitname=$('#find_gasTypeId2').val();
        parentId = $('#find_gasTypeId1').val();
    }else{
        find_unitname="";
        parentId = 1;
    }
    console.log(find_unitname)
    // console.log(Restful.findNQ(hzq_rest+"gasbizgastype/?query="+find_unitname))
    var queryCondion = RQLBuilder.and([
        RQLBuilder.rlike("gasTypeId",find_unitname),
    ]).rql()
    console.log(queryCondion);
    $.ajax({
        type: 'get',
        url: hzq_rest+"gasbizgastype/?query="+queryCondion,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            jsonData = data;
            console.log(data)

            jsontree(data,parentId)
        },
        error: function(err) {
            // alert("find all err");
        }
    });

})
var result = Restful.findNQ(hzq_rest+"gasbizgastype");
console.log(result)

jsontree(result,1);
function jsontree(result,parentId){
    console.log(result)
    $.each(result,function(index,item){
        if(item["parentTypeId"] == parentId){
            item["children"]=[];
            item["parentTypeId"]= parenttype(item["parentTypeId"]);
            item["status"]= statusformat(item["status"]);
            menutree.push(item);
        }
    });

//二级菜单
    $.each(menutree,function(index,item){
        $.each(result,function(inde,ite){
            if(ite["parentTypeId"] == item["gasTypeId"]){
                ite["children"] = [];
                ite["parentTypeId"]= parenttype(ite["parentTypeId"]);
                ite["status"]= statusformat(ite["status"]);
                item["children"].push(ite);
            }
        })
    });
//三级菜单
    $.each(menutree,function(index,item){
        $.each(item["children"],function(inde,ite){
            $.each(result,function(ind,it){
                if(it["parentTypeId"] == ite["gasTypeId"]){
                    it["parentTypeId"]= parenttype(it["parentTypeId"]);
                    it["status"]= statusformat(it["status"]);
                    ite.children.push(it);
                }

            })
        })
    });


    tree(menutree);
}

console.log(menutree)
// console.log(JSON.stringify(menutree));


function tree(menutree){
    $("#div1").html("");
    var config = {
        id: "tg1",
        width: "auto",
        renderTo: "div1",
        headerAlign: "left",
        headerHeight: "30",
        dataAlign: "left",
        indentation: "20",
        folderOpenIcon: "basismanage/image/folderClose.gif",
        folderCloseIcon: "basismanage/image/folderOpen.gif",
        defaultLeafIcon: "basismanage/image/folderClose.gif",
        hoverRowBackground: "false",
        folderColumnIndex: "0",
        // itemClick: "itemClickEvent",
        columns: [
            {
                dataField: "gasTypeName",
                headerText: "用气性质",
                headerAlign: "left",
            },
            {
                headerAlign: "left",
                dataField: "parentTypeId",
                headerText: "上级用气性质",
                hidden: false,

            },
            {
                headerAlign: "left",
                dataField: "status",
                headerText: "状态",
                hidden: false,

            },
           ],
        data: menutree

    };
    var treeGrid = new TreeGrid(config);
    treeGrid.show()
}

*/
