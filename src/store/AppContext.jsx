import { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext();

const SERVICES_LIST = [
  { id: 'meta', name: 'Meta Ads', icon: '📘', basePrice: 15000 },
  { id: 'google', name: 'Google Ads', icon: '🔍', basePrice: 15000 },
  { id: 'seo', name: 'SEO', icon: '📈', basePrice: 12000 },
  { id: 'website', name: 'Website', icon: '🌐', basePrice: 25000 },
  { id: 'video', name: 'Video Production', icon: '🎬', basePrice: 20000 },
  { id: 'social', name: 'Social Media', icon: '📱', basePrice: 10000 },
  { id: 'amazon', name: 'Amazon Ads', icon: '📦', basePrice: 12000 },
  { id: 'flipkart', name: 'Flipkart Ads', icon: '🛒', basePrice: 10000 },
  { id: 'shopify', name: 'Shopify Store', icon: '🏪', basePrice: 18000 },
  { id: 'dashboards', name: 'Dashboards', icon: '📊', basePrice: 8000 },
  { id: 'automations', name: 'Automations', icon: '⚡', basePrice: 10000 },
];

const initialState = {
  clients: [
    { id: 1, name: 'TechNova Inc', contact: 'Sarah Chen', phone: '+91 98765 43210', email: 'sarah@technova.io', status: 'active', notes: 'Premium client, high engagement', services: [{ id: 'meta', rating: 5 }, { id: 'google', rating: 4 }, { id: 'seo', rating: 5 }, { id: 'website', rating: 4 }], startDate: '2024-06-01', duration: 12, mrr: 52000 },
    { id: 2, name: 'GreenLeaf Co', contact: 'Mike Torres', phone: '+91 87654 32109', email: 'mike@greenleaf.com', status: 'active', notes: 'E-commerce focused', services: [{ id: 'social', rating: 4 }, { id: 'shopify', rating: 5 }, { id: 'meta', rating: 3 }], startDate: '2024-09-01', duration: 6, mrr: 35000 },
    { id: 3, name: 'UrbanPulse', contact: 'Lisa Park', phone: '+91 76543 21098', email: 'lisa@urbanpulse.in', status: 'active', notes: 'Real estate niche', services: [{ id: 'google', rating: 4 }, { id: 'seo', rating: 4 }, { id: 'video', rating: 3 }], startDate: '2024-03-15', duration: 12, mrr: 47000 },
    { id: 4, name: 'Meridian Finance', contact: 'James Wright', phone: '+91 65432 10987', email: 'james@meridian.fin', status: 'at-risk', notes: 'Payment delays, needs follow-up', services: [{ id: 'website', rating: 3 }, { id: 'seo', rating: 2 }, { id: 'dashboards', rating: 4 }], startDate: '2024-08-01', duration: 6, mrr: 45000 },
    { id: 5, name: 'BlueWave Media', contact: 'Anna Kim', phone: '+91 54321 09876', email: 'anna@bluewave.media', status: 'active', notes: 'Entertainment vertical', services: [{ id: 'social', rating: 5 }, { id: 'video', rating: 5 }, { id: 'meta', rating: 4 }, { id: 'amazon', rating: 3 }], startDate: '2024-07-01', duration: 12, mrr: 58000 },
  ],
  payments: [
    { id: 1, clientId: 1, clientName: 'TechNova Inc', amount: 52000, dueDate: '2026-03-01', status: 'paid', paidDate: '2026-03-01' },
    { id: 2, clientId: 1, clientName: 'TechNova Inc', amount: 52000, dueDate: '2026-04-01', status: 'due', paidDate: null },
    { id: 3, clientId: 2, clientName: 'GreenLeaf Co', amount: 35000, dueDate: '2026-03-15', status: 'paid', paidDate: '2026-03-14' },
    { id: 4, clientId: 2, clientName: 'GreenLeaf Co', amount: 35000, dueDate: '2026-04-15', status: 'due', paidDate: null },
    { id: 5, clientId: 3, clientName: 'UrbanPulse', amount: 47000, dueDate: '2026-03-15', status: 'paid', paidDate: '2026-03-16' },
    { id: 6, clientId: 4, clientName: 'Meridian Finance', amount: 45000, dueDate: '2026-02-01', status: 'overdue', paidDate: null },
    { id: 7, clientId: 4, clientName: 'Meridian Finance', amount: 45000, dueDate: '2026-03-01', status: 'overdue', paidDate: null },
    { id: 8, clientId: 5, clientName: 'BlueWave Media', amount: 58000, dueDate: '2026-04-01', status: 'due', paidDate: null },
  ],
  schedule: [
    { id: 1, title: 'TechNova Product Shoot', date: '2026-04-02', type: 'shoot', clientId: 1 },
    { id: 2, title: 'GreenLeaf Strategy Meeting', date: '2026-04-03', type: 'meeting', clientId: 2 },
    { id: 3, title: 'UrbanPulse Campaign Launch', date: '2026-04-05', type: 'launch', clientId: 3 },
    { id: 4, title: 'Meridian Payment Follow-up', date: '2026-04-01', type: 'payment', clientId: 4 },
    { id: 5, title: 'BlueWave Content Review', date: '2026-04-04', type: 'task', clientId: 5 },
    { id: 6, title: 'New Client Onboarding Call', date: '2026-04-07', type: 'onboarding', clientId: null },
  ],
  messages: [
    { id: 1, clientId: 1, clientName: 'TechNova Inc', type: 'whatsapp', subject: 'Welcome Message', body: 'Hello Sarah! Welcome to Anic Digital. We are thrilled to have TechNova Inc onboard. Your services: Meta Ads, Google Ads, SEO, Website. Our team is ready to deliver exceptional results. — Team Anic Digital', date: '2024-06-01T10:00:00' },
    { id: 2, clientId: 1, clientName: 'TechNova Inc', type: 'email', subject: 'Service Agreement - TechNova Inc', body: 'Dear Sarah,\n\nPlease find attached the service agreement for TechNova Inc.\n\nServices: Meta Ads, Google Ads, SEO, Website\nDuration: 12 months\nMonthly Value: ₹52,000\n\nBest regards,\nAnic Digital', date: '2024-06-01T10:05:00' },
    { id: 3, clientId: 2, clientName: 'GreenLeaf Co', type: 'whatsapp', subject: 'Welcome Message', body: 'Hello Mike! Welcome to Anic Digital. GreenLeaf Co is now part of our family. Services: Social Media, Shopify Store, Meta Ads. Let us grow together! — Team Anic Digital', date: '2024-09-01T11:00:00' },
    { id: 4, clientId: 4, clientName: 'Meridian Finance', type: 'whatsapp', subject: 'Payment Reminder', body: 'Hello James, this is a gentle reminder that payment of ₹45,000 for Meridian Finance is overdue since Feb 1, 2026. Please process at your earliest. — Anic Digital', date: '2026-03-05T09:00:00' },
  ],
  adPlatforms: {
    meta: { spend: 285000, impressions: 4200000, clicks: 126000, conversions: 3780, ctr: 3.0, cpc: 2.26, roas: 4.2, trend: '+12%', clients: [1, 2, 5] },
    google: { spend: 320000, impressions: 5100000, clicks: 178500, conversions: 4462, ctr: 3.5, cpc: 1.79, roas: 4.8, trend: '+18%', clients: [1, 3] },
    amazon: { spend: 145000, impressions: 2800000, clicks: 84000, conversions: 2520, ctr: 3.0, cpc: 1.73, roas: 3.5, trend: '+8%', clients: [5] },
    flipkart: { spend: 98000, impressions: 1900000, clicks: 57000, conversions: 1140, ctr: 3.0, cpc: 1.72, roas: 2.9, trend: '+5%', clients: [] },
    shopify: { spend: 52000, impressions: 850000, clicks: 25500, conversions: 765, ctr: 3.0, cpc: 2.04, roas: 3.2, trend: '+15%', clients: [2] },
  },
  invoices: [
    { id: 1, clientId: 1, clientName: 'TechNova Inc', items: [{ service: 'Meta Ads', amount: 15000 }, { service: 'Google Ads', amount: 15000 }, { service: 'SEO', amount: 12000 }, { service: 'Website', amount: 10000 }], total: 52000, date: '2026-04-01', status: 'sent', number: 'ANIC-2026-001' },
    { id: 2, clientId: 2, clientName: 'GreenLeaf Co', items: [{ service: 'Social Media', amount: 10000 }, { service: 'Shopify Store', amount: 15000 }, { service: 'Meta Ads', amount: 10000 }], total: 35000, date: '2026-04-01', status: 'draft', number: 'ANIC-2026-002' },
  ],
  sheetsConfig: { sheetId: '', tabs: { clients: 'Clients', payments: 'Payments', adData: 'Ad Data' }, autoSync: false, lastSync: null, rowsSynced: { clients: 0, payments: 0, adData: 0 } },
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_CLIENT':
      return { ...state, clients: state.clients.map((c) => (c.id === action.id ? { ...c, ...action.payload } : c)) };
    case 'DELETE_CLIENT':
      return { ...state, clients: state.clients.filter((c) => c.id !== action.id) };
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_PAYMENT':
      return { ...state, payments: state.payments.map((p) => (p.id === action.id ? { ...p, ...action.payload } : p)) };
    case 'ADD_SCHEDULE':
      return { ...state, schedule: [...state.schedule, { ...action.payload, id: Date.now() }] };
    case 'DELETE_SCHEDULE':
      return { ...state, schedule: state.schedule.filter((s) => s.id !== action.id) };
    case 'ADD_MESSAGE':
      return { ...state, messages: [{ ...action.payload, id: Date.now(), date: new Date().toISOString() }, ...state.messages] };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_INVOICE':
      return { ...state, invoices: state.invoices.map((i) => (i.id === action.id ? { ...i, ...action.payload } : i)) };
    case 'UPDATE_SHEETS_CONFIG':
      return { ...state, sheetsConfig: { ...state.sheetsConfig, ...action.payload } };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch, SERVICES_LIST }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

export { SERVICES_LIST };
