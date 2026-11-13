import { caseStudies } from '../../data/profile';
import type { CaseStudy, FlowStep, RuleBranch } from '../../types';
import CountUp from '../CountUp';
import Section from '../Section';
import styles from './CaseStudies.module.css';

export default function CaseStudies() {
  return (
    <Section id="cases" index="02" title="Case studies" aside="Two projects, in more depth">
      <div className={styles.list}>
        {caseStudies.map((c) => (
          <Case key={c.id} study={c} />
        ))}
      </div>
    </Section>
  );
}

function Case({ study: c }: { study: CaseStudy }) {
  const headingId = `case-${c.id}-title`;
  return (
    <article id={`case-${c.id}`} aria-labelledby={headingId} className={styles.case}>
      <header className={`${styles.head} reveal`}>
        <p className={`label ${styles.client}`}>
          {c.client} · {c.period}
        </p>
        <h3 id={headingId} className={styles.title}>
          {c.title}
        </h3>
        <p className={styles.lede}>{c.lede}</p>
      </header>

      <div className={styles.body}>
        <div className={styles.text}>
          <dl className={`${styles.meta} reveal`}>
            <div>
              <dt className="label">Role</dt>
              <dd>{c.role}</dd>
            </div>
            <div>
              <dt className="label">Team</dt>
              <dd>{c.team}</dd>
            </div>
          </dl>

          <div className="reveal">
            <h4 className={`label ${styles.sub}`}>The system</h4>
            {c.context.map((p) => (
              <p key={p} className={styles.para}>
                {p}
              </p>
            ))}
          </div>

          <div className="reveal">
            <h4 className={`label ${styles.sub}`}>My part</h4>
            <p className={styles.para}>{c.mine}</p>
            <ul className={styles.built}>
              {c.built.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="reveal">
            <h4 className={`label ${styles.sub}`}>{c.deep.title}</h4>
            <p className={styles.para}>{c.deep.intro}</p>
            <ul className={styles.built}>
              {c.deep.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          {c.sketch && (
            <figure className={`${styles.sketch} reveal`} data-spot>
              <figcaption className={`label ${styles.caption}`}>
                <span>decision.rule</span>
                <span className={styles.draft}>Draft</span>
              </figcaption>
              <Branches branches={c.sketch.branches} />
              <p className={styles.sketchNote}>{c.sketch.caption}</p>
            </figure>
          )}

          <ul className={`${styles.figures} reveal`} aria-label="Results">
            {c.figures.map((f) => (
              <li key={f.label}>
                <span className={styles.value}>
                  <CountUp value={f.value} />
                </span>
                <span className={styles.figLabel}>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className={`${styles.diagram} reveal`} data-spot>
          <figcaption className={`label ${styles.caption}`}>
            <span>How it fits together</span>
            <span>Simplified</span>
          </figcaption>
          <ol className={styles.flow}>
            {c.flow.map((s) => (
              <Step key={s.label} step={s} />
            ))}
          </ol>
        </figure>
      </div>
    </article>
  );
}

function Branches({ branches }: { branches: RuleBranch[] }) {
  return (
    <ul className={styles.branches}>
      {branches.map((b, i) => (
        <li key={`${b.keyword}-${i}`} className={styles.branch}>
          <div className={styles.branchBox}>
            <p className={styles.keyword}>{b.keyword}</p>
            {b.rows && (
              <ul className={styles.rows}>
                {b.rows.map((r) => (
                  <li key={r.text} className={styles.row}>
                    <span className={styles.join}>{r.join}</span>
                    <span className={styles.test}>{r.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {b.then && (
              <div className={styles.then}>
                <span className={styles.thenKey}>then</span>
                <ul className={styles.assigns}>
                  {b.then.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {b.branches && <Branches branches={b.branches} />}
        </li>
      ))}
    </ul>
  );
}

function Step({ step: s }: { step: FlowStep }) {
  return (
    <li className={styles.step}>
      <div className={`${styles.node} ${s.mine ? styles.mine : ''}`}>
        <p className={styles.nodeHead}>
          <span className={styles.nodeLabel}>{s.label}</span>
          {s.mine && <span className={`label ${styles.tag}`}>My area</span>}
        </p>
        <p className={styles.nodeNote}>{s.note}</p>
        {s.parts && (
          <ul className={`label ${styles.parts}`}>
            {s.parts.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        {s.aside && <p className={styles.aside}>{s.aside}</p>}
      </div>
      {s.next && (
        <p className={`label ${styles.link}`}>
          <span className={styles.wire} aria-hidden="true" />
          {s.next}
        </p>
      )}
    </li>
  );
}
