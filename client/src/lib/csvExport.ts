/**
 * Utility functions for exporting data to CSV format
 */

export interface CommunityData {
  name: string;
  percentage: number;
  trend: number;
  year: number;
}

export interface InfrastructureData {
  type: string;
  count: number;
  yearOverYearChange: number;
}

export interface CityExportData {
  cityName: string;
  population: number;
  communities: CommunityData[];
  infrastructure: InfrastructureData[];
}

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV(data: any[], headers: string[]): string {
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      const escaped = ('' + value).replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

/**
 * Export city demographic data to CSV file
 */
export function exportCityDataToCSV(data: CityExportData): void {
  const { cityName, population, communities, infrastructure } = data;
  
  // Create CSV content
  let csvContent = `City: ${cityName}\n`;
  csvContent += `Population: ${population}\n`;
  csvContent += `Export Date: ${new Date().toISOString()}\n\n`;
  
  // Community composition section
  csvContent += 'Community Composition\n';
  csvContent += arrayToCSV(
    communities.map(c => ({
      'Community Name': c.name,
      'Population %': c.percentage.toFixed(2),
      '5-Year Trend %': c.trend.toFixed(2),
      'Year': c.year,
    })),
    ['Community Name', 'Population %', '5-Year Trend %', 'Year']
  );
  
  csvContent += '\n\nReligious Infrastructure\n';
  csvContent += arrayToCSV(
    infrastructure.map(i => ({
      'Type': i.type,
      'Count': i.count,
      'YoY Change %': i.yearOverYearChange.toFixed(2),
    })),
    ['Type', 'Count', 'YoY Change %']
  );
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${cityName.toLowerCase()}-demographics-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
