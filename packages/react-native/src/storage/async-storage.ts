import type {
  IStorageAdapter,
  StoredMessage,
  StoredConversation,
  OutboxItem,
  MessageStatus,
} from "@pulse/client-sdk";

/**
 * Pluggable AsyncStorage backend interface matching @react-native-async-storage/async-storage.
 */
export interface IAsyncStorageBackend {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Mobile storage adapter implementing IStorageAdapter on top of AsyncStorage or any key-value store.
 * Provides offline message caching and persistent Outbox queue for React Native.
 */
export class ReactNativeStorageAdapter implements IStorageAdapter {
  private readonly storage: IAsyncStorageBackend;
  private readonly prefix: string;

  /**
   * Initializes ReactNativeStorageAdapter.
   *
   * @param storage AsyncStorage implementation
   * @param prefix Key prefix namespace (e.g. 'pulse_usr_123')
   */
  constructor(storage: IAsyncStorageBackend, prefix: string = "pulse") {
    if (!storage) {
      throw new Error("Missing required storage backend for ReactNativeStorageAdapter");
    }
    this.storage = storage;
    this.prefix = prefix;
  }

  private k(sub: string): string {
    return `${this.prefix}:${sub}`;
  }

  public async saveMessage(msg: StoredMessage): Promise<void> {
    if (!msg || (!msg.clientMsgID && !msg.serverMsgID) || !msg.convID) {
      throw new Error("Failed to save message: invalid message structure");
    }
    if (!msg.clientMsgID && msg.serverMsgID) {
      msg.clientMsgID = msg.serverMsgID;
    }

    const list = await this.getMessages(msg.convID, 500);
    const idx = list.findIndex((m) => m.clientMsgID === msg.clientMsgID);
    if (idx >= 0) {
      list[idx] = msg;
    } else {
      list.push(msg);
    }

    list.sort((a, b) => {
      if (a.seq !== -1 && b.seq !== -1) return a.seq - b.seq;
      return a.createdAt - b.createdAt;
    });

    await this.storage.setItem(this.k(`messages:${msg.convID}`), JSON.stringify(list));
    await this.storage.setItem(this.k(`msg:${msg.clientMsgID}`), JSON.stringify(msg));
  }

  public async getMessageByClientId(clientMsgID: string): Promise<StoredMessage | null> {
    const raw = await this.storage.getItem(this.k(`msg:${clientMsgID}`));
    return raw ? JSON.parse(raw) : null;
  }

  public async getMessages(convID: string, limit: number, beforeSeq?: number): Promise<StoredMessage[]> {
    const raw = await this.storage.getItem(this.k(`messages:${convID}`));
    if (!raw) return [];
    let list: StoredMessage[] = JSON.parse(raw);

    if (typeof beforeSeq === "number" && beforeSeq > 0) {
      list = list.filter((m) => m.seq !== -1 && m.seq < beforeSeq);
    }

    const start = Math.max(0, list.length - limit);
    return list.slice(start);
  }

  public async updateMessageStatus(
    clientMsgID: string,
    status: MessageStatus,
    serverMsgID?: string,
    seq?: number
  ): Promise<void> {
    const msg = await this.getMessageByClientId(clientMsgID);
    if (!msg) return;

    msg.status = status;
    if (serverMsgID) msg.serverMsgID = serverMsgID;
    if (typeof seq === "number") msg.seq = seq;

    await this.saveMessage(msg);
  }

  public async saveConversation(conv: StoredConversation): Promise<void> {
    const all = await this.getAllConversations();
    const idx = all.findIndex((c) => c.convID === conv.convID);
    if (idx >= 0) {
      all[idx] = conv;
    } else {
      all.push(conv);
    }
    all.sort((a, b) => b.updatedAt - a.updatedAt);
    await this.storage.setItem(this.k("conversations"), JSON.stringify(all));
  }

  public async getConversation(convID: string): Promise<StoredConversation | null> {
    const all = await this.getAllConversations();
    return all.find((c) => c.convID === convID) || null;
  }

  public async getAllConversations(): Promise<StoredConversation[]> {
    const raw = await this.storage.getItem(this.k("conversations"));
    return raw ? JSON.parse(raw) : [];
  }

  public async getLatestSeq(convID: string): Promise<number> {
    const conv = await this.getConversation(convID);
    if (conv) return conv.lastSeq;

    const msgs = await this.getMessages(convID, 100);
    let max = 0;
    for (const m of msgs) {
      if (m.seq > max) max = m.seq;
    }
    return max;
  }

  public async saveOutbox(item: OutboxItem): Promise<void> {
    const outbox = await this.getPendingOutbox();
    const idx = outbox.findIndex((i) => i.clientMsgID === item.clientMsgID);
    if (idx >= 0) {
      outbox[idx] = item;
    } else {
      outbox.push(item);
    }
    outbox.sort((a, b) => a.createdAt - b.createdAt);
    await this.storage.setItem(this.k("outbox"), JSON.stringify(outbox));
  }

  public async getPendingOutbox(): Promise<OutboxItem[]> {
    const raw = await this.storage.getItem(this.k("outbox"));
    return raw ? JSON.parse(raw) : [];
  }

  public async removeOutbox(clientMsgID: string): Promise<void> {
    const outbox = await this.getPendingOutbox();
    const filtered = outbox.filter((item) => item.clientMsgID !== clientMsgID);
    await this.storage.setItem(this.k("outbox"), JSON.stringify(filtered));
  }

  public async clearAll(): Promise<void> {
    await this.storage.removeItem(this.k("conversations"));
    await this.storage.removeItem(this.k("outbox"));
  }
}
