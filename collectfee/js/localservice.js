var localService = {
    callPrint: function (data, cb) {
        var callParam = {
            "cmdheader": {
                "cmdtype": "17"
            },
            "param": {
                "data": [data]
            }
        };
        localService.callFunction(callParam, cb);
    },
    callReadCard: function (data, cb) {
        var callParam = {
            "cmdheader": {
                "cmdtype": "1"
            },
            "param": data
        };
        if (data.cardfactory) {
            callParam.cmdheader.cardfactory = data.cardfactory;
        }
        localService.callFunction(callParam, cb);
    },
    callWriteCard: function (cardtype, cardfactory, data, cb) {
        var callParam = {
            "cmdheader": {
                "cardtype": cardtype,
                "cardfactory": cardfactory,
                "cmdtype": "5"
            },
            "param": data
        };
        localService.callFunction(callParam, cb);
    },
    callGasReset:function (cardfactory, data, cb) {
        var callParam = {
            "cmdheader":{
                "cmdtype":"9",
                "cardfactory":cardfactory
            },
            "param":data

        };
        localService.callFunction(callParam, cb);
    },

    callOpenCard: function (cardtype, cardfactory, data, cb) {
        var callParam = {
            "cmdheader": {
                "cardtype": cardtype,
                "cardfactory": cardfactory,
                "cmdtype": "3"
            },
            "param": data
        };
        localService.callFunction(callParam, cb);
    },
    callFunction: function (data, cb) {
        try {
            $.ajax({
                type: "GET",
                url: "http://127.0.0.1:9000/",
                dataType: "JSONP",
                data: "data=" + JSON.stringify(data),
                jsonp: "callfuncname",
                timeout: 30000,
                success: function (retData, textStatus, xhr) {
                    var isSuccess = false;
                    if (retData.result.resultcode == "0") {
                        isSuccess = true;
                    }
                    if (typeof (cb) === "function") {
                        cb(retData, isSuccess);
                    }
                },
                error: function (jqXHR, textStatus) {
                    var err = { "jqXHR": jqXHR, "textStatus": textStatus };
                    bootbox.alert("无法完成请求的操作，无法连接本地服务！", function () {
                        cb(err, false);
                    });
                }
            });
        } catch (exception) {
            bootbox.alert(exception, function () {
                cb(err, false);
            });
        }
    }
};