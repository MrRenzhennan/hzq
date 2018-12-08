var IndexEnum = function() {

	var enumStepStatus = {"0":"初始化","1":"节点等待","2":"已获取","3":"挂起初始化","4":"停止","5":"完成","6":"错误","7":"已提交","8":"流程结束","9":"无效","A":"提交失败"};
    var  enumBusiType = {"LSKS":"零散开栓","LSKSYL":"零散开栓有令","SPECIALA":"特殊用户申请",
                         "CHANGEGT":"用户用气性质变更","CHANGEJP":"家庭人口数变更","ZJVOLUME":"增减容","STOPUSEG":"暂停用气",
                         "REUSEG":"重新用气","CHANGEMT":"用户换表（民用非居民）","CHANGEMTSF":"用户换表（商服）","R_PLKX":"居民开栓令申请","NR_PLKX":"非居民开栓令申请",
                         "VIPCUSTOMERA":"大客户申请","ADJUSTP":"定针","REMOVEM":"拆除","CHSQ":"串户申请","FJMHT":"非居民合同","CHGTYPEERRORAPPLY01":"收费方式变更未日结",
                          "CHGTYPEERRORAPPLY02":"收费方式变更已日结", "BLLCORRECTA":"计费更正","BLLCORRECTA2":"计费更正(垃圾费)","CHGMONEYERRORAPPLY01":"收费金额变更申请差错金额小于100",
                          "CHGMONEYERRORAPPLY02":"收费金额变更申请差错金额小于10000","CHGMONEYERRORAPPLY03":"收费金额变更申请差错金额大于10000","TKSQ":"退款申请",
                          "CBJHBG":"抄表计划变更","XYQL":"协议气量","BJCRK":"表具出入库","CHGMONEYERRORAPPLY04":"收费金额变更申请差错金额小于500(居民)",
                          "CQBYQJMSQ":"居民长期不用气申请","CQBYQFJMSQ":"非居民长期不用气申请","ICCOMPLEMENTAPPLY":"补气补量申请","HBGDSP":"换表工单审批","MTGSQ":"煤改气用户登记申请",
    						"JBJH":"非居民检表计划","JBJHC":"非居民检表计划变更","JMHFYQSQ":"居民恢复用气申请","FJMHFYQSQ":"非居民恢复用气申请","METERMOVE":"移库申请","METERONLINE":"下线表重新上线申请"};
    var enumAgreeStatus = {"0":"同意","1":"拒绝"};

    return {

        stepStatusFormat: {
            f: function(val){
                return enumStepStatus[val];
            },
        },

        busiTypeFormat:{
            f: function(val){
                return enumBusiType[val];
            },
        },
        enumBusiTypeInit:{
            f: function(val){
                return enumBusiType;
            },
        },
        agreeStatusFormat:{
            f: function(val){
                return enumAgreeStatus[val];
            },
        },
        init: function(xwajson) {
			

        }
    }
}();