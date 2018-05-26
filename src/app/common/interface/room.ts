import { Apartment } from './apartment';

export interface Room {
  _id: string,
  reference?: string,
  description?: string,
  location: Apartment,
  availablity: boolean,
  label: string,
}
