/**
 * Created by Administrator on 2017/6/17 0017.
 */

var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;

var href = document.location.href;
var archiveId = href.substring(href.indexOf("?")+1, href.lenth);

console.log(archiveId.split("&"));
var ctmarchiveId = archiveId.split("&")[0];
var ctmarchiveKInd = archiveId.split("&")[1];


var archive = Restful.getByID(hzq_rest + "gasctmarchive",ctmarchiveId);
console.log(archive);
$("#customerCode").val(archive.customerCode);
$("#customerName").val(archive.customerName);
$("#customerAddress").val(archive.customerAddress);
if(ctmarchiveKInd == '1'){
    $("#form1").hide();
    // 居民基础信息
    var Resident = Restful.findNQ(hzq_rest + 'gasctmrsdtdevicearchive/?query={"ctmArchiveId":"'+ctmarchiveId+'"}');
    console.log(Resident)
    if(Resident.length){
        $.each(Resident[0],function(key,val){
            $("input[type='radio'][name='"+key+"'][value='"+val+"']").attr("checked",true);
            if(val.indexOf('T')!= '-1'){
                console.log(val.split("T"))
                $("input[type='text'][name='"+key+"']").val(val.split("T")[0]);
            }else{
                $("input[type='text'][name='"+key+"']").val(val);
            }
            $("input").attr('disabled',false)
        });
    }
}else if(ctmarchiveKInd =="9"){
    $("#form").hide();
    var Residents = Restful.findNQ(hzq_rest + 'gasctmnonrsdtdevicearchive/?query={"ctmArchiveId":"'+ctmarchiveId+'"}');
    console.log(Residents)
    if(Residents.length){
        $.each(Residents[0],function(key,val){
            $("input[type='radio'][name='"+key+"'][value='"+val+"']").attr("checked",true);
            if(val.indexOf('T')!= '-1'){
                $("input[type='text'][name='"+key+"']").val(val.split("T")[0]);
            }else{
                $("input[type='text'][name='"+key+"']").val(val);
            }
            $("input").attr('disabled',false)
        });
    }
}



$("#input_many").on("click",function(){
    if(Resident.length){
        var upform = $("#form").serializeObject();
        var restsform = Restful.updateRNQ(hzq_rest + "gasctmrsdtdevicearchive", Resident[0].meterArchiveId , upform);
        console.log(restsform);
        if(restsform.success){
            bootbox.alert("<center><h4>修改成功。</h4><center>");
        }else{
            bootbox.alert("<center><h4>修改失败。</h4></center>")
            return false;
        }
            
    }else{
        var uuid = $.md5($("#form").serializeObject() + new Date().getTime());
        var form = $("#form").serializeObject();
        form["meterArchiveId"] =uuid;
        form["ctmArchiveId"] =archive.ctmArchiveId;
        console.log(form);
        var rest = Restful.postData(hzq_rest + "gasctmrsdtdevicearchive",JSON.stringify(form));
        console.log(rest);
        if(rest){
            bootbox.alert("<center><h4>添加成功。</h4></center>",function(){
                
            });
        }else{
            bootbox.alert("<center><h4>添加失败。</h4></center");
            return false;
        }
    }
    
})
$("#input_many1").on("click",function(){
    // NONRSDT_ARCHIVE_ID
    if(Residents.length){
        var upform = $("#form1").serializeObject();
        var restsform = Restful.updateRNQ(hzq_rest + "gasctmnonrsdtdevicearchive", Residents[0].nonrsdtArchiveId , upform);
        console.log(restsform);
        if(restsform.success){
            bootbox.alert("<center><h4>修改成功。</h4><center>");
        }else{
            bootbox.alert("<center><h4>修改失败。</h4></center>")
            return false;
        }
            
    }else{
        var uuid = $.md5($("#form1").serializeObject() + new Date().getTime());
        var form = $("#form1").serializeObject();
        form["nonrsdtArchiveId"] =uuid;
        form["ctmArchiveId"] =archive.ctmArchiveId;
        console.log(form);
        var rest = Restful.postData(hzq_rest + "gasctmnonrsdtdevicearchive",JSON.stringify(form));
        console.log(rest);
        if(rest){
            bootbox.alert("<center><h4>添加成功。</h4></center>",function(){
                
            });
        }else{
            bootbox.alert("<center><h4>添加失败。</h4></center");
            return false;
        }
    }
});
sources={"0":"其他","1":"公司"}
var sourceFormat = function(){
    return{
        f:function(val){
            return sources[val]
        }
    }
}()
var sourceBuilder=function(val){
    console.log(val)
    if(val=="1"){
        return "<select id='source' name='source' class='form-control chosen-select'>" +
            "<option value='1' selected>公司</option>" +
            "<option value='0' >其他</option>"+
            "</select>" ;
    }else{
        return "<select id='source' name='source' class='form-control chosen-select'>" +
            "<option value='0' selected>其他</option>" +
            "<option value='1' >公司</option>"+
            "</select>" ;
    }
};
var deviceHelper=RefHelper.create({
    ref_url:"gasbizdevice",
    ref_col:"deviceCode",
    ref_display:"deviceName"
});
var deviceFormat=function(){
    return {
        f: function(val){
            console.log(val)
            console.log(deviceHelper)
            return deviceHelper.getDisplay(val);
        }
    }
}();
$("#divtable").html("")
var xw = XWATable.init({
    divname: "divtable",
    //----------------table的选项-------
    pageSize: 10,
    pageSizes:[10,20,30,40],
    columnPicker: true,
    transition: 'fade',
    // tableId: "divtable",
    checkboxes: true, 
    checkAllToggle: true,
    //----------------基本restful地址---
    restbase: 'gasctmnonrsdtdevicedetail/?query={"customerCode":"'+archive.customerCode+'"}"',
    key_column: 'nonrsdtArchiveDetailId',
    coldefs: [
        {
            col:"nonrsdtArchiveDetailId",
            friendly:"nonrsdtArchiveDetailId",
            nonedit:"nosend",
            hidden:true,
            unique:true,
            index:1
        },
        {
            col: "name",
            friendly: "设备名称",
            sorting: false,
            inputsource:"select",
            ref_url:'gasbizdevice/?query={"deviceType":"'+ctmarchiveKInd+'"}',
            ref_name:"deviceName",
            ref_value:"deviceCode",
            validate:"required",
            format:deviceFormat,
            index: 1
        },
        {
            col: "deviceCode",
            friendly: "设备编号",
            validate:"required",
            readonly:"readonly",
            sorting: false,
            index: 2
        },
        {
            col: "count",
            friendly: "设备数量",
            sorting: false,
            validate:"onlyNumber length[1-2]",
            index: 3
        },
        {
            col: "position",
            friendly: "设备安装位置",
            sorting: false,
            index: 4
        },
        {
            col: "brand",
            friendly: "设备品牌",
            sorting: false,
            index: 5
        },
        {
            col: "model",
            friendly: "设备型号",
            sorting: false,
            index: 6
        },
        {
            col: "thermalPower",
            friendly: "额定热功率",
            sorting: false,
            index: 7
        },
        {
            col: "productionTime",
            friendly: "出厂日期",
            inputsource:"datepicker",
            sorting: false,
            index: 8
        },
        {
            col: "saleTime",
            friendly: "出售日期",
            inputsource:"datepicker",
            sorting: false,
            index: 9
        },
        {
            col: "source",
            friendly: "来源",
            format:sourceFormat,
            inputsource: "custom",
            inputbuilder: "sourceBuilder",
            sorting: false,
            index: 10
        },
        
        {
            col: "capacity",
            friendly: "容量/耗气量",
            sorting: false,
            index: 11
        },
        {
            col: "remark",
            friendly: "备注",
            sorting: false,
            index: 12
        }
    ],
    onAdded: function(a,jsondata){
        $("#deviceCode").attr("readonly")
        jsondata["customerCode"] = archive.customerCode;
        jsondata["createdTime"]=new Date(new Date()+"-00:00");
        jsondata["createdBy"]=userId;
        console.log(jsondata)
        return  validateForm(jsondata);
    },
    onUpdated: function(ret,jsondata){
        jsondata["updatedTime"]=new Date(new Date()+"-00:00");
        jsondata["modifiedBy"]=userId;
        console.log(jsondata)
        return  validateForm(jsondata);
    },
    onDeleted: function(ret,jsondata){
    },

});

$("#add_button").on("click",function(){
    $("#deviceCode").attr("readonly","readonly")
    $("#deviceCode").attr("placeholder","选择设备名称自动带出")
})

$(document).on("change","#name",function(){
    console.log($(this).val())
    $("#deviceCode").val($(this).val())
})



// if(ctmarchiveKInd == '1'){
    //     $("#form").show();
    //     $("#form1").hide();
    //     $("#shebei").hide();
    //     var rest = Restful.findNQ(hzq_rest + 'gasctmrsdtdevicearchive/?query={"ctmArchiveId":"'+ctmarchiveId+'"}');
    //     if(rest.length){
    //         $("#shebei1").show();

    //         var operationFormat = function () {
    //             return {
    //                 f: function (val,row) {
    //                     return "<a data-target='#updata' data-row='"+JSON.stringify(row)+"' data-toggle='modal' id='modify'>修改</a>";
    //                 }
    //             }
    //         }();
    //         var xw = XWATable.init({
    //             divname: "divtable1",
    //             //----------------table的选项-------
    //             pageSize: 10,
    //             columnPicker: true,
    //             transition: 'fade',
    //             tableId: "divtable",
    //             checkAllToggle: true,
    //             //----------------基本restful地址---
    //             restbase: 'gasctmnonrsdtdevicedetail/?query={"nonrsdtArchiveId":"'+rest[0].meterArchiveId+'"}"',
    //             key_column: 'nonrsdtArchiveDetailId',
    //             coldefs: [
    //                 {
    //                     col: "name",
    //                     friendly: "设备名称",
    //                     sorting: false,
    //                     index: 1
    //                 },
    //                 {
    //                     col: "count",
    //                     friendly: "设备数量",
    //                     sorting: false,
    //                     index: 2
    //                 },
    //                 {
    //                     col: "position",
    //                     friendly: "设备安装位置",
    //                     sorting: false,
    //                     index: 3
    //                 },
    //                 {
    //                     col: "brand",
    //                     friendly: "设备品牌",
    //                     sorting: false,
    //                     index: 4
    //                 },
    //                 {
    //                     col: "model",
    //                     friendly: "设备型号",
    //                     sorting: false,
    //                     index: 5
    //                 },
    //                 {
    //                     col: "thermalPower",
    //                     friendly: "额定热功率",
    //                     sorting: false,
    //                     index: 6
    //                 },
    //                 {
    //                     col: "remark",
    //                     friendly: "备注",
    //                     sorting: false,
    //                     index: 7
    //                 },
    //                 {
    //                     col: "nonrsdtArchiveDetailId",
    //                     friendly: "操作",
    //                     format:operationFormat,
    //                     sorting: false,
    //                     index: 7
    //                 }
    //             ]

    //         });


    //         $("#input_many4").on('click',function(){
    //             var form4 = $("#form4").serializeObject();
    //             if(form4.count.length > 2){
    //                 bootbox.alert("数量不能大于两位数！")
    //                 return ;
    //             }
    //             form4["nonrsdtArchiveId"] = rest[0].meterArchiveId;
    //             var resultform4 = Restful.postDataR(hzq_rest + "gasctmnonrsdtdevicedetail",JSON.stringify(form4));
    //             console.log(resultform4);
    //             if(resultform4.success){
    //                 xw.update();
    //             }

    //         })

    //         console.log(rest)
    //         $.each(rest[0],function(key,val){
    //             $("input[type='radio'][name='"+key+"'][value='"+val+"']").attr("checked",true);
    //             if(val.indexOf('T')!= '-1'){
    //                 console.log(val.split("T"))
    //                 $("input[type='text'][name='"+key+"']").val(val.split("T")[0]);
    //             }else{
    //                 $("input[type='text'][name='"+key+"']").val(val);
    //             }
    //             $("input").attr('disabled',false)
    //         });

    //         $("#input_many").on("click",function(){
    //             var upform = $("#form").serializeObject();
    //             var restsform = Restful.updateRNQ(hzq_rest + "gasctmrsdtdevicearchive", rest[0].meterArchiveId , upform);
    //             console.log(restsform);
    //             if(restsform.success){
    //                 bootbox.alert("修改成功！");
    //             }
    //         });

    //     }else{
    //         $("#shebei1").hide();
    //         $(".radioTime input[type='radio']").on("click",function(){
    //             if($(this).val() == '0'){
    //                 $(this).parents('.radioTime').find("input[type='text']").attr("disabled",true)
    //             }else{
    //                 $(this).parents('.radioTime').find("input[type='text']").attr("disabled",false)
    //             }
    //         });

    //         $("#input_many").on("click",function(){
    //             var uuid = $.md5($("#form").serializeObject() + new Date().getTime());
    //             var form = $("#form").serializeObject();
    //             form["meterArchiveId"] =uuid;
    //             form["ctmArchiveId"] =archive.ctmArchiveId;
    //             console.log(form);
    //             var rest = Restful.postData(hzq_rest + "gasctmrsdtdevicearchive",JSON.stringify(form));
    //             console.log(rest);
    //             if(rest){
    //                 bootbox.alert("添加成功！",function(){
    //                     // window.location.href = "customer/customer_information.html";
    //                     $("#shebei1").show();
    //                 });
    //             }else{
    //                 bootbox.alert("添加失败！");
    //                 return false;
    //             }

    //             var wx =XWATable.init({
    //                 divname: "divtable1",
    //                 //----------------table的选项-------
    //                 pageSize: 10,
    //                 columnPicker: true,
    //                 transition: 'fade',
    //                 tableId: "divtable1",
    //                 checkAllToggle: true,
    //                 //----------------基本restful地址---
    //                 restbase: 'gasctmnonrsdtdevicedetail/?query={"nonrsdtArchiveId":"'+uuid+'"}"',
    //                 key_column: 'nonrsdtArchiveDetailId',
    //                 coldefs: [
    //                     {
    //                         col: "name",
    //                         friendly: "设备名称",
    //                         sorting: false,
    //                         index: 1
    //                     },
    //                     {
    //                         col: "count",
    //                         friendly: "设备数量",
    //                         sorting: false,
    //                         index: 2
    //                     },
    //                     {
    //                         col: "position",
    //                         friendly: "设备安装位置",
    //                         sorting: false,
    //                         index: 3
    //                     },
    //                     {
    //                         col: "brand",
    //                         friendly: "设备品牌",
    //                         sorting: false,
    //                         index: 4
    //                     },
    //                     {
    //                         col: "model",
    //                         friendly: "设备型号",
    //                         sorting: false,
    //                         index: 5
    //                     },
    //                     {
    //                         col: "thermalPower",
    //                         friendly: "额定热功率",
    //                         sorting: false,
    //                         index: 6
    //                     },
    //                     {
    //                         col: "remark",
    //                         friendly: "备注",
    //                         sorting: false,
    //                         index: 7
    //                     },
    //                     {
    //                         col: "nonrsdtArchiveDetailId",
    //                         friendly: "操作",
    //                         format:operationFormat,
    //                         sorting: false,
    //                         index: 7
    //                     }
    //                 ]

    //             });


    //             $("#input_many4").on('click',function(){
    //                 var form4 = $("#form4").serializeObject();
    //                 if(form4.count.length > 2){
    //                     bootbox.alert("数量不能大于两位数！")
    //                     return ;
    //                 }
    //                 form4["nonrsdtArchiveId"] = uuid;
    //                 var resultform4 = Restful.postDataR(hzq_rest + "gasctmnonrsdtdevicedetail",JSON.stringify(form4));
    //                 console.log(resultform4);
    //                 if(resultform4.success){
    //                     wx.update();
    //                 }

    //             })




    //         })

    //     }


    // }else if(ctmarchiveKInd == '9'){

    //     $("#form").hide();
    //     $("#form1").show();
    //     $("#shebei1").hide();
    //     var rest = Restful.findNQ(hzq_rest + 'gasctmnonrsdtdevicearchive/?query={"ctmArchiveId":"'+ctmarchiveId+'"}');
    //     console.log(rest);
    //     if(rest.length){
    //         $("#shebei").show();
    //         // $('#divtable').html('');
    //         var operationFormat = function () {
    //             return {
    //                 f: function (val,row) {
    //                     return "<a data-target='#updata' data-row='"+JSON.stringify(row)+"' data-toggle='modal' id='modify'>修改</a>";
    //                 }
    //             }
    //         }();
    //         var xw = XWATable.init({
    //             divname: "divtable",
    //             //----------------table的选项-------
    //             pageSize: 10,
    //             columnPicker: true,
    //             transition: 'fade',
    //             tableId: "divtable",
    //             checkAllToggle: true,
    //             //----------------基本restful地址---
    //             restbase: 'gasctmnonrsdtdevicedetail/?query={"nonrsdtArchiveId":"'+rest[0].nonrsdtArchiveId+'"}"',
    //             key_column: 'nonrsdtArchiveDetailId',
    //             coldefs: [
    //                 {
    //                     col: "name",
    //                     friendly: "设备名称",
    //                     sorting: false,
    //                     index: 1
    //                 },
    //                 {
    //                     col: "count",
    //                     friendly: "设备数量",
    //                     sorting: false,
    //                     index: 2
    //                 },
    //                 {
    //                     col: "position",
    //                     friendly: "设备安装位置",
    //                     sorting: false,
    //                     index: 3
    //                 },
    //                 {
    //                     col: "brand",
    //                     friendly: "设备品牌",
    //                     sorting: false,
    //                     index: 4
    //                 },
    //                 {
    //                     col: "model",
    //                     friendly: "设备型号",
    //                     sorting: false,
    //                     index: 5
    //                 },
    //                 {
    //                     col: "thermalPower",
    //                     friendly: "额定热功率",
    //                     sorting: false,
    //                     index: 6
    //                 },
    //                 {
    //                     col: "remark",
    //                     friendly: "备注",
    //                     sorting: false,
    //                     index: 7
    //                 },
    //                 {
    //                     col: "nonrsdtArchiveDetailId",
    //                     friendly: "操作",
    //                     format:operationFormat,
    //                     sorting: false,
    //                     index: 7
    //                 }
    //             ]

    //         });

    //         $("#input_many2").on('click',function(){
    //             var form2 = $("#form2").serializeObject();
    //             if(form2.count.length > 2){
    //                 bootbox.alert("数量不能大于两位数！")
    //                 return ;
    //             }
    //             form2["nonrsdtArchiveId"] = rest[0].nonrsdtArchiveId;
    //             var resultform2 = Restful.postDataR(hzq_rest + "gasctmnonrsdtdevicedetail",JSON.stringify(form2));
    //             console.log(resultform2);
    //             if(resultform2.success){
    //                 xw.update();
    //             }

    //         })

    //         $.each(rest[0],function(key,val){
    //             $("#form1 input[type='radio'][name='"+key+"'][value='"+val+"']").attr("checked",true);
    //             $("#form1 input[type='text'][name='"+key+"']").val(val);
    //         })

    //         $("#input_many1").on("click",function(){
    //             var form1 = $("#form1").serializeObject();
    //             form1["nonrsdtArchiveId"] =rest[0].nonrsdtArchiveId;
    //             form1["ctmArchiveId"] =rest[0].ctmArchiveId;
    //             console.log(form1);
    //             var rests = Restful.updateRNQ(hzq_rest + "gasctmnonrsdtdevicearchive", rest[0].nonrsdtArchiveId , form1);
    //             console.log(rests);
    //             $("#shebei").show();
    //         });
    //     }else{
    //         $("#shebei").hide()
    //         $("#input_many1").on("click",function(){
    //             var uuid = $.md5($("#form1").serializeObject() + new Date().getTime());
    //             var form1 = $("#form1").serializeObject();
    //             form1["nonrsdtArchiveId"] =uuid;
    //             form1["ctmArchiveId"] =archive.ctmArchiveId;
    //             var rests = Restful.postDataR(hzq_rest + "gasctmnonrsdtdevicearchive",JSON.stringify(form1));
    //             console.log(rests)

    //             var operationFormat = function () {
    //                 return {
    //                     f: function (val,row) {
    //                         return "<a data-target='#updata' data-row='"+JSON.stringify(row)+"' data-toggle='modal' id='modify'>修改</a>";
    //                     }
    //                 }
    //             }();
    //             var wx =XWATable.init({
    //                 divname: "divtable",
    //                 //----------------table的选项-------
    //                 pageSize: 10,
    //                 columnPicker: true,
    //                 transition: 'fade',
    //                 tableId: "divtable",
    //                 checkAllToggle: true,
    //                 //----------------基本restful地址---
    //                 restbase: 'gasctmnonrsdtdevicedetail/?query={"nonrsdtArchiveId":"'+uuid+'"}"',
    //                 key_column: 'nonrsdtArchiveDetailId',
    //                 coldefs: [
    //                     {
    //                         col: "name",
    //                         friendly: "设备名称",
    //                         sorting: false,
    //                         index: 1
    //                     },
    //                     {
    //                         col: "count",
    //                         friendly: "设备数量",
    //                         sorting: false,
    //                         index: 2
    //                     },
    //                     {
    //                         col: "position",
    //                         friendly: "设备安装位置",
    //                         sorting: false,
    //                         index: 3
    //                     },
    //                     {
    //                         col: "brand",
    //                         friendly: "设备品牌",
    //                         sorting: false,
    //                         index: 4
    //                     },
    //                     {
    //                         col: "model",
    //                         friendly: "设备型号",
    //                         sorting: false,
    //                         index: 5
    //                     },
    //                     {
    //                         col: "thermalPower",
    //                         friendly: "额定热功率",
    //                         sorting: false,
    //                         index: 6
    //                     },
    //                     {
    //                         col: "remark",
    //                         friendly: "备注",
    //                         sorting: false,
    //                         index: 7
    //                     },
    //                     {
    //                         col: "nonrsdtArchiveDetailId",
    //                         friendly: "操作",
    //                         format:operationFormat,
    //                         sorting: false,
    //                         index: 7
    //                     }
    //                 ]

    //             });


    //             $("#input_many2").on('click',function(){
    //                 var form2 = $("#form2").serializeObject();
    //                 if(form2.count.length > 2){
    //                     bootbox.alert("数量不能大于两位数！")
    //                     return ;
    //                 }
    //                 form2["nonrsdtArchiveId"] = uuid;
    //                 var resultform2 = Restful.postDataR(hzq_rest + "gasctmnonrsdtdevicedetail",JSON.stringify(form2));
    //                 console.log(resultform2);
    //                 if(resultform2.success){
    //                     wx.update();
    //                 }

    //             })
    //             $("#shebei").show();
    //         });
    //     }




// }

// $(document).on('click',"#modify",function(){
//     var row = JSON.parse($(this).attr("data-row"));
//     $("#form3 input").each(function(){
//         $(this).val(row[$(this).attr('name')])
//     })
// });

// $(document).on("click","#addsubmit",function(){
//     var form3 = $("#form3").serializeObject();
//     console.log(form3.nonrsdtArchiveDetailId)

//     var resultform3 = Restful.updateNQ(hzq_rest + "gasctmnonrsdtdevicedetail/"+form3.nonrsdtArchiveDetailId,JSON.stringify(form3));
//     console.log(resultform3);
//     if(resultform3){
//         bootbox.alert("修改成功！",function(){
//             xw.update();
//         })
//     }

// })



