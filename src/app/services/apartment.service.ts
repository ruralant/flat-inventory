import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Apartment } from '../common/interface/apartment';
import { Result } from '../common/interface/result';

import { environment } from '../../environments/environment';

const constURL = `${environment.constURL}/api`;

@Injectable()
export class ApartmentService {

  constructor( private http: HttpClient ) { }

  // error handler
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  searchApartments(search: string): Observable<Apartment[]> {
    const url = search != null ? `${constURL}/apartments/query${search}` : `${constURL}/apartments/`;
    return this.http.get<Apartment[]>(url);
  }

  getApartments(): Observable<Apartment[]> {
    return this.http.get<Apartment[]>(`${constURL}/apartments`);
  }

  getApartment(id: string): Observable<Apartment> {
    return this.http.get<Apartment>(`${constURL}/apartments/query?_id=${id}`);
  }

  createApartment(apartment: Apartment): Observable<Apartment> {
    return this.http.post<Apartment>(`${constURL}/apartments`, apartment);
  }

  editApartment(id: string, apartment: Apartment): Observable<Apartment> {
    return this.http.patch<Apartment>(`${constURL}/apartments/${id}`, apartment);
  }

  deleteApartment(id: string) {
    return this.http.delete<Result>(`${constURL}/apartments/${id}`);
  }
}
