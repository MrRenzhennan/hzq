/**
 * Created by Administrator on 2017/4/21 0021.
 */


var str =location.search;
var xw;
var detailsofsuppllyManagerAction = function () {
    //供气区域helper
    var communityidHelper = RefHelper.create({
        ref_url:"gassysarea",
        ref_col:"areaId",
        ref_display:"areaname"
    });
    //核算员
    var pCountoperHelper = RefHelper.create({
        ref_url: "fcsysuser",
        ref_col: "employeecode",
        ref_display: "employeename",
    });

    //抄表员
    var countperHelper=RefHelper.create({
        ref_url:"fcsysuser",
        ref_col:"userId",
        ref_display:"employeename",
    });
    var areaFormat=function(){
        return {
            f: function(val){
                return communityidHelper.getDisplay(val);
            },
        }
    }();

    return {
        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper : function () {
            $.map(communityidHelper.getData(),function (value,key) {
                $("#find_communityid").append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(pCountoperHelper.getData(), function (value, key) {
                $('#find_account').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(countperHelper.getData(), function (value, key) {
                $('#meter_reader').append('<option value="' + key + '">' + value + '</option>');
            });

        },
        reload : function () {
            $('#divtable').html('');

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle:true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restbase: 'gasmrdplan/listbookplandetail'+str,
                    key_column:'ctmArchiveId',
                   /* rowClicked:function(data){
                        location.href = '/meterreading/plan/cusinformation.html?/'+data.row.bookId;
                    },*/
                    coldefs:[
                        {
                            col:"RN",
                            friendly:"序号",
                            unique : true,
                            nonendit : 'nosend',
                            readonly : 'readonly',
                            sorting : false,
                            index:1
                        },

                        {
                            col:"areaId",
                            friendly:"供气区域",
                            readonly:"readonly",
                            format:areaFormat,
                            ref_url:"gassysarea",
                            ref_name:"areaname",
                            ref_value:"areaId",
                            sorting:false,
                            index:2
                        },
                        {
                            col:"bookId",
                            friendly:"抄表本ID",
                            sorting:false,
                            index:3
                        },
                        {
                            col:"bookcode",
                            friendly:"抄表本编号",
                            sorting:false,
                            index:4
                        },
                        {
                            col:"booktype",
                            friendly:"抄表本类型",
                            format:enumReverse("enumctrl/customerKindEnum"),
                            ref_url:"enumctrl/4s/customerKindEnum",
                            ref_name:"enumName",
                            ref_value:"enumVal",
                            sorting:false,
                            index:5
                        },
                        {
                            col:"copydate",
                            friendly:"抄表日期",
                            readonly:"readonly",
                            inputsource:"datepicker",
                            sorting:false,
                            index:6
                        },
                        {
                            col:"doorcount",
                            friendly:"户数",
                            readonly:"readonly",
                            inputsource:"datepicker",
                            sorting:false,
                            index:7
                        },
                        {
                            col:"normalcount",
                            friendly:"正常户数",
                            readonly:"readonly",
                            sorting:false,
                            index:8
                        },
                        {
                            col:"unboltcount",
                            friendly:"未开栓户数",
                            readonly:"readonly",
                            sorting:false,
                            index:9
                        },{
                            col:"address",
                            friendly:"地址",
                            readonly:"readonly",
                            sorting:false,
                            unique:"true",
                            index:10
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function
                        var resUrl="gasmrdplan/listbookplandetail?";
                        if ($('#find_communityid option:selected').val()) {
                            resUrl += "areaId=" + $('#find_communityid option:selected').val();
                        }
                        if ($('#find_account option:selected').val()) {
                            resUrl += "&serviceperid=" + $('#find_account option:selected').val()
                        }
                        if ($('#meter_reader option:selected').val()) {
                            resUrl += "&countperid=" + $('#meter_reader option:selected').val()
                        }
                        if ($('#createtimefrom').val() || $('#createtimeto').val() ) {
                            resUrl += "&end_date=" + $('#createtimeto').val() + "&begin_date=" + $('#createtimefrom').val();
                        }
                        console.log(resUrl)
                        var queryUrl = hzq_rest  +resUrl;

                        xw.setRestURL(queryUrl);
                        return "";
                    }
                })
        }

    }

}();
