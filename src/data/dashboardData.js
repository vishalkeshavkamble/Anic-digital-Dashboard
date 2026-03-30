// ─── OVERVIEW DATA ───
export const overviewStats = {
  totalRevenue: 2450000,
  revenueTarget: 3000000,
  pipelineValue: 1850000,
  teamUtilization: 82,
  activeClients: 24,
  projectsInProgress: 18,
  avgClientHealth: 87,
};

export const revenueByMonth = [
  { month: 'Jul', revenue: 165000, target: 200000 },
  { month: 'Aug', revenue: 190000, target: 210000 },
  { month: 'Sep', revenue: 210000, target: 220000 },
  { month: 'Oct', revenue: 245000, target: 230000 },
  { month: 'Nov', revenue: 230000, target: 240000 },
  { month: 'Dec', revenue: 260000, target: 250000 },
  { month: 'Jan', revenue: 275000, target: 260000 },
  { month: 'Feb', revenue: 290000, target: 270000 },
  { month: 'Mar', revenue: 285000, target: 280000 },
];

export const leadSources = [
  { source: 'Referrals', value: 35 },
  { source: 'Organic Search', value: 25 },
  { source: 'LinkedIn', value: 20 },
  { source: 'Paid Ads', value: 12 },
  { source: 'Events', value: 8 },
];

export const clientHealthScores = [
  { name: 'TechNova', score: 95, trend: 'up' },
  { name: 'GreenLeaf Co', score: 92, trend: 'up' },
  { name: 'UrbanPulse', score: 88, trend: 'stable' },
  { name: 'Meridian Finance', score: 85, trend: 'up' },
  { name: 'BlueWave Media', score: 78, trend: 'down' },
  { name: 'Apex Retail', score: 72, trend: 'down' },
];

export const clientJourneyStages = [
  { stage: 'Discovery Call', count: 12, color: '#818cf8' },
  { stage: 'Proposal Sent', count: 8, color: '#6366f1' },
  { stage: 'Onboarding', count: 5, color: '#4f46e5' },
  { stage: 'Active Engagement', count: 24, color: '#4338ca' },
  { stage: 'Growth & Upsell', count: 10, color: '#3730a3' },
  { stage: 'Retention', count: 18, color: '#312e81' },
];

// ─── SALES DATA ───
export const salesFunnel = [
  { stage: 'Leads', count: 120, value: 4500000 },
  { stage: 'Qualified', count: 68, value: 2800000 },
  { stage: 'Proposals', count: 32, value: 1850000 },
  { stage: 'Closed Won', count: 18, value: 980000 },
];

export const activeDeals = [
  { id: 1, company: 'TechNova Inc', service: 'Full-Stack Digital', value: 185000, stage: 'Proposal', probability: 85, contact: 'Sarah Chen' },
  { id: 2, company: 'GreenLeaf Co', service: 'SEO & Content', value: 72000, stage: 'Qualified', probability: 60, contact: 'Mike Torres' },
  { id: 3, company: 'UrbanPulse', service: 'Paid Media', value: 120000, stage: 'Proposal', probability: 75, contact: 'Lisa Park' },
  { id: 4, company: 'Meridian Finance', service: 'Web Development', value: 95000, stage: 'Negotiation', probability: 90, contact: 'James Wright' },
  { id: 5, company: 'BlueWave Media', service: 'Social Media', value: 48000, stage: 'Qualified', probability: 45, contact: 'Anna Kim' },
  { id: 6, company: 'Apex Retail', service: 'E-Commerce Strategy', value: 156000, stage: 'Proposal', probability: 70, contact: 'David Lee' },
  { id: 7, company: 'NovaStar Health', service: 'Brand Strategy', value: 88000, stage: 'Discovery', probability: 30, contact: 'Rachel Adams' },
  { id: 8, company: 'Summit Logistics', service: 'PPC & Analytics', value: 64000, stage: 'Negotiation', probability: 85, contact: 'Tom Rivera' },
];

// ─── CLIENTS DATA ───
export const clients = [
  { id: 1, name: 'TechNova Inc', industry: 'SaaS', services: ['SEO', 'Paid Media', 'Web Dev'], adSpend: 45000, roas: 4.2, health: 95, status: 'active', mrr: 18500, since: '2023-03' },
  { id: 2, name: 'GreenLeaf Co', industry: 'E-Commerce', services: ['Social Media', 'Content'], adSpend: 32000, roas: 3.8, health: 92, status: 'active', mrr: 12000, since: '2023-06' },
  { id: 3, name: 'UrbanPulse', industry: 'Real Estate', services: ['Paid Media', 'SEO'], adSpend: 58000, roas: 3.5, health: 88, status: 'active', mrr: 15000, since: '2023-01' },
  { id: 4, name: 'Meridian Finance', industry: 'FinTech', services: ['Web Dev', 'Brand Strategy'], adSpend: 0, roas: 0, health: 85, status: 'active', mrr: 22000, since: '2022-11' },
  { id: 5, name: 'BlueWave Media', industry: 'Entertainment', services: ['Social Media', 'Content', 'Paid Media'], adSpend: 75000, roas: 2.8, health: 78, status: 'at-risk', mrr: 20000, since: '2023-02' },
  { id: 6, name: 'Apex Retail', industry: 'Retail', services: ['E-Commerce', 'SEO', 'Email'], adSpend: 42000, roas: 3.1, health: 72, status: 'at-risk', mrr: 14000, since: '2023-08' },
  { id: 7, name: 'NovaStar Health', industry: 'Healthcare', services: ['Web Dev', 'SEO'], adSpend: 18000, roas: 5.1, health: 91, status: 'active', mrr: 16000, since: '2023-04' },
  { id: 8, name: 'Summit Logistics', industry: 'Logistics', services: ['PPC', 'Analytics'], adSpend: 28000, roas: 3.9, health: 86, status: 'active', mrr: 11000, since: '2022-09' },
  { id: 9, name: 'Prism Design Co', industry: 'Design', services: ['Brand Strategy', 'Web Dev'], adSpend: 0, roas: 0, health: 94, status: 'active', mrr: 9500, since: '2024-01' },
  { id: 10, name: 'Velocity Sports', industry: 'Sports & Fitness', services: ['Social Media', 'Paid Media'], adSpend: 55000, roas: 4.5, health: 90, status: 'active', mrr: 17500, since: '2023-07' },
];

// ─── TEAM DATA ───
export const teamMembers = [
  { id: 1, name: 'Vishal Kamble', role: 'Founder & Strategist', utilization: 92, tasksCompleted: 48, tasksTotal: 52, avatar: 'VK', color: '#4f46e5' },
  { id: 2, name: 'Priya Sharma', role: 'Performance Marketing Lead', utilization: 88, tasksCompleted: 42, tasksTotal: 48, avatar: 'PS', color: '#7c3aed' },
  { id: 3, name: 'Arjun Patel', role: 'SEO Specialist', utilization: 78, tasksCompleted: 35, tasksTotal: 40, avatar: 'AP', color: '#2563eb' },
  { id: 4, name: 'Nisha Reddy', role: 'Content Strategist', utilization: 85, tasksCompleted: 38, tasksTotal: 44, avatar: 'NR', color: '#db2777' },
  { id: 5, name: 'Rahul Mehta', role: 'Web Developer', utilization: 90, tasksCompleted: 45, tasksTotal: 50, avatar: 'RM', color: '#059669' },
  { id: 6, name: 'Anjali Desai', role: 'Social Media Manager', utilization: 76, tasksCompleted: 32, tasksTotal: 38, avatar: 'AD', color: '#d97706' },
  { id: 7, name: 'Karan Singh', role: 'Graphic Designer', utilization: 82, tasksCompleted: 40, tasksTotal: 46, avatar: 'KS', color: '#dc2626' },
  { id: 8, name: 'Meera Joshi', role: 'Account Manager', utilization: 70, tasksCompleted: 28, tasksTotal: 36, avatar: 'MJ', color: '#0891b2' },
];

// ─── SERVICES DATA ───
export const services = [
  { id: 1, name: 'Search Engine Optimization', short: 'SEO', revenue: 320000, clients: 8, growth: 18, icon: '🔍' },
  { id: 2, name: 'Paid Media (PPC)', short: 'PPC', revenue: 450000, clients: 10, growth: 24, icon: '📢' },
  { id: 3, name: 'Social Media Management', short: 'Social', revenue: 280000, clients: 7, growth: 15, icon: '📱' },
  { id: 4, name: 'Content Strategy & Marketing', short: 'Content', revenue: 195000, clients: 6, growth: 22, icon: '✍️' },
  { id: 5, name: 'Web Development', short: 'Web Dev', revenue: 380000, clients: 5, growth: 12, icon: '💻' },
  { id: 6, name: 'Brand Strategy & Identity', short: 'Branding', revenue: 165000, clients: 4, growth: 28, icon: '🎨' },
  { id: 7, name: 'Email Marketing & Automation', short: 'Email', revenue: 120000, clients: 6, growth: 20, icon: '📧' },
  { id: 8, name: 'Analytics & Reporting', short: 'Analytics', revenue: 145000, clients: 8, growth: 16, icon: '📊' },
  { id: 9, name: 'E-Commerce Optimization', short: 'E-Comm', revenue: 210000, clients: 4, growth: 32, icon: '🛒' },
];

export const trustedByLogos = [
  'TechNova', 'GreenLeaf', 'UrbanPulse', 'Meridian Finance',
  'BlueWave Media', 'Apex Retail', 'NovaStar Health', 'Summit Logistics',
  'Prism Design', 'Velocity Sports',
];
