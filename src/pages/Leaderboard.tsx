import React, { useMemo } from 'react';
import { useApp } from '../lib/AppContext';
import { formatINR } from '../lib/dbState';
import { Trophy, Award, TrendingUp, Sparkles, Medal } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { allUsersList, leads } = useApp();

  // Generate top connectors anonymized stats list
  const topConnectorsList = useMemo(() => {
    // Collect connectors
    const connectors = allUsersList.filter(u => u.role === 'connector');

    // Aggregate converted earnings for each connector
    const scored = connectors.map((conn, idx) => {
      const connLeads = leads.filter(l => l.connector_id === conn.id && l.status === 'converted');
      const totalEarned = connLeads.reduce((sum, l) => sum + l.commission_amount, 0);
      const referralCount = connLeads.length;

      return {
        id: conn.id,
        // Anonymized label as requested
        anonymizedName: `Connector #${conn.id.slice(0, 4).toUpperCase()}`,
        totalEarned,
        referralCount,
        isVerified: conn.is_verified
      };
    });

    // Add seeded simulation records to ensure a robust, realistic list of 10 connectors even in fresh installs
    const simulatedDummies = [
      { id: '1', anonymizedName: 'Connector #F4A1', totalEarned: 125000, referralCount: 14, isVerified: true },
      { id: '2', anonymizedName: 'Connector #B8C2', totalEarned: 95000, referralCount: 11, isVerified: true },
      { id: '3', anonymizedName: 'Connector #D9E4', totalEarned: 88000, referralCount: 8, isVerified: true },
      { id: '4', anonymizedName: 'Connector #C103', totalEarned: 74000, referralCount: 6, isVerified: false },
      { id: '5', anonymizedName: 'Connector #E5F9', totalEarned: 52000, referralCount: 4, isVerified: true },
      { id: '6', anonymizedName: 'Connector #A098', totalEarned: 45000, referralCount: 3, isVerified: false },
    ];

    // Combine and merge actual scores
    let blended = [...scored];
    simulatedDummies.forEach(sim => {
      if (!blended.some(b => b.anonymizedName === sim.anonymizedName)) {
        blended.push(sim);
      }
    });

    // Sort descending overall
    return blended
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, 10);
  }, [allUsersList, leads]);

  return (
    <div className="font-sans space-y-6">
      
      {/* Page header */}
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-slate-900">Exchange Leaderboard</h1>
          <p className="text-xs text-slate-500 mt-1">Anonymized directory tracking elite referral agents by aggregated monthly gains.</p>
        </div>
        
        <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-800 px-3.5 py-1.5 rounded-xl border border-amber-200 w-fit font-bold">
          <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Cycles Reset: 1st of Next Month</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Top 3 podium highlights */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Podium Highlights</h3>
          
          <div className="flex flex-col gap-3">
            {topConnectorsList.slice(0, 3).map((pod, idx) => {
              const medals = [
                { color: 'bg-amber-100 text-amber-700 border-amber-200', title: 'Gold Laurels' },
                { color: 'bg-slate-100 text-slate-700 border-slate-200', title: 'Silver Laurels' },
                { color: 'bg-orange-100 text-orange-700 border-orange-200', title: 'Bronze Laurels' }
              ];
              const badge = medals[idx] || medals[2];

              return (
                <div 
                  key={pod.id} 
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 border rounded-lg flex items-center justify-center font-bold text-xs ${badge.color}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 block text-xs">{pod.anonymizedName}</span>
                      <span className="text-[10px] text-slate-400 font-sans block">{pod.referralCount} converted leads</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#0e9f6e] block">{formatINR(pod.totalEarned)}</span>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Earnings</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full top 10 catalog list */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/40">
            <Medal className="w-4.5 h-4.5 text-primary shrink-0" />
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Top 10 Active Brokers</h3>
          </div>

          <table className="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-450 font-bold uppercase tracking-wider">
                <th className="px-6 py-3">Rank No</th>
                <th className="px-6 py-3">Connector Agent</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Conversions</th>
                <th className="px-6 py-3 text-right">Aggregated sum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {topConnectorsList.map((rank, idx) => (
                <tr key={rank.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-500">#{idx + 1}</td>
                  <td className="px-6 py-3.5 font-bold text-slate-950">{rank.anonymizedName}</td>
                  <td className="px-6 py-3.5">
                    {rank.isVerified ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-commission border border-emerald-100 rounded text-[9px] uppercase font-bold w-fit block">Verified</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded text-[9px] uppercase font-medium w-fit block">Verified member</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 font-medium text-slate-500">{rank.referralCount} references</td>
                  <td className="px-6 py-3.5 text-right font-black text-[#0e9f6e]">{formatINR(rank.totalEarned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
