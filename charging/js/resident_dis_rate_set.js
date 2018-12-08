var modifiedByBuilder = function () {
    var user = JSON.parse(localStorage.getItem("user_info"));
    return "<input type='text' readonly class='bootbox-input bootbox-input-text form-control' name='modifiedBy' value='" + user.userId + "'>";
}

var modifiedTimeBuilder = function () {
    var modifiedTime = GasModBil.date_format(new Date(),'yyyy-MM-dd hh:mm:ss');
    return "<input type='text' readonly class='bootbox-input bootbox-input-text form-control' name='modifiedTime' value='" + modifiedTime + "'>";
}



var RsdtDisRateAction = function () {

    var xw ;

    var gasType1DataLength = 0;
    var gasType2DataLength = 0;
    var gasType2DateaArray = [];

    // 用气性质helper
    var gasTypeHelper=RefHelper.create({
        ref_url:"gasbizgastype",
        ref_col:"gasTypeId",
        ref_display:"gasTypeName"
    });
    var gasTypeFormat = function () {
        return {
            f : function (val) {
                return  gasTypeHelper.getDisplay(val);
            }
        }
    }();

    var detailedInfoFormat =function () {
        return {
            f : function (val) {
                return '<a id="todetail" href="charging/resident_dis_approval.html?' + val + '">明细</a>';
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

            var gasType1Helper=RefHelper.create({
                ref_url:"gasbizgastype?query={\"parentTypeId\":\"2\"}",
                ref_col:"gasTypeId",
                ref_display:"gasTypeName"
            });
            initSelect('gastype1')
            // 用气性质 select init
            $.map(gasType1Helper.getData(), function(value, key) {
                gasType1DataLength += 1;
                $('#gastype1').append('<option value="'+key+'">'+value+'</option>');
            });


            $('#gastype1').on("change", function () {
                var gasType2Helper = RefHelper.create({
                    ref_url:'gasbizgastype?query={"parentTypeId":' + $('#gastype1').val() + '}',
                    ref_col:"gasTypeId",
                    ref_display:"gasTypeName",
                });

                gasType2DataLength = 0;
                gasType2DateaArray = [];
                $.map(gasType2Helper.getData(), function (value, key) {
                    gasType2DateaArray.push(key);
                    gasType2DataLength = gasType2DataLength + 1;
                })

                if(gasType2DataLength > 0){//如果根据一级查出数据，则二级显示，并赋值
                    $('#gasType2Div').removeClass('hide');
                    initSelect('gastype2');

                    $.map(gasType2Helper.getData(), function(value, key) {
                        $('#gastype2').append('<option value="'+key+'">'+value+'</option>');
                    });
                }else{
                    if(!$('#gasType2Div').hasClass('hide')) $('#gasType2Div').addClass('hide')
                    initSelect('gastype2');
                }
            });

            function initSelect(elem) {
                $('#' + elem).children().remove();
                $('#' + elem).append('<option value="" selected="selected">请选择...</option>');
                $('#' + elem).select2().placeholder = '请选择...'
            }

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
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasbllrsdtdct',
                    key_column:'rsdtDctId',
                    coldefs:[

                        {
                            col:"rsdtDctId",
                            friendly:"居民优惠ID",
                            unique:"true",
                            hidden:true,
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"gasTypeId",
                            friendly:"用气性质",
                            format:gasTypeFormat,
                            inputsource: "select",
                            ref_url:  "gasbizgastype",
                            ref_name: "gasTypeName",
                            ref_value: "gasTypeId",
                            validate:"required",
                            readonly:"readonly",
                            index:1
                        },
                        {
                            col:"persons",
                            friendly:"家庭人口数",
                            validate:"required,onlyNumber,length[0-20]",
                            index:2
                        },
                        {
                            col:"discount",
                            friendly:"优惠气量",
                            validate:"required,onlyNumber,length[0-20]",
                            index:3
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:GasModBil.dateFormat,
                            nonedit: "nosend",
                            // // format:dateFormat,
                            //inputsource:"datetimepicker",
                            // date_format:"yyyy-mm-dd hh:ii:ssZ",
                            readonly:"readonly",
                            index:4
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            nonedit:"nosend",
                            index:6
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            unique:"true",
                            readonly:"readonly",
                            nonedit:"nosend",
                            // inputsource:"custom",
                            // inputbuilder:"modifiedByBuilder",
                            //format:detailedInfoFormat,
                            index:7
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            format:GasModBil.dateFormat,
                            nonedit:"nosend",
                            // inputsource:"custom",
                            // inputbuilder:"modifiedTimeBuilder",
                           // format:detailedInfoFormat,
                            index:8
                        }




                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var gastype , find_persons;

                        if($('#gastype1').val()){
                            if($('#gastype2').val()){//第一个有，第二个也有则选择第二个
                                gastype=RQLBuilder.equal("gasTypeId",$('#gastype2').val());
                            }else{//第一个有，第二个没有,先判断第一个有没有子节点
                                console.log("gasType2Datalength is ::::", typeof gasType2DataLength);
                                if(gasType2DataLength > 0){//有叶子节点
                                    gastype = RQLBuilder.condition_fc("gasTypeId", "$in", "[" + gasType2DateaArray.join() + "]")
                                    // var gasTypels = RQLBuilder.condition_fc("gasTypeId","$in", "["+gasTypeIdArray.join()+"]")
                                }else {//没有叶子节点，说明其本身就是叶子节点
                                    gastype = RQLBuilder.equal("gasTypeId", $('#gastype1').val());
                                }
                            }
                        }

                        if($('#gastype').val())
                        {
                            gastype=RQLBuilder.equal("gasTypeId",$('#gastype').val());
                        }

                        if($('#find_persons').val())
                        {
                            find_persons=RQLBuilder.like("persons",$('#find_persons').val());
                        }

                        var filter=RQLBuilder.and([
                            gastype , find_persons
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },

                    onUpdated: function(ret,jsondata){
                        jsondata['modifiedTime'] = GasModBil.date_format(new Date(),'yyyy-MM-ddThh:mm:ss');
                        jsondata['modifiedBy'] = JSON.parse(localStorage.getItem("user_info")).userId;
                        return  validateForm(jsondata);
                    },

                    onDeleted: function(ret,jsondata){
                        //return  validateForm(jsondata);
                    },
                }) //--init
        },
    }
}();
