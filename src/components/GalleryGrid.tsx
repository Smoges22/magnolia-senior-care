/* eslint-disable @next/next/no-img-element */
import { locations } from "@/lib/site-data";

export function GalleryGrid() {
  const images = [
    {
      src: locations.burien.heroImage,
      alt: "Warm living room style for Magnolia Senior Loving Care in Burien"
    },
    {
      src: locations.burien.galleryImages[0],
      alt: "Bright private room inspiration for the Burien Magnolia location"
    },
    {
      src: locations.burien.galleryImages[1],
      alt: "Dining room inspiration for Magnolia Senior Loving Care"
    },
    {
      src: locations["des-moines"].heroImage,
      alt: "Outdoor garden inspiration for Magnolia Senior Care of Highline"
    },
    {
      src: locations["des-moines"].galleryImages[1],
      alt: "Comfortable common area inspiration for the Des Moines Magnolia location"
    }
  ];

  return (
    <div className="gallery-grid">
      {images.map((image) => (
        <img key={image.src} src={image.src} alt={image.alt} />
      ))}
    </div>
  );
}
