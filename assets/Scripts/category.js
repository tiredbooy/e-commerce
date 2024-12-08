// const loading = document.getElementById("loading");

// document.addEventListener("DOMContentLoaded", () => {
//   const title = document.querySelector("title");
//   const productCardContainer = document.getElementById("productCardContainer");

//   // Get the query string from the URL
//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);
//   const category = urlParams.get("category");

//   // Update the page title and load products
//   if (category) {
//     // Capitalize the first letter of the category
//     const formattedCategory =
//       category.charAt(0).toUpperCase() + category.slice(1);

//     // Update the document title
//     title.textContent = formattedCategory;
//     document.getElementById("category-title").textContent = formattedCategory;

//     // Load products for the specified category
//     loadProducts(category.toLowerCase());
//   } else {
//     // No category specified, set default title and load all products
//     title.textContent = "All Products";
//     document.getElementById("category-title").textContent = "All Products";

//     // Load all products (no filtering)
//     loadProducts();
//   }

//   // Function to fetch and display products
//   async function loadProducts(category) {
//     try {
//       // Fetch the product data from the database
//       const response = await fetch(
//         `https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/products.json`
//       );
//       const data = await response.json();

//       // Hide the loading spinner and show the product container
//       loading.classList.add("hidden");
//       productCardContainer.classList.remove("hidden");

//       // Convert the data into an array of product entries
//       const productsArray = Object.entries(data);

//       // Filter the products if a category is specified
//       const filteredProducts = category
//         ? productsArray.filter(([name, info]) => info.productCategory === category)
//         : productsArray; // If no category, show all products

//       // Clear the product container before adding new products
//       productCardContainer.innerHTML = "";

//       // Loop through the filtered products and display them
//       filteredProducts.forEach(([name, productInfo]) => {
//         const mainProductImg = productInfo.productImages[0]?.url || "placeholder.jpg";

//         createProduct(
//           mainProductImg,
//           productInfo.productName,
//           productInfo.productDescription,
//           productInfo.productPrice
//         );
//       });
//     } catch (error) {
//       console.error("Error loading products:", error);
//     }
//   }

//   // Function to create and render a product card
//   function createProduct(productImg, productTitle, productDes, productPrice) {
//     const productCard = `
//       <div class="product-card p-2 rounded flex flex-col gap-3 bg-white group relative overflow-hidden cursor-pointer">
//         <div class="w-full h-56 lg:h-80 relative">
//           <!-- Image -->
//           <img class="h-full w-full object-cover rounded-2xl transition-all duration-300 group-hover:brightness-75" 
//                src="${productImg}" 
//                alt="${productTitle}">
          
//           <!-- Icons Overlay -->
//           <div class="absolute inset-0 flex justify-center items-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//             <button class="bg-white h-9 w-9 rounded-full shadow-md hover:bg-gray-200">
//               <i class="fas fa-shopping-basket text-gray-700"></i>
//             </button>
//             <button class="bg-white h-9 w-9 rounded-full shadow-md hover:bg-gray-200">
//               <i class="fas fa-search text-gray-700"></i>
//             </button>
//             <button class="bg-white h-9 w-9 rounded-full shadow-md hover:bg-gray-200">
//               <i class="fas fa-heart text-gray-700"></i>
//             </button>
//           </div>
//         </div>
        
//         <!-- Product Info -->
//         <div class="flex flex-col gap-2">
//           <a target="_blank" href="javascript:void(0)" onclick="openProductPage('${productTitle}')"  class="font-bold text-lg">${productTitle}</a>
//           <span class="text-gray-500">${productDes}</span>
//           <span class="font-bold text-xl">$${productPrice}</span>
//         </div>
//       </div>
//     `;

//     productCardContainer.insertAdjacentHTML("beforeend", productCard);
//   }

//   // Function to handle product click events
 
// });

// function openProductPage(productTitle) {
//   // Use localStorage or URL parameters to pass the product info to another page
//   // localStorage.setItem("selectedProduct", productTitle);
//   window.location.href = `product-detail.html/${productTitle}`
// }
