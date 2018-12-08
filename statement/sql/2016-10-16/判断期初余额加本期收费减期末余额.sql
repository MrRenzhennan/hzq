
select ccc.*,ddd.* from (
    select aaa.*,bbb.*,aaa.ctm_num+bbb.ctm_num_chu-bbb.ctm_num_mo balance from 
    (
        SELECT SUM(A.MONEY) CTM_NUM,A.customer_code 
        FROM GAS_ACT_WASTEFEE_ATL A 
        WHERE A.TRADE_DATE>=TO_DATE('2017-09-01','yyyy-MM-dd') AND A.TRADE_DATE<TO_DATE('2017-10-01','yyyy-MM-dd') 
            AND A.TRADE_TYPE IN ('CHG','RFD','COR') AND A.MONEY IS NOT NULL and A.area_id='10'  GROUP BY A.customer_code
    ) aaa 
    left join 
    (
        select aa.customer_code customer_code_mo,aa.ctm_num ctm_num_mo,
                bb.customer_code customer_code_chu,bb.ctm_num ctm_num_chu from (
            SELECT SUM(case when B.LAST_MONEY<0 then 0 else b.last_money end) CTM_NUM,B.customer_code FROM (
                SELECT ROW_NUMBER() OVER(PARTITION BY A.CUSTOMER_CODE ORDER BY A.TRADE_DATE DESC) RN,A.*                            
                FROM VM_REPORT_WASTEFEE_YE A                            
                WHERE TRADE_DATE < TO_DATE('2017-10-01','yyyy-MM-dd') 
                    and area_id='10' 
                    AND LAST_MONEY IS NOT NULL
            ) B  WHERE B.RN=1 GROUP BY customer_code
        )   
        aa left join 
        (
            SELECT SUM(case when B.LAST_MONEY<0 then 0 else b.last_money end) CTM_NUM,B.customer_code FROM (
                SELECT ROW_NUMBER() OVER(PARTITION BY A.CUSTOMER_CODE ORDER BY A.TRADE_DATE DESC) RN,A.*                            
                FROM VM_REPORT_WASTEFEE_YE A                            
                WHERE TRADE_DATE < TO_DATE('2017-09-01','yyyy-MM-dd') AND LAST_MONEY IS NOT NULL and area_id='10'
            ) B  WHERE B.RN=1   GROUP BY customer_code
        ) bb on aa.customer_code=bb.customer_code
    ) bbb on aaa.customer_code=bbb.customer_code_mo
) ccc left join (
    SELECT SUM(MONEY) ctm_num_balance,customer_code customer_code_balance
    FROM VM_REPORT_WASTEFEE_SSE 
    WHERE area_id='10' and DT BETWEEN TO_DATE('2017-09-01','yyyy-MM-dd') AND TO_DATE('2017-10-01','yyyy-MM-dd') 
    GROUP BY customer_code
) ddd on ccc.customer_code=ddd.customer_code_balance

where balance<>ctm_num_balance
--关联银行查询不一致 
select ccc.*,ddd.* from (
    select aaa.*,bbb.*,aaa.ctm_num+bbb.ctm_num_chu-bbb.ctm_num_mo balance from 
    (
        select sum(c.money) ctm_num,c.customer_code 
        from (
            select a.*,nvl(to_date(b.bank_date,'yyyy-MM-dd hh:mi:ss'),a.trade_date) dt from gas_Act_Wastefee_Atl a 
            left join gas_Chg_Waste_Bank_Face b on a.wastefee_atl_id=b.trade_Atl_id
        ) c
        where c.trade_Type in ('CHG','RFD','COR') and c.money is not null 
            and c.dt>=to_date('2017-09-01','yyyy-MM-dd') and c.dt<to_date('2017-10-01','yyyy-MM-dd')
            and c.area_id='5'
        group by c.customer_code
    ) aaa 
    left join 
    (
        select aa.customer_code customer_code_mo,aa.ctm_num ctm_num_mo,
                bb.customer_code customer_code_chu,bb.ctm_num ctm_num_chu from (
            SELECT SUM(case when B.LAST_MONEY<0 then 0 else b.last_money end) CTM_NUM,B.customer_code FROM (
                SELECT ROW_NUMBER() OVER(PARTITION BY A.CUSTOMER_CODE ORDER BY A.TRADE_DATE DESC) RN,A.*                            
                FROM VM_REPORT_WASTEFEE_YE A  
                    
                WHERE TRADE_DATE < TO_DATE('2017-10-01','yyyy-MM-dd') 
                    and area_id='5' 
                    AND LAST_MONEY IS NOT NULL
            ) B  WHERE B.RN=1 GROUP BY customer_code
        )   
        aa left join 
        (
            SELECT SUM(case when B.LAST_MONEY<0 then 0 else b.last_money end) CTM_NUM,B.customer_code FROM (
                SELECT ROW_NUMBER() OVER(PARTITION BY A.CUSTOMER_CODE ORDER BY A.TRADE_DATE DESC) RN,A.*                            
                FROM VM_REPORT_WASTEFEE_YE A
                    
                WHERE TRADE_DATE < TO_DATE('2017-09-01','yyyy-MM-dd') AND LAST_MONEY IS NOT NULL and area_id='5'
            ) B  WHERE B.RN=1   GROUP BY customer_code
        ) bb on aa.customer_code=bb.customer_code
    ) bbb on aaa.customer_code=bbb.customer_code_mo
) ccc left join (
    SELECT SUM(C.MONEY) ctm_num_balance,C.customer_code customer_code_balance FROM (
        SELECT A.*,NVL(TO_DATE(B.BANK_DATE,'yyyy-MM-dd hh:mi:ss'),A.DT) TRADE_DATE                             
        FROM VM_REPORT_WASTEFEE_SSE A                                 
        LEFT JOIN GAS_CHG_WASTE_BANK_FACE B ON A.WASTEFEE_ATL_ID=B.TRADE_ATL_ID
    ) C 
    WHERE C.TRADE_DATE>=TO_DATE('2017-09-01','yyyy-MM-dd') AND C.TRADE_DATE<TO_DATE('2017-10-01','yyyy-MM-dd') 
        and c.area_id='5'
    GROUP BY C.customer_code
) ddd on ccc.customer_code=ddd.customer_code_balance

where balance<>ctm_num_balance
