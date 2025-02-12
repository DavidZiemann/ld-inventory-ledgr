// Import LaunchDarkly client
import { getLDClient } from "./ldClient.js";

const ldClient = getLDClient();

// User context (for LD evaluation)
const user = {
  name: "Jane Doe",
  id: "5efeb736-1995-4e03-8e08-aaa7deb45101",
  email: "jdoe@ledgrdemo.com",
};

// Feature flag key
const FLAG_LAPTOP_LIFE = "release-laptop-life-remaining";

// Lifecycle status thresholds
const EOL_MONTHS = 36; // 3-year lifecycle
const WARNING_THRESHOLD = 3;

// Cached DOM elements
const table = document.querySelector("#laptopTable");
const tableBody = table.querySelector("tbody");
const tableHeadRow = table.querySelector("thead tr");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");

// Laptop inventory data
const laptopData = [
  {
    id: 1,
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    assignedTo: "Alice Johnson",
    datePurchased: "2024-03-15",
  },
  {
    id: 2,
    name: "MacBook Pro 14",
    brand: "Apple",
    assignedTo: "Bob Smith",
    datePurchased: "2022-07-20",
  },
  {
    id: 3,
    name: "Dell Latitude 5490",
    brand: "Dell",
    assignedTo: "Charlie Brown",
    datePurchased: "2020-11-10",
  },
  {
    id: 4,
    name: "HP EliteBook 840",
    brand: "HP",
    assignedTo: "Diana Prince",
    datePurchased: "2023-05-05",
  },
  {
    id: 5,
    name: "MacBook Air M1",
    brand: "Apple",
    assignedTo: "Eve Adams",
    datePurchased: "2023-01-10",
  },
  {
    id: 6,
    name: "ThinkPad T14",
    brand: "Lenovo",
    assignedTo: "Franklin West",
    datePurchased: "2020-04-18",
  },
  {
    id: 7,
    name: "Dell XPS 13",
    brand: "Dell",
    assignedTo: "Grace Hopper",
    datePurchased: "2022-03-01",
  },
  {
    id: 8,
    name: "HP Spectre x360",
    brand: "HP",
    assignedTo: "Hector Garcia",
    datePurchased: "2022-03-21",
  },
  {
    id: 9,
    name: "Asus ZenBook 14",
    brand: "Asus",
    assignedTo: "Ivy Chan",
    datePurchased: "2021-08-15",
  },
  {
    id: 10,
    name: "Surface Laptop 4",
    brand: "Microsoft",
    assignedTo: "Jake Miller",
    datePurchased: "2024-11-02",
  },
  {
    id: 11,
    name: "MacBook Pro 13 (Intel)",
    brand: "Apple",
    assignedTo: "Karen Duke",
    datePurchased: "2025-10-25",
  },
  {
    id: 12,
    name: "Lenovo IdeaPad Flex 5",
    brand: "Lenovo",
    assignedTo: "Leonard Nimoy",
    datePurchased: "2023-06-03",
  },
  {
    id: 13,
    name: "Dell Latitude 5510",
    brand: "Dell",
    assignedTo: "Mia Townsend",
    datePurchased: "2019-09-30",
  },
  {
    id: 14,
    name: "HP ProBook 450 G7",
    brand: "HP",
    assignedTo: "Nina Ransom",
    datePurchased: "2024-07-11",
  },
  {
    id: 15,
    name: "Acer Swift 3",
    brand: "Acer",
    assignedTo: "Oscar Vazquez",
    datePurchased: "2024-02-19",
  },
];

// Initialize feature flags and UI
document.addEventListener("DOMContentLoaded", () => {
  ldClient.on("ready", () => {
    let showLifecycleStatus = ldClient.variation(FLAG_LAPTOP_LIFE, false);
    console.log(`Flag ${FLAG_LAPTOP_LIFE} is:`, showLifecycleStatus);

    renderTable(laptopData, showLifecycleStatus);

    // React to LaunchDarkly flag changes dynamically
    ldClient.on(`change:${FLAG_LAPTOP_LIFE}`, (current) => {
      console.log(`Flag ${FLAG_LAPTOP_LIFE} changed to`, current);
      showLifecycleStatus = current;
      renderTable(laptopData, showLifecycleStatus);
    });

    // Search filtering logic
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim().toLowerCase();
      const filtered = laptopData.filter(({ name, brand, assignedTo }) =>
        [name, brand, assignedTo].some((field) =>
          field.toLowerCase().includes(searchTerm)
        )
      );
      renderTable(filtered, showLifecycleStatus);
    });
  });
});

/**
 * Render the laptop table with optional lifecycle status column.
 * @param {Array} data - Laptop data to display.
 * @param {Boolean} showLifecycle - Whether to include lifecycle status.
 */
function renderTable(data, showLifecycle) {
  tableBody.innerHTML = ""; // Clear existing rows

  // Ensure lifecycle status column is shown/hidden properly
  updateTableHeader(showLifecycle);

  // Populate table rows
  data.forEach((laptop) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${laptop.name}</td>
      <td>${laptop.brand}</td>
      <td>${laptop.assignedTo}</td>
      <td>${laptop.datePurchased}</td>
      <td>
        <a href="laptop-details.html?id=${laptop.id}">View</a> |
        <a href="laptop-details.html?id=${laptop.id}&mode=edit">Edit</a>
      </td>
    `;

    if (showLifecycle) {
      const lifecycleStatus = calculateLifecycleStatus(laptop.datePurchased);
      const lifecycleTd = document.createElement("td");
      lifecycleTd.innerHTML = `<div class="status ${lifecycleStatus.color}"></div>`;
      row.insertBefore(lifecycleTd, row.children[4]); // Insert before Actions column
    }

    tableBody.appendChild(row);
  });
}

/**
 * Dynamically update table header to reflect lifecycle status column visibility.
 * @param {Boolean} showLifecycle - Whether to show the lifecycle status column.
 */
function updateTableHeader(showLifecycle) {
  const lifecycleTh = document.getElementById("lifecycleTh");

  if (showLifecycle && !lifecycleTh) {
    const statusHeader = document.createElement("th");
    statusHeader.id = "lifecycleTh";
    statusHeader.textContent = "Status";
    tableHeadRow.insertBefore(statusHeader, tableHeadRow.children[4]); // Before Actions column
  } else if (!showLifecycle && lifecycleTh) {
    lifecycleTh.remove();
  }
}

/**
 * Determine lifecycle status color based on the laptop's age.
 * @param {String} dateStr - Purchase date in YYYY-MM-DD format.
 * @returns {Object} { color: "green" | "yellow" | "red" }
 */
function calculateLifecycleStatus(dateStr) {
  const purchaseDate = new Date(dateStr);
  const diffMonths = (new Date() - purchaseDate) / (1000 * 60 * 60 * 24 * 30);

  if (diffMonths < EOL_MONTHS - WARNING_THRESHOLD) {
    return { color: "green" }; // Still within lifecycle
  } else if (diffMonths < EOL_MONTHS) {
    return { color: "yellow" }; // Near end-of-life
  } else {
    return { color: "red" }; // Out of lifecycle
  }
}
