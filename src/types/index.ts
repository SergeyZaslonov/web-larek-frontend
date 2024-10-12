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
