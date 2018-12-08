

SideBar.init();
SideBar.activeCurByPage("customer_information.html");
// SideBar.activeCurByPage("inhabitant_archivemanagement.html");
// var unboltId;
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
        })
    }
});

var AreaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
});
// 已通过开栓令helper

var xwQuery = RQLBuilder.and([
    RQLBuilder.equal("customerType","1"),
    RQLBuilder.equal("approveStatus","4"),
    RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea))

]).rql();

var projectHelper=RefHelper.create({
    ref_url:'gascsrunbolt/?query='+xwQuery,
    ref_col:"unboltId",
    ref_display:"unboltNo"
});
var operatorHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "employeeName"
});
// var unboltHelper = RefHelper.create({
//     ref_url: "gascsrunbolt",
//     ref_col: "userId",
//     ref_display: "userId"
// });


var projectFormat=function(){
    return {
        f: function(val){
            return projectHelper.getDisplay(val);
        }
    }
}();
var bookHelper = RefHelper.create({
    ref_url: "gasmrdbook",
    ref_col: "bookId",
    ref_display: "bookCode"
});


var bookFormat=function(){
    return {
        f: function(val){
            return bookHelper.getDisplay(val);
        }
    }
}();



var AreaFormat = function () {
    return {
        f: function (val) {
            return AreaHelper.getDisplay(val);
        }
    }
}();
var operatorFormat = function () {
    return {
        f: function (val) {
            return operatorHelper.getDisplay(val);
        }
    }
}();


$("#muban").on('click',function(){
    var queryid='{"name":{"$in":[""]}}';
    var dbcol="customerName,idcardType,idcard,borough,street,district,doorplateNum,floorNum,cell,storey,roomNum,subRoomNum,tel,exigenceTel,wechat,stationHouse,office,denizenCommittee,propertyCompany";
    var ncol="客户姓名,证件类型,证件号码,区,街,小区,门牌号,楼号,单元,层,室号,分室号,手机号,应急电话,微信号,所属派出所,所属街道办事处,所属社区,物业公司";
    var q = 'page=true&et=居民档案&ncol='+ncol.uricode()+'&dbcol='+dbcol.uricode()+'&exp=excel&';
    $(this).find("a").attr('href',hzq_rest+'gascsrlowincome/?query='+queryid.uricode()+'&'+q);
    $(this).find("a").attr("target","_blank");
});



var rowDetailsFormat = function () {
    return {
        f: function (val,row) {
            return '<span class="row-details row-details-close" id="'+row.bookCode+'"></span>';
        }
    }
}();


var select_mrdBookAction = function () {
    var xw ;
    var detailedInfoFormat = function () {
        return {
            f: function (val,row) {
                return '<a id="todetail" data-projectAddress="'+row.projectAddress+'" data-id="'+val+'" onclick="selectBook($(this))" href="javascript:void(0)">建档</a>';
            }
        }
    }();
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
            // this.initUnitTree();
        },

        initHelper:function(){
            $.map(projectHelper.getData(), function (value, key) {
                $('#find_unboltNo').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload: function () {
            $('#divtable').html('');

            var xwQuery = RQLBuilder.and([
                RQLBuilder.equal("customerType","1"),
                RQLBuilder.equal("approveStatus","4"),
                RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea))
            ]).rql();
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restbase: 'gascsrunbolt/?query=' + xwQuery ,
                    key_column: "unboltId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "unboltNo",
                            friendly: "开栓令编号",
                            unique: true,
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "projectNo",
                            friendly: "项目编号",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "projectName",
                            friendly: "项目名称",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "projectDate",
                            friendly: "项目日期",
                            index: 4
                        },
                        {
                            col: "buildUnit",
                            friendly: "建设单位",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "projectType",
                            friendly: "工程类别",
                            sorting: false,
                            hidden: true,
                            index: 6
                        },
                        {
                            col: "projectAddress",
                            friendly: "工程地址",
                            sorting: false,
                            hidden: false,
                            index: 7
                        },
                        {
                            col: "linkMan",
                            friendly: "联系人",
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "linkTel",
                            friendly: "联系方式",
                            sorting: false,
                            hidden: true,
                            index: 9
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            sorting: false,
                            ref_url: "gasbizarea",
                            ref_name: "areaName",
                            ref_value: "areaId",
                            index: 10
                        },
                        {
                            col: "operator",
                            friendly: "操作员",
                            sorting: false,
                            format: operatorFormat,
                            ref_url: "gassysuser",
                            ref_name: "employeeName",
                            ref_value: "operator",
                            index: 11
                        },
                        {
                            col: "approveStatus",
                            friendly: "审核状态",
                            sorting: false,
                            format:GasModCtm.projectStatusFormat,
                            index: 12
                        },
                        {
                            col: "unboltId",
                            friendly: "操作",
                            sorting: false,
                            format: detailedInfoFormat,
                            index: 13
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        // var find_area, find_projectNo, find_projectName, find_linkMan, find_buildUnit, find_projectAddress;
                        var find_unboltNo, find_projectNo;
                        if ($('#find_unboltNo').val()) {
                            console.log($('#find_unboltNo').val())
                            find_unboltNo = RQLBuilder.equal("unboltId", $('#find_unboltNo').val());
                        }
                        console.log($('#find_projectNo').val())
                        if ($('#find_projectNo').val()) {
                            find_projectNo = RQLBuilder.equal("projectNo", $('#find_projectNo').val());
                        }
                        var find_area = RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        var customerType = RQLBuilder.equal("customerType","1");
                        var approveStatus=RQLBuilder.equal("approveStatus","4")
                        var filter = RQLBuilder.and([
                            find_unboltNo,find_projectNo,customerType,approveStatus,find_area
                        ]);

                        xw.setRestURL(hzq_rest + "gascsrunbolt")
                        return filter.rql();
                    },
                    onAdded: function (ret, jsondata) {

                    },

                    onUpdated: function (ret, jsondata) {

                    },

                    onDeleted: function (ret, jsondata) {
                    }
                }
            );
        }

    }
}();

/* Formatting function for row expanded details */
function fnFormatDetails(oTable, nTr) {
    
    var chid=$(nTr).children('td:first-child').children("span").attr('id');

    var sOut = '<tr class="detailtable'+chid+'"><td></td>'
            +'<td colspan=6>';
    sOut += '<div id="detail_'+chid+'" class="table-responsive dataTable container-fluid col-md-12"></div>'
    sOut += '</td></tr>';
    return sOut;
}
var booktable ;
var lastClickTime = 0;
var downloadArch=function(bookId){
    alert("下载："+bookId);
}

function selectBook(val){
    var unboltId=$(val).attr("data-id");
    var address = $(val).attr("data-projectAddress");
    console.log(unboltId);
    $("#divtable1").html("");
    var addressFormat=function(){
        return{
            f:function(){
                return address;
            }
        }
    }();
    var selectBookFormat = function () {
        return {
            f: function (val,row) {
                // console.log(row)
                var bookArchive = Restful.findNQ(hzq_rest + 'gasctmarchive/?query={"bookId":"'+row.bookId+'"}')
                // console.log(bookArchive.length)
                // console.log(row.doorCount)
                if((row.doorCount - bookArchive.length) > 0 ){
                    return '<a data-target="#input_many_modal" data-row='+JSON.stringify(row)+' data-toggle="modal" onclick="selectfile($(this))" data-backdrop="static">导入</a>';
                }else{
                    return "已导入";
                }
            }
        }
    }();

   /* var downloadBookFormat = function () {
        return {
            f: function (val,row) {
                var queryid='{"bookId":{"$in":["'+row.bookId+'"]}}';
                var dbcol="customerName,idcardType,idcard,customerAddress,tel,exigenceTel,wechat,stationHouse,office,denizenCommittee,propertyCompany";
                var ncol="客户姓名,证件类型,证件号码,客户地址,手机号,应急电话,微信号,所属派出所,所属街道办事处,所属社区,物业公司";
                var q = 'page=true&et=新开栓用户资料&ncol='+ncol.uricode()+'&dbcol='+dbcol.uricode()+'&exp=excel&';
                var emap = JSON.stringify({"idcardType":"1：营业执照；2：法人身份证；3：房产证；4：租房合同；5：居民身份证"});
                return '<a target=_blank href="'+hzq_rest+'gasctmarchive/?query='+queryid.uricode()+"&ci="+emap.uricode()+'&'+q+'">下载</a>';
            }
        }
    }();*/
    
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        url: hzq_rest + 'gascsrunboltrsdtdetail/?query={"unboltId":"'+unboltId+'"}',
        dataType: 'json',
        data: "",
        success: function (data) {
            console.log(data);
            var bookId = [];
            for(var i=0;i<data.length;i++){
                bookId.push(data[i].bookId);
            }
            console.log(bookId);
            booktable = XWATable.init({
                divname: "divtable1",
                //----------------table的选项-------
                pageSize: 10,
                columnPicker: true,         //Show the columnPicker button
                sorting: true,
                transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                //----------------基本restful地址---
                restbase: 'gasmrdbook?query={"bookId":{"$in":'+JSON.stringify(bookId)+'}}',
                //key_column: 'bookId',
                coldefs:[
                    {
                        col:"bookId",
                        friendly:"  ",
                        class:"table-checkbox",
                        format:rowDetailsFormat,
                        width:"100px",
                        index:1
                    },
                    {
                        col:"areaId",
                        friendly:"供气区域",
                        format:AreaFormat,
                        index:2
                    },
                    {
                        col:"bookCode",
                        friendly:"抄表本号",
                        format:bookFormat,
                        index:3
                    },

                   /* {
                        col:"address",
                        friendly:"工程地址",
                        format:addressFormat,
                        index:3
                    },
*/
                    {
                        col:"floornum",
                        friendly:"楼号",
                        index:4
                    },
                    {
                        col:"countperId",
                        friendly:"核算员",
                        format:operatorFormat,
                        index:6
                    },
                    {
                        col:"serviceperId",
                        friendly:"抄表员",
                        format:operatorFormat,
                        index:7
                    },
                   {
                        col:"doorCount",
                        friendly:"户数",
                        index:8
                    },
                    /*{
                        col:"download",
                        friendly:"下载客户档案",
                        format:downloadBookFormat,
                        index:6,
                        width:"100px"
                    },*/
                   {
                        col:"",
                        friendly:"导入客户信息",
                        format:selectBookFormat,
                        index:9,
                        width:"100px"
                   }
                ],
                findFilter: function () {

                },
                onAdded: function (ret, jsondata) {

                },

                onUpdated: function (ret, jsondata) {

                },

                onDeleted: function (ret, jsondata) {
                }
            })


            $("#divtable1").on('click', ' tbody td .row-details', function () {
                var nTr = $(this).parents('tr')[0];
                if(new Date().getTime()-lastClickTime<100){
                    return;

                }
                lastClickTime = new Date().getTime();
                var chid=$(nTr).children('td:first-child').children("span").attr('id');
                if ($(nTr).children("td").children("span").hasClass("row-details-open")) {
                    /* This row is already open - close it */
                    $(this).addClass("row-details-close").removeClass("row-details-open");
                    //booktable.fnClose(nTr);
                    $(nTr).siblings('tr.detailtable'+chid).remove()
                } else 
                if ($(nTr).children("td").children("span").hasClass("row-details-close")) {
                    /* Open this row */
                    $(this).addClass("row-details-open").removeClass("row-details-close");
                    var ele=fnFormatDetails(booktable,nTr);
                    $(ele).insertAfter(nTr)
                    setTimeout(function(){
                        console.log("new table="+$("#detail_"+chid))
                        var idcardTypes = {"1":"营业执照","2":"法人身份证","3":"房产证","4":"租房合同","5":"居民身份证"};
                        var idcardFormat = function () {
                            return {
                                f: function (val,row) {
                                    console.log(val)
                                    if(val == 1){
                                        console.log(val)
                                         return "营业执照"
                                    }else if(val == 2){
                                        console.log(val)
                                        return "法人身份证"
                                    }else if(val == 3){
                                         return "房产证"
                                    }else if(val == 4){
                                        return "租房合同"
                                    }else if(val == 5){
                                        return "居民身份证"
                                    }
                                }
                            }
                        }();


                        var detailtable = XWATable.init({
                            divname: "detail_"+chid,
                            //----------------table的选项-------
                            pageSize: 10, 			//Initial pagesize
                            columnPicker: true,         //Show the columnPicker button
                            sorting: true,
                            transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                            checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                            checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                            //----------------基本restful地址---
                            restbase: 'gasctmarchive?query={"bookId":{"$in":'+chid+'}}',
                            //key_column: 'bookId',
                            coldefs:[
                               /* {
                                    col:"ctmArchiveId",
                                    friendly:"档案ID",
                                    index:1,
                                    hidden:true
                                },*/
                                {
                                    col:"areaId",
                                    friendly:"供气区域",
                                    format:AreaFormat,
                                    index:2
                                },
                                {
                                    col:"bookId",
                                    friendly:"抄表本号",
                                    format:bookFormat,
                                    index:3
                                },
                                {
                                    col:"customerCode",
                                    friendly:"客户编号",
                                    index:4
                                },
                                {
                                    col:"customerName",
                                    friendly:"客户姓名",
                                    index:5
                                },
                                {
                                    col:"idcard",
                                    friendly:"证件号码",
                                    index:7
                                },
                                {
                                    col:"idcardType",
                                    friendly:"证件类型",
                                    format:idcardFormat,
                                    index:6
                                },
                                {
                                    col:"customerAddress",
                                    friendly:"客户地址",
                                    index:8
                                }
                            ],
                            findFilter: function () {

                            },
                            onAdded: function (ret, jsondata) {

                            },

                            onUpdated: function (ret, jsondata) {

                            },

                            onDeleted: function (ret, jsondata) {
                            }
                        })
                    },10);
                    //booktable.fnOpen(nTr, fnFormatDetails(booktable, nTr), 'details');
                }else{
                    console.log("unknow state:")
                }
            });
        }
    });
}

var books;
var bookconut;
var archivecount;
function selectfile(row){
    console.log(JSON.parse(row.attr("data-row")))
    books = JSON.parse(row.attr("data-row"));
    console.log(books.bookId);
    var bookArchive = Restful.findNQ(hzq_rest + 'gasctmarchive/?query={"bookId":"'+books.bookId+'"}')
    bookconut = books.doorCount;
    /*console.log(bookArchive.length)
    console.log();*/
    archivecount = bookArchive.length

    console.log(bookconut-archivecount);

}

var uplaod_ret ;
var booktable = null;
var dbcol="customerName,idcardType,idcard,borough,street,district,doorplateNum,floorNum,cell,storey,roomNum,subRoomNum,tel,exigenceTel,wechat,stationHouse,office,denizenCommittee,propertyCompany";
var ncol="客户姓名,证件类型,证件号码,区,街,小区,门牌号,楼号,单元,层,室号,分室号,手机号,应急电话,微信号,所属派出所,所属街道办事处,所属社区,物业公司";
var ncol_array=ncol.split(",");
var sortHeader;
var colFormat = function () {
    return {
        f: function (val,row,cell,key) {
            console.log("key==:"+key+",row="+row)
            return JSON.parse(row.jsDatas1)[sortHeader.indexOf(key)];//.JS_DATAS1[ncol_array.indexOf(key)];
        }
    }
}();
var statess = false;
var qq=[];

$('#input_many_modal').on('hide.bs.modal', function() {
    statess = false;
    console.log("hide diag")
    setTimeout(function(){$('#confirm').hide();
        $('#divtabledata_prev').html("");
        $('#startupload').show();
        $('#clear').show();
        $('#addbtn').show();
        $('#divtabledata_prev').html("");
    },1000)
    // $("#uploadbtn").css({display:"show"})

});

$('#input_many_modal').on('shown.bs.modal', function() {
    console.log("show diag")
    // $("#uploadbtn").css({display:"show"})
    $('#confirm').hide();
    $('#divtabledata_prev').html("");
    $('#startupload').show();
    $('#clear').show();
    $('#addbtn').show();

    $('#fileId').on("change",function(){
        console.log("select file:"+$('#fileId').val())
        $('#fileupload').find(".preview").html(""+$('#fileId').val());
    });
    $('#fileupload').on("submit",function(){
        console.log("submit!!")
    })
})



$('#clear').on('click',function(){
    $('#fileId').val("");
    $('#fileupload').find(".preview").html("");
    $('#divtabledata_prev').html("");
})



var archiveFormat = function () {

    var idcardStatus = {"营业执照": "1", "法人身份证": "2", "房产证": "3", "租房合同": "4", "居民身份证":"5"};
    return {
        idcardTypeFormat:function (val) {
            return idcardStatus[val];
        }
    }
}();
console.log(archiveFormat.idcardTypeFormat("营业执照"))


/* $.ajax({
 type: 'POST',
 url: "/hzqs/sys/imp/blkconfirm.do?bt=plkx&batchid="+batchId+"&tbname=GAS_CTM_ARCHIVE"
 +"&method=UPDATE&ncol="+ncol+"&dbcol="+dbcol+"&refcol=customerCode&emap="+emap,
 dataType: 'json',
 contentType: "application/json; charset=utf-8",
 async: false,
 success: function(data) {
 console.log("get Data:"+JSON.stringify(data));
 $('#input_many_modal').modal('hide');
 if(data.rows){
 var success = 0
 $.each(data.rows,function(idx,row){
 if(row.status=="1"){
 success += 1;
 }
 })
 bootbox.alert('<center><h4>数据入库成功</h4><br><h2>找到匹配个数'+success+'</h2><br><h2>失败：'+
 (data.rows.length-success)
 +'</h2></center>');

 }else{
 bootbox.alert('<center><h4>数据入库失败！</h4></center>');
 }
 },
 error: function(err) {
 console.log(err)
 bootbox.alert('<center><h4>数据入库失败！<br><h2>'+JSON.stringify(err)+'</h2></h4></center>');
 $('#input_many_modal').modal('hide');
 //                                return false;
 // alert("find all err");
 }
 });*/


$(document).on("click",'#confirm',uploadarchive)
   
function uploadarchive(){

    console.log(statess)
    if(statess){
        $("#confirm").button('loading');
        console.log("confirm ok")
        console.log(JSON.stringify(qq))
        var result=[];
        $.each(qq,function(index,item){
            var ctmArchiveId = $.md5(JSON.stringify(qq)+Math.random() +new Date().getTime());
            var coustomer = {
                "batchid": ctmArchiveId,
                "count":1,
                "customer":{
                    "ctm_archive_id":ctmArchiveId,
                    "customer_kind":"1"
                }
            };
            var customerCodes = Restful.insert("/hzqs/sys/pbbcd.do?fh=SYSBCD0000000J00&resp=bd&bd",coustomer)
           // console.log(customerCodes);
            if(customerCodes.message != "success"){
                bootbox.alert("客户编号生成失败！");
                return false;
            }
            var parameter = JSON.parse(item);
            parameter["sets"][0]["body"]["customerCode"] = customerCodes["customers"][0].customer_code;
            parameter["sets"][0]["body"]["ctmArchiveId"] = customerCodes["customers"][0].ctm_archive_id;
            parameter["sets"][0]["body"]["customerId"] = customerCodes["customers"][0].ctm_archive_id;
            parameter["sets"][2]["body"]["ctmArchiveId"] = customerCodes["customers"][0].ctm_archive_id;
            parameter["sets"][3]["body"]["ctmArchiveId"] = customerCodes["customers"][0].ctm_archive_id;
            parameter["sets"][4]["body"]["customerId"] = customerCodes["customers"][0].ctm_archive_id;
            parameter["sets"][4]["body"]["customerNo"] = customerCodes["customers"][0].customer_code;
            parameter["sets"][4]["body"]["customerMainId"] = customerCodes["customers"][0].customer_code;


            //console.log(parameter);
            $.ajax({
                type: 'POST',
                url:  "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                isMask: true,
                data: JSON.stringify(parameter),
                success: function(data) {
                   // console.log(data);
                    bool = data;
                    result.push(JSON.stringify(bool.results[0].result.success))
                },
                error: function(err) {
                    bootbox.alert(err);
                    return false;
                }
            });
            return ;
        });
       // console.log(result)
        var a=[];
        for(var i=0;i<result.length;i++){
            if(result[i] != "true"){
                a.push(i+1);
            }
        }
        // str+="条入库失败！";
        console.log(0)
        if(!a.length){
            bootbox.alert("入库成功！",function () {
                $("#confirm").button('reset');
                window.location.reload();
            })
        }else{
            bootbox.alert("第"+a.join()+"条入库失败")
        }

    }

}



$('#startupload').on('click',function(){
    //if (checkExcels()) {
    var form = new FormData(document.getElementById('fileupload'));
    console.log(form.get("files[]"));
    $('#divtabledata_prev').html("");
    var batchId = $.md5(JSON.stringify(form) + new Date().getTime())
    $.ajax({
        url: "/hzqs/sys/imp/blkup.do?bt=jmda&batchid="+batchId,
        data: form,
        processData: false,
        contentType: false,
        async: false,
        type: 'POST',
        success: function (data) {
            console.log("ret=="+JSON.stringify(data))
            uplaod_ret=data;

            if(data.rows){
                qq=[];
                var status;
                var emap = JSON.stringify({"idcardType":{"营业执照":"1","法人身份证":"2","房产证":"3","租房合同":"4","居民身份证":"5"}})
                var aa=[];
                var archiveKey ="subRoomNum,borough,cell,customerName,roomNum,district,storey,xuhao,exigenceTel,wechat,stationHouse,denizenCommittee,office,tel,floorNum,propertyCompany,street,idcard,idcardType,doorplateNum"
                $.each(data.rows,function(index,item){
                    var ss={};
                    $.each(item.values,function(key,val){
                        ss[archiveKey.split(",")[key]] = $.trim(val);
                        console.log(key)
                    })
                    delete ss.xuhao;
                    aa.push(ss)
                })
                console.log("====" +JSON.stringify(aa));
                console.log(aa.length);

                var archive = {};
                var house ={};
                var renter={};
                var accctm = {};
                var account = {};
                var gasactgasfeeaccount = {};
                var gasactwastefeeaccount = {};
                var customer={};
                $.each(aa,function(index,item){
                    console.log("==============",item)
                    var customerAddress="";
                    if (item["borough"]  && item["borough"] != "undefined") {
                        if (item["borough"].indexOf("区") == -1) {
                            customerAddress += item["borough"] + "区";
                        } else {
                            customerAddress += item["borough"];
                        }
                    }
                    if (item["street"]  && item["street"] != "undefined") {
                        customerAddress += item["street"];
                    }
                    if (item["doorplateNum"]  && item["doorplateNum"] != "undefined") {
                        if (item["doorplateNum"].indexOf("号") == -1) {
                            customerAddress += item["doorplateNum"] + "号";
                        } else {
                            customerAddress += item["doorplateNum"];
                        }
                    }
                    if (item["district"] && item["district"] != "undefined") {
                        if (item["district"].indexOf("小区") == -1) {
                            customerAddress += item["district"] + "小区";
                        } else {
                            customerAddress += item["district"];
                        }
                    }
                    if (item["floorNum"]  && item["floorNum"] != "undefined") {
                        if (item["floorNum"].indexOf("号楼") == -1) {
                            customerAddress += item["floorNum"]  + "号楼";
                        } else {
                            customerAddress += item["floorNum"];
                        }
                    }
                    if (item["cell"] && item["cell"] != "undefined") {
                        if (item["cell"].indexOf("单元") == -1) {
                            customerAddress += item["cell"]  + "单元";
                        } else {
                            customerAddress += item["cell"];
                        }
                    }
                    if (item["storey"]  && item["storey"] != "undefined") {
                        if (item["storey"].indexOf("层") == -1) {
                            customerAddress += item["storey"] + "层";
                        } else {
                            customerAddress += item["storey"];
                        }
                    }
                    if (item["roomNum"] && item["roomNum"] != "undefined") {
                        if (item["roomNum"].indexOf("室") == -1) {
                            customerAddress += item["roomNum"] + "室";
                        } else {
                            customerAddress += item["roomNum"];
                        }
                    }
                    if (item["subRoomNum"] && item["subRoomNum"] != "undefined") {
                        if (item["subRoomNum"].indexOf("分室") == -1) {
                            customerAddress += item["subRoomNum"] + "分室";
                        } else {
                            customerAddress += item["subRoomNum"];
                        }
                    }
                    if(customerAddress== ""){
                        status = false;
                        return status;
                    }else{
                        status =true;
                    }

                    var houseId = $.md5(JSON.stringify(data.rows[index])+new Date().getTime() + Math.random()*100000);
                    var renterId = $.md5(JSON.stringify(data.rows[index])+new Date().getTime()  + Math.random()*100000);
                    var chgAccountId = $.md5(JSON.stringify(data.rows[index])+new Date().getTime() + Math.random()*100000);
                    console.log(item["customerName"])
                    if(item["customerName"] == ""){
                        item["customerName"] = "无名客户";
                    }
                    console.log(item["customerName"])
                    item["houseId"] = houseId;
                    item["gasTypeId"] = "20101";
                    house["houseId"] = item["houseId"];
                    //borough,street,district, doorplateNum, floorNum, cell, storey,roomNum,subRoomNum,
                    //区,      街,   小区,    门牌号,           楼号,  单元,层,      室号,    分室号,
                    house["borough"] = item["borough"];
                    house["population"] = "5";
                    house["street"] = item["street"];
                    house["district"] = item["district"];
                    house["doorplateNum"] = item["doorplateNum"];
                    house["floorNum"] = item["floorNum"];
                    house["cell"] = item["cell"];
                    house["storey"] = item["storey"];
                    house["roomNum"] = item["roomNum"];
                    house["subRoomNum"] = item["subRoomNum"];
                    house["modifiedTime"] = new Date();
                    house["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;




                    console.log(books.bookId)
                    item["bookId"] = books.bookId;
                    item["idcardType"] = archiveFormat.idcardTypeFormat(item.idcardType);
                    item["customerKind"] = "1";
                    item["customerState"] = "00";
                    item["areaId"] = JSON.parse(localStorage.getItem("user_info")).area_id;
                    renter["renterId"] = renterId;
                    renter["modifiedTime"] = new Date();
                    renter["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
                    // renter["ctmArchiveId"] = customerCodes["customers"][0].ctm_archive_id;
                    account["chgAccountId"] = chgAccountId;
                    account["modifiedTime"] = new Date();
                    account["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
                    // account['ctmArchiveId'] = customerCodes["customers"][0].ctm_archive_id;
                    account['accountType'] = "0";
                    gasactgasfeeaccount['chgAccountId'] = chgAccountId;
                    gasactgasfeeaccount['balance'] = "0";
                    gasactgasfeeaccount['gasfeeAccountId'] =  $.md5(chgAccountId + Math.ceil(Math.random()*999));
                    gasactgasfeeaccount["modifiedTime"] = new Date();
                    gasactgasfeeaccount["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

                    gasactwastefeeaccount['chgAccountId'] = chgAccountId;
                    gasactwastefeeaccount['balance'] = "0";
                    gasactwastefeeaccount['wastefeeAccountId'] = $.md5(chgAccountId + Math.ceil(Math.random()*999));
                    gasactwastefeeaccount["modifiedTime"] = new Date();
                    gasactwastefeeaccount["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;

                    customer["customerName"] = item["customerName"];
                    customer["identifyType"] = item["idcardType"];
                    customer["identifyNo"] = item["idcard"];
                    customer["tel"] = item["tel"];
                    archive =item;
                    archive["lowerProtection"] ="0";
                    archive["modifiedTime"] = new Date();
                    archive["validOrInvalid"] = "N";
                    archive["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
                    archive["customerAddress"] = customerAddress;
                    customer["customerAddress"] = customerAddress;
                    customer["modifiedTime"] = new Date();
                    customer["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
                    console.log(archive)

                    var submitJson = {"sets":[
                        {"txid":"1","body":archive,"path":"/gasctmarchive/","method":"put"},
                        {"txid":"2","body":house,"path":"/gasctmhouse/","method":"post"},
                        {"txid":"3","body":renter,"path":"/gasctmrenter/","method":"post"},
                        {"txid":"4","body":account,"path":"/gaschgaccount/","method":"post"},
                        {"txid":"5","body":customer,"path":"/gasctmcustomer/","method":"post"},
                        {"txid":"6","body":gasactgasfeeaccount,"path":"/gasactgasfeeaccount/","method":"post"},
                        {"txid":"7","body":gasactwastefeeaccount,"path":"/gasactwastefeeaccount/","method":"post"}
                    ]};
                    qq.push(JSON.stringify(submitJson))
                })


                if(status){
                    if(qq.length+archivecount > bookconut){
                        bootbox.alert("<center><h4>抄表本"+books.bookCode+"最大户数为"+bookconut+"户,已有"+archivecount+"户，模板超出"+(archivecount+qq.length-bookconut)+"。</h4></center>")
                        return false;
                    }
                    bootbox.alert('<center><h4>导入成功条数为</h4><br><h2>'+data.rows.length+'</h2></center>');
                    var cols = new Array()
                    sortHeader = data.headers;
                    $.each(ncol.split(","),function(id,row){
                        cols.push({"col":row,index:id+1,format:colFormat})
                    });
                    $('#confirm').show();
                    $('#startupload').hide();
                    $('#addbtn').hide();
                    $('#clear').hide();
                }else {
                    bootbox.alert("<center><h4>模板中地址信息不能为空，请检查模板。</h4></center>",function(){
                        var gasimpid = [];
                        $.each(data.rows,function(index,item){
                            gasimpid.push(item.uuid)
                        })
                        console.log(gasimpid)
                        var resul = Restful.delByIDR(hzq_rest+"gasimpbulksdata/",gasimpid.join())
                        console.log(resul)
                    });
                    return false;
                }
                statess = true;

                booktable = XWATable.init({
                    divname: "divtabledata_prev",
                    //----------------table的选项-------
                    pageSize: 10,
                    // columnPicker: true,
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restbase: 'gasimpbulksdata?query={"batchId":"'+batchId+'"}',
                    //key_column: 'bookId',
                    coldefs:cols,
                    findFilter: function () {
                    },
                    onAdded: function (ret, jsondata) {
                    },

                    onUpdated: function (ret, jsondata) {
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
            }else{
                bootbox.alert('导入失败！');
            }
        },
        error: function (data) {
            bootbox.alert("出错了～\n"+JSON.stringify(data));
            $("#fileId").val('');
        }
    });
});//end on click