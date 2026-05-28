import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/AppContext';
import { formatINR } from '../lib/dbState';
import { ProjectCategory, ProjectStatus, LeadStatus, Project } from '../types';
import { 
  ShieldCheck, 
  Layers, 
  Trash2, 
  Edit2, 
  Plus, 
  Check, 
  X, 
  Users, 
  IndianRupee, 
  Network, 
  Wallet, 
  SlidersHorizontal,
  ChevronDown,
  AlertCircle,
  Clock,
  Sparkles,
  Building,
  MapPin,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminPanel: React.FC = () => {
  const { 
    user, 
    projects, 
    allLeadsForAdmin, 
    allPayoutsForAdmin, 
    allUsersList,
    toggleUserVerification, 
    updateReferralStatus, 
    updatePayoutStatusByAdmin,
    addNewProject,
    modifyProject,
    removeProject,
    refreshAllData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'leads' | 'brokers' | 'payouts'>('overview');

  // Overview calculations
  const overviewStats = useMemo(() => {
    const totalEarningsAll = allLeadsForAdmin
      .filter(l => l.status === 'converted')
      .reduce((sum, l) => sum + l.commission_amount, 0);

    const pendingPayoutsAll = allPayoutsForAdmin
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalProjects: projects.length,
      totalLeads: allLeadsForAdmin.length,
      convertedLeads: allLeadsForAdmin.filter(l => l.status === 'converted').length,
      totalPayoutsPaid: allPayoutsForAdmin.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
      totalEarningsAll,
      pendingPayoutsAll,
      totalBrokers: allUsersList.filter(u => u.role === 'connector').length
    };
  }, [projects, allLeadsForAdmin, allPayoutsForAdmin, allUsersList]);

  // --- project CRUD admin states ---
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  
  // project inputs
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState<ProjectCategory>('healthcare');
  const [projDesc, setProjDesc] = useState('');
  const [projShortDesc, setProjShortDesc] = useState('');
  const [projValue, setProjValue] = useState('');
  const [projBusiness, setProjBusiness] = useState('');
  const [projLocation, setProjLocation] = useState('');
  const [projRequirements, setProjRequirements] = useState('');
  const [projDeliverables, setProjDeliverables] = useState('');
  const [projTags, setProjTags] = useState('');
  const [projFeatured, setProjFeatured] = useState(false);

  // --- lead action states ---
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // --- payout action states ---
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [activePayoutId, setActivePayoutId] = useState<string | null>(null);
  const [txnRef, setTxnRef] = useState('');
  const [txnNotes, setTxnNotes] = useState('');

  // --- projects manager helpers ---
  const handleOpenCreateProj = () => {
    setEditingProjId(null);
    setProjTitle('');
    setProjCategory('healthcare');
    setProjDesc('');
    setProjShortDesc('');
    setProjValue('100000');
    setProjBusiness('');
    setProjLocation('Mumbai, India');
    setProjRequirements('Requirement 1\nRequirement 2');
    setProjDeliverables('Deliverable 1\nDeliverable 2');
    setProjTags('tech, pos');
    setProjFeatured(false);
    setProjectFormOpen(true);
  };

  const handleEditProjClick = (p: Project) => {
    setEditingProjId(p.id);
    setProjTitle(p.title);
    setProjCategory(p.category);
    setProjDesc(p.description);
    setProjShortDesc(p.short_description);
    setProjValue(p.project_value.toString());
    setProjBusiness(p.business_name);
    setProjLocation(p.business_location);
    setProjRequirements(p.requirements.join('\n'));
    setProjDeliverables(p.deliverables.join('\n'));
    setProjTags(p.tags.join(', '));
    setProjFeatured(p.featured);
    setProjectFormOpen(true);
  };

  const handleProjSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requirements = projRequirements.split('\n').filter(r => r.trim());
    const deliverables = projDeliverables.split('\n').filter(d => d.trim());
    const tags = projTags.split(',').map(t => t.trim()).filter(Boolean);

    const data: Partial<Project> = {
      title: projTitle,
      category: projCategory,
      description: projDesc,
      short_description: projShortDesc,
      project_value: Number(projValue),
      business_name: projBusiness,
      business_location: projLocation,
      requirements,
      deliverables,
      tags,
      featured: projFeatured
    };

    if (editingProjId) {
      modifyProject(editingProjId, data);
    } else {
      addNewProject(data);
    }
    setProjectFormOpen(false);
    refreshAllData();
  };

  const handleDeleteProj = (id: string) => {
    if (window.confirm('Confirm delete project listing permanently?')) {
      removeProject(id);
    }
  };

  // --- lead action helpers ---
  const handleLeadStatusChange = (leadId: string, status: LeadStatus) => {
    if (status === 'rejected') {
      setActiveLeadId(leadId);
      setRejectionReason('');
      setRejectionModalOpen(true);
    } else {
      updateReferralStatus(leadId, status);
    }
  };

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeLeadId && rejectionReason) {
      updateReferralStatus(activeLeadId, 'rejected', rejectionReason);
      setRejectionModalOpen(false);
    }
  };

  // --- payout action helpers ---
  const handleMarkPayoutPaid = (payoutId: string) => {
    setActivePayoutId(payoutId);
    setTxnRef(`TXN${Math.floor(10000000 + Math.random() * 90000000)}M`);
    setTxnNotes('Automated direct settlement approved.');
    setPayoutModalOpen(true);
  };

  const handleConfirmPayoutPaid = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePayoutId && txnRef) {
      updatePayoutStatusByAdmin(activePayoutId, 'paid', txnRef, txnNotes);
      setPayoutModalOpen(false);
    }
  };

  const handleMarkPayoutDisallowed = (payoutId: string) => {
    updatePayoutStatusByAdmin(payoutId, 'rejected', '', 'Compliance mismatch: transaction criteria incomplete.');
  };

  return (
    <div className="font-sans space-y-6">
      
      {/* Overview Head */}
      <div className="pb-4 border-b border-rose-100 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-sans text-rose-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 animate-pulse text-rose-700" /> Administrative Command Node
          </h1>
          <p className="text-xs text-rose-600 mt-1">Platform-wide listing releases, status clearances, connector verifications, and payouts authorization.</p>
        </div>
      </div>

      {/* Tabs list bar */}
      <div className="flex border-b border-rose-50 overflow-x-auto pb-px">
        {[
          { key: 'overview', label: 'Overview Metrics', icon: Layers },
          { key: 'projects', label: 'Projects Manager', icon: Building },
          { key: 'leads', label: 'Leads Pipeline', icon: Network },
          { key: 'brokers', label: 'Brokers Directory', icon: Users },
          { key: 'payouts', label: 'Payout Releases', icon: Wallet }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-4.5 py-3 border-b-2 font-bold text-xs shrink-0 cursor-pointer transition-colors ${
                activeTab === tab.key 
                  ? 'border-rose-600 text-rose-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* --- Tab Panel 1: Overview Metrics --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Listings</span>
              <span className="text-xl font-black text-slate-900 block mt-1">{overviewStats.totalProjects}</span>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Brokers Node Nodes</span>
              <span className="text-xl font-black text-slate-900 block mt-1">{overviewStats.totalBrokers}</span>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Referrals logged</span>
              <span className="text-xl font-black text-slate-900 block mt-1">{overviewStats.totalLeads}</span>
            </div>
            <div className="p-5 bg-rose-50/50 border border-rose-100 rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest block">Total Dispatched payouts</span>
              <span className="text-xl font-black text-rose-900 block mt-1">{formatINR(overviewStats.totalPayoutsPaid)}</span>
            </div>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 top-0 w-1/4 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/35 px-2.5 py-0.5 rounded-full font-bold">Treasury Status</span>
              <h3 className="text-xl font-bold font-sans">Active Escrow Balance: {formatINR(overviewStats.pendingPayoutsAll)}</h3>
              <p className="text-xs text-slate-400 max-w-lg font-normal leading-relaxed">
                Platform-wide payouts currently awaiting administrative clearances. Check settlement routing folders below before approving transaction dispatches.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab Panel 2: Projects CRUD --- */}
      {activeTab === 'projects' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center bg-white p-4.5 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-800">Projects Index Storage: {projects.length} files</span>
            <button 
              onClick={handleOpenCreateProj}
              className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> Add Project brief
            </button>
          </div>

          {projectFormOpen && (
            <div className="bg-white border border-rose-100 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-rose-50">
                <span className="text-xs font-bold font-sans text-rose-850 uppercase tracking-wider">
                  {editingProjId ? 'Update Listing brief' : 'Add New Listing template'}
                </span>
                <button 
                  onClick={() => setProjectFormOpen(false)}
                  className="p-1 hover:bg-slate-50 border border-slate-105 rounded"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleProjSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Company / Proposal Title</label>
                  <input type="text" value={projTitle} onChange={(e) => setProjTitle(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-205 rounded outline-none focus:border-rose-500 bg-white" required />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Commercial category</label>
                  <select value={projCategory} onChange={(e) => setProjCategory(e.target.value as any)} className="w-full p-2 bg-slate-50 border border-slate-205 rounded">
                    {['healthcare', 'beauty', 'fitness', 'legal', 'education', 'real_estate', 'retail', 'restaurant', 'technology', 'finance'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Business Identity Name</label>
                  <input type="text" value={projBusiness} onChange={(e) => setProjBusiness(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-205 rounded" required />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Deployment Location</label>
                  <input type="text" value={projLocation} onChange={(e) => setProjLocation(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-205 rounded" required />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Project Valuation sum (INR)</label>
                  <input type="number" value={projValue} onChange={(e) => setProjValue(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-205 rounded" required />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Short Description snippet</label>
                  <input type="text" value={projShortDesc} onChange={(e) => setProjShortDesc(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-205 rounded" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Full detailed requirements description</label>
                  <textarea value={projDesc} onChange={(e) => setProjDesc(e.target.value)} rows={3} className="w-full p-2 bg-slate-50 border border-slate-205 rounded resize-none" required></textarea>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Requirements (one per line)</label>
                  <textarea value={projRequirements} onChange={(e) => setProjRequirements(e.target.value)} rows={3} className="w-full p-2 bg-slate-50 border border-slate-205 rounded resize-none" required></textarea>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Deliverables (one per line)</label>
                  <textarea value={projDeliverables} onChange={(e) => setProjDeliverables(e.target.value)} rows={3} className="w-full p-2 bg-slate-50 border border-slate-205 rounded resize-none" required></textarea>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Tags (separated by comma)</label>
                  <input type="text" value={projTags} onChange={(e) => setProjTags(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-205 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={projFeatured} onChange={(e) => setProjFeatured(e.target.checked)} className="h-4 w-4 rounded" />
                  <span className="font-bold">Affix Premium featured badges</span>
                </div>

                <div className="md:col-span-2 pt-2.5 flex justify-end">
                  <button type="submit" className="px-5 py-2 bg-slate-900 text-white rounded font-bold cursor-pointer hover:bg-black">
                    {editingProjId ? 'Modify listing record' : 'Publish target listing'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List projects */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs select-none">
              <thead className="bg-[#111827] text-slate-250 border-b border-slate-750 font-bold uppercase tracking-wider">
                <tr className="text-white">
                  <th className="px-6 py-3.5">Listing target</th>
                  <th className="px-6 py-3.5">Vertical</th>
                  <th className="px-6 py-3.5">Project Value</th>
                  <th className="px-6 py-3.5 text-right">Commission (20%)</th>
                  <th className="px-6 py-3.5 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      <div>{p.title}</div>
                      <div className="text-[10px] font-normal text-slate-400 mt-0.5">{p.business_name} • {p.business_location}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-650 rounded-full font-semibold uppercase text-[9px]">{p.category}</span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold">{formatINR(p.project_value)}</td>
                    <td className="px-6 py-3.5 text-right font-bold text-commission">{formatINR(p.commission_amount)}</td>
                    <td className="px-6 py-3.5 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <button onClick={() => handleEditProjClick(p)} className="p-1 text-slate-400 hover:text-slate-800 transition-all cursor-pointer"><Edit2 className="w-4.5 h-4.5" /></button>
                        <button onClick={() => handleDeleteProj(p.id)} className="p-1 text-red-400 hover:text-red-750 transition-all cursor-pointer"><Trash2 className="w-4.5 h-4.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Tab Panel 3: Leads manager --- */}
      {activeTab === 'leads' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs text-slate-650">
              <thead className="bg-[#111827] text-white border-b border-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Client Details</th>
                  <th className="px-6 py-3.5">Broker Node</th>
                  <th className="px-6 py-3.5">Category Target listing</th>
                  <th className="px-6 py-3.5">Current Status</th>
                  <th className="px-6 py-3.5">Transition Stage Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allLeadsForAdmin.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      <div>{l.client_name}</div>
                      <div className="text-[10px] font-mono text-slate-400 font-normal mt-0.5">{l.client_email} • {l.client_phone}</div>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-700">{l.connector_name}</td>
                    <td className="px-6 py-3.5 font-medium truncate max-w-xs">{l.project_title}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                        l.status === 'converted' ? 'bg-emerald-50 text-commission' : (l.status === 'rejected' ? 'bg-red-50 text-alert' : 'bg-blue-50 text-blue-600')
                      } rounded-full`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {l.status === 'converted' || l.status === 'rejected' ? (
                        <span className="text-[10px] text-slate-400 font-medium italic">Milestone finalized</span>
                      ) : (
                        <select 
                          value={l.status} 
                          onChange={(e) => handleLeadStatusChange(l.id, e.target.value as any)}
                          className="p-1 bg-slate-50 border border-slate-205 rounded text-xs text-slate-750 font-sans outline-none focus:border-rose-500"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="under_review">Under Review</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Finalized (Convert)</option>
                          <option value="rejected">Disqualify (Reject)</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Tab Panel 4: Brokers Directory --- */}
      {activeTab === 'brokers' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs text-slate-655">
              <thead className="bg-[#111827] text-white border-b border-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Full Name</th>
                  <th className="px-6 py-3.5">Contact node</th>
                  <th className="px-6 py-3.5">Assigned Location</th>
                  <th className="px-6 py-3.5">Verification status</th>
                  <th className="px-6 py-3.5 text-center">Toggle Verification Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allUsersList.filter(u => u.role === 'connector').map((conn) => (
                  <tr key={conn.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        {conn.full_name}
                        {conn.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 font-normal mt-0.5">ID: {conn.id}</div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-700">{conn.email} • {conn.phone || 'N/A'}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-700">{conn.city || 'N/A'}, {conn.state || 'N/A'}</td>
                    <td className="px-6 py-3.5">
                      {conn.is_verified ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-commission border border-emerald-100 rounded-full text-[9px] uppercase font-bold flex items-center gap-0.5 w-fit">
                          <Check className="w-3 h-3 stroke-[3]" /> Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-450 rounded-full text-[9px] uppercase font-medium">Unverified</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <button 
                        onClick={() => toggleUserVerification(conn.id)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                          conn.is_verified 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-emerald-50 text-commission hover:bg-emerald-100'
                        }`}
                      >
                        {conn.is_verified ? 'Revoke status' : 'Verify Broker'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Tab Panel 5: Payout releases --- */}
      {activeTab === 'payouts' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs text-slate-650">
              <thead className="bg-[#111827] text-white border-b border-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Connector Broker</th>
                  <th className="px-6 py-3.5">Settlement Account details</th>
                  <th className="px-6 py-3.5">Sum requested</th>
                  <th className="px-6 py-3.5">Payout Status</th>
                  <th className="px-6 py-3.5 text-center">Clearance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allPayoutsForAdmin.map((pay: any) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      <div>{pay.connector_name}</div>
                      <div className="text-[10px] font-mono text-slate-400 font-normal mt-0.5">{pay.connector_email}</div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-650 leading-relaxed font-sans font-normal">
                      <div><span className="font-bold">Bank:</span> {pay.bank_name}</div>
                      <div><span className="font-bold">A/C:</span> {pay.account_number} • <span className="font-bold">IFSC:</span> {pay.ifsc_code}</div>
                    </td>
                    <td className="px-6 py-3.5 font-black text-rose-800">{formatINR(pay.amount)}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                        pay.status === 'paid' ? 'bg-emerald-50 text-commission' : (pay.status === 'rejected' ? 'bg-red-50 text-alert' : 'bg-amber-50 text-amber-600')
                      } rounded-full`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {pay.status === 'pending' ? (
                        <div className="flex gap-2 justify-center items-center">
                          <button 
                            onClick={() => handleMarkPayoutPaid(pay.id)}
                            className="p-1.5 bg-emerald-50 text-commission border border-emerald-100 rounded hover:bg-emerald-100 cursor-pointer transition-all shrink-0" 
                            title="Approve & Mark Paid"
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button 
                            onClick={() => handleMarkPayoutDisallowed(pay.id)}
                            className="p-1.5 bg-red-50 text-alert border border-red-100 rounded hover:bg-red-100 cursor-pointer transition-all shrink-0" 
                            title="Reject Request"
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leads rejection explanation details modal drawer */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setRejectionModalOpen(false)} className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-100 space-y-4 font-sans z-10 animate-in fade-in zoom-in-95 leading-normal text-xs animate-none">
            <div className="border-b border-slate-50 pb-2 flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Specify Disqualification Reason</span>
              <button onClick={() => setRejectionModalOpen(false)} className="p-1 hover:bg-slate-50 rounded"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleConfirmRejection} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Qualifying Note reason description</label>
                <textarea 
                  value={rejectionReason} 
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Lead details incorrect, or client size didn't resolve baseline standards"
                  rows={3}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-205 outline-none focus:border-rose-500 rounded-lg resize-none"
                  required
                ></textarea>
              </div>
              <button type="submit" className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer">
                Confirm Lead Disqualification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payout clearance verification modal drawer */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setPayoutModalOpen(false)} className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-100 space-y-4 font-sans z-10 animate-in fade-in zoom-in-95 text-xs animate-none">
            <div className="border-b border-slate-50 pb-2 flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Clearance Reference code</span>
              <button onClick={() => setPayoutModalOpen(false)} className="p-1 hover:bg-slate-50 rounded"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleConfirmPayoutPaid} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bank Wiring transaction refernce id</label>
                <input 
                  type="text" 
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 outline-none focus:border-rose-500 rounded-lg font-mono tracking-widest text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Settlement audit remarks</label>
                <textarea 
                  value={txnNotes}
                  onChange={(e) => setTxnNotes(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-205 outline-none focus:border-rose-500 rounded-lg resize-none text-slate-800"
                ></textarea>
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer uppercase">
                Authorize Dispatched Wire
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
