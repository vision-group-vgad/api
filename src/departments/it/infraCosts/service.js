import IT from "../../../utils/common/IT.js";

const _it = new IT();
const dummyCosts = [
  {
    cost_id: 1,
    category: "Hardware",
    description: "Dell PowerEdge Server",
    cost: 12000000,
    currency: "UGX",
    date: "2025-01-10",
    department: "IT Operations"
  },
  {
    cost_id: 2,
    category: "Software & Licenses",
    description: "Microsoft 365 Business Plan",
    cost: 8000000,
    currency: "UGX",
    date: "2025-01-15",
    department: "IT Operations"
  },
  {
    cost_id: 3, 
    category: "Cloud Services",
    description: "AWS EC2 + S3",
    cost: 1500000,
    currency: "UGX",
    date: "2025-02-01",
    department: "Cloud Team"
  },
  {
    cost_id: 4,
    category: "Data Center & Hosting",
    description: "Colocation Rack Rental",
    cost: 5000000,
    currency: "UGX",
    date: "2025-02-12",
    department: "Infrastructure"
  },
  {
    cost_id: 5,
    category: "Telecom & Connectivity",
    description: "Fiber Internet Subscription (MTN)",
    cost: 3000000,
    currency: "UGX",
    date: "2025-02-20",
    department: "Networking"
  },
  {
    cost_id: 6,
    category: "Security & Backup",
    description: "Fortinet Firewall License",
    cost: 2500000,
    currency: "UGX",
    date: "2025-03-01",
    department: "Cybersecurity"
  },
  {
    cost_id: 7,
    category: "Hardware",
    description: "HP Laptops for Developers",
    cost: 9000000,
    currency: "UGX",
    date: "2025-03-10",
    department: "Software Development"
  },
  {
    cost_id: 8,
    category: "Software & Licenses",
    description: "Adobe Creative Cloud Subscription",
    cost: 2000000,
    currency: "UGX",
    date: "2025-03-15",
    department: "Design"
  },
  {
    cost_id: 9,
    category: "Training & Certifications",
    description: "AWS Solutions Architect Training",
    cost: 3500000,
    currency: "UGX",
    date: "2025-03-25",
    department: "Cloud Team"
  },
  {
    cost_id: 10,
    category: "IT Support & Maintenance",
    description: "Cisco Hardware Maintenance Contract",
    cost: 4000000,
    currency: "UGX",
    date: "2025-04-02",
    department: "Networking"
  },
  {
    cost_id: 11,
    category: "Cloud Services",
    description: "Azure DevOps Subscription",
    cost: 2800000,
    currency: "UGX",
    date: "2025-04-10",
    department: "DevOps"
  },
  {
    cost_id: 12,
    category: "Hardware",
    description: "Network Switches (Cisco)",
    cost: 6000000,
    currency: "UGX",
    date: "2025-04-18",
    department: "Networking"
  },
  {
    cost_id: 13,
    category: "Telecom & Connectivity",
    description: "VPN Subscription for Remote Staff",
    cost: 1200000,
    currency: "UGX",
    date: "2025-05-01",
    department: "IT Operations"
  },
  {
    cost_id: 14,
    category: "Security & Backup",
    description: "Data Backup Solution (Veeam)",
    cost: 3000000,
    currency: "UGX",
    date: "2025-05-12",
    department: "Cybersecurity"
  },
  {
    cost_id: 15,
    category: "Training & Certifications",
    description: "Cybersecurity Awareness Training",
    cost: 1800000,
    currency: "UGX",
    date: "2025-05-20",
    department: "HR / IT"
  },
  {
    cost_id: 16,
    category: "Software & Licenses",
    description: "Oracle Database License",
    cost: 10000000,
    currency: "UGX",
    date: "2025-06-05",
    department: "Database Team"
  },
  {
    cost_id: 17,
    category: "Cloud Services",
    description: "Google Cloud Storage",
    cost: 2200000,
    currency: "UGX",
    date: "2025-06-15",
    department: "Cloud Team"
  },
  {
    cost_id: 18,
    category: "Data Center & Hosting",
    description: "Cooling System Maintenance",
    cost: 1500000,
    currency: "UGX",
    date: "2025-06-28",
    department: "Infrastructure"
  },
  {
    cost_id: 19,
    category: "Hardware",
    description: "Printer & Scanners",
    cost: 1100000,
    currency: "UGX",
    date: "2025-07-05",
    department: "Admin"
  },
  {
    cost_id: 20,
    category: "Security & Backup",
    description: "Antivirus Licenses (Kaspersky)",
    cost: 2000000,
    currency: "UGX",
    date: "2025-07-15",
    department: "Cybersecurity"
  },
  {
    cost_id: 21,
    category: "Telecom & Connectivity",
    description: "Satellite Internet Backup Link",
    cost: 2500000,
    currency: "UGX",
    date: "2025-07-25",
    department: "Networking"
  },
  {
    cost_id: 22,
    category: "IT Support & Maintenance",
    description: "Onsite Technical Support Contract",
    cost: 3200000,
    currency: "UGX",
    date: "2025-08-01",
    department: "IT Operations"
  }
];


/**
 * Get all costs (optionally filter by category, date range)
 */
export const getInfrastructureCosts = async (filters = {}) => {
  let results;
  try {
    const liveData = await _it.fetchLiveData('/it/infrastructure-costs');
    results = Array.isArray(liveData) && liveData.length > 0 ? [...liveData] : [...dummyCosts];
  } catch (err) {
    console.warn('[InfraCosts] Live fetch failed, using dummy:', err.message);
    results = [...dummyCosts];
  }

  if (filters.category) {
    results = results.filter(c => c.category === filters.category);
  }

  if (filters.startDate && filters.endDate) {
    results = results.filter(c => {
      const d = new Date(c.date);
      return d >= new Date(filters.startDate) && d <= new Date(filters.endDate);
    });
  }

  return results;
};
