var GasModMrd = function() {
//抄表状态:0、新生成；1、下装；2、录入；3、分析中；4、已分析；5、计费中；6、计费完成；E、分析异常；7、开栓 8、办业务计费
 
    var enumMrdState = { '0':'新生成','1':'下装','2':'录入','3':'分析中','4':'已分析','5':'计费中','6':'计费完成','E':'分析异常','7':'开栓','8':'办业务计费','M':'定针待审批','S':'抄表差错待审批','A':'正常（不计费）'};

    var enumIsMrd = {'0':'未抄表','1':'已抄表'};

    var enumIsBll = {'0':'未计费','1':'已计费'};

    var enumFileUploadStatus = {'0':'未上传','1':'上传中','2':'上传完成'};

    var enumOperate = {'P':'正常抄表','S':'业务抄表','T':'临时抄表','Z':'周日抄及抄表复核（不计费）'};//,'F':'抄表复核'
    //除了年抄计划和业务抄表意外的抄表的类型（临时抄表计划，周日抄（不计费），抄表复核（不计费））的
    var enumTemporayType = {'01':'批量换表前抄表','02':'零散换表前抄表','03':'复抄','04':'顺价抄表','F01':'居民核算员抄表复核','F02':'营业主任抄表复核','F03':'非居民交互抄表复核','Z6':'周抄','Z7':'日抄','10':'其他'};
	//临时抄表计划类型
	var enumTemporaryType={'01':'批量换表前抄表','02':'零散换表前抄表','03':'复抄','10':'其他'};//'Z6':'周抄','Z7':'日抄','05':'抄表复核'
	var enumRecheckingOfMeterReading = {'015':'核算员核算计划','052':'营业室主任核算计划','053':'','054':'','055':'','056':''};
    //数据来源 : 1 见表； 2 自报（21门贴、22微信）； 3 估抄； 4 门锁； 5 拒抄； 6 遮挡 ；9 其他
    var enumDataSource = {'01':'见表','02':'自报','21':'门贴','22':'微信','03':'估抄','04':'门锁','05':'拒抄','06':'遮挡','07':'空房','08':'长期不用','09':'位置过高','10':'其他'};

    /*var enumCopyType = {'60':'正常抄表','61':'抄表差错新抄表','70':'新开栓抄表','72':'换表新表抄表','73':'错误表读数新表读数','75':'客户类型变更上线表抄表',
        '79':'调整初始表读数','81':'重新用气抄表','82':'换表旧表抄表','83':'错误表读数旧表读数','88':'暂停抄表','89':'拆除抄表','87':'拆分表户抄表',
        '86':'民工互转抄表','84':'职工户抄表','85':'客户类型变更下线表抄表','8A':'置换抄表','I0':'清零前抄表','I1':'ic卡新开栓抄表','I2':'ic卡抄表差错新抄表',
        'I3':'ic卡换表新表抄表','I4':'ic卡客户类型变更上线表抄表','I5':'ic卡重新用气抄表','I6':'ic卡换表旧表抄表','I7':'ic卡暂停抄表','I8':'ic卡拆除抄表',
        'I9':'ic卡客户类型变更下线表抄表','IA':'清零前抄表','IB':'清零后抄表'};*/
    var enumCopyType = {'60':'正常抄表','61':'抄表差错新抄表','70':'新开栓抄表','72':'换表新表抄表','75':'客户类型变更上线表抄表','76':'定针',
        '79':'调整初始表读数','81':'重新用气抄表','82':'换表旧表抄表','88':'暂停抄表','89':'拆除抄表',
        '85':'客户类型变更下线表抄表','8A':'置换抄表','I0':'清零前抄表','I1':'ic卡新开栓抄表','I2':'ic卡抄表差错新抄表',
        'I3':'ic卡换表新表抄表','I4':'ic卡客户类型变更上线表抄表','I5':'ic卡重新用气抄表','I6':'ic卡换表旧表抄表','I7':'ic卡暂停抄表','I8':'ic卡拆除抄表',
        'I9':'ic卡客户类型变更下线表抄表','IA':'清零前抄表','IB':'清零后抄表'};

    var enumCopyCycle = {'9':'日抄','7':'月抄','4':'季抄','2':'半年抄','1':'年抄'};

    var enumselectcopymonth ={"copy_january":{"12-26":"01-25"},"copy_february":{"01-26":"02-25"},
        "copy_march":{"02-26":"03-25"},"copy_april":{"03-26":"04-25"},
        "copy_may":{"04-26":"05-25"},"copy_june":{"05-26":"06-25"},
        "copy_july":{"06-26":"07-25"},"copy_august":{"07-26":"08-25"},
        "copy_september":{"08-26":"09-25"},"copy_october":{"09-26":"10-25"},
        "copy_november":{"10-26":"11-26"},"copy_december":{"11-26":"12-25"}
    };
    var enumselecttruecopymonth ={"copy_january_1":{"12-26":"01-25"},"copy_february_1":{"01-26":"02-25"},
        "copy_march_1":{"02-26":"03-25"},"copy_april_1":{"03-26":"04-25"},
        "copy_may_1":{"04-26":"05-25"},"copy_june_1":{"05-26":"06-25"},
        "copy_july_1":{"06-26":"07-25"},"copy_august_1":{"07-26":"08-25"},
        "copy_september_1":{"08-26":"09-25"},"copy_october_1":{"09-26":"10-25"},
        "copy_november_1":{"10-26":"11-26"},"copy_december_1":{"11-26":"12-25"}
    };
    
     var enumselectcopymonth1 ={
	 	"1":["12-26 00:00:00","01-25 23:59:59"],"2":["01-26 00:00:00","02-25 23:59:59"],
        "3":["02-26 00:00:00","03-25 23:59:59"],"4":["03-26 00:00:00","04-25 23:59:59"],
        "5":["04-26 00:00:00","05-25 23:59:59"],"6":["05-26 00:00:00","06-25 23:59:59"],
        "7":["06-26 00:00:00","07-25 23:59:59"],"8":["07-26 00:00:00","08-25 23:59:59"],
        "9":["08-26 00:00:00","09-25 23:59:59"],"10":["09-26 00:00:00","10-25 23:59:59"],
        "11":["10-26 00:00:00","11-26 23:59:59"],"12":["11-26 00:00:00","12-25 23:59:59"]
    };
    var totalone =["12-26 00:00:00","12-25 23:59:59"];

	var changeLogPlanTypeEnum = {"P1book":"居民按本变更年计划",'P9customer':"非居民按户变更年计划",'Z9customer':"非居民周日抄计划变更"};
   // var enumDataSource = {"01":"见表","02":"自报","03":"估抄","04":"门锁","05":"拒抄","06":"遮挡","07":"空房","08":"长期不用","09":"位置过高","10":"其他"}

    return {
        enumCopyCycle : enumCopyCycle,
        enumCopyState:enumMrdState,
        enumCopyType:enumCopyType,
        enumIsMrd:enumIsMrd,
        enumIsBll:enumIsBll,
        enumDataSource:enumDataSource,
        enumFileUploadStatus:enumFileUploadStatus,
        enumOperate:enumOperate,
        enumSelectCopyMonth:enumselectcopymonth,
        enumSelectTrueCopyMonth:enumselecttruecopymonth,
        enumStatisticsMonth :enumselectcopymonth1,
        enumOneYear:totalone,
        enumPlanType:changeLogPlanTypeEnum,//抄表计划变更日志表--计划变更提交审批的时候
       // enumDataSource:enumDataSource,
       enumTemporayType:enumTemporayType,
		currentCountperList:function(jsOpts){//当前所有核算员
			var sql = {
				"cols":"s.user_id,s.employee_name,s.employee_code,s.user_id",
				"froms":"gas_sys_user s ",
				"wheres":" s.status ='1' and s.station_id='1'",
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
		currentServiceperList:function(jsOpts){
			var sql = {
				"cols":"s.user_id,s.employee_name,s.employee_code,s.user_id",
				"froms":"gas_sys_user s ",
				"wheres":" s.status ='1' and s.station_id='2' ",
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
		
		historyCountperList:function(jsOpts){//历史核算员列表
			var sql = {
				"cols":"s.user_id,s.employee_name,s.employee_code,s.user_id",
				"froms":"gas_sys_user s ",
				"wheres":" s.status <>'1' and s.station_id='1'",
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
		historyServiceperList:function(jsOpts){//历史抄表员列表
			var sql = {
				"cols":"s.user_id,s.employee_name,s.employee_code,s.user_id",
				"froms":"gas_sys_user s ",
				"wheres":" s.status <>'1' and s.station_id='2' ",
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
        bookList:function(jsOpts){
            var sql = {
                "cols":"b.bookId,b.bookCode,b.address",
                "froms":"gas_mrd_book b",
               // "wheres":"1=1 and b.areaId='"+jsOpts["areaId"]+"' ",
                "wheres":" 1=1 and b.areaId in ( select area_id from gas_biz_area where parent_area_id='"+jsOpts["areaId"]+"' and status<>'3' union" +
                " select area_id from gas_biz_area where status<>'3'  start with area_id='"+jsOpts['areaId']+"' connect by prior area_id=parent_area_id) and b.status <>'3' " +
                "  ",
                "page":"false"
            }
            $.ajax({
                url:'/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00',
                dataType:'json',
                type:'POST',
                contentType:"application/json; charset=utf-8",
                data:JSON.stringify(sql),
                async:true,
            }).done(function(data,retcode){
                jsOpts['cb'](data.rows);
            });
        },
        queryGasTypeByParentId: function (gasTypeId) {
            var gasTypeIdItem=[];
            var queryCondion = RQLBuilder.equal("parentTypeId",gasTypeId).rql();
            var queryUrl = Utils.queryURL(hzq_rest+ "gasbizgastype")+'fields={"gasTypeId":1}&query='+queryCondion;
            var queryGasTypeIdObj  =Restful.findNQ(queryUrl);
            $.each(queryGasTypeIdObj,function(idx,row){
                gasTypeIdItem.push(row.gasTypeId) ;
            })
            return  gasTypeIdItem;
        },
        //抄表员列表
        bookInService: function(jsOpts){
            var sql = {
                "cols":"b.bookId,b.bookCode,b.address",
                "froms":"gas_mrd_book b",
                "wheres":"1=1 and b.countperId='"+jsOpts["countperId"]+"' and b.areaId='"+jsOpts["areaId"]+"' " +
                "and b.serviceperId='"+jsOpts["serviceperId"]+"' and b.status<>'3' ",
                "page":"false"
            }
            $.ajax({
                url:'/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00',
                dataType:'json',
                type:'POST',
                contentType:"application/json; charset=utf-8",
                data:JSON.stringify(sql),
                async:true,
            }).done(function(data,retcode){
                jsOpts['cb'](data.rows);
            });
        },
        copyUsersInArea:function(jsOpts){
            /*var query = RQLBuilder.and([
             RQLBuilder.equal("stationId","2"),
             RQLBuilder.equal("areaId",jsOpts["areaId"])
             ]).rql();
             */
            var query={
                "cols": "distinct(u.userId),u.employeeName,u.areaId",
                "froms":"gasMrdBook b, gasSysUser u",
                "wheres": "b.serviceperId=u.userId and u.stationId='2' and b.countperId =  '"+jsOpts["countperId"]+"' " +
                "and b.areaId='"+jsOpts["areaId"]+"' and b.status<>'3' and u.status<>'3' ",
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
                async: true,
            }).done(function(data,retcode) {
                jsOpts['cb'](data.rows);
            });
        },
        //核算员
        //复核员列表
        counterUsersListInArea:function(jsOpts){

            var info = '1=1';
            if(jsOpts["areaId"] && jsOpts["areaId"] != ""){
                info +=" and b.areaId='"+jsOpts["areaId"]+"' and u.areaId='"+jsOpts["areaId"]+"' "
            }
            var query={
                "cols": "distinct(u.userId),u.employeeName,u.employeeCode,u.areaId",
                "froms":"gasMrdBook b, gasSysUser u",
                "wheres": info + " and u.stationId='1'  and u.status<>'3' and u.status<>'3' ",
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
                async: true,
            }).done(function(data,retcode) {
                jsOpts['cb'](data.rows);
            });
        },

        //抄表员
        copyUsersListInArea:function(jsOpts){
            /*var query = RQLBuilder.and([
             RQLBuilder.equal("stationId","2"),
             RQLBuilder.equal("areaId",jsOpts["areaId"])
             ]).rql();
             */
            var query={
                "cols": "distinct(u.userId),u.employeeName,u.employeeCode,u.areaId",
                "froms":"gasMrdBook b, gasSysUser u",
                "wheres": " u.stationId='2' and u.areaId='"+jsOpts["areaId"]+"' and b.areaId='"+jsOpts["areaId"]+"' and u.status<>'3' and b.status<>'3' ",
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
                async: true,
            }).done(function(data,retcode) {
                jsOpts['cb'](data.rows);
            });
        },

        appMeterErrorList:function(jsOpts){
            var query={
                "cols":"parameter_code,parameter_name",
                "froms":"gas_sys_parameter",
                "wheres":"parameter_type_id='app_meter_question' and status='1' ",
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
                async: true,
            }).done(function(data,retcode) {
                jsOpts['cb'](data.rows);
            });
        },
        customerCodeByFormat:{

                f:function(val,row,cell,key,cellid,async){

                    var v = RefHelper.getRef({
                        ref_url:"psmflowinst",
                        ref_col:"flowInstId",
                        ref_display:"flowInstId",
                        ref_id:val,
                        ref_div:cell,
                        ref_div_id:cellid,
                        async:async,
                        dataformat:"<a data-target='#apply' data-toggle='modal' data-id='"+row.flowInstId+"' class='btn_show_detail' >"+row.customerCode+"<i class='fa fa-plus'>"
                    });
                    if(v) return v;
                    return "--";
                }
           /* f: function(val,rows,cell,cellid,async){
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
            },*/

        },
      /*  dataSourceFormat:{
            f:function(val){
                return enumDataSource[val];
            }
        },*/
        mrdStateFormat:{
            f: function(val){
                return enumMrdState[val];
            },
        },
        operateFormat:{
        		f:function(val){
        			return enumOperate[val];
        		}
        },
        fileUploadStateFormat:{
            f: function(val){
                if(enumFileUploadStatus[val])return enumFileUploadStatus[val]
                return '无照片';
            },
        },
        isMrdFormat:{
            f:function(val){
                return enumIsMrd[val];
            }
        },
        isBllFormat:{
            f:function(val){
                return enumIsBll[val];
            }
        },
        copyTypeFormat :{
            f:function(val){
                return enumCopyType[val];
            }
        },
        enumOperateFormat:{
           f:function(val){
               return enumOperate[val];
           }
        },
        dataSourceFormat:{
            f:function(val){
                return enumDataSource[val];
            }
        },
        bookCodeByFormat:{
          f:function (val, row, cell, key) {
              //console.log(val,row,cell,key);
              console.log(row);
              var v = RefHelper.getRef({
                  ref_url :"gasmrdbook",
                  ref_col :"bookId",
                  ref_display :"bookCode",
                  ref_id:val,
                  ref_div:cell,
                  dataformat:"<a href='/meterreading/plan/detailsofsupply_area.html?{0}&"+row.planCopyTime+"'>{1}</a>"
              });
              if(v) return v;
              return "--";
          }
        },

        //所有 核算员
        //所有抄表员
        //抄表员列表
        copyUsersList:function(jsOpts){
            /*var query = RQLBuilder.and([
             RQLBuilder.equal("stationId","2"),
             RQLBuilder.equal("areaId",jsOpts["areaId"])
             ]).rql();
             */
            var info = '';
            if(jsOpts["areaId"] && jsOpts["areaId"] != ""){
                info +=" and b.areaId='"+jsOpts["areaId"]+"' "
            }
            var query={
                "cols": "distinct(u.userId),u.employeeName,u.areaId",
                "froms":"gasMrdBook b, gasSysUser u",
                "wheres":" b.serviceperId= u.userId  and u.stationId='2' and u.status<>'3' and b.status<>'3' "+ info,
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
                async: true,
            }).done(function(data,retcode) {
                jsOpts['cb'](data.rows);
            });
        },
        //复核员列表
        counterUsersList:function(jsOpts){

            var info = '1=1';
            if(jsOpts["areaId"] && jsOpts["areaId"] != ""){
                info +=" and b.areaId='"+jsOpts["areaId"]+"' "
            }
            var query={
                "cols": "distinct(u.userId),u.employeeName,u.areaId",
                "froms":"gasMrdBook b, gasSysUser u",
                "wheres": info + " and u.stationId='1' and b.countperId=u.userId and b.status<>'3' and u.status<>'3' ",
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
                async: true,
            }).done(function(data,retcode) {
                jsOpts['cb'](data.rows);
            });
        },
        copytyperuledayFormat:{
            f:function (val, row, cell, key) {
                if(val == '9'){
                    return "非居民本抄表例日请见【非居民抄表例日】";
                }else{
                    return row.copyRuleday;
                }
            }
        },
        
        //客户服务员，核算员 ---根据 format
        

        init: function(xwajson) {

        }
    }
}();

