/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { CareLocation } from "@/lib/site-data";

type LocationCardProps = {
  location: CareLocation;
};

export function LocationCard({ location }: LocationCardProps) {
  return (
    <article className="card location-card">
      <img src={location.heroImage} alt={`${location.name} home environment in ${location.city}`} />
      <div className="card-body">
        <div className="eyebrow">{location.city}, {location.state}</div>
        <h3>{location.name}</h3>
        <p>{location.position}</p>
        <ul className="meta-list">
          <li>{location.neighborhoods.slice(0, 3).join(", ")}</li>
          <li>{location.license}</li>
          <li>{location.addressNote}</li>
        </ul>
        <div className="section-actions">
          <Link className="button" href={location.canonicalPath}>
            View Location
          </Link>
          <a className="button secondary" href={location.phoneHref}>
            Call Location
          </a>
        </div>
      </div>
    </article>
  );
}
