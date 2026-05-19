-- Migration: rename status → stage, add is_on_hold, add new tables
-- Run once: psql -d james_blinds_mvp -f database/migrate_stage.sql

-- 1. Rename column
ALTER TABLE projects RENAME COLUMN status TO stage;

-- 2. Migrate existing data to new stage values
UPDATE projects SET stage = 'bid'      WHERE stage = 'pending';
UPDATE projects SET stage = 'ordered'  WHERE stage = 'active';
UPDATE projects SET stage = 'complete' WHERE stage = 'completed';
-- 'cancelled' stays as-is

-- 3. Add is_on_hold
ALTER TABLE projects ADD COLUMN is_on_hold BOOLEAN NOT NULL DEFAULT FALSE;

-- 4. Stage transition history
CREATE TABLE IF NOT EXISTS project_stage_log (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  from_stage VARCHAR,
  to_stage   VARCHAR NOT NULL,
  changed_by INTEGER REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  note       TEXT
);

-- 5. Punch items
CREATE TABLE IF NOT EXISTS punch_items (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  description TEXT,
  resolved    BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolved_by INTEGER REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
