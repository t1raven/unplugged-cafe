export type DeliveryMethod =
  | 'delivery'
  | 'pickup';

export interface OrderOption {
  name: string;
  value: string;
}

export interface OrderRequestItem {
  goodsId: string;
  quantity: number;

  options: OrderOption[];
}

export interface OrderRequest {
  deliveryMethod:
    DeliveryMethod;

  customer: {
    name: string;
    phone: string;

    address: {
      postcode: string;
      address: string;
      detailAddress: string;
    } | null;
  };

  memo?: string;

  privacyAgreed: boolean;

  items: OrderRequestItem[];
}