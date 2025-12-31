let cart = [];

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

async function fetchProducts() {
  const response = await fetch("http://localhost:5000/api/products");
  const products = await response.json();
  renderProducts(products);
}

function renderProducts(products) {
  const productGrid = document.getElementById("productGrid");
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const button = document.createElement("button");
    button.innerText = "Add to Cart";
    button.addEventListener("click", () => {
      addToCart(product);
    });

    card.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price}</p>
      `;

    card.appendChild(button);
    productGrid.appendChild(card);
  });
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  renderCart();
  saveCart();
}

function renderCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  const totalPriceDiv = document.getElementById("totalPrice");

  cartItemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
        <span>${item.name} (x${item.quantity})</span>
        <span>₹${item.price * item.quantity}</span>
        <button onclick="removeItem(${index})">Remove</button>
      `;

    cartItemsDiv.appendChild(div);
  });

  totalPriceDiv.innerText = `Total: ₹${total}`;
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    renderCart();
  }
}

loadCart();
fetchProducts();
