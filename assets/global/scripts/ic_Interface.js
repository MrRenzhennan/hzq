
function IcFunction(data,CallbackName){
    $.ajax({
        type : "GET",
        url : "http://127.0.0.1:9000/?data="+data,
        dataType : "JSONP",
        jsonp : "callfuncname",
        jsonpCallback : CallbackName,
        success : function(data, textStatus, xhr){
            //console.log(data.result.resultcode);
            // $("#kh").innerText(data.result.kh);
            //客户基本信息里填卡号
           document.getElementById('kh').innerHTML=data.result.kh;
            /*填IC卡内部信息*/
            document.getElementById('kh1').innerHTML=data.result.kh;
            document.getElementById('ql').innerHTML=data.result.ql;
            document.getElementById('cs').innerHTML=data.result.cs;
            document.getElementById('syql').innerHTML=data.result.syql;
            document.getElementById('bkcs').innerHTML=data.result.bkcs;
            document.getElementById('ljql').innerHTML=data.result.ljql;
            document.getElementById('bkcs').innerHTML=data.result.bkcs;
            document.getElementById('dqdm').innerHTML=data.result.dqdm;
        },
        error : function(err){
        }
    });
}
// 读卡命令
function IC_read(data) {
    console.log(data);
}
// 写新卡命令
function IC_write(data) {
    console.log(data);
}
// 写卡命令
function IC_WriteInterface(data) {
    console.log(data);
}
// 格式化用户卡
function IC_format(data) {
    console.log(data);
}
// 用户卡气量清零
function IC_zero(data) {
    console.log(data);
}
// 解密银行卡数据
function IC_decrypt(data) {
    console.log(data);
}
// 加密银行卡数据
function IC_encryption(data) {
    console.log(data);
}
// 获取卡密码
function IC_obtain(data) {
    console.log(data);
}