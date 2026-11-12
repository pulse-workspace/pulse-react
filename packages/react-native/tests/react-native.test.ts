import { describe, it, expect, vi } from "vitest";
import {
  ReactNativeStorageAdapter,
  IAsyncStorageBackend,
  MobileLifecycleManager,
  IAppStateModule,
  MobileAppState,
  registerDevicePushToken,
} from "../src";

class MockAsyncStorage implements IAsyncStorageBackend {
  private map = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.map.get(key) || null;
  }
  async setItem(key: string, value: string): Promise<void> {
    this.map.set(key, value);
  }
  async removeItem(key: string): Promise<void> {
    this.map.delete(key);
  }
}

describe("ReactNativeStorageAdapter", () => {
  it("saves and retrieves messages offline", async () => {
    const storage = new MockAsyncStorage();
    const adapter = new ReactNativeStorageAdapter(storage, "test_app");

    await adapter.saveMessage({
      clientMsgID: "mob_1",
      convID: "conv_mobile",
      senderID: "usr_alice",
      contentType: 101,
      content: { text: "Hello React Native" },
      seq: 1,
      status: "SENT",
      sendTime: Date.now(),
      createdAt: Date.now(),
    });

    const msgs = await adapter.getMessages("conv_mobile", 10);
    expect(msgs.length).toBe(1);
    expect(msgs[0].content.text).toBe("Hello React Native");

    const single = await adapter.getMessageByClientId("mob_1");
    expect(single?.clientMsgID).toBe("mob_1");
  });

  it("handles outbox queue lifecycle", async () => {
    const storage = new MockAsyncStorage();
    const adapter = new ReactNativeStorageAdapter(storage);

    await adapter.saveOutbox({
      clientMsgID: "out_1",
      convID: "c1",
      contentType: 101,
      content: { text: "Queued" },
      retryCount: 0,
      createdAt: Date.now(),
    });

    const items = await adapter.getPendingOutbox();
    expect(items.length).toBe(1);

    await adapter.removeOutbox("out_1");
    const remaining = await adapter.getPendingOutbox();
    expect(remaining.length).toBe(0);
  });
});

describe("MobileLifecycleManager", () => {
  it("triggers connection when app returns to active from background", () => {
    let changeListener: ((state: MobileAppState) => void) | null = null;
    const mockAppState: IAppStateModule = {
      currentState: "background",
      addEventListener: (_type, listener) => {
        changeListener = listener;
        return { remove: () => {} };
      },
    };

    const mockClient: any = {
      getState: vi.fn().mockReturnValue("DISCONNECTED"),
      connect: vi.fn().mockResolvedValue({}),
    };

    const manager = new MobileLifecycleManager(mockClient, mockAppState);
    manager.start();

    // Trigger transition to active foreground
    changeListener!("active");

    expect(mockClient.connect).toHaveBeenCalled();
  });
});

describe("Device Push Registry Helper", () => {
  it("fails fast when missing required parameters", async () => {
    await expect(
      registerDevicePushToken({
        apiUrl: "",
        token: "",
        pushToken: "",
        platform: "fcm",
        appBundleId: "",
      })
    ).rejects.toThrowError("Missing required parameters");
  });
});
