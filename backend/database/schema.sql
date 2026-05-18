-- James Blinds Mission Control - Database Schema
-- Run from the repo root:
--   psql -U postgres -d james_blinds_mvp -f backend/database/schema.sql

CREATE TABLE IF NOT EXISTS territories (
  id         SERIAL PRIMARY KEY,
  code       VARCHAR(10) NOT NULL UNIQUE,
  name       VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
  id   SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR NOT NULL,
  email         VARCHAR NOT NULL UNIQUE,
  phone         VARCHAR,
  user_type     VARCHAR,
  role_id       INTEGER REFERENCES roles(id),
  territory_id  INTEGER REFERENCES territories(id),
  active        BOOLEAN DEFAULT true,
  password_hash VARCHAR NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR NOT NULL,
  state         VARCHAR(10),
  company_type  VARCHAR,
  territory_id  INTEGER REFERENCES territories(id),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id            SERIAL PRIMARY KEY,
  company_id    INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  first_name    VARCHAR,
  last_name     VARCHAR,
  title         VARCHAR,
  email         VARCHAR,
  phone         VARCHAR,
  contact_type  VARCHAR,
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id                          SERIAL PRIMARY KEY,
  job_number                  INTEGER,
  project_name                VARCHAR NOT NULL,
  company_id                  INTEGER REFERENCES companies(id),
  customer_user_id            INTEGER REFERENCES users(id),
  territory_id                INTEGER REFERENCES territories(id),
  project_manager_user_id     INTEGER REFERENCES users(id),
  status                      VARCHAR,
  payroll_reporting           BOOLEAN DEFAULT false,
  original_contract           NUMERIC(14,2) DEFAULT 0,
  approved_change_orders      NUMERIC(14,2) DEFAULT 0,
  total_contract              NUMERIC(14,2) DEFAULT 0,
  estimated_material_cost     NUMERIC(14,2) DEFAULT 0,
  estimated_labor_cost        NUMERIC(14,2) DEFAULT 0,
  total_estimate              NUMERIC(14,2) DEFAULT 0,
  contract_value              NUMERIC(14,2),
  start_date                  DATE,
  install_start_date          DATE,
  install_end_date            DATE,
  completion_date             DATE,
  created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_users (
  id                SERIAL PRIMARY KEY,
  project_id        INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
  relationship_type VARCHAR,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compatibility upgrades for databases created from the earlier MVP schema.
ALTER TABLE users
ADD COLUMN IF NOT EXISTS territory_id INTEGER;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS job_number INTEGER,
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id),
ADD COLUMN IF NOT EXISTS payroll_reporting BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_contract NUMERIC(14,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS approved_change_orders NUMERIC(14,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_contract NUMERIC(14,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_material_cost NUMERIC(14,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_labor_cost NUMERIC(14,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_estimate NUMERIC(14,2) DEFAULT 0;

CREATE TABLE IF NOT EXISTS change_orders (
  id                     SERIAL PRIMARY KEY,
  project_id             INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  co_number              VARCHAR,
  description            TEXT,
  amount                 NUMERIC(14,2),
  estimated_cost_change  NUMERIC(14,2),
  created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS monthly_billings (
  id                          SERIAL PRIMARY KEY,
  project_id                  INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  billing_month               DATE NOT NULL,
  bill_due_day                INTEGER,
  description                 TEXT,
  material_inventory_cost     NUMERIC(14,2) DEFAULT 0,
  qbo_cost_to_date            NUMERIC(14,2) DEFAULT 0,
  prior_cogs                  NUMERIC(14,2) DEFAULT 0,
  cost_to_recognize           NUMERIC(14,2) DEFAULT 0,
  percent_complete            NUMERIC(8,4) DEFAULT 0,
  previous_billed             NUMERIC(14,2) DEFAULT 0,
  bill_this_month             NUMERIC(14,2) DEFAULT 0,
  accrued_retainage           NUMERIC(14,2) DEFAULT 0,
  total_billed_to_date        NUMERIC(14,2) DEFAULT 0,
  remaining_to_bill           NUMERIC(14,2) DEFAULT 0,
  revenue_earned_to_date      NUMERIC(14,2) DEFAULT 0,
  under_over_billed           NUMERIC(14,2) DEFAULT 0,
  invoice_sent                BOOLEAN DEFAULT false,
  qbo_sales_entry             VARCHAR,
  qbo_invoice_number          VARCHAR,
  created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bids (
  id                   SERIAL PRIMARY KEY,
  company_id           INTEGER REFERENCES companies(id),
  territory_id         INTEGER REFERENCES territories(id),
  project_name         VARCHAR,
  bid_date             DATE,
  bid_amount           NUMERIC(14,2),
  estimated_gp         NUMERIC(14,2),
  estimated_np         NUMERIC(14,2),
  estimated_hours      NUMERIC(14,2),
  bid_status           VARCHAR DEFAULT 'pending',
  won                  BOOLEAN DEFAULT false,
  notes                TEXT,
  created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bid_invitations (
  id             SERIAL PRIMARY KEY,
  company_id     INTEGER REFERENCES companies(id),
  contact_id     INTEGER REFERENCES contacts(id),
  invite_date    DATE,
  invite_count   INTEGER DEFAULT 1,
  comments       TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interactions (
  id                   SERIAL PRIMARY KEY,
  company_id           INTEGER REFERENCES companies(id),
  contact_id           INTEGER REFERENCES contacts(id),
  interaction_date     DATE,
  interaction_type     VARCHAR,
  notes                TEXT,
  created_by           VARCHAR,
  created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS monthly_metrics (
  id                         SERIAL PRIMARY KEY,
  metric_month               DATE NOT NULL,
  number_of_projects         INTEGER,
  bids_sent                  INTEGER,
  total_bid_value            NUMERIC(14,2),
  total_bid_gp               NUMERIC(14,2),
  total_bid_gp_percent       NUMERIC(8,4),
  bids_won                   INTEGER,
  total_won_value            NUMERIC(14,2),
  gp_dollars                 NUMERIC(14,2),
  gp_percent                 NUMERIC(8,4),
  np_dollars                 NUMERIC(14,2),
  np_percent                 NUMERIC(8,4),
  installer_hours            NUMERIC(14,2),
  profit_per_man_hour        NUMERIC(14,2),
  hit_rate                   NUMERIC(8,4),
  capture_rate               NUMERIC(8,4),
  pipeline_value             NUMERIC(14,2),
  pipeline_gp                NUMERIC(14,2),
  pipeline_gp_percent        NUMERIC(8,4),
  created_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS weekly_metrics (
  id                         SERIAL PRIMARY KEY,
  year                       INTEGER NOT NULL,
  week_label                 VARCHAR,
  projects_count             INTEGER,
  bids_sent                  INTEGER,
  total_bid_value            NUMERIC(14,2),
  np_dollars                 NUMERIC(14,2),
  profit_margin              NUMERIC(8,4),
  mgp_dollars                NUMERIC(14,2),
  mgp_percent                NUMERIC(8,4),
  multifamily_projects       INTEGER,
  multifamily_percent        NUMERIC(8,4),
  biz_dev_hours              NUMERIC(10,2),
  created_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS multifamily_feedback (
  id                          SERIAL PRIMARY KEY,
  project_name                VARCHAR,
  gc_company                  VARCHAR,
  location                    VARCHAR,
  miles_from_orlando          NUMERIC(10,2),
  miles_from_columbus         NUMERIC(10,2),
  blinds_quantity             INTEGER,
  product_used                VARCHAR,
  warehouse_type              VARCHAR,
  bid_amount                  NUMERIC(14,2),
  np_percent                  NUMERIC(8,4),
  gp_percent                  NUMERIC(8,4),
  ppmh                        NUMERIC(14,2),
  winning_bid_info            TEXT,
  created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quickbooks_sync (
  id                    SERIAL PRIMARY KEY,
  project_id            INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  qbo_sales_entry       VARCHAR,
  qbo_invoice_number    VARCHAR,
  sync_status           VARCHAR,
  last_synced_at        TIMESTAMP,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_territory_id
ON users(territory_id);

CREATE INDEX IF NOT EXISTS idx_companies_territory_id
ON companies(territory_id);

CREATE INDEX IF NOT EXISTS idx_projects_company_id
ON projects(company_id);

CREATE INDEX IF NOT EXISTS idx_projects_territory_id
ON projects(territory_id);

CREATE INDEX IF NOT EXISTS idx_projects_manager_id
ON projects(project_manager_user_id);

CREATE INDEX IF NOT EXISTS idx_contacts_company_id
ON contacts(company_id);

CREATE INDEX IF NOT EXISTS idx_bids_company_id
ON bids(company_id);

CREATE INDEX IF NOT EXISTS idx_monthly_billings_project_id
ON monthly_billings(project_id);

CREATE INDEX IF NOT EXISTS idx_change_orders_project_id
ON change_orders(project_id);

CREATE INDEX IF NOT EXISTS idx_interactions_company_id
ON interactions(company_id);
