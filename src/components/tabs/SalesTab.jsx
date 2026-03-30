import { TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, FunnelChart, Funnel, LabelList,
} from 'recharts';
import StatCard from '../common/StatCard';
import SectionCard from '../common/SectionCard';
import { formatCurrency } from '../../utils/formatters';
import { salesFunnel, activeDeals } from '../../data/dashboardData';

const FUNNEL_COLORS = ['#818cf8', '#6366f1', '#4f46e5', '#4338ca'];

const stageColorMap = {
  Discovery: 'bg-gray-100 text-gray-700',
  Qualified: 'bg-blue-100 text-blue-700',
  Proposal: 'bg-purple-100 text-purple-700',
  Negotiation: 'bg-amber-100 text-amber-700',
  'Closed Won': 'bg-emerald-100 text-emerald-700',
};

export default function SalesTab() {
  const totalPipeline = salesFunnel.reduce((s, f) => s + f.value, 0);
  const closedValue = salesFunnel[salesFunnel.length - 1].value;
  const conversionRate = Math.round((salesFunnel[salesFunnel.length - 1].count / salesFunnel[0].count) * 100);
  const avgDealSize = Math.round(closedValue / salesFunnel[salesFunnel.length - 1].count);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Pipeline" value={formatCurrency(totalPipeline)} icon={DollarSign} color="brand" trend="up" trendValue="+15% this quarter" />
        <StatCard title="Closed Revenue" value={formatCurrency(closedValue)} icon={Award} color="green" trend="up" trendValue="+22% vs last quarter" />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={Target} color="orange" trend="up" trendValue="+3pp improvement" />
        <StatCard title="Avg Deal Size" value={formatCurrency(avgDealSize)} icon={TrendingUp} color="purple" trend="stable" trendValue="Consistent" />
      </div>

      {/* Funnel Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Sales Funnel" subtitle="Leads to Closed Won">
          <div className="space-y-3">
            {salesFunnel.map((stage, idx) => {
              const maxCount = salesFunnel[0].count;
              return (
                <div key={stage.stage} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 w-20 text-right">{stage.stage}</span>
                  <div className="flex-1 relative">
                    <div className="bg-gray-100 rounded-full h-10 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-between px-3 transition-all"
                        style={{
                          width: `${(stage.count / maxCount) * 100}%`,
                          backgroundColor: FUNNEL_COLORS[idx],
                          minWidth: '5rem',
                        }}
                      >
                        <span className="text-xs font-bold text-white">{stage.count}</span>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 12 }} stroke="#94a3b8" width={80} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
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

      {/* Active Deals Table */}
      <SectionCard title="Active Deals" subtitle={`${activeDeals.length} opportunities in pipeline`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-3 font-semibold text-gray-500">Company</th>
                <th className="pb-3 font-semibold text-gray-500">Service</th>
                <th className="pb-3 font-semibold text-gray-500">Value</th>
                <th className="pb-3 font-semibold text-gray-500">Stage</th>
                <th className="pb-3 font-semibold text-gray-500">Probability</th>
                <th className="pb-3 font-semibold text-gray-500">Contact</th>
              </tr>
            </thead>
            <tbody>
              {activeDeals.map((deal) => (
                <tr key={deal.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-medium text-gray-900">{deal.company}</td>
                  <td className="py-3 text-gray-600">{deal.service}</td>
                  <td className="py-3 font-semibold text-gray-900">{formatCurrency(deal.value)}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${stageColorMap[deal.stage] || 'bg-gray-100 text-gray-700'}`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            deal.probability >= 80 ? 'bg-emerald-500' :
                            deal.probability >= 60 ? 'bg-blue-500' :
                            deal.probability >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{deal.probability}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-600">{deal.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
