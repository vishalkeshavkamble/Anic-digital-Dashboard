import { useState } from 'react';
import { useApp, SERVICES_LIST } from '../../store/AppContext';
import StarRating from '../common/StarRating';

export default function ClientPortalTab() {
  const { state } = useApp();
  const [selectedClientId, setSelectedClientId] = useState(state.clients[0]?.id || null);
  const client = state.clients.find((c) => c.id === selectedClientId);
  const payments = state.payments.filter((p) => p.clientId === selectedClientId || p.clientName === client?.name);
  const schedule = state.schedule.filter((s) => s.clientId === selectedClientId || s.title?.toLowerCase().includes(client?.name?.toLowerCase()));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">⬡ Client Portal</h2>
      {/* Client selector */}
      <div className="flex flex-wrap gap-2">
        {state.clients.map((c) => (
          <button key={c.id} onClick={() => setSelectedClientId(c.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedClientId === c.id ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700'}`}>
            {c.name}
          </button>
        ))}
      </div>
      {client && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Active Services</h3>
            <div className="space-y-3">
              {client.services?.map((s) => {
                const svc = SERVICES_LIST.find((sl) => sl.id === s.id);
                return (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{svc?.icon}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{svc?.name}</span>
                    </div>
                    <StarRating value={s.rating} readonly size={14} />
                  </div>
                );
              })}
            </div>
          </div>
          {/* Payment History */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment History</h3>
            {payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">₹{p.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.dueDate}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                      p.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>{p.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No payments recorded</p>
            )}
          </div>
          {/* Upcoming Schedule */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Upcoming Schedule</h3>
            {schedule.length > 0 ? (
              <div className="space-y-2">
                {schedule.map((evt) => (
                  <div key={evt.id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 w-24">{evt.date}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">{evt.type}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{evt.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
