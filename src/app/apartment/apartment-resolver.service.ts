import { ApartmentService } from 'app/services/apartment.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Apartment } from './../common/interface/apartment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApartmentResolver implements Resolve<Apartment> {

  constructor( private apartmentService: ApartmentService ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Apartment> | Promise<Apartment> | Apartment {
    return this.apartmentService.getApartment(route.params['id']);
  }
}
