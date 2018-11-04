import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Apartment } from './../../common/interface/apartment';
import { ApartmentService } from 'app/services/apartment.service';

@Injectable({
  providedIn: 'root'
})
export class ApartmentResolver implements Resolve<Apartment> {

  constructor( private apartmentService: ApartmentService ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Apartment> | Promise<Apartment> | Apartment {
    return this.apartmentService.getApartment(route.params['id']);
  }
}
