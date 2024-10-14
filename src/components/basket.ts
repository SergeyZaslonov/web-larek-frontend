import { IBasketView } from "../types";
import { EventEmitter } from './base/events';
import { createElement } from '../utils/utils';
import { Component } from './base/Component';

export class Basket extends Component<IBasketView> {
  protected _basket__list: HTMLElement;
  protected _basket__price: HTMLElement;
  protected _basket__button: HTMLElement;

  constructor(container: HTMLFormElement, protected events: EventEmitter) {
		super(container);

    this._basket__list = this.container.querySelector('.basket__list');
    this._basket__price = this.container.querySelector('.basket__price');
    this._basket__button = this.container.querySelector('.basket__button');

    this._basket__button.addEventListener('click', () => {
      events.emit('order:open')
    })
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.setDisabled(this._basket__button, false)
      this._basket__list.replaceChildren(...items)
    }
    else {
      this.setDisabled(this._basket__button, true)
      this._basket__list.replaceChildren(
        createElement<HTMLParagraphElement>('p',{textContent:'Корзина пустая'})
      )
    }
  }

  set total(total:number) {
    this.setText(this._basket__price, total + ' синапсов')
  }
}