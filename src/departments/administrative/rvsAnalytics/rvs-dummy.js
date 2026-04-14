export const rvsDummy = {
  resources: {
    totalResources: 85,
    allocatedResources: 68,
    availableResources: 17,
    utilizationRate: "80%",
    items: [
      { resourceId: "R001", name: "Conference Room A", type: "Venue", status: "Allocated", department: "Administration" },
      { resourceId: "R002", name: "Projector Unit 1", type: "Equipment", status: "Available", department: "IT" },
      { resourceId: "R003", name: "Company Vehicle 3", type: "Vehicle", status: "Allocated", department: "Operations" },
    ],
  },
  venues: {
    totalVenues: 12,
    bookedVenues: 8,
    availableVenues: 4,
    bookingRate: "67%",
    items: [
      { venueId: "V001", name: "Board Room", capacity: 20, status: "Booked", date: "2025-03-15" },
      { venueId: "V002", name: "Training Hall", capacity: 50, status: "Available", date: null },
      { venueId: "V003", name: "Meeting Room B", capacity: 10, status: "Booked", date: "2025-03-16" },
    ],
  },
  suppliers: {
    totalSuppliers: 34,
    activeSuppliers: 28,
    inactiveSuppliers: 6,
    items: [
      { supplierId: "S001", name: "Office Supplies Co.", category: "Stationery", status: "Active", rating: 4.5 },
      { supplierId: "S002", name: "Tech Equipment Ltd.", category: "Electronics", status: "Active", rating: 4.2 },
      { supplierId: "S003", name: "Cleaning Services Uganda", category: "Facilities", status: "Active", rating: 3.8 },
    ],
  },
};
