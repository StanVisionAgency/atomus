// Atomus 4.0 — AI chat block, built from the Conversation pattern. MIT licence, https://docs.atomus.io
// A header with the AI label and a context meter, a role="log" thread of Messages (reasoning, tool calls, approvals,
// streamed text, sources), a welcome state with prompt starters and a docked Prompt input with a model selector.
// No AI SDK inside: pass plain messages and a status, and wire onSubmit / onStop / onApprove to your backend.
import { type ReactNode, useEffect, useRef } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { AILabel } from '../ai-label';
import { Approval, type ApprovalDecision, type ApprovalRisk } from '../ai-approval';
import { ContextMeter, type ContextUsagePart } from '../ai-context-meter';
import { Feedback, type FeedbackRating } from '../ai-feedback';
import { Message, type MessageStatus } from '../ai-message';
import { ModelSelector, type ModelOption } from '../ai-model-selector';
import { PromptInput } from '../ai-prompt-input';
import { Reasoning, type ReasoningStep } from '../ai-reasoning';
import { Sources, type SourceItem } from '../ai-sources';
import { StreamingText } from '../ai-streaming-text';
import { Suggestions, type SuggestionItem } from '../ai-suggestions';
import { ToolCall, type ToolCallStatus } from '../ai-tool-call';

export interface AiChatToolCall {
  id: string;
  name: string;
  title?: string;
  status: ToolCallStatus;
  input?: unknown;
  output?: unknown;
  /** Milliseconds. */
  duration?: number;
}

export interface AiChatApproval {
  title: string;
  description?: ReactNode;
  toolName?: string;
  risk?: ApprovalRisk;
  editableText?: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  /** The text so far; it grows while `status` is "streaming". */
  text: string;
  status?: MessageStatus;
  time?: string;
  reasoning?: { thinking: boolean; seconds?: number; steps?: ReasoningStep[] };
  tools?: AiChatToolCall[];
  approval?: AiChatApproval;
  sources?: SourceItem[];
}

export interface AiChatProps {
  title?: string;
  assistantName?: string;
  userName?: string;
  /** The conversation; empty shows the welcome state with prompt starters. */
  messages?: AiChatMessage[];
  /** Same values as the AI SDKs: "submitted" and "streaming" turn Send into Stop. */
  status?: 'ready' | 'submitted' | 'streaming' | 'error';
  onSubmit?: (text: string) => void;
  onStop?: () => void;
  onNewChat?: () => void;
  onRegenerate?: (messageId: string) => void;
  onApprove?: (messageId: string, decision: ApprovalDecision) => void;
  onDeny?: (messageId: string) => void;
  onFeedback?: (messageId: string, rating: FeedbackRating | null) => void;
  starters?: SuggestionItem[];
  followUps?: string[];
  models?: ModelOption[];
  model?: string;
  onModelChange?: (value: string) => void;
  context?: { used: number; limit: number; cost?: number; breakdown?: ContextUsagePart[] };
  disclaimer?: ReactNode;
}

const DEFAULT_STARTERS: SuggestionItem[] = [
  { id: 'summarize', label: 'Summarize this document', description: 'Key points in five bullets', icon: <Icon name="file" size={16} /> },
  { id: 'draft', label: 'Draft a reply', description: 'Friendly and short', icon: <Icon name="edit" size={16} /> },
  { id: 'search', label: 'Find related work', description: 'Search the workspace', icon: <Icon name="search" size={16} /> },
  { id: 'explain', label: 'Explain a concept', description: 'In plain language', icon: <Icon name="lightbulb" size={16} /> },
];

export function AiChat({
  title = 'Assistant',
  assistantName = 'Assistant',
  userName = 'You',
  messages = [],
  status = 'ready',
  onSubmit,
  onStop,
  onNewChat,
  onRegenerate,
  onApprove,
  onDeny,
  onFeedback,
  starters = DEFAULT_STARTERS,
  followUps,
  models,
  model,
  onModelChange,
  context,
  disclaimer = 'AI can make mistakes. Check important information.',
}: AiChatProps) {
  const thread = useRef<HTMLDivElement>(null);
  const busy = status === 'submitted' || status === 'streaming';
  const last = messages[messages.length - 1];

  // Keep the newest content in view inside the thread.
  useEffect(() => {
    const el = thread.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <section className="ab-ai-chat" aria-label={title}>
      <header className="ab-ai-chat__header">
        <div className="ab-ai-chat__title">
          <span className="ab-ai-chat__logo" aria-hidden="true"><Icon name="sparkle" size={16} /></span>
          <h1 className="ab-ai-chat__name">{title}</h1>
          <AILabel size="xs" />
        </div>
        <div className="ab-ai-chat__header-actions">
          {context ? <ContextMeter used={context.used} limit={context.limit} cost={context.cost} breakdown={context.breakdown} /> : null}
          {messages.length && onNewChat ? (
            <Button size="sm" hierarchy="tertiary" iconLeading={<Icon name="plus" size={16} />} onClick={onNewChat}>New chat</Button>
          ) : null}
        </div>
      </header>

      <div ref={thread} className="ab-ai-chat__thread" role="log" aria-label="Conversation" aria-live="off" tabIndex={0}>
        {messages.length === 0 ? (
          <div className="ab-ai-chat__welcome">
            <span className="ab-ai-chat__mark" aria-hidden="true"><span className="at-ai-mark ab-ai-chat__mark-icon" /></span>
            <h2 className="ab-ai-chat__welcome-title text-headline-h5">How can I help?</h2>
            <p className="ab-ai-chat__welcome-text">Ask a question or pick a starter. The assistant asks before it changes anything.</p>
            <Suggestions variant="cards" label="Prompt starters" suggestions={starters} onSelect={(p) => onSubmit?.(p)} />
          </div>
        ) : (
          <div className="ab-ai-chat__messages">
            {messages.map((m) =>
              m.role === 'user' ? (
                <Message key={m.id} role="user" name={userName} time={m.time} copyText={m.text} actionsVisibility="hover">
                  <p>{m.text}</p>
                </Message>
              ) : (
                <Message
                  key={m.id}
                  role="assistant"
                  name={assistantName}
                  time={m.time}
                  status={m.status ?? 'done'}
                  copyText={m.status === 'done' || !m.status ? m.text : undefined}
                  onRegenerate={onRegenerate && m.status !== 'streaming' ? () => onRegenerate(m.id) : undefined}
                  actions={m.status === 'done' || !m.status ? <Feedback onChange={(r) => onFeedback?.(m.id, r)} /> : undefined}
                >
                  {m.reasoning ? <Reasoning status={m.reasoning.thinking ? 'thinking' : 'done'} duration={m.reasoning.seconds} steps={m.reasoning.steps} /> : null}
                  {m.tools?.map((t) => (
                    <ToolCall key={t.id} name={t.name} title={t.title} status={t.status} input={t.input} output={t.output} duration={t.duration} />
                  ))}
                  {m.approval ? (
                    <Approval
                      title={m.approval.title}
                      toolName={m.approval.toolName}
                      risk={m.approval.risk}
                      editableText={m.approval.editableText}
                      status={m.approval.status}
                      onApprove={(d) => onApprove?.(m.id, d)}
                      onDeny={() => onDeny?.(m.id)}
                    >
                      {m.approval.description}
                    </Approval>
                  ) : null}
                  {m.text ? <StreamingText text={m.text} streaming={m.status === 'streaming'} /> : null}
                  {m.sources?.length ? <Sources sources={m.sources} /> : null}
                </Message>
              ),
            )}
            {followUps?.length && !busy && last?.role === 'assistant' ? (
              <Suggestions label="Follow-up prompts" suggestions={followUps} onSelect={(p) => onSubmit?.(p)} />
            ) : null}
          </div>
        )}
      </div>

      <div className="ab-ai-chat__composer">
        <PromptInput
          status={status}
          onSubmit={(text) => onSubmit?.(text)}
          onStop={onStop}
          placeholder={`Ask ${assistantName}…`}
          toolbar={models?.length ? <ModelSelector models={models} value={model} onChange={onModelChange} /> : undefined}
          disclaimer={disclaimer}
        />
      </div>
    </section>
  );
}

export default AiChat;
