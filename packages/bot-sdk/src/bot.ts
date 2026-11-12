import { BotConfig, InboundMessageEvent, InboundActionEvent, InteractiveCard } from "./types";
import { CardBuilder } from "./card";
import { verifyWebhookSignature } from "./signer";

type MessageHandler = (event: InboundMessageEvent) => Promise<void> | void;
type ActionHandler = (event: InboundActionEvent) => Promise<void> | void;

/**
 * Main SDK client for building interactive Pulse bots.
 */
export class PulseBot {
  private readonly config: BotConfig;
  private messageHandlers: MessageHandler[] = [];
  private actionHandlers = new Map<string, ActionHandler>();

  /**
   * Initializes PulseBot with fail-fast configuration validation.
   */
  constructor(config: BotConfig) {
    if (!config.apiUrl || config.apiUrl.trim() === "") {
      throw new Error("BotConfig failure: 'apiUrl' is required and cannot be empty");
    }
    if (!config.botToken || config.botToken.trim() === "") {
      throw new Error("BotConfig failure: 'botToken' is required and cannot be empty");
    }
    this.config = config;
  }

  /**
   * Registers a callback for incoming messages.
   */
  public onMessage(handler: MessageHandler): this {
    this.messageHandlers.push(handler);
    return this;
  }

  /**
   * Registers a callback for interactive button clicks by action ID.
   */
  public onAction(actionId: string, handler: ActionHandler): this {
    this.actionHandlers.set(actionId, handler);
    return this;
  }

  /**
   * Sends a plain text message to a conversation.
   *
   * Business Logic:
   * Dispatches POST request to Pulse HTTP API using bot authentication token.
   */
  public async sendMessage(convID: string, text: string): Promise<any> {
    const url = `${this.config.apiUrl.replace(/\/+$/, "")}/api/v1/messages/send`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.botToken}`,
      },
      body: JSON.stringify({
        convID,
        contentType: 101,
        content: { text },
      }),
    });

    if (!res.ok) {
      throw new Error(`PulseBot failed to send message: HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Sends a structured interactive card message.
   */
  public async sendCard(convID: string, card: InteractiveCard | CardBuilder): Promise<any> {
    const cardPayload = card instanceof CardBuilder ? card.build() : card;
    const url = `${this.config.apiUrl.replace(/\/+$/, "")}/api/v1/messages/send`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.botToken}`,
      },
      body: JSON.stringify({
        convID,
        contentType: 109,
        content: { card: cardPayload },
      }),
    });

    if (!res.ok) {
      throw new Error(`PulseBot failed to send card: HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Processes an incoming raw webhook request payload with HMAC verification.
   *
   * Business Logic:
   * 1. Validates signature if webhookSecret is configured.
   * 2. Deserializes payload and routes to onMessage or onAction handlers.
   * 3. Returns boolean indicating whether payload was successfully processed.
   */
  public async handleWebhook(rawBody: string, signature?: string): Promise<boolean> {
    if (this.config.webhookSecret) {
      if (!signature) {
        throw new Error("Missing X-Pulse-Signature header on webhook request");
      }
      const isValid = verifyWebhookSignature(rawBody, this.config.webhookSecret, signature);
      if (!isValid) {
        throw new Error("Invalid webhook signature: HMAC validation failed");
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.event;

    if (eventName === "MessageSent") {
      const msgEvent: InboundMessageEvent = {
        deliveryId: payload.delivery_id,
        convID: payload.data?.convID || "",
        senderID: payload.data?.senderID || "",
        contentType: payload.data?.contentType || 101,
        content: payload.data?.content || {},
        createdAt: payload.timestamp || Date.now(),
      };

      for (const handler of this.messageHandlers) {
        await handler(msgEvent);
      }
      return true;
    }

    if (eventName === "CardAction") {
      const actionEvent: InboundActionEvent = {
        actionId: payload.data?.actionId || "",
        value: payload.data?.value,
        userId: payload.data?.userId || "",
        convID: payload.data?.convID || "",
        messageId: payload.data?.messageId || "",
        timestamp: payload.timestamp || Date.now(),
      };

      const handler = this.actionHandlers.get(actionEvent.actionId);
      if (handler) {
        await handler(actionEvent);
        return true;
      }
    }

    return false;
  }
}

