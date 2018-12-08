function enumReverse(enumLoadurl) {

  return {
    f: function(formatVal) {
      var display;
      var enumClassName = enumLoadurl.substring(enumLoadurl.lastIndexOf('/') + 1, enumLoadurl.length);
      var datas = $("div").data(enumClassName);

      if (datas == undefined) {
        $.ajax({
            url: hzq_rest + enumLoadurl,
            dataType: 'json',
            async: false,
          })
          .done(function(data) {            
            $("div").data(enumClassName, data);            
            $.each(data, function(index, value) {
              for (var key in value) {
                if (formatVal == key) {

                  display = value[key];
                }
              }

            });

          });
      } else {
        $.each(datas, function(index, value) {
          for (var key in value) {
            if (formatVal == key) {

              display = value[key];
            }
          }

        });

      }      
      return display;

    },

    /**
     * 取得拥有的所有值(逗点隔开)
     */
    fs: function(formatVal) {
      var display = "";
      var enumClassName = enumLoadurl.substring(enumLoadurl.lastIndexOf('/') + 1, enumLoadurl.length);
      var datas = $("div").data(enumClassName);

      if (datas == undefined) {
        $.ajax({
            url: enumLoadurl,
            dataType: 'json',
            async: false,
          })
          .done(function(data) {            
            $("div").data(enumClassName, data);            
            $.each(data, function(index, value) {
              for (var key in value) {
                for (var key in value) {
                  if (key == (key & formatVal)) {
                    display += ", " + value[key];
                  }
                }
              }
            });

          });
      } else {
        $.each(datas, function(index, value) {
          for (var key in value) {
            if (key == (key & formatVal)) {
              display += ", " + value[key];
            }
          }
        });

      }      
      return display != "" ? display.substring(2) : "";
    },

    /*
     * 取得下拉选单
     * 
     * @param id 选单id
     * @param selectVal 预设选取的值
     * @param cancaelVal 排除值(逗号隔开)
     * @param placeholder 
     */
    initSelectMenu: function(id, selectVal, cancaelVal, placeholder,readonly ) {
      $.ajax({
        url: hzq_rest + enumLoadurl,
        dataType: 'json',
        async: false,
      })
      .done(function(data) {

        var cancael = cancaelVal ? cancaelVal.split(",") : false;
        var holder = placeholder ? placeholder+'_': '';
        $.each(data, function(index, value) {
          for (var key in value) {
            if (!cancael || cancael.indexOf(key) < 0) {
              $("#"+id).append("<option value='"+holder+key+"'"+(key == selectVal ? "selected" : "")+">"+value[key]+"</option>");
            }
          }
        });

        if (selectVal) {
          // select2 两次才会动作 2015-06-04  针对select2判断
          if ($("#"+id).attr("class").indexOf("select2") > -1) {
            $("#"+id).select2().val(selectVal);
          }
        }
      });

      if(readonly) $("#"+id).attr("readonly",readonly);
    }
  }
}

//有效/无效
var validAndInefficacyReverse = function() {
  try {

    return enumReverse('baseenums/validAndInefficacyReverse');

  } catch (e) {

    //       alert(e.name + ": " + e.message);
  }



}();
//成功/失败
var successAndFailReverse = function() {
  try {

    return enumReverse('baseenums/successAndFailReverse');

  } catch (e) {

    //  alert(e.name + ": " + e.message);

  }
}();

//是/否
var isAndNotReverse = function() {
  try {

    return enumReverse('baseenums/isAndNotReverse');
  } catch (e) {

    //  alert(e.name + ": " + e.message);

  }
}();

//启用/停用
var enableAndDisEnableReverse = function() {
  try {

    return enumReverse('baseenums/enableAndDisEnableReverse');
  } catch (e) {

    //   alert(e.name + ": " + e.message);

  }
}();


//正常/删除
var normalAndDeleteReverse = function() {
    try {

        return enumReverse('baseenums/normalAndDeleteReverse');
      return enumReverse('customer/normalAndDeleteReverse');
    } catch (e) {

        //   alert(e.name + ": " + e.message);

    }
}();

var branchUtil;

function branchReverse() {
  if (branchUtil == undefined) {
    branchUtil = RefHelper.create({
      ref_url: wpadmin + "/fcsysbranch",
      ref_col: "branchId",
      ref_display: "branchName",
    });
  }

  return {
    f: function(val) {
      return branchUtil.getDisplay(val);
    }
  }

}

var bankUtil;

function bankReverse() {
  if (bankUtil == undefined) {
    bankUtil = RefHelper.create({
      ref_url: "fcinnercbankinfo",
      ref_col: "bankAlias",
      ref_display: "bankName",
    });
  }

  return {
    f: function(val) {
      return bankUtil.getDisplay(val);
    }
  }
}

var ContractKind=enumReverse("enumctrl/contractKindEnum");

//全自动放款(1, "全自动放款"),
var withdrawLoanType=enumReverse("enumctrl/withdrawLoanType");

var userFlagFormat=enumReverse("enumctrl/userFlagEnum");

var noOrYesFormat=enumReverse("enumctrl/noOrYesEnum");

var gasTypeEnum=enumReverse("enumctrl/gasTypeEnum");

//客户类别(1：居民用户；0：非居民用户)
var CustomerKindFormat=enumReverse("enumctrl/customerKindEnum");

//客户状态(01：正常；02：暂停用气；03：拆除状态；00：新用户；99：删除)
var customerStateFormat = enumReverse("enumctrl/customerStateEnum");

var BodyImpedimentFormat = enumReverse("enumctrl/bodyImpedimentEnum");
//特殊用户类型(1,"低保户"),(2,"低收入家庭"),(3,"低困难家庭")
var SpecificTypeFormat=enumReverse("enumctrl/specficTypeEnum");

//工程类别（1:工业,2:商服,3:公益,4:锅炉,5:福利,6:民用）
var GasProjectTypeFormat=enumReverse("enumctrl/gasProjectTypeEnum");
//开栓令审核状态（1:未审核,2:审核中,3:未通过,4:已通过）
var ApproveStatusEnumFormat =enumReverse("enumctrl/ApproveStatusEnum");
var gasPriceTypeFormat=enumReverse("enumctrl/gasPriceTypeEnum");
var contractTypeFormat=enumReverse("enumctrl/contractTypeEnum");


var copyCycleFormat=enumReverse("enumctrl/copyCycleEnum");

//仓库级别（1：一级库,2：二级库）
var depoLevelFormat = enumReverse("enumctrl/depoLevelEnum");

//锁定状态（1：未锁定,0：锁定）
var lockflagFormat = enumReverse("enumctrl/lockflagEnum");

var parameterFormat = enumReverse("enumctrl/parameterEnum");

//表具状态（00:一级库在库,01:二级库在库,02:在途,03:在用,04:在线,05:下线,06:维修,07:报废）
var meterstateFormat = enumReverse("enumctrl/meterStateEnum");

//表具运行状态(0：死表,1：正常,2：慢表,3：倒针)
var meterRunningStateFormat = enumReverse("enumctrl/meterRunningStateEnum");
//计划状态(0：已结束,1：未开始,2：进行中)
var planFormat = enumReverse("enumctrl/planStateEnum");

//表具进气方向(1：左进气,2：右进气)
var floworderFormat = enumReverse("enumctrl/floworderEnum");

var userRoleFormat = enumReverse("enumctrl/useRoleEnum");

var startusingFormat = enumReverse("enumctrl/startusingEnum");
//1阶梯价格 2 固定价格
var discountTypeFormat = enumReverse("enumctrl/discountTypeEnum");

//抄表类型
var mrdCopyTypeFormat = enumReverse("enumctrl/mrdCopyTypeEnum");
//客户类型
var customerTypeFormat = enumReverse("enumctrl/customerTypeEnum");
//计费表
var chargingMeterEnum = enumReverse("enumctrl/chargingMeterEnum");
//是Y，否N
var yandNEnum = enumReverse("enumctrl/yandNEnum");
