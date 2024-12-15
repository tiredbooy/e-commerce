const loading = document.getElementById("loading");
const productsArray = JSON.parse(localStorage.getItem("products"));

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



  // Function to create and render a product card


// javascript:void(0)

 
});

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

const selectedSize = document.querySelectorAll('.sizeBtns');
selectedSize.forEach(btn => {
  btn.addEventListener('click', () => {
    handleUserSelectedSize(event)
  })
})
let userSelectedSize = null;
function handleUserSelectedSize(event) {
  selectedSize.forEach(btn => {
    // btn.classList.remove("bg-black");
    btn.classList.replace("bg-black","bg-gray-200");

    btn.classList.remove("text-white");
  })

  let selectedBtn = event.target;
  
  userSelectedSize = selectedBtn.getAttribute('data-size');

  if (!selectedBtn.classList.contains("bg-black")) {
    selectedBtn.classList.replace("bg-gray-200","bg-black");
    selectedBtn.classList.add("text-white");
  }

}


const selectedColorBtns = document.querySelectorAll('.colorBtns');
selectedColorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    handleColorCircles(event)
})
})

let userSelectedColor = null;

function handleColorCircles(event) {
  let selectedColor = event.target;
  // Remove selection from all circles
  selectedColorBtns.forEach((circle) => {
    circle.classList.remove("border-black");
    circle.classList.remove("border-2");
  });

  // Toggle the selected color
  if (!selectedColor.classList.contains("border-black")) {
    selectedColor.classList.add("border-black");
    selectedColor.classList.add("border-2");
    userSelectedColor = selectedColor.getAttribute("data-color");
  }
}

// Add event listener to the parent container
const filterCategories = document.getElementById('filterCategories');
let userSelectedCategory = null;

filterCategories.addEventListener('click', (event) => {
  let target = event.target;

  // Check if the click is on the <a> or <li>
  if (target.tagName === 'A') {
    // If <a> was clicked, move to its parent <li>
    target = target.parentElement;
  }

  // Ensure the target is an <li> with the data-category attribute
  if (target.tagName === 'LI' && target.hasAttribute('data-category')) {
    userSelectedCategory = target.getAttribute('data-category');

    // Optional: Highlight the selected category
    Array.from(filterCategories.children).forEach((btn) => {
      btn.classList.remove('text-black');
      btn.classList.add('text-gray-500');
    });
    target.classList.replace('text-gray-500', 'text-black');
  }
});

applyFilterBtn.addEventListener('click', () => {
  productCardContainer.innerHTML = ''; // Clear the product display

  if (!productsArray) return;

  // Get all products as an array of entries
  let data = Object.entries(productsArray);

  // Filter products based on all selected filters
  let filteredProducts = data.filter(([name, info]) => {
    // Apply price filter
    const minPriceInput = document.getElementById('minPriceInput').value;
    const maxPriceInput = document.getElementById('maxPriceInput').value;
    const matchesPrice = !minPriceInput && !maxPriceInput
      || (info.productPrice >= (minPriceInput || 0) && info.productPrice <= (maxPriceInput || Infinity));

    // Apply size filter
    const matchesSize = !userSelectedSize || (info.sizes && info.sizes.includes(userSelectedSize));

    // Apply color filter
    const matchesColor = !userSelectedColor || (info.colors && info.colors.hasOwnProperty(userSelectedColor));

    const matchesCategory =  !userSelectedCategory || info.productCategory === userSelectedCategory
    // Return true only if the product matches all selected filters
    return matchesPrice && matchesSize && matchesColor && matchesCategory;
  });

  // Display the filtered products
  filteredProducts.forEach(([name, product]) => {
    const mainProductImg = product.productImages?.[0]?.url || "placeholder.jpg";
    createProduct(
      mainProductImg,
      product.productName,
      product.productDescription,
      product.productPrice
    );
  });

});

const productSortSelect = document.getElementById('productSortSelect');

productSortSelect.addEventListener('change', (event) => {
  // Get the selected sort option
  const sortOption = productSortSelect.value;

  if (!productsArray) return; // Ensure productsArray is defined

  // Convert productsArray to an array of entries for easier manipulation
  let data = Object.entries(productsArray);

  switch (sortOption) {
    case 'MostPopular':
      // Sort by sales (assumes `sales` property exists)
      data.sort(([aName, aInfo], [bName, bInfo]) => bInfo.sales - aInfo.sales);
      console.log('Sorted by Most Popular:', data);
      break;

    case 'Cheaper':
      // Sort by price (low to high)
      data.sort(([aName, aInfo], [bName, bInfo]) => aInfo.productPrice - bInfo.productPrice);
      console.log('Sorted by Cheaper:', data);
      break;

    case 'Expensive':
      // Sort by price (high to low)
      data.sort(([aName, aInfo], [bName, bInfo]) => bInfo.productPrice - aInfo.productPrice);
      console.log('Sorted by Expensive:', data);
      break;

    case 'Discount':
      // Sort by discount percentage (assumes `discount` property exists)
      data.sort(([aName, aInfo], [bName, bInfo]) => (bInfo.discount || 0) - (aInfo.discount || 0));
      console.log('Sorted by Discount:', data);
      break;

    default:
      console.log('No valid sort option selected');
  }

  // Clear existing products and display the sorted list
  productCardContainer.innerHTML = '';
  data.forEach(([name, product]) => {
    const mainProductImg = product.productImages?.[0]?.url || "placeholder.jpg";
    createProduct(
      mainProductImg,
      product.productName,
      product.productDescription,
      product.productPrice
    );
  });
});
