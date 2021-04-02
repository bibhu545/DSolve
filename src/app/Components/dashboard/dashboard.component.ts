import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/Services/cookie.service';
import { DDLModel, UserModel } from 'src/app/Utils/Models';
import { Utils } from 'src/app/Utils/Utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  utils: Utils = new Utils();
  userData: UserModel = new UserModel();
  userType: number;

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    if (!this.cookieService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
    }
    else {
      this.userData = this.cookieService.getUserdataFromCookies();
      this.userType = this.cookieService.getUserType();
    }
  }

  addDHU(): void {
    if (this.userType === 2) {
      this.utils.showErrorMessage('Please login as a Quality Manager or Admin to update information.');
      return;
    }
    this.router.navigateByUrl('/add-dhu');
  }

  viewSolutions(): void {
    this.router.navigateByUrl('/view-solution');
  }

  plotGraph(): void {
    this.router.navigateByUrl('/plot-graph');
  }

  viewData(): void {
    this.router.navigateByUrl('/view-data');
  }

}
