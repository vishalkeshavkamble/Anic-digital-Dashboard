import { useApp, PIPELINE_STAGES, SALES_REPS } from '../../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function OverviewTab({ onNavigate }) {
  const { state } = useApp();

  const totalMRR = state.clients.reduce((s, c) => s + (c.mrr || 0), 0);
  const totalPaid = state.payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalOverdue = state.payments.filter((p) => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  const pipelineValue = state.leads.filter((l) => !['Churned', 'Active Customer'].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const activeClients = state.clients.filter((c) => c.status === 'active').length;
  const atRiskClients = state.clients.filter((c) => c.status === 'at-risk').length;
  const upcomingEvents = state.schedule.filter((s) => s.date >= new Date().toISOString().slice(0, 10)).length;

  const stageData = PIPELINE_STAGES.map((stage) => {
    const count = state.leads.filter((l) => l.stage === stage).length;
    return { name: stage.split(' ')[0], count };
  });
  const stageColors = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#f97316', '#10b981', '#16a34a', '#ef4444'];

  const repData = SALES_REPS.map((rep) => {
    const leads = state.leads.filter((l) => l.rep === rep);
    const converted = leads.filter((l) => ['Onboarded', 'Active Customer'].includes(l.stage)).length;
    return { name: rep, leads: leads.length, converted };
  });

  const recentMessages = [...state.messages].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const upcomingSchedule = [...state.schedule].filter((s) => s.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome + Quick Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back to Anic Digital</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Here's your agency overview for today</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm card-hover">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Revenue</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{(totalMRR / 1000).toFixed(0)}K</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">from {state.clients.length} clients</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm card-hover">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pipeline Value</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">₹{(pipelineValue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-indigo-500 mt-1">{state.leads.filter((l) => !['Churned', 'Active Customer'].includes(l.stage)).length} active leads</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm card-hover">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Collected</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₹{(totalPaid / 1000).toFixed(0)}K</p>
          {totalOverdue > 0 && <p className="text-xs text-red-500 mt-1">₹{(totalOverdue / 1000).toFixed(0)}K overdue</p>}
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm card-hover">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Clients</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeClients}</p>
          <p className="text-xs mt-1">
            <span className="text-emerald-500">{activeClients} active</span>
            {atRiskClients > 0 && <span className="text-red-500 ml-2">{atRiskClients} at-risk</span>}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Pipeline Funnel</h3>
            <button onClick={() => onNavigate('sales')} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View Pipeline →</button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Leads">
                  {stageData.map((_, i) => <Cell key={i} fill={stageColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rep Performance */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Rep Performance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 13 }} width={50} />
                <Tooltip />
                <Bar dataKey="leads" fill="#818cf8" radius={[0, 6, 6, 0]} name="Total Leads" />
                <Bar dataKey="converted" fill="#10b981" radius={[0, 6, 6, 0]} name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Onboard New Client', icon: '✦', action: 'onboard', color: 'bg-indigo-600 hover:bg-indigo-700' },
              { label: 'View Pipeline', icon: '◉', action: 'sales', color: 'bg-sky-600 hover:bg-sky-700' },
              { label: 'Check Payments', icon: '◆', action: 'payments', color: 'bg-emerald-600 hover:bg-emerald-700' },
              { label: 'Create Invoice', icon: '◇', action: 'invoices', color: 'bg-amber-600 hover:bg-amber-700' },
            ].map((item) => (
              <button key={item.action} onClick={() => onNavigate(item.action)}
                className={`w-full text-left px-4 py-3 rounded-xl text-white font-medium text-sm ${item.color} transition-colors flex items-center gap-3`}>
                <span className="text-lg">{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Messages</h3>
            <button onClick={() => onNavigate('messages')} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All →</button>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0">
                <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 mt-0.5 ${msg.type === 'whatsapp' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>
                  {msg.type === 'whatsapp' ? '📱' : '📧'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{msg.clientName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{msg.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Upcoming</h3>
            <button onClick={() => onNavigate('schedule')} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All →</button>
          </div>
          <div className="space-y-3">
            {upcomingSchedule.length > 0 ? upcomingSchedule.map((evt) => (
              <div key={evt.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0">
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold w-20 shrink-0">{evt.date.slice(5)}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{evt.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{evt.type}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-400 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
