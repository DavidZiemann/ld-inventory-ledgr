# Ledgr Demo App

A demo application showcasing two scenarios:

1. **Scenario 1 – Asset Management Tool** (`laptops.html`)

   - Manage laptops in an inventory system.
   - Feature flag support for **laptop lifecycle tracking** (via LaunchDarkly).

2. **Scenario 2 – Marketing Page** (`ledgr-vs-assetwise.html`)

   - A modern SaaS-style comparison between Ledgr and a fictional competitor **AssetWise**.

This project uses:

- [**Parcel**](https://parceljs.org/) for fast local development.
- [**Pico CSS**](https://picocss.com/) for styling.
- **LaunchDarkly SDK** for feature flagging (optional).

---

## 🚀 Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation](#installation)
   - [macOS Instructions](#macos-instructions)
   - [Windows Instructions](#windows-instructions)
3. [Running the Application Locally](#running-the-application-locally)
4. [LaunchDarkly Setup](#launchdarkly-setup)
5. [Feature Flag Setup](#feature-flag-setup)
6. [Project Structure](#project-structure)

---

## ⚙️ System Requirements

- **Node.js** (v18+ recommended)
- **npm** (bundled with Node.js)

---

## 📥 Installation

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
- Create a **feature flag** called:
  ```plaintext
  release-laptop-life-remaining
  ```
  - **True:** Enables **Lifecycle Column** in the laptop table.
  - **False:** Hides the column.

### **2. Configure SDK Key**

- Create a `.env` file in the project root:
  ```bash
  touch .env
  ```
- Add your **LaunchDarkly client key**:
  ```
  LD_CLIENT_ID=your-launchdarkly-client-side-key
  ```

### **3. Restart Your Dev Server**

```bash
npm run dev
```

### **4. Toggle Feature Flags**

- Open `http://localhost:3000`
- Use the **toggle switch** under **Feature Triggers**.

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

## 🚀 Feature Flags Overview

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
