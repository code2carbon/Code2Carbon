'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import './home-ui.css';

/* ==========================================================================
   Shared building blocks
   Small presentational helpers that replace repeated markup. Every class name,
   ID and data attribute that the legacy scripts (script.js, chatbot.js) rely on
   is preserved exactly.
   ========================================================================== */

type IconProps = {
  className?: string;
  strokeWidth?: number;
  size?: number;
  children: ReactNode;
};

/** Standard 24x24 stroke icon shell used across the page. */
const Icon = ({ className, strokeWidth = 2, size, children }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
  >
    {children}
  </svg>
);

/** Leaf logo mark + wordmark (nav shows the detailed leaf with a vein). */
const BrandContent = ({ detailed = false }: { detailed?: boolean }) => (
  <>
    <Icon className="logo-svg" strokeWidth={2.5}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8.5C18.4 18 14.5 20 11 20z" />
      {detailed && <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />}
    </Icon>
    <span>
      Carbon<span>Track</span>
    </span>
  </>
);

const SectionHeader = ({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) => (
  <div className="section-header text-center">
    <span className="section-label">{label}</span>
    <h2 className="section-title">{title}</h2>
    <div className="title-bar"></div>
    <p className="section-desc">{children}</p>
  </div>
);

/* ==========================================================================
   Content data
   ========================================================================== */

const NAV_LINKS = [
  { href: '#home', label: 'Home', active: true },
  { href: '#about', label: 'About' },
  { href: '#methodology', label: 'Methodology' },
  { href: '#features', label: 'Features' },
  { href: '/calculator', label: 'Calculator', route: true },
  { href: '#planner', label: 'Planner' },
  { href: '#privacy', label: 'Privacy' },
];

const HERO_BADGES = ['ISO 14064-1', 'GHG Protocol', 'Scope 1 · 2 · 3', 'CO₂e Reporting'];

const STANDARDS = [
  { title: 'ISO 14064-1', desc: 'GHG quantification & reporting standard' },
  { title: 'GHG Protocol', desc: 'Corporate accounting & reporting standard' },
  { title: 'IPCC Guidelines', desc: 'National GHG inventory methodologies' },
  { title: 'Govt. Emission Factors', desc: 'Regionally verified CO₂e coefficients' },
];

const ABOUT_CARDS: { tone: string; title: string; desc: string; icon: ReactNode }[] = [
  {
    tone: 'green',
    title: 'Institutional Data Collection',
    desc: 'Centralize electricity, diesel, petrol, LPG, water, paper, waste, refrigerant, and business-travel data from every department in one secure ledger.',
    icon: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </>
    ),
  },
  {
    tone: 'blue',
    title: 'Standards-Based Assessment',
    desc: 'Convert activity data into precise CO₂e emissions using ISO 14064-1, the GHG Protocol, IPCC guidelines, and government-published emission factors.',
    icon: (
      <>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </>
    ),
  },
  {
    tone: 'emerald',
    title: 'Actionable Reporting',
    desc: 'Generate scope-wise carbon inventories, executive dashboards, and audit-ready reports aligned to net-zero and sustainability disclosure frameworks.',
    icon: (
      <>
        <path d="M3 3v18h18"></path>
        <polyline points="18.7 8 13.7 13 10.9 10.2 7 14.3"></polyline>
      </>
    ),
  },
];

const STATS = [
  { number: '3', text: 'Emission Scopes Covered' },
  { number: '20+', text: 'Emission Categories' },
  { number: '100%', text: 'Standards Based' },
  { number: '24/7', text: 'Data Access' },
];

const INITIATIVES = [
  {
    id: 'init-solar',
    title: 'Solar Rooftop Array (50 kW)',
    scope: 'scope2',
    desc: 'Install on-site photovoltaic solar panels to offset grid electricity consumption.',
    capex: '$45,000',
    payback: '~5 Years',
    impact: '-30% Electricity',
  },
  {
    id: 'init-ev',
    title: 'EV Campus Fleet Transition',
    scope: 'scope1',
    desc: 'Replace gasoline and diesel shuttle buses and facilities vehicles with electric models.',
    capex: '$60,000',
    payback: '~6 Years',
    impact: '-80% Fleet Fuel',
  },
  {
    id: 'init-led',
    title: 'LED Lighting & HVAC Retrofit',
    scope: 'scope2',
    desc: 'Upgrade campus buildings to smart LED fixtures and energy-efficient HVAC units.',
    capex: '$15,000',
    payback: '~3.5 Years',
    impact: '-15% Electricity',
  },
  {
    id: 'init-waste',
    title: 'Zero-Waste Composting & Recycling',
    scope: 'scope3',
    desc: 'Establish on-campus waste composting and enhanced recycling flow systems.',
    capex: '$8,000',
    payback: '~2 Years',
    impact: '-60% Waste',
  },
  {
    id: 'init-paper',
    title: 'Paperless Campus Transition',
    scope: 'scope3',
    desc: 'Transition to 100% digital administration, exams, and paperless class materials.',
    capex: '$3,000',
    payback: '~1 Year',
    impact: '-90% Paper',
  },
];

const SCOPE_LABEL: Record<string, string> = {
  scope1: 'Scope 1',
  scope2: 'Scope 2',
  scope3: 'Scope 3',
};

const PLANNER_KPIS = [
  { label: 'Simulated Reduction', id: 'planner-reduction-tons', initial: '0.00', unit: 'tCO₂e/yr', emerald: true },
  { label: 'Reduction Percentage', id: 'planner-reduction-pct', initial: '0', unit: '%', emerald: true },
  { label: 'Cumulative CapEx', id: 'planner-total-capex', initial: '0', unit: '$', unitFirst: true },
  { label: 'Est. Payback Period', id: 'planner-avg-payback', initial: '0.0', unit: 'years' },
];

const FORECAST_GRID_Y = [0, 62.5, 125, 187.5, 250];
const FORECAST_YEARS = ['2026', '2028', '2030', '2032', '2034', '2036'];

const FORECAST_LEGEND = [
  { line: 'line-bau', text: 'Business-As-Usual (BAU) baseline' },
  { line: 'line-decarb', text: 'Projected Decarbonization Pathway' },
  { line: 'line-target', text: 'Net-Zero Benchmark Alignment' },
];

const DASH_KPIS = [
  { title: 'Total CO₂e', value: '824 t', change: '12.4% vs LY', trend: 'down' },
  { title: 'Scope 1', scope: 'scope1', value: '231 t', change: '8.1% vs LY', trend: 'up' },
  { title: 'Scope 2', scope: 'scope2', value: '387 t', change: '15.3% vs LY', trend: 'down' },
  { title: 'Scope 3', scope: 'scope3', value: '206 t', change: '4.7% vs LY', trend: 'down' },
] as const;

const DONUT_LEGEND = [
  { scope: 'scope1', name: 'Scope 1', pct: '28%' },
  { scope: 'scope2', name: 'Scope 2', pct: '47%' },
  { scope: 'scope3', name: 'Scope 3', pct: '25%' },
];

const TREND_Y_LABELS = ['100t', '75t', '50t', '25t', '0'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TREND_LINE =
  'M 0 65 C 22.5 68.5, 22.5 72, 45 72 C 67.5 72, 67.5 55, 90 55 C 112.5 55, 112.5 85, 135 85 C 157.5 85, 157.5 92, 180 92 C 202.5 92, 202.5 88, 225 88 C 247.5 88, 247.5 100, 270 100 C 292.5 100, 292.5 105, 315 105 C 337.5 105, 337.5 95, 360 95 C 382.5 95, 382.5 98, 405 98 C 427.5 98, 427.5 110, 450 110 C 475 110, 475 120, 500 120';

const TIMELINE_STEPS: { title: string; desc: string; icon: ReactNode }[] = [
  {
    title: 'Data Collection',
    desc: 'User logs daily variables including energy utility bills, transport fuels, dietary profiles, and recycling habits securely into the engine.',
    icon: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </>
    ),
  },
  {
    title: 'Emission Calculation',
    desc: 'Our processing layer maps inputs against localized carbon coefficients (e.g., eGRID regional grid emissions, EPA transport fuel density tables).',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <line x1="9" y1="9" x2="15" y2="15"></line>
        <line x1="15" y1="9" x2="9" y2="15"></line>
      </>
    ),
  },
  {
    title: 'Statistical Analysis',
    desc: 'Data aggregates to categorize sources (scopes 1, 2, and 3 emissions) and benchmarks profiles against global climate reduction agreements.',
    icon: (
      <>
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
      </>
    ),
  },
  {
    title: 'Recommendations',
    desc: 'AI heuristics supply personalized action plans—like micro-offset investments, solar installation timelines, and low-carb habits.',
    icon: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </>
    ),
  },
];

const FEATURES: { tone: string; title: string; desc: string; icon: ReactNode }[] = [
  {
    tone: 'green',
    title: 'Scope 1, 2 & 3 Tracking',
    desc: 'Track direct combustion, purchased energy, and full value-chain emissions across every category defined by the GHG Protocol.',
    icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>,
  },
  {
    tone: 'blue',
    title: 'Automated Carbon Inventory',
    desc: 'Activity data automatically flows into scope-classified inventories — no manual spreadsheets, no calculation errors.',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="17" y1="3" x2="17" y2="21"></line>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
      </>
    ),
  },
  {
    tone: 'emerald',
    title: 'Dashboard Analytics',
    desc: 'Executive dashboards with real-time KPIs, scope-wise breakdowns, monthly trends, and comparative benchmarking.',
    icon: (
      <>
        <path d="M3 3v18h18"></path>
        <polyline points="18.7 8 13.7 13 10.9 10.2 7 14.3"></polyline>
      </>
    ),
  },
  {
    tone: 'teal',
    title: 'Report Generation',
    desc: 'Generate audit-ready CO₂e reports aligned to ISO 14064-1, GHG Protocol, and internal ESG disclosure requirements.',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </>
    ),
  },
  {
    tone: 'orange',
    title: 'AI Recommendations',
    desc: 'Context-aware reduction insights that surface the highest-impact opportunities based on your emissions profile.',
    icon: (
      <>
        <path d="M9 21h6"></path>
        <path d="M9 17h6"></path>
        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17h8v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"></path>
      </>
    ),
  },
  {
    tone: 'purple',
    title: 'Institutional Data Management',
    desc: 'Role-based access, department-wise data ownership, and secure audit trails engineered for multi-campus institutions.',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>,
  },
];

const PRIVACY_ITEMS: { title: string; desc: string; icon: ReactNode }[] = [
  {
    title: 'Institution Data Security',
    desc: 'All institutional data is encrypted in transit (TLS 1.3) and at rest (AES-256). Segmented by tenant with zero cross-institution exposure.',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>,
  },
  {
    title: 'Role-Based Access Control',
    desc: 'Granular permissions for administrators, sustainability officers, department heads, and auditors — every action is scoped to a role.',
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M16 11l2 2 4-4"></path>
      </>
    ),
  },
  {
    title: 'Encrypted Records',
    desc: 'Utility bills, invoices, and activity logs are stored as encrypted records — no data ever leaves your compliance boundary.',
    icon: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </>
    ),
  },
  {
    title: 'Full Audit Trail',
    desc: 'Every data entry, edit, calculation, and report export is logged with timestamp and user attribution for defensible reporting.',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="9" x2="15" y2="9"></line>
        <line x1="9" y1="13" x2="15" y2="13"></line>
        <line x1="9" y1="17" x2="15" y2="17"></line>
      </>
    ),
  },
];

const FOOTER_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About Platform' },
  { href: '/calculator', label: 'Footprint Calculator', route: true },
  { href: '#methodology', label: 'Our Methodology' },
  { href: '#features', label: 'Core Features' },
  { href: '#privacy', label: 'Privacy Governance' },
];

const FOOTER_CONTACT: { text: string; icon: ReactNode }[] = [
  {
    text: 'research@carbontrack.org',
    icon: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </>
    ),
  },
  {
    text: 'University Research Hub, Campus Green',
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </>
    ),
  },
  {
    text: '+1 (555) 234-9876',
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    ),
  },
];

/* ==========================================================================
   Section components
   ========================================================================== */

/* ---------- Hero illustration ---------- */

const Tree = ({
  x,
  y,
  s = 1,
  tone = 'light',
  sway = 'tree-left',
}: {
  x: number;
  y: number;
  s?: number;
  tone?: 'light' | 'deep';
  sway?: 'tree-left' | 'tree-right';
}) => {
  const [base, top] = tone === 'deep' ? ['#047857', '#10b981'] : ['#16a34a', '#4ade80'];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={`tree ${sway}`}>
        <rect x="-2" y="-6" width="4" height="28" rx="2" fill="#78350f" />
        <circle cx="0" cy="-22" r="17" fill={base} />
        <circle cx="-10" cy="-12" r="11" fill={base} />
        <circle cx="11" cy="-13" r="12" fill={base} />
        <circle cx="3" cy="-29" r="10" fill={top} fillOpacity=".85" />
      </g>
    </g>
  );
};

const Turbine = ({ x, y, s = 1, fast = false }: { x: number; y: number; s?: number; fast?: boolean }) => (
  <g className={fast ? 'turbine fast' : 'turbine'} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-2.6 0 L2.6 0 L4.2 92 L-4.2 92 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth=".8" />
    <g className="blades">
      {[0, 120, 240].map((deg) => (
        <path
          key={deg}
          d="M0 0 L-3.2 -46 Q0 -51 3.2 -46 Z"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth=".8"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r="4.6" fill="#94a3b8" />
    </g>
  </g>
);

const SKYLINE = [
  { x: 228, y: 120, w: 22, h: 70 },
  { x: 252, y: 92, w: 28, h: 98 },
  { x: 282, y: 108, w: 24, h: 82 },
  { x: 308, y: 126, w: 20, h: 64 },
];

const HeroIllustration = () => (
  <svg
    className="eco-illustration"
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="A green globe on rolling hills with trees, wind turbines and city buildings"
  >
    <defs>
      <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#34D399" stopOpacity="0.28" />
        <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="earth-gradient" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0c4a6e" />
      </linearGradient>
      <linearGradient id="hero-hill-back" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bbf7d0" />
        <stop offset="100%" stopColor="#86efac" />
      </linearGradient>
      <linearGradient id="hero-hill-mid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>
      <linearGradient id="hero-hill-front" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
      <linearGradient id="hero-leaf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#bbf7d0" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
      <linearGradient id="hero-building" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#dbeafe" />
        <stop offset="100%" stopColor="#7dd3fc" />
      </linearGradient>
      <pattern id="hero-windows" width="8" height="10" patternUnits="userSpaceOnUse">
        <rect x="2" y="3" width="4" height="4" rx="0.8" fill="#ffffff" fillOpacity="0.85" />
      </pattern>
      <clipPath id="hero-globe-clip">
        <circle cx="250" cy="250" r="105" />
      </clipPath>
    </defs>

    {/* Sky glow, orbit ring and clouds */}
    <circle cx="250" cy="250" r="190" fill="url(#sun-glow)" />
    <circle className="sun-orbit" cx="250" cy="250" r="176" stroke="#10b981" strokeOpacity="0.28" strokeWidth="1.4" strokeDasharray="8 12" />
    <g className="cloud cloud-1" fill="#ffffff" fillOpacity="0.95">
      <circle cx="70" cy="92" r="16" />
      <circle cx="92" cy="82" r="20" />
      <circle cx="116" cy="93" r="15" />
      <rect x="56" y="91" width="74" height="17" rx="8" />
    </g>
    <g className="cloud cloud-2" fill="#ffffff" fillOpacity="0.85">
      <circle cx="392" cy="62" r="13" />
      <circle cx="410" cy="54" r="17" />
      <circle cx="430" cy="63" r="12" />
      <rect x="380" y="62" width="62" height="14" rx="7" />
    </g>

    {/* City skyline standing on top of the globe */}
    <g>
      {SKYLINE.map((b) => (
        <g key={b.x}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill="url(#hero-building)" />
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill="url(#hero-windows)" />
        </g>
      ))}
      <rect x="264" y="82" width="3" height="12" fill="#64748b" />
    </g>

    {/* Globe */}
    <g className="earth-group">
      <circle cx="250" cy="250" r="105" fill="url(#earth-gradient)" className="earth-core" />
      <g clipPath="url(#hero-globe-clip)">
        <g className="earth-land">
          <path d="M175 190 C190 170 215 168 228 182 C240 196 232 214 218 222 C226 240 214 262 200 276 C190 288 176 280 172 262 C168 244 160 226 165 208 Z" fill="#4ade80" />
          <path d="M262 178 C282 166 310 172 322 190 C330 204 318 216 304 218 C312 238 304 266 288 284 C276 298 258 290 254 272 C250 254 258 242 252 226 C246 210 248 190 262 178 Z" fill="#22c55e" />
          <path d="M300 300 C316 296 328 306 322 320 C314 330 298 326 296 314 Z" fill="#4ade80" />
          <path d="M205 300 C216 298 224 306 220 316 C212 322 202 316 205 300 Z" fill="#22c55e" />
        </g>
        <ellipse cx="200" cy="184" rx="34" ry="16" transform="rotate(-32 200 184)" fill="#ffffff" fillOpacity="0.14" />
      </g>
      <circle cx="250" cy="250" r="105" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" />
    </g>

    {/* Big leaves framing the globe */}
    <path d="M110 335 C72 282 96 206 168 186 C188 256 168 322 110 335 Z" fill="url(#hero-leaf)" />
    <path d="M113 330 C128 282 144 240 163 200" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M96 372 C62 336 78 286 128 276 C142 322 132 360 96 372 Z" fill="url(#hero-leaf)" fillOpacity="0.92" />
    <path d="M98 368 C106 336 116 308 126 282" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />

    {/* Rolling hills */}
    <path d="M0 372 C80 336 160 326 250 346 C340 366 420 336 500 326 L500 500 L0 500 Z" fill="url(#hero-hill-back)" />
    <Turbine x={360} y={256} s={1} fast />
    <Turbine x={414} y={284} s={0.72} />
    <Turbine x={452} y={304} s={0.52} />
    <path d="M0 418 C90 378 180 398 270 392 C360 386 430 366 500 382 L500 500 L0 500 Z" fill="url(#hero-hill-mid)" />
    <Tree x={52} y={398} s={0.9} sway="tree-left" />
    <Tree x={92} y={408} s={0.7} tone="deep" sway="tree-right" />
    <Tree x={326} y={388} s={0.7} sway="tree-right" />
    <Tree x={356} y={392} s={0.55} tone="deep" sway="tree-left" />
    <path d="M0 466 C100 430 200 452 300 442 C380 434 450 420 500 430 L500 500 L0 500 Z" fill="url(#hero-hill-front)" />

    {/* Winding path */}
    <path d="M150 500 C196 462 128 440 206 418 C268 402 336 428 392 396" stroke="#e2e8f0" strokeWidth="13" strokeLinecap="round" fill="none" />
    <path d="M150 500 C196 462 128 440 206 418 C268 402 336 428 392 396" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" fill="none" />

    <Tree x={46} y={470} s={1.15} tone="deep" sway="tree-right" />
    <Tree x={92} y={484} s={0.85} sway="tree-left" />
    <Tree x={430} y={462} s={1.25} tone="deep" sway="tree-left" />
    <Tree x={476} y={474} s={0.95} sway="tree-right" />

    {/* Solar panel */}
    <g transform="translate(300 452)">
      <path d="M0 18 L12 0 L52 0 L40 18 Z" fill="#1e3a8a" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M13 12 L26 0 M27 18 L40 0 M6 9 L46 9" stroke="#60a5fa" strokeWidth="1" />
      <line x1="26" y1="18" x2="26" y2="30" stroke="#475569" strokeWidth="2.5" />
    </g>

    {/* Floating leaves */}
    <path className="leaf-particle l1" d="M62 250 C72 240 87 240 92 255 C82 265 67 260 62 250 Z" fill="#10B981" fillOpacity="0.7" />
    <path className="leaf-particle l2" d="M418 210 C428 200 443 205 446 215 C436 225 423 220 418 210 Z" fill="#34D399" fillOpacity="0.65" />
  </svg>
);

/* ---------- Navigation ---------- */

const Navbar = () => (
  <header className="navbar" id="navbar">
    <div className="nav-container">
      <a href="#home" className="logo" id="nav-logo">
        <BrandContent detailed />
      </a>

      <nav className="nav-menu" id="nav-menu">
        {NAV_LINKS.map((link) =>
          link.route ? (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ) : (
            <a key={link.href} href={link.href} className={link.active ? 'nav-link active' : 'nav-link'}>
              {link.label}
            </a>
          ),
        )}
        <a href="#login" className="nav-btn-login-mobile">
          Login
        </a>
      </nav>

      <div className="nav-actions">
        <a href="#login" className="btn-login-nav" id="login-nav-trigger">
          Login
        </a>
        <button className="hamburger-toggle" id="hamburger-toggle" aria-label="Toggle Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
);

/* ---------- Hero ---------- */

const Hero = () => (
  <section className="hero-section" id="home">
    <div className="hero-bg-overlay"></div>
    <div className="hero-container">
      <div className="hero-content">
        <div className="hero-tagline">
          <span className="pulse-dot"></span> Institutional Sustainability Platform
        </div>
        <h1 className="hero-title">
          Measure, Report &<br />
          <span className="highlight-text">Reduce Carbon Emissions</span>
        </h1>
        <p className="hero-subtitle">
          CarbonTrack helps educational institutions measure, analyze, and report Scope 1, 2, and 3 greenhouse gas
          emissions using internationally recognized methodologies. Build carbon inventories, unlock actionable
          insights, and progress toward net-zero goals from a single platform.
        </p>
        <div className="hero-badges">
          {HERO_BADGES.map((badge) => (
            <div className="hero-badge-pill" key={badge}>
              <Icon className="badge-check-icon" strokeWidth={3}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </Icon>
              <span>{badge}</span>
            </div>
          ))}
        </div>
        <div className="hero-ctas">
          <Link href="/calculator" className="btn btn-primary">
            <span>Explore Platform</span>
            <Icon size={18}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </Icon>
          </Link>
          <a href="#methodology" className="btn btn-secondary">
            View Methodology
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="glass-scene-card">
          <HeroIllustration />
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Standards ---------- */

const Standards = () => (
  <section className="standards-section">
    <div className="container">
      <div className="standards-header text-center">
        <span className="standards-label">Built on Internationally Trusted Standards</span>
      </div>
      <div className="standards-grid">
        {STANDARDS.map((s) => (
          <div className="standard-card" key={s.title}>
            <div className="standard-icon-box">
              <Icon className="standard-icon" strokeWidth={2.2}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </Icon>
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- About ---------- */

const About = () => (
  <section className="about-section" id="about">
    <div className="container">
      <SectionHeader label="Understanding Emissions" title="Why CarbonTrack?">
        CarbonTrack enables educational institutions to measure, analyze, and report greenhouse gas emissions in
        accordance with internationally recognized standards. By converting activity data into CO₂e emissions and
        categorizing them into Scope 1, Scope 2, and Scope 3, the platform helps organizations understand their
        environmental impact and identify opportunities for emission reduction.
      </SectionHeader>
      <div className="grid grid-3">
        {ABOUT_CARDS.map((card) => (
          <div className="card about-card scroll-reveal" key={card.title}>
            <div className="card-icon-container">
              <Icon className={`card-icon ${card.tone}`}>{card.icon}</Icon>
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Stats ---------- */

const Stats = () => (
  <section className="stats-section">
    <div className="container">
      <div className="stats-header text-center">
        <span className="stats-label">Platform at a Glance</span>
        <h2 className="stats-title">Built for institutional scale</h2>
        <p className="stats-desc">
          Structured to handle the complexity of educational institutions — from single-campus colleges to
          multi-campus universities.
        </p>
      </div>
      <div className="stats-grid">
        {STATS.map((stat) => (
          <div className="stat-card scroll-reveal" key={stat.text}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-text">{stat.text}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Net-Zero Planner ---------- */

type Initiative = (typeof INITIATIVES)[number];

const InitiativeCard = ({ id, title, scope, desc, capex, payback, impact }: Initiative) => (
  <label className="initiative-card glass-card" htmlFor={id}>
    <div className="initiative-header">
      <input type="checkbox" id={id} />
      <span className="custom-checkbox"></span>
      <div className="initiative-title-box">
        <h4>{title}</h4>
        <span className={`init-scope-badge ${scope}`}>{SCOPE_LABEL[scope]}</span>
      </div>
    </div>
    <p className="initiative-desc">{desc}</p>
    <div className="initiative-meta">
      <span>
        <strong>Est. CapEx:</strong> {capex}
      </span>
      <span>
        <strong>Payback:</strong> {payback}
      </span>
      <span className="savings-text">
        <strong>Impact:</strong> {impact}
      </span>
    </div>
  </label>
);

const PlannerKpi = ({
  label,
  id,
  initial,
  unit,
  emerald,
  unitFirst,
}: {
  label: string;
  id: string;
  initial: string;
  unit: string;
  emerald?: boolean;
  unitFirst?: boolean;
}) => (
  <div className="planner-kpi">
    <span className="kpi-label">{label}</span>
    <div className={emerald ? 'kpi-value-wrapper text-emerald' : 'kpi-value-wrapper'}>
      {unitFirst && <span className="kpi-unit">{unit}</span>}
      <span className="kpi-num" id={id}>
        {initial}
      </span>
      {!unitFirst && <span className="kpi-unit">{unit}</span>}
    </div>
  </div>
);

const Planner = () => (
  <section className="planner-section" id="planner">
    <div className="container">
      <SectionHeader label="Decarbonization Pathway" title="Net-Zero Transition Hub">
        Simulate your path to sustainability. Toggle specific green initiatives to see their direct CapEx cost,
        payback time, and aggregate impact on your 10-year carbon emissions forecast.
      </SectionHeader>

      <div className="planner-wrapper">
        {/* Left: checklist of initiatives */}
        <div className="planner-initiatives">
          <h3 className="planner-subtitle">Select Mitigation Initiatives</h3>
          <div className="initiatives-list">
            {INITIATIVES.map((item) => (
              <InitiativeCard key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* Right: 10-year trajectory chart */}
        <div className="planner-chart-card glass-card">
          <div className="planner-chart-header">
            <h3>10-Year Decarbonization Trajectory</h3>
            <p>Simulated pathway vs. Business-As-Usual (BAU) (+1.5%/yr expansion)</p>
          </div>

          <div className="planner-kpis">
            {PLANNER_KPIS.map((kpi) => (
              <PlannerKpi key={kpi.id} {...kpi} />
            ))}
          </div>

          <div className="forecast-chart-container">
            <div className="y-axis-labels-forecast">
              <span className="y-label-max" id="forecast-y-max">120t</span>
              <span className="y-label-mid2" id="forecast-y-mid2">80t</span>
              <span className="y-label-mid1" id="forecast-y-mid1">40t</span>
              <span className="y-label-min" id="forecast-y-min">0t</span>
            </div>
            <div className="forecast-chart-wrapper" id="forecast-chart-wrapper">
              <svg className="forecast-chart-svg" viewBox="0 0 500 250" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="forecast-grad-emerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="forecast-grad-grey" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {FORECAST_GRID_Y.map((y) => (
                  <line key={y} x1="0" y1={y} x2="500" y2={y} className="chart-grid-line-svg" />
                ))}
                <line x1="0" y1="230" x2="500" y2="230" className="chart-net-zero-line" strokeDasharray="5 5" />
                <path id="chart-path-bau-area" d="" fill="url(#forecast-grad-grey)" />
                <path id="chart-path-bau" d="" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 4" />
                <path id="chart-path-decarb-area" d="" fill="url(#forecast-grad-emerald)" />
                <path id="chart-path-decarb" d="" fill="none" stroke="#10B981" strokeWidth="3.5" />
              </svg>
            </div>
          </div>

          <div className="forecast-x-axis">
            {FORECAST_YEARS.map((year) => (
              <span key={year}>{year}</span>
            ))}
          </div>

          <div className="forecast-legend">
            {FORECAST_LEGEND.map((item) => (
              <div className="legend-item" key={item.line}>
                <span className={`legend-line ${item.line}`}></span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Dashboard preview ---------- */

const TrendIcon = ({ direction }: { direction: 'up' | 'down' }) => (
  <Icon size={12} strokeWidth={3}>
    {direction === 'down' ? (
      <>
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
        <polyline points="17 18 23 18 23 12"></polyline>
      </>
    ) : (
      <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </>
    )}
  </Icon>
);

const Dashboard = () => (
  <section className="dashboard-section" id="dashboard">
    <div className="container">
      <SectionHeader label="Live Dashboard" title="See your entire carbon inventory at a glance">
        A preview of the CarbonTrack analytics dashboard — real-time KPIs, scope-wise breakdowns, and monthly
        emissions trends.
      </SectionHeader>

      <div className="dashboard-frame scroll-reveal">
        <div className="dashboard-top">
          <div className="dashboard-title-box">
            <h3>FY 2025-26 Carbon Inventory</h3>
            <p>Auto-refreshed — Aligned to GHG Protocol</p>
          </div>
          <div className="dashboard-status">
            <span className="live-dot"></span>
            <span>Live Data</span>
          </div>
        </div>

        <div className="kpi-grid">
          {DASH_KPIS.map((kpi) => (
            <div className="kpi-card" key={kpi.title}>
              <span className="kpi-title">
                {'scope' in kpi && <span className={`color-indicator ${kpi.scope}`}></span>}
                {kpi.title}
              </span>
              <h4 className="kpi-value">{kpi.value}</h4>
              <span className={`kpi-change ${kpi.trend === 'down' ? 'decrease' : 'increase'}`}>
                <TrendIcon direction={kpi.trend} />
                {kpi.change}
              </span>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h5>Emissions by Scope</h5>
              <p>Share of total tCO₂e</p>
            </div>
            <div className="donut-chart-container">
              <div className="donut-chart">
                <div className="donut-center"></div>
              </div>
              <div className="donut-legend">
                {DONUT_LEGEND.map((row) => (
                  <div className="legend-item" key={row.scope}>
                    <span className={`legend-dot ${row.scope}`}></span>
                    <span className="legend-name">{row.name}</span>
                    <span className="legend-pct">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h5>Monthly Emissions Trend</h5>
              <p>tCO₂e per month — rolling 12 months</p>
            </div>
            <div className="trend-chart-container">
              <div className="y-axis-labels">
                {TREND_Y_LABELS.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="trend-chart-wrapper">
                <svg className="trend-chart-svg" viewBox="0 0 500 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[36, 72, 108, 144].map((y) => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} className="trend-grid-line" stroke="#f1f5f9" strokeWidth="1.5" />
                  ))}
                  <path d={`${TREND_LINE} L 500 180 L 0 180 Z`} fill="url(#chart-grad)" />
                  <path d={TREND_LINE} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="x-axis-labels">
              {MONTHS.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Methodology ---------- */

const Methodology = () => (
  <section className="methodology-section" id="methodology">
    <div className="container">
      <SectionHeader label="Our Process" title="Assessment Methodology">
        CarbonTrack leverages environmental frameworks established by the Intergovernmental Panel on Climate Change
        (IPCC) and the EPA to guarantee analytical accuracy.
      </SectionHeader>

      <div className="timeline-container">
        <div className="timeline-line"></div>

        {TIMELINE_STEPS.map((step, index) => (
          <div className={index === 0 ? 'timeline-step active' : 'timeline-step'} data-step={index + 1} key={step.title}>
            <div className="timeline-marker">
              <Icon className="timeline-icon" strokeWidth={2.5}>
                {step.icon}
              </Icon>
            </div>
            <div className="timeline-content card">
              <span className="step-badge">Step 0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="methodology-details-panel glass-card text-center" id="methodology-details">
        <h4 id="detail-title">Data Collection Deep-Dive</h4>
        <p id="detail-desc">
          Our primary ledger ingests data variables via API hooks. Users can hook smart meters or upload utility
          statement sheets to automate calculations. All metrics conform to standard equivalent mass parameters of
          Carbon Dioxide (CO₂e).
        </p>
      </div>
    </div>
  </section>
);

/* ---------- Features ---------- */

const Features = () => (
  <section className="features-section" id="features">
    <div className="container">
      <SectionHeader label="Platform Capabilities" title="Everything you need for institutional carbon accounting">
        Six purpose-built modules that cover the full lifecycle — from data ingestion to standards-aligned reporting.
      </SectionHeader>

      <div className="grid grid-3">
        {FEATURES.map((feature) => (
          <div className="feature-card glass-card scroll-reveal" key={feature.title}>
            <div className="feature-header">
              <div className={`feature-icon bg-${feature.tone}`}>
                <Icon className="icon">{feature.icon}</Icon>
              </div>
              <h3>{feature.title}</h3>
            </div>
            <p>{feature.desc}</p>
            <div className="hover-decoration"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Privacy ---------- */

const ShieldIllustration = () => (
  <svg viewBox="0 0 200 200" className="shield-illustration" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="url(#shield-bg-grad)" />
    <path d="M100 45 C 115 45, 140 40, 145 35 C 145 60, 145 105, 100 150 C 55 105, 55 60, 55 35 C 60 40, 85 45, 100 45 Z" fill="#10B981" fillOpacity="0.2" stroke="#34D399" strokeWidth="4" />
    <rect x="85" y="90" width="30" height="22" rx="3" fill="#3B82F6" />
    <path d="M90 90 V 78 A 10 10 0 0 1 110 78 V 90" stroke="#3B82F6" strokeWidth="3.5" fill="none" />
    <circle cx="100" cy="101" r="3" fill="white" />
    <path d="M100 104 V 108" stroke="white" strokeWidth="2" />
    <circle cx="45" cy="70" r="3" fill="#6EE7B7" className="sparkle" />
    <circle cx="150" cy="130" r="4" fill="#60A5FA" className="sparkle fast" />
    <defs>
      <radialGradient id="shield-bg-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
      </radialGradient>
    </defs>
  </svg>
);

const Privacy = () => (
  <section className="privacy-section" id="privacy">
    <div className="container">
      <SectionHeader label="Trust & Security" title="Institution-grade data governance">
        Purpose-built controls that keep sensitive institutional data secure, auditable, and compliant.
      </SectionHeader>

      <div className="privacy-grid glass-card scroll-reveal">
        <div className="privacy-graphic">
          <ShieldIllustration />
        </div>
        <div className="privacy-info">
          {PRIVACY_ITEMS.map((item) => (
            <div className="privacy-item" key={item.title}>
              <div className="privacy-icon-box">
                <Icon className="privacy-item-icon" strokeWidth={2.5}>
                  {item.icon}
                </Icon>
              </div>
              <div className="privacy-text">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Login ---------- */

const FormField = ({
  id,
  label,
  type,
  placeholder,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}) => (
  <div className="form-control">
    <label htmlFor={id}>{label}</label>
    <input type={type} id={id} required placeholder={placeholder} />
  </div>
);

const Login = () => (
  <section className="login-section" id="login">
    <div className="container">
      <div className="login-wrapper">
        <div className="card login-card glass-card scroll-reveal">
          <div className="login-header">
            <div className="logo">
              <BrandContent />
            </div>
            <h3>Welcome Back</h3>
            <p>Access your personal carbon assessment tracker</p>
          </div>

          <form className="login-form" id="login-form">
            <FormField id="login-email" label="Email Address" type="email" placeholder="name@domain.com" />
            <FormField id="login-password" label="Password" type="password" placeholder="••••••••" />

            <div className="login-actions-row">
              <label className="checkbox-label">
                <input type="checkbox" id="remember-me" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-pass">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Sign In
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <button className="btn btn-google btn-block" id="btn-google-login">
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <div className="login-footer-text">
            Don&apos;t have a profile yet? <a href="#">Create account</a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Footer ---------- */

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-col brand-col">
          <a href="#home" className="logo">
            <BrandContent />
          </a>
          <p className="quote">&quot;Small actions create a greener future.&quot;</p>
          <p className="footer-about">
            An academic research portal focused on localized carbon indices and smart consumption models.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                {link.route ? <Link href={link.href}>{link.label}</Link> : <a href={link.href}>{link.label}</a>}
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact &amp; Research</h4>
          <ul className="footer-contact">
            {FOOTER_CONTACT.map((item) => (
              <li key={item.text}>
                <Icon className="footer-icon">{item.icon}</Icon>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          &copy; 2026 CarbonTrack Platform. Developed for the Environmental Sciences Research Project. All rights
          reserved.
        </div>
        <div className="footer-socials">
          <a href="#" aria-label="Github Link">
            <Icon size={20}>
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </Icon>
          </a>
          <a href="#" aria-label="Twitter Link">
            <Icon size={20}>
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </Icon>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

/* ---------- Overlays ---------- */

/** ESG audit export modal. Markup and inline styles are unchanged (driven by script.js). */
const AuditModal = () => (
  <div
    className="audit-modal-overlay"
    id="audit-modal-overlay"
    style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.75)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', transition: 'opacity 0.3s ease' }}
  >
    <div
      className="audit-modal glass-card"
      style={{ background: 'var(--white)', maxWidth: '500px', width: '90%', borderRadius: '24px', padding: '36px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.08)', transform: 'translateY(20px)', transition: 'transform 0.3s ease' }}
    >
      <div className="audit-loader" id="audit-loader">
        <div
          className="spinner"
          style={{ width: '60px', height: '60px', border: '4px solid rgba(16, 185, 129, 0.1)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }}
        ></div>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--dark)', marginBottom: '12px', fontWeight: 700 }}>
          Simulating Audit Reporting Ledger
        </h3>
        <p className="loader-status" id="loader-status" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
          Connecting to GHG Protocol factors API...
        </p>
      </div>

      <div className="audit-success-layout" id="audit-success-layout" style={{ display: 'none' }}>
        <div
          className="success-icon-box"
          style={{ width: '64px', height: '64px', background: '#f0fdf4', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid rgba(16, 185, 129, 0.25)' }}
        >
          <Icon size={32} strokeWidth={3}>
            <polyline points="20 6 9 17 4 12"></polyline>
          </Icon>
        </div>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--dark)', marginBottom: '8px', fontWeight: 700 }}>Audit Report Prepared!</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          All scope activity ledgers successfully mapped and verified against ISO 14064-1 standards.
        </p>
        <div
          className="audit-details-card"
          style={{ background: 'var(--light-bg)', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left', fontSize: '0.85rem', border: '1px solid rgba(0,0,0,0.04)', color: 'var(--dark)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Carbon Footprint:</span>
            <strong id="audit-modal-total">29.07 tCO₂e</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Sector Profile Benchmark:</span>
            <strong id="audit-modal-benchmark">Tech Office (35.00 t)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Performance Index:</span>
            <strong id="audit-modal-index" style={{ color: '#10b981' }}>17% below standard</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Verification Status:</span>
            <strong style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                className="live-dot"
                style={{ width: '6px', height: '6px', position: 'static', animation: 'pulse 1.8s infinite', backgroundColor: '#10b981', borderRadius: '50%' }}
              ></span>{' '}
              GHG Verified
            </strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-primary" id="btn-modal-print" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            Print Report
          </button>
          <button
            className="btn btn-secondary"
            id="btn-modal-close"
            style={{ padding: '10px 20px', fontSize: '0.9rem', background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--text-secondary)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ==========================================================================
   Page
   ========================================================================== */

export default function HomePage() {
  useEffect(() => {
    // Dynamically load original JS scripts and re-dispatch DOMContentLoaded
    // so that scripts using document.addEventListener('DOMContentLoaded',...) initialize correctly
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        // Remove old copy first so re-navigation always re-initializes
        const old = document.querySelector(`script[data-ct-src="${src}"]`);
        if (old) old.remove();
        const script = document.createElement('script');
        script.src = src;
        script.setAttribute('data-ct-src', src);
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.body.appendChild(script);
      });
    };

    const fireDCL = () => document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));

    // Load scripts in sequence, fire DOMContentLoaded after each
    loadScript('/js/script.js')
      .then(() => {
        fireDCL();
        return loadScript('/js/chatbot.js');
      })
      .then(() => {
        fireDCL();
      });

    return () => {
      document.querySelectorAll('script[data-ct-src]').forEach((s) => s.remove());
    };
  }, []);

  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <Standards />
      <About />
      <Stats />
      <Planner />
      <Dashboard />
      <Methodology />
      <Features />
      <Privacy />
      <Login />

      {/* Toast Notification System */}
      <div className="toast-container" id="toast-container"></div>

      {/* Modal Success Popup */}
      <div className="modal-overlay" id="modal-overlay">
        <div className="modal-card glass-card">
          <div className="modal-icon bg-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 id="modal-title">Success</h3>
          <p id="modal-message">Your operations executed correctly.</p>
          <button className="btn btn-primary" id="modal-close-btn">
            Dismiss
          </button>
        </div>
      </div>

      <Footer />
      <AuditModal />
    </div>
  );
}
