import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { DDLModel, DefectModel, UserModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, Utils } from 'src/app/Utils/Utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-defect-solutions',
  templateUrl: './defect-solutions.component.html',
  styleUrls: ['./defect-solutions.component.css']
})
export class DefectSolutionsComponent implements OnInit {

  viewForm: FormGroup;
  addForm: FormGroup;
  utils: Utils = new Utils();
  departments: DDLModel[] = [];
  userData: UserModel = new UserModel();
  defects: DefectModel[] = [];
  showDefects = false;
  deptId: string;
  department: DDLModel = new DDLModel('', '');
  addMode = false;

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
      this.prepareAddForm();
      this.http.getData(API_ENDPOINTS.getDepartments).subscribe(response => {
        if (response) {
          this.departments = response.map(item => new DDLModel(item.name, item._id));
        }
      }, e => {
        this.utils.showErrorMessage(e.error.message);
      });
    }
  }

  prepareAddForm(): void {
    this.addForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      solution: new FormControl('', [Validators.required]),
    });
  }

  addData(): void {
    if (this.addForm.valid) {
      const data: DefectModel = {
        deptId: this.department.value,
        defectId: null,
        name: this.addForm.get('name').value,
        solution: this.addForm.get('solution').value
      };
      this.http.postData(API_ENDPOINTS.addDefect, data).subscribe(response => {
        if (response) {
          this.utils.showSuccessMessage('Data added.');
          this.addMode = false;
          this.fetchData();
        }
      }, e => {
        this.addMode = false;
        this.utils.showErrorMessage(e.error.message);
      });
    }
    else {
      this.addForm.markAllAsTouched();
    }
  }

  prepareViewForm(): void {
    this.viewForm = this.formBuilder.group({
      deptId: new FormControl('', [Validators.required]),
    });
  }

  editDefect(item: DefectModel): void {
    if (item.name.trim() === '') {
      this.utils.showErrorMessage('Can not leave defect name empty.');
    }
    else {
      if (item.solution.trim() === '') {
        item.solution = 'No solution available.';
      }
      this.http.postData(API_ENDPOINTS.addDefect, item).subscribe(response => {
        if (response) {
          this.utils.showSuccessMessage('Data updated.');
          item.editMode = false;
        }
      }, e => {
        this.showDefects = false;
        this.utils.showErrorMessage(e.error.message);
      });
    }
  }

  deleteDefect(item: DefectModel): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.postData(API_ENDPOINTS.deleteDefect, item).subscribe(response => {
          if (response) {
            this.fetchData();
            Swal.fire(
              'Deleted!',
              'Data has been deleted.',
              'success'
            );
          }
        }, e => {
          this.showDefects = false;
          this.utils.showErrorMessage(e.error.message);
        });
      }
    });
  }

  fetchData(): void {
    if (this.viewForm.valid) {
      const data: any = {
        deptId: this.viewForm.get('deptId').value
      };
      this.department = this.departments.find(x => x.value === data.deptId);
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

  getAddFormControl(name): any {
    return this.addForm.get(name);
  }

  goBack(): void {
    this.router.navigateByUrl('dashboard');
  }

}
