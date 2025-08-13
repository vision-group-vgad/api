import AdminSup from "../../../utils/common/AdminSup.js";
import { dummyTasks } from "./process-dummy.js";

class ProcessThrController {
  #adminSup;
  constructor() {
    this.#adminSup = new AdminSup();
  }

  #processTasks(tasks) {}

  async getInRangeTasks(startDate, endDate) {
    return dummyTasks;
  }
}
export default ProcessThrController;
