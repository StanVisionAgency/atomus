import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import plugin from '../src/index.js';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
});
const imp = (names) => `import { ${names} } from '@stanvision/atomus-react';\n`;
const { rules } = plugin;

tester.run('no-raw-color', rules['no-raw-color'], {
  valid: [
    `const a = <div style={{ color: 'var(--color-text-primary)' }} />;`,
    `const a = <a href="#pricing">Pricing</a>;`,
    `const a = <svg><use href="#icon" /><path fill="url(#grad)" /></svg>;`,
    `const a = <div className="bg-primary text-secondary" />;`,
    `const id = '#main';`,
    `const s = css\`--color-brand-600: #4057ff;\`;`,
    `const a = <div style={{ color: 'currentColor', background: 'transparent' }} />;`,
    // Storybook args are component props (Alert color="gray"), not styles.
    `export const Flush = { args: { flush: true, color: 'gray', title: 'Heads up' } };`,
    `const a = <div className="bg-[var(--color-bg-secondary)]" />;`,
    `const shade = 'color-mix(in srgb, var(--color-fg-brand) 20%, transparent)';`,
  ],
  invalid: [
    {
      code: `const a = <div style={{ color: '#4057ff' }} />;`,
      errors: [{ messageId: 'raw', suggestions: [
        { messageId: 'suggestVar', data: { token: '--color-text-link' }, output: `const a = <div style={{ color: 'var(--color-text-link)' }} />;` },
        { messageId: 'suggestVar', data: { token: '--color-text-brand' }, output: `const a = <div style={{ color: 'var(--color-text-brand)' }} />;` },
        { messageId: 'suggestVar', data: { token: '--color-bg-brand-solid' }, output: `const a = <div style={{ color: 'var(--color-bg-brand-solid)' }} />;` },
      ] }],
    },
    { code: `const a = <div style={{ border: '1px solid rgb(0 0 0 / 10%)' }} />;`, errors: [{ messageId: 'raw' }] },
    { code: `const a = <div style={{ backgroundColor: 'hsl(210 40% 98%)' }} />;`, errors: [{ messageId: 'raw' }] },
    { code: `const a = <div style={{ color: 'red' }} />;`, errors: [{ messageId: 'raw' }] },
    { code: `const styles = { color: '#123' };`, errors: [{ messageId: 'raw' }] },
    { code: `export const S = { args: { style: { color: 'red' } } };`, errors: [{ messageId: 'raw' }] },
    { code: `const a = <path fill="#123456" />;`, errors: [{ messageId: 'raw' }] },
    {
      code: `const a = <path fill="#18181b" />;`,
      errors: [{ messageId: 'raw', suggestions: [
        { messageId: 'suggestVar', output: `const a = <path fill="var(--color-fg-primary)" />;` },
        { messageId: 'suggestVar', output: `const a = <path fill="var(--color-fg-on-warning)" />;` },
        { messageId: 'suggestVar', output: `const a = <path fill="var(--color-text-primary)" />;` },
      ] }],
    },
    {
      code: `const a = <div className="p-xl bg-[#123456]" />;`,
      errors: [{ messageId: 'raw', column: 36, endColumn: 43 }],
    },
    { code: `const a = <div className={cn('rounded-md', 'text-[rgb(1,2,3)]')} />;`, errors: [{ messageId: 'raw' }] },
    { code: 'const Box = styled.div`\n  color: #345678;\n  padding: var(--spacing-xl);\n`;', errors: [{ messageId: 'raw', line: 2 }] },
    { code: 'const box = css`box-shadow: 0 0 0 1px rgba(0,0,0,.1);`;', errors: [{ messageId: 'raw' }] },
  ],
});

tester.run('no-primitive-token', rules['no-primitive-token'], {
  valid: [
    `const a = <div style={{ color: 'var(--color-text-primary)' }} />;`,
    `const a = <div className="bg-secondary text-tertiary border-secondary" />;`,
    `const s = '--color-brand-600: var(--color-violet-600)';`,
    `const a = <div className="grid-cols-2 gap-xl" />;`,
  ],
  invalid: [
    {
      code: `const a = <div style={{ color: 'var(--color-gray-500)' }} />;`,
      errors: [{ messageId: 'primitive', suggestions: [
        { messageId: 'suggest', output: `const a = <div style={{ color: 'var(--color-text-tertiary)' }} />;` },
        { messageId: 'suggest', output: `const a = <div style={{ color: 'var(--color-text-placeholder)' }} />;` },
        { messageId: 'suggest', output: `const a = <div style={{ color: 'var(--color-fg-tertiary)' }} />;` },
      ] }],
    },
    {
      code: `const a = <p className="text-gray-500 hover:bg-gray-100" />;`,
      errors: [
        { messageId: 'primitiveClass', suggestions: [
          { messageId: 'suggest', output: `const a = <p className="text-tertiary hover:bg-gray-100" />;` },
          { messageId: 'suggest', output: `const a = <p className="text-placeholder hover:bg-gray-100" />;` },
        ] },
        { messageId: 'primitiveClass', suggestions: [
          { messageId: 'suggest', output: `const a = <p className="text-gray-500 hover:bg-tertiary" />;` },
          { messageId: 'suggest', output: `const a = <p className="text-gray-500 hover:bg-disabled" />;` },
        ] },
      ],
    },
    {
      code: 'const Box = styled.div`border-color: var(--color-brand-600);`;',
      errors: [{ messageId: 'primitive', suggestions: [
        { messageId: 'suggest', output: 'const Box = styled.div`border-color: var(--color-border-brand);`;' },
        { messageId: 'suggest', output: 'const Box = styled.div`border-color: var(--color-text-link);`;' },
        { messageId: 'suggest', output: 'const Box = styled.div`border-color: var(--color-text-brand);`;' },
      ] }],
    },
  ],
});

tester.run('no-arbitrary-value', rules['no-arbitrary-value'], {
  valid: [
    `const a = <div className="p-xl gap-lg rounded-md bg-primary" />;`,
    `const a = <div className="p-[var(--spacing-xl)] text-[14px] border-[2px] w-[320px]" />;`,
    `const a = <div className="bg-[#fff]" />;`, // reported by no-raw-color, not twice
    `const a = <div title="p-[16px]" />;`,
  ],
  invalid: [
    { code: `const a = <div className="p-[16px]" />;`, output: `const a = <div className="p-xl" />;`, errors: [{ messageId: 'arbitrary' }] },
    { code: `const a = <div className="md:-mt-[8px] gap-x-[24px]" />;`, output: `const a = <div className="md:-mt-md gap-x-3xl" />;`, errors: 2 },
    { code: `const a = <div className={clsx('px-[13px]', ok && 'py-[2px]')} />;`, output: `const a = <div className={clsx('px-[13px]', ok && 'py-xxs')} />;`, errors: 2 },
    {
      code: `const a = <div className="rounded-[8px]" />;`,
      output: null,
      errors: [{ messageId: 'arbitrary', suggestions: [{ messageId: 'suggest', output: `const a = <div className="rounded-md" />;` }] }],
    },
    { code: `const a = <div className="bg-[red] [padding:10px]" />;`, errors: 2 },
  ],
});

tester.run('valid-props', rules['valid-props'], {
  valid: [
    imp('Button') + `const a = <Button hierarchy="primary" size="md" onClick={go} aria-label="x" data-id="1" type="submit">Save</Button>;`,
    imp('Alert') + `const a = <Alert color="danger" title="Failed" />;`,
    imp('Modal, Button') + `const a = <Modal open onClose={close} title="Delete project?" actions={<Button>Cancel</Button>} />;`,
    imp('Button, type ButtonProps') + `const a = (p: ButtonProps) => <Button {...p} />;`,
    `import type { TabItem } from '@stanvision/atomus-react';`,
    `import { Drawer } from './drawer';\nconst a = <Drawer side="left" />;`,
    imp('Input') + `const a = <Input label="Email" type="email" name="email" required size="lg" ref={r} />;`,
    `import * as A from '@stanvision/atomus-react';\nconst a = <A.Badge color="success">Active</A.Badge>;`,
  ],
  invalid: [
    {
      code: imp('Button') + `const a = <Button hierarchy="danger">Delete</Button>;`,
      errors: [{ messageId: 'invalidValue', suggestions: ['primary', 'secondary', 'outline', 'tertiary', 'link'].map((v) => ({ messageId: 'suggestValue', output: imp('Button') + `const a = <Button hierarchy="${v}">Delete</Button>;` })) }],
    },
    {
      code: imp('Button') + `const a = <Button hierarchy="Primary">Save</Button>;`,
      output: imp('Button') + `const a = <Button hierarchy="primary">Save</Button>;`,
      errors: [{ messageId: 'invalidValue' }],
    },
    { code: imp('Button') + `const a = <Button variant="ghost">Save</Button>;`, errors: [{ messageId: 'unknownProp' }] },
    {
      code: imp('Card') + `const a = <Card Style="filled" />;`,
      errors: [{ messageId: 'unknownProp', suggestions: [{ messageId: 'suggestProp', output: imp('Card') + `const a = <Card variant="filled" />;` }] }],
    },
    { code: `import { Drawer } from '@stanvision/atomus-react';`, errors: [{ messageId: 'figmaOnly' }] },
    { code: `import { Sheet } from '@stanvision/atomus-react';`, errors: [{ messageId: 'unknownExport' }] },
    { code: imp('Modal') + `const a = <Modal open title="x" />;`, errors: [{ messageId: 'missingProp' }] },
    {
      code: imp('Tabs') + `const a = <Tabs items={items} variant={'pills'} />;`,
      errors: [{ messageId: 'invalidValue', suggestions: ['underline', 'pill', 'segmented'].map((v) => ({ messageId: 'suggestValue', output: imp('Tabs') + `const a = <Tabs items={items} variant={"${v}"} />;` })) }],
    },
    { code: `import * as A from '@stanvision/atomus-react';\nconst a = <A.Drawer />;`, errors: [{ messageId: 'figmaOnly' }] },
    { code: imp('Badge') + `const a = <Badge ref={r}>x</Badge>;`, errors: [{ messageId: 'unknownProp' }] },
  ],
});

tester.run('prefer-atomus-component', rules['prefer-atomus-component'], {
  valid: [
    `const a = <button onClick={go}>Go</button>;`, // no Atomus import: not this rule's business
    imp('Button') + `const a = <><Button>Go</Button><input type="file" /><input type="hidden" name="id" /></>;`,
    { code: imp('Button') + `const a = <button role="tab">x</button>;` },
    { code: imp('Button') + `const a = <dialog open />;`, options: [{ allow: ['dialog'] }] },
  ],
  invalid: [
    { code: imp('Card') + `const a = <button onClick={go}>Go</button>;`, errors: [{ messageId: 'prefer', data: { component: 'Button', tag: 'button', pkg: '@stanvision/atomus-react' } }] },
    { code: imp('Card') + `const a = <input type="checkbox" />;`, errors: [{ messageId: 'prefer' }] },
    { code: imp('Card') + `const a = <><select /><dialog /><input /></>;`, errors: 3 },
  ],
});

tester.run('icon-only-needs-label', rules['icon-only-needs-label'], {
  valid: [
    imp('Button') + `const a = <Button iconOnly aria-label="Delete project" iconLeading={<TrashIcon />} />;`,
    imp('Button') + `const a = <Button iconLeading={<PlusIcon />}>New project</Button>;`,
    imp('Button') + `const a = <Button iconOnly {...props} />;`,
    `const a = <Button iconOnly />;`, // not Atomus
  ],
  invalid: [
    { code: imp('Button') + `const a = <Button iconOnly iconLeading={<TrashIcon />} />;`, errors: [{ messageId: 'missing' }] },
    { code: imp('Button') + `const a = <Button hierarchy="tertiary" iconLeading={<DotsIcon />} />;`, errors: [{ messageId: 'missing' }] },
    { code: imp('Button') + `const a = <Button iconOnly aria-label="" />;`, errors: [{ messageId: 'empty' }] },
  ],
});

tester.run('one-primary-per-view', rules['one-primary-per-view'], {
  valid: [
    imp('Button') + `function Page() { return <><Button hierarchy="outline">Cancel</Button><Button hierarchy="primary">Save</Button></>; }`,
    imp('Button, Modal') + `function Page() { return <><Button hierarchy="primary">New project</Button><Modal open onClose={c} title="New" actions={<Button hierarchy="primary">Create</Button>} /></>; }`,
    imp('Button') + `function Page() { return ok ? <Button hierarchy="primary">Save</Button> : <Button hierarchy="primary">Retry</Button>; }`,
    imp('Button') + `function A() { return <Button hierarchy="primary">A</Button>; }\nfunction B() { return <Button hierarchy="primary">B</Button>; }`,
  ],
  invalid: [
    {
      code: imp('Button') + `function Page() { return <><Button hierarchy="primary">Save</Button><Button hierarchy="primary">Publish</Button></>; }`,
      errors: [{ messageId: 'extra', line: 2 }],
    },
    {
      code: imp('Button, Modal') + `const Dialog = () => <Modal open onClose={c} title="x" actions={<><Button hierarchy="primary">A</Button><Button hierarchy="primary">B</Button></>} />;`,
      errors: 1,
    },
  ],
});

describe('configs', () => {
  it('recommended and strict enable every rule', async () => {
    const { strict, recommended } = plugin.configs;
    const names = Object.keys(rules).map((r) => `atomus/${r}`);
    for (const n of names) {
      if (!recommended.rules[n] || strict.rules[n] !== 'error') throw new Error(`${n} missing from a config`);
    }
  });
  it('lints a file end to end with the flat config', async () => {
    const { Linter } = await import('eslint');
    const linter = new Linter({ configType: 'flat' });
    const code = imp('Button') + `export function Toolbar() { return <div className="p-[16px]" style={{ color: '#4057ff' }}><Button hierarchy="danger" iconOnly /></div>; }`;
    const messages = linter.verify(code, [{ ...plugin.configs.recommended, languageOptions: { ...plugin.configs.recommended.languageOptions, parser: tsParser } }], 'Toolbar.tsx');
    const ids = messages.map((m) => m.ruleId).sort();
    const expected = ['atomus/icon-only-needs-label', 'atomus/no-arbitrary-value', 'atomus/no-raw-color', 'atomus/valid-props'];
    if (JSON.stringify(ids) !== JSON.stringify(expected)) throw new Error(`unexpected: ${JSON.stringify(messages, null, 2)}`);
  });
});
