import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './../auth-guard.service';

import { LandingPageComponent } from '../landing-page/landing-page.component';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { ApartmentComponent } from '../apartment/apartment.component';
import { EditAptComponent } from '../apartment/edit-apt.component';
import { ApartmentSectionComponent } from '../apartment/apartment-section.component';
import { RoomComponent } from '../room/room.component';
import { RoomSectionComponent } from '../room/room-section.component';
import { EditRoomComponent} from '../room/edit-room.component';



const routes: Routes = [
  { path: 'landing', component: LandingPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { 
    path: 'apartments', canActivate: [AuthGuardService], component: ApartmentSectionComponent, children: [
      { path: ':id', component: ApartmentComponent },
      { path: 'edit/:id', component: EditAptComponent }
    ]
  },
  {
    path: 'rooms', canActivate: [AuthGuardService], component: RoomSectionComponent, children: [
      { path: ':id', component: RoomComponent},
      { path: 'edit/:id', component: EditRoomComponent }
    ]
  },
  { path: '**', redirectTo: '/landing', pathMatch: 'full' },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class RoutingModule { }
