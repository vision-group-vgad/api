import ProcessThroughputService from "./process-service.js";

export default class ProcessThroughputController {
  async getInRangeTasks(startDate, endDate) {
    try {
      const tasks = await ProcessThroughputService.getInRangeTasks(startDate, endDate);
      return tasks;
    } catch (error) {
      console.error("Process Throughput Controller Error:", error);
      throw error;
    }
  }
}