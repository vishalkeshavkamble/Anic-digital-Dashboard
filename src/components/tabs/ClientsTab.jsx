import { useApp, SERVICES_LIST } from '../../store/AppContext';
import EditableText from '../common/EditableText';
import StarRating from '../common/StarRating';

export default function ClientsTab() {
  const { state, dispatch } = useApp();

  const update = (id, payload) => dispatch({ type: 'UPDATE_CLIENT', id, payload });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">◑ Clients</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click any field to edit</p>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{state.clients.length} clients</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {state.clients.map((c) => (
          <div key={c.id} className={`bg-white dark:bg-slate-800 rounded-xl border ${c.status === 'at-risk' ? 'border-red-300 dark:border-red-800' : 'border-gray-200 dark:border-slate-700'} p-5 shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 space-y-1">
                <EditableText value={c.name} onSave={(v) => update(c.id, { name: v })} className="text-lg font-bold text-gray-900 dark:text-white" tag="h3" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 text-sm">
                  <div><span className="text-gray-500 dark:text-gray-400">Contact: </span><EditableText value={c.contact} onSave={(v) => update(c.id, { contact: v })} className="text-gray-700 dark:text-gray-300" /></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Phone: </span><EditableText value={c.phone} onSave={(v) => update(c.id, { phone: v })} className="text-gray-700 dark:text-gray-300" /></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Email: </span><EditableText value={c.email} onSave={(v) => update(c.id, { email: v })} className="text-gray-700 dark:text-gray-300" /></div>
                  <div><span className="text-gray-500 dark:text-gray-400">MRR: </span><span className="font-semibold text-indigo-600">₹{c.mrr?.toLocaleString()}</span></div>
                  {c.onboardedBy && <div><span className="text-gray-500 dark:text-gray-400">By: </span><span className="font-semibold text-indigo-600">{c.onboardedBy}</span></div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select value={c.status} onChange={(e) => update(c.id, { status: e.target.value })}
                  className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                  <option value="active">Active</option>
                  <option value="at-risk">At Risk</option>
                </select>
                <button onClick={() => { if (window.confirm(`Delete client "${c.name}"?`)) dispatch({ type: 'DELETE_CLIENT', id: c.id }); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors" title="Delete client">
                  ✕
                </button>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">Notes: </span>
              <EditableText value={c.notes} onSave={(v) => update(c.id, { notes: v })} className="text-sm text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-3">
              {c.services?.map((s) => {
                const svc = SERVICES_LIST.find((sl) => sl.id === s.id);
                return (
                  <div key={s.id} className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                    <span className="text-sm">{svc?.icon}</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{svc?.name}</span>
                    <StarRating value={s.rating} size={12} onChange={(r) => {
                      const newSvcs = c.services.map((sv) => (sv.id === s.id ? { ...sv, rating: r } : sv));
                      update(c.id, { services: newSvcs });
                    }} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
