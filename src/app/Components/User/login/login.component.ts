import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { LoginRequestModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, USER_TYPES } from 'src/app/Utils/Utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData: LoginRequestModel = new LoginRequestModel();

  constructor(
    private http: HttpService,
    private router: Router,
    private accountService: AccountService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.http.postData(API_ENDPOINTS.login, this.loginData).subscribe(response => {
      if (response.results != null) {
        if (response.results[0] != null) {
          this.cookieService.saveLoginDataInCookies(response.results[0]);
          this.accountService.setLoggedIn(true);
          this.accountService.setUserType(this.cookieService.getUserType());
          if (this.cookieService.getUserType() === USER_TYPES.admin) {
            this.router.navigateByUrl('/admin');
          }
          else {
            this.router.navigateByUrl('/dashboard');
          }
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Username or password didn\'t match',
            footer: '<a href="/forgot-password">Need help in password?</a>'
          });
        }
      }
    }, error => {
      console.log(error);
    });
  }

}
