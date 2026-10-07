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
