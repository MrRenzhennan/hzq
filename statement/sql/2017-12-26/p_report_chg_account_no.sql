create or replace PROCEDURE          "P_REPORT_DAY_CHG_ACCOUNT_NO"  AS 
    v_job_start date;--job 开始时间
    v_second number;--耗时
    v_jobid varchar2(20);--jobid
    v_msg varchar2(255);--消息
    v_sql_count int;--影响数
    v_proc varchar2(20);
    v_num int;

    tmp_table varchar2(1000);

begin
    v_job_start := SYSDATE;  
    v_sql_count:=0;
    v_proc:='gas_report_ysl_new';
    v_sql_count:=0;
	v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:='gas_report_ysl_new';
    --gas_report_ysl_new
    for m in (
        select a.*,d.CHG_ACCOUNT_NO,d.acc_name 
        from gas_report_ysl_new a 
            left join gas_ctm_archive b on a.customer_code=b.customer_code
            left join gas_chg_account c on c.ctm_archive_id=b.ctm_archive_id
            left join gas_chg_account d on d.CHG_ACCOUNT_ID=c.REL_CHG_ACCOUNT_ID
        where a.REL_CHG_ACCOUNT_NO is null and d.CHG_ACCOUNT_NO is not null
    ) loop
        update gas_report_ysl_new set REL_CHG_ACCOUNT_NO=m.CHG_ACCOUNT_NO,REL_CHG_ACCOUNT_NAME=m.acc_name
        where YSL_ID=m.YSL_ID and customer_code=m.customer_code;
        
        if  SQL%ROWCOUNT >0 then 
            v_sql_count:=v_sql_count+SQL%ROWCOUNT;
        end if;
        
    end loop;
    
    if v_sql_count>0 then
        v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
        v_msg:=v_msg || '共' || v_sql_count || '行更新' || ',耗时'|| TRUNC(v_second, 2) || '秒';
        dbms_output.put_line(v_msg);
    end if;
    
    commit;    
          
    --gas_report_sse_new
    v_sql_count:=0;
	v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:='gas_report_sse_new';
    v_proc:='gas_report_sse_new';
    for m in (
        select a.*,d.CHG_ACCOUNT_NO,d.acc_name 
        from gas_report_sse_new a 
            left join gas_ctm_archive b on a.customer_code=b.customer_code
            left join gas_chg_account c on c.ctm_archive_id=b.ctm_archive_id
            left join gas_chg_account d on d.CHG_ACCOUNT_ID=c.REL_CHG_ACCOUNT_ID
        where a.REL_CHG_ACCOUNT_NO is null and d.CHG_ACCOUNT_NO is not null
    ) loop
        update gas_report_sse_new set REL_CHG_ACCOUNT_NO=m.CHG_ACCOUNT_NO,REL_CHG_ACCOUNT_NAME=m.acc_name
        where sse_id=m.sse_id;
        if  SQL%ROWCOUNT >0 then 
            v_sql_count:=v_sql_count+SQL%ROWCOUNT;
        end if;
    end loop;
    if v_sql_count>0 then
        v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
        v_msg:=v_msg || '共' || v_sql_count || '行更新' || ',耗时'|| TRUNC(v_second, 2) || '秒';
        dbms_output.put_line(v_msg);
    end if;
    
    commit; 
    
    exception 
          when others then
            DBMS_OUTPUT.PUT_LINE(SQLCODE||'---'||SQLERRM);
          rollback;

end;