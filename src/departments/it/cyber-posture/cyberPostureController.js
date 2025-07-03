export const getCyberPosture = async (req, res) => {
  try {
    const labels = ['Network', 'Endpoint', 'Application', 'User', 'Physical'];
    const values = [80, 65, 70, 60, 75];
    const benchmark = 56;

    const posture = labels.map((label, index) => ({
      label,
      value: values[index],
    }));

    res.status(200).json({
      success: true,
      data: posture,
      benchmark,
      message: 'Cybersecurity posture retrieved successfully',
    });
  } catch (error) {
    console.error('Cyber Posture Error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve cybersecurity posture',
      },
    });
  }
};
