/**
 * Created by anne on 2017/4/13.
 */

var href = document.location.href;
var gastypeId = Metronic.getURLParameter("gastypeId");


var gasTypeHelper = RefHelper.create({
    ref_url:"gasbizgastype",
    ref_col:"gasTypeId",
    ref_display:"gasTypeName",
});
$('#display_gastype').val(gasTypeHelper.getDisplay(gastypeId));
$('#gasTypeId').val(gastypeId);

$('#cancel').click(function () {
    window.location = "charging/gascost.html";
});

var gasPriceSetAction = function () {
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initPage();
            this.initAciton();

            //this.initHelper();

        },

        initPage:function () {
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
                console.log("form:"+$.toJSON($("form").serializeObject()));
                if(validateCustom("#save_gas_price")==1){
                    $('.Metronic-alerts').remove();
                    bootbox.alert("输入数据需符合以下条件：</br>" +
                        "版本号不能为空、必须是数字、长度必须在0至5之间</br>" +
                        "生效时间不能为空</br>" +
                        "(第一阶梯) 起始量不能为空、必须是数字、长度必须在0至12之间</br>" +
                        "(第一阶梯) 结束量不能为空、必须是数字、长度必须在0至12之间</br>" +
                        "(第一阶梯) 价格不能为空、必须为有效的金额、长度必须在0至5之间"
                    );
                    return;
                }

                var createTimeFormat = GasModBil.date_format(new Date(),'yyyy-MM-ddThh:mm:ss');
                $("#createTime").val(createTimeFormat);



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





