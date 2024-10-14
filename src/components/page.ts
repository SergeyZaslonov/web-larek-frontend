import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export interface IPage {
  items: HTMLElement[];
  basketCount: number;
  locked: boolean;
}

export class Page extends Component<IPage> implements IPage {
	protected _gallery: HTMLElement;
	protected _header__basket_counter: HTMLElement;
	protected _header__basket: HTMLElement;
	protected _page__wrapper: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._header__basket = ensureElement<HTMLElement>('.header__basket');
		this._header__basket_counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._page__wrapper = ensureElement<HTMLElement>('.page__wrapper');

    this._header__basket.addEventListener('click', () => this.events.emit('basket:open'));

    this.basketCount = 0;
  }

  set basketCount(value: number) {
    this.setText(this._header__basket_counter, String(value));
    this.setDisabled(this._header__basket,value<=0);
  }

  set items(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  set locked(value: boolean) {
    this.toggleClass(this._page__wrapper, 'page__wrapper_locked', value)
  }
}