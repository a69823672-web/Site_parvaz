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
    document
