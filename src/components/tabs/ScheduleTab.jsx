import { useState } from 'react';
import { useApp } from '../../store/AppContext';

const TYPE_COLORS = {
  shoot: 'bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800',
  meeting: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  launch: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  payment: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  task: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  onboarding: 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
};

export default function ScheduleTab() {
  const { state, dispatch } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', date: new Date().toISOString().slice(0, 10), type: 'task', clientId: '' });

  const sorted = [...state.schedule].sort((a, b) => a.date.localeCompare(b.date));

  const handleAdd = () => {
    if (!form.title) return;
    dispatch({ type: 'ADD_SCHEDULE', payload: { ...form, clientId: form.clientId ? Number(form.clientId) : null } });
    setForm({ title: '', date: new Date().toISOString().slice(0, 10), type: 'task', clientId: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">◐ Schedule</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">+ Add Event</button>
      </div>
      {showAdd && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400" />
          <div className="grid grid-cols-3 gap-3">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none">
              {Object.keys(TYPE_COLORS).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none">
              <option value="">No client</option>
              {state.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Add Event</button>
        </div>
      )}
      <div className="space-y-3">
        {sorted.map((evt) => {
          const client = state.clients.find((c) => c.id === evt.clientId);
          return (
            <div key={evt.id} className={`flex items-center justify-between p-4 rounded-xl border ${TYPE_COLORS[evt.type] || TYPE_COLORS.task}`}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-medium w-24">{evt.date}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase`}>{evt.type}</span>
                <span className="text-sm font-medium">{evt.title}</span>
                {client && <span className="text-xs opacity-70">({client.name})</span>}
              </div>
              <button onClick={() => dispatch({ type: 'DELETE_SCHEDULE', id: evt.id })} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
