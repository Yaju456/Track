var dataTables;
$(document).ready(function () {
    reloadDataTable();
    $("input[type=checkbox]").click(function () {
        if ($("#idDamaged").is(':checked')) {
            people = prompt("How was it Damaged?");
            if (people == null) {
                $("#Dmessage").val(null);
            }
            else {
                $("#Dmessage").val(people);
            }
        }
    });
});


/////////////
    function reloadDataTable() {
        var Order_id = $("#Value-id").val();
        var URL = "";
        if (Order_id == 0) {
            URL = '/order/getMost';
        } else {
            URL = '/order/get?id=' + Order_id;
        }

        // Check if DataTable instance already exists and destroy it
        if ($.fn.DataTable.isDataTable('#tblData')) {
            $('#tblData').DataTable().clear().destroy();
        }

        dataTables=$('#tblData').DataTable({
            "ajax": {
                url: URL,
                dataSrc: '',
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('AJAX error: ' + textStatus + ' : ' + errorThrown);
                }
            },
            "columns": [
                { data: 'serial_number' },
                { data: 'inStock' },
                { data: 'product.name' },
                { data: 'product.modal' },
                {
                    data: 'isDamaged',
                    "render": function (data, type, row) {
                        if (data) {
                            return `<i class="text-danger bi bi-x-circle h1"></i>`;
                        } else {
                            return `<i class="text-success bi bi-check2-circle h1"></i>`;
                        }
                    }
                },
                {
                    data: null,
                    "render": function (data, type, row) {
                        return `<button type="button" class="btn btn-success" data-toggle="modal"
                        data-bs-target="#exampleModal" onclick="OneAdd(${data.id}, '${data.serial_number}', '${data.isDamaged}')">
                        <i class="bi bi-pencil-square"></i> Edit</button>`;
                    }
                },
                {
                    data: 'id',
                    "render": function (data, type, row) {
                        return `<a class="btn btn-danger" onclick="Delete('/Order/Deletestock?id=${data}')">
                        <i class="bi bi-trash"></i> Delete</a>`;
                    }
                }
            ]
        });
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
                        dataTables.ajax.reload()
                    },

                })
            },
            cancel: function () {
                $.alert('Canceled!');
            }
        }
    });
}

function OneAdd(id, serial_no, isDamaged)
{
    $("#Stock_NO").val(id);
    $("#serial_no").val(serial_no);
    console.log(isDamaged);
    if (isDamaged != "null") {
        $("#idDamaged").prop('checked', true);
    }
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
        keyboard: false
    });
    myModal.show();
}

$("#myForm").on("submit", function (e) {
    e.preventDefault();
    var Id = $("#Stock_NO").val(); 
    var Serial_no = $("#serial_no").val();
    var Customer_id = $("#Customer").val();
    var IsDamaged = $("#idDamaged").is(':checked') ? 'F' : null;
    var Damaged_why = $("#Dmessage").val();
    var obj = {
        id: Id,
        serial_no: Serial_no,
        customer_id: Customer_id,
        isDamaged: IsDamaged,
        damaged_why: Damaged_why
    };

    $.ajax({
        url: '/Order/AddSerial',
        type: 'Post',
        dataType: 'json',
        data: obj,
        success: function (response) {
            if (response.success) {
                toastr["success"](response.message, "Value Added", { timeOut: 5000 });
                document.getElementById("myForm").reset();
                var my_modal = new bootstrap.Modal(document.getElementById('exampleModal'));
                $("#exampleModal").hide();
                $('.modal-backdrop').remove(); 
                dataTables.ajax.reload();
            }
            else {
                toastr["error"](response.message, "Not entered", { timeOut: 5000 });
            }
        },
        error: function (how) {
            alert("Missing Form data");
        }
    })
});



