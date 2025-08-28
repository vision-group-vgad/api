import { generateMaintenanceTickets } from "./ticketResolutionData.js";

export const getTicketResolution = (req, res) => {
  try {
    const data = generateMaintenanceTickets(300);

    const { 
      technicianName: techNameFilter, 
      ticketType: typeFilter, 
      priority: priorityFilter, 
      status: statusFilter 
    } = req.query;

    // Apply optional filters
    let filteredData = data;

    if (techNameFilter) {
      const names = techNameFilter.split(",");
      filteredData = filteredData.filter(d => names.includes(d.technicianName));
    }

    if (typeFilter) {
      const types = typeFilter.split(",");
      filteredData = filteredData.filter(d => types.includes(d.ticketType));
    }

    if (priorityFilter) {
      const priorities = priorityFilter.split(",");
      filteredData = filteredData.filter(d => priorities.includes(d.priority));
    }

    if (statusFilter) {
      const statuses = statusFilter.split(",");
      filteredData = filteredData.filter(d => statuses.includes(d.status));
    }

    // Aggregate resolution times by technician + ticket type
    const stats = {};
    filteredData.forEach(ticket => {
      const key = `${ticket.technicianId}-${ticket.ticketType}`;
      if (!stats[key]) {
        stats[key] = {
          technicianId: ticket.technicianId,
          technicianName: ticket.technicianName,
          ticketType: ticket.ticketType,
          totalResolutionTime: 0,
          resolvedCount: 0,
          ticketCount: 0
        };
      }

      stats[key].ticketCount += 1;

      // Only add numeric resolution times for calculating average
      if (typeof ticket.resolutionTime === "number") {
        stats[key].totalResolutionTime += ticket.resolutionTime;
        stats[key].resolvedCount += 1;
      }
    });

    // Group by technician
    const technicianGrouped = {};
    Object.values(stats).forEach(stat => {
      const avgResolutionTime = stat.resolvedCount > 0
        ? stat.totalResolutionTime / stat.resolvedCount
        : 0; // 0 if no resolved tickets

      if (!technicianGrouped[stat.technicianName]) technicianGrouped[stat.technicianName] = [];

      technicianGrouped[stat.technicianName].push({
        ticketType: stat.ticketType,
        avgResolutionTime: parseFloat(avgResolutionTime.toFixed(2)), // in hours
        resolvedTickets: stat.resolvedCount,
        totalTickets: stat.ticketCount
      });
    });

    // ✅ New: group counts by status
    const ticketCountsByStatus = filteredData.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalTickets: filteredData.length,
      ticketCountsByStatus,
      technicianResolutionTrends: technicianGrouped,
      data: filteredData // includes all tickets with placeholders
    });

  } catch (error) {
    console.error("Error fetching ticket resolution:", error);
    res.status(500).json({
      message: "Failed to fetch ticket resolution",
      error: error.message,
    });
  }
};
