export const formatCurrency = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

export const formatPercent = (value) => `${value}%`;

export const formatNumber = (value) => {
  return new Intl.NumberFormat().format(value);
};
