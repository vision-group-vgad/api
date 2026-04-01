import TaskCompRatesService from "./TaskCompRatesService.js";

export default class TaskCompRatesController {
  async getInRangeAnalytics(startDate, endDate) {
    try {
      const data = await TaskCompRatesService.getInRangeAnalytics(
        startDate,
        endDate
      );

      return data;

    } catch (error) {
      console.error("Task Completion Controller Error:", error);
      throw error;
    }
  }
}