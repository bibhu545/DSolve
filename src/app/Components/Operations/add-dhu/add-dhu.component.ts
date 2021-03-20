import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { CheckedModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, Utils } from 'src/app/Utils/Utils';

@Component({
  selector: 'app-add-dhu',
  templateUrl: './add-dhu.component.html',
  styleUrls: ['./add-dhu.component.css']
})
export class AddDHUComponent implements OnInit {

  checkedForm: FormGroup;
  checkedData: CheckedModel = new CheckedModel();
  utils: Utils = new Utils();

  constructor(
    private http: HttpService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    if (!this.cookieService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
    }
    else {
      this.preparecheckedForm();
    }
  }

  getFormControl(name): any {
    return this.checkedForm.get(name);
  }

  preparecheckedForm(): void {
    this.checkedForm = this.formBuilder.group({
      date: new FormControl(null, [Validators.required]),
      amount: new FormControl('', [Validators.required])
    });
  }

  addDefect(data: CheckedModel): void {
    if (this.checkedForm.valid) {
      console.log(data);
      // this.http.postData(API_ENDPOINTS.login, data).subscribe(response => {
      //   if (response) {
      //     this.checkedForm.reset();
      //   }
      //   else {
      //     this.utils.showErrorMessage('Username or password didn\'t match');
      //   }
      // }, e => {
      //   this.utils.showErrorMessage(e.error.message);
      // });
    }
    else {
      this.checkedForm.markAllAsTouched();
    }
  }

  resetCheck(): void {
    this.checkedForm.reset();
  }

}
