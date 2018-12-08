var GasModService = function() {
    return{
        date_format: function (date, fmt) {
            var dataJson = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in dataJson)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (dataJson[k]) : (("00" + dataJson[k]).substr(("" + dataJson[k]).length)));
            return fmt;
        },

        getUuid: function (){
            var len=32;//32长度
            var radix=16;//16进制
            var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid=[],i;radix=radix||chars.length;
            if(len){
                for(i=0;i<len;i++)uuid[i]=chars[0|Math.random()*radix];
            }else{
                var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';
                for(i=0;i<36;i++){
                    if(!uuid[i]){
                        r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];
                    }
                }
            }
            return uuid.join('');
        }
    }
}();