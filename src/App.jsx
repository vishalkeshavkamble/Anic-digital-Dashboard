import { useState } from 'react';
import Header from './components/layout/Header';
import TabNav from './components/layout/TabNav';
import OverviewTab from './components/tabs/OverviewTab';
import SalesTab from './components/tabs/SalesTab';
import ClientsTab from './components/tabs/ClientsTab';
import TeamTab from './components/tabs/TeamTab';
import ServicesTab from './components/tabs/ServicesTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'sales' && <SalesTab />}
        {activeTab === 'clients' && <ClientsTab />}
        {activeTab === 'team' && <TeamTab />}
        {activeTab === 'services' && <ServicesTab />}
      </main>
    </div>
  );
}
