import { useMemo } from 'react';
import { useData } from '../context/DataContext';

export function useAlerts() {
  const { overviewStats, clients, teamMembers, activeDeals, salesFunnel } = useData();

  return useMemo(() => {
    const alerts = [];

    // Revenue below target
    const revPercent = Math.round((overviewStats.totalRevenue / overviewStats.revenueTarget) * 100);
    if (revPercent < 90) {
      alerts.push({ id: 'rev', type: 'warning', title: 'Revenue Below Target', message: `At ${revPercent}% of $${(overviewStats.revenueTarget / 1e6).toFixed(1)}M target` });
    }

    // At-risk clients
    clients.filter((c) => c.status === 'at-risk').forEach((c) => {
      alerts.push({ id: `risk-${c.id}`, type: 'danger', title: `${c.name} At Risk`, message: `Health score: ${c.health} — Needs immediate review` });
    });

    // Overloaded team members (utilization > 90%)
    teamMembers.filter((m) => m.utilization > 90).forEach((m) => {
      alerts.push({ id: `overload-${m.id}`, type: 'warning', title: `${m.name} Overloaded`, message: `Utilization at ${m.utilization}% — Risk of burnout` });
    });

    // High-probability deals to close
    activeDeals.filter((d) => d.probability >= 85).forEach((d) => {
      alerts.push({ id: `close-${d.id}`, type: 'success', title: `Close ${d.company}`, message: `${d.probability}% probability — $${(d.value / 1000).toFixed(0)}K deal ready to close` });
    });

    return alerts;
  }, [overviewStats, clients, teamMembers, activeDeals, salesFunnel]);
}
