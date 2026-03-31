import { useApp } from '../../store/AppContext';

export default function PaymentsTab() {
  const { state, dispatch } = useApp();

  const markPaid = (id) => dispatch({ type: 'UPDATE_PAYMENT', id, payload: { status: 'paid', paidDate: new Date().toISOString().slice(0, 10) } });

  const sendReminder = (p) => {
    dispatch({ type: 'ADD_MESSAGE', payload: {
      clientId: p.clientId, clientName: p.clientName, type: 'whatsapp', subject: 'Payment Reminder',
      body: `Hello, this is a gentle reminder that payment of ₹${p.amount.toLocaleString()} for ${p.clientName} is ${p.status} (due: ${p.dueDate}). Please process at your earliest. — Anic Digital`,
    }});
    window.open(`https://wa.me/?text=${encodeURIComponent(`Payment Reminder: ₹${p.amount.toLocaleString()} for ${p.clientName} is ${p.status} (due: ${p.dueDate}). — Anic Digital`)}`, '_blank');
  };

  const totals = { paid: 0, due: 0, overdue: 0 };
  state.payments.forEach((p) => { totals[p.status] = (totals[p.status] || 0) + p.amount; });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">◆ Payments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[['Paid', totals.paid, 'bg-emerald-500'], ['Due', totals.due, 'bg-amber-500'], ['Overdue', totals.overdue, 'bg-red-500']].map(([label, val, bg]) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${bg}`} />
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{val.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700/50 text-left">
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Client</th>
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Amount</th>
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Due Date</th>
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.payments.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{p.clientName}</td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">₹{p.amount.toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{p.dueDate}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    p.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                    p.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>{p.status}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    {p.status !== 'paid' && (
                      <>
                        <button onClick={() => markPaid(p.id)} className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700">Mark Paid</button>
                        <button onClick={() => sendReminder(p)} className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">📱 Remind</button>
                      </>
                    )}
                    {p.status === 'paid' && <span className="text-xs text-gray-400">Paid {p.paidDate}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
