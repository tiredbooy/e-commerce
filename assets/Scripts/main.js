const $ = document;

document.addEventListener("DOMContentLoaded", () => {
  const shopBtnSpan = $.querySelector("#shop-btn span");
  const shopModal = $.getElementById("shop-modal");
  const hamburgerMenu = $.getElementById("hamburger-menu");
  const bodyTag = $.querySelector("body");
  const casualOutfit = $.getElementById("casual-outfit");
  const gymOutfit = $.getElementById("gym-outfit");
  const partyOutfit = $.getElementById("party-outfit");
  const formalOutfit = $.getElementById("formal-outfit");
  const perfume = $.getElementById("perfume");
  const shoes = $.getElementById("shoes");
  const modalItems = $.querySelectorAll("#shop-modal li");
  const shopBtnIcon = $.querySelector('#shop-btn i');
  const profileIcon = $.getElementById('profile-icon')
  const shoppingBasketIcon = $.getElementById('shopping-basket-icon');
  const shoppingBasketLength = $.getElementById('shopping-basket-length');
  
  loadProductCountInBasket()
  
  
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


