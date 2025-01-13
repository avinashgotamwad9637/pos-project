$(document).ready(function () {
    renderCard();

    let categoryUrl = 'https://dummyjson.com/products/category-list';
    let productUrl = "https://dummyjson.com/products/category/";
    let singleProductUrl = "https://dummyjson.com/products/";

    // Get category list and add slider
    $.ajax({
        url: categoryUrl,
        method: "GET",
        success: function (response) {
            let html = `<div id="categorySlider" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">`;

            // Group categories into chunks of five
            let chunkSize = 5;
            for (let i = 0; i < response.length; i += chunkSize) {
                let chunk = response.slice(i, i + chunkSize);

                html += `<div class="carousel-item ${i === 0 ? 'active' : ''}">
                            <div class="d-flex justify-content-center">`;

                chunk.forEach(cat => {
                    let formattedCat = cat.replace(/-/g, ' ')
                        .toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                    html += `<div class="card mx-3 text-center category" style="width: 8rem; height: 8rem;" id="${cat}">
                                <a href="#" class="text-decoration-none">
                                    <img src="images/${cat}.png" alt="" class="CardImage">
                                    <h5 class="fw-bold fs-6 text-dark">${formattedCat}</h5>
                                </a>
                             </div>`;
                });

                html += `   </div>
                         </div>`;
            }

            html += `</div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#categorySlider" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#categorySlider" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                     </div>`;

            $("#category").html(html);
        },
        error: function () {
            alert("Failed to fetch categories. Please try again.");
        }
    });

    // Fetch products for selected category
    $(document).on("click", ".category", function () {
        let val = $(this).attr("id");
        $.ajax({
            url: productUrl + val,
            method: "GET",
            success: function (response) {
                let html = "";
                response.products.forEach(product => {
                    html += `<div class="col-lg-4 pt-4">
                                <div class="card product mx-0" style="width: 10rem;" data-product-id="${product.id}">
                                    <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                                    <div class="card-body">
                                        <h3 class="card-title">${product.title}</h3>
                                        <p class="card-text">${product.warrantyInformation || 'No warranty information available'}</p>
                                        <a href="#" class="Amount">${product.price}</a>
                                    </div>
                                </div>
                             </div>`;
                });
                $("#products").html(html);
            },
            error: function () {
                alert("Failed to fetch products. Please try again!");
            }
        });
    });

    // Add products to cart
    $(document).on("click", ".product", function () {
        let productId = $(this).data("product-id");
        $.ajax({
            url: singleProductUrl + productId,
            method: "GET",
            success: function (product) {
                updateCard(product);
            },
            error: function () {
                alert("Failed to fetch product details.");
            }
        });
    });

    // Update cart
    function updateCard(product) {
        let cart = loadCard();
        let productIndex = cart.findIndex(item => item.id === product.id);
        if (productIndex !== -1) {
            cart[productIndex].qty++;
        } else {
            cart.push({ ...product, qty: 1 });
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

    // Render cart and calculate total
    function renderCard() {
        let cart = loadCard();
        let html = "";
        let total = 0;

        cart.forEach((item, i) => {
            let itemTotal = item.price * item.qty;
            total += itemTotal;
            html += `<tr>
                        <td>${i + 1}</td>
                        <td>${item.title}</td>
                        <td>${item.price}</td>
                        <td>${item.qty}</td>
                        <td>${itemTotal}</td>
                        <td><a class="btn remove-item" href="#" data-id="${item.id}">Remove</a></td>
                     </tr>`;
        });

        $("#cart tbody").html(html);
        $("#totalBill").text(`Total: $${total.toFixed(2)}`);
    }

    $(document).on("click", "#clear", function () {
        if (confirm("Are you sure?")) {
            localStorage.removeItem("cart");
            renderCard();
        }
    });

    $(document).on("click", ".remove-item", function (e) {
        e.preventDefault();
        let productId = parseInt($(this).data("id"));
        let cart = loadCard();
        cart = cart.filter(item => item.id !== productId);
        saveCard(cart);
        renderCard();
    });
});
