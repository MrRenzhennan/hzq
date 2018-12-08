var gabagePriceAction = function () {

    var xw ;

    var gasType1DataLength = 0;
    var gasType2DataLength = 0;
    var gasType2DateaArray = [];

    // 用气性质helper
    var gasTypeHelper=RefHelper.create({
        ref_url:"gasbizgastype",
        ref_col:"gasTypeId",
        ref_display:"gasTypeName",
    });


    var gasTypeFormat=function(){
        return {
            f: function(val){
                return gasTypeHelper.getDisplay(val);
            },
        }
    }();

/*    var gasTypeFormat = function () {
        return {
            f : function (val) {
                return "<a href='/charging/garbage_history.html?" + val+ "'>"+gasTypeHelper.getDisplay(val)+"</a>";
            }
        }
    }();*/

/*    var operateFormat = function () {
        return {
            f : function (val,row) {
                // alert(1)
                return "<a href='charging/garbage_cantango.html?" +gasTypeHelper.getDisplay(row.gastypeId)+"?"+row.gastypeId+"'> 顺价</a>";
            }
        }
    }();*/

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
            this.initGasTypeTree();
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
                if(key == '202' || key == '203' || key == '204'){

                }else{
                    gasType1DataLength += 1;
                    $('#gastype1').append('<option value="'+key+'">'+value+'</option>');
                }
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
                    restbase: 'gasbllwasteprice',
                    key_column: "wastePriceId",
                    //---------------行定义
                    coldefs:[
                        {
                            col:"wastePriceId",
                            friendly:"垃圾费价格ID",
                            hidden:true,
                            unique:"true",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"gasTypeId",
                            friendly:"用气类型",
                            format:gasTypeFormat,
                            inputsource: "select",
                            ref_url:  "gasbizgastype",
                            ref_name: "gasTypeName",
                            ref_value: "gasTypeId",
                            index:2
                        },
                        {
                            col:"priceVersion",
                            friendly:"价格版本",
                            validate:"required,length[0-20]",
                            index:3
                        },
                        {
                            col:"price",
                            friendly:"费用标准",
                            validate:"required,money,length[0-100]",
                            index:4
                        },

                        {
                            col:"persons",
                            friendly:"家庭人口数",
                            validate:"required,onlyNumber,length[0-20]",
                            index:5
                        },

                        {
                            col:"startTime",
                            friendly:"开始时间",
                            format:GasModBil.dateFormat,
                            inputsource: "datepicker",
                            validate:"date",
                            index:6
                        },
                        {
                            col:"endTime",
                            friendly:"结束时间",
                            format:GasModBil.dateFormat,
                            inputsource: "datepicker",
                            validate:"date",
                            index:7
                        },
                        {
                            col:"createTime",
                            friendly:"调价时间",
                            inputsource:"datepicker",
                            validate:"date",
                            format:GasModBil.dateFormat,
                            index:8
                        },
                        {
                            col:"chargeType",
                            friendly:"收费模式",
                            nonedit: "nosend",
                            hidden:true,
                            index:9
                        },
                        {
                            col:"remark",
                            friendly:"备注",
                            index:10
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:GasModBil.dateFormat,
                            nonedit: "nosend",
                            index:11
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            nonedit:"nosend",
                            //format:operateFormat,
                            index:12
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            format:GasModBil.dateFormat,
                            nonedit:"nosend",
                            index:13
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            nonedit:"nosend",
                          //  format:operateFormat,
                            index:14
                        }





                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var queryUrl=hzq_rest+"gasbllwasteprice";
                        var querys=new Array()

                        var gasTypeId;

                        if($('#gastype1').val()){
                            if($('#gastype2').val()){//第一个有，第二个也有则选择第二个
                                gasTypeId=RQLBuilder.equal("gasTypeId",$('#gastype2').val());
                            }else{//第一个有，第二个没有,先判断第一个有没有子节点
                                if(gasType2DataLength > 0){//有叶子节点
                                    gasTypeId = RQLBuilder.condition_fc("gasTypeId", "$in", "[" + gasType2DateaArray.join() + "]")
                                    // var gasTypels = RQLBuilder.condition_fc("gasTypeId","$in", "["+gasTypeIdArray.join()+"]")
                                }else {//没有叶子节点，说明其本身就是叶子节点
                                    gasTypeId = RQLBuilder.equal("gasTypeId", $('#gastype1').val());
                                }
                            }
                            querys.push(gasTypeId)
                        }

                        if ($('#find_gastypeId').val()) {
                            querys.push(RQLBuilder.like("gasTypeId", $('#find_gastypeId').val()));
                        }

                        if ($('#find_startTime').val()) {
                            var effectTime = RQLBuilder.condition("effectTime","$gt","to_date('"+ $('#find_startTime').val() +"','yyyy-MM-dd')");
                            querys.push(effectTime);
                        }
                        if(querys.length>0){
                            queryUrl += "?query="+RQLBuilder.and(querys).rql();
                        }

                        xw.setRestURL(queryUrl);
                        return "";
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
                    },
                }) //--init
        },

        initGasTypeTree : function(){
            var restURL = 'hzqs/bil/pbgtr.do?fh=GTRBIL0000000J00&resp=bd';
            $.ajax({
                type : 'POST',
                url : restURL,
                dataType : 'json',
                cache : false,
                async : false,
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify({"tree_type":"1"}),
                success : function(data, textStatus, xhr) {
                    if(data.retCode=="1"){
                        $('#treetable').jstree({
                            'plugins': ["wholerow", "types"],
                            'core' : {
                                "multiple" : false,
                                'data' : data.treeNodes
                            },
                            "types" : {
                                "default" : {
                                    "icon" : "glyphicon glyphicon-link"
                                },
                                "file" : {
                                    "icon" : "glyphicon glyphicon-tasks"
                                }
                            }
                        });
                    }
                },
                error : function(err) {

                }
            });

            $('#treetable').on("changed.jstree", function (e, data) {
                var selectedGasTypeId = data.selected;
                if(selectedGasTypeId==1 ||selectedGasTypeId ==2){
                    var url= hzq_rest +  "gasbllwasteprice";
                    xw.setRestURL(url);
                    xw.update();
                }else{
                    var filter=RQLBuilder.equal("gasTypeId",data.selected).rql();
                    xw.setRestURL(hzq_rest+ "gasbllwasteprice?query="+ filter);
                    xw.update();
                }
                console.log(xw.getRest);
            });
        },


    }
}();