/**
 * Created by alex on 2017/4/10.
 */
function keyDown(e) {
    var ev = window.event || e;
    console.log(ev.keyCode)
    if (ev.keyCode == 13) {
        var value = $("#find_key").attr("value");
        //营业类
        if (value == 001) {
            window.location.href = "collectfee/chargenew.html";
        }
        if (value == 002) {
            window.location.href = "collectfee/icchargenew.html";
        }
        if (value == 003) {
            window.location.href = "collectfee/chargenew.html";
        }
        if (value == 004) {
            window.location.href = "serviceManage/refund_application.html";
        }
        if (value == 005) {
            window.location.href = "serviceManage/change_yarchives.html";
        }
        if (value == 006) {
            window.location.href = "serviceManage/change_name.html";
        }
        if (value == 007) {
            window.location.href = "serviceManage/series_connection.html";
        }
        if (value == "008") {
            window.location.href = "collectfee/iccardrewrite.html";
        }
        if (value == "009") {
            window.location.href = "collectfee/iccomplementapply.html";
        }
        if (value == 010) {
            window.location.href = "serviceManage/discount_apply.html";
        }
        if (value == 011) {
            window.location.href = "serviceManage/domestic_population_change.html";
        }
        if (value == 012) {
            window.location.href = "serviceManage/refund_registration.html";
        }
        if (value == 013) {
            window.location.href = "serviceManage/long_no_use_gas.html";
        }
        if (value == 015) {
            window.location.href = "serviceManage/long_no_gas_recovery.html";
        }
        // if (value == 005) {
        //     window.location.href = "serviceManage/refund_application.html";
        // }
        // if (value == 008) {
        //     // window.location.href = "../user_type_change.html";
        // }
        // if (value == 009) {
        //     // window.location.href = "open_switch.html";
        // }
        // if (value == 115) {
        //     // window.location.href = "open_switch.html";
        // }
        // if (value == 018) {
        //     window.location.href = "serviceManage/bill_printing_services.html";
        // }
        //工程类
        if (value == 101) {
            window.location.href = "serviceManage/open_switch.html";
        }
        if (value == 102) {
            window.location.href = "serviceManage/gas_change.html";
        }
        if (value == 103) {
            window.location.href = "serviceManage/add_del_volume.html";
        }
        if (value == 104) {
            window.location.href = "serviceManage/stop_gas.html";
        }
        if (value == 105) {
            window.location.href = "serviceManage/reuse_gas.html";
        }
        if (value == 106) {
            window.location.href = "serviceManage/meter_destory.html";
        }
        if (value == 107) {
            window.location.href = "serviceManage/change_meter.html";
        }
        if (value == 108) {
            window.location.href = "serviceManage/meter_zero.html";
        }
        // if (value == 108) {
        //     window.location.href = "serviceManage/no_resident_meter_destory.html";
        // }
        // if (value == 109) {
        //     window.location.href = "serviceManage/gas_installation.html";
        // }
        // if (value == 111) {
        //     window.location.href = "serviceManage/meter_detection.html";
        // }
        // if (value == 112) {
        //     window.location.href = "serviceManage/user_type_change.html";
        // }
    }
}


window.onload = function () {
    var oInput = document.getElementById("find_key");
    oInput.focus();
};
function selectService() {
    var value = $("#find_key").attr("value");
    console.log(value);
    if (value == "001") {
        window.location.href = "collectfee/chargenew.html";
    }
    if (value == "002") {
        window.location.href = "collectfee/icchargenew.html";
    }
    if (value == "003") {
        window.location.href = "collectfee/chargenew.html";
    }
    if (value == "004") {
        window.location.href = "serviceManage/refund_application.html";
    }
    if (value == "005") {
        window.location.href = "serviceManage/change_yarchives.html";
    }
    if (value == "006") {
        window.location.href = "serviceManage/change_name.html";
    }
    if (value == "007") {
        window.location.href = "serviceManage/series_connection.html";
    }
    if (value == "008") {
        window.location.href = "collectfee/iccardrewrite.html";
    }
    if (value == "009") {
        window.location.href = "collectfee/iccomplementapply.html";
    }
    if (value == "010") {
        window.location.href = "serviceManage/discount_apply.html";
    }
    if (value == 011) {
        window.location.href = "serviceManage/domestic_population_change.html";
    }
    if (value == 012) {
        window.location.href = "serviceManage/refund_registration.html";
    }
    if (value == 013) {
        window.location.href = "serviceManage/long_no_use_gas.html";
    }
    if (value == 015) {
        window.location.href = "serviceManage/long_no_gas_recovery.html";
    }
    if (value == 101) {
        window.location.href = "serviceManage/open_switch.html";
    }
    if (value == 102) {
        window.location.href = "serviceManage/gas_change.html";
    }
    if (value == 103) {
        window.location.href = "serviceManage/add_del_volume.html";
    }
    if (value == 104) {
        window.location.href = "serviceManage/stop_gas.html";
    }
    if (value == 105) {
        window.location.href = "serviceManage/reuse_gas.html";
    }
    if (value == 106) {
        window.location.href = "serviceManage/meter_destory.html";
    }
    if (value == 107) {
        window.location.href = "serviceManage/change_meter.html";
    }
    if (value == 108) {
        window.location.href = "serviceManage/meter_zero.html";
    }
}


