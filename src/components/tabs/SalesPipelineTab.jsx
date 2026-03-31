import { useState } from 'react';
import { useApp, PIPELINE_STAGES, SALES_REPS, serviceNameToId } from '../../store/AppContext';
import Modal from '../common/Modal';

const STAGE_COLORS = {
  'New Lead': 'bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:border-sky-800',
  'Interested': 'bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800',
  'Proposal Sent': 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
  'Negotiation': 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
  'Onboarded': 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800',
  'Active Customer': 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
  'Churned': 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
};

const STAGE_BADGE = {
  'New Lead': 'bg-sky-500',
  'Interested': 'bg-violet-500',
  'Proposal Sent': 'bg-amber-500',
  'Negotiation': 'bg-orange-500',
  'Onboarded': 'bg-emerald-500',
  'Active Customer': 'bg-green-600',
  'Churned': 'bg-red-500',
};

const SOURCE_ICONS = { LinkedIn: '💼', Referral: '🤝', 'Google Search': '🔍', Instagram: '📸', Event: '🎤' };

export default function SalesPipelineTab() {
  const { state, dispatch } = useApp();
  const [view, setView] = useState('kanban');
  const [repFilter, setRepFilter] = useState('All');
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({ company: '', contact: '', phone: '', email: '', value: '', services: '', source: 'LinkedIn', rep: 'Anic' });

  const filtered = repFilter === 'All' ? state.leads : state.leads.filter((l) => l.rep === repFilter);

  const moveStage = (id, newStage) => {
    dispatch({ type: 'UPDATE_LEAD', id, payload: { stage: newStage, lastActivity: new Date().toISOString().slice(0, 10) } });
    if (newStage === 'Onboarded') {
      const lead = state.leads.find((l) => l.id === id);
      if (lead) {
        dispatch({ type: 'ADD_CLIENT', payload: {
          name: lead.company, contact: lead.contact, phone: lead.phone, email: lead.email,
          status: 'active', notes: `Converted from pipeline. Source: ${lead.source}`,
          services: lead.services.map((s) => ({ id: serviceNameToId(s) || s.toLowerCase().replace(/\s/g, ''), rating: 0 })),
          startDate: new Date().toISOString().slice(0, 10), duration: 6, mrr: lead.value, onboardedBy: lead.rep,
        }});
      }
    }
  };

  const handleAddLead = () => {
    if (!newLead.company || !newLead.contact) return;
    dispatch({ type: 'ADD_LEAD', payload: {
      ...newLead, value: Number(newLead.value) || 0,
      services: newLead.services.split(',').map((s) => s.trim()).filter(Boolean),
      stage: 'New Lead', lastActivity: new Date().toISOString().slice(0, 10), notes: '',
    }});
    setNewLead({ company: '', contact: '', phone: '', email: '', value: '', services: '', source: 'LinkedIn', rep: 'Anic' });
    setShowAddLead(false);
  };

  const stageKPIs = PIPELINE_STAGES.map((stage) => {
    const stageLeads = filtered.filter((l) => l.stage === stage);
    return { stage, count: stageLeads.length, value: stageLeads.reduce((s, l) => s + l.value, 0) };
  });

  const repPerformance = SALES_REPS.map((rep) => {
    const repLeads = state.leads.filter((l) => l.rep === rep);
    const converted = repLeads.filter((l) => ['Onboarded', 'Active Customer'].includes(l.stage));
    const pipeline = repLeads.filter((l) => !['Churned', 'Active Customer'].includes(l.stage));
    const totalVal = repLeads.reduce((s, l) => s + l.value, 0);
    const rate = repLeads.length > 0 ? Math.round((converted.length / repLeads.length) * 100) : 0;
    return { rep, total: repLeads.length, converted: converted.length, pipeline: pipeline.length, value: totalVal, rate };
  });

  const stageIdx = (stage) => PIPELINE_STAGES.indexOf(stage);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sales Pipeline</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} leads across {PIPELINE_STAGES.length} stages</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-1 flex">
            <button onClick={() => setView('kanban')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'kanban' ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Kanban</button>
            <button onClick={() => setView('table')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'table' ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Table</button>
          </div>
          <select value={repFilter} onChange={(e) => setRepFilter(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none cursor-pointer">
            <option value="All">All Reps</option>
            {SALES_REPS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={() => setShowAddLead(true)} className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20">+ Add Lead</button>
        </div>
      </div>

      {/* Stage Funnel KPIs */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
        {stageKPIs.map(({ stage, count, value }) => (
          <div key={stage} className={`rounded-2xl border p-3 text-center transition-all hover:scale-[1.03] card-hover ${STAGE_COLORS[stage]}`}>
            <p className="text-xs font-bold uppercase tracking-wider truncate">{stage}</p>
            <p className="text-3xl font-bold mt-1">{count}</p>
            <p className="text-sm opacity-60 mt-0.5">₹{(value / 1000).toFixed(0)}K</p>
          </div>
        ))}
      </div>

      {/* Kanban View — 4-column grid, wraps into 2 rows, no scroll */}
      {view === 'kanban' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filtered.filter((l) => l.stage === stage);
            return (
              <div key={stage}>
                {/* Column header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${STAGE_BADGE[stage]}`} />
                  <span className="text-base font-bold text-gray-900 dark:text-white">{stage}</span>
                  <span className="text-sm bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 rounded-full px-2.5 py-0.5 font-semibold">{stageLeads.length}</span>
                </div>
                {/* Cards */}
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <div key={lead.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm card-hover hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 cursor-default">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug">{lead.company}</h4>
                        <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 shrink-0">₹{(lead.value / 1000).toFixed(0)}K</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{lead.contact} · {lead.email}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {lead.services.map((s) => (
                          <span key={s} className="px-2.5 py-1 rounded-lg text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">{s}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-500 mb-3">
                        <span>{SOURCE_ICONS[lead.source] || '📌'} {lead.source}</span>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">{lead.rep}</span>
                      </div>
                      {/* Move buttons */}
                      <div className="flex gap-2">
                        {stageIdx(stage) > 0 && (
                          <button onClick={() => moveStage(lead.id, PIPELINE_STAGES[stageIdx(stage) - 1])}
                            className="flex-1 py-2 text-sm font-semibold bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                            ← Back
                          </button>
                        )}
                        {stageIdx(stage) < PIPELINE_STAGES.length - 1 && (
                          <button onClick={() => moveStage(lead.id, PIPELINE_STAGES[stageIdx(stage) + 1])}
                            className="flex-1 py-2 text-sm font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors">
                            Next →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="text-center py-10 text-sm text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-slate-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700/50 text-left">
                <th className="px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Company</th>
                <th className="px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Contact</th>
                <th className="px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Services</th>
                <th className="px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Value</th>
                <th className="px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Stage</th>
                <th className="px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Rep</th>
                <th className="px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Source</th>
                <th className="px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{lead.company}</td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">
                    <div>{lead.contact}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{lead.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {lead.services.map((s) => <span key={s} className="px-2.5 py-1 rounded-lg text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">{s}</span>)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white">₹{lead.value.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <select value={lead.stage} onChange={(e) => moveStage(lead.id, e.target.value)}
                      className="text-xs font-semibold rounded-lg px-3 py-1.5 border-0 cursor-pointer bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                      {PIPELINE_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 font-medium">{lead.rep}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{SOURCE_ICONS[lead.source]} {lead.source}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{lead.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sales Rep Performance */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Rep Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {repPerformance.map(({ rep, total, converted, pipeline, value, rate }) => (
            <div key={rep} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm card-hover hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{rep}</h4>
                <span className="text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full font-bold">{rate}%</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{converted}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Converted</p>
                </div>
                <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-sky-700 dark:text-sky-400">{pipeline}</p>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">Pipeline</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total: <b className="text-gray-900 dark:text-white">₹{(value / 1000).toFixed(0)}K</b></p>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${rate}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">{rate}% conversion rate</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal open={showAddLead} onClose={() => setShowAddLead(false)} title="Add New Lead">
        <div className="space-y-4">
          {[['company', 'Company Name'], ['contact', 'Contact Person'], ['phone', 'Phone'], ['email', 'Email']].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
              <input value={newLead[key]} onChange={(e) => setNewLead({ ...newLead, [key]: e.target.value })}
                className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Services (comma separated)</label>
            <input value={newLead.services} onChange={(e) => setNewLead({ ...newLead, services: e.target.value })} placeholder="Meta Ads, SEO, Website"
              className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Deal Value (₹)</label>
              <input type="number" value={newLead.value} onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Source</label>
              <select value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none">
                {['LinkedIn', 'Referral', 'Google Search', 'Instagram', 'Event'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Rep</label>
              <select value={newLead.rep} onChange={(e) => setNewLead({ ...newLead, rep: e.target.value })}
                className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none">
                {SALES_REPS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleAddLead} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">Add Lead</button>
        </div>
      </Modal>
    </div>
  );
}
