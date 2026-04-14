const dummyRightsData = [
  {
    assetId: "img-101",
    assetType: "photo",
    title: "City skyline",
    license: {
      source: "Getty Images",
      terms: "Editorial use only",
      expiresOn: "2025-09-15",
      attribution: "Photo by John Smith/Getty",
      status: "valid"
    },
    violations: []
  },
  {
    assetId: "vid-203",
    assetType: "video",
    title: "Wildlife in Uganda",
    license: {
      source: "Shutterstock",
      terms: "Royalty-free",
      expiresOn: "2025-06-30",
      attribution: "Video courtesy of Shutterstock",
      status: "expired"
    },
    violations: ["Used in sponsored content after license expiry"]
  },
  {
    assetId: "img-404",
    assetType: "photo",
    title: "Parliament Building",
    license: {
      source: "Unsplash",
      terms: "Free to use with attribution",
      expiresOn: "2026-01-01",
      attribution: "Photo by Alice on Unsplash",
      status: "valid"
    },
    violations: ["Missing attribution in 2 articles"]
  },
  {
    assetId: "vid-500",
    assetType: "video",
    title: "Protest footage",
    license: {
      source: "AFP News",
      terms: "Broadcast use only",
      expiresOn: "2025-08-15",
      attribution: "AFP Video",
      status: "warning"
    },
    violations: ["Used on social media platform"]
  },
  { assetId: "img-105", 
    assetType: "photo", 
    title: "Sunset over Nile", 
    license: { 
      source: "Pixabay", 
      terms: "Free for commercial use", 
      expiresOn: "2026-02-28", 
      attribution: "Photo by Liam on Pixabay", 
      status: "valid" }, violations: [] },
  { assetId: "vid-206", 
    assetType: "video", 
    title: "Local market tour", 
    license: { 
      source: "iStock", 
      terms: "Editorial use only", 
      expiresOn: "2025-09-01", 
      attribution: "Video by Jane Doe/iStock", 
      status: "warning" }, 
      violations: ["Used in social media without approval"] },
  { assetId: "img-407", assetType: "photo", title: "Rainy street Kampala", license: { source: "Getty Images", terms: "Editorial use only", expiresOn: "2025-10-30", attribution: "Photo by John Smith/Getty", status: "valid" }, violations: [] },
  { assetId: "vid-508", assetType: "video", title: "Uganda wildlife safari", license: { source: "Shutterstock", terms: "Royalty-free", expiresOn: "2025-12-15", attribution: "Video by Shutterstock", status: "valid" }, violations: [] },
  { assetId: "ill-111", assetType: "illustration", title: "Infographic on COVID-19", license: { source: "Freepik", terms: "Attribution required", expiresOn: "2026-01-10", attribution: "Illustration by Freepik", status: "valid" }, violations: ["Used in internal presentation without attribution"] },
  { assetId: "img-118", assetType: "photo", title: "Mountain Gorilla closeup", license: { source: "Getty Images", terms: "Editorial use only", expiresOn: "2025-08-31", attribution: "Photo by Jane Smith/Getty", status: "valid" }, violations: [] },
  { assetId: "vid-210", assetType: "video", title: "Uganda Independence Parade", license: { source: "AFP News", terms: "Broadcast use only", expiresOn: "2025-11-01", attribution: "AFP Video", status: "valid" }, violations: [] },
  { assetId: "img-121", assetType: "photo", title: "Victoria Nile Rapids", license: { source: "Shutterstock", terms: "Royalty-free", expiresOn: "2025-07-15", attribution: "Photo by Shutterstock", status: "expired" }, violations: ["Used in blog after expiry"] },
  { assetId: "vid-212", assetType: "video", title: "Traditional dance performance", license: { source: "iStock", terms: "Editorial use only", expiresOn: "2025-10-20", attribution: "Video by iStock", status: "valid" }, violations: [] },
  { assetId: "ill-115", assetType: "illustration", title: "Economic stats chart", license: { source: "Adobe Stock", terms: "Royalty-free", expiresOn: "2026-03-10", attribution: "Illustration by Adobe Stock", status: "valid" }, violations: [] },
  { assetId: "img-123", assetType: "photo", title: "Lake Bunyonyi view", license: { source: "Pixabay", terms: "Free for commercial use", expiresOn: "2026-08-20", attribution: "Photo by Mark on Pixabay", status: "valid" }, violations: [] },
  { assetId: "vid-214", assetType: "video", title: "City traffic timelapse", license: { source: "Shutterstock", terms: "Royalty-free", expiresOn: "2025-09-30", attribution: "Video by Shutterstock", status: "valid" }, violations: [] },
  { assetId: "ill-117", assetType: "illustration", title: "Infographic of election results", license: { source: "Freepik", terms: "Attribution required", expiresOn: "2026-04-05", attribution: "Illustration by Freepik", status: "valid" }, violations: ["Used in article without credit"] },
  { assetId: "img-125", assetType: "photo", title: "Kabale Hills sunrise", license: { source: "Getty Images", terms: "Editorial use only", expiresOn: "2025-12-25", attribution: "Photo by John Smith/Getty", status: "valid" }, violations: [] },
  { assetId: "vid-216", assetType: "video", title: "Local football match", license: { source: "AFP News", terms: "Broadcast use only", expiresOn: "2025-08-31", attribution: "AFP Video", status: "warning" }, violations: ["Used on social media without permission"] },
  { assetId: "ill-119", assetType: "illustration", title: "Climate change infographic", license: { source: "Adobe Stock", terms: "Royalty-free", expiresOn: "2026-07-15", attribution: "Illustration by Adobe Stock", status: "valid" }, violations: [] },
  { assetId: "img-127", assetType: "photo", title: "Queen Elizabeth National Park", license: { source: "Shutterstock", terms: "Royalty-free", expiresOn: "2025-11-30", attribution: "Photo by Shutterstock", status: "valid" }, violations: [] },
  { assetId: "vid-218", assetType: "video", title: "Lake Mburo wildlife", license: { source: "iStock", terms: "Editorial use only", expiresOn: "2025-12-10", attribution: "Video by iStock", status: "valid" }, violations: [] },
  { assetId: "ill-121", assetType: "illustration", title: "Population growth chart", license: { source: "Freepik", terms: "Attribution required", expiresOn: "2026-05-01", attribution: "Illustration by Freepik", status: "valid" }, violations: [] },
  { assetId: "img-129", assetType: "photo", title: "Murchison Falls view", license: { source: "Getty Images", terms: "Editorial use only", expiresOn: "2025-12-05", attribution: "Photo by Jane Smith/Getty", status: "valid" }, violations: [] },
  { assetId: "vid-220", assetType: "video", title: "Traditional music concert", license: { source: "Shutterstock", terms: "Royalty-free", expiresOn: "2025-11-15", attribution: "Video by Shutterstock", status: "valid" }, violations: [] },
  { assetId: "ill-123", assetType: "illustration", title: "Water usage infographic", license: { source: "Adobe Stock", terms: "Royalty-free", expiresOn: "2026-02-20", attribution: "Illustration by Adobe Stock", status: "valid" }, violations: [] },
  { assetId: "img-131", assetType: "photo", title: "Ssese Islands view", license: { source: "Pixabay", terms: "Free for commercial use", expiresOn: "2026-09-10", attribution: "Photo by Liam on Pixabay", status: "valid" }, violations: [] },
  { assetId: "vid-222", assetType: "video", title: "Local wedding highlights", license: { source: "iStock", terms: "Editorial use only", expiresOn: "2025-12-20", attribution: "Video by iStock", status: "valid" }, violations: [] },
  { assetId: "ill-125", assetType: "illustration", title: "Renewable energy chart", license: { source: "Freepik", terms: "Attribution required", expiresOn: "2026-06-05", attribution: "Illustration by Freepik", status: "valid" }, violations: [] }
];

export const fetchRightsData = async ({ status, type }) => {
  let data = [...dummyRightsData];

  if (status) {
    data = data.filter(asset => asset.license.status === status);
  }

  if (type) {
    data = data.filter(asset => asset.assetType === type);
  }

  return data;
};
