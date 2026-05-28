import React, { useState } from 'react';
import { formatINR } from '../lib/dbState';
import { Calculator, Sparkles, TrendingUp } from 'lucide-react';

interface LeadCalculatorProps {
  commissionAmount: number;
  projectTitle?: string;
  isMini?: boolean;
}

export const LeadCalculator: React.FC<LeadCalculatorProps> = ({ commissionAmount, projectTitle, isMini = false }) => {
  const [pipelineCount, setPipelineCount] = useState<number>(5);
  const [conversionRate, setConversionRate] = useState<number>(40);

  const estimatedConversions = Math.ceil((pipelineCount * conversionRate) / 100);
  const projectedEarnings = estimatedConversions * commissionAmount;

  if (isMini) {
    return (
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mt-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
          <Calculator className="w-3.5 h-3.5 text-primary" />
          <span>Projected Commission Calculator</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-2">
          <div>
            <label className="block mb-1">Target referrals: <span className="font-bold text-slate-800">{pipelineCount}</span></label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={pipelineCount} 
              onChange={(e) => setPipelineCount(Number(e.target.value))}
              className="w-full accent-primary h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block mb-1">Conversion rate: <span className="font-bold text-slate-800">{conversionRate}%</span></label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              step="5"
              value={conversionRate} 
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-primary h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs text-slate-500">
          <span>Est: {estimatedConversions} conversions</span>
          <span className="font-bold text-commission flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" />
            {formatINR(projectedEarnings)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-primary rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Commission Earnings Forecaster</h4>
            <p className="text-xs text-slate-500">{projectTitle || 'Project Listing'}</p>
          </div>
        </div>
        <div className="text-[10px] bg-emerald-50 text-commission font-medium px-2 py-0.5 rounded-full border border-emerald-100">
          20% Fixed Commission Rate
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span>Client Referrals Pipeline Size</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">{pipelineCount} leads</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="30" 
            value={pipelineCount} 
            onChange={(e) => setPipelineCount(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1 client</span>
            <span>15</span>
            <span>30 clients</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span>Target Lead Conversion Rate</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">{conversionRate}%</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="100" 
            step="5"
            value={conversionRate} 
            onChange={(e) => setConversionRate(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>10% (conservative)</span>
            <span>50%</span>
            <span>100% (ideal)</span>
          </div>
        </div>

        <div className="bg-emerald-50/50 rounded-lg p-3.5 border border-emerald-100/60 mt-2 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-commission" /> Projected Conversions ({estimatedConversions})
            </span>
            <div className="text-xl font-bold font-sans text-emerald-800">
              {formatINR(projectedEarnings)}
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>Single conversion value:</p>
            <p className="font-bold text-slate-700">{formatINR(commissionAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
