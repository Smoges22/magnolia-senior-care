type TestimonialCardProps = {
  quote: string;
  name: string;
};

export function TestimonialCard({ quote, name }: TestimonialCardProps) {
  return (
    <figure className="card card-body testimonial">
      <blockquote>
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>
      <figcaption>
        <strong>{name}</strong>
      </figcaption>
    </figure>
  );
}
