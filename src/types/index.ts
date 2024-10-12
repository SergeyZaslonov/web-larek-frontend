export type PaymentMethod = 'cash' |'online' | undefined;

export interface IProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
}

export interface IBasket {
  items: IProduct[];
  total: number;
}

export interface IOrderInfo {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IOrderInfo {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IApiLarek {
  getProductItem: (id: string) => Promise<IProduct>;
  getProductsList: () => Promise<IProduct[]>;
  putOrder: (order: IOrder) => Promise<IOrderResult>
}

export interface ILarekModel {
  catalog: IProduct[];
  basket: string[];
  orderInfo: IOrderInfo;
  formErrors: string;
  order:IOrder;

  productInBasket: (id:string) => boolean;
  addToBasket: (id:string) => void;
  removeFromBasket: (id:string) => void;
  basketCount: () => number;
  basketTotal: () => number;
  checkPaymentMethodAndAddress: () => boolean;
  checkEmailAndPhone: () => boolean;
}

export interface ICard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  inBasket: boolean;
  buttonText: string;
  onClick: Function;
}

export interface IPage {
  items: HTMLElement[];
  basketCount: number;
}

export interface IOrderForm {
  payment: PaymentMethod;
  address: string;
}

export interface IContacts {
  email: string;
  phone: string;
}
