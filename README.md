# Ledgr Demo App

A simple two-scenario demo application showcasing:
1. **Scenario 1** – An asset management tool for managing laptops (`laptops.html`).  
2. **Scenario 2** – A marketing page comparing Ledgr to a fictional competitor, **AssetWise** (`ledgr-vs-assetwise.html`).  

The app uses [Pico CSS](https://picocss.com/) for styling, along with basic HTML, CSS, and JavaScript. This README will help you set up, install, and run the application on **macOS** or **Windows**.

---

## Table of Contents

1. [Overview](#overview)  
2. [System Requirements](#system-requirements)  
3. [Installation](#installation)  
   - [macOS Instructions](#macos-instructions)  
   - [Windows Instructions](#windows-instructions)  
4. [Running the Application Locally](#running-the-application-locally)  
5. [Project Structure](#project-structure)  
6. [Usage](#usage)  
7. [Contributing](#contributing)  
8. [License](#license)  

---

## Overview

The **Ledgr Demo App** demonstrates two main scenarios:

1. **Asset Management**:  
   - Accessed via `laptops.html`  
   - Lists laptops (with search functionality) and provides a form for adding new laptops.  

2. **Marketing/Comparison**:  
   - A “Ledgr vs. AssetWise” page (`ledgr-vs-assetwise.html`) demonstrating a typical SaaS marketing layout with comparison tables, testimonials, and CTAs.

The `index.html` file serves as an entry point, allowing you to choose a scenario and navigate to the corresponding pages.

---

## System Requirements

- **Node.js** (v14 or later recommended)  
- **npm** (bundled with Node.js)  
- An optional code editor like VS Code, Sublime Text, or any IDE of your choice.

---

## Installation

Below are separate instructions for **macOS** and **Windows**. Both require Node.js and npm to be installed.

### macOS Instructions

1. **Install Node.js**  
   - Visit [Node.js downloads](https://nodejs.org/) and choose the “Recommended for Most Users” installer package for macOS.  
   - Double-click the downloaded `.pkg` file and follow the on-screen instructions.

2. **Clone or Download the Repository**  
   ```bash
   git clone https://github.com/<your-username>/ld-inventory-ledgr.git
   ```
   If you don’t use Git, download the ZIP from your repository and unzip it.

3. **Open Terminal**  
   - Navigate to the project folder:
     ```bash
     cd ld-inventory-ledgr
     ```

4. **Install Dependencies**  
   ```bash
   npm install
   ```

### Windows Instructions

1. **Install Node.js**  
   - Visit [Node.js downloads](https://nodejs.org/) and download the Windows Installer.  
   - Run the `.msi` installer and follow the setup steps.

2. **Clone or Download the Repository**  
   - If you have Git Bash:
     ```bash
     git clone https://github.com/<your-username>/ld-inventory-ledgr.git
     ```
   - Otherwise, [download the ZIP](https://github.com/davidziemann/ld-inventory-ledgr/archive/refs/heads/main.zip) and extract it.

3. **Open Command Prompt or PowerShell**  
   - Navigate (via `cd`) to the extracted project folder:
     ```bash
     cd ld-inventory-ledgr
     ```

4. **Install Dependencies**  
   ```bash
   npm install
   ```

---

## Running the Application Locally

Once dependencies are installed:

1. **Start the Local Server**
   ```bash
   npm start
   ```

   This command uses [serve](https://www.npmjs.com/package/serve) (as defined in your package.json) to serve the current folder (containing your index.html), usually at http://localhost:3000.

2. **Explore**  
   - **Scenario 1 (Asset Management)**: Click the “Go to Laptops” or “Laptops” link on the home page (or visit `laptops.html` directly).  
   - **Scenario 2 (Marketing Page)**: Click the “See Comparison” link on the home page (or open `ledgr-vs-assetwise.html` directly).

3. **Making Changes**  
   - Because serve does not include live reloading by default, you’ll need to manually refresh your browser whenever you update .html, .css, or .js files.


**Notes**:  
- If you need custom port, single-page fallback behavior, or other configurations, you can pass additional flags to `serve`, for example:  
  ```json
  {
    "scripts": {
      "start": "serve . --listen 8080 --single"
    }
  }


---

## Project Structure

A simplified layout of the repository:

```
ld-inventory-ledgr/
├── index.html                # Entry point listing both scenarios
├── laptops.html              # Main page for asset management scenario
├── laptop-details.html       # Page for adding/editing laptops (Scenario 1)
├── ledgr-vs-assetwise.html   # Marketing/Comparison scenario (Scenario 2)
├── css/
│   ├── pico.min.css          # Pico CSS (local copy)
│   └── main.css              # Custom CSS overrides
├── js/
│   ├── laptops.js            # Logic for laptop listing and search
│   └── ...                   # Additional scripts as needed
├── package.json              # Node project metadata & scripts
├── package-lock.json         # Generated lock file (commit to version control)
├── .gitignore                # Git ignore file
└── README.md                 # This file
```

---

## Usage

1. **Laptop Management**  
   - **laptops.html**: Lists laptops in a table, complete with a search bar. The data is currently hard-coded in `js/laptops.js`, but you can extend it to fetch data from an API.  
   - **laptop-details.html**: Demonstrates a basic form to add or edit laptop details.

2. **Ledgr vs. AssetWise**  
   - **ledgr-vs-assetwise.html**: A marketing-style landing page that highlights key differences between Ledgr and AssetWise. Features a hero section, benefit summaries, comparison table, testimonials, and a final CTA.

3. **Extending**  
   - Feel free to modify the CSS, add new sections or pages, or integrate a back-end for a more robust demo.

---

## Contributing

1. **Fork the Repository**  
2. **Create a Feature Branch** (e.g., `feature/my-new-feature`)  
3. **Commit Your Changes**  
4. **Open a Pull Request**  

All contributions or suggestions are welcome!

---

## License

This project is released under the [MIT License](LICENSE).  
Feel free to adapt it for personal or commercial use. See the [LICENSE](LICENSE) file for details.
