import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, act, render, screen } from "@testing-library/react";
import {
  I18nProvider,
  useI18n,
  Avatar,
  Badge,
  MessageBubble,
} from "../src";

describe("UI Kit i18n System", () => {
  it("translates English and toggles dynamically to Vietnamese", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nProvider initialLocale="en">{children}</I18nProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(result.current.locale).toBe("en");
    expect(result.current.t("common.connected")).toBe("Connected");
    expect(result.current.t("conversation.title")).toBe("Conversations");

    act(() => {
      result.current.setLocale("vi");
    });

    expect(result.current.locale).toBe("vi");
    expect(result.current.t("common.connected")).toBe("Đã kết nối");
    expect(result.current.t("conversation.title")).toBe("Hội thoại");
  });
});

describe("UI Kit Component Rendering", () => {
  it("renders Avatar with monogram initials when src is absent", () => {
    render(<Avatar name="Alice Johnson" size="md" isOnline={true} />);
    expect(screen.getByText("AJ")).toBeTruthy();
  });

  it("renders Badge count correctly with cap over 99", () => {
    const { rerender } = render(<Badge count={5} />);
    expect(screen.getByText("5")).toBeTruthy();

    rerender(<Badge count={150} />);
    expect(screen.getByText("99+")).toBeTruthy();
  });

  it("renders MessageBubble for outbound message", () => {
    render(
      <I18nProvider initialLocale="en">
        <MessageBubble
          message={{
            clientMsgID: "msg-123",
            serverMsgID: "s-123",
            convID: "c-1",
            senderID: "u-1",
            contentType: 101,
            content: { text: "Hello Pulse!" },
            status: "SENT",
            seq: 1,
            sendTime: Date.now(),
            createdAt: Date.now(),
          }}
          isMine={true}
        />
      </I18nProvider>
    );
    expect(screen.getByText("Hello Pulse!")).toBeTruthy();
  });
});
