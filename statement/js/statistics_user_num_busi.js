$(".export-excel").attr("data-table",".tabPrint");
//    $(".export-excel").attr("data-filename","");
$(".export-excel").on("click", function (e) {
    e.preventDefault();
    var exportTable = $(this).data("table");
    var filename = $("#title").html();//$(this).data("filename");
    var ignoreColumn = "";//$(this).data("ignorecolumn");
    $(exportTable).tableExport({
        fileName: filename,
        type: 'excel',
        escape: 'false',
        excelstyles: ['border-bottom', 'border-top', 'border-left', 'border-right'],
        ignoreColumn: '[' + ignoreColumn + ']'
    });
});

jQuery(document).ready(function () {
    ComponentsPickers.init();
    $('#find_date').bootstrapMonthpicker();

    // ComponentsDropdowns.init();
});

document.onkeydown = function () {keydown();};
function keydown() {
    //P 空格 会车 event.keyCode==80 || event.keyCode==32 || event.keyCode==13
    if (event.keyCode == 13) {
        window.print();
    }
}


ComponentsPickers.init();
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
GasModSys.areaList({
    "areaId": areaId,
    "cb": function (data) {
        console.log(data)
        $.each(data, function (key, val) {
            loginarea.push(val.areaId);
            // $('#find_area').append('<option value="' + val.areaId + '" name="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});

var AreaHelper1 = RefHelper.create({
    ref_url: 'gasbizarea?query={"areaId":{"$in":' + JSON.stringify(loginarea) + '}}',
    ref_col: "areaId",
    ref_display: "areaName",
    "sort": "posCode"
});
$("#areaId").html(AreaHelper1.getDisplay(areaId))
var gs = AreaHelper1.getRawData();
$.ajax({
    url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
    type: "POST",
    contentType: "application/json;charset=utf-8",
    data: JSON.stringify({
        cols: "gasTypeCode,gasTypeName",
        froms: "gasBizGasType",
        wheres: " posCode = 0 and length(gasTypeCode)=3 order by gasTypeCode",
        page: "false"
    }),
    dataType: "json",
    success: function (data) {
        console.log(data)
        var tbody = "";
        for (var i = 0; i < gs.length; i++) {
            for (var j = 0; j < data.rows.length; j++) {
                var rn = data.rows.length + 1;
                if (j == 0) {
                    tbody = tbody + '<tr align="center" data-areaId="'+gs[i].areaId+'" data-gastypeid="'+data.rows[j].gasTypeCode+'">' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '" rowspan="' + 16 + '" colspan="1">' + gs[i].areaName + '</td>'+
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '" rowspan="' + 6 + '" colspan="1">居民</td>'+
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d1" rowspan="1" colspan="1">' + data.rows[j].gasTypeName + '</td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d2" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d3" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d4" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d5" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d6" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d7" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d26" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d8" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d9" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d10" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d11" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d12" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d13" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d14" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d15" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d16" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d17" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d18" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d19" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d20" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d21" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d22" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d23" rowspan="1" colspan="1" ></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d24" rowspan="1" colspan="1" ></td>' +
                        '</tr>';
                }else if(j == 5){
                    tbody = tbody + '<tr align="center" data-areaId="'+gs[i].areaId+'" data-gastypeid="-1">' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d1" rowspan="1" colspan="1">小计</td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d2" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d3" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d4" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d5" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d6" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c1_d7" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d26" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c1_d8" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d9" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d10" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d11" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d12" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d13" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d14" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d15" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d16" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d17" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d18" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d19" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d20" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d21" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d22" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d23" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c1_d24" rowspan="1" colspan="1"></td>' +
                        '</tr>';
                    tbody = tbody + '<tr align="center"  data-areaId="'+gs[i].areaId+'" data-gastypeid="'+data.rows[j].gasTypeCode+'">' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '" rowspan="' + 9 + '" colspan="1">非居民</td>'+
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d1" rowspan="1" colspan="1">' + data.rows[j].gasTypeName + '</td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d2" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d3" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d4" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d5" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d6" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d7" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d26" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d8" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d9" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d10" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d11" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d12" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d13" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d14" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d15" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d16" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d17" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d18" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d19" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d20" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d21" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d22" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d23" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d24" rowspan="1" colspan="1"></td>' +
                        '</tr>';
                } else if(5<j && j<12 || j<5) {
                    tbody = tbody + '<tr align="center"  data-areaId="'+gs[i].areaId+'" data-gasTypeId="'+data.rows[j].gasTypeCode+'">' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d1" rowspan="1" colspan="1">' + data.rows[j].gasTypeName + '</td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d2" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d3" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d4" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d5" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d6" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d7" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d26" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d8" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d9" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d10" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d11" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d12" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d13" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d14" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d15" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d16" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d17" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d18" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d19" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d20" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d21" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d22" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d23" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d24" rowspan="1" colspan="1"></td>' +
                        '</tr>';
                }else if(j==12){
                    tbody = tbody + '<tr align="center"  data-areaId="'+gs[i].areaId+'" data-gastypeid="'+data.rows[j].gasTypeCode+'">' +
//                            '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '" rowspan="' + 9 + '" colspan="1">非居民</td>'+
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d1" rowspan="1" colspan="1">' + data.rows[j].gasTypeName + '</td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d2" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d3" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d4" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d5" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d6" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d7" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d26" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d8" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d9" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d10" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d11" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d12" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d13" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d14" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d15" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d16" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d17" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d18" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d19" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d20" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d21" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d22" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d23" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d24" rowspan="1" colspan="1"></td>' +
//                            '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d24" rowspan="1" colspan="1"></td>' +
                        '</tr>';
                    tbody = tbody + '<tr align="center" data-areaId="'+gs[i].areaId+'" data-gastypeid="-1">' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d1" rowspan="1" colspan="1">小计</td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d2" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d3" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d4" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d5" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d6" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c2_d7" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d26" rowspan="1" colspan="1"></td>' +

                        '<td id="tbody_r' + gs[i].areaId + '_c2_d8" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d9" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d10" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d11" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d12" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d13" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d14" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d15" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d16" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d17" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d18" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d19" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d20" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d21" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d22" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d23" rowspan="1" colspan="1"></td>' +
                        '<td id="tbody_r' + gs[i].areaId + '_c2_d24" rowspan="1" colspan="1"></td>' +
//                            '<td id="tbody_r' + gs[i].areaId + '_c' + data.rows[j].gasTypeCode + '_d24" rowspan="1" colspan="1"></td>' +
                        '</tr>';
                }
            }
            tbody = tbody + '<tr align="center"  id="" data-areaId="'+gs[i].areaId+'" data-gastypeid="-2">' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d1" rowspan="1" colspan="2">合计</td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d2" rowspan="1" colspan="1" ctype="1" csum="d2" csumtypeid="' + gs[i].areaId + '_d2"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d3" rowspan="1" colspan="1" ctype="1" csum="d3" csumtypeid="' + gs[i].areaId + '_d3"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d4" rowspan="1" colspan="1" ctype="1" csum="d4" csumtypeid="' + gs[i].areaId + '_d4"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d5" rowspan="1" colspan="1" ctype="1" csum="d5" csumtypeid="' + gs[i].areaId + '_d5"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d6" rowspan="1" colspan="1" ctype="1" csum="d6" csumtypeid="' + gs[i].areaId + '_d6"></td>' +

                '<td id="tbody_r' + gs[i].areaId + '_c_d7" rowspan="1" colspan="1" ctype="1" csum="d7" csumtypeid="' + gs[i].areaId + '_d7"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d26" rowspan="1" colspan="1" ctype="1" csum="d9" csumtypeid="' + gs[i].areaId + '_d26"></td>' +

                '<td id="tbody_r' + gs[i].areaId + '_c_d8" rowspan="1" colspan="1" ctype="1" csum="d8" csumtypeid="' + gs[i].areaId + '_d8"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d9" rowspan="1" colspan="1" ctype="1" csum="d9" csumtypeid="' + gs[i].areaId + '_d9"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d10" rowspan="1" colspan="1" ctype="1" csum="d10" csumtypeid="' + gs[i].areaId + '_d10"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d11" rowspan="1" colspan="1" ctype="1" csum="d11" csumtypeid="' + gs[i].areaId + '_d11"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d12" rowspan="1" colspan="1" ctype="1" csum="d12" csumtypeid="' + gs[i].areaId + '_d12"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d13" rowspan="1" colspan="1" ctype="1" csum="d13" csumtypeid="' + gs[i].areaId + '_d13"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d14" rowspan="1" colspan="1" ctype="1" csum="d14" csumtypeid="' + gs[i].areaId + '_d14"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d15" rowspan="1" colspan="1" ctype="1" csum="d15" csumtypeid="' + gs[i].areaId + '_d15"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d16" rowspan="1" colspan="1" ctype="1" csum="d16" csumtypeid="' + gs[i].areaId + '_d15"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d17" rowspan="1" colspan="1" ctype="1" csum="d17" csumtypeid="' + gs[i].areaId + '_d15"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d18" rowspan="1" colspan="1" ctype="1" csum="d18" csumtypeid="' + gs[i].areaId + '_d15"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d19" rowspan="1" colspan="1" ctype="1" csum="d19" csumtypeid="' + gs[i].areaId + '_d15"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d20" rowspan="1" colspan="1" ctype="1" csum="d20" csumtypeid="' + gs[i].areaId + '_d15"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d21" rowspan="1" colspan="1" ctype="1" csum="d21" csumtypeid="' + gs[i].areaId + '_d15"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d22" rowspan="1" colspan="1" ctype="1" csum="d22" csumtypeid="' + gs[i].areaId + '_d15"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d23" rowspan="1" colspan="1" ctype="1" csum="d23" csumtypeid="' + gs[i].areaId + '_d15"></td>' +
                '<td id="tbody_r' + gs[i].areaId + '_c_d24" rowspan="1" colspan="1" ctype="1" csum="d23" csumtypeid="' + gs[i].areaId + '_d15"></td>' +
                '</tr>';
        }
        $("#tbody").html(tbody);
    }
});
$("#find_sign").on("click",function(){
     if(!$("#find_date").val()){
     bootbox.alert("<center><h4>请选择时间。</h4></center>")
         return false;
     }
    var userHelper = RefHelper.create({
        ref_url: 'gassysuser?query={"status":"1"}',
        ref_col: "userId",
        ref_display: "employeeName",
    });

     $("#foot_r0_c7 span").html(userHelper.getDisplay(areaId))
     $("#foot_r0_c14 span").html(moment().format("YYYY-MM-DD"))




    var curMonth=$("#find_date").val().replace('年','-').replace('月','');

    var start = moment(curMonth + "-26").add('month', -1).format("YYYY-MM-DD");
    var end = curMonth + "-26";
    console.log(start+"@@@@@@@@@"+end);
    var year = $("#find_date").val().split("-")[0];
    var month = $("#find_date").val().split("-")[1];
    if($("#find_date").val().split("-")[1] < "10"){
        month = $("#find_date").val().split("-")[1].substr(1,1)
    }/*else if($("#find_date").val().split("-")[1] == "01"){
        year = year-1;
    }*/
console.log(year)
console.log(month)
    //期初数据

    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,areaId,gasTypeId,sum(normalNum) normalNum,sum(stopNum) stopNum,sum(longUseNum) longUseNum,sum(noUseNum) noUseNum,sum(dismantleNum) dismantleNum",
            froms: "vmGasReportArchive",
            wheres: "areaId in ("+loginarea.join()+") and reportMonth = '"+(month-1)+"' and reportYear='"+year+"' group by areaId,gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr2=0,tr3=0,tr4=0,tr5=0,tr6=0,tr7=0,lastr2=0,lastr3=0,lastr4=0,lastr5=0,lastr6=0,lastr7=0;

            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum1(data.rows, areaId, gasTypeId);
                if(gasTypeId == "-1" && areaId != "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d2").html((tr2));
                    $(this).find("#tbody_r" + areaId + "_c1_d3").html((tr3));
                    $(this).find("#tbody_r" + areaId + "_c1_d4").html((tr4));
                    $(this).find("#tbody_r" + areaId + "_c1_d5").html((tr5));
                    $(this).find("#tbody_r" + areaId + "_c1_d6").html((tr6));
                    $(this).find("#tbody_r" + areaId + "_c1_d7").html((tr7));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d2").html((tr2));
                    $(this).find("#tbody_r" + areaId + "_c2_d3").html((tr3));
                    $(this).find("#tbody_r" + areaId + "_c2_d4").html((tr4));
                    $(this).find("#tbody_r" + areaId + "_c2_d5").html((tr5));
                    $(this).find("#tbody_r" + areaId + "_c2_d6").html((tr6));
                    $(this).find("#tbody_r" + areaId + "_c2_d7").html((tr7));

                    tr2=0,tr3=0,tr4=0,tr5=0,tr6=0,tr7=0;
                }else if(gasTypeId == "-2" && areaId != "1"){
                    $(this).find("#tbody_r" + areaId + "_c_d2").html((lastr2));
                    $(this).find("#tbody_r" + areaId + "_c_d3").html((lastr3));
                    $(this).find("#tbody_r" + areaId + "_c_d4").html((lastr4));
                    $(this).find("#tbody_r" + areaId + "_c_d5").html((lastr5));
                    $(this).find("#tbody_r" + areaId + "_c_d6").html((lastr6));
                    $(this).find("#tbody_r" + areaId + "_c_d7").html((lastr7));
                    lastr2=0,lastr3=0,lastr4=0,lastr5=0,lastr6=0,lastr7=0;
                }else if(areaId != "1"){
                    var zhengchang = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum);
                    // 小计
                    tr2+=zhengchang;
                    tr3+=result.normalNum;
                    tr4+=result.nouseNum;
                    tr5+=result.stopNum;
                    tr6+=result.dismantleNum;
                    tr7+=result.longnouseNum;
                    //合计
                    lastr2+=zhengchang;
                    lastr3+=result.normalNum;
                    lastr4+=result.nouseNum;
                    lastr5+=result.stopNum;
                    lastr6+=result.dismantleNum;
                    lastr7+=result.longnouseNum;
                    // console.log(tr2)
                    // s2+=zhengchang,s3+=result.normalNum,s4+=result.nouseNum,s5+=result.stopNum,s6+=result.dismantleNum,s7+=result.longnouseNum;

                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d2").html(zhengchang)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d3").html(result.normalNum)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d4").html(result.nouseNum)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d5").html(result.stopNum)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d6").html(result.dismantleNum)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d7").html(result.longnouseNum)
                }
            });
            var sx2=0,sx3=0,sx4=0,sx5=0,sx6=0,sx7=0;
            var ss2=0,ss3=0,ss4=0,ss5=0,ss6=0,ss7=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s2=0,s3=0,s4=0,s5=0,s6=0,s7=0;
                var xiaoji = 0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d2']").each(function(i){
                    if(i>0)s2+=parseInt($(this).text());
                });
                $("#tbody").find("td[id$='"+gasTypeId+"_d3']").each(function(i){
                    if(i>0)s3+=parseInt($(this).text());
                });
                $("#tbody").find("td[id$='"+gasTypeId+"_d4']").each(function(i){
                    if(i>0)s4+=parseInt($(this).text());
                });
                $("#tbody").find("td[id$='"+gasTypeId+"_d5']").each(function(i){
                    if(i>0)s5+=parseInt($(this).text());
                });
                $("#tbody").find("td[id$='"+gasTypeId+"_d6']").each(function(i){
                    if(i>0)s6+=parseInt($(this).text());
                });
                $("#tbody").find("td[id$='"+gasTypeId+"_d7']").each(function(i){
                    if(i>0)s7+=parseInt($(this).text());
                });


                if(gasTypeId == "-1" && areaId == "1"){

                    console.log("+++++"+sx2)
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d2").html((sx2));
                    $(this).find("#tbody_r" + areaId + "_c1_d3").html((sx3));
                    $(this).find("#tbody_r" + areaId + "_c1_d4").html((sx4));
                    $(this).find("#tbody_r" + areaId + "_c1_d5").html((sx5));
                    $(this).find("#tbody_r" + areaId + "_c1_d6").html((sx6));
                    $(this).find("#tbody_r" + areaId + "_c1_d7").html((sx7));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d2").html((sx2));
                    $(this).find("#tbody_r" + areaId + "_c2_d3").html((sx3));
                    $(this).find("#tbody_r" + areaId + "_c2_d4").html((sx4));
                    $(this).find("#tbody_r" + areaId + "_c2_d5").html((sx5));
                    $(this).find("#tbody_r" + areaId + "_c2_d6").html((sx6));
                    $(this).find("#tbody_r" + areaId + "_c2_d7").html((sx7));


                    sx2=0,sx3=0,sx4=0,sx5=0,sx6=0,sx7=0;
                    // tr2=0,tr3=0,tr4=0,tr5=0,tr6=0,tr7=0;
                }else if(gasTypeId == "-2" && areaId == "1"){
                    $(this).find("#tbody_r" + areaId + "_c_d2").html((ss2));
                    $(this).find("#tbody_r" + areaId + "_c_d3").html((ss3));
                    $(this).find("#tbody_r" + areaId + "_c_d4").html((ss4));
                    $(this).find("#tbody_r" + areaId + "_c_d5").html((ss5));
                    $(this).find("#tbody_r" + areaId + "_c_d6").html((ss6));
                    $(this).find("#tbody_r" + areaId + "_c_d7").html((ss7));
                    ss2=0,ss3=0,ss4=0,ss5=0,ss6=0,ss7=0;
                }else{
                    console.log(s2)


                    sx2+=s2;
                    sx3+=s3;
                    sx4+=s4;
                    sx5+=s5;
                    sx6+=s6;
                    sx7+=s7;

                    ss2+=s2;
                    ss3+=s3;
                    ss4+=s4;
                    ss5+=s5;
                    ss6+=s6;
                    ss7+=s7;


                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d2").html((s2));
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d3").html(s3);
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d4").html((s4));
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d5").html((s5));
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d6").html((s6));
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d7").html((s7));

                }

                /*$("#tbody").find("td[id$='"+gasTypeId+"_c9']").each(function(i){
                 if(i>0)nouseNumTotal+=parseInt($(this).text());
                 });*/

                // $(this).find("#tbody_r"+areaId+"_c1_d2").html((xiaoji));
                // $(this).find("#tbody_r"+areaId+"_"+gasTypeId+"_c9").html((nouseNumTotal));
            })
        }
    })

    /*//期初所有
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,customerState,areaId,gasTypeId",
            froms: "gasCtmArchive",
            wheres: "areaId in ("+loginarea.join()+") and to_char(created_time,'yyyy-mm-dd') < '"+start+"' group by customerState,areaId,gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success: function (data) {
            var tr2=0,tr3=0,tr4=0,tr5=0,tr6=0,tr7=0,lastr2=0,lastr3=0,lastr4=0,lastr5=0,lastr6=0,lastr7=0;

            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d2").html((tr2));
                    $(this).find("#tbody_r" + areaId + "_c1_d3").html((tr3));
                    $(this).find("#tbody_r" + areaId + "_c1_d4").html((tr4));
                    $(this).find("#tbody_r" + areaId + "_c1_d5").html((tr5));
                    $(this).find("#tbody_r" + areaId + "_c1_d6").html((tr6));
                    $(this).find("#tbody_r" + areaId + "_c1_d7").html((tr7));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d2").html((tr2));
                    $(this).find("#tbody_r" + areaId + "_c2_d3").html((tr3));
                    $(this).find("#tbody_r" + areaId + "_c2_d4").html((tr4));
                    $(this).find("#tbody_r" + areaId + "_c2_d5").html((tr5));
                    $(this).find("#tbody_r" + areaId + "_c2_d6").html((tr6));
                    $(this).find("#tbody_r" + areaId + "_c2_d7").html((tr7));

                    tr2=0,tr3=0,tr4=0,tr5=0,tr6=0,tr7=0;
                }else if(gasTypeId == "-2"){
                    $(this).find("#tbody_r" + areaId + "_c_d2").html((lastr2));
                    $(this).find("#tbody_r" + areaId + "_c_d3").html((lastr3));
                    $(this).find("#tbody_r" + areaId + "_c_d4").html((lastr4));
                    $(this).find("#tbody_r" + areaId + "_c_d5").html((lastr5));
                    $(this).find("#tbody_r" + areaId + "_c_d6").html((lastr6));
                    $(this).find("#tbody_r" + areaId + "_c_d7").html((lastr7));
                    lastr2=0,lastr3=0,lastr4=0,lastr5=0,lastr6=0,lastr7=0;
                }else{
                    var zhengchang = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum);
                    // 小计
                    tr2+=zhengchang;
                    tr3+=result.normalNum;
                    tr4+=result.nouseNum;
                    tr5+=result.stopNum;
                    tr6+=result.dismantleNum;
                    tr7+=result.longnouseNum;
                    //合计
                    lastr2+=zhengchang;
                    lastr3+=result.normalNum;
                    lastr4+=result.nouseNum;
                    lastr5+=result.stopNum;
                    lastr6+=result.dismantleNum;
                    lastr7+=result.longnouseNum;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d2").html(zhengchang)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d3").html(result.normalNum)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d4").html(result.nouseNum)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d5").html(result.stopNum)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d6").html(result.dismantleNum)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d7").html(result.longnouseNum)
                }
            });
        }
    });*/

    //新开栓户数
    var whereCause1=" unboltTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";


    /*select a.*,b.* from (gas_xxxx a where month=8) a left join (select * frm gas where month=7) b where a.xx=b.xx where b.xx is null */
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
       /* data: JSON.stringify({
            cols: "count(1) ctmNum,areaId,gasTypeId,sum(normalNum) normalNum,sum(stopNum) stopNum,sum(longUseNum) longUseNum,sum(noUseNum) noUseNum,sum(dismantleNum) dismantleNum",
            froms: "vmGasReportArchiveNew",
            wheres: "areaId in ("+loginarea.join()+") and reportMonth in ('"+month+"','"+(month-1)+"') group by areaId,gasTypeId",
            page: "false"
        }),*/
         data: JSON.stringify({
            cols: "count(1) ctmNum,customerState,areaId,gasTypeId",
            froms: "gasCtmArchive",
            wheres: "areaId in ("+loginarea.join()+") and "+whereCause1+" and customerState='01' group by customerState,areaId,gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计

                    $(this).find("#tbody_r" + areaId + "_c1_d8").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d8").html((tr8));

                   tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d8").html((lastr8));
                    lastr8=0;
                }else{
                    //新开栓
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d8").html(unbolt)
                }
            });

            var sx8=0;
            var ss8=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s8=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d8']").each(function(i){
                    if(i>0)s8+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d8").html((sx8));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d8").html((sx8));
                    sx8=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d8").html((ss8));
                    ss8=0;
                }else{
                    sx8+=s8;
                    ss8+=s8;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d8").html((s8));
                }
            })

        }
    })
    //累计新开栓户数
    var startYear=(moment(start).format('YYYY'))+'-12-26',endYear=moment(end).format('YYYY')+'-12-26';//年份
    if($("#find_date").val().split("-")[1] > "01"){
        startYear=(moment(start).format('YYYY')-1)+'-12-26',endYear=moment(end).format('YYYY')+'-12-26';//年份
    }

    console.log(startYear)
    console.log(endYear)
    var whereCause2=" unboltTime between to_date('" + startYear + "','yyyy-MM-dd') and to_date('" + endYear + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,customerState,areaId,gasTypeId",
            froms: "gasCtmArchive",
            wheres: "areaId in ("+loginarea.join()+") and "+whereCause2+" group by customerState,areaId,gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d9").html((tr8));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d9").html((tr8));
                   tr8=0;
                }else if(gasTypeId == "-2"){
                    $(this).find("#tbody_r" + areaId + "_c_d9").html((lastr8));
                    lastr8=0;
                }else{
                    //新开栓
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d9").html(unbolt)
                }
            });
            var sx9=0;
            var ss9=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s9=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d9']").each(function(i){
                    if(i>0)s9+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d9").html((sx9));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d9").html((sx9));
                    sx9=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d9").html((ss9));
                    ss9=0;
                }else{
                    sx9+=s9;
                    ss9+=s9;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d9").html((s9));
                }
            })

        }
    })

    //燃气费计费更正
    // var whereCause1=" unboltTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    var whereCause23=" b.modifiedTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasBllCorrectFlow b left join gasCtmArchive a on b.ctmArchiveId = a.ctmArchiveId",
            wheres: "a.areaId in ("+loginarea.join()+") and b.status='2' and b.correctType = '1'  and "+whereCause23+" group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d23").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d23").html((tr8));

                    tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d23").html((lastr8));
                    lastr8=0;
                }else{
                    //新开栓
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d23").html(unbolt)
                }
            });

            var sx23=0;
            var ss23=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s23=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d23']").each(function(i){
                    if(i>0)s23+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d23").html((sx23));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d23").html((sx23));
                    sx23=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d23").html((ss23));
                    ss23=0;
                }else{
                    sx23+=s23;
                    ss23+=s23;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d23").html((s23));
                }
            })


        }
    })

    //垃圾费计费更正
    // var whereCause1=" unboltTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    // var whereCause23=" b.modifiedTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasBllCorrectFlow b left join gasCtmArchive a on b.ctmArchiveId = a.ctmArchiveId",
            wheres: "a.areaId in ("+loginarea.join()+") and b.status='2' and b.correctType = '2'  and "+whereCause23+" group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d24").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d24").html((tr8));

                    tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d24").html((lastr8));
                    lastr8=0;
                }else{
                    //新开栓
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d24").html(unbolt)
                }
            });

            var sx23=0;
            var ss23=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s23=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d24']").each(function(i){
                    if(i>0)s23+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d24").html((sx23));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d24").html((sx23));
                    sx23=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d24").html((ss23));
                    ss23=0;
                }else{
                    sx23+=s23;
                    ss23+=s23;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d24").html((s23));
                }
            })


        }
    })

    //家庭人口大于5
    // var whereCause1=" unboltTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    // var whereCause23=" b.modifiedTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasCtmHouse b left join gasCtmArchive a on b.houseId = a.houseId",
            wheres: "a.areaId in ("+loginarea.join()+") and b.population > '5' group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d22").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d22").html((tr8));

                    tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d22").html((lastr8));
                    lastr8=0;
                }else{
                    //新开栓
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d22").html(unbolt)
                }
            });
            var sx22=0;
            var ss22=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s22=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d22']").each(function(i){
                    if(i>0)s22+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d22").html((sx22));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d22").html((sx22));
                    sx22=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d22").html((ss22));
                    ss22=0;
                }else{
                    sx22+=s22;
                    ss22+=s22;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d22").html((s22));
                }
            })

        }
    })

    //家庭人口等于1
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasCtmHouse b left join gasCtmArchive a on b.houseId = a.houseId",
            wheres: "a.areaId in ("+loginarea.join()+") and b.population = '1' group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d21").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d21").html((tr8));

                    tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d21").html((lastr8));
                    lastr8=0;
                }else{
                    //新开栓
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d21").html(unbolt)
                }
            });
            var sx21=0;
            var ss21=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s21=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d21']").each(function(i){
                    if(i>0)s21+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d21").html((sx21));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d21").html((sx21));
                    sx22=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d21").html((ss21));
                    ss21=0;
                }else{
                    sx21+=s21;
                    ss21+=s21;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d21").html((s21));
                }
            })
        }
    })
    //新增低保用户
    var whereCause12=" b.createdTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasCtmSpecific b left join gasCtmArchive a on b.customerCode = a.customerCode",
            wheres: "a.areaId in ("+loginarea.join()+") and b.specificType = '1' and b.status = '1' and "+ whereCause12 +" group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d12").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d12").html((tr8));

                    tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d12").html((lastr8));
                    lastr8=0;
                }else{
                    //新开栓
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d12").html(unbolt)
                }
            });
            var sx12=0;
            var ss12=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s12=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d12']").each(function(i){
                    if(i>0)s12+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d12").html((sx12));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d12").html((sx12));
                    sx12=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d12").html((ss12));
                    ss12=0;
                }else{
                    sx12+=s12;
                    ss12+=s12;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d12").html((s12));
                }
            })
        }
    })
    //取消低保
    var whereCause13=" b.modifiedTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasCtmSpecific b left join gasCtmArchive a on b.customerCode = a.customerCode",
            wheres: "a.areaId in ("+loginarea.join()+") and b.specificType = '1' and b.status = '3' and "+ whereCause13 +" group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d13").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d13").html((tr8));

                    tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d13").html((lastr8));
                    lastr8=0;
                }else{
                    //新开栓
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d13").html(unbolt)
                }
            });
            var sx13=0;
            var ss13=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s13=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d13']").each(function(i){
                    if(i>0)s13+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d13").html((sx13));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d13").html((sx13));
                    sx13=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d13").html((ss13));
                    ss13=0;
                }else{
                    sx13+=s13;
                    ss13+=s13;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d13").html((s13));
                }
            })
        }
    })
    //新增低收入、低困
    var whereCause14=" b.modifiedTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasCtmSpecific b left join gasCtmArchive a on b.customerCode = a.customerCode",
            wheres: "a.areaId in ("+loginarea.join()+")  and b.specificType in ('2','3') and b.status = '1' and "+ whereCause14 +" group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d14").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d14").html((tr8));

                    tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d14").html((lastr8));
                    lastr8=0;
                }else{
                    //新开栓
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d14").html(unbolt)
                }
            });
            var sx14=0;
            var ss14=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s14=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d14']").each(function(i){
                    if(i>0)s14+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d14").html((sx14));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d14").html((sx14));
                    sx14=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d14").html((ss14));
                    ss14=0;
                }else{
                    sx14+=s14;
                    ss14+=s14;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d14").html((s14));
                }
            })
        }
    })

    //取消低收入、低困
    var whereCause15=" b.modifiedTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasCtmSpecific b left join gasCtmArchive a on b.customerCode = a.customerCode",
            wheres: "a.areaId in ("+loginarea.join()+")  and b.specificType in ('2','3') and b.status = '3' and "+ whereCause15 +" group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d15").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d15").html((tr8));

                    tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d15").html((lastr8));
                    lastr8=0;
                }else{
                    //新开栓
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d15").html(unbolt)
                }
            });
            var sx15=0;
            var ss15=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s15=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d15']").each(function(i){
                    if(i>0)s15+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d15").html((sx15));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d15").html((sx15));
                    sx15=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d15").html((ss15));
                    ss15=0;
                }else{
                    sx15+=s15;
                    ss15+=s15;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d15").html((s15));
                }
            })
        }
    })



    //重新用气
    var whereCause16=" c.finishTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasCsrWorkBill b left join gasCtmArchive a on b.customerCode = a.customerCode left join gasCsrWorkBillResult c on b.workBillId = c.workBillId",
            wheres: "a.areaId in ("+loginarea.join()+") and b.billState='4' and  "+ whereCause16 +" and  b.billType='WB_REUSEG' group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d16").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d16").html((tr8));

                    tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d16").html((lastr8));
                    lastr8=0;
                }else{
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d16").html(unbolt)
                }
            });
            var sx16=0;
            var ss16=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s16=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d16']").each(function(i){
                    if(i>0)s16+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d16").html((sx16));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d16").html((sx16));
                    sx16=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d16").html((ss16));
                    ss16=0;
                }else{
                    sx16+=s16;
                    ss16+=s16;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d16").html((s16));
                }
            })
        }
    })

    //暂停用气
    var whereCause17=" c.finishTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasCsrWorkBill b left join gasCtmArchive a on b.customerCode = a.customerCode left join gasCsrWorkBillResult c on b.workBillId = c.workBillId",
            wheres: "a.areaId in ("+loginarea.join()+") and b.billState='4' and  "+ whereCause17 +" and  b.billType like 'WB_STOP%' group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr8=0,lastr8=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d17").html((tr8));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d17").html((tr8));

                    tr8=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d17").html((lastr8));
                    lastr8=0;
                }else{
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr8+=unbolt;
                    //合计
                    lastr8+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d17").html(unbolt)
                }
            });
            var sx17=0;
            var ss17=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s17=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d17']").each(function(i){
                    if(i>0)s17+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d17").html((sx17));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d17").html((sx17));
                    sx17=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d17").html((ss17));
                    ss17=0;
                }else{
                    sx17+=s17;
                    ss17+=s17;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d17").html((s17));
                }
            })
        }
    })


    //拆除户数
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,areaId,gasTypeId,sum(normalNum) normalNum,sum(stopNum) stopNum,sum(longUseNum) longUseNum,sum(noUseNum) noUseNum,sum(dismantleNum) dismantleNum",
            froms: "vmGasReportArchive",
            wheres: "areaId in ("+loginarea.join()+") and reportMonth = '"+(month-1)+"' and reportYear='"+year+"' group by areaId,gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(datas){
            $.ajax({
                url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    cols: "count(1) ctmNum,areaId,gasTypeId,sum(normalNum) normalNum,sum(stopNum) stopNum,sum(longUseNum) longUseNum,sum(noUseNum) noUseNum,sum(dismantleNum) dismantleNum",
                    froms: "vmGasReportArchive",
                    wheres: "areaId in ("+loginarea.join()+") and reportMonth = '"+(month)+"' and reportYear='"+year+"' group by areaId,gasTypeId",
                    page: "false"
                }),
                dataType: "json",
                success:function(data){
                    console.log(datas)
                    console.log(data)
                    var tr18=0,lastr18=0;
                    $("#tbody").find("tr").each(function() {
                        var areaId = $(this).data("areaid");
                        var gasTypeId = $(this).data("gastypeid");
                        var results = getArchiveNum1(datas.rows, areaId, gasTypeId);
                        var result = getArchiveNum1(data.rows, areaId, gasTypeId);
                        if(gasTypeId == "-1" && areaId != "1"){
                            //  居民小计
                            $(this).find("#tbody_r" + areaId + "_c1_d18").html((tr18));
                            //非居民小计
                            $(this).find("#tbody_r" + areaId + "_c2_d18").html((tr18));
                            tr18=0;
                        }else if(gasTypeId == "-2" && areaId != "1"){
                            $(this).find("#tbody_r" + areaId + "_c_d18").html((lastr18));
                            lastr18=0;
                        }else if(areaId != "1"){
                            //小计
                            tr18+=result.dismantleNum - results.dismantleNum;
                            //合计
                            lastr18+=result.dismantleNum - results.dismantleNum;
                            $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d18").html(result.dismantleNum - results.dismantleNum)
                        }
                    });

                    var sx18=0;
                    var ss18=0;
                    $("#tbody").find("[data-areaid='1']").each(function(){
                        var areaId=$(this).data("areaid");
                        var gasTypeId=$(this).data("gastypeid");
                        var s18=0;
                        $("#tbody").find("td[id$='"+gasTypeId+"_d18']").each(function(i){
                            if(i>0)s18+=parseInt($(this).text());
                        });
                        if(gasTypeId == "-1" && areaId == "1"){
                            //  居民小计
                            $(this).find("#tbody_r" + areaId + "_c1_d18").html((sx18));
                            //非居民小计
                            $(this).find("#tbody_r" + areaId + "_c2_d18").html((sx18));
                            sx18=0;
                        }else if(gasTypeId == "-2" && areaId == "1"){
                            $(this).find("#tbody_r" + areaId + "_c_d18").html((ss18));
                            ss18=0;
                        }else{
                            sx18+=s18;
                            ss18+=s18;
                            $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d18").html((s18));
                        }
                    })
                }
            })
        }
    })

    //本月长期不用和本月取消长期不用
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,areaId,gasTypeId,sum(normalNum) normalNum,sum(stopNum) stopNum,sum(longUseNum) longUseNum,sum(noUseNum) noUseNum,sum(dismantleNum) dismantleNum",
            froms: "vmGasReportArchive",
            wheres: "areaId in ("+loginarea.join()+") and reportMonth = '"+(month-1)+"' and reportYear='"+year+"' group by areaId,gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(datas){
            $.ajax({
                url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    cols: "count(1) ctmNum,areaId,gasTypeId,sum(normalNum) normalNum,sum(stopNum) stopNum,sum(longUseNum) longUseNum,sum(noUseNum) noUseNum,sum(dismantleNum) dismantleNum",
                    froms: "vmGasReportArchive",
                    wheres: "areaId in ("+loginarea.join()+") and reportMonth = '"+(month)+"' and reportYear='"+year+"' group by areaId,gasTypeId",
                    page: "false"
                }),
                dataType: "json",
                success:function(data){
                    console.log(datas)
                    console.log(data)
                    var tr19=0,lastr19=0;
                    var tr20=0,lastr20=0;
                    $("#tbody").find("tr").each(function() {
                        var areaId = $(this).data("areaid");
                        var gasTypeId = $(this).data("gastypeid");
                        var results = getArchiveNum1(datas.rows, areaId, gasTypeId);
                        var result = getArchiveNum1(data.rows, areaId, gasTypeId);
                        if(gasTypeId == "-1" && areaId != "1"){
                            //  居民小计
                            $(this).find("#tbody_r" + areaId + "_c1_d19").html((tr19));
                            $(this).find("#tbody_r" + areaId + "_c1_d20").html((tr20));
                            //非居民小计
                            $(this).find("#tbody_r" + areaId + "_c2_d19").html((tr19));
                            $(this).find("#tbody_r" + areaId + "_c2_d20").html((tr20));
                            tr19=0;
                            tr20=0;
                        }else if(gasTypeId == "-2" && areaId != "1"){
                            $(this).find("#tbody_r" + areaId + "_c_d19").html((lastr19));
                            $(this).find("#tbody_r" + areaId + "_c_d20").html((lastr20));
                            lastr19=0;
                            lastr20=0;
                        }else if(areaId != "1"){
                            //小计
                            tr19+=result.longnouseNum;
                            tr20+=results.longnouseNum - result.longnouseNum;
                            //合计
                            lastr19+=result.longnouseNum;
                            lastr20+=results.longnouseNum - result.longnouseNum;
                            $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d19").html(result.longnouseNum)
                            $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d20").html(results.longnouseNum - result.longnouseNum)
                        }
                    });

                    var sx19=0;
                    var sx20=0;
                    var ss19=0;
                    var ss20=0;
                    $("#tbody").find("[data-areaid='1']").each(function(){
                        var areaId=$(this).data("areaid");
                        var gasTypeId=$(this).data("gastypeid");
                        var s19=0,s20=0;
                        $("#tbody").find("td[id$='"+gasTypeId+"_d19']").each(function(i){
                            if(i>0)s19+=parseInt($(this).text());
                        });
                         $("#tbody").find("td[id$='"+gasTypeId+"_d20']").each(function(i){
                            if(i>0)s20+=parseInt($(this).text());
                        });
                        if(gasTypeId == "-1" && areaId == "1"){
                            //  居民小计
                            $(this).find("#tbody_r" + areaId + "_c1_d19").html((sx19));
                            $(this).find("#tbody_r" + areaId + "_c1_d20").html((sx20));
                            //非居民小计
                            $(this).find("#tbody_r" + areaId + "_c2_d19").html((sx19));
                            $(this).find("#tbody_r" + areaId + "_c2_d20").html((sx20));
                            sx19=0;
                            sx20=0;
                        }else if(gasTypeId == "-2" && areaId == "1"){
                            $(this).find("#tbody_r" + areaId + "_c_d19").html((ss19));
                            $(this).find("#tbody_r" + areaId + "_c_d20").html((ss20));
                            ss19=0;
                            ss20=0;
                        }else{
                            sx19+=s19;
                            ss19+=s19;
                            sx20+=s20;
                            ss20+=s20;
                            $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d19").html((s19));
                            $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d20").html((s20));
                        }
                    })
                }
            })
        }
    })

    //用气性质民转商
    var whereCause10=" b.createdTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasCsrBusiRegister b left join gasCtmArchive a on b.ctmArchiveId = a.ctmArchiveId",
            wheres: "a.areaId in ("+loginarea.join()+")  and b.billState='3'  and  "+ whereCause10 +" and  b.businessTypeId='CHANGEGT2B' group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr10=0,lastr10=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d10").html((tr10));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d10").html((tr10));

                    tr10=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d10").html((lastr10));
                    lastr10=0;
                }else{
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr10+=unbolt;
                    //合计
                    lastr10+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d10").html(unbolt)
                }
            });
            var sx10=0;
            var ss10=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s10=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d10']").each(function(i){
                    if(i>0)s10+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d10").html((sx10));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d10").html((sx10));
                    sx10=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d10").html((ss10));
                    ss10=0;
                }else{
                    sx10+=s10;
                    ss10+=s10;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d10").html((s10));
                }
            })
        }
    })

    //用气性质变更转民

    var whereCause11=" b.createdTime between to_date('" + start + "','yyyy-MM-dd') and to_date('" + end + "','yyyy-MM-dd') ";
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,a.customerState,a.areaId,a.gasTypeId",
            froms: "gasCsrBusiRegister b left join gasCtmArchive a on b.ctmArchiveId = a.ctmArchiveId",
            wheres: "a.areaId in ("+loginarea.join()+") and b.billState='3' and  "+ whereCause11 +" and  b.businessTypeId='CHANGEGT2R' group by a.customerState,a.areaId,a.gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr10=0,lastr10=0;
            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum(data.rows, areaId, gasTypeId);

                if(gasTypeId == "-1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d11").html((tr10));
                    //非居民小计

                    $(this).find("#tbody_r" + areaId + "_c2_d11").html((tr10));

                    tr10=0;
                }else if(gasTypeId == "-2"){

                    $(this).find("#tbody_r" + areaId + "_c_d11").html((lastr10));
                    lastr10=0;
                }else{
                    var unbolt = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum) + Number(result.dismantleNum)
                    // 小计
                    tr10+=unbolt;
                    //合计
                    lastr10+=unbolt;
                    // console.log(tr2)
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d11").html(unbolt)
                }
            });
            var sx10=0;
            var ss10=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s10=0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d11']").each(function(i){
                    if(i>0)s10+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d11").html((sx10));
                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d11").html((sx10));
                    sx10=0;

                }else if(gasTypeId == "-2" && areaId == "1"){

                    $(this).find("#tbody_r" + areaId + "_c_d11").html((ss10));
                    ss10=0;
                }else{
                    sx10+=s10;
                    ss10+=s10;
                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d11").html((s10));
                }
            })
        }
    })

    //期初IC卡户数

    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "count(1) ctmNum,areaId,gasTypeId,sum(normalNum) normalNum,sum(stopNum) stopNum,sum(longUseNum) longUseNum,sum(noUseNum) noUseNum,sum(dismantleNum) dismantleNum",
            froms: "vmGasReportArchive",
            wheres: "areaId in ("+loginarea.join()+") and customerType='I' and reportMonth = '"+(month-1)+"' and reportYear='"+year+"' group by areaId,gasTypeId",
            page: "false"
        }),
        dataType: "json",
        success:function(data){
            console.log(data)
            var tr2=0,lastr2=0;

            $("#tbody").find("tr").each(function() {
                var areaId = $(this).data("areaid");
                var gasTypeId = $(this).data("gastypeid");
                var result = getArchiveNum1(data.rows, areaId, gasTypeId);
                if(gasTypeId == "-1" && areaId != "1"){
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d26").html((tr2));

                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d26").html((tr2));

                    tr2=0;
                }else if(gasTypeId == "-2" && areaId != "1"){
                    $(this).find("#tbody_r" + areaId + "_c_d26").html((lastr2));
                    lastr2=0;
                }else if(areaId != "1"){
                    var zhengchang = Number(result.nouseNum) + Number(result.normalNum) + Number(result.stopNum)+ Number(result.longnouseNum);
                    // 小计
                    tr2+=zhengchang;
                    //合计
                    lastr2+=zhengchang
                    // console.log(tr2)
                    // s2+=zhengchang,s3+=result.normalNum,s4+=result.nouseNum,s5+=result.stopNum,s6+=result.dismantleNum,s7+=result.longnouseNum;

                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d26").html(zhengchang)
                }
            });
            var sx2=0;
            var ss2=0;
            $("#tbody").find("[data-areaid='1']").each(function(){
                var areaId=$(this).data("areaid");
                var gasTypeId=$(this).data("gastypeid");
                var s2=0;
                var xiaoji = 0;
                $("#tbody").find("td[id$='"+gasTypeId+"_d26']").each(function(i){
                    if(i>0)s2+=parseInt($(this).text());
                });
                if(gasTypeId == "-1" && areaId == "1"){

                    console.log("+++++"+sx2)
                    //  居民小计
                    $(this).find("#tbody_r" + areaId + "_c1_d26").html((sx2));

                    //非居民小计
                    $(this).find("#tbody_r" + areaId + "_c2_d26").html((sx2));
                    sx2=0;
                    // tr2=0,tr3=0,tr4=0,tr5=0,tr6=0,tr7=0;
                }else if(gasTypeId == "-2" && areaId == "1"){
                    $(this).find("#tbody_r" + areaId + "_c_d26").html((ss2));

                    ss2=0;
                }else{
                    console.log(s2)

                    sx2+=s2;
                    ss2+=s2;

                    $(this).find("#tbody_r"+areaId+"_c"+gasTypeId+"_d26").html((s2));

                }
            })
        }
    })


    $("#btn_down_detail").removeClass("disabled");
    $("#btn_down_detail").removeClass("gray");
    $("#btn_down_detail").addClass("green");

    $("#btn_print_page").removeClass("disabled");
    $("#btn_print_page").removeClass("gray");
    $("#btn_print_page").addClass("green");

   /* $("#btn_print_page").removeClass("disabled")
    $("#btn_down_detail").removeClass("disabled")*/
})

function getArchiveNum(data,areaid,gastypeid){
    //建档数,拆除数,未开栓数,暂停数,拆除数,长期不用数
    var nouseNum=0,normalNum=0,stopNum=0,dismantleNum=0,longnouseNum=0;
    //00=未开栓,01=正常 ,02=暂停,03=拆除,04=长期不用,99=逻辑删除
    var nouse="00",normal="01",stop="02",dismantle="03",longnouse="04";
    if(data){
        data.forEach(function(o){
            if(o.customerState){
                if(o.gasTypeId && o.areaId){
                    if(o.gasTypeId.length>2){
                        //建档案数
                        if(o.gasTypeId.substring(0,3)==gastypeid && o.areaId==areaid){
                            if(o.ctmNum){
                                if(o.customerState==nouse){
                                    nouseNum+=o.ctmNum;
                                }
                                if(o.customerState==normal){
                                    normalNum+=o.ctmNum;
                                }
                                if(o.customerState==stop){
                                    stopNum+=o.ctmNum;
                                }
                                if(o.customerState==dismantle){
                                    dismantleNum+=o.ctmNum;
                                }
                                if(o.customerState==longnouse){
                                    longnouseNum+=o.ctmNum;
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    return {nouseNum:nouseNum,normalNum:normalNum,stopNum:stopNum,dismantleNum:dismantleNum,longnouseNum:longnouseNum};
}


function getArchiveNum1(data,areaid,gastypeid){
    //建档数,拆除数,未开栓数,暂停数,拆除数,长期不用数
    var nouseNum=0,normalNum=0,stopNum=0,dismantleNum=0,longnouseNum=0;
    if(data){
        $.each(data,function(index,o){

                if(o.gasTypeId && o.areaId){
                    if(o.gasTypeId.length>2){
                        if(o.gasTypeId.substring(0,3)==gastypeid && o.areaId==areaid){

                            nouseNum+=o.noUseNum;
                            normalNum+=o.normalNum;
                            stopNum+=o.stopNum;
                            longnouseNum+=o.longUseNum;
                            dismantleNum+=o.dismantleNum;

                        }
                    }
                }

        })
    }
    return {nouseNum:nouseNum,normalNum:normalNum,stopNum:stopNum,dismantleNum:dismantleNum,longnouseNum:longnouseNum};
}

//    期初管理户数
/* var whereClause = {
 "cols":"sum(w.a) pt,sum(w.b) db,sum(w.c) dsr,sum(w.d) dk,sum(w.e) cn",
 "froms":"( select count(*) as a,0 as b,0 as c,0 as d,0 as e from gas_ctm_archive where area_id in ('10') and to_char(created_time,'yyyy-mm-dd')  < '2017-07-26' and gas_type_id like '201%' and customer_state in ('00','01','02','04')"
 +"union select 0 as a,count(*) as b,0 as c,0 as d,0 as e from gas_ctm_archive where area_id in ('10') and to_char(created_time,'yyyy-mm-dd')  < '2017-07-26' and gas_type_id like '202%' and customer_state in ('00','01','02','04')"
 +"union select 0 as a,0 as b,count(*) as c,0 as d,0 as e from gas_ctm_archive where area_id in ('10') and to_char(created_time,'yyyy-mm-dd')  < '2017-07-26' and gas_type_id like '203%' and customer_state in ('00','01','02','04')"
 +"union select 0 as a,0 as b,0 as c,count(*) as d,0 as e from gas_ctm_archive where area_id in ('10') and to_char(created_time,'yyyy-mm-dd')  < '2017-07-26' and gas_type_id like '204%' and customer_state in ('00','01','02','04')"
 +"union select 0 as a,0 as b,0 as c,0 as d,count(*) as e from gas_ctm_archive where area_id in ('10') and to_char(created_time,'yyyy-mm-dd')  < '2017-07-26' and gas_type_id like '205%' and customer_state in ('00','01','02','04')"
 +") w",
 "wheres":"",
 "page":false
 };
 $.ajax({
 url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
 type: "POST",
 contentType: "application/json;charset=utf-8",
 data: JSON.stringify(whereClause),
 dataType: "json",
 success: function (data) {
 console.log(data)
 }
 })*/