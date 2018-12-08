
    --更新新增字段
    update gas_report_sse_new a set (factory_id,meter_type_id,meter_flow_id,meter_id,meter_kind)=(
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
    update gas_report_sse_new a set REL_CHG_ACCOUNT_NO=(
        select CHG_ACCOUNT_NO from gas_chg_account
        where CHG_ACCOUNT_ID = (
            select REL_CHG_ACCOUNT_ID from gas_chg_account 
            where ctm_archive_id=(
                select ctm_archive_id from gas_ctm_archive where customer_code=a.customer_code
            )
        ) and REL_CHG_ACCOUNT_NO is null
    ) where a.trade_date>= v_start_date and a.trade_date<v_end_date;
    
    update gas_report_sse_new a set REL_CHG_ACCOUNT_NAME=(
        select acc_name from gas_chg_account 
        where CHG_ACCOUNT_NO=a.REL_CHG_ACCOUNT_NO
    ) where a.trade_date>= v_start_date and a.trade_date<v_end_date;
    


    --更新新增字段
    update gas_report_ysl_new a set (factory_id,meter_type_id,meter_flow_id,meter_id,meter_kind)=(
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
    update gas_report_ysl_new a set REL_CHG_ACCOUNT_NO=(
        select CHG_ACCOUNT_NO from gas_chg_account
        where CHG_ACCOUNT_ID = (
            select REL_CHG_ACCOUNT_ID from gas_chg_account 
            where ctm_archive_id=(
                select ctm_archive_id from gas_ctm_archive where customer_code=a.customer_code
            )
        ) and REL_CHG_ACCOUNT_NO is null
    ) where a.trade_date>= v_start_date and a.trade_date<v_end_date;
    
    update gas_report_ysl_new a set REL_CHG_ACCOUNT_NAME=(
        select acc_name from gas_chg_account 
        where CHG_ACCOUNT_NO=a.REL_CHG_ACCOUNT_NO
    ) where a.trade_date>= v_start_date and a.trade_date<v_end_date;
    