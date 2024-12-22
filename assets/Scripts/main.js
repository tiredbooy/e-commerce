const $ = document;

document.addEventListener("DOMContentLoaded", () => {
  const shopBtn = $.querySelector('#shopBtn')
  const shopBtnSpan = $.querySelector("#shop-btn span");
  const shopModal = $.getElementById("shop-modal");
  const hamburgerMenu = $.getElementById("hamburger-menu");
  const bodyTag = $.querySelector("body");
  const modalItems = $.querySelectorAll("#shop-modal li");
  const shopBtnIcon = $.querySelector('#shop-btn i');
  const profileIcon = $.getElementById('profile-icon')
  const shoppingBasketIcon = $.getElementById('shopping-basket-icon');
  const shoppingBasketLength = $.getElementById('shopping-basket-length');
  const productSearchModal = $.getElementById('product-search-modal')
  const searchProductInput = $.getElementById('searchProductInput')
  const productSearchContainer = $.getElementById('productSearchContainer')
  
  loadProductCountInBasket()

  let signUpNowBtn = document.getElementById('sign-upNow');


  signUpNowBtn.addEventListener('click',() => {
    signUpNowBtn.href = "/Pages/login-signup.html"
  })

  function openProductSearchModal(){
    productSearchModal.classList.remove("hidden");
    setTimeout(() => {
      productSearchModal.classList.add("activeModal"); // Add activeModal class after a short delay
    }, 30);
  }

  searchProductInput.addEventListener('keyup',(event) => {
    productSearchContainer.innerHTML = ''
    let searchValue = searchProductInput.value.trim().toLowerCase();
    let productsArray = JSON.parse(localStorage.getItem('products'));

    if(searchValue){
      openProductSearchModal()

      if(productsArray){
        handlePorudctModalByLocalStorage(searchValue)
      }else{
        handleProductSearchByFetch(searchValue)
      }
      
    }
    else{
      productSearchContainer.innerHTML = ''
      closeProductSearchModal()
    }

  })

  function handlePorudctModalByLocalStorage(searchValue){
    let productsArray = JSON.parse(localStorage.getItem('products'));
    let data = Object.entries(productsArray)

    let filteredWords = data.filter(([name,info]) => {
      return info.productName.toLowerCase().includes(searchValue)
    })

    if(filteredWords.length > 1){
      handleProductSearch(filteredWords)
    } else{
      closeProductSearchModal()
    }
  }

  function handleProductSearchByFetch(searchValue){
    fetch(`https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/products.json`)
      .then(res => res.json())
        .then(data => {
          let dataArray = Object.entries(data);
          let filteredWords = dataArray.filter(([name,info]) => {
            return info.productName.toLowerCase().includes(searchValue)
          })
          handleProductSearch(filteredWords[1])
        })
  }

  function closeProductSearchModal() {
    if (productSearchModal.classList.contains("activeModal")) {
      productSearchModal.classList.remove("activeModal");
      
        productSearchModal.classList.add("hidden");
      
    }
  }


  function handleProductSearch(words){
 
    let exportedProducts = words.map(product => {
      return product
    })
    
    exportedProducts.forEach(item => {
      let product = item[1];
      let {productImages,productName,productDescription,productPrice} = product;

      let productImagesResult = productImages[0].url

      let productsResultDom = `
      <li class="w-full pt-5 px-5 flex justify-between items-center gap-3 max-h-[100px] border-b pb-6">
        <div class="w-full flex gap-3">
          <div class="w-20 h-20 overflow-hidden flex items-center justify-center rounded">
            <img class="w-full h-full object-cover rounded" src="${productImagesResult}" alt="${productName}">
          </div>
          <div class="flex flex-col gap-1">
            <span onclick="openProductPage(event,'${productName}')" class="font-bold"><a href="javascript:void(0)">${productName}</a></span>
            <span class="text-gray-400 text-sm">${productDescription}</span>
          </div>
        </div>
        <span class="font-semibold">$${productPrice}</span>
      </li>
    `;

    productSearchContainer.insertAdjacentHTML('beforeend', productsResultDom);
    
    })

  }
  
//// END OF PRODUCT SEARCH MODAL ////


  shopBtnSpan.addEventListener('click',() => {
    window.location.href = `/Pages/category.html`;
  })

  shopBtnIcon.addEventListener("click", () => {
    if(!shopModal.classList.contains('activeModal')){
      openModal();    
    }else{
      closeModal() 
    }
  });

  hamburgerMenu.addEventListener("click", () => {
    openModal();
  });

  function openModal() {
    shopModal.classList.toggle("hidden");
    setTimeout(() => {
      shopModal.classList.toggle("activeModal"); // Add activeModal class after a short delay
      shopBtnIcon.classList.add('rotate-up');  
      shopBtnIcon.classList.remove('rotate-down'); // Ensure rotate-down is removed  
    }, 30);
  }

  bodyTag.addEventListener("click", (e) => {
    // Check if modal is active and the click is outside the modal
    if (
      shopModal.classList.contains("activeModal") &&
      !shopModal.contains(e.target) &&
      e.target !== shopBtn &&
      e.target !== hamburgerMenu
    ) {
      closeModal();
    }
  });



  function closeModal() {
    shopModal.classList.add("hidden"); // Hide modal
    shopModal.classList.remove("activeModal"); // Remove active class
    shopBtnIcon.classList.add('rotate-down');  
    shopBtnIcon.classList.remove('rotate-up')

  }

  // Add click listeners to modal items
function handleModalItems() {
    const modalItems = document.querySelectorAll("#shop-modal li"); // Assuming these are the modal items
    modalItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault()
            const category = item.textContent.trim().toLowerCase(); // Get the clicked item's text
            window.location.href = `/Pages/category.html?category=${category}`; // Navigate to category.html with query parameter
        });
    });
}
handleModalItems();
// 

profileIcon.addEventListener('click',() => {
  let userID = localStorage.getItem('userID');

  if(userID){
    location.href = '/Pages/profilepage.html'
  }else{
    location.href = '/Pages/login-signup.html'
  }
})

shoppingBasketIcon.addEventListener('click',() => {
  location.href ='/Pages/cart.html'
})

function loadProductCountInBasket() {
  shoppingBasketLength.style.display = 'none';
  let productInShoppingBasket = JSON.parse(localStorage.getItem('shoppingBasket'));
  if(productInShoppingBasket){
    shoppingBasketLength.style.display = 'block';
    shoppingBasketLength.innerHTML = productInShoppingBasket.length;
  }
}
loadProductCountInBasket()

});

