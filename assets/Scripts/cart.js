document.addEventListener('DOMContentLoaded',() => {
    const productsContainer = document.querySelector('.productsContainer')

    function loadProductBasketToCart() {
        // Get the product basket from local storage
        productsContainer.innerHTML = '';
      
        const productBasket =
          JSON.parse(localStorage.getItem("shoppingBasket")) || [];

        const productsArray = localStorage.getItem('products') || [];
      
        // productBasket.forEach((item) => {
            
        //     for(let product in productsArray){
        //         if(productsArray[product].productName === item.productName){
        //             console.log(productsArray[product].productName);
        //         }
        //     }

        // });


       
      
      
        //     const productCardHtml = `/ <div
        //     class="flex flex-row justify-between items-center border-b pb-4"
        //   >
        //     <div class="flex flex-row gap-4 items-center w-2/3">
        //       <img
        //         class="w-24 h-24 rounded-lg object-cover"
        //         src="/assets/images/products-assets/200.webp"
        //         alt="Polo Shirt"
        //       />
        //       <div class="flex flex-col gap-1">
        //         <h6 class="font-semibold text-lg">Polo Shirt</h6>
        //         <span class="text-gray-500 text-sm">Size: Large</span>
        //         <span class="text-gray-500 text-sm">Color: White</span>
        //         <span class="font-bold text-lg">$145</span>
        //       </div>
        //     </div>
      
        //     <div class="flex flex-row gap-4 items-center">
        //       <i
        //         class="fas fa-trash text-red-500 cursor-pointer text-xl"
        //       ></i>
        //       <div class="flex items-center border rounded-lg">
        //         <button class="px-3 py-1 text-gray-600">-</button>
        //         <input
        //           type="text"
        //           min="1"
        //           max="15"
        //           value="1"
        //           class="w-12 text-center outline-none"
        //         />
        //         <button class="px-3 py-1 text-gray-600">+</button>
        //       </div>
        //     </div>
        //     </div> `
      }
      
    //   loadProductBasketToCart();
      
    //   console.log(productBasket);
})


