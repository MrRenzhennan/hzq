create or replace PROCEDURE P_REPORT_DAY_YSL_ALL (p_date in Date) AS 
 v_job_start date;--job 开始时间
    v_second number;--耗时
    v_jobid varchar2(20);--jobid
    v_msg varchar2(255);--消息
    v_sql_count int;--影响数
    v_proc varchar2(20);   
    
    v_start_date date;
    v_end_date date;
    v_month varchar2(20);
    v_year varchar2(20);
begin
    /**
    应收量静态数据生成,关联gas_report_ysl自动去重
    每日3:30点生成前一天的
    **/

	v_job_start := SYSDATE;   
    v_proc:='vw_report_fjm_ysl';
    v_jobid:=to_char(sysdate,'yyyyMMddHH24miss');
    
    v_year:=get_report_year(p_date);
    v_month:=get_report_month(p_date);
    --处理26日,落下25日一天的
    if to_char(p_date,'dd')=26 then
        v_month:=get_report_month(p_date-1);
    end if;
    v_end_date:=to_date(v_year || '-' || v_month || '-26');
    v_start_date:=add_months(v_end_date,-1);
    insert into gas_report_ysl (
        gas,gas_type_id,area_id,trade_date,price,customer_code,customer_name,
        customer_type,customer_kind,unbolt_time,recover_gas,correct_gas,agree_gas,
        report_year,report_month,ysl_id,price_version,account_type,sse,
        serviceper_id,countper_id,book_id,batch_id
    )
    select 
        x.gas,x.gas_type_id,x.area_id,x.dt,x.price1,x.customer_code,x.customer_name,
        x.customer_type,x.customer_kind,x.unbolt_time,x.rco_gas,x.bco_gas,'0' agree_gas,
        case when x.dt is not null then get_report_year(x.dt) else '' end report_year,
        case when x.dt is not null then get_report_month(x.dt) else '' end report_month,
        x.gasfee_atl_id,x.price_version,x.account_type,x.gas*x.price1 sse,
        x.serviceper_id,countper_id,x.book_id,v_jobid batch_id --jobid
    from (
        select y.*,row_number() over (partition by y.customer_code,y.dt,y.gasfee_atl_id order by y.created_time) code 
        from (
            select sse.*,mrdlog.created_time,book.book_id,NVL(MRDLOG.SERVICEPER_ID, BOOK.SERVICEPER_ID) SERVICEPER_ID ,NVL(MRDLOG.countper_ID,BOOK.countper_ID) countper_ID
            from (
                select * from vw_report_fjm_ysl where dt>=v_start_date and dt<v_end_date
            ) sse 
            inner join gas_ctm_archive arch on sse.customer_code = arch.customer_code 
            inner join gas_mrd_book book on arch.book_id = book.book_id 
            left join gas_mrd_log mrdlog on mrdlog.ctm_archive_id = arch.ctm_archive_id and mrdlog.created_time > sse.dt
        ) y
    ) x 
    where x.code = 1 and not exists(
        select ysl_id from gas_report_ysl where ysl_id=x.gasfee_atl_id
    );
    v_sql_count:=SQL%ROWCOUNT;
	v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:=v_proc || '共' || v_sql_count || '行生成' || ',耗时'|| TRUNC(v_second, 2) || '秒';

    insert into gas_report_job_log (log_id,job_id,JOB_VIEW,log_msg,job_rowcount) values (sys_guid(),v_jobid,v_proc,v_msg,v_sql_count);

    dbms_output.put_line(v_msg);
    --vw_report_jm_sse

	v_job_start := SYSDATE;
    v_proc:='vw_report_jm_ysl';
    v_jobid:=to_char(sysdate,'yyyyMMddHH24miss');
    insert into gas_report_ysl (
        gas,gas_type_id,area_id,trade_date,price,customer_code,customer_name,
        customer_type,customer_kind,unbolt_time,recover_gas,correct_gas,agree_gas,
        report_year,report_month,ysl_id,price_version,account_type,sse,
        serviceper_id,countper_id,book_id,batch_id
    )
    select 
        x.gas,x.gas_type_id,x.area_id,x.dt,x.price1,x.customer_code,x.customer_name,
        x.customer_type,x.customer_kind,x.unbolt_time,x.rco_gas,x.bco_gas,'0' agree_gas,
        case when x.dt is not null then get_report_year(x.dt) else '' end report_year,
        case when x.dt is not null then get_report_month(x.dt) else '' end report_month,
        x.gasfee_atl_id,x.price_version,x.account_type,x.gas*x.price1 sse,
        x.serviceper_id,countper_id,x.book_id,v_jobid batch_id --jobid
    from (
        select y.*,row_number() over (partition by y.customer_code,y.dt,y.gasfee_atl_id order by y.created_time) code 
        from (
            select sse.*,mrdlog.created_time,book.book_id,NVL(MRDLOG.SERVICEPER_ID, BOOK.SERVICEPER_ID) SERVICEPER_ID ,NVL(MRDLOG.countper_ID,BOOK.countper_ID) countper_ID
            from (
                select *
                from vw_report_jm_ysl where dt>=v_start_date and dt<v_end_date
            ) sse 
            inner join gas_ctm_archive arch on sse.customer_code = arch.customer_code 
            inner join gas_mrd_book book on arch.book_id = book.book_id 
            left join gas_mrd_log mrdlog on mrdlog.ctm_archive_id = arch.ctm_archive_id and mrdlog.created_time > sse.dt
        ) y
    ) x 
    where x.code = 1 and not exists(
        select ysl_id from gas_report_ysl where ysl_id=x.gasfee_atl_id
    );
    
    --更新新增字段
    update gas_report_ysl a set (factory_id,meter_type_id,meter_flow_id,meter_id,meter_kind)=(
        select 
            meter.factory_id,
            meter.meter_type_id,
            meter.flow_range,
            meter.meter_id,
            meter.meter_kind
        from gas_ctm_archive arch
            inner join (
                select ROW_NUMBER() OVER(PARTITION BY a.ctm_archive_id ORDER BY a.ctm_meter_id DESC) rn,a.*
                from gas_ctm_meter a
                where a.meter_user_state <> '99'
            ) cm
                on arch.ctm_archive_id = cm.ctm_archive_id and cm.rn=1
            inner join gas_mtr_meter meter
                on cm.meter_id = meter.meter_id
        where arch.customer_code=a.customer_code
    ) where a.meter_id is null and a.trade_date>= v_start_date and a.trade_date<v_end_date;
    
    --更新联合账户
    update gas_report_ysl a set REL_CHG_ACCOUNT_NO=(
        select CHG_ACCOUNT_NO from gas_chg_account
        where CHG_ACCOUNT_ID = (
            select REL_CHG_ACCOUNT_ID from gas_chg_account 
            where ctm_archive_id=(
                select ctm_archive_id from gas_ctm_archive where customer_code=a.customer_code
            )
        ) and REL_CHG_ACCOUNT_NO is null
    ) where a.trade_date>= v_start_date and a.trade_date<v_end_date;
    
    update gas_report_ysl a set REL_CHG_ACCOUNT_NAME=(
        select acc_name from gas_chg_account 
        where CHG_ACCOUNT_NO=a.REL_CHG_ACCOUNT_NO
    ) where a.trade_date>= v_start_date and a.trade_date<v_end_date;
    
    v_sql_count:=SQL%ROWCOUNT;
	v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:=v_start_date || '~' || v_end_date;
    v_msg:='生成' || v_msg || ',' || v_proc || '共' || v_sql_count || '行生成' || ',耗时'|| TRUNC(v_second, 2) || '秒';

    insert into gas_report_job_log (log_id,job_id,JOB_VIEW,log_msg,job_rowcount) values (sys_guid(),v_jobid,v_proc,v_msg,v_sql_count);

    dbms_output.put_line(v_msg);

    commit;
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE(SQLCODE||'---'||SQLERRM);
        ROLLBACK;

end;

create or replace PROCEDURE          "P_REPORT_DAY_YSL_ALL_JOB"  AS 
    cur_date date;

begin
    /**
    实收静态数据生成,关联gas_report_sse自动去重
    每日4:00点生成前一天的
    **/
    cur_date:=sysdate;
	"P_REPORT_DAY_YSL_ALL"(cur_date); 
    dbms_output.put_line('生成' || cur_date || '月');

end;

create or replace PROCEDURE P_REPORT_DAY_SSE_ALL  (p_date in Date) AS 
    v_job_start date;--job 开始时间
    v_second number;--耗时
    v_jobid varchar2(20);--jobid
    v_msg varchar2(255);--消息
    v_sql_count int;--影响数
    v_proc varchar2(20);    
    
    v_start_date date;
    v_end_date date;
    v_month varchar2(20);
    v_year varchar2(20);
begin
    /**
    实收静态数据生成,关联gas_report_sse自动去重
    每日4:00点生成前一天的
    **/

	v_job_start := SYSDATE;   
    v_proc:='vw_report_fjm_sse';
    v_jobid:=to_char(sysdate,'yyyyMMddHH24miss');
    
    v_year:=get_report_year(p_date);
    v_month:=get_report_month(p_date);
    --处理26日,落下25日一天的
    if to_char(p_date,'dd')=26 then
        v_month:=get_report_month(p_date-1);
    end if;
    
    v_end_date:=to_date(v_year || '-' || v_month || '-26');
    v_start_date:=add_months(v_end_date,-1);
    
    insert into gas_report_sse (
        money,area_id,trade_date,gas_type_id,price,customer_name,
        customer_code,customer_kind,sse_id,unbolt_time,recover_money,
        correct_money,agree_money,report_year,report_month,price_version,
        customer_type,account_type,ysl,serviceper_id,countper_id,book_id,batch_id
    )
    select 
        x.money,x.area_id,x.dt,x.gas_type_id,x.price1,x.customer_name,
        x.customer_code,x.customer_kind,x.gasfee_atl_id,x.unbolt_time,x.rco_money,
        x.bco_money,'0' agree_money,--wu
        case when x.dt is not null then get_report_year(x.dt) else '' end report_year,
        case when x.dt is not null then get_report_month(x.dt) else '' end report_month,
        x.price_version,x.customer_type,x.account_type,
        case when x.price1=0 then 0 when x.price1 is null then 0 else ROUND(x.money/x.price1,0) end ysl,--wu
        x.serviceper_id,countper_id,x.book_id,v_jobid batch_id --jobid
    from (
        select y.*,row_number() over (partition by y.customer_code,y.dt order by y.created_time) code
        from (
            select sse.*,mrdlog.created_time,book.book_id,NVL(MRDLOG.SERVICEPER_ID, BOOK.SERVICEPER_ID) SERVICEPER_ID ,NVL(MRDLOG.countper_ID,BOOK.countper_ID) countper_ID
            from (
                select * from vw_report_fjm_sse where money<>0 and dt>=v_start_date and dt<v_end_date
            ) sse 
            left join gas_ctm_archive arch on sse.customer_code = arch.customer_code 
            left join gas_mrd_book book on arch.book_id = book.book_id 
            left join gas_mrd_log mrdlog on mrdlog.ctm_archive_id = arch.ctm_archive_id and mrdlog.created_time > sse.dt
        ) y 
    ) x 
    where x.code = 1 and not exists(
        select sse_id from gas_report_sse where sse_id=x.gasfee_atl_id and money=x.money
    );
    v_sql_count:=SQL%ROWCOUNT;
	v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:=v_proc || '共' || v_sql_count || '行生成' || ',耗时'|| TRUNC(v_second, 2) || '秒';

    insert into gas_report_job_log (log_id,job_id,JOB_VIEW,log_msg,job_rowcount) values (sys_guid(),v_jobid,v_proc,v_msg,v_sql_count);

    dbms_output.put_line(v_msg);
    --vw_report_jm_sse

	v_job_start := SYSDATE;
    v_proc:='vw_report_jm_sse';
    v_jobid:=to_char(sysdate,'yyyyMMddHH24miss');
    insert into gas_report_sse (
        money,area_id,trade_date,gas_type_id,price,customer_name,
        customer_code,customer_kind,sse_id,unbolt_time,recover_money,
        correct_money,agree_money,report_year,report_month,price_version,
        customer_type,account_type,ysl,serviceper_id,countper_id,book_id,batch_id
    )
    select 
        x.money,x.area_id,x.dt,x.gas_type_id,x.price1,x.customer_name,
        x.customer_code,x.customer_kind,x.gasfee_atl_id,x.unbolt_time,
        x.rco_money,x.bco_money,'0' agree_money,--wu
        case when x.dt is not null then get_report_year(x.dt) else '' end report_year,
        case when x.dt is not null then get_report_month(x.dt) else '' end report_month,
        x.price_version,x.customer_type,x.account_type,
        case when x.price1=0 then 0 when x.price1 is null then 0 else ROUND(x.money/x.price1,0) end ysl,--wu
        x.serviceper_id,countper_id,x.book_id,v_jobid batch_id --jobid
    from (
        select y.*,row_number() over (partition by y.customer_code,y.dt order by y.created_time) code 
        from (
            select sse.*,mrdlog.created_time,book.book_id,NVL(MRDLOG.SERVICEPER_ID, BOOK.SERVICEPER_ID) SERVICEPER_ID ,NVL(MRDLOG.countper_ID,BOOK.countper_ID) countper_ID
            from (
                select *
                from vw_report_jm_sse where money<>0  and dt>= v_start_date and dt<v_end_date
            ) sse 
            left join gas_ctm_archive arch on sse.customer_code = arch.customer_code 
            left join gas_mrd_book book on arch.book_id = book.book_id 
            left join gas_mrd_log mrdlog on mrdlog.ctm_archive_id = arch.ctm_archive_id and mrdlog.created_time > sse.dt
        ) y
    ) x 
    where x.code = 1 and not exists(
        select sse_id from gas_report_sse where sse_id=x.gasfee_atl_id and money=x.money
    );
    
    --更新新增字段
    update gas_report_sse a set (factory_id,meter_type_id,meter_flow_id,meter_id,meter_kind)=(
        select 
            meter.factory_id,
            meter.meter_type_id,
            meter.flow_range,
            meter.meter_id,
            meter.meter_kind
        from gas_ctm_archive arch
            inner join (
                select ROW_NUMBER() OVER(PARTITION BY a.ctm_archive_id ORDER BY a.ctm_meter_id DESC) rn,a.*
                from gas_ctm_meter a
            ) cm
                on arch.ctm_archive_id = cm.ctm_archive_id and cm.rn=1
            inner join gas_mtr_meter meter
                on cm.meter_id = meter.meter_id
        where cm.meter_user_state = '01' and arch.customer_code=a.customer_code
    ) where a.meter_id is null and a.trade_date>= v_start_date and a.trade_date<v_end_date;

    --更新联合账户
    update gas_report_sse a set REL_CHG_ACCOUNT_NO=(
        select CHG_ACCOUNT_NO from gas_chg_account
        where CHG_ACCOUNT_ID = (
            select REL_CHG_ACCOUNT_ID from gas_chg_account 
            where ctm_archive_id=(
                select ctm_archive_id from gas_ctm_archive where customer_code=a.customer_code
            )
        ) and REL_CHG_ACCOUNT_NO is null
    ) where a.trade_date>= v_start_date and a.trade_date<v_end_date;
    
    update gas_report_sse a set REL_CHG_ACCOUNT_NAME=(
        select acc_name from gas_chg_account 
        where CHG_ACCOUNT_NO=a.REL_CHG_ACCOUNT_NO
    ) where a.trade_date>= v_start_date and a.trade_date<v_end_date;
    

    v_sql_count:=SQL%ROWCOUNT;
	v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:=v_start_date || '~' || v_end_date;
    v_msg:='生成' || v_msg || ',' || v_proc || '共' || v_sql_count || '行生成' || ',耗时'|| TRUNC(v_second, 2) || '秒';

    insert into gas_report_job_log (log_id,job_id,JOB_VIEW,log_msg,job_rowcount) values (sys_guid(),v_jobid,v_proc,v_msg,v_sql_count);

    dbms_output.put_line(v_msg);
    commit;
    EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE(SQLCODE||'---'||SQLERRM);
            ROLLBACK;
end;

create or replace PROCEDURE          "P_REPORT_DAY_SSE_ALL_JOB"  AS 
    cur_date date;

begin
    /**
    实收静态数据生成,关联gas_report_sse自动去重
    每日4:00点生成前一天的
    **/
    cur_date:=sysdate;
	"P_REPORT_DAY_SSE_ALL"(cur_date); 
    dbms_output.put_line('生成' || cur_date || '月');

end;

create or replace PROCEDURE P_REPORT_DAY_LJYE_ALL (p_date in Date) AS 
    v_job_start date;--job 开始时间
    v_second number;--耗时
    v_jobid varchar2(20);--jobid
    v_msg varchar2(255);--消息
    v_sql_count int;--影响数
    v_proc varchar2(20);
    v_start_date date;
    v_end_date date;
    v_month varchar2(20);
    v_year varchar2(20);
    
begin
    /**
    累计余额静态数据生成
    每日3点生成当月的,前端看着差一天
    **/

	v_job_start := SYSDATE;   
    v_proc:='vw_report_lhzh_ljye';
    v_jobid:=to_char(sysdate,'yyyyMMddHH24miss');
    v_year:=get_report_year(p_date);
    v_month:=get_report_month(p_date);
    
    --处理26日,落下25日一天的
    if to_char(p_date,'dd')=26 then
        v_month:=get_report_month(p_date-1);
    end if;
    v_end_date:=to_date(v_year || '-' || v_month || '-26');
    v_start_date:=add_months(v_end_date,-1);
    
    --删除上个月的
    delete from gas_report_ljye where report_year=v_year and report_month=v_month;
    v_sql_count:=SQL%ROWCOUNT;
	v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:=v_start_date || '至' || v_end_date;
    v_msg:=v_msg || '共' || v_sql_count || '行被删除' || ',耗时'|| TRUNC(v_second, 2) || '秒';
    
    dbms_output.put_line(v_msg);
    
    insert into gas_report_ljye (
        balance,
        customer_code,
        customer_name,
        gas_type_id,
        area_id,
        balance_date,
        unbolt_time,
        batch_id,
        ljye_id,
        customer_type,
        customer_kind,
        account_type,
        report_year,
        report_month
    )
    select 
        x.last_money,
        x.chg_account_no,
        x.acc_name,
        x.gas_type_id,
        x.area_id,
        x.trade_date,
        x.unbolt_time,
        v_jobid batch_id, --jobid
        x.CHG_ACCOUNT_ID ljye_id,
        x.customer_type,
        x.customer_kind,
        x.account_type,
        v_year report_year,
        v_month report_month
    from 
        (
            select row_number() over(partition by chg_account_no order by rn) rn1,a.* 
            from vw_report_lhzh_ljye a
            where a.trade_date < v_end_date 
        ) x
    where x.rn1=1 and not exists(
        select ljye_id from gas_report_ljye where ljye_id=x.CHG_ACCOUNT_ID and report_year=v_year and report_month=v_month
    );
    v_sql_count:=SQL%ROWCOUNT;
	v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:=v_proc || '共' || v_sql_count || '行生成' || ',耗时'|| TRUNC(v_second, 2) || '秒';

    insert into gas_report_job_log (log_id,job_id,JOB_VIEW,log_msg,job_rowcount) values (sys_guid(),v_jobid,v_proc,v_msg,v_sql_count);
    
    dbms_output.put_line(v_msg);
    --vw_report_jm_sse

	v_job_start := SYSDATE;
    v_proc:='vw_report_flhzh_ljye';
    v_jobid:=to_char(sysdate,'yyyyMMddHH24miss');
    insert into gas_report_ljye (
        balance,
        customer_code,
        customer_name,
        gas_type_id,
        area_id,
        balance_date,
        unbolt_time,
        batch_id,
        ljye_id,
        customer_type,
        customer_kind,
        account_type,
        report_year,
        report_month,
        customer_state,
        serviceper_id,
        countper_id,
        book_id
    )
    select 
        x.last_money,
        x.customer_code,
        x.customer_name,
        x.gas_type_id,
        x.area_id,
        x.trade_date,
        x.unbolt_time,
        v_jobid batch_id, --jobid
        x.ctm_archive_id ljye_id,
        x.customer_type,
        x.customer_kind,
        x.account_type,
        v_year report_year,
        v_month report_month,
        customer_state,
        x.serviceper_id,
        x.countper_id,
        x.book_id
    from (
        select y.*
        from (
            select a.*,mrdlog.created_time,book.book_id,NVL(MRDLOG.SERVICEPER_ID, BOOK.SERVICEPER_ID) SERVICEPER_ID ,NVL(MRDLOG.countper_ID,BOOK.countper_ID) countper_ID
            from (
                select row_number() over(partition by ctm_archive_id order by rn) rn1,b.* 
                from vw_report_flhzh_ljye b
                where b.trade_date < v_end_date 
            ) a 
            inner join gas_ctm_archive arch on a.customer_code = arch.customer_code 
            inner join gas_mrd_book book on arch.book_id = book.book_id 
            left join gas_mrd_log mrdlog on mrdlog.ctm_archive_id = arch.ctm_archive_id and mrdlog.created_time > a.trade_date
        ) y
    ) x 
    where x.rn1 = 1 and not exists(
        select ljye_id from gas_report_ljye where ljye_id=x.ctm_archive_id and report_year=v_year and report_month=v_month
    );

    v_sql_count:=SQL%ROWCOUNT;
	v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:=v_proc || '共' || v_sql_count || '行生成' || ',耗时'|| TRUNC(v_second, 2) || '秒';

    insert into gas_report_job_log (log_id,job_id,JOB_VIEW,log_msg,job_rowcount) values (sys_guid(),v_jobid,v_proc,v_msg,v_sql_count);

    dbms_output.put_line(v_msg);
    commit;
    
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE(SQLCODE||'---'||SQLERRM);
        ROLLBACK;

end;