import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp, SERVICES_LIST } from '../../store/AppContext';

const PLATFORMS = [
  { id: 'meta', name: 'Meta Ads', color: '#1877F2', icon: '📘' },
  { id: 'google', name: 'Google Ads', color: '#EA4335', icon: '🔍' },
  { id: 'amazon', name: 'Amazon Ads', color: '#FF9900', icon: '📦' },
  { id: 'flipkart', name: 'Flipkart Ads', color: '#2874F0', icon: '🛒' },
  { id: 'shopify', name: 'Shopify', color: '#96BF48', icon: '🏪' },
];

const METRICS = ['spend', 'impressions', 'clicks', 'conversions', 'ctr', 'cpc', 'roas', 'trend'];

function fmtVal(key, val) {
  if (key === 'spend') return `₹${val.toLocaleString()}`;
  if (key === 'impressions' || key === 'clicks' || key === 'conversions') return val.toLocaleString();
  if (key === 'ctr') return `${val}%`;
  if (key === 'cpc') return `₹${val}`;
  if (key === 'roas') return `${val}x`;
  return val;
}

export default function AdPlatformsTab() {
  const { state } = useApp();
  const [activePlatform, setActivePlatform] = useState('meta');
  const data = state.adPlatforms[activePlatform];

  const comparisonData = PLATFORMS.map((p) => ({
    name: p.name.replace(' Ads', ''),
    roas: state.adPlatforms[p.id].roas,
    spend: state.adPlatforms[p.id].spend,
    color: p.color,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">◈ Ad Platforms</h2>
      {/* Platform buttons */}
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <button key={p.id} onClick={() => setActivePlatform(p.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activePlatform === p.id ? 'text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700'}`}
            style={activePlatform === p.id ? { backgroundColor: p.color } : {}}>
            {p.icon} {p.name}
          </button>
        ))}
      </div>
      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((key) => (
          <div key={key} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{key}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{fmtVal(key, data[key])}</p>
          </div>
        ))}
      </div>
      {/* Cross-platform comparison */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Cross-Platform ROAS Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="roas" radius={[6, 6, 0, 0]} name="ROAS">
                {comparisonData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Client-wise breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Client-wise Ad Breakdown</h3>
        <div className="space-y-2">
          {PLATFORMS.map((p) => {
            const pData = state.adPlatforms[p.id];
            const clientNames = pData.clients.map((cid) => state.clients.find((c) => c.id === cid)?.name).filter(Boolean);
            return (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                <span className="text-sm w-6">{p.icon}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-28">{p.name}</span>
                <div className="flex-1 flex flex-wrap gap-1">
                  {clientNames.length > 0 ? clientNames.map((n) => (
                    <span key={n} className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">{n}</span>
                  )) : <span className="text-xs text-gray-400">No clients</span>}
                </div>
                <span className="text-xs font-bold" style={{ color: p.color }}>{pData.roas}x ROAS</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
