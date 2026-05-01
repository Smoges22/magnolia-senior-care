export type LocationSlug = "burien" | "des-moines";

export type CareLocation = {
  slug: LocationSlug;
  name: string;
  city: string;
  state: string;
  zip: string;
  addressLine1: string;
  addressNote: string;
  phone: string;
  phoneHref: string;
  email: string;
  license: string;
  canonicalPath: string;
  seoTitle: string;
  seoDescription: string;
  heroImage: string;
  galleryImages: string[];
  neighborhoods: string[];
  position: string;
  intro: string;
  careDetails: string[];
  tourNotes: string[];
  schemaDescription: string;
};

export const site = {
  name: "Magnolia Senior Care",
  legalName: "Magnolia Senior Care",
  domain: "https://www.magnoliaseniorcare.com",
  phone: "(206) 555-0148",
  phoneHref: "tel:+12065550148",
  email: "tours@magnoliaseniorcare.com",
  tagline: "Premium Adult Family Home care across South King County.",
  description:
    "Magnolia Senior Care offers warm, residential senior care for families, POAs, referral agents, discharge planners, and case managers.",
  serviceArea: "Burien, Des Moines, Highline, Normandy Park, SeaTac, and South King County",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Locations", href: "/#locations" },
    { label: "Referrals", href: "/referral-agents" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" }
  ]
};

export const locations: Record<LocationSlug, CareLocation> = {
  burien: {
    slug: "burien",
    name: "Magnolia Senior Loving Care",
    city: "Burien",
    state: "WA",
    zip: "98166",
    addressLine1: "[Burien licensed street address]",
    addressNote: "Replace with the exact licensed Burien AFH address before launch.",
    phone: "(206) 555-0114",
    phoneHref: "tel:+12065550114",
    email: "burien@magnoliaseniorcare.com",
    license: "WA AFH License #[Burien license number]",
    canonicalPath: "/locations/burien",
    seoTitle: "Magnolia Senior Loving Care | Adult Family Home in Burien, WA",
    seoDescription:
      "Magnolia Senior Loving Care provides warm Adult Family Home care in Burien, WA with personal support, calm routines, and responsive family communication.",
    heroImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=84",
    galleryImages: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1200&q=84",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=84",
      "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1200&q=84"
    ],
    neighborhoods: ["Three Tree Point", "Seahurst", "Sunnydale", "Highline", "Normandy Park"],
    position:
      "A peaceful Burien home for families who want attentive daily care close to familiar South King County neighborhoods.",
    intro:
      "Magnolia Senior Loving Care is positioned for Burien families who want a calm residential setting, practical care conversations, and a warm tour experience. The page speaks to families near Seahurst, Three Tree Point, Highline, and surrounding neighborhoods who may be comparing adult family homes after a hospital stay, rehab transition, or change in home-care needs.",
    careDetails: [
      "Personal care support delivered with quiet routines and privacy.",
      "Comfort-focused room conversations for families comparing Burien residential care options.",
      "Family and POA communication designed to reduce uncertainty during placement decisions.",
      "Transition support for local referral agents and discharge planners coordinating next steps."
    ],
    tourNotes: [
      "Ask about current room availability in the Burien home.",
      "Bring medication lists, care summaries, and mobility notes for a better fit conversation.",
      "Tour questions can include daily rhythm, meals, family visits, and how updates are shared."
    ],
    schemaDescription:
      "Adult Family Home in Burien, Washington providing residential senior care and family communication."
  },
  "des-moines": {
    slug: "des-moines",
    name: "Magnolia Senior Care of Highline",
    city: "Des Moines",
    state: "WA",
    zip: "98198",
    addressLine1: "[Des Moines licensed street address]",
    addressNote: "Replace with the exact licensed Des Moines AFH address before launch.",
    phone: "(206) 555-0186",
    phoneHref: "tel:+12065550186",
    email: "highline@magnoliaseniorcare.com",
    license: "WA AFH License #[Des Moines license number]",
    canonicalPath: "/locations/des-moines",
    seoTitle: "Magnolia Senior Care of Highline | Adult Family Home near Des Moines, WA",
    seoDescription:
      "Magnolia Senior Care of Highline offers premium Adult Family Home care near Des Moines, WA with personalized routines, family updates, and referral-ready coordination.",
    heroImage:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1600&q=84",
    galleryImages: [
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=84",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=84",
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=84"
    ],
    neighborhoods: ["Highline", "North Hill", "Marina District", "Woodmont", "SeaTac"],
    position:
      "A Des Moines and Highline-area care home for families seeking comfort, clarity, and careful transitions.",
    intro:
      "Magnolia Senior Care of Highline serves Des Moines families and Highline-area care partners who need a responsive adult family home conversation. The content is written for people searching near North Hill, the Marina District, Woodmont, and SeaTac when they need a smaller senior care setting with steady communication.",
    careDetails: [
      "Daily living support with a focus on consistency, hydration, meals, and comfort.",
      "Memory-aware routines for residents who benefit from gentle cueing and a predictable environment.",
      "Care-team coordination for families comparing Des Moines, Highline, and SeaTac placement options.",
      "Professional referral communication for case managers and discharge planners."
    ],
    tourNotes: [
      "Ask whether Magnolia Senior Care of Highline is a fit for the resident's timeline and care level.",
      "Share recent discharge, rehab, or assessment notes before promising placement.",
      "Use the tour to discuss family communication, room setup, and transition expectations."
    ],
    schemaDescription:
      "Adult Family Home near Des Moines and Highline, Washington providing residential senior care."
  }
};

export const services = [
  {
    title: "Personal Care",
    description:
      "Respectful assistance with bathing, dressing, grooming, mobility, meals, and daily comfort routines."
  },
  {
    title: "Medication Support",
    description:
      "Organized reminders, documentation support, and coordination with families and care professionals."
  },
  {
    title: "Memory-Aware Routines",
    description:
      "Predictable daily rhythms, gentle cueing, and a calm environment for residents who need extra guidance."
  },
  {
    title: "Meals and Hydration",
    description:
      "Home-style meals, hydration reminders, and attention to preferences, appetite, and comfort."
  },
  {
    title: "Family Communication",
    description:
      "Clear updates for families, POAs, referral agents, case managers, and discharge planners."
  },
  {
    title: "Transition Coordination",
    description:
      "Practical support for move-in planning after hospital, rehab, home-care, or family-care changes."
  }
];

export const testimonials = [
  {
    quote:
      "Magnolia made the tour feel calm and clear. We understood the care fit, the room options, and the next steps.",
    name: "Family member"
  },
  {
    quote:
      "The communication was professional and warm, which matters when families are making a fast placement decision.",
    name: "Referral partner"
  },
  {
    quote:
      "A smaller residential setting with the kind of attention our family was hoping to find.",
    name: "Power of attorney"
  }
];

export function getLocation(slug: LocationSlug) {
  return locations[slug];
}

export function locationUrl(location: CareLocation) {
  return `${site.domain}${location.canonicalPath}`;
}

export function localBusinessSchema(location: CareLocation) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: location.name,
    url: locationUrl(location),
    telephone: location.phoneHref.replace("tel:", ""),
    email: location.email,
    image: location.heroImage,
    description: location.schemaDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.addressLine1,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.zip,
      addressCountry: "US"
    },
    areaServed: location.neighborhoods.map((neighborhood) => `${neighborhood}, WA`),
    priceRange: "$$",
    parentOrganization: {
      "@type": "Organization",
      name: site.name,
      url: site.domain
    }
  };
}
