
var GasModMtr = function() {

    var enumMeterKind = {'01':'普表','02':'IC卡气量表','03':'IC卡金额表','04':'代码表','05':'远传表'};
    //表户状态
    var meterUserStatus = {"01":"正常","02":"暂停用气","03":"拆除状态","00":"新用户","99":"删除"};
	var stockTakingEnum={
		"1":"盘盈",
		"2":"盘亏"
	};

    return {

        meterKindFormat:{
            f: function(val){
                return enumMeterKind[val];
            },
        },
        meterUserStateFormat:{
            f: function(val){
                return meterUserStatus[val];
            },
        },
		stockTakingEnumFormat:{
			f: function(val){
				return stockTakingEnum[val];
			},
		},

        //表具额定流量&表具流量范围
         meterFlowList:function(jsOpts){
        	var sql = {
        		"cols":"rating_flux,meter_flow_id,flow_code,flow_name",
        		"froms":"gas_mtr_meter_flow",
        		//"wheres":"parent_meter_type_id='0' ",
        		"page":"false"
        	}
        	$.ajax({
        		type:"POST",
        		url:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00",
        		async:false,
				dataType:'json',
				contentType:"application/json; charset=utf-8",
				data:JSON.stringify(sql),
        	}).done(function(data,retcode){
        		jsOpts['cb'](data.rows);
        	})
        },
        
        //表具类型_父级
        parentMeterTypeList:function(jsOpts){
        	var sql = {
        		"cols":"meter_type_id,meter_type_name,meter_type_code",
        		"froms":"gas_mtr_meter_type",
        		"wheres":"parent_meter_type_id='0' ",
        		"page":"false"
        	}
        	$.ajax({
        		type:"POST",
        		url:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00",
        		async:false,
				dataType:'json',
				contentType:"application/json; charset=utf-8",
				data:JSON.stringify(sql),
        	}).done(function(data,retcode){
        		jsOpts['cb'](data.rows);
        	})
        },
        //表具类型_子集
        childMeterTypeList:function(jsOpts){
			var sql = {
				"cols":"meter_type_id,meter_type_name,meter_type_code",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
				"froms":"gas_mtr_meter_type",
				"wheres":"parent_meter_type_id='"+jsOpts['parentMeterTypeId']+"' ",
				"page":"false"
			}
			$.ajax({
				type:"POST",
				url:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00",
				async:false,
				dataType:'json',
				contentType:"application/json; charset=utf-8",
				data:JSON.stringify(sql),
			}).done(function(data,retcode){
				jsOpts['cb'](data.rows);	
			})
		},
		meterTypeList:function(jsOpts){
			var sql = {
				"cols":"meter_type_id,meter_type_name,meter_type_code",
				"froms":"gas_mtr_meter_type",
				"wheres":" 1=1 ",
				"page":"false"
			}
			$.ajax({
				type:"POST",
				url:"/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00",
				async:false,
				dataType:'json',
				contentType:"application/json; charset=utf-8",
				data:JSON.stringify(sql),
			}).done(function(data,retcode){
				jsOpts['cb'](data.rows);	
			})
		},
		
        init: function(xwajson) {
        },
    }
}();