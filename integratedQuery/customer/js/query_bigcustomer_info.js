function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return undefined;
}

var gasBllNonrsdtDctId = getQueryString("nonRsdtDctId");
var nonRsdtDctId = Metronic.getURLParameter("nonRsdtDctId");

var DisCusRegisterInfo = function () {
    var xw ;
    function getNonrsdtDctArchiveId() {
        var queryCondion = RQLBuilder.and([
            RQLBuilder.equal("status","1"), //1启用
            RQLBuilder.equal("nonRsdtDctId",gasBllNonrsdtDctId)
        ]).rql()

        var queryUrl =  hzq_rest + 'gasbllnonrsdtdctctm?fields={"ctmArchiveId":"1"}&query='+ queryCondion;
        var NonrsdtDctArchiveId  =Restful.findNQ(queryUrl);

        var ctmarchiveid = [];
        for(var i=0;i<NonrsdtDctArchiveId.length;i++){
            ctmarchiveid.push('"'+NonrsdtDctArchiveId[i].ctmArchiveId + '"');
        }
        return ctmarchiveid;
    };



    // 供气区域helper
    var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });

    // 用气性质helper
    var gasTypeHelper=RefHelper.create({
        ref_url:"gasbizgastype",
        ref_col:"gasTypeId",
        ref_display:"gasTypeName",
    });


    var areaFormat=function(){
        return {
            f: function(val){
                return areaHelper.getDisplay(val)==0 ? "" : areaHelper.getDisplay(val);
            },
        }
    }();
    var gasTypeFormat=function(){
        return {
            f: function(val){
                return gasTypeHelper.getDisplay(val)==0 ? "" : gasTypeHelper.getDisplay(val);
            },
        }
    }();


    return {

        init: function () {
            // this.initNonrsdtDct();
            this.initArchive();
            this.findFilter();
        },
        // initNonrsdtDct: function () {
        //     var queryUrl =  hzq_rest + 'gasbllnonrsdtdct/'+ gasBllNonrsdtDctId;
        //     var NonrsdtDctArchive  =Restful.findNQ(queryUrl);
        //     if(NonrsdtDctArchive){
        //         dust.loadSource(dust.compile($("#__dust__nonrsdt_dct").html(), "nonrsdt_dct__"));
        //         dust.render("nonrsdt_dct__", { "data": NonrsdtDctArchive}, function (err, out) {
        //             $("#nonrsdt_dct_table").html(out);
        //         });
        //     }
        // },

        findFilter: function () {
            $(function () {
                $.ajax(
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type: 'get',
                        url: hzq_rest + 'gasbllnonrsdtdct/' + nonRsdtDctId,
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            console.log(data);
                            var json = eval(data);
                            $("#customer_name").html(json.customerName);
                            $("#customer_tel").html(json.customerTel);
                            $("#customer_address").html(json.customerAddress);
                            $("#belong_to").html(json.belongTo);
                            $("#discount_type").html(GasModBil.DiscountType.f(json.discountType));
                            $("#treaty_start_time").html(GasModBil.dateFormat.f(json.treatyStartTime));
                            $("#treaty_end_time").html(GasModBil.dateFormat.f(json.treatyEndTime));
                            $("#measure_price").html(GasModBil.measure_price(json));
                            $('#bid').val(json.reservedField1);
                            if(json.reservedField1){
                                pic(json.reservedField1);
                            }else {
                                $(".grid").append("<center><h4><span>无附件!!!</span></h4></center>");
                            }
                        },
                        error: function(err) {
                            //console.log("error:"+JSON.stringify(err))
                            if( err.status==401){
                                //need to login
                                if(window.location.pathname.indexOf('/login.html')<0)
                                {
                                    window.location.replace("/login.html?redirect="+window.location.pathname);
                                }

                            }

                        }
                    }
                )
            });
        },
        initArchive:function () {
            var  ctmarchiveid =getNonrsdtDctArchiveId(gasBllNonrsdtDctId);
            var baseUrl = RQLBuilder.and([
                // RQLBuilder.equal("status","1"),
                RQLBuilder.condition_fc("ctmArchiveId","$in","["+ctmarchiveid.join()+"]")
            ]).rql()
            xw = XWATable.init({
                divname: "divtable1",
                //----------------table的选项-------
                pageSize: 10,
                columnPicker: true,
                transition: 'fade',
                checkAllToggle: true,
                //----------------基本restful地址---
                restbase: 'gasctmarchive?query='+ baseUrl,
                key_column: 'ctmArchiveId',
                coldefs:[
                    {
                        col:"ctmArchiveId",
                        friendly:"客户id",
                        hidden:true,
                        readonly:"readonly",
                        nonedit: "noeidt",
                        index:1
                    },
                    {
                        col:"customerCode",
                        friendly:"客户编号",
                        sorting:false,
                        index:2
                    },
                    {
                        col:"customerName",
                        friendly:"客户名称",
                        sorting:false,
                        index:3
                    },
                    {
                        col:"customerKind",
                        friendly:"客户类型",
                        format:GasModBil.CustomerKind,
                        sorting:false,
                        index:3
                    },
                    {
                        col:"customerAddress",
                        friendly:"客户地址",
                        sorting:false,
                        index:4
                    },
                    {
                        col:"gasTypeId",
                        friendly:"用气类型",
                        format:gasTypeFormat,
                        sorting:false,
                        index:4
                    },
                    {
                        col:"bookId",
                        friendly:"抄表本",
                        sorting:false,
                        index:4
                    },
                    {
                        col:"areaId",
                        friendly:"供气区域",
                        format:areaFormat,
                        sorting:false,
                        index:4
                    },
                    {
                        col:"customerState",
                        friendly:"客户状态",
                        format:function(){
                            return{
                                f:function(val){
                                    var customerState = { "00": "未开栓", "01": "正常", "02": "暂停用气", "03": "拆除状态",  "04": "长期不用气", "99": "删除" };
                                    return customerState[val]
                                }
                            }
                        }(),
                        sorting:false,
                        index:5
                    }
                ],
                findFilter:function () {
                    console.log("==============");
                }
            })
        }

    }
}();
