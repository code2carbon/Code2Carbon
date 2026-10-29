'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import './calculator-ui.css';

export default function CalculatorPage() {
  useEffect(() => {
    let cancelled = false;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const existing = document.querySelector(`script[data-ct-src="${src}"]`) as HTMLScriptElement | null;
        if (existing) {
          if (existing.getAttribute('data-ct-loaded') === '1') {
            resolve();
            return;
          }
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener('error', () => resolve(), { once: true });
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.setAttribute('data-ct-src', src);
        script.onload = () => {
          script.setAttribute('data-ct-loaded', '1');
          resolve();
        };
        script.onerror = () => resolve();
        document.body.appendChild(script);
      });
    };

    (window as any).CARBONTRACK_CONFIG = {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    };

    const loadAll = async () => {
      await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      await loadScript('/js/script.js');
      await loadScript('/js/calculator.js');
      await loadScript('/js/report-generator.js');
      await loadScript('/js/chatbot.js');
      if (cancelled) return;
      // Single DOMContentLoaded for scripts that only listen for it (e.g. script.js).
      // calculator.js / report-generator.js / chatbot.js self-init when the document is already ready.
      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
    };

    loadAll();

    return () => {
      cancelled = true;
      const energyRoot = document.getElementById('energy-rows-container');
      energyRoot?.removeAttribute('data-ct-calc-init');
    };
  }, []);

  return (
    <>
      {/* Header / Navigation Bar */}
      <header className="navbar" id="navbar">
        <div className="nav-container">
          <Link href="/#home" className="logo" id="nav-logo">
            <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8.5C18.4 18 14.5 20 11 20z"></path>
              <path d="M19 2c-2.26 4.33-5.27 7.14-8 10"></path>
            </svg>
            <span>Carbon<span>Track</span></span>
          </Link>

          <nav className="nav-menu" id="nav-menu">
            <Link href="/#home" className="nav-link">Home</Link>
            <Link href="/#about" className="nav-link">About</Link>
            <Link href="/#methodology" className="nav-link">Methodology</Link>
            <Link href="/#features" className="nav-link">Features</Link>
            <Link href="/calculator" className="nav-link active">Calculator</Link>
            <Link href="/#planner" className="nav-link">Planner</Link>
            <Link href="/#privacy" className="nav-link">Privacy</Link>
            <Link href="/#login" className="nav-btn-login-mobile">Login</Link>
          </nav>

          <div className="nav-actions">
            <Link href="/#login" className="btn-login-nav" id="login-nav-trigger">Login</Link>
            <button className="hamburger-toggle" id="hamburger-toggle" aria-label="Toggle Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Scoped wrapper for all calculator page UI styles (see calculator-ui.css) */}
      <div className="calc-page">

        {/* Page Title / Hero Area */}
        <section className="calculator-hero-section">
          <div className="container text-center">
            <span className="section-label">Assessment Suite</span>
            <h1 className="section-title">Institutional Carbon Emission Calculator</h1>
            <div className="title-bar"></div>
            <p className="section-desc">Estimate emissions and offsets across organizational operations, transport, energy, paper, and carbon absorption assets.</p>
          </div>
        </section>

        {/* Main Calculator Content */}
        <section className="calculator-page-content">
          <div className="container">
            <div className="calculator-layout-wrapper">

              {/* 1. Institution Details Card */}
              <div className="calc-card org-details-card scroll-reveal">
                <div className="org-details-header">
                  <div className="org-details-title-row">
                    <span className="org-details-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                        <line x1="9" y1="22" x2="9" y2="16"></line>
                        <line x1="15" y1="22" x2="15" y2="16"></line>
                        <line x1="12" y1="16" x2="12" y2="22"></line>
                        <path d="M12 8h.01"></path>
                        <path d="M9 12h.01"></path>
                        <path d="M15 12h.01"></path>
                      </svg>
                    </span>
                    <h3>Institution Details</h3>
                  </div>
                  <p className="org-details-subtitle">Enter your institution information for comprehensive reporting</p>
                </div>
                <div className="calc-card-body">
                  <div className="calculator-form-grid">
                    <div className="form-control">
                      <label htmlFor="org-name">Institution Name</label>
                      <input type="text" id="org-name" placeholder="Enter institution name" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-address">Address</label>
                      <input type="text" id="org-address" placeholder="Enter address" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-contact">Contact Number</label>
                      <input type="text" id="org-contact" placeholder="+91 Enter 10-digit number" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-email">Email</label>
                      <input type="email" id="org-email" placeholder="Enter valid email address (e.g., info@college.edu)" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-total-area">Campus Area (acres)</label>
                      <input type="number" id="org-total-area" placeholder="Enter campus area in acres" min="0" step="any" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-builtup-area">Built-up Area (m²)</label>
                      <input type="number" id="org-builtup-area" placeholder="Enter built-up area in m²" min="0" step="any" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-population">Total Population</label>
                      <input type="number" id="org-population" placeholder="Enter total population" min="0" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="inst-num-students">Number of Students</label>
                      <input type="number" id="inst-num-students" placeholder="Enter total students" min="0" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="inst-num-faculty-staff">Number of Faculty &amp; Staff</label>
                      <input type="number" id="inst-num-faculty-staff" placeholder="Enter faculty and staff count" min="0" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-lat">Latitude</label>
                      <input type="number" id="org-lat" placeholder="Enter latitude" step="any" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-lng">Longitude</label>
                      <input type="number" id="org-lng" placeholder="Enter longitude" step="any" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-elevation">Elevation (m)</label>
                      <input type="number" id="org-elevation" placeholder="Enter elevation" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-website">Website Details</label>
                      <input type="url" id="org-website" placeholder="Enter website URL (e.g., https://college.edu)" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="org-google-maps">Google Location Link</label>
                      <input type="url" id="org-google-maps" placeholder="Enter Google Maps location link" />
                    </div>

                    {/* File uploads */}
                    <div style={{gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '15px'}}>
                      <div className="form-control file-upload-control" style={{margin: 0}}>
                        <label>Logo Upload</label>
                        <div className="custom-file-upload">
                          <input type="file" id="org-logo-file" accept="image/*" />
                          <div className="upload-placeholder" id="logo-placeholder">
                            <span className="upload-icon">📁</span>
                            <span className="upload-text">Choose Logo</span>
                          </div>
                          <div className="logo-preview-container" id="logo-preview-box" style={{display: 'none'}}>
                            <img id="logo-preview-img" alt="Logo Preview" />
                            <button className="remove-preview-btn" id="btn-remove-logo" type="button">&times;</button>
                          </div>
                        </div>
                      </div>
                      <div className="form-control file-upload-control" style={{margin: 0}}>
                        <label>College Photo</label>
                        <div className="custom-file-upload">
                          <input type="file" id="org-photo-file" accept="image/*" />
                          <div className="upload-placeholder" id="photo-placeholder">
                            <span className="upload-icon">📷</span>
                            <span className="upload-text">Choose Photo</span>
                          </div>
                          <div className="photo-preview-container" id="photo-preview-box" style={{display: 'none'}}>
                            <img id="photo-preview-img" alt="College Photo Preview" />
                            <button className="remove-preview-btn" id="btn-remove-photo" type="button">&times;</button>
                          </div>
                        </div>
                      </div>
                      <div className="form-control file-upload-control" style={{margin: 0}}>
                        <label>Campus Layout Plan</label>
                        <div className="custom-file-upload">
                          <input type="file" id="org-layout-file" accept="image/*,application/pdf" />
                          <div className="upload-placeholder" id="layout-placeholder">
                            <span className="upload-icon">🗺️</span>
                            <span className="upload-text">Choose Layout</span>
                          </div>
                          <div className="layout-preview-container" id="layout-preview-box" style={{display: 'none'}}>
                            <span className="file-icon">📄</span>
                            <span id="layout-file-name" className="file-name-label">Layout File</span>
                            <button className="remove-preview-btn" id="btn-remove-layout" type="button">&times;</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculator Category Sub-Navigation Bar */}
              <div className="calculator-subnav-wrapper" id="calc-subnav-wrapper" style={{marginTop: '15px'}}>
                <nav className="calculator-subnav" id="calc-subnav">
                  <a href="#sec-vehicle" className="subnav-link active" data-sec="sec-vehicle">Vehicle</a>
                  <a href="#sec-energy" className="subnav-link" data-sec="sec-energy">Energy</a>
                  <a href="#sec-generator" className="subnav-link" data-sec="sec-generator">Generator</a>
                  <a href="#sec-lpg" className="subnav-link" data-sec="sec-lpg">LPG</a>
                  <a href="#sec-paper" className="subnav-link" data-sec="sec-paper">Paper</a>
                  <a href="#sec-solar" className="subnav-link" data-sec="sec-solar">Solar</a>
                  <a href="#sec-trees" className="subnav-link" data-sec="sec-trees">Trees</a>
                  <a href="#sec-waste" className="subnav-link" data-sec="sec-waste">Waste</a>
                  <a href="#sec-final" className="subnav-link" data-sec="sec-final">Final Tab</a>
                </nav>
              </div>

              {/* 2. Vehicle Emissions Data Card */}
              <div className="calc-card glass-card scroll-reveal" id="sec-vehicle">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                      <circle cx="7" cy="17" r="2"></circle>
                      <path d="M9 17h6"></path>
                      <circle cx="17" cy="17" r="2"></circle>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3 style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                      Vehicle Emissions Data
                      <span className="init-scope-badge scope1">Scope 1</span>
                      <span className="init-scope-badge scope3">Scope 3</span>
                    </h3>
                    <p>Enter your vehicle details to calculate carbon emissions. Emission factors are automatically set based on fuel type.</p>
                  </div>
                  <div className="header-actions">
                    <button className="btn btn-export" id="btn-export-vehicle-csv">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      CSV
                    </button>
                    <button className="btn btn-export" id="btn-export-vehicle-excel">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      Excel
                    </button>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="table-container">
                    <table className="calc-table" id="vehicle-table">
                      <thead>
                        <tr>
                          <th>Vehicle Type</th>
                          <th>Fuel Type</th>
                          <th>Ownership</th>
                          <th>Scope</th>
                          <th>Number of Vehicles</th>
                          <th>Avg Distance (km)</th>
                          <th>Emission Factor</th>
                          <th>Emission/Day (kgCO₂)</th>
                          <th>Emission/Month (kgCO₂)</th>
                          <th>Emission/Year (kgCO₂)</th>
                          <th>Emission/Year (tons CO₂)</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody id="vehicle-rows-container">
                        {/* Dynamic rows inserted by calculator.js */}
                      </tbody>
                    </table>
                  </div>
                  <div className="form-actions-row" style={{marginTop:'16px',display:'flex',gap:'12px',flexWrap:'wrap'}}>
                    <button className="btn btn-add" id="btn-add-vehicle"><span>+ Add Vehicle</span></button>
                    <button className="btn btn-primary" id="btn-calculate-vehicles">Display Result</button>
                  </div>
                  <div className="vehicle-results-summary" id="vehicle-results-summary" style={{display:'none',marginTop:'24px',background:'rgba(46, 204, 113, 0.08)',padding:'18px 24px',borderRadius:'16px',border:'1px solid rgba(46, 204, 113, 0.15)'}}>
                    <h4 style={{fontSize:'1.1rem',fontWeight:700,color:'var(--primary)',marginBottom:'12px',fontFamily:'var(--font-display)'}}>Vehicle Emissions Summary</h4>
                    <div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
                      <div style={{flex:1,minWidth:'150px'}}>
                        <span style={{fontSize:'0.85rem',color:'var(--text-secondary)',display:'block',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Total Daily Emission</span>
                        <span id="vehicle-sum-day" style={{fontSize:'1.6rem',fontWeight:700,color:'var(--dark)',fontFamily:'var(--font-display)'}}>0.00 <span style={{fontSize:'0.9rem',fontWeight:500,color:'var(--text-secondary)'}}>kgCO₂/day</span></span>
                      </div>
                      <div style={{flex:1.5,minWidth:'180px'}}>
                        <span style={{fontSize:'0.85rem',color:'var(--text-secondary)',display:'block',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Total Monthly Emission</span>
                        <span id="vehicle-sum-month" style={{fontSize:'1.6rem',fontWeight:700,color:'var(--dark)',fontFamily:'var(--font-display)'}}>0.00 <span style={{fontSize:'0.9rem',fontWeight:500,color:'var(--text-secondary)'}}>kgCO₂/month</span></span>
                      </div>
                      <div style={{flex:1.5,minWidth:'180px'}}>
                        <span style={{fontSize:'0.85rem',color:'var(--text-secondary)',display:'block',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Total Annual Emission</span>
                        <span id="vehicle-sum-year" style={{fontSize:'1.6rem',fontWeight:700,color:'var(--primary)',fontFamily:'var(--font-display)'}}>0.00 <span style={{fontSize:'0.9rem',fontWeight:500,color:'var(--text-secondary)'}}>kgCO₂/yr</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Electricity & Energy Consumption Card */}
              <div className="calc-card glass-card scroll-reveal" id="sec-energy">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-yellow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3 style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                      Electricity &amp; Energy Consumption
                      <span className="init-scope-badge scope2">Scope 2</span>
                    </h3>
                    <p>Enter electricity details to calculate emissions - Consumption &times; Emission Factor</p>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="nested-form-section">
                    <h4 className="nested-title">Electricity &amp; Energy - Interactive Form</h4>
                    <p className="nested-subtitle">Enter energy details to calculate emissions - Activity Data &times; Emission Factor</p>
                    <div className="table-container" style={{marginTop:'16px'}}>
                      <table className="calc-table" id="energy-table">
                        <thead>
                          <tr>
                            <th>Energy Type</th>
                            <th>Energy Source</th>
                            <th>Scope</th>
                            <th>Consumption (kWh/month)</th>
                            <th>Unit</th>
                            <th>Emission Factor</th>
                            <th>Monthly Emission (kgCO₂)</th>
                            <th>Annual Emission (kgCO₂)</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="energy-rows-container"></tbody>
                      </table>
                    </div>
                    <div className="form-actions-row" style={{marginTop:'16px',display:'flex',gap:'12px',flexWrap:'wrap'}}>
                      <button className="btn btn-add" id="btn-add-energy"><span>+ Add Another Energy Source</span></button>
                      <button className="btn btn-primary" id="btn-calculate-energy">Calculate Energy Emissions</button>
                      <button className="btn btn-secondary" id="btn-reset-energy">Reset</button>
                    </div>
                    <div className="form-control file-upload-control" style={{marginTop:'24px',maxWidth:'400px'}}>
                      <label style={{fontWeight:600,color:'var(--dark)'}}>Upload Electricity Bill Photo / PDF</label>
                      <div className="custom-file-upload" style={{marginTop:'8px'}}>
                        <input type="file" id="electricity-bill-file" accept="image/*,application/pdf" />
                        <div className="upload-placeholder" id="electricity-placeholder">
                          <span className="upload-icon">🧾</span>
                          <span className="upload-text">Choose Electricity Bill File</span>
                        </div>
                        <div className="logo-preview-container" id="electricity-preview-box" style={{display:'none',alignItems:'center',gap:'12px',padding:'10px',background:'rgba(0,0,0,0.02)',borderRadius:'8px',border:'1px dashed rgba(0,0,0,0.15)'}}>
                          <span className="file-icon" style={{fontSize:'1.5rem'}}>📄</span>
                          <span id="electricity-file-name" className="file-name-label" style={{fontSize:'0.9rem',fontWeight:500,color:'var(--dark)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'200px'}}>electricity_bill.pdf</span>
                          <button className="remove-preview-btn" id="btn-remove-electricity" type="button" style={{marginLeft:'auto',background:'none',border:'none',fontSize:'1.2rem',cursor:'pointer',color:'#ef4444',fontWeight:'bold',padding:'0 5px'}}>&times;</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Diesel Generator Card */}
              <div className="calc-card glass-card scroll-reveal" id="sec-generator">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3 style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                      Diesel Generator
                      <span className="init-scope-badge scope1">Scope 1</span>
                    </h3>
                    <p>Enter diesel generator details - Diesel Consumed &times; Emission Factor</p>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="nested-form-section">
                    <h4 className="nested-title">Diesel Generator - Interactive Form</h4>
                    <p className="nested-subtitle">Enter generator locations and diesel consumption details</p>
                    <div className="table-container" style={{marginTop:'16px'}}>
                      <table className="calc-table" id="generator-table">
                        <thead>
                          <tr>
                            <th>Generator Type</th>
                            <th>Location</th>
                            <th>Consumption</th>
                            <th>Unit</th>
                            <th>Emission Factor</th>
                            <th>Monthly Activity (kgCO₂)</th>
                            <th>Annual Emission (kgCO₂)</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="generator-rows-container"></tbody>
                      </table>
                    </div>
                    <div className="form-actions-row" style={{marginTop:'16px',display:'flex',gap:'12px',flexWrap:'wrap'}}>
                      <button className="btn btn-add" id="btn-add-generator"><span>+ Add Generator Entry</span></button>
                      <button className="btn btn-primary" id="btn-calculate-generator">Calculate Generator Emissions</button>
                    </div>
                    <div className="form-control file-upload-control" style={{marginTop:'24px',maxWidth:'400px'}}>
                      <label style={{fontWeight:600,color:'var(--dark)'}}>Upload Generator Bill Photo / PDF</label>
                      <div className="custom-file-upload" style={{marginTop:'8px'}}>
                        <input type="file" id="generator-bill-file" accept="image/*,application/pdf" />
                        <div className="upload-placeholder" id="generator-placeholder">
                          <span className="upload-icon">🧾</span>
                          <span className="upload-text">Choose Generator Bill File</span>
                        </div>
                        <div className="logo-preview-container" id="generator-preview-box" style={{display:'none',alignItems:'center',gap:'12px',padding:'10px',background:'rgba(0,0,0,0.02)',borderRadius:'8px',border:'1px dashed rgba(0,0,0,0.15)'}}>
                          <span className="file-icon" style={{fontSize:'1.5rem'}}>📄</span>
                          <span id="generator-file-name" className="file-name-label" style={{fontSize:'0.9rem',fontWeight:500}}>generator_bill.pdf</span>
                          <button className="remove-preview-btn" id="btn-remove-generator-bill" type="button">&times;</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. LPG Card */}
              <div className="calc-card glass-card scroll-reveal" id="sec-lpg">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-red">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2c1.7 2.6 4.3 4.1 5.3 7.8 1.2 4-1 8.2-5.3 8.2-4.3 0-6.5-4.2-5.3-8.2 1-3.7 3.6-5.2 5.3-7.8z"></path>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3 style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                      Liquified Petroleum Gas (LPG)
                      <span className="init-scope-badge scope1">Scope 1</span>
                    </h3>
                    <p>Enter LPG details to calculate direct emissions - Cylinder Count &times; Weight &times; Emission Factor</p>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="nested-form-section">
                    <h4 className="nested-title">Liquified Petroleum Gas (LPG) - Interactive Form</h4>
                    <p className="nested-subtitle">Enter LPG cylinders consumption details</p>
                    <div className="table-container" style={{marginTop:'16px'}}>
                      <table className="calc-table" id="lpg-table">
                        <thead>
                          <tr>
                            <th>Location</th>
                            <th>Number of Cylinders (per month)</th>
                            <th>Weight of One Cylinder (kg)</th>
                            <th>Emission Factor</th>
                            <th>Monthly Emission (kgCO₂)</th>
                            <th>Annual Emission (kgCO₂)</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="lpg-rows-container"></tbody>
                      </table>
                    </div>
                    <div className="form-actions-row" style={{marginTop:'16px',display:'flex',gap:'12px',flexWrap:'wrap'}}>
                      <button className="btn btn-add" id="btn-add-lpg"><span>+ Add LPG Entry</span></button>
                      <button className="btn btn-primary" id="btn-calculate-lpg">Calculate LPG Emissions</button>
                    </div>
                    <div className="lpg-results-summary" id="lpg-results-summary" style={{display:'none',marginTop:'24px',background:'rgba(231, 76, 60, 0.08)',padding:'18px 24px',borderRadius:'16px',border:'1px solid rgba(231, 76, 60, 0.15)'}}>
                      <h4 style={{fontSize:'1.1rem',fontWeight:700,color:'#c0392b',marginBottom:'12px',fontFamily:'var(--font-display)'}}>LPG Emissions Summary</h4>
                      <div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
                        <div style={{flex:1,minWidth:'180px'}}>
                          <span style={{fontSize:'0.85rem',color:'var(--text-secondary)',display:'block',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Total Monthly LPG Emission</span>
                          <span id="lpg-sum-month" style={{fontSize:'1.6rem',fontWeight:700,color:'var(--dark)',fontFamily:'var(--font-display)'}}>0.00 <span style={{fontSize:'0.9rem',fontWeight:500,color:'var(--text-secondary)'}}>kgCO₂/month</span></span>
                        </div>
                        <div style={{flex:1,minWidth:'180px'}}>
                          <span style={{fontSize:'0.85rem',color:'var(--text-secondary)',display:'block',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Total Annual LPG Emission</span>
                          <span id="lpg-sum-year" style={{fontSize:'1.6rem',fontWeight:700,color:'#c0392b',fontFamily:'var(--font-display)'}}>0.00 <span style={{fontSize:'0.9rem',fontWeight:500,color:'var(--text-secondary)'}}>kgCO₂/yr</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Paper Usage Card */}
              <div className="calc-card glass-card scroll-reveal" id="sec-paper">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3 style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                      Paper Usage
                      <span className="init-scope-badge scope3">Scope 3</span>
                    </h3>
                    <p>Track paper consumption emissions - Student Headcount &amp; Administrative Weight Ledger</p>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="nested-form-section">
                    <h4 className="nested-title">Paper Usage - Interactive Form</h4>
                    <p className="nested-subtitle">Administrative paper consumption &amp; dynamic student footprint sync</p>
                    <div className="paper-students-sync-card" style={{marginBottom:'24px',display:'flex',gap:'24px',flexWrap:'wrap',background:'rgba(155, 89, 182, 0.08)',padding:'18px 24px',borderRadius:'16px',border:'1px solid rgba(155, 89, 182, 0.15)'}}>
                      <div style={{flex:1,minWidth:'180px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                        <label htmlFor="paper-student-input" style={{fontSize:'0.85rem',color:'var(--text-secondary)',display:'block',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'6px'}}>Number of Students</label>
                        <input type="number" id="paper-student-input" defaultValue={0} min="0" style={{fontSize:'1.2rem',fontWeight:700,color:'var(--dark)',fontFamily:'var(--font-display)',width:'100%',border:'1.5px solid rgba(155, 89, 182, 0.3)',borderRadius:'8px',padding:'6px 12px',background:'white',outline:'none',transition:'border-color 0.2s'}} />
                      </div>
                      <div style={{flex:1.5,minWidth:'220px'}}>
                        <span style={{fontSize:'0.85rem',color:'var(--text-secondary)',display:'block',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Student Consumption (kg/year)</span>
                        <span id="paper-student-kg" style={{fontSize:'1.6rem',fontWeight:700,color:'var(--dark)',fontFamily:'var(--font-display)'}}>0.00 <span style={{fontSize:'0.9rem',fontWeight:500}}>kg/yr</span></span>
                      </div>
                      <div style={{flex:1.5,minWidth:'200px'}}>
                        <span style={{fontSize:'0.85rem',color:'var(--text-secondary)',display:'block',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Total Paper Emissions</span>
                        <span id="paper-total-emissions" style={{fontSize:'1.6rem',fontWeight:700,color:'var(--primary)',fontFamily:'var(--font-display)'}}>0.00 <span style={{fontSize:'0.9rem',fontWeight:500}}>kgCO₂/yr</span></span>
                      </div>
                    </div>
                    <div className="table-container" style={{marginTop:'16px'}}>
                      <table className="calc-table" id="paper-table">
                        <thead>
                          <tr>
                            <th>Location / Department</th>
                            <th>Paper Consumption (kg/year)</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="paper-rows-container"></tbody>
                      </table>
                    </div>
                    <div className="form-actions-row" style={{marginTop:'16px',display:'flex',gap:'12px',flexWrap:'wrap'}}>
                      <button className="btn btn-add" id="btn-add-paper"><span>+ Add Admin Paper Entry</span></button>
                      <button className="btn btn-primary" id="btn-calculate-paper">Calculate Paper Emissions</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Solar Energy System Card */}
              <div className="calc-card glass-card scroll-reveal" id="sec-solar">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3 style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                      Solar Energy System
                      <span className="init-scope-badge offset">Scope 2 Offset</span>
                    </h3>
                    <p>Calculate emissions offsets from clean solar energy generation</p>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="nested-form-section">
                    <h4 className="nested-title">Solar Energy System - Interactive Form</h4>
                    <p className="nested-subtitle">Enter solar panel capacity - emissions offset calculation</p>
                    <div className="table-container" style={{marginTop:'16px'}}>
                      <table className="calc-table" id="solar-table">
                        <thead>
                          <tr>
                            <th>Location (Building)</th>
                            <th>Usage / Application</th>
                            <th>Panel Capacity (kWh)</th>
                            <th>Emission Factor</th>
                            <th>Avoided Emissions (kgCO₂ Saved)</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="solar-rows-container"></tbody>
                      </table>
                    </div>
                    <div className="form-actions-row" style={{marginTop:'16px',display:'flex',gap:'12px',flexWrap:'wrap'}}>
                      <button className="btn btn-add" id="btn-add-solar"><span>+ Add Another Entry</span></button>
                      <button className="btn btn-primary" id="btn-calculate-solar">Calculate Solar Offset</button>
                    </div>
                    <div className="solar-results-summary" id="solar-results-summary" style={{display:'none',marginTop:'24px',background:'rgba(230, 126, 34, 0.08)',padding:'18px 24px',borderRadius:'16px',border:'1px solid rgba(230, 126, 34, 0.15)'}}>
                      <h4 style={{fontSize:'1.1rem',fontWeight:700,color:'#d35400',marginBottom:'12px',fontFamily:'var(--font-display)'}}>Solar Offset Summary</h4>
                      <div>
                        <strong>Total Solar Offset Generated:</strong> <span id="solar-sum-offset" style={{fontSize:'1.6rem',fontWeight:700,color:'#d35400',fontFamily:'var(--font-display)'}}>0.00 <span style={{fontSize:'0.9rem',fontWeight:500,color:'var(--text-secondary)'}}>kgCO₂ Saved/yr</span></span>
                      </div>
                    </div>
                    <div className="form-control file-upload-control" style={{marginTop:'24px',maxWidth:'400px'}}>
                      <label style={{fontWeight:600,color:'var(--dark)'}}>Upload Solar Panel Photo</label>
                      <div className="custom-file-upload" style={{marginTop:'8px'}}>
                        <input type="file" id="solar-photo-file" accept="image/*" />
                        <div className="upload-placeholder" id="solar-placeholder">
                          <span className="upload-icon">☀️</span>
                          <span className="upload-text">Choose Solar Panel Photo</span>
                        </div>
                        <div className="photo-preview-container" id="solar-preview-box" style={{display:'none',padding:'10px',background:'rgba(0,0,0,0.02)',borderRadius:'8px',border:'1px dashed rgba(0,0,0,0.15)',alignItems:'center',justifyContent:'center',position:'relative'}}>
                          <img id="solar-preview-img" alt="Solar Panel Preview" style={{maxHeight:'100px',borderRadius:'8px'}} />
                          <button className="remove-preview-btn" id="btn-remove-solar-photo" type="button" style={{position:'absolute',top:'5px',right:'5px',background:'rgba(239, 68, 68, 0.8)',border:'none',fontSize:'1.2rem',cursor:'pointer',color:'white',fontWeight:'bold',width:'24px',height:'24px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>&times;</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Green Cover & Trees Card (now a standalone card, same IDs) */}
              <div className="calc-card glass-card scroll-reveal" id="sec-trees">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-teal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22V12"></path>
                      <path d="M17 12H7"></path>
                      <path d="M12 2a5 5 0 0 0-5 5c0 2 2 3.5 5 5 3-1.5 5-3 5-5a5 5 0 0 0-5-5z"></path>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3 style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                      Green Cover &amp; Trees
                      <span className="init-scope-badge offset">Carbon Sink</span>
                    </h3>
                    <p>Calculate institutional carbon absorption from tree plantations</p>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="nested-form-section">
                    <h4 className="nested-title">Green Cover &amp; Trees - Interactive Form</h4>
                    <p className="nested-subtitle">Enter tree plantation details - trees absorb CO₂</p>
                    <div className="table-container" style={{marginTop:'16px'}}>
                      <table className="calc-table" id="trees-table">
                        <thead>
                          <tr>
                            <th>Tree Species</th>
                            <th>Location / Details</th>
                            <th>Number of Trees</th>
                            <th>Absorption Factor (kg/year)</th>
                            <th>Annual Absorption (kgCO₂)</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="trees-rows-container"></tbody>
                      </table>
                    </div>
                    <div className="form-actions-row" style={{marginTop:'16px',display:'flex',gap:'12px',flexWrap:'wrap'}}>
                      <button className="btn btn-add" id="btn-add-tree"><span>+ Add Tree Entry</span></button>
                      <button className="btn btn-primary" id="btn-calculate-trees">Calculate Tree Absorption</button>
                    </div>
                    <div className="tree-results-summary" id="tree-results-summary" style={{display:'none',marginTop:'24px',background:'rgba(26, 188, 156, 0.08)',padding:'18px 24px',borderRadius:'16px',border:'1px solid rgba(26, 188, 156, 0.15)'}}>
                      <h4 style={{fontSize:'1.1rem',fontWeight:700,color:'#16a085',marginBottom:'12px',fontFamily:'var(--font-display)'}}>Trees Absorption Summary</h4>
                      <div>
                        <strong>Total Carbon Absorption:</strong> <span id="tree-sum-absorption" style={{fontSize:'1.6rem',fontWeight:700,color:'#16a085',fontFamily:'var(--font-display)'}}>0.00 <span style={{fontSize:'0.9rem',fontWeight:500,color:'var(--text-secondary)'}}>kgCO₂ Absorbed/yr</span></span>
                      </div>
                    </div>
                    <div className="form-control file-upload-control" style={{marginTop:'24px',maxWidth:'400px'}}>
                      <label style={{fontWeight:600,color:'var(--dark)'}}>Upload Trees Photo</label>
                      <div className="custom-file-upload" style={{marginTop:'8px'}}>
                        <input type="file" id="trees-photo-file" accept="image/*" />
                        <div className="upload-placeholder" id="trees-placeholder">
                          <span className="upload-icon">🌳</span>
                          <span className="upload-text">Choose Trees Photo</span>
                        </div>
                        <div className="photo-preview-container" id="trees-preview-box" style={{display:'none',padding:'10px',background:'rgba(0,0,0,0.02)',borderRadius:'8px',border:'1px dashed rgba(0,0,0,0.15)',alignItems:'center',justifyContent:'center',position:'relative'}}>
                          <img id="trees-preview-img" alt="Trees Preview" style={{maxHeight:'100px',borderRadius:'8px'}} />
                          <button className="remove-preview-btn" id="btn-remove-trees-photo" type="button" style={{position:'absolute',top:'5px',right:'5px',background:'rgba(239, 68, 68, 0.8)',border:'none',fontSize:'1.2rem',cursor:'pointer',color:'white',fontWeight:'bold',width:'24px',height:'24px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>&times;</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 9. Waste Management & Recycling Card */}
              <div className="calc-card glass-card scroll-reveal" id="sec-waste">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3 style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                      Waste Management &amp; Recycling
                      <span className="init-scope-badge offset">Carbon Offset</span>
                    </h3>
                    <p>Calculate emissions offsets from recycling and proper waste treatment</p>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="nested-form-section">
                    <h4 className="nested-title">Waste Recycling - Interactive Form</h4>
                    <p className="nested-subtitle">Enter waste details - recycling avoids lifecycle emissions</p>
                    <div className="table-container" style={{marginTop:'16px'}}>
                      <table className="calc-table" id="waste-table">
                        <thead>
                          <tr>
                            <th>Material Type</th>
                            <th>Recycling Facility / Location</th>
                            <th>Quantity Recycled (kg/year)</th>
                            <th>Offset Factor (kgCO₂/kg)</th>
                            <th>Total Offset (kgCO₂ Saved)</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="waste-rows-container"></tbody>
                      </table>
                    </div>
                    <div className="form-actions-row" style={{marginTop:'16px',display:'flex',gap:'12px',flexWrap:'wrap'}}>
                      <button className="btn btn-add" id="btn-add-waste"><span>+ Add Recycle Entry</span></button>
                      <button className="btn btn-primary" id="btn-calculate-waste">Calculate Waste Offset</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Tab: Net Carbon Footprint */}
              <div className="calc-card glass-card scroll-reveal" id="sec-final">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v4l3 3"></path>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3>Final Tab — Net Carbon Footprint</h3>
                    <p>Calculated Net Carbon Footprint per Year</p>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="nested-form-section" style={{padding:'24px',borderRadius:'16px',background:'rgba(46, 204, 113, 0.08)',border:'1px solid rgba(46, 204, 113, 0.15)'}}>
                    <h4 className="nested-title" style={{color:'var(--primary)',fontSize:'1.3rem',marginBottom:'20px',fontFamily:'var(--font-display)'}}>Net Carbon Footprint Calculation</h4>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'20px',marginBottom:'24px'}}>
                      {[
                        {id:'final-paper-emission',label:'Paper Usage Emission'},
                        {id:'final-lpg-emission',label:'LPG Emission'},
                        {id:'final-electricity-emission',label:'Electricity Emission'},
                        {id:'final-generator-emission',label:'Generator Emission'},
                        {id:'final-vehicle-emission',label:'Vehicles Emission'},
                        {id:'final-solar-offset',label:'Solar Panel Offset',color:'#d35400'},
                        {id:'final-trees-offset',label:'Trees Absorption Offset',color:'#16a085'},
                      ].map(({id, label, color}) => (
                        <div key={id} style={{background:'rgba(255,255,255,0.5)',padding:'15px',borderRadius:'12px',border:'1px solid rgba(0,0,0,0.05)'}}>
                          <span style={{fontSize:'0.85rem',color:'var(--text-secondary)',textTransform:'uppercase',fontWeight:600,display:'block',letterSpacing:'0.5px'}}>{label}</span>
                          <span id={id} style={{display:'block',fontSize:'1.4rem',fontWeight:700,color:color||'var(--dark)',marginTop:'5px',fontFamily:'var(--font-display)'}}>0.00 kgCO₂/yr</span>
                        </div>
                      ))}
                    </div>

                    <div style={{borderTop:'1px solid rgba(0,0,0,0.1)',paddingTop:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'20px'}}>
                      <div>
                        <h5 style={{fontSize:'1.2rem',fontWeight:700,margin:0,color:'var(--dark)',fontFamily:'var(--font-display)'}}>Net Carbon Footprint per Year</h5>
                        <p style={{margin:'5px 0 0 0',fontSize:'0.85rem',color:'var(--text-secondary)'}}>
                          Formula: (Paper + LPG + Electricity + Generator + Vehicles) - (Solar + Trees)
                        </p>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <span id="final-net-footprint" style={{fontSize:'2.2rem',fontWeight:800,color:'var(--primary)',display:'block',fontFamily:'var(--font-display)'}}>0.00 kgCO₂/yr</span>
                        <span id="final-net-footprint-tons" style={{fontSize:'1.1rem',fontWeight:600,color:'var(--text-secondary)',display:'block',fontFamily:'var(--font-display)'}}>{'(0.000 tons CO₂/yr)'}</span>
                      </div>
                    </div>

                    <div style={{marginTop:'20px',display:'flex',justifyContent:'center',gap:'14px',flexWrap:'wrap'}}>
                      <button className="btn btn-primary" id="btn-calculate-final">Calculate Net Footprint</button>
                      <button className="btn btn-secondary" id="btn-recalculate-all" type="button">Recalculate All</button>
                      <button className="btn btn-secondary" id="btn-view-summary-report" style={{background:'#3b82f6',borderColor:'#2563eb',color:'#ffffff',fontWeight:700}}>👁️ View Summary Report (New Tab)</button>
                      <button className="btn btn-primary" id="btn-direct-download-pdf" style={{background:'#10b981',borderColor:'#059669',fontWeight:700}}>📥 Download Report (PDF)</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Institution Analytics & Performance Indicators Card */}
              <div className="calc-card glass-card scroll-reveal" id="sec-analytics">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3>Institution Analytics &amp; Indicators</h3>
                    <p>Emissions intensity and per-capita efficiency metrics</p>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="grid grid-3" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'20px',marginTop:'15px'}}>
                    {[
                      {id:'analytics-population',label:'Total Population',sub:'Students + Staff',color:'var(--dark)'},
                      {id:'analytics-students',label:'Number of Students',sub:'Enrolled Students',color:'var(--dark)'},
                      {id:'analytics-campus-area',label:'Campus Area',sub:'Acres',color:'var(--dark)'},
                      {id:'analytics-builtup-area',label:'Built-up Area',sub:'Square Metres (m²)',color:'var(--dark)'},
                      {id:'analytics-per-capita',label:'Emission per Capita',sub:'tCO₂e / person',color:'#2980b9',bg:'rgba(52, 152, 219, 0.06)',border:'rgba(52, 152, 219, 0.2)'},
                      {id:'analytics-per-sqm',label:'Emission per m²',sub:'tCO₂e / m²',color:'var(--primary)',bg:'rgba(46, 125, 50, 0.06)',border:'rgba(46, 125, 50, 0.2)'},
                    ].map(({id,label,sub,color,bg,border}) => (
                      <div key={id} className="card analytics-stat-box" style={{padding:'20px',borderRadius:'12px',background:bg||'rgba(255, 255, 255, 0.5)',border:`1px solid ${border||'rgba(0, 0, 0, 0.05)'}`,display:'flex',flexDirection:'column'}}>
                        <span style={{fontSize:'0.85rem',color:color==='var(--dark)'?'var(--text-secondary)':color,textTransform:'uppercase',fontWeight:600,letterSpacing:'0.5px'}}>{label}</span>
                        <span id={id} style={{fontSize:'1.8rem',fontWeight:700,color:color,marginTop:'8px'}}>-</span>
                        <span style={{fontSize:'0.8rem',color:'var(--text-muted)',marginTop:'4px'}}>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Dashboard Widget */}
              <div className="sticky-summary-widget shadow-reveal" id="summary-widget">
                <div className="summary-widget-container">
                  <div className="summary-stat-box">
                    <span className="stat-label">Gross Emissions</span>
                    <span className="stat-value text-red" id="summary-gross">0.00 <span className="stat-unit">tCO₂e/yr</span></span>
                  </div>
                  <div className="summary-stat-box">
                    <span className="stat-label">Clean Offsets</span>
                    <span className="stat-value text-green" id="summary-offsets">0.00 <span className="stat-unit">tCO₂e/yr</span></span>
                  </div>
                  <div className="summary-stat-box highlight">
                    <span className="stat-label">Net Carbon Footprint</span>
                    <span className="stat-value" id="summary-net">0.00 <span className="stat-unit">tCO₂e/yr</span></span>
                  </div>
                  <div className="summary-actions" style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                    <button className="btn btn-secondary" id="btn-view-summary-report-sticky" style={{background:'#3b82f6',borderColor:'#2563eb',color:'#ffffff',fontWeight:700,padding:'8px 14px',fontSize:'0.85rem'}}>👁️ View Report (New Tab)</button>
                    <button className="btn btn-primary" id="btn-direct-download-pdf-sticky" style={{background:'#10b981',borderColor:'#059669',fontWeight:700,padding:'8px 14px',fontSize:'0.85rem'}}>📥 Download PDF</button>
                  </div>
                </div>
              </div>

              {/* Calculation Formulas Card */}
              <div className="calc-card glass-card scroll-reveal">
                <div className="calc-card-header">
                  <div className="header-icon-box bg-dark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                    </svg>
                  </div>
                  <div className="header-titles">
                    <h3>Calculation Formulas</h3>
                    <p>Understanding how your emissions are calculated</p>
                  </div>
                </div>
                <div className="calc-card-body">
                  <div className="formulas-container">
                    <div className="formula-box">
                      <p><strong>Emission per Day</strong> = Number of Vehicles &times; Average Distance &times; Emission Factor</p>
                    </div>
                    <div className="formula-box">
                      <p><strong>Emission per Month</strong> = Emission per Day &times; 20 (working days)</p>
                    </div>
                    <div className="formula-box">
                      <p><strong>Emission per Year</strong> = Emission per Day &times; 240 (working days)</p>
                    </div>
                    <div className="formula-box">
                      <p><strong>Emission per Year (tons CO₂)</strong> = Emission per Year (kg CO₂) &divide; 1000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Modal */}
              <div className="report-modal-overlay" id="report-modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(15, 23, 42, 0.75)',backdropFilter:'blur(10px)',zIndex:10000,display:'none',alignItems:'center',justifyContent:'center',padding:'20px'}}>
                <div className="report-modal-window" style={{background:'#ffffff',borderRadius:'20px',width:'1000px',maxWidth:'95vw',height:'90vh',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 25px 60px rgba(0,0,0,0.3)',border:'1px solid rgba(16,185,129,0.3)'}}>
                  <div className="report-modal-header" style={{background:'linear-gradient(135deg, #064e3b 0%, #047857 100%)',color:'#ffffff',padding:'18px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                      <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#6ee7b7'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      </div>
                      <div>
                        <h3 style={{fontSize:'1.15rem',fontWeight:700,color:'#ffffff',margin:0}}>Carbon Footprint Assessment Report</h3>
                        <p style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.85)',margin:0}}>ISO 14064-1 &amp; GHG Protocol Institutional Assessment</p>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                      <button className="btn btn-primary" id="btn-modal-print-report" style={{background:'#10b981',borderColor:'#059669',fontWeight:700,padding:'8px 16px',fontSize:'0.85rem'}}>🖨️ Print / Save PDF</button>
                      <button className="btn btn-secondary" id="btn-modal-download-pdf-report" style={{background:'#3b82f6',borderColor:'#2563eb',color:'#ffffff',fontWeight:700,padding:'8px 16px',fontSize:'0.85rem'}}>📥 Download PDF</button>
                      <button className="ecobot-icon-btn" id="btn-modal-close-report" title="Close Preview" style={{background:'rgba(255,255,255,0.15)',color:'#ffffff',border:'none',width:'34px',height:'34px',borderRadius:'10px',cursor:'pointer'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:'18px',height:'18px'}}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  </div>
                  <div className="report-modal-body" id="report-modal-body" style={{flex:1,overflowY:'auto',padding:'30px',background:'#f8fafc'}}>
                    <div id="report-rendered-content"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Hidden report container */}
      <div id="pdf-report-render-target" style={{display:'none'}}></div>

      {/* Toast Notification System */}
      <div className="toast-container" id="toast-container"></div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <Link href="/#home" className="logo">
                <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8.5C18.4 18 14.5 20 11 20z"></path>
                </svg>
                <span>Carbon<span>Track</span></span>
              </Link>
              <p className="quote">&quot;Small actions create a greener future.&quot;</p>
              <p className="footer-about">An academic research portal focused on localized carbon indices and smart consumption models.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link href="/#home">Home</Link></li>
                <li><Link href="/#about">About Platform</Link></li>
                <li><Link href="/calculator" className="active">Footprint Calculator</Link></li>
                <li><Link href="/#methodology">Our Methodology</Link></li>
                <li><Link href="/#features">Core Features</Link></li>
                <li><Link href="/#privacy">Privacy Governance</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact &amp; Research</h4>
              <ul className="footer-contact">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="footer-icon">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>research@carbontrack.org</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="footer-icon">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>University Research Hub, Campus Green</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="footer-icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+1 (555) 234-9876</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div>&copy; 2026 CarbonTrack Platform. Developed for the Environmental Sciences Research Project. All rights reserved.</div>
            <div className="footer-socials">
              <a href="#" aria-label="Github Link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" aria-label="Twitter Link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}