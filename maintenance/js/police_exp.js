var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var xw;
var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");

function setStartEnd(startdiff,timed){
    $('#find_fromtime').val(moment().add(startdiff,timed).format('YYYY-MM-DD'))
    $('#find_totime').val(moment().format('YYYY-MM-DD'));
}
$('#find_today_sign').on('click',function(e){setStartEnd(0,'d')})
$('#find_this_week_sign').on('click',function(e){setStartEnd(-7,'d')})
$('#find_this_month_sign').on('click',function(e){setStartEnd(-1,'M')})
$('#find_three_month_sign').on('click',function(e){setStartEnd(-3,'M')})
$('#find_this_year_sign').on('click',function(e){setStartEnd(-1,'y')})
$('#find_anyway_sign').on('click',function(e){
    $('#find_fromtime').val("");
    $('#find_totime').val("");
})
var PoliceAction = function () {
	
    
	return {
        init: function () {
            this.reload();
            this.initAction();
        },
        initAction:function(){
        	var areaId = UserInfo.init().area_id;
        	var areas = new Array();
			areas.push(areaId)
			//查询areaId下级areaId
			var areaData = Restful.getByID(hzq_rest+"gasbizarea",areaId);
			$('#find_area').append('<option  value="' + areaData.areaId + '">' + areaData.areaName + '</option>');
			var xwQuery = RQLBuilder.and([
			    RQLBuilder.equal("parentAreaId", areaId),RQLBuilder.equal("status","1")
			]).rql();
			$.ajax({
				headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
				},
				type: 'get',
				async: false,
				url: hzq_rest+"gasbizarea?query="+xwQuery,
				success: function (data) {
					for(var i=0;i<data.length;i++){
						areas.push(data[i].areaId);
						$('#find_area').append('<option  value="' + data[i].areaId + '">' + data[i].areaName + '</option>');
					}
			    } 
			})
			$('#find_area').change(function(e){
				$('#find_countper').empty();
				$('#find_countper').val("").trigger("change");
				$('#find_countper').text("")
		    	var xwQuery2 = RQLBuilder.and([
			    	RQLBuilder.equal("areaId", e.val),RQLBuilder.equal("status","1"),RQLBuilder.equal("stationId","1")
				]).rql();
				var countperData=Restful.findNQ(hzq_rest+'gassysuser?query='+xwQuery2);
			    console.log(countperData);
			    for(var i=0; i<countperData.length;i++){
			    	$('#find_countper').append('<option value="' + countperData[i].userId + '">' + countperData[i].employeeName + '</option>');
			    }
		    })
		    
//		    $('#find_area').val(areaId).trigger("change");
        },
        reload: function () {
        	

			var froms="gas_ctm_archive a"+
					" left join (select * from(select c.customer_code,c.created_time,c.money,row_number() over (partition by c.customer_code order by c.created_time desc) as rn1"+
					" from gas_chg_gas_detail c ) where rn1=1) k on a.customer_code=k.customer_code"+
					" left join gas_mrd_book m on a.book_id=m.book_id"
            $('#divtable').html('');
			
			var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
			var wheres="1!=1";
			var params = {
				"cols": "a.customer_code,a.customer_name,a.customer_address,a.tel,a.idcard,k.created_time,k.money",
				"froms": froms,
				"wheres": wheres,
				"page": true,
				"limit": 50
			}
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: paramurl+encodeURIComponent(JSON.stringify(params)),
                    key_column: "customerCode",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "customerCode",
                            friendly: "客户号",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "tel",
                            friendly: "客户电话",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "idcard",
                            friendly: "客户身份证",
                            sorting: false,
                            index: 5
                        },{
                            col: "createdTime",
                            friendly: "缴费时间",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "money",
                            friendly: "缴费金额",
                            sorting: false,
                            index: 7
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                    	var froms2="gas_ctm_archive a"+
								" left join (select * from(select c.customer_code,c.created_time,c.money,row_number() over (partition by c.customer_code order by c.created_time desc) as rn1"+
								" from gas_chg_gas_detail c ) where rn1=1) k on a.customer_code=k.customer_code"+
								" left join gas_mrd_book m on a.book_id=m.book_id"
						
						var paramurl2 = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
						var wheres2="1=1";
                        if ($('#find_area').val()) {
                        	if($('#find_area').val()!="1"){
                        		wheres2=wheres2+" and a.area_id='"+ $('#find_area').val()+"'";
                        	}
                        }else{
                        	bootbox.alert('<center><h4>请选择供气区域</h4></center>');
                        	return false;
                        }
                        if ($('#find_countper').val()) {
                            wheres2=wheres2+ " and m.countper_id='"+ $('#find_countper').val()+"'";
                        }
                        if ($('#find_customercode').val()) {
                            wheres2+=" and customer_code like '%"+ $('#find_customercode').val() +"%'";
                        }
                        if ($('#find_customername').val()) {
                            wheres2+=" and customer_name like '%"+ $('#find_customername').val() +"%'";
                        }

//                      if ($('#find_fromtime').val()) {
//                          wheres2+=" and created_time >= to_date('"+  $('#find_fromtime').val()+" 00:00:00" +"','yyyy-MM-dd HH24:mi:ss')" ;
//                      }
//                      if ($('#find_totime').val()) {
//                      	wheres2+=" and created_time <= to_date('"+  $('#find_totime').val()+" 23:59:59" +"','yyyy-MM-dd HH24:mi:ss')" ;
//                      }
                        var params2 = {
							"cols": "a.customer_code,a.customer_name,a.customer_address,a.tel,a.idcard,k.created_time,k.money",
							"froms": froms2,
							"wheres": wheres2,
							"page": true,
							"limit": 50
						}
                        xw.setRestURL(paramurl2 + encodeURIComponent(JSON.stringify(params2)));
                        return "";
                    },

                    onAdded: function (ret, jsondata) {

                    },

                    onUpdated: function (ret, jsondata) {

                    },

                    onDeleted: function (ret, jsondata) {
                    },
                }//--init
            );//--end init
        },

    }
}();


