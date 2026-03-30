import { AlertTriangle, AlertCircle, CheckCircle, X } from 'lucide-react';

const iconMap = {
  danger: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
};

const colorMap = {
  danger: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300',
  warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300',
};

const iconColorMap = {
  danger: 'text-red-500',
  warning: 'text-amber-500',
  success: 'text-emerald-500',
};

export default function AlertsPanel({ alerts, open, onClose }) {
  if (!open) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Alerts ({alerts.length})</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors">
          <X size={14} className="text-gray-400" />
        </button>
      </div>
      <div className="p-2 space-y-2">
        {alerts.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No alerts</p>
        )}
        {alerts.map((alert) => {
          const Icon = iconMap[alert.type];
          return (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${colorMap[alert.type]}`}>
              <Icon size={16} className={`mt-0.5 ${iconColorMap[alert.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">{alert.title}</p>
                <p className="text-xs opacity-80 mt-0.5">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
