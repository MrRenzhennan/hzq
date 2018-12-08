/**
 * Created by Administrator on 2017/5/21 0021.
 */
// 用户信息
var UserInfo =function(){

    return {
        init:function(){
            var userinfo = JSON.parse(localStorage.getItem('user_info'));
            return userinfo;
        },
        userId:function(){
        	 var userinfo = JSON.parse(localStorage.getItem('user_info'));
             if(userinfo) 
                return userinfo.userId;
            else
                return null;
        },
        item:function(){
            return JSON.parse(localStorage.getItem('user_info'));
        },
        
    }
}();