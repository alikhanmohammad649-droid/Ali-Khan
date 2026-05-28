import { Profile, Project, Lead, Payout, Notification, SavedProject, LeaderboardEntry, ProjectCategory, LeadStatus, PayoutStatus } from '../types';

// Helper to format currency in Indian Rupees style (1,20,000)
export function formatINR(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1-eye-specialist',
    title: 'Eye Specialist Clinic Patient Appointment System',
    slug: 'eye-specialist-appointment-system',
    category: 'healthcare',
    business_name: 'ClearVision Eye Care Centre',
    business_location: 'Delhi NCR, India',
    project_value: 85000,
    commission_rate: 20,
    commission_amount: 17000,
    description: 'A comprehensive patient management and appointment booking system for a multi-doctor ophthalmology clinic with online booking, doctor schedule management, WhatsApp reminders, prescription tracking, and patient history.',
    short_description: 'Patient scheduling, WhatsApp updates, and complete ophthalmology practice suite.',
    requirements: [
      'Registered eye clinic or ophthalmology center',
      'Minimum of 3 primary consultation doctors',
      'Existing patient base of 500+ patient profiles'
    ],
    deliverables: [
      'Web-based responsive patient booking portal',
      'Administrator dashboard with schedule visualizer',
      'Automated WhatsApp and SMS reminder integrations',
      'Centralized prescription and digital patient history records',
      'Doctor roster schedule manager'
    ],
    tags: ['healthcare', 'ophthalmology', 'appointment-scheduling', 'whatsapp-integration'],
    status: 'active',
    featured: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=800',
    total_leads: 0,
    converted_leads: 0,
    created_at: new Date('2026-05-10T12:00:00Z').toISOString(),
    updated_at: new Date('2026-05-10T12:00:00Z').toISOString(),
  },
  {
    id: 'p2-dental-clinic',
    title: 'Dental Clinic Chain Multi-Branch Booking Platform',
    slug: 'dental-clinic-multi-branch-booking',
    category: 'healthcare',
    business_name: 'SmilePro Dental Group',
    business_location: 'Mumbai, India',
    project_value: 120000,
    commission_rate: 20,
    commission_amount: 24000,
    description: 'A multi-location dental clinic needs a unified booking system across 4 branches with branch-wise doctor availability, treatment type selection, insurance verification, payment integration, and post-treatment follow-up scheduling.',
    short_description: 'Unified multi-branch platform scheduling, insurance flow and tracking.',
    requirements: [
      '2 or more functional clinic branches under the same brand',
      'Accepts national and private dental insurance plans',
      'Requires unified, GST-compliant point-of-sale billing setup'
    ],
    deliverables: [
      'Unified online branch booking interface',
      'Multi-branch operational manager control panel',
      'Customized treatments service catalog',
      'Insurance claim eligibility check module',
      'GST-compliant billing integration',
      'Mobile-responsive check-in patient app'
    ],
    tags: ['healthcare', 'dental', 'multi-location', 'billing', 'insurance'],
    status: 'active',
    featured: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    total_leads: 0,
    converted_leads: 0,
    created_at: new Date('2026-05-11T10:00:00Z').toISOString(),
    updated_at: new Date('2026-05-11T10:00:00Z').toISOString(),
  },
  {
    id: 'p3-salon-mgmt',
    title: 'Luxury Beauty Salon Complete Management Suite',
    slug: 'luxury-salon-management-suite',
    category: 'beauty',
    business_name: 'Glam Studio by Ananya',
    business_location: 'Bengaluru, India',
    project_value: 95000,
    commission_rate: 20,
    commission_amount: 19000,
    description: 'A premium beauty salon needs a complete business management solution including online booking with stylist selection, membership and loyalty program, product inventory, staff commission tracking, and a customer mobile app with before/after gallery.',
    short_description: 'Stylist schedules, membership tiers and custom staff tracking parameters.',
    requirements: [
      'Minimum of 8 full-time beauty staff members',
      'Sells and manages dry/wet inventory and retail beauty products',
      'Average client billing size above INR 2,000'
    ],
    deliverables: [
      'Responsive stylist online scheduler',
      'Stylist-specific dashboard view',
      'Membership loyalty and points module',
      'Dynamic staff commission engine and pay calculations',
      'Real-time retail inventory manager with alert limits',
      'Premium customer portal featuring dynamic before/after gallery'
    ],
    tags: ['beauty', 'stylist-scheduling', 'loyalty-membership', 'inventory'],
    status: 'active',
    featured: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
    total_leads: 0,
    converted_leads: 0,
    created_at: new Date('2026-05-12T09:00:00Z').toISOString(),
    updated_at: new Date('2026-05-12T09:00:00Z').toISOString(),
  },
  {
    id: 'p4-spa-wellness',
    title: 'Spa and Wellness Centre Booking and Membership App',
    slug: 'spa-wellness-booking-membership',
    category: 'beauty',
    business_name: 'Serenity Wellness Spas',
    business_location: 'Pune, India',
    project_value: 78000,
    commission_rate: 20,
    commission_amount: 15600,
    description: 'A spa chain with 3 locations needs a platform for booking massages, facials, and body treatments, managing memberships, processing payments, tracking therapist availability, and supporting couple and group bookings.',
    short_description: 'Dynamic therapist tracker, couple and group bookings, wellness memberships.',
    requirements: [
      '3 or more distinct physiological spa locations',
      'Offers periodic, prepaid subscription memberships',
      'Documented monthly revenue exceeding INR 5 Lakhs'
    ],
    deliverables: [
      'Inter-service massage and treatment builder booking engine',
      'Prepaid membership cards and packages engine',
      'Combined couple and team group reservation system',
      'Therapist availability roster tracker',
      'Revenue audit and operational performance dashboards'
    ],
    tags: ['beauty', 'wellness-spa', 'subscriptions', 'scheduling'],
    status: 'active',
    featured: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    total_leads: 0,
    converted_leads: 0,
    created_at: new Date('2026-05-12T15:00:00Z').toISOString(),
    updated_at: new Date('2026-05-12T15:00:00Z').toISOString(),
  },
  {
    id: 'p5-gym-engagement',
    title: 'Premium Gym Chain Member Engagement Platform',
    slug: 'gym-member-engagement-platform',
    category: 'fitness',
    business_name: 'IronPeak Fitness Clubs',
    business_location: 'Hyderabad, India',
    project_value: 110000,
    commission_rate: 20,
    commission_amount: 22000,
    description: 'A gym chain with 6 locations needs member management and engagement including class booking for Zumba, yoga, and HIIT, personal trainer assignment, attendance tracking, diet plan sharing, progress tracking with photos, membership renewal reminders, and a referral rewards system.',
    short_description: 'Zumba & HIIT fitness scheduler, workout tracker, trainer control portals.',
    requirements: [
      '5 or more active fitness hubs/locations',
      'Provides integrated specialized personal training plans',
      'Currently registers more than 1,000 active members'
    ],
    deliverables: [
      'Dedicated member app (iOS/Android responsive build)',
      'Class scheduling with capacity ceilings (Zumba, Yoga, HIIT)',
      'Trainer workspace and diet plan constructor',
      'QR-based touchless customer attendance tracker',
      'Photo-based milestone physiological progress monitor',
      'Referrals incentive and promotion engine',
      'Executive administrative control room'
    ],
    tags: ['fitness', 'member-engagement', 'personal-trainer', 'scheduling'],
    status: 'active',
    featured: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    total_leads: 0,
    converted_leads: 0,
    created_at: new Date('2026-05-15T08:30:00Z').toISOString(),
    updated_at: new Date('2026-05-15T08:30:00Z').toISOString(),
  },
  {
    id: 'p6-yoga-scheduling',
    title: 'Yoga Studio Class Scheduling and Subscription App',
    slug: 'yoga-studio-scheduling-subscription',
    category: 'fitness',
    business_name: 'Shanti Yoga Studio',
    business_location: 'Jaipur, India',
    project_value: 55000,
    commission_rate: 20,
    commission_amount: 11000,
    description: 'A boutique yoga studio with online and in-person classes needs scheduling, subscription management, live class streaming integration, virtual sessions, flexible subscription plans, and community features.',
    short_description: 'Class booking system, flexible subscription tiers and live meeting integrations.',
    requirements: [
      'Provides a blend of online streaming and in-studio yoga classes',
      'Maintains a customer base of 200+ students',
      'Requires integrated streaming protocols (Zoom/Webex integrations)'
    ],
    deliverables: [
      'Dynamic class scheduler matching instructor capacities',
      'Recurring monthly membership payment gateways',
      'Seamless Zoom/streaming SDK calendar scheduler',
      'In-app student forum and announcement section',
      'Accredited yoga completion certificate engine'
    ],
    tags: ['fitness', 'yoga', 'scheduling', 'subscriptions', 'live-streaming'],
    status: 'active',
    featured: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    total_leads: 0,
    converted_leads: 0,
    created_at: new Date('2026-05-16T11:00:00Z').toISOString(),
    updated_at: new Date('2026-05-16T11:00:00Z').toISOString(),
  },
  {
    id: 'p7-restaurant-reservation',
    title: 'Restaurant Chain Table Reservation and Order System',
    slug: 'restaurant-table-reservation-order',
    category: 'restaurant',
    business_name: 'The Spice Route Restaurants',
    business_location: 'Chennai, India',
    project_value: 90000,
    commission_rate: 20,
    commission_amount: 18000,
    description: 'A restaurant chain with 5 branches needs online table reservations, pre-ordering, digital QR menus, kitchen order management, loyalty points, feedback system, and Swiggy/Zomato-style order tracking for takeaway.',
    short_description: 'Reservations framework, dynamic QR interactive ordering, central KDS module.',
    requirements: [
      '3 or more distinct, operating restaurant locations',
      'Average monthly customer footfall of 5,000+ patrons',
      'Configured for both standard dine-in and self-checkout takeaway models'
    ],
    deliverables: [
      'Online dining table reservation portal with live floor grid',
      'Interactive visual menu and custom QR card generator',
      'Kitchen Display System (KDS) for back-of-house staff',
      'Active pizza/meal prep progress tracker webview',
      'Points-based custom diner loyalty algorithm',
      'Diner ratings and experience feedback dashboards'
    ],
    tags: ['restaurant', 'table-reservation', 'qr-menu', 'kitchen-display', 'takeaway'],
    status: 'active',
    featured: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    total_leads: 0,
    converted_leads: 0,
    created_at: new Date('2026-05-18T14:20:00Z').toISOString(),
    updated_at: new Date('2026-05-18T14:20:00Z').toISOString(),
  },
  {
    id: 'p8-realestate-crm',
    title: 'Real Estate Agency Property Listing and Lead CRM',
    slug: 'real-estate-listing-crm',
    category: 'real_estate',
    business_name: 'NestWorth Realty',
    business_location: 'Noida, India',
    project_value: 145000,
    commission_rate: 20,
    commission_amount: 29000,
    description: 'A mid-size real estate agency needs a property listing website with advanced filters, virtual tour integration, lead capture forms, agent assignment, follow-up CRM, and automated WhatsApp and email drip campaigns.',
    short_description: 'Filtered listings portal, integrated agent portal, automated campaigns.',
    requirements: [
      'Manages 50+ active property listings across residential/retail',
      'Team size of 10 or more active real estate agents',
      'Needs native API connection to standard enterprise CRMs'
    ],
    deliverables: [
      'High-performance property catalog with rich filters',
      'Embeddable Matterport/virtual VR walkthrough integrations',
      'Unified real-estate agent workspace dashboard',
      'Interactive customer lead routing algorithms',
      'Drip schedule WhatsApp & email outreach tool'
    ],
    tags: ['real_estate', 'listings', 'realestate-crm', 'virtual-tour', 'whatsapp-automation'],
    status: 'active',
    featured: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
    total_leads: 0,
    converted_leads: 0,
    created_at: new Date('2026-05-20T09:00:00Z').toISOString(),
    updated_at: new Date('2026-05-20T09:00:00Z').toISOString(),
  },
  {
    id: 'p9-education-portal',
    title: 'Coaching Institute Student Management Portal',
    slug: 'coaching-institute-student-portal',
    category: 'education',
    business_name: 'TopRank Academy',
    business_location: 'Kota, India',
    project_value: 130000,
    commission_rate: 20,
    commission_amount: 26000,
    description: 'A competitive exam coaching institute for JEE, NEET, and UPSC needs a full ERP with student enrollment, batch management, attendance, online test series with auto-evaluation, fee management, parent communication portal, and performance analytics.',
    short_description: 'Coaching center academic ERP, mock exams framework with auto-grading features.',
    requirements: [
      'Registers a baseline of 500+ currently enrolled classroom students',
      'Manages multi-batch course directories simultaneously',
      'Requires integrated, scalable exam practice engines'
    ],
    deliverables: [
      'Intuitive student home and performance portal',
      'Curriculum batch and teacher allocator workspace',
      'Interactive online mock exam engine with custom reports',
      'Instalment and online fee invoice module',
      'Interactive parenting and attendance update page',
      'Student relative grading standardizer curves'
    ],
    tags: ['education', 'academic-erp', 'student-portal', 'exams-engine'],
    status: 'active',
    featured: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    total_leads: 0,
    converted_leads: 0,
    created_at: new Date('2026-05-22T10:00:00Z').toISOString(),
    updated_at: new Date('2026-05-22T10:00:00Z').toISOString(),
  },
  {
    id: 'p10-retail-pos',
    title: 'Retail Store Chain Inventory and POS System',
    slug: 'retail-inventory-pos-system',
    category: 'retail',
    business_name: 'TrendWear Fashion',
    business_location: 'Ahmedabad, India',
    project_value: 115000,
    commission_rate: 20,
    commission_amount: 23000,
    description: 'A clothing retail chain with 8 stores needs unified inventory management, a Point of Sale system, supplier management, discount and offer engine, customer loyalty program, and a basic e-commerce website synced with store inventory.',
    short_description: 'Unified 8-branch cloud POS, supplier ledger and web catalog sync.',
    requirements: [
      '8 or more operating physical retail channels',
      'Established corporate supplier relationships',
      'Monthly overall Gross Merchandise Value (GMV) of INR 20+ Lakhs'
    ],
    deliverables: [
      'Cloud Point-of-Sale (POS) cashier terminal screen',
      'Unified multi-warehouse active stock manager',
      'Vendor dispatching and supplier ledger',
      'Adaptive promotional discount rule compiler',
      'Customer discount card programs directory',
      'Simple e-commerce web storefront syncing automatically'
    ],
    tags: ['retail', 'point-of-sale', 'inventory-control', 'b2c-ecommerce'],
    status: 'active',
    featured: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    total_leads: 0,
    converted_leads: 0,
    created_at: new Date('2026-05-24T12:00:00Z').toISOString(),
    updated_at: new Date('2026-05-24T12:00:00Z').toISOString(),
  }
];

const DEFAULT_PROFILE = {
  id: 'usr-connector-1',
  full_name: 'Raj Patil',
  email: 'raj.patil@leadbridge.in',
  role: 'connector' as const,
  phone: '+91 98765 43210',
  city: 'Mumbai',
  state: 'Maharashtra',
  bio: 'Veteran client relations optimizer and tech solutions advisor across Western India.',
  total_earnings: 74000,
  total_leads: 6,
  converted_leads: 3,
  is_verified: true,
  created_at: new Date('2026-04-01T09:00:00Z').toISOString(),
  updated_at: new Date('2026-05-27T10:00:00Z').toISOString(),
  bank_name: 'HDFC Bank',
  account_number: '50100234567890',
  ifsc_code: 'HDFC0000123',
  account_holder_name: 'Raj Patil'
};

const DEFAULT_ADMIN = {
  id: 'usr-admin-1',
  full_name: 'Alok Sharma',
  email: 'admin@leadbridge.in',
  role: 'admin' as const,
  phone: '+91 99999 88888',
  city: 'Delhi',
  state: 'Delhi NCR',
  bio: 'Platform Director & Quality Control Officer for LeadBridge.',
  total_earnings: 0,
  total_leads: 0,
  converted_leads: 0,
  is_verified: true,
  created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
  updated_at: new Date('2026-05-27T10:00:00Z').toISOString()
};

const INITIAL_LEADS: Lead[] = [
  {
    id: 'l1',
    project_id: 'p1-eye-specialist',
    connector_id: 'usr-connector-1',
    client_name: 'Dr. Vivek Khera',
    client_email: 'contact@kheraeyeclinic.com',
    client_phone: '+91 91234 56789',
    client_city: 'Delhi NCR',
    client_notes: 'Highly interested. Dr. Khera wants automated reminders for senior patients. Looking to deploy by next month.',
    status: 'converted',
    commission_amount: 17000,
    submitted_at: new Date('2026-05-12T10:15:00Z').toISOString(),
    converted_at: new Date('2026-05-20T16:45:00Z').toISOString(),
    updated_at: new Date('2026-05-20T16:45:00Z').toISOString(),
  },
  {
    id: 'l2',
    project_id: 'p2-dental-clinic',
    connector_id: 'usr-connector-1',
    client_name: 'Dr. Shruti Sen (SmileZone)',
    client_email: 'shruti@smilezonedental.in',
    client_phone: '+91 98888 77777',
    client_city: 'Mumbai',
    client_notes: 'SmileZone has 3 operational clinics in Pune & Mumbai but wants to unify them under a single platform.',
    status: 'converted',
    commission_amount: 24000,
    submitted_at: new Date('2026-05-14T08:30:00Z').toISOString(),
    converted_at: new Date('2026-05-24T11:20:00Z').toISOString(),
    updated_at: new Date('2026-05-24T11:20:00Z').toISOString(),
  },
  {
    id: 'l3',
    project_id: 'p5-gym-engagement',
    connector_id: 'usr-connector-1',
    client_name: 'Sameer Juneja (IronPeak Gym)',
    client_email: 'sameer@ironpeakfit.com',
    client_phone: '+91 97777 66666',
    client_city: 'Hyderabad',
    client_notes: 'Owner wants class bookings and QR check-in capabilities. Has 5 branches up and running.',
    status: 'converted',
    commission_amount: 22000,
    submitted_at: new Date('2026-05-16T12:00:00Z').toISOString(),
    converted_at: new Date('2026-05-25T17:00:00Z').toISOString(),
    updated_at: new Date('2026-05-25T17:00:00Z').toISOString(),
  },
  {
    id: 'l4',
    project_id: 'p8-realestate-crm',
    connector_id: 'usr-connector-1',
    client_name: 'Manoj Bajpayee (NestWorth)',
    client_email: 'manoj@nestworthrealty.in',
    client_phone: '+91 96666 55555',
    client_city: 'Noida',
    client_notes: 'Wants integration with WhatsApp, plus listing portal features. High priority deal.',
    status: 'under_review',
    commission_amount: 29000,
    submitted_at: new Date('2026-05-21T09:12:00Z').toISOString(),
    updated_at: new Date('2026-05-21T09:12:00Z').toISOString(),
  },
  {
    id: 'l5',
    project_id: 'p9-education-portal',
    connector_id: 'usr-connector-1',
    client_name: 'Prakash Padukone (TopRank Academy)',
    client_email: 'prakash@toprank.ac.in',
    client_phone: '+91 95555 44444',
    client_city: 'Kota',
    client_notes: 'Looking for JEE mock testing dashboard. Has 600 active students.',
    status: 'contacted',
    commission_amount: 26000,
    submitted_at: new Date('2026-05-23T11:45:00Z').toISOString(),
    updated_at: new Date('2026-05-23T11:45:00Z').toISOString(),
  },
  {
    id: 'l6',
    project_id: 'p3-salon-mgmt',
    connector_id: 'usr-connector-1',
    client_name: 'Geeta Phogat (Vogue Cuts)',
    client_email: 'geeta@voguecuts.com',
    client_phone: '+91 94444 33333',
    client_city: 'Bengaluru',
    client_notes: 'Run styling shop in Indiranagar. Looking for automated staff rewards tracking packages.',
    status: 'rejected',
    rejection_reason: 'Client did not meet the requirement of having at least 8 full-time beauty staff members.',
    commission_amount: 19000,
    submitted_at: new Date('2026-05-13T10:00:00Z').toISOString(),
    reviewed_at: new Date('2026-05-15T14:00:00Z').toISOString(),
    updated_at: new Date('2026-05-15T14:00:00Z').toISOString(),
  }
];

const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'pay-1',
    connector_id: 'usr-connector-1',
    lead_id: 'l1',
    amount: 17000,
    status: 'paid',
    payment_method: 'bank_transfer',
    payment_reference: 'TXN84918491M',
    notes: 'Paid via direct account transfer on approvals.',
    requested_at: new Date('2026-05-21T09:30:00Z').toISOString(),
    processed_at: new Date('2026-05-22T17:00:00Z').toISOString(),
    updated_at: new Date('2026-05-22T17:00:00Z').toISOString(),
  },
  {
    id: 'pay-2',
    connector_id: 'usr-connector-1',
    lead_id: 'l2',
    amount: 24000,
    status: 'paid',
    payment_method: 'bank_transfer',
    payment_reference: 'TXN37592759B',
    notes: 'Paid following contract confirmation.',
    requested_at: new Date('2026-05-24T13:00:00Z').toISOString(),
    processed_at: new Date('2026-05-25T11:00:00Z').toISOString(),
    updated_at: new Date('2026-05-25T11:00:00Z').toISOString(),
  },
  {
    id: 'pay-3',
    connector_id: 'usr-connector-1',
    lead_id: 'l3',
    amount: 22000,
    status: 'pending',
    payment_method: 'bank_transfer',
    notes: 'Awaiting platform treasury compliance clearance.',
    requested_at: new Date('2026-05-26T10:00:00Z').toISOString(),
    updated_at: new Date('2026-05-26T10:00:00Z').toISOString(),
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    user_id: 'usr-connector-1',
    title: 'Lead Converted!',
    message: 'Your referral for IronPeak Fitness Clubs (Sameer Juneja) has been converted. INR 22,000 commission added to your earnings.',
    type: 'success',
    is_read: false,
    action_url: '/leads',
    created_at: new Date('2026-05-25T17:00:00Z').toISOString(),
  },
  {
    id: 'n2',
    user_id: 'usr-connector-1',
    title: 'Lead Status Updated',
    message: 'Your referral for NestWorth Realty (Manoj Bajpayee) is now Under Review.',
    type: 'info',
    is_read: false,
    action_url: '/leads',
    created_at: new Date('2026-05-21T09:12:00Z').toISOString(),
  },
  {
    id: 'n3',
    user_id: 'usr-connector-1',
    title: 'Referral Rejected',
    message: 'Your lead Geeta Phogat for Vogue Cuts was rejected: Salon size too small.',
    type: 'warning',
    is_read: true,
    action_url: '/leads',
    created_at: new Date('2026-05-15T14:20:00Z').toISOString(),
  }
];

class LeadBridgeStateEngine {
  private users: Profile[] = [];
  private currentUserId: string | null = null;
  private projectsList: Project[] = [];
  private leadsList: Lead[] = [];
  private payoutsList: Payout[] = [];
  private notificationsList: Notification[] = [];
  private savedProjectsList: SavedProject[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedUsers = localStorage.getItem('lb_users');
      const storedActiveUser = localStorage.getItem('lb_current_user_id');
      const storedProjects = localStorage.getItem('lb_projects');
      const storedLeads = localStorage.getItem('lb_leads');
      const storedPayouts = localStorage.getItem('lb_payouts');
      const storedNotifications = localStorage.getItem('lb_notifications');
      const storedSaved = localStorage.getItem('lb_saved');

      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = [DEFAULT_PROFILE, DEFAULT_ADMIN];
        localStorage.setItem('lb_users', JSON.stringify(this.users));
      }

      if (storedActiveUser) {
        this.currentUserId = storedActiveUser;
      } else {
        // Default login is Raj Patil (Premium Connector)
        this.currentUserId = DEFAULT_PROFILE.id;
        localStorage.setItem('lb_current_user_id', DEFAULT_PROFILE.id);
      }

      if (storedProjects) {
        this.projectsList = JSON.parse(storedProjects);
      } else {
        this.projectsList = [...DEFAULT_PROJECTS];
        // Populate initial lead counts reflecting initial converted/under review statuses
        this.projectsList[0].total_leads = 1;
        this.projectsList[0].converted_leads = 1;
        this.projectsList[1].total_leads = 1;
        this.projectsList[1].converted_leads = 1;
        this.projectsList[4].total_leads = 1;
        this.projectsList[4].converted_leads = 1;
        this.projectsList[7].total_leads = 1;
        this.projectsList[8].total_leads = 1;
        this.projectsList[2].total_leads = 1; // 1 rejected
        localStorage.setItem('lb_projects', JSON.stringify(this.projectsList));
      }

      if (storedLeads) {
        this.leadsList = JSON.parse(storedLeads);
      } else {
        this.leadsList = [...INITIAL_LEADS];
        localStorage.setItem('lb_leads', JSON.stringify(this.leadsList));
      }

      if (storedPayouts) {
        this.payoutsList = JSON.parse(storedPayouts);
      } else {
        this.payoutsList = [...INITIAL_PAYOUTS];
        localStorage.setItem('lb_payouts', JSON.stringify(this.payoutsList));
      }

      if (storedNotifications) {
        this.notificationsList = JSON.parse(storedNotifications);
      } else {
        this.notificationsList = [...INITIAL_NOTIFICATIONS];
        localStorage.setItem('lb_notifications', JSON.stringify(this.notificationsList));
      }

      if (storedSaved) {
        this.savedProjectsList = JSON.parse(storedSaved);
      } else {
        this.savedProjectsList = [
          { id: 's1', connector_id: 'usr-connector-1', project_id: 'p1-eye-specialist', saved_at: new Date().toISOString() },
          { id: 's2', connector_id: 'usr-connector-1', project_id: 'p5-gym-engagement', saved_at: new Date().toISOString() }
        ];
        localStorage.setItem('lb_saved', JSON.stringify(this.savedProjectsList));
      }
    } catch (e) {
      console.error('Error loading LeadBridge state engine:', e);
    }
  }

  private saveState() {
    try {
      localStorage.setItem('lb_users', JSON.stringify(this.users));
      localStorage.setItem('lb_current_user_id', this.currentUserId || '');
      localStorage.setItem('lb_projects', JSON.stringify(this.projectsList));
      localStorage.setItem('lb_leads', JSON.stringify(this.leadsList));
      localStorage.setItem('lb_payouts', JSON.stringify(this.payoutsList));
      localStorage.setItem('lb_notifications', JSON.stringify(this.notificationsList));
      localStorage.setItem('lb_saved', JSON.stringify(this.savedProjectsList));
    } catch (e) {
      console.error('Error saving LeadBridge state engine:', e);
    }
  }

  // --- Auth Commands ---
  getCurrentUser(): Profile | null {
    if (!this.currentUserId) return null;
    return this.users.find(u => u.id === this.currentUserId) || null;
  }

  login(email: string, role: 'connector' | 'admin' = 'connector'): Profile {
    // Find or create
    let user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: `usr-${Math.random().toString(36).substr(2, 9)}`,
        full_name: email.split('@')[0].toUpperCase(),
        email: email,
        role: role,
        total_earnings: 0,
        total_leads: 0,
        converted_leads: 0,
        is_verified: role === 'admin' ? true : false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.users.push(user);
    }
    this.currentUserId = user.id;
    this.saveState();
    return user;
  }

  register(name: string, email: string, phone: string, city: string): Profile {
    const newUser: Profile = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      full_name: name,
      email: email,
      phone: phone,
      city: city,
      role: 'connector',
      total_earnings: 0,
      total_leads: 0,
      converted_leads: 0,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Check if referrer code exists in location/query, if there's an invite, add trigger
    const refBonusCheck = sessionStorage.getItem('lb_referred_by');
    if (refBonusCheck) {
      // Referred signup bonus will trigger on FIRST converted lead limit
      (newUser as any).referred_by = refBonusCheck;
    }

    this.users.push(newUser);
    this.currentUserId = newUser.id;
    this.saveState();

    // Create a welcome notification
    this.createNotification(newUser.id, 'Welcome to LeadBridge!', 'Set up your Profile & bank details to begin referring clients and earning premium commissions.', 'info');
    
    return newUser;
  }

  logout() {
    this.currentUserId = null;
    localStorage.removeItem('lb_current_user_id');
    this.saveState();
  }

  // --- Projects Operations ---
  getProjects(): Project[] {
    return this.projectsList;
  }

  getProjectBySlug(slug: string): Project | null {
    return this.projectsList.find(p => p.slug === slug) || null;
  }

  createProject(proj: Partial<Project>): Project {
    const newProj: Project = {
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      title: proj.title || 'Untitled Project',
      slug: proj.slug || (proj.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: proj.category || 'technology',
      description: proj.description || '',
      short_description: proj.short_description || '',
      business_name: proj.business_name || '',
      business_location: proj.business_location || '',
      project_value: Number(proj.project_value) || 50000,
      commission_rate: 20, // default strictly 20%
      commission_amount: (Number(proj.project_value) || 50000) * 0.20,
      requirements: proj.requirements || [],
      deliverables: proj.deliverables || [],
      tags: proj.tags || [],
      status: proj.status || 'active',
      featured: !!proj.featured,
      thumbnail_url: proj.thumbnail_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      total_leads: 0,
      converted_leads: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.projectsList.unshift(newProj);
    this.saveState();
    return newProj;
  }

  updateProject(id: string, updates: Partial<Project>): Project {
    const idx = this.projectsList.findIndex(p => p.id === id);
    if (idx !== -1) {
      const existing = this.projectsList[idx];
      const updatedValue = updates.project_value !== undefined ? Number(updates.project_value) : existing.project_value;
      const commission_amount = updatedValue * 0.20;
      
      this.projectsList[idx] = {
        ...existing,
        ...updates,
        project_value: updatedValue,
        commission_amount,
        updated_at: new Date().toISOString()
      };
      this.saveState();
      return this.projectsList[idx];
    }
    throw new Error('Project not found');
  }

  deleteProject(id: string) {
    this.projectsList = this.projectsList.filter(p => p.id !== id);
    this.saveState();
  }

  // --- Saved Project Bookmarks ---
  getSavedProjects(userId: string): Project[] {
    const ids = this.savedProjectsList
      .filter(s => s.connector_id === userId)
      .map(s => s.project_id);
    return this.projectsList.filter(p => ids.includes(p.id));
  }

  toggleSaveProject(userId: string, projectId: string): boolean {
    const idx = this.savedProjectsList.findIndex(s => s.connector_id === userId && s.project_id === projectId);
    if (idx !== -1) {
      this.savedProjectsList.splice(idx, 1);
      this.saveState();
      return false; // Not saved anymore
    } else {
      this.savedProjectsList.push({
        id: `s-${Math.random().toString(36).substr(2, 9)}`,
        connector_id: userId,
        project_id: projectId,
        saved_at: new Date().toISOString()
      });
      this.saveState();
      return true; // Is saved
    }
  }

  isSaved(userId: string, projectId: string): boolean {
    return this.savedProjectsList.some(s => s.connector_id === userId && s.project_id === projectId);
  }

  // --- Leads Operations ---
  getLeads(userId: string): Lead[] {
    return this.leadsList.filter(l => l.connector_id === userId).map(l => {
      const proj = this.projectsList.find(p => p.id === l.project_id);
      return {
        ...l,
        project_title: proj ? proj.title : 'Deleted Project',
        business_name: proj ? proj.business_name : 'N/A'
      };
    });
  }

  getAllLeads(): Lead[] {
    return this.leadsList.map(l => {
      const proj = this.projectsList.find(p => p.id === l.project_id);
      const conn = this.users.find(u => u.id === l.connector_id);
      return {
        ...l,
        project_title: proj ? proj.title : 'Deleted Project',
        business_name: proj ? proj.business_name : 'N/A',
        client_notes: l.client_notes || 'No added notes.',
        // Attach connector name for admin audits
        connector_name: conn ? conn.full_name : 'Deleted Profile'
      } as any;
    });
  }

  submitLead(projectId: string, connector_id: string, form: { client_name: string; client_email: string; client_phone: string; client_city: string; client_notes?: string }): Lead {
    // Business rules: A connector cannot submit more than 3 leads for the same project
    const previousLeads = this.leadsList.filter(l => l.project_id === projectId && l.connector_id === connector_id);
    if (previousLeads.length >= 3) {
      throw new Error('Business Threshold Exceeded: You are allowed to refer a maximum of 3 clients/leads for a single specific project listing.');
    }

    const proj = this.projectsList.find(p => p.id === projectId);
    if (!proj) throw new Error('Listing project not found');

    const newLead: Lead = {
      id: `l-${Math.random().toString(36).substr(2, 9)}`,
      project_id: projectId,
      connector_id,
      client_name: form.client_name,
      client_email: form.client_email,
      client_phone: form.client_phone,
      client_city: form.client_city,
      client_notes: form.client_notes || '',
      status: 'submitted',
      commission_amount: proj.commission_amount, // 20% value
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.leadsList.unshift(newLead);
    
    // Project triggers
    proj.total_leads += 1;

    // Connector triggers
    const conn = this.users.find(u => u.id === connector_id);
    if (conn) {
      conn.total_leads += 1;
    }

    this.saveState();

    // Create system actions
    this.createNotification(connector_id, 'Lead Success!', `Your referral submission for "${form.client_name}" at ${proj.business_name} has been received.`, 'info');
    
    return newLead;
  }

  updateLeadStatus(leadId: string, newStatus: LeadStatus, rejectionReason?: string): Lead {
    const idx = this.leadsList.findIndex(l => l.id === leadId);
    if (idx === -1) throw new Error('Referral record not found');

    const lead = this.leadsList[idx];
    const oldStatus = lead.status;
    
    if (oldStatus === newStatus) return lead;

    lead.status = newStatus;
    lead.updated_at = new Date().toISOString();
    
    if (newStatus === 'rejected') {
      lead.rejection_reason = rejectionReason || 'Does not fit detailed commercial qualification parameters.';
    }

    const proj = this.projectsList.find(p => p.id === lead.project_id);
    const conn = this.users.find(u => u.id === lead.connector_id);

    if (newStatus === 'converted' && oldStatus !== 'converted') {
      lead.converted_at = new Date().toISOString();
      
      if (proj) {
        proj.converted_leads += 1;
      }

      if (conn) {
        conn.converted_leads += 1;
        // Credit commissions
        conn.total_earnings += lead.commission_amount;

        // Check if connector had a referral bonus pending
        if ((conn as any).referred_by) {
          const referrerId = (conn as any).referred_by;
          const referrer = this.users.find(u => u.id === referrerId);
          if (referrer) {
            referrer.total_earnings += 250; // Referrer earns a 250 rupee bonus on referral's first converted lead
            this.createNotification(
              referrerId,
              'Referral Bonus Awarded!',
              `Your referred connector ${conn.full_name} converted their first client lead! INR 250 credit added to your balance.`,
              'success'
            );
          }
          // Remove from queue so it triggers only once
          delete (conn as any).referred_by;
        }

        // Send customized success alert
        this.createNotification(
          lead.connector_id,
          'Referral Converted!',
          `Agreement finalized of ${lead.client_name} for "${proj ? proj.title : 'Listing'}". ${formatINR(lead.commission_amount)} loaded to your account balance!`,
          'success'
        );
      }
    } else if (newStatus === 'rejected' && oldStatus !== 'rejected') {
      this.createNotification(
        lead.connector_id,
        'Lead Disqualified',
        `Your referral client "${lead.client_name}" did not qualify. Code: ${rejectionReason || 'Commercial Mismatch'}`,
        'warning'
      );
    } else {
      // General transition alert
      this.createNotification(
        lead.connector_id,
        'Lead Progress Updated',
        `Referral client "${lead.client_name}" routing status updated to: ${newStatus.toUpperCase()}`,
        'info'
      );
    }

    this.saveState();
    return lead;
  }

  // --- Payouts Operations ---
  getPayouts(userId: string): Payout[] {
    return this.payoutsList.filter(p => p.connector_id === userId);
  }

  getAllPayouts(): any[] {
    return this.payoutsList.map(p => {
      const conn = this.users.find(u => u.id === p.connector_id);
      return {
        ...p,
        connector_name: conn ? conn.full_name : 'N/A',
        connector_email: conn ? conn.email : 'N/A',
        bank_name: conn ? conn.bank_name || 'HDFC Bank' : 'N/A',
        account_number: conn ? conn.account_number || 'N/A' : 'N/A',
        ifsc_code: conn ? conn.ifsc_code || 'N/A' : 'N/A'
      };
    });
  }

  // Available balance is = Total Earnings - (Approved + Paid out amounts)
  // Let us compute simple values:
  getUserStats(userId: string) {
    const conn = this.users.find(u => u.id === userId);
    if (!conn) return { totalEarnings: 0, pendingPayouts: 0, paidPayouts: 0, availableBalance: 0 };

    const payouts = this.payoutsList.filter(p => p.connector_id === userId);
    const pendingPaidPayoutsTotal = payouts
      .filter(p => p.status === 'paid' || p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayouts = payouts
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const paidPayouts = payouts
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = Math.max(0, conn.total_earnings - pendingPaidPayoutsTotal - pendingPayouts);

    return {
      totalEarnings: conn.total_earnings,
      pendingPayouts,
      paidPayouts,
      availableBalance
    };
  }

  requestPayout(userId: string, amount: number, bankForm: { bank_name: string; account_number: string; ifsc_code: string; account_holder_name: string }): Payout {
    const balances = this.getUserStats(userId);
    if (amount < 500) {
      throw new Error('Compliance Hold: Minimum payout processing request size must equal or exceed INR 500.');
    }
    if (amount > balances.availableBalance) {
      throw new Error(`Insufficient funds: Maximum balance available for release is ${formatINR(balances.availableBalance)}`);
    }

    // Save bank details to builder profile automatically (to ensure profile settings persistent updates)
    const conn = this.users.find(u => u.id === userId);
    if (conn) {
      conn.bank_name = bankForm.bank_name;
      conn.account_number = bankForm.account_number;
      conn.ifsc_code = bankForm.ifsc_code;
      conn.account_holder_name = bankForm.account_holder_name;
    }

    const newPayout: Payout = {
      id: `pay-${Math.random().toString(36).substr(2, 9)}`,
      connector_id: userId,
      lead_id: 'manual-release',
      amount,
      status: 'pending',
      payment_method: 'bank_transfer',
      requested_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.payoutsList.unshift(newPayout);
    this.saveState();

    this.createNotification(
      userId,
      'Payout Requested',
      `Payout release request of ${formatINR(amount)} logged. Standard bank dispatch clearances usually processing in 48-72 business hours.`,
      'info'
    );

    return newPayout;
  }

  updatePayoutStatus(payoutId: string, status: PayoutStatus, reference?: string, notes?: string): Payout {
    const idx = this.payoutsList.findIndex(p => p.id === payoutId);
    if (idx === -1) throw new Error('Payout record not found');

    const pay = this.payoutsList[idx];
    pay.status = status;
    pay.updated_at = new Date().toISOString();
    
    if (reference) {
      pay.payment_reference = reference;
    }
    if (notes) {
      pay.notes = notes;
    }
    if (status === 'paid') {
      pay.processed_at = new Date().toISOString();
    }

    this.saveState();

    // Trigger user notification
    const alertType = status === 'paid' ? 'success' as const : (status === 'rejected' ? 'warning' as const : 'info' as const);
    const msg = status === 'paid' 
      ? `Your payout release of ${formatINR(pay.amount)} was dispatched! Ref Number: ${reference || 'N/A'}`
      : `Your payout release of ${formatINR(pay.amount)} was updated to: ${status.toUpperCase()}. Notes: ${notes || 'Contact support'}`;
    
    this.createNotification(pay.connector_id, `Payout Request ${status.toUpperCase()}`, msg, alertType);

    return pay;
  }

  // --- Notifications ---
  getNotifications(userId: string): Notification[] {
    return this.notificationsList.filter(n => n.user_id === userId);
  }

  createNotification(userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' = 'info'): Notification {
    const newNotif: Notification = {
      id: `n-${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.notificationsList.unshift(newNotif);
    this.saveState();
    return newNotif;
  }

  markAllNotificationsRead(userId: string) {
    this.notificationsList = this.notificationsList.map(n => {
      if (n.user_id === userId) {
        return { ...n, is_read: true };
      }
      return n;
    });
    this.saveState();
  }

  // --- Leaderboard Operations ---
  getLeaderboard(): LeaderboardEntry[] {
    // Generate top entries anonymized based on real or simulated rankings
    const locations = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Jaipur', 'Chennai', 'Noida', 'Kota', 'Ahmedabad'];
    
    // Sort our actual connectors
    const realConnectors = this.users
      .filter(u => u.role === 'connector')
      .map(u => ({
        id: u.id,
        full_name: u.full_name,
        city: u.city || 'Mumbai',
        earnings: u.total_earnings,
        leads_converted: u.converted_leads
      }));

    // Add additional mock connectors to meet top 10 criteria
    const displayList = [...realConnectors];
    const seedNames = ['Aman Verma', 'Priya Iyer', 'Rohan Das', 'Neha Nair', 'Vikram Rao', 'Suresh Mehra', 'Kavita Chawla'];
    
    for (let i = displayList.length; i < 10; i++) {
      const idx = i - realConnectors.length;
      displayList.push({
        id: `m-conn-${idx}`,
        full_name: seedNames[idx % seedNames.length],
        city: locations[idx % locations.length],
        earnings: 55000 - (idx * 6500),
        leads_converted: Math.max(1, 4 - idx)
      });
    }

    return displayList
      .sort((a, b) => b.earnings - a.earnings)
      .map((item, idx) => ({
        id: item.id,
        full_name: item.id === this.currentUserId ? item.full_name : `Connector from ${item.city}`,
        city: item.city,
        rank: idx + 1,
        earnings: item.earnings,
        leads_converted: item.leads_converted
      }));
  }

  // --- Profile update ---
  updateProfile(userId: string, updates: Partial<Profile>): Profile {
    const idx = this.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      this.users[idx] = {
        ...this.users[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.saveState();
      return this.users[idx];
    }
    throw new Error('Profile not found');
  }
}

export const dbState = new LeadBridgeStateEngine();
