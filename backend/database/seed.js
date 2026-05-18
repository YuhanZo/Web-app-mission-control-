// Seed script - inserts roles, users, companies, projects, billings, bids, and metrics.
// Run after schema.sql: npm run seed
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const PASSWORD = 'password123';

const ROLES = [
  'admin',
  'executive',
  'project_manager',
  'estimator',
  'installer',
  'accounting',
  'support_specialist',
];

const TERRITORIES = [
  { code: 'CLT', name: 'Charlotte Metro' },
  { code: 'LKN', name: 'Lake Norman' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'TRI', name: 'Triad' },
];

const USERS = [
  { name: 'Admin User', email: 'admin@jamesblinds.com', role: 'admin', territory: null, phone: '704-555-0100' },
  { name: 'Maya Johnson', email: 'maya.pm@jamesblinds.com', role: 'project_manager', territory: 'CLT', phone: '704-555-0110' },
  { name: 'Chris Walker', email: 'chris.pm@jamesblinds.com', role: 'project_manager', territory: 'LKN', phone: '704-555-0111' },
  { name: 'Olivia Reed', email: 'olivia.estimator@jamesblinds.com', role: 'estimator', territory: 'CLT', phone: '704-555-0120' },
  { name: 'Nate Brooks', email: 'nate.installer@jamesblinds.com', role: 'installer', territory: 'SC', phone: '704-555-0130' },
  { name: 'Avery Stone', email: 'avery.accounting@jamesblinds.com', role: 'accounting', territory: null, phone: '704-555-0140' },
];

const COMPANIES = [
  { name: 'Brookline Builders',           state: 'NC', company_type: 'general_contractor', territory: 'CLT' },
  { name: 'Crescent Property Group',       state: 'NC', company_type: 'developer',          territory: 'CLT' },
  { name: 'Lakeside Hospitality Partners', state: 'NC', company_type: 'owner',              territory: 'LKN' },
  { name: 'Palmetto Commercial Interiors', state: 'SC', company_type: 'general_contractor', territory: 'SC'  },
  { name: 'Triad Multifamily Group',       state: 'NC', company_type: 'developer',          territory: 'TRI' },
  { name: 'SouthPark Capital Partners',    state: 'NC', company_type: 'developer',          territory: 'CLT' },
  { name: 'Greensboro Medical Properties', state: 'NC', company_type: 'owner',              territory: 'TRI' },
  { name: 'Huntersville Residential',      state: 'NC', company_type: 'developer',          territory: 'LKN' },
];

const CONTACTS = [
  { company: 'Brookline Builders',           first_name: 'Jordan',  last_name: 'Miles',    title: 'Senior PM',            email: 'jordan@brookline.example',  phone: '704-555-0201', contact_type: 'general_contractor', notes: 'Strong repeat customer. Prefers weekly Friday status updates.' },
  { company: 'Crescent Property Group',       first_name: 'Priya',   last_name: 'Shah',     title: 'Development Manager',  email: 'priya@crescent.example',    phone: '704-555-0202', contact_type: 'developer',          notes: 'Interested in faster closeout reporting.' },
  { company: 'Lakeside Hospitality Partners', first_name: 'Elliot',  last_name: 'Park',     title: 'Owner Rep',            email: 'elliot@lakeside.example',   phone: '704-555-0203', contact_type: 'owner',              notes: 'Budget sensitive; asks for retainage details.' },
  { company: 'Palmetto Commercial Interiors', first_name: 'Sara',    last_name: 'Bennett',  title: 'Operations Director',  email: 'sara@palmetto.example',     phone: '803-555-0204', contact_type: 'general_contractor', notes: 'Often has phased installation schedules.' },
  { company: 'SouthPark Capital Partners',    first_name: 'Marcus',  last_name: 'Finley',   title: 'VP of Construction',   email: 'marcus@southpark.example',  phone: '704-555-0205', contact_type: 'developer',          notes: 'Fast-tracks decisions. Prefers concise budget summaries.' },
  { company: 'Greensboro Medical Properties', first_name: 'Diane',   last_name: 'Okafor',   title: 'Facilities Director',  email: 'diane@gbomed.example',      phone: '336-555-0206', contact_type: 'owner',              notes: 'Strict infection-control scheduling during installs.' },
  { company: 'Huntersville Residential',      first_name: 'Tyler',   last_name: 'Drummond', title: 'Construction Manager', email: 'tyler@huntersres.example',  phone: '704-555-0207', contact_type: 'developer',          notes: 'Multifamily specialist. Wants unit-by-unit install tracking.' },
];

const PROJECTS = [
  {
    job_number: 24001,
    project_name: 'Uptown Medical Office Shades',
    company: 'Brookline Builders',
    territory: 'CLT',
    manager: 'maya.pm@jamesblinds.com',
    status: 'active',
    payroll_reporting: true,
    original_contract: 184500,
    approved_change_orders: 12500,
    estimated_material_cost: 76500,
    estimated_labor_cost: 38400,
    start_date: '2026-03-04',
    install_start_date: '2026-05-20',
    install_end_date: '2026-06-07',
  },
  {
    job_number: 24002,
    project_name: 'Crescent South Apartments',
    company: 'Crescent Property Group',
    territory: 'CLT',
    manager: 'maya.pm@jamesblinds.com',
    status: 'active',
    payroll_reporting: true,
    original_contract: 312000,
    approved_change_orders: 28500,
    estimated_material_cost: 142000,
    estimated_labor_cost: 68400,
    start_date: '2026-02-15',
    install_start_date: '2026-06-03',
    install_end_date: '2026-07-12',
  },
  {
    job_number: 24003,
    project_name: 'Lake Norman Hotel Renovation',
    company: 'Lakeside Hospitality Partners',
    territory: 'LKN',
    manager: 'chris.pm@jamesblinds.com',
    status: 'pending',
    payroll_reporting: false,
    original_contract: 226750,
    approved_change_orders: 0,
    estimated_material_cost: 93500,
    estimated_labor_cost: 51200,
    start_date: '2026-04-01',
    install_start_date: '2026-06-17',
    install_end_date: '2026-07-02',
  },
  {
    job_number: 24004,
    project_name: 'Palmetto Surgical Center',
    company: 'Palmetto Commercial Interiors',
    territory: 'SC',
    manager: 'maya.pm@jamesblinds.com',
    status: 'active',
    payroll_reporting: true,
    original_contract: 148900,
    approved_change_orders: 8400,
    estimated_material_cost: 61200,
    estimated_labor_cost: 30900,
    start_date: '2026-03-21',
    install_start_date: '2026-05-28',
    install_end_date: '2026-06-18',
  },
  {
    job_number: 24005,
    project_name: 'Riverfront Condo Unit 4B',
    company: 'Brookline Builders',
    territory: 'CLT',
    manager: 'maya.pm@jamesblinds.com',
    status: 'completed',
    payroll_reporting: false,
    original_contract: 26800,
    approved_change_orders: 3200,
    estimated_material_cost: 9800,
    estimated_labor_cost: 5200,
    start_date: '2026-01-12',
    install_start_date: '2026-02-03',
    install_end_date: '2026-02-05',
    completion_date: '2026-02-12',
  },
  {
    job_number: 24006,
    project_name: 'Triad Multifamily Phase 1',
    company: 'Triad Multifamily Group',
    territory: 'TRI',
    manager: 'chris.pm@jamesblinds.com',
    status: 'active',
    payroll_reporting: true,
    original_contract: 402500,
    approved_change_orders: 0,
    estimated_material_cost: 181000,
    estimated_labor_cost: 95500,
    start_date: '2026-04-18',
    install_start_date: '2026-07-08',
    install_end_date: '2026-08-22',
  },
  {
    job_number: 24007,
    project_name: 'Huntersville Luxury Apartments',
    company: 'Huntersville Residential',
    territory: 'LKN',
    manager: 'chris.pm@jamesblinds.com',
    status: 'active',
    payroll_reporting: true,
    original_contract: 412000,
    approved_change_orders: 0,
    estimated_material_cost: 185400,
    estimated_labor_cost: 98800,
    start_date: '2026-05-01',
    install_start_date: '2026-07-14',
    install_end_date: '2026-08-28',
  },
  {
    job_number: 24008,
    project_name: 'Greensboro Medical Complex',
    company: 'Greensboro Medical Properties',
    territory: 'TRI',
    manager: 'chris.pm@jamesblinds.com',
    status: 'completed',
    payroll_reporting: true,
    original_contract: 188000,
    approved_change_orders: 9500,
    estimated_material_cost:  84600,
    estimated_labor_cost:  44900,
    start_date: '2025-11-01',
    install_start_date: '2026-01-12',
    install_end_date: '2026-02-14',
    completion_date: '2026-02-28',
  },
  {
    job_number: 24009,
    project_name: 'SouthPark Capital Center',
    company: 'SouthPark Capital Partners',
    territory: 'CLT',
    manager: 'maya.pm@jamesblinds.com',
    status: 'pending',
    payroll_reporting: false,
    original_contract: 145000,
    approved_change_orders: 0,
    estimated_material_cost:  65250,
    estimated_labor_cost:  34750,
    start_date: '2026-06-01',
    install_start_date: '2026-08-04',
    install_end_date: '2026-08-22',
  },
  {
    job_number: 24010,
    project_name: 'Ballantyne Corporate Park Ph.3',
    company: 'Brookline Builders',
    territory: 'CLT',
    manager: 'maya.pm@jamesblinds.com',
    status: 'pending',
    payroll_reporting: false,
    original_contract: 285000,
    approved_change_orders: 0,
    estimated_material_cost: 128250,
    estimated_labor_cost:  68250,
    start_date: '2026-07-01',
    install_start_date: '2026-09-08',
    install_end_date: '2026-10-03',
  },
];

const CHANGE_ORDERS = [
  { job_number: 24001, co_number: 'CO-001', description: 'Add motorized conference room shades',              amount: 12500, estimated_cost_change: 6100 },
  { job_number: 24002, co_number: 'CO-001', description: 'Upgrade amenity spaces to blackout fabric',         amount: 18500, estimated_cost_change: 8200 },
  { job_number: 24002, co_number: 'CO-002', description: 'Additional units in building C',                    amount: 10000, estimated_cost_change: 4400 },
  { job_number: 24004, co_number: 'CO-001', description: 'Exam room privacy shade revisions',                 amount:  8400, estimated_cost_change: 3700 },
  { job_number: 24005, co_number: 'CO-001', description: 'Additional bedroom treatment',                      amount:  3200, estimated_cost_change: 1450 },
  { job_number: 24007, co_number: 'CO-001', description: 'Add solar shades to rooftop amenity level',        amount: 14200, estimated_cost_change: 6400 },
  { job_number: 24008, co_number: 'CO-001', description: 'Add motorized shades to radiology wing',            amount:  9500, estimated_cost_change: 4275 },
];

const MONTHLY_BILLINGS = [
  // Jan 2026 — 90+ days outstanding (oldest aging bucket)
  { job_number: 24008, billing_month: '2026-01-01', percent_complete: 0.25, previous_billed:      0, bill_this_month: 49375, accrued_retainage: 2469, invoice_sent: true,  qbo_invoice_number: 'INV-24008-01' },
  { job_number: 24001, billing_month: '2026-01-01', percent_complete: 0.10, previous_billed:      0, bill_this_month: 19700, accrued_retainage:  985, invoice_sent: true,  qbo_invoice_number: 'INV-24001-01' },

  // Feb 2026 — 61-90 days outstanding
  { job_number: 24005, billing_month: '2026-02-01', percent_complete:  1.0, previous_billed:  25000, bill_this_month:  5000, accrued_retainage: 1500, invoice_sent: true,  qbo_invoice_number: 'INV-24005-FINAL' },
  { job_number: 24008, billing_month: '2026-02-01', percent_complete: 0.70, previous_billed:  49375, bill_this_month: 87125, accrued_retainage: 4356, invoice_sent: true,  qbo_invoice_number: 'INV-24008-02' },
  { job_number: 24002, billing_month: '2026-02-01', percent_complete: 0.09, previous_billed:      0, bill_this_month: 30600, accrued_retainage: 1530, invoice_sent: true,  qbo_invoice_number: 'INV-24002-02' },

  // Mar 2026 — 31-60 days outstanding
  { job_number: 24001, billing_month: '2026-03-01', percent_complete: 0.22, previous_billed:  19700, bill_this_month: 22220, accrued_retainage: 1111, invoice_sent: true,  qbo_invoice_number: 'INV-24001-03' },
  { job_number: 24004, billing_month: '2026-03-01', percent_complete: 0.28, previous_billed:      0, bill_this_month: 43792, accrued_retainage: 2190, invoice_sent: true,  qbo_invoice_number: 'INV-24004-03' },
  { job_number: 24008, billing_month: '2026-03-01', percent_complete: 1.00, previous_billed: 136500, bill_this_month: 61000, accrued_retainage: 3050, invoice_sent: true,  qbo_invoice_number: 'INV-24008-FINAL' },

  // Apr 2026 — current month / 0-30 days
  { job_number: 24001, billing_month: '2026-04-01', percent_complete: 0.34, previous_billed:  41920, bill_this_month: 22080, accrued_retainage: 1104, invoice_sent: true,  qbo_invoice_number: 'INV-24001-04' },
  { job_number: 24002, billing_month: '2026-04-01', percent_complete: 0.20, previous_billed:  30600, bill_this_month: 31900, accrued_retainage: 1595, invoice_sent: true,  qbo_invoice_number: 'INV-24002-04' },
  { job_number: 24006, billing_month: '2026-04-01', percent_complete: 0.08, previous_billed:      0, bill_this_month: 32200, accrued_retainage: 1610, invoice_sent: false, qbo_invoice_number: null },

  // May 2026 — current cycle
  { job_number: 24001, billing_month: '2026-05-01', percent_complete: 0.42, previous_billed:  64000, bill_this_month: 31800, accrued_retainage: 4190, invoice_sent: true,  qbo_invoice_number: 'INV-24001-05' },
  { job_number: 24002, billing_month: '2026-05-01', percent_complete: 0.31, previous_billed:  62500, bill_this_month: 31500, accrued_retainage: 5275, invoice_sent: false, qbo_invoice_number: null },
  { job_number: 24003, billing_month: '2026-05-01', percent_complete: 0.12, previous_billed:      0, bill_this_month: 27210, accrued_retainage: 1361, invoice_sent: false, qbo_invoice_number: null },
  { job_number: 24004, billing_month: '2026-05-01', percent_complete: 0.56, previous_billed:  43792, bill_this_month: 45388, accrued_retainage: 4409, invoice_sent: true,  qbo_invoice_number: 'INV-24004-05' },
  { job_number: 24007, billing_month: '2026-05-01', percent_complete: 0.06, previous_billed:      0, bill_this_month: 24720, accrued_retainage: 1236, invoice_sent: false, qbo_invoice_number: null },
];

const BIDS = [
  { company: 'Brookline Builders',           territory: 'CLT', project_name: 'South End Retail Shell Shades',       bid_date: '2026-05-04', bid_amount:  96500, estimated_gp:  33775, estimated_np: 14475, estimated_hours:  410, bid_status: 'sent',     won: false, notes: 'Awaiting GC decision.' },
  { company: 'Crescent Property Group',       territory: 'CLT', project_name: 'Crescent North Phase 2',             bid_date: '2026-04-22', bid_amount: 288000, estimated_gp: 100800, estimated_np: 43200, estimated_hours: 1120, bid_status: 'awarded',  won: true,  notes: 'Expected to convert to project in June.' },
  { company: 'Palmetto Commercial Interiors', territory: 'SC',  project_name: 'Greenville Clinic Fit-Out',          bid_date: '2026-05-09', bid_amount: 121400, estimated_gp:  42490, estimated_np: 18210, estimated_hours:  520, bid_status: 'pending',  won: false, notes: 'Needs alternate fabric option.' },
  { company: 'Triad Multifamily Group',       territory: 'TRI', project_name: 'Greensboro Tech Park Office Shades', bid_date: '2026-04-15', bid_amount: 178500, estimated_gp:  62475, estimated_np: 26775, estimated_hours:  740, bid_status: 'pending',  won: false, notes: 'Decision expected end of May.' },
  { company: 'Lakeside Hospitality Partners', territory: 'LKN', project_name: 'Lake Norman Corporate Suites',       bid_date: '2026-03-28', bid_amount: 156000, estimated_gp:  54600, estimated_np: 23400, estimated_hours:  650, bid_status: 'awarded',  won: true,  notes: 'Converted to job 24003.' },
  { company: 'Brookline Builders',           territory: 'CLT', project_name: 'South End Luxury Condos Ph.1',       bid_date: '2026-04-08', bid_amount: 208000, estimated_gp:  72800, estimated_np: 31200, estimated_hours:  880, bid_status: 'sent',     won: false, notes: 'Competing against two other subs.' },
  { company: 'Palmetto Commercial Interiors', territory: 'SC',  project_name: 'Columbia Office Complex Shades',     bid_date: '2026-03-14', bid_amount:  94500, estimated_gp:  33075, estimated_np: 14175, estimated_hours:  400, bid_status: 'declined', won: false, notes: 'Lost to lower bid. Price was $11K below ours.' },
  { company: 'SouthPark Capital Partners',    territory: 'CLT', project_name: 'SouthPark Capital Center Fit-Out',   bid_date: '2026-03-20', bid_amount: 145000, estimated_gp:  50750, estimated_np: 21750, estimated_hours:  610, bid_status: 'awarded',  won: true,  notes: 'Converted to job 24009.' },
  { company: 'Huntersville Residential',      territory: 'LKN', project_name: 'Huntersville Luxury Apartments',     bid_date: '2026-04-01', bid_amount: 412000, estimated_gp: 144200, estimated_np: 61800, estimated_hours: 1680, bid_status: 'awarded',  won: true,  notes: 'Converted to job 24007.' },
  { company: 'Greensboro Medical Properties', territory: 'TRI', project_name: 'Winston-Salem Outpatient Center',   bid_date: '2026-05-12', bid_amount: 213000, estimated_gp:  74550, estimated_np: 31950, estimated_hours:  890, bid_status: 'sent',     won: false, notes: 'Follow-up after Greensboro Medical success.' },
];

const INTERACTIONS = [
  { company: 'Brookline Builders', contact: 'jordan@brookline.example', interaction_date: '2026-05-10', interaction_type: 'site_meeting', notes: 'Confirmed install access and loading dock schedule.', created_by: 'Maya Johnson' },
  { company: 'Crescent Property Group', contact: 'priya@crescent.example', interaction_date: '2026-05-12', interaction_type: 'billing_call', notes: 'Reviewed May billing timing and retainage.', created_by: 'Avery Stone' },
  { company: 'Palmetto Commercial Interiors', contact: 'sara@palmetto.example', interaction_date: '2026-05-14', interaction_type: 'schedule_update', notes: 'Phase 2 rooms moved one week later.', created_by: 'Maya Johnson' },
];

const MONTHLY_METRICS = [
  { metric_month: '2026-01-01', number_of_projects: 3, bids_sent: 4,  total_bid_value:  510000, total_bid_gp: 178500, total_bid_gp_percent: 0.35, bids_won: 2, total_won_value: 210000, gp_dollars:  73500, gp_percent: 0.35, np_dollars:  31500, np_percent: 0.15, installer_hours:  890, profit_per_man_hour: 35.39, hit_rate: 0.5000, capture_rate: 0.4118, pipeline_value:  980000, pipeline_gp: 343000, pipeline_gp_percent: 0.35 },
  { metric_month: '2026-02-01', number_of_projects: 4, bids_sent: 6,  total_bid_value:  748000, total_bid_gp: 261800, total_bid_gp_percent: 0.35, bids_won: 3, total_won_value: 295000, gp_dollars: 103250, gp_percent: 0.35, np_dollars:  44250, np_percent: 0.15, installer_hours: 1180, profit_per_man_hour: 37.50, hit_rate: 0.5000, capture_rate: 0.3944, pipeline_value: 1080000, pipeline_gp: 378000, pipeline_gp_percent: 0.35 },
  { metric_month: '2026-03-01', number_of_projects: 5, bids_sent: 7,  total_bid_value:  812000, total_bid_gp: 284200, total_bid_gp_percent: 0.35, bids_won: 3, total_won_value: 352000, gp_dollars: 123200, gp_percent: 0.35, np_dollars:  52800, np_percent: 0.15, installer_hours: 1520, profit_per_man_hour: 34.74, hit_rate: 0.4286, capture_rate: 0.4335, pipeline_value: 1150000, pipeline_gp: 402500, pipeline_gp_percent: 0.35 },
  { metric_month: '2026-04-01', number_of_projects: 7, bids_sent: 9,  total_bid_value: 1245000, total_bid_gp: 435750, total_bid_gp_percent: 0.35, bids_won: 4, total_won_value: 530000, gp_dollars: 185500, gp_percent: 0.35, np_dollars:  79500, np_percent: 0.15, installer_hours: 2010, profit_per_man_hour: 39.55, hit_rate: 0.4444, capture_rate: 0.4259, pipeline_value: 1498000, pipeline_gp: 524300, pipeline_gp_percent: 0.35 },
  { metric_month: '2026-05-01', number_of_projects: 8, bids_sent: 5,  total_bid_value:  697000, total_bid_gp: 243950, total_bid_gp_percent: 0.35, bids_won: 2, total_won_value: 409400, gp_dollars: 143290, gp_percent: 0.35, np_dollars:  61410, np_percent: 0.15, installer_hours: 1865, profit_per_man_hour: 32.93, hit_rate: 0.4000, capture_rate: 0.5872, pipeline_value: 1307500, pipeline_gp: 457625, pipeline_gp_percent: 0.35 },
];

const WEEKLY_METRICS = [
  { year: 2026, week_label: '2026-W18', projects_count: 5, bids_sent: 2, total_bid_value: 196500, np_dollars: 29475, profit_margin: 0.15, mgp_dollars: 68775, mgp_percent: 0.35, multifamily_projects: 1, multifamily_percent: 0.20, biz_dev_hours: 14 },
  { year: 2026, week_label: '2026-W19', projects_count: 6, bids_sent: 3, total_bid_value: 409400, np_dollars: 61410, profit_margin: 0.15, mgp_dollars: 143290, mgp_percent: 0.35, multifamily_projects: 2, multifamily_percent: 0.33, biz_dev_hours: 18 },
];

async function getId(client, sql, params) {
  const { rows } = await client.query(sql, params);
  return rows[0]?.id;
}

async function upsertRole(client, name) {
  const { rows } = await client.query(
    `INSERT INTO roles (name)
     VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name]
  );
  return rows[0].id;
}

async function upsertTerritory(client, territory) {
  const { rows } = await client.query(
    `INSERT INTO territories (code, name)
     VALUES ($1, $2)
     ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [territory.code, territory.name]
  );
  return rows[0].id;
}

async function upsertUser(client, user, roleIds, territoryIds, passwordHash) {
  const roleId = roleIds[user.role];
  const territoryId = user.territory ? territoryIds[user.territory] : null;
  const { rows } = await client.query(
    `INSERT INTO users (name, email, phone, user_type, role_id, territory_id, active, password_hash)
     VALUES ($1, $2, $3, 'internal', $4, $5, true, $6)
     ON CONFLICT (email) DO UPDATE SET
       name = EXCLUDED.name,
       phone = EXCLUDED.phone,
       user_type = EXCLUDED.user_type,
       role_id = EXCLUDED.role_id,
       territory_id = EXCLUDED.territory_id,
       active = EXCLUDED.active,
       updated_at = CURRENT_TIMESTAMP
     RETURNING id`,
    [user.name, user.email, user.phone, roleId, territoryId, passwordHash]
  );
  return rows[0].id;
}

async function upsertCompany(client, company, territoryIds) {
  const existingId = await getId(client, 'SELECT id FROM companies WHERE name = $1', [company.name]);
  if (existingId) {
    await client.query(
      `UPDATE companies
       SET state = $2, company_type = $3, territory_id = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [existingId, company.state, company.company_type, territoryIds[company.territory]]
    );
    return existingId;
  }

  const { rows } = await client.query(
    `INSERT INTO companies (name, state, company_type, territory_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [company.name, company.state, company.company_type, territoryIds[company.territory]]
  );
  return rows[0].id;
}

async function upsertContact(client, contact, companyIds) {
  const existingId = await getId(client, 'SELECT id FROM contacts WHERE email = $1', [contact.email]);
  const values = [
    companyIds[contact.company],
    contact.first_name,
    contact.last_name,
    contact.title,
    contact.email,
    contact.phone,
    contact.contact_type,
    contact.notes,
  ];

  if (existingId) {
    await client.query(
      `UPDATE contacts
       SET company_id = $2, first_name = $3, last_name = $4, title = $5, email = $6,
           phone = $7, contact_type = $8, notes = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [existingId, ...values]
    );
    return existingId;
  }

  const { rows } = await client.query(
    `INSERT INTO contacts (company_id, first_name, last_name, title, email, phone, contact_type, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    values
  );
  return rows[0].id;
}

async function upsertProject(client, project, companyIds, territoryIds, userIds) {
  const existingId = await getId(client, 'SELECT id FROM projects WHERE job_number = $1', [project.job_number]);
  const totalContract = Number(project.original_contract) + Number(project.approved_change_orders);
  const totalEstimate = Number(project.estimated_material_cost) + Number(project.estimated_labor_cost);
  const values = [
    project.job_number,
    project.project_name,
    companyIds[project.company],
    territoryIds[project.territory],
    userIds[project.manager],
    project.status,
    project.payroll_reporting,
    project.original_contract,
    project.approved_change_orders,
    totalContract,
    project.estimated_material_cost,
    project.estimated_labor_cost,
    totalEstimate,
    totalContract,
    project.start_date,
    project.install_start_date,
    project.install_end_date,
    project.completion_date || null,
  ];

  if (existingId) {
    await client.query(
      `UPDATE projects
       SET project_name = $2, company_id = $3, territory_id = $4, project_manager_user_id = $5,
           status = $6, payroll_reporting = $7, original_contract = $8, approved_change_orders = $9,
           total_contract = $10, estimated_material_cost = $11, estimated_labor_cost = $12,
           total_estimate = $13, contract_value = $14, start_date = $15, install_start_date = $16,
           install_end_date = $17, completion_date = $18, updated_at = CURRENT_TIMESTAMP
       WHERE job_number = $1`,
      values
    );
    return existingId;
  }

  const { rows } = await client.query(
    `INSERT INTO projects (
       job_number, project_name, company_id, territory_id, project_manager_user_id, status,
       payroll_reporting, original_contract, approved_change_orders, total_contract,
       estimated_material_cost, estimated_labor_cost, total_estimate, contract_value,
       start_date, install_start_date, install_end_date, completion_date
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
     RETURNING id`,
    values
  );
  return rows[0].id;
}

async function seedProjectUsers(client, projectIds, userIds) {
  const assignments = [
    { job: 24001, email: 'maya.pm@jamesblinds.com', relationship: 'project_manager' },
    { job: 24001, email: 'olivia.estimator@jamesblinds.com', relationship: 'estimator' },
    { job: 24002, email: 'maya.pm@jamesblinds.com', relationship: 'project_manager' },
    { job: 24002, email: 'nate.installer@jamesblinds.com', relationship: 'lead_installer' },
    { job: 24003, email: 'chris.pm@jamesblinds.com', relationship: 'project_manager' },
    { job: 24004, email: 'maya.pm@jamesblinds.com', relationship: 'project_manager' },
    { job: 24005, email: 'maya.pm@jamesblinds.com', relationship: 'project_manager' },
    { job: 24006, email: 'chris.pm@jamesblinds.com', relationship: 'project_manager' },
  ];

  for (const item of assignments) {
    const projectId = projectIds[item.job];
    const userId = userIds[item.email];
    const existingId = await getId(
      client,
      'SELECT id FROM project_users WHERE project_id = $1 AND user_id = $2 AND relationship_type = $3',
      [projectId, userId, item.relationship]
    );
    if (!existingId) {
      await client.query(
        `INSERT INTO project_users (project_id, user_id, relationship_type)
         VALUES ($1, $2, $3)`,
        [projectId, userId, item.relationship]
      );
    }
  }
}

async function seedChangeOrders(client, projectIds) {
  for (const co of CHANGE_ORDERS) {
    const projectId = projectIds[co.job_number];
    const existingId = await getId(
      client,
      'SELECT id FROM change_orders WHERE project_id = $1 AND co_number = $2',
      [projectId, co.co_number]
    );
    if (existingId) {
      await client.query(
        `UPDATE change_orders
         SET description = $3, amount = $4, estimated_cost_change = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND project_id = $2`,
        [existingId, projectId, co.description, co.amount, co.estimated_cost_change]
      );
    } else {
      await client.query(
        `INSERT INTO change_orders (project_id, co_number, description, amount, estimated_cost_change)
         VALUES ($1, $2, $3, $4, $5)`,
        [projectId, co.co_number, co.description, co.amount, co.estimated_cost_change]
      );
    }
  }
}

async function seedMonthlyBillings(client, projectIds) {
  for (const billing of MONTHLY_BILLINGS) {
    const projectId = projectIds[billing.job_number];
    const totalContract = await getProjectTotal(client, projectId);
    const totalBilled = Number(billing.previous_billed) + Number(billing.bill_this_month);
    const remaining = Math.max(totalContract - totalBilled, 0);
    const earned = totalContract * Number(billing.percent_complete);
    const underOver = totalBilled - earned;
    const costToRecognize = earned * 0.65;

    const existingId = await getId(
      client,
      'SELECT id FROM monthly_billings WHERE project_id = $1 AND billing_month = $2',
      [projectId, billing.billing_month]
    );
    const values = [
      projectId,
      billing.billing_month,
      25,
      'Monthly progress billing',
      costToRecognize * 0.42,
      costToRecognize * 0.58,
      costToRecognize * 0.25,
      costToRecognize,
      billing.percent_complete,
      billing.previous_billed,
      billing.bill_this_month,
      billing.accrued_retainage,
      totalBilled,
      remaining,
      earned,
      underOver,
      billing.invoice_sent,
      billing.invoice_sent ? 'QBO-SALES' : null,
      billing.qbo_invoice_number,
    ];

    if (existingId) {
      await client.query(
        `UPDATE monthly_billings
         SET billing_month = $3, bill_due_day = $4, description = $5,
             material_inventory_cost = $6, qbo_cost_to_date = $7, prior_cogs = $8,
             cost_to_recognize = $9, percent_complete = $10, previous_billed = $11,
             bill_this_month = $12, accrued_retainage = $13, total_billed_to_date = $14,
             remaining_to_bill = $15, revenue_earned_to_date = $16, under_over_billed = $17,
             invoice_sent = $18, qbo_sales_entry = $19, qbo_invoice_number = $20,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND project_id = $2`,
        [existingId, ...values]
      );
    } else {
      await client.query(
        `INSERT INTO monthly_billings (
           project_id, billing_month, bill_due_day, description, material_inventory_cost,
           qbo_cost_to_date, prior_cogs, cost_to_recognize, percent_complete,
           previous_billed, bill_this_month, accrued_retainage, total_billed_to_date,
           remaining_to_bill, revenue_earned_to_date, under_over_billed, invoice_sent,
           qbo_sales_entry, qbo_invoice_number
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        values
      );
    }
  }
}

async function getProjectTotal(client, projectId) {
  const { rows } = await client.query(
    'SELECT COALESCE(NULLIF(total_contract, 0), contract_value, original_contract, 0) AS value FROM projects WHERE id = $1',
    [projectId]
  );
  return Number(rows[0]?.value || 0);
}

async function seedBids(client, companyIds, territoryIds) {
  for (const bid of BIDS) {
    const companyId = companyIds[bid.company];
    const existingId = await getId(
      client,
      'SELECT id FROM bids WHERE company_id = $1 AND project_name = $2',
      [companyId, bid.project_name]
    );
    const values = [
      companyId,
      territoryIds[bid.territory],
      bid.project_name,
      bid.bid_date,
      bid.bid_amount,
      bid.estimated_gp,
      bid.estimated_np,
      bid.estimated_hours,
      bid.bid_status,
      bid.won,
      bid.notes,
    ];

    if (existingId) {
      await client.query(
        `UPDATE bids
         SET territory_id = $3, project_name = $4, bid_date = $5, bid_amount = $6,
             estimated_gp = $7, estimated_np = $8, estimated_hours = $9,
             bid_status = $10, won = $11, notes = $12, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND company_id = $2`,
        [existingId, ...values]
      );
    } else {
      await client.query(
        `INSERT INTO bids (
           company_id, territory_id, project_name, bid_date, bid_amount, estimated_gp,
           estimated_np, estimated_hours, bid_status, won, notes
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        values
      );
    }
  }
}

async function seedInteractions(client, companyIds, contactIds) {
  for (const interaction of INTERACTIONS) {
    const companyId = companyIds[interaction.company];
    const contactId = contactIds[interaction.contact];
    const existingId = await getId(
      client,
      `SELECT id FROM interactions
       WHERE company_id = $1 AND contact_id = $2 AND interaction_date = $3 AND interaction_type = $4`,
      [companyId, contactId, interaction.interaction_date, interaction.interaction_type]
    );
    if (!existingId) {
      await client.query(
        `INSERT INTO interactions (company_id, contact_id, interaction_date, interaction_type, notes, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [companyId, contactId, interaction.interaction_date, interaction.interaction_type, interaction.notes, interaction.created_by]
      );
    }
  }
}

async function seedMonthlyMetrics(client) {
  for (const metric of MONTHLY_METRICS) {
    const existingId = await getId(client, 'SELECT id FROM monthly_metrics WHERE metric_month = $1', [metric.metric_month]);
    const keys = Object.keys(metric);
    const values = Object.values(metric);

    if (existingId) {
      const assignments = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
      await client.query(
        `UPDATE monthly_metrics SET ${assignments}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [existingId, ...values]
      );
    } else {
      await client.query(
        `INSERT INTO monthly_metrics (${keys.join(', ')})
         VALUES (${keys.map((_, index) => `$${index + 1}`).join(', ')})`,
        values
      );
    }
  }
}

async function seedWeeklyMetrics(client) {
  for (const metric of WEEKLY_METRICS) {
    const existingId = await getId(client, 'SELECT id FROM weekly_metrics WHERE year = $1 AND week_label = $2', [metric.year, metric.week_label]);
    const keys = Object.keys(metric);
    const values = Object.values(metric);

    if (existingId) {
      const assignments = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
      await client.query(
        `UPDATE weekly_metrics SET ${assignments}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [existingId, ...values]
      );
    } else {
      await client.query(
        `INSERT INTO weekly_metrics (${keys.join(', ')})
         VALUES (${keys.map((_, index) => `$${index + 1}`).join(', ')})`,
        values
      );
    }
  }
}

async function seedMultifamilyFeedback(client) {
  const projectName = 'Triad Multifamily Phase 1';
  const existingId = await getId(client, 'SELECT id FROM multifamily_feedback WHERE project_name = $1', [projectName]);
  const values = [
    projectName,
    'Triad Multifamily Group',
    'Greensboro, NC',
    535,
    380,
    1180,
    '2 inch faux wood blinds',
    'third_party',
    402500,
    0.15,
    0.35,
    42.15,
    'Won through schedule reliability and lower install disruption.',
  ];

  if (existingId) {
    await client.query(
      `UPDATE multifamily_feedback
       SET project_name = $2, gc_company = $3, location = $4, miles_from_orlando = $5,
           miles_from_columbus = $6, blinds_quantity = $7, product_used = $8,
           warehouse_type = $9, bid_amount = $10, np_percent = $11, gp_percent = $12,
           ppmh = $13, winning_bid_info = $14,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [existingId, ...values]
    );
  } else {
    await client.query(
      `INSERT INTO multifamily_feedback (
         project_name, gc_company, location, miles_from_orlando, miles_from_columbus,
         blinds_quantity, product_used, warehouse_type, bid_amount, np_percent,
         gp_percent, ppmh, winning_bid_info
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      values
    );
  }
}

async function seedQuickbooksSync(client, projectIds) {
  for (const billing of MONTHLY_BILLINGS.filter((item) => item.invoice_sent)) {
    const projectId = projectIds[billing.job_number];
    const existingId = await getId(client, 'SELECT id FROM quickbooks_sync WHERE project_id = $1 AND qbo_invoice_number = $2', [projectId, billing.qbo_invoice_number]);
    if (!existingId) {
      await client.query(
        `INSERT INTO quickbooks_sync (project_id, qbo_sales_entry, qbo_invoice_number, sync_status, last_synced_at)
         VALUES ($1, $2, $3, 'synced', CURRENT_TIMESTAMP)`,
        [projectId, 'QBO-SALES', billing.qbo_invoice_number]
      );
    }
  }
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const roleIds = {};
    for (const role of ROLES) {
      roleIds[role] = await upsertRole(client, role);
    }

    const territoryIds = {};
    for (const territory of TERRITORIES) {
      territoryIds[territory.code] = await upsertTerritory(client, territory);
    }

    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    const userIds = {};
    for (const user of USERS) {
      userIds[user.email] = await upsertUser(client, user, roleIds, territoryIds, passwordHash);
    }

    const companyIds = {};
    for (const company of COMPANIES) {
      companyIds[company.name] = await upsertCompany(client, company, territoryIds);
    }

    const contactIds = {};
    for (const contact of CONTACTS) {
      contactIds[contact.email] = await upsertContact(client, contact, companyIds);
    }

    const projectIds = {};
    for (const project of PROJECTS) {
      projectIds[project.job_number] = await upsertProject(client, project, companyIds, territoryIds, userIds);
    }

    await seedProjectUsers(client, projectIds, userIds);
    await seedChangeOrders(client, projectIds);
    await seedMonthlyBillings(client, projectIds);
    await seedBids(client, companyIds, territoryIds);
    await seedInteractions(client, companyIds, contactIds);
    await seedMonthlyMetrics(client);
    await seedWeeklyMetrics(client);
    await seedMultifamilyFeedback(client);
    await seedQuickbooksSync(client, projectIds);

    await client.query('COMMIT');
    console.log('Seed complete.');
    console.log(`Default login: admin@jamesblinds.com / ${PASSWORD}`);
    console.log(`Project manager login: maya.pm@jamesblinds.com / ${PASSWORD}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
