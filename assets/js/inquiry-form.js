(function () {
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwrZJmjKgrnWIdrtWiAOK4Dl62Py27tgxL4w3mJKl8WJZATbUP2Od9Mg3_kfkyNzZX3/exec";
  const SUCCESS_MESSAGE = "Thank you. We’ll contact you shortly to discuss next steps.";
  const ERROR_MESSAGE = "Something went wrong while sending your request. Please call Magnolia or try again.";

  function initInquiryForm() {
    const form = document.querySelector("[data-inquiry-form]");
    if (!form) return;

    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector("button[type='submit']");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const required = ["name", "phone", "email", "interest"];
      const missing = required.filter((key) => !String(data.get(key) || "").trim());

      if (missing.length) {
        status.textContent = "Please complete the required fields before sending.";
        return;
      }

      const payload = {
        name: String(data.get("name") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        email: String(data.get("email") || "").trim(),
        role: String(data.get("role") || "").trim(),
        primaryInterest: String(data.get("interest") || "").trim(),
        preferredLocation: String(data.get("location") || "").trim(),
        preferredTiming: String(data.get("timing") || "").trim(),
        message: String(data.get("message") || "").trim()
      };

      status.textContent = "Sending your request...";
      if (submitButton) submitButton.disabled = true;

      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const result = await response.json();
          if (result && result.success === false) {
            throw new Error(result.message || "Request was not accepted.");
          }
        }

        form.reset();
        status.textContent = SUCCESS_MESSAGE;
      } catch (error) {
        console.error("Magnolia inquiry form error:", error);
        status.textContent = ERROR_MESSAGE;
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initInquiryForm);
})();
