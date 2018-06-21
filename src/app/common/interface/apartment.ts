import { Room } from './room';
import { Item } from './item';

export interface Apartment {
  _id?: string,
  name?: string,
  description?: string,
  location?: string,
  available?: boolean,
  rooms?: Room[],
  items?: Item[],
  labels?: [string]
}

