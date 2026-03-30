import { Briefcase, DollarSign, TrendingUp, Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import StatCard from '../common/StatCard';
import SectionCard from '../common/SectionCard';
import { formatCurrency } from '../../utils/formatters';
import { services, trustedByLogos } from '../../data/dashboardData';

const BAR_COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#4f46e5', '#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706'];

export default function ServicesTab() {
  const totalServiceRevenue = services.reduce((s, svc) => s + svc.revenue, 0);
  const totalClients = new Set(services.flatMap(() => [])).size || services.reduce((s, svc) => s + svc.clients, 0);
  const avgGrowth = Math.round(services.reduce((s, svc) => s + svc.growth, 0) / services.length);
  const topService = services.reduce((top, svc) => svc.revenue > top.revenue ? svc : top, services[0]);

  const chartData = services.map(s => ({ name: s.short, revenue: s.revenue, growth: s.growth }));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Service Revenue" value={formatCurrency(totalServiceRevenue)} icon={DollarSign} color="green" trend="up" trendValue="+18% YoY" />
        <StatCard title="Services Offered" value={services.length} icon={Briefcase} color="brand" trend="stable" trendValue="Full-service agency" />
        <StatCard title="Avg Growth Rate" value={`${avgGrowth}%`} icon={TrendingUp} color="purple" trend="up" trendValue="Across all services" />
        <StatCard title="Top Service" value={topService.short} subtitle={formatCurrency(topService.revenue)} icon={Users} color="blue" />
      </div>

      {/* Revenue by Service Chart */}
      <SectionCard title="Revenue by Service" subtitle="Annual performance breakdown">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => `$${v / 1000}K`} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} name="Revenue">
                {chartData.map((_, idx) => (
                  <Cell key={idx} fill={BAR_COLORS[idx]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Service Menu */}
      <SectionCard title="Complete Service Menu" subtitle="9 core services with growth rates">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((svc) => (
            <div key={svc.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{svc.icon}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                  +{svc.growth}%
                </span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{svc.name}</h4>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-gray-900">{formatCurrency(svc.revenue)}</span>
                <span className="text-xs text-gray-500">{svc.clients} clients</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Trusted By */}
      <SectionCard title="Trusted By" subtitle="Clients across our service portfolio">
        <div className="flex flex-wrap gap-3 justify-center">
          {trustedByLogos.map((name) => (
            <div
              key={name}
              className="px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
