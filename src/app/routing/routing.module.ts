import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from './../landing-page/landing-page.component';
import { LoginComponent } from './../login/login.component';

const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
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
