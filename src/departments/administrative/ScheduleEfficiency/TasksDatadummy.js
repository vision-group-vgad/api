// TasksDatadummy.js

/**
 * Each task now has subtasks.
 * completionPercentage is calculated as (completed subtasks / total subtasks) * 100
 */

const tasks = [
  {
    taskId: "T001",
    taskTitle: "Prepare Annual Report",
    assignedTo: "Executive Assistant",
    project: "Annual Strategy",
    dueDate: "2025-03-20",
    priority: "High",
    status: "In Progress",
    subtasks: [
      { title: "Draft Report", completed: true },
      { title: "Graphics & Charts", completed: true },
      { title: "Manager Review", completed: false },
      { title: "Final Approval", completed: false },
    ],
  },
  {
    taskId: "T002",
    taskTitle: "Budget Alignment",
    assignedTo: "Finance Manager",
    project: "Q1 Finance",
    dueDate: "2025-03-25",
    priority: "High",
    status: "Completed",
    subtasks: [
      { title: "Draft Budget", completed: true },
      { title: "Finance Review", completed: true },
      { title: "Management Approval", completed: true },
    ],
  },
  {
    taskId: "T003",
    taskTitle: "Vendor Contracts Review",
    assignedTo: "Procurement Officer",
    project: "Operations",
    dueDate: "2025-04-10",
    priority: "High",
    status: "In Progress",
    subtasks: [
      { title: "Collect Contracts", completed: true },
      { title: "Legal Review", completed: false },
      { title: "Management Approval", completed: false },
    ],
  },
  {
    taskId: "T004",
    taskTitle: "IT Security Audit",
    assignedTo: "IT Manager",
    project: "IT Infrastructure",
    dueDate: "2025-03-30",
    priority: "High",
    status: "In Progress",
    subtasks: [
      { title: "Preliminary Scan", completed: true },
      { title: "Vulnerability Assessment", completed: false },
      { title: "Report Findings", completed: false },
    ],
  },
  {
    taskId: "T005",
    taskTitle: "Marketing Campaign Launch",
    assignedTo: "Marketing Lead",
    project: "Campaign Q2",
    dueDate: "2025-09-15",
    priority: "High",
    status: "In Progress",
    subtasks: [
      { title: "Create Content", completed: true },
      { title: "Design Graphics", completed: false },
      { title: "Approve Budget", completed: true },
      { title: "Launch Ads", completed: false },
    ],
  },
];

/**
 * Compute completion percentage for each task based on subtasks
 */
tasks.forEach(task => {
  const total = task.subtasks.length;
  const completed = task.subtasks.filter(st => st.completed).length;
  task.completionPercentage = Math.round((completed / total) * 100);
});

export default tasks;


