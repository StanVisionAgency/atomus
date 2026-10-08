// Live examples for the Agent kit pages (docs.atomus.io/components/ai-*). They import the real package
// source, so the docs always show the shipped components. The streaming in these demos is simulated
// with timers: the components only need a growing string and a status, from any AI SDK or backend.
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AILabel, Approval, Avatar, Button, ContextMeter, Feedback, Icon, InlineCitation, Message, ModelSelector, PromptInput,
  Reasoning, Shimmer, Sources, StreamingText, Suggestions, ToolCall,
  type ApprovalDecision, type ModelOption, type PromptAttachment, type PromptTrigger, type ReasoningStep, type SourceItem,
} from '../../../../react/src';

// ---------------------------------------------------------------- shared sample data

/** Provider mark: initials in a tinted square (real products pass the provider's logo). */
function ProviderMark({ letter }: { letter: string }) {
  return <span className="ai-provider" aria-hidden="true">{letter}</span>;
}

export const MODELS: ModelOption[] = [
  { value: 'atomus-pro', label: 'Atomus Pro', provider: 'StanVision', icon: <ProviderMark letter="A" />, description: 'Best for long, careful work', capabilities: ['Reasoning', 'Tools', 'Vision'], badge: 'New' },
  { value: 'atomus-fast', label: 'Atomus Fast', provider: 'StanVision', icon: <ProviderMark letter="A" />, description: 'Quick answers and drafts', capabilities: ['Tools', 'Fast'] },
  { value: 'claude-sonnet', label: 'Claude Sonnet', provider: 'Anthropic', icon: <ProviderMark letter="C" />, description: 'Coding and analysis', capabilities: ['Reasoning', 'Tools', 'Vision'] },
  { value: 'local-8b', label: 'Local 8B', provider: 'On device', icon: <ProviderMark letter="L" />, description: 'Private, works offline', capabilities: ['Fast'], disabled: true },
];

export const SOURCES: SourceItem[] = [
  { id: 'contrast', title: 'Understanding SC 1.4.3: Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum', snippet: 'The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.' },
  { id: 'labels', title: 'Understanding SC 3.3.2: Labels or Instructions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions', snippet: 'Labels or instructions are provided when content requires user input. A placeholder is not a label.' },
  { id: 'focus', title: 'Understanding SC 2.4.3: Focus Order', url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order', snippet: 'Focusable components receive focus in an order that preserves meaning and operability.' },
];

const ANSWER =
  'I audited the checkout page and found 3 issues that block WCAG 2.2 AA. The Pay button label has a contrast of 3.1:1, below the 4.5:1 minimum for text [1]. The card-number field uses its placeholder as its only label, so screen readers announce it as “edit text” [2]. After a payment error, focus jumps to the top of the page instead of the error message [3].\n\nI filed all three in Linear with fixes that use the Atomus tokens and the Input component.';

/** Turns "[1]" markers into InlineCitation chips. */
function withCitations(text: string, sources: SourceItem[] = SOURCES): ReactNode {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    const m = part.match(/^\[(\d+)\]$/);
    const src = m ? sources[+m[1] - 1] : undefined;
    return src ? <InlineCitation key={i} index={+m![1]} source={src} /> : <Fragment key={i}>{part}</Fragment>;
  });
}

const STEPS: ReasoningStep[] = [
  { id: 'a', label: 'Load checkout.atomus.io in a headless browser' },
  { id: 'b', label: 'Run axe-core against WCAG 2.2 AA rules', detail: '68 rules · 3 violations · 0 incomplete' },
  { id: 'c', label: 'Group violations by component and draft fixes' },
];

const COMMANDS: PromptTrigger[] = [
  {
    char: '/', label: 'Commands', items: [
      { value: 'audit', label: 'Audit a page', description: 'Run an accessibility audit with axe-core', icon: <Icon name="shield" size={16} /> },
      { value: 'summarize', label: 'Summarize', description: 'Summarize the open document', icon: <Icon name="file" size={16} /> },
      { value: 'tokens', label: 'Find a token', description: 'Search Atomus tokens by role', icon: <Icon name="search" size={16} /> },
      { value: 'translate', label: 'Translate', description: 'Translate the selection', icon: <Icon name="globe" size={16} /> },
    ],
  },
  {
    char: '@', label: 'People and agents', items: [
      { value: 'kristina', label: 'Kristina', description: 'Design lead' },
      { value: 'design-agent', label: 'Design agent', description: 'Builds UI with Atomus' },
      { value: 'qa-agent', label: 'QA agent', description: 'Checks accessibility and tokens' },
    ],
  },
];

const STARTERS = [
  { id: 'audit', label: 'Audit our checkout page', description: 'Find WCAG 2.2 issues and file them', icon: <Icon name="shield" size={16} />, prompt: 'Audit our checkout page for accessibility issues and file what you find.' },
  { id: 'tokens', label: 'Which token for a card border?', description: 'Pick semantic tokens by role', icon: <Icon name="search" size={16} />, prompt: 'Which token should I use for a card border?' },
  { id: 'draft', label: 'Draft release notes', description: 'From the merged pull requests', icon: <Icon name="edit" size={16} />, prompt: 'Draft release notes for this week.' },
  { id: 'explain', label: 'Explain radius modes', description: 'Default, sharp and round', icon: <Icon name="lightbulb" size={16} />, prompt: 'Explain the radius modes.' },
];

/** Streams `full` into a string, `chars` per tick. Returns [text, done, stop]. */
function useFakeStream(full: string, running: boolean, speed = 18, chars = 3, runKey = 0): [string, boolean, () => void] {
  const [n, setN] = useState(0);
  const stopped = useRef(false);
  useEffect(() => {
    if (!running) return;
    stopped.current = false;
    setN(0);
    const t = window.setInterval(() => {
      setN((x) => {
        if (stopped.current || x >= full.length) { window.clearInterval(t); return x; }
        return Math.min(full.length, x + chars);
      });
    }, speed);
    return () => window.clearInterval(t);
  }, [running, full, speed, chars, runKey]);
  const stop = useCallback(() => { stopped.current = true; }, []);
  return [full.slice(0, n), n >= full.length, stop];
}

const userAvatar = <Avatar name="Kristina Stan" size="sm" />;

// ---------------------------------------------------------------- Conversation (docs-only shell)

type Phase = 'welcome' | 'thinking' | 'tool' | 'approval' | 'streaming' | 'done' | 'stopped' | 'denied';

/**
 * A full conversation: welcome state with prompt starters, then reasoning, a tool call, an approval,
 * a streamed answer with citations, sources, feedback and follow-ups. `initial="done"` renders the end state.
 */
export function ConversationDemo({ initial = 'welcome' }: { initial?: 'welcome' | 'done' }) {
  const [phase, setPhase] = useState<Phase>(initial === 'done' ? 'done' : 'welcome');
  const [prompt, setPrompt] = useState(initial === 'done' ? STARTERS[0].prompt! : '');
  const [draft, setDraft] = useState('');
  const [model, setModel] = useState('atomus-pro');
  const [stepsDone, setStepsDone] = useState(initial === 'done' ? 3 : 0);
  const [thought, setThought] = useState(initial === 'done' ? 8 : 0);
  const [decision, setDecision] = useState<'pending' | 'approved' | 'denied'>(initial === 'done' ? 'approved' : 'pending');
  const [streamed, streamDone, stopStream] = useFakeStream(ANSWER, phase === 'streaming');
  const [stoppedText, setStoppedText] = useState('');
  // Furthest step reached: 0 thinking · 1 tool · 2 approval · 3 answer (keeps the record when stopped).
  const [reached, setReached] = useState(initial === 'done' ? 3 : 0);
  useEffect(() => {
    const at = { thinking: 0, tool: 1, approval: 2, streaming: 3, done: 3 }[phase as string];
    if (at !== undefined) setReached((r) => Math.max(r, at));
  }, [phase]);
  const end = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);

  const start = (text: string) => {
    setPrompt(text);
    setDraft('');
    setStepsDone(0);
    setThought(0);
    setDecision('pending');
    setReached(0);
    setPhase('thinking');
  };

  // Reasoning: one step every 900ms, then the tool call.
  useEffect(() => {
    if (phase !== 'thinking') return;
    const t = window.setInterval(() => {
      setThought((s) => s + 1);
      setStepsDone((s) => {
        if (s >= 2) { window.clearInterval(t); window.setTimeout(() => setPhase('tool'), 500); return 3; }
        return s + 1;
      });
    }, 900);
    return () => window.clearInterval(t);
  }, [phase]);
  useEffect(() => {
    if (phase !== 'tool') return;
    const t = window.setTimeout(() => setPhase('approval'), 1600);
    return () => window.clearTimeout(t);
  }, [phase]);
  useEffect(() => { if (phase === 'streaming' && streamDone) setPhase('done'); }, [phase, streamDone]);
  // Keep the newest content in view inside the thread (never scrolls the docs page).
  useEffect(() => {
    const el = thread.current;
    if (el && phase !== 'welcome') el.scrollTop = el.scrollHeight;
  }, [phase, streamed, stepsDone, reached, decision]);

  const approve = (d: ApprovalDecision) => { void d; setDecision('approved'); setPhase('streaming'); };
  const deny = () => { setDecision('denied'); setPhase('denied'); };
  const stop = () => {
    stopStream();
    setStoppedText(phase === 'streaming' ? streamed : '');
    if (decision === 'pending' && reached >= 2) setDecision('denied');
    setPhase('stopped');
  };

  const busy = phase === 'thinking' || phase === 'tool' || phase === 'streaming';
  const toolStatus = reached < 1 ? null : phase === 'tool' ? 'running' : 'success';
  const steps: ReasoningStep[] = STEPS.map((s, i) => ({ ...s, status: i < stepsDone ? 'done' : i === stepsDone && phase === 'thinking' ? 'active' : 'pending' }));
  const answer = phase === 'done' ? ANSWER : phase === 'stopped' ? stoppedText : streamed;

  return (
    <div className="ai-frame">
      <header className="ai-frame__header">
        <div className="ai-frame__title">
          <span className="ai-frame__logo" aria-hidden="true"><Icon name="sparkle" size={16} /></span>
          <span className="ai-frame__name">Atomus Assistant</span>
          <AILabel size="xs" label="Beta" explanation={<p>An assistant that knows the Atomus tokens, components and guidelines. It can run audits and file issues after you approve them.</p>} model="Atomus Pro" />
        </div>
        <div className="ai-frame__header-actions">
          <ContextMeter used={phase === 'welcome' ? 1200 : 48210} limit={200000} cost={phase === 'welcome' ? 0.002 : 0.184} breakdown={[{ label: 'Input', tokens: 39200 }, { label: 'Output', tokens: 6810 }, { label: 'Tools', tokens: 2200 }]} />
          {phase !== 'welcome' ? <Button size="sm" hierarchy="tertiary" iconLeading={<Icon name="plus" size={16} />} onClick={() => { setPhase('welcome'); setPrompt(''); }}>New chat</Button> : null}
        </div>
      </header>

      <div ref={thread} className="ai-frame__thread" role="log" aria-label="Conversation" aria-live="off" tabIndex={0}>
        {phase === 'welcome' ? (
          <div className="ai-welcome">
            <span className="ai-welcome__mark" aria-hidden="true"><span className="at-ai-mark" style={{ width: 28, height: 28 }} /></span>
            <h2 className="ai-welcome__title">How can I help with your design system?</h2>
            <p className="ai-welcome__text">Ask about tokens and components, or let the assistant audit a page. It asks before it changes anything.</p>
            <Suggestions variant="cards" label="Prompt starters" suggestions={STARTERS} onSelect={(p) => start(p)} />
          </div>
        ) : (
          <div className="ai-frame__messages">
            <Message role="user" name="Kristina" time="2:41 PM" copyText={prompt} onEdit={() => {}} actionsVisibility="hover">
              <p>{prompt}</p>
            </Message>
            <Message
              role="assistant"
              name="Atomus Assistant"
              time="2:41 PM"
              status={phase === 'stopped' ? 'stopped' : busy ? 'streaming' : 'done'}
              copyText={phase === 'done' ? ANSWER : undefined}
              onRegenerate={phase === 'done' || phase === 'stopped' ? () => start(prompt) : undefined}
              branch={phase === 'done' ? { index: 2, count: 2, onPrevious: () => {} } : undefined}
              actions={phase === 'done' ? <Feedback /> : undefined}
            >
              <Reasoning status={phase === 'thinking' ? 'thinking' : 'done'} duration={thought} steps={steps} />
              {toolStatus ? (
                <ToolCall
                  name="run_axe_audit"
                  title={toolStatus === 'running' ? 'Auditing checkout.atomus.io' : 'Audited checkout.atomus.io'}
                  status={toolStatus}
                  duration={1480}
                  input={{ url: 'https://checkout.atomus.io', standard: 'wcag22aa' }}
                  output={toolStatus === 'success' ? { violations: 3, passes: 65, incomplete: 0, rules: ['color-contrast', 'label', 'focus-order-semantics'] } : undefined}
                />
              ) : null}
              {reached >= 2 ? (
                <Approval
                  title="File 3 issues in Linear?"
                  risk="medium"
                  toolName="linear.create_issues"
                  status={decision}
                  editableText={'1. Pay button: label contrast 3.1:1 (needs 4.5:1)\n2. Card number: placeholder used as label\n3. Payment error: focus jumps to page top'}
                  alwaysAllowLabel="Always allow in this chat"
                  onApprove={approve}
                  onDeny={deny}
                >
                  Creates three issues in the <strong>Checkout</strong> project and assigns them to the design team.
                </Approval>
              ) : null}
              {phase === 'streaming' || phase === 'done' || phase === 'stopped' ? (
                <StreamingText text={answer} streaming={phase === 'streaming'} render={(t) => withCitations(t)} />
              ) : null}
              {phase === 'denied' ? <p>Okay, I didn’t file anything. The audit results are above if you want to handle them yourself.</p> : null}
              {phase === 'done' ? <Sources sources={SOURCES} /> : null}
            </Message>
            {phase === 'done' ? (
              <Suggestions label="Follow-up prompts" mode="insert" suggestions={['Fix the contrast issue', 'Show the axe report', 'Audit the account page too']} onSelect={(p) => setDraft(p)} />
            ) : null}
            <div ref={end} />
          </div>
        )}
      </div>

      <div className="ai-frame__composer">
        <PromptInput
          value={draft}
          onChange={setDraft}
          status={busy ? 'streaming' : 'ready'}
          onSubmit={(t) => start(t)}
          onStop={stop}
          placeholder="Ask Atomus Assistant… (type / for commands)"
          triggers={COMMANDS}
          onAttach={() => {}}
          toolbar={<ModelSelector models={MODELS} value={model} onChange={setModel} />}
          disclaimer="AI can make mistakes. Check important information."
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- PromptInput

export function PromptInputDemo() {
  const [files, setFiles] = useState<PromptAttachment[]>([
    { id: '1', name: 'checkout-flow.fig', size: '4.2 MB' },
    { id: '2', name: 'audit-report.pdf', size: '820 KB' },
    { id: '3', name: 'screenshot.png', status: 'uploading' },
  ]);
  const [status, setStatus] = useState<'ready' | 'streaming'>('ready');
  const [last, setLast] = useState('');
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <div className="at-stack" style={{ paddingTop: 120 }}>
      <PromptInput
        size="lg"
        attachments={files}
        onAttach={() => setFiles((f) => [...f, { id: String(Date.now()), name: `notes-${f.length + 1}.md`, size: '3 KB' }])}
        onRemoveAttachment={(id) => setFiles((f) => f.filter((x) => x.id !== id))}
        triggers={COMMANDS}
        status={status}
        onSubmit={(t) => { setLast(t); setStatus('streaming'); timer.current = window.setTimeout(() => setStatus('ready'), 3000); }}
        onStop={() => { window.clearTimeout(timer.current); setStatus('ready'); }}
        toolbar={<ModelSelector models={MODELS} defaultValue="atomus-pro" />}
        actions={<ContextMeter used={48210} limit={200000} cost={0.184} />}
        placeholder="Ask anything… type / for commands or @ to mention"
        disclaimer="AI can make mistakes. Check important information."
      />
      <p className="ai-note">{last ? <>Sent: “{last}” — the button turns into Stop for 3 seconds.</> : 'Type / or @ to open a menu. Enter sends, Shift+Enter adds a line. The uploading file blocks Send until you remove it.'}</p>
    </div>
  );
}

export function PromptInputStatesDemo() {
  return (
    <div className="at-stack">
      <PromptInput defaultValue="" placeholder="Ask anything…" />
      <PromptInput defaultValue="Summarize the latest release notes" status="streaming" onStop={() => {}} />
      <PromptInput placeholder="Upgrade to keep chatting" disabled />
    </div>
  );
}

// ---------------------------------------------------------------- Message

export function MessageDemo() {
  const [version, setVersion] = useState(1);
  return (
    <div className="ai-thread">
      <Message role="system">Kristina added the <strong>QA agent</strong> to this chat · Today</Message>
      <Message role="user" name="Kristina" avatar={userAvatar} time="2:40 PM" copyText="Which token should I use for a card border?" onEdit={() => {}}>
        <p>Which token should I use for a card border?</p>
      </Message>
      <Message
        role="assistant"
        name="Atomus Assistant"
        time="2:40 PM"
        copyText="Use border-secondary."
        onRegenerate={() => {}}
        branch={{ index: version, count: 3, onPrevious: () => setVersion((v) => Math.max(1, v - 1)), onNext: () => setVersion((v) => Math.min(3, v + 1)) }}
        actions={<Feedback />}
      >
        {version === 1 ? (
          <p>Use <code>--color-border-secondary</code>. It is the hairline for cards, tables and dividers, and it switches with Light and Dark mode. Keep <code>border-primary</code> for inputs and other controls.</p>
        ) : version === 2 ? (
          <p>Cards use <code>border-secondary</code>; controls use <code>border-primary</code>. Never pick a gray from the ramp directly.</p>
        ) : (
          <p>Short answer: <code>var(--color-border-secondary)</code>.</p>
        )}
      </Message>
    </div>
  );
}

export function MessageStatusDemo() {
  return (
    <div className="ai-thread">
      <Message role="assistant" name="Atomus Assistant" status="streaming">
        <StreamingText text="Checking the token files for every border colour that" streaming announce="off" />
      </Message>
      <Message role="assistant" name="Atomus Assistant" status="stopped" copyText="Here are the three radius modes:" onRegenerate={() => {}}>
        <p>Here are the three radius modes:</p>
      </Message>
      <Message role="assistant" name="Atomus Assistant" status="error" onRegenerate={() => {}} errorMessage="The model is overloaded. Your message was not lost." />
      <Message role="tool" name="QA agent" time="2:44 PM">
        <ToolCall name="validate_tokens" title="Validated 18 files" status="success" duration={640} input={{ paths: ['src/'] }} output={{ errors: 0, warnings: 2 }} />
      </Message>
    </div>
  );
}

// ---------------------------------------------------------------- StreamingText + Shimmer

export function StreamingTextDemo() {
  const [run, setRun] = useState(0);
  const [text, done] = useFakeStream(ANSWER.split('\n\n')[0], run > 0, 28, 2, run);
  useEffect(() => { setRun(1); }, []);
  return (
    <div className="at-stack">
      <div className="ai-card">
        <StreamingText text={text} streaming={!done} render={(t) => withCitations(t)} />
      </div>
      <div className="at-row">
        <Button size="sm" hierarchy="outline" iconLeading={<Icon name="refresh" size={16} />} onClick={() => setRun((r) => r + 1)} disabled={!done}>Stream again</Button>
        <span className="ai-note">{done ? 'Done — screen readers heard it in sentence batches.' : 'Streaming…'}</span>
      </div>
    </div>
  );
}

export function ShimmerDemo() {
  return (
    <div className="at-row" style={{ gap: 'var(--spacing-3xl)' }}>
      <Shimmer>Thinking…</Shimmer>
      <Shimmer>Searching 12 sources…</Shimmer>
      <Shimmer>Writing the summary…</Shimmer>
      <Shimmer active={false}>Static (reduced motion)</Shimmer>
    </div>
  );
}

// ---------------------------------------------------------------- Reasoning

export function ReasoningDemo() {
  const [k, setK] = useState(0);
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    const t = window.setInterval(() => setI((x) => (x >= 3 ? (window.clearInterval(t), 3) : x + 1)), 1200);
    return () => window.clearInterval(t);
  }, [k]);
  const steps = STEPS.map((s, n) => ({ ...s, status: (n < i ? 'done' : n === i ? 'active' : 'pending') as ReasoningStep['status'] }));
  return (
    <div className="ai-grid-2">
      <div className="at-stack">
        <span className="ai-eyebrow">Live</span>
        <Reasoning key={k} status={i >= 3 ? 'done' : 'thinking'} duration={Math.round(i * 1.2)} steps={steps} />
        <div><Button size="xs" hierarchy="outline" onClick={() => setK((x) => x + 1)}>Replay</Button></div>
      </div>
      <div className="at-stack">
        <span className="ai-eyebrow">Done, expanded</span>
        <Reasoning status="done" duration={12} steps={STEPS} defaultOpen>
          <p>The contrast issue comes from a hard-coded gray on the brand fill. Swapping it for <code>text-on-brand</code> fixes it in both modes.</p>
        </Reasoning>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- ToolCall

export function ToolCallDemo() {
  return (
    <div className="at-stack" style={{ gap: 'var(--spacing-md)' }}>
      <ToolCall name="search_docs" title="Search the Atomus docs" status="pending" input={{ query: 'card border token' }} />
      <ToolCall name="run_axe_audit" title="Auditing checkout.atomus.io" status="running" input={{ url: 'https://checkout.atomus.io', standard: 'wcag22aa' }} />
      <ToolCall name="run_axe_audit" title="Audited checkout.atomus.io" status="success" duration={1480} defaultOpen input={{ url: 'https://checkout.atomus.io', standard: 'wcag22aa' }} output={{ violations: 3, passes: 65, incomplete: 0 }} />
      <ToolCall name="linear.create_issues" title="Filing issues in Linear" status="error" duration={320} input={{ project: 'Checkout', count: 3 }} error="Linear returned 401: the connection expired. Reconnect Linear and try again." />
    </div>
  );
}

// ---------------------------------------------------------------- Approval

export function ApprovalDemo() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'denied'>('pending');
  return (
    <div className="at-stack">
      <Approval
        title="Send this summary to #design-system?"
        risk="medium"
        toolName="slack.post_message"
        status={status}
        editableText={'Weekly update: 3 accessibility issues fixed on checkout, radius tokens shipped in Figma, Agent kit in review.'}
        alwaysAllowLabel="Always allow posting to #design-system"
        onApprove={() => setStatus('approved')}
        onDeny={() => setStatus('denied')}
      >
        The assistant will post one message as you. 46 people are in the channel.
      </Approval>
      {status !== 'pending' ? <div><Button size="xs" hierarchy="outline" onClick={() => setStatus('pending')}>Reset</Button></div> : null}
    </div>
  );
}

export function ApprovalRiskDemo() {
  return (
    <div className="at-stack">
      <Approval title="Read 3 files in /design-tokens?" risk="low" toolName="fs.read" onApprove={() => {}} onDeny={() => {}}>
        Read-only. Nothing is changed.
      </Approval>
      <Approval
        title="Delete 214 unused variables from the Figma file?"
        risk="high"
        toolName="figma.delete_variables"
        details={<p className="at-approval__preview">Collections: Color (128), Spacing (52), Radius (34). This can’t be undone from the assistant.</p>}
        approveLabel="Delete variables"
        onApprove={() => {}}
        onDeny={() => {}}
      >
        Removes the variables from every page and mode of <strong>Atomus 4.0</strong>.
      </Approval>
    </div>
  );
}

// ---------------------------------------------------------------- Sources + InlineCitation

export function SourcesDemo() {
  return (
    <div className="at-stack">
      <p className="ai-prose">{withCitations('Body text needs a contrast of at least 4.5:1 [1]. Every field needs a visible label; a placeholder is not one [2]. After an error, move focus to the message, not to the top of the page [3].')}</p>
      <Sources sources={SOURCES} defaultOpen />
    </div>
  );
}

export function SourcesListDemo() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Sources sources={SOURCES} variant="list" label="Sources" />
    </div>
  );
}

// ---------------------------------------------------------------- Suggestions

export function SuggestionsDemo() {
  const [picked, setPicked] = useState('');
  return (
    <div className="at-stack">
      <Suggestions suggestions={['Fix the contrast issue', 'Show the axe report', 'Audit the account page too', 'Compare with last week', 'Export as CSV']} onSelect={(p) => setPicked(`Sent: ${p}`)} />
      <Suggestions mode="insert" wrap label="Follow-up prompts" suggestions={['Make it shorter', 'Use a friendlier tone', 'Add a table']} onSelect={(p) => setPicked(`Inserted: ${p}`)} />
      <p className="ai-note" aria-live="polite">{picked || 'Send chips send right away; insert chips (+) fill the input so you can edit first.'}</p>
    </div>
  );
}

export function SuggestionCardsDemo() {
  return <Suggestions variant="cards" label="Prompt starters" suggestions={STARTERS} />;
}

// ---------------------------------------------------------------- ModelSelector

export function ModelSelectorDemo() {
  const [m, setM] = useState('atomus-pro');
  return (
    <div className="at-stack" style={{ minHeight: 520 }}>
      <div className="at-stack" style={{ gap: 'var(--spacing-md)', maxWidth: 320 }}>
        <span className="ai-eyebrow">Outline — settings</span>
        <ModelSelector models={MODELS} value={m} onChange={setM} variant="outline" size="md" showLabel label="Default model" placement="down" />
      </div>
      <div className="at-stack" style={{ gap: 'var(--spacing-md)' }}>
        <span className="ai-eyebrow">Ghost — in a prompt toolbar (open)</span>
        <div><ModelSelector models={MODELS} value={m} onChange={setM} placement="down" defaultOpen /></div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Feedback

export function FeedbackDemo() {
  const [log, setLog] = useState('');
  return (
    <div className="at-stack" style={{ minHeight: 280 }}>
      <Feedback defaultValue="down" onSubmit={(f) => setLog(`${f.rating} · ${f.reasons.join(', ') || 'no reason'}${f.comment ? ` · “${f.comment}”` : ''}`)} />
      <p className="ai-note">{log ? `Submitted: ${log}` : 'Thumbs are toggle buttons. A thumbs down opens the reason form and moves focus into it; Esc closes it.'}</p>
    </div>
  );
}

// ---------------------------------------------------------------- AILabel

export function AILabelDemo() {
  return (
    <div className="at-stack">
      <div className="at-row">
        <AILabel size="xs" />
        <AILabel size="sm" label="AI generated" />
        <AILabel size="md" label="Draft by AI" />
        <AILabel variant="inline" label="AI summary" />
        <AILabel variant="icon" label="AI generated" />
      </div>
      <div className="at-row" style={{ minHeight: 220, alignItems: 'flex-start' }}>
        <AILabel
          label="AI generated"
          defaultOpen
          model="Atomus Pro"
          explanation={<><p>This summary was written from the 14 comments on this pull request.</p><p>It may miss context from linked issues. Check before you share it.</p></>}
        />
      </div>
    </div>
  );
}

export function AILabelRevertDemo() {
  const original = 'Weekly update: 3 accessibility issues fixed on checkout, radius tokens shipped, Agent kit in review.';
  const [text, setText] = useState(original);
  const edited = text !== original;
  return (
    <div className="at-stack" style={{ minHeight: 260 }}>
      <div className="ai-field">
        <div className="ai-field__head">
          <label htmlFor="ai-summary" className="at-field__label">Summary</label>
          <AILabel size="xs" label="AI" align="end" edited={edited} onRevert={() => setText(original)} explanation={<p>Written by the assistant from this week’s merged pull requests.</p>} model="Atomus Fast" />
        </div>
        <textarea id="ai-summary" className={edited ? 'ai-textarea' : 'ai-textarea is-ai'} rows={3} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <p className="ai-note">Edit the text: the label switches to “Edited” and its popover offers “Revert to AI”.</p>
    </div>
  );
}

// ---------------------------------------------------------------- ContextMeter

export function ContextMeterDemo() {
  return (
    <div className="ai-grid-2" style={{ alignItems: 'start', minHeight: 300 }}>
      <div className="at-stack">
        <span className="ai-eyebrow">Compact — 84% (open) · 24% · 97%</span>
        <div className="at-row">
          <ContextMeter used={168000} limit={200000} cost={1.12} placement="down" defaultOpen />
          <ContextMeter used={48210} limit={200000} cost={0.184} placement="down" breakdown={[{ label: 'Input', tokens: 39200 }, { label: 'Output', tokens: 6810 }, { label: 'Tools', tokens: 2200 }]} />
          <ContextMeter used={194000} limit={200000} cost={1.31} placement="down" />
        </div>
      </div>
      <div className="at-stack">
        <span className="ai-eyebrow">Bar — side panels</span>
        <ContextMeter variant="bar" used={48210} limit={200000} cost={0.184} breakdown={[{ label: 'Input', tokens: 39200 }, { label: 'Output', tokens: 6810 }, { label: 'Tools', tokens: 2200 }]} />
      </div>
    </div>
  );
}
