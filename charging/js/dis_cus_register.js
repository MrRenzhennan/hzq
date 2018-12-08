var disCusRegisterAction = function () {

    var xw ;
    var nonRsdtDctId;


    var stepAndPriceFormat = function () {
        return {
            f : function (val,row) {
                var stepStr = "";
                if(row["priceType"] ==2){ //固定价格
                    stepStr = "周期价:"+ row["price1"];
                }else{
                    for(var i=1;i<=5;i++) {
                        var measureFrom = "measureFrom"+i ;
                        var measureTo = "measureTo"+i ;
                        var price = "price"+i ;
                        if((row[measureFrom]==0 ||row[measureFrom]) && row[measureTo] && row[price]){
                            stepStr=stepStr +"第"+i+"阶梯:"+row[measureFrom]+ "~"+row[measureTo]+"&nbsp价格:" +row[price]+"<br/>";
                        }
                    }
                }
                return stepStr;
            }
        }
    }();

    var gotoDetail = function () {
        return {
            f : function (val,row) {
                console.log("thr row data is ::::::" + row);
                var jsonStr = JSON.stringify(row);
                return "&nbsp <a href='charging/dis_cus_register_info.html?nonRsdtDctId=" +  row["nonRsdtDctId"] + "\'>" + "&nbsp详情"+ "</a>" +
                        "<a href='#' onclick='renewed(" + jsonStr + ")' data-target='#' data-toggle='modal' \>&nbsp续签</a> &nbsp";
                //window.location.href='charging/application_add.html?nonRsdtDctId='+row["nonRsdtDctId"] ;
            }
        }
    }();


    return {


        discountTypeEditBuilder:function(val){
            var str="";
            if(val==1){
                str ="<select id='discountType' name='discountType' class='form-control select2me'><option value=1 selected>阶梯价格</option><option value=2 >固定价格</option><option value=3 >照付不议</option></select>";
            }else if(val==2) {
                str = "<select id='discountType' name='discountType' class='form-control select2me'><option value=1 >阶梯价格</option><option value=2 selected>固定价格</option><option value=3>照付不议</option></select>";
            }else if(val==3){
                str = "<select id='discountType' name='discountType' class='form-control select2me'><option value=1 >阶梯价格</option><option value=2 >固定价格</option><option value=3 selected>照付不议</option></select>";
            }else{
                str = "<select id='discountType' name='discountType' class='form-control select2me'><option value=1 >阶梯价格</option><option value=2 selected>固定价格</option><option value=3 >照付不议</option></select>";
            }
            return str;
        },

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
        },


        reload:function(){

            $('#divtable').html('');
			var queryCondion = RQLBuilder.and([
	            RQLBuilder.equal("status","1"), //1启用
	            RQLBuilder.equal("nonrsdtType","1")
	        ]).rql()
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: "gasbllnonrsdtdct?query="+queryCondion,
                    key_column:"nonRsdtDctId",
                    coldefs:[
                        {
                            col:"nonRsdtDctId",
                            friendly:"非居民优惠ID",
                            unique:true,
                            hidden:true,
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"customerName",
                            friendly:"大客户名称",
                           // format:bigCusInfoFormat,
                            index:2
                        },
                        {
                            col:"customerTel",
                            friendly:"大客户电话",
                            validate:"required,onlyNumber,length[0-12]",
                            index:3
                        },
                        {
                            col:"customerAddress",
                            friendly:"大客户地址",
                            hidden:true,
                            index:4
                        },
                        {
                            col:"discountType",
                            friendly:"优惠类型",
                            inputsource: "select",
                            format:GasModBil.DiscountType,
                            inputsource: "custom",
                            inputbuilder: "disCusRegisterAction.discountTypeEditBuilder",
                            index:5
                        },
                        {
                            col:"rn",
                            friendly:"阶梯和气价",
                            format:stepAndPriceFormat,
                           // format:GasModBil.measure_price,
                            nonedit: "noeidt",
                            index:6
                        },
                        {
                            col:"yearLeastGas",
                            friendly:"年最低用气量",
                            validate:"onlyNumber,length[0-15]",
                            index:7
                        },
                        {
                            col:"treatyStartTime",
                            friendly:"协议开始时间",
                            format:GasModBil.dateFormat,
                            inputsource:"datepicker",
                            date_format:"yyyy-MM-dd",
                            validate:"date",
                            readonly:"readonly",
                            index:8
                        },
                        {
                            col:"treatyEndTime",
                            friendly:"协议结束时间",
                            format:GasModBil.dateFormat,
                            inputsource:"datepicker",
                            date_format:"yyyy-MM-dd",
                           // date_format:"yyyy-mm-dd hh:ii:ssZ",
                            readonly:"readonly",
                            index:9
                        },
                        {
                            col:"belongTo",
                            friendly:"所属单位",
                            index:10
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            nonedit: "noeidt",
                            format:GasModBil.dateFormat,
                            index:11
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            hidden:true,
                            nonedit:'nosend',
                            index:12
                        },

                        {
                            col:"modifiedTime",
                            friendly:"操作",
                            format:gotoDetail,
                            nonedit: "noeidt",
                            index:13
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            nonedit:'nosend',
                            hidden:true,
                            index:12
                        },
                        {
                            col:"measureFrom1",
                            friendly:"第一阶梯起始量",
                            //format:operateFormat,
                            hidden:true,
                            validate:"required,onlyNumber,length[0-20]"
                        },
                        {
                            col:"measureTo1",
                            friendly:"第一阶梯结束量",
                            //format:operateFormat,
                            hidden:true,
                            validate:"required,onlyNumber,length[0-20]"
                        },
                        {
                            col:"price1",
                            friendly:"第一阶梯价格",
                            //format:operateFormat,
                            hidden:true,
                            validate:"required,money,length[0-20]",
                        },
                        {
                            col:"measureFrom2",
                            friendly:"第二阶梯起始量",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            hidden:true
                        },
                        {
                            col:"measureTo2",
                            friendly:"第二阶梯结束量",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            
                            hidden:true
                        },
                        {
                            col:"price2",
                            friendly:"第二阶梯价格",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            hidden:true
                        },
                        {
                            col:"measureFrom3",
                            friendly:"第三阶梯起始量",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            hidden:true
                        },
                        {
                            col:"measureTo3",
                            friendly:"第三阶梯结束量",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            hidden:true
                        },
                        {
                            col:"price3",
                            friendly:"第三阶梯起价格",
                            //format:operateFormat,
                            inputsource:"positive-numeric",
                            hidden:true
                        },
                        {
                            col:"measureFrom4",
                            friendly:"第四阶梯起始量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"measureTo4",
                            friendly:"第四阶梯结束量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"price4",
                            friendly:"第四阶梯起价格",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"measureFrom5",
                            friendly:"第五阶梯起始量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"measureTo5",
                            friendly:"第五阶梯结束量",
                            //format:operateFormat,
                            hidden:true
                        },
                        {
                            col:"price5",
                            friendly:"第五阶梯起价格",
                            //format:operateFormat,
                            hidden:true
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function(){

                        var queryUrl=hzq_rest+"gasbllnonrsdtdct";
                        var querys=new Array()
                        if ($('#find_customerName').val()) {
                            querys.push(RQLBuilder.like("customerName", $('#find_customerName').val()));
                        }
                        if ($('#find_customerAddress').val()) {
                            querys.push(RQLBuilder.like("customerAddress", $('#find_customerAddress').val()));
                        }

                        if ($('#find_start_date').val()) {
                            var effectTime = RQLBuilder.condition("treatyStartTime","$lte","to_date('"+ $('#find_start_date').val() +"','yyyy-MM-dd')");
                            querys.push(effectTime);
                        }

                        if ($('#find_end_date').val()) {
                            var effectTime = RQLBuilder.condition("treatyEndTime","$gte","to_date('"+ $('#find_end_date').val() +"','yyyy-MM-dd')");
                            querys.push(effectTime);
                        }

                        var status = RQLBuilder.equal('status', '1');
                        var nonrsdtType = RQLBuilder.equal('nonrsdtType', '1');
                        querys.push(status);
                        querys.push(nonrsdtType);

                        if(querys.length>0){
                            queryUrl += "?query="+RQLBuilder.and(querys).rql();
                        }

                        xw.setRestURL(queryUrl);
                        return "";
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },

                    onUpdated: function(ret,jsondata){
                        xw.setRestURL(hzq_rest+"gasbllnonrsdtdct");
                        return  validateForm(jsondata);
                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
        },


    }
}();
    $('#save_big_cust').click('on',function () {

        if(validateCustom("#save_big_cust_form")==1){
            $('.Metronic-alerts').remove();
            bootbox.alert("输入数据需符合以下条件：</br>" +
                            "大客户电话不能为空、必须是数字、长度必须在0至12之间</br>" +
                            "年最低用气量必须是数字、长度必须在0至15之间</br>" +
                            "第一阶梯起始量不能为空、必须是数字、长度必须在0至20之间</br>" +
                            "第一阶梯结束量不能为空、必须是数字、长度必须在0至20之间</br>" +
                            "第一阶梯价格不能为空、必须为有效的金额、长度必须在0至20之间"
            );
            return;
        }

        var formdata = $('#save_big_cust_form').serializeObject();
        var createTimeFormat = GasModBil.date_format(new Date(),'yyyy-MM-ddThh:mm:ss');
        var user = JSON.parse(localStorage.getItem("user_info"));

        formdata.createdBy = user.userId;
        formdata.createTime = createTimeFormat;
        formdata.modifiedBy = user.userId;
        formdata.modifiedTime = createTimeFormat;

        var jsondata = JSON.stringify(formdata);

        $.ajax({
            type: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url:  hzq_rest+ 'gasbllnonrsdtdct',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            isMask: true,
            data: jsondata,
            success: function(data) {
                if(data.success == true){
                    bootbox.alert("保存成功！",function () {
                        setTimeout(function () {
                            window.location.reload();
                        },200)
                    });
                }
            },
            error: function(err) {
                bool = new Object();
                bool["success"] = false;
                bool["description"]  = err.statusText ? err.statusText : "不明错误原因..";
                console.log("error:"+JSON.stringify(err))
                if( err.status==406){
                    //need to login
                    if(window.location.pathname.indexOf('/login.html')<0)
                    {
                        window.location.replace("/login.html?redirect="+window.location.pathname);
                    }

                }

            }
        });
    });
    
    function renewed(row) {
        nonRsdtDctId = row['nonRsdtDctId'];

        var treatyEndTimeStr = row['treatyEndTime'];
        var treatyEndTime = new Date(treatyEndTimeStr);
        var now = new Date();

        if(treatyEndTime.getTime() > now.getTime()){
            bootbox.alert('大客户协议时间未结束，请等待协议结束再进行续签...');
        }else{
            $('#renew').modal('toggle',{'backdrop':'static'});
            $('#save_renew_form input').each(function (index) {
                if('discountType' != $(this).attr('name')) {
                    if (row.hasOwnProperty($(this).attr('name'))) {
                        $(this).val(row[$(this).attr('name')]);
                    }
                }else{
                    $('#renew_discountType').val(row['discountType']);
                }
            });

            //续签：大客户名称readonly
            $('#save_renew_form input[name=customerName]').attr('readOnly','true');

            //时间类型字段格式化
            if(row['treatyStartTime']){
                $('input[name=treatyStartTime]').val(GasModBil.dateFormat.f(row['treatyStartTime'].split(' ')[0]));
            }
            if(row['treatyEndTime']) {
                $('input[name=treatyEndTime]').val(GasModBil.dateFormat.f(row['treatyEndTime']));
            }

            // $('#renew').show();
        }
    }

    $('#save_renew_button').click('on',function () {
        if(validateCustom("#save_renew_form")==1){
            $('.Metronic-alerts').remove();
            bootbox.alert("输入数据需符合以下条件：</br>" +
                "大客户电话不能为空、必须是数字、长度必须在0至12之间</br>" +
                "优惠类型不能为空" +
                "年最低用气量必须是数字、长度必须在0至15之间</br>" +
                "第一阶梯起始量不能为空、必须是数字、长度必须在0至20之间</br>" +
                "第一阶梯结束量不能为空、必须是数字、长度必须在0至20之间</br>" +
                "第一阶梯价格不能为空、必须为有效的金额、长度必须在0至20之间"
            );
            return;
        }

        var formdata = $('#save_renew_form').serializeObject();
        var createTimeFormat = GasModBil.date_format(new Date(),'yyyy-MM-ddThh:mm:ss');
        var user = JSON.parse(localStorage.getItem("user_info"));

        formdata.modifiedBy = user.userId;
        formdata.modifiedTime = createTimeFormat;

        var jsondata = JSON.stringify(formdata);

        $.ajax({
            type: 'PUT',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url:  hzq_rest+ 'gasbllnonrsdtdct',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            isMask: true,
            data: jsondata,
            success: function(data) {
                if(data.success == true){
                    //更新旧的大客户协议状态为：停用
                    // var result = Restful.updateRNQ(hzq_rest+ 'gasbllnonrsdtdct',nonRsdtDctId,{status:'2'})
                    bootbox.alert("保存成功！",function () {
                        setTimeout(function () {
                            window.location.reload();
                        },200)

                    });
                }
            },
            error: function(err) {
                bool = new Object();
                bool["success"] = false;
                bool["description"]  = err.statusText ? err.statusText : "不明错误原因..";
                console.log("error:"+JSON.stringify(err))
                if( err.status==406){
                    //need to login
                    if(window.location.pathname.indexOf('/login.html')<0)
                    {
                        window.location.replace("/login.html?redirect="+window.location.pathname);
                    }

                }

            }
        });
    })