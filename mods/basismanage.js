/**
 * Created by alex on 2017/5/12.
 */
var isLoginBuilder = function(val){
    if(val=="1"){
        return "<select id='isLogin' name='isLogin' class='form-control select2me'>" +
            "<option value='1' selected>是</option>" +
            "<option value='0' >否</option></select>" ;
    }else if(val=="0"){
        return "<select id='isLogin' name='isLogin' class='form-control select2me'>" +
            "<option value='1' >是</option>" +
            "<option value='0' selected>否</option></select>" ;
    }else{
        return "<select id='isLogin' name='isLogin' class='form-control select2me'>" +
            "<option value='1' selected>是</option>" +
            "<option value='0' >否</option></select>" ;
    }
};
var logBuilder= function(val){
    if(val=="Y"){
        return "<select id='urlLogType' name='urlLogType' class='form-control select2me'>" +
            "<option value='Y' selected>是</option>" +
            "<option value='N' >否</option></select>" ;
    }else if(val=="N"){
        return "<select id='urlLogType' name='urlLogType' class='form-control select2me'>" +
            "<option value='Y' >是</option>" +
            "<option value='N' selected>否</option></select>" ;
    }else{
        return "<select id='urlLogType' name='urlLogType' class='form-control select2me'>" +
            "<option value='Y' >是</option>" +
            "<option value='N' >否</option></select>" ;
    }
};
var logTypeBuilder=function(val){
    if(val=="1"){
        return "<select id='urlResourceType' name='urlResourceType' class='form-control select2me'>" +
            "<option value='1' selected>需要登陆</option>" +
            "<option value='2' >不需要登陆</option></select>" ;
    }else if(val=="2"){
        return "<select id='urlResourceType' name='urlResourceType' class='form-control select2me'>" +
            "<option value='1' >需要登陆</option>" +
            "<option value='2' selected>不需要登陆</option></select>" ;
    }else{
        return "<select id='urlResourceType' name='urlResourceType' class='form-control select2me'>" +
            "<option value='1' >需要登陆</option>" +
            "<option value='2' >不需要登陆</option></select>" ;
    }
};
var statusEditBuilder=function(val){
    console.log(val)
    if(val=="1"){
        return "<select id='status' name='status' class='form-control select2me'>" +
            "<option value='1' selected>启用</option>" +
            "<option value='2' >停用</option>"+
            "<option value='3' >已删除</option></select>" ;
    }else if(val=="2"){
        return "<select id='status' name='status' class='form-control select2me'>" +
            "<option value='1' >启用</option>" +
            "<option value='2' selected>停用</option>"+
            "<option value='3' >已删除</option></select>" ;
    }else if(val == "3"){
        return "<select id='status' name='status' class='form-control select2me'>" +
            "<option value='1' >启用</option>" +
            "<option value='2' >停用</option>"+
            "<option value='3' selected>已删除</option></select>" ;
    }else{
        return "<select id='status' name='status' class='form-control select2me'>" +
            "<option value='1' >启用</option>" +
            "<option value='2' >停用</option>"+
            "<option value='3' >已删除</option></select>" ;
    }
};
var dateFormat = function () {
    return {
        f: function (val) {
            if(val) {
                var data = val.split("T");
                var aa = [];
                for (var i = 0; i < data[1].split(":").length; i++) {
                    if (i < 2) {
                        aa.push(data[1].split(":")[i])
                    }
                }
                data[1] = aa.join(":");
                console.log(data.join(" "));
                date = data.join(" ");
                return date;
            }
        }
    }
}();
var GasSysBasic=function(){
    var  IsOrNo = {"0":"否","1":"是"};
    var  isDir = {"1":"否","2":"是"};
    var  Status = {"1":"启用" ,"2":"停用","3":"已删除"};
    var  InterfaceType={"1":"需要登陆","2":"不需要登录"};
    var  parameterTypeName = {"1":"技术参数","2":"业务参数","3":"流程参数"};
    var  roleType = {"1":"菜单角色","2":"流程角色","3":"数据角色"};
    var  meterStatus = {"1":"正常","2":"表慢","3":"表快","4":"死表"};
    var  meterexceptionType = {"01":"压力","02":"温度","03":"电池异常","04":"智能封","05":"注油"};
    var  meterKind = {"01":"普表","02":"IC卡气量表","03":"IC卡金额表","04":"代码表","05":"远传表"};
    var direction = {"L":"左","R":"右"};
    var logStatus={"N":"否","Y":"是"};
    return{
        isDirFormat:{
            f:function(val){
                return isDir[val];
            }
        },
        directionFormat:{
            f: function(val){
                return direction[val];
            }
        },
        IsOrNoFormat:{
            f: function(val){
                return IsOrNo[val];
            }
        },
        roleTypeFormat:{
            f: function(val){
                return roleType[val];
            }
        },
        StatusFormat:{
            f: function(val){
                return Status[val];
            }
        },
        InterfaceTypeFormat:{
            f: function(val){
                return InterfaceType[val];
            }
        },
        parameterTypeNameFormat:{
            f: function(val){
                return parameterTypeName[val];
            }
        },
        meterStatus:{
            f:function(val){
                return meterStatus[val];
            }
        },
        meterexceptionTypeFormat:{
            f:function(val){
                return meterexceptionType[val];
            }
        },
        meterKindFormat:{
            f:function(val){
                return meterKind[val];
            }
        },
        logFormat:{
            f:function(val){
                return logStatus[val];
            }
        },

        init: function(xwajson) {



        }
    }
}();