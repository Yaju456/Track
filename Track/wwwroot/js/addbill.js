var mySet = new Set();
let count_set = 0;
$(document).ready(function () {
    LoadTable("");
    onClickmyBtn();
});

onClickmyBtn = () => {
    $("#mybtn").click(function (e) {
        e.preventDefault();
        count_set++;
        if (count_set > 3) {
            count_set = 0;
        }
        LoadTable("");
    })
}

function dateSearch() {
    console.log(Date.parse($("#From").val()));
    var from_date = Date.parse($("#From").val());
    var to_date = Date.parse($("#TOo").val());
    
    $.ajax({
        url: '/bill/AllBill',
        type: 'Get',
        dataType: 'json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            var Obj = "";

            $.each(result, function (index, value) {
                console.log(Date.parse(value.date));
                if (Date.parse(value.date) >= from_date && Date.parse(value.date) <= to_date) {
                    Obj += '<tr>';
                    Obj += '<td>' + String(value.date).slice(0, 10) + '</td>';
                    Obj += '<td>' + value.billno + '</td>';
                    Obj += '<td>' + value.customer.name + '</td>';
                    Obj += '<td>' + value.total + '</td>';
                    if (value.payment == null || value.payment == 0) {
                        Obj += '<td style="text-align: center;"><i class="text-danger bi bi-x-circle h1"></i></td>';
                    }
                    else if (value.payment < (value.total - value.total * 0.015)) {
                        Obj += '<td style="text-align: center;"><i class="text-warning bi bi-arrow-clockwise h1"></i></td>';
                    }
                    else {
                        Obj += '<td style="text-align: center;"><i class="text-success bi bi-check2-circle h1"></i></td>';
                    }
                    Obj += '<td> <a href="/bill/check?id=' + value.id + '" class="btn btn-success">View</a>';
                    Obj += '<td> <button class="btn btn-danger" onclick=Delete(' + value.id + ')>Delete</button><td>';
                    Obj += '<td> <a class="btn btn-success" href="/ChalaniToBill/Index/' + value.id + '">Edit</a></button><td>';
                    Obj += '</tr>';
                }
            });
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
        url: '/bill/AllBill',
        type: 'Get',
        dataType: 'json',
        contentType: 'application/ json; charset = utf - 8;',
        success: function (result) {
            var Obj = "";
            let TotalCount = 0;
            $.each(result, function (index, value) {
                let didi = 0;
                if (mval == "" || mval == String(value.billno).toUpperCase()
                    || mval == String(value.total).toUpperCase() ||
                    mval == String(value.customer.name).toUpperCase() ||
                    mval == (String(value.date).slice(0, 10)))
                { 
                    const threshold = value.total - value.total * 0.015;
                    if ((count_set === 1 && (value.payment == null || value.payment < threshold)) ||
                        (count_set === 2 && (value.payment!==null)) ||
                        (count_set === 3 && (value.payment == null || value.payment >= threshold))) {
                        return; // Skip this value
                    }
                    Obj += '<tr>';
                    Obj += '<td>' + String(value.date).slice(0, 10) + '</td>';
                    mySet.add(String(value.date).slice(0, 10));
                    Obj += '<td>' + value.billno + '</td>';
                    mySet.add(String(value.billno).toUpperCase());

                    Obj += '<td>' + value.customer.name + '</td>';
                    mySet.add(String(value.customer.name).toUpperCase());

                    Obj += '<td>' + value.total + '</td>';
                    TotalCount += value.total;
                    mySet.add(String(value.total).toUpperCase());

                    
                    if (value.payment == null || value.payment == 0)
                    {
                        Obj += '<td style="text-align: center;" class="hideit"><i class="text-danger bi bi-x-circle h1"></i></td>';
                        let date = new Date();
                        var diffInMilliseconds = Math.abs(new Date(value.date) - date);
                        console.log(diffInMilliseconds);
                        var diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
                        console.log(diffInDays);
                        if (diffInDays > 5)
                        {
                            didi = 1;
                            //toastr["warning"](value.billno + " Bill still not clear after 5 days", "Unpaid Bill", { timeOut: 5000 });
                        }
                    
                    }
                    else if (value.payment < (value.total - value.total * 0.015)) {
                        Obj += '<td style="text-align: center;" class="hideit"><i class="text-warning bi bi-arrow-clockwise h1"></i></td>';
                    }
                    else {
                        Obj += '<td style="text-align: center;" class="hideit"><i class="text-success bi bi-check2-circle h1"></i></td>';
                    }
                    Obj += '<td class="hideit"> <a href="/bill/check?id=' + value.id + '" class="btn btn-success">View</a>';
                    Obj += '<td class="hideit"> <button class="btn btn-danger" onclick=Delete(' + value.id + ')>Delete</button><td>';
                    if (value.hasChalani == null) {
                        Obj += '<td class="hideit"> <a class="btn btn-success" href="/bill/CreateBill?id=' + value.id + '">Edit</a></button><td>';
                    }
                    else {
                        Obj += '<td class="hideit"> <a class="btn btn-success" href="/ChalaniToBill/Index/' + value.id + '">Edit</a></button><td>';
                    }
                    if (didi != 0) {
                        Obj +='<td class="hideit"><iframe src="https://giphy.com/embed/oWomIKXp66Lcruo9uT" width="40" height="40" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/stickers/transparent-warning-exclamation-oWomIKXp66Lcruo9uT"></a></p></td>'
                    }
                    Obj += '</tr>';
                }
            });
            autocomplete(document.getElementById("myInput"), Array.from(mySet));
            Obj += '<tr>';
            Obj += ' <td></td> <td></td> ';
            Obj += `<td> <strong> Total: </strong></td> <td> ${TotalCount}</td>`
            Obj += '<td></td> <tdclass="hideit"></td> <tdclass="hideit"></td><tdclass="hideit"></td></tr>';
            $("#t-body").html(Obj);
        }
    });
}




function printAll() {

    $('.hideit').hide();
    $("#BillTable").printThis();
    setTimeout(() => {
        $('.hideit').show();
    }, 3000); 

}

function Delete(id)
{
    var Url = '/bill/Deletebill?id=' + id;
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
                            toastr["error"](data.message, "Error!!!!", { timeOut: 5000 });
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