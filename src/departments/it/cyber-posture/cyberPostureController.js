export const getCyberPosture = async (req, res) => {
    // Define your data
    const labels = ['Network', 'Endpoint', 'Application', 'User', 'Physical'];
    const values = [80, 65, 70, 60, 75];
    const benchmark = 56;
  
    // Pair them into a single array of objects
    const postureData = labels.map((label, index) => ({
      label,
      value: values[index],
    }));
  
    // Respond with structured data
    res.json({
      data: postureData,
      benchmark,
    });
  };
  