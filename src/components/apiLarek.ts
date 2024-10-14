import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder, IOrderResult, IApiLarek } from "../types";

export class ApiLarek extends Api implements IApiLarek {
  protected cdn: string;
	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then((item: IProduct) => ({
      ...item,
      image: this.cdn + item.image,
    }));
  }

  getProductsList(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  putOrder(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then((data: IOrderResult) => data);
  }
}
