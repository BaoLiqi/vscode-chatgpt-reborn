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
  // 3 12
  gpt_o1_m = "openai/o1-mini",
  // 15 60
  gpt_o1_p = "openai/o1-preview",
  // 0.15 0.6
  gpt_4o_m = "openai/gpt-4o-mini",
  // 2.5 10
  gpt_4o = "openai/gpt-4o-2024-08-06",
  gpt_4_turbo = "openai/gpt-4-turbo",
  gpt_35_turbo = "gpt-3.5-turbo",
  wizard = "microsoft/wizardlm-2-8x22b",
  mistral8x22b_instruct = "mistralai/mixtral-8x22b-instruct",
  llama3_70b = "meta-llama/llama-3-70b-instruct",
  llama3_70b_nitro = "meta-llama/llama-3-70b-instruct:nitro",
  //2 2
  llama3_405 = "meta-llama/llama-3.1-405b-instruct",
  free = "mistralai/mistral-7b-instruct:free",
  haiku = "anthropic/claude-3-haiku:beta",
  // 0.25_0.75
  gemini_flash = "google/gemini-flash-1.5",
  // 2.5 7.5
  gemini_pro = "google/gemini-pro-1.5",
  // 0 
  gemini_pro_e = "google/gemini-pro-1.5-exp",
  qwen2 = "qwen/qwen-2-72b-instruct",
  none = "none"
}

// source: https://openai.com/pricing
export const MODEL_COSTS = {
  [Model.gpt_4_turbo]: {
    prompt: 0.01,
    complete: 0.03,
  },
} as {
  [model: string]: {
    prompt: number;
    complete: number;
  };
};

// source: https://platform.openai.com/docs/models
export const MODEL_TOKEN_LIMITS = {
  [Model.gpt_4_turbo]: {
    context: 128000,
    max: 4096,
  },
} as {
  [model: string]: {
    context: number;
    max?: number;
  };
};

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
  full = "full"
}

export enum Bot {
  basic = "basic",
  proofreader = "proofreader",
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
