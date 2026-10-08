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
    AILabel: () => AILabel,
    Alert: () => Alert,
    AppHeader: () => AppHeader,
    Approval: () => Approval,
    Avatar: () => Avatar,
    Badge: () => Badge,
    Button: () => Button,
    Calendar: () => Calendar,
    Card: () => Card,
    Checkbox: () => Checkbox,
    ContextMeter: () => ContextMeter,
    DatePicker: () => DatePicker,
    DropdownMenu: () => DropdownMenu,
    EmptyState: () => EmptyState,
    Feedback: () => Feedback,
    Icon: () => Icon,
    InlineCitation: () => InlineCitation,
    Input: () => Input,
    MenuItem: () => MenuItem,
    Message: () => Message,
    MetricCard: () => MetricCard,
    Modal: () => Modal,
    ModelSelector: () => ModelSelector,
    NavItem: () => NavItem,
    ProgressBar: () => ProgressBar,
    PromptInput: () => PromptInput,
    Radio: () => Radio,
    Reasoning: () => Reasoning,
    Select: () => Select,
    Shimmer: () => Shimmer,
    SidebarNavigation: () => SidebarNavigation,
    Sources: () => Sources,
    StreamingText: () => StreamingText,
    Suggestions: () => Suggestions,
    Table: () => Table,
    Tabs: () => Tabs,
    Tag: () => Tag,
    Toast: () => Toast,
    ToastProvider: () => ToastProvider,
    Toggle: () => Toggle,
    ToolCall: () => ToolCall,
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
    more: "M10 5.5v.01M10 10v.01M10 14.5v.01",
    sparkle: "M9 2.5l1.4 3.9a2 2 0 001.2 1.2L15.5 9l-3.9 1.4a2 2 0 00-1.2 1.2L9 15.5l-1.4-3.9a2 2 0 00-1.2-1.2L2.5 9l3.9-1.4a2 2 0 001.2-1.2L9 2.5zM15.5 13v4M13.5 15h4",
    copy: "M7 7V4.5A1.5 1.5 0 018.5 3h7A1.5 1.5 0 0117 4.5v7a1.5 1.5 0 01-1.5 1.5H13M4.5 7h7A1.5 1.5 0 0113 8.5v7a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 15.5v-7A1.5 1.5 0 014.5 7z",
    refresh: "M16.5 10a6.5 6.5 0 11-1.9-4.6M16.5 3.5V7H13",
    edit: "M11.5 5l3.5 3.5M3.5 16.5l.8-3.6 9.3-9.3a1.4 1.4 0 012 0l.8.8a1.4 1.4 0 010 2l-9.3 9.3-3.6.8z",
    thumbUp: "M6.5 9v8M6.5 9l3-5.5a1.6 1.6 0 013 .9L12 8h3.8a1.5 1.5 0 011.5 1.8l-1.1 5.9a1.5 1.5 0 01-1.5 1.3H6.5M6.5 9H3.5v8h3",
    thumbDown: "M13.5 11V3M13.5 11l-3 5.5a1.6 1.6 0 01-3-.9L8 12H4.2a1.5 1.5 0 01-1.5-1.8l1.1-5.9A1.5 1.5 0 015.3 3h8.2M13.5 11h3V3h-3",
    stop: "M6.5 5h7A1.5 1.5 0 0115 6.5v7a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 015 13.5v-7A1.5 1.5 0 016.5 5z",
    paperclip: "M15.5 9.5l-5.8 5.8a3.5 3.5 0 01-5-5l6.4-6.4a2.3 2.3 0 013.3 3.3l-6.4 6.4a1.2 1.2 0 01-1.7-1.7l5.8-5.8",
    tool: "M12.3 3.2a4 4 0 00-4.9 5.3l-4.3 4.3a1.6 1.6 0 002.3 2.3l4.3-4.3a4 4 0 005.3-4.9l-2.5 2.5-2.2-.5-.5-2.2 2.5-2.5z",
    shield: "M10 2.5l6 2.2v4.6c0 3.9-2.6 6.6-6 8.2-3.4-1.6-6-4.3-6-8.2V4.7l6-2.2z",
    clock: "M10 6v4l2.5 2M10 18a8 8 0 100-16 8 8 0 000 16z",
    globe: "M10 18a8 8 0 100-16 8 8 0 000 16zM2 10h16M10 2c2.1 2.3 3.2 5 3.2 8s-1.1 5.7-3.2 8c-2.1-2.3-3.2-5-3.2-8s1.1-5.7 3.2-8z",
    file: "M11.5 2.5H6A1.5 1.5 0 004.5 4v12A1.5 1.5 0 006 17.5h8a1.5 1.5 0 001.5-1.5V6.5l-4-4zM11.5 2.5v4h4",
    external: "M11 3.5h5.5V9M16.5 3.5L9 11M14.5 12v3a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 15V7A1.5 1.5 0 015 5.5h3",
    undo: "M7.5 4.5L4 8l3.5 3.5M4 8h8a4.5 4.5 0 010 9H9",
    lightbulb: "M7.5 15h5M8.5 17.5h3M10 2.5a5 5 0 00-3 9c.6.5 1 1.2 1 2v.5h4v-.5c0-.8.4-1.5 1-2a5 5 0 00-3-9z",
    code: "M7 6l-4 4 4 4M13 6l4 4-4 4"
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
  var ALIASES = { info: "brand", neutral: "gray", danger: "error" };
  var ICONS = { brand: "info", gray: "info", error: "alert", warning: "alert", success: "success" };
  function Alert({ title, children, color = "brand", variant = "subtle", size = "md", flush = false, actions, onClose, icon, className, ...rest }) {
    var _a;
    const tone = (_a = ALIASES[color]) != null ? _a : color;
    const iconSize = size === "sm" ? 16 : 20;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        role: tone === "error" ? "alert" : "status",
        className: cx("at-alert", `at-alert--${variant}`, `at-alert--${tone}`, size === "sm" && "at-alert--sm", flush && "at-alert--flush", className),
        ...rest,
        children: [
          /* @__PURE__ */ jsx("span", { className: "at-alert__icon", "aria-hidden": "true", children: icon != null ? icon : /* @__PURE__ */ jsx(Icon, { name: ICONS[tone], size: iconSize }) }),
          /* @__PURE__ */ jsxs("div", { className: "at-alert__body", children: [
            title ? /* @__PURE__ */ jsx("div", { className: "at-alert__title", children: title }) : null,
            children ? /* @__PURE__ */ jsx("div", { className: "at-alert__text", children }) : null,
            actions ? /* @__PURE__ */ jsx("div", { className: "at-alert__actions", children: actions }) : null
          ] }),
          onClose ? /* @__PURE__ */ jsx("button", { type: "button", className: "at-alert__close", "aria-label": "Dismiss", onClick: onClose, children: /* @__PURE__ */ jsx(Icon, { name: "x", size: iconSize }) }) : null
        ]
      }
    );
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
    const pad2 = 3;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const pts = data.map((d, i) => [pad2 + i / Math.max(1, data.length - 1) * (w - pad2 * 2), h - pad2 - (d - min) / span * (h - pad2 * 2)]);
    const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `M${pts[0][0].toFixed(1)},${h} L${line.replace(/ /g, " L")} L${pts[pts.length - 1][0].toFixed(1)},${h} Z`;
    return /* @__PURE__ */ jsxs("svg", { className: cx("at-metric__chart", `at-metric__chart--${trend}`), viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none", "aria-hidden": "true", focusable: "false", children: [
      /* @__PURE__ */ jsx("path", { className: "at-metric__chart-area", d: area }),
      /* @__PURE__ */ jsx("polyline", { points: line, fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" })
    ] });
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
    const show2 = (start) => {
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
          show2();
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
            onClick: () => open ? close() : show2(),
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
    const show2 = (0, import_react9.useCallback)((t) => {
      const id = `t${++n.current}`;
      setList((l) => [...l, { id, t }].slice(-4));
      return id;
    }, []);
    const value = (0, import_react9.useMemo)(() => ({ show: show2, dismiss }), [show2, dismiss]);
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
    const fmt2 = (d) => d ? (/* @__PURE__ */ new Date(`${d}T00:00:00Z`)).toLocaleDateString(cal.locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "";
    const text = cal.type === "range" ? ((_a = cal.range) == null ? void 0 : _a.start) ? `${fmt2(cal.range.start)} – ${fmt2(cal.range.end) || "…"}` : "" : fmt2(cal.value);
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

  // src/components/ai/PromptInput.tsx
  var import_react13 = __toESM(require_react(), 1);

  // src/components/ai/internal.tsx
  var import_react12 = __toESM(require_react(), 1);
  function useControllable(value, defaultValue, onChange) {
    const [inner, setInner] = (0, import_react12.useState)(defaultValue);
    const controlled = value !== void 0;
    const current = controlled ? value : inner;
    const set = (0, import_react12.useCallback)((v) => {
      if (!controlled) setInner(v);
      onChange == null ? void 0 : onChange(v);
    }, [controlled, onChange]);
    return [current, set];
  }
  function useDismiss(open, close, refs, trigger) {
    (0, import_react12.useEffect)(() => {
      if (!open) return;
      const onKey = (e) => {
        var _a;
        if (e.key !== "Escape") return;
        e.stopPropagation();
        close();
        (_a = trigger == null ? void 0 : trigger.current) == null ? void 0 : _a.focus();
      };
      const onDown = (e) => {
        const t = e.target;
        if (refs.every((r) => !r.current || !r.current.contains(t))) close();
      };
      document.addEventListener("keydown", onKey);
      document.addEventListener("pointerdown", onDown);
      return () => {
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("pointerdown", onDown);
      };
    }, [open, close, refs, trigger]);
  }
  function formatDuration(value, unit = "s") {
    const ms = unit === "ms" ? value : value * 1e3;
    if (ms < 1e3) return `${Math.round(ms)}ms`;
    const s = ms / 1e3;
    if (s < 10) return `${s.toFixed(1).replace(/\.0$/, "")}s`;
    if (s < 60) return `${Math.round(s)}s`;
    const m = Math.floor(s / 60);
    return `${m}m ${String(Math.round(s % 60)).padStart(2, "0")}s`;
  }
  function AIMark({ size = 16, className }) {
    return /* @__PURE__ */ jsx("span", { className: cx("at-ai-mark", className), style: { width: size, height: size }, "aria-hidden": "true" });
  }
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  // src/components/ai/PromptInput.tsx
  var escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function PromptInput({ value, defaultValue = "", onChange, onSubmit, onStop, status = "ready", placeholder = "Ask anything…", label = "Message", attachments = [], onAttach, onRemoveAttachment, toolbar, actions, triggers = [], disclaimer, minRows = 1, maxRows = 8, size = "md", disabled, autoFocus, submitLabel = "Send message", stopLabel = "Stop generating", clearOnSubmit = true, className }) {
    var _a;
    const id = useFieldId();
    const [text, setText] = useControllable(value, defaultValue, onChange);
    const area = (0, import_react13.useRef)(null);
    const [menu, setMenu] = (0, import_react13.useState)(null);
    const [active, setActive] = (0, import_react13.useState)(0);
    const busy = status === "submitted" || status === "streaming";
    const canSend = !disabled && !busy && (text.trim().length > 0 || attachments.length > 0) && !attachments.some((a) => a.status === "uploading");
    (0, import_react13.useLayoutEffect)(() => {
      const el = area.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight) || 24;
      const pad2 = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      el.style.height = "auto";
      const max = lh * maxRows + pad2;
      const min = lh * minRows + pad2;
      el.style.height = `${Math.max(min, Math.min(el.scrollHeight, max))}px`;
      el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
    }, [text, minRows, maxRows]);
    const matches = (0, import_react13.useMemo)(() => {
      if (!menu) return [];
      const q = menu.query.toLowerCase();
      return menu.trigger.items.filter((it) => !q || it.value.toLowerCase().includes(q) || it.label.toLowerCase().includes(q));
    }, [menu]);
    (0, import_react13.useEffect)(() => setActive(0), [menu == null ? void 0 : menu.query, menu == null ? void 0 : menu.trigger]);
    const findMenu = (t, caret) => {
      if (!triggers.length) return null;
      const before = t.slice(0, caret);
      const chars = triggers.map((tr) => escapeRe(tr.char)).join("|");
      const m = before.match(new RegExp(`(^|\\s)(${chars})([^\\s]*)$`));
      if (!m) return null;
      const trigger = triggers.find((tr) => tr.char === m[2]);
      return trigger ? { trigger, start: before.length - m[3].length - m[2].length, query: m[3] } : null;
    };
    const update = (t, caret) => {
      setText(t);
      setMenu(findMenu(t, caret));
    };
    const choose = (item) => {
      var _a2, _b, _c;
      if (!menu || !area.current) return;
      const caret = area.current.selectionStart;
      const ins = ((_a2 = item.insert) != null ? _a2 : `${menu.trigger.char}${item.value}`) + " ";
      const next = text.slice(0, menu.start) + ins + text.slice(caret);
      setText(next);
      setMenu(null);
      (_c = (_b = menu.trigger).onSelect) == null ? void 0 : _c.call(_b, item);
      const pos = menu.start + ins.length;
      requestAnimationFrame(() => {
        var _a3, _b2;
        (_a3 = area.current) == null ? void 0 : _a3.focus();
        (_b2 = area.current) == null ? void 0 : _b2.setSelectionRange(pos, pos);
      });
    };
    const submit = (e) => {
      e == null ? void 0 : e.preventDefault();
      if (busy) {
        onStop == null ? void 0 : onStop();
        return;
      }
      if (!canSend) return;
      onSubmit == null ? void 0 : onSubmit(text.trim(), attachments);
      if (clearOnSubmit && value === void 0) setText("");
      setMenu(null);
    };
    const onKeyDown = (e) => {
      if (menu && matches.length) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActive((active + 1) % matches.length);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActive((active - 1 + matches.length) % matches.length);
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          choose(matches[active]);
          return;
        }
      }
      if (menu && e.key === "Escape") {
        e.preventDefault();
        setMenu(null);
        return;
      }
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        if (!busy) submit();
      }
    };
    const menuOpen = !!menu && matches.length > 0;
    const listId = `${id}-menu`;
    return /* @__PURE__ */ jsxs("form", { className: cx("at-prompt-wrap", className), onSubmit: submit, children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: cx("at-prompt", `at-prompt--${size}`, busy && "is-busy", disabled && "is-disabled", status === "error" && "is-error"),
          onClick: (e) => {
            var _a2;
            if (e.target === e.currentTarget) (_a2 = area.current) == null ? void 0 : _a2.focus();
          },
          children: [
            attachments.length ? /* @__PURE__ */ jsx("ul", { className: "at-prompt__files", "aria-label": "Attachments", children: attachments.map((a) => /* @__PURE__ */ jsxs("li", { className: cx("at-prompt__file", a.status === "error" && "is-error"), children: [
              /* @__PURE__ */ jsx("span", { className: "at-prompt__file-thumb", "aria-hidden": "true", children: a.status === "uploading" ? /* @__PURE__ */ jsx("span", { className: "at-spinner" }) : a.kind === "image" && a.previewUrl ? /* @__PURE__ */ jsx("img", { src: a.previewUrl, alt: "" }) : /* @__PURE__ */ jsx(Icon, { name: "file", size: 16 }) }),
              /* @__PURE__ */ jsxs("span", { className: "at-prompt__file-text", children: [
                /* @__PURE__ */ jsx("span", { className: "at-prompt__file-name", children: a.name }),
                a.size || a.status === "uploading" || a.status === "error" ? /* @__PURE__ */ jsx("span", { className: "at-prompt__file-meta", children: a.status === "uploading" ? "Uploading…" : a.status === "error" ? "Upload failed" : a.size }) : null
              ] }),
              onRemoveAttachment ? /* @__PURE__ */ jsx("button", { type: "button", className: "at-prompt__file-x", "aria-label": `Remove ${a.name}`, onClick: () => onRemoveAttachment(a.id), children: /* @__PURE__ */ jsx(Icon, { name: "x", size: 14 }) }) : null
            ] }, a.id)) }) : null,
            /* @__PURE__ */ jsx("label", { htmlFor: id, className: "at-vh", children: label }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                ref: area,
                id,
                className: "at-prompt__textarea",
                value: text,
                rows: minRows,
                placeholder,
                disabled,
                autoFocus,
                "aria-describedby": disclaimer ? `${id}-disc` : void 0,
                "aria-autocomplete": triggers.length ? "list" : void 0,
                "aria-controls": menuOpen ? listId : void 0,
                "aria-activedescendant": menuOpen ? `${listId}-${active}` : void 0,
                onChange: (e) => update(e.target.value, e.target.selectionStart),
                onKeyDown,
                onClick: (e) => setMenu(findMenu(text, e.currentTarget.selectionStart)),
                onBlur: () => setMenu(null)
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "at-prompt__bar", children: [
              /* @__PURE__ */ jsxs("div", { className: "at-prompt__tools", children: [
                onAttach ? /* @__PURE__ */ jsx(Button, { size: "sm", hierarchy: "tertiary", iconOnly: true, "aria-label": "Attach files", title: "Attach files", disabled, iconLeading: /* @__PURE__ */ jsx(Icon, { name: "paperclip", size: 18 }), onClick: onAttach }) : null,
                toolbar
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "at-prompt__actions", children: [
                actions,
                busy ? /* @__PURE__ */ jsx("button", { type: "submit", className: "at-prompt__send at-prompt__send--stop", "aria-label": stopLabel, title: stopLabel, disabled: !onStop, children: /* @__PURE__ */ jsx("span", { className: "at-prompt__stop", "aria-hidden": "true" }) }) : /* @__PURE__ */ jsx("button", { type: "submit", className: "at-prompt__send", "aria-label": submitLabel, title: submitLabel, disabled: !canSend, children: /* @__PURE__ */ jsx(Icon, { name: "arrowUp", size: 18 }) })
              ] })
            ] }),
            menuOpen ? /* @__PURE__ */ jsx("div", { id: listId, role: "listbox", "aria-label": (_a = menu.trigger.label) != null ? _a : menu.trigger.char === "@" ? "Mentions" : "Commands", className: "at-menu at-prompt__menu", children: matches.map((it, i) => {
              var _a2;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  id: `${listId}-${i}`,
                  role: "option",
                  "aria-selected": i === active,
                  className: cx("at-menu-item", "at-menu-item--sm", "at-prompt__option", i === active && "is-active"),
                  onMouseDown: (e) => e.preventDefault(),
                  onMouseMove: () => setActive(i),
                  onClick: () => choose(it),
                  children: [
                    it.icon ? /* @__PURE__ */ jsx("span", { className: "at-menu-item__icon", children: it.icon }) : null,
                    /* @__PURE__ */ jsxs("span", { className: "at-prompt__option-text", children: [
                      /* @__PURE__ */ jsx("span", { className: "at-prompt__option-label", children: it.label }),
                      it.description ? /* @__PURE__ */ jsx("span", { className: "at-prompt__option-desc", children: it.description }) : null
                    ] }),
                    /* @__PURE__ */ jsx("kbd", { className: "at-menu-item__shortcut", children: (_a2 = it.insert) != null ? _a2 : `${menu.trigger.char}${it.value}` })
                  ]
                },
                it.value
              );
            }) }) : null
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "at-vh", role: "status", "aria-live": "polite", children: menuOpen ? `${matches.length} ${matches.length === 1 ? "suggestion" : "suggestions"}. Use up and down arrows to choose, Enter to insert.` : busy ? "Generating response" : "" }),
      disclaimer ? /* @__PURE__ */ jsx("p", { id: `${id}-disc`, className: "at-prompt__disclaimer", children: disclaimer }) : null
    ] });
  }

  // src/components/ai/Message.tsx
  var import_react15 = __toESM(require_react(), 1);

  // src/components/ai/AILabel.tsx
  var import_react14 = __toESM(require_react(), 1);
  function AILabel({ label = "AI", size = "sm", variant = "chip", explanation, explanationTitle = "About this AI content", model, edited = false, onRevert, align = "start", defaultOpen, className }) {
    const [open, setOpen] = (0, import_react14.useState)(!!defaultOpen);
    const id = useFieldId();
    const wrap = (0, import_react14.useRef)(null);
    const trigger = (0, import_react14.useRef)(null);
    const close = (0, import_react14.useCallback)(() => setOpen(false), []);
    useDismiss(open, close, [wrap], trigger);
    const text = edited ? "Edited" : label;
    const iconSize = size === "md" ? 16 : size === "sm" ? 14 : 12;
    const classes = cx("at-ai-label", `at-ai-label--${size}`, `at-ai-label--${variant}`, edited && "is-edited");
    const content = /* @__PURE__ */ jsxs(Fragment, { children: [
      edited ? /* @__PURE__ */ jsx(Icon, { name: "edit", size: iconSize, className: "at-ai-label__edited" }) : /* @__PURE__ */ jsx(AIMark, { size: iconSize }),
      variant === "icon" ? /* @__PURE__ */ jsx("span", { className: "at-vh", children: text }) : /* @__PURE__ */ jsx("span", { className: "at-ai-label__text", children: text })
    ] });
    const hasPopover = !!(explanation || model || edited && onRevert);
    if (!hasPopover) {
      return /* @__PURE__ */ jsx("span", { className: cx(classes, className), title: variant === "icon" ? text : void 0, children: content });
    }
    return /* @__PURE__ */ jsxs("span", { ref: wrap, className: cx("at-ai-label-wrap", className), children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          ref: trigger,
          type: "button",
          className: classes,
          "aria-expanded": open,
          "aria-controls": `${id}-pop`,
          "aria-label": `${text}: ${explanationTitle}`,
          onClick: () => setOpen(!open),
          children: [
            content,
            /* @__PURE__ */ jsx(Icon, { name: "chevronDown", size: iconSize, className: "at-ai-label__chev" })
          ]
        }
      ),
      open ? /* @__PURE__ */ jsxs("div", { id: `${id}-pop`, role: "dialog", "aria-labelledby": `${id}-title`, className: cx("at-ai-pop", `at-ai-pop--${align}`), children: [
        /* @__PURE__ */ jsxs("div", { className: "at-ai-pop__head", children: [
          /* @__PURE__ */ jsx(AIMark, { size: 18 }),
          /* @__PURE__ */ jsx("p", { id: `${id}-title`, className: "at-ai-pop__title", children: explanationTitle })
        ] }),
        explanation ? /* @__PURE__ */ jsx("div", { className: "at-ai-pop__body", children: explanation }) : null,
        model || edited && onRevert ? /* @__PURE__ */ jsxs("div", { className: "at-ai-pop__foot", children: [
          model ? /* @__PURE__ */ jsxs("span", { className: "at-ai-pop__model", children: [
            "Generated by ",
            /* @__PURE__ */ jsx("strong", { children: model })
          ] }) : /* @__PURE__ */ jsx("span", {}),
          edited && onRevert ? /* @__PURE__ */ jsx(Button, { hierarchy: "outline", size: "xs", iconLeading: /* @__PURE__ */ jsx(Icon, { name: "undo", size: 14 }), onClick: () => {
            var _a;
            onRevert();
            setOpen(false);
            (_a = trigger.current) == null ? void 0 : _a.focus();
          }, children: "Revert to AI" }) : null
        ] }) : null
      ] }) : null
    ] });
  }

  // src/components/ai/Message.tsx
  var DEFAULT_NAME = { user: "You", assistant: "Assistant", system: "System", tool: "Tool" };
  function Message({ role = "assistant", status = "done", name, avatar, showName, aiLabel = true, time, dateTime, children, copyText: text, onRegenerate, onEdit, branch, actions, actionsVisibility = "always", errorMessage = "Something went wrong while generating this response.", className, ...rest }) {
    const id = useFieldId();
    const [copied, setCopied] = (0, import_react15.useState)(false);
    const speaker = name != null ? name : DEFAULT_NAME[role];
    const nameVisible = showName != null ? showName : role !== "user";
    const streaming = status === "streaming";
    if (role === "system") {
      return /* @__PURE__ */ jsxs("article", { className: cx("at-msg", "at-msg--system", className), "aria-labelledby": `${id}-who`, ...rest, children: [
        /* @__PURE__ */ jsx("span", { id: `${id}-who`, className: "at-vh", children: speaker }),
        /* @__PURE__ */ jsx("div", { className: "at-msg__system", children: /* @__PURE__ */ jsx("span", { className: "at-msg__system-text", children }) })
      ] });
    }
    const copy = async () => {
      if (!text) return;
      if (await copyText(text)) {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2e3);
      }
    };
    const hasActions = !streaming && (text || onRegenerate || onEdit || branch || actions);
    return /* @__PURE__ */ jsxs(
      "article",
      {
        className: cx("at-msg", `at-msg--${role}`, `is-${status}`, actionsVisibility === "hover" && "at-msg--hover-actions", className),
        "aria-labelledby": `${id}-who`,
        "aria-busy": streaming || void 0,
        ...rest,
        children: [
          role !== "user" ? /* @__PURE__ */ jsx("div", { className: "at-msg__avatar", "aria-hidden": "true", children: avatar != null ? avatar : role === "assistant" ? /* @__PURE__ */ jsx("span", { className: "at-msg__ai-avatar", children: /* @__PURE__ */ jsx(AIMark, { size: 18 }) }) : /* @__PURE__ */ jsx("span", { className: "at-msg__tool-avatar", children: /* @__PURE__ */ jsx(Icon, { name: "tool", size: 16 }) }) }) : null,
          /* @__PURE__ */ jsxs("div", { className: "at-msg__main", children: [
            /* @__PURE__ */ jsxs("div", { className: cx("at-msg__header", !nameVisible && !time && "at-vh"), children: [
              /* @__PURE__ */ jsx("span", { id: `${id}-who`, className: cx("at-msg__name", !nameVisible && "at-vh"), children: speaker }),
              role === "assistant" && aiLabel && nameVisible ? /* @__PURE__ */ jsx(AILabel, { size: "xs" }) : null,
              time ? /* @__PURE__ */ jsx("time", { className: "at-msg__time", dateTime, children: time }) : null
            ] }),
            /* @__PURE__ */ jsx("div", { className: "at-msg__content", children }),
            status === "error" ? /* @__PURE__ */ jsxs("div", { className: "at-msg__notice at-msg__notice--error", role: "alert", children: [
              /* @__PURE__ */ jsx(Icon, { name: "alert", size: 16 }),
              /* @__PURE__ */ jsx("span", { children: errorMessage }),
              onRegenerate ? /* @__PURE__ */ jsx(Button, { size: "xs", hierarchy: "outline", iconLeading: /* @__PURE__ */ jsx(Icon, { name: "refresh", size: 14 }), onClick: onRegenerate, children: "Retry" }) : null
            ] }) : null,
            status === "stopped" ? /* @__PURE__ */ jsxs("div", { className: "at-msg__notice", children: [
              /* @__PURE__ */ jsx(Icon, { name: "stop", size: 14 }),
              /* @__PURE__ */ jsx("span", { children: "You stopped this response." })
            ] }) : null,
            hasActions ? /* @__PURE__ */ jsxs("div", { className: "at-msg__actions", role: "group", "aria-label": `Actions for ${speaker}'s message`, children: [
              branch && branch.count > 1 ? /* @__PURE__ */ jsxs("div", { className: "at-msg__branch", children: [
                /* @__PURE__ */ jsx(Button, { size: "xs", hierarchy: "tertiary", iconOnly: true, "aria-label": "Previous version", disabled: branch.index <= 1, iconLeading: /* @__PURE__ */ jsx(Icon, { name: "chevronLeft", size: 14 }), onClick: branch.onPrevious }),
                /* @__PURE__ */ jsxs("span", { className: "at-msg__branch-count", "aria-live": "polite", children: [
                  /* @__PURE__ */ jsx("span", { className: "at-vh", children: "Version " }),
                  branch.index,
                  /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
                  /* @__PURE__ */ jsx("span", { className: "at-vh", children: " of " }),
                  branch.count
                ] }),
                /* @__PURE__ */ jsx(Button, { size: "xs", hierarchy: "tertiary", iconOnly: true, "aria-label": "Next version", disabled: branch.index >= branch.count, iconLeading: /* @__PURE__ */ jsx(Icon, { name: "chevronRight", size: 14 }), onClick: branch.onNext })
              ] }) : null,
              text ? /* @__PURE__ */ jsx(Button, { size: "xs", hierarchy: "tertiary", iconOnly: true, "aria-label": copied ? "Copied" : "Copy", title: copied ? "Copied" : "Copy", iconLeading: /* @__PURE__ */ jsx(Icon, { name: copied ? "check" : "copy", size: 16 }), onClick: copy }) : null,
              onEdit ? /* @__PURE__ */ jsx(Button, { size: "xs", hierarchy: "tertiary", iconOnly: true, "aria-label": "Edit message", title: "Edit", iconLeading: /* @__PURE__ */ jsx(Icon, { name: "edit", size: 16 }), onClick: onEdit }) : null,
              onRegenerate && status !== "error" ? /* @__PURE__ */ jsx(Button, { size: "xs", hierarchy: "tertiary", iconOnly: true, "aria-label": "Regenerate response", title: "Regenerate", iconLeading: /* @__PURE__ */ jsx(Icon, { name: "refresh", size: 16 }), onClick: onRegenerate }) : null,
              actions,
              /* @__PURE__ */ jsx("span", { className: "at-vh", role: "status", children: copied ? "Copied to clipboard" : "" })
            ] }) : null
          ] })
        ]
      }
    );
  }

  // src/components/ai/StreamingText.tsx
  var import_react16 = __toESM(require_react(), 1);
  var SENTENCE_END = /[.!?…:;](\s|$)|\n/g;
  function sentenceCut(s) {
    var _a;
    let cut = 0;
    for (const m of s.matchAll(SENTENCE_END)) cut = ((_a = m.index) != null ? _a : 0) + m[0].length;
    return cut;
  }
  function StreamingText({ text, streaming = false, caret = true, announce = "polite", announceInterval = 1500, doneMessage = "Response complete", render, className, ...rest }) {
    const [live, setLive] = (0, import_react16.useState)("");
    const spoken = (0, import_react16.useRef)(0);
    const last = (0, import_react16.useRef)(0);
    const textRef = (0, import_react16.useRef)(text);
    textRef.current = text;
    (0, import_react16.useEffect)(() => {
      if (text.length < spoken.current) spoken.current = 0;
    }, [text]);
    (0, import_react16.useEffect)(() => {
      if (announce !== "polite" || !streaming) return;
      const tick = () => {
        const pending = textRef.current.slice(spoken.current);
        const cut = sentenceCut(pending);
        if (cut > 0 && Date.now() - last.current >= announceInterval) {
          setLive(pending.slice(0, cut).trim());
          spoken.current += cut;
          last.current = Date.now();
        }
      };
      const t = window.setInterval(tick, Math.max(250, announceInterval / 3));
      return () => window.clearInterval(t);
    }, [announce, streaming, announceInterval]);
    const wasStreaming = (0, import_react16.useRef)(streaming);
    (0, import_react16.useEffect)(() => {
      if (wasStreaming.current && !streaming) {
        if (announce === "polite") {
          const rest2 = textRef.current.slice(spoken.current).trim();
          spoken.current = textRef.current.length;
          if (rest2) setLive(rest2);
        } else if (announce === "end") setLive(doneMessage);
      }
      wasStreaming.current = streaming;
    }, [streaming, announce, doneMessage]);
    (0, import_react16.useEffect)(() => {
      if (!live) return;
      const t = window.setTimeout(() => setLive(""), 6e3);
      return () => window.clearTimeout(t);
    }, [live]);
    return /* @__PURE__ */ jsxs("div", { className: cx("at-stream", streaming && "is-streaming", className), ...rest, children: [
      /* @__PURE__ */ jsxs("div", { className: "at-stream__text", "aria-busy": streaming || void 0, children: [
        render ? render(text) : text,
        streaming && caret ? /* @__PURE__ */ jsx("span", { className: "at-stream__caret", "aria-hidden": "true" }) : null
      ] }),
      announce !== "off" ? /* @__PURE__ */ jsx("div", { className: "at-vh", role: "status", "aria-live": "polite", "aria-atomic": "true", children: live }) : null
    ] });
  }
  function Shimmer({ children, active = true, className, ...rest }) {
    return /* @__PURE__ */ jsx("span", { className: cx("at-shimmer", active && "is-active", className), ...rest, children });
  }

  // src/components/ai/Reasoning.tsx
  var import_react17 = __toESM(require_react(), 1);
  function Reasoning({ status = "done", duration, steps, children, label, open, defaultOpen, onOpenChange, autoCollapse = true, className }) {
    const id = useFieldId();
    const thinking = status === "thinking";
    const [isOpen, setOpen] = useControllable(open, defaultOpen != null ? defaultOpen : thinking, onOpenChange);
    const prev = (0, import_react17.useRef)(status);
    (0, import_react17.useEffect)(() => {
      if (autoCollapse && open === void 0 && prev.current === "thinking" && status === "done") setOpen(false);
      prev.current = status;
    }, [status, autoCollapse, open, setOpen]);
    const text = label != null ? label : thinking ? "Thinking…" : duration !== void 0 ? `Thought for ${formatDuration(duration)}` : "Reasoning";
    const hasBody = !!((steps == null ? void 0 : steps.length) || children);
    return /* @__PURE__ */ jsxs("div", { className: cx("at-reasoning", thinking && "is-thinking", isOpen && "is-open", className), children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "at-reasoning__trigger",
          "aria-expanded": hasBody ? isOpen : void 0,
          "aria-controls": hasBody ? `${id}-body` : void 0,
          disabled: !hasBody,
          onClick: () => setOpen(!isOpen),
          children: [
            /* @__PURE__ */ jsx(Icon, { name: "lightbulb", size: 16, className: "at-reasoning__icon" }),
            thinking ? /* @__PURE__ */ jsx(Shimmer, { children: text }) : /* @__PURE__ */ jsx("span", { children: text }),
            hasBody ? /* @__PURE__ */ jsx(Icon, { name: "chevronDown", size: 16, className: "at-reasoning__chev" }) : null
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "at-vh", role: "status", children: thinking ? "" : text }),
      hasBody && isOpen ? /* @__PURE__ */ jsxs("div", { id: `${id}-body`, className: "at-reasoning__body", children: [
        (steps == null ? void 0 : steps.length) ? /* @__PURE__ */ jsx("ol", { className: "at-reasoning__steps", children: steps.map((s, i) => {
          var _a, _b;
          return /* @__PURE__ */ jsxs("li", { className: cx("at-reasoning__step", `is-${(_b = s.status) != null ? _b : "done"}`), children: [
            /* @__PURE__ */ jsx("span", { className: "at-reasoning__dot", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxs("span", { className: "at-reasoning__step-text", children: [
              /* @__PURE__ */ jsxs("span", { className: "at-reasoning__step-label", children: [
                s.status === "active" ? /* @__PURE__ */ jsx(Shimmer, { children: s.label }) : s.label,
                s.status && s.status !== "done" ? /* @__PURE__ */ jsxs("span", { className: "at-vh", children: [
                  " (",
                  s.status === "active" ? "in progress" : "pending",
                  ")"
                ] }) : null
              ] }),
              s.detail ? /* @__PURE__ */ jsx("span", { className: "at-reasoning__step-detail", children: s.detail }) : null
            ] })
          ] }, (_a = s.id) != null ? _a : i);
        }) }) : null,
        children ? /* @__PURE__ */ jsx("div", { className: "at-reasoning__text", children }) : null
      ] }) : null
    ] });
  }

  // src/components/ai/ToolCall.tsx
  var STATUS = {
    pending: { label: "Pending", icon: "clock" },
    running: { label: "Running" },
    success: { label: "Done", icon: "check" },
    error: { label: "Failed", icon: "alert" }
  };
  function show(value) {
    if (value === void 0) return "";
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  }
  function ToolCall({ name, title, status = "success", input, output, error, duration, icon, open, defaultOpen = false, onOpenChange, className }) {
    const id = useFieldId();
    const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
    const s = STATUS[status];
    const hasBody = input !== void 0 || output !== void 0 || !!error;
    return /* @__PURE__ */ jsxs("div", { className: cx("at-tool", `at-tool--${status}`, isOpen && "is-open", className), children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "at-tool__head",
          "aria-expanded": hasBody ? isOpen : void 0,
          "aria-controls": hasBody ? `${id}-body` : void 0,
          disabled: !hasBody,
          onClick: () => setOpen(!isOpen),
          children: [
            /* @__PURE__ */ jsx("span", { className: "at-tool__icon", "aria-hidden": "true", children: icon != null ? icon : /* @__PURE__ */ jsx(Icon, { name: "tool", size: 16 }) }),
            /* @__PURE__ */ jsxs("span", { className: "at-tool__title", children: [
              /* @__PURE__ */ jsx("span", { className: "at-tool__label", children: title != null ? title : name }),
              title ? /* @__PURE__ */ jsx("code", { className: "at-tool__name", children: name }) : null
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "at-tool__meta", children: [
              duration !== void 0 && (status === "success" || status === "error") ? /* @__PURE__ */ jsx("span", { className: "at-tool__duration", children: formatDuration(duration, "ms") }) : null,
              /* @__PURE__ */ jsxs("span", { className: cx("at-tool__status", `at-tool__status--${status}`), "aria-live": "polite", children: [
                status === "running" ? /* @__PURE__ */ jsx("span", { className: "at-spinner", "aria-hidden": "true" }) : /* @__PURE__ */ jsx(Icon, { name: s.icon, size: 12 }),
                s.label
              ] }),
              hasBody ? /* @__PURE__ */ jsx(Icon, { name: "chevronDown", size: 16, className: "at-tool__chev" }) : null
            ] })
          ]
        }
      ),
      hasBody && isOpen ? /* @__PURE__ */ jsxs("div", { id: `${id}-body`, className: "at-tool__body", children: [
        input !== void 0 ? /* @__PURE__ */ jsxs("div", { className: "at-tool__section", children: [
          /* @__PURE__ */ jsx("span", { className: "at-tool__section-label", children: "Input" }),
          /* @__PURE__ */ jsx("pre", { className: "at-code", tabIndex: 0, "aria-label": `${name} input`, children: /* @__PURE__ */ jsx("code", { children: show(input) }) })
        ] }) : null,
        error ? /* @__PURE__ */ jsxs("div", { className: "at-tool__section", children: [
          /* @__PURE__ */ jsx("span", { className: "at-tool__section-label", children: "Error" }),
          /* @__PURE__ */ jsxs("div", { className: "at-tool__error", children: [
            /* @__PURE__ */ jsx(Icon, { name: "alert", size: 16 }),
            error
          ] })
        ] }) : output !== void 0 ? /* @__PURE__ */ jsxs("div", { className: "at-tool__section", children: [
          /* @__PURE__ */ jsx("span", { className: "at-tool__section-label", children: "Output" }),
          /* @__PURE__ */ jsx("pre", { className: "at-code", tabIndex: 0, "aria-label": `${name} output`, children: /* @__PURE__ */ jsx("code", { children: show(output) }) })
        ] }) : null
      ] }) : null
    ] });
  }

  // src/components/ai/Approval.tsx
  var import_react18 = __toESM(require_react(), 1);
  var RISK = {
    low: { label: "Low risk", icon: "shield" },
    medium: { label: "Medium risk", icon: "alert" },
    high: { label: "High risk", icon: "alert" }
  };
  function Approval({ title, children, risk = "medium", toolName, details, editableText, editLabel = "Edit before approving", alwaysAllowLabel, status = "pending", approveLabel = "Approve", denyLabel = "Deny", onApprove, onDeny, className }) {
    const id = useFieldId();
    const [editing, setEditing] = (0, import_react18.useState)(false);
    const [draft, setDraft] = (0, import_react18.useState)(editableText != null ? editableText : "");
    const [always, setAlways] = (0, import_react18.useState)(false);
    const r = RISK[risk];
    const pending = status === "pending";
    const edited = editableText !== void 0 && draft !== editableText;
    return /* @__PURE__ */ jsxs("section", { className: cx("at-approval", `at-approval--${risk}`, !pending && `is-${status}`, className), "aria-labelledby": `${id}-title`, "aria-describedby": children ? `${id}-desc` : void 0, children: [
      /* @__PURE__ */ jsxs("div", { className: "at-approval__head", children: [
        /* @__PURE__ */ jsx("span", { className: "at-approval__icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx(Icon, { name: r.icon, size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { className: "at-approval__heading", children: [
          /* @__PURE__ */ jsxs("p", { className: "at-approval__eyebrow", children: [
            /* @__PURE__ */ jsx("span", { className: cx("at-approval__risk", `at-approval__risk--${risk}`), children: r.label }),
            toolName ? /* @__PURE__ */ jsx("code", { className: "at-approval__tool", children: toolName }) : null
          ] }),
          /* @__PURE__ */ jsx("p", { id: `${id}-title`, className: "at-approval__title", children: title }),
          children ? /* @__PURE__ */ jsx("div", { id: `${id}-desc`, className: "at-approval__desc", children }) : null
        ] })
      ] }),
      editing && pending ? /* @__PURE__ */ jsxs("div", { className: "at-field at-approval__edit", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: `${id}-edit`, className: "at-field__label", children: editLabel }),
        /* @__PURE__ */ jsx("textarea", { id: `${id}-edit`, className: "at-approval__textarea", value: draft, rows: Math.min(8, Math.max(3, draft.split("\n").length)), onChange: (e) => setDraft(e.target.value) })
      ] }) : details || editableText !== void 0 ? /* @__PURE__ */ jsx("div", { className: "at-approval__details", children: editableText !== void 0 ? /* @__PURE__ */ jsx("p", { className: "at-approval__preview", children: draft }) : details }) : null,
      pending ? /* @__PURE__ */ jsxs("div", { className: "at-approval__foot", children: [
        alwaysAllowLabel ? /* @__PURE__ */ jsx(Checkbox, { size: "sm", label: alwaysAllowLabel, checked: always, onChange: (e) => setAlways(e.target.checked) }) : /* @__PURE__ */ jsx("span", {}),
        /* @__PURE__ */ jsxs("div", { className: "at-approval__actions", children: [
          /* @__PURE__ */ jsx(Button, { size: "sm", hierarchy: "tertiary", onClick: onDeny, children: denyLabel }),
          editableText !== void 0 && !editing ? /* @__PURE__ */ jsx(Button, { size: "sm", hierarchy: "outline", iconLeading: /* @__PURE__ */ jsx(Icon, { name: "edit", size: 16 }), onClick: () => setEditing(true), children: "Edit" }) : null,
          /* @__PURE__ */ jsx(Button, { size: "sm", hierarchy: "primary", onClick: () => onApprove == null ? void 0 : onApprove({ alwaysAllow: always, editedText: edited ? draft : void 0 }), children: editing && edited ? "Save and approve" : approveLabel })
        ] })
      ] }) : /* @__PURE__ */ jsxs("p", { className: cx("at-approval__outcome", `at-approval__outcome--${status}`), role: "status", children: [
        /* @__PURE__ */ jsx(Icon, { name: status === "approved" ? "success" : "x", size: 16 }),
        status === "approved" ? "Approved" : "Denied",
        status === "approved" && edited ? " with your edits" : ""
      ] })
    ] });
  }

  // src/components/ai/Sources.tsx
  var import_react19 = __toESM(require_react(), 1);
  function domainOf(s) {
    if (s.domain) return s.domain;
    try {
      return s.url ? new URL(s.url).hostname.replace(/^www\./, "") : "";
    } catch (e) {
      return "";
    }
  }
  function Sources({ sources, label, variant = "collapsible", open, defaultOpen = false, onOpenChange, className }) {
    const id = useFieldId();
    const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
    const expanded = variant === "list" || isOpen;
    const text = label != null ? label : `${sources.length} source${sources.length === 1 ? "" : "s"}`;
    const list = /* @__PURE__ */ jsx("ol", { id: `${id}-list`, className: "at-sources__list", "aria-label": variant === "list" ? text : void 0, children: sources.map((s, i) => {
      var _a;
      const domain = domainOf(s);
      const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "at-sources__num", "aria-hidden": "true", children: i + 1 }),
        /* @__PURE__ */ jsxs("span", { className: "at-sources__main", children: [
          /* @__PURE__ */ jsx("span", { className: "at-sources__title", children: s.title }),
          /* @__PURE__ */ jsxs("span", { className: "at-sources__domain", children: [
            (_a = s.icon) != null ? _a : /* @__PURE__ */ jsx(Icon, { name: "globe", size: 12 }),
            domain
          ] }),
          s.snippet ? /* @__PURE__ */ jsx("span", { className: "at-sources__snippet", children: s.snippet }) : null
        ] }),
        s.url ? /* @__PURE__ */ jsx(Icon, { name: "external", size: 14, className: "at-sources__ext" }) : null
      ] });
      return /* @__PURE__ */ jsx("li", { id: `source-${s.id}`, className: "at-sources__item", children: s.url ? /* @__PURE__ */ jsxs("a", { className: "at-sources__link", href: s.url, target: "_blank", rel: "noreferrer noopener", children: [
        inner,
        /* @__PURE__ */ jsxs("span", { className: "at-vh", children: [
          " (source ",
          i + 1,
          ", opens in a new tab)"
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "at-sources__link", children: inner }) }, s.id);
    }) });
    if (variant === "list") return /* @__PURE__ */ jsx("div", { className: cx("at-sources", "at-sources--list", className), children: list });
    return /* @__PURE__ */ jsxs("div", { className: cx("at-sources", expanded && "is-open", className), children: [
      /* @__PURE__ */ jsxs("button", { type: "button", className: "at-sources__trigger", "aria-expanded": expanded, "aria-controls": `${id}-list`, onClick: () => setOpen(!isOpen), children: [
        /* @__PURE__ */ jsx("span", { className: "at-sources__stack", "aria-hidden": "true", children: sources.slice(0, 3).map((s) => {
          var _a;
          return /* @__PURE__ */ jsx("span", { className: "at-sources__favicon", children: (_a = s.icon) != null ? _a : /* @__PURE__ */ jsx(Icon, { name: "globe", size: 12 }) }, s.id);
        }) }),
        text,
        /* @__PURE__ */ jsx(Icon, { name: "chevronDown", size: 16, className: "at-sources__chev" })
      ] }),
      expanded ? list : null
    ] });
  }
  function InlineCitation({ index, source, className }) {
    var _a;
    const id = useFieldId();
    const [open, setOpen] = (0, import_react19.useState)(false);
    const hideTimer = (0, import_react19.useRef)(void 0);
    const show2 = (0, import_react19.useCallback)(() => {
      window.clearTimeout(hideTimer.current);
      setOpen(true);
    }, []);
    const hide = (0, import_react19.useCallback)(() => {
      hideTimer.current = window.setTimeout(() => setOpen(false), 120);
    }, []);
    const domain = domainOf(source);
    const chipProps = {
      className: "at-cite__chip",
      "aria-describedby": `${id}-card`,
      onFocus: show2,
      onBlur: hide,
      onKeyDown: (e) => {
        if (e.key === "Escape") setOpen(false);
      }
    };
    const label = `Source ${index}: ${source.title}`;
    return /* @__PURE__ */ jsxs("span", { className: cx("at-cite", className), onMouseEnter: show2, onMouseLeave: hide, children: [
      source.url ? /* @__PURE__ */ jsx("a", { ...chipProps, href: source.url, target: "_blank", rel: "noreferrer noopener", "aria-label": `${label} (opens in a new tab)`, children: index }) : /* @__PURE__ */ jsx("span", { ...chipProps, tabIndex: 0, role: "note", "aria-label": label, children: index }),
      /* @__PURE__ */ jsxs("span", { id: `${id}-card`, role: "tooltip", className: cx("at-cite__card", open && "is-open"), children: [
        /* @__PURE__ */ jsxs("span", { className: "at-cite__domain", children: [
          (_a = source.icon) != null ? _a : /* @__PURE__ */ jsx(Icon, { name: "globe", size: 12 }),
          domain || `Source ${index}`
        ] }),
        /* @__PURE__ */ jsx("span", { className: "at-cite__title", children: source.title }),
        source.snippet ? /* @__PURE__ */ jsx("span", { className: "at-cite__snippet", children: source.snippet }) : null
      ] })
    ] });
  }

  // src/components/ai/Suggestions.tsx
  var toItem = (s) => typeof s === "string" ? { label: s } : s;
  function Suggestions({ suggestions, onSelect, mode = "send", variant = "chips", wrap = false, label = "Suggested prompts", className }) {
    const items = suggestions.map(toItem);
    return /* @__PURE__ */ jsx("div", { className: cx("at-suggestions", `at-suggestions--${variant}`, wrap && "is-wrap", className), role: "group", "aria-label": label, children: /* @__PURE__ */ jsx("ul", { className: "at-suggestions__list", children: items.map((it) => {
      var _a, _b;
      const prompt = (_a = it.prompt) != null ? _a : it.label;
      return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "at-suggestion",
          title: mode === "insert" ? "Add to message" : void 0,
          onClick: () => onSelect == null ? void 0 : onSelect(prompt, it),
          children: [
            it.icon ? /* @__PURE__ */ jsx("span", { className: "at-suggestion__icon", "aria-hidden": "true", children: it.icon }) : null,
            /* @__PURE__ */ jsxs("span", { className: "at-suggestion__text", children: [
              /* @__PURE__ */ jsx("span", { className: "at-suggestion__label", children: it.label }),
              variant === "cards" && it.description ? /* @__PURE__ */ jsx("span", { className: "at-suggestion__desc", children: it.description }) : null
            ] }),
            /* @__PURE__ */ jsx(Icon, { name: mode === "insert" ? "plus" : "arrowUp", size: 14, className: "at-suggestion__go" }),
            mode === "insert" ? /* @__PURE__ */ jsx("span", { className: "at-vh", children: " (add to message)" }) : null
          ]
        }
      ) }, (_b = it.id) != null ? _b : it.label);
    }) }) });
  }

  // src/components/ai/ModelSelector.tsx
  var import_react20 = __toESM(require_react(), 1);
  function ModelSelector({ models, value, defaultValue, onChange, label = "Model", showLabel = false, variant = "ghost", size = "sm", placement = "up", disabled, defaultOpen, className }) {
    var _a, _b, _c;
    const id = useFieldId();
    const [current, setCurrent] = useControllable(value, (_b = defaultValue != null ? defaultValue : (_a = models[0]) == null ? void 0 : _a.value) != null ? _b : "", onChange);
    const [open, setOpen] = (0, import_react20.useState)(!!defaultOpen);
    const [active, setActive] = (0, import_react20.useState)(-1);
    const wrap = (0, import_react20.useRef)(null);
    const typed = (0, import_react20.useRef)({ text: "", at: 0 });
    const selected = models.find((m) => m.value === current);
    const enabled = models.map((m, i) => m.disabled ? -1 : i).filter((i) => i >= 0);
    const close = (0, import_react20.useCallback)(() => setOpen(false), []);
    useOutsideClick([wrap], close, open);
    const pick = (i) => {
      const m = models[i];
      if (!m || m.disabled) return;
      setCurrent(m.value);
      setOpen(false);
    };
    const show2 = () => {
      var _a2;
      if (disabled) return;
      const sel = models.findIndex((m) => m.value === current);
      setActive(sel >= 0 ? sel : (_a2 = enabled[0]) != null ? _a2 : -1);
      setOpen(true);
    };
    const onKey = (e) => {
      const pos = enabled.indexOf(active);
      if (!open) {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
          e.preventDefault();
          show2();
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
        e.stopPropagation();
        close();
      } else if (e.key === "Tab") close();
      else if (e.key.length === 1) {
        const now = Date.now();
        typed.current.text = (now - typed.current.at > 600 ? "" : typed.current.text) + e.key.toLowerCase();
        typed.current.at = now;
        const hit = enabled.find((i) => models[i].label.toLowerCase().startsWith(typed.current.text));
        if (hit !== void 0) setActive(hit);
      }
    };
    return /* @__PURE__ */ jsxs("div", { ref: wrap, className: cx("at-model", `at-model--${variant}`, `at-model--${size}`, className), children: [
      showLabel ? /* @__PURE__ */ jsx("span", { id: `${id}-label`, className: "at-field__label", children: label }) : null,
      /* @__PURE__ */ jsxs("div", { className: "at-anchor", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            id,
            role: "combobox",
            "aria-haspopup": "listbox",
            "aria-expanded": open,
            "aria-controls": `${id}-list`,
            "aria-label": showLabel ? void 0 : label,
            "aria-labelledby": showLabel ? `${id}-label ${id}` : void 0,
            "aria-activedescendant": open && active >= 0 ? `${id}-o${active}` : void 0,
            disabled,
            className: cx("at-model__trigger", open && "is-open"),
            onClick: () => open ? close() : show2(),
            onKeyDown: onKey,
            children: [
              (selected == null ? void 0 : selected.icon) ? /* @__PURE__ */ jsx("span", { className: "at-model__icon", "aria-hidden": "true", children: selected.icon }) : null,
              /* @__PURE__ */ jsx("span", { className: "at-model__value", children: (_c = selected == null ? void 0 : selected.label) != null ? _c : "Choose a model" }),
              /* @__PURE__ */ jsx(Icon, { name: "chevronDown", size: 16, className: "at-model__chev" })
            ]
          }
        ),
        open ? /* @__PURE__ */ jsx("div", { id: `${id}-list`, role: "listbox", "aria-label": label, className: cx("at-menu", "at-model__list", `at-model__list--${placement}`), children: models.map((m, i) => {
          var _a2, _b2;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              id: `${id}-o${i}`,
              role: "option",
              "aria-selected": m.value === current,
              "aria-disabled": m.disabled || void 0,
              className: cx("at-model__option", i === active && "is-active", m.value === current && "is-selected", m.disabled && "is-disabled"),
              onClick: () => pick(i),
              onMouseMove: () => !m.disabled && setActive(i),
              children: [
                /* @__PURE__ */ jsx("span", { className: "at-model__option-icon", "aria-hidden": "true", children: (_a2 = m.icon) != null ? _a2 : /* @__PURE__ */ jsx(Icon, { name: "sparkle", size: 16 }) }),
                /* @__PURE__ */ jsxs("span", { className: "at-model__option-main", children: [
                  /* @__PURE__ */ jsxs("span", { className: "at-model__option-name", children: [
                    m.label,
                    m.badge ? /* @__PURE__ */ jsx("span", { className: "at-model__badge", children: m.badge }) : null
                  ] }),
                  m.provider || m.description ? /* @__PURE__ */ jsx("span", { className: "at-model__option-desc", children: [m.provider, m.description].filter(Boolean).join(" \xB7 ") }) : null,
                  ((_b2 = m.capabilities) == null ? void 0 : _b2.length) ? /* @__PURE__ */ jsx("span", { className: "at-model__caps", children: m.capabilities.map((c) => /* @__PURE__ */ jsx("span", { className: "at-model__cap", children: c }, c)) }) : null
                ] }),
                m.value === current ? /* @__PURE__ */ jsx(Icon, { name: "check", size: 16, className: "at-model__check" }) : null
              ]
            },
            m.value
          );
        }) }) : null
      ] })
    ] });
  }

  // src/components/ai/Feedback.tsx
  var import_react21 = __toESM(require_react(), 1);
  var DEFAULT_REASONS = ["Not accurate", "Not helpful", "Too long", "Didn’t follow instructions", "Unsafe or harmful"];
  function Feedback({ value, defaultValue = null, onChange, onSubmit, reasons = DEFAULT_REASONS, positiveReasons = [], size = "xs", className }) {
    const id = useFieldId();
    const [rating, setRating] = useControllable(value, defaultValue, onChange);
    const [formOpen, setFormOpen] = (0, import_react21.useState)(() => defaultValue === "down" && reasons.length > 0 || defaultValue === "up" && positiveReasons.length > 0);
    const [picked, setPicked] = (0, import_react21.useState)([]);
    const [comment, setComment] = (0, import_react21.useState)("");
    const [sent, setSent] = (0, import_react21.useState)(false);
    const first = (0, import_react21.useRef)(null);
    const focusForm = (0, import_react21.useRef)(false);
    const options = rating === "up" ? positiveReasons : reasons;
    (0, import_react21.useEffect)(() => {
      var _a;
      if (formOpen && focusForm.current) (_a = first.current) == null ? void 0 : _a.focus();
      focusForm.current = false;
    }, [formOpen]);
    const rate = (r) => {
      const next = rating === r ? null : r;
      setRating(next);
      setSent(false);
      setPicked([]);
      setComment("");
      focusForm.current = true;
      setFormOpen(!!next && (next === "down" ? reasons.length > 0 : positiveReasons.length > 0));
    };
    const submit = () => {
      if (!rating) return;
      onSubmit == null ? void 0 : onSubmit({ rating, reasons: picked, comment });
      setFormOpen(false);
      setSent(true);
    };
    return /* @__PURE__ */ jsxs("div", { className: cx("at-feedback", className), children: [
      /* @__PURE__ */ jsxs("div", { className: "at-feedback__thumbs", role: "group", "aria-label": "Rate this response", children: [
        /* @__PURE__ */ jsx(Button, { size, hierarchy: "tertiary", iconOnly: true, "aria-label": "Good response", "aria-pressed": rating === "up", className: cx("at-feedback__thumb", rating === "up" && "is-on"), iconLeading: /* @__PURE__ */ jsx(Icon, { name: "thumbUp", size: 16 }), onClick: () => rate("up") }),
        /* @__PURE__ */ jsx(Button, { size, hierarchy: "tertiary", iconOnly: true, "aria-label": "Bad response", "aria-pressed": rating === "down", className: cx("at-feedback__thumb", rating === "down" && "is-on"), iconLeading: /* @__PURE__ */ jsx(Icon, { name: "thumbDown", size: 16 }), onClick: () => rate("down") })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "at-feedback__status", role: "status", children: sent ? "Thanks for your feedback" : "" }),
      formOpen ? /* @__PURE__ */ jsxs(
        "form",
        {
          className: "at-feedback__form",
          "aria-labelledby": `${id}-legend`,
          onSubmit: (e) => {
            e.preventDefault();
            submit();
          },
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              setFormOpen(false);
            }
          },
          children: [
            /* @__PURE__ */ jsx("p", { id: `${id}-legend`, className: "at-feedback__legend", children: rating === "down" ? "What went wrong?" : "What did you like?" }),
            /* @__PURE__ */ jsx("div", { className: "at-feedback__reasons", role: "group", "aria-labelledby": `${id}-legend`, children: options.map((r, i) => /* @__PURE__ */ jsxs(
              "button",
              {
                ref: i === 0 ? first : void 0,
                type: "button",
                className: cx("at-feedback__reason", picked.includes(r) && "is-on"),
                "aria-pressed": picked.includes(r),
                onClick: () => setPicked(picked.includes(r) ? picked.filter((x) => x !== r) : [...picked, r]),
                children: [
                  picked.includes(r) ? /* @__PURE__ */ jsx(Icon, { name: "check", size: 14 }) : null,
                  r
                ]
              },
              r
            )) }),
            /* @__PURE__ */ jsx("label", { className: "at-vh", htmlFor: `${id}-comment`, children: "Tell us more (optional)" }),
            /* @__PURE__ */ jsx("textarea", { id: `${id}-comment`, className: "at-feedback__comment", rows: 2, placeholder: "Tell us more (optional)", value: comment, onChange: (e) => setComment(e.target.value) }),
            /* @__PURE__ */ jsxs("div", { className: "at-feedback__actions", children: [
              /* @__PURE__ */ jsx(Button, { size: "sm", hierarchy: "tertiary", onClick: () => setFormOpen(false), children: "Cancel" }),
              /* @__PURE__ */ jsx(Button, { size: "sm", hierarchy: "secondary", type: "submit", children: "Send feedback" })
            ] })
          ]
        }
      ) : null
    ] });
  }

  // src/components/ai/ContextMeter.tsx
  var import_react22 = __toESM(require_react(), 1);
  var fmt = (n, locale) => new Intl.NumberFormat(locale, { notation: n >= 1e3 ? "compact" : "standard", maximumFractionDigits: 1 }).format(n);
  function ContextMeter({ used, limit, cost, currency = "USD", breakdown, label = "Context window", variant = "compact", warnAt = 80, locale, placement = "up", defaultOpen, className }) {
    const id = useFieldId();
    const [open, setOpen] = (0, import_react22.useState)(!!defaultOpen);
    const wrap = (0, import_react22.useRef)(null);
    const trigger = (0, import_react22.useRef)(null);
    const close = (0, import_react22.useCallback)(() => setOpen(false), []);
    useDismiss(open, close, [wrap], trigger);
    const pct = limit > 0 ? Math.min(100, Math.round(used / limit * 100)) : 0;
    const tone = pct >= 95 ? "error" : pct >= warnAt ? "warning" : "ok";
    const valueText = `${pct}% used, ${fmt(used, locale)} of ${fmt(limit, locale)} tokens`;
    const money = cost !== void 0 ? new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: cost < 1 ? 3 : 2 }).format(cost) : null;
    const meter = /* @__PURE__ */ jsxs("div", { className: "at-context__meter", children: [
      /* @__PURE__ */ jsxs("div", { className: "at-context__row", children: [
        /* @__PURE__ */ jsx("span", { id: `${id}-label`, className: "at-context__label", children: label }),
        /* @__PURE__ */ jsxs("span", { className: "at-context__nums", children: [
          fmt(used, locale),
          " / ",
          fmt(limit, locale)
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { role: "meter", "aria-labelledby": `${id}-label`, "aria-valuemin": 0, "aria-valuemax": limit, "aria-valuenow": Math.min(used, limit), "aria-valuetext": valueText, className: "at-context__track", children: /* @__PURE__ */ jsx("span", { className: "at-context__fill", style: { width: `${pct}%` } }) }),
      (breakdown == null ? void 0 : breakdown.length) ? /* @__PURE__ */ jsxs("dl", { className: "at-context__list", children: [
        breakdown.map((b) => /* @__PURE__ */ jsxs("div", { className: "at-context__item", children: [
          /* @__PURE__ */ jsx("dt", { children: b.label }),
          /* @__PURE__ */ jsx("dd", { children: fmt(b.tokens, locale) })
        ] }, b.label)),
        money ? /* @__PURE__ */ jsxs("div", { className: "at-context__item at-context__item--total", children: [
          /* @__PURE__ */ jsx("dt", { children: "Cost" }),
          /* @__PURE__ */ jsx("dd", { children: money })
        ] }) : null
      ] }) : money ? /* @__PURE__ */ jsxs("div", { className: "at-context__row at-context__row--cost", children: [
        /* @__PURE__ */ jsx("span", { children: "Cost" }),
        /* @__PURE__ */ jsx("span", { children: money })
      ] }) : null,
      tone !== "ok" ? /* @__PURE__ */ jsx("p", { className: "at-context__hint", children: tone === "error" ? "Almost full: older messages will be summarised or dropped." : "Getting full: start a new chat for a new topic." }) : null
    ] });
    if (variant === "bar") return /* @__PURE__ */ jsx("div", { className: cx("at-context", "at-context--bar", `is-${tone}`, className), children: meter });
    const r = 7;
    const c = 2 * Math.PI * r;
    return /* @__PURE__ */ jsxs("div", { ref: wrap, className: cx("at-context", "at-context--compact", `is-${tone}`, className), children: [
      /* @__PURE__ */ jsxs("button", { ref: trigger, type: "button", className: "at-context__trigger", "aria-expanded": open, "aria-controls": `${id}-pop`, "aria-label": `${label}: ${valueText}`, onClick: () => setOpen(!open), children: [
        /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 18 18", "aria-hidden": "true", className: "at-context__ring", children: [
          /* @__PURE__ */ jsx("circle", { cx: "9", cy: "9", r, className: "at-context__ring-track" }),
          /* @__PURE__ */ jsx("circle", { cx: "9", cy: "9", r, className: "at-context__ring-fill", strokeDasharray: c, strokeDashoffset: c * (1 - pct / 100), transform: "rotate(-90 9 9)" })
        ] }),
        /* @__PURE__ */ jsxs("span", { "aria-hidden": "true", children: [
          pct,
          "%"
        ] })
      ] }),
      open ? /* @__PURE__ */ jsx("div", { id: `${id}-pop`, role: "dialog", "aria-label": label, className: cx("at-context__pop", `at-context__pop--${placement}`), children: meter }) : null
    ] });
  }
  return __toCommonJS(src_exports);
})();
window.Atomus = Object.assign(window.Atomus || {}, __atomus);
