import { ApartmentInterface } from './apartment';

export interface RoomInterface {
  _id: string,
  reference?: string,
  description?: string,
  location: ApartmentInterface,
  availablity: boolean,
  label: string,
}
