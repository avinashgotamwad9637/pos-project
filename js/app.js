$(document).ready(function(){
    renderCard();

    let categoryUrl = 'https://dummyjson.com/products/category-list';
    let productUrl = "https://dummyjson.com/products/category/";
    let singleProductUrl = "https://dummyjson.com/products/";
    
    // Get category list // fetch lists
    $.ajax({
        url: categoryUrl,
        method: "GET",
        data: {},
        success: function(response) {
            let html = "";
            response.forEach((cat, i) => {
                if (i < 5) {
                    let formattedCat = cat.replace(/-/g, ' ')
                                          .toLowerCase()
                                          .split(' ')
                                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                          .join(' ');

                    html += `<div class="card mx-3 text-center category" style="width: 8rem; height: 8rem;" id="${cat}">`;
                    html += `<a href="#" class="text-decoration-none">`;
                    html += `<img src="images/${cat}.png" alt="" class="CardImage">`;
                    html += `<h5 class="fw-bold text-dark">${formattedCat}</h5>`;
                    html += `</a>`;
                    html += `</div>`;
                }
            });
            $("#category").html(html);
        },
        error: function() {
            alert("Failed to fetch categories. Please try again.");
        }
    });

    // Fetch products for selected category
    $(document).on("click", ".category", function() {
        let val = $(this).attr("id");
        $.ajax({
            url: productUrl + val,
            method: "GET",
            data: {},
            success: function(response) {
                let html = "";
                response.products.forEach(product => {
                    html += `<div class="col-lg-4 pt-4">`;
                    html += `<div class="card product mx-1" style="width: 15rem;" data-product-id="${product.id}">`;
                    html += `<img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">`;
                    html += `<div class="card-body">`;
                    html += `<h3 class="card-title">${product.title}</h3>`;
                    html += `<p class="card-text">${product.warrantyInformation || 'No warranty information available'}</p>`;
                    html += `<a href="#" class="Amount">${product.price}</a>`;
                    html += `</div>`;
                    html += `</div>`;
                    html += `</div>`;
                });
                $("#products").html(html);
            },
            error: function() {
                alert("Failed to fetch products. Please try again!");
            }
        });
    });

    // Add products to given cart
    $(document).on("click", ".product", function() {
        let productId = $(this).data("product-id");
        $.ajax({
            url: singleProductUrl + productId,
            method: "GET",
            success: function(product) {
                // Update cart with the fetched product details
                updateCard(product);
            },
            error: function() {
                alert("Failed to fetch product details.");
            }
        });
    });

    // Update cart here
    function updateCard(product) {
        let cart = loadCard();
        let productIndex = cart.findIndex(item => item.id === product.id);
        if (productIndex !== -1) {
            cart[productIndex].qty++;
        } else {
            cart.push({...product, qty: 1 });
        }
        saveCard(cart);
        renderCard();
    }

    function saveCard(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function loadCard() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    // Render cart and calculate total bill amount
    function renderCard() {
        let cart = loadCard();
        let html = "";
        let total = 0;

        cart.forEach((item, i) => {
            let itemTotal = item.price * item.qty;
            total += itemTotal; // Add to the total bill amount
            html += `<tr>`;
            html += `<td>${i + 1}</td>`;
            html += `<td>${item.title}</td>`;
            html += `<td>${item.price}</td>`;
            html += `<td>${item.qty}</td>`;
            html += `<td>${itemTotal}</td>`; // Add item total in the selected row
            html += `<td><a class="btn remove-item" href="#" data-id="${item.id}">Remove</a></td>`;
            html += `</tr>`;
        });

        // Display the cart items here
        $("#cart tbody").html(html);

        // Display the total bill in a particular element
        $("#totalBill").text(`Total: $${total.toFixed(2)}`);
    }

    // Clear cart when click button
    $(document).on("click", "#clear", function() {
        if (confirm("Are you sure?")) {
            localStorage.removeItem("cart");
            renderCard();
        }
    });

    // Remove one particular item from the cart
    $(document).on("click", ".remove-item", function(e) {
        e.preventDefault();
        let productId = parseInt($(this).data("id"));
        let cart = loadCard();
        cart = cart.filter(item => item.id !== productId);
        saveCard(cart);
        renderCard();
    });
});
