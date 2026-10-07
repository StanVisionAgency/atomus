/* Atomus 4.0 — component props. window.Atomus.<Name> */
import * as React from "react";

export type IconName = 'check' | 'x' | 'info' | 'alert' | 'success' | 'plus' | 'search' | 'folder' | 'arrowUp' | 'arrowDown';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  iconLeading?: IconName;
  iconTrailing?: IconName;
  iconOnly?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}
export declare const Button: React.FC<ButtonProps>;

export interface BadgeProps {
  color?: 'gray' | 'brand' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
}
export declare const Badge: React.FC<BadgeProps>;

export interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
}
export declare const Tag: React.FC<TagProps>;

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  iconLeading?: IconName;
}
export declare const Input: React.FC<InputProps>;

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  indeterminate?: boolean;
}
export declare const Checkbox: React.FC<CheckboxProps>;

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}
export declare const Radio: React.FC<RadioProps>;

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  size?: 'md' | 'lg';
}
export declare const Toggle: React.FC<ToggleProps>;

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'offline';
}
export declare const Avatar: React.FC<AvatarProps>;

export interface AlertProps {
  tone?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onDismiss?: () => void;
}
export declare const Alert: React.FC<AlertProps>;

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'md' | 'lg';
}
export declare const Card: React.FC<CardProps>;

export interface TabsProps {
  items: { value: string; label: string; count?: number }[];
  variant?: 'underline' | 'segmented';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}
export declare const Tabs: React.FC<TabsProps>;

export interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
}
export declare const ProgressBar: React.FC<ProgressBarProps>;

export interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  caption?: string;
}
export declare const MetricCard: React.FC<MetricCardProps>;

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconName;
  actions?: React.ReactNode;
}
export declare const EmptyState: React.FC<EmptyStateProps>;
