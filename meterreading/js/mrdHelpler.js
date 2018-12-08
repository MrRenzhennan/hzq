var customerInfo;
var mrdHelper = {
    setContext: function (key, obj) {
        custormInfo = {key:obj};
    },
    getContext: function (key) {
        return customerInfo.get(key);
    },
}