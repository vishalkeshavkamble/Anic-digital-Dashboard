import { useState } from 'react';
import { Users, DollarSign, AlertTriangle, Star, Plus, X } from 'lucide-react';
import StatCard from '../common/StatCard';
import SectionCard from '../common/SectionCard';
import EditableCell from '../common/EditableCell';
import Modal from '../common/Modal';
import { formatCurrency } from '../../utils/formatters';
import { useData } from '../../context/DataContext';

const STATUS_OPTIONS = ['active', 'at-risk'];

export default function ClientsTab() {
  const { clients, addClient, deleteClient, updateClient } = useData();
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '', industry: '', services: '', adSpend: 0, roas: 0, health: 85, status: 'active', mrr: 0, since: new Date().toISOString().slice(0, 7),
  });

  const totalMRR = clients.reduce((s, c) => s + c.mrr, 0);
  const avgHealth = Math.round(clients.reduce((s, c) => s + c.health, 0) / clients.length);
  const atRiskCount = clients.filter((c) => c.status === 'at-risk').length;
  const totalAdSpend = clients.reduce((s, c) => s + c.adSpend, 0);

  const handleAddClient = () => {
    if (!newClient.name) return;
    addClient({
      ...newClient,
      services: newClient.services.split(',').map((s) => s.trim()).filter(Boolean),
      adSpend: Number(newClient.adSpend),
      roas: Number(newClient.roas),
      health: Number(newClient.health),
      mrr: Number(newClient.mrr),
    });
    setNewClient({ name: '', industry: '', services: '', adSpend: 0, roas: 0, health: 85, status: 'active', mrr: 0, since: new Date().toISOString().slice(0, 7) });
    setShowAddClient(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Clients" value={clients.length} icon={Users} color="brand" trend="up" trendValue="+3 this quarter" />
        <StatCard title="Monthly Recurring" value={formatCurrency(totalMRR)} icon={DollarSign} color="green" trend="up" trendValue="+8% growth" />
        <StatCard title="Avg Health Score" value={avgHealth} icon={Star} color="blue" trend="stable" trendValue="Above target" />
        <StatCard title="At-Risk Clients" value={atRiskCount} icon={AlertTriangle} color="red" trend="down" trendValue="Needs attention" />
      </div>

      <SectionCard
        title="Client Portfolio"
        subtitle="Click any cell to edit inline"
        action={
          <button onClick={() => setShowAddClient(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition-colors">
            <Plus size={14} /> Add Client
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-slate-700">
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Client</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Industry</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Services</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Ad Spend</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">ROAS</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Health</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">MRR</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                <th className="pb-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className={`border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors ${client.status === 'at-risk' ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                  <td className="py-3">
                    <EditableCell value={client.name} onSave={(v) => updateClient(client.id, { name: v })} className="font-medium text-gray-900 dark:text-white" />
                    <div className="text-xs text-gray-400 dark:text-gray-500">Since {client.since}</div>
                  </td>
                  <td className="py-3">
                    <EditableCell value={client.industry} onSave={(v) => updateClient(client.id, { industry: v })} className="text-gray-600 dark:text-gray-300" />
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {client.services.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-medium">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    <EditableCell value={client.adSpend} type="number" onSave={(v) => updateClient(client.id, { adSpend: v })} className="text-gray-700 dark:text-gray-300" />
                  </td>
                  <td className="py-3">
                    <EditableCell value={client.roas} type="number" onSave={(v) => updateClient(client.id, { roas: v })} className={`font-semibold ${client.roas >= 4 ? 'text-emerald-600' : client.roas >= 3 ? 'text-blue-600' : 'text-amber-600'}`} />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${client.health >= 90 ? 'bg-emerald-500' : client.health >= 80 ? 'bg-blue-500' : client.health >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${client.health}%` }} />
                      </div>
                      <EditableCell value={client.health} type="number" onSave={(v) => updateClient(client.id, { health: Math.min(100, Math.max(0, v)) })} className="text-xs font-semibold" />
                    </div>
                  </td>
                  <td className="py-3">
                    <EditableCell value={client.mrr} type="number" onSave={(v) => updateClient(client.id, { mrr: v })} className="font-semibold text-gray-900 dark:text-white" />
                  </td>
                  <td className="py-3">
                    <select
                      value={client.status}
                      onChange={(e) => updateClient(client.id, { status: e.target.value })}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                        client.status === 'at-risk'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === 'at-risk' ? 'At Risk' : 'Active'}</option>)}
                    </select>
                  </td>
                  <td className="py-3">
                    <button onClick={() => deleteClient(client.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors" title="Delete client">
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Total Ad Spend Managed" className="flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalAdSpend)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">/month across all clients</p>
        </SectionCard>
        <SectionCard title="Average ROAS" className="flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-bold text-emerald-600">
            {(clients.filter((c) => c.roas > 0).reduce((s, c) => s + c.roas, 0) / clients.filter((c) => c.roas > 0).length).toFixed(1)}x
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Return on ad spend</p>
        </SectionCard>
        <SectionCard title="At-Risk Alerts" className="flex flex-col justify-center">
          {clients.filter((c) => c.status === 'at-risk').map((c) => (
            <div key={c.id} className="flex items-center gap-2 py-2">
              <AlertTriangle size={16} className="text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Health score: {c.health} — Needs review</p>
              </div>
            </div>
          ))}
          {clients.filter((c) => c.status === 'at-risk').length === 0 && (
            <p className="text-sm text-gray-400 text-center py-2">No at-risk clients</p>
          )}
        </SectionCard>
      </div>

      {/* Add Client Modal */}
      <Modal open={showAddClient} onClose={() => setShowAddClient(false)} title="Add New Client">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Name</label>
            <input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Industry</label>
            <input value={newClient.industry} onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Services (comma separated)</label>
            <input value={newClient.services} onChange={(e) => setNewClient({ ...newClient, services: e.target.value })} placeholder="SEO, PPC, Web Dev" className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">MRR ($)</label>
              <input type="number" value={newClient.mrr} onChange={(e) => setNewClient({ ...newClient, mrr: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Health Score</label>
              <input type="number" min="0" max="100" value={newClient.health} onChange={(e) => setNewClient({ ...newClient, health: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select value={newClient.status} onChange={(e) => setNewClient({ ...newClient, status: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400">
              <option value="active">Active</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>
          <button onClick={handleAddClient} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors">Add Client</button>
        </div>
      </Modal>
    </div>
  );
}
