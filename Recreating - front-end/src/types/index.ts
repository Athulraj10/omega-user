import React from "react";

export interface WrapperAnimationFCProps {
  children: React.ReactNode | React.ReactNode[];
  triggerOnce: boolean;
  className: string;
  index?: any;
  postData?: any;
}

export type ProductType = {
  id: number;
  name: string;
  thumb: string;
  price: string;
  count: number;
  color: string;
  size: string;
};

export type ProductStoreType = {
  id: number;
  name: string;
  thumb: string;
  price: number;
  count: number;
  color: string;
  size: string;
};

export enum TemplateEnum {
  THEME = "theme",
  TEMPLATE = "template",
}

export type ProductContentType<> = {
  url: string;
  postData?: any;
  WrapperAnimation?: React.FunctionComponent<WrapperAnimationFCProps>;
  // index?: any;
  wrapperClass?: any;
  containerTagName?: any;
  hasPaginate?: boolean;
  sortBy?: any;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
  view?: any;
  itemColClass?: any;
};

export interface Product {
  id: string;
  title: string;
  image: string;
  newPrice: number;
}

export interface Order {
  orderId: string;
  date: string;
  shippingMethod: string;
  totalItems: number;
  totalPrice: number;
  status: string;
  products: Product[];
}

export interface IPAddress {
  system_ip: string | null;
  browser_ip: string;
}

export interface User {
  _id: string;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_pic: string;
  mobile_no: number;
  device_code: string;
  email_verify: string | null;
  status: string;
  role: "user" | "admin";
  roleLevel: number;
  ip_address: IPAddress;
  createdAt: string;
  updatedAt: string;
  last_login?: string;
  token?: string;
  __v?: number;
}

export interface Address {
  id: string,
  userId: string,
  label: string,
  addressLine1: {
    street: string
  },
  city: string,
  state: string,
  postalCode: string,
  country: string,
  phone: number,
  isDefault: boolean
}

export interface Wallet {
  id: string,
  userId: string,
  coin: number,
  diamond: number,
  balance: number,
  currency: {
    id: string,
    code: string,
    name: string,
    value: number
  }
}
export type BannerItem = {
  titleLine1: string;
  titleLine2: string;
  offerText: string;
  offerHighlight: string;
  buttonText?: string;
  link?: string;
};
