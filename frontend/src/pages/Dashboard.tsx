import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { getDashboardData } from '../services/dashboardService'
import type { Project } from '../domain/types/project'
import type { Installation } from '../domain/types/installation'
import type { Task } from '../domain/types/task'
import type { TerritoryMetric } from '../services/dashboardService'

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

function usd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}k`
  return `$${n.toFixed(0)}`
}

function shortDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(iso))
}

// ---------------------------------------------------------------------------
// Status display helpers
// ---------------------------------------------------------------------------

const PROJECT_STATUS_LABEL: Record<string, string> = {
  lead: 'Lead', bidding: 'Bidding', awarded: 'Awarded',
  pre_production: 'Pre-Production', in_production: 'In Production',
  punch: 'Punch', completed: 'Completed', on_hold: 'On Hold', cancelled: 'Cancelled',
}

const PROJECT_STATUS_BADGE: Record<string, string> = {
  lead: 'neutral', bidding: 'neutral', awarded: 'info',
  pre_production: 'info', in_production: 'warning',
  punch: 'warning', completed: 'success', on_hold: 'neutral', cancelled: 'danger',
}

const TASK_TYPE_ICON: Record<string, string> = {
  measure: '📐', order_material: '📦', submittal: '📋',
  punch: '🔧', install: '🗓', billing: '💰',
  coordination: '📞', document: '📄', other: '•',
}

const PRIORITY_BADGE: Record<string, string> = {
  low: 'neutral', normal: 'neutral', high: 'warning', urgent: 'danger',
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  label, value, sub, accent, highlight,
}: {
  label: string; value: string | number; sub?: string; accent?: string; highlight?: boolean
}) {
  return (
    <div
      className="stat-card"
      style={{
        borderTop: `3px solid ${accent ?? 'var(--color-brand)'}`,
        background: highlight ? '#fffbf0' : undefined,
      }}
    >
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  )
}

function ProjectRow({ project }: { project: Project }) {
  const badge = PROJECT_STATUS_BADGE[project.status] ?? 'neutral'
  return (
    <tr>
      <td>
        <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--color-text-muted)' }}>
          {project.projectNumber}
        </span>
      </td>
      <td style={{ maxWidth: 260 }}>
        <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {project.projectName}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          {project.generalContractor}
        </div>
      </td>
      <td>
        <span style={{
          display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 7px',
          borderRadius: 3, background: 'var(--color-bg)', border: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
        }}>
          {project.territory}
        </span>
      </td>
      <td>
        <span className={`badge badge-${badge}`}>
          {PROJECT_STATUS_LABEL[project.status] ?? project.status}
        </span>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 60, height: 5, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden',
          }}>
            <div style={{
              width: `${project.financials.percentComplete}%`,
              height: '100%',
              background: project.financials.percentComplete >= 90
                ? 'var(--color-success)'
                : project.financials.percentComplete >= 50
                ? 'var(--color-info)'
                : 'var(--color-warning)',
            }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            {project.financials.percentComplete}%
          </span>
        </div>
      </td>
      <td style={{ fontWeight: 600, fontSize: 13 }}>
        {usd(project.financials.contractValue.totalContract)}
      </td>
    </tr>
  )
}

function InstallCard({ inst }: { inst: Installation }) {
  const d = new Date(inst.scheduledInstallDate!)
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '10px 0', borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        background: 'var(--color-info-bg)', color: 'var(--color-info)',
        borderRadius: 6, padding: '6px 10px', textAlign: 'center', minWidth: 44, flexShrink: 0,
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1 }}>{d.getDate()}</div>
        <div style={{ fontSize: 10, fontWeight: 600 }}>
          {d.toLocaleString('en-US', { month: 'short' })}
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 1 }}>
          {inst.projectName.split('—')[0].trim()}
        </div>
        <div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.3 }}>
          {inst.section ?? inst.location}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, display: 'flex', gap: 8 }}>
          {inst.assignedTo && <span>{inst.assignedTo}</span>}
          {inst.hasMotors && <span style={{ color: 'var(--color-info)' }}>Motorized</span>}
          {inst.hasPockets && <span style={{ color: 'var(--color-warning)' }}>Pockets</span>}
        </div>
      </div>
    </div>
  )
}

function TaskRow({ task }: { task: Task }) {
  const icon = TASK_TYPE_ICON[task.type] ?? '•'
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 13 }}>{icon}</span>
          <span style={{
            fontWeight: 500, fontSize: 13,
            textDecoration: task.status === 'done' ? 'line-through' : undefined,
            color: task.status === 'done' ? 'var(--color-text-muted)' : undefined,
          }}>
            {task.title}
          </span>
        </div>
      </td>
      <td>
        <span className={`badge badge-${PRIORITY_BADGE[task.priority]}`}>
          {task.priority}
        </span>
      </td>
      <td className="text-muted text-sm">
        {task.dueDate ? shortDate(task.dueDate) : '—'}
      </td>
      <td className="text-muted text-sm">{task.assignedTo ?? '—'}</td>
    </tr>
  )
}

function TerritoryCard({ t }: { t: TerritoryMetric }) {
  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 8, padding: '14px 16px', flex: 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{
          fontWeight: 800, fontSize: 18, color: 'var(--color-brand)',
          fontVariant: 'small-caps', letterSpacing: 1,
        }}>
          {t.territory}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '2px 8px',
          background: 'var(--color-info-bg)', color: 'var(--color-info)',
          borderRadius: 99,
        }}>
          {t.activeProjectCount} active
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{t.label}</div>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{usd(t.pipelineValue)}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>pipeline</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dashboard page
// ---------------------------------------------------------------------------

export function Dashboard() {
  // In future: replace getDashboardData() with a useEffect + Supabase service call
  const data = useMemo(() => getDashboardData(), [])
  const { stats, recentProjects, upcomingInstallations, openTasks, territoryBreakdown, billingTrend } = data

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <AppLayout title="Dashboard">
      <PageHeader
        title="Good morning, James"
        subtitle={today}
      />

      {/* ── Stats row ────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 14, marginBottom: 24,
      }}>
        <StatCard
          label="Active Projects"
          value={stats.activeProjectCount}
          sub="in production or punch"
          accent="var(--color-brand)"
        />
        <StatCard
          label="Pipeline Value"
          value={usd(stats.totalPipelineValue)}
          sub="awarded + active"
          accent="var(--color-info)"
        />
        <StatCard
          label="May Billing"
          value={usd(stats.currentMonthBilling)}
          sub={`${stats.readyToBillCount} invoices to send`}
          accent="var(--color-accent)"
          highlight={stats.readyToBillCount > 0}
        />
        <StatCard
          label="Installs This Week"
          value={stats.installsThisWeek}
          accent="var(--color-warning)"
        />
        <StatCard
          label="Open Tasks"
          value={stats.pendingTaskCount}
          sub="todo + in progress"
          accent={stats.pendingTaskCount > 8 ? 'var(--color-danger)' : 'var(--color-text-muted)'}
        />
      </div>

      {/* ── Territory breakdown ───────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {territoryBreakdown.map(t => <TerritoryCard key={t.territory} t={t} />)}
      </div>

      {/* ── Main grid ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 20 }}>

        {/* Recent projects */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 600 }}>Active Projects</span>
            <Link to="/jobs" className="btn btn-outline" style={{ fontSize: 11, padding: '4px 10px' }}>
              View All
            </Link>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Job #</th>
                <th>Project</th>
                <th>Territory</th>
                <th>Status</th>
                <th>Complete</th>
                <th>Contract</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map(p => <ProjectRow key={p.id} project={p} />)}
            </tbody>
          </table>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Upcoming installs */}
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span>Upcoming Installs</span>
              <Link to="/installations" style={{ fontSize: 11, color: 'var(--color-brand)' }}>All</Link>
            </div>
            {upcomingInstallations.length === 0
              ? <p className="text-muted text-sm">No installs scheduled this week.</p>
              : upcomingInstallations.map(i => <InstallCard key={i.id} inst={i} />)
            }
          </div>

          {/* May billing */}
          {data.readyToBillInvoices.length > 0 && (
            <div className="card" style={{ borderTop: '3px solid var(--color-accent)' }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>Ready to Bill</div>
              {data.readyToBillInvoices.slice(0, 4).map(inv => (
                <div key={inv.id} style={{
                  padding: '8px 0', borderBottom: '1px solid var(--color-border)',
                  fontSize: 12,
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-brand)' }}>
                    {inv.projectNumber}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <span className="text-muted" style={{ fontSize: 11 }}>
                      {inv.projectName.split('—')[0].trim()}
                    </span>
                    <span style={{ fontWeight: 700 }}>{usd(inv.currentBillingAmount)}</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-text-muted)' }}>
                Total: <strong>{usd(data.readyToBillInvoices.reduce((s, i) => s + i.currentBillingAmount, 0))}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Open tasks + billing trend ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Open tasks */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 600 }}>Open Tasks</span>
            <Link to="/tasks" className="btn btn-outline" style={{ fontSize: 11, padding: '4px 10px' }}>
              View All
            </Link>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Due</th>
                <th>Assigned</th>
              </tr>
            </thead>
            <tbody>
              {openTasks.map(t => <TaskRow key={t.id} task={t} />)}
            </tbody>
          </table>
        </div>

        {/* Billing trend */}
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 16 }}>2026 Billing Trend</div>
          {billingTrend.map(m => (
            <div key={m.month} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ fontWeight: 500 }}>{m.month}</span>
                <span style={{ fontWeight: 700 }}>{usd(m.billed)}</span>
              </div>
              <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  background: m.paid === m.billed && m.billed > 0
                    ? 'var(--color-success)'
                    : 'var(--color-info)',
                  width: m.billed > 0
                    ? `${Math.min((m.billed / 300000) * 100, 100)}%`
                    : '0%',
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {m.paid > 0 && m.paid === m.billed
                  ? 'Paid'
                  : m.paid > 0
                  ? `${usd(m.paid)} paid`
                  : m.billed > 0
                  ? 'Pending / in progress'
                  : 'In progress'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
