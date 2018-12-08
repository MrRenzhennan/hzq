/**
 * Created by jack on 3/25/17.
 */
SideBar.init();
SideBar.activeCurByPage("inventory_check.html");

var href = document.location.href;

var checkstockId = href.substring(href.indexOf("?") + 1, href.length);

$.ajax({
    url:hzq_rest + "gasmtrcheckstock/" + checkstockId,
    type:"GET",
    dateType:"json"
})
.done(function (data) {
    // console.log("the data.rows[0] is : " + data.rows[0].checkstockId);
    $('input, textarea').each(function (index) {
        if(data.rows[0].hasOwnProperty($(this).attr('name'))){
            $(this).val(data.rows[0][$(this).attr('name')]);
        }
    });

});


$.ajax({
    url:hzq_rest + "gasmtrchkstockdetail?query={\"checkstockId\":\"" + checkstockId + "\"}",
    type:"GET",
    dateType:"json"
})
.done(function (data) {
    console.log(data.length);
    var length = data.length;

    var user = staffHelper.getDisplay(checkfield(data[0].userId));
    var stockquantity = 0;
    var checkstockquantity = 0;
    var errorquantity = 0;

    for(var i = 0; i < length; i++){
        $('#detail_body').append(
            '<tr>' +
                '<td>' + meterspecIdHelper.getDisplay(checkfield(data[i].meterspecid)) + '</td>' +
                '<td>' + reskindIdHelper.getDisplay(checkfield(data[i].gasReskindId)) + '</td>' +
                '<td>' + checkfield(data[i].stockquantity) + '</td>' +
                '<td>' + checkfield(data[i].checkstockquantity) + '</td>' +
                '<td>' + checkfield(data[i].errorquantity) + '</td>' +
            '</tr>'
        )

        stockquantity += checkfield(data[i].stockquantity);
        checkstockquantity += checkfield(data[i].checkstockquantity);
        errorquantity += checkfield(data[i].errorquantity);
    }

    $('#user').val(user);
    $('#stockquantity').val(stockquantity);
    $('#checkstockquantity').val(checkstockquantity);
    $('#errorquantity').val(errorquantity);

});

function checkfield(field) {
    if(field == undefined)
        return "";
    return field
}

var reskindIdHelper = RefHelper.create({
    ref_url:'gasmtrreskind',
    ref_col:'reskindId',
    ref_display:'reskindname'
});

var meterspecIdHelper = RefHelper.create({
    ref_url:'gasmtrmeterspec',
    ref_col:'meterspecId',
    ref_display:'name'
});

var staffHelper  = RefHelper.create({
    ref_url:'fcsysuser',
    ref_col:'userId',
    ref_display:'employeename',
});
