import { Section } from './parts';

export const anatomy = ['Title and "Last updated" date', 'Sticky table of contents (current section in brand text); moves above the content on tablet and mobile', 'Numbered sections: Web/Heading sm + Web/Body paragraphs'];

const TOC = ['1. Introduction', '2. Information we collect', '3. How we use information', '4. Cookies', '5. Your rights', '6. Contact'];

export default function LegalContent() {
  return (
    <Section>
      <div className="ws-head" style={{ marginBottom: 'var(--layout-md)' }}><p className="ws-title text-web-heading-xl">Privacy policy</p><p className="ws-tiny">Last updated 1 October 2026</p></div>
      <div className="ws-legal">
        <nav className="ws-toc" aria-label="Contents">{TOC.map((t) => <a key={t} href="#">{t}</a>)}</nav>
        <div className="ws-article" style={{ margin: 0 }}>
          <p className="ws-title text-web-heading-sm">1. Introduction</p>
          <p className="text-web-body">This policy explains what information Atomus collects when you use our website and products, and how we use it.</p>
          <p className="ws-title text-web-heading-sm">2. Information we collect</p>
          <p className="text-web-body">We collect the information you give us — such as your name and email address — and basic usage data from your browser.</p>
        </div>
      </div>
    </Section>
  );
}
