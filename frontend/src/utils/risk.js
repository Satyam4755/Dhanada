export const riskLevels = [
  { level: 1, label: 'Low', color: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  { level: 2, label: 'Low to Moderate', color: 'bg-[#a3e635]', bg: 'bg-[#ecfccb]', text: 'text-[#4d7c0f]', border: 'border-[#d9f99d]' },
  { level: 3, label: 'Moderate', color: 'bg-amber-500', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  { level: 4, label: 'High', color: 'bg-orange-500', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  { level: 5, label: 'Very High', color: 'bg-red-600', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
];

export function getRiskLevelConfig(level) {
  const parsedLevel = parseInt(level, 10);
  if (isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 5) {
    return { level: 'N/A', label: 'N/A', color: 'bg-gray-300', bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' };
  }
  return riskLevels.find(r => r.level === parsedLevel);
}
