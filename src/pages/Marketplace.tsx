import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/AppContext';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../lib/dbState';
import { LeadCalculator } from '../components/LeadCalculator';
import { 
  Search, 
  MapPin, 
  Bookmark, 
  MessageSquareShare, 
  Layers, 
  Grid2X2,
  SlidersHorizontal, 
  Sparkles, 
  RotateCcw,
  BookOpenCheck,
  Building,
  Heart,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Share2
} from 'lucide-react';
import { ProjectCategory, ProjectStatus } from '../types';

export const Marketplace: React.FC = () => {
  const { user, projects, toggleBookmarkedProject, savedProjects } = useApp();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [maxCommissionLimit, setMaxCommissionLimit] = useState<number>(30000);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  // Constants
  const CATEGORIES = [
    { value: 'all', label: 'All Services' },
    { value: 'healthcare', label: 'Healthcare & Medical' },
    { value: 'beauty', label: 'Beauty & Luxury Styling' },
    { value: 'fitness', label: 'Fitness & Wellness Hubs' },
    { value: 'legal', label: 'Legal & Compliance' },
    { value: 'education', label: 'Academic ERP' },
    { value: 'real_estate', label: 'Real Estate Networks' },
    { value: 'retail', label: 'POS & Retail Systems' },
    { value: 'restaurant', label: 'Restaurant Chains' },
    { value: 'technology', label: 'Enterprise Software' },
    { value: 'finance', label: 'Financial Tech Solutions' }
  ];

  const STATUSES = [
    { value: 'all', label: 'All statuses' },
    { value: 'active', label: 'Active listing' },
    { value: 'paused', label: 'Paused listing' }
  ];

  // Process filters
  const filteredProjects = useMemo(() => {
    // Sort featured projects always first as requested by business rules
    let pool = [...projects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return pool.filter((p) => {
      // Search matches
      const query = searchTerm.toLowerCase();
      const matchesSearch = 
        !searchTerm || 
        p.title.toLowerCase().includes(query) || 
        p.business_name.toLowerCase().includes(query) || 
        p.tags.some(t => t.toLowerCase().includes(query));

      // Category matches
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      // Status matches
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

      // Commission limit match
      const matchesCommission = p.commission_amount <= maxCommissionLimit;

      // Featured match
      const matchesFeatured = !featuredOnly || p.featured;

      return matchesSearch && matchesCategory && matchesStatus && matchesCommission && matchesFeatured;
    });
  }, [projects, searchTerm, selectedCategory, selectedStatus, maxCommissionLimit, featuredOnly]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('active');
    setMaxCommissionLimit(30000);
    setFeaturedOnly(false);
    setCurrentPage(1);
  };

  // WhatsApp share generator
  const getWhatsAppShareLink = (title: string, businessName: string, commission: number) => {
    const refereeSuffix = user ? `?ref=${user.id}` : '';
    const textMsg = `Hello! LeadBridge is presenting an elite commercial referral opportunity: "${title}" by ${businessName}. Recommend qualified corporate clients to earn an estimated commission of ${formatINR(commission)}. Register and checkout specifics: ${window.location.origin}/projects/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}${refereeSuffix}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`;
  };

  return (
    <div className="font-sans space-y-6">
      
      {/* Visual Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-slate-900">Exchange Marketplace</h1>
          <p className="text-xs text-slate-500 mt-1">Acquire elite commercial leads scopes and project allocations seamlessly.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Matching results: {filteredProjects.length} agencies</span>
        </div>
      </div>

      {/* Main Filter columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Filter Sidebar */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5ClassName">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Filter Options
            </span>
            <button 
              onClick={resetFilters}
              className="text-[10px] text-slate-500 hover:text-slate-950 flex items-center gap-0.5 hover:underline"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search container */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Keywords match</label>
            <div className="relative">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enterprise title, tags..."
                className="w-full text-xs pl-8 pr-3 py-2 outline-none border border-slate-200 focus:border-primary focus:bg-white bg-slate-50 text-slate-800 rounded-lg"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Categories select options list */}
          <div className="space-y-1.5">
            <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Business Vertical</span>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`text-left px-2.5 py-1.5 rounded-md text-[11px] font-semibold tracking-wide transition-colors ${
                    selectedCategory === cat.value 
                      ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Commission threshold range slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-slate-650">
              <span className="uppercase text-[10px] font-semibold text-slate-400 tracking-wider">Commission Ceiling</span>
              <span className="font-bold text-slate-850">{formatINR(maxCommissionLimit)}</span>
            </div>
            <input 
              type="range"
              min="5000"
              max="35000"
              step="1000"
              value={maxCommissionLimit}
              onChange={(e) => setMaxCommissionLimit(Number(e.target.value))}
              className="w-full accent-primary h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 leading-none">
              <span>₹5k limit</span>
              <span>₹20k</span>
              <span>₹35k max</span>
            </div>
          </div>

          {/* Status radio list */}
          <div className="space-y-1.5">
            <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Listing Status</span>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full outline-none border border-slate-200 text-xs text-slate-650 p-2 rounded-lg bg-slate-50"
            >
              {STATUSES.map((st) => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>

          {/* Featured only checkbox toggle */}
          <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700">Premium Featured Only</span>
            <input 
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-50 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Right 3-Column Catalog Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {paginatedProjects.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-16 text-center shadow-xs">
              <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-fit mx-auto mb-4 border border-slate-105">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">No matches found in active enclaves</h3>
              <p className="text-xs text-slate-550 max-w-sm mx-auto mb-6">
                Adjust or reset your filters parameters (such as search keyword, category, or commission caps) to reveal more matching target contracts.
              </p>
              <button 
                onClick={resetFilters}
                className="py-1.5 px-4 bg-slate-900 hover:bg-black text-xs font-bold rounded-lg text-white transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedProjects.map((proj) => {
                  const isSaved = savedProjects.some(s => s.id === proj.id);
                  return (
                    <div 
                      key={proj.id}
                      className={`bg-white rounded-xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                        proj.featured ? 'border-blue-100 bg-blue-50/5' : 'border-slate-100'
                      }`}
                    >
                      <div>
                        {/* Top Banner Cover */}
                        <div className="h-32 w-full relative overflow-hidden bg-slate-150">
                          <img 
                            src={proj.thumbnail_url} 
                            alt={proj.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          
                          {/* Floating items */}
                          <div className="absolute top-2.5 inset-x-2.5 flex justify-between items-center z-10">
                            <span className="text-[8px] uppercase tracking-wider font-extrabold bg-slate-900/90 text-white backdrop-blur-xs px-2 py-0.5 rounded border border-slate-800">
                              {proj.category}
                            </span>
                            
                            {/* Bookmark bookmark Icon */}
                            <button 
                              onClick={() => toggleBookmarkedProject(proj.id)}
                              className={`p-1.5 rounded-full backdrop-blur-md cursor-pointer border shadow-xs transition-colors ${
                                isSaved 
                                  ? 'bg-blue-600 text-white border-blue-500' 
                                  : 'bg-white/85 text-slate-650 hover:bg-white border-slate-200'
                              }`}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="absolute bottom-2 inset-x-2.5 flex justify-between items-end text-white">
                            <div className="flex items-center gap-0.5 text-[9px] text-slate-300 font-medium">
                              <MapPin className="w-3 h-3 text-slate-200 shrink-0" />
                              <span className="truncate max-w-28">{proj.business_location}</span>
                            </div>
                            {proj.featured && (
                              <span className="text-[8px] font-bold tracking-wider bg-orange-600 border border-orange-500 uppercase px-1.5 py-0.5 rounded text-white flex items-center gap-0.5 shadow-sm">
                                <Sparkles className="w-2.5 h-2.5 fill-current" /> Premium
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Contents */}
                        <div className="p-4 space-y-2">
                          <h3 
                            onClick={() => navigate(`/projects/${proj.slug}`)}
                            className="font-bold text-slate-900 hover:text-primary cursor-pointer transition-colors text-xs tracking-tight line-clamp-1 leading-snug"
                          >
                            {proj.title}
                          </h3>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate font-semibold text-slate-600">{proj.business_name}</span>
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed h-8">
                            {proj.short_description}
                          </p>

                          {/* Rupee indicator green info box */}
                          <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                            <span className="text-slate-450">Commission reward:</span>
                            <span className="font-extrabold text-[#0e9f6e] flex items-center gap-0.5">
                              {formatINR(proj.commission_amount)}
                            </span>
                          </div>

                          {/* Core commission forecaster integrated slider tool */}
                          <LeadCalculator commissionAmount={proj.commission_amount} isMini={true} />
                        </div>
                      </div>

                      {/* Card Actions Bottom */}
                      <div className="p-4 pt-0 flex gap-2">
                        <button 
                          onClick={() => navigate(`/projects/${proj.slug}`)}
                          className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer text-center text-[10px]"
                        >
                          Submit Lead
                        </button>
                        
                        {/* WhatsApp widget trigger */}
                        <a 
                          href={getWhatsAppShareLink(proj.title, proj.business_name, proj.commission_amount)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 border border-slate-200 hover:border-slate-350 bg-white text-slate-650 hover:bg-slate-50 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs font-sans"
                          title="Share client pitch on WhatsApp"
                        >
                          <MessageSquareShare className="w-4 h-4 text-emerald-600" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Functional Pagination Bar */}
              {totalPages > 1 && (
                <div className="pt-4 flex justify-between items-center border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
                  <div className="flex gap-2">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                      className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-40 disabled:hover:bg-white text-slate-600 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                      className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-40 disabled:hover:bg-white text-slate-600 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

    </div>
  );
};
