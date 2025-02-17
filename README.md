# Ledgr Demo App

This simple demo application showcases the functionality available in LaunchDarkly through 2 scenarios:

<details>
<summary>Scenario 1 – Asset Management Tool</summary>

`http://localhost:3000/laptops.html`

A SaaS solution for managing laptops within an organization. The flag `release-laptop-life-remaining` is setup to add a column to the table. Additionally, a listener has been added to automatically update the page if a flag changes either from the LaunchDarkly GUI or triggers.

Relevant files:

- [/src/js/laptops.js](src/js/laptops.js) - Loads content & sets up feature flag
- [/src/js/ldClient.js](/src/js/ldClient.js) - Instantiates the LD client
- [/src/js/toggles.js](/src/js/toggles.js) - Code for triggering API call to trigger flag change
- [/src/js/ldClient.js](/src/js/ldClient.js) - Instantiates the LD client
- [/server/server.js](/server/server.js) - Express server to send triggers to LD & return back success/failure
</details>
<details>
<summary>Scenario 2 – Marketing Landing Page</summary>

`http://localhost:3000/ledgr-vs-assetwise.html`

A modern SaaS-style comparison between Ledgr and a fictional competitor **AssetWise**.

There are two flags used within this page. The first is `release-marketing-security-report` which is a boolean flag to determine if the security report section should appear.

The second flag is `show-region-based-security-report` and is a multivariate flag that determines which security content is displayed based on the user context (location). This flag has a prerequesite that the `release-marketing-security-report` flag is available.

Relevant files:

- [/src/js/securityMarketing.js](/src/js/securityMarketing.js) - Usage of feature flags for the landing page
- [/src/js/ldClient.js](/src/js/ldClient.js) - Instantiates the LD client
</details>
<details>
<summary>Helper Page</summary>

`http://localhost:3000`

This is an entry point for accessing the different parts of the demo as well as toggles for feature flags. I recommend starting here.

## </details>

## 🚀 Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Running the Application Locally](#running-the-application-locally)
4. [LaunchDarkly Setup](#launchdarkly-setup)
5. [Project Structure](#project-structure)
6. [Feature Flag Setup](#feature-flag-setup)

---

## ⚙️ System Requirements

- **Docker Desktop** (latest version)
- **Visual Studio Code**
- **VSCode Remote - Containers extension**

---

## 📥 Installation

This project uses:

- [**Parcel**](https://parceljs.org/) for fast local development
- [**Pico CSS**](https://picocss.com/) for styling
- [**LaunchDarkly**](https://launchdarkly.com) for feature flagging
- **Docker** and **VSCode Devcontainers** for consistent development environments

### **Setup Instructions**

1. **Install Prerequisites**
   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Install [Visual Studio Code](https://code.visualstudio.com/)
   - Install the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VSCode extension

2. **Clone the Repository**
   ```bash
   git clone https://github.com/DavidZiemann/ld-inventory-ledgr.git
   ```

3. **Open in VSCode**
   ```bash
   code ld-inventory-ledgr
   ```

4. **Start Development Container**
   - When prompted "Folder contains a Dev Container configuration file. Reopen folder to develop in a container", click "Reopen in Container"
   - Or use the Command Palette (F1), type "Reopen in Container"
   
   > [!NOTE]
   > The first time you open the container, it will take a few minutes to build. Subsequent opens will be much faster.

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

  # LaunchDarkly Trigger URLs
  LAPTOP_LIFE_TRIGGER_ON_URL=https://app.launchdarkly.com/webhook/triggers/67b2234d92f033099a7166ab/4cc64367-275e-4c16-ad44-e2e0fec2ce42
  LAPTOP_LIFE_TRIGGER_OFF_URL=https://app.launchdarkly.com/webhook/triggers/67b2236592f033099a7167e2/87788a1f-d69f-40c8-b3d5-f3db1c175f7b
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

### **6. Initialize LaunchDarkly Project (Optional)**

If you want to set up a fresh LaunchDarkly project with all the required flags, segments, and targeting rules:

1. **Python Dependencies**
   The development container comes with all required Python packages pre-installed.

2. **Configure Environment**
   Ensure your `.env` file contains the LaunchDarkly API key:
   ```
   LD_API_KEY=your-launchdarkly-api-key  # Must be an admin-level API key
   ```

3. **Run the Setup Script**
   ```bash
   python ld_project_setup.py
   ```

   This script will:
   - Create a new project named "Ledger"
   - Set up the testing environment
   - Create segments for EU countries and GDPR territorial scope
   - Create feature flags:
     - `release-laptop-life-remaining` (boolean)
     - `release-marketing-security-report` (boolean)
     - `show-region-based-security-report` (multivariate with targeting rules)
   - Configure targeting rules for region-based content

   > [!NOTE]
   > Running this script will create a new project. If you want to use an existing project, you should manually configure the flags and segments in the LaunchDarkly dashboard.

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

> [!NOTE]
> This project uses LaunchDarkly for feature flag management. Below is an automatically generated list of active flags.

#### **release-laptop-life-remaining**

**Type:** boolean

**Description:** Displays laptop life remaining indicator in list and show views

**Default Value:** `false`

---

#### **release-marketing-security-report**

**Type:** boolean

**Description:** No description provided.

**Default Value:** `false`

---

#### **show-region-based-security-report**

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
