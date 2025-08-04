export interface Address {
  _id: string;
  user: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  mobileNo?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  label?: 'Home' | 'Work' | 'Other';
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  mobileNo?: string;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

export interface AddressResponse {
  status: number;
  message: string;
  data: Address | Address[];
}

export interface AddressError {
  message: string;
  status?: number;
} 