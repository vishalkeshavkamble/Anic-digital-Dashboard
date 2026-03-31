import { useState, useEffect } from 'react';
import OnboardWizard from './components/onboard/OnboardWizard';
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
  { id: 'onboard', label: '✦ Onboard', color: 'bg-indigo-600' },
  { id: 'clients', label: '◑ Clients' },
  { id: 'payments', label: '◆ Payments' },
  { id: 'schedule', label: '◐ Schedule' },
  { id: 'messages', label: '◈ Messages' },
  { id: 'adplatforms', label: '◈ Ad Platforms' },
  { id: 'invoices', label: '◇ Invoices' },
  { id: 'portal', label: '⬡ Portal' },
  { id: 'sheets', label: '▣ Sheets' },
];

function getAutoTheme() {
  const h = new Date().getHours();
  return h >= 6 && h < 18 ? 'light' : 'dark';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('onboard');
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

  const themeIcon = themeMode === 'auto' ? '🌗' : themeMode === 'light' ? '☀️' : '🌙';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-lg">AD</div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Anic Digital</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Command Center v5.0</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={cycleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title={`Theme: ${themeMode}`}>
            {themeIcon}
          </button>
          <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 dark:text-gray-400 transition-colors" title="Fullscreen">
            {isFullscreen ? '⊟' : '⊞'}
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 overflow-x-auto">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => tab.id === 'onboard' ? setShowOnboard(true) : setActiveTab(tab.id)}
              className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              } ${tab.color ? `${tab.color} !text-white rounded-t-lg border-0 hover:bg-indigo-700` : ''}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'clients' && <ClientsTab />}
        {activeTab === 'payments' && <PaymentsTab />}
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'adplatforms' && <AdPlatformsTab />}
        {activeTab === 'invoices' && <InvoicesTab />}
        {activeTab === 'portal' && <ClientPortalTab />}
        {activeTab === 'sheets' && <SheetsTab />}
        {activeTab === 'onboard' && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✦</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Anic Digital Command Center</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Click the Onboard button above to add a new client, or select a tab to manage your agency.</p>
            <button onClick={() => setShowOnboard(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors">✦ Onboard New Client</button>
          </div>
        )}
      </main>

      {/* Onboard Modal */}
      <Modal open={showOnboard} onClose={() => setShowOnboard(false)} title="✦ Onboard New Client" wide>
        <OnboardWizard onClose={() => setShowOnboard(false)} />
      </Modal>
    </div>
  );
}
