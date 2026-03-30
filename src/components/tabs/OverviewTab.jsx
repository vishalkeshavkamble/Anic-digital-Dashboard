import {
  DollarSign, Target, Users, FolderKanban, Heart, TrendingUp,
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import StatCard from '../common/StatCard';
import SectionCard from '../common/SectionCard';
import { formatCurrency } from '../../utils/formatters';
import {
  overviewStats, revenueByMonth, leadSources,
  clientHealthScores, clientJourneyStages
} from '../../data/dashboardData';

const PIE_COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export default function OverviewTab() {
  const revenuePercent = Math.round((overviewStats.totalRevenue / overviewStats.revenueTarget) * 100);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(overviewStats.totalRevenue)}
          subtitle={`${revenuePercent}% of ${formatCurrency(overviewStats.revenueTarget)} target`}
          icon={DollarSign}
          color="green"
          trend="up"
          trendValue="+12.5% vs last quarter"
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(overviewStats.pipelineValue)}
          subtitle="32 active opportunities"
          icon={Target}
          color="brand"
          trend="up"
          trendValue="+8.3% this month"
        />
        <StatCard
          title="Team Utilization"
          value={`${overviewStats.teamUtilization}%`}
          subtitle="8 team members"
          icon={Users}
          color="purple"
          trend="stable"
          trendValue="On target"
        />
        <StatCard
          title="Active Clients"
          value={overviewStats.activeClients}
          subtitle={`${overviewStats.projectsInProgress} projects in progress`}
          icon={FolderKanban}
          color="blue"
          trend="up"
          trendValue="+3 this quarter"
        />
      </div>

      {/* Revenue vs Target Chart + Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Revenue vs Target" subtitle="Last 9 months" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tickFormatter={(v) => `$${v / 1000}K`} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue" />
                <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Lead Sources" subtitle="Distribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSources}
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  innerRadius={45}
                  dataKey="value"
                  nameKey="source"
                  label={({ source, value }) => `${source} ${value}%`}
                  labelLine={false}
                  style={{ fontSize: 10 }}
                >
                  {leadSources.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Client Health + Journey Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Client Health Scores" subtitle="Top & at-risk accounts">
          <div className="space-y-3">
            {clientHealthScores.map((client) => (
              <div key={client.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    client.score >= 90 ? 'bg-emerald-500' :
                    client.score >= 80 ? 'bg-blue-500' :
                    client.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-700">{client.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        client.score >= 90 ? 'bg-emerald-500' :
                        client.score >= 80 ? 'bg-blue-500' :
                        client.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${client.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{client.score}</span>
                  {client.trend === 'up' && <ArrowUp size={14} className="text-emerald-500" />}
                  {client.trend === 'down' && <ArrowDown size={14} className="text-red-500" />}
                  {client.trend === 'stable' && <Minus size={14} className="text-gray-400" />}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Client Journey Flow" subtitle="Current pipeline stages">
          <div className="space-y-3">
            {clientJourneyStages.map((stage) => (
              <div key={stage.stage} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 w-28 text-right">{stage.stage}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-7 relative overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{
                      width: `${(stage.count / 24) * 100}%`,
                      backgroundColor: stage.color,
                      minWidth: '2rem',
                    }}
                  >
                    <span className="text-xs font-bold text-white">{stage.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
