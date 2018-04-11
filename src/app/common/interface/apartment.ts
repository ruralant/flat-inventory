import { RoomInterface } from './room';

export interface ApartmentInterface {
  _id: string,
  name: string,
  description?: string,
  location?: string,
  available: boolean,
  rooms?: RoomInterface[],
  label?: string
}

