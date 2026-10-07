import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils';
import { Icon, type IconName } from './Icon';

export type AlertColor = 'brand' | 'gray' | 'error' | 'warning' | 'success';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'color'> {
  /** Figma: Title */
  title?: ReactNode;
  /** Figma: Description (+ Show description) */
  children?: ReactNode;
  /** Figma: Color */
  color?: AlertColor;
  /** Figma: Style — subtle (tinted) or outline (white with border) */
  variant?: 'subtle' | 'outline';
  /** Figma: Actions — up to two small buttons */
  actions?: ReactNode;
  /** Figma: Close */
  onClose?: () => void;
  /** Replaces the default status icon */
  icon?: ReactNode;
}

const ICONS: Record<AlertColor, IconName> = { brand: 'info', gray: 'info', error: 'alert', warning: 'alert', success: 'success' };

export function Alert({ title, children, color = 'brand', variant = 'subtle', actions, onClose, icon, className, ...rest }: AlertProps) {
  return (
    <div role={color === 'error' ? 'alert' : 'status'} className={cx('at-alert', `at-alert--${variant}`, `at-alert--${color}`, className)} {...rest}>
      <span className="at-alert__icon">{icon ?? <Icon name={ICONS[color]} size={20} />}</span>
      <div className="at-alert__body">
        {title ? <p className="at-alert__title">{title}</p> : null}
        {children ? <div className="at-alert__text">{children}</div> : null}
        {actions ? <div className="at-alert__actions">{actions}</div> : null}
      </div>
      {onClose ? (
        <button type="button" className="at-alert__close" aria-label="Dismiss" onClick={onClose}>
          <Icon name="x" size={20} />
        </button>
      ) : null}
    </div>
  );
}
