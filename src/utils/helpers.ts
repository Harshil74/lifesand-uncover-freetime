export const formatNumber = (num: number, decimalPlaces: number = 0): string => {
  // Use toFixed to control decimal places and then convert to a number to remove trailing zeros if not needed
  // Then convert back to string for formatting
  const formatted = num.toFixed(decimalPlaces);
  
  // If decimalPlaces is 0, and the number ends with .0, remove the .0
  if (decimalPlaces === 0 && formatted.endsWith('.0')) {
    return formatted.slice(0, -2);
  }
  
  return formatted;
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

export const getRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
