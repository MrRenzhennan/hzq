function IcFunction(data,CallbackName){
    $.ajax({
        type : "GET",
        url : "http://127.0.0.1:9000/?data="+data,
        dataType : "JSONP",
        jsonp : "callfuncname",
        jsonpCallback : CallbackName,
        success : function(data, textStatus, xhr){
            console.log(data);
        },
        error : function(err){
        }
    });
}
// 读卡命令
function IC_read(data) {
    console.log("test~" + data.data);
}
// 写新卡命令
function IC_write(data) {
    console.log("test~" + data.data);
}
// 写卡接口
function IC_WriteInterface(data) {
    console.log("test~" + data.data);
}
// 格式化用户卡
function IC_format(data) {
    console.log("test~" + data.data);
}
// 用户卡气量清零
function IC_zero(data) {
    console.log("test~" + data.data);
}
// 解密银行卡数据
function IC_decrypt(data) {
    console.log("test~" + data.data);
}
// 加密银行卡数据
function IC_encryption(data) {
    console.log("test~" + data.data);
}
// 获取卡密码
function IC_obtain(data) {
    console.log("test~" + data.data);
}