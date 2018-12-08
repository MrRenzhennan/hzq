/**
 * Created by anne on 2017/4/13.
 */

var href = document.location.href;
var gastypeId = Metronic.getURLParameter("gastypeId");


var gasTypeHelper = RefHelper.create({
    ref_url:"gasbizgastype?query={\"parentTypeId\":\"1\"}",
    ref_col:"gasTypeId",
    ref_display:"gasTypeName",
});
$('#display_gastype').val(gasTypeHelper.getDisplay(gastypeId));
$('#gasTypeId').val(gastypeId);

$('#cancel').click(function () {
    window.location = "charging/gascost.html";
});

var gasType1DataLength = 0;
var gasType2DataLength = 0;
var gasType3DataLength = 0;

var addGasPrice = function () {
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initPage();
            this.initAciton();

            //this.initHelper();

        },

        initPage:function () {

            $.map(gasTypeHelper.getData(), function(value, key) {
                gasType1DataLength += 1;
                $('#gasType1').append('<option value="'+key+'">'+value+'</option>');
            });

            // console.log('the gasType3 length is ::: ', $('#gasType3 option').size());

            $('#gasType1').on("change", function () {
                var gasTypeHelper = RefHelper.create({
                    ref_url:'gasbizgastype?query={"parentTypeId":' + $('#gasType1').val() + '}',
                    ref_col:"gasTypeId",
                    ref_display:"gasTypeName",
                });

                gasType2DataLength = 0;
                $.map(gasTypeHelper.getData(), function (value, key) {
                    gasType2DataLength = gasType2DataLength + 1;
                })

                if(gasType2DataLength > 0){//如果根据一级查出数据，则二级显示，并赋值
                    $('#gasType2Div').removeClass('hide');
                    initSelect('gasType2');

                    if(!$('#gasType3Div').hasClass('hide')) $('#gasType3Div').addClass('hide')
                    initSelect('gasType3')

                    $.map(gasTypeHelper.getData(), function(value, key) {
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
                var gasTypeHelper = RefHelper.create({
                    ref_url:'gasbizgastype?query={"parentTypeId":' + $('#gasType2').val() + '}',
                    ref_col:"gasTypeId",
                    ref_display:"gasTypeName",
                });

                gasType3DataLength = 0;
                $.map(gasTypeHelper.getData(), function (value, key) {
                    gasType3DataLength = gasType3DataLength + 1;
                })

                if(gasType3DataLength > 0){
                    $('#gasType3Div').removeClass('hide');
                    initSelect('gasType3');

                    $.map(gasTypeHelper.getData(), function(value, key) {
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

            $("#measureFrom1").val('0');
            $("#measureFrom2").on("change",function () {
                $("#measureTo1").val($("#measureFrom2").val());
            });
            $("#measureFrom3").on("change",function () {
                $("#measureTo2").val($("#measureFrom3").val());
            });
            $("#measureFrom4").on("change",function () {
                $("#measureTo3").val($("#measureFrom4").val());
            });
            $("#measureFrom5").on("change",function () {
                $("#measureTo4").val($("#measureFrom5").val());
            });

            //设置创建人
            var user = JSON.parse(localStorage.getItem("user_info"));
            $("#createdBy").val(user.employee_name);

            //阶梯价固定价切换
            $("#priceType").on("change",function () {
               var tmpPriceType= $("#priceType").find("option:selected").val();
               if(tmpPriceType == 1){//阶梯气价
                   $(".row.form-group.form-group2").css("display","block");
                   $("#fist_ladder_from").text("第一阶梯起始量")
                   $("#fist_ladder_to").text("第一阶梯结束量")
                   $("#fist_ladder_price").text("第一阶梯价格")
               }else if(tmpPriceType == 2){//固定气价
                   $(".row.form-group.form-group2").css("display","none");
                   $("#fist_ladder_from").text("起始气量")
                   $("#fist_ladder_to").text("结束气量")
                   $("#fist_ladder_price").text("价格")
               }else {
                   $(".row.form-group.form-group2").css("display","block");
               }
            })

        },
        initAciton:function () {
            $("#save_btn").click("on",function () {

                if(gasType1DataLength > 0){
                    if($('#gasType1').val() == ''){
                        bootbox.alert("请选择用气性质!!!")
                        return
                    }else{
                        if(gasType2DataLength > 0){
                            if($('#gasType2').val() == ''){
                                bootbox.alert("请选择正确的用气性质!!!")
                                return
                            }else{
                                if(gasType3DataLength > 0){
                                    if($('#gasType3').val() == ''){
                                        bootbox.alert("请选择正确的用气性质!!!")
                                        return
                                    }else{
                                        $("#save_gas_price input[name='gasTypeId']").val($('#gasType3').val())
                                    }
                                }else{
                                    $("#save_gas_price input[name='gasTypeId']").val($('#gasType2').val())
                                }
                            }
                        }else {
                            $("#save_gas_price input[name='gasTypeId']").val($('#gasType1').val())
                        }
                    }
                }else{
                    bootbox.alert("无用气性质!!!")
                    return
                }

                //不能处理叶子节点上层元素，当选择该元素后存在叶子节点，但是未选择叶子节点，该方法即会选择该元素作为gasTypeId
                // if($('#gasType3').val() && $('#gasType3').val() != ''){
                //     $("#save_gas_price input[name='gasTypeId']").val($('#gasType3').val());
                // }else{
                //     if($('#gasType2').val() && $('#gasType2').val() != ''){
                //         $("#save_gas_price input[name='gasTypeId']").val($('#gasType2').val());
                //     }else{
                //         if($('#gasType1').val() && $('#gasType1').val() != ''){
                //             $("#save_gas_price input[name='gasTypeId']").val($('#gasType1').val());
                //         }else{
                //             bootbox.alert('<h4><center>请选择用气类型！！</center></h4>')
                //             return;
                //         }
                //     }
                // }

                console.log("form:"+$.toJSON($("form").serializeObject()));
                if(validateCustom("#save_gas_price")==1){
                    $('.Metronic-alerts').remove();
                    bootbox.alert("输入数据需符合以下条件：</br>" +
                        "生效时间不能为空</br>" +
                        "(第一阶梯) 起始量不能为空、必须是数字、长度必须在0至12之间</br>" +
                        "(第一阶梯) 结束量不能为空、必须是数字、长度必须在0至12之间</br>" +
                        "(第一阶梯) 价格不能为空、必须为有效的金额、长度必须在0至5之间"
                    );
                    return;
                }

                var user = JSON.parse(localStorage.getItem("user_info"));
                $('#createdBy').val(user.userId);

                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: hzq_rest + 'gasbllgasprice',
                    dataType: 'json',
                    type: "POST",
                    data: $.toJSON($("form").serializeObject()),
                    async: false,

                })
                    .done(function(data) {
                        if(data.success){
                            bootbox.alert("<br><center><h4>添加成功!!</h4></center><br>", function () {
                                window.location = "charging/gascost.html";
                            });

                        }else{
                            bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");
                        }
                    })
                    .error(function() {
                        bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");

                    });
            });

        }
    }

}()





