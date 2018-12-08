var MrdMeterErrorExamine = function(){
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
        var base_url ='';
        var bd={"cols":"mr.meter_reading_id,mr.book_id,mr.serviceper_id,mr.countper_id,mr.gas_type_id," +
        "mr.ctm_archive_id,mr.meter_reading,mr.revise_reading,mr.",
            "froms":"",
            "wheres":"",
            "page":"true",
            "limit":50};


        XWATable.init(
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
                restbase: 'gasmrderror',
                //---------------行定义
                coldefs: [
                    {
                        col:"mrdErrorId",
                        friendly: "错误ID",
                        unique: true,
                        //readonly: "readonly",
                        sortOrder: "asc",
                        index:1
                    },
                    {
                        col:"meterReadingId",
                        friendly: "阅读ID",
                        index:2
                    },
                    {
                        col:"planMrdSwquen",
                        friendly: "计划抄表路线顺序",
                        index:3

                    },
                    {
                        col:"bookId",
                        friendly: "抄表本ID",
                        index:4
                    },
                    {
                        col:"bllDetailId",
                        friendly: "计费明细ID",
                        index:5
                    },
                    {
                        col:"ctmArchiveId",
                        friendly: "客户档案ID",
                        index:6
                    },
                    {
                        col:"customerId",
                        friendly: "客户ID",
                        index:7
                    },

                    {
                        col:"gasTypeId",
                        friendly: "用气性质ID",
                        index:8
                    },
                    {
                        col:"isBll",
                        friendly: "是否计费",
                        index:9
                    },
                    {
                        col:"isMrd",
                        friendly: "是否抄表",
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
                        col:"reviseReading",
                        friendly:"修正表读数",
                        index:16
                    },
                    {
                        col:"lastMeterReading",
                        friendly:"上次燃气表读数",
                        index:17
                    },
                    {
                        col:"lastReviseReading",
                        friendly:"上次修正表读数",
                        index:18
                    },
                    {
                        col:"barCode",
                        friendly:"条码号",
                        index:19
                    },
                    {
                        col:"chargeMeterReading",
                        friendly:"计费读数",
                        index:20
                    },
                    {
                        col:"chargingMeter",
                        friendly:"计费表",
                        index:21
                    },
                    {
                        col:"dailyMeasure",
                        friendly:"日均匀气量",
                        index:22
                    },
                    {
                        col:"budgetMeasure",
                        friendly:"用气量",
                        index:23
                    },
                    {
                        col:"countperId",
                        friendly:"核算员",
                        index:24
                    },
                    {
                        col:"serviceperId",
                        friendly:"客户服务员",
                        index:25
                    },
                    {
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
                    },
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
}();
