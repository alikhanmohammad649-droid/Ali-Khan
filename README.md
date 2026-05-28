# LeadBridge — Premium Business Services Marketplace Platform

LeadBridge connects corporate client referrers ("Connectors") with top service providers. Connectors refer prequalified clients to business-tier service projects and earn an industry-standard **20% commission** upon successful conversion.

---

## Technical Stack & Configuration

- **Frontend**: React (Vite) + Tailwind CSS + Recharts
- **Icons**: Lucide React
- **System Routing**: React Router v6
- **Database & Auth**: Designed for ready compatibility with **Supabase (PostgreSQL + Auth)**
- **Simulation Layer**: Local SQL-aligned database state engine (`dbState`) for full client and administrator simulations before deploying credentials.

---

## 🚀 Setup & Execution Guide

### 1. Configure Credentials (`.env.example`)
To plug your real Supabase backend, duplicate `.env.example` as `.env` and fill:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### 2. Live Local Build & Verification
Install dependent packages and start development compilation:
```bash
npm install
npm run dev
```

---

## 🗄️ Database Setup (SUPABASE SQL SCRIPT)

Run the following SQL instruction set inside your **Supabase SQL Editor** to establish all schemas, constraints, automated triggers, and standard entries first:

```sql
-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE project_category AS ENUM (
  'healthcare', 'beauty', 'fitness', 'legal', 'education', 
  'real_estate', 'retail', 'restaurant', 'technology', 'finance'
);

CREATE TYPE project_status AS ENUM ('active', 'paused', 'completed', 'draft');
CREATE TYPE lead_status AS ENUM ('submitted', 'under_review', 'contacted', 'converted', 'rejected');
CREATE TYPE payout_status AS ENUM ('pending', 'approved', 'paid', 'rejected');

-- 3. USERS / PROFILES TABLE
CREATE TABLE profiles (
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
  bank_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  account_holder_name TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. PROJECTS TABLE
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category project_category NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  project_value NUMERIC(15,2) NOT NULL,
  commission_amount NUMERIC(15,2) NOT NULL, -- 20% calculation
  business_name TEXT NOT NULL,
  business_location TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  status project_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT val_positive CHECK (project_value > 0),
  CONSTRAINT comm_twenty CHECK (commission_amount = ROUND(project_value * 0.20, 2))
);

-- 5. LEADS TABLE
CREATE TABLE leads (
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
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. PAYOUT REQUESTS TABLE
CREATE TABLE payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  connector_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(15,2) NOT NULL CHECK (amount >= 500),
  status payout_status NOT NULL DEFAULT 'pending',
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  payment_reference TEXT,
  requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  processed_at TIMESTAMPTZ
);

-- 7. RECENT NOTIFICATIONS
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. INDEXES & PERFORMANCE
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_leads_connector ON leads(connector_id);
CREATE INDEX idx_leads_project ON leads(project_id);
CREATE INDEX idx_payouts_connector ON payouts(connector_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE is_read = false;

-- 9. COMMISSION COMPLIANCE TRIGGER CHECK
CREATE OR REPLACE FUNCTION check_referral_limits()
RETURNS TRIGGER AS $$
DECLARE
  count_existing INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_existing 
  FROM leads 
  WHERE connector_id = NEW.connector_id AND project_id = NEW.project_id;
  
  IF count_existing >= 3 THEN
    RAISE EXCEPTION 'Compliance Limitation: Connectors may submit up to 3 client referrals per project to ensure optimal client vetting.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_limit_connector_leads
BEFORE INSERT ON leads
FOR EACH ROW EXECUTE FUNCTION check_referral_limits();
```

---

## 💼 Core Business Rules Implemented

1. **Rule of 20% Direct Commission**: Calculated on project valuation at creation. Displays on every broker view.
2. **Standard 3-Referral Compliance Limit**: Raised automatically to halt over-submission on the same contract proposal.
3. **Status Flow Orderly Pipeline**: `submitted` -> `under_review` -> `contacted` -> `converted`, or can be marked `rejected` along with reason details.
4. **Verified Broker Status Badge**: Set by Admins to indicate verified partners.
5. **Standard Settlement Threshold (500 INR)**: Payout releases are blocked if maximum available balances fall below the threshold.
