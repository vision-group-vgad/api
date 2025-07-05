export const systems = [
  { name: "ERP", status: "operational" },
  { name: "Google Analytics", status: "operational" },
  { name: "Email", status: "offline" },
  { name: "Business Central", status: "operational" },
  { name: "Share point", status: "operational" },
  { name: "CMS", status: "operational" },
  { name: "Website", status: "offline" },
];


export function computeHealth(systemsArray) {
  const total = systemsArray.length;
  const operational = systemsArray.filter(
    (s) => s.status === "operational"
  ).length;
  const offline = total - operational;
  const percentage = total === 0 ? 0 : Math.round((operational / total) * 100);

  return {
    totalSystems: total,
    operationalSystems: operational,
    offlineSystems: offline,
    healthPercentage: percentage,
    lastUpdated: new Date(),
  };
}


export const getSystemHealth = (req, res) => {
  const { system } = req.query;

  let filteredSystems = systems;

  if (system) {
    filteredSystems = systems.filter(
      (s) => s.name.toLowerCase() === system.toLowerCase()
    );
    if (filteredSystems.length === 0) {
      return res.status(404).json({ message: `System '${system}' not found.` });
    }
  }

  const health = computeHealth(filteredSystems);
  return res.status(200).json(health);
};
