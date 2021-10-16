var variantCollection = [];

$(document).ready(function () {

    /* fetches categories and products from local storage,
    if doesnt found, makes an ajax call and then loads Menu and products.*/

    categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    productResult = JSON.parse(localStorage.getItem("productResult"));

    if (categoryResult == null || categoryResult == '') {
        getCategoriesAjax();
        categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    }
    if (productResult == null || productResult == '') {
        getProductsAjax();
        productResult = JSON.parse(localStorage.getItem("productResult"));
    }

    loadProductGallery();

});

function loadProductGallery() {

    var productID = sessionStorage.getItem("productGalleryProductID");
    var product = productResult.filter(function (obj) {
        return (obj[1] === productID)
    });

    var productImageBlock = '';
    var productThumbnailBlock = '';

    for (var i = 1; i < 11; i++) {
        productImageBlock += '<div class="product-item"><img onerror="this.style.display=\'none\'" class="product-single-image" src="ProductImages/' + product[0][3] + '/' + i + '.jpg" data-zoom-image="ProductImages/' + product[0][3] + '/' + i + '.jpg" /> </div>';
        productThumbnailBlock += '<div class="owl-dot"><img onerror="this.style.display=\'none\'" src="ProductImages/' + product[0][3] + '/' + i + '.jpg" /></div>';
    }
    $('#imgGalleryList').html(productImageBlock);
    $('.thumbnail-img-list').html(productThumbnailBlock);
}


