type ServiceCardProps = {
  title: string;
  description: string;
  index: number;
};

export function ServiceCard({ title, description, index }: ServiceCardProps) {
  return (
    <article className="card service-card">
      <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
