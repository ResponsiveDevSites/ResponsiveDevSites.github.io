var variantCollection = [];

$(document).ready(function () {

    /* fetches categories, products and product details from local storage,
   if doesnt found, makes an ajax call and then loads Menu and product details.*/

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
    if (productVariantsResult == null || productVariantsResult == '') {
        getProductVariantsAjax();
        productVariantsResult = JSON.parse(localStorage.getItem("productVariantsResult"));
    } else {
        loadProductDetails();
    }

    updateCartCount();

});


function loadProductDetails() {

    var productID = "";
    if (sessionStorage.getItem("cartProductToEdit") != null && sessionStorage.getItem("cartProductToEdit") != '') {
        productID = sessionStorage.getItem("cartProductToEdit");
    } else {

        productID = sessionStorage.getItem("selectedProductID");

        if (localStorage.getItem("cart") != "" && localStorage.getItem("cart") != null) {

            var isItemExistInCart = JSON.parse(localStorage.getItem("cart"));
            if (isItemExistInCart != null) {
                isItemExistInCart = isItemExistInCart.filter(function (obj) {
                    return (obj.ProductID === productID);
                });
            }
            if (isItemExistInCart != null && isItemExistInCart.length > 0) {
                sessionStorage.setItem("cartProductToEdit", productID);
            }
        }

    }

    if (productID != null) {

        $('#hdnProductID').val(productID);

        var product = productResult.filter(function (obj) {
            return (obj[1] === productID)
        });

        var productDetails = productVariantsResult.filter(function (obj) {
            return (obj[0] === productID)
        });

        $('#productDetailImage').attr('src', 'ProductImages/' + product[0][3]);
        $('#productDetailProductName').html(product[0][2]);
        $('#productDetailProductDescription').html(product[0][4]);

        for (var i = 0; i < productDetails.length; i++) {
            var isUniqueVariant = true;
            for (var j = 0; j < variantCollection.length; j++) {
                if (productDetails[i][3] == variantCollection[j]) {
                    isUniqueVariant = false;
                    break;
                }
            }
            if (isUniqueVariant == true) {
                variantCollection.push(productDetails[i][3]);
            }
        }

        var variantTableHeaderBlock = '<tr>';


        variantCollection.filter(function (obj) {
            variantTableHeaderBlock += '<th class="">' + obj + '</th>';
        });

        if (variantCollection.length > 0) {
            variantTableHeaderBlock += '<th class="" style="width:115px">Quantity</th><th class="text-center">Delete</th></tr>';
        }
        else {
            variantTableHeaderBlock += '<th class="" style="width:115px">Quantity</th></tr>';
            $('#btnAddRow').addClass('hide');
        }


        $('#tblVariantsHeader').html(variantTableHeaderBlock);

        if (sessionStorage.getItem("cartProductToEdit") != null && sessionStorage.getItem("cartProductToEdit") != '') {

            var productIDtoEdit = sessionStorage.getItem("cartProductToEdit");
            var existingCart = JSON.parse(localStorage.getItem("cart"));
            existingCart = existingCart.filter(function (obj) {
                return (obj.ProductID === productIDtoEdit)
            });

            for (var i = 0; i < existingCart.length; i++) {
                addRow();
                var existingCartItem = existingCart[i];

                var trow = $('#tblVariantsBody tr')[i];
                $(trow).find('td').each(function (ind, obj) {

                    if ($(obj).attr('data-variant') == "quantity") {
                        $(obj).find("input").val(existingCartItem.Quantity)
                    }
                    else if ($(obj).attr('data-variant') != null) {
                        var existingCartItemVariant = existingCartItem.cartItemVariant[$(obj).attr('data-variant')];
                        $(obj).find('select').val(existingCartItemVariant);
                    }
                });

                initalizeSelect2();
                responsiveTable();
                $('.custom-ddl-color').trigger({
                    type: 'select2:select'
                });
            }
        }
        else {
            addRow();
        }
        sessionStorage.setItem("cartProductToEdit", '');
    }
}

function addRow() {
    var rowIndex = $('#tblVariantsBody tr').length;
    var productID = $('#hdnProductID').val();

    var productDetails = productVariantsResult.filter(function (obj) {
        return (obj[0] === productID)
    });

    for (var i = 0; i < productDetails.length; i++) {
        var isUniqueVariant = true;
        for (var j = 0; j < variantCollection.length; j++) {
            if (productDetails[i][3] == variantCollection[j]) {
                isUniqueVariant = false;
                break;
            }
        }
        if (isUniqueVariant == true) {
            variantCollection.push(productDetails[i][3]);
        }
    }

    var variantTableTrBlock = '<tr>';

    variantCollection.filter(function (obj) {

        var variantTableTdBlock = '';
        if (obj == "Color") {
            variantTableTdBlock = '<td class="" data-variant="' + obj + '"><select class="custom-ddl-color" type="dropdown" style="height:34px"><option value="">Select one</option>';
        } else {
            variantTableTdBlock = '<td class="" data-variant="' + obj + '"><select class="custom-ddl" type="dropdown" style="height:34px;"><option value="">Select one</option>';
        }

        productDetails.filter(function (obj2) {
            if (obj == obj2[3]) {
                if (obj == "Color") {
                    variantTableTdBlock += '<option value="' + obj2[2] + '">' + obj2[4] + '</option>';
                }
                else {
                    variantTableTdBlock += '<option value="' + obj2[2] + '">' + obj2[4] + '</option>';
                }
            }
        });
        variantTableTdBlock += '</select></td>';
        variantTableTrBlock += variantTableTdBlock;
    });

    if (variantCollection.length > 0) {
        variantTableTrBlock += '<td class="" data-variant="quantity"><input type="number" class="form-input qty-number" style="height:34px;" placeholder="Quantity"></td><td class="text-center"><button data-rowindex="' + (rowIndex + 1) + '" type="button" class="btn btn-danger btn-xs removeRow"><i class="fa fa-trash"></i></button> </td></tr>';
    }
    else {
        variantTableTrBlock += '<td class="text-center" data-variant="quantity"><input type="number" class="form-input qty-number" style="height:34px;" placeholder="Quantity"></td></tr>';

    }

    $('#tblVariantsBody').append(variantTableTrBlock);

    if ($('#tblVariantsBody tr').length == 1) {
        $('.removeRow').addClass('hide');
    }
    else {
        $($('.removeRow')[0]).removeClass('hide');
    }
    initalizeSelect2();
    responsiveTable();
}

$(document).on('click', '.removeRow', function () {
    $('#hdnValueToDelete').val($(this).attr('data-rowindex'));
    $('#confirmDelete').modal('show');
});

function removeRow() {
    var valueToDelete = $('#hdnValueToDelete').val();
    var current = $("#tblVariantsBody tr").find('[data-rowindex=' + valueToDelete + ']');
    $(current).closest('tr').remove();
    if ($('#tblVariantsBody tr').length == 1) {
        $($('.removeRow')[0]).addClass('hide');
    }
    $('#confirmDelete').modal('hide');
}

function addToCart(finalize) {
    var isValid = true;
    var isDuplicate = false;
    var cartObj = [];

    $("#tblVariantsBody tr").each(function (index, object) {

        var cartItem = {};
        var cartItemVariant = {};
        cartItem["ProductID"] = $('#hdnProductID').val();

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var mm = monthNames[today.getMonth()]; //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '-' + mm + '-' + yyyy;
        cartItem["CreatedDate"] = today;
        cartItem["CartRowIndex"] = '';

        $(object).find('td').each(function (ind, obj) {

            if ($(obj).attr('data-variant') == "quantity") {

                if ($(obj).find("input").val() != null && $(obj).find("input").val() != "") {
                    cartItem["Quantity"] = $(obj).find("input").val();
                }
                else {
                    isValid = false;
                }
            }
            else if ($(obj).attr('data-variant') != null) {
                if ($(obj).find("select").val() != null && $(obj).find("select").val() != "" && $(obj).attr('data-variant') != "") {
                    cartItemVariant[$(obj).attr('data-variant')] = $(obj).find("select").val();
                }
                else {
                    isValid = false;
                }

            }
        });
        cartItem.cartItemVariant = cartItemVariant;
        cartObj.push(cartItem);

    });

    var compareToIndex = 0;

    cartObj.filter(function (obj) {

        var compareWithIndex = 0;
        cartObj.filter(function (obj2) {
            if (compareToIndex != compareWithIndex) {
                if (JSON.stringify(obj.cartItemVariant) == JSON.stringify(obj2.cartItemVariant)) {
                    isDuplicate = true;
                    isValid = false;

                }
            }

            compareWithIndex = compareWithIndex + 1;
        })
        compareToIndex = compareToIndex + 1;
    })



    if (isValid) {

        if (localStorage.getItem("cart") != null && localStorage.getItem("cart") != '') {

            var existingCart = JSON.parse(localStorage.getItem("cart"));

            existingCart = existingCart.filter(function (obj) {
                return obj.ProductID != $('#hdnProductID').val();
            });

            cartObj = cartObj.concat(existingCart);
        }

        for (var i = 0; i < cartObj.length; i++) {
            cartObj[i].CartRowIndex = i;
        }

        localStorage.setItem("cart", JSON.stringify(cartObj));

        if (finalize == 'true') {
            window.location.href = "review.html"
        }
        $('#validationMsg').removeClass('alert alert-danger');
        $('#validationMsg').addClass('alert alert-success');
        $('#validationMsg').html('Item added..')
    }
    else {

        $('#validationMsg').removeClass('alert alert-success');
        $('#validationMsg').addClass('alert alert-danger');

        if (isDuplicate) {
            $('#validationMsg').html('Duplicate variants selected..')
        }
        else {
            $('#validationMsg').html('Select all options..')
        }

    }
    $('#validationMsg').fadeIn('fast').delay(2000);
    $('#validationMsg').fadeOut('slow').delay(3000).hide(0);
    updateCartCount();
}


function responsiveTable() {

    // inspired by http://jsfiddle.net/arunpjohny/564Lxosz/1/
    $('.table-responsive-stack').each(function (i) {
        var id = $(this).attr('id');
        //alert(id);
        var totalHeaders = $(this).find("th").length;
        $(this).find("th").each(function (i) {
            $('#' + id + ' td:nth-child(' + (i + 1) + ')').find('.table-responsive-stack-thead').remove();
            $('#' + id + ' td:nth-child(' + (i + 1) + ')').addClass((totalHeaders == (i + 1)) && i % 2 == 0 ? 'last-odd' : '');
            //$('#' + id + ' td:nth-child(' + (i + 1) + ')').prepend('<span style="min-width: 35%; display:inline-block" class="table-responsive-stack-thead">' + $(this).text() + ':</span> ');
            // $('.table-responsive-stack-thead').hide();
            if ($(this).text() != "Delete") {
                if ($(this).text() == "Color") {
                    $('#' + id + ' td:nth-child(' + (i + 1) + ')').prepend('<span class="table-responsive-stack-thead" style="width: 30%; display:inline-block">' + $(this).text() + ':</span> ');
                }
                else {
                    $('#' + id + ' td:nth-child(' + (i + 1) + ')').prepend('<span class="table-responsive-stack-thead" style="width: 40%; display:inline-block">' + $(this).text() + ':</span> ');
                }

            }
        });

        //$(this).find("th").each(function (i) {
        //    $('#' + id + ' td:nth-child(' + (i + 1) + ')').find('.table-responsive-stack-thead').remove();
        //    if ($(this).text() != "Delete") {
        //        $('#' + id + ' td:nth-child(' + (i + 1) + ')').prepend('<span class="table-responsive-stack-thead" style="width: 40%; display:inline-block">' + $(this).text() + ':</span> ');
        //    }
        //});
    });

    $('.table-responsive-stack').each(function () {
        var thCount = $(this).find("th").length;
        var rowGrow = 100 / thCount + '%';
        //console.log(rowGrow);
        $(this).find("th, td").css('flex-basis', rowGrow);
    });

    function flexTable() {
        if ($(window).width() < 768) {

            $(".table-responsive-stack").each(function (i) {
                $(this).find(".table-responsive-stack-thead").show();
                $(this).find('thead').hide();
            });
            $($('.table-responsive-stack').find('.select2')).each(function (ind, obj) { $(obj).css('width', '50%') })
            $($('.table-responsive-stack').find('input[type=number]')).each(function (ind, obj) { $(obj).css('width', '50%') })

        } else {
            $(".table-responsive-stack").each(function (i) {
                $(this).find(".table-responsive-stack-thead").hide();
                $(this).find('thead').show();
            });

            $($('.table-responsive-stack').find('.select2')).each(function (ind, obj) {
                if ($(obj).closest('td').data('variant') == "Color") {
                    $(obj).css('width', '80%')
                }
                else {
                    $(obj).css('width', '100%')
                }
            })
            $($('.table-responsive-stack').find('input[type=number]')).each(function (ind, obj) { $(obj).css('width', '100%') })
        }
        // flextable   
    }

    flexTable();

    window.onresize = function (event) {
        flexTable();
    };
    // document ready  

}
function initalizeSelect2() {
    $('.custom-ddl-color').select2({
        templateResult: formatOptions
    });
    $('.custom-ddl').select2();
}

function formatOptions(option) {
    if (!option.id) {
        return option.text;
    }
    
    var $option = $(
        '<span><i class="fa fa-square" style="font-size:20px; color:' + option.element.value.toLowerCase() + '" /> ' + option.text + '</span>'
    );
    return $option;
};

$(document).on('select2:select', '.custom-ddl-color', function (e) {
    $(this).parent().find('#selectedColorSample').remove();
    $(this).parent().find('.select2-container').after('<span id="selectedColorSample" style="display:inline-block;background-color:' + $(this).val() + ';height:15px;width:15px; margin-left:10px"></span>')
});

