import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { LoginRequestModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, USER_TYPES, Utils } from 'src/app/Utils/Utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  utils: Utils = new Utils();

  constructor(
    private http: HttpService,
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    if (this.cookieService.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
    else {
      this.prepareLoginForm();
    }
  }

  prepareLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  getFormControl(name): any {
    return this.loginForm.get(name);
  }

  login(loginData: LoginRequestModel): void {
    if (this.loginForm.valid) {
      this.http.postData(API_ENDPOINTS.login, loginData).subscribe(response => {
        if (response) {
          this.loginForm.reset();
          response.userId = response._id;
          this.cookieService.saveLoginDataInCookies(response);
          this.accountService.setLoggedIn(true);
          this.router.navigateByUrl('/dashboard');
        }
        else {
          this.utils.showErrorMessage('Username or password didn\'t match');
        }
      }, e => {
        this.utils.showErrorMessage(e.error.message);
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
