import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/User/login/login.component';
import { ResetPasswordComponent } from './Components/User/reset-password/reset-password.component';
import { HomeComponent } from './Components/home/home.component';
import { AddDHUComponent } from './Components/Operations/add-dhu/add-dhu.component';
import { RegisterComponent } from './Components/User/register/register.component';
import { NavComponent } from './Components/partial/nav/nav.component';
import { FooterComponent } from './Components/partial/footer/footer.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    HomeComponent,
    AddDHUComponent,
    RegisterComponent,
    NavComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProgressbarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
