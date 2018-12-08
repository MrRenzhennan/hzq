/**
 * Created by Administrator on 2017/7/4 0004.
 */


var href = document.location.href;
var chgAccountId = href.split('?')[1];
//console.log(chgAccountId);

$.ajax(
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type:'get',
        url:hzq_rest+ 'gaschgaccount/'+chgAccountId,
        dataType:'json',
        data:"",
        success:function (data) {
            console.log(data);
            $.each(data,function(key,val){
                $("form input[name='"+key+"']").val(val);
                $("form select[name='"+key+"']").val(val).trigger("change");
            })
        }

    }
)

$("#save").on("click",function(){
    var form=$("form").serializeObject();
    console.log(form);
    // var result = Restful.update(hzq_rest + "gaschgaccount",)
    $.ajax({
        url: hzq_rest + "gaschgaccount/"+ chgAccountId ,
        type: 'PUT',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(form),
        async: false,
        success: function(data) {
            console.log(data);
            if(data.success){
                bootbox.alert("修改成功！",function(){
                    history.go("-1");
                })
            }
        }
    });
})
