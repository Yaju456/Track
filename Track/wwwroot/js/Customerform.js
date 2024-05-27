var nameSet = new Set();
var LocalbodySet = new Set();
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/main/alllocal',
        dataType: 'json',
        contentType: 'application/jon; charset=utf-8',
        success: function (result) {
            $.each(result, function (index, value) {
                LocalbodySet.add(value.name);
            });
            let man = Array.from(LocalbodySet);
            autocomplete(document.getElementById("Name1"), man);
        }
    });

    $('#Name1').on('change', function () {
        // Get the current value of the text box
        hehe();
    });
    $("#CustomerForm").on("submit", function (e) {
        e.preventDefault();
        var Id = $("#ID1").val();
        var Name = $("#Name1").val();
        var PhoneNumber = $("#phoneNumber").val();
        var Province = $("#ProvinceOption").val();
        var District = $("#DistrictOption").val();
        var LocalBody = $("#LocalBodyOption").val();
        var Address = $("#IAddress").val();
        var obj = {
            id: Id,
            name: Name,
            phoneNumber: PhoneNumber,
            provinceId: Province,
            districtId: District,
            localBodyId: LocalBody,
            address: Address
        };

        if (nameSet.has(Name.toUpperCase()) && Id == 0) {
            $.confirm({
                title: 'Name Alread Exists!',
                content: 'Given Customer Name Already Exists are you sure this is new Customer?',
                buttons: {
                    confirm: function () {
                        f_submit(obj);

                    },
                    cancel: function () {
                        $.alert('Canceled!');
                    }
                }
            });
        }
        else {
            f_submit(obj);
        }
    });

});

async function hehe() {
    await sleep(100);
    var currentValue = encodeURIComponent($('#Name1').val());
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/jon; charset=utf-8',
        url: '/main/getAddress?man=' + currentValue,
        success: function (result) {
            if (result.success) {
                $("#ProvinceOption").empty();

                $("#DistrictOption").empty();

                $("#LocalBodyOption").empty();

                $('#ProvinceOption').append('<option  selected value="' + result.pro_id + '">' + result.pro + '</option>');
                $('#DistrictOption').append('<option selected value="' + result.dist_id + '">' + result.dist + '</option>');
                $('#LocalBodyOption').append('<option selected value="' + result.local_id + '">' + result.local + '</option>');

                $('#IAddress').empty();
                $('#IAddress').val(decodeURIComponent(currentValue).split(" ")[0]);

                //$("#Province_me").val();
                //$("#District_me").val(result.dist);
                //$("#Local_me").val(result.local);

            }
            else {
                toastr["error"](result.message, "Bad Resuest", { timeOut: 5000 });
            }
        },
        error: function () {
            alert("Something Went wrong");
        }

    });
}
//function fillOptions() {
//    $.ajax({
//        url: '/Main/getProvince',
//        type: 'Get',
//        success: function (result) {
//            $("#ProvinceOption").empty();
//            $('#DistrictOption').append('<option disabled selected>--Select District--</option>');
//            $('#LocalBodyOption').append('<option disabled selected>--Select Local Body--</option>');
//            $('#ProvinceOption').append('<option disabled selected>--Select Province--</option>');
//            $.each(result, function (index, value) {
//                $('#ProvinceOption').append('<option value="' + value.id + '">' + value.name + '</option>');
//            });

//        }
//    });

//    // populateDistrictSelect($("#ProvinceOption").val());
//    $('#ProvinceOption').change(function () {
//        var selectedOption = $(this).val();
//        populateDistrictSelect(selectedOption);
//    });

//    $('#DistrictOption').change(function () {
//        var selectedOption = $(this).val();
//        populateLocalBodySelect(selectedOption);
//    });

//    $("#LocalBodyOption").change(function () {
//        var selectedOption = $("#LocalBodyOption option:selected").text();
//        var Content = 'Do you want <b>' + selectedOption + ' </b>as your customer Name?';
//        $.confirm({
//            title: 'Name Add',
//            content: Content,
//            buttons: {
//                confirm: function () {
//                    $("#Name1").val(selectedOption);
//                },
//                cancel: function () {
//                    $.alert('Canceled!');
//                }
//            }
//        });

//    })
//}

//function populateDistrictSelect(P_id, cllback) {
//    var URL = '/Main/getDistrict/?id=' + P_id;
//    $('#DistrictOption').empty(); // Clear existing options


//    $.ajax({
//        url: URL,
//        type: 'Get',
//        success: function (result) {
//            $("#DistrictOption").empty();
//            $('#DistrictOption').append('<option disabled selected>--Select District--</option>');
//            $('#LocalBodyOption').empty();
//            $('#LocalBodyOption').append('<option disabled selected>--Select Local Body--</option>');

//            $.each(result, function (index, value) {
//                $('#DistrictOption').append('<option value="' + value.id + '">' + value.name + '</option>');
//            })
//            if (cllback && typeof (cllback) === "function") {
//                cllback();
//            }
//        }
//    });
   
//}

//function populateLocalBodySelect(P_id, callback) {
//    var URL = '/Main/getLocalBody/?id=' + P_id;
//    $('#LocalBodyOption').empty();
//    $.ajax({
//        url: URL,
//        type: 'Get',
//        success: function (result) {
//            $("#LocalBodyOption").empty();
//            $('#LocalBodyOption').append('<option disabled selected>--Select Local Body--</option>');

//            $.each(result, function (index, value) {
//                $('#LocalBodyOption').append('<option value="' + value.id + '">' + value.name + '</option>');
//            })
//            if (callback && typeof (callback) === "function") {
//                callback();
//            }
//        }
//    });
//}


function OneAdd(id, name, phoneNumber, proId, disId, locid) {
    $("#ID1").val(id);
    $("#Name1").val(decodeURIComponent(name));
    $("#phoneNumber").val(phoneNumber);
    hehe();
}

function clearIt() {
    document.getElementById("CustomerForm").reset();
    $("#phoneNumber").val(9800000000);

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
                        if (data.success) {
                            toastr["success"](data.message, "Value Deleted", { timeOut: 5000 });
                            reloadTable("");
                        }
                        else {
                            toastr["error"](data.message, "Value Deleted", { timeOut: 5000 });
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
/////////////////////////////////////////////////////////

function f_submit(obj) {
    $.ajax({
        url: '/Main/CustomerInfo',
        type: 'Post',
        dataType: 'json',
        data: obj,
        success: function (response) {
            if (response.success) {
                toastr["success"](response.message, response.type, { timeOut: 5000 });
                $('#Customer_search').val($('#Name1').val());
                document.getElementById("CustomerForm").reset();
                reloadTable("");
                fillCustomer();
                
                $('#CustomerexampleModal').find('[data-dismiss="modal"]').trigger('click');

            }
            else {
                toastr["error"](response.message, "Not entered", { timeOut: 5000 });
            }
        },
        error: function (how) {
            alert("Missing Form data");
        }
    });
}