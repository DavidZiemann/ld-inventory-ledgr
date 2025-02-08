// js/laptops.js

// Example data
const laptopData = [
  {
    id: 1,
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    assignedTo: "Alice Johnson",
    datePurchased: "2024-01-15",
  },
  {
    id: 2,
    name: "MacBook Air M2",
    brand: "Apple",
    assignedTo: "Bob Smith",
    datePurchased: "2025-02-01",
  },
  {
    id: 3,
    name: "Latitude 5510",
    brand: "Dell",
    assignedTo: "Charlie Brown",
    datePurchased: "2023-09-20",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#laptopTable tbody");
  const searchForm = document.querySelector("#searchForm");
  const searchInput = document.querySelector("#searchInput");

  // Render all laptops initially
  renderTable(laptopData);

  // Filter logic on form submit
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filtered = laptopData.filter((laptop) =>
      laptop.name.toLowerCase().includes(searchTerm)
    );
    renderTable(filtered);
  });

  // Function to render rows in the table
  function renderTable(data) {
    tableBody.innerHTML = ""; // clear existing rows

    data.forEach((laptop) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${laptop.name}</td>
          <td>${laptop.brand}</td>
          <td>${laptop.assignedTo}</td>
          <td>${laptop.datePurchased}</td>
          <td>
            <!-- Example actions: For now, just show placeholders -->
            <a href="laptop-details.html?id=${laptop.id}">View</a> |
            <a href="laptop-details.html?id=${laptop.id}&mode=edit">Edit</a>
          </td>
        `;

      tableBody.appendChild(row);
    });
  }
});
