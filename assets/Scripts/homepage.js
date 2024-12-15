const productsArray = JSON.parse(localStorage.getItem('products')) || [];
const newArrivalContainer = document.getElementById('newArrivalContainer');
const topSellingContainer = document.getElementById('topSellingContainer');

function loadNewArrival() {
    let products = Object.entries(productsArray);
    if (productsArray) {
        let sorted = products.sort(([a, b], [d, c]) => {
            // Compare dates (most recent first)
            return new Date(c.dateAdded) - new Date(b.dateAdded);
        });
        let slicedSortedArray = sorted.slice(0,4);

        slicedSortedArray.forEach(product => {
            console.log(product[1]);
            let productImg = product[1].productImages[0].url || "placeholder.jpg";
            let {productName,productDescription,productPrice} = product[1]

            let productCards = createDomProducts(productImg
                ,productName
                ,productDescription
                ,productPrice)

            newArrivalContainer.insertAdjacentHTML('beforeend',productCards)
        })
        
        
    }
}

loadNewArrival();

function loadTopSelling() {
    let products = Object.entries(productsArray);

    if (productsArray) {
        let sorted = products.sort(([a, b], [d, c]) => {
            // Compare product sales (most sold first)
            return c.sales - b.sales;
        });
        let slicedSortedArray = sorted.slice(0,4);

        slicedSortedArray.forEach(product => {
            console.log(product[1]);
            let productImg = product[1].productImages[0].url || "placeholder.jpg";
            let {productName,productDescription,productPrice} = product[1]

            let productCards = createDomProducts(productImg
                ,productName
                ,productDescription
                ,productPrice)

                topSellingContainer.insertAdjacentHTML('beforeend',productCards)
        })
    }
}

loadTopSelling()

function createDomProducts (productImg
    ,productTitle
    ,productDes
    ,productPrice) {
    // const productCard =
   return `
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

//    productCard;
}