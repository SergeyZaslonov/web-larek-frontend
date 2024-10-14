import { IOrderInfo } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./base/Form";

export class Contacts extends Form<IOrderInfo> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;
  protected _payButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container,events);
    this._email = container.querySelector('[name="email"]');
    this._phone = container.querySelector('[name="phone"]');
    this._payButton = container.querySelector('.button');

    this.container.addEventListener('submit', () => {
      events.emit(`${this.container.name}:submit`);
    })
  }

  set email(value:string) {
    this._email.value = value
  }

  set phone(value:string) {
    this._phone.value = value
  }
}

