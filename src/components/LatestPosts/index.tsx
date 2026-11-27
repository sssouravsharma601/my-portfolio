import { BLOG_PATH, formatDate, postPath, type PostTeaser } from '../../blog/schema';
import Section from '../Section';
import styles from './LatestPosts.module.css';

interface Props {
  posts: PostTeaser[];
}

/** The newest posts, near the end of the home page. Nothing at all when there are none. */
export default function LatestPosts({ posts }: Props) {
  if (posts.length === 0) return null;
  return (
    <Section id="blog" title="Latest from the blog">
      <ul className={styles.grid}>
        {posts.map((p) => (
          <li key={p.slug} className={`${styles.card} reveal`} data-spot>
            <p className={`label ${styles.date}`}>
              <time dateTime={p.date}>{formatDate(p.date)}</time>
            </p>
            <h3 className={styles.title}>
              <a href={postPath(p.slug)} className={styles.link}>
                {p.title}
              </a>
            </h3>
            <p className={styles.text}>{p.description}</p>
          </li>
        ))}
      </ul>
      <p className={styles.more}>
        <a className="link" href={BLOG_PATH}>
          All posts
        </a>
      </p>
    </Section>
  );
}
