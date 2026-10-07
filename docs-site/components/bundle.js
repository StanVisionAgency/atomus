/* @ds-bundle: {"format":4,"namespace":"Atomus","components":[{"name":"Button"},{"name":"Badge"},{"name":"Tag"},{"name":"Input"},{"name":"Checkbox"},{"name":"Radio"},{"name":"Toggle"},{"name":"Avatar"},{"name":"Alert"},{"name":"Card"},{"name":"Tabs"},{"name":"ProgressBar"},{"name":"MetricCard"},{"name":"EmptyState"}]} */
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
    Avatar: () => Avatar,
    Badge: () => Badge,
    Button: () => Button,
    Card: () => Card,
    Checkbox: () => Checkbox,
    EmptyState: () => EmptyState,
    Icon: () => Icon,
    Input: () => Input,
    MetricCard: () => MetricCard,
    ProgressBar: () => ProgressBar,
    Radio: () => Radio,
    Tabs: () => Tabs,
    Tag: () => Tag,
    Toggle: () => Toggle
  });

  // src/components/Button.tsx
  var import_react2 = __toESM(require_react(), 1);

  // src/utils.ts
  var import_react = __toESM(require_react(), 1);
  function cx(...parts) {
    return parts.filter(Boolean).join(" ");
  }
  function useFieldId(given) {
    const generated = (0, import_react.useId)();
    return given != null ? given : `at${generated.replace(/:/g, "")}`;
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
    arrowDown: "M10 5v10M5.5 10.5L10 15l4.5-4.5"
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
    const parts = name.trim().split(/\s+/);
    const first = (_b = (_a = parts[0]) == null ? void 0 : _a[0]) != null ? _b : "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
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
  return __toCommonJS(src_exports);
})();
window.Atomus = Object.assign(window.Atomus || {}, __atomus);
