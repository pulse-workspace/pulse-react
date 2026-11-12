import { InteractiveCard, CardSection, CardButton, ButtonStyle } from "./types";

/**
 * Fluent builder for constructing structured interactive card messages.
 */
export class CardBuilder {
  private card: InteractiveCard;

  /**
   * Initializes card with title and optional subtitle.
   */
  constructor(title: string, subtitle?: string) {
    this.card = {
      title,
      subtitle,
      sections: [],
    };
  }

  /**
   * Sets header image URL.
   */
  public setHeaderImage(url: string): this {
    this.card.headerImageUrl = url;
    return this;
  }

  /**
   * Appends a content section to the card.
   *
   * @param body Section paragraph text
   * @param options Additional section title or image
   */
  public addSection(body: string, options?: { title?: string; imageUrl?: string }): this {
    this.card.sections.push({
      body,
      title: options?.title,
      imageUrl: options?.imageUrl,
      actions: [],
    });
    return this;
  }

  /**
   * Appends an interactive action button to the latest section.
   *
   * @param actionId Unique action identifier received in action callback
   * @param label Button display text
   * @param style Button visual appearance
   * @param value Optional parameter payload passed on click
   */
  public addButton(
    actionId: string,
    label: string,
    style: ButtonStyle = "primary",
    value?: string
  ): this {
    if (this.card.sections.length === 0) {
      this.addSection("");
    }
    const lastSection = this.card.sections[this.card.sections.length - 1];
    if (!lastSection.actions) {
      lastSection.actions = [];
    }

    const btn: CardButton = {
      type: "button",
      actionId,
      label,
      style,
      value,
    };
    lastSection.actions.push(btn);
    return this;
  }

  /**
   * Returns complete serialized InteractiveCard object.
   */
  public build(): InteractiveCard {
    return { ...this.card };
  }
}

