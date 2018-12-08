var DisCusApply = function () {
    var xw ;
    // 用气性质helper
    var gasTypeHelper=RefHelper.create({
        ref_url:"gasbizgastype",
        ref_col:"gasTypeId",
        ref_display:"gasTypeName"
    });
    var gasTypeFormat = function () {
        return {
            f : function (val) {
                return  gasTypeHelper.getDisplay(val);
            }
        }
    }();

    var detailedInfoFormat =function () {
        return {
            f : function (val) {
                return '<a id="todetail" href="charging/resident_dis_approval.html?' + val + '">明细</a>';
            }
        }
    }();
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
            this.initAction();
            
        },

        initHelper:function(){
            // 用气性质 select init
            $.map(gasTypeHelper.getData(), function(value, key) {
                if(!key.startsWith(2))
                    $('#gastype').append('<option value="'+key+'">'+value+'</option>');
            });
        },

        insertArchive4Rsdt: function (rsdtDctCtm){
            bootbox.confirm("确定添加吗?", function(result) {
                if(result===false){

                }else {
                    var queryUrl =  hzq_rest + 'gasbllrsdtdctctm';
                    var ret = Restful.insert(queryUrl,JSON.stringify(rsdtDctCtm));
                    if(ret===false){
                        bootbox.alert("更新失败...")
                    }else{
                        bootbox.alert("更新成功...", function () {
                            window.location.reload();
                        })
                    }
                }
            });
        },



        reload:function(){

            $('#divtable').html('');

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
                    restbase: 'gasbllrsdtdct',
                    key_column:'rsdtDctId',
                    coldefs:[

                        // {
                        //     col:"",
                        //     friendly:"居民优惠ID",
                        //     unique:"true",
                        //     hidden:true,
                        //     readonly:"readonly",
                        //     nonedit:"nosend",
                        //     index:1
                        // },
                        {
                            col:"gasTypeId",
                            friendly:"用气性质",
                            format:gasTypeFormat,
                            inputsource: "select",
                            ref_url:  "gasbizgastype",
                            ref_name: "gasTypeName",
                            ref_value: "gasTypeId",
                            index:1
                        },
                        {
                            col:"persons",
                            friendly:"家庭人口数",
                            index:2
                        },
                        {
                            col:"discount",
                            friendly:"优惠气量",
                            index:3
                        },
                        {
                            col:"createdTime",
                            friendly:"添加时间",
                            format:GasModBil.dateFormat,
                            nonedit: "noeidt",
                            // // format:dateFormat,
                            //inputsource:"datetimepicker",
                            // date_format:"yyyy-mm-dd hh:ii:ssZ",
                            readonly:"readonly",
                            index:4
                        },
                        {
                            col:"createdBy",
                            friendly:"操作人员",
                            index:6
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            unique:"true",
                            //format:detailedInfoFormat,
                            index:7
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            format:GasModBil.dateFormat,
                            nonedit: "noeidt",
                            //  format:detailedInfoFormat,
                            index:8
                        }
                    ],

                    // 查询过滤条件
                    findFilter: function(){

                    }
                }) //--init
        },
        
        initAction:function () {
            $("#find_button_2").on("click", function(){
                $('#divtable').css("display","block");
                var queryUrl=hzq_rest+"gasbllrsdtdct";
                var querys=new Array()
                if ($('#gastype').val()) {
                    querys.push(RQLBuilder.like("gasTypeId", $('#gastype').val()));
                }
                if ($('#find_persons').val()) {
                    querys.push(RQLBuilder.like("persons", $('#find_persons').val()));
                }

                if(querys.length>0){
                    queryUrl += "?query="+RQLBuilder.and(querys).rql();
                }

                xw.setRestURL(queryUrl);
                xw.update();
            });



            $("#submit_btn").on('click',function(){
                var data = xw.getTable().getData(true);
                console.log(data.rows.length)
                if(data.rows.length == 0){
                    bootbox.alert("<br><center><h4>请选择需要添加的大客户合同！</h4></center><br>");
                }
                if(data.rows.length>1){
                    bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
                    return false;
                }

                var ctmArchiveId =data.rows[0].ctmArchiveId;
                console.log(data.rows[0].ctmArchiveId);
                var status =[];
                status.push("1");
                var isTure = isExistInNonrsdtDct(ctmArchiveId,status);
                if(isTure==1){
                    bootbox.alert("<br><center><h4>该用户已经存在！</h4></center><br>");
                    return false;
                }

                var parameter = {
                    "status":"1",
                    "ctmArchiveId":ctmArchiveId,
                    "nonRsdtDctId":gasBllNonrsdtDctId,
                    "createdBy":"admin"
                };
                insertNonrsdtDct(parameter);
                console.log(JSON.stringify(parameter));

            });
            
        }




    }
}();

