import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../lib/AppContext';
import { HelpCircle, Mail, Phone, Lock, User, MapPin, Briefcase, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { SupabaseOnboarding, isSupabaseConfigured } from '../components/SupabaseOnboarding';

export const Login: React.FC = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please input a valid email address.');
      return;
    }
    setError('');
    // Use the login helper
    await loginUser(email, email.toLowerCase().includes('admin') ? 'admin' : 'connector', password);
    navigate('/dashboard');
  };

  const handleDemoLogin = async (type: 'connector' | 'admin') => {
    const demoEmail = type === 'admin' ? 'admin@leadbridge.in' : 'raj.patil@leadbridge.in';
    await loginUser(demoEmail, type);
    navigate('/dashboard');
  };

  const handleGoogleOAuth = async () => {
    // Simulate premium Google sign-in workflow
    await loginUser('google_user@leadbridge.in', 'connector');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col md:flex-row justify-center items-stretch font-sans">
      {/* Decorative Brand Panel */}
      <div className="hidden md:flex md:w-1/2 p-12 bg-slate-900 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-[#1e293b] to-black/80 opacity-90 z-0"></div>
        
        {/* Abstract pattern grids */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] z-0"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-lg">
              L
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">Lead<span className="text-blue-500 font-semibold text-lg">Bridge</span></span>
          </div>
          <p className="text-xs text-slate-400">Professional Services Referral Marketplace</p>
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/40 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Premium Marketplace Tier
          </span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white">
            Connect corporate clients with vetted tier-one agencies.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Gain executive access to high-value service projects. Introduce pre-qualified leads, follow progression events, and generate recurring 20% commission rates from converted contracts securely.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500 border-t border-slate-800/80 pt-4 flex justify-between">
          <span>Enterprise Grade Architecture</span>
          <span>© 2026 LeadBridge LLC</span>
        </div>
      </div>

      {/* Main Auth Form Container */}
      <div className="w-full md:w-1/2 p-6 sm:p-12 md:p-16 lg:p-24 flex items-center justify-center bg-white z-10">
        <div className="w-full max-w-md">
          <div className="mb-8 block md:hidden">
            <span className="text-xs font-bold tracking-tight text-slate-800 uppercase">LeadBridge</span>
          </div>

          <div className="space-y-1 mb-8">
            <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Access Marketplace Dashboard</h1>
            <p className="text-sm text-slate-500">Log in to track listings, pipeline referrals, and balances.</p>
          </div>

          <SupabaseOnboarding initiallyOpen={!isSupabaseConfigured()} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Corporate Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 outline-none border border-slate-200 focus:border-primary focus:bg-white rounded-lg text-slate-800 text-sm transition-all"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Security Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 outline-none border border-slate-200 focus:border-primary focus:bg-white rounded-lg text-slate-800 text-sm transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button 
              type="submit" 
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1 cursor-pointer"
            >
              Authenticate Securely
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google OAuth Option */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400 font-medium">Or log in with OAuth</span></div>
          </div>

          <button 
            onClick={handleGoogleOAuth}
            className="w-full py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/40 text-slate-700 font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {/* Google Logo Icon SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.66l3.15-3.15C17.43 1.68 14.93 1 12 1 7.35 1 3.4 3.65 1.57 7.5l3.86 3C6.38 7.37 9.01 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.45c-.28 1.47-1.11 2.71-2.36 3.55l3.86 3c2.26-2.09 3.54-5.16 3.54-8.66z" />
              <path fill="#FBBC05" d="M5.43 14.5c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.57 6.9C.57 8.94 0 11.23 0 13.7s.57 4.76 1.57 6.8l3.86-3z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.86-3c-1.12.75-2.55 1.21-4.1 1.21-2.99 0-5.62-2.33-6.57-5.46l-3.86 3C3.4 20.35 7.35 23 12 23z" />
            </svg>
            Sing in with Google Account
          </button>

          {/* Quick Demo Sandboxes */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-8">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-2 text-center">Interactive Studio Sandboxes</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleDemoLogin('connector')}
                className="py-1.5 px-3 bg-white hover:bg-slate-100 text-xs text-slate-800 font-semibold border border-slate-200 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-commission" />
                Raj Patil (Connector)
              </button>
              <button 
                onClick={() => handleDemoLogin('admin')}
                className="py-1.5 px-3 bg-slate-900 hover:bg-black text-xs text-white font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                Alok Sharma (Admin)
              </button>
            </div>
            <p className="text-[9px] text-slate-400 text-center mt-2.5 leading-tight">Clicking login registers you immediately if the user sequence is empty.</p>
          </div>

          <div className="text-center mt-8 text-xs text-slate-500">
            <span>Don't have a LeadBridge partner profile? </span>
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register partner workspace</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const { registerUser } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !city) {
      setError('Please completely fill out the required credentials.');
      return;
    }
    setError('');
    await registerUser(name, email, phone, city, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col md:flex-row justify-center items-stretch font-sans">
      {/* Brand panel */}
      <div className="hidden md:flex md:w-1/2 p-12 bg-slate-900 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-[#1e293b] to-black/80 opacity-90 z-0"></div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] z-0"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-lg">L</div>
            <span className="text-xl font-bold text-white">LeadBridge</span>
          </div>
          <p className="text-xs text-slate-400">Professional Services Referral Marketplace</p>
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Premium Partnership Network
          </span>
          <h2 className="text-3xl font-bold leading-tight text-white">
            Monetize your professional network with commercial precision.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            LeadBridge is a closed business services marketplace designed exclusively for brokers, advisors, and corporate connectors who match high-value business needs with recognized executing partners.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500 pt-4 flex justify-between">
          <span>Secure AES Data Enclaves</span>
          <span>© 2026 LeadBridge LLC</span>
        </div>
      </div>

      <div className="w-full md:w-1/2 p-6 sm:p-12 md:p-16 flex items-center justify-center bg-white z-10">
        <div className="w-full max-w-md">
          <div className="space-y-1 mb-6">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Join LeadBridge</span>
            <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Create Broker Profile</h1>
            <p className="text-sm text-slate-500">Access exclusive high-value project listings immediately.</p>
          </div>

          <SupabaseOnboarding initiallyOpen={false} />

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Full Legal Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Raj Patil" 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/50 outline-none border border-slate-200 focus:border-primary focus:bg-white rounded-lg text-slate-800 text-sm transition-all"
                  required
                />
                <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Corporate Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/50 outline-none border border-slate-200 focus:border-primary focus:bg-white rounded-lg text-slate-800 text-sm transition-all"
                  required
                />
                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Contact No</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 00000" 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50/50 outline-none border border-slate-200 focus:border-primary focus:bg-white rounded-lg text-slate-800 text-xs transition-all"
                    required
                  />
                  <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Operational City</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai" 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50/50 outline-none border border-slate-200 focus:border-primary focus:bg-white rounded-lg text-slate-800 text-xs transition-all"
                    required
                  />
                  <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Security Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters" 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/50 outline-none border border-slate-200 focus:border-primary focus:bg-white rounded-lg text-slate-800 text-sm transition-all"
                />
                <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button 
              type="submit" 
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1 cursor-pointer mt-2"
            >
              Sign Up As Register Connector
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-slate-500">
            <span>Already have a partner account? </span>
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in securely</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-100 p-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-center font-bold text-xl text-slate-950 font-sans tracking-tight mb-2">Password Recovery Gateway</h1>
        <p className="text-center text-xs text-slate-500 px-4 mb-6 leading-relaxed">
          Input your registered corporate email to generate encrypted recovery signatures.
        </p>

        {!submitted ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Registered Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white outline-none focus:border-primary rounded-lg text-slate-800 text-sm"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2.5 bg-slate-900 border border-slate-900 hover:bg-black text-white font-semibold text-sm rounded-lg cursor-pointer transition-all"
            >
              Request Password Signature Reset
            </button>
          </form>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
            <ShieldCheck className="w-8 h-8 text-commission mx-auto mb-2" />
            <h4 className="font-bold text-emerald-800 text-xs uppercase mb-1">Encrypted recovery packet dispatched</h4>
            <p className="text-[11px] text-emerald-600 leading-relaxed">
              If {email} matches an active broker node, password verification instructions will arrive in your inbox in 1–2 minutes.
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 hover:underline">← Divert back to login portal</Link>
        </div>
      </div>
    </div>
  );
};
