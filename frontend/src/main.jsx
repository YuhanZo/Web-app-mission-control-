import React, { useEffect, useState } from 'react';
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

const demoProjectWork = {
  1: {
    completion_pct: 62, billed_pct: 45, labor_logged: 324, labor_estimated: 520, materials_status: 'delivered',
    notes: 'East wing install ahead of schedule. Motorized shade shipment for west wing expected May 24. Client requested minor spec change on Suite 4 — revised scope approved.',
    phases: [
      { name: 'Site Measurement & Scope',     pct: 100, status: 'complete', assignee: 'Alex Chen',    completed: '2026-04-15' },
      { name: 'Material Procurement',         pct: 100, status: 'complete', assignee: 'Operations',   completed: '2026-05-02' },
      { name: 'Install — East Wing',          pct: 100, status: 'complete', assignee: 'Mike Torres',  completed: '2026-05-14' },
      { name: 'Install — West Wing',          pct: 35,  status: 'active',   assignee: 'Mike Torres',  completed: null },
      { name: 'Motorization & Controls',      pct: 0,   status: 'pending',  assignee: 'TBD',          completed: null },
      { name: 'Punch List & Client Sign-Off', pct: 0,   status: 'pending',  assignee: 'Maya Johnson', completed: null },
    ],
  },
  2: {
    completion_pct: 28, billed_pct: 20, labor_logged: 195, labor_estimated: 680, materials_status: 'partial',
    notes: 'Floors 1–6 measurement complete. Phase 1 materials partial delivery — remaining expected June 3. Phase 2 install crew scheduling in progress.',
    phases: [
      { name: 'Site Measurement',             pct: 100, status: 'complete', assignee: 'Alex Chen',    completed: '2026-05-08' },
      { name: 'Material Procurement',         pct: 60,  status: 'active',   assignee: 'Operations',   completed: null },
      { name: 'Install — Floors 1–6',         pct: 40,  status: 'active',   assignee: 'Crew A',       completed: null },
      { name: 'Install — Floors 7–14',        pct: 0,   status: 'pending',  assignee: 'TBD',          completed: null },
      { name: 'Install — Penthouse Units',    pct: 0,   status: 'pending',  assignee: 'TBD',          completed: null },
      { name: 'Motorization & Testing',       pct: 0,   status: 'pending',  assignee: 'TBD',          completed: null },
      { name: 'Final Inspection',             pct: 0,   status: 'pending',  assignee: 'Maya Johnson', completed: null },
    ],
  },
  3: {
    completion_pct: 10, billed_pct: 8, labor_logged: 28, labor_estimated: 450, materials_status: 'not-ordered',
    notes: 'Pre-con coordination complete. GC delayed site access to June 17. Motorized solar shades confirmed for all 210 guest rooms. Material order pending site access.',
    phases: [
      { name: 'Pre-Con & Coordination',       pct: 100, status: 'complete', assignee: 'Chris Walker', completed: '2026-05-12' },
      { name: 'Site Measurement',             pct: 0,   status: 'pending',  assignee: 'Jordan Rivers',completed: null },
      { name: 'Material Procurement',         pct: 0,   status: 'pending',  assignee: 'Operations',   completed: null },
      { name: 'Install — Guest Rooms',        pct: 0,   status: 'pending',  assignee: 'TBD',          completed: null },
      { name: 'Install — Common Areas',       pct: 0,   status: 'pending',  assignee: 'TBD',          completed: null },
      { name: 'Punch List & Handoff',         pct: 0,   status: 'pending',  assignee: 'Chris Walker', completed: null },
    ],
  },
  4: {
    completion_pct: 55, billed_pct: 40, labor_logged: 210, labor_estimated: 380, materials_status: 'delivered',
    notes: 'OR suite blackout shades complete and certified. Exam room install 80% done. Admin wing begins May 28. Infection control protocol requires off-hours work.',
    phases: [
      { name: 'Site Measurement',              pct: 100, status: 'complete', assignee: 'Taylor Brooks', completed: '2026-05-05' },
      { name: 'Material Procurement',          pct: 100, status: 'complete', assignee: 'Operations',    completed: '2026-05-18' },
      { name: 'Install — OR Suites',           pct: 100, status: 'complete', assignee: 'Crew B',        completed: '2026-05-22' },
      { name: 'Install — Exam Rooms',          pct: 80,  status: 'active',   assignee: 'Crew B',        completed: null },
      { name: 'Install — Admin Wing',          pct: 0,   status: 'pending',  assignee: 'Crew B',        completed: null },
      { name: 'Punch List & Certification',    pct: 0,   status: 'pending',  assignee: 'Maya Johnson',  completed: null },
    ],
  },
  5: {
    completion_pct: 100, billed_pct: 100, labor_logged: 64, labor_estimated: 60, materials_status: 'delivered',
    notes: 'Project closed Feb 12. All shades installed and operational. Slight labor overage due to unit access coordination with condo association.',
    phases: [
      { name: 'Site Measurement',             pct: 100, status: 'complete', assignee: 'Alex Chen',    completed: '2026-01-30' },
      { name: 'Material Procurement',         pct: 100, status: 'complete', assignee: 'Operations',   completed: '2026-02-04' },
      { name: 'Install — Unit 4B',            pct: 100, status: 'complete', assignee: 'Mike Torres',  completed: '2026-02-05' },
      { name: 'Punch List & Client Sign-Off', pct: 100, status: 'complete', assignee: 'Maya Johnson', completed: '2026-02-12' },
    ],
  },
  6: {
    completion_pct: 5, billed_pct: 3, labor_logged: 12, labor_estimated: 800, materials_status: 'not-ordered',
    notes: 'Kickoff July 8. GC provided Phase 1 drawings for Buildings 1–2. Estimator finalizing scope for all 6 buildings, 402 units. Long-lead motorized components need early order.',
    phases: [
      { name: 'Pre-Con & Planning',           pct: 100, status: 'complete', assignee: 'Morgan Lee',   completed: '2026-05-15' },
      { name: 'Site Measurement',             pct: 0,   status: 'pending',  assignee: 'Morgan Lee',   completed: null },
      { name: 'Material Procurement',         pct: 0,   status: 'pending',  assignee: 'Operations',   completed: null },
      { name: 'Install — Buildings 1–2',      pct: 0,   status: 'pending',  assignee: 'TBD',          completed: null },
      { name: 'Install — Buildings 3–4',      pct: 0,   status: 'pending',  assignee: 'TBD',          completed: null },
      { name: 'Install — Buildings 5–6',      pct: 0,   status: 'pending',  assignee: 'TBD',          completed: null },
      { name: 'Final Inspection & Closeout',  pct: 0,   status: 'pending',  assignee: 'Chris Walker', completed: null },
    ],
  },
};

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
  const W = 620; const H = 240;
  const pad = { top: 20, right: 20, bottom: 36, left: 62 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top - pad.bottom;
  const allV = data.flatMap((d) => [Number(d[valueKey] || 0), projectedKey ? Number(d[projectedKey] || 0) : 0]);
  const maxV = Math.max(...allV, 1);
  const xi   = (i) => pad.left + (i / Math.max(data.length - 1, 1)) * pw;
  const yi   = (v) => pad.top  + (1 - Number(v) / maxV) * ph;
  const mkPath = (key) => data.reduce((p, d, i) => {
    const pt = `${xi(i).toFixed(1)} ${yi(Number(d[key] || 0)).toFixed(1)}`;
    return p ? `${p} L ${pt}` : `M ${pt}`;
  }, '');
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((r) => maxV * r);

  return (
    <section className="panel chart-panel">
      <div className="panel-head"><h2>{title}</h2><span>{subtitle}</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={W - pad.right} y1={yi(tick)} y2={yi(tick)} className="grid-line" />
            <text x={pad.left - 8} y={yi(tick) + 4} textAnchor="end" className="axis-label">{compactMoney(tick)}</text>
          </g>
        ))}
        {data.map((d, i) => (
          <text key={i} x={xi(i)} y={H - 8} textAnchor="middle" className="axis-label">
            {monthLabel(d.metric_month || d.bid_month || '')}
          </text>
        ))}
        {projectedKey && (
          <path d={mkPath(projectedKey)} fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeDasharray="6 4" opacity=".8" />
        )}
        <path d={mkPath(valueKey)} fill="none" stroke="var(--brand)" strokeWidth="3" className="animated-line" />
        {projectedKey && data.map((d, i) => (
          <circle key={i} cx={xi(i)} cy={yi(Number(d[projectedKey] || 0))} r="4" fill="var(--gold)"
            className="animated-dot" style={{ animationDelay: `${0.9 + i * 0.07}s` }} />
        ))}
        {data.map((d, i) => (
          <circle key={i} cx={xi(i)} cy={yi(Number(d[valueKey] || 0))} r="5" fill="var(--brand)"
            className="animated-dot" style={{ animationDelay: `${0.7 + i * 0.07}s` }} />
        ))}
      </svg>
      {projectedKey && (
        <div className="chart-legend">
          <span><i style={{ background: 'var(--brand)' }} />Actual</span>
          <span><i style={{ background: 'var(--gold)', opacity: .8 }} />Projected</span>
        </div>
      )}
    </section>
  );
}

function MiniLineChart({ data, seriesKeys, seriesColors, height = 160 }) {
  const W = 500; const H = height;
  const pad = { top: 10, right: 12, bottom: 24, left: 12 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top - pad.bottom;
  const allV  = data.flatMap((d) => seriesKeys.map((k) => Number(d[k] || 0)));
  const maxV  = Math.max(...allV, 1);
  const xi    = (i) => pad.left + (i / Math.max(data.length - 1, 1)) * pw;
  const yi    = (v) => pad.top  + (1 - v / maxV) * ph;
  const mkPath = (key) => data.reduce((p, d, i) => {
    const pt = `${xi(i).toFixed(1)} ${yi(Number(d[key] || 0)).toFixed(1)}`;
    return p ? `${p} L ${pt}` : `M ${pt}`;
  }, '');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', padding: '8px 18px 0' }}>
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <line key={r} x1={pad.left} x2={W - pad.right} y1={yi(maxV * r)} y2={yi(maxV * r)} stroke="#e8edf0" strokeWidth="1" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={xi(i)} y={H - 2} textAnchor="middle" fill="#6f7a84" fontSize="12">
          {monthLabel(d.month || d.metric_month || '')}
        </text>
      ))}
      {seriesKeys.map((key, ki) => (
        <g key={key}>
          <path d={mkPath(key)} fill="none" stroke={seriesColors[ki]} strokeWidth="2.5"
            className="animated-line" style={{ animationDelay: `${ki * 0.2}s` }} />
          {data.map((d, i) => (
            <circle key={i} cx={xi(i)} cy={yi(Number(d[key] || 0))} r="4" fill={seriesColors[ki]}
              className="animated-dot" style={{ animationDelay: `${0.7 + ki * 0.2 + i * 0.07}s` }} />
          ))}
        </g>
      ))}
    </svg>
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
        {series.map((item, si) => (
          <path key={item.key} d={pathFor(model.chart[item.key])} fill="none" stroke={item.color} strokeWidth="3"
            strokeDasharray={item.dashed ? '8 7' : undefined}
            className={item.dashed ? undefined : 'animated-line'}
            style={item.dashed ? undefined : { animationDelay: `${si * 0.18}s` }} />
        ))}
        {series.slice(0, 4).flatMap((item, si) => model.chart[item.key].map((value, index) => value === null || value === undefined ? null : (
          <circle key={`${item.key}-${index}`} cx={x(index)} cy={y(value)} r="5" fill={item.color}
            className="animated-dot" style={{ animationDelay: `${0.9 + si * 0.18 + index * 0.05}s` }} />
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(err.message || 'Invalid email or password.');
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
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <div className="error">{error}</div>}
        <button disabled={loading} type="submit">{loading ? 'Signing in...' : 'Log in'}</button>
      </form>
    </main>
  );
}

function DashboardHome({ dashboard }) {
  const [selectedProject, setSelectedProject] = useState(null);
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
        <ProjectTable projects={dashboard.recentProjects || []} compact onSelect={setSelectedProject} />
        <FinancialSide dashboard={dashboard} />
      </section>
      {selectedProject && <ProjectDetailPanel project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>
  );
}

function ProjectDetailPanel({ project, onClose }) {
  const work = demoProjectWork[project.id] || { completion_pct: 0, billed_pct: 0, labor_logged: 0, labor_estimated: 0, materials_status: 'unknown', notes: '', phases: [] };
  const contractValue = projectContractValue(project);
  const billed    = contractValue * (work.billed_pct / 100);
  const remaining = contractValue - billed;
  const phaseColor = { complete: 'var(--green)', active: 'var(--brand)', pending: '#dfe5ea' };
  const matColor   = { delivered: 'var(--green)', partial: 'var(--orange)', 'not-ordered': 'var(--muted)', unknown: 'var(--muted)' };
  const matLabel   = { delivered: 'Delivered', partial: 'Partial Delivery', 'not-ordered': 'Not Yet Ordered', unknown: 'Unknown' };

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" style={{ width: 'min(640px, 96vw)' }} onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>
              Job #{project.job_number}
            </div>
            <h2 style={{ margin: '0 0 6px', fontSize: 18, lineHeight: 1.3 }}>{project.project_name}</h2>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className={`badge badge-${project.status || 'unassigned'}`}>{statusLabels[project.status] || project.status}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{project.company_name} · {getAreaName(project.territory_id, project.territory_name)}</span>
            </div>
          </div>
          <button onClick={onClose} type="button" className="close-btn">✕</button>
        </div>

        <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
            <span style={{ color: 'var(--muted)' }}>Overall Completion</span>
            <span style={{ color: work.completion_pct === 100 ? 'var(--green)' : 'var(--brand)' }}>{work.completion_pct}%</span>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: '#e8edf0', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 'inherit', background: work.completion_pct === 100 ? 'var(--green)' : 'var(--brand)', width: `${work.completion_pct}%` }} />
          </div>
        </div>

        <div className="detail-stats">
          <div className="stat"><span>Contract</span><strong>{currency(contractValue)}</strong><small>Total value</small></div>
          <div className="stat"><span>Billed</span><strong style={{ color: 'var(--green)' }}>{currency(billed)}</strong><small>{work.billed_pct}% invoiced</small></div>
          <div className="stat"><span>Remaining</span><strong style={{ color: remaining > 0 ? 'var(--orange)' : 'var(--muted)' }}>{currency(remaining)}</strong><small>To be billed</small></div>
        </div>
        <div className="detail-stats" style={{ borderTop: '1px solid var(--line)' }}>
          <div className="stat"><span>Labor Logged</span><strong>{work.labor_logged}h</strong><small>of {work.labor_estimated}h est.</small></div>
          <div className="stat"><span>Materials</span><strong style={{ color: matColor[work.materials_status] }}>{matLabel[work.materials_status]}</strong><small>Delivery status</small></div>
          <div className="stat"><span>Install Start</span><strong>{shortDate(project.install_start_date)}</strong><small>Scheduled</small></div>
        </div>

        <div className="detail-body">
          <div className="detail-section-label">Work Phases</div>
          <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
            {work.phases.map((phase, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: phaseColor[phase.status] || '#ccc', flexShrink: 0 }} />
                    <span style={{ fontWeight: phase.status === 'active' ? 700 : 500 }}>{phase.name}</span>
                    {phase.status === 'active' && (
                      <span style={{ fontSize: 10, fontWeight: 800, background: 'var(--brand)', color: '#fff', padding: '1px 6px', borderRadius: 10, letterSpacing: '.04em' }}>IN PROGRESS</span>
                    )}
                  </div>
                  <span style={{ color: phase.status === 'complete' ? 'var(--green)' : phase.pct > 0 ? 'var(--brand)' : 'var(--muted)', fontWeight: 700, flexShrink: 0 }}>
                    {phase.status === 'complete' ? '✓ Done' : phase.pct > 0 ? `${phase.pct}%` : 'Not started'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 5, borderRadius: 999, background: '#e8edf0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 'inherit', background: phaseColor[phase.status] || '#ccc', width: `${phase.pct}%` }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', minWidth: 110, textAlign: 'right' }}>
                    {phase.status === 'complete' ? shortDate(phase.completed) : phase.assignee}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="detail-section-label">Project Details</div>
          <div style={{ marginBottom: 16 }}>
            {[
              ['Project Manager', project.project_manager_name || '—'],
              ['Install Window',  `${shortDate(project.install_start_date)} – ${shortDate(project.install_end_date)}`],
              ['Territory',       getAreaName(project.territory_id, project.territory_name)],
              ['Client',          project.company_name || '—'],
              ...(project.completion_date ? [['Completed', shortDate(project.completion_date)]] : []),
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          {work.notes && (
            <>
              <div className="detail-section-label">Field Notes</div>
              <div style={{ fontSize: 13, lineHeight: 1.65, background: 'var(--bg)', padding: '12px 14px', borderRadius: 8 }}>{work.notes}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectsView({ projects }) {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <ProjectTable projects={projects} onSelect={setSelected} />
      {selected && <ProjectDetailPanel project={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

const SUB_COLORS = { measure: '#6c8ebf', install: '#2a9d8f', punch: '#e09c4a' };

function ProjectTable({ projects, compact = false, onSelect }) {
  return (
    <section className="panel table-panel">
      <div className="panel-head">
        <h2>{compact ? 'Current Projects' : 'All Projects'}</h2>
        <span>{onSelect ? 'Click a row to view details' : `${projects.length} shown`}</span>
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
            <tr key={project.id} className={onSelect ? 'hoverable-row' : ''} onClick={onSelect ? () => onSelect(project) : undefined}>
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
  const today = new Date();
  // anchor = Monday of the displayed week
  const [anchor, setAnchor] = useState(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const DAYS = 14; // two weeks
  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() + i);
    return d;
  });
  const todayStr = isoDate(today);

  function prevWeek() { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d); }
  function nextWeek() { const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d); }
  function goToday()  {
    const d = new Date(today);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    d.setHours(0, 0, 0, 0);
    setAnchor(d);
  }

  const rangeStart = isoDate(days[0]);
  const rangeEnd   = isoDate(days[DAYS - 1]);

  // projects that overlap the visible range
  const visible = projects.filter((p) => {
    if (!p.install_start_date || !p.install_end_date) return true; // show TBD rows
    return p.install_start_date.slice(0, 10) <= rangeEnd &&
           p.install_end_date.slice(0, 10)   >= rangeStart;
  });

  // week label helper
  const weekLabel = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // color by status
  const STATUS_COLOR = { active: 'var(--brand)', pending: '#e09c4a', complete: '#2a9d8f', cancelled: '#aaa' };

  const LABEL_W = 180;
  const COL_W   = 52;

  return (
    <div className="panel" style={{ overflow: 'auto' }}>
      {/* nav bar */}
      <div className="panel-head" style={{ position: 'sticky', left: 0 }}>
        <h2>
          Week of {weekLabel(days[0])} — {weekLabel(days[DAYS - 1])}
          <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--muted)', marginLeft: 12 }}>
            {visible.filter((p) => p.install_start_date).length} active projects
          </span>
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={prevWeek}>← Prev</button>
          <button type="button" onClick={goToday}>This week</button>
          <button type="button" onClick={nextWeek}>Next →</button>
        </div>
      </div>

      <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: LABEL_W }} />
          {days.map((d) => <col key={isoDate(d)} style={{ width: COL_W }} />)}
        </colgroup>
        <thead>
          {/* week headers */}
          <tr style={{ background: 'var(--bg)' }}>
            <th style={{ borderBottom: '1px solid var(--line)', padding: '6px 14px', textAlign: 'left' }} />
            {[0, 7].map((offset) => (
              <th key={offset} colSpan={7}
                style={{ borderBottom: '1px solid var(--line)', borderLeft: '2px solid var(--line)', padding: '5px 8px',
                  fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', textAlign: 'left' }}>
                Week of {weekLabel(days[offset])}
              </th>
            ))}
          </tr>
          {/* day headers */}
          <tr style={{ background: 'var(--bg)' }}>
            <th style={{ padding: '6px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
              color: 'var(--muted)', textTransform: 'uppercase', borderBottom: '2px solid var(--line)' }}>
              Project
            </th>
            {days.map((d) => {
              const str = isoDate(d);
              const isToday = str === todayStr;
              const isMon = d.getDay() === 1;
              return (
                <th key={str} style={{
                  padding: '4px 2px', textAlign: 'center',
                  borderBottom: '2px solid var(--line)',
                  borderLeft: isMon ? '2px solid var(--line)' : '1px solid color-mix(in srgb, var(--line) 50%, transparent)',
                  background: isToday ? 'color-mix(in srgb, var(--brand) 10%, transparent)' : undefined,
                  minWidth: COL_W,
                }}>
                  <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--brand)' : 'var(--ink)' }}>
                    {d.getDate()}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 && (
            <tr><td colSpan={DAYS + 1} style={{ padding: 24, color: 'var(--muted)', textAlign: 'center' }}>No projects with install dates in this range.</td></tr>
          )}
          {visible.map((p) => {
            const startStr = p.install_start_date?.slice(0, 10);
            const endStr   = p.install_end_date?.slice(0, 10);
            const color    = STATUS_COLOR[p.status] || 'var(--brand)';
            return (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--line)' }}>
                {/* label */}
                <td style={{ padding: '8px 14px', position: 'sticky', left: 0, background: 'var(--surface)', zIndex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: LABEL_W - 28 }}>
                    {p.project_name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 600, marginTop: 1 }}>
                    {getAreaName(p.territory_id, p.territory_name)}
                  </div>
                  {p.job_number && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>#{p.job_number}</div>}
                </td>
                {/* day cells */}
                {days.map((d) => {
                  const str    = isoDate(d);
                  const isToday = str === todayStr;
                  const isMon  = d.getDay() === 1;
                  const inRange = startStr && endStr && str >= startStr && str <= endStr;
                  const isStart = str === startStr;
                  const isEnd   = str === endStr;
                  return (
                    <td key={str} style={{
                      padding: 0, height: 36,
                      borderLeft: isMon ? '2px solid var(--line)' : '1px solid color-mix(in srgb, var(--line) 50%, transparent)',
                      background: isToday ? 'color-mix(in srgb, var(--brand) 5%, transparent)' : undefined,
                      position: 'relative',
                    }}>
                      {inRange && (
                        <div style={{
                          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                          left: isStart ? 4 : 0,
                          right: isEnd ? 4 : 0,
                          height: 22, background: color, opacity: 0.85,
                          borderRadius: isStart && isEnd ? 6 : isStart ? '6px 0 0 6px' : isEnd ? '0 6px 6px 0' : 0,
                          display: 'flex', alignItems: 'center', overflow: 'hidden',
                        }}>
                          {isStart && (
                            <span style={{ fontSize: 10, color: '#fff', fontWeight: 700, paddingLeft: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.project_name}
                            </span>
                          )}
                        </div>
                      )}
                      {!startStr && (
                        <div style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center', paddingTop: 10 }}>—</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
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
      .then((rows) => setInstallers(rows.length ? rows : demoInstallers))
      .catch(() => setInstallers(demoInstallers));
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

  const monthStr    = `${anchor.getFullYear()}-${String(anchor.getMonth() + 1).padStart(2, '0')}`;
  const monthEvents = events.filter((ev) => ev.date.slice(0, 7) === monthStr).sort((a, b) => a.date.localeCompare(b.date));
  const monthLabel  = anchor.toLocaleDateString('en-US', { month: 'long' });

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
            const dayEvents = events.filter((e) => e.date.slice(0, 10) === k);
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
        <div className="panel-head">
          <h2>Calendar List</h2>
          <span>{monthEvents.length} milestones in {monthLabel}</span>
        </div>
        <div className="agenda-list">
          {monthEvents.length === 0 && (
            <div style={{ padding: '20px 18px', color: 'var(--muted)', fontSize: 13 }}>No milestones in {monthLabel}.</div>
          )}
          {monthEvents.map((ev) => (
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

// ─── Estimator demo data ───────────────────────────────────────────────────

const demoOpportunities = [
  { id:  1, lead_name: 'Ballantyne Corporate Park Ph.3', company: 'SouthPark Capital Partners',     territory_name: 'Charlotte Metro', stage: 'won',        value: 218000, margin_pct: 0.34, estimator: 'Alex Chen', created_date: '2026-03-12', quote_date: '2026-03-22', decision_date: '2026-04-08' },
  { id:  2, lead_name: 'South End Retail Shell Shades',  company: 'Brookline Builders',             territory_name: 'Charlotte Metro', stage: 'quoted',     value:  96500, margin_pct: 0.35, estimator: 'Alex Chen', created_date: '2026-04-28', quote_date: '2026-05-04', decision_date: null         },
  { id:  3, lead_name: 'Crescent North Phase 2',         company: 'Crescent Property Group',        territory_name: 'Charlotte Metro', stage: 'won',        value: 288000, margin_pct: 0.35, estimator: 'Alex Chen', created_date: '2026-04-01', quote_date: '2026-04-10', decision_date: '2026-04-22' },
  { id:  4, lead_name: 'South End Luxury Condos Ph.1',   company: 'Brookline Builders',             territory_name: 'Charlotte Metro', stage: 'quoted',     value: 208000, margin_pct: 0.35, estimator: 'Alex Chen', created_date: '2026-03-25', quote_date: '2026-04-08', decision_date: null         },
  { id:  5, lead_name: 'NoDa Mixed-Use Tower',           company: 'Uptown Development LLC',         territory_name: 'Charlotte Metro', stage: 'site-visit', value: 340000, margin_pct: 0.33, estimator: 'Alex Chen', created_date: '2026-05-07', quote_date: null,         decision_date: null         },
  { id:  6, lead_name: 'Midtown Office Renovation',      company: 'SouthPark Capital Partners',     territory_name: 'Charlotte Metro', stage: 'lead',       value: 122000, margin_pct: 0.32, estimator: 'Alex Chen', created_date: '2026-05-13', quote_date: null,         decision_date: null         },
  { id:  7, lead_name: 'University Research Center',     company: 'Charlotte Univ. Facilities',     territory_name: 'Charlotte Metro', stage: 'lead',       value: 195000, margin_pct: 0.31, estimator: 'Alex Chen', created_date: '2026-05-15', quote_date: null,         decision_date: null         },
  { id:  8, lead_name: 'Dilworth Townhome Row',          company: 'Brookline Builders',             territory_name: 'Charlotte Metro', stage: 'lost',       value:  87000, margin_pct: 0.34, estimator: 'Alex Chen', created_date: '2026-03-05', quote_date: '2026-03-18', decision_date: '2026-04-01' },
  { id:  9, lead_name: 'Plaza Midwood Apartments',       company: 'Crescent Property Group',        territory_name: 'Charlotte Metro', stage: 'site-visit', value: 175000, margin_pct: 0.33, estimator: 'Alex Chen', created_date: '2026-05-10', quote_date: null,         decision_date: null         },
  { id: 10, lead_name: 'Steele Creek Business Park',     company: 'SouthPark Capital Partners',     territory_name: 'Charlotte Metro', stage: 'lost',       value: 132000, margin_pct: 0.35, estimator: 'Alex Chen', created_date: '2026-02-18', quote_date: '2026-03-02', decision_date: '2026-03-20' },
  { id: 11, lead_name: 'Dilworth Senior Living Ph.2',    company: 'Brookline Builders',             territory_name: 'Charlotte Metro', stage: 'lead',       value: 280000, margin_pct: 0.33, estimator: 'Alex Chen', created_date: '2026-05-16', quote_date: null,         decision_date: null         },
  { id: 12, lead_name: 'Uptown Hospitality Suite',       company: 'Uptown Development LLC',         territory_name: 'Charlotte Metro', stage: 'site-visit', value: 165000, margin_pct: 0.34, estimator: 'Alex Chen', created_date: '2026-05-09', quote_date: null,         decision_date: null         },
];

const demoEstimates = [
  { id: 1, project_name: 'South End Retail Shell Shades',  company: 'Brookline Builders',         territory_name: 'Charlotte Metro', status: 'awaiting-approval', bid_amount:  96500, margin_pct: 0.35, estimator: 'Alex Chen', created_date: '2026-04-28', due_date: '2026-05-18', revisions: 1, priority: 'normal' },
  { id: 2, project_name: 'South End Luxury Condos Ph.1',   company: 'Brookline Builders',         territory_name: 'Charlotte Metro', status: 'revision',          bid_amount: 208000, margin_pct: 0.35, estimator: 'Alex Chen', created_date: '2026-03-25', due_date: '2026-05-20', revisions: 2, priority: 'high'   },
  { id: 3, project_name: 'NoDa Mixed-Use Tower',           company: 'Uptown Development LLC',     territory_name: 'Charlotte Metro', status: 'draft',             bid_amount: 340000, margin_pct: 0.33, estimator: 'Alex Chen', created_date: '2026-05-07', due_date: '2026-05-28', revisions: 0, priority: 'high'   },
  { id: 4, project_name: 'Plaza Midwood Apartments',       company: 'Crescent Property Group',    territory_name: 'Charlotte Metro', status: 'pending',           bid_amount: 175000, margin_pct: 0.33, estimator: 'Alex Chen', created_date: '2026-05-10', due_date: '2026-05-25', revisions: 0, priority: 'normal' },
  { id: 5, project_name: 'University Research Center',     company: 'Charlotte Univ. Facilities', territory_name: 'Charlotte Metro', status: 'draft',             bid_amount: 195000, margin_pct: 0.31, estimator: 'Alex Chen', created_date: '2026-05-15', due_date: '2026-06-01', revisions: 0, priority: 'normal' },
  { id: 6, project_name: 'Midtown Office Renovation',      company: 'SouthPark Capital Partners', territory_name: 'Charlotte Metro', status: 'pending',           bid_amount: 122000, margin_pct: 0.32, estimator: 'Alex Chen', created_date: '2026-05-13', due_date: '2026-05-30', revisions: 0, priority: 'normal' },
  { id: 7, project_name: 'Uptown Hospitality Suite',       company: 'Uptown Development LLC',     territory_name: 'Charlotte Metro', status: 'pending',           bid_amount: 165000, margin_pct: 0.34, estimator: 'Alex Chen', created_date: '2026-05-09', due_date: '2026-06-05', revisions: 1, priority: 'normal' },
];

const demoEstimatorMonthly = [
  { month: '2026-01-01', quotes_sent: 6, quotes_won: 3, win_rate: 0.500, total_bid_value:  890000, captured_value: 412000, avg_margin: 0.335, avg_quote_size: 148333, avg_turnaround_days: 9.2 },
  { month: '2026-02-01', quotes_sent: 7, quotes_won: 4, win_rate: 0.571, total_bid_value: 1050000, captured_value: 618000, avg_margin: 0.342, avg_quote_size: 150000, avg_turnaround_days: 8.0 },
  { month: '2026-03-01', quotes_sent: 8, quotes_won: 3, win_rate: 0.375, total_bid_value: 1240000, captured_value: 487000, avg_margin: 0.338, avg_quote_size: 155000, avg_turnaround_days: 7.4 },
  { month: '2026-04-01', quotes_sent: 9, quotes_won: 5, win_rate: 0.556, total_bid_value: 1480000, captured_value: 822000, avg_margin: 0.347, avg_quote_size: 164444, avg_turnaround_days: 6.5 },
  { month: '2026-05-01', quotes_sent: 5, quotes_won: 2, win_rate: 0.400, total_bid_value:  690000, captured_value: 306000, avg_margin: 0.344, avg_quote_size: 138000, avg_turnaround_days: 6.1 },
];

const demoSiteVisits = [
  { id: 1, project_name: 'NoDa Mixed-Use Tower',         company: 'Uptown Development LLC',         territory_name: 'Charlotte Metro', visit_date: '2026-05-19', visit_time: '9:00 AM',  type: 'initial',     estimator: 'Alex Chen', status: 'confirmed', notes: '24-story tower, 340 units, exterior roller shades + amenity blackout' },
  { id: 2, project_name: 'South End Luxury Condos Ph.1', company: 'Brookline Builders',             territory_name: 'Charlotte Metro', visit_date: '2026-05-21', visit_time: '3:30 PM',  type: 'remeasure',   estimator: 'Alex Chen', status: 'confirmed', notes: 'Units 201–240 layout change, client revised floor plans' },
  { id: 3, project_name: 'Plaza Midwood Apartments',     company: 'Crescent Property Group',        territory_name: 'Charlotte Metro', visit_date: '2026-05-22', visit_time: '10:00 AM', type: 'remeasure',   estimator: 'Alex Chen', status: 'confirmed', notes: 'Spec change from roller to cellular in studio units' },
  { id: 4, project_name: 'University Research Center',   company: 'Charlotte Univ. Facilities',     territory_name: 'Charlotte Metro', visit_date: '2026-05-22', visit_time: '2:00 PM',  type: 'walkthrough', estimator: 'Alex Chen', status: 'confirmed', notes: 'Phase 2 labs and offices, full blackout required in research spaces' },
  { id: 5, project_name: 'Midtown Office Renovation',    company: 'SouthPark Capital Partners',     territory_name: 'Charlotte Metro', visit_date: '2026-05-27', visit_time: '1:00 PM',  type: 'initial',     estimator: 'Alex Chen', status: 'tentative', notes: '4-floor plate renovation, solar shades and motorized preferred' },
  { id: 6, project_name: 'Uptown Hospitality Suite',     company: 'Uptown Development LLC',         territory_name: 'Charlotte Metro', visit_date: '2026-05-28', visit_time: '11:30 AM', type: 'walkthrough', estimator: 'Alex Chen', status: 'tentative', notes: 'Boutique hotel common areas and 60 guest rooms' },
  { id: 7, project_name: 'Dilworth Senior Living Ph.2',  company: 'Brookline Builders',             territory_name: 'Charlotte Metro', visit_date: '2026-06-02', visit_time: '9:30 AM',  type: 'initial',     estimator: 'Alex Chen', status: 'tentative', notes: '180-unit senior community, light-filtering throughout' },
];

const demoScopeItems = [
  {
    id: 1, project_name: 'South End Retail Shell Shades', company: 'Brookline Builders', territory_name: 'Charlotte Metro',
    window_count: 48, total_sqft: 3840, labor_hrs: 192, complexity: 'medium',
    product_mix: [{ type: 'Solar Roller Shade', count: 20, pct: 0.42 }, { type: 'Roller Shade (Blackout)', count: 28, pct: 0.58 }],
    rooms: [
      { name: 'Retail Floor A',  windows: 18, width_avg: 96, height_avg: 96, product: 'Solar Roller Shade'      },
      { name: 'Retail Floor B',  windows: 12, width_avg: 72, height_avg: 96, product: 'Solar Roller Shade'      },
      { name: 'Office Suite 1',  windows: 10, width_avg: 48, height_avg: 72, product: 'Roller Shade (Blackout)' },
      { name: 'Office Suite 2',  windows:  8, width_avg: 48, height_avg: 72, product: 'Roller Shade (Blackout)' },
    ],
  },
  {
    id: 2, project_name: 'NoDa Mixed-Use Tower', company: 'Uptown Development LLC', territory_name: 'Charlotte Metro',
    window_count: 340, total_sqft: 27200, labor_hrs: 1360, complexity: 'high',
    product_mix: [{ type: 'Motorized Roller Shade', count: 200, pct: 0.59 }, { type: 'Cellular Shade (Blackout)', count: 140, pct: 0.41 }],
    rooms: [
      { name: 'Residential (1BR)', windows: 120, width_avg: 60, height_avg: 84, product: 'Motorized Roller Shade'    },
      { name: 'Residential (2BR)', windows: 140, width_avg: 72, height_avg: 84, product: 'Motorized Roller Shade'    },
      { name: 'Studio Units',      windows:  80, width_avg: 48, height_avg: 72, product: 'Cellular Shade (Blackout)' },
    ],
  },
  {
    id: 3, project_name: 'Crescent North Phase 2', company: 'Crescent Property Group', territory_name: 'Charlotte Metro',
    window_count: 220, total_sqft: 17600, labor_hrs: 880, complexity: 'high',
    product_mix: [{ type: 'Motorized Cellular Shade', count: 150, pct: 0.68 }, { type: 'Solar Roller Shade', count: 70, pct: 0.32 }],
    rooms: [
      { name: 'Tower A Residential',  windows:  90, width_avg:  60, height_avg:  96, product: 'Motorized Cellular Shade' },
      { name: 'Tower B Residential',  windows:  80, width_avg:  60, height_avg:  96, product: 'Motorized Cellular Shade' },
      { name: 'Common Areas / Lobby', windows:  50, width_avg: 120, height_avg: 120, product: 'Solar Roller Shade'       },
    ],
  },
  {
    id: 4, project_name: 'South End Luxury Condos Ph.1', company: 'Brookline Builders', territory_name: 'Charlotte Metro',
    window_count: 168, total_sqft: 13440, labor_hrs: 672, complexity: 'medium',
    product_mix: [{ type: 'Motorized Roller Shade', count: 108, pct: 0.64 }, { type: 'Blackout Liner Shade', count: 60, pct: 0.36 }],
    rooms: [
      { name: 'Units 101–160 (1BR)', windows:  80, width_avg: 54, height_avg: 84, product: 'Motorized Roller Shade' },
      { name: 'Units 201–240 (2BR)', windows:  88, width_avg: 60, height_avg: 84, product: 'Motorized Roller Shade' },
      { name: 'Master Bedrooms',     windows:  60, width_avg: 48, height_avg: 72, product: 'Blackout Liner Shade'   },
    ],
  },
];

// ─── Chief Estimator demo data ─────────────────────────────────────────────

const demoEstimators = [
  { id: 1, name: 'Alex Chen',     territory_name: 'Charlotte Metro', territory_id: 1, email: 'alex.chen@jamesblinds.com',  phone: '704-555-0301', hire_date: '2023-02-14', ytd_quotes: 35, ytd_won: 17, win_rate: 0.486, total_bid: 5350000, captured: 2645000, avg_margin: 0.342, avg_turnaround: 7.2, active_estimates: 5, pipeline_value: 1268500 },
  { id: 2, name: 'Jordan Rivers', territory_name: 'Lake Norman',     territory_id: 2, email: 'jordan.r@jamesblinds.com',   phone: '704-555-0302', hire_date: '2022-08-01', ytd_quotes: 28, ytd_won: 15, win_rate: 0.536, total_bid: 4120000, captured: 2280000, avg_margin: 0.351, avg_turnaround: 6.8, active_estimates: 4, pipeline_value:  912000 },
  { id: 3, name: 'Taylor Brooks', territory_name: 'South Carolina',  territory_id: 3, email: 'taylor.b@jamesblinds.com',   phone: '803-555-0303', hire_date: '2024-01-10', ytd_quotes: 22, ytd_won:  9, win_rate: 0.409, total_bid: 3280000, captured: 1340000, avg_margin: 0.328, avg_turnaround: 9.1, active_estimates: 3, pipeline_value:  755000 },
  { id: 4, name: 'Morgan Lee',    territory_name: 'Triad',           territory_id: 4, email: 'morgan.l@jamesblinds.com',   phone: '336-555-0304', hire_date: '2023-07-22', ytd_quotes: 31, ytd_won: 16, win_rate: 0.516, total_bid: 4890000, captured: 2620000, avg_margin: 0.345, avg_turnaround: 7.8, active_estimates: 6, pipeline_value: 1145000 },
];

const demoEstimatorMonthlyData = {
  1: demoEstimatorMonthly,
  2: [
    { month: '2026-01-01', quotes_sent: 5, quotes_won: 3, win_rate: 0.600, total_bid_value:  780000, captured_value: 468000, avg_margin: 0.348, avg_quote_size: 156000, avg_turnaround_days: 7.5 },
    { month: '2026-02-01', quotes_sent: 6, quotes_won: 3, win_rate: 0.500, total_bid_value:  845000, captured_value: 402000, avg_margin: 0.352, avg_quote_size: 140833, avg_turnaround_days: 7.0 },
    { month: '2026-03-01', quotes_sent: 5, quotes_won: 3, win_rate: 0.600, total_bid_value:  930000, captured_value: 558000, avg_margin: 0.355, avg_quote_size: 186000, avg_turnaround_days: 6.5 },
    { month: '2026-04-01', quotes_sent: 7, quotes_won: 4, win_rate: 0.571, total_bid_value: 1100000, captured_value: 628000, avg_margin: 0.349, avg_quote_size: 157143, avg_turnaround_days: 6.8 },
    { month: '2026-05-01', quotes_sent: 5, quotes_won: 2, win_rate: 0.400, total_bid_value:  465000, captured_value: 224000, avg_margin: 0.351, avg_quote_size:  93000, avg_turnaround_days: 6.8 },
  ],
  3: [
    { month: '2026-01-01', quotes_sent: 4, quotes_won: 2, win_rate: 0.500, total_bid_value: 620000, captured_value: 298000, avg_margin: 0.324, avg_quote_size: 155000, avg_turnaround_days:  9.8 },
    { month: '2026-02-01', quotes_sent: 4, quotes_won: 1, win_rate: 0.250, total_bid_value: 580000, captured_value: 142000, avg_margin: 0.320, avg_quote_size: 145000, avg_turnaround_days: 10.2 },
    { month: '2026-03-01', quotes_sent: 5, quotes_won: 2, win_rate: 0.400, total_bid_value: 710000, captured_value: 298000, avg_margin: 0.331, avg_quote_size: 142000, avg_turnaround_days:  9.0 },
    { month: '2026-04-01', quotes_sent: 5, quotes_won: 3, win_rate: 0.600, total_bid_value: 890000, captured_value: 432000, avg_margin: 0.328, avg_quote_size: 178000, avg_turnaround_days:  8.8 },
    { month: '2026-05-01', quotes_sent: 4, quotes_won: 1, win_rate: 0.250, total_bid_value: 480000, captured_value: 170000, avg_margin: 0.330, avg_quote_size: 120000, avg_turnaround_days:  8.2 },
  ],
  4: [
    { month: '2026-01-01', quotes_sent: 6, quotes_won: 3, win_rate: 0.500, total_bid_value:  920000, captured_value: 478000, avg_margin: 0.340, avg_quote_size: 153333, avg_turnaround_days: 8.2 },
    { month: '2026-02-01', quotes_sent: 6, quotes_won: 3, win_rate: 0.500, total_bid_value:  985000, captured_value: 512000, avg_margin: 0.343, avg_quote_size: 164167, avg_turnaround_days: 7.8 },
    { month: '2026-03-01', quotes_sent: 7, quotes_won: 4, win_rate: 0.571, total_bid_value: 1180000, captured_value: 680000, avg_margin: 0.347, avg_quote_size: 168571, avg_turnaround_days: 7.6 },
    { month: '2026-04-01', quotes_sent: 8, quotes_won: 4, win_rate: 0.500, total_bid_value: 1310000, captured_value: 662000, avg_margin: 0.344, avg_quote_size: 163750, avg_turnaround_days: 7.9 },
    { month: '2026-05-01', quotes_sent: 4, quotes_won: 2, win_rate: 0.500, total_bid_value:  495000, captured_value: 288000, avg_margin: 0.348, avg_quote_size: 123750, avg_turnaround_days: 7.4 },
  ],
};

const demoEstimatorHistory = {
  1: [
    { project: 'Ballantyne Corporate Park Ph.3', company: 'SouthPark Capital Partners',     stage: 'won',      value: 218000, margin: 0.34, quote_date: '2026-03-22', decision_date: '2026-04-08', turnaround: 10 },
    { project: 'Crescent North Phase 2',         company: 'Crescent Property Group',        stage: 'won',      value: 288000, margin: 0.35, quote_date: '2026-04-10', decision_date: '2026-04-22', turnaround:  9 },
    { project: 'South End Retail Shell Shades',  company: 'Brookline Builders',             stage: 'quoted',   value:  96500, margin: 0.35, quote_date: '2026-05-04', decision_date: null,          turnaround:  6 },
    { project: 'South End Luxury Condos Ph.1',   company: 'Brookline Builders',             stage: 'revision', value: 208000, margin: 0.35, quote_date: '2026-04-08', decision_date: null,          turnaround: 14 },
    { project: 'Steele Creek Business Park',     company: 'SouthPark Capital Partners',     stage: 'lost',     value: 132000, margin: 0.35, quote_date: '2026-03-02', decision_date: '2026-03-20',  turnaround: 12 },
    { project: 'Dilworth Townhome Row',          company: 'Brookline Builders',             stage: 'lost',     value:  87000, margin: 0.34, quote_date: '2026-03-18', decision_date: '2026-04-01',  turnaround: 13 },
  ],
  2: [
    { project: 'Birkdale Village Commons',    company: 'Huntersville Residential',      stage: 'won',    value: 312000, margin: 0.35, quote_date: '2026-03-28', decision_date: '2026-04-15', turnaround: 10 },
    { project: 'Lake Norman Yacht Club',      company: 'Lakeside Hospitality Partners', stage: 'won',    value:  89000, margin: 0.38, quote_date: '2026-03-10', decision_date: '2026-03-25', turnaround:  9 },
    { project: 'Davidson Mixed-Use Center',   company: 'Lakeside Hospitality Partners', stage: 'quoted', value: 198000, margin: 0.36, quote_date: '2026-04-30', decision_date: null,          turnaround:  9 },
    { project: 'Mooresville Apartment Tower', company: 'Lakeside Hospitality Partners', stage: 'visit',  value: 275000, margin: 0.34, quote_date: null,         decision_date: null,          turnaround:  0 },
    { project: 'Huntersville Office Park',    company: 'Huntersville Residential',      stage: 'lost',   value: 178000, margin: 0.35, quote_date: '2026-03-15', decision_date: '2026-04-02',  turnaround: 14 },
  ],
  3: [
    { project: 'Columbia Medical Arts Bldg',  company: 'Palmetto Commercial Interiors', stage: 'won',    value: 245000, margin: 0.33, quote_date: '2026-03-22', decision_date: '2026-04-10', turnaround: 12 },
    { project: 'Greenville Tech Campus',      company: 'Palmetto Commercial Interiors', stage: 'quoted', value: 188000, margin: 0.31, quote_date: '2026-04-28', decision_date: null,          turnaround: 13 },
    { project: 'Spartanburg Senior Center',   company: 'Palmetto Commercial Interiors', stage: 'visit',  value: 112000, margin: 0.30, quote_date: null,         decision_date: null,          turnaround:  0 },
    { project: 'Rock Hill Mixed-Use Phase 1', company: 'Palmetto Commercial Interiors', stage: 'lost',   value: 210000, margin: 0.30, quote_date: '2026-03-05', decision_date: '2026-03-22',  turnaround: 13 },
  ],
  4: [
    { project: 'Greensboro Hub Plaza',       company: 'Triad Multifamily Group', stage: 'won',    value: 380000, margin: 0.35, quote_date: '2026-03-18', decision_date: '2026-04-05', turnaround: 13 },
    { project: 'Winston-Salem Office Tower', company: 'Triad Multifamily Group', stage: 'won',    value: 195000, margin: 0.34, quote_date: '2026-02-28', decision_date: '2026-03-18', turnaround: 13 },
    { project: 'High Point Furniture Mart',  company: 'Triad Multifamily Group', stage: 'quoted', value: 267000, margin: 0.36, quote_date: '2026-05-05', decision_date: null,          turnaround: 10 },
    { project: 'Kernersville Logistics Hub', company: 'Triad Multifamily Group', stage: 'visit',  value: 142000, margin: 0.34, quote_date: null,         decision_date: null,          turnaround:  0 },
    { project: 'Burlington Senior Living',   company: 'Triad Multifamily Group', stage: 'lead',   value: 320000, margin: 0.33, quote_date: null,         decision_date: null,          turnaround:  0 },
    { project: 'Alamance Corporate Center',  company: 'Triad Multifamily Group', stage: 'lost',   value: 155000, margin: 0.34, quote_date: '2026-04-02', decision_date: '2026-04-18',  turnaround: 13 },
  ],
};

const demoAllOpportunities = [
  ...demoOpportunities.map((o) => ({ ...o, estimator_id: 1 })),
  { id: 13, lead_name: 'Birkdale Village Commons',    company: 'Huntersville Residential',      territory_name: 'Lake Norman',    stage: 'won',        value: 312000, margin_pct: 0.35, estimator: 'Jordan Rivers', estimator_id: 2, created_date: '2026-03-18', quote_date: '2026-03-28', decision_date: '2026-04-15' },
  { id: 14, lead_name: 'Davidson Mixed-Use Center',   company: 'Lakeside Hospitality Partners', territory_name: 'Lake Norman',    stage: 'quoted',     value: 198000, margin_pct: 0.36, estimator: 'Jordan Rivers', estimator_id: 2, created_date: '2026-04-20', quote_date: '2026-04-30', decision_date: null },
  { id: 15, lead_name: 'Mooresville Apartment Tower', company: 'Lakeside Hospitality Partners', territory_name: 'Lake Norman',    stage: 'site-visit', value: 275000, margin_pct: 0.34, estimator: 'Jordan Rivers', estimator_id: 2, created_date: '2026-05-08', quote_date: null,         decision_date: null },
  { id: 16, lead_name: 'Cornelius Retail Center',     company: 'Huntersville Residential',      territory_name: 'Lake Norman',    stage: 'lead',       value: 145000, margin_pct: 0.33, estimator: 'Jordan Rivers', estimator_id: 2, created_date: '2026-05-14', quote_date: null,         decision_date: null },
  { id: 17, lead_name: 'Lake Norman Yacht Club',      company: 'Lakeside Hospitality Partners', territory_name: 'Lake Norman',    stage: 'won',        value:  89000, margin_pct: 0.38, estimator: 'Jordan Rivers', estimator_id: 2, created_date: '2026-02-28', quote_date: '2026-03-10', decision_date: '2026-03-25' },
  { id: 18, lead_name: 'Huntersville Office Park',    company: 'Huntersville Residential',      territory_name: 'Lake Norman',    stage: 'lost',       value: 178000, margin_pct: 0.35, estimator: 'Jordan Rivers', estimator_id: 2, created_date: '2026-03-01', quote_date: '2026-03-15', decision_date: '2026-04-02' },
  { id: 19, lead_name: 'Columbia Medical Arts Bldg',  company: 'Palmetto Commercial Interiors', territory_name: 'South Carolina', stage: 'won',        value: 245000, margin_pct: 0.33, estimator: 'Taylor Brooks', estimator_id: 3, created_date: '2026-03-10', quote_date: '2026-03-22', decision_date: '2026-04-10' },
  { id: 20, lead_name: 'Greenville Tech Campus',      company: 'Palmetto Commercial Interiors', territory_name: 'South Carolina', stage: 'quoted',     value: 188000, margin_pct: 0.31, estimator: 'Taylor Brooks', estimator_id: 3, created_date: '2026-04-15', quote_date: '2026-04-28', decision_date: null },
  { id: 21, lead_name: 'Spartanburg Senior Center',   company: 'Palmetto Commercial Interiors', territory_name: 'South Carolina', stage: 'site-visit', value: 112000, margin_pct: 0.30, estimator: 'Taylor Brooks', estimator_id: 3, created_date: '2026-05-11', quote_date: null,         decision_date: null },
  { id: 22, lead_name: 'Myrtle Beach Resort Tower',   company: 'Palmetto Commercial Interiors', territory_name: 'South Carolina', stage: 'lead',       value: 455000, margin_pct: 0.32, estimator: 'Taylor Brooks', estimator_id: 3, created_date: '2026-05-16', quote_date: null,         decision_date: null },
  { id: 23, lead_name: 'Rock Hill Mixed-Use Phase 1', company: 'Palmetto Commercial Interiors', territory_name: 'South Carolina', stage: 'lost',       value: 210000, margin_pct: 0.30, estimator: 'Taylor Brooks', estimator_id: 3, created_date: '2026-02-20', quote_date: '2026-03-05', decision_date: '2026-03-22' },
  { id: 24, lead_name: 'Greensboro Hub Plaza',        company: 'Triad Multifamily Group',       territory_name: 'Triad',          stage: 'won',        value: 380000, margin_pct: 0.35, estimator: 'Morgan Lee',    estimator_id: 4, created_date: '2026-03-05', quote_date: '2026-03-18', decision_date: '2026-04-05' },
  { id: 25, lead_name: 'Winston-Salem Office Tower',  company: 'Triad Multifamily Group',       territory_name: 'Triad',          stage: 'won',        value: 195000, margin_pct: 0.34, estimator: 'Morgan Lee',    estimator_id: 4, created_date: '2026-02-15', quote_date: '2026-02-28', decision_date: '2026-03-18' },
  { id: 26, lead_name: 'High Point Furniture Mart',   company: 'Triad Multifamily Group',       territory_name: 'Triad',          stage: 'quoted',     value: 267000, margin_pct: 0.36, estimator: 'Morgan Lee',    estimator_id: 4, created_date: '2026-04-25', quote_date: '2026-05-05', decision_date: null },
  { id: 27, lead_name: 'Kernersville Logistics Hub',  company: 'Triad Multifamily Group',       territory_name: 'Triad',          stage: 'site-visit', value: 142000, margin_pct: 0.34, estimator: 'Morgan Lee',    estimator_id: 4, created_date: '2026-05-09', quote_date: null,         decision_date: null },
  { id: 28, lead_name: 'Burlington Senior Living',    company: 'Triad Multifamily Group',       territory_name: 'Triad',          stage: 'lead',       value: 320000, margin_pct: 0.33, estimator: 'Morgan Lee',    estimator_id: 4, created_date: '2026-05-15', quote_date: null,         decision_date: null },
  { id: 29, lead_name: 'Alamance Corporate Center',   company: 'Triad Multifamily Group',       territory_name: 'Triad',          stage: 'lost',       value: 155000, margin_pct: 0.34, estimator: 'Morgan Lee',    estimator_id: 4, created_date: '2026-03-20', quote_date: '2026-04-02', decision_date: '2026-04-18' },
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
  { id: 'schedule_calls', label: 'Schedule Calls' },
  { id: 'measures',       label: 'Measures'       },
  { id: 'orders',         label: 'Orders'         },
  { id: 'deliveries',     label: 'Deliveries'     },
  { id: 'in_stock',       label: 'In Stock'       },
];

const MAT_STAGE_COLOR = 'color-mix(in srgb, var(--brand-dark) 50%, white)';

const MAT_COLS = [
  { key: 'project_name',    label: 'Project',       w: '16%' },
  { key: 'city',            label: 'City',           w: '9%'  },
  { key: 'assigned_to',     label: 'Who',            w: '10%' },
  { key: 'scheduled_date',  label: 'When',           w: '9%'  },
  { key: 'install_date',    label: 'Install',        w: '9%'  },
  { key: 'vendor',          label: 'Vendor',         w: '12%' },
  { key: 'notes',           label: 'Notes / ETA / Tracking', w: '27%' },
];

const EMPTY_MAT_FORM = { project_name: '', city: '', assigned_to: '', scheduled_date: '', install_date: '', vendor: '', notes: '', eta: '', tracking_number: '' };

function MaterialBoard() {
  const [items, setItems]       = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addingStage, setAddingStage] = useState(null);
  const [addForm, setAddForm]   = useState(EMPTY_MAT_FORM);

  useEffect(() => {
    fetch('/api/materials', { credentials: 'include' })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  async function handleSave(id) {
    const res = await fetch(`/api/materials/${id}`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    setEditingId(null);
  }

  async function handleAdd(e, stage) {
    e.preventDefault();
    const res = await fetch('/api/materials', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addForm, stage }),
    });
    const row = await res.json();
    setItems((prev) => [...prev, row]);
    setAddForm(EMPTY_MAT_FORM);
    setAddingStage(null);
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this item?')) return;
    await fetch(`/api/materials/${id}`, { method: 'DELETE', credentials: 'include' });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (items === null) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading materials…</div>;

  const tdStyle = { padding: '7px 10px', fontSize: 12, verticalAlign: 'middle', borderRight: '1px solid var(--line)' };
  const inputStyle = { width: '100%', padding: '4px 6px', fontSize: 12, border: '1px solid var(--line)', borderRadius: 4, background: 'var(--surface)', color: 'var(--ink)', boxSizing: 'border-box' };

  return (
    <div className="panel" style={{ overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--line)' }}>
            {MAT_COLS.map((c) => (
              <th key={c.key} style={{ padding: '9px 10px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '.04em',
                width: c.w, borderRight: '1px solid var(--line)' }}>{c.label}</th>
            ))}
            <th style={{ width: '8%', padding: '9px 10px', borderRight: 0 }} />
          </tr>
        </thead>
        <tbody>
          {MATERIAL_STAGES.map((stage) => {
            const stageItems = items.filter((i) => i.stage === stage.id);
            const stageIdx   = MATERIAL_STAGES.findIndex((s) => s.id === stage.id);
            return (
              <React.Fragment key={stage.id}>
                {/* section header */}
                <tr>
                  <td colSpan={MAT_COLS.length + 1} style={{
                    background: MAT_STAGE_COLOR, color: '#fff',
                    padding: '7px 14px', fontWeight: 700, fontSize: 13, letterSpacing: '.03em',
                    borderTop: '1px solid var(--line)',
                  }}>
                    {stage.label}
                    <span style={{ fontWeight: 400, fontSize: 11, marginLeft: 10, opacity: 0.8 }}>
                      {stageItems.length} {stageItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </td>
                </tr>

                {/* data rows */}
                {stageItems.map((item) => editingId === item.id ? (
                  <tr key={item.id} style={{ background: 'color-mix(in srgb, var(--brand) 4%, transparent)', borderBottom: '1px solid var(--line)' }}>
                    <td colSpan={MAT_COLS.length + 1} style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                        {MAT_COLS.map((c) => (
                          <div key={c.key} style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: c.key === 'notes' ? '2 1 200px' : '1 1 110px' }}>
                            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{c.label}</label>
                            {c.key === 'scheduled_date' || c.key === 'install_date' ? (
                              <input type="date" style={inputStyle} value={editForm[c.key] || ''}
                                onChange={(e) => setEditForm((f) => ({ ...f, [c.key]: e.target.value }))} />
                            ) : (
                              <input style={inputStyle} placeholder={c.key === 'notes' ? 'Notes · ETA · Tracking #' : ''}
                                value={editForm[c.key] || ''}
                                onChange={(e) => setEditForm((f) => ({ ...f, [c.key]: e.target.value }))} />
                            )}
                          </div>
                        ))}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '1 1 130px' }}>
                          <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Stage</label>
                          <select value={editForm.stage || stage.id}
                            onChange={(e) => setEditForm((f) => ({ ...f, stage: e.target.value }))}
                            style={inputStyle}>
                            {MATERIAL_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignSelf: 'flex-end', paddingBottom: 1 }}>
                          <button onClick={() => handleSave(item.id)}
                            style={{ fontSize: 12, padding: '5px 16px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 700 }}>Save</button>
                          <button onClick={() => setEditingId(null)}
                            style={{ fontSize: 12, padding: '5px 10px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 5, cursor: 'pointer', color: 'var(--ink)' }}>Cancel</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--line)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'color-mix(in srgb, var(--brand) 3%, transparent)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.project_name || item.linked_project_name || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                    <td style={tdStyle}>{item.city || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                    <td style={tdStyle}>{item.assigned_to || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                    <td style={tdStyle}>{item.scheduled_date ? shortDate(item.scheduled_date) : <span style={{ color: 'var(--muted)' }}>mm/dd</span>}</td>
                    <td style={tdStyle}>{item.install_date ? shortDate(item.install_date) : <span style={{ color: 'var(--muted)' }}>mm/dd</span>}</td>
                    <td style={tdStyle}>{item.vendor || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                    <td style={tdStyle}>
                      <span>{item.notes || ''}</span>
                      {item.eta && <span style={{ color: 'var(--muted)', marginLeft: item.notes ? 6 : 0 }}>ETA: {shortDate(item.eta)}</span>}
                      {item.tracking_number && <span style={{ color: 'var(--muted)', marginLeft: 6 }}>#{item.tracking_number}</span>}
                      {!item.notes && !item.eta && !item.tracking_number && <span style={{ color: 'var(--muted)' }}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, borderRight: 0, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <button title="Edit" onClick={() => { setEditingId(item.id); setEditForm({ stage: item.stage, project_name: item.project_name || '', city: item.city || '', assigned_to: item.assigned_to || '', scheduled_date: item.scheduled_date?.slice(0,10) || '', install_date: item.install_date?.slice(0,10) || '', vendor: item.vendor || '', notes: item.notes || '' }); }}
                          style={{ fontSize: 11, padding: '2px 7px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 3, cursor: 'pointer', color: 'var(--ink)' }}>✎</button>
                        <button title="Delete" onClick={() => handleDelete(item.id)}
                          style={{ fontSize: 11, padding: '2px 6px', background: 'transparent', border: '1px solid #e74c3c', borderRadius: 3, cursor: 'pointer', color: '#e74c3c' }}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* add row form */}
                {addingStage === stage.id ? (
                  <tr style={{ borderBottom: '1px solid var(--line)', background: 'color-mix(in srgb, var(--brand) 4%, transparent)' }}>
                    {MAT_COLS.map((c) => (
                      <td key={c.key} style={tdStyle}>
                        {c.key === 'scheduled_date' || c.key === 'install_date' ? (
                          <input type="date" style={inputStyle} value={addForm[c.key] || ''}
                            onChange={(e) => setAddForm((f) => ({ ...f, [c.key]: e.target.value }))} />
                        ) : (
                          <input style={inputStyle}
                            placeholder={c.key === 'project_name' ? 'Project name *' : c.key === 'notes' ? 'Notes · ETA · Tracking #' : ''}
                            value={addForm[c.key] || ''}
                            onChange={(e) => setAddForm((f) => ({ ...f, [c.key]: e.target.value }))} />
                        )}
                      </td>
                    ))}
                    <td style={{ ...tdStyle, borderRight: 0 }}>
                      <form onSubmit={(e) => handleAdd(e, stage.id)} style={{ display: 'flex', gap: 4 }}>
                        <button type="submit"
                          style={{ fontSize: 11, padding: '3px 10px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Add</button>
                        <button type="button" onClick={() => setAddingStage(null)}
                          style={{ fontSize: 11, padding: '3px 8px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 4, cursor: 'pointer', color: 'var(--ink)' }}>✕</button>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr style={{ borderBottom: '2px solid var(--line)' }}>
                    <td colSpan={MAT_COLS.length + 1} style={{ padding: '6px 14px' }}>
                      <button onClick={() => { setAddingStage(stage.id); setAddForm(EMPTY_MAT_FORM); }}
                        style={{ fontSize: 12, color: 'var(--muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                        + Add row
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
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

// ─── Team / User Management ───────────────────────────────────────────────────

const EMPTY_USER_FORM = { name: '', email: '', password: '', role_id: '', phone: '', territory_id: '' };
const TERRITORY_OPTIONS = [{ id: 1, name: 'Charlotte Metro' }, { id: 2, name: 'Lake Norman' }, { id: 3, name: 'South Carolina' }, { id: 4, name: 'Triad' }];
const SELECT_STYLE = { padding: '6px 10px', border: '1px solid var(--line)', borderRadius: 5, fontSize: 12, background: 'var(--surface)', color: 'var(--ink)', flex: '1 1 120px' };

function TeamView() {
  const [users, setUsers]         = useState(null);
  const [roles, setRoles]         = useState([]);
  const [projects, setProjects]   = useState([]);
  const [form, setForm]           = useState(EMPTY_USER_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [assigningId, setAssigningId] = useState(null);
  const [assignProjectId, setAssignProjectId] = useState('');
  const [error, setError]         = useState('');
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/users', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/users/roles', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/users/projects-list', { credentials: 'include' }).then((r) => r.json()),
    ]).then(([ud, rd, pd]) => {
      setUsers(ud.users || []);
      setRoles(rd.roles || []);
      setProjects(pd.projects || []);
    }).catch(() => setUsers([]));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      const res = await fetch('/api/users', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to add member'); return; }
      setUsers((prev) => [...prev, { ...data.user, role_name: roles.find((r) => r.id === Number(form.role_id))?.name || null }]);
      setForm(EMPTY_USER_FORM);
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  }

  async function handleUpdate(e, id) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Update failed'); return; }
      setUsers((prev) => prev.map((u) => u.id === id ? {
        ...u, ...data.user,
        role_name: roles.find((r) => r.id === Number(editForm.role_id))?.name || null,
        territory_name: TERRITORY_OPTIONS.find((t) => t.id === Number(editForm.territory_id))?.name || null,
      } : u));
      setEditingId(null);
    } catch { setError('Network error'); }
  }

  async function handleAssignProject(userId) {
    if (!assignProjectId) return;
    try {
      const res = await fetch(`/api/users/${userId}/projects`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project_id: assignProjectId, relationship_type: 'installer' }) });
      if (!res.ok) return;
      const proj = projects.find((p) => p.id === Number(assignProjectId));
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, current_job: proj?.project_name, current_project_id: proj?.id } : u));
      setAssigningId(null); setAssignProjectId('');
    } catch { setError('Network error'); }
  }

  async function handleUnassignProject(userId, projectId) {
    try {
      await fetch(`/api/users/${userId}/projects/${projectId}`, { method: 'DELETE', credentials: 'include' });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, current_job: null, current_project_id: null } : u));
    } catch { setError('Network error'); }
  }

  async function handleDeactivate(id, name) {
    if (!window.confirm(`Deactivate "${name}"? They will no longer be able to log in.`)) return;
    try {
      await fetch(`/api/users/${id}/deactivate`, { method: 'PATCH', credentials: 'include' });
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: false } : u));
    } catch { setError('Network error'); }
  }

  return (
    <>
      <section className="panel" style={{ marginBottom: 18 }}>
        <div className="panel-head"><h2>Add Team Member</h2></div>
        <form onSubmit={handleCreate} style={{ padding: '16px 18px', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
          {error && <div style={{ width: '100%', color: '#e74c3c', fontSize: 13 }}>{error}</div>}
          {[['name','Name','text',true],['email','Email','email',true],['password','Password','password',true],['phone','Phone','text',false]].map(([n,l,t,req]) => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 160px' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{l}{req && ' *'}</label>
              <input name={n} type={t} value={form[n]} required={req} onChange={(e) => setForm((f) => ({ ...f, [n]: e.target.value }))}
                style={{ padding: '7px 10px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 13, background: 'var(--surface)', color: 'var(--ink)' }} />
            </div>
          ))}
          {[['role_id','Role',roles.map((r) => ({ value: r.id, label: r.name }))], ['territory_id','Territory', TERRITORY_OPTIONS.map((t) => ({ value: t.id, label: t.name }))]].map(([field, label, opts]) => (
            <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 140px' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</label>
              <select value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                style={{ padding: '7px 10px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 13, background: 'var(--surface)', color: 'var(--ink)' }}>
                <option value="">— None —</option>
                {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
          <button type="submit" disabled={saving} style={{ padding: '8px 18px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-end' }}>
            {saving ? 'Adding…' : 'Add Member'}
          </button>
        </form>
      </section>

      <section className="panel table-panel">
        <div className="panel-head"><h2>Team Members</h2><span>{users ? `${users.length} members` : '…'}</span></div>
        {!users ? (
          <div style={{ padding: 24, color: 'var(--muted)' }}>Loading…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--line)' }}>
                {['Name','Email','Role','Territory','Current Project','Status',''].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan="7" style={{ padding: 24, color: 'var(--muted)', textAlign: 'center' }}>No team members yet.</td></tr>
              )}
              {users.map((u) => editingId === u.id ? (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--line)', background: 'color-mix(in srgb, var(--brand) 4%, transparent)' }}>
                  <td colSpan="7" style={{ padding: '8px 14px' }}>
                    <form onSubmit={(e) => handleUpdate(e, u.id)} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      {['name','email','phone'].map((n) => (
                        <input key={n} placeholder={n} value={editForm[n] || ''} required={n !== 'phone'}
                          onChange={(e) => setEditForm((f) => ({ ...f, [n]: e.target.value }))}
                          style={SELECT_STYLE} />
                      ))}
                      <select value={editForm.role_id || ''} onChange={(e) => setEditForm((f) => ({ ...f, role_id: e.target.value }))} style={SELECT_STYLE}>
                        <option value="">— No role —</option>
                        {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                      <select value={editForm.territory_id || ''} onChange={(e) => setEditForm((f) => ({ ...f, territory_id: e.target.value }))} style={SELECT_STYLE}>
                        <option value="">— No territory —</option>
                        {TERRITORY_OPTIONS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <button type="submit" style={{ padding: '6px 14px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save</button>
                      <button type="button" onClick={() => setEditingId(null)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 5, fontSize: 12, cursor: 'pointer', color: 'var(--ink)' }}>Cancel</button>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{u.name}<div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>{u.phone || ''}</div></td>
                  <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{u.email}</td>
                  <td style={{ padding: '10px 14px' }}>{u.role_name ? <span className="badge badge-role">{u.role_name}</span> : <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{u.territory_name || '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {assigningId === u.id ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <select value={assignProjectId} onChange={(e) => setAssignProjectId(e.target.value)}
                          style={{ ...SELECT_STYLE, minWidth: 160 }}>
                          <option value="">— Select project —</option>
                          {projects.map((p) => <option key={p.id} value={p.id}>{p.job_number ? `${p.job_number} – ${p.project_name}` : p.project_name}</option>)}
                        </select>
                        <button onClick={() => handleAssignProject(u.id)}
                          style={{ fontSize: 11, padding: '4px 10px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Assign</button>
                        <button onClick={() => { setAssigningId(null); setAssignProjectId(''); }}
                          style={{ fontSize: 11, padding: '4px 10px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 4, cursor: 'pointer', color: 'var(--ink)' }}>Cancel</button>
                      </div>
                    ) : u.current_job ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 12 }}>{u.current_job}</span>
                        <button onClick={() => handleUnassignProject(u.id, u.current_project_id)}
                          style={{ fontSize: 10, padding: '2px 7px', background: 'transparent', border: '1px solid #e74c3c', borderRadius: 4, cursor: 'pointer', color: '#e74c3c' }}>✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setAssigningId(u.id)}
                        style={{ fontSize: 11, padding: '4px 10px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 4, cursor: 'pointer', color: 'var(--muted)' }}>+ Assign</button>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px' }}><span className={`badge badge-${u.active ? 'active' : 'pending'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setEditingId(u.id); setEditForm({ name: u.name, email: u.email, phone: u.phone || '', role_id: u.role_id || '', territory_id: u.territory_id || '' }); }}
                        style={{ fontSize: 11, padding: '4px 10px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 4, cursor: 'pointer', color: 'var(--ink)' }}>Edit</button>
                      {u.active && (
                        <button onClick={() => handleDeactivate(u.id, u.name)}
                          style={{ fontSize: 11, padding: '4px 10px', background: 'transparent', border: '1px solid #e74c3c', borderRadius: 4, cursor: 'pointer', color: '#e74c3c' }}>Deactivate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
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
    ['team',      'Team'],
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
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="James Blinds" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 7, background: 'rgba(255,255,255,0.92)', padding: 3, flexShrink: 0 }} />
          <div><strong>James Blinds</strong><span>Mission Control</span></div>
        </div>
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
        {activeView === 'projects'   && <ProjectsView    key={areaId} projects={dashboard.projects || []} />}
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
        {activeView === 'team'       && <TeamView        key={areaId} />}
        {activeView === 'settings'   && <PlaceholderView key={areaId} title="Settings"  icon="⚙️" description="User preferences, territory assignments, and notification settings coming soon." />}
      </main>
    </div>
  );
}

// ─── Estimator Views ───────────────────────────────────────────────────────

function CaptureLineChart({ metrics }) {
  const W = 560; const H = 210;
  const pad = { top: 16, right: 24, bottom: 30, left: 58 };
  const pw  = W - pad.left - pad.right;
  const ph  = H - pad.top  - pad.bottom;

  const allV  = metrics.flatMap((m) => [m.total_bid_value, m.captured_value]);
  const maxV  = Math.max(...allV, 1);
  const xi    = (i) => pad.left + (i / Math.max(metrics.length - 1, 1)) * pw;
  const yi    = (v) => pad.top  + (1 - v / maxV) * ph;
  const baseY = (pad.top + ph).toFixed(1);

  const linePath = (key) => metrics.reduce((p, m, i) => {
    const pt = `${xi(i).toFixed(1)} ${yi(m[key]).toFixed(1)}`;
    return p ? `${p} L ${pt}` : `M ${pt}`;
  }, '');
  const areaPath = (key) => {
    const pts = metrics.map((m, i) => `${xi(i).toFixed(1)},${yi(m[key]).toFixed(1)}`);
    return `M ${xi(0).toFixed(1)},${baseY} L ${pts.join(' L ')} L ${xi(metrics.length - 1).toFixed(1)},${baseY} Z`;
  };
  const ticks = [0.25, 0.5, 0.75, 1].map((r) => maxV * r);

  const ytdBid = metrics.reduce((s, m) => s + m.total_bid_value, 0);
  const ytdCap = metrics.reduce((s, m) => s + m.captured_value, 0);
  const avgRate = metrics.reduce((s, m) => s + m.win_rate, 0) / metrics.length;

  return (
    <section className="panel">
      <div className="panel-head"><h2>Monthly Capture</h2><span>{metrics.length} months</span></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1px solid var(--line)' }}>
        {[
          ['YTD Bid',    compactMoney(ytdBid),  'var(--gold)'],
          ['YTD Won',    compactMoney(ytdCap),  'var(--brand)'],
          ['Avg Rate',   formatRatio(avgRate),   'var(--green)'],
        ].map(([label, value, color], idx) => (
          <div key={label} style={{ padding: '10px 16px', borderRight: idx < 2 ? '1px solid var(--line)' : 'none' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color, marginTop: 3 }}>{value}</div>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="capGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d99b2b" stopOpacity=".22" />
            <stop offset="100%" stopColor="#d99b2b" stopOpacity="0"   />
          </linearGradient>
          <linearGradient id="capBrand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#214f6f" stopOpacity=".18" />
            <stop offset="100%" stopColor="#214f6f" stopOpacity="0"   />
          </linearGradient>
        </defs>

        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={W - pad.right} y1={yi(tick)} y2={yi(tick)} stroke="#e8edf0" strokeWidth="1" />
            <text x={pad.left - 8} y={yi(tick) + 4} textAnchor="end" fill="#6f7a84" fontSize="11">{compactMoney(tick)}</text>
          </g>
        ))}
        {metrics.map((m, i) => (
          <text key={i} x={xi(i)} y={H - 8} textAnchor="middle" fill="#6f7a84" fontSize="11">
            {monthLabel(m.metric_month || m.month || '')}
          </text>
        ))}

        <path d={areaPath('total_bid_value')} fill="url(#capGold)" />
        <path d={areaPath('captured_value')}  fill="url(#capBrand)" />

        <path d={linePath('total_bid_value')} fill="none" stroke="var(--gold)"  strokeWidth="2.5" className="animated-line" style={{ animationDelay: '0.1s' }} />
        <path d={linePath('captured_value')}  fill="none" stroke="var(--brand)" strokeWidth="2.5" className="animated-line" style={{ animationDelay: '0.3s' }} />

        {metrics.map((m, i) => (
          <circle key={`bid-${i}`} cx={xi(i)} cy={yi(m.total_bid_value)} r="4" fill="var(--gold)"
            stroke="#fff" strokeWidth="1.5" className="animated-dot" style={{ animationDelay: `${0.9 + i * 0.07}s` }} />
        ))}
        {metrics.map((m, i) => (
          <circle key={`cap-${i}`} cx={xi(i)} cy={yi(m.captured_value)} r="4" fill="var(--brand)"
            stroke="#fff" strokeWidth="1.5" className="animated-dot" style={{ animationDelay: `${1.1 + i * 0.07}s` }} />
        ))}

        {(() => {
          const last = metrics[metrics.length - 1];
          const lx = xi(metrics.length - 1);
          const bidY = yi(last.total_bid_value);
          const capY = yi(last.captured_value);
          return (
            <>
              <text x={lx - 10} y={bidY - 9} textAnchor="end" fill="var(--gold)"  fontSize="11" fontWeight="700">{compactMoney(last.total_bid_value)}</text>
              <text x={lx - 10} y={capY + 16} textAnchor="end" fill="var(--brand)" fontSize="11" fontWeight="700">{compactMoney(last.captured_value)}</text>
            </>
          );
        })()}
      </svg>

      <div className="chart-legend" style={{ padding: '4px 18px 8px' }}>
        <span><i style={{ background: 'var(--gold)' }} />Bid Sent</span>
        <span><i style={{ background: 'var(--brand)' }} />Captured</span>
      </div>

      <table style={{ margin: '0 0 4px' }}>
        <thead>
          <tr>
            <th>Month</th>
            <th style={{ textAlign: 'right' }}>Bid Sent</th>
            <th style={{ textAlign: 'right' }}>Captured</th>
            <th style={{ textAlign: 'right' }}>Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => (
            <tr key={i}>
              <td><strong>{monthLabel(m.metric_month || m.month || '')}</strong></td>
              <td style={{ textAlign: 'right', color: 'var(--gold)', fontWeight: 600 }}>{compactMoney(m.total_bid_value)}</td>
              <td style={{ textAlign: 'right', color: 'var(--brand)', fontWeight: 600 }}>{compactMoney(m.captured_value)}</td>
              <td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 700 }}>{formatRatio(m.win_rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function EstDashboardHome({ opportunities, estimates, metrics }) {
  const won       = opportunities.filter((o) => o.stage === 'won');
  const open      = opportunities.filter((o) => !['won', 'lost'].includes(o.stage));
  const totalQuoted = opportunities.filter((o) => ['quoted', 'won', 'lost'].includes(o.stage)).length;
  const winRate   = totalQuoted ? won.length / totalQuoted : 0;
  const avgMargin = metrics.reduce((s, m) => s + m.avg_margin, 0) / metrics.length;
  const stages    = ['lead', 'site-visit', 'quoted', 'won', 'lost'];
  const stageLabels = { lead: 'Leads', 'site-visit': 'Site Visits', quoted: 'Quotes', won: 'Won', lost: 'Lost' };
  const stageBg   = ['#687381', '#3478b8', '#d99b2b', '#2f8f5b', '#b84a4a'];
  const maxBid    = Math.max(...metrics.map((m) => m.total_bid_value), 1);

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Open Pipeline"    value={compactMoney(open.reduce((s, o) => s + o.value, 0))}  note={`${open.length} active opportunities`} />
        <StatCard label="Revenue Captured" value={compactMoney(won.reduce((s, o) => s + o.value, 0))}   note={`${won.length} deals won`} />
        <StatCard label="Bid-to-Win Rate"  value={formatRatio(winRate)}                                  note="Quoted to won conversion" />
        <StatCard label="Avg Gross Margin" value={formatRatio(avgMargin)}                                note="YTD across all quotes" />
      </section>
      <section className="panel" style={{ marginBottom: 18 }}>
        <div className="panel-head"><h2>Pipeline Funnel</h2><span>{opportunities.length} total opportunities</span></div>
        <div style={{ display: 'flex', gap: 8, padding: '20px 24px' }}>
          {stages.map((s, i) => {
            const grp = opportunities.filter((o) => o.stage === s);
            return (
              <div key={s} style={{ flex: 1, textAlign: 'center', padding: '14px 8px', borderRadius: 8, background: stageBg[i], color: '#fff' }}>
                <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{grp.length}</div>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 5, opacity: .9 }}>{stageLabels[s]}</div>
                <div style={{ fontSize: 12, marginTop: 5, opacity: .8 }}>{compactMoney(grp.reduce((sum, o) => sum + o.value, 0))}</div>
              </div>
            );
          })}
        </div>
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <section className="panel">
          <div className="panel-head"><h2>Attention Needed</h2><span>Revisions &amp; approvals</span></div>
          <table>
            <thead><tr><th>Project</th><th>Status</th><th>Due</th><th>Value</th></tr></thead>
            <tbody>
              {estimates.filter((e) => ['revision', 'awaiting-approval'].includes(e.status)).map((e) => (
                <tr key={e.id}>
                  <td><strong style={{ fontSize: 13 }}>{e.project_name}</strong><small>{e.company}</small></td>
                  <td><span className={`badge badge-${e.status === 'revision' ? 'pending' : 'active'}`}>{e.status === 'awaiting-approval' ? 'Awaiting Approval' : 'Revision'}</span></td>
                  <td>{shortDate(e.due_date)}</td>
                  <td>{currency(e.bid_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <CaptureLineChart metrics={metrics} />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Recent Wins</h2><span>Closed opportunities</span></div>
        <table>
          <thead><tr><th>Project</th><th>Client</th><th>Value</th><th>Margin</th><th>Closed</th></tr></thead>
          <tbody>
            {[...won].sort((a, b) => (b.decision_date || '').localeCompare(a.decision_date || '')).map((o) => (
              <tr key={o.id}>
                <td><strong>{o.lead_name}</strong></td>
                <td>{o.company}</td>
                <td><strong>{currency(o.value)}</strong></td>
                <td style={{ color: 'var(--green)', fontWeight: 700 }}>{formatRatio(o.margin_pct)}</td>
                <td>{shortDate(o.decision_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function EstPipelineView({ opportunities }) {
  const stages     = ['lead', 'site-visit', 'quoted', 'won', 'lost'];
  const stageLabel = { lead: 'Leads', 'site-visit': 'Site Visits', quoted: 'Quotes Sent', won: 'Won', lost: 'Lost' };
  const stageColor = { lead: '#687381', 'site-visit': '#3478b8', quoted: '#d99b2b', won: '#2f8f5b', lost: '#b84a4a' };
  const byStage    = Object.fromEntries(stages.map((s) => [s, opportunities.filter((o) => o.stage === s)]));
  const wonCount   = byStage.won.length;
  const quotedAll  = byStage.quoted.length + wonCount + byStage.lost.length;

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Open Pipeline"   value={compactMoney(opportunities.filter((o) => !['won','lost'].includes(o.stage)).reduce((s,o) => s + o.value, 0))} note="Active opportunities" />
        <StatCard label="Quotes Won"      value={wonCount}              note={currency(byStage.won.reduce((s,o)=>s+o.value,0))} />
        <StatCard label="Bid-to-Win"      value={formatRatio(quotedAll ? wonCount / quotedAll : 0)} note="Win rate on quoted" />
        <StatCard label="Avg Opp Size"    value={compactMoney(opportunities.length ? opportunities.reduce((s,o)=>s+o.value,0)/opportunities.length : 0)} note="Per opportunity" />
      </section>
      <section className="panel" style={{ marginBottom: 18 }}>
        <div className="panel-head"><h2>Sales Funnel</h2><span>{opportunities.length} total opportunities</span></div>
        <div style={{ padding: '20px 24px', display: 'flex', gap: 8, alignItems: 'stretch' }}>
          {stages.map((s, i) => {
            const grp      = byStage[s];
            const nextStage = stages[i + 1];
            const nextGrp  = nextStage ? byStage[nextStage] : null;
            const conv     = grp.length && nextGrp ? nextGrp.length / grp.length : null;
            return (
              <React.Fragment key={s}>
                <div style={{ flex: 1, textAlign: 'center', padding: '18px 8px', borderRadius: 8, background: stageColor[s], color: '#fff' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{grp.length}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 6, opacity: .88 }}>{stageLabel[s]}</div>
                  <div style={{ fontSize: 13, marginTop: 7, fontWeight: 700, opacity: .9 }}>{compactMoney(grp.reduce((sum,o) => sum + o.value, 0))}</div>
                </div>
                {nextGrp !== null && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--muted)', fontSize: 11, flexShrink: 0, minWidth: 32 }}>
                    <span style={{ fontSize: 20 }}>→</span>
                    {conv !== null && <span style={{ fontWeight: 700 }}>{formatRatio(conv)}</span>}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Opportunity Log</h2><span>{opportunities.length} tracked</span></div>
        <table>
          <thead><tr><th>Lead</th><th>Client</th><th>Stage</th><th>Est. Value</th><th>Margin</th><th>Created</th><th>Quote Date</th><th>Decision</th></tr></thead>
          <tbody>
            {[...opportunities].sort((a,b) => (b.created_date||'').localeCompare(a.created_date||'')).map((o) => (
              <tr key={o.id}>
                <td><strong>{o.lead_name}</strong></td>
                <td>{o.company}</td>
                <td><span className={`badge badge-${o.stage === 'won' ? 'completed' : o.stage === 'lost' ? 'active' : 'pending'}`}>{stageLabel[o.stage] || o.stage}</span></td>
                <td><strong>{currency(o.value)}</strong></td>
                <td style={{ color: 'var(--green)', fontWeight: 700 }}>{formatRatio(o.margin_pct)}</td>
                <td>{shortDate(o.created_date)}</td>
                <td>{o.quote_date ? shortDate(o.quote_date) : '—'}</td>
                <td>{o.decision_date ? shortDate(o.decision_date) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function EstActiveEstimatesView({ estimates }) {
  const [filter, setFilter] = useState('all');
  const statusMeta = {
    'awaiting-approval': { label: 'Awaiting Approval', badge: 'badge-active'  },
    revision:            { label: 'Revision',           badge: 'badge-pending' },
    pending:             { label: 'Pending',            badge: 'badge-pending' },
    draft:               { label: 'Draft',              badge: 'badge-completed' },
  };
  const counts   = Object.fromEntries(Object.keys(statusMeta).map((k) => [k, estimates.filter((e) => e.status === k).length]));
  const filtered = filter === 'all' ? estimates : estimates.filter((e) => e.status === filter);

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Total Active"      value={estimates.length}                                    note="All in-progress estimates" />
        <StatCard label="Awaiting Approval" value={counts['awaiting-approval']}                         note="Ready for client review" />
        <StatCard label="Revisions Needed"  value={counts.revision}                                     note="Client-requested changes" />
        <StatCard label="High Priority"     value={estimates.filter((e) => e.priority === 'high').length} note="Flag for immediate action" />
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>Active Estimates</h2>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['all', ...Object.keys(statusMeta)].map((k) => (
              <button key={k} type="button" onClick={() => setFilter(k)}
                style={{ fontSize: 11, padding: '5px 10px', background: filter === k ? 'var(--brand)' : '#eef3f6', color: filter === k ? '#fff' : 'var(--brand)', fontWeight: 700 }}>
                {k === 'all' ? `All (${estimates.length})` : `${statusMeta[k].label} (${counts[k]})`}
              </button>
            ))}
          </div>
        </div>
        <table>
          <thead><tr><th>Priority</th><th>Project</th><th>Status</th><th>Bid Amount</th><th>Margin</th><th>Revisions</th><th>Due Date</th></tr></thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td>{e.priority === 'high' ? <span className="badge" style={{ background: '#ffe8e8', color: 'var(--red)', borderRadius: 999, padding: '3px 9px', fontSize: 11, fontWeight: 800 }}>High</span> : <span style={{ color: 'var(--muted)', fontSize: 12 }}>Normal</span>}</td>
                <td><strong>{e.project_name}</strong><small>{e.company}</small></td>
                <td><span className={`badge ${statusMeta[e.status]?.badge || 'badge-pending'}`}>{statusMeta[e.status]?.label || e.status}</span></td>
                <td><strong>{currency(e.bid_amount)}</strong></td>
                <td style={{ color: 'var(--green)', fontWeight: 700 }}>{formatRatio(e.margin_pct)}</td>
                <td style={{ color: e.revisions > 1 ? 'var(--orange)' : 'inherit', fontWeight: e.revisions > 1 ? 700 : 400 }}>{e.revisions}</td>
                <td>{shortDate(e.due_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function EstBidsQuotesView({ opportunities }) {
  const quoted   = opportunities.filter((o) => ['quoted', 'won', 'lost'].includes(o.stage));
  const won      = quoted.filter((o) => o.stage === 'won');
  const winRate  = quoted.length ? won.length / quoted.length : 0;
  const stageBadge = { won: 'badge-completed', quoted: 'badge-active', lost: 'badge-pending' };

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Total Quotes"    value={quoted.length}        note={compactMoney(quoted.reduce((s,o)=>s+o.value,0)) + ' bid value'} />
        <StatCard label="Won"             value={won.length}           note={compactMoney(won.reduce((s,o)=>s+o.value,0)) + ' captured'} />
        <StatCard label="Pending"         value={opportunities.filter((o)=>o.stage==='quoted').length} note="Awaiting decision" />
        <StatCard label="Win Rate"        value={formatRatio(winRate)} note={`${opportunities.filter((o)=>o.stage==='lost').length} lost`} />
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Quote Log</h2><span>{quoted.length} quotes sent</span></div>
        <table>
          <thead><tr><th>Date</th><th>Project</th><th>Client</th><th>Bid Amount</th><th>Est. GP</th><th>Margin</th><th>Status</th><th>Decision</th></tr></thead>
          <tbody>
            {[...quoted].sort((a,b)=>(b.quote_date||'').localeCompare(a.quote_date||'')).map((o) => (
              <tr key={o.id}>
                <td>{shortDate(o.quote_date)}</td>
                <td><strong>{o.lead_name}</strong></td>
                <td>{o.company}</td>
                <td><strong>{currency(o.value)}</strong></td>
                <td style={{ color: 'var(--green)' }}>{currency(o.value * o.margin_pct)}</td>
                <td style={{ color: 'var(--green)', fontWeight: 700 }}>{formatRatio(o.margin_pct)}</td>
                <td><span className={`badge ${stageBadge[o.stage] || 'badge-pending'}`}>{o.stage}</span></td>
                <td>{o.decision_date ? shortDate(o.decision_date) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function EstLiftCaptureView({ metrics, opportunities }) {
  const captureRate  = metrics.reduce((s,m) => s + m.win_rate, 0) / metrics.length;
  const avgMargin    = metrics.reduce((s,m) => s + m.avg_margin, 0) / metrics.length;
  const totalCapt    = metrics.reduce((s,m) => s + m.captured_value, 0);
  const totalBid     = metrics.reduce((s,m) => s + m.total_bid_value, 0);
  const latest       = metrics[metrics.length - 1] || {};
  const prev         = metrics[metrics.length - 2] || {};
  const liftWin      = (latest.win_rate || 0) - (prev.win_rate || 0);
  const maxBid       = Math.max(...metrics.map((m) => m.total_bid_value), 1);

  return (
    <>
      <section className="stats-grid">
        <StatCard label="YTD Capture Rate"  value={formatRatio(captureRate)}    note="Avg win rate across period" />
        <StatCard label="Revenue Captured"  value={compactMoney(totalCapt)}     note={`of ${compactMoney(totalBid)} bid`} />
        <StatCard label="Avg Gross Margin"  value={formatRatio(avgMargin)}      note="Across all won quotes" />
        <StatCard label="Win Rate Lift"     value={`${liftWin >= 0 ? '+' : ''}${formatRatio(liftWin)}`} note="vs prior month" />
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <section className="panel">
          <div className="panel-head"><h2>Monthly Win Rate</h2><span>Bid-to-win trend</span></div>
          <MiniLineChart data={metrics} seriesKeys={['win_rate']} seriesColors={['var(--brand)']} />
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Bid vs Captured</h2><span>Monthly revenue comparison</span></div>
          <MiniLineChart data={metrics} seriesKeys={['total_bid_value', 'captured_value']} seriesColors={['var(--gold)', 'var(--green)']} />
          <div className="chart-legend" style={{ padding: '0 18px 14px' }}>
            <span><i style={{ background: 'var(--gold)' }} />Bid Sent</span>
            <span><i style={{ background: 'var(--green)' }} />Captured</span>
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Margin Analysis</h2><span>Won opportunities</span></div>
        <table>
          <thead><tr><th>Project</th><th>Client</th><th>Bid Value</th><th>Gross Profit</th><th>Margin %</th><th>Closed</th></tr></thead>
          <tbody>
            {opportunities.filter((o)=>o.stage==='won').map((o) => (
              <tr key={o.id}>
                <td><strong>{o.lead_name}</strong></td>
                <td>{o.company}</td>
                <td>{currency(o.value)}</td>
                <td style={{ color: 'var(--green)', fontWeight: 700 }}>{currency(o.value * o.margin_pct)}</td>
                <td><span style={{ color: o.margin_pct >= 0.35 ? 'var(--green)' : o.margin_pct >= 0.30 ? 'var(--orange)' : 'var(--red)', fontWeight: 700 }}>{formatRatio(o.margin_pct)}</span></td>
                <td>{shortDate(o.decision_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function EstPerformanceView({ metrics }) {
  const ytdQuotes  = metrics.reduce((s,m) => s + m.quotes_sent, 0);
  const ytdWon     = metrics.reduce((s,m) => s + m.quotes_won, 0);
  const avgTurnaround = metrics.reduce((s,m) => s + m.avg_turnaround_days, 0) / metrics.length;
  const quotesPerWeek = (ytdQuotes / (metrics.length * 4.33)).toFixed(1);
  const maxSent    = Math.max(...metrics.map((m) => m.quotes_sent), 1);

  return (
    <>
      <section className="stats-grid">
        <StatCard label="YTD Quotes Sent"  value={ytdQuotes}                                    note={`${ytdWon} won`} />
        <StatCard label="Quotes / Week"    value={quotesPerWeek}                                note="Avg output rate" />
        <StatCard label="Avg Turnaround"   value={`${avgTurnaround.toFixed(1)}d`}              note="Lead to quote submission" />
        <StatCard label="YTD Win Rate"     value={formatRatio(ytdWon / (ytdQuotes || 1))}      note="Overall capture" />
      </section>
      <section className="panel" style={{ marginBottom: 18 }}>
        <div className="panel-head"><h2>Monthly Performance</h2><span>Output by month</span></div>
        <table>
          <thead><tr><th>Month</th><th>Sent</th><th>Won</th><th>Win Rate</th><th>Total Bid $</th><th>Captured $</th><th>Avg Margin</th><th>Turnaround</th></tr></thead>
          <tbody>
            {[...metrics].reverse().map((m) => (
              <tr key={m.month}>
                <td><strong>{new Date(`${m.month}T12:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong></td>
                <td>{m.quotes_sent}</td>
                <td style={{ color: 'var(--green)', fontWeight: 700 }}>{m.quotes_won}</td>
                <td><span style={{ color: m.win_rate >= 0.5 ? 'var(--green)' : 'var(--orange)', fontWeight: 700 }}>{formatRatio(m.win_rate)}</span></td>
                <td>{currency(m.total_bid_value)}</td>
                <td style={{ color: 'var(--green)', fontWeight: 700 }}>{currency(m.captured_value)}</td>
                <td style={{ color: 'var(--green)' }}>{formatRatio(m.avg_margin)}</td>
                <td>{m.avg_turnaround_days.toFixed(1)}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <section className="panel">
          <div className="panel-head"><h2>Turnaround Trend</h2><span>Days to submit quote</span></div>
          <MiniLineChart data={metrics} seriesKeys={['avg_turnaround_days']} seriesColors={['var(--orange)']} />
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Quote Volume</h2><span>Sent vs won per month</span></div>
          <MiniLineChart data={metrics} seriesKeys={['quotes_sent', 'quotes_won']} seriesColors={['var(--gold)', 'var(--green)']} />
          <div className="chart-legend" style={{ padding: '0 18px 14px' }}>
            <span><i style={{ background: 'var(--gold)' }} />Sent</span>
            <span><i style={{ background: 'var(--green)' }} />Won</span>
          </div>
        </section>
      </div>
    </>
  );
}

function EstScopeView({ scopes }) {
  const [selectedId, setSelectedId] = useState(scopes[0]?.id || null);
  const scope = scopes.find((s) => s.id === selectedId) || scopes[0];
  const complexityColor = { low: 'var(--green)', medium: 'var(--orange)', high: 'var(--red)' };

  if (!scope) return <PlaceholderView title="Scope Viewer" icon="📐" description="No scope data available for this area." />;

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {scopes.map((s) => (
          <button key={s.id} type="button" onClick={() => setSelectedId(s.id)}
            style={{ background: s.id === selectedId ? 'var(--brand)' : '#eef3f6', color: s.id === selectedId ? '#fff' : 'var(--brand)', fontSize: 13, padding: '8px 14px', fontWeight: 700 }}>
            {s.project_name}
          </button>
        ))}
      </div>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Window Count"  value={scope.window_count}                                note="Total openings" />
        <StatCard label="Total Sq Ft"   value={`${scope.total_sqft.toLocaleString()} sf`}         note="Estimated coverage" />
        <StatCard label="Labor Hours"   value={`${scope.labor_hrs}h`}                             note="Installation estimate" />
        <StatCard label="Complexity"    value={scope.complexity.charAt(0).toUpperCase() + scope.complexity.slice(1)} note={`● ${scope.complexity}`} />
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <section className="panel">
          <div className="panel-head"><h2>Product Mix</h2><span>{scope.window_count} windows</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {scope.product_mix.map((p, i) => (
              <PmBar key={p.type} label={`${p.type} (${p.count})`} value={p.pct} max={1}
                color={['var(--brand)', 'var(--gold)', 'var(--green)'][i % 3]} sub={formatRatio(p.pct)} />
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Project Details</h2><span>{scope.company}</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 0 }}>
            {[['Company', scope.company], ['Territory', scope.territory_name], ['Windows', scope.window_count],
              ['Coverage', `${scope.total_sqft.toLocaleString()} sq ft`], ['Labor Est.', `${scope.labor_hrs} hours`],
              ['Complexity', scope.complexity]
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
                <strong style={{ color: label === 'Complexity' ? complexityColor[value] : 'inherit' }}>{value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Room / Area Breakdown</h2><span>{scope.rooms.length} areas</span></div>
        <table>
          <thead><tr><th>Area / Room</th><th>Windows</th><th>Avg Width (in)</th><th>Avg Height (in)</th><th>Product Type</th></tr></thead>
          <tbody>
            {scope.rooms.map((room, i) => (
              <tr key={i}>
                <td><strong>{room.name}</strong></td>
                <td>{room.windows}</td>
                <td>{room.width_avg}"</td>
                <td>{room.height_avg}"</td>
                <td><span className="badge badge-active">{room.product}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function EstScheduleView({ visits }) {
  const confirmed = visits.filter((v) => v.status === 'confirmed').length;
  const tentative = visits.filter((v) => v.status === 'tentative').length;
  const sorted    = [...visits].sort((a,b) => a.visit_date.localeCompare(b.visit_date));
  const typeColor = { initial: 'badge-active', remeasure: 'badge-pending', walkthrough: 'badge-completed' };

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Upcoming Visits"  value={visits.length}                                  note="All scheduled" />
        <StatCard label="Confirmed"        value={confirmed}                                      note="Locked in" />
        <StatCard label="Tentative"        value={tentative}                                      note="Pending confirmation" />
        <StatCard label="Next Visit"       value={sorted.length ? shortDate(sorted[0].visit_date) : '—'} note="Upcoming appointment" />
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Site Visit Schedule</h2><span>{visits.length} appointments</span></div>
        <table>
          <thead><tr><th>Date</th><th>Time</th><th>Project</th><th>Client</th><th>Type</th><th>Estimator</th><th>Status</th><th>Notes</th></tr></thead>
          <tbody>
            {sorted.map((v) => (
              <tr key={v.id}>
                <td><strong>{shortDate(v.visit_date)}</strong></td>
                <td>{v.visit_time}</td>
                <td><strong style={{ fontSize: 13 }}>{v.project_name}</strong></td>
                <td>{v.company}</td>
                <td><span className={`badge ${typeColor[v.type] || 'badge-pending'}`}>{v.type}</span></td>
                <td>{v.estimator}</td>
                <td><span className={`badge badge-${v.status === 'confirmed' ? 'completed' : 'pending'}`}>{v.status}</span></td>
                <td style={{ maxWidth: 200, fontSize: 12, color: 'var(--muted)' }}>{v.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function EstFinancialsView({ opportunities, metrics }) {
  const won           = opportunities.filter((o) => o.stage === 'won');
  const open          = opportunities.filter((o) => !['won','lost'].includes(o.stage));
  const wonValue      = won.reduce((s,o) => s + o.value, 0);
  const pipeValue     = open.reduce((s,o) => s + o.value, 0);
  const avgMargin     = metrics.reduce((s,m) => s + m.avg_margin, 0) / metrics.length;
  const expectedCapt  = pipeValue * 0.5;
  const maxBid        = Math.max(...metrics.map((m) => m.total_bid_value), 1);
  const stageColors   = ['#687381', '#3478b8', '#d99b2b'];
  const openStages    = ['lead', 'site-visit', 'quoted'];
  const stageLabel    = { lead: 'Leads', 'site-visit': 'Site Visits', quoted: 'Quotes Sent' };

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Revenue Captured"       value={currency(wonValue)}          note="Won deals YTD" />
        <StatCard label="Expected from Pipeline" value={currency(expectedCapt)}      note="~50% conversion estimate" />
        <StatCard label="Expected Gross Profit"  value={currency(wonValue * avgMargin)} note={`${formatRatio(avgMargin)} avg margin`} />
        <StatCard label="Avg Quote Size"         value={currency(metrics.reduce((s,m)=>s+m.avg_quote_size,0)/metrics.length)} note="Historical average" />
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <section className="panel">
          <div className="panel-head"><h2>Pipeline by Stage</h2><span>Open value breakdown</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {openStages.map((s, i) => {
              const grp = opportunities.filter((o) => o.stage === s);
              const val = grp.reduce((sum,o) => sum + o.value, 0);
              const max = openStages.map((st) => opportunities.filter((o) => o.stage === st).reduce((sum,o) => sum + o.value, 0));
              return <PmBar key={s} label={`${stageLabel[s]} (${grp.length})`} value={val} max={Math.max(...max, 1)} color={stageColors[i]} />;
            })}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Revenue Summary</h2><span>YTD financial picture</span></div>
          <div style={{ padding: '16px 18px' }}>
            {[
              ['Won & Captured',        currency(wonValue),               'var(--green)'],
              ['Open Pipeline',         currency(pipeValue),              'var(--brand)'],
              ['Expected Capture (50%)',currency(expectedCapt),           'var(--gold)'],
              ['Gross Profit (Won)',    currency(wonValue * avgMargin),    'var(--green)'],
              ['Avg Margin',           formatRatio(avgMargin),             'var(--green)'],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
                <strong style={{ color }}>{value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Monthly Capture Trend</h2><span>Bid value vs revenue captured</span></div>
        <MiniLineChart data={metrics} seriesKeys={['total_bid_value', 'captured_value']} seriesColors={['var(--gold)', 'var(--brand)']} height={180} />
        <div className="chart-legend" style={{ padding: '0 18px 14px' }}>
          <span><i style={{ background: 'var(--gold)' }} />Bid Sent</span>
          <span><i style={{ background: 'var(--brand)' }} />Captured</span>
        </div>
      </section>
    </>
  );
}

// ─── Chief Estimator Components ───────────────────────────────────────────

const EST_COLORS = ['var(--brand)', 'var(--gold)', 'var(--green)', 'var(--orange)'];

function EstimatorProfilePanel({ estimator, onClose }) {
  const history = demoEstimatorHistory[estimator.id] || [];
  const monthly = demoEstimatorMonthlyData[estimator.id] || [];
  const color   = EST_COLORS[(estimator.id - 1) % 4];
  const stageColor = { won: 'badge-completed', lost: 'badge-pending', quoted: 'badge-active', visit: 'badge-pending', lead: 'badge-pending', revision: 'badge-pending' };
  function initials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2).toUpperCase();
  }
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div className="detail-avatar" style={{ background: color }}>{initials(estimator.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 20 }}>{estimator.name}</h2>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
              <span className="badge badge-active">{estimator.territory_name}</span>
              <span className="badge badge-completed">Estimator</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{estimator.email} · {estimator.phone}</div>
          </div>
          <button onClick={onClose} type="button" className="close-btn">✕</button>
        </div>
        <div className="detail-stats">
          <div className="stat"><span>YTD Quotes</span><strong>{estimator.ytd_quotes}</strong><small>{estimator.ytd_won} won</small></div>
          <div className="stat"><span>Win Rate</span><strong style={{ color: estimator.win_rate >= 0.5 ? 'var(--green)' : 'var(--orange)' }}>{formatRatio(estimator.win_rate)}</strong><small>Bid-to-win</small></div>
          <div className="stat"><span>Captured</span><strong style={{ color }}>{compactMoney(estimator.captured)}</strong><small>Revenue won YTD</small></div>
        </div>
        <div className="detail-stats" style={{ borderTop: '1px solid var(--line)' }}>
          <div className="stat"><span>Avg Margin</span><strong style={{ color: 'var(--green)' }}>{formatRatio(estimator.avg_margin)}</strong><small>Gross margin</small></div>
          <div className="stat"><span>Turnaround</span><strong>{estimator.avg_turnaround.toFixed(1)}d</strong><small>Avg days to quote</small></div>
          <div className="stat"><span>Active Est.</span><strong>{estimator.active_estimates}</strong><small>In progress</small></div>
        </div>
        <div className="detail-body">
          {monthly.length > 0 && (
            <>
              <div className="detail-section-label">Monthly Performance</div>
              <MiniLineChart data={monthly} seriesKeys={['total_bid_value', 'captured_value']} seriesColors={['var(--gold)', color]} height={130} />
              <div className="chart-legend" style={{ padding: '0 0 16px' }}>
                <span><i style={{ background: 'var(--gold)' }} />Bid Sent</span>
                <span><i style={{ background: color }} />Captured</span>
              </div>
            </>
          )}
          {history.length > 0 && (
            <>
              <div className="detail-section-label" style={{ marginTop: 8 }}>Recent Projects</div>
              <table>
                <thead><tr><th>Project</th><th>Value</th><th>Margin</th><th>Stage</th></tr></thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td><strong style={{ fontSize: 13 }}>{h.project}</strong><small>{h.company}</small></td>
                      <td>{compactMoney(h.value)}</td>
                      <td style={{ color: 'var(--green)', fontWeight: 700 }}>{formatRatio(h.margin)}</td>
                      <td><span className={`badge ${stageColor[h.stage] || 'badge-pending'}`}>{h.stage}</span></td>
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

function ChiefTeamOverview({ onSelectEstimator }) {
  const totalBid = demoEstimators.reduce((s, e) => s + e.total_bid, 0);
  const totalCap = demoEstimators.reduce((s, e) => s + e.captured, 0);
  const teamWon  = demoEstimators.reduce((s, e) => s + e.ytd_won, 0);
  const teamQ    = demoEstimators.reduce((s, e) => s + e.ytd_quotes, 0);
  const teamWin  = teamQ ? teamWon / teamQ : 0;
  const totalAct = demoEstimators.reduce((s, e) => s + e.active_estimates, 0);
  const maxCap   = Math.max(...demoEstimators.map((e) => e.captured), 1);

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Team Total Bid"   value={compactMoney(totalBid)} note="YTD across all estimators" />
        <StatCard label="Team Captured"    value={compactMoney(totalCap)} note="Revenue won YTD" />
        <StatCard label="Team Win Rate"    value={formatRatio(teamWin)}   note="Aggregate bid-to-win" />
        <StatCard label="Active Estimates" value={totalAct}               note="In progress across team" />
      </section>
      <section className="panel" style={{ marginBottom: 18 }}>
        <div className="panel-head"><h2>Estimator Roster</h2><span>Click any row to view full profile</span></div>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Estimator</th><th>Territory</th>
              <th style={{ textAlign: 'right' }}>Quotes</th><th style={{ textAlign: 'right' }}>Won</th>
              <th style={{ textAlign: 'right' }}>Win Rate</th><th style={{ textAlign: 'right' }}>Bid Value</th>
              <th style={{ textAlign: 'right' }}>Captured</th><th style={{ textAlign: 'right' }}>Margin</th>
              <th style={{ textAlign: 'right' }}>Turnaround</th><th style={{ textAlign: 'right' }}>Active</th>
            </tr>
          </thead>
          <tbody>
            {[...demoEstimators].sort((a, b) => b.captured - a.captured).map((est, rank) => (
              <tr key={est.id} className="hoverable-row" onClick={() => onSelectEstimator(est)}>
                <td><strong style={{ color: 'var(--muted)' }}>{rank + 1}</strong></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: EST_COLORS[est.id - 1], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {est.name.split(' ').map((p) => p[0]).join('')}
                    </div>
                    <div><strong style={{ fontSize: 13 }}>{est.name}</strong><small>{est.email}</small></div>
                  </div>
                </td>
                <td><span className="badge badge-active">{est.territory_name}</span></td>
                <td style={{ textAlign: 'right' }}>{est.ytd_quotes}</td>
                <td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 700 }}>{est.ytd_won}</td>
                <td style={{ textAlign: 'right' }}><span style={{ color: est.win_rate >= 0.5 ? 'var(--green)' : 'var(--orange)', fontWeight: 700 }}>{formatRatio(est.win_rate)}</span></td>
                <td style={{ textAlign: 'right' }}>{compactMoney(est.total_bid)}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--brand)' }}>{compactMoney(est.captured)}</td>
                <td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 600 }}>{formatRatio(est.avg_margin)}</td>
                <td style={{ textAlign: 'right' }}>{est.avg_turnaround.toFixed(1)}d</td>
                <td style={{ textAlign: 'right' }}>{est.active_estimates}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <section className="panel">
          <div className="panel-head"><h2>Win Rate Comparison</h2><span>YTD bid-to-win %</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {[...demoEstimators].sort((a, b) => b.win_rate - a.win_rate).map((est) => (
              <PmBar key={est.id} label={est.name} value={est.win_rate} max={1} color={EST_COLORS[est.id - 1]} sub={formatRatio(est.win_rate)} />
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Revenue Captured</h2><span>YTD won value</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {[...demoEstimators].sort((a, b) => b.captured - a.captured).map((est) => (
              <PmBar key={est.id} label={est.name} value={est.captured} max={maxCap} color={EST_COLORS[est.id - 1]} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function ChiefPerformanceBoard({ onSelectEstimator }) {
  const monthKeys = ['2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01', '2026-05-01'];
  const teamMonthly = monthKeys.map((mk, i) => ({
    month: mk,
    alex:   demoEstimatorMonthlyData[1][i]?.captured_value || 0,
    jordan: demoEstimatorMonthlyData[2][i]?.captured_value || 0,
    taylor: demoEstimatorMonthlyData[3][i]?.captured_value || 0,
    morgan: demoEstimatorMonthlyData[4][i]?.captured_value || 0,
  }));
  const maxTurnaround = Math.max(...demoEstimators.map((e) => e.avg_turnaround), 1);
  const maxBid        = Math.max(...demoEstimators.map((e) => e.total_bid), 1);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        {demoEstimators.map((est, i) => (
          <section key={est.id} className="panel" style={{ cursor: 'pointer' }} onClick={() => onSelectEstimator(est)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px 12px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: EST_COLORS[i], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {est.name.split(' ').map((p) => p[0]).join('')}
              </div>
              <div style={{ minWidth: 0 }}>
                <strong style={{ fontSize: 13, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{est.name}</strong>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{est.territory_name}</span>
              </div>
            </div>
            <div style={{ padding: '12px 18px', display: 'grid', gap: 8 }}>
              {[
                ['Win Rate',   formatRatio(est.win_rate),   est.win_rate >= 0.5 ? 'var(--green)' : 'var(--orange)'],
                ['Captured',   compactMoney(est.captured),  EST_COLORS[i]],
                ['Margin',     formatRatio(est.avg_margin), 'var(--green)'],
                ['Turnaround', `${est.avg_turnaround.toFixed(1)}d`, est.avg_turnaround <= 7.5 ? 'var(--green)' : 'var(--orange)'],
              ].map(([label, value, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
                  <strong style={{ color }}>{value}</strong>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <section className="panel">
          <div className="panel-head"><h2>Avg Turnaround</h2><span>Days to submit quote — lower is better</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {[...demoEstimators].sort((a, b) => a.avg_turnaround - b.avg_turnaround).map((est) => (
              <PmBar key={est.id} label={est.name} value={est.avg_turnaround} max={maxTurnaround}
                color={est.avg_turnaround <= 7.5 ? 'var(--green)' : 'var(--orange)'}
                sub={`${est.avg_turnaround.toFixed(1)}d`} />
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Total Bid Volume</h2><span>YTD bid dollars submitted</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {[...demoEstimators].sort((a, b) => b.total_bid - a.total_bid).map((est) => (
              <PmBar key={est.id} label={est.name} value={est.total_bid} max={maxBid} color={EST_COLORS[est.id - 1]} />
            ))}
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Team Capture Trend</h2><span>Monthly revenue captured per estimator — click a card above to view individual profiles</span></div>
        <MiniLineChart data={teamMonthly} seriesKeys={['alex', 'jordan', 'taylor', 'morgan']} seriesColors={EST_COLORS} height={180} />
        <div className="chart-legend" style={{ padding: '0 18px 14px' }}>
          {demoEstimators.map((est, i) => (
            <span key={est.id}><i style={{ background: EST_COLORS[i] }} />{est.name.split(' ')[0]}</span>
          ))}
        </div>
      </section>
    </>
  );
}

function ChiefAllOpportunities({ onSelectEstimator }) {
  const [filterEst,   setFilterEst]   = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const filtered = demoAllOpportunities.filter((o) => {
    const estMatch   = filterEst   === 'all' || o.estimator === filterEst;
    const stageMatch = filterStage === 'all' || o.stage     === filterStage;
    return estMatch && stageMatch;
  }).sort((a, b) => (b.created_date || '').localeCompare(a.created_date || ''));
  const won  = filtered.filter((o) => o.stage === 'won');
  const open = filtered.filter((o) => !['won', 'lost'].includes(o.stage));
  const stageColors = { won: 'badge-completed', lost: 'badge-pending', quoted: 'badge-active', 'site-visit': 'badge-pending', lead: 'badge-pending' };

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Total Opps"    value={demoAllOpportunities.length}                          note="Across all estimators" />
        <StatCard label="Open Pipeline" value={compactMoney(open.reduce((s, o) => s + o.value, 0))} note={`${open.length} active`} />
        <StatCard label="Won YTD"       value={compactMoney(won.reduce((s, o) => s + o.value, 0))}  note={`${won.length} deals`} />
        <StatCard label="Showing"       value={filtered.length}                                      note="After filters" />
      </section>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        {['all', ...demoEstimators.map((e) => e.name)].map((v) => (
          <button key={v} type="button" onClick={() => setFilterEst(v)}
            style={{ background: filterEst === v ? 'var(--brand)' : '#eef3f6', color: filterEst === v ? '#fff' : 'var(--brand)', fontSize: 12, padding: '7px 14px', fontWeight: 700 }}>
            {v === 'all' ? 'All Estimators' : v}
          </button>
        ))}
        <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} style={{ fontSize: 13, marginLeft: 'auto' }}>
          <option value="all">All Stages</option>
          <option value="lead">Lead</option>
          <option value="site-visit">Site Visit</option>
          <option value="quoted">Quoted</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>
      <section className="panel">
        <div className="panel-head"><h2>All Opportunities</h2><span>{filtered.length} results</span></div>
        <table>
          <thead><tr><th>Project</th><th>Estimator</th><th>Territory</th><th>Stage</th><th style={{ textAlign: 'right' }}>Value</th><th style={{ textAlign: 'right' }}>Margin</th><th>Created</th><th>Quote Date</th></tr></thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td><strong style={{ fontSize: 13 }}>{o.lead_name}</strong><small>{o.company}</small></td>
                <td style={{ fontSize: 12 }}>{o.estimator}</td>
                <td><span className="badge badge-active" style={{ fontSize: 11 }}>{o.territory_name}</span></td>
                <td><span className={`badge ${stageColors[o.stage] || 'badge-pending'}`}>{o.stage}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{currency(o.value)}</td>
                <td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 600 }}>{formatRatio(o.margin_pct)}</td>
                <td style={{ fontSize: 12 }}>{shortDate(o.created_date)}</td>
                <td style={{ fontSize: 12 }}>{o.quote_date ? shortDate(o.quote_date) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function ChiefBidsQuotes() {
  const [filterEst, setFilterEst] = useState('all');
  const allQuoted = demoAllOpportunities.filter((o) => ['quoted', 'site-visit', 'won', 'lost'].includes(o.stage));
  const filtered  = filterEst === 'all' ? allQuoted : allQuoted.filter((o) => o.estimator === filterEst);
  const stageColors = { won: 'badge-completed', lost: 'badge-pending', quoted: 'badge-active', 'site-visit': 'badge-pending' };

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Total Quoted" value={demoAllOpportunities.filter((o) => o.stage === 'quoted').length} note="Awaiting decision" />
        <StatCard label="Won YTD"      value={demoAllOpportunities.filter((o) => o.stage === 'won').length}    note="Across team" />
        <StatCard label="Lost YTD"     value={demoAllOpportunities.filter((o) => o.stage === 'lost').length}   note="Across team" />
        <StatCard label="Total Bid $"  value={compactMoney(demoEstimators.reduce((s, e) => s + e.total_bid, 0))} note="YTD all estimators" />
      </section>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {['all', ...demoEstimators.map((e) => e.name)].map((v) => (
          <button key={v} type="button" onClick={() => setFilterEst(v)}
            style={{ background: filterEst === v ? 'var(--brand)' : '#eef3f6', color: filterEst === v ? '#fff' : 'var(--brand)', fontSize: 12, padding: '7px 14px', fontWeight: 700 }}>
            {v === 'all' ? 'All Estimators' : v}
          </button>
        ))}
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Bids & Quotes</h2><span>{filtered.length} records</span></div>
        <table>
          <thead><tr><th>Project</th><th>Estimator</th><th>Territory</th><th>Stage</th><th style={{ textAlign: 'right' }}>Bid Value</th><th style={{ textAlign: 'right' }}>Margin</th><th>Quote Date</th><th>Decision Date</th></tr></thead>
          <tbody>
            {[...filtered].sort((a, b) => (b.quote_date || '').localeCompare(a.quote_date || '')).map((o) => (
              <tr key={o.id}>
                <td><strong style={{ fontSize: 13 }}>{o.lead_name}</strong><small>{o.company}</small></td>
                <td style={{ fontSize: 12 }}>{o.estimator}</td>
                <td><span className="badge badge-active" style={{ fontSize: 11 }}>{o.territory_name}</span></td>
                <td><span className={`badge ${stageColors[o.stage] || 'badge-pending'}`}>{o.stage}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{currency(o.value)}</td>
                <td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 600 }}>{formatRatio(o.margin_pct)}</td>
                <td style={{ fontSize: 12 }}>{o.quote_date ? shortDate(o.quote_date) : '—'}</td>
                <td style={{ fontSize: 12 }}>{o.decision_date ? shortDate(o.decision_date) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function ChiefLiftCapture() {
  const teamTotalBid = demoEstimators.reduce((s, e) => s + e.total_bid, 0);
  const teamCaptured = demoEstimators.reduce((s, e) => s + e.captured, 0);
  const teamWon      = demoEstimators.reduce((s, e) => s + e.ytd_won, 0);
  const teamQuotes   = demoEstimators.reduce((s, e) => s + e.ytd_quotes, 0);
  const teamRate     = teamQuotes ? teamWon / teamQuotes : 0;
  const monthKeys    = ['2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01', '2026-05-01'];
  const teamMonthly  = monthKeys.map((mk, i) => ({
    month: mk,
    bid: demoEstimators.reduce((s, est) => s + (demoEstimatorMonthlyData[est.id][i]?.total_bid_value || 0), 0),
    cap: demoEstimators.reduce((s, est) => s + (demoEstimatorMonthlyData[est.id][i]?.captured_value  || 0), 0),
  }));

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Team Bid Value" value={compactMoney(teamTotalBid)}                                              note="YTD across all estimators" />
        <StatCard label="Team Captured"  value={compactMoney(teamCaptured)}                                              note="Revenue won YTD" />
        <StatCard label="Team Win Rate"  value={formatRatio(teamRate)}                                                   note="Aggregate capture rate" />
        <StatCard label="Open Pipeline"  value={compactMoney(demoEstimators.reduce((s, e) => s + e.pipeline_value, 0))} note="Active opportunity value" />
      </section>
      <section className="panel" style={{ marginBottom: 18 }}>
        <div className="panel-head"><h2>Per-Estimator Lift & Capture</h2><span>YTD breakdown</span></div>
        <table>
          <thead>
            <tr>
              <th>Estimator</th>
              <th style={{ textAlign: 'right' }}>Quotes</th><th style={{ textAlign: 'right' }}>Won</th>
              <th style={{ textAlign: 'right' }}>Win Rate</th><th style={{ textAlign: 'right' }}>Bid Value</th>
              <th style={{ textAlign: 'right' }}>Captured</th><th style={{ textAlign: 'right' }}>Capture %</th>
              <th style={{ textAlign: 'right' }}>Avg Margin</th>
            </tr>
          </thead>
          <tbody>
            {demoEstimators.map((est, i) => (
              <tr key={est.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: EST_COLORS[i], flexShrink: 0 }} />
                    <strong>{est.name}</strong>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{est.territory_name}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>{est.ytd_quotes}</td>
                <td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 700 }}>{est.ytd_won}</td>
                <td style={{ textAlign: 'right' }}><span style={{ color: est.win_rate >= 0.5 ? 'var(--green)' : 'var(--orange)', fontWeight: 700 }}>{formatRatio(est.win_rate)}</span></td>
                <td style={{ textAlign: 'right' }}>{compactMoney(est.total_bid)}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--brand)' }}>{compactMoney(est.captured)}</td>
                <td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 700 }}>{formatRatio(est.captured / est.total_bid)}</td>
                <td style={{ textAlign: 'right', color: 'var(--green)' }}>{formatRatio(est.avg_margin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Team Monthly Capture</h2><span>Total bid vs captured by month</span></div>
        <MiniLineChart data={teamMonthly} seriesKeys={['bid', 'cap']} seriesColors={['var(--gold)', 'var(--brand)']} height={180} />
        <div className="chart-legend" style={{ padding: '0 18px 14px' }}>
          <span><i style={{ background: 'var(--gold)' }} />Team Bid</span>
          <span><i style={{ background: 'var(--brand)' }} />Team Captured</span>
        </div>
      </section>
    </>
  );
}

function ChiefFinancials() {
  const monthKeys   = ['2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01', '2026-05-01'];
  const teamMonthly = monthKeys.map((mk, i) => ({
    month: mk,
    alex:   demoEstimatorMonthlyData[1][i]?.captured_value || 0,
    jordan: demoEstimatorMonthlyData[2][i]?.captured_value || 0,
    taylor: demoEstimatorMonthlyData[3][i]?.captured_value || 0,
    morgan: demoEstimatorMonthlyData[4][i]?.captured_value || 0,
  }));
  const totalBid  = demoEstimators.reduce((s, e) => s + e.total_bid, 0);
  const totalCap  = demoEstimators.reduce((s, e) => s + e.captured, 0);
  const totalPipe = demoEstimators.reduce((s, e) => s + e.pipeline_value, 0);
  const avgMargin = demoEstimators.reduce((s, e) => s + e.avg_margin, 0) / demoEstimators.length;
  const maxCap    = Math.max(...demoEstimators.map((e) => e.captured), 1);

  return (
    <>
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <StatCard label="Total Bid Volume" value={compactMoney(totalBid)}    note="YTD across team" />
        <StatCard label="Total Captured"   value={compactMoney(totalCap)}    note="Revenue won YTD" />
        <StatCard label="Open Pipeline"    value={compactMoney(totalPipe)}   note="Active deal value" />
        <StatCard label="Avg Team Margin"  value={formatRatio(avgMargin)}    note="Gross margin YTD" />
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <section className="panel">
          <div className="panel-head"><h2>Revenue by Estimator</h2><span>YTD captured value</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {[...demoEstimators].sort((a, b) => b.captured - a.captured).map((est) => (
              <PmBar key={est.id} label={`${est.name} — ${est.territory_name}`} value={est.captured} max={maxCap} color={EST_COLORS[est.id - 1]} />
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Financial Summary</h2><span>Team-wide totals</span></div>
          <div style={{ padding: '16px 18px' }}>
            {[
              ['Total Bid Submitted',    currency(totalBid),             'var(--gold)'],
              ['Total Captured',         currency(totalCap),             'var(--green)'],
              ['Open Pipeline',          currency(totalPipe),            'var(--brand)'],
              ['Expected Capture (50%)', currency(totalPipe * 0.5),      'var(--orange)'],
              ['Expected Gross Profit',  currency(totalCap * avgMargin), 'var(--green)'],
              ['Overall Win Rate',       formatRatio(totalCap / totalBid), 'var(--green)'],
              ['Avg Team Margin',        formatRatio(avgMargin),         'var(--green)'],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
                <strong style={{ color }}>{value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Per-Estimator Revenue Trend</h2><span>Monthly captured value by estimator</span></div>
        <MiniLineChart data={teamMonthly} seriesKeys={['alex', 'jordan', 'taylor', 'morgan']} seriesColors={EST_COLORS} height={180} />
        <div className="chart-legend" style={{ padding: '0 18px 14px' }}>
          {demoEstimators.map((est, i) => (
            <span key={est.id}><i style={{ background: EST_COLORS[i] }} />{est.name.split(' ')[0]}</span>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── ChiefEstimatorDashboard ────────────────────────────────────────────────

function ChiefEstimatorDashboard({ user }) {
  const [activeView,   setActiveView]   = useState('dashboard');
  const [selectedEst,  setSelectedEst]  = useState(null);

  const navGroups = [
    { label: 'OVERVIEW',  items: [['dashboard', 'Dashboard'], ['performance', 'Performance Board']] },
    { label: 'PIPELINE',  items: [['opportunities', 'All Opportunities'], ['bids', 'Bids & Quotes'], ['projects', 'Projects']] },
    { label: 'ANALYTICS', items: [['lift', 'Lift & Capture'], ['financials', 'Financials'], ['reports', 'Reports']] },
    { label: null,        items: [['schedule', 'Schedule']] },
  ];
  const navUtil = [['messages', 'Messages'], ['documents', 'Documents'], ['alerts', 'Alerts'], ['settings', 'Settings']];
  const allItems = navGroups.flatMap((g) => g.items).concat(navUtil);
  const currentLabel = allItems.find(([id]) => id === activeView)?.[1] || '';

  function initials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2).toUpperCase();
  }
  function formatRole(role) {
    if (!role) return 'Chief Estimator';
    return role.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="James Blinds" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 7, background: 'rgba(255,255,255,0.92)', padding: 3, flexShrink: 0 }} />
          <div><strong>James Blinds</strong><span>Mission Control</span></div>
        </div>
        {navGroups.map((group, gi) => (
          <React.Fragment key={gi}>
            {group.label && <div className="nav-section-label">{group.label}</div>}
            {group.items.map(([id, label]) => (
              <button key={id} className={activeView === id ? 'nav-active' : ''} onClick={() => setActiveView(id)} type="button">{label}</button>
            ))}
          </React.Fragment>
        ))}
        <div className="nav-divider" />
        {navUtil.map(([id, label]) => (
          <button key={id} className={activeView === id ? 'nav-active' : ''} onClick={() => setActiveView(id)} type="button">{label}</button>
        ))}
        <div className="user-card">
          <div className="user-avatar">{initials(user.name)}</div>
          <div className="user-info"><strong>{user.name}</strong><span>{formatRole(user.role)}</span></div>
        </div>
      </aside>

      <main className="dashboard">
        <header className="page-head">
          <div><p>All Territories</p><h1>{currentLabel}</h1></div>
          <div className="actions">
            <div style={{ padding: '10px 14px', background: '#eef3f6', borderRadius: 6, color: 'var(--brand)', fontWeight: 700, fontSize: 14, border: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
              Chief Estimator — Full Access
            </div>
            <button type="button">Refresh Data</button>
          </div>
        </header>

        {activeView === 'dashboard'     && <ChiefTeamOverview     key="dash"  onSelectEstimator={setSelectedEst} />}
        {activeView === 'performance'   && <ChiefPerformanceBoard key="perf"  onSelectEstimator={setSelectedEst} />}
        {activeView === 'opportunities' && <ChiefAllOpportunities key="opps"  onSelectEstimator={setSelectedEst} />}
        {activeView === 'bids'          && <ChiefBidsQuotes       key="bids" />}
        {activeView === 'projects'      && <ProjectsView          key="proj" projects={demoProjects} />}
        {activeView === 'lift'          && <ChiefLiftCapture      key="lift" />}
        {activeView === 'financials'    && <ChiefFinancials       key="fin" />}
        {activeView === 'reports'       && <PlaceholderView title="Reports"   icon="📊" description="Team-wide estimate summary, win/loss analysis, and territory breakdowns coming soon." />}
        {activeView === 'schedule'      && <EstScheduleView       key="sched" visits={demoSiteVisits} />}
        {activeView === 'messages'      && <PlaceholderView title="Messages"  icon="💬" description="Team messaging and estimator communication threads coming soon." />}
        {activeView === 'documents'     && <PlaceholderView title="Documents" icon="📄" description="Estimate templates, past quotes, and scope sheets coming soon." />}
        {activeView === 'alerts'        && <PlaceholderView title="Alerts"    icon="🔔" description="Underpriced job flags, missing measurements, and deadline alerts coming soon." />}
        {activeView === 'settings'      && <PlaceholderView title="Settings"  icon="⚙️" description="Team configuration, territory assignments, and notification settings coming soon." />}

        {selectedEst && <EstimatorProfilePanel estimator={selectedEst} onClose={() => setSelectedEst(null)} />}
      </main>
    </div>
  );
}

// ─── EstimatorDashboard ────────────────────────────────────────────────────

function EstimatorDashboard({ user }) {
  const [activeView, setActiveView] = useState('dashboard');
  const lockedArea  = user.territoryId ? Number(user.territoryId) : 0;
  const [areaId, setAreaId] = useState(lockedArea || 0);

  const tName           = areaId ? territoryNames[areaId] : null;
  const filteredOpps    = tName ? demoOpportunities.filter((o) => o.territory_name === tName) : demoOpportunities;
  const filteredEsts    = tName ? demoEstimates.filter((e) => e.territory_name === tName) : demoEstimates;
  const filteredVisits  = tName ? demoSiteVisits.filter((v) => v.territory_name === tName) : demoSiteVisits;
  const filteredScopes  = tName ? demoScopeItems.filter((s) => s.territory_name === tName) : demoScopeItems;

  const navMain = [
    ['dashboard',   'Dashboard'],
    ['pipeline',    'Pipeline'],
    ['estimates',   'Active Estimates'],
    ['bids',        'Bids & Quotes'],
    ['lift',        'Lift & Capture'],
    ['performance', 'Performance'],
    ['scope',       'Scope Viewer'],
    ['schedule',    'Schedule'],
    ['financials',  'Financials'],
    ['reports',     'Reports'],
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
    if (!role) return 'Estimator';
    return role.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="James Blinds" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 7, background: 'rgba(255,255,255,0.92)', padding: 3, flexShrink: 0 }} />
          <div><strong>James Blinds</strong><span>Mission Control</span></div>
        </div>
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
            <button type="button">Refresh Data</button>
          </div>
        </header>

        {activeView === 'dashboard'   && <EstDashboardHome        key={areaId} opportunities={filteredOpps} estimates={filteredEsts} metrics={demoEstimatorMonthly} />}
        {activeView === 'pipeline'    && <EstPipelineView         key={areaId} opportunities={filteredOpps} />}
        {activeView === 'estimates'   && <EstActiveEstimatesView  key={areaId} estimates={filteredEsts} />}
        {activeView === 'bids'        && <EstBidsQuotesView       key={areaId} opportunities={filteredOpps} />}
        {activeView === 'lift'        && <EstLiftCaptureView      key={areaId} metrics={demoEstimatorMonthly} opportunities={filteredOpps} />}
        {activeView === 'performance' && <EstPerformanceView      key={areaId} metrics={demoEstimatorMonthly} />}
        {activeView === 'scope'       && <EstScopeView            key={areaId} scopes={filteredScopes} />}
        {activeView === 'schedule'    && <EstScheduleView         key={areaId} visits={filteredVisits} />}
        {activeView === 'financials'  && <EstFinancialsView       key={areaId} opportunities={filteredOpps} metrics={demoEstimatorMonthly} />}
        {activeView === 'reports'     && <PlaceholderView         key={areaId} title="Reports"   icon="📊" description="Estimate summary, win/loss analysis, and turnaround time reports coming soon." />}
        {activeView === 'messages'    && <PlaceholderView         key={areaId} title="Messages"  icon="💬" description="Team messaging and client communication threads coming soon." />}
        {activeView === 'documents'   && <PlaceholderView         key={areaId} title="Documents" icon="📄" description="Estimate templates, past quotes, and scope sheets coming soon." />}
        {activeView === 'alerts'      && <PlaceholderView         key={areaId} title="Alerts"    icon="🔔" description="Underpriced job flags, missing measurements, and deadline alerts coming soon." />}
        {activeView === 'settings'    && <PlaceholderView         key={areaId} title="Settings"  icon="⚙️" description="User preferences, territory assignments, and notification settings coming soon." />}
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (user.role === 'chief_estimator') return <ChiefEstimatorDashboard user={user} />;
  if (user.role === 'estimator') return <EstimatorDashboard user={user} />;
  return <ProjectManagerDashboard user={user} />;
}

createRoot(document.getElementById('root')).render(<App />);
