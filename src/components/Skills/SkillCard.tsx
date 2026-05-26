import type { SkillCategory } from '../../types';
import ScrollReveal from '../ui/ScrollReveal';
import { 
  FrontendIcon, 
  BackendIcon, 
  DatabaseIcon, 
  LanguagesIcon, 
  ToolsIcon, 
  PlatformsIcon 
} from '../ui/Icons';
import styles from './Skills.module.css';

interface Props {
  category: SkillCategory;
}

const getCategoryIcon = (iconKey: string) => {
  switch (iconKey) {
    case 'frontend':
      return <FrontendIcon size={22} />;
    case 'backend':
      return <BackendIcon size={22} />;
    case 'databases':
      return <DatabaseIcon size={22} />;
    case 'languages':
      return <LanguagesIcon size={22} />;
    case 'tools':
      return <ToolsIcon size={22} />;
    case 'platforms':
      return <PlatformsIcon size={22} />;
    default:
      return <ToolsIcon size={22} />;
  }
};

export default function SkillCard({ category }: Props) {
  return (
    <ScrollReveal className={styles.card} as="article" aria-label={category.title}>
      <span className={styles.icon} aria-hidden="true">
        {getCategoryIcon(category.icon)}
      </span>
      <h3 className={styles.title}>{category.title}</h3>
      <div className={styles.tags} role="list" aria-label={`${category.title} skills`}>
        {category.skills.map((skill) => (
          <span key={skill} className={styles.tag} role="listitem">
            {skill}
          </span>
        ))}
      </div>
    </ScrollReveal>
  );
}
