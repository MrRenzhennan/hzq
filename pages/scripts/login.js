var login_url = "/ismweb/dologin?op=login";
var logout_url = "/ismweb/dologin?op=logout";
var updatepass_url = "/ismweb/dologin?op=changepwd";

var userInfo = function() {
    return {
        init: function(username, password) {
            //console.log("is remember password::" + $.cookie('isremember'));
            if ($.cookie('isremember') == 1) {
                $("#username").val($.cookie('username'));
                $("#password").val($.cookie('password'));
                //$("input[name='remember']").prop('checked',true);
                $("#is_remember").trigger("click");
                //$("#is_remember").attr("checked", "checked");
            } else {
                $("#password").val("");
            }
        },
        updatePassword: function() {
            var diag = bootbox.dialog({
                message: "<form class=\"bootbox-form form-horizontal form-bordered form-label-stripped\" onsubmit=\"return false\" role=\"form\" id=\"__editform\">" +
                            "<div class=\"form-body\">" +
                                "<div class=\"form-group\" id=\"dg_oldpass\">" +
                                    "<label class=\"col-md-4 control-label\" id=\"dl_oldpass\">原密码</label>" +
                                    "<div class=\"col-md-8\" id=\"di_oldpass\">" +
                                        "<div class=\"input-icon right\">" +
                                        " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                        "<input type=\"password\" class=\"bootbox-input bootbox-input-text form-control\" id=\"oldpass\" name=\"oldpass\" value=\"\"/>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class=\"form-group\" id=\"dg_newpass\">" +
                            "<label class=\"col-md-4 control-label\" id=\"dl_newpass\">新密码</label>" +
                                "<div class=\"col-md-8\" id=\"di_newpass\">" +
                                "<div class=\"input-icon right\">" +
                                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                    "<input type=\"password\" class=\"bootbox-input bootbox-input-text form-control\" id=\"newpass\" name=\"newpass\" value=\"\"/>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                            "<div class=\"form-group\" id=\"dg_conpass\">" +
                                "<label class=\"col-md-4 control-label\" id=\"dl_conpass\">确认新密码</label>" +
                                "<div class=\"col-md-8\" id=\"di_conpass\">" +
                                "<div class=\"input-icon right\">" +
                                    " <i class=\"fa fa-info-circle tooltips\" data-container=\"body\"></i>" +
                                    "<input type=\"password\" class=\"bootbox-input bootbox-input-text form-control\" id=\"conpass\" name=\"conpass\" value=\"\"/>" +
                                "</div>" +
                            "</div>" +
                            "</div>" +
                                "<input type=\"hidden\" class=\"_mod_id\" id=\"_id\" name=\"_id\" value=\"\"/>" +
                            "</div>" +
                        "</form>",
                title: "密码修改",
                buttons: {
                    success: {
                        label: "修改",
                        className: "green",
                        callback: function() {
                            var userinfo = JSON.parse(localStorage.getItem('user_info'));
                            console.log(userinfo.userId)
                            var userid = Restful.findNQ(hzq_rest+"gassysuser/"+userinfo.userId);
                            console.log(userid.password)
                            var moditem = {};
                            $.each($('#__editform input'), function(index, val) {
                                if (val.name == "_id" || !val.name || val.name.length == 0) return;
                                moditem[val.name] = val.value;
                            });
                            console.log(moditem)

                            if (moditem["oldpass"] == "") {
                                alert("请输入原密码");
                                $("#oldpass").focus();
                                return false;
                            }else if($.md5(moditem.oldpass) != userid.password){
                                alert("原密码输入错误");
                                $("#oldpass").focus();
                                return false;
                            }else if (moditem["newpass"] == "") {
                                alert("请输入新密码");
                                $("#newpass").focus();
                                return false;
                            } else if (moditem["conpass"] == "") {
                                alert("请输入确认新密码");
                                $("#conpass").focus();
                                return false;
                            } else if (moditem["newpass"] != moditem["conpass"]) {
                                alert("输入新密码不一致");
                                $("#conpass").val("");
                                $("#conpass").focus();
                                return false;
                            }
                            var username = $.cookie('username');
                            var accountid = $.cookie('accountid');
                            var oldpass = $("#oldpass").val();
                            var password = $("#newpass").val();
                            var dl_conpass = $("#conpass").val();
                            var passw = {};
                            passw["password"] = $.md5(dl_conpass);
                            console.log(oldpass+'=='+password+'==='+dl_conpass)
                            $.ajax({
                                url:hzq_rest + "gassysuser/"+userinfo.userId,
                                headers:{
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                type:"PUT",
                                dateType:"json",
                                data:JSON.stringify(passw),
                                success:function(data){
                                    console.log(data)
                                    if(data.success){
                                        bootbox.alert("修改成功",function(){
                                            // window.location.href = "customer/contract_inhabitant.html";
                                        })
                                    }
                                }
                            })


                            //console.log("username:" + username + " password:" + password);

                            //验证原密码
                            /*var jsondata = Restful.findPNQ(login_url, "{\"username\":\"" + username + "\",\"password\":\"" + oldpass + "\"}");
                            //console.log("old username::" + JSON.stringify(jsondata));
                            //var jsondata = JSON.parse(userInfo);
                            if (jsondata.success) {
                                //更新密码
                                jsondata = Restful.findPNQ(updatepass_url, "{\"username\":\"" + username + "\",\"password\":\"" + password + "\",\"accountid\":\"" + accountid + "\"}");
                                //console.log("update username::" + JSON.stringify(jsondata));
                                //var resdata = JSON.parse(userInfo);
                                if (jsondata.success) {
                                    alert("修改成功！");
                                } else {
                                    alert("修改失败！");
                                }
                            } else {
                                $("#oldpass").val("");
                                $("#oldpass").focus();
                                return false;
                            }*/
                        }
                    },
                    danger: {
                        label: "取消",
                        className: "gray",
                        callback: function() {}
                    },

                }
            }, {
                show: false,
                "keyboard": true
            });
            diag.show();
            $("#oldpass").focus();
        },
    };
}();

//登陆验证信息
function submit_login(obj) {
    var username = $("#username").val();
    var password = $("#password").val();
    $("#username_confirm").text("");
    $("#password_confirm").text("");
    if (username == "") {
        $("#username_confirm").text("请输入登录用户名");
        $("#confirm").text("");
        $("#username").focus();
        return false;
    }
    if (password == "") {
        $("#password_confirm").text("请输入登录密码");
        $("#confirm").text("");
        $("#password").focus();
        return false;
    }
/**
    var l = Ladda.create(obj);
    l.start();

    var resdata;
    var jsonData = "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}";
    $.ajax({
        type: 'POST',
        url: login_url,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        data: jsonData,
        success: function(data) {
            resdata = data;
        },
        error: function(err) {
            l.stop();
            $("#confirm").text("登录错误");
        }
    });
    if (resdata.success) {
        $("#showloginname").html(resdata.accountname);
        //console.log("use" + resdata.retObj.username);
        //console.log("pass" + resdata.retObj.password);
        var expiryDate = new Date();
        var hours = 500;
        expiryDate.setTime(expiryDate.getTime() + (hours * 60 * 1000));
        //alert($("#is_remember"));
        var isrememberValue = "0";
        if ($("#is_remember").attr("checked") == "checked") {
            isrememberValue = "1";
        }
        $.cookie('username', resdata.username, {
            expires: expiryDate,
            path: '/'
        });
        $.cookie('accountname', resdata.accountname, {
            expires: expiryDate,
            path: '/'
        });
        $.cookie('accountid', resdata.accountid, {
            expires: expiryDate,
            path: '/'
        });
        //$.cookie('password', $.md5(resdata.retObj.password), { expires: expiryDate, path: '/' });
        l.stop();
        window.location = "index.html";
    } else {
        l.stop();
        $("#confirm").text(resdata.description);
        //$("#confirm").text("用户名或者密码不正确！");
        return false;
    }
 **/

    var expiryDate = new Date();
    var hours = 500;
    expiryDate.setTime(expiryDate.getTime() + (hours * 60 * 1000));
    
    if ($("#is_remember").attr("checked") == "checked") {
        isrememberValue = "1";
    }
    $.cookie('username', 'admin', {
        expires: expiryDate,
        path: '/'
    });
    $.cookie('accountname', '管理员', {
        expires: expiryDate,
        path: '/'
    });
    window.location = "index.html";
}

function logout() {
    var username = $.cookie('pm[loginname]');
    console.log(username)
    var accountid = $.cookie('pm[accountid]');
    console.log(accountid)
    localStorage.clear();
   // var jsonData = "{\"username\":\"" + username + "\",\"accountid\":\"" + accountid + "\"}";

    $.ajax({
        type: 'POST',
        url: "/hzqs/lio/pblou.do?fh=LINLIO0000000J00&resp=bd",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        //data: jsonData,
        async: false,
        success: function(data) {
            console.log("login response data::" + data);
        	
        	$.cookie('username',null,{expires:-1,path: '/'}); 
        	$.cookie('accountname',null,{expires:-1,path: '/'}); 
        	$.cookie('accountid',null,{expires:-1,path: '/'}); 
            window.location = "login.html";
        },
        error: function(err) {

        }
    });
  //  window.location = "login.html";
}
