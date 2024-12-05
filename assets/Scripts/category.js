document.addEventListener('DOMContentLoaded', () => {
    let title = document.querySelector('title');

    // Get the query string from the URL
    let queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const category = urlParams.get('category');

    if (category) {
        // Capitalize the first letter of the category
        const formattedCategory =
            category.charAt(0).toUpperCase() + category.slice(1);
        // Update the document title
        title.textContent = formattedCategory; // Use textContent for clarity
        document.getElementById('category-title').textContent = formattedCategory;
    }
});


// window.location.href = `/Pages/category.html?category=${category}`;