const risks = [
  {
    date: "2025-01-01",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-01-08",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-01-15",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-01-22",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-01-29",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-02-05",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-02-12",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-02-19",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-02-26",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-03-05",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-03-12",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-03-19",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-03-26",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-04-02",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-04-09",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-04-16",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-04-23",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-04-30",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-05-07",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-05-14",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-05-21",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-05-28",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-06-04",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-06-11",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-06-18",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-06-25",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-07-02",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-07-09",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-07-16",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-07-23",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-07-30",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-08-06",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-08-13",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-08-20",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
  {
    date: "2025-08-27",
    risk_exposure: [
      {
        category: "Financial",
        metrics: {
          cash_flow_variance_percent: 12,
          debt_ratio_percent: 45,
          overdue_invoices_percent: 8,
          budget_deviation_percent: 5,
          liquidity_ratio: 1.8,
        },
        risk_level: "Moderate",
        trend: "Stable",
        suggested_action:
          "Monitor cash flow closely and reduce overdue invoices.",
      },
      {
        category: "Operational",
        metrics: {
          equipment_downtime_hours: 25,
          missed_production_targets_percent: 6,
          supply_chain_disruptions: 2,
          inventory_shortage_percent: 4,
          process_failure_incidents: 1,
        },
        risk_level: "Low",
        trend: "Improving",
        suggested_action: "Ensure preventive maintenance schedule is followed.",
      },
      {
        category: "Market",
        metrics: {
          market_share_loss_percent: 4,
          competitor_growth_percent: 10,
          customer_churn_percent: 7,
          new_product_success_rate_percent: 80,
        },
        risk_level: "Moderate",
        trend: "Slightly Increasing",
        suggested_action:
          "Focus on retention campaigns and competitive analysis.",
      },
      {
        category: "Cyber / IT",
        metrics: {
          system_downtime_hours: 12,
          security_incidents: 3,
          incident_resolution_time_hours: 6,
          phishing_attempts_detected: 5,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Continue monitoring security alerts and patch systems regularly.",
      },
      {
        category: "Compliance",
        metrics: {
          open_legal_cases: 1,
          policy_non_compliance_issues: 2,
          pending_regulatory_reports: 1,
        },
        risk_level: "Low",
        trend: "Stable",
        suggested_action:
          "Complete pending reports and ensure all policies are followed.",
      },
    ],
  },
];

export default risks;
