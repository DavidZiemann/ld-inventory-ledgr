# Ledgr Demo App

This simple demo application showcases the functionality available in LaunchDarkly through 2 scenarios:

#### **Scenario 1 – Asset Management Tool** (`http://localhost:3000/laptops.html`)

A SaaS solution for managing laptops within an organization. The flag `release-laptop-life-remaining` is setup to add a column to the table. Additionally, a listener has been added to automatically update the page if a flag changes either from the LaunchDarkly GUI or triggers.

Relevant files:

- [/src/js/laptops.js](src/js/laptops.js) - Loads content & sets up feature flag
- [/src/js/ldClient.js](/src/js/ldClient.js) - Instantiates the LD client
- [/src/js/toggles.js](/src/js/toggles.js) - Code for triggering API call to trigger flag change
- [/src/js/ldClient.js](/src/js/ldClient.js) - Instantiates the LD client
- [/server/server.js](/server/server.js) - Express server to send triggers to LD & return back success/failure

#### **Scenario 2 – Marketing Landing Page** (`http://localhost:3000/ledgr-vs-assetwise.html`)

A modern SaaS-style comparison between Ledgr and a fictional competitor **AssetWise**.

There are two flags used within this page. The first is `release-marketing-security-report` which is a boolean flag to determine if the security report section should appear.

The second flag is `show-region-based-security-report` and is a multivariate flag that determines which security content is displayed based on the user context (location). This flag has a prerequesite that the `release-marketing-security-report` flag is available.

Relevant files:

- [/src/js/securityMarketing.js](/src/js/securityMarketing.js) - Usage of feature flags for the landing page
- [/src/js/ldClient.js](/src/js/ldClient.js) - Instantiates the LD client

#### **Helper Page** (`http://localhost:3000`)

This is an entry point for accessing the different parts of the demo as well as toggles for feature flags. I recommend starting here.

---

## 🚀 Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation](#installation)
   - [macOS Instructions](#macos-instructions)
   - [Windows Instructions](#windows-instructions)
3. [Running the Application Locally](#running-the-application-locally)
4. [LaunchDarkly Setup](#launchdarkly-setup)
5. [Project Structure](#project-structure)
6. [Feature Flag Setup](#feature-flag-setup)

---

## ⚙️ System Requirements

- **Node.js** (v18+ recommended)
- **npm** (bundled with Node.js)

---

## 📥 Installation

This project uses:

- [**Parcel**](https://parceljs.org/) for fast local development.
- [**Pico CSS**](https://picocss.com/) for styling.
- [**LaunchDarkly**](https://launchdarkly.com) for feature flagging.

Follow the instructions below based on your OS.

### **macOS Instructions**

1. **Install Homebrew (if not installed)**

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js using Homebrew**

   ```bash
   brew install node
   ```

3. **Verify Installation**

   ```bash
   node -v
   npm -v
   ```

4. **Clone the Repository**

   ```bash
   git clone https://github.com/DavidZiemann/ld-inventory-ledgr.git
   cd ld-inventory-ledgr
   ```

5. **Install Dependencies**
   ```bash
   npm install
   ```

---

### **Windows Instructions**

> [!NOTE]  
> I do not have a Windows machine. These steps have not been varified.

1. **Install Node.js**

   - Download and install [Node.js](https://nodejs.org/).
   - Ensure `npm` is included in the installation.

2. **Verify Installation**

   ```powershell
   node -v
   npm -v
   ```

3. **Clone the Repository**

   - Open **Command Prompt** or **PowerShell** and run:
     ```powershell
     git clone https://github.com/DavidZiemann/ld-inventory-ledgr.git
     cd ld-inventory-ledgr
     ```

4. **Install Dependencies**
   ```powershell
   npm install
   ```

---

## ▶️ Running the Application Locally

1. **Start the Development Server**

   ```bash
   npm run dev
   ```

   This launches:

   - **Parcel for the front-end** (`http://localhost:3000`)
   - **Express server for API calls** (`http://localhost:4000`)

2. **Explore Features**

   - Go to `http://localhost:3000`
   - Try **Scenario 1** (`Laptops`) or **Scenario 2** (`Ledgr vs. AssetWise`).

---

## 🎛️ Feature Flags (LaunchDarkly)

This app integrates **LaunchDarkly** for **dynamic feature flag toggles**.

### **1. Set Up LaunchDarkly**

- Sign up at [LaunchDarkly](https://launchdarkly.com/)
- Create a new **Client-Side SDK Key**.

### **2. Configure SDK Key**

- Create a `.env` file in the project root:
  ```bash
  touch .env
  ```
- Add your **LaunchDarkly client key** as well as other helper environment variables:

  ```
  ENVIRONMENT=testing
  LD_CLIENT_ID=your-launchdarkly-client-side-key

  LD_API_KEY=personal-api-key
  LD_PROJECT_KEY=default
  ```

  The API key and project key are used to [export your flag configurations](#export-feature-flags) to the readme.

### **3. Restart Your Dev Server**

```bash
npm run dev
```

### **4. Toggle Feature Flags**

- Open `http://localhost:3000`
- Use the **toggle switch** under **Feature Triggers**.

### **5. Export Feature Flags**

```bash
npm run update-flags
```

---

## 📁 Project Structure

```
ledgr-demo/
├── server/
│   ├── server.js
│   ├── triggersConfig.js
├── src/
│   ├── index.html
│   ├── laptops.html
│   ├── ledgr-vs-assetwise.html
│   ├── js/
│   │   ├── toggles.js
│   │   ├── laptops.js
│   │   ├── ldClient.js
│   └── css/
│       ├── pico.min.css
│       ├── main.css
├── .env
├── package.json
├── README.md
```

---

## 🚀 Feature Flag Setup

**This project uses LaunchDarkly for feature flag management. Below is an automatically generated list of active flags.**

### **release-laptop-life-remaining**

**Type:** boolean

**Description:** Displays laptop life remaining indicator in list and show views

**Default Value:** `false`

---

### **release-marketing-security-report**

**Type:** boolean

**Description:** No description provided.

**Default Value:** `false`

---

### **show-region-based-security-report**

**Type:** multivariate

**Description:** Long lived flag that dynamically shows the security report based on which security framework is relevant to a location

**Default Value:** `false`

#### 🔹 Variations:

| Value   | Description |
| ------- | ----------- |
| `SOC 2` | Default     |
| `GDPR`  | Europe      |
| `CCPA`  | California  |

---
