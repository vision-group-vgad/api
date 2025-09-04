// Access Control for AI Analytics
// This module defines who can access what data based on user roles and departments

// Department hierarchy and access permissions
const DEPARTMENT_ACCESS_MATRIX = {
  // Executive level - can access all departments
  "executive": {
    allowedDepartments: ["finance", "editorial", "sales", "operations", "it", "administrative", "executive"],
    restrictions: [],
    description: "Full access to all analytics"
  },
  
  // Finance department access
  "finance": {
    allowedDepartments: ["finance", "executive"], // Can see finance and executive summaries
    restrictions: [
      "editorial.journalist_personal_data",
      "sales.client_personal_data", 
      "operations.employee_personal_data"
    ],
    crossDepartmentAccess: {
      "sales": ["revenue_metrics", "financial_performance"], // Can see sales revenue data
      "operations": ["cost_metrics", "budget_performance"]    // Can see operational costs
    },
    description: "Finance data + revenue/cost metrics from other departments"
  },
  
  // Editorial department access  
  "editorial": {
    allowedDepartments: ["editorial", "administrative"],
    restrictions: [
      "finance.detailed_financials",
      "sales.commission_data",
      "it.security_details"
    ],
    crossDepartmentAccess: {
      "sales": ["content_performance_metrics"], // How content performs in sales
      "administrative": ["content_workflow_metrics"]
    },
    description: "Editorial content data + content performance metrics"
  },
  
  // Sales department access
  "sales": {
    allowedDepartments: ["sales", "administrative"],
    restrictions: [
      "finance.detailed_financials",
      "editorial.unpublished_content",
      "it.infrastructure_details"
    ],
    crossDepartmentAccess: {
      "editorial": ["published_content_metrics", "content_engagement"],
      "finance": ["revenue_targets", "budget_allocations"]
    },
    description: "Sales data + content engagement + revenue targets"
  },
  
  // IT department access
  "it": {
    allowedDepartments: ["it", "administrative", "operations"],
    restrictions: [
      "finance.financial_details",
      "editorial.content_details", 
      "sales.client_data"
    ],
    crossDepartmentAccess: {
      "finance": ["system_costs", "infrastructure_budget"],
      "editorial": ["system_usage_metrics"],
      "sales": ["platform_performance_metrics"]
    },
    description: "IT infrastructure + system usage across departments"
  },
  
  // Operations department access
  "operations": {
    allowedDepartments: ["operations", "administrative"],
    restrictions: [
      "finance.detailed_financials",
      "editorial.editorial_decisions",
      "sales.sales_strategies"
    ],
    crossDepartmentAccess: {
      "finance": ["operational_costs", "budget_utilization"],
      "it": ["system_performance_metrics"]
    },
    description: "Operations data + operational costs + system performance"
  },
  
  // Administrative department access
  "administrative": {
    allowedDepartments: ["administrative", "operations"],
    restrictions: [
      "finance.sensitive_financials",
      "editorial.confidential_content",
      "sales.confidential_strategies"
    ],
    crossDepartmentAccess: {
      "finance": ["general_metrics", "public_reports"],
      "editorial": ["workflow_metrics", "productivity_metrics"],
      "sales": ["general_performance_metrics"],
      "it": ["general_system_metrics"]
    },
    description: "Administrative data + general metrics from all departments"
  }
};

// Position-based access levels
const POSITION_ACCESS_LEVELS = {
  // C-Level executives
  "ceo": { level: 10, canAccessAll: true },
  "cto": { level: 9, canAccessAll: true },
  "cfo": { level: 9, canAccessAll: true },
  "coo": { level: 9, canAccessAll: true },
  
  // Department heads
  "head of finance": { level: 8, enhancedDepartmentAccess: true },
  "head of editorial": { level: 8, enhancedDepartmentAccess: true },
  "head of sales": { level: 8, enhancedDepartmentAccess: true },
  "head of it": { level: 8, enhancedDepartmentAccess: true },
  "head of operations": { level: 8, enhancedDepartmentAccess: true },
  
  // Managers
  "financial controller": { level: 7, managerAccess: true },
  "finance manager": { level: 7, managerAccess: true },
  "editor in chief": { level: 7, managerAccess: true },
  "managing editor": { level: 7, managerAccess: true },
  "sales manager": { level: 7, managerAccess: true },
  "it manager": { level: 7, managerAccess: true },
  "operations manager": { level: 7, managerAccess: true },
  "administration manager": { level: 7, managerAccess: true },
  
  // Senior roles
  "senior accountant": { level: 6, seniorAccess: true },
  "principal accountant": { level: 6, seniorAccess: true },
  "senior editor": { level: 6, seniorAccess: true },
  "deputy editor": { level: 6, seniorAccess: true },
  "systems administrator": { level: 6, seniorAccess: true },
  
  // Regular roles
  "accountant": { level: 5, standardAccess: true },
  "assistant accountant": { level: 4, standardAccess: true },
  "editor": { level: 5, standardAccess: true },
  "sub editor": { level: 4, standardAccess: true },
  "reporter": { level: 4, standardAccess: true },
  "journalist": { level: 4, standardAccess: true },
  "it support": { level: 4, standardAccess: true },
  "technician": { level: 4, standardAccess: true }
};

/**
 * Check if user has access to a specific department's data
 * @param {Object} user - User info from JWT token
 * @param {string} requestedDepartment - Department being requested
 * @param {string} dataType - Type of data being requested
 * @returns {Object} - Access result with allowed/denied and reasons
 */
export function checkDepartmentAccess(user, requestedDepartment, dataType = "general") {
  const userDepartment = user.department?.toLowerCase();
  const userPosition = user.position?.toLowerCase();
  
  // Check if user info is available
  if (!userDepartment || !userPosition) {
    return {
      allowed: false,
      reason: "User department or position not found in token",
      accessLevel: "none"
    };
  }
  
  // Get user's access level based on position
  const positionAccess = POSITION_ACCESS_LEVELS[userPosition] || { level: 3, standardAccess: true };
  
  // C-Level executives can access everything
  if (positionAccess.canAccessAll) {
    return {
      allowed: true,
      reason: "Executive level access - full permissions",
      accessLevel: "full",
      userLevel: positionAccess.level
    };
  }
  
  // Get department access rules
  const departmentRules = DEPARTMENT_ACCESS_MATRIX[userDepartment];
  if (!departmentRules) {
    return {
      allowed: false,
      reason: `No access rules defined for department: ${userDepartment}`,
      accessLevel: "none"
    };
  }
  
  // Check if requesting own department data
  if (requestedDepartment === userDepartment) {
    return {
      allowed: true,
      reason: "Access to own department data",
      accessLevel: "full",
      userLevel: positionAccess.level
    };
  }
  
  // Check if department is in allowed list
  if (departmentRules.allowedDepartments.includes(requestedDepartment)) {
    return {
      allowed: true,
      reason: `Department ${requestedDepartment} is in allowed list for ${userDepartment}`,
      accessLevel: "standard",
      userLevel: positionAccess.level
    };
  }
  
  // Check cross-department access
  if (departmentRules.crossDepartmentAccess && 
      departmentRules.crossDepartmentAccess[requestedDepartment]) {
    
    const allowedDataTypes = departmentRules.crossDepartmentAccess[requestedDepartment];
    
    // Check if the specific data type is allowed
    const dataTypeAllowed = allowedDataTypes.some(allowedType => 
      dataType.includes(allowedType) || allowedType === "general_metrics"
    );
    
    if (dataTypeAllowed) {
      return {
        allowed: true,
        reason: `Cross-department access granted for ${dataType}`,
        accessLevel: "limited",
        userLevel: positionAccess.level,
        allowedDataTypes
      };
    }
  }
  
  // Department heads get enhanced access
  if (positionAccess.enhancedDepartmentAccess) {
    return {
      allowed: true,
      reason: "Department head - enhanced cross-department access",
      accessLevel: "enhanced",
      userLevel: positionAccess.level
    };
  }
  
  // Managers get some cross-department access
  if (positionAccess.managerAccess && positionAccess.level >= 7) {
    return {
      allowed: true,
      reason: "Manager level - limited cross-department access",
      accessLevel: "limited",
      userLevel: positionAccess.level
    };
  }
  
  // Access denied
  return {
    allowed: false,
    reason: `No access permission for ${userDepartment} user to access ${requestedDepartment} data`,
    accessLevel: "none",
    userLevel: positionAccess.level,
    suggestion: `Contact your manager or ${requestedDepartment} department for access`
  };
}

/**
 * Filter data based on user access level
 * @param {Array} data - Raw data to filter
 * @param {Object} accessResult - Result from checkDepartmentAccess
 * @param {Object} user - User info
 * @returns {Array} - Filtered data
 */
export function filterDataByAccess(data, accessResult, user) {
  if (!accessResult.allowed || !Array.isArray(data)) {
    return [];
  }
  
  // Full access - return all data
  if (accessResult.accessLevel === "full") {
    return data;
  }
  
  // Limited access - filter sensitive fields
  if (accessResult.accessLevel === "limited") {
    return data.map(item => {
      const filtered = { ...item };
      
      // Remove sensitive fields based on user department
      const sensitiveFields = getSensitiveFields(user.department);
      sensitiveFields.forEach(field => {
        if (filtered[field]) {
          delete filtered[field];
        }
      });
      
      return filtered;
    });
  }
  
  // Enhanced access - partial filtering
  if (accessResult.accessLevel === "enhanced") {
    return data.map(item => {
      const filtered = { ...item };
      
      // Only remove highly sensitive fields
      const highlySensitiveFields = getHighlySensitiveFields();
      highlySensitiveFields.forEach(field => {
        if (filtered[field]) {
          filtered[field] = "[RESTRICTED]";
        }
      });
      
      return filtered;
    });
  }
  
  return data;
}

/**
 * Get sensitive fields based on user department
 */
function getSensitiveFields(userDepartment) {
  const sensitiveFieldMap = {
    "editorial": ["salary", "commission", "personalInfo", "confidentialNotes"],
    "sales": ["editorialNotes", "internalComments", "systemPasswords"],
    "finance": ["personalData", "editorialContent", "salesStrategies"],
    "it": ["financialAmounts", "salaryInfo", "personalData"],
    "operations": ["financialDetails", "salesCommissions", "personalInfo"],
    "administrative": ["detailedFinancials", "personalSalaries", "confidentialNotes"]
  };
  
  return sensitiveFieldMap[userDepartment] || ["personalInfo", "salary", "confidentialNotes"];
}

/**
 * Get highly sensitive fields that should always be restricted
 */
function getHighlySensitiveFields() {
  return [
    "password", "apiKey", "secretKey", "personalId", "socialSecurityNumber",
    "bankAccountNumber", "creditCardNumber", "personalAddress", "phoneNumber"
  ];
}

/**
 * Generate access log entry
 */
export function logAccess(user, requestedDepartment, dataType, accessResult, timestamp = new Date()) {
  return {
    timestamp: timestamp.toISOString(),
    user: {
      email: user.email,
      department: user.department,
      position: user.position,
      name: `${user.firstName} ${user.lastName}`
    },
    request: {
      department: requestedDepartment,
      dataType: dataType
    },
    access: {
      allowed: accessResult.allowed,
      level: accessResult.accessLevel,
      reason: accessResult.reason
    }
  };
}
