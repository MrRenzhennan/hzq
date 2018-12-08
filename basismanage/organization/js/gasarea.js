var xw;
var GasAreaAction = function () {

    // //helper
    // var unitHelper = RefHelper.create({
    //     ref_url:"gassysunit",
    //     ref_col:"unitId",
    //     ref_display:"unitname",
    // });

    var pAreaHelper = RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });

    //format
    var unitFormat = function () {
        return {
            f : function (val) {
                return pAreaHelper.getDisplay(val);
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

            xw=XWATable.init(
                {

                    //----------------table的选项-------
                    pageSize: 20, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle:true,
                    //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    // rowClicked: function(data) {
                    //     console.log('row clicked');   //data.event holds the original jQuery event.
                    //     console.log(data);            //data.row holds the underlying row you supplied.
                    // },
                    //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restbase: 'gasbizarea/?sort=posCode',
                    key_column:'areaId',
                    coldefs:[
                        {
                            col:"areaId",
                            friendly:"供气区域ID",
                            sorting:false,
                            validate:"required onlyNumber",
                            unique:"true",
                            input_number:true,

                            // add_readonly:"readonly",
                            hidden:true,
                            index:1
                        },
                        {
                            col:"posCode",
                            friendly:"位置码",
                            validate:"required",
                            sorting:false,
                            index:2
                        },
                        {
                            col:"areaCode",
                            friendly:"供气区域代码",
                            validate:"required",
                            sorting:false,
                            index:3
                        },
                        {
                            col:"areaName",
                            friendly:"供气区域名称",
                            validate:"required",
                            sorting:false,
                            index:4
                        },
                        {
                            col:"parentAreaId",
                            friendly:"上级区域",
                            validate:"required",
                            format:pAreaFormat,
                            inputsource:"select",
                            ref_url:"gasbizarea",
                            ref_name:"areaName",
                            ref_value:"areaId",
                            sorting:false,
                            index:5
                        },
                        {
                            col:"beginMonth",
                            friendly:"启用年月",
                            inputsource:"monthpicker",
                            date_format:"yyyymm",
                            index:6
                        },
                        {
                            col:"phone",
                            friendly:"电话",
                            sorting:false,
                            index:7
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            format:GasSysBasic.StatusFormat,
                            validate:"required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            sorting:false,
                            /*hidden:true,*/
                            index:8
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function(){
                        var filter=RQLBuilder.and([
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    }
                })
        }
    }
}();


$("#del_buttons").on("click",function(){
    var selrows = xw.getTable().getData(true);
    // console.log(selrows)

    bootbox.confirm({
        buttons: {
            confirm: {
                label: '确认',
                className: 'blue'
            },
            cancel: {
                label: '取消',
                className: 'btn-default'
            }
        },
        message: "<br><center><h4>确定删除选择（" + selrows.rows.length + "）条记录吗？</h4></center><br>",
        callback:function(result){
            if (!result) return;
            
            else{
                var ids=[];
                $.each(selrows.rows, function(index, row) {
                    ids.push(row.areaId);
                });
                console.log("delete:"+JSON.stringify(ids));
                var ret=Restful.updateRNQ(hzq_rest+"gasbizarea", ids.join(),{"status":"3"});
                if(ret.success){
                    bootbox.alert("<center><h4>删除成功。</h4></center>",function(){
                        xw.update();
                    })
                }else{
                    bootbox.alert("<center><h4>删除失败。</h4></center>")
                }

            }
        }
    })
})