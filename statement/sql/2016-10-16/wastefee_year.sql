create or replace PROCEDURE          "P_REPORT_DAY_WASTEFEE_YEAR" (p_date in Date) AS  
    v_job_start date;--job 开始时间
    v_second number;--耗时
    v_jobid varchar2(20);--jobid
    v_msg varchar2(255);--消息
    v_sql_count int;--影响数
    v_proc varchar2(100);

    v_report_year number;--本年
    v_report_month number;--本月
    v_report_month_first date;--月初
    v_report_month_next_first date;--下月初
    v_op_action varchar2(50);


    t_qichu_balance number(18,2);--期初余额
    t_qichu_owe number(18,2);--期初欠费
    t_month_money number(18,2);--月计费额
    t_month_count number;--月计费户数
    t_month_charge number(18,2);--月收费额额
    t_month_sse number(18,2);--月实收额
    t_qimo_balance number(18,2);--期末余额
    t_qimo_owe number(18,2);--期末欠费

    t_count number;

begin
    /**
    哈中庆代征城镇垃圾处理费年度统计 每日执行
    **/
    --cur_date:=to_date('2017-08-08','yyyy-MM-dd');--生成截止8月份开栓的
    --cur_date:=to_date('2017-07-08','yyyy-MM-dd');--生成截止7月份开栓的
    v_job_start:=sysdate;
    v_report_year:=to_char(p_date,'yyyy');
    v_report_month:=to_char(p_date,'MM');
    v_report_month_first:=trunc(p_date, 'mm') ;    
    v_report_month_next_first:=add_months(v_report_month_first,1);
    v_jobid:=to_char(sysdate,'yyyyMMddHH24miss');
    v_proc:='gas_report_wastefee_year';
    v_msg:='生成' || v_report_year || '年' || v_report_month || '月,';
    v_msg:=v_msg || '月初' || v_report_month_first || ',下月初' || v_report_month_next_first ;

    --期初余额
    select sum(nvl(last_money,0)) into t_qichu_balance from (
        select ROW_NUMBER() OVER(PARTITION BY a.customer_code ORDER BY a.trade_date DESC) rn,a.* 
        from vm_report_wastefee_ye a 
        where  a.trade_date < v_report_month_first and a.last_money is not null
    ) b
    where b.rn=1 and b.last_money>0 ;
    --获取期初欠费 last_money<0    
    select sum(nvl(last_money,0)) into t_qichu_owe from (
        select ROW_NUMBER() OVER(PARTITION BY a.customer_code ORDER BY a.trade_date DESC) rn,a.* 
        from vm_report_wastefee_ye a 
        where  a.trade_date < v_report_month_first and a.last_money is not null
    ) b
    where b.rn=1 and b.last_money<0;

    --获取月计费额 获取月计费户
    select count(1),sum(money) into t_month_count,t_month_money
    from gas_Act_Wastefee_Atl
    where trade_date between v_report_month_first and v_report_month_next_first and trade_Type='BLL' and money is not null;   
    --获取月收费额
    --select sum(a.money) into t_month_charge 
    --from gas_Act_Wastefee_Atl a -- inner join gas_Biz_Charge_Unit b on a.charge_Unit_Id=b.charge_Unit_Id
    --where a.trade_date between v_report_month_first and v_report_month_next_first 
    --    and a.trade_type in ('CHG','RFD','COR') and a.money is not null;  
     
    select sum(c.money) into t_month_charge 
    from (
        select a.*,nvl(to_date(b.bank_date,'yyyy-MM-dd hh:mi:ss'),a.trade_date) dt from gas_act_wastefee_atl a
        left join gas_chg_waste_bank_face b on a.wastefee_atl_id=b.trade_atl_id
    ) c
    where c.dt >= v_report_month_first and c.dt<v_report_month_next_first
        and c.trade_type in ('CHG','RFD','COR') and c.money is not null ;
    
    --获取月实收额
    --select sum(money) into t_month_sse from vm_Report_Wastefee_Sse 
    --where dt between v_report_month_first and v_report_month_next_first;
    
    select sum(c.money) into t_month_sse 
    from (
        select a.*,nvl(to_date(b.bank_date,'yyyy-MM-dd hh:mi:ss'),a.dt) trade_date 
        from vm_Report_Wastefee_Sse a
            left join gas_chg_waste_bank_face b on a.wastefee_atl_id=b.trade_atl_id
    ) c
    where c.trade_date >= v_report_month_first and c.trade_date<v_report_month_next_first;
    
    
    --获取期末余额 last_money>0
    --select sum(nvl(last_money,0)) into t_qimo_balance 
    --from vm_report_wastefee_ye 
    --where trade_date < v_report_month_next_first and last_money>0 and last_money is not null;
    
    select sum(nvl(last_money,0)) into t_qimo_balance 
    from (
        select ROW_NUMBER() OVER(PARTITION BY a.customer_code ORDER BY a.trade_date DESC) rn,a.* 
        from vm_report_wastefee_ye a 
        where  a.trade_date < v_report_month_next_first and a.last_money is not null
    ) b
    where b.rn=1 and b.last_money>0;
    --获取期末欠费 last_money<0
    --select sum(nvl(last_money,0)) into t_qimo_owe
    --from vm_report_wastefee_ye 
    --where trade_date < v_report_month_next_first and last_money<0 and last_money is not null;
    
    select sum(nvl(last_money,0)) into t_qimo_owe 
    from (
        select ROW_NUMBER() OVER(PARTITION BY a.customer_code ORDER BY a.trade_date DESC) rn,a.* 
        from vm_report_wastefee_ye a 
        where  a.trade_date < v_report_month_next_first and a.last_money is not null
    ) b
    where b.rn=1 and b.last_money<0;
    

    --检测是否存在
    select count(*) into t_count from gas_report_wastefee_year where report_year=v_report_year and report_month=v_report_month;
    if t_count = 0 then
        insert into gas_report_wastefee_year (
            report_year,report_month,qichu_balance,month_money,month_count,month_charge,month_sse,qimo_balance,qimo_owe,qichu_owe
        ) values (
            v_report_year,v_report_month,t_qichu_balance,t_month_money,t_month_count,t_month_charge,t_month_sse,t_qimo_balance,t_qimo_owe,t_qichu_owe
        );
        v_op_action:='插入当月';
    else 
        update gas_report_wastefee_year set 
            qichu_balance=t_qichu_balance,month_money=t_month_money,month_count=t_month_count,month_charge=t_month_charge,
            month_sse=t_month_sse,qimo_balance=t_qimo_balance,qimo_owe=t_qimo_owe,qichu_owe=t_qichu_owe
        where report_year=v_report_year and report_month=v_report_month;
        v_op_action:='修改当月';
    end if;

    insert into gas_report_job_log (log_id,job_id,JOB_VIEW,log_msg,job_rowcount) values (sys_guid(),v_jobid,v_proc,v_msg,v_sql_count);
    commit;
    
    v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:=v_msg || ',共' || SQL%ROWCOUNT || '行更新' || ',耗时'|| TRUNC(v_second, 2) || '秒,' || v_op_action;
    dbms_output.put_line(v_msg);
    


end;