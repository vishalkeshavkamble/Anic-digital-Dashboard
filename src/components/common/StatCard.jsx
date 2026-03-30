import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, subtitle, trend, trendValue, icon: Icon, color = 'brand' }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {trendValue !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
          {trend === 'down' && <TrendingDown size={14} className="text-red-500" />}
          {trend === 'stable' && <Minus size={14} className="text-gray-400" />}
          <span className={`text-xs font-medium ${
            trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
          }`}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
