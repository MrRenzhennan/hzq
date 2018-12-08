--查询实收不一致的customer_code
select ccc.*,ddd.* from (
    select aaa.*,bbb.*,aaa.ctm_num+bbb.ctm_num_chu-bbb.ctm_num_mo balance from 
    (
        SELECT SUM(A.MONEY) CTM_NUM,A.customer_code 
        FROM GAS_ACT_WASTEFEE_ATL A 
        WHERE A.TRADE_DATE>=TO_DATE('2017-09-01','yyyy-MM-dd') AND A.TRADE_DATE<TO_DATE('2017-10-01','yyyy-MM-dd') 
            AND A.TRADE_TYPE IN ('CHG','RFD','COR') AND A.MONEY IS NOT NULL and A.area_id='12'  GROUP BY A.customer_code
    ) aaa 
    left join 
    (
        select aa.customer_code customer_code_mo,aa.ctm_num ctm_num_mo,
                bb.customer_code customer_code_chu,bb.ctm_num ctm_num_chu from (
            SELECT SUM(case when B.LAST_MONEY<0 then 0 else b.last_money end) CTM_NUM,B.customer_code FROM (
                SELECT ROW_NUMBER() OVER(PARTITION BY A.CUSTOMER_CODE ORDER BY A.TRADE_DATE DESC) RN,A.*                            
                FROM VM_REPORT_WASTEFEE_YE A                            
                WHERE TRADE_DATE < TO_DATE('2017-10-01','yyyy-MM-dd') 
                    and area_id='12' 
                    AND LAST_MONEY IS NOT NULL
            ) B  WHERE B.RN=1 GROUP BY customer_code
        )   
        aa left join 
        (
            SELECT SUM(case when B.LAST_MONEY<0 then 0 else b.last_money end) CTM_NUM,B.customer_code FROM (
                SELECT ROW_NUMBER() OVER(PARTITION BY A.CUSTOMER_CODE ORDER BY A.TRADE_DATE DESC) RN,A.*                            
                FROM VM_REPORT_WASTEFEE_YE A                            
                WHERE TRADE_DATE < TO_DATE('2017-09-01','yyyy-MM-dd') AND LAST_MONEY IS NOT NULL and area_id='12'
            ) B  WHERE B.RN=1   GROUP BY customer_code
        ) bb on aa.customer_code=bb.customer_code
    ) bbb on aaa.customer_code=bbb.customer_code_mo
) ccc left join (
    SELECT SUM(MONEY) ctm_num_balance,customer_code customer_code_balance
    FROM VM_REPORT_WASTEFEE_SSE 
    WHERE area_id='12' and DT BETWEEN TO_DATE('2017-09-01','yyyy-MM-dd') AND TO_DATE('2017-10-01','yyyy-MM-dd') 
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



--道外第二营业分公司
--134217221
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015e9e077fbf554e';
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e9e077fbf554e1',last_money=0 where wastefee_atl_id='2c91808200000012015e9de90eeb553f1'
--133353079
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808300000012015e84885a454639';
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e84885a4546391',last_money=3 where wastefee_atl_id='2c91808200000012015e8474e42343f21'
--133375056
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e93d9df8e61ce1',last_money=-6 where wastefee_atl_id='2c91808200000012015e92ea9f7841461'
--134217191
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015e9e07b904555f';
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e9e07b904555f1',last_money=-6 where wastefee_atl_id='2c91808300000012015e9de98aaa5b471'
--133124054
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e7e3fa342310a1',last_money=0 where wastefee_atl_id='2c91808200000012015e7e386f6c2e2b1'
--133476127
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e94017f166f861',last_money=0 where wastefee_atl_id='2c91808300000012015e931a786d4d401'
--133680139
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e9401babc4f5e1',last_money=30 where wastefee_atl_id='2c91808200000012015e9289ace809ff1'
--南岗第一营业分公司
--121230040
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e8457fda93d501',last_money=-6 
            where wastefee_atl_id='2c91808200000012015e838105f424e81'
--120336035
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ea344242f26d41',last_money=0 
            where wastefee_atl_id='2c91808200000012015ea255ba2108851'
--120417024
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015eb813708c536a1',last_money=0 
            where wastefee_atl_id='2c91808200000012015eb678d80c2ba21'
--120257026
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e933703a04ff01',last_money=30 
            where wastefee_atl_id='2c91808200000012015e929463ba0c621'
--121029126
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e4ba4217d4a031',last_money=-6 
            where wastefee_atl_id='2c91808300000012015e4b3b7b2f3f671'
--121090036
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e4ad9e21f2ee11',last_money=12 
            where wastefee_atl_id='2c91808200000012015e459d39610a8a1'
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e4b82d45148df1',last_money=-6 
            where wastefee_atl_id='2c91808300000012015e459daac80ab81'
            
--120557068
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808300000012015ea85cd29d395d';
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015ea85cd29d395d1',last_money=30 
where wastefee_atl_id='2c91808300000012015ea80e6b702e2a1'

--120407104
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808300000012015ea344a421327f';
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015ea344a421327f1',last_money=15 
where wastefee_atl_id='2c91808300000012015ea256e64f14b51'
--120322061
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e7f65863f5a441',last_money=12 
        where wastefee_atl_id='2c91808300000012015e7ea9003e3d671';
--南岗第二营业分公司	
--124789007
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ecc2d746805c31',last_money=-6 
            where wastefee_atl_id='2c91808200000012015ec75d698c42fb1';
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ecc2d746805c31',last_money=-6
            where wastefee_atl_id='2c91808200000012015ec75d698c42fb1';
--126357064
 update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015e84ba37924f06';
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e84ba37924f061',last_money=0 
            where wastefee_atl_id='2c91808200000012015e83ff4d872f961';
--124251070
 update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015ecc98331d1af11',last_money=0 
            where wastefee_atl_id='2c91808200000012015ecc62ee3415291';
--126093023
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808300000012015ebcb7b3ad4412';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015ebcb7b3ad44121',last_money=12 
            where wastefee_atl_id='2c91808300000012015ebc4c5213372a1';
--125170029
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015e98702b990249';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e98702b9902491',last_money=12 
            where wastefee_atl_id='2c91808200000012015e9855b8c7003a1';
--125692046
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e655032b5162c1',last_money=0 
            where wastefee_atl_id='2c91808300000012015e64cf39f40c3a1';

--124775025
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015eb7a63c9a792e';
        update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015eb7a63c9a792e1',last_money=0 
        where wastefee_atl_id='2c91808200000012015eb72e6bd05d881';
--125774059
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e7f265b194dad1',last_money=24 
            where wastefee_atl_id='2c91808300000012015e7e350db12e861';
--126131133
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ecc58727813491',last_money=12
            where wastefee_atl_id='2c91808200000012015ecc4de2ff11211';

--南岗第三营业分公司
--127223041
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ec23156bb24711',last_money=30 
            where wastefee_atl_id='2c91808300000012015ec17cd5ad19fe1';
--127411108
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e4be2d6ae5a4b1',last_money=-6 
            where wastefee_atl_id='2c91808200000012015e4bc70a544f0f1';

--香坊第一营业分公司	 10.16日18:14 没对上 需要继续
--150024074
 update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015ea27dd56e103e';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ea27dd56e103e1',last_money=12
            where wastefee_atl_id='2c91808200000012015ea26aaa12090d1';
--150695069
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e5b2b92ee55cb1',last_money=36
            where wastefee_atl_id='2c91808300000012015e5aea96d7412f1';
--150197040
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015e6fa100ff0caf';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e6fa100ff0caf1',last_money=12
            where wastefee_atl_id='2c91808200000012015e6f82ccae07fd1';
--150146051
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015eb1d6584711ce';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015eb1d6584711ce1',last_money=3
            where wastefee_atl_id='2c91808300000012015eac9dea155bf21';
--150548052
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015ecc8caeaa1e3d';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ecc8caeaa1e3d1',last_money=12
            where wastefee_atl_id='2c91808200000012015ecba154ee78901';

--151101084
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ea78824ba1aa01',last_money=30
            where wastefee_atl_id='2c91808200000012015ea75a618e12711';
--150911003
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015e5a3583c50caf';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e5a3583c50caf1',last_money=12
            where wastefee_atl_id='2c91808300000012015e5a16547002891';
--151026091
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015eaca01d1155ce1',last_money=30
            where wastefee_atl_id='2c91808300000012015eac937d2a5ad41';
--150291086
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015e3c40cfdd1a98';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e3c40cfdd1a981',last_money=3
            where wastefee_atl_id='2c91808200000012015e3b6aca3533b21';
--150859090
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015ec1e14f992509';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ec1e14f9925091',last_money=12
            where wastefee_atl_id='2c91808200000012015ec1b06d1f1d441';
--150454078
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015e7f3c3b764f2e';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e7f3c3b764f2e1',last_money=30
            where wastefee_atl_id='2c91808200000012015e7e80b32d3ab41';
--151001108
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808300000012015ea32c789e2f1c';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015ea32c789e2f1c1',last_money=3
            where wastefee_atl_id='2c91808300000012015ea2fdb326272c1';
--150152103
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e74fcdde438461',last_money=-6
            where wastefee_atl_id='2c91808300000012015e742a75661ef31';
--150531035
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808300000012015e834950381456';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e8349503814561',last_money=12
            where wastefee_atl_id='2c91808200000012015e830bb8e1042d1';
--151091010
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e7e4a1e1431bf1',last_money=0
            where wastefee_atl_id='2c91808200000012015e7e45284032251';

--10月份
--150187009
 update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015efeb522b455591',last_money=27
            where wastefee_atl_id='2c91808300000012015efa90008d00b11';
--151145005
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015f0a4232c920a51',last_money=-3
            where wastefee_atl_id='2c91808200000012015f096bfeac2a631';
--127069028
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015f146b526a1b091',last_money=0
            where wastefee_atl_id='2c91808300000012015f138bed9072131';

--香坊第二营业分公司
--140874004
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e793a889a694a1',last_money=30
            where wastefee_atl_id='2c91808300000012015e790f311c66a91';
--140326010
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015eccafa1b426771',last_money=12
            where wastefee_atl_id='2c91808300000012015ecb25595d58e81';
--140781017
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e4bb9f7a94eac1',last_money=-6
            where wastefee_atl_id='2c91808200000012015e45a0574b0b011';
--140005007
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e74f20a2d35781',last_money=30
            where wastefee_atl_id='2c91808200000012015e74a11df629011';

--141992146
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e5fccfb08259a1',last_money=12
            where wastefee_atl_id='2c91808200000012015e5ef1dbd402931';
--平房营业分公司
--160302164
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015ecc5b864e0f931',last_money=0
            where wastefee_atl_id='2c91808200000012015ec724d5a43a4b1';
--160823029
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e6090af2529f91',last_money=30
            where wastefee_atl_id='2c91808200000012015e6040729c19261';
--160335031
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e609053d243c71',last_money=12
            where wastefee_atl_id='2c91808200000012015e5f9208331f351';
--160656036
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015ec6baf2282845';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ec6baf22828451',last_money=12
            where wastefee_atl_id='2c91808200000012015ec228639830ac1';

--道里第四营业分公司
--170056108
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e4f4eb09f00251',last_money=-6
            where wastefee_atl_id='2c91808300000012015e4aee4abd36eb1';
--道外第一营业分公司	
--130084013
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e56308ae84a7d1',last_money=30
            where wastefee_atl_id='2c91808300000012015e560b8da13ef01';
            --130534047
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e741dae791d2d1',last_money=30
            where wastefee_atl_id='2c91808200000012015e73db4415124a1';
--130030053
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015ec74605aa3ec6';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ec74605aa3ec61',last_money=12
            where wastefee_atl_id='2c91808300000012015ec69846ee24531';
--130185124
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015ec744e6963f611',last_money=12
            where wastefee_atl_id='2c91808300000012015ec718c13835bc1';
--130864179
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808200000012015e5fdda70000af';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e5fdda70000af1',last_money=12
            where wastefee_atl_id='2c91808200000012015e5f9e7bd621c01';
--130114100
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015ebd59acc05fc11',last_money=30
            where wastefee_atl_id='2c91808200000012015ebcc5802640c01';
--道里第三营业分公司
--116874089
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ec7440b533e721',last_money=0
            where wastefee_atl_id='2c91808200000012015ec6307194128c1';
--116411030
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015eb2615b771abc1',last_money=0
            where wastefee_atl_id='2c91808200000012015eb1750dee07131';
--116257115
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e3c406f251aac1',last_money=0
            where wastefee_atl_id='2c91808200000012015e3be5e3a162691';
--116818012
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ea1d808a770aa1',last_money=-6
            where wastefee_atl_id='2c91808200000012015e9d929ca04bd51';
--116528009
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015eccecae5b2d881',last_money=0
            where wastefee_atl_id='2c91808200000012015ecc5c516814211';

--道里第一营业分公司
--113200082
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015e5fdd2bd000a81',last_money=0
            where wastefee_atl_id='2c91808200000012015e5f8984771dcb1';
--110356041
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e7a3847ef0fd01',last_money=12
            where wastefee_atl_id='2c91808200000012015e793b78256a541';
--113072127
update GAS_ACT_WASTEFEE_ATL set last_money=-6 where wastefee_atl_id='2c91808300000012015ea39ee1374d88';
            update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015ea39ee1374d881',last_money=0
            where wastefee_atl_id='2c91808200000012015ea321204f1d411';
--113397062
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808300000012015ebd5b11dd5fd61',last_money=-6
            where wastefee_atl_id='2c91808200000012015ebbc42ab90d3d1';
--110377073
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015ea27d2d6c10231',last_money=0
            where wastefee_atl_id='2c91808200000012015ea215e6fd759b1';
--113177029
update GAS_ACT_WASTEFEE_ATL set wastefee_atl_id='2c91808200000012015e5626866a44cb1',last_money=12
            where wastefee_atl_id='2c91808300000012015e55020eab18b71';