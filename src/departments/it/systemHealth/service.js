import IT from "../../../utils/common/IT.js";

const _it = new IT();

export const fallbackSystems = [
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
  const operational = systemsArray.filter((s) => {
    if (s.status === 'operational') return true;
    if (s.healthScore != null)       return s.healthScore >= 70;
    if (s.availabilityPercent != null) return s.availabilityPercent >= 95;
    return false;
  }).length;
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


export const getSystemHealth = async (req, res) => {
  const { system } = req.query;

  let systemsArray;
  try {
    const liveData = await _it.fetchLiveData('/it/system-health');
    systemsArray = Array.isArray(liveData) && liveData.length > 0 ? liveData : fallbackSystems;
  } catch (err) {
    console.warn('[SystemHealth] Live fetch failed, using dummy:', err.message);
    systemsArray = fallbackSystems;
  }

  let filteredSystems = systemsArray;
  if (system) {
    filteredSystems = systemsArray.filter(s =>
      (s.name || s.systemName || '').toLowerCase() === system.toLowerCase()
    );
    if (filteredSystems.length === 0) {
      return res.status(404).json({ message: `System '${system}' not found.` });
    }
  }

  const health = computeHealth(filteredSystems);
  return res.status(200).json(health);
};
