import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode, HTMLAttributes, InputHTMLAttributes, SVGProps, ReactElement, AnchorHTMLAttributes } from 'react';

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
    readonly chevronDown: "M5 7.5l5 5 5-5";
    readonly chevronUp: "M5 12.5l5-5 5 5";
    readonly chevronLeft: "M12.5 5l-5 5 5 5";
    readonly chevronRight: "M7.5 5l5 5-5 5";
    readonly calendar: "M3 7.5h14M6.5 2.5v3M13.5 2.5v3M4.5 4h11A1.5 1.5 0 0117 5.5v10a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 15.5v-10A1.5 1.5 0 014.5 4z";
    readonly sort: "M6.5 8L10 4.5 13.5 8M6.5 12L10 15.5 13.5 12";
    readonly menu: "M3.5 5.5h13M3.5 10h13M3.5 14.5h13";
    readonly home: "M3 9l7-6 7 6v7.5a1 1 0 01-1 1h-3.5v-5h-5v5H4a1 1 0 01-1-1V9z";
    readonly settings: "M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM16.2 12.3l1.3 1-1.6 2.8-1.6-.6a6 6 0 01-1.8 1l-.3 1.7H8.8l-.3-1.7a6 6 0 01-1.8-1l-1.6.6-1.6-2.8 1.3-1a6 6 0 010-2.1l-1.3-1 1.6-2.8 1.6.6a6 6 0 011.8-1l.3-1.7h3.2l.3 1.7a6 6 0 011.8 1l1.6-.6 1.6 2.8-1.3 1a6 6 0 010 2.1z";
    readonly bell: "M10 17.5a1.8 1.8 0 001.7-1.2M5 8a5 5 0 0110 0c0 4.5 2 5.5 2 5.5H3S5 12.5 5 8z";
    readonly more: "M10 5.5v.01M10 10v.01M10 14.5v.01";
};
type IconName = keyof typeof PATHS;
interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
    name: IconName;
    size?: number;
}
declare function Icon({ name, size, className, ...rest }: IconProps): react.JSX.Element;

interface MenuItemProps {
    /** Figma: Label */
    label: ReactNode;
    /** Figma: Leading icon + Leading icon swap */
    icon?: ReactNode;
    /** Figma: Shortcut + Shortcut text */
    shortcut?: string;
    /** Figma: Size — sm 36 · md 40 */
    size?: 'sm' | 'md';
    /** Figma: State=Selected — shows a check */
    selected?: boolean;
    disabled?: boolean;
    /** Red label for destructive actions (Context menu) */
    destructive?: boolean;
    onSelect?: () => void;
    role?: 'menuitem' | 'option' | 'menuitemcheckbox';
    id?: string;
    active?: boolean;
}
/** Figma: Menu item — row for dropdowns, selects, context and command menus. */
declare function MenuItem({ label, icon, shortcut, size, selected, disabled, destructive, onSelect, role, id, active }: MenuItemProps): react.JSX.Element;
type DropdownItem = {
    type?: 'item';
    label: ReactNode;
    icon?: ReactNode;
    shortcut?: string;
    disabled?: boolean;
    destructive?: boolean;
    onSelect?: () => void;
} | {
    type: 'separator';
} | {
    type: 'heading';
    label: ReactNode;
};
interface DropdownMenuProps {
    /** The element that opens the menu, usually a Button */
    trigger: ReactElement;
    /** Figma: Items slot */
    items: DropdownItem[];
    align?: 'start' | 'end';
    size?: 'sm' | 'md';
    /** Accessible name for the menu */
    label?: string;
    /** Start open (docs and tests) */
    defaultOpen?: boolean;
    className?: string;
}
/** Figma: Dropdown menu / Context menu — keyboard: ↑ ↓ Home End Enter Esc. */
declare function DropdownMenu({ trigger, items, align, size, label, defaultOpen, className }: DropdownMenuProps): react.JSX.Element;

interface SelectOption {
    value: string;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
}
interface SelectProps {
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    /** Figma: Label (+ Show label) */
    label?: string;
    /** Figma: Show hint */
    hint?: string;
    /** Figma: State=Error */
    error?: string;
    placeholder?: string;
    /** Figma: Size — sm 32 · md 40 · lg 48 */
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    /** Form field name; a hidden input carries the value */
    name?: string;
    id?: string;
    /** Start open (docs and tests) */
    defaultOpen?: boolean;
    className?: string;
}
/** Figma: Select (trigger) + Dropdown menu (list). A WAI-ARIA select-only combobox. */
declare function Select({ options, value, defaultValue, onChange, label, hint, error, placeholder, size, disabled, name, id, defaultOpen, className }: SelectProps): react.JSX.Element;

interface ModalProps {
    open: boolean;
    onClose: () => void;
    /** Figma: Title */
    title: ReactNode;
    /** Figma: Description */
    description?: ReactNode;
    /** Figma: Content slot */
    children?: ReactNode;
    /** Figma: Actions — buttons, primary last */
    actions?: ReactNode;
    /** Figma: Featured icon — true for the default glyph, or pass an icon */
    featuredIcon?: boolean | ReactNode;
    /** Figma: Close button */
    closeButton?: boolean;
    /** Figma: Size — sm 400 · md 544 · lg 720 */
    size?: 'sm' | 'md' | 'lg';
    /** Figma: Type — destructive tints the featured icon red */
    type?: 'default' | 'destructive';
    className?: string;
}
/** Figma: Modal. Uses the native dialog element: focus trap, Esc to close and inert background come built in. */
declare function Modal({ open, onClose, title, description, children, actions, featuredIcon, closeButton, size, type, className }: ModalProps): react.JSX.Element;

type ToastColor = 'brand' | 'gray' | 'error' | 'warning' | 'success';
interface ToastProps {
    /** Figma: Title */
    title: ReactNode;
    /** Figma: Description */
    description?: ReactNode;
    /** Figma: Color */
    color?: ToastColor;
    /** Figma: Close */
    onClose?: () => void;
    action?: ReactNode;
    className?: string;
}
/** Figma: Toast — a single floating notification. Use ToastProvider + useToast to show them. */
declare function Toast({ title, description, color, onClose, action, className }: ToastProps): react.JSX.Element;
interface ToastOptions extends Omit<ToastProps, 'onClose' | 'className'> {
    /** ms before auto-dismiss; 0 keeps it until closed. Default 5000 (errors 0). */
    duration?: number;
}
interface ToastCtx {
    show: (t: ToastOptions) => string;
    dismiss: (id: string) => void;
}
interface ToastProviderProps {
    children: ReactNode;
    position?: 'top-right' | 'bottom-right' | 'bottom-center';
}
/** Hosts toasts. Pauses auto-dismiss on hover and focus. */
declare function ToastProvider({ children, position }: ToastProviderProps): react.JSX.Element;
declare function useToast(): ToastCtx;

interface TableColumn<Row> {
    key: string;
    /** Figma: Table header cell — Label */
    header: ReactNode;
    /** Figma: Table header cell — Sortable */
    sortable?: boolean;
    /** Value used for sorting; defaults to row[key] */
    sortValue?: (row: Row) => string | number;
    /** Cell content; defaults to row[key]. Use Avatar, Badge or Buttons for the Figma cell types. */
    render?: (row: Row) => ReactNode;
    /** Supporting text under the main text (Figma: Type=Text + supporting) */
    supporting?: (row: Row) => ReactNode;
    align?: 'start' | 'end';
    width?: number | string;
}
interface TableProps<Row> {
    columns: TableColumn<Row>[];
    rows: Row[];
    rowKey: (row: Row) => string;
    /** Figma: Table cell Size — sm 52 · md 72 */
    size?: 'sm' | 'md';
    /** Figma: Table header cell — Checkbox; adds a select-all column */
    selectable?: boolean;
    selected?: string[];
    onSelectedChange?: (keys: string[]) => void;
    /** Accessible table caption */
    caption?: string;
    /** Rendered when rows is empty, e.g. an EmptyState */
    empty?: ReactNode;
    className?: string;
}
/** Figma: Table header cell + Table cell. Sorting is built in; filtering and pagination stay with the page (Filter bar, Pagination). */
declare function Table<Row extends Record<string, unknown>>({ columns, rows, rowKey, size, selectable, selected, onSelectedChange, caption, empty, className }: TableProps<Row>): react.JSX.Element;

/** Dates are ISO strings 'YYYY-MM-DD' (no time zones). */
type ISODate = string;
interface DateRange {
    start: ISODate | null;
    end: ISODate | null;
}
interface CalendarProps {
    /** Figma: Date picker Type */
    type?: 'single' | 'range';
    value?: ISODate | null;
    range?: DateRange;
    onChange?: (value: ISODate) => void;
    onRangeChange?: (range: DateRange) => void;
    min?: ISODate;
    max?: ISODate;
    /** Monday-first by default */
    weekStartsOn?: 0 | 1;
    locale?: string;
    className?: string;
}
/** Figma: Date picker body with Calendar day cells (Default, Today, Selected, In range, Outside, Disabled). Arrow keys move days, PageUp/PageDown move months. */
declare function Calendar({ type, value, range, onChange, onRangeChange, min, max, weekStartsOn, locale, className }: CalendarProps): react.JSX.Element;
interface DatePickerProps extends Omit<CalendarProps, 'className'> {
    /** Figma: Date input — Label */
    label?: string;
    hint?: string;
    error?: string;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    id?: string;
    /** Start open (docs and tests) */
    defaultOpen?: boolean;
    className?: string;
}
/** Figma: Date input + Date picker. A field that opens the calendar in a popover. */
declare function DatePicker({ label, hint, error, placeholder, size, disabled, id, defaultOpen, className, ...cal }: DatePickerProps): react.JSX.Element;

interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /** Figma: Label */
    label: string;
    /** Figma: Icon swap */
    icon?: ReactNode;
    /** Figma: Badge — a count or short label after the text */
    badge?: ReactNode;
    /** Figma: Chevron — marks an item with children */
    chevron?: boolean;
    /** Figma: State=Active */
    active?: boolean;
    /** Figma: Collapsed — icon only, label becomes the tooltip and accessible name */
    collapsed?: boolean;
}
/** Figma: Nav item. Renders a link; pass href (or onClick). */
declare function NavItem({ label, icon, badge, chevron, active, collapsed, className, ...rest }: NavItemProps): react.JSX.Element;
interface SidebarNavigationProps extends HTMLAttributes<HTMLElement> {
    /** Logo or workspace switcher at the top */
    header?: ReactNode;
    /** NavItems */
    children: ReactNode;
    /** Pinned at the bottom: secondary links, user card */
    footer?: ReactNode;
    /** Figma: Collapsed — 280px or a 72px rail */
    collapsed?: boolean;
    'aria-label'?: string;
}
/** Figma: Sidebar navigation (280px, or a 72px rail when collapsed). */
declare function SidebarNavigation({ header, children, footer, collapsed, className, ...rest }: SidebarNavigationProps): react.JSX.Element;
interface AppHeaderProps extends HTMLAttributes<HTMLElement> {
    /** Logo or product name */
    brand?: ReactNode;
    /** Primary links (NavItem or anchors) */
    nav?: ReactNode;
    /** Right side: search, notifications, avatar */
    actions?: ReactNode;
}
/** Figma: App header — top navigation bar for apps. */
declare function AppHeader({ brand, nav, actions, className, ...rest }: AppHeaderProps): react.JSX.Element;

export { Alert, type AlertColor, type AlertProps, AppHeader, type AppHeaderProps, Avatar, type AvatarProps, type AvatarSize, Badge, type BadgeColor, type BadgeProps, Button, type ButtonHierarchy, type ButtonProps, type ButtonSize, Calendar, type CalendarProps, Card, type CardProps, Checkbox, type CheckboxProps, DatePicker, type DatePickerProps, type DateRange, type DropdownItem, DropdownMenu, type DropdownMenuProps, EmptyState, type EmptyStateProps, type ISODate, Icon, type IconName, type IconProps, Input, type InputProps, MenuItem, type MenuItemProps, MetricCard, type MetricCardProps, Modal, type ModalProps, NavItem, type NavItemProps, ProgressBar, type ProgressBarProps, Radio, type RadioProps, Select, type SelectOption, type SelectProps, SidebarNavigation, type SidebarNavigationProps, type TabItem, Table, type TableColumn, type TableProps, Tabs, type TabsProps, Tag, type TagProps, Toast, type ToastColor, type ToastOptions, type ToastProps, ToastProvider, type ToastProviderProps, Toggle, type ToggleProps, useToast };
