import React, { useMemo } from 'react';
import { useApp } from '../lib/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  HeartPulse, 
  Sparkles, 
  Scale, 
  Activity, 
  GraduationCap, 
  Home, 
  ShoppingBag, 
  Utensils, 
  Cpu, 
  Coins, 
  ArrowRight,
  Layers
} from 'lucide-react';

export const Categories: React.FC = () => {
  const { projects } = useApp();
  const navigate = useNavigate();

  // Categories list with attributes
  const categoriesDb = [
    { value: 'healthcare', label: 'Healthcare & Medical', desc: 'Medical ERP configurations, clinic management nodes, and patient record storage solutions.', icon: HeartPulse, color: 'text-rose-500 bg-rose-50 border-rose-100' },
    { value: 'beauty', label: 'Beauty & Luxury Styling', desc: 'Salon ERP schedulers, makeup artist booking networks, and luxury grooming portals.', icon: Sparkles, color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { value: 'fitness', label: 'Fitness & Wellness Hubs', desc: 'Gym member management platforms, wellness center subscription grids, and trainer rosters.', icon: Activity, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
    { value: 'legal', label: 'Legal & Compliance', desc: 'Corporate legal workflows, virtual contract vaults, and regulatory dispute management nodes.', icon: Scale, color: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
    { value: 'education', label: 'Academic ERP', desc: 'College administration suites, student lifecycle databases, and digital curriculum indexes.', icon: GraduationCap, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { value: 'real_estate', label: 'Real Estate Networks', desc: 'Commercial property portfolios, brokerage transaction ledgers, and property tenant trackers.', icon: Home, color: 'text-purple-500 bg-purple-50 border-purple-100' },
    { value: 'retail', label: 'POS & Retail Systems', desc: 'Multi-outlet point of sale management, real-time inventory synchronizers, and loyalty nodes.', icon: ShoppingBag, color: 'text-slate-600 bg-slate-50 border-slate-105' },
    { value: 'restaurant', label: 'Restaurant Chains', desc: 'Kitchen order display dashboards, restaurant chain supply loggers, and reservation desks.', icon: Utensils, color: 'text-orange-500 bg-orange-50 border-orange-100' },
    { value: 'technology', label: 'Enterprise Software', desc: 'Custom microservice integrations, cloud hosting migration packages, and mainframe security scales.', icon: Cpu, color: 'text-teal-500 bg-teal-50 border-teal-100' },
    { value: 'finance', label: 'Financial Tech Solutions', desc: 'Corporate payroll disbursement gateways, investment management dashboards, and audit logs.', icon: Coins, color: 'text-cyan-500 bg-cyan-50 border-cyan-100' }
  ];

  // Calculate project distribution volumes
  const statsMap = useMemo(() => {
    const map: Record<string, number> = {};
    projects.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [projects]);

  const handleCategorySelect = (categoryValue: string) => {
    // Navigate back to marketplace showing specifically that folder
    navigate(`/projects?category=${categoryValue}`);
  };

  return (
    <div className="font-sans space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-100">
        <h1 className="text-xl font-bold font-sans tracking-tight text-slate-900">Corporate Sectors</h1>
        <p className="text-xs text-slate-500 mt-1">Navigate available project scopes sorted by industrial focus and technical vertical.</p>
      </div>

      {/* Grid allocation catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoriesDb.map((cat) => {
          const Icon = cat.icon;
          const count = statsMap[cat.value] || 0;

          return (
            <div 
              key={cat.value}
              onClick={() => handleCategorySelect(cat.value)}
              className="bg-white p-5 rounded-xl border border-slate-102 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3 text-left">
                {/* Header icon row */}
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-lg border ${cat.color} transition-all group-hover:scale-105`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                    {count} active contract{count !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Info particulars */}
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-xs tracking-tight group-hover:text-blue-600 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-[11px] text-slate-550 leading-relaxed font-sans font-normal">
                    {cat.desc}
                  </p>
                </div>
              </div>

              {/* Bottom arrow anchor link */}
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-blue-600">
                <span>Browse active contracts</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
