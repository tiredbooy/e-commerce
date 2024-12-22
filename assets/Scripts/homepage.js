const productsArray = JSON.parse(localStorage.getItem('products')) || [];
const newArrivalContainer = document.getElementById('newArrivalContainer');
const topSellingContainer = document.getElementById('topSellingContainer');
const categoryCards = document.querySelectorAll('.categoryCards');
const commentBoxes = document.querySelectorAll('.comment-box');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');

// Handle Comment SLIDER
let currentIndex = 0;

function updateActiveBox(index) {
  const isMobile = window.innerWidth < 768; // Adjust breakpoint for mobile screens

  commentBoxes.forEach((box, i) => {
    box.classList.remove('activeBox');

    if (isMobile) {
      if (i === index) {
        box.classList.remove('hidden')
        box.classList.add('activeBox');
      } else {
        // Inactive boxes on mobile
        box.classList.add('hidden')
        box.classList.remove('activeBox');
      }
    } else {
      // Desktop positioning
      const offset = i - index;
      box.style.transform = `translateX(${offset * 50}%)`; // Adjust spacing
      if (i === index) box.classList.add('activeBox'); // Add active class
    }
  });
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % commentBoxes.length;
  updateActiveBox(currentIndex);
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + commentBoxes.length) % commentBoxes.length;
  updateActiveBox(currentIndex);
});

window.addEventListener('resize', () => {
  updateActiveBox(currentIndex);
});

updateActiveBox(currentIndex);

setInterval(() => {
  currentIndex = (currentIndex + 1) % commentBoxes.length; // Cycle forward
  updateActiveBox(currentIndex);
}, 8000); 

// END OF THE COMMENT SLIDER

// Handle Category Cards 
categoryCards.forEach(card => {
  card.addEventListener('click', () => {
    let cat = card.getAttribute('data-category');
    window.location.href = `category.html?category=${cat}`;
  })
})

function loadNewArrival() {
    let products = Object.entries(productsArray);
    if (productsArray) {
        let sorted = products.sort(([a, b], [d, c]) => {
            return new Date(c.dateAdded) - new Date(b.dateAdded);
        });
        let slicedSortedArray = sorted.slice(0,4);

        slicedSortedArray.forEach(product => {
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

function openProductPage(event,productTitle) {
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