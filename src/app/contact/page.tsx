import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { locations, site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact and Schedule a Tour",
  description:
    "Contact Magnolia Senior Care to schedule a private tour, discuss care fit, ask about room availability, or send a referral inquiry for Burien or Des Moines.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Schedule a tour"
        title="Talk with Magnolia about care fit and availability."
        lede="Use the form or call directly to compare locations, request a tour, or start a referral conversation."
        current="Contact"
      />

      <section className="section">
        <div className="container grid-2">
          <InquiryForm />
          <aside className="card card-body">
            <div className="eyebrow">Direct contact</div>
            <h2>Prefer to talk?</h2>
            <p>
              Call the Magnolia main line for tour scheduling, location preference, availability questions, and referral
              routing.
            </p>
            <div className="section-actions">
              <a className="button" href={site.phoneHref}>
                Call {site.phone}
              </a>
              <a className="button secondary" href={`mailto:${site.email}`}>
                Email Magnolia
              </a>
            </div>
            <h3>Locations</h3>
            <ul className="meta-list">
              {Object.values(locations).map((location) => (
                <li key={location.slug}>
                  <strong>{location.name}</strong>
                  <br />
                  {location.addressLine1}, {location.city}, {location.state} {location.zip}
                  <br />
                  {location.addressNote}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
