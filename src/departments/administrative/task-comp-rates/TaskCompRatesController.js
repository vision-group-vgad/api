import AdminSup from "../../../utils/common/AdminSup.js";
import { data } from "./tasks-dummy.js";

class TaskCompRatesController {
  #adminSup;
  constructor() {
    this.#adminSup = new AdminSup();
  }

  #processAnalytics() {}

  async getInRangeAnalytics(startDate, endDate) {
    return data;
  }
}

export default TaskCompRatesController;
