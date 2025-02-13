import { getLDClient, updateLDContext } from "./ldClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  const selector = document.getElementById("compliance-selector");
  const ldClient = getLDClient(selector.value);

  function updateComplianceSection(complianceType) {
    const section = document.getElementById("security-section");
    const content = document.getElementById("security-content");
    const title = document.getElementById("security-title");

    let complianceDetails = {
      title: "Enterprise-Grade Security",
      description:
        "Ledgr ensures compliance with industry-leading security and data protection standards.",
      features: [],
    };

    switch (complianceType) {
      case "GDPR":
        complianceDetails = {
          title: "GDPR Compliance: Protecting EU User Privacy",
          description:
            "Ledgr complies with GDPR regulations by ensuring full data privacy, transparency, and user control.",
          features: [
            "✅ Right to Access & Data Portability",
            "✅ Right to be Forgotten (Data Deletion Requests)",
            "✅ End-to-End Encryption for Personal Data",
            "✅ Compliance with Article 5 (Lawful, Fair & Transparent Processing)",
          ],
        };
        break;
      case "CCPA":
        complianceDetails = {
          title: "CCPA Compliance: California Consumer Rights",
          description:
            "Ledgr meets all CCPA requirements, ensuring transparency and opt-out mechanisms for data collection.",
          features: [
            "✅ Consumer Data Protection & Opt-Out",
            "✅ No Selling of Personal Information",
            "✅ Transparent Data Collection & Usage",
            "✅ Right to Request Personal Data Disclosure",
          ],
        };
        break;
      default:
        complianceDetails = {
          title: "SOC 2 Compliance: Secure & Reliable Operations",
          description:
            "Ledgr is SOC 2 certified, ensuring high security, availability, and confidentiality standards for enterprise data.",
          features: [
            "✅ 24/7 Security Monitoring",
            "✅ Multi-Factor Authentication (MFA) for Admins",
            "✅ Role-Based Access Control (RBAC)",
            "✅ Annual Compliance Audits",
          ],
        };
    }

    // Update the section content dynamically
    title.innerText = complianceDetails.title;
    content.innerHTML = `
        <p>${complianceDetails.description}</p>
        <ul>
          ${complianceDetails.features
            .map((feature) => `<li>${feature}</li>`)
            .join("")}
        </ul>
      `;

    section.style.display = "block";
  }

  // Check if security section should be shown
  ldClient.on("ready", () => {
    const shouldShow = ldClient.variation(
      "release-marketing-security-report",
      false
    );
    if (shouldShow) {
      const securityCompliance = ldClient.variation(
        "show-region-based-security-report",
        "SOC 2"
      );
      updateComplianceSection(securityCompliance);
    }
  });

  // Handle flag updates dynamically
  ldClient.on("change:release-marketing-security-report", (current) => {
    document.getElementById("security-section").style.display = current
      ? "block"
      : "none";
  });

  ldClient.on("change:show-region-based-security-report", (current) => {
    updateComplianceSection(current);
  });

  selector.addEventListener("change", (event) => {
    const selectedRegion = event.target.value;
    updateLDContext(selectedRegion);
  });
});
