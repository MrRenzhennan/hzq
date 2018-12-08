var GasModBas = function() {

	var enumCopyCycle = { 9:"日抄",8:"周抄", 7:"月抄",4:"季抄",3:"四月抄",2:"半年抄",1: "年抄"};
    var  enumBookType = {"9":"非居民","1":"居民"};
    var bankNameHelper ;
    return {

        copyCycleFormat: {
            f: function(val){
                return enumCopyCycle[val];
            },
        },

    	bookTypeFormat:{
            f: function(val){
                return enumBookType[val];
            },
        },

        bankNameFormat:{
            f:function(val){
                if(!bankNameHelper){
                    bankNameHelper = RefHelper.create({
                        ref_url: "gasbasbank",
                        ref_col: "bankCode",
                        ref_display: "bankName",
                    });
                }
                return bankNameHelper.getDisplay(val);
            }
        },
        init: function(xwajson) {



        }
    }
}();