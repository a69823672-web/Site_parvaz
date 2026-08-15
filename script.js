// ===============================
// CAFE PARVAZ - SCRIPT
// ===============================

// محصولات فعلی کافه
const products = [
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


// ===============================
// VARIABLES
// ===============================

let cart = [];

let currentCategory = "all";


// ===============================
// ELEMENTS
// ===============================

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

const cartModal =
    document.getElementById("cartModal");

const cartItems =
    document.getElementById("cartItems");

const checkoutModal =
    document.getElementById("checkoutModal");


// ===============================
// SHOW PRODUCTS
// ===============================

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
                        ${product.name}
                    </h3>

                    <p>
                        ${product.description}
                    </p>

                    <div class="product-bottom">

                        <button
                            class="add-button"
                            onclick="addToCart(${product.id})"
                            aria-label="افزودن ${product.name}"
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


// ===============================
// ADD TO CART
// ===============================

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

            ...product,

            quantity: 1

        });

    }


    updateCart();

}


// ===============================
// REMOVE FROM CART
// ===============================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    updateCart();

}


// ===============================
// CHANGE QUANTITY
// ===============================

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

        removeFromCart(productId);

        return;

    }


    updateCart();

}


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    const totalQuantity =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    cartCount.textContent =
        totalQuantity.toLocaleString("fa-IR");


    floatingCart.hidden =
        cart.length === 0;


    renderCart();

}


// ===============================
// RENDER CART
// ===============================

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
                    ${item.name}
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


// ===============================
// CATEGORY BUTTONS
// ===============================

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


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    renderProducts
);


// ===============================
// OPEN CART
// ===============================

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


// ===============================
// CLOSE CART
// ===============================

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


// ===============================
// CHECKOUT
// ===============================

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


// ===============================
// CLOSE CHECKOUT
// ===============================

document
    .getElementById("checkoutOverlay")
    .addEventListener(
        "click",
        () => {

            checkoutModal.hidden = true;

        }
    );


// ===============================
// SUBMIT ORDER
// ===============================

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
                    .value;


            const customerNote =
                document
                    .getElementById(
                        "customerNote"
                    )
                    .value;


            const order = {

                id: Date.now(),

                table: tableNumber,

                customer: customerName,

                note: customerNote,

                items: cart.map(item => ({

                    name: item.name,

                    quantity: item.quantity

                })),

                createdAt:
                    new Date()
                        .toLocaleString("fa-IR")

            };


            // فعلاً فقط برای تست
            console.log(
                "CAFE PARVAZ ORDER:",
                order
            );


            alert(
                "سفارش شما ثبت شد ✅"
            );


            cart = [];


            updateCart();


            checkoutModal.hidden = true;


            event.target.reset();

        }
    );


// ===============================
// INITIAL LOAD
// ===============================

renderProducts();

updateCart();
