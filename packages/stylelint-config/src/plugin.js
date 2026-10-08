// Stylelint plugin rules for Atomus. The checks themselves live in ./core.js.
import stylelint from 'stylelint';
import { RULES, DOCS, checkNoRawColor, checkNoPrimitiveToken, checkUseTokens, DEFAULT_TOKEN_DEFINITIONS } from './core.js';

const { createPlugin, utils } = stylelint;
const toRegExps = (list) => (list ?? []).map((s) => (s instanceof RegExp ? s : new RegExp(s)));

function makeRule(ruleName, check, { fixable = false, description }) {
  const messages = utils.ruleMessages(ruleName, { rejected: (message) => message });
  const rule = (primary, secondary = {}) => (root, result) => {
    const valid = utils.validateOptions(
      result,
      ruleName,
      { actual: primary, possible: [true, false] },
      { actual: secondary, possible: { tokenDefinitions: [(v) => typeof v === 'string' || v instanceof RegExp], allow: [(v) => typeof v === 'string' || v instanceof RegExp], manifest: [() => true] }, optional: true },
    );
    if (!valid || !primary) return;
    const options = {
      manifest: secondary.manifest,
      tokenDefinitions: secondary.tokenDefinitions ? toRegExps(secondary.tokenDefinitions) : DEFAULT_TOKEN_DEFINITIONS,
      allow: toRegExps(secondary.allow),
    };
    root.walkDecls((decl) => {
      let forcedColors = false;
      for (let n = decl.parent; n; n = n.parent) if (n.type === 'atrule' && n.name === 'media' && /forced-colors\s*:\s*active/.test(n.params)) forcedColors = true;
      const problems = check(decl.prop, decl.value, { ...options, forcedColors });
      for (const p of problems) {
        // Offsets are in decl.value; the declaration source is "prop" + raws.between + value.
        const offset = decl.prop.length + (decl.raws.between ?? ':').length;
        utils.report({
          ruleName,
          result,
          node: decl,
          message: messages.rejected(p.message),
          index: offset + p.index,
          endIndex: offset + p.endIndex,
          ...(fixable && p.fix ? { fix: () => { decl.value = p.fix; } } : {}),
        });
      }
    });
  };
  rule.ruleName = ruleName;
  rule.messages = messages;
  rule.meta = { url: `${DOCS}#${ruleName.replace('atomus/', 'stylelint-')}`, fixable, description };
  return createPlugin(ruleName, rule);
}

export const noRawColor = makeRule(RULES.noRawColor, checkNoRawColor, { description: 'No raw hex, rgb(), hsl() or named colours outside token definitions.' });
export const noPrimitiveToken = makeRule(RULES.noPrimitiveToken, checkNoPrimitiveToken, { description: 'No primitive colour tokens (--color-gray-500) in component CSS.' });
export const useTokens = makeRule(RULES.useTokens, checkUseTokens, { fixable: true, description: 'Colour, radius and spacing values must be var(--…) tokens.' });

export default [noRawColor, noPrimitiveToken, useTokens];
