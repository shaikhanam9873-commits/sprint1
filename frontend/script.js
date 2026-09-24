var API_URL = 'http://localhost:5000/api';
var allProducts = [];
var currentProduct = null;


// ==================== CART ====================

function getCart() {
    var data = localStorage.getItem('cart');

    if (data) {
        return JSON.parse(data);
    }

    return [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {

    var product = null;

    for (var i = 0; i < allProducts.length; i++) {

        if (allProducts[i].productId == productId) {
            product = allProducts[i];
            break;
        }
    }

    if (product == null) {
        return;
    }

    var cart = getCart();
    var found = false;

    for (var j = 0; j < cart.length; j++) {

        if (cart[j].productId == productId) {

            cart[j].quantity =
                cart[j].quantity + 1;

            found = true;
            break;
        }
    }

    if (found == false) {

        cart.push({
            productId: product.productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart(cart);

    alert(product.name + ' added to cart!');
}


function removeFromCart(productId) {

    var cart = getCart();
    var newCart = [];

    for (var i = 0; i < cart.length; i++) {

        if (cart[i].productId != productId) {
            newCart.push(cart[i]);
        }
    }

    saveCart(newCart);
}


function getCartTotal() {

    var cart = getCart();
    var total = 0;

    for (var i = 0; i < cart.length; i++) {

        total =
            total +
            (cart[i].price * cart[i].quantity);
    }

    return total;
}


// ==================== LOGIN / NAV ====================

function getCurrentUser() {

    var data =
        localStorage.getItem('currentUser');

    if (data) {
        return JSON.parse(data);
    }

    return null;
}


function logout() {

    localStorage.removeItem('currentUser');

    window.location.href =
        'login.html';
}


function updateNav() {

    var user = getCurrentUser();

    var authLink =
        document.getElementById('authLink');

    if (authLink == null) {
        return;
    }

    if (user != null) {

        authLink.textContent =
            'LOGOUT (' + user.username + ')';

        authLink.href = '#';

        authLink.onclick = function (e) {

            e.preventDefault();

            logout();
        };

    } else {

        authLink.textContent = 'LOGIN';

        authLink.href =
            'login.html';
    }
}


// ==================== SHOP - ALL PRODUCTS ====================

async function loadProducts() {

    var grid =
        document.getElementById('productGrid');

    if (grid == null) {
        return;
    }

    try {

        var response =
            await fetch(API_URL + '/products');

        allProducts =
            await response.json();

        grid.innerHTML = '';

        for (var i = 0; i < allProducts.length; i++) {

            var product =
                allProducts[i];

            var card =
                document.createElement('div');

            card.className =
                'product-card';

            var imagePath =
                new URL(
                    product.imageUrl,
                    window.location.href
                ).href;

            card.innerHTML =

                '<a href="product.html?id=' +
                product.productId +
                '">' +

                '<div class="img-wrap">' +

                '<img src="' +
                imagePath +
                '" alt="' +
                product.name +
                '">' +

                '</div>' +

                '</a>' +

                '<p class="card-name">' +

                '<a href="product.html?id=' +
                product.productId +
                '">' +

                product.name +

                '</a>' +

                '</p>' +

                '<span class="card-price">₹' +
                product.price.toFixed(2) +
                '</span>' +

                '<button class="card-add-btn" onclick="addToCart(' +
                product.productId +
                ')">' +

                'ADD TO CART' +

                '</button>';

            grid.appendChild(card);
        }

    } catch (error) {

        grid.innerHTML =
            '<p style="color:#d77f88;">' +
            'Could not load products. Make sure the API is running on port 5000.' +
            '</p>';
    }
}


// ==================== HOME - 4 NEW ARRIVALS ====================

async function loadFeaturedProducts() {

    var grid =
        document.getElementById('featuredGrid');

    if (grid == null) {
        return;
    }

    try {

        var response =
            await fetch(API_URL + '/products');

        var products =
            await response.json();

        allProducts =
            products;

        grid.innerHTML = '';

        var count = 0;

        for (var i = 0; i < products.length; i++) {

            var product =
                products[i];

            if (product.section !== 'New Arrival') {
                continue;
            }

            if (count >= 4) {
                break;
            }

            var card =
                document.createElement('div');

            card.className =
                'product-card';

            var imagePath =
                new URL(
                    product.imageUrl,
                    window.location.href
                ).href;

            card.innerHTML =

                '<a href="product.html?id=' +
                product.productId +
                '">' +

                '<div class="img-wrap">' +

                '<img src="' +
                imagePath +
                '" alt="' +
                product.name +
                '">' +

                '</div>' +

                '</a>' +

                '<p class="card-name">' +

                '<a href="product.html?id=' +
                product.productId +
                '">' +

                product.name +

                '</a>' +

                '</p>' +

                '<span class="card-price">₹' +
                product.price.toFixed(2) +
                '</span>' +

                '<button class="card-add-btn" onclick="addToCart(' +
                product.productId +
                ')">' +

                'ADD TO CART' +

                '</button>';

            grid.appendChild(card);

            count++;
        }

    } catch (error) {

        grid.innerHTML =
            '<p style="color:#d77f88;">' +
            'Could not load new arrivals.' +
            '</p>';
    }
}


// ==================== NEW ARRIVALS PAGE - 6 ====================

async function loadNewArrivalsProducts() {

    var grid =
        document.getElementById('newArrivalsGrid');

    if (grid == null) {
        return;
    }

    try {

        var response =
            await fetch(API_URL + '/products');

        var products =
            await response.json();

        allProducts =
            products;

        grid.innerHTML = '';

        var count = 0;

        for (var i = 0; i < products.length; i++) {

            var product =
                products[i];

            if (product.section !== 'New Arrival') {
                continue;
            }

            if (count >= 6) {
                break;
            }

            var card =
                document.createElement('div');

            card.className =
                'product-card';

            var imagePath = product.imageUrl;

            card.innerHTML =

                '<a href="product.html?id=' +
                product.productId +
                '">' +

                '<div class="img-wrap">' +

                '<img src="' +
                imagePath +
                '" alt="' +
                product.name +
                '">' +

                '</div>' +

                '</a>' +

                '<p class="card-name">' +

                '<a href="product.html?id=' +
                product.productId +
                '">' +

                product.name +

                '</a>' +

                '</p>' +

                '<span class="card-price">₹' +
                product.price.toFixed(2) +
                '</span>' +

                '<button class="card-add-btn" onclick="addToCart(' +
                product.productId +
                ')">' +

                'ADD TO CART' +

                '</button>';

            grid.appendChild(card);

            count++;
        }

    } catch (error) {

        grid.innerHTML =
            '<p style="color:#d77f88;">' +
            'Could not load new arrivals.' +
            '</p>';
    }
}


// ==================== COLLECTION - 6 ====================

async function loadCollectionProducts() {

    var grid =
        document.getElementById('collectionGrid');

    if (grid == null) {
        return;
    }

    try {

        var response =
            await fetch(API_URL + '/products');

        var products =
            await response.json();

        allProducts =
            products;

        grid.innerHTML = '';

        var count = 0;

        for (var i = 0; i < products.length; i++) {

            var product =
                products[i];

            if (product.section !== 'Collection') {
                continue;
            }

            if (count >= 6) {
                break;
            }

            var card =
                document.createElement('div');

            card.className =
                'product-card';

            var imagePath =
                new URL(
                    product.imageUrl,
                    window.location.href
                ).href;

            card.innerHTML =

                '<a href="product.html?id=' +
                product.productId +
                '">' +

                '<div class="img-wrap">' +

                '<img src="' +
                imagePath +
                '" alt="' +
                product.name +
                '">' +

                '</div>' +

                '</a>' +

                '<p class="card-name">' +

                '<a href="product.html?id=' +
                product.productId +
                '">' +

                product.name +

                '</a>' +

                '</p>' +

                '<span class="card-price">₹' +
                product.price.toFixed(2) +
                '</span>' +

                '<button class="card-add-btn" onclick="addToCart(' +
                product.productId +
                ')">' +

                'ADD TO CART' +

                '</button>';

            grid.appendChild(card);

            count++;
        }

    } catch (error) {

        grid.innerHTML =
            '<p style="color:#d77f88;">' +
            'Could not load collection.' +
            '</p>';
    }
}


// ==================== CART PAGE ====================

function loadCart() {

    var cart = getCart();

    var cartBody =
        document.getElementById('cartBody');

    var totalEl =
        document.getElementById('cartTotal');

    var totalFinalEl =
        document.getElementById('cartTotalFinal');

    if (cartBody == null) {
        return;
    }

    if (cart.length == 0) {

        cartBody.innerHTML =
            '<tr>' +
            '<td colspan="5" style="text-align:center; padding:50px; color:#bbb;">' +
            'Your cart is empty. ' +
            '<a href="products.html" style="color:#d77f88;">' +
            'Continue shopping' +
            '</a>' +
            '</td>' +
            '</tr>';

        if (totalEl != null) {
            totalEl.textContent =
                '₹0.00';
        }

        if (totalFinalEl != null) {
            totalFinalEl.textContent =
                '₹0.00';
        }

        return;
    }

    cartBody.innerHTML = '';

    for (var i = 0; i < cart.length; i++) {

        var item =
            cart[i];

        var row =
            document.createElement('tr');

        row.innerHTML =

            '<td class="cart-item-name">' +
            item.name +
            '</td>' +

            '<td class="cart-item-price">₹' +
            item.price.toFixed(2) +
            '</td>' +

            '<td>' +
            item.quantity +
            '</td>' +

            '<td class="cart-item-price">₹' +
            (
                item.price *
                item.quantity
            ).toFixed(2) +
            '</td>' +

            '<td>' +

            '<button class="remove-btn" onclick="removeItem(' +
            item.productId +
            ')">✕</button>' +

            '</td>';

        cartBody.appendChild(row);
    }

    var total =
        getCartTotal().toFixed(2);

    if (totalEl != null) {
        totalEl.textContent =
            '₹' + total;
    }

    if (totalFinalEl != null) {
        totalFinalEl.textContent =
            '₹' + total;
    }
}


function removeItem(productId) {

    removeFromCart(productId);

    loadCart();
}


// ==================== LOGIN ====================

async function loginUser(event) {

    event.preventDefault();

    var email =
        document.getElementById('email').value;

    var password =
        document.getElementById('password').value;

    var messageEl =
        document.getElementById('message');

    try {

        var response =
            await fetch(
                API_URL + '/users/login',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

        if (response.ok) {

            var user =
                await response.json();

            localStorage.setItem(
                'currentUser',
                JSON.stringify(user)
            );

            window.location.href =
                'index.html';

        } else {

            var result =
                await response.json();

            messageEl.textContent =
                result.message;

            messageEl.className =
                'alert alert-error';
        }

    } catch (err) {

        messageEl.textContent =
            'Could not connect to server. Make sure the API is running.';

        messageEl.className =
            'alert alert-error';
    }
}


// ==================== REGISTER ====================

async function registerUser(event) {

    event.preventDefault();

    var username =
        document.getElementById('username').value;

    var email =
        document.getElementById('email').value;

    var password =
        document.getElementById('password').value;

    var messageEl =
        document.getElementById('message');

    try {

        var response =
            await fetch(
                API_URL + '/users/register',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                }
            );

        var result =
            await response.json();

        if (response.ok) {

            messageEl.textContent =
                'Registration successful! You can now login.';

            messageEl.className =
                'alert alert-success';

        } else {

            messageEl.textContent =
                result.message;

            messageEl.className =
                'alert alert-error';
        }

    } catch (err) {

        messageEl.textContent =
            'Could not connect to server. Make sure the API is running.';

        messageEl.className =
            'alert alert-error';
    }
}


// ==================== CHECKOUT ====================

function loadCheckoutSummary() {

    var cart =
        getCart();

    var summaryEl =
        document.getElementById('orderSummary');

    var totalEl =
        document.getElementById('summaryTotal');

    if (summaryEl == null) {
        return;
    }

    if (cart.length == 0) {

        window.location.href =
            'cart.html';

        return;
    }

    summaryEl.innerHTML = '';

    for (var i = 0; i < cart.length; i++) {

        var item =
            cart[i];

        var div =
            document.createElement('div');

        div.className =
            'summary-item';

        div.innerHTML =

            '<span>' +
            item.name +
            ' x' +
            item.quantity +
            '</span>' +

            '<span>₹' +
            (
                item.price *
                item.quantity
            ).toFixed(2) +
            '</span>';

        summaryEl.appendChild(div);
    }

    if (totalEl != null) {

        totalEl.textContent =
            '₹' +
            getCartTotal().toFixed(2);
    }
}


// ==================== PLACE ORDER ====================

async function placeOrder(event) {

    event.preventDefault();

    var user =
        getCurrentUser();

    if (user == null) {

        alert(
            'Please login first to place an order.'
        );

        window.location.href =
            'login.html';

        return;
    }

    var cart =
        getCart();

    if (cart.length == 0) {

        alert(
            'Your cart is empty.'
        );

        return;
    }

    var items = [];

    for (var i = 0; i < cart.length; i++) {

        items.push({

            productId:
                cart[i].productId,

            quantity:
                cart[i].quantity,

            price:
                cart[i].price
        });
    }

    var orderData = {

        userId:
            user.userId,

        totalAmount:
            getCartTotal(),

        items:
            items
    };

    try {

        var response =
            await fetch(
                API_URL + '/orders',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(orderData)
                }
            );

        if (response.ok) {

            saveCart([]);

            document.getElementById(
                'checkoutForm'
            ).style.display =
                'none';

            document.getElementById(
                'successMessage'
            ).style.display =
                'block';

        } else {

            alert(
                'Failed to place order. Please try again.'
            );
        }

    } catch (err) {

        alert(
            'Could not connect to server. Make sure the API is running.'
        );
    }
}


// ==================== PRODUCT DETAILS ====================

async function loadProductDetail() {

    var view =
        document.getElementById('productView');

    if (view == null) {
        return;
    }

    var params =
        new URLSearchParams(
            window.location.search
        );

    var id =
        params.get('id');

    if (id == null) {

        view.innerHTML =
            '<p style="padding:60px 7%; color:#d77f88;">' +
            'No product selected.' +
            '</p>';

        return;
    }

    try {

        var response =
            await fetch(
                API_URL + '/products/' + id
            );

        if (!response.ok) {

            view.innerHTML =
                '<p style="padding:60px 7%; color:#d77f88;">' +
                'Product not found.' +
                '</p>';

            return;
        }

        currentProduct =
            await response.json();

        var breadcrumb =
            document.getElementById(
                'breadcrumbName'
            );

        if (breadcrumb != null) {

            breadcrumb.textContent =
                currentProduct.name;
        }

        document.title =
            'ShopEasy - ' +
            currentProduct.name;

        var imagePath =
            new URL(
                currentProduct.imageUrl,
                window.location.href
            ).href;

        view.innerHTML =

            '<div class="product-view-img">' +

            '<img src="' +
            imagePath +
            '" alt="' +
            currentProduct.name +
            '">' +

            '</div>' +

            '<div class="product-view-info">' +

            '<p class="product-label">' +
            'SHOPEASY COLLECTION' +
            '</p>' +

            '<h1>' +
            currentProduct.name +
            '</h1>' +

            '<p class="product-price">₹' +
            currentProduct.price.toFixed(2) +
            '</p>' +

            '<p class="stock-info">' +
            'Availability: ' +

            '<span>' +
            'In Stock (' +
            currentProduct.stock +
            ' left)' +
            '</span>' +

            '</p>' +

            '<p class="product-desc">' +
            currentProduct.description +
            '</p>' +

            '<div class="qty-row">' +

            '<label>QUANTITY</label>' +

            '<input type="number" ' +
            'id="qtyInput" ' +
            'value="1" ' +
            'min="1" ' +
            'max="' +
            currentProduct.stock +
            '">' +

            '</div>' +

            '<button class="add-to-cart-btn" ' +
            'onclick="addToCartFromDetail()">' +

            'ADD TO CART' +

            '</button>' +

            '<a class="back-link" ' +
            'onclick="history.back()">' +

            '← Back to Products' +

            '</a>' +

            '<div class="product-features">' +

            '<p>🚚 Free shipping on orders over ₹99</p>' +

            '<p>🔄 Easy returns within 30 days</p>' +

            '<p>🔒 Secure payment guaranteed</p>' +

            '</div>' +

            '</div>';

    } catch (error) {

        view.innerHTML =
            '<p style="padding:60px 7%; color:#d77f88;">' +
            'Could not load product. Make sure the API is running.' +
            '</p>';
    }
}


// ==================== ADD FROM DETAIL ====================

function addToCartFromDetail() {

    if (currentProduct == null) {
        return;
    }

    var qtyInput =
        document.getElementById('qtyInput');

    var qty = 1;

    if (qtyInput != null) {

        qty =
            parseInt(qtyInput.value);
    }

    if (qty < 1) {
        qty = 1;
    }

    var cart =
        getCart();

    var found = false;

    for (var j = 0; j < cart.length; j++) {

        if (
            cart[j].productId ==
            currentProduct.productId
        ) {

            cart[j].quantity =
                cart[j].quantity + qty;

            found = true;

            break;
        }
    }

    if (found == false) {

        cart.push({

            productId:
                currentProduct.productId,

            name:
                currentProduct.name,

            price:
                currentProduct.price,

            quantity:
                qty
        });
    }

    saveCart(cart);

    alert(
        qty +
        'x ' +
        currentProduct.name +
        ' added to cart!'
    );
}


// ==================== RELATED PRODUCTS ====================

async function loadRelatedProducts() {

    var grid =
        document.getElementById(
            'relatedGrid'
        );

    if (grid == null) {
        return;
    }

    var params =
        new URLSearchParams(
            window.location.search
        );

    var currentId =
        params.get('id');

    try {

        var response =
            await fetch(
                API_URL + '/products'
            );

        allProducts =
            await response.json();

        grid.innerHTML = '';

        var count = 0;

        for (
            var i = 0;
            i < allProducts.length;
            i++
        ) {

            if (
                allProducts[i].productId ==
                currentId
            ) {
                continue;
            }

            if (count >= 4) {
                break;
            }

            var product =
                allProducts[i];

            var card =
                document.createElement('div');

            card.className =
                'product-card';

            var imagePath =
                new URL(
                    product.imageUrl,
                    window.location.href
                ).href;

            card.innerHTML =

                '<a href="product.html?id=' +
                product.productId +
                '">' +

                '<div class="img-wrap">' +

                '<img src="' +
                imagePath +
                '" alt="' +
                product.name +
                '">' +

                '</div>' +

                '</a>' +

                '<p class="card-name">' +

                '<a href="product.html?id=' +
                product.productId +
                '">' +

                product.name +

                '</a>' +

                '</p>' +

                '<span class="card-price">₹' +
                product.price.toFixed(2) +
                '</span>' +

                '<button class="card-add-btn" onclick="addToCart(' +
                product.productId +
                ')">' +

                'ADD TO CART' +

                '</button>';

            grid.appendChild(card);

            count++;
        }

    } catch (error) {

        grid.innerHTML = '';
    }
}