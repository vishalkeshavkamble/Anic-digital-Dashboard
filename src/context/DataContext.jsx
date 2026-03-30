import { createContext, useContext, useState } from 'react';
import {
  overviewStats as initialOverviewStats,
  revenueByMonth as initialRevenueByMonth,
  leadSources as initialLeadSources,
  clientHealthScores as initialClientHealthScores,
  clientJourneyStages as initialClientJourneyStages,
  salesFunnel as initialSalesFunnel,
  activeDeals as initialActiveDeals,
  clients as initialClients,
  teamMembers as initialTeamMembers,
  services as initialServices,
  trustedByLogos as initialTrustedByLogos,
} from '../data/dashboardData';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [overviewStats, setOverviewStats] = useState(initialOverviewStats);
  const [revenueByMonth] = useState(initialRevenueByMonth);
  const [leadSources] = useState(initialLeadSources);
  const [clientHealthScores] = useState(initialClientHealthScores);
  const [clientJourneyStages] = useState(initialClientJourneyStages);
  const [salesFunnel, setSalesFunnel] = useState(initialSalesFunnel);
  const [activeDeals, setActiveDeals] = useState(initialActiveDeals);
  const [clients, setClients] = useState(initialClients);
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [services] = useState(initialServices);
  const [trustedByLogos] = useState(initialTrustedByLogos);

  const addDeal = (deal) => {
    setActiveDeals((prev) => [...prev, { ...deal, id: Math.max(...prev.map((d) => d.id)) + 1 }]);
  };
  const deleteDeal = (id) => setActiveDeals((prev) => prev.filter((d) => d.id !== id));
  const updateDeal = (id, updates) => setActiveDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));

  const addClient = (client) => {
    setClients((prev) => [...prev, { ...client, id: Math.max(...prev.map((c) => c.id)) + 1 }]);
  };
  const deleteClient = (id) => setClients((prev) => prev.filter((c) => c.id !== id));
  const updateClient = (id, updates) => setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));

  const addTeamMember = (member) => {
    setTeamMembers((prev) => [...prev, { ...member, id: Math.max(...prev.map((m) => m.id)) + 1 }]);
  };
  const deleteTeamMember = (id) => setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  const updateTeamMember = (id, updates) => setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));

  const updateFunnelStage = (idx, updates) => {
    setSalesFunnel((prev) => prev.map((s, i) => (i === idx ? { ...s, ...updates } : s)));
  };

  return (
    <DataContext.Provider
      value={{
        overviewStats, revenueByMonth, leadSources, clientHealthScores, clientJourneyStages,
        salesFunnel, activeDeals, clients, teamMembers, services, trustedByLogos,
        addDeal, deleteDeal, updateDeal,
        addClient, deleteClient, updateClient,
        addTeamMember, deleteTeamMember, updateTeamMember,
        updateFunnelStage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
