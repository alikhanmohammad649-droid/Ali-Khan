import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../lib/AppContext';
import { formatINR } from '../lib/dbState';
import { LeadCalculator } from '../components/LeadCalculator';
import { 
  Building, 
  MapPin, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  IndianRupee, 
  Calculator, 
  ChevronRight, 
  FileText, 
  Check, 
  Sparkles,
  SendHorizontal,
  Bookmark,
  ShieldCheck
} from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { 
    projects, 
    leads, 
    submitClientReferral, 
    toggleBookmarkedProject, 
    savedProjects,
    user 
  } = useApp();

  // Find active project
  const project = useMemo(() => {
    return projects.find(p => p.slug === slug) || null;
  }, [projects, slug]);

  // Lead Form States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formNotes, setFormNotes] = useState('');
  
  // Auxiliary statuses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Business check: count total leads already submitted for this specific project
  const submittedLeadsCount = useMemo(() => {
    if (!project || !user) return 0;
    return leads.filter(l => l.project_id === project.id).length;
  }, [leads, project, user]);

  const matchesLimit = submittedLeadsCount >= 3;

  // Retrieve similar projects (same category, different ID)
  const similarProjects = useMemo(() => {
    if (!project) return [];
    return projects
      .filter(p => p.category === project.category && p.id !== project.id)
      .slice(0, 3);
  }, [projects, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSubmissionError('');
    setSubmissionSuccess(false);

    if (matchesLimit) {
      setSubmissionError('Compliance Hold: You cannot submit more than 3 referrals for the same contract proposal.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitClientReferral(project.id, {
        client_name: formName,
        client_email: formEmail,
        client_phone: formPhone,
        client_city: formCity,
        client_notes: formNotes
      });
      setSubmissionSuccess(true);
      // Reset fields
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormCity('');
      setFormNotes('');
    } catch (err: any) {
      setSubmissionError(err?.message || 'Referral dispatch failed. Verify format inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) {
    return (
      <div className="font-sans text-center py-16 bg-white border border-slate-100 rounded-xl max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-slate-450 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Project Listing Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">The project slug matches no available entries in the platform database caches.</p>
        <Link to="/projects" className="mt-6 inline-block text-xs font-semibold text-blue-600 hover:underline">← Returns to marketplace</Link>
      </div>
    );
  }

  const isSaved = savedProjects.some(s => s.id === project.id);

  return (
    <div className="font-sans space-y-6">
      
      {/* Navigate row */}
      <div>
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-550 hover:text-slate-950 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Exchange Marketplace
        </Link>
      </div>

      {/* Main Grid Columns: Detail Content Sidebar Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (Span 2): Full Details, deliverables */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Box card */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
            {/* Aspect decorative cover banner */}
            <div className="h-44 w-full relative">
              <img 
                src={project.thumbnail_url} 
                alt={project.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              
              <div className="absolute bottom-5 inset-x-6 flex justify-between items-end text-white">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold bg-blue-600 px-2 py-0.5 rounded border border-blue-500 shadow-sm">
                    {project.category}
                  </span>
                  <h1 className="text-base md:text-xl font-bold tracking-tight mt-1.5 font-sans">
                    {project.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Content body */}
            <div className="p-6 space-y-6">
              
              {/* Business metadata row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-5 border-b border-slate-50 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-450 block text-[10px] uppercase font-bold tracking-wider">Business Partner</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Building className="w-4 h-4 text-slate-400 shrink-0" /> {project.business_name}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-450 block text-[10px] uppercase font-bold tracking-wider">Deploy Location</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" /> {project.business_location}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-1 space-y-0.5">
                  <span className="text-slate-450 block text-[10px] uppercase font-bold tracking-wider">Overall Value tier</span>
                  <span className="font-bold text-slate-900 bg-slate-50 border border-slate-100 rounded px-2 py-0.5 w-fit">
                    {formatINR(project.project_value)}
                  </span>
                </div>
              </div>

              {/* Description body */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Proposal Summary</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-normal">
                  {project.description}
                </p>
              </div>

              {/* Qualifications / Requirements arrays list */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prequalification Requirements</h3>
                <div className="space-y-1.5">
                  {project.requirements.map((req, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-650 leading-relaxed font-sans">
                      <div className="mt-0.5 rounded-full p-0.5 bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables array list */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Deliverables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {project.deliverables.map((del, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-650 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      <div className="h-5 w-5 bg-white border border-slate-205 text-emerald-600 text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Similar projects showcase shelf */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Similar Marketplace Engagements</h3>
            {similarProjects.length === 0 ? (
              <p className="text-xs text-slate-400 bg-white p-6 border border-slate-100 rounded-xl text-center">
                No related category projects present in this database node.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {similarProjects.map((p) => (
                  <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-105 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block mb-1">{p.category}</span>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1 mb-1">{p.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-3">{p.short_description}</p>
                    </div>
                    <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-50">
                      <span className="font-bold text-commission">{formatINR(p.commission_amount)}</span>
                      <button 
                        onClick={() => navigate(`/projects/${p.slug}`)}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Span 1): Pricing Breakdown Slider Form */}
        <div className="space-y-6">
          
          {/* Commission Calculation Highlight Box */}
          <div className="bg-gradient-to-br from-[#0e9f6e]/5 via-[#0e9f6e]/10 to-[#0e9f6e]/5 border border-emerald-200/60 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-emerald-200/45">
              <div className="p-2 bg-emerald-50 text-commission rounded-lg">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider font-sans">Lead Commission Split</h4>
                <p className="text-[11px] text-emerald-800">Direct Broker Compensation Scheme</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-650">
                <span>Core Project Value:</span>
                <span className="font-semibold text-slate-800">{formatINR(project.project_value)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-650">
                <span>Standard Broker Share:</span>
                <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded text-[10px] border border-slate-100">20.00%</span>
              </div>
              
              <div className="pt-3 border-t border-emerald-200/50 flex justify-between items-center text-[#0e9f6e]">
                <span className="font-bold">Total Commission Payout:</span>
                <span className="text-lg font-extrabold font-sans">
                  {formatINR(project.commission_amount)}
                </span>
              </div>
            </div>

            {/* Micro sharing action buttons */}
            <div className="flex justify-between items-center bg-white/70 backdrop-blur-xs p-2.5 rounded-lg border border-emerald-200/35 text-[10px]">
              <span className="font-medium text-slate-500 flex items-center gap-0.5">
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-blue-500 fill-current' : 'text-slate-400'}`} /> Bookmark saved list
              </span>
              <button 
                onClick={() => toggleBookmarkedProject(project.id)}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                {isSaved ? 'Unbookmark' : 'Add bookmark'}
              </button>
            </div>
          </div>

          {/* Integrated sliders forecaster widget */}
          <LeadCalculator commissionAmount={project.commission_amount} projectTitle={project.title} />

          {/* Client Referrals Registration Intake Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-50">
              <SendHorizontal className="w-4.5 h-4.5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Lead Submission Form</h4>
                <p className="text-[10px] text-slate-400">Refer client & trigger track session</p>
              </div>
            </div>

            {/* Submitted status indicator indicator */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-[11px] text-slate-650">
              <span>Your previous referrals:</span>
              <span className={`font-bold ${matchesLimit ? 'text-alert' : 'text-slate-800'}`}>
                {submittedLeadsCount} of 3 limits used
              </span>
            </div>

            {submissionSuccess ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-commission mx-auto" />
                <h4 className="font-bold text-emerald-900 text-xs uppercase text-center leading-tight">Referral Successfully Received</h4>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  The client registry tracking session is now active. Follow pipeline milestones under My Leads ledger list.
                </p>
                <button 
                  onClick={() => setSubmissionSuccess(false)}
                  className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Submit another lead (Limit remaining)
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {submissionError && (
                  <div className="p-2.5 bg-red-50 text-alert border border-red-100 rounded-lg text-[10px] font-semibold leading-relaxed flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{submissionError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Client Legal Name</label>
                  <input 
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Dr. Vivek Singh"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                    required
                    disabled={matchesLimit || isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Email ID</label>
                    <input 
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="client@gmail.com"
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-205 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                      required
                      disabled={matchesLimit || isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Phone</label>
                    <input 
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-205 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                      required
                      disabled={matchesLimit || isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Client Location / City</label>
                  <input 
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Delhi NCR"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-205 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                    required
                    disabled={matchesLimit || isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Core requirements notes</label>
                  <textarea 
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Describe their timeline, budget status, or specific branch counts..."
                    rows={3}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800 resize-none"
                    disabled={matchesLimit || isSubmitting}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={matchesLimit || isSubmitting}
                  className="w-full py-2.5 bg-slate-950 hover:bg-black text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Registering client referral...' : 'Submit Client Lead'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
