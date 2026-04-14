// src/departments/editorial/editorialAnalytics/editorialAnalyticsUtils.js

export function formatDuration(seconds) {
  // Example: convert seconds to HH:MM:SS
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// src/departments/editorial/editorialAnalytics/editorialAnalyticsUtils.js

// Format data for a bar chart (e.g. platform engagement or content ROI)
export function formatEditorialBarChart(data, labelKey = 'platform', valueKey = 'engagementCount') {
  return data.map(item => ({
    label: item[labelKey] || 'Unknown',
    value: parseFloat(item[valueKey]) || 0,
  }));
}

// Format data for a line chart (e.g. engagement trend, scroll trend)
export function formatEditorialLineChart(data, labelKey = 'date', valueKey = 'value') {
  return data.map(item => ({
    date: item[labelKey],
    value: parseFloat(item[valueKey]) || 0,
  }));
}

// Format data for pie chart (e.g. platform/device/content ROI share)
export function formatEditorialPieChart(data, labelKey = 'category', valueKey = 'total') {
  return data.map(item => ({
    name: item[labelKey],
    value: parseFloat(item[valueKey]) || 0,
  }));
}

// Format audience demographics (e.g. top countries, gender distribution)
export function formatAudienceDemographics(data, type = 'country') {
  switch (type) {
    case 'gender':
      return data.map(item => ({
        gender: item.gender,
        value: parseFloat(item.count || item.value) || 0,
      }));

    case 'age':
      return data.map(item => ({
        ageGroup: item.ageRange || 'Unknown',
        value: parseFloat(item.count || item.value) || 0,
      }));

    default:
      return data.map(item => ({
        country: item.country || item.location || 'Unknown',
        value: parseFloat(item.count || item.value) || 0,
      }));
  }
}

// Utility: Group data by a key (e.g. date, platform)
export function groupDataByKey(data, key) {
  return data.reduce((result, item) => {
    const groupKey = item[key] || 'Unknown';
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {});
}
