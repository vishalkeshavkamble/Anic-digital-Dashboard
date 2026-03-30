import { Users, DollarSign, AlertTriangle, Star } from 'lucide-react';
import StatCard from '../common/StatCard';
import SectionCard from '../common/SectionCard';
import { formatCurrency } from '../../utils/formatters';
import { clients } from '../../data/dashboardData';

export default function ClientsTab() {
  const totalMRR = clients.reduce((s, c) => s + c.mrr, 0);
  const avgHealth = Math.round(clients.reduce((s, c) => s + c.health, 0) / clients.length);
  const atRiskCount = clients.filter((c) => c.status === 'at-risk').length;
  const totalAdSpend = clients.reduce((s, c) => s + c.adSpend, 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Clients" value={clients.length} icon={Users} color="brand" trend="up" trendValue="+3 this quarter" />
        <StatCard title="Monthly Recurring" value={formatCurrency(totalMRR)} icon={DollarSign} color="green" trend="up" trendValue="+8% growth" />
        <StatCard title="Avg Health Score" value={avgHealth} icon={Star} color="blue" trend="stable" trendValue="Above target" />
        <StatCard title="At-Risk Clients" value={atRiskCount} icon={AlertTriangle} color="red" trend="down" trendValue="Needs attention" />
      </div>

      {/* Client Table */}
      <SectionCard title="Client Portfolio" subtitle="Full client overview with services and performance">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-3 font-semibold text-gray-500">Client</th>
                <th className="pb-3 font-semibold text-gray-500">Industry</th>
                <th className="pb-3 font-semibold text-gray-500">Services</th>
                <th className="pb-3 font-semibold text-gray-500">Ad Spend</th>
                <th className="pb-3 font-semibold text-gray-500">ROAS</th>
                <th className="pb-3 font-semibold text-gray-500">Health</th>
                <th className="pb-3 font-semibold text-gray-500">MRR</th>
                <th className="pb-3 font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${client.status === 'at-risk' ? 'bg-red-50/50' : ''}`}>
                  <td className="py-3">
                    <div className="font-medium text-gray-900">{client.name}</div>
                    <div className="text-xs text-gray-400">Since {client.since}</div>
                  </td>
                  <td className="py-3 text-gray-600">{client.industry}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {client.services.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-brand-50 text-brand-700 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-gray-700">{client.adSpend > 0 ? formatCurrency(client.adSpend) : '—'}</td>
                  <td className="py-3">
                    {client.roas > 0 ? (
                      <span className={`font-semibold ${client.roas >= 4 ? 'text-emerald-600' : client.roas >= 3 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {client.roas}x
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            client.health >= 90 ? 'bg-emerald-500' :
                            client.health >= 80 ? 'bg-blue-500' :
                            client.health >= 70 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${client.health}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{client.health}</span>
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-gray-900">{formatCurrency(client.mrr)}</td>
                  <td className="py-3">
                    {client.status === 'at-risk' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                        <AlertTriangle size={12} /> At Risk
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Ad Spend Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Total Ad Spend Managed" className="flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAdSpend)}</p>
          <p className="text-sm text-gray-500 mt-1">/month across all clients</p>
        </SectionCard>
        <SectionCard title="Average ROAS" className="flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-bold text-emerald-600">
            {(clients.filter(c => c.roas > 0).reduce((s, c) => s + c.roas, 0) / clients.filter(c => c.roas > 0).length).toFixed(1)}x
          </p>
          <p className="text-sm text-gray-500 mt-1">Return on ad spend</p>
        </SectionCard>
        <SectionCard title="At-Risk Alerts" className="flex flex-col justify-center">
          {clients.filter(c => c.status === 'at-risk').map(c => (
            <div key={c.id} className="flex items-center gap-2 py-2">
              <AlertTriangle size={16} className="text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">Health score: {c.health} — Needs review</p>
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
