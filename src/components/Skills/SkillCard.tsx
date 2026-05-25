import type { SkillCategory } from '../../types';
import ScrollReveal from '../ui/ScrollReveal';
import styles from './Skills.module.css';

interface Props { category: SkillCategory; }

export default function SkillCard({ category }: Props) {
  return (
    <ScrollReveal className={styles.card} as="article" aria-label={category.title}>
      <span className={styles.icon} aria-hidden="true">{category.icon}</span>
      <div className={styles.title}>{category.title}</div>
      <div className={styles.tags} role="list" aria-label={`${category.title} skills`}>
        {category.skills.map((skill) => (
          <span key={skill} className={styles.tag} role="listitem">{skill}</span>
        ))}
      </div>
    </ScrollReveal>
  );
}
