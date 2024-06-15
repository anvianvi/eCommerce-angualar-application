import { Product } from './products';

export type Cart = {
  type: 'Cart';
  id: string;
  version: number;
  cartState: 'Active';
  createdAt: string;
  createdBy: {
    clientId: string;
    isPlatformClient: boolean;
    customer: {
      id: string;
      type: string;
    };
  };
  customLineItems: Product[];
  customerId: string;
  lineItems: Product[];
  totalPrice: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
};

export const emptyCart: Cart = {
  type: 'Cart',
  id: '',
  version: 1,
  cartState: 'Active',
  createdAt: 'Z',
  createdBy: {
    clientId: '',
    isPlatformClient: false,
    customer: {
      id: '',
      type: '',
    },
  },
  customLineItems: [],
  customerId: '4daf0f79-2640-407a-a028-bee6259f262b',
  lineItems: [],
  totalPrice: {
    type: '',
    currencyCode: '',
    centAmount: 0,
    fractionDigits: 0,
  },
};
