//抄表差错--列表
var MrdErrorExamine = function(){
        var xw;
    var login_info = JSON.parse(localStorage.getItem("user_info"));

        $('#daoru').click(function () {
            window.location="meterreading/error/meter_error_detail.html";
        });




        $('#daoru1').click(function () {
            window.location="meterreading/error/meter_examine_applyfor.html";
        });



    var valueFor=function(val){
    }
    var openButton = function() {
        return {
            f: function() {
                return "<a data-target='#apply' data-toggle='modal'>查看详情&nbsp;<i class='fa fa-plus'></i></a> ";
            }
        }
    }();

    $(function(){

            $('#divtable').html('');
            var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';

            var whereinfo = '';
            //数据权限

            if(login_info.userId && login_info.station_id =='1'){//核算员
                whereinfo +=" and mr.countper_id='"+login_info.userId+"' ";
            }else if(login_info.userId && login_info.station_id=='2'){//抄表员
                whereinfo +=" and mr.serviceper_id='"+login_info.userId+"' ";
            }else if(login_info.area_id){
                whereinfo +=" 1=1 and mr.area_id in ( select area_id"+
                " from gas_biz_area where parent_area_id='"+login_info.area_id+"' and status<>'3' union "+
                " select area_id from gas_biz_area where status<>'3' start with area_id='"+login_info.area_id+"' connect by prior area_id=parent_area_id "+
                " )  ";//本供气区域及子供气区域
            }
            whereinfo +=" and mr.copy_state<>'9' and ar.customer_state<>'99' and is_mrd='1' ";
            whereinfo +" order by mr.copy_time desc "
            var bd = {
                "cols":" mr.meter_reading_id,mr.book_code,mr.plan_copy_time,mr.copy_time,mr.ctm_archive_id,mr.book_id,mr.area_id,mr.serviceper_id," +
                "mr.countper_id,mr.copy_state,mr.copy_type,mr.is_mrd,mr.is_bll,mr.last_meter_reading,mr.meter_reading,mr.last_revise_reading," +
                "mr.revise_reading,mr.card_balanc_esum,mr.remaing_asnum,mr.last_remaing_asnum,mr.accumulated_gas,mr.last_accumulated_gas," +
                "mr.charge_meter_reading," +
                "ar.customer_code,ar.customer_name,ar.customer_address,ar.gas_type_id",
                "froms":" gas_mrd_meter_reading mr " +
                " left join gas_ctm_archive ar on ar.ctm_archive_id = mr.ctm_archive_id " +
                " ",
                "wheres": whereinfo,
                "page":"true",
                "limit":50
            };
            xw = XWATable.init(
                {
                    //----------------table的选项-------
                    pageSize: 5, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle:true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function(data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);            //data.row holds the underlying row you supplied.
                    },
                    //----------------基本restful地址---
                    //restbase: 'json/meterreading/error/icmeter_error.json',
                   // restbase: 'gasmrderror',
                    restURL: base_url + encodeURIComponent(JSON.stringify(bd)),
                    //---------------行定义
                    coldefs: [
                        {
                            col:"mrdMeterReadingId",
                            friendly: "抄表ID",
                            unique: true,
                            //readonly: "readonly",
                            sortOrder: "asc",
                            index:1
                        },
                        {
                            col:"areaId",
                            friendly: "供气区域",

                            index:2
                        },
                        {
                            col:"countperId",
                            friendly: "核算员",
                            index:3

                        },
                        {
                            col:"serviceperId",
                            friendly: "客户服务员",
                            index:4
                        },
                        {
                            col:"bookId",
                            friendly: "抄表本ID",
                            index:5
                        },
                        {
                            col:"bookCode",
                            friendly: "抄表本编号",
                            index:6
                        },
                        {
                            col:"ctmArchiveId",
                            friendly: "客户档案ID",
                            index:7
                        },

                        {
                            col:"customerCode",
                            friendly: "客户编号",
                            index:8
                        },
                        {
                            col:"customerName",
                            friendly: "客户名称",
                            index:9
                        },
                        {
                            col:"customerAddress",
                            friendly: "客户地址",
                            index:10
                        },
                        {
                            col:"copyState",
                            friendly: "抄表状态",
                            index:11
                        },
                        {
                            col:"copyType",
                            friendly:"抄表类型",
                            index:12
                        },
                        {
                            col:"copyTime",
                            friendly:"实际抄表时间",
                            index:13
                        },
                        {
                            col:"planCopyTime",
                            friendly:"计划抄表时间",
                            index:14
                        },
                        {
                            col:"meterReading",
                            friendly:"燃气表读数",
                            index:15
                        },
                        {
                            col:"lastMeterReading",
                            friendly:"上次燃气表读数",
                            index:16
                        },
                        {
                            col:"reviseReading",
                            friendly:"修正表读数",
                            index:17
                        },
                        {
                            col:"lastReviseReading",
                            friendly:"上次修正表读数",
                            index:18
                        },
                        {
                            col:"gasTypeId",
                            friendly:"用气性质",
                            index:19
                        },
                        {
                            col:"chargeMeterReading",
                            friendly:"计费读数",
                            index:20
                        },
                        {
                            col:"cardBalancEsum",
                            friendly:"抄回表内余额",
                            index:21
                        },
                        {
                            col:"remaingAsnum",
                            friendly:"抄回表内余量",
                            index:22
                        },
                        {
                            col:"lastRemaingAsnum",
                            friendly:"上次表内余量",
                            index:23
                        },
                        {
                            col:"accumulatedGas",
                            friendly:"抄回表内累计气量",
                            index:24
                        },
                        {
                            col:"lastAccumulatedGas",
                            friendly:"上次表内累计气量",
                            index:25
                        },
                      /*  {
                            col:"areaId",
                            friendly:"供气区域",
                            index:26
                        },
                        {
                            col:"pointLongitude",
                            friendly:"抄表员坐标经度",
                            index:27
                        },
                        {
                            col:"pointLatitude",
                            friendly:"抄表员坐标纬度",
                            index:28
                        },*/
                        {
                            col:"operate",
                            friendly:"操作",
                            index:29
                        }

                    ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function
                        var filter = "keyy="+$('#find_key').val();
                        return filter;
                    }//--findFilter
                }//--init
            );//--end init




            /* $('#find_provincename').on('input',function(e){
             console.log("changing::"+e.target.value)
             if(!e.target.value){
             XWATable.autoResetSearch();
             }
             });*/


        }
    );

    /*  var gasTypeHelper = RefHelper.create({
     ref_url: 'json/charging/gasType.json',
     ref_col:"value",
     ref_display:"name",
     });

     var gasTypeFormat = function () {
     return {
     f : function (val) {
     console.log("gasTypeFormat:" + val + ":" + gasTypeHelper.getDisplay(val));

     return gasTypeHelper.getDisplay(val);
     },
     }
     }();

     var gasCategoryHelper = RefHelper.create({
     ref_url: 'json/charging/gasCategory.json',
     ref_col:"gasCatvalue",
     ref_display:"gasCatname",
     });

     var gasCategoryFormat = function () {
     return {
     f : function (val) {
     //                console.log("gasCategoryFormat:" + val + ":" + gasCategoryHelper.getDisplay(val));

     return gasCategoryHelper.getDisplay(val);
     },
     }
     }();*/
}();