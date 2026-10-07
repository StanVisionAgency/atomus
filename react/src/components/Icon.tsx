import type { SVGProps } from 'react';
import { cx } from '../utils';

/**
 * Minimal glyphs the components need internally (check, close, status).
 * For product icons use the Atomus icon set (Font Awesome names) and pass them as ReactNodes.
 */
const PATHS = {
  check: 'M4 10.5l3.5 3.5L16 6',
  minus: 'M5 10h10',
  x: 'M5 5l10 10M15 5L5 15',
  info: 'M10 9v5M10 6.5v.01M10 18a8 8 0 100-16 8 8 0 000 16z',
  alert: 'M10 7v4M10 13.5v.01M8.6 3.3L2 15a1.6 1.6 0 001.4 2.4h13.2A1.6 1.6 0 0018 15L11.4 3.3a1.6 1.6 0 00-2.8 0z',
  success: 'M6.5 10l2.5 2.5 4.5-5M10 18a8 8 0 100-16 8 8 0 000 16z',
  plus: 'M10 4v12M4 10h12',
  search: 'M9 15A6 6 0 109 3a6 6 0 000 12zM17 17l-3.8-3.8',
  folder: 'M2.5 6.5A1.5 1.5 0 014 5h3.5l1.5 2h7a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5v-8z',
  user: 'M10 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3.5 17.5a6.5 6.5 0 0113 0',
  arrowUp: 'M10 15V5M5.5 9.5L10 5l4.5 4.5',
  arrowDown: 'M10 5v10M5.5 10.5L10 15l4.5-4.5',
  chevronDown: 'M5 7.5l5 5 5-5',
  chevronUp: 'M5 12.5l5-5 5 5',
  chevronLeft: 'M12.5 5l-5 5 5 5',
  chevronRight: 'M7.5 5l5 5-5 5',
  calendar: 'M3 7.5h14M6.5 2.5v3M13.5 2.5v3M4.5 4h11A1.5 1.5 0 0117 5.5v10a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 15.5v-10A1.5 1.5 0 014.5 4z',
  sort: 'M6.5 8L10 4.5 13.5 8M6.5 12L10 15.5 13.5 12',
  menu: 'M3.5 5.5h13M3.5 10h13M3.5 14.5h13',
  home: 'M3 9l7-6 7 6v7.5a1 1 0 01-1 1h-3.5v-5h-5v5H4a1 1 0 01-1-1V9z',
  settings: 'M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM16.2 12.3l1.3 1-1.6 2.8-1.6-.6a6 6 0 01-1.8 1l-.3 1.7H8.8l-.3-1.7a6 6 0 01-1.8-1l-1.6.6-1.6-2.8 1.3-1a6 6 0 010-2.1l-1.3-1 1.6-2.8 1.6.6a6 6 0 011.8-1l.3-1.7h3.2l.3 1.7a6 6 0 011.8 1l1.6-.6 1.6 2.8-1.3 1a6 6 0 010 2.1z',
  bell: 'M10 17.5a1.8 1.8 0 001.7-1.2M5 8a5 5 0 0110 0c0 4.5 2 5.5 2 5.5H3S5 12.5 5 8z',
  more: 'M10 5.5v.01M10 10v.01M10 14.5v.01',
} as const;

export type IconName = keyof typeof PATHS;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      className={cx('at-icon', className)}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
