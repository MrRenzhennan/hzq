/**
 * Created by alex on 2017/5/21.
 */
/**
 * Created by jack on 3/16/17.
 */

ComponentsPickers.init();
SideBar.init();
SideBar.activeCurByPage("contract_noninhabitant.html");

var contractId = Metronic.getURLParameter("refno");

$('.file-loading').fileinput({
    language: 'zh'
});

//
// $("#cont").on("blur",function(){
//     console.log($(this).val())
//     var resultq = Restful.findNQ( hzq_rest +'gasctmcontract/?query={"contractNo":"'+$(this).val()+'"}');
//     console.log(resultq);
//     if(resultq.length>1){
//         bootbox.alert("<center><h4>该合同编号已经存在，请更换合同编号。</h4></center>");
//         $("#save_btn").attr("disabled","disabled")
//     }else{
//
//         $("#save_btn").attr("disabled",false)
//
//     }
// })

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
var picturess = false;
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
                picturess = true;
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
if(results.gasType){
    $("#gasType").val(results.gasType.split(',')).trigger("change")
}


if(results.activityInstanceId){
    var yijian = Restful.findNQ(hzq_rest + "psmstepinst/"+results.activityInstanceId);
    console.log(yijian.propstr256)
    $("#opinion_msg").html(yijian.propstr256);

}
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

            console.log("ssdsds"+JSON.stringify(data));
        },
        error: function (data) {
            bootbox.alert(data);

        }

    });

}

var state =true;

    $('.file-loading').fileinput({
        language: 'zh'
    })

    $('#add_btn').on("click",addhang);
    function addhang() {
        console.log(state)
        if(state){
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
        }else {
            return false;
        }
    }

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
        return date;
    }else{
        return "";
    }

}


console.log(results)
if((results.contractState == "9" && results.reservedField1 == "1") || (results.contractState == "6" && results.reservedField1 == "4") || (results.contractState == "9" && results.reservedField1 == "3")){

    var queryCondion = RQLBuilder.and([
        RQLBuilder.equal("contractId",results.contractId),
        RQLBuilder.equal("status","1")
    ]).rql()

console.log(results.contractId)
    var metercontract = Restful.findNQ(hzq_rest + 'gasctmcontractmeter/?query=' + queryCondion)
    console.log(metercontract)
    if(metercontract.length){
        var str = "";
        $.each(metercontract,function(index,item){
            var meterinfo = Restful.findNQ(hzq_rest + 'gasmtrmeter/?query={"meterNo":"'+item.meterCode+'"}')
            console.log(meterinfo);
            if(meterinfo.length){
                str+="<tr>" +
                    "<td width='15px' class='remove_item'></td>" +
                    "<td><input type=\"text\" name=\"meterNo\" class=\"form-control meternumber\" placeholder=\"表编号\" value='"+item.meterCode+"'></td>"+
                    "<td><input type=\"text\" name=\"meterModelId\" class=\"form-control\" placeholder=\"型号\" readonly value='"+metermodel.getDisplay(meterinfo[0].meterModelId)+"'></td>"+
                    "<td><input type=\"text\" name=\"meterTypeId\" class=\"form-control\" placeholder=\"类型\" readonly value='"+metertype.getDisplay(meterinfo[0].meterTypeId)+"'></td>"+
                    "<td><input type=\"text\" name=\"factoryId\" class=\"form-control\" placeholder=\"厂家\" readonly value='"+factory.getDisplay(meterinfo[0].factoryId)+"' ></td>"+
                    "<td><input type=\"text\" name=\"productionDate\" class=\"form-control\" placeholder=\"出厂时间\" readonly value='"+dateForat(meterinfo[0].productionDate)+"'  ></td>" +
                    "</tr>";
            }

        })
        $("#tbody").html(str);
        $("#add_btn").hide();
    }

    $("#add_btn").hide();
}

//表具信息
var meterarr = [];
$(document).on("blur",".meternumber",function(){
    meterinfomation($(this).val(),$(this));
})


function meterinfomation(meterNo,that){
    console.log($(that).parents("tr"))
    $.ajax({
        type: 'get',
        url: hzq_rest + "gasmtrmeter/?query={\"meterNo\":\""+meterNo+"\"}",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(data) {
            console.log(data)
            if(data.length){
                meterarr = [];
                $.each(data[0],function(key,val){
                    if(key == "meterModelId"){
                        $(that).closest("tr").find("input[name='"+key+"']").val(metermodel.getDisplay(val));
                    }else if(key == "meterTypeId"){
                        $(that).closest("tr").find("input[name='"+key+"']").val(metertype.getDisplay(val));
                    }else if(key == "factoryId"){
                        $(that).closest("tr").find("input[name='"+key+"']").val(factory.getDisplay(val));
                    }else if(key == "productionDate"){
                        $(that).closest("tr").find("input[name='"+key+"']").val(dateForat(val))
                    }
                })
                var resultqs = Restful.findNQ( hzq_rest +'gasctmcontractmeter/?query={"meterCode":"'+meterNo+'"}');
                console.log(resultqs);
                if(resultqs.length>0){
                    bootbox.alert("<center><h4>该表已有对应合同。</h4></center>");
                    $("#save_btn").attr("disabled",true)
                    $("#add_btn").hide();
                }else{
                    $("#save_btn").attr("disabled",false)
                    $("#add_btn").show();
                }

                //$("#save_btn").attr("disabled",false);
                state= true;
            }else if(meterNo){

                // meterarr = [];
                // meterarr.push(meterNo);
                bootbox.alert("<center><h4>表编号为"+meterNo+"的表不存在，请先录入此表的表具信息。</h4></center>");
                $("#save_btn").attr("disabled",true);
                state = false;
            }
        },
        error: function(err) {

        }
    });

}


//图片上传
var busiId1=gpyphoto;
$(document).on("click",'.fileinput-upload-button', function (e) {
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
                picturess = true;
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


// 保存提交流程
$("#save_btn").on("click",function(e){

    // console.log($("#gasType").val())
    $("#form select").on("change",function(){
        $("#form").valid();
    })
    $("#form input").on("change",function(){
        $("#form").valid();
    })

    if(!$("#contractRenew").val()){
        bootbox.alert("<center><h4>请选择是否是线下续签。</h4></center>")
        return false;
    }
    if(!$("#form").valid()){
        return;
    }

    var form = $('#form').serializeObject();
        form["gasType"]=$("#gasType").val().join();
        console.log(form)
    console.log(results.reservedField2)
    console.log(picturess)

    if(picturess && results.reservedField2){
        form["reservedField2"] =results.reservedField2+ ","+busiId1;
    }else if(results.reservedField2 && !picturess){
        form["reservedField2"] =results.reservedField2;
    }else if(!results.reservedField2 && picturess){
        form["reservedField2"] =busiId1;
    }else{
        form["reservedField2"] = "";
    }

    form["modifiedTime"] = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    form["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
    console.log(form["reservedField2"]);
    var meterNo=[];
    $("#tbody .meternumber").each(function(index){
        meterNo.push($("#tbody .meternumber").eq(index).val())
    })
    console.log(meterNo.length);

    if(meterNo[0]== ""){
        bootbox.alert("<center><h4>请输入表编号。</h4></center>");
        return false;
    }
    var s = meterNo.join(",")+",";

    for(var i=0;i<meterNo.length;i++) {
        if(s.replace(meterNo[i]+",","").indexOf(meterNo[i]+",")>-1) {
            bootbox.alert("<center><h4>表编号有重复。</h4></center>");
            return false;
        }
    }
    var Num="";
    for(var i=0;i<6;i++){
        Num+=Math.floor(Math.random()*10);
    };
    var str= $("#useGasPerson").val()+"(合同编号:"+$("#contractNo").val()+") — 预签";

    if(form["reservedField2"].split(',')[1] || $("#supplyGas").val()){
        str = $("#useGas").val()+"(合同编号:"+$("#cont").val()+") — 新签";
    }
    if(results.contractType == "2" && $("#supplyGas").val()){
        str = $("#useGas").val()+"(合同编号:"+$("#cont").val()+") — 增容新签";
        form["contractType"] = "2";
    }
    if(results.contractType == "3" && $("#supplyGas").val()){
        str = $("#useGas").val()+"(合同编号:"+$("#cont").val()+") — 减容新签";
        form["contractType"] = "3";
    }
    if(results.contractType == "6" && $("#supplyGas").val()){
        str = $("#useGas").val()+"(合同编号:"+$("#cont").val()+") — 续签";
    }

    flowjson = {
        "flow_def_id":"FJMHT",
        "ref_no":contractId +Num,
        "be_orgs":JSON.parse(localStorage.getItem("user_info")).area_id,
        "operator":JSON.parse(localStorage.getItem("user_info")).userId,
        "flow_inst_id":contractId  +Num,
        "propstr2048":JSON.stringify(form)+"="+JSON.stringify(meterNo),
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":str,
        "propstr256":$("#opinion_msg").html(),
        "propstr128":"营业部合同管理员",
        "override_exists":false
    };

    var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
    console.log(flow_result);
    if(flow_result.retmsg == "SUCCESS:1"){
        bootbox.alert("<center><h4>提交成功。</h4></center>",function(){
            if($("#supplyGas").val()){
                var contractresult = Restful.updateRNQ(hzq_rest + "gasctmcontract",contractId,{"reservedField1":"2"})
                console.log(contractresult)
            }
            history.go("-1");
        });
    }
})

