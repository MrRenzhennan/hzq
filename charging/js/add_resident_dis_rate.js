/**
 * Created by anne on 2017/4/13.
 */

var href = document.location.href;
var gastypeId = Metronic.getURLParameter("gastypeId");


var gasTypeHelper = RefHelper.create({
    ref_url:"gasbizgastype?query={\"parentTypeId\":\"2\"}",
    ref_col:"gasTypeId",
    ref_display:"gasTypeName",
});
$('#display_gastype').val(gasTypeHelper.getDisplay(gastypeId));
$('#gasTypeId').val(gastypeId);

$('#cancel').click(function () {
    window.location = "charging/resident_dis_rate_set.html";
});

var gasType1DataLength = 0;
var gasType2DataLength = 0;

var addResidentDisRate = function () {
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initPage();
            this.initAciton();

            //this.initHelper();

        },

        initPage:function () {

            //设置创建人
            var user = JSON.parse(localStorage.getItem("user_info"));
            $('#createdBy').val(user.userId);

            $.map(gasTypeHelper.getData(), function(value, key) {
                gasType1DataLength += 1;
                $('#gasType1').append('<option value="'+key+'">'+value+'</option>');
            });

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

                    $.map(gasTypeHelper.getData(), function(value, key) {
                        $('#gasType2').append('<option value="'+key+'">'+value+'</option>');
                    });
                }else{
                    if(!$('#gasType2Div').hasClass('hide')) $('#gasType2Div').addClass('hide')
                    initSelect('gasType2');
                }
            });

            function initSelect(elem) {
                $('#' + elem).children().remove();
                $('#' + elem).append('<option value="" selected="selected">请选择...</option>');
                $('#' + elem).select2().placeholder = '请选择...'
            }

        },
        initAciton:function () {
            $("#save_btn").click("on",function () {

                if(gasType1DataLength > 0){
                    if($('#gasType1').val() == ''){
                        bootbox.alert("请选择正确的用气性质!!!")
                        return
                    }else{
                        if(gasType2DataLength > 0){
                            if($('#gasType2').val() == ''){
                                bootbox.alert("请选择用气性质!!!")
                                return
                            }else{
                                $("#save_gas_price input[name='gasTypeId']").val($('#gasType2').val())
                            }
                        }else {
                            $("#save_gas_price input[name='gasTypeId']").val($('#gasType1').val())
                        }
                    }
                }else{
                    bootbox.alert("无用气性质!!!")
                    return
                }

                console.log("form:"+$.toJSON($("form").serializeObject()));
                if(validateCustom("#save_gas_price")==1){
                    $('.Metronic-alerts').remove();
                    bootbox.alert("输入数据需符合以下条件：</br>" +
                        "家庭人口不能为空、且必须为有效的数字</br>" +
                        "优惠气量不能为空、且必须为有效的数字</br>"
                    );
                    return;
                }

                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: hzq_rest + 'gasbllrsdtdct',
                    dataType: 'json',
                    type: "POST",
                    data: $.toJSON($("form").serializeObject()),
                    async: false,

                })
                    .done(function(data) {
                        if(data.success){
                            bootbox.alert("<br><center><h4>添加成功!!</h4></center><br>", function () {
                                window.location = "charging/resident_dis_rate_set.html";
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





