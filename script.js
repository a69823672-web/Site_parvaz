// =====================================================
// CAFE PARVAZ — SCRIPT
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
// LOCAL STORAGE
// =====================================================

let products =
    JSON.parse(
        localStorage.getItem("cafeParvazProducts")
    ) || defaultProducts;


let orders =
    JSON.parse(
        localStorage.getItem("cafeParvazOrders")
    ) || [];


let cart = [];

let currentCategory = "all";


// =====================================================
// ELEMENTS
// =====================================================

const productsContainer =
    document.getElementById("products");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const categories =
    document.querySelectorAll(".category");

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

const checkoutModal =
    document.getElementById("checkoutModal");

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


// =====================================================
// SAVE DATA
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

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredProducts =
        products.filter(product => {

            const categoryMatch =
                currentCategory === "all" ||
                product.category === currentCategory;


            const searchMatch =
                product.name
                    .toLowerCase()
                    .includes(searchText) ||

                product.description
                    .toLowerCase()
                    .includes(searchText);


            return categoryMatch && searchMatch;

        });


    productsContainer.innerHTML = "";


    if (filteredProducts.length === 0) {

        emptyState.hidden = false;

        return;

    }


    emptyState.hidden = true;


    filteredProducts.forEach(
        (product, index) => {

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
                            onclick="addToCart(${product.id})"
                            aria-label="افزودن محصول"
                        >
                            +
                        </button>

                    </div>

                </div>

            `;


            productsContainer.appendChild(card);

        }
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    const existing =
        cart.find(
            item => item.id === productId
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


// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            product =>
                product.id === productId
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


// =====================================================
// UPDATE CART
// =====================================================

function updateCart() {

    const totalQuantity =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    cartCount.textContent =
        totalQuantity.toLocaleString("fa-IR");


    cartTotal.textContent =
        `${totalQuantity.toLocaleString("fa-IR")} محصول`;


    floatingCart.hidden =
        totalQuantity === 0;


    renderCart();

}


// =====================================================
// RENDER CART
// =====================================================

function renderCart() {

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
                    onclick="changeQuantity(
                        ${item.id},
                        1
                    )"
                >
                    +
                </button>

                <strong>
                    ${item.quantity.toLocaleString("fa-IR")}
                </strong>

                <button
                    onclick="changeQuantity(
                        ${item.id},
                        -1
                    )"
                >
                    −
                </button>

            </div>

        `;


        cartItems.appendChild(element);

    });

}


// =====================================================
// CATEGORY
// =====================================================

categories.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categories.forEach(
                item =>
                    item.classList.remove("active")
            );


            button.classList.add("active");


            currentCategory =
                button.dataset.category;


            renderProducts();

        }
    );

});


// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener(
    "input",
    renderProducts
);


// =====================================================
// CART OPEN
// =====================================================

document
    .getElementById("cartButton")
    .addEventListener(
        "click",
        () => {

            cartModal.hidden = false;

        }
    );


document
    .getElementById("openCart")
    .addEventListener(
        "click",
        () => {

            cartModal.hidden = false;

        }
    );


// =====================================================
// CART CLOSE
// =====================================================

document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        () => {

            cartModal.hidden = true;

        }
    );


document
    .getElementById("modalOverlay")
    .addEventListener(
        "click",
        () => {

            cartModal.hidden = true;

        }
    );


// =====================================================
// CHECKOUT
// =====================================================

document
    .getElementById("checkoutButton")
    .addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                alert(
                    "سبد سفارش خالی است."
                );

                return;

            }


            cartModal.hidden = true;

            checkoutModal.hidden = false;

        }
    );


// =====================================================
// CLOSE CHECKOUT
// =====================================================

document
    .getElementById("checkoutOverlay")
    .addEventListener(
        "click",
        () => {

            checkoutModal.hidden = true;

        }
    );


// =====================================================
// SUBMIT ORDER
// =====================================================

document
    .getElementById("orderForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "سبد سفارش خالی است."
                );

                return;

            }


            const tableNumber =
                document
                    .getElementById(
                        "tableNumber"
                    )
                    .value;


            const customerName =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const customerNote =
                document
                    .getElementById(
                        "customerNote"
                    )
                    .value
                    .trim();


            const order = {

                id: Date.now(),

                table:
                    tableNumber,

                customer:
                    customerName,

                note:
                    customerNote,

                items:
                    cart.map(item => ({

                        name:
                            item.name,

                        quantity:
                            item.quantity

                    })),

                status:
                    "new",

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


            checkoutModal.hidden = true;


            event.target.reset();


            updateAdminOrderCount();


            alert(
                "سفارش با موفقیت ثبت شد ✅"
            );

        }
    );


// =====================================================
// ADMIN LOGIN
// =====================================================

adminButton.addEventListener(
    "click",
    () => {

        adminPassword.value = "";

        loginError.hidden = true;

        adminLoginModal.hidden = false;

        setTimeout(
            () => adminPassword.focus(),
            100
        );

    }
);


// =====================================================
// LOGIN
// =====================================================

function loginAdmin() {

    if (
        adminPassword.value ===
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


// =====================================================
// CLOSE LOGIN
// =====================================================

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


// =====================================================
// CLOSE ADMIN PANEL
// =====================================================

document
    .getElementById("closeAdminPanel")
    .addEventListener(
        "click",
        () => {

            adminPanel.hidden = true;

        }
    );


// =====================================================
// ADMIN TABS
// =====================================================

document
    .querySelectorAll(".admin-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".admin-tab")
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                tab.classList.add("active");


                const selected =
                    tab.dataset.adminTab;


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


// =====================================================
// ADMIN PRODUCTS
// =====================================================

function renderAdminProducts() {

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
                    onclick="editProduct(${product.id})"
                >
                    ✏️ ویرایش
                </button>

                <button
                    class="delete-product"
                    onclick="deleteProduct(${product.id})"
                >
                    🗑️ حذف
                </button>

            </div>

        `;


        adminProductList.appendChild(card);

    });

}


// =====================================================
// ADD PRODUCT
// =====================================================

document
    .getElementById("addProductButton")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "productModalTitle"
                )
                .textContent =
                "محصول جدید";


            document
                .getElementById(
                    "editProductId"
                )
                .value = "";


            document
                .getElementById(
                    "productForm"
                )
                .reset();


            document
                .getElementById(
                    "productModal"
                )
                .hidden = false;

        }
    );


// =====================================================
// SAVE PRODUCT
// =====================================================

document
    .getElementById("productForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const id =
                document
                    .getElementById(
                        "editProductId"
                    )
                    .value;


            const name =
                document
                    .getElementById(
                        "productName"
                    )
                    .value
                    .trim();


            const description =
                document
                    .getElementById(
                        "productDescription"
                    )
                    .value
                    .trim();


            const category =
                document
                    .getElementById(
                        "productCategory"
                    )
                    .value;


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

                    id:
                        Date.now(),

                    name,

                    description,

                    category

                });

            }


            saveProducts();


            renderProducts();

            renderAdminProducts();


            document
                .getElementById(
                    "productModal"
                )
                .hidden = true;


            event.target.reset();


            alert(
                "محصول با موفقیت ذخیره شد ✅"
            );

        }
    );


// =====================================================
// EDIT PRODUCT
// =====================================================

function editProduct(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) return;


    document
        .getElementById(
            "productModalTitle"
        )
        .textContent =
        "ویرایش محصول";


    document
        .getElementById(
            "editProductId"
        )
        .value =
        product.id;


    document
        .getElementById(
            "productName"
        )
        .value =
        product.name;


    document
        .getElementById(
            "productDescription"
        )
        .value =
        product.description || "";


    document
        .getElementById(
            "productCategory"
        )
        .value =
        product.category;


    document
        .getElementById(
            "productModal"
        )
        .hidden = false;

}


// =====================================================
// DELETE PRODUCT
// =====================================================

function deleteProduct(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) return;


    const confirmed =
        confirm(
            `آیا محصول «${product.name}» حذف شود؟`
        );


    if (!confirmed) return;


    products =
        products.filter(
            item =>
                item.id !== productId
        );


    saveProducts();


    renderProducts();

    renderAdminProducts();

}


// =====================================================
// CLOSE PRODUCT MODAL
// =====================================================

document
    .getElementById("cancelProduct")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "productModal"
                )
                .hidden = true;

        }
    );


document
    .getElementById("productModalOverlay")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "productModal"
                )
                .hidden = true;

        }
    );


// =====================================================
// ADMIN ORDERS
// =====================================================

function renderAdminOrders() {

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
                            × ${item.quantity.toLocaleString("fa-IR")}
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

                            📝
                            ${escapeHTML(order.note)}

                        </div>
                    `
                    : ""
            }


            <select
                class="order-status"
                onchange="changeOrderStatus(
                    ${order.id},
                    this.value
                )"
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


// =====================================================
// CHANGE ORDER STATUS
// =====================================================

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


    order.status = status;


    saveOrders();


    updateAdminOrderCount();

}


// =====================================================
// ORDER COUNT
// =====================================================

function updateAdminOrderCount() {

    const newOrders =
        orders.filter(
            order =>
                order.status === "new"
        ).length;


    adminOrderCount.textContent =
        newOrders.toLocaleString("fa-IR");

}


// =====================================================
// INITIAL LOAD
// =====================================================

renderProducts();

updateCart();

updateAdminOrderCount();
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.changeOrderStatus = changeOrderStatus;
