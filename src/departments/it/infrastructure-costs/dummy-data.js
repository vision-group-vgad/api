const dummyData = [
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1200000,
    "unit": "UGX",
    "date": "2025-01-07"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1250000,
    "unit": "UGX",
    "date": "2025-01-14"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1180000,
    "unit": "UGX",
    "date": "2025-01-21"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1220000,
    "unit": "UGX",
    "date": "2025-01-28"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 900000,
    "unit": "UGX",
    "date": "2025-01-07"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 950000,
    "unit": "UGX",
    "date": "2025-01-14"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 920000,
    "unit": "UGX",
    "date": "2025-01-21"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 940000,
    "unit": "UGX",
    "date": "2025-01-28"
  },

  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 400000,
    "unit": "UGX",
    "date": "2025-01-07"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 420000,
    "unit": "UGX",
    "date": "2025-01-14"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 410000,
    "unit": "UGX",
    "date": "2025-01-21"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 430000,
    "unit": "UGX",
    "date": "2025-01-28"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 300000,
    "unit": "UGX",
    "date": "2025-01-07"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 320000,
    "unit": "UGX",
    "date": "2025-01-14"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 310000,
    "unit": "UGX",
    "date": "2025-01-21"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 330000,
    "unit": "UGX",
    "date": "2025-01-28"
  },

  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 250000,
    "unit": "UGX",
    "date": "2025-01-07"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 270000,
    "unit": "UGX",
    "date": "2025-01-14"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 260000,
    "unit": "UGX",
    "date": "2025-01-21"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 280000,
    "unit": "UGX",
    "date": "2025-01-28"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 600000,
    "unit": "UGX",
    "date": "2025-01-07"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 620000,
    "unit": "UGX",
    "date": "2025-01-14"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 610000,
    "unit": "UGX",
    "date": "2025-01-21"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 630000,
    "unit": "UGX",
    "date": "2025-01-28"
  },

  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 900000,
    "unit": "UGX",
    "date": "2025-01-07"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 920000,
    "unit": "UGX",
    "date": "2025-01-14"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 910000,
    "unit": "UGX",
    "date": "2025-01-21"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 930000,
    "unit": "UGX",
    "date": "2025-01-28"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 200000,
    "unit": "UGX",
    "date": "2025-01-07"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 220000,
    "unit": "UGX",
    "date": "2025-01-14"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 210000,
    "unit": "UGX",
    "date": "2025-01-21"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 230000,
    "unit": "UGX",
    "date": "2025-01-28"
  },

  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 150000,
    "unit": "UGX",
    "date": "2025-01-07"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 160000,
    "unit": "UGX",
    "date": "2025-01-14"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 155000,
    "unit": "UGX",
    "date": "2025-01-21"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 165000,
    "unit": "UGX",
    "date": "2025-01-28"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 100000,
    "unit": "UGX",
    "date": "2025-01-07"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 110000,
    "unit": "UGX",
    "date": "2025-01-14"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 105000,
    "unit": "UGX",
    "date": "2025-01-21"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 115000,
    "unit": "UGX",
    "date": "2025-01-28"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1230000,
    "unit": "UGX",
    "date": "2025-02-04"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1270000,
    "unit": "UGX",
    "date": "2025-02-11"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1195000,
    "unit": "UGX",
    "date": "2025-02-18"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1240000,
    "unit": "UGX",
    "date": "2025-02-25"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 910000,
    "unit": "UGX",
    "date": "2025-02-04"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 960000,
    "unit": "UGX",
    "date": "2025-02-11"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 925000,
    "unit": "UGX",
    "date": "2025-02-18"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 945000,
    "unit": "UGX",
    "date": "2025-02-25"
  },

  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 405000,
    "unit": "UGX",
    "date": "2025-02-04"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 425000,
    "unit": "UGX",
    "date": "2025-02-11"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 415000,
    "unit": "UGX",
    "date": "2025-02-18"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 435000,
    "unit": "UGX",
    "date": "2025-02-25"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 305000,
    "unit": "UGX",
    "date": "2025-02-04"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 325000,
    "unit": "UGX",
    "date": "2025-02-11"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 315000,
    "unit": "UGX",
    "date": "2025-02-18"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 335000,
    "unit": "UGX",
    "date": "2025-02-25"
  },

  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 255000,
    "unit": "UGX",
    "date": "2025-02-04"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 275000,
    "unit": "UGX",
    "date": "2025-02-11"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 265000,
    "unit": "UGX",
    "date": "2025-02-18"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 285000,
    "unit": "UGX",
    "date": "2025-02-25"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 605000,
    "unit": "UGX",
    "date": "2025-02-04"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 625000,
    "unit": "UGX",
    "date": "2025-02-11"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 615000,
    "unit": "UGX",
    "date": "2025-02-18"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 635000,
    "unit": "UGX",
    "date": "2025-02-25"
  },

  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 905000,
    "unit": "UGX",
    "date": "2025-02-04"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 925000,
    "unit": "UGX",
    "date": "2025-02-11"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 915000,
    "unit": "UGX",
    "date": "2025-02-18"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 935000,
    "unit": "UGX",
    "date": "2025-02-25"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 205000,
    "unit": "UGX",
    "date": "2025-02-04"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 225000,
    "unit": "UGX",
    "date": "2025-02-11"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 215000,
    "unit": "UGX",
    "date": "2025-02-18"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 235000,
    "unit": "UGX",
    "date": "2025-02-25"
  },

  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 155000,
    "unit": "UGX",
    "date": "2025-02-04"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 165000,
    "unit": "UGX",
    "date": "2025-02-11"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 160000,
    "unit": "UGX",
    "date": "2025-02-18"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 170000,
    "unit": "UGX",
    "date": "2025-02-25"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 105000,
    "unit": "UGX",
    "date": "2025-02-04"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 115000,
    "unit": "UGX",
    "date": "2025-02-11"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 110000,
    "unit": "UGX",
    "date": "2025-02-18"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 120000,
    "unit": "UGX",
    "date": "2025-02-25"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1240000,
    "unit": "UGX",
    "date": "2025-03-04"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1280000,
    "unit": "UGX",
    "date": "2025-03-11"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1205000,
    "unit": "UGX",
    "date": "2025-03-18"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1250000,
    "unit": "UGX",
    "date": "2025-03-25"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 920000,
    "unit": "UGX",
    "date": "2025-03-04"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 970000,
    "unit": "UGX",
    "date": "2025-03-11"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 935000,
    "unit": "UGX",
    "date": "2025-03-18"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 955000,
    "unit": "UGX",
    "date": "2025-03-25"
  },

  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 410000,
    "unit": "UGX",
    "date": "2025-03-04"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 430000,
    "unit": "UGX",
    "date": "2025-03-11"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 420000,
    "unit": "UGX",
    "date": "2025-03-18"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 440000,
    "unit": "UGX",
    "date": "2025-03-25"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 310000,
    "unit": "UGX",
    "date": "2025-03-04"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 330000,
    "unit": "UGX",
    "date": "2025-03-11"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 320000,
    "unit": "UGX",
    "date": "2025-03-18"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 340000,
    "unit": "UGX",
    "date": "2025-03-25"
  },

  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 260000,
    "unit": "UGX",
    "date": "2025-03-04"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 280000,
    "unit": "UGX",
    "date": "2025-03-11"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 270000,
    "unit": "UGX",
    "date": "2025-03-18"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 290000,
    "unit": "UGX",
    "date": "2025-03-25"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 610000,
    "unit": "UGX",
    "date": "2025-03-04"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 630000,
    "unit": "UGX",
    "date": "2025-03-11"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 620000,
    "unit": "UGX",
    "date": "2025-03-18"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 640000,
    "unit": "UGX",
    "date": "2025-03-25"
  },

  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 910000,
    "unit": "UGX",
    "date": "2025-03-04"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 930000,
    "unit": "UGX",
    "date": "2025-03-11"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 920000,
    "unit": "UGX",
    "date": "2025-03-18"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 940000,
    "unit": "UGX",
    "date": "2025-03-25"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 210000,
    "unit": "UGX",
    "date": "2025-03-04"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 230000,
    "unit": "UGX",
    "date": "2025-03-11"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 220000,
    "unit": "UGX",
    "date": "2025-03-18"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 240000,
    "unit": "UGX",
    "date": "2025-03-25"
  },

  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 160000,
    "unit": "UGX",
    "date": "2025-03-04"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 170000,
    "unit": "UGX",
    "date": "2025-03-11"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 165000,
    "unit": "UGX",
    "date": "2025-03-18"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 175000,
    "unit": "UGX",
    "date": "2025-03-25"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 110000,
    "unit": "UGX",
    "date": "2025-03-04"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 120000,
    "unit": "UGX",
    "date": "2025-03-11"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 115000,
    "unit": "UGX",
    "date": "2025-03-18"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 125000,
    "unit": "UGX",
    "date": "2025-03-25"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1250000,
    "unit": "UGX",
    "date": "2025-04-01"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1290000,
    "unit": "UGX",
    "date": "2025-04-08"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1215000,
    "unit": "UGX",
    "date": "2025-04-15"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1260000,
    "unit": "UGX",
    "date": "2025-04-22"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 930000,
    "unit": "UGX",
    "date": "2025-04-01"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 980000,
    "unit": "UGX",
    "date": "2025-04-08"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 945000,
    "unit": "UGX",
    "date": "2025-04-15"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 965000,
    "unit": "UGX",
    "date": "2025-04-22"
  },

  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 415000,
    "unit": "UGX",
    "date": "2025-04-01"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 435000,
    "unit": "UGX",
    "date": "2025-04-08"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 425000,
    "unit": "UGX",
    "date": "2025-04-15"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 445000,
    "unit": "UGX",
    "date": "2025-04-22"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 315000,
    "unit": "UGX",
    "date": "2025-04-01"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 335000,
    "unit": "UGX",
    "date": "2025-04-08"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 325000,
    "unit": "UGX",
    "date": "2025-04-15"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 345000,
    "unit": "UGX",
    "date": "2025-04-22"
  },

  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 265000,
    "unit": "UGX",
    "date": "2025-04-01"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 285000,
    "unit": "UGX",
    "date": "2025-04-08"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 275000,
    "unit": "UGX",
    "date": "2025-04-15"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 295000,
    "unit": "UGX",
    "date": "2025-04-22"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 615000,
    "unit": "UGX",
    "date": "2025-04-01"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 635000,
    "unit": "UGX",
    "date": "2025-04-08"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 625000,
    "unit": "UGX",
    "date": "2025-04-15"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 645000,
    "unit": "UGX",
    "date": "2025-04-22"
  },

  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 915000,
    "unit": "UGX",
    "date": "2025-04-01"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 935000,
    "unit": "UGX",
    "date": "2025-04-08"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 925000,
    "unit": "UGX",
    "date": "2025-04-15"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 945000,
    "unit": "UGX",
    "date": "2025-04-22"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 215000,
    "unit": "UGX",
    "date": "2025-04-01"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 235000,
    "unit": "UGX",
    "date": "2025-04-08"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 225000,
    "unit": "UGX",
    "date": "2025-04-15"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 245000,
    "unit": "UGX",
    "date": "2025-04-22"
  },

  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 165000,
    "unit": "UGX",
    "date": "2025-04-01"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 175000,
    "unit": "UGX",
    "date": "2025-04-08"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 170000,
    "unit": "UGX",
    "date": "2025-04-15"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 180000,
    "unit": "UGX",
    "date": "2025-04-22"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 115000,
    "unit": "UGX",
    "date": "2025-04-01"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 125000,
    "unit": "UGX",
    "date": "2025-04-08"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 120000,
    "unit": "UGX",
    "date": "2025-04-15"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 130000,
    "unit": "UGX",
    "date": "2025-04-22"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1260000,
    "unit": "UGX",
    "date": "2025-05-06"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1300000,
    "unit": "UGX",
    "date": "2025-05-13"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1225000,
    "unit": "UGX",
    "date": "2025-05-20"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1270000,
    "unit": "UGX",
    "date": "2025-05-27"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 940000,
    "unit": "UGX",
    "date": "2025-05-06"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 990000,
    "unit": "UGX",
    "date": "2025-05-13"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 955000,
    "unit": "UGX",
    "date": "2025-05-20"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 975000,
    "unit": "UGX",
    "date": "2025-05-27"
  },

  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 420000,
    "unit": "UGX",
    "date": "2025-05-06"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 440000,
    "unit": "UGX",
    "date": "2025-05-13"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 430000,
    "unit": "UGX",
    "date": "2025-05-20"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 450000,
    "unit": "UGX",
    "date": "2025-05-27"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 320000,
    "unit": "UGX",
    "date": "2025-05-06"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 340000,
    "unit": "UGX",
    "date": "2025-05-13"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 330000,
    "unit": "UGX",
    "date": "2025-05-20"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 350000,
    "unit": "UGX",
    "date": "2025-05-27"
  },

  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 270000,
    "unit": "UGX",
    "date": "2025-05-06"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 290000,
    "unit": "UGX",
    "date": "2025-05-13"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 280000,
    "unit": "UGX",
    "date": "2025-05-20"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 300000,
    "unit": "UGX",
    "date": "2025-05-27"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 620000,
    "unit": "UGX",
    "date": "2025-05-06"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 640000,
    "unit": "UGX",
    "date": "2025-05-13"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 630000,
    "unit": "UGX",
    "date": "2025-05-20"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 650000,
    "unit": "UGX",
    "date": "2025-05-27"
  },

  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 920000,
    "unit": "UGX",
    "date": "2025-05-06"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 940000,
    "unit": "UGX",
    "date": "2025-05-13"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 930000,
    "unit": "UGX",
    "date": "2025-05-20"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 950000,
    "unit": "UGX",
    "date": "2025-05-27"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 220000,
    "unit": "UGX",
    "date": "2025-05-06"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 240000,
    "unit": "UGX",
    "date": "2025-05-13"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 230000,
    "unit": "UGX",
    "date": "2025-05-20"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 250000,
    "unit": "UGX",
    "date": "2025-05-27"
  },

  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 170000,
    "unit": "UGX",
    "date": "2025-05-06"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 180000,
    "unit": "UGX",
    "date": "2025-05-13"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 175000,
    "unit": "UGX",
    "date": "2025-05-20"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 185000,
    "unit": "UGX",
    "date": "2025-05-27"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 120000,
    "unit": "UGX",
    "date": "2025-05-06"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 130000,
    "unit": "UGX",
    "date": "2025-05-13"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 125000,
    "unit": "UGX",
    "date": "2025-05-20"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 135000,
    "unit": "UGX",
    "date": "2025-05-27"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1270000,
    "unit": "UGX",
    "date": "2025-06-03"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1310000,
    "unit": "UGX",
    "date": "2025-06-10"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1235000,
    "unit": "UGX",
    "date": "2025-06-17"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1280000,
    "unit": "UGX",
    "date": "2025-06-24"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 950000,
    "unit": "UGX",
    "date": "2025-06-03"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 1000000,
    "unit": "UGX",
    "date": "2025-06-10"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 965000,
    "unit": "UGX",
    "date": "2025-06-17"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 985000,
    "unit": "UGX",
    "date": "2025-06-24"
  },

  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 425000,
    "unit": "UGX",
    "date": "2025-06-03"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 445000,
    "unit": "UGX",
    "date": "2025-06-10"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 435000,
    "unit": "UGX",
    "date": "2025-06-17"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 455000,
    "unit": "UGX",
    "date": "2025-06-24"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 325000,
    "unit": "UGX",
    "date": "2025-06-03"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 345000,
    "unit": "UGX",
    "date": "2025-06-10"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 335000,
    "unit": "UGX",
    "date": "2025-06-17"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 355000,
    "unit": "UGX",
    "date": "2025-06-24"
  },

  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 275000,
    "unit": "UGX",
    "date": "2025-06-03"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 295000,
    "unit": "UGX",
    "date": "2025-06-10"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 285000,
    "unit": "UGX",
    "date": "2025-06-17"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 305000,
    "unit": "UGX",
    "date": "2025-06-24"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 625000,
    "unit": "UGX",
    "date": "2025-06-03"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 645000,
    "unit": "UGX",
    "date": "2025-06-10"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 635000,
    "unit": "UGX",
    "date": "2025-06-17"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 655000,
    "unit": "UGX",
    "date": "2025-06-24"
  },

  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 925000,
    "unit": "UGX",
    "date": "2025-06-03"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 945000,
    "unit": "UGX",
    "date": "2025-06-10"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 935000,
    "unit": "UGX",
    "date": "2025-06-17"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 955000,
    "unit": "UGX",
    "date": "2025-06-24"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 225000,
    "unit": "UGX",
    "date": "2025-06-03"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 245000,
    "unit": "UGX",
    "date": "2025-06-10"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 235000,
    "unit": "UGX",
    "date": "2025-06-17"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 255000,
    "unit": "UGX",
    "date": "2025-06-24"
  },

  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 175000,
    "unit": "UGX",
    "date": "2025-06-03"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 185000,
    "unit": "UGX",
    "date": "2025-06-10"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 180000,
    "unit": "UGX",
    "date": "2025-06-17"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 190000,
    "unit": "UGX",
    "date": "2025-06-24"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 125000,
    "unit": "UGX",
    "date": "2025-06-03"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 135000,
    "unit": "UGX",
    "date": "2025-06-10"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 130000,
    "unit": "UGX",
    "date": "2025-06-17"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 140000,
    "unit": "UGX",
    "date": "2025-06-24"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1280000,
    "unit": "UGX",
    "date": "2025-07-01"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1320000,
    "unit": "UGX",
    "date": "2025-07-08"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1245000,
    "unit": "UGX",
    "date": "2025-07-15"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1290000,
    "unit": "UGX",
    "date": "2025-07-22"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 960000,
    "unit": "UGX",
    "date": "2025-07-01"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 1010000,
    "unit": "UGX",
    "date": "2025-07-08"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 975000,
    "unit": "UGX",
    "date": "2025-07-15"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 995000,
    "unit": "UGX",
    "date": "2025-07-22"
  },

  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 430000,
    "unit": "UGX",
    "date": "2025-07-01"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 450000,
    "unit": "UGX",
    "date": "2025-07-08"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 440000,
    "unit": "UGX",
    "date": "2025-07-15"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 460000,
    "unit": "UGX",
    "date": "2025-07-22"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 330000,
    "unit": "UGX",
    "date": "2025-07-01"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 350000,
    "unit": "UGX",
    "date": "2025-07-08"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 340000,
    "unit": "UGX",
    "date": "2025-07-15"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 360000,
    "unit": "UGX",
    "date": "2025-07-22"
  },

  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 280000,
    "unit": "UGX",
    "date": "2025-07-01"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 300000,
    "unit": "UGX",
    "date": "2025-07-08"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 290000,
    "unit": "UGX",
    "date": "2025-07-15"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 310000,
    "unit": "UGX",
    "date": "2025-07-22"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 630000,
    "unit": "UGX",
    "date": "2025-07-01"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 650000,
    "unit": "UGX",
    "date": "2025-07-08"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 640000,
    "unit": "UGX",
    "date": "2025-07-15"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 660000,
    "unit": "UGX",
    "date": "2025-07-22"
  },

  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 930000,
    "unit": "UGX",
    "date": "2025-07-01"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 950000,
    "unit": "UGX",
    "date": "2025-07-08"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 940000,
    "unit": "UGX",
    "date": "2025-07-15"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 960000,
    "unit": "UGX",
    "date": "2025-07-22"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 230000,
    "unit": "UGX",
    "date": "2025-07-01"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 250000,
    "unit": "UGX",
    "date": "2025-07-08"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 240000,
    "unit": "UGX",
    "date": "2025-07-15"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 260000,
    "unit": "UGX",
    "date": "2025-07-22"
  },

  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 180000,
    "unit": "UGX",
    "date": "2025-07-01"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 190000,
    "unit": "UGX",
    "date": "2025-07-08"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 185000,
    "unit": "UGX",
    "date": "2025-07-15"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 195000,
    "unit": "UGX",
    "date": "2025-07-22"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 130000,
    "unit": "UGX",
    "date": "2025-07-01"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 140000,
    "unit": "UGX",
    "date": "2025-07-08"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 135000,
    "unit": "UGX",
    "date": "2025-07-15"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 145000,
    "unit": "UGX",
    "date": "2025-07-22"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1290000,
    "unit": "UGX",
    "date": "2025-08-05"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1330000,
    "unit": "UGX",
    "date": "2025-08-12"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1255000,
    "unit": "UGX",
    "date": "2025-08-19"
  },
  {
    "category": "Compute",
    "service": "EC2 Instances",
    "cost": 1300000,
    "unit": "UGX",
    "date": "2025-08-26"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 970000,
    "unit": "UGX",
    "date": "2025-08-05"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 1020000,
    "unit": "UGX",
    "date": "2025-08-12"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 985000,
    "unit": "UGX",
    "date": "2025-08-19"
  },
  {
    "category": "Compute",
    "service": "Kubernetes Cluster",
    "cost": 1005000,
    "unit": "UGX",
    "date": "2025-08-26"
  },

  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 435000,
    "unit": "UGX",
    "date": "2025-08-05"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 455000,
    "unit": "UGX",
    "date": "2025-08-12"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 445000,
    "unit": "UGX",
    "date": "2025-08-19"
  },
  {
    "category": "Storage",
    "service": "S3 Buckets",
    "cost": 465000,
    "unit": "UGX",
    "date": "2025-08-26"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 335000,
    "unit": "UGX",
    "date": "2025-08-05"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 355000,
    "unit": "UGX",
    "date": "2025-08-12"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 345000,
    "unit": "UGX",
    "date": "2025-08-19"
  },
  {
    "category": "Storage",
    "service": "Block Storage (EBS)",
    "cost": 365000,
    "unit": "UGX",
    "date": "2025-08-26"
  },

  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 285000,
    "unit": "UGX",
    "date": "2025-08-05"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 305000,
    "unit": "UGX",
    "date": "2025-08-12"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 295000,
    "unit": "UGX",
    "date": "2025-08-19"
  },
  {
    "category": "Networking",
    "service": "Load Balancers",
    "cost": 315000,
    "unit": "UGX",
    "date": "2025-08-26"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 635000,
    "unit": "UGX",
    "date": "2025-08-05"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 655000,
    "unit": "UGX",
    "date": "2025-08-12"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 645000,
    "unit": "UGX",
    "date": "2025-08-19"
  },
  {
    "category": "Networking",
    "service": "Data Transfer",
    "cost": 665000,
    "unit": "UGX",
    "date": "2025-08-26"
  },

  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 940000,
    "unit": "UGX",
    "date": "2025-08-05"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 960000,
    "unit": "UGX",
    "date": "2025-08-12"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 950000,
    "unit": "UGX",
    "date": "2025-08-19"
  },
  {
    "category": "Databases",
    "service": "RDS (Postgres)",
    "cost": 970000,
    "unit": "UGX",
    "date": "2025-08-26"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 235000,
    "unit": "UGX",
    "date": "2025-08-05"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 255000,
    "unit": "UGX",
    "date": "2025-08-12"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 245000,
    "unit": "UGX",
    "date": "2025-08-19"
  },
  {
    "category": "Databases",
    "service": "Redis Cache",
    "cost": 265000,
    "unit": "UGX",
    "date": "2025-08-26"
  },

  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 185000,
    "unit": "UGX",
    "date": "2025-08-05"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 195000,
    "unit": "UGX",
    "date": "2025-08-12"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 190000,
    "unit": "UGX",
    "date": "2025-08-19"
  },
  {
    "category": "Security & Monitoring",
    "service": "CloudWatch",
    "cost": 200000,
    "unit": "UGX",
    "date": "2025-08-26"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 135000,
    "unit": "UGX",
    "date": "2025-08-05"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 145000,
    "unit": "UGX",
    "date": "2025-08-12"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 140000,
    "unit": "UGX",
    "date": "2025-08-19"
  },
  {
    "category": "Security & Monitoring",
    "service": "WAF (Firewall)",
    "cost": 150000,
    "unit": "UGX",
    "date": "2025-08-26"
  }
]



export default dummyData