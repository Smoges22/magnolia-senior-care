"use client";

import { FormEvent, useState } from "react";
import { locations, site } from "@/lib/site-data";

export function InquiryForm() {
  const [status, setStatus] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const required = ["name", "phone", "email", "interest"];
    const missing = required.filter((key) => !String(data.get(key) || "").trim());

    if (missing.length > 0) {
      setStatus("Please complete the required fields before sending.");
      return;
    }

    const lines = [
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Email: ${data.get("email")}`,
      `Preferred location: ${data.get("location") || "Not specified"}`,
      `I am a: ${data.get("role") || "Not specified"}`,
      `Interest: ${data.get("interest")}`,
      `Timing: ${data.get("timing") || "Not specified"}`,
      "",
      "Message:",
      data.get("message") || "No additional message."
    ];

    const subject = encodeURIComponent(`Magnolia tour inquiry from ${data.get("name")}`);
    const body = encodeURIComponent(lines.join("\n"));
    setStatus("Opening your email app with the inquiry details.");
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="card card-body form" onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone *</label>
          <input id="phone" name="phone" autoComplete="tel" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="location">Preferred location</label>
          <select id="location" name="location">
            <option value="">Select one</option>
            {Object.values(locations).map((location) => (
              <option key={location.slug}>{location.name}</option>
            ))}
            <option>Either Magnolia location</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="role">I am a</label>
          <select id="role" name="role">
            <option value="">Select one</option>
            <option>Family member</option>
            <option>Power of attorney</option>
            <option>Referral agent</option>
            <option>Discharge planner</option>
            <option>Case manager</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="interest">Primary interest *</label>
          <select id="interest" name="interest" required>
            <option value="">Select one</option>
            <option>Schedule a tour</option>
            <option>Check room availability</option>
            <option>Discuss care fit</option>
            <option>Send a referral</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="timing">Preferred timing</label>
          <select id="timing" name="timing">
            <option value="">Select one</option>
            <option>As soon as possible</option>
            <option>This week</option>
            <option>This month</option>
            <option>Planning ahead</option>
          </select>
        </div>
        <div className="field full">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Please avoid sending sensitive medical details until a secure intake process is confirmed."
          />
        </div>
      </div>
      <p className="form-note">
        This demo form opens a pre-filled email. Connect it to a secure intake or CRM workflow before collecting
        sensitive health information.
      </p>
      <p aria-live="polite">{status}</p>
      <button className="button" type="submit">
        Send Inquiry
      </button>
    </form>
  );
}
