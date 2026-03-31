import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import EditableText from '../common/EditableText';
import Modal from '../common/Modal';

function InvoicePreview({ invoice, onClose, onWhatsApp, onEmail }) {
  return (
    <Modal open onClose={onClose} title={`Invoice ${invoice.number}`} wide>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-8 text-sm">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-indigo-600">ANIC DIGITAL</h2>
            <p className="text-xs text-gray-500">Digital Marketing Agency</p>
            <p className="text-xs text-gray-500 mt-1">hello@anicdigital.com | +91 98765 00000</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-white">INVOICE</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.number}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Date: {invoice.date}</p>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bill To</p>
          <p className="font-bold text-gray-900 dark:text-white">{invoice.clientName}</p>
        </div>
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-indigo-200 dark:border-indigo-800">
              <th className="text-left py-2 text-gray-500 dark:text-gray-400">#</th>
              <th className="text-left py-2 text-gray-500 dark:text-gray-400">Service</th>
              <th className="text-right py-2 text-gray-500 dark:text-gray-400">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-slate-700">
                <td className="py-2 text-gray-600 dark:text-gray-400">{i + 1}</td>
                <td className="py-2 text-gray-900 dark:text-white">{item.service}</td>
                <td className="py-2 text-right text-gray-900 dark:text-white">₹{item.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end">
          <div className="w-48">
            <div className="flex justify-between py-2 border-t-2 border-indigo-500">
              <span className="font-bold text-gray-900 dark:text-white">Total Due</span>
              <span className="font-bold text-indigo-600 text-lg">₹{invoice.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="mt-8 text-xs text-gray-500 border-t border-gray-200 dark:border-slate-700 pt-4">
          <p><b>Payment Terms:</b> Net 15 days</p>
          <p><b>Bank:</b> Anic Digital Pvt Ltd | HDFC Bank | A/C: XXXX1234 | IFSC: HDFC0001234</p>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={onWhatsApp} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">📱 Send via WhatsApp</button>
        <button onClick={onEmail} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">📧 Send via Email</button>
      </div>
    </Modal>
  );
}

export default function InvoicesTab() {
  const { state, dispatch } = useApp();
  const [viewInvoice, setViewInvoice] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newInv, setNewInv] = useState({ clientId: '', items: [{ service: '', amount: '' }] });

  const handleCreate = () => {
    const client = state.clients.find((c) => c.id === Number(newInv.clientId));
    if (!client) return;
    const items = newInv.items.filter((i) => i.service && i.amount).map((i) => ({ service: i.service, amount: Number(i.amount) }));
    dispatch({ type: 'ADD_INVOICE', payload: {
      clientId: client.id, clientName: client.name, items, total: items.reduce((s, i) => s + i.amount, 0),
      date: new Date().toISOString().slice(0, 10), status: 'draft', number: `ANIC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    }});
    setShowCreate(false);
    setNewInv({ clientId: '', items: [{ service: '', amount: '' }] });
  };

  const sendWhatsApp = (inv) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { clientId: inv.clientId, clientName: inv.clientName, type: 'whatsapp', subject: `Invoice ${inv.number}`, body: `Hello! Invoice ${inv.number} for ${inv.clientName}.\n\nServices:\n${inv.items.map((i) => `• ${i.service}: ₹${i.amount.toLocaleString()}`).join('\n')}\n\nTotal: ₹${inv.total.toLocaleString()}\n\n— Anic Digital` }});
    dispatch({ type: 'UPDATE_INVOICE', id: inv.id, payload: { status: 'sent' } });
    window.open(`https://wa.me/?text=${encodeURIComponent(`Invoice ${inv.number} - ₹${inv.total.toLocaleString()} for ${inv.clientName}`)}`, '_blank');
    setViewInvoice(null);
  };

  const sendEmail = (inv) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { clientId: inv.clientId, clientName: inv.clientName, type: 'email', subject: `Invoice ${inv.number} - ${inv.clientName}`, body: `Dear ${inv.clientName},\n\nPlease find invoice ${inv.number} attached.\n\nTotal: ₹${inv.total.toLocaleString()}\nPayment Terms: Net 15 days\n\nAttachment: Invoice_${inv.number}.pdf\n\n— Anic Digital` }});
    dispatch({ type: 'UPDATE_INVOICE', id: inv.id, payload: { status: 'sent' } });
    setViewInvoice(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">◇ Invoices</h2>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">+ Create Invoice</button>
      </div>
      {showCreate && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 space-y-3">
          <select value={newInv.clientId} onChange={(e) => setNewInv({ ...newInv, clientId: e.target.value })} className="w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none">
            <option value="">Select client</option>
            {state.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {newInv.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input value={item.service} onChange={(e) => { const items = [...newInv.items]; items[i].service = e.target.value; setNewInv({ ...newInv, items }); }} placeholder="Service" className="flex-1 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none" />
              <input type="number" value={item.amount} onChange={(e) => { const items = [...newInv.items]; items[i].amount = e.target.value; setNewInv({ ...newInv, items }); }} placeholder="Amount" className="w-32 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none" />
            </div>
          ))}
          <button onClick={() => setNewInv({ ...newInv, items: [...newInv.items, { service: '', amount: '' }] })} className="text-sm text-indigo-600 font-medium">+ Add line item</button>
          <button onClick={handleCreate} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700">Create Invoice</button>
        </div>
      )}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700/50 text-left">
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Invoice #</th>
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Client</th>
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Total</th>
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Date</th>
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <td className="px-5 py-3 font-mono text-gray-900 dark:text-white">{inv.number}</td>
                <td className="px-5 py-3">
                  <EditableText value={inv.clientName} onSave={(v) => dispatch({ type: 'UPDATE_INVOICE', id: inv.id, payload: { clientName: v } })} className="font-medium text-gray-900 dark:text-white" />
                </td>
                <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">₹{inv.total.toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{inv.date}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${inv.status === 'sent' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'}`}>{inv.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => setViewInvoice(inv)} className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">View / Send</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewInvoice && <InvoicePreview invoice={viewInvoice} onClose={() => setViewInvoice(null)} onWhatsApp={() => sendWhatsApp(viewInvoice)} onEmail={() => sendEmail(viewInvoice)} />}
    </div>
  );
}
