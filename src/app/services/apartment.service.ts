import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apartment } from '../common/interface/apartment';


import { environment } from '../../environments/environment';

const constURL = `${environment.constURL}/api`;

@Injectable()
export class ApartmentService {

  constructor( private http: HttpClient ) { }

  // error handler
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  searchApartments(search: string): any {
    const url = search != null ? `${constURL}/apartments/query${search}` : `${constURL}/apartments/`;
    return this.http.get<Apartment>(url);
  }

  getApartments(): any {
    return this.http.get(`${constURL}/apartments`);
  }

  getOneApartment(id: any): any {
    return this.http.get<Apartment>(`${constURL}/apartments/query?_id=${id}`);
  }

  getApartmentItems(id: any): any {
    return this.http.get(`${constURL}/apartments/query?_id=${id}`);
  }

  createApartment(apartment: object): any {
    return this.http.post<Apartment>(`${constURL}/apartments`, apartment);
  }

  editApartment(id: string, apartment: object): any {
    return this.http.patch(`${constURL}/apartments/${id}`, apartment);
  }

  deleteApartment(id: string): any {
    return this.http.delete(`${constURL}/apartments/${id}`);
  }
}
