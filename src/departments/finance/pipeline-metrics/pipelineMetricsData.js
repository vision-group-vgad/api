// pipelineMetricsData.js

export function generatePipelineMetricsRaw(count = 200) {
  const sourceSystems = {
    ERP: [10000, 50000],
    CRM: [5000, 30000],
    HRIS: [2000, 10000],
    Billing: [30000, 150000],
    Payments: [20000, 100000],
    DataWarehouse: [50000, 500000]
  };

  const pipelineJobs = [
    "Daily ETL",
    "Incremental Load",
    "API Sync",
    "Reconciliation",
    "Reporting Extract"
  ];

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T23:59:59Z");

  const data = [];

  for (let i = 0; i < count; i++) {
    const date = randomDate(startDate, endDate);
    const system = randomChoice(Object.keys(sourceSystems));
    const [min, max] = sourceSystems[system];
    const pipelineJob = randomChoice(pipelineJobs);

    // Records expected ~ log-normal for realism
    const recordsExpected = Math.floor(
      Math.exp(Math.log(min) + Math.random() * (Math.log(max) - Math.log(min)))
    );

    // Errors: <0.5% usually
    const errors = Math.floor(recordsExpected * Math.min(0.005, Math.random() * 0.01));

    // Dropped rows: small fraction, 0–0.5%
    const dropped = Math.floor(recordsExpected * (Math.random() * 0.005));

    // Records loaded = expected - errors - dropped
    const recordsLoaded = Math.max(0, recordsExpected - errors - dropped);

    // Latency scales with volume (seconds) + small random noise
    const throughput = 5000; // records/sec baseline
    const latency = parseFloat(((recordsExpected / throughput) + Math.random() * 1).toFixed(2));

    // Manual fixes: fraction of errors (20–30%)
    const manualFixes = Math.floor(errors * (0.2 + Math.random() * 0.1));

    data.push({
      recordId: `PIPE-${String(i + 1).padStart(4, "0")}`,
      date: date.toISOString().slice(0, 10),
      sourceSystem: system,
      pipelineJob,
      recordsExpected,
      recordsLoaded,
      errors,
      dropped,
      latency,
      manualFixes
    });
  }

  return data;
}
