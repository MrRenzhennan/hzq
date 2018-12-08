var MrdICMeterErrorExamine = function () {
    var openButton = function () {
        return {
            f: function () {
                return "<a data-target='#apply' data-toggle='modal'>�鿴����&nbsp;<i class='fa fa-plus'></i></a> ";
            }
        }
    }();

    $(function () {
            XWATable.init(
                {
                    //----------------table��ѡ��-------
                    pageSize: 5, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);            //data.row holds the underlying row you supplied.
                    },
                    //----------------����restful��ַ---
                    restbase: 'json/meterreading/error/icmeter_error.json',
                    //---------------�ж���
                    coldefs: [
                        {
                            col: "versionID",
                            friendly: "����ʱ��",
                            unique: true,
                            readonly: "readonly",
                            sortOrder: "asc",
                            index: 1
                        },
                        {
                            col: "gasCategory",
                            friendly: "���뵥��",
                            inputsource: "select",
                            readonly: "readonly",
                            ref_url: 'json/charging/gasCategory.json',
                            ref_name: "gasCatname",
                            ref_value: "gasCatvalue",
                            format: gasCategoryFormat,
                            index: 2
                        },
                        {
                            col: "gasType",
                            friendly: "������",
                            inputsource: "select",
                            readonly: "readonly",
                            ref_url: 'json/charging/gasType.json',
                            ref_name: "name",
                            ref_value: "value",
                            format: gasTypeFormat,
                            index: 3

                        },
                        {
                            col: "price",
                            friendly: "�ͻ���",
                            readonly: "readonly",
                            index: 4
                        },
                        /*  {
                         col:"gasEnd1",
                         friendly: "����ʱ��",
                         readonly: "readonly",
                         index:5
                         },*/
                        {
                            col: "gasEnd",
                            friendly: "�����",
                            readonly: "readonly",
                            index: 5
                        },
                        /*  {
                         col:"gasStart",
                         friendly: "���������",
                         readonly: "readonly",
                         index:6
                         },*/
                        {
                            col: "gasStart",
                            friendly: "����ʣ������",
                            readonly: "readonly",
                            index: 6
                        },
                        /* {
                         col:"gasStart1",
                         friendly: "ϵ��",
                         readonly: "readonly",
                         index:7
                         },*/

                        {
                            col: "changeTime",
                            friendly: "����λ��",
                            inputsource: "datepicker",
                            readonly: "readonly",
                            index: 8
                        },
                        {
                            col: "effectTime",
                            friendly: "�Ƿ�����",
                            inputsource: "datepicker",
                            readonly: "readonly",
                            index: 9
                        },
                        {
                            col: "changePerson1",
                            friendly: "����״̬",
                            readonly: "readonly",
                            index: 10
                        },
                        {
                            col: "changePerson",
                            friendly: "���뱸ע",
                            readonly: "readonly",
                            hidden: true,
                            index: 11
                        },
                        {
                            col: "UUID",
                            friendly: "����",
                            nonedit: "nosend",
                            format: openButton,
                            index: 12
                        }

                    ],
                    //---------------��ѯʱ��������
                    findFilter: function () {//find function
                        var filter = "keyy=" + $('#find_key').val();
                        return filter;
                    }//--findFilter
                }//--init
            );//--end init


            $('#find_provincename').on('input', function (e) {
                console.log("changing::" + e.target.value)
                if (!e.target.value) {
                    XWATable.autoResetSearch();
                }
            });


        }
    );

    var gasTypeHelper = RefHelper.create({
        ref_url: 'json/charging/gasType.json',
        ref_col: "value",
        ref_display: "name",
    });

    var gasTypeFormat = function () {
        return {
            f: function (val) {
                console.log("gasTypeFormat:" + val + ":" + gasTypeHelper.getDisplay(val));

                return gasTypeHelper.getDisplay(val);
            },
        }
    }();

    var gasCategoryHelper = RefHelper.create({
        ref_url: 'json/charging/gasCategory.json',
        ref_col: "gasCatvalue",
        ref_display: "gasCatname",
    });

    var gasCategoryFormat = function () {
        return {
            f: function (val) {
//                console.log("gasCategoryFormat:" + val + ":" + gasCategoryHelper.getDisplay(val));

                return gasCategoryHelper.getDisplay(val);
            },
        }
    }();
}();
