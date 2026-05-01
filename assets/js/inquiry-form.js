(function () {
  function initInquiryForm() {
    const form = document.querySelector("[data-inquiry-form]");
    if (!form) return;

    const status = form.querySelector("[data-form-status]");
    const site = window.AFHSite;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const required = ["name", "phone", "email", "interest"];
      const missing = required.filter((key) => !String(data.get(key) || "").trim());

      if (missing.length) {
        status.textContent = "Please complete the required fields before sending.";
        return;
      }

      const lines = [
        `Name: ${data.get("name")}`,
        `Phone: ${data.get("phone")}`,
        `Email: ${data.get("email")}`,
        `Preferred location: ${data.get("location") || "Not specified"}`,
        `I am: ${data.get("role") || "Not specified"}`,
        `Interest: ${data.get("interest")}`,
        `Preferred timing: ${data.get("timing") || "Not specified"}`,
        "",
        "Message:",
        data.get("message") || "No additional message."
      ];

      const subject = encodeURIComponent(`Tour or care inquiry from ${data.get("name")}`);
      const body = encodeURIComponent(lines.join("\n"));
      status.textContent = "Opening your email app with the inquiry details.";
      window.location.href = `${site.brand.emailHref}?subject=${subject}&body=${body}`;
    });
  }

  document.addEventListener("DOMContentLoaded", initInquiryForm);
})();
