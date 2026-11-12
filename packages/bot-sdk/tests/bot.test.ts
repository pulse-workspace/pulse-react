import { describe, it, expect, vi } from "vitest";
import { PulseBot, CardBuilder, computeSignature, verifyWebhookSignature } from "../src";

describe("CardBuilder", () => {
  it("constructs an interactive card with title, sections, and buttons", () => {
    const card = new CardBuilder("Deployment Alert", "Production cluster")
      .setHeaderImage("https://example.com/banner.png")
      .addSection("Service pulse-gateway-01 restarted successfully.")
      .addButton("view_logs", "View Logs", "primary", "log_id_999")
      .addButton("dismiss", "Dismiss", "secondary")
      .build();

    expect(card.title).toBe("Deployment Alert");
    expect(card.subtitle).toBe("Production cluster");
    expect(card.headerImageUrl).toBe("https://example.com/banner.png");
    expect(card.sections.length).toBe(1);
    expect(card.sections[0].actions?.length).toBe(2);
    expect(card.sections[0].actions?.[0].actionId).toBe("view_logs");
    expect(card.sections[0].actions?.[0].value).toBe("log_id_999");
  });
});

describe("Signer", () => {
  it("signs and verifies HMAC signatures accurately", () => {
    const secret = "test_bot_secret_xyz";
    const body = JSON.stringify({ event: "MessageSent", text: "hi" });

    const sig = computeSignature(body, secret);
    expect(sig.startsWith("sha256=")).toBe(true);

    const valid = verifyWebhookSignature(body, secret, sig);
    expect(valid).toBe(true);

    const invalid = verifyWebhookSignature(body, "wrong_secret", sig);
    expect(invalid).toBe(false);
  });
});

describe("PulseBot", () => {
  it("enforces fail-fast configuration", () => {
    expect(() => new PulseBot({ apiUrl: "", botToken: "tok" })).toThrow("apiUrl");
    expect(() => new PulseBot({ apiUrl: "http://api.pulse", botToken: "" })).toThrow("botToken");
  });

  it("handles incoming webhook message event", async () => {
    const bot = new PulseBot({
      apiUrl: "https://api.pulse.internal",
      botToken: "bot_tok_123",
      webhookSecret: "sec_abc",
    });

    let handledMessage = false;
    bot.onMessage((event) => {
      expect(event.convID).toBe("conv_101");
      expect(event.content.text).toBe("Hello Bot!");
      handledMessage = true;
    });

    const rawPayload = JSON.stringify({
      delivery_id: "del_01",
      event: "MessageSent",
      timestamp: Date.now(),
      data: {
        convID: "conv_101",
        senderID: "usr_alice",
        contentType: 101,
        content: { text: "Hello Bot!" },
      },
    });

    const sig = computeSignature(rawPayload, "sec_abc");
    const processed = await bot.handleWebhook(rawPayload, sig);

    expect(processed).toBe(true);
    expect(handledMessage).toBe(true);
  });

  it("routes interactive card action event to action handler", async () => {
    const bot = new PulseBot({
      apiUrl: "https://api.pulse.internal",
      botToken: "bot_tok_123",
    });

    let actionExecuted = false;
    bot.onAction("approve_request", (event) => {
      expect(event.value).toBe("req_456");
      expect(event.userId).toBe("usr_approver");
      actionExecuted = true;
    });

    const rawPayload = JSON.stringify({
      delivery_id: "del_02",
      event: "CardAction",
      timestamp: Date.now(),
      data: {
        actionId: "approve_request",
        value: "req_456",
        userId: "usr_approver",
        convID: "conv_ops",
        messageId: "msg_card_1",
      },
    });

    const processed = await bot.handleWebhook(rawPayload);
    expect(processed).toBe(true);
    expect(actionExecuted).toBe(true);
  });
});

