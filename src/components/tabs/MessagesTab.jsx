import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import Modal from '../common/Modal';

export default function MessagesTab() {
  const { state } = useApp();
  const [viewMsg, setViewMsg] = useState(null);

  const sorted = [...state.messages].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">◈ Messages Log</h2>
      <div className="space-y-2">
        {sorted.map((msg) => (
          <button key={msg.id} onClick={() => setViewMsg(msg)}
            className="w-full text-left bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${msg.type === 'whatsapp' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>
                  {msg.type === 'whatsapp' ? '📱 WhatsApp' : '📧 Email'}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{msg.clientName}</span>
              </div>
              <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{msg.subject}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{msg.body}</p>
          </button>
        ))}
      </div>

      {viewMsg && (
        <Modal open onClose={() => setViewMsg(null)} title={`${viewMsg.type === 'whatsapp' ? '📱' : '📧'} ${viewMsg.subject}`} wide>
          {viewMsg.type === 'whatsapp' ? (
            <div className="bg-[#e5ddd5] dark:bg-[#0b141a] rounded-xl p-4">
              <div className="bg-[#dcf8c6] dark:bg-[#005c4b] rounded-lg p-4 ml-8 shadow-sm">
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-line leading-relaxed">{viewMsg.body}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 text-right mt-2">{new Date(viewMsg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-slate-800 px-5 py-3 border-b border-gray-200 dark:border-slate-700 text-xs space-y-1">
                <p><span className="text-gray-500">To:</span> <span className="text-gray-900 dark:text-white">{viewMsg.clientName}</span></p>
                <p><span className="text-gray-500">Subject:</span> <span className="text-gray-900 dark:text-white font-medium">{viewMsg.subject}</span></p>
              </div>
              <div className="p-5 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{viewMsg.body}</div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
