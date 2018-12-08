create or replace PROCEDURE P_REPORT_HOUR_CLEAR  (p_date in Date) AS 
    v_job_start date;--job 开始时间
    v_second number;--耗时
    v_jobid varchar2(20);--jobid
    v_msg varchar2(255);--消息
    v_sql_count int;--影响数
    v_num int;
    
    prev_report_year int;--上一年
    prev_report_month int;
    cur_report_year int;--当次交易年    
    cur_report_month int;--当次交易月 
    
    prev_year_balance number(10,2);--上年余额 
    prev_year_balance_yet  number(10,2);--上年陈欠还有多少
    
    trade_before_balance  number(10,2);--当次交易前余额
    
    clear_prev_money number(10,2);--每笔交易清陈欠
    clear_cur_money number(10,2);--每笔交易清本年
    clear_prev_money_sum  number(10,2);--已清陈欠总额
    clear_all_money number(10,2);--每笔交易清算总额
    new_arrears_money number(10,2);--每笔交易新增欠费

begin
    /**
    欠费统计 欠气费，清欠费，累计清欠费，清本年，累计清本年，清陈欠，累计清陈欠，本月新增欠费额，欠费户数，户均欠费，呆帐户数，呆帐金额，坏帐户数，坏帐金额
    **/
    v_job_start := SYSDATE;  
    v_sql_count:=0;
    
    prev_year_balance:=0;
    
    for m in (
        select gasfee_atl_id,customer_code,trade_type,money,last_money,trade_date from gas_act_gasfee_atl 
        where clr_tag='2' 
            and trade_type not in (' ','ICR')  
            and last_money is not null 
            and money<>0
            and trade_date>=trunc(p_date) and trade_date<trunc(p_date+1)
        order by trade_date,GASFEE_ATL_ID
    ) loop
        /**
        计费更正            BLL BLLCORRECT 
        换表剩余气量转余额    BLL CHANGEMBLL
        联合账户子账户扣费    BLL LHZHZZHKF
                            BLL LHZHZZHYEKH
                            BLL REMOVEMBLL
        追补                BLL ZBBLL
        计费                BLL
        收费差错  CHG	BLLCORRECT
        串户收费 CHG	CCHG
        收费金额变更 CHG	CHGMONEYERROR
        收费金额变更冲正 CHG	CHGMONEYERRORCOR
        银行缴费 CHG	ICBANKCHG
        IC卡银行账户余额转换 CHG	ICBANKTRANSMONEY
        收费金额 CHG	ICCHG
        IC卡账户余额转换 CHG	ICTRANSMONEY
        IC卡补气补量 CHG	ICUSECOMPLEMENT
        IC卡购气金额 CHG	ICUSEMONEY
        联合账户划款 CHG	LHZHKH
        联合账户子账户扣费 CHG	LHZHZZHKF
        普表收费 CHG	METERCHG
        串户扣费 CHG	RCHG
        CHG	
        
        账户余额结转 CHG	ZHYEJZ
        收费金额变更冲正 COR	CHGMONEYERRORCOR
        IC卡银行冲正 COR	ICBANKCORµ
        IC卡收费冲正 COR	ICCOR
        IC卡写卡冲正 COR	ICCORICR
        COR	METERBANKCOR
        
        计费更正 ICB	BLLCORRECT
        虚拟余额清零 ICB	ICBCLEAR
        ICB	
        IC卡退款 RFD	ICRFD
        IC卡退款入账 RFD	ICRFDBALANCE
        退款领取 RFD	RFDRESIVE
        **/
        clear_all_money:=0;
        clear_prev_money:=0;
        clear_cur_money:=0;
        clear_prev_money_sum:=0;
        prev_year_balance_yet:=0;
        new_arrears_money:=0;
        
        cur_report_year:=get_report_year(m.trade_date);
        --上一年
        prev_report_year:=cur_report_year-1;
        --交费前余额
        trade_before_balance:=m.last_money-m.money;
        
        if to_char(m.trade_date,'dd')=26 then
            cur_report_month:=get_report_month(m.trade_date-1);
        end if;
        --计算交易金额 包括 交易类型判断
        --如果交易前余额小于等于0或者不同交易类型 ，需要清欠，要区分欠款是否包含陈欠
        if trade_before_balance<0 and m.money>0 then
        
            --计算此次交易清欠总额
            if abs(trade_before_balance)>=abs(m.money) then
                clear_all_money:=abs(m.money);
            end if;
            if abs(trade_before_balance)<abs(m.money) then
                clear_all_money:=abs(m.money)-abs(trade_before_balance);
            end if;
            
            --计算年初欠费额
            select balance into prev_year_balance from gas_report_ljye_new 
            where report_year=prev_report_year and report_month=12 and customer_code=m.customer_code;
            
            if prev_year_balance<0 then  
                --计算已清陈欠额 注意已清日期要小于m.trade_date  
                select sum(clear_prev_money) into clear_prev_money_sum from gas_report_clear
                where customer_code=m.customer_code and report_year=cur_report_year and trade_date<m.trade_date;
                prev_year_balance_yet:=abs(prev_year_balance)-abs(clear_prev_money_sum);
                if prev_year_balance_yet>0 then
                    --清陈欠
                    if clear_all_money-prev_year_balance_yet>0 then
                        clear_prev_money:=prev_year_balance_yet;
                    else                         
                        clear_prev_money:=clear_all_money;
                    end if;
                    clear_cur_money:=(clear_all_money-clear_prev_money);
                end if;
            else
                clear_cur_money:=clear_all_money;
            end if;
                
            
        end if;
        --计算新增欠费
        if m.money<0 then 
            if trade_before_balance<=0 then            
                new_arrears_money:=m.money;
            else                     
                new_arrears_money:=m.money+trade_before_balance;
            end if;            
        end if;
        
        
        insert into gas_report_clear (clear_id,trade_type,clear_date,clear_cur_money,report_year,report_month,clear_prev_money,
            new_arrears_money,customer_code,clear_all_money) values
            (m.gasfee_atl_id,m.trade_type,sysdate,0,cur_report_year,cur_report_month,clear_prev_money,
            new_arrears_money,m.customer_code,clear_all_money);
        -- 计算新增欠费额
        --dbms_output.put_line(cur_normal_num || '-' || cur_stop_num  || '-' || cur_long_no_use_num || '-'  || cur_no_use_num || '-' || cur_dismantle_num || '-' || cur_delete_num);
        if  SQL%ROWCOUNT >0 then 
            v_sql_count:=v_sql_count+SQL%ROWCOUNT;
        end if;
        
    end loop;

    commit;   

	v_second := (SYSDATE - v_job_start) * 24 * 60 * 60;
    v_msg:=v_msg || '共' || v_sql_count || '行生成' || ',耗时'|| TRUNC(v_second, 2) || '秒';

    dbms_output.put_line(v_msg);
    exception 
          when others then
            DBMS_OUTPUT.PUT_LINE(SQLCODE||'---'||SQLERRM);
          rollback;



end;