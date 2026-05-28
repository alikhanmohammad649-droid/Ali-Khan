import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';
import { dbState } from '../lib/dbState';
import { 
  User, 
  MapPin, 
  Phone, 
  Building, 
  CreditCard, 
  Lock, 
  Award, 
  ShieldCheck, 
  Save, 
  Check, 
  Image,
  KeyRound,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfileSettings: React.FC = () => {
  const { user, refreshAllData } = useApp();

  // Personal inputs
  const [name, setName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Bank inputs
  const [bankName, setBankName] = useState(user?.bank_name || '');
  const [accountNo, setAccountNo] = useState(user?.account_number || '');
  const [ifsc, setIfsc] = useState(user?.ifsc_code || '');
  const [holder, setHolder] = useState(user?.account_holder_name || user?.full_name || '');

  // Password inputs
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Avatar simulated upload
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  );

  const handlePersonalUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingPersonal(true);
    try {
      dbState.updateProfile(user.id, {
        full_name: name,
        phone,
        city,
        state,
        bio
      });
      refreshAllData();
      toast.success('Broker personal details updated successfully.');
    } catch (err: any) {
      toast.error('Failed to compile profile edits.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleBankUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingBank(true);
    try {
      dbState.updateProfile(user.id, {
        bank_name: bankName,
        account_number: accountNo,
        ifsc_code: ifsc,
        account_holder_name: holder
      });
      refreshAllData();
      toast.success('Settlement bank credentials synced successfully.');
    } catch (err: any) {
      toast.error('Failed to store billing settings.');
    } finally {
      setSavingBank(false);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('Credentials mismatch: Confirmation password must equal the requested setting.');
      return;
    }
    setSavingPassword(true);
    setTimeout(() => {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSavingPassword(false);
      toast.success('Enclave security pass updated successfully.');
    }, 600);
  };

  const handleAvatarMockUpload = () => {
    // Simulated premium file system asset pick
    const randomAvatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'
    ];
    const picked = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
    setAvatarPreview(picked);
    if (user) {
      dbState.updateProfile(user.id, { avatar_url: picked });
      refreshAllData();
      toast.success('Simulated photo uploaded to Supabase Storage Bucket.');
    }
  };

  return (
    <div className="font-sans space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">Profile Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage broker legal profiles, persistent payment destinations, and access credentials.</p>
        </div>

        {user?.is_verified && (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-commission font-bold text-xs px-3.5 py-1.5 rounded-xl border border-emerald-200 w-fit">
            <Award className="w-4 h-4 text-commission" /> 
            Verified Partner Connector
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left column: Avatar Simulated container & Bio summary */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative h-24 w-24">
              <img 
                src={avatarPreview || ''} 
                alt={name} 
                className="h-full w-full object-cover rounded-full border-2 border-slate-100 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={handleAvatarMockUpload}
                className="absolute bottom-0 right-0 p-1.5 bg-blue-600 border border-white text-white rounded-full hover:bg-blue-750 transition-colors shadow-xs cursor-pointer"
                title="Upload photo to Supabase Storage"
              >
                <Image className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">{user?.full_name}</h3>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mt-1">Broker ID: {user?.id}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-450 font-medium">Authentication Email:</span>
              <span className="font-semibold text-slate-800">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450 font-medium">Verification Status:</span>
              <span>
                {user?.is_verified ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium font-sans">Pending Submission</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right column (Span 2): Tabs forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Form 1: Personal Details */}
          <div className="bg-white rounded-xl border border-slate-105 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50">
              <h3 className="font-semibold text-slate-900 text-sm">Legal Identity Particulars</h3>
            </div>
            <form onSubmit={handlePersonalUpdate} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Full Legal Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                      required
                    />
                    <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Mobile Contact Protocol</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                      required
                    />
                    <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">City</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                      required
                    />
                    <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">State</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                      required
                    />
                    <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Commercial Bio Briefing</label>
                <div className="relative">
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800 resize-none leading-relaxed"
                  ></textarea>
                  <FileText className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <button 
                type="submit"
                disabled={savingPersonal}
                className="px-4.5 py-1.5 bg-slate-900 border border-slate-900 hover:bg-black text-white font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 w-fit"
              >
                <Save className="w-3.5 h-3.5" />
                {savingPersonal ? 'Storing details...' : 'Save details settings'}
              </button>
            </form>
          </div>

          {/* Form 2: Bank details */}
          <div className="bg-white rounded-xl border border-slate-105 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50">
              <h3 className="font-semibold text-slate-905 text-sm">Settlement Wire Routing Accounts</h3>
            </div>
            <form onSubmit={handleBankUpdate} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Bank Institution Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800 text-xs"
                      required
                    />
                    <Building className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Account Holder Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={holder}
                      onChange={(e) => setHolder(e.target.value)}
                      placeholder="Identical to passbook legal spelling"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800 text-xs"
                      required
                    />
                    <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Account Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      placeholder="50123..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800 font-mono tracking-wider text-xs"
                      required
                    />
                    <CreditCard className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">IFSC Code No</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      placeholder="HDFC0000123"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800 font-mono text-xs"
                      required
                    />
                    <Building className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={savingBank}
                className="px-4.5 py-1.5 bg-slate-900 border border-slate-900 hover:bg-black text-white font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 w-fit"
              >
                <Save className="w-3.5 h-3.5" />
                {savingBank ? 'Syncing accounts...' : 'Sync remittance routing'}
              </button>
            </form>
          </div>

          {/* Form 3: Change Password */}
          <div className="bg-white rounded-xl border border-slate-105 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50">
              <h3 className="font-semibold text-slate-900 text-sm">Security Password pass key</h3>
            </div>
            <form onSubmit={handlePasswordUpdate} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Old Credential</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                    />
                    <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">New Credential</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 digits"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                    />
                    <KeyRound className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Confirm setting</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800"
                    />
                    <KeyRound className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={savingPassword}
                className="px-4.5 py-1.5 bg-slate-900 border border-slate-900 hover:bg-black text-white font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 w-fit"
              >
                <Check className="w-3.5 h-3.5" />
                {savingPassword ? 'Storing code pass...' : 'Store pass settings'}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
