
CREATE OR REPLACE FORCE VIEW "HZQGAS"."VM_REPORT_NO_USER_SALE_SORT" ("YSL", "YSE", "SSL", "SSE", "CUSTOMER_CODE", "REL_CHG_ACCOUNT_NO", "GAS_TYPE_ID", "AREA_ID", "UNION_TYPE", "CHG_AREA_ID", "CUSTOMER_NAME", "CUSTOMER_ADDRESS") AS 
  select nvl(a.ysl,0) ysl,nvl(a.yse,0.00) yse,nvl(b.ssl,0) ssl,nvl(b.sse,0.00) sse,
        a.customer_Code,a.customer_Code rel_Chg_Account_No,substr(a.gas_Type_Id,0,3) gas_Type_Id,a.area_Id,'1' union_Type ,a.area_Id chg_Area_Id,c.customer_Name,
        c.customer_Address
from (
        select nvl(sum(gas),0) ysl,nvl(sum(sse),0.00) yse,customer_Code,gas_Type_Id,area_Id 
        from gas_Report_Ysl
        where customer_Kind='9' and rel_Chg_Account_No is null 
            and trade_date>=p_view_param.get_sdate()
            and trade_date<p_view_param.get_edate()
        group by customer_Code,gas_Type_Id,area_Id
    ) a 
    inner join 
    (
        select nvl(sum(ysl),0) ssl,nvl(sum(money),0.00) sse,customer_Code,gas_Type_Id,area_Id from gas_Report_Sse 
        where customer_Kind='9' and rel_Chg_Account_No is null 
            and trade_date>=p_view_param.get_sdate()
            and trade_date<p_view_param.get_edate()
        group by customer_Code,gas_Type_Id,area_Id
    ) b on a.customer_Code=b.customer_Code and a.gas_Type_Id=b.gas_Type_Id and a.area_Id=b.area_Id 
left join gas_Ctm_Archive c on a.customer_Code=c.customer_Code
union all
select nvl(d.ysl,0) ysl,nvl(d.yse,0.00) yse,nvl(e.ssl,0) ssl,nvl(e.sse,0.00) sse,
    d.customer_Code,d.rel_Chg_Account_No,substr(d.gas_Type_Id,0,3) gas_Type_Id,d.area_Id,'2' union_Type ,d.area_Id chgAreaId,f.acc_Name customer_Name,
    '' customer_Address
from (
        select nvl(sum(gas),0) ysl,nvl(sum(sse),0.00) yse,customer_Code,rel_Chg_Account_No,gas_Type_Id,area_Id 
        from gas_Report_Ysl 
        where customer_Kind='9' and rel_Chg_Account_No is not null             
            and trade_date>=p_view_param.get_sdate()
            and trade_date<p_view_param.get_edate()
        group by customer_Code,gas_Type_Id,area_Id,rel_Chg_Account_No
    ) d 
    inner join 
    (
        select nvl(sum(ysl),0) ssl,nvl(sum(money),0.00) sse,customer_Code,rel_Chg_Account_No,gas_Type_Id,area_Id
        from gas_Report_Sse 
        where customer_Kind='9' and rel_Chg_Account_No is not null             
            and trade_date>=p_view_param.get_sdate()
            and trade_date<p_view_param.get_edate()
        group by customer_Code,gas_Type_Id,area_Id,rel_Chg_Account_No
    ) e on d.customer_Code=e.customer_Code and d.rel_Chg_Account_No=e.rel_Chg_Account_No and d.gas_Type_Id=e.gas_Type_Id 
        and d.area_Id=e.area_Id 
    left join gas_Chg_Account f on d.rel_Chg_Account_No=f.chg_Account_No;
 



create or replace package p_view_param  is 
   
   function set_sdate(sdate date) return date;
   function get_sdate return date;
   
   function set_edate(edate date) return date;
   function get_edate return date;
   
   

end p_view_param;

create or replace package body p_view_param is 
       
    paramSdate date; 
    paramEdate date; 

       -- Param

    function set_sdate(sdate date) return date is 
    begin 
        paramSdate:=sdate;
    return sdate;
    end;         

    function get_sdate return date is 
    begin 
        return paramSdate;
    end; 

    function set_edate(edate date) return date is
    begin 
        paramEdate:=edate;
        return edate; 
    end;        

    function get_Edate return date is 
    begin 
        return paramEdate; 
    end;
end p_view_param;