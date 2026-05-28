import React from 'react';
import { useApp } from '../lib/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { formatINR } from '../lib/dbState';
import { Bookmark, MapPin, Building, Grid2X2, ArrowRight } from 'lucide-react';

export const SavedProjects: React.FC = () => {
  const { savedProjects, toggleBookmarkedProject } = useApp();
  const navigate = useNavigate();

  return (
    <div className="font-sans space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-100">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">Bookmarked Listings</h1>
        <p className="text-xs text-slate-500 mt-1">Quick-access container of saved client briefs and commission frameworks.</p>
      </div>

      {savedProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-105 p-16 text-center shadow-xs max-w-sm mx-auto space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-full w-fit mx-auto">
            <Bookmark className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Bookmark listing collection empty</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Bookmark listings inside the main marketplace catalog to append target briefs into this folder portal.
          </p>
          <Link 
            to="/projects" 
            className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-black font-semibold text-xs px-4 py-2 rounded-lg text-white transition-all cursor-pointer"
          >
            Explore Projects
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedProjects.map((proj) => (
            <div 
              key={proj.id}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-32 w-full relative">
                  <img 
                    src={proj.thumbnail_url} 
                    alt={proj.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></div>
                  
                  {/* Category and Bookmark floating triggers */}
                  <div className="absolute top-2.5 left-2.5 bg-blue-600 border border-blue-500 text-white font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                    {proj.category}
                  </div>

                  <button
                    onClick={() => toggleBookmarkedProject(proj.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white border border-slate-200 text-blue-600 rounded-full hover:bg-slate-50 cursor-pointer shadow-xs transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <div className="absolute bottom-2.5 left-3.5 text-[9px] text-slate-300 font-medium flex items-center gap-0.5 leading-none">
                    <MapPin className="w-3 h-3 text-slate-205" />
                    <span>{proj.business_location}</span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5 text-left">
                  <h3 
                    onClick={() => navigate(`/projects/${proj.slug}`)}
                    className="font-bold text-slate-950 hover:text-primary cursor-pointer transition-colors text-xs line-clamp-1 leading-snug"
                  >
                    {proj.title}
                  </h3>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Building className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                    <span className="truncate font-semibold text-slate-550">{proj.business_name}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 h-8 leading-relaxed font-sans mt-1">
                    {proj.short_description}
                  </p>

                  <div className="pt-2.5 border-t border-slate-50 flex justify-between items-center text-xs">
                    <span className="text-slate-450">Estimated commission:</span>
                    <span className="font-extrabold text-commission">{formatINR(proj.commission_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button 
                  onClick={() => navigate(`/projects/${proj.slug}`)}
                  className="w-full py-1.5 bg-slate-900 border border-slate-900 hover:bg-black text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                >
                  Refer Client Introductions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
