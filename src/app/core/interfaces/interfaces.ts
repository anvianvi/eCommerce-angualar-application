import { Customer } from '../models/customer';

export interface CustomerResponse {
  customer: Customer;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}
