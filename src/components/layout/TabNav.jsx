import { BarChart3, ShoppingCart, Users, UsersRound, Briefcase, StickyNote } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'sales', label: 'Sales', icon: ShoppingCart },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'team', label: 'Team', icon: UsersRound },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'notes', label: 'Notes', icon: StickyNote },
];

export default function TabNav({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 overflow-x-auto">
      <div className="flex gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
