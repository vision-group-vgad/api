export function generatePartsUtilization(count = 200) {
  const parts = [
    { id: "P001", name: "Compressor Coil" },
    { id: "P002", name: "Fan Belt" },
    { id: "P003", name: "Circuit Board" },
    { id: "P004", name: "Pipe Connector" },
    { id: "P005", name: "Sensor Module" },
  ];

  const equipmentTypes = ["HVAC", "Elevator", "Generator", "Plumbing", "IT Rack"];
  const jobTypes = ["Repair", "Routine Maintenance", "Emergency Fix", "Inspection"];

  const data = [];

  function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  for (let i = 0; i < count; i++) {
    const part = randomChoice(parts);
    const equipment = randomChoice(equipmentTypes);
    const jobType = randomChoice(jobTypes);

    data.push({
      partId: part.id,
      partName: part.name,
      equipmentType: equipment,
      jobId: `J-${String(i + 1).padStart(4, "0")}`,
      jobType,
      quantityUsed: Math.floor(Math.random() * 10) + 1 // 1–10 units
    });
  }

  return data;
}
