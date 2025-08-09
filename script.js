// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Cart Elements
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');

const CART_STORAGE_KEY = 'kanyin_nails_cart';
let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = count;
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
  updateCartTotal();
}

function renderCartItems() {
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  cart.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-minus" data-id="${item.id}">-</button>
        <span>${item.qty}</span>
        <button class="qty-plus" data-id="${item.id}">+</button>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name}">&times;</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartItemsContainer.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      changeQty(btn.dataset.id, -1);
    });
  });
  cartItemsContainer.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      changeQty(btn.dataset.id, 1);
    });
  });
  cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeItem(btn.dataset.id);
    });
  });
}

function changeQty(id, delta) {
  const itemIndex = cart.findIndex(i => i.id === id);
  if (itemIndex > -1) {
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty < 1) {
      cart.splice(itemIndex, 1);
    }
    saveCart();
  }
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalEl.textContent = total.toFixed(2);
}

function openCart() {
  cartOverlay.classList.add('active');
  cartDrawer.classList.add('active');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartOverlay.classList.remove('active');
  cartDrawer.classList.remove('active');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Initialize
saveCart();
