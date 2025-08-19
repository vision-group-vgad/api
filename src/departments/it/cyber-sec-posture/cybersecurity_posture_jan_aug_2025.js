const dummy_data = [
  {
    date: "2025-01-01",
    overallCyberSecurityScore: 86,
    vulnerabilitySummary: {
      critical: 1,
      high: 13,
      medium: 21,
      low: 28,
      unpatchedSystems: 6,
    },
    patchManagement: {
      patchCompliancePercent: 90.99,
      outdatedSystems: 0,
    },
    endpointProtection: {
      antivirusCoveragePercent: 93.59,
      edrCoveragePercent: 93.24,
      unencryptedDevices: 3,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 30,
      suspiciousConnections: 5,
    },
    identityAndAccess: {
      mfaEnabledPercent: 75.76,
      inactiveAccountsOlderThan90d: 10,
      adminAccounts: 17,
    },
    dataProtection: {
      backupSuccessRatePercent: 91.84,
      lastBackupDate: "2025-01-01T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 86.02,
      lastAuditDate: "2024-12-20",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 90,
        patchCompliancePercent: 93.39,
        lastSecurityScan: "2024-12-28T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 91,
        patchCompliancePercent: 91.86,
        lastSecurityScan: "2024-12-31T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 91,
        patchCompliancePercent: 86.29,
        lastSecurityScan: "2025-01-01T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-01-08",
    overallCyberSecurityScore: 81,
    vulnerabilitySummary: {
      critical: 5,
      high: 6,
      medium: 30,
      low: 29,
      unpatchedSystems: 4,
    },
    patchManagement: {
      patchCompliancePercent: 92.76,
      outdatedSystems: 1,
    },
    endpointProtection: {
      antivirusCoveragePercent: 97.82,
      edrCoveragePercent: 82.2,
      unencryptedDevices: 0,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 46,
      suspiciousConnections: 9,
    },
    identityAndAccess: {
      mfaEnabledPercent: 72.81,
      inactiveAccountsOlderThan90d: 4,
      adminAccounts: 19,
    },
    dataProtection: {
      backupSuccessRatePercent: 93.51,
      lastBackupDate: "2025-01-08T00:00:00Z",
      sensitiveDataExposures: 1,
    },
    compliance: {
      policyAdherencePercent: 81.38,
      lastAuditDate: "2024-12-26",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 87,
        patchCompliancePercent: 88.49,
        lastSecurityScan: "2025-01-01T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 100,
        patchCompliancePercent: 88.71,
        lastSecurityScan: "2025-01-06T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 87,
        patchCompliancePercent: 85.88,
        lastSecurityScan: "2025-01-02T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-01-15",
    overallCyberSecurityScore: 80,
    vulnerabilitySummary: {
      critical: 2,
      high: 6,
      medium: 15,
      low: 35,
      unpatchedSystems: 1,
    },
    patchManagement: {
      patchCompliancePercent: 94.28,
      outdatedSystems: 0,
    },
    endpointProtection: {
      antivirusCoveragePercent: 99.57,
      edrCoveragePercent: 90.74,
      unencryptedDevices: 5,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 41,
      suspiciousConnections: 7,
    },
    identityAndAccess: {
      mfaEnabledPercent: 83.05,
      inactiveAccountsOlderThan90d: 5,
      adminAccounts: 11,
    },
    dataProtection: {
      backupSuccessRatePercent: 97.9,
      lastBackupDate: "2025-01-15T00:00:00Z",
      sensitiveDataExposures: 1,
    },
    compliance: {
      policyAdherencePercent: 85.73,
      lastAuditDate: "2024-12-26",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 83,
        patchCompliancePercent: 93.17,
        lastSecurityScan: "2025-01-08T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 100,
        patchCompliancePercent: 96.6,
        lastSecurityScan: "2025-01-08T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 86,
        patchCompliancePercent: 94.82,
        lastSecurityScan: "2025-01-10T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-01-22",
    overallCyberSecurityScore: 94,
    vulnerabilitySummary: {
      critical: 4,
      high: 7,
      medium: 18,
      low: 49,
      unpatchedSystems: 3,
    },
    patchManagement: {
      patchCompliancePercent: 96.85,
      outdatedSystems: 4,
    },
    endpointProtection: {
      antivirusCoveragePercent: 97.83,
      edrCoveragePercent: 87.88,
      unencryptedDevices: 3,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 12,
      suspiciousConnections: 1,
    },
    identityAndAccess: {
      mfaEnabledPercent: 70.18,
      inactiveAccountsOlderThan90d: 2,
      adminAccounts: 16,
    },
    dataProtection: {
      backupSuccessRatePercent: 95.34,
      lastBackupDate: "2025-01-22T00:00:00Z",
      sensitiveDataExposures: 3,
    },
    compliance: {
      policyAdherencePercent: 93.25,
      lastAuditDate: "2025-01-09",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 96,
        patchCompliancePercent: 88.71,
        lastSecurityScan: "2025-01-19T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 91,
        patchCompliancePercent: 98.74,
        lastSecurityScan: "2025-01-20T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 91,
        patchCompliancePercent: 93.16,
        lastSecurityScan: "2025-01-16T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-01-29",
    overallCyberSecurityScore: 81,
    vulnerabilitySummary: {
      critical: 0,
      high: 14,
      medium: 18,
      low: 32,
      unpatchedSystems: 6,
    },
    patchManagement: {
      patchCompliancePercent: 95.25,
      outdatedSystems: 2,
    },
    endpointProtection: {
      antivirusCoveragePercent: 96.05,
      edrCoveragePercent: 91.4,
      unencryptedDevices: 3,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 27,
      suspiciousConnections: 8,
    },
    identityAndAccess: {
      mfaEnabledPercent: 82.72,
      inactiveAccountsOlderThan90d: 10,
      adminAccounts: 17,
    },
    dataProtection: {
      backupSuccessRatePercent: 94.54,
      lastBackupDate: "2025-01-29T00:00:00Z",
      sensitiveDataExposures: 4,
    },
    compliance: {
      policyAdherencePercent: 91.73,
      lastAuditDate: "2025-01-18",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 82,
        patchCompliancePercent: 85.57,
        lastSecurityScan: "2025-01-22T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 91,
        patchCompliancePercent: 99.47,
        lastSecurityScan: "2025-01-22T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 82,
        patchCompliancePercent: 94.39,
        lastSecurityScan: "2025-01-23T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-02-05",
    overallCyberSecurityScore: 80,
    vulnerabilitySummary: {
      critical: 2,
      high: 15,
      medium: 25,
      low: 24,
      unpatchedSystems: 1,
    },
    patchManagement: {
      patchCompliancePercent: 91.75,
      outdatedSystems: 5,
    },
    endpointProtection: {
      antivirusCoveragePercent: 97.32,
      edrCoveragePercent: 83.13,
      unencryptedDevices: 2,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 38,
      suspiciousConnections: 2,
    },
    identityAndAccess: {
      mfaEnabledPercent: 89.16,
      inactiveAccountsOlderThan90d: 5,
      adminAccounts: 14,
    },
    dataProtection: {
      backupSuccessRatePercent: 96.49,
      lastBackupDate: "2025-02-05T00:00:00Z",
      sensitiveDataExposures: 2,
    },
    compliance: {
      policyAdherencePercent: 84.11,
      lastAuditDate: "2025-01-26",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 81,
        patchCompliancePercent: 88.72,
        lastSecurityScan: "2025-02-05T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 97,
        patchCompliancePercent: 95.57,
        lastSecurityScan: "2025-01-31T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 95,
        patchCompliancePercent: 98.07,
        lastSecurityScan: "2025-02-03T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-02-12",
    overallCyberSecurityScore: 83,
    vulnerabilitySummary: {
      critical: 5,
      high: 10,
      medium: 22,
      low: 40,
      unpatchedSystems: 8,
    },
    patchManagement: {
      patchCompliancePercent: 92.65,
      outdatedSystems: 0,
    },
    endpointProtection: {
      antivirusCoveragePercent: 92.76,
      edrCoveragePercent: 91.14,
      unencryptedDevices: 4,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 13,
      suspiciousConnections: 0,
    },
    identityAndAccess: {
      mfaEnabledPercent: 71.88,
      inactiveAccountsOlderThan90d: 1,
      adminAccounts: 16,
    },
    dataProtection: {
      backupSuccessRatePercent: 91.07,
      lastBackupDate: "2025-02-12T00:00:00Z",
      sensitiveDataExposures: 1,
    },
    compliance: {
      policyAdherencePercent: 90.34,
      lastAuditDate: "2025-01-17",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 82,
        patchCompliancePercent: 98.55,
        lastSecurityScan: "2025-02-11T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 83,
        patchCompliancePercent: 93.54,
        lastSecurityScan: "2025-02-06T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 95,
        patchCompliancePercent: 98.79,
        lastSecurityScan: "2025-02-05T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-02-19",
    overallCyberSecurityScore: 86,
    vulnerabilitySummary: {
      critical: 3,
      high: 14,
      medium: 30,
      low: 36,
      unpatchedSystems: 10,
    },
    patchManagement: {
      patchCompliancePercent: 87.59,
      outdatedSystems: 1,
    },
    endpointProtection: {
      antivirusCoveragePercent: 97.38,
      edrCoveragePercent: 90.5,
      unencryptedDevices: 0,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 6,
      suspiciousConnections: 7,
    },
    identityAndAccess: {
      mfaEnabledPercent: 79.2,
      inactiveAccountsOlderThan90d: 1,
      adminAccounts: 14,
    },
    dataProtection: {
      backupSuccessRatePercent: 96.29,
      lastBackupDate: "2025-02-19T00:00:00Z",
      sensitiveDataExposures: 1,
    },
    compliance: {
      policyAdherencePercent: 88.58,
      lastAuditDate: "2025-02-03",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 98,
        patchCompliancePercent: 86.7,
        lastSecurityScan: "2025-02-19T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 92,
        patchCompliancePercent: 90.12,
        lastSecurityScan: "2025-02-18T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 91,
        patchCompliancePercent: 88.44,
        lastSecurityScan: "2025-02-15T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-02-26",
    overallCyberSecurityScore: 84,
    vulnerabilitySummary: {
      critical: 4,
      high: 5,
      medium: 27,
      low: 35,
      unpatchedSystems: 2,
    },
    patchManagement: {
      patchCompliancePercent: 91.33,
      outdatedSystems: 4,
    },
    endpointProtection: {
      antivirusCoveragePercent: 97.87,
      edrCoveragePercent: 84.29,
      unencryptedDevices: 3,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 20,
      suspiciousConnections: 2,
    },
    identityAndAccess: {
      mfaEnabledPercent: 78.24,
      inactiveAccountsOlderThan90d: 3,
      adminAccounts: 17,
    },
    dataProtection: {
      backupSuccessRatePercent: 94.97,
      lastBackupDate: "2025-02-26T00:00:00Z",
      sensitiveDataExposures: 1,
    },
    compliance: {
      policyAdherencePercent: 86.88,
      lastAuditDate: "2025-02-02",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 93,
        patchCompliancePercent: 87.94,
        lastSecurityScan: "2025-02-21T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 94,
        patchCompliancePercent: 96.11,
        lastSecurityScan: "2025-02-24T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 92,
        patchCompliancePercent: 90.2,
        lastSecurityScan: "2025-02-19T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-03-05",
    overallCyberSecurityScore: 95,
    vulnerabilitySummary: {
      critical: 0,
      high: 14,
      medium: 26,
      low: 44,
      unpatchedSystems: 0,
    },
    patchManagement: {
      patchCompliancePercent: 94.52,
      outdatedSystems: 0,
    },
    endpointProtection: {
      antivirusCoveragePercent: 91.57,
      edrCoveragePercent: 94.5,
      unencryptedDevices: 1,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 44,
      suspiciousConnections: 1,
    },
    identityAndAccess: {
      mfaEnabledPercent: 74.68,
      inactiveAccountsOlderThan90d: 5,
      adminAccounts: 17,
    },
    dataProtection: {
      backupSuccessRatePercent: 99.01,
      lastBackupDate: "2025-03-05T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 82.48,
      lastAuditDate: "2025-02-19",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 88,
        patchCompliancePercent: 94.86,
        lastSecurityScan: "2025-02-26T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 91,
        patchCompliancePercent: 87.12,
        lastSecurityScan: "2025-02-28T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 99,
        patchCompliancePercent: 98.15,
        lastSecurityScan: "2025-02-27T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-03-12",
    overallCyberSecurityScore: 83,
    vulnerabilitySummary: {
      critical: 4,
      high: 8,
      medium: 27,
      low: 22,
      unpatchedSystems: 2,
    },
    patchManagement: {
      patchCompliancePercent: 99.61,
      outdatedSystems: 1,
    },
    endpointProtection: {
      antivirusCoveragePercent: 91.96,
      edrCoveragePercent: 85.98,
      unencryptedDevices: 1,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 39,
      suspiciousConnections: 2,
    },
    identityAndAccess: {
      mfaEnabledPercent: 73.96,
      inactiveAccountsOlderThan90d: 1,
      adminAccounts: 16,
    },
    dataProtection: {
      backupSuccessRatePercent: 91.71,
      lastBackupDate: "2025-03-12T00:00:00Z",
      sensitiveDataExposures: 2,
    },
    compliance: {
      policyAdherencePercent: 89.18,
      lastAuditDate: "2025-03-02",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 88,
        patchCompliancePercent: 90.99,
        lastSecurityScan: "2025-03-12T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 98,
        patchCompliancePercent: 92.29,
        lastSecurityScan: "2025-03-12T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 94,
        patchCompliancePercent: 86.59,
        lastSecurityScan: "2025-03-08T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-03-19",
    overallCyberSecurityScore: 87,
    vulnerabilitySummary: {
      critical: 4,
      high: 5,
      medium: 29,
      low: 31,
      unpatchedSystems: 7,
    },
    patchManagement: {
      patchCompliancePercent: 91.28,
      outdatedSystems: 4,
    },
    endpointProtection: {
      antivirusCoveragePercent: 96.38,
      edrCoveragePercent: 92.79,
      unencryptedDevices: 5,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 45,
      suspiciousConnections: 7,
    },
    identityAndAccess: {
      mfaEnabledPercent: 70.62,
      inactiveAccountsOlderThan90d: 5,
      adminAccounts: 12,
    },
    dataProtection: {
      backupSuccessRatePercent: 90.9,
      lastBackupDate: "2025-03-19T00:00:00Z",
      sensitiveDataExposures: 1,
    },
    compliance: {
      policyAdherencePercent: 86.32,
      lastAuditDate: "2025-03-04",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 95,
        patchCompliancePercent: 89.78,
        lastSecurityScan: "2025-03-13T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 84,
        patchCompliancePercent: 94.3,
        lastSecurityScan: "2025-03-19T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 90,
        patchCompliancePercent: 89.34,
        lastSecurityScan: "2025-03-19T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-03-26",
    overallCyberSecurityScore: 89,
    vulnerabilitySummary: {
      critical: 0,
      high: 12,
      medium: 23,
      low: 22,
      unpatchedSystems: 6,
    },
    patchManagement: {
      patchCompliancePercent: 92.84,
      outdatedSystems: 2,
    },
    endpointProtection: {
      antivirusCoveragePercent: 93.09,
      edrCoveragePercent: 81.34,
      unencryptedDevices: 0,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 45,
      suspiciousConnections: 4,
    },
    identityAndAccess: {
      mfaEnabledPercent: 79.72,
      inactiveAccountsOlderThan90d: 9,
      adminAccounts: 18,
    },
    dataProtection: {
      backupSuccessRatePercent: 91.72,
      lastBackupDate: "2025-03-26T00:00:00Z",
      sensitiveDataExposures: 3,
    },
    compliance: {
      policyAdherencePercent: 82.09,
      lastAuditDate: "2025-02-28",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 99,
        patchCompliancePercent: 92.65,
        lastSecurityScan: "2025-03-26T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 80,
        patchCompliancePercent: 94.24,
        lastSecurityScan: "2025-03-21T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 89,
        patchCompliancePercent: 98.54,
        lastSecurityScan: "2025-03-22T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-04-02",
    overallCyberSecurityScore: 95,
    vulnerabilitySummary: {
      critical: 3,
      high: 12,
      medium: 25,
      low: 50,
      unpatchedSystems: 2,
    },
    patchManagement: {
      patchCompliancePercent: 91.51,
      outdatedSystems: 4,
    },
    endpointProtection: {
      antivirusCoveragePercent: 91.86,
      edrCoveragePercent: 93.62,
      unencryptedDevices: 0,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 6,
      suspiciousConnections: 3,
    },
    identityAndAccess: {
      mfaEnabledPercent: 80.46,
      inactiveAccountsOlderThan90d: 1,
      adminAccounts: 11,
    },
    dataProtection: {
      backupSuccessRatePercent: 95.8,
      lastBackupDate: "2025-04-02T00:00:00Z",
      sensitiveDataExposures: 0,
    },
    compliance: {
      policyAdherencePercent: 81.27,
      lastAuditDate: "2025-03-06",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 82,
        patchCompliancePercent: 94.5,
        lastSecurityScan: "2025-03-30T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 80,
        patchCompliancePercent: 94.12,
        lastSecurityScan: "2025-03-28T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 92,
        patchCompliancePercent: 95.44,
        lastSecurityScan: "2025-04-02T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-04-09",
    overallCyberSecurityScore: 81,
    vulnerabilitySummary: {
      critical: 2,
      high: 10,
      medium: 26,
      low: 38,
      unpatchedSystems: 3,
    },
    patchManagement: {
      patchCompliancePercent: 94.4,
      outdatedSystems: 0,
    },
    endpointProtection: {
      antivirusCoveragePercent: 97.8,
      edrCoveragePercent: 92.97,
      unencryptedDevices: 2,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 14,
      suspiciousConnections: 6,
    },
    identityAndAccess: {
      mfaEnabledPercent: 86.77,
      inactiveAccountsOlderThan90d: 6,
      adminAccounts: 16,
    },
    dataProtection: {
      backupSuccessRatePercent: 95.34,
      lastBackupDate: "2025-04-09T00:00:00Z",
      sensitiveDataExposures: 3,
    },
    compliance: {
      policyAdherencePercent: 83.94,
      lastAuditDate: "2025-03-28",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 89,
        patchCompliancePercent: 88.0,
        lastSecurityScan: "2025-04-05T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 97,
        patchCompliancePercent: 98.17,
        lastSecurityScan: "2025-04-03T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 96,
        patchCompliancePercent: 92.12,
        lastSecurityScan: "2025-04-03T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-04-16",
    overallCyberSecurityScore: 94,
    vulnerabilitySummary: {
      critical: 0,
      high: 11,
      medium: 19,
      low: 31,
      unpatchedSystems: 7,
    },
    patchManagement: {
      patchCompliancePercent: 86.88,
      outdatedSystems: 5,
    },
    endpointProtection: {
      antivirusCoveragePercent: 94.22,
      edrCoveragePercent: 92.8,
      unencryptedDevices: 2,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 39,
      suspiciousConnections: 9,
    },
    identityAndAccess: {
      mfaEnabledPercent: 70.34,
      inactiveAccountsOlderThan90d: 1,
      adminAccounts: 15,
    },
    dataProtection: {
      backupSuccessRatePercent: 92.26,
      lastBackupDate: "2025-04-16T00:00:00Z",
      sensitiveDataExposures: 4,
    },
    compliance: {
      policyAdherencePercent: 86.77,
      lastAuditDate: "2025-03-18",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 89,
        patchCompliancePercent: 88.51,
        lastSecurityScan: "2025-04-09T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 98,
        patchCompliancePercent: 98.42,
        lastSecurityScan: "2025-04-13T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 88,
        patchCompliancePercent: 96.25,
        lastSecurityScan: "2025-04-11T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-04-23",
    overallCyberSecurityScore: 92,
    vulnerabilitySummary: {
      critical: 3,
      high: 9,
      medium: 15,
      low: 46,
      unpatchedSystems: 3,
    },
    patchManagement: {
      patchCompliancePercent: 94.27,
      outdatedSystems: 1,
    },
    endpointProtection: {
      antivirusCoveragePercent: 98.81,
      edrCoveragePercent: 91.4,
      unencryptedDevices: 0,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 28,
      suspiciousConnections: 9,
    },
    identityAndAccess: {
      mfaEnabledPercent: 79.68,
      inactiveAccountsOlderThan90d: 2,
      adminAccounts: 19,
    },
    dataProtection: {
      backupSuccessRatePercent: 95.84,
      lastBackupDate: "2025-04-23T00:00:00Z",
      sensitiveDataExposures: 1,
    },
    compliance: {
      policyAdherencePercent: 86.17,
      lastAuditDate: "2025-03-30",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 100,
        patchCompliancePercent: 99.07,
        lastSecurityScan: "2025-04-22T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 91,
        patchCompliancePercent: 97.33,
        lastSecurityScan: "2025-04-22T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 80,
        patchCompliancePercent: 90.17,
        lastSecurityScan: "2025-04-22T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-04-30",
    overallCyberSecurityScore: 81,
    vulnerabilitySummary: {
      critical: 1,
      high: 14,
      medium: 20,
      low: 38,
      unpatchedSystems: 0,
    },
    patchManagement: {
      patchCompliancePercent: 85.54,
      outdatedSystems: 2,
    },
    endpointProtection: {
      antivirusCoveragePercent: 96.52,
      edrCoveragePercent: 88.04,
      unencryptedDevices: 0,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 17,
      suspiciousConnections: 8,
    },
    identityAndAccess: {
      mfaEnabledPercent: 83.16,
      inactiveAccountsOlderThan90d: 1,
      adminAccounts: 14,
    },
    dataProtection: {
      backupSuccessRatePercent: 90.48,
      lastBackupDate: "2025-04-30T00:00:00Z",
      sensitiveDataExposures: 3,
    },
    compliance: {
      policyAdherencePercent: 90.2,
      lastAuditDate: "2025-04-15",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 100,
        patchCompliancePercent: 98.55,
        lastSecurityScan: "2025-04-26T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 99,
        patchCompliancePercent: 91.79,
        lastSecurityScan: "2025-04-24T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 87,
        patchCompliancePercent: 97.94,
        lastSecurityScan: "2025-04-26T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-05-07",
    overallCyberSecurityScore: 87,
    vulnerabilitySummary: {
      critical: 1,
      high: 8,
      medium: 30,
      low: 34,
      unpatchedSystems: 7,
    },
    patchManagement: {
      patchCompliancePercent: 88.78,
      outdatedSystems: 1,
    },
    endpointProtection: {
      antivirusCoveragePercent: 95.75,
      edrCoveragePercent: 82.34,
      unencryptedDevices: 4,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 50,
      suspiciousConnections: 9,
    },
    identityAndAccess: {
      mfaEnabledPercent: 70.76,
      inactiveAccountsOlderThan90d: 1,
      adminAccounts: 15,
    },
    dataProtection: {
      backupSuccessRatePercent: 92.72,
      lastBackupDate: "2025-05-07T00:00:00Z",
      sensitiveDataExposures: 4,
    },
    compliance: {
      policyAdherencePercent: 83.95,
      lastAuditDate: "2025-04-12",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 82,
        patchCompliancePercent: 91.93,
        lastSecurityScan: "2025-04-30T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 94,
        patchCompliancePercent: 86.82,
        lastSecurityScan: "2025-05-02T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 98,
        patchCompliancePercent: 95.42,
        lastSecurityScan: "2025-05-05T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-05-14",
    overallCyberSecurityScore: 94,
    vulnerabilitySummary: {
      critical: 3,
      high: 14,
      medium: 27,
      low: 40,
      unpatchedSystems: 6,
    },
    patchManagement: {
      patchCompliancePercent: 87.96,
      outdatedSystems: 1,
    },
    endpointProtection: {
      antivirusCoveragePercent: 92.64,
      edrCoveragePercent: 89.23,
      unencryptedDevices: 3,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 39,
      suspiciousConnections: 8,
    },
    identityAndAccess: {
      mfaEnabledPercent: 78.16,
      inactiveAccountsOlderThan90d: 6,
      adminAccounts: 11,
    },
    dataProtection: {
      backupSuccessRatePercent: 92.09,
      lastBackupDate: "2025-05-14T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 89.39,
      lastAuditDate: "2025-05-04",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 94,
        patchCompliancePercent: 91.71,
        lastSecurityScan: "2025-05-10T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 84,
        patchCompliancePercent: 90.14,
        lastSecurityScan: "2025-05-13T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 81,
        patchCompliancePercent: 89.73,
        lastSecurityScan: "2025-05-14T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-05-21",
    overallCyberSecurityScore: 82,
    vulnerabilitySummary: {
      critical: 4,
      high: 9,
      medium: 28,
      low: 21,
      unpatchedSystems: 9,
    },
    patchManagement: {
      patchCompliancePercent: 99.45,
      outdatedSystems: 4,
    },
    endpointProtection: {
      antivirusCoveragePercent: 96.57,
      edrCoveragePercent: 91.24,
      unencryptedDevices: 5,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 37,
      suspiciousConnections: 0,
    },
    identityAndAccess: {
      mfaEnabledPercent: 85.82,
      inactiveAccountsOlderThan90d: 4,
      adminAccounts: 19,
    },
    dataProtection: {
      backupSuccessRatePercent: 96.04,
      lastBackupDate: "2025-05-21T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 86.54,
      lastAuditDate: "2025-04-25",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 97,
        patchCompliancePercent: 91.45,
        lastSecurityScan: "2025-05-20T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 93,
        patchCompliancePercent: 96.6,
        lastSecurityScan: "2025-05-15T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 91,
        patchCompliancePercent: 89.37,
        lastSecurityScan: "2025-05-15T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-05-28",
    overallCyberSecurityScore: 85,
    vulnerabilitySummary: {
      critical: 4,
      high: 12,
      medium: 27,
      low: 42,
      unpatchedSystems: 10,
    },
    patchManagement: {
      patchCompliancePercent: 95.07,
      outdatedSystems: 3,
    },
    endpointProtection: {
      antivirusCoveragePercent: 99.19,
      edrCoveragePercent: 89.39,
      unencryptedDevices: 5,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 12,
      suspiciousConnections: 9,
    },
    identityAndAccess: {
      mfaEnabledPercent: 89.92,
      inactiveAccountsOlderThan90d: 3,
      adminAccounts: 20,
    },
    dataProtection: {
      backupSuccessRatePercent: 95.76,
      lastBackupDate: "2025-05-28T00:00:00Z",
      sensitiveDataExposures: 1,
    },
    compliance: {
      policyAdherencePercent: 85.12,
      lastAuditDate: "2025-04-30",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 99,
        patchCompliancePercent: 91.94,
        lastSecurityScan: "2025-05-28T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 81,
        patchCompliancePercent: 96.02,
        lastSecurityScan: "2025-05-27T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 98,
        patchCompliancePercent: 89.58,
        lastSecurityScan: "2025-05-23T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-06-04",
    overallCyberSecurityScore: 88,
    vulnerabilitySummary: {
      critical: 5,
      high: 5,
      medium: 19,
      low: 26,
      unpatchedSystems: 6,
    },
    patchManagement: {
      patchCompliancePercent: 91.2,
      outdatedSystems: 2,
    },
    endpointProtection: {
      antivirusCoveragePercent: 97.19,
      edrCoveragePercent: 87.11,
      unencryptedDevices: 5,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 44,
      suspiciousConnections: 1,
    },
    identityAndAccess: {
      mfaEnabledPercent: 81.39,
      inactiveAccountsOlderThan90d: 10,
      adminAccounts: 17,
    },
    dataProtection: {
      backupSuccessRatePercent: 99.96,
      lastBackupDate: "2025-06-04T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 85.17,
      lastAuditDate: "2025-05-23",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 100,
        patchCompliancePercent: 94.2,
        lastSecurityScan: "2025-06-01T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 96,
        patchCompliancePercent: 99.12,
        lastSecurityScan: "2025-05-30T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 96,
        patchCompliancePercent: 87.39,
        lastSecurityScan: "2025-05-30T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-06-11",
    overallCyberSecurityScore: 82,
    vulnerabilitySummary: {
      critical: 3,
      high: 12,
      medium: 29,
      low: 42,
      unpatchedSystems: 3,
    },
    patchManagement: {
      patchCompliancePercent: 91.9,
      outdatedSystems: 5,
    },
    endpointProtection: {
      antivirusCoveragePercent: 91.15,
      edrCoveragePercent: 86.48,
      unencryptedDevices: 3,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 2,
      suspiciousConnections: 1,
    },
    identityAndAccess: {
      mfaEnabledPercent: 75.13,
      inactiveAccountsOlderThan90d: 0,
      adminAccounts: 14,
    },
    dataProtection: {
      backupSuccessRatePercent: 91.98,
      lastBackupDate: "2025-06-11T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 89.86,
      lastAuditDate: "2025-05-30",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 84,
        patchCompliancePercent: 97.68,
        lastSecurityScan: "2025-06-06T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 90,
        patchCompliancePercent: 89.44,
        lastSecurityScan: "2025-06-05T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 89,
        patchCompliancePercent: 89.84,
        lastSecurityScan: "2025-06-09T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-06-18",
    overallCyberSecurityScore: 89,
    vulnerabilitySummary: {
      critical: 4,
      high: 12,
      medium: 27,
      low: 38,
      unpatchedSystems: 4,
    },
    patchManagement: {
      patchCompliancePercent: 85.06,
      outdatedSystems: 4,
    },
    endpointProtection: {
      antivirusCoveragePercent: 93.92,
      edrCoveragePercent: 85.64,
      unencryptedDevices: 0,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 4,
      suspiciousConnections: 8,
    },
    identityAndAccess: {
      mfaEnabledPercent: 88.35,
      inactiveAccountsOlderThan90d: 0,
      adminAccounts: 16,
    },
    dataProtection: {
      backupSuccessRatePercent: 98.39,
      lastBackupDate: "2025-06-18T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 88.0,
      lastAuditDate: "2025-06-08",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 95,
        patchCompliancePercent: 98.76,
        lastSecurityScan: "2025-06-15T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 85,
        patchCompliancePercent: 97.76,
        lastSecurityScan: "2025-06-12T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 92,
        patchCompliancePercent: 89.54,
        lastSecurityScan: "2025-06-14T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-06-25",
    overallCyberSecurityScore: 92,
    vulnerabilitySummary: {
      critical: 2,
      high: 15,
      medium: 29,
      low: 22,
      unpatchedSystems: 0,
    },
    patchManagement: {
      patchCompliancePercent: 92.98,
      outdatedSystems: 5,
    },
    endpointProtection: {
      antivirusCoveragePercent: 98.74,
      edrCoveragePercent: 86.82,
      unencryptedDevices: 4,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 40,
      suspiciousConnections: 3,
    },
    identityAndAccess: {
      mfaEnabledPercent: 70.5,
      inactiveAccountsOlderThan90d: 2,
      adminAccounts: 12,
    },
    dataProtection: {
      backupSuccessRatePercent: 91.56,
      lastBackupDate: "2025-06-25T00:00:00Z",
      sensitiveDataExposures: 4,
    },
    compliance: {
      policyAdherencePercent: 88.6,
      lastAuditDate: "2025-05-29",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 99,
        patchCompliancePercent: 89.01,
        lastSecurityScan: "2025-06-19T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 98,
        patchCompliancePercent: 93.15,
        lastSecurityScan: "2025-06-21T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 96,
        patchCompliancePercent: 98.54,
        lastSecurityScan: "2025-06-18T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-07-02",
    overallCyberSecurityScore: 91,
    vulnerabilitySummary: {
      critical: 0,
      high: 6,
      medium: 16,
      low: 34,
      unpatchedSystems: 0,
    },
    patchManagement: {
      patchCompliancePercent: 97.34,
      outdatedSystems: 0,
    },
    endpointProtection: {
      antivirusCoveragePercent: 91.13,
      edrCoveragePercent: 81.08,
      unencryptedDevices: 4,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 44,
      suspiciousConnections: 7,
    },
    identityAndAccess: {
      mfaEnabledPercent: 79.72,
      inactiveAccountsOlderThan90d: 1,
      adminAccounts: 11,
    },
    dataProtection: {
      backupSuccessRatePercent: 91.93,
      lastBackupDate: "2025-07-02T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 83.66,
      lastAuditDate: "2025-06-08",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 91,
        patchCompliancePercent: 85.65,
        lastSecurityScan: "2025-06-29T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 88,
        patchCompliancePercent: 94.95,
        lastSecurityScan: "2025-06-30T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 92,
        patchCompliancePercent: 93.21,
        lastSecurityScan: "2025-06-25T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-07-09",
    overallCyberSecurityScore: 81,
    vulnerabilitySummary: {
      critical: 4,
      high: 15,
      medium: 28,
      low: 26,
      unpatchedSystems: 2,
    },
    patchManagement: {
      patchCompliancePercent: 90.58,
      outdatedSystems: 3,
    },
    endpointProtection: {
      antivirusCoveragePercent: 96.57,
      edrCoveragePercent: 87.08,
      unencryptedDevices: 2,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 6,
      suspiciousConnections: 5,
    },
    identityAndAccess: {
      mfaEnabledPercent: 72.6,
      inactiveAccountsOlderThan90d: 10,
      adminAccounts: 14,
    },
    dataProtection: {
      backupSuccessRatePercent: 92.99,
      lastBackupDate: "2025-07-09T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 90.51,
      lastAuditDate: "2025-06-27",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 80,
        patchCompliancePercent: 91.61,
        lastSecurityScan: "2025-07-02T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 93,
        patchCompliancePercent: 95.55,
        lastSecurityScan: "2025-07-06T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 95,
        patchCompliancePercent: 85.36,
        lastSecurityScan: "2025-07-02T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-07-16",
    overallCyberSecurityScore: 91,
    vulnerabilitySummary: {
      critical: 5,
      high: 5,
      medium: 28,
      low: 37,
      unpatchedSystems: 9,
    },
    patchManagement: {
      patchCompliancePercent: 99.0,
      outdatedSystems: 0,
    },
    endpointProtection: {
      antivirusCoveragePercent: 99.11,
      edrCoveragePercent: 80.72,
      unencryptedDevices: 1,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 8,
      suspiciousConnections: 8,
    },
    identityAndAccess: {
      mfaEnabledPercent: 77.23,
      inactiveAccountsOlderThan90d: 3,
      adminAccounts: 12,
    },
    dataProtection: {
      backupSuccessRatePercent: 95.39,
      lastBackupDate: "2025-07-16T00:00:00Z",
      sensitiveDataExposures: 1,
    },
    compliance: {
      policyAdherencePercent: 88.39,
      lastAuditDate: "2025-06-18",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 95,
        patchCompliancePercent: 86.43,
        lastSecurityScan: "2025-07-13T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 88,
        patchCompliancePercent: 94.31,
        lastSecurityScan: "2025-07-15T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 89,
        patchCompliancePercent: 88.2,
        lastSecurityScan: "2025-07-11T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-07-23",
    overallCyberSecurityScore: 84,
    vulnerabilitySummary: {
      critical: 5,
      high: 14,
      medium: 29,
      low: 25,
      unpatchedSystems: 4,
    },
    patchManagement: {
      patchCompliancePercent: 90.63,
      outdatedSystems: 5,
    },
    endpointProtection: {
      antivirusCoveragePercent: 95.01,
      edrCoveragePercent: 92.57,
      unencryptedDevices: 0,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 14,
      suspiciousConnections: 1,
    },
    identityAndAccess: {
      mfaEnabledPercent: 70.31,
      inactiveAccountsOlderThan90d: 6,
      adminAccounts: 16,
    },
    dataProtection: {
      backupSuccessRatePercent: 97.41,
      lastBackupDate: "2025-07-23T00:00:00Z",
      sensitiveDataExposures: 4,
    },
    compliance: {
      policyAdherencePercent: 81.47,
      lastAuditDate: "2025-06-29",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 99,
        patchCompliancePercent: 88.61,
        lastSecurityScan: "2025-07-21T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 91,
        patchCompliancePercent: 97.11,
        lastSecurityScan: "2025-07-19T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 99,
        patchCompliancePercent: 96.59,
        lastSecurityScan: "2025-07-18T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-07-30",
    overallCyberSecurityScore: 95,
    vulnerabilitySummary: {
      critical: 1,
      high: 7,
      medium: 26,
      low: 35,
      unpatchedSystems: 8,
    },
    patchManagement: {
      patchCompliancePercent: 89.89,
      outdatedSystems: 0,
    },
    endpointProtection: {
      antivirusCoveragePercent: 96.75,
      edrCoveragePercent: 82.72,
      unencryptedDevices: 1,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 3,
      suspiciousConnections: 1,
    },
    identityAndAccess: {
      mfaEnabledPercent: 70.22,
      inactiveAccountsOlderThan90d: 5,
      adminAccounts: 11,
    },
    dataProtection: {
      backupSuccessRatePercent: 93.6,
      lastBackupDate: "2025-07-30T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 93.42,
      lastAuditDate: "2025-07-06",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 89,
        patchCompliancePercent: 88.7,
        lastSecurityScan: "2025-07-23T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 95,
        patchCompliancePercent: 86.3,
        lastSecurityScan: "2025-07-25T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 90,
        patchCompliancePercent: 99.79,
        lastSecurityScan: "2025-07-23T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-08-06",
    overallCyberSecurityScore: 86,
    vulnerabilitySummary: {
      critical: 2,
      high: 10,
      medium: 23,
      low: 47,
      unpatchedSystems: 10,
    },
    patchManagement: {
      patchCompliancePercent: 92.51,
      outdatedSystems: 5,
    },
    endpointProtection: {
      antivirusCoveragePercent: 97.47,
      edrCoveragePercent: 92.66,
      unencryptedDevices: 3,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 40,
      suspiciousConnections: 7,
    },
    identityAndAccess: {
      mfaEnabledPercent: 78.32,
      inactiveAccountsOlderThan90d: 7,
      adminAccounts: 17,
    },
    dataProtection: {
      backupSuccessRatePercent: 95.18,
      lastBackupDate: "2025-08-06T00:00:00Z",
      sensitiveDataExposures: 0,
    },
    compliance: {
      policyAdherencePercent: 87.03,
      lastAuditDate: "2025-07-21",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 82,
        patchCompliancePercent: 98.74,
        lastSecurityScan: "2025-07-31T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 96,
        patchCompliancePercent: 85.86,
        lastSecurityScan: "2025-08-04T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 94,
        patchCompliancePercent: 93.35,
        lastSecurityScan: "2025-08-01T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-08-13",
    overallCyberSecurityScore: 84,
    vulnerabilitySummary: {
      critical: 0,
      high: 6,
      medium: 18,
      low: 29,
      unpatchedSystems: 6,
    },
    patchManagement: {
      patchCompliancePercent: 87.47,
      outdatedSystems: 0,
    },
    endpointProtection: {
      antivirusCoveragePercent: 92.74,
      edrCoveragePercent: 91.97,
      unencryptedDevices: 0,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 33,
      suspiciousConnections: 1,
    },
    identityAndAccess: {
      mfaEnabledPercent: 89.28,
      inactiveAccountsOlderThan90d: 7,
      adminAccounts: 17,
    },
    dataProtection: {
      backupSuccessRatePercent: 95.17,
      lastBackupDate: "2025-08-13T00:00:00Z",
      sensitiveDataExposures: 0,
    },
    compliance: {
      policyAdherencePercent: 90.16,
      lastAuditDate: "2025-08-01",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 86,
        patchCompliancePercent: 94.33,
        lastSecurityScan: "2025-08-12T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 94,
        patchCompliancePercent: 92.26,
        lastSecurityScan: "2025-08-06T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 81,
        patchCompliancePercent: 86.19,
        lastSecurityScan: "2025-08-10T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-08-20",
    overallCyberSecurityScore: 95,
    vulnerabilitySummary: {
      critical: 4,
      high: 11,
      medium: 25,
      low: 42,
      unpatchedSystems: 3,
    },
    patchManagement: {
      patchCompliancePercent: 90.84,
      outdatedSystems: 4,
    },
    endpointProtection: {
      antivirusCoveragePercent: 92.96,
      edrCoveragePercent: 93.85,
      unencryptedDevices: 0,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 11,
      suspiciousConnections: 3,
    },
    identityAndAccess: {
      mfaEnabledPercent: 76.79,
      inactiveAccountsOlderThan90d: 7,
      adminAccounts: 18,
    },
    dataProtection: {
      backupSuccessRatePercent: 99.89,
      lastBackupDate: "2025-08-20T00:00:00Z",
      sensitiveDataExposures: 5,
    },
    compliance: {
      policyAdherencePercent: 86.93,
      lastAuditDate: "2025-08-05",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 89,
        patchCompliancePercent: 87.76,
        lastSecurityScan: "2025-08-20T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 98,
        patchCompliancePercent: 98.99,
        lastSecurityScan: "2025-08-16T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 86,
        patchCompliancePercent: 98.74,
        lastSecurityScan: "2025-08-13T00:00:00Z",
      },
    ],
  },
  {
    date: "2025-08-27",
    overallCyberSecurityScore: 80,
    vulnerabilitySummary: {
      critical: 2,
      high: 10,
      medium: 30,
      low: 49,
      unpatchedSystems: 6,
    },
    patchManagement: {
      patchCompliancePercent: 85.06,
      outdatedSystems: 1,
    },
    endpointProtection: {
      antivirusCoveragePercent: 92.21,
      edrCoveragePercent: 81.78,
      unencryptedDevices: 2,
    },
    networkSecurity: {
      firewallStatus: "Active",
      idsAlertsLast7Days: 0,
      suspiciousConnections: 6,
    },
    identityAndAccess: {
      mfaEnabledPercent: 87.53,
      inactiveAccountsOlderThan90d: 2,
      adminAccounts: 14,
    },
    dataProtection: {
      backupSuccessRatePercent: 94.78,
      lastBackupDate: "2025-08-27T00:00:00Z",
      sensitiveDataExposures: 1,
    },
    compliance: {
      policyAdherencePercent: 87.72,
      lastAuditDate: "2025-08-05",
    },
    systems: [
      {
        name: "Google Analytics",
        vulnerabilityScore: 87,
        patchCompliancePercent: 92.54,
        lastSecurityScan: "2025-08-27T00:00:00Z",
      },
      {
        name: "SharePoint",
        vulnerabilityScore: 87,
        patchCompliancePercent: 96.85,
        lastSecurityScan: "2025-08-24T00:00:00Z",
      },
      {
        name: "Business Central",
        vulnerabilityScore: 95,
        patchCompliancePercent: 90.54,
        lastSecurityScan: "2025-08-22T00:00:00Z",
      },
    ],
  },
];

export default dummy_data;
