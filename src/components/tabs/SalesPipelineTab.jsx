import { useState } from 'react';
import { useApp, PIPELINE_STAGES, SALES_REPS, serviceNameToId } from '../../store/AppContext';
import Modal from '../common/Modal';

const STAGE_COLORS = {
  'New Lead': 'bg-sky-100 border-sky-300 dark:bg-sky-900/30 dark:border-sky-800',
  'Interested': 'bg-violet-100 border-violet-300 dark:bg-violet-900/30 dark:border-violet-800',
  'Proposal Sent': 'bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:border-amber-800',
  'Negotiation': 'bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-800',
  'Onboarded': 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800',
  'Active Customer': 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-800',
  'Churned': 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-800',
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

const STAGE_SHORT = {
  'New Lead': 'New',
  'Interested': 'Interest',
  'Proposal Sent': 'Proposal',
  'Negotiation': 'Negotiate',
  'Onboarded': 'Onboard',
  'Active Customer': 'Active',
  'Churned': 'Churned',
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">◉ Sales Pipeline</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} leads across {PIPELINE_STAGES.length} stages</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-0.5 flex">
            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'kanban' ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Kanban</button>
            <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'table' ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Table</button>
          </div>
          <select value={repFilter} onChange={(e) => setRepFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none cursor-pointer">
            <option value="All">All Reps</option>
            {SALES_REPS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={() => setShowAddLead(true)} className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">+ Add Lead</button>
        </div>
      </div>

      {/* Stage Funnel KPIs — responsive */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {stageKPIs.map(({ stage, count, value }) => (
          <div key={stage} className={`rounded-xl border p-2.5 text-center transition-all hover:scale-[1.02] ${STAGE_COLORS[stage]}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider truncate">{STAGE_SHORT[stage]}</p>
            <p className="text-xl font-bold mt-0.5">{count}</p>
            <p className="text-[10px] opacity-70">₹{(value / 1000).toFixed(0)}K</p>
          </div>
        ))}
      </div>

      {/* Kanban View — FULL SCREEN, NO SCROLL */}
      {view === 'kanban' && (
        <div className="grid grid-cols-7 gap-2">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filtered.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="min-w-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${STAGE_BADGE[stage]}`} />
                  <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{STAGE_SHORT[stage]}</span>
                  <span className="text-[10px] bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 rounded-full px-1.5 py-0.5 font-medium shrink-0">{stageLeads.length}</span>
                </div>
                <div className="space-y-1.5">
                  {stageLeads.map((lead) => (
                    <div key={lead.id} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-2 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-default">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight truncate">{lead.company}</h4>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">₹{(lead.value / 1000).toFixed(0)}K</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{lead.contact}</p>
                      <div className="flex flex-wrap gap-0.5 my-1">
                        {lead.services.slice(0, 2).map((s) => (
                          <span key={s} className="px-1 py-0.5 rounded text-[9px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium truncate max-w-full">{s}</span>
                        ))}
                        {lead.services.length > 2 && (
                          <span className="px-1 py-0.5 rounded text-[9px] bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 font-medium">+{lead.services.length - 2}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-gray-400 dark:text-gray-500 mb-1.5">
                        <span>{SOURCE_ICONS[lead.source] || '📌'} {lead.source.split(' ')[0]}</span>
                        <span className="font-medium text-gray-500 dark:text-gray-400">{lead.rep}</span>
                      </div>
                      {/* Move buttons — compact */}
                      <div className="flex gap-0.5">
                        {stageIdx(stage) > 0 && (
                          <button onClick={() => moveStage(lead.id, PIPELINE_STAGES[stageIdx(stage) - 1])}
                            className="flex-1 py-0.5 text-[9px] font-medium bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors" title={`Move to ${PIPELINE_STAGES[stageIdx(stage) - 1]}`}>
                            ←
                          </button>
                        )}
                        {stageIdx(stage) < PIPELINE_STAGES.length - 1 && (
                          <button onClick={() => moveStage(lead.id, PIPELINE_STAGES[stageIdx(stage) + 1])}
                            className="flex-1 py-0.5 text-[9px] font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors" title={`Move to ${PIPELINE_STAGES[stageIdx(stage) + 1]}`}>
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="text-center py-6 text-[10px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-gray-200 dark:border-slate-700">No leads</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700/50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">Company</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">Contact</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">Services</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">Value</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">Stage</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">Rep</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">Source</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{lead.company}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <div>{lead.contact}</div>
                    <div className="text-xs text-gray-400">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {lead.services.map((s) => <span key={s} className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">{s}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">₹{lead.value.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select value={lead.stage} onChange={(e) => moveStage(lead.id, e.target.value)}
                      className="text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                      {PIPELINE_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">{lead.rep}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{SOURCE_ICONS[lead.source]} {lead.source}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{lead.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sales Rep Performance */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Sales Rep Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {repPerformance.map(({ rep, total, converted, pipeline, value, rate }) => (
            <div key={rep} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 dark:text-white">{rep}</h4>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">{rate}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{converted}</p>
                  <p className="text-emerald-600 dark:text-emerald-400">Converted</p>
                </div>
                <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-sky-700 dark:text-sky-400">{pipeline}</p>
                  <p className="text-sky-600 dark:text-sky-400">Pipeline</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Total Value: <b className="text-gray-900 dark:text-white">₹{(value / 1000).toFixed(0)}K</b></p>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{ width: `${rate}%` }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{rate}% conversion rate</p>
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
                className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Services (comma separated)</label>
            <input value={newLead.services} onChange={(e) => setNewLead({ ...newLead, services: e.target.value })} placeholder="Meta Ads, SEO, Website"
              className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Deal Value (₹)</label>
              <input type="number" value={newLead.value} onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Source</label>
              <select value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none">
                {['LinkedIn', 'Referral', 'Google Search', 'Instagram', 'Event'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Rep</label>
              <select value={newLead.rep} onChange={(e) => setNewLead({ ...newLead, rep: e.target.value })}
                className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none">
                {SALES_REPS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleAddLead} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Add Lead</button>
        </div>
      </Modal>
    </div>
  );
}
