import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { HttpService } from 'src/app/Services/http.service';
import { API_ENDPOINTS, Utils } from 'src/app/Utils/Utils';
import { RegisterModel } from 'src/app/Utils/Models';
import { CookieService } from 'src/app/Services/cookie.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  utils: Utils = new Utils();

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private http: HttpService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    if (this.cookieService.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
    else{
      this.prepareRegisterForm();
    }
  }

  prepareRegisterForm(): void {
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      userType: new FormControl(1)
    });
  }

  getFormControl(name): any {
    return this.registerForm.get(name);
  }

  register(signupData: RegisterModel): void {
    if (this.registerForm.valid) {
      this.http.postData(API_ENDPOINTS.register, signupData).subscribe(response => {
        if (response) {
          this.registerForm.reset();
          this.registerForm.get('userType').setValue(1);
          response.userId = response._id;
          this.cookieService.saveLoginDataInCookies(response);
          this.accountService.setLoggedIn(true);
          this.router.navigateByUrl('/dashboard');
        }
      }, e => {
        this.utils.showErrorMessage(e.error.message);
      });
    }
    else{
      this.registerForm.markAllAsTouched();
    }
  }

}
