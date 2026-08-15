"use strict";

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
// STORAGE
// ======================================================

function getStorage(key, fallback) {

    try {

        const data =
            localStorage.getItem(key);

        return data
            ? JSON.parse(data)
            : fallback;

    } catch {

        return fallback;

    }

}


let products =
    getStorage(
        "cafeParvazProducts",
        defaultProducts
    );


let orders =
    getStorage(
        "cafeParvazOrders",
        []
    );


let cart = [];

let currentCategory = "all";


// ======================================================
// ELEMENTS
// ======================================================

const productsContainer =
    document.getElementById("products");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const cartButton =
    document.getElementById("cartButton");

const cartCount =
    document.getElementById("cartCount");

const floatingCart =
    document.getElementById("floatingCart");

const cartTotal =
    document.getElementById("cartTotal");

const cartModal =
    document.getElementById("cartModal");

const cartItems =
    document.getElementById("cartItems");

const checkoutButton =
    document.getElementById("checkoutButton");

const checkoutModal =
    document.getElementById("checkoutModal");

const orderForm =
    document.getElementById("orderForm");


// ADMIN

const adminButton =
    document.getElementById("adminButton");

const adminLoginModal =
    document.getElementById("adminLoginModal");

const adminPassword =
    document.getElementById("adminPassword");

const loginButton =
    document.getElementById("loginButton");

const loginError =
    document.getElementById("loginError");

const adminPanel =
    document.getElementById("adminPanel");

const adminProductList =
    document.getElementById("adminProductList");

const adminOrderList =
    document.getElementById("adminOrderList");

const adminOrderCount =
    document.getElementById("adminOrderCount");


// PRODUCT MODAL

const productModal =
    document.getElementById("productModal");

const productForm =
    document.getElementById("productForm");

const productModalTitle =
    document.getElementById("productModalTitle");

const editProductId =
    document.getElementById("editProductId");

const productName =
    document.getElementById("productName");

const productDescription =
    document.getElementById("productDescription");

const productCategory =
    document.getElementById("productCategory");


// ======================================================
// HELPERS
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


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";

    return div.innerHTML;

}


function categoryName(category) {

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
// PRODUCTS
// ======================================================

function renderProducts() {

    const search =
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
                    .includes(search) ||

                (product.description || "")
                    .toLowerCase()
                    .includes(search);


            return categoryOK && searchOK;

        });


    productsContainer.innerHTML = "";


    if (!filtered.length) {

        emptyState.hidden = false;

        return;

    }


    emptyState.hidden = true;


    filtered.forEach(product => {

        const card =
            document.createElement("article");


        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-icon">
                ${iconForCategory(product.category)}
            </div>

            <h3>
                ${escapeHTML(product.name)}
            </h3>

            <p>
                ${escapeHTML(product.description || "")}
            </p>

            <div class="product-bottom">

                <button
                    class="add-button"
                    data-add="${product.id}"
                    type="button"
                >
                    +
                </button>

            </div>
        `;


        productsContainer.appendChild(card);

    });

}


function iconForCategory(category) {

    const icons = {

        hot: "☕",
        cold: "🧊",
        snacks: "🍿",
        breakfast: "🍳",
        other: "✦"

    };

    return icons[category] || "☕";

}


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(id) {

    const product =
        products.find(
            p => Number(p.id) === Number(id)
        );


    if (!product) return;


    const existing =
        cart.find(
            p => Number(p.id) === Number(id)
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            quantity: 1

        });

    }


    updateCart();

}


// ======================================================
// CART
// ======================================================

function changeQuantity(id, amount) {

    const item =
        cart.find(
            p => Number(p.id) === Number(id)
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                p => Number(p.id) !== Number(id)
            );

    }


    updateCart();

}


function updateCart() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        count.toLocaleString("fa-IR");


    cartTotal.textContent =
        `${count.toLocaleString("fa-IR")} محصول`;


    floatingCart.hidden =
        count === 0;


    renderCart();

}


function renderCart() {

    cartItems.innerHTML = "";


    if (!cart.length) {

        cartItems.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🛒
                </div>

                <h3>
                    سبد سفارش خالی است
                </h3>

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

            <div>
                <h4>
                    ${escapeHTML(item.name)}
                </h4>
            </div>

            <div class="quantity-controls">

                <button
                    data-plus="${item.id}"
                    type="button"
                >
                    +
                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button
                    data-minus="${item.id}"
                    type="button"
                >
                    −
                </button>

            </div>
        `;


        cartItems.appendChild(row);

    });

}


// ======================================================
// CART EVENTS
// ======================================================

productsContainer.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("[data-add]");


        if (!button) return;


        addToCart(
            button.dataset.add
        );

    }
);


cartItems.addEventListener(
    "click",
    event => {

        const plus =
            event.target.closest("[data-plus]");


        if (plus) {

            changeQuantity(
                plus.dataset.plus,
                1
            );

            return;

        }


        const minus =
            event.target.closest("[data-minus]");


        if (minus) {

            changeQuantity(
                minus.dataset.minus,
                -1
            );

        }

    }
);


// ======================================================
// OPEN / CLOSE CART
// ======================================================

function openCart() {

    cartModal.hidden = false;

}


function closeCart() {

    cartModal.hidden = true;

}


cartButton.addEventListener(
    "click",
    openCart
);


floatingCart.addEventListener(
    "click",
    openCart
);


document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closeCart
    );


document
    .getElementById("modalOverlay")
    .addEventListener(
        "click",
        closeCart
    );


// ======================================================
// CHECKOUT
// ======================================================

checkoutButton.addEventListener(
    "click",
    () => {

        if (!cart.length) {

            alert("سبد سفارش خالی است.");

            return;

        }


        closeCart();

        checkoutModal.hidden = false;

    }
);


function closeCheckout() {

    checkoutModal.hidden = true;

}


document
    .getElementById("checkoutOverlay")
    .addEventListener(
        "click",
        closeCheckout
    );


// ======================================================
// ORDER
// ======================================================

orderForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const order = {

            id: Date.now(),

            table:
                document
                    .getElementById("tableNumber")
                    .value
                    .trim(),

            customer:
                document
                    .getElementById("customerName")
                    .value
                    .trim(),

            note:
                document
                    .getElementById("customerNote")
                    .value
                    .trim(),

            items:
                cart.map(item => ({

                    name: item.name,

                    quantity: item.quantity

                })),

            status: "new",

            createdAt:
                new Date().toLocaleString("fa-IR")

        };


        orders.unshift(order);

        saveOrders();


        cart = [];

        updateCart();

        orderForm.reset();

        closeCheckout();

        updateAdmin();


        alert(
            "سفارش با موفقیت ثبت شد ✅"
        );

    }
);


// ======================================================
// CATEGORIES
// ======================================================

document
    .querySelectorAll(".category")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".category")
                    .forEach(
                        b =>
                            b.classList.remove(
                                "active"
                            )
                    );


                button.classList.add("active");


                currentCategory =
                    button.dataset.category;


                renderProducts();

            }
        );

    });


searchInput.addEventListener(
    "input",
    renderProducts
);


// ======================================================
// ADMIN LOGIN
// ======================================================

adminButton.addEventListener(
    "click",
    () => {

        adminLoginModal.hidden = false;

        adminPassword.focus();

    }
);


function loginAdmin() {

    if (
        adminPassword.value.trim() ===
        ADMIN_PASSWORD
    ) {

        adminLoginModal.hidden = true;

        adminPanel.hidden = false;

        renderAdminProducts();

        renderAdminOrders();

        updateAdmin();

    } else {

        loginError.hidden = false;

    }

}


loginButton.addEventListener(
    "click",
    loginAdmin
);


adminPassword.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            loginAdmin();

        }

    }
);


document
    .getElementById("closeAdminLogin")
    .addEventListener(
        "click",
        () => {

            adminLoginModal.hidden = true;

        }
    );


document
    .getElementById("adminLoginOverlay")
    .addEventListener(
        "click",
        () => {

            adminLoginModal.hidden = true;

        }
    );


// ======================================================
// ADMIN PANEL
// ======================================================

document
    .getElementById("closeAdminPanel")
    .addEventListener(
        "click",
        () => {

            adminPanel.hidden = true;

        }
    );


document
    .querySelectorAll(".admin-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".admin-tab")
                    .forEach(
                        t =>
                            t.classList.remove(
                                "active"
                            )
                    );


                tab.classList.add("active");


                const type =
                    tab.dataset.adminTab;


                document
                    .getElementById("adminProducts")
                    .hidden =
                    type !== "products";


                document
                    .getElementById("adminOrders")
                    .hidden =
                    type !== "orders";

            }
        );

    });


// ======================================================
// ADD PRODUCT
// ======================================================

function openAddProduct() {

    productModalTitle.textContent =
        "محصول جدید";


    editProductId.value = "";

    productForm.reset();

    productModal.hidden = false;

}


document
    .getElementById("addProductButton")
    .addEventListener(
        "click",
        openAddProduct
    );


// ======================================================
// SAVE PRODUCT
// ======================================================

productForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            productName.value.trim();


        if (!name) {

            alert(
                "نام محصول را وارد کنید."
            );

            return;

        }


        const id =
            editProductId.value;


        if (id) {

            const product =
                products.find(
                    p =>
                        Number(p.id) ===
                        Number(id)
                );


            if (product) {

                product.name =
                    name;

                product.description =
                    productDescription.value.trim();

                product.category =
                    productCategory.value;

            }

        } else {

            products.push({

                id: Date.now(),

                name,

                description:
                    productDescription.value.trim(),

                category:
                    productCategory.value

            });

        }


        saveProducts();

        renderProducts();

        renderAdminProducts();

        productModal.hidden = true;

        productForm.reset();

    }
);


// ======================================================
// EDIT PRODUCT
// ======================================================

function editProduct(id) {

    const product =
        products.find(
            p =>
                Number(p.id) ===
                Number(id)
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

function deleteProduct(id) {

    const product =
        products.find(
            p =>
                Number(p.id) ===
                Number(id)
        );


    if (!product) return;


    if (
        !confirm(
            `محصول «${product.name}» حذف شود؟`
        )
    ) {

        return;

    }


    products =
        products.filter(
            p =>
                Number(p.id) !==
                Number(id)
        );


    saveProducts();

    renderProducts();

    renderAdminProducts();

}


// ======================================================
// ADMIN PRODUCTS
// ======================================================

function renderAdminProducts() {

    adminProductList.innerHTML = "";


    if (!products.length) {

        adminProductList.innerHTML =
            `<div class="empty-state">
                محصولی وجود ندارد.
            </div>`;

        return;

    }


    products.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "admin-product-card";


        card.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(product.name)}
                </strong>

                <p>
                    ${escapeHTML(
                        product.description || ""
                    )}
                </p>

                <small>
                    ${categoryName(
                        product.category
                    )}
                </small>

            </div>


            <div class="admin-actions">

                <button
                    data-edit="${product.id}"
                >
                    ✏️ ویرایش
                </button>

                <button
                    class="delete"
                    data-delete="${product.id}"
                >
                    🗑️ حذف
                </button>

            </div>

        `;


        adminProductList.appendChild(card);

    });

}


adminProductList.addEventListener(
    "click",
    event => {

        const edit =
            event.target.closest(
                "[data-edit]"
            );


        if (edit) {

            editProduct(
                edit.dataset.edit
            );

            return;

        }


        const del =
            event.target.closest(
                "[data-delete]"
            );


        if (del) {

            deleteProduct(
                del.dataset.delete
            );

        }

    }
);


// ======================================================
// CLOSE PRODUCT MODAL
// ======================================================

document
    .getElementById("cancelProduct")
    .addEventListener(
        "click",
        () => {

            productModal.hidden = true;

        }
    );


document
    .getElementById("productModalOverlay")
    .addEventListener(
        "click",
        () => {

            productModal.hidden = true;

        }
    );


// ======================================================
// ADMIN ORDERS
// ======================================================

function renderAdminOrders() {

    adminOrderList.innerHTML = "";


    if (!orders.length) {

        adminOrderList.innerHTML =
            `<div class="empty-state">
                <div class="empty-icon">🔔</div>
                <h3>هنوز سفارشی ثبت نشده</h3>
            </div>`;

        return;

    }


    orders.forEach(order => {

        const card =
            document.createElement("div");


        card.className =
            "admin-order-card";


        const items =
            order.items
                .map(
                    item =>
                        `<div class="order-item">
                            <span>
                                ${escapeHTML(item.name)}
                            </span>

                            <strong>
                                × ${item.quantity}
                            </strong>
                        </div>`
                )
                .join("");


        card.innerHTML = `

            <div class="order-header">

                <span class="order-number">
                    سفارش #${String(
                        order.id
                    ).slice(-4)}
                </span>

                <span class="order-time">
                    ${escapeHTML(
                        order.createdAt
                    )}
                </span>

            </div>


            <div class="order-info">

                🪑 میز:
                ${escapeHTML(order.table)}

                ${
                    order.customer
                        ? ` | 👤 ${escapeHTML(order.customer)}`
                        : ""
                }

            </div>


            ${items}


            ${
                order.note
                    ? `<div class="order-note">
                        📝 ${escapeHTML(order.note)}
                    </div>`
                    : ""
            }


            <select
                class="order-status"
                data-status="${order.id}"
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


adminOrderList.addEventListener(
    "change",
    event => {

        const select =
            event.target.closest(
                "[data-status]"
            );


        if (!select) return;


        const order =
            orders.find(
                o =>
                    Number(o.id) ===
                    Number(select.dataset.status)
            );


        if (!order) return;


        order.status =
            select.value;


        saveOrders();

        updateAdmin();

    }
);


// ======================================================
// ADMIN COUNT
// ======================================================

function updateAdmin() {

    const newOrders =
        orders.filter(
            order =>
                order.status === "new"
        ).length;


    adminOrderCount.textContent =
        newOrders.toLocaleString("fa-IR");

}


// ======================================================
// START
// ======================================================

renderProducts();

updateCart();

renderAdminProducts();

renderAdminOrders();

updateAdmin();

console.log(
    "Cafe Parvaz loaded successfully ✅"
);
