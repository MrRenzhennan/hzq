var userinfo = JSON.parse(localStorage.getItem('user_info'));
//$("#find_area")
var areaId;
var areas = new Array();
var customerTypeEmnu={"P":"普表","I":"IC卡"}
var AccountManager = function(){
	var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName"
    });
    var gasTypeFormat= function () {
        return {
            f: function (val) {
                return gasTypeHelper.getDisplay(val);
            },
        }
    }();
    var typeFormat= function () {
        return {
            f: function (val) {
                return customerTypeEmnu[val];
            },
        }
    }();
    
	return {
        init: function () {
            this.reload2();
            this.reload();
        },
        reload2: function () {
        	areaId = userinfo.area_id;
			areas.push(areaId)
			//查询areaId下级areaId
			var areaData = Restful.getByID(hzq_rest+"gasbizarea",areaId);
			console.log(areaData)
			$('#find_area').append('<option  value="' + areaData.areaId + '">' + areaData.areaName + '</option>');
			$('#find_area2').append('<option  value="' + areaData.areaId + '">' + areaData.areaName + '</option>');
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
						$('#find_area2').append('<option  value="' + data[i].areaId + '">' + data[i].areaName + '</option>');
					}
			    } 
			})
			var gasTypeData=Restful.findNQ(hzq_rest+'gasbizgastype?query={"posCode":"1"}&sort=gasTypeId');
		    //用气性质select
		    for(var i=0; i<gasTypeData.length;i++){
		    	$('#find_gastype').append('<option value="' + gasTypeData[i].gasTypeId + '">' + gasTypeData[i].gasTypeName + '</option>');
		    }
		    $('#find_area').val(areaId).trigger("change");
		    $('#find_area2').val(areaId).trigger("change");
        },
        reload: function () {

        	var sel="chg_account_id,acc_name,chg_account_no,nvl(sum(start_money),0) start_money,nvl(sum(end_money),0) end_money,nvl(sum(chg_money),0) chg_money,nvl(sum(0-money),0) del_money ";
        	var froms="(select xxx.chg_account_id,xxx.acc_name,xxx.chg_account_no,xxx.trade_type,"+
					"(case when xxx.st=1 then last_money else 0 end) start_money,"+
					"(case when xxx.en=1 then last_money else 0 end) end_money,"+
					"(case when trade_date>=add_months(to_date('20170826','yyyyMMdd'),-1) and trade_date<to_date('20170826','yyyyMMdd') and xxx.chg_money is not null then chg_money else 0 end) chg_money,"+
					"(case when xxx.trade_type in ('BLL','ICB') and trade_date>=add_months(to_date('20170826','yyyyMMdd'),-1) and trade_date<to_date('20170826','yyyyMMdd') then money else 0 end) money"+
					" from"+
					" (select row_number() over (partition by xx.chg_account_id order by xx.st_temp desc )as st,"+
					"row_number() over (partition by xx.chg_account_id order by xx.en_temp desc )as en,"+
					"xx.* from (select"+
					" (case when x.trade_date<add_months(to_date('20170826','yyyyMMdd'),-1) then row_number() over (partition by x.chg_account_id order by x.trade_date asc ) else 0 end) st_temp,"+
					"(case when x.trade_date<to_date('20170826','yyyyMMdd') then row_number() over (partition by x.chg_account_id order by x.trade_date asc ) else 0 end) en_temp,"+
					"x.* from (select chgacc.chg_account_id,chgacc.acc_name,chgacc.chg_account_no,atl.trade_type,atl.money,atl.last_money,detail.money chg_money,atl.trade_date"+
					" from gas_chg_account chgacc"+
					" left join gas_act_gasfee_atl atl on chgacc.chg_account_id=atl.chg_account_id"+
					" left join gas_act_gasfee_account gasacc on chgacc.chg_account_id=gasacc.chg_account_id"+
					" left join gas_chg_gas_detail detail on atl.gasfee_atl_id=detail.trade_id"+
					" where 1=0 and chgacc.account_type='1' and chgacc.area_id='18') x)xx)xxx)xxxx group by chg_account_id,acc_name,chg_account_no";
        	var wheres="";
        	
        	var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
			var params = {
				"cols": sel,
				"froms": froms,
				"wheres": wheres,
				"page": true,
				"limit": 50
			}
			
			var sel2="chg_account_id,customer_name,customer_code,gas_type_id,nvl(sum(start_money),0) start_money,nvl(sum(end_money),0) end_money,nvl(sum(chg_money),0) chg_money,nvl(sum(0-money),0) del_money";
				
			var froms2="(select xxx.chg_account_id,xxx.customer_name,xxx.customer_code,xxx.trade_type,xxx.gas_type_id,"+
  				" (case when xxx.st=1 then last_money else 0 end) start_money,"+
				" (case when xxx.en=1 then last_money else 0 end) end_money,"+
				" (case when trade_date>=add_months(to_date('20170826','yyyymmdd'),-1) and trade_date<to_date('20170826','yyyymmdd') and xxx.chg_money is not null then chg_money else 0 end) chg_money,"+
				" (case when xxx.trade_type in ('bll','icb') and trade_date>=add_months(to_date('20170826','yyyymmdd'),-1) and trade_date<to_date('20170826','yyyymmdd') then money else 0 end) money"+
				" from "+
				" (select row_number() over (partition by xx.chg_account_id order by xx.st_temp desc )as st,"+
				" row_number() over (partition by xx.chg_account_id order by xx.en_temp desc )as en,"+
				" xx.* from (select"+
    			" (case when x.trade_date<add_months(to_date('20170826','yyyymmdd'),-1) then row_number() over (partition by x.chg_account_id order by x.trade_date asc ) else 0 end) st_temp,"+
    			" (case when x.trade_date<to_date('20170826','yyyymmdd') then row_number() over (partition by x.chg_account_id order by x.trade_date asc ) else 0 end) en_temp,"+
    			" x.* from (select chgacc.chg_account_id,arch.customer_name,arch.customer_code,arch.gas_type_id,atl.trade_type,atl.money,atl.last_money,detail.money chg_money,atl.trade_date"+
    			" from gas_chg_account chgacc"+
			    " left join gas_ctm_archive arch on arch.ctm_archive_id=chgacc.ctm_archive_id"+
			    " left join gas_act_gasfee_atl atl on chgacc.chg_account_id=atl.chg_account_id"+ 
			    " left join gas_chg_gas_detail detail on atl.gasfee_atl_id=detail.trade_id"+
			    " where 1=0 and chgacc.account_type='0' and chgacc.rel_chg_account_id is null and arch.area_id='18' and arch.customer_kind='9'"+
			    " ) x)xx)xxx) group by chg_account_id,customer_name,customer_code,gas_type_id";
			var wheres2="";
			var params2 = {
				"cols": sel2,
				"froms": froms2,
				"wheres": wheres2,
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
                            friendly: "联合账户编号",
                            unique: true,
                            readonly: "readonly",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "联合账户名称",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "startMoney",
                            friendly: "期初余额",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "endMoney",
                            friendly: "期末余额",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "chgMoney",
                            friendly: "本月收费额",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "delMoney",
                            friendly: "本月扣划额",
                            sorting: false,
                            index: 7
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                    	
                    },

                    onAdded: function (ret, jsondata) {

                    },

                    onUpdated: function (ret, jsondata) {

                    },

                    onDeleted: function (ret, jsondata) {
                    },
                }//--init
            );//--end init
            
            xw1 = XWATable.init(
                {
                    divname: "divtable1",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: paramurl+encodeURIComponent(JSON.stringify(params2)),
                    key_column: "customerCode",
                    //---------------行定义
                    coldefs: [
                        
                        {
                            col: "customerCode",
                            friendly: "客户号",
                            unique: true,
                            readonly: "readonly",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "customerType",
                            friendly: "客户类别",
                            sorting: false,
                            format:typeFormat,
                            index: 4
                        },
                        {
                            col: "startMoney",
                            friendly: "期初余额",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "endMoney",
                            friendly: "期末余额",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "chgMoney",
                            friendly: "本月收费额",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "delMoney",
                            friendly: "本月扣划额",
                            sorting: false,
                            index: 8
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                    },

                    onAdded: function (ret, jsondata) {

                    },

                    onUpdated: function (ret, jsondata) {

                    },

                    onDeleted: function (ret, jsondata) {
                    },
                }//--init
            );//--end init
        }
    }
}()

$("#find_button1").click(function(){
	var find_area = $('#find_area').val()
    if (!find_area) {
    	bootbox.alert("<center><h4>请选择联合账户的供气区域</h4></center><br>");
    	return;
    }else if(find_area=="1"){
    	find_area="";
    }
	var find_month = $('#find_month').val()
	var monthStr;
    if (!find_month) {
    	bootbox.alert("<center><h4>请选择所要查询联合账户的月份</h4></center><br>");
    	return;
    }else{
    	find_month=find_month.replace("年","").replace("月","")
    	monthStr=$('#find_month').val().replace("年","/").replace("月","/")+"/01";
    }
    
    var monthDate = new Date(monthStr);
    var month= monthDate.getMonth()+1;
    
	var find_name = $('#find_name').val()
	var find_code = $('#find_code').val()
	

	var sel="customer_code,customer_name,sum(nvl(start_money,0)) start_money,sum(nvl(end_money,0)) end_money,sum(nvl(chg_money,0)) chg_money,sum(nvl(del_money,0)) del_money";
	var froms="(select x2.acc_name customer_name,x2.chg_account_no customer_code,0 as start_money,0 as end_money,0 as chg_money,x1.money as del_money"+
			" from (select sum(sse.money) money,b.rel_chg_account_id"+
  			" from gas_report_sse_new sse"+
  			" inner join gas_ctm_archive a on sse.customer_code = a.customer_code"+
  			" inner join gas_chg_account b on a.ctm_archive_id = b.ctm_archive_id"+
  			" where 1=1"+(find_area?("and sse.area_id='"+find_area+"' "):"")+" and sse.trade_date between add_months(to_date('"+find_month+"26','yyyymmdd'),-1) and to_date('"+find_month+"26','yyyymmdd') and sse.customer_kind = '9' and b.rel_chg_account_id is not null group by b.rel_chg_account_id"+
			" ) x1,gas_chg_account x2"+
			" where x1.rel_chg_account_id=x2.chg_account_id"+
			" union all"+
			" select customer_name,customer_code,st as start_money,en as end_money,0 as chg_money,0 as del_money"+
			" from(select customer_code,customer_name,sum(st_temp) st,sum(en_temp) en"+
			" from (select balance,customer_code,customer_name,area_id,balance_date,report_month,"+
			" (case when report_month='"+(month-1)+"' then balance  else 0 end) st_temp,"+
			" (case when report_month='"+month+"' then balance else 0 end) en_temp"+ 
			" from gas_report_ljye_new where account_type='1'"+(find_area?("and area_id='"+find_area+"' "):"")+ ")"+
			" group by customer_code,customer_name)"+
			" union all"+
			" select acc_name customer_name,chg_account_no customer_code,0 as start_money,0 as end_money,sum(chg_money)  as chg_money,0 as del_money"+
			" from (select chgacc.acc_name,chgacc.chg_account_no,detail.money chg_money"+
			" from gas_chg_account chgacc"+
			" left join gas_chg_account chgacc2 on chgacc.chg_account_id=chgacc2.rel_chg_account_id"+
			" inner join (select * from gas_ctm_archive where customer_kind='9' "+(find_area?("and area_id='"+find_area+"' "):"")+ ") arch on arch.ctm_archive_id=chgacc2.ctm_archive_id"+
			" left join (select * from gas_chg_gas_detail where created_time>add_months(to_date('"+find_month+"26','yyyymmdd'),-1) and created_time<to_date('"+find_month+"26','yyyymmdd')) detail on arch.customer_code=detail.customer_code"+
			" ) group by chg_account_no,acc_name)"; 
	
	
	
	var wheres="1=1 "+ (find_code?("and customer_code='"+find_code+"' "):"")+(find_name?("and customer_name like '%"+find_name+"%'"):"")+"group by customer_code,customer_name";

	var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
	var params = {
		"cols": sel,
		"froms": froms,
		"wheres": wheres,
		"page": true,
		"limit": 50
	}
    
    xw.setRestURL(paramurl+encodeURIComponent(JSON.stringify(params)));
    xw.update();
})
$("#find_button2").click(function(){
	var find_area = $('#find_area2').val()
    if (!find_area) {
    	bootbox.alert("<center><h4>请选择非联合账户的供气区域</h4></center><br>");
    	return;
    }else if(find_area=="1"){
    	find_area="";
    }
    var find_month = $('#find_month2').val()
    var monthStr;
    if (!find_month) {
    	bootbox.alert("<center><h4>请选择所要查询非联合账户的月份</h4></center><br>");
    	return;
    }else{
    	find_month=find_month.replace("年","").replace("月","")
    	monthStr=$('#find_month2').val().replace("年","/").replace("月","/")+"/01";
    }
    var monthDate = new Date(monthStr);
    var month= monthDate.getMonth()+1;
    console.log(month)
	var find_name = $('#find_name2').val()
	var find_code = $('#find_code2').val()
	var find_type = $('#find_type').val()
	var find_gastype = $('#find_gastype').val()

	var sel="customer_code,customer_name,customer_type,sum(nvl(start_money,0)) start_money,sum(nvl(end_money,0)) end_money,sum(nvl(chg_money,0)) chg_money,sum(nvl(del_money,0)) del_money";
	var froms=
			"(select customer_code,customer_name,customer_type,sum(nvl(start_money,0)) start_money,sum(nvl(end_money,0)) end_money,sum(nvl(chg_money,0)) chg_money,sum(nvl(del_money,0)) del_money"+ 
    		" from (select a.customer_code, a.customer_name, a.customer_type, 0 as start_money,0 as end_money,0 as del_money ,detail.money chg_money"+
    		" from gas_ctm_archive a"+
    		" left join gas_chg_account c on c.ctm_archive_id=a.ctm_archive_id"+
    		" left join (select * from gas_chg_gas_detail where created_time>add_months(to_date('"+find_month+"26','yyyymmdd'),-1) and created_time<to_date('"+find_month+"26','yyyymmdd')) detail on a.customer_code=detail.customer_code"+
    		" where a.customer_kind='9' "+(find_area?("and a.area_id='"+find_area+"' "):"")+ " and c.account_type='0' and c.rel_chg_account_id is null )"+
    		" group by customer_code,customer_name,customer_type"+
    		" union all"+
    		" select customer_code,customer_name,customer_type,sum(nvl(start_money,0)) start_money,sum(nvl(end_money,0)) end_money,0 as chg_money,sum(nvl(del_money,0)) del_money"+
    		" from (select a.customer_code, (case when b.customer_name is null then a.customer_name else b.customer_name end) customer_name, (case when b.customer_type is null then a.customer_type else b.customer_type end) customer_type, 0 as start_money,0 as end_money,b.money del_money"+
    		" from gas_ctm_archive a"+
    		" left join (select * from gas_report_sse_new where customer_kind='9' "+(find_area?("and area_id='"+find_area+"' "):"")+ " and trade_date between add_months(to_date('"+find_month+"26','yyyymmdd'),-1) and to_date('"+find_month+"26','yyyymmdd')) b on a.customer_code=b.customer_code"+
    		" left join gas_chg_account c on c.ctm_archive_id=a.ctm_archive_id"+ 
    		" where a.customer_kind='9' "+(find_area?("and a.area_id='"+find_area+"' "):"")+ " and c.account_type='0' and c.rel_chg_account_id is null )"+
    		" group by customer_code,customer_name,customer_type"+
			" union all"+
			" select customer_code,customer_name,customer_type,st as start_money,en as end_money,0 as chg_money,0 as del_money"+
			" from(select customer_code,customer_name,customer_type,sum(st_temp) st,sum(en_temp) en"+
			" from (select balance,customer_code,customer_name,area_id,balance_date,report_month,customer_type,"+
			" (case when report_month='"+(month-1)+"' then balance  else 0 end) st_temp,"+
			" (case when report_month='"+month+"' then balance else 0 end) en_temp"+  
			" from gas_report_ljye_new where account_type='0' "+(find_area?("and area_id='"+find_area+"' "):"")+ " and customer_kind='9') group by customer_code,customer_name,customer_type))";
	var wheres="1=1 "+ (find_code?("and customer_code='"+find_code+"' "):"")+ (find_type?("and customer_type='"+find_type+"' "):"")+(find_name?("and customer_name like '%"+find_name+"%'"):"")+" group by customer_code,customer_name,customer_type";

	var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
	var params = {
		"cols": sel,
		"froms": froms,
		"wheres": wheres,
		"page": true,
		"limit": 50
	}
    
    xw1.setRestURL(paramurl+encodeURIComponent(JSON.stringify(params)));
    xw1.update();
})
