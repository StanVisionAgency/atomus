import { useId as useReactId } from 'react';

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Stable id for label/aria wiring; uses the caller's id when given. */
export function useFieldId(given?: string): string {
  const generated = useReactId();
  return given ?? `at${generated.replace(/:/g, '')}`;
}
