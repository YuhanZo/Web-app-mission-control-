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

const demoFinance = {
  overview: {
    ytd_revenue: 1379400, ytd_gp_dollars: 358644, ytd_gp_percent: 0.26,
    ytd_np_dollars: 137940, ytd_np_percent: 0.10, ytd_bids_sent: 24,
    ytd_bid_value: 3105000, ytd_installer_hours: 2340,
    total_pipeline: 3457000, total_backlog: 1154250, bill_this_month: 287500,
  },
  monthly: [
    { metric_month: '2026-01-01', revenue: 210000, gp_dollars: 54600, gp_percent: 0.26, np_dollars: 21000, np_percent: 0.10, installer_hours: 420, ppmh: 50, bids_sent: 4, bid_value: 510000, pipeline_value: 980000, hit_rate: 0.42, capture_rate: 0.31 },
    { metric_month: '2026-02-01', revenue: 352000, gp_dollars: 91520, gp_percent: 0.26, np_dollars: 35200, np_percent: 0.10, installer_hours: 680, ppmh: 52, bids_sent: 7, bid_value: 812000, pipeline_value: 1150000, hit_rate: 0.44, capture_rate: 0.33 },
    { metric_month: '2026-03-01', revenue: 409400, gp_dollars: 106444, gp_percent: 0.26, np_dollars: 40940, np_percent: 0.10, installer_hours: 790, ppmh: 52, bids_sent: 8, bid_value: 936000, pipeline_value: 1307500, hit_rate: 0.46, capture_rate: 0.34 },
    { metric_month: '2026-04-01', revenue: 408000, gp_dollars: 106080, gp_percent: 0.26, np_dollars: 40800, np_percent: 0.10, installer_hours: 760, ppmh: 54, bids_sent: 5, bid_value: 847000, pipeline_value: 1498000, hit_rate: 0.44, capture_rate: 0.32 },
  ],
  billing: [
    { project_id: 1, job_number: 24001, project_name: 'Uptown Medical Office Shades', status: 'active', total_contract: 197000, territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson', billing_month: '2026-05-01', total_billed_to_date: 118200, remaining_to_bill: 78800, percent_complete: 0.60, bill_this_month: 39400, accrued_retainage: 11820, revenue_earned_to_date: 118200, under_over_billed: 0, invoice_sent: true },
    { project_id: 2, job_number: 24002, project_name: 'Crescent South Apartments', status: 'active', total_contract: 340500, territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson', billing_month: '2026-05-01', total_billed_to_date: 85125, remaining_to_bill: 255375, percent_complete: 0.25, bill_this_month: 68100, accrued_retainage: 8512, revenue_earned_to_date: 85125, under_over_billed: 0, invoice_sent: false },
    { project_id: 3, job_number: 24003, project_name: 'Lake Norman Hotel Renovation', status: 'pending', total_contract: 226750, territory_name: 'Lake Norman', pm_name: 'Chris Walker', billing_month: null, total_billed_to_date: 0, remaining_to_bill: 226750, percent_complete: 0, bill_this_month: 0, accrued_retainage: 0, revenue_earned_to_date: 0, under_over_billed: 0, invoice_sent: false },
    { project_id: 4, job_number: 24004, project_name: 'Palmetto Surgical Center', status: 'active', total_contract: 157300, territory_name: 'South Carolina', pm_name: 'Maya Johnson', billing_month: '2026-05-01', total_billed_to_date: 94380, remaining_to_bill: 62920, percent_complete: 0.60, bill_this_month: 31460, accrued_retainage: 9438, revenue_earned_to_date: 94380, under_over_billed: -2500, invoice_sent: true },
    { project_id: 6, job_number: 24006, project_name: 'Triad Multifamily Phase 1', status: 'active', total_contract: 402500, territory_name: 'Triad', pm_name: 'Chris Walker', billing_month: '2026-05-01', total_billed_to_date: 80500, remaining_to_bill: 322000, percent_complete: 0.20, bill_this_month: 80500, accrued_retainage: 8050, revenue_earned_to_date: 80500, under_over_billed: 0, invoice_sent: false },
  ],
  payroll: [
    { project_id: 1, job_number: 24001, project_name: 'Uptown Medical Office Shades', status: 'active', payroll_reporting: true, total_contract: 197000, estimated_labor_cost: 49250, estimated_material_cost: 108350, total_estimate: 157600, territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson', actual_cost_recognized: 29700 },
    { project_id: 2, job_number: 24002, project_name: 'Crescent South Apartments', status: 'active', payroll_reporting: true, total_contract: 340500, estimated_labor_cost: 85125, estimated_material_cost: 187275, total_estimate: 272400, territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson', actual_cost_recognized: 21281 },
    { project_id: 3, job_number: 24003, project_name: 'Lake Norman Hotel Renovation', status: 'pending', payroll_reporting: false, total_contract: 226750, estimated_labor_cost: 56688, estimated_material_cost: 124713, total_estimate: 181400, territory_name: 'Lake Norman', pm_name: 'Chris Walker', actual_cost_recognized: 0 },
    { project_id: 4, job_number: 24004, project_name: 'Palmetto Surgical Center', status: 'active', payroll_reporting: true, total_contract: 157300, estimated_labor_cost: 39325, estimated_material_cost: 86515, total_estimate: 125840, territory_name: 'South Carolina', pm_name: 'Maya Johnson', actual_cost_recognized: 23595 },
    { project_id: 5, job_number: 24005, project_name: 'Riverfront Condo Unit 4B', status: 'completed', payroll_reporting: true, total_contract: 30000, estimated_labor_cost: 7500, estimated_material_cost: 16500, total_estimate: 24000, territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson', actual_cost_recognized: 24000 },
    { project_id: 6, job_number: 24006, project_name: 'Triad Multifamily Phase 1', status: 'active', payroll_reporting: false, total_contract: 402500, estimated_labor_cost: 100625, estimated_material_cost: 221375, total_estimate: 322000, territory_name: 'Triad', pm_name: 'Chris Walker', actual_cost_recognized: 20100 },
  ],
  changeOrders: [
    { id: 1, project_id: 1, job_number: 24001, project_name: 'Uptown Medical Office Shades', status: 'active', co_number: 'CO-001', description: 'Additional motorized blinds in conference rooms', amount: 14500, estimated_cost_change: 9425, created_at: '2026-04-12' },
    { id: 2, project_id: 4, job_number: 24004, project_name: 'Palmetto Surgical Center', status: 'active', co_number: 'CO-001', description: 'Upgrade fabric spec on OR suites', amount: 8750, estimated_cost_change: 5688, created_at: '2026-04-28' },
    { id: 3, project_id: 2, job_number: 24002, project_name: 'Crescent South Apartments', status: 'active', co_number: 'CO-001', description: 'Extra unit count – Phase 2 added', amount: 42000, estimated_cost_change: 27300, created_at: '2026-05-02' },
  ],
  bids: [
    { id: 1, project_name: 'Ballantyne Corporate Park Phase 3', bid_date: '2026-05-10', bid_amount: 285000, estimated_gp: 74100, estimated_np: 28500, estimated_hours: 540, bid_status: 'pending', won: false, notes: '', territory_name: 'Charlotte Metro', company_name: 'Brookline Builders' },
    { id: 2, project_name: 'Huntersville Luxury Apartments', bid_date: '2026-05-04', bid_amount: 412000, estimated_gp: 107120, estimated_np: 41200, estimated_hours: 780, bid_status: 'won', won: true, notes: 'Awarded', territory_name: 'Lake Norman', company_name: 'Lakeside Hospitality Partners' },
    { id: 3, project_name: 'Cabarrus County Medical', bid_date: '2026-04-22', bid_amount: 157500, estimated_gp: 40950, estimated_np: 15750, estimated_hours: 298, bid_status: 'lost', won: false, notes: 'Underbid by competitor', territory_name: 'Charlotte Metro', company_name: 'Palmetto Commercial Interiors' },
    { id: 4, project_name: 'SouthPark Office Tower', bid_date: '2026-04-15', bid_amount: 320000, estimated_gp: 83200, estimated_np: 32000, estimated_hours: 605, bid_status: 'pending', won: false, notes: 'Awaiting GC decision', territory_name: 'Charlotte Metro', company_name: 'Crescent Property Group' },
    { id: 5, project_name: 'Triad Distribution Center', bid_date: '2026-04-08', bid_amount: 198000, estimated_gp: 51480, estimated_np: 19800, estimated_hours: 374, bid_status: 'won', won: true, notes: '', territory_name: 'Triad', company_name: 'Triad Multifamily Group' },
  ],
};

const demoAnalytics = {
  revenueByTerritory: [
    { territory_name: 'Charlotte Metro', project_count: 5, total_revenue:  958500, est_labor: 244875, est_material: 505875, total_estimate: 750750, est_profit: 207750 },
    { territory_name: 'Lake Norman',     project_count: 2, total_revenue:  638750, est_labor: 150000, est_material: 278900, total_estimate: 428900, est_profit: 209850 },
    { territory_name: 'Triad',           project_count: 2, total_revenue:  600000, est_labor: 140400, est_material: 265600, total_estimate: 406000, est_profit: 194000 },
    { territory_name: 'South Carolina',  project_count: 1, total_revenue:  157300, est_labor:  39325, est_material:  86515, total_estimate: 125840, est_profit:  31460 },
  ],
  topCustomers: [
    { company_name: 'Huntersville Residential',        territory_name: 'Lake Norman',     project_count: 1, total_revenue: 412000, est_profit:  82400 },
    { company_name: 'Triad Multifamily Group',          territory_name: 'Triad',           project_count: 2, total_revenue: 600000, est_profit: 120000 },
    { company_name: 'Crescent Property Group',          territory_name: 'Charlotte Metro', project_count: 1, total_revenue: 340500, est_profit:  68100 },
    { company_name: 'Brookline Builders',               territory_name: 'Charlotte Metro', project_count: 3, total_revenue: 496800, est_profit:  99360 },
    { company_name: 'SouthPark Capital Partners',       territory_name: 'Charlotte Metro', project_count: 1, total_revenue: 145000, est_profit:  29000 },
    { company_name: 'Greensboro Medical Properties',    territory_name: 'Triad',           project_count: 1, total_revenue: 197500, est_profit:  39500 },
    { company_name: 'Lakeside Hospitality Partners',    territory_name: 'Lake Norman',     project_count: 1, total_revenue: 226750, est_profit:  45350 },
    { company_name: 'Palmetto Commercial Interiors',    territory_name: 'South Carolina',  project_count: 1, total_revenue: 157300, est_profit:  31460 },
  ],
  monthlyRevenue: [
    { metric_month: '2026-01-01', revenue: 210000, gp_dollars:  54600, np_dollars: 21000, pipeline_value:  980000, bid_value: 510000, bids_sent: 4 },
    { metric_month: '2026-02-01', revenue: 352000, gp_dollars:  91520, np_dollars: 35200, pipeline_value: 1150000, bid_value: 812000, bids_sent: 7 },
    { metric_month: '2026-03-01', revenue: 409400, gp_dollars: 106444, np_dollars: 40940, pipeline_value: 1307500, bid_value: 936000, bids_sent: 8 },
    { metric_month: '2026-04-01', revenue: 408000, gp_dollars: 106080, np_dollars: 40800, pipeline_value: 1498000, bid_value: 847000, bids_sent: 5 },
    { metric_month: '2026-05-01', revenue: 287500, gp_dollars:  74750, np_dollars: 28750, pipeline_value: 1154250, bid_value: 285000, bids_sent: 1 },
  ],
  invoices: [
    // Charlotte Metro — all four aging buckets
    { project_id: 1,  job_number: 24001, project_name: 'Uptown Medical Office Shades',     company_name: 'Brookline Builders',            territory_name: 'Charlotte Metro', billing_month: '2026-05-01', amount_due:  39400, total_billed: 118200, retainage: 11820, invoice_sent: true,  qbo_invoice_number: 'INV-24001-05',   days_outstanding:  16 },
    { project_id: 2,  job_number: 24002, project_name: 'Crescent South Apartments',         company_name: 'Crescent Property Group',       territory_name: 'Charlotte Metro', billing_month: '2026-04-01', amount_due:  62500, total_billed:  62500, retainage:  6250, invoice_sent: true,  qbo_invoice_number: 'INV-24002-04',   days_outstanding:  46 },
    { project_id: 5,  job_number: 24005, project_name: 'Riverfront Condo Unit 4B',          company_name: 'Brookline Builders',            territory_name: 'Charlotte Metro', billing_month: '2026-03-01', amount_due:   5000, total_billed:  30000, retainage:  1500, invoice_sent: true,  qbo_invoice_number: 'INV-24005-FINAL', days_outstanding:  77 },
    { project_id: 9,  job_number: 24009, project_name: 'SouthPark Capital Center',          company_name: 'SouthPark Capital Partners',    territory_name: 'Charlotte Metro', billing_month: '2026-01-01', amount_due:  19700, total_billed:  19700, retainage:   985, invoice_sent: true,  qbo_invoice_number: 'INV-24009-01',   days_outstanding: 136 },
    // Lake Norman
    { project_id: 3,  job_number: 24003, project_name: 'Lake Norman Hotel Renovation',      company_name: 'Lakeside Hospitality Partners', territory_name: 'Lake Norman',     billing_month: '2026-05-01', amount_due:  27210, total_billed:  27210, retainage:  1361, invoice_sent: false, qbo_invoice_number: null,             days_outstanding:  16 },
    { project_id: 7,  job_number: 24007, project_name: 'Huntersville Luxury Apartments',    company_name: 'Huntersville Residential',      territory_name: 'Lake Norman',     billing_month: '2026-04-01', amount_due:  49440, total_billed:  49440, retainage:  2472, invoice_sent: true,  qbo_invoice_number: 'INV-24007-04',   days_outstanding:  46 },
    { project_id: 7,  job_number: 24007, project_name: 'Huntersville Luxury Apartments',    company_name: 'Huntersville Residential',      territory_name: 'Lake Norman',     billing_month: '2026-02-01', amount_due:  24720, total_billed:  24720, retainage:  1236, invoice_sent: true,  qbo_invoice_number: 'INV-24007-02',   days_outstanding: 105 },
    // South Carolina
    { project_id: 4,  job_number: 24004, project_name: 'Palmetto Surgical Center',           company_name: 'Palmetto Commercial Interiors', territory_name: 'South Carolina',  billing_month: '2026-05-01', amount_due:  45388, total_billed: 139992, retainage:  4409, invoice_sent: true,  qbo_invoice_number: 'INV-24004-05',   days_outstanding:  16 },
    { project_id: 4,  job_number: 24004, project_name: 'Palmetto Surgical Center',           company_name: 'Palmetto Commercial Interiors', territory_name: 'South Carolina',  billing_month: '2026-03-01', amount_due:  43792, total_billed:  43792, retainage:  2190, invoice_sent: true,  qbo_invoice_number: 'INV-24004-03',   days_outstanding:  77 },
    { project_id: 4,  job_number: 24004, project_name: 'Palmetto Surgical Center',           company_name: 'Palmetto Commercial Interiors', territory_name: 'South Carolina',  billing_month: '2026-01-01', amount_due:  21000, total_billed:  21000, retainage:  1050, invoice_sent: true,  qbo_invoice_number: 'INV-24004-01',   days_outstanding: 136 },
    // Triad
    { project_id: 6,  job_number: 24006, project_name: 'Triad Multifamily Phase 1',          company_name: 'Triad Multifamily Group',       territory_name: 'Triad',           billing_month: '2026-05-01', amount_due:  80500, total_billed:  80500, retainage:  8050, invoice_sent: false, qbo_invoice_number: null,             days_outstanding:  16 },
    { project_id: 8,  job_number: 24008, project_name: 'Greensboro Medical Complex',         company_name: 'Greensboro Medical Properties', territory_name: 'Triad',           billing_month: '2026-03-01', amount_due:  61000, total_billed: 197500, retainage:  3050, invoice_sent: true,  qbo_invoice_number: 'INV-24008-FINAL', days_outstanding:  77 },
    { project_id: 8,  job_number: 24008, project_name: 'Greensboro Medical Complex',         company_name: 'Greensboro Medical Properties', territory_name: 'Triad',           billing_month: '2026-02-01', amount_due:  87125, total_billed: 136500, retainage:  4356, invoice_sent: true,  qbo_invoice_number: 'INV-24008-02',   days_outstanding: 105 },
    { project_id: 8,  job_number: 24008, project_name: 'Greensboro Medical Complex',         company_name: 'Greensboro Medical Properties', territory_name: 'Triad',           billing_month: '2026-01-01', amount_due:  49375, total_billed:  49375, retainage:  2469, invoice_sent: true,  qbo_invoice_number: 'INV-24008-01',   days_outstanding: 136 },
  ],
  expenses: [
    // Charlotte Metro
    { project_id: 1,  job_number: 24001, project_name: 'Uptown Medical Office Shades',       status: 'active',    territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson',  contract_value: 197000, est_labor:  49250, est_material: 108350, total_estimate: 157600, actual_cost:  65300 },
    { project_id: 2,  job_number: 24002, project_name: 'Crescent South Apartments',           status: 'active',    territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson',  contract_value: 340500, est_labor:  85125, est_material: 187275, total_estimate: 272400, actual_cost:  89400 },
    { project_id: 5,  job_number: 24005, project_name: 'Riverfront Condo Unit 4B',            status: 'completed', territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson',  contract_value:  30000, est_labor:   7500, est_material:  16500, total_estimate:  24000, actual_cost:  23200 },
    { project_id: 9,  job_number: 24009, project_name: 'SouthPark Capital Center',            status: 'pending',   territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson',  contract_value: 145000, est_labor:  34750, est_material:  65250, total_estimate: 100000, actual_cost:      0 },
    { project_id: 10, job_number: 24010, project_name: 'Ballantyne Corporate Park Ph.3',      status: 'pending',   territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson',  contract_value: 285000, est_labor:  68250, est_material: 128250, total_estimate: 196500, actual_cost:      0 },
    // Lake Norman
    { project_id: 3,  job_number: 24003, project_name: 'Lake Norman Hotel Renovation',        status: 'pending',   territory_name: 'Lake Norman',     pm_name: 'Chris Walker', contract_value: 226750, est_labor:  51200, est_material:  93500, total_estimate: 144700, actual_cost:      0 },
    { project_id: 7,  job_number: 24007, project_name: 'Huntersville Luxury Apartments',      status: 'active',    territory_name: 'Lake Norman',     pm_name: 'Chris Walker', contract_value: 412000, est_labor:  98800, est_material: 185400, total_estimate: 284200, actual_cost:  44100 },
    // South Carolina
    { project_id: 4,  job_number: 24004, project_name: 'Palmetto Surgical Center',            status: 'active',    territory_name: 'South Carolina',  pm_name: 'Maya Johnson',  contract_value: 157300, est_labor:  39325, est_material:  86515, total_estimate: 125840, actual_cost:  68200 },
    // Triad
    { project_id: 6,  job_number: 24006, project_name: 'Triad Multifamily Phase 1',           status: 'active',    territory_name: 'Triad',           pm_name: 'Chris Walker', contract_value: 402500, est_labor:  95500, est_material: 181000, total_estimate: 276500, actual_cost:  44200 },
    { project_id: 8,  job_number: 24008, project_name: 'Greensboro Medical Complex',          status: 'completed', territory_name: 'Triad',           pm_name: 'Chris Walker', contract_value: 197500, est_labor:  44900, est_material:  84600, total_estimate: 129500, actual_cost: 128200 },
  ],
  bids: [
    // Charlotte Metro
    { id:  1, project_name: 'Ballantyne Corporate Park Ph.3',    bid_date: '2026-05-10', bid_amount: 285000, estimated_gp:  74100, estimated_np: 28500, estimated_hours: 540, bid_status: 'pending',  won: false, territory_name: 'Charlotte Metro', company_name: 'Brookline Builders',             actual_gp: null  },
    { id:  3, project_name: 'Cabarrus County Medical',            bid_date: '2026-04-22', bid_amount: 157500, estimated_gp:  40950, estimated_np: 15750, estimated_hours: 298, bid_status: 'lost',     won: false, territory_name: 'Charlotte Metro', company_name: 'Crescent Property Group',        actual_gp: null  },
    { id:  4, project_name: 'SouthPark Office Tower',             bid_date: '2026-04-15', bid_amount: 320000, estimated_gp:  83200, estimated_np: 32000, estimated_hours: 605, bid_status: 'pending',  won: false, territory_name: 'Charlotte Metro', company_name: 'Crescent Property Group',        actual_gp: null  },
    { id:  6, project_name: 'Uptown Medical Office Shades',       bid_date: '2026-03-15', bid_amount: 197000, estimated_gp:  51220, estimated_np: 19700, estimated_hours: 372, bid_status: 'awarded',  won: true,  territory_name: 'Charlotte Metro', company_name: 'Brookline Builders',             actual_gp:  39400 },
    { id:  9, project_name: 'South End Luxury Condos Ph.1',       bid_date: '2026-04-08', bid_amount: 208000, estimated_gp:  54080, estimated_np: 20800, estimated_hours: 393, bid_status: 'sent',     won: false, territory_name: 'Charlotte Metro', company_name: 'Brookline Builders',             actual_gp: null  },
    { id: 10, project_name: 'SouthPark Capital Center Fit-Out',   bid_date: '2026-03-20', bid_amount: 145000, estimated_gp:  37700, estimated_np: 14500, estimated_hours: 274, bid_status: 'awarded',  won: true,  territory_name: 'Charlotte Metro', company_name: 'SouthPark Capital Partners',     actual_gp:  34800 },
    // Lake Norman
    { id:  2, project_name: 'Huntersville Luxury Apartments',     bid_date: '2026-04-01', bid_amount: 412000, estimated_gp: 107120, estimated_np: 41200, estimated_hours: 780, bid_status: 'awarded',  won: true,  territory_name: 'Lake Norman',     company_name: 'Huntersville Residential',       actual_gp:  98700 },
    { id: 11, project_name: 'Lake Norman Corporate Suites',       bid_date: '2026-03-28', bid_amount: 156000, estimated_gp:  40560, estimated_np: 15600, estimated_hours: 295, bid_status: 'awarded',  won: true,  territory_name: 'Lake Norman',     company_name: 'Lakeside Hospitality Partners',  actual_gp:  38400 },
    { id: 12, project_name: 'Cornelius Retail Center',            bid_date: '2026-04-30', bid_amount:  88000, estimated_gp:  22880, estimated_np:  8800, estimated_hours: 166, bid_status: 'pending',  won: false, territory_name: 'Lake Norman',     company_name: 'Lakeside Hospitality Partners',  actual_gp: null  },
    // South Carolina
    { id:  7, project_name: 'Palmetto Surgical Center',           bid_date: '2026-03-01', bid_amount: 157300, estimated_gp:  40898, estimated_np: 15730, estimated_hours: 297, bid_status: 'awarded',  won: true,  territory_name: 'South Carolina',  company_name: 'Palmetto Commercial Interiors',  actual_gp:  31460 },
    { id: 13, project_name: 'Columbia Office Complex Shades',     bid_date: '2026-03-14', bid_amount:  94500, estimated_gp:  24570, estimated_np:  9450, estimated_hours: 178, bid_status: 'declined', won: false, territory_name: 'South Carolina',  company_name: 'Palmetto Commercial Interiors',  actual_gp: null  },
    { id: 14, project_name: 'Greenville Clinic Fit-Out',          bid_date: '2026-05-09', bid_amount: 121400, estimated_gp:  31564, estimated_np: 12140, estimated_hours: 229, bid_status: 'pending',  won: false, territory_name: 'South Carolina',  company_name: 'Palmetto Commercial Interiors',  actual_gp: null  },
    // Triad
    { id:  5, project_name: 'Triad Multifamily Phase 1',          bid_date: '2026-04-18', bid_amount: 402500, estimated_gp: 104650, estimated_np: 40250, estimated_hours: 820, bid_status: 'awarded',  won: true,  territory_name: 'Triad',           company_name: 'Triad Multifamily Group',        actual_gp:  96600 },
    { id: 15, project_name: 'Greensboro Tech Park Office Shades', bid_date: '2026-04-15', bid_amount: 178500, estimated_gp:  46410, estimated_np: 17850, estimated_hours: 337, bid_status: 'pending',  won: false, territory_name: 'Triad',           company_name: 'Triad Multifamily Group',        actual_gp: null  },
    { id: 16, project_name: 'Winston-Salem Outpatient Center',    bid_date: '2026-05-12', bid_amount: 213000, estimated_gp:  55380, estimated_np: 21300, estimated_hours: 402, bid_status: 'sent',     won: false, territory_name: 'Triad',           company_name: 'Greensboro Medical Properties',  actual_gp: null  },
  ],
  statePerformance: [
    { territory_name: 'Charlotte Metro', state: 'NC', project_count: 5, total_revenue:  958500, total_cost: 750500, gross_profit: 208000, np_dollars: 103900, labor_cost: 244875, material_cost: 505625, avg_margin: 0.22, tax_rate: 0.0475 },
    { territory_name: 'Lake Norman',     state: 'NC', project_count: 2, total_revenue:  638750, total_cost: 428900, gross_profit: 209850, np_dollars:  95800, labor_cost: 150000, material_cost: 278900, avg_margin: 0.33, tax_rate: 0.0475 },
    { territory_name: 'Triad',           state: 'NC', project_count: 2, total_revenue:  600000, total_cost: 406000, gross_profit: 194000, np_dollars:  90000, labor_cost: 140400, material_cost: 265600, avg_margin: 0.32, tax_rate: 0.0475 },
    { territory_name: 'South Carolina',  state: 'SC', project_count: 1, total_revenue:  157300, total_cost: 125840, gross_profit:  31460, np_dollars:  15730, labor_cost:  39325, material_cost:  86515, avg_margin: 0.20, tax_rate: 0.0600 },
  ],
  installers: [
    // Charlotte Metro
    { id: 1, name: 'Marcus Webb',     territory_name: 'Charlotte Metro', active_projects: 2, ytd_hours: 680, ytd_labor_cost: 34000, projects_completed:  8, avg_hours_per_project:  85, efficiency_rating: 0.94, overtime_hours: 24 },
    { id: 2, name: 'Devon Clark',     territory_name: 'Charlotte Metro', active_projects: 1, ytd_hours: 540, ytd_labor_cost: 27000, projects_completed:  6, avg_hours_per_project:  90, efficiency_rating: 0.88, overtime_hours: 40 },
    { id: 7, name: 'Darrell Price',   territory_name: 'Charlotte Metro', active_projects: 2, ytd_hours: 610, ytd_labor_cost: 30500, projects_completed:  7, avg_hours_per_project:  87, efficiency_rating: 0.91, overtime_hours: 32 },
    // Lake Norman
    { id: 3, name: 'Jake Norris',     territory_name: 'Lake Norman',     active_projects: 2, ytd_hours: 520, ytd_labor_cost: 26000, projects_completed:  5, avg_hours_per_project:  84, efficiency_rating: 0.96, overtime_hours:  8 },
    { id: 8, name: 'Carlos Vega',     territory_name: 'Lake Norman',     active_projects: 1, ytd_hours: 380, ytd_labor_cost: 19000, projects_completed:  4, avg_hours_per_project:  95, efficiency_rating: 0.89, overtime_hours: 22 },
    // South Carolina
    { id: 4, name: 'Trevor Shaw',     territory_name: 'South Carolina',  active_projects: 1, ytd_hours: 390, ytd_labor_cost: 19500, projects_completed:  4, avg_hours_per_project:  97, efficiency_rating: 0.82, overtime_hours: 56 },
    { id: 9, name: 'Jermaine Ellis',  territory_name: 'South Carolina',  active_projects: 1, ytd_hours: 330, ytd_labor_cost: 16500, projects_completed:  3, avg_hours_per_project:  83, efficiency_rating: 0.93, overtime_hours: 12 },
    // Triad
    { id: 5, name: 'Luis Herrera',    territory_name: 'Triad',           active_projects: 1, ytd_hours: 480, ytd_labor_cost: 24000, projects_completed:  7, avg_hours_per_project:  68, efficiency_rating: 0.97, overtime_hours:  0 },
    { id: 6, name: 'Ryan Potts',      territory_name: 'Triad',           active_projects: 1, ytd_hours: 310, ytd_labor_cost: 15500, projects_completed:  3, avg_hours_per_project: 103, efficiency_rating: 0.79, overtime_hours: 64 },
    { id:10, name: 'Anthony Greene',  territory_name: 'Triad',           active_projects: 2, ytd_hours: 570, ytd_labor_cost: 28500, projects_completed:  6, avg_hours_per_project:  95, efficiency_rating: 0.85, overtime_hours: 38 },
  ],
  payrollMonthly: [
    { metric_month: '2026-01-01', total_hours:  420, total_labor_cost: 21000, overtime_hours: 20, overtime_cost:  1575 },
    { metric_month: '2026-02-01', total_hours:  680, total_labor_cost: 34000, overtime_hours: 40, overtime_cost:  3000 },
    { metric_month: '2026-03-01', total_hours:  790, total_labor_cost: 39500, overtime_hours: 60, overtime_cost:  4500 },
    { metric_month: '2026-04-01', total_hours:  760, total_labor_cost: 38000, overtime_hours: 52, overtime_cost:  3900 },
    { metric_month: '2026-05-01', total_hours:  865, total_labor_cost: 43250, overtime_hours: 48, overtime_cost:  3600 },
  ],
  expenseCategories: [
    { category: 'Materials',         amount: 1072513, pct: 0.55 },
    { category: 'Installer Labor',   amount:  583838, pct: 0.30 },
    { category: 'Fuel & Travel',     amount:   97307, pct: 0.05 },
    { category: 'Equipment',         amount:   77845, pct: 0.04 },
    { category: 'Subcontractors',    amount:  116768, pct: 0.06 },
  ],
  forecasting: {
    combined: [
      { month: 'Jan', revenue: 210000, projected: null,   actual: true },
      { month: 'Feb', revenue: 352000, projected: null,   actual: true },
      { month: 'Mar', revenue: 409400, projected: null,   actual: true },
      { month: 'Apr', revenue: 408000, projected: null,   actual: true },
      { month: 'May', revenue: 287500, projected: 287500, actual: true },
      { month: 'Jun', revenue: null,   projected: 420000, actual: false },
      { month: 'Jul', revenue: null,   projected: 510000, actual: false },
      { month: 'Aug', revenue: null,   projected: 545000, actual: false },
      { month: 'Sep', revenue: null,   projected: 490000, actual: false },
      { month: 'Oct', revenue: null,   projected: 460000, actual: false },
      { month: 'Nov', revenue: null,   projected: 415000, actual: false },
      { month: 'Dec', revenue: null,   projected: 320000, actual: false },
    ],
    cashFlow: [
      { month: 'May', inflow: 287500, outflow: 198500, net:  89000 },
      { month: 'Jun', inflow: 395000, outflow: 258000, net: 137000 },
      { month: 'Jul', inflow: 472000, outflow: 298000, net: 174000 },
      { month: 'Aug', inflow: 545000, outflow: 340000, net: 205000 },
    ],
    upcomingBilling: [
      { project_name: 'Crescent South Apartments',       amount:  68100, due_date: '2026-05-25', status: 'pending' },
      { project_name: 'Triad Multifamily Phase 1',        amount:  80500, due_date: '2026-05-30', status: 'pending' },
      { project_name: 'Huntersville Luxury Apartments',   amount:  51500, due_date: '2026-06-15', status: 'upcoming' },
      { project_name: 'Ballantyne Corporate Park Ph.3',   amount:  71250, due_date: '2026-07-01', status: 'upcoming' },
      { project_name: 'Lake Norman Hotel Renovation',     amount:  56688, due_date: '2026-07-15', status: 'upcoming' },
    ],
  },
};

const TERRITORY_NAMES = { 1: 'Charlotte Metro', 2: 'Lake Norman', 3: 'South Carolina', 4: 'Triad' };

function filterAnalytics(data, areaId) {
  if (!areaId) return data;
  const name = TERRITORY_NAMES[areaId];
  if (!name) return data;
  return {
    ...data,
    revenueByTerritory: (data.revenueByTerritory || []).filter((t) => t.territory_name === name),
    topCustomers:       (data.topCustomers || []).filter((c) => c.territory_name === name),
    invoices:           (data.invoices || []).filter((i) => i.territory_name === name),
    expenses:           (data.expenses || []).filter((e) => e.territory_name === name),
    bids:               (data.bids || []).filter((b) => b.territory_name === name),
    statePerformance:   (data.statePerformance || []).filter((s) => s.territory_name === name),
    installers:         (data.installers || []).filter((i) => i.territory_name === name),
  };
}

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

function formatRole(role) {
  if (!role) return 'Finance';
  return role.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2).toUpperCase();
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

// ─── Shared charting helpers ──────────────────────────────────

function HorizontalBar({ label, value, max, color, sub }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="hbar-row">
      <div className="hbar-label"><strong>{label}</strong>{sub && <small>{sub}</small>}</div>
      <div className="hbar-track"><div className="hbar-fill" style={{ width: `${pct}%`, background: color || 'var(--brand)' }} /></div>
      <div className="hbar-value">{compactMoney(value)}</div>
    </div>
  );
}

function AgingBucket({ label, count, amount, color }) {
  return (
    <div className="aging-bucket" style={{ '--bucket-color': color }}>
      <div className="aging-count">{count}</div>
      <div className="aging-amount">{compactMoney(amount)}</div>
      <div className="aging-label">{label}</div>
    </div>
  );
}

function WinLossBar({ bids }) {
  const total  = bids.length || 1;
  const won    = bids.filter((b) => b.won || b.bid_status === 'won').length;
  const lost   = bids.filter((b) => b.bid_status === 'lost').length;
  const pending = total - won - lost;
  return (
    <div className="win-loss-bar-wrap">
      <div className="win-loss-bar">
        <div style={{ width: `${(won / total) * 100}%`, background: 'var(--green)' }} title={`Won: ${won}`} />
        <div style={{ width: `${(pending / total) * 100}%`, background: 'var(--gold)' }} title={`Pending: ${pending}`} />
        <div style={{ width: `${(lost / total) * 100}%`, background: 'var(--red)' }} title={`Lost: ${lost}`} />
      </div>
      <div className="win-loss-legend">
        <span><i style={{ background: 'var(--green)' }} />Won ({won})</span>
        <span><i style={{ background: 'var(--gold)' }} />Pending ({pending})</span>
        <span><i style={{ background: 'var(--red)' }} />Lost ({lost})</span>
      </div>
    </div>
  );
}

function MultiSeriesChart({ title, series, labels }) {
  const width = 960;
  const height = 280;
  const pad = { top: 16, right: 24, bottom: 40, left: 66 };
  const allValues = series.flatMap((s) => s.values).filter((v) => v != null && !Number.isNaN(Number(v)));
  const maxVal = Math.max(...allValues, 1);
  const pw = width - pad.left - pad.right;
  const ph = height - pad.top - pad.bottom;
  const cx = (i) => pad.left + (i / Math.max(labels.length - 1, 1)) * pw;
  const cy = (v) => pad.top + (1 - Number(v) / maxVal) * ph;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((r) => maxVal * r);
  const makePath = (values) => values.reduce((p, v, i) => {
    if (v == null) return p;
    return `${p}${p ? ' L' : 'M'} ${cx(i).toFixed(1)} ${cy(v).toFixed(1)}`;
  }, '');

  return (
    <section className="pacing-card fin-chart-wide">
      <div className="fin-panel-head">
        <h2>{title}</h2>
        <div className="chart-legend" style={{ borderTop: 0, paddingTop: 0, marginTop: 0 }}>
          {series.map((s) => <span key={s.label}><i style={{ background: s.color }} />{s.label}</span>)}
        </div>
      </div>
      <div style={{ padding: '0 18px 18px' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', width: '100%' }}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={cy(t)} y2={cy(t)} stroke="#e6ebef" strokeWidth="1" />
              <text x={pad.left - 8} y={cy(t) + 4} textAnchor="end" fill="#6f7a84" fontSize="11">{compactMoney(t)}</text>
            </g>
          ))}
          {labels.map((label, i) => (
            <g key={label}>
              <line x1={cx(i)} x2={cx(i)} y1={pad.top} y2={height - pad.bottom} stroke="#eef2f4" strokeWidth="1" />
              <text x={cx(i)} y={height - 8} textAnchor="middle" fill="#6f7a84" fontSize="11">{label}</text>
            </g>
          ))}
          {series.map((s) => (
            <path key={s.label} d={makePath(s.values)} fill="none" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dashed ? '7 5' : '0'} />
          ))}
          {series.map((s) => s.values.map((v, i) => v == null ? null : (
            <circle key={`${s.label}-${i}`} cx={cx(i)} cy={cy(v)} r="4" fill={s.color} />
          )))}
        </svg>
      </div>
    </section>
  );
}

function FinKpiCard({ label, value, sub, color }) {
  return (
    <div className="fin-kpi-card" style={{ '--kpi-color': color || 'var(--brand)' }}>
      <span>{label}</span>
      <strong>{value}</strong>
      {sub && <small>{sub}</small>}
    </div>
  );
}

function ProgressBar({ pct, color }) {
  const w = Math.min(100, Math.max(0, pct * 100));
  return (
    <div className="fin-progress-track">
      <div className="fin-progress-fill" style={{ width: `${w}%`, background: color || 'var(--brand)' }} />
    </div>
  );
}

function MonthlyMetricsTable({ monthly }) {
  return (
    <section className="panel">
      <div className="panel-head"><h2>Monthly KPIs</h2><span>{monthly.length} months</span></div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue</th>
              <th>Gross Profit</th>
              <th>GP %</th>
              <th>Net Profit</th>
              <th>NP %</th>
              <th>Inst. Hours</th>
              <th>$/MH</th>
              <th>Hit Rate</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((row) => (
              <tr key={row.metric_month}>
                <td><strong>{monthLabel(row.metric_month)} {new Date(`${row.metric_month}T12:00:00`).getFullYear()}</strong></td>
                <td>{currency(row.revenue)}</td>
                <td>{currency(row.gp_dollars)}</td>
                <td><span className={`badge ${Number(row.gp_percent) >= 0.25 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(row.gp_percent)}</span></td>
                <td>{currency(row.np_dollars)}</td>
                <td><span className={`badge ${Number(row.np_percent) >= 0.08 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(row.np_percent)}</span></td>
                <td>{Number(row.installer_hours || 0).toFixed(0)}</td>
                <td>{currency(row.ppmh)}</td>
                <td>{formatRatio(row.hit_rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FinanceOverview({ data, dashboard }) {
  const ov = data.overview;
  const monthly = data.monthly || [];
  const finance = buildFinanceModel(dashboard);
  const labels = monthly.map((m) => monthLabel(m.metric_month));
  const chartSeries = [
    { label: 'Revenue', color: '#214f6f', values: monthly.map((m) => Number(m.revenue)) },
    { label: 'Gross Profit', color: '#2f8f5b', values: monthly.map((m) => Number(m.gp_dollars)) },
    { label: 'Net Profit', color: '#d99b2b', values: monthly.map((m) => Number(m.np_dollars)) },
    { label: 'Pipeline', color: '#ff62c7', dashed: true, values: monthly.map((m) => Number(m.pipeline_value)) },
  ];

  return (
    <>
      <div className="fin-kpi-grid">
        <FinKpiCard label="YTD Revenue" value={compactMoney(ov.ytd_revenue)} sub="Accrued to date" color="var(--brand)" />
        <FinKpiCard label="YTD Gross Profit" value={compactMoney(ov.ytd_gp_dollars)} sub={formatRatio(ov.ytd_gp_percent) + ' margin'} color="var(--green)" />
        <FinKpiCard label="YTD Net Profit" value={compactMoney(ov.ytd_np_dollars)} sub={formatRatio(ov.ytd_np_percent) + ' margin'} color="#2980b9" />
        <FinKpiCard label="Total Backlog" value={compactMoney(ov.total_backlog)} sub="Remaining to bill" color="var(--orange)" />
        <FinKpiCard label="Bill This Month" value={compactMoney(ov.bill_this_month)} sub="Current billing cycle" color="#8e44ad" />
        <FinKpiCard label="Pipeline" value={compactMoney(ov.total_pipeline)} sub={`${ov.ytd_bids_sent} bids sent YTD`} color="var(--gold)" />
      </div>
      <div className="finance-kicker">2026 Pacing — Top-line Goals</div>
      <section className="pacing-grid">
        {finance.pacing.map((item) => <PacingGauge item={item} key={item.label} />)}
      </section>
      {monthly.length > 0 && (
        <MultiSeriesChart title="Revenue · Gross Profit · Net Profit by Month" series={chartSeries} labels={labels} />
      )}
      <MonthlyMetricsTable monthly={monthly} />
    </>
  );
}

function PayrollView({ data }) {
  const rows = data.payroll || [];
  const totalLabor    = sumValues(rows, 'estimated_labor_cost');
  const totalMaterial = sumValues(rows, 'estimated_material_cost');
  const totalEstimate = sumValues(rows, 'total_estimate');
  const totalContract = sumValues(rows, 'total_contract');
  const totalCostRec  = sumValues(rows, 'actual_cost_recognized');

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
        <FinKpiCard label="Total Est. Labor" value={compactMoney(totalLabor)} sub={`${totalContract ? ((totalLabor / totalContract) * 100).toFixed(1) : 0}% of contract`} color="var(--brand)" />
        <FinKpiCard label="Total Est. Material" value={compactMoney(totalMaterial)} sub={`${totalContract ? ((totalMaterial / totalContract) * 100).toFixed(1) : 0}% of contract`} color="var(--orange)" />
        <FinKpiCard label="Total Estimate" value={compactMoney(totalEstimate)} sub="Labor + material" color="var(--green)" />
        <FinKpiCard label="Total Contract" value={compactMoney(totalContract)} sub="Signed value" color="#8e44ad" />
        <FinKpiCard label="Cost Recognized" value={compactMoney(totalCostRec)} sub="QBO cost to date" color="var(--gold)" />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Payroll &amp; Labor Detail</h2><span>{rows.length} projects</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Project</th>
                <th>Territory</th>
                <th>PM</th>
                <th>Payroll</th>
                <th>Est. Labor</th>
                <th>Est. Material</th>
                <th>Total Est.</th>
                <th>Contract</th>
                <th>Est. Margin</th>
                <th>Cost Rec.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const margin = Number(row.total_contract) - Number(row.total_estimate);
                const marginPct = Number(row.total_contract) ? margin / Number(row.total_contract) : 0;
                return (
                  <tr key={row.project_id}>
                    <td>{row.job_number || '-'}</td>
                    <td>
                      <strong>{row.project_name}</strong>
                      <small><span className={`badge badge-${row.status}`}>{statusLabels[row.status] || row.status}</span></small>
                    </td>
                    <td>{row.territory_name || '-'}</td>
                    <td>{row.pm_name || '-'}</td>
                    <td>{row.payroll_reporting ? <span className="badge badge-completed">Active</span> : <span className="badge" style={{ background: '#eee', color: '#888' }}>Off</span>}</td>
                    <td>{currency(row.estimated_labor_cost)}</td>
                    <td>{currency(row.estimated_material_cost)}</td>
                    <td>{currency(row.total_estimate)}</td>
                    <td><strong>{currency(row.total_contract)}</strong></td>
                    <td>
                      <strong style={{ color: margin >= 0 ? 'var(--green)' : 'var(--red)' }}>{currency(margin)}</strong>
                      <small>{formatRatio(marginPct)}</small>
                    </td>
                    <td>{currency(row.actual_cost_recognized)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function BillingView({ data }) {
  const rows = data.billing || [];
  const totalBilled    = sumValues(rows, 'total_billed_to_date');
  const totalRemaining = sumValues(rows, 'remaining_to_bill');
  const totalThisMonth = sumValues(rows, 'bill_this_month');
  const totalRetainage = sumValues(rows, 'accrued_retainage');

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <FinKpiCard label="Billed to Date" value={compactMoney(totalBilled)} sub="Across all active jobs" color="var(--brand)" />
        <FinKpiCard label="Remaining to Bill" value={compactMoney(totalRemaining)} sub="Future revenue" color="var(--orange)" />
        <FinKpiCard label="Bill This Month" value={compactMoney(totalThisMonth)} sub="Current cycle" color="var(--green)" />
        <FinKpiCard label="Accrued Retainage" value={compactMoney(totalRetainage)} sub="Held by clients" color="#8e44ad" />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Billing Status by Project</h2><span>{rows.length} projects</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Project</th>
                <th>Territory / PM</th>
                <th>% Complete</th>
                <th>Billed to Date</th>
                <th>Remaining</th>
                <th>This Month</th>
                <th>Retainage</th>
                <th>Under/Over</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const pct = Number(row.percent_complete || 0);
                const underOver = Number(row.under_over_billed || 0);
                return (
                  <tr key={row.project_id}>
                    <td>{row.job_number || '-'}</td>
                    <td>
                      <strong>{row.project_name}</strong>
                      <small><span className={`badge badge-${row.status}`}>{statusLabels[row.status] || row.status}</span></small>
                    </td>
                    <td>
                      <strong>{row.territory_name || '-'}</strong>
                      <small>{row.pm_name || '-'}</small>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ProgressBar pct={pct} color={pct >= 0.75 ? 'var(--green)' : pct >= 0.4 ? 'var(--gold)' : 'var(--brand)'} />
                        <small style={{ whiteSpace: 'nowrap' }}>{(pct * 100).toFixed(0)}%</small>
                      </div>
                    </td>
                    <td>{currency(row.total_billed_to_date)}</td>
                    <td>{currency(row.remaining_to_bill)}</td>
                    <td><strong>{currency(row.bill_this_month)}</strong></td>
                    <td>{currency(row.accrued_retainage)}</td>
                    <td style={{ color: underOver < 0 ? 'var(--red)' : underOver > 0 ? 'var(--green)' : 'var(--muted)' }}>
                      {underOver === 0 ? '—' : currency(underOver)}
                    </td>
                    <td>{row.invoice_sent ? <span className="badge badge-completed">Sent</span> : <span className="badge badge-pending">Pending</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function BidsView({ data }) {
  const rows = data.bids || [];
  const totalValue = sumValues(rows, 'bid_amount');
  const wonRows    = rows.filter((r) => r.won || r.bid_status === 'won');
  const wonValue   = sumValues(wonRows, 'bid_amount');
  const winRate    = rows.length ? wonRows.length / rows.length : 0;
  const avgGpPct   = rows.length ? rows.reduce((s, r) => s + (Number(r.bid_amount) ? Number(r.estimated_gp) / Number(r.bid_amount) : 0), 0) / rows.length : 0;

  const bidStatusColor = { won: 'badge-completed', lost: 'badge-active', pending: 'badge-pending' };

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <FinKpiCard label="Total Bid Value" value={compactMoney(totalValue)} sub={`${rows.length} bids`} color="var(--brand)" />
        <FinKpiCard label="Won Value" value={compactMoney(wonValue)} sub={`${wonRows.length} projects awarded`} color="var(--green)" />
        <FinKpiCard label="Win Rate" value={formatRatio(winRate)} sub="By count" color="var(--gold)" />
        <FinKpiCard label="Avg Est. GP%" value={formatRatio(avgGpPct)} sub="Across all bids" color="#8e44ad" />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Bid Pipeline</h2><span>{rows.length} bids</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Company</th>
                <th>Territory</th>
                <th>Bid Amount</th>
                <th>Est. GP</th>
                <th>GP %</th>
                <th>Est. NP</th>
                <th>NP %</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const gpPct = Number(row.bid_amount) ? Number(row.estimated_gp) / Number(row.bid_amount) : 0;
                const npPct = Number(row.bid_amount) ? Number(row.estimated_np) / Number(row.bid_amount) : 0;
                return (
                  <tr key={row.id}>
                    <td>{shortDate(row.bid_date)}</td>
                    <td><strong>{row.project_name}</strong></td>
                    <td>{row.company_name || '-'}</td>
                    <td>{row.territory_name || '-'}</td>
                    <td><strong>{currency(row.bid_amount)}</strong></td>
                    <td>{currency(row.estimated_gp)}</td>
                    <td><span className={`badge ${gpPct >= 0.25 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(gpPct)}</span></td>
                    <td>{currency(row.estimated_np)}</td>
                    <td><span className={`badge ${npPct >= 0.08 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(npPct)}</span></td>
                    <td>{Number(row.estimated_hours || 0).toFixed(0)}</td>
                    <td><span className={`badge ${bidStatusColor[row.bid_status] || 'badge-pending'}`}>{row.bid_status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function ChangeOrdersView({ data }) {
  const rows = data.changeOrders || [];
  const totalAmount   = sumValues(rows, 'amount');
  const totalCostImpact = sumValues(rows, 'estimated_cost_change');
  const gpImpact      = totalAmount - totalCostImpact;

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
        <FinKpiCard label="Total CO Value" value={compactMoney(totalAmount)} sub={`${rows.length} change orders`} color="var(--brand)" />
        <FinKpiCard label="Est. Cost Impact" value={compactMoney(totalCostImpact)} sub="Additional costs" color="var(--orange)" />
        <FinKpiCard label="Est. GP Impact" value={compactMoney(gpImpact)} sub={totalAmount ? formatRatio(gpImpact / totalAmount) + ' added margin' : '—'} color="var(--green)" />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Change Orders</h2><span>{rows.length} total</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Job</th>
                <th>Project</th>
                <th>CO #</th>
                <th>Description</th>
                <th>CO Amount</th>
                <th>Est. Cost Change</th>
                <th>GP Impact</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const gpImpactRow = Number(row.amount) - Number(row.estimated_cost_change);
                return (
                  <tr key={row.id}>
                    <td>{shortDate(row.created_at)}</td>
                    <td>{row.job_number || '-'}</td>
                    <td>
                      <strong>{row.project_name}</strong>
                      <small><span className={`badge badge-${row.status}`}>{statusLabels[row.status] || row.status}</span></small>
                    </td>
                    <td>{row.co_number || '-'}</td>
                    <td style={{ maxWidth: 240 }}>{row.description || '-'}</td>
                    <td><strong>{currency(row.amount)}</strong></td>
                    <td>{currency(row.estimated_cost_change)}</td>
                    <td style={{ color: gpImpactRow >= 0 ? 'var(--green)' : 'var(--red)' }}><strong>{currency(gpImpactRow)}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// ─── Revenue Analytics ────────────────────────────────────────

function RevenueView({ analytics }) {
  const monthly  = analytics.monthlyRevenue || [];
  const byTerritory = analytics.revenueByTerritory || [];
  const customers   = analytics.topCustomers || [];
  const ytdRev  = sumValues(monthly, 'revenue');
  const ytdGp   = sumValues(monthly, 'gp_dollars');
  const ytdNp   = sumValues(monthly, 'np_dollars');
  const avgMonth = monthly.length ? ytdRev / monthly.length : 0;
  const bestMonth = monthly.reduce((best, m) => Number(m.revenue) > Number(best.revenue || 0) ? m : best, {});
  const maxTerr = Math.max(...byTerritory.map((t) => Number(t.total_revenue)), 1);
  const territoryColors = ['#214f6f', '#2f8f5b', '#d99b2b', '#8e44ad'];

  const chartLabels = monthly.map((m) => monthLabel(m.metric_month));
  const chartSeries = [
    { label: 'Gross Revenue',  color: '#214f6f', values: monthly.map((m) => Number(m.revenue)) },
    { label: 'Gross Profit',   color: '#2f8f5b', values: monthly.map((m) => Number(m.gp_dollars)) },
    { label: 'Net Profit',     color: '#d99b2b', values: monthly.map((m) => Number(m.np_dollars)) },
    { label: 'Pipeline Value', color: '#ff62c7', dashed: true, values: monthly.map((m) => Number(m.pipeline_value)) },
  ];

  return (
    <>
      <div className="fin-kpi-grid">
        <FinKpiCard label="YTD Gross Revenue"  value={compactMoney(ytdRev)}   sub={`${monthly.length} months reported`} color="var(--brand)" />
        <FinKpiCard label="YTD Gross Profit"   value={compactMoney(ytdGp)}    sub={ytdRev ? formatRatio(ytdGp / ytdRev) + ' GP margin' : '—'} color="var(--green)" />
        <FinKpiCard label="YTD Net Profit"     value={compactMoney(ytdNp)}    sub={ytdRev ? formatRatio(ytdNp / ytdRev) + ' NP margin' : '—'} color="#2980b9" />
        <FinKpiCard label="Avg Monthly Revenue" value={compactMoney(avgMonth)} sub="Rolling average" color="var(--gold)" />
        <FinKpiCard label="Best Month"         value={compactMoney(bestMonth.revenue)} sub={bestMonth.metric_month ? monthLabel(bestMonth.metric_month) + ' 2026' : '—'} color="var(--orange)" />
        <FinKpiCard label="Active Pipeline"    value={compactMoney(monthly[monthly.length - 1]?.pipeline_value)} sub="Latest month" color="#8e44ad" />
      </div>

      {monthly.length > 0 && (
        <MultiSeriesChart title="Revenue · Gross Profit · Net Profit vs Pipeline" series={chartSeries} labels={chartLabels} />
      )}

      <div className="two-col-grid">
        <section className="panel">
          <div className="panel-head"><h2>Revenue by Territory</h2><span>Ranked by contract value</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {byTerritory.map((t, i) => (
              <HorizontalBar key={t.territory_name} label={t.territory_name} value={Number(t.total_revenue)} max={maxTerr} color={territoryColors[i % territoryColors.length]} sub={`${t.project_count} projects · Est. profit: ${compactMoney(t.est_profit)}`} />
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head"><h2>Top Customers by Revenue</h2><span>Lifetime contract value</span></div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Customer</th><th>Territory</th><th>Jobs</th><th>Total Revenue</th><th>Est. GP</th></tr></thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.company_name}>
                    <td><strong>{c.company_name}</strong></td>
                    <td>{c.territory_name || '—'}</td>
                    <td>{c.project_count}</td>
                    <td><strong>{currency(c.total_revenue)}</strong></td>
                    <td style={{ color: 'var(--green)' }}>{currency(c.est_profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

// ─── Bids & Profitability ─────────────────────────────────────

function BidsAnalyticsView({ analytics }) {
  const bids = analytics.bids || [];
  const won     = bids.filter((b) => b.won || b.bid_status === 'won');
  const lost    = bids.filter((b) => b.bid_status === 'lost');
  const pending = bids.filter((b) => b.bid_status === 'pending');
  const winRate = bids.length ? won.length / bids.length : 0;
  const wonValue  = sumValues(won, 'bid_amount');
  const totalValue = sumValues(bids, 'bid_amount');
  const avgEstGp  = bids.length ? bids.reduce((s, b) => s + (Number(b.bid_amount) ? Number(b.estimated_gp) / Number(b.bid_amount) : 0), 0) / bids.length : 0;

  const underpriced = bids.filter((b) => {
    if (!b.actual_gp || !b.bid_amount) return false;
    const estPct    = Number(b.estimated_gp) / Number(b.bid_amount);
    const actualPct = Number(b.actual_gp)    / Number(b.bid_amount);
    return actualPct < estPct - 0.04;
  });

  const bidStatusBadge = { won: 'badge-completed', lost: 'badge-active', pending: 'badge-pending' };

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
        <FinKpiCard label="Total Bids Sent"    value={bids.length}              sub={`${currency(totalValue)} total value`} color="var(--brand)" />
        <FinKpiCard label="Bids Won"           value={won.length}               sub={compactMoney(wonValue) + ' awarded'}  color="var(--green)" />
        <FinKpiCard label="Bids Pending"       value={pending.length}           sub="Awaiting decision"                    color="var(--gold)" />
        <FinKpiCard label="Bids Lost"          value={lost.length}              sub={compactMoney(sumValues(lost, 'bid_amount'))} color="var(--red)" />
        <FinKpiCard label="Win Rate"           value={formatRatio(winRate)}     sub={`Avg est. GP: ${formatRatio(avgEstGp)}`}    color="#8e44ad" />
      </div>

      <section className="panel">
        <div className="panel-head"><h2>Bid Conversion Overview</h2><span>Won · Pending · Lost</span></div>
        <div style={{ padding: '18px' }}><WinLossBar bids={bids} /></div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Bids &amp; Profitability Detail</h2><span>{bids.length} bids · Finance view</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Date</th><th>Bid</th><th>Territory</th><th>Company</th><th>Bid Value</th><th>Est. GP %</th><th>Actual GP %</th><th>GP Variance</th><th>Est. Hours</th><th>Status</th></tr>
            </thead>
            <tbody>
              {bids.map((b) => {
                const estGpPct    = Number(b.bid_amount) ? Number(b.estimated_gp) / Number(b.bid_amount) : 0;
                const actualGpPct = (b.actual_gp != null && Number(b.bid_amount)) ? Number(b.actual_gp) / Number(b.bid_amount) : null;
                const variance    = actualGpPct != null ? actualGpPct - estGpPct : null;
                const isUnder     = variance != null && variance < -0.03;
                return (
                  <tr key={b.id} style={isUnder ? { background: '#fff8f0' } : {}}>
                    <td>{shortDate(b.bid_date)}</td>
                    <td>
                      <strong>{b.project_name}</strong>
                      {isUnder && <small style={{ color: 'var(--orange)', fontWeight: 700 }}>⚠ Underbid</small>}
                    </td>
                    <td>{b.territory_name || '—'}</td>
                    <td>{b.company_name || '—'}</td>
                    <td><strong>{currency(b.bid_amount)}</strong></td>
                    <td><span className={`badge ${estGpPct >= 0.25 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(estGpPct)}</span></td>
                    <td>{actualGpPct != null ? <span className={`badge ${actualGpPct >= 0.22 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(actualGpPct)}</span> : <span style={{ color: 'var(--muted)' }}>Pending</span>}</td>
                    <td style={{ color: variance == null ? 'var(--muted)' : variance < 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>
                      {variance == null ? '—' : `${variance > 0 ? '+' : ''}${(variance * 100).toFixed(1)}pp`}
                    </td>
                    <td>{Number(b.estimated_hours || 0).toFixed(0)}</td>
                    <td><span className={`badge ${bidStatusBadge[b.bid_status] || 'badge-pending'}`}>{b.bid_status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {underpriced.length > 0 && (
        <section className="panel" style={{ border: '1px solid #f5c06b', background: '#fffbf0' }}>
          <div className="panel-head"><h2 style={{ color: 'var(--orange)' }}>⚠ Underpriced Bids — Finance Alert</h2><span>{underpriced.length} bids where actual GP fell below estimate by &gt;4pp</span></div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Bid</th><th>Territory</th><th>PM</th><th>Bid Amount</th><th>Est. GP%</th><th>Actual GP%</th><th>Missed Margin</th></tr></thead>
              <tbody>
                {underpriced.map((b) => {
                  const estPct = Number(b.bid_amount) ? Number(b.estimated_gp) / Number(b.bid_amount) : 0;
                  const actPct = Number(b.bid_amount) ? Number(b.actual_gp) / Number(b.bid_amount) : 0;
                  const missed = (estPct - actPct) * Number(b.bid_amount);
                  return (
                    <tr key={b.id}>
                      <td><strong>{b.project_name}</strong></td>
                      <td>{b.territory_name}</td>
                      <td>{b.company_name}</td>
                      <td>{currency(b.bid_amount)}</td>
                      <td>{formatRatio(estPct)}</td>
                      <td style={{ color: 'var(--red)' }}>{formatRatio(actPct)}</td>
                      <td style={{ color: 'var(--red)', fontWeight: 700 }}>{currency(missed)} lost margin</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

// ─── Accounts Receivable (Invoices) ───────────────────────────

function InvoicesView({ analytics }) {
  const invoices = analytics.invoices || [];
  const outstanding = invoices.filter((i) => !i.invoice_sent || Number(i.days_outstanding) > 0);
  const overdue30   = invoices.filter((i) => Number(i.days_outstanding) > 30);
  const overdue60   = invoices.filter((i) => Number(i.days_outstanding) > 60);
  const overdue90   = invoices.filter((i) => Number(i.days_outstanding) > 90);
  const totalOut    = sumValues(outstanding, 'amount_due');
  const totalOv30   = sumValues(overdue30, 'amount_due');

  function agingBucket(days) {
    if (days <= 30)  return { label: '0–30 days', color: 'var(--green)' };
    if (days <= 60)  return { label: '31–60 days', color: 'var(--gold)' };
    if (days <= 90)  return { label: '61–90 days', color: 'var(--orange)' };
    return { label: '90+ days', color: 'var(--red)' };
  }

  const agingGroups = [
    { label: '0–30 days',   color: '#2f8f5b', count: invoices.filter((i) => Number(i.days_outstanding) <= 30).length,                                                      amount: sumValues(invoices.filter((i) => Number(i.days_outstanding) <= 30), 'amount_due') },
    { label: '31–60 days',  color: '#d99b2b', count: invoices.filter((i) => Number(i.days_outstanding) > 30 && Number(i.days_outstanding) <= 60).length,  amount: sumValues(invoices.filter((i) => Number(i.days_outstanding) > 30 && Number(i.days_outstanding) <= 60), 'amount_due') },
    { label: '61–90 days',  color: '#be6b2d', count: invoices.filter((i) => Number(i.days_outstanding) > 60 && Number(i.days_outstanding) <= 90).length,  amount: sumValues(invoices.filter((i) => Number(i.days_outstanding) > 60 && Number(i.days_outstanding) <= 90), 'amount_due') },
    { label: '90+ days',    color: '#b84a4a', count: invoices.filter((i) => Number(i.days_outstanding) > 90).length,                                                        amount: sumValues(invoices.filter((i) => Number(i.days_outstanding) > 90), 'amount_due') },
  ];

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <FinKpiCard label="Total A/R Outstanding" value={compactMoney(totalOut)}              sub={`${outstanding.length} open invoices`} color="var(--brand)" />
        <FinKpiCard label="Overdue &gt; 30 Days"  value={compactMoney(totalOv30)}             sub={`${overdue30.length} invoices`}        color="var(--orange)" />
        <FinKpiCard label="Overdue &gt; 60 Days"  value={compactMoney(sumValues(overdue60, 'amount_due'))} sub={`${overdue60.length} invoices`} color="var(--red)" />
        <FinKpiCard label="Total Retainage Held"  value={compactMoney(sumValues(invoices, 'retainage'))}   sub="Held by clients" color="#8e44ad" />
      </div>

      <section className="panel">
        <div className="panel-head"><h2>Invoice Aging Buckets</h2><span>A/R by days outstanding</span></div>
        <div className="aging-grid">
          {agingGroups.map((g) => <AgingBucket key={g.label} label={g.label} count={g.count} amount={g.amount} color={g.color} />)}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Open Invoices &amp; A/R Ledger</h2><span>Sorted by oldest first</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Job</th><th>Project</th><th>Customer</th><th>Territory</th><th>Billing Date</th><th>Amount Due</th><th>Retainage</th><th>Days O/S</th><th>Invoice #</th><th>Status</th></tr>
            </thead>
            <tbody>
              {[...invoices].sort((a, b) => Number(b.days_outstanding) - Number(a.days_outstanding)).map((inv) => {
                const { color } = agingBucket(Number(inv.days_outstanding));
                return (
                  <tr key={`${inv.project_id}-${inv.billing_month}`}>
                    <td>{inv.job_number || '—'}</td>
                    <td><strong>{inv.project_name}</strong></td>
                    <td>{inv.company_name || '—'}</td>
                    <td>{inv.territory_name || '—'}</td>
                    <td>{shortDate(inv.billing_month)}</td>
                    <td><strong>{currency(inv.amount_due)}</strong></td>
                    <td>{currency(inv.retainage)}</td>
                    <td><span style={{ fontWeight: 800, color }}>{Number(inv.days_outstanding)} days</span></td>
                    <td>{inv.qbo_invoice_number || <span style={{ color: 'var(--muted)' }}>Not sent</span>}</td>
                    <td>{inv.invoice_sent ? <span className="badge badge-completed">Sent</span> : <span className="badge badge-pending">Pending</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// ─── Expenses & Cost Tracking ────────────────────────────────

function ExpensesView({ analytics }) {
  const expenses   = analytics.expenses || [];
  const categories = analytics.expenseCategories || [];
  const totalEst   = sumValues(expenses, 'total_estimate');
  const totalAct   = sumValues(expenses, 'actual_cost');
  const variance   = totalAct - totalEst;
  const maxCat     = Math.max(...categories.map((c) => c.amount), 1);
  const catColors  = ['#214f6f', '#2f8f5b', '#d99b2b', '#8e44ad', '#be6b2d'];

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <FinKpiCard label="Total Estimated COGS" value={compactMoney(totalEst)} sub="Labor + materials + overhead" color="var(--brand)" />
        <FinKpiCard label="Actual COGS Recognized" value={compactMoney(totalAct)} sub="From QBO cost entries" color="var(--orange)" />
        <FinKpiCard label="Cost Variance" value={compactMoney(Math.abs(variance))} sub={variance < 0 ? 'Under budget ✓' : 'Over budget ⚠'} color={variance < 0 ? 'var(--green)' : 'var(--red)'} />
        <FinKpiCard label="Highest Labor %" value={formatRatio(expenses.length ? Math.max(...expenses.map((e) => Number(e.contract_value) ? Number(e.est_labor) / Number(e.contract_value) : 0)) : 0)} sub="Across all projects" color="#8e44ad" />
      </div>

      <div className="two-col-grid">
        <section className="panel">
          <div className="panel-head"><h2>Cost Category Breakdown</h2><span>Estimated spend by type</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
            {categories.map((c, i) => (
              <HorizontalBar key={c.category} label={c.category} value={c.amount} max={maxCat} color={catColors[i % catColors.length]} sub={`${(c.pct * 100).toFixed(0)}% of total costs`} />
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head"><h2>Estimated vs. Actual by Project</h2><span>Cost variance tracking</span></div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Job</th><th>Project</th><th>PM</th><th>Est. COGS</th><th>Actual COGS</th><th>Variance</th><th>Status</th></tr></thead>
              <tbody>
                {expenses.map((e) => {
                  const v = Number(e.actual_cost) - Number(e.total_estimate);
                  const hasActual = Number(e.actual_cost) > 0;
                  return (
                    <tr key={e.project_id}>
                      <td>{e.job_number || '—'}</td>
                      <td><strong>{e.project_name}</strong></td>
                      <td>{e.pm_name || '—'}</td>
                      <td>{currency(e.total_estimate)}</td>
                      <td>{hasActual ? currency(e.actual_cost) : <span style={{ color: 'var(--muted)' }}>Not started</span>}</td>
                      <td style={{ color: !hasActual ? 'var(--muted)' : v > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>
                        {!hasActual ? '—' : `${v >= 0 ? '+' : ''}${currency(v)}`}
                      </td>
                      <td><span className={`badge badge-${e.status}`}>{statusLabels[e.status] || e.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

// ─── State / Territory Performance ───────────────────────────

function StateAnalyticsView({ analytics }) {
  const states  = analytics.statePerformance || [];
  const maxRev  = Math.max(...states.map((s) => Number(s.total_revenue)), 1);
  const stateColors = ['#214f6f', '#2f8f5b', '#d99b2b', '#8e44ad'];

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {states.map((s, i) => (
          <div key={s.territory_name} className="fin-kpi-card" style={{ '--kpi-color': stateColors[i % stateColors.length] }}>
            <span>{s.territory_name} ({s.state})</span>
            <strong>{compactMoney(s.total_revenue)}</strong>
            <small>GP: {compactMoney(s.gross_profit)} · {formatRatio(s.gross_profit / s.total_revenue)} margin</small>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-head"><h2>Revenue by Territory</h2><span>Ranked performance comparison</span></div>
        <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
          {states.map((s, i) => (
            <HorizontalBar key={s.territory_name} label={`${s.territory_name} (${s.state})`} value={Number(s.total_revenue)} max={maxRev} color={stateColors[i % stateColors.length]} sub={`${s.project_count} projects · NP: ${compactMoney(s.np_dollars)}`} />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>State Financial Performance</h2><span>Full P&amp;L breakdown by territory</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Territory</th><th>State</th><th>Projects</th><th>Revenue</th><th>Est. COGS</th><th>Gross Profit</th><th>GP %</th><th>Net Profit</th><th>NP %</th><th>Labor Cost</th><th>Tax Rate</th></tr>
            </thead>
            <tbody>
              {states.map((s) => (
                <tr key={s.territory_name}>
                  <td><strong>{s.territory_name}</strong></td>
                  <td><span className="badge badge-active">{s.state}</span></td>
                  <td>{s.project_count}</td>
                  <td><strong>{currency(s.total_revenue)}</strong></td>
                  <td>{currency(s.total_cost)}</td>
                  <td style={{ color: 'var(--green)' }}><strong>{currency(s.gross_profit)}</strong></td>
                  <td><span className={`badge ${s.gross_profit / s.total_revenue >= 0.18 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(s.gross_profit / s.total_revenue)}</span></td>
                  <td style={{ color: 'var(--green)' }}>{currency(s.np_dollars)}</td>
                  <td>{formatRatio(s.np_dollars / s.total_revenue)}</td>
                  <td>{currency(s.labor_cost)}</td>
                  <td>{(s.tax_rate * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// ─── Payroll & Installers ─────────────────────────────────────

function PayrollAnalyticsView({ analytics }) {
  const installers   = analytics.installers || [];
  const payrollMonthly = analytics.payrollMonthly || [];
  const totalHours   = sumValues(installers, 'ytd_hours');
  const totalLabor   = sumValues(installers, 'ytd_labor_cost');
  const totalOT      = sumValues(installers, 'overtime_hours');
  const avgEfficiency = installers.length ? installers.reduce((s, i) => s + Number(i.efficiency_rating), 0) / installers.length : 0;

  const chartLabels = payrollMonthly.map((m) => monthLabel(m.metric_month));
  const chartSeries = [
    { label: 'Labor Cost',      color: '#214f6f', values: payrollMonthly.map((m) => Number(m.total_labor_cost)) },
    { label: 'Overtime Cost',   color: '#b84a4a', values: payrollMonthly.map((m) => Number(m.overtime_cost)) },
  ];

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <FinKpiCard label="YTD Installer Labor Cost" value={compactMoney(totalLabor)} sub={`${totalHours} total hours`}         color="var(--brand)" />
        <FinKpiCard label="YTD Overtime Hours"       value={totalOT}                  sub="Overtime exposure"                  color="var(--red)" />
        <FinKpiCard label="Avg Efficiency Rating"    value={`${(avgEfficiency * 100).toFixed(0)}%`} sub="Across all installers" color="var(--green)" />
        <FinKpiCard label="Cost per Hour (Avg)"      value={currency(totalHours ? totalLabor / totalHours : 0)} sub="Blended labor rate" color="var(--gold)" />
      </div>

      {payrollMonthly.length > 0 && (
        <MultiSeriesChart title="Monthly Labor Cost vs Overtime" series={chartSeries} labels={chartLabels} />
      )}

      <section className="panel">
        <div className="panel-head"><h2>Installer Payroll Detail</h2><span>Labor efficiency &amp; cost per installer</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Installer</th><th>Territory</th><th>Active Jobs</th><th>YTD Hours</th><th>YTD Labor Cost</th><th>Jobs Completed</th><th>Avg Hrs/Job</th><th>OT Hours</th><th>Efficiency</th></tr>
            </thead>
            <tbody>
              {[...installers].sort((a, b) => b.efficiency_rating - a.efficiency_rating).map((inst) => (
                <tr key={inst.id}>
                  <td><strong>{inst.name}</strong></td>
                  <td>{inst.territory_name}</td>
                  <td>{inst.active_projects}</td>
                  <td>{inst.ytd_hours}</td>
                  <td><strong>{currency(inst.ytd_labor_cost)}</strong></td>
                  <td>{inst.projects_completed}</td>
                  <td>{inst.avg_hours_per_project}</td>
                  <td style={{ color: inst.overtime_hours > 40 ? 'var(--red)' : 'var(--muted)', fontWeight: inst.overtime_hours > 40 ? 700 : 400 }}>{inst.overtime_hours}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ProgressBar pct={inst.efficiency_rating} color={inst.efficiency_rating >= 0.9 ? 'var(--green)' : inst.efficiency_rating >= 0.8 ? 'var(--gold)' : 'var(--red)'} />
                      <small style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>{(inst.efficiency_rating * 100).toFixed(0)}%</small>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// ─── Forecasting & Projections ────────────────────────────────

function ForecastingView({ analytics, dashboard }) {
  const fc = analytics.forecasting || {};
  const combined = fc.combined || [];
  const cashFlow = fc.cashFlow || [];
  const upcoming = fc.upcomingBilling || [];
  const revenueGoal = 9500000;
  const ytdActual   = sumValues(combined.filter((m) => m.actual && m.revenue), 'revenue');
  const projectedTotal = sumValues(combined, 'projected') + ytdActual;
  const pipelineVal = (dashboard?.monthlyMetrics || demoMetrics).slice(-1)[0]?.pipeline_value || 0;

  const chartLabels = combined.map((m) => m.month);
  const chartSeries = [
    { label: 'Actual Revenue',     color: '#214f6f', values: combined.map((m) => m.actual && m.revenue ? Number(m.revenue) : null) },
    { label: 'Projected Revenue',  color: '#39ff14', dashed: true, values: combined.map((m) => m.projected ? Number(m.projected) : null) },
    { label: '2026 Goal Line',     color: '#777',    dashed: true, values: combined.map(() => revenueGoal / 12) },
  ];

  const cfLabels = cashFlow.map((m) => m.month);
  const cfSeries = [
    { label: 'Cash Inflow',  color: '#2f8f5b', values: cashFlow.map((m) => m.inflow) },
    { label: 'Cash Outflow', color: '#b84a4a', values: cashFlow.map((m) => m.outflow) },
    { label: 'Net Cash Flow',color: '#d99b2b', dashed: true, values: cashFlow.map((m) => m.net) },
  ];

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <FinKpiCard label="YTD Actual Revenue"      value={compactMoney(ytdActual)}      sub={formatRatio(ytdActual / revenueGoal) + ' of annual goal'}  color="var(--brand)" />
        <FinKpiCard label="Projected Full-Year"     value={compactMoney(projectedTotal)} sub="Based on current trajectory"                                color="var(--green)" />
        <FinKpiCard label="Revenue to Goal"         value={compactMoney(revenueGoal - ytdActual)} sub={`${compactMoney(revenueGoal)} 2026 goal`}          color="var(--orange)" />
        <FinKpiCard label="Active Pipeline"         value={compactMoney(pipelineVal)}   sub="Potential revenue available"                                 color="#8e44ad" />
      </div>

      <MultiSeriesChart title="Revenue Forecast: Actual vs. Projected vs. Goal" series={chartSeries} labels={chartLabels} />

      <div className="two-col-grid">
        {cashFlow.length > 0 && (
          <MultiSeriesChart title="Cash Flow Projection" series={cfSeries} labels={cfLabels} />
        )}

        <section className="panel">
          <div className="panel-head"><h2>Upcoming Billing Schedule</h2><span>Next invoices to send</span></div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Project</th><th>Amount</th><th>Due Date</th><th>Status</th></tr></thead>
              <tbody>
                {upcoming.map((u, i) => (
                  <tr key={i}>
                    <td><strong>{u.project_name}</strong></td>
                    <td><strong>{currency(u.amount)}</strong></td>
                    <td>{shortDate(u.due_date)}</td>
                    <td><span className={`badge ${u.status === 'pending' ? 'badge-pending' : 'badge-active'}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

// ─── Reports ─────────────────────────────────────────────────

const reportTemplates = [
  { group: 'Revenue',    title: 'Monthly P&L Summary',          desc: 'Revenue, GP, NP by month with YoY comparison' },
  { group: 'Revenue',    title: 'Revenue by Territory',          desc: 'Contract value and margin split by region' },
  { group: 'Revenue',    title: 'Top Customer Report',           desc: 'Ranked customers by lifetime revenue and profitability' },
  { group: 'A/R',        title: 'Accounts Receivable Aging',     desc: 'Open invoices grouped by 0–30, 31–60, 61–90, 90+ days' },
  { group: 'A/R',        title: 'Invoice Status Report',         desc: 'All invoices with QBO number, sent status, and amount' },
  { group: 'Bids',       title: 'Bid Pipeline Report',           desc: 'Won/lost/pending bids with estimated vs actual margin' },
  { group: 'Bids',       title: 'Underbid Analysis',             desc: 'Projects where actual GP fell below estimated GP' },
  { group: 'Expenses',   title: 'COGS Variance Report',          desc: 'Estimated vs actual cost by project and category' },
  { group: 'Expenses',   title: 'Labor Cost by Territory',       desc: 'Installer hours and labor cost by region' },
  { group: 'Payroll',    title: 'Installer Productivity Report', desc: 'Efficiency ratings, hours, and OT by installer' },
  { group: 'Payroll',    title: 'Overtime Cost Summary',         desc: 'Overtime hours and cost by installer and month' },
  { group: 'Forecasting','title': 'Revenue Forecast',            desc: 'Projected revenue through year-end vs goal' },
  { group: 'Forecasting','title': 'Cash Flow Projection',        desc: 'Monthly inflow/outflow/net for next 4 months' },
];

function ReportsView() {
  const groups = [...new Set(reportTemplates.map((r) => r.group))];
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <FinKpiCard label="Report Templates"      value={reportTemplates.length} sub="Finance-ready formats"      color="var(--brand)" />
        <FinKpiCard label="Report Categories"     value={groups.length}          sub="Organized by department"    color="var(--green)" />
        <FinKpiCard label="A/R Reports"           value={reportTemplates.filter((r) => r.group === 'A/R').length}     sub="Invoicing &amp; collections" color="var(--orange)" />
        <FinKpiCard label="Last Generated"        value="Today"                  sub="All data current"           color="#8e44ad" />
      </div>
      {groups.map((group) => (
        <section key={group} className="panel">
          <div className="panel-head"><h2>{group} Reports</h2><span>{reportTemplates.filter((r) => r.group === group).length} templates</span></div>
          <div className="report-grid">
            {reportTemplates.filter((r) => r.group === group).map((r) => (
              <div key={r.title} className="report-card">
                <strong>{r.title}</strong>
                <p>{r.desc}</p>
                <div className="report-card-actions">
                  <button type="button" className="btn-outline">Preview</button>
                  <button type="button">Export CSV</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function FinancialDashboard({ dashboard }) {
  const [finTab, setFinTab] = useState('overview');
  const [finData, setFinData] = useState(null);
  const [loadingFin, setLoadingFin] = useState(false);

  useEffect(() => {
    setLoadingFin(true);
    fetch('/api/finance', { credentials: 'include' })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((body) => setFinData(body))
      .catch(() => {})
      .finally(() => setLoadingFin(false));
  }, []);

  const data = finData || demoFinance;
  const finTabs = [
    ['overview', 'Overview'],
    ['payroll', 'Payroll & Labor'],
    ['billing', 'Billing'],
    ['bids', 'Bid Pipeline'],
    ['changes', 'Change Orders'],
  ];

  return (
    <div className="finance-dashboard">
      <div className="fin-tab-bar">
        {finTabs.map(([id, label]) => (
          <button key={id} type="button" className={finTab === id ? 'fin-tab fin-tab-active' : 'fin-tab'} onClick={() => setFinTab(id)}>{label}</button>
        ))}
        {loadingFin && <span className="fin-loading">Loading live data…</span>}
        {!finData && !loadingFin && <span className="fin-loading">Demo data</span>}
      </div>
      {finTab === 'overview' && <FinanceOverview data={data} dashboard={dashboard} />}
      {finTab === 'payroll'  && <PayrollView data={data} />}
      {finTab === 'billing'  && <BillingView data={data} />}
      {finTab === 'bids'     && <BidsView data={data} />}
      {finTab === 'changes'  && <ChangeOrdersView data={data} />}
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

const navGroups = [
  { label: null,          items: [['dashboard', 'Dashboard']] },
  { label: 'Finance',     items: [['revenue', 'Revenue'], ['bids', 'Bids'], ['invoices', 'Invoices'], ['expenses', 'Expenses'], ['payroll', 'Payroll']] },
  { label: 'Analytics',   items: [['states', 'State Analytics'], ['forecasting', 'Forecasting']] },
  { label: 'Operations',  items: [['projects', 'Projects'], ['calendar', 'Calendar']] },
  { label: 'Reports',     items: [['reports', 'Reports']] },
];
const allNavItems = navGroups.flatMap((g) => g.items);

function ProjectManagerDashboard({ user }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [areaId, setAreaId] = useState(user.territoryId || 0);
  const [apiDashboard, setApiDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const dashboard = normalizeDashboard(apiDashboard, areaId);
  const analyticsData = analytics ? { ...demoAnalytics, ...analytics } : demoAnalytics;
  const filteredAnalytics = filterAnalytics(analyticsData, areaId);

  async function refreshFromApi() {
    setLoadingApi(true);
    try {
      const [dashRes, analyticsRes] = await Promise.all([
        fetch('/api/dashboard', { credentials: 'include' }),
        fetch('/api/analytics', { credentials: 'include' }),
      ]);
      if (dashRes.ok) {
        const body = await dashRes.json();
        setApiDashboard(body.dashboards?.projectManager || null);
      }
      if (analyticsRes.ok) {
        setAnalytics(await analyticsRes.json());
      }
    } finally {
      setLoadingApi(false);
    }
  }

  useEffect(() => {
    if (!user.demo) refreshFromApi();
  }, []);

  const currentLabel = allNavItems.find(([id]) => id === activeView)?.[1] || '';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><strong>James Blinds</strong><span>Finance &amp; Operations</span></div>
        {navGroups.map((group) => (
          <div key={group.label || 'main'} className="nav-group">
            {group.label && <span className="nav-group-label">{group.label}</span>}
            {group.items.map(([id, label]) => (
              <button className={activeView === id ? 'nav-active' : ''} key={id} onClick={() => setActiveView(id)} type="button">{label}</button>
            ))}
          </div>
        ))}
        <div className="user-card">
          <div className="user-avatar">{initials(user.name)}</div>
          <div className="user-info">
            <strong>{user.name}</strong>
            <span>{formatRole(user.role)}</span>
            {!analytics && !loadingApi && <span style={{ fontSize: 10, opacity: .5 }}>Demo data</span>}
          </div>
        </div>
      </aside>

      <main className="dashboard">
        <header className="page-head">
          <div><p>{getAreaName(areaId)}</p><h1>{currentLabel}</h1></div>
          <div className="actions">
            <select value={areaId} onChange={(event) => setAreaId(Number(event.target.value))}>
              <option value="0">All territories</option>
              <option value="1">Charlotte Metro</option>
              <option value="2">Lake Norman</option>
              <option value="3">South Carolina</option>
              <option value="4">Triad</option>
            </select>
            <button onClick={refreshFromApi} type="button">{loadingApi ? 'Loading…' : 'Refresh Data'}</button>
          </div>
        </header>

        {activeView === 'dashboard'   && <DashboardHome key={areaId} dashboard={dashboard} />}
        {activeView === 'revenue'     && <RevenueView key={areaId} analytics={filteredAnalytics} />}
        {activeView === 'bids'        && <BidsAnalyticsView key={areaId} analytics={filteredAnalytics} />}
        {activeView === 'invoices'    && <InvoicesView key={areaId} analytics={filteredAnalytics} />}
        {activeView === 'expenses'    && <ExpensesView key={areaId} analytics={filteredAnalytics} />}
        {activeView === 'payroll'     && <PayrollAnalyticsView key={areaId} analytics={filteredAnalytics} />}
        {activeView === 'states'      && <StateAnalyticsView key={areaId} analytics={filteredAnalytics} />}
        {activeView === 'forecasting' && <ForecastingView key={areaId} analytics={filteredAnalytics} dashboard={dashboard} />}
        {activeView === 'projects'    && <ProjectTable key={areaId} projects={dashboard.projects || []} />}
        {activeView === 'calendar'    && <CalendarView key={areaId} projects={dashboard.projects || []} />}
        {activeView === 'reports'     && <ReportsView key={areaId} />}
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
