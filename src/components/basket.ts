import { IBasket, IProduct } from "../types";
import { EventEmitter } from './base/events';
import { cloneTemplate, createElement } from '../utils/utils';
import { Component } from './base/Component';
import { BasketCard } from "./card";

const cardBasketTemplate = document.body.querySelector('#card-basket') as HTMLTemplateElement;

export class Basket extends Component<IBasket> {
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

  set items(items: IProduct[]) {
    if (items.length) {
      this.setDisabled(this._basket__button, false)
      const cards = items.map((item) => {
        const card = new BasketCard(cloneTemplate(cardBasketTemplate));
        card.onClick = () =>
          {
            this.events.emit('product:remove', { id: item.id });
            this.events.emit('basket:refresh', this);
          };
        return card.render(item);
      });
      this._basket__list.replaceChildren(...cards)
    }
    else {
      this.setDisabled(this._basket__button, true)
      this._basket__list.replaceChildren(
        createElement<HTMLParagraphElement>('p',{textContent:'Корзина пустая'})
      )
    }
  }

  set total(total:number) {
    this._basket__price.textContent = total + ' синапсов'
  }
}