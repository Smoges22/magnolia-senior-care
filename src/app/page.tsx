/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { LocationCard } from "@/components/LocationCard";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { locations, services, site, testimonials } from "@/lib/site-data";

export default function HomePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.domain,
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    subOrganization: Object.values(locations).map((location) => ({
      "@type": "LocalBusiness",
      name: location.name,
      url: `${site.domain}${location.canonicalPath}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: location.addressLine1,
        addressLocality: location.city,
        addressRegion: location.state,
        postalCode: location.zip,
        addressCountry: "US"
      }
    }))
  };

  return (
    <main id="main">
      <JsonLd data={organizationSchema} />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Two premium Adult Family Homes</div>
            <h1>Warm Magnolia care for families choosing a safer next home.</h1>
            <p className="lede">
              Magnolia Senior Care brings together two residential care homes in Burien and Des Moines, serving families,
              POAs, referral agents, discharge planners, and case managers with clear communication and calm support.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/contact">
                Schedule a Tour
              </Link>
              <Link className="button secondary" href="/referral-agents">
                Referral Partners
              </Link>
            </div>
            <div className="stat-row" aria-label="Magnolia care highlights">
              <div className="stat">
                <strong>2 homes</strong>
                <span>Burien and Des Moines</span>
              </div>
              <div className="stat">
                <strong>24/7</strong>
                <span>Residential support model</span>
              </div>
              <div className="stat">
                <strong>Local</strong>
                <span>South King County focus</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src={locations.burien.heroImage} alt="Premium Magnolia senior care home living room" />
          </div>
        </div>
      </section>

      <section className="section soft" id="locations">
        <div className="container">
          <div className="section-head center">
            <div className="eyebrow">Magnolia locations</div>
            <h2>One trusted brand, two distinct South King County homes.</h2>
            <p>
              Each location page is written with unique neighborhood language, care details, and photo direction so local
              SEO stays useful instead of repetitive.
            </p>
          </div>
          <div className="location-grid">
            {Object.values(locations).map((location) => (
              <LocationCard key={location.slug} location={location} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Care services</div>
            <h2>Premium support in a smaller residential setting.</h2>
            <p>
              Magnolia is positioned for families who want safety and structure without losing the warmth of a real home.
            </p>
          </div>
          <div className="grid-3">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.title} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section gold-soft">
        <div className="container split">
          <div>
            <div className="eyebrow">Referral confidence</div>
            <h2>Built for real placement conversations.</h2>
            <p>
              The website gives professional referral sources a fast way to understand Magnolia&apos;s locations, availability
              path, and care-fit process.
            </p>
            <ul className="check-list">
              <li>Clear CTA paths for urgent tour and availability requests.</li>
              <li>Separate location positioning for Burien and Des Moines searches.</li>
              <li>Trust-building sections for families making sensitive care decisions.</li>
            </ul>
          </div>
          <div className="card card-body">
            <h3>Questions Magnolia helps answer</h3>
            <ul className="check-list">
              <li>Which Magnolia home is the best fit geographically?</li>
              <li>What care level should be reviewed before placement?</li>
              <li>How quickly can a tour or referral conversation happen?</li>
              <li>What documents should families or case managers prepare?</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="eyebrow">Trust signals</div>
            <h2>Warm words for a high-stakes decision.</h2>
          </div>
          <div className="grid-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Compare Magnolia's Burien and Des Moines care homes." />
    </main>
  );
}
