# Roles & Users Reference

> **Internal use only — do not expose this file publicly.**

---

## Roles

### Access Key
| Symbol | Meaning |
|--------|---------|
| `*` | Full access to all endpoints |
| `/api/v1/x/*` | All sub-paths under that prefix |
| `/api/v1/x/y` | Exact endpoint only |

---

### System

| Role | Access |
|------|--------|
| `super_admin` | `*` — full access to everything |
| `ceo` | `*` — full access to everything |

---

### IT Department

| Role | Accessible Endpoints |
|------|----------------------|
| `head_of_it` | `/api/v1/server-load/*` `/api/v1/storageUtilization` `/api/v1/cyber-posture` `/api/v1/patch-compliance` `/api/v1/system-health` `/api/v1/IT/*` `/api/v1/it/*` `/api/v1/infrastructure/*` `/api/v1/specialized/data-govern` `/api/v1/specialized/insight-adoption` `/api/v1/executive/company-wide-kpis` |
| `it_staff` | `/api/v1/server-load/*` `/api/v1/storageUtilization` `/api/v1/system-health` `/api/v1/it/cpu-usage` `/api/v1/it/satisfaction` `/api/v1/it/assets-inventory` `/api/v1/it/sys-health-score/in-range` |

---

### Sales Department

| Role | Accessible Endpoints |
|------|----------------------|
| `head_of_sales` | `/api/v1/sales/*` `/api/v1/marketing/*` `/api/v1/executive/revenue-performance` `/api/v1/executive/market-share` `/api/v1/executive/roi-analysis` `/api/v1/executive/company-wide-kpis` `/api/v1/specialized/sponsor-roi` |
| `sales_staff` | `/api/v1/sales/revenue-attribution/*` `/api/v1/sales/client-lifetime-value/*` `/api/v1/sales/campaign-roi` `/api/v1/sales/impression-shares` `/api/v1/sales/ctr/*` `/api/v1/sales/rate-card-utilization` `/api/v1/sales/conversion-funnels/*` `/api/v1/sales/territory-performance/*` `/api/v1/sales/lead-efficiency` `/api/v1/sales/brand-lift` `/api/v1/sales/contract-value-trends` |

---

### Operations Department

| Role | Accessible Endpoints |
|------|----------------------|
| `head_of_operations` | `/api/v1/operations/*` `/api/v1/executive/company-wide-kpis` |
| `operations_staff` | `/api/v1/operations/delivery-timelines` `/api/v1/operations/fuel-consumption/*` `/api/v1/operations/job-scheduling` `/api/v1/operations/parts-utilization` `/api/v1/operations/route-efficiency` `/api/v1/operations/signal-quality-metrics/*` `/api/v1/operations/ticket-resolution` `/api/v1/operations/up-downtime-logs/*` |

---

### Finance Department

| Role | Accessible Endpoints |
|------|----------------------|
| `head_of_finance` | `/api/v1/finance/*` `/api/v1/reporting-accu-piechart/*` `/api/v1/ap-ar-aging` `/api/v1/total-assets-value` `/api/v1/asset-depreciation` `/api/v1/expense-category` `/api/v1/budget-variance` `/api/v1/finance-forecasting/*` `/api/v1/gl-reconciliation/*` `/api/v1/tax-provisioning` `/api/v1/fin-statement-variance` `/api/v1/dso` `/api/v1/bad-debt-ratios/*` `/api/v1/collection-efficiency/*` `/api/v1/integration-health` `/api/v1/capEx/*` `/api/v1/executive/liquidity-ratios` `/api/v1/executive/financial-health` `/api/v1/executive/cost-optimization` `/api/v1/executive/company-wide-kpis` `/api/v1/specialized/risk-exposure` `/api/v1/specialized/mitigation-effectiveness` `/api/v1/executives/risk-heatmap` `/api/v1/executives/control-effectiveness` `/api/v1/executives/compliance/*` |
| `finance_staff` | `/api/v1/finance/close-metrics` `/api/v1/finance/chart-data` `/api/v1/finance/audit-trail` `/api/v1/finance/reporting-accuracy` `/api/v1/finance/gl-accounts` `/api/v1/expense-category` `/api/v1/budget-variance` `/api/v1/dso` `/api/v1/bad-debt-ratios/*` `/api/v1/collection-efficiency/*` `/api/v1/finance/pipeline-metrics` `/api/v1/finance/invoice-metrics/*` |

---

### Editorial Department

| Role | Accessible Endpoints |
|------|----------------------|
| `head_of_editorial` | `/api/v1/editorial/*` `/api/v1/executive/company-wide-kpis` |
| `editorial_staff` | `/api/v1/editorial/analytics/*` `/api/v1/editorial/error-rate/*` `/api/v1/editorial/editing-cycle-times/*` `/api/v1/editorial/journalist-productivity/*` `/api/v1/editorial/readership-trends/*` `/api/v1/editorial/social-sentiment/*` `/api/v1/editorial/content-production/*` `/api/v1/editorial/deadline-compliance/*` `/api/v1/editorial/topic-virality/*` `/api/v1/editorial/breaking-news/*` `/api/v1/editorial/backlog-mgt/*` `/api/v1/editorial/contentFreshness/*` `/api/v1/editorial/updateFrequency/*` `/api/v1/editorial/segment-popularity/*` |

---

### Administration Department

| Role | Accessible Endpoints |
|------|----------------------|
| `admin_staff` | `/api/v1/administrative/*` `/api/v1/admnistrative/*` `/api/v1/hr/*` `/api/v1/specialized/attendance-rate` `/api/v1/specialized/CaseCompliance` `/api/v1/specialized/feedback` `/api/v1/specialized/sponsor-roi` `/api/v1/executive/strategic-init-tracking` `/api/v1/executive/company-wide-kpis` `/api/v1/executives/compliance/*` |

---

### Executive Roles

| Role | Accessible Endpoints |
|------|----------------------|
| `ceo` | `*` — full access |
| `managingdirector` | `/api/v1/executive/*` `/api/v1/executives/*` |
| `deputymanagingdirector` | `/api/v1/executive/*` `/api/v1/executives/*` |
| `companysecretary` | `/api/v1/executive/*` `/api/v1/executives/*` |
| `chiefhumanresourceofficer` | `/api/v1/executive/*` `/api/v1/executives/*` |
| `chiefinternalauditor` | `/api/v1/executive/*` `/api/v1/executives/*` `/api/v1/executives/compliance/*` `/api/v1/executives/control-effectiveness` |

---

### Specialized Roles

| Role | Accessible Endpoints |
|------|----------------------|
| `legalofficer` | `/api/v1/specialized/*` `/api/v1/executive/cost-optimization` `/api/v1/executives/risk-heatmap` |
| `riskmanager` | `/api/v1/specialized/*` `/api/v1/executives/risk-heatmap` `/api/v1/executives/control-effectiveness` `/api/v1/executives/compliance/*` |
| `eventsmanager` | `/api/v1/specialized/*` `/api/v1/administrative/*` |
| `hrroles` | `/api/v1/specialized/*` `/api/v1/executive/CEOAnalytics/workforce-analytics` `/api/v1/executive/CEOAnalytics/retention-rates` `/api/v1/executive/CEOAnalytics/compensation-benchmarks` |
| `research&datamanager` | `/api/v1/specialized/*` `/api/v1/editorial/*` `/api/v1/executive/company-wide-kpis` |

---

## Users

### System / Administration

| Name | Email | Role | Password |
|------|-------|------|----------|
| Admin | admin@vision.com | `super_admin` | `Admin@2024!` |
| Administration Manager | administrationmanager@vision.com | `admin_staff` | `AdminMgr@2024!` |
| Executive Assistant | executiveassistant@vision.com | `admin_staff` | `ExecAsst@2024!` |
| Administrative Assistant | administrativeassistant@vision.com | `admin_staff` | `AdminAsst@2024!` |

---

### IT Department

| Name | Email | Role | Password |
|------|-------|------|----------|
| Head of IT | headofit@vision.com | `head_of_it` | `HeadIT@2024!` |
| Systems Administrator | systemsadministrator@vision.com | `head_of_it` | `SysAdmin@2024!` |
| Manager Tech Infrastructure | managertechinfra@vision.com | `it_staff` | `TechMgr@2024!` |
| Manager InfoSec | managerinfosec@vision.com | `it_staff` | `InfoSec@2024!` |
| Manager Service Delivery | managerservicedelivery@vision.com | `it_staff` | `ServiceDel@2024!` |
| Network Admin | networkadmin@vision.com | `it_staff` | `NetAdmin@2024!` |
| IT Support | itsupport@vision.com | `it_staff` | `ITSupport@2024!` |

---

### Sales Department

| Name | Email | Role | Password |
|------|-------|------|----------|
| Head of Sales | headofsales@vision.com | `head_of_sales` | `HeadSales@2024!` |
| Advertising Manager | advertisingmanager@vision.com | `head_of_sales` | `AdMgr@2024!` |
| Marketing Manager | marketingmanager@vision.com | `head_of_sales` | `MktMgr@2024!` |
| Sales Manager | salesmanager@vision.com | `head_of_sales` | `SalesMgr@2024!` |
| Digital Marketing Optimizer | digitalmktopt@vision.com | `sales_staff` | `DigiMkt@2024!` |
| Corporate Sales Supervisor | corporatesalessup@vision.com | `sales_staff` | `CorpSales@2024!` |

---

### Operations Department

| Name | Email | Role | Password |
|------|-------|------|----------|
| Head of Printing | headofprinting@vision.com | `head_of_operations` | `HeadPrint@2024!` |
| Printing Supervisor | printingsupervisor@vision.com | `operations_staff` | `PrintSup@2024!` |
| Broadcast Engineer | broadcasteng@vision.com | `operations_staff` | `BroadcastEng@2024!` |
| Technician | technician@vision.com | `operations_staff` | `Technician@2024!` |
| Transport Officer | transport@vision.com | `operations_staff` | `Transport@2024!` |

---

### Finance Department

| Name | Email | Role | Password |
|------|-------|------|----------|
| Financial Controller | financialcontroller@vision.com | `head_of_finance` | `FinCtrl@2024!` |
| Senior Accountant | senioraccount@vision.com | `finance_staff` | `SeniorAcc@2024!` |
| Principal Accountant | principalaccountant@vision.com | `finance_staff` | `PrinAcc@2024!` |
| Accountant | accountant@vision.com | `finance_staff` | `Accountant@2024!` |
| Assistant Accountant | asaccountant@vision.com | `finance_staff` | `AssAcc@2024!` |
| Credit Controller | creditcontroller@vision.com | `finance_staff` | `CreditCtrl@2024!` |
| Systems Accountant | sysaccountant@vision.com | `finance_staff` | `SysAcc@2024!` |

---

### Editorial Department

| Name | Email | Role | Password |
|------|-------|------|----------|
| Editor in Chief | editorinchief@vision.com | `head_of_editorial` | `EditorChief@2024!` |
| Reporter | reporter@vision.com | `editorial_staff` | `Reporter@2024!` |
| Editor | editor@vision.com | `editorial_staff` | `Editor@2024!` |
| Managing Editor | managingeditor@vision.com | `editorial_staff` | `ManagEditor@2024!` |
| News Editor | newseditor@vision.com | `editorial_staff` | `NewsEditor@2024!` |
| Deputy Editor | deputyeditor@vision.com | `editorial_staff` | `DepEditor@2024!` |
| Sub Editor | subeditor@vision.com | `editorial_staff` | `SubEditor@2024!` |
| Photo/Video Journalist | photovideojournalist@vision.com | `editorial_staff` | `PhotoVid@2024!` |
| Presenter/Anchor | presenteranchor@vision.com | `editorial_staff` | `Presenter@2024!` |

---

### Executive

| Name | Email | Role | Password |
|------|-------|------|----------|
| Chief Executive Officer | ceo@vision.com | `ceo` | `CEO@Vision2024!` |
| Managing Director | managingdirector@vision.com | `managingdirector` | `ManagDir@2024!` |
| Managing Director (alt) | mandir@vision.com | `managingdirector` | `mandir@vision2025` |
| Deputy Managing Director | deputymd@vision.com | `deputymanagingdirector` | `DeputyMD@2024!` |
| Company Secretary | companysecretary@vision.com | `companysecretary` | `CompSec@2024!` |
| Chief Human Resource Officer | chiefhr@vision.com | `chiefhumanresourceofficer` | `ChiefHR@2024!` |
| Chief Internal Auditor | chiefinternalauditor@vision.com | `chiefinternalauditor` | `ChiefAudit@2024!` |

---

### Specialized Roles

| Name | Email | Role | Password |
|------|-------|------|----------|
| Legal Officer | legalofficer@vision.com | `legalofficer` | `LegalOfficer@2024!` |
| Risk Manager | riskmanager@vision.com | `riskmanager` | `RiskMgr@2024!` |
| Events Manager | eventsmanager@vision.com | `eventsmanager` | `EventsMgr@2024!` |
| HR Manager | hrmanager@vision.com | `hrroles` | `HRMgr@2024!` |
| Research & Data Manager | researchmanager@vision.com | `research&datamanager` | `ResearchMgr@2024!` |
