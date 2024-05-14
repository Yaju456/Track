var nameSet = new Set();
$(document).ready(function () {
    $("#ClientName").change(function () {
        var selectedOption = $(this).val();
        $("#ClientNumber").val(selectedOption);
    });
    fillCustomer();
    fillOptions();
    reloadTable();
    $("#Quantity").change(function () {
        Getit();
    });
    $("#ProductName").change(function () {
        Getit();
    });
});


$("#AddProduct").on("submit", function (e) {
    e.preventDefault();
    var ID = $("#ID").val();
    var productName = $("#ProductName").val();
    var Quantity = $("#Quantity").val();
    var Serialn_no = [];
    var Chalani_no = $("#MainId").val();
    for (var i = 0; i < Quantity; i++) {
        var sid = "#S-" + i;
        var iid = "#I-" + i;
        var data = {
            Id: $(iid).val(),
            value: $(sid).val()
        };
        Serialn_no.push(data);
    }
    var Class = {
        id: ID,
        product_id: productName,
        quantity: Quantity,
    };
    var DATA = {
        class: Class,
        serial_no: Serialn_no,
        chalani_no: Chalani_no
    }
    $.ajax({
        url: '/Chalani/addChalaniOne',
        type: 'Post',
        dataType: 'json',
        data: DATA,
        success: function (response) {
            if (response.success) {
                toastr["success"](response.message, "Value Added", { timeOut: 5000 });
                document.getElementById("AddProduct").reset();
                reloadTable();
            }
            else {
                toastr["error"](response.message, "Not entered", { timeOut: 5000 });
            }
        },
        error: function (xhr, textStatus, error) {
            console.log("error");
            alert(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        }
    });
});

function fillCustomer() {
    $.ajax({
        url: '/Main/getAllcutomer',
        type: 'Get',
        dataType: 'json',
        contentType: 'application/jon; charset=utf-8',
        success: function (result) {
            $("#ClientName").empty();
            $('#ClientName').append('<option disabled selected value="0">--Select Customer--</option>');
            $("#ClientNumber").empty();
            $('#ClientNumber').append('<option disabled selected value="0">--Customer Number--</option>');
            $.each(result, function (index, value) {
                nameSet.add(String(value.name).toUpperCase());
                $('#ClientName').append('<option value="' + value.id + '">' + value.name + '</option>');
                $('#ClientNumber').append('<option value="' + value.id + '">' + value.phoneNumber + '</option>');

            });
            if ($("#cusSelected").val()) {
                $("#ClientName").val($("#cusSelected").val());
                $("#ClientNumber").val($("#cusSelected").val());
            }
        }
    });
    

}
function reloadTable() {
    var ID = $("#MainId").val();
    var URL = '/Chalani/getChalani?id=' + ID; 
    $.ajax({
        url: URL,
        type: 'Get',
        data: 'json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            var Obj = "";

            $.each(result, function (index, value) {
                Obj += '<tr>';
                Obj += '<td>' + value.product.name + '</td>';
                Obj += '<td>' + value.quantity + '</td >';

                Obj += '<td><a class="btn btn-danger" onclick=Delete("/Chalani/DeleteChalani?id=' + value.id + '")><i class="bi bi-trash"></i> Delete</a></td>';
                Obj += '<td><button class="btn btn-success" onclick=Edit(' + value.id + ',' + value.product_id + ',' + value.quantity + ') data-toggle="modal" \
        data-target="#exampleModal">Edit</button></td>';
                Obj += '</tr>';
            });
            $("#t-body").html(Obj);
        }
    });
}

function Getit() {
    var total = $("#Quantity").val();
    var productId = $("#ProductName").val();
    var URL = '/Bill/SerialId?id=' + $("#ID").val() + '&Qua=' + total + '&pro=' + productId+'&f=1';
    $.ajax({
        url: URL,
        type: 'Get',
        dataType: 'json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            if (result.success) {
                var Obj = "";
                result.value.forEach(function (item, index) {
                    Obj += ' <div class="form-group">\
            <label>Serial no of Product ' + item.id + '</label>\
                <input type="number" hidden id="I-'+ index + '" value="' + item.id + '">\
                <input type="text" class="form-control" id="S-'+ index + '" value="' + item.value + '" placeholder="Serial no">\
                </div>';
                });
                $("#tada").html(Obj);
            }
            else {
                $("#tada").empty();
                toastr["error"](result.message, "Something went wrong", { timeOut: 5000 });
            }
        }
    });
}

function Delete(Url) {

    $.confirm({
        title: 'Delete',
        content: 'Are you sure?',
        buttons: {
            confirm: function () {
                $.ajax({
                    url: Url,
                    type: 'delete',
                    success: function (data) {
                        toastr["success"](data.message, "Value Deleted", { timeOut: 5000 });
                        reloadTable();
                    },

                })
            },
            cancel: function () {
                $.alert('Canceled!');
            }
        }
    });
}

function Edit(i, product, quantity) {
    $("#ID").val(i);
    $("#ProductName").val(product);
    $("#Quantity").val(quantity);
    Getit();
}

function Add() {
    $("#ID").val(0);
    $("#ProductName").val(0);
    $("#Quantity").val(0);
    Getit();
}