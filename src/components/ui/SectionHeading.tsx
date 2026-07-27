import ScrollReveal from './ScrollReveal';

interface Props {
  index: string;
  label: string;
  title: string;
  description?: string;
}

/**
 * Shared section header: a large ghost-outline numeral anchors the section
 * instead of the generic "small-caps eyebrow + gradient title" recipe.
 */
export default function SectionHeading({ index, label, title, description }: Props) {
  return (
    <ScrollReveal className="sec-hd">
      <span className="sec-index" aria-hidden="true">
        {index}
      </span>
      <div className="sec-hd-body">
        <span className="sec-label">{label}</span>
        <h2 className="sec-title">{title}</h2>
        {description && <p className="sec-desc">{description}</p>}
      </div>
    </ScrollReveal>
  );
}
