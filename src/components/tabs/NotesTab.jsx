import { useState, useEffect } from 'react';
import { Clock, FileText, Users, DollarSign, FolderKanban } from 'lucide-react';
import SectionCard from '../common/SectionCard';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';

export default function NotesTab() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('anic-notes');
    return saved || 'Daily priorities:\n- \n- \n- \n\nNotes:\n';
  });
  const [time, setTime] = useState(new Date());
  const { overviewStats, clients, teamMembers, activeDeals } = useData();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('anic-notes', notes);
  }, [notes]);

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Live Clock */}
      <SectionCard className="text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <Clock size={20} className="text-brand-500" />
          <span className="text-4xl font-bold text-gray-900 dark:text-white font-mono tracking-wider">{timeStr}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{dateStr}</p>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Notes Pad */}
        <SectionCard title="Daily Priorities & Notes" className="lg:col-span-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-80 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-400 resize-none font-mono leading-relaxed"
            placeholder="Write your daily priorities and notes here..."
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">Auto-saved to browser</p>
            <button
              onClick={() => setNotes('Daily priorities:\n- \n- \n- \n\nNotes:\n')}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </SectionCard>

        {/* Quick Stats Summary */}
        <div className="space-y-4">
          <SectionCard title="Quick Stats">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                  <DollarSign size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(overviewStats.totalRevenue)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <Users size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Clients</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{clients.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <FolderKanban size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Team Members</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{teamMembers.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                  <FileText size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Open Deals</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{activeDeals.length}</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
