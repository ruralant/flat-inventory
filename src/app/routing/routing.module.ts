import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from 'app/services/auth-guard.service';
import { ApartmentResolver } from './../apartment/apartment-resolver.service';

import { LandingPageComponent } from 'app/landing-page/landing-page.component';
import { HomeComponent } from 'app/home/home.component';
import { RegisterComponent } from 'app/register/register.component';
import { LoginComponent } from 'app/login/login.component';
import { ApartmentComponent } from 'app/apartment/apartment.component';
import { EditAptComponent } from 'app/apartment/edit-apt.component';
import { ApartmentSectionComponent } from 'app/apartment/apartment-section.component';
import { RoomComponent } from 'app/room/room.component';
import { RoomSectionComponent } from 'app/room/room-section.component';
import { EditRoomComponent} from 'app/room/edit-room.component';
import { ItemSectionComponent } from 'app/item/item-section.component';
import { ItemComponent } from 'app/item/item.component';
import { CreateItemComponent } from 'app/item/create-item.component';
import { EditItemComponent } from 'app/item/edit-item.component';
import { ItemsViewComponent } from 'app/item/items-view.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', canActivate: [AuthGuardService], component: HomeComponent },
  {
    path: 'apartments', canActivate: [AuthGuardService], component: ApartmentSectionComponent, children: [
      { path: ':id', component: ApartmentComponent, resolve: {apartment: ApartmentResolver} },
      { path: ':id/edit', component: EditAptComponent, resolve: {apartment: ApartmentResolver} }
    ]
  },
  {
    path: 'rooms', canActivate: [AuthGuardService], component: RoomSectionComponent, children: [
      { path: ':id', component: RoomComponent },
      { path: ':id/edit', component: EditRoomComponent }
    ]
  },
  {
    path: 'items', canActivate: [AuthGuardService], component: ItemSectionComponent, children: [
      { path: '', component: ItemsViewComponent },
      { path: ':id',  component: ItemComponent },
      { path: 'new', component: CreateItemComponent },
      { path: ':id/edit', component: EditItemComponent }
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  declarations: [],
  exports: [RouterModule]
})
export class RoutingModule { }
