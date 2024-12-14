// Selectors and Initial Setup
const productsContainer = document.querySelector(".productsContainer");
let productBasket = JSON.parse(localStorage.getItem("shoppingBasket")) || [];

// Render Products in Basket
const renderProducts = () => {
  productsContainer.innerHTML = ""; // Clear the container
  const validProducts =
    JSON.parse(localStorage.getItem("shoppingBasket")) || [];
  productBasket = validProducts; // Sync the global state with localStorage
  validProducts.forEach((item) => {
    const productID = item.productName.replace(/\s+/g, "_"); // Generate productID
    fetchProductDetails(productID, item);
  });
};

let productPricesArray = [];
// Fetch Product Details
const fetchProductDetails = async (productID, basketItem) => {
  try {
    // Display a loading indicator
    showLoadingIndicator();

    const response = await fetch(
      `https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/products/${productID}.json`
    );
    if (!response.ok) throw new Error(`Failed to fetch product: ${productID}`);

    const data = await response.json();
    let productTotalPrice = data.productPrice * basketItem.quantity;

    // Check if the product is still in the basket
    const isStillInBasket = productBasket.some(
      (item) => item.productName === basketItem.productName
    );
    if (!isStillInBasket) return; // Skip rendering if product was deleted

    // Create product card
    createDomCard(
      data.productImages[0].url,
      data.productName,
      basketItem.size,
      basketItem.color,
      data.productPrice,
      basketItem.quantity
    );

    productPricesArray.push(productTotalPrice);
    calculateTotalPrice(productPricesArray);

    // Remove loading indicator
    hideLoadingIndicator();
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    hideLoadingIndicator();
  }
};

// Create Product DOM Card

const createDomCard = (
  productImg,
  productTitle,
  productSize,
  productColor,
  productPrice,
  productQuantity
) => {
  let productTotalPrice = productPrice * productQuantity;
  const productCardHtml = `
    <div class="flex flex-row justify-between items-center border-b pb-4" data-product="${productTitle}">
      <div class="flex flex-row gap-4 items-center w-2/3">
        <img
          class="w-24 h-24 rounded-lg object-cover"
          src="${productImg}"
          alt="${productTitle}"
        />
        <div class="flex flex-col gap-1">
          <h6 class="font-semibold text-lg">${productTitle}</h6>
          <span class="text-gray-500 text-sm">Size: ${productSize}</span>
          <span class="text-gray-500 text-sm">Color: ${productColor}</span>
          <span class="font-bold text-lg">
            $<span class="product-total-price">${productTotalPrice}</span>
          </span>
        </div>
      </div>

      <div class="flex flex-row gap-4 items-center">
        <i
          class="fas fa-trash text-red-500 cursor-pointer text-xl"
          onclick="removeProductFromBasket('${productTitle}')"
        ></i>
        <div class="flex items-center border rounded-lg">
          <input
            onchange="updateProductPrice(event, '${productTitle}', ${productPrice})"
            type="number"
            min="1"
            max="15"
            value="${productQuantity}"
            class="w-12 text-center outline-none p-2 rounded-xl quantity-input"
          />
        </div>
      </div>
    </div>`;

  productsContainer.insertAdjacentHTML("beforeend", productCardHtml);
};

let promoCodeArray = ["promo", "off", "first", "winter"];

let totalPriceElement = document.getElementById("totalPriceElement");
const promoCodeInput = document.getElementById("promoCodeInput");
const applyPromoCodeBtn = document.getElementById("applyPromoCode");
function calculateTotalPrice(price) {
  let priceSum = price.reduce((prev, curr) => {
    return prev + curr;
  });

  let diliveryPrice = priceSum * 0.01;
  let totalPrice = priceSum + diliveryPrice;
  document.getElementById("subtotalElement").innerHTML = `$${priceSum}`;

  document.getElementById(
    "diliveryPriceElem"
  ).innerHTML = `$${diliveryPrice.toFixed(2)}`;

  totalPriceElement.innerHTML = `$${totalPrice}`;

  applyPromoCodeBtn.addEventListener("click", () => {
    calculatePromoCode(priceSum, totalPrice);
  });

  promoCodeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      calculatePromoCode(priceSum, totalPrice);
    }
  });

  // console.log(total);
}
//

function calculatePromoCode(priceSum, totalPrice) {
  const promoCode = promoCodeInput.value;

  let discount = 0;
  let discountElem = document.getElementById("discountElem");
  let discountSection = document.getElementById("discountContainer");

  if (promoCodeArray.includes(promoCode)) {
    discount += priceSum * 0.1;
    if (discount > 0) {
      discountSection.classList.remove("hidden");
      discountElem.innerHTML = `-$${discount.toFixed(2)}`;
      totalPriceElement.innerHTML = (totalPrice - discount).toFixed(2);
    } else {
      discountSection.classList.add("hidden");
    }
  }
}

// Remove Product from Basket
const removeProductFromBasket = (productTitle) => {
  const updatedBasket = productBasket.filter(
    (item) => item.productName !== productTitle
  );
  localStorage.setItem("shoppingBasket", JSON.stringify(updatedBasket));
  productBasket = updatedBasket; // Update the global `productBasket` variable
  productPricesArray = [];
  loadProductCountInBasket(productBasket);
  renderProducts();
};

// Show Loading Indicator
const showLoadingIndicator = () => {
  const loadingHtml = `
    <div class="loading-indicator text-center text-gray-500">
      Loading products...
    </div>`;
  productsContainer.insertAdjacentHTML("beforeend", loadingHtml);
};

// Hide Loading Indicator
const hideLoadingIndicator = () => {
  const loadingIndicator = document.querySelector(".loading-indicator");
  if (loadingIndicator) loadingIndicator.remove();
};

const updateProductPrice = (event, productTitle, productPrice) => {
  const newQuantity = parseInt(event.target.value, 10);

  if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > 15) {
    alert("Please enter a valid quantity (between 1 and 15).");
    return;
  }

  // Update the basket in localStorage
  const productIndex = productBasket.findIndex(
    (item) => item.productName === productTitle
  );

  if (productIndex > -1) {
    // Get the old quantity and price
    const oldQuantity = productBasket[productIndex].quantity;
    const oldPrice = oldQuantity * productPrice;

    // Update the basket quantity
    productBasket[productIndex].quantity = newQuantity;
    localStorage.setItem("shoppingBasket", JSON.stringify(productBasket));

    // Remove the old price from productPricesArray
    const oldPriceIndex = productPricesArray.indexOf(oldPrice);
    if (oldPriceIndex > -1) {
      productPricesArray.splice(oldPriceIndex, 1);
    }

    // Calculate the new price and update the DOM
    const parentElement = event.target.closest("[data-product]");
    const totalPriceElement = parentElement.querySelector(
      ".product-total-price"
    );
    const newPrice = productPrice * newQuantity;

    // Add the new price to the array
    productPricesArray.push(newPrice);
    totalPriceElement.textContent = `${newPrice.toFixed(2)}`;

    // Recalculate the total price
    calculateTotalPrice(productPricesArray);
  }
};

function loadProductCountInBasket(basket) {
  const shoppingBasketLength = $.getElementById("shopping-basket-length");
  // let productInShoppingBasket = JSON.parse(localStorage.getItem('shoppingBasket'));
  shoppingBasketLength.style.display = "none";
  if (basket) {
    shoppingBasketLength.style.display = "block";
    shoppingBasketLength.innerHTML = basket.length;
  }
}

// Initial Render
renderProducts();
