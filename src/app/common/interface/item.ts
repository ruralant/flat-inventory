import { Apartment } from './apartment';

export interface Item {
  _id: string,
  name: string,
  description?: string,
  location: Apartment,
  quantity: number,
  stock: number,
  label?: string,
}
