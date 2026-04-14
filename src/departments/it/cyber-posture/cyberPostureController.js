import IT from "../../../utils/common/IT.js";

const _it = new IT();
const dummyPosture = [
  { label: 'Network', value: 80 },
  { label: 'Endpoint', value: 65 },
  { label: 'Application', value: 70 },
  { label: 'User', value: 60 },
  { label: 'Physical', value: 75 },
];
const dummyBenchmark = 56;

class CyberPostureController {
  async getCyberPosture(req, res) {
    try {
      let posture = dummyPosture;
      let benchmark = dummyBenchmark;
      try {
        const liveData = await _it.fetchLiveData('/it/cybersecurity');
        if (Array.isArray(liveData) && liveData.length > 0) posture = liveData;
      } catch (err) {
        console.warn('[CyberPosture] Live fetch failed, using dummy:', err.message);
      }
      res.status(200).json({
        success: true,
        data: posture,
        benchmark,
        message: 'Cybersecurity posture retrieved successfully',
      });
    } catch (error) {
      console.error('Cyber Posture Error:', error);
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve cybersecurity posture' } });
    }
  }
}

export default CyberPostureController;
