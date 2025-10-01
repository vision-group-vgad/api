// Export all department handlers
export { handleFinanceQueries } from './financeHandler.js';
export { handleSalesQueries } from './salesHandler.js';
export { handleEditorialQueries } from './editorialHandler.js';
export { handleOperationsQueries } from './operationsHandler.js';
export { handleITQueries } from './itHandler.js';
export { handleAdministrativeQueries } from './administrativeHandler.js';
export { handleExecutiveQueries } from './executiveHandler.js';
export { handleSpecializedQueries } from './specializedHandler.js';
export { handleLegacyIntents } from './legacyHandler.js';

// Export base utilities
export { makeAPIRequestGET, getEndpoint, getEndpointWithDates } from './baseHandler.js';