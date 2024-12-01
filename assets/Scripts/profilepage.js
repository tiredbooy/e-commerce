const apiLink =
  "https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users.json";
const menuItemContainer = document.getElementById("menuItemContainer");

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

//// Handle Icon For Making Page Smooth

document.addEventListener("DOMContentLoaded", iconAnimation());

let userRole = null;

async function fetchUserInfo() {
  let userID = localStorage.getItem("userID");
  let response = await fetch(apiLink);
  let data = await response.json();
  let users = Object.entries(data);

  let findMatchingUser = users.find((user) => user[0] == userID);

  // let userRole = fetchUserInfo[1].adminstator == true ? 'admin' : 'customer';

  if (response.status != 200) {
    alert("لطفا برای لود شدن دیتا ها از دیتابیس از vpn استفاده کنید !");
  }

  console.log("admin :", findMatchingUser[1].adminstator);

  if (findMatchingUser[1].adminstator == true) {
    userRole = "admin";
  } else {
    userRole = "customer";
  }

  let adminstatorResult = userRole === "admin" ? adminMenu : customerMenu;

  adminstatorResult.forEach((item) => {
    let html = `<li class="flex flex-row items-center justify-between text-gray-300 hover:text-white duration-150 cursor-pointer border-b pb-4">
    <a href="">${item}</a>
    <i class="icon fas fa-angle-right "></i>
    </li>`;

    menuItemContainer.insertAdjacentHTML("beforeend", html);
    iconAnimation()
  });
}

fetchUserInfo();

function iconAnimation(){
    let angleIcon = document.querySelectorAll(".icon");

    angleIcon.forEach((icon) => {
        icon.addEventListener("click", function () {
          const icon = this;
          // Toggle between rotate-right and rotate-left classes
          if (icon.classList.contains("rotate-right")) {
            icon.classList.remove("rotate-right");
            icon.classList.add("rotate-left");
          } else {
            icon.classList.remove("rotate-left");
            icon.classList.add("rotate-right");
          }
        });
      });
}


const ctx = document.getElementById('myChart').getContext('2d');  

const myChart = new Chart(ctx, {  
    type: 'line',  
    data: {  
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],  
        datasets: [{  
            label: 'My First Dataset',  
            data: [65, 59, 80, 81, 56, 55, 40],  
            fill: false,  
            borderColor: 'rgb(75, 192, 192)',  
            tension: 0.1,  
            pointRadius: 5, // Custom point size  
            pointBackgroundColor: 'rgb(75, 192, 192)', // Point fill color  
            pointBorderColor: 'white', // Point border color  
            pointHoverRadius: 7, // Point size on hover  
            pointHoverBackgroundColor: 'rgb(255, 99, 132)', // Background color on hover  
            pointHoverBorderColor: 'black', // Border color on hover  
            pointStyle: 'circle', // Point shape ('circle', 'rect', 'triangle', etc.)  
        }]  
    },  
    options: {  
        responsive: true,  
        plugins: {  
            legend: {  
                display: true,  
                position: 'top',  
            },  
            tooltip: {  
                callbacks: {  
                    label: function(tooltipItem) {  
                        return tooltipItem.dataset.label + ': ' + tooltipItem.raw;  
                    }  
                }  
            }  
        },  
        scales: {  
            x: {  
                title: {  
                    display: true,  
                    text: 'Months'  
                }  
            },  
            y: {  
                title: {  
                    display: true,  
                    text: 'Values'  
                }  
            }  
        }  
    }  
});  


const imageUpload = document.getElementById("imageUpload");
    const productImages = document.getElementById("productImages");
    const imagePreview = document.getElementById("imagePreview");

    imageUpload.addEventListener("click", () => productImages.click());

    productImages.addEventListener("change", () => {
      imagePreview.innerHTML = ""; // Clear previous previews
      Array.from(productImages.files).forEach(file => {
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