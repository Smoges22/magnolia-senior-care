(function () {
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwrZJmjKgrnWIdrtWiAOK4Dl62Py27tgxL4w3mJKl8WJZATbUP2Od9Mg3_kfkyNzZX3/exec";
  const REQUEST_TIMEOUT_MS = 25000;
  const SENDING_MESSAGE = "Sending your inquiry...";
  const SUCCESS_MESSAGE = "Thank you! Your inquiry has been received. Our Magnolia team will contact you soon.";
  const FAILURE_MESSAGE = "We couldn't submit your inquiry. Please try again or call us directly at";
  const UNKNOWN_MESSAGE = "We couldn't confirm whether your inquiry was received. To avoid a duplicate request, please call Magnolia to confirm at";

  // "success": the script confirmed it saved the inquiry.
  // "failure": the inquiry was definitely not accepted, so trying again is safe.
  // "unknown": the request may have arrived, so the visitor is asked to call instead of resubmitting.
  async function sendInquiry(payload) {
    if (navigator.onLine === false) return "failure";

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response;

    try {
      // A text/plain POST is a simple CORS request, so there is no preflight. Apps Script
      // redirects to script.googleusercontent.com, which serves the JSON reply with CORS
      // headers, so the browser can read whether the script accepted the inquiry.
      response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } catch (error) {
      console.error("Magnolia inquiry form error:", error);
      return "unknown";
    } finally {
      clearTimeout(timer);
    }

    let result = null;
    try {
      result = await response.json();
    } catch (error) {
      console.error("Magnolia inquiry form: unreadable response", response.status);
      return "unknown";
    }

    if (response.ok && result && result.success === true) return "success";
    if (result && result.success === false) return "failure";
    return "unknown";
  }

  // Only the page path and the referring site are sent, never query strings or form values.
  function visitSource() {
    const channel = new URLSearchParams(window.location.search).get("utm_source");
    let referrer = null;
    try {
      referrer = document.referrer ? new URL(document.referrer) : null;
    } catch (error) {
      referrer = null;
    }
    const internal = referrer && referrer.hostname === window.location.hostname;

    return {
      sourcePage: internal ? referrer.pathname : window.location.pathname,
      sourceChannel: (channel || (referrer && !internal ? referrer.hostname : "direct")).slice(0, 80)
    };
  }

  function showStatus(status, outcome) {
    const site = window.AFHSite && window.AFHSite.brand;
    const phone = (site && site.phone) || "(425) 246-6220";
    const phoneHref = (site && site.phoneHref) || "tel:+14252466220";
    const messages = { sending: SENDING_MESSAGE, success: SUCCESS_MESSAGE, failure: FAILURE_MESSAGE, unknown: UNKNOWN_MESSAGE };

    status.textContent = messages[outcome];
    status.dataset.state = outcome;

    if (outcome === "failure" || outcome === "unknown") {
      const link = document.createElement("a");
      link.href = phoneHref;
      link.textContent = phone;
      status.append(" ", link, ".");
    }
  }

  function initInquiryForm() {
    const form = document.querySelector("[data-inquiry-form]");
    if (!form) return;

    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector("button[type='submit']");
    const submitLabel = submitButton ? submitButton.textContent : "";
    const subject = new URLSearchParams(window.location.search).get("subject") || "";
    const inquiryType = form.querySelector("[name='inquiry_type']");
    const interest = form.querySelector("[name='interest']");
    const openedAt = Date.now();
    let sending = false;

    if (/referral inquiry/i.test(subject)) {
      if (inquiryType) inquiryType.value = "Referral Inquiry";
      if (interest) interest.value = "For referral partners";
    } else if (/free (senior care )?consultation/i.test(subject)) {
      if (inquiryType) inquiryType.value = "Free Senior Care Consultation";
      if (interest) interest.value = "Free senior care consultation";
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sending) return;

      const data = new FormData(form);
      const required = ["name", "phone", "email", "interest"];
      const missing = required.filter((key) => !String(data.get(key) || "").trim());

      if (missing.length) {
        status.textContent = "Please complete the required fields before sending.";
        delete status.dataset.state;
        return;
      }

      const payload = {
        name: String(data.get("name") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        email: String(data.get("email") || "").trim(),
        role: String(data.get("role") || "").trim(),
        inquiryType: String(data.get("inquiry_type") || "").trim(),
        subject: subject || String(data.get("inquiry_type") || "").trim(),
        primaryInterest: String(data.get("interest") || "").trim(),
        preferredLocation: String(data.get("location") || "").trim(),
        preferredTiming: String(data.get("timing") || "").trim(),
        message: String(data.get("message") || "").trim(),
        contactReference: String(data.get("contact_reference") || ""),
        elapsedMs: Date.now() - openedAt,
        ...visitSource()
      };

      sending = true;
      form.setAttribute("aria-busy", "true");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }
      showStatus(status, "sending");

      const outcome = await sendInquiry(payload);

      // Entered values stay in place unless the script confirmed it saved them.
      if (outcome === "success") form.reset();
      showStatus(status, outcome);

      sending = false;
      form.removeAttribute("aria-busy");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initInquiryForm);
})();
