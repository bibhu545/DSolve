import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { CheckedModel, CompleteDataModel, DDLModel, DefectDataModel, UserModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, Utils } from 'src/app/Utils/Utils';

@Component({
  selector: 'app-add-dhu',
  templateUrl: './add-dhu.component.html',
  styleUrls: ['./add-dhu.component.css']
})
export class AddDHUComponent implements OnInit {

  checkedForm: FormGroup;
  defectForm: FormGroup;
  checkedData: CheckedModel = new CheckedModel();
  utils: Utils = new Utils();
  departments: DDLModel[] = [];
  defects: DDLModel[] = [];
  userData: UserModel = new UserModel();
  showDefectSection = false;
  completeData: CompleteDataModel;
  defectList: DefectDataModel[] = [];
  showAddDefect = false;
  totalAmount = 0;

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
      this.preparecheckedForm();
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
    this.defectList = [];
    this.http.getData(API_ENDPOINTS.getDefects).subscribe(response => {
      if (response) {
        this.defects = response.map(item => new DDLModel(item.name, item._id));
      }
    }, e => {
      this.utils.showErrorMessage(e.error.message);
    });
  }

  getFormControl(name): any {
    return this.checkedForm.get(name);
  }

  preparecheckedForm(): void {
    this.checkedForm = this.formBuilder.group({
      date: new FormControl(null, [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      deptId: new FormControl('', [Validators.required]),
    });
  }

  addDHU(data: CheckedModel): void {
    if (this.checkedForm.valid) {
      data.userId = this.userData.userId;
      data.dateString = data.date;
      this.http.postData(API_ENDPOINTS.addDHU, data).subscribe(response => {
        if (response) {
          this.checkedForm.reset();
          this.checkedForm.get('deptId').setValue('');
          this.prepareDefectForm();
          this.defectList = [];
          this.showDefectSection = true;
          this.completeData = new CompleteDataModel();
          this.completeData.checkedData = new CheckedModel();
          this.completeData.checkedData.amount = response.amount;
          this.completeData.checkedData.checkId = response._id;
          this.completeData.checkedData.userId = response.user;
          this.completeData.checkedData.date = new Date(data.dateString).toLocaleDateString();
          this.completeData.checkedData.deptId = response.department;
          this.completeData.checkedData.deptName = this.departments.find(item => item.value === response.department).text;
          this.completeData.checkedData.totalChecked = 0;
          this.getDefectData();
        }
        else {
          this.utils.showErrorMessage('Some error occured.');
        }
      }, e => {
        this.utils.showErrorMessage(e.error.message);
      });
    }
    else {
      this.checkedForm.markAllAsTouched();
    }
  }

  resetCheck(): void {
    this.checkedForm.reset();
    this.checkedForm.get('deptId').setValue('');
    this.defectForm.reset();
    this.showDefectSection = false;
    this.defectList = [];
    this.completeData = new CompleteDataModel();
  }

  prepareDefectForm(): void {
    this.defectForm = this.formBuilder.group({
      defect: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      defectName: new FormControl('', [Validators.required])
    });
  }

  getDefectData(): void {
    this.http.getData(API_ENDPOINTS.getDefectData).subscribe(response => {
      if (response) {
        this.populateDefectData(response);
      }
      else {
        this.utils.showErrorMessage('Some error occured.');
      }
    }, e => {
      this.utils.showErrorMessage(e.error.message);
    });
  }

  addDefect(defectData: DefectDataModel): void {
    if (this.showAddDefect) {
      defectData.defect = '0';
      this.defectForm.get('defect').setValue('0');
    }
    else{
      this.defectForm.get('defectName').setValue('0');
    }
    if (this.defectForm.valid) {
      defectData.user = this.completeData.checkedData.userId;
      defectData.checked = this.completeData.checkedData.checkId;
      this.http.postData(API_ENDPOINTS.addDefectData, defectData).subscribe(response => {
        if (response) {
          this.populateDefectData(response);
        }
        else {
          this.utils.showErrorMessage('Some error occured.');
        }
      }, e => {
        this.utils.showErrorMessage(e.error.message);
      });
    }
    else {
      this.defectForm.markAllAsTouched();
    }
  }

  populateDefectData(response: any): void {
    this.showAddDefect = false;
    this.fetchDefectList();
    this.defectForm.reset();
    this.defectForm.get('defect').setValue('');
    this.totalAmount = 0;
    this.defectList = [];
    response.forEach(r => {
      if (r.checked === this.completeData.checkedData.checkId) {
        const temp: DefectDataModel = new DefectDataModel();
        temp.amount = r.amount;
        temp.checked = r.checked;
        temp.defect = r.defect;
        temp.user = r.user;
        temp.defectName = r.defectDetails[0]?.name;
        this.totalAmount += r.amount;
        this.defectList.push(temp);
      }
    });
  }

  getDefectFormControl(name): any {
    return this.defectForm.get(name);
  }
}
