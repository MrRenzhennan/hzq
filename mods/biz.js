
var GasModBIZ = function() {

    var enumMeterKind = {'01':'普表','02':'IC卡气量表','03':'IC卡金额表','04':'代码表','05':'远传表'};

    return {

        meterKindFormat:{
            f: function(val){
                return enumMeterKind[val];
            },
        },
        init: function(xwajson) {



        }
    }
}();