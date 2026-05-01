/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema, locations, type LocationSlug } from "@/lib/site-data";

type LocationPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(locations).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = locations[slug as LocationSlug];

  if (!location) {
    return {};
  }

  return {
    title: location.seoTitle,
    description: location.seoDescription,
    alternates: {
      canonical: location.canonicalPath
    },
    openGraph: {
      title: location.seoTitle,
      description: location.seoDescription,
      images: [location.heroImage]
    }
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = locations[slug as LocationSlug];

  if (!location) {
    notFound();
  }

  return (
    <main id="main">
      <JsonLd data={localBusinessSchema(location)} />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/#locations">Locations</Link> / {location.city}
          </div>
          <div className="eyebrow">{location.city}, {location.state}</div>
          <h1>{location.name}</h1>
          <p className="lede">{location.position}</p>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              Request a {location.city} Tour
            </Link>
            <a className="button secondary" href={location.phoneHref}>
              Call {location.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <div className="eyebrow">Local care profile</div>
            <h2>Adult Family Home care shaped for {location.city} families.</h2>
            <p>{location.intro}</p>
            <ul className="check-list">
              {location.careDetails.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
          <div className="hero-image">
            <img src={location.heroImage} alt={`${location.name} residential care setting in ${location.city}`} />
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container grid-2">
          <article className="card card-body">
            <div className="eyebrow">Neighborhood focus</div>
            <h2>{location.city} service context</h2>
            <p>
              Magnolia uses neighborhood-specific language so this page is useful for real families searching locally,
              not just a duplicated location template.
            </p>
            <ul className="meta-list">
              {location.neighborhoods.map((neighborhood) => (
                <li key={neighborhood}>{neighborhood}</li>
              ))}
            </ul>
          </article>
          <article className="card card-body">
            <div className="eyebrow">Tour planning</div>
            <h2>What to discuss on the first call.</h2>
            <ul className="check-list">
              {location.tourNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Location photos</div>
            <h2>Distinct photo direction for {location.name}.</h2>
            <p>
              Replace these placeholders with real location-specific photos so the Burien and Des Moines pages each show
              the correct rooms, entrances, dining areas, and outdoor spaces.
            </p>
          </div>
          <div className="grid-3">
            {location.galleryImages.map((image, index) => (
              <div className="image-panel" key={image}>
                <img src={image} alt={`${location.name} photo ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section gold-soft">
        <div className="container grid-2">
          <article>
            <div className="eyebrow">Licensed location details</div>
            <h2>{location.name}</h2>
            <p>
              {location.addressLine1}, {location.city}, {location.state} {location.zip}
            </p>
            <p>{location.addressNote}</p>
            <p>{location.license}</p>
          </article>
          <article className="card card-body">
            <h3>Contact this location</h3>
            <p>
              Call {location.phone} or email {location.email} to ask about room availability, tour timing, care fit, and
              referral steps.
            </p>
            <div className="section-actions">
              <a className="button" href={location.phoneHref}>
                Call Location
              </a>
              <a className="button secondary" href={`mailto:${location.email}`}>
                Email Location
              </a>
            </div>
          </article>
        </div>
      </section>

      <CTASection
        title={`Schedule a private tour at ${location.name}.`}
        body={`Ask Magnolia about ${location.city} availability, care fit, room setup, and what to prepare before a placement conversation.`}
      />
    </main>
  );
}
