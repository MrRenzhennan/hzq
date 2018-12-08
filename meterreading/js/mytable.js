/**
 * Created by Administrator on 2017/5/18.
 */
// Numeric only control handler
jQuery.fn.ForceNumericOnly =
    function()
    {
        return this.each(function()
        {
            $(this).keydown(function(e)
            {
                var key = e.charCode || e.keyCode || 0;
                // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
                // home, end, period, and numpad decimal
                return ( key == 8 || key == 9 || key == 13 || key == 46 ||  key == 110 || key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
            });
            $(this).keyup(function(e)
            {
                if($(this).val()&&$(this).val().length>0)
                {
                    if($(this).val()=="NaN"){
                        $(this).val(0)
                        return true
                    }

                    var i=parseInt($(this).val());
                    if((""+i).length!=$(this).val().length)
                        $(this).val(parseInt($(this).val()))
                }

                return true;
            });
        });
    };


var MyTable = function() {

    return {

        init: function(xwajson) {


            var tbform;
            var restURL;
            var waTable;
            var coldefs;
            var xwaOptions;
            var curSeachFilter;
            var basePath= "";


            var queryURL = function(url){
                // console.log("url=="+url+"::match="+url.match(/.*\?.*/));
                if(url.match(/.*\?.*/)){
                    if(url.match(/\&$/)||url.match(/\?$/)){
                        return url;
                    }
                    else return url+"&";
                }
                return url+"?";
            }

            // ajax送出前,时间必须转换格式
            var datetimeStringToDate = function(sendjson){
                $('#__editform .form_datetime').each(function(){
                    var name = $(this).children().attr("name");
                    // 20150406 将date格式更改为所有浏览器可辨识格式
                    sendjson[name] = new Date(sendjson[name]);
                });
            }

            // RYO 改写
            var handlechosen = function(diag){
                $.each(diag.find("select.chosen-select"), function(index, selEle) {

                    var id = $(selEle).attr('id');

                    var url = hzq_rest + $(selEle).attr("data-ref-url");

                    if(url){
                        var ref_name = $(selEle).attr("data-ref-name");
                        var ref_val = $(selEle).attr("data-ref-value");
                        var data_val = $(selEle).attr("data-value");

                        $.ajax({
                            url: queryURL(url)+'fields={"'+ref_name+'":1,"'+ref_val+'":1}',
                            dataType: 'json',
                            async:false
                        })
                            .done(function(data) {
                                var opts='<option ></option>';
                                if($(selEle).attr('data-ref-append'))
                                {

                                    $.each($(selEle).attr('data-ref-append').split(","),function(index, val) {
                                        var kv=val.split(":")
                                        if(kv.length!=2)return;
                                        opts+='<option value="'+kv[1]+'"';

                                        if(data_val === kv[1]) opts+=' selected ';

                                        if(kv[1] == kv[0]||
                                            xwaOptions['cols'][id]['hidecode']==true||kv[1].length==0){
                                            opts+='>'+kv[0]+'</option>'
                                        } else {
                                            opts+='>'+kv[1]+'</option>'
                                        }

                                    });
                                }

                                $.each(data, function(index, val) {
                                    opts+='<option value="'+val[ref_val]+'"';

                                    if(data_val === val[ref_val]) opts+=' selected ';

                                    if(val[ref_val] == val[ref_name]||
                                        xwaOptions['cols'][id]['hidecode']==true){
                                        opts+='>'+val[ref_name]+'</option>'
                                    } else {
                                        opts+='>'+val[ref_name]+'</option>'
                                    }
                                });

                                $(selEle).html(opts);
                            });
                    }
                });

                // 2015-05-29 拆开select与select2
                $.each(diag.find("select.select2"), function(index, selEle) {

                    var id = $(selEle).attr('id').replace("_select", ""); // replace for select2

                    var url = $(selEle).attr("data-ref-url");

                    if(url){
                        var ref_name = $(selEle).attr("data-ref-name");
                        var ref_val = $(selEle).attr("data-ref-value");
                        var data_split = $(selEle).attr("data-split") ? $(selEle).attr("data-split") : "";
                        var data_val = $(selEle).attr("data-value").split(data_split);

                        $.ajax({
                            url: queryURL(url)+'fields={"'+ref_name+'":1,"'+ref_val+'":1}',
                            dataType: 'json',
                            async:false
                        })
                            .done(function(data) {
                                var opts='<option ></option>';
                                console.log("op:"+id+JSON.stringify(xwaOptions['cols'][id]))
                                if($(selEle).attr('data-ref-append'))
                                {

                                    $.each($(selEle).attr('data-ref-append').split(","),function(index, val) {
                                        var kv=val.split(":")
                                        if(kv.length!=2)return;
                                        opts+='<option value="'+kv[1]+'"';

                                        if(data_val === kv[1]) opts+=' selected ';

                                        if(kv[1] == kv[0]||
                                            xwaOptions['cols'][id]['hidecode']==true||kv[1].length==0){
                                            opts+='>'+kv[0]+'</option>'
                                        } else {
                                            opts+='>'+kv[1]+'</option>'
                                        }

                                    });
                                }

                                $.each(data, function(index, val) {
                                    opts+='<option value="'+val[ref_val]+'"';

                                    if(data_val.indexOf(val[ref_val]) >= 0) opts+=' selected ';

                                    if(val[ref_val] == val[ref_name]||
                                        xwaOptions['cols'][id]['hidecode']==true){
                                        opts+='>'+val[ref_name]+'</option>'
                                    } else {
                                        opts+='>'+val[ref_name]+'</option>'
                                    }
                                });

                                $(selEle).html(opts);

                                // select2设定
                                if ($(selEle).attr('class').indexOf('select2') > 0) {
                                    $('#'+id+"_select").select2({
                                        placeholder: "请选择 " + xwaOptions['cols'][id]['friendly'],
                                        allowClear: true
                                    });

                                    $('#'+id+"_select").change(function(){
                                        $('#'+id).val($(this).val());
                                    });
                                }
                            });
                    }
                });

                //select 2
                $(".chosen-select").select2()
            }

            var handleCustomBuilder= function (diag){
                $.each(diag.find(".editcustom"), function(index, ele) {
                    console.log("builder=="+$(ele).attr("data-builder"));
                    var builder=$(ele).attr("data-builder");
                    var data_val=$(ele).attr("data-value");
                    console.log("call:val="+data_val)
                    var inner=eval(builder+"("+data_val+");");
                    $(ele).replaceWith(inner);
                });
            }

            var handleDatePickers = function (diag) {
                $.each(diag.find(".date-picker"), function(index, ele) {
                    $(ele).datepicker({
                        //rtl: Metronic.isRTL(),
                        autoclose: true
                    });
                    var data_val=$(ele).attr("data-value");
                    if(data_val)
                    {
                        $(ele).children("input").val(data_val);
                    }else{
                        //$(ele).children("input").val($.datepicker.formatDate('yy-mm-dd', new Date()));
                    }

                });

                // RYO 日期时间 (提供date_format自行修改格式) // 2015-06-06 配合新的日期物件做修改
                $.each(diag.find(".form_datetime"), function(index, ele) {

                    if (jQuery().datetimepicker) {

                        var date_format = $(ele).attr("data-date-format");

                        $(ele).datetimepicker({
                            format: date_format ? date_format : "yyyy-mm-dd",
                        });
                    } else {
                        console.log("bootstrap-datetimepicker 相关js尚未导入");
                    }
                });
            };

            var handleNumberInput = function (diag) {
                $.each(diag.find(".input_number"), function(index, ele) {
                    console.log("input_numberss");
                    $(ele).ForceNumericOnly();
                });
            };

            // 2015-05-29 ryo
            var handleValidate = function (diag) {
                diag.find(":input[validate],textarea[validate]").each(function(){

                    var obj = $(this);
                    var valid = obj.attr("validate");
                    // 最大长度限制
                    valid.replace(/length\[(\d+)-(\d+)]/, function(val){
                        val = val.replace("length","").replace("[","").replace("]","").split("-");
                        var length = parseInt(val[1], 10);
                        if (obj.attr("type")) {
                            obj.attr("maxlength",length);
                        } else {
                            obj.keyup({length:length}, function(event){
                                if ($(this).val().length > event.data.length) {
                                    $(this).val($(this).val().substring(0, event.data.length));
                                }
                            });
                        }
                    });

                    // 数字遮罩
                    valid.replace(/onlyNumber/, function(val){
                        obj.keyup(function(){
                            obj.val(obj.val().replace(/[^\d]/g,""));
                        });
                    });

                    // 数字英文字符遮罩
                    valid.replace(/onlyNumChar/, function(val){
                        obj.keyup(function(){
                            obj.val(obj.val().replace(/[^\w\d]/g,""));
                        });
                    });

                    // 金额遮罩
                    valid.replace(/money/, function(val){
                        obj.keyup(function(){
                            obj.val(obj.val().replace(/[^\d\.]/g,""));
                        });
                    });

                    // email遮罩
                    valid.replace(/email/, function(val){
                        obj.keyup(function(){
                            obj.val(obj.val().replace(/[^\w\@\.]/g,""));
                        });
                    });

                    // 密码遮罩
                    valid.replace(/password/, function(val){
                        obj.keyup(function(){
                            obj.val(obj.val().replace(/[^\w]/g,""));
                        });
                    });

                    //datetime // 2015-06-05 时间元件内直接做掉
                    // valid.replace(/time/, function(val){
                    //     obj.inputmask("y-m-d h:s:s", {
                    //         "placeholder": "yyyy-MM-dd HH:mm:ss"
                    //     });
                    // });
                });
            };


            var handleDefCtrl=function(diag){
                handleCustomBuilder(diag);

                handleDatePickers(diag);
                handlechosen(diag);

                handleNumberInput(diag);

                // 2015-05-29
                handleValidate(diag);
            }

            var addFunction = function() {
                // bootbox.alert("Hello world!");
                var modjson = JSON.parse(JSON.stringify(coldefs));
                $.each(coldefs, function(index, val) {
                    if(val['new_value'])
                    {
                        modjson[index]['default_value'] = val['new_value'].f();
                    }
                    if(modjson[index]['add_readonly']){
                        modjson[index]['readonly']="readonly";
                    }
                    else{
                        modjson[index]['readonly']="";
                    }
                });
                tbform = Duster.buildArr($('#__dust_tableform'));
                var diag=bootbox.dialog({
                    message: tbform(modjson),
                    title: "添加",
                    buttons: {
                        success: {
                            label: "保存",
                            className: "green",
                            callback: function() {
                                var sendjson = {};
                                $.each($('#__editform input'), function(index, val) {
                                    console.log(val.name+"::num="+$(val).hasClass("input_number"));
                                    console.log(val.name);
                                    if(!val.name||val.name.length==0) return;

                                    $.each(modjson, function(index, mm) {

                                        if(mm['col']==val.name&&mm['validate']!=undefined)
                                        {
                                            sendjson['validate_'+val.name] = mm['validate'];
                                            sendjson['friendly_'+val.name] = mm['friendly'];
                                        }

                                    });



                                    if($(val).attr('type') == "checkbox"){
//                                        console.log(val.name+"::ll="+val.checked);
                                        sendjson["validateNumber_"+val.name] =$('#__editform').find("input[name='"+val.name+"']:checked").length;
                                        if(val.checked){
                                            sendjson[val.name] = 1;
                                        }else{
                                            sendjson[val.name] = 0;
                                        }
                                    }else if(val.name == "password"){
                                        sendjson[val.name] = $.md5(val.value);
                                    }
                                    else if (val.name == "status"){
                                        //if($("#status").get(0).checked){
                                        sendjson[val.name] = val.value /*1*/;
                                        // }else{
                                        //sendjson[val.name] = 0;
                                        // }
                                    }else
                                    if($(val).hasClass("input_number"))
                                    {
                                        sendjson[val.name] = parseInt(val.value);
                                    }else{
                                        sendjson[val.name] = val.value;
                                    }

                                });
                                $.each($('#__editform select'), function(index, val) {



                                    $.each(modjson, function(index, mm) {

                                        if(mm['col']==val.name&&mm['validate']!=undefined)
                                        {
                                            sendjson['validate_'+val.name] = mm['validate'];
                                            sendjson['friendly_'+val.name] = mm['friendly'];
                                        }

                                    });












                                    console.log(val.name+"::"+val.value);
                                    if (val.name == xwaOptions["key_column"]||!val.name||val.name.length==0) return;
                                    sendjson[val.name] = val.value;
                                });
                                $.each($('#__editform textarea'), function(index, val) {


                                    $.each(modjson, function(index, mm) {

                                        if(mm['col']==val.name&&mm['validate']!=undefined)
                                        {
                                            sendjson['validate_'+val.name] = mm['validate'];
                                            sendjson['friendly_'+val.name] = mm['friendly'];
                                        }

                                    });














                                    console.log(val.name+"::"+val.value);
                                    if (val.name == xwaOptions["key_column"]||!val.name||val.name.length==0) return;
                                    sendjson[val.name] = val.value;
                                });





                                if(xwaOptions['onAdded']&&(xwaOptions['onAdded'](ret,sendjson))==1){
                                    return false;
                                }else{
                                    // 送出前,时间必须转换格式
                                    datetimeStringToDate(sendjson);

                                    console.log("submit::" + JSON.stringify(sendjson));
                                    console.log("restURL=" + restURL);
                                    var ret=Restful.insert(restURL, sendjson);

                                    // 2015-05-14 RYO
                                    if (xwaOptions['msgAdded']) {
                                        xwaOptions['msgAdded'](ret)
                                    } else if (ret.success) {
                                        bootbox.alert("<br><center><h4>新增成功！</h4><center><br>");
                                    } else {
                                        bootbox.alert("<br><center><h4>新增失败！<BR>" + ret.description + "</h4><center><br>");
                                    }

                                    // 2015-05-19 成功才刷新画面
                                    if (!ret.success) {
                                        return false;
                                    }

                                    waTable.update();
                                }
                            }
                        },
                        danger: {
                            label: "取消",
                            className: "gray",
                            callback: function() {}
                        },

                    }
                },{show:false,keyboard:false});
                handleDefCtrl(diag);
                console.log("ready to show");
                diag.show();
            };
            var updFunction = function() {
                // bootbox.alert("Hello world!");
                var selrows = waTable.getData(true);
                if (selrows.rows.length == 0) {
                    bootbox.alert("<br><center><h4>请选择需要修改的行</h4></center><br>");
                } else if (selrows.rows.length > 1) {
                    bootbox.alert("<br><center><h4>只能编辑一行</h4></center><br>");
                } else {
                    tbform = Duster.buildArr($('#__dust_tableform'));
                    var selrow = selrows.rows[0];
                    updForRow(selrow);

                }
            };
            var updForRow=function (selrow){
                var modjson = JSON.parse(JSON.stringify(coldefs));
                console.log("modjson::::"+JSON.stringify(coldefs));
                $.each(coldefs, function(index, val) {
                    modjson[index]['default_value'] = selrow[val.col];
                    if(modjson[index]['col']==xwaOptions["key_column"]){
                        modjson[index]['readonly']=true;
                    }
                    console.log("index=="+index);
                });
                console.log("modjson=="+JSON.stringify(modjson))
                var diag=bootbox.dialog({
                    message: tbform(modjson),
                    title: "修改",
                    buttons: {
                        success: {
                            label: "保存",
                            className: "green",
                            callback: function() {
                                var moditem = {};
                                $.each($('#__editform input'), function(index, val) {
                                    console.log(val.name+"::"+val.value);
                                    if (!val.name||val.name.length==0) return;



                                    $.each(modjson, function(index, mm) {

                                        if(mm['col']==val.name&&mm['validate']!=undefined)
                                        {
                                            moditem['validate_'+val.name] = mm['validate'];
                                            moditem['friendly_'+val.name] = mm['friendly'];
                                        }

                                    });



                                    if($(val).attr('type') == "checkbox"){
                                        console.log(val.name+"::ll="+val.checked);

                                        sendjson["validateNumber_"+val.name] =$('#__editform').find("input[name='"+val.name+"']:checked").length;

                                        if(val.checked){
                                            moditem[val.name] = 1;
                                        }else{
                                            moditem[val.name] = 0;
                                        }
                                    }
                                    else if (val.name == "status"){

                                        moditem[val.name] = val.value;
                                        /* console.log($("#status").val())
                                         console.log("checkkk:status=="+$("#status").get(0).checked)
                                         if($("#status").get(0).checked){
                                         moditem[val.name] = 1;
                                         }else{
                                         moditem[val.name] = 0;
                                         }*/
                                    }else{
                                        moditem[val.name] = val.value;
                                    }

                                    console.log(moditem)
                                });
                                $.each($('#__editform select'), function(index, val) {


                                    $.each(modjson, function(index, mm) {

                                        if(mm['col']==val.name&&mm['validate']!=undefined)
                                        {
                                            moditem['validate_'+val.name] = mm['validate'];
                                            moditem['friendly_'+val.name] = mm['friendly'];
                                        }

                                    });





                                    console.log(val.name+"::"+val.value);
                                    if (val.name == xwaOptions["key_column"]||!val.name||val.name.length==0) return;
                                    moditem[val.name] = val.value;
                                });
                                $.each($('#__editform textarea'), function(index, val) {

                                    $.each(modjson, function(index, mm) {

                                        if(mm['col']==val.name&&mm['validate']!=undefined)
                                        {
                                            moditem['validate_'+val.name] = mm['validate'];
                                            moditem['friendly_'+val.name] = mm['friendly'];
                                        }

                                    });


                                    console.log(val.name+"::"+val.value);
                                    if (val.name == xwaOptions["key_column"]||!val.name||val.name.length==0) return;
                                    moditem[val.name] = val.value;
                                });
                                var sendjson = {
                                    "$set": moditem
                                };



                                if(xwaOptions['onUpdated']&&(xwaOptions['onUpdated'](ret,moditem))==1){
                                    return false;
                                }else{

                                    // 送出前,时间必须转换格式
                                    datetimeStringToDate(moditem);

                                    console.log("submit::" + JSON.stringify(sendjson));
                                    var ret = Restful.updateRNQ(restURL , selrow[xwaOptions["key_column"]], moditem
                                    );

                                    // 2015-05-14 RYO
                                    if (xwaOptions['msgUpdated']) {
                                        xwaOptions['msgUpdated'](ret)
                                    } else if (ret.success) {
                                        bootbox.alert("<br><center><h4>修改成功！</h4><center><br>");
                                    } else {
                                        bootbox.alert("<br><center><h4>修改失败！<BR>" + ret.description + "</h4><center><br>");
                                    }

                                    // 2015-05-19 成功才刷新画面
                                    if (!ret.success) {
                                        return false;
                                    }

                                    var ret=waTable.update();
                                }
                            }
                        },
                        danger: {
                            label: "取消",
                            className: "gray",
                            callback: function() {}
                        },

                    }
                },{show:false,"keyboard" : true});
                handleDefCtrl(diag);
                console.log("ready to show");
                diag.show();
            }
            var delFunction = function() {
                var selrows = waTable.getData(true);

                if (selrows.rows.length == 0) {
                    bootbox.alert("<br><center><h4>请选择需要删除的行</h4></center><br>");
                } else {
                    var selrow = selrows.rows
                    bootbox.confirm("<br><center><h4>确定删除选择（" + selrows.rows.length + "）条记录吗？</h4></center><br>",
                        function(result) {
                            if (!result) return;
                            var ids=[];
                            $.each(selrow, function(index, row) {
                                ids.push(row[xwaOptions["key_column"]]);
                            });
                            if(xwaOptions['onDeleted']&&xwaOptions['onDeleted'](ret,ids)==1){
                                ;
                            }else{
                                console.log("delete:"+JSON.stringify(ids));
                                var ret=Restful.delByIDS(restURL, ids);

                                // 2015-05-14 RYO
                                if (xwaOptions['msgDeleted']) {
                                    xwaOptions['msgDeleted'](ret)
                                } else if (ret) {
                                    bootbox.alert("<br><center><h4>删除成功！</h4><center><br>");
                                } else {
                                    bootbox.alert("<br><center><h4>删除失败！</h4><center><br>");
                                }

                                waTable.update();

                            }

                        }); //--confirm(aSome)


                } //else
            };

            var findFunction=function(){
                curSeachFilter=xwaOptions.findFilter();
                if(curSeachFilter)
                {
                    waTable.setRestURL(queryURL(restURL)+'query='+curSeachFilter);
                }else{
                    waTable.setRestURL(restURL);
                }
                waTable.update();
            }

            //maqing 2014-09-26 增加自定义页面
            var customFunction = function(formName, formId, title, operatorType) {
                //  bootbox.alert("Hello world!");
                var modjson = JSON.parse(JSON.stringify(coldefs));
                var tbCustomform = Duster.buildArr($(formName));
                var diag;

                if (operatorType == "add") {
                    $.each(coldefs, function(index, val) {
                        if(val['new_value'])
                        {
                            modjson[index]['default_value'] = val['new_value'].f();
                        }
                        modjson[index]['readonly']="";
                    });
                    diag=bootbox.dialog({
                        message: tbCustomform(modjson),
                        title: title,
                        buttons: {
                            success: {
                                label: "保存",
                                className: "green",
                                callback: function() {
                                    var sendjson = {};
                                    $.each($('#'+formId+' input'), function(index, val) {
                                        // console.log(val.name+"::"+val.value);
                                        if (val.name == xwaOptions["key_column"]||!val.name||val.name.length==0) return;
                                        if(val.name == "leaf"){
                                            if($("#leaf").attr("checked")){
                                                sendjson[val.name] = 1;
                                            }else{
                                                sendjson[val.name] = 0;
                                            }
                                        }else{
                                            sendjson[val.name] = val.value;
                                        }

                                    });
                                    $.each($('#'+formId+' select'), function(index, val) {
                                        console.log(val.name+"::"+val.value);
                                        if (val.name == xwaOptions["key_column"]||!val.name||val.name.length==0) return;
                                        sendjson[val.name] = val.value;
                                    });

                                    console.log("submit::" + JSON.stringify(sendjson));
                                    console.log("restURL=" + restURL);
                                    var ret=Restful.insert(restURL, sendjson);
                                    if(xwaOptions['onAdded']){
                                        xwaOptions['onAdded'](ret,sendjson);
                                    }
                                    waTable.update();
                                }
                            },
                            danger: {
                                label: "取消",
                                className: "gray",
                                callback: function() {}
                            },
                        }
                    },{show:false,keyboard:false});
                } // end add
                else {
                    var selrows = waTable.getData(true);
                    if (selrows.rows.length == 0) {
                        bootbox.alert("<br><center><h4>请选择需要修改的行</h4></center><br>");
                    } else if (selrows.rows.length > 1) {
                        bootbox.alert("<br><center><h4>只能编辑一行</h4></center><br>");
                    } else {
                        var selrow = selrows.rows[0];

                        $.each(coldefs, function(index, val) {
                            modjson[index]['default_value'] = selrow[val.col];
                        });
                        var diag=bootbox.dialog({
                            message: tbCustomform(modjson),
                            title: title,
                            buttons: {
                                success: {
                                    label: "保存",
                                    className: "green",
                                    callback: function() {
                                        var moditem = {};
                                        $.each($('#'+formId+' input'), function(index, val) {
                                            console.log(val.name+"::"+val.value);
                                            if (val.name == xwaOptions["key_column"]||!val.name||val.name.length==0) return;
                                            if (val.name == "leaf"){
                                                if($("#leaf").attr("checked")){
                                                    moditem[val.name] = 1;
                                                }else{
                                                    moditem[val.name] = 0;
                                                }
                                            }else{
                                                moditem[val.name] = val.value;
                                            }
                                        });
                                        $.each($('#'+formId+' select'), function(index, val) {
                                            console.log(val.name+"::"+val.value);
                                            if (val.name == xwaOptions["key_column"]||!val.name||val.name.length==0) return;
                                            moditem[val.name] = val.value;
                                        });
                                        var sendjson = {
                                            "$set": moditem
                                        };

                                        console.log("submit::" + JSON.stringify(sendjson));
                                        Restful.update(restURL,
                                            selrow[xwaOptions["key_column"]], moditem
                                        );
                                        var ret=waTable.update();

                                        if(xwaOptions['onUpdated']){
                                            xwaOptions['onUpdated'](ret,moditem);
                                        }
                                    }
                                },
                                danger: {
                                    label: "取消",
                                    className: "gray",
                                    callback: function() {}
                                },

                            }
                        },{show:false,"keyboard" : true});
                    }
                } //end update
                handleDefCtrl(diag);
                console.log("ready to show");
                diag.show();
            };


            xwaOptions=xwajson;
            if(!xwaOptions["key_column"]){
                xwaOptions["key_column"]='_id'
            }
            onNew=xwaOptions.onNew;
            tbform = Duster.buildArr($('#__dust_tableform'));
            restURL = basePath+xwajson.restbase;
            rURL = restURL;

            coldefs = xwajson.coldefs;
            var cols={};
            $.each(coldefs, function(index, coldef) {
                cols[coldef.col]=coldef;
                cols[coldef.col]['indexS']=index; // 20150131
            });



            xwajson['cols']=cols;
            xwajson['restURL']=restURL;
            /**
             * 双击修改事件
             * if(!xwajson['rowDblClicked'])
             xwajson['rowDblClicked']=function(e){
                    console.log("dblclickedd::"+JSON.stringify(e.row));
                    updForRow(e.row);
                }

             **/
//-----------------READY------
            if(xwajson['divname']){
                waTable = $('#'+xwajson['divname']).WATable(xwajson).data('WATable');
            }
            else{
                waTable = $('#divtable').WATable(xwajson).data('WATable');
            }
            // console.log("addFunction=="+$('#add_button'));
            if(xwajson['addbtn']) $('#'+xwajson['addbtn']).click(addFunction);
            else $('#add_button').click(addFunction);

            if(xwajson['updbtn']) $('#'+xwajson['updbtn']).click(addFunction);
            else $('#upd_button').click(updFunction); //update diag

            if(xwajson['delbtn']) $('#'+xwajson['delbtn']).click(addFunction);
            else $('#del_button').click(delFunction); //--del-diag

            if(xwajson['findbtn']) $('#'+xwajson['findbtn']).click(addFunction);
            else $('#find_button').click(findFunction);//find-button

            //maqing 2014-09-26 增加自定义按钮
            var customForms  = xwajson.customForms;
            if (customForms) {
                $.each(customForms, function(index, customForm) {
                    $('#'+customForm.btnId).bind('click', customForm, function(event)
                    {
                        customFunction(event.data.formName,event.data.formId,
                            event.data.title, event.data.operateType);
                    } );
                });
            }


            // console.log("inpuss::"+.length);
            $.each($("input.inputclear"), function(index, inputele) {
                var input=$(inputele);
                var clear=input.next('span.inputclear');
                clear.removeClass('hide');
                input.keyup(function() {
                    clear.toggle(Boolean($(this).val()));
                });
                clear.toggle(Boolean(input.val()));
                clear.click(function() {
                    input.val('').focus();
                    input.trigger('input')
                    $(this).hide();
                });

            });

            return  {
                update: function(){
                    waTable.update();
                },
                autoResetSearch:function(){
                    curSeachFilter=xwaOptions.findFilter();
                    if(curSeachFilter)
                    {
                        waTable.setRestURL(queryURL(restURL)+'query='+curSeachFilter);
                    }else{
                        waTable.setRestURL(restURL);
                    }
                    waTable.update();
                },
                // 2015-08-13 定义刷新固定在同一页面的function与autoResetSearch做区别
                resetStatus:function(){
                    curSeachFilter=xwaOptions.findFilter();
                    if(curSeachFilter)
                    {
                        waTable.setRestURL(queryURL(restURL)+'query='+curSeachFilter);
                    }else{
                        waTable.setRestURL(restURL);
                    }
                    waTable.resetSearch();
                },
                setRestURL:function(url){
                    restURL = url;
                    waTable.setRestURL(url);
                },
                getRestURL:function(){
                    return  rURL;
                },
                getTable:function(){
                    return waTable;
                },
                getXWAOptions:function(){
                    return xwaOptions;
                },



            };
        },

    } //---xwatable-return;
}();

if($("#divtable")){
    $("#divtable").addClass('container')
}

