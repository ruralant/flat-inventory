import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RoutingModule } from './routing/routing.module';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';
import { HomeComponent } from './home/home.component';
import { ApartmentService } from './apartment.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule
  ],
  providers: [
    AuthenticationService,
    UserService,
    ApartmentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
