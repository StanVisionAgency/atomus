import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode, HTMLAttributes, InputHTMLAttributes, SVGProps } from 'react';

type ButtonHierarchy = 'primary' | 'secondary' | 'outline' | 'tertiary' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Figma: Hierarchy */
    hierarchy?: ButtonHierarchy;
    /** Figma: Size — xs 24 · sm 32 · md 40 · lg 48 · xl 56 */
    size?: ButtonSize;
    /** Figma: Leading icon + Leading icon swap */
    iconLeading?: ReactNode;
    /** Figma: Trailing icon + Trailing icon swap */
    iconTrailing?: ReactNode;
    /** Figma: State=Loading */
    loading?: boolean;
    /** Square icon-only button (Figma: Button icon). Requires aria-label. */
    iconOnly?: boolean;
    fullWidth?: boolean;
}
declare const Button: react.ForwardRefExoticComponent<ButtonProps & react.RefAttributes<HTMLButtonElement>>;

type BadgeColor = 'gray' | 'brand' | 'error' | 'warning' | 'success';
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Figma: Label */
    children: ReactNode;
    /** Figma: Color */
    color?: BadgeColor;
    /** Figma: Style — light (tinted) or solid */
    variant?: 'light' | 'solid';
    /** Figma: Size — sm 20 · md 24 · lg 28 */
    size?: 'sm' | 'md' | 'lg';
    /** Figma: Dot */
    dot?: boolean;
    /** Figma: Leading icon + Leading icon swap */
    icon?: ReactNode;
    /** Figma: Close — shows a remove button */
    onClose?: () => void;
}
declare function Badge({ children, color, variant, size, dot, icon, onClose, className, ...rest }: BadgeProps): react.JSX.Element;

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    /** Figma: Label */
    children: ReactNode;
    /** Figma: Size — sm 24 · md 28 · lg 32 */
    size?: 'sm' | 'md' | 'lg';
    /** Figma: Leading icon + Leading icon swap */
    icon?: ReactNode;
    /** Figma: Close — shows the × button */
    onRemove?: () => void;
}
declare function Tag({ children, size, icon, onRemove, className, ...rest }: TagProps): react.JSX.Element;

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Figma: Label (+ Show label). Always give one; use aria-label when it is hidden. */
    label?: string;
    /** Figma: Hint (+ Show hint) */
    hint?: string;
    /** Figma: State=Error — replaces the hint and turns the border red */
    error?: string;
    /** Figma: Size — sm 32 · md 40 · lg 48, matching Button */
    size?: 'sm' | 'md' | 'lg';
    iconLeading?: ReactNode;
    iconTrailing?: ReactNode;
}
declare const Input: react.ForwardRefExoticComponent<InputProps & react.RefAttributes<HTMLInputElement>>;

interface ChoiceBase extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    /** Figma: Label (+ Show label) */
    label?: string;
    /** Figma: Description (+ Show description) */
    description?: string;
    /** Figma: Size — sm (16 control, 14px label) · md (20 control, 16px label) */
    size?: 'sm' | 'md';
}
interface CheckboxProps extends ChoiceBase {
    /** Figma: Checked=Indeterminate */
    indeterminate?: boolean;
}
type RadioProps = ChoiceBase;
interface ToggleProps extends ChoiceBase {
    /** Figma: Shape */
    shape?: 'pill' | 'square';
}
declare const Checkbox: react.ForwardRefExoticComponent<CheckboxProps & react.RefAttributes<HTMLInputElement>>;
declare const Radio: react.ForwardRefExoticComponent<ChoiceBase & react.RefAttributes<HTMLInputElement>>;
declare const Toggle: react.ForwardRefExoticComponent<ToggleProps & react.RefAttributes<HTMLInputElement>>;

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
    /** Person or workspace name — used for initials, tooltip and accessible name */
    name?: string;
    /** Figma: Type=Image */
    src?: string;
    /** Figma: Initials — overrides the initials derived from name */
    initials?: string;
    /** Figma: Type=Icon + Icon swap */
    icon?: ReactNode;
    /** Figma: Size — xs 24 · sm 32 · md 40 · lg 48 · xl 56 · 2xl 64 */
    size?: AvatarSize;
    /** Figma: Shape */
    shape?: 'circle' | 'rounded';
    /** Figma: Status */
    status?: 'online' | 'away' | 'offline';
}
declare function Avatar({ name, src, initials, icon, size, shape, status, className, ...rest }: AvatarProps): react.JSX.Element;

type AlertColor = 'brand' | 'gray' | 'error' | 'warning' | 'success';
interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'color'> {
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
declare function Alert({ title, children, color, variant, actions, onClose, icon, className, ...rest }: AlertProps): react.JSX.Element;

interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** Figma: Title (Header on) */
    title?: ReactNode;
    /** Figma: Supporting text */
    supportingText?: ReactNode;
    /** Figma: Header action — e.g. a Button or icon button, top right */
    headerAction?: ReactNode;
    /** Figma: Content slot */
    children?: ReactNode;
    /** Figma: Footer — buttons aligned right */
    footer?: ReactNode;
    /** Figma: Style */
    variant?: 'outlined' | 'elevated' | 'filled';
    /** Figma: Padding — md 16 · lg 24 */
    padding?: 'md' | 'lg';
}
declare function Card({ title, supportingText, headerAction, children, footer, variant, padding, className, ...rest }: CardProps): react.JSX.Element;

interface TabItem {
    value: string;
    label: ReactNode;
    /** Small count badge after the label */
    count?: number;
    disabled?: boolean;
}
interface TabsProps {
    items: TabItem[];
    /** Figma: Style */
    variant?: 'underline' | 'pill' | 'segmented';
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    /** Accessible name for the tab list */
    'aria-label'?: string;
    className?: string;
}
declare function Tabs({ items, variant, value, defaultValue, onChange, className, ...aria }: TabsProps): react.JSX.Element;

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
    /** 0–100 */
    value: number;
    /** Figma: Label — where the percentage sits */
    labelPosition?: 'none' | 'right' | 'bottom';
    /** Accessible name, e.g. "Storage used" */
    label?: string;
}
declare function ProgressBar({ value, labelPosition, label, className, ...rest }: ProgressBarProps): react.JSX.Element;

interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
    /** Figma: Label */
    label: ReactNode;
    /** Figma: Value — pre-formatted ("$48.2k") */
    value: ReactNode;
    /** Figma: Type — simple · trend · chart */
    type?: 'simple' | 'trend' | 'chart';
    /** Change vs the comparison period, e.g. "12%" or "-0.4%" */
    change?: string;
    /** Inferred from a leading "-" in change when omitted */
    trend?: 'up' | 'down';
    /** Comparison period, e.g. "vs last month" */
    caption?: ReactNode;
    /** Sparkline values for type="chart" */
    data?: number[];
    /** Header action, e.g. a tertiary icon button */
    action?: ReactNode;
}
declare function MetricCard({ label, value, type, change, trend, caption, data, action, className, ...rest }: MetricCardProps): react.JSX.Element;

interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Figma: Title */
    title: ReactNode;
    /** Figma: Description */
    description?: ReactNode;
    /** Featured icon glyph */
    icon?: ReactNode;
    /** Figma: Actions — usually Outline + Primary buttons */
    actions?: ReactNode;
    /** Figma: Size — sm (panels) · md (pages) */
    size?: 'sm' | 'md';
}
declare function EmptyState({ title, description, icon, actions, size, className, ...rest }: EmptyStateProps): react.JSX.Element;

/**
 * Minimal glyphs the components need internally (check, close, status).
 * For product icons use the Atomus icon set (Font Awesome names) and pass them as ReactNodes.
 */
declare const PATHS: {
    readonly check: "M4 10.5l3.5 3.5L16 6";
    readonly minus: "M5 10h10";
    readonly x: "M5 5l10 10M15 5L5 15";
    readonly info: "M10 9v5M10 6.5v.01M10 18a8 8 0 100-16 8 8 0 000 16z";
    readonly alert: "M10 7v4M10 13.5v.01M8.6 3.3L2 15a1.6 1.6 0 001.4 2.4h13.2A1.6 1.6 0 0018 15L11.4 3.3a1.6 1.6 0 00-2.8 0z";
    readonly success: "M6.5 10l2.5 2.5 4.5-5M10 18a8 8 0 100-16 8 8 0 000 16z";
    readonly plus: "M10 4v12M4 10h12";
    readonly search: "M9 15A6 6 0 109 3a6 6 0 000 12zM17 17l-3.8-3.8";
    readonly folder: "M2.5 6.5A1.5 1.5 0 014 5h3.5l1.5 2h7a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5v-8z";
    readonly user: "M10 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3.5 17.5a6.5 6.5 0 0113 0";
    readonly arrowUp: "M10 15V5M5.5 9.5L10 5l4.5 4.5";
    readonly arrowDown: "M10 5v10M5.5 10.5L10 15l4.5-4.5";
};
type IconName = keyof typeof PATHS;
interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
    name: IconName;
    size?: number;
}
declare function Icon({ name, size, className, ...rest }: IconProps): react.JSX.Element;

export { Alert, type AlertColor, type AlertProps, Avatar, type AvatarProps, type AvatarSize, Badge, type BadgeColor, type BadgeProps, Button, type ButtonHierarchy, type ButtonProps, type ButtonSize, Card, type CardProps, Checkbox, type CheckboxProps, EmptyState, type EmptyStateProps, Icon, type IconName, type IconProps, Input, type InputProps, MetricCard, type MetricCardProps, ProgressBar, type ProgressBarProps, Radio, type RadioProps, type TabItem, Tabs, type TabsProps, Tag, type TagProps, Toggle, type ToggleProps };
