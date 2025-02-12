// Initialize LD

import { getLDClient } from "./ldClient.js";

const ldClient = getLDClient();

let user = {
  name: "Jane Doe",
  id: "5efeb736-1995-4e03-8e08-aaa7deb45101",
  email: "jdoe@ledgrdemo.com",
};

// Laptop data
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

// FLAG: release-laptop-life-remaining

const FLAG_releaseLaptopLifeRemaining = "release-laptop-life-remaining";
const EOL_MONTHS = 36; // 3-year lifecycle
const WARNING_THRESHOLD = 3;

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#laptopTable tbody");
  const searchForm = document.querySelector("#searchForm");
  const searchInput = document.querySelector("#searchInput");

  ldClient.on("ready", () => {
    let FLAG_LAPTOP_LIFE = ldClient.variation(
      FLAG_releaseLaptopLifeRemaining,
      false
    );
    console.log(
      `Flag ${FLAG_releaseLaptopLifeRemaining} is:`,
      FLAG_LAPTOP_LIFE
    );

    // Render all laptops initially
    renderTable(laptopData);

    ldClient.on(
      `change:${FLAG_releaseLaptopLifeRemaining}`,
      (current, previous) => {
        console.log(
          `Flag ${FLAG_releaseLaptopLifeRemaining} changed from`,
          previous,
          "to",
          current
        );
        FLAG_LAPTOP_LIFE = current;
        // Re-render the table with the new flag value
        renderTable(laptopData);
      }
    );

    // Filter logic on form submit
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim().toLowerCase();
      const filtered = laptopData.filter(
        (laptop) =>
          laptop.name.toLowerCase().includes(searchTerm) ||
          laptop.brand.toLowerCase().includes(searchTerm) ||
          laptop.assignedTo.toLowerCase().includes(searchTerm)
      );
      renderTable(filtered);
    });

    // Function to render rows in the table
    function renderTable(data) {
      const table = document.querySelector("#laptopTable");
      const theadRow = table.querySelector("thead tr");

      // Clear any existing rows
      tableBody.innerHTML = "";

      // 1. Optionally insert a <th> for Lifecycle Status if showLifecycle is true
      const tableHead = document.querySelector("#laptopTable thead tr");
      // Make sure we don't duplicate the column if it already exists
      if (FLAG_LAPTOP_LIFE) {
          // Find the 5th <th> (Actions). Insert before it, if we haven't already
          const allThs = theadRow.querySelectorAll("th");
          const actionsTh = allThs[4]; // 0:Name,1:Brand,2:Assigned To,3:Date,4:Actions
          const statusHeader = document.createElement("th");
          statusHeader.id = "lifecycleTh";
          statusHeader.textContent = "Status";
          theadRow.insertBefore(statusHeader, actionsTh);
      } else if (document.getElementById("lifecycleTh")) {
        // If toggled of, make sure to remove the header.
        document.getElementById("lifecycleTh").remove();
      }

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

        // 2. If lifecycle flag is on, compute the status and append a <td>
        if (FLAG_LAPTOP_LIFE) {
          const lifecycleStatus = calculateLifecycleStatus(
            laptop.datePurchased
          );
          const lifecycleTd = document.createElement("td");
          lifecycleTd.innerHTML =
            '<div class="status ' + lifecycleStatus.color + '"></div>';

          const tds = row.querySelectorAll("td");
          const actionsTd = tds[4];
          row.insertBefore(lifecycleTd, actionsTd);
        }

        tableBody.appendChild(row);
      });
    }

    // Calculate how many months since purchase, then return { label, color }
    function calculateLifecycleStatus(dateStr) {
      const purchaseDate = new Date(dateStr);
      const now = new Date();

      // Approx months since purchase: (difference in days / ~30)
      const diffTime = now - purchaseDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      const diffMonths = diffDays / 30;

      // Example rules:
      // - < (EOL_MONTHS - WARNING_THRESHOLD) => Green
      // - between (EOL_MONTHS - WARNING_THRESHOLD) & EOL_MONTHS => Yellow
      // - >= EOL_MONTHS => Red
      if (diffMonths < EOL_MONTHS - WARNING_THRESHOLD) {
        return { color: "green" };
      } else if (diffMonths < EOL_MONTHS) {
        return { color: "yellow" };
      } else {
        return { color: "red" };
      }
    }
  });
});
