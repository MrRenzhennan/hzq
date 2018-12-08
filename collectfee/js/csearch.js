$(function () {
            var st = XWATable.init(
                {
                    divname: "divsearchtable",
                    //----------------table的选项-------
                    pageSize: 10,                //Initial pagesize
                    // filter: true,               //Show filter fields
                    // sorting: true,              //Enable sorting
                    columnPicker: false,         //Show the columnPicker button
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    pageSizes: [],
                    // pageSizes: [1,5,8,12,200],  //Set custom pageSizes. Leave empty array to hide button.
                    // hidePagerOnEmpty: true,     //Removes the pager if data is empty.
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---

                    //url:"hzqs/hzqrest/gasctmarchive/? fields={\"customerCode\":1}&query={\"customerCode\":\""+collectUtils.getContext("customer").customerCode+"\"}",

                    //restbase: '/hzqs/'+hzq_rest+'/gasctmarchive',
                   restbase: 'hzqrest/gasctmarchive',
                    key_column: "ctmArchiveId",
                    rowClicked: function(row) {
                        //console.log(row.row)
                        $(row.event.currentTarget).closest("tbody").find("tr").removeClass("selectedRow");
                        $(row.event.currentTarget).closest("tr").addClass("selectedRow");
                        $("#selectedCustomerCode").data("selectrow",row.row);
                        $("#btnConfirm").removeAttr("disabled");
                    },
                    rowDblClicked: function(row,e){
                        //var customerCode =  coldefs.customerCode;
                        //console.log(row)
                            $("#btnConfirm").click();
                    },
                    //findbtn : "select_button",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "ctmArchiveId",
                            unique: true,
                            hidden: true,
                            nonedit: "nosend"
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            //format:merchantFM,
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号"
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            nonedit: "nosend"
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类型"
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function
                        var filter_customerNo = undefined;
                        var filter_customerName = undefined;
                        var filter_tel = undefined;
                        var filter_customerAddress = undefined;

                        if ($('#find_customerNo').val()) {
                            filter_customerNo = RQLBuilder.equal("customerCode", $('#find_customerNo').val());
                        }

                        if ($('#find_customerName').val()) {
                            filter_customerName = RQLBuilder.like("customerName", $('#find_customerName').val()+"%");
                        }

                        if ($('#find_tel').val()) {
                            filter_tel = RQLBuilder.like("tel", $('#find_tel').val()+"%");
                        }

                        if ($('#find_customerAddress').val()) {
                            filter_customerAddress = RQLBuilder.like("customerAddress", $('#find_customerAddress').val()+"%");
                        }
                        var filter = RQLBuilder.and([
                            filter_customerNo, filter_customerName, filter_tel, filter_customerAddress
                        ]);
                        return filter.rql();
                    }
                })
        });