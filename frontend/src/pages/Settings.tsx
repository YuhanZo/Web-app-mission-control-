import { useEffect, useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { supabase, supabaseConfigured } from '../lib/supabaseClient'

type DbStatus = 'checking' | 'connected' | 'error'

interface TableInfo {
  name: string
  count: number | null
}

const TABLES = [
  'customers', 'jobs', 'quotes', 'orders',
  'installations', 'inventory_items', 'tasks', 'staff_users',
]

export function Settings() {
  const [dbStatus, setDbStatus] = useState<DbStatus>('checking')
  const [tables, setTables] = useState<TableInfo[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!supabaseConfigured) {
      setDbStatus('error')
      setErrorMsg('No .env file found. Copy .env.example → .env and add your Supabase credentials.')
      return
    }

    async function checkConnection() {
      try {
        const { error } = await supabase.from('staff_users').select('id', { count: 'exact', head: true })
        if (error) {
          setDbStatus('error')
          setErrorMsg(error.message)
          return
        }

        setDbStatus('connected')

        // Fetch row counts for all tables
        const results = await Promise.all(
          TABLES.map(async (name) => {
            const { count } = await supabase
              .from(name)
              .select('*', { count: 'exact', head: true })
            return { name, count }
          })
        )
        setTables(results)
      } catch (e) {
        setDbStatus('error')
        setErrorMsg(String(e))
      }
    }

    checkConnection()
  }, [])

  return (
    <AppLayout title="Settings">
      <PageHeader title="Settings" subtitle="System configuration and preferences" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

        {/* Database status card */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 15 }}>Database Connection</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            {dbStatus === 'checking' && <span className="badge badge-neutral">Checking...</span>}
            {dbStatus === 'connected' && <span className="badge badge-success">Connected</span>}
            {dbStatus === 'error' && <span className="badge badge-danger">Connection Error</span>}
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              {import.meta.env.VITE_SUPABASE_URL}
            </span>
          </div>

          {dbStatus === 'error' && (
            <div style={{
              background: 'var(--color-danger-bg)', color: 'var(--color-danger)',
              padding: '10px 14px', borderRadius: 6, fontSize: 12, marginBottom: 16,
            }}>
              {errorMsg || 'Could not reach Supabase. Check your .env and run the migration.'}
            </div>
          )}

          {dbStatus === 'connected' && tables.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Table Row Counts
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {tables.map(t => (
                  <div key={t.name} style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                  }}>
                    <span style={{ fontWeight: 600 }}>{t.name}</span>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: 6 }}>
                      {t.count ?? 0} rows
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dbStatus === 'error' && (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              <strong>To fix:</strong> Make sure you ran <code>supabase/migrations/001_initial_schema.sql</code> in Supabase SQL Editor.
            </div>
          )}
        </div>

        {/* Other settings cards */}
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Business Details</div>
          <p className="text-muted" style={{ fontSize: 13 }}>Company name, address, ABN, and contact info.</p>
          <button className="btn btn-outline" style={{ marginTop: 16 }}>Edit Business Details</button>
        </div>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Staff Users</div>
          <p className="text-muted" style={{ fontSize: 13 }}>Manage team members, roles, and permissions.</p>
          <button className="btn btn-outline" style={{ marginTop: 16 }}>Manage Staff</button>
        </div>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Products & Pricing</div>
          <p className="text-muted" style={{ fontSize: 13 }}>Manage product catalogue, pricing, and suppliers.</p>
          <button className="btn btn-outline" style={{ marginTop: 16 }}>View Products</button>
        </div>
      </div>
    </AppLayout>
  )
}
