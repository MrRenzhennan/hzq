function validateForm(jsondata) {
  var validateText = "";
  for (var key in jsondata) {

    //alert("对应的值是" + jsondata[key]);
    var key_ = key;
    var rule = jsondata[key_]; //验证规则
    //     console.log("keyy:"+keyy);
    //     console.log("index:"+keyy.indexOf('validate_'));

    if (key_.indexOf('validate_') != -1) {
      //     alert("Key是" + key);

      var verfiyed = key_.substring(key_.indexOf('validate_') + 9, key_.length);
      var verfiyStr = jsondata[verfiyed] //需要被验证的内容

      if (rule.indexOf(',') != -1) {
        var rules = rule.split(',');
        for (var dd in rules) {

          var result = validateRule(rules[dd], verfiyStr, jsondata, verfiyed);
          console.log("result:" + result);
          if (result != "" && result != undefined) {

            validateText += result;
            break;
          }

        }
      } else {
        var result = validateRule(rule, verfiyStr, jsondata, verfiyed);
        if (result != "" && result != undefined) {

          validateText += result;
        }

      }

    }
  }
  //'<i class="fa-lg fa fa-warning"></i>用户名不能为空！<br/>&nbsp;<i style="padding-top:6px;" class="fa-lg fa fa-warning"></i>用户名不能为空2！'
  if (validateText != '') {
    var text = validateText.substring(0, validateText.lastIndexOf('<br/>&nbsp;'));
    //	alert("validateText:"+text);  
    Metronic.alert({
      container: '.modal-body', // alerts parent container(by default placed after the page breadcrumbs)
      place: 'prepend', // append or prepent in container 
      type: 'success', // alert's type
      message: text, // alert's message
      close: false, // make alert closable  
      reset: true,
      //               closeInSeconds:2, // auto close after defined seconds
      cssStyle: 'padding: 5px;margin-bottom: 10px;color:#C0334A',
      icon: 'none' // put icon before the message
    });

    return 1;

  }
}

function validateRule(rule, verfiyStr, jsondata, verfiyed) {

  //console.log("========================================== " + rule + "   " + verfiyStr + "   " + JSON.stringify(jsondata) + "   " + verfiyed);
  if (rule.match('length*') != null) {
    if (verfiyStr != "" && verfiyStr.trim().length != 0) {
      var between = rule.substring(rule.indexOf('[') + 1, rule.indexOf(']')).split('-');
      if (!(verfiyStr.length >= between[0] && verfiyStr.length <= between[1])) {
        //alert(jsondata["friendly_"+verfiyed]+"长度必须在"+between[0]+"至"+between[1]+"之间");
        return "<i class='fa-lg fa fa-warning' style='padding-top:6px;' ></i>&nbsp;&nbsp;" + jsondata["friendly_" + verfiyed] + "长度必须在" + between[0] + "至" + between[1] + "之间<br/>&nbsp;";
      }
    }
  } else if (rule.match('required') != null) {
    if (verfiyStr == "" || verfiyStr == undefined || verfiyStr.trim().length == 0) {
      //  alert(jsondata["friendly_"+verfiyed]+"不能为空");
      return "<i class='fa-lg fa fa-warning' style='padding-top:6px;'></i>&nbsp;&nbsp;" + jsondata["friendly_" + verfiyed] + "不能为空<br/>&nbsp;";
    }
  } else if (rule.match('onlyNumber') != null) {
    if (verfiyStr != "" && verfiyStr.trim().length != 0) {
      if (!new RegExp(/^[0-9]+$/).test(verfiyStr)) {
        //  alert(jsondata["friendly_"+verfiyed]+"只能是数字");
        return "<i class='fa-lg fa fa-warning' style='padding-top:6px;'></i>&nbsp;&nbsp;" + jsondata["friendly_" + verfiyed] + "只能是数字<br/>&nbsp;";
      }
    }
  } else if (rule.match('onlyNumChar') != null) {
	if (verfiyStr != "" && verfiyStr.trim().length != 0) {
	    if (!new RegExp(/^.[A-Za-z0-9]+$/).test(verfiyStr)) {
	      //  alert(jsondata["friendly_"+verfiyed]+"格式不正确");
	      return "<i class='fa-lg fa fa-warning' style='padding-top:6px;' ></i>&nbsp;&nbsp;" + jsondata["friendly_" + verfiyed] + "格式不正确<br/>&nbsp;";
	    }
	}
  }else if (rule.match('email') != null) {
    if (verfiyStr != "" && verfiyStr.trim().length != 0) {
      if (!new RegExp(/^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/).test(verfiyStr)) {
        //  alert(jsondata["friendly_"+verfiyed]+"格式不正确");
        return "<i class='fa-lg fa fa-warning' style='padding-top:6px;' ></i>&nbsp;&nbsp;" + jsondata["friendly_" + verfiyed] + "格式不正确<br/>&nbsp;";
      }
    }
  } else if (rule.match('date') != null) {
    if (verfiyStr != "" && verfiyStr.trim().length != 0) {
      if (!new RegExp(/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/).test(verfiyStr)) {
        //  alert("请输入有效的"+jsondata["friendly_"+verfiyed]+",如:2008-08-08");
        return "<i class='fa-lg fa fa-warning' style='padding-top:6px;' ></i>&nbsp;&nbsp;" + "请输入有效的" + jsondata["friendly_" + verfiyed] + ",如:2008-08-08<br/>&nbsp;";
      }
    }
  } else if (rule.match('time') != null) {
    if (verfiyStr != "" && verfiyStr.trim().length != 0) {
      if (!new RegExp(/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).test(verfiyStr)) {
        return "<i class='fa-lg fa fa-warning' style='padding-top:6px;' ></i>&nbsp;&nbsp;" + "请输入有效的" + jsondata["friendly_" + verfiyed] + ",如:2008-08-08 08:08:08<br/>&nbsp;";
      }
    }
  } else if (rule.match('confirm*') != null) {
    var confirm = rule.substring(rule.indexOf('[') + 1, rule.indexOf(']'));


    if (jsondata[confirm] != "" && verfiyStr != jsondata[confirm]) {
      // alert('两次输入的值不一致123');
      return "<i class='fa-lg fa fa-warning' style='padding-top:6px;' ></i>&nbsp;&nbsp;" + "两次输入的值不一致<br/>&nbsp;";
    }

  } else if (rule.match('number*') != null) {

    var between = rule.substring(rule.indexOf('[') + 1, rule.indexOf(']')).split('-');

    var num = jsondata["validateNumber_" + verfiyed]; //已选CHECKBOX数量

    if (!(num >= between[0] && num <= between[1])) {
      //alert(jsondata["friendly_"+verfiyed]+"长度必须在"+between[0]+"至"+between[1]+"之间");
      return "<i class='fa-lg fa fa-warning' style='padding-top:6px;' ></i>&nbsp;&nbsp;必须选择" + between[0] + "到" + between[1] + jsondata["friendly_" + verfiyed] + "<br/>&nbsp;";
    }

  } else if (rule.match('password') != null) {
    if (verfiyStr != "" && verfiyStr.trim().length != 0) {
      if (!new RegExp(/^\w+$/).test(verfiyStr)) {
        //  alert("请输入有效的"+jsondata["friendly_"+verfiyed]+",如:PasSw0rD_");
        return "<i class='fa-lg fa fa-warning' style='padding-top:6px;' ></i>&nbsp;&nbsp;" + "请输入有效的" + jsondata["friendly_" + verfiyed] + ",如:PasSw0rD_<br/>&nbsp;";
      }
    }
  } else if (rule.match('money') != null) {
    if (verfiyStr != "" && verfiyStr.trim().length != 0) {
      if (!new RegExp(/^(([1-9]\d*)|0)(\.\d{1,3})?$/).test(verfiyStr)) {
        //  alert("请输入有效的"+jsondata["friendly_"+verfiyed]+",如:PasSw0rD_");
        return "<i class='fa-lg fa fa-warning' style='padding-top:6px;' ></i>&nbsp;&nbsp;" + "请输入有效的" + jsondata["friendly_" + verfiyed] + "(小数位3位)<br/>&nbsp;";
      }

      // 2015-06-11 money[最大长度, 小数位数]
      var msg;
      rule.replace(/money\[(\d+)-(\d+)]/, function(val){
        val = val.replace("money","").replace("[","").replace("]","").split("-");
        var length = parseInt(val[0], 10);
        var decimal = parseInt(val[1], 10);
        
        var amts = verfiyStr.trim().split(".");

        if ((amts[0] && amts[0].length > length) || (amts[1] && amts[1].length > decimal)) {
          msg = "<i class='fa-lg fa fa-warning' style='padding-top:6px;' ></i>&nbsp;&nbsp;" + "请输入有效的" + jsondata["friendly_" + verfiyed] + "(整数最大"+length+"位, 小数"+decimal+"位)<br/>&nbsp;";
        }
      });

      if (msg) {
        return msg;
      }

    }
  }

}



function validateCustom(element) {
  $('.Metronic-alerts').remove();
  //console.log("parent:"+$("#oldPassword").parent().prev().text().trim());
  var validates = $(element).find("[class*=validate]");
  var sendjson = {};
  var validateText = "";
  //拼接json
  $.each(validates, function(index, item) {

    var text = item.value; //需要验证的值
    var id = item.id; //被验证对象的ID（唯一）
    if (item.type != undefined && item.type == "checkbox") {
      sendjson["validateNumber_" + id] = $(element).find("input[name='" + item.name + "']:checked").length;
      //    sendjson["validateNumber_"+id] =item.name;
    }
    var rule = $("#" + id).attr("class");
    var conditions = rule.substring(rule.indexOf('validate[') + 9, rule.lastIndexOf(']')); //.split(',');  //需要验证的规则
    var labelName = $("#" + id).parent().prev().text().trim(); //被验证字段的诠释
    sendjson["validate_" + id] = conditions;
    sendjson[id] = text;
    sendjson["friendly_" + id] = labelName;
  });

  //  console.log("sendjson:"+JSON.stringify(sendjson));
  return validateForm(sendjson);
}