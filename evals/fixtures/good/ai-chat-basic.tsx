// Good: the Conversation pattern from the Agent kit — role="log" thread, Messages, StreamingText, PromptInput.
import { useState } from 'react';
import { AILabel, Message, PromptInput, StreamingText } from '@stanvision/atomus-react';

const REPLY = 'Use --color-border-secondary for card borders. It switches with Light and Dark mode, so you never pick a gray by hand.';

export default function AssistantChat() {
  const [status, setStatus] = useState<'ready' | 'streaming'>('ready');
  return (
    <section className="chat" aria-label="Atomus Assistant">
      <header className="chat__header">
        <h1 className="chat__title">Atomus Assistant</h1>
        <AILabel size="xs" />
      </header>
      <div className="chat__thread" role="log" aria-label="Conversation" aria-live="off" tabIndex={0}>
        <Message role="user" name="Kristina" copyText="Which token should I use for a card border?">
          <p>Which token should I use for a card border?</p>
        </Message>
        <Message role="assistant" name="Atomus Assistant" status={status === 'streaming' ? 'streaming' : 'done'} copyText={REPLY}>
          <StreamingText text={REPLY} streaming={status === 'streaming'} />
        </Message>
      </div>
      <PromptInput status={status} onSubmit={() => setStatus('streaming')} onStop={() => setStatus('ready')} placeholder="Ask Atomus Assistant…" />
    </section>
  );
}
