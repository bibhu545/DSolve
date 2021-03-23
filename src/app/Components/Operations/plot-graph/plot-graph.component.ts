import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { CheckedModel, DDLModel, UserModel, ViewDataModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, Utils } from 'src/app/Utils/Utils';
import { DefectListModel } from '../view-data/view-data.component';

@Component({
  selector: 'app-plot-graph',
  templateUrl: './plot-graph.component.html',
  styleUrls: ['./plot-graph.component.css']
})
export class PlotGraphComponent implements OnInit {

  viewForm: FormGroup;
  utils: Utils = new Utils();
  departments: DDLModel[] = [];
  defects: DDLModel[] = [];
  userData: UserModel = new UserModel();
  dateList: string[] = [];
  checkIdList: string[] = [];
  dhuList: CheckedModel[] = [];
  defectListModelData: DefectListModel[] = [];
  cumulativeList: number[] = [];
  precentageList: number[] = [];
  totalDefects: number[] = [];
  auditedPieces: number[] = [];
  totalByDefectList: number[] = [];
  showGrid = false;

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

  prepareViewForm(): void {
    this.viewForm = this.formBuilder.group({
      fromDate: new FormControl(null, [Validators.required]),
      toDate: new FormControl(''),
      deptId: new FormControl('', [Validators.required]),
    });
  }

  fetchDefectList(): void {
    this.http.getData(API_ENDPOINTS.getDefects).subscribe(response => {
      if (response) {
        this.defects = response.map(item => new DDLModel(item.name, item._id));
        response.forEach(item => {
          this.defectListModelData.push({
            defect: new DDLModel(item.name, item._id),
            amounts: []
          });
        });
      }
    }, e => {
      this.utils.showErrorMessage(e.error.message);
    });
  }

  getFormControl(name): any {
    return this.viewForm.get(name);
  }

  fetchData(data: ViewDataModel): void {
    this.dateList = [];
    this.checkIdList = [];
    this.dhuList = [];
    this.totalDefects = [];
    this.cumulativeList = [];
    this.auditedPieces = [];
    this.precentageList = [];
    this.totalByDefectList = [];
    data.userId = this.userData.userId;
    if (this.viewForm.valid) {
      const f = Object.assign(data.fromDate, {});
      data.fromDate = new Date(data.fromDate);
      let t: any;
      if (data.toDate) {
        t = Object.assign(data.toDate, {});
        data.toDate = new Date(data.toDate);
        for (const d = Object.assign(data.fromDate, {}); d <= data.toDate; d.setDate(d.getDate() + 1)) {
          this.dateList.push(d.toLocaleDateString());
        }
      }
      else {
        this.dateList.push(data.fromDate.toLocaleDateString());
        t = null;
      }
      data.fromDate = f;
      data.toDate = t;
      this.defectListModelData.forEach(dl => {
        dl.amounts = [];
        this.dateList.forEach(d => {
          dl.amounts.push(0);
        });
      });
      this.showGrid = false;
      this.http.postData(API_ENDPOINTS.getDHUByDate, data).subscribe(response => {
        if (response) {

        }
      }, e => {
        this.utils.showErrorMessage(e.error.message);
      });
    }
    else {
      this.viewForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.router.navigateByUrl('dashboard');
  }

  resetViewForm(): void {
    this.viewForm.reset();
    this.viewForm.get('deptId').setValue('');
  }

}
