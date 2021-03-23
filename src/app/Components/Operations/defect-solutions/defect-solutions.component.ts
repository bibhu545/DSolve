import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { DDLModel, DefectModel, UserModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, Utils } from 'src/app/Utils/Utils';

@Component({
  selector: 'app-defect-solutions',
  templateUrl: './defect-solutions.component.html',
  styleUrls: ['./defect-solutions.component.css']
})
export class DefectSolutionsComponent implements OnInit {

  viewForm: FormGroup;
  utils: Utils = new Utils();
  departments: DDLModel[] = [];
  userData: UserModel = new UserModel();
  defects: DefectModel[] = [];
  showDefects = false;
  deptId: string;

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
    }
  }

  prepareViewForm(): void {
    this.viewForm = this.formBuilder.group({
      deptId: new FormControl('', [Validators.required]),
    });
  }

  editDefect(item: DefectModel): void {
    this.http.postData(API_ENDPOINTS.addDefect, item).subscribe(response => {
      if (response) {
        this.showDefects = true;
        response.forEach(r => {
          this.defects.push({
            defectId: r._id,
            deptId: r.department,
            name: r.name,
            solution: r.solution
          });
        });
      }
    }, e => {
      this.showDefects = false;
      this.utils.showErrorMessage(e.error.message);
    });
  }

  deleteDefect(item: DefectModel): void {
    console.log(this.utils.showConfirm('Are you sure ?', 'Are you sure ?'));
  }

  fetchData(): void {
    if (this.viewForm.valid) {
      const data: any = {
        deptId: this.viewForm.get('deptId').value
      };
      this.defects = [];
      this.showDefects = false;
      this.http.postData(API_ENDPOINTS.getDefects, data).subscribe(response => {
        if (response) {
          this.showDefects = true;
          response.forEach(r => {
            this.defects.push({
              defectId: r._id,
              deptId: r.department,
              name: r.name,
              solution: r.solution
            });
          });
        }
      }, e => {
        this.showDefects = false;
        this.utils.showErrorMessage(e.error.message);
      });
    }
    else {
      this.viewForm.markAllAsTouched();
    }
  }

  getFormControl(name): any {
    return this.viewForm.get(name);
  }

  goBack(): void {
    this.router.navigateByUrl('dashboard');
  }

}
