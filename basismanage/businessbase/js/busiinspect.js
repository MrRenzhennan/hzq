var BaseAction = function () {

    // 供气区域helper
    var areaHelper=RefHelper.create({
        ref_url:"gassysarea",
        ref_col:"areaId",
        ref_display:"areaname",
    });

    // 上级单位helper
    var pUnitHelper=RefHelper.create({
        ref_url:"gassysunit",
        ref_col:"unitId",
        ref_display:"unitname",
    });

    // 主管人员helper
    var leadHelper=RefHelper.create({
        ref_url:"fcsysuser",
        ref_col:"userId",
        ref_display:"employeename",
    });

    var areaFormat=function(){
        return {
            f: function(val){
                return areaHelper.getDisplay(val);
            },
        }
    }();

    var pUnitFormat=function(){
        return {
            f: function(val){
                return pUnitHelper.getDisplay(val);
            },
        }
    }();

    var leadFormat=function(){
        return {
            f: function(val){
                return leadHelper.getDisplay(val);
            },
        }
    }();

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper:function(){
            // 供气区域 select init
            $.map(areaHelper.getData(), function(value, key) {
                $('#find_areaId').append('<option value="'+key+'">'+value+'</option>');
            });

        },

        reload:function(){

            $('#divtable').html('');

            this.xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gascsrbusiinspect',
                    key_column:'busiinspectId',
                    coldefs:[

                        {
                            col:"officialreply",
                            friendly:"审批意见",
                            index:1
                        },
                        {
                            col:"stationId",
                            friendly:"岗位ID",
                            index:2
                        },
                        {
                            col:"unitId",
                            friendly:"单位ID",
                            index:3
                        },
                        {
                            col:"inspectorder",
                            friendly:"审批次序",
                            index:4
                        },
                        {
                            col:"inspectdate",
                            friendly:"审批日期",
                            index:5
                        },
                        {
                            col:"inspectstate",
                            friendly:"审批状态",
                            index:6
                        },
                        {
                            col:"busiinspectId",
                            friendly:"业务审批ID",
                            unique:"true",
                            index:7
                        },
                        {
                            col:"processinstanceid",
                            friendly:"流程实例id",
                            index:8
                        },
                        {
                            col:"taskinfoid",
                            friendly:"任务信息ID:任务信息ID:",
                            index:9
                        },

                    ],


                    // 查询过滤条件
                    findFilter: function(){
                        var find_areaId , find_unitname;

                        if($('#find_areaId').val())
                        {
                            find_areaId=RQLBuilder.equal("areaId",$('#find_areaId').val());
                        }

                        if($('#find_unitname').val())
                        {
                            find_unitname=RQLBuilder.like("unitname",$('#find_unitname').val());
                        }

                        var filter=RQLBuilder.and([
                            find_areaId , find_unitname
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
        },

    }
}();
