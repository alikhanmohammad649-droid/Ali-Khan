import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbState } from './dbState';
import { supabase } from './supabase';
import { isSupabaseConfigured } from '../components/SupabaseOnboarding';
import { Profile, Project, Lead, Payout, Notification, LeaderboardEntry, LeadStatus, PayoutStatus } from '../types';
import toast from 'react-hot-toast';

interface AppContextType {
  user: Profile | null;
  stats: { totalEarnings: number; pendingPayouts: number; paidPayouts: number; availableBalance: number };
  projects: Project[];
  leads: Lead[];
  allLeadsForAdmin: Lead[];
  payouts: Payout[];
  allPayoutsForAdmin: any[];
  notifications: Notification[];
  leaderboard: LeaderboardEntry[];
  savedProjects: Project[];
  loading: boolean;
  loginUser: (email: string, role?: 'connector' | 'admin', password?: string) => Promise<void>;
  registerUser: (name: string, email: string, phone: string, city: string, password?: string) => Promise<void>;
  logoutUser: () => void;
  submitClientReferral: (projectId: string, clientForm: { client_name: string; client_email: string; client_phone: string; client_city: string; client_notes?: string }) => Promise<void>;
  updateReferralStatus: (leadId: string, status: Lead['status'], rejectionReason?: string) => Promise<void>;
  submitPayoutRelease: (amount: number, bankForm: { bank_name: string; account_number: string; ifsc_code: string; account_holder_name: string }) => Promise<void>;
  updatePayoutStatusByAdmin: (payoutId: string, status: Payout['status'], reference?: string, notes?: string) => Promise<void>;
  toggleBookmarkedProject: (projectId: string) => void;
  clearUnreadNotifications: () => void;
  addNewProject: (proj: Partial<Project>) => void;
  modifyProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  refreshAllData: () => void;
  allUsersList: Profile[];
  toggleUserVerification: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ totalEarnings: 0, pendingPayouts: 0, paidPayouts: 0, availableBalance: 0 });
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeadsForAdmin, setAllLeadsForAdmin] = useState<Lead[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [allPayoutsForAdmin, setAllPayoutsForAdmin] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [allUsersList, setAllUsersList] = useState<Profile[]>([]);

  // Function to load entire database snapshot (with dynamic Supabase detection)
  const loadAppState = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        try {
          // 1. Get current supabase session user
          const { data: { session } } = await supabase.auth.getSession();
          let sUser: Profile | null = null;
          
          if (session?.user) {
            // Fetch profile data
            const { data: profileCheck, error: pError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (profileCheck) {
              sUser = {
                id: profileCheck.id,
                full_name: profileCheck.full_name || 'Guest User',
                email: profileCheck.email,
                role: profileCheck.role || 'connector',
                phone: profileCheck.phone,
                city: profileCheck.city,
                state: profileCheck.state,
                bio: profileCheck.bio,
                avatar_url: profileCheck.avatar_url,
                total_earnings: Number(profileCheck.total_earnings || 0),
                total_leads: Number(profileCheck.total_leads || 0),
                converted_leads: Number(profileCheck.converted_leads || 0),
                is_verified: !!profileCheck.is_verified,
                bank_name: profileCheck.bank_name,
                account_number: profileCheck.account_number,
                ifsc_code: profileCheck.ifsc_code,
                account_holder_name: profileCheck.account_holder_name,
                created_at: profileCheck.created_at,
                updated_at: profileCheck.updated_at
              };
            }
          }
          
          setUser(sUser);

          // 2. Fetch all projects
          const { data: sProjects, error: projError } = await supabase
            .from('projects')
            .select('*');

          if (projError) throw projError;
          setProjects(sProjects || []);

          // 3. Profiles List (for Admin screens)
          const { data: sProfiles } = await supabase.from('profiles').select('*');
          setAllUsersList(sProfiles || []);

          if (sUser) {
            // 4. Fetch user specific leads
            const { data: sLeads } = await supabase
              .from('leads')
              .select('*, projects(title, business_name)')
              .eq('connector_id', sUser.id);
            
            const formattedLeads = (sLeads || []).map(l => ({
              ...l,
              project_title: l.projects?.title,
              business_name: l.projects?.business_name
            }));
            setLeads(formattedLeads);

            // 5. Fetch user specific payouts
            const { data: sPayouts } = await supabase
              .from('payouts')
              .select('*')
              .eq('connector_id', sUser.id);
            setPayouts(sPayouts || []);

            // 6. Fetch user specific notifications
            const { data: sNotifs } = await supabase
              .from('notifications')
              .select('*')
              .eq('user_id', sUser.id)
              .order('created_at', { ascending: false });
            setNotifications(sNotifs || []);

            // 7. Calculate real dynamic user stats from tables
            const totalEarnings = Number(sUser.total_earnings || 0);
            const pendingPayouts = (sPayouts || [])
              .filter((p: any) => p.status === 'pending')
              .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
            const paidPayouts = (sPayouts || [])
              .filter((p: any) => p.status === 'paid')
              .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
            const availableBalance = Math.max(0, totalEarnings - pendingPayouts - paidPayouts);
            
            setStats({
              totalEarnings,
              pendingPayouts,
              paidPayouts,
              availableBalance
            });
          } else {
            setStats({ totalEarnings: 0, pendingPayouts: 0, paidPayouts: 0, availableBalance: 0 });
            setLeads([]);
            setPayouts([]);
            setNotifications([]);
            setSavedProjects([]);
          }

          // 8. Admin global pipelines if applicable
          const { data: globalLeads } = await supabase.from('leads').select('*, projects(title, business_name)');
          const formattedGlobalLeads = (globalLeads || []).map(l => ({
            ...l,
            project_title: l.projects?.title,
            business_name: l.projects?.business_name
          }));
          setAllLeadsForAdmin(formattedGlobalLeads);

          const { data: globalPayouts } = await supabase.from('payouts').select('*');
          setAllPayoutsForAdmin(globalPayouts || []);

          // 9. Process Leaderboard Rank dynamically from active profiles
          const sortedProfiles = (sProfiles || [])
            .filter(p => p.role === 'connector')
            .sort((a, b) => Number(b.total_earnings || 0) - Number(a.total_earnings || 0));
          
          const leaders: LeaderboardEntry[] = sortedProfiles.map((p, idx) => ({
            id: p.id,
            full_name: sUser && p.id === sUser.id ? p.full_name : `Connector from ${p.city || 'Mumbai'}`,
            city: p.city || 'Mumbai',
            rank: idx + 1,
            earnings: Number(p.total_earnings || 0),
            leads_converted: Number(p.converted_leads || 0)
          }));
          setLeaderboard(leaders);

          // Done with loading Supabase state cleanly
          setLoading(false);
          return;
        } catch (dbErr: any) {
          console.warn('Supabase DB Call failed, likely due to missing tables. Falling back to local state engine.', dbErr);
          toast.error('Supabase query failed. Table Schema missing? Click Setup Guide below to copy & run Postgres tables SQL.', {
            duration: 9000
          });
          // Continue to local simulation fallback...
        }
      }

      // --- LOCAL STATES SIMULATION FALLBACK ---
      const currentUser = dbState.getCurrentUser();
      setUser(currentUser);
      
      const allProjs = dbState.getProjects();
      setProjects([...allProjs]);

      const rawUsers = localStorage.getItem('lb_users');
      if (rawUsers) {
        setAllUsersList(JSON.parse(rawUsers));
      }

      if (currentUser) {
        const userStats = dbState.getUserStats(currentUser.id);
        setStats(userStats);

        const userLeads = dbState.getLeads(currentUser.id);
        setLeads([...userLeads]);

        const userPayouts = dbState.getPayouts(currentUser.id);
        setPayouts([...userPayouts]);

        const userNotifs = dbState.getNotifications(currentUser.id);
        setNotifications([...userNotifs]);

        const userSaved = dbState.getSavedProjects(currentUser.id);
        setSavedProjects([...userSaved]);
      } else {
        setStats({ totalEarnings: 0, pendingPayouts: 0, paidPayouts: 0, availableBalance: 0 });
        setLeads([]);
        setPayouts([]);
        setNotifications([]);
        setSavedProjects([]);
      }

      setAllLeadsForAdmin(dbState.getAllLeads());
      setAllPayoutsForAdmin(dbState.getAllPayouts());
      setLeaderboard(dbState.getLeaderboard());
    } catch (err) {
      console.error('Error hydrating react app context:', err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 350);
    }
  };

  useEffect(() => {
    loadAppState();
    window.addEventListener('storage', loadAppState);
    return () => window.removeEventListener('storage', loadAppState);
  }, []);

  const refreshAllData = () => {
    loadAppState();
  };

  const loginUser = async (email: string, role: 'connector' | 'admin' = 'connector', password?: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const pass = password || 'UserLoginP@ss124'; // secure default for demo fast links
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pass
          });

          if (error) {
            // Attempt to register automatically if error is Invalid Credentials (first-time use friendly)
            if (error.message.includes('Invalid login credentials')) {
              toast.loading('User not found. Auto-registering credentials for prompt flow...', { duration: 1500 });
              // Attempt signup on the fly
              const { error: signUpError } = await supabase.auth.signUp({
                email,
                password: pass,
                options: {
                  data: {
                    full_name: email.split('@')[0].toUpperCase(),
                    role: role,
                    city: 'Mumbai'
                  }
                }
              });

              if (signUpError) throw signUpError;
              
              // Sign in again
              const { data: sData, error: sError } = await supabase.auth.signInWithPassword({
                email,
                password: pass
              });
              if (sError) throw sError;
              
              toast.success(`Supabase dynamic profile provisioned successfully! Role: ${role}`);
              loadAppState();
              return;
            }
            throw error;
          }

          toast.success(`Successfully authenticated via Supabase active key! Role: ${role}`);
          loadAppState();
          return;
        } catch (supaErr: any) {
          console.warn('Supabase auth error, proceeding to simulation fallback:', supaErr);
          toast.error(`Supabase Auth failed: ${supaErr.message || supaErr}. Reverting to local simulator.`);
        }
      }

      // Simulation fallback
      dbState.login(email, role);
      loadAppState();
      toast.success(`Simulated authentication activated: logged in as ${role === 'admin' ? 'Administrator' : 'General Broker'}.`);
    } catch (e: any) {
      toast.error(e.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name: string, email: string, phone: string, city: string, password?: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const pass = password || 'UserLoginP@ss124';
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
              data: {
                full_name: name,
                phone,
                city,
                role: 'connector'
              }
            }
          });

          if (error) throw error;
          
          toast.success('Registration successful in Supabase Users list!');
          loadAppState();
          return;
        } catch (supaErr: any) {
          toast.error(`Supabase Registration issue: ${supaErr.message}. Reverting to local state.`);
        }
      }

      // Simulation
      dbState.register(name, email, phone, city);
      loadAppState();
      toast.success('Local Sandbox Registration successful! Welcome to LeadBridge.');
    } catch (e: any) {
      toast.error(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(err => console.debug('Signout warning:', err));
    }
    dbState.logout();
    setUser(null);
    setStats({ totalEarnings: 0, pendingPayouts: 0, paidPayouts: 0, availableBalance: 0 });
    setLeads([]);
    setPayouts([]);
    setNotifications([]);
    setSavedProjects([]);
    toast.success('All current active sessions destroyed safely.');
  };

  const submitClientReferral = async (projectId: string, clientForm: { client_name: string; client_email: string; client_phone: string; client_city: string; client_notes?: string }) => {
    if (!user) {
      toast.error('Session expired. Please authenticate to complete action.');
      return;
    }

    if (isSupabaseConfigured()) {
      try {
        const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single();
        if (!project) throw new Error('Project not tracked in live list.');

        // Calculate direct 20% commission amounts
        const commission_amount = Math.round(project.project_value * 0.20);

        const { error } = await supabase.from('leads').insert({
          connector_id: user.id,
          project_id: projectId,
          client_name: clientForm.client_name,
          client_email: clientForm.client_email,
          client_phone: clientForm.client_phone,
          client_city: clientForm.client_city,
          client_notes: clientForm.client_notes,
          status: 'submitted',
          commission_amount: commission_amount
        });

        if (error) throw error;

        // Auto insert notification to database
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Referral Registered',
          message: `Referral for client ${clientForm.client_name} successfully linked to ${project.title}. Our tier-one review has commenced.`,
          type: 'info'
        });

        loadAppState();
        toast.success('Your corporate referral has been registered on Supabase Postgres!');
        return;
      } catch (err: any) {
        console.warn('Failed to insert lead directly into Supabase. Reverting to local simulation:', err);
        toast.error(`Database save warning: ${err.message || err}. Saved client to Local Simulator instead.`);
      }
    }

    // Default Simulation
    try {
      dbState.submitLead(projectId, user.id, clientForm);
      loadAppState();
      toast.success('Referral client registered successfully inside offline Sandbox.');
    } catch (e: any) {
      throw e;
    }
  };

  const updateReferralStatus = async (leadId: string, status: Lead['status'], rejectionReason?: string) => {
    if (isSupabaseConfigured()) {
      try {
        const { data: originalLead } = await supabase.from('leads').select('*').eq('id', leadId).single();
        if (originalLead) {
          const { error } = await supabase
            .from('leads')
            .update({ 
              status, 
              rejection_reason: rejectionReason || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', leadId);

          if (error) throw error;

          // If converted, dynamic update profiles balance
          if (status === 'converted') {
            const { data: prof } = await supabase.from('profiles').select('*').eq('id', originalLead.connector_id).single();
            if (prof) {
              const currentEarnings = Number(prof.total_earnings || 0);
              const totalLeads = Number(prof.total_leads || 0);
              const convertedLeads = Number(prof.converted_leads || 0);

              await supabase
                .from('profiles')
                .update({ 
                  total_earnings: currentEarnings + Number(originalLead.commission_amount || 0),
                  total_leads: totalLeads + 1,
                  converted_leads: convertedLeads + 1
                })
                .eq('id', originalLead.connector_id);
            }
          }

          // Build notifications
          await supabase.from('notifications').insert({
            user_id: originalLead.connector_id,
            title: `Referral ${status.toUpperCase()}`,
            message: status === 'converted' 
              ? `Congratulations! Your client referral was successfully converted. Commission balance updated +${originalLead.commission_amount} INR!` 
              : `Your submitted client profile was updated on transit timeline: ${status.toUpperCase()}`,
            type: status === 'converted' ? 'success' : (status === 'rejected' ? 'warning' : 'info')
          });

          loadAppState();
          toast.success(`Referral status compiled successfully on Supabase DB.`);
          return;
        }
      } catch (err: any) {
        console.warn('Failed to compile status change in Supabase:', err);
        toast.error(`Supabase DB Update failed: ${err.message || err}`);
      }
    }

    try {
      dbState.updateLeadStatus(leadId, status, rejectionReason);
      loadAppState();
      toast.success(`Local Sandbox status updated to "${status}"`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to compile status change');
    }
  };

  const submitPayoutRelease = async (amount: number, bankForm: { bank_name: string; account_number: string; ifsc_code: string; account_holder_name: string }) => {
    if (!user) {
      toast.error('Session expired.');
      return;
    }

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('payouts').insert({
          connector_id: user.id,
          amount: amount,
          status: 'pending',
          bank_name: bankForm.bank_name,
          account_number: bankForm.account_number,
          ifsc_code: bankForm.ifsc_code,
          account_holder_name: bankForm.account_holder_name,
          payment_method: 'bank_transfer'
        });

        if (error) throw error;

        // Save bank info to profile table
        await supabase.from('profiles').update({
          bank_name: bankForm.bank_name,
          account_number: bankForm.account_number,
          ifsc_code: bankForm.ifsc_code,
          account_holder_name: bankForm.account_holder_name
        }).eq('id', user.id);

        toast.success(`Payout release request for ${amount} INR logged into Supabase successfully!`);
        loadAppState();
        return;
      } catch (err: any) {
        console.warn('Supabase payout saving failed. Falling back to local state:', err);
        toast.error(`Database hold: ${err.message || err}`);
      }
    }

    try {
      dbState.requestPayout(user.id, amount, bankForm);
      loadAppState();
      toast.success(`Local payout release for ${amount} INR registered inside local index.`);
    } catch (e: any) {
      throw e;
    }
  };

  const updatePayoutStatusByAdmin = async (payoutId: string, status: Payout['status'], reference?: string, notes?: string) => {
    if (isSupabaseConfigured()) {
      try {
        const { data: pay } = await supabase.from('payouts').select('*').eq('id', payoutId).single();
        if (pay) {
          const { error } = await supabase
            .from('payouts')
            .update({ 
              status, 
              payment_reference: reference || null,
              processed_at: status === 'paid' ? new Date().toISOString() : null,
              updated_at: new Date().toISOString()
            })
            .eq('id', payoutId);

          if (error) throw error;

          // Notify the broker
          await supabase.from('notifications').insert({
            user_id: pay.connector_id,
            title: `Payout status: ${status.toUpperCase()}`,
            message: status === 'paid' 
              ? `Your payout release of ${pay.amount} INR was compiled & transfer completed! Ref: ${reference || 'N/A'}`
              : `Your payout reference has been updated to: ${status.toUpperCase()}`,
            type: status === 'paid' ? 'success' : (status === 'rejected' ? 'warning' : 'info')
          });

          loadAppState();
          toast.success(`Payout successfully updated in Supabase.`);
          return;
        }
      } catch (err: any) {
        console.warn('Supabase payout update failed:', err);
        toast.error(`Supabase write issue: ${err.message || err}`);
      }
    }

    try {
      dbState.updatePayoutStatus(payoutId, status, reference, notes);
      loadAppState();
      toast.success(`Local Sandbox payout updated to "${status}"`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to update payout status');
    }
  };

  const toggleBookmarkedProject = (projectId: string) => {
    if (!user) {
      toast.error('Authentication required to bookmark list items.');
      return;
    }
    const isSaved = dbState.toggleSaveProject(user.id, projectId);
    loadAppState();
    if (isSaved) {
      toast.success('Project added to Saved bookmark collection.');
    } else {
      toast.success('Project removed from Saved bookmark collection.');
    }
  };

  const clearUnreadNotifications = async () => {
    if (!user) return;
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id);
      } catch (err) {
        console.debug('Failed to clear notifications in Supabase:', err);
      }
    }
    dbState.markAllNotificationsRead(user.id);
    loadAppState();
    toast.success('All current alerts marked as read.');
  };

  const addNewProject = async (proj: Partial<Project>) => {
    if (isSupabaseConfigured()) {
      try {
        const commAmt = Math.round((proj.project_value || 0) * 0.20);
        const { error } = await supabase.from('projects').insert({
          title: proj.title,
          slug: proj.slug || proj.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category: proj.category,
          short_description: proj.short_description,
          description: proj.description,
          project_value: proj.project_value,
          commission_rate: 20,
          commission_amount: commAmt,
          business_name: proj.business_name,
          business_location: proj.business_location,
          thumbnail_url: proj.thumbnail_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
          requirements: proj.requirements || [],
          deliverables: proj.deliverables || [],
          tags: proj.tags || [],
          featured: !!proj.featured,
          status: 'active'
        });

        if (error) throw error;
        toast.success(`Project listing published on Supabase DB!`);
        loadAppState();
        return;
      } catch (err: any) {
        console.warn('Failed to create project in Supabase:', err);
      }
    }

    dbState.createProject(proj);
    loadAppState();
    toast.success(`Local project listing "${proj.title}" created successfully.`);
  };

  const modifyProject = async (id: string, updates: Partial<Project>) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('projects')
          .update(updates)
          .eq('id', id);
        if (error) throw error;
        toast.success('Project listing published updates to Supabase.');
        loadAppState();
        return;
      } catch (err: any) {
        console.warn(err);
      }
    }
    dbState.updateProject(id, updates);
    loadAppState();
    toast.success(`Project listing successfully modified.`);
  };

  const removeProject = async (id: string) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('projects')
          .delete()
          .eq('id', id);
        if (error) throw error;
        toast.success('Listing deleted inside Supabase DB.');
        loadAppState();
        return;
      } catch (err: any) {
        console.warn(err);
      }
    }
    dbState.deleteProject(id);
    loadAppState();
    toast.success('Project listing permanently removed from index.');
  };

  const toggleUserVerification = (userId: string) => {
    try {
      const usersList = JSON.parse(localStorage.getItem('lb_users') || '[]');
      const idx = usersList.findIndex((u: any) => u.id === userId);
      if (idx !== -1) {
        usersList[idx].is_verified = !usersList[idx].is_verified;
        localStorage.setItem('lb_users', JSON.stringify(usersList));
        
        if (dbState.getCurrentUser()?.id === userId) {
          dbState.updateProfile(userId, { is_verified: usersList[idx].is_verified });
        } else {
          (dbState as any).users = usersList;
          dbState.createNotification(
            userId,
            usersList[idx].is_verified ? 'Account Verified!' : 'Verification Removed',
            usersList[idx].is_verified
              ? 'Congratulations! An administrator has verified your profile. The Verified Connector Badge is now live.'
              : 'Your profile verification status has been updated by an administrator.',
            usersList[idx].is_verified ? 'success' : 'info'
          );
        }
        
        loadAppState();
        toast.success(`User verification setting toggled successfully.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        stats,
        projects,
        leads,
        allLeadsForAdmin,
        payouts,
        allPayoutsForAdmin,
        notifications,
        leaderboard,
        savedProjects,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        submitClientReferral,
        updateReferralStatus,
        submitPayoutRelease,
        updatePayoutStatusByAdmin,
        toggleBookmarkedProject,
        clearUnreadNotifications,
        addNewProject,
        modifyProject,
        removeProject,
        refreshAllData,
        allUsersList,
        toggleUserVerification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
