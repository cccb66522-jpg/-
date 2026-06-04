import { useMemo, useState } from 'react';

type SessionType = '跑步' | '力量' | '骑行' | '恢复' | '游泳';

type TrainingSession = {
  id: number;
  date: string;
  type: SessionType;
  title: string;
  duration: number;
  rpe: number;
  hrv: number;
  sleep: number;
  soreness: number;
  restingHr: number;
  notes: string;
};

type RangeKey = '7d' | '14d' | '28d';

const sessions: TrainingSession[] = [
  {
    id: 1,
    date: '2026-05-08',
    type: '跑步',
    title: '有氧基础跑',
    duration: 48,
    rpe: 4,
    hrv: 71,
    sleep: 7.4,
    soreness: 2,
    restingHr: 51,
    notes: '配速稳定，后半程呼吸轻松。',
  },
  {
    id: 2,
    date: '2026-05-10',
    type: '力量',
    title: '下肢力量',
    duration: 62,
    rpe: 7,
    hrv: 68,
    sleep: 6.8,
    soreness: 4,
    restingHr: 53,
    notes: '深蹲主项完成，臀腿酸痛升高。',
  },
  {
    id: 3,
    date: '2026-05-12',
    type: '骑行',
    title: '低强度骑行',
    duration: 72,
    rpe: 3,
    hrv: 73,
    sleep: 7.9,
    soreness: 2,
    restingHr: 50,
    notes: '主动恢复，心率控制良好。',
  },
  {
    id: 4,
    date: '2026-05-14',
    type: '跑步',
    title: '节奏跑',
    duration: 55,
    rpe: 8,
    hrv: 65,
    sleep: 6.4,
    soreness: 5,
    restingHr: 55,
    notes: '阈值段压力偏高，结束后疲劳明显。',
  },
  {
    id: 5,
    date: '2026-05-16',
    type: '恢复',
    title: '拉伸与灵活性',
    duration: 28,
    rpe: 2,
    hrv: 70,
    sleep: 7.2,
    soreness: 3,
    restingHr: 52,
    notes: '髋屈肌紧张缓解。',
  },
  {
    id: 6,
    date: '2026-05-18',
    type: '跑步',
    title: '长距离',
    duration: 94,
    rpe: 7,
    hrv: 66,
    sleep: 7,
    soreness: 4,
    restingHr: 54,
    notes: '补给节奏正常，最后 15 分钟略吃力。',
  },
  {
    id: 7,
    date: '2026-05-20',
    type: '游泳',
    title: '技术游',
    duration: 42,
    rpe: 3,
    hrv: 72,
    sleep: 7.7,
    soreness: 2,
    restingHr: 50,
    notes: '肩部状态轻松。',
  },
  {
    id: 8,
    date: '2026-05-22',
    type: '力量',
    title: '全身力量',
    duration: 58,
    rpe: 6,
    hrv: 69,
    sleep: 6.9,
    soreness: 4,
    restingHr: 52,
    notes: '硬拉降量，动作质量不错。',
  },
  {
    id: 9,
    date: '2026-05-24',
    type: '跑步',
    title: '间歇 6x800m',
    duration: 64,
    rpe: 9,
    hrv: 62,
    sleep: 6.1,
    soreness: 6,
    restingHr: 57,
    notes: '训练刺激强，次日建议降载。',
  },
  {
    id: 10,
    date: '2026-05-26',
    type: '恢复',
    title: '轻松步行',
    duration: 36,
    rpe: 2,
    hrv: 67,
    sleep: 7.1,
    soreness: 4,
    restingHr: 54,
    notes: '恢复中，腿部沉重感下降。',
  },
  {
    id: 11,
    date: '2026-05-28',
    type: '骑行',
    title: '甜区骑行',
    duration: 78,
    rpe: 7,
    hrv: 64,
    sleep: 6.5,
    soreness: 5,
    restingHr: 56,
    notes: '功率稳定，但睡眠不足。',
  },
  {
    id: 12,
    date: '2026-05-30',
    type: '跑步',
    title: '轻松跑',
    duration: 46,
    rpe: 3,
    hrv: 70,
    sleep: 7.8,
    soreness: 3,
    restingHr: 51,
    notes: '恢复反弹，步频自然。',
  },
  {
    id: 13,
    date: '2026-06-01',
    type: '力量',
    title: '核心与上肢',
    duration: 44,
    rpe: 5,
    hrv: 74,
    sleep: 8.1,
    soreness: 2,
    restingHr: 49,
    notes: '状态清爽，可逐步加量。',
  },
  {
    id: 14,
    date: '2026-06-03',
    type: '跑步',
    title: '渐进跑',
    duration: 52,
    rpe: 6,
    hrv: 69,
    sleep: 7.3,
    soreness: 3,
    restingHr: 52,
    notes: '末段提速顺畅，压力可控。',
  },
];

const rangeOptions: Array<{ label: string; value: RangeKey; days: number }> = [
  { label: '7 天', value: '7d', days: 7 },
  { label: '14 天', value: '14d', days: 14 },
  { label: '28 天', value: '28d', days: 28 },
];

const typeColor: Record<SessionType, string> = {
  跑步: '#2563eb',
  力量: '#b45309',
  骑行: '#059669',
  恢复: '#7c3aed',
  游泳: '#0891b2',
};

function getLoad(session: TrainingSession) {
  return session.duration * session.rpe;
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getRecoveryScore(session: TrainingSession) {
  const hrvScore = Math.min(100, (session.hrv / 78) * 100);
  const sleepScore = Math.min(100, (session.sleep / 8) * 100);
  const sorenessPenalty = session.soreness * 7;
  const hrPenalty = Math.max(0, session.restingHr - 50) * 3;

  return Math.round(Math.max(0, hrvScore * 0.38 + sleepScore * 0.42 + 20 - sorenessPenalty - hrPenalty));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(`${date}T00:00:00`));
}

function App() {
  const [range, setRange] = useState<RangeKey>('14d');
  const [targetLoad, setTargetLoad] = useState(2350);

  const selectedRange = rangeOptions.find((option) => option.value === range) ?? rangeOptions[1];

  const visibleSessions = useMemo(() => {
    const latest = new Date(`${sessions[sessions.length - 1].date}T00:00:00`).getTime();
    const start = latest - (selectedRange.days - 1) * 24 * 60 * 60 * 1000;

    return sessions.filter((session) => new Date(`${session.date}T00:00:00`).getTime() >= start);
  }, [selectedRange.days]);

  const summary = useMemo(() => {
    const loads = visibleSessions.map(getLoad);
    const recoveryScores = visibleSessions.map(getRecoveryScore);
    const totalLoad = Math.round(loads.reduce((sum, value) => sum + value, 0));
    const avgRecovery = Math.round(average(recoveryScores));
    const avgSleep = average(visibleSessions.map((session) => session.sleep));
    const avgHrv = Math.round(average(visibleSessions.map((session) => session.hrv)));
    const highIntensity = visibleSessions.filter((session) => session.rpe >= 7).length;
    const latest = visibleSessions[visibleSessions.length - 1];
    const latestLoad = latest ? getLoad(latest) : 0;
    const loadRatio = targetLoad > 0 ? totalLoad / targetLoad : 0;

    return {
      totalLoad,
      avgRecovery,
      avgSleep,
      avgHrv,
      highIntensity,
      latest,
      latestLoad,
      loadRatio,
    };
  }, [targetLoad, visibleSessions]);

  const readiness = summary.avgRecovery >= 78 ? '可以推进' : summary.avgRecovery >= 62 ? '维持节奏' : '优先恢复';
  const loadStatus =
    summary.loadRatio > 1.12 ? '超出计划' : summary.loadRatio >= 0.86 ? '接近目标' : '负荷偏低';
  const dailyAdvice =
    summary.avgRecovery < 62
      ? '今天适合低强度有氧、拉伸或完全休息。避免连续高 RPE 刺激。'
      : summary.loadRatio > 1.12
        ? '本周期刺激已经偏高，下一次训练建议缩短时长或降低强度。'
        : '恢复与负荷匹配良好，可以安排一次质量训练，但保留热身后的调整空间。';

  return (
    <main className="app-shell">
      <section className="dashboard-header" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Training Readiness</p>
          <h1 id="page-title">个人训练负荷与恢复追踪看板</h1>
          <p className="header-copy">训练压力、睡眠、HRV 和主观疲劳的统一视图。</p>
        </div>

        <div aria-label="今日恢复建议" aria-live="polite" className="readiness-card">
          <span className="readiness-label">今日状态</span>
          <strong>{readiness}</strong>
          <span>{dailyAdvice}</span>
        </div>
      </section>

      <section className="control-strip" aria-label="看板控制">
        <div className="segmented-control" role="group" aria-label="统计周期">
          {rangeOptions.map((option) => (
            <button
              className={option.value === range ? 'active' : ''}
              key={option.value}
              onClick={() => setRange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="target-control" htmlFor="target-load">
          <span>周期目标负荷</span>
          <input
            id="target-load"
            max="4200"
            min="800"
            onChange={(event) => setTargetLoad(Number(event.target.value))}
            step="50"
            type="range"
            value={targetLoad}
          />
          <strong>{targetLoad}</strong>
        </label>
      </section>

      <section className="metric-grid" aria-label="核心指标">
        <MetricCard label="周期训练负荷" tone={loadStatus} value={summary.totalLoad.toLocaleString('zh-CN')} />
        <MetricCard label="平均恢复分" tone={readiness} value={summary.avgRecovery} />
        <MetricCard label="平均 HRV" tone="ms" value={summary.avgHrv} />
        <MetricCard label="平均睡眠" tone="小时" value={summary.avgSleep.toFixed(1)} />
        <MetricCard label="高强度训练" tone="次" value={summary.highIntensity} />
      </section>

      <section className="content-grid">
        <article className="panel wide">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Load vs Recovery</p>
              <h2>负荷与恢复趋势</h2>
            </div>
            <span className="status-pill">{loadStatus}</span>
          </div>
          <TrendChart sessions={visibleSessions} />
          <DataSummary sessions={visibleSessions} />
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Readiness Mix</p>
              <h2>恢复构成</h2>
            </div>
          </div>
          <RecoveryRadar session={summary.latest ?? visibleSessions[0]} />
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Distribution</p>
              <h2>训练类型分布</h2>
            </div>
          </div>
          <TypeBreakdown sessions={visibleSessions} />
        </article>

        <article className="panel wide">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Recent Sessions</p>
              <h2>近期训练记录</h2>
            </div>
          </div>
          <SessionTable sessions={visibleSessions} />
        </article>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: string;
  value: number | string;
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{tone}</em>
    </article>
  );
}

function TrendChart({ sessions }: { sessions: TrainingSession[] }) {
  const chart = useMemo(() => {
    const loads = sessions.map(getLoad);
    const recoveries = sessions.map(getRecoveryScore);
    const maxLoad = Math.max(...loads, 1);
    const points = recoveries
      .map((score, index) => {
        const x = sessions.length === 1 ? 50 : 8 + (index / (sessions.length - 1)) * 84;
        const y = 88 - (score / 100) * 70;
        return `${x},${y}`;
      })
      .join(' ');

    return { loads, maxLoad, points };
  }, [sessions]);

  return (
    <div className="trend-chart">
      <div className="bar-layer">
        {sessions.map((session, index) => (
          <div className="bar-column" key={session.id}>
            <div
              aria-label={`${formatDate(session.date)} ${session.type} 负荷 ${chart.loads[index]} 恢复分 ${getRecoveryScore(
                session,
              )}`}
              className="load-bar"
              style={{
                height: `${Math.max(12, (chart.loads[index] / chart.maxLoad) * 100)}%`,
                backgroundColor: typeColor[session.type],
              }}
            />
            <span>{formatDate(session.date)}</span>
          </div>
        ))}
      </div>
      <svg aria-label="恢复分趋势线" className="line-layer" preserveAspectRatio="none" viewBox="0 0 100 100">
        <polyline points={chart.points} />
        {sessions.map((session, index) => {
          const x = sessions.length === 1 ? 50 : 8 + (index / (sessions.length - 1)) * 84;
          const y = 88 - (getRecoveryScore(session) / 100) * 70;

          return <circle cx={x} cy={y} key={session.id} r="1.8" />;
        })}
      </svg>
    </div>
  );
}

function DataSummary({ sessions }: { sessions: TrainingSession[] }) {
  return (
    <dl className="chart-data-summary">
      {sessions.map((session) => (
        <div key={session.id}>
          <dt>{formatDate(session.date)}</dt>
          <dd>
            负荷 {getLoad(session)} / 恢复 {getRecoveryScore(session)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function RecoveryRadar({ session }: { session?: TrainingSession }) {
  if (!session) {
    return null;
  }

  const items = [
    { label: 'HRV', value: Math.min(100, Math.round((session.hrv / 78) * 100)) },
    { label: '睡眠', value: Math.min(100, Math.round((session.sleep / 8) * 100)) },
    { label: '酸痛', value: Math.max(0, 100 - session.soreness * 12) },
    { label: '静息心率', value: Math.max(0, 100 - Math.max(0, session.restingHr - 48) * 5) },
  ];

  return (
    <div className="recovery-list">
      {items.map((item) => (
        <div className="recovery-row" key={item.label}>
          <span>{item.label}</span>
          <div className="progress-track">
            <div style={{ width: `${item.value}%` }} />
          </div>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function TypeBreakdown({ sessions }: { sessions: TrainingSession[] }) {
  const totals = useMemo(() => {
    const grouped = sessions.reduce<Record<SessionType, number>>(
      (acc, session) => {
        acc[session.type] += getLoad(session);
        return acc;
      },
      { 跑步: 0, 力量: 0, 骑行: 0, 恢复: 0, 游泳: 0 },
    );
    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);

    return Object.entries(grouped)
      .map(([type, value]) => ({
        type: type as SessionType,
        value,
        percent: total > 0 ? Math.round((value / total) * 100) : 0,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [sessions]);

  return (
    <div className="breakdown-list">
      {totals.map((item) => (
        <div className="breakdown-item" key={item.type}>
          <div>
            <span className="type-dot" style={{ backgroundColor: typeColor[item.type] }} />
            <strong>{item.type}</strong>
          </div>
          <span>{item.percent}%</span>
          <div className="progress-track">
            <div style={{ backgroundColor: typeColor[item.type], width: `${item.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SessionTable({ sessions }: { sessions: TrainingSession[] }) {
  return (
    <div className="session-list">
      {sessions
        .slice()
        .reverse()
        .map((session) => (
          <article className="session-row" key={session.id}>
            <div className="session-main">
              <span className="session-date">{formatDate(session.date)}</span>
              <div>
                <strong>{session.title}</strong>
                <p>{session.notes}</p>
              </div>
            </div>
            <span className="type-chip" style={{ color: typeColor[session.type] }}>
              {session.type}
            </span>
            <span>{session.duration} 分钟</span>
            <span>RPE {session.rpe}</span>
            <strong>{getLoad(session)}</strong>
          </article>
        ))}
    </div>
  );
}

export default App;
