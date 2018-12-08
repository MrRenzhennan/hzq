var errorApplyHelper = {
    getChgGasInfo: function (chgDetailID, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "b.customerCode,b.customerName,a.chgTypeId,a.money,a.gasfeeAtlId,a.createdTime,a.customerKind",
                froms: "gasActGasfeeAtl a,gasChgGasDetail b",
                wheres: "b.tradeId=a.gasfeeAtlId and b.detailId ='" + chgDetailID + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                } else {
                }
            },
            error: function () {
                //alert("无访问权限");
            }
        });
    },
    getChgWasteInfo: function (chgDetailID, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "b.customerCode,b.customerName,a.chgTypeId,a.money,a.wastefeeAtlId,a.createdTime,a.customerKind",
                froms: "gasActWastefeeAtl a,gasChgWasteDetail b",
                wheres: "b.tradeId=a.wastefeeAtlId and b.detailId ='" + chgDetailID + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                } else {
                }
            },
            error: function () {
                //alert("无访问权限");
            }
        });
    },
    getSettlementInfo: function (atlId, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                cols: "a.*",
                froms: "gasChgSettlementDetail a",
                wheres: "a.tradeAtlId ='" + atlId + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                } else {
                }
            },
            error: function () {
                //alert("无访问权限");
            }
        });
    },
    getChgError: function (errId, cb) {
        $.ajax({
            url: "hzq_rest/gaschgerror/" + errId,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (data) {
                    if (typeof (cb) === 'function') {
                        cb(data);
                    }
                } else {
                }
            },
            error: function () {
                //alert("无访问权限");
            }
        });
    },
    chgErrorApprove: function (errId, result, cb) {
        $.ajax({
            url: "hzqs/chg/pbeca?fn=ECACHG0000000J00&resp=bd" + errId,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                "errorId": errId,
                "result": result
            }),
            success: function (data) {
                if (data) {
                    if (typeof (cb) === 'function') {
                        cb(data);
                    }
                } else {
                    cb(undefined);
                }
            },
            error: function () {
                cb(undefined);
            }
        });
    },
    getChgErrorByChgDetailId: function (detailId, cb) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            async: false,
            data: JSON.stringify({
                cols: "a.*",
                froms: "gasChgError a",
                wheres: "a.chgDetailId ='" + detailId + "'",
                page: "false",
                limit: 1
            }),
            dataType: "json",
            success: function (data) {
                if (data && data.rows && data.rows.length > 0) {
                    if (typeof (cb) === 'function') {
                        cb(data.rows[0]);
                    }
                } else {
                    if (typeof (cb) === 'function') {
                        cb(undefined);
                    }
                }
            },
            error: function () {
                //alert("无访问权限");
            }
        });
    },
    getQueryStringValue: function (keyName) {
        var searchStr = location.search.substr(1);
        if (searchStr.length == 0)
            return null;
        var collection = searchStr.split('&');
        for (var i = 0; i < collection.length; i++) {
            var tmp = collection[i].split('=');
            if (tmp.length < 2)
                continue;
            if (tmp[0].toUpperCase() == keyName.toUpperCase())
                return tmp[1];
        }
        return null;
    },
    approveApply: function (applyId, result, cb) {
        $.ajax({
            url: "hzqs/chg/pbeca.do?fh=ECACHG0000000J00&resp=bd",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "errorId": applyId,
                "result": result
            }),
            dataType: "json",
            success: function (data) {
                if (typeof (cb) === 'function') {
                    cb(data);
                }
            },
            error: function () {
                //alert("无访问权限");
            }
        });
    }
}