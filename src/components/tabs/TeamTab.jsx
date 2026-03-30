import { useState } from 'react';
import { Users, TrendingUp, CheckCircle, Clock, Plus, X } from 'lucide-react';
import StatCard from '../common/StatCard';
import SectionCard from '../common/SectionCard';
import EditableCell from '../common/EditableCell';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';

const AVATAR_COLORS = ['#4f46e5', '#7c3aed', '#2563eb', '#db2777', '#059669', '#d97706', '#dc2626', '#0891b2', '#4338ca', '#9333ea'];

export default function TeamTab() {
  const { teamMembers, addTeamMember, deleteTeamMember, updateTeamMember } = useData();
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', utilization: 50, tasksCompleted: 0, tasksTotal: 10 });

  const avgUtilization = Math.round(teamMembers.reduce((s, m) => s + m.utilization, 0) / teamMembers.length);
  const totalTasksDone = teamMembers.reduce((s, m) => s + m.tasksCompleted, 0);
  const totalTasks = teamMembers.reduce((s, m) => s + m.tasksTotal, 0);
  const completionRate = Math.round((totalTasksDone / totalTasks) * 100);

  const handleAddMember = () => {
    if (!newMember.name) return;
    const initials = newMember.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    addTeamMember({
      ...newMember,
      avatar: initials,
      color: AVATAR_COLORS[teamMembers.length % AVATAR_COLORS.length],
      utilization: Number(newMember.utilization),
      tasksCompleted: Number(newMember.tasksCompleted),
      tasksTotal: Number(newMember.tasksTotal),
    });
    setNewMember({ name: '', role: '', utilization: 50, tasksCompleted: 0, tasksTotal: 10 });
    setShowAddMember(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Team Size" value={teamMembers.length} icon={Users} color="brand" trend="stable" trendValue="Fully staffed" />
        <StatCard title="Avg Utilization" value={`${avgUtilization}%`} icon={Clock} color="purple" trend="up" trendValue="+5% this month" />
        <StatCard title="Tasks Completed" value={totalTasksDone} icon={CheckCircle} color="green" trend="up" trendValue={`of ${totalTasks} total`} />
        <StatCard title="Completion Rate" value={`${completionRate}%`} icon={TrendingUp} color="blue" trend="up" trendValue="Above 85% target" />
      </div>

      <SectionCard
        title="Team Members"
        subtitle="Click names/roles to edit"
        action={
          <button onClick={() => setShowAddMember(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition-colors">
            <Plus size={14} /> Add Member
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => {
            const completionPct = Math.round((member.tasksCompleted / member.tasksTotal) * 100);
            return (
              <div key={member.id} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow relative group">
                <button
                  onClick={() => deleteTeamMember(member.id)}
                  className="absolute top-2 right-2 p-1 text-gray-300 dark:text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove member"
                >
                  <X size={14} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: member.color }}>
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <EditableCell value={member.name} onSave={(v) => updateTeamMember(member.id, { name: v })} className="text-sm font-semibold text-gray-900 dark:text-white block truncate" />
                    <EditableCell value={member.role} onSave={(v) => updateTeamMember(member.id, { role: v })} className="text-xs text-gray-500 dark:text-gray-400 block truncate" />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Utilization</span>
                    <span className={`text-xs font-bold ${member.utilization >= 85 ? 'text-emerald-600' : member.utilization >= 70 ? 'text-blue-600' : 'text-amber-600'}`}>{member.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${member.utilization >= 85 ? 'bg-emerald-500' : member.utilization >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${member.utilization}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Tasks</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{member.tasksCompleted}/{member.tasksTotal}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                    <div className="h-2 rounded-full bg-brand-500 transition-all" style={{ width: `${completionPct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <Modal open={showAddMember} onClose={() => setShowAddMember(false)} title="Add Team Member">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <input value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Utilization %</label>
              <input type="number" min="0" max="100" value={newMember.utilization} onChange={(e) => setNewMember({ ...newMember, utilization: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tasks Done</label>
              <input type="number" value={newMember.tasksCompleted} onChange={(e) => setNewMember({ ...newMember, tasksCompleted: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Tasks</label>
              <input type="number" value={newMember.tasksTotal} onChange={(e) => setNewMember({ ...newMember, tasksTotal: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          </div>
          <button onClick={handleAddMember} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors">Add Member</button>
        </div>
      </Modal>
    </div>
  );
}
