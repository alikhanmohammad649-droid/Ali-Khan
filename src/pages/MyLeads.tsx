import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatINR } from '../lib/dbState';
import { 
  Network, 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  CornerDownRight, 
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react';

export const MyLeads: React.FC = () => {
  const { leads } = useApp();
  const navigate = useNavigate();

  // Expanded row tracking list
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filterOptions = [
    { value: 'all', label: 'All referrals' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'converted', label: 'Converted' },
    { value: 'rejected', label: 'Disqualified' }
  ];

  // Process filters
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter === 'all') return true;
      return l.status === statusFilter;
    });
  }, [leads, statusFilter]);

  const toggleRow = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  // Helper for status badge coloration
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-250/20 rounded-full">Submitted</span>;
      case 'under_review':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-250/20 rounded-full">Under Review</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-250/20 rounded-full">Contacted</span>;
      case 'converted':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-commission border border-emerald-250/20 rounded-full">Converted</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-alert border border-red-205/20 rounded-full">Disqualified</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="font-sans space-y-6">
      
      {/* Visual top row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-slate-900">Referrals Archive</h1>
          <p className="text-xs text-slate-500 mt-1">Audit statuses, communications timelines, and pending ledger credits.</p>
        </div>

        {/* Filter bar segment */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterOptions.map((opt) => (
            <button 
              key={opt.value}
              onClick={() => {
                setStatusFilter(opt.value);
                setExpandedRowId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all shrink-0 cursor-pointer ${
                statusFilter === opt.value 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-white text-slate-500 border border-slate-200/60 hover:text-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        
        {filteredLeads.length === 0 ? (
          <div className="p-16 text-center max-w-md mx-auto space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-full w-fit mx-auto">
              <Network className="w-8 h-8 text-slate-450" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No referrals in this filter node</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No results match. Register qualified prospects to trigger payouts or navigate the primary listings portal.
            </p>
            <Link 
              to="/projects" 
              className="inline-flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 font-semibold px-4 py-2 rounded-lg text-white text-xs"
            >
              Browse Marketplace
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Referral client</th>
                  <th className="px-6 py-3.5">Assigned project</th>
                  <th className="px-6 py-3.5">Date Submitted</th>
                  <th className="px-6 py-3.5">Milestone Status</th>
                  <th className="px-6 py-3.5">Commission amount</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150/60 text-slate-700">
                {filteredLeads.map((l) => {
                  const isExpanded = expandedRowId === l.id;
                  return (
                    <React.Fragment key={l.id}>
                      <tr 
                        onClick={() => toggleRow(l.id)}
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-slate-50/40' : ''
                        }`}
                      >
                        <td className="px-6 py-3.5 font-bold text-slate-950">
                          <div>{l.client_name}</div>
                          <div className="text-[10px] font-normal text-slate-400 mt-0.5 flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-450 shrink-0" /> {l.client_city}
                          </div>
                        </td>
                        <td className="px-6 py-3.5 truncate max-w-xs">{l.project_title || 'N/A'}</td>
                        <td className="px-6 py-3.5 text-slate-500">{new Date(l.submitted_at).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                        <td className="px-6 py-3.5">{getStatusBadge(l.status)}</td>
                        <td className="px-6 py-3.5 font-extrabold text-[#0e9f6e]">{formatINR(l.commission_amount)}</td>
                        <td className="px-6 py-3.5 text-center">
                          <button 
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-750 transition-all cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Subpanel view */}
                      {isExpanded && (
                        <tr className="bg-slate-50/30">
                          <td colSpan={6} className="px-6 py-4 border-t border-slate-100 text-xs">
                            <div className="flex flex-col md:flex-row gap-6 p-4 bg-white/70 backdrop-blur-xs rounded-xl border border-slate-100 max-w-4xl">
                              
                              {/* Left Client Contact Panel */}
                              <div className="md:w-1/3 space-y-3 border-r border-slate-100 pr-6">
                                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Contact Protocols</span>
                                
                                <div className="space-y-2 text-slate-650">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="font-mono">{l.client_email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="font-mono">{l.client_phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-slate-500">
                                    <span>Lead ID: {l.id}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Requirements/Qualification notes */}
                              <div className="flex-1 space-y-3">
                                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Lead Qualification Briefings</span>
                                
                                <div className="space-y-2">
                                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-slate-750 text-xs font-sans italic leading-relaxed">
                                    "{l.client_notes || 'No added operational notes.'}"
                                  </div>

                                  {/* Red alert for rejections */}
                                  {l.status === 'rejected' && (
                                    <div className="bg-red-50 text-alert border border-red-150 p-3.5 rounded-lg space-y-1">
                                      <div className="flex items-center gap-1.5 font-bold text-red-800 text-[10px] uppercase tracking-wider">
                                        <AlertTriangle className="w-4 h-4 text-red-650" /> Lead Disqualified
                                      </div>
                                      <p className="font-medium leading-relaxed font-sans">{l.rejection_reason}</p>
                                    </div>
                                  )}

                                  {/* Info box for progress */}
                                  {l.status === 'converted' && (
                                    <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 p-2 rounded font-sans leading-relaxed flex items-center gap-1.5">
                                      <div className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-ping"></div>
                                      <span>Commission values credited to available balance. Request release on Payouts desk.</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
