var protot = 0;
$(document).ready(function () {

    reloadTable();
});

function caltot() {
    for (let i = 0; i < protot; i++) {
        let lili = "#I-" + i;
        let Qlili = "#Q-" + i;
        let Tlili = "#T-" + i;
        $(lili).change(function () {
            console.log(lili);
            var sum = $(lili).val() * Number($(Qlili).html());
            $(Tlili).html(sum);
            Mtot();
        });
    }
}

function Mtot() {
    let total1 = 0;
    for (let i = 0; i < protot; i++) {
        let st = "#T-" + i;
        total1 += Number($(st).html());
    }
    $("#t-otal").html(total1);
    $("#VAT").html(total1*0.13);
    $("#G-total").html(total1+total1 * 0.13);

}
function reloadTable() {
    $.ajax({
        url: '/chalaniToBill/GetBillhasproduct?id=' + $("#Bill_id").val(),
        type: 'Get',
        data: 'json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            var Obj = "";
            var total = 0;
            protot = 0;
            $.each(result, function (index, value) {
                protot++;
                Obj += '<tr>';
                Obj += '<td>' + value.product.name + '</td>';
                Obj += '<td style="width:15rem;"><input type="number" id="I-' + index + '"class="form-control" style="width:10rem" value="' + value.rate + '"/> </td>';

                Obj += '<td id="Q-' + index + '">' + value.quantity + '</td >';

                Obj += '<td id="T-' + index + '">' + value.quantity * value.rate + '</td>';
                total += value.total;
                
                Obj += '</tr>';
            });
            Obj += '<tr>';
            Obj += '<td><td>';
            Obj += '<th>Total</th>';
            Obj += '<td id="t-otal">' + total + '</td>';
            $("#sub-total").val(total);
            Obj += '</tr>';
            var VAT = total * 0.13;
            Obj += '<tr>';
            Obj += '<td><td>';
            Obj += '<th>13% VAT</th>';
            Obj += '<td id="VAT">' + VAT + '</td>';
            Obj += '</tr>';
            Obj += '<tr>';
            Obj += '<td><td>';
            Obj += '<th>G. Total</th>';
            Obj += '<td id="G-total">' + (total + VAT) + '</td>';
            Obj += '</tr>';
            $("#t-body").html(Obj);
            caltot();
        }
    });
}

$("#Client").on("submit", function (e) {
    e.preventDefault();
    var Id = $("#Bill_id").val();
    var Billno = $("#Bill_no").val();
    var Date1 = $("#BDate").val();
    var Bill = {
        id: Id,
        billno: Billno,
        date: Date1,
    };
    var Rates = [];
    for (let i = 0; i < protot; i++) {
        let lili = "#I-" + i;
        Rates.push($(lili).val());
    }
    var data1 = {
        bill: Bill,
        rates: Rates
    }
    $.ajax({
        url: '/ChalaniToBill/BillAdd',
        type: 'Post',
        dataType: 'json',
        data: data1,
        success: function (response) {
            if (response.success) {
                window.location.href = '/bill/Addbill';
            }
            else {
                toastr["error"](response.message, "Not entered", { timeOut: 5000 });

            }
        }
    });
})
