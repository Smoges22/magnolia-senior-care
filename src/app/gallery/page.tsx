import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { locations } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "View Magnolia Senior Care photo direction for the Burien and Des Moines Adult Family Home locations, including rooms, common areas, dining, and outdoor spaces.",
  alternates: {
    canonical: "/gallery"
  }
};

export default function GalleryPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Rooms and photos"
        title="A visual story for families comparing Magnolia homes."
        lede="Use this gallery to replace sample photography with real room, dining, outdoor, and common-area photos from each licensed location."
        current="Gallery"
      />

      <section className="section">
        <div className="container">
          <GalleryGrid />
        </div>
      </section>

      <section className="section soft">
        <div className="container grid-2">
          <article className="card card-body">
            <div className="eyebrow">Burien photo plan</div>
            <h3>{locations.burien.name}</h3>
            <p>
              Use bright photos that emphasize a peaceful Burien home, comfortable rooms, clean dining routines, and
              proximity to familiar neighborhoods like Seahurst, Three Tree Point, and Highline.
            </p>
            <Link className="button" href="/locations/burien">
              View Burien Location
            </Link>
          </article>
          <article className="card card-body">
            <div className="eyebrow">Des Moines photo plan</div>
            <h3>{locations["des-moines"].name}</h3>
            <p>
              Use a distinct visual set for Highline and Des Moines searches: outdoor warmth, calming common spaces,
              accessible pathways, and tour-ready room presentation.
            </p>
            <Link className="button" href="/locations/des-moines">
              View Des Moines Location
            </Link>
          </article>
        </div>
      </section>

      <CTASection title="See which Magnolia home feels right in person." />
    </main>
  );
}
