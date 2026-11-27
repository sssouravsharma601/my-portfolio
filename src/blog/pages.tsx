/**
 * The markup of the blog pages: the list, a tag's list and a post. Rendered
 * to static HTML at build time (blog/generate.tsx); never hydrated.
 */
import {
  AUTHOR,
  BLOG_PATH,
  FEED_PATH,
  formatDate,
  hostOf,
  isExternal,
  postPath,
  tagPath,
  type Post,
  type Tag,
} from './schema';
import styles from './Blog.module.css';

export const AI_NOTE = 'Researched and drafted with AI from the linked sources.';
export const EMPTY_STATE = 'First posts coming soon.';

function Tags({ tags, current }: { tags: Tag[]; current?: Tag }) {
  return (
    <ul className={styles.tags} aria-label="Tags">
      {tags.map((t) => (
        <li key={t}>
          <a
            href={tagPath(t)}
            className={styles.tag}
            aria-current={t === current ? 'page' : undefined}
          >
            {t}
          </a>
        </li>
      ))}
    </ul>
  );
}

function PostCard({ post, current }: { post: Post; current?: Tag }) {
  return (
    <li className={styles.card} data-spot>
      <p className={`label ${styles.meta}`}>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true"> · </span>
        <span>{post.readingMinutes} min read</span>
      </p>
      <h2 className={styles.cardTitle}>
        <a href={postPath(post.slug)} className={styles.cardLink}>
          {post.title}
        </a>
      </h2>
      <p className={styles.cardText}>{post.description}</p>
      <Tags tags={post.tags} current={current} />
    </li>
  );
}

interface ListProps {
  /** The posts to show, newest first. */
  posts: Post[];
  /** Tags that have at least one post, for the filter. */
  tags: Tag[];
  /** Set on a tag's page. */
  tag?: Tag;
}

export function ListPage({ posts, tags, tag }: ListProps) {
  return (
    <main id="main" className={`page ${styles.main}`}>
      <header className={styles.head}>
        {tag ? (
          <p className={`label ${styles.kicker}`}>
            <a href={BLOG_PATH} className={styles.crumb}>
              Blog
            </a>
          </p>
        ) : null}
        <h1 className={styles.title}>{tag ?? 'Blog'}</h1>
        <p className={styles.intro}>
          {tag
            ? `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} tagged ${tag}.`
            : 'Short, sourced notes on the web platform, frontend engineering and the ideas around them.'}{' '}
          <a className="link" href={FEED_PATH}>
            RSS feed
          </a>
        </p>
      </header>

      {tags.length > 0 && (
        <nav aria-label="Filter by tag" className={styles.filter}>
          <ul>
            <li>
              <a href={BLOG_PATH} className={styles.chip} aria-current={tag ? undefined : 'page'}>
                All
              </a>
            </li>
            {tags.map((t) => (
              <li key={t}>
                <a
                  href={tagPath(t)}
                  className={styles.chip}
                  aria-current={t === tag ? 'page' : undefined}
                >
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {posts.length > 0 ? (
        <ul className={styles.list}>
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} current={tag} />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{EMPTY_STATE}</p>
      )}
    </main>
  );
}

interface PostProps {
  post: Post;
  /** The next older post. */
  previous?: Post;
  /** The next newer post. */
  next?: Post;
  aiNote: boolean;
}

export function PostPage({ post, previous, next, aiNote }: PostProps) {
  return (
    <main id="main" className={`page ${styles.main}`}>
      <article className={styles.article} aria-labelledby="post-title">
        <header className={styles.postHead}>
          <p className={`label ${styles.kicker}`}>
            <a href={BLOG_PATH} className={styles.crumb}>
              Blog
            </a>
          </p>
          <h1 id="post-title" className={styles.postTitle}>
            {post.title}
          </h1>
          <p className={styles.lede}>{post.description}</p>
          <div className={styles.byline}>
            <p className="label">
              <span className={styles.author}>{AUTHOR}</span>
              <span aria-hidden="true"> · </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true"> · </span>
              <span>{post.readingMinutes} min read</span>
            </p>
            {aiNote && post.aiAssisted && <p className={styles.aiNote}>{AI_NOTE}</p>}
          </div>
          <Tags tags={post.tags} />
        </header>

        <div className={styles.prose} dangerouslySetInnerHTML={{ __html: post.html }} />

        <section className={styles.sources} aria-labelledby="sources">
          <h2 id="sources" className={styles.sourcesTitle}>
            Sources
          </h2>
          <ol>
            {post.sources.map((s) => (
              <li key={s.url}>
                <a
                  className="link"
                  href={s.url}
                  rel={isExternal(s.url) ? 'noopener noreferrer' : undefined}
                >
                  {s.title}
                </a>{' '}
                <span className={styles.host}>{hostOf(s.url)}</span>
              </li>
            ))}
          </ol>
        </section>
      </article>

      {(previous ?? next) && (
        <nav className={styles.pager} aria-label="More posts">
          {previous ? (
            <a href={postPath(previous.slug)} className={styles.pagerLink} rel="prev" data-spot>
              <span className={`label ${styles.pagerLabel}`}>Previous</span>
              <span className={styles.pagerTitle}>{previous.title}</span>
            </a>
          ) : null}
          {next ? (
            <a
              href={postPath(next.slug)}
              className={`${styles.pagerLink} ${styles.pagerNext}`}
              rel="next"
              data-spot
            >
              <span className={`label ${styles.pagerLabel}`}>Next</span>
              <span className={styles.pagerTitle}>{next.title}</span>
            </a>
          ) : null}
        </nav>
      )}
      <p className={styles.back}>
        <a className="link" href={BLOG_PATH}>
          All posts
        </a>
      </p>
    </main>
  );
}
