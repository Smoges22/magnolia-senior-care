import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { services, site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Adult Family Home Services",
  description:
    "Explore Magnolia Senior Care services including personal care, medication support, memory-aware routines, meals, family communication, and transition coordination.",
  alternates: {
    canonical: "/services"
  }
};

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Care services"
        title="Personal support in a warm residential setting."
        lede="Magnolia's service pages are written for families and professionals who need practical clarity before they schedule a tour."
        current="Services"
      />

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {services.map((service, index) => (
              <ServiceCard key={service.title} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container split">
          <div>
            <div className="eyebrow">Care fit first</div>
            <h2>A good admission starts with the right conversation.</h2>
            <p>
              Adult Family Home placement depends on care needs, room availability, staffing fit, assessment details,
              licensing requirements, and family goals. Magnolia&apos;s website avoids overpromising and directs visitors to a
              thoughtful care-fit conversation.
            </p>
            <ul className="check-list">
              <li>Review mobility, cognition, medication, diet, and transfer support needs.</li>
              <li>Discuss the preferred Magnolia location and current room availability.</li>
              <li>Coordinate with POAs, referral agents, discharge planners, and case managers.</li>
            </ul>
          </div>
          <div className="card card-body">
            <h3>Tour questions to bring</h3>
            <ul className="check-list">
              <li>Which location is best for our family geography?</li>
              <li>How are updates shared with family or POA contacts?</li>
              <li>What happens if care needs change after move-in?</li>
              <li>Which documents help Magnolia review fit quickly?</li>
            </ul>
            <div className="section-actions">
              <Link className="button" href="/contact">
                Schedule Tour
              </Link>
              <a className="button secondary" href={site.phoneHref}>
                Call Magnolia
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
