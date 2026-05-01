import Link from "next/link";
import { site } from "@/lib/site-data";

type CTASectionProps = {
  title?: string;
  body?: string;
};

export function CTASection({
  title = "Schedule a private Magnolia tour.",
  body = "Talk with us about care fit, location preference, room availability, and next steps for your family or referral."
}: CTASectionProps) {
  return (
    <section className="section soft">
      <div className="container cta-band">
        <div className="grid-2">
          <div>
            <div className="eyebrow">Start with clarity</div>
            <h2>{title}</h2>
          </div>
          <div>
            <p>{body}</p>
            <div className="hero-actions">
              <Link className="button gold" href="/contact">
                Schedule Tour
              </Link>
              <a className="button secondary" href={site.phoneHref}>
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
