/**
 * Configuration options for initializing a PulseBot.
 * Fail-fast configuration: apiUrl and botToken are mandatory.
 */
export interface BotConfig {
  apiUrl: string;
  botToken: string;
  webhookSecret?: string;
}

/**
 * Visual styling variant for interactive card buttons.
 */
export type ButtonStyle = "primary" | "secondary" | "danger" | "success";

/**
 * Interactive button component for bot cards.
 */
export interface CardButton {
  type: "button";
  actionId: string;
  label: string;
  style?: ButtonStyle;
  value?: string;
}

/**
 * Section component within an interactive card message.
 */
export interface CardSection {
  title?: string;
  body: string;
  imageUrl?: string;
  actions?: CardButton[];
}

/**
 * Structured card message payload (ContentType = 109).
 */
export interface InteractiveCard {
  title: string;
  subtitle?: string;
  headerImageUrl?: string;
  sections: CardSection[];
}

/**
 * Inbound message event delivered to bot handlers.
 */
export interface InboundMessageEvent {
  deliveryId: string;
  convID: string;
  senderID: string;
  contentType: number;
  content: {
    text?: string;
    card?: InteractiveCard;
    [key: string]: any;
  };
  createdAt: number;
}

/**
 * User interaction event triggered when an interactive button is tapped.
 */
export interface InboundActionEvent {
  actionId: string;
  value?: string;
  userId: string;
  convID: string;
  messageId: string;
  timestamp: number;
}

