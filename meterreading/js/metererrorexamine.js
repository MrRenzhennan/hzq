var MrdMeterErrorExamine = function(){
    var valueFor=function(val){
    }
    var openButton = function() {
        return {
            f: function() {
                return "<a data-target='#apply' data-toggle='modal'>�鿴����&nbsp;<i class='fa fa-plus'></i></a> ";
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
                //----------------table��ѡ��-------
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
                //----------------����restful��ַ---
                //restbase: 'json/meterreading/error/icmeter_error.json',
                restbase: 'gasmrderror',
                //---------------�ж���
                coldefs: [
                    {
                        col:"mrdErrorId",
                        friendly: "����ID",
                        unique: true,
                        //readonly: "readonly",
                        sortOrder: "asc",
                        index:1
                    },
                    {
                        col:"meterReadingId",
                        friendly: "�Ķ�ID",
                        index:2
                    },
                    {
                        col:"planMrdSwquen",
                        friendly: "�ƻ�����·��˳��",
                        index:3

                    },
                    {
                        col:"bookId",
                        friendly: "����ID",
                        index:4
                    },
                    {
                        col:"bllDetailId",
                        friendly: "�Ʒ���ϸID",
                        index:5
                    },
                    {
                        col:"ctmArchiveId",
                        friendly: "�ͻ�����ID",
                        index:6
                    },
                    {
                        col:"customerId",
                        friendly: "�ͻ�ID",
                        index:7
                    },

                    {
                        col:"gasTypeId",
                        friendly: "��������ID",
                        index:8
                    },
                    {
                        col:"isBll",
                        friendly: "�Ƿ�Ʒ�",
                        index:9
                    },
                    {
                        col:"isMrd",
                        friendly: "�Ƿ񳭱�",
                        index:10
                    },
                    {
                        col:"copyState",
                        friendly: "����״̬",
                        index:11
                    },
                    {
                        col:"copyType",
                        friendly:"��������",
                        index:12
                    },
                    {
                        col:"copyTime",
                        friendly:"ʵ�ʳ���ʱ��",
                        index:13
                    },
                    {
                        col:"planCopyTime",
                        friendly:"�ƻ�����ʱ��",
                        index:14
                    },
                    {
                        col:"meterReading",
                        friendly:"ȼ�������",
                        index:15
                    },
                    {
                        col:"reviseReading",
                        friendly:"���������",
                        index:16
                    },
                    {
                        col:"lastMeterReading",
                        friendly:"�ϴ�ȼ�������",
                        index:17
                    },
                    {
                        col:"lastReviseReading",
                        friendly:"�ϴ����������",
                        index:18
                    },
                    {
                        col:"barCode",
                        friendly:"�����",
                        index:19
                    },
                    {
                        col:"chargeMeterReading",
                        friendly:"�ƷѶ���",
                        index:20
                    },
                    {
                        col:"chargingMeter",
                        friendly:"�Ʒѱ�",
                        index:21
                    },
                    {
                        col:"dailyMeasure",
                        friendly:"�վ�������",
                        index:22
                    },
                    {
                        col:"budgetMeasure",
                        friendly:"������",
                        index:23
                    },
                    {
                        col:"countperId",
                        friendly:"����Ա",
                        index:24
                    },
                    {
                        col:"serviceperId",
                        friendly:"�ͻ�����Ա",
                        index:25
                    },
                    {
                        col:"areaId",
                        friendly:"��������",
                        index:26
                    },
                    {
                        col:"pointLongitude",
                        friendly:"����Ա���꾭��",
                        index:27
                    },
                    {
                        col:"pointLatitude",
                        friendly:"����Ա����γ��",
                        index:28
                    },
                    {
                        col:"operate",
                        friendly:"����",
                        index:29
                    }

                ],
                //---------------��ѯʱ��������
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
