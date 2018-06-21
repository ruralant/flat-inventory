import { Room } from './room';

export interface Apartment {
  _id?: string,
  name?: string,
  description?: string,
  location?: string,
  available?: boolean,
  rooms?: Room[],
  label?: string
}

