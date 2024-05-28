var Commission = [];
var TDS = [];
var VAT = [];
$(document).ready(function () {

    $('.dropdown-btn').click(function () {
        $('.dropdown-content').toggle();
    });

    $(document).click(function (e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown-content').hide();
        }
    });

    $('.dropdown-content input[type="checkbox"]').change(function () {
        var selectedOptions = [];
        $('.dropdown-content input[type="checkbox"]:checked').each(function () {
            selectedOptions.push($(this).val());
        });
        console.log('Selected options:', selectedOptions);
    });



    reloadTable();
    $("#Commission").change(function () {
        if ($(this).is(':checked')) {
            addCoumn('Commission');
        }
        else {
            removeColumn('Commission')
        }
    });

    $("#TDS").change(function () {
        if ($(this).is(':checked')) {
            addCoumn('TDS');
        }
        else {
            removeColumn('TDS')
        }
    });

    $("#VAT").change(function () {
        if ($(this).is(':checked')) {
            addCoumn('VAT');
        }
        else {
            removeColumn('VAT')
        }
    });

});

function removeColumn(columnName) {
    var table = $('#payTable');
    var headerCells = table.find('tr').first().find('th');
    var columnIndex = -1;

    headerCells.each(function (index) {
        if ($(this).text() === columnName) {
            columnIndex = index;
        }
    });

    if (columnIndex > -1)
    {
        table.find('tr').each(function () {
            $(this).find('th, td').eq(columnIndex).remove();
        });
    }

}
function addCoumn(columnName)
{
    var table = $('#payTable');
    var headerRow = table.find('tr').first();
    headerRow.append('<th>' + columnName + '</th>');

    for (var i = 1; i < table[0].rows.length; i++)
    {
        var newRowCell = $('<td></td>');
        if (columnName === 'Commission') {
            newRowCell.text(Commission[i - 1]);
        } else if (columnName === 'TDS') {
            newRowCell.text(TDS[i - 1]);
        } else if (columnName === 'VAT') {
            newRowCell.text(VAT[i - 1]);
        }
        $(table[0].rows[i]).append(newRowCell);
    }
}


function printBill() {
    $("#payTable").printThis();
}
function reloadTable()
{
    $.ajax({
        method: 'GET',
        url: '/payment/getAll',
        dataType: 'json',
        contentType: 'application/jon; charset=utf-8',

        success: function (result) {
            var Obj = "";
            Commission = [];
            TDS = [];
            VAT = [];
            $.each(result, function (index, value) {
                Obj += '<tr>';
                Obj += '<td>' + value.method + '</td>';
                Obj += '<td>' + String(value.pDate).slice(0, 10) + '</td>';
                Obj += '<td>' + value.name+ '</td>';
                Obj += '<td>' + value.bill_no + '</td>';
                Obj += '<td>' + value.amount + '</td>';
                Obj += '</tr>';
                console.log(typeof (value.commission));
                Commission.push(value.commission);
                TDS.push(value.total * 0.015);
                VAT.push(value.total * 0.13); 
            });
            $("#t-body").html(Obj);
        }
    })
}
