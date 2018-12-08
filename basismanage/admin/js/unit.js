var xw;

var typeName = function(){
    return "<select id='status' name='status' class='form-control select2me'><option value='1'>启用</option><option value='2'>停用</option><option value='3'>已删除</option></select>";
}
var UnitAction = function () {
    // 上级单位helper
    var pUnitHelper=RefHelper.create({
        ref_url:"gassysunit",
        ref_col:"unitId",
        ref_display:"unitName",
    });
    // 主管人员helper
    var leadHelper=RefHelper.create({
        ref_url:"gassysuser",
        ref_col:"userId",
        ref_display:"employeeName",
    });
    var pAreaHelper = RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });
    var pUnitFormat=function(){
        return {
            f: function(val){
                return pUnitHelper.getDisplay(val);
            }
        }
    }();
	
    var leadFormat=function(){
        return {
            f: function(val){
                return leadHelper.getDisplay(val);
            }
        }
    }();
    var pAreaFormat = function () {
        return {
            f : function (val) {
                if(val == 0){
                    return "无上级区域"
                }
                return pAreaHelper.getDisplay(val);
            }
        }
    }();
    return {

        init: function () {
            this.reload();
        },
        reload:function(){

            $('#divtable').html('');
            var unitId = JSON.parse(localStorage.getItem('user_info')).unit_id;
            var jsonData= new Array();
            // jsonData.push(unitId)
           /* $.ajax({
                type: 'get',
                url: hzq_rest+'gasbizareaunit/?query={"areaId":"'+unitId+'"}',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(data) {
                    //jsonData = data;
                    console.log(data)
                    $.each(data,function(index,item){
                        jsonData.push(item.chargeUnitId)
                    })
                },
                error: function(err) {
                    // alert("find all err");
                }
            });

            console.log(jsonData);
            $.ajax({
                type: 'get',
                url: hzq_rest+'gassysunit/?query={"unitId":{"$in":'+JSON.stringify(jsonData)+'}}',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(data) {
                    //jsonData = data;
                    console.log(data)
                    $.each(data,function(index,item){
                        jsonData.push(item.parentUnitId)
                    })
                },
                error: function(err) {
                    // alert("find all err");
                }
            });*/
           /* var bd = {
                "cols": "a.*",
                "froms": "gas_sys_unit a start with a.unit_id='"+unitId+"' connect by a.parent_unit_id = prior a.unit_id",
                "wheres": "",
                "page": true,
                "limit": 50
            };*/

            console.log(jsonData);
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,

                    columnPicker: true,         //Show the columnPicker button
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle:true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()

                    //----------------基本restful地址---?query={"areaId":{"$in":'+JSON.stringify(jsonData)+'}}
                    // restbase: 'gassysunit?query={"areaId":{"$in":'+JSON.stringify(jsonData)+'}}',
                    key_column: "unitId",
                    restbase:"gassysunit/?sort=unitCode",
                    // restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    exportxls:{
                        title:"单位列表",
                        remap:{"parentUnitId":"db@GAS_SYS_UNIT,unitId,unitName","leadId":"db@GAS_SYS_USER,userId,employeeName"},
                    },
                    //---------------行定义
                    coldefs: [
                        {
                            col:"unitId",
                            friendly:"unitId",
                            hidden:"hidden",
                            nonedit:"nosend",
                            unique:true,
                            index:2
                        },
                        {
                            col:"unitCode",
                            friendly:"单位代码",
                            validate:"required",

                            index:2
                        },
                        {
                            col:"unitName",
                            friendly:"单位名称",
                            validate:"required",
                            index:4
                        },
                        {
                            col:"parentUnitId",
                            friendly: "上级单位",
                            validate:"required",
                            format:pUnitFormat,
                            inputsource: "select",
                            ref_url:  "gassysunit",
                            ref_value: "unitId",
                            ref_name: "unitName",
                            index:5
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            validate:"required",
                            format:pAreaFormat,
                            inputsource: "select",
                            ref_url:  "gasbizarea",
                            ref_name: "areaName",
                            ref_value: "areaId",
                            index:6
                        },
                        {
                            col:"leadId",
                            friendly:"主管人员",
                            validate:"required",
                            format:leadFormat,
                            ref_url:  "gassysuser",
                            ref_name: "employeename",
                            ref_value: "leadId",
                            index:7
                        },

                        {
                            col:"status",
                            friendly:"状态",
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            format:GasSysBasic.StatusFormat,
                            index:8
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function(){
                        var  find_unitname;
                        if($('#find_unitname').val())
                        {
                            find_unitname=RQLBuilder.like("unitName",$.trim($('#find_unitname').val()));
                        }
                        var filter=RQLBuilder.and([
                              find_unitname
                        ]);
                        return filter.rql();
                       /* console.log($('#find_unitname').val());
                        console.log(unitId)
                        bd = {
                            "cols": "a.*",
                            "froms": "gas_sys_unit a",
                            "wheres": "unit_name like '%"+$('#find_unitname').val()+"%' start with a.unit_id='"+unitId+"' connect by a.parent_unit_id = prior a.unit_id ",
                            "page": true,
                            "limit": 50
                        };

                        console.log("findFilter::");

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));*/


                    },

                    onAdded: function(ret,jsondata){
                        /*xw.setRestURL(hzq_rest +　"gassysunit");
                        xw.update();*/
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        // xw.setRestURL(hzq_rest + "gassysunit");
                        // xw.update();
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){
                        // xw.setRestURL(hzq_rest + "gassysunit");
                    },
                })
        }
    }
}();
