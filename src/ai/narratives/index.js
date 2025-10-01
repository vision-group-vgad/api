// Narrative generators index
// Exports all department-specific narrative generators

import { BaseNarrative } from './baseNarrative.js';
import { SalesNarrative } from './salesNarrative.js';
import { FinanceNarrative } from './financeNarrative.js';

export { BaseNarrative } from './baseNarrative.js';
export { SalesNarrative } from './salesNarrative.js';
export { FinanceNarrative } from './financeNarrative.js';

// For now, we'll use the base narrative for other departments
// These can be expanded later with specific implementations
export { BaseNarrative as EditorialNarrative } from './baseNarrative.js';
export { BaseNarrative as ExecutiveNarrative } from './baseNarrative.js';
export { BaseNarrative as AdministrativeNarrative } from './baseNarrative.js';
export { BaseNarrative as OperationsNarrative } from './baseNarrative.js';
export { BaseNarrative as ITNarrative } from './baseNarrative.js';
export { BaseNarrative as SpecializedNarrative } from './baseNarrative.js';

/**
 * Factory function to get the appropriate narrative generator for a department
 * @param {string} department - The department name
 * @returns {BaseNarrative} The narrative generator instance
 */
export function getNarrativeGenerator(department) {
  switch (department?.toLowerCase()) {
    case 'sales':
      return new SalesNarrative();
    case 'finance':
      return new FinanceNarrative();
    case 'editorial':
      return new BaseNarrative('editorial');
    case 'executive':
      return new BaseNarrative('executive');
    case 'administrative':
      return new BaseNarrative('administrative');
    case 'operations':
      return new BaseNarrative('operations');
    case 'it':
      return new BaseNarrative('it');
    case 'specialized':
      return new BaseNarrative('specialized');
    default:
      return new BaseNarrative(department || 'general');
  }
}