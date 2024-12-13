document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector("title");
  
  
  // Get the query string from the URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("product");

  // Capitalize the first letter of the product
  const formattedProduct = product.charAt(0).toUpperCase() + product.slice(1);

  // Update the document title
  title.textContent = formattedProduct;

  // let productID = formattedProduct.replace(" ","_")
  let productID = formattedProduct.replace(/\s+/g, "_");
  console.log(productID);
  
  loadProductDetails()

  async function loadProductDetails(){
    const localSavedProducts = JSON.parse(localStorage.getItem('products'));
    let productHTML;

    if(localSavedProducts){
      // let filteredProductFromLocal = localSavedProducts
      let data = Object.entries(localSavedProducts);
      let filteredProductFromLocal = data.find(([name, info]) => name === productID);
      console.log(filteredProductFromLocal[1]);
      
      let { productImages, productName, productPrice, productDescription, colors, sizes } = filteredProductFromLocal[1];

      let imageArr = [];
      productImages.map(image => {
        let img = image.url
        imageArr.push(img);
      })

      productHTML = createProduct(
        imageArr.length > 3 ? imageArr.slice(0,4) : imageArr.slice(0,3),
        productName, 
        productPrice, 
        productDescription, 
        colors, 
        sizes
      );
      
    }
    else{
      // Fetch product data from the Firebase database
      await fetch(`https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/products/${productID}.json`)
      .then(res => {
        if(res.status === 200){
          return res.json();
        }else{
          throw new Error(`Error fetching product data: ${res.statusText}`);
        }
      })
      .then(data => {
        // Pass the fetched data to the createProduct function
        let { productImages, productName, productPrice, productDescription, colors, sizes } = data;

        let imageArr = [];
        productImages.map(image => {
          let img = image.url
          imageArr.push(img);
        })

        productHTML = createProduct(
          imageArr.length > 3 ? imageArr.slice(0,4) : imageArr.slice(0,3),
          productName, 
          productPrice, 
          productDescription, 
          colors, 
          sizes
        );

      })
      .catch(error => {
        console.error(error);
      });

    }

    
        // Insert the generated HTML into a container in the DOM
        const productCardContainer = document.getElementById("product-info-sec");
        if (productCardContainer) {
          productCardContainer.innerHTML = productHTML;
        }
  }


  
  
});

function createProduct(imageArray, productTitle, productPrice, productDes, productColors, productSizes) {
  // Generate the HTML for colors dynamically
  
  const colorsHTML = productColors ? Object.keys(productColors)
  .map(
    (color) =>
      `<div class="w-9 h-9 rounded-full cursor-pointer ${productColors[color]}"></div>`
  )
  .join("") : null;

  // Generate the HTML for sizes dynamically
  const sizesHTML = productSizes ?  productSizes
    .map(
      (size) =>
        `<button onclick=handleSizeButton(event) class="bg-gray-200 py-1 px-2 lg:py-2 lg:px-4 rounded-xl text-gray-500 hover:bg-black hover:text-white duration-150">${size}</button>`
    )
    .join("") : null;

  // Final product details DOM
  const productDetailDom = `
    <div class="flex flex-col items-start md:flex-row lg:flex-row gap-5 flex-wrap">
      <!-- Thumbnail Images -->
      <div class="flex flex-row md:flex-col lg:flex-col gap-5">
      ${imageArray  
        .slice(1, 4) // This slices the array to include only indexes 1, 2, and 3  
        .map(  
          (image) =>  
            `<img src="${image}" onclick="changeMainImage(event)" alt="" class="max-h-40 object-cover rounded-xl border hover:border-black cursor-pointer duration-300 sideImages">`  
        )  
        .join("")}
      </div>

      <!-- Main Image -->
      <div class="sm:w-full md:w-[30%] lg:w-[30%] mainProductImageContainer rounded-xl">
        <img src="${imageArray[0]}" alt="" class="max-h-full h-[520px] w-full object-cover rounded-xl hover:scale-125 mainProductImage">
      </div>

      <!-- Product Details -->
      <div class="w-full lg:w-[48%] flex flex-col gap-2">
        <h2 class="text-3xl lg:text-4xl font-bold">${productTitle}</h2>

        <div class="flex items-center mt-2">
          <div class="flex text-yellow-400 gap-2">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
          </div>
          <span class="ml-2 text-gray-600">4.5/5</span>
        </div>

        <div class="mt-4">
          <span class="text-2xl font-bold text-black">$${productPrice}</span>
          <span class="line-through text-gray-500 hidden">$300</span>
          <span class="text-red-500 hidden">-40%</span>
        </div>

        <p class="mt-4 text-gray-700 border-b pb-5">
          ${productDes}
        </p>

        <div class="mt-4 border-b pb-5">
          <span class="block text-gray-500 font-bold">Select Colors</span>
          <div class="flex gap-2 mt-2">
            ${colorsHTML} <!-- Injected dynamic colors -->
          </div>
        </div>

        <div class="mt-4 border-b pb-5">
          <span class="block text-gray-500 font-bold">Choose Size</span>
          <div class="flex gap-4 mt-2">
            ${sizesHTML} <!-- Injected dynamic sizes -->
          </div>
        </div>

        <div class="flex gap-4 mt-4 items-center lg:justify-start justify-center ">
          <input type="number" class="border p-2 w-[20%] text-center lg:w-16 rounded-xl outline-none" min="1" max="10" value="1">
          <button class="bg-black text-white rounded-2xl px-8 py-2 lg:px-6 lg:py-2">Add to Cart</button>
        </div>
      </div>
    </div>`;

    

  return productDetailDom;
}


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
    .classList.add("border-b-2", "border-gray-800", "text-gray-800");
}


showSection("product-info");

function changeMainImage(event){
  // console.log(event.target.src);
  let mainProductImage = document.querySelector('.mainProductImage');
  let mainProductImageSrc = mainProductImage.src;
  
  mainProductImage.src = event.target.src;
  event.target.src= mainProductImageSrc;
}

function handleSizeButton(event){
  console.log(event.target.innerText);
  let clickedBtn = event.target;
  
  // event.target.classList.toggle([' , bg-black'])

  if (clickedBtn.classList.contains('bg-gray-200')) {
    
    clickedBtn.classList.replace('text-gray-500','text-white')
    clickedBtn.classList.replace('bg-gray-200', 'bg-black');
  } else {
    clickedBtn.classList.replace('bg-black', 'bg-gray-200');
    clickedBtn.classList.replace('text-white','text-gray-500')
  }
  
  
}

