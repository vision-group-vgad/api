// Dummy ticket dataset
// Dummy ticket dataset (30 records)
const tickets = [
  {
    ticketId: "TCK-001",
    category: "Hardware",
    priority: "High",
    responseSla: 30,
    resolutionSla: 240,
    responseTime: 25,
    resolutionTime: 180,
    agent: "Alice",
    createdAt: "2025-08-01T09:00:00Z",
    resolvedAt: "2025-08-01T12:00:00Z"
  },
  {
    ticketId: "TCK-002",
    category: "Network",
    priority: "Critical",
    responseSla: 15,
    resolutionSla: 120,
    responseTime: 20,
    resolutionTime: 200, // Breach
    agent: "Bob",
    createdAt: "2025-08-02T10:00:00Z",
    resolvedAt: "2025-08-02T13:20:00Z"
  },
  {
    ticketId: "TCK-003",
    category: "Software",
    priority: "Medium",
    responseSla: 60,
    resolutionSla: 480,
    responseTime: 40,
    resolutionTime: 300,
    agent: "Alice",
    createdAt: "2025-08-03T14:00:00Z",
    resolvedAt: "2025-08-03T19:00:00Z"
  },
  {
    ticketId: "TCK-004",
    category: "Access",
    priority: "Low",
    responseSla: 120,
    resolutionSla: 720,
    responseTime: 100,
    resolutionTime: 500,
    agent: "Charlie",
    createdAt: "2025-08-04T08:00:00Z",
    resolvedAt: "2025-08-04T16:20:00Z"
  },
  {
    ticketId: "TCK-005",
    category: "Hardware",
    priority: "Critical",
    responseSla: 15,
    resolutionSla: 120,
    responseTime: 10,
    resolutionTime: 90,
    agent: "Diana",
    createdAt: "2025-08-05T07:00:00Z",
    resolvedAt: "2025-08-05T08:30:00Z"
  },
  {
    ticketId: "TCK-006",
    category: "Software",
    priority: "High",
    responseSla: 30,
    resolutionSla: 240,
    responseTime: 28,
    resolutionTime: 250, // Breach
    agent: "Bob",
    createdAt: "2025-08-06T09:00:00Z",
    resolvedAt: "2025-08-06T13:10:00Z"
  },
  {
    ticketId: "TCK-007",
    category: "Network",
    priority: "Medium",
    responseSla: 60,
    resolutionSla: 480,
    responseTime: 50,
    resolutionTime: 470,
    agent: "Alice",
    createdAt: "2025-08-07T10:00:00Z",
    resolvedAt: "2025-08-07T18:00:00Z"
  },
  {
    ticketId: "TCK-008",
    category: "Access",
    priority: "Low",
    responseSla: 120,
    resolutionSla: 720,
    responseTime: 140,
    resolutionTime: 600,
    agent: "Charlie",
    createdAt: "2025-08-08T11:00:00Z",
    resolvedAt: "2025-08-08T20:00:00Z"
  },
  {
    ticketId: "TCK-009",
    category: "Hardware",
    priority: "High",
    responseSla: 30,
    resolutionSla: 240,
    responseTime: 20,
    resolutionTime: 150,
    agent: "Diana",
    createdAt: "2025-08-09T09:00:00Z",
    resolvedAt: "2025-08-09T11:30:00Z"
  },
  {
    ticketId: "TCK-010",
    category: "Software",
    priority: "Critical",
    responseSla: 15,
    resolutionSla: 120,
    responseTime: 12,
    resolutionTime: 100,
    agent: "Bob",
    createdAt: "2025-08-10T07:30:00Z",
    resolvedAt: "2025-08-10T09:10:00Z"
  },
  {
    ticketId: "TCK-011",
    category: "Network",
    priority: "High",
    responseSla: 30,
    resolutionSla: 240,
    responseTime: 40,
    resolutionTime: 300, // Breach
    agent: "Alice",
    createdAt: "2025-08-11T08:00:00Z",
    resolvedAt: "2025-08-11T13:30:00Z"
  },
  {
    ticketId: "TCK-012",
    category: "Access",
    priority: "Medium",
    responseSla: 60,
    resolutionSla: 480,
    responseTime: 45,
    resolutionTime: 400,
    agent: "Charlie",
    createdAt: "2025-08-12T09:15:00Z",
    resolvedAt: "2025-08-12T16:00:00Z"
  },
  {
    ticketId: "TCK-013",
    category: "Hardware",
    priority: "Low",
    responseSla: 120,
    resolutionSla: 720,
    responseTime: 90,
    resolutionTime: 710,
    agent: "Diana",
    createdAt: "2025-08-13T10:00:00Z",
    resolvedAt: "2025-08-13T21:00:00Z"
  },
  {
    ticketId: "TCK-014",
    category: "Software",
    priority: "Critical",
    responseSla: 15,
    resolutionSla: 120,
    responseTime: 25, // Breach
    resolutionTime: 150, // Breach
    agent: "Bob",
    createdAt: "2025-08-14T07:00:00Z",
    resolvedAt: "2025-08-14T09:45:00Z"
  },
  {
    ticketId: "TCK-015",
    category: "Network",
    priority: "High",
    responseSla: 30,
    resolutionSla: 240,
    responseTime: 22,
    resolutionTime: 200,
    agent: "Alice",
    createdAt: "2025-08-15T08:30:00Z",
    resolvedAt: "2025-08-15T12:00:00Z"
  },
  {
    ticketId: "TCK-016",
    category: "Access",
    priority: "Medium",
    responseSla: 60,
    resolutionSla: 480,
    responseTime: 50,
    resolutionTime: 470,
    agent: "Charlie",
    createdAt: "2025-08-16T09:00:00Z",
    resolvedAt: "2025-08-16T17:30:00Z"
  },
  {
    ticketId: "TCK-017",
    category: "Hardware",
    priority: "Critical",
    responseSla: 15,
    resolutionSla: 120,
    responseTime: 10,
    resolutionTime: 110,
    agent: "Diana",
    createdAt: "2025-08-17T06:00:00Z",
    resolvedAt: "2025-08-17T07:50:00Z"
  },
  {
    ticketId: "TCK-018",
    category: "Software",
    priority: "Low",
    responseSla: 120,
    resolutionSla: 720,
    responseTime: 100,
    resolutionTime: 600,
    agent: "Bob",
    createdAt: "2025-08-18T09:00:00Z",
    resolvedAt: "2025-08-18T19:00:00Z"
  },
  {
    ticketId: "TCK-019",
    category: "Network",
    priority: "Medium",
    responseSla: 60,
    resolutionSla: 480,
    responseTime: 55,
    resolutionTime: 450,
    agent: "Alice",
    createdAt: "2025-08-19T10:00:00Z",
    resolvedAt: "2025-08-19T17:30:00Z"
  },
  {
    ticketId: "TCK-020",
    category: "Access",
    priority: "High",
    responseSla: 30,
    resolutionSla: 240,
    responseTime: 20,
    resolutionTime: 180,
    agent: "Charlie",
    createdAt: "2025-08-20T09:00:00Z",
    resolvedAt: "2025-08-20T12:00:00Z"
  },
  {
    ticketId: "TCK-021",
    category: "Hardware",
    priority: "Critical",
    responseSla: 15,
    resolutionSla: 120,
    responseTime: 12,
    resolutionTime: 130, // Breach
    agent: "Alice",
    createdAt: "2025-08-21T07:00:00Z",
    resolvedAt: "2025-08-21T09:10:00Z"
  },
  {
    ticketId: "TCK-022",
    category: "Software",
    priority: "High",
    responseSla: 30,
    resolutionSla: 240,
    responseTime: 35, // Breach
    resolutionTime: 260, // Breach
    agent: "Diana",
    createdAt: "2025-08-22T08:30:00Z",
    resolvedAt: "2025-08-22T13:45:00Z"
  },
  {
    ticketId: "TCK-023",
    category: "Network",
    priority: "Low",
    responseSla: 120,
    resolutionSla: 720,
    responseTime: 100,
    resolutionTime: 700,
    agent: "Bob",
    createdAt: "2025-08-23T09:00:00Z",
    resolvedAt: "2025-08-23T21:00:00Z"
  },
  {
    ticketId: "TCK-024",
    category: "Access",
    priority: "Critical",
    responseSla: 15,
    resolutionSla: 120,
    responseTime: 18,
    resolutionTime: 115,
    agent: "Charlie",
    createdAt: "2025-08-24T06:30:00Z",
    resolvedAt: "2025-08-24T08:20:00Z"
  },
  {
    ticketId: "TCK-025",
    category: "Hardware",
    priority: "Medium",
    responseSla: 60,
    resolutionSla: 480,
    responseTime: 40,
    resolutionTime: 460,
    agent: "Alice",
    createdAt: "2025-08-25T09:00:00Z",
    resolvedAt: "2025-08-25T16:30:00Z"
  },
  {
    ticketId: "TCK-026",
    category: "Software",
    priority: "Low",
    responseSla: 120,
    resolutionSla: 720,
    responseTime: 100,
    resolutionTime: 710,
    agent: "Diana",
    createdAt: "2025-08-26T10:00:00Z",
    resolvedAt: "2025-08-26T21:00:00Z"
  },
  {
    ticketId: "TCK-027",
    category: "Network",
    priority: "Critical",
    responseSla: 15,
    resolutionSla: 120,
    responseTime: 14,
    resolutionTime: 118,
    agent: "Charlie",
    createdAt: "2025-08-27T07:00:00Z",
    resolvedAt: "2025-08-27T08:58:00Z"
  },
  {
    ticketId: "TCK-028",
    category: "Access",
    priority: "High",
    responseSla: 30,
    resolutionSla: 240,
    responseTime: 28,
    resolutionTime: 230,
    agent: "Bob",
    createdAt: "2025-08-28T09:00:00Z",
    resolvedAt: "2025-08-28T12:50:00Z"
  },
  {
    ticketId: "TCK-029",
    category: "Hardware",
    priority: "Medium",
    responseSla: 60,
    resolutionSla: 480,
    responseTime: 50,
    resolutionTime: 490, // Breach
    agent: "Alice",
    createdAt: "2025-08-29T10:00:00Z",
    resolvedAt: "2025-08-29T18:20:00Z"
  },
  {
    ticketId: "TCK-030",
    category: "Software",
    priority: "Low",
    responseSla: 120,
    resolutionSla: 720,
    responseTime: 110,
    resolutionTime: 650,
    agent: "Charlie",
    createdAt: "2025-08-30T11:00:00Z",
    resolvedAt: "2025-08-30T20:50:00Z"
  }
];

// Utility: check if SLA met
const checkSlaCompliance = (ticket) => ({
  ...ticket,
  responseMet: ticket.responseTime <= ticket.responseSla,
  resolutionMet: ticket.resolutionTime <= ticket.resolutionSla
});

// Get overall SLA compliance %
export const getSlaOverview = () => {
  const evaluated = tickets.map(checkSlaCompliance);
  const total = evaluated.length;

  const responseCompliance = (evaluated.filter(t => t.responseMet).length / total) * 100;
  const resolutionCompliance = (evaluated.filter(t => t.resolutionMet).length / total) * 100;

  const avgResolutionTime = evaluated.reduce((sum, t) => sum + t.resolutionTime, 0) / total;

  return {
    totalTickets: total,
    responseCompliance: responseCompliance.toFixed(1),
    resolutionCompliance: resolutionCompliance.toFixed(1),
    avgResolutionTime: avgResolutionTime.toFixed(1)
  };
};

// SLA compliance by priority
export const getSlaByPriority = () => {
  const evaluated = tickets.map(checkSlaCompliance);
  const grouped = {};

  evaluated.forEach(ticket => {
    if (!grouped[ticket.priority]) {
      grouped[ticket.priority] = { total: 0, met: 0 };
    }
    grouped[ticket.priority].total++;
    if (ticket.resolutionMet) grouped[ticket.priority].met++;
  });

  return Object.entries(grouped).map(([priority, stats]) => ({
    priority,
    compliance: ((stats.met / stats.total) * 100).toFixed(1)
  }));
};

// Agent performance
export const getSlaByAgent = () => {
  const evaluated = tickets.map(checkSlaCompliance);
  const grouped = {};

  evaluated.forEach(ticket => {
    if (!grouped[ticket.agent]) {
      grouped[ticket.agent] = { total: 0, met: 0, totalTime: 0 };
    }
    grouped[ticket.agent].total++;
    if (ticket.resolutionMet) grouped[ticket.agent].met++;
    grouped[ticket.agent].totalTime += ticket.resolutionTime;
  });

  return Object.entries(grouped).map(([agent, stats]) => ({
    agent,
    compliance: ((stats.met / stats.total) * 100).toFixed(1),
    avgResolutionTime: (stats.totalTime / stats.total).toFixed(1)
  }));
};
