import { useState } from 'react';
import { TrendingUp, DollarSign, Target, Award, Plus, X } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import StatCard from '../common/StatCard';
import SectionCard from '../common/SectionCard';
import EditableCell from '../common/EditableCell';
import Modal from '../common/Modal';
import { formatCurrency } from '../../utils/formatters';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

const FUNNEL_COLORS = ['#818cf8', '#6366f1', '#4f46e5', '#4338ca'];

const stageColorMap = {
  Discovery: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  Qualified: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Proposal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Negotiation: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Closed Won': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};
const STAGES = ['Discovery', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];

export default function SalesTab() {
  const { salesFunnel, activeDeals, addDeal, deleteDeal, updateDeal, updateFunnelStage } = useData();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [newDeal, setNewDeal] = useState({ company: '', service: '', value: '', stage: 'Discovery', probability: 50, contact: '' });

  const totalPipeline = salesFunnel.reduce((s, f) => s + f.value, 0);
  const closedValue = salesFunnel[salesFunnel.length - 1].value;
  const conversionRate = Math.round((salesFunnel[salesFunnel.length - 1].count / salesFunnel[0].count) * 100);
  const avgDealSize = Math.round(closedValue / salesFunnel[salesFunnel.length - 1].count);
  const gridStroke = dark ? '#334155' : '#f1f5f9';
  const axisStroke = dark ? '#64748b' : '#94a3b8';

  const handleAddDeal = () => {
    if (!newDeal.company || !newDeal.service) return;
    addDeal({ ...newDeal, value: Number(newDeal.value) || 0, probability: Number(newDeal.probability) || 50 });
    setNewDeal({ company: '', service: '', value: '', stage: 'Discovery', probability: 50, contact: '' });
    setShowAddDeal(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Pipeline" value={formatCurrency(totalPipeline)} icon={DollarSign} color="brand" trend="up" trendValue="+15% this quarter" />
        <StatCard title="Closed Revenue" value={formatCurrency(closedValue)} icon={Award} color="green" trend="up" trendValue="+22% vs last quarter" />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={Target} color="orange" trend="up" trendValue="+3pp improvement" />
        <StatCard title="Avg Deal Size" value={formatCurrency(avgDealSize)} icon={TrendingUp} color="purple" trend="stable" trendValue="Consistent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Sales Funnel" subtitle="Click numbers to edit">
          <div className="space-y-3">
            {salesFunnel.map((stage, idx) => {
              const maxCount = salesFunnel[0].count;
              return (
                <div key={stage.stage} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20 text-right">{stage.stage}</span>
                  <div className="flex-1 relative">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-full h-10 overflow-hidden">
                      <div className="h-full rounded-full flex items-center justify-between px-3 transition-all" style={{ width: `${(stage.count / maxCount) * 100}%`, backgroundColor: FUNNEL_COLORS[idx], minWidth: '5rem' }}>
                        <EditableCell
                          value={stage.count}
                          type="number"
                          onSave={(v) => updateFunnelStage(idx, { count: v })}
                          className="text-xs font-bold text-white"
                        />
                        <span className="text-xs text-white/80">{formatCurrency(stage.value)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Pipeline by Stage" subtitle="Deal values">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11, fill: axisStroke }} stroke={axisStroke} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: axisStroke }} stroke={axisStroke} width={80} />
                <Tooltip contentStyle={{ backgroundColor: dark ? '#1e293b' : '#fff', border: 'none', borderRadius: 8, color: dark ? '#e2e8f0' : '#1e293b' }} formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Value">
                  {salesFunnel.map((_, idx) => (
                    <Cell key={idx} fill={FUNNEL_COLORS[idx]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Active Deals"
        subtitle={`${activeDeals.length} opportunities in pipeline`}
        action={
          <button onClick={() => setShowAddDeal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition-colors">
            <Plus size={14} /> Add Deal
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-slate-700">
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Company</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Service</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Value</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Stage</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Probability</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Contact</th>
                <th className="pb-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {activeDeals.map((deal) => (
                <tr key={deal.id} className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 font-medium text-gray-900 dark:text-white">
                    <EditableCell value={deal.company} onSave={(v) => updateDeal(deal.id, { company: v })} />
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">
                    <EditableCell value={deal.service} onSave={(v) => updateDeal(deal.id, { service: v })} />
                  </td>
                  <td className="py-3 font-semibold text-gray-900 dark:text-white">
                    <EditableCell value={deal.value} type="number" onSave={(v) => updateDeal(deal.id, { value: v })} />
                  </td>
                  <td className="py-3">
                    <select
                      value={deal.stage}
                      onChange={(e) => updateDeal(deal.id, { stage: e.target.value })}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${stageColorMap[deal.stage] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${deal.probability >= 80 ? 'bg-emerald-500' : deal.probability >= 60 ? 'bg-blue-500' : deal.probability >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${deal.probability}%` }} />
                      </div>
                      <EditableCell value={deal.probability} type="number" onSave={(v) => updateDeal(deal.id, { probability: Math.min(100, Math.max(0, v)) })} className="text-xs text-gray-600 dark:text-gray-400 w-8" />
                    </div>
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">
                    <EditableCell value={deal.contact} onSave={(v) => updateDeal(deal.id, { contact: v })} />
                  </td>
                  <td className="py-3">
                    <button onClick={() => deleteDeal(deal.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors" title="Delete deal">
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Add Deal Modal */}
      <Modal open={showAddDeal} onClose={() => setShowAddDeal(false)} title="Add New Deal">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
            <input value={newDeal.company} onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Service</label>
            <input value={newDeal.service} onChange={(e) => setNewDeal({ ...newDeal, service: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Value ($)</label>
              <input type="number" value={newDeal.value} onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Probability (%)</label>
              <input type="number" min="0" max="100" value={newDeal.probability} onChange={(e) => setNewDeal({ ...newDeal, probability: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stage</label>
            <select value={newDeal.stage} onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400">
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact</label>
            <input value={newDeal.contact} onChange={(e) => setNewDeal({ ...newDeal, contact: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <button onClick={handleAddDeal} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors">Add Deal</button>
        </div>
      </Modal>
    </div>
  );
}
