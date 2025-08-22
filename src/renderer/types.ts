// * Interfaces for OpenAI's API
// For network requests - based on OpenAI API docs - https://platform.openai.com/docs/api-reference/
// TODO: just import directly from openai types
interface OpenAIPromptRequest {
  model: string;
  prompt?: string | string[] | number[] | number[][];
  suffix?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  logprobs?: number;
  echo?: boolean;
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
  best_of?: number;
  logit_bias?: { [token: number]: number; };
  user?: string;
}
export enum Role {
  user = 'user',
  assistant = 'assistant',
  system = 'system'
}

export enum Model {

  gpt_35_turbo = "gpt-3.5-turbo",



  // 0.1 0.5
  gpt_oss_120b = "openai/gpt-oss-120b",

  // 0.05 0.4
  gpt_5_nano = "openai/gpt-5-nano",

  // 0.25 2
  gpt_5_mini = "openai/gpt-5-mini",
  // 2.0 8.0
  gpt_5_chat = "openai/gpt-5-chat",


  deepseek_31 = "deepseek/deepseek-chat-v3.1",
  // 0.5 2.18
  deepseek_r1 = "deepseek/deepseek-r1-0528",
  // 0.3 1.2
  qwen = "qwen/qwen3-coder",

  // 0.1 0.4
  gemini_25_lite = "google/gemini-2.5-flash-lite",

  // 0.3 2.5
  gemini_25_flash = "google/gemini-2.5-flash",
  // 1.25 10.0
  gemini_25_pro = "google/gemini-2.5-pro",

  // 0.14 2.49
  // kimi = "moonshotai/kimi-k2",

  sonnet = "anthropic/claude-sonnet-4",

  grok4 = "x-ai/grok-4",
  none = "none"
}

interface OpenAIMessage {
  role: Role;
  content: string;
}
interface OpenAIChatRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: { [token: number]: number; };
  user?: string;
}

// * Interfaces for this extension - built on top of OpenAI's API
export interface Message extends OpenAIMessage {
  id: string;
  // Formatted by HLJS + misc formatting
  content: string;
  // Raw content from OpenAI
  rawContent: string;
  role: Role;
  isError?: boolean;
  createdAt: string | number;
  updatedAt?: string | number;
  // If this is a user message that uses code selected from the editor
  questionCode?: string;
  // For continuing conversations
  parentMessageId?: string;
  // For streaming responses
  done?: boolean | null;
}
export interface DeltaMessage extends Message {
  delta?: string;
  cancel?: Function;
  detail?: any;
}

export enum Verbosity {
  code = "code",
  concise = "concise",
  normal = "normal",
}

export enum Bot {
  basic = "basic",
  proofreader = "proofreader",
  hybrid = "hybrid",
  summary = "summary",
  tutor = "tutor"
}

export interface Conversation {
  id: string;
  createdAt: string | number;
  inProgress: boolean;
  messages: Message[];
  model: Model | undefined;
  bot?: Bot | undefined;
  title?: string;
  autoscroll: boolean;
  verbosity?: Verbosity | undefined;
  // allow the user to switch tabs while working on a prompt
  userInput?: string;
  tokenCount?: {
    messages: number; // All messages combined
    userInput: number; // User input
    minTotal: number; // Minimum tokens to be used (messages + userInput)
  },
}

export interface SendMessageOptions {
  conversation: Conversation;
  parentMessageId?: string;
  messageId?: string;
  timeoutMs?: number;
  model?: Model;
  abortSignal: AbortSignal;
  onProgress?: (partialResponse: ChatResponse) => void;
}

export class ChatGPTError extends Error {
  statusCode?: number;
  statusText?: string;
  response?: Response;
  reason?: string;
  originalError?: Error;
}

export interface ChatResponse {
  response: string;
  conversationId: string;
  messageId: string;
  origMessageId: string;
}

export enum ActionNames {
  createReadmeFromPackageJson = "createReadmeFromPackageJson",
  createReadmeFromFileStructure = "createReadmeFromFileStructure",
  createGitignore = "createGitignore",
}
