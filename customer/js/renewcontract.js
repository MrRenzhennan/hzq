/**
 * Created by alex on 2017/5/21.
 */
/**
 * Created by jack on 3/16/17.
 */

ComponentsPickers.init();
SideBar.init();
SideBar.activeCurByPage("contract_noninhabitant.html");

var href = document.location.href;
var contractId = href.substring(href.indexOf("?")+1, href.lenth);
console.log(contractId);

$('.file-loading').fileinput({
    language: 'zh'
});


var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/" + '?query={"parentTypeId":"3"}"',
    ref_col: "gasTypeId",
    ref_display: "gasTypeName"
});
$.map(gasTypeHelper.getData(), function (value, key) {
    $('#gasType').append('<option value="' + key + '">' + value + '</option>');
});
/*
 function gasTypeAction() {

 return {
 init: function () {
 this.initHelper();

 },
 initHelper: function () {

 }
 }
 }();*/
var gpyphoto = $.md5(JSON.stringify(document.getElementById('form'))+Math.random()+ new Date().getTime())
var base64 = [];
var picturepath = [];
var picstate = false;
var gridGallery = new CBPGridGallery(document.getElementById('grid-gallerys'));
$("#gpypz").on("click",function(){
    $.ajax({
        url:'http://127.0.0.1:9000/?data={"cmdheader":{"cmdtype":"21"}}',
        type:"get",
        jsonp: "callfuncname",
        dataType: "JSONP",
        async: false,
        success:function(data){
            console.log(data);
            if(data.result.resultcode =="0"){
                base64.push("data:image/jpeg;base64,"+data.result.base64);
                picturepath.push(data.result.filename.substring((data.result.filename.lastIndexOf("/")+1),data.result.filename.length));
                $("#grids").append("<li><figure><img src='http://127.0.0.1:9000/getfile?data="+data.result.filename+"' alt='"+data.result.filename+"'/></figure><i class='removePhoto fa fa-times-circle'></i></li>");
                $("#slideIds").append("<li><figure><img src='http://127.0.0.1:9000/getfile?data="+data.result.filename+"' alt='"+data.result.filename+"'/></figure></li>");
                picstate = true;
                gridGallery._init();
            }

            console.log(picturepath)
        }
    })

});
$(document).on("click",".removePhoto",function(e){
    gridGallery._closeSlideshow();
    console.log(0)
    var index = $(this).closest("li").index()
    $(this).closest("li").remove();
    $("#slideId li").eq(index).remove();
    picturepath.del(index);
    base64.del(index);
    console.log("--------------------");
    console.log(picturepath);
    gridGallery._init();
});
Array.prototype.del=function(index){
    if(isNaN(index)||index>=this.length){
        return false;
    }
    for(var i=0,n=0;i<this.length;i++){
        if(this[i]!=this[index]){
            this[n++]=this[i];
        }
    }
    this.length-=1;
};


console.log("===================")
console.log(picturepath)
$("#uploadpic").on("click",function(){
    var form = new FormData();
    // console.log(picturepath)
    // console.log(base64)
    for(var i=0;i<picturepath.length;i++){
        form.append("img"+i,convertImgDataToBlob(base64[i]),picturepath[i]);
    }
    console.log(form.get("img0"));
    $.ajax({
        url: "/hzqs/sys/upload.do?busiId="+gpyphoto,
        data: form,
        dataType: 'text',
        processData: false,
        contentType: false,
        async: false,
        type: 'POST',
        success: function (data) {
            console.log(data);

            if (JSON.parse(data).length != 0) {
                bootbox.alert('导入成功！');
            } else {
                bootbox.alert("导入失败！");
            }
        },
        error: function (data) {
            bootbox.alert(data);
            if(arguments[0].status == '413'){
                bootbox.alert("文件不能超过1M");
            }
        }

    });

})

var convertImgDataToBlob = function (base64Data) {
    var format = "image/jpeg";
    var base64 = base64Data;
    var code = window.atob(base64.split(",")[1]);
    var aBuffer = new window.ArrayBuffer(code.length);
    var uBuffer = new window.Uint8Array(aBuffer);
    for(var i = 0; i < code.length; i++){
        uBuffer[i] = code.charCodeAt(i) & 0xff ;
    }
    console.info([aBuffer]);
    console.info(uBuffer);
    console.info(uBuffer.buffer);
    console.info(uBuffer.buffer==aBuffer); //true

    var blob=null;
    try{
        blob = new Blob([uBuffer], {type : format});
    }
    catch(e){
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if(e.name == 'TypeError' && window.BlobBuilder){
            var bb = new window.BlobBuilder();
            bb.append(uBuffer.buffer);
            blob = bb.getBlob("image/jpeg");

        }
        else if(e.name == "InvalidStateError"){
            blob = new Blob([aBuffer], {type : format});
        }
        else{

        }
    }
    console.log(blob)
    return blob;

};




var results = Restful.findNQ(hzq_rest + "gasctmcontract/"+contractId);
console.log(results)
$.each(results,function (key, val) {
    $("input[name='"+key+"']").val(val).trigger("change");
    $("select[name='"+key+"']").val(val).trigger("change");
})
var picpath;
if(results.reservedField2){
    picpath = results.reservedField2.split(",");console.log(picpath)
    $.each(picpath,function(index){
        pic(picpath[index]);
    });


}


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
        },
        error: function (data) {
            bootbox.alert(data);

        }

    });

}

$(function () {
    $('.file-loading').fileinput({
        language: 'zh'
    })
    //表格加行
    $('#add_btn').click(function () {
        var item = "" +
            "<tr>" +
            "<td width='15px' class='remove_item'><span class='glyphicon glyphicon-remove'></span></td>" +
            "<td><input type=\"text\" name=\"meterNo\" class=\"form-control meternumber\" placeholder=\"表编号\"></td>"+
            "<td><input type=\"text\" name=\"meterModelId\" class=\"form-control\" placeholder=\"型号\" readonly></td>"+
            "<td><input type=\"text\" name=\"meterTypeId\" class=\"form-control\" placeholder=\"类型\" readonly></td>"+
            "<td><input type=\"text\" name=\"factoryId\" class=\"form-control\" placeholder=\"厂家\" readonly></td>"+
            "<td><input type=\"text\" name=\"productionDate\" class=\"form-control\" placeholder=\"出厂时间\" readonly></td>" +
            "</tr>";
        $('#tbody').append(item);
        $('.remove_item').click(function () {
            $(this).parent().remove();
        });

    });
});

var metermodel = RefHelper.create({
    ref_url: "gasmtrmeterspec",
    ref_col: "meterModelId",
    ref_display: "meterModelName",
})
var metertype = RefHelper.create({
    ref_url: "gasmtrmetertype",
    ref_col: "meterTypeId",
    ref_display: "meterTypeName",
})
var factory = RefHelper.create({
    ref_url: "gasmtrfactory",
    ref_col: "factoryId",
    ref_display: "factoryName",
})
var dateForat = function(val){

    if(val){
        date = val.split("T")[0];
    }
    return date;
}


//表具信息
var meterresults =  Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query={"contractId":"'+contractId+'"}');
console.log(meterresults)
var meterNo = [];
$.each(meterresults,function(index,item){
    meterNo.push(item.meterCode);
});
console.log(meterNo)
mererinfo(meterNo)

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



//图片上传
var busiId1= gpyphoto;
$(document).on("click", '.fileinput-upload-button', function (e) {
    e.preventDefault();
    var form = new FormData(document.getElementById('form'));
    $.ajax({
        url: "/hzqs/sys/upload.do?busiId="+busiId1,
        data: form,
        dataType: 'text',
        processData: false,
        contentType: false,
        async: false,
        type: 'POST',
        success: function (data) {
            console.log(JSON.stringify(data));
            console.log(JSON.parse(data));
            if (JSON.parse(data).length != 0) {
                bootbox.alert('导入成功！');
                picstate = true;
            } else {
                bootbox.alert("导入失败！");
            }
        },
        error: function (data) {
            console.log(data);
            if(data.status == '413'){
                bootbox.alert("文件不能超过1M");
            }
            $("#fileId").val('');
        }
    });
});


$("#save_btn").on("click",function(){
    var form = $('#form').serializeObject();
    var contractId = $.md5(form + new Date().getTime());
    if(picstate){
        form["reservedField2"] =gpyphoto;
    }
    form["gasType"]=$("#gasType").val().join();
    form["contractId"] = contractId;
    form["areaId"] = results.areaId;
    form["gasKind"] = results.gasKind;
    form["contractState"] = "6";
    if(form["contractNo"] == results.contractNo){
        bootbox.alert("请更换合同编号。")
        return false;
    }
    var contractmeter=[];
    $.each(meterresults,function(index,item){
        item["status"] ="3";
        contractmeter.push(JSON.stringify(item));
    })
    var newcontractmeter=[];
     $.each(meterresults,function(index,item){
         item["cntMtrId"]= $.md5(form + Math.random() + new Date().getTime());
         item["contractId"] =contractId;
         item["status"] ="2";
         newcontractmeter.push(JSON.stringify(item));
    })
    for(var i=0;i<newcontractmeter.length;i++){
        newcontractmeter[i] = JSON.parse(newcontractmeter[i]);
        contractmeter[i] = JSON.parse(contractmeter[i]);
    }
console.log(meterresults)
console.log(contractmeter)
// console.log(newcontractmeter)

    var Num="";
    for(var i=0;i<6;i++){
        Num+=Math.floor(Math.random()*10);
    };
    var meterNo=[];
    $("#divtable tbody tr").each(function(index){
        meterNo.push($("#divtable tbody tr").eq(index).find("td").eq(0).html())
    })
    console.log(meterNo);

    flowjson = {
        "flow_def_id":"FJMHT",
        "ref_no":contractId +Num,
        "be_orgs":JSON.parse(localStorage.getItem("user_info")).area_id,
        "operator":JSON.parse(localStorage.getItem("user_info")).userId,
        "flow_inst_id":contractId  +Num,
        "propstr2048":JSON.stringify(form)+"="+JSON.stringify(meterNo),
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":$("#useGasPerson").val()+"(合同编号:"+$("#contractNo").val()+") — 续签",
        "propstr128":"营业部合同管理员",

        "override_exists":false
    };


    results["status"] ="2";
    results["reservedField1"] ="9";
    var submitJson = {"sets":[
        {"txid":"1","body":contractmeter,"path":"/gasctmcontractmeter/","method":"PUT"},
        {"txid":"2","body":newcontractmeter,"path":"/gasctmcontractmeter/","method":"post"},
        {"txid":"3","body":form,"path":"/gasctmcontract/","method":"post"},
        {"txid":"4","body":results,"path":"/gasctmcontract/","method":"put"}
    ]}
    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)
    console.log(result)

    var retFlag=true;

    if(result.success&&result.success==false){
        retFlag=false;
    }else{
        for(var i=0;i<result.results.length;i++){
            if(!result.results[i].result.success){
                retFlag=false;
                break;
            }
        }
    }


    if(retFlag){
        var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
        console.log(flow_result);
        if(flow_result.retmsg == "SUCCESS:1"){
            bootbox.alert("<center><h4>提交成功。</h4></center>",function(){
                window.location.href = 'customer/contract_noninhabitant.html';
            });

        }else{
            bootbox.alert("<center><h4>提交失败。</h4></center>");
            contractmeter;
            results["status"] ="1";
            results["reservedField1"] ="";
            var submitJson = {"sets":[
                {"txid":"1","body":meterresults,"path":"/gasctmcontractmeter/","method":"PUT"},
                {"txid":"2","body":newcontractmeter,"path":"/gasctmcontractmeter/","method":"delete"},
                {"txid":"3","body":form,"path":"/gasctmcontract/","method":"delete"},
                {"txid":"4","body":results,"path":"/gasctmcontract/","method":"put"}
            ]}
            var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)
        }
    }else{
        bootbox.alert("<center><h4>提交失败。</h4></center>");
    }




})


/*

// 保存提交流程
$("#save_btn").on("click",function(){

    var form = $('#form').serializeObject();
    form["reservedField2"] =results.reservedField2+ ","+busiId1;
    var result = Restful.updateRNQ(hzq_rest + "gasctmcontract",results.contractId,form)
    console.log(result);
    if(meterarr.length){
        bootbox.alert("<center><h4>表编号为"+meterarr.join()+"的表不存在。</h4></center>");
        return false;
    }
    $("#tbody .meternumber").each(function(index){
        var contractMeter = {};
        contractMeter["meterCode"] = $("#tbody .meternumber").eq(index).val();
        contractMeter["contractId"] = results.contractId;
        console.log(contractMeter);
        var result = Restful.postDataR(hzq_rest + "gasctmcontractmeter",JSON.stringify(contractMeter));
        console.log(result);
    })

    var Num="";
    for(var i=0;i<6;i++){
        Num+=Math.floor(Math.random()*10);
    };
    flowjson = {
        "flow_def_id":"FJMHT",
        "ref_no":contractId +Num,
        "be_orgs":JSON.parse(localStorage.getItem("user_info")).area_id,
        "operator":JSON.parse(localStorage.getItem("user_info")).userId,
        "flow_inst_id":contractId  +Num,
        "propstr2048":{"cusotmer":"BATCH","busitype":"非居民合同审批","contractId":contractId},
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":"非居民合同",
        "propstr128":"营业部合同管理员",
        "override_exists":false
    };

    var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
    console.log(flow_result);
    if(flow_result.retmsg == "SUCCESS:1"){
        bootbox.alert("<center><h4>提交成功。</h4></center>");
    }

})
*/
