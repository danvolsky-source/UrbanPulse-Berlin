/**
 * Currency utility for displaying amounts in correct currency based on country
 */

export type Country = "Germany" | "France" | "Austria" | "Italy" | "Netherlands" | "Belgium" | "United Kingdom" | "United States" | "Canada";

export interface CurrencyConfig {
  symbol: string;
  code: string;
  position: "before" | "after";
}

const currencyMap: Record<Country, CurrencyConfig> = {
  "Germany": { symbol: "€", code: "EUR", position: "after" },
  "France": { symbol: "€", code: "EUR", position: "after" },
  "Austria": { symbol: "€", code: "EUR", position: "after" },
  "Italy": { symbol: "€", code: "EUR", position: "after" },
  "Netherlands": { symbol: "€", code: "EUR", position: "after" },
  "Belgium": { symbol: "€", code: "EUR", position: "after" },
  "United Kingdom": { symbol: "£", code: "GBP", position: "before" },
  "United States": { symbol: "$", code: "USD", position: "before" },
  "Canada": { symbol: "CAD$", code: "CAD", position: "before" },
};

/**
 * Format amount with correct currency symbol based on country
 */
export function formatCurrency(amount: number, country: Country): string {
  const config = currencyMap[country] || { symbol: "€", code: "EUR", position: "after" };
  
  // Format number with thousands separator
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  if (config.position === "before") {
    return `${config.symbol}${formatted}`;
  } else {
    return `${formatted} ${config.symbol}`;
  }
}

/**
 * Get currency symbol for a country
 */
export function getCurrencySymbol(country: Country): string {
  return currencyMap[country]?.symbol || "€";
}

/**
 * Get currency code for a country
 */
export function getCurrencyCode(country: Country): string {
  return currencyMap[country]?.code || "EUR";
}

/**
 * Format large amounts (millions, billions)
 */
export function formatLargeAmount(amount: number, country: Country): string {
  const config = currencyMap[country] || { symbol: "€", code: "EUR", position: "after" };
  
  let value: number;
  let suffix: string;

  if (amount >= 1000000000) {
    value = amount / 1000000000;
    suffix = "B";
  } else if (amount >= 1000000) {
    value = amount / 1000000;
    suffix = "M";
  } else if (amount >= 1000) {
    value = amount / 1000;
    suffix = "K";
  } else {
    return formatCurrency(amount, country);
  }

  const formatted = value.toFixed(1);

  if (config.position === "before") {
    return `${config.symbol}${formatted}${suffix}`;
  } else {
    return `${formatted}${suffix} ${config.symbol}`;
  }
}
