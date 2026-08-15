"use strict";

// =====================================================
// CAFE PARVAZ - SCRIPT.JS
// =====================================================

const ADMIN_PASSWORD = "4030";


// =====================================================
// DEFAULT PRODUCTS
// =====================================================

const defaultProducts = [
    {
        id: 1,
        name: "اسپرسو",
        description: "یک شات اسپرسوی تازه و خوش‌عطر",
        category: "hot"
    },
    {
        id: 2,
        name: "آمریکانو",
        description: "اسپرسو همراه با آب داغ",
        category: "hot"
    },
    {
        id: 3,
        name: "کاپوچینو",
        description: "اسپرسو، شیر و فوم شیر",
        category: "hot"
    },
    {
        id: 4,
        name: "لاته",
        description: "اسپرسو و شیر با بافت نرم",
        category: "hot"
    },
    {
        id: 5,
        name: "آیس لاته",
        description: "لاته خنک همراه با یخ",
        category: "cold"
    },
    {
        id: 6,
        name: "صبحانه مخصوص",
        description: "یک صبحانه کامل و تازه",
        category: "breakfast"
    }
];


// =====================================================
// DATA
// =====================================================

function loadData(key, fallback) {
    try {
        const data = localStorage.getItem(key);

        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("خطا در خواندن اطلاعات:", error);
    }

    return fallback;
}


let products = loadData(
    "cafeParvazProducts",
    defaultProducts
);

let orders = loadData(
    "cafeParvazOrders",
    []
);

let cart = [];

let currentCategory = "all";


// =====================================================
// SAVE
// =====================================================

function saveProducts() {
    localStorage.setItem(
        "cafeParvazProducts",
        JSON.stringify(products)
    );
}


function saveOrders() {
    localStorage.setItem(
        "cafeParvazOrders",
        JSON.stringify(orders)
    );
}


// =====================================================
// HTML ELEMENTS
// =====================================================

const productsContainer =
    document.getElementById("products");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const categoryButtons =
    document.querySelectorAll(".category");

const cartButton =
    document.getElementById("cartButton");

const cartCount =
    document.getElementById("cartCount");

const floatingCart =
    document.getElementById("floatingCart");

const openCartButton =
    document.getElementById("openCart");

const cartTotal =
    document.getElementById("cartTotal");

const cartModal =
    document.getElementById("cartModal");

const cartItems =
    document.getElementById("cartItems");

const closeCartButton =
    document.getElementById("closeCart");

const modalOverlay =
    document.getElementById("modalOverlay");

const checkoutModal =
    document.getElementById("checkoutModal");

const checkoutButton =
    document.getElementById("checkoutButton");

const checkoutOverlay =
    document.getElementById("checkoutOverlay");

const orderForm =
    document.getElementById("orderForm");


// =====================================================
// ADMIN ELEMENTS
// =====================================================

const adminButton =
    document.getElementById("adminButton");

const adminLoginModal =
    document.getElementById("adminLoginModal");

const adminLoginOverlay =
    document.getElementById("adminLoginOverlay");

const adminPassword =
    document.getElementById("adminPassword");

const loginButton =
    document.getElementById("loginButton");

const closeAdminLogin =
    document.getElementById("closeAdminLogin");

const loginError =
    document.getElementById("loginError");

const adminPanel =
    document.getElementById("adminPanel");

const closeAdminPanel =
    document.getElementById("closeAdminPanel");

const adminProductList =
    document.getElementById("adminProductList");

const adminOrderList =
    document.getElementById("adminOrderList");

const adminOrderCount =
    document.getElementById("adminOrderCount");

const addProductButton =
    document.getElementById("addProductButton");


// =====================================================
// PRODUCT MODAL
// =====================================================

const productModal =
    document.getElementById("productModal");

const productModalOverlay =
    document.getElementById("productModalOverlay");

const productModalTitle =
    document.getElementById("productModalTitle");

const productForm =
    document.getElementById("productForm");

const editProductId =
    document.getElementById("editProductId");

const productName =
    document.getElementById("productName");

const productDescription =
    document.getElementById("productDescription");

const productCategory =
    document.getElementById("productCategory");

const cancelProduct =
    document.getElementById("cancelProduct");


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null ? "" : String(value);

    return div.innerHTML;
}


// =====================================================
// CATEGORY NAME
// =====================================================

function getCategoryName(category) {

    const names = {

        hot: "نوشیدنی گرم",

        cold: "نوشیدنی سرد",

        snacks: "تنقلات",

        breakfast: "صبحانه",

        other: "سایر"

    };

    return names[category] || "سایر";
}


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts() {

    if (!productsContainer) {
        console.error(
            "عنصر #products در index.html پیدا نشد."
        );
        return;
    }


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filteredProducts =
        products.filter(product => {

            const categoryMatch =
                currentCategory === "all" ||
                product.category === currentCategory;


            const name =
                String(product.name || "")
                    .toLowerCase();


            const description =
                String(product.description || "")
                    .toLowerCase();


            const searchMatch =
                name.includes(searchText) ||
                description.includes(searchText);


            return categoryMatch && searchMatch;

        });


    productsContainer.innerHTML = "";


    if (
        filteredProducts.length === 0
    ) {

        if (emptyState) {
            emptyState.hidden = false;
        }

        return;
    }


    if (emptyState) {
        emptyState.hidden = true;
    }


    filteredProducts.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${escapeHTML(
                        product.description || ""
                    )}
                </p>

                <div class="product-bottom">

                    <button
                        type="button"
                        class="add-button"
                        data-add-product="${product.id}"
                    >
                        +
                    </button>

                </div>

            </div>

        `;


        productsContainer.appendChild(card);

    });

}


// =====================================================
// ADD PRODUCT TO CART
// =====================================================

function addToCart(productId) {

    productId =
        Number(productId);


    const product =
        products.find(
            item =>
                Number(item.id) === productId
        );


    if (!product) {

        console.error(
            "محصول پیدا نشد:",
            productId
        );

        return;
    }


    const existing =
        cart.find(
            item =>
                Number(item.id) === productId
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            quantity: 1

        });

    }


    updateCart();

}


// =====================================================
// PRODUCT BUTTON CLICK
// =====================================================

if (productsContainer) {

    productsContainer.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    "[data-add-product]"
                );


            if (!button) {
                return;
            }


            const productId =
                button.getAttribute(
                    "data-add-product"
                );


            addToCart(productId);

        }
    );

}


// =====================================================
// CHANGE CART QUANTITY
// =====================================================

function changeQuantity(
    productId,
    amount
) {

    productId =
        Number(productId);


    const item =
        cart.find(
            product =>
                Number(product.id) === productId
        );


    if (!item) {
        return;
    }


    item.quantity += Number(amount);


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    Number(product.id) !== productId
            );

    }


    updateCart();

}


// =====================================================
// UPDATE CART
// =====================================================

function updateCart() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    if (cartCount) {

        cartCount.textContent =
            total.toLocaleString("fa-IR");

    }


    if (cartTotal) {

        cartTotal.textContent =
            `${total.toLocaleString("fa-IR")} محصول`;

    }


    if (floatingCart) {

        floatingCart.hidden =
            total === 0;

    }


    renderCart();

}


// =====================================================
// RENDER CART
// =====================================================

function renderCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-state">

                <div>🛒</div>

                <h3>
                    سبد سفارش خالی است
                </h3>

                <p>
                    هنوز محصولی انتخاب نکرده‌اید.
                </p>

            </div>

        `;

        return;
    }


    cart.forEach(item => {

        const row =
            document.createElement("div");


        row.className =
            "cart-item";


        row.innerHTML = `

            <div class="cart-item-info">

                <h4>
                    ${escapeHTML(item.name)}
                </h4>

            </div>

            <div class="quantity-controls">

                <button
                    type="button"
                    data-cart-plus="${item.id}"
                >
                    +
                </button>

                <strong>
                    ${item.quantity.toLocaleString("fa-IR")}
                </strong>

                <button
                    type="button"
                    data-cart-minus="${item.id}"
                >
                    −
                </button>

            </div>

        `;


        cartItems.appendChild(row);

    });

}


// =====================================================
// CART BUTTONS
// =====================================================

if (cartItems) {

    cartItems.addEventListener(
        "click",
        function(event) {

            const plus =
                event.target.closest(
                    "[data-cart-plus]"
                );


            if (plus) {

                changeQuantity(
                    plus.getAttribute(
                        "data-cart-plus"
                    ),
                    1
                );

                return;
            }


            const minus =
                event.target.closest(
                    "[data-cart-minus]"
                );


            if (minus) {

                changeQuantity(
                    minus.getAttribute(
                        "data-cart-minus"
                    ),
                    -1
                );

            }

        }
    );

}


// =====================================================
// CATEGORIES
// =====================================================

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            categoryButtons.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            this.classList.add("active");


            currentCategory =
                this.dataset.category ||
                "all";


            renderProducts();

        }
    );

});


// =====================================================
// SEARCH
// =====================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderProducts
    );

}


// =====================================================
// OPEN CART
// =====================================================

function openCart() {

    if (cartModal) {
        cartModal.hidden = false;
    }

}


if (cartButton) {

    cartButton.addEventListener(
        "click",
        openCart
    );

}


if (openCartButton) {

    openCartButton.addEventListener(
        "click",
        openCart
    );

}


// =====================================================
// CLOSE CART
// =====================================================

function closeCart() {

    if (cartModal) {
        cartModal.hidden = true;
    }

}


if (closeCartButton) {

    closeCartButton.addEventListener(
        "click",
        closeCart
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeCart
    );

}


// =====================================================
// CHECKOUT
// =====================================================

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                alert(
                    "سبد سفارش خالی است."
                );

                return;
            }


            closeCart();


            if (checkoutModal) {

                checkoutModal.hidden =
                    false;

            }

        }
    );

}


// =====================================================
// CLOSE CHECKOUT
// =====================================================

if (checkoutOverlay) {

    checkoutOverlay.addEventListener(
        "click",
        function() {

            checkoutModal.hidden =
                true;

        }
    );

}


// =====================================================
// SUBMIT ORDER
// =====================================================

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "سبد سفارش خالی است."
                );

                return;
            }


            const tableInput =
                document.getElementById(
                    "tableNumber"
                );


            const customerInput =
                document.getElementById(
                    "customerName"
                );


            const noteInput =
                document.getElementById(
                    "customerNote"
                );


            const order = {

                id: Date.now(),

                table:
                    tableInput
                        ? tableInput.value.trim()
                        : "",

                customer:
                    customerInput
                        ? customerInput.value.trim()
                        : "",

                note:
                    noteInput
                        ? noteInput.value.trim()
                        : "",

                items:
                    cart.map(item => ({

                        name: item.name,

                        quantity: item.quantity

                    })),

                status: "new",

                createdAt:
                    new Date()
                        .toLocaleString("fa-IR")

            };


            orders.unshift(order);

            saveOrders();


            cart = [];

            updateCart();


            orderForm.reset();


            if (checkoutModal) {
                checkoutModal.hidden = true;
            }


            updateAdminOrderCount();


            alert(
                "سفارش با موفقیت ثبت شد ✅"
            );

        }
    );

}


// =====================================================
// ADMIN LOGIN
// =====================================================

function openAdminLogin() {

    if (!adminLoginModal) {
        return;
    }


    if (adminPassword) {
        adminPassword.value = "";
    }


    if (loginError) {
        loginError.hidden = true;
    }


    adminLoginModal.hidden =
        false;


    if (adminPassword) {

        setTimeout(
            function() {
                adminPassword.focus();
            },
            100
        );

    }

}


if (adminButton) {

    adminButton.addEventListener(
        "click",
        openAdminLogin
    );

}


// =====================================================
// ADMIN LOGIN CHECK
// =====================================================

function loginAdmin() {

    if (!adminPassword) {
        return;
    }


    if (
        adminPassword.value.trim() ===
        ADMIN_PASSWORD
    ) {

        adminLoginModal.hidden =
            true;


        if (adminPanel) {

            adminPanel.hidden =
                false;

        }


        renderAdminProducts();

        renderAdminOrders();

        updateAdminOrderCount();

    } else {

        if (loginError) {

            loginError.hidden =
                false;

        }


        adminPassword.value = "";

        adminPassword.focus();

    }

}


if (loginButton) {

    loginButton.addEventListener(
        "click",
        loginAdmin
    );

}


if (adminPassword) {

    adminPassword.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                loginAdmin();

            }

        }
    );

}


// =====================================================
// CLOSE ADMIN LOGIN
// =====================================================

if (closeAdminLogin) {

    closeAdminLogin.addEventListener(
        "click",
        function() {

            adminLoginModal.hidden =
                true;

        }
    );

}


if (adminLoginOverlay) {

    adminLoginOverlay.addEventListener(
        "click",
        function() {

            adminLoginModal.hidden =
                true;

        }
    );

}


// =====================================================
// CLOSE ADMIN PANEL
// =====================================================

if (closeAdminPanel) {

    closeAdminPanel.addEventListener(
        "click",
        function() {

            adminPanel.hidden =
                true;

        }
    );

}


// =====================================================
// ADMIN TABS
// =====================================================

document
    .querySelectorAll(".admin-tab")
    .forEach(function(tab) {

        tab.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".admin-tab")
                    .forEach(
                        function(item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                this.classList.add("active");


                const selected =
                    this.dataset.adminTab;


                const adminProducts =
                    document.getElementById(
                        "adminProducts"
                    );


                const adminOrders =
                    document.getElementById(
                        "adminOrders"
                    );


                if (adminProducts) {

                    adminProducts.hidden =
                        selected !== "products";

                }


                if (adminOrders) {

                    adminOrders.hidden =
                        selected !== "orders";

                }

            }
        );

    });


// =====================================================
// OPEN ADD PRODUCT
// =====================================================

function openAddProduct() {

    console.log(
        "دکمه افزودن محصول اجرا شد"
    );


    if (!productModal) {

        console.error(
            "productModal پیدا نشد."
        );

        alert(
            "پنجره افزودن محصول در index.html وجود ندارد."
        );

        return;
    }


    if (productModalTitle) {

        productModalTitle.textContent =
            "محصول جدید";

    }


    if (editProductId) {

        editProductId.value = "";

    }


    if (productForm) {

        productForm.reset();

    }


    productModal.hidden =
        false;

}


// =====================================================
// ADD PRODUCT BUTTON
// =====================================================

if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openAddProduct();

        }
    );

}


// برای اطمینان حتی اگر دکمه بعداً ساخته شود
document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#addProductButton"
            );


        if (!button) {
            return;
        }


        event.preventDefault();

        openAddProduct();

    }
);


// =====================================================
// SAVE PRODUCT
// =====================================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                productName
                    ? productName.value.trim()
                    : "";


            const description =
                productDescription
                    ? productDescription.value.trim()
                    : "";


            const category =
                productCategory
                    ? productCategory.value
                    : "other";


            const id =
                editProductId
                    ? editProductId.value
                    : "";


            if (!name) {

                alert(
                    "نام محصول را وارد کنید."
                );

                return;
            }


            // EDIT
            if (id) {

                const product =
                    products.find(
                        item =>
                            Number(item.id) ===
                            Number(id)
                    );


                if (product) {

                    product.name =
                        name;

                    product.description =
                        description;

                    product.category =
                        category;

                }

            }

            // NEW
            else {

                products.push({

                    id: Date.now(),

                    name: name,

                    description:
                        description,

                    category:
                        category

                });

            }


            saveProducts();


            renderProducts();

            renderAdminProducts();


            productModal.hidden =
                true;


            productForm.reset();


            alert(
                "محصول با موفقیت ذخیره شد ✅"
            );

        }
    );

}


// =====================================================
// EDIT PRODUCT
// =====================================================

function editProduct(productId) {

    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (!product) {
        return;
    }


    if (productModalTitle) {

        productModalTitle.textContent =
            "ویرایش محصول";

    }


    if (editProductId) {

        editProductId.value =
            product.id;

    }


    if (productName) {

        productName.value =
            product.name;

    }


    if (productDescription) {

        productDescription.value =
            product.description || "";

    }


    if (productCategory) {

        productCategory.value =
            product.category;

    }


    if (productModal) {

        productModal.hidden =
            false;

    }

}


// =====================================================
// DELETE PRODUCT
// =====================================================

function deleteProduct(productId) {

    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (!product) {
        return;
    }


    const confirmed =
        confirm(
            `آیا «${product.name}» حذف شود؟`
        );


    if (!confirmed) {
        return;
    }


    products =
        products.filter(
            item =>
                Number(item.id) !==
                Number(productId)
        );


    saveProducts();


    renderProducts();

    renderAdminProducts();

}


// =====================================================
// ADMIN PRODUCT LIST
// =====================================================

function renderAdminProducts() {

    if (!adminProductList) {
        return;
    }


    adminProductList.innerHTML = "";


    if (products.length === 0) {

        adminProductList.innerHTML = `

            <div class="empty-state">

                <div>📦</div>

                <h3>
                    محصولی وجود ندارد
                </h3>

                <p>
                    یک محصول جدید اضافه کنید.
                </p>

            </div>

        `;

        return;
    }


    products.forEach(function(product) {

        const card =
            document.createElement("div");


        card.className =
            "admin-product-card";


        card.innerHTML = `

            <h4>
                ${escapeHTML(product.name)}
            </h4>

            <p>
                ${escapeHTML(
                    product.description || ""
                )}
            </p>

            <span class="admin-product-category">

                ${getCategoryName(
                    product.category
                )}

            </span>

            <div class="admin-product-actions">

                <button
                    type="button"
                    class="edit-product"
                    data-edit-product="${product.id}"
                >
                    ✏️ ویرایش
                </button>

                <button
                    type="button"
                    class="delete-product"
                    data-delete-product="${product.id}"
                >
                    🗑️ حذف
                </button>

            </div>

        `;


        adminProductList.appendChild(card);

    });

}


// =====================================================
// ADMIN PRODUCT BUTTONS
// =====================================================

if (adminProductList) {

    adminProductList.addEventListener(
        "click",
        function(event) {

            const editButton =
                event.target.closest(
                    "[data-edit-product]"
                );


            if (editButton) {

                editProduct(
                    editButton.getAttribute(
                        "data-edit-product"
                    )
                );

                return;
            }


            const deleteButton =
                event.target.closest(
                    "[data-delete-product]"
                );


            if (deleteButton) {

                deleteProduct(
                    deleteButton.getAttribute(
                        "data-delete-product"
                    )
                );

            }

        }
    );

}


// =====================================================
// CLOSE PRODUCT MODAL
// =====================================================

if (cancelProduct) {

    cancelProduct.addEventListener(
        "click",
        function() {

            productModal.hidden =
                true;

        }
    );

}


if (productModalOverlay) {

    productModalOverlay.addEventListener(
        "click",
        function() {

            productModal.hidden =
                true;

        }
    );

}


// =====================================================
// ADMIN ORDERS
// =====================================================

function renderAdminOrders() {

    if (!adminOrderList) {
        return;
    }


    adminOrderList.innerHTML = "";


    if (orders.length === 0) {

        adminOrderList.innerHTML = `

            <div class="empty-state">

                <div>📋</div>

                <h3>
                    هنوز سفارشی ثبت نشده
                </h3>

                <p>
                    سفارش‌های جدید اینجا نمایش داده می‌شوند.
                </p>

            </div>

        `;

        return;
    }


    orders.forEach(function(order) {

        const card =
            document.createElement("div");


        card.className =
            "admin-order-card";


        const itemsHTML =
            order.items
                .map(function(item) {

                    return `

                        <div class="admin-order-item">

                            <span>
                                ${escapeHTML(
                                    item.name
                                )}
                            </span>

                            <strong>
                                × ${Number(
                                    item.quantity
                                ).toLocaleString("fa-IR")}
                            </strong>

                        </div>

                    `;

                })
                .join("");


        card.innerHTML = `

            <div class="admin-order-header">

                <h4>
                    سفارش #${String(
                        order.id
                    ).slice(-4)}
                </h4>

                <span class="admin-order-time">

                    ${escapeHTML(
                        order.createdAt
                    )}

                </span>

            </div>


            <div class="admin-order-info">

                <div class="order-info-box">

                    <span>
                        میز
                    </span>

                    <strong>
                        ${escapeHTML(
                            order.table
                        )}
                    </strong>

                </div>


                <div class="order-info-box">

                    <span>
                        مشتری
                    </span>

                    <strong>
                        ${escapeHTML(
                            order.customer
                        )}
                    </strong>

                </div>

            </div>


            <div class="admin-order-items">

                ${itemsHTML}

            </div>


            ${
                order.note
                    ? `

                        <div class="admin-order-note">

                            📝
                            ${escapeHTML(
                                order.note
                            )}

                        </div>

                    `
                    : ""
            }


            <select
                class="order-status"
                data-order-status="${order.id}"
            >

                <option
                    value="new"
                    ${
                        order.status === "new"
                            ? "selected"
                            : ""
                    }
                >
                    🆕 سفارش جدید
                </option>

                <option
                    value="preparing"
                    ${
                        order.status === "preparing"
                            ? "selected"
                            : ""
                    }
                >
                    👨‍🍳 در حال آماده‌سازی
                </option>

                <option
                    value="ready"
                    ${
                        order.status === "ready"
                            ? "selected"
                            : ""
                    }
                >
                    ✅ آماده تحویل
                </option>

                <option
                    value="done"
                    ${
                        order.status === "done"
                            ? "selected"
                            : ""
                    }
                >
                    📦 تحویل داده شد
                </option>

            </select>

        `;


        adminOrderList.appendChild(card);

    });

}


// =====================================================
// ORDER STATUS
// =====================================================

function changeOrderStatus(
    orderId,
    status
) {

    const order =
        orders.find(
            item =>
                Number(item.id) ===
                Number(orderId)
        );


    if (!order) {
        return;
    }


    order.status =
        status;


    saveOrders();

    updateAdminOrderCount();

}


if (adminOrderList) {

    adminOrderList.addEventListener(
        "change",
        function(event) {

            const select =
                event.target.closest(
                    "[data-order-status]"
                );


            if (!select) {
                return;
            }


            changeOrderStatus(
                select.getAttribute(
                    "data-order-status"
                ),
                select.value
            );

        }
    );

}


// =====================================================
// ORDER COUNT
// =====================================================

function updateAdminOrderCount() {

    if (!adminOrderCount) {
        return;
    }


    const count =
        orders.filter(
            order =>
                order.status === "new"
        ).length;


    adminOrderCount.textContent =
        count.toLocaleString("fa-IR");

}


// =====================================================
// GLOBAL FUNCTIONS
// =====================================================

window.addToCart =
    addToCart;

window.changeQuantity =
    changeQuantity;

window.editProduct =
    editProduct;

window.deleteProduct =
    deleteProduct;

window.changeOrderStatus =
    changeOrderStatus;

window.openAddProduct =
    openAddProduct;

window.openAdminLogin =
    openAdminLogin;


// =====================================================
// START
// =====================================================

renderProducts();

updateCart();

updateAdminOrderCount();


console.log(
    "Cafe Parvaz Script Loaded Successfully ✅"
);
