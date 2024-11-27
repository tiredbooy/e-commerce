function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll("#product-info, #reviews, #faqs");
  sections.forEach((section) => section.classList.add("hidden"));

  // Remove active tab classes
  const tabs = document.querySelectorAll('[id^="tab-"]');
  tabs.forEach((tab) =>
    tab.classList.remove("border-gray-800", "text-gray-800")
  );

  // Show the selected section
  document.getElementById(sectionId).classList.remove("hidden");

  // Highlight the active tab
  document
    .getElementById(`tab-${sectionId}`)
    .classList.add('border-b-2',"border-gray-800", "text-gray-800");
}

// Show Product Info by default
showSection("product-info");
