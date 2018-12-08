/**
 * Created by Administrator on 2017/6/5 0005.
 */
SideBar.init();

$('#form input,textarea,select').attr("disabled", "disabled");

SideBar.activeCurByPage("query_noncontract.html");

var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/" + '?query={"parentTypeId":"3"}"',
    ref_col: "gasTypeId",
    ref_display: "gasTypeName"
});
$.map(gasTypeHelper.getData(), function (value, key) {
    $('#gasType').append('<option value="' + key + '">' + value + '</option>');
});
var href = document.location.href;
var refnumber = Metronic.getURLParameter("refno");
var contractmeter = Metronic.getURLParameter("refno");
var contractId = Metronic.getURLParameter("refno");

console.log(contractId);
$('.contractId').val(contractId);

var results = Restful.findNQ(hzq_rest + "gasctmcontract/"+contractId);
console.log(results)
    if(results.contractState == "0"){
        $(".contract").hide()
    }
    $.each(results,function (key, val) {
        $("input[name='"+key+"']").val(val).trigger("change");
        $("select[name='"+key+"']").val(val).trigger("change");
    })
    if(results.reservedField2){
        var picpath = results.reservedField2.split(",");
        console.log(picpath)
        $.each(picpath,function(index){
            pic(picpath[index]);
        });
    }
    var meterresults =  Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query={"contractId":"'+contractId+'"}');
    console.log(meterresults)
    var meterNo = [];
    $.each(meterresults,function(index,item){
        meterNo.push(item.meterCode);
    });
    console.log(meterNo)
    mererinfo(meterNo)


//图片
function pic(busiId){
    $.ajax({
        url: hzq_rest+"gasbasfile?fields={}&query={\"busiId\":\"" + busiId + "\"}",
        method: "get",
        async: false,
        dataType: "json",
        success: function (data) {
            if(data && data.length > 0){
                for(var i=0; i<data.length;i++){
                    var datali = data[i];
                    $("#grid").append("<li><figure><img src='/hzqs/sys/download.do?fileId="+datali.fileId+"&w=300' alt='"+datali.fileName+"'/></figure></li>")
                    $("#slideId").append("<li><figure><img src='/hzqs/sys/download.do?fileId="+datali.fileId+"' alt='"+datali.fileName+"'/></figure></li>")
                }
            }

            console.log("ssdsds"+JSON.stringify(data));
        },
        error: function (data) {
            bootbox.alert(data);

        }

    });

}

//表具信息

function mererinfo(meterNo){
    //厂家
    var factoryHelper = RefHelper.create({
        ref_url: 'gasmtrfactory',
        ref_col: 'factoryId',
        ref_display: 'factoryName'
    });
//规格型号
    var meterSpecIdHelper = RefHelper.create({
        ref_url: 'gasmtrmeterspec',
        ref_col: 'meterModelId',
        ref_display: 'meterModelName'
    });
//表具类型
    var meterTypeIdHelper = RefHelper.create({
        ref_url: 'gasmtrmetertype',
        ref_col: 'meterTypeId',
        ref_display: 'meterTypeName'
    });
//厂家
    var factoryFormat = function () {
        return {
            f: function (val) {
                return factoryHelper.getDisplay(val);
            }
        }
    }();
//规格型号
    var meterSpecIdFormat = function () {
        return {
            f: function (val) {
                return meterSpecIdHelper.getDisplay(val);
            }
        }
    }();
//表具类型
    var meterTypeIdFormat = function () {
        return {
            f: function (val) {
                return meterTypeIdHelper.getDisplay(val);
            }
        }
    }();

    var dateFormat = function () {
        return {
            f: function (val) {
                if (val) {
                    var date = val.substring(0, 10);
                    return date;
                }

            }
        }
    }();
    $("#divtable").html("");
    var queryCondion = RQLBuilder.and([
        RQLBuilder.condition_fc("meterNo","$in",JSON.stringify(meterNo)),
        // RQLBuilder.equal("clrTag","2"),
    ]).rql()
    console.log(queryCondion)
    XWATable.init({
        divname: "divtable",
        //----------------table的选项-------
        pageSize: 10,
        columnPicker: true,
        transition: 'fade',
        checkAllToggle: true,
        //----------------基本restful地址---
        // restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        restbase: 'gasmtrmeter/?query='+queryCondion,
        key_column: 'meterId',
        coldefs: [
            {
                col: "meterNo",
                friendly: "表编号",
                sorting: true,
                index: 6
            },
            {
                col: "meterTypeId",
                friendly: "表具类型",
                format: meterTypeIdFormat,
                sorting: true,
                index: 7
            },
            {
                col: "factoryId",
                friendly: "厂家",
                format: factoryFormat,
                sorting: true,
                index: 8
            },
            {
                col: "meterModelId",
                friendly: "表具规格型号",
                format: meterSpecIdFormat,
                sorting: true,
                index: 9
            },
            {
                col: "productionDate",
                friendly: "生产日期",
                format: dateFormat,
                sorting: true,
                index: 10
            },
        ]
    })
}

