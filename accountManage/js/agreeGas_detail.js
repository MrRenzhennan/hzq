/**
 * Created by anne on 2017/6/15.
 */

console.log(localStorage.getItem('user_info'));


SideBar.init();
SideBar.activeCurByPage("accountManage/accountagree.html");

var href = document.location.href;
var args = href.split("?");
//计费更正流程id
var actAgreeGasFlowId =args[1];



//用户helper
var userHelper=RefHelper.create({
    ref_url:"gassysuser",
    ref_col:"userId",
    ref_display:"employeeName",
});
//抄表本helper
var bookHelper=RefHelper.create({
    ref_url:"gasmrdbook",
    ref_col:"bookId",
    ref_display:"bookCode",
});

//供气区域helper
var areaHelper=RefHelper.create({
    ref_url:"gasbizarea",
    ref_col:"areaId",
    ref_display:"areaName",
});
//用气性质helper
var gasTypeHelper=RefHelper.create({
    ref_url:"gasbizgastype",
    ref_col:"gasTypeId",
    ref_display:"gasTypeName",
});




$.ajax({
    url: hzq_rest + 'gasactagreegasflow/'+actAgreeGasFlowId,
    type:"get",
    // data:JSON.stringify(bd),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function(data){
        var ctmArchiveId;
        if(data){
            ctmArchiveId = data.ctmArchiveId;
            var ctmMeter =  Restful.findNQ(hzq_rest + "gasctmmeter/"+ ctmArchiveId);
            $('#address').text(ctmMeter.address);
            $('#meterUserName').text(ctmMeter.meterUserName);
            $('#meterUserState').text(GasModMtr.meterUserStateFormat.f(ctmMeter.meterUserState));
            $.each(data,function(key,val){
                $('#table2 span').each(function (index,val1) {
                    span = val1;
                    if($(span).attr('name') == key){
                        $(span).html(val);
                        if($(span).attr('name')=='createdTime'||$(span).attr('name')=='startTime'||$(span).attr('name')=='endTime'){
                            $(span).html(val.substring(0,10))
                        }
                        if($(span).attr('name')=='status') {
                            if(val=='1'){
                                $(span).html("审批中");
                            }else if(val =='2'){
                                $(span).html("审批通过");
                            }else if(val =='3'){
                                $(span).html("审批未通过");
                            }else if(val =='4'){
                                $(span).html("待审批");
                            }else{
                                $(span).html("已撤销");
                            }
                        }
                        if(data.fileId){
                            pic(data.fileId);
                        }

                    }

                })
            })

            $.ajax({
                url: hzq_rest + 'gasctmarchive/'+ctmArchiveId,
                type:"get",
                // data:JSON.stringify(bd),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(dat){
                    if(dat){
                        $.each(dat,function(key,val){
                            $('#table1 span').each(function (index,val1) {
                                span = val1;
                                if($(span).attr('name') == key){
                                    $(span).html(val);
                                    if('customerType'== $(span).attr('name')){
                                        if(val == 'I'){
                                            $(span).text('是');
                                        }else{
                                            $(span).text('否');
                                        }

                                    }
                                    if('customerKind'== $(span).attr('name')){
                                        $(span).text(GasModCtm.customerKindFormat.f(val));

                                    }
                                    if('customerState'== $(span).attr('name')){
                                        $(span).text(GasModCtm.customerStateFormat.f(val));

                                    }
                                    if('idcardType'== $(span).attr('name')){
                                        var idcardType = val.trim();
                                        $(span).text(GasModCtm.customerIDCardTypeFormat.f(idcardType));

                                    }
                                    if('gasTypeId'== $(span).attr('name')){
                                        $(span).text(gasTypeHelper.getDisplay(val));

                                    }
                                    if('areaId'== $(span).attr('name')){
                                        $(span).text(areaHelper.getDisplay(val));

                                    }
                                    if(dat.bookId){
                                        var book =  Restful.findNQ(hzq_rest + "gasmrdbook/"+ dat.bookId)
                                        var countperId = book.countperId;
                                        var serviceperId = book.serviceperId;
                                        $("#countperId").text(userHelper.getDisplay(countperId));
                                        $("#serviceperId").text(userHelper.getDisplay(serviceperId));
                                        $("#bookId").text(bookHelper.getDisplay(dat.bookId));

                                    }
                                }

                            })
                        })



                    }

                }
            })

        }

    }
})