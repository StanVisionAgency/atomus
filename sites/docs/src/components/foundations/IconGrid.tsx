// Grid of the glyphs bundled with @stanvision/atomus-react (<Icon name="…" />). Rendered at build time (no hydration).
import { Icon } from '../../../../../react/src';
import type { IconName } from '../../../../../react/src/components/Icon';

const NAMES: IconName[] = ['check', 'minus', 'x', 'plus', 'info', 'alert', 'success', 'search', 'folder', 'user', 'home', 'settings', 'bell', 'menu', 'more', 'calendar', 'sort', 'arrowUp', 'arrowDown', 'chevronDown', 'chevronUp', 'chevronLeft', 'chevronRight'];

export function IconGrid() {
  return (
    <ul className="fd-icon-grid">
      {NAMES.map((n) => (
        <li key={n}>
          <Icon name={n} size={24} />
          <code>{n}</code>
        </li>
      ))}
    </ul>
  );
}
