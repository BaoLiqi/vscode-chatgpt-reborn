import { encoding_for_model, Tiktoken, TiktokenModel } from "@dqbd/tiktoken";
import OpenAI, { ClientOptions } from 'openai';
import { Conversation, Message, Model, Role } from "./renderer/types";

export class ApiProvider {
  private _openai: OpenAI;
  private _temperature: number;
  private _topP: number;

  public apiConfig: ClientOptions;

  constructor(apiKey: string, {
    organizationId = '',
    apiBaseUrl = 'https://api.openai.com/v1',
    maxTokens = 0,
    maxResponseTokens,
    temperature = 0.9,
    topP = 1,
  }: {
    organizationId?: string;
    apiBaseUrl?: string;
    maxTokens?: number;
    maxResponseTokens?: number;
    temperature?: number;
    topP?: number;
  } = {}) {
    // If apiBaseUrl ends with slash, remove it
    apiBaseUrl = apiBaseUrl.replace(/\/$/, '');
    // OpenAI API config
    this.apiConfig = {
      apiKey: apiKey,
      organization: organizationId,
      baseURL: apiBaseUrl,
    };
    this._openai = new OpenAI(this.apiConfig);
    this._temperature = temperature;
    this._topP = topP;
  }

  // OpenAI's library doesn't support streaming, but great workaround from @danneu - https://github.com/openai/openai-node/issues/18#issuecomment-1483808526
  async* streamChatCompletion(conversation: Conversation, abortSignal: AbortSignal, {
    temperature = this._temperature,
    topP = this._topP,
  }: {
    temperature?: number;
    topP?: number;
  } = {}): AsyncGenerator<any, any, unknown> {
    if (!conversation.model) { throw new Error("model is undefined"); }
    const model = conversation.model;

    // Only stream if not using a proxy
    const useStream = true; // this.apiConfig.basePath === 'https://api.openai.com/v1';
    const response = await this._openai.chat.completions.create(
      {
        model,
        messages: conversation.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        // max_tokens: completeTokensLeft,
        temperature,
        top_p: topP,
        stream: useStream,
      }
    );

    for await (const chunk of response) {
      if (abortSignal.aborted) {
        return;
      }

      try {
        const token = chunk.choices[0].delta.content;

        if (token) {
          yield token;
        }
      } catch (e: any) {
        console.error('api JSON parse error. Message:', e?.message, 'Error:', e);
      }
    }
  }

  // treat any model as gpt35
  public static getEncodingForModel(model: Model): Tiktoken {
    return encoding_for_model(Model.gpt_35_turbo as TiktokenModel);
  }

  public static countConversationTokens(conversation: Conversation): number {
    const enc = this.getEncodingForModel(conversation.model ?? Model.gpt_35_turbo);
    let tokensUsed = 0;

    for (const message of conversation.messages) {
      tokensUsed += ApiProvider.countMessageTokens(message, conversation.model ?? Model.gpt_35_turbo, enc);
    }

    tokensUsed += 3; // every reply is primed with <im_start>assistant

    enc.free();
    return tokensUsed;
  }

  public static countMessageTokens(message: Message, model: Model, encoder?: Tiktoken): number {
    let enc = encoder ?? this.getEncodingForModel(model);
    let tokensUsed = 4; // every message follows <im_start>{role/name}\n{content}<im_end>\n

    const openAIMessage = {
      role: message.role ?? Role.user,
      content: message.content ?? '',
      // name: message.name,
    };

    for (const [key, value] of Object.entries(openAIMessage)) {
      // Assuming encoding is available and has an encode method
      const tokens = enc.encode(value);
      tokensUsed += tokens ? tokens.length : 0;

      if (key === "name") { // if there's a name, the role is omitted
        tokensUsed -= 1; // role is always required and always 1 token
      }
    }

    if (!encoder) {
      enc.free();
    }
    return tokensUsed;
  }

  // Calculate tokens remaining for OpenAI's response
  public static getRemainingPromptTokens(maxTokens: number, prompt: string, model: Model): number {
    return maxTokens - ApiProvider.countPromptTokens(prompt, model);
  }

  public static countPromptTokens(prompt: string, model: Model): number {
    const enc = this.getEncodingForModel(model);
    const tokens = enc.encode(prompt).length;

    enc.free();
    return tokens;
  }

  // * Getters and setters
  set temperature(value: number) {
    this._temperature = value;
  }

  set topP(value: number) {
    this._topP = value;
  }

  updateApiKey(apiKey: string) {
    // OpenAI API config
    this.apiConfig = {
      apiKey: apiKey,
      organization: this.apiConfig.organization,
      // baseURL: this.apiConfig.baseURL,
    };
    this._openai = new OpenAI(this.apiConfig);
  }

  updateOrganizationId(organizationId: string) {
    // OpenAI API config
    this.apiConfig = {
      apiKey: this.apiConfig.apiKey,
      organization: organizationId,
      // baseURL: this.apiConfig.baseURL,
    };
    this._openai = new OpenAI(this.apiConfig);
  }

  updateApiBaseUrl(apiBaseUrl: string) {
    // If apiBaseUrl ends with slash, remove it
    apiBaseUrl = apiBaseUrl.replace(/\/$/, '');
    // OpenAI API config
    this.apiConfig = {
      apiKey: this.apiConfig.apiKey,
      organization: this.apiConfig.organization,
      // baseURL: this.apiConfig.baseURL,
    };
    this._openai = new OpenAI(this.apiConfig);
  }
}
