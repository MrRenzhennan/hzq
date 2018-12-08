/**
 * Created by alex on 2017/5/4.
 */
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $('#find_area').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});
var queryCondion = RQLBuilder.and([
    RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea)),
    RQLBuilder.equal("status","1"),
]).rql()
var QueryEmployeeAction = function () {
    // 供气区域helper
    var areaHelper=RefHelper.create({
         ref_url:"gasbizarea",
         ref_col:"areaId",
         ref_display:"areaName",
     });

    // 单位helper
    var unitHelper=RefHelper.create({
        ref_url:"gassysunit",
        ref_col:"unitId",
        ref_display:"unitName",
    });

    // 岗位helper
    var stationHelper=RefHelper.create({
        ref_url:"gasbizstation",
        ref_col:"stationId",
        ref_display:"stationName",
    });

    // 网点helper
    var chargeUnitHelper=RefHelper.create({
        ref_url:"gasbizchargeunit",
        ref_col:"chargeUnitId",
        ref_display:"chargeUnitName",
    });

    var areaFormat=function(){
        return {
            f: function(val){
                return areaHelper.getDisplay(val)==0 ? "" : areaHelper.getDisplay(val);
            }
        }
    }();

    var unitFormat=function(){
        return {
            f: function(val){
                return unitHelper.getDisplay(val);
            }
        }
    }();

    var stationFormat=function(){
        return {
            f: function(val){
                return stationHelper.getDisplay(val);
            }
        }
    }();

    var chargeUnitFromat=function(){
        return {
            f: function(val){
                return chargeUnitHelper.getDisplay(val)==0 ? "" : chargeUnitHelper.getDisplay(val);
            }
        }
    }();

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper:function(){
            // 单位 select init
            $.map(chargeUnitHelper.getData(), function(value, key) {
                $('#find_chargeUnit').append('<option value="'+key+'">'+value+'</option>');
            });
            $.map(stationHelper.getData(), function(value, key) {
                $('#find_station').append('<option value="'+key+'">'+value+'</option>');
            });
        },

        reload:function(){

            $('#divtable').html('');

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: false,
                    checkAllToggle:false,
                    //----------------基本restful地址---
                    restbase: 'gassysuser/?query='+queryCondion,
                    key_column:'userId',
                    coldefs:[
                        {
                            col:"userId",
                            friendly:"用户ID",
                            unique:"true",
                            hidden:true,
                            index:1
                        },
                        {
                            col:"employeeCode",
                            friendly:"工作人员代码",
                            index:2
                        },
                        {
                            col:"employeeName",
                            friendly:"工作人员姓名",
                            index:3
                        },
                        {
                            col:"unitId",
                            friendly:"单位",
                            format:unitFormat,
                            ref_url:  "gassysunit",
                            ref_name: "unitName",
                            ref_value: "unitId",
                            index:4
                        },
                        {
                            col:"chargeUnitId",
                            friendly:"营业网点",
                            format:chargeUnitFromat,
                            index:5
                        },
                        {
                            col:"stationId",
                            friendly:"岗位",
                            format:stationFormat,
                            index:6
                        },

                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaFormat,
                            index:7
                        },
                        {
                            col:"chargeUnitId",
                            friendly:"营业网点",
                            format:chargeUnitFromat,
                            index:8
                        },
                        {
                            col:"loginName",
                            friendly:"登录用户名",
                            index:9
                        },
                        // {
                        //     col:"password",
                        //     friendly:"用户系统密码",
                        //     index:7
                        // },
                        //
                        // {
                        //     col:"isLogin",
                        //     friendly:"是否可登陆",
                        //     index:19
                        // },
                        {
                            col:"tel",
                            friendly:"电话",
                            // hidden:true,
                            index:10
                        },

                        {
                            col:"mobile",
                            friendly:"用户手机",
                            // hidden:true,
                            index:11
                        },
                        {
                            col:"email",
                            friendly:"邮箱",
                            hidden:true,
                            index:12
                        },
                        {
                            col:"address",
                            friendly:"用户办公地址",
                            hidden:true,
                            index:13
                        },
                        {
                            col:"remark",
                            friendly:"备注",
                            hidden:true,
                            index:14
                        },

                        // {
                        //     col:"createdBy",
                        //     friendly:"创建人",
                        //     hidden:true,
                        //     index:13
                        // },
                        // {
                        //     col:"createTime",
                        //     friendly:"创建时间",
                        //     hidden:true,
                        //     index:15
                        // },
                        // {
                        //     col:"modifiedBy",
                        //     friendly:"变更人",
                        //     hidden:true,
                        //     index:14
                        // },
                        // {
                        //     col:"modifiedTime",
                        //     friendly:"变更时间",
                        //     hidden:true,
                        //     index:17
                        // },
                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_chargeUnit , find_station,find_userCode,find_userName;

                        if($('#find_area').val())
                        {
                            find_chargeUnit=RQLBuilder.equal("areaId",$('#find_area').val());
                        }else{
                            find_chargeUnit = RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        }
                        if($('#find_station').val())
                        {
                            find_station=RQLBuilder.equal("stationId",$('#find_station').val());
                        }
                        if($('#find_userCode').val())
                        {
                            find_userCode=RQLBuilder.equal("loginName",$('#find_userCode').val());
                        }
                        if($('#find_userName').val())
                        {
                            find_userName=RQLBuilder.equal("employeeName",$('#find_userName').val());
                        }
                        var status = RQLBuilder.equal("status","1");
                        var filter=RQLBuilder.and([
                            find_chargeUnit , find_station,find_userCode,find_userName,status
                        ]);
                        xw.setRestURL(hzq_rest + 'gassysuser');
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    }
                })
        }
    }
}();
