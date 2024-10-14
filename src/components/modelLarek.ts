import { IOrderInfo } from './../types/index';
import { IBasket, IOrder, IProduct, PaymentMethod } from "../types";
import { IEvents } from "./base/events";

export class LarekModel {
  protected _catalog: IProduct[];
  protected _basket: string[];
  protected _orderInfo: IOrderInfo;
  protected _formErrors: string;

  constructor (protected events: IEvents) {
    this._catalog = [];
    this._basket = [];
    this._orderInfo = {
      payment: undefined,
      email: '',
      phone: '',
      address: ''
    };
    this._formErrors = '';
  }

  get catalog(): IProduct[] {
    return this._catalog
  }

  set catalog(items: IProduct[]) {
    this._catalog = items.map((item) => {
      return {
          id: item.id,
          description: item.description,
          image: item.image,
          title: item.title,
          category: item.category,
          price: item.price,
      };
    });
    this._basket = this._basket.filter((value) => {
      return this._catalog.find((item) => {return item.id===value})
    })
    this.events.emit('catalog:changed', this._catalog);
  }

  getProduct(id:string):IProduct {
    return this._catalog.find((item:IProduct) => item.id === id)
  }

  productInBasket(id:string):boolean {
    return this._basket.includes(id)
  }

  addToBasket(id:string) {
    if (!this._basket.includes(id)) {
      this._basket.push(id);
      this.events.emit('basket:changed')
    }
  }

  removeFromBasket(id:string) {
    this._basket = this._basket.filter(item => { return item!=id });
    this.events.emit('basket:changed')
  }

  clearBasket() {
    this._basket = [];
    this.events.emit('basket:changed')
  }

  get basketCount():number {
    return this._basket.length
  }

  get basketTotal():number {
    let _total = 0;
    this._basket.forEach((id) => {
      const item = this.catalog.find((item) => item.id === id);
      if (item)
        _total=_total+item.price;
    })
    return _total;
  }

  get basket():IBasket {
    const _basket: IBasket =
    {
      items: this._catalog.filter((item) => {
        return this._basket.some((id) => { return id === item.id })
      }),
      total: this.basketTotal
    }
    return _basket
  }

  get formErrors(): string {
    return this._formErrors
  };

  setOrderField(field: keyof IOrderInfo, value: string) {
    if (field !== 'payment')
      this._orderInfo[field] = value;
    else
      this._orderInfo[field] = value as PaymentMethod;
  }

  checkPaymentMethodAndAddress():boolean {
    this._formErrors = '';
		if (!this._orderInfo.payment) {
			this._formErrors = 'метод оплаты';
		}
		if (!this._orderInfo.address) {
      if (this._formErrors)
        this._formErrors = this._formErrors + ' и '
			this._formErrors = this._formErrors + 'адрес доставки';
		}
    if (this._formErrors)
      this._formErrors = 'Необходимо указать ' + this._formErrors;
		this.events.emit('formErrors:changed', {errors: this._formErrors});
		return (!this._formErrors);
	}

  checkEmailAndPhone():boolean {
    this._formErrors = '';
		if (!this._orderInfo.email) {
			this._formErrors = 'адрес электронной почты';
		}
		if (!this._orderInfo.phone) {
      if (this._formErrors)
        this._formErrors = this._formErrors + ' и '
			this._formErrors = this._formErrors + 'телефон';
		}
    if (this._formErrors)
      this._formErrors = 'Необходимо указать ' + this._formErrors;
      this.events.emit('formErrors:changed', {errors: this._formErrors});
    return (!this._formErrors);
  }

  get order():IOrder {
    const _order:IOrder=
    {
      items: Array.from(this._basket),
      total: this.basketTotal,
      ...this._orderInfo};
    return _order
  }
}