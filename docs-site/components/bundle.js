/* @ds-bundle: {"format":4,"namespace":"Atomus","components":[{"name":"Button"},{"name":"Badge"},{"name":"Tag"},{"name":"Input"},{"name":"Checkbox"},{"name":"Radio"},{"name":"Toggle"},{"name":"Avatar"},{"name":"Alert"},{"name":"Card"},{"name":"Tabs"},{"name":"ProgressBar"},{"name":"MetricCard"},{"name":"EmptyState"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }
  function omit(props, keys) {
    var o = {};
    for (var k in props) if (Object.prototype.hasOwnProperty.call(props, k) && keys.indexOf(k) < 0) o[k] = props[k];
    return o;
  }
  var uid = 0;
  function useId(given) {
    var ref = React.useRef(null);
    if (ref.current === null) ref.current = given || 'at-' + (++uid);
    return ref.current;
  }

  /* Generic stroke glyphs for previews (stand-ins for the Atomus icon set). */
  var PATHS = {
    check: 'M4 10.5l3.5 3.5L16 6',
    x: 'M5 5l10 10M15 5L5 15',
    info: 'M10 9v5M10 6.5v.01M10 18a8 8 0 100-16 8 8 0 000 16z',
    alert: 'M10 7v4M10 13.5v.01M8.6 3.3L2 15a1.6 1.6 0 001.4 2.4h13.2A1.6 1.6 0 0018 15L11.4 3.3a1.6 1.6 0 00-2.8 0z',
    success: 'M6.5 10l2.5 2.5 4.5-5M10 18a8 8 0 100-16 8 8 0 000 16z',
    plus: 'M10 4v12M4 10h12',
    search: 'M9 15A6 6 0 109 3a6 6 0 000 12zM17 17l-3.8-3.8',
    folder: 'M2.5 6.5A1.5 1.5 0 014 5h3.5l1.5 2h7a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5v-8z',
    arrowUp: 'M10 15V5M5.5 9.5L10 5l4.5 4.5',
    arrowDown: 'M10 5v10M5.5 10.5L10 15l4.5-4.5'
  };
  function Icon(p) {
    var size = p.size || 20;
    return h('svg', { className: cx('at-icon', p.className), width: size, height: size, viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.67, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' },
      h('path', { d: PATHS[p.name] || PATHS.info }));
  }

  /* Button ---------------------------------------------------------------- */
  function Button(props) {
    var variant = props.variant || 'secondary';
    var size = props.size || 'md';
    var rest = omit(props, ['variant', 'size', 'iconLeading', 'iconTrailing', 'iconOnly', 'loading', 'fullWidth', 'className', 'children']);
    var label = props.loading ? h('span', { className: 'at-spinner', 'aria-hidden': 'true' }) : null;
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('at-btn', 'at-btn--' + variant, 'at-btn--' + size, 'button-' + size, props.iconOnly && 'at-btn--icon', props.fullWidth && 'at-btn--full', props.className),
      disabled: props.disabled || props.loading,
      'aria-busy': props.loading ? 'true' : undefined
    }), label, props.iconLeading ? h(Icon, { name: props.iconLeading, size: size === 'sm' ? 16 : 20 }) : null,
      props.iconOnly ? null : props.children,
      props.iconTrailing ? h(Icon, { name: props.iconTrailing, size: size === 'sm' ? 16 : 20 }) : null);
  }

  /* Badge ----------------------------------------------------------------- */
  function Badge(props) {
    var color = props.color || 'gray';
    return h('span', { className: cx('at-badge', 'at-badge--' + color, 'at-badge--' + (props.size || 'md'), props.size === 'sm' ? 'caption-sm' : 'tiny-bold', props.className) },
      props.dot ? h('span', { className: 'at-badge__dot', 'aria-hidden': 'true' }) : null, props.children);
  }

  /* Tag ------------------------------------------------------------------- */
  function Tag(props) {
    return h('span', { className: cx('at-tag', 'tiny-bold', props.className) },
      props.children,
      props.onRemove ? h('button', { type: 'button', className: 'at-tag__x', 'aria-label': 'Remove ' + (typeof props.children === 'string' ? props.children : 'tag'), onClick: props.onRemove }, h(Icon, { name: 'x', size: 12 })) : null);
  }

  /* Input ----------------------------------------------------------------- */
  function Input(props) {
    var id = useId(props.id);
    var size = props.size || 'md';
    var rest = omit(props, ['label', 'hint', 'error', 'size', 'iconLeading', 'className', 'id']);
    var msg = props.error || props.hint;
    return h('div', { className: cx('at-field', props.className) },
      props.label ? h('label', { htmlFor: id, className: 'at-field__label small-bold' }, props.label) : null,
      h('div', { className: cx('at-input', 'at-input--' + size, props.error && 'at-input--error', props.disabled && 'at-input--disabled') },
        props.iconLeading ? h(Icon, { name: props.iconLeading, size: 20 }) : null,
        h('input', Object.assign({}, rest, { id: id, className: 'input-' + size, 'aria-invalid': props.error ? 'true' : undefined, 'aria-describedby': msg ? id + '-msg' : undefined }))),
      msg ? h('p', { id: id + '-msg', className: cx('at-field__hint', 'small', props.error && 'at-field__hint--error') }, msg) : null);
  }

  /* Checkbox / Radio ------------------------------------------------------ */
  function choice(type) {
    return function (props) {
      var id = useId(props.id);
      var rest = omit(props, ['label', 'hint', 'className', 'id', 'indeterminate']);
      var ref = React.useRef(null);
      React.useEffect(function () { if (ref.current) ref.current.indeterminate = !!props.indeterminate; });
      return h('label', { htmlFor: id, className: cx('at-choice', props.disabled && 'at-choice--disabled', props.className) },
        h('input', Object.assign({}, rest, { ref: ref, id: id, type: type, className: 'at-' + type })),
        h('span', { className: 'at-choice__text' },
          props.label ? h('span', { className: 'small-bold at-choice__label' }, props.label) : null,
          props.hint ? h('span', { className: 'small at-choice__hint' }, props.hint) : null));
    };
  }
  var Checkbox = choice('checkbox');
  var Radio = choice('radio');

  /* Toggle ---------------------------------------------------------------- */
  function Toggle(props) {
    var id = useId(props.id);
    var rest = omit(props, ['label', 'hint', 'className', 'id', 'size']);
    return h('label', { htmlFor: id, className: cx('at-choice', props.disabled && 'at-choice--disabled', props.className) },
      h('input', Object.assign({}, rest, { id: id, type: 'checkbox', role: 'switch', className: cx('at-toggle', props.size === 'lg' && 'at-toggle--lg') })),
      h('span', { className: 'at-choice__text' },
        props.label ? h('span', { className: 'small-bold at-choice__label' }, props.label) : null,
        props.hint ? h('span', { className: 'small at-choice__hint' }, props.hint) : null));
  }

  /* Avatar ---------------------------------------------------------------- */
  function initials(name) {
    if (!name) return '';
    var p = String(name).trim().split(/\s+/);
    return ((p[0] || '')[0] + ((p.length > 1 ? p[p.length - 1] : '')[0] || '')).toUpperCase();
  }
  function Avatar(props) {
    var size = props.size || 'md';
    return h('span', { className: cx('at-avatar', 'at-avatar--' + size, props.className), title: props.name },
      props.src ? h('img', { src: props.src, alt: props.name || '' }) : h('span', { className: 'at-avatar__initials', 'aria-label': props.name }, initials(props.name)),
      props.status ? h('span', { className: 'at-avatar__status at-avatar__status--' + props.status, 'aria-label': props.status }) : null);
  }

  /* Alert ----------------------------------------------------------------- */
  var ALERT_ICON = { info: 'info', success: 'success', warning: 'alert', error: 'alert' };
  function Alert(props) {
    var tone = props.tone || 'info';
    return h('div', { role: tone === 'error' ? 'alert' : 'status', className: cx('at-alert', 'at-alert--' + tone, props.className) },
      h(Icon, { name: ALERT_ICON[tone], size: 20, className: 'at-alert__icon' }),
      h('div', { className: 'at-alert__body' },
        props.title ? h('p', { className: 'small-bold at-alert__title' }, props.title) : null,
        props.children ? h('div', { className: 'small at-alert__text' }, props.children) : null,
        props.actions ? h('div', { className: 'at-alert__actions' }, props.actions) : null),
      props.onDismiss ? h('button', { type: 'button', className: 'at-alert__x', 'aria-label': 'Dismiss', onClick: props.onDismiss }, h(Icon, { name: 'x', size: 20 })) : null);
  }

  /* Card ------------------------------------------------------------------ */
  function Card(props) {
    var rest = omit(props, ['title', 'description', 'actions', 'footer', 'className', 'children', 'padding']);
    return h('section', Object.assign({}, rest, { className: cx('at-card', props.padding === 'lg' && 'at-card--lg', props.className) }),
      (props.title || props.actions) ? h('header', { className: 'at-card__head' },
        h('div', null,
          props.title ? h('h3', { className: 'h6 at-card__title' }, props.title) : null,
          props.description ? h('p', { className: 'small at-card__desc' }, props.description) : null),
        props.actions ? h('div', { className: 'at-card__actions' }, props.actions) : null) : null,
      props.children ? h('div', { className: 'at-card__body' }, props.children) : null,
      props.footer ? h('footer', { className: 'at-card__foot' }, props.footer) : null);
  }

  /* Tabs ------------------------------------------------------------------ */
  function Tabs(props) {
    var items = props.items || [];
    var controlled = props.value !== undefined;
    var st = React.useState(props.defaultValue || (items[0] && items[0].value));
    var value = controlled ? props.value : st[0];
    function pick(v) { if (!controlled) st[1](v); if (props.onChange) props.onChange(v); }
    function onKey(e) {
      var i = items.findIndex(function (t) { return t.value === value; });
      if (e.key === 'ArrowRight') pick(items[(i + 1) % items.length].value);
      if (e.key === 'ArrowLeft') pick(items[(i - 1 + items.length) % items.length].value);
    }
    return h('div', { role: 'tablist', className: cx('at-tabs', 'at-tabs--' + (props.variant || 'underline'), props.className), onKeyDown: onKey },
      items.map(function (t) {
        var on = t.value === value;
        return h('button', { key: t.value, type: 'button', role: 'tab', 'aria-selected': on ? 'true' : 'false', tabIndex: on ? 0 : -1, className: cx('at-tab', 'small-bold', on && 'is-active'), onClick: function () { pick(t.value); } },
          t.label, t.count != null ? h('span', { className: 'at-tab__count caption-sm' }, t.count) : null);
      }));
  }

  /* ProgressBar ----------------------------------------------------------- */
  function ProgressBar(props) {
    var v = Math.max(0, Math.min(100, props.value || 0));
    return h('div', { className: cx('at-progress', props.className) },
      props.label ? h('div', { className: 'at-progress__head small-bold' }, h('span', null, props.label), props.showValue !== false ? h('span', { className: 'at-progress__val' }, Math.round(v) + '%') : null) : null,
      h('div', { className: 'at-progress__track', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': v, 'aria-label': props.label || 'Progress' },
        h('div', { className: 'at-progress__fill', style: { width: v + '%' } })));
  }

  /* MetricCard ------------------------------------------------------------ */
  function MetricCard(props) {
    var trend = props.trend || (props.change && String(props.change).trim()[0] === '-' ? 'down' : 'up');
    return h('div', { className: cx('at-metric', props.className) },
      h('p', { className: 'small-bold at-metric__label' }, props.label),
      h('div', { className: 'at-metric__row' },
        h('p', { className: 'metric-value at-metric__value' }, props.value),
        props.change ? h('span', { className: cx('at-metric__change', 'tiny-bold', 'at-metric__change--' + trend) }, h(Icon, { name: trend === 'down' ? 'arrowDown' : 'arrowUp', size: 12 }), props.change) : null),
      props.caption ? h('p', { className: 'tiny at-metric__caption' }, props.caption) : null);
  }

  /* EmptyState ------------------------------------------------------------ */
  function EmptyState(props) {
    return h('div', { className: cx('at-empty', props.className) },
      h('span', { className: 'at-empty__icon' }, h(Icon, { name: props.icon || 'search', size: 24 })),
      h('h3', { className: 'h6 at-empty__title' }, props.title),
      props.description ? h('p', { className: 'small at-empty__text' }, props.description) : null,
      props.actions ? h('div', { className: 'at-empty__actions' }, props.actions) : null);
  }

  window.Atomus = Object.assign(window.Atomus || {}, {
    Button: Button, Badge: Badge, Tag: Tag, Input: Input, Checkbox: Checkbox, Radio: Radio, Toggle: Toggle,
    Avatar: Avatar, Alert: Alert, Card: Card, Tabs: Tabs, ProgressBar: ProgressBar, MetricCard: MetricCard, EmptyState: EmptyState,
    Icon: Icon
  });
})();
