import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { RegisterModel, UserModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, Utils } from 'src/app/Utils/Utils';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  updateForm: FormGroup;
  utils: Utils = new Utils();
  userData: UserModel = new UserModel();

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private http: HttpService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    if (!this.cookieService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
    }
    else {
      this.prepareupdateForm();
      this.userData = this.cookieService.getUserdataFromCookies();
      const httpOptions = {
        headers: new HttpHeaders({
          email: this.userData.email
        })
      };
      this.http.getData(API_ENDPOINTS.viewProfile, httpOptions).subscribe(response => {
        if (response) {
          response.userId = response._id;
          this.userData = response;
          this.prepareupdateForm();
        }
      }, e => {
        this.utils.showErrorMessage(e.error.message);
      });
    }
  }

  prepareupdateForm(): void {
    this.updateForm = this.formBuilder.group({
      name: new FormControl(this.userData.name, [Validators.required]),
      email: new FormControl({ value: this.userData.email, disabled: true }, [Validators.required]),
      phone: new FormControl(this.userData.phone, [Validators.required]),
      companyName: new FormControl(this.userData.companyName, [Validators.required]),
      userType: new FormControl(this.userData.userType ?? 1)
    });
  }

  getFormControl(name): any {
    return this.updateForm.get(name);
  }

  editProfile(userData: UserModel): void {
    if (this.updateForm.valid) {
      userData.userId = this.userData.userId;
      this.http.postData(API_ENDPOINTS.editProfile, userData).subscribe(response => {
        if (response) {
          this.cookieService.saveLoginDataInCookies(response);
          this.utils.showSuccessMessage('Profile Updated');
        }
      }, e => {
        this.utils.showErrorMessage(e.error.message);
      });
    }
    else {
      this.updateForm.markAllAsTouched();
    }
  }

}
