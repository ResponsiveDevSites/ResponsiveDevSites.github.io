
$(document).ready(function () {

    if (categoryResult == null || categoryResult == '') {
        getCategoriesAjax();
        categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    }
    else {
        categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
        loadMenuCategories(categoryResult);
        loadSearchCategories(categoryResult);
        loadMobileViewMenuCat(categoryResult);
    }
    if (productResult == null || productResult == '') {
        getProductsAjax();
        productResult = JSON.parse(localStorage.getItem("productResult"));
    }
    else {
        loadFeaturedProducts(productResult);
    }
    updateCartCount();
});

function loadFeaturedProducts(products) {
    var featuredProductBlock = '';
    for (var i = 0; i < 8; i++) {
        var product = products[Math.floor(Math.random() * products.length)];
        featuredProductBlock += '<div class="product-default inner-quickview inner-icon"><figure><a onclick="navigateToProductDetails(\'' + product[1] + '\')\" href="javascript:"><img src="ProductImages/' + product[3] + '"></a><a href="javascript:" class="btn-quickview" onclick="quickView(\'' + product[1] + '\')"  title="Quick View">Quick View</a> </figure> <div class="product-details"> <div class="category-wrap"> <div class="category-list"> <a href="javascript:" class="product-category">' + product[0] + '</a> </div> </div> <h3 class="product-title"> <a href="productdetails.html">' + product[2] + '</a> </h3>  </div></div>';
    }

    $('#featuredProductBlock').html(featuredProductBlock);

    var newSliderOptions = {
        "loop": false,
        "margin": 20,
        "responsiveClass": true,
        "nav": false,
        "navText": [
            "<i class=\"icon-angle-left\">",
            "<i class=\"icon-angle-right\">"
        ],
        "dots": true,
        "autoplay": false,
        "autoplayTimeout": 15000,
        "items": 2,
        "responsive": {
            "576": {
                "items": 3
            },
            "992": {
                "items": 4
            }
        }
    };
    $('#featuredProductBlock').addClass('products-slider owl-carousel');
    $('#featuredProductBlock').owlCarousel(newSliderOptions);

}
function quickView(productID) {
    var product = productResult.filter(function (obj) {
        return (obj[1] === productID)
    });

    $('#quickViewProductImage').attr('src', 'ProductImages/' + product[0][3]);
    $('#quickViewProductName').html(product[0][2]);
    $('#quickViewProductDescription').html(product[0][4]);
    $('#quickView').modal('show');
}
function navigateToProductDetails(productID) {
    sessionStorage.setItem("selectedProductID", productID);
    window.location.href = "productdetails.html";
}
 