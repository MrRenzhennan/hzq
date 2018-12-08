var dateHelper=function(){
    return {
        //获取月初 val=2017-08
        getMonthStart:function(val){
            return moment(dateHelper.getMonthEnd(val)).add("month",-1).format('YYYY-MM-DD');
        },
        //获取月末
        getMonthEnd:function(val){
            return moment(val).format('YYYY-MM')+"-26";
        },
        //获取当月
        getCurMonth:function(val){
            return moment(dateHelper.getMonthEnd(val)).format("MM");
        },
        //获取当年
        getCurYear:function(val){
            return moment(dateHelper.getMonthEnd(val)).format('YYYY');
        },
        //获取当年年初
        getCurYearMonthStart:function(val){
            return moment(dateHelper.getPrevYear(val)).format('YYYY')+"-12-26";
        },
        //获取上年
        getPrevYear:function(val){
            return moment(dateHelper.getCurYear(val)).add('year',-1).format('YYYY');
        },
        //获取上月
        getPrevMonth:function(val){
            var o=moment(dateHelper.getMonthEnd(val)).add('month',-1);
            return {month:parseInt(o.format("MM")),year:parseInt(o.format("YYYY"))};
        }
    }    
}();