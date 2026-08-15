// ======================================================
// CAFE PARVAZ - SCRIPT.JS
// ======================================================

"use strict";


// ======================================================
// ADMIN PASSWORD
// ======================================================

const ADMIN_PASSWORD = "4030";


// ======================================================
// DEFAULT PRODUCTS
// ======================================================

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


// ======================================================
// DATA
// ======================================================

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


// ======================================================
// LOAD DATA
// ======================================================

function loadData(key, fallback) {

    try {

        const saved = localStorage.getItem(key);

        if (saved) {
            return JSON.parse(saved);
        }

    } catch (error) {

        console.error(
            "خطا در خواندن اطلاعات:",
            error
        );

    }

    return fallback;
}


// ======================================================
// SAVE DATA
// ======================================================

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


// ======================================================
// ELEMENTS
// ======================================================

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

const cartOverlay =
    document.getElementById("modalOverlay");

const checkoutModal =
    document.getElementById("checkoutModal");

const checkoutButton =
    document.getElementById("checkoutButton");

const checkoutOverlay =
    document.getElementById("checkoutOverlay");

const orderForm =
    document.getElementById("orderForm");


// ADMIN

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


// PRODUCT FORM

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


// ======================================================
// HTML SAFE
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null ? "" : String(value);

    return div.innerHTML;
}


// ======================================================
// CATEGORY NAME
// ======================================================

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


// ======================================================
// RENDER PRODUCTS
// ======================================================

function renderProducts() {

    if (!productsContainer) return;

    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        products.filter(product => {

            const categoryOK =
                currentCategory === "all" ||
                product.category === currentCategory;


            const searchOK =
                product.name
                    .toLowerCase()
                    .includes(searchText) ||

                (product.description || "")
                    .toLowerCase()
                    .includes(searchText);


            return categoryOK && searchOK;

        });


    productsContainer.innerHTML = "";


    if (filtered.length === 0) {

        if (emptyState) {
            emptyState.hidden = false;
        }

        return;
    }


    if (emptyState) {
        emptyState.hidden = true;
    }


    filtered.forEach((product, index) => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";

        card.style.animationDelay =
            `${index * 0.05}s`;


        card.innerHTML = `

            <div class="product-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${escapeHTML(product.description || "")}
                </p>

                <div class="product-bottom">

                    <button
                        class="add-button"
                        type="button"
                        data-add-product="${product.id}"
                        aria-label="افزودن به سفارش"
                    >
                        +
                    </button>

                </div>

            </div>

        `;


        productsContainer.appendChild(card);

    });

}


// ======================================================
// PRODUCT + BUTTON
// ======================================================

if (productsContainer) {

    productsContainer.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    "[data-add-product]"
                );


            if (!button) return;


            const productId =
                Number(
                    button.dataset.addProduct
                );


            addToCart(productId);

        }
    );

}


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
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
            item => item.id === productId
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


    // انیمیشن کوچک برای دکمه
    const button =
        document.querySelector(
            `[data-add-product="${productId}"]`
        );


    if (button) {

        button.style.transform =
            "scale(1.25)";


        setTimeout(() => {

            button.style.transform =
                "";

        }, 150);

    }

}


// ======================================================
// CHANGE QUANTITY
// ======================================================

function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            product => product.id === productId
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== productId
            );

    }


    updateCart();

}


// ======================================================
// UPDATE CART
// ======================================================

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


// ======================================================
// RENDER CART
// ======================================================

function renderCart() {

    if (!cartItems) return;


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

        const element =
            document.createElement("div");

        element.className =
            "cart-item";


        element.innerHTML = `

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


        cartItems.appendChild(element);

    });

}


// ======================================================
// CART + / - BUTTONS
// ======================================================

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
                    Number(
                        plus.dataset.cartPlus
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
                    Number(
                        minus.dataset.cartMinus
                    ),
                    -1
                );

            }

        }
    );

}


// ======================================================
// CATEGORY BUTTONS
// ======================================================

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
                this.dataset.category;


            renderProducts();

        }
    );

});


// ======================================================
// SEARCH
// ======================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderProducts
    );

}


// ======================================================
// OPEN CART
// ======================================================

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


// ======================================================
// CLOSE CART
// ======================================================

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


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCart
    );

}


// ======================================================
// CHECKOUT
// ======================================================

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
                checkoutModal.hidden = false;
            }

        }
    );

}


// ======================================================
// CLOSE CHECKOUT
// ======================================================

if (checkoutOverlay) {

    checkoutOverlay.addEventListener(
        "click",
        function() {

            checkoutModal.hidden = true;

        }
    );

}


// ======================================================
// SUBMIT ORDER
// ======================================================

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


            const table =
                document
                    .getElementById("tableNumber")
                    .value
                    .trim();


            const customer =
                document
                    .getElementById("customerName")
                    .value
                    .trim();


            const note =
                document
                    .getElementById("customerNote")
                    .value
                    .trim();


            const order = {

                id: Date.now(),

                table: table,

                customer: customer,

                note: note,

                items:
                    cart.map(item => ({

                        name: item.name,

                        quantity: item.quantity

                    })),

                status: "new",

                createdAt:
                    new Date()
                        .toLocaleString(
                            "fa-IR"
                        )

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


// ======================================================
// ADMIN LOGIN
// ======================================================

function openAdminLogin() {

    if (!adminLoginModal) return;


    adminPassword.value = "";

    loginError.hidden = true;

    adminLoginModal.hidden = false;


    setTimeout(
        () => adminPassword.focus(),
        100
    );

}


if (adminButton) {

    adminButton.addEventListener(
        "click",
        openAdminLogin
    );

}


// ======================================================
// LOGIN
// ======================================================

function loginAdmin() {

    if (
        adminPassword.value.trim() ===
        ADMIN_PASSWORD
    ) {

        adminLoginModal.hidden = true;

        adminPanel.hidden = false;

        renderAdminProducts();

        renderAdminOrders();

        updateAdminOrderCount();

    } else {

        loginError.hidden = false;

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


// ======================================================
// CLOSE ADMIN LOGIN
// ======================================================

if (closeAdminLogin) {

    closeAdminLogin.addEventListener(
        "click",
        function() {

            adminLoginModal.hidden = true;

        }
    );

}


if (adminLoginOverlay) {

    adminLoginOverlay.addEventListener(
        "click",
        function() {

            adminLoginModal.hidden = true;

        }
    );

}


// ======================================================
// CLOSE ADMIN PANEL
// ======================================================

if (closeAdminPanel) {

    closeAdminPanel.addEventListener(
        "click",
        function() {

            adminPanel.hidden = true;

        }
    );

}


// ======================================================
// ADMIN TABS
// ======================================================

document
    .querySelectorAll(".admin-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".admin-tab")
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                this.classList.add("active");


                const selected =
                    this.dataset.adminTab;


                document
                    .getElementById(
                        "adminProducts"
                    )
                    .hidden =
                    selected !== "products";


                document
                    .getElementById(
                        "adminOrders"
                    )
                    .hidden =
                    selected !== "orders";

            }
        );

    });


// ======================================================
// ADMIN PRODUCT LIST
// ======================================================

function renderAdminProducts() {

    if (!adminProductList) return;


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


    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "admin-product-card";


        card.innerHTML = `

            <h4>
                ${escapeHTML(product.name)}
            </h4>

            <p>
                ${escapeHTML(product.description || "")}
            </p>

            <span class="admin-product-category">
                ${getCategoryName(product.category)}
            </span>

            <div class="admin-product-actions">

                <button
                    class="edit-product"
                    type="button"
                    data-edit-product="${product.id}"
                >
                    ✏️ ویرایش
                </button>

                <button
                    class="delete-product"
                    type="button"
                    data-delete-product="${product.id}"
                >
                    🗑️ حذف
                </button>

            </div>

        `;


        adminProductList.appendChild(card);

    });

}


// ======================================================
// ADMIN PRODUCT ACTIONS
// ======================================================

if (adminProductList) {

    adminProductList.addEventListener(
        "click",
        function(event) {

            const edit =
                event.target.closest(
                    "[data-edit-product]"
                );


            if (edit) {

                editProduct(
                    Number(
                        edit.dataset.editProduct
                    )
                );

                return;
            }


            const remove =
                event.target.closest(
                    "[data-delete-product]"
                );


            if (remove) {

                deleteProduct(
                    Number(
                        remove.dataset.deleteProduct
                    )
                );

            }

        }
    );

}


// ======================================================
// ADD PRODUCT
// ======================================================

if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        function() {

            productModalTitle.textContent =
                "محصول جدید";


            editProductId.value = "";

            productForm.reset();

            productModal.hidden = false;

        }
    );

}


// ======================================================
// SAVE PRODUCT
// ======================================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                editProductId.value;


            const name =
                productName.value.trim();


            const description =
                productDescription.value.trim();


            const category =
                productCategory.value;


            if (!name) {

                alert(
                    "نام محصول را وارد کنید."
                );

                return;
            }


            if (id) {

                const product =
                    products.find(
                        item =>
                            item.id ===
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

            } else {

                products.push({

                    id: Date.now(),

                    name: name,

                    description: description,

                    category: category

                });

            }


            saveProducts();


            renderProducts();

            renderAdminProducts();


            productModal.hidden = true;

            productForm.reset();


            alert(
                "محصول با موفقیت ذخیره شد ✅"
            );

        }
    );

}


// ======================================================
// EDIT PRODUCT
// ======================================================

function editProduct(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) return;


    productModalTitle.textContent =
        "ویرایش محصول";


    editProductId.value =
        product.id;


    productName.value =
        product.name;


    productDescription.value =
        product.description || "";


    productCategory.value =
        product.category;


    productModal.hidden = false;

}


// ======================================================
// DELETE PRODUCT
// ======================================================

function deleteProduct(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) return;


    const answer =
        confirm(
            `آیا «${product.name}» حذف شود؟`
        );


    if (!answer) return;


    products =
        products.filter(
            item =>
                item.id !== productId
        );


    saveProducts();


    renderProducts();

    renderAdminProducts();

}


// ======================================================
// CLOSE PRODUCT MODAL
// ======================================================

if (cancelProduct) {

    cancelProduct.addEventListener(
        "click",
        function() {

            productModal.hidden = true;

        }
    );

}


if (productModalOverlay) {

    productModalOverlay.addEventListener(
        "click",
        function() {

            productModal.hidden = true;

        }
    );

}


// ======================================================
// ADMIN ORDERS
// ======================================================

function renderAdminOrders() {

    if (!adminOrderList) return;


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


    orders.forEach(order => {

        const card =
            document.createElement("div");

        card.className =
            "admin-order-card";


        const itemsHTML =
            order.items
                .map(item => `

                    <div class="admin-order-item">

                        <span>
                            ${escapeHTML(item.name)}
                        </span>

                        <strong>
                            × ${Number(item.quantity).toLocaleString("fa-IR")}
                        </strong>

                    </div>

                `)
                .join("");


        card.innerHTML = `

            <div class="admin-order-header">

                <h4>
                    سفارش #${String(order.id).slice(-4)}
                </h4>

                <span class="admin-order-time">
                    ${escapeHTML(order.createdAt)}
                </span>

            </div>


            <div class="admin-order-info">

                <div class="order-info-box">

                    <span>
                        میز
                    </span>

                    <strong>
                        ${escapeHTML(order.table)}
                    </strong>

                </div>


                <div class="order-info-box">

                    <span>
                        مشتری
                    </span>

                    <strong>
                        ${escapeHTML(order.customer)}
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
                            📝 ${escapeHTML(order.note)}
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
                    ${order.status === "new" ? "selected" : ""}
                >
                    🆕 سفارش جدید
                </option>

                <option
                    value="preparing"
                    ${order.status === "preparing" ? "selected" : ""}
                >
                    👨‍🍳 در حال آماده‌سازی
                </option>

                <option
                    value="ready"
                    ${order.status === "ready" ? "selected" : ""}
                >
                    ✅ آماده تحویل
                </option>

                <option
                    value="done"
                    ${order.status === "done" ? "selected" : ""}
                >
                    📦 تحویل داده شد
                </option>

            </select>

        `;


        adminOrderList.appendChild(card);

    });

}


// ======================================================
// ORDER STATUS
// ======================================================

if (adminOrderList) {

    adminOrderList.addEventListener(
        "change",
        function(event) {

            const select =
                event.target.closest(
                    "[data-order-status]"
                );


            if (!select) return;


            changeOrderStatus(
                Number(
                    select.dataset.orderStatus
                ),
                select.value
            );

        }
    );

}


function changeOrderStatus(
    orderId,
    status
) {

    const order =
        orders.find(
            item =>
                item.id === orderId
        );


    if (!order) return;


    order.status =
        status;


    saveOrders();


    updateAdminOrderCount();

}


// ======================================================
// NEW ORDER COUNT
// ======================================================

function updateAdminOrderCount() {

    if (!adminOrderCount) return;


    const count =
        orders.filter(
            order =>
                order.status === "new"
        ).length;


    adminOrderCount.textContent =
        count.toLocaleString("fa-IR");

}


// ======================================================
// MAKE FUNCTIONS AVAILABLE
// ======================================================

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


// ======================================================
// START
// ======================================================

renderProducts();

updateCart();

updateAdminOrderCount();


// ======================================================
// DEBUG
// ======================================================

console.log(
    "Cafe Parvaz loaded successfully ✅"
);

console.log(
    "Products:",
    products
);

console.log(
    "Cart:",
    cart
);
