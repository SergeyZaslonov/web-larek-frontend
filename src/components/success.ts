import { IOrderResult } from './../types/index';
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Success extends Component<IOrderResult> {
  protected _success__description: HTMLElement;
  protected _success__close: HTMLButtonElement;
  constructor(container: HTMLFormElement, total: number, protected events: IEvents) {
    super(container);
    this._success__description = container.querySelector('.order-success__description');
    this._success__close = container.querySelector('.order-success__close');

    this.setText(this._success__description, 'Списано '+total.toString()+' синапсов');

    this._success__close.addEventListener('click', () => events.emit('order:finish'))
  }
}
