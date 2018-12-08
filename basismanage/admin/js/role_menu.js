var rolemenuAction = function () {


    return {

        init: function () {
            typeHelper=RefHelper.create({
                ref_url:'gassysrole/?query={"roleType":"1"}',
                ref_col:"roleId",
                ref_display:"roleName",
            });
            console.log(typeHelper);

            $.each(typeHelper.getData(), function(key,value) {
                $('#sel_rolecode').append('<option value="'+key+'">'+value+'</option>');
            });
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            //this.initHelper();
            this.initUnitTree();
        },
        initUnitTree : function(){

            var roleselect=$('#sel_rolecode');
            var rolepermMap={};
            var reloadRolePerm=function(){
                var data = Restful.findNQ("/hzq_rest/gassysrolemenu");
                $.map(data,function(index,val){
                    rolepermMap[index["roleId"]+"___"+index["menuId"]] = val;
                })
            };

            reloadRolePerm();

            // console.log("rrp="+JSON.stringify(rolepermMap))
            var isPermit=function (role,permissionid){
                return rolepermMap[role+"___"+permissionid];
            };

            var menuMap={};
            var menuData=[];
            var ss=[];
            var rolemenuId = [];
            var buildMenuData=function(){
                rolemenuId = [];
                var roleid = $("#sel_rolecode").val();
                    console.log(roleid)

                    var data = Restful.findNQ('/hzq_rest/gassysmenu?query={"status":"1"}');
                    var data1 = Restful.findNQ("/hzq_rest/gassysrolemenu");
                    //console.log(data);
                    //console.log(data1);
                    $.each(data1,function(index,item){
                        if(item["roleId"] == roleid){
                            rolemenuId.push(item["menuId"]);
                        }
                    })
                console.log(rolemenuId);

                    var menuid = [];
                    $.each(data1,function(index,item){
                        if(item["roleId"] == roleid){
                            menuid.push(item["menuId"])
                        }
                    });
                    console.log(menuid);
                    $.each(data, function(index, item) {
                        ss.push(menuMap[item.menuId]={
                            "text": item["menuName"],
                            "icon": item["icon"],
                            "url": item["menuUrl"],
                            "id": item.menuId
                        });
                    });
                    var menutree = [];
                    var menuT = [];
                    $.each(data,function(index,item){
                        var aa={
                            "text": item["menuName"],
                            //"icon": item["icon"],
                            "url": item["menuUrl"],
                            "parentId":item["parentMenuId"],
                            "id": item.menuId
                        };

                        if($.inArray(item['menuId'],menuid)!= '-1'){
                            //console.log(menuid[index])
                           aa["state"] = {"selected":true}
                        }else{
                            aa["state"] = {"selected":false}
                        }
                        menuT.push(aa);
                    });
                    console.log(menuT);
                    //一级菜单添加children
                    $.each(menuT,function(index,item){
                       if(item["parentId"] == "#"){
                           item["children"]=[];
                           menutree.push(item);
                       }
                    });
                    //二级菜单
                    $.each(menutree,function(index,item){
                        //console.log(item["id"]);
                        $.each(menuT,function(inde,ite){
                            if(ite["parentId"] == item["id"]){
                                ite["children"] = [];
                                item["children"].push(ite);
                            }
                        })
                    });
                    //三级菜单
                    $.each(menutree,function(index,item){
                        $.each(item["children"],function(inde,ite){
                            $.each(menuT,function(ind,it){
                                if(it["parentId"] == ite["id"]){
                                    ite.children.push(it);
                                }
                            })
                        })
                    });
                    // console.log(menutree);
                // console.log(JSON.stringify(menutree))
                return menutree;
            }
            var permtree;
            var createTree=function(){


                permtree=$('#role_tree').jstree({
                    'plugins': ["wholerow", "checkbox", "types"],
                    'core': {
                        "themes" : {
                            "responsive": true
                        },
                        'data':
                            function (obj, cb) {
                                cb.call(this,buildMenuData());
                            }
                    },
                    "types" : {
                        "default" : {
                            "icon" : "fa fa-folder icon-state-warning icon-lg"
                        },
                        "file" : {
                            "icon" : "fa fa-file icon-state-warning icon-lg"
                        }
                    }
                });
                console.log($("#100100100").length)
            };

            $('#save_button').click(function(){
                rolemenuId = [];
                var roleid = $("#sel_rolecode").val();
                var data1 = Restful.findNQ("/hzq_rest/gassysrolemenu");
                $.each(data1,function(index,item){
                    if(item["roleId"] == roleid){
                        rolemenuId.push(item["roleMenuId"]);
                    }
                });
                console.log(rolemenuId.join());
                //先删除现有菜单
                var aaa = Restful.delByIDS("/hzq_rest/gassysrolemenu",rolemenuId)
                //console.log(aaa);


                var role=roleselect.val();
                console.log("role=="+role);

                /*var checkedNodes = $('#sel_rolecode').jstree("get_all_checked");
                var checkedNodes = $('#sel_rolecode').jstree(true).get_all_checked();
                var checkedNodes = $('#sel_rolecode').jstree(true).get_all_checked(true);*/

                var selected=permtree.jstree().get_selected(true);

                console.log(selected.length);
                var selectdata = [];
                for(var i=0;i<selected.length;i++){
                    //console.log(selected[i].children.length)
                    if(!selected[i].children.length){
                        selectdata.push(selected[i])
                    }
                }
                console.log(selectdata)

                var date = new Date();
                console.log(date);
                var senddata=[];
                $.each(selectdata, function(index, val) {
                    senddata.push({"roleId":role,"menuId":val.id,"createdTime":date, "modifiedTime": date, "status": "1"});
                });

                if(senddata.length<=0){
                    senddata.push({"roleId":role,"menuId":-1});
                }

                console.log(senddata)
                console.log("Sendding Data::"+JSON.stringify(senddata));
                var jsondata = Restful.postDataR("/hzq_rest/gassysrolemenu", JSON.stringify(senddata));

                console.log(jsondata);
               // var jsondata = Restful.postDataR("/hzq_rest/gassysrolemenu/?retobj=2", JSON.stringify(senddata));
               // console.log("role permission jsondata::" + JSON.stringify(jsondata));
                if (jsondata.success) {
                    bootbox.alert("保存成功！");
                } else {
                    bootbox.alert("保存失败！");
                }
            });

            roleselect.change(function(){
                /*console.log($(this).val())
                buildMenuData($(this).val());*/
                permtree.jstree().destroy();
                ss=[];

                //reloadRolePerm();
                createTree();
            });
            createTree();
        }
    }
}();
