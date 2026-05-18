import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const territoryNames = {
  0: 'All areas',
  1: 'Charlotte Metro',
  2: 'Lake Norman',
  3: 'South Carolina',
  4: 'Triad',
};

const demoProjects = [
  { id: 1, job_number: 24001, project_name: 'Uptown Medical Office Shades', status: 'active', total_contract: 197000, territory_id: 1, territory_name: 'Charlotte Metro', company_name: 'Brookline Builders', project_manager_name: 'Maya Johnson', install_start_date: '2026-05-20', install_end_date: '2026-06-07' },
  { id: 2, job_number: 24002, project_name: 'Crescent South Apartments', status: 'active', total_contract: 340500, territory_id: 1, territory_name: 'Charlotte Metro', company_name: 'Crescent Property Group', project_manager_name: 'Maya Johnson', install_start_date: '2026-06-03', install_end_date: '2026-07-12' },
  { id: 3, job_number: 24003, project_name: 'Lake Norman Hotel Renovation', status: 'pending', total_contract: 226750, territory_id: 2, territory_name: 'Lake Norman', company_name: 'Lakeside Hospitality Partners', project_manager_name: 'Chris Walker', install_start_date: '2026-06-17', install_end_date: '2026-07-02' },
  { id: 4, job_number: 24004, project_name: 'Palmetto Surgical Center', status: 'active', total_contract: 157300, territory_id: 3, territory_name: 'South Carolina', company_name: 'Palmetto Commercial Interiors', project_manager_name: 'Maya Johnson', install_start_date: '2026-05-28', install_end_date: '2026-06-18' },
  { id: 5, job_number: 24005, project_name: 'Riverfront Condo Unit 4B', status: 'completed', total_contract: 30000, territory_id: 1, territory_name: 'Charlotte Metro', company_name: 'Brookline Builders', project_manager_name: 'Maya Johnson', install_start_date: '2026-02-03', install_end_date: '2026-02-05', completion_date: '2026-02-12' },
  { id: 6, job_number: 24006, project_name: 'Triad Multifamily Phase 1', status: 'active', total_contract: 402500, territory_id: 4, territory_name: 'Triad', company_name: 'Triad Multifamily Group', project_manager_name: 'Chris Walker', install_start_date: '2026-07-08', install_end_date: '2026-08-22' },
];

const demoMetrics = [
  { metric_month: '2026-03-01', revenue_earned_to_date: 352000, pipeline_value: 1150000, total_bid_value: 812000, bids_sent: 7 },
  { metric_month: '2026-04-01', revenue_earned_to_date: 618000, pipeline_value: 1498000, total_bid_value: 1245000, bids_sent: 9 },
  { metric_month: '2026-05-01', revenue_earned_to_date: 409400, pipeline_value: 1307500, total_bid_value: 1048000, bids_sent: 8 },
];

const statusLabels = {
  active: 'Active',
  pending: 'Pending',
  completed: 'Completed',
  hold: 'On Hold',
  unassigned: 'Unassigned',
};

function currency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function projectContractValue(project) {
  return Number(project.display_contract_value || project.total_contract || project.contract_value || project.original_contract || 0);
}

function monthLabel(value) {
  return new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString('en-US', { month: 'short' });
}

function shortDate(value) {
  if (!value) return 'Not scheduled';
  const iso = String(value).slice(0, 10);
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function getAreaName(id, fallback) {
  return territoryNames[id || 0] || fallback || 'Unassigned area';
}

function buildDashboard(projects, metrics = demoMetrics, areaId = 0) {
  const scoped = areaId ? projects.filter((project) => Number(project.territory_id) === Number(areaId)) : projects;
  const total = scoped.reduce((sum, project) => sum + projectContractValue(project), 0);
  const open = scoped.filter((project) => project.status !== 'completed');
  const completed = scoped.filter((project) => project.status === 'completed');
  const byStatus = Object.values(scoped.reduce((acc, project) => {
    const key = project.status || 'unassigned';
    acc[key] ||= { status: key, project_count: 0, contract_value: 0 };
    acc[key].project_count += 1;
    acc[key].contract_value += projectContractValue(project);
    return acc;
  }, {})).sort((a, b) => b.contract_value - a.contract_value);
  const byTerritory = Object.values(scoped.reduce((acc, project) => {
    const key = project.territory_id || 0;
    acc[key] ||= { territory_id: key, territory_name: project.territory_name, project_count: 0, contract_value: 0 };
    acc[key].project_count += 1;
    acc[key].contract_value += projectContractValue(project);
    return acc;
  }, {})).sort((a, b) => b.contract_value - a.contract_value);

  return {
    summary: {
      total_projects: scoped.length,
      open_projects: open.length,
      total_contract_value: total,
      open_contract_value: open.reduce((sum, project) => sum + projectContractValue(project), 0),
      completed_contract_value: completed.reduce((sum, project) => sum + projectContractValue(project), 0),
      average_project_value: scoped.length ? total / scoped.length : 0,
    },
    byStatus,
    byTerritory,
    recentProjects: scoped.slice(0, 12),
    projects: scoped,
    monthlyMetrics: metrics,
    bidSummary: [],
  };
}

function normalizeDashboard(apiDashboard, areaId) {
  const projects = apiDashboard?.projects?.length ? apiDashboard.projects : apiDashboard?.recentProjects || demoProjects;
  return {
    ...buildDashboard(projects, apiDashboard?.monthlyMetrics?.length ? apiDashboard.monthlyMetrics : demoMetrics, areaId),
    ...apiDashboard,
    projects,
    recentProjects: apiDashboard?.recentProjects?.length ? apiDashboard.recentProjects : projects.slice(0, 12),
    monthlyMetrics: apiDashboard?.monthlyMetrics?.length ? apiDashboard.monthlyMetrics : demoMetrics,
  };
}

function StatCard({ label, value, note }) {
  return (
    <section className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </section>
  );
}

function BarChart({ title, subtitle, data, valueKey, projectedKey }) {
  const max = Math.max(...data.flatMap((item) => [Number(item[valueKey] || 0), Number(item[projectedKey] || 0)]), 1);
  return (
    <section className="panel chart-panel">
      <div className="panel-head">
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>
      <div className="bar-chart">
        {data.map((item) => (
          <div className="bar-column" key={`${title}-${item.metric_month || item.bid_month}`}>
            <div className="bar-stack">
              {projectedKey && <span className="bar projected" style={{ height: `${(Number(item[projectedKey] || 0) / max) * 100}%` }} title={`Projected ${currency(item[projectedKey])}`} />}
              <span className="bar actual" style={{ height: `${(Number(item[valueKey] || 0) / max) * 100}%` }} title={currency(item[valueKey])} />
            </div>
            <strong>{monthLabel(item.metric_month || item.bid_month)}</strong>
            <small>{currency(item[valueKey])}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function compactMoney(value) {
  const number = Number(value || 0);
  if (Math.abs(number) >= 1000000) return `$${(number / 1000000).toFixed(2)}M`;
  if (Math.abs(number) >= 1000) return `$${(number / 1000).toFixed(0)}K`;
  return currency(number);
}

function sumValues(items, key) {
  return items.reduce((sum, item) => sum + Number(item[key] || 0), 0);
}

function formatRatio(value) {
  if (value === null || value === undefined || value === '') return '-';
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return '-';
  return `${(parsed * 100).toFixed(1)}%`;
}

function buildPerformanceModel(dashboard) {
  const metrics = dashboard.monthlyMetrics?.length ? dashboard.monthlyMetrics : demoMetrics;
  const latest = metrics[metrics.length - 1] || {};
  return [
    {
      label: 'Hit Rate',
      value: formatRatio(latest.hit_rate),
      note: 'Closed opportunity velocity',
    },
    {
      label: 'Capture Rate',
      value: formatRatio(latest.capture_rate),
      note: 'Sales capture efficiency',
    },
    {
      label: 'Installer Hours',
      value: `${Number(latest.installer_hours || 0).toFixed(0)}`,
      note: 'Latest reporting month',
    },
    {
      label: 'Profit / MH',
      value: currency(latest.profit_per_man_hour),
      note: 'Installation productivity',
    },
  ];
}

function buildFinanceModel(dashboard) {
  const metrics = dashboard.monthlyMetrics?.length ? dashboard.monthlyMetrics : demoMetrics;
  const projects = dashboard.projects || [];
  const revenueGoal = 9500000;
  const bidGoal = 130960000;
  const contractGoal = 12000000;
  const ytdRevenue = sumValues(metrics, 'total_won_value');
  const ytdBids = sumValues(metrics, 'total_bid_value');
  const ytdContracts = projects
    .filter((project) => project.status === 'completed' || project.status === 'active')
    .reduce((sum, project) => sum + projectContractValue(project), 0);
  const monthlyActual = metrics.map((metric) => ({
    label: monthLabel(metric.metric_month),
    rawDate: metric.metric_month,
    accrued: Number(metric.total_won_value || 0),
    pipeline: Number(metric.pipeline_value || 0),
    backlog: Number(metric.pipeline_value || 0) * 0.68,
  }));
  const lastActual = monthlyActual[monthlyActual.length - 1] || { accrued: 0, pipeline: 0, backlog: 0 };
  const remainingMonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const projected = remainingMonths.map((label, index) => ({
    label,
    rawDate: `2026-${String(index + 6).padStart(2, '0')}-01`,
    projectedRevenue: lastActual.accrued + ((revenueGoal - lastActual.accrued) / remainingMonths.length) * (index + 1),
  }));

  return {
    revenueGoal,
    bidGoal,
    contractGoal,
    pacing: [
      { label: 'Accrued Revenue', actual: ytdRevenue, goal: revenueGoal, color: 'teal' },
      { label: 'Total Bid $', actual: ytdBids, goal: bidGoal, color: 'green' },
      { label: 'Contract $ Wins', actual: ytdContracts, goal: contractGoal, color: 'yellow' },
    ],
    chart: {
      labels: [...monthlyActual.map((item) => item.label), ...projected.map((item) => item.label)],
      backlog: monthlyActual.map((item) => item.backlog),
      pipeline: monthlyActual.map((item) => item.pipeline),
      accruedActual: monthlyActual.map((item) => item.accrued),
      accruedProjected: [...Array(monthlyActual.length - 1).fill(null), lastActual.accrued, ...projected.map((item) => item.projectedRevenue)],
      goal: [...Array(monthlyActual.length + projected.length).fill(revenueGoal)],
    },
  };
}

function PacingGauge({ item }) {
  const percent = Math.max(0, Math.min(100, (Number(item.actual || 0) / Number(item.goal || 1)) * 100));
  const angle = -180 + (percent / 100) * 180;
  return (
    <section className={`pacing-card finance-${item.color}`}>
      <h3>{item.label}</h3>
      <div className="gauge" style={{ '--angle': `${angle}deg` }}>
        <div className="gauge-arc" />
        <div className="gauge-fill" />
        <div className="gauge-center">
          <strong>{percent.toFixed(1)}%</strong>
        </div>
      </div>
      <div className="pacing-meta">
        <div><span>YTD actual</span><strong>{compactMoney(item.actual)}</strong></div>
        <div><span>2026 goal</span><strong>{compactMoney(item.goal)}</strong></div>
        <div><span>% pacing</span><strong>{percent.toFixed(1)}%</strong></div>
      </div>
    </section>
  );
}

function LineChart({ model }) {
  const width = 1000;
  const height = 360;
  const padding = { top: 24, right: 28, bottom: 52, left: 68 };
  const series = [
    { key: 'backlog', label: 'Backlog', color: '#10e0c0', dashed: false },
    { key: 'pipeline', label: 'Pipeline (LOI)', color: '#ff62c7', dashed: false },
    { key: 'accruedActual', label: 'Accrued Revenue (Actual)', color: '#ffe100', dashed: false },
    { key: 'accruedProjected', label: 'Accrued Revenue (Projected)', color: '#39ff14', dashed: true },
    { key: 'goal', label: '2026 Revenue Goal', color: '#777', dashed: true },
  ];
  const allValues = series.flatMap((item) => model.chart[item.key]).filter((value) => value !== null && value !== undefined);
  const maxValue = Math.max(...allValues, 1);
  const minValue = 0;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const x = (index) => padding.left + (index / Math.max(model.chart.labels.length - 1, 1)) * plotWidth;
  const y = (value) => padding.top + (1 - (Number(value) - minValue) / (maxValue - minValue)) * plotHeight;
  const pathFor = (values) => values.reduce((path, value, index) => {
    if (value === null || value === undefined) return path;
    const command = path ? 'L' : 'M';
    return `${path} ${command} ${x(index).toFixed(1)} ${y(value).toFixed(1)}`;
  }, '');
  const ticks = [0, .25, .5, .75, 1].map((ratio) => maxValue * ratio);

  return (
    <section className="finance-chart-card">
      <div className="finance-kicker">Backlog, Pipeline & Revenue Trajectory</div>
      <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Revenue trajectory line chart">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={padding.left} x2={width - padding.right} y1={y(tick)} y2={y(tick)} className="grid-line" />
            <text x={padding.left - 10} y={y(tick) + 4} textAnchor="end" className="axis-label">{compactMoney(tick)}</text>
          </g>
        ))}
        {model.chart.labels.map((label, index) => (
          <g key={label}>
            <line x1={x(index)} x2={x(index)} y1={padding.top} y2={height - padding.bottom} className="grid-line vertical" />
            <text x={x(index)} y={height - 18} textAnchor="middle" className="axis-label">{label}</text>
          </g>
        ))}
        {series.map((item) => (
          <path key={item.key} d={pathFor(model.chart[item.key])} fill="none" stroke={item.color} strokeWidth="3" strokeDasharray={item.dashed ? '8 7' : '0'} />
        ))}
        {series.slice(0, 4).flatMap((item) => model.chart[item.key].map((value, index) => value === null || value === undefined ? null : (
          <circle key={`${item.key}-${index}`} cx={x(index)} cy={y(value)} r="5" fill={item.color} />
        )))}
      </svg>
      <div className="chart-legend">
        {series.map((item) => <span key={item.key}><i style={{ background: item.color }} />{item.label}</span>)}
      </div>
    </section>
  );
}

function FinancialDashboard({ dashboard }) {
  const finance = buildFinanceModel(dashboard);
  return (
    <div className="finance-dashboard">
      <div className="finance-kicker">2026 Pacing - Top-line Goals</div>
      <section className="pacing-grid">
        {finance.pacing.map((item) => <PacingGauge item={item} key={item.label} />)}
      </section>
      <LineChart model={finance} />
      <section className="finance-bottom-grid">
        <FinancialSide dashboard={dashboard} />
        <BarChart title="Bid Dollars Sent" subtitle="monthly estimating activity" data={dashboard.monthlyMetrics || demoMetrics} valueKey="total_bid_value" />
      </section>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('maya.pm@jamesblinds.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to log in.');
      onLogin(body.user);
    } catch (err) {
      setError(`${err.message} Showing demo dashboard data.`);
      onLogin({ id: 'demo', name: 'Project Manager', email, role: 'project_manager', territoryId: 1, demo: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-hero">
        <p>James Blinds</p>
        <h1>Mission Control</h1>
        <span>Role-aware operations dashboard for projects, calendars, financials, and bid activity.</span>
      </section>
      <form className="login-panel" onSubmit={submit}>
        <p>Secure sign in</p>
        <h2>Open your dashboard</h2>
        <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <div className="error">{error}</div>}
        <button disabled={loading} type="submit">{loading ? 'Signing in...' : 'Log in'}</button>
      </form>
    </main>
  );
}

function DashboardHome({ dashboard }) {
  const summary = dashboard.summary;
  const metrics = dashboard.monthlyMetrics || demoMetrics;
  const bidData = dashboard.bidSummary?.length
    ? dashboard.bidSummary.map((item) => ({ ...item, metric_month: item.bid_month, total_bid_value: item.bid_dollars }))
    : metrics;
  const performanceMetrics = buildPerformanceModel(dashboard);

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Open Contract Value" value={currency(summary.open_contract_value)} note={`${summary.open_projects} active or pending jobs`} />
        <StatCard label="Total Pipeline" value={currency(summary.total_contract_value)} note={`${summary.total_projects} projects in view`} />
        <StatCard label="Completed Revenue" value={currency(summary.completed_contract_value)} note="Closed work in this area" />
        <StatCard label="Average Job" value={currency(summary.average_project_value)} note="Typical contract value" />
      </section>
      <section className="stats-grid performance-grid">
        {performanceMetrics.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} note={item.note} />
        ))}
      </section>
      <section className="charts-grid">
        <BarChart title="Revenue Over Year" subtitle="earned vs projected pipeline" data={metrics} valueKey="total_won_value" projectedKey="pipeline_value" />
        <BarChart title="Bid Dollars Sent" subtitle="monthly estimating activity" data={bidData} valueKey="total_bid_value" />
      </section>
      <section className="content-grid">
        <ProjectTable projects={dashboard.recentProjects || []} compact />
        <FinancialSide dashboard={dashboard} />
      </section>
    </>
  );
}

const SUB_COLORS = { measure: '#6c8ebf', install: '#2a9d8f', punch: '#e09c4a' };

function ProjectTable({ projects, compact = false }) {
  return (
    <section className="panel table-panel">
      <div className="panel-head">
        <h2>{compact ? 'Current Projects' : 'All Projects'}</h2>
        <span>{projects.length} shown</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Job</th>
            <th>Project</th>
            <th>Area</th>
            <th>Status</th>
            <th>Install</th>
            <th>Contract</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.job_number || '-'}</td>
              <td><strong>{project.project_name}</strong><small>{project.company_name || project.project_manager_name || 'No company assigned'}</small></td>
              <td>{getAreaName(project.territory_id, project.territory_name)}</td>
              <td><span className={`badge badge-${project.status || 'unassigned'}`}>{statusLabels[project.status] || project.status || 'Unassigned'}</span></td>
              <td>{shortDate(project.install_start_date)}</td>
              <td>{currency(projectContractValue(project))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function FinancialSide({ dashboard }) {
  const max = Math.max(...(dashboard.byTerritory || []).map((area) => Number(area.contract_value)), 1);
  return (
    <div className="side-stack">
      <section className="panel">
        <div className="panel-head"><h2>Area Financials</h2><span>Contract value by territory</span></div>
        <div className="area-list">
          {(dashboard.byTerritory || []).map((area) => (
            <div className="area-row" key={area.territory_id}>
              <div><strong>{getAreaName(area.territory_id, area.territory_name)}</strong><small>{area.project_count} projects</small></div>
              <div className="bar-track"><span style={{ width: `${(Number(area.contract_value) / max) * 100}%` }} /></div>
              <strong>{currency(area.contract_value)}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Status Money</h2><span>Where value sits</span></div>
        <div className="status-list">
          {(dashboard.byStatus || []).map((item) => (
            <div className="status-row" key={item.status}>
              <span className={`badge badge-${item.status}`}>{statusLabels[item.status] || item.status}</span>
              <strong>{currency(item.contract_value)}</strong>
              <small>{item.project_count} jobs</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Scheduling: Monthly Gantt ──────────────────────────────────────────────

function MonthlyGantt({ projects, subprojects }) {
  const today = new Date();
  const [startMonth, setStartMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const MONTHS = 6;

  const months = Array.from({ length: MONTHS }, (_, i) => {
    const d = new Date(startMonth);
    d.setMonth(d.getMonth() + i);
    return d;
  });

  const totalDays = (start, end) => {
    if (!start || !end) return 0;
    return Math.max(0, Math.round((new Date(end) - new Date(start)) / 86400000) + 1);
  };

  // build a flat list: projects with their subprojects as child rows
  const rows = projects.flatMap((p) => {
    const subs = subprojects.filter((s) => s.project_id === p.id);
    const hasSubs = subs.length > 0;
    return [
      { ...p, _type: 'project', _hasSubs: hasSubs },
      ...subs.map((s) => ({ ...s, _type: 'sub', project_name: p.project_name })),
    ];
  });

  const rangeStart = months[0];
  const rangeEnd   = new Date(months[MONTHS - 1].getFullYear(), months[MONTHS - 1].getMonth() + 1, 0);
  const rangeDays  = totalDays(rangeStart, rangeEnd) || 1;

  function barStyle(startStr, endStr, color) {
    if (!startStr) return null;
    const s = new Date(startStr);
    const e = endStr ? new Date(endStr) : s;
    if (e < rangeStart || s > rangeEnd) return null;
    const clampS = s < rangeStart ? rangeStart : s;
    const clampE = e > rangeEnd   ? rangeEnd   : e;
    const left  = (totalDays(rangeStart, clampS) - 1) / rangeDays * 100;
    const width = Math.max(0.5, totalDays(clampS, clampE) / rangeDays * 100);
    return { left: `${left}%`, width: `${width}%`, background: color || 'var(--brand)' };
  }

  const todayPct = totalDays(rangeStart, today) / rangeDays * 100;

  return (
    <div className="gantt-wrap">
      <div className="gantt-header">
        <div className="gantt-label-col" />
        {months.map((m) => (
          <div key={m.toISOString()} className="gantt-month-label">
            {m.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          </div>
        ))}
      </div>

      <div className="gantt-body">
        {/* today line */}
        <div className="gantt-today-line" style={{ left: `calc(200px + ${todayPct}% * ((100% - 200px) / 100))` }} />

        {rows.map((row) => {
          if (row._type === 'project') {
            const style = barStyle(row.install_start_date, row.install_end_date, 'var(--brand)');
            return (
              <div key={`p-${row.id}`} className="gantt-row gantt-project-row">
                <div className="gantt-label">
                  <strong>{row.project_name}</strong>
                  <small>{getAreaName(row.territory_id, row.territory_name)}</small>
                </div>
                <div className="gantt-track">
                  {style && <div className="gantt-bar" style={style}>{shortDate(row.install_start_date)}</div>}
                  {!row.install_start_date && <span className="gantt-tbd">TBD</span>}
                </div>
              </div>
            );
          }
          // subproject row
          const color = SUB_COLORS[row.type] || '#999';
          const style = barStyle(row.start_date, row.end_date, color);
          return (
            <div key={`s-${row.id}`} className="gantt-row gantt-sub-row">
              <div className="gantt-label gantt-sub-label">
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: color, marginRight: 5 }} />
                {row.label || row.type}
                {row.complete && <span className="gantt-done-badge">✓</span>}
              </div>
              <div className="gantt-track">
                {style && <div className="gantt-bar gantt-sub-bar" style={style} />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="gantt-nav">
        <button type="button" onClick={() => setStartMonth(new Date(startMonth.getFullYear(), startMonth.getMonth() - 1, 1))}>← Back</button>
        <button type="button" onClick={() => setStartMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>Today</button>
        <button type="button" onClick={() => setStartMonth(new Date(startMonth.getFullYear(), startMonth.getMonth() + 1, 1))}>Forward →</button>
      </div>
    </div>
  );
}

// ─── Scheduling: Daily View ──────────────────────────────────────────────────

function DailyView({ projects }) {
  const [anchor, setAnchor] = useState(new Date());
  const key = isoDate(anchor);

  const active = projects.filter((p) => {
    if (!p.install_start_date || !p.install_end_date) return false;
    return p.install_start_date <= key && p.install_end_date >= key;
  });

  const starting = projects.filter((p) => p.install_start_date === key);
  const ending   = projects.filter((p) => p.install_end_date   === key);

  function move(days) {
    const d = new Date(anchor);
    d.setDate(d.getDate() + days);
    setAnchor(d);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="panel" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={() => move(-1)}>← Prev</button>
          <h2 style={{ margin: 0, fontSize: 18 }}>
            {anchor.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          <button type="button" onClick={() => setAnchor(new Date())}>Today</button>
          <button type="button" onClick={() => move(1)}>Next →</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <section className="panel">
          <div className="panel-head"><h2>Active On Site</h2><span>{active.length} jobs</span></div>
          {active.length === 0 && <p style={{ padding: '12px 18px', color: 'var(--muted)', fontSize: 13 }}>No active installs</p>}
          {active.map((p) => (
            <div key={p.id} style={{ padding: '10px 18px', borderBottom: '1px solid var(--line)' }}>
              <strong style={{ display: 'block', fontSize: 13 }}>{p.project_name}</strong>
              <small style={{ color: 'var(--muted)' }}>{getAreaName(p.territory_id, p.territory_name)} · through {shortDate(p.install_end_date)}</small>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-head"><h2>Starting Today</h2><span>{starting.length}</span></div>
          {starting.length === 0 && <p style={{ padding: '12px 18px', color: 'var(--muted)', fontSize: 13 }}>None</p>}
          {starting.map((p) => (
            <div key={p.id} style={{ padding: '10px 18px', borderBottom: '1px solid var(--line)' }}>
              <strong style={{ display: 'block', fontSize: 13 }}>{p.project_name}</strong>
              <small style={{ color: 'var(--green)' }}>Install begins · {currency(projectContractValue(p))}</small>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-head"><h2>Wrapping Up</h2><span>{ending.length}</span></div>
          {ending.length === 0 && <p style={{ padding: '12px 18px', color: 'var(--muted)', fontSize: 13 }}>None</p>}
          {ending.map((p) => (
            <div key={p.id} style={{ padding: '10px 18px', borderBottom: '1px solid var(--line)' }}>
              <strong style={{ display: 'block', fontSize: 13 }}>{p.project_name}</strong>
              <small style={{ color: 'var(--muted)' }}>Install end date</small>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

// ─── Scheduling: Installer Calendar ─────────────────────────────────────────

const STATUS_DOT = { 'on-site': '#2a9d8f', staging: '#e09c4a', pending: '#aaa', 'wrap-up': '#6c8ebf' };

function InstallerCalendar({ areaId }) {
  const [installers, setInstallers] = useState(null);
  const [anchor, setAnchor]         = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d;
  });

  useEffect(() => {
    fetch('/api/installers', { credentials: 'include' })
      .then((r) => r.json())
      .then((rows) => setInstallers(rows))
      .catch(() => setInstallers([]));
  }, []);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(anchor); d.setDate(anchor.getDate() + i); return d;
  });

  const todayStr = isoDate(new Date());

  const filtered = installers
    ? (areaId ? installers.filter((ins) => {
        const tName = typeof areaId === 'number'
          ? Object.values({ 1: 'Charlotte Metro', 2: 'Lake Norman', 3: 'South Carolina', 4: 'Triad' })[areaId - 1]
          : null;
        return !tName || ins.territory_name === tName;
      }) : installers)
    : [];

  function isActive(ins, dayStr) {
    if (!ins.install_start_date || !ins.install_end_date) return false;
    return ins.install_start_date <= dayStr && ins.install_end_date >= dayStr;
  }

  function prevWeek() { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d); }
  function nextWeek() { const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d); }
  function goToday()  { const d = new Date(); d.setDate(d.getDate() - d.getDay()); setAnchor(d); }

  if (installers === null) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading installers…</div>;

  return (
    <div className="panel" style={{ overflow: 'auto' }}>
      <div className="panel-head">
        <h2>Installer Calendar</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={prevWeek}>← Prev week</button>
          <button type="button" onClick={goToday}>This week</button>
          <button type="button" onClick={nextWeek}>Next week →</button>
        </div>
      </div>

      <table className="installer-cal-table">
        <thead>
          <tr>
            <th style={{ width: 160 }}>Installer</th>
            {days.map((d) => {
              const str = isoDate(d);
              const isToday = str === todayStr;
              return (
                <th key={str} style={{ textAlign: 'center', background: isToday ? 'color-mix(in srgb, var(--brand) 10%, transparent)' : undefined }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--brand)' : 'var(--ink)' }}>{d.getDate()}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={8} style={{ padding: '20px', color: 'var(--muted)', textAlign: 'center', fontSize: 13 }}>No installers found for this area.</td></tr>
          )}
          {filtered.map((ins) => (
            <tr key={ins.id}>
              <td style={{ padding: '8px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_DOT[ins.status] || '#aaa', flexShrink: 0, display: 'inline-block' }} />
                  <div>
                    <strong style={{ fontSize: 12, display: 'block' }}>{ins.name}</strong>
                    <small style={{ color: 'var(--muted)', fontSize: 10 }}>{ins.territory_name || '—'}</small>
                  </div>
                </div>
              </td>
              {days.map((d) => {
                const str    = isoDate(d);
                const active = isActive(ins, str);
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                return (
                  <td key={str} style={{
                    textAlign: 'center', padding: '6px 4px', fontSize: 11,
                    background: isWeekend ? 'color-mix(in srgb, var(--line) 30%, transparent)' : undefined,
                  }}>
                    {active && (
                      <div style={{
                        background: 'var(--brand)', color: '#fff',
                        borderRadius: 4, padding: '3px 6px', fontSize: 10,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        maxWidth: 90, margin: '0 auto',
                      }} title={ins.current_job}>
                        {ins.current_job ? ins.current_job.split(' ').slice(0, 2).join(' ') : 'On site'}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', display: 'flex', gap: 16, fontSize: 11, color: 'var(--muted)' }}>
        {Object.entries({ 'on-site': 'On site', staging: 'Staging', pending: 'Pending', 'wrap-up': 'Wrap-up' }).map(([k, v]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_DOT[k], display: 'inline-block' }} />{v}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Scheduling: outer shell with view switcher ──────────────────────────────

function CalendarView({ projects, areaId }) {
  const [schedView, setSchedView] = useState('calendar');
  const [subprojects, setSubprojects] = useState([]);

  useEffect(() => {
    fetch('/api/subprojects', { credentials: 'include' })
      .then((r) => r.json())
      .then(setSubprojects)
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[['calendar', 'Month Calendar'], ['monthly', 'Monthly Gantt'], ['daily', 'Daily'], ['installers', 'Installer Calendar']].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSchedView(id)}
            style={{
              padding: '6px 18px', fontSize: 13, borderRadius: 6,
              background: schedView === id ? 'var(--brand)' : 'transparent',
              color: schedView === id ? '#fff' : 'var(--muted)',
              border: schedView === id ? 'none' : '1px solid var(--line)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {schedView === 'monthly'    && <MonthlyGantt      projects={projects} subprojects={subprojects} />}
      {schedView === 'daily'      && <DailyView         projects={projects} />}
      {schedView === 'calendar'   && <LegacyCalendar    projects={projects} />}
      {schedView === 'installers' && <InstallerCalendar areaId={areaId} />}
    </div>
  );
}

function LegacyCalendar({ projects }) {
  const [anchor, setAnchor] = useState(new Date());
  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart  = new Date(monthStart);
  gridStart.setDate(1 - monthStart.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
  const events = projects.flatMap((p) => [
    p.install_start_date && { date: p.install_start_date, type: 'Install Start', project: p },
    p.install_end_date   && { date: p.install_end_date,   type: 'Install End',   project: p },
    p.completion_date    && { date: p.completion_date,    type: 'Complete',      project: p },
  ].filter(Boolean));

  return (
    <section className="calendar-layout">
      <div className="panel calendar-board">
        <div className="panel-head">
          <h2>{anchor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div className="calendar-actions">
            <button type="button" onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1))}>Prev</button>
            <button type="button" onClick={() => setAnchor(new Date())}>Today</button>
            <button type="button" onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1))}>Next</button>
          </div>
        </div>
        <div className="weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => <span key={d}>{d}</span>)}</div>
        <div className="calendar-grid">
          {days.map((day) => {
            const k = isoDate(day);
            const dayEvents = events.filter((e) => e.date === k);
            return (
              <div className={day.getMonth() === anchor.getMonth() ? 'day' : 'day muted-day'} key={k}>
                <strong>{day.getDate()}</strong>
                {dayEvents.slice(0, 3).map((ev) => (
                  <span className={`calendar-event event-${ev.type.replaceAll(' ','-').toLowerCase()}`} key={`${ev.type}-${ev.project.id}`}>
                    {ev.type}: {ev.project.job_number || ev.project.project_name}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <section className="panel agenda-panel">
        <div className="panel-head"><h2>Calendar List</h2><span>{events.length} milestones</span></div>
        <div className="agenda-list">
          {events.sort((a, b) => a.date.localeCompare(b.date)).map((ev) => (
            <div className="agenda-item" key={`${ev.date}-${ev.type}-${ev.project.id}`}>
              <span className="badge badge-active">{ev.type}</span>
              <div><strong>{ev.project.project_name}</strong><small>{shortDate(ev.date)} · {getAreaName(ev.project.territory_id, ev.project.territory_name)}</small></div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

// ─── Demo data for PM views ────────────────────────────────────────────────

const demoInstallers = [
  { id: 1, name: 'Marcus Webb',    territory_name: 'Charlotte Metro', current_job: 'Uptown Medical Office Shades',  ytd_hours: 680, efficiency_rating: 0.94, overtime_hours: 24, status: 'on-site'  },
  { id: 2, name: 'Devon Clark',    territory_name: 'Charlotte Metro', current_job: 'Crescent South Apartments',      ytd_hours: 540, efficiency_rating: 0.88, overtime_hours: 40, status: 'on-site'  },
  { id: 7, name: 'Darrell Price',  territory_name: 'Charlotte Metro', current_job: 'Ballantyne Corporate Park Ph.3', ytd_hours: 610, efficiency_rating: 0.91, overtime_hours: 32, status: 'staging'  },
  { id: 3, name: 'Jake Norris',    territory_name: 'Lake Norman',     current_job: 'Huntersville Luxury Apartments', ytd_hours: 520, efficiency_rating: 0.96, overtime_hours:  8, status: 'on-site'  },
  { id: 8, name: 'Carlos Vega',    territory_name: 'Lake Norman',     current_job: 'Lake Norman Hotel Renovation',   ytd_hours: 380, efficiency_rating: 0.89, overtime_hours: 22, status: 'pending'  },
  { id: 4, name: 'Trevor Shaw',    territory_name: 'South Carolina',  current_job: 'Palmetto Surgical Center',       ytd_hours: 390, efficiency_rating: 0.82, overtime_hours: 56, status: 'on-site'  },
  { id: 9, name: 'Jermaine Ellis', territory_name: 'South Carolina',  current_job: 'Palmetto Surgical Center',       ytd_hours: 330, efficiency_rating: 0.93, overtime_hours: 12, status: 'on-site'  },
  { id: 5, name: 'Luis Herrera',   territory_name: 'Triad',           current_job: 'Triad Multifamily Phase 1',      ytd_hours: 480, efficiency_rating: 0.97, overtime_hours:  0, status: 'on-site'  },
  { id: 6, name: 'Ryan Potts',     territory_name: 'Triad',           current_job: 'Triad Multifamily Phase 1',      ytd_hours: 310, efficiency_rating: 0.79, overtime_hours: 64, status: 'on-site'  },
  { id:10, name: 'Anthony Greene', territory_name: 'Triad',           current_job: 'Greensboro Medical Complex',     ytd_hours: 570, efficiency_rating: 0.85, overtime_hours: 38, status: 'wrap-up'  },
];

const installerJobHistory = {
  1:  [
    { job: 'Uptown Medical Office Shades',      role: 'Lead Installer', start: '2026-04-28', end: null,         hours: 180, status: 'active'    },
    { job: 'Riverfront Condo Unit 4B',           role: 'Lead Installer', start: '2026-01-28', end: '2026-02-12', hours:  64, status: 'completed' },
    { job: 'South End Retail Pilot',             role: 'Lead Installer', start: '2025-11-10', end: '2025-12-04', hours: 112, status: 'completed' },
  ],
  2:  [
    { job: 'Crescent South Apartments',          role: 'Installer',      start: '2026-04-15', end: null,         hours: 210, status: 'active'    },
    { job: 'Uptown Medical Office Shades',       role: 'Installer',      start: '2026-03-01', end: '2026-04-14', hours: 148, status: 'completed' },
    { job: 'Ballantyne Office Complex',          role: 'Installer',      start: '2026-01-06', end: '2026-02-18', hours: 120, status: 'completed' },
  ],
  3:  [
    { job: 'Huntersville Luxury Apartments',     role: 'Lead Installer', start: '2026-04-07', end: null,         hours: 190, status: 'active'    },
    { job: 'Lake Norman Hotel Pre-Renovation',   role: 'Installer',      start: '2026-01-15', end: '2026-02-28', hours: 144, status: 'completed' },
  ],
  4:  [
    { job: 'Palmetto Surgical Center',           role: 'Lead Installer', start: '2026-04-22', end: null,         hours: 156, status: 'active'    },
    { job: 'Columbia Office Complex Shades',     role: 'Installer',      start: '2026-02-10', end: '2026-03-15', hours: 138, status: 'completed' },
    { job: 'Greenville Clinic Phase 1',          role: 'Lead Installer', start: '2025-10-14', end: '2025-11-30', hours:  96, status: 'completed' },
  ],
  5:  [
    { job: 'Triad Multifamily Phase 1',          role: 'Lead Installer', start: '2026-04-01', end: null,         hours: 195, status: 'active'    },
    { job: 'Greensboro Medical Complex Ph.1',    role: 'Installer',      start: '2026-01-12', end: '2026-03-20', hours: 185, status: 'completed' },
    { job: 'Winston-Salem Office Suite',         role: 'Lead Installer', start: '2025-09-08', end: '2025-10-31', hours: 100, status: 'completed' },
  ],
  6:  [
    { job: 'Triad Multifamily Phase 1',          role: 'Installer',      start: '2026-04-01', end: null,         hours: 140, status: 'active'    },
    { job: 'Greensboro Tech Park Phase 1',       role: 'Installer',      start: '2026-02-01', end: '2026-03-15', hours: 104, status: 'completed' },
  ],
  7:  [
    { job: 'Ballantyne Corporate Park Ph.3',     role: 'Lead Installer', start: '2026-05-01', end: null,         hours:  95, status: 'active'    },
    { job: 'Crescent South Apartments',          role: 'Installer',      start: '2026-03-10', end: '2026-04-30', hours: 210, status: 'completed' },
    { job: 'Midtown Office Shades',              role: 'Installer',      start: '2026-01-05', end: '2026-02-28', hours: 162, status: 'completed' },
  ],
  8:  [
    { job: 'Lake Norman Hotel Renovation',       role: 'Installer',      start: '2026-05-05', end: null,         hours:  68, status: 'active'    },
    { job: 'Cornelius Retail Build-Out',         role: 'Lead Installer', start: '2026-02-15', end: '2026-03-28', hours: 168, status: 'completed' },
  ],
  9:  [
    { job: 'Palmetto Surgical Center',           role: 'Installer',      start: '2026-04-22', end: null,         hours: 138, status: 'active'    },
    { job: 'Charleston Corporate Suites',        role: 'Installer',      start: '2026-01-20', end: '2026-03-10', hours: 124, status: 'completed' },
  ],
  10: [
    { job: 'Greensboro Medical Complex',         role: 'Lead Installer', start: '2026-04-14', end: null,         hours: 225, status: 'active'    },
    { job: 'Triad Multifamily Phase 1',          role: 'Installer',      start: '2026-01-12', end: '2026-04-01', hours: 205, status: 'completed' },
    { job: 'Winston-Salem Outpatient Pilot',     role: 'Installer',      start: '2025-11-03', end: '2025-12-20', hours:  96, status: 'completed' },
  ],
};

const demoBids = [
  { id: 1, project_name: 'South End Retail Shell Shades',       company_name: 'Brookline Builders',            territory_name: 'Charlotte Metro', bid_date: '2026-05-04', bid_amount:  96500, estimated_gp: 33775, estimated_hours:  410, bid_status: 'sent',     won: false },
  { id: 2, project_name: 'Crescent North Phase 2',              company_name: 'Crescent Property Group',       territory_name: 'Charlotte Metro', bid_date: '2026-04-22', bid_amount: 288000, estimated_gp:100800, estimated_hours: 1120, bid_status: 'awarded',  won: true  },
  { id: 3, project_name: 'Greenville Clinic Fit-Out',           company_name: 'Palmetto Commercial Interiors', territory_name: 'South Carolina',  bid_date: '2026-05-09', bid_amount: 121400, estimated_gp: 42490, estimated_hours:  520, bid_status: 'pending',  won: false },
  { id: 4, project_name: 'Greensboro Tech Park Office Shades',  company_name: 'Triad Multifamily Group',       territory_name: 'Triad',           bid_date: '2026-04-15', bid_amount: 178500, estimated_gp: 62475, estimated_hours:  740, bid_status: 'pending',  won: false },
  { id: 5, project_name: 'Lake Norman Corporate Suites',        company_name: 'Lakeside Hospitality Partners', territory_name: 'Lake Norman',     bid_date: '2026-03-28', bid_amount: 156000, estimated_gp: 54600, estimated_hours:  650, bid_status: 'awarded',  won: true  },
  { id: 6, project_name: 'South End Luxury Condos Ph.1',        company_name: 'Brookline Builders',            territory_name: 'Charlotte Metro', bid_date: '2026-04-08', bid_amount: 208000, estimated_gp: 72800, estimated_hours:  880, bid_status: 'sent',     won: false },
  { id: 7, project_name: 'Columbia Office Complex Shades',      company_name: 'Palmetto Commercial Interiors', territory_name: 'South Carolina',  bid_date: '2026-03-14', bid_amount:  94500, estimated_gp: 33075, estimated_hours:  400, bid_status: 'declined', won: false },
  { id: 8, project_name: 'Winston-Salem Outpatient Center',     company_name: 'Greensboro Medical Properties', territory_name: 'Triad',           bid_date: '2026-05-12', bid_amount: 213000, estimated_gp: 74550, estimated_hours:  890, bid_status: 'sent',     won: false },
];

const demoBillings = [
  { job_number: 24001, project_name: 'Uptown Medical Office Shades',  company_name: 'Brookline Builders',            territory_name: 'Charlotte Metro', billing_month: '2026-05-01', bill_this_month: 31800, total_billed:  83800, remaining_to_bill: 113200, percent_complete: 0.42, invoice_sent: true,  qbo_invoice_number: 'INV-24001-05'   },
  { job_number: 24002, project_name: 'Crescent South Apartments',      company_name: 'Crescent Property Group',       territory_name: 'Charlotte Metro', billing_month: '2026-05-01', bill_this_month: 31500, total_billed: 105500, remaining_to_bill: 235000, percent_complete: 0.31, invoice_sent: false, qbo_invoice_number: null              },
  { job_number: 24003, project_name: 'Lake Norman Hotel Renovation',   company_name: 'Lakeside Hospitality Partners', territory_name: 'Lake Norman',     billing_month: null,         bill_this_month:     0, total_billed:      0, remaining_to_bill: 226750, percent_complete:    0, invoice_sent: false, qbo_invoice_number: null              },
  { job_number: 24004, project_name: 'Palmetto Surgical Center',       company_name: 'Palmetto Commercial Interiors', territory_name: 'South Carolina',  billing_month: '2026-05-01', bill_this_month: 45388, total_billed:  88188, remaining_to_bill:  69112, percent_complete: 0.56, invoice_sent: true,  qbo_invoice_number: 'INV-24004-05'   },
  { job_number: 24005, project_name: 'Riverfront Condo Unit 4B',       company_name: 'Brookline Builders',            territory_name: 'Charlotte Metro', billing_month: '2026-02-01', bill_this_month:  5000, total_billed:  30000, remaining_to_bill:      0, percent_complete:  1.0, invoice_sent: true,  qbo_invoice_number: 'INV-24005-FINAL'},
  { job_number: 24006, project_name: 'Triad Multifamily Phase 1',      company_name: 'Triad Multifamily Group',       territory_name: 'Triad',           billing_month: '2026-05-01', bill_this_month: 80500, total_billed:  80500, remaining_to_bill: 322000, percent_complete: 0.20, invoice_sent: false, qbo_invoice_number: null              },
];

const demoCustomers = [
  { id: 1, company_name: 'Brookline Builders',            territory_name: 'Charlotte Metro', company_type: 'General Contractor', contact_name: 'Jordan Miles',   contact_title: 'Senior PM',            phone: '704-555-0201', active_projects: 3, total_value: 511800, last_interaction: '2026-05-10', interaction_type: 'Site Meeting'    },
  { id: 2, company_name: 'Crescent Property Group',        territory_name: 'Charlotte Metro', company_type: 'Developer',          contact_name: 'Priya Shah',     contact_title: 'Development Manager',  phone: '704-555-0202', active_projects: 1, total_value: 340500, last_interaction: '2026-05-12', interaction_type: 'Billing Call'    },
  { id: 3, company_name: 'Lakeside Hospitality Partners',  territory_name: 'Lake Norman',     company_type: 'Owner',              contact_name: 'Elliot Park',    contact_title: 'Owner Rep',            phone: '704-555-0203', active_projects: 1, total_value: 226750, last_interaction: '2026-04-28', interaction_type: 'Email'           },
  { id: 4, company_name: 'Palmetto Commercial Interiors',  territory_name: 'South Carolina',  company_type: 'General Contractor', contact_name: 'Sara Bennett',   contact_title: 'Operations Director',  phone: '803-555-0204', active_projects: 1, total_value: 157300, last_interaction: '2026-05-14', interaction_type: 'Schedule Update' },
  { id: 5, company_name: 'Triad Multifamily Group',        territory_name: 'Triad',           company_type: 'Developer',          contact_name: 'Ryan Cooper',    contact_title: 'Project Executive',    phone: '336-555-0210', active_projects: 1, total_value: 402500, last_interaction: '2026-04-18', interaction_type: 'Contract Review' },
  { id: 6, company_name: 'SouthPark Capital Partners',     territory_name: 'Charlotte Metro', company_type: 'Developer',          contact_name: 'Marcus Finley',  contact_title: 'VP of Construction',   phone: '704-555-0205', active_projects: 1, total_value: 145000, last_interaction: '2026-05-08', interaction_type: 'Kickoff Meeting' },
  { id: 7, company_name: 'Huntersville Residential',       territory_name: 'Lake Norman',     company_type: 'Developer',          contact_name: 'Tyler Drummond', contact_title: 'Construction Manager', phone: '704-555-0207', active_projects: 1, total_value: 412000, last_interaction: '2026-05-01', interaction_type: 'Site Walk'       },
];

// ─── Shared PM helpers ─────────────────────────────────────────────────────

function PmBar({ label, value, max, color = 'var(--brand)', sub }) {
  const pct = max ? Math.min(100, (Number(value) / Number(max)) * 100) : 0;
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span>{label}</span><strong style={{ color }}>{sub || currency(value)}</strong>
      </div>
      <div style={{ height: 7, borderRadius: 999, background: '#e8edf0', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 'inherit', background: color, width: `${pct}%` }} />
      </div>
    </div>
  );
}

function PlaceholderView({ title, icon, description }) {
  return (
    <section className="panel" style={{ margin: '40px auto', maxWidth: 520, padding: 64, textAlign: 'center' }}>
      <div style={{ fontSize: 52, marginBottom: 20, opacity: .65 }}>{icon}</div>
      <h2 style={{ margin: '0 0 12px', fontSize: 24 }}>{title}</h2>
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7, fontSize: 15 }}>{description}</p>
    </section>
  );
}

// ─── PM Views ──────────────────────────────────────────────────────────────

function InstallerProfile({ installer, onClose }) {
  const history  = installerJobHistory[installer.id] || [];
  const effColor = (v) => v >= 0.9 ? 'var(--green)' : v >= 0.8 ? 'var(--orange)' : 'var(--red)';
  const col      = effColor(installer.efficiency_rating);
  function initials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2).toUpperCase();
  }
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div className="detail-avatar">{initials(installer.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 20 }}>{installer.name}</h2>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-active">{installer.territory_name}</span>
              <span className={`badge badge-${installer.status === 'on-site' ? 'active' : installer.status === 'pending' ? 'pending' : 'completed'}`}>{installer.status}</span>
            </div>
          </div>
          <button onClick={onClose} type="button" className="close-btn">✕</button>
        </div>

        <div className="detail-stats">
          <div className="stat"><span>YTD Hours</span><strong>{installer.ytd_hours}h</strong><small>Field hours logged</small></div>
          <div className="stat"><span>Efficiency</span><strong style={{ color: col }}>{formatRatio(installer.efficiency_rating)}</strong><small>Performance rating</small></div>
          <div className="stat"><span>OT Hours</span><strong style={{ color: installer.overtime_hours > 40 ? 'var(--red)' : 'inherit' }}>{installer.overtime_hours}h</strong><small>{installer.overtime_hours > 40 ? 'High — review needed' : 'Within normal range'}</small></div>
        </div>

        <div className="detail-body">
          <div className="detail-section-label">Current Assignment</div>
          <div className="detail-job-chip">{installer.current_job || 'Unassigned'}</div>

          {history.length > 0 && (
            <>
              <div className="detail-section-label" style={{ marginTop: 22 }}>Job History</div>
              <table>
                <thead>
                  <tr><th>Project</th><th>Role</th><th>Dates</th><th>Hrs</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {history.map((job, i) => (
                    <tr key={i}>
                      <td><strong style={{ fontSize: 13 }}>{job.job}</strong></td>
                      <td style={{ fontSize: 12 }}>{job.role}</td>
                      <td><small>{shortDate(job.start)}{job.end ? ` – ${shortDate(job.end)}` : ' – Present'}</small></td>
                      <td>{job.hours}h</td>
                      <td><span className={`badge badge-${job.status === 'active' ? 'active' : 'completed'}`}>{job.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Material Tracking Board ─────────────────────────────────────────────────

const MATERIAL_STAGES = [
  { id: 'schedule_calls', label: 'Schedule Calls',  color: '#6c8ebf' },
  { id: 'measures',       label: 'Measures',         color: '#e09c4a' },
  { id: 'orders',         label: 'Orders',           color: '#9b59b6' },
  { id: 'deliveries',     label: 'Deliveries',       color: '#2980b9' },
  { id: 'in_stock',       label: 'In Stock',         color: '#2a9d8f' },
];

function MaterialCard({ item, onMove, onDelete }) {
  const stageIdx  = MATERIAL_STAGES.findIndex((s) => s.id === item.stage);
  const canBack   = stageIdx > 0;
  const canForward = stageIdx < MATERIAL_STAGES.length - 1;

  return (
    <div className="mat-card">
      <div className="mat-card-head">
        <strong>{item.project_name || item.linked_project_name || 'Unnamed'}</strong>
        <button type="button" onClick={() => onDelete(item.id)} className="mat-del-btn">✕</button>
      </div>
      {item.city        && <div className="mat-detail">📍 {item.city}</div>}
      {item.assigned_to && <div className="mat-detail">👤 {item.assigned_to}</div>}
      {item.vendor      && <div className="mat-detail">🏭 {item.vendor}</div>}
      {item.eta         && <div className="mat-detail">ETA: {shortDate(item.eta)}</div>}
      {item.notes       && <div className="mat-notes">{item.notes}</div>}
      {item.billed      && <span className="mat-billed-badge">Billed</span>}
      <div className="mat-card-actions">
        {canBack    && <button type="button" onClick={() => onMove(item, MATERIAL_STAGES[stageIdx - 1].id)}>← Back</button>}
        {canForward && <button type="button" onClick={() => onMove(item, MATERIAL_STAGES[stageIdx + 1].id)}>Forward →</button>}
      </div>
    </div>
  );
}

function MaterialBoard() {
  const [items, setItems]       = useState(null);
  const [adding, setAdding]     = useState(null); // stage id being added to
  const [form, setForm]         = useState({ project_name: '', city: '', assigned_to: '', vendor: '', notes: '', eta: '' });

  useEffect(() => {
    fetch('/api/materials', { credentials: 'include' })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  async function handleMove(item, newStage) {
    const res = await fetch(`/api/materials/${item.id}`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  async function handleAdd(e, stage) {
    e.preventDefault();
    const res = await fetch('/api/materials', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, stage }),
    });
    const row = await res.json();
    setItems((prev) => [...prev, row]);
    setForm({ project_name: '', city: '', assigned_to: '', vendor: '', notes: '', eta: '' });
    setAdding(null);
  }

  async function handleDelete(id) {
    await fetch(`/api/materials/${id}`, { method: 'DELETE', credentials: 'include' });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (items === null) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading materials…</div>;

  return (
    <div>
      <div className="mat-board">
        {MATERIAL_STAGES.map((stage) => {
          const stageItems = items.filter((i) => i.stage === stage.id);
          return (
            <div key={stage.id} className="mat-column">
              <div className="mat-col-head" style={{ borderTopColor: stage.color }}>
                <span>{stage.label}</span>
                <span className="mat-count">{stageItems.length}</span>
              </div>

              <div className="mat-cards">
                {stageItems.map((item) => (
                  <MaterialCard key={item.id} item={item} onMove={handleMove} onDelete={handleDelete} />
                ))}
              </div>

              {adding === stage.id ? (
                <form className="mat-add-form" onSubmit={(e) => handleAdd(e, stage.id)}>
                  <input required placeholder="Project / job name" value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} />
                  <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  <input placeholder="Assigned to" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} />
                  <input placeholder="Vendor" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
                  <input type="date" placeholder="ETA" value={form.eta} onChange={(e) => setForm({ ...form, eta: e.target.value })} />
                  <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="submit">Add</button>
                    <button type="button" onClick={() => setAdding(null)} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--line)' }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <button type="button" className="mat-add-btn" onClick={() => setAdding(stage.id)}>+ Add item</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InstallersView({ installers }) {
  const [selected, setSelected] = useState(null);
  const onSite   = installers.filter((i) => i.status === 'on-site').length;
  const avgEff   = installers.length ? installers.reduce((s, i) => s + i.efficiency_rating, 0) / installers.length : 0;
  const highOT   = installers.filter((i) => i.overtime_hours > 40).length;
  const effColor = (v) => v >= 0.9 ? 'var(--green)' : v >= 0.8 ? 'var(--orange)' : 'var(--red)';

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Total Installers"   value={installers.length}   note="In selected area" />
        <StatCard label="Currently On-Site"  value={onSite}              note={`${installers.length - onSite} staging or pending`} />
        <StatCard label="Avg Efficiency"     value={formatRatio(avgEff)} note="YTD performance rating" />
        <StatCard label="High OT Alert"      value={highOT}              note="Installers > 40 OT hrs" />
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Installer Roster</h2><span>{installers.length} field technicians · click a row to view profile</span></div>
        <table>
          <thead><tr><th>Installer</th><th>Territory</th><th>Current Assignment</th><th>Status</th><th>YTD Hours</th><th>Efficiency</th><th>OT Hours</th></tr></thead>
          <tbody>
            {installers.map((inst) => {
              const col = effColor(inst.efficiency_rating);
              return (
                <tr key={inst.id} className="hoverable-row" onClick={() => setSelected(inst)}>
                  <td><strong>{inst.name}</strong></td>
                  <td>{inst.territory_name}</td>
                  <td>{inst.current_job || '—'}</td>
                  <td><span className={`badge badge-${inst.status === 'on-site' ? 'active' : inst.status === 'pending' ? 'pending' : 'completed'}`}>{inst.status}</span></td>
                  <td>{inst.ytd_hours}h</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 7, borderRadius: 999, background: '#e8edf0', overflow: 'hidden', minWidth: 60 }}>
                        <div style={{ height: '100%', borderRadius: 'inherit', background: col, width: `${inst.efficiency_rating * 100}%` }} />
                      </div>
                      <span style={{ color: col, fontWeight: 700, fontSize: 13, minWidth: 36 }}>{formatRatio(inst.efficiency_rating)}</span>
                    </div>
                  </td>
                  <td style={{ color: inst.overtime_hours > 40 ? 'var(--red)' : 'inherit', fontWeight: inst.overtime_hours > 40 ? 700 : 400 }}>{inst.overtime_hours}h</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      {selected && <InstallerProfile installer={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function KPIView({ dashboard }) {
  const metrics = dashboard.monthlyMetrics || demoMetrics;
  const perf    = buildPerformanceModel(dashboard);
  const projects = dashboard.projects || [];
  const active    = projects.filter((p) => p.status === 'active').length;
  const completed = projects.filter((p) => p.status === 'completed').length;
  const maxStatus = Math.max(...(dashboard.byStatus || []).map((s) => s.contract_value), 1);
  const maxTerr   = Math.max(...(dashboard.byTerritory || []).map((t) => t.contract_value), 1);
  const statusColors = ['var(--brand)', 'var(--gold)', 'var(--green)', 'var(--red)'];
  const terrColors   = ['#214f6f', '#2f8f5b', '#d99b2b', '#8e44ad'];

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Active Projects"     value={active}    note={`${projects.length} total in area`} />
        <StatCard label="Completed YTD"       value={completed} note="Closed jobs" />
        {perf.map((item) => <StatCard key={item.label} label={item.label} value={item.value} note={item.note} />)}
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <section className="panel">
          <div className="panel-head"><h2>Status Breakdown</h2><span>By contract value</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {(dashboard.byStatus || []).map((item, i) => (
              <PmBar key={item.status}
                label={`${statusLabels[item.status] || item.status} · ${item.project_count} jobs`}
                value={item.contract_value} max={maxStatus} color={statusColors[i % statusColors.length]} />
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Territory Distribution</h2><span>Contract value by area</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {(dashboard.byTerritory || []).map((area, i) => (
              <PmBar key={area.territory_id}
                label={`${getAreaName(area.territory_id, area.territory_name)} · ${area.project_count} jobs`}
                value={area.contract_value} max={maxTerr} color={terrColors[i % terrColors.length]} />
            ))}
          </div>
        </section>
      </div>
      <BarChart title="Revenue Over Year" subtitle="earned vs projected pipeline" data={metrics} valueKey="total_won_value" projectedKey="pipeline_value" />
    </>
  );
}

function FinancesView({ billings }) {
  const totalBacklog  = billings.reduce((s, b) => s + Number(b.remaining_to_bill || 0), 0);
  const billedMonth   = billings.reduce((s, b) => s + Number(b.bill_this_month || 0), 0);
  const invoiceSent   = billings.filter((b) => b.invoice_sent && b.bill_this_month > 0).length;
  const invoicePend   = billings.filter((b) => !b.invoice_sent && b.bill_this_month > 0).length;

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Total Backlog"      value={currency(totalBacklog)} note="Remaining to bill across jobs" />
        <StatCard label="Billed This Month"  value={currency(billedMonth)}  note="Current billing cycle" />
        <StatCard label="Invoices Sent"      value={invoiceSent}            note="Awaiting client payment" />
        <StatCard label="Invoices Pending"   value={invoicePend}            note="Not yet sent this cycle" />
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Project Billing Status</h2><span>{billings.length} jobs</span></div>
        <table>
          <thead><tr><th>Job</th><th>Project</th><th>Customer</th><th>Billed This Mo.</th><th>Total Billed</th><th>% Complete</th><th>Remaining</th><th>Invoice</th></tr></thead>
          <tbody>
            {billings.map((b) => (
              <tr key={b.job_number}>
                <td>{b.job_number}</td>
                <td><strong>{b.project_name}</strong></td>
                <td>{b.company_name}</td>
                <td><strong>{currency(b.bill_this_month)}</strong></td>
                <td>{currency(b.total_billed)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 7, borderRadius: 999, background: '#e8edf0', overflow: 'hidden', minWidth: 50 }}>
                      <div style={{ height: '100%', borderRadius: 'inherit', background: 'var(--brand)', width: `${b.percent_complete * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, minWidth: 32 }}>{Math.round(b.percent_complete * 100)}%</span>
                  </div>
                </td>
                <td>{currency(b.remaining_to_bill)}</td>
                <td>{b.invoice_sent
                  ? <span className="badge badge-completed">{b.qbo_invoice_number || 'Sent'}</span>
                  : <span className="badge badge-pending">{b.bill_this_month > 0 ? 'Pending' : 'Not started'}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function CustomersView({ customers }) {
  const active     = customers.filter((c) => c.active_projects > 0).length;
  const totalValue = customers.reduce((s, c) => s + Number(c.total_value || 0), 0);
  const types      = [...new Set(customers.map((c) => c.company_type))].length;

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Total Clients"       value={customers.length} note={`${types} company types`} />
        <StatCard label="Active Relationships" value={active}           note="Clients with open jobs" />
        <StatCard label="Total Account Value"  value={currency(totalValue)} note="All accounts combined" />
        <StatCard label="Avg Account Size"     value={currency(customers.length ? totalValue / customers.length : 0)} note="Per client" />
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Customer Directory</h2><span>{customers.length} accounts</span></div>
        <table>
          <thead><tr><th>Company</th><th>Territory</th><th>Type</th><th>Primary Contact</th><th>Phone</th><th>Active Jobs</th><th>Total Value</th><th>Last Touch</th></tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.company_name}</strong></td>
                <td>{c.territory_name}</td>
                <td><span className="badge badge-pending">{c.company_type}</span></td>
                <td><strong>{c.contact_name}</strong><small>{c.contact_title}</small></td>
                <td>{c.phone || '—'}</td>
                <td style={{ textAlign: 'center' }}>{c.active_projects}</td>
                <td><strong>{currency(c.total_value)}</strong></td>
                <td><strong>{shortDate(c.last_interaction)}</strong><small>{c.interaction_type}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function BidsView({ bids }) {
  const won     = bids.filter((b) => b.won || b.bid_status === 'awarded');
  const pending = bids.filter((b) => ['pending', 'sent'].includes(b.bid_status) && !b.won);
  const lost    = bids.filter((b) => ['declined', 'lost'].includes(b.bid_status));
  const winRate = bids.length ? won.length / bids.length : 0;
  const totalValue = bids.reduce((s, b) => s + Number(b.bid_amount || 0), 0);
  const badge   = { awarded: 'badge-completed', sent: 'badge-active', pending: 'badge-pending', declined: 'badge-active', lost: 'badge-active' };

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Total Bids"       value={bids.length}    note={currency(totalValue) + ' total value'} />
        <StatCard label="Bids Won"         value={won.length}     note={currency(won.reduce((s,b)=>s+Number(b.bid_amount),0)) + ' awarded'} />
        <StatCard label="Pending Decision" value={pending.length} note="Awaiting client choice" />
        <StatCard label="Win Rate"         value={formatRatio(winRate)} note={`${lost.length} lost`} />
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Bids &amp; Estimates Log</h2><span>{bids.length} bids tracked</span></div>
        <table>
          <thead><tr><th>Date</th><th>Project</th><th>Client</th><th>Territory</th><th>Bid Amount</th><th>Est. GP</th><th>Est. Hours</th><th>Status</th></tr></thead>
          <tbody>
            {[...bids].sort((a, b) => (b.bid_date || '').localeCompare(a.bid_date || '')).map((b) => (
              <tr key={b.id}>
                <td>{shortDate(b.bid_date)}</td>
                <td><strong>{b.project_name}</strong></td>
                <td>{b.company_name}</td>
                <td>{b.territory_name}</td>
                <td><strong>{currency(b.bid_amount)}</strong></td>
                <td style={{ color: 'var(--green)' }}>
                  {currency(b.estimated_gp)}
                  <small style={{ display: 'block', color: 'var(--muted)' }}>{b.bid_amount ? formatRatio(b.estimated_gp / b.bid_amount) : '—'}</small>
                </td>
                <td>{b.estimated_hours}h</td>
                <td><span className={`badge ${badge[b.bid_status] || 'badge-pending'}`}>{b.bid_status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function toCSV(cols, rows) {
  const esc = (v) => { const s = v == null ? '' : String(v); return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [cols.map((c) => esc(c.label)), ...rows.map((r) => cols.map((c) => esc(r[c.key])))].map((r) => r.join(',')).join('\n');
}

function downloadCSV(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: filename }).click();
  URL.revokeObjectURL(url);
}

function ReportsView({ projects = [], billings = [], bids = [], customers = [], installers = [] }) {
  const exportFns = {
    'Project Status Summary':     () => downloadCSV('project-status.csv', toCSV([
      { label: 'Job #',          key: 'job_number' },
      { label: 'Project',        key: 'project_name' },
      { label: 'Company',        key: 'company_name' },
      { label: 'Territory',      key: 'territory_name' },
      { label: 'Status',         key: 'status' },
      { label: 'Install Start',  key: 'install_start_date' },
      { label: 'Install End',    key: 'install_end_date' },
      { label: 'Contract Value', key: 'total_contract' },
    ], projects)),
    'Weekly Field Report':         () => downloadCSV('weekly-field-report.csv', toCSV([
      { label: 'Project',       key: 'project_name' },
      { label: 'Territory',     key: 'territory_name' },
      { label: 'Status',        key: 'status' },
      { label: 'Install Start', key: 'install_start_date' },
      { label: 'Install End',   key: 'install_end_date' },
    ], projects.filter((p) => p.status === 'active'))),
    'Install Schedule Export':     () => downloadCSV('install-schedule.csv', toCSV([
      { label: 'Job #',         key: 'job_number' },
      { label: 'Project',       key: 'project_name' },
      { label: 'Territory',     key: 'territory_name' },
      { label: 'Install Start', key: 'install_start_date' },
      { label: 'Install End',   key: 'install_end_date' },
    ], projects)),
    'Billing Cycle Summary':       () => downloadCSV('billing-cycle.csv', toCSV([
      { label: 'Job #',             key: 'job_number' },
      { label: 'Project',           key: 'project_name' },
      { label: 'Company',           key: 'company_name' },
      { label: 'Territory',         key: 'territory_name' },
      { label: 'Billed This Month', key: 'bill_this_month' },
      { label: 'Total Billed',      key: 'total_billed' },
      { label: 'Remaining',         key: 'remaining_to_bill' },
      { label: '% Complete',        key: 'percent_complete' },
      { label: 'Invoice Sent',      key: 'invoice_sent' },
      { label: 'QBO Invoice #',     key: 'qbo_invoice_number' },
    ], billings)),
    'Bid & Estimate Log':          () => downloadCSV('bid-log.csv', toCSV([
      { label: 'Project',      key: 'project_name' },
      { label: 'Company',      key: 'company_name' },
      { label: 'Territory',    key: 'territory_name' },
      { label: 'Bid Date',     key: 'bid_date' },
      { label: 'Bid Amount',   key: 'bid_amount' },
      { label: 'Est. GP',      key: 'estimated_gp' },
      { label: 'Est. Hours',   key: 'estimated_hours' },
      { label: 'Status',       key: 'bid_status' },
      { label: 'Won',          key: 'won' },
    ], bids)),
    'Customer Contact Sheet':      () => downloadCSV('customers.csv', toCSV([
      { label: 'Company',          key: 'company_name' },
      { label: 'Territory',        key: 'territory_name' },
      { label: 'Type',             key: 'company_type' },
      { label: 'Contact',          key: 'contact_name' },
      { label: 'Title',            key: 'contact_title' },
      { label: 'Phone',            key: 'phone' },
      { label: 'Active Projects',  key: 'active_projects' },
      { label: 'Total Value',      key: 'total_value' },
      { label: 'Last Interaction', key: 'last_interaction' },
    ], customers)),
    'Installer Efficiency Report': () => downloadCSV('installer-efficiency.csv', toCSV([
      { label: 'Name',       key: 'name' },
      { label: 'Territory',  key: 'territory_name' },
      { label: 'YTD Hours',  key: 'ytd_hours' },
      { label: 'Efficiency', key: 'efficiency_rating' },
      { label: 'OT Hours',   key: 'overtime_hours' },
      { label: 'Status',     key: 'status' },
    ], installers)),
    'Monthly KPI Summary':         () => downloadCSV('kpi-summary.csv', toCSV([
      { label: 'Project',        key: 'project_name' },
      { label: 'Territory',      key: 'territory_name' },
      { label: 'Status',         key: 'status' },
      { label: 'Contract Value', key: 'total_contract' },
    ], projects)),
  };

  const templates = [
    { title: 'Project Status Summary',     description: 'All active jobs with install dates, status, and billing progress.', group: 'Projects' },
    { title: 'Weekly Field Report',         description: 'Installer hours, on-site activity, and schedule variances.',        group: 'Projects' },
    { title: 'Install Schedule Export',     description: 'Calendar of install start/end dates by territory.',                 group: 'Projects' },
    { title: 'Billing Cycle Summary',       description: 'Current billing per project with invoice status.',                  group: 'Finance'  },
    { title: 'Bid & Estimate Log',          description: 'All bids sent with GP estimate and decision status.',               group: 'Finance'  },
    { title: 'Customer Contact Sheet',      description: 'Full client directory with contacts and phone numbers.',            group: 'Customers'},
    { title: 'Installer Efficiency Report', description: 'YTD hours, OT flags, and efficiency ratings by technician.',       group: 'Field'    },
    { title: 'Monthly KPI Summary',         description: 'Hit rate, PPMH, pacing, and install completion metrics.',          group: 'Field'    },
  ];
  const groups = [...new Set(templates.map((t) => t.group))];
  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Report Templates"  value={templates.length} note="Ready to export" />
        <StatCard label="Export Format"     value="CSV"              note="Download anytime" />
        <StatCard label="Last Export"       value="May 14"           note="Weekly Field Report" />
        <StatCard label="Scheduled Reports" value={2}                note="Auto-send Fridays" />
      </section>
      {groups.map((group) => (
        <section key={group} className="panel" style={{ marginBottom: 18 }}>
          <div className="panel-head"><h2>{group} Reports</h2><span>{templates.filter((t) => t.group === group).length} templates</span></div>
          <div style={{ borderTop: '1px solid var(--line)' }}>
            {templates.filter((t) => t.group === group).map((t) => (
              <div key={t.title} style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <strong style={{ display: 'block', marginBottom: 3 }}>{t.title}</strong>
                  <small style={{ color: 'var(--muted)' }}>{t.description}</small>
                </div>
                <button type="button" onClick={exportFns[t.title]} style={{ fontSize: 12, padding: '7px 14px', whiteSpace: 'nowrap', background: 'var(--brand)' }}>Export CSV</button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

// ─── ProjectManagerDashboard ───────────────────────────────────────────────

function ProjectManagerDashboard({ user }) {
  const [activeView, setActiveView] = useState('dashboard');
  const canSwitchTerritory = !['installer', 'estimator'].includes(user.role);
  const lockedArea = (!canSwitchTerritory && user.territoryId) ? Number(user.territoryId) : 0;
  const [areaId, setAreaId] = useState(user.territoryId ? Number(user.territoryId) : 0);
  const [apiDashboard, setApiDashboard] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const dashboard = normalizeDashboard(apiDashboard, areaId);

  const tName = areaId ? territoryNames[areaId] : null;
  const filteredInstallers = tName ? demoInstallers.filter((i) => i.territory_name === tName) : demoInstallers;
  const filteredBids       = tName ? demoBids.filter((b) => b.territory_name === tName) : demoBids;
  const filteredBillings   = tName ? demoBillings.filter((b) => b.territory_name === tName) : demoBillings;
  const filteredCustomers  = tName ? demoCustomers.filter((c) => c.territory_name === tName) : demoCustomers;

  const navMain = [
    ['dashboard',  'Dashboard'],
    ['projects',   'Projects'],
    ['scheduling', 'Scheduling'],
    ['installers', 'Installers'],
    ['kpis',       'KPIs & Performance'],
    ['finances',   'Finances'],
    ['customers',  'Customers'],
    ['bids',       'Bids & Estimates'],
    ['inventory',  'Materials'],
    ['reports',    'Reports'],
  ];
  const navUtil = [
    ['messages',  'Messages'],
    ['documents', 'Documents'],
    ['alerts',    'Alerts'],
    ['settings',  'Settings'],
  ];
  const currentLabel = [...navMain, ...navUtil].find(([id]) => id === activeView)?.[1] || '';

  function initials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2).toUpperCase();
  }
  function formatRole(role) {
    if (!role) return 'Project Manager';
    return role.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  async function refreshFromApi(territory) {
    setLoadingApi(true);
    try {
      const url = territory ? `/api/dashboard?territory=${territory}` : '/api/dashboard';
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) return;
      const body = await response.json();
      setApiDashboard(body.dashboards?.projectManager || null);
    } finally {
      setLoadingApi(false);
    }
  }

  useEffect(() => { if (!user.demo) refreshFromApi(areaId || null); }, [areaId]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><strong>James Blinds</strong><span>Mission Control</span></div>
        {navMain.map(([id, label]) => (
          <button key={id} className={activeView === id ? 'nav-active' : ''} onClick={() => setActiveView(id)} type="button">{label}</button>
        ))}
        <div className="nav-divider" />
        {navUtil.map(([id, label]) => (
          <button key={id} className={activeView === id ? 'nav-active' : ''} onClick={() => setActiveView(id)} type="button">{label}</button>
        ))}
        <div className="user-card">
          <div className="user-avatar">{initials(user.name)}</div>
          <div className="user-info">
            <strong>{user.name}</strong>
            <span>{formatRole(user.role)}</span>
          </div>
        </div>
      </aside>

      <main className="dashboard">
        <header className="page-head">
          <div><p>{getAreaName(areaId)}</p><h1>{currentLabel}</h1></div>
          <div className="actions">
            {lockedArea ? (
              <div style={{ padding: '10px 14px', background: '#eef3f6', borderRadius: 6, color: 'var(--brand)', fontWeight: 700, fontSize: 14, border: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                {territoryNames[lockedArea]}
              </div>
            ) : (
              <select value={areaId} onChange={(e) => setAreaId(Number(e.target.value))}>
                <option value="0">All areas</option>
                <option value="1">Charlotte Metro</option>
                <option value="2">Lake Norman</option>
                <option value="3">South Carolina</option>
                <option value="4">Triad</option>
              </select>
            )}
            <button onClick={refreshFromApi} type="button">{loadingApi ? 'Refreshing...' : 'Refresh Data'}</button>
          </div>
        </header>

        {activeView === 'dashboard'  && <DashboardHome   key={areaId} dashboard={dashboard} />}
        {activeView === 'projects'   && <ProjectTable    key={areaId} projects={dashboard.projects || []} />}
        {activeView === 'scheduling' && <CalendarView    key={areaId} projects={dashboard.projects || []} areaId={areaId} />}
        {activeView === 'installers' && <InstallersView  key={areaId} installers={filteredInstallers} />}
        {activeView === 'kpis'       && <KPIView         key={areaId} dashboard={dashboard} />}
        {activeView === 'finances'   && <FinancesView    key={areaId} billings={filteredBillings} />}
        {activeView === 'customers'  && <CustomersView   key={areaId} customers={filteredCustomers} />}
        {activeView === 'bids'       && <BidsView        key={areaId} bids={filteredBids} />}
        {activeView === 'inventory'  && <MaterialBoard key={areaId} />}
        {activeView === 'reports'    && <ReportsView key={areaId} projects={dashboard.projects || []} billings={filteredBillings} bids={filteredBids} customers={filteredCustomers} installers={filteredInstallers} />}
        {activeView === 'messages'   && <PlaceholderView key={areaId} title="Messages"  icon="💬" description="Team messaging and client communication threads coming soon." />}
        {activeView === 'documents'  && <PlaceholderView key={areaId} title="Documents" icon="📄" description="Contract storage, submittals, and closeout packages coming soon." />}
        {activeView === 'alerts'     && <PlaceholderView key={areaId} title="Alerts"    icon="🔔" description="Smart notifications for overdue invoices, schedule conflicts, and OT flags." />}
        {activeView === 'settings'   && <PlaceholderView key={areaId} title="Settings"  icon="⚙️" description="User preferences, territory assignments, and notification settings coming soon." />}
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  return <ProjectManagerDashboard user={user} />;
}

createRoot(document.getElementById('root')).render(<App />);
