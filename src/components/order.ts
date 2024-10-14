import { IOrderInfo, PaymentMethod } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./base/Form";

export class Order extends Form<IOrderInfo> {
  protected _orderButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _cardButton: HTMLButtonElement;
  protected _address: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container,events);
    this._orderButton = container.querySelector('.order__button');
    this._cashButton = container.querySelector('[name="cash"]');
    this._cardButton = container.querySelector('[name="card"]');
    this._address = container.querySelector('[name="address"]');

    this._cashButton.addEventListener('click', () => {
      this.payment = 'cash';
    })

    this._cardButton.addEventListener('click', () => {
      this.payment = 'online';
    })

    this.container.addEventListener('submit', () => {
      events.emit(`${this.container.name}:submit`);
    })
  }

  set address(value:string) {
    this._address.value = value;
  }

  set payment(value: PaymentMethod) {
    if (value) {
      const cashPayment = value==='cash';
      this.toggleClass(this._cashButton,'button_alt-active',cashPayment)
      this.toggleClass(this._cardButton,'button_alt-active',!cashPayment)
      const payment:{field: keyof IOrderInfo, value: string} = {field:'payment',value:value};
      this.events.emit('order.payment:change', payment)
    }
  }
}