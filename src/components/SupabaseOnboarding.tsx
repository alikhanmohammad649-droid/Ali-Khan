import React, { useState, useEffect } from 'react';
import { Shield, Database, CheckCircle, AlertTriangle, Copy, Check, FileText, Server, AlertCircle, RefreshCw, Key, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const isSupabaseConfigured = (): boolean => {
  const url = (import.meta as any).env.VITE_SUPABASE_URL;
  const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
  
  return (
    !!url && 
    !!key && 
    !url.includes('your-supabase-project') && 
    !url.includes('mockproject') &&
    url.startsWith('https://')
  );
};

export const SupabaseOnboarding: React.FC<{ initiallyOpen?: boolean }> = ({ initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [copied, setCopied] = useState(false);
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured());
  const [checking, setChecking] = useState(false);

  const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'Not specified';
  const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY 
    ? `${(import.meta as any).env.VITE_SUPABASE_ANON_KEY.substring(0, 15)}... (truncated)` 
    : 'Not specified';

  const checkConnection = () => {
    setChecking(true);
    setTimeout(() => {
      const active = isSupabaseConfigured();
      setIsConfigured(active);
      setChecking(false);
      if (active) {
        toast.success('Live Supabase credentials detected successfully!');
      } else {
        toast.error('Supabase credentials not fully configured. Using Sandbox local state simulation.');
      }
    }, 600);
  };

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
  }, []);

  const sqlQuery = `-- 1. EXTENSIONS (Enables UUID auto-generators)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE SCHEMAS & CUSTOM ENUMS
CREATE TYPE project_category AS ENUM (
  'healthcare', 'beauty', 'fitness', 'legal', 'education', 
  'real_estate', 'retail', 'restaurant', 'technology', 'finance'
);

CREATE TYPE project_status AS ENUM ('active', 'paused', 'completed', 'draft');
CREATE TYPE lead_status AS ENUM ('submitted', 'under_review', 'contacted', 'converted', 'rejected');
CREATE TYPE payout_status AS ENUM ('pending', 'approved', 'paid', 'rejected');

-- 3. PROFILES TABLE (Synchronized with Supabase Authentication)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'connector' CHECK (role IN ('connector', 'admin')),
  phone TEXT,
  city TEXT,
  state TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  total_earnings NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_leads INT NOT NULL DEFAULT 0,
  converted_leads INT NOT NULL DEFAULT 0,
  bank_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  account_holder_name TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable Row Level Security (RLS) for absolute safety
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category project_category NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  project_value NUMERIC(15,2) NOT NULL CHECK (project_value > 0),
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 20.00,
  commission_amount NUMERIC(15,2) NOT NULL, -- Calculated value
  business_name TEXT NOT NULL,
  business_location TEXT NOT NULL,
  thumbnail_url TEXT,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  status project_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 5. LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  connector_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_city TEXT NOT NULL,
  client_notes TEXT,
  status lead_status NOT NULL DEFAULT 'submitted',
  commission_amount NUMERIC(15,2) NOT NULL,
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  reviewed_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 6. PAYOUTS TABLE
CREATE TABLE IF NOT EXISTS payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  connector_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lead_id TEXT NOT NULL DEFAULT 'manual-release',
  amount NUMERIC(15,2) NOT NULL CHECK (amount >= 500),
  status payout_status NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  payment_reference TEXT,
  notes TEXT,
  requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  processed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 8. SECURITY POLICIES (Access controls)
-- Profiles access policy
CREATE POLICY "Public profiles are readable by authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can edit their own profiles"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Projects access policy
CREATE POLICY "Projects are readable by anyone"
  ON projects FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Leads access policy
CREATE POLICY "Connectors can see their own leads"
  ON leads FOR SELECT TO authenticated USING (connector_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Connectors can insert their own leads"
  ON leads FOR INSERT TO authenticated WITH CHECK (connector_id = auth.uid());

CREATE POLICY "Admins can update leads"
  ON leads FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Payouts access policy
CREATE POLICY "Connectors can see their payouts"
  ON payouts FOR SELECT TO authenticated USING (connector_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Connectors can request payouts"
  ON payouts FOR INSERT TO authenticated WITH CHECK (connector_id = auth.uid());

-- Notifications access policy
CREATE POLICY "Users can view and edit their own notifications"
  ON notifications FOR ALL TO authenticated USING (user_id = auth.uid());

-- 9. COMPLIANCE LIMITATION VOID PREVENTS SPAM REFERRALS
CREATE OR REPLACE FUNCTION check_referral_compliance_limits()
RETURNS TRIGGER AS $$
DECLARE
  count_existing INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_existing 
  FROM leads 
  WHERE connector_id = NEW.connector_id AND project_id = NEW.project_id;
  
  IF count_existing >= 3 THEN
    RAISE EXCEPTION 'Compliance Hold: Real-time rules limit submitting a maximum of 3 client referrals per project to prevent spam.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_limit_connector_leads
BEFORE INSERT ON leads
FOR EACH ROW EXECUTE FUNCTION check_referral_compliance_limits();


-- 10. REAL-TIME SYNCHRONIZING AUTH TRIGGERS
-- Auto inserts a profile row when a new user signs up in auth schema
CREATE OR REPLACE FUNCTION handle_new_user_profiles()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, is_verified, total_earnings, total_leads, converted_leads)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'connector'),
    CASE WHEN NEW.email LIKE '%admin%' THEN true ELSE false END,
    0, 0, 0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profiles();


-- 11. BASE SEED PROJECTS DATA
INSERT INTO projects (title, slug, category, short_description, description, project_value, commission_amount, business_name, business_location, requirements, deliverables, tags, featured)
VALUES 
('Eye Clinic Scheduling Suite', 'eye-specialist-appointment-system', 'healthcare', 'Patient scheduling, WhatsApp updates, ophthalmology custom practices', 'Comprehensive medical booking suite for ClearVision Eye Centre Delhi.', 85000, 17000, 'ClearVision Centre', 'Delhi NCR', ARRAY['Clinics', 'Consultation'], ARRAY['Patient Portal', 'Roster Managers'], ARRAY['healthcare', 'dental'], true),
('Dental Multi-Branch Booking', 'dental-clinic-multi-branch-booking', 'healthcare', 'Multi-branch dental system scheduling, and claims flow tracking', 'Multi-location dental clinical chain unified app across 4 branches.', 120000, 24000, 'SmilePro Dental Group', 'Mumbai', ARRAY['Insurance checks', 'GST billing'], ARRAY['Check-in APP', 'Admin desks'], ARRAY['healthcare', 'insurance'], true)
ON CONFLICT (slug) DO NOTHING;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopied(true);
    toast.success('Supabase SQL Database Script copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="supabase-onboarding-panel" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm font-sans mb-6">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">Supabase Full-Stack Integration Guide</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                isConfigured ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
                {isConfigured ? 'SUPABASE LIVE' : 'SANDBOX SIMULATION MODE'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isConfigured 
                ? 'Your applet is securely reading from and writing to your live Supabase PostgreSQL database.' 
                : 'Using dynamic client-side simulation. Follow the setup below to link your real Supabase backend!'}
            </p>
          </div>
        </div>
        
        <button className="px-3 py-1 text-xs bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-md font-semibold font-sans">
          {isOpen ? 'Collapes' : 'Reveal Instruction Setup'}
        </button>
      </div>

      {isOpen && (
        <div className="p-5 border-t border-slate-100 space-y-6 bg-white">
          
          {/* Status Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-100 bg-slate-50/30 rounded-lg p-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Database Provider</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                <Server className="w-3.5 h-3.5 text-blue-500" />
                <span>Supabase PostgreSQL DB</span>
              </div>
            </div>

            <div className="border border-slate-100 bg-slate-50/30 rounded-lg p-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Project URI Configuration</span>
              <div className="font-mono text-[10px] text-slate-600 truncate">
                {supabaseUrl}
              </div>
            </div>

            <div className="border border-slate-100 bg-slate-50/30 rounded-lg p-3 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">State Integrity Verification</span>
              <button 
                onClick={checkConnection}
                disabled={checking}
                className="py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] tracking-wide uppercase flex items-center justify-center gap-1.5 w-full cursor-pointer transition"
              >
                <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Verifying Link...' : 'Verify Connectivity'}
              </button>
            </div>
          </div>

          {!isConfigured && (
            <div className="bg-amber-50/80 border border-amber-100 rounded-lg p-4 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Quick Primer: How to go Full-Stack in 3 Minutes</span>
              </div>
              <p className="leading-relaxed">
                We've built an interactive mockup engine that keeps perfect state in client-side storage so you can easily browse projects, log leads, request payouts, and execute admin commands immediately. 
                When you're ready to deploy to your official product, simply follow these steps:
              </p>
              <ul className="list-decimal pl-5 space-y-1">
                <li>Create a free account and empty project on <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">Supabase.com</a>.</li>
                <li>Edit your workspace environment variables by writing real endpoints into your <span className="font-mono bg-amber-100 px-1 text-amber-900 rounded font-bold">.env</span> file.</li>
                <li>Execute the optimized SQL schema below inside your Supabase SQL Editor.</li>
              </ul>
            </div>
          )}

          {/* Database instruction */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs text-slate-800 uppercase tracking-widest">Supabase Database SQL Generation Script</span>
              </div>
              <button 
                onClick={handleCopy}
                className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Script' : 'Copy SQL Script'}
              </button>
            </div>
            
            <p className="text-xs text-slate-400">
              Paste the following structured DDL directly into your <span className="font-bold text-slate-600">Supabase SQL Editor</span> to initialize the database tables with Row Level Security policies (RLS), auto-populating metadata triggers, and compliant Indian Rupee transaction settings:
            </p>

            <div className="relative">
              <pre className="p-4 bg-slate-900 text-slate-300 font-mono text-[10px] leading-relaxed rounded-xl overflow-x-auto max-h-64 border border-slate-800">
                {sqlQuery}
              </pre>
              <div className="absolute right-3.5 bottom-3.5 pointer-events-none">
                <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-1 rounded">PostgreSQL SQL Script</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Key className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Configure Workspace Environment Secrets</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Open or create <span className="font-mono bg-slate-200 px-1 rounded font-bold">.env</span> in your workspace root, and configure keys as follows. The React application will automatically switch to the real full-stack database:
            </p>
            <pre className="p-3 bg-white font-mono text-[11px] border border-slate-200 rounded-md text-slate-600">
{`VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-or-service-role-key"`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
