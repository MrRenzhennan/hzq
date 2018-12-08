
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results;
}


var GasModSys = function() {
	

	var areaHelper = RefHelper.create({
        ref_url: 'gasbizarea?query={"status":"1"}',
        ref_col: "areaId",
        "sort":"posCode",
        ref_display: "areaName",
    });
	var employeeHelper = RefHelper.create({
        ref_url: 'gassysuser?query={"status":"1"}',
        ref_col: "userId",
        ref_display: "employeeName",
    });
    var enumUserStation = {"1":"核算员","2":"抄表员"};


    return {

        employeeHelper:employeeHelper,
    	areaHelper: areaHelper,
    	enumUserStation:enumUserStation,
    	areaFormat: {
            f: function(val){
                return areaHelper.getDisplay(val);
            },

        },
        areaList:function(jsOpts){
            var query = {
                "cols":" area_id,area_name,pos_code ",
                "froms":" gas_biz_area where parent_area_id='"+jsOpts["areaId"]+"' and status<>'3' union" +
                " select area_id,area_name,pos_code from gas_biz_area where status<>'3' start with area_id='"+jsOpts['areaId']+"' connect by prior area_id=parent_area_id order by pos_code " ,
                "where":"1=1",
                "page":false
            }
            $.ajax({
                //url: Utils.queryURL(hzq_rest+ "gassysuser")+'fields={"userId":1,"employeeName":1,'+
                //'"stationId":1,"chargeUnitId":1}&query='+query,
                url:'/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00',
                dataType: 'json',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data:JSON.stringify(query),
                async: false,
            }).done(function(data,retcode) {
                console.log(data.rows);
                jsOpts['cb'](data.rows);
            });
        },

        //把未来的生成出来就行了，不管历史了。
        
        //抄表员列表
        copyUsersInArea:function(jsOpts){
        	/*var query = RQLBuilder.and([
        		RQLBuilder.equal("stationId","2"),
        		RQLBuilder.equal("areaId",jsOpts["areaId"])
			]).rql();
            */

            var query={
                  "cols": "distinct(u.userId),u.employeeName,u.areaId",
                  "froms":"gasMrdBook b, gasSysUser u",
                  "wheres": "b.serviceperId=u.userId and u.stationId='2' and b.countperId =  '"+jsOpts["countperId"]+"' and b.areaId='"+jsOpts["areaId"]+"'",
                  "page":false
                }

        	$.ajax({
                //url: Utils.queryURL(hzq_rest+ "gassysuser")+'fields={"userId":1,"employeeName":1,'+
                //'"stationId":1,"chargeUnitId":1}&query='+query,
                url:'/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00',
                dataType: 'json',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data:JSON.stringify(query),
                async: false,
            }).done(function(data,retcode) {
                jsOpts['cb'](data.rows);
        	});
        },
        //复核员列表
        counterUsersInArea:function(jsOpts){
            var loginuser = JSON.parse(localStorage.getItem("user_info"));

            var query;
            if(jsOpts["areaId"] && jsOpts["areaId"] != ""){
                if(loginuser.station_id == '1'){
                    var query = RQLBuilder.and([
                        RQLBuilder.equal("stationId","1"),
                        RQLBuilder.equal("areaId",jsOpts["areaId"]),
                        RQLBuilder.equal("userId",loginuser.userId)

                    ]).rql();

                }else{
                    var query = RQLBuilder.and([
                        RQLBuilder.equal("stationId","1"),
                        RQLBuilder.equal("areaId",jsOpts["areaId"])

                    ]).rql();
                }
            }else{
                var query = RQLBuilder.and([
                    RQLBuilder.equal("stationId","1"),
                ]).rql();
            }
        	$.ajax({
                url: Utils.queryURL(hzq_rest+ "gassysuser")+'fields={"userId":1,"employeeName":1,'+
                '"stationId":1,"chargeUnitId":1}&query='+query,
                dataType: 'json',
                async: false,
            }).done(function(data,retcode) {
                 jsOpts['cb'](data);       
        	});
        },
        
        //本供气区域 的 所有员工
        employeeListForArea:function(jsOpts){
        	var loginuser = JSON.parse(localStorage.getItem("user_info"));

            var query;
            if(jsOpts["areaId"] && jsOpts["areaId"] != ""){
                if(loginuser.station_id == '1'){
                    var query = RQLBuilder.and([
                        RQLBuilder.equal("status","1"),
                        RQLBuilder.equal("areaId",jsOpts["areaId"])
                       // RQLBuilder.equal("userId",loginuser.userId)

                    ]).rql();

                }else{
                    var query = RQLBuilder.and([
                        RQLBuilder.equal("status","1"),
                        RQLBuilder.equal("areaId",jsOpts["areaId"])

                    ]).rql();
                }
            }else{
                var query = RQLBuilder.and([
                    RQLBuilder.equal("status","1"),
                ]).rql();
            }
        	$.ajax({
                url: Utils.queryURL(hzq_rest+ "gassysuser")+'fields={"userId":1,"employeeName":1}&query='+query,
                dataType: 'json',
                async: false,
            }).done(function(data,retcode) {
                 jsOpts['cb'](data);       
        	});
        	
        },
        employeeNameFormat : {
	            f: function(val,rows,cell,cellid,async){
	                var v = RefHelper.getRef({
	                        ref_url: "gassysuser",
	                        ref_col: "userId",
	                        ref_display: "employeeName",
	                        ref_id:val,
	                        ref_div:cell,
                            ref_div_id:cellid,
                            async:async
	                    });
	               	if(v)return v;
	                return val;
	            //    return seviceHelper.getDisplay(val);
	            },
	    },
	    gasTypeIdFromat :{
			f: function(val,rows,cell,cellid,async){
			            var v = RefHelper.getRef({
			                    ref_url: "gasbizgastype",
			                    ref_col: "gasTypeId",
			                    ref_display: "gasTypeName",
			                    ref_id:val,
			                    ref_div:cell,
			                    ref_div_id:cellid,
			                    async:async
			                });
			           	if(v)return v;
			            return val;
			        //    return seviceHelper.getDisplay(val);
			        },
	   },

        
        enumBookType: {"9":"非居民","1":"居民"},
        init: function(xwajson) {


            
        },
        //审核状态
        examineState: function () {
            return {
                f: function (val) {
                    if(val==="1") return "<font color='blue'>审核中</font>";
                    else if(val==="2") return "<font color='fuchsia'>审核通过</font>";
                    else if(val==="3") return "<font color='green'>审核未通过</font>";
                    else return "error";
                }
            }
        }(),
    }



}();