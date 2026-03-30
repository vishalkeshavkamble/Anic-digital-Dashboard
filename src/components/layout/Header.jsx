import { LayoutDashboard, Bell, Settings } from 'lucide-react';

export default function Header() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-brand-600 text-white p-2 rounded-lg">
          <LayoutDashboard size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">Anic Digital</h1>
          <p className="text-xs text-gray-500">Agency Command Center</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 hidden md:block">{dateStr}</span>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
