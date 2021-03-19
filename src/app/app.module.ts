import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';

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
    FooterComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressbarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
