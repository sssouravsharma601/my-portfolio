import React, { useRef, useEffect, useState } from 'react';
import { useTyping } from '../../hooks/useTyping';
import { useCounter } from '../../hooks/useCounter';
import { heroStats } from '../../data/education';
import { CpuIcon, ServerIcon, DatabaseIcon, PlatformsIcon, ArrowRightIcon } from '../ui/Icons';
import styles from './Hero.module.css';

const PHRASES = [
  'Senior Frontend Engineer',
  'React.js Specialist',
  'TypeScript Architect',
  'UI/UX Performance Expert',
];

interface StatCounterProps {
  value: number | string;
  suffix?: string;
  label: string;
}

/** Animated counter that triggers once in viewport */
function StatCounter({ value, suffix, label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const count = useCounter(typeof value === 'number' ? value : 0, 1600, triggered);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof value !== 'number') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTriggered(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={styles.stat} role="listitem">
      <div className={styles.statNum}>
        {typeof value === 'number' ? `${count}${suffix ?? ''}` : value}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

type ProjectKey = 'dms' | 'byjus' | 'ola';

interface SystemNode {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SimulatedLog {
  delay: number;
  message: string;
  type?: 'info' | 'highlight' | 'success';
}

interface ProjectSystem {
  title: string;
  description: string;
  nodes: SystemNode[];
  metrics: {
    latency: string;
    code: string;
    size: string;
  };
  logs: SimulatedLog[];
}

const SYSTEMS: Record<ProjectKey, ProjectSystem> = {
  dms: {
    title: 'Emirates NBD Decision Management System',
    description:
      'Automated real-time loan & card eligibility engine running 18 critical risk assessments.',
    nodes: [
      { id: 'client', label: 'DMS Portal', icon: <PlatformsIcon size={20} /> },
      { id: 'gateway', label: 'API Gateway', icon: <CpuIcon size={20} /> },
      { id: 'engine', label: 'Rules (Python)', icon: <ServerIcon size={20} /> },
      { id: 'db', label: 'Oracle DB', icon: <DatabaseIcon size={20} /> },
    ],
    metrics: { latency: '145ms', code: '200 OK', size: '1.2 KB' },
    logs: [
      {
        delay: 0,
        message: 'Initiated eligibility check for application UID-77291...',
        type: 'info',
      },
      {
        delay: 400,
        message: 'API Gateway: Route resolved. Bearer JWT signature validated.',
        type: 'highlight',
      },
      {
        delay: 800,
        message: 'Rules Engine: Evaluating loan assessment decision matrix...',
        type: 'info',
      },
      {
        delay: 1200,
        message: 'Oracle DB: Fetching applicant credit history (cache hit).',
        type: 'highlight',
      },
      {
        delay: 1600,
        message: 'Result: APPROVED. Eligibility payload dispatched successfully.',
        type: 'success',
      },
    ],
  },
  byjus: {
    title: "Byju's Student Learn Portal",
    description:
      'Low-latency streaming activity feed and optimistic-update student quiz telemetry.',
    nodes: [
      { id: 'client', label: 'Learn Web', icon: <PlatformsIcon size={20} /> },
      { id: 'gateway', label: 'Flutter Bridge', icon: <CpuIcon size={20} /> },
      { id: 'engine', label: 'Assess Engine', icon: <ServerIcon size={20} /> },
      { id: 'db', label: 'MongoDB', icon: <DatabaseIcon size={20} /> },
    ],
    metrics: { latency: '65ms', code: '101 Switching', size: '0.4 KB' },
    logs: [
      { delay: 0, message: 'Dispatched live quiz submission: Activity ID #AQ-80...', type: 'info' },
      {
        delay: 400,
        message: 'Flutter Bridge: Marshalled native event payload to mobile context.',
        type: 'highlight',
      },
      {
        delay: 800,
        message: 'Assess Engine: Telemetry queueing via websocket thread...',
        type: 'info',
      },
      {
        delay: 1200,
        message: 'MongoDB: Incrementing user metrics and leaderboards.',
        type: 'highlight',
      },
      { delay: 1600, message: 'Connection sync status: Synchronized in-memory.', type: 'success' },
    ],
  },
  ola: {
    title: 'Ola Electric Reservation Pipeline',
    description:
      'High-concurrency EV configuration checkout queue protecting inventories from race states.',
    nodes: [
      { id: 'client', label: 'Reserve App', icon: <PlatformsIcon size={20} /> },
      { id: 'gateway', label: 'Checkout API', icon: <CpuIcon size={20} /> },
      { id: 'engine', label: 'Reserve Core', icon: <ServerIcon size={20} /> },
      { id: 'db', label: 'Redis Cache', icon: <DatabaseIcon size={20} /> },
    ],
    metrics: { latency: '190ms', code: '201 Created', size: '2.1 KB' },
    logs: [
      {
        delay: 0,
        message: 'Checkout payload received: SKU-092 (Midnight Black Scooter)...',
        type: 'info',
      },
      { delay: 400, message: 'Checkout API: Verifying payment gateway session...', type: 'info' },
      {
        delay: 800,
        message: 'Reserve Core: Acquiring atomic item lock in Redis cluster...',
        type: 'highlight',
      },
      { delay: 1200, message: 'PostgreSQL: Ledger write completed. Lock released.', type: 'info' },
      {
        delay: 1600,
        message: 'Booking completed: reservation ID OLE-90221 confirmed.',
        type: 'success',
      },
    ],
  },
};

/** Interactive sandbox displaying system architecture visualisations */
function SandboxPanel() {
  const [activeSystem, setActiveSystem] = useState<ProjectKey>('dms');
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(-1); // -1 = idle, 0 = client, 1 = gateway, 2 = engine, 3 = db
  const [logs, setLogs] = useState<Array<{ text: string; type?: string; time: string }>>([]);
  const pulseRef = useRef<HTMLDivElement>(null);

  const system = SYSTEMS[activeSystem];

  useEffect(() => {
    // Reset simulation on system change
    setSimulating(false);
    setSimStep(-1);
    setLogs([
      {
        text: `Switched to ${activeSystem.toUpperCase()} schematic. Ready for simulation.`,
        type: 'info',
        time: new Date().toLocaleTimeString().split(' ')[0],
      },
    ]);
  }, [activeSystem]);

  const runSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    setSimStep(0);

    // Clear logs
    const initialTime = new Date().toLocaleTimeString().split(' ')[0];
    setLogs([{ text: `Simulating flow: ${system.title}...`, type: 'info', time: initialTime }]);

    const timeouts: any[] = [];

    system.logs.forEach((logItem, index) => {
      const t = setTimeout(() => {
        setSimStep(index);
        setLogs((prev) => [
          ...prev,
          {
            text: logItem.message,
            type: logItem.type,
            time: new Date().toLocaleTimeString().split(' ')[0],
          },
        ]);

        // Final complete step
        if (index === system.logs.length - 1) {
          setSimulating(false);
          setSimStep(4); // Success end node indicator
        }
      }, logItem.delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  };

  // Pulse positions based on step
  const getPulseStyle = () => {
    if (!simulating || simStep < 0 || simStep > 3) return { opacity: 0 };
    const leftValues = ['4%', '33%', '66%', '96%'];
    return {
      left: leftValues[simStep],
      opacity: 1,
    };
  };

  return (
    <div className={styles.sandbox} aria-label="Interactive Architecture Sandbox">
      {/* Sandbox Header */}
      <div className={styles.sandboxHeader}>
        <div className={styles.sandboxDots}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
        </div>
        <div className={styles.sandboxTabs}>
          {(Object.keys(SYSTEMS) as ProjectKey[]).map((key) => (
            <button
              key={key}
              className={`${styles.tabBtn} ${activeSystem === key ? styles.tabActive : ''}`}
              onClick={() => setActiveSystem(key)}
              disabled={simulating}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Sandbox Body / Visual Diagram */}
      <div className={styles.sandboxBody}>
        <h3 className={styles.systemTitle}>{system.title}</h3>
        <p className={styles.systemDesc}>{system.description}</p>

        {/* Node Diagram */}
        <div className={styles.diagram}>
          <div className={styles.connectorLine}>
            <div
              className={styles.connectorProgress}
              style={{
                width: simulating ? `${(simStep / 3) * 100}%` : simStep === 4 ? '100%' : '0%',
              }}
            />
          </div>

          {/* Simulated wire pulse */}
          <div ref={pulseRef} className={styles.pulseDot} style={getPulseStyle()} />

          {system.nodes.map((node, i) => {
            const isActive = i === simStep;
            const isSuccess = simStep === 4;
            return (
              <div
                key={node.id}
                className={`${styles.node} ${isActive ? styles.nodeActive : ''} ${isSuccess ? styles.nodeSuccess : ''}`}
              >
                <div className={styles.nodeCircle}>{node.icon}</div>
                <span className={styles.nodeLabel}>{node.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Sandbox Console */}
      <div className={styles.sandboxConsole}>
        <div className={styles.consoleHeader}>
          <button onClick={runSimulation} className={styles.simulateBtn} disabled={simulating}>
            {simulating ? 'Processing...' : 'Run Simulation'} <ArrowRightIcon size={12} />
          </button>

          <div className={styles.consoleMetrics}>
            <div className={styles.metric}>
              Latency: <span className={styles.metricValue}>{system.metrics.latency}</span>
            </div>
            <div className={styles.metric}>
              Code: <span className={styles.metricValue}>{system.metrics.code}</span>
            </div>
            <div className={styles.metric}>
              Payload: <span className={styles.metricValue}>{system.metrics.size}</span>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className={styles.consoleLogs}>
          {logs.map((log, idx) => {
            let colorClass = '';
            if (log.type === 'highlight') colorClass = styles.logHighlight;
            if (log.type === 'success') colorClass = styles.logSuccess;
            return (
              <div key={idx} className={styles.logLine}>
                <span className={styles.logTimestamp}>[{log.time}]</span>
                <span className={colorClass}>{log.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const typed = useTyping(PHRASES);

  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      <div className={styles.dotGrid} aria-hidden="true" />
      <div className="radial-glow" aria-hidden="true" />

      <div className={styles.inner}>
        {/* ── Left column: profile detail ── */}
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.statusDot} aria-hidden="true" />
            Currently active on UAE fintech integrations
          </div>

          <h1 className={styles.name}>Sourav Sharma</h1>

          <p className={styles.role} aria-label="Role">
            <span>{typed}</span>
            <span className={styles.cursor} aria-hidden="true" />
          </p>

          <p className={styles.desc}>
            I am a senior frontend engineer focused on building robust, high-performance web
            products. From orchestrating eligibility decision platforms at{' '}
            <strong>Emirates NBD</strong> to scaling transaction checkout lines for major consumer
            launches, I design frontend systems with an uncompromising focus on speed, structure,
            and accessibility.
          </p>

          <div className={styles.cta}>
            <a href="#experience" className="btn-primary">
              Explore Systems ↓
            </a>
            <a href="#contact" className="btn-ghost">
              Contact Engineer
            </a>
          </div>

          <div className={styles.stats} role="list" aria-label="Engineering stats">
            {heroStats.map((s) => (
              <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </div>

        {/* ── Right column: Interactive Architecture Diagram ── */}
        <SandboxPanel />
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        Scroll down
      </div>
    </section>
  );
}
