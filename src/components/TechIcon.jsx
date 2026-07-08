import React from 'react';

export default function TechIcon({ name, className = "w-4 h-4" }) {
  const normalized = name.toLowerCase().trim();

  // Color-coded, high-fidelity SVGs for all technologies in BeyondSkills courses
  switch (normalized) {
    case 'python':
      return (
        <svg className={className} viewBox="0 0 448 512" fill="currentColor" style={{ color: '#3776AB' }}>
          <path d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 60.8-66.8 60.8H185.9c-9.9 0-17.9 8-17.9 17.9v45.7c0 9.9 8 17.9 17.9 17.9h148c30.1 0 53.4-23.3 53.4-53.4v-40.1c31.1 0 54.2-14.6 54.2-45.7-.1-.1-.1-2.9-.2-6.1zm-86.8-12c-12 0-21.6-9.7-21.6-21.7s9.7-21.7 21.6-21.7c12 0 21.7 9.7 21.7 21.7s-9.7 21.7-21.7 21.7zM8.2 311.5c7.7 30.9 22.3 54.2 53.4 54.2h40.1v-47.4c0-36.8 31.2-60.8 66.8-60.8h93.6c9.9 0 17.9-8 17.9-17.9v-45.7c0-9.9-8-17.9-17.9-17.9h-148c-30.1 0-53.4 23.3-53.4 53.4v40.1c-31.1 0-54.2 14.6-54.2 45.7 0 .1 0 2.9.2 6.1zm86.8 12c12 0 21.6 9.7 21.6 21.7s-9.7 21.7-21.6 21.7c-12 0-21.7-9.7-21.7-21.7s9.7-21.7 21.7-21.7z" />
        </svg>
      );
    case 'sql':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#00758F' }}>
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
        </svg>
      );
    case 'pandas':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#150458' }}>
          <rect x="3" y="3" width="6" height="18" rx="1" fill="#E70488" />
          <rect x="10" y="7" width="6" height="14" rx="1" fill="#3B82F6" />
          <rect x="17" y="11" width="4" height="10" rx="1" fill="#F59E0B" />
        </svg>
      );
    case 'numpy':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#013243' }}>
          <rect x="2" y="2" width="20" height="20" rx="4" />
          <path d="M9 2v20M15 2v20M2 9h20M2 15h20" />
        </svg>
      );
    case 'scikit-learn':
    case 'scikit learn':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#F89938' }}>
          <circle cx="7" cy="7" r="4" fill="#3B82F6" />
          <circle cx="17" cy="17" r="4" fill="#F59E0B" />
          <line x1="7" y1="7" x2="17" y2="17" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
    case 'tensorflow':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#FF6F00' }}>
          <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 3.3l5.5 3.4v6.6L12 18.7l-5.5-3.4V8.7L12 5.3zm-2 4.7h4v4h-4v-4z" />
        </svg>
      );
    case 'html5':
    case 'html':
      return (
        <svg className={className} viewBox="0 0 512 512" fill="currentColor" style={{ color: '#E34F26' }}>
          <path d="M64 32l35 403 157 45 157-45 35-403h-384zm285 115h-152v30h149l-14 153-76 21-76-21-5-57h30l3 33 48 13 48-13 8-90h-138v-30h142v-30h-145v-30h176l-3 30z" />
        </svg>
      );
    case 'css3':
    case 'css':
      return (
        <svg className={className} viewBox="0 0 512 512" fill="currentColor" style={{ color: '#1572B6' }}>
          <path d="M64 32l35 403 157 45 157-45 35-403h-384zm288 115H176v30h168l-15 174-73 20-73-20-5-57h30l3 33 45 12 45-12 10-111H173v-30h204l4-30z" />
        </svg>
      );
    case 'javascript':
    case 'js':
      return (
        <svg className={className} viewBox="0 0 448 512" fill="currentColor" style={{ color: '#F7DF1E' }}>
          <path d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.1 63.5-33.7 0-53.2-18.8-63.2-38.5l34.3-20.7c6.6 11.7 15.6 21.6 28.7 21.6 16.5 0 24.3-9 24.3-28.3V251h40v130.4zm99.7 12.9c0 21.6-11.7 34-30 34-15.6 0-25-10.8-31.5-23l-33.5 20.5c13 25.4 34.9 41.5 65.8 41.5 45.6 0 68.7-25.1 68.7-59.7 0-41-30.8-55.7-58.8-67.9l-9.9-4.2c-19.1-8-25.9-13.9-25.9-24.1 0-9.2 7.7-16.1 19.8-16.1 13 0 21.1 6.8 26.2 18.2l32.2-20.5c-10.1-20.7-27.7-33.5-56-33.5-37.4 0-61.9 23.3-61.9 56.6 0 36.8 25.6 51.5 53.4 63.5l10.1 4.4c23.3 9.9 31 16.5 31 28.1z" />
        </svg>
      );
    case 'react':
      return (
        <svg className={className} viewBox="0 0 512 512" fill="currentColor" style={{ color: '#61DAFB' }}>
          <path d="M418.2 177.2c-5.4-1.8-10.8-3.5-16.2-5.1.9-3.7 1.7-7.4 2.5-11.1 27.2-125.4-80.9-190.2-185.3-112.5-4.4 3.3-8.8 6.7-13.1 10.3-4.3-3.6-8.7-7-13.1-10.3C88.8-11.6-19.3 53.2 7.9 178.6c.8 3.7 1.6 7.4 2.5 11.1-5.4 1.6-10.8 3.3-16.2 5.1C-129.4 213.9-129.4 330.1 3.5 366.8c5.4 1.5 10.8 2.9 16.2 4.2-.9 3.7-1.7 7.4-2.5 11.1-27.2 125.4 80.9 190.2 185.3 112.5 4.4-3.3 8.8-6.7 13.1-10.3 4.3 3.6 8.7 7 13.1 10.3 104.4 77.9 212.5 13.1 185.3-112.5-.8-3.7-1.6-7.4-2.5-11.1 5.4-1.3 10.8-2.7 16.2-4.2 132.9-36.7 132.9-152.9 0-189.6zm-175.7 79c0-10.9 8.8-19.7 19.7-19.7s19.7 8.8 19.7 19.7-8.8 19.7-19.7 19.7-19.7-8.8-19.7-19.7zm93.4-53.7c18.5 24.3 29.2 51.5 30.6 78.4-13.8 2.8-28.5 4.3-43.7 4.3-30.8 0-59.5-6-84-16.7 20.8-22.3 49.3-46.6 97.1-66zm-119.5 2.1c47.8 19.4 76.3 43.7 97.1 66-24.5 10.7-53.2 16.7-84 16.7-15.2 0-29.9-1.5-43.7-4.3 1.4-26.9 12.1-54.1 30.6-78.4zm-48.4 96c-17.7-4.7-32.9-11.4-45-19.9 26.6-47.5 73-82.5 125.3-95.6-26.9 29.7-42.8 68.3-80.3 115.5zm197.6-115.5c52.3 13.1 98.7 48.1 125.3 95.6-12.1 8.5-27.3 15.2-45 19.9-37.5-47.2-53.4-85.8-80.3-115.5zM226.5 133c-30.8 0-59.5 6-84 16.7 20.8 22.3 49.3 46.6 97.1 66 18.5-24.3 29.2-51.5 30.6-78.4-13.8-2.8-28.5-4.3-43.7-4.3zm97.1 262c-47.8-19.4-76.3-43.7-97.1-66 24.5-10.7 53.2-16.7 84-16.7 15.2 0 29.9-1.5 43.7-4.3-1.4 26.9-12.1 54.1-30.6 78.4zm-119.5-2.1c-18.5-24.3-29.2-51.5-30.6-78.4 13.8-2.8 28.5-4.3 43.7-4.3 30.8 0 59.5 6 84 16.7-20.8 22.3-49.3 46.6-97.1 66zm-48.4-96c37.5 47.2 53.4 85.8 80.3 115.5-52.3-13.1-98.7-48.1-125.3-95.6 12.1-8.5 27.3-15.2 45-19.9zm197.6 115.5c26.9-29.7 42.8-68.3 80.3-115.5 17.7 4.7 32.9 11.4 45 19.9-26.6 47.5-73 82.5-125.3 95.6z" />
        </svg>
      );
    case 'node.js':
    case 'node':
      return (
        <svg className={className} viewBox="0 0 448 512" fill="currentColor" style={{ color: '#339933' }}>
          <path d="M232.8 19c-4.8-2.8-10.7-2.8-15.5 0L49.3 114.9c-4.8 2.8-7.8 7.9-7.8 13.5v191.6c0 5.6 3 10.7 7.8 13.5l168 97c4.8 2.8 10.7 2.8 15.5 0l168-97c4.8-2.8 7.8-7.9 7.8-13.5V128.4c0-5.6-3-10.7-7.8-13.5L232.8 19zm-38 316.5c-4.2-2.4-7.8-5.7-10.5-9.6l-55.8 32.2v-64.4c0-4.8 2.5-9.2 6.6-11.6l59.7-34.5v87.9zm24.6-56.5l-63-36.4v-72.7l63 36.4v72.7zm49.5-28.5L206 214.1v-72.7l62.9 36.3v72.8zm24.6 56.5v-87.9l59.7 34.5c4.1 2.4 6.6 6.8 6.6 11.6v64.4l-55.8-32.2c-2.7 3.9-6.3 7.2-10.5 9.6z" />
        </svg>
      );
    case 'express':
    case 'express.js':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#828282' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 10h4M7 14h4M14 10v4" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#47A248' }}>
          <path d="M12 .587c0 .587-4.103 5.753-4.103 10.155s2.434 6.666 4.103 8.358c1.669-1.692 4.103-3.956 4.103-8.358S12 1.174 12 .587zm0 13.793a1.986 1.986 0 1 1 0-3.972 1.986 1.986 0 0 1 0 3.972zM12 21.05c-1.391-.837-7.234-5.267-7.234-11.458C4.766 4.673 8.653 2.122 12 1.584c3.347.538 7.234 3.089 7.234 8.008 0 6.191-5.843 10.621-7.234 11.458z" />
        </svg>
      );
    case 'google ads':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#4285F4' }}>
          <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z" />
        </svg>
      );
    case 'meta ads':
    case 'meta':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0064E0' }}>
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.35 12.33c-.73.73-1.68 1.13-2.65 1.13-.97 0-1.92-.4-2.65-1.13l-1.05-1.05-1.05 1.05c-.73.73-1.68 1.13-2.65 1.13-.97 0-1.92-.4-2.65-1.13-.73-.73-1.13-1.68-1.13-2.65 0-.97.4-1.92 1.13-2.65.73-.73 1.68-1.13 2.65-1.13.97 0 1.92.4 2.65 1.13l1.05 1.05 1.05-1.05c.73-.73 1.68-1.13 2.65-1.13.97 0 1.92.4 2.65 1.13.73.73 1.13 1.68 1.13 2.65 0 .97-.4 1.92-1.13 2.65z" />
        </svg>
      );
    case 'google analytics':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#F4B400' }}>
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2V7h2v10zm4 0h-2v-7h2v7z" />
        </svg>
      );
    case 'seo':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#00B159' }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
          <line x1="11" y1="8" x2="11" y2="14" />
        </svg>
      );
    case 'email marketing':
    case 'email':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#D44638' }}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'ats systems':
    case 'ats':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6A1B9A' }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'payroll tools':
    case 'payroll':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#00897B' }}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'hr analytics':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#AD1457' }}>
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      );
    case 'excel':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#107C41' }}>
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      );
    case 'technical analysis':
    case 'charts':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#26A69A' }}>
          <path d="M3 3v18h18" />
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
        </svg>
      );
    case 'fundamental analysis':
    case 'finance':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#EC407A' }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case 'trading sheets':
    case 'trading':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#E65100' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
        </svg>
      );
    case 'risk management':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#D32F2F' }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'kali linux':
    case 'kali':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#557C94' }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm2.07-7.75l-.9.9c-.7.7-1.17 1.7-1.17 2.85h-2c0-1.7.67-3.23 1.77-4.33l1.28-1.28c.37-.37.59-.88.59-1.44 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.2 1.8-4 4-4s4 1.8 4 4c0 .88-.36 1.68-.97 2.25z" />
        </svg>
      );
    case 'wireshark':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#1679A7' }}>
          <path d="M12 2L2 22h20L12 2zm0 5l6 12H6l6-12z" />
        </svg>
      );
    case 'metasploit':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#4F5D75' }}>
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 18l-8-4v-5l8 4 8-4v5l-8 4z" />
        </svg>
      );
    case 'nmap':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#880E4F' }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" />
        </svg>
      );
    case 'owasp top 10':
    case 'owasp':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#F15B2A' }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'aws':
    case 'aws ec2':
    case 'aws s3':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#FF9900' }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.29 14.29c-.38.38-.89.59-1.42.59s-1.04-.21-1.42-.59L6.5 12.33c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0l3.08 3.08 6.08-6.08c.78-.78 2.05-.78 2.83 0 .78.78.78 2.05 0 2.83l-7.03 7.03z" />
        </svg>
      );
    case 'vpc routing':
    case 'auto scaling':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FF9900' }}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );
    default:
      // Code fallback icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8B5CF6' }}>
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      );
  }
}
