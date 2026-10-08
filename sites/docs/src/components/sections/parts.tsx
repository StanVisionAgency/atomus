// Shared building blocks for the website-section previews. Section markup only uses Atomus tokens,
// .text-web-* text styles and @stanvision/atomus-react components.
import type { CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from '../../../../../react/src';

export function Section({ children, alt, tight, className = '', style }: { children: ReactNode; alt?: boolean; tight?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <section className={`ws-section${alt ? ' ws-section--alt' : ''}${tight ? ' ws-section--tight' : ''} ${className}`} style={style}>
      <div className="ws-container">{children}</div>
    </section>
  );
}

export function Head({ eyebrow, title, lead, center, size = 'xl', children, top }: { top?: ReactNode; eyebrow?: string; title: ReactNode; lead?: ReactNode; center?: boolean; size?: 'display' | 'xl' | 'lg' | 'md'; children?: ReactNode }) {
  const cls = size === 'display' ? 'text-web-display' : `text-web-heading-${size}`;
  return (
    <div className={`ws-head${center ? ' ws-head--center' : ''}`}>
      {top}
      {eyebrow ? <p className="ws-eyebrow text-web-eyebrow">{eyebrow}</p> : null}
      <p className={`ws-title ${cls}`}>{title}</p>
      {lead ? <p className="ws-lead text-web-body-lg">{lead}</p> : null}
      {children}
    </div>
  );
}

export function Img({ ratio = '4 / 3', tone, ui, style }: { ratio?: string; tone?: 'soft' | 'warm' | 'green'; ui?: boolean; style?: CSSProperties }) {
  return (
    <div className={`ws-img${tone ? ` ws-img--${tone}` : ''}`} style={{ ['--ratio' as string]: ratio, ...style }} role="img" aria-label="Image placeholder">
      {ui ? <div className="ws-img__ui"><i /><i><b /><b /></i></div> : null}
    </div>
  );
}

export function FIcon({ name }: { name: IconName }) {
  return <span className="ws-ficon"><Icon name={name} size={24} /></span>;
}

export function Check() {
  return <span className="ws-check"><Icon name="check" size={14} /></span>;
}

export function Stars() {
  return (
    <span className="ws-stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8z" /></svg>
      ))}
    </span>
  );
}

const LOGOS = [
  ['Northwind', ''], ['Lumen', 'round'], ['Kite & Co', 'serif'], ['Orbital', 'round'], ['Pinecrest', ''], ['Vela', 'serif'],
] as const;
export function Logo({ i }: { i: number }) {
  const [name, kind] = LOGOS[i % LOGOS.length];
  return <span className={`ws-logo${kind ? ` ws-logo--${kind}` : ''}`}>{kind === 'serif' ? null : <i />}{name}</span>;
}

export function Brand() {
  return <span className="ws-brand"><i aria-hidden="true" />ATOMUS</span>;
}

export const FEATURES: [IconName, string, string][] = [
  ['settings', 'Tokens, not hex', 'Every colour, radius and spacing value is a variable with light, dark and brand modes.'],
  ['folder', 'One library', 'Product UI and marketing sections live in the same Figma file and the same React package.'],
  ['search', 'Built for AI', 'Markdown guidelines teach Claude, Cursor and Figma Make to build with your components.'],
  ['home', 'Responsive by default', 'Desktop, tablet and mobile modes switch type and spacing automatically.'],
  ['bell', 'Accessible', 'Focus rings, contrast and keyboard support are part of every component.'],
  ['user', 'Made to share', 'Duplicate the file per client, set the brand mode and start designing.'],
];
