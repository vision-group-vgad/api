import OpsProduction from "../../../utils/common/OpsProduction.js";
import machines from "./dummy-data.js";

class FuelConsumptionController {
  #fuelConsumption;
  constructor() {
    this.#fuelConsumption = new OpsProduction();
  }

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );

    const machines = this.#getUniqueMachines(data);
    const avgLiters = this.#getAverageLitersPerDay(data);
    const exetremeDrivers = this.#getOperatorFuelExtremes(data);
    const extremeMachines = this.#getMachineFuelExtremes(data);

    return {
      data: filteredData,
      summary: {
        machines: machines,
        most_fuel_cons_driver: exetremeDrivers.mostFuelOperator,
        least_fuel_cons_driver: exetremeDrivers.leastFuelOperator,
        most_fuel_cons_machine: extremeMachines.mostFuelMachine,
        least_fuel_cons_machine: extremeMachines.leastFuelMachine,
        avg_daily_liters: avgLiters,
      },
    };
  }

  #getMachineFuelExtremes(data) {
    const fuelPerMachine = {};

    data.forEach((record) => {
      if (!fuelPerMachine[record.machine]) {
        fuelPerMachine[record.machine] = 0;
      }
      fuelPerMachine[record.machine] += record.fuel_consumed_l;
    });

    const entries = Object.entries(fuelPerMachine).map(([machine, fuel]) => ({
      machine,
      fuel,
    }));
    entries.sort((a, b) => b.fuel - a.fuel);

    return {
      mostFuelMachine: entries[0],
      leastFuelMachine: entries[entries.length - 1],
    };
  }

  #getOperatorFuelExtremes(data) {
    const fuelPerOperator = {};

    data.forEach((record) => {
      if (!fuelPerOperator[record.operator]) {
        fuelPerOperator[record.operator] = 0;
      }
      fuelPerOperator[record.operator] += record.fuel_consumed_l;
    });

    const entries = Object.entries(fuelPerOperator).map(([operator, fuel]) => ({
      operator,
      fuel,
    }));
    entries.sort((a, b) => b.fuel - a.fuel);

    return {
      mostFuelOperator: entries[0],
      leastFuelOperator: entries[entries.length - 1],
    };
  }

  #getAverageLitersPerDay(data) {
    const fuelPerDay = {};

    data.forEach((record) => {
      if (!fuelPerDay[record.date]) {
        fuelPerDay[record.date] = 0;
      }
      fuelPerDay[record.date] += record.fuel_consumed_l;
    });

    const days = Object.keys(fuelPerDay).length;
    const totalFuel = Object.values(fuelPerDay).reduce(
      (sum, liters) => sum + liters,
      0
    );
    return Number((totalFuel / days).toFixed(2));
  }

  #getUniqueMachines(data) {
    return [...new Set(data.map((record) => record.machine))];
  }

  async getInRangeAnalytics(startDate, endDate) {
    let data;
    try {
      const result = await this.#fuelConsumption.fetchModuleData('fuel-consumption', startDate, endDate);
      data = result.data;
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('[FuelConsumption] Live data empty, falling back to dummy data');
        data = machines;
      }
    } catch (error) {
      console.warn('[FuelConsumption] Live data fetch failed, using dummy data:', error.message);
      data = machines;
    }
    const processedAnalytics = this.#processData(data, startDate, endDate);
    return processedAnalytics;
  }
}

export default FuelConsumptionController;
