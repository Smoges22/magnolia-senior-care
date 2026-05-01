import Link from "next/link";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lede: string;
  current: string;
};

export function PageHero({ eyebrow, title, lede, current }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / {current}
        </div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
      </div>
    </section>
  );
}
