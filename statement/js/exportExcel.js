var TableExport = function () {
    var tableExportTools = function () {
        $(".export-excel").on("click", function (e) {
            e.preventDefault();
            var exportTable = $(this).data("table");
            var filename = $(this).data("filename");
            var ignoreColumn = "";//$(this).data("ignorecolumn");
            $(exportTable).tableExport({
                fileName: filename,
                type: 'excel',
                escape: 'false',
                excelstyles: ['border-bottom', 'border-top', 'border-left', 'border-right'],
                ignoreColumn: '[' + ignoreColumn + ']'
            });
        });
    };
    return {
        init: function () {
            tableExportTools();
        }
    };
}();