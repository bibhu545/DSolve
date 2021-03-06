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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpService } from './Services/http.service';
import { EditProfileComponent } from './Components/User/edit-profile/edit-profile.component';
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { ViewDataComponent } from './Components/Operations/view-data/view-data.component';
import { PlotGraphComponent } from './Components/Operations/plot-graph/plot-graph.component';
import { ViewSolutionComponent } from './Components/Operations/view-solution/view-solution.component';
import { DefectSolutionsComponent } from './Components/Operations/defect-solutions/defect-solutions.component';
import { ChartsModule } from 'ng2-charts';
import { PopoverModule } from 'ngx-bootstrap/popover';

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
    DashboardComponent,
    EditProfileComponent,
    AboutUsComponent,
    NotFoundComponent,
    ViewDataComponent,
    PlotGraphComponent,
    ViewSolutionComponent,
    DefectSolutionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressbarModule.forRoot(),
    ChartsModule,
    PopoverModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
