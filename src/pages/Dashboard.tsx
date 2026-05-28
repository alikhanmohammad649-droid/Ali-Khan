import React from 'react';
import { useApp } from '../lib/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatINR } from '../lib/dbState';
import { LeadCalculator } from '../components/LeadCalculator';
import { SupabaseOnboarding, isSupabaseConfigured } from '../components/SupabaseOnboarding';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Layers, 
  CheckCircle, 
  IndianRupee, 
  Clock, 
  ArrowUpRight, 
  MapPin, 
  Award, 
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, stats, leads, projects, toggleBookmarkedProject, savedProjects } = useApp();
  const navigate = useNavigate();

  // Pick 4 featured projects
  const featuredProjects = projects.filter(p => p.featured).slice(0, 4);

  // Pick 5 most recent leads
  const recentLeads = leads.slice(0, 5);

  // Line chart data formatting for last 6 months
  const chartData = [
    { month: 'Dec 25', earnings: 15000 },
    { month: 'Jan 26', earnings: 28000 },
    { month: 'Feb 26', earnings: 42000 },
    { month: 'Mar 26', earnings: 40000 },
    { month: 'Apr 26', earnings: 58000 },
    { month: 'May 26', earnings: stats.totalEarnings || 74000 },
  ];

  // Helper for status badge coloration
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200/50 rounded-full">Submitted</span>;
      case 'under_review':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200/50 rounded-full">Under Review</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-200/50 rounded-full">Contacted</span>;
      case 'converted':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-commission border border-emerald-200/50 rounded-full">Converted</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-alert border border-red-200/50 rounded-full">Disqualified</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="font-sans space-y-6">
      
      {/* Supabase Onboarding Helper Banner */}
      <SupabaseOnboarding initiallyOpen={!isSupabaseConfigured()} />
      
      {/* Dynamic Welcome Heading Segment */}
      <div className="bg-gradient-to-r from-slate-900 to-[#1e293b] rounded-2xl p-6 md:p-8 text-white border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/4 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/35 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" /> Active Session Node
              </span>
              {user?.is_verified && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-0.5">
                  <Award className="w-3 h-3 text-emerald-400" /> Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {user?.full_name || 'Partner Broker'}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              Browse pre-qualified projects, calculate custom revenue, and submit introductions. Earn 20% commission values directly from finalized corporate engagements.
            </p>
          </div>
          <div className="shrink-0 flex gap-2">
            <Link 
              to="/projects" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-semibold text-xs rounded-lg shadow-md shadow-blue-500/10 cursor-pointer transition-all flex items-center gap-1.5 text-white"
            >
              Browse Projects
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Total Referrals</span>
            <span className="text-xl font-bold text-slate-900 block">{leads.length}</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-commission rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Conversions</span>
            <span className="text-xl font-bold text-slate-900 block">{leads.filter(l => l.status === 'converted').length}</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Total Earned</span>
            <span className="text-xl font-bold text-[#0e9f6e] block">{formatINR(stats.totalEarnings)}</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Pending Payouts</span>
            <span className="text-xl font-bold text-slate-900 block">{formatINR(stats.pendingPayouts)}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Line Chart of Earnings & Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart Grid - 2/3 wide */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-50 text-slate-700 rounded-lg">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Monthly Revenue Trend</h3>
                  <p className="text-[11px] text-slate-450">Commission analytics and ledger milestones</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-commission bg-emerald-50/50 border border-emerald-100 text-right px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-commission" /> 20% Yield Model
              </span>
            </div>

            {/* Line chart wrapper */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `₹${v/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8' }}
                    itemStyle={{ fontSize: '12px', color: '#10b981' }}
                    formatter={(v: any) => [formatINR(v as number), 'Earnings']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#1a56db" 
                    strokeWidth={3} 
                    activeDot={{ r: 6 }} 
                    dot={{ stroke: '#1a56db', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Links & Info Shelf */}
        <div className="bg-[#111827] text-white p-6 rounded-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-1/3 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:12px_12px] opacity-80 pointer-events-none"></div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Affiliate Tools</span>
            <h3 className="text-base font-bold text-white mb-2">Unique Referral URL</h3>
            <p className="text-xs text-slate-450 leading-relaxed mb-4">
              Expand our private invite-only network. Refer fellow brokers to receive <span className="text-emerald-400 font-bold">INR 250 bonus credits</span> immediately upon their first converted deal.
            </p>

            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-1 mb-4 select-all">
              <span className="text-[10px] font-mono text-blue-400 truncate">
                {window.location.origin}/r/{user?.id || 'partner_node'}
              </span>
            </div>

            <div className="space-y-2">
              <Link 
                to="/leaderboard" 
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              >
                View Network Leaderboard
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 mt-4 text-[10px] text-slate-500 flex justify-between items-center">
            <span>Corporate Commission Code</span>
            <span className="font-mono text-slate-400">#LB-2026-N</span>
          </div>
        </div>

      </div>

      {/* 5 Most Recent Leads */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm">Recent Referrals Processing</h3>
          <Link to="/leads" className="text-xs text-blue-600 hover:underline font-semibold">View all leads</Link>
        </div>

        <div className="overflow-x-auto">
          {recentLeads.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No recent leads recorded. Open the Marketplace to submit of referrals.
            </div>
          ) : (
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-older">
                  <th className="px-5 py-3">Client details</th>
                  <th className="px-5 py-3">Target listing</th>
                  <th className="px-5 py-3">Date Submitted</th>
                  <th className="px-5 py-3">Processing Status</th>
                  <th className="px-5 py-3 text-right">Escrow Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentLeads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      <div>{l.client_name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{l.client_city}</div>
                    </td>
                    <td className="px-5 py-3 truncate max-w-xs">{l.project_title || 'Service Listing'}</td>
                    <td className="px-5 py-3 text-slate-500">{new Date(l.submitted_at).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                    <td className="px-5 py-3">{getStatusBadge(l.status)}</td>
                    <td className="px-5 py-3 text-right font-bold text-commission">{formatINR(l.commission_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4 Featured Project Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 text-sm">Premium Featured Engagements</h3>
          <Link to="/projects" className="text-xs text-blue-600 hover:underline font-semibold">View entire catalog</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProjects.map((proj) => {
            const isBookmarked = savedProjects.some(s => s.id === proj.id);
            return (
              <div 
                key={proj.id} 
                className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 w-full relative overflow-hidden bg-slate-100">
                    <img 
                      src={proj.thumbnail_url} 
                      alt={proj.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <span className="absolute top-2.5 left-2.5 text-[9px] uppercase tracking-wider font-bold bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm">
                      {proj.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 leading-none">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{proj.business_location}</span>
                    </div>

                    <h4 className="font-bold text-slate-950 text-xs tracking-tight line-clamp-1 leading-snug">
                      {proj.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {proj.short_description}
                    </p>

                    <div className="pt-2 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Commission value:</span>
                      <span className="font-bold text-commission">{formatINR(proj.commission_amount)}</span>
                    </div>

                    {/* Integrated calculator preview */}
                    <LeadCalculator commissionAmount={proj.commission_amount} isMini={true} />
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button 
                    onClick={() => navigate(`/projects/${proj.slug}`)}
                    className="w-full py-2 bg-slate-900 border border-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-lg cursor-pointer text-center transition-all"
                  >
                    Refer Corporate Client
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
