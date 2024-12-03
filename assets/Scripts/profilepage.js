const apiLink =
  "https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users.json";
const menuItemContainer = document.getElementById("menuItemContainer");
const profileImageInput = document.getElementById('profileImageInput');
const profileImageUploader = document.getElementById('profileImageUpload');

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

const ctx = document.getElementById("myChart").getContext("2d");

const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        pointRadius: 5, // Custom point size
        pointBackgroundColor: "rgb(75, 192, 192)", // Point fill color
        pointBorderColor: "white", // Point border color
        pointHoverRadius: 7, // Point size on hover
        pointHoverBackgroundColor: "rgb(255, 99, 132)", // Background color on hover
        pointHoverBorderColor: "black", // Border color on hover
        pointStyle: "circle", // Point shape ('circle', 'rect', 'triangle', etc.)
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
          text: "Values",
        },
      },
    },
  },
});

//// Handle Icon For Making Page Smooth

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector('#submitImageUpload');
  let updateUserNameInput = document.getElementById('updateUserNameInput');
  let updateUserPhoneNumInput = document.getElementById('updateUserPhoneNumInput');
  let updateUserPasswordInput = document.getElementById('updateUserPasswordInput');


  iconAnimation()

  profileImageUploader.addEventListener('click', () => profileImageInput.click());

  let uploadedImageUrl = null;
  // Handle file selection and preview
  profileImageInput.addEventListener('change', () => {
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
  button.addEventListener('click', (e) => {
    e.preventDefault();

    let updateUserNameInputValue =  updateUserNameInput.value.trim().toLowerCase();
    let updateUserPhoneNumInputValue = updateUserPhoneNumInput.value.trim();
    let updateUserPasswordInputValue = updateUserPasswordInput.value.trim().toLowerCase();

    if(uploadedImageUrl && updateUserNameInputValue && updateUserPhoneNumInputValue && updateUserPasswordInputValue){
      if(updateUserPhoneNumInputValue.length == 10 ){

        updateUser(uploadedImageUrl,updateUserNameInputValue,parseFloat(updateUserPhoneNumInputValue),updateUserPasswordInputValue)

      }else{
        alert('Please Enter your number Currect!')
      }
  
    }else{
      alert('Please Fill The Inputs')
    }

    
  });
});


async function updateUser(imageUrl,userName,phoneNum,password){
  let userId = localStorage.getItem('userID');

  const userObj = {
    profileimage : imageUrl,
    username : userName,
    phoneNumber : phoneNum,
    password ,
  }

  await fetch(`https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}.json`,{
    method : 'PATCH',
    headers: {
      "Content-Type": 'application/json'
    },
    body : JSON.stringify(userObj)
  })
  .then(res => {
    if(res.ok){
      console.log(res);
      loadUserNameAndImage(userName,imageUrl)
    }
  })
}


function loadUserNameAndImage(userName,imageUrl){
  
  let profileImageElement = document.getElementById('profileImage')
  document.getElementById('profilePage-username').innerHTML = userName;

  if(imageUrl){
    profileImageElement.src = imageUrl
  }
  else{
    profileImageElement.src = 'https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.webp'
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
  let userRole = findMatchingUser[1].adminstator === true ? "admin" : "customer";  
  let adminstatorResult = userRole === "admin" ? adminMenu : customerMenu;  

  loadUserNameAndImage(findMatchingUser[1].username,findMatchingUser[1].profileimage)

  const sections = document.querySelectorAll('#admin , #customer')
  sections.forEach(section => {
    section.classList.add('hidden')
  })

  if(userRole === 'admin'){
    document.getElementById('admin').classList.remove('hidden')
  }else{
    document.getElementById('customer').classList.remove('hidden')
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
  

  let menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(item => {
    item.addEventListener('click',() => {
      let icon = item.querySelector(".icon");
          // Toggle between rotate-right and rotate-left classes
          if (icon.classList.contains("rotate-right")) {
            icon.classList.remove("rotate-right");
            icon.classList.add("rotate-left");
          } else {
            icon.classList.remove("rotate-left");
            icon.classList.add("rotate-right");
          }

    })
  })

  
}

const imageUpload = document.getElementById("imageUpload");
const productImages = document.getElementById("productImages");
const imagePreview = document.getElementById("imagePreview");

imageUpload.addEventListener("click", () => productImages.click());

productImages.addEventListener("change", () => {
  imagePreview.innerHTML = ""; // Clear previous previews
  Array.from(productImages.files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "w-20 h-20 object-cover rounded-lg border";
      imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

function adminPanelHandler() {  
  // Select all menu items  
  let menuItems = document.querySelectorAll('.admin-menu, .customer-menu');  

  menuItems.forEach(item => {  
    item.addEventListener('click', (e) => {  
      // Prevent default link behavior  
      e.preventDefault();  

      // Get all sections  
      const sections = document.querySelectorAll('#dashboard-page, #manage-product, #orders-page,#my-profile-page,#my-order-page,#saved-address,#notification-page, #profile-setting-page',);  
      
      // Hide all sections  
      sections.forEach(section => {  
        section.classList.add('hidden');  
      });  

      // Switch based on the text content of the clicked item  
      switch (e.target.textContent) {  
        case 'Dashboard':  
          document.getElementById('dashboard-page').classList.remove('hidden');  
          break;  
        case 'Manage Products':  
          document.getElementById('manage-product').classList.remove('hidden');  
          break;  
        case 'Orders':  
          document.getElementById('orders-page').classList.remove('hidden');  
          break;  
        case 'Settings':  
          document.getElementById('profile-setting-page').classList.remove('hidden');  
          break;  
        case 'Logout':  
          alert('Logged Out Now (siktir)');  
          break;  
        case "My Profile" :
          document.getElementById('my-profile-page').classList.remove('hidden')
          break;
        case "My Orders" :
          document.getElementById('my-order-page').classList.remove('hidden')
          break;
        case "Saved Addresses" :
          document.getElementById('saved-address').classList.remove('hidden')
          break;
        case "Notifications" :
          document.getElementById('notification-page').classList.remove('hidden')
          break;  
      }  
    });  
  });  
}  

