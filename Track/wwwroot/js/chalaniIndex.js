var mySet = new Set();
$(document).ready(function () {
    LoadTable("");
});


function dateSearch() {
    console.log(Date.parse($("#From").val()));
    var from_date = Date.parse($("#From").val());
    var to_date = Date.parse($("#TOo").val());
    $.ajax({
        url: '/chalani/getAllChalani',
        type: 'Get',
        dataType: 'json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            var Obj = "";

            $.each(result, function (index, value) {
                if (Date.parse(value.send) >= from_date && Date.parse(value.send) <= to_date)
                {
                    Obj += '<tr>';
                    Obj += '<td>' + String(value.send).slice(0, 10) + '</td>';
                    mySet.add(String(value.send).slice(0, 10));
                    Obj += '<td>' + value.address + '</td>';
                    mySet.add(String(value.address).toUpperCase());

                    Obj += '<td>' + value.phoneNumber + '</td>';
                    mySet.add(String(value.phoneNumber).toUpperCase());

                    Obj += '<td>' + value.customer.name + '</td>';
                    mySet.add(String(value.customer.name).toUpperCase());
                    Obj += '<td> <a href="/Chalani/CreateChalani?id=' + value.id + '" class="btn btn-success">View</a>';
                    Obj += '<td> <button class="btn btn-danger" onclick=Delete(' + value.id + ')>Delete</button><td>';
                    Obj += '</tr>';
                }
            });
            autocomplete(document.getElementById("myInput"), Array.from(mySet));
            $("#t-body").html(Obj);
        }
    });
    
}

$("#form-search").on("submit", function (e) {
    e.preventDefault();
    var mval = String($("#myInput").val()).toUpperCase();
    LoadTable(mval);
});
function LoadTable(mval) {
    $.ajax({
        url: '/chalani/getAllChalani',
        type: 'Get',
        dataType: 'json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            var Obj = "";

            $.each(result, function (index, value) {
                if (mval == "" || mval == String(value.remarks).toUpperCase()
                    || mval == String(value.address).toUpperCase() ||
                    mval == String(value.customer.name).toUpperCase() ||
                    mval == (String(value.send).slice(0, 10))) {
                    Obj += '<tr>';
                    Obj += '<td>' + String(value.send).slice(0, 10) + '</td>';
                    mySet.add(String(value.send).slice(0, 10));
                    Obj += '<td>' + value.address + '</td>';
                    mySet.add(String(value.address).toUpperCase());

                    Obj += '<td>' + value.phoneNumber + '</td>';
                    mySet.add(String(value.phoneNumber).toUpperCase());

                    Obj += '<td>' + value.customer.name + '</td>';
                    mySet.add(String(value.customer.name).toUpperCase());
                    Obj += '<td> <a href="/Chalani/CreateChalani?id=' + value.id + '" class="btn btn-success">View</a>';
                    Obj += '<td> <button class="btn btn-danger" onclick=Delete(' + value.id + ')>Delete</button><td>';
                    Obj += '</tr>';
                }
            });
            autocomplete(document.getElementById("myInput"), Array.from(mySet));
            $("#t-body").html(Obj);
        }
    });
}

function Delete(id) {
    var Url = '/chalani/DeleteAllChalan?id=' + id;
    $.confirm({
        title: 'Delete',
        content: 'Are you Sure?',
        buttons: {
            confirm: function () {
                $.ajax({
                    url: Url,
                    type: 'delete',
                    success: function (data) {
                        if (data.success) {
                            toastr["success"](data.message, "Value Deleted", { timeOut: 5000 });
                            LoadTable("");
                        }
                        else {
                            toastr["Error"](data.message, "Error", { timeOut: 5000 });
                        }
                    },

                })
            },
            cancel: function () {
                $.alert('Canceled!');
            }
        }
    });
}