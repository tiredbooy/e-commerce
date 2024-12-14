const loading = document.getElementById("loading");

document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector("title");
  const productCardContainer = document.getElementById("productCardContainer");

  // Get the query string from the URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get("category");

  // Update the page title and load products
  if (category) {
    // Capitalize the first letter of the category
    const formattedCategory =
      category.charAt(0).toUpperCase() + category.slice(1);

    // Update the document title
    title.textContent = formattedCategory;
    document.getElementById("category-title").textContent = formattedCategory;

    // Load products for the specified category
    loadProducts(category.toLowerCase());
  } else {
    // No category specified, set default title and load all products
    title.textContent = "All Products";
    document.getElementById("category-title").textContent = "All Products";

    // Load all products (no filtering)
    loadProducts();
  }

  // Function to fetch and display products
  async function loadProducts(category) {
    // Check if products are cached in localStorage
    const cachedData = localStorage.getItem("products");
    if (cachedData) {
        const data = JSON.parse(cachedData);
        renderProducts(data, category);
        return; // Exit the function after rendering cached data
    }

    try {
        // Fetch products from Firebase
        const response = await fetch(
            `https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/products.json`
        );
        const data = await response.json();

        // loading.classList.add('hidden')
        // productCardContainer.classList.remove('hidden')

        // Cache the fetched data in localStorage
        
        let productsArray = {...data}
        localStorage.setItem("products", JSON.stringify(productsArray));

        // Render products
        renderProducts(data, category);
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function renderProducts(data, category) {
  // Convert the data into an array of product entries
  const productsArray = Object.entries(data);

  // Filter products based on the specified category, if any
  const filteredProducts = category
      ? productsArray.filter(([name, info]) => info.productCategory === category)
      : productsArray;

  // Clear the product container before rendering new products
  productCardContainer.innerHTML = "";

  // Loop through the filtered products and call createProduct for each
  filteredProducts.forEach(([name, productInfo]) => {
      const mainProductImg = productInfo.productImages?.[0]?.url || "placeholder.jpg";

      createProduct(
          mainProductImg,
          productInfo.productName,
          productInfo.productDescription,
          productInfo.productPrice
      );
  });
}


  // Function to create and render a product card
function createProduct(productImg, productTitle, productDes, productPrice) {
    const productCard = `
      <div class="product-card p-2 rounded flex flex-col gap-3 bg-white group relative overflow-hidden cursor-pointer">
        <div class="w-full h-56 lg:h-80 relative">
          <!-- Image -->
          <img class="h-full w-full object-cover rounded-2xl transition-all duration-300 group-hover:brightness-75" 
               src="${productImg}" 
               alt="${productTitle}">
          
          <!-- Icons Overlay -->
          <div class="absolute inset-0 flex justify-center items-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button onclick="addToShoppingBasket(event,'${productTitle}')" class="bg-white h-9 w-9 rounded-full shadow-md hover:bg-gray-200">
              <i class="fas fa-shopping-basket text-gray-700"></i>
            </button>
            <button onclick="addToFavorit(event,'${productTitle}')" class="bg-white h-9 w-9 rounded-full shadow-md hover:bg-gray-200">
              <i class="fas fa-heart text-gray-700"></i>
            </button>
          </div>
        </div>
        
        <!-- Product Info -->
        <div class="flex flex-col gap-2">
          <a target="_blank" href="" onclick="openProductPage(event,'${productTitle}')"  class="font-bold text-lg">${productTitle}</a>
          <span class="text-gray-500">${productDes}</span>
          <span class="font-bold text-xl">$${productPrice}</span>
        </div>
      </div>
    `;

    productCardContainer.insertAdjacentHTML("beforeend", productCard);
}

// javascript:void(0)

 
});

function openProductPage(event,productTitle) {
  // window.location.href = `/Pages/product.html?product=${productTitle}`; // Navigate to category.html with query parameter
  event.target.href = `/Pages/product.html?product=${productTitle}`;
}

function addToShoppingBasket(event,productTitle){
  const clickedBtn = event.target;
  clickedBtn.classList.add('animate-pulse');
  clickedBtn.classList.remove('text-gray-700')
  setTimeout(() => {
    clickedBtn.classList.remove('animate-pulse');
    clickedBtn.classList.add('text-gray-700')
    
  }, 1000);
 
  let shoppingBasket = {
    productName : productTitle,
    quantity : 1,
    color : 'white',
    size: 'L'
  }

  let savedBasket = JSON.parse(localStorage.getItem('shoppingBasket')) || [];
  savedBasket.push(shoppingBasket);

  localStorage.setItem('shoppingBasket', JSON.stringify(savedBasket));

  loadProductCountInBasket(savedBasket)
}

function addToFavorit(event,productTitle){
  let heartBtn = event.target
  // event.target.classLIst.replace('text-gray-700','text-red-500')
  heartBtn.classList.toggle('text-red-500')
  heartBtn.classList.toggle('text-gray-700')
}

function loadProductCountInBasket(basket) {
  const shoppingBasketLength = $.getElementById('shopping-basket-length');
  // let productInShoppingBasket = JSON.parse(localStorage.getItem('shoppingBasket'));
  shoppingBasketLength.style.display = 'none';
  if(basket){
    shoppingBasketLength.style.display = 'block';
    shoppingBasketLength.innerHTML = basket.length;
  }
}
