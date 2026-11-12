import type { PulseClient } from "@pulse/client-sdk";

export type MobileAppState = "active" | "background" | "inactive";

/**
 * Interface representing React Native's AppState listener module.
 */
export interface IAppStateModule {
  currentState: MobileAppState;
  addEventListener(type: "change", listener: (state: MobileAppState) => void): { remove: () => void };
}

/**
 * Coordinates PulseClient connection lifecycle with mobile AppState.
 * Automatically reconnects when app returns to foreground and triggers message synchronization.
 */
export class MobileLifecycleManager {
  private readonly client: PulseClient;
  private readonly appStateModule: IAppStateModule;
  private subscription: { remove: () => void } | null = null;

  /**
   * Initializes mobile lifecycle controller.
   *
   * @param client PulseClient instance
   * @param appStateModule React Native AppState module
   */
  constructor(client: PulseClient, appStateModule: IAppStateModule) {
    if (!client || !appStateModule) {
      throw new Error("Missing required parameters for MobileLifecycleManager");
    }
    this.client = client;
    this.appStateModule = appStateModule;
  }

  /**
   * Starts monitoring mobile foreground/background transitions.
   */
  public start(): () => void {
    if (this.subscription) {
      return () => this.stop();
    }

    this.subscription = this.appStateModule.addEventListener("change", (nextState: MobileAppState) => {
      this.handleStateChange(nextState);
    });

    return () => this.stop();
  }

  /**
   * Evaluates state change and triggers reconnection when returning to active foreground.
   */
  public handleStateChange(nextState: MobileAppState): void {
    if (nextState === "active") {
      const currentState = this.client.getState();
      if (currentState === "DISCONNECTED") {
        this.client.connect().catch(() => {
          // Reconnection attempt handled internally by transport backoff
        });
      }
    }
  }

  /**
   * Stops listening to app state events.
   */
  public stop(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }
}

