$(document).ready(function () {
    reloadTable();
});

function reloadTable() {
    $.ajax({
        url: '/Product/Damaged',
        type: 'GET',
        data: 'json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            var Obj = "";
            $.each(result, function (index, value) {
                Obj += '<tr>';
                Obj += '<td>' + value.id + '</td>';
                Obj += '<td>' + value.serial_number + '</td>';
                Obj += '<td>' + String(value.damaged_why) + '</td>';
                Obj += '<td><Button class="btn btn-primary" onclick=hi(' + value.id +')>Repaired?</Button>'
                Obj += '</tr>';
            });
            $("#t-body").html(Obj);
        },
        error: function () {
            alert("Something went wrong");
        }
    });
}

function hi(me) {
    $.confirm({
        title: 'Prompt!',
        content: '' +
            '<form action="" class="formName">' + 
            '<div class="form-check">'+
                    '<label class="form-check-label" for="flexCheckDefault">'+
                        me +' Product is fixed?'+
            '</label>' +
            '<input class="form-check-input ml-3" type="checkbox" value="ddd" id="flexCheckDefault">' +
            '</div>'+
            '<div class="form-group">' +
            '<label>How product is fixed?</label>' +
            '<input type="text" placeholder="Reason" class="name form-control" required />' +
            '</div>' +
            '</form>',
        buttons: {
            formSubmit: {
                text: 'Submit',
                btnClass: 'btn-blue',
                action: function () {
                    var name = this.$content.find('.name').val();
                    if (!name) {
                        $.alert('provide a valid Reason');
                        return false;
                    }
                    var URL = "";
                    if ($('#flexCheckDefault').is(":checked")) {
                        URL = "/product/UpDamage?id=" + me + "&message=" + encodeURIComponent(name)+ "&d=1";
                    }
                    else {
                        URL = "/product/UpDamage?id=" + me + "&message=" + name + "&d=0";
                    }
                    update_repair(URL);
                }
            },
            cancel: function () {
                //close
            },
        },
    });
}

function update_repair(URL) {
    $.ajax({
        url: URL,
        type: 'GET',
        data: 'Json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            if (result.success) {
                reloadTable();
            }
            else {
                alert(result.message);
            }
        },
        error: function () {
            alert("Something went wrong");
        }
    });
}