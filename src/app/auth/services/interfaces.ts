export interface CustomerResponse {
  customer: Customer;
}

export interface Customer {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: ModifiedBy;
  createdBy: ModifiedBy;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  password: string;
  addresses: Address[];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  isEmailVerified: boolean;
  authenticationMode: string;
}

export interface ModifiedBy {
  clientId: string;
  isPlatformClient: boolean;
}

export interface Address {
  id: string;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}
