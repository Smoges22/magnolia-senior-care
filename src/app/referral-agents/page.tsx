import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { locations, site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Referral Agents, Discharge Planners, and Case Managers",
  description:
    "Referral information for Magnolia Senior Care's Burien and Des Moines Adult Family Homes, including fit conversations, tour scheduling, and professional coordination.",
  alternates: {
    canonical: "/referral-agents"
  }
};

export default function ReferralAgentsPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Referral partners"
        title="A responsive Adult Family Home partner for thoughtful placements."
        lede="Magnolia supports referral agents, discharge planners, case managers, and care coordinators with clear next steps for both Burien and Des Moines homes."
        current="Referral Agents"
      />

      <section className="section">
        <div className="container grid-3">
          <article className="card card-body">
            <h3>Fast location routing</h3>
            <p>
              Referral partners can compare Burien and Des Moines fit without sorting through duplicate content or vague
              service-area pages.
            </p>
          </article>
          <article className="card card-body">
            <h3>Care-fit clarity</h3>
            <p>
              Magnolia encourages early review of mobility, cognition, medication, diet, transfer, behavior, and family
              communication needs.
            </p>
          </article>
          <article className="card card-body">
            <h3>Tour-ready follow-up</h3>
            <p>
              Strong CTA paths help families, POAs, and professional partners move from search to call, tour, and
              documentation.
            </p>
          </article>
        </div>
      </section>

      <section className="section soft">
        <div className="container split">
          <div>
            <div className="eyebrow">Referral process</div>
            <h2>Simple steps for placement conversations.</h2>
            <ul className="check-list">
              <li>Call or email with location preference, resident summary, and timeline.</li>
              <li>Discuss current room availability and care-fit considerations.</li>
              <li>Coordinate a family tour or professional walkthrough.</li>
              <li>Confirm documents needed for assessment and transition planning.</li>
            </ul>
          </div>
          <div className="card card-body">
            <h3>Location contacts</h3>
            <ul className="meta-list">
              {Object.values(locations).map((location) => (
                <li key={location.slug}>
                  <strong>{location.name}:</strong> {location.phone} in {location.city}
                </li>
              ))}
            </ul>
            <div className="section-actions">
              <Link className="button" href="/contact">
                Send Referral Inquiry
              </Link>
              <a className="button secondary" href={site.phoneHref}>
                Call Main Line
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Help a family find the right Magnolia home."
        body="Share the resident summary, preferred city, timeline, and key care considerations so Magnolia can respond with practical next steps."
      />
    </main>
  );
}
