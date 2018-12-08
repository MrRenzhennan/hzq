var GasModCsr = function() {

    enumstepStatus = {"0":"初始化","1":"节点等待获取","2":"节点已获取","3":"节点挂起","4":"节点停止","5":"节点结束","6":"节点异常","7":"节点已提交","9":"无效"};
    enumflowStatus = {'0':'初始化','1':'流程开始中','2':'流程执行中','3':'流程挂起','4':'流程停止','5':'节点结束','6':'流程错误','8':'流程结束','9':'无效'};
    var changeMeterReason =
    {
        "0": "故障",
        "1": "维修",
        "2": "检表",
        "3": "改造",
        "4": "慢表",
        "5": "表堵",
        "6": "漏气",
        "7": "变向",
        "8": "变容",
        "9": "改型",
        "10": "死表",
        "11": "快表",
        "12": "窃气",
        "13": "A级表",
        "14": "超期表",
        "15": "开栓换表",
        "16": "其他"
    };
    return {
        emunStepStatus:enumstepStatus,
        enumFlowStatus:enumflowStatus,
        stepStatusFormat:{
            f: function(val){
                return enumstepStatus[val];
            },
        },
        flowStatusFormat:{
            f:function(val){
                return enumflowStatus[val];
            },
        },
        changeMeterFormat: {
            f: function (val) {
                return changeMeterReason[val];
            }
        }
    }

}();
