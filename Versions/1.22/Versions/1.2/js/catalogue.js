var sheetAPIBaseURL = "https://sheets.googleapis.com/v4/spreadsheets"
var ExcelfileID = "1ydx9B9s00Jp_Q0PNjQOLERtUC-eAYm6S5_VKBDvBdwA";
var apiKey = "AIzaSyALYSx_H8_qXnLRJvuql7GzfTZ3MvlLdqI";

/*Read categories*/
var categorySheetName = "Categories";
var categoryFromRange = "A1";
var categoryToRange = "A12";

var readCategoryURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + categorySheetName + "!" + categoryFromRange + ":" + categoryToRange + "?key=" + apiKey;
/*Read categories ends*/

/*Read categories*/
var productSheetName = "Products";
var productFromRange = "A1";
var productToRange = "D12";
var readProductURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + productSheetName + "!" + productFromRange + ":" + productToRange + "?key=" + apiKey;
/*Read categories ends*/

var productResult = '';
$(document).ready(function () {
    //fetch categories

    $.ajax({
        type: "GET",
        url: readCategoryURL,
        cache: false,
        dataType: "json",
        success: function (data) {
            let result = data.values.slice(1); //removed first row. it contains column title
            loadMenuCategories(result);
            loadSearchCategories(result);
            loadProductsSideBarCategories(result);
            loadMobileViewMenuCat(result);
        }
    });
    $.ajax({
        type: "GET",
        url: readProductURL,
        cache: false,
        dataType: "json",
        success: function (data) {
            let result = data.values.slice(1); //removed first row. it contains column title
            productResult = result;
            loadFeaturedProducts(result);
            loadProducts(result);
        }
    });



});

/** Home page scripts**/

function loadMenuCategories(categories) {
    let catPart1 = "<li><a href='products.html'>All Categories</a></li>";
    let catPart2 = '';
    let partition = Math.round((categories.length / 2));

    for (let i = 0; i < partition; i++) {
        catPart1 += "<li><a href='products.html?category=" + categories[i] + "'>" + categories[i] + "</a></li>";
    }
    for (let j = partition; j < categories.length; j++) {
        catPart2 += "<li><a href='products.html?category=" + categories[j] + "'>" + categories[j] + "</a></li>";
    }
    $('#catPart1').html(catPart1);
    $('#catPart2').html(catPart2);
}
function loadSearchCategories(categories) {
    let ddlOptions = "<option value=''>All Categories</option>";
    for (let i = 0; i < categories.length; i++) {
        ddlOptions += "<option value=''>" + categories[i] + "</option>";
    }
    $('#searchCat').html(ddlOptions);
}

/** Product page scripts**/

function loadMobileViewMenuCat(categories) {
    let mobileViewMenuCat = '';
    for (let i = 0; i < categories.length; i++) {
        let encodedURL = encodeURIComponent(categories[i]);
        mobileViewMenuCat += "<li><a href='products.html?category=" + encodedURL + "'>" + categories[i] + "</a></li>";
        $('#mobileViewMenuCat').html(mobileViewMenuCat);
    }
}
function loadProductsSideBarCategories(categories) {
    let sidebarCat = "<li><a href='products.html'>All Categories</a></li>";
    for (let i = 0; i < categories.length; i++) {
        let encodedURL = encodeURIComponent(categories[i]);
        sidebarCat += "<li><a href='products.html?category=" + encodedURL + "'>" + categories[i] + "</a></li>";
    }
    $('#sidebarCat').html(sidebarCat);
}

function loadProducts(products) {

    var locationValue = (new URL(location.href)).searchParams.get('category')
    if (locationValue != null) {

        products = products.filter(function (obj) {
            return (obj[0] === locationValue)
        });
    }
    let productBlock = '';
    for (let i = 0; i < products.length; i++) {
        productBlock += '<div class="col-6 col-sm-4"><div class="product-default inner-quickview inner-icon"><figure><a href="#"><img src="ProductImages/' + products[i][2] + '"></a><a href="javascript:" class="btn-quickview" onclick="quickView(\'' + products[i][2] + '\')" title="Quick View">Quick View</a></figure><div class="product-details"><div class="category-wrap"><div class="category-list"><a href="#" class="product-category">' + products[i][0] + '</a></div></div><h3 class="product-title"><a href="#">' + products[i][1] + '</a></h3></div></div></div>';

    }
    $('#productBlock').html(productBlock);
}
function loadFeaturedProducts(products) {
    let featuredProductBlock = '';
    for (let i = 0; i < 8; i++) {
        let product = products[Math.floor(Math.random() * products.length)];
        featuredProductBlock += '<div class="product-default inner-quickview inner-icon"><figure><a href="product.html"><img src="ProductImages/' + product[2] + '"></a><a href="javascript:" class="btn-quickview" onclick="quickView(\'' + product[2] + '\')"  title="Quick View">Quick View</a> </figure> <div class="product-details"> <div class="category-wrap"> <div class="category-list"> <a href="#" class="product-category">' + product[0] + '</a> </div> </div> <h3 class="product-title"> <a href="#">' + product[1] + '</a> </h3>  </div></div>';
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

function quickView(productImage) {
    let product = productResult.filter(function (obj) {
        return (obj[2] === productImage)
    });

    $('#quickViewProductImage').attr('src', 'ProductImages/' + productImage);
    $('#quickViewProductName').html(product[0][1]);
    $('#quickViewProductDescription').html(product[0][3]);
    $('#quickView').modal('show');
}
