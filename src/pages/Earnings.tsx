import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';
import { formatINR } from '../lib/dbState';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Wallet, 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  X, 
  Building, 
  CreditCard, 
  User, 
  AlertCircle,
  TrendingUp,
  Receipt,
  FileMinus
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Earnings: React.FC = () => {
  const { user, stats, payouts, submitPayoutRelease, refreshAllData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [bankName, setBankName] = useState(user?.bank_name || '');
  const [accountNo, setAccountNo] = useState(user?.account_number || '');
  const [ifsc, setIfsc] = useState(user?.ifsc_code || '');
  const [holder, setHolder] = useState(user?.account_holder_name || user?.full_name || '');
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Bar chart earnings data
  const barChartData = [
    { name: 'Jan 26', amount: 15000 },
    { name: 'Feb 26', amount: 12000 },
    { name: 'Mar 26', amount: 18000 },
    { name: 'Apr 26', amount: 21000 },
    { name: 'May 26', amount: stats.totalEarnings - 48000 || 26000 }
  ];

  const handleOpenModal = () => {
    if (stats.availableBalance < 500) {
      toast.error('Compliance hold: Available balance must equal or exceed INR 500 to initiate release requests.');
      return;
    }
    setFormError('');
    setPayoutAmount(Math.min(10000, stats.availableBalance).toString());
    setBankName(user?.bank_name || '');
    setAccountNo(user?.account_number || '');
    setIfsc(user?.ifsc_code || '');
    setHolder(user?.account_holder_name || user?.full_name || '');
    setModalOpen(true);
  };

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const amt = Number(payoutAmount);
    if (!payoutAmount || isNaN(amt)) {
      setFormError('Please input a valid release format amount.');
      return;
    }
    if (amt < 500) {
      setFormError('Minimum single payout release is INR 500.');
      return;
    }
    if (amt > stats.availableBalance) {
      setFormError(`Request exceeds available balance size of ${formatINR(stats.availableBalance)}`);
      return;
    }
    if (!bankName || !accountNo || !ifsc || !holder) {
      setFormError('Please provide complete routing bank target details.');
      return;
    }

    setSubmitting(true);
    try {
      await submitPayoutRelease(amt, {
        bank_name: bankName,
        account_number: accountNo,
        ifsc_code: ifsc,
        account_holder_name: holder
      });
      setModalOpen(false);
      refreshAllData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to dispatch payout request.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for status badge coloration
  const getPayoutStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200/50 rounded-full">Pending approval</span>;
      case 'approved':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200/50 rounded-full">Approved</span>;
      case 'paid':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-commission border border-emerald-250/30 rounded-full">Dispatched (Paid)</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-alert border border-red-200/50 rounded-full">Rejected</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-slate-50 text-slate-550 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="font-sans space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-slate-900">Earnings Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Audit commissions ledger, file bank transfer requests, and edit remittance routes.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5 transition-all text-center"
        >
          <ArrowUpRight className="w-4 h-4" /> Request Payout Release
        </button>
      </div>

      {/* Financial totals cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-commission rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Commission</span>
            <span className="text-lg font-black text-[#0e9f6e] block">{formatINR(stats.totalEarnings)}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pending Review</span>
            <span className="text-lg font-black text-slate-900 block">{formatINR(stats.pendingPayouts)}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-700 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Paid Out</span>
            <span className="text-lg font-black text-slate-900 block">{formatINR(stats.paidPayouts)}</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-gradient-to-br from-slate-900 to-[#1e293b] text-white p-5 rounded-xl shadow-xs border border-slate-800 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-blue-500/20 text-blue-400 border border-blue-500/35 rounded-lg z-10">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="min-w-0 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Available Balance</span>
            <span className="text-lg font-black text-white block">{formatINR(stats.availableBalance)}</span>
          </div>
          <div className="absolute right-0 bottom-0 w-1/3 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:12px_12px] opacity-80 pointer-events-none"></div>
        </div>
      </div>

      {/* Main Grid: Bar Chart and Bank instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly earnings bar chart */}
        <div className="lg:col-span-2 bg-white p-5 border border-slate-100 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-50">
            <TrendingUp className="w-5 h-5 text-commission shrink-0" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Monthly Generated Gains</h3>
              <p className="text-[10px] text-slate-450">Brokering revenue credits timeline</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '11px', color: '#10b981' }}
                  formatter={(v: any) => [formatINR(v as number), 'Earnings']}
                />
                <Bar dataKey="amount" fill="#0e9f6e" radius={[4, 4, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bank Details Sidebar overview card */}
        <div className="bg-white p-5 border border-slate-100 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-50">
            <Building className="w-5 h-5 text-slate-450 shrink-0" />
            <div>
              <h3 className="font-semibold text-slate-905 text-sm">Settlement Account</h3>
              <p className="text-[10px] text-slate-455">Remittance routing details</p>
            </div>
          </div>

          {!user?.bank_name ? (
            <div className="p-6 text-center space-y-2.5">
              <CreditCard className="w-8 h-8 text-slate-350 mx-auto" />
              <h4 className="font-semibold text-slate-900 text-xs">No bank details added</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-normal">
                To request payout releases, complete bank settings inside your Broker Profile page safely.
              </p>
              <button 
                onClick={() => setModalOpen(true)}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Set details now →
              </button>
            </div>
          ) : (
            <div className="space-y-3.5 text-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Bank Name</span>
                <span className="font-semibold text-slate-800">{user.bank_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Account Number</span>
                  <span className="font-mono text-slate-800 tracking-wider">••••••••{user.account_number?.slice(-4) || 'N/A'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">IFSC Routing Code</span>
                  <span className="font-mono text-slate-800">{user.ifsc_code}</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Holder Name</span>
                <span className="font-semibold text-slate-800">{user.account_holder_name}</span>
              </div>
              <div className="pt-2 bg-slate-50 p-2.5 rounded text-[10px] leading-relaxed text-slate-550 border border-slate-100 flex items-start gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                <span>Change bank profiles inside Settings folder securely. Payments process to configured destinations.</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Payout History Table list */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-emerald-50 bg-emerald-50/15 flex items-center gap-2">
          <Receipt className="w-4.5 h-4.5 text-commission shrink-0" />
          <h3 className="font-semibold text-slate-900 text-sm">Payout Releases History</h3>
        </div>

        <div className="overflow-x-auto">
          {payouts.length === 0 ? (
            <div className="p-10 text-center max-w-sm mx-auto space-y-2">
              <FileMinus className="w-8 h-8 text-slate-350 mx-auto" />
              <h4 className="font-bold text-slate-900 text-xs">No historical payout releases</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Accumulate over INR 500 in available balance via converted reviews to trigger bank wire dispatches.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-550 font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">Transfer Request ID</th>
                  <th className="px-6 py-3">Dispatched Date</th>
                  <th className="px-6 py-3">Payout Status</th>
                  <th className="px-6 py-3">Method / Txn Ref</th>
                  <th className="px-6 py-3 text-right">Sum Dispatched</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650">
                {payouts.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 font-mono font-bold text-slate-800">{pay.id}</td>
                    <td className="px-6 py-3 text-slate-500">
                      {new Date(pay.requested_at).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}
                    </td>
                    <td className="px-6 py-3">{getPayoutStatusBadge(pay.status)}</td>
                    <td className="px-6 py-3">
                      <div className="capitalize">{pay.payment_method.replace('_', ' ')}</div>
                      {pay.payment_reference && (
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 select-all">Ref: {pay.payment_reference}</div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right font-black text-slate-950">{formatINR(pay.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Persistent Payout Request Form Modal screen */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity"
          ></div>

          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 z-10 p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
                <Receipt className="w-4 h-4 text-primary" /> SECURE WIRE RELEASE REQUEST
              </span>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-850 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              {formError && (
                <div className="p-2.5 bg-red-50 text-alert border border-red-105 rounded-lg text-[10px] leading-relaxed font-semibold flex items-start gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Dynamic Available Limit indicator */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/60 text-xs flex justify-between items-center leading-none">
                <span className="text-slate-500">Maximum balance release limit:</span>
                <span className="font-extrabold text-slate-950">{formatINR(stats.availableBalance)}</span>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Release Sum amount (INR)</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-205 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-850 font-sans text-xs font-bold"
                    min="500"
                    max={stats.availableBalance}
                    required
                  />
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-450 font-bold">₹</span>
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed mt-1">Sum must equal or exceed 500 INR up to your full balance profile limit.</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-50">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Payout Destination Account</span>
                
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Bank Institutional Name</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-205 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                      required
                    />
                    <Building className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Account Number</label>
                    <input 
                      type="text"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      placeholder="50123..."
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-205 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800 font-mono tracking-wider"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">IFSC Code</label>
                    <input 
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      placeholder="HDFC0..."
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-205 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Account Holder Legal Name</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={holder}
                      onChange={(e) => setHolder(e.target.value)}
                      placeholder="Legal match names"
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-205 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800 animate-none"
                      required
                    />
                    <User className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer text-center shadow-md transition-all flex items-center justify-center gap-1 uppercase"
              >
                {submitting ? 'Authenticiting wire release...' : 'Initiate Secure Wire Release'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
