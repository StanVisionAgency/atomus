/* @ds-bundle: {"format":4,"namespace":"Atomus","components":[{"name":"Button"},{"name":"Badge"},{"name":"Tag"},{"name":"Input"},{"name":"Checkbox"},{"name":"Radio"},{"name":"Toggle"},{"name":"Avatar"},{"name":"Alert"},{"name":"Card"},{"name":"Tabs"},{"name":"ProgressBar"},{"name":"MetricCard"},{"name":"EmptyState"},{"name":"Select"},{"name":"DropdownMenu"},{"name":"Modal"},{"name":"Toast"},{"name":"Table"},{"name":"DatePicker"},{"name":"Navigation"}]} */
"use strict";
var __atomus = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // rg:react
  var require_react = __commonJS({
    "rg:react"(exports, module) {
      module.exports = window.React;
    }
  });

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Alert: () => Alert,
    AppHeader: () => AppHeader,
    Avatar: () => Avatar,
    Badge: () => Badge,
    Button: () => Button,
    Calendar: () => Calendar,
    Card: () => Card,
    Checkbox: () => Checkbox,
    DatePicker: () => DatePicker,
    DropdownMenu: () => DropdownMenu,
    EmptyState: () => EmptyState,
    Icon: () => Icon,
    Input: () => Input,
    MenuItem: () => MenuItem,
    MetricCard: () => MetricCard,
    Modal: () => Modal,
    NavItem: () => NavItem,
    ProgressBar: () => ProgressBar,
    Radio: () => Radio,
    Select: () => Select,
    SidebarNavigation: () => SidebarNavigation,
    Table: () => Table,
    Tabs: () => Tabs,
    Tag: () => Tag,
    Toast: () => Toast,
    ToastProvider: () => ToastProvider,
    Toggle: () => Toggle,
    useToast: () => useToast
  });

  // src/components/Button.tsx
  var import_react2 = __toESM(require_react(), 1);

  // src/utils.ts
  var import_react = __toESM(require_react(), 1);
  function cx(...parts2) {
    return parts2.filter(Boolean).join(" ");
  }
  function useFieldId(given) {
    const generated = (0, import_react.useId)();
    return given != null ? given : `at${generated.replace(/:/g, "")}`;
  }
  function useOutsideClick(refs, handler, active = true) {
    (0, import_react.useEffect)(() => {
      if (!active) return;
      const onDown = (e) => {
        const t = e.target;
        if (refs.every((r) => !r.current || !r.current.contains(t))) handler();
      };
      document.addEventListener("pointerdown", onDown);
      return () => document.removeEventListener("pointerdown", onDown);
    }, [active, handler, refs]);
  }

  // rg:react/jsx-runtime
  var R = window.React;
  var Fragment = R.Fragment;
  function jsx(t, p, k) {
    return R.createElement(t, k === void 0 ? p : Object.assign({}, p, { key: k }));
  }
  var jsxs = jsx;

  // src/components/Button.tsx
  var Button = (0, import_react2.forwardRef)(function Button2({ hierarchy = "secondary", size = "md", iconLeading, iconTrailing, loading, iconOnly, fullWidth, disabled, className, children, type = "button", ...rest }, ref) {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref,
        type,
        className: cx("at-btn", `at-btn--${hierarchy}`, `at-btn--${size}`, iconOnly && "at-btn--icon", fullWidth && "at-btn--full", className),
        disabled: disabled || loading,
        "aria-busy": loading || void 0,
        ...rest,
        children: [
          loading ? /* @__PURE__ */ jsx("span", { className: "at-spinner", "aria-hidden": "true" }) : iconLeading,
          iconOnly ? null : children,
          iconOnly ? null : iconTrailing
        ]
      }
    );
  });

  // src/components/Icon.tsx
  var PATHS = {
    check: "M4 10.5l3.5 3.5L16 6",
    minus: "M5 10h10",
    x: "M5 5l10 10M15 5L5 15",
    info: "M10 9v5M10 6.5v.01M10 18a8 8 0 100-16 8 8 0 000 16z",
    alert: "M10 7v4M10 13.5v.01M8.6 3.3L2 15a1.6 1.6 0 001.4 2.4h13.2A1.6 1.6 0 0018 15L11.4 3.3a1.6 1.6 0 00-2.8 0z",
    success: "M6.5 10l2.5 2.5 4.5-5M10 18a8 8 0 100-16 8 8 0 000 16z",
    plus: "M10 4v12M4 10h12",
    search: "M9 15A6 6 0 109 3a6 6 0 000 12zM17 17l-3.8-3.8",
    folder: "M2.5 6.5A1.5 1.5 0 014 5h3.5l1.5 2h7a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5v-8z",
    user: "M10 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3.5 17.5a6.5 6.5 0 0113 0",
    arrowUp: "M10 15V5M5.5 9.5L10 5l4.5 4.5",
    arrowDown: "M10 5v10M5.5 10.5L10 15l4.5-4.5",
    chevronDown: "M5 7.5l5 5 5-5",
    chevronUp: "M5 12.5l5-5 5 5",
    chevronLeft: "M12.5 5l-5 5 5 5",
    chevronRight: "M7.5 5l5 5-5 5",
    calendar: "M3 7.5h14M6.5 2.5v3M13.5 2.5v3M4.5 4h11A1.5 1.5 0 0117 5.5v10a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 15.5v-10A1.5 1.5 0 014.5 4z",
    sort: "M6.5 8L10 4.5 13.5 8M6.5 12L10 15.5 13.5 12",
    menu: "M3.5 5.5h13M3.5 10h13M3.5 14.5h13",
    home: "M3 9l7-6 7 6v7.5a1 1 0 01-1 1h-3.5v-5h-5v5H4a1 1 0 01-1-1V9z",
    settings: "M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM16.2 12.3l1.3 1-1.6 2.8-1.6-.6a6 6 0 01-1.8 1l-.3 1.7H8.8l-.3-1.7a6 6 0 01-1.8-1l-1.6.6-1.6-2.8 1.3-1a6 6 0 010-2.1l-1.3-1 1.6-2.8 1.6.6a6 6 0 011.8-1l.3-1.7h3.2l.3 1.7a6 6 0 011.8 1l1.6-.6 1.6 2.8-1.3 1a6 6 0 010 2.1z",
    bell: "M10 17.5a1.8 1.8 0 001.7-1.2M5 8a5 5 0 0110 0c0 4.5 2 5.5 2 5.5H3S5 12.5 5 8z",
    more: "M10 5.5v.01M10 10v.01M10 14.5v.01"
  };
  function Icon({ name, size = 20, className, ...rest }) {
    return /* @__PURE__ */ jsx(
      "svg",
      {
        className: cx("at-icon", className),
        width: size,
        height: size,
        viewBox: "0 0 20 20",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.67,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
        focusable: "false",
        ...rest,
        children: /* @__PURE__ */ jsx("path", { d: PATHS[name] })
      }
    );
  }

  // src/components/Badge.tsx
  function Badge({ children, color = "gray", variant = "light", size = "md", dot, icon, onClose, className, ...rest }) {
    return /* @__PURE__ */ jsxs("span", { className: cx("at-badge", `at-badge--${size}`, `at-badge--${variant}-${color}`, className), ...rest, children: [
      dot ? /* @__PURE__ */ jsx("span", { className: "at-badge__dot", "aria-hidden": "true" }) : icon,
      children,
      onClose ? /* @__PURE__ */ jsx("button", { type: "button", className: "at-badge__close", "aria-label": `Remove ${typeof children === "string" ? children : "badge"}`, onClick: onClose, children: /* @__PURE__ */ jsx(Icon, { name: "x", size: 12 }) }) : null
    ] });
  }

  // src/components/Tag.tsx
  function Tag({ children, size = "md", icon, onRemove, className, ...rest }) {
    return /* @__PURE__ */ jsxs("span", { className: cx("at-tag", `at-tag--${size}`, className), ...rest, children: [
      icon,
      children,
      onRemove ? /* @__PURE__ */ jsx("button", { type: "button", className: "at-tag__x", "aria-label": `Remove ${typeof children === "string" ? children : "tag"}`, onClick: onRemove, children: /* @__PURE__ */ jsx(Icon, { name: "x", size: 12 }) }) : null
    ] });
  }

  // src/components/Input.tsx
  var import_react3 = __toESM(require_react(), 1);
  var Input = (0, import_react3.forwardRef)(function Input2({ label, hint, error, size = "md", iconLeading, iconTrailing, className, id, disabled, ...rest }, ref) {
    const fieldId = useFieldId(id);
    const message = error || hint;
    return /* @__PURE__ */ jsxs("div", { className: cx("at-field", className), children: [
      label ? /* @__PURE__ */ jsx("label", { htmlFor: fieldId, className: "at-field__label", children: label }) : null,
      /* @__PURE__ */ jsxs("div", { className: cx("at-input", `at-input--${size}`, error && "at-input--error", disabled && "at-input--disabled"), children: [
        iconLeading,
        /* @__PURE__ */ jsx(
          "input",
          {
            ref,
            id: fieldId,
            disabled,
            "aria-invalid": error ? true : void 0,
            "aria-describedby": message ? `${fieldId}-msg` : void 0,
            ...rest
          }
        ),
        iconTrailing
      ] }),
      message ? /* @__PURE__ */ jsx("p", { id: `${fieldId}-msg`, className: cx("at-field__hint", error && "at-field__hint--error"), children: message }) : null
    ] });
  });

  // src/components/Choice.tsx
  var import_react4 = __toESM(require_react(), 1);
  function ChoiceText({ label, description }) {
    if (!label && !description) return null;
    return /* @__PURE__ */ jsxs("span", { className: "at-choice__text", children: [
      label ? /* @__PURE__ */ jsx("span", { className: "at-choice__label", children: label }) : null,
      description ? /* @__PURE__ */ jsx("span", { className: "at-choice__desc", children: description }) : null
    ] });
  }
  var Checkbox = (0, import_react4.forwardRef)(function Checkbox2({ label, description, size = "sm", indeterminate, className, id, disabled, ...rest }, ref) {
    const fieldId = useFieldId(id);
    const inner = (0, import_react4.useRef)(null);
    (0, import_react4.useImperativeHandle)(ref, () => inner.current);
    (0, import_react4.useEffect)(() => {
      if (inner.current) inner.current.indeterminate = !!indeterminate;
    }, [indeterminate]);
    return /* @__PURE__ */ jsxs("label", { htmlFor: fieldId, className: cx("at-choice", `at-choice--${size}`, disabled && "at-choice--disabled", className), children: [
      /* @__PURE__ */ jsx("input", { ref: inner, id: fieldId, type: "checkbox", className: "at-checkbox", disabled, ...rest }),
      /* @__PURE__ */ jsx(ChoiceText, { label, description })
    ] });
  });
  var Radio = (0, import_react4.forwardRef)(function Radio2({ label, description, size = "sm", className, id, disabled, ...rest }, ref) {
    const fieldId = useFieldId(id);
    return /* @__PURE__ */ jsxs("label", { htmlFor: fieldId, className: cx("at-choice", `at-choice--${size}`, disabled && "at-choice--disabled", className), children: [
      /* @__PURE__ */ jsx("input", { ref, id: fieldId, type: "radio", className: "at-radio", disabled, ...rest }),
      /* @__PURE__ */ jsx(ChoiceText, { label, description })
    ] });
  });
  var Toggle = (0, import_react4.forwardRef)(function Toggle2({ label, description, size = "sm", shape = "pill", className, id, disabled, ...rest }, ref) {
    const fieldId = useFieldId(id);
    return /* @__PURE__ */ jsxs("label", { htmlFor: fieldId, className: cx("at-choice", `at-choice--${size}`, disabled && "at-choice--disabled", className), children: [
      /* @__PURE__ */ jsx("input", { ref, id: fieldId, type: "checkbox", role: "switch", className: cx("at-toggle", `at-toggle--${shape}`), disabled, ...rest }),
      /* @__PURE__ */ jsx(ChoiceText, { label, description })
    ] });
  });

  // src/components/Avatar.tsx
  function deriveInitials(name) {
    var _a, _b;
    if (!name) return "";
    const parts2 = name.trim().split(/\s+/);
    const first = (_b = (_a = parts2[0]) == null ? void 0 : _a[0]) != null ? _b : "";
    const last = parts2.length > 1 ? parts2[parts2.length - 1][0] : "";
    return (first + last).toUpperCase();
  }
  function Avatar({ name, src, initials, icon, size = "md", shape = "circle", status, className, ...rest }) {
    const text = initials != null ? initials : deriveInitials(name);
    return /* @__PURE__ */ jsxs("span", { className: cx("at-avatar", `at-avatar--${size}`, `at-avatar--${shape}`, className), title: name, ...rest, children: [
      src ? /* @__PURE__ */ jsx("img", { src, alt: name != null ? name : "" }) : text ? /* @__PURE__ */ jsx("span", { className: "at-avatar__initials", role: "img", "aria-label": name != null ? name : text, children: text }) : /* @__PURE__ */ jsx("span", { className: "at-avatar__icon", role: "img", "aria-label": name != null ? name : "User", children: icon != null ? icon : /* @__PURE__ */ jsx(Icon, { name: "user", size: 20 }) }),
      status ? /* @__PURE__ */ jsx("span", { className: cx("at-avatar__status", `at-avatar__status--${status}`), role: "status", "aria-label": status }) : null
    ] });
  }

  // src/components/Alert.tsx
  var ICONS = { brand: "info", gray: "info", error: "alert", warning: "alert", success: "success" };
  function Alert({ title, children, color = "brand", variant = "subtle", actions, onClose, icon, className, ...rest }) {
    return /* @__PURE__ */ jsxs("div", { role: color === "error" ? "alert" : "status", className: cx("at-alert", `at-alert--${variant}`, `at-alert--${color}`, className), ...rest, children: [
      /* @__PURE__ */ jsx("span", { className: "at-alert__icon", children: icon != null ? icon : /* @__PURE__ */ jsx(Icon, { name: ICONS[color], size: 20 }) }),
      /* @__PURE__ */ jsxs("div", { className: "at-alert__body", children: [
        title ? /* @__PURE__ */ jsx("p", { className: "at-alert__title", children: title }) : null,
        children ? /* @__PURE__ */ jsx("div", { className: "at-alert__text", children }) : null,
        actions ? /* @__PURE__ */ jsx("div", { className: "at-alert__actions", children: actions }) : null
      ] }),
      onClose ? /* @__PURE__ */ jsx("button", { type: "button", className: "at-alert__close", "aria-label": "Dismiss", onClick: onClose, children: /* @__PURE__ */ jsx(Icon, { name: "x", size: 20 }) }) : null
    ] });
  }

  // src/components/Card.tsx
  function Card({ title, supportingText, headerAction, children, footer, variant = "outlined", padding = "md", className, ...rest }) {
    const hasHeader = title || supportingText || headerAction;
    return /* @__PURE__ */ jsxs("section", { className: cx("at-card", `at-card--${variant}`, `at-card--pad-${padding}`, className), ...rest, children: [
      hasHeader ? /* @__PURE__ */ jsxs("header", { className: "at-card__header", children: [
        /* @__PURE__ */ jsxs("div", { className: "at-card__heading", children: [
          title ? /* @__PURE__ */ jsx("h3", { className: "at-card__title", children: title }) : null,
          supportingText ? /* @__PURE__ */ jsx("p", { className: "at-card__supporting", children: supportingText }) : null
        ] }),
        headerAction ? /* @__PURE__ */ jsx("div", { className: "at-card__action", children: headerAction }) : null
      ] }) : null,
      children ? /* @__PURE__ */ jsx("div", { className: "at-card__content", children }) : null,
      footer ? /* @__PURE__ */ jsx("footer", { className: "at-card__footer", children: footer }) : null
    ] });
  }

  // src/components/Tabs.tsx
  var import_react5 = __toESM(require_react(), 1);
  function Tabs({ items, variant = "underline", value, defaultValue, onChange, className, ...aria }) {
    var _a;
    const controlled = value !== void 0;
    const [inner, setInner] = (0, import_react5.useState)(defaultValue != null ? defaultValue : (_a = items[0]) == null ? void 0 : _a.value);
    const current = controlled ? value : inner;
    const refs = (0, import_react5.useRef)([]);
    const select = (v) => {
      if (!controlled) setInner(v);
      onChange == null ? void 0 : onChange(v);
    };
    const onKeyDown = (e) => {
      var _a2;
      const enabled = items.filter((t) => !t.disabled);
      const i = enabled.findIndex((t) => t.value === current);
      let next;
      if (e.key === "ArrowRight") next = enabled[(i + 1) % enabled.length];
      if (e.key === "ArrowLeft") next = enabled[(i - 1 + enabled.length) % enabled.length];
      if (e.key === "Home") next = enabled[0];
      if (e.key === "End") next = enabled[enabled.length - 1];
      if (next) {
        e.preventDefault();
        select(next.value);
        (_a2 = refs.current[items.indexOf(next)]) == null ? void 0 : _a2.focus();
      }
    };
    return /* @__PURE__ */ jsx("div", { role: "tablist", "aria-label": aria["aria-label"], className: cx("at-tabs", `at-tabs--${variant}`, className), onKeyDown, children: items.map((t, i) => {
      const active = t.value === current;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          ref: (el) => {
            refs.current[i] = el;
          },
          type: "button",
          role: "tab",
          "aria-selected": active,
          tabIndex: active ? 0 : -1,
          disabled: t.disabled,
          className: cx("at-tab", active && "is-active"),
          onClick: () => select(t.value),
          children: [
            t.label,
            t.count != null ? /* @__PURE__ */ jsx("span", { className: "at-tab__count", children: t.count }) : null
          ]
        },
        t.value
      );
    }) });
  }

  // src/components/ProgressBar.tsx
  function ProgressBar({ value, labelPosition = "right", label = "Progress", className, ...rest }) {
    const v = Math.max(0, Math.min(100, value));
    return /* @__PURE__ */ jsxs("div", { className: cx("at-progress", `at-progress--${labelPosition}`, className), ...rest, children: [
      /* @__PURE__ */ jsx("div", { className: "at-progress__track", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": v, "aria-label": label, children: /* @__PURE__ */ jsx("div", { className: "at-progress__fill", style: { width: `${v}%` } }) }),
      labelPosition !== "none" ? /* @__PURE__ */ jsxs("span", { className: "at-progress__value", children: [
        Math.round(v),
        "%"
      ] }) : null
    ] });
  }

  // src/components/MetricCard.tsx
  function Sparkline({ data, trend }) {
    const w = 112;
    const h = 56;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const pts = data.map((d, i) => `${(i / Math.max(1, data.length - 1) * w).toFixed(1)},${(h - 4 - (d - min) / span * (h - 8)).toFixed(1)}`);
    return /* @__PURE__ */ jsx("svg", { className: cx("at-metric__chart", `at-metric__chart--${trend}`), width: w, height: h, viewBox: `0 0 ${w} ${h}`, "aria-hidden": "true", children: /* @__PURE__ */ jsx("polyline", { points: pts.join(" "), fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) });
  }
  function MetricCard({ label, value, type = "trend", change, trend, caption, data, action, className, ...rest }) {
    const dir = trend != null ? trend : (change == null ? void 0 : change.trim().startsWith("-")) ? "down" : "up";
    return /* @__PURE__ */ jsxs("div", { className: cx("at-metric", className), ...rest, children: [
      /* @__PURE__ */ jsxs("div", { className: "at-metric__header", children: [
        /* @__PURE__ */ jsx("p", { className: "at-metric__label", children: label }),
        action
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "at-metric__row", children: [
        /* @__PURE__ */ jsxs("div", { className: "at-metric__main", children: [
          /* @__PURE__ */ jsx("p", { className: "at-metric__value", children: value }),
          type !== "simple" && change ? /* @__PURE__ */ jsxs("p", { className: "at-metric__trend", children: [
            /* @__PURE__ */ jsxs("span", { className: cx("at-metric__change", `at-metric__change--${dir}`), children: [
              /* @__PURE__ */ jsx(Icon, { name: dir === "down" ? "arrowDown" : "arrowUp", size: 16 }),
              change
            ] }),
            caption ? /* @__PURE__ */ jsx("span", { className: "at-metric__caption", children: caption }) : null
          ] }) : null
        ] }),
        type === "chart" && data && data.length > 1 ? /* @__PURE__ */ jsx(Sparkline, { data, trend: dir }) : null
      ] })
    ] });
  }

  // src/components/EmptyState.tsx
  function EmptyState({ title, description, icon, actions, size = "md", className, ...rest }) {
    return /* @__PURE__ */ jsxs("div", { className: cx("at-empty", `at-empty--${size}`, className), ...rest, children: [
      /* @__PURE__ */ jsx("span", { className: "at-empty__icon", "aria-hidden": "true", children: icon != null ? icon : /* @__PURE__ */ jsx(Icon, { name: "search", size: 24 }) }),
      /* @__PURE__ */ jsxs("div", { className: "at-empty__text", children: [
        /* @__PURE__ */ jsx("h3", { className: "at-empty__title", children: title }),
        description ? /* @__PURE__ */ jsx("p", { className: "at-empty__desc", children: description }) : null
      ] }),
      actions ? /* @__PURE__ */ jsx("div", { className: "at-empty__actions", children: actions }) : null
    ] });
  }

  // src/components/Menu.tsx
  var import_react6 = __toESM(require_react(), 1);
  function MenuItem({ label, icon, shortcut, size = "sm", selected, disabled, destructive, onSelect, role = "menuitem", id, active }) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        id,
        role,
        "aria-disabled": disabled || void 0,
        "aria-selected": role === "option" ? !!selected : void 0,
        tabIndex: -1,
        className: cx("at-menu-item", `at-menu-item--${size}`, selected && "is-selected", active && "is-active", destructive && "at-menu-item--destructive", disabled && "is-disabled"),
        onClick: () => {
          if (!disabled) onSelect == null ? void 0 : onSelect();
        },
        children: [
          icon ? /* @__PURE__ */ jsx("span", { className: "at-menu-item__icon", children: icon }) : null,
          /* @__PURE__ */ jsx("span", { className: "at-menu-item__label", children: label }),
          shortcut ? /* @__PURE__ */ jsx("kbd", { className: "at-menu-item__shortcut", children: shortcut }) : null,
          selected && role === "option" ? /* @__PURE__ */ jsx("svg", { className: "at-menu-item__check", width: "16", height: "16", viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 10.5l3.5 3.5L16 6" }) }) : null
        ]
      }
    );
  }
  function DropdownMenu({ trigger, items, align = "start", size = "sm", label, defaultOpen, className }) {
    const [open, setOpen] = (0, import_react6.useState)(!!defaultOpen);
    const [active, setActive] = (0, import_react6.useState)(-1);
    const wrap = (0, import_react6.useRef)(null);
    const menu = (0, import_react6.useRef)(null);
    const id = useFieldId();
    const actionable = items.map((it, i) => {
      var _a;
      return ((_a = it.type) != null ? _a : "item") === "item" && !it.disabled ? i : -1;
    }).filter((i) => i >= 0);
    const close = (0, import_react6.useCallback)(() => {
      setOpen(false);
      setActive(-1);
    }, []);
    useOutsideClick([wrap], close, open);
    const openMenu = (first = true) => {
      var _a, _b;
      setOpen(true);
      setActive(first ? (_a = actionable[0]) != null ? _a : -1 : (_b = actionable[actionable.length - 1]) != null ? _b : -1);
      requestAnimationFrame(() => {
        var _a2;
        return (_a2 = menu.current) == null ? void 0 : _a2.focus();
      });
    };
    const choose = (i) => {
      var _a;
      const it = items[i];
      close();
      (_a = it.onSelect) == null ? void 0 : _a.call(it);
    };
    const onKey = (e) => {
      if (!open) return;
      const pos = actionable.indexOf(active);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(actionable[(pos + 1) % actionable.length]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(actionable[(pos - 1 + actionable.length) % actionable.length]);
      } else if (e.key === "Home") {
        e.preventDefault();
        setActive(actionable[0]);
      } else if (e.key === "End") {
        e.preventDefault();
        setActive(actionable[actionable.length - 1]);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (active >= 0) choose(active);
      } else if (e.key === "Escape" || e.key === "Tab") {
        close();
      }
    };
    const triggerEl = (0, import_react6.isValidElement)(trigger) ? (0, import_react6.cloneElement)(trigger, {
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-controls": open ? `${id}-menu` : void 0,
      onClick: () => open ? close() : openMenu(),
      onKeyDown: (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          openMenu(true);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          openMenu(false);
        }
      }
    }) : trigger;
    return /* @__PURE__ */ jsxs("div", { ref: wrap, className: cx("at-dropdown", className), onKeyDown: onKey, children: [
      triggerEl,
      open ? /* @__PURE__ */ jsx(
        "div",
        {
          ref: menu,
          id: `${id}-menu`,
          role: "menu",
          "aria-label": label,
          tabIndex: -1,
          "aria-activedescendant": active >= 0 ? `${id}-i${active}` : void 0,
          className: cx("at-menu", `at-menu--${align}`),
          children: items.map((it, i) => {
            if (it.type === "separator") return /* @__PURE__ */ jsx("div", { role: "separator", className: "at-menu__sep" }, i);
            if (it.type === "heading") return /* @__PURE__ */ jsx("div", { role: "presentation", className: "at-menu__heading", children: it.label }, i);
            return /* @__PURE__ */ jsx(
              MenuItem,
              {
                id: `${id}-i${i}`,
                size,
                label: it.label,
                icon: it.icon,
                shortcut: it.shortcut,
                disabled: it.disabled,
                destructive: it.destructive,
                active: active === i,
                onSelect: () => choose(i)
              },
              i
            );
          })
        }
      ) : null
    ] });
  }

  // src/components/Select.tsx
  var import_react7 = __toESM(require_react(), 1);
  function Select({ options, value, defaultValue, onChange, label, hint, error, placeholder = "Select an option", size = "md", disabled, name, id, defaultOpen, className }) {
    const fieldId = useFieldId(id);
    const controlled = value !== void 0;
    const [inner, setInner] = (0, import_react7.useState)(defaultValue);
    const current = controlled ? value : inner;
    const [open, setOpen] = (0, import_react7.useState)(!!defaultOpen);
    const [active, setActive] = (0, import_react7.useState)(-1);
    const wrap = (0, import_react7.useRef)(null);
    const typed = (0, import_react7.useRef)({ text: "", at: 0 });
    const selected = options.find((o) => o.value === current);
    const enabled = options.map((o, i) => o.disabled ? -1 : i).filter((i) => i >= 0);
    const message = error || hint;
    const close = (0, import_react7.useCallback)(() => setOpen(false), []);
    useOutsideClick([wrap], close, open);
    const pick = (i) => {
      const o = options[i];
      if (!o || o.disabled) return;
      if (!controlled) setInner(o.value);
      onChange == null ? void 0 : onChange(o.value);
      setOpen(false);
    };
    const show = (start) => {
      var _a;
      if (disabled) return;
      const sel = options.findIndex((o) => o.value === current);
      setActive(start != null ? start : sel >= 0 ? sel : (_a = enabled[0]) != null ? _a : -1);
      setOpen(true);
    };
    const onKey = (e) => {
      const pos = enabled.indexOf(active);
      if (!open) {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
          e.preventDefault();
          show();
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(enabled[Math.min(pos + 1, enabled.length - 1)]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(enabled[Math.max(pos - 1, 0)]);
      } else if (e.key === "Home") {
        e.preventDefault();
        setActive(enabled[0]);
      } else if (e.key === "End") {
        e.preventDefault();
        setActive(enabled[enabled.length - 1]);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick(active);
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        close();
      } else if (e.key.length === 1) {
        const now = Date.now();
        typed.current.text = (now - typed.current.at > 600 ? "" : typed.current.text) + e.key.toLowerCase();
        typed.current.at = now;
        const hit = enabled.find((i) => options[i].label.toLowerCase().startsWith(typed.current.text));
        if (hit !== void 0) setActive(hit);
      }
    };
    return /* @__PURE__ */ jsxs("div", { ref: wrap, className: cx("at-field", "at-select", className), children: [
      label ? /* @__PURE__ */ jsx("span", { id: `${fieldId}-label`, className: "at-field__label", children: label }) : null,
      /* @__PURE__ */ jsxs("div", { className: "at-anchor", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            id: fieldId,
            role: "combobox",
            "aria-haspopup": "listbox",
            "aria-expanded": open,
            "aria-controls": `${fieldId}-list`,
            "aria-labelledby": label ? `${fieldId}-label ${fieldId}` : void 0,
            "aria-activedescendant": open && active >= 0 ? `${fieldId}-o${active}` : void 0,
            "aria-invalid": error ? true : void 0,
            "aria-describedby": message ? `${fieldId}-msg` : void 0,
            disabled,
            className: cx("at-input", `at-input--${size}`, "at-select__trigger", error && "at-input--error", disabled && "at-input--disabled", open && "is-open"),
            onClick: () => open ? close() : show(),
            onKeyDown: onKey,
            children: [
              selected == null ? void 0 : selected.icon,
              /* @__PURE__ */ jsx("span", { className: cx("at-select__value", !selected && "is-placeholder"), children: selected ? selected.label : placeholder }),
              /* @__PURE__ */ jsx(Icon, { name: "chevronDown", size: 20, className: "at-select__chevron" })
            ]
          }
        ),
        open ? /* @__PURE__ */ jsx("div", { id: `${fieldId}-list`, role: "listbox", "aria-labelledby": label ? `${fieldId}-label` : void 0, className: "at-menu at-menu--start at-select__list", children: options.map((o, i) => /* @__PURE__ */ jsx(
          MenuItem,
          {
            id: `${fieldId}-o${i}`,
            role: "option",
            label: o.label,
            icon: o.icon,
            disabled: o.disabled,
            selected: o.value === current,
            active: i === active,
            onSelect: () => pick(i)
          },
          o.value
        )) }) : null
      ] }),
      name ? /* @__PURE__ */ jsx("input", { type: "hidden", name, value: current != null ? current : "" }) : null,
      message ? /* @__PURE__ */ jsx("p", { id: `${fieldId}-msg`, className: cx("at-field__hint", error && "at-field__hint--error"), children: message }) : null
    ] });
  }

  // src/components/Modal.tsx
  var import_react8 = __toESM(require_react(), 1);
  function Modal({ open, onClose, title, description, children, actions, featuredIcon, closeButton = true, size = "md", type = "default", className }) {
    const ref = (0, import_react8.useRef)(null);
    const id = useFieldId();
    (0, import_react8.useEffect)(() => {
      const d = ref.current;
      if (!d) return;
      if (open && !d.open) d.showModal();
      if (!open && d.open) d.close();
    }, [open]);
    const icon = featuredIcon === true ? /* @__PURE__ */ jsx(Icon, { name: type === "destructive" ? "alert" : "info", size: 24 }) : featuredIcon || null;
    return /* @__PURE__ */ jsx(
      "dialog",
      {
        ref,
        className: cx("at-modal", `at-modal--${size}`, `at-modal--${type}`, className),
        "aria-labelledby": `${id}-title`,
        "aria-describedby": description ? `${id}-desc` : void 0,
        onClose,
        onCancel: (e) => {
          e.preventDefault();
          onClose();
        },
        onClick: (e) => {
          if (e.target === ref.current) onClose();
        },
        children: /* @__PURE__ */ jsxs("div", { className: "at-modal__panel", children: [
          /* @__PURE__ */ jsxs("header", { className: "at-modal__header", children: [
            icon ? /* @__PURE__ */ jsx("span", { className: "at-modal__icon", "aria-hidden": "true", children: icon }) : null,
            /* @__PURE__ */ jsxs("div", { className: "at-modal__heading", children: [
              /* @__PURE__ */ jsx("h2", { id: `${id}-title`, className: "at-modal__title", children: title }),
              description ? /* @__PURE__ */ jsx("p", { id: `${id}-desc`, className: "at-modal__desc", children: description }) : null
            ] }),
            closeButton ? /* @__PURE__ */ jsx("button", { type: "button", className: "at-modal__close", "aria-label": "Close", onClick: onClose, children: /* @__PURE__ */ jsx(Icon, { name: "x", size: 20 }) }) : null
          ] }),
          children ? /* @__PURE__ */ jsx("div", { className: "at-modal__content", children }) : null,
          actions ? /* @__PURE__ */ jsx("footer", { className: "at-modal__actions", children: actions }) : null
        ] })
      }
    );
  }

  // src/components/Toast.tsx
  var import_react9 = __toESM(require_react(), 1);
  var ICONS2 = { brand: "info", gray: "info", error: "alert", warning: "alert", success: "success" };
  function Toast({ title, description, color = "gray", onClose, action, className }) {
    return /* @__PURE__ */ jsxs("div", { className: cx("at-toast", `at-toast--${color}`, className), role: color === "error" ? "alert" : "status", children: [
      /* @__PURE__ */ jsx("span", { className: "at-toast__icon", children: /* @__PURE__ */ jsx(Icon, { name: ICONS2[color], size: 20 }) }),
      /* @__PURE__ */ jsxs("div", { className: "at-toast__body", children: [
        /* @__PURE__ */ jsx("p", { className: "at-toast__title", children: title }),
        description ? /* @__PURE__ */ jsx("p", { className: "at-toast__desc", children: description }) : null,
        action ? /* @__PURE__ */ jsx("div", { className: "at-toast__action", children: action }) : null
      ] }),
      onClose ? /* @__PURE__ */ jsx("button", { type: "button", className: "at-toast__close", "aria-label": "Dismiss", onClick: onClose, children: /* @__PURE__ */ jsx(Icon, { name: "x", size: 16 }) }) : null
    ] });
  }
  var Ctx = (0, import_react9.createContext)(null);
  function TimedToast({ id, t, dismiss }) {
    var _a;
    const ms = (_a = t.duration) != null ? _a : t.color === "error" ? 0 : 5e3;
    const timer = (0, import_react9.useRef)(void 0);
    const start = (0, import_react9.useCallback)(() => {
      if (ms > 0) timer.current = window.setTimeout(() => dismiss(id), ms);
    }, [ms, id, dismiss]);
    const stop = () => window.clearTimeout(timer.current);
    (0, import_react9.useEffect)(() => {
      start();
      return stop;
    }, [start]);
    return /* @__PURE__ */ jsx("div", { onMouseEnter: stop, onMouseLeave: start, onFocus: stop, onBlur: start, children: /* @__PURE__ */ jsx(Toast, { ...t, onClose: () => dismiss(id) }) });
  }
  function ToastProvider({ children, position = "bottom-right" }) {
    const [list, setList] = (0, import_react9.useState)([]);
    const n = (0, import_react9.useRef)(0);
    const dismiss = (0, import_react9.useCallback)((id) => setList((l) => l.filter((x) => x.id !== id)), []);
    const show = (0, import_react9.useCallback)((t) => {
      const id = `t${++n.current}`;
      setList((l) => [...l, { id, t }].slice(-4));
      return id;
    }, []);
    const value = (0, import_react9.useMemo)(() => ({ show, dismiss }), [show, dismiss]);
    return /* @__PURE__ */ jsxs(Ctx.Provider, { value, children: [
      children,
      /* @__PURE__ */ jsx("div", { className: cx("at-toaster", `at-toaster--${position}`), "aria-live": "polite", children: list.map(({ id, t }) => /* @__PURE__ */ jsx(TimedToast, { id, t, dismiss }, id)) })
    ] });
  }
  function useToast() {
    const c = (0, import_react9.useContext)(Ctx);
    if (!c) throw new Error("useToast must be used inside <ToastProvider>");
    return c;
  }

  // src/components/Table.tsx
  var import_react10 = __toESM(require_react(), 1);
  function Table({ columns, rows, rowKey, size = "sm", selectable, selected, onSelectedChange, caption, empty, className }) {
    const [sort, setSort] = (0, import_react10.useState)(null);
    const [innerSel, setInnerSel] = (0, import_react10.useState)([]);
    const sel = selected != null ? selected : innerSel;
    const setSel = (k) => {
      if (!selected) setInnerSel(k);
      onSelectedChange == null ? void 0 : onSelectedChange(k);
    };
    const sorted = (0, import_react10.useMemo)(() => {
      var _a;
      if (!sort) return rows;
      const col = columns.find((c) => c.key === sort.key);
      const get = (_a = col == null ? void 0 : col.sortValue) != null ? _a : (r) => r[sort.key];
      return [...rows].sort((a, b) => {
        const x = get(a), y = get(b);
        const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), void 0, { numeric: true });
        return sort.dir === "asc" ? r : -r;
      });
    }, [rows, sort, columns]);
    const allKeys = rows.map(rowKey);
    const all = allKeys.length > 0 && allKeys.every((k) => sel.includes(k));
    const some = !all && allKeys.some((k) => sel.includes(k));
    return /* @__PURE__ */ jsx("div", { className: cx("at-table-wrap", className), children: /* @__PURE__ */ jsxs("table", { className: cx("at-table", `at-table--${size}`), children: [
      caption ? /* @__PURE__ */ jsx("caption", { className: "at-table__caption", children: caption }) : null,
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        selectable ? /* @__PURE__ */ jsx("th", { className: "at-table__check", scope: "col", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            className: "at-checkbox",
            "aria-label": "Select all rows",
            checked: all,
            ref: (el) => {
              if (el) el.indeterminate = some;
            },
            onChange: () => setSel(all ? [] : allKeys)
          }
        ) }) : null,
        columns.map((c) => {
          const dir = (sort == null ? void 0 : sort.key) === c.key ? sort.dir : null;
          return /* @__PURE__ */ jsx("th", { scope: "col", style: { width: c.width }, className: cx(c.align === "end" && "is-end"), "aria-sort": dir === "asc" ? "ascending" : dir === "desc" ? "descending" : void 0, children: c.sortable ? /* @__PURE__ */ jsxs("button", { type: "button", className: "at-table__sort", onClick: () => setSort(dir === "asc" ? { key: c.key, dir: "desc" } : dir === "desc" ? null : { key: c.key, dir: "asc" }), children: [
            c.header,
            /* @__PURE__ */ jsx(Icon, { name: dir === "asc" ? "arrowUp" : dir === "desc" ? "arrowDown" : "sort", size: 12 })
          ] }) : c.header }, c.key);
        })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: sorted.length === 0 && empty ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { className: "at-table__empty", colSpan: columns.length + (selectable ? 1 : 0), children: empty }) }) : sorted.map((r) => {
        const k = rowKey(r);
        const on = sel.includes(k);
        return /* @__PURE__ */ jsxs("tr", { className: cx(on && "is-selected"), children: [
          selectable ? /* @__PURE__ */ jsx("td", { className: "at-table__check", children: /* @__PURE__ */ jsx("input", { type: "checkbox", className: "at-checkbox", "aria-label": `Select row ${k}`, checked: on, onChange: () => setSel(on ? sel.filter((x) => x !== k) : [...sel, k]) }) }) : null,
          columns.map((c, ci) => {
            var _a;
            return /* @__PURE__ */ jsx("td", { className: cx(c.align === "end" && "is-end", ci === 0 && "is-primary"), children: /* @__PURE__ */ jsxs("div", { className: "at-table__cell", children: [
              /* @__PURE__ */ jsx("span", { children: c.render ? c.render(r) : String((_a = r[c.key]) != null ? _a : "") }),
              c.supporting ? /* @__PURE__ */ jsx("span", { className: "at-table__supporting", children: c.supporting(r) }) : null
            ] }) }, c.key);
          })
        ] }, k);
      }) })
    ] }) });
  }

  // src/components/DatePicker.tsx
  var import_react11 = __toESM(require_react(), 1);
  var pad = (n) => String(n).padStart(2, "0");
  var iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  var parts = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return { y, m: m - 1, d };
  };
  var today = () => {
    const t = /* @__PURE__ */ new Date();
    return iso(t.getFullYear(), t.getMonth(), t.getDate());
  };
  var addDays = (s, n) => {
    const { y, m, d } = parts(s);
    const t = new Date(Date.UTC(y, m, d + n));
    return iso(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
  };
  function Calendar({ type = "single", value, range, onChange, onRangeChange, min, max, weekStartsOn = 1, locale, className }) {
    var _a;
    const anchor = (_a = type === "range" ? range == null ? void 0 : range.start : value) != null ? _a : today();
    const [view, setView] = (0, import_react11.useState)(() => {
      const p = parts(anchor);
      return { y: p.y, m: p.m };
    });
    const [focus, setFocus] = (0, import_react11.useState)(anchor);
    const grid = (0, import_react11.useRef)(null);
    const t = today();
    const days = (0, import_react11.useMemo)(() => {
      const first = new Date(Date.UTC(view.y, view.m, 1)).getUTCDay();
      const lead = (first - weekStartsOn + 7) % 7;
      const start = addDays(iso(view.y, view.m, 1), -lead);
      return Array.from({ length: 42 }, (_, i) => addDays(start, i));
    }, [view, weekStartsOn]);
    const weekdays = (0, import_react11.useMemo)(() => Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2024, 0, 1 + (i + weekStartsOn + 6) % 7)).toLocaleDateString(locale, { weekday: "short", timeZone: "UTC" }).slice(0, 2)), [weekStartsOn, locale]);
    const monthLabel = new Date(Date.UTC(view.y, view.m, 1)).toLocaleDateString(locale, { month: "long", year: "numeric", timeZone: "UTC" });
    const disabled = (d) => min !== void 0 && d < min || max !== void 0 && d > max;
    const pick = (d) => {
      if (disabled(d)) return;
      setFocus(d);
      if (type === "single") {
        onChange == null ? void 0 : onChange(d);
        return;
      }
      const r = range != null ? range : { start: null, end: null };
      if (!r.start || r.end) onRangeChange == null ? void 0 : onRangeChange({ start: d, end: null });
      else if (d < r.start) onRangeChange == null ? void 0 : onRangeChange({ start: d, end: r.start });
      else onRangeChange == null ? void 0 : onRangeChange({ start: r.start, end: d });
    };
    const move = (d) => {
      setFocus(d);
      const p = parts(d);
      if (p.y !== view.y || p.m !== view.m) setView({ y: p.y, m: p.m });
      requestAnimationFrame(() => {
        var _a2, _b;
        return (_b = (_a2 = grid.current) == null ? void 0 : _a2.querySelector(`[data-date="${d}"]`)) == null ? void 0 : _b.focus();
      });
    };
    const shiftMonth = (n) => {
      const dt = new Date(Date.UTC(view.y, view.m + n, 1));
      setView({ y: dt.getUTCFullYear(), m: dt.getUTCMonth() });
    };
    const onKey = (e) => {
      const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      if (map[e.key] !== void 0) {
        e.preventDefault();
        move(addDays(focus, map[e.key]));
      } else if (e.key === "PageUp" || e.key === "PageDown") {
        e.preventDefault();
        const p = parts(focus);
        const dt = new Date(Date.UTC(p.y, p.m + (e.key === "PageUp" ? -1 : 1), p.d));
        move(iso(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
      }
    };
    return /* @__PURE__ */ jsxs("div", { className: cx("at-calendar", className), children: [
      /* @__PURE__ */ jsxs("div", { className: "at-calendar__head", children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "at-calendar__nav", "aria-label": "Previous month", onClick: () => shiftMonth(-1), children: /* @__PURE__ */ jsx(Icon, { name: "chevronLeft", size: 20 }) }),
        /* @__PURE__ */ jsx("span", { className: "at-calendar__month", "aria-live": "polite", children: monthLabel }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "at-calendar__nav", "aria-label": "Next month", onClick: () => shiftMonth(1), children: /* @__PURE__ */ jsx(Icon, { name: "chevronRight", size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { ref: grid, role: "grid", "aria-label": monthLabel, className: "at-calendar__grid", onKeyDown: onKey, children: [
        /* @__PURE__ */ jsx("div", { role: "row", className: "at-calendar__row", children: weekdays.map((w, i) => /* @__PURE__ */ jsx("span", { role: "columnheader", className: "at-calendar__weekday", children: w }, i)) }),
        Array.from({ length: 6 }, (_, w) => /* @__PURE__ */ jsx("div", { role: "row", className: "at-calendar__row", children: days.slice(w * 7, w * 7 + 7).map((d) => {
          const p = parts(d);
          const outside = p.m !== view.m;
          const isSel = type === "single" ? d === value : d === (range == null ? void 0 : range.start) || d === (range == null ? void 0 : range.end);
          const inRange = type === "range" && !!(range == null ? void 0 : range.start) && !!(range == null ? void 0 : range.end) && d > range.start && d < range.end;
          return /* @__PURE__ */ jsx("span", { role: "gridcell", "aria-selected": isSel || void 0, children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "data-date": d,
              tabIndex: d === focus ? 0 : -1,
              disabled: disabled(d),
              "aria-current": d === t ? "date" : void 0,
              className: cx("at-day", outside && "is-outside", d === t && "is-today", isSel && "is-selected", inRange && "is-in-range"),
              onClick: () => pick(d),
              children: p.d
            }
          ) }, d);
        }) }, w))
      ] })
    ] });
  }
  function DatePicker({ label, hint, error, placeholder, size = "md", disabled, id, defaultOpen, className, ...cal }) {
    var _a;
    const fieldId = useFieldId(id);
    const [open, setOpen] = (0, import_react11.useState)(!!defaultOpen);
    const wrap = (0, import_react11.useRef)(null);
    const close = (0, import_react11.useCallback)(() => setOpen(false), []);
    useOutsideClick([wrap], close, open);
    const fmt = (d) => d ? (/* @__PURE__ */ new Date(`${d}T00:00:00Z`)).toLocaleDateString(cal.locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "";
    const text = cal.type === "range" ? ((_a = cal.range) == null ? void 0 : _a.start) ? `${fmt(cal.range.start)} – ${fmt(cal.range.end) || "…"}` : "" : fmt(cal.value);
    const message = error || hint;
    return /* @__PURE__ */ jsxs("div", { ref: wrap, className: cx("at-field", "at-datepicker", className), onKeyDown: (e) => {
      if (e.key === "Escape") close();
    }, children: [
      label ? /* @__PURE__ */ jsx("label", { htmlFor: fieldId, className: "at-field__label", children: label }) : null,
      /* @__PURE__ */ jsxs("div", { className: "at-anchor", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            id: fieldId,
            "aria-haspopup": "dialog",
            "aria-expanded": open,
            "aria-describedby": message ? `${fieldId}-msg` : void 0,
            disabled,
            className: cx("at-input", `at-input--${size}`, "at-select__trigger", error && "at-input--error", disabled && "at-input--disabled"),
            onClick: () => setOpen(!open),
            children: [
              /* @__PURE__ */ jsx(Icon, { name: "calendar", size: 20 }),
              /* @__PURE__ */ jsx("span", { className: cx("at-select__value", !text && "is-placeholder"), children: text || placeholder || (cal.type === "range" ? "Select dates" : "Select date") })
            ]
          }
        ),
        open ? /* @__PURE__ */ jsx("div", { role: "dialog", "aria-label": label != null ? label : "Choose date", className: "at-datepicker__pop", children: /* @__PURE__ */ jsx(
          Calendar,
          {
            ...cal,
            onChange: (d) => {
              var _a2;
              (_a2 = cal.onChange) == null ? void 0 : _a2.call(cal, d);
              close();
            },
            onRangeChange: (r) => {
              var _a2;
              (_a2 = cal.onRangeChange) == null ? void 0 : _a2.call(cal, r);
              if (r.start && r.end) close();
            }
          }
        ) }) : null
      ] }),
      message ? /* @__PURE__ */ jsx("p", { id: `${fieldId}-msg`, className: cx("at-field__hint", error && "at-field__hint--error"), children: message }) : null
    ] });
  }

  // src/components/Navigation.tsx
  function NavItem({ label, icon, badge, chevron, active, collapsed, className, ...rest }) {
    return /* @__PURE__ */ jsxs(
      "a",
      {
        className: cx("at-nav-item", active && "is-active", collapsed && "is-collapsed", className),
        "aria-current": active ? "page" : void 0,
        "aria-label": collapsed ? label : void 0,
        title: collapsed ? label : void 0,
        ...rest,
        children: [
          icon ? /* @__PURE__ */ jsx("span", { className: "at-nav-item__icon", children: icon }) : null,
          collapsed ? null : /* @__PURE__ */ jsx("span", { className: "at-nav-item__label", children: label }),
          !collapsed && badge != null ? /* @__PURE__ */ jsx("span", { className: "at-nav-item__badge", children: badge }) : null,
          !collapsed && chevron ? /* @__PURE__ */ jsx(Icon, { name: "chevronDown", size: 16, className: "at-nav-item__chevron" }) : null
        ]
      }
    );
  }
  function SidebarNavigation({ header, children, footer, collapsed, className, ...rest }) {
    var _a;
    return /* @__PURE__ */ jsxs("nav", { "aria-label": (_a = rest["aria-label"]) != null ? _a : "Main", className: cx("at-sidebar", collapsed && "is-collapsed", className), ...rest, children: [
      header ? /* @__PURE__ */ jsx("div", { className: "at-sidebar__header", children: header }) : null,
      /* @__PURE__ */ jsx("div", { className: "at-sidebar__items", children }),
      footer ? /* @__PURE__ */ jsx("div", { className: "at-sidebar__footer", children: footer }) : null
    ] });
  }
  function AppHeader({ brand, nav, actions, className, ...rest }) {
    return /* @__PURE__ */ jsxs("header", { className: cx("at-app-header", className), ...rest, children: [
      brand ? /* @__PURE__ */ jsx("div", { className: "at-app-header__brand", children: brand }) : null,
      nav ? /* @__PURE__ */ jsx("nav", { "aria-label": "Main", className: "at-app-header__nav", children: nav }) : null,
      actions ? /* @__PURE__ */ jsx("div", { className: "at-app-header__actions", children: actions }) : null
    ] });
  }
  return __toCommonJS(src_exports);
})();
window.Atomus = Object.assign(window.Atomus || {}, __atomus);
