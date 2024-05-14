$(document).ready(function () {
    reloadTable();
});

function Edit(i, product, quantity) {
    $("#ID").val(i);
    $("#ProductName").val(product);
    $("#Quantity").val(quantity);
    
}


function Delete(Url) {

    $.confirm({
        title: 'Delete',
        content: 'Are you Sure?',
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


function reloadTable() {
    $.ajax({
        type: 'Get',
        url: '/Order/GetBucket',
        data: 'json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            var Obj = "";
            $.each(result, function (index, value) {
                Obj += '<tr>';
                Obj += '<td>' + value.id + '</td>';
                Obj += '<td>' + value.product.name + '</td>';
                Obj += '<td>' + value.quantity + '</td>';
                Obj += '<td><a class="btn btn-danger" onclick=Delete("/Order/DeleteBucket?id=' + value.id + '")><i class="bi bi-trash"></i> Delete</a></td>';
                Obj += '<td><button class="btn btn-success" onclick=Edit(' + value.id + ',' + value.product_id + ',' + value.quantity+') data-toggle="modal" \
        data-target="#exampleModal">Edit</button></td>';
                Obj += '</tr>';
            })
            $("#t-body").html(Obj);
        }
    });
}



$("#AddProduct").on("submit", function (e) {
    e.preventDefault();
    var Id = $("#ID").val();
    var ProductName = $("#ProductName").val(); 
    var Quantity = $("#Quantity").val(); 
    var obj = {
        id: Id,
        product_id: ProductName,
        quantity: Quantity,
    };
    $.ajax({
        url: '/order/bucketAdd',
        type: 'Post',
        dataType: 'json',
        data: obj,
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

function AddOrder() {
    var ID = 0;
    var Date1 = $("#Date").val();
    var Invoice = $("#Invoice").val();
    var Vendor = $("#vendor_id").val();
    var obj = {
        id: ID,
        arival: Date1,
        invoice_no: Invoice,
        vendor_id: Vendor
    };

    $.ajax({
        url: '/order/AddnewOrder',
        type: 'Post',
        dataType: 'json',
        data: obj,
        success: function (response) {
            if (response.success) {
                toastr["success"](response.message, "Order Added", { timeOut: 5000 });
                document.getElementById("AddProduct").reset();
                document.getElementById("s-form").reset();
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
   
}