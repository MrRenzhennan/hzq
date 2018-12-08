
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;
GasModSys.areaList({
    "areaId":"1",
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            if(val.areaId !=1){
                $('#find_movebefore').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
                $('#find_moveafter').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
            }
           
            
        })
    }
});



var areaHelper = RefHelper.create({
    ref_url: 'gasbizarea',
    ref_col: 'areaId',
    ref_display: 'areaName'
});
//Format

var areaFormat = function () {
    return {
        f: function (val) {
            return areaHelper.getDisplay(val);
        }
    }
}();
var  removelibrary = function(){
    var status={"0":"申请中","1":"审批通过","2":"审批未通过","3":"审批中"}
    var statusformat = function(){
        return{
            f:function(val){
                return status[val]
            }
        }
        
    }()
    var optionFormat = function(){
        return{
            f:function(val,row){
                console.log(row)
                if(areaId == row.moveBefore && row.status == "0"){
                    return "<a href='metermanage/borrow_meter.html?"+row.meterMoveId+"' >借表</a>"
                }else{
                    return "<a id='"+val+"' href='metermanage/approval_movemeter.html?"+row.meterMoveId+"' >详情</a>"
                }
                
            }
        }
    }()
    return{
        init:function (){
            this.reload();
        },
        reload:function(){
            $('#divtable').html('');
            var where = "";
            if(areaId =="1"){
                where ="";
            }else{
                where = " (move_before ='"+areaId+"' or move_after='"+areaId+"') "
            }
            var bd = {
                "cols": "*",
                "froms": "gas_mtr_meter_move",
                "wheres": where,
                "page": true,
                "limit": 50
            };
            var queryCondion = RQLBuilder.and([
                // RQLBuilder.condition_fc("moveBefore","$in",JSON.stringify(loginarea)),
                RQLBuilder.equal("moveBefore",areaId),
                RQLBuilder.equal("moveAfter",areaId),
            ]).rql()




            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: false,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    // restbase:'gasmtrmetermove/?query='+queryCondion,
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: 'meterMoveId',
                    coldefs: [
                        {
                            col: "moveBefore",
                            friendly: "移动前表库",
                            format: areaFormat,
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "moveAfter",
                            friendly: "移动后表库",
                            sorting: true,
                            format:areaFormat,
                            index: 2
                        },
                        {
                            col: "status",
                            friendly: "申请状态",
                            format: statusformat,
                            sorting: true,
                            index: 3
                        },
                        {
                            col: "remark",
                            friendly: "备注",
                            sorting: true,
                            index: 4
                        },
                        {
                            col: "meterMoveId",
                            friendly: "操作",
                            sorting: true,
                            format:optionFormat,
                            index: 4
                        },
                       

                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {

                        var wheres ="";


                        if($('#find_movebefore').val()){
                            wheres += "move_before='"+$('#find_movebefore').val()+"' and "
                        }
                        if($('#find_moveafter').val()){
                            wheres += "move_after='"+$('#find_moveafter').val()+"' and "
                        }
                        if($('#status').val()){
                            wheres += "status='"+$('#status').val()+"' and "
                        }

                        
                        var bd = {
                            "cols": "*",
                            "froms": "gas_mtr_meter_move",
                            "wheres": wheres + " 1=1",
                            "page": true,
                            "limit": 50
                        };
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    },//--findFilter
                }
            )
        }
    }
}()


var one = false;
var two = false;
if(areaId != "1"){

    $("#find_movebefore").on("change",function(){
        console.log($(this).val())
        console.log("-----",areaId)
        if(!two){
            if($(this).val() != areaId){
                console.log("333")
                one= true;
                $("#find_moveafter").val(areaId).trigger("change");
                one =false;
            }else{
                console.log("sadfg")
                one= true;
                $("#find_moveafter").val("").trigger("change");
                one =false;
            }
        }
        
    })
    
    $("#find_moveafter").on("change",function(){
        console.log($(this).val())
        if(!one){
            if($(this).val() !=areaId){
                two = true;
                $("#find_movebefore").val(areaId).trigger("change");
                two=false;
                
            }else{
                two = true;
                $("#find_movebefore").val("").trigger("change");
                two=false;
                
            }
        }
        
    })
}

if(areaId == "1"){

    $("#find_movebefore").on("change",function(){
        if($(this).val() == $("#find_moveafter").val()){
            bootbox.alert("移前表库和移后表库不能相同")
        }
    })
    
    $("#find_moveafter").on("change",function(){
        if($(this).val() == $("#find_movebefore").val()){
            bootbox.alert("移前表库和移后表库不能相同")
        }
    })
}



$("#out_level1").on("click",function(){
    window.location.href = "metermanage/applyremove_meter.html"
})