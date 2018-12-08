console.log(location.href)
var LoginAction = function() {
    var lostLogin=0;
    var callback = function(){
        lostLogin=new Date().getTime();
        console.log("callback")
    }
    return {
        passwordTxt:$( "#password" ),
        loginnameTxt:$( "#loginname" ),
        loginBtn:  $('#submitbtn'),
        keys:null,
        init:function(){
           /* var remember = $.cookie('pm[remember]');
            if (remember) {
                $("#loginname").val($.cookie('pm[loginname]'));
                $('#password').val($.cookie('pm[password]'));
                $('#remember').attr("checked", true);
            }*/

            
            $.backstretch([
                    "assets/admin/bg/1.jpg",
                    "assets/admin/bg/2.jpg",
                    "assets/admin/bg/3.jpg",
                    "assets/admin/bg/4.jpg",
                    "assets/admin/bg/5.jpg",
                    "assets/admin/bg/6.jpg"
                ], {
                    fade: 2000,
                    duration: 3000
                }
            );
            // this.getKeys();
            this.bind();
        },
        bind:function(){
            this.passwordTxt.on('keypress',this.passwordKeyPress);
            this.loginnameTxt.on('keypress',this.passwordKeyPress);
            this.loginBtn.on('click',this.loginClick);
        },
        passwordKeyPress:function(event){
            console.log("passwordKeyPress:"+$('.bootbox').hasClass('in'));
             if($('.bootbox').hasClass('in')){
                bootbox.hideAll();
                lostLogin = new Date().getTime();
                return;
            }
            if(new Date().getTime()-lostLogin<300){
                //bootbox.alert("不要登陆太频繁了哦",callback);
                //lostLogin = new Date().getTime();
                return;
            }
            if ( event.keyCode == 13 ) {
                LoginAction.loginClick();
                event.stopPropagation();
                event.preventDefault();
            }
        },
        loginClick:function(){
            //console.log(0);
            if($('.bootbox').hasClass('in')){
                bootbox.hideAll();
                lostLogin = new Date().getTime();
                return;
            }
            if(new Date().getTime()-lostLogin<300){
                //bootbox.alert("不要登陆太频繁了哦",callback);
                //lostLogin = new Date().getTime();
                return;
            }
            if(!LoginAction.passwordTxt.val() && !LoginAction.loginnameTxt.val()){
                bootbox.alert("请输入用户名和密码！",callback)
            }else if(!LoginAction.passwordTxt.val() && LoginAction.loginnameTxt.val()){
                bootbox.alert("请输入密码！",callback)
            }else if(LoginAction.passwordTxt.val() && !LoginAction.loginnameTxt.val()){
                bootbox.alert("请输入用户名！",callback)
            }else{
                LoginAction.login();
            }

        },
        login:function(){
            //console.log(1)
            var pwd=$.cookie('pm[password]');
            if($('.bootbox').hasClass('in')){
                bootbox.hideAll();
                lostLogin = new Date().getTime();
                return;
            }
            if(new Date().getTime()-lostLogin<300){
                //bootbox.alert("不要登陆太频繁了哦",callback);
                //lostLogin = new Date().getTime();
                return;
            }
            if(pwd !=LoginAction.passwordTxt.val()){
               
                if(validateCustom("#target")==1){
                    bootbox.alert("密码规则需符合以下条件：</br>密码不能为空</br>密码长度必须在6至8之间</br>请输入有效的密码,如:PasSw0rD_",callback);
                    return;
                }

                LoginAction.callLogin($.md5(LoginAction.passwordTxt.val()));
                /*$.jCryption.encrypt(LoginAction.passwordTxt.val(), LoginAction.keys, function(encrypted) {
                    LoginAction.callLogin(encrypted);
                });*/
            }else{
                //console.log($.md5(pwd));
                LoginAction.callLogin($.md5(pwd));
            }
        },
        callLogin:function(mdPw){
            console.log("bootboxdis = "+$('.bootbox').hasClass('in'))
            if($('.bootbox').hasClass('in')){
                bootbox.hideAll();
                lostLogin = new Date().getTime();
                return;
            }
            if(new Date().getTime()-lostLogin<300){
                //bootbox.alert("不要登陆太频繁了哦",callback);
                //lostLogin = new Date().getTime();
                return;
            }
            lostLogin = new Date().getTime();
            //console.log($.md5('123456'));

            // modify by sean 
            // 修改重定向不跳转到来源页面
            // var prelocation=Metronic.getURLParameter("redirect");
            // if(!prelocation||prelocation=="/login.html"){
            //     prelocation="index.html"
            // }
            var prelocation="index.html"
            prelocation=prelocation.split(",")[0]
            console.log("redirect to :"+prelocation)
            //console.log(LoginAction.loginnameTxt.val() +"====="+mdPw)
            dologin = true;

          //  $('body').modalmanager({  backdrop: 'static',keyboard: false}); 
            //console.log("do loading")

            $.ajax({
                url:'/hzqs/lio/pblin.do?fh=LINLIO0000000J00&resp=bd',
                type: 'POST',
                dataType:'json',
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify({"user_name": LoginAction.loginnameTxt.val() , "password": mdPw }),
                async:false,
                success:function(data, textStatus, xhr) {
                    console.log("@@@@data="+JSON.stringify(data));

                    localStorage.setItem("menu_info",JSON.stringify(data.menu_info));
                    localStorage.setItem("user_info",JSON.stringify(data.user_info));
                    if(data.err_code && data.err_code == "1"){
                        $.cookie.json = true;
                        $.cookie('userinfo', JSON.stringify(data.retObj));

                        //window.location.replace("index.html");
                         window.location.replace(prelocation);
                        var expires_day = 7;
                        if ($('#remember').is(':checked')) {
                            //cookie有效天数
                            $.cookie('pm[loginname]', $("#loginname").val(), { expires: expires_day });
                            $.cookie('pm[password]', data.description, { expires: expires_day });
                            $.cookie('pm[remember]', true, { expires: expires_day });
                        }
                        else {
                            // reset cookies.
                            $.cookie('pm[loginname]', '');
                            $.cookie('pm[password]', '');
                            $.cookie('pm[remember]', false);
                        }
                    }else{
                       // if(data.description && data.description=='0'){
                            LoginAction.loginnameTxt.val('');
                            LoginAction.passwordTxt.val('');
                            $.cookie('pm[loginname]', '');
                            $.cookie('pm[password]', '');
                            $.cookie('pm[remember]', false);
                            if(data.err_code==-9998)
                                bootbox.alert("用户无权限使用该系统！",callback);
                            else if(data.err_code==-9997)
                                bootbox.alert("用户或密码错误！",callback);
                            else if(data.err_code==-9996)
                                bootbox.alert("1密码规则需符合以下条件：</br>密码不能为空</br>密码,callback长度必须在6至8之间</br>请输入有效的密码,如:PasSw0rD_",callback);
                            else if(data.err_code==-9999)
                                bootbox.alert("登入错误,请重新登入！",callback);
                            else if(data.err_code=="2"){
                                bootbox.alert("<b>登录失败,可能的原因如下：</b></br></br> 1.用户名或密码错误；</br> 2.账户已停用或已删除。");
                                //bootbox.alert(data.msg,callback);
                            }
                       // }
                       //  else{
                       //      bootbox.alert("用户或密码错误！");
                       //  }
                    }
                }
            }).error(function(data,status){
                bootbox.alert("网络故障，无法访问服务～<br>"+status,callback);
            });
            dologin = false;

        }/*,
        getKeys:function(){
            $.jCryption.getKeys(hzq_rest+'security/key', function(receivedKeys) {
                LoginAction.keys = receivedKeys;
            });
        }*/
    };
}();