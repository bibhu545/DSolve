import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { AddDHUComponent } from './Components/Operations/add-dhu/add-dhu.component';
import { DefectSolutionsComponent } from './Components/Operations/defect-solutions/defect-solutions.component';
import { PlotGraphComponent } from './Components/Operations/plot-graph/plot-graph.component';
import { ViewDataComponent } from './Components/Operations/view-data/view-data.component';
import { ViewSolutionComponent } from './Components/Operations/view-solution/view-solution.component';
import { EditProfileComponent } from './Components/User/edit-profile/edit-profile.component';
import { LoginComponent } from './Components/User/login/login.component';
import { RegisterComponent } from './Components/User/register/register.component';
import { ResetPasswordComponent } from './Components/User/reset-password/reset-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-dhu', component: AddDHUComponent },
  { path: 'view-data', component: ViewDataComponent },
  { path: 'view-solution', component: ViewSolutionComponent },
  { path: 'plot-graph', component: PlotGraphComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'defect-solutions', component: DefectSolutionsComponent },
  { path: '', component: HomeComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
