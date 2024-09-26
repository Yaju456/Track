var mySet = new Set();
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



    reloadTable("");
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

    LoadUpTable();

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


$("#form-search").on("submit", function (e) {
    e.preventDefault();
    var mval = String($("#myInput").val()).toUpperCase();
    reloadTable(mval);
});

function reloadTable(mval)
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
                if (mval == "" || mval == String(value.method).toUpperCase()
                    || mval == String(String(value.pDate).slice(0, 10)).toUpperCase() || mval == String(value.name).toUpperCase() ||
                    mval == String(value.bill_no).toUpperCase())
                {
                    Obj += '<tr>';
                    Obj += '<td>' + String(value.pDate).slice(0, 10) + '</td>';
                    Obj += '<td>' + value.name + '</td>';
                    Obj += '<td>' + value.bill_no + '</td>';
                    Obj += '<td>' + value.amount + '</td>';
                    Obj += '</tr>';
                    console.log(typeof (value.commission));
                    Commission.push(value.commission);
                    TDS.push(value.total * 0.015);
                    VAT.push(value.total * 0.13);
                    mySet.add(value.method);
                    mySet.add(String(value.pDate).slice(0, 10));
                    mySet.add(String(value.name));
                    mySet.add(String(value.bill_no));
                    mySet.add(String(value.amount));
                    autocomplete(document.getElementById("myInput"), Array.from(mySet));
                }
            });
            $("#t-body").html(Obj);
        }
    })
}

function LoadUpTable() {
    $.ajax({
        url: '/bill/AllBill',
        type: 'Get',
        dataType: 'json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            var Obj = "";
            let total = 0;
            $.each(result, function (index, value) {
                const threshold = value.total - value.total * 0.015;
                if (value.payment == null || value.payment < threshold) {
                    Obj += '<tr>';
                    Obj += `<td>${String(value.date).slice(0, 10)}</td>`;
                    Obj += `<td>${value.billno}</td>`;
                    Obj += `<td>${value.customer.name}</td>`;
                    Obj += `<td>${value.total}<td>`;
                    total += value.total;
                    Obj += '</tr>';
                }
               
            });
            Obj +=
                `<tr>
                    <td></td>
                    <td></td>
                    <td><strong>G Total </strong></td>
                    <td>${total}</td>
                </tr>`
            $("#Tup-body").html(Obj);
        }
    });
}