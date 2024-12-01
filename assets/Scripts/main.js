const $ = document;

document.addEventListener("DOMContentLoaded", () => {
  const shopBtn = $.getElementById("shop-btn");
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

  shopBtn.addEventListener("click", () => {
    openModal();
  });

  hamburgerMenu.addEventListener("click", () => {
    openModal();
  });

  function openModal() {
    shopModal.classList.toggle("hidden");
    setTimeout(() => {
      shopModal.classList.toggle("activeModal"); // Add activeModal class after a short delay
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

});
