require("dotenv").config();

const fs = require("fs");

const LAUNCHDARKLY_API_KEY = process.env.LD_API_KEY;
const PROJECT_KEY = process.env.LD_PROJECT_KEY;
const README_FILE = "README.md";
const FLAG_SECTION_MARKER = "## 🚀 Feature Flags Overview"; // Look for this in README

if (!LAUNCHDARKLY_API_KEY || !PROJECT_KEY) {
  console.error("❌ Missing API key or project key in .env file");
  process.exit(1);
}

async function fetchFeatureFlags() {
  const response = await fetch(
    `https://app.launchdarkly.com/api/v2/flags/${PROJECT_KEY}`,
    {
      headers: {
        Authorization: LAUNCHDARKLY_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("❌ Failed to fetch feature flags:", response.statusText);
    return;
  }

  const data = await response.json();
  updateReadme(data);
}

function updateReadme(flags) {
  const markdown = generateMarkdown(flags);

  let readmeContent = fs.readFileSync(README_FILE, "utf-8");
  const flagSectionIndex = readmeContent.indexOf(FLAG_SECTION_MARKER);

  if (flagSectionIndex !== -1) {
    readmeContent = readmeContent.substring(0, flagSectionIndex) + markdown;
  } else {
    readmeContent += `\n\n${markdown}`;
  }

  fs.writeFileSync(README_FILE, readmeContent);
  console.log("✅ Feature flag documentation updated in README.md");
}

function generateMarkdown(flags) {
  let markdown = "## 🚀 Feature Flags Overview\n\n";
  markdown +=
    "**This project uses LaunchDarkly for feature flag management. Below is an automatically generated list of active flags.**\n\n";

  flags.items.forEach((flag) => {
    markdown += `### **${flag.key}**\n`;
    markdown += `**Type:** ${flag.kind}\n\n`;
    markdown += `**Description:** ${
      flag.description || "No description provided."
    }\n\n`;
    markdown += `**Default Value:** \`${
      flag.default ? flag.default : "false"
    }\`\n\n`;

    if (flag.kind === "multivariate" && flag.variations) {
      markdown += `#### 🔹 Variations:\n`;
      markdown += "| Value | Description |\n";
      markdown += "|--------|-------------|\n";
      flag.variations.forEach((variation) => {
        markdown += `| \`${variation.value}\` | ${
          variation.name || "No description"
        } |\n`;
      });
      markdown += "\n";
    }

    // ✅ Safe check: Ensure environments and production exist before accessing
    const productionEnv = flag.environments?.production || {};

    if (productionEnv.rules && productionEnv.rules.length > 0) {
      markdown += `#### 🎯 Targeting Rules:\n`;
      markdown += "| Condition | Variation |\n";
      markdown += "|-----------|------------|\n";
      productionEnv.rules.forEach((rule) => {
        const clauseDescriptions = rule.clauses
          .map(
            (clause) =>
              `\`${clause.attribute} ${clause.op} ${JSON.stringify(
                clause.values
              )}\``
          )
          .join(" AND ");
        markdown += `| ${clauseDescriptions} | \`${rule.variation}\` |\n`;
      });
      markdown += "\n";
    }

    if (flag.prerequisites && flag.prerequisites.length > 0) {
      markdown += `#### ⛓️ Prerequisites:\n`;
      markdown += "| Flag | Required Value |\n";
      markdown += "|------|---------------|\n";
      flag.prerequisites.forEach((prereq) => {
        markdown += `| \`${prereq.key}\` | \`${prereq.variation}\` |\n`;
      });
      markdown += "\n";
    }

    if (productionEnv.triggers && productionEnv.triggers.length > 0) {
      markdown += `#### 🔄 Triggers:\n`;
      productionEnv.triggers.forEach((trigger) => {
        markdown += `- **${trigger.kind}**: ${trigger.description}\n`;
      });
      markdown += "\n";
    }

    markdown += "---\n";
  });

  return markdown;
}

fetchFeatureFlags();
