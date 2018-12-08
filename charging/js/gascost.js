

var gaspriceAction = function () {

    var xw;

    var gasType1DataLength = 0;
    var gasType2DataLength = 0;
    var gasType3DataLength = 0;
    var gasType2DataArray = [];
    var gasType3DataArray = [];

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



    var stepAndPriceFormat = function () {
        return {
            f : function (val,row) {
                console.log(row)
               var stepStr = "";
               if(row["priceType"] ==2){ //固定价格
                   stepStr = "周期价:"+ row["price1"];
               }else{
                   for(var i=1;i<=5;i++) {
                       var measureFrom = "measureFrom"+i ;
                       var measureTo = "measureTo"+i ;
                       var price = "price"+i ;
                       if((row[measureFrom]==0 ||row[measureFrom]) && row[measureTo]){
                           stepStr=stepStr +"第"+i+"阶梯:"+row[measureFrom]+ "~"+row[measureTo]+"&nbsp价格:" +row[price]+"<br/>";
                       }
                   }
               }
                return stepStr;
            }
        }
    }();


    var gotoDetail = function () {
        return {
            f : function (val,row) {
                return "<a href='charging/gas_price_set.html?gastypeId=" +  row["gasTypeId"] + "\'>" + "&nbsp顺价"+ "</a>";
            }
        }
    }();



    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
            this.initGasTypeTree();
            this.initHelper();

        },

        initHelper:function(){
            // 用气类型 select init
            // $.map(gasTypeHelper.getData(), function(value, key) {
            //     $('#gastype').append('<option value="'+key+'">'+value+'</option>');
            // });
            $.map(gasTypeHelper.getData(), function(value, key) {
                $('#bllGasType').append('<option value="'+key+'">'+value+'</option>');
            });


            var gasType1Helper=RefHelper.create({
                ref_url:"gasbizgastype?query={\"parentTypeId\":\"1\"}",
                ref_col:"gasTypeId",
                ref_display:"gasTypeName",
            });

            $.map(gasType1Helper.getData(), function(value, key) {
                gasType1DataLength += 1;
                $('#gasType1').append('<option value="'+key+'">'+value+'</option>');
            });

            // console.log('the gasType3 length is ::: ', $('#gasType3 option').size());

            $('#gasType1').on("change", function () {
                var gasType2Helper = RefHelper.create({
                    ref_url:'gasbizgastype?query={"parentTypeId":' + $('#gasType1').val() + '}',
                    ref_col:"gasTypeId",
                    ref_display:"gasTypeName",
                });

                gasType2DataLength = 0;
                gasType2DataArray = [];
                gasType3DataArray = [];
                $.map(gasType2Helper.getData(), function (value, key) {
                    gasType2DataArray.push(key);
                    gasType2DataLength = gasType2DataLength + 1;
                })

                if(gasType2DataLength > 0){//如果根据一级查出数据，则二级显示，并赋值
                    $('#gasType2Div').removeClass('hide');
                    initSelect('gasType2');

                    if(!$('#gasType3Div').hasClass('hide')) $('#gasType3Div').addClass('hide')
                    initSelect('gasType3')

                    $.map(gasType2Helper.getData(), function(value, key) {
                        $('#gasType2').append('<option value="'+key+'">'+value+'</option>');
                    });
                }else{
                    if(!$('#gasType2Div').hasClass('hide')) $('#gasType2Div').addClass('hide')
                    initSelect('gasType2');

                    if(!$('#gasType3Div').hasClass('hide')) $('#gasType3Div').addClass('hide')
                    initSelect('gasType3');
                }
            });

            $('#gasType2').on("change", function () {
                var gasType3Helper = RefHelper.create({
                    ref_url:'gasbizgastype?query={"parentTypeId":' + $('#gasType2').val() + '}',
                    ref_col:"gasTypeId",
                    ref_display:"gasTypeName",
                });

                gasType3DataLength = 0;
                gasType3DataArray = [];
                $.map(gasType3Helper.getData(), function (value, key) {
                    gasType3DataArray.push(key);
                    gasType3DataLength = gasType3DataLength + 1;
                })

                if(gasType3DataLength > 0){
                    $('#gasType3Div').removeClass('hide');
                    initSelect('gasType3');

                    $.map(gasType3Helper.getData(), function(value, key) {
                        $('#gasType3').append('<option value="'+key+'">'+value+'</option>');
                    });
                }else{
                    // console.log('gasType3DateLength is 0');
                    if(!$('#gasType3Div').hasClass('hide')) $('#gasType3Div').addClass('hide')
                    initSelect('gasType3');
                }
            });

            function initSelect(elem) {
                $('#' + elem).children().remove();
                $('#' + elem).append('<option value="" selected="selected">请选择...</option>');
                $('#' + elem).select2().placeholder = '请选择...'
            }
        },

        priceTypeEditBuilder:function(val){
            if(val==1){
                return "<select id='priceType' name='priceType' class='form-control select2me'><option value=1 selected>阶梯价格</option><option value=2 >周期价格</option></select>";
            }else {
                return "<select id='priceType' name='priceType' class='form-control select2me'><option value=1 >阶梯价格</option><option value=2 selected>周期价格</option></select>";
            }
        },



        reload:function(){

          /*  var tmpTime = new Date();
            tmpTime.setFullYear(tmpTime.getFullYear() - 3);
            var formatTime = GasModBil.date_format(tmpTime,'yyyy-MM-dd');
            var effectTime = RQLBuilder.condition("effectTime","$gt","to_date('"+ formatTime +"','yyyy-MM-dd')");

            var xwQuery = RQLBuilder.and([
              //  effectTime
               // RQLBuilder.equal("priceType","1")
            ]).rql();*/


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
                   // restbase: 'gasbllgasprice?query='+ xwQuery,
                    restbase: 'gasbllgasprice',
                    key_column: "gasPriceId",
                    //---------------行定义
                    coldefs:[
                        {
                            col:"gasPriceId",
                            friendly:"价格Id",
                            unique:true,
                            hidden:true,
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"priceType",
                            friendly:"价格类型",
                            inputsource: "select",
                            format:GasModBil.PriceTypeFormat,
                            inputsource: "custom",
                            inputbuilder: "gaspriceAction.priceTypeEditBuilder",
                            index:2
                          /*  ref_url:  "enumctrl/4s/gasPriceTypeEnum",
                            ref_name: "enumName",
                            ref_value: "enumVal",*/
                        },
                        {
                            col:"gasTypeId",
                            friendly:"用气性质",
                            format:gasTypeFormat,
                            inputsource: "select",
                            ref_url:  "gasbizgastype",
                            ref_name: "gasTypeName",
                            ref_value: "gasTypeId",
                            index:3
                        },
                        {
                            col:"priceVersion",
                            friendly:"价格版本",
                            validate:"required,length[0-20]",
                            index:4
                        },
                        {
                            col:"rn",
                            friendly:"阶梯和气价",
                            format:stepAndPriceFormat,
                            nonedit: "noeidt",
                            index:5
                        },
                        {
                            col:"persons",
                            friendly:"家庭人口数",
                            validate:"required,onlyNumber,length[0-20]",
                            index:6
                        },
                        {
                            col:"createTime",
                            friendly:"调价时间",
                            hidden:true,
                            format:GasModBil.dateFormat,
                            inputsource:'datepicker',
                            index:7
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:GasModBil.dateFormat,
                            hidden:true,
                            readonly:"readonly",
                            nonedit: "noeidt",
                            index:8
                        },
                        {
                            col:"effectTime",
                            friendly:"生效时间",
                            format:GasModBil.dateFormat,
                            inputsource: "datepicker",
                            validate:"date",
                            index:9
                        },

                        {
                            col:"createdBy",
                            friendly:"创建人",
                            index:10
                        },
                        {
                            col:"modifiedTime",
                            friendly:"操作", //更新时间
                            //format:GasModBil.dateFormat,
                            format:gotoDetail,
                            nonedit: "noeidt",
                            index:11
                        },
                        {
                            col:"measureFrom1",
                            friendly:"第一阶梯起始量",
                            //format:operateFormat,
                            hidden:true,
                            validate:"required,onlyNumber,length[0-100]"
                        },
                        {
                            col:"measureTo1",
                            friendly:"第一阶梯结束量",
                            //format:operateFormat,
                            hidden:true,
                            validate:"required,onlyNumber,length[0-20]"
                        },
                        {
                            col:"price1",
                            friendly:"第一阶梯价格",
                            //format:operateFormat,
                            hidden:true,
                            validate:"required,money,length[0-100]",
                        },
                        {
                            col:"measureFrom2",
                            friendly:"第二阶梯起始量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"measureTo2",
                            friendly:"第二阶梯结束量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"price2",
                            friendly:"第二阶梯价格",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"measureFrom3",
                            friendly:"第三阶梯起始量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"measureTo3",
                            friendly:"第三阶梯结束量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"price3",
                            friendly:"第三阶梯起价格",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"measureFrom4",
                            friendly:"第四阶梯起始量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"measureTo4",
                            friendly:"第四阶梯结束量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"price4",
                            friendly:"第四阶梯起价格",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"measureFrom5",
                            friendly:"第五阶梯起始量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"measureTo5",
                            friendly:"第五阶梯结束量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"price5",
                            friendly:"第五阶梯起价格",
                            //format:operateFormat,
                            hidden:true
                        }



                    ],

                    // 查询过滤条件
                    findFilter: function(){

                        var queryUrl=hzq_rest+"gasbllgasprice";
                        var querys=new Array();
                        var gasTypeId;

                        if($('#gasType1').val()){//一级有值
                            if($('#gasType2').val()){//判断二级是否有值
                                if($('#gasType3').val()){//判断三级是否有值
                                    gasTypeId = RQLBuilder.equal("gasTypeId", $('#gasType3').val());
                                }else {
                                    if (gasType3DataLength > 0) {//有叶子节点
                                        gasTypeId = RQLBuilder.condition_fc("gasTypeId", "$in", "[" + gasType3DataArray.join() + "]")
                                    } else {//没有叶子节点，说明其本身就是叶子节点
                                        gasTypeId = RQLBuilder.equal("gasTypeId", $('#gasType2').val());
                                    }
                                }
                            }else{//二级未选择
                                var dataArray = gasType2DataArray;
                                for(var i = 0; i < gasType2DataArray.length; i++){
                                   var gasTypeHelper = RefHelper.create({
                                       ref_url:'gasbizgastype?query={"parentTypeId":' + gasType2DataArray[i] + '}',
                                       ref_col:"gasTypeId",
                                       ref_display:"gasTypeName",
                                   });

                                   //不能避免二级非叶子节点仍处在 in 中
                                   $.map(gasTypeHelper.getData(), function (value, key) {
                                       dataArray.push(key);
                                   })
                               }
                                
                                gasTypeId = RQLBuilder.condition_fc("gasTypeId", "$in", "[" + dataArray.join() + "]");
                            }
                            querys.push(gasTypeId)
                        }

                        if ($('#gastype').val()) {
                            querys.push(RQLBuilder.like("gasTypeId", $('#gastype').val()));
                        }

                        if ($('#find_effectTime').val()) {
                            var effectTime = RQLBuilder.condition("effectTime","$gt","to_date('"+ $('#find_effectTime').val() +"','yyyy-MM-dd')");
                            querys.push(effectTime);
                        }
                        if(querys.length>0){
                            queryUrl += "?query="+RQLBuilder.and(querys).rql();
                        }

                        xw.setRestURL(queryUrl);
                        xw.update();
                        return "";
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);

                    },

                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
        },



        initGasTypeTree : function(){
            var restURL =  'hzqs/bil/pbgtr.do?fh=GTRBIL0000000J00&resp=bd';
            $.ajax({
                type : 'POST',
                url : restURL,
                dataType : 'json',
                cache : false,
                async : false,
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify({"tree_type":"0"}),
                success : function( data, textStatus, xhr) {
                    console.log("@@@@data="+JSON.stringify(data));
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
                /*var tmpTime = new Date();
                tmpTime.setFullYear(tmpTime.getFullYear() - 3);
                var formatTime = GasModBil.date_format(tmpTime,'yyyy-MM-dd');
                var effectTime = RQLBuilder.condition("effectTime","$gt","to_date('"+ formatTime +"','yyyy-MM-dd')");*/
                var selectedGasTypeId = data.selected;

                function updateXtable(  gasTypeIdArray){
                   //var gasTypeIdArray = GasModBil.queryGasTypeByParentId(selectedGasTypeId);
                   var gasTypels = RQLBuilder.condition_fc("gasTypeId","$in", "["+gasTypeIdArray.join()+"]");
                    var xwQuery = RQLBuilder.and([
                      //  effectTime,
                        gasTypels
                    ]).rql();
                   var updataURL = hzq_rest + "gasbllgasprice?query=";
                    xw.setRestURL( updataURL+ xwQuery);
                    xw.update();
                }

                if(selectedGasTypeId==1){ //所有
                    xw.setRestURL( hzq_rest + "gasbllgasprice");
                    xw.update();
                    return
                }
                //2居民 3非居民
                if(selectedGasTypeId==2||selectedGasTypeId==3){
                    var xwQuery = RQLBuilder.and([
                        RQLBuilder.rlike("gasTypeId",selectedGasTypeId)
                    ]).rql();
                    xw.setRestURL( hzq_rest + "gasbllgasprice?query=" + xwQuery );
                    xw.update();
                    return
                }
                var gasTypeIdArray = GasModBil.queryGasTypeByParentId(selectedGasTypeId);
                if(gasTypeIdArray.length>0){
                    updateXtable(gasTypeIdArray);
                }else {
                    var selectpriceTypeHelper=RefHelper.create({
                        ref_url:"gasbllgasprice",
                        ref_col:"gasTypeId",
                        ref_display:"priceType",
                    });

                    //priceType=1 为阶梯价格  2为固定价格 如果priceType不为1或者2,说明没有此种用气性质的价格
                    var priceType =  selectpriceTypeHelper.getDisplay(selectedGasTypeId);
                    if(priceType!=1 && priceType!=2){
                        bootbox.confirm("目前没有此种用气类型的价格,是否设置初始价格?", function (result) {
                            if (result === false) {
                            } else {
                                window.location = "charging/gas_price_set.html?gastypeId="+selectedGasTypeId;
                                //$("#setPrice").modal('show');
                               // $("#add_button").click();
                            }
                        });
                    }

                    var query = RQLBuilder.and([
                        RQLBuilder.equal("gasTypeId",selectedGasTypeId)
                        // ,effectTime
                    ]).rql();
                    xw.setRestURL(hzq_rest + "gasbllgasprice?query="+query);
                    xw.update();
                }

            });

        }

    }
}()







