import breakingNewsService from "./service.js";

class BreakingNewsController {
  async getBreakingNewsTraction(req, res) {
    try {
      const { startDate, endDate, limit = 50, offset = 0 } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: "startDate and endDate are required",
        });
      }

      const tractionData = await breakingNewsService.getBreakingNewsTraction({
        startDate,
        endDate,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        success: true,
        data: tractionData.articles,
        meta: {
          total: tractionData.total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          summary: tractionData.summary,
        },
      });
    } catch (error) {
      
      res.status(500).json({
        error: "Failed to fetch breaking news traction data",
        message: error.message,
      });
    }
  }

  async getBreakingNewsMetrics(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const metrics = await breakingNewsService.getAggregatedMetrics({
        startDate,
        endDate,
      });

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error("Breaking news metrics error:", error);
      res.status(500).json({
        error: "Failed to fetch breaking news metrics",
        message: error.message,
      });
    }
  }

  async getRealTimeBreakingNews(req, res) {
    try {
      const realTimeData = await breakingNewsService.getCurrentBreakingNews();

      res.json({
        success: true,
        data: realTimeData,
      });
    } catch (error) {
      

      res.status(500).json({
        error: "Failed to fetch real-time breaking news data",
        message: error.message,
      });
    }
  }
}

export default new BreakingNewsController();
