/**
 * LeadBridge Data Types & Schema Definitions
 */

export type UserRole = 'connector' | 'admin';

export type ProjectCategory = 
  | 'healthcare' 
  | 'beauty' 
  | 'fitness' 
  | 'legal' 
  | 'education' 
  | 'real_estate' 
  | 'retail' 
  | 'restaurant' 
  | 'technology' 
  | 'finance';

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'draft';

export type LeadStatus = 'submitted' | 'under_review' | 'contacted' | 'converted' | 'rejected';

export type PayoutStatus = 'pending' | 'approved' | 'paid' | 'rejected';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  role: UserRole;
  city?: string;
  state?: string;
  bio?: string;
  total_earnings: number;
  total_leads: number;
  converted_leads: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // Bank details for payouts
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  account_holder_name?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  description: string;
  short_description: string;
  business_name: string;
  business_location: string;
  project_value: number;
  commission_rate: number; // Defaults to 20%
  commission_amount: number; // Generated as project_value * commission_rate / 100
  requirements: string[];
  deliverables: string[];
  tags: string[];
  status: ProjectStatus;
  featured: boolean;
  thumbnail_url?: string;
  total_leads: number;
  converted_leads: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  project_id: string;
  connector_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_city: string;
  client_notes?: string;
  status: LeadStatus;
  rejection_reason?: string;
  commission_amount: number;
  submitted_at: string;
  reviewed_at?: string;
  converted_at?: string;
  updated_at: string;
  // Included fields for UI ease
  project_title?: string;
  business_name?: string;
}

export interface Payout {
  id: string;
  connector_id: string;
  lead_id: string;
  amount: number;
  status: PayoutStatus;
  payment_method: string; // e.g. bank_transfer
  payment_reference?: string;
  notes?: string;
  requested_at: string;
  processed_at?: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface SavedProject {
  id: string;
  connector_id: string;
  project_id: string;
  saved_at: string;
}

export interface LeaderboardEntry {
  id: string;
  full_name: string;
  city: string;
  rank: number;
  earnings: number;
  leads_converted: number;
}
