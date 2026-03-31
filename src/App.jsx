import { useState, useEffect } from 'react';
import OnboardWizard from './components/onboard/OnboardWizard';
import SalesPipelineTab from './components/tabs/SalesPipelineTab';
import ClientsTab from './components/tabs/ClientsTab';
import PaymentsTab from './components/tabs/PaymentsTab';
import ScheduleTab from './components/tabs/ScheduleTab';
import MessagesTab from './components/tabs/MessagesTab';
import AdPlatformsTab from './components/tabs/AdPlatformsTab';
import InvoicesTab from './components/tabs/InvoicesTab';
import ClientPortalTab from './components/tabs/ClientPortalTab';
import SheetsTab from './components/tabs/SheetsTab';
import Modal from './components/common/Modal';

const TABS = [
  { id: 'onboard', label: 'Onboard', icon: '✦', accent: true },
  { id: 'sales', label: 'Sales', icon: '◉' },
  { id: 'clients', label: 'Clients', icon: '◑' },
  { id: 'payments', label: 'Payments', icon: '◆' },
  { id: 'schedule', label: 'Schedule', icon: '◐' },
  { id: 'messages', label: 'Messages', icon: '◈' },
  { id: 'adplatforms', label: 'Ad Platforms', icon: '◈' },
  { id: 'invoices', label: 'Invoices', icon: '◇' },
  { id: 'portal', label: 'Portal', icon: '⬡' },
  { id: 'sheets', label: 'Sheets', icon: '▣' },
];

// Office hours: 9 AM – 6 PM, weekdays only
function getAutoTheme() {
  const now = new Date();
  const h = now.getHours();
  const day = now.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const isOfficeHours = h >= 9 && h < 18;
  return (isWeekday && isOfficeHours) ? 'light' : 'dark';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('sales');
  const [showOnboard, setShowOnboard] = useState(false);
  const [themeMode, setThemeMode] = useState('auto');
  const [resolvedTheme, setResolvedTheme] = useState(getAutoTheme());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (themeMode === 'auto') {
      setResolvedTheme(getAutoTheme());
      const i = setInterval(() => setResolvedTheme(getAutoTheme()), 60000);
      return () => clearInterval(i);
    }
    setResolvedTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const cycleTheme = () => setThemeMode((m) => m === 'auto' ? 'light' : m === 'light' ? 'dark' : 'auto');
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  const themeLabel = themeMode === 'auto' ? '🌗 Auto' : themeMode === 'light' ? '☀️ Light' : '🌙 Dark';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-lg">AD</div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Anic Digital</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Command Center v5.0</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 hidden md:block">Office: 9AM–6PM, Mon–Fri</span>
          <button onClick={cycleTheme} className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm transition-colors" title={`Theme: ${themeMode}`}>
            {themeLabel}
          </button>
          <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 dark:text-gray-400 transition-colors text-lg" title="Fullscreen">
            {isFullscreen ? '⊟' : '⊞'}
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 shrink-0 overflow-x-auto">
        <div className="flex gap-0.5 justify-center">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => tab.id === 'onboard' ? setShowOnboard(true) : setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                tab.accent
                  ? 'bg-indigo-600 text-white rounded-t-lg border-transparent hover:bg-indigo-700 mx-1'
                  : activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}>
              <span className="mr-1.5">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content — Full width for immersive experience */}
      <main className="flex-1 overflow-y-auto p-5 w-full">
        {activeTab === 'sales' && <SalesPipelineTab />}
        {activeTab === 'clients' && <ClientsTab />}
        {activeTab === 'payments' && <PaymentsTab />}
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'adplatforms' && <AdPlatformsTab />}
        {activeTab === 'invoices' && <InvoicesTab />}
        {activeTab === 'portal' && <ClientPortalTab />}
        {activeTab === 'sheets' && <SheetsTab />}
      </main>

      {/* Onboard Modal */}
      <Modal open={showOnboard} onClose={() => setShowOnboard(false)} title="✦ Onboard New Client" wide>
        <OnboardWizard onClose={() => setShowOnboard(false)} />
      </Modal>
    </div>
  );
}
