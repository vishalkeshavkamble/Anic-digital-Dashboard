import { useState } from 'react';
import { useApp, SERVICES_LIST } from '../../store/AppContext';
import StarRating from '../common/StarRating';
import Modal from '../common/Modal';

const DURATIONS = [
  { months: 1, label: '1 Month', discount: 0 },
  { months: 3, label: '3 Months', discount: 5 },
  { months: 6, label: '6 Months', discount: 10 },
  { months: 12, label: '12 Months', discount: 15 },
];

function WhatsAppPreview({ client, services, onClose }) {
  const svcNames = services.map((s) => SERVICES_LIST.find((sl) => sl.id === s.id)?.name).join(', ');
  return (
    <Modal open onClose={onClose} title="WhatsApp Message Preview">
      <div className="bg-[#e5ddd5] dark:bg-[#0b141a] rounded-xl p-4 space-y-2">
        <div className="bg-[#dcf8c6] dark:bg-[#005c4b] rounded-lg p-3 ml-8 shadow-sm">
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
            Hello {client.contact}! 👋<br /><br />
            Welcome to <b>Anic Digital</b>! We are thrilled to have <b>{client.name}</b> onboard.<br /><br />
            📋 <b>Your Services:</b> {svcNames}<br />
            📅 <b>Duration:</b> {client.duration} months<br />
            💰 <b>Monthly Value:</b> ₹{client.mrr?.toLocaleString()}<br /><br />
            ✅ Your service agreement has been confirmed.<br /><br />
            📞 For support: +91 98765 00000<br />
            📧 Email: hello@anicdigital.com<br /><br />
            Let's grow together! 🚀<br />
            — Team Anic Digital
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 text-right mt-1">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
          </p>
        </div>
      </div>
    </Modal>
  );
}

function EmailPreview({ client, services, onClose }) {
  const svcNames = services.map((s) => SERVICES_LIST.find((sl) => sl.id === s.id)?.name).join(', ');
  return (
    <Modal open onClose={onClose} title="Email Preview" wide>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-slate-800 px-5 py-3 border-b border-gray-200 dark:border-slate-700 text-xs space-y-1">
          <p><span className="text-gray-500">From:</span> <span className="text-gray-900 dark:text-white">hello@anicdigital.com</span></p>
          <p><span className="text-gray-500">To:</span> <span className="text-gray-900 dark:text-white">{client.email}</span></p>
          <p><span className="text-gray-500">Subject:</span> <span className="text-gray-900 dark:text-white font-medium">Welcome to Anic Digital — Service Agreement</span></p>
          <p><span className="text-gray-500">Attachment:</span> <span className="text-indigo-600">📎 Service_Agreement_{client.name.replace(/\s/g, '_')}.pdf</span></p>
        </div>
        <div className="p-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>Dear {client.contact},</p><br />
          <p>Welcome to Anic Digital! We are excited to begin our partnership with <b>{client.name}</b>.</p><br />
          <p>Please find attached your service agreement with the following details:</p><br />
          <p><b>Services:</b> {svcNames}</p>
          <p><b>Duration:</b> {client.duration} months</p>
          <p><b>Monthly Investment:</b> ₹{client.mrr?.toLocaleString()}</p><br />
          <p>We look forward to delivering exceptional results.</p><br />
          <p>Best regards,<br /><b>Team Anic Digital</b><br />hello@anicdigital.com | +91 98765 00000</p>
        </div>
      </div>
    </Modal>
  );
}

function AgreementPreview({ client, services, onClose }) {
  const svcNames = services.map((s) => SERVICES_LIST.find((sl) => sl.id === s.id)?.name);
  const endDate = new Date(client.startDate);
  endDate.setMonth(endDate.getMonth() + client.duration);
  return (
    <Modal open onClose={onClose} title="Service Agreement" wide>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-8 text-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-indigo-600">ANIC DIGITAL</h2>
          <p className="text-xs text-gray-500">Digital Marketing Agency</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4">SERVICE AGREEMENT</h3>
        </div>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p><b>Client:</b> {client.name}</p>
          <p><b>Contact Person:</b> {client.contact}</p>
          <p><b>Email:</b> {client.email}</p>
          <p><b>Phone:</b> {client.phone}</p>
          <hr className="border-gray-200 dark:border-slate-700" />
          <p><b>Services Engaged:</b></p>
          <ul className="list-disc pl-5">{svcNames.map((s) => <li key={s}>{s}</li>)}</ul>
          <p><b>Duration:</b> {client.duration} months ({client.startDate} to {endDate.toISOString().slice(0, 10)})</p>
          <p><b>Monthly Investment:</b> ₹{client.mrr?.toLocaleString()}</p>
          <hr className="border-gray-200 dark:border-slate-700" />
          <p className="text-xs text-gray-500">This agreement is auto-generated by Anic Digital Command Center. Effective upon client onboarding confirmation.</p>
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-slate-700">
            <div><p className="text-xs text-gray-500">For Anic Digital</p><p className="font-bold mt-4">_________________</p></div>
            <div><p className="text-xs text-gray-500">For {client.name}</p><p className="font-bold mt-4">_________________</p></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function OnboardWizard({ onClose }) {
  const { dispatch } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', contact: '', phone: '', email: '', notes: '' });
  const [selectedServices, setSelectedServices] = useState([]);
  const [duration, setDuration] = useState(3);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [preview, setPreview] = useState(null); // 'whatsapp' | 'email' | 'agreement'
  const [onboarded, setOnboarded] = useState(false);

  const discount = DURATIONS.find((d) => d.months === duration)?.discount || 0;
  const baseTotal = selectedServices.reduce((sum, s) => sum + (SERVICES_LIST.find((sl) => sl.id === s.id)?.basePrice || 0), 0);
  const mrr = Math.round(baseTotal * (1 - discount / 100));

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + duration);

  const toggleService = (svcId) => {
    setSelectedServices((prev) => prev.some((s) => s.id === svcId)
      ? prev.filter((s) => s.id !== svcId)
      : [...prev, { id: svcId, rating: 0 }]
    );
  };

  const setServiceRating = (svcId, rating) => {
    setSelectedServices((prev) => prev.map((s) => (s.id === svcId ? { ...s, rating } : s)));
  };

  const clientData = { ...form, services: selectedServices, duration, startDate, mrr, status: 'active' };

  const handleOnboard = () => {
    dispatch({ type: 'ADD_CLIENT', payload: clientData });
    const svcNames = selectedServices.map((s) => SERVICES_LIST.find((sl) => sl.id === s.id)?.name).join(', ');
    dispatch({ type: 'ADD_MESSAGE', payload: { clientId: null, clientName: form.name, type: 'whatsapp', subject: 'Welcome Message', body: `Hello ${form.contact}! Welcome to Anic Digital. ${form.name} is now onboard. Services: ${svcNames}. Duration: ${duration} months. Monthly: ₹${mrr.toLocaleString()}. — Team Anic Digital` } });
    dispatch({ type: 'ADD_MESSAGE', payload: { clientId: null, clientName: form.name, type: 'email', subject: `Service Agreement - ${form.name}`, body: `Dear ${form.contact},\n\nWelcome to Anic Digital! Services: ${svcNames}.\nDuration: ${duration} months.\nMonthly: ₹${mrr.toLocaleString()}.\n\nAttachment: Service_Agreement_${form.name.replace(/\s/g, '_')}.pdf\n\nBest regards,\nAnic Digital` } });
    dispatch({ type: 'ADD_PAYMENT', payload: { clientId: null, clientName: form.name, amount: mrr, dueDate: startDate, status: 'due', paidDate: null } });
    dispatch({ type: 'ADD_INVOICE', payload: { clientId: null, clientName: form.name, items: selectedServices.map((s) => ({ service: SERVICES_LIST.find((sl) => sl.id === s.id)?.name || s.id, amount: SERVICES_LIST.find((sl) => sl.id === s.id)?.basePrice || 0 })), total: mrr, date: startDate, status: 'sent', number: `ANIC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}` } });
    setOnboarded(true);
  };

  if (onboarded) {
    return (
      <div className="text-center py-10 space-y-6">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{form.name} Onboarded!</h2>
        <p className="text-gray-500 dark:text-gray-400">All automations triggered successfully.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => setPreview('whatsapp')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">📱 View WhatsApp</button>
          <button onClick={() => setPreview('email')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">📧 View Email</button>
          <button onClick={() => setPreview('agreement')} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">📄 View Agreement</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">Close</button>
        </div>
        {preview === 'whatsapp' && <WhatsAppPreview client={clientData} services={selectedServices} onClose={() => setPreview(null)} />}
        {preview === 'email' && <EmailPreview client={clientData} services={selectedServices} onClose={() => setPreview(null)} />}
        {preview === 'agreement' && <AgreementPreview client={clientData} services={selectedServices} onClose={() => setPreview(null)} />}
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'}`}>{s}</div>
            {s < 4 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Client Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Client Information</h3>
          {[['name', 'Client Name'], ['contact', 'Contact Person'], ['phone', 'Phone'], ['email', 'Email']].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
              <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <button onClick={() => setStep(2)} disabled={!form.name || !form.contact} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">Next: Select Services →</button>
        </div>
      )}

      {/* Step 2: Services */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Select Services</h3>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES_LIST.map((svc) => {
              const sel = selectedServices.find((s) => s.id === svc.id);
              return (
                <div key={svc.id} onClick={() => toggleService(svc.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${sel ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{svc.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{svc.name}</p>
                      <p className="text-xs text-gray-500">₹{svc.basePrice.toLocaleString()}/mo</p>
                    </div>
                    {sel && <span className="text-indigo-600 text-lg">✓</span>}
                  </div>
                  {sel && (
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                      <StarRating value={sel.rating} onChange={(r) => setServiceRating(svc.id, r)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium">← Back</button>
            <button onClick={() => setStep(3)} disabled={selectedServices.length === 0} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">Next: Duration →</button>
          </div>
        </div>
      )}

      {/* Step 3: Duration & Pricing */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Duration & Pricing</h3>
          <div className="grid grid-cols-2 gap-3">
            {DURATIONS.map((d) => (
              <button key={d.months} onClick={() => setDuration(d.months)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${duration === d.months ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-slate-700'}`}>
                <p className="font-semibold text-gray-900 dark:text-white">{d.label}</p>
                {d.discount > 0 && <p className="text-xs text-green-600 font-medium">{d.discount}% discount</p>}
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Base Total</span><span className="text-gray-900 dark:text-white">₹{baseTotal.toLocaleString()}/mo</span></div>
            {discount > 0 && <div className="flex justify-between text-sm"><span className="text-green-600">Discount ({discount}%)</span><span className="text-green-600">-₹{(baseTotal - mrr).toLocaleString()}</span></div>}
            <div className="flex justify-between text-sm font-bold border-t border-gray-200 dark:border-slate-600 pt-2"><span className="text-gray-900 dark:text-white">Monthly Total</span><span className="text-indigo-600">₹{mrr.toLocaleString()}</span></div>
            <div className="flex justify-between text-xs text-gray-500"><span>End Date</span><span>{endDate.toISOString().slice(0, 10)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium">← Back</button>
            <button onClick={() => setStep(4)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700">Next: Review →</button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Review & Onboard</h3>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-y-2">
              <span className="text-gray-500">Client</span><span className="font-medium text-gray-900 dark:text-white">{form.name}</span>
              <span className="text-gray-500">Contact</span><span className="text-gray-900 dark:text-white">{form.contact}</span>
              <span className="text-gray-500">Phone</span><span className="text-gray-900 dark:text-white">{form.phone}</span>
              <span className="text-gray-500">Email</span><span className="text-gray-900 dark:text-white">{form.email}</span>
              <span className="text-gray-500">Duration</span><span className="text-gray-900 dark:text-white">{duration} months ({startDate} to {endDate.toISOString().slice(0, 10)})</span>
              <span className="text-gray-500">Monthly</span><span className="font-bold text-indigo-600">₹{mrr.toLocaleString()}</span>
            </div>
            <hr className="border-gray-200 dark:border-slate-600" />
            <p className="text-gray-500 font-medium">Services:</p>
            <div className="space-y-1">
              {selectedServices.map((s) => {
                const svc = SERVICES_LIST.find((sl) => sl.id === s.id);
                return (
                  <div key={s.id} className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">{svc?.icon} {svc?.name}</span>
                    <StarRating value={s.rating} readonly size={14} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-sm space-y-1">
            <p className="font-medium text-indigo-700 dark:text-indigo-400">On clicking "Onboard", the following will be auto-triggered:</p>
            <p className="text-indigo-600 dark:text-indigo-300">📱 WhatsApp Welcome Message</p>
            <p className="text-indigo-600 dark:text-indigo-300">📧 Welcome Email with Agreement PDF</p>
            <p className="text-indigo-600 dark:text-indigo-300">📄 Service Agreement Document</p>
            <p className="text-indigo-600 dark:text-indigo-300">🧾 First Invoice Generated</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium">← Back</button>
            <button onClick={handleOnboard} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 text-lg">✦ Onboard Client</button>
          </div>
        </div>
      )}
    </div>
  );
}
