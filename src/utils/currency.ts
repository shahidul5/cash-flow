// Currency utility functions

// Currency symbol for Bangladeshi Taka
export const CURRENCY_SYMBOL = '৳';

/**
 * Format a number as BDT currency
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to include the currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  return showSymbol ? `${CURRENCY_SYMBOL}${formattedAmount}` : formattedAmount;
};

/**
 * Format a number as BDT currency with thousand separators
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with thousand separators
 */
export const formatCurrencyWithCommas = (amount) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  const parts = formattedAmount.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${CURRENCY_SYMBOL}${parts.join('.')}`;
}; 