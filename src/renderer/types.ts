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

  // 3 12
  gpt_o1_m = "openai/o1-mini",

  gpt_o4_m = "openai/o4-mini-high",
  // 0.15 0.6
  gpt_4o_m = "openai/gpt-4o-mini",

  // 0.1 0.4
  gpt_41_nano = "openai/gpt-4.1-nano",
  // 0.4 1.6
  gpt_41_mini = "openai/gpt-4.1-mini",
  // 2.0 8.0
  gpt_41 = "openai/gpt-4.1",

  // 0.27 1.1
  deepseek_v3 = "deepseek/deepseek-chat-v3-0324",
  deepseek_v3f = "deepseek/deepseek-chat-v3-0324:free",
  deepseek_r1 = "deepseek/deepseek-r1",

  free = "mistralai/mistral-7b-instruct:free",

  // 0.1 0.4
  // gemini_2_flash_001 = "google/gemini-2.0-flash-001",
  // gemini_2_flash_thinking_exp = "google/gemini-2.0-flash-thinking-exp:free",
  // gemini_2_flash_exp = "google/gemini-2.0-flash-exp:free",
  // gemini_2_pro_exp = "google/gemini-2.0-pro-exp-02-05:free",
  gemini_25_flash_prevview_0520 = "google/gemini-2.5-flash-preview-05-20",
  gemini_25_pro_exp = "google/gemini-2.5-pro-exp-03-25:free",
  // 1.25 10.0
  gemini_25_pro_preview = "google/gemini-2.5-pro-preview",
  // qwq_free = "qwen/qwq-32b:free",
  // qwq = "qwen/qwq-32b",

  sonnet = "anthropic/claude-sonnet-4",
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
