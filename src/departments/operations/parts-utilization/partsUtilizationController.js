import { generatePartsUtilization } from "./partsUtilizationData.js";
import OpsProduction from "../../../utils/common/OpsProduction.js";

const opsProduction = new OpsProduction();

export const getPartsUtilization = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const fetchStart = req.query.startDate || thirtyDaysAgo;
    const fetchEnd = req.query.endDate || today;

    let data;
    try {
      const response = await opsProduction.fetchModuleData('parts-utilization', fetchStart, fetchEnd);
      data = Array.isArray(response.data) && response.data.length > 0 ? response.data : generatePartsUtilization(300);
      if (!Array.isArray(response.data) || response.data.length === 0) {
        console.warn('[PartsUtilization] Live data empty, falling back to generated data');
      }
    } catch (fetchError) {
      console.warn('[PartsUtilization] Live data fetch failed, using generated data:', fetchError.message);
      data = generatePartsUtilization(300);
    }

    const { partName, equipmentType, jobType } = req.query;

    // Apply optional filters
    let filteredData = data;
    if (partName) {
      const ids = partName.split(",");
      filteredData = filteredData.filter(d => ids.includes(d.partName));
    }
    if (equipmentType) {
      const types = equipmentType.split(",");
      filteredData = filteredData.filter(d => types.includes(d.equipmentType));
    }
    if (jobType) {
      const jobs = jobType.split(",");
      filteredData = filteredData.filter(d => jobs.includes(d.jobType));
    }

    // Aggregate by equipmentType
    const byEquipmentType = {};
    filteredData.forEach(entry => {
      const key = `${entry.partId}-${entry.equipmentType}`;
      if (!byEquipmentType[key]) {
        byEquipmentType[key] = {
          partId: entry.partId,
          partName: entry.partName,
          equipmentType: entry.equipmentType,
          totalQuantity: 0
        };
      }
      byEquipmentType[key].totalQuantity += entry.quantityUsed;
    });

    // Aggregate by jobType
    const byJobType = {};
    filteredData.forEach(entry => {
      const key = `${entry.partId}-${entry.jobType}`;
      if (!byJobType[key]) {
        byJobType[key] = {
          partId: entry.partId,
          partName: entry.partName,
          jobType: entry.jobType,
          totalQuantity: 0
        };
      }
      byJobType[key].totalQuantity += entry.quantityUsed;
    });

    // Aggregate by part (regardless of grouping)
    const byParts = {};
    filteredData.forEach(entry => {
      if (!byParts[entry.partId]) {
        byParts[entry.partId] = {
          partId: entry.partId,
          partName: entry.partName,
          totalQuantity: 0
        };
      }
      byParts[entry.partId].totalQuantity += entry.quantityUsed;
    });

    res.json({
      totalRecords: filteredData.length,
      utilizationTrends: {
        byEquipmentType: Object.values(byEquipmentType),
        byJobType: Object.values(byJobType),
        byParts: Object.values(byParts)
      },
      data: filteredData
    });

  } catch (error) {
    console.error("Error fetching parts utilization:", error);
    res.status(500).json({
      message: "Failed to fetch parts utilization",
      error: error.message,
    });
  }
};
