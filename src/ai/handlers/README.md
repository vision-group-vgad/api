# AI Handlers

This directory contains modularized handlers for different department queries in the AI service.

## Structure

- `baseHandler.js` - Common utilities and API request functions used by all handlers
- `financeHandler.js` - Handles all finance department queries
- `salesHandler.js` - Handles all sales department queries  
- `editorialHandler.js` - Handles all editorial department queries
- `operationsHandler.js` - Handles all operations department queries
- `itHandler.js` - Handles all IT department queries
- `administrativeHandler.js` - Handles all administrative department queries
- `executiveHandler.js` - Handles all executive department queries
- `specializedHandler.js` - Handles all specialized department queries (HR, legal, compliance, etc.)
- `legacyHandler.js` - Handles legacy intents for backward compatibility
- `index.js` - Exports all handlers for easy importing

## Usage

Each handler exports a single function that takes the same parameters:
- `intent` - The AI-classified intent
- `filters` - Query filters and parameters
- `token` - Authentication token
- `roleCode` - User role code

## Benefits of Modularization

1. **Better maintainability** - Each department's logic is isolated
2. **Easier debugging** - Issues can be traced to specific handlers
3. **Improved readability** - Smaller, focused files are easier to understand
4. **Team collaboration** - Different developers can work on different handlers
5. **Testing** - Each handler can be unit tested independently

## Adding New Handlers

To add a new department handler:

1. Create a new file `[department]Handler.js`
2. Import common utilities from `baseHandler.js`
3. Export a function following the same pattern as existing handlers
4. Add the export to `index.js`
5. Import and use in the main `aiServices.js` file