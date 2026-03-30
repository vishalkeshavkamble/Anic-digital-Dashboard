import { useState } from 'react';
import { LayoutDashboard, Bell, Sun, Moon, Monitor, Maximize, Minimize } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAlerts } from '../../hooks/useAlerts';
import AlertsPanel from '../common/AlertsPanel';
import GlobalSearch from '../common/GlobalSearch';

export default function Header({ onNavigate }) {
  const { mode, setMode, resolvedTheme } = useTheme();
  const alerts = useAlerts();
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const cycleMode = () => {
    const order = ['auto', 'light', 'dark'];
    setMode(order[(order.indexOf(mode) + 1) % 3]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const themeIcon = mode === 'auto' ? Monitor : mode === 'light' ? Sun : Moon;
  const ThemeIcon = themeIcon;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-brand-600 text-white p-2 rounded-lg">
          <LayoutDashboard size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Anic Digital</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Agency Command Center</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <GlobalSearch onNavigate={onNavigate} />

        <span className="text-sm text-gray-500 dark:text-gray-400 hidden lg:block">{dateStr}</span>

        {/* Theme Toggle */}
        <button
          onClick={cycleMode}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title={`Theme: ${mode}`}
        >
          <ThemeIcon size={18} />
        </button>

        {/* Alerts */}
        <div className="relative">
          <button
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative"
          >
            <Bell size={18} />
            {alerts.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {alerts.length}
              </span>
            )}
          </button>
          <AlertsPanel alerts={alerts} open={alertsOpen} onClose={() => setAlertsOpen(false)} />
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </header>
  );
}
