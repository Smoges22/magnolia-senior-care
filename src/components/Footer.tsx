import Link from "next/link";
import { locations, site } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h2>{site.name}</h2>
            <p>{site.tagline}</p>
            <p>{site.serviceArea}</p>
          </div>
          <div>
            <h3>Website</h3>
            <div className="footer-links">
              {site.nav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3>Locations</h3>
            <div className="footer-links">
              {Object.values(locations).map((location) => (
                <Link key={location.slug} href={location.canonicalPath}>
                  {location.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3>Contact</h3>
            <div className="footer-links">
              <a href={site.phoneHref}>{site.phone}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <span>Private tours by appointment</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          Copyright {new Date().getFullYear()} {site.legalName}. This website is informational and is not medical advice.
          Confirm availability, licensing details, and care fit directly with each Magnolia location.
        </div>
      </div>
    </footer>
  );
}
