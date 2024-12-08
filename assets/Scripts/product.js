function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll("#product-info, #reviews, #faqs");
  sections.forEach((section) => section.classList.add("hidden"));

  // Remove active tab classes
  const tabs = document.querySelectorAll('[id^="tab-"]');
  tabs.forEach((tab) =>
    tab.classList.remove("border-gray-800", "text-gray-800")
  );

  // Show the selected section
  document.getElementById(sectionId).classList.remove("hidden");

  // Highlight the active tab
  document
    .getElementById(`tab-${sectionId}`)
    .classList.add('border-b-2',"border-gray-800", "text-gray-800");
}

// Show Product Info by default
showSection("product-info");


// const productDetailDom = ` <div class="flex flex-col  items-start md:flex-row lg:flex-row gap-5 flex-wrap ">
// <!-- Thumbnail Images -->
// <div class="flex flex-row md:flex-col lg:flex-col gap-5 ">
//     <img src="/assets/images/products-assets/01.webp" alt="" class="max-h-40 object-cover rounded-xl border hover:border-black cursor-pointer duration-150">
//     <img src="/assets/images/products-assets/02.webp" alt="" class="max-h-40 object-cover rounded-xl border hover:border-black cursor-pointer duration-150">
//     <img src="/assets/images/products-assets/03.webp" alt="" class="max-h-40 object-cover rounded-xl border hover:border-black cursor-pointer duration-150">
// </div>

// <!-- Main Image -->
// <div class="sm:w-full md:w-[30%] lg:w-[30%]">
//     <img src="/assets/images/products-assets/01.webp" alt="" class="max-h-full h-[520px] w-full object-cover rounded-xl">
// </div>

// <!-- Product Details -->
// <div class="w-full lg:w-[48%] flex flex-col gap-2">
//     <h2 class="text-3xl lg:text-4xl font-bold">PRODUCT NAME</h2>

//     <div class="flex items-center mt-2">
//         <div class="flex text-yellow-400 gap-2">
//             <i class="fas fa-star"></i>
//             <i class="fas fa-star"></i>
//             <i class="fas fa-star"></i>
//             <i class="fas fa-star"></i>
//             <i class="fas fa-star-half-alt"></i>
//         </div>
//         <span class="ml-2 text-gray-600">4.5/5</span>
//     </div>

//     <div class="mt-4">
//         <span class="text-2xl font-bold text-black">$260</span>
//         <span class="line-through text-gray-500">$300</span>
//         <span class="text-red-500">-40%</span>
//     </div>

//     <p class="mt-4 text-gray-700 border-b pb-5">
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam deleniti rerum voluptates ipsa ea. Esse maxime quo et fugiat magnam?
//     </p>

//     <div class="mt-4 border-b pb-5">
//         <span class="block text-gray-500 font-bold">Select Colors</span>
//         <div class="flex gap-2 mt-2">
//             <div class="w-9 h-9 bg-green-700 rounded-full cursor-pointer"></div>
//             <div class="w-9 h-9 bg-blue-700 rounded-full cursor-pointer"></div>
//             <div class="w-9 h-9 bg-gray-700 rounded-full cursor-pointer"></div>
//         </div>
//     </div>

//     <div class="mt-4 border-b pb-5">
//         <span class="block text-gray-500 font-bold">Choose Size</span>
//         <div class="flex gap-4 mt-2">
//             <button class="bg-gray-200 py-1 px-2 lg:py-2 lg:px-4 rounded-xl text-gray-500 hover:bg-black hover:text-white duration-150">S</button>
//             <button class="bg-gray-200 py-1 px-2 lg:py-2 lg:px-4 rounded-xl text-gray-500 hover:bg-black hover:text-white duration-150">M</button>
//             <button class="bg-gray-200 py-1 px-2 lg:py-2 lg:px-4 rounded-xl text-gray-500 hover:bg-black hover:text-white duration-150">L</button>
//             <button class="bg-gray-200 py-1 px-2 lg:py-2 lg:px-4 rounded-xl text-gray-500 hover:bg-black hover:text-white duration-150">XL</button>
//         </div>
//     </div>

//     <div class="flex gap-4 mt-4 items-center lg:justify-start justify-center ">
//         <input type="number" class="border p-2 w-[20%] text-center lg:w-16 rounded" min="1" max="10" value="1">
//         <button class="bg-black text-white rounded-2xl px-8 py-2 lg:px-6 lg:py-2">Add to Cart</button>
//     </div>
// </div>
// </div>`