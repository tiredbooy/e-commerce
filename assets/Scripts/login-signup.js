const apiLink =
  "https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users.json";

const newUserNumber = document.getElementById("phone-num");
const newUserNameInput = document.getElementById("new-username");
const newUserPassword = document.getElementById("new-password");
const selectTag = document.getElementById("adminstator");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const checkNumberBtn = document.getElementById("check-number");
const loginStep = document.getElementById("login-step");
const signupStep = document.getElementById("signup-step");
const numberStep = document.getElementById("number-step");
let currentUser = null;
let currentUserID = null;

signupBtn.addEventListener("click", () => {
  const adminstatorResult =
    selectTag.value == "admin"
      ? true
      : selectTag.value == "customer"
      ? false
      : null;
  let newUserNumberValue = newUserNumber.value.trim().toLowerCase();
  let newUserNameInputValue = newUserNameInput.value.trim().toLowerCase();
  let newUserPasswordValue = newUserPassword.value.trim().toLowerCase();

  createNewUser(
    newUserNameInputValue,
    newUserNumberValue,
    newUserPasswordValue,
    adminstatorResult
  );
  loginStep.classList.remove("hidden");
  numberStep.classList.add("hidden");
  signupStep.classList.add("hidden");
});

loginBtn.addEventListener("click", () => {
  const usernameinputValue = document
    .getElementById("username")
    .value.trim()
    .toLowerCase();
  const passwordinputValue = document
    .getElementById("password")
    .value.trim()
    .toLowerCase();

  if (
    currentUser.username.trim().toLowerCase() == usernameinputValue &&
    currentUser.password.trim() == passwordinputValue
  ) {
    editUserIsLogin(currentUser);
    localStorage.setItem('userID',currentUserID);
    location.href = '/Pages/profilepage.html';
    
  } else {
    console.log("Invalid username or password.");
  }
});

checkNumberBtn.addEventListener("click", () => {
  const numberStepInputValue = document.getElementById("user-number").value;
  getUserFromDatabase(parseFloat(numberStepInputValue));
});

async function editUserIsLogin(currUser) {
  try {
    let updatedUrl = `https://e-commerce-cf278-default-rtdb.asia-southeast1.firebasedatabase.app/users/${currentUserID}.json`;

    let updateResponse = await fetch(updatedUrl, {
      method: "PATCH", // Use PATCH for partial updates
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLogin: true }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(
        `HTTP error! status: ${updateResponse.status}, details: ${errorText}`
      );
    }
    console.log("User isLogin status updated successfully.");
  } catch (err) {
    console.log("error : ", err);
  }
}


function clearInputs() {
  newUserNumber.value = "";
  newUserNameInput.value = "";
  newUserPassword.value = "";
}

async function createNewUser(username, phoneNumber, password, adminstator) {
  const userObj = {
    username: username,
    phoneNumber: phoneNumber,
    password: password,
    adminstator: adminstator, // Note: corrected typo from 'adimnstator' to 'adminstator'
    isLogin: false,
    profileimage,
  };

  await fetch(apiLink, {
    method: "POST", // Changed here: added quotes around POST
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObj),
  }).then((res) => {
    if (res.status === 200) {
      clearInputs();
      console.log("user creted successfully!");
    } else {
      console.log("failed to create User");
    }
  });
}



async function getUserFromDatabase(number) {
  try {
    const response = await fetch(apiLink);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if data exists
    if (!data) {
      console.log("No users in the database.");
      redirectToSignUp(); // If no data, redirect to sign-up
      return;
    }

    console.log("Fetched data:", data);

    // Convert the data into an array of entries
    const users = Object.entries(data);

    // Search for the user with the given phone number
    const findUser = users.find((user) => user[1]?.phoneNumber == number); // Add optional chaining to avoid undefined issues

    console.log("Matched user:", findUser);

    if (findUser) {
      [currentUserID, currentUser] = findUser;
      // currentUser = findUser[1];
      // currentUserID = finduser[0]
      console.log("Phone number validated. Proceed to login.");
      displayLoginForm();
    } else {
      console.log("Phone number not found. Redirecting to sign-up.");
      redirectToSignUp();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayLoginForm() {
  loginStep.classList.remove("hidden");
  numberStep.classList.add("hidden");
}

function redirectToSignUp() {
  signupStep.classList.remove("hidden");
  numberStep.classList.add("hidden");
}
