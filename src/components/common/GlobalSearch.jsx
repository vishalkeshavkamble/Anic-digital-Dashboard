import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function GlobalSearch({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const { clients, activeDeals, teamMembers, services } = useData();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const items = [];

    clients.filter((c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q))
      .forEach((c) => items.push({ label: c.name, sub: c.industry, tab: 'clients' }));

    activeDeals.filter((d) => d.company.toLowerCase().includes(q) || d.service.toLowerCase().includes(q) || d.contact.toLowerCase().includes(q))
      .forEach((d) => items.push({ label: d.company, sub: d.service, tab: 'sales' }));

    teamMembers.filter((m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q))
      .forEach((m) => items.push({ label: m.name, sub: m.role, tab: 'team' }));

    services.filter((s) => s.name.toLowerCase().includes(q) || s.short.toLowerCase().includes(q))
      .forEach((s) => items.push({ label: s.name, sub: s.short, tab: 'services' }));

    return items.slice(0, 8);
  }, [query, clients, activeDeals, teamMembers, services]);

  const showDropdown = focused && query.trim().length > 0;

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-1.5 gap-2">
        <Search size={14} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 w-40 md:w-56"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden">
          {results.map((r, i) => (
            <button
              key={i}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
              onMouseDown={() => { onNavigate(r.tab); setQuery(''); }}
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{r.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{r.sub}</p>
              </div>
              <span className="text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full capitalize">{r.tab}</span>
            </button>
          ))}
        </div>
      )}
      {showDropdown && results.length === 0 && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No results found</p>
        </div>
      )}
    </div>
  );
}
