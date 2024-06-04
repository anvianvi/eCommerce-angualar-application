export type Address = {
  id: string;
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
};

export type Customer = {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: {
    isPlatformClient: boolean;
  };
  createdBy: {
    isPlatformClient: boolean;
  };
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth: string;
  addresses: Address[];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  isEmailVerified: boolean;
  key: string;
  authenticationMode: string;
};

export const emptyCustomer: Customer = {
  id: '',
  version: 0,
  versionModifiedAt: '',
  lastMessageSequenceNumber: 0,
  createdAt: '',
  lastModifiedAt: '',
  lastModifiedBy: {
    isPlatformClient: false,
  },
  createdBy: {
    isPlatformClient: false,
  },
  email: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  password: '',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  isEmailVerified: false,
  key: '',
  authenticationMode: '',
};
