document.addEventListener("DOMContentLoaded", () => {
  const apiLink =
    "https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users.json";
  const menuItemContainer = document.getElementById("menuItemContainer");
  const profileImageInput = document.getElementById("profileImageInput");
  const profileImageUploader = document.getElementById("profileImageUpload");
  const loading = document.getElementById("loading");

  const openMenuBtn = document.getElementById("openMenuBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const leftContainer = document.querySelector(".left");
  const rightContainer = document.querySelector(".right");
  openMenuBtn.addEventListener("click", () => {
    leftContainer.classList.remove("hidden");
    rightContainer.classList.add("hidden");
  });

  closeMenuBtn.addEventListener("click", () => {
    leftContainer.classList.add("hidden");
    rightContainer.classList.remove("hidden");
  });

  const adminMenu = [
    "Dashboard",
    "Manage Products",
    "Orders",
    "Settings",
    "Logout",
  ];

  const customerMenu = [
    "My Profile",
    "My Orders",
    "Saved Addresses",
    "Notifications",
    "Logout",
  ];

  // Chart For Admin Dashboard
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Monthly Sales",
          data: Array(12).fill(0), // Initialize with 0
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          pointRadius: 5,
          pointBackgroundColor: "rgb(75, 192, 192)",
          pointBorderColor: "white",
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "rgb(255, 99, 132)",
          pointHoverBorderColor: "black",
          pointStyle: "circle",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.dataset.label + ": " + tooltipItem.raw;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Months",
          },
        },
        y: {
          title: {
            display: true,
            text: "Sales",
          },
        },
      },
    },
  });

  // End OF the Chart for admin dashboard

  let userId = localStorage.getItem("userID");

  const productImages = document.getElementById("productImages");
  const imagePreview = document.getElementById("imagePreview");
  const submitImageUpload = document.querySelector("#submitImageUpload");
  let updateUserNameInput = document.getElementById("updateUserNameInput");
  let updateUserPhoneNumInput = document.getElementById(
    "updateUserPhoneNumInput"
  );
  let updateUserPasswordInput = document.getElementById(
    "updateUserPasswordInput"
  );

  const addNewAddressBtn = document.getElementById("addNewAddressBtn");
  const selectAddressCategory = document.getElementById(
    "selectAddressCategory"
  );
  const newAddressForm = document.getElementById("new-address-form");
  const addressCardsContainer = document.getElementById(
    "addressCardsContainer"
  );
  const receiverNameInput = document.getElementById("receiverNameInput");
  const userCityInput = document.getElementById("userCityInput");
  const userAddressInput = document.getElementById("userAddressInput");
  const userZipcodeInput = document.getElementById("userZipcodeInput");
  const userCountryInput = document.getElementById("userCountryInput");
  const submitAddressBtn = newAddressForm.querySelector("button");

  const manageProductTable = document.getElementById("manage-product-table");
  const manageProductTableTbody = manageProductTable.querySelector("tbody");

  const moveToCreateProductBtn = document.getElementById(
    "moveToCreateProductBtn"
  );
  const newProductContainer = document.getElementById("new-product-container");
  const newProductNameInput = document.getElementById("productName");
  const newProductDes = document.getElementById("productDescription");
  const newProductPrice = document.getElementById("productPrice");
  const newProductCategory = document.getElementById("productCategory");
  const newProductStock = document.getElementById("productStock");
  const imageUpload = document.getElementById("imageUpload");
  const publishNewProductBtn = document.getElementById("publishNewProductBtn");

  moveToCreateProductBtn.addEventListener("click", () => {
    newProductContainer.classList.remove("hidden");
    moveToCreateProductBtn.classList.add("hidden");
    manageProductTable.classList.add("hidden");
  });

  let productsSalesSummery = [];
  let totalRevenue = 0;
  let productInStock = [];

  function loadProductInTable() {
    manageProductTableTbody.innerHTML = "";

    fetch(
      "https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/products.json"
    )
      .then((response) => response.json())
      .then((data) => {
        loading.classList.add("hidden");
        manageProductTableTbody.classList.remove("hidden");
        let dataArray = Object.entries(data);

        for (const product in data) {
          if (data[product].sales > 0) {
            const revenueForProduct =
              data[product].productPrice * data[product].sales;
            totalRevenue += revenueForProduct;
          }
        }
        document.getElementById(
          "totalRevenueSummeryNum"
        ).textContent = `$${totalRevenue}`;

        dataArray.forEach((item) => {
          let productData = item[1];
          const tableInnerHtml = `<tr class="bg-white hover:bg-gray-50">
          <td class="py-3 px-4 border border-gray-300">${productData.productName}</td>
          <td class="py-3 px-4 border border-gray-300">${productData.productStock}</td>
          <td class="py-3 px-4 border border-gray-300">$${productData.productPrice}</td>
          <td class="py-3 px-4 border border-gray-300">${productData.sales}</td>
          </tr>  `;

          manageProductTableTbody.insertAdjacentHTML(
            "beforeend",
            tableInnerHtml
          );
          productsSalesSummery.push(productData.sales);
          productInStock.push(productData.productStock);

          handleSalesSummery(productsSalesSummery);
          handleTotalProductInStock(productInStock);
        });
      });
  }

  loadProductInTable();

  let uploadedImageUrls = []; // Array to store image DataURLs

  // Trigger file input when clicking upload button
  imageUpload.addEventListener("click", () => productImages.click());

  // Handle image file selection
  productImages.addEventListener("change", async () => {
    imagePreview.innerHTML = ""; // Clear previous previews
    uploadedImageUrls = []; // Reset uploaded images array

    const files = Array.from(productImages.files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      // Use a Promise to handle FileReader asynchronously
      const dataURL = await new Promise((resolve) => {
        reader.onload = (e) => {
          // Add image preview
          const img = document.createElement("img");
          img.src = e.target.result;
          img.className = "w-20 h-20 object-cover rounded-lg border";
          imagePreview.appendChild(img);

          resolve(e.target.result); // Return DataURL
        };
        reader.readAsDataURL(file);
      });

      uploadedImageUrls.push({ name: file.name, url: dataURL }); // Store image name and DataURL
    }
  });

  // Handle publish button click
  publishNewProductBtn.addEventListener("click", async () => {
    const productName = newProductNameInput.value.trim().toLowerCase();
    const productDescription = newProductDes.value.trim();
    const productPrice = parseFloat(newProductPrice.value.trim());
    const productCategory = newProductCategory.value.trim();
    const productStock = parseInt(newProductStock.value.trim());
    const size = document.getElementById("productSizes").value.split(",");
    const color = document.getElementById("productColors").value.split(",");

    let date = new Date();
    let formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    if (!productName || !productPrice || !productCategory || !productStock) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare product data object
    const productData = {
      productName,
      productDescription,
      productPrice,
      productCategory,
      productStock,
      productImages: uploadedImageUrls, // Include DataURLs for images
      sales: 0,
      dateAdded: formattedDate,
      size,
      color,
    };

    alert("uploading product please wait!!");

    // ADD THIS CLASS TO SUCCESS DIV
    // product-success

    // Replace spaces with underscores or remove them to make it a valid Firebase key
    const productKey = productName.toLowerCase().replace(/\s+/g, "_");

    try {
      const response = await fetch(
        `https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/products/${productKey}.json`,
        {
          method: "PUT", // Use PUT instead of POST to specify a key
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );
      if (!response.ok) throw new Error("Failed to create product");

      console.log("Product created successfully:", await response.json());
      // alert("Product created successfully!");
      newProductNameInput.value = "";
      newProductDes.value = "";
      newProductPrice.value = "";
      newProductCategory.value = "";
      newProductStock.value = "";

      let successDiv = document.getElementById("product-success-div");
      successDiv.classList.add("product-success");
      setTimeout(() => {
        successDiv.classList.remove("product-success");
        newProductContainer.classList.add("hidden");
        moveToCreateProductBtn.classList.remove("hidden");
        manageProductTable.classList.remove("hidden");

        loadProductInTable();
      }, 2000);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    }
  });

  // End OF the Test
  iconAnimation();

  profileImageUploader.addEventListener("click", () =>
    profileImageInput.click()
  );

  let uploadedImageUrl = null;
  profileImageInput.addEventListener("change", () => {
    const files = Array.from(profileImageInput.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImageUrl = e.target.result;
      };
      reader.readAsDataURL(file); // Start reading the file
    });
  });

  // Handle submit button click
  submitImageUpload.addEventListener("click", (e) => {
    e.preventDefault();

    let updateUserNameInputValue = updateUserNameInput.value
      .trim()
      .toLowerCase();
    let updateUserPhoneNumInputValue = updateUserPhoneNumInput.value.trim();
    let updateUserPasswordInputValue = updateUserPasswordInput.value
      .trim()
      .toLowerCase();

    if (
      uploadedImageUrl &&
      updateUserNameInputValue &&
      updateUserPhoneNumInputValue &&
      updateUserPasswordInputValue
    ) {
      if (updateUserPhoneNumInputValue.length == 10) {
        updateUser(
          uploadedImageUrl,
          updateUserNameInputValue,
          parseFloat(updateUserPhoneNumInputValue),
          updateUserPasswordInputValue
        );
      } else {
        alert("Please Enter your number Currect!");
      }
    } else {
      alert("Please Fill The Inputs");
    }
  });

  addNewAddressBtn.addEventListener("click", () => {
    addressCardsContainer.classList.add("hidden");
    newAddressForm.classList.remove("hidden");
    addNewAddressBtn.classList.add("hidden");
  });

  //Create New Address
  async function createNewAddress(
    addressCategory,
    reciverName,
    userCity,
    userAddress,
    userZip,
    userCountry
  ) {
    // Step 1: Fetch the existing data
    await fetch(
      `https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/userAddresses.json`
    )
      .then((res) => res.json())
      .then((existingAddresses) => {
        // Step 2: Generate a unique addressId
        const addressId = Date.now().toString();

        // Step 3: Merge the new address with existing addresses
        const updatedAddresses = {
          ...existingAddresses, // Spread existing addresses
          [addressCategory]: {
            // Add or update the selected category
            addressId,
            reciverName,
            userCity,
            userAddress,
            userZip,
            userCountry,
          },
        };

        // Step 4: Send the updated object back to Firebase
        return fetch(
          `https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/userAddresses.json`,
          {
            method: "PUT", // Use PUT to overwrite only the userAddresses node
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedAddresses),
          }
        ).then(() => addressId); // Return the addressId
      })
      .then((addressId) => {
        // Pass addressId to createAddressCard
        createAddressCard(
          addressCategory,
          reciverName,
          userCity,
          userAddress,
          userZip,
          userCountry,
          addressId
        );
      })
      .catch((err) => console.error("Error:", err));
  }

  // End of the function

  // Confirm Address Button
  submitAddressBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let selectAddressCategoryValue = selectAddressCategory.value;
    let receiverNameInputValue = receiverNameInput.value.trim().toLowerCase();
    let userCityInputValue = userCityInput.value.trim().toLowerCase();
    let userAddressInputValue = userAddressInput.value.trim().toLowerCase();
    let userZipCodeValue = Number(userZipcodeInput.value);
    let userCountryInputValue = userCountryInput.value.trim().toLowerCase();

    createNewAddress(
      selectAddressCategoryValue,
      receiverNameInputValue,
      userCityInputValue,
      userAddressInputValue,
      userZipCodeValue,
      userCountryInputValue
    );

    addressCardsContainer.classList.remove("hidden");
    newAddressForm.classList.add("hidden");
    addNewAddressBtn.classList.remove("hidden");
  });

  // Create Address Card And display it
  function createAddressCard(
    addressCategory,
    reciverName,
    userCity,
    userAddress,
    userZip,
    userCountry,
    addressId
  ) {
    // Create the card HTML
    let addressCard = `<div class="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex flex-col text-gray-500 gap-3" data-id="${addressId}">
      <h2 class="text-lg font-semibold text-gray-800">${addressCategory.toUpperCase()}</h2>
      <div class="flex flex-col">
        <span>${reciverName}</span>
        <span>${userAddress}</span>
        <span>${userCity} , ${userZip}</span>
        <span>${userCountry.toUpperCase()}</span>
      </div>

      <div class="mt-4 flex items-center space-x-4">
        <button type="button" class="delete-btn text-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
          Delete
        </button>
      </div>
    </div>`;

    // Add the card to the container
    addressCardsContainer.insertAdjacentHTML("beforeend", addressCard);

    // Generate a unique ID for the new address card
  }

  // Load Adress From Database
  function loadAddressCards() {
    fetch(
      `https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/userAddresses.json`
    )
      .then((res) => res.json())
      .then((existingAddresses) => {
        if (existingAddresses) {
          let existingAddressesArray = Object.entries(existingAddresses);
          existingAddressesArray.forEach((existingAddress) => {
            createAddressCard(
              existingAddress[0],
              existingAddress[1].reciverName,
              existingAddress[1].userCity,
              existingAddress[1].userAddress,
              existingAddress[1].userZip,
              existingAddress[1].userCountry,
              existingAddress[1].addressId
            );
          });
        } else {
          return;
        }
      });
  }

  loadAddressCards();

  addressCardsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const cardElement = e.target.closest("[data-id]");
      const addressId = cardElement.getAttribute("data-id");

      // Step 1: Remove from Firebase
      deleteAddressFromDatabase(addressId)
        .then(() => {
          // Step 2: Remove from DOM
          cardElement.remove();
          console.log("Address deleted successfully!");
        })
        .catch((err) => {
          console.error("Failed to delete address:", err);
        });
    }
  });

  async function deleteAddressFromDatabase(addressId) {
    const url = `https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}/userAddresses.json`;

    // Fetch existing data to locate the correct address category
    const existingAddresses = await fetch(url).then((res) => res.json());

    // Find the category containing the addressId
    const addressCategory = Object.keys(existingAddresses).find(
      (category) => existingAddresses[category].addressId === addressId
    );

    if (!addressCategory) {
      throw new Error("Address not found in database.");
    }

    // Remove the address from the category
    delete existingAddresses[addressCategory];

    // Update Firebase
    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(existingAddresses),
    });
  }

  async function updateUser(imageUrl, userName, phoneNum, password) {
    let userId = localStorage.getItem("userID");

    const userObj = {
      profileimage: imageUrl,
      username: userName,
      phoneNumber: phoneNum,
      password,
    };

    await fetch(
      `https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}.json`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
      }
    ).then((res) => {
      if (res.ok) {
        loadUserNameAndImage(userName, imageUrl);
      }
    });
  }

  function loadUserNameAndImage(userName, imageUrl) {
    let profileImageElement = document.getElementById("profileImage");
    document.getElementById("profilePage-username").innerHTML = userName;

    if (imageUrl) {
      profileImageElement.src = imageUrl;
    } else {
      profileImageElement.src =
        "/assets/images/site-assets/useDefault.jpg";
    }
  }

  let userRole = null;

  async function fetchUserInfo() {
    let userID = localStorage.getItem("userID");
    let response = await fetch(apiLink);

    // Check for a successful response
    if (response.status !== 200) {
      alert("لطفا برای لود شدن دیتا ها از دیتابیس از vpn استفاده کنید !");
      return; // Exit the function if the response is not successful
    }

    let data = await response.json();
    let users = Object.entries(data);

    // Find the user that matches the userID
    let findMatchingUser = users.find((user) => user[0] == userID);
    if (!findMatchingUser) {
      console.error("User not found");
      return; // Exit if the user is not found
    }

    // Determine the user role
    let userRole =
      findMatchingUser[1].adminstator === true ? "admin" : "customer";
    let adminstatorResult = userRole === "admin" ? adminMenu : customerMenu;

    loadUserNameAndImage(
      findMatchingUser[1].username,
      findMatchingUser[1].profileimage
    );

    const sections = document.querySelectorAll("#admin , #customer");
    sections.forEach((section) => {
      section.classList.add("hidden");
    });

    if (userRole === "admin") {
      document.getElementById("admin").classList.remove("hidden");
    } else {
      document.getElementById("customer").classList.remove("hidden");
    }

    // Create menu items based on user role
    adminstatorResult.forEach((item) => {
      let html = `<li class="flex flex-row items-center justify-between text-gray-300 hover:text-white duration-150 cursor-pointer menu-item ${userRole}-menu">
        <a href="javascript:void(0);" class="menu-link">${item}</a>
        <i class="icon fas fa-angle-right"></i>
      </li>`;

      menuItemContainer.insertAdjacentHTML("beforeend", html);
      iconAnimation();
    });

    // Call the adminPanelHandler function after the menu is created
    adminPanelHandler();
  }

  fetchUserInfo();

  function iconAnimation() {
    let menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        let icon = item.querySelector(".icon");
        // Toggle between rotate-right and rotate-left classes
        if (icon.classList.contains("rotate-right")) {
          icon.classList.remove("rotate-right");
          icon.classList.add("rotate-left");
        } else {
          icon.classList.remove("rotate-left");
          icon.classList.add("rotate-right");
        }

        if(window.innerWidth  < 768){
          leftContainer.classList.add("hidden");
          rightContainer.classList.remove("hidden");
        }
        
      });
    });
  }

  function adminPanelHandler() {
    // Select all menu items
    let menuItems = document.querySelectorAll(".admin-menu, .customer-menu");

    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        // Prevent default link behavior
        e.preventDefault();

        // Get all sections
        const sections = document.querySelectorAll(
          "#dashboard-page, #manage-product, #orders-page,#my-profile-page,#my-order-page,#saved-address,#notification-page, #profile-setting-page"
        );

        // Hide all sections
        sections.forEach((section) => {
          section.classList.add("hidden");
        });

        // Switch based on the text content of the clicked item
        switch (e.target.textContent) {
          case "Dashboard":
            document
              .getElementById("dashboard-page")
              .classList.remove("hidden");
            break;
          case "Manage Products":
            document
              .getElementById("manage-product")
              .classList.remove("hidden");
            break;
          case "Orders":
            document.getElementById("orders-page").classList.remove("hidden");
            break;
          case "Settings":
            document
              .getElementById("profile-setting-page")
              .classList.remove("hidden");
            break;
          case "Logout":
            alert("Logged Out Now (siktir)");
            break;
          case "My Profile":
            document
              .getElementById("my-profile-page")
              .classList.remove("hidden");
            break;
          case "My Orders":
            document.getElementById("my-order-page").classList.remove("hidden");
            break;
          case "Saved Addresses":
            document.getElementById("saved-address").classList.remove("hidden");
            break;
          case "Notifications":
            document
              .getElementById("notification-page")
              .classList.remove("hidden");
            break;
        }
      });
    });
  }

  async function handleSalesSummery(sales) {
    let totalSales = await sales.reduce((prev, curr) => {
      return prev + curr;
    });

    document.getElementById("totalSalesSummeryNum").textContent = totalSales;
  }

  function handleTotalProductInStock(productINStock) {
    let totalProductINStock = productINStock.reduce((prev, curr) => {
      return prev + curr;
    });

    document.getElementById("productsStockSummeryNum").textContent =
      totalProductINStock;
  }

  
  async function fetchAndProcessSalesData() {
    const orderApiUrl =
    "https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json";

    try {
      // Step 1: Fetch data from the API
      const response = await fetch(orderApiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const orders = await response.json();

      // Step 2: Aggregate sales data by month
      const monthlySales = Array(12).fill(0); // Initialize an array for 12 months

      if(orders){
        Object.values(orders).forEach((order) => {
          const timestamp = order.timestamp;
          const products = order.products;
  
          if (timestamp && products) {
            const orderDate = new Date(timestamp);
            const month = orderDate.getMonth(); // Extract month (0-11)
  
            // Sum product quantities (assuming each product contributes 1 unit of sales)
            let orderTotal = 0;
            Object.values(products).forEach((product) => {
              orderTotal += product.quantity; // Add quantity of each product
            });
  
            // Add order total to the corresponding month
            monthlySales[month] += orderTotal;
          }
        });
      }

      // Step 3: Log or use the data
      // console.log("Monthly Sales:", monthlySales);
      return monthlySales; // Example: [100, 200, 150, 0, ...]
    } catch (error) {
      console.error("Error processing sales data:", error);
      return Array(12).fill(0); // Default empty sales data on error
    }
  }

  // Example usage to update the chart
  fetchAndProcessSalesData().then((monthlySales) => {
    console.log("Monthly Sales:", monthlySales); // Verify the sales data is correct

    // Update the chart data
    myChart.data.datasets[0].data = monthlySales;

    // Trigger a chart update
    myChart.update();
  });


 

  loadOrders();


});

function loadOrders() {
  fetch("https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json")
    .then((res) => res.json())
    .then((data) => {
      if(data) {
        let dataArray = Object.entries(data);

      dataArray.forEach(([key, value]) => {
        let orderDate = new Date(value.timestamp);
        let formattedDate = orderDate.toLocaleDateString("en-US");

        let orderDom = `<div
        class="order-card border-b py-3 flex flex-row justify-between"
      >
        <div class="flex flex-col gap-1">
          <span class="text-gray-600">Order ID:</span>
          <span class="font-bold">#${key}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-gray-600">Date:</span>
          <span class="font-bold">${formattedDate}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-gray-600">Price:</span>
          <span class="font-bold">$${value.orderPrice}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-gray-600">Status:</span>
          <div
            class="flex flex-row gap-1 bg-blue-400 px-2 py-1 rounded-2xl"
          >
            <i class="fas fa-star"></i>
            <span class="text-sm">Pre-order</span>
          </div>
        </div>

        <div class="flex flex-row gap-2">
          <button 
            onclick="cancelOrder(event,'${key}')"
            class="px-3 py-1 rounded-xl border border-red-600 text-red-600 hover:border-transparent hover:bg-red-600 hover:text-white duration-150"
          >
            Cancel order
          </button>
          <button
            class="px-3 py-1 rounded-xl border text-gray-600 bg-gray-200 hover:bg-gray-400 hover:text-white duration-150"
          >
            View details
          </button>
        </div>
      </div>`;

        document
          .getElementById("orders-page")
          .insertAdjacentHTML("beforeend", orderDom);
      });
      }
    });
}

function cancelOrder(event,orderId) {
  fetch(`https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/orders/${orderId}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    if (res.ok) {
      alert("Order canceled successfully");
      loadOrders();
    } else {
      alert("Failed to cancel the order");
    }
  });

}

window.cancelOrder = cancelOrder;

// Format Date
// const isoDate = "2024-12-22T12:34:56Z"; // Your ISO date string
// const dateOnly = isoDate.split('T')[0]; // Get the date part

// console.log(dateOnly);
