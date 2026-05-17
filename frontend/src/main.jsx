import React, { useEffect, useMemo, useState } from 'react';
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
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

function CalendarView({ projects }) {
  const [anchor, setAnchor] = useState(new Date('2026-05-01T12:00:00'));
  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(1 - monthStart.getDay());
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
  const events = projects.flatMap((project) => [
    project.install_start_date && { date: project.install_start_date, type: 'Install Start', project },
    project.install_end_date && { date: project.install_end_date, type: 'Install End', project },
    project.completion_date && { date: project.completion_date, type: 'Complete', project },
  ].filter(Boolean));

  return (
    <section className="calendar-layout">
      <div className="panel calendar-board">
        <div className="panel-head">
          <h2>{anchor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div className="calendar-actions">
            <button type="button" onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1))}>Prev</button>
            <button type="button" onClick={() => setAnchor(new Date('2026-05-01T12:00:00'))}>Today</button>
            <button type="button" onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1))}>Next</button>
          </div>
        </div>
        <div className="weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="calendar-grid">
          {days.map((day) => {
            const key = isoDate(day);
            const dayEvents = events.filter((event) => event.date === key);
            return (
              <div className={day.getMonth() === anchor.getMonth() ? 'day' : 'day muted-day'} key={key}>
                <strong>{day.getDate()}</strong>
                {dayEvents.slice(0, 3).map((event) => (
                  <span className={`calendar-event event-${event.type.replaceAll(' ', '-').toLowerCase()}`} key={`${event.type}-${event.project.id}`}>
                    {event.type}: {event.project.job_number || event.project.project_name}
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
          {events.sort((a, b) => a.date.localeCompare(b.date)).map((event) => (
            <div className="agenda-item" key={`${event.date}-${event.type}-${event.project.id}`}>
              <span className="badge badge-active">{event.type}</span>
              <div><strong>{event.project.project_name}</strong><small>{shortDate(event.date)} - {getAreaName(event.project.territory_id, event.project.territory_name)}</small></div>
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

function InstallersView({ installers }) {
  const onSite  = installers.filter((i) => i.status === 'on-site').length;
  const totalHrs = installers.reduce((s, i) => s + i.ytd_hours, 0);
  const avgEff  = installers.length ? installers.reduce((s, i) => s + i.efficiency_rating, 0) / installers.length : 0;
  const highOT  = installers.filter((i) => i.overtime_hours > 40).length;
  const effColor = (v) => v >= 0.9 ? 'var(--green)' : v >= 0.8 ? 'var(--orange)' : 'var(--red)';

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Total Installers"   value={installers.length} note="In selected area" />
        <StatCard label="Currently On-Site"  value={onSite}            note={`${installers.length - onSite} staging or pending`} />
        <StatCard label="Avg Efficiency"     value={formatRatio(avgEff)} note="YTD performance rating" />
        <StatCard label="High OT Alert"      value={highOT}            note="Installers > 40 OT hrs" />
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Installer Roster</h2><span>{installers.length} field technicians</span></div>
        <table>
          <thead><tr><th>Installer</th><th>Territory</th><th>Current Assignment</th><th>Status</th><th>YTD Hours</th><th>Efficiency</th><th>OT Hours</th></tr></thead>
          <tbody>
            {installers.map((inst) => {
              const col = effColor(inst.efficiency_rating);
              return (
                <tr key={inst.id}>
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

function ReportsView() {
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
        <StatCard label="Report Templates"   value={templates.length} note="Ready to export" />
        <StatCard label="Export Formats"     value="CSV / PDF"        note="Download anytime" />
        <StatCard label="Last Export"        value="May 14"           note="Weekly Field Report" />
        <StatCard label="Scheduled Reports"  value={2}               note="Auto-send Fridays" />
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
                <button type="button" style={{ fontSize: 12, padding: '7px 14px', whiteSpace: 'nowrap', background: 'var(--brand)' }}>Export CSV</button>
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
  const [areaId, setAreaId] = useState(user.territoryId || 0);
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
    ['inventory',  'Inventory'],
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

  async function refreshFromApi() {
    setLoadingApi(true);
    try {
      const response = await fetch('/api/dashboard', { credentials: 'include' });
      if (!response.ok) return;
      const body = await response.json();
      setApiDashboard(body.dashboards?.projectManager || null);
    } finally {
      setLoadingApi(false);
    }
  }

  useEffect(() => { if (!user.demo) refreshFromApi(); }, []);

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
            <select value={areaId} onChange={(e) => setAreaId(Number(e.target.value))}>
              <option value="0">All areas</option>
              <option value="1">Charlotte Metro</option>
              <option value="2">Lake Norman</option>
              <option value="3">South Carolina</option>
              <option value="4">Triad</option>
            </select>
            <button onClick={refreshFromApi} type="button">{loadingApi ? 'Refreshing...' : 'Refresh Data'}</button>
          </div>
        </header>

        {activeView === 'dashboard'  && <DashboardHome   key={areaId} dashboard={dashboard} />}
        {activeView === 'projects'   && <ProjectTable    key={areaId} projects={dashboard.projects || []} />}
        {activeView === 'scheduling' && <CalendarView    key={areaId} projects={dashboard.projects || []} />}
        {activeView === 'installers' && <InstallersView  key={areaId} installers={filteredInstallers} />}
        {activeView === 'kpis'       && <KPIView         key={areaId} dashboard={dashboard} />}
        {activeView === 'finances'   && <FinancesView    key={areaId} billings={filteredBillings} />}
        {activeView === 'customers'  && <CustomersView   key={areaId} customers={filteredCustomers} />}
        {activeView === 'bids'       && <BidsView        key={areaId} bids={filteredBids} />}
        {activeView === 'inventory'  && <PlaceholderView key={areaId} title="Inventory" icon="📦" description="Material and product tracking coming soon. Track blind types, SKUs, and stock levels by job." />}
        {activeView === 'reports'    && <ReportsView     key={areaId} />}
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
