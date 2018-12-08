var FactoryAction = function () {
    // 卡厂家helper
    var factoryHelper=RefHelper.create({
        ref_url:"gaschgicfactory",
        ref_col:"code",
        ref_display:"name",
    });
    // 收费方式helper
    var chgtypeHelper = RefHelper.create({
        ref_url:"gaschgtype",
        ref_col:"chargetypecode",
        ref_display:"chargetypename",
    });
    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();

        },

        initHelper:function(){
            // 卡厂家 select init
            $.map(factoryHelper.getData(), function(value, key) {

                $('#find_cardId').append('<option value="'+key+'">'+value+'</option>');
            });
            // 收费方式 select init
            $.map(chgtypeHelper.getData(), function(value, key) {

                $('#col_method').append('<option value="'+key+'">'+value+'</option>');
            });
            $.map(chgtypeHelper.getData(), function(value, key) {

                $('#ccol_method').append('<option value="'+key+'">'+value+'</option>');
            });
            $.map(chgtypeHelper.getData(), function(value, key) {

                $('#gcol_method').append('<option value="'+key+'">'+value+'</option>');
            });
        },





    }
}();