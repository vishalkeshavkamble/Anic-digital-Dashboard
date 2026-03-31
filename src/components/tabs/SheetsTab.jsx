import { useApp } from '../../store/AppContext';

export default function SheetsTab() {
  const { state, dispatch } = useApp();
  const cfg = state.sheetsConfig;
  const update = (payload) => dispatch({ type: 'UPDATE_SHEETS_CONFIG', payload });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">▣ Google Sheets Integration</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Configuration</h3>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Google Sheet ID</label>
            <input value={cfg.sheetId} onChange={(e) => update({ sheetId: e.target.value })} placeholder="Enter your Sheet ID..." className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400 font-mono" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tab Names</label>
            <div className="space-y-2 mt-1">
              {['clients', 'payments', 'adData'].map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-20 capitalize">{key}:</span>
                  <input value={cfg.tabs[key]} onChange={(e) => update({ tabs: { ...cfg.tabs, [key]: e.target.value } })} className="flex-1 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-Sync Every 15 min</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Automatically push data to sheets</p>
            </div>
            <button onClick={() => update({ autoSync: !cfg.autoSync })}
              className={`w-12 h-6 rounded-full transition-colors relative ${cfg.autoSync ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${cfg.autoSync ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <button onClick={() => update({ lastSync: new Date().toISOString(), rowsSynced: { clients: state.clients.length, payments: state.payments.length, adData: 5 } })}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700" disabled={!cfg.sheetId}>
            Sync Now
          </button>
        </div>
        {/* Status */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connection Status</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${cfg.sheetId ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{cfg.sheetId ? 'Connected' : 'Not connected'}</span>
            </div>
            {cfg.lastSync && (
              <div className="space-y-2 text-sm">
                <p className="text-gray-500 dark:text-gray-400">Last sync: {new Date(cfg.lastSync).toLocaleString()}</p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(cfg.rowsSynced).map(([key, val]) => (
                    <div key={key} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-indigo-600">{val}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key} rows</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Guide</h3>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal pl-4">
              <li>Create a new Google Sheet</li>
              <li>Add tabs named: <b>Clients</b>, <b>Payments</b>, <b>Ad Data</b></li>
              <li>Copy the Sheet ID from the URL (between /d/ and /edit)</li>
              <li>Paste it in the Sheet ID field above</li>
              <li>Click "Sync Now" to push current data</li>
              <li>Enable Auto-Sync for automatic updates</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
