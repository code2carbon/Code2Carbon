'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import './home-ui.css';
// import './home-sections.css';


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
      Code<span>2Carbon</span>
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
        <rect x="4" y="3" width="16" height="18" rx="2.5"></rect>
        <rect x="7" y="6" width="10" height="4" rx="1"></rect>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01M16 17.5h.01"></path>
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
    text: 'research@code2carbon.org',
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
          Code2Carbon helps educational institutions measure, analyze, and report Scope 1, 2, and 3 greenhouse gas
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

/* Decorative artwork: static, hand-built SVG markup kept as strings so the output
   is identical on server and client (no hydration differences). Every id is
   prefixed "ab-" so nothing collides with the hero illustration. */
const AB_DEFS = "<svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\">\n<defs>\n<linearGradient id=\"ab-lf\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#c4f3d8\"/><stop offset=\".55\" stop-color=\"#52c27d\"/><stop offset=\"1\" stop-color=\"#16894a\"/></linearGradient>\n<linearGradient id=\"ab-lf2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e3fbee\"/><stop offset=\"1\" stop-color=\"#8ddfae\"/></linearGradient>\n<filter id=\"ab-sh\" x=\"-20%\" y=\"-20%\" width=\"150%\" height=\"150%\"><feDropShadow dx=\"0\" dy=\"6\" stdDeviation=\"6\" flood-color=\"#064e3b\" flood-opacity=\".22\"/></filter>\n<symbol id=\"ab-leaf\" viewBox=\"0 0 40 60\"><path d=\"M20 2C39 17 41 43 20 58C-1 43 1 17 20 2Z\" fill=\"url(#ab-lf)\"/><path d=\"M20 10V54M20 26L10 18M20 36L9 29M20 26L30 18M20 36L31 29\" stroke=\"#fff\" stroke-opacity=\".5\" stroke-width=\"1.2\" fill=\"none\"/></symbol>\n<symbol id=\"ab-leafl\" viewBox=\"0 0 40 60\"><path d=\"M20 2C39 17 41 43 20 58C-1 43 1 17 20 2Z\" fill=\"url(#ab-lf2)\"/><path d=\"M20 10V54\" stroke=\"#fff\" stroke-opacity=\".7\" stroke-width=\"1.2\"/></symbol>\n<symbol id=\"ab-tree\" viewBox=\"0 0 40 52\"><rect x=\"18\" y=\"30\" width=\"4\" height=\"20\" rx=\"2\" fill=\"#7a4a24\"/><circle cx=\"20\" cy=\"18\" r=\"14\" fill=\"#1c8f52\"/><circle cx=\"11\" cy=\"26\" r=\"10\" fill=\"#27a862\"/><circle cx=\"29\" cy=\"26\" r=\"10\" fill=\"#157a45\"/><circle cx=\"22\" cy=\"12\" r=\"8\" fill=\"#4cc283\" fill-opacity=\".8\"/></symbol>\n<symbol id=\"ab-pine\" viewBox=\"0 0 30 50\"><rect x=\"13\" y=\"38\" width=\"4\" height=\"12\" fill=\"#7a4a24\"/><path d=\"M15 2L27 22H3ZM15 14L29 36H1Z\" fill=\"#157a45\"/></symbol>\n<symbol id=\"ab-cloud\" viewBox=\"0 0 80 36\"><path d=\"M12 32C2 32 0 20 10 18C10 8 24 4 30 12C36 2 54 6 54 18C66 16 74 30 62 32Z\" fill=\"#fff\"/></symbol>\n<symbol id=\"ab-spark\" viewBox=\"0 0 20 20\"><path d=\"M10 0C11 6 14 9 20 10C14 11 11 14 10 20C9 14 6 11 0 10C6 9 9 6 10 0Z\" fill=\"#fff\"/></symbol>\n<symbol id=\"ab-mark\" viewBox=\"0 0 40 40\"><path d=\"M10 34C3 20 10 7 29 4C33 19 27 31 14 32\" fill=\"none\" stroke=\"#0b7a55\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M12 37C16 25 20 17 28 9\" fill=\"none\" stroke=\"#0b7a55\" stroke-width=\"3.4\" stroke-linecap=\"round\"/></symbol>\n<pattern id=\"ab-win\" width=\"9\" height=\"11\" patternUnits=\"userSpaceOnUse\"><rect x=\"2\" y=\"3\" width=\"5\" height=\"5\" rx=\"1\" fill=\"#fff\" fill-opacity=\".75\"/></pattern>\n<pattern id=\"ab-win2\" width=\"11\" height=\"11\" patternUnits=\"userSpaceOnUse\"><rect x=\"1.5\" y=\"2\" width=\"8\" height=\"7\" fill=\"#5b9ed1\" fill-opacity=\".75\"/></pattern>\n</defs>\n</svg>";
const AB_BG = "<svg viewBox=\"0 0 1600 1000\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\">\n<use href=\"#ab-leafl\" x=\"-50\" y=\"520\" width=\"150\" height=\"225\" transform=\"rotate(-40 25 630)\" opacity=\".7\"/>\n<use href=\"#ab-leafl\" x=\"40\" y=\"720\" width=\"110\" height=\"165\" transform=\"rotate(25 95 800)\" opacity=\".6\"/>\n<use href=\"#ab-leafl\" x=\"1500\" y=\"640\" width=\"130\" height=\"195\" transform=\"rotate(45 1565 737)\" opacity=\".7\"/>\n<use href=\"#ab-leafl\" x=\"1380\" y=\"860\" width=\"90\" height=\"135\" transform=\"rotate(-30 1425 927)\" opacity=\".55\"/>\n<use href=\"#ab-cloud\" x=\"640\" y=\"40\" width=\"190\" height=\"86\" opacity=\".8\"/>\n<use href=\"#ab-cloud\" x=\"1080\" y=\"150\" width=\"140\" height=\"64\" opacity=\".7\"/>\n<use href=\"#ab-cloud\" x=\"330\" y=\"190\" width=\"120\" height=\"54\" opacity=\".7\"/>\n<use href=\"#ab-spark\" x=\"470\" y=\"130\" width=\"18\" height=\"18\" opacity=\".9\"/><use href=\"#ab-spark\" x=\"1180\" y=\"90\" width=\"22\" height=\"22\"/><use href=\"#ab-spark\" x=\"900\" y=\"250\" width=\"14\" height=\"14\"/><use href=\"#ab-spark\" x=\"250\" y=\"520\" width=\"16\" height=\"16\"/><use href=\"#ab-spark\" x=\"1340\" y=\"560\" width=\"20\" height=\"20\"/>\n</svg>";
const AB_GLOBE = "<svg viewBox=\"0 0 460 480\" aria-hidden=\"true\">\n    <defs>\n      <radialGradient id=\"ab-glow\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\".6\" stop-color=\"#d6f8e6\" stop-opacity=\".9\"/><stop offset=\"1\" stop-color=\"#d6f8e6\" stop-opacity=\"0\"/></radialGradient>\n      <radialGradient id=\"ab-gg\" cx=\"32%\" cy=\"26%\" r=\"90%\"><stop offset=\"0\" stop-color=\"#8ae6ab\"/><stop offset=\".5\" stop-color=\"#2eb068\"/><stop offset=\"1\" stop-color=\"#0b6f49\"/></radialGradient>\n      <radialGradient id=\"ab-rim\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\".78\" stop-color=\"#fff\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"#e9fff3\" stop-opacity=\".85\"/></radialGradient>\n      <clipPath id=\"ab-gc\"><circle cx=\"230\" cy=\"225\" r=\"152\"/></clipPath>\n    </defs>\n    <circle cx=\"230\" cy=\"225\" r=\"225\" fill=\"url(#ab-glow)\"/>\n    <circle cx=\"230\" cy=\"225\" r=\"205\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\" opacity=\".9\"/>\n    <circle cx=\"230\" cy=\"225\" r=\"184\" fill=\"none\" stroke=\"#7fdcab\" stroke-width=\"1.5\" stroke-dasharray=\"3 8\" opacity=\".8\"/>\n    <circle cx=\"230\" cy=\"225\" r=\"152\" fill=\"url(#ab-gg)\"/>\n    <g clip-path=\"url(#ab-gc)\">\n      <path d=\"M118 150C134 116 186 108 214 132C238 152 214 176 192 188C180 212 200 240 178 266C156 286 138 256 130 230C124 208 108 178 118 150Z\" fill=\"#a8eac5\"/>\n      <path d=\"M122 156C138 124 184 118 208 138C196 134 150 134 130 170Z\" fill=\"#d4f8e4\" opacity=\".7\"/>\n      <path d=\"M252 132C290 112 332 140 326 174C320 202 290 204 280 230C270 252 246 242 248 216C250 192 236 184 242 160Z\" fill=\"#a8eac5\"/>\n      <path d=\"M262 286C292 274 322 288 314 312C306 332 278 330 266 316Z\" fill=\"#8fe0b3\"/>\n      <path d=\"M300 240C316 236 332 248 322 262C312 270 298 262 300 240Z\" fill=\"#8fe0b3\" opacity=\".8\"/>\n      <path d=\"M130 230C150 250 170 262 190 270\" stroke=\"#e9fff3\" stroke-width=\"2\" fill=\"none\" opacity=\".5\"/>\n      <ellipse cx=\"190\" cy=\"140\" rx=\"46\" ry=\"10\" fill=\"#fff\" opacity=\".28\" transform=\"rotate(-28 190 140)\"/>\n      <ellipse cx=\"300\" cy=\"300\" rx=\"50\" ry=\"9\" fill=\"#fff\" opacity=\".22\" transform=\"rotate(-18 300 300)\"/>\n    </g>\n    <circle cx=\"230\" cy=\"225\" r=\"152\" fill=\"url(#ab-rim)\"/>\n    <ellipse cx=\"170\" cy=\"150\" rx=\"40\" ry=\"62\" fill=\"#fff\" opacity=\".12\" transform=\"rotate(30 170 150)\"/>\n    <g class=\"ab-fl\"><use href=\"#ab-leaf\" x=\"34\" y=\"255\" width=\"120\" height=\"180\" transform=\"rotate(-48 94 345)\"/></g>\n    <use href=\"#ab-leaf\" x=\"78\" y=\"330\" width=\"100\" height=\"150\" transform=\"rotate(12 128 405)\"/>\n    <use href=\"#ab-leaf\" x=\"150\" y=\"382\" width=\"64\" height=\"96\" transform=\"rotate(52 182 430)\"/>\n    <use href=\"#ab-leaf\" x=\"-6\" y=\"330\" width=\"80\" height=\"120\" transform=\"rotate(-80 34 390)\"/>\n    <use href=\"#ab-leafl\" x=\"22\" y=\"388\" width=\"60\" height=\"90\" transform=\"rotate(-20 52 433)\"/>\n    <g class=\"ab-fl\"><use href=\"#ab-leaf\" x=\"352\" y=\"276\" width=\"56\" height=\"84\" transform=\"rotate(48 380 318)\"/></g>\n    <use href=\"#ab-leaf\" x=\"318\" y=\"334\" width=\"44\" height=\"66\" transform=\"rotate(-30 340 367)\"/>\n    <use href=\"#ab-leaf\" x=\"262\" y=\"14\" width=\"46\" height=\"70\" transform=\"rotate(28 285 49)\"/>\n    <use href=\"#ab-leaf\" x=\"46\" y=\"86\" width=\"38\" height=\"58\" transform=\"rotate(-24 65 115)\"/>\n    <use href=\"#ab-spark\" x=\"320\" y=\"120\" width=\"16\" height=\"16\"/><use href=\"#ab-spark\" x=\"70\" y=\"230\" width=\"12\" height=\"12\"/><use href=\"#ab-spark\" x=\"400\" y=\"210\" width=\"14\" height=\"14\"/>\n    <circle cx=\"410\" cy=\"160\" r=\"4\" fill=\"#7fdcab\"/><circle cx=\"36\" cy=\"200\" r=\"3\" fill=\"#7fdcab\"/>\n  </svg>";
const AB_CITY = "<svg viewBox=\"0 0 560 380\" aria-hidden=\"true\">\n      <defs>\n        <linearGradient id=\"ab-bd\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#d9f8f0\"/><stop offset=\"1\" stop-color=\"#4fbfa6\"/></linearGradient>\n        <linearGradient id=\"ab-bd2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e6f6fb\"/><stop offset=\"1\" stop-color=\"#6fbfd4\"/></linearGradient>\n        <linearGradient id=\"ab-h0\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#cdf6df\"/><stop offset=\"1\" stop-color=\"#9be6bd\"/></linearGradient>\n        <linearGradient id=\"ab-h1\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#8fe3b2\"/><stop offset=\"1\" stop-color=\"#3eb671\"/></linearGradient>\n        <linearGradient id=\"ab-h2\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#47bf78\"/><stop offset=\"1\" stop-color=\"#1b8d53\"/></linearGradient>\n      </defs>\n      <path d=\"M0 230C90 190 200 210 290 190C380 172 470 150 560 168V380H0Z\" fill=\"url(#ab-h0)\" opacity=\".9\"/>\n      <g>\n        <rect x=\"362\" y=\"86\" width=\"38\" height=\"128\" rx=\"3\" fill=\"url(#ab-bd2)\"/><rect x=\"362\" y=\"86\" width=\"38\" height=\"128\" fill=\"url(#ab-win)\"/>\n        <rect x=\"404\" y=\"34\" width=\"46\" height=\"180\" rx=\"3\" fill=\"url(#ab-bd)\"/><rect x=\"404\" y=\"34\" width=\"46\" height=\"180\" fill=\"url(#ab-win)\"/><rect x=\"418\" y=\"24\" width=\"18\" height=\"12\" fill=\"#7bd1be\"/><rect x=\"426\" y=\"12\" width=\"2\" height=\"14\" fill=\"#6aa\"/>\n        <rect x=\"454\" y=\"62\" width=\"40\" height=\"152\" rx=\"3\" fill=\"url(#ab-bd2)\"/><rect x=\"454\" y=\"62\" width=\"40\" height=\"152\" fill=\"url(#ab-win)\"/>\n        <rect x=\"498\" y=\"94\" width=\"40\" height=\"120\" rx=\"3\" fill=\"url(#ab-bd)\"/><rect x=\"498\" y=\"94\" width=\"40\" height=\"120\" fill=\"url(#ab-win)\"/>\n        <rect x=\"330\" y=\"124\" width=\"28\" height=\"90\" rx=\"3\" fill=\"url(#ab-bd)\"/><rect x=\"330\" y=\"124\" width=\"28\" height=\"90\" fill=\"url(#ab-win)\"/>\n      </g>\n      <g stroke=\"#cfe3e0\" stroke-width=\"1\" fill=\"#fff\">\n        <g><path d=\"M232 222L237 222L240 130L229 130Z\"/><circle cx=\"234.5\" cy=\"126\" r=\"6\" fill=\"#e8eef0\"/><g class=\"ab-bl\" style=\"transform-origin:234px 126px\"><path d=\"M234 126L229 62L239 62ZM234 126L292 156L288 165ZM234 126L178 158L182 167Z\"/></g></g>\n        <g><path d=\"M300 214L304 214L306 156L298 156Z\"/><circle cx=\"302\" cy=\"153\" r=\"5\" fill=\"#e8eef0\"/><g class=\"ab-bl s\" style=\"transform-origin:302px 153px\"><path d=\"M302 153L298 106L306 106ZM302 153L346 174L343 181ZM302 153L258 176L261 183Z\"/></g></g>\n        <g><path d=\"M170 238L173 238L175 190L168 190Z\"/><circle cx=\"171.5\" cy=\"188\" r=\"4\" fill=\"#e8eef0\"/><g class=\"ab-bl f\" style=\"transform-origin:171px 188px\"><path d=\"M171 188L168 150L174 150ZM171 188L204 204L202 210ZM171 188L138 206L140 212Z\"/></g></g>\n      </g>\n      <path d=\"M0 290C70 236 170 258 260 242C350 226 440 204 560 226V380H0Z\" fill=\"url(#ab-h1)\"/>\n      <path d=\"M96 380C170 322 232 336 320 300C384 274 460 268 560 280\" fill=\"none\" stroke=\"#fff\" stroke-width=\"26\" stroke-linecap=\"round\" opacity=\".95\"/>\n      <path d=\"M96 380C170 322 232 336 320 300C384 274 460 268 560 280\" fill=\"none\" stroke=\"#cfeadc\" stroke-width=\"2\" stroke-dasharray=\"10 12\" opacity=\".9\"/>\n      <path d=\"M0 340C100 296 190 330 290 306C380 284 470 292 560 306V380H0Z\" fill=\"url(#ab-h2)\"/>\n      <use href=\"#ab-tree\" x=\"30\" y=\"236\" width=\"44\" height=\"58\"/><use href=\"#ab-pine\" x=\"74\" y=\"254\" width=\"26\" height=\"42\"/><use href=\"#ab-tree\" x=\"108\" y=\"262\" width=\"34\" height=\"44\"/>\n      <use href=\"#ab-tree\" x=\"318\" y=\"206\" width=\"38\" height=\"50\"/><use href=\"#ab-pine\" x=\"352\" y=\"222\" width=\"22\" height=\"36\"/><use href=\"#ab-tree\" x=\"480\" y=\"190\" width=\"46\" height=\"60\"/><use href=\"#ab-pine\" x=\"524\" y=\"206\" width=\"26\" height=\"42\"/>\n      <use href=\"#ab-tree\" x=\"196\" y=\"278\" width=\"40\" height=\"52\"/><use href=\"#ab-tree\" x=\"434\" y=\"262\" width=\"34\" height=\"46\"/>\n      <use href=\"#ab-tree\" x=\"470\" y=\"300\" width=\"50\" height=\"64\"/><use href=\"#ab-pine\" x=\"20\" y=\"316\" width=\"30\" height=\"48\"/><use href=\"#ab-tree\" x=\"226\" y=\"322\" width=\"36\" height=\"46\"/>\n      <use href=\"#ab-leaf\" x=\"466\" y=\"290\" width=\"70\" height=\"105\" transform=\"rotate(64 501 342)\"/>\n      <use href=\"#ab-leaf\" x=\"510\" y=\"318\" width=\"50\" height=\"75\" transform=\"rotate(30 535 355)\"/>\n      <use href=\"#ab-leafl\" x=\"372\" y=\"20\" width=\"36\" height=\"54\" transform=\"rotate(40 390 47)\" class=\"ab-fl\"/>\n      <use href=\"#ab-cloud\" x=\"250\" y=\"30\" width=\"90\" height=\"40\" opacity=\".9\"/><use href=\"#ab-spark\" x=\"318\" y=\"96\" width=\"14\" height=\"14\"/>\n    </svg>";
const AB_BADGE = "<svg viewBox=\"0 0 48 48\"><circle cx=\"24\" cy=\"18\" r=\"13\" fill=\"#17a263\"/><circle cx=\"14\" cy=\"26\" r=\"10\" fill=\"#17a263\"/><circle cx=\"33\" cy=\"27\" r=\"10\" fill=\"#139054\"/><rect x=\"21\" y=\"30\" width=\"4\" height=\"12\" fill=\"#139054\"/><text x=\"24\" y=\"26\" font-family=\"Poppins,sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"#fff\" text-anchor=\"middle\">CO₂</text><path d=\"M24 44v-5m-3 2 3 3 3-3\" stroke=\"#fff\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>";
const AB_ART: Record<string, string> = {
  green: "<svg viewBox=\"0 0 440 200\" preserveAspectRatio=\"xMidYMax slice\" aria-hidden=\"true\">\n      <defs><linearGradient id=\"ab-a1\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#d4f6e3\"/><stop offset=\"1\" stop-color=\"#7ad6a2\"/></linearGradient><linearGradient id=\"ab-a1b\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#86dcae\"/><stop offset=\"1\" stop-color=\"#33a866\"/></linearGradient></defs>\n      <path d=\"M0 200V90C60 56 130 80 200 66C280 50 360 36 440 54V200Z\" fill=\"url(#ab-a1)\"/>\n      <use href=\"#ab-pine\" x=\"396\" y=\"40\" width=\"26\" height=\"44\"/><use href=\"#ab-pine\" x=\"418\" y=\"48\" width=\"22\" height=\"38\"/>\n      <g filter=\"url(#ab-sh)\">\n        <rect x=\"150\" y=\"96\" width=\"196\" height=\"62\" fill=\"#eef5fa\"/><rect x=\"150\" y=\"96\" width=\"196\" height=\"62\" fill=\"url(#ab-win2)\"/>\n        <rect x=\"200\" y=\"62\" width=\"86\" height=\"42\" fill=\"#e4eef6\"/><rect x=\"200\" y=\"62\" width=\"86\" height=\"42\" fill=\"url(#ab-win2)\"/>\n        <rect x=\"292\" y=\"40\" width=\"38\" height=\"66\" fill=\"#4f93c9\"/><rect x=\"292\" y=\"40\" width=\"38\" height=\"66\" fill=\"url(#ab-win2)\"/><rect x=\"288\" y=\"36\" width=\"46\" height=\"5\" fill=\"#2f6aa0\"/>\n        <rect x=\"116\" y=\"112\" width=\"40\" height=\"46\" fill=\"#e4eef6\"/><rect x=\"116\" y=\"112\" width=\"40\" height=\"46\" fill=\"url(#ab-win2)\"/>\n        <rect x=\"196\" y=\"58\" width=\"94\" height=\"6\" fill=\"#35709f\"/><rect x=\"146\" y=\"92\" width=\"204\" height=\"6\" fill=\"#35709f\"/>\n        <g fill=\"#fff\"><rect x=\"214\" y=\"124\" width=\"5\" height=\"34\"/><rect x=\"238\" y=\"124\" width=\"5\" height=\"34\"/><rect x=\"262\" y=\"124\" width=\"5\" height=\"34\"/></g>\n      </g>\n      <path d=\"M0 200C90 168 170 184 250 166C330 148 390 166 440 156V200Z\" fill=\"url(#ab-a1b)\"/>\n      <path d=\"M150 200C190 176 240 174 300 164\" stroke=\"#fff\" stroke-width=\"12\" fill=\"none\" stroke-linecap=\"round\" opacity=\".85\"/>\n      <use href=\"#ab-tree\" x=\"96\" y=\"104\" width=\"44\" height=\"58\"/><use href=\"#ab-tree\" x=\"60\" y=\"124\" width=\"36\" height=\"48\"/><use href=\"#ab-tree\" x=\"342\" y=\"100\" width=\"46\" height=\"60\"/><use href=\"#ab-tree\" x=\"376\" y=\"116\" width=\"40\" height=\"52\"/><use href=\"#ab-pine\" x=\"410\" y=\"108\" width=\"26\" height=\"44\"/><use href=\"#ab-tree\" x=\"20\" y=\"132\" width=\"34\" height=\"46\"/>\n      <ellipse cx=\"230\" cy=\"170\" rx=\"26\" ry=\"6\" fill=\"#2d9e5c\" opacity=\".5\"/>\n      <use href=\"#ab-leaf\" x=\"400\" y=\"150\" width=\"36\" height=\"54\" transform=\"rotate(50 418 177)\"/>\n    </svg>",
  blue: "<svg viewBox=\"0 0 440 200\" preserveAspectRatio=\"xMidYMax slice\" aria-hidden=\"true\">\n      <defs><linearGradient id=\"ab-a2\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#9be8bc\"/><stop offset=\"1\" stop-color=\"#1f9a5a\"/></linearGradient><linearGradient id=\"ab-a2b\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#d3f6e2\"/><stop offset=\"1\" stop-color=\"#6fd09b\"/></linearGradient></defs>\n      <path d=\"M0 200V70C80 40 150 90 220 100C300 112 360 50 440 64V200Z\" fill=\"url(#ab-a2b)\" opacity=\".8\"/>\n      <g filter=\"url(#ab-sh)\">\n        <g transform=\"rotate(-6 70 120)\"><rect x=\"40\" y=\"70\" width=\"98\" height=\"116\" rx=\"8\" fill=\"#f4f9fc\" stroke=\"#d3e5ee\"/></g>\n        <g transform=\"rotate(-11 110 130)\"><rect x=\"62\" y=\"56\" width=\"108\" height=\"126\" rx=\"8\" fill=\"#fff\" stroke=\"#d3e5ee\"/><rect x=\"74\" y=\"68\" width=\"40\" height=\"6\" rx=\"3\" fill=\"#cfe0e8\"/><text x=\"116\" y=\"136\" font-family=\"Poppins,sans-serif\" font-weight=\"800\" font-style=\"italic\" font-size=\"44\" fill=\"#16365c\" text-anchor=\"middle\">ISO</text><path d=\"M76 152h76M76 164h54\" stroke=\"#d3e5ee\" stroke-width=\"4\" stroke-linecap=\"round\"/></g>\n        <g><rect x=\"158\" y=\"46\" width=\"118\" height=\"128\" rx=\"8\" fill=\"#fff\" stroke=\"#d3e5ee\"/><circle cx=\"186\" cy=\"86\" r=\"14\" fill=\"none\" stroke=\"#0e9f8e\" stroke-width=\"8\"/><circle cx=\"186\" cy=\"86\" r=\"4\" fill=\"#16365c\"/><text x=\"208\" y=\"83\" font-family=\"Poppins,sans-serif\" font-weight=\"700\" font-size=\"16\" fill=\"#14304a\">GHG</text><text x=\"208\" y=\"99\" font-family=\"Poppins,sans-serif\" font-weight=\"600\" font-size=\"12\" fill=\"#14304a\">Protocol</text><path d=\"M174 124h86M174 138h66M174 152h76\" stroke=\"#d3e5ee\" stroke-width=\"4\" stroke-linecap=\"round\"/></g>\n        <g transform=\"rotate(12 330 130)\"><rect x=\"272\" y=\"58\" width=\"112\" height=\"126\" rx=\"8\" fill=\"#fff\" stroke=\"#d3e5ee\"/><text x=\"328\" y=\"118\" font-family=\"Poppins,sans-serif\" font-weight=\"800\" font-style=\"italic\" font-size=\"34\" fill=\"#2b72c9\" text-anchor=\"middle\">ipcc</text><circle cx=\"328\" cy=\"150\" r=\"12\" fill=\"none\" stroke=\"#9cc4ea\" stroke-width=\"3\"/><path d=\"M316 150h24M328 138v24\" stroke=\"#9cc4ea\" stroke-width=\"2\"/></g>\n      </g>\n      <path d=\"M0 200V160C70 140 120 176 200 178C280 180 330 150 440 166V200Z\" fill=\"url(#ab-a2)\"/>\n      <use href=\"#ab-leaf\" x=\"-4\" y=\"110\" width=\"58\" height=\"87\" transform=\"rotate(-50 25 153)\"/><use href=\"#ab-leaf\" x=\"380\" y=\"92\" width=\"52\" height=\"78\" transform=\"rotate(34 406 131)\"/><use href=\"#ab-leaf\" x=\"408\" y=\"146\" width=\"40\" height=\"60\" transform=\"rotate(60 428 176)\"/>\n      <use href=\"#ab-spark\" x=\"148\" y=\"30\" width=\"14\" height=\"14\"/><use href=\"#ab-spark\" x=\"300\" y=\"34\" width=\"12\" height=\"12\"/>\n    </svg>",
  emerald: "<svg viewBox=\"0 0 440 200\" preserveAspectRatio=\"xMidYMax slice\" aria-hidden=\"true\">\n      <defs><linearGradient id=\"ab-a3\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#b3efcd\"/><stop offset=\"1\" stop-color=\"#2aa866\"/></linearGradient><linearGradient id=\"ab-bar\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#34c27c\"/><stop offset=\"1\" stop-color=\"#0f9d58\"/></linearGradient></defs>\n      <path d=\"M0 200V90C80 62 150 112 230 104C310 96 370 60 440 74V200Z\" fill=\"url(#ab-a3)\" opacity=\".85\"/>\n      <g filter=\"url(#ab-sh)\">\n        <g transform=\"skewY(-5)\"><rect x=\"118\" y=\"78\" width=\"190\" height=\"112\" rx=\"9\" fill=\"#fff\" stroke=\"#d3e5ee\"/><rect x=\"118\" y=\"78\" width=\"190\" height=\"16\" rx=\"8\" fill=\"#eef5f9\"/><circle cx=\"130\" cy=\"86\" r=\"2.5\" fill=\"#f87171\"/><circle cx=\"139\" cy=\"86\" r=\"2.5\" fill=\"#fbbf24\"/><circle cx=\"148\" cy=\"86\" r=\"2.5\" fill=\"#34d399\"/>\n        <rect x=\"126\" y=\"102\" width=\"26\" height=\"80\" rx=\"4\" fill=\"#f1f7fa\"/><path d=\"M134 112h10M134 122h10M134 132h10\" stroke=\"#cfe0e8\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n        <path d=\"M168 176V150M184 176V136M200 176V154M216 176V122M232 176V138M248 176V112M264 176V128M280 176V104\" stroke=\"url(#ab-bar)\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n        <path d=\"M166 142L186 128L204 140L222 110L240 124L258 98L284 94\" stroke=\"#0e9f8e\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"258\" cy=\"98\" r=\"3.5\" fill=\"#0e9f8e\"/></g>\n        <g transform=\"skewY(-5)\"><rect x=\"296\" y=\"58\" width=\"96\" height=\"116\" rx=\"9\" fill=\"#fff\" stroke=\"#d3e5ee\"/><circle cx=\"344\" cy=\"104\" r=\"26\" fill=\"none\" stroke=\"#e4eef3\" stroke-width=\"13\"/><circle cx=\"344\" cy=\"104\" r=\"26\" fill=\"none\" stroke=\"#12a392\" stroke-width=\"13\" stroke-dasharray=\"100 80\" transform=\"rotate(-90 344 104)\"/><circle cx=\"344\" cy=\"104\" r=\"26\" fill=\"none\" stroke=\"#16a34a\" stroke-width=\"13\" stroke-dasharray=\"40 124\" stroke-dashoffset=\"-104\" transform=\"rotate(-90 344 104)\"/>\n        <circle cx=\"310\" cy=\"150\" r=\"3.5\" fill=\"#12a392\"/><path d=\"M318 150h28\" stroke=\"#cfe0e8\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"310\" cy=\"162\" r=\"3.5\" fill=\"#16a34a\"/><path d=\"M318 162h20\" stroke=\"#cfe0e8\" stroke-width=\"4\" stroke-linecap=\"round\"/></g>\n        <g transform=\"rotate(9 400 150)\"><rect x=\"380\" y=\"112\" width=\"48\" height=\"64\" rx=\"5\" fill=\"#fff\" stroke=\"#d3e5ee\"/><path d=\"M388 128h32M388 138h32M388 148h32M388 158h20\" stroke=\"#cfe0e8\" stroke-width=\"3\" stroke-linecap=\"round\"/></g>\n      </g>\n      <path d=\"M0 200V164C80 148 150 182 230 180C310 178 370 156 440 170V200Z\" fill=\"url(#ab-a2)\" opacity=\".95\"/>\n      <use href=\"#ab-leaf\" x=\"76\" y=\"100\" width=\"44\" height=\"66\" transform=\"rotate(-14 98 133)\"/><use href=\"#ab-leaf\" x=\"46\" y=\"126\" width=\"36\" height=\"54\" transform=\"rotate(-48 64 153)\"/><use href=\"#ab-leaf\" x=\"404\" y=\"66\" width=\"32\" height=\"48\" transform=\"rotate(42 420 90)\"/>\n      <use href=\"#ab-spark\" x=\"330\" y=\"30\" width=\"13\" height=\"13\"/>\n    </svg>",
};

const AboutArt = ({ html, className, as: Tag = 'div' }: { html: string; className: string; as?: 'div' | 'i' }) => (
  <Tag className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
);

const AB_CHIPS: Record<string, ReactNode> = {
  green: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path>
    </>
  ),
  emerald: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </>
  ),
};

const About = () => (
  <section className="about-section" id="about">
    <AboutArt html={AB_DEFS} className="ab-defs" />
    <AboutArt html={AB_BG} className="ab-bgdeco" />

    <div className="ab-hero">
      <AboutArt html={AB_GLOBE} className="ab-hl" />

      <div className="section-header text-center ab-hc">
        <span className="section-label">Understanding Emissions</span>
        <h2 className="section-title">
          Why <span className="ab-accent">Code2Carbon?</span>
        </h2>
        <div className="title-bar"></div>
        <p className="section-desc">
          Code2Carbon enables educational institutions to measure, analyze, and report greenhouse gas emissions in
          accordance with internationally recognized standards. By converting activity data into CO₂e emissions and
          categorizing them into Scope 1, Scope 2, and Scope 3, the platform helps organizations understand their
          environmental impact and identify opportunities for emission reduction.
        </p>
      </div>

      <div className="ab-hr" aria-hidden="true">
        <div className="ab-badge">
          <AboutArt html={AB_BADGE} className="ab-badge-ico" as="i" />
          <div>
            <em>Lower</em>
            <em>Emissions</em>
            <small>Bigger Impact</small>
          </div>
        </div>
        <AboutArt html={AB_CITY} className="ab-city" />
      </div>
    </div>

    <div className="container">
      <div className="grid grid-3 ab-cards">
        {ABOUT_CARDS.map((card) => (
          <div className={`card about-card ab-card ab-card-${card.tone} scroll-reveal`} key={card.title}>
            <div className="card-icon-container">
              <Icon className={`card-icon ${card.tone}`}>{card.icon}</Icon>
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <AboutArt html={AB_ART[card.tone]} className="ab-art" />
            {AB_CHIPS[card.tone] && (
              <span className="ab-chip" aria-hidden="true">
                <Icon>{AB_CHIPS[card.tone]}</Icon>
              </span>
            )}
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
      <div className="section-header text-center">
        <span className="section-label">Decarbonization Pathway</span>
        <h2 className="section-title">
          Net-Zero <span className="pl-accent">Transition Hub</span>
        </h2>
        <div className="title-bar"></div>
        <p className="section-desc">
          Simulate your path to sustainability. Toggle specific green initiatives to see their direct CapEx cost,
          payback time, and aggregate impact on your 10-year carbon emissions forecast.
        </p>
      </div>

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
      <div className="section-header text-center">
        <span className="section-label">Live Dashboard</span>
        <h2 className="section-title">
          See your entire <span className="sec-accent">carbon inventory</span> at a glance
        </h2>
        <div className="title-bar"></div>
        <p className="section-desc">
        A preview of the Code2Carbon analytics dashboard — real-time KPIs, scope-wise breakdowns, and monthly
        emissions trends.
      </p>
      </div>

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

/* Decorative artwork for the Methodology section: static SVG markup kept as strings so the
   output is identical on server and client. Every id is prefixed "mt-" to avoid collisions. */
const MT_DEFS = "<svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\">\n<defs>\n<linearGradient id=\"mt-lf\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#c4f3d8\"/><stop offset=\".55\" stop-color=\"#52c27d\"/><stop offset=\"1\" stop-color=\"#16894a\"/></linearGradient>\n<linearGradient id=\"mt-gd\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#34c98a\"/><stop offset=\"1\" stop-color=\"#0a7d63\"/></linearGradient>\n<linearGradient id=\"mt-gb\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#3ed08a\"/><stop offset=\"1\" stop-color=\"#0f9d58\"/></linearGradient>\n<radialGradient id=\"mt-bl\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#d9f6e8\"/><stop offset=\"1\" stop-color=\"#d9f6e8\" stop-opacity=\"0\"/></radialGradient>\n<filter id=\"mt-sh\" x=\"-20%\" y=\"-20%\" width=\"150%\" height=\"150%\"><feDropShadow dx=\"0\" dy=\"7\" stdDeviation=\"6\" flood-color=\"#064e3b\" flood-opacity=\".22\"/></filter>\n<symbol id=\"mt-leaf\" viewBox=\"0 0 40 60\"><path d=\"M20 2C39 17 41 43 20 58C-1 43 1 17 20 2Z\" fill=\"url(#mt-lf)\"/><path d=\"M20 10V54M20 26L10 18M20 36L9 29M20 26L30 18M20 36L31 29\" stroke=\"#fff\" stroke-opacity=\".5\" stroke-width=\"1.2\" fill=\"none\"/></symbol>\n<symbol id=\"mt-cloud\" viewBox=\"0 0 80 36\"><path d=\"M12 32C2 32 0 20 10 18C10 8 24 4 30 12C36 2 54 6 54 18C66 16 74 30 62 32Z\" fill=\"#fff\"/></symbol>\n<symbol id=\"mt-spark\" viewBox=\"0 0 20 20\"><path d=\"M10 0C11 6 14 9 20 10C14 11 11 14 10 20C9 14 6 11 0 10C6 9 9 6 10 0Z\" fill=\"#fff\"/></symbol>\n</defs>\n</svg>";
const MT_BG = "<svg viewBox=\"0 0 1600 1100\" preserveAspectRatio=\"xMidYMin slice\" aria-hidden=\"true\">\n<g fill=\"none\" stroke=\"#7fdcab\" stroke-opacity=\".55\" stroke-width=\"2\"><circle cx=\"40\" cy=\"220\" r=\"150\"/><circle cx=\"40\" cy=\"220\" r=\"110\" stroke-dasharray=\"4 8\"/><circle cx=\"40\" cy=\"220\" r=\"70\"/></g>\n<use href=\"#mt-leaf\" x=\"60\" y=\"260\" width=\"64\" height=\"96\" transform=\"rotate(36 92 308)\" opacity=\".9\"/>\n<use href=\"#mt-leaf\" x=\"1340\" y=\"70\" width=\"60\" height=\"90\" transform=\"rotate(58 1370 115)\"/>\n<use href=\"#mt-leaf\" x=\"1500\" y=\"250\" width=\"40\" height=\"60\" transform=\"rotate(-30 1520 280)\" opacity=\".7\"/>\n<use href=\"#mt-cloud\" x=\"40\" y=\"100\" width=\"150\" height=\"68\" opacity=\".9\"/><use href=\"#mt-cloud\" x=\"1180\" y=\"180\" width=\"110\" height=\"50\" opacity=\".7\"/><use href=\"#mt-cloud\" x=\"1420\" y=\"40\" width=\"130\" height=\"58\" opacity=\".8\"/>\n<use href=\"#mt-spark\" x=\"300\" y=\"150\" width=\"18\" height=\"18\"/><use href=\"#mt-spark\" x=\"1230\" y=\"300\" width=\"14\" height=\"14\"/><use href=\"#mt-spark\" x=\"180\" y=\"470\" width=\"14\" height=\"14\"/><use href=\"#mt-spark\" x=\"1440\" y=\"560\" width=\"18\" height=\"18\"/>\n<g opacity=\".5\"><path d=\"M1380 380v130M1360 440h40\" stroke=\"#bfe9d6\" stroke-width=\"3\"/><rect x=\"1330\" y=\"330\" width=\"26\" height=\"90\" fill=\"#cbeedd\"/><rect x=\"1360\" y=\"300\" width=\"30\" height=\"120\" fill=\"#bfe9d6\"/><rect x=\"1394\" y=\"350\" width=\"24\" height=\"70\" fill=\"#cbeedd\"/></g>\n<path d=\"M0 1010C200 940 380 980 560 1000C760 1022 940 940 1140 970C1320 996 1460 960 1600 930V1100H0Z\" fill=\"#c9eddc\" opacity=\".8\"/>\n<path d=\"M0 1060C220 1000 420 1040 640 1040C860 1040 1040 990 1260 1020C1420 1040 1520 1010 1600 990V1100H0Z\" fill=\"#b5e6cf\" opacity=\".85\"/>\n<use href=\"#mt-leaf\" x=\"1200\" y=\"920\" width=\"70\" height=\"105\" transform=\"rotate(30 1235 972)\" opacity=\".7\"/><use href=\"#mt-leaf\" x=\"80\" y=\"940\" width=\"60\" height=\"90\" transform=\"rotate(-20 110 985)\" opacity=\".7\"/>\n</svg>";
const MT_ART: string[] = [
  "<svg viewBox=\"0 0 260 170\" aria-hidden=\"true\">\n          <ellipse cx=\"150\" cy=\"92\" rx=\"104\" ry=\"70\" fill=\"url(#mt-bl)\"/>\n          <g filter=\"url(#mt-sh)\"><rect x=\"96\" y=\"22\" width=\"112\" height=\"104\" rx=\"10\" fill=\"#e9f7f1\" transform=\"rotate(6 152 74)\"/><rect x=\"78\" y=\"16\" width=\"116\" height=\"112\" rx=\"10\" fill=\"#fff\" stroke=\"#d6ebe3\"/></g>\n          <rect x=\"78\" y=\"16\" width=\"116\" height=\"16\" rx=\"8\" fill=\"url(#mt-gd)\"/>\n          <path d=\"M94 112V92M112 112V78M130 112V86M148 112V62M166 112V72\" stroke=\"url(#mt-gb)\" stroke-width=\"11\" stroke-linecap=\"round\"/>\n          <path d=\"M96 78L114 66L132 74L150 50L170 58\" stroke=\"#0e9f8e\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n          <path d=\"M92 40h50M92 50h34\" stroke=\"#d6ebe3\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n          <use href=\"#mt-leaf\" x=\"30\" y=\"86\" width=\"40\" height=\"60\" transform=\"rotate(-26 50 116)\"/><use href=\"#mt-leaf\" x=\"56\" y=\"104\" width=\"34\" height=\"52\" transform=\"rotate(18 73 130)\"/>\n          <g filter=\"url(#mt-sh)\"><path d=\"M172 150C158 150 156 132 170 129C170 114 192 112 198 124C206 114 228 120 226 136C240 136 242 152 228 152Z\" fill=\"url(#mt-gd)\"/></g>\n          <path d=\"M198 144V128M190 135l8-9 8 9\" stroke=\"#fff\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n          <use href=\"#mt-spark\" x=\"212\" y=\"30\" width=\"12\" height=\"12\"/><use href=\"#mt-leaf\" x=\"222\" y=\"62\" width=\"26\" height=\"39\" transform=\"rotate(40 235 82)\"/>\n        </svg>",
  "<svg viewBox=\"0 0 260 170\" aria-hidden=\"true\">\n          <ellipse cx=\"140\" cy=\"92\" rx=\"110\" ry=\"70\" fill=\"url(#mt-bl)\"/>\n          <use href=\"#mt-cloud\" x=\"30\" y=\"20\" width=\"62\" height=\"28\" opacity=\".9\"/>\n          <g filter=\"url(#mt-sh)\"><path d=\"M70 138C44 138 40 100 68 94C66 62 110 50 128 76C146 46 196 62 190 100C216 100 220 138 194 138Z\" fill=\"url(#mt-gd)\"/></g>\n          <path d=\"M78 70C96 52 120 54 132 66\" stroke=\"#fff\" stroke-opacity=\".5\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/>\n          <text x=\"128\" y=\"112\" font-family=\"Poppins,sans-serif\" font-weight=\"800\" font-size=\"40\" fill=\"#fff\" text-anchor=\"middle\">CO</text><text x=\"166\" y=\"120\" font-family=\"Poppins,sans-serif\" font-weight=\"700\" font-size=\"22\" fill=\"#fff\">2</text>\n          <path d=\"M206 134V108M224 134V92M242 134V70\" stroke=\"url(#mt-gb)\" stroke-width=\"11\" stroke-linecap=\"round\"/><path d=\"M204 96L224 76L244 52M236 52h10v10\" stroke=\"#0e9f8e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n          <use href=\"#mt-leaf\" x=\"14\" y=\"104\" width=\"30\" height=\"45\" transform=\"rotate(-40 29 126)\"/><use href=\"#mt-leaf\" x=\"224\" y=\"140\" width=\"24\" height=\"36\" transform=\"rotate(50 236 158)\"/><use href=\"#mt-spark\" x=\"40\" y=\"60\" width=\"12\" height=\"12\"/>\n        </svg>",
  "<svg viewBox=\"0 0 260 170\" aria-hidden=\"true\">\n          <ellipse cx=\"140\" cy=\"92\" rx=\"108\" ry=\"70\" fill=\"url(#mt-bl)\"/>\n          <g filter=\"url(#mt-sh)\"><rect x=\"52\" y=\"24\" width=\"168\" height=\"112\" rx=\"12\" fill=\"#fff\" stroke=\"#d6ebe3\"/></g>\n          <rect x=\"52\" y=\"24\" width=\"168\" height=\"16\" rx=\"8\" fill=\"url(#mt-gd)\"/>\n          <circle cx=\"112\" cy=\"92\" r=\"26\" fill=\"none\" stroke=\"#e4eef3\" stroke-width=\"14\"/><circle cx=\"112\" cy=\"92\" r=\"26\" fill=\"none\" stroke=\"#12a392\" stroke-width=\"14\" stroke-dasharray=\"78 90\" transform=\"rotate(-90 112 92)\"/><circle cx=\"112\" cy=\"92\" r=\"26\" fill=\"none\" stroke=\"#16a34a\" stroke-width=\"14\" stroke-dasharray=\"46 122\" stroke-dashoffset=\"-80\" transform=\"rotate(-90 112 92)\"/>\n          <path d=\"M160 118V96M176 118V82M192 118V70M208 118V88\" stroke=\"url(#mt-gb)\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n          <path d=\"M150 124h62M70 52h40\" stroke=\"#d6ebe3\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n          <g filter=\"url(#mt-sh)\"><circle cx=\"214\" cy=\"132\" r=\"24\" fill=\"url(#mt-gd)\"/></g>\n          <path d=\"M214 132V112A20 20 0 0 1 233 138Z\" fill=\"#fff\"/><circle cx=\"214\" cy=\"132\" r=\"7\" fill=\"#12a392\"/>\n          <use href=\"#mt-leaf\" x=\"22\" y=\"92\" width=\"36\" height=\"54\" transform=\"rotate(-30 40 119)\"/><use href=\"#mt-leaf\" x=\"44\" y=\"116\" width=\"30\" height=\"45\" transform=\"rotate(14 59 138)\"/><use href=\"#mt-spark\" x=\"228\" y=\"28\" width=\"12\" height=\"12\"/>\n        </svg>",
  "<svg viewBox=\"0 0 260 170\" aria-hidden=\"true\">\n          <ellipse cx=\"140\" cy=\"92\" rx=\"108\" ry=\"70\" fill=\"url(#mt-bl)\"/>\n          <g filter=\"url(#mt-sh)\"><rect x=\"118\" y=\"38\" width=\"112\" height=\"100\" rx=\"12\" fill=\"#fff\" stroke=\"#d6ebe3\"/></g>\n          <g fill=\"none\" stroke=\"#12a392\" stroke-width=\"3.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M134 62l6 6 11-12\"/><path d=\"M134 90l6 6 11-12\"/><path d=\"M134 118l6 6 11-12\"/></g>\n          <path d=\"M164 60h50M164 72h34M164 88h50M164 100h34M164 116h50M164 128h30\" stroke=\"#d6ebe3\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n          <g filter=\"url(#mt-sh)\"><circle cx=\"80\" cy=\"76\" r=\"44\" fill=\"#f4fff9\" stroke=\"#bdecd6\" stroke-width=\"2\"/></g>\n          <circle cx=\"80\" cy=\"76\" r=\"44\" fill=\"url(#mt-bl)\"/>\n          <path d=\"M80 44C64 44 54 56 54 70c0 10 6 17 12 23v10h28V93c6-6 12-13 12-23 0-14-10-26-26-26Z\" fill=\"#fff\" stroke=\"#34c98a\" stroke-width=\"3\"/>\n          <path d=\"M70 112h20M72 120h16\" stroke=\"#34c98a\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n          <use href=\"#mt-leaf\" x=\"68\" y=\"54\" width=\"24\" height=\"36\" transform=\"rotate(12 80 72)\"/>\n          <path d=\"M80 94V78\" stroke=\"#16894a\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n          <g stroke=\"#34c98a\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M80 24v8M40 40l6 6M120 40l-6 6M26 76h8M126 76h8\"/></g>\n          <use href=\"#mt-leaf\" x=\"14\" y=\"116\" width=\"30\" height=\"45\" transform=\"rotate(-40 29 138)\"/><use href=\"#mt-spark\" x=\"200\" y=\"14\" width=\"12\" height=\"12\"/>\n        </svg>",
];

const Methodology = () => (
  <section className="methodology-section" id="methodology">
    <AboutArt html={MT_DEFS} className="mt-defs" />
    <AboutArt html={MT_BG} className="mt-bgdeco" />

    <div className="container">
      <div className="section-header text-center">
        <span className="section-label">Our Process</span>
        <h2 className="section-title">
          Assessment <span className="mt-accent">Methodology</span>
        </h2>
        <div className="title-bar"></div>
        <p className="section-desc">
          Code2Carbon leverages environmental frameworks established by the Intergovernmental Panel on Climate Change
          (IPCC) and the EPA to guarantee analytical accuracy.
        </p>
      </div>

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
              <div className="mt-txt">
                <span className="step-badge">Step 0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              <AboutArt html={MT_ART[index]} className="mt-art" />
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
      <div className="section-header text-center">
        <span className="section-label">Platform Capabilities</span>
        <h2 className="section-title">
          Everything you need for institutional <span className="sec-accent">carbon accounting</span>
        </h2>
        <div className="title-bar"></div>
        <p className="section-desc">
        Six purpose-built modules that cover the full lifecycle — from data ingestion to standards-aligned reporting.
      </p>
      </div>

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
      <div className="section-header text-center">
        <span className="section-label">Trust &amp; Security</span>
        <h2 className="section-title">
          Institution-grade <span className="sec-accent">data governance</span>
        </h2>
        <div className="title-bar"></div>
        <p className="section-desc">
        Purpose-built controls that keep sensitive institutional data secure, auditable, and compliant.
      </p>
      </div>

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
          &copy; 2026 Code2Carbon Platform. Developed for the Environmental Sciences Research Project. All rights
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