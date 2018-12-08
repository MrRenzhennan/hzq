var dateFormat = function () {
    return {
        f: function (val) {
            if (val) {
                var date = val.substring(0, 10);
                return date;
            }

        }
    }
}();
var dateFat = function () {
    return {
        f: function (val) {
            if (val) {
                var data = val.split("T");
                var aa = [];
                for (var i = 0; i < data[1].split(":").length; i++) {
                    if (i < 2) {
                        aa.push(data[1].split(":")[i])
                    }
                }
                data[1] = aa.join(":");
                date = data.join(" ");
                return date;
            }

        }
    }
}();
var isDir = function (val) {
    if (val == "2") {
        return "<select id='isDir' name='isDir' class='form-control select2me'>" +
            "<option value='2' selected>是</option>" +
            "<option value='1' >否</option></select>";
    } else if (val == "1") {
        return "<select id='isDir' name='isDir' class='form-control select2me'>" +
            "<option value='2' >是</option>" +
            "<option value='1' selected>否</option></select>";
    } else {
        return "<select id='isDir' name='isDir' class='form-control select2me'>" +
            "<option value='2' >是</option>" +
            "<option value='1' >否</option></select>";
    }
};
var funcLevel = function (val) {
    if (val == "1") {
        return "<select id='funcLevel' name='funcLevel' class='form-control select2me'>" +
            "<option value='1' selected>一级库</option>" +
            "<option value='2' >二级库</option></select>";
    } else if (val == "2") {
        return "<select id='funcLevel' name='funcLevel' class='form-control select2me'>" +
            "<option value='1' >一级库</option>" +
            "<option value='2' selected>二级库</option></select>";
    } else {
        return "<select id='funcLevel' name='funcLevel' class='form-control select2me'>" +
            "<option value='1' >一级库</option>" +
            "<option value='2' >二级库</option></select>";
    }
};
var lockFlagBuilder = function (val) {
    if (val == "1") {
        return "<select id='lockFlag' name='lockFlag' class='form-control select2me'>" +
            "<option value='1' selected>未锁定</option>" +
            "<option value='0' >锁定</option></select>";
    } else if (val == "0") {
        return "<select id='lockFlag' name='lockFlag' class='form-control select2me'>" +
            "<option value='1' >未锁定</option>" +
            "<option value='0' selected>锁定</option></select>";
    } else {
        return "<select id='lockFlag' name='lockFlag' class='form-control select2me'>" +
            "<option value='1' >未锁定</option>" +
            "<option value='0' >锁定</option></select>";
    }
};

var meterIcTypeBuilder = function (val) {
    if (val == "1") {
        return "<select id='meterIcType' name='meterIcType' class='form-control select2me'>" +
            "<option value='' >无</option>" +
            "<option value='1' selected>102卡气量卡</option>" +
            "<option value='2' >102卡金额卡</option>" +
            "<option value='3' >4442卡气量卡</option>" +
            "<option value='4' >4442卡金额卡</option></select>";
    } else if (val == "2") {
        return "<select id='meterIcType' name='meterIcType' class='form-control select2me'>" +
            "<option value='' >无</option>" +
            "<option value='1' >102卡气量卡</option>" +
            "<option value='2' selected>102卡金额卡</option>" +
            "<option value='3' >4442卡气量卡</option>" +
            "<option value='4' >4442卡金额卡</option></select>";
    } else if (val == "3") {
        return "<select id='meterIcType' name='meterIcType' class='form-control select2me'>" +
            "<option value='' >无</option>" +
            "<option value='1' >102卡气量卡</option>" +
            "<option value='2' >102卡金额卡</option>" +
            "<option value='3' selected>4442卡气量卡</option>" +
            "<option value='4' >4442卡金额卡</option></select>";
    }
    else if (val == "4") {
        return "<select id='meterIcType' name='meterIcType' class='form-control select2me'>" +
            "<option value='' >无</option>" +
            "<option value='1' >102卡气量卡</option>" +
            "<option value='2' >102卡金额卡</option>" +
            "<option value='3' >4442卡气量卡</option>" +
            "<option value='4' selected>4442卡金额卡</option></select>";
    }
    else {
        return "<select id='meterIcType' name='meterIcType' class='form-control select2me'>" +
            "<option value='' selected>无</option>" +
            "<option value='1' >102卡气量卡</option>" +
            "<option value='2' >102卡金额卡</option>" +
            "<option value='3' >4442卡气量卡</option>" +
            "<option value='4' >4442卡金额卡</option></select>";
    }
};
var customCodeInput = function (val, row) {
    console.log("customCodeInput::row=" + row)
    if (row) {
        var display = ""
        $.ajax({
            url: Utils.queryURL(hzq_rest + "gasctmmeter") + 'query={"ctmArchiveId":"' + row.ctmArchiveId + '"}&fields={"reviseMeterState":1}',
            dataType: 'json',
            async: false,
        }).done(function (data, retcode) {
            if (data.length > 0) {
                display = GasModCtm.chargeMeterRevise[data[0].reviseMeterState]
                if (!display) {
                    display = data[0].reviseMeterState
                }
            }
        });

        return display;

    } else {
        return ""
    }
};


var GasModCtm = function () {
    var enumCustomerKind = {"1": '居民', "9": '非居民'};
    var enumCustomerState = {"00": "未开栓", "01": "正常", "02": "暂停用气", "03": "拆除状态", "04": "长期不用", "99": "删除"};
    var enumCustomerType = {'P': '普表', 'I': 'IC卡表'};
    var projectType = {"1": "工业", "2": "商服", "3": "公益", "4": "锅炉", "5": "福利", "6": "民用"};
    var projectStatus = {"1": "未审核", "2": "审核中", "3": "未通过", "4": "已通过"};
    // var contractStatus = {"0": "新起草", "1": "已审批", "2": "已生效", "3": "已过期", "4": "已作废", "5": "续签","6":"未通过","7":"即将到期"};
    var contractStatus = {
        "0": "预签",
        "1": "新签",
        "2": "正常",
        "3": "即将到期",
        "4": "到期",
        "5": "过期",
        "6": "续签",
        "7": "作废",
        "8": "增减容",
        "9": "未通过"
    };
    var idcardType = {"1": "营业执照", "2": "法人身份证", "3": "房产证", "4": "租房合同", "5": "居民身份证"};
    //行业分类
    var industrySort = {
        "01": "政府机关", "02": "金融", "03": "信息服务", "04": "进出口贸易", "05": "军事国防", "06": "出版印刷",
        "07": "科研", "08": "制造业", "09": "医药卫生", "10": "石油化工能源", "11": "教育", "12": "旅游", "13": "广播电视",
        "14": "建筑", "15": "邮政", "16": "电信", "17": "工商", "18": "税务", "19": "交通", "20": "会计类", "21": "公检法",
        "22": "零售服务", "23": "餐饮", "24": "住宿", "25": "洗浴", "26": "小吃", "27": "公用事业", "28": "批发销售",
        "29": "事业单位"
    };
    var lockFlag = {"0": "锁定", "1": "未锁定"};
    var isDir = {"1": "否", "2": "是"};
    var funcLevel = {"1": "一级库", "2": "二级库"};
    var stockState = {"0": "未登记", "1": "在库", "2": "冻结", "3": "在途", "4": "上线", "5": "下线", "6": "报废","7":"借出中"};
    var aoolyState = {"1": "审核中", "2": "审核通过", "3": "审核不通过"};
    var meterDirection = {"L": "左", "R": "右"};
    var meterMaterial = {"1": "铁", "2": "铝","3":"钢"};
    var baseMeterVender = {"1": "金卡", "2": "松川", "3": "蓝宝石"};
    var displayType = {"1": "机械", "2": "电子", "3": "机械+电子"};
    var controlType = {"1": "远传阀控", "2": "远传IC卡", "3": "物联网表", "4": "IC卡气量", "5": "IC卡金额"};
    var chipType = {"1": "102卡 气量卡", "2": "102卡 金额卡", "3": "4442卡 气量卡", "4": "4442卡 金额卡","5":"cpu卡"};
    var valveInfo = {"1": "正常", "2": "异常"};
    var powerType = {"1": "干电池", "2": "锂电池"};
    var meterUserState = {"01": "正常", "02": "暂停用气", "03": "拆除状态", "00": "新用户", "99": "删除"};
    var reviseMeterState = {"01": "正常", "06": "未校正", "07": "二次表损坏", "09": "没有二次表"};
    var meterKind = {"01": "普通表", "02": "IC卡气量表", "03": "IC卡金额表", "04": "代码表", "05": "远传表"};
    var batchState = {"1": "已分派", "2": "已派工", "5": "已生成", "8": "已打印", "9": "已作废"};
    var chargeMeterRevise = {"01":"修正表正常，二次表计费","06":"修正表未校验，二次表计费","07":"修正表损坏，一次表计费","09":"没有修正表，一次表计费"};
    return {
        enumCustomerKind: enumCustomerKind,
        enumCustomerState: enumCustomerState,
        enumCustomerType: enumCustomerType,

        enumMeterUserState: meterUserState,
        enumReviseMeterState: reviseMeterState,
        enumChargeMeterRevise: chargeMeterRevise,

        industrySortFormat: {
            f: function (val) {
                return industrySort[val];
            }
        },
        customerKindFormat: {
            f: function (val) {
                return enumCustomerKind[val];
            }
        },
        customerIDCardTypeFormat: {
            f: function (val) {
                // if (idcardType[val.trim()])
                return idcardType[val];
                // else return val;
            }
        },
        customerStateFormat: {
            f: function (val) {
                return enumCustomerState[val];
            }
        },
        projectTypeFormat: {
            f: function (val) {
                return projectType[val];
            }
        },
        projectStatusFormat: {
            f: function (val) {
                return projectStatus[val];
            }
        },
        contractStatusFormat: {
            f: function (val) {
                return contractStatus[val];
            }
        },
        customerTypeFormat: {
            f: function (val) {
                return enumCustomerType[val];
            }
        },
        lockFlagFormat: {
            f: function (val) {
                return lockFlag[val];
            }
        },
        isDirFormat: {
            f: function (val) {
                return isDir[val];
            }
        },
        funcLevelFormat: {
            f: function (val) {
                return funcLevel[val];
            }
        },
        stockStateFormat: {
            f: function (val) {
                return stockState[val];
            }
        },
        applyStateFormat: {
            f: function (val) {
                return aoolyState[val];
            }
        },
        meterDirectionFormat: {
            f: function (val) {
                return meterDirection[val];
            }
        },
        meterMaterialFormat: {
            f: function (val) {
                return meterMaterial[val];
            }
        },
        baseMeterVenderFormat: {
            f: function (val) {
                return baseMeterVender[val];
            }
        },
        displayTypeFormat: {
            f: function (val) {
                return displayType[val];
            }
        },
        controlTypeFormat: {
            f: function (val) {
                return controlType[val];
            }
        },
        chipTypeFormat: {
            f: function (val) {
                return chipType[val];
            }
        },
        valveInfoFormat: {
            f: function (val) {
                return valveInfo[val];
            }
        },
        powerTypeFormat: {
            f: function (val) {
                return powerType[val];
            }
        },
        meterKindFormat: {
            f: function (val) {
                return meterKind[val];
            }
        },
        batchStateFormat: {
            f: function (val) {
                return batchState[val];
            }
        },
        customerCodeByArchidFormat: {
            f: function (val, row, cell, key) {
                var v = RefHelper.getRef({
                    ref_url: "gasctmarchive",
                    ref_col: "ctmArchiveId",
                    ref_display: "customerCode",
                    ref_id: val,
                    ref_div: cell,
                    dataformat: "{1}"
                });
                if (v)return v;
                return "--";
            }
        },
        meterUserNameByArchidFormat: {
            f: function (val, row, cell, key) {
                //console.log("meterUserNameByArchidFormat::"+JSON.stringify(row))
                var v = RefHelper.getRef({
                    ref_url: 'gasctmmeter?query={"meterId":"' + row.meterId + '"}&',
                    ref_display: "meterUserName",
                    ref_div: cell,
                    dataformat: "{1}"
                });
                if (v)return v;
                return "--";
            }
        },
        customerTypeByArhcidFormat: {
            f: function (val, row, cell) {
                if (val == 'P') return "普表"
                if (val == 'I') return "IC卡表"
                return dis;
            }
        },
        meterUserAddressByArchidFormat: {
            f: function (val, row, cell, key) {
                //console.log("meterUserNameByArchidFormat::"+JSON.stringify(row))
                var v = RefHelper.getRef({
                    ref_url: 'gasctmarchive?query={"ctmArchiveId":"' + row.ctmArchiveId + '"}&',
                    ref_display: "customerAddress",
                    ref_div: cell,
                    dataformat: "{1}"
                });
                if (v)return v;
                return "--";
            }
        },
        vbVbtByFormat: {
            f: function (val, row, cell, key) {
               /* console.log("vbVbtByFormat::" + cell)
                var v = RefHelper.getRef({
                    ref_url: 'gasctmmeter?query={"ctmArchiveId":"' + row.ctmArchiveId + '"}&',
                    ref_display: "vbVbt",
                    ref_div: cell
                });
                if (v) return v;
                return "--";*/
               console.log("reviseMeterStateFormat::"+cell)
	        	var display='--';
	        	$.ajax({
	                url: Utils.queryURL(hzq_rest+ "gasctmmeter")+'query={"ctmArchiveId":"'+row.ctmArchiveId+'"}&fields={"reviseMeterState":1}',
	                dataType: 'json',
	                async: false,
	            }).done(function(data,retcode) {
	                if(data.length>0)
	                {
	                    display=GasModCtm.enumReviseMeterState[data[0].vbVbt]
	                }
	                
	            });
	            return display;
            }
        },
        reviseMeterStateFormat:{
        	f:function(val,row,cell,key){
        		console.log("reviseMeterStateFormat::"+cell)
	        	var display='--';
	        	$.ajax({
	                url: Utils.queryURL(hzq_rest+ "gasctmmeter")+'query={"ctmArchiveId":"'+row.ctmArchiveId+'"}&fields={"reviseMeterState":1}',
	                dataType: 'json',
	                async: false,
	            }).done(function(data,retcode) {
	                if(data.length>0)
	                {
	                    display=GasModCtm.enumReviseMeterState[data[0].reviseMeterState]
	                    if(!display){
	                        display=data[0].reviseMeterState
	                    }
	                }
	                
	            });
	            return display;
        	}
        },
        insuranceCompanyList:function(jsOpts){//所有保险公司的编号+名称
        		var sql1 = {
				"cols":"company_code,insurance_company_id,company_name",
				"froms":"gas_ctm_insurance_company",
				"wheres":" status ='1' ",
				"page":"false"
			};
			$.ajax({
				type:"POST",
				url:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00",
				async:false,
				dataType:'json',
				contentType:"application/json; charset=utf-8",
				data:JSON.stringify(sql1),
			}).done(function(data,retcode){
				if(data && data.rows){
					jsOpts['cb'](data.rows);	
				}
			})
        },
        insuranceCompanyFormat:{//根据保险公司id，获取保险公司名称
        		f:function(val,row,cell,key){
        			console.log(row.insuranceCompanyId);
        			var v ="--";
        			if(row && row.insuranceCompanyId){
        				v = RefHelper.getRef({
                    ref_url: 'gasctminsurancecompany?query={"insuranceCompanyId":"' + row.insuranceCompanyId + '"}&',
                    ref_display: "companyName",
                    ref_div: cell,
                    //dataformat: "{1}"
//                  dataformat:
				});
        			}
                if (v)return v;
                return "--";
        		}
        },
        
        
        init: function (xwajson) {

        }
    }
}();