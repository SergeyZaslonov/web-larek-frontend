import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Card extends Component<IProduct>  {
  protected _card__title: HTMLElement;
  protected _card__category?: HTMLElement;
  protected _card__description?: HTMLElement;
  protected _card__image?: HTMLImageElement;
  protected _card__price: HTMLElement;
  protected _card__button?: HTMLButtonElement;

  constructor(container: HTMLElement)  {
    super(container);

    this._card__title = ensureElement<HTMLElement>('.card__title', container);
    this._card__category = container.querySelector('.card__category');
    this._card__description = container.querySelector('.card__description');
    this._card__image = container.querySelector('.card__image');
    this._card__price = ensureElement<HTMLElement>('.card__price', container);
    this._card__button = container.querySelector('.card__button');
  }

  set title(value: string) {
    this.setText(this._card__title, value);
  }
  set category(value: string) {
    this.setText(this._card__category, value);
  }

  set description(value: string) {
    this.setText(this._card__description, value);
  }

  set image(value: string) {
    this.setImage(this._card__image, value);
  }
  
  set price(value: number | null) {
    if (value !== null)
      this.setText(this._card__price, value.toString() + ' синапсов');
    else {
      this.setText(this._card__price, 'Бесценно');
      this.setDisabled(this._card__button, true);
    }
  };

  set buttonText(value:string) {
    this.setText(this._card__button, value);
  }

  set onClick(value: EventListenerOrEventListenerObject) {
    if (value)
      if (this._card__button)
        this._card__button.addEventListener('click', value);
      else
        this.container.addEventListener('click', value);
  }
}

export class BasketCard extends Card  {
	protected _card__index: HTMLElement;

  constructor(container: HTMLElement)  {
    super(container);
    this._card__index = container.querySelector('.basket__item-index');
    this._card__button = container.querySelector('.basket__item-delete');
  }

  setIndex(index: number) {
    this.setText(this._card__index, index.toString())
  }
}