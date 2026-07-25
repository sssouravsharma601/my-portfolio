import { type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion';
import type { SkillCategory } from '../../types';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  FrontendIcon,
  BackendIcon,
  DatabaseIcon,
  LanguagesIcon,
  ToolsIcon,
  PlatformsIcon,
} from '../ui/Icons';
import styles from './Skills.module.css';

interface Props {
  category: SkillCategory;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const TILT_SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

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
  const reducedMotion = usePrefersReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), TILT_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), TILT_SPRING);

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.article
      className={styles.card}
      aria-label={category.title}
      variants={cardVariants}
      style={
        reducedMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }
      }
      whileHover={reducedMotion ? undefined : { y: -6 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
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
    </motion.article>
  );
}
