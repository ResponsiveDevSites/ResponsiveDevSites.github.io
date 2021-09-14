

$(document).ready(function () {

    categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    productResult = JSON.parse(localStorage.getItem("productResult"));
    productVariantsResult = JSON.parse(localStorage.getItem("productVariantsResult"));

    if (categoryResult == null || categoryResult == '') {
        getCategoriesAjax();
        categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
        loadMenuCategories(categoryResult);
        loadSearchCategories(categoryResult);
        loadMobileViewMenuCat(categoryResult);
    }
    else {
        loadMenuCategories(categoryResult);
        loadSearchCategories(categoryResult);
        loadMobileViewMenuCat(categoryResult);
    }
    if (productResult == null || productResult == '') {
        getProductsAjax();
        productResult = JSON.parse(localStorage.getItem("productResult"));
    }
    else {
        productResult = JSON.parse(localStorage.getItem("productResult"));
    }
    if (productVariantsResult == null || productVariantsResult == '') {
        getProductVariantsAjax();
        productVariantsResult = JSON.parse(localStorage.getItem("productVariantsResult"));
    }
    else {
        loadReviewCart();
    }
    updateCartCount();
});
function loadReviewCart() {
    var cartObj = [];

    if (sessionStorage.getItem("showPreviousCart") == "1") {
        if (localStorage.getItem("previousCart") != null && localStorage.getItem("previousCart") != '' && localStorage.getItem("previousCart") != "[]") {
            cartObj = JSON.parse(localStorage.getItem("previousCart"));
        }

    }
    else {
        if (localStorage.getItem("cart") != null && localStorage.getItem("cart") != '' && localStorage.getItem("cart") != "[]") {
            cartObj = JSON.parse(localStorage.getItem("cart"));
        }
    }
    if (cartObj.length > 0) {

        var cartItemBlock = '';
        for (var i = 0; i < cartObj.length; i++) {

            var product = productResult.filter(function (obj) {
                return (obj[1] == cartObj[i].ProductID);
            });
            cartItemBlock += '<tr><td class="product-col"><figure class="product-image-container"><a href="javascript:" class="product-image"> <img id="reviewProductImage" src="ProductImages/' + product[0][3] + '" alt="product"> <input type="hidden" id="reviewProductID" /> </a> </figure> <div class="widget widget-categories"> <h4 class="widget-title">' + product[0][2] + '</h4> <ul class="list">@@VariantOptions</div> </td>  <td><div style="vertical-align:bottom; padding: 20px 0px 20px 0px;"><button onclick="editCart(\'' + product[0][1] + '\')" class="btn btn-xs-edit btn-info" type="button"><i class="fa fa-edit"></i></button></div><div style="vertical-align:bottom"> <button data-rowindex="' + cartObj[i].CartRowIndex + '" class="btn btn-xs-delete btn-danger" type="button"><i class="fa fa-trash"></i></button></div></td></tr>';
            // 
            var variantList = $.map(cartObj[i].cartItemVariant, function (value, key) {
                return [[key, value]];
            });

            var variantBlock = '<li><a href="javascript:">Quantity : <span class="">' + cartObj[i].Quantity + '</span></a></li>';

            for (var j = 0; j < variantList.length; j++) {

                var currentVariant = productVariantsResult.filter(function (obj) {
                    return (obj[2] == variantList[j][1] && obj[0] == cartObj[i].ProductID);
                });

                if (variantList[j][0] == "Color") {

                    variantBlock += '<li><a href="javascript:">Color:  <span class="">' + currentVariant[0][4] + '</span> | <div style="background-color: ' + variantList[j][1] + '; height: 20px; width: 20px; display: inline-block; margin-bottom: -5px;"></div></a> </li>';
                }
                else {
                    variantBlock += '<li><a href="javascript:">' + variantList[j][0] + ': <span class="">' + currentVariant[0][4] + '</span></a></li>';
                }
            }
            variantBlock += '<li><a href="javascript:">Created Date: <span class="">' + cartObj[i].CreatedDate + '</span></a></li>';
            cartItemBlock = cartItemBlock.replace("@@VariantOptions", variantBlock);
        }

        $('#reviewCart').html(cartItemBlock);

    }
    else {
        if (sessionStorage.getItem("showPreviousCart") == "1") {
            $('#reviewCart').html('<tr><td  colspan="3">No Previous Cart..</td></tr>');
        }
        else {
            $('#reviewCart').html('<tr><td  colspan="3">No Items..</td></tr>');
        }
        $('#btnSubmitOrder').addClass('disabled');
    }
    if (sessionStorage.getItem("showPreviousCart") == "1") {
        $('.btn-xs-delete').hide();
        $('.btn-xs-edit').hide();
        $('#activeBreadCrumb').text('Previous Cart');
        $('#btnShowCurrentCart').removeClass('hide');
        $('#btnShowPreviousCart').addClass('hide');

        sessionStorage.setItem("showPreviousCart", "");
    }

}
function confirmClearCart() {
    $('#confirmClearCart').modal('show');
}
function clearCart() {
    $('#confirmClearCart').modal('hide');
    localStorage.setItem("cart", '');
    localStorage.setItem("previousCart", '');
    $('#btnSubmitOrder').addClass('disabled');
    $('#reviewCart').html('<tr><td  colspan="3">No Items..</td></tr>');
    updateCartCount();
    $("#msg-container").removeClass('hide');
    $("#msg").html('Cart cleared...')
    window.setInterval(function () {
        var timeLeft = $("#timeLeft").html();
        if (eval(timeLeft) == 0) {
            window.location.href = "products.html";
        } else {
            $("#timeLeft").html(eval(timeLeft) - eval(1));
        }
    }, 1000);
}
function submitOrder() {

    var existingCart = JSON.parse(localStorage.getItem("cart"));
    localStorage.setItem("previousCart", JSON.stringify(existingCart));

    $("#msg-container").removeClass('hide');
    $("#msg").html('Submitted successfully...')
    window.setInterval(function () {
        var timeLeft = $("#timeLeft").html();
        if (eval(timeLeft) == 0) {
            localStorage.setItem("cart", '');
            window.location.href = "products.html";
        } else {
            $("#timeLeft").html(eval(timeLeft) - eval(1));
        }
    }, 1000);
}
function editCart(ProductID) {
    sessionStorage.setItem('cartProductToEdit', ProductID);
    window.location.href = "productdetails.html"
}
$(document).on('click', '.btn-xs-delete', function () {
    $('#hdnValueToDelete').val($(this).attr('data-rowindex'))
    $('#confirmDelete').modal('show');
});
function deleteCartRow() {
    var cartRowIndex = $('#hdnValueToDelete').val();
    var cartObj = JSON.parse(localStorage.getItem("cart"));
    cartObj = cartObj.filter(function (obj) {
        return obj.CartRowIndex != cartRowIndex;
    });
    localStorage.setItem("cart", JSON.stringify(cartObj));
    loadReviewCart();
    updateCartCount();
    $('#confirmDelete').modal('hide');
}

function switchCart(showPreviousCart) {
    if (showPreviousCart) {
        sessionStorage.setItem("showPreviousCart", "1");
    }
    window.location.href = "review.html";
}