/**
 * Created by anne on 2017/3/22.
 */
var gaspriceVerAdd = function () {




    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
            this.initPage();
            this.inputAction();
            this.saveAction();
        },
        reload:function () {
            $("#ladder_btn").on("click",function () {
                var oBox=$('#ladder_box');
                var oText=$("#step option:selected").text();
                var str="";
                for(var i=1; i<=oText; i++){
                    str+="<div class='col-md-3 '><label class='control-label col-md-6-new'>阶梯数:</label><div class='col-md-6 '>" +
                        "<input type='text' class='form-control' placeholder='"+i+"' readonly='true'/></div></div>";
                    if(i==1){
                        str+=" <div class='col-md-3 '><label  class='control-label col-md-6-new'>起始气量:</label><div class='col-md-6 '>" +
                            "<input id = 'measureFrom"+i+"' name='measureFrom"+i+"' type='text' value='0' class='form-control'/></div></div>";
                    }else{
                        str+=" <div class='col-md-3 '><label  class='control-label col-md-6-new'>起始气量:</label><div class='col-md-6 '>" +
                            "<input id = 'measureFrom"+i+"' name='measureFrom"+i+"' type='text' class='form-control'/></div></div>";
                    }
                    str+="<div class='col-md-3 '> <label class='control-label col-md-6-new'>结束气量:</label><div class='col-md-6'>" +
                        "<input id='measureTo"+i+"' name = 'measureTo"+i+"' type='text' class='form-control'/></div></div>";
                    str+="<div class='col-md-3 '> <label class='control-label col-md-6-new'>价格:</label><div class='col-md-6'>" +
                        "<input id='price"+i+"' name = 'price"+i+"'  type='text' class='form-control'/></div></div>";
                    str+="<div class='row form-group'></div>";
                }
                oBox.html(str);
            });

        },

        initPage:function(){
            var href = decodeURIComponent(document.location.href);
            var gasTypeId = href.split('?')[2];
            var display_gastype =  href.split('?')[1];
            var priceType = href.split('?')[3];
            $('#gasTypeName').val(display_gastype);
            $('#gasTypeId').val(gasTypeId);
            $('#priceType').val(priceType);
            $("#step").val("Category 1").trigger('change'); //默认设置一个阶梯
            $("#ladder_btn").trigger("click");

            $("#measureTo1").change(function () {
               // $("#measureFrom2").val(("#measureTo1").text());
                var measureTo1= $("#measureTo1").val();
                var measureTotxt1= $("#measureTo1").text();
                console.log("measureTo1:"+ measureTo1);
                $("#measureFrom2").val("22");
            })

            //measureFrom1设置为0
            /*for(var i=1;i <= 4; i++){
                $("#measureTo"+i).on("change",function (event ) {
                    var j = i+1;
                    $("#measureFrom"+j).val(("#measureTo"+i).val());
                })
            }*/






        },

        inputAction:function(){



        },

        saveAction:function () {
            $("#saveAddVer_btn").on("click",function () {

                //
                var sendData = $.toJSON($("form").serializeObject());
                var restURL =  hzq_rest + 'gasbllgasprice';
               // var  retData = Restful.postDataR(url,sendData);

                $.ajax({
                    type: 'POST',
                    url:  restURL,
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: sendData,
                    async: false,
                    success: function(data) {
                        console.log(data)
                        if(data.success){
                            bootbox.alert("<br><center><h4>添加成功!!</h4></center><br>");

                        }else{
                            bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");
                        }
                        resdata = data;
                    },
                    error: function(err) {
                        bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");
                    }
                });
               // console.log("retData:"+ retData);


               /* console.log("form:"+$.toJSON($("form").serializeObject()));
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
                            bootbox.alert("<br><center><h4>添加成功!!</h4></center><br>");

                        }else{
                            bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");
                        }
                    })
                    .error(function() {
                        bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");

                    });*/
            });

        }
    }

}()





