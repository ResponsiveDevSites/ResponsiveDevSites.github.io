$(document).ready(function () {
    //regex to allow only alphanumeric characters
    var regEx = "^[a-zA-Z0-9]+$";

    $('.validate-chars').on('keyup', function (e) {
        var regex = new RegExp(regEx);
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }

        e.preventDefault();
        return false;
    });

});