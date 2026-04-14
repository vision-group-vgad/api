export const visitorPatternsDummy = {
  totalVisitors: 280,
  filters: { department: "All", visitorType: "All" },
  peakHours: [
    { hour: 8, visits: 12 },
    { hour: 9, visits: 34 },
    { hour: 10, visits: 45 },
    { hour: 11, visits: 38 },
    { hour: 14, visits: 41 },
    { hour: 15, visits: 29 },
  ],
  peakDays: [
    { day: "Monday", visits: 58 },
    { day: "Tuesday", visits: 52 },
    { day: "Wednesday", visits: 47 },
    { day: "Thursday", visits: 61 },
    { day: "Friday", visits: 44 },
    { day: "Saturday", visits: 12 },
    { day: "Sunday", visits: 6 },
  ],
  departmentVisitTypeStats: [
    { department: "Administration", visitTypes: [{ type: "Guest", count: 45 }, { type: "Vendor", count: 20 }] },
    { department: "HR", visitTypes: [{ type: "Applicant", count: 38 }, { type: "Guest", count: 15 }] },
    { department: "IT", visitTypes: [{ type: "Vendor", count: 28 }, { type: "Guest", count: 10 }] },
  ],
  excessiveWaitThreshold: 10,
  excessiveWaitCount: 38,
  excessiveWaitPercentage: 13.6,
  visitors: [
    { Visitor_ID: "V1001", Visit_Date: "2025-03-10", Visit_Type: "Guest", Arrival_Time: "09:15:00", Check_In_Time: "09:22:00", Department_Visited: "Administration", Host_Staff_Name: "Staff 1", Visit_Purpose: "Meeting" },
    { Visitor_ID: "V1002", Visit_Date: "2025-03-10", Visit_Type: "Vendor", Arrival_Time: "10:05:00", Check_In_Time: "10:18:00", Department_Visited: "IT", Host_Staff_Name: "Staff 3", Visit_Purpose: "Delivery" },
    { Visitor_ID: "V1003", Visit_Date: "2025-03-11", Visit_Type: "Applicant", Arrival_Time: "08:50:00", Check_In_Time: "09:00:00", Department_Visited: "HR", Host_Staff_Name: "Staff 7", Visit_Purpose: "Interview" },
  ],
};
