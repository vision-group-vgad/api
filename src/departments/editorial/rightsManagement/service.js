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
  }
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
