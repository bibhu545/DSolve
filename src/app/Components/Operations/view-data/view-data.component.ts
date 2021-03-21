import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { DDLModel, UserModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, Utils } from 'src/app/Utils/Utils';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.css']
})
export class ViewDataComponent implements OnInit {

  viewForm: FormGroup;
  utils: Utils = new Utils();
  departments: DDLModel[] = [];
  defects: DDLModel[] = [];
  userData: UserModel = new UserModel();

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
      this.userData = this.cookieService.getUserdataFromCookies();
      this.prepareViewForm();
      this.http.getData(API_ENDPOINTS.getDepartments).subscribe(response => {
        if (response) {
          this.departments = response.map(item => new DDLModel(item.name, item._id));
        }
      }, e => {
        this.utils.showErrorMessage(e.error.message);
      });
      this.fetchDefectList();
    }
  }

  fetchDefectList(): void {
    this.http.getData(API_ENDPOINTS.getDefects).subscribe(response => {
      if (response) {
        this.defects = response.map(item => new DDLModel(item.name, item._id));
      }
    }, e => {
      this.utils.showErrorMessage(e.error.message);
    });
  }


  prepareViewForm(): void {
    this.viewForm = this.formBuilder.group({
      fromDate: new FormControl(null, [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      deptId: new FormControl('', [Validators.required]),
    });
  }

  getFormControl(name): any {
    return this.viewForm.get(name);
  }

  fetchData(value: any): void {

  }

  resetViewForm(): void {
    this.viewForm.reset();
    this.viewForm.get('deptId').setValue('');
  }

}
