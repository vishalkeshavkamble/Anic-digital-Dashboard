import { Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import StatCard from '../common/StatCard';
import SectionCard from '../common/SectionCard';
import { teamMembers } from '../../data/dashboardData';

export default function TeamTab() {
  const avgUtilization = Math.round(teamMembers.reduce((s, m) => s + m.utilization, 0) / teamMembers.length);
  const totalTasksDone = teamMembers.reduce((s, m) => s + m.tasksCompleted, 0);
  const totalTasks = teamMembers.reduce((s, m) => s + m.tasksTotal, 0);
  const completionRate = Math.round((totalTasksDone / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Team Size" value={teamMembers.length} icon={Users} color="brand" trend="stable" trendValue="Fully staffed" />
        <StatCard title="Avg Utilization" value={`${avgUtilization}%`} icon={Clock} color="purple" trend="up" trendValue="+5% this month" />
        <StatCard title="Tasks Completed" value={totalTasksDone} icon={CheckCircle} color="green" trend="up" trendValue={`of ${totalTasks} total`} />
        <StatCard title="Completion Rate" value={`${completionRate}%`} icon={TrendingUp} color="blue" trend="up" trendValue="Above 85% target" />
      </div>

      {/* Team Member Cards */}
      <SectionCard title="Team Members" subtitle="Individual performance and utilization">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => {
            const completionPct = Math.round((member.tasksCompleted / member.tasksTotal) * 100);
            return (
              <div key={member.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>

                {/* Utilization */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Utilization</span>
                    <span className={`text-xs font-bold ${
                      member.utilization >= 85 ? 'text-emerald-600' :
                      member.utilization >= 70 ? 'text-blue-600' : 'text-amber-600'
                    }`}>{member.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        member.utilization >= 85 ? 'bg-emerald-500' :
                        member.utilization >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${member.utilization}%` }}
                    />
                  </div>
                </div>

                {/* Task Completion */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Tasks</span>
                    <span className="text-xs text-gray-600">{member.tasksCompleted}/{member.tasksTotal}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-brand-500 transition-all"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
